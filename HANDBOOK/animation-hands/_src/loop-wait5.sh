#!/bin/bash
# 第五版 LOOP 等待：每 10 秒查一次（有子代理也算忙），每 60 秒截一張；遇到選擇題或連續兩次閒置就結束
cd "$(dirname "$0")"
PFX=${1:-v5-cc31}; MAX=${2:-4200}; t=0; idle=0
echo "start $(date +%T)"
while [ $t -lt $MAX ]; do
  sleep 10; t=$((t+10))
  Q=$(node send.mjs @c-hasq.json 30 2>/dev/null | tail -1)
  if echo "$Q" | grep -q 'Q '; then echo "$t QUESTION $(date +%T)"; node send.mjs "{\"a\":\"shot\",\"name\":\"${PFX}-question\"}" 60 >/dev/null; exit 0; fi
  R=$(node send.mjs @c-busy2.json 30 2>/dev/null | tail -1)
  if [ $((t % 60)) -eq 0 ]; then node send.mjs "{\"a\":\"shot\",\"name\":\"${PFX}-t$(printf %04d $t)\"}" 60 >/dev/null; echo "$t $R"; fi
  if echo "$R" | grep -q idle; then idle=$((idle+1)); if [ $idle -ge 3 ]; then echo "$t IDLE $(date +%T)"; exit 0; fi; else idle=0; fi
done
echo "timeout $(date +%T)"
