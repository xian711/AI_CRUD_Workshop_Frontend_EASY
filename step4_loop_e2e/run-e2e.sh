#!/usr/bin/env bash
#
# run-e2e.sh
# 裝備物資模組 E2E 一鍵跑（EASY 版｜macOS／Linux）
#
# 與 Windows 的 run-e2e.ps1 行為一致：
#   0. 【意外修改偵測】比對 E2E 測試檔的 SHA-256 與 tests.sha256 基準，不符就拒絕執行。
#      這是 fail-closed：基準檔不見了、被清空、格式壞掉、少項、多項、重複、
#      hash 不是 64 位十六進位——任何一種都判 FAIL，絕不因為「讀不到東西」就放行。
#      老實說清楚它擋得住什麼：它擋得住「改了測試卻忘了同步基準」，
#      也擋得住多數順手放寬斷言的情況；但它擋不住「有寫入權限、且刻意連基準一起重算」的人，
#      因為腳本、測試、基準都在同一份學員可寫的副本裡。
#      要真的防蓄意作弊，可信基準與評測器必須放在學員改不到的地方（講師端／CI）。
#   1. 確認受測 App（你的 my-equipment-app 或參考解 solution-app）在受測網址有回應（且是本課範本 App，非別的程式佔埠）。
#   2. e2e 資料夾裝相依（node_modules 與 playwright 皆就緒才跳過 npm ci）＋確保 chromium 已裝。
#   3. 跑 Playwright 7 條測試，解析輸出印 PASS/FAIL 總結，exit code 對應。
#
# 在 step4_loop_e2e 目錄執行：
#   bash run-e2e.sh
# 先另開一個視窗啟動 App：
#   cd ../step3_new_module/my-equipment-app && pnpm dev   # 或 solution-app；http://localhost:3100
#
# 埠不再寫死：預設 3100，要換埠就設環境變數（受測 App 也要用同一個埠啟動）。
# playwright.config.ts 讀的是同一組變數，所以測試打的網址一定跟這裡檢查的一致。
#   PORT=3200 bash run-e2e.sh
#   BASE_URL=http://127.0.0.1:3200 bash run-e2e.sh
#
# Exit code：0 = 全綠；1 = 測試檔與基準不符、任一 FAIL、找不到測試或非預期錯誤。
#

set -u

PORT="${PORT:-3100}"
BASE_URL="${BASE_URL:-http://localhost:$PORT}"
BASE_URL="${BASE_URL%/}"
EXPECTED=7                        # EASY 版 baseline：恰好 7 條全綠才算過
APP_MARKER='disaster-color-mode'  # 本課範本 App 的 colorMode.storageKey 前綴，用來確認受測網址跑的是本課的 App

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
E2E_DIR="$SCRIPT_DIR/e2e"
HASH_MANIFEST="$SCRIPT_DIR/tests.sha256"
# 基準檔必須「恰好」涵蓋這幾個檔：少一個、多一個、重複，都判 FAIL
PROTECTED_FILES="e2e/tests/equipment.spec.ts e2e/playwright.config.ts"
# 重算基準的講師工具（訊息一律印絕對路徑，免得從不同目錄執行時對不上）
UPDATE_HASH_SH="$REPO_ROOT/instructor/update-e2e-hash.sh"

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

# 內容雜湊：先去掉 CR，讓 CRLF / LF 的差異不影響結果（跨平台同一個值）
sha256_of() {
    if command -v sha256sum >/dev/null 2>&1; then
        tr -d '\r' < "$1" | sha256sum | awk '{print $1}'
    else
        tr -d '\r' < "$1" | shasum -a 256 | awk '{print $1}'
    fi
}

echo "${C_CYAN}=== 裝備物資 E2E（EASY 版｜7 條）===${C_RESET}"

