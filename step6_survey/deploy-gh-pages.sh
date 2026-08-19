#!/usr/bin/env bash
#
# deploy-gh-pages.sh
# 課程回饋問卷 — 一鍵發布到 GitHub Pages（EASY 版課後題｜macOS／Linux）
#
# 與 Windows 的 deploy-gh-pages.ps1 行為一致。
#
# ⚠ 預設是「演練模式（dry run）」：只建置、只檢查、只印出「會推什麼、推到哪」，
#   **不會真的動到你的 GitHub**。確認過再加 --push 才會實際推送。
#
# 做了什麼：
#   1. 檢查你在對的資料夾（有 nuxt.config、有 pages/survey）。
#   2. 設 NUXT_APP_BASE_URL=/<repo-name>/ 後跑 pnpm generate。
#   3. 檢查產出：index.html 在不在、資源前綴對不對、.nojekyll 有沒有。
#   4. 敏感資料掃描：翻一遍 .output/public，看有沒有像帳密／金鑰／台灣手機號／身分證號的東西。
#   5. 演練模式：印出即將推送的目標與檔案數就停。
#      --push 模式：在 .output/public 建一個乾淨的 git repo，強制推到 <repo-url> 的分支。
#
# 用法（在 step6_survey/my-survey-app 目錄執行）：
#   # 演練（推薦先跑這個）
#   bash ../deploy-gh-pages.sh --repo-name my-survey-app
#
#   # 確認沒問題之後，真的推
#   bash ../deploy-gh-pages.sh --repo-name my-survey-app \
#        --repo-url https://github.com/你的帳號/my-survey-app.git --push
#
# 推完之後還要手動做一次（GitHub 網頁上）：
#   repo → Settings → Pages → Source 選 "Deploy from a branch" → 分支選 main、資料夾選 / (root) → Save
#   等 1～2 分鐘，網址是 https://你的帳號.github.io/<repo-name>/
#
# ⚠ 兩件事一定要先知道：
#   - GitHub Pages 免費方案只支援 public（公開）repo。你推上去的每一個檔案，任何人都看得到。
#   - 要下架：Settings → Pages → Source 選 None（立刻下架）；
#             Settings 最下面 → Delete this repository（整個刪掉）。
#     先知道怎麼關，再按上線。
#
# Exit code：0 = 成功（演練或推送）；1 = 檢查沒過或發生錯誤。
#

set -u

REPO_NAME=''
REPO_URL=''
BRANCH='main'
DO_PUSH=0
IGNORE_SECRET_SCAN=0

while [ $# -gt 0 ]; do
    case "$1" in
        --repo-name) REPO_NAME="${2:-}"; shift 2 ;;
        --repo-url)  REPO_URL="${2:-}";  shift 2 ;;
        --branch)    BRANCH="${2:-main}"; shift 2 ;;
        --push)      DO_PUSH=1; shift ;;
        --ignore-secret-scan) IGNORE_SECRET_SCAN=1; shift ;;
        -h|--help)   sed -n '2,45p' "$0"; exit 0 ;;
        *) echo "未知參數：$1" >&2; exit 1 ;;
    esac
done

if [ -t 1 ]; then
    C_RESET=$'\033[0m'; C_CYAN=$'\033[36m'; C_GREEN=$'\033[32m'
    C_YELLOW=$'\033[33m'; C_RED=$'\033[31m'; C_GRAY=$'\033[90m'
else
    C_RESET=''; C_CYAN=''; C_GREEN=''; C_YELLOW=''; C_RED=''; C_GRAY=''
fi

fail() { echo "${C_RED}FAIL：$1${C_RESET}"; exit 1; }

[ -n "$REPO_NAME" ] || fail '缺少 --repo-name（要跟你的 GitHub repo 名稱一字不差）。'

echo "${C_CYAN}=== 課程回饋問卷 → GitHub Pages ===${C_RESET}"
if [ "$DO_PUSH" -eq 1 ]; then
    echo "${C_YELLOW}模式：實際推送（--push）${C_RESET}"
