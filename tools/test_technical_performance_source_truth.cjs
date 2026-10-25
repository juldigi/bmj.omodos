#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync('public/omodos4/technical-performance.js', 'utf8');
const shellSource = fs.readFileSync('public/omodos4/superadmin-intelligence.js', 'utf8');
const loaderStart = shellSource.indexOf('OMODOS_TP_LOADER_V1');
assert.ok(loaderStart >= 0, 'Single Technical Performance lazy loader must exist in the loaded Superadmin intelligence asset');
const technicalLoader = shellSource.slice(loaderStart);
assert.ok(technicalLoader.includes("script.src='/omodos4/technical-performance.js'"),
  'The loaded Superadmin asset must load the Technical Performance module from its local asset path');
assert.ok(technicalLoader.includes("return role==='superadmin';"),
  'Technical Performance module must remain unloaded for non-Superadmin accounts');
assert.ok(source.includes('function manualNavigate()') &&
          source.includes('if(!p||!allowed())return;'),
  'Direct feature navigation must enforce the Superadmin gate before showing the view');
assert.ok(technicalLoader.includes("window.addEventListener('focus',sync)") &&
          technicalLoader.includes("document.addEventListener('visibilitychange'"),
  'Lazy loading must resynchronize when authentication/RBAC changes');
assert.ok(technicalLoader.includes('attempts>=40') && technicalLoader.includes('clearInterval(timer)'),
  'Initial auth polling must remain bounded rather than poll indefinitely');
assert.ok(!fs.readFileSync('public/omodos4/hotfix.js', 'utf8').includes('TECHNICAL_PERFORMANCE_IMPORT_MVP_V1'),
  'The hotfix bundle must not register a duplicate Technical Performance loader');
assert.ok(source.includes("s.src='/vendor/xlsx.min.js'"), 'Excel import should use the locally bundled XLSX reader');
assert.ok(!source.includes('cdn.jsdelivr.net/npm/xlsx'), 'Excel import must not depend on a remote CDN');

// RBAC regression: the feature must recognize the same Superadmin role aliases
// as OMODOS factory-home, while continuing to deny technician/other accounts.
assert.ok(source.includes('u.role||u.Role||u.roleName||u.role_name||u.level'),
  'Superadmin guard should recognize OMODOS role field aliases');
const authStart = source.indexOf('function user(){');
const authEnd = source.indexOf('function notify(', authStart);
assert.ok(authStart >= 0 && authEnd > authStart, 'Role guard functions must be directly testable');
const authContext = { window: {} };
vm.runInNewContext(source.slice(authStart, authEnd) + '\nthis.allowed = allowed; this.user = user;', authContext);
authContext.CURRENT_USER = { role: 'Superadmin' };
assert.equal(authContext.allowed(), true, 'Canonical CURRENT_USER.role Superadmin is allowed');
authContext.CURRENT_USER = undefined;
authContext.window.currentUser = { roleName: 'SUPER ADMIN' };
assert.equal(authContext.allowed(), true, 'window.currentUser.roleName with spaces is allowed');
authContext.window.currentUser = { role_name: 'super_admin' };
assert.equal(authContext.allowed(), true, 'role_name with underscores is allowed');
authContext.window.currentUser = { level: 'super-admin' };
assert.equal(authContext.allowed(), true, 'level with hyphens is allowed');
authContext.window.currentUser = { role: 'technician' };
assert.equal(authContext.allowed(), false, 'Technician must not access Technical Performance');
authContext.window.currentUser = null;
assert.equal(authContext.allowed(), false, 'Unauthenticated/unknown role must not access Technical Performance');
assert.ok(source.includes("X.read(buf,{type:'array',cellDates:false,cellStyles:true})"),
  'Official workbook reader must preserve hidden-row metadata for the MTC SUBTOTAL/Pivot audit');
assert.ok(source.includes('function defaultDataStartRow(name,headerRow){'),
  'Worksheet import must separate header row from data start row');
const dataStartStart = source.indexOf('function defaultDataStartRow(name,headerRow){');
const dataStartEnd = source.indexOf('function extractOfficialOee(wb){', dataStartStart);
assert.ok(dataStartStart >= 0 && dataStartEnd > dataStartStart,
  'Default worksheet data-start helper must be directly testable');
