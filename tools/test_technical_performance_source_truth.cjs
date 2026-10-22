#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync('public/omodos4/technical-performance.js', 'utf8');
const oeeStart = source.indexOf('function extractOfficialOee(wb){');
const mtcStart = source.indexOf('function extractMtcAudit(X,wb){', oeeStart);
const end = source.indexOf('function applyMatrix(matrix,headerRow){', mtcStart);
assert.ok(oeeStart >= 0 && mtcStart > oeeStart && end > mtcStart,
  'Official OEE and MTC source-audit functions must exist');

const context = {};
vm.runInNewContext(
  source.slice(oeeStart, mtcStart) +
  '\n' +
  source.slice(mtcStart, end) +
  '\nthis.extractOfficialOee = extractOfficialOee; this.extractMtcAudit = extractMtcAudit;',
  context
);

function sheet(cells = {}) {
  const out = {};
  for (const [ref, value] of Object.entries(cells)) out[ref] = { v: value };
  return out;
}
function near(actual, expected, message) {
  assert.ok(Number.isFinite(actual), message + ': value should be finite');
  assert.ok(Math.abs(actual - expected) < 1e-9, message + ': expected ' + expected + ', got ' + actual);
}

const printingA = 0.5983, printingP = 0.6420, printingQ = 0.9856;
const apA = 0.8707, apP = 0.5871, apQ = 0.9988;
const fgA = 0.9480, fgP = 0.4685, fgQ = 0.9925;
const machineNames = [
  ...Array.from({length:9}, (_,i) => 'OFS-' + (i+1)),
  ...Array.from({length:8}, (_,i) => 'AP#' + (i+2)),
  ...Array.from({length:3}, (_,i) => 'FG#' + (i+1))
];
const oeeWorkbook = {
  SheetNames: machineNames.concat(['OEE Printing (2)','OEE AP','OEE FG']),
  Sheets: {
    'OEE Printing (2)': sheet({
      K2: printingA*printingP*printingQ, K3:printingA, K4:printingP, K5:printingQ,
      E7:240, F7:2448.552
    }),
    'OEE AP': sheet({
      J2: apA*apP*apQ, J3:apA, J4:apP, J5:apQ,
      D7:193.06, E7:1797.02
    }),
    'OEE FG': sheet({
      J2: fgA*fgP*fgQ, J3:fgA, J4:fgP, J5:fgQ,
      D7:34.83, E7:634.986
    })
  }
};
const official = context.extractOfficialOee(oeeWorkbook);
assert.ok(official, 'The recognized three-group official OEE workbook should produce a summary');
assert.equal(official.rows.length, 3);
const [printing, apm, fgm] = official.rows;
near(printing.oeeCalculated, printingA*printingP*printingQ, 'Printing OEE formula');
near(printing.utilization, (240+2448.552)/(720*9), 'Printing calendar utilization formula');
near(printing.teep, printing.oee*printing.utilization, 'Printing TEEP formula');
near(apm.utilization, (193.06+1797.02)/(720*8), 'APM calendar utilization formula');
near(apm.teep, apm.oee*apm.utilization, 'APM TEEP formula');
near(fgm.utilization, (34.83+634.986)/(720*3), 'FGM calendar utilization formula');
near(fgm.teep, fgm.oee*fgm.utilization, 'FGM TEEP formula');
assert.equal(printing.oeeCheck, 'Cocok');
assert.equal(apm.oeeCheck, 'Cocok');
assert.equal(fgm.oeeCheck, 'Cocok');

// Row 4 is the header. Only the exact trimmed Category value MTC may be counted.
// IPM, MECHANICAL FAILURE, and MTC REPAIR must not be included as MTC.
function detailSheet(categoryHeader, hourHeader, entries) {
  return { matrix: [
    [], [], [],
    [categoryHeader, hourHeader],
    ...entries.map(([category, hours]) => [category, hours])
  ] };
}
const X = { utils: { sheet_to_json: (ws) => ws.matrix } };
const mtcWorkbook = {
  Sheets: {
    'Report MTC': sheet({E18:2,E9:5,J19:1,J10:1.25,N18:1,N9:0.75}),
    'Lost Time Printing': detailSheet('Category','Hour',[
      ['MTC',2],[' IPM ',100],['MTC',3],['MTC REPAIR',50],['MECHANICAL FAILURE',9]
    ]),
    'Lost Time AP': detailSheet('Category','Hour',[
      ['MTC',1.25],['IPM',80],['MTC Repair',7]
    ]),
    'Lost Time FG': detailSheet('Category','Hour',[
      ['MTC',0.75],['IPM',5],['ELECTRICAL FAILURE',12]
    ])
  }
};
const audit = context.extractMtcAudit(X, mtcWorkbook);
assert.ok(audit, 'MTC audit should be produced when detail and pivot sheets exist');
assert.equal(audit.mismatch, false, 'Matching exact-MTC detail and pivot values should pass');
assert.deepEqual(Array.from(audit.rows, r => [r.detailRecords,r.detailHours,r.pivotRecords,r.pivotHours]), [
  [2,5,2,5], [1,1.25,1,1.25], [1,0.75,1,0.75]
]);

const stalePivot = {
  Sheets: {
    ...mtcWorkbook.Sheets,
    'Report MTC': sheet({E18:17,E9:9.4166666667,J19:8,J10:8.6666666667,N18:3,N9:1.5})
  }
};
const mismatch = context.extractMtcAudit(X, stalePivot);
assert.equal(mismatch.mismatch, true, 'A stale/out-of-scope pivot must be flagged instead of silently accepted');
assert.equal(mismatch.rows[0].mismatch, true);
assert.equal(mismatch.rows[1].mismatch, true);
assert.equal(mismatch.rows[2].mismatch, true);

console.log('Technical Performance source-truth tests passed: OEE/TEEP formulas, exact-MTC filtering, and detail-vs-pivot mismatch detection.');
