'use strict';
const assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');
const base=readFileSync('public/index.html','utf8');
const hot=readFileSync('public/omodos4/hotfix.js','utf8');
const superadmin=readFileSync('public/omodos4/superadmin-intelligence.js','utf8');
const worker=readFileSync('src/worker.js','utf8');
const start=base.indexOf('async function saveEntryEdit(id){');
const end=base.indexOf('\nfunction closeModal()',start);
assert.ok(start>=0&&end>start,'saveEntryEdit block exists');
const edit=base.slice(start,end);
const us=worker.indexOf('function updateEntry_(body) {'),ue=worker.indexOf('__name(updateEntry_, "updateEntry_")',us);
assert.ok(us>=0&&ue>us,'updateEntry block exists');
const update=worker.slice(us,ue);
assert.match(worker,/var explicitCustom=!!customArea&&customArea===area/);
assert.match(worker,/data\.namaAreaLainnya\|\|data\["Nama Area Lainnya"\]/);
assert.match(worker,/"logbookAttachments": \{ permission: "logbook\.read", audit: false, idempotent: false, handler: "getLogbookAttachments_", method: "GET" \}/);
assert.match(worker,/function logbookAttachmentCountRaw_\(raw\)/);
assert.match(worker,/function summarizeLogbookRows_\(rows\)/);
assert.match(worker,/copy\["Lampiran Count"\] = logbookAttachmentCountRaw_\(copy\["Lampiran \(JSON\)"\]\)/);
assert.match(worker,/delete copy\["Lampiran \(JSON\)"\]/);
assert.match(worker,/function getLogbookAttachments_\(params\)/);
assert.match(worker,/action === "logbookAttachments" && typeof getLogbookAttachments_/);
assert.match(worker,/var summary = String\(params\.summary \|\| ""\) === "1"/);
assert.match(worker,/var lightweightRecentEntries = summarizeLogbookRows_\(recentEntries\)/);
const compactStart=worker.indexOf('  function logbookAttachmentCountRaw_(raw) {');
const compactEnd=worker.indexOf('  function getLogbookAttachments_(params) {',compactStart);
assert.ok(compactStart>=0&&compactEnd>compactStart,'compact Logbook helper block exists');
const compactSource=worker.slice(compactStart,compactEnd);
const compactHelpers=new Function('__name',compactSource+'; return {logbookAttachmentCountRaw_,summarizeLogbookRows_};')((fn)=>fn);
const compactRows=compactHelpers.summarizeLogbookRows_([
  {ID:'one',Status:'Selesai','Lampiran (JSON)':[{},{}]},
  {ID:'two',Status:'Proses','Lampiran (JSON)':'[{"name":"a"},{"name":"b"},{"name":"c"}]'},
  {ID:'three',Status:'Pending','Lampiran (JSON)':'https://example.test/a.jpg\nhttps://example.test/b.jpg'}
]);
assert.deepEqual(compactRows.map(r=>r['Lampiran Count']),[2,3,2],'summary count matches source attachment shapes');
assert.ok(compactRows.every(r=>!Object.prototype.hasOwnProperty.call(r,'Lampiran (JSON)')),'summary rows omit full attachment payloads');
assert.equal(compactRows[0].Status,'Selesai','summary preserves non-attachment fields');
const countRaw=compactHelpers.logbookAttachmentCountRaw_;
const oldCountRaw=(raw)=>{
  if(!raw)return 0;
  if(Array.isArray(raw))return raw.length;
  if(typeof raw!=='string')return 0;
  const trimmed=raw.trim();if(!trimmed)return 0;
  try{const parsed=JSON.parse(trimmed);if(Array.isArray(parsed))return parsed.length;if(parsed&&typeof parsed==='object')return 1;}catch(e){}
  return trimmed.split(/[\n,]+/).map(s=>s.trim()).filter(Boolean).length;
};
const countCases=[
  ['',0],['   ',0],['[]',0],[' [ ] ',0],[[{},{}],2],
  ['[{},{}]',2],['[{"name":"one","items":[1,2]},{"name":"two,three"}]',2],
  ['["comma,inside","escaped\\\\,comma"]',2],['[null,true,false,123,"x"]',5],
  ['[1,,2]',2],['[,1]',2],['[1,]',2],
  ['{"name":"one"}',1],['https://example.test/a.jpg\nhttps://example.test/b.jpg',2],
  ['bad-url',1],[null,0],[{name:'one'},0]
];
for(const [raw,expected] of countCases){
  assert.equal(oldCountRaw(raw),expected,'legacy attachment count fixture');
  assert.equal(countRaw(raw),expected,'lightweight attachment count parity for '+String(raw));
}

