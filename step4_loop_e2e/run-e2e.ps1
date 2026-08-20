<#
.SYNOPSIS
    裝備物資模組 E2E 一鍵跑（EASY 版）。
.DESCRIPTION
    步驟：
      0. 【意外修改偵測】比對 E2E 測試檔的 SHA-256 與 tests.sha256 基準，不符就拒絕執行。
         這是 fail-closed：基準檔不見了、被清空、格式壞掉、少項、多項、重複、
         hash 不是 64 位十六進位——任何一種都判 FAIL，絕不因為「讀不到東西」就放行。
         老實說清楚它擋得住什麼：它擋得住「改了測試卻忘了同步基準」，
         也擋得住多數順手放寬斷言的情況；但它擋不住「有寫入權限、且刻意連基準一起重算」的人，
         因為腳本、測試、基準都在同一份學員可寫的副本裡。
         要真的防蓄意作弊，可信基準與評測器必須放在學員改不到的地方（講師端／CI）。
      1. 確認受測 App（你的 my-equipment-app 或參考解 solution-app）在受測網址有回應
         （且是本課範本 App，非別的程式佔埠）。
      2. e2e 資料夾裝相依（node_modules 與 playwright 皆就緒才跳過 npm ci）＋確保 chromium 已裝。
      3. 跑 Playwright 7 條測試，解析輸出印 PASS/FAIL 總結，exit code 對應。

    在 step4_loop_e2e 目錄執行：
      powershell -ExecutionPolicy Bypass -File .\run-e2e.ps1
    先另開一個視窗啟動 App：
      cd ..\step3_new_module\my-equipment-app ; pnpm dev   # 或 solution-app；http://localhost:3100

    埠不再寫死：預設 3100，要換埠就設環境變數（受測 App 也要用同一個埠啟動）。
    playwright.config.ts 讀的是同一組變數，所以測試打的網址一定跟這裡檢查的一致。
      $env:PORT = '3200'                        # 只換埠
      $env:BASE_URL = 'http://127.0.0.1:3200'   # 或整段換掉網址

    Exit code：0 = 全綠；1 = 測試檔與基準不符、任一 FAIL、找不到測試或非預期錯誤。
#>
$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$Port = if ($env:PORT) { [int]$env:PORT } else { 3100 }
$BaseUrl = if ($env:BASE_URL) { $env:BASE_URL.TrimEnd('/') } else { "http://localhost:$Port" }
$Expected = 7                       # EASY 版 baseline：恰好 7 條全綠才算過
$AppMarker = 'disaster-color-mode'  # 本課範本 App 的 colorMode.storageKey 前綴，用來確認受測網址跑的是本課的 App
$e2eDir = Join-Path $PSScriptRoot 'e2e'
$HashManifest = Join-Path $PSScriptRoot 'tests.sha256'
# 基準檔必須「恰好」涵蓋這幾個檔：少一個、多一個、重複，都判 FAIL
$ProtectedFiles = @('e2e/tests/equipment.spec.ts', 'e2e/playwright.config.ts')
# 重算基準的講師工具（訊息一律印絕對路徑，免得學員從不同目錄執行時對不上）
$UpdateHashPs1 = Join-Path (Split-Path -Parent $PSScriptRoot) 'instructor\update-e2e-hash.ps1'

# 以本地 EAP=Continue 跑原生指令（npm/npx），避免 PowerShell 5.1 把 stderr 文字誤判為終止錯誤。
function Invoke-Native {
    param([scriptblock] $Command, [ref] $ExitCode)
    $prev = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    try {
        $out = & $Command | ForEach-Object { $_.ToString() }
        $ExitCode.Value = $LASTEXITCODE
    } finally {
        $ErrorActionPreference = $prev
    }
    if ($out) { $out | ForEach-Object { Write-Host $_ } }
    return $out
}

# 內容雜湊：先去掉 CR，讓 CRLF / LF 的差異不影響結果（跨平台同一個值）
function Get-NormalizedSha256 {
    param([string] $Path)
    $bytes = [System.IO.File]::ReadAllBytes($Path)
    $filtered = New-Object 'System.Collections.Generic.List[byte]'
    foreach ($b in $bytes) { if ($b -ne 13) { [void]$filtered.Add($b) } }
    $sha = [System.Security.Cryptography.SHA256]::Create()
    try { $hash = $sha.ComputeHash($filtered.ToArray()) } finally { $sha.Dispose() }
    return (($hash | ForEach-Object { $_.ToString('x2') }) -join '')
}