const dataStartContext = {};
vm.runInNewContext(
  source.slice(dataStartStart, dataStartEnd) + '\nthis.defaultDataStartRow = defaultDataStartRow;',
  dataStartContext
);
assert.equal(dataStartContext.defaultDataStartRow('Kertas Kerja', 7), 11,
  'Formatted Kertas Kerja starts data at row 11, not immediately below its header');
assert.equal(dataStartContext.defaultDataStartRow('Kertas Kerja (Simple View)', 7), 8,
  'Simple View Kertas Kerja starts data immediately after its header');
assert.equal(dataStartContext.defaultDataStartRow('OEE Printing (2)', 6), 7,
  'OEE detail uses first data row immediately below header');
assert.equal(dataStartContext.defaultDataStartRow('Lost Time Printing', 4), 5,
  'Lost Time detail uses first data row immediately below header');

const applyMatrixStart = source.indexOf('function applyMatrix(matrix,headerRow,dataStartRow){');
const applyMatrixEnd = source.indexOf('function loadSheetMatrix(name,headerRow,announce){', applyMatrixStart);
assert.ok(applyMatrixStart >= 0 && applyMatrixEnd > applyMatrixStart,
  'Worksheet matrix importer must be directly testable');
const kertasState = {sheetName:'Kertas Kerja',headers:[],rows:[],headerRow:0,dataStartRow:0};
const kertasContext = {state:kertasState,defaultDataStartRow:dataStartContext.defaultDataStartRow};
vm.runInNewContext(
  source.slice(applyMatrixStart, applyMatrixEnd) + String.fromCharCode(10) + 'this.applyMatrix = applyMatrix;',
  kertasContext
);
const kertasMatrix = Array.from({length:12}, () => []);
kertasMatrix[6] = ['Kategori','LT'];
kertasMatrix[7] = ['Header bantu 1',''];
kertasMatrix[8] = ['Header bantu 2',''];
kertasMatrix[9] = ['Nilai bantu',''];
kertasMatrix[10] = ['MTC','1.5'];
kertasMatrix[11] = ['IPM','8'];
kertasContext.applyMatrix(kertasMatrix,7,11);
assert.equal(kertasState.headerRow,7);
assert.equal(kertasState.dataStartRow,11);
assert.equal(kertasState.rows.length,2,
  'Kertas Kerja helper rows 8–10 must not be treated as KPI data');
assert.equal(kertasState.rows[0].Kategori,'MTC');

const simpleViewState = {sheetName:'Kertas Kerja (Simple View)',headers:[],rows:[],headerRow:0,dataStartRow:0};
const simpleViewContext = {state:simpleViewState,defaultDataStartRow:dataStartContext.defaultDataStartRow};
vm.runInNewContext(
  source.slice(applyMatrixStart, applyMatrixEnd) + String.fromCharCode(10) + 'this.applyMatrix = applyMatrix;',
  simpleViewContext
);
const simpleViewMatrix = Array.from({length:9}, () => []);
simpleViewMatrix[6] = ['NO','KEY PERFORMANCE INDICATOR','TARGET'];
simpleViewMatrix[7] = ['1','Machine Loss Time - Printing (%)','5'];
simpleViewMatrix[8] = ['5','MTBF- Printing (Hrs)','56.19'];
simpleViewContext.applyMatrix(simpleViewMatrix,7);
assert.equal(simpleViewState.headerRow,7);
assert.equal(simpleViewState.dataStartRow,8);
assert.equal(simpleViewState.rows.length,2,
  'Simple View KPI rows immediately after the header must not be skipped');
assert.equal(simpleViewState.rows[0]['KEY PERFORMANCE INDICATOR'],'Machine Loss Time - Printing (%)');

const oeeState = {sheetName:'OEE Printing (2)',headers:[],rows:[],headerRow:0,dataStartRow:0};
const oeeContext = {state:oeeState,defaultDataStartRow:dataStartContext.defaultDataStartRow};
vm.runInNewContext(
  source.slice(applyMatrixStart, applyMatrixEnd) + String.fromCharCode(10) + 'this.applyMatrix = applyMatrix;',
  oeeContext
);
const oeeMatrix = Array.from({length:8}, () => []);
oeeMatrix[5] = ['Mesin','OEE'];
oeeMatrix[6] = ['OFS-5','0.3785'];
oeeMatrix[7] = ['Total','0.3785'];
oeeContext.applyMatrix(oeeMatrix,6,7);
assert.equal(oeeState.rows.length,1,
  'OEE worksheet Total line must not become a machine KPI row');
