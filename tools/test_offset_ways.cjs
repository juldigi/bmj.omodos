'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const moduleSource = fs.readFileSync('public/omodos4/offset-ways.js', 'utf8');
const css = fs.readFileSync('public/omodos4/offset-ways.css', 'utf8');
const hotfix = fs.readFileSync('public/omodos4/hotfix.js', 'utf8');
const worker = fs.readFileSync('src/worker.js', 'utf8');

const fakeWindow = {};
const fakeDocument = {
  readyState: 'loading',
  addEventListener() {},
  getElementById() { return null; }
};
vm.runInNewContext(moduleSource, { window: fakeWindow, document: fakeDocument }, { timeout: 2000 });
const api = fakeWindow.OMODOS_OFFSET_WAYS;
assert.ok(api, 'Offset Ways module exports its testable calculations');
assert.equal(typeof api.calculateOee, 'function');
assert.equal(typeof api.calculateTeep, 'function');

const oee = api.calculateOee({
  machine: 'Contoh poster',
  date: '2026-10-02',
  shift: '1',
  pot: 8,
  psd: 1,
  downtime: 1,
  speed: 15000,
  total: 72000,
  good: 70000
});
assert.equal(oee.valid, true, 'poster OEE inputs should be valid');
const near = (actual, expected, label) => {
  assert.ok(Math.abs(actual - expected) < 1e-8, label + ': expected ' + expected + ', got ' + actual);
};
near(oee.ppt, 7, 'Planned Production Time');
near(oee.operating, 6, 'Operating Time');
near(oee.availability, 6/7, 'Availability');
near(oee.performance, 0.8, 'Performance');
near(oee.quality, 70000/72000, 'Quality');
near(oee.oee, 2/3, 'OEE');
near(oee.netHours, 4.8, 'Net Operating Time');
near(oee.goodHours, 70/15, 'Fully Productive Time');
near(oee.speedLoss, 1.2, 'Speed loss');
near(oee.qualityLoss * 60, 8, 'Quality loss in minutes');

const teep = api.calculateTeep({ shifts: 3, hours: 8, psd: 1, oee: oee.oee });
assert.equal(teep.valid, true, 'poster TEEP example should be valid');
near(teep.calendar, 24, 'Calendar time');
near(teep.scheduled, 24, 'Scheduled hours for three 8-hour shifts');
near(teep.offSchedule, 0, 'Off-schedule hours for three 8-hour shifts');
near(teep.planned, 21, 'Planned production time over three shifts');
near(teep.shutdown, 3, 'Planned shutdown over three shifts');
near(teep.utilization, 0.875, 'Utilization');
near(teep.teep, 7/12, 'TEEP');
near(teep.productive, 14, 'Calendar fully productive equivalent time');

const twoShiftTeep = api.calculateTeep({ shifts: 2, hours: 8, psd: 1, oee: oee.oee });
assert.equal(twoShiftTeep.valid, true, 'two shifts of 8 hours should be valid');
near(twoShiftTeep.calendar, 24, 'Two-shift calendar denominator');
near(twoShiftTeep.scheduled, 16, 'Two-shift scheduled hours');
near(twoShiftTeep.offSchedule, 8, 'Two-shift off-schedule hours');
near(twoShiftTeep.planned, 14, 'Two-shift planned production hours');
near(twoShiftTeep.utilization, 14/24, 'Two-shift calendar utilization');
near(twoShiftTeep.teep, (2/3)*(14/24), 'Two-shift TEEP');
near(twoShiftTeep.productive, 28/3, 'Two-shift productive equivalent hours');

const oneShiftTeep = api.calculateTeep({ shifts: 1, hours: 8, psd: 1, oee: oee.oee });
assert.equal(oneShiftTeep.valid, true, 'one 8-hour shift should be valid');
near(oneShiftTeep.utilization, 7/24, 'One-shift calendar utilization');
near(oneShiftTeep.teep, (2/3)*(7/24), 'One-shift TEEP');
near(oneShiftTeep.productive, 14/3, 'One-shift productive equivalent hours');
const overbookedShifts = api.calculateTeep({ shifts: 4, hours: 8, psd: 1, oee: oee.oee });
assert.equal(overbookedShifts.valid, false, 'scheduled shift hours must not exceed 24 calendar hours');

const invalidOee = api.calculateOee({
  pot: 8, psd: 1, downtime: 8, speed: 15000, total: 72000, good: 70000
});
assert.equal(invalidOee.valid, false, 'downtime longer than PPT must be rejected');
const overIdealOee = api.calculateOee({
  pot: 8, psd: 1, downtime: 1, speed: 15000, total: 90001, good: 90000
});
assert.equal(overIdealOee.valid, false, 'production above ideal output should not be saved with OEE over 100%');
const noOperatingTimeOee = api.calculateOee({
  pot: 8, psd: 1, downtime: 7, speed: 15000, total: 100, good: 100
});
assert.equal(noOperatingTimeOee.valid, false, 'positive production with zero operating time must be rejected');
const blankOee = api.calculateOee({
  pot: 8, psd: NaN, downtime: 1, speed: 15000, total: 72000, good: 70000
});
assert.equal(blankOee.valid, false, 'blank numeric OEE inputs must not silently fall back to poster examples');
const invalidTeep = api.calculateTeep({ shifts: 3, hours: 8, psd: 8, oee: 2/3 });
assert.equal(invalidTeep.valid, false, 'shutdown equal to shift length must be rejected');
const blankTeep = api.calculateTeep({ shifts: 3, hours: 8, psd: NaN, oee: 2/3 });
assert.equal(blankTeep.valid, false, 'blank PSD must be rejected');
const outOfRangeTeep = api.calculateTeep({ shifts: 3, hours: 8, psd: 1, oee: 1.2 });
assert.equal(outOfRangeTeep.valid, false, 'TEEP calculation must reject OEE outside 0–100%');

