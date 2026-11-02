/* OMODOS_SPAREPART_MASTER_IMPORT_V1
 * Superadmin-only XLSX importer and searchable material catalogue.
 * Imports into a separate Sparepart_Master sheet; never overwrites Logbook,
 * stock movement, ETA, opname, warehouse or existing Sparepart_Lokasi rows.
 */
(function(){
'use strict';
if(window.__OMODOS_SPAREPART_MASTER_IMPORT_V1__)return;
window.__OMODOS_SPAREPART_MASTER_IMPORT_V1__=true;
const MASTER_FIELDS=[
'No','Material Number','Material Description','Harga satuan','MRP Type','Min Stock','Max Stock','Criticality','Actual Pict','Material Group','Long Material Text','Machine Allocation','Storage Bin','Latest PO','Latest Consume','Average Consume by Qty (Per Month)','Vendor Name','Lead Time Delivery by Vendor','Remarks','Stock Qty (SAP)','Base UoM','Nilai Stok (IDR)','Status SAP','Old Material Number','Created Date','Total Consume Qty (YTD)','Total Consume Value (YTD, IDR)','Sumber Data','Status Foto','Cek Key','Tren Konsumsi 12 Bulan'
];
const esc=function(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});};
const byId=function(id){return document.getElementById(id);};
function isSuperadmin(){
 try{return typeof CURRENT_USER!=='undefined'&&CURRENT_USER&&String(CURRENT_USER.role||'').toLowerCase()==='superadmin';}
 catch(e){return false;}
}
function appReady(){const root=byId('app-root');return !!(root&&root.classList.contains('unlocked')&&isSuperadmin());}
function ensureXlsx(){
 if(window.XLSX)return Promise.resolve(window.XLSX);
 if(window.__omodosXlsxLoading)return window.__omodosXlsxLoading;
 window.__omodosXlsxLoading=new Promise(function(resolve,reject){
  const script=document.createElement('script');script.src='/vendor/xlsx.min.js';script.async=true;
  script.onload=function(){if(window.XLSX)resolve(window.XLSX);else reject(new Error('Library XLSX tidak tersedia.'));};
  script.onerror=function(){reject(new Error('Gagal memuat library Excel lokal OMODOS.'));};
  document.head.appendChild(script);
 });
 return window.__omodosXlsxLoading;
}
function ensureUi(){
 if(byId('omodos-sparepart-master-launcher'))return;
 const style=document.createElement('style');
 style.textContent=[
 '#omodos-sparepart-master-launcher{position:fixed;right:18px;bottom:calc(18px + env(safe-area-inset-bottom,0px));z-index:11990;border:1px solid rgba(255,255,255,.22);border-radius:999px;padding:11px 16px;background:var(--blue,#2563eb);color:#fff;font-weight:800;font-size:12px;box-shadow:0 8px 26px rgba(0,0,0,.22);cursor:pointer}',
 '#omodos-sparepart-master-launcher[hidden]{display:none!important}',
 '#omodos-sparepart-master-modal[hidden]{display:none!important}',
 '#omodos-sparepart-master-modal{position:fixed;inset:0;z-index:12020;display:grid;place-items:center;padding:12px;padding-top:calc(12px + env(safe-area-inset-top,0px));padding-bottom:calc(12px + env(safe-area-inset-bottom,0px))}',
 '.om-spm-backdrop{position:absolute;inset:0;background:rgba(3,10,20,.72);backdrop-filter:blur(3px)}',
 '.om-spm-dialog{position:relative;display:flex;flex-direction:column;width:min(920px,100%);max-height:100%;overflow:hidden;border:1px solid var(--line,#dbe3e8);border-radius:16px;background:var(--panel,#fff);color:var(--text,#203040);box-shadow:0 22px 70px rgba(0,0,0,.3)}',
 '.om-spm-head{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;padding:16px;border-bottom:1px solid var(--line,#dbe3e8)}.om-spm-head h2{margin:0;font-size:17px}.om-spm-sub{margin-top:5px;color:var(--text-dim,#64748b);font-size:11px;line-height:1.5}',
 '.om-spm-close{width:34px;height:34px;border:1px solid var(--line,#dbe3e8);border-radius:9px;background:var(--panel-2,#f3f6f8);color:inherit;font-size:22px;cursor:pointer}',
 '.om-spm-body{padding:14px;overflow:auto}.om-spm-import{padding:13px;border:1px solid var(--line,#dbe3e8);border-radius:12px;background:var(--panel-2,rgba(128,128,128,.05))}.om-spm-import label{display:block;font-size:12px;font-weight:800;margin-bottom:7px}.om-spm-import input{display:block;width:100%;font-size:12px}.om-spm-note{font-size:11px;line-height:1.5;color:var(--text-dim,#64748b);margin:8px 0 0}.om-spm-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}.om-spm-actions button{border:1px solid var(--line,#cbd5e1);border-radius:8px;padding:9px 12px;background:var(--blue,#2563eb);color:white;font-weight:700;font-size:12px;cursor:pointer}.om-spm-actions button:disabled{opacity:.55;cursor:wait}.om-spm-status{margin-top:9px;font-size:11px;line-height:1.5;white-space:pre-wrap}.om-spm-search{display:flex;gap:8px;margin:14px 0 8px}.om-spm-search input{flex:1;min-width:0;padding:10px;border:1px solid var(--line,#cbd5e1);border-radius:8px;background:var(--panel);color:inherit}.om-spm-count{font-size:11px;color:var(--text-dim,#64748b);margin-bottom:8px}.om-spm-table-wrap{overflow:auto;max-height:38vh;border:1px solid var(--line,#dbe3e8);border-radius:10px}.om-spm-table{width:100%;border-collapse:collapse;font-size:11px}.om-spm-table th,.om-spm-table td{padding:8px 9px;text-align:left;vertical-align:top;border-bottom:1px solid var(--line,#e2e8f0);white-space:nowrap}.om-spm-table th{position:sticky;top:0;background:var(--panel-2,#f3f6f8);z-index:1}.om-spm-table td:nth-child(2){white-space:normal;min-width:220px}.om-spm-empty{padding:18px;text-align:center;color:var(--text-dim,#64748b);font-size:12px}',
 '@media(max-width:600px){#omodos-sparepart-master-launcher{right:10px;bottom:calc(10px + env(safe-area-inset-bottom,0px));font-size:11px;padding:10px 12px}.om-spm-dialog{border-radius:12px}.om-spm-head{padding:12px}.om-spm-body{padding:10px}.om-spm-table-wrap{max-height:34vh}}'
 ].join('\n');
 document.head.appendChild(style);
 const launch=document.createElement('button');launch.type='button';launch.id='omodos-sparepart-master-launcher';launch.textContent='Master Sparepart';launch.hidden=true;
 const modal=document.createElement('div');modal.id='omodos-sparepart-master-modal';modal.hidden=true;
 modal.innerHTML='<div class="om-spm-backdrop" data-spm-close></div><section class="om-spm-dialog" role="dialog" aria-modal="true" aria-labelledby="om-spm-title"><header class="om-spm-head"><div><h2 id="om-spm-title">Master Database Sparepart</h2><div class="om-spm-sub">Katalog material OMODOS · Primary Key: Material Number SAP</div></div><button type="button" class="om-spm-close" data-spm-close aria-label="Tutup">×</button></header><div class="om-spm-body"><div class="om-spm-import"><label for="om-spm-file">Import workbook Excel (.xlsx)</label><input id="om-spm-file" type="file" accept=".xlsx,.xls"><p class="om-spm-note">Import melakukan upsert berdasarkan Material Number. Kolom kosong tidak menghapus nilai yang sudah tersimpan. Data Logbook, transaksi stok, ETA, opname, dan lokasi operasional tidak ditimpa. Gambar yang tertanam di Excel tidak dipindahkan; URL pada kolom Actual Pict tetap dapat diimpor.</p><div class="om-spm-actions"><button type="button" id="om-spm-import-btn">Validasi & Import Master</button><button type="button" id="om-spm-refresh-btn" style="background:transparent;color:inherit">Muat Ulang Katalog</button></div><div class="om-spm-status" id="om-spm-status" aria-live="polite"></div></div><div class="om-spm-search"><input id="om-spm-search" type="search" placeholder="Cari Material Number, deskripsi, old material, mesin..."></div><div class="om-spm-count" id="om-spm-count">Katalog belum dimuat.</div><div class="om-spm-table-wrap"><table class="om-spm-table"><thead><tr><th>Foto</th><th>Material Number</th><th>Material Description</th><th>UoM</th><th>Harga Satuan</th><th>Stock SAP</th><th>Min / Max</th><th>Machine Allocation</th><th>Storage Bin</th></tr></thead><tbody id="om-spm-rows"><tr><td colspan="9" class="om-spm-empty">Muat katalog untuk melihat material.</td></tr></tbody></table></div></div></section>';
 document.body.append(launch,modal);
 launch.addEventListener('click',function(){modal.hidden=false;loadCatalog();});
 modal.querySelectorAll('[data-spm-close]').forEach(function(el){el.addEventListener('click',function(){modal.hidden=true;});});
 byId('om-spm-refresh-btn').addEventListener('click',loadCatalog);
 byId('om-spm-search').addEventListener('input',renderCatalog);
 byId('om-spm-import-btn').addEventListener('click',importWorkbook);
}
let catalog=[];
async function loadCatalog(){
 const status=byId('om-spm-status');if(status)status.textContent='Memuat katalog dari database OMODOS...';
 try{
  const result=await window.apiPost({action:'sparepartMasterRead'});
  if(!result||result.ok===false)throw new Error(result&&result.error||'Gagal membaca katalog master.');
  catalog=Array.isArray(result.data)?result.data:[];
  renderCatalog();
  if(status)status.textContent='Katalog termuat: '+catalog.length.toLocaleString('id-ID')+' material.';
 }catch(err){if(status)status.textContent='Gagal memuat katalog: '+(err.message||err);console.error('[OMODOS Master Sparepart]',err);}
}
function renderCatalog(){
 const q=String((byId('om-spm-search')||{}).value||'').trim().toLowerCase();
 const filtered=catalog.filter(function(r){
  return [r['Material Number'],r['Material Description'],r['Old Material Number'],r['Machine Allocation'],r['Storage Bin'],r['Material Group']].some(function(v){return String(v||'').toLowerCase().includes(q);});
 });
 const count=byId('om-spm-count');if(count)count.textContent=filtered.length.toLocaleString('id-ID')+' dari '+catalog.length.toLocaleString('id-ID')+' material';
 const tbody=byId('om-spm-rows');if(!tbody)return;
 const rows=filtered.slice(0,300);
 tbody.innerHTML=rows.length?rows.map(function(r){
  const photo=String(r['Actual Pict']||'').trim();
  const photoCell=/^https?:\/\//i.test(photo)?'<img src="'+esc(photo)+'" alt="Foto '+esc(r['Material Number'])+'" loading="lazy" style="width:48px;height:42px;object-fit:contain;border:1px solid var(--line,#dbe3e8);border-radius:6px;background:#fff">':'<span style="color:var(--text-dim,#64748b)">Belum ada URL foto</span>';
  return '<tr><td>'+photoCell+'</td><td>'+esc(r['Material Number'])+'</td><td>'+esc(r['Material Description'])+'</td><td>'+esc(r['Base UoM'])+'</td><td>'+esc(r['Harga satuan'])+'</td><td>'+esc(r['Stock Qty (SAP)'])+'</td><td>'+esc(r['Min Stock'])+' / '+esc(r['Max Stock'])+'</td><td>'+esc(r['Machine Allocation'])+'</td><td>'+esc(r['Storage Bin'])+'</td></tr>';
 }).join(''):'<tr><td colspan="9" class="om-spm-empty">Tidak ada material yang cocok.</td></tr>';
 if(filtered.length>300)count.textContent+=' · tampil 300 pertama, gunakan pencarian untuk mempersempit';
}
function normalizeValue(v){
 if(v instanceof Date)return v.toISOString().slice(0,10);
 if(typeof v==='number'&&!Number.isFinite(v))return '';
 if(v===null||v===undefined)return '';
 return v;
}
async function importWorkbook(){
 const fileInput=byId('om-spm-file'),button=byId('om-spm-import-btn'),status=byId('om-spm-status');
 const file=fileInput&&fileInput.files&&fileInput.files[0];
 if(!file){status.textContent='Pilih file Master Database Sparepart terlebih dahulu.';return;}
 button.disabled=true;
 try{
  status.textContent='Memuat pembaca Excel...';
  const XLSX=await ensureXlsx();
  const buffer=await file.arrayBuffer();
  const workbook=XLSX.read(buffer,{type:'array',cellDates:true});
  const sheet=workbook.Sheets['Master'];
  if(!sheet)throw new Error('Sheet "Master" tidak ditemukan di workbook.');
  const rows=XLSX.utils.sheet_to_json(sheet,{defval:'',raw:true});
  if(!rows.length)throw new Error('Sheet Master tidak memiliki baris material.');
  const headers=Object.keys(rows[0]);
  if(!headers.includes('Material Number')||!headers.includes('Material Description'))throw new Error('Kolom wajib Material Number dan Material Description tidak ditemukan.');
  const seen=new Set(),items=[];let duplicate=0,empty=0;
  rows.forEach(function(source){
   const item={};
   MASTER_FIELDS.forEach(function(field){if(Object.prototype.hasOwnProperty.call(source,field))item[field]=normalizeValue(source[field]);});
   const key=String(item['Material Number']==null?'':item['Material Number']).trim();
   if(!key){empty++;return;}
   if(seen.has(key)){duplicate++;return;}
   seen.add(key);item['Material Number']=key;items.push(item);
  });
  if(!items.length)throw new Error('Tidak ada Material Number valid untuk diimpor.');
  if(!window.confirm('Akan mengimpor '+items.length.toLocaleString('id-ID')+' material dari "'+file.name+'".\n\nMaterial Number menjadi Primary Key. Data yang sudah ada akan diperbarui secara non-destructive; data kosong tidak menghapus nilai tersimpan.\n\nLanjutkan?'))return;
  let inserted=0,updated=0,skipped=0;
  const batchSize=100,totalBatches=Math.ceil(items.length/batchSize);
  for(let i=0;i<items.length;i+=batchSize){
   const batch=items.slice(i,i+batchSize);
   status.textContent='Import batch '+(Math.floor(i/batchSize)+1)+'/'+totalBatches+' · '+Math.min(i+batchSize,items.length)+'/'+items.length+' material...';
   const result=await window.apiPost({action:'importSparepartMasterBatch',items:batch,sourceFile:file.name});
   if(!result||result.ok===false)throw new Error(result&&result.error||'Batch '+(Math.floor(i/batchSize)+1)+' gagal.');
   inserted+=Number(result.inserted)||0;updated+=Number(result.updated)||0;skipped+=Number(result.skipped)||0;
  }
  status.textContent='Import selesai.\nMaterial baru: '+inserted.toLocaleString('id-ID')+'\nMaterial diperbarui: '+updated.toLocaleString('id-ID')+'\nBaris dilewati: '+(skipped+duplicate+empty).toLocaleString('id-ID')+'\nTotal valid di file: '+items.length.toLocaleString('id-ID')+'.';
  catalog=[];await loadCatalog();
 }catch(err){
  status.textContent='Import belum selesai: '+(err&&err.message||err)+'\nJika terhenti di tengah proses, jalankan ulang file yang sama. Proses upsert aman untuk diulang.';
  console.error('[OMODOS Master Sparepart] import error',err);
 }finally{button.disabled=false;}
}
function syncAccess(){
 const button=byId('omodos-sparepart-master-launcher');if(button)button.hidden=!appReady();
}
function boot(){
 ensureUi();syncAccess();
 const observer=new MutationObserver(syncAccess);
 const root=byId('app-root');if(root)observer.observe(root,{attributes:true,attributeFilter:['class']});
 setInterval(syncAccess,1500);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();