#!/usr/bin/env bash
#
# restore.sh
# 紅→綠 LOOP 練習：把 inject-bug.sh 注入的 bug 還原（macOS／Linux 版）
#
# 從本資料夾的 .lab-backup/ 取回原檔，覆蓋回 solution-app，然後刪掉備份。
# 若備份不存在（沒注入過或已還原），會提示：repo 乾淨時也可用 git checkout 還原。
#
# 在 lab-red-to-green 目錄執行：
#   bash restore.sh
#

set -u

LAB_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET_FILE="$LAB_DIR/../../step3_new_module/solution-app/pages/equipment/crud/[id].vue"
BACKUP_DIR="$LAB_DIR/.lab-backup"
BACKUP_FILE="$BACKUP_DIR/[id].vue"

if [ -t 1 ]; then
    C_RESET=$'\033[0m'; C_CYAN=$'\033[36m'; C_GREEN=$'\033[32m'
    C_YELLOW=$'\033[33m'; C_RED=$'\033[31m'; C_GRAY=$'\033[90m'
else
    C_RESET=''; C_CYAN=''; C_GREEN=''; C_YELLOW=''; C_RED=''; C_GRAY=''
fi

echo "${C_CYAN}=== 還原練習 bug ===${C_RESET}"

if [ ! -f "$BACKUP_FILE" ]; then
    echo "${C_YELLOW}SKIP：找不到備份（.lab-backup/[id].vue）——可能沒注入過，或已經還原過了。${C_RESET}"
    echo "${C_YELLOW}      若 solution-app 是 git repo 且工作區乾淨，也可以直接：${C_RESET}"
    echo "${C_GRAY}        git checkout -- 'step3_new_module/solution-app/pages/equipment/crud/[id].vue'${C_RESET}"
    exit 0
fi

# ── 覆蓋回去（保留原檔 inode 與權限）──
cat "$BACKUP_FILE" > "$TARGET_FILE" || { echo "${C_RED}FAIL：還原寫回失敗${C_RESET}"; exit 1; }

# ── 刪備份與（若空）備份資料夾 ──
rm -f "$BACKUP_FILE"
rmdir "$BACKUP_DIR" 2>/dev/null || true

echo "${C_GREEN}DONE：已從備份還原 [id].vue，並清除備份。${C_RESET}"
echo ""
echo "${C_CYAN}下一步：再跑一次 E2E，確認回到 7 條全綠：${C_RESET}"
echo "${C_GRAY}  cd .. && bash run-e2e.sh${C_RESET}"
exit 0
