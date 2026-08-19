<#
.SYNOPSIS
    課程回饋問卷 — 一鍵驗收（EASY 版課後題）。
.DESCRIPTION
    把 step6_survey/README.md「③ 驗收」那張清單自動跑一遍：
      S1  必填留空按送出 → 欄位下方紅字、聚焦第一個錯誤欄、不離頁
      S2  正常填完送出   → 成功訊息、寫入 1 筆、可以再填一份
      S3  連點送出鈕     → 只送出一筆（防重複）
      S4  送出後重整     → 資料還在（localStorage）
      S5  管理頁         → 看得到剛才那一筆
      S6  沒有回覆時     → 顯示空狀態，不是空表格
      S7  匯出 CSV       → 檔名含日期、含 UTF-8 BOM、中文不亂碼
      S8  清空全部       → 二次確認，且確認鈕寫明動作
      S9  手機 390px     → 每題可填、無橫向捲軸、能送出
      S10 硬編碼色碼掃描 → 你新增的檔案裡不該有 hex 色碼（這一項由本腳本靜態掃描）

    第 11 項（無痕視窗看不到別人的回覆）刻意不自動化——
    那一題的重點就是「你要親眼看到 localStorage 的邊界」，腳本代勞就沒意義了。

    用法（在 step6_survey 目錄執行）：
      powershell -ExecutionPolicy Bypass -File .\run-survey-e2e.ps1
    先另開一個視窗啟動你的問卷 App：
      cd my-survey-app ; pnpm dev

    埠不寫死：預設 3100，可用環境變數覆寫（App 也要用同一個埠啟動）
      $env:PORT = '3200'
      $env:BASE_URL = 'http://127.0.0.1:3200'

    要掃描別的資料夾（預設 my-survey-app）：
      powershell -ExecutionPolicy Bypass -File .\run-survey-e2e.ps1 -AppDir my-survey-app

    Exit code：0 = S1~S10 全過；1 = 任一項沒過、找不到 App 或非預期錯誤。
#>
param(
    [string] $AppDir = 'my-survey-app'
)

