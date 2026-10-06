// RWD 版面檢查：用法 node t-v3-rwd.mjs <anim.html 絕對路徑> [輸出資料夾=rwd-check] [尺寸 WxH,WxH,...]
// 每種可視區：截圖、量舞台／字幕／控制列位置、有沒有垂直捲軸（隱藏 {{AFTER}} 區之後量）、水平捲軸、逐句檢查字幕有沒有塞進框裡
import { chromium } from 'playwright';
import fs from 'node:fs';
const file = process.argv[2], outDir = process.argv[3] || 'rwd-check';
const sizes = (process.argv[4] || '1920x940,1536x720,1366x650,1280x720,2293x912,390x844').split(',').map(s => s.split('x').map(Number));
fs.mkdirSync(outDir, { recursive: true });
const b = await chromium.launch(process.env.CLASSIC ? { ignoreDefaultArgs: ['--hide-scrollbars'] } : {}); const rows = [];   // CLASSIC=1：用 Windows 那種會佔寬度的捲軸測
const tag = process.env.CLASSIC ? '-classic' : '';
for (const [W, H] of sizes) {
  const ctx = await b.newContext({ viewport: { width: W, height: H }, hasTouch: W < 700, isMobile: W < 700 });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file:///' + file.replaceAll(String.fromCharCode(92), '/') + '#s5-3'); await p.waitForTimeout(1200);
  const q = () => p.evaluate(() => {
    const r = s => { const e = document.querySelector(s); if (!e || !e.getClientRects().length) return null; const x = e.getBoundingClientRect(); return { l: Math.round(x.left), t: Math.round(x.top + scrollY), r: Math.round(x.right), b: Math.round(x.bottom + scrollY), w: Math.round(x.width), h: Math.round(x.height) }; };
    const after = document.querySelector('section.after'); const ah = after ? after.offsetHeight : 0;
    const de = document.documentElement;
    const sl = document.getElementById('subline');
    return { iw: innerWidth, ih: innerHeight, header: r('header.top'), steps: r('#steps'), chips: r('#chips'), stage: r('.stagebox'), subline: r('#subline'), bar: r('.bar'), ctrl: r('.ctrl'), hint: r('.hint'), after: after ? r('section.after') : null, afterH: ah,
      sh: de.scrollHeight, sw: de.scrollWidth, cw: de.clientWidth, bodySw: document.body.scrollWidth,
      subFs: getComputedStyle(sl).fontSize, subN: getComputedStyle(de).getPropertyValue('--sub-n'), subOver: sl.scrollHeight > sl.clientHeight + 1 };
  });
  await p.waitForTimeout(300);
  const m = await q();
  await p.screenshot({ path: `${outDir}/${W}x${H}${tag}.png` });
  // 隱藏說明區，確認「播放器本體」沒有垂直捲軸
  await p.addStyleTag({ content: 'section.after{display:none!important}.wrap{padding-bottom:0!important}' }); await p.waitForTimeout(250);
  const noAfter = await p.evaluate(() => ({ sh: document.documentElement.scrollHeight, ih: innerHeight, vscroll: document.documentElement.scrollHeight > innerHeight + 0 }));
  // 逐句檢查字幕有沒有塞進框、最小字級
  const n = await p.evaluate(() => window.__animIndex.reduce((a, s) => a + s.steps.length, 0));
  let overCnt = 0, minFs = 999, maxFs = 0, stageMoves = new Set();
  const idx = await p.evaluate(() => window.__animIndex.map(s => s.steps.length));
  for (let sc = 0; sc < idx.length; sc++) for (let st = 0; st < idx[sc]; st++) {
    await p.evaluate(h => { location.hash = h; }, `#s${sc + 1}-${st + 1}`); await p.waitForTimeout(35);
    const r = await p.evaluate(() => { const sl = document.getElementById('subline'); const sb = document.querySelector('.stagebox').getBoundingClientRect(); const c = document.querySelector('.ctrl').getBoundingClientRect(); return { over: sl.scrollHeight > sl.clientHeight + 1, fs: parseFloat(getComputedStyle(sl).fontSize), sw: Math.round(sb.width), sh: Math.round(sb.height), cb: Math.round(c.bottom) }; });
    if (r.over) overCnt++; minFs = Math.min(minFs, r.fs); maxFs = Math.max(maxFs, r.fs); stageMoves.add(r.sw + 'x' + r.sh + '/' + r.cb);
  }
  const m2 = await q();
  rows.push({ W, H, scrollHeight: m.sh, afterH: m.afterH, errs, stage: `${m.stage.w}x${m.stage.h}`, stagePct: (m.stage.h / m.ih * 100).toFixed(1), stageTop: m.stage.t, ctrlBottom: m.ctrl.b, hintBottom: m.hint ? m.hint.b : null, firstScreenOK: Math.max(m.ctrl.b, m.hint ? m.hint.b : 0) <= m.ih,
    noAfter, hOverflow: m.sw > m.cw || m.bodySw > m.cw, sw: m.sw, cw: m.cw, subFs: m.subFs, subN: m.subN, subH: m.subline.h, ctrlW: m.ctrl.w, ctrlRows: Math.round(m.ctrl.h / 36), header: m.header.h, nav: (m.steps ? m.steps.h : 0) + (m.chips ? m.chips.h : 0), afterTop: m.after ? m.after.t : null,
    sentences: n, subOverCount: overCnt, subFsRange: `${minFs}-${maxFs}`, layoutStable: stageMoves.size === 1, afterRun: { stage: `${m2.stage.w}x${m2.stage.h}`, ctrlBottom: m2.ctrl.b } });
  await ctx.close();
}
await b.close();
console.log(JSON.stringify(rows, null, 1));
