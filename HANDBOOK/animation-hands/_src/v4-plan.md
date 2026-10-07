# 第四版（v3.1）講稿與場景計畫（2026-10-06）

作者回饋（8 點）→ 動畫要改的事：
1. SDD＝規格驅動開發（SpecKit 那種流程），不是「設計文件」。文件：SRS、設計文件（DESIGN-）、圖（DIAGRAMS- html）。
2. 文件多用圖（UML），字大圖大，看圖取代看程式碼。
3. Step 3 敘事：精簡 prompt＋PRD → AI 出選擇題 → 文件（圖）→ 任務 → 做完 → 驗收還是有小修改要來回講 → 引到 Step 4：找一個 Agent 取代「你來回要 AI 修」的角色＝對抗審查。
   收尾：下次新模組只要給 SPEC → SDD 流程用選擇題釐清、產文件 → LOOP 實作 → 你去喝茶。
4. 對抗審查用 Playwright 開瀏覽器做視覺審查（截圖）。
5. LOOP 產出：LOOP-LOG.md（機器看）、LOOP-REPORT.html（人看、圖文）、playwright-report（測試報告）、文件同步（SRS／設計文件／圖 標 step4 LOOP 後）。
6. 播放器 RWD（子代理 A）。
7. 審查：Codex gpt-6-astra ＋ agy（Opus 5.5）不同角色。
8. 之後另做「手把手 step by step 工作坊版」（v5，之後）。

## 要改的段（沿用 28 段架構，Step 3／4 重寫）
- 1 開場：第 3 句 SDD 改成「先寫菜單和做法再下鍋；菜改了，菜單跟著改」。卡片 SDD 副標「先文件再程式」。
- 2 課程地圖：Step 3「用 SDD 做新模組」OK（SDD 指流程）。
- 9 複製還是共用：末句「Step 3 的 SDD 裡」→「Step 3 的設計文件裡」。
- 10 Design System：末句「SDD 裡會留下證據」→「設計文件裡」。
- 11 SDD 流程：改成 SpecKit 式六步：規格(PRD) → 選擇題釐清 → SRS → 設計文件＋圖 → 任務清單 → 程式；強調「程式改了文件跟著改」。
- 12 PRD：加一句「規格要簡潔：12 欄、3 個決定，一頁看完」。
- 13 實拍貼 prompt：新 prompt 4 行（第一行就說走 SDD）。
- 14 選擇題：實拍新的 D1～D3（＋AI 自己加的）。
- 15 文件先出來：任務清單 → SRS／設計文件／圖 → 開工 → 做完。
- 16 打開 SRS（新拍）。
- 17 打開設計文件＋圖（新拍：DIAGRAMS 四張圖，字大圖大；「看圖不用看程式」）。
- 18 驗收＋小修來回（新拍：發現兩個小落差，各講一次 AI 改一次）→ 痛點：你還是得坐在電腦前面一來一回。
- 19 別再一問一答：引入「找一個 Agent 取代你來回要 AI 修的角色」＝對抗審查。
- 20 LOOP 流程圖＋鐵律（加：產出 紀錄 MD／報告 HTML／測試報告／文件同步）。
- 21 實拍 LOOP prompt（4 行，照規矩檔）→ AI 自己挑埠 → 第 1 輪紅。
- 22 全綠 → 子代理用 Playwright 截圖審查（新拍：agent pill、截圖檔）。
- 23 審查挑到什麼（新拍）。
- 24 產出：LOOP-LOG.md、LOOP-REPORT.html、playwright-report（新拍三張）。
- 25 文件同步（新拍：SRS／設計文件／圖 標 step4 LOOP 後）＋ 報告結論、選擇題裁決。
- 26 備案別家 AI → 改成「下次新模組：只給 SPEC → SDD 選擇題釐清 → 文件 → LOOP 實作 → 去喝茶」＋備案一句。
- 27 回公司三步（SRS／設計文件）。
- 28 四句話：第 2 句「SDD 先文件再程式，程式改了文件跟著改」OK。

## 新拍清單（檔名）
- Step 3：vs26-step3-prep（重拍）、cc01-empty、cc02-prompt-pasted、cc03-reading、cc04-question、cc05/06（D2/D3）、cc09*（AI 自問題、任務清單）、cc11v4-tNNN（進度）、cc12-done
- 文件：v4-srs-*（預覽）、v4-design-*（預覽）、v4-diagrams-*（Chrome，4 張圖）
- 驗收：ea01～ea08（新埠）
- 小修：cc13-fix1-ask、cc13-fix1-done、cc14-fix2-ask、cc14-fix2-done
- Step 4：cc19-root-explorer、cc20-loop-pasted、cc21-port（AI 換埠）、cc23v4-red、cc23v4-agent、cc23v4-shots（Playwright 截圖）、cc25v4-*（報告）
- 產出：v4-loop-log（編輯器）、v4-loop-report-*（Chrome）、v4-pw-report（Chrome）、v4-doc-sync-*（預覽／diff）
