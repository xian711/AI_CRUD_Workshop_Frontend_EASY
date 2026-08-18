# 防災協作中心 Design System Kit

這是一份從「防災協作中心」前端專案抽取出來的**設計系統封裝包**，目的有二：

1. **供後續新專案套用** — 把 token CSS 與 Nuxt UI 設定搬過去，新專案立即擁有一致的視覺語言。
2. **供教育訓練** — `docs/` 內含完整教學手冊與元件目錄，讓新進成員理解三層 Token 架構與元件規範。

技術基礎：**Nuxt 3 + Vue 3 + Nuxt UI v2（Headless UI + Tailwind CSS）**，token 以 CSS Custom Properties 實作，跨框架通用。

---

## 內容物導覽

```
2.2_design_system/                  ← 回公司整包帶走時可自行改名（原名 design-system-kit）
├─ README.md                      ← 你正在讀這份：安裝與導覽
├─ tokens/
│   ├─ design-token.css           ← REF + SYS 層 token（原始色票 + 語意別名 + 字型 @font-face）
│   └─ comp-tokens.css            ← COMP 層 token（逐元件的視覺決策）
├─ nuxt/
│   ├─ app.config.ts              ← Nuxt UI 元件樣式覆蓋（Button/Input/Card/Badge/... 綁 token）
│   └─ tailwind-theme-extend.md   ← nuxt.config.ts 的 theme.extend + CSS 載入順序 + 字型設定
└─ docs/
    ├─ design-system-手冊.md      ← 完整教學手冊（Token 架構、色彩、字體、間距、元件規範、決策樹、無障礙、反例）
    └─ 元件目錄.md                ← App* 共用元件 API 目錄（Props/Events/範例/注意事項）
```

| 我想…… | 看這個檔案 |
|--------|-----------|
| 理解整個設計系統怎麼運作 | `docs/design-system-手冊.md` |
| 查某個共用元件怎麼用 | `docs/元件目錄.md` |
| 拿到實際的 token 值 | `tokens/design-token.css`、`tokens/comp-tokens.css` |
| 設定 Nuxt UI 讓元件吃 token | `nuxt/app.config.ts` |
| 設定 Tailwind / CSS 載入 / 字型 | `nuxt/tailwind-theme-extend.md` |

---

## 在全新 Nuxt 3 專案安裝啟用（Step by Step）

### 前置需求

- Node.js 18+（建議 20 LTS）
- 套件管理器 pnpm（原專案採 pnpm；npm / yarn 亦可，指令自行替換）

### Step 1 — 建立 Nuxt 3 專案並安裝 Nuxt UI

```bash
# 建立專案（若已有專案可略過）
pnpm dlx nuxi@latest init my-app
cd my-app

# 安裝 Nuxt UI v2（內含 Tailwind CSS 與 Headless UI，不需另裝）
pnpm add @nuxt/ui@^2
```

> Nuxt UI **v2** 對應本 kit 的 `app.config.ts` 寫法（`ui: { button: { ... } }`）。Nuxt UI v3 的設定結構不同，請勿混用版本。

### Step 2 — 放入 token CSS

把 `tokens/` 的兩個 CSS 複製到專案的 `assets/css/`：

```bash
mkdir -p assets/css
cp <kit>/tokens/design-token.css assets/css/design-token.css
cp <kit>/tokens/comp-tokens.css  assets/css/comp-tokens.css
```

### Step 3 — 設定 `nuxt.config.ts`

打開 `nuxt/tailwind-theme-extend.md`，把裡面三段設定貼進 `nuxt.config.ts`：

1. `modules: ['@nuxt/ui']`
2. `css: [...]`（**先 design-token 再 comp-tokens**，順序固定）
3. `tailwindcss.config.theme.extend`（spacing / fontSize / fontWeight / borderRadius / colors）
4. `app.head`（Google Fonts + 粉圓體 + Typekit，可依需求刪減）

