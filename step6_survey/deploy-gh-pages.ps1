<#
.SYNOPSIS
    課程回饋問卷 — 一鍵發布到 GitHub Pages（EASY 版課後題）。
.DESCRIPTION
    把「設 baseURL → pnpm generate → 檢查產出 → 推到 GitHub」這一串手動步驟包成一支腳本，
    並且在真的推出去之前，先做四項安全檢查。

    ⚠ 預設是「演練模式（dry run）」：只建置、只檢查、只印出「會推什麼、推到哪」，
      **不會真的動到你的 GitHub**。確認過再加 -Push 才會實際推送。

    做了什麼：
      1. 檢查你在對的資料夾（有 nuxt.config、有 pages/survey）。
      2. 設 NUXT_APP_BASE_URL=/<RepoName>/ 後跑 pnpm generate。
      3. 檢查產出：index.html 在不在、資源前綴對不對、.nojekyll 有沒有。
      4. 敏感資料掃描：翻一遍 .output/public，看有沒有像帳密／金鑰／台灣手機號／身分證號的東西。
      5. 演練模式：印出即將推送的目標與檔案數就停。
         -Push 模式：在 .output/public 建一個乾淨的 git repo，強制推到 <RepoUrl> 的 <Branch>。

    用法（在 step6_survey/my-survey-app 目錄執行）：
      # 演練（推薦先跑這個）
      powershell -ExecutionPolicy Bypass -File ..\deploy-gh-pages.ps1 -RepoName my-survey-app

      # 確認沒問題之後，真的推
      powershell -ExecutionPolicy Bypass -File ..\deploy-gh-pages.ps1 `
          -RepoName my-survey-app -RepoUrl https://github.com/你的帳號/my-survey-app.git -Push

    推完之後還要手動做一次（GitHub 網頁上）：
      repo → Settings → Pages → Source 選 "Deploy from a branch" → 分支選 main、資料夾選 / (root) → Save
      等 1～2 分鐘，網址是 https://你的帳號.github.io/<RepoName>/

    ⚠ 兩件事一定要先知道：
      - GitHub Pages 免費方案只支援 **public（公開）repo**。你推上去的每一個檔案，任何人都看得到。
      - 要下架：Settings → Pages → Source 選 None（立刻下架）；
                Settings 最下面 → Delete this repository（整個刪掉）。
        **先知道怎麼關，再按上線。**

    Exit code：0 = 成功（演練或推送）；1 = 檢查沒過或發生錯誤。
#>
param(
    [Parameter(Mandatory = $true)]
    [string] $RepoName,

    [string] $RepoUrl = '',

    [string] $Branch = 'main',

    [switch] $Push,

    # 敏感資料掃到東西時，預設會擋下來。確認是誤判才加這個。
    [switch] $IgnoreSecretScan
)

$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

function Fail($msg) {
    Write-Host "FAIL：$msg" -ForegroundColor Red
    exit 1
}

try {
    Write-Host '=== 課程回饋問卷 → GitHub Pages ===' -ForegroundColor Cyan
    if ($Push) {
        Write-Host '模式：實際推送（-Push）' -ForegroundColor Yellow
    } else {
        Write-Host '模式：演練（dry run）——不會動到你的 GitHub。確認後再加 -Push。' -ForegroundColor Green
    }
    Write-Host ''

    # ── 檢查 1：在對的資料夾 ──
    $projectRoot = (Get-Location).Path
    Write-Host "檢查 1／4：目前資料夾 $projectRoot" -ForegroundColor Cyan
    if (-not (Test-Path (Join-Path $projectRoot 'nuxt.config.ts'))) {
        Fail '這裡沒有 nuxt.config.ts。請先 cd 進你的問卷專案資料夾（例如 my-survey-app）再跑。'
    }
    if (-not (Test-Path (Join-Path $projectRoot 'pages\survey'))) {
        Fail '找不到 pages\survey。這看起來不是問卷專案。'
    }
    Write-Host '  PASS：確認是問卷專案。' -ForegroundColor Green

    # ── 建置 ──
    $baseUrl = '/' + $RepoName.Trim('/') + '/'
    Write-Host ''
    Write-Host "建置靜態檔（NUXT_APP_BASE_URL=$baseUrl）..." -ForegroundColor Cyan
    Write-Host '  提醒：baseURL 必須跟 GitHub repo 名稱「一字不差」（含大小寫），否則網址開起來會一片空白。' -ForegroundColor DarkGray
    $env:NUXT_APP_BASE_URL = $baseUrl
    & pnpm generate
    if ($LASTEXITCODE -ne 0) { Fail "pnpm generate 失敗（exit $LASTEXITCODE）。" }

    $publicDir = Join-Path $projectRoot '.output\public'
    if (-not (Test-Path $publicDir)) { Fail "建置完卻找不到 $publicDir。" }

    # ── 檢查 2：產出內容 ──
    Write-Host ''
    Write-Host '檢查 2／4：產出內容' -ForegroundColor Cyan
    $indexPath = Join-Path $publicDir 'index.html'
    if (-not (Test-Path $indexPath)) { Fail "$publicDir 裡沒有 index.html。" }

    $indexHtml = Get-Content -LiteralPath $indexPath -Raw
    if ($indexHtml -notmatch [regex]::Escape($baseUrl)) {
        Fail "index.html 裡找不到資源前綴 $baseUrl —— baseURL 沒吃進去，推上去會一片空白。"
    }
    Write-Host "  PASS：資源前綴是 $baseUrl。" -ForegroundColor Green

    # .nojekyll：沒有就自己補一個（GitHub Pages 預設會忽略底線開頭的 _nuxt/）
    $nojekyll = Join-Path $publicDir '.nojekyll'
    if (-not (Test-Path $nojekyll)) {
        New-Item -ItemType File -Path $nojekyll | Out-Null
        Write-Host '  已自動補上 .nojekyll（沒有它，_nuxt/ 會被 GitHub Pages 忽略，CSS 全跑掉）。' -ForegroundColor Yellow
    } else {
        Write-Host '  PASS：.nojekyll 在。' -ForegroundColor Green
    }

    $fileCount = (Get-ChildItem -Path $publicDir -Recurse -File -Force | Measure-Object).Count
    Write-Host "  產出共 $fileCount 個檔案。" -ForegroundColor Gray

    # ── 檢查 3：敏感資料掃描 ──
    Write-Host ''
    Write-Host '檢查 3／4：敏感資料掃描（推上去就是全世界看得到）' -ForegroundColor Cyan
    $patterns = @(
        @{ Name = '看起來像密碼／金鑰的欄位'; Pattern = '(?i)(password|passwd|secret|api[_-]?key|access[_-]?token|private[_-]?key)\s*[:=]\s*["\x27][^"\x27]{6,}' },
        @{ Name = '台灣手機號碼'; Pattern = '\b09\d{8}\b' },
        @{ Name = '台灣身分證字號'; Pattern = '\b[A-Z][12]\d{8}\b' },
        @{ Name = '內網位址'; Pattern = '\b(10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3})\b' }
    )
    $scanFiles = Get-ChildItem -Path $publicDir -Recurse -File -Include *.html, *.js, *.json, *.txt, *.csv -ErrorAction SilentlyContinue
    $findings = @()
    foreach ($p in $patterns) {
        $hit = $scanFiles | Select-String -Pattern $p.Pattern -ErrorAction SilentlyContinue | Select-Object -First 3
        if ($hit) {
            $findings += "  ⚠ $($p.Name)："
            foreach ($h in $hit) {
                $snippet = $h.Line.Trim()
                if ($snippet.Length -gt 120) { $snippet = $snippet.Substring(0, 120) + '…' }
                $findings += "      $($h.Filename):$($h.LineNumber)  $snippet"
            }
        }
    }
    if ($findings.Count -gt 0) {
        Write-Host '  掃到可能不該公開的東西：' -ForegroundColor Yellow
        $findings | ForEach-Object { Write-Host $_ -ForegroundColor Yellow }
        Write-Host ''
        Write-Host '  這門課的種子資料是虛構的，所以掃到手機號很可能是假資料——但請你**親眼確認過**再繼續。' -ForegroundColor Yellow
        if (-not $IgnoreSecretScan) {
            Fail '為了安全先擋下來。確認過都是假資料的話，加上 -IgnoreSecretScan 再跑一次。'
        }
        Write-Host '  你已加上 -IgnoreSecretScan，略過此項。' -ForegroundColor Yellow
    } else {
        Write-Host '  PASS：沒掃到明顯的敏感資料。' -ForegroundColor Green
    }

    # ── 檢查 4：推送目標 ──
    Write-Host ''
    Write-Host '檢查 4／4：推送目標' -ForegroundColor Cyan
    Write-Host "  來源：$publicDir （推的是這個資料夾**裡面的內容**，不是資料夾本身）" -ForegroundColor Gray
    Write-Host "  目標 repo：$(if ($RepoUrl) { $RepoUrl } else { '（未指定 -RepoUrl）' })" -ForegroundColor Gray
    Write-Host "  目標分支：$Branch" -ForegroundColor Gray
    Write-Host "  發布後網址：https://<你的帳號>.github.io/$($RepoName.Trim('/'))/" -ForegroundColor Gray

    if (-not $Push) {
        Write-Host ''
        Write-Host '演練完成，什麼都沒有推出去。' -ForegroundColor Green
        Write-Host '確認上面四項都沒問題之後，加上 -RepoUrl 與 -Push 再跑一次才會實際發布。' -ForegroundColor Green
        Write-Host ''
        Write-Host '⚠ 按下去之前再想一次：GitHub Pages 免費方案只支援 public repo，' -ForegroundColor Yellow
        Write-Host '  這 ' + $fileCount + ' 個檔案會變成任何人都看得到。' -ForegroundColor Yellow
        exit 0
    }

    if (-not $RepoUrl) { Fail '要實際推送必須給 -RepoUrl（例如 https://github.com/你的帳號/my-survey-app.git）。' }

    # ── 實際推送：在產出資料夾裡開一個拋棄式 repo ──
    Write-Host ''
    Write-Host '開始推送...' -ForegroundColor Cyan
    Push-Location $publicDir
    try {
        if (Test-Path '.git') { Remove-Item -Recurse -Force '.git' }
        & git init -q
        & git checkout -q -B $Branch
        & git add -A
        & git -c user.name='workshop' -c user.email='workshop@example.com' commit -q -m "發布課程回饋問卷（$RepoName）"
        if ($LASTEXITCODE -ne 0) { Fail 'git commit 失敗。' }
        & git remote add origin $RepoUrl
        & git push -f origin $Branch
        if ($LASTEXITCODE -ne 0) { Fail 'git push 失敗（檢查 repo 網址、權限，以及那個 repo 是不是已經存在）。' }
    } finally {
        Pop-Location
    }

    Write-Host ''
    Write-Host '推送完成。' -ForegroundColor Green
    Write-Host '最後一步（GitHub 網頁上手動做）：' -ForegroundColor Cyan
    Write-Host "  repo → Settings → Pages → Source 選 'Deploy from a branch' → 分支 $Branch、資料夾 / (root) → Save" -ForegroundColor Cyan
    Write-Host "  等 1～2 分鐘，開 https://<你的帳號>.github.io/$($RepoName.Trim('/'))/" -ForegroundColor Cyan
    Write-Host ''
    Write-Host '要下架：Settings → Pages → Source 選 None；要整個刪掉：Settings 最下面 Delete this repository。' -ForegroundColor Yellow
    exit 0
}
catch {
    Write-Host ("FAIL：非預期錯誤：{0}" -f $_.Exception.Message) -ForegroundColor Red
    exit 1
}