assert.equal(oeeState.rows[0].Mesin,'OFS-5');
const oeeStart = source.indexOf('function extractOfficialOee(wb){');
const mtcStart = source.indexOf('function extractMtcAudit(X,wb){', oeeStart);
const end = source.indexOf('function applyMatrix(matrix,headerRow,dataStartRow){', mtcStart);
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

const printingA = 0.59825912286575167, printingP = 0.64196045513896671, printingQ = 0.98558788917784135;
const apA = 0.87065445979192702, apP = 0.58706840686036976, apQ = 0.99876788864393107;
const fgA = 0.94799701418263249, fgP = 0.468523009623797, fgQ = 0.99252361590757532;
// Mirror the official workbook: 2 Printing machine sheets, 6 APM sheets, 3 FGM sheets.
const machineNames = [
  'OFS-5','OFS-8',
  'AP#2','AP#5','AP#6','AP#7','AP#8','AP#9',
  'FG#1','FG#2','FG#3'
];
const oeeWorkbook = {
  SheetNames: machineNames.concat(['OEE Printing (2)','OEE AP','OEE FG']),
  Sheets: {
    'OEE Printing (2)': sheet({
      A8:46266, K2: printingA*printingP*printingQ, K3:printingA, K4:printingP, K5:printingQ,
      E7:240, F7:357.4
    }),
    'OEE AP': sheet({
      A8:46266, J2: apA*apP*apQ, J3:apA, J4:apP, J5:apQ,
      D7:193.06111666666669, E7:1299.5386000000003
    }),
    'OEE FG': sheet({
      A8:46266, J2: fgA*fgP*fgQ, J3:fgA, J4:fgP, J5:fgQ,
      D7:34.833333333333329, E7:635
    })
  }
};
oeeWorkbook.Sheets['OEE Printing (2)'].K5.f = '(B7+C7)/D7';
oeeWorkbook.Sheets['OEE AP'].J5.f = '+B7/C7';
oeeWorkbook.Sheets['OEE FG'].J5.f = '+B7/C7';
const official = context.extractOfficialOee(oeeWorkbook);
assert.ok(official, 'The recognized three-group official OEE workbook with matching source months should produce a summary');
assert.equal(official.period, 'September 2026',
  'Official OEE summary period must be derived from the shared A8 date on the source sheets');
assert.equal(official.calendarHoursPerMachine, 720, 'September calendar basis must be 30 × 24 hours');
assert.equal(official.qualityIncludesNc, true, 'Source Quality formula including NC must be detected');
const missingPeriodWorkbook = {
  SheetNames: oeeWorkbook.SheetNames,
  Sheets: Object.fromEntries(Object.entries(oeeWorkbook.Sheets).map(([name, ws]) => [name, { ...ws }]))
};
delete missingPeriodWorkbook.Sheets['OEE AP'].A8;
assert.equal(context.extractOfficialOee(missingPeriodWorkbook), null,
  'Official OEE summary must be withheld when any required group sheet lacks its source period');
const mixedPeriodWorkbook = {
  SheetNames: oeeWorkbook.SheetNames,
  Sheets: Object.fromEntries(Object.entries(oeeWorkbook.Sheets).map(([name, ws]) => [name, { ...ws }]))
};
mixedPeriodWorkbook.Sheets['OEE FG'].A8 = { v:46296 };
assert.equal(context.extractOfficialOee(mixedPeriodWorkbook), null,
  'Official OEE summary must be withheld when source group sheets represent different months');
assert.ok(source.includes('Ringkasan OEE/TEEP resmi ditahan karena data grup belum lengkap'),
  'The Technical Performance UI must explain why a recognized but inconsistent OEE workbook has no official summary');
