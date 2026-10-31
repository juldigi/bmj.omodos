'use strict';

const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');

const html = readFileSync('public/index.html', 'utf8');
const hotfix = readFileSync('public/omodos4/hotfix.js', 'utf8');
const worker = readFileSync('src/worker.js', 'utf8');

// UI wiring and persistence fields: the choice must exist in the add form and edit schema.
// This guard also ensures the field stays next to the start/end time inputs in the add form.
assert.ok(
  html.indexOf('id="input-jamMulai"') < html.indexOf('id="input-menyebabkanDowntime"') &&
  html.indexOf('id="input-menyebabkanDowntime"') < html.indexOf('id="input-durasiPekerjaanMenit"'),
  'Add Logbook must render the downtime choice between start/end time and work duration fields'
);
assert.match(html, /name="menyebabkanDowntime" id="input-menyebabkanDowntime" required/);
assert.match(html, /name="durasiPekerjaanMenit" id="input-durasiPekerjaanMenit"/);
assert.match(html, /entry\.downtime = entry\.menyebabkanDowntime === 'Ya'/);
assert.match(html, /key:'Menyebabkan Downtime', label:'Menyebabkan Downtime\?', type:'select', options:\['Ya','Tidak'\]/);
assert.match(html, /'Durasi Pekerjaan \(menit\)':'durasiPekerjaanMenit'/);
assert.match(worker, /"Menyebabkan Downtime"/);
assert.match(worker, /"Durasi Pekerjaan \(menit\)"/);
assert.match(worker, /"Downtime \(menit\)"/);
assert.match(worker, /rowMap\["Downtime \(menit\)"\] = downtimeFields\.hasChoice \? downtimeFields\.downtimeMinutes/);
assert.match(worker, /"Downtime \(menit\)": downtimeFields\.hasChoice \? downtimeFields\.downtimeMinutes/);

// Exercise the same backend pure functions embedded in the worker.
const helperStart = worker.indexOf('function normalizeLogbookDowntimeChoice_');
const helperEnd = worker.indexOf('function addEntry_(body)', helperStart);
assert.ok(helperStart >= 0 && helperEnd > helperStart, 'downtime helper block must exist');
const helpers = new Function(
  worker.slice(helperStart, helperEnd) +
  '\nreturn { normalizeLogbookDowntimeChoice_, calculateLogbookDurationMinutes_, resolveLogbookDowntime_ };'
)();

assert.equal(helpers.normalizeLogbookDowntimeChoice_('Ya'), 'Ya');
assert.equal(helpers.normalizeLogbookDowntimeChoice_('Tidak'), 'Tidak');
assert.equal(helpers.calculateLogbookDurationMinutes_('08:00', '10:15'), 135);
assert.equal(helpers.calculateLogbookDurationMinutes_('23:30', '00:15'), 45);

const withDowntime = helpers.resolveLogbookDowntime_({
  menyebabkanDowntime: 'Ya', jamMulai: '08:00', jamSelesai: '10:00'
}, null);
assert.equal(withDowntime.durationMinutes, 120);
assert.equal(withDowntime.downtimeMinutes, 120);

const withoutDowntime = helpers.resolveLogbookDowntime_({
  menyebabkanDowntime: 'Tidak', jamMulai: '08:00', jamSelesai: '10:00'
}, null);
assert.equal(withoutDowntime.durationMinutes, 120);
assert.equal(withoutDowntime.downtimeMinutes, 0);

assert.equal(
  helpers.resolveLogbookDowntime_({ jamMulai: '08:00', jamSelesai: '10:00' }, null).hasChoice,
  false,
  'older callers without the new field retain legacy behavior'
);
assert.throws(
  () => helpers.resolveLogbookDowntime_({ menyebabkanDowntime: 'Ya', jamMulai: '', jamSelesai: '' }, null),
  err => err && err.code === 'VALIDATION_ERROR'
);
assert.throws(
  () => helpers.resolveLogbookDowntime_({ menyebabkanDowntime: 'Mungkin', jamMulai: '08:00', jamSelesai: '09:00' }, null),
  err => err && err.code === 'VALIDATION_ERROR'
);

