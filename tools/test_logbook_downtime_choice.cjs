'use strict';

const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');

const html = readFileSync('public/index.html', 'utf8');
const worker = readFileSync('src/worker.js', 'utf8');

assert.match(html, /name="menyebabkanDowntime" id="input-menyebabkanDowntime" required/);
assert.match(html, /name="durasiPekerjaanMenit" id="input-durasiPekerjaanMenit"/);
assert.match(html, /entry\.downtime = entry\.menyebabkanDowntime === 'Ya'/);
assert.match(html, /'Durasi Pekerjaan \(menit\)':'durasiPekerjaanMenit'/);
assert.match(html, /function parseWorkDurationMinutes\(e\)/);
assert.match(html, /const mins = parseWorkDurationMinutes\(e\);/);
assert.match(html, /return parseDurationMinutes\(e\) > 0 && !jp\.includes\('preventive'\);/);

assert.match(worker, /"Menyebabkan Downtime", "Durasi Pekerjaan \(menit\)", "Downtime \(menit\)"/);
assert.match(worker, /rowMap\["Downtime \(menit\)"\] = downtimeFields\.hasChoice \? downtimeFields\.downtimeMinutes/);
assert.match(worker, /"Downtime \(menit\)": downtimeFields\.hasChoice \? downtimeFields\.downtimeMinutes/);
assert.match(worker, /rowMap\["Menyebabkan Downtime"\] = downtimeFields\.hasChoice \? downtimeFields\.choice/);

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
assert.equal(withDowntime.hasChoice, true);
assert.equal(withDowntime.choice, 'Ya');
assert.equal(withDowntime.durationMinutes, 120);
assert.equal(withDowntime.downtimeMinutes, 120);

const withoutDowntime = helpers.resolveLogbookDowntime_({
  menyebabkanDowntime: 'Tidak', jamMulai: '08:00', jamSelesai: '10:00'
}, null);
assert.equal(withoutDowntime.hasChoice, true);
assert.equal(withoutDowntime.choice, 'Tidak');
assert.equal(withoutDowntime.durationMinutes, 120);
assert.equal(withoutDowntime.downtimeMinutes, 0);

const legacyEntry = helpers.resolveLogbookDowntime_({
  downtime: 45, jamMulai: '08:00', jamSelesai: '08:45'
}, null);
assert.equal(legacyEntry.hasChoice, false);
assert.equal(legacyEntry.durationMinutes, 45);
assert.equal(legacyEntry.downtimeMinutes, undefined);

assert.throws(
  () => helpers.resolveLogbookDowntime_({ menyebabkanDowntime: 'Ya', jamMulai: '', jamSelesai: '' }, null),
  err => err && err.code === 'VALIDATION_ERROR'
);
assert.throws(
  () => helpers.resolveLogbookDowntime_({ menyebabkanDowntime: 'Tidak', jamMulai: '', jamSelesai: '' }, null),
  err => err && err.code === 'VALIDATION_ERROR'
);
assert.throws(
  () => helpers.resolveLogbookDowntime_({ menyebabkanDowntime: 'Mungkin', jamMulai: '08:00', jamSelesai: '09:00' }, null),
  err => err && err.code === 'VALIDATION_ERROR'
);

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
assert.equal(parsers.parseWorkDurationMinutes({
  'Downtime (menit)': 45
}), 45);

console.log('Logbook downtime and work-duration tests passed.');
