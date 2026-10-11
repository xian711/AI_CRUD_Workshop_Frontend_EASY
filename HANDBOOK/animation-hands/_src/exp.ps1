param([string]$Do = 'all', [string]$Out = 'D:\AIWORK\pw-shots-tmp\crud-anim-2026-10-04\raw')
# 第五版：用 Windows 檔案總管複製範本（step3 ⓪）。用 Shell COM 開資料夾、選取檔案，PrintWindow 截圖（不動實體鍵盤滑鼠）。
# 每張圖輸出 <名字>.png 和 <名字>.json（選取項目的位置，視窗座標 px）
[Console]::OutputEncoding = [Text.Encoding]::UTF8
Add-Type -AssemblyName System.Drawing, UIAutomationClient, UIAutomationTypes
Add-Type @"
using System; using System.Runtime.InteropServices;
public class X {
  [DllImport("user32.dll")] public static extern bool SetProcessDPIAware();
  [DllImport("user32.dll")] public static extern bool MoveWindow(IntPtr h, int x, int y, int w, int hh, bool r);
  [DllImport("user32.dll")] public static extern bool PrintWindow(IntPtr h, IntPtr hdc, uint f);
  [DllImport("user32.dll")] public static extern bool GetWindowRect(IntPtr h, out RECT r);
  [DllImport("user32.dll")] public static extern bool PostMessage(IntPtr h, uint m, IntPtr w, IntPtr l);
  [StructLayout(LayoutKind.Sequential)] public struct RECT { public int L, T, R, B; }
}
"@
[X]::SetProcessDPIAware() | Out-Null
$LAB = 'D:\AI_CRUD_Workshop_Frontend_EASY'
$SRC = "$LAB\step2_speedrun_kit\2.1_sample_app\sample-app"
$S3 = "$LAB\step3_new_module"
$DST = "$S3\my-equipment-app"
$sh = New-Object -ComObject Shell.Application
$A = [System.Windows.Automation.AutomationElement]; $TS = [System.Windows.Automation.TreeScope]

function Win() {
  foreach ($w in $sh.Windows()) { try { if ($w.Document.Folder.Self.Path -like "$LAB*") { return $w } } catch {} }
  return $null
}
function Open($path) {
  $w = Win
  if ($w) { $w.Navigate2($path) } else { Start-Process explorer.exe $path }
  for ($i = 0; $i -lt 40; $i++) { Start-Sleep -Milliseconds 300; $w = Win; if ($w -and $w.Document.Folder.Self.Path -eq $path) { break } }
  [X]::MoveWindow([IntPtr]$w.HWND, 40, 30, 1400, 1010, $true) | Out-Null
  Start-Sleep -Milliseconds 1200
  return $w
}
function Sel($w, $names, [switch]$Edit) {
  $first = $true
  foreach ($n in $names) {
    $it = $w.Document.Folder.ParseName($n)
    if (-not $it) { "  (no item $n)"; continue }
    $f = 1; if ($first) { $f = 1 + 4 + 8 + 16 }; if ($Edit) { $f = 3 + 4 + 8 + 16 }
    $w.Document.SelectItem($it, $f); $first = $false
  }
}
function Unsel($w, $names) { foreach ($n in $names) { $it = $w.Document.Folder.ParseName($n); if ($it) { $w.Document.SelectItem($it, 0) } } }
function All($w) { $first = $true; foreach ($it in $w.Document.Folder.Items()) { $f = 1; if ($first) { $f = 1 + 4 + 16 }; $w.Document.SelectItem($it, $f); $first = $false } }
function Shot($w, $name, $boxNames) {
  Start-Sleep -Milliseconds 900
  $h = [IntPtr]$w.HWND; $r = New-Object X+RECT; [X]::GetWindowRect($h, [ref]$r) | Out-Null
  $bmp = New-Object System.Drawing.Bitmap(($r.R - $r.L), ($r.B - $r.T)); $g = [System.Drawing.Graphics]::FromImage($bmp)
  $hdc = $g.GetHdc(); [X]::PrintWindow($h, $hdc, 2) | Out-Null; $g.ReleaseHdc($hdc); $g.Dispose()
  $bmp.Save("$Out\$name.png", [System.Drawing.Imaging.ImageFormat]::Png); $bmp.Dispose()
  # 標註框：用 UI Automation 找清單項目、網址列、新增資料夾等
  $root = $A::FromHandle($h); $boxes = @{}
  foreach ($e in $root.FindAll($TS::Descendants, [System.Windows.Automation.Condition]::TrueCondition)) {
    $n = $e.Current.Name; if (-not $n) { continue }
    foreach ($k in $boxNames.Keys) {
      if ($boxes.ContainsKey($k)) { continue }
      $want = $boxNames[$k]
      if ($n -eq $want -and $e.Current.ControlType.ProgrammaticName -match 'ListItem|TreeItem|SplitButton|Button|Edit|DataItem') {
        $b = $e.Current.BoundingRectangle
        $boxes[$k] = @([int]($b.X - $r.L), [int]($b.Y - $r.T), [int]$b.Width, [int]$b.Height)
      }
    }
  }
  @{ w = ($r.R - $r.L); h = ($r.B - $r.T); boxes = $boxes } | ConvertTo-Json -Depth 4 | Set-Content -Encoding utf8 "$Out\$name.json"
  "[shot] $name " + (($boxes.Keys | Sort-Object) -join ',')
}

