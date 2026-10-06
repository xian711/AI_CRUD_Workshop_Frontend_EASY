# 手把手教學動畫的原始檔

上一層的 `index.html` 是組裝好的動畫，用瀏覽器打開就能看。這個資料夾是改字幕或重拍時用的原始檔。

## 第四版（目前使用）：SDD＝規格驅動開發、文件有圖、LOOP 交報告

跟第三版同一套做法（講稿驅動＋預錄配音），差別在內容：

1. **講稿**：`script_v4.py`。SDD 一律指「規格驅動開發」這套流程；文件叫 SRS、設計文件（DESIGN）、圖（DIAGRAMS）。
2. **場景**：`scenes-v4.js`；組裝 `./mk-v4.sh out4 段號`；資料檔由 `build_v4_data.py` 產生；配音 `python make_v4_audio.py`（同一個配音資料夾，只錄有改的句子）。
3. **實拍（2026-10-07）**：Step 3 文件階段用 Opus 5.5（effort High），說「開工」前切到 Sonnet 5.5；Step 4 LOOP 用 Sonnet 5.5，對抗審查子代理用 Opus 5.5。受測 App 不用 3100 埠，AI 自己換埠。
4. **新的截圖腳本**：`mk-c8.py`（SRS／DESIGN／TASKS 的 Markdown 預覽，拍之前用 DOM 文字取代把 git 帳號遮掉）、`cap-page.mjs`（任何網頁：DIAGRAMS、LOOP-REPORT、Playwright 測試報告）、`cap-eq.mjs`（新模組驗收畫面，`BASE=http://localhost:埠`）、`build-wait.sh`（等 Claude Code 跑完並每分鐘截圖）。
5. **播放器 RWD**：`engine-v3.html` 用 JS 量實際高度算舞台寬度，1920×1080 的螢幕整個播放器在同一屏；`t-v3-rwd.mjs` 是量測腳本。

## 第三版（舊檔，保留參考）：講稿驅動＋預錄配音

1. **講稿唯一來源**：`script_v3.py`（28 段 104 句）。每段寫了章節、標題、誰講（小芸＝方法和觀念，阿哲＝實拍示範）、畫面、句子。字幕＝講稿＝配音。
2. **改一句話**：改 `script_v3.py` 那一句 → 跑 `python make_v3_audio.py <配音資料夾>`（只重錄有改到的句子，要環境變數 `GEMINI_API_KEY`，走 Vertex AI 的 Gemini 3.8 Flash TTS）→ `./mk-v3.sh out3 段號` 組裝並截圖檢查。
3. **念法和字幕不同**：講稿裡寫成 `(字幕, 念法)`；常用的念法替換（例如 `localhost:3100` 念「localhost 三一零零」）在 `make_v3_audio.py` 的 `SPOKEN`。
4. **配音檢查**：每句錄完由另一個 Gemini 模型逐字聽寫，跟講稿差太多就重錄（最多 3 次）；結果在 `audio-manifest.json`（`heard` 是聽寫、`drift` 是偏差分數）。
5. **場景**：`scenes-v3.js`，用 `sc3(段號, 畫面, [每句動作…])` 寫；句數跟講稿不同時，瀏覽器主控台會警告。播放器是 `engine-v3.html`。
6. **口吻規則**：`講稿風格卡.md`（第三版改成兩人分段講、不對話）。

## 第二版的寫法（舊檔，保留參考）

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
3. 第一、二版實拍用 port 3100；第四版起不停別的服務，讓被拍的 AI 自己換埠（這也是課程教的做法）。
4. 終端機與 Claude Code 畫面會出現 Windows 帳號名稱。`prep.py` 的 `FIX` 會遮掉；新增截圖後先跑 `ocr-find.ps1` 檢查。
5. `vsc-lib.mjs` 裡的工作資料夾 `W` 和 Playwright 的位置是製作時的本機路徑，換電腦要改。
