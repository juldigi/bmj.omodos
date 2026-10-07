const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
const {DatabaseSync}=require('node:sqlite');
(async()=>{
 const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'omodos-training-'));
 const db=new DatabaseSync(':memory:');
 try{
  const source=fs.readFileSync('src/worker.js','utf8').replace('import { DurableObject } from "cloudflare:workers";','class DurableObject {}').replace('  return { doGet, doPost, registry:', '  return { trainingTest: {addEntry_,updateEntry_,savePredictiveReport_,getMachinesList_,getSparepartLokasiMerged_,saveSparepartLokasi_}, doGet, doPost, registry:')+'\nexport {createStorage,createBackend};\n';
  const mod=path.join(tmp,'worker.mjs');fs.writeFileSync(mod,source);
  const {createStorage,createBackend}=await import(pathToFileURL(mod).href);
  const sql={exec(q,...args){const stmt=db.prepare(q);if(stmt.columns().length)return stmt.all(...args);stmt.run(...args);return [];}};
  const store=createStorage(sql,{},'https://omodos.juldigi.workers.dev');
  const machines=store.spreadsheet.insertSheet('Master_Mesin');
  machines.appendRow(['Kode Mesin','Nama Mesin','Lokasi/Area','Kategori']);
  machines.appendRow(['COL-1','Collator Machine','Area 1','Production']);machines.appendRow(['COL-1','AHU 1','Area 2','Utility']);
  const b=createBackend(store.services).trainingTest;
  const ms=b.getMachinesList_();assert(ms.some(m=>m['Nama Mesin']==='AHU 9'));assert(ms.some(m=>m['Nama Mesin']==='AHU 10'));assert(ms.some(m=>m['Nama Mesin']==='OFFSET 10'));
  const entry={tanggal:'2026-10-07',shift:'1',namaPelapor:'QA',kodeMesin:'AHU-1',namaMesin:'AHU 1',jenisPekerjaan:'Corrective',prioritas:'Normal',deskripsiMasalah:'Test',tindakanPerbaikan:'-',status:'Selesai',namaMaterial:'New Seal (2 pcs)',materialNumberSAP:'',sparepartDetail:[{nama:'New Seal',sap:'',jumlah:2}]};
  const result=r=>JSON.parse(r.getContent());
  let res=result(b.addEntry_({entry:{...entry,sparepartDetail:[{nama:'New Seal',jumlah:''}]}}));assert.equal(res.ok,false);assert.match(res.error,/Jumlah/);
  res=result(b.addEntry_({entry}));assert.equal(res.ok,true);assert.equal(res.newSpareparts.length,1);
  let materials=b.getSparepartLokasiMerged_();assert.equal(materials.length,1);assert.equal(materials[0]['Nama Material'],'New Seal');assert.equal(materials[0]['Perlu Verifikasi'],true);
  const partial={...entry,id:res.id};delete partial.sparepartDetail;delete partial.namaMaterial;delete partial.materialNumberSAP;
  assert.equal(result(b.updateEntry_({entry:partial})).ok,true);
  const logbook=store.spreadsheet.getSheetByName('Logbook').getDataRange().getValues();
  const detailCol=logbook[0].indexOf('Sparepart Detail (JSON)');assert.equal(JSON.parse(logbook[1][detailCol])[0].jumlah,2);
  const saved=result(b.saveSparepartLokasi_({lokasi:{sap:'REAL-001',nama:'New Seal',originalName:'New Seal',lokasiGudang:'A-1',stockQty:null}}));assert(saved.ok);
  materials=b.getSparepartLokasiMerged_();assert.equal(materials.length,1);assert.equal(materials[0]['Material Number SAP'],'REAL-001');assert.equal(materials[0]['Perlu Verifikasi'],false);
  const first=result(b.savePredictiveReport_({id:'PM-qa',tanggal:'2026-10-07',findings:[{id:'F1',files:[{name:'old.jpg',viewUrl:'blob:old'}]}]},[{name:'old.jpg',mimeType:'image/jpeg',base64:Buffer.from('test photo').toString('base64')}]));
  assert(first.ok);const oldFile=first.attachments[0];assert(oldFile.viewUrl.includes('/files/'));
  const edited=result(b.savePredictiveReport_({id:'PM-qa',tanggal:'2026-10-07',findings:[{id:'F1',files:[oldFile,{name:'new.jpg',viewUrl:'blob:new'}]}]},[{name:'new.jpg',mimeType:'image/jpeg',base64:Buffer.from('new photo').toString('base64')}]));
  assert(edited.ok);assert.equal(edited.attachments.length,2);
  store.commit();
  const second=createStorage(sql,{},'https://omodos.juldigi.workers.dev');const b2=createBackend(second.services).trainingTest;
  assert.equal(b2.getMachinesList_().length,ms.length);assert.equal(b2.getSparepartLokasiMerged_().length,1);
  console.log('SQLite integration: PASS (migration, save/reload, quantity, partial edit, name-only material completion, mixed Patrol attachments).');
 }finally{db.close();fs.rmSync(tmp,{recursive:true,force:true});}
})().catch(e=>{console.error(e);process.exitCode=1;});
