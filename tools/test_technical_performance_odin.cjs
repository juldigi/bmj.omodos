#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const path = 'public/omodos4/technical-performance.js';
const source = fs.readFileSync(path, 'utf8');
const start = source.indexOf('function odinCanonicalIssue(');
const end = source.indexOf('function odinLatestMonthLabel()', start);
assert.ok(start >= 0 && end > start, 'ODIN canonicalization and Top 3 functions must exist');

const state = {
  odin: {
    mapping: {
      machine: 'Machine',
      problem: 'Problem',
      section: 'Section',
      notif: 'Notif',
      elec: 'Elec',
      mech: 'Mech',
      comp: 'Comp',
      rootCause: 'Root cause',
      corrective: 'Corrective action',
      actionPlan: 'Action plan'
    },
    durationUnit: 'minutes',
    rows: []
  }
};

function valueFor(row, key) {
  const col = state.odin.mapping[key];
  return col ? row[col] : '';
}
function hoursFor(row) {
  const keys = ['elec', 'mech', 'comp'].filter(key => Boolean(state.odin.mapping[key]));
  let total = 0;
  let found = false;
  for (const key of keys) {
    const raw = valueFor(row, key);
    const value = raw === '' || raw === null || raw === undefined ? NaN : Number(String(raw).replace(',', '.'));
    if (Number.isFinite(value) && value >= 0) {
      total += value;
      found = true;
    }
  }
  if (!found) return NaN;
  return state.odin.durationUnit === 'minutes' ? total / 60 : total;
}
const context = { state, oVal: valueFor, odinHours: hoursFor };

vm.runInNewContext(source.slice(start, end) + '\nthis.odinTopRows = odinTopRows;', context);
const row = (machine, problem, minutes, notif, section = 'MECHANICAL FAILURE') => ({
  Machine: machine,
  Problem: problem,
  Section: section,
  Elec: '0',
  Mech: String(minutes),
  Comp: '0',
  Notif: notif
});

state.odin.rows = [
  row('APM-2', 'setting timming', 420, '1400075228'),
  row('APM-2', 'perbaikan timing fedtabel', 220, '1400075234'),
  row('APM-2', 'timming rubah', 180, '1400075227'),
  row('APM-2', 'TIMING UBAH SUDAH PENANGANAN', 15, '1400075205'),
  row('OFU-1', 'Perbaikan Roll Bak Tinta Unit8(Putaran Abnormal)', 150, '1400075327'),
  row('OFU-1', 'Perbaikan Roll tinta U8 Tidak berputar', 130, '1400075455'),
  row('OFU-1', 'ROLL BAK TINTA UNIT 8 TIDAK BERPUTAR (ABNORMAL)', 90, '1400075406'),
  row('OFU-1', 'Putaran Roll tinta u8 UbNormal berhenti', 80, '1400075437'),
  row('OFS-8', 'PEBAIKAN FEEDER SUCKER TIDAK NGISEP', 165, '1400075606'),
  row('FGM-1', 'Total', 720, '1400070000')
];

const top = context.odinTopRows();
assert.equal(top.length, 3, 'Top 3 should include only three real issue groups');
assert.equal(top[0].issue, 'Timing Feed Table');
assert.equal(top[0].machine, 'APM-2');
assert.equal(top[0].events, 4, 'Timing variants should count four distinct notifications');
assert.equal(top[0].variants.length, 4, 'Keep all raw issue descriptions for auditability');
assert.ok(Math.abs(top[0].hours - (835 / 60)) < 1e-9, 'Timing duration should sum to 835 minutes / 60');
assert.equal(top[1].issue, 'Roll Bak Tinta Unit 8 — Tidak Berputar / Abnormal');
assert.equal(top[1].events, 4);
assert.equal(top[1].variants.length, 4);
assert.ok(Math.abs(top[1].hours - 7.5) < 1e-9, 'Roll Tinta Unit 8 variants should sum to 7.5 hours');
assert.equal(top[2].issue, 'Feeder / Suction — Abnormal');
assert.ok(Math.abs(top[2].hours - 2.75) < 1e-9, 'Feeder duration should be 165 minutes / 60');
assert.ok(top.every(x => x.issue !== 'Total'), 'Summary rows must not be ranked as issues');

console.log('Technical Performance ODIN tests passed: recurring variants, notification count, duration conversion, traceable raw variants, and total-row exclusion.');
