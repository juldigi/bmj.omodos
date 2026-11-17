(function(){
'use strict';
if(window.__OMODOS_REPORT_CHANGE_AUDIT_V2__)return;
window.__OMODOS_REPORT_CHANGE_AUDIT_V1__=true;
window.__OMODOS_REPORT_CHANGE_AUDIT_V2__=true;
function normalized(v){return String(v==null?'':v).normalize('NFKC').trim().replace(/\s+/g,' ');}
function addNames(map,rows){(Array.isArray(rows)?rows:[]).forEach(function(row){
 var v=typeof row==='string'?row:(row&&(row['Nama Personil']||row.namaPersonil||row.name)),n=normalized(v);
 if(!n||n==='-'||/^(pilih|--|select|lainnya)/i.test(n))return;
 var k=n.toLocaleLowerCase('id-ID');if(!map.has(k))map.set(k,n);
});}
async function personnelNames(){
 var names=new Map();
 // PERSONIL adalah global lexical pada halaman utama, tidak selalu window.PERSONIL.
 try{if(typeof PERSONIL!=='undefined')addNames(names,PERSONIL);}catch(error){}
 if(names.size)return Array.from(names.values()).sort(function(a,b){return a.localeCompare(b,'id');});
 // Jika data bootstrap belum tersedia, ambil sumber Master Personil yang sama dengan validasi backend.
 try{
  if(typeof window.apiGet==='function'){
   var response=await window.apiGet('personil',{fresh:'1',_ts:String(Date.now())});
   var rows=Array.isArray(response)?response:(response&&Array.isArray(response.data)?response.data:[]);
   addNames(names,rows);
  }
 }catch(error){console.warn('[OMODOS] Master Personil belum dapat dimuat dari server.',error);}
 if(names.size)return Array.from(names.values()).sort(function(a,b){return a.localeCompare(b,'id');});
 addNames(names,window.PERSONIL||window.personil);
 ['#select-namaPelapor','#patrol-nama-pelapor','#select-pmPetugas'].forEach(function(sel){
  var el=document.querySelector(sel);if(el)Array.from(el.options||[]).forEach(function(o){if(!o.disabled)addNames(names,[o.value||o.textContent]);});
 });
 return Array.from(names.values()).sort(function(a,b){return a.localeCompare(b,'id');});
}
function clearSelect(sel){while(sel.firstChild)sel.removeChild(sel.firstChild);}
function option(sel,value,label){var o=document.createElement('option');o.value=value;o.textContent=label||value;sel.appendChild(o);}
async function fillSelect(sel,hint){
 if(!sel)return [];sel.disabled=true;clearSelect(sel);option(sel,'','-- Memuat Master Personil --');
 var names=await personnelNames();clearSelect(sel);option(sel,'','-- Pilih nama personil --');
 names.forEach(function(n){option(sel,n,n);});sel.disabled=!names.length;
 if(hint)hint.textContent=names.length?'Wajib dipilih sebelum perubahan dapat disimpan.':'Daftar Master Personil belum tersedia. Periksa koneksi aplikasi atau Master Personil.';
 return names;
}
function pickPerson(kind){return new Promise(function(resolve){
 var old=document.querySelector('.omodos-report-change-modal');if(old)old.remove();
 var done=false,modal=document.createElement('div');modal.className='omodos-report-change-modal';modal.setAttribute('role','presentation');
 var finish=function(v){if(done)return;done=true;document.removeEventListener('keydown',onKey);modal.remove();resolve(v);};
 var card=document.createElement('div');card.className='omodos-report-change-card';card.setAttribute('role','dialog');card.setAttribute('aria-modal','true');card.setAttribute('aria-labelledby','omodos-report-change-title');
 var title=document.createElement('h3');title.id='omodos-report-change-title';title.textContent=kind==='delete'?'Pilih nama penghapus laporan':'Pilih nama pengubah laporan';
 var desc=document.createElement('p');desc.textContent='Pilih nama dari Master Personil. Username akun yang sedang login juga dicatat otomatis untuk audit Superadmin.';
 var label=document.createElement('label');label.htmlFor='omodos-report-change-person';label.textContent='Nama personil';
 var sel=document.createElement('select');sel.id='omodos-report-change-person';sel.dataset.changeAuditSelect='1';sel.required=true;
 var hint=document.createElement('div');hint.className='omodos-report-change-hint';hint.textContent='Memuat daftar Master Personil...';
 var actions=document.createElement('div');actions.className='omodos-report-change-actions';
 var cancel=document.createElement('button');cancel.type='button';cancel.className='btn btn-ghost';cancel.textContent='Batal';cancel.dataset.changeAuditCancel='1';
 var confirm=document.createElement('button');confirm.type='button';confirm.className='btn btn-primary';confirm.textContent=kind==='delete'?'Lanjutkan penghapusan':'Simpan perubahan';confirm.dataset.changeAuditConfirm='1';confirm.disabled=true;
 cancel.addEventListener('click',function(){finish(null);});
 confirm.addEventListener('click',function(){var v=normalized(sel.value);if(!v){hint.textContent='Pilih nama personil terlebih dahulu.';sel.focus();return;}finish(v);});
 modal.addEventListener('click',function(e){if(e.target===modal)finish(null);});
 var onKey=function(e){if(e.key==='Escape')finish(null);};document.addEventListener('keydown',onKey);
 actions.append(cancel,confirm);card.append(title,desc,label,sel,hint,actions);modal.appendChild(card);document.body.appendChild(modal);
 fillSelect(sel,hint).then(function(names){confirm.disabled=!names.length;if(names.length)sel.focus();}).catch(function(){hint.textContent='Gagal memuat Master Personil. Coba kembali.';});
});}
function mountModifierField(){
 var holder=document.getElementById('entry-view-mode');if(!holder||!document.getElementById('btn-save-entry-edit'))return;
 var old=document.getElementById('edit-modifier-name-wrap');if(old)old.remove();
 var wrap=document.createElement('div');wrap.className='field omodos-modifier-field';wrap.id='edit-modifier-name-wrap';
 var label=document.createElement('label');label.htmlFor='edit-modifier-name';label.textContent='Nama Pengubah / Modifier Name *';
 var sel=document.createElement('select');sel.id='edit-modifier-name';sel.required=true;sel.setAttribute('aria-required','true');
 var hint=document.createElement('div');hint.className='omodos-modifier-hint';hint.setAttribute('aria-live','polite');hint.textContent='Memuat Master Personil...';
 wrap.append(label,sel,hint);
 var actions=document.getElementById('btn-save-entry-edit').parentElement;
 if(actions&&actions.parentElement===holder)actions.insertAdjacentElement('beforebegin',wrap);else holder.appendChild(wrap);
 fillSelect(sel,hint).catch(function(e){hint.textContent='Gagal memuat Master Personil: '+String(e&&e.message||e);});
}
function wrapEditRenderer(){
 if(typeof window.renderEntryEditForm!=='function'||window.renderEntryEditForm.__omodosModifierFieldV2)return false;
 var original=window.renderEntryEditForm;
 var wrapped=function(entry){var result=original.apply(this,arguments);try{mountModifierField();}catch(e){console.warn('[OMODOS] Modifier Name field gagal dipasang.',e);}return result;};
 wrapped.__omodosModifierFieldV2=true;window.renderEntryEditForm=wrapped;return true;
}
var style=document.createElement('style');style.id='omodos-report-change-audit-style';
style.textContent='.omodos-report-change-modal{position:fixed;inset:0;z-index:100100;background:rgba(5,12,22,.68);display:flex;align-items:center;justify-content:center;padding:18px}.omodos-report-change-card{width:min(440px,100%);background:var(--panel,#fff);color:var(--text,#17202a);border:1px solid var(--line,#d7dce2);border-radius:15px;padding:20px;box-shadow:0 18px 60px rgba(0,0,0,.32)}.omodos-report-change-card h3{font-size:18px;margin:0 0 8px}.omodos-report-change-card p{font-size:13px;line-height:1.5;color:var(--text-dim,#657080);margin:0 0 14px}.omodos-report-change-card label,.omodos-modifier-field label{display:block;font-size:13px;font-weight:700;margin:0 0 6px}.omodos-report-change-card select,.omodos-modifier-field select{width:100%;min-height:44px;padding:8px 10px;border:1px solid var(--line,#cbd2da);border-radius:9px;background:var(--panel,#fff);color:inherit}.omodos-report-change-hint,.omodos-modifier-hint{font-size:12px;color:var(--text-dim,#657080);margin:7px 0 12px;min-height:18px}.omodos-report-change-actions{display:flex;justify-content:flex-end;gap:8px;flex-wrap:wrap}.omodos-report-change-actions button{min-height:42px}.omodos-modifier-field{grid-column:1/-1;margin-top:10px;padding:12px;border:1px solid var(--line,#d7dce2);border-radius:10px;background:var(--panel-2,rgba(127,127,127,.06))}';
if(!document.getElementById(style.id))document.head.appendChild(style);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wrapEditRenderer);else wrapEditRenderer();
function changeKind(p){if(!p||typeof p!=='object')return '';var a=String(p.action||'');if(a==='updateEntry')return 'edit';if(a==='deleteEntry'||a==='deletePredictiveReport')return 'delete';if(a==='savePredictiveReport'){var r=p.report||{};return r.id||r.ID?'edit':'';}return '';}
var originalApiPost=window.apiPost;
if(typeof originalApiPost==='function'&&!originalApiPost.__omodosReportChangeAuditV2){
 var guardedApiPost=async function(payload){
  var kind=changeKind(payload);if(!kind)return originalApiPost.apply(this,arguments);
  var inline=kind==='edit'?document.getElementById('edit-modifier-name'):null;
  var person=normalized(payload.modifierName||(inline&&inline.value));if(!person)person=await pickPerson(kind);
  if(!person){if(inline)inline.focus();return {ok:false,error:'NAME_SELECTION_CANCELLED'};}
  if(inline)inline.value=person;
  var args=Array.from(arguments),prepared=Object.assign({},payload,{modifierName:person});
  if(!prepared.id){var nested=payload.entry||payload.data||{},report=payload.report||{};prepared.id=payload.ID||nested.ID||nested.id||report.ID||report.id||'';}
  args[0]=prepared;return originalApiPost.apply(this,args);
 };
 guardedApiPost.__omodosReportChangeAudit=true;guardedApiPost.__omodosReportChangeAuditV2=true;window.apiPost=guardedApiPost;
}else if(typeof originalApiPost!=='function')console.warn('[OMODOS] Audit nama pengubah tidak aktif: apiPost belum tersedia.');
})();