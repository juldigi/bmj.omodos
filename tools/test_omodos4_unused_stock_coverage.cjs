'use strict';
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');

const worker = readFileSync('src/worker.js', 'utf8');
const intelligence = readFileSync('public/omodos4/superadmin-intelligence.js', 'utf8');

assert.ok(worker.includes('const SOURCE_TRUTH_START_ISO = "2026-09-01T00:00:00+07:00";'),
  'usage evidence must remain bounded by the OMODOS 4.0 source-truth cutoff');
assert.ok(worker.includes('const usageHistoryDays = Math.max(1, Math.ceil((now - SOURCE_TRUTH_START_MS) / 864e5));'),
  'backend must calculate the actual coverage length rather than implying full lifetime history');

const candidateStart = worker.indexOf('const deadStockCandidates =');
const candidateEnd = worker.indexOf('const shelfMap', candidateStart);
assert.ok(candidateStart >= 0 && candidateEnd > candidateStart, 'sparepart usage candidate builder must exist');
const candidate = worker.slice(candidateStart, candidateEnd);
assert.match(candidate, /NO_RECORDED_USAGE_CANDIDATE/);
assert.match(candidate, /historyDays: usageHistoryDays/);
assert.match(candidate, /coverageStart: SOURCE_TRUTH_START_ISO/);
assert.doesNotMatch(candidate, /CANDIDATE_ONLY/);
assert.match(worker, /logicVersion: "v4-sparepart-4"/);

assert.match(intelligence, /33:\{name:'Belum Tercatat Dipakai'/,
  'feature 033 must use non-judgmental wording');
const renderStart = intelligence.indexOf('function renderDead(data){');
const renderEnd = intelligence.indexOf('function renderConsumption(data)', renderStart);
assert.ok(renderStart >= 0 && renderEnd > renderStart, 'feature 033 renderer must exist');
const render = intelligence.slice(renderStart, renderEnd);
assert.match(render, /historyDays/);
assert.match(render, /coverageStart/);
assert.match(render, /PERLU CEK/);
assert.doesNotMatch(render, />KANDIDAT</);
assert.match(render, /bukan klasifikasi dead stock/);
assert.match(render, /bukan dasar keputusan disposal/);

console.log('OMODOS4 sparepart history-coverage and cautious classification tests passed.');
