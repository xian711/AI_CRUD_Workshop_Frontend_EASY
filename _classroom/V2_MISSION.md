# V2 改版任務書（V2_MISSION）

你是剛帶完試教的講師。現在依你自己 COURSE_REPORT.md 第八節的建議＋總管補充，實作 v2 改版。全程自動，不需問人。

## A. 必做（COURSE_REPORT 8.1）
1. **統一規格來源，B 為主 A 為輔**：
   - (A輔) 把 E2E 依賴的「種子 fixture」寫進 PRD-中心裝備物資.md（資料面約定，如種子筆數與內容）。
   - (B主) 放鬆 step4_loop_e2e 的 E2E 測試：selector 改語意化或 data-testid、toast/確認框改模糊比對、E2 改動態筆數、E3 改「編碼符合學員選定規則且不重複」（不再寫死 PW-GEN-003 格式）。
2. **補假綠**：E1 加「第一頁恰 20 列」；E4 補齊 PRD 全部 6 個必填欄位的驗證斷言；E6 回歸測試加「點進人員檢視頁」實際動作。
3. **run-e2e.ps1（與 run-e2e.sh 同步）內建測試檔 SHA-256 比對**：跑前比對 tests 檔雜湊，被竄改就拒絕執行並提示。雜湊基準存在腳本旁的檔案或腳本內常數，改完測試後記得重算。

## B. 值得做（8.2，全部做）
4. nuxt.config.ts 的 3100 與 playwright.config.ts baseURL 改讀環境變數（PORT / BASE_URL，預設值不變）；run-e2e 的 App 身分檢查一併調整。
5. step1_why_harness/demo/ 補 DIFF_SUMMARY.md（純文字 UI 結構與差異摘要）；2.2_design_system/ 補純文字 token 摘要檔。
6. step3 ④ 補 SRS/SDD 最小樣板（已拍板決策／追溯／範圍外／檔案責任四段）。
7. step6 補 run-survey-e2e.ps1（一鍵驗收 10 項）。
8. step6 補 gh-pages 一鍵發布 script（**只寫腳本與說明，絕對不實際發布**）。

## C. 總管補充（必做）
9. 把試教實錄的兩個案例寫進 HANDBOOK step4 教學內容（精簡框格即可）：(a) 兩位學生都守規矩卻走出「停損回報 vs overfit 測試」相反結局＋第三條鐵律；(b) 三道檢查全放行的架構退化（拆共用 composable 自己重寫）。匿名寫「學員A/B」即可。
10. 8.3 的第 15 點也做：在 step4 對抗審查段明講「AI 當審查員時，立場設定決定產出品質」（附勾稽 vs 推翻的實證一句）。

## D. 允許範圍與驗證
- 這次**允許動 App 程式碼的唯一情形**：為 E2E 語意化需要在 solution-app 加 data-testid 屬性（最小幅度），動了要在 IMPROVEMENTS.md 補記。
- E2E 改完必須**實際跑 run-e2e.ps1 對 solution-app 驗證全綠**，貼結果數字。
- 所有變更逐項追加記錄到 _classroom/IMPROVEMENTS.md（標 v2 段落）。

## E. 完成後的 git（只 commit，不 push）
分兩個 commit（訊息用繁中）：
1. 「試教實錄與 20 項教材優化」：現有 working tree 的 7 個文件檔＋ _classroom/ 全部。
2. 「v2：E2E 去假綠與規格統一、腳本強化、教材補充」：本次 A/B/C 的變更。
不要 push——推送前由 Codex 驗收。完成後單獨輸出一行：IMPLEMENT_DONE