assert.equal(official.rows.length, 3);
const [printing, apm, fgm] = official.rows;
near(printing.oeeCalculated, printingA*printingP*printingQ, 'Printing OEE formula');
assert.equal(printing.machineCount, 2, 'Printing machine count must match official OFS-5 and OFS-8 worksheets');
assert.equal(apm.machineCount, 6, 'APM machine count must match official AP#2/#5/#6/#7/#8/#9 worksheets');
assert.equal(fgm.machineCount, 3, 'FGM machine count must match official FG#1/#2/#3 worksheets');
near(printing.utilization, (240+357.4)/(720*2), 'Printing calendar utilization formula');
near(printing.teep, printing.oee*printing.utilization, 'Printing TEEP formula');
near(apm.utilization, (193.06111666666669+1299.5386000000003)/(720*6), 'APM calendar utilization formula');
near(apm.teep, apm.oee*apm.utilization, 'APM TEEP formula');
near(fgm.utilization, (34.833333333333329+635)/(720*3), 'FGM calendar utilization formula');
near(fgm.teep, fgm.oee*fgm.utilization, 'FGM TEEP formula');
near(printing.utilization, 0.4148611111111111, 'Printing calendar utilization should reconcile to September MOR');
near(apm.utilization, 0.3455091936728396, 'APM calendar utilization should reconcile to September MOR');
near(fgm.utilization, 0.310108024691358, 'FGM calendar utilization should reconcile to September MOR');
near(printing.teep, 0.15703472222222226, 'Printing TEEP September source-truth checkpoint');
near(apm.teep, 0.1763838091563786, 'APM TEEP September source-truth checkpoint');
near(fgm.teep, 0.1367073131001372, 'FGM TEEP September source-truth checkpoint');
assert.equal(printing.oeeCheck, 'Rumus cocok; cek definisi NC');
assert.equal(apm.oeeCheck, 'Cocok', 'APM Quality formula excludes NC; do not apply Printing caveat to this group');
assert.equal(fgm.oeeCheck, 'Cocok', 'FGM Quality formula excludes NC; do not apply Printing caveat to this group');

const februaryWorkbook = {
  SheetNames: oeeWorkbook.SheetNames,
  Sheets: Object.fromEntries(Object.entries(oeeWorkbook.Sheets).map(([name, ws]) => [name, {...ws, A8:{v:45323}}]))
};
const february = context.extractOfficialOee(februaryWorkbook);
assert.equal(february.period, 'Februari 2024');
assert.equal(february.calendarHoursPerMachine, 696, 'Leap-year February uses 29 × 24 calendar hours');
near(february.rows[0].utilization, (240+357.4)/(696*2), 'February TEEP utilization uses February calendar hours');
const qualityExcludesNcWorkbook = {
  SheetNames: oeeWorkbook.SheetNames,
  Sheets: Object.fromEntries(Object.entries(oeeWorkbook.Sheets).map(([name, ws]) => [name, {...ws}]))
};
qualityExcludesNcWorkbook.Sheets['OEE Printing (2)'].K5.f = 'B7/D7';
const qualityExcludesNc = context.extractOfficialOee(qualityExcludesNcWorkbook);
assert.equal(qualityExcludesNc.qualityIncludesNc, false, 'Quality formula without NC must not trigger the NC warning');
assert.equal(qualityExcludesNc.rows[0].oeeCheck, 'Cocok', 'OEE formula remains a match when the source Quality definition does not include NC');

