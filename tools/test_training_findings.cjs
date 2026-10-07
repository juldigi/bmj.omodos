const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const worker=fs.readFileSync('src/worker.js','utf8'),html=fs.readFileSync('public/index.html','utf8');
function block(source,start,end){const a=source.indexOf(start),b=source.indexOf(end,a);assert(a>=0&&b>a);return source.slice(a,b);}
const sheets=new Map(),props=new Map();
class Sheet{
 constructor(rows){this.rows=rows.map(r=>r.slice());}
 getLastRow(){return this.rows.length;} getLastColumn(){return this.rows[0].length;}
 getDataRange(){return {getValues:()=>this.rows.map(r=>r.slice())};}
 getRange(r,c,n=1,m=1){return {getValues:()=>this.rows.slice(r-1,r-1+n).map(row=>row.slice(c-1,c-1+m)),setValues:values=>values.forEach((row,i)=>row.forEach((v,j)=>{this.rows[r+i-1][c+j-1]=v;})),setValue:v=>{this.rows[r-1][c-1]=v;}};}
 appendRow(row){this.rows.push(row.slice());}
}
const headers=['Kode Mesin','Nama Mesin','Lokasi/Area','Kategori'];
sheets.set('machines',new Sheet([headers,['COL-1','Collator Machine','Area A','Production'],['COL-1','AHU 1','Area B','Utility'],['-','Compressor 2','Area C','Utility'],['PLT-1','Pile Turner 2','Area D','Production'],['OFS-10','OFFSET MACHINE 10','Printing','Printing']]));
sheets.set('personil',new Sheet([['Nama Personil'],['Fatkhurrohman'],['Other Technician']]));
sheets.set('pi',new Sheet([['ID Karyawan','Nama'],['83101002','Fatkhurrosidi']]));
const ctx={console,Number,JSON,Array,Set,Map,PropertiesService:{getScriptProperties:()=>({getProperty:k=>props.get(k),setProperty:(k,v)=>props.set(k,v)})},SHEET_MESIN:'machines',MESIN_HEADERS:headers,SHEET_PERSONIL:'personil',SHEET_PI_PERSONNEL:'pi',SHEET_SPAREPART_LOKASI:'materials',SPAREPART_LOKASI_HEADERS:['Material Number SAP','Nama Material','Stock Qty'],
 getSS_:()=>({getSheetByName:n=>sheets.get(n)}),getOrCreateSheet_:(n,h)=>{if(!sheets.has(n))sheets.set(n,new Sheet([h]));return sheets.get(n);},invalidateCacheForSheet_:()=>{},
 ensureHeaderColumns_:(sh,cols)=>cols.forEach(c=>{if(!sh.rows[0].includes(c)){sh.rows[0].push(c);sh.rows.slice(1).forEach(r=>r.push(''));}}),
 getSparepartLokasiMerged_:()=>{const sh=sheets.get('materials');return sh.rows.slice(1).map(r=>Object.fromEntries(sh.rows[0].map((h,i)=>[h,r[i]])));}};
