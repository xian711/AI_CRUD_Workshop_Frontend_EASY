# apply-solution-checkpoint.ps1
# 講師用：把 step3 參考解的裝備模組直接套進學員專案（AI 生成進度落後時的救援路線）。
# 只覆蓋「裝備模組專屬」的 6 個檔；共用檔（useTemplateListPage / validation / csv 等）
# 學員專案複製自範本時就已存在，不動。覆蓋前先備份學員原檔到 Target\.checkpoint-backup\。

param(
    [string]$Target = (Join-Path $PSScriptRoot '..\step3_new_module\my-equipment-app')
)

$ErrorActionPreference = 'Stop'

# --- 解析路徑 ---
$SolutionApp = Join-Path $PSScriptRoot '..\step3_new_module\solution-app'

# --- 防呆：Target 必須存在且是 Nuxt 專案 ---
if (-not (Test-Path -LiteralPath $Target)) {
    Write-Host "[X] 找不到學員專案：$Target" -ForegroundColor Red
    Write-Host "    請用 -Target 指定學員專案根目錄（含 nuxt.config.ts 那層）。"
    exit 1
}
$nuxtConfig = Join-Path $Target 'nuxt.config.ts'
if (-not (Test-Path -LiteralPath $nuxtConfig)) {
    Write-Host "[X] $Target 底下沒有 nuxt.config.ts，不像 Nuxt 專案根目錄。" -ForegroundColor Red
    Write-Host "    請確認 -Target 指到專案根目錄（不是上層資料夾）。"
    exit 1
}
if (-not (Test-Path -LiteralPath $SolutionApp)) {
    Write-Host "[X] 找不到參考解：$SolutionApp" -ForegroundColor Red
    exit 1
}

# --- 要套用的 6 個裝備模組專屬檔（相對專案根目錄）---
$files = @(
    'pages\equipment\crud\index.vue',
    'pages\equipment\crud\[id].vue',
    'composables\useEquipmentItems.ts',
    'components\equipment\EquipmentFormField.vue',
    'components\equipment\EquipmentStatusBadge.vue',
    'layouts\template.vue'
)

$backupRoot = Join-Path $Target '.checkpoint-backup'
$copied = @()

Write-Host ""
Write-Host "=== 套用參考解 checkpoint ===" -ForegroundColor Cyan
Write-Host "來源：$SolutionApp"
Write-Host "目標：$Target"
Write-Host ""

foreach ($rel in $files) {
    $src = Join-Path $SolutionApp $rel
    $dst = Join-Path $Target $rel

    if (-not (Test-Path -LiteralPath $src)) {
        Write-Host "[!] 參考解缺檔，略過：$rel" -ForegroundColor Yellow
        continue
    }

    # 先備份學員原檔（若存在）
    if (Test-Path -LiteralPath $dst) {
        $bak = Join-Path $backupRoot $rel
        $bakDir = Split-Path -Parent $bak
        if (-not (Test-Path -LiteralPath $bakDir)) {
            New-Item -ItemType Directory -Path $bakDir -Force | Out-Null
        }
        Copy-Item -LiteralPath $dst -Destination $bak -Force
    }

    # 覆蓋（確保目標資料夾存在）
    $dstDir = Split-Path -Parent $dst
    if (-not (Test-Path -LiteralPath $dstDir)) {
        New-Item -ItemType Directory -Path $dstDir -Force | Out-Null
    }
    Copy-Item -LiteralPath $src -Destination $dst -Force

    $copied += $rel
    Write-Host "[OK] 已套用：$rel" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== 完成：共套用 $($copied.Count) 個檔 ===" -ForegroundColor Cyan
foreach ($c in $copied) { Write-Host "    - $c" }
Write-Host ""
if (Test-Path -LiteralPath $backupRoot) {
    Write-Host "學員原檔已備份到：$backupRoot"
}
Write-Host ""
Write-Host "下一步：" -ForegroundColor Cyan
Write-Host "  1. 回到學員專案重啟 dev server：pnpm dev"
Write-Host "  2. 開瀏覽器：http://localhost:3100/equipment/crud"
Write-Host ""
exit 0
