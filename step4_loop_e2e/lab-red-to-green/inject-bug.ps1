<#
.SYNOPSIS
    紅→綠 LOOP 練習：對 solution-app 注入「一個可控真實 bug」。
.DESCRIPTION
    做法：把明細頁 [id].vue 裡「分類 categoryKey 必填」的驗證規則拿掉。
    效果：新增品項直接按儲存時，不再出現「請選擇分類」欄位錯誤 → E4 這條 E2E 會變紅。

    安全機制：
      - 改檔前先把原檔完整備份到本資料夾的 .lab-backup\（byte 精準複製）。
      - 用「精準字串替換」，找不到目標字串就 exit 1（多半是已注入過，或檔案被改過）。
      - 還原請跑 restore.ps1。

    在 lab-red-to-green 目錄執行：
      powershell -ExecutionPolicy Bypass -File .\inject-bug.ps1
.NOTES
    只動 solution-app 的 pages\equipment\crud\[id].vue；不碰其他檔。
#>
$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# ── 路徑（[id].vue 含中括號，全程用字面路徑，不讓 PowerShell 當萬用字元展開）──
$labDir     = $PSScriptRoot
$targetFile = [System.IO.Path]::GetFullPath((Join-Path $labDir '..\..\step3_new_module\solution-app\pages\equipment\crud\[id].vue'))
$backupDir  = Join-Path $labDir '.lab-backup'
$backupFile = Join-Path $backupDir '[id].vue'

# ── 精準字串替換：拿掉 categoryKey 必填規則 ──
$target      = "    categoryKey: [{ required: true, message: '請選擇分類' }],"
$replacement = "    categoryKey: [],"

try {
    Write-Host '=== 注入練習 bug：移除「分類必填」驗證 ===' -ForegroundColor Cyan

    if (-not [System.IO.File]::Exists($targetFile)) {
        Write-Host "FAIL：找不到目標檔：$targetFile" -ForegroundColor Red
        exit 1
    }

    $utf8 = [System.Text.Encoding]::UTF8
    $text = [System.IO.File]::ReadAllText($targetFile, $utf8)

    # 已注入偵測：目標不在、但替換後字樣已在 → 多半已注入過
    if (-not $text.Contains($target)) {
        if ($text.Contains($replacement)) {
            Write-Host 'SKIP：看起來已經注入過了（找不到原始的必填規則，卻找到被拿掉後的樣子）。' -ForegroundColor Yellow
            Write-Host '      要回到乾淨狀態請先跑：powershell -ExecutionPolicy Bypass -File .\restore.ps1' -ForegroundColor Yellow
        } else {
            Write-Host 'FAIL：找不到要替換的目標字串（categoryKey 必填規則那一行）。' -ForegroundColor Red
            Write-Host '      可能檔案已被改過，或已注入過。請確認 [id].vue 是乾淨參考解狀態。' -ForegroundColor Yellow
        }
        exit 1
    }

    # 改檔前先 byte 精準備份原檔
    if (-not (Test-Path -LiteralPath $backupDir)) {
        New-Item -ItemType Directory -Path $backupDir | Out-Null
    }
    [System.IO.File]::Copy($targetFile, $backupFile, $true)

    # 精準替換並寫回（維持 UTF-8 無 BOM，與原檔一致）
    $patched = $text.Replace($target, $replacement)
    $noBom   = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($targetFile, $patched, $noBom)

    Write-Host 'DONE：已移除「分類必填」驗證規則。' -ForegroundColor Green
    Write-Host "      原檔已備份到：$backupFile" -ForegroundColor DarkGray
    Write-Host ''
    Write-Host '下一步：' -ForegroundColor Cyan
    Write-Host '  1. 確認 solution-app dev server 還開著（http://localhost:3100）。' -ForegroundColor Gray
    Write-Host '  2. 跑 E2E 看它變紅：' -ForegroundColor Gray
    Write-Host '       cd ..; powershell -ExecutionPolicy Bypass -File .\run-e2e.ps1' -ForegroundColor Gray
    Write-Host '     預期 E4（表單驗證）會紅，訊息大意是等不到「請選擇分類」。' -ForegroundColor Gray
    Write-Host '  3. 練完還原：powershell -ExecutionPolicy Bypass -File .\restore.ps1' -ForegroundColor Gray
    exit 0
}
catch {
    Write-Host ("FAIL：非預期錯誤：{0}" -f $_.Exception.Message) -ForegroundColor Red
    exit 1
}