if ($Do -eq 'all' -or $Do -eq 'copy') {
  if (Test-Path $DST) { 'my-equipment-app already exists: stop'; exit 1 }
  # ① 在檔案總管中顯示：打開 2.1_sample_app，sample-app 已選好
  $w = Open "$LAB\step2_speedrun_kit\2.1_sample_app"; Sel $w @('sample-app')
  Shot $w 'v5-ex1-reveal' @{ item = 'sample-app' }
  # ② 進 sample-app，Ctrl+A 全選
  $w = Open $SRC; All $w
  Shot $w 'v5-ex2-all' @{ nm = 'node_modules'; nuxt = '.nuxt'; claude = 'CLAUDE.md' }
  # ③ 按住 Ctrl 點掉 node_modules、.nuxt、.output
  Unsel $w @('node_modules', '.nuxt', '.output')
  Shot $w 'v5-ex3-deselect' @{ nm = 'node_modules'; nuxt = '.nuxt'; claude = 'CLAUDE.md' }
  # ④ 到 step3_new_module，新增資料夾、名字打 my-equipment-app
  New-Item -ItemType Directory $DST | Out-Null
  $w = Open $S3; Start-Sleep -Milliseconds 800; Sel $w @('my-equipment-app') -Edit
  Shot $w 'v5-ex4-newfolder' @{ item = 'my-equipment-app'; prd = 'PRD-中心裝備物資.md' }
  # ⑤ 進 my-equipment-app 貼上（實際用 robocopy 複製同一批檔案；跳過那三個資料夾）
  $w = Open $DST
  robocopy $SRC $DST /E /XD node_modules .nuxt .output /NFL /NDL /NJH /NJS /NP | Out-Null
  Start-Sleep -Milliseconds 1500; $w.Refresh(); Start-Sleep -Milliseconds 1200; All $w
  Shot $w 'v5-ex5-pasted' @{ claude = 'CLAUDE.md'; pages = 'pages' }
  # ⑥ 回 step3_new_module，選三個檔
  $w = Open $S3; Sel $w @('PRD-中心裝備物資.md', '技術約定-中心裝備物資.md', 'SRS-設計文件-最小樣板.md')
  Shot $w 'v5-ex6-three' @{ prd = 'PRD-中心裝備物資.md'; tech = '技術約定-中心裝備物資.md'; tpl = 'SRS-設計文件-最小樣板.md'; dst = 'my-equipment-app' }
  # ⑦ 貼進 my-equipment-app
  foreach ($f in @('PRD-中心裝備物資.md', '技術約定-中心裝備物資.md', 'SRS-設計文件-最小樣板.md')) { Copy-Item "$S3\$f" $DST }
  $w = Open $DST; Start-Sleep -Milliseconds 800; $w.Refresh(); Start-Sleep -Milliseconds 1000
  Sel $w @('PRD-中心裝備物資.md', '技術約定-中心裝備物資.md', 'SRS-設計文件-最小樣板.md')
  Shot $w 'v5-ex7-done' @{ prd = 'PRD-中心裝備物資.md'; tech = '技術約定-中心裝備物資.md'; tpl = 'SRS-設計文件-最小樣板.md'; claude = 'CLAUDE.md' }
}
if ($Do -eq 'close') { $w = Win; if ($w) { $w.Quit(); 'closed' } }