else
    echo "${C_GREEN}模式：演練（dry run）——不會動到你的 GitHub。確認後再加 --push。${C_RESET}"
fi
echo ""

# ── 檢查 1：在對的資料夾 ──
PROJECT_ROOT="$(pwd)"
echo "${C_CYAN}檢查 1／4：目前資料夾 $PROJECT_ROOT${C_RESET}"
[ -f "$PROJECT_ROOT/nuxt.config.ts" ] || fail '這裡沒有 nuxt.config.ts。請先 cd 進你的問卷專案資料夾（例如 my-survey-app）再跑。'
[ -d "$PROJECT_ROOT/pages/survey" ] || fail '找不到 pages/survey。這看起來不是問卷專案。'
echo "${C_GREEN}  PASS：確認是問卷專案。${C_RESET}"

# ── 建置 ──
CLEAN_NAME="$(printf '%s' "$REPO_NAME" | sed 's#^/*##; s#/*$##')"
BASE_URL_PATH="/$CLEAN_NAME/"
echo ""
echo "${C_CYAN}建置靜態檔（NUXT_APP_BASE_URL=$BASE_URL_PATH）...${C_RESET}"
echo "${C_GRAY}  提醒：baseURL 必須跟 GitHub repo 名稱「一字不差」（含大小寫），否則網址開起來會一片空白。${C_RESET}"
if ! NUXT_APP_BASE_URL="$BASE_URL_PATH" pnpm generate; then
    fail 'pnpm generate 失敗。'
fi

PUBLIC_DIR="$PROJECT_ROOT/.output/public"
[ -d "$PUBLIC_DIR" ] || fail "建置完卻找不到 $PUBLIC_DIR。"

# ── 檢查 2：產出內容 ──
echo ""
echo "${C_CYAN}檢查 2／4：產出內容${C_RESET}"
[ -f "$PUBLIC_DIR/index.html" ] || fail "$PUBLIC_DIR 裡沒有 index.html。"
if ! grep -qF "$BASE_URL_PATH" "$PUBLIC_DIR/index.html"; then
    fail "index.html 裡找不到資源前綴 $BASE_URL_PATH —— baseURL 沒吃進去，推上去會一片空白。"
fi
echo "${C_GREEN}  PASS：資源前綴是 $BASE_URL_PATH。${C_RESET}"

if [ ! -f "$PUBLIC_DIR/.nojekyll" ]; then
    : > "$PUBLIC_DIR/.nojekyll"
    echo "${C_YELLOW}  已自動補上 .nojekyll（沒有它，_nuxt/ 會被 GitHub Pages 忽略，CSS 全跑掉）。${C_RESET}"
else
    echo "${C_GREEN}  PASS：.nojekyll 在。${C_RESET}"
fi

FILE_COUNT="$(find "$PUBLIC_DIR" -type f | wc -l | tr -d ' ')"
echo "${C_GRAY}  產出共 $FILE_COUNT 個檔案。${C_RESET}"

# ── 檢查 3：敏感資料掃描 ──
echo ""
echo "${C_CYAN}檢查 3／4：敏感資料掃描（推上去就是全世界看得到）${C_RESET}"
scan() {
    find "$PUBLIC_DIR" -type f \( -name '*.html' -o -name '*.js' -o -name '*.json' -o -name '*.txt' -o -name '*.csv' \) \
        -exec grep -nEi "$1" {} + 2>/dev/null | head -n 3
}
FINDINGS=''
add_finding() {
    local label="$1"; local out="$2"
    if [ -n "$out" ]; then
        FINDINGS="${FINDINGS}
  ⚠ ${label}：
$(printf '%s' "$out" | cut -c1-160 | sed 's/^/      /')"
    fi
}
add_finding '看起來像密碼／金鑰的欄位' "$(scan '(password|passwd|secret|api[_-]?key|access[_-]?token|private[_-]?key)[[:space:]]*[:=][[:space:]]*["'"'"'][^"'"'"']{6,}')"
add_finding '台灣手機號碼' "$(scan '\b09[0-9]{8}\b')"
add_finding '台灣身分證字號' "$(scan '\b[A-Z][12][0-9]{8}\b')"
add_finding '內網位址' "$(scan '\b(10\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}|192\.168\.[0-9]{1,3}\.[0-9]{1,3})\b')"

