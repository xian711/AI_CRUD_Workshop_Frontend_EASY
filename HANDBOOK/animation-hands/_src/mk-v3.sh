#!/bin/bash
# 第三版一鍵：轉圖 → 講稿＋配音資料 → 組裝 →（可選）逐句截圖檢查
# 用法：./mk-v3.sh [out資料夾=out3] [check：all 或 9,10]
cd "$(dirname "$0")"
OUT=${1:-out3}
python prep.py "$OUT" || exit 1
python build_v3_data.py "$OUT" || exit 1
ANIM_ASSETS=. python build.py --engine engine-v3.html --extra-helpers helpers-crud.js v3-data.js v3-helpers.js --scenes scenes-v3.js --meta "$OUT/meta.json" \
  --out-dir "$OUT" --name anim --title "AI CRUD 手把手" --h1 "AI CRUD 工作坊 EASY 版　手把手教學動畫" \
  --subtitle "harness・SDD・LOOP・對抗審查，全程實拍　·　小芸＋阿哲預錄配音（AI 語音）" --after after.html || exit 1
if [ -n "$2" ]; then
  rm -rf check; mkdir -p check
  if [ "$2" = "all" ]; then timeout 2400 node check.mjs "$PWD/$OUT/anim.html" ./check; else ONLY=$2 timeout 2400 node check.mjs "$PWD/$OUT/anim.html" ./check; fi
  python sheet.py ./check
fi
