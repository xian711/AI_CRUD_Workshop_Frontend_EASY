# 課後驗收題｜做一個能上線的課程回饋問卷

> **這一題沒有講師帶。你一個人、用這門課學到的方法，從零做到上線。**
> 預估 40～60 分鐘。做完你會有一個**真的網址**，可以傳給同事看。

---

## ⛔ 一件事先講

`solution/` 資料夾裡有參考解。**請先不要打開它。**

理由跟 step3 一樣：這一題練的是「提需求、驗收、排除問題」，不是「照抄」。
真的卡住兩次以上再開，而且開之前先把你卡在哪寫下來——那句話比答案值錢。

---

## 你要做出什麼

一個課程回饋問卷網頁，**發布到網路上**，任何人用手機或電腦打開網址就能填。

> ⚠️ **先講清楚這一版的邊界，免得你把 demo 當成正式問卷。**
> 這一版**沒有後端**，回覆存在**填答者自己那台裝置的瀏覽器**裡。所以：
> 同事用他的手機打開你的網址填完，**你在自己電腦的 `/survey/admin` 一筆也看不到**。
> 它適合的是：**單機 demo、會場共用的那一台平板／筆電**。
> 要變成真的能收全班回饋的問卷，還缺後端集中儲存、管理頁登入、個資告知與保存期限——那是下一門後端課的事。

| 路由 | 給誰 | 做什麼 |
|---|---|---|
| `/survey` | 填答者 | 填 8 題、送出、看到成功訊息 |
| `/survey/admin` | 主辦方 | 看全部回覆、匯出 CSV、清空 |

需求細節見同資料夾的 **`PRD-課程回饋問卷.md`**（8 個欄位、7 條行為規則、5 條非功能需求）。

> **為什麼問卷沒有後端？** 因為那是下一門課的事。
> 這一版資料存在瀏覽器裡，程式碼留一行 `// TODO: DEV 串接 POST /api/survey` 接縫。
> 後端課要做的，就是把那一行換成真的 API——**呼叫端（頁面）幾乎不用改**。
>
> 但要誠實說：**一行 TODO 是「接縫位置」，還不是「API 契約」。** 換成真後端之前，至少還要跟後端談定這幾件事：
> request／response 的欄位長相、錯誤格式、要不要登入、送出失敗怎麼重試、重送怎麼去重、
> `id` 與 `submittedAt` 由前端還是伺服器產生。談定了，前後端才敢平行開工。

---

## 四步走

### ① 複製範本成你的問卷專案

```powershell
# Windows（PowerShell）｜在工作坊根目錄執行
# ⚠ 排除 node_modules / .nuxt / .output：前者會讓複製變慢甚至失敗，後兩者是舊快取、帶過去會讓新專案一開就 500
robocopy step2_speedrun_kit\2.1_sample_app\sample-app step6_survey\my-survey-app /E /XD node_modules .nuxt .output | Out-Null
Copy-Item step6_survey\PRD-課程回饋問卷.md step6_survey\my-survey-app\
cd step6_survey\my-survey-app
pnpm install
```

```bash
# macOS／Linux（終端機）｜在工作坊根目錄執行
# ⚠ 排除 node_modules / .nuxt / .output（都會自動重建）
rsync -a --exclude node_modules --exclude .nuxt --exclude .output step2_speedrun_kit/2.1_sample_app/sample-app/ step6_survey/my-survey-app/
cp step6_survey/PRD-課程回饋問卷.md step6_survey/my-survey-app/
cd step6_survey/my-survey-app
pnpm install
```

> 跟 step3 一樣：**harness 四件跟著範本一起被複製過去**，你不用做任何設定。
> **不要去刪來源 `sample-app` 底下的東西**——那是全班共用的範本正本。上面的指令已經在複製時就排除掉了。

### ② 在專案資料夾裡開 AI Agent，貼這一段

**整段複製，只貼這一次。**