if [ -n "$FINDINGS" ]; then
    echo "${C_YELLOW}  掃到可能不該公開的東西：${FINDINGS}${C_RESET}"
    echo ""
    echo "${C_YELLOW}  這門課的種子資料是虛構的，所以掃到手機號很可能是假資料——但請你**親眼確認過**再繼續。${C_RESET}"
    if [ "$IGNORE_SECRET_SCAN" -ne 1 ]; then
        fail '為了安全先擋下來。確認過都是假資料的話，加上 --ignore-secret-scan 再跑一次。'
    fi
    echo "${C_YELLOW}  你已加上 --ignore-secret-scan，略過此項。${C_RESET}"
else
    echo "${C_GREEN}  PASS：沒掃到明顯的敏感資料。${C_RESET}"
fi

# ── 檢查 4：推送目標 ──
echo ""
echo "${C_CYAN}檢查 4／4：推送目標${C_RESET}"
echo "${C_GRAY}  來源：$PUBLIC_DIR （推的是這個資料夾**裡面的內容**，不是資料夾本身）${C_RESET}"
echo "${C_GRAY}  目標 repo：${REPO_URL:-（未指定 --repo-url）}${C_RESET}"
echo "${C_GRAY}  目標分支：$BRANCH${C_RESET}"
echo "${C_GRAY}  發布後網址：https://<你的帳號>.github.io/$CLEAN_NAME/${C_RESET}"

if [ "$DO_PUSH" -ne 1 ]; then
    echo ""
    echo "${C_GREEN}演練完成，什麼都沒有推出去。${C_RESET}"
    echo "${C_GREEN}確認上面四項都沒問題之後，加上 --repo-url 與 --push 再跑一次才會實際發布。${C_RESET}"
    echo ""
    echo "${C_YELLOW}⚠ 按下去之前再想一次：GitHub Pages 免費方案只支援 public repo，${C_RESET}"
    echo "${C_YELLOW}  這 $FILE_COUNT 個檔案會變成任何人都看得到。${C_RESET}"
    exit 0
fi

[ -n "$REPO_URL" ] || fail '要實際推送必須給 --repo-url（例如 https://github.com/你的帳號/my-survey-app.git）。'

# ── 實際推送：在產出資料夾裡開一個拋棄式 repo ──
echo ""
echo "${C_CYAN}開始推送...${C_RESET}"
(
    cd "$PUBLIC_DIR" || exit 1
    rm -rf .git
    git init -q
    git checkout -q -B "$BRANCH"
    git add -A
    git -c user.name='workshop' -c user.email='workshop@example.com' commit -q -m "發布課程回饋問卷（$CLEAN_NAME）" || exit 1
    git remote add origin "$REPO_URL"
    git push -f origin "$BRANCH"
) || fail 'git 推送失敗（檢查 repo 網址、權限，以及那個 repo 是不是已經存在）。'

echo ""
echo "${C_GREEN}推送完成。${C_RESET}"
echo "${C_CYAN}最後一步（GitHub 網頁上手動做）：${C_RESET}"
echo "${C_CYAN}  repo → Settings → Pages → Source 選 'Deploy from a branch' → 分支 $BRANCH、資料夾 / (root) → Save${C_RESET}"
echo "${C_CYAN}  等 1～2 分鐘，開 https://<你的帳號>.github.io/$CLEAN_NAME/${C_RESET}"
echo ""
echo "${C_YELLOW}要下架：Settings → Pages → Source 選 None；要整個刪掉：Settings 最下面 Delete this repository。${C_RESET}"
exit 0
