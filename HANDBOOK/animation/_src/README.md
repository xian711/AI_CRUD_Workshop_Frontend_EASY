# 手把手教學動畫的原始檔

上一層的 `index.html` 是組裝好的動畫，用瀏覽器打開就能看。這個資料夾是改字幕或重拍時用的原始檔。

## 只改字幕或標註

1. 改 `scenes*.js`（每個檔是一段章節；`scenes-all.js` 是合併後的版本，由 `mk.sh` 產生）。
2. 一段場景的寫法：`scene(標題, 畫面, [[字幕, 動作], …])`。字幕同時是語音講稿。
3. 截圖上的標註框座標在 `meta.json`（單位是截圖的 CSS px）；手動補的框在 `meta-extra.json`。
4. 重新組裝要有實拍原圖資料夾 `raw/`（這裡沒有放，太大）。有 `raw/` 時執行 `./mk.sh out 9,10`，會組裝並把第 9、10 段每一句截圖到 `check/`。

## 檔案在做什麼

| 檔案 | 用途 |
|------|------|
| `engine-crud.html` | 播放器：舞台、字幕、語音、兩層章節列、暫停 |
| `helpers.js`、`helpers-crud.js` | 繪圖小工具：截圖框、標註、大字版終端機（會自動換行）、瀏覽器外框、游標 |
| `after.html` | 動畫下方的文字版速查 |
| `prep.py` | 把 `raw/*.png` 轉成 `images/*.jpg`，並遮掉個資（帳號、私人資料夾） |
| `build.py` | 把播放器、工具、場景、座標組成一個 HTML |
| `check.mjs`、`sheet.py` | 每一句截一張圖，再拼成 3×3 縮圖頁，用來逐句檢查畫面 |
| `vsc-lib.mjs`、`driver.mjs`、`send.mjs`、`cap-*.mjs` | 用 Playwright 開 VS Code（繁中介面、獨立設定檔）實拍；`dlg.ps1` 拍 Windows 的「開啟資料夾」對話框 |
| `ocr-find.ps1` | 用 Windows 內建 OCR 找出截圖裡的帳號名稱，發布前檢查個資用 |
| `install.py` | 把組好的動畫裝回 `HANDBOOK/animation/` |

## 重拍時要注意

1. 啟動 VS Code 前要拿掉 `ELECTRON_RUN_AS_NODE` 這類環境變數，不然 Playwright 連不上。
2. 繁中語言包要開第二次才會生效。
3. 實拍會用到 port 3100。那台電腦如果有別的服務占用 3100，要先停掉，拍完再開回來。
4. 終端機與 Claude Code 畫面會出現 Windows 帳號名稱。`prep.py` 的 `FIX` 會遮掉；新增截圖後先跑 `ocr-find.ps1` 檢查。
5. `vsc-lib.mjs` 裡的工作資料夾 `W` 和 Playwright 的位置是製作時的本機路徑，換電腦要改。
