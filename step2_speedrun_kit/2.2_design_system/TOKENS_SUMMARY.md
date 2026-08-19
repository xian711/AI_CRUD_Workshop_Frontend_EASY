# 純文字版 Design System 摘要

> **這份是給「打不開瀏覽器」的人看的。**
> 正常上課請用瀏覽器打開 `DESIGN_SYSTEM.html`——那裡有色票牆、間距尺規、元件目錄，一眼看得完。
> 但如果你在終端機裡、或叫 AI Agent 幫你讀教材，那份 HTML 只會變成幾百行標籤。這份就是把重點撈出來。
>
> 試教時學員回報：「只能讀原始碼，這一段的教學效果至少掉 80%。」這份補的就是撈得回來的部分。

---

## 三句話版本

1. **原始值只有一個來源**：`tokens/design-token.css`。畫面上任何顏色、間距、圓角、字級都從這裡來。
2. **畫面只引用「語意名稱」**，不寫死數值：寫 `bg-primary`、`p-lg`、`text-body-medium`，不要寫 `#C8232C`、`24px`。
3. **改品牌色只改一個地方**：改 `--ui-sys-color-primary`，全站跟著變。這就是「不硬編碼」的實際好處。

> **常見誤會先講清楚：** 你會在 `design-token.css` 裡看到一堆 `#C8232C`、`24px`。
> **那不算硬編碼。** 原始值總得在某個地方定義，那個地方就是這一份——它是**唯一來源**。
> 「禁止硬編碼」禁的是**在元件裡另外寫死數值**，不是禁止 token 檔本身有數值。
>
> 同理，Tailwind 的 `px-3`、`gap-md`、`p-lg` 是**已經 token 化的工具類別，可以用**。
> 名字裡有 `px` 兩個字，不代表它是硬編碼。

---

## token 三層（COMP → SYS → REF），只能由下往上引用

```
REF（原始值層）      --ui-ref-color-red-500、--ui-ref-spacing-24 …
   ↑ 只能被 SYS 引用，元件不准直接用 REF
SYS（語意層）        --ui-sys-color-primary、--ui-sys-spacing-large …
   ↑ 這一層才是你在畫面上會用到的
COMP（元件層）       個別元件的細部微調（少用）
```

**你要記的只有一句：元件裡引用 SYS，不要引用 REF、更不要寫死數值。**

---

## 顏色（SYS 層）

### 品牌色

| token | 值 | 用在哪 |
|---|---|---|
| `--ui-sys-color-primary` | `#C8232C`（防災紅） | 主要按鈕、重點強調 |
| `--ui-sys-color-primary-hover` | `#A01D24` | 主要按鈕的 hover |
| `--ui-sys-color-primary-container` | `#FFF0F0` | 淡底容器 |
| `--ui-sys-color-on-primary` | `#FFFFFF` | 疊在品牌色上的文字 |
| `--ui-sys-color-on-primary-container` | `#6B0C10` | 疊在淡底上的文字 |

### 狀態色（指向 REF 色階，不是直接寫 hex）

| token | 指向 | 用在哪 |
|---|---|---|
| `--ui-sys-color-success` | `green-500` | 成功、狀態「正常」＝綠 |
| `--ui-sys-color-warning` | `amber-400` | 警示、狀態「維修中」＝黃 |
| `--ui-sys-color-error` | `red-500` | 錯誤紅字、狀態「已報廢」＝紅、危險操作 |
| `--ui-sys-color-info` | `pink-400` | 提示 |
| 以上各有 `-hover` 與 `-container` 兩個變體 | | |

### 中性色（介面骨架）

| token | 指向 | 用在哪 |
|---|---|---|
| `--ui-sys-color-surface` | `white` | 卡片、表格底 |
| `--ui-sys-color-surface-variant` | `neutral-50` | 表頭、次要區塊底 |
| `--ui-sys-color-surface-page` | `#F5F6F8` | 整頁背景 |
| `--ui-sys-color-on-surface` | `neutral-950` | 主要文字 |
| `--ui-sys-color-on-surface-variant` | `neutral-700` | 次要文字、說明 |
| `--ui-sys-color-outline` | `neutral-500` | 邊框 |
| `--ui-sys-color-outline-variant` | `neutral-200` | 分隔線 |
| `--ui-sys-color-secondary` | `neutral-300` | 次要按鈕 |

