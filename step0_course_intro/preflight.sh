#!/usr/bin/env bash
#
# preflight.sh
# AI CRUD 工作坊 EASY 版 — 開課前置檢查（macOS／Linux 版）
#
# 與 Windows 的 preflight.ps1 檢查項目、判定標準、exit code 一致：
#   exit 0 = 全數通過（可含 WARN）；exit 1 = 有 FAIL。
# 相容 macOS 內建 bash 3.2，不使用 bash 4+ 語法（關聯陣列等）。
#
# 用法（在 step0_course_intro 目錄）：
#   bash preflight.sh
#

set -u

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSHOP_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# ── 顏色（非終端機輸出時自動關閉）──
if [ -t 1 ]; then
    C_RESET=$'\033[0m'; C_CYAN=$'\033[36m'; C_GREEN=$'\033[32m'
    C_YELLOW=$'\033[33m'; C_RED=$'\033[31m'
else
    C_RESET=''; C_CYAN=''; C_GREEN=''; C_YELLOW=''; C_RED=''
fi

# ── 結果收集（bash 3.2：用分隔字元打包成單一字串陣列）──
SEP=$'\x1f'
results=()

# add_result <名稱> <pass:0|1> <詳情> <修復提示> <warn:0|1>
add_result() {
    results[${#results[@]}]="$1$SEP$2$SEP$3$SEP$4$SEP$5"
}

has_cmd() { command -v "$1" >/dev/null 2>&1; }

echo "${C_CYAN}===== AI CRUD 工作坊 EASY 版 — 前置檢查（macOS／Linux）=====${C_RESET}"
echo ""

# ── 1. Node.js >= 20 ──
if has_cmd node; then
    node_raw="$(node --version 2>/dev/null)"
    node_major="${node_raw#v}"
    node_major="${node_major%%.*}"
    if [ -n "$node_major" ] && [ "$node_major" -ge 20 ] 2>/dev/null; then
        add_result "Node.js >= 20" 1 "偵測到 $node_raw" "" 0
    else
        add_result "Node.js >= 20" 0 "偵測到 ${node_raw}（版本過舊）" \
            "請安裝 Node.js 20 以上版本：https://nodejs.org/（或用 Homebrew：brew install node）" 0
    fi
else
    add_result "Node.js >= 20" 0 "找不到 node 指令" \
        "請安裝 Node.js 20 以上版本：https://nodejs.org/（或用 Homebrew：brew install node）" 0
fi

# ── 2. pnpm 已安裝 ──
if has_cmd pnpm; then
    add_result "pnpm 已安裝" 1 "偵測到 pnpm $(pnpm --version 2>/dev/null)" "" 0
else
    add_result "pnpm 已安裝" 0 "找不到 pnpm 指令" \
        "請執行「npm install -g pnpm」安裝 pnpm（或 brew install pnpm）" 0
fi

# ── 3. git 已安裝 ──
if has_cmd git; then
    add_result "git 已安裝" 1 "偵測到 $(git --version 2>/dev/null)" "" 0
else
    add_result "git 已安裝" 0 "找不到 git 指令" \
        "請安裝 Git：https://git-scm.com/（macOS 可執行「xcode-select --install」）" 0
fi

# ── 4. port 3100 未被占用 ──
port_checked=0
port_busy=0
if has_cmd lsof; then
    port_checked=1
    if lsof -nP -iTCP:3100 -sTCP:LISTEN >/dev/null 2>&1; then port_busy=1; fi
elif has_cmd ss; then
    port_checked=1
    if ss -ltn 2>/dev/null | grep -q ':3100[[:space:]]'; then port_busy=1; fi
elif has_cmd netstat; then
    port_checked=1
    if netstat -an 2>/dev/null | grep -qE '[.:]3100[[:space:]].*LISTEN'; then port_busy=1; fi
fi

if [ "$port_checked" -eq 0 ]; then
    # 沒有可用的檢查工具時不阻擋開課（與 Windows 版同樣記為警告）
    add_result "port 3100 未被占用" 1 "找不到 lsof／ss／netstat 可檢查（略過，開課時請自行確認 port 3100 空閒）" "" 1
elif [ "$port_busy" -eq 1 ]; then
    add_result "port 3100 未被占用" 0 "port 3100 已被占用" \
        "請關閉占用 3100 的程式：執行「lsof -nP -iTCP:3100 -sTCP:LISTEN」找出 PID，再「kill <PID>」" 0
else
    add_result "port 3100 未被占用" 1 "port 3100 目前空閒（範本專案 sample-app 會用這個埠）" "" 0
fi

# ── 5. 磁碟剩餘空間 >= 2GB ──
avail_kb="$(df -Pk "$SCRIPT_DIR" 2>/dev/null | awk 'NR==2 {print $4}')"
if [ -n "${avail_kb:-}" ] && [ "$avail_kb" -ge 0 ] 2>/dev/null; then
    free_gb="$(awk -v k="$avail_kb" 'BEGIN { printf "%.2f", k / 1048576 }')"
    if [ "$avail_kb" -ge 2097152 ]; then
        add_result "磁碟剩餘空間 >= 2GB" 1 "工作坊所在磁碟剩餘約 $free_gb GB" "" 0
    else
        add_result "磁碟剩餘空間 >= 2GB" 0 "工作坊所在磁碟剩餘約 $free_gb GB（不足）" \
            "請清出至少 2GB 空間，sample-app 安裝相依套件（node_modules）需要空間" 0
    fi
else
    add_result "磁碟剩餘空間 >= 2GB" 0 "無法用 df 取得剩餘空間" \
        "請手動確認工作坊所在磁碟至少有 2GB 剩餘空間" 0
fi

# ── 6. curl 可用（run-e2e.sh 需要；對應 Windows 版的 ExecutionPolicy 檢查）──
if has_cmd curl; then
    add_result "curl 可用" 1 "偵測到 $(curl --version 2>/dev/null | head -n 1)" "" 0
else
    add_result "curl 可用" 0 "找不到 curl 指令（step4 的 run-e2e.sh 用它確認 App 是否啟動）" \
        "macOS 內建 curl；若缺少請執行「xcode-select --install」或「brew install curl」" 0
fi

# ── 7. 工作區可寫入 ──
probe_file="$WORKSHOP_ROOT/.preflight_write_test_$$.tmp"
if : > "$probe_file" 2>/dev/null && rm -f "$probe_file" 2>/dev/null; then
    add_result "工作區可寫入" 1 "工作坊根目錄可建立／刪除暫存檔" "" 0
else
    rm -f "$probe_file" 2>/dev/null
    add_result "工作區可寫入" 0 "無法在工作坊根目錄寫入：$WORKSHOP_ROOT" \
        "請把工作坊資料夾放到你有寫入權限的位置（避開唯讀磁碟或系統保護目錄），或修正資料夾權限" 0
fi

# ── 8. npm registry 連線（WARN 級）──
if has_cmd curl && curl -sS -I --max-time 5 https://registry.npmjs.org >/dev/null 2>&1; then
    add_result "npm registry 連線" 1 "可連上 registry.npmjs.org" "" 0
else
    add_result "npm registry 連線" 1 \
        "無法連上 registry.npmjs.org（離線或防火牆）；離線教室請確認已預裝依賴（兩個專案的 node_modules 皆已就緒）" "" 1
fi

# ── 9. Playwright Chromium 已快取（WARN 級）──
pw_cache="${PLAYWRIGHT_BROWSERS_PATH:-}"
if [ -z "$pw_cache" ]; then
    case "$(uname -s)" in
        Darwin) pw_cache="$HOME/Library/Caches/ms-playwright" ;;
        *)      pw_cache="$HOME/.cache/ms-playwright" ;;
    esac
