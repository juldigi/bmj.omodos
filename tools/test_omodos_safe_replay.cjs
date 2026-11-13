'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const worker = fs.readFileSync('src/worker.js','utf8');
const html = fs.readFileSync('public/index.html','utf8');
const ui = fs.readFileSync('public/omodos4/patrol-review-enhancements.js','utf8');
const photos = fs.readFileSync('public/omodos4/patrol-area-feedback.js','utf8');
new vm.Script(worker,{filename:'worker.js'});
new vm.Script(ui,{filename:'patrol-review-enhancements.js'});
new vm.Script(photos,{filename:'patrol-area-feedback.js'});
for (const token of [
 'Mechanical & Electrical','Meeting','5R','patrol-location-kind',
 'OMODOS_WORK_AREAS','patrol-area-category','patrol-area-name',
 'checklistNotes','Keterangan Abnormal','Keterangan Warning',
 'Perhatian sebelum mengirim foto','Konfirmasi Penutupan Temuan',
 'closedBy','closedAt'
]) assert.ok(ui.includes(token),'missing UI contract: '+token);
for (const token of [
 '"Lokasi Jenis": report.lokasiJenis || "Mesin"',
 '"Kategori Area": report.kategoriArea || ""',
 '"Nama Area": report.namaArea || ""',
 '"Checklist Notes (JSON)": JSON.stringify(report.checklistNotes || {})',
 'String(r["Lokasi Jenis"] || "").toLowerCase() === "area"',
 'OMODOS_PATROL_REVIEW_V1',
 'patrol-area-feedback.js?v=20261113-1',
 'patrol-review-enhancements.js?v=20261113-1'
]) assert.ok(worker.includes(token),'missing Worker contract: '+token);
const saveStart=worker.indexOf('function savePredictiveReport_(report, files)');
const saveEnd=worker.indexOf('__name(savePredictiveReport_',saveStart);
assert.ok(saveStart>=0&&saveEnd>saveStart,'Patrol save function exists');
const save=worker.slice(saveStart,saveEnd);
assert.equal((save.match(/"Lokasi Jenis": report\.lokasiJenis/g)||[]).length,1,'no duplicate area mapping');
assert.ok(save.includes('Checklist Notes (JSON)'),'Patrol note field is persisted');
assert.ok(html.includes('name="groupingPekerjaan"'),'Logbook grouping selector remains present');
assert.ok(html.includes('id="patrol-checklist-groups"'),'Patrol tasklist remains present');
assert.ok(html.includes('id="list-patrol-temuan"'),'Patrol finding list remains present');
assert.ok(html.includes('<form id="form-login" autocomplete="off" onsubmit="return false;">'),'login native-submit guard is present');
const pdfStart=html.indexOf('function openGrReportDetail(id){');
const pdfEnd=html.indexOf('\nfunction ',pdfStart+20);
const pdf=html.slice(pdfStart,pdfEnd<0?html.length:pdfEnd);
assert.ok(pdf.includes('const pdfUrlRaw'),'PDF URL is normalized before use');
assert.ok(pdf.includes('parsedPdfUrl.protocol === \'https:\''),'only HTTPS PDF URLs are accepted');
assert.ok(pdf.includes('safePdfUrl'),'iframe and link use validated URL');
assert.ok(!pdf.includes('src="${r.pdfUrl}"'),'raw PDF URL is not injected into iframe');
console.log('OMODOS safe replay contracts: PASS');
