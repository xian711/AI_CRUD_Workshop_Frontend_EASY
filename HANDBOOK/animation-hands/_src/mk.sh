#!/bin/bash
# 一鍵：合併場景檔 → 轉圖 → 組裝 → （可選）逐句截圖檢查
# 用法：./mk.sh [out資料夾=out] [check：要檢查的段，例如 all 或 9,10]
cd "$(dirname "$0")"
OUT=${1:-out}
cat scenes.js scenes-b.js scenes-c.js scenes-d.js scenes-e.js $( [ -f scenes-f.js ] && echo scenes-f.js ) scenes-g.js > scenes-all.js
python prep.py "$OUT" || exit 1
[ -f after.html ] && AFTER="--after after.html" || AFTER=""
ANIM_ASSETS=. python build.py --engine engine-crud.html --extra-helpers helpers-crud.js --scenes scenes-all.js --meta "$OUT/meta.json" \
  --out-dir "$OUT" --name anim --title "AI CRUD 手把手" --h1 "AI CRUD 工作坊 EASY 版　手把手教學動畫" \
  --subtitle "VS Code＋終端機＋瀏覽器，全程實拍　·　2026-10-04" $AFTER || exit 1
if [ -n "$2" ]; then
  rm -rf check; mkdir -p check
  if [ "$2" = "all" ]; then timeout 1800 node check.mjs "$PWD/$OUT/anim.html" ./check; else ONLY=$2 timeout 1800 node check.mjs "$PWD/$OUT/anim.html" ./check; fi
  python sheet.py ./check
fi
