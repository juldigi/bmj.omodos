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

vm.runInNewContext(source.slice(start, end) + '\nthis.odinGroupedRows = odinGroupedRows; this.odinTopRows = odinTopRows;', context);
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
  row('OFU-1', 'ROLL BAK TINTA UNIT 8 ABNORMAL', 30, '1400075203'),
  row('OFU-1', 'Perbaikan Roll tinta U8 Tidak berputar', 130, '1400075455'),
  row('OFU-1', 'ROLL BAK TINTA UNIT 8 TIDAK BERPUTAR (ABNORMAL)', 90, '1400075406'),
  row('OFU-1', 'Putaran Roll tinta u8 UbNormal berhenti', 80, '1400075437'),
  row('APM-7', 'Perbaikkan saccer unit feeder ada 3 yang tidak ngisep', 170, '1400075452'),
  row('APM-7', 'ganti motor vacum feeder yang rusak oleh electrik', 70, '1400075618'),
  row('OFS-8', 'PEBAIKAN FEEDER SUCKER TIDAK NGISEP', 165, '1400075606'),
  row('OFS-8', 'LANJUT PERBAIKAN SUCKER', 60, '1400075607'),
  row('FGM-1', 'Total', 720, '1400070000')
];

const grouped = context.odinGroupedRows();
const top = context.odinTopRows();
assert.equal(top.length, 3, 'Top 3 should include only three real issue groups');
assert.equal(top[0].issue, 'Timing Feed Table');
assert.equal(top[0].machine, 'APM-2');
assert.equal(top[0].events, 4, 'Timing variants should count four distinct notifications');
assert.equal(top[0].variants.length, 4, 'Keep all raw issue descriptions for auditability');
assert.ok(Math.abs(top[0].hours - (835 / 60)) < 1e-9, 'Timing duration should sum to 835 minutes / 60');
assert.equal(top[1].issue, 'Roll Bak Tinta Unit 8 — Tidak Berputar / Abnormal');
assert.equal(top[1].machine, 'OFU-1');
assert.equal(top[1].events, 5, 'All five real Roll Tinta Unit 8 notifications should be counted');
assert.equal(top[1].variants.length, 5);
assert.ok(Math.abs(top[1].hours - 8) < 1e-9, 'Roll Tinta Unit 8 variants should sum to 480 minutes / 60');
assert.equal(top[2].issue, 'Feeder / Suction — Abnormal');
assert.equal(top[2].machine, 'APM-7');
assert.equal(top[2].events, 2, 'APM-7 feeder repairs should count two distinct notifications');
assert.equal(top[2].variants.length, 2);
assert.ok(Math.abs(top[2].hours - 4) < 1e-9, 'APM-7 feeder issue should sum to 240 minutes / 60');
const ofs8 = grouped.find(g => g.machine === 'OFS-8' && g.issue === 'Feeder / Suction — Abnormal');
assert.ok(ofs8, 'OFS-8 sucker continuation must remain traceable as a separate machine group');
assert.equal(ofs8.events, 2);
assert.equal(ofs8.variants.length, 2);
assert.ok(Math.abs(ofs8.hours - 3.75) < 1e-9, 'OFS-8 feeder sucker issue should sum to 225 minutes / 60');
assert.ok(top.every(x => x.issue !== 'Total'), 'Summary rows must not be ranked as issues');

// September 2026 source contains common typing variants that must roll up
// without losing the original descriptions or mixing different machines.
state.odin.rows = [
  row('OFU-1', 'PERBAIKAN GREEFER TRANSFER UNIT 8 GA JEPIT KERTAS', 415, '1400076101'),
  row('OFU-1', 'PERBAIKAN GRIFER TRANSFER', 240, '1400076105'),
  row('OFU-1', 'Perbaikan Gripper Transfer', 60, '1400076108'),
  row('OFS-8', 'PRBAIKAN FEDERT', 205, '1400076201'),
  row('OFS-8', 'PERBAIKAN FEDERT TIDAK MAU BERGERAK', 140, '1400076202'),
  row('OFS-8', 'feeder fault, vacum, blower feeder problem', 80, '1400076203'),
  row('OFS-8', 'Auxility at file battom feeder', 50, '1400076204'),
  row('OFU-1', 'PROBLEM REGISTER GERAK SENDIRI UNIT 6 DAN 7', 220, '1400076104'),
  row('OFU-1', 'Perbaikan Register Unit6', 90, '1400076093'),
  row('OFU-1', 'PROBLEM REGISTER RUBAH2 SENDIRI', 30, '1400076094'),
  row('APM-2', 'motor up down meja fider suaranya berisik', 20, '1400076095')
];
const septemberTop = context.odinTopRows();
assert.equal(septemberTop[0].issue, 'Gripper Transfer');
assert.equal(septemberTop[0].machine, 'OFU-1');
assert.equal(septemberTop[0].events, 3);
assert.ok(Math.abs(septemberTop[0].hours - (715 / 60)) < 1e-9);
assert.equal(septemberTop[0].variants.length, 3);
assert.equal(septemberTop[1].issue, 'Feeder / Suction — Abnormal');
assert.equal(septemberTop[1].machine, 'OFS-8');
assert.equal(septemberTop[1].events, 4);
assert.ok(Math.abs(septemberTop[1].hours - (475 / 60)) < 1e-9);
assert.equal(septemberTop[2].issue, 'Register Berubah / Abnormal');
assert.equal(septemberTop[2].machine, 'OFU-1');
assert.equal(septemberTop[2].events, 3);
assert.ok(Math.abs(septemberTop[2].hours - (340 / 60)) < 1e-9);
const fider = context.odinGroupedRows().find(g => g.machine === 'APM-2' && g.issue === 'Feeder / Suction — Abnormal');
assert.ok(fider, 'the common fider typo should map to the feeder family');
assert.equal(fider.events, 1);


console.log('Technical Performance ODIN tests passed: recurring variants, notification count, duration conversion, traceable raw variants, and total-row exclusion.');
