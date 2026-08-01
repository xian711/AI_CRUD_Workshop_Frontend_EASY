#!/usr/bin/env bash
#
# apply-solution-checkpoint.sh
# 講師用（macOS／Linux 版）：把 step3 參考解的裝備模組直接套進學員專案
# （AI 生成進度落後時的救援路線）。
#
# 只覆蓋「裝備模組專屬」的 6 個檔；共用檔（useTemplateListPage / validation / csv 等）
# 學員專案複製自範本時就已存在，不動。覆蓋前先備份學員原檔到 <Target>/.checkpoint-backup/。
#
# 用法（在 instructor 目錄）：
#   bash apply-solution-checkpoint.sh                                    # 用預設 Target
#   bash apply-solution-checkpoint.sh --target ../step3_new_module/my-equipment-app
#

set -u

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET="$SCRIPT_DIR/../step3_new_module/my-equipment-app"
SOLUTION_APP="$SCRIPT_DIR/../step3_new_module/solution-app"

if [ -t 1 ]; then
    C_RESET=$'\033[0m'; C_CYAN=$'\033[36m'; C_GREEN=$'\033[32m'
    C_YELLOW=$'\033[33m'; C_RED=$'\033[31m'
else
    C_RESET=''; C_CYAN=''; C_GREEN=''; C_YELLOW=''; C_RED=''
fi

# ── 參數 ──
while [ $# -gt 0 ]; do
    case "$1" in
        --target|-t)
            if [ $# -lt 2 ]; then
                echo "${C_RED}[X] --target 後面要接學員專案根目錄${C_RESET}"
                exit 1
            fi
            TARGET="$2"; shift 2 ;;
        --target=*)
            TARGET="${1#--target=}"; shift ;;
        -h|--help)
            echo "用法：bash apply-solution-checkpoint.sh [--target <學員專案根目錄>]"
            exit 0 ;;
        *)
            echo "${C_RED}[X] 未知參數：$1${C_RESET}"
            echo "    用法：bash apply-solution-checkpoint.sh [--target <學員專案根目錄>]"
            exit 1 ;;
    esac
done

# ── 防呆：Target 必須存在且是 Nuxt 專案 ──
if [ ! -d "$TARGET" ]; then
    echo "${C_RED}[X] 找不到學員專案：$TARGET${C_RESET}"
    echo "    請用 --target 指定學員專案根目錄（含 nuxt.config.ts 那層）。"
    exit 1
fi
if [ ! -f "$TARGET/nuxt.config.ts" ]; then
    echo "${C_RED}[X] $TARGET 底下沒有 nuxt.config.ts，不像 Nuxt 專案根目錄。${C_RESET}"
    echo "    請確認 --target 指到專案根目錄（不是上層資料夾）。"
    exit 1
fi
if [ ! -d "$SOLUTION_APP" ]; then
    echo "${C_RED}[X] 找不到參考解：$SOLUTION_APP${C_RESET}"
    exit 1
fi

# ── 要套用的 6 個裝備模組專屬檔（相對專案根目錄）──
FILES="pages/equipment/crud/index.vue
pages/equipment/crud/[id].vue
composables/useEquipmentItems.ts
components/equipment/EquipmentFormField.vue
components/equipment/EquipmentStatusBadge.vue
layouts/template.vue"

BACKUP_ROOT="$TARGET/.checkpoint-backup"
copied=""
copied_count=0

echo ""
echo "${C_CYAN}=== 套用參考解 checkpoint ===${C_RESET}"
echo "來源：$SOLUTION_APP"
echo "目標：$TARGET"
echo ""

while IFS= read -r rel; do
    [ -n "$rel" ] || continue
    src="$SOLUTION_APP/$rel"
    dst="$TARGET/$rel"

    if [ ! -f "$src" ]; then
        echo "${C_YELLOW}[!] 參考解缺檔，略過：$rel${C_RESET}"
        continue
    fi

    # 先備份學員原檔（若存在）
    if [ -f "$dst" ]; then
        bak="$BACKUP_ROOT/$rel"
        mkdir -p "$(dirname "$bak")"
        cp "$dst" "$bak"
    fi

    # 覆蓋（確保目標資料夾存在）
    mkdir -p "$(dirname "$dst")"
    cp "$src" "$dst"

    copied="$copied    - $rel"$'\n'
    copied_count=$((copied_count + 1))
    echo "${C_GREEN}[OK] 已套用：$rel${C_RESET}"
done <<EOF
$FILES
EOF

echo ""
echo "${C_CYAN}=== 完成：共套用 $copied_count 個檔 ===${C_RESET}"
printf '%s' "$copied"
echo ""
if [ -d "$BACKUP_ROOT" ]; then
    echo "學員原檔已備份到：$BACKUP_ROOT"
fi
echo ""
echo "${C_CYAN}下一步：${C_RESET}"
echo "  1. 回到學員專案重啟 dev server：pnpm dev"
echo "  2. 開瀏覽器：http://localhost:3100/equipment/crud"
echo ""
exit 0
