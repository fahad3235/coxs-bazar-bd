// Cox's Bazar BD — headless-Chrome smoke test via CDP (Node 24 built-in WebSocket).
// Usage: node tests/smoke.mjs
// Uses the cached headless_shell binary; loads file://.../index.html?asof=2026-11-15
// so "today" is deterministic (Sun 2026-11-15, inside Saint Martin's season).
'use strict';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const CHROME = process.env.HOME + '/.cache/ms-playwright/chromium_headless_shell-1187/chrome-linux/headless_shell';
const PORT = 9224;
const ROOT = new URL('..', import.meta.url).pathname;
const PAGE_URL = 'file://' + ROOT + 'index.html?asof=2026-11-15';
const PROFILE = fs.mkdtempSync(path.join(os.tmpdir(), 'cxb-smoke-'));

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let pass = 0, fail = 0;
const failures = [];
function check(name, cond) {
  if (cond) { pass++; console.log('  ok  ' + name); }
  else { fail++; failures.push(name); console.log('FAIL  ' + name); }
}

async function waitForDebugger() {
  for (let i = 0; i < 40; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      if (res.ok) return true;
    } catch { /* not up yet */ }
    await sleep(500);
  }
  throw new Error('Chrome DevTools endpoint did not come up');
}

class CDP {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.id = 0;
    this.pending = new Map();
    this.events = [];
    this.ready = new Promise((res, rej) => { this.ws.onopen = res; this.ws.onerror = rej; });
    this.ws.onmessage = (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { res, rej } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) rej(new Error(msg.error.message));
        else res(msg.result);
      } else if (msg.method) this.events.push(msg);
    };
  }
  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((res, rej) => {
      this.pending.set(id, { res, rej });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
  async eval(expr) {
    const r = await this.send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) throw new Error('page exception: ' + JSON.stringify(r.exceptionDetails).slice(0, 600));
    return r.result.value;
  }
}

const chrome = spawn(CHROME, [
  '--headless', '--no-sandbox', '--disable-gpu',
  '--user-data-dir=' + PROFILE,
  '--remote-debugging-port=' + PORT,
  'about:blank'
], { stdio: 'ignore' });

