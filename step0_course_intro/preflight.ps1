<#
  preflight.ps1
  AI CRUD 工作坊 EASY 版 — 開課前置檢查
  PowerShell 5.1 相容（不使用 && / || 等 PS7+ 語法）
#>

# 輸出編碼：Windows 預設 CP950 主控台會把繁體中文印成亂碼，先切 UTF-8
# （與 step4_loop_e2e/run-e2e.ps1 的作法一致）
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

$results = @()

function Add-Result {
    param(
        [string]$Name,
        [bool]$Pass,
        [string]$Detail,
        [string]$FixHint,
        [bool]$Warn = $false
    )
    $script:results += [PSCustomObject]@{
        Name    = $Name
        Pass    = $Pass
        Detail  = $Detail
        FixHint = $FixHint
        Warn    = $Warn
    }
}

Write-Host "===== AI CRUD 工作坊 EASY 版 — 前置檢查 =====" -ForegroundColor Cyan
Write-Host ""

# 1. Node.js >= 20
try {
    $nodeVersionRaw = node --version 2>$null
    if ($LASTEXITCODE -eq 0 -and $nodeVersionRaw) {
        $versionText = $nodeVersionRaw.Trim().TrimStart('v')
        $majorVersion = [int]($versionText.Split('.')[0])
        if ($majorVersion -ge 20) {
            Add-Result -Name "Node.js >= 20" -Pass $true -Detail "偵測到 $nodeVersionRaw" -FixHint ""
        } else {
            Add-Result -Name "Node.js >= 20" -Pass $false -Detail "偵測到 $nodeVersionRaw（版本過舊）" -FixHint "請安裝 Node.js 20 以上版本：https://nodejs.org/"
        }
    } else {
        Add-Result -Name "Node.js >= 20" -Pass $false -Detail "找不到 node 指令" -FixHint "請安裝 Node.js 20 以上版本：https://nodejs.org/"
    }
} catch {
    Add-Result -Name "Node.js >= 20" -Pass $false -Detail "檢查失敗：$($_.Exception.Message)" -FixHint "請安裝 Node.js 20 以上版本：https://nodejs.org/"
}

# 2. pnpm 已安裝
try {
    $pnpmVersionRaw = pnpm --version 2>$null
    if ($LASTEXITCODE -eq 0 -and $pnpmVersionRaw) {
        Add-Result -Name "pnpm 已安裝" -Pass $true -Detail "偵測到 pnpm $($pnpmVersionRaw.Trim())" -FixHint ""
    } else {
        Add-Result -Name "pnpm 已安裝" -Pass $false -Detail "找不到 pnpm 指令" -FixHint "請執行「npm install -g pnpm」安裝 pnpm"
    }
} catch {
    Add-Result -Name "pnpm 已安裝" -Pass $false -Detail "檢查失敗：$($_.Exception.Message)" -FixHint "請執行「npm install -g pnpm」安裝 pnpm"
}

# 3. git 已安裝
try {
    $gitVersionRaw = git --version 2>$null
    if ($LASTEXITCODE -eq 0 -and $gitVersionRaw) {
        Add-Result -Name "git 已安裝" -Pass $true -Detail "偵測到 $($gitVersionRaw.Trim())" -FixHint ""
    } else {
        Add-Result -Name "git 已安裝" -Pass $false -Detail "找不到 git 指令" -FixHint "請安裝 Git：https://git-scm.com/"
    }
} catch {
    Add-Result -Name "git 已安裝" -Pass $false -Detail "檢查失敗：$($_.Exception.Message)" -FixHint "請安裝 Git：https://git-scm.com/"
}

