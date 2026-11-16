(function(){
'use strict';
if(window.__OMODOS_REPORT_CHANGE_AUDIT_V1__)return;
window.__OMODOS_REPORT_CHANGE_AUDIT_V1__=true;

const selectors=['#select-namaPelapor','#patrol-nama-pelapor','#select-pmPetugas'];
function normalized(value){return String(value==null?'':value).normalize('NFKC').trim().replace(/\s+/g,' ');}
function personnelNames(){
  const names=new Map();
  function add(value){
    const name=normalized(value);
    if(!name||name==='-'||/^(pilih|--|select|lainnya)/i.test(name))return;
    const key=name.toLocaleLowerCase('id-ID');
    if(!names.has(key))names.set(key,name);
  }
  selectors.forEach(selector=>{
    const select=document.querySelector(selector);
    if(!select)return;
    Array.from(select.options||[]).forEach(option=>{
      if(!option.disabled)add(option.value||option.textContent);
    });
  });
  const raw=window.PERSONIL||window.personil;
  const rows=Array.isArray(raw)?raw:(raw&&Array.isArray(raw.data)?raw.data:[]);
  rows.forEach(row=>{
    if(typeof row==='string')add(row);
    else if(row&&typeof row==='object')add(row['Nama Personil']||row.namaPersonil||row.name);
  });
  return Array.from(names.values()).sort((a,b)=>a.localeCompare(b,'id'));
}
function pickPerson(actionKind){
  return new Promise(resolve=>{
    const old=document.querySelector('.omodos-report-change-modal');
    if(old)old.remove();
    let settled=false;
    const finish=value=>{
      if(settled)return;
      settled=true;
      document.removeEventListener('keydown',onKey);
      modal.remove();
      resolve(value);
    };
    const modal=document.createElement('div');
    modal.className='omodos-report-change-modal';
    modal.setAttribute('role','presentation');
    const card=document.createElement('div');
    card.className='omodos-report-change-card';
    card.setAttribute('role','dialog');
    card.setAttribute('aria-modal','true');
    card.setAttribute('aria-labelledby','omodos-report-change-title');
    const title=document.createElement('h3');
    title.id='omodos-report-change-title';
    title.textContent=actionKind==='delete'?'Pilih nama penghapus laporan':'Pilih nama pengubah laporan';
    const description=document.createElement('p');
    description.textContent='Nama personil ini akan disimpan pada laporan. Username akun yang sedang login juga dicatat otomatis untuk audit Superadmin.';
    const label=document.createElement('label');
    label.htmlFor='omodos-report-change-person';
    label.textContent='Nama personil';
    const select=document.createElement('select');
    select.id='omodos-report-change-person';
    select.dataset.changeAuditSelect='1';
    select.required=true;
    const placeholder=document.createElement('option');
    placeholder.value='';
    placeholder.textContent='-- Pilih nama personil --';
    select.appendChild(placeholder);
    const names=personnelNames();
    names.forEach(name=>{
      const option=document.createElement('option');
      option.value=name;
      option.textContent=name;
      select.appendChild(option);
    });
    const hint=document.createElement('div');
    hint.className='omodos-report-change-hint';
    hint.textContent=names.length?'Wajib dipilih sebelum laporan dapat disimpan.':'Daftar personil belum tersedia. Muat ulang aplikasi atau periksa Master Personil.';
    const actions=document.createElement('div');
    actions.className='omodos-report-change-actions';
    const cancel=document.createElement('button');
    cancel.type='button';
    cancel.className='btn btn-ghost';
    cancel.textContent='Batal';
    cancel.dataset.changeAuditCancel='1';
    const confirm=document.createElement('button');
    confirm.type='button';
    confirm.className='btn btn-primary';
    confirm.textContent=actionKind==='delete'?'Lanjutkan penghapusan':'Simpan perubahan';
    confirm.dataset.changeAuditConfirm='1';
    confirm.disabled=names.length===0;
    cancel.addEventListener('click',()=>finish(null));
    confirm.addEventListener('click',()=>{
      const selected=normalized(select.value);
      if(!selected){
        hint.textContent='Pilih nama personil terlebih dahulu.';
        select.focus();
        return;
      }
      finish(selected);
    });
    modal.addEventListener('click',event=>{if(event.target===modal)finish(null);});
    const onKey=event=>{if(event.key==='Escape')finish(null);};
    document.addEventListener('keydown',onKey);
    actions.append(cancel,confirm);
    card.append(title,description,label,select,hint,actions);
    modal.appendChild(card);
    document.body.appendChild(modal);
    select.focus();
  });
}
const style=document.createElement('style');
style.id='omodos-report-change-audit-style';
style.textContent='.omodos-report-change-modal{position:fixed;inset:0;z-index:100100;background:rgba(5,12,22,.68);display:flex;align-items:center;justify-content:center;padding:18px}.omodos-report-change-card{width:min(440px,100%);background:var(--panel,#fff);color:var(--text,#17202a);border:1px solid var(--line,#d7dce2);border-radius:15px;padding:20px;box-shadow:0 18px 60px rgba(0,0,0,.32)}.omodos-report-change-card h3{font-size:18px;margin:0 0 8px}.omodos-report-change-card p{font-size:13px;line-height:1.5;color:var(--text-dim,#657080);margin:0 0 14px}.omodos-report-change-card label{display:block;font-size:13px;font-weight:700;margin:0 0 6px}.omodos-report-change-card select{width:100%;min-height:44px;padding:8px 10px;border:1px solid var(--line,#cbd2da);border-radius:9px;background:var(--panel,#fff);color:inherit}.omodos-report-change-hint{font-size:12px;color:var(--text-dim,#657080);margin:7px 0 15px;min-height:18px}.omodos-report-change-actions{display:flex;justify-content:flex-end;gap:8px;flex-wrap:wrap}.omodos-report-change-actions button{min-height:42px}';
if(!document.getElementById(style.id))document.head.appendChild(style);

function changeKind(payload){
  if(!payload||typeof payload!=='object')return '';
  const action=String(payload.action||'');
  if(action==='updateEntry')return 'edit';
  if(action==='deleteEntry'||action==='deletePredictiveReport')return 'delete';
  if(action==='savePredictiveReport'){
    const report=payload.report||{};
    return report.id||report.ID?'edit':'';
  }
  return '';
}
const originalApiPost=window.apiPost;
if(typeof originalApiPost==='function'&&!originalApiPost.__omodosReportChangeAudit){
  const guardedApiPost=async function(payload){
    const kind=changeKind(payload);
    if(!kind)return originalApiPost.apply(this,arguments);
    const person=await pickPerson(kind);
    if(!person)return {ok:false,error:'NAME_SELECTION_CANCELLED'};
    const args=Array.from(arguments);
    args[0]=Object.assign({},payload,{modifierName:person});
    return originalApiPost.apply(this,args);
  };
  guardedApiPost.__omodosReportChangeAudit=true;
  window.apiPost=guardedApiPost;
}else if(typeof originalApiPost!=='function'){
  console.warn('[OMODOS] Audit nama pengubah tidak aktif: apiPost belum tersedia.');
}
})();