for (const marker of [
  'Safety First', 'Quality #1', 'Zero Losses', '100% Ownership',
  'RMS', 'FPS', 'Daily Management Discipline', 'Fast Problem Response',
  'Leader Follow Through', 'Clear Accountability', 'Standard Enforcement',
  'Leader as Coach', 'Menjaga Keandalan Mesin', 'Menghilangkan Akar Masalah',
  'Kalkulator OEE', 'Kalkulator TEEP', 'Tindak Lanjut', 'OMODOS 2.0'
]) assert.ok(moduleSource.includes(marker), 'missing required poster content: ' + marker);

assert.ok(hotfix.includes("script.src='/omodos4/offset-ways.js'"), 'hotfix should load Offset Ways module');
assert.ok(hotfix.includes("style.href='/omodos4/offset-ways.css'"), 'hotfix should load the OMODOS 2.0 theme');
assert.ok(moduleSource.includes('window.goToView.__offsetWaysAdminGuard'), 'frontend route guard must exist');
assert.ok(moduleSource.includes("String(view||'').trim()==='offset-ways' && !isSuperadmin()"), 'Offset Ways route must be superadmin-only');
assert.ok(/THEME_REGISTRY\.push\s*\(/.test(moduleSource), 'OMODOS 2.0 must be registered in the native Theme Manager');
assert.ok(moduleSource.includes("document.documentElement.setAttribute('data-theme',THEME_KEY)"), 'OMODOS 2.0 must use the native theme attribute');
assert.ok(css.includes('html[data-theme="omodos-2.0"]'), 'theme should render from saved app_theme on first page paint');
assert.ok(css.includes('.ow-hero') && css.includes('.ow-motto-grid') && css.includes('.ow-role-grid'), 'poster-inspired graphics/styles should exist');
assert.ok(css.includes('application-wide high-contrast icon system'), 'OMODOS 2.0 must define the global icon contrast layer');
assert.ok(css.includes('color: #064b96 !important;'), 'icons on light surfaces must use a high-contrast navy');
assert.ok(css.includes('.sidebar') && css.includes('color: inherit !important;'), 'sidebar icons must preserve high-contrast active/inactive text colors');
assert.ok(css.includes('.ow-tab.active') && css.includes('.ow-btn.primary'), 'filled primary controls must preserve their foreground icon colors');
assert.ok(css.includes('.badge, [class*="badge-"]'), 'status and badge icons must follow their semantic foreground colors');
assert.ok(css.includes('color: #b7f5c9 !important;'), 'dark footer icon accent must remain visible');
assert.ok(!css.includes('font:600 12px/1.4 inherit'), 'invalid form font shorthand must not return');

const registryStart = worker.indexOf('const ACTION_REGISTRY = {');
const registryEnd = worker.indexOf('function resolveAction_', registryStart);
assert.ok(registryStart >= 0 && registryEnd > registryStart, 'action registry must exist');
const registry = worker.slice(registryStart, registryEnd);
const actions = [
  ['offsetWaysRead', 'handleOffsetWaysRead_'],
  ['offsetWaysSave', 'handleOffsetWaysSave_'],
  ['offsetWaysDelete', 'handleOffsetWaysDelete_']
];
for (const [action, handler] of actions) {
  const re = new RegExp('"' + action + '"\\s*:\\s*\\{[^}]*handler:\\s*"' + handler + '"');
  assert.ok(re.test(registry), action + ' must be registered to ' + handler);
  const handlerStart = worker.indexOf('function ' + handler + '(body)');
  const handlerEnd = worker.indexOf('__name(' + handler, handlerStart);
  assert.ok(handlerStart >= 0 && handlerEnd > handlerStart, handler + ' implementation must exist');
  assert.ok(worker.slice(handlerStart, handlerEnd).includes('requireSuperadmin_(body.actor)'),
    handler + ' must check superadmin server-side');
  assert.ok(worker.includes('if (action === "' + action + '") return ' + handler + '(body);'),
    action + ' must be connected to legacy dispatch');
}
assert.ok(worker.includes('"OMODOS_OffsetWays"'), 'new records should use the existing database-backed storage abstraction');
assert.ok(worker.includes('case "offsetWaysSave":') && worker.includes('case "offsetWaysDelete":'), 'write actions must validate payloads');
const validateStart = worker.indexOf('function validatePayload_(action, body)');
const fileFieldsAt = worker.indexOf('var fileFields =', validateStart);
const validateBlock = worker.slice(validateStart, fileFieldsAt);
const defaultCaseAt = validateBlock.indexOf('      default:');
for (const action of ['offsetWaysSave', 'offsetWaysDelete', 'offsetWaysRead']) {
  const caseAt = validateBlock.indexOf('case "' + action + '":');
  assert.ok(caseAt >= 0 && caseAt < defaultCaseAt, action + ' validation case must be inside the action switch before default');
}

console.log('Offset Ways static and calculation tests: PASS');
console.log('Poster arithmetic verified: OEE 66.67%, Utilization 87.5%, TEEP 58.33%, productive equivalent 14 h/day.');
console.log('Backend read/write/delete actions are registered and superadmin-gated.');
