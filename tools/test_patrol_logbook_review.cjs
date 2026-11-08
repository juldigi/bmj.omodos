'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const worker = fs.readFileSync('src/worker.js','utf8');
const ui = fs.readFileSync('public/omodos4/patrol-review-enhancements.js','utf8');
const patrolPhotos = fs.readFileSync('public/omodos4/patrol-area-feedback.js','utf8');
const html = fs.readFileSync('public/index.html','utf8');

new vm.Script(ui, {filename:'patrol-review-enhancements.js'});
new vm.Script(patrolPhotos, {filename:'patrol-area-feedback.js'});

for (const token of [
  'Mechanical & Electrical','Meeting','5R',
  'patrol-location-kind','OMODOS_WORK_AREAS',
  'patrol-area-category','patrol-area-name',
  'checklistNotes','Keterangan Abnormal','Keterangan Warning',
  'Perhatian sebelum mengirim foto',
  'Konfirmasi Penutupan Temuan','closedBy','closedAt',
  'Checklist Notes (JSON)','Lokasi Jenis'
]) assert.ok(ui.includes(token), 'missing frontend contract: '+token);

for (const token of [
  '"Lokasi Jenis": report.lokasiJenis || "Mesin"',
  '"Kategori Area": report.kategoriArea || ""',
  '"Nama Area": report.namaArea || ""',
  '"Checklist Notes (JSON)": JSON.stringify(report.checklistNotes || {})',
  'String(r["Lokasi Jenis"] || "").toLowerCase() === "area"',
  'OMODOS_PATROL_REVIEW_V1',
  'patrol-area-feedback.js?v=20261108-1',
  'patrol-review-enhancements.js?v=20261108-1'
]) assert.ok(worker.includes(token), 'missing Worker contract: '+token);

assert.ok(html.includes('name="groupingPekerjaan"'),'Logbook grouping source form remains present');
assert.ok(html.includes('id="patrol-checklist-groups"'),'Patrol checklist source remains present');
assert.ok(html.includes('id="list-patrol-temuan"'),'Patrol finding list source remains present');

const start = worker.indexOf('function savePredictiveReport_(report, files)');
const end = worker.indexOf('__name(savePredictiveReport_', start);
assert.ok(start >= 0 && end > start, 'savePredictiveReport_ block exists');
const save = worker.slice(start,end);
assert.match(save,/ensureHeaderColumns_\(sh, \["Patrol Mode", "Checklist \(JSON\)", "Counts \(JSON\)", "Score", "Findings \(JSON\)", "Lokasi Jenis", "Kategori Area", "Nama Area", "Checklist Notes \(JSON\)"\]\)/);
assert.match(save,/"Findings \(JSON\)": JSON\.stringify/);

console.log('OMODOS Patrol/Logbook review contracts: PASS');
