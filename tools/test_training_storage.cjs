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

  // Every configured area saves without machine data and survives reload/edit.
  const areaIds=[];
  for(const [category,areas] of Object.entries(globalThis.OMODOS_WORK_AREAS)){
    for(const area of areas){
      const data={...entry,lokasiPekerjaan:'Area',kategoriArea:category,namaArea:area,kodeMesin:'',namaMesin:'',namaUnit:'stale machine unit',jenisPekerjaan:'Instalasi',sparepartDetail:[],namaMaterial:'',materialNumberSAP:''};
      const added=result(b.addEntry_({entry:data}));assert.equal(added.ok,true,category+' / '+area);areaIds.push(added.id);
      assert.equal(data.kodeMesin,'-');assert.equal(data.namaMesin,'-');
    }
  }
  const badArea=result(b.addEntry_({entry:{...entry,lokasiPekerjaan:'Area',kategoriArea:'Office',namaArea:'Warehouse #1'}}));
  assert.equal(badArea.ok,false);assert.match(badArea.error,/area/);
  const missingArea=result(b.addEntry_({entry:{...entry,lokasiPekerjaan:'Area',kategoriArea:'Office',namaArea:''}}));assert.equal(missingArea.ok,false);
  const updateArea={...entry,id:areaIds[0],kodeMesin:'-',namaMesin:'-',namaMaterial:'',materialNumberSAP:'',sparepartDetail:[],deskripsiMasalah:'Updated area work'};
  delete updateArea.lokasiPekerjaan;delete updateArea.kategoriArea;delete updateArea.namaArea;
  assert.equal(result(b.updateEntry_({entry:updateArea})).ok,true);

  const teamReport={id:'PM-multi-personil',tanggal:'2026-10-08',shift:'Shift 2',petugas:'Person A / Person B / Person C',patrolMode:true,checklist:{Mekanikal:{0:'normal'}},findings:[{id:'F-multi',deskripsi:'Team finding',status:'Open'}]};
  assert.equal(result(b.savePredictiveReport_(teamReport,[])).ok,true);
  store.commit();
  const second=createStorage(sql,{},'https://omodos.juldigi.workers.dev');const b2=createBackend(second.services).trainingTest;
  assert.equal(b2.getMachinesList_().length,ms.length);assert.equal(b2.getSparepartLokasiMerged_().length,1);
  const restored=second.spreadsheet.getSheetByName('Logbook').getDataRange().getValues();
  const h=restored[0], records=restored.slice(1).map(row=>Object.fromEntries(h.map((name,i)=>[name,row[i]])));
  for(const id of areaIds){const r=records.find(r=>r.ID===id);assert.equal(r['Lokasi Pekerjaan'],'Area');assert.equal(r['Kode Mesin'],'-');assert.equal(r['Nama Mesin'],'-');assert.equal(r['Nama Unit'],'-');assert(r['Lokasi/Area'].includes(r['Kategori Area']));}
  assert.equal(records.find(r=>r.ID===areaIds[0])['Deskripsi Masalah'],'Updated area work');
  const patrolRows=second.spreadsheet.getSheetByName('Predictive_Maintenance').getDataRange().getValues();
  const patrol=patrolRows.slice(1).find(r=>r[patrolRows[0].indexOf('ID')]==='PM-multi-personil');
  assert.equal(patrol[patrolRows[0].indexOf('Petugas')],'Person A / Person B / Person C');
  assert.equal(JSON.parse(patrol[patrolRows[0].indexOf('Findings (JSON)')])[0].id,'F-multi');
  console.log('Multi-personil Patrol SQLite: PASS (team and finding survive reload).');
  console.log('Area work SQLite: PASS ('+areaIds.length+' locations, category validation, canonical fields, partial edit and reload).');
  console.log('SQLite integration: PASS (migration, save/reload, quantity, partial edit, name-only material completion, mixed Patrol attachments).');
 }finally{db.close();fs.rmSync(tmp,{recursive:true,force:true});}
})().catch(e=>{console.error(e);process.exitCode=1;});