最小可用範例：

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxt/ui'],
  css: [
    '~/assets/css/design-token.css',
    '~/assets/css/comp-tokens.css',
  ],
  tailwindcss: {
    config: {
      theme: { extend: { /* 見 tailwind-theme-extend.md，整段貼上 */ } },
    },
  },
  app: {
    head: { /* 見 tailwind-theme-extend.md 的字型設定 */ },
  },
})
```

### Step 4 — 放入 `app.config.ts`

把 `nuxt/app.config.ts` 複製到專案**根目錄**（與 `nuxt.config.ts` 同層）：

```bash
cp <kit>/nuxt/app.config.ts ./app.config.ts
```

這份檔案透過 Nuxt UI 的 `ui` 設定，把每個元件（Button、Input、Card、Badge、Modal、Select、Table、Pagination、Tabs、Checkbox、Radio、Textarea、Accordion、Breadcrumb…）的 class 綁到 COMP token 上。這是「讓 Nuxt UI 服從設計系統」的主要入口。

> `app.config.ts` 開頭有 `// @ts-nocheck`，是為了迴避 Nuxt UI v2 已知的 `AppConfigInput` 循環型別問題（TS7022/TS2615）。若你的專案要保留型別檢查，可另建 `types/nuxt-ui.d.ts` 擴充 `AppConfig`（原專案即如此）。

### Step 5 — 驗證

啟動 dev server：

```bash
pnpm dev
```

在任一頁面放一顆按鈕確認 token 生效：

```vue
<template>
  <div class="p-lg bg-surface-page min-h-screen">
    <UButton color="primary" size="md">主要按鈕</UButton>
    <UButton color="secondary" size="md">次要按鈕</UButton>
    <p class="mt-md text-body-large font-default text-on-surface">
      這行字應是 Noto Sans TC、20px、主要文字色。
    </p>
  </div>
</template>
```

- 主要按鈕應為**品牌紅底白字**、圓角 8px。
- `bg-surface-page`、`text-body-large`、`p-lg` 等語意類別應正確套用。
- 若按鈕仍是 Nuxt UI 預設藍或圓角不對，檢查：CSS 載入順序、`app.config.ts` 是否在根目錄、`theme.extend.colors` 是否貼齊。

### Step 6（選用）— 帶入共用元件

`docs/元件目錄.md` 列出的 `App*` 元件（AppStepper、AppDrawer、AppConfirmModal、AppTableFooter…）是**原專案的 Vue SFC**，本 kit 未打包原始碼。若要沿用，從原專案 `frontend/components/` 複製對應 `.vue`，並確認其依賴的 composable（如 `useSidebar`、`useAuth`）一併帶入或改寫。元件內部樣式已全數使用 token，複製後即符合設計系統。

---

## 三層 Token 架構速覽

```
COMP  →  SYS  →  REF        ✅ 只能向上引用
--ui-comp-button-bg-primary-default
        → --ui-sys-color-primary
                → --ui-ref-color-...（原始 hex）
```

- **REF**：原始數值（Tailwind 色票 50–950、px 間距、字級、圓角）。開發時**不直接使用**。
- **SYS**：語意別名（`primary` / `success` / `on-surface` / `spacing-medium`…）。設計決策在這一層。
- **COMP**：逐元件的視覺 token（`--ui-comp-{元件}-{屬性}-{變體}-{狀態}`）。元件實作只查這一層。

詳見 `docs/design-system-手冊.md`。

---

## 重要提醒（給導入者）

- **primary 主色是品牌紅 `#C8232C`**，不是天空藍。原專案部分舊文件（`frontend/CLAUDE.md`、`design-system-guideline.md`、`comp-tokens.css` 頂部註解）曾寫「primary = sky-600 #0084d1」，已於 **2026-07-11 依 CSS 實檔校正**；一律以 `tokens/design-token.css` 的實際值為準。手冊「已知不一致」章節有完整清單與修正狀態。
- **次要色 secondary 是中性灰（neutral-300），不是彩色。** 這是刻意的視覺層級設計。
- 禁止硬編碼色值、禁止直接用 REF token、禁止用 `<style scoped>` 強蓋 Nuxt UI 內部 class（改用 `app.config.ts`）。完整禁止事項見手冊。
