<#
.SYNOPSIS
    裝備物資模組 E2E 一鍵跑（EASY 版）。
.DESCRIPTION
    步驟：
      1. 確認受測 App（你的 my-equipment-app 或參考解 solution-app）在 http://localhost:3100 有回應（且是本課範本 App，非別的程式佔埠）。
      2. e2e 資料夾裝相依（node_modules 與 playwright 皆就緒才跳過 npm ci）＋確保 chromium 已裝。
      3. 跑 Playwright 7 條測試，解析輸出印 PASS/FAIL 總結，exit code 對應。
    在 step4_loop_e2e 目錄執行：
      powershell -ExecutionPolicy Bypass -File .\run-e2e.ps1
    先另開一個視窗啟動 App：
      cd ..\step3_new_module\my-equipment-app ; pnpm dev   # 或 solution-app；http://localhost:3100
    Exit code：0 = 全綠；1 = 任一 FAIL、找不到測試或非預期錯誤。
#>
$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$Port = 3100
$Expected = 7                       # EASY 版 baseline：恰好 7 條全綠才算過
$AppMarker = 'disaster-color-mode'  # 本課範本 App 的 colorMode.storageKey 前綴，用來確認 3100 是本課的 App
$e2eDir = Join-Path $PSScriptRoot 'e2e'

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

try {
    Write-Host '=== 裝備物資 E2E（EASY 版｜7 條）===' -ForegroundColor Cyan

    # 1. 目標站點必須活著且是本 App
    Write-Host "檢查 http://localhost:$Port ..." -ForegroundColor Cyan
    $alive = $false
    $hasMarker = $false
    try {
        $resp = Invoke-WebRequest -Uri "http://localhost:$Port/equipment/crud" -UseBasicParsing -TimeoutSec 5
        $alive = ($resp.StatusCode -ge 200 -and $resp.StatusCode -lt 500)
        if ($alive) { $hasMarker = ([string]$resp.Content).Contains($AppMarker) }
    } catch {}
    if (-not $alive) {
        Write-Host "FAIL：受測 App 沒在 $Port 埠回應。" -ForegroundColor Red
        Write-Host '請先啟動受測 App：cd ../step3_new_module/my-equipment-app; pnpm dev（或 solution-app）' -ForegroundColor Yellow
        exit 1
    }
    if (-not $hasMarker) {
        Write-Host "FAIL：$Port 埠有回應，但不是本 App（可能被別的程式佔用）。" -ForegroundColor Red
        Write-Host '請關掉佔用的程式，改在 3100 啟動受測 App。' -ForegroundColor Yellow
        exit 1
    }
    Write-Host "PASS：受測 App 在 $Port 埠、確認為本課的 App。" -ForegroundColor Green

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
