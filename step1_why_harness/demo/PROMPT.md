# 同一句需求，兩種給法

這個 demo 的重點：**需求一模一樣，唯一的差別是有沒有附上「規矩」（harness）。**

---

## 版本 A — 沒有 harness（只給一句話）

```
做一個防災志工名單頁面，可以新增、刪除志工（姓名、電話、血型），
要能在瀏覽器直接打開。
```

就這樣。AI 收到後只能自由發揮，樣式、用字、驗證全憑它當下高興。
產出 → `no-harness.html`

---

## 版本 B — 有 harness（同一句話 ＋ 團隊規矩）

```
做一個防災志工名單頁面，可以新增、刪除志工（姓名、電話、血型），
要能在瀏覽器直接打開。

＝＝＝ 請遵守以下專案規則（節錄自 CODE-RULES-ui-本專案.md）＝＝＝

【樣式】
- 禁止硬編碼 hex / px；顏色一律用 design token 語意變數。
- 品牌主色為防災紅，色票如下（宣告在 :root）：
    --ui-sys-color-primary:            #C8232C   /* 品牌紅 */
    --ui-sys-color-primary-hover:      #A01D24
    --ui-sys-color-primary-container:  #FFF0F0
    --ui-sys-color-on-primary:         #FFFFFF
    --ui-sys-color-error:              #FB2C36   /* 錯誤紅字 */
    --ui-sys-color-error-container:    #FEF2F2
    --ui-sys-color-on-surface:         #0A0A0A
    --ui-sys-color-on-surface-variant: #404040
    --ui-sys-color-outline-variant:    #E5E5E5
    --ui-sys-color-surface:            #FFFFFF
    --ui-sys-color-surface-page:       #F5F6F8
    --ui-sys-color-success:            #00C16A
  間距用 4 / 8 / 16 / 24 / 40，圓角用 4 / 8 / 16。
  字型 Noto Sans TC，全繁體中文。

【表單互動】
- Label 在欄位上方；必填欄位標紅色 * 。
- 欄位級錯誤：驗證失敗時，紅字錯誤訊息顯示在該欄位「下方」。
- 危險操作（刪除）要二次確認，且確認鈕文字要寫明動作（例如「確認刪除」）。
- 送出鈕在處理當下要防重複點擊。

【驗證】
- 必填不可空白；電話用具名常數 PHONE_PATTERN 做格式驗證（台灣手機 09 開頭共 10 碼）。
- 血型為固定選項，用下拉選單：A / B / AB / O。

【程式品質】
- 具名常數，不散落魔術數字 / 硬編碼色碼；無 console.log、無死碼。
- 響應式：手機寬度也要能正常閱讀與操作。
```

產出 → `with-harness.html`

---

> 兩份 HTML 功能完全一樣（都能新增、刪除、操作記憶體中的名單）。
> 打開它們並排比較，你會發現差的不是功能，是「像不像同一個團隊做出來的東西」。
