import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const browser = await chromium.launch({ headless: true });
const errors = [];
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  page.setDefaultTimeout(10000);
  page.on('pageerror', e => errors.push(String(e)));
  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForFunction(() => typeof window.goToView === 'function' && typeof window.applyRbacToUi === 'function', null, { timeout: 15000 });
  await page.evaluate(() => { window.CURRENT_USER={username:'tp-qa',role:'Superadmin'}; try{applyRbacToUi()}catch{}; try{goToView('omodos4')}catch{}; });
  await page.waitForFunction(() => window.__OMODOS_TP_LOADER_V1===true, null, {timeout:15000});
  await page.waitForFunction(() => !!window.OMODOS_TechnicalPerformance && !!document.getElementById('nav-technical-performance'), null, {timeout:15000});
  const denied = await page.evaluate(() => {
    window.CURRENT_USER={username:'tp-qa',role:'Technician'}; try{applyRbacToUi()}catch{}; window.OMODOS_TechnicalPerformance.syncAuth();
    const n=document.getElementById('nav-technical-performance'),v=document.getElementById('view-technical-performance');
    return {route:canAccessView_('technical-performance'),navHidden:!n||getComputedStyle(n).display==='none',viewHidden:!v||v.hidden||getComputedStyle(v).display==='none'||v.getAttribute('aria-hidden')==='true'};
  });
  assert.equal(denied.route,false); assert.equal(denied.navHidden,true); assert.equal(denied.viewHidden,true);
  const allowed = await page.evaluate(() => {
    window.CURRENT_USER={username:'tp-qa',role:'Superadmin'}; try{applyRbacToUi()}catch{}; window.OMODOS_TechnicalPerformance.syncAuth();
    const n=document.getElementById('nav-technical-performance'),v=document.getElementById('view-technical-performance');
    const route=canAccessView_('technical-performance'),nav=!!n&&getComputedStyle(n).display!=='none';
    const go=goToView('technical-performance');
    return {route,nav,active:!!v&&v.classList.contains('active'),title:!!v?.querySelector('h1'),go};
  });
  assert.equal(allowed.route,true); assert.equal(allowed.nav,true); assert.equal(allowed.active,true); assert.equal(allowed.title,true);
  assert.deepEqual(errors,[]);
  console.log('Technical Performance browser QA passed: Superadmin access and Technician denial.');
} finally { await browser.close(); }