const sotStart=worker.indexOf('function getLogbookListSot_()');
const sotEnd=worker.indexOf('__name(getLogbookListSot_',sotStart);
assert.ok(sotStart>=0&&sotEnd>sotStart,'bootstrap Logbook source function exists');
const sotSource=worker.slice(sotStart,sotEnd);
assert.match(sotSource,/rows_Logbook_sot_raw_attachments_v2/);
assert.ok(!sotSource.includes('safeJsonParse_(obj["Lampiran (JSON)"]'),'bootstrap must not expand all attachment JSON before summarization');
const fullStart=worker.indexOf('function getLogbookListFull_()');
const fullEnd=worker.indexOf('__name(getLogbookListFull_',fullStart);
assert.ok(fullStart>=0&&fullEnd>fullStart,'full Logbook source function exists');
const fullSource=worker.slice(fullStart,fullEnd);
assert.ok(fullSource.includes('safeJsonParse_(obj["Lampiran (JSON)"]'),'full Logbook reads must preserve normalized attachments for detail');

const listStart=worker.indexOf('function getLogbookList_(params) {');
const listEnd=worker.indexOf('function logbookAttachmentCountRaw_(raw)',listStart);
assert.ok(listStart>=0&&listEnd>listStart,'Logbook list source function exists');
const listSource=worker.slice(listStart,listEnd);
assert.match(listSource,/if \(summary\) return getLogbookListSummary_\(\)/,'summary list should use the compact cached loader');
assert.match(listSource,/if \(!summary\) \{/,'incremental sync should skip attachment normalization in summary mode');

const summaryStart=worker.indexOf('function getLogbookListSummary_() {');
const summaryEnd=worker.indexOf('__name(getLogbookListSummary_',summaryStart);
assert.ok(summaryStart>=0&&summaryEnd>summaryStart,'compact cached summary loader exists');
const summarySource=worker.slice(summaryStart,summaryEnd);
assert.match(summarySource,/rows_Logbook_summary_v1/);
assert.match(summarySource,/logbookAttachmentCountRaw_\(obj\["Lampiran \(JSON\)"\]\)/);
assert.match(summarySource,/delete obj\["Lampiran \(JSON\)"\]/);
assert.doesNotMatch(summarySource,/safeJsonParse_\(/,'summary loader must not normalize attachment objects');
const summaryInvalidationStart=worker.indexOf('function invalidateCacheForSheet_\(sheetName\) {');
const summaryInvalidationEnd=worker.indexOf('__name(invalidateCacheForSheet_',summaryInvalidationStart);
assert.ok(summaryInvalidationStart>=0&&summaryInvalidationEnd>summaryInvalidationStart,'cache invalidation helper exists');
const summaryInvalidation=worker.slice(summaryInvalidationStart,summaryInvalidationEnd);
assert.match(summaryInvalidation,/cache\.remove\("rows_Logbook_summary_v1"\)/);
assert.match(summaryInvalidation,/cache\.remove\("rows_Logbook_sot_raw_attachments_v2"\)/);

const summaryHeaders=['ID','Status','Lampiran (JSON)','DeletedAt','Tanggal','Timestamp Input'];
const summaryDataRows=[
  ['old','Selesai','[{"name":"a"},{"name":"b"}]','','2026-10-20','2026-10-20T08:00:00.000Z'],
  ['hidden','Selesai','[{"name":"h"}]','2026-10-21','2026-10-21','2026-10-21T08:00:00.000Z'],
  ['new','Proses','{"name":"one"}','','2026-10-21','2026-10-21T09:00:00.000Z']
];
const summaryCacheStore=new Map();
const summaryCache={
  get:key=>summaryCacheStore.get(key)||null,
  put:(key,value)=>summaryCacheStore.set(key,value),
  remove:key=>summaryCacheStore.delete(key)
};
let summarySheetReadCount=0;
const summarySheet={
  getLastRow(){summarySheetReadCount++;return summaryDataRows.length+1;},
  getLastColumn(){return summaryHeaders.length;},
  getRange(row,col,numRows=1,numCols=1){
    return {
      getValues(){
        summarySheetReadCount++;
        if(row===1)return [summaryHeaders.slice(col-1,col-1+numCols)];
        return summaryDataRows.slice(row-2,row-2+numRows).map(r=>r.slice(col-1,col-1+numCols));
      },
      getValue(){return this.getValues()[0][0];}
    };
  }
};
const rowToObjectForSummary=(headers,row)=>{
  const out={};headers.forEach((header,index)=>out[header]=row[index]);return out;
};
const getSummaryForTest=new Function(
  'getCache_','getOrCreateSheet_','SHEET_LOGBOOK','LOGBOOK_HEADERS','rowToObj_',
  'logbookAttachmentCountRaw_','Utilities','Session','CACHE_TTL_SECONDS',
  summarySource+'; return getLogbookListSummary_;'
)(
  ()=>summaryCache,()=>summarySheet,'Logbook',[],rowToObjectForSummary,
  compactHelpers.logbookAttachmentCountRaw_,{formatDate:(date)=>date},{getScriptTimeZone:()=>'UTC'},600
);
const summaryOutput=getSummaryForTest();
assert.deepEqual(summaryOutput.map(r=>r.ID),['new','old'],'summary list retains reverse chronological row order and skips soft-deleted rows');
assert.deepEqual(summaryOutput.map(r=>r['Lampiran Count']),[1,2],'summary loader counts raw attachments without materializing them');
assert.ok(summaryOutput.every(r=>!Object.prototype.hasOwnProperty.call(r,'Lampiran (JSON)')),'summary output omits raw attachment payload');
const readsAfterSummary=summarySheetReadCount;
assert.deepEqual(getSummaryForTest(),summaryOutput,'cached summary remains stable');
assert.equal(summarySheetReadCount,readsAfterSummary,'cached summary avoids rereading Logbook rows');

const attachmentStart=worker.indexOf('  function getLogbookAttachments_(params) {');
const attachmentEnd=worker.indexOf('  __name(getLogbookAttachments_',attachmentStart);
assert.ok(attachmentStart>=0&&attachmentEnd>attachmentStart,'per-entry attachment endpoint exists');
const attachmentSource=worker.slice(attachmentStart,attachmentEnd);
const attachmentHeaders=['ID','Lampiran (JSON)','DeletedAt'];
const attachmentDataRows=[
  ['one','[{"name":"a"},{"name":"b"}]',''],
  ['deleted','[{"name":"gone"}]','2026-10-20T00:00:00.000Z']
];
const attachmentRangeCalls=[];
const attachmentSheet={
  getLastRow:()=>attachmentDataRows.length+1,
  getLastColumn:()=>attachmentHeaders.length,
  getRange(row,col,numRows=1,numCols=1){
    attachmentRangeCalls.push([row,col,numRows,numCols]);
    return {
      getValues(){
        if(row===1)return [attachmentHeaders.slice(col-1,col-1+numCols)];
        return attachmentDataRows.slice(row-2,row-2+numRows).map(r=>r.slice(col-1,col-1+numCols));
      },
      getValue(){return this.getValues()[0][0];}
    };
  }
};
let fullLoaderCalls=0;
const getAttachmentsForTest=new Function(
  'getLogbookListFull_','getOrCreateSheet_','SHEET_LOGBOOK','LOGBOOK_HEADERS','safeJsonParse_',
  attachmentSource+'; return getLogbookAttachments_;'
)(
  ()=>{fullLoaderCalls++;throw new Error('full Logbook loader should not run for one attachment request');},
  ()=>attachmentSheet,'Logbook',[],
  (value,fallback)=>{try{return JSON.parse(value);}catch(e){return fallback;}}
);
assert.equal(getAttachmentsForTest({id:'one'}).length,2,'attachment endpoint returns the selected row payload');
assert.equal(fullLoaderCalls,0,'attachment endpoint does not load/normalize all Logbook entries');
assert.ok(attachmentRangeCalls.some(([row,col,count,width])=>row===2&&col===1&&count===2&&width===1),'attachment endpoint reads only the ID column for lookup');
assert.ok(attachmentRangeCalls.some(([row,col,count,width])=>row===2&&col===3&&count===2&&width===1),'attachment endpoint checks soft-delete state through a single column');
assert.ok(attachmentRangeCalls.some(([row,col,count,width])=>row===2&&col===2&&count===1&&width===1),'attachment endpoint reads attachment JSON only for the selected row');
assert.ok(!attachmentRangeCalls.some(([row,_col,_count,width])=>row===2&&width===attachmentHeaders.length),'attachment endpoint does not read every field of every Logbook row');
assert.throws(()=>getAttachmentsForTest({}),err=>err&&err.message==='ID Logbook wajib diisi','attachment endpoint requires a Logbook ID');
assert.throws(()=>getAttachmentsForTest({id:'missing'}),err=>err&&err.message==='Catatan Logbook tidak ditemukan','attachment endpoint rejects missing rows');
assert.throws(()=>getAttachmentsForTest({id:'deleted'}),err=>err&&err.message==='Catatan Logbook tidak ditemukan','attachment endpoint excludes soft-deleted rows');
assert.match(worker,/rowMap\["Nomor MO"\] = trainingValue_\(data\.nomorMO\) \|\| ""/);
assert.match(update,/attachmentList\.push\(uploaded\)/);
assert.match(update,/rowMap\["Lampiran \(JSON\)"\] = JSON\.stringify\(attachmentList\)/);
assert.match(update,/rowMap\["Nomor MO"\] = data\.nomorMO/);
assert.match(update,/attachments: attachmentList/);
assert.match(update,/idValues = sh\.getRange\(2, idCol \+ 1, lastRow - 1, 1\)\.getValues\(\)/);
assert.doesNotMatch(update,/getDataRange\(\)\.getValues\(\)/,'Edit should not copy the whole Logbook table into memory');
assert.match(base,/refreshLogbookLocal_\(entry,saved,'add'\)/);
assert.match(edit,/files:editFiles/);
assert.match(edit,/refreshLogbookLocal_\(entry,saved,'update'\)/);
assert.match(hot,/invalidateLogbookSortCache_\(\)/);
assert.doesNotMatch(edit,/await loadAll\(\)/);
assert.match(base,/function loadOmodos4Intelligence_\(\)/);
assert.match(base,/superadmin-intelligence\.js/);
assert.match(base,/technicians never fetch this optional script/);
const switchStart=base.indexOf('function switchToView(enteringView)');
const switchEnd=base.indexOf('const leavingView = PREVIOUS_ACTIVE_VIEW;',switchStart);
const switchHead=base.slice(switchStart,switchEnd);
assert.ok(switchHead.includes('loadOmodos4Intelligence_()'),'Superadmin module lazy loader is present');
assert.ok(!switchHead.includes('return true;'),'navigation remains synchronous while Superadmin assets load');
assert.doesNotMatch(hot,/OMODOS 4\.0 master-prompt frontend-only recovery layer/);
assert.match(superadmin,/version:'4\.0-master-recovery-100'/);
assert.match(superadmin,/featureCount:100/);
assert.match(hot,/LOGBOOK_REVIEW_FIXES_20261021_V1/);
assert.match(hot,/name="nomorMO"/);
assert.match(hot,/id="edit-nomorMO"/);
assert.match(hot,/function compressEditPhoto\(file\)/);
assert.match(hot,/decoding="async" fetchpriority="low"/);
assert.match(hot,/takeLogbookEditFiles_/);
assert.match(hot,/function exportPdf\(modal\)/);
assert.ok(hot.includes("const thumb=[f.thumbUrl,f.previewUrl].find(candidate=>candidate&&candidate!==url)||''"),'full-size media is not reused as thumbnail');
assert.match(hot,/function installLightweightLogbookAttachmentGrid\(\)/);
assert.match(hot,/window\.__OMODOS_LOGBOOK_DETAIL_RENDERING_V1/);
assert.ok(hot.includes("!!(showAll&&modal&&modal.classList.contains('active'))"),'lightweight rendering is restricted to the active Logbook detail');
assert.ok(hot.includes("!/\\/files\\//.test(String(a.viewUrl||''))"),'lightweight preview applies to /files/ attachments');
assert.match(hot,/return \{\.\.\.a,type:'file'\}/);
assert.match(hot,/replace\('— klik untuk memperbesar','— klik untuk membuka lampiran'\)/);
assert.match(hot,/const visibleOld=showingAll\?old:old\.slice\(0,6\)/);
assert.match(hot,/const oldCards=visibleOld\.map/);
assert.match(hot,/const remaining=old\.length-visibleOld\.length/);
assert.match(hot,/data-edit-photo-show-all/);
assert.match(hot,/OMODOS_LAZY_VENDOR_LOAD_V1/);
assert.match(hot,/window\.omodosLoadVendor_/);
assert.match(hot,/buildMaterialPickerIndex_/);
assert.doesNotMatch(hot,/function attachEditMaterialSuggestions/,'legacy edit material picker must not add duplicate per-keystroke listeners');
assert.doesNotMatch(hot,/function attachPicker\(\)/,'second duplicate edit material picker must remain removed');
for(const vendor of ['html2canvas.min.js','docx.min.js','exceljs.min.js','vis-network.min.js']){
 assert.ok(!base.includes('<script src="/vendor/'+vendor+'"></script>'),vendor+' should load only on demand');
}
assert.match(base,/const LOGBOOK_PAGE_SIZE_ = 40/);
assert.match(base,/const LOGBOOK_MOBILE_PAGE_SIZE_ = 20/);
assert.ok(base.includes("const pageSize = typeof window.matchMedia==='function'") && base.includes('LOGBOOK_MOBILE_PAGE_SIZE_'),'responsive mobile Logbook rendering');
assert.match(base,/let LOGBOOK_ATTACHMENT_COUNT_CACHE_ = new WeakMap\(\)/);
assert.match(base,/function logbookAttachmentCount_\(entry\)/);
assert.match(base,/const readParams = action === 'list' \? \{ summary:'1' \} : \{\}/);
assert.match(base,/let LOGBOOK_ATTACHMENT_LOAD_PROMISES_ = new WeakMap\(\)/);
assert.match(base,/async function ensureLogbookAttachments_\(entry\)/);
assert.match(base,/apiGet\('logbookAttachments',\{id\},1\)/);
assert.match(base,/async function loadLogbookAttachmentPreview_\(entry,id,slot\)/);
assert.match(base,/await ensureLogbookAttachments_\(e\);renderEntryEditForm\(e\)/);
const rawCountStart=base.indexOf('function rawAttachmentCount_(raw){');
const rawCountEnd=base.indexOf('\nfunction logbookAttachmentCount_(entry)',rawCountStart);
assert.ok(rawCountStart>=0&&rawCountEnd>rawCountStart,'lightweight raw attachment counter exists');
const rawCountSource=base.slice(rawCountStart,rawCountEnd);
assert.doesNotMatch(rawCountSource,/parseAttachments\(/,'badge count must not normalize every attachment');
const rawAttachmentCount=new Function(rawCountSource+'; return rawAttachmentCount_;')();
const parseStart=base.indexOf('function parseAttachments(raw, limit)');
const parseEnd=base.indexOf('\nfunction renderAttachThumb(a)',parseStart);
assert.ok(parseStart>=0&&parseEnd>parseStart,'existing attachment normalizer exists for parity comparison');
const parseSource=base.slice(parseStart,parseEnd);
assert.match(base,/function parseAttachments\(raw, limit\)/);
assert.match(parseSource,/const items = Number\.isFinite\(Number\(limit\)\)/);
assert.match(parseSource,/return items\.map\(item => \{/);

const parseAttachmentsForParity=new Function('inferUploadMime_','openLightbox',parseSource+'; return parseAttachments;')(()=> 'application/octet-stream',()=>{});
const manyAttachments=JSON.stringify(Array.from({length:20},(_,i)=>({name:'photo-'+i+'.jpg',type:'image',mimeType:'image/jpeg',viewUrl:'https://example.test/'+i+'.jpg'})));
assert.equal(parseAttachmentsForParity(manyAttachments,12).length,12,'detail preview normalizes only the first 12 attachments');
assert.equal(parseAttachmentsForParity(manyAttachments).length,20,'default attachment parsing still returns every item');
for(const [raw,expected] of [
  ['',0],['   ',0],[[],0],[[{},{}],2],['[]',0],
  ['[{"name":"one"},{"name":"two"}]',2],['{"name":"one"}',1],
  ['https://example.test/one.jpg\nhttps://example.test/two.jpg',2],
  ['bad-url',1],[null,0],[{name:'one'},0]
]){
  assert.equal(rawAttachmentCount(raw),expected,'raw attachment count for '+String(raw));
  assert.equal(rawAttachmentCount(raw),parseAttachmentsForParity(raw).length,'lightweight count matches the existing normalizer');
}
const detailStart=base.indexOf('function openDetail(id){');
const detailEnd=base.indexOf('\n// [FITUR EDIT LOGBOOK]',detailStart);
assert.ok(detailStart>=0&&detailEnd>detailStart,'Logbook detail renderer exists');
const detail=base.slice(detailStart,detailEnd);
assert.match(detail,/const rawAttachments = e\['Lampiran \(JSON\)'\]/);
assert.match(detail,/const attachmentCount = logbookAttachmentCount_\(e\)/);
assert.match(detail,/const attachmentsLoaded = Array\.isArray\(rawAttachments\)/);
assert.match(detail,/if\(attachmentCount>0&&!attachmentsLoaded\)/);
assert.match(detail,/ensureLogbookAttachments_\(e\)/);
assert.match(detail,/attachmentCount > 12 \? parseAttachments\(rawAttachments, 12\)/);
assert.match(detail,/Tampilkan semua '\+attachmentCount\+' lampiran/);
assert.match(detail,/slot\.innerHTML=renderAttachGrid\(parseAttachments\(loaded\),'Lampiran'\)/);
const countStart=base.indexOf('function logbookAttachmentCount_(entry){');
const countEnd=base.indexOf('\nasync function ensureLogbookAttachments_(entry)',countStart);
assert.ok(countStart>=0&&countEnd>countStart,'cached attachment counter exists');
assert.doesNotMatch(base.slice(countStart,countEnd),/parseAttachments\(raw\)/,'cached badge counter stays lightweight');
assert.match(base,/const attCount = logbookAttachmentCount_\(e\)/);
assert.match(base,/btn-entry-show-all-attachments/);
assert.ok(base.includes("let ENTRIES = [];\nlet MACHINES = [];\n// Keep the explicit window alias in sync for OMODOS compatibility modules.\nwindow.ENTRIES = ENTRIES;"),'global Logbook rows are exposed to compatibility modules');
assert.ok(base.includes("ENTRIES = await apiGet('list');\n    window.ENTRIES = ENTRIES;"),'settings data refresh keeps window.ENTRIES synchronized');
assert.ok(base.includes("ENTRIES = entriesSource.slice().sort((a,b)=>new Date(b['Timestamp Input'])-new Date(a['Timestamp Input']));\n  window.ENTRIES = ENTRIES;"),'bootstrap hydration keeps window.ENTRIES synchronized');
assert.match(base,/let LOGBOOK_MACHINE_INDEX_CACHE_ = \{ entriesRef:null, machinesRef:null, value:null \}/);
assert.match(base,/let LOGBOOK_STATS_CACHE_ = \{ entriesRef:null, today:null, value:null \}/);
assert.match(base,/let LOGBOOK_JOB_TYPES_CACHE_ = \{ entriesRef:null, value:null \}/);
assert.match(base,/function logbookJobTypes_\(\)/);
assert.match(base,/cached\.entriesRef===entriesRef && cached\.value/);
assert.match(base,/const jenisSet = logbookJobTypes_\(\)/);
assert.match(base,/cached\.entriesRef===entriesRef && cached\.machinesRef===machinesRef && cached\.value/);
assert.match(base,/LOGBOOK_MACHINE_INDEX_CACHE_ = \{ entriesRef:null, machinesRef:null, value:null \}/);
assert.match(base,/cached\.entriesRef===entriesRef && cached\.today===today && cached\.value/);
assert.match(base,/LOGBOOK_STATS_CACHE_ = \{ entriesRef:null, today:null, value:null \}/);
assert.match(base,/LOGBOOK_JOB_TYPES_CACHE_ = \{ entriesRef:null, value:null \}/);
const invalidateStart=base.indexOf('function invalidateLogbookSortCache_(){');
const invalidateEnd=base.indexOf('\nfunction logbookJobTypes_()',invalidateStart);
assert.ok(invalidateStart>=0&&invalidateEnd>invalidateStart,'Logbook cache invalidation block exists');
const invalidate=base.slice(invalidateStart,invalidateEnd);
assert.match(invalidate,/LOGBOOK_MACHINE_INDEX_CACHE_ = \{ entriesRef:null, machinesRef:null, value:null \}/);
assert.match(invalidate,/LOGBOOK_STATS_CACHE_ = \{ entriesRef:null, today:null, value:null \}/);
assert.match(invalidate,/LOGBOOK_JOB_TYPES_CACHE_ = \{ entriesRef:null, value:null \}/);
assert.match(base,/function logbookOrderedEntries_\(\)/);
assert.match(base,/function logbookSearchText_\(entry\)/);
assert.match(base,/LOGBOOK_SEARCH_TEXT_CACHE_ = new WeakMap\(\)/);
assert.match(base,/LOGBOOK_SEARCH_DEBOUNCE_MS_ = 130/);
assert.match(base,/logbookSearchText_\(e\)\.includes\(q\)/);
assert.match(base,/const stats=\{total:ENTRIES\.length,selesai:0,proses:0,emergency:0,todayCount:0\}/);
assert.match(base,/logbook-load-more-wrap/);
assert.match(base,/logbookClickDelegation/);
assert.match(base,/btn-export-entry-pdf/);
assert.match(hot,/value="24h"/);
assert.match(hot,/id="omodos-logbook-pdf-machine"/);
assert.match(hot,/window\.exportLogbookPdfForEntry_/);
assert.match(hot,/function logbookExportTimestamp_\(/);
assert.doesNotMatch(hot,/observe\(document\.documentElement,\{subtree:true,childList:true\}\)/);
assert.match(hot,/btn-logbook-export-pdf/);
assert.match(hot,/saveFormEntryDraftDebounced==='function'/);
const pdf=hot.slice(hot.indexOf('function exportPdf(modal)'),hot.indexOf('function boot(){installMoField',hot.indexOf('function exportPdf(modal)')));
assert.ok(!pdf.includes('html2canvas'),'Logbook export should not allocate a screenshot canvas');
assert.match(update,/registerTrainingMaterials_\\(materialDetails,id\\)/,'editing Logbook registers newly entered sparepart in the master');
assert.match(worker,/Perlu Verifikasi/,'newly discovered sparepart is flagged for master verification');
assert.match(hot,/LOGBOOK_EDIT_SPAREPART_DEDUP_V1/,'edit form has one-note-per-material deduplication');
assert.match(hot,/OMODOS akan menambahkan material baru ke master Sparepart_Lokasi/,'edit form explains how unregistered sparepart is added');
console.log('Logbook custom area, incremental list rendering, delegated clicks, edit photos, MO field, local refresh, scoped observers and PDF filters passed.');
