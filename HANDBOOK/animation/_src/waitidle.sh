#!/bin/bash
# 等 Claude Code 跑完（畫面沒有 Stop 按鈕、而且連續兩次都是這樣）；參數：最多幾秒、截圖前綴
MAX=${1:-600}; PFX=${2:-}; t=0; idle=0; n=0
while [ $t -lt $MAX ]; do
  sleep 12; t=$((t+12))
  echo '{"a":"feval","purpose":"webviewPanel","js":"[...document.querySelectorAll(\u0027button\u0027)].some(b=>b.getBoundingClientRect().width && /^(Stop|Interrupt)/.test((b.getAttribute(\u0027aria-label\u0027)||b.innerText||\u0027\u0027).trim())) ? \u0027busy\u0027 : \u0027idle\u0027"}' > cw.json
  R=$(node send.mjs @cw.json 2>&1 | tail -1)
  if echo "$R" | grep -q idle; then idle=$((idle+1)); else idle=0; fi
  if [ -n "$PFX" ] && [ $((t % 60)) -eq 0 ]; then n=$((n+1)); echo "{\"a\":\"shot\",\"name\":\"${PFX}-t$(printf %03d $t)\"}" > cs.json; node send.mjs @cs.json > /dev/null; fi
  if [ $idle -ge 2 ]; then echo "IDLE after ${t}s"; exit 0; fi
done
echo "STILL BUSY after ${MAX}s"