// Row 4 is the header. Only the exact trimmed Category value MTC may be counted.
// IPM, MECHANICAL FAILURE, and MTC REPAIR must not be included as MTC.
function detailSheet(categoryHeader, hourHeader, entries, firstDataRow, totalCellColumn, prefaceEntries = []) {
  const matrix = Array.from({length:firstDataRow - 1}, () => []);
  matrix[3] = ['PRO', categoryHeader, hourHeader]; // worksheet row 4
  prefaceEntries.forEach((entry, i) => { matrix[4 + i] = entry; });
  entries.forEach((entry, i) => { matrix[firstDataRow - 1 + i] = entry; });
  const ws = { matrix };
  const lastDataRow = firstDataRow + entries.length - 1;
  ws[totalCellColumn + '3'] = {
    v: entries.reduce((sum, entry) => sum + (Number(entry[2]) || 0), 0),
    f: 'SUBTOTAL(9,' + totalCellColumn + firstDataRow + ':' + totalCellColumn + Math.max(firstDataRow, lastDataRow) + ')'
  };
  return ws;
}
const X = { utils: { sheet_to_json: (ws) => ws.matrix } };
const mtcWorkbook = {
  Sheets: {
    'Report MTC': sheet({E18:3,E9:55,J19:1,J10:1.25,N18:1,N9:0.75}),
    'Lost Time Printing': detailSheet('Category','Hour',[
      ['WO-1','MTC',2],['WO-2',' IPM ',100],['WO-1','MTC',3],['TRIAL','MTC',50],['WO-3','MTC REPAIR',9]
    ],13,'I',[['OLD-WO',' IPM ',99]]),
    'Lost Time AP': detailSheet('Category','Hour',[
      ['AP-WO-1','MTC',1.25],['AP-WO-2','IPM',80],['AP-WO-3','MTC Repair',7]
    ],39,'J',[['OLD-AP','IPM',70]]),
    'Lost Time FG': detailSheet('Category','Hour',[
      ['FG-WO-1','MTC',0.75],['FG-WO-2','IPM',5],['FG-WO-3','ELECTRICAL FAILURE',12]
    ],5,'J')
  }
};
const audit = context.extractMtcAudit(X, mtcWorkbook);
assert.ok(audit, 'MTC audit should be produced when detail and pivot sheets exist');
assert.equal(audit.mismatch, false, 'Matching exact-MTC detail and pivot values should pass');
assert.deepEqual(Array.from(audit.rows, r => [r.detailStartRow,r.detailRecords,r.detailHourRecords,r.detailEvents,r.trialRecords,r.detailHours,r.nonTrialHours,r.pivotRecords,r.pivotHours,r.deltaHours]), [
  [13,3,3,1,1,55,5,3,55,0], [39,1,1,1,0,1.25,1.25,1,1.25,0], [5,1,1,1,0,0.75,0.75,1,0.75,0]
]);
assert.equal(audit.rows[0].detailEndRow, 17, 'MTC audit must preserve the SUBTOTAL end row');
assert.equal(audit.rows[0].detailRangeFromFormula, true, 'MTC audit should prefer explicit SUBTOTAL bounds');
assert.deepEqual(Array.from(audit.rows, r => [r.subtotalCell,r.subtotalCachedHours]), [
  ['I3',164], ['J3',88.25], ['J3',17.75]
], 'Audit must expose the saved all-category SUBTOTAL separately from exact-MTC detail sums');
assert.deepEqual(Array.from(audit.rows, r => r.subtotalFormula), [
  'SUBTOTAL(9,I13:I17)', 'SUBTOTAL(9,J39:J41)', 'SUBTOTAL(9,J5:J7)'
], 'Audit must preserve the saved SUBTOTAL formula per source worksheet');
assert.ok(source.includes('Formula SUBTOTAL'),
  'Audit UI must display the actual saved formula alongside its cell and cached value');
assert.ok(source.includes('Nilai SUBTOTAL tersimpan (semua kategori)'),
  'Audit UI must label the saved SUBTOTAL as all-category worksheet context');
assert.ok(source.includes('Jam MTC detail pada rentang formula'),
  'Audit UI must separately label the recalculated exact-MTC detail sum');
assert.ok(source.includes('var hoursMismatch=!Number.isFinite(pivotHours)||Math.abs(detailHours-pivotHours)>0.05;'),
  'Pivot Sum of Hour must be reconciled against all exact-MTC detail hours, including TRIAL, because the pivot filter is Category=MTC');
assert.ok(source.includes('Pivot memfilter Category=MTC, sehingga Count of Hour dibandingkan'),
  'MTC audit must state the actual source filter scope used by the saved pivot');
assert.equal(audit.mismatch, false,
  'A worksheet-wide cached SUBTOTAL must not be compared directly with MTC-only Pivot totals');
assert.equal(audit.incidentCountReliable, true, 'Complete full-sheet PRO data should independently validate event count');
assert.equal(audit.incidentCount, 3, 'Event count is based on distinct non-TRIAL PRO IDs across every detail sheet');

