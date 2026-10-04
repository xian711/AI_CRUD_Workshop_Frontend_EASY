// 測試：暫停時畫面要定住（打字中的指令不能繼續長），連續跳句不能出錯
import { chromium } from 'playwright';
const url = 'file:///' + process.argv[2].replace(/\\/g, '/');
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1600, height: 1100 } });
const errors = []; p.on('pageerror', e => errors.push(e.message));
await p.goto(url + '#s4-3'); await p.waitForTimeout(800);
const txt = () => p.evaluate(() => [...document.querySelectorAll('#stage text')].map(t => t.textContent).join('|'));
// 開始播放 → 0.8 秒後暫停 → 等 2.5 秒，文字不應該變
await p.click('#bStart').catch(() => p.click('#bPlay'));
await p.waitForTimeout(900); await p.click('#bPlay');
const a = await txt(); await p.waitForTimeout(2500); const b2 = await txt();
console.log('paused frozen:', a === b2);
// 繼續播放 → 2.5 秒後文字應該有變（打字繼續）
await p.click('#bPlay'); await p.waitForTimeout(2500); const c = await txt();
console.log('resumed moving:', c !== b2);
// 轉場（放大、淡入）途中暫停：動畫的 currentTime 不能再走
await p.evaluate(() => { location.hash = '#s19-2' }); await p.waitForTimeout(1500);
if (await p.locator('#bPlay').textContent() !== '⏸ 暫停') await p.click('#bPlay');
await p.click('#bNext'); await p.waitForTimeout(250); await p.click('#bPlay');
const t1 = await p.evaluate(() => document.getElementById('stage').getAnimations({ subtree: true }).map(a => [a.playState, Math.round(a.currentTime)]));
await p.waitForTimeout(1500);
const t2 = await p.evaluate(() => document.getElementById('stage').getAnimations({ subtree: true }).map(a => [a.playState, Math.round(a.currentTime)]));
// pause() 在下一個影格才生效，容許差一個影格（約 17ms）
console.log('transitions during pause:', t1.length, 'frozen:', t1.length > 0 && t2.every((x, i) => x[0] === 'paused' && Math.abs(x[1] - t1[i][1]) <= 20));
// 連續快速跳句
await p.evaluate(() => { for (let i = 0; i < 5; i++) document.getElementById('bNext').click(); });
await p.waitForTimeout(1500);
console.log('pos after rapid next:', await p.locator('#pos').textContent());
console.log('errors:', JSON.stringify(errors));
await b.close();
