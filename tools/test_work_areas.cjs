
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('public/index.html','utf8'),catalog=fs.readFileSync('public/work-areas.js','utf8');
const c={escapeHtml:s=>String(s).replaceAll('<','&lt;').replaceAll('>','&gt;'),MACHINE_LAINNYA_VALUE:'other',MACHINES:[{'Kode Mesin':'OFS-8','Nama Mesin':'Offset 8','Lokasi/Area':'Printing'}],$:()=>null,norm_:v=>String(v||'').trim()};
assert(fs.readFileSync('src/worker.js','utf8').startsWith(catalog.trimEnd()));
vm.createContext(c);vm.runInContext(catalog,c);
let toggleStart=html.indexOf('function toggleMachineLainnyaRow()'),toggleEnd=html.indexOf('const selectKodeMesin =',toggleStart);
assert(toggleStart>=0&&toggleEnd>toggleStart,'machine fallback toggle block exists');
vm.runInContext(html.slice(toggleStart,toggleEnd),c);
assert.equal(c.toggleMachineLainnyaRow(),false,'optional/missing location form controls must not throw');
let start=html.indexOf('function isAreaEntry_'),end=html.indexOf('function updateSidebarCounts()',start);
vm.runInContext(html.slice(start,end),c);
assert.equal(Object.keys(c.OMODOS_WORK_AREAS).length,12);
assert.equal(c.populateWorkAreaOptions_('Office',null,''),false,'missing area select is ignored safely');
const testSelect={innerHTML:'',value:''};
assert.equal(c.populateWorkAreaOptions_('Office',testSelect,'RMS'),true);
assert(testSelect.innerHTML.includes('Preparation')&&testSelect.innerHTML.includes('QC Incoming'),'area options are populated');
assert.equal(testSelect.value,'RMS','selected area is preserved');
assert.equal(c.syncLogbookLocationForm_(),false,'missing Logbook form controls do not throw');
for(const [category,areas]of Object.entries(c.OMODOS_WORK_AREAS))for(const area of areas){
 const e=c.applyLogbookLocationPayload_({lokasiPekerjaan:'Area',kategoriArea:category,namaArea:area,kodeMesin:'stale',namaMesin:'Offset 8'});
 assert.equal(e.kodeMesin,'-');assert.equal(e.namaMesin,'-');assert.equal(e.namaUnit,'-');assert(e.lokasi.includes(category));
}
assert.notEqual(c.applyLogbookLocationPayload_({lokasiPekerjaan:'Area',kategoriArea:'Office',namaArea:'RMS'}).lokasi,c.applyLogbookLocationPayload_({lokasiPekerjaan:'Area',kategoriArea:'RMS',namaArea:'RMS'}).lokasi);
assert.throws(()=>c.applyLogbookLocationPayload_({lokasiPekerjaan:'Area',kategoriArea:'Office',namaArea:'Offset #5'}));
assert.throws(()=>c.applyLogbookLocationPayload_({lokasiPekerjaan:'Mesin',kodeMesin:'',namaMesin:''}));
const machine=c.applyLogbookLocationPayload_({lokasiPekerjaan:'Mesin',kodeMesin:'OFS-8',namaMesin:'Offset 8',kategoriArea:'Office',namaArea:'RMS'});assert.equal(machine.lokasi,'Printing');assert.equal(machine.kategoriArea,'-');
start=html.indexOf('function anIsBreakdown(');end=html.indexOf('function anEntryHour',start);vm.runInContext(html.slice(start,end),c);
const areaRecord={'Lokasi Pekerjaan':'Area','Lokasi/Area':'Machine Room · Offset #5','Jenis Pekerjaan':'Emergency Repair','Downtime (menit)':180};
assert.equal(c.anIsBreakdown(areaRecord),false);
assert.throws(()=>c.applyLogbookLocationPayload_({lokasiPekerjaan:'Mesin',kodeMesin:'other',namaMesin:'other'}),/Kode Mesin dan Nama Mesin wajib diisi/);
console.log('Area work: PASS (all category/area pairs, safe control guards, option population, payload validation, machine mapping, downtime exclusion).');
