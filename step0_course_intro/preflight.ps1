<#
  preflight.ps1
  AI CRUD 工作坊 EASY 版 — 開課前置檢查
  PowerShell 5.1 相容（不使用 && / || 等 PS7+ 語法）
#>

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
