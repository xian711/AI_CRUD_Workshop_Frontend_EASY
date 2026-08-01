#!/usr/bin/env bash
#
# run-e2e.sh
# 裝備物資模組 E2E 一鍵跑（EASY 版｜macOS／Linux）
#
# 與 Windows 的 run-e2e.ps1 行為一致：
#   1. 確認 solution-app 在 http://localhost:3100 有回應（且是本 App，非別的程式佔埠）。
#   2. e2e 資料夾裝相依（node_modules 與 playwright 皆就緒才跳過 npm ci）＋確保 chromium 已裝。
#   3. 跑 Playwright 7 條測試，解析輸出印 PASS/FAIL 總結，exit code 對應。
#
# 在 step4_loop_e2e 目錄執行：
#   bash run-e2e.sh
# 先另開一個視窗啟動 App：
#   cd ../step3_new_module/solution-app && pnpm dev      # http://localhost:3100
#
# Exit code：0 = 全綠；1 = 任一 FAIL、找不到測試或非預期錯誤。
#

set -u

PORT=3100
EXPECTED=7                        # EASY 版 baseline：恰好 7 條全綠才算過
APP_MARKER='disaster-color-mode'  # solution-app 的 colorMode.storageKey 前綴，用來確認 3100 是本 App

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
E2E_DIR="$SCRIPT_DIR/e2e"

if [ -t 1 ]; then
    C_RESET=$'\033[0m'; C_CYAN=$'\033[36m'; C_GREEN=$'\033[32m'
    C_YELLOW=$'\033[33m'; C_RED=$'\033[31m'; C_GRAY=$'\033[90m'
else
    C_RESET=''; C_CYAN=''; C_GREEN=''; C_YELLOW=''; C_RED=''; C_GRAY=''
fi

TMP_BODY="$(mktemp -t easy-e2e-body.XXXXXX)"
TMP_OUT="$(mktemp -t easy-e2e-out.XXXXXX)"
cleanup() { rm -f "$TMP_BODY" "$TMP_OUT"; }
trap cleanup EXIT

echo "${C_CYAN}=== 裝備物資 E2E（EASY 版｜7 條）===${C_RESET}"

# ── 1. 目標站點必須活著且是本 App ──
echo "${C_CYAN}檢查 http://localhost:$PORT ...${C_RESET}"
http_code="$(curl -sS --max-time 5 -o "$TMP_BODY" -w '%{http_code}' \
    "http://localhost:$PORT/equipment/crud" 2>/dev/null || echo "000")"

alive=0
if [ "$http_code" -ge 200 ] 2>/dev/null && [ "$http_code" -lt 500 ] 2>/dev/null; then
    alive=1
fi

if [ "$alive" -ne 1 ]; then
    echo "${C_RED}FAIL：solution-app 沒在 $PORT 埠回應。${C_RESET}"
    echo "${C_YELLOW}請先啟動 solution-app：cd ../step3_new_module/solution-app && pnpm dev${C_RESET}"
    exit 1
fi

if ! grep -qF "$APP_MARKER" "$TMP_BODY" 2>/dev/null; then
    echo "${C_RED}FAIL：$PORT 埠有回應，但不是本 App（可能被別的程式佔用）。${C_RESET}"
    echo "${C_YELLOW}請關掉佔用的程式，改在 3100 啟動 solution-app。${C_RESET}"
    exit 1
fi
echo "${C_GREEN}PASS：solution-app 在 $PORT 埠、確認為本 App。${C_RESET}"

# ── 2. 相依：node_modules 存在「且」playwright CLI 也在，才跳過 npm ci（半套安裝一律重裝）──
if [ -d "$E2E_DIR/node_modules" ] && [ -x "$E2E_DIR/node_modules/.bin/playwright" ]; then
    echo "${C_GRAY}node_modules 與 playwright 皆就緒，跳過 npm ci。${C_RESET}"
else
    echo "${C_CYAN}安裝 e2e 相依（npm ci）...${C_RESET}"
    if ! ( cd "$E2E_DIR" && npm ci ); then
        echo "${C_RED}FAIL：npm ci 失敗（$E2E_DIR）${C_RESET}"
        exit 1
    fi
fi

# ── 2b. 確保 chromium 瀏覽器已裝（冪等；已裝很快返回）。非 0 一律紅，絕不對半套環境跑測試。──
echo "${C_CYAN}確保 Playwright chromium 已安裝...${C_RESET}"
if ! ( cd "$E2E_DIR" && npx playwright install chromium ); then
    echo "${C_RED}FAIL：playwright install chromium 失敗${C_RESET}"
    exit 1
fi

# ── 3. 跑測試 ──
echo "${C_CYAN}Running Playwright（chromium）...${C_RESET}"
( cd "$E2E_DIR" && npx playwright test 2>&1 ) | tee "$TMP_OUT"
test_exit="${PIPESTATUS[0]}"

# ── 解析 list reporter 總結（取最後一次匹配，避免測試 log 內含 "n passed" 誤判）──
last_count() {
    grep -oE "[0-9]+[[:space:]]+$1" "$TMP_OUT" 2>/dev/null | tail -n 1 | grep -oE '^[0-9]+'
}

no_tests=0
if grep -qF 'No tests found' "$TMP_OUT" 2>/dev/null; then no_tests=1; fi

passed="$(last_count passed)"
failed="$(last_count failed)"
skipped="$(last_count skipped)"; skipped="${skipped:-0}"
flaky="$(last_count flaky)";     flaky="${flaky:-0}"
if [ -z "$failed" ] && [ -n "$passed" ]; then failed=0; fi

# ── 4. 判定（不確定一律 FAIL，絕不假綠）：passed 必須「恰好等於」7，且無 failed/skipped/flaky ──
echo ""
verdict_pass=0
reason=''
if [ "$no_tests" -eq 1 ]; then
    reason='找不到任何測試。'
elif [ "$test_exit" -ne 0 ]; then
    reason="測試程序 exit code = $test_exit。"
elif [ -z "$passed" ]; then
    reason='exit 0 但抓不到 Playwright 總結行（無法確認全綠）。'
elif [ "$failed" -ne 0 ]; then
    reason="有 $failed 條紅。"
elif [ "$skipped" -ne 0 ]; then
    reason="有 $skipped 條被略過（skipped）——未真正驗到，視為不過。"
elif [ "$flaky" -ne 0 ]; then
    reason="有 $flaky 條 flaky（重試才過）——不穩定，視為不過。"
elif [ "$passed" -ne "$EXPECTED" ]; then
    reason="綠了 $passed 條（應恰為 $EXPECTED 條）。"
else
    verdict_pass=1
fi

if [ "$verdict_pass" -eq 1 ]; then
    echo "${C_GREEN}E2E 全綠：$passed 條 passed / $failed 條 failed / $skipped 條 skipped。${C_RESET}"
    exit 0
else
    echo "${C_RED}E2E FAIL：$reason${C_RESET}"
    exit 1
fi