```
你是本專案的前端工程師。我們要用現成的 CRUD 標準範本，做一個「課程回饋問卷」網頁，做完要能發布到 GitHub Pages。

請先「依序」讀完專案根目錄的四份文件，讀完再動作：
1. CLAUDE.md（專案憲法）
2. CODE-RULES-ui-本專案.md（前端鐵律：色碼、命名、行數、驗證）
3. 使用說明-複製範本開發新模組.md（複製範本的標準流程與八檔心法）
4. PRD-課程回饋問卷.md（需求：8 題、兩個頁面、7 條行為規則）

然後直接做完。要做的事：

一、照 PRD 做出兩個頁面
- /survey：填答頁
- /survey/admin：管理頁（看全部回覆、匯出 CSV、清空全部）

二、照範本的「複製 vs 共用」心法決定哪些檔複製改名、哪些直接共用。跟「問卷回覆這個實體長什麼樣子」有關的複製改名；通用機制（驗證引擎、CSV 匯出、確認框、欄位元件的作法）直接共用或比照，不要重寫一套。

三、資料層用 composable 單例 ＋ localStorage 持久化，所有函式回 Promise；並在「送出問卷」那個函式裡留一行 // TODO: DEV 串接 POST /api/survey，讓之後換成真 API 時呼叫端一行都不用改。

四、首頁導向 /survey。原本的人員 CRUD 範本頁面留著不要刪，但導覽列改成問卷用的。

五、設定成可以發布到 GitHub Pages 子路徑：
- nuxt.config 加 app.baseURL，讀環境變數 NUXT_APP_BASE_URL，預設 '/'
- public/ 放一個空的 .nojekyll 檔
- package.json 加一個發布用的 script

六、遵守 harness 規則：禁止硬編碼色碼與 px、禁止 console.log、單檔不超過 500 行、必填標紅星、錯誤紅字顯示在欄位下方並聚焦第一個錯誤欄、危險操作二次確認且確認鈕寫明動作、送出防重複點擊、全繁體中文。

做完後跑 pnpm build 確認 0 error，然後回報：你複製改名了哪些檔、直接共用了哪些、8 題各用什麼元件與驗證、發布指令怎麼下。
```

### ③ 驗收（照下面的清單自己核）

```
pnpm dev
```

開 <http://localhost:3100/survey> 逐項核：

> **懶得一項一項點？有一鍵驗收腳本。**
> 在 `step6_survey` 目錄執行（App 要先 `pnpm dev` 起來）：
>
> ```powershell
> # Windows
> powershell -ExecutionPolicy Bypass -File .\run-survey-e2e.ps1
> ```
>
> ```bash
> # macOS／Linux
> bash run-survey-e2e.sh
> ```
>
> 它會用真瀏覽器把 **S1～S9** 跑一遍（就是下面清單的第 1～9 項），再幫你做 **S10** 的硬編碼色碼掃描，
> 最後印一張總結表。**第 11 項它刻意不幫你做**——那一項的重點就是「你要親眼看到」。
>
> 腳本是**通用寫法**：你的 8 題用什麼元件、按鈕寫什麼字、`localStorage` 的 key 叫什麼，它都不管。
> 只要你照 PRD 做，它就過得了。跑不動的步驟它會直說，不會假裝通過。
> 埠不是 3100 的話：`$env:PORT = '3200'`（Windows）／`PORT=3200 bash run-survey-e2e.sh`（Mac）。

