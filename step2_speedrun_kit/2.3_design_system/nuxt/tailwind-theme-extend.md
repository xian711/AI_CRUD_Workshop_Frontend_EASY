# Tailwind `theme.extend` 與 CSS / 字型設定

> 本檔案從 `frontend/nuxt.config.ts` 抽出設計系統相關的三大設定：
> 1. `tailwindcss.config.theme.extend`（spacing / fontSize / fontWeight / borderRadius / colors）
> 2. CSS 載入順序（`css: [...]`）
> 3. 字型 `app.head`（Google Fonts / 粉圓體 / Adobe Typekit）
>
> 在新專案中，把以下三段設定貼進你的 `nuxt.config.ts` 即可讓 token 生效。

---

## 1. `theme.extend` 完整片段

Nuxt UI v2 內建 `@nuxtjs/tailwindcss`，可直接在 `nuxt.config.ts` 用 `tailwindcss.config` 覆寫 Tailwind 設定。以下把每個 SYS token 對應成語意化的 Tailwind 工具類別名稱（`p-md`、`text-body-large`、`rounded-lg`、`bg-primary` 等）。

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  tailwindcss: {
    config: {
      theme: {
        extend: {
          // ── 間距：語意名稱 → SYS spacing token ──────────────
          spacing: {
            'none': 'var(--ui-sys-spacing-none)',   // 0px
            'xxs':  'var(--ui-sys-spacing-xxs)',    // 2px
            'xs':   'var(--ui-sys-spacing-extra-small)', // 4px
            'sm':   'var(--ui-sys-spacing-small)',  // 8px
            'md':   'var(--ui-sys-spacing-medium)', // 16px
            'lg':   'var(--ui-sys-spacing-large)',  // 24px
            'xl':   'var(--ui-sys-spacing-extra-large)', // 40px
          },

          // ── 字級：typescale → SYS font-size token（行高綁在此）──
          fontSize: {
            'display-large':   ['var(--ui-sys-font-size-display-large)', { lineHeight: '1' }],
            'display-medium':  ['var(--ui-sys-font-size-display-medium)', { lineHeight: '1' }],
            'headline-large':  ['var(--ui-sys-font-size-headline-large)', { lineHeight: '1.3' }],
            'headline-medium': ['var(--ui-sys-font-size-headline-medium)', { lineHeight: '1.3' }],
            'body-large':      ['var(--ui-sys-font-size-body-large)', { lineHeight: '1.5' }],
            'body-medium':     ['var(--ui-sys-font-size-body-medium)', { lineHeight: '1.5' }],
            'body-small':      ['var(--ui-sys-font-size-body-small)', { lineHeight: '1.5' }],
            'label-large':     ['var(--ui-sys-font-size-label-large)', { lineHeight: '1.4' }],
            'label-medium':    ['var(--ui-sys-font-size-label-medium)', { lineHeight: '1.4' }],
            'label-small':     ['var(--ui-sys-font-size-label-small)', { lineHeight: '1.4' }],
          },

          // ── 字重：語意名稱 → SYS font-weight token ────────────
          // fontSize 與 fontWeight 刻意分開定義（不綁定），同一字級可搭配不同粗細
          fontWeight: {
            'default':  'var(--ui-sys-font-weight-default)',  // 400
            'emphasis': 'var(--ui-sys-font-weight-emphasis)', // 500
            'strong':   'var(--ui-sys-font-weight-strong)',   // 600
            'heavy':    'var(--ui-sys-font-weight-heavy)',    // 700
          },

          // ── 圓角：覆寫 Tailwind 預設 → SYS shape token ─────────
          borderRadius: {
            'none': 'var(--ui-sys-shape-corner-none)',        // 0px
            'sm':   'var(--ui-sys-shape-corner-extra-small)', // 2px
            DEFAULT: 'var(--ui-sys-shape-corner-small)',      // 4px
            'md':   'var(--ui-sys-shape-corner-medium)',      // 8px
            'lg':   'var(--ui-sys-shape-corner-large)',       // 16px
            'full': 'var(--ui-sys-shape-corner-full)',        // 999px
          },

          // ── 色彩：語意名稱 → SYS color token ──────────────────
          colors: {
            // primary 需定義完整 50–950 色階，滿足 @nuxt/ui generateSafelist
            // 要求（避免每次 HMR 產生大量 WARN → OOM）。所有階數都指向同一
            // RGB 通道變數，實際視覺不變；DEFAULT 保留 bg-primary/text-primary。
            'primary': {
              DEFAULT: 'rgb(var(--ui-sys-color-primary-rgb) / <alpha-value>)',
              50:  'rgb(var(--ui-sys-color-primary-rgb) / <alpha-value>)',
              100: 'rgb(var(--ui-sys-color-primary-rgb) / <alpha-value>)',
              200: 'rgb(var(--ui-sys-color-primary-rgb) / <alpha-value>)',
              300: 'rgb(var(--ui-sys-color-primary-rgb) / <alpha-value>)',
              400: 'rgb(var(--ui-sys-color-primary-rgb) / <alpha-value>)',
              500: 'rgb(var(--ui-sys-color-primary-rgb) / <alpha-value>)',
              600: 'rgb(var(--ui-sys-color-primary-rgb) / <alpha-value>)',
              700: 'rgb(var(--ui-sys-color-primary-rgb) / <alpha-value>)',
              800: 'rgb(var(--ui-sys-color-primary-rgb) / <alpha-value>)',
              900: 'rgb(var(--ui-sys-color-primary-rgb) / <alpha-value>)',
              950: 'rgb(var(--ui-sys-color-primary-rgb) / <alpha-value>)',
            },
            // 其餘 5 個基礎色：flat CSS variable（Nuxt UI 不對它們用 opacity modifier）
            'secondary': 'var(--ui-sys-color-secondary)',
            'error':     'var(--ui-sys-color-error)',
            'success':   'var(--ui-sys-color-success)',
            'warning':   'var(--ui-sys-color-warning)',
            'info':      'var(--ui-sys-color-info)',
            // 語意別名（讓 template 可寫 bg-surface / text-on-surface 等）
            'primary-hover':        'var(--ui-sys-color-primary-hover)',
            'primary-container':    'var(--ui-sys-color-primary-container)',
            'on-primary':           'var(--ui-sys-color-on-primary)',
            'on-primary-container': 'var(--ui-sys-color-on-primary-container)',
            'secondary-container':  'var(--ui-sys-color-secondary-container)',
            'surface':              'var(--ui-sys-color-surface)',
            'surface-variant':      'var(--ui-sys-color-surface-variant)',
            'on-surface':           'var(--ui-sys-color-on-surface)',
            'on-surface-variant':   'var(--ui-sys-color-on-surface-variant)',
            'outline':              'var(--ui-sys-color-outline)',
            'outline-variant':      'var(--ui-sys-color-outline-variant)',
            'error-container':      'var(--ui-sys-color-error-container)',
            'on-error':             'var(--ui-sys-color-on-error)',
            'success-container':    'var(--ui-sys-color-success-container)',
            'on-success':           'var(--ui-sys-color-on-success)',
            'on-success-container': 'var(--ui-sys-color-on-success-container)',
            'warning-container':    'var(--ui-sys-color-warning-container)',
            'on-warning':           'var(--ui-sys-color-on-warning)',
            'info-container':       'var(--ui-sys-color-info-container)',
            'on-info':              'var(--ui-sys-color-on-info)',
            'disabled':             'var(--ui-sys-color-disabled)',
            'on-disabled':          'var(--ui-sys-color-on-disabled)',
            // 防災系統專用色彩別名（新專案若無災時模式可自行刪減）
            'surface-page':         'var(--ui-sys-color-surface-page)',
            'disaster-bg':          'var(--ui-sys-color-disaster-bg)',
            'disaster-banner':      'var(--ui-sys-color-disaster-banner)',
            'on-disaster-banner':   'var(--ui-sys-color-on-disaster-banner)',
            'sidebar-township':     'var(--ui-sys-color-sidebar-township)',
            'sidebar-county':       'var(--ui-sys-color-sidebar-county)',
            'sidebar-nfa':          'var(--ui-sys-color-sidebar-nfa)',
            'sidebar-text':         'var(--ui-sys-color-sidebar-text)',
          },
        },
      },
    },
  },
})
```

### 重點說明

- **primary 為什麼要展開 50–950？** Nuxt UI 的 `generateSafelist` 會依「主色有幾個色階」產生 safelist，若只給 `DEFAULT` 會在每次 HMR 噴大量 WARN，長時間開發可能 OOM。這裡讓 11 個色階全部指向同一個 `--ui-sys-color-primary-rgb` 通道變數，視覺完全一致但滿足 Nuxt UI 的掃描需求。
- **為什麼 primary 用 `rgb(var(--...-rgb) / <alpha-value>)` 而其他色用 flat 變數？** 只有 primary 需要支援 opacity modifier（`bg-primary/40`），所以必須拆成 RGB 通道格式；其餘 5 色 Nuxt UI 不對它們套透明度，直接用 flat CSS variable 即可。因此 `design-token.css` 內要同時提供 `--ui-sys-color-primary`（hex）與 `--ui-sys-color-primary-rgb`（`200 35 44` 這種空白分隔通道值）兩個變數。

---

## 2. CSS 載入順序（固定，不可調換）

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  css: [
    '~/assets/css/design-token.css',  // 1. REF + SYS 層（最先）
    '~/assets/css/comp-tokens.css',   // 2. COMP 層（引用 SYS，必須在其後）
    '~/assets/css/map-icons.css',     // 3. 專案自訂樣式（本 kit 不含，選用）
  ],
})
```