$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$Port = if ($env:PORT) { [int]$env:PORT } else { 3100 }
$BaseUrl = if ($env:BASE_URL) { $env:BASE_URL.TrimEnd('/') } else { "http://localhost:$Port" }
$Expected = 9                      # Playwright 的 S1~S9；S10 由本腳本自己算
$e2eDir = Join-Path $PSScriptRoot 'e2e'
$appPath = if ([System.IO.Path]::IsPathRooted($AppDir)) { $AppDir } else { Join-Path $PSScriptRoot $AppDir }

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
    Write-Host '=== 課程回饋問卷 一鍵驗收（S1~S10）===' -ForegroundColor Cyan

    # ── 1. 站點必須活著 ──
    Write-Host "檢查 $BaseUrl/survey ..." -ForegroundColor Cyan
    $alive = $false
    try {
        $resp = Invoke-WebRequest -Uri "$BaseUrl/survey" -UseBasicParsing -TimeoutSec 5
        $alive = ($resp.StatusCode -ge 200 -and $resp.StatusCode -lt 500)
    } catch {}
    if (-not $alive) {
        Write-Host "FAIL：你的問卷 App 沒在 $BaseUrl 回應。" -ForegroundColor Red
        Write-Host "請先啟動：cd $AppDir ; pnpm dev" -ForegroundColor Yellow
        Write-Host '（開在別的埠的話，先設 $env:PORT 或 $env:BASE_URL 再跑這支腳本。）' -ForegroundColor Yellow
        exit 1
    }
    Write-Host "PASS：問卷 App 在 $BaseUrl 有回應。" -ForegroundColor Green

    # ── 2. 相依 ──
    $depsReady = (Test-Path (Join-Path $e2eDir 'node_modules')) -and `
                 (Test-Path (Join-Path $e2eDir 'node_modules\.bin\playwright.cmd'))
    if (-not $depsReady) {
        Write-Host '安裝驗收腳本的相依（npm install）...' -ForegroundColor Cyan
        Push-Location $e2eDir
        try {
            $ec = 0
            Invoke-Native -Command { & npm install --no-audit --no-fund 2>&1 } -ExitCode ([ref]$ec) | Out-Null
            if ($ec -ne 0) { throw "npm install 失敗（$e2eDir）" }
        } finally { Pop-Location }
    } else {
        Write-Host 'node_modules 與 playwright 皆就緒，跳過安裝。' -ForegroundColor DarkGray
    }

    Write-Host '確保 Playwright chromium 已安裝...' -ForegroundColor Cyan
    Push-Location $e2eDir
    try {
        $bec = 0
        Invoke-Native -Command { & npx playwright install chromium 2>&1 } -ExitCode ([ref]$bec) | Out-Null
        if ($bec -ne 0) { throw "playwright install chromium 失敗（exit $bec）" }
    } finally { Pop-Location }

    # ── 3. 跑 S1~S9 ──
    Write-Host 'Running Playwright（chromium）...' -ForegroundColor Cyan
    Push-Location $e2eDir
    $exit = 0
    try {
        $testOutput = Invoke-Native -Command { & npx playwright test 2>&1 } -ExitCode ([ref]$exit)
    } finally { Pop-Location }

    $joined = ($testOutput -join "`n")
    $noTests = ($joined -match 'No tests found')
    $passed = $null; $failed = $null
    $pm = [regex]::Matches($joined, '(\d+)\s+passed')
    if ($pm.Count -gt 0) { $passed = [int]$pm[$pm.Count - 1].Groups[1].Value }
    $fm = [regex]::Matches($joined, '(\d+)\s+failed')
    if ($fm.Count -gt 0) { $failed = [int]$fm[$fm.Count - 1].Groups[1].Value }
    if ($null -eq $failed -and $null -ne $passed) { $failed = 0 }
    $skipped = 0
    $sm = [regex]::Matches($joined, '(\d+)\s+skipped')
    if ($sm.Count -gt 0) { $skipped = [int]$sm[$sm.Count - 1].Groups[1].Value }

    $browserPass = $false
    $browserReason = ''
    if ($noTests) { $browserReason = '找不到任何測試。' }
    elseif ($exit -ne 0) { $browserReason = "測試程序 exit code = $exit。" }
    elseif ($null -eq $passed) { $browserReason = 'exit 0 但抓不到 Playwright 總結行。' }
    elseif ($failed -ne 0) { $browserReason = "有 $failed 條紅。" }
    elseif ($skipped -ne 0) { $browserReason = "有 $skipped 條被略過。" }
    elseif ($passed -ne $Expected) { $browserReason = "綠了 $passed 條（應恰為 $Expected 條）。" }
    else { $browserPass = $true }

    # ── 4. S10：硬編碼色碼靜態掃描 ──
    Write-Host ''
    Write-Host 'S10 硬編碼色碼掃描...' -ForegroundColor Cyan
    $s10Pass = $false
    $s10Reason = ''
    if (-not (Test-Path $appPath)) {
        $s10Reason = "找不到 $AppDir（用 -AppDir 指定你的問卷專案資料夾）。"
    } else {
        # 只掃「你新增的檔」：pages/survey、components/survey、composables 裡問卷相關的檔。
        # 不掃 token 正本（assets/css）、規則文件與 SVG——那些本來就該有色碼，那是唯一來源。
        $targets = @()
        foreach ($rel in @('pages\survey', 'components\survey', 'composables')) {
            $dir = Join-Path $appPath $rel
            if (Test-Path $dir) {
                $targets += Get-ChildItem -Path $dir -Recurse -File -Include *.vue, *.ts -ErrorAction SilentlyContinue |
                            Where-Object { $_.FullName -notmatch '\\node_modules\\|\\\.nuxt\\|\\\.output\\' }
            }
        }
        # composables 底下只挑跟問卷有關的（避免掃到直接共用、本來就存在的範本檔）
        $targets = $targets | Where-Object { $_.FullName -notmatch '\\composables\\' -or $_.Name -match 'urvey' }

        if ($targets.Count -eq 0) {
            $s10Reason = "在 $AppDir 找不到你新增的問卷檔（預期 pages\survey\*.vue 之類）。"
        } else {
            $hits = $targets | Select-String -Pattern '#[0-9a-fA-F]{3,8}\b' -ErrorAction SilentlyContinue
            if ($hits) {
                $s10Reason = "找到 $($hits.Count) 處硬編碼色碼："
                foreach ($h in $hits | Select-Object -First 10) {
                    $s10Reason += "`n    $($h.Path):$($h.LineNumber)  $($h.Line.Trim())"
                }
            } else {
                $s10Pass = $true
                Write-Host ("  掃了 {0} 個新增檔，0 處硬編碼色碼。" -f $targets.Count) -ForegroundColor Green
            }
        }
    }

    # ── 5. 總結 ──
    Write-Host ''
    Write-Host '──────── 驗收總結 ────────' -ForegroundColor Cyan
    if ($browserPass) {
        Write-Host "S1~S9（瀏覽器實跑）：全過（$passed 條 passed）" -ForegroundColor Green
    } else {
        Write-Host "S1~S9（瀏覽器實跑）：未過——$browserReason" -ForegroundColor Red
    }
    if ($s10Pass) {
        Write-Host 'S10（硬編碼色碼）：過' -ForegroundColor Green
    } else {
        Write-Host "S10（硬編碼色碼）：未過——$s10Reason" -ForegroundColor Red
    }
    Write-Host ''
    Write-Host '⚠ 第 11 項要你自己做一次：開無痕視窗填一筆，回原本的視窗看 /survey/admin，' -ForegroundColor Yellow
    Write-Host '  應該「看不到」那一筆。這證明了這一版沒有後端、收不到別人裝置的回覆。' -ForegroundColor Yellow

    if ($browserPass -and $s10Pass) {
        Write-Host ''
        Write-Host '驗收全過。' -ForegroundColor Green
        exit 0
    } else {
        Write-Host ''
        Write-Host '驗收未過，照上面的原因逐項修。' -ForegroundColor Red
        exit 1
    }
}
catch {
    Write-Host ("FAIL：非預期錯誤：{0}" -f $_.Exception.Message) -ForegroundColor Red
    exit 1
}