fi
chromium_count=0
if [ -d "$pw_cache" ]; then
    chromium_count="$(find "$pw_cache" -maxdepth 1 -type d -name 'chromium*' 2>/dev/null | wc -l | tr -d '[:space:]')"
fi
if [ "${chromium_count:-0}" -gt 0 ] 2>/dev/null; then
    add_result "Playwright Chromium 已快取" 1 "已找到 $chromium_count 個 chromium 快取目錄（step4 E2E 可直接跑）" "" 0
else
    add_result "Playwright Chromium 已快取" 1 \
        "未找到 Chromium 快取（${pw_cache}）；step4 首跑會自動下載約 150MB，離線教室請課前先跑一次 run-e2e.sh" "" 1
fi

# ── 10. AI Agent CLI（WARN 級）──
found_agents=""
for agent in claude codex cursor; do
    if has_cmd "$agent"; then
        if [ -z "$found_agents" ]; then found_agents="$agent"; else found_agents="${found_agents}、${agent}"; fi
    fi
done
if [ -n "$found_agents" ]; then
    add_result "AI Agent CLI" 1 "偵測到：$found_agents" "" 0
else
    add_result "AI Agent CLI" 1 \
        "未偵測到常見 AI Agent CLI（claude／codex／cursor）；若用 IDE 內建 Agent（如 Cursor／Copilot）可忽略" "" 1
fi

# ── 輸出清單 ──
fail_count=0
warn_count=0
set -f   # 拆欄位時關閉萬用字元展開
for row in "${results[@]}"; do
    old_ifs="$IFS"; IFS="$SEP"
    # shellcheck disable=SC2086
    set -- $row
    IFS="$old_ifs"
    r_name="$1"; r_pass="$2"; r_detail="$3"; r_fix="${4:-}"; r_warn="${5:-0}"

    if [ "$r_warn" = "1" ]; then
        warn_count=$((warn_count + 1))
        echo "${C_YELLOW}[WARN] $r_name — $r_detail${C_RESET}"
    elif [ "$r_pass" = "1" ]; then
        echo "${C_GREEN}[PASS] $r_name — $r_detail${C_RESET}"
    else
        fail_count=$((fail_count + 1))
        echo "${C_RED}[FAIL] $r_name — $r_detail${C_RESET}"
        echo "${C_YELLOW}       修復提示：$r_fix${C_RESET}"
    fi
done
set +f

echo ""
if [ "$fail_count" -eq 0 ]; then
    if [ "$warn_count" -gt 0 ]; then
        echo "${C_GREEN}前置檢查全數通過（含 $warn_count 項警告），可以開課！${C_RESET}"
    else
        echo "${C_GREEN}前置檢查全數通過，可以開課！${C_RESET}"
    fi
    exit 0
else
    echo "${C_RED}有 $fail_count 項檢查未通過，請依上方修復提示處理後重新執行 preflight.sh。${C_RESET}"
    exit 1
fi

# 註：帳號額度／登入狀態無法自動檢查，開課前請講師人工確認（見 instructor/GUIDE.md）