vm.createContext(ctx);vm.runInContext(block(worker,'  function trainingValue_','  function getMachinesList_'),ctx);
for(const jumlah of ['',0,-1,'not a number',Infinity]) assert.throws(()=>ctx.validateTrainingMaterials_({sparepartDetail:[{nama:'Bearing',sap:'123',jumlah}]}),/./);
assert.equal(ctx.validateTrainingMaterials_({namaMaterial:'-',materialNumberSAP:'-'}).length,0);
assert.equal(ctx.validateTrainingMaterials_({sparepartDetail:[{nama:'Bearing',jumlah:2}]}).length,1);
assert.equal(ctx.validateTrainingMaterials_({namaMaterial:'Bearing (2 pcs)',materialNumberSAP:'123'})[0].jumlah,2);
assert.throws(()=>ctx.validateTrainingMaterials_({namaMaterial:'Bearing'}));
const detail=[{nama:'New seal',sap:'',jumlah:2},{nama:'Motor',sap:'001',jumlah:1}];
assert.equal(ctx.registerTrainingMaterials_(detail,'LB-1').length,2);
assert.equal(ctx.registerTrainingMaterials_(detail,'LB-1').length,0);
assert.equal(ctx.getSparepartLokasiMerged_().length,2);
assert.equal(ctx.getSparepartLokasiMerged_()[0]['Stock Qty'],'');
assert.equal(ctx.getSparepartLokasiMerged_()[0]['Perlu Verifikasi'],true);
ctx.applyTrainingMasterCorrections_();
const rows=sheets.get('machines').rows;
assert.equal(rows.find(r=>r[1]==='Collator Machine')[0],'COL-1');
assert.equal(rows.find(r=>r[1]==='AHU 1')[0],'AHU-1');
assert.equal(rows.find(r=>r[1]==='Compressor 2')[0],'COMPRESSOR-2');
assert.equal(rows.find(r=>r[0]==='PLT-1')[1],'Pile Turner 1');
assert(rows.some(r=>r[1]==='AHU 9'));assert(rows.some(r=>r[1]==='AHU 10'));
assert.equal(rows.filter(r=>/offset.*10/i.test(r[1])).length,1);
assert.equal(sheets.get('personil').rows[1][0],'Fatkhurosidi');assert.equal(sheets.get('personil').rows[2][0],'Other Technician');
const count=rows.length;ctx.applyTrainingMasterCorrections_();assert.equal(sheets.get('machines').rows.length,count);
// Reproduce production's duplicate code and hash-formatted names, even after V1.
props.delete('TRAINING_FIX_20261007_V2');props.set('TRAINING_FIX_20261007_V1','1');
sheets.set('machines',new Sheet([headers,['PLT-1','Pile Turner #1'],['PLT-1','Pile Turner #2'],['PLT-3','Pile Turner #3']]));
ctx.applyTrainingMasterCorrections_();
assert.equal(sheets.get('machines').rows.find(r=>r[1]==='Pile Turner #1')[0],'PLT-1');
assert.equal(sheets.get('machines').rows.find(r=>r[1]==='Pile Turner #2')[0],'PLT-2');
const front={console,Number,JSON,Array,SPAREPART_ROWS:[{nama:'Seal',sap:'',jumlah:''}],syncSparepartRowsFromDom:()=>{},findSparepartLokasiBySap:()=>null,PM_REPORTS:[{id:'PM-1',patrolMode:false,tanggal:'2026-10-07',findings:[{id:'F-1',deskripsi:'Simulasi'}]}],parseAttachments:x=>x};
vm.createContext(front);
vm.runInContext(block(html,'function norm_(s){','function buildMachineIndex_'),front);
vm.runInContext(block(html,'function buildMaterialFieldsFromRows(){','/* ---------------- FILE UPLOAD'),front);
assert.throws(()=>front.buildMaterialFieldsFromRows());front.SPAREPART_ROWS[0].jumlah=3;assert.equal(front.buildMaterialFieldsFromRows().detail[0].jumlah,3);
vm.runInContext(block(html,'function patrolAllFindings(){','function renderPatrolTemuanList(){'),front);
assert.equal(front.patrolAllFindings().length,1);assert.equal(front.patrolAllFindings()[0].status,'Open');
vm.runInContext(block(html,'function hydratePatrolFindingFiles_','function normalizePmTimestamp_'),front);
const findings=[{files:[{name:'old.jpg',viewUrl:'/files/old'},{name:'new.jpg',viewUrl:'blob:new'}]}];
const hydrated=front.hydratePatrolFindingFiles_(findings,[{name:'new.jpg',viewUrl:'/files/new'}]);
assert.equal(hydrated[0].files[0].viewUrl,'/files/old');assert.equal(hydrated[0].files[1].viewUrl,'/files/new');
assert(html.includes("credentials: 'same-origin'"));
assert(html.trimEnd().endsWith('</html>'));
for(const match of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)) new vm.Script(match[1]);
assert(html.includes('/omodos4/hotfix.js'));
assert(worker.includes('sheetName === SHEET_SPAREPART_LOKASI && !!trainingValue_'));
assert(!html.includes("'Progress':'Perkembangan'"));
assert(html.includes("$('#btn-wiki-back').disabled = !WIKI_CURRENT"));
assert(html.includes('#dash-grid .dc-name,#dash-grid .dc-status{display:block!important'));
console.log('Training findings regression: PASS (quantity, registration/dedup, master migration, findings, media, mobile, Wiki navigation).');