try {
  await waitForDebugger();
  const targets = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
  const page = targets.find((t) => t.type === 'page');
  const cdp = new CDP(page.webSocketDebuggerUrl);
  await cdp.ready;

  const consoleErrors = [];
  const pageErrors = [];
  const nonFileRequests = [];
  cdp.ws.addEventListener('message', (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.method === 'Runtime.exceptionThrown') pageErrors.push(JSON.stringify(msg.params.exceptionDetails).slice(0, 300));
    if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') consoleErrors.push(JSON.stringify(msg.params.args).slice(0, 300));
    if (msg.method === 'Network.requestWillBeSent' && msg.params.request && !msg.params.request.url.startsWith('file://') && !msg.params.request.url.startsWith('data:') && !msg.params.request.url.startsWith('blob:')) {
      nonFileRequests.push(msg.params.request.url);
    }
  });

  await cdp.send('Runtime.enable');
  await cdp.send('Page.enable');
  await cdp.send('Network.enable');
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
  await cdp.send('Page.navigate', { url: PAGE_URL });
  await sleep(1500);

  const text = async (sel) => cdp.eval(`(document.querySelector(${JSON.stringify(sel)})||{}).textContent||''`);
  const count = async (sel) => cdp.eval(`document.querySelectorAll(${JSON.stringify(sel)}).length`);
  const visible = async (sel) => cdp.eval(`(()=>{const el=document.querySelector(${JSON.stringify(sel)});if(!el)return false;const r=el.getBoundingClientRect();return r.width>0&&r.height>0&&!el.hidden;})()`);

  console.log('== load + places ==');
  check('page title mentions Cox', (await cdp.eval('document.title')).includes("Cox's Bazar"));
  check('tagline rendered', (await text('#tagline')).includes("World's longest"));
  check('hero facts present', (await text('#heroBeach')).includes('120 km') && (await text('#heroDist')).includes('394 km'));
  check('saint martin status: open on 2026-11-15 (in season)', (await text('#saintStatus')).includes('running now'));
  check('10 place cards rendered', (await count('.card')) === 10);
  check('Himchari card shows 12 km from town', (await cdp.eval(`[...document.querySelectorAll('.card')].find(c=>c.textContent.includes('Himchari')).textContent`)).includes('12 km'));
  check('Saint Martin card mentions season', (await cdp.eval(`[...document.querySelectorAll('.card')].find(c=>c.textContent.includes("Saint Martin")).textContent`)).includes('1 Nov'));

  console.log('== search + category filter ==');
  await cdp.eval(`(()=>{const el=document.querySelector('#placeSearch');el.value='coral';el.dispatchEvent(new Event('input',{bubbles:true}));})()`);
  await sleep(300);
  check('search "coral" shows 2 places', (await count('.card')) === 2);
  await cdp.eval(`(()=>{const el=document.querySelector('#placeSearch');el.value='ইনানী';el.dispatchEvent(new Event('input',{bubbles:true}));})()`);
  await sleep(300);
  check('Bengali search shows 1 place', (await count('.card')) === 1);
  await cdp.eval(`(()=>{const el=document.querySelector('#placeSearch');el.value='';el.dispatchEvent(new Event('input',{bubbles:true}));})()`);
  await sleep(300);
  await cdp.eval(`(()=>{[...document.querySelectorAll('.chip')].find(b=>b.dataset.cat==='island').click();})()`);
  await sleep(300);
  check('Islands chip shows 3 places', (await count('.card')) === 3);
  await cdp.eval(`(()=>{[...document.querySelectorAll('.chip')].find(b=>b.dataset.cat==='all').click();})()`);
  await sleep(300);
  check('All chip restores 10 places', (await count('.card')) === 10);
  await cdp.eval(`(()=>{const el=document.querySelector('#placeSearch');el.value='zzz-no-match';el.dispatchEvent(new Event('input',{bubbles:true}));})()`);
  await sleep(300);
  check('no-match search shows empty message', (await text('#placeList')).includes('No places match'));
  await cdp.eval(`(()=>{const el=document.querySelector('#placeSearch');el.value='';el.dispatchEvent(new Event('input',{bubbles:true}));})()`);
  await sleep(300);

  console.log('== cost estimator ==');
  await cdp.eval(`(()=>{document.querySelector('[data-tab="cost"]').click();})()`);
  await sleep(300);
  check('default per person is Tk 11,200', (await text('#perPerson')) === 'Tk 11,200');
  check('default group total is Tk 22,400', (await text('#groupTotal')) === 'Tk 22,400');
  check('rooms line says 1 room, 2 people, 2 nights', (await text('#roomsLine')).includes('1 room'));
  check('breakdown transport Tk 4,400', (await text('#bdTransport')) === 'Tk 4,400');
  check('breakdown hotel Tk 7,000', (await text('#bdHotel')) === 'Tk 7,000');
  await cdp.eval(`(()=>{const el=document.querySelector('#peopleIn');el.value='3';el.dispatchEvent(new Event('input',{bubbles:true}));})()`);
  await sleep(300);
  check('3 people: per person Tk 12,367', (await text('#perPerson')) === 'Tk 12,367');
  check('3 people: group Tk 37,100', (await text('#groupTotal')) === 'Tk 37,100');
  check('3 people: rooms line says 2 rooms', (await text('#roomsLine')).includes('2 rooms'));
  await cdp.eval(`(()=>{const el=document.querySelector('#transportSel');el.value='flight';el.dispatchEvent(new Event('change',{bubbles:true}));})()`);
  await sleep(300);
  check('flight for 3: per person Tk 24,167', (await text('#perPerson')) === 'Tk 24,167');
  check('flight for 3: group Tk 72,500', (await text('#groupTotal')) === 'Tk 72,500');
  await cdp.eval(`(()=>{const el=document.querySelector('#peopleIn');el.value='2';el.dispatchEvent(new Event('input',{bubbles:true}));const s=document.querySelector('#transportSel');s.value='nonac';s.dispatchEvent(new Event('change',{bubbles:true}));})()`);
  await sleep(300);
  check('reset to defaults: per person Tk 11,200 again', (await text('#perPerson')) === 'Tk 11,200');
  await cdp.eval(`(()=>{const el=document.querySelector('#nightsIn');el.value='0';el.dispatchEvent(new Event('input',{bubbles:true}));})()`);
  await sleep(300);
  check('nights 0 clamps to 1 (group Tk 14,900)', (await text('#groupTotal')) === 'Tk 14,900');
  await cdp.eval(`(()=>{const el=document.querySelector('#nightsIn');el.value='2';el.dispatchEvent(new Event('input',{bubbles:true}));})()`);
  await sleep(300);

  console.log('== itinerary plan ==');
  await cdp.eval(`(()=>{document.querySelector('[data-tab="plan"]').click();})()`);
  await sleep(300);
  check('2-day plan has 10 checkable items', (await count('#planList input[type=checkbox]')) === 10);
  check('plan progress starts 0/10', (await text('#planProgress')).includes('0/10'));
  for (let i = 0; i < 3; i++) { await cdp.eval(`document.querySelectorAll('#planList input[type=checkbox]')[${i}].click()`); await sleep(150); }
  check('after 3 checks progress is 3/10 · 30%', (await text('#planProgress')).includes('3/10') && (await text('#planProgress')).includes('30%'));
  await cdp.eval(`(()=>{document.querySelector('[data-days="3"]').click();})()`);
  await sleep(300);
  check('3-day plan has 15 items', (await count('#planList input[type=checkbox]')) === 15);
  check('switching plan clears checks (0/15)', (await text('#planProgress')).includes('0/15'));

  console.log('== packing checklist ==');
  await cdp.eval(`(()=>{document.querySelector('[data-tab="packing"]').click();})()`);
  await sleep(300);
  check('packing has 16 items', (await count('#packList input[type=checkbox]')) === 16);
  check('packing progress starts 0/16', (await text('#packProgress')).includes('0/16'));
  await cdp.eval(`(()=>{const el=document.querySelector('#customPackIn');el.value='Umbrella';document.querySelector('#customPackAdd').click();})()`);
  await sleep(300);
  check('custom item added (17 items)', (await count('#packList input[type=checkbox]')) === 17);
  check('custom item label shown', (await cdp.eval(`document.body.innerText`)).includes('Umbrella'));
  for (let i = 0; i < 2; i++) { await cdp.eval(`document.querySelectorAll('#packList input[type=checkbox]')[${i}].click()`); await sleep(150); }
  check('after 2 checks progress is 2/17', (await text('#packProgress')).includes('2/17'));
  await cdp.eval(`(()=>{const el=document.querySelector('#customPackIn');el.value='x';document.querySelector('#customPackAdd').click();})()`);
  await sleep(300);
  check('1-char custom item rejected (still 17)', (await count('#packList input[type=checkbox]')) === 17);

  console.log('== tips + seasons ==');
  await cdp.eval(`(()=>{document.querySelector('[data-tab="tips"]').click();})()`);
  await sleep(300);
  check('3 season cards', (await count('.season')) === 3);
  check('Nov–Feb marked best', (await count('.season.best')) === 1);
  check('6 tips listed', (await count('#tipsList li')) === 6);
  check('tips mention rip currents', (await text('#tipsList')).includes('rip currents'));

  console.log('== BN toggle ==');
  await cdp.eval(`(()=>{document.querySelector('#langBtn').click();})()`);
  await sleep(400);
  check('BN mode: tagline in Bengali', (await text('#tagline')).includes('দীর্ঘতম'));
  check('BN mode: tab label in Bengali', (await cdp.eval(`document.querySelector('[data-tab="places"]').textContent`)).includes('স্থান'));
  check('BN mode: lang persisted', (await cdp.eval(`JSON.parse(localStorage.getItem('coxs-bazar-bd-v1')).lang`)) === 'bn');
  await cdp.eval(`(()=>{document.querySelector('[data-tab="cost"]').click();})()`);
  await sleep(300);
  check('BN mode: per person shows ৳১১,২০০', (await text('#perPerson')) === '৳১১,২০০');
  await cdp.eval(`(()=>{document.querySelector('#langBtn').click();})()`);
  await sleep(400);
  check('back to EN: per person Tk 11,200', (await text('#perPerson')) === 'Tk 11,200');

  console.log('== export / import / erase ==');
  const backupPath = path.join(os.tmpdir(), 'cxb-backup-test.json');
  const backup = JSON.stringify({ app: 'coxs-bazar-bd', version: 1, state: JSON.parse(await cdp.eval(`localStorage.getItem('coxs-bazar-bd-v1')`)) });
  fs.writeFileSync(backupPath, backup);
  await cdp.eval(`(()=>{window.prompt=()=>'DELETE';document.querySelector('[data-tab="tips"]').click();})()`);
  await sleep(300);
  await cdp.eval(`(()=>{document.querySelector('#eraseBtn').click();})()`);
  await sleep(400);
  check('erase wipes custom packing item', (await cdp.eval(`(()=>{document.querySelector('[data-tab="packing"]').click();return document.querySelectorAll('#packList input[type=checkbox]').length;})()`)) === 16);
  check('erase message shown', (await text('#dataMsg')).includes('erased'));
  // import the backup via DOM.setFileInputFiles
  const doc = await cdp.send('DOM.getDocument', { depth: -1 });
  const findNode = (node) => {
    if (node.attributes && node.attributes.includes('importFile')) return node.nodeId;
    for (const ch of (node.children || [])) { const r = findNode(ch); if (r) return r; }
    return null;
  };
  const inputNodeId = findNode(doc.root);
  check('import file input found in DOM', !!inputNodeId);
  if (inputNodeId) {
    await cdp.send('DOM.setFileInputFiles', { files: [backupPath], nodeId: inputNodeId });
    await sleep(500);
    check('import restores data (message)', (await text('#dataMsg')).includes('imported'));
    // backup was taken with lang EN, 3-day plan, custom item "Umbrella", 2 packing checks
    check('import restores EN lang state (as exported)', (await cdp.eval(`JSON.parse(localStorage.getItem('coxs-bazar-bd-v1')).lang`)) === 'en');
    check('import restores custom packing item', (await cdp.eval(`JSON.parse(localStorage.getItem('coxs-bazar-bd-v1')).customPack`)).includes('Umbrella'));
  }
  // malformed import rejected: write a bad file and set it
  const badPath = path.join(os.tmpdir(), 'cxb-bad-test.json');
  fs.writeFileSync(badPath, '{not json');
  if (inputNodeId) {
    await cdp.send('DOM.setFileInputFiles', { files: [badPath], nodeId: inputNodeId });
    await sleep(500);
    check('garbage import rejected with message', (await text('#dataMsg')).includes('not valid'));
    check('data intact after bad import (lang still en)', (await cdp.eval(`JSON.parse(localStorage.getItem('coxs-bazar-bd-v1')).lang`)) === 'en');
  }

  console.log('== reload persistence ==');
  await cdp.send('Page.reload', { ignoreCache: true });
  await sleep(1500);
  check('after reload: language still EN', (await text('#tagline')).includes("World's longest"));
  check('after reload: packing restored to 17 items (custom item from backup)', (await cdp.eval(`(()=>{document.querySelector('[data-tab="packing"]').click();return document.querySelectorAll('#packList input[type=checkbox]').length;})()`)) === 17);

  console.log('== screenshots + viewports ==');
  const shot = async (file) => {
    const r = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ROOT, 'tests', file), Buffer.from(r.data, 'base64'));
  };
  await cdp.eval(`(()=>{document.querySelector('#langBtn').click();document.querySelector('[data-tab="places"]').click();})()`);
  await sleep(400);
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
  await sleep(500);
  await shot('smoke-desktop.png');
  check('desktop: no horizontal overflow at 1280px', (await cdp.eval(`document.documentElement.scrollWidth <= window.innerWidth`)) === true);
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await sleep(500);
  await shot('smoke-mobile.png');
  check('mobile 390px: no horizontal overflow', (await cdp.eval(`document.documentElement.scrollWidth <= window.innerWidth`)) === true);
  check('mobile 390px: 10 place cards still render', (await count('.card')) === 10);
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });

  console.log('== errors + network ==');
  check('0 console errors', consoleErrors.length === 0);
  check('0 page exceptions', pageErrors.length === 0);
  check('0 non-file network requests', nonFileRequests.length === 0);
  if (nonFileRequests.length) console.log('   non-file requests: ' + nonFileRequests.join(', '));
  if (pageErrors.length) console.log('   page errors: ' + pageErrors.join(' | '));
  if (consoleErrors.length) console.log('   console errors: ' + consoleErrors.join(' | '));

  console.log('\n' + pass + '/' + (pass + fail) + ' smoke checks passed');
  if (fail) { console.log('Failures: ' + failures.join(' | ')); process.exitCode = 1; }
} catch (err) {
  console.error('SMOKE HARNESS ERROR: ' + (err && err.message));
  process.exitCode = 1;
} finally {
  chrome.kill();
}