// The Report MTC pivot is labelled "Count of Hour", so it counts rows with a
// numeric Hour value rather than distinct PRO identities. Printing deliberately
// repeats the same PRO across two MTC rows and has one TRIAL MTC row: Hour count=3,
// unique non-TRIAL PRO count=1. A stale pivot of 1 must not falsely reconcile.
const uniqueProMisreadWorkbook = {
  Sheets: {
    ...mtcWorkbook.Sheets,
    'Report MTC': sheet({E18:1,E9:55,J19:1,J10:1.25,N18:1,N9:0.75})
  }
};
const uniqueProMisreadAudit = context.extractMtcAudit(X, uniqueProMisreadWorkbook);
assert.equal(uniqueProMisreadAudit.rows[0].detailEvents, 1,
  'Repeated PRO rows collapse to one unique event ID');
assert.equal(uniqueProMisreadAudit.rows[0].detailHourRecords, 3,
  'Count of Hour semantics retain all three MTC rows with numeric Hour values');
assert.equal(uniqueProMisreadAudit.rows[0].pivotRecordMismatch, true,
  'A pivot count that matches unique PROs but not Hour rows must be flagged');
assert.equal(uniqueProMisreadAudit.mismatch, true,
  'The audit cannot pass by comparing unlike Count of Hour and unique-PRO metrics');
assert.equal(uniqueProMisreadAudit.incidentCount, 3,
  'Unique PRO incident total remains separately available during count reconciliation');

// A saved worksheet filter can hide MTC rows while the cached SUBTOTAL/Pivot is stale.
// Keep the full-source event identity count independent, but block duration KPIs.
const hiddenPrintingRows = Array.from({length:17}, () => ({ hidden:false }));
hiddenPrintingRows[12] = { hidden:true }; // worksheet row 13
const hiddenMtcWorkbook = {
  Sheets: {
    ...mtcWorkbook.Sheets,
    'Lost Time Printing': {
      ...mtcWorkbook.Sheets['Lost Time Printing'],
      '!rows': hiddenPrintingRows
    }
  }
};
const hiddenMtcAudit = context.extractMtcAudit(X, hiddenMtcWorkbook);
assert.equal(hiddenMtcAudit.rows[0].visibleMtcRows, 2,
  'Visible exact-MTC source rows must be counted separately from hidden rows');
assert.equal(hiddenMtcAudit.rows[0].hiddenMtcRows, 1,
  'Hidden exact-MTC source rows must be surfaced in the audit');
assert.equal(hiddenMtcAudit.rows[0].visibilityIssue, true,
  'Any hidden MTC row in the saved worksheet state must require filter review');
assert.equal(hiddenMtcAudit.mismatch, true,
  'Hidden MTC rows must hold Lost Time/MTBF/MTTR pending source reconciliation');
assert.equal(hiddenMtcAudit.incidentCountReliable, true,
  'Full-sheet PRO identity counting remains independent of hidden row visibility');

// A row with exact MTC category outside the SUBTOTAL bounds still counts as a source event,
// but the unaligned loss-hour summary is marked for reconciliation.
const outsideRangeMtcWorkbook = {
  Sheets: {
    ...mtcWorkbook.Sheets,
    'Lost Time Printing': {
      ...mtcWorkbook.Sheets['Lost Time Printing'],
      matrix: [...mtcWorkbook.Sheets['Lost Time Printing'].matrix, ['AFTER-SUBTOTAL','MTC',999]]
    }
  }
};
const outsideRangeMtcAudit = context.extractMtcAudit(X, outsideRangeMtcWorkbook);
assert.equal(outsideRangeMtcAudit.incidentCount, 4, 'MTC PRO IDs outside formula bounds remain in the complete source-event count');
assert.equal(outsideRangeMtcAudit.incidentCountReliable, true, 'Complete PRO identity remains reliable when only the duration subtotal range is stale');
assert.equal(outsideRangeMtcAudit.rows[0].subtotalMtcOutside, true, 'MTC outside the SUBTOTAL range must be flagged');
assert.equal(outsideRangeMtcAudit.mismatch, true, 'MTC outside SUBTOTAL bounds must hold duration KPIs for reconciliation');

