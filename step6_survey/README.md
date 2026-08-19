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

| 路由 | 給誰 | 做什麼 |
|---|---|---|
| `/survey` | 填答者 | 填 8 題、送出、看到成功訊息 |
| `/survey/admin` | 主辦方 | 看全部回覆、匯出 CSV、清空 |

需求細節見同資料夾的 **`PRD-課程回饋問卷.md`**（8 個欄位、7 條行為規則、5 條非功能需求）。

> **為什麼問卷沒有後端？** 因為那是下一門課的事。
> 這一版資料存在瀏覽器裡，程式碼留一行 `// TODO: DEV 串接 POST /api/survey` 接縫。
> 後端課要做的，就是把那一行換成真的 API——**呼叫端一行都不用改**。

---

## 四步走

### ① 複製範本成你的問卷專案

```powershell
# Windows（PowerShell）｜在工作坊根目錄執行
Copy-Item -Recurse step2_speedrun_kit\2.1_sample_app\sample-app step6_survey\my-survey-app
Copy-Item step6_survey\PRD-課程回饋問卷.md step6_survey\my-survey-app\
cd step6_survey\my-survey-app
pnpm install
```

```bash
# macOS／Linux（終端機）｜在工作坊根目錄執行
cp -R step2_speedrun_kit/2.1_sample_app/sample-app step6_survey/my-survey-app
cp step6_survey/PRD-課程回饋問卷.md step6_survey/my-survey-app/
cd step6_survey/my-survey-app
pnpm install
```

> 跟 step3 一樣：**harness 四件跟著範本一起被複製過去**，你不用做任何設定。
> 複製前先刪掉來源的 `node_modules` 會快很多，複製完再 `pnpm install`。

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
| 10 | 搜尋整個專案 `#` 開頭的色碼 | 你新增的檔案裡**不應該有**硬編碼色碼 |

沒過的項目，用 step3 的修正心法：**一次只修一個問題、描述「我看到什麼 vs 我期望什麼」、同一個問題修兩次沒好就換個說法重講。**

### ④ 發布到 GitHub Pages

**先產生靜態檔：**

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

**再推上 GitHub：**

1. 在 GitHub 開一個新的 public repo，名字就叫 `my-survey-app`（要跟上面的 `NUXT_APP_BASE_URL` 一致）。
2. 把 `.output/public/` 裡面的**內容**（不是資料夾本身）推到那個 repo 的 `main` 分支。
3. repo 頁面 → **Settings** → 左側 **Pages** → Source 選 **Deploy from a branch** → 分支選 `main`、資料夾選 `/ (root)` → Save。
4. 等 1～2 分鐘，網址是 `https://你的帳號.github.io/my-survey-app/`。

> **三個最常見的坑（第三個是我們實測時真的踩到的）：**
>
> ① **網址開起來一片空白** → 十之八九是 `NUXT_APP_BASE_URL` 沒設或跟 repo 名稱對不上。重設後重跑 `pnpm generate` 再推一次。
>
> ② **CSS 全部跑掉** → 少了 `.nojekyll`。GitHub Pages 預設會忽略底線開頭的資料夾，而 Nuxt 產出的正是 `_nuxt/`。在 `.output/public/` 根目錄放一個空的 `.nojekyll` 檔就好。
>
> ③ **發布完回來跑 `pnpm dev`，畫面變成 500，錯誤訊息寫 `useColorMode is not defined`** →
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
