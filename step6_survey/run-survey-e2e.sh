#!/usr/bin/env bash
#
# run-survey-e2e.sh
# 課程回饋問卷 — 一鍵驗收（EASY 版課後題｜macOS／Linux）
#
# 與 Windows 的 run-survey-e2e.ps1 行為一致，把 step6_survey/README.md
# 「③ 驗收」那張清單自動跑一遍：
#   S1  必填留空按送出 → 欄位下方紅字、聚焦第一個錯誤欄、不離頁
#   S2  正常填完送出   → 成功訊息、寫入 1 筆、可以再填一份
#   S3  連點送出鈕     → 只送出一筆（防重複）
#   S4  送出後重整     → 資料還在（localStorage）
#   S5  管理頁         → 看得到剛才那一筆
#   S6  沒有回覆時     → 顯示空狀態，不是空表格
#   S7  匯出 CSV       → 檔名含日期、含 UTF-8 BOM、中文不亂碼
#   S8  清空全部       → 二次確認，且確認鈕寫明動作
#   S9  手機 390px     → 每題可填、無橫向捲軸、能送出
#   S10 硬編碼色碼掃描 → 你新增的檔案裡不該有 hex 色碼（本腳本靜態掃描）
#
# 第 11 項（無痕視窗看不到別人的回覆）刻意不自動化——
# 那一題的重點就是「你要親眼看到 localStorage 的邊界」。
#
# 用法（在 step6_survey 目錄執行）：
#   bash run-survey-e2e.sh              # 預設掃 my-survey-app
#   bash run-survey-e2e.sh my-app       # 指定別的資料夾
# 先另開一個視窗啟動你的問卷 App：
#   cd my-survey-app && pnpm dev
#
# 埠不寫死：預設 3100，可用環境變數覆寫（App 也要用同一個埠啟動）
#   PORT=3200 bash run-survey-e2e.sh
#   BASE_URL=http://127.0.0.1:3200 bash run-survey-e2e.sh
#
# Exit code：0 = S1~S10 全過；1 = 任一項沒過、找不到 App 或非預期錯誤。
#

set -u

