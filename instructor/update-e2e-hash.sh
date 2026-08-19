#!/usr/bin/env bash
#
# update-e2e-hash.sh
# 重算 step4 E2E 測試檔的 SHA-256 基準（講師專用｜macOS／Linux）
#
# run-e2e.ps1 / run-e2e.sh 每次跑測試前，會比對測試檔的雜湊與
# step4_loop_e2e/tests.sha256 是否相同；不同就直接拒絕執行，避免
# 「為了讓燈變綠去改測試」這種作弊。
#
# 所以只要你（講師）正當地改了測試檔或 playwright.config.ts，
# 就要跑這一支把基準更新掉，否則學員會一律看到 FAIL。
#
# 這支刻意放在 instructor/ 而不是 step4_loop_e2e/ 旁邊——
# 它是解鎖用的鑰匙，不該跟學員每天要跑的腳本擺在一起。
#
# 雜湊前會先移除 CR（\r），所以 CRLF / LF 差異不會影響結果。
#
# 用法：bash instructor/update-e2e-hash.sh
#

set -eu

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
LOOP_DIR="$REPO_ROOT/step4_loop_e2e"
MANIFEST="$LOOP_DIR/tests.sha256"

# 受保護的檔案（相對 step4_loop_e2e/）：測試本體 ＋ 會影響判定的設定
TARGETS="e2e/tests/equipment.spec.ts e2e/playwright.config.ts"

sha256_of() {
    # 去掉 CR 再算，讓 CRLF / LF 差異不影響結果
    if command -v sha256sum >/dev/null 2>&1; then
        tr -d '\r' < "$1" | sha256sum | awk '{print $1}'
    else
        tr -d '\r' < "$1" | shasum -a 256 | awk '{print $1}'
    fi
}

echo "=== 重算 step4 E2E 測試檔雜湊基準 ==="

{
    echo '# step4 E2E 受保護檔案的 SHA-256 基準（內容已去除 CR，換行風格不影響）'
    echo '# 由 instructor/update-e2e-hash.ps1 或 instructor/update-e2e-hash.sh 產生。'
    echo '# 格式：<sha256>  <相對 step4_loop_e2e/ 的路徑>'
} > "$MANIFEST"

for rel in $TARGETS; do
    full="$LOOP_DIR/$rel"
    if [ ! -f "$full" ]; then
        echo "找不到受保護檔案：$rel" >&2
        exit 1
    fi
    hash="$(sha256_of "$full")"
    echo "$hash  $rel" >> "$MANIFEST"
    echo "  $hash  $rel"
done

echo "已更新：$MANIFEST"
