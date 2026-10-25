'use strict';

const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');

const html = readFileSync('public/index.html', 'utf8');
const worker = readFileSync('src/worker.js', 'utf8');

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

console.log('Logbook downtime choice tests passed.');
