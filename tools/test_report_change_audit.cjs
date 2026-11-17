'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const worker=fs.readFileSync('src/worker.js','utf8');
const entry=fs.readFileSync('src/entry.js','utf8');
const ui=fs.readFileSync('public/omodos4/report-change-audit.js','utf8');
const archiveUi=fs.readFileSync('public/omodos4/deleted-reports.js','utf8');
const indexHtml=fs.readFileSync('public/index.html','utf8');

function block(startMarker,endMarker){
  const start=worker.indexOf(startMarker),end=worker.indexOf(endMarker,start);
  assert.ok(start>=0&&end>start,'source block exists: '+startMarker);
  return worker.slice(start,end);
}
const helperStart=worker.indexOf('function requiredChangePersonilName_(value)');
const helperEnd=worker.indexOf('  __name(requiredChangePersonilName_',helperStart);
assert.ok(helperStart>=0&&helperEnd>helperStart,'Master Personil validator exists');
const resolver=new Function('getPersonilList_',worker.slice(helperStart,helperEnd)+';return requiredChangePersonilName_;')(
  ()=>[{'Nama Personil':'Jamhuriyat'},{'Nama Personil':'Fatkhurosidi'},{'Nama Personil':'QA Person'}]
);
assert.equal(resolver(' qa   person '),'QA Person','name matching is normalized and returns canonical Master Personil name');
assert.equal(resolver('JAMHURIYAT'),'Jamhuriyat','Jamhuriyat is available as a canonical personnel value');
assert.throws(()=>resolver('  '),err=>err&&err.code==='VALIDATION_ERROR'&&/Nama personil/i.test(err.message),'blank modifier is rejected');
assert.throws(()=>resolver('Unknown Person'),err=>err&&err.code==='VALIDATION_ERROR'&&/Master Personil/i.test(err.message),'names outside Master Personil are rejected');

const update=block('  function updateEntry_(body) {','  __name(updateEntry_, "updateEntry_");');
assert.match(update,/requiredChangePersonilName_\(body\.modifierName\)/,'Logbook edit requires a Master Personil selection');
assert.match(update,/rowMap\["UpdatedBy"\] = modifierName/,'Logbook stores selected person name as UpdatedBy');
assert.match(update,/rowMap\["UpdatedByAccount"\] = modifierAccount/,'Logbook stores authenticated username separately');
assert.doesNotMatch(update,/rowMap\["UpdatedBy"\] = body\.actor/,'account username is not mislabeled as person name');

const remove=block('  function deleteEntry_(body) {','  __name(deleteEntry_, "deleteEntry_");');
assert.match(remove,/requiredChangePersonilName_\(body\.modifierName\)/,'Logbook delete requires a Master Personil selection');
assert.match(remove,/setValue\(modifierName\)/,'Logbook DeletedBy stores selected person');
assert.match(remove,/DeletedByAccount/,'Logbook records account username separately');
assert.match(remove,/softDeleted: true/,'Logbook keeps soft-delete behavior');
assert.doesNotMatch(remove,/getDataRange\(\)\.getValues\(\)/,'Logbook delete must not load every column/photo payload');
assert.match(remove,/getRange\(2, idCol \+ 1, lastRow - 1, 1\)\.getValues\(\)/,'Logbook delete searches only the ID column');
const patrolRemove=block('  function deletePredictiveReport_(body) {','  __name(deletePredictiveReport_, "deletePredictiveReport_");');
assert.doesNotMatch(patrolRemove,/getDataRange\(\)\.getValues\(\)/,'Patrol delete must not load every column/photo payload');
assert.match(patrolRemove,/getRange\(2, idCol \+ 1, lastRow - 1, 1\)\.getValues\(\)/,'Patrol delete searches only the ID column');

// Execute both real delete handlers against a sheet that rejects full-table reads.
function fakeDeleteSheet(headers, rows) {
  const values=[headers.slice(),...rows.map(r=>r.slice())];
  const reads=[];
  const writes=[];
  const sheet={
    getLastColumn:()=>headers.length,
    getLastRow:()=>values.length,
    getDataRange(){throw new Error('Full-table read is prohibited in a delete handler');},
    getRange(row,col,numRows=1,numCols=1){
      return {
        getValues(){
          reads.push({row,col,numRows,numCols});
          return values.slice(row-1,row-1+numRows).map(r=>r.slice(col-1,col-1+numCols));
        },
        getValue(){return this.getValues()[0][0];},
        setValue(value){values[row-1][col-1]=value;writes.push({row,col,value});return this;}
      };
    }
  };
  return {sheet,values,reads,writes};
}
const deleteHeaders=['ID','Tanggal','Lampiran (JSON)','DeletedAt','DeletedBy','DeletedByAccount','DeleteReason','TransactionID','UpdatedAt'];
const hugeAttachmentPayload='x'.repeat(250000);
const logFixture=fakeDeleteSheet(deleteHeaders,[
  ['LB-1','2026-11-16',hugeAttachmentPayload,'','','','','',''],
  ['LB-2','2026-11-17',hugeAttachmentPayload,'','','','','','']
]);
const logDeleteFn=new Function(
  'requiredChangePersonilName_','getSS_','SHEET_LOGBOOK','ensureHeaderColumns_','nowIso_',
  'invalidateCacheForSheet_','jsonOut_','handleError_',
  remove+';return deleteEntry_;'
)(
  value=>value==='Jamhuriyat'?value:(()=>{throw Error('Unexpected modifier');})(),
  ()=>({getSheetByName:()=>logFixture.sheet}),
  'Logbook',()=>{},()=>'2026-11-17T08:00:00.000Z',()=>{},value=>value,
  error=>({ok:false,error:String(error&&error.message||error)})
);
const logDeleteResult=logDeleteFn({id:'LB-2',modifierName:'Jamhuriyat',actor:'superadmin',transactionId:'delete-logbook-1'});
assert.equal(logDeleteResult.ok,true,'Logbook delete succeeds with ID-only lookup');
assert.equal(logFixture.values[2][3],'2026-11-17T08:00:00.000Z','Logbook soft-delete timestamp is written');
assert.equal(logFixture.values[2][4],'Jamhuriyat','Logbook deletion records selected person');
assert.equal(logFixture.values[2][5],'superadmin','Logbook deletion records account identity');
assert.equal(logFixture.values[2][7],'delete-logbook-1','Logbook transaction ID is preserved');
assert.ok(logFixture.reads.some(r=>r.row===2&&r.col===1&&r.numRows===2&&r.numCols===1),'Logbook reads only the ID column to locate the target row');
assert.ok(!logFixture.reads.some(r=>r.row>1&&r.numCols>1),'Logbook does not read any full data row');

const patrolFixture=fakeDeleteSheet(deleteHeaders,[
  ['PM-1','2026-11-16',hugeAttachmentPayload,'','','','','',''],
  ['PM-2','2026-11-17',hugeAttachmentPayload,'','','','','','']
]);
const patrolDeleteFn=new Function(
  'requiredChangePersonilName_','getOrCreateSheet_','PREDICTIVE_SHEET_NAME','PREDICTIVE_HEADERS',
  'ensureHeaderColumns_','nowIso_','invalidateCacheForSheet_','jsonOut_',
  patrolRemove+';return deletePredictiveReport_;'
)(
  value=>value==='Jamhuriyat'?value:(()=>{throw Error('Unexpected modifier');})(),
  ()=>patrolFixture.sheet,'Predictive_Maintenance',[],()=>{},()=>'2026-11-17T08:05:00.000Z',
  ()=>{},value=>value
);
const patrolDeleteResult=patrolDeleteFn({id:'PM-2',modifierName:'Jamhuriyat',actor:'superadmin'});
assert.equal(patrolDeleteResult.ok,true,'Patrol delete succeeds with ID-only lookup');
assert.equal(patrolFixture.values[2][3],'2026-11-17T08:05:00.000Z','Patrol soft-delete timestamp is written');
assert.equal(patrolFixture.values[2][4],'Jamhuriyat','Patrol deletion records selected person');
assert.equal(patrolFixture.values[2][5],'superadmin','Patrol deletion records account identity');
assert.ok(patrolFixture.reads.some(r=>r.row===2&&r.col===1&&r.numRows===2&&r.numCols===1),'Patrol reads only the ID column to locate the target row');
assert.ok(!patrolFixture.reads.some(r=>r.row>1&&r.numCols>1),'Patrol does not read any full data row');