// The distinct-incident metric must be unavailable if any exact-MTC source row
// lacks a PRO identity; blank IDs must not be silently counted or discarded.
const missingProWorkbook = {
  Sheets: {
    ...mtcWorkbook.Sheets,
    'Lost Time FG': {
      ...mtcWorkbook.Sheets['Lost Time FG'],
      matrix: mtcWorkbook.Sheets['Lost Time FG'].matrix.map((row,i) =>
        i === 4 ? ['', 'MTC', 0.75] : row
      )
    }
  }
};
const missingProAudit = context.extractMtcAudit(X, missingProWorkbook);
assert.equal(missingProAudit.incidentCountReliable, false,
  'A missing PRO on an exact-MTC row must block official incident count');

// A valid-looking MTC line after the source SUBTOTAL's end row must not leak into the audit.
const beyondSubtotalWorkbook = {
  Sheets: {
    ...mtcWorkbook.Sheets,
    'Lost Time Printing': {
      ...mtcWorkbook.Sheets['Lost Time Printing'],
      matrix: [...mtcWorkbook.Sheets['Lost Time Printing'].matrix, ['AFTER-SUBTOTAL','MTC',999]]
    }
  }
};
const boundedAudit = context.extractMtcAudit(X, beyondSubtotalWorkbook);
assert.equal(boundedAudit.rows[0].detailRecords, audit.rows[0].detailRecords,
  'Rows after SUBTOTAL end must be excluded from MTC record count');
near(boundedAudit.rows[0].detailHours, audit.rows[0].detailHours,
  'Rows after SUBTOTAL end must be excluded from MTC Lost Time');

const truncatedFilterWorkbook = {
  Sheets: {
    ...mtcWorkbook.Sheets,
    'Lost Time Printing': {
      ...mtcWorkbook.Sheets['Lost Time Printing'],
      '!ref':'A1:J2944',
      '!autofilter':{ref:'A4:J1313'}
    }
  }
};
const truncatedFilterAudit = context.extractMtcAudit(X, truncatedFilterWorkbook);
assert.equal(truncatedFilterAudit.rows[0].rangeCoverageIssue, true,
  'An AutoFilter range that ends before the used data range must be identified');
assert.equal(truncatedFilterAudit.rows[0].mismatch, true,
  'A source table range that does not cover all data must block a clean reconciliation');
assert.ok(truncatedFilterAudit.note.includes('AutoFilter'),
  'Audit note must explain incomplete AutoFilter coverage');

// Even if AutoFilter spans the used rows, a SUBTOTAL formula that stops early
// must flag the later worksheet rows as outside the formula's coverage.
const staleSubtotalRangeWorkbook = {
  Sheets: {
    ...mtcWorkbook.Sheets,
    'Lost Time Printing': {
      ...mtcWorkbook.Sheets['Lost Time Printing'],
      '!ref':'A1:J2944',
      '!autofilter':{ref:'A4:J2944'}
    }
  }
};
const staleSubtotalRangeAudit = context.extractMtcAudit(X, staleSubtotalRangeWorkbook);
assert.equal(staleSubtotalRangeAudit.rows[0].autoFilterCoverageIssue, false,
  'A full-width AutoFilter should not be flagged as truncated');
assert.equal(staleSubtotalRangeAudit.rows[0].subtotalCoverageIssue, true,
  'A SUBTOTAL formula ending before used data must be flagged');
assert.equal(staleSubtotalRangeAudit.rows[0].rangeCoverageIssue, true,
  'A short SUBTOTAL range must still block clean reconciliation');
assert.ok(staleSubtotalRangeAudit.note.includes('SUBTOTAL'),
  'Audit note must explain incomplete SUBTOTAL coverage');

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

// Missing source mappings must display as unavailable, not as zero downtime/events.
const calcStart = source.indexOf('function calc(){');
const helperStart = source.indexOf('function val(row,key){');
const calcEnd = source.indexOf('function metric(', calcStart);
assert.ok(helperStart >= 0 && calcStart > helperStart && calcEnd > calcStart,
  'Calculation helpers must remain directly testable');
