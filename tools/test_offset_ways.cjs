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
near(teep.planned, 21, 'Planned production time over three shifts');
near(teep.shutdown, 3, 'Planned shutdown over three shifts');
near(teep.utilization, 0.875, 'Utilization');
near(teep.teep, 7/12, 'TEEP');
near(teep.productive, 14, 'Calendar fully productive equivalent time');

const invalidOee = api.calculateOee({
  pot: 8, psd: 1, downtime: 8, speed: 15000, total: 72000, good: 70000
});
assert.equal(invalidOee.valid, false, 'downtime longer than PPT must be rejected');
const invalidTeep = api.calculateTeep({ shifts: 3, hours: 8, psd: 8, oee: 2/3 });
assert.equal(invalidTeep.valid, false, 'shutdown equal to shift length must be rejected');

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
assert.ok(css.includes('html.omodos-theme-20'), 'theme class should be defined');
assert.ok(css.includes('.ow-hero') && css.includes('.ow-motto-grid') && css.includes('.ow-role-grid'), 'poster-inspired graphics/styles should exist');
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

console.log('Offset Ways static and calculation tests: PASS');
console.log('Poster arithmetic verified: OEE 66.67%, Utilization 87.5%, TEEP 58.33%, productive equivalent 14 h/day.');
console.log('Backend read/write/delete actions are registered and superadmin-gated.');