# ── 0. 意外修改偵測（fail-closed：任何一種「讀不出正確基準」的狀況都判 FAIL）──
echo "${C_CYAN}檢查 E2E 測試檔與基準是否相符...${C_RESET}"
problems=''
add_problem() { problems="${problems}
  - $1"; }

if [ ! -f "$HASH_MANIFEST" ]; then
    add_problem "找不到基準檔：$HASH_MANIFEST"
else
    seen_paths=''
    line_no=0
    while IFS= read -r line || [ -n "$line" ]; do
        line_no=$((line_no + 1))
        trimmed="$(printf '%s' "$line" | sed 's/^[[:space:]]*//; s/[[:space:]]*$//')"
        case "$trimmed" in ''|'#'*) continue ;; esac
        # 格式必須「恰好」是「64 位十六進位 + 空白 + 路徑」兩欄，不合就 FAIL（不再默默跳過）。
        # 注意兩件事，缺一就會留破口：
        #   1. regex 一定要收尾錨點 $——只錨開頭的話，
        #      「<正確 hash>  e2e/tests/equipment.spec.ts EXTRA」會通過，多出來的 EXTRA 被靜靜丟掉。
        #   2. 再用 awk NF == 2 確認真的只有兩欄（受保護的兩個路徑本來就不含空白）。
        if ! printf '%s' "$trimmed" | grep -qE '^[0-9a-fA-F]{64}[[:space:]]+[^[:space:]]+$' \
           || [ "$(printf '%s\n' "$trimmed" | awk '{print NF}')" != "2" ]; then
            add_problem "基準檔第 ${line_no} 行格式不合（應恰為「64 位 hex ＋ 空白 ＋ 路徑」兩欄）：$trimmed"
            continue
        fi
        expected_hash="$(printf '%s' "$trimmed" | awk '{print tolower($1)}')"
        rel="$(printf '%s' "$trimmed" | awk '{print $2}' | tr '\\' '/')"
        case " $seen_paths " in
            *" $rel "*) add_problem "基準檔第 ${line_no} 行：$rel 重複列出"; continue ;;
        esac
        seen_paths="$seen_paths $rel"
        case " $PROTECTED_FILES " in
            *" $rel "*) ;;
            *) add_problem "基準檔第 ${line_no} 行：$rel 不在受保護清單內（多出來的項目）"; continue ;;
        esac
        full="$SCRIPT_DIR/$rel"
        if [ ! -f "$full" ]; then
            add_problem "${rel}（檔案不見了）"
            continue
        fi
        eval "hash_for_$(printf '%s' "$rel" | tr -c 'A-Za-z0-9' '_')=\$expected_hash"
    done < "$HASH_MANIFEST"

    # 少一項也不行——基準檔被清空或只留註解，會在這裡被抓到
    for rel in $PROTECTED_FILES; do
        case " $seen_paths " in
            *" $rel "*) ;;
            *) add_problem "基準檔缺少必要項目：$rel"; continue ;;
        esac
        full="$SCRIPT_DIR/$rel"
        [ -f "$full" ] || continue    # 檔案不見了上面已記過
        var="hash_for_$(printf '%s' "$rel" | tr -c 'A-Za-z0-9' '_')"
        eval "expected=\${$var:-}"
        [ -n "$expected" ] || continue
        actual="$(sha256_of "$full")"
        if [ "$actual" != "$expected" ]; then
            add_problem "${rel}（內容與基準不符）"
        fi
    done
fi

if [ -n "$problems" ]; then
    echo "${C_RED}FAIL：E2E 測試檔的完整性檢查沒過，拒絕執行。${C_RESET}"
    echo "${C_RED}${problems}${C_RESET}"
    echo ""
    echo "${C_YELLOW}這一關在做的是「意外修改偵測」：確認你手上的測試，跟講師發出來的那一份是同一份。${C_RESET}"
    echo "${C_YELLOW}要改 App 請隨意；測試不要動。若你認為測試本身真的有問題，停下來回報，由人裁決。${C_RESET}"
    echo "${C_YELLOW}（講師確定要改測試的話，改完跑這一支重算基準：）${C_RESET}"
    echo "${C_YELLOW}  bash \"$UPDATE_HASH_SH\"${C_RESET}"
    exit 1
fi
echo "${C_GREEN}PASS：測試檔與基準相符。${C_RESET}"

# ── 1. 目標站點必須活著且是本 App ──
echo "${C_CYAN}檢查 $BASE_URL ...${C_RESET}"
http_code="$(curl -sS --max-time 5 -o "$TMP_BODY" -w '%{http_code}' \
    "$BASE_URL/equipment/crud" 2>/dev/null || echo "000")"

alive=0
if [ "$http_code" -ge 200 ] 2>/dev/null && [ "$http_code" -lt 500 ] 2>/dev/null; then
    alive=1
fi

if [ "$alive" -ne 1 ]; then
    echo "${C_RED}FAIL：受測 App 沒在 $BASE_URL 回應。${C_RESET}"
    echo "${C_YELLOW}請先啟動受測 App（絕對路徑，從哪個目錄執行都對得上）：${C_RESET}"
    echo "${C_YELLOW}  cd \"$REPO_ROOT/step3_new_module/my-equipment-app\" && pnpm dev${C_RESET}"
    echo "${C_YELLOW}  （還沒做 step3 的話，改用參考解 step3_new_module/solution-app）${C_RESET}"
    echo "${C_YELLOW}（若你把 App 開在別的埠，記得用 PORT=xxxx 或 BASE_URL=... 再跑這支腳本。）${C_RESET}"
    exit 1
fi

if ! grep -qF "$APP_MARKER" "$TMP_BODY" 2>/dev/null; then
    echo "${C_RED}FAIL：$BASE_URL 有回應，但不是本課的 App（可能被別的程式佔用）。${C_RESET}"
    echo "${C_YELLOW}請關掉佔用的程式，改在 $BASE_URL 啟動受測 App。${C_RESET}"
    exit 1
fi
echo "${C_GREEN}PASS：受測 App 在 $BASE_URL、確認為本課的 App。${C_RESET}"

# ── 2. 相依：node_modules 存在「且」playwright CLI 也在，才跳過 npm ci（半套安裝一律重裝）──
if [ -d "$E2E_DIR/node_modules" ] && [ -x "$E2E_DIR/node_modules/.bin/playwright" ]; then
    echo "${C_GRAY}node_modules 與 playwright 皆就緒，跳過 npm ci。${C_RESET}"
else
    echo "${C_CYAN}安裝 e2e 相依（npm ci）...${C_RESET}"
    if ! ( cd "$E2E_DIR" && npm ci ); then
        echo "${C_RED}FAIL：npm ci 失敗（${E2E_DIR}）${C_RESET}"
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
    reason="測試程序 exit code = ${test_exit}。"
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