const calcContext = { state: { rows: [], headers: [], mapping: {} } };
vm.runInNewContext(
  source.slice(helperStart, calcEnd) + '\nthis.calc = calc;',
  calcContext
);
calcContext.state.rows = [
  { Category:'MTC', LT:1.5, DT:2, BD:1, MTBF:20, MTTR:1.5 },
  { Category:'IPM', LT:8, DT:3, BD:0, MTBF:0, MTTR:0 }
];
const unmapped = calcContext.calc();
assert.ok(Number.isNaN(unmapped.mtcHours), 'MTC lost time must be unavailable before category/duration mappings');
assert.ok(Number.isNaN(unmapped.totalHours), 'Total downtime must be unavailable before downtime mapping');
assert.ok(Number.isNaN(unmapped.ratio), 'MTC share must be unavailable before both sources are mapped');
assert.ok(Number.isNaN(unmapped.incidents), 'MTC incident count must not default to zero before category mapping');

calcContext.state.mapping = { category:'Category', lt:'LT', downtime:'DT', bd:'BD', mtbf:'MTBF', mttr:'MTTR' };
const mapped = calcContext.calc();
near(mapped.mtcHours, 1.5, 'Mapped exact-MTC lost time');
near(mapped.totalHours, 5, 'Mapped total downtime');
near(mapped.ratio, 0.3, 'Mapped MTC share');
assert.equal(mapped.incidents, 1, 'Mapped BD source takes precedence for incident count');

// A mapped PRO/incident field should count distinct non-TRIAL IDs, never detail rows.
calcContext.state.rows = [
  { Category:'MTC', LT:1.5, DT:2, Incident:'WO-1' },
  { Category:'MTC', LT:0.5, DT:1, Incident:'WO-1' },
  { Category:'MTC', LT:0.25, DT:0.5, Incident:'TRIAL' },
  { Category:'IPM', LT:8, DT:3, Incident:'WO-2' }
];
calcContext.state.mapping = { category:'Category', lt:'LT', downtime:'DT', incident:'Incident' };
const uniqueIncidentCount = calcContext.calc();
assert.equal(uniqueIncidentCount.incidents, 1, 'Duplicate PRO values count as one incident and TRIAL is excluded');

calcContext.state.mapping = { category:'Category', lt:'LT', downtime:'DT' };
const noIncidentSource = calcContext.calc();
assert.ok(Number.isNaN(noIncidentSource.incidents),
  'Incident count must be unavailable when neither OEE BD count nor an incident ID source is mapped');

// A source detail-vs-pivot mismatch should hold back MTC-only KPI values even if
// the currently selected detail sheet can be mapped and produces numeric values.
calcContext.state.mtcAudit = mismatch;
const blockedByMismatch = calcContext.calc();
assert.ok(Number.isNaN(blockedByMismatch.mtcHours), 'MTC lost time must be withheld during source reconciliation');
assert.equal(blockedByMismatch.incidents, 3, 'Complete unique PRO event count remains available when only Pivot/duration reconciliation is blocked');
assert.ok(Number.isNaN(blockedByMismatch.ratio), 'MTC share must be withheld during source reconciliation');
assert.ok(Number.isNaN(blockedByMismatch.mtbf), 'MTBF must be withheld during source reconciliation');
assert.ok(Number.isNaN(blockedByMismatch.mttr), 'MTTR must be withheld during source reconciliation');
calcContext.state.mtcAudit = null;

calcContext.state.rows = [
  { Category:'MTC', LT:'', DT:2 },
  { Category:'IPM', LT:8, DT:3 }
];
const incompleteMtcDuration = calcContext.calc();
assert.ok(Number.isNaN(incompleteMtcDuration.mtcHours),
  'Mapped but blank MTC Lost Time must not silently fall back to general downtime');

calcContext.state.rows = [{ Category:'IPM', LT:8, DT:3 }];
const mappedNoMtcRows = calcContext.calc();
near(mappedNoMtcRows.mtcHours, 0, 'Mapped source with no exact-MTC rows should legitimately show zero');
near(mappedNoMtcRows.totalHours, 3, 'Mapped total downtime without MTC rows');
near(mappedNoMtcRows.ratio, 0, 'Mapped MTC share without MTC rows');

console.log('Technical Performance source-truth tests passed: OEE/TEEP formulas, exact-MTC reconciliation, and missing-mapping safety.');