try {
    Write-Host '=== 裝備物資 E2E（EASY 版｜7 條）===' -ForegroundColor Cyan

    # 0. 意外修改偵測（fail-closed：任何一種「讀不出正確基準」的狀況都判 FAIL）
    Write-Host '檢查 E2E 測試檔與基準是否相符...' -ForegroundColor Cyan
    $problems = @()

    if (-not (Test-Path $HashManifest)) {
        $problems += "找不到基準檔：$HashManifest"
    } else {
        $seen = @{}
        $lineNo = 0
        foreach ($line in (Get-Content -LiteralPath $HashManifest)) {
            $lineNo++
            $trimmed = $line.Trim()
            if ($trimmed -eq '' -or $trimmed.StartsWith('#')) { continue }
            # 格式必須是「64 位小寫十六進位 + 空白 + 路徑」，不合就 FAIL（不再默默跳過）
            if ($trimmed -notmatch '^([0-9a-fA-F]{64})\s+(\S.*)$') {
                $problems += "基準檔第 $lineNo 行格式不合（應為 64 位 hex ＋ 空白 ＋ 路徑）：$trimmed"
                continue
            }
            $expectedHash = $Matches[1].ToLower()
            $rel = $Matches[2].Trim() -replace '\\', '/'
            if ($seen.ContainsKey($rel)) { $problems += "基準檔第 $lineNo 行：$rel 重複列出"; continue }
            $seen[$rel] = $expectedHash
            if ($ProtectedFiles -notcontains $rel) {
                $problems += "基準檔第 $lineNo 行：$rel 不在受保護清單內（多出來的項目）"
            }
        }
        # 少一項也不行——基準檔被清空或只留註解，會在這裡被抓到
        foreach ($rel in $ProtectedFiles) {
            if (-not $seen.ContainsKey($rel)) { $problems += "基準檔缺少必要項目：$rel" }
        }
        # 逐檔比對
        foreach ($rel in $ProtectedFiles) {
            if (-not $seen.ContainsKey($rel)) { continue }
            $full = Join-Path $PSScriptRoot ($rel -replace '/', '\')
            if (-not (Test-Path $full)) { $problems += "$rel（檔案不見了）"; continue }
            if ((Get-NormalizedSha256 -Path $full) -ne $seen[$rel]) { $problems += "$rel（內容與基準不符）" }
        }
    }

    if ($problems.Count -gt 0) {
        Write-Host 'FAIL：E2E 測試檔的完整性檢查沒過，拒絕執行。' -ForegroundColor Red
        foreach ($t in $problems) { Write-Host "  - $t" -ForegroundColor Red }
        Write-Host ''
        Write-Host '這一關在做的是「意外修改偵測」：確認你手上的測試，跟講師發出來的那一份是同一份。' -ForegroundColor Yellow
        Write-Host '要改 App 請隨意；測試不要動。若你認為測試本身真的有問題，停下來回報，由人裁決。' -ForegroundColor Yellow
        Write-Host '（講師確定要改測試的話，改完跑這一支重算基準：）' -ForegroundColor Yellow
        Write-Host "  powershell -ExecutionPolicy Bypass -File `"$UpdateHashPs1`"" -ForegroundColor Yellow
        exit 1
    }
    Write-Host 'PASS：測試檔與基準相符。' -ForegroundColor Green

    # 1. 目標站點必須活著且是本 App
    Write-Host "檢查 $BaseUrl ..." -ForegroundColor Cyan
    $alive = $false
    $hasMarker = $false
    try {
        $resp = Invoke-WebRequest -Uri "$BaseUrl/equipment/crud" -UseBasicParsing -TimeoutSec 5
        $alive = ($resp.StatusCode -ge 200 -and $resp.StatusCode -lt 500)
        if ($alive) { $hasMarker = ([string]$resp.Content).Contains($AppMarker) }
    } catch {}
    if (-not $alive) {
        Write-Host "FAIL：受測 App 沒在 $BaseUrl 回應。" -ForegroundColor Red
        $appDir = Join-Path (Split-Path -Parent $PSScriptRoot) 'step3_new_module\my-equipment-app'
        Write-Host '請先啟動受測 App（絕對路徑，從哪個目錄執行都對得上）：' -ForegroundColor Yellow
        Write-Host "  cd `"$appDir`" ; pnpm dev" -ForegroundColor Yellow
        Write-Host '  （還沒做 step3 的話，改用參考解 step3_new_module\solution-app）' -ForegroundColor Yellow
        Write-Host '（若你把 App 開在別的埠，記得先設 $env:PORT 或 $env:BASE_URL 再跑這支腳本。）' -ForegroundColor Yellow
        exit 1
    }
    if (-not $hasMarker) {
        Write-Host "FAIL：$BaseUrl 有回應，但不是本課的 App（可能被別的程式佔用）。" -ForegroundColor Red
        Write-Host "請關掉佔用的程式，改在 $BaseUrl 啟動受測 App。" -ForegroundColor Yellow
        exit 1
    }
    Write-Host "PASS：受測 App 在 $BaseUrl、確認為本課的 App。" -ForegroundColor Green

    # 2. 相依：node_modules 存在「且」playwright CLI 也在，才跳過 npm ci（半套安裝一律重裝）
    $depsReady = (Test-Path (Join-Path $e2eDir 'node_modules')) -and `
                 (Test-Path (Join-Path $e2eDir 'node_modules\.bin\playwright.cmd'))
    if (-not $depsReady) {
        Write-Host '安裝 e2e 相依（npm ci）...' -ForegroundColor Cyan
        Push-Location $e2eDir
        try {
            $ec = 0
            Invoke-Native -Command { & npm ci 2>&1 } -ExitCode ([ref]$ec) | Out-Null
            if ($ec -ne 0) { throw "npm ci 失敗（$e2eDir）" }
        } finally { Pop-Location }
    } else {
        Write-Host 'node_modules 與 playwright 皆就緒，跳過 npm ci。' -ForegroundColor DarkGray
    }

    # 2b. 確保 chromium 瀏覽器已裝（冪等；已裝很快返回）。非 0 一律紅，絕不對半套環境跑測試。
    Write-Host '確保 Playwright chromium 已安裝...' -ForegroundColor Cyan
    Push-Location $e2eDir
    try {
        $bec = 0
        Invoke-Native -Command { & npx playwright install chromium 2>&1 } -ExitCode ([ref]$bec) | Out-Null
        if ($bec -ne 0) { throw "playwright install chromium 失敗（exit $bec）" }
    } finally { Pop-Location }

    # 3. 跑測試
    Write-Host 'Running Playwright（chromium）...' -ForegroundColor Cyan
    Push-Location $e2eDir
    $exit = 0
    try {
        $testOutput = Invoke-Native -Command { & npx playwright test 2>&1 } -ExitCode ([ref]$exit)
    } finally { Pop-Location }

    # 解析 list reporter 總結（取最後一次匹配，避免測試 log 內含 "n passed" 誤判）
    $joined = ($testOutput -join "`n")
    $noTests = ($joined -match 'No tests found')
    $passed = $null
    $failed = $null
    $pm = [regex]::Matches($joined, '(\d+)\s+passed')
    if ($pm.Count -gt 0) { $passed = [int]$pm[$pm.Count - 1].Groups[1].Value }
    $fm = [regex]::Matches($joined, '(\d+)\s+failed')
    if ($fm.Count -gt 0) { $failed = [int]$fm[$fm.Count - 1].Groups[1].Value }
    if ($null -eq $failed -and $null -ne $passed) { $failed = 0 }
    # skipped / flaky：出現任一即視為未達「恰好 7 條乾淨全綠」，一律紅
    $skipped = 0
    $sm = [regex]::Matches($joined, '(\d+)\s+skipped')
    if ($sm.Count -gt 0) { $skipped = [int]$sm[$sm.Count - 1].Groups[1].Value }
    $flaky = 0
    $km = [regex]::Matches($joined, '(\d+)\s+flaky')
    if ($km.Count -gt 0) { $flaky = [int]$km[$km.Count - 1].Groups[1].Value }

    # 4. 判定（不確定一律 FAIL，絕不假綠）：passed 必須「恰好等於」7，且無 failed/skipped/flaky
    Write-Host ''
    $verdictPass = $false
    $reason = ''
    if ($noTests) {
        $reason = '找不到任何測試。'
    } elseif ($exit -ne 0) {
        $reason = "測試程序 exit code = $exit。"
    } elseif ($null -eq $passed) {
        $reason = 'exit 0 但抓不到 Playwright 總結行（無法確認全綠）。'
    } elseif ($failed -ne 0) {
        $reason = "有 $failed 條紅。"
    } elseif ($skipped -ne 0) {
        $reason = "有 $skipped 條被略過（skipped）——未真正驗到，視為不過。"
    } elseif ($flaky -ne 0) {
        $reason = "有 $flaky 條 flaky（重試才過）——不穩定，視為不過。"
    } elseif ($passed -ne $Expected) {
        $reason = "綠了 $passed 條（應恰為 $Expected 條）。"
    } else {
        $verdictPass = $true
    }

    if ($verdictPass) {
        Write-Host "E2E 全綠：$passed 條 passed / $failed 條 failed / $skipped 條 skipped。" -ForegroundColor Green
        exit 0
    } else {
        Write-Host "E2E FAIL：$reason" -ForegroundColor Red
        exit 1
    }
}
catch {
    Write-Host ("FAIL：非預期錯誤：{0}" -f $_.Exception.Message) -ForegroundColor Red
    exit 1
}