# 4. port 3100 未被占用
try {
    $portInUse = Get-NetTCPConnection -LocalPort 3100 -ErrorAction SilentlyContinue
    if ($null -eq $portInUse -or $portInUse.Count -eq 0) {
        Add-Result -Name "port 3100 未被占用" -Pass $true -Detail "port 3100 目前空閒（範本專案 sample-app 會用這個埠）" -FixHint ""
    } else {
        Add-Result -Name "port 3100 未被占用" -Pass $false -Detail "port 3100 已被占用" -FixHint "請關閉占用 3100 的程式，或執行「Get-Process -Id (Get-NetTCPConnection -LocalPort 3100).OwningProcess」找出並結束該程序"
    }
} catch {
    # Get-NetTCPConnection 在部分環境（如舊版 PowerShell 或受限權限）可能不存在，不可讓腳本中斷
    # 記為警告（不算 FAIL）：無法自動判斷，但不阻擋開課
    Add-Result -Name "port 3100 未被占用" -Pass $true -Warn $true -Detail "無法用 Get-NetTCPConnection 檢查（略過，開課時請自行確認 port 3100 空閒）" -FixHint ""
}

# 5. 磁碟剩餘空間 >= 2GB（安裝 sample-app 相依套件用）
try {
    # 檢查腳本所在磁碟（工作坊資料夾實際落在哪個磁碟），而非系統磁碟
    $scriptDrive = (Split-Path -Qualifier $PSScriptRoot).TrimEnd(':')
    $drive = Get-PSDrive -Name $scriptDrive -ErrorAction Stop
    $freeGB = [math]::Round($drive.Free / 1GB, 2)
    if ($freeGB -ge 2) {
        Add-Result -Name "磁碟剩餘空間 >= 2GB" -Pass $true -Detail "$scriptDrive`: 剩餘約 $freeGB GB" -FixHint ""
    } else {
        Add-Result -Name "磁碟剩餘空間 >= 2GB" -Pass $false -Detail "$scriptDrive`: 剩餘約 $freeGB GB（不足）" -FixHint "請清出至少 2GB 空間，sample-app 安裝相依套件（node_modules）需要空間"
    }
} catch {
    Add-Result -Name "磁碟剩餘空間 >= 2GB" -Pass $false -Detail "檢查失敗：$($_.Exception.Message)" -FixHint "請手動確認系統磁碟至少有 2GB 剩餘空間"
}

# 6. ExecutionPolicy 可執行腳本（FAIL 級）
try {
    $cuPolicy = Get-ExecutionPolicy -Scope CurrentUser
    $lmPolicy = Get-ExecutionPolicy -Scope LocalMachine
    $effectivePolicy = Get-ExecutionPolicy
    $blockedPolicies = @('Restricted', 'AllSigned')
    if ($blockedPolicies -contains $effectivePolicy) {
        Add-Result -Name "ExecutionPolicy 可執行腳本" -Pass $false -Detail "生效原則為 $effectivePolicy（CurrentUser=$cuPolicy／LocalMachine=$lmPolicy），會擋住腳本執行" -FixHint "請執行「Set-ExecutionPolicy -Scope CurrentUser RemoteSigned」後重跑 preflight.ps1"
    } else {
        Add-Result -Name "ExecutionPolicy 可執行腳本" -Pass $true -Detail "生效原則為 $effectivePolicy（CurrentUser=$cuPolicy／LocalMachine=$lmPolicy）" -FixHint ""
    }
} catch {
    Add-Result -Name "ExecutionPolicy 可執行腳本" -Pass $false -Detail "檢查失敗：$($_.Exception.Message)" -FixHint "請執行「Set-ExecutionPolicy -Scope CurrentUser RemoteSigned」後重跑 preflight.ps1"
}

# 7. 工作區可寫入（FAIL 級）
try {
    $workshopRoot = Split-Path $PSScriptRoot -Parent
    $probeFile = Join-Path $workshopRoot (".preflight_write_test_" + [guid]::NewGuid().ToString('N') + ".tmp")
    New-Item -Path $probeFile -ItemType File -ErrorAction Stop | Out-Null
    Remove-Item -Path $probeFile -Force -ErrorAction Stop
    Add-Result -Name "工作區可寫入" -Pass $true -Detail "工作坊根目錄可建立／刪除暫存檔" -FixHint ""
} catch {
    Add-Result -Name "工作區可寫入" -Pass $false -Detail "無法在工作坊根目錄寫入：$($_.Exception.Message)" -FixHint "請把工作坊資料夾放到你有寫入權限的位置（避開唯讀磁碟或受控資料夾），或改用有權限的帳號執行"
}

