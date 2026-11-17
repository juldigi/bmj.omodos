(function(){
'use strict';
if(window.__OMODOS_DELETED_REPORTS_V1__)return;
window.__OMODOS_DELETED_REPORTS_V1__=true;
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function authorized(){try{if(typeof isSettingAuthed==='function')return !!isSettingAuthed();return typeof CURRENT_USER!=='undefined'&&!!CURRENT_USER&&String(CURRENT_USER.role||'').toLowerCase()==='superadmin';}catch(e){return false;}}
function fmt(v){if(!v)return '-';var d=new Date(v);return Number.isNaN(d.getTime())?String(v):d.toLocaleString('id-ID',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'});}
function init(){
 var tabs=document.getElementById('setting-tabs'),users=document.getElementById('setting-tab-panel-users');if(!tabs||!users||document.getElementById('setting-tab-panel-deleted-reports'))return;
 var roleTab=tabs.querySelector('[data-tab="roles"]'),tab=document.createElement('button');tab.type='button';tab.className='setting-tab-btn';tab.dataset.tab='deleted-reports';tab.innerHTML='<i class="ph-bold ph-trash"></i> Sampah Laporan';
 if(roleTab)tabs.insertBefore(tab,roleTab);else tabs.appendChild(tab);
 var panel=document.createElement('div');panel.className='setting-tab-panel';panel.id='setting-tab-panel-deleted-reports';
 panel.innerHTML='<div class="card" style="margin-bottom:18px;"><div style="display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap;"><div><div class="section-title"><i class="ph-bold ph-trash"></i> Arsip Laporan Dihapus</div><div class="sub">Logbook dan Patrol yang dihapus tetap tersimpan di database. Pulihkan laporan atau hapus permanen dari sini.</div></div><button type="button" class="btn btn-sm btn-ghost" id="btn-deleted-reports-refresh"><i class="ph-bold ph-arrows-clockwise"></i> Muat Ulang</button></div><div id="deleted-reports-status" class="sub" style="margin:12px 0;">Belum dimuat.</div><div id="deleted-reports-list" class="omodos-deleted-reports-list"></div></div>';
 users.insertAdjacentElement('afterend',panel);
 var style=document.createElement('style');style.id='omodos-deleted-reports-style';style.textContent='.omodos-deleted-reports-list{display:grid;gap:10px}.omodos-deleted-report{border:1px solid var(--line);background:var(--panel-2);border-radius:11px;padding:13px;display:grid;gap:9px}.omodos-deleted-report-head{display:flex;justify-content:space-between;gap:8px;align-items:center;flex-wrap:wrap}.omodos-deleted-report-title{font-weight:750;font-size:14px}.omodos-deleted-report-meta{font-size:12px;color:var(--text-dim);line-height:1.55}.omodos-deleted-report-summary{font-size:12.5px;line-height:1.5}.omodos-deleted-report-actions{display:flex;gap:8px;flex-wrap:wrap}.omodos-deleted-report-actions button{min-height:38px}.omodos-deleted-empty{padding:24px;text-align:center;color:var(--text-dim);border:1px dashed var(--line);border-radius:10px}';
 if(!document.getElementById(style.id))document.head.appendChild(style);
 tab.addEventListener('click',function(){setTimeout(load,0);});
 document.addEventListener('click',function(e){if(e.target.closest('#btn-deleted-reports-refresh'))load();});
 panel.addEventListener('click',archiveAction);
}
async function load(){
 var status=document.getElementById('deleted-reports-status'),list=document.getElementById('deleted-reports-list');if(!status||!list)return;
 if(!authorized()){
  status.textContent='Arsip hanya dapat dibuka oleh Superadmin.';
  list.innerHTML='<button type="button" class="btn btn-primary btn-sm" id="btn-deleted-reports-verify">Verifikasi Akses Superadmin</button>';
  var verify=document.getElementById('btn-deleted-reports-verify');
  if(verify)verify.addEventListener('click',function(){if(typeof showSettingLoginModal==='function')showSettingLoginModal(function(){load();});else status.textContent='Silakan masuk dengan akun Superadmin untuk membuka arsip.';});
  return;
 }
 status.textContent='Memuat arsip laporan...';list.innerHTML='';
 try{
  if(typeof window.apiGet!=='function')throw new Error('Koneksi API belum siap.');
  var rows=await window.apiGet('deletedReports',{fresh:'1',_ts:String(Date.now())});rows=Array.isArray(rows)?rows:[];
  status.textContent=rows.length+' laporan berada di arsip penghapusan.';
  if(!rows.length){list.innerHTML='<div class="omodos-deleted-empty">Belum ada laporan yang dihapus.</div>';return;}
  rows.sort(function(a,b){return new Date(b.deletedAt||0)-new Date(a.deletedAt||0);});
  list.innerHTML=rows.map(function(r){
   var title=r.type==='Patrol'?'Laporan Patrol':'Laporan Logbook';
   return '<article class="omodos-deleted-report"><div class="omodos-deleted-report-head"><div class="omodos-deleted-report-title">'+esc(title)+' · '+esc(r.id)+'</div><span class="badge badge-warning">Dihapus</span></div>'+
   '<div class="omodos-deleted-report-meta"><b>Mesin/Area:</b> '+esc(r.machine||'-')+' · <b>Tanggal laporan:</b> '+esc(fmt(r.date))+'<br><b>Pelapor/Petugas:</b> '+esc(r.reporter||'-')+'<br><b>Dihapus pada:</b> '+esc(fmt(r.deletedAt))+'<br><b>Nama penghapus:</b> '+esc(r.deletedBy||'-')+' · <b>Akun:</b> '+esc(r.deletedByAccount||'-')+'</div>'+
   '<div class="omodos-deleted-report-summary">'+esc(r.summary||'Tidak ada ringkasan laporan.')+'</div><div class="omodos-deleted-report-actions">'+
   '<button type="button" class="btn btn-sm btn-primary" data-archive-action="restore" data-report-type="'+esc(r.type)+'" data-report-id="'+esc(r.id)+'"><i class="ph-bold ph-arrow-counter-clockwise"></i> Pulihkan</button>'+
   '<button type="button" class="btn btn-sm btn-ghost" data-archive-action="permanent" data-report-type="'+esc(r.type)+'" data-report-id="'+esc(r.id)+'"><i class="ph-bold ph-trash"></i> Hapus Permanen</button></div></article>';
  }).join('');
 }catch(e){status.textContent='Gagal memuat arsip: '+String(e&&e.message||e);list.innerHTML='';}
}
async function archiveAction(e){
 var btn=e.target.closest('[data-archive-action]');if(!btn)return;
 if(!authorized()){if(typeof showSettingLoginModal==='function')showSettingLoginModal(function(){load();});return;}
 var action=btn.dataset.archiveAction,id=btn.dataset.reportId,type=btn.dataset.reportType;if(!id||!type)return;
 if(action==='permanent'&&!confirm('Hapus permanen '+type+' '+id+'? Record tidak dapat dipulihkan kembali.'))return;
 if(action!=='restore'&&action!=='permanent')return;
 btn.disabled=true;var old=btn.textContent;btn.textContent=action==='restore'?'Memulihkan...':'Menghapus permanen...';
 try{
  if(typeof window.apiPost!=='function')throw new Error('Koneksi API belum siap.');
  await window.apiPost({action:action==='restore'?'restoreDeletedReport':'permanentlyDeleteReport',type:type,id:id,transactionId:'archive-'+action+'-'+type+'-'+id+'-'+Date.now()});
  if(typeof window.loadAll==='function')await window.loadAll();
  await load();
 }catch(error){btn.disabled=false;btn.textContent=old;alert('Tindakan gagal: '+String(error&&error.message||error));}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();