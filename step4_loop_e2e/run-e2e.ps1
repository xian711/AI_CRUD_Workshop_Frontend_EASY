<#
.SYNOPSIS
    裝備物資模組 E2E 一鍵跑（EASY 版）。
.DESCRIPTION
    步驟：
      0. 比對 E2E 測試檔的 SHA-256 與 tests.sha256 基準；被改過就直接拒絕執行
         （防「為了讓燈變綠去改測試」這種作弊；不依賴環境有沒有 git）。
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

    Exit code：0 = 全綠；1 = 測試檔被動過、任一 FAIL、找不到測試或非預期錯誤。
#>
$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$Port = if ($env:PORT) { [int]$env:PORT } else { 3100 }
$BaseUrl = if ($env:BASE_URL) { $env:BASE_URL.TrimEnd('/') } else { "http://localhost:$Port" }
$Expected = 7                       # EASY 版 baseline：恰好 7 條全綠才算過
$AppMarker = 'disaster-color-mode'  # 本課範本 App 的 colorMode.storageKey 前綴，用來確認受測網址跑的是本課的 App
$e2eDir = Join-Path $PSScriptRoot 'e2e'
$HashManifest = Join-Path $PSScriptRoot 'tests.sha256'

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

    # 0. 測試檔完整性
    Write-Host '檢查 E2E 測試檔有沒有被改過...' -ForegroundColor Cyan
    if (-not (Test-Path $HashManifest)) {
        Write-Host "FAIL：找不到雜湊基準檔 $HashManifest。" -ForegroundColor Red
        Write-Host '請講師執行：powershell -ExecutionPolicy Bypass -File ..\instructor\update-e2e-hash.ps1' -ForegroundColor Yellow
        exit 1
    }
    $tamper = @()
    foreach ($line in (Get-Content -LiteralPath $HashManifest)) {
        $trimmed = $line.Trim()
        if ($trimmed -eq '' -or $trimmed.StartsWith('#')) { continue }
        $parts = $trimmed -split '\s+', 2
        if ($parts.Count -ne 2) { continue }
        $expectedHash = $parts[0].ToLower()
        $rel = $parts[1].Trim()
        $full = Join-Path $PSScriptRoot ($rel -replace '/', '\')
        if (-not (Test-Path $full)) { $tamper += "$rel（檔案不見了）"; continue }
        if ((Get-NormalizedSha256 -Path $full) -ne $expectedHash) { $tamper += "$rel（內容被改過）" }
    }
    if ($tamper.Count -gt 0) {
        Write-Host 'FAIL：E2E 測試檔與基準不符，拒絕執行。' -ForegroundColor Red
        foreach ($t in $tamper) { Write-Host "  - $t" -ForegroundColor Red }
        Write-Host ''
        Write-Host '這條防線是刻意的：LOOP 為了讓燈變綠，最常見的作弊就是放寬斷言或跳過測試。' -ForegroundColor Yellow
        Write-Host '要改 App 請隨意；測試不准動。若你認為測試本身真的有問題，停下來回報，由人裁決。' -ForegroundColor Yellow
        Write-Host '（講師確定要改測試的話，改完跑 instructor\update-e2e-hash.ps1 重算基準。）' -ForegroundColor Yellow
        exit 1
    }
    Write-Host 'PASS：測試檔與基準相符，沒有被動過。' -ForegroundColor Green

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
        Write-Host '請先啟動受測 App：cd ../step3_new_module/my-equipment-app; pnpm dev（或 solution-app）' -ForegroundColor Yellow
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