> ⚠️ `design-token.css` 一定要在 `comp-tokens.css` 之前載入，因為 COMP 層的變數會 `var()` 引用 SYS 層變數。順序反了雖然 CSS custom property 仍能解析（同一 `:root` 作用域、瀏覽器會做延遲求值），但為了語意清楚與避免將來拆檔出錯，務必維持此順序。Nuxt UI 的樣式會在這些 token 之後才載入，才能被 `app.config.ts` 的 `ui` 覆寫。

本 kit 只提供 `design-token.css` 與 `comp-tokens.css`（放在 `tokens/`）。`map-icons.css` 是原專案的地圖圖示樣式，與 design system 無關，未納入。

---

## 3. 字型設定（`app.head`）

字型分三個來源，載入方式各異：

| 字型 | 用途 | 載入方式 |
|------|------|---------|
| **Noto Sans TC** | 介面預設中文字（`--ui-sys-font-family-default`） | Google Fonts `<link>` |
| **Inter** | 中英混排時的英文/數字 | Google Fonts `<link>`（與上同一條）|
| **jf-openhuninn-2.0（粉圓體）** | 平時 Header 招牌標題（`--ui-sys-font-family-display`）| `design-token.css` 內的 `@font-face`（jsDelivr CDN 抓 TTF）|
| **Adobe Typekit (kitId `ujo3ysu`)** | 系統標題備援字體 | `app.head.script` 非同步載入器 |

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  app: {
    head: {
      link: [
        // Google Fonts: Noto Sans TC + Inter
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700;800&display=swap',
        },
        // 粉圓體 jf-openhuninn-2.0 透過 design-token.css 的 @font-face 載入，不在此列
      ],
      script: [
        // Adobe Fonts (Typekit) 非同步載入器 — 系統標題字體
        {
          innerHTML: `(function(d) {
  var config = { kitId: 'ujo3ysu', scriptTimeout: 3000, async: true },
  h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\\bwf-loading\\b/g,"")+" wf-inactive";},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src='https://use.typekit.net/'+config.kitId+'.js';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)
})(document);`,
          type: 'text/javascript',
          tagPosition: 'head',
        },
      ],
    },
  },
})
```

### 粉圓體 `@font-face`（已含在 `design-token.css` 最上方）

```css
/* 粉圓體 jf-openhuninn-2.0（justfont 開源）— 用於 Header 招牌標題 */
@font-face {
  font-family: 'jf-openhuninn-2.0';
  src: url('https://cdn.jsdelivr.net/gh/justfont/open-huninn-font@2.0/font/jf-openhuninn-2.0.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

> 新專案若不需要「招牌式雙描邊標題」風格，可以移除粉圓體 `@font-face` 與 Typekit script，只保留 Noto Sans TC + Inter，介面主體不受影響（`--ui-sys-font-family-default` 仍指向 Noto Sans TC）。

---

## 4. 其他相關 `nuxt.config.ts` 設定（參考）

原專案的 Nuxt 設定另含以下與 design system 無直接關係、但新專案通常也需要的項目：

```ts
export default defineNuxtConfig({
  modules: ['@nuxt/ui'],          // 唯一必要模組（內含 Tailwind、Headless UI）
  colorMode: {
    classSuffix: '',
    preference: 'light',
    fallback: 'light',
    storageKey: 'disaster-color-mode-disabled', // 原專案刻意停用暗色切換
  },
  ssr: false,                      // 原專案為靜態輸出（Cloudflare Pages）；新專案可自行決定
})
```

> `colorMode.storageKey` 取名 `...-disabled` 是原專案刻意「凍結」在 light 模式的做法。新專案若要支援暗色模式，需另行在 SYS 層補一組暗色 token（目前 `design-token.css` 只有淺色值）。
