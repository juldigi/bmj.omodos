import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const browser = await chromium.launch({ headless: true });
const errors = [];
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  page.setDefaultTimeout(10000);
  page.on('pageerror', e => errors.push(String(e)));
  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'domcontentloaded', timeout: 15000 });
  // Use a small host-shell fixture: the production index is a very large inline bundle,
  // so this test isolates the actual Technical Performance asset and its RBAC boundary.
  await page.setContent(`
    <base href="http://127.0.0.1:4173/">
    <div class="sidebar"><div class="nav-group-settings"></div></div>
    <main class="main"><section id="view-dashboard" class="view active"><h1>Dashboard</h1></section></main>
    <script>
      window.CURRENT_USER={username:'tp-qa',role:'Technician'};
      window.canAccessView_=function(view){return view!=='technical-performance'||String((window.CURRENT_USER||{}).role||'').toLowerCase()==='superadmin';};
      window.applyRbacToUi=function(){};
      window.goToView=function(view){if(!window.canAccessView_(view))return false;document.querySelectorAll('.view').forEach(function(v){v.classList.remove('active');});var el=document.getElementById('view-'+view);if(el)el.classList.add('active');return true;};
    </script>
    <script src="/omodos4/technical-performance.js"></script>
  `, {waitUntil:'load'});
  await page.waitForFunction(() => !!window.OMODOS_TechnicalPerformance && !!document.getElementById('nav-technical-performance'), null, {timeout:15000});
  const denied = await page.evaluate(() => {
    window.CURRENT_USER={username:'tp-qa',role:'Technician'};
    window.OMODOS_TechnicalPerformance.syncAuth();
    const n=document.getElementById('nav-technical-performance'),v=document.getElementById('view-technical-performance');
    return {route:canAccessView_('technical-performance'),navHidden:!n||getComputedStyle(n).display==='none',viewHidden:!v||v.hidden||getComputedStyle(v).display==='none'||v.getAttribute('aria-hidden')==='true'};
  });
  assert.equal(denied.route,false); assert.equal(denied.navHidden,true); assert.equal(denied.viewHidden,true);
  const allowed = await page.evaluate(() => {
    window.CURRENT_USER={username:'tp-qa',role:'Superadmin'};
    window.OMODOS_TechnicalPerformance.syncAuth();
    const n=document.getElementById('nav-technical-performance'),v=document.getElementById('view-technical-performance');
    const route=canAccessView_('technical-performance'),nav=!!n&&getComputedStyle(n).display!=='none';
    n.querySelector('button').click();
    return {route,nav,active:!!v&&v.classList.contains('active'),title:!!v?.querySelector('h1')};
  });
  assert.equal(allowed.route,true); assert.equal(allowed.nav,true); assert.equal(allowed.active,true); assert.equal(allowed.title,true);
  assert.deepEqual(errors,[]);
  console.log('Technical Performance browser QA passed: Superadmin access and Technician denial.');
} finally { await browser.close(); }
