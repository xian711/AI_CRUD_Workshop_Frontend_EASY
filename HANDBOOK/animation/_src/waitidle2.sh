#!/bin/bash
# 等 Claude Code 跑完：沒有 Stop 按鈕、下面也沒有「N agent」（子代理在跑），連續兩次才算完；參數：最多幾秒、截圖前綴
MAX=${1:-600}; PFX=${2:-}; t=0; idle=0
while [ $t -lt $MAX ]; do
  sleep 12; t=$((t+12))
  R=$(node send.mjs @c-busy2.json 2>&1 | tail -1)
  if echo "$R" | grep -q idle; then idle=$((idle+1)); else idle=0; fi
  if [ -n "$PFX" ] && [ $((t % 60)) -eq 0 ]; then echo "{\"a\":\"shot\",\"name\":\"${PFX}-t$(printf %04d $t)\"}" > cs.json; node send.mjs @cs.json > /dev/null; fi
  if [ $idle -ge 2 ]; then echo "IDLE after ${t}s"; exit 0; fi
done
echo "STILL BUSY after ${MAX}s"
