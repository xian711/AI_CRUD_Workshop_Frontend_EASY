<#
.SYNOPSIS
    紅→綠 LOOP 練習：把 inject-bug.ps1 注入的 bug 還原。
.DESCRIPTION
    從本資料夾的 .lab-backup\ 取回原檔，覆蓋回 solution-app，然後刪掉備份。
    若備份不存在（沒注入過或已還原），會提示：repo 乾淨時也可用 git checkout 還原。

    在 lab-red-to-green 目錄執行：
      powershell -ExecutionPolicy Bypass -File .\restore.ps1
#>
$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$labDir     = $PSScriptRoot
$targetFile = [System.IO.Path]::GetFullPath((Join-Path $labDir '..\..\step3_new_module\solution-app\pages\equipment\crud\[id].vue'))
$backupDir  = Join-Path $labDir '.lab-backup'
$backupFile = Join-Path $backupDir '[id].vue'

try {
    Write-Host '=== 還原練習 bug ===' -ForegroundColor Cyan

    if (-not [System.IO.File]::Exists($backupFile)) {
        Write-Host 'SKIP：找不到備份（.lab-backup\[id].vue）——可能沒注入過，或已經還原過了。' -ForegroundColor Yellow
        Write-Host '      若 solution-app 是 git repo 且工作區乾淨，也可以直接：' -ForegroundColor Yellow
        Write-Host '        git checkout -- step3_new_module/solution-app/pages/equipment/crud/[id].vue' -ForegroundColor Gray
        exit 0
    }

    # byte 精準覆蓋回去
    [System.IO.File]::Copy($backupFile, $targetFile, $true)
    # 刪備份與（若空）備份資料夾
    [System.IO.File]::Delete($backupFile)
    if ((Get-ChildItem -LiteralPath $backupDir -Force | Measure-Object).Count -eq 0) {
        Remove-Item -LiteralPath $backupDir -Force
    }

    Write-Host 'DONE：已從備份還原 [id].vue，並清除備份。' -ForegroundColor Green
    Write-Host ''
    Write-Host '下一步：再跑一次 E2E，確認回到 7 條全綠：' -ForegroundColor Cyan
    Write-Host '  cd ..; powershell -ExecutionPolicy Bypass -File .\run-e2e.ps1' -ForegroundColor Gray
    exit 0
}
catch {
    Write-Host ("FAIL：非預期錯誤：{0}" -f $_.Exception.Message) -ForegroundColor Red
    exit 1
}
