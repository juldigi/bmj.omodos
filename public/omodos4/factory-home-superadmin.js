(function(){
'use strict';
if(window.__OMODOS_FACTORY_HOME_MODULE__)return;
window.__OMODOS_FACTORY_HOME_MODULE__=true;
const ROOT_ID='omodos-superadmin-factory-home',VIEW_CLASS='omodos-superadmin-factory-home',MODE_STORAGE_KEY='omodos.superadmin.home.mode.v1',TWIN_ORIGIN='https://digitaltwin.juldigi.workers.dev',TWIN_URL=TWIN_ORIGIN+'/?embed=omodos-status';
let homeView=null,iframe=null,styleNode=null,lastFingerprint='',lastSendAt=0,mode=readMode();
function currentUser(){try{if(typeof CURRENT_USER!=='undefined'&&CURRENT_USER)return CURRENT_USER;}catch(e){}return window.CURRENT_USER||window.currentUser||null;}
function isSuperadmin(){const u=currentUser(),role=String(u&&(u.role||u.Role||u.roleName||u.role_name||u.level)||'').toLowerCase().replace(/[\s_-]+/g,'');return role==='superadmin';}
function normalizeKey(v){return String(v==null?'':v).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'');}
function pick(row,names){if(!row||typeof row!=='object')return '';const wanted=new Set(names.map(normalizeKey));for(const [key,value] of Object.entries(row))if(wanted.has(normalizeKey(key))&&value!==null&&value!==undefined&&String(value).trim()!=='')return value;return '';}
function validCode(v){const s=String(v||'').trim();return s&&!['-','—','n/a','na','null','undefined','belum ada'].includes(s.toLowerCase())?s:'';}
function parseDate(value){
  if(value instanceof Date&&!Number.isNaN(value.getTime()))return value.toISOString();
  const raw=String(value==null?'':value).trim();if(!raw)return '';
  let date=new Date(raw);
  if(Number.isNaN(date.getTime())){const m=raw.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/);if(m)date=new Date(Number(m[3]),Number(m[2])-1,Number(m[1]),Number(m[4]||0),Number(m[5]||0),Number(m[6]||0));}
  return Number.isNaN(date.getTime())?'':date.toISOString();
}
function readEntries(){try{if(typeof ENTRIES!=='undefined'&&Array.isArray(ENTRIES))return ENTRIES;}catch(e){}return Array.isArray(window.ENTRIES)?window.ENTRIES:[];}
function latestRecords(){
  // Reuse the exact machine-status calculation shown on OMODOS Home so this
  // viewer includes the latest Logbook OR Patrol record and cannot drift from
  // the dashboard's severity rules. Only send machine-level status fields;
  // never send free-text descriptions, employee names, photos, or RCA notes.
  let master=[];
  try{if(typeof MACHINES!=='undefined'&&Array.isArray(MACHINES))master=MACHINES;}catch(e){}
  if(!master.length&&Array.isArray(window.MACHINES))master=window.MACHINES;
  if(!master.length)return [];
  const labelFor=key=>({
    kritikal:'Kritikal',
    perhatian:'Perlu Perhatian',
    normal:'Normal',
    none:'Belum Ada Data'
  }[key]||'Belum Ada Data');
  const codeCounts=new Map();
  master.forEach(row=>{
    const code=validCode(pick(row,['Kode Mesin','KodeMesin','Machine Code','MachineCode','Kode']));
    if(!code)return;
    const key=normalizeKey(code);
    codeCounts.set(key,(codeCounts.get(key)||0)+1);
  });
  const records=[];
  master.forEach((row,index)=>{
    const code=validCode(pick(row,['Kode Mesin','KodeMesin','Machine Code','MachineCode','Kode']));
    const name=String(pick(row,['Nama Mesin','NamaMesin','Machine Name','MachineName','Machine','Mesin','Nama Aset'])||'').trim();
    if(!code&&!name)return;
    // The OMODOS status helper gives code matches precedence over name. When a
    // master code is duplicated, force exact machine-name matching so two
    // different assets do not inherit the same machine's latest status.
    const snapshotCode=code&&codeCounts.get(normalizeKey(code))===1?code:'';
    let snapshot=null;
    try{
      if(typeof machineLatestStatusSnapshot_==='function')
        snapshot=machineLatestStatusSnapshot_({kode:snapshotCode,nama:name});
    }catch(e){}
    const key=String(snapshot?.key||'none');
    const timestamp=Number(snapshot?.ts);
    const date=Number.isFinite(timestamp)&&timestamp>0?new Date(timestamp).toISOString():'';
    records.push({
      code,
      name,
      status:labelFor(key),
      date,
      index
    });
  });
  return records;
}
function makeStyles(){
  if(styleNode)return;
  styleNode=document.createElement('style');styleNode.id='omodos-superadmin-factory-home-style';
  styleNode.textContent=[
    '.view.'+VIEW_CLASS+'{position:relative!important;overflow:hidden!important;padding:0!important;min-height:0!important}',
    '.view.'+VIEW_CLASS+'>:not(#'+ROOT_ID+'){display:none!important}',
    '#'+ROOT_ID+'{box-sizing:border-box;display:block;width:100%;height:auto;min-height:0;max-height:none;padding:0;margin:0 0 12px;overflow:visible;color:#173348}',
    '#'+ROOT_ID+'.mode-3d{display:flex;flex-direction:column;gap:8px;height:calc(100dvh - 160px);min-height:440px;max-height:none;margin:0 auto;overflow:hidden}',
    '#'+ROOT_ID+',#'+ROOT_ID+' *{box-sizing:border-box}',
    '#'+ROOT_ID+' .ofh-mode-switch{display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:54px;padding:8px 11px;border:1px solid #d5e0e7;border-radius:12px;background:#f8fbfd;color:#244154}',
    '#'+ROOT_ID+' .ofh-mode-label{min-width:0}',
    '#'+ROOT_ID+' .ofh-mode-label strong{display:block;font-size:12px;font-weight:850;line-height:1.25}',
    '#'+ROOT_ID+' .ofh-mode-label small{display:block;margin-top:3px;color:#627888;font-size:10px;line-height:1.25}',
    '#'+ROOT_ID+' .ofh-mode-options{display:inline-flex;align-items:center;gap:3px;flex:0 0 auto;padding:3px;border:1px solid #cfdae2;border-radius:999px;background:#eaf0f4}',
    '#'+ROOT_ID+' .ofh-mode-button{min-width:66px;padding:7px 11px;border:0;border-radius:999px;background:transparent;color:#526b7c;font:800 10px/1.1 system-ui,sans-serif;cursor:pointer;touch-action:manipulation}',
    '#'+ROOT_ID+' .ofh-mode-button[aria-pressed="true"]{background:#163e58;color:#fff;box-shadow:0 1px 4px rgba(17,46,64,.2)}',
    '#'+ROOT_ID+' .ofh-mode-button:focus-visible{outline:2px solid #1383bf;outline-offset:2px}',
    '#'+ROOT_ID+' .ofh-3d-content{display:none;flex:1 1 auto;flex-direction:column;gap:8px;min-height:0;overflow:hidden}',
    '#'+ROOT_ID+'.mode-3d .ofh-3d-content{display:flex}',
    '#'+ROOT_ID+' .ofh-heading{display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:46px;flex:0 0 auto;padding:6px 2px}',
    '#'+ROOT_ID+' .ofh-title{min-width:0}',
    '#'+ROOT_ID+' .ofh-eyebrow{display:block;margin-bottom:2px;color:#547083;font-size:10px;font-weight:800;letter-spacing:.12em;text-transform:uppercase}',
    '#'+ROOT_ID+' h2{margin:0;color:#173348;font-size:clamp(17px,2vw,23px);font-weight:800;line-height:1.15}',
  ].join('\n');
  document.head.appendChild(styleNode);
}
function cleanup(){document.querySelectorAll('#'+ROOT_ID).forEach(node=>node.remove());document.querySelectorAll('.'+VIEW_CLASS).forEach(node=>node.classList.remove(VIEW_CLASS));document.documentElement.classList.remove(VIEW_CLASS);homeView=null;iframe=null;lastFingerprint='';lastSendAt=0;}
function findHomeView(){const marker=document.getElementById('home-smart-resume');if(!marker)return null;return marker.closest('.view')||marker.closest('[data-view]')||marker.parentElement;}
function createRoot(view){
  const root=document.createElement('section');root.id=ROOT_ID;root.setAttribute('aria-label','Factory Overview — status mesin khusus Superadmin');
  root.innerHTML='<div class="ofh-mode-switch"><div class="ofh-mode-label"><strong>Tampilan Beranda</strong><small>Pilihan khusus Superadmin</small></div><div class="ofh-mode-options" role="group" aria-label="Pilih versi beranda"><button type="button" class="ofh-mode-button" data-home-mode="original" aria-pressed="false">Original</button><button type="button" class="ofh-mode-button" data-home-mode="3d" aria-pressed="false">3D</button></div></div><div class="ofh-3d-content"><header class="ofh-heading"><div class="ofh-title"><span class="ofh-eyebrow">OMODOS · SUPERADMIN</span><h2>Factory Overview</h2><p class="ofh-subtitle">Status seluruh mesin BMJ dalam visualisasi 3D.</p></div><span class="ofh-tag">VIEW ONLY</span></header><div class="ofh-stage"><iframe title="Visualisasi 3D status mesin BMJ" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="fullscreen"></iframe><div class="ofh-frame-state"><strong>Menyiapkan viewer 3D…</strong><span>Model dan status mesin akan ditampilkan saat mode pemantauan siap.</span></div></div><p class="ofh-footnote">Status mengikuti sumber Logbook atau Patrol terbaru yang dipakai pada beranda OMODOS. Bukan telemetry sensor langsung.</p></div>';
  const topbar=view.querySelector(':scope > .topbar');
  if(topbar&&topbar.parentNode)topbar.parentNode.insertBefore(root,topbar.nextSibling);else view.prepend(root);
  return root;
}
function sendStatuses(force){
  if(!isSuperadmin()||mode!=='3d')return;const root=document.getElementById(ROOT_ID);if(!root)return;const frame=root.querySelector('iframe');if(!frame||!frame.contentWindow||frame.getAttribute('src')!==TWIN_URL)return;
  const now=Date.now();if(!force&&now-lastSendAt<5000)return;const records=latestRecords();
  const fingerprint=records.map(r=>[r.code,r.name,r.status,r.date,r.index].join('|')).join('~');
  if(!force&&fingerprint===lastFingerprint&&now-lastSendAt<18000)return;
  lastFingerprint=fingerprint;lastSendAt=now;
  try{frame.contentWindow.postMessage({type:'OMODOS_FACTORY_STATUS',version:1,sentAt:new Date().toISOString(),records},TWIN_ORIGIN);}catch(e){}
}
function readMode(){try{const saved=localStorage.getItem(MODE_STORAGE_KEY);if(saved==='original'||saved==='3d')return saved;}catch(e){}return '3d';}
function applyMode(next,persist=true){
  if(next!=='original'&&next!=='3d')return;
  mode=next;if(persist){try{localStorage.setItem(MODE_STORAGE_KEY,mode);}catch(e){}}
  const root=document.getElementById(ROOT_ID);if(!root)return;
  root.classList.toggle('mode-original',mode==='original');root.classList.toggle('mode-3d',mode==='3d');
  if(homeView)homeView.classList.toggle(VIEW_CLASS,mode==='3d');
  document.documentElement.classList.toggle(VIEW_CLASS,mode==='3d');
  root.querySelectorAll('[data-home-mode]').forEach(button=>{const active=button.dataset.homeMode===mode;button.setAttribute('aria-pressed',active?'true':'false');});
  const frame=root.querySelector('iframe'),stage=root.querySelector('.ofh-stage');
  if(mode==='3d'){
    if(frame&&frame.getAttribute('src')!==TWIN_URL){if(stage)stage.classList.remove('ready');frame.setAttribute('src',TWIN_URL);}
    sendStatuses(true);
  }else{
    if(frame&&frame.hasAttribute('src'))frame.removeAttribute('src');
    if(stage)stage.classList.remove('ready');
    lastFingerprint='';lastSendAt=0;
  }
}
function sync(){
  if(!isSuperadmin()){cleanup();return;}
  const view=findHomeView();if(!view)return;
  if(homeView!==view||!document.getElementById(ROOT_ID)){
    cleanup();homeView=view;makeStyles();
    const root=createRoot(view);iframe=root.querySelector('iframe');
    root.querySelectorAll('[data-home-mode]').forEach(button=>button.addEventListener('click',()=>applyMode(button.dataset.homeMode,true)));
    iframe.addEventListener('load',()=>sendStatuses(true));
    iframe.addEventListener('error',()=>{const state=root.querySelector('.ofh-frame-state');if(state)state.innerHTML='<strong>Viewer 3D belum dapat dimuat</strong><span>Fungsi OMODOS lainnya tetap tersedia. Coba muat ulang beranda beberapa saat lagi.</span>';const foot=root.querySelector('.ofh-footnote');if(foot)foot.textContent='Viewer 3D belum siap; fitur OMODOS lain tetap dapat digunakan.';});
  }else{homeView=view;}
  const root=document.getElementById(ROOT_ID);if(root&&root.querySelector('iframe')!==iframe)iframe=root.querySelector('iframe');
  applyMode(mode,false);sendStatuses(false);
}
window.OMODOS_FACTORY_HOME_SYNC=sync;
window.addEventListener('message',event=>{if(event.origin!==TWIN_ORIGIN||!iframe||event.source!==iframe.contentWindow)return;if(event.data?.type==='OMODOS_FACTORY_STATUS_READY'&&event.data?.version===1){const stage=document.getElementById(ROOT_ID)?.querySelector('.ofh-stage');if(stage)stage.classList.add('ready');sendStatuses(true);}});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)sendStatuses(true);});
document.addEventListener('DOMContentLoaded',sync);setInterval(sync,1200);sync();
})();