const getter=block('  function getPredictiveReports_() {','  __name(getPredictiveReports_, "getPredictiveReports_");');
assert.match(getter,/DeletedAt/,'deleted Patrol reports are hidden from standard Patrol list');
const patrolSave=block('  function savePredictiveReport_(report, files, modifierNameInput, accountInput) {','  __name(savePredictiveReport_, "savePredictiveReport_");');
assert.match(patrolSave,/if \(targetRow > 0\)[\s\S]*requiredChangePersonilName_\(modifierNameInput\)/,'Patrol edit requires selected person');
assert.match(patrolSave,/"UpdatedBy": modifierName/,'Patrol edit stores selected person');
assert.match(patrolSave,/"UpdatedByAccount": modifierAccount/,'Patrol edit stores authenticated account separately');
assert.match(patrolSave,/Laporan Patrol sudah dihapus dan tidak dapat diedit/,'soft-deleted Patrol cannot be edited');
const patrolDelete=block('  function deletePredictiveReport_(body) {','  __name(deletePredictiveReport_, "deletePredictiveReport_");');
assert.match(patrolDelete,/requiredChangePersonilName_\(body\.modifierName\)/,'Patrol delete requires selected person');
assert.match(patrolDelete,/setValue\(modifierName\)/,'Patrol DeletedBy stores selected person');
assert.match(patrolDelete,/DeletedByAccount/,'Patrol stores authenticated account separately');
assert.doesNotMatch(patrolDelete,/sh\.deleteRow/,'Patrol delete preserves original report row');
assert.match(patrolDelete,/softDeleted: true/,'Patrol deletion is a soft delete');

assert.match(worker,/"updateEntry": \{ permission: "logbook\.update", audit: true/,'Logbook edit remains covered by Audit_Log');
assert.match(worker,/"deleteEntry": \{ permission: "logbook\.delete", audit: true/,'Logbook delete remains covered by Audit_Log');
assert.match(worker,/\["savePredictiveReport", "deletePredictiveReport"\]\.forEach\(function\(a\)\s*\{\s*add\(a, "patrol\.manage", "POST", true\)/,'Patrol save/delete remain audited');
assert.match(worker,/body\.actor = session\.username/,'account identity comes from authenticated server session');
assert.match(worker,/function handleGetAuditLog_\(params, session\)[\s\S]*requirePermission_\(session\.role, "rbac\.manage"\)/,'Audit_Log reading remains restricted to Superadmin permissions');

assert.match(ui,/dataset\.changeAuditSelect/,'UI requires a name selection');
assert.match(ui,/dataset\.changeAuditConfirm/,'UI has an explicit confirm step');
assert.match(ui,/updateEntry/);
assert.match(ui,/deleteEntry/);
assert.match(ui,/savePredictiveReport/);
assert.match(ui,/deletePredictiveReport/);
assert.match(ui,/modifierName:person/);
assert.match(ui,/NAME_SELECTION_CANCELLED/);
assert.match(entry,/report-change-audit\.js/,'production Worker injects the name picker script');

console.log('Report change audit: PASS (Master Personil validation, Logbook/Patrol editor and deleter identity, Patrol soft delete, Superadmin audit permissions, UI selection guard).');

assert.ok(worker.includes('"deletedReports": { permission: "rbac.manage"'));
assert.ok(worker.includes('"restoreDeletedReport": { permission: "rbac.manage"'));
assert.ok(worker.includes('"permanentlyDeleteReport": { permission: "rbac.manage"'));
assert.ok(worker.includes('function getDeletedReports_(params)'));
assert.ok(worker.includes('function restoreDeletedReport_(body)'));
assert.ok(worker.includes('function permanentlyDeleteReport_(body)'));
assert.ok(ui.includes("window.apiGet('personil'"));
assert.ok(ui.includes('edit-modifier-name'));
assert.ok(archiveUi.includes('data-archive-action="permanent"'));
assert.ok(entry.includes('deleted-reports.js?v=20261117-1'));
assert.ok(indexHtml.includes('src="/omodos4/report-change-audit.js?v=20261117-2"'), 'production HTML loads Modifier Name script');
assert.ok(indexHtml.includes('src="/omodos4/deleted-reports.js?v=20261117-1"'), 'production HTML loads Superadmin archive script');

assert.ok(ui.includes('__OMODOS_REPORT_CHANGE_AUDIT_V1__'));
assert.ok(ui.includes('__omodosReportChangeAudit=true'));