> 另有防災情境專用色（`disaster-*`、`peacetime-*`）與側欄色（`sidebar-*`），本課的 CRUD 頁面用不到，想看再翻 `tokens/design-token.css`。

---

## 間距（只有 7 階，全部走這 7 個）

| token | Tailwind 別名 | 實際值 |
|---|---|---|
| `--ui-sys-spacing-none` | `none` | 0px |
| `--ui-sys-spacing-xxs` | `xxs` | 2px |
| `--ui-sys-spacing-extra-small` | `xs` | 4px |
| `--ui-sys-spacing-small` | `sm` | 8px |
| `--ui-sys-spacing-medium` | `md` | 16px |
| `--ui-sys-spacing-large` | `lg` | 24px |
| `--ui-sys-spacing-extra-large` | `xl` | 40px |

畫面上寫 `p-lg`、`gap-md`、`space-y-sm`，**不要寫 `p-[24px]`**。

---

## 圓角

| token | Tailwind 別名 | 值 |
|---|---|---|
| `--ui-sys-shape-corner-none` | `rounded-none` | 0px |
| `--ui-sys-shape-corner-extra-small` | `rounded-sm` | 2px |
| `--ui-sys-shape-corner-small` | `rounded`（預設） | 4px |
| `--ui-sys-shape-corner-medium` | `rounded-md` | 8px |
| `--ui-sys-shape-corner-large` | `rounded-lg` | 16px |
| `--ui-sys-shape-corner-full` | `rounded-full` | 999px |

---

## 字級

| token | Tailwind 別名 | 值 | 用在哪 |
|---|---|---|---|
| `display-large` | `text-display-large` | 48px | 特大標題 |
| `display-medium` | `text-display-medium` | 32px | 大標題 |
| `headline-large` | `text-headline-large` | 24px | 頁面標題 |
| `headline-medium` | `text-headline-medium` | 20px | 區塊標題 |
| `body-large` | `text-body-large` | 20px | 大內文 |
| `body-medium` | `text-body-medium` | 18px | **一般內文（最常用）** |
| `body-small` | `text-body-small` | 14px | 小內文 |
| `label-large` | `text-label-large` | 18px | 大標籤 |
| `label-medium` | `text-label-medium` | 16px | 標籤 |
| `label-small` | `text-label-small` | 14px | 小標籤、錯誤紅字 |

字重別名：`font-default`／`font-emphasis`／`font-strong`／`font-heavy`。
字型：Noto Sans TC（全繁體中文）。

---

## 這一節你只要帶走什麼

上課到這裡，**你不需要背任何一個 token**。你只要能回答三個問題：

1. **顏色與間距從哪來？** → `tokens/design-token.css`，唯一來源。
2. **畫面怎麼用？** → 引用語意名稱（`bg-primary`、`p-lg`），不寫死數值。
3. **驗收時我看什麼？** → 看畫面有沒有冒出**不在這份清單裡的顏色或間距**。有的話，就是 AI 又自己發明了一套。

第 3 點就是 step1 那張「顏色從哪來」對照表的實務版本。

---

## 想看更多

| 檔案 | 是什麼 | 怎麼開 |
|---|---|---|
| `DESIGN_SYSTEM.html` | 色票牆、間距尺規、元件目錄（**有畫面才看得懂的部分都在這**） | 瀏覽器 |
| `tokens/design-token.css` | REF ＋ SYS 全部原始值 | 文字編輯器 |
| `tokens/comp-tokens.css` | COMP 層（元件細部） | 文字編輯器 |
| `docs/design-system-手冊.md` | 完整手冊 | 文字編輯器 |
| `docs/元件目錄.md` | 元件一覽 | 文字編輯器 |
| `nuxt/tailwind-theme-extend.md` | token 怎麼接到 Tailwind 別名 | 文字編輯器 |