| # | 驗收點 | 期望 |
|---|---|---|
| 1 | 必填留空按送出 | 欄位**下方**出現紅字，畫面聚焦第一個錯誤欄，不是只跳 toast |
| 2 | 正常填完送出 | 成功訊息、表單清空、可以再填一份 |
| 3 | 連點送出鈕 | 只送出一筆（防重複） |
| 4 | 送出後重新整理頁面 | 資料還在（localStorage） |
| 5 | 開 `/survey/admin` | 看得到剛才那筆，欄位對得上 |
| 6 | 沒有任何回覆時的 admin | 顯示空狀態，不是空表格 |
| 7 | 匯出 CSV | 用 Excel 開，**中文不亂碼**，檔名含日期 |
| 8 | 清空全部 | 跳二次確認，確認鈕寫明動作（不是空泛的「確認」） |
| 9 | 視窗縮到手機寬度 | 每一題都還能正常填答 |
| 10 | 搜尋 `#` 開頭的色碼（見下方說明） | **你新增的檔案裡**不應該有硬編碼色碼 |
| 11 | 用**無痕視窗**送出一筆，再回原本的視窗看 `/survey/admin` | **看不到那一筆**。這不是 bug，是這一版沒有後端的真實邊界——親眼看過一次，你就不會把它當成可以收全班回饋的問卷 |

> **第 10 項要跑「兩條」指令，不要只跑一條。** 直接掃全專案一定會掃到幾百行——那些是 Design System 的 token 正本（`assets/css/design-token.css`、`comp-tokens.css`）、規則文件與既有 SVG，它們**本來就該有色碼**，那是唯一來源。你要驗的是「**你新增的檔案**有沒有硬編碼」：
>
> ```powershell
> # 第 1 條：看看全專案的色碼集中在哪幾個檔（預期：只有 token 正本、規則文件、SVG）
> Get-ChildItem -Recurse -File -Include *.vue,*.ts,*.css |
>   Where-Object { $_.FullName -notmatch 'node_modules|\.nuxt|\.output' } |
>   Select-String -Pattern '#[0-9a-fA-F]{3,8}\b' | Group-Object Path | Select-Object Count,Name
>
> # 第 2 條（這條才是驗收）：只掃你新增的檔，預期「沒有任何輸出」
> Select-String -Path pages\survey\*.vue,composables\useSurveyResponses.ts -Pattern '#[0-9a-fA-F]{3,8}\b'
> ```
>
> 第 2 條沒有輸出＝通過。（`Select-String` 找不到東西時不會印任何字，這是正常的，不是指令壞掉。）

沒過的項目，用 step3 的修正心法：**一次只修一個問題、描述「我看到什麼 vs 我期望什麼」、同一個問題修兩次沒好就換個說法重講。**

### ④ 發布到 GitHub Pages

> **有一鍵發布腳本，而且預設是「演練模式」——不會真的推出去。**
> 在你的問卷專案資料夾（`my-survey-app`）裡執行：
>
> ```powershell
> # Windows｜演練：只建置＋檢查，什麼都不推
> powershell -ExecutionPolicy Bypass -File ..\deploy-gh-pages.ps1 -RepoName my-survey-app
> ```
>
> ```bash
> # macOS／Linux｜演練
> bash ../deploy-gh-pages.sh --repo-name my-survey-app
> ```
>
> 它會幫你做四件事再停下來：① 確認你在對的資料夾 ② 設好 baseURL 建置並檢查資源前綴與 `.nojekyll`
> ③ **掃一遍產出有沒有像帳密、金鑰、手機號、身分證號、內網位址的東西** ④ 印出「會推什麼、推到哪」。
>
> 確認都沒問題，再加 `-RepoUrl ... -Push`（Mac：`--repo-url ... --push`）才會真的推。
> **推之前請先讀完下面那四點手動檢查**——腳本擋得住技術性的錯，擋不住「這份資料本來就不該公開」。

**先產生靜態檔（想自己一步一步做的話）：**

```powershell
# Windows｜把 你的帳號 與 repo 名稱 換成你自己的
$env:NUXT_APP_BASE_URL = "/my-survey-app/"
pnpm generate
```

```bash
# macOS／Linux
NUXT_APP_BASE_URL="/my-survey-app/" pnpm generate
```

產出在 `.output/public/`。

**推之前先做 4 件事（這一段是對外公開，做錯了全世界都看得到）：**

