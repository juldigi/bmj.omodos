'use strict';

const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');

const html = readFileSync('public/index.html', 'utf8');
const worker = readFileSync('src/worker.js', 'utf8');

assert.match(html, /name="menyebabkanDowntime" id="input-menyebabkanDowntime" required/);
assert.match(html, /name="durasiPekerjaanMenit" id="input-durasiPekerjaanMenit"/);
assert.match(html, /entry\.downtime = entry\.menyebabkanDowntime === 'Ya'/);
assert.match(html, /function parseWorkDurationMinutes\(e\)/);
assert.match(html, /const mins = parseWorkDurationMinutes\(e\);/);
assert.match(html, /return parseDurationMinutes\(e\) > 0 && !jp\.includes\('preventive'\);/);
assert.match(worker, /"Menyebabkan Downtime", "Durasi Pekerjaan \(menit\)"/);
assert.match(worker, /rowMap\["Downtime \(menit\)"\] = data\.downtime !== void 0 \? data\.downtime/);
assert.match(worker, /rowMap\["Menyebabkan Downtime"\] = data\.menyebabkanDowntime \|\| ""/);
assert.match(worker, /rowMap\["Menyebabkan Downtime"\] = data\.menyebabkanDowntime !== void 0 \? data\.menyebabkanDowntime/);

const helperStart = worker.indexOf('function logbookTimeMinutes_');
const helperEnd = worker.indexOf('function normalizeLogbookWorkLocation_', helperStart);
assert.ok(helperStart >= 0 && helperEnd > helperStart, 'downtime helper block must exist');
const helpers = new Function(
  worker.slice(helperStart, helperEnd) +
  '\nreturn { logbookTimeMinutes_, logbookDurationMinutes_, normalizeLogbookDowntime_ };'
)();

assert.equal(helpers.logbookTimeMinutes_('08:00'), 480);
assert.equal(helpers.logbookDurationMinutes_('08:00', '10:15'), 135);
assert.equal(helpers.logbookDurationMinutes_('23:30', '00:15'), 45);

const withDowntime = helpers.normalizeLogbookDowntime_({
  menyebabkanDowntime: 'Ya', jamMulai: '08:00', jamSelesai: '10:00'
}, {});
assert.equal(withDowntime.durasiPekerjaan, 120);
assert.equal(withDowntime.downtime, 120);

const withoutDowntime = helpers.normalizeLogbookDowntime_({
  menyebabkanDowntime: 'Tidak', jamMulai: '08:00', jamSelesai: '10:00', downtime: 120
}, {});
assert.equal(withoutDowntime.durasiPekerjaan, 120);
assert.equal(withoutDowntime.downtime, 0);

const overnight = helpers.normalizeLogbookDowntime_({
  menyebabkanDowntime: 'Ya', jamMulai: '23:30', jamSelesai: '00:15'
}, {});
assert.equal(overnight.durasiPekerjaan, 45);
assert.equal(overnight.downtime, 45);

assert.throws(
  () => helpers.normalizeLogbookDowntime_({ menyebabkanDowntime: 'Ya', jamMulai: '', jamSelesai: '' }, {}),
  err => err && err.code === 'VALIDATION_ERROR'
);
assert.throws(
  () => helpers.normalizeLogbookDowntime_({ menyebabkanDowntime: 'Mungkin', jamMulai: '08:00', jamSelesai: '09:00' }, {}),
  err => err && err.code === 'VALIDATION_ERROR'
);
assert.throws(
  () => helpers.normalizeLogbookDowntime_({ menyebabkanDowntime: '', jamMulai: '08:00', jamSelesai: '09:00' }, {}),
  err => err && err.code === 'VALIDATION_ERROR'
);

const oldClient = helpers.normalizeLogbookDowntime_({
  downtime: '90 menit', jamMulai: '08:00', jamSelesai: '09:30'
}, {});
assert.equal(oldClient.menyebabkanDowntime, '');
assert.equal(oldClient.downtime, '90 menit');
assert.equal(oldClient.durasiPekerjaan, 90);

const oldRow = helpers.normalizeLogbookDowntime_({
  menyebabkanDowntime: '', downtime: 30, jamMulai: '08:00', jamSelesai: '08:30'
}, {
  'Menyebabkan Downtime': '',
  'Downtime (menit)': 30,
  'Jam Mulai': '08:00',
  'Jam Selesai': '08:30'
});
assert.equal(oldRow.menyebabkanDowntime, '');
assert.equal(oldRow.downtime, 30);
assert.equal(oldRow.durasiPekerjaan, 30);

const parserStart = html.indexOf('function parseNumericMinutes_(raw){');
const parserEnd = html.indexOf('function fmtDurationMinutes(mins){', parserStart);
assert.ok(parserStart >= 0 && parserEnd > parserStart, 'duration parsers must exist');
const parsers = new Function(
  html.slice(parserStart, parserEnd) +
  '\nreturn { parseDurationMinutes, parseWorkDurationMinutes };'
)();

assert.equal(parsers.parseDurationMinutes({
  'Menyebabkan Downtime': 'Tidak',
  'Downtime (menit)': 0,
  'Durasi Pekerjaan (menit)': 120
}), 0);
assert.equal(parsers.parseDurationMinutes({
  'Menyebabkan Downtime': 'Ya',
  'Downtime (menit)': 45,
  'Durasi Pekerjaan (menit)': 120
}), 45);
assert.equal(parsers.parseWorkDurationMinutes({
  'Menyebabkan Downtime': 'Tidak',
  'Downtime (menit)': 0,
  'Durasi Pekerjaan (menit)': 120
}), 120);

console.log('Logbook downtime choice tests passed.');