# 8. npm registry 連線（WARN 級）
try {
    $null = Invoke-WebRequest -Uri "https://registry.npmjs.org" -Method Head -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
    Add-Result -Name "npm registry 連線" -Pass $true -Detail "可連上 registry.npmjs.org" -FixHint ""
} catch {
    Add-Result -Name "npm registry 連線" -Pass $true -Warn $true -Detail "無法連上 registry.npmjs.org（離線或防火牆）；離線教室請確認已預裝依賴（兩個專案的 node_modules 皆已就緒）" -FixHint ""
}

# 9. Playwright Chromium 已快取（WARN 級）
try {
    $pwCacheDir = Join-Path $env:LOCALAPPDATA "ms-playwright"
    $chromiumDirs = @()
    if (Test-Path $pwCacheDir) {
        $chromiumDirs = @(Get-ChildItem -Path $pwCacheDir -Directory -Filter "chromium*" -ErrorAction SilentlyContinue)
    }
    if ($chromiumDirs.Count -gt 0) {
        Add-Result -Name "Playwright Chromium 已快取" -Pass $true -Detail "已找到 $($chromiumDirs.Count) 個 chromium 快取目錄（step4 E2E 可直接跑）" -FixHint ""
    } else {
        Add-Result -Name "Playwright Chromium 已快取" -Pass $true -Warn $true -Detail "未找到 Chromium 快取；step4 首跑會自動下載約 150MB，離線教室請課前先跑一次 run-e2e.ps1" -FixHint ""
    }
} catch {
    Add-Result -Name "Playwright Chromium 已快取" -Pass $true -Warn $true -Detail "無法檢查 Chromium 快取；step4 首跑會自動下載約 150MB，離線教室請課前先跑一次 run-e2e.ps1" -FixHint ""
}

# 10. AI Agent CLI（WARN 級）
try {
    $agentCandidates = @('claude', 'codex', 'cursor')
    $foundAgents = @()
    foreach ($agent in $agentCandidates) {
        if (Get-Command $agent -ErrorAction SilentlyContinue) {
            $foundAgents += $agent
        }
    }
    if ($foundAgents.Count -gt 0) {
        Add-Result -Name "AI Agent CLI" -Pass $true -Detail "偵測到：$($foundAgents -join '、')" -FixHint ""
    } else {
        Add-Result -Name "AI Agent CLI" -Pass $true -Warn $true -Detail "未偵測到常見 AI Agent CLI（claude／codex／cursor）；若用 IDE 內建 Agent（如 Cursor／Copilot）可忽略" -FixHint ""
    }
} catch {
    Add-Result -Name "AI Agent CLI" -Pass $true -Warn $true -Detail "無法偵測 AI Agent CLI；若用 IDE 內建 Agent（如 Cursor／Copilot）可忽略" -FixHint ""
}

# 輸出清單
foreach ($r in $results) {
    if ($r.Warn) {
        Write-Host ("[WARN] {0} — {1}" -f $r.Name, $r.Detail) -ForegroundColor Yellow
    } elseif ($r.Pass) {
        Write-Host ("[PASS] {0} — {1}" -f $r.Name, $r.Detail) -ForegroundColor Green
    } else {
        Write-Host ("[FAIL] {0} — {1}" -f $r.Name, $r.Detail) -ForegroundColor Red
        Write-Host ("       修復提示：{0}" -f $r.FixHint) -ForegroundColor Yellow
    }
}

Write-Host ""
$failCount = @($results | Where-Object { -not $_.Pass }).Count
$warnCount = @($results | Where-Object { $_.Warn }).Count

if ($failCount -eq 0) {
    if ($warnCount -gt 0) {
        Write-Host "前置檢查全數通過（含 $warnCount 項警告），可以開課！" -ForegroundColor Green
    } else {
        Write-Host "前置檢查全數通過，可以開課！" -ForegroundColor Green
    }
    exit 0
} else {
    Write-Host "有 $failCount 項檢查未通過，請依上方修復提示處理後重新執行 preflight.ps1。" -ForegroundColor Red
    exit 1
}

# 註：帳號額度／登入狀態無法自動檢查，開課前請講師人工確認（見 instructor/GUIDE.md）
