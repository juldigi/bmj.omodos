'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const worker=fs.readFileSync('src/worker.js','utf8');
const entry=fs.readFileSync('src/entry.js','utf8');
const ui=fs.readFileSync('public/omodos4/report-change-audit.js','utf8');

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
assert.match(ui,/data-change-audit-confirm/,'UI has an explicit confirm step');
assert.match(ui,/updateEntry/);
assert.match(ui,/deleteEntry/);
assert.match(ui,/savePredictiveReport/);
assert.match(ui,/deletePredictiveReport/);
assert.match(ui,/modifierName:person/);
assert.match(ui,/NAME_SELECTION_CANCELLED/);
assert.match(entry,/report-change-audit\.js/,'production Worker injects the name picker script');

console.log('Report change audit: PASS (Master Personil validation, Logbook/Patrol editor and deleter identity, Patrol soft delete, Superadmin audit permissions, UI selection guard).');