1. **確認你在對的資料夾**：`pwd`（Windows：`Get-Location`）應該是 `.output/public`，不是專案根目錄。
2. **確認裡面沒有不該公開的東西**：整包看一遍——有沒有真實姓名、電話、公司內網網址、帳號密碼、內部文件。這一題的種子資料是虛構的，但如果你順手改成公司真實名單，就會連著推上去。
3. **確認 `.nojekyll` 有被帶上**：它是隱藏檔，很多工具預設不顯示、`git add .` 卻會收。Windows 用 `Get-ChildItem -Force` 確認它在。
4. **知道怎麼撤回**：repo 頁面 → Settings → Pages → Source 選 **None** 可以立刻下架；Settings 最下面 → **Delete this repository** 可以整個刪掉。**先知道怎麼關，再按上線。**

**再推上 GitHub：**

1. 在 GitHub 開一個新的 public repo，名字就叫 `my-survey-app`（要跟上面的 `NUXT_APP_BASE_URL` 一致）。
2. 把 `.output/public/` 裡面的**內容**（不是資料夾本身）推到那個 repo 的 `main` 分支。
3. repo 頁面 → **Settings** → 左側 **Pages** → Source 選 **Deploy from a branch** → 分支選 `main`、資料夾選 `/ (root)` → Save。
4. 等 1～2 分鐘，網址是 `https://你的帳號.github.io/my-survey-app/`。

> **注意：GitHub Pages 免費方案只支援 public（公開）repo。** 也就是說，你推上去的每一個檔案，任何人都看得到。這就是上面第 2 點要先掃一遍的原因。

> **三個最常見的坑（第三個是我們實測時真的踩到的）：**
>
> ① **網址開起來一片空白** → 十之八九是 `NUXT_APP_BASE_URL` 沒設或跟 repo 名稱對不上。重設後重跑 `pnpm generate` 再推一次。
>
> ② **CSS 全部跑掉** → 少了 `.nojekyll`。GitHub Pages 預設會忽略底線開頭的資料夾，而 Nuxt 產出的正是 `_nuxt/`。在 `.output/public/` 根目錄放一個空的 `.nojekyll` 檔就好。
>
> ③ **`pnpm build` 或 `pnpm generate` 之後回來跑 `pnpm dev`，畫面「可能」變成 500，錯誤訊息寫 `useColorMode is not defined`** →
> （試教時兩台機器一台在 `build` 後中招、一台在 `generate` 後沒事，所以是「可能」不是「一定」。**判斷要看瀏覽器，不要看終端機**——終端機可能全綠、頁面照樣 500。）
> 這不是你的程式壞了。`pnpm generate` 會把建置快取（`.nuxt/`）寫成「發布用」的設定，dev 再讀到它就會爆。
> **解法：刪掉 `.nuxt` 和 `.output` 兩個資料夾，重跑 `pnpm dev` 就好**（它們都是產物，砍了會自動重生）。
>
> ```powershell
> # Windows
> Remove-Item -Recurse -Force .nuxt, .output
> pnpm dev
> ```
>
> ```bash
> # macOS／Linux
> rm -rf .nuxt .output
> pnpm dev
> ```
>
> 這個坑值得記起來：**「build 過了」不等於「跑得起來」。** 它 `pnpm build` 完全 0 error，但一開瀏覽器就 500。

---

## 卡住怎麼辦

跟 step0 同一套：**把完整錯誤訊息貼給 AI，要它講原因＋給可複製的指令。**同一個問題修兩次還沒好，才打開 `solution/`。

---

## 做完你證明了什麼

| 你做到的事 | 對應這門課的哪一段 |
|---|---|
| 複製範本、分清楚哪些複製哪些共用 | step2 的 8 核心檔心法 |
| 一頁 PRD ＋ 一個 prompt 生出完整模組 | step3 的生成流程 |
| 照清單逐項驗收、用修正心法收斂 | step3 的驗收與修正 |
| 產出的程式守住色票、驗證、危險操作規則 | step1 的 harness 差別 |
| 留好 API 接縫 | 下一門後端課的接點 |

**而且這次沒有人幫你出 PRD 的決策、沒有人幫你看紅燈。** 這就是回公司之後的真實樣子。
