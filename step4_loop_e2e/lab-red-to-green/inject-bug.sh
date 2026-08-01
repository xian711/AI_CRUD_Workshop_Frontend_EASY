#!/usr/bin/env bash
#
# inject-bug.sh
# 紅→綠 LOOP 練習：對 solution-app 注入「一個可控真實 bug」（macOS／Linux 版）
#
# 做法：把明細頁 [id].vue 裡「分類 categoryKey 必填」的驗證規則拿掉。
# 效果：新增品項直接按儲存時，不再出現「請選擇分類」欄位錯誤 → E4 這條 E2E 會變紅。
#
# 安全機制：
#   - 改檔前先把原檔完整備份到本資料夾的 .lab-backup/。
#   - 用「整行精準比對」替換，找不到目標就 exit 1（多半是已注入過，或檔案被改過）。
#   - 還原請跑 restore.sh。
#
# 在 lab-red-to-green 目錄執行：
#   bash inject-bug.sh
#
# 只動 solution-app 的 pages/equipment/crud/[id].vue；不碰其他檔。
#

set -u

LAB_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET_FILE="$LAB_DIR/../../step3_new_module/solution-app/pages/equipment/crud/[id].vue"
BACKUP_DIR="$LAB_DIR/.lab-backup"
BACKUP_FILE="$BACKUP_DIR/[id].vue"

# ── 精準整行替換：拿掉 categoryKey 必填規則 ──
TARGET="    categoryKey: [{ required: true, message: '請選擇分類' }],"
REPLACEMENT="    categoryKey: [],"

if [ -t 1 ]; then
    C_RESET=$'\033[0m'; C_CYAN=$'\033[36m'; C_GREEN=$'\033[32m'
    C_YELLOW=$'\033[33m'; C_RED=$'\033[31m'; C_GRAY=$'\033[90m'
else
    C_RESET=''; C_CYAN=''; C_GREEN=''; C_YELLOW=''; C_RED=''; C_GRAY=''
fi

echo "${C_CYAN}=== 注入練習 bug：移除「分類必填」驗證 ===${C_RESET}"

if [ ! -f "$TARGET_FILE" ]; then
    echo "${C_RED}FAIL：找不到目標檔：$TARGET_FILE${C_RESET}"
    exit 1
fi

# ── 已注入偵測：目標不在、但替換後字樣已在 → 多半已注入過 ──
if ! grep -qF -- "$TARGET" "$TARGET_FILE"; then
    if grep -qF -- "$REPLACEMENT" "$TARGET_FILE"; then
        echo "${C_YELLOW}SKIP：看起來已經注入過了（找不到原始的必填規則，卻找到被拿掉後的樣子）。${C_RESET}"
        echo "${C_YELLOW}      要回到乾淨狀態請先跑：bash restore.sh${C_RESET}"
    else
        echo "${C_RED}FAIL：找不到要替換的目標字串（categoryKey 必填規則那一行）。${C_RESET}"
        echo "${C_YELLOW}      可能檔案已被改過，或已注入過。請確認 [id].vue 是乾淨參考解狀態。${C_RESET}"
    fi
    exit 1
fi

# ── 改檔前先備份原檔 ──
mkdir -p "$BACKUP_DIR" || { echo "${C_RED}FAIL：無法建立備份資料夾：$BACKUP_DIR${C_RESET}"; exit 1; }
cp "$TARGET_FILE" "$BACKUP_FILE" || { echo "${C_RED}FAIL：備份失敗${C_RESET}"; exit 1; }

# ── 整行精準替換並寫回（維持原檔 inode 與權限；CRLF 檔案也保留原換行）──
TMP_PATCHED="$(mktemp -t easy-lab-patch.XXXXXX)"
trap 'rm -f "$TMP_PATCHED"' EXIT

awk -v target="$TARGET" -v repl="$REPLACEMENT" '
{
    line = $0
    cr = ""
    if (length(line) > 0 && substr(line, length(line), 1) == "\r") {
        cr = "\r"
        line = substr(line, 1, length(line) - 1)
    }
    if (line == target) { print repl cr; n++ } else { print $0 }
}
END { exit (n > 0 ? 0 : 1) }
' "$TARGET_FILE" > "$TMP_PATCHED"
awk_status=$?

if [ "$awk_status" -ne 0 ]; then
    echo "${C_RED}FAIL：替換未生效（awk 沒比對到目標整行）。${C_RESET}"
    exit 1
fi

cat "$TMP_PATCHED" > "$TARGET_FILE" || { echo "${C_RED}FAIL：寫回目標檔失敗${C_RESET}"; exit 1; }

echo "${C_GREEN}DONE：已移除「分類必填」驗證規則。${C_RESET}"
echo "${C_GRAY}      原檔已備份到：$BACKUP_FILE${C_RESET}"
echo ""
echo "${C_CYAN}下一步：${C_RESET}"
echo "  1. 確認 solution-app dev server 還開著（http://localhost:3100）。"
echo "  2. 跑 E2E 看它變紅："
echo "       cd .. && bash run-e2e.sh"
echo "     預期 E4（表單驗證）會紅，訊息大意是等不到「請選擇分類」。"
echo "  3. 練完還原：bash restore.sh"
exit 0
