'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync('public/omodos4/technical-performance.js', 'utf8');
const window = {};
const document = { readyState: 'loading', addEventListener() {} };
vm.runInNewContext(source, { window, document, console, Date, Math, Number, String, Array, Object, RegExp, JSON }, { filename: 'technical-performance.js' });
const api = window.OMODOS_TECHNICAL_PERFORMANCE;
assert.ok(api, 'module exposes calculation helpers');

function close(actual, expected, epsilon, label) {
  assert.ok(Number.isFinite(actual), label + ' must be a finite number');
  assert.ok(Math.abs(actual - expected) <= epsilon, label + ': expected ' + expected + ', got ' + actual);
}

assert.equal(api.normalizeKey(' Availability (%) '), 'availability');
close(api.parseRatio('59,83%'), 0.5983, 1e-8, 'Indonesian formatted percent');
close(api.parseRatio('0.642'), 0.642, 1e-8, 'ratio decimal');
close(api.parseRatio('64.20'), 0.642, 1e-8, 'percentage without percent sign');
assert.equal(api.parseRatio('150%'), null, 'out-of-range percent is rejected');

const ppt = 720 * 0.4149;
const ot = ppt * 0.5983;
const not = ot * 0.642;
const fpt = not * 0.9856;
const row = api.deriveRow({
  period: '2026-09', group: 'Printing', machine: 'Offset 5',
  plannedTime: ppt, calendarTime: 720, operatingTime: ot,
  netOperatingTime: not, fullyProductiveTime: fpt,
  availabilityInput: null, performanceInput: null, qualityInput: null,
  utilizationInput: null, oeeInput: 0.3785, teepInput: 0.1570,
  goodQty: null, ncQty: null, totalQty: null
});
close(row.availability, 0.5983, 1e-8, 'Availability OT/PPT');
close(row.performance, 0.642, 1e-8, 'Performance NOT/OT');
close(row.quality, 0.9856, 1e-8, 'Quality FPT/NOT');
close(row.oeeCalculated, 0.5983 * 0.642 * 0.9856, 1e-8, 'OEE A×P×Q');
close(row.utilization, 0.4149, 1e-8, 'Utilization PPT/POT');
close(row.teepCalculated, 0.4149 * 0.5983 * 0.642 * 0.9856, 1e-8, 'TEEP U×OEE');
assert.equal(row.teepStatus, 'calculated', 'TEEP with matching time denominators is marked calculated');
assert.ok(row.warnings.some(x => x.includes('TEEP')), 'difference between source and calculated TEEP is auditable');

const noCalendar = api.deriveRow({
  period: '2026-09', group: 'Printing', machine: 'Offset 5',
  plannedTime: null, calendarTime: null, operatingTime: null,
  netOperatingTime: null, fullyProductiveTime: null,
  availabilityInput: 0.5983, performanceInput: 0.642, qualityInput: 0.9856,
  utilizationInput: 0.4149, oeeInput: 0.3785, teepInput: 0.1570
});
assert.equal(noCalendar.utilizationStatus, 'reported-unverified', 'source utilization without PPT/POT is unverified');
assert.notEqual(noCalendar.teepStatus, 'calculated', 'TEEP without time denominators cannot be marked validated');

const partial = api.deriveRow({ period: '2026-09', group: 'FGM', machine: 'Machine A', oeeInput: 0.44, teepInput: 0.13 });
assert.equal(partial.availability, null);
assert.equal(partial.performance, null);
assert.equal(partial.quality, null);
assert.equal(partial.oee, 0.44, 'source OEE may be displayed but not claimed as formula-validated');
assert.equal(partial.oeeStatus, 'reported-unverified');
assert.notEqual(partial.teepStatus, 'calculated');

const ncOnly = api.deriveRow({ group: 'APM', machine: 'Machine B', goodQty: null, ncQty: 5, totalQty: 100 });
assert.equal(ncOnly.quality, null, 'NC quantity must not silently count as good production');

const noDenominators = api.rollupRows([
  { group: 'Printing', machine: 'A', availabilityInput: 0.5, performanceInput: 0.7, qualityInput: 0.99 },
  { group: 'Printing', machine: 'B', availabilityInput: 0.9, performanceInput: 0.5, qualityInput: 0.98 }
]);
assert.equal(noDenominators.availability, null, 'group percentages are not simply averaged without denominators');
assert.equal(noDenominators.oee, null, 'group OEE stays unavailable without weighted factors');
assert.equal(api.rollupRows([]), null);

const weighted = api.rollupRows([
  { group: 'Printing', machine: 'A', plannedTime: 100, calendarTime: 200, operatingTime: 80, netOperatingTime: 60, fullyProductiveTime: 59 },
  { group: 'Printing', machine: 'B', plannedTime: 300, calendarTime: 400, operatingTime: 240, netOperatingTime: 120, fullyProductiveTime: 118 }
]);
close(weighted.availability, 320 / 400, 1e-8, 'weighted group availability');
close(weighted.performance, 180 / 320, 1e-8, 'weighted group performance');
close(weighted.quality, 177 / 180, 1e-8, 'weighted group quality');
close(weighted.utilization, 400 / 600, 1e-8, 'weighted group utilization');
close(weighted.oee, (320 / 400) * (180 / 320) * (177 / 180), 1e-8, 'weighted group OEE');
close(weighted.teep, (400 / 600) * weighted.oee, 1e-8, 'weighted group TEEP');

console.log('Technical Performance tests passed: ratio parsing, OEE/TEEP formulae, source-validation flags, NC quality handling, and weighted roll-up.');