// Exercise client-side duration/downtime readers separately.
const parserStart = html.indexOf('function parseNumericMinutes_(raw){');
const parserEnd = html.indexOf('function fmtDurationMinutes(mins){', parserStart);
assert.ok(parserStart >= 0 && parserEnd > parserStart, 'work/downtime parser block must exist');
const parsers = new Function(
  html.slice(parserStart, parserEnd) +
  '\nreturn { parseDurationMinutes, parseWorkDurationMinutes };'
)();

assert.equal(
  parsers.parseDurationMinutes({ 'Menyebabkan Downtime': 'Tidak', 'Downtime (menit)': 120, 'Durasi Pekerjaan (menit)': 120 }),
  0,
  'explicit Tidak cannot be counted as machine downtime even if a stale value exists'
);
assert.equal(
  parsers.parseDurationMinutes({ 'Menyebabkan Downtime': 'Ya', 'Downtime (menit)': 45, 'Durasi Pekerjaan (menit)': 120 }),
  45
);
assert.equal(
  parsers.parseWorkDurationMinutes({ 'Menyebabkan Downtime': 'Tidak', 'Downtime (menit)': 0, 'Durasi Pekerjaan (menit)': 120 }),
  120,
  'Top Durasi must still show work duration when downtime is zero'
);
assert.equal(
  parsers.parseWorkDurationMinutes({ 'Downtime (menit)': 30 }),
  30,
  'older records remain readable as a fallback'
);

const breakdownStart = html.indexOf('function anIsBreakdown(e){');
const breakdownEnd = html.indexOf('function anEntryHour(e)', breakdownStart);
assert.ok(breakdownStart >= 0 && breakdownEnd > breakdownStart, 'breakdown classifier must exist');
const isBreakdown = new Function(
  'function isAreaEntry_(e){ return false; }\n' +
  html.slice(breakdownStart, breakdownEnd) +
  '\nreturn anIsBreakdown;'
)();
assert.equal(
  isBreakdown({ 'Jenis Pekerjaan': 'Corrective', 'Menyebabkan Downtime': 'Tidak', 'Downtime (menit)': 0 }),
  false,
  'jobs marked Tidak must not inflate breakdown / MTTR counts'
);
assert.equal(
  isBreakdown({ 'Jenis Pekerjaan': 'Corrective', 'Menyebabkan Downtime': 'Ya', 'Downtime (menit)': 45 }),
  true
);

const topStart = html.indexOf('function renderDurasiView(){');
const topEnd = html.indexOf('const btnRefreshDurasi', topStart);
assert.ok(topStart >= 0 && topEnd > topStart);
assert.match(html.slice(topStart, topEnd), /parseWorkDurationMinutes\(e\)/);
const jobTypeStart = html.indexOf('/* ---- 4) Jenis Pekerjaan vs rata-rata durasi ---- */');
const jobTypeEnd = html.indexOf('const jenisDurList', jobTypeStart);
assert.ok(jobTypeStart >= 0 && jobTypeEnd > jobTypeStart);
assert.match(html.slice(jobTypeStart, jobTypeEnd), /parseWorkDurationMinutes\(e\)/);
assert.match(html, /filter\(e=> \(parseWorkDurationMinutes\(e\)\|\|0\) > 0\)/);


// The production hotfix supplies the interactive add/edit downtime control.
// Keep explicit coverage for the injected UI and the payload contract as well.
assert.match(hotfix, /select-menyebabkanDowntime/);
assert.match(hotfix, /name="menyebabkanDowntime" required/);
assert.match(hotfix, /duration\.name='durasiPekerjaan'/);
assert.match(hotfix, /downtimeField\.value=choice\.value==='Tidak'\?'0':choice\.value==='Ya'&&minutes!==null\?String\(minutes\):''/);
assert.match(hotfix, /payload\.entry\.menyebabkanDowntime=select\.value/);
assert.match(hotfix, /payload\.entry\.downtime=select\.value==='Ya'\?duration:0/);
assert.match(hotfix, /payload\.entry\.durasiPekerjaan=duration/);
new Function(hotfix);

console.log('Logbook downtime UI, analytics and hotfix payload tests passed.');