APP_DIR="${1:-my-survey-app}"
PORT="${PORT:-3100}"
BASE_URL="${BASE_URL:-http://localhost:$PORT}"
BASE_URL="${BASE_URL%/}"
EXPECTED=9                        # Playwright 的 S1~S9；S10 由本腳本自己算

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
E2E_DIR="$SCRIPT_DIR/e2e"
case "$APP_DIR" in
    /*|[A-Za-z]:*) APP_PATH="$APP_DIR" ;;   # 已經是絕對路徑就直接用
    *)            APP_PATH="$SCRIPT_DIR/$APP_DIR" ;;
esac

if [ -t 1 ]; then
    C_RESET=$'\033[0m'; C_CYAN=$'\033[36m'; C_GREEN=$'\033[32m'
    C_YELLOW=$'\033[33m'; C_RED=$'\033[31m'; C_GRAY=$'\033[90m'
else
    C_RESET=''; C_CYAN=''; C_GREEN=''; C_YELLOW=''; C_RED=''; C_GRAY=''
fi

TMP_OUT="$(mktemp -t easy-survey-e2e.XXXXXX)"
cleanup() { rm -f "$TMP_OUT"; }
trap cleanup EXIT

echo "${C_CYAN}=== 課程回饋問卷 一鍵驗收（S1~S10）===${C_RESET}"

# ── 1. 站點必須活著 ──
echo "${C_CYAN}檢查 $BASE_URL/survey ...${C_RESET}"
http_code="$(curl -sS --max-time 5 -o /dev/null -w '%{http_code}' "$BASE_URL/survey" 2>/dev/null || echo "000")"
if ! { [ "$http_code" -ge 200 ] 2>/dev/null && [ "$http_code" -lt 500 ] 2>/dev/null; }; then
    echo "${C_RED}FAIL：你的問卷 App 沒在 $BASE_URL 回應。${C_RESET}"
    echo "${C_YELLOW}請先啟動：cd $APP_DIR && pnpm dev${C_RESET}"
    echo "${C_YELLOW}（開在別的埠的話，用 PORT=xxxx 或 BASE_URL=... 再跑這支腳本。）${C_RESET}"
    exit 1
fi
echo "${C_GREEN}PASS：問卷 App 在 $BASE_URL 有回應。${C_RESET}"

# ── 2. 相依 ──
if [ -d "$E2E_DIR/node_modules" ] && [ -x "$E2E_DIR/node_modules/.bin/playwright" ]; then
    echo "${C_GRAY}node_modules 與 playwright 皆就緒，跳過安裝。${C_RESET}"
else
    echo "${C_CYAN}安裝驗收腳本的相依（npm install）...${C_RESET}"
    if ! ( cd "$E2E_DIR" && npm install --no-audit --no-fund ); then
        echo "${C_RED}FAIL：npm install 失敗（${E2E_DIR}）${C_RESET}"
        exit 1
    fi
fi

echo "${C_CYAN}確保 Playwright chromium 已安裝...${C_RESET}"
if ! ( cd "$E2E_DIR" && npx playwright install chromium ); then
    echo "${C_RED}FAIL：playwright install chromium 失敗${C_RESET}"
    exit 1
fi

# ── 3. 跑 S1~S9 ──
echo "${C_CYAN}Running Playwright（chromium）...${C_RESET}"
( cd "$E2E_DIR" && npx playwright test 2>&1 ) | tee "$TMP_OUT"
test_exit="${PIPESTATUS[0]}"

last_count() {
    grep -oE "[0-9]+[[:space:]]+$1" "$TMP_OUT" 2>/dev/null | tail -n 1 | grep -oE '^[0-9]+'
}
no_tests=0
if grep -qF 'No tests found' "$TMP_OUT" 2>/dev/null; then no_tests=1; fi
passed="$(last_count passed)"
failed="$(last_count failed)"
skipped="$(last_count skipped)"; skipped="${skipped:-0}"
if [ -z "$failed" ] && [ -n "$passed" ]; then failed=0; fi

browser_pass=0
browser_reason=''
if [ "$no_tests" -eq 1 ]; then browser_reason='找不到任何測試。'
elif [ "$test_exit" -ne 0 ]; then browser_reason="測試程序 exit code = ${test_exit}。"
elif [ -z "$passed" ]; then browser_reason='exit 0 但抓不到 Playwright 總結行。'
elif [ "$failed" -ne 0 ]; then browser_reason="有 $failed 條紅。"
elif [ "$skipped" -ne 0 ]; then browser_reason="有 $skipped 條被略過。"
elif [ "$passed" -ne "$EXPECTED" ]; then browser_reason="綠了 $passed 條（應恰為 $EXPECTED 條）。"
else browser_pass=1
fi

# ── 4. S10：硬編碼色碼靜態掃描 ──
echo ""
echo "${C_CYAN}S10 硬編碼色碼掃描...${C_RESET}"
s10_pass=0
s10_reason=''
if [ ! -d "$APP_PATH" ]; then
    s10_reason="找不到 $APP_DIR（第一個參數可指定你的問卷專案資料夾）。"
else
    # 只掃「你新增的檔」；不掃 token 正本（assets/css）、規則文件與 SVG——那些本來就該有色碼。
    files="$(find "$APP_PATH/pages/survey" "$APP_PATH/components/survey" -type f \( -name '*.vue' -o -name '*.ts' \) 2>/dev/null || true)"
    survey_composables="$(find "$APP_PATH/composables" -type f -iname '*urvey*' \( -name '*.ts' -o -name '*.vue' \) 2>/dev/null || true)"
    files="$(printf '%s\n%s\n' "$files" "$survey_composables" | grep -v '/node_modules/' | grep -v '/\.nuxt/' | grep -v '/\.output/' | sed '/^$/d')"
    if [ -z "$files" ]; then
        s10_reason="在 $APP_DIR 找不到你新增的問卷檔（預期 pages/survey/*.vue 之類）。"
    else
        hits="$(printf '%s\n' "$files" | xargs grep -nE '#[0-9a-fA-F]{3,8}\b' 2>/dev/null || true)"
        if [ -n "$hits" ]; then
            count="$(printf '%s\n' "$hits" | wc -l | tr -d ' ')"
            s10_reason="找到 $count 處硬編碼色碼：
$(printf '%s\n' "$hits" | head -n 10)"
        else
            s10_pass=1
            echo "${C_GREEN}  掃了 $(printf '%s\n' "$files" | wc -l | tr -d ' ') 個新增檔，0 處硬編碼色碼。${C_RESET}"
        fi
    fi
fi

# ── 5. 總結 ──
echo ""
echo "${C_CYAN}──────── 驗收總結 ────────${C_RESET}"
if [ "$browser_pass" -eq 1 ]; then
    echo "${C_GREEN}S1~S9（瀏覽器實跑）：全過（$passed 條 passed）${C_RESET}"
else
    echo "${C_RED}S1~S9（瀏覽器實跑）：未過——$browser_reason${C_RESET}"
fi
if [ "$s10_pass" -eq 1 ]; then
    echo "${C_GREEN}S10（硬編碼色碼）：過${C_RESET}"
else
    echo "${C_RED}S10（硬編碼色碼）：未過——$s10_reason${C_RESET}"
fi
echo ""
echo "${C_YELLOW}⚠ 第 11 項要你自己做一次：開無痕視窗填一筆，回原本的視窗看 /survey/admin，${C_RESET}"
echo "${C_YELLOW}  應該「看不到」那一筆。這證明了這一版沒有後端、收不到別人裝置的回覆。${C_RESET}"

if [ "$browser_pass" -eq 1 ] && [ "$s10_pass" -eq 1 ]; then
    echo ""
    echo "${C_GREEN}驗收全過。${C_RESET}"
    exit 0
else
    echo ""
    echo "${C_RED}驗收未過，照上面的原因逐項修。${C_RESET}"
    exit 1
fi
