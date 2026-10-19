(function(){
'use strict';
if(window.__OMODOS_FACTORY_HOME_MODULE__)return;
window.__OMODOS_FACTORY_HOME_MODULE__=true;
const ROOT_ID='omodos-superadmin-factory-home',VIEW_CLASS='omodos-superadmin-factory-home',TWIN_ORIGIN='https://digitaltwin.juldigi.workers.dev',TWIN_URL=TWIN_ORIGIN+'/?embed=omodos-status';
let homeView=null,iframe=null,styleNode=null,lastFingerprint='',lastSendAt=0,currentMode='3d';
const MODE_STORAGE_PREFIX='omodos.factoryHomeMode.v1.';
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

function modeStorageKey_(){
  const user=currentUser()||{};
  return MODE_STORAGE_PREFIX+normalizeKey(user.username||user.userName||user.email||'superadmin');
}
function readSavedMode_(){
  try{return localStorage.getItem(modeStorageKey_())==='original'?'original':'3d';}
  catch(e){return '3d';}
}
function setHomeMode_(mode,persist){
  currentMode=mode==='original'?'original':'3d';
  const show3d=currentMode==='3d',root=document.getElementById(ROOT_ID),view=homeView;
  if(view)view.classList.toggle(VIEW_CLASS,show3d);
  document.documentElement.classList.toggle(VIEW_CLASS,show3d);
  if(root){
    root.classList.toggle('ofh-original-mode',!show3d);
    const title=root.querySelector('h2'),subtitle=root.querySelector('.ofh-subtitle');
    if(title)title.textContent=show3d?'Factory Overview':'Beranda Original';
    if(subtitle)subtitle.textContent=show3d?'Status seluruh mesin BMJ dalam visualisasi 3D.':'Beranda reguler OMODOS. Pilih Factory 3D untuk kembali ke visualisasi pabrik.';
    root.querySelectorAll('[data-ofh-mode]').forEach(button=>{
      const active=button.dataset.ofhMode===currentMode;
      button.setAttribute('aria-pressed',active?'true':'false');
    });
    const stage=root.querySelector('.ofh-stage');
    if(!show3d&&stage)stage.classList.remove('ready');
  }
  if(persist&&isSuperadmin()){
    try{localStorage.setItem(modeStorageKey_(),currentMode);}catch(e){}
  }
  const frame=root?.querySelector('iframe');
  if(frame){
    const src=frame.getAttribute('src');
    if(show3d&&src!==TWIN_URL){
      root.querySelector('.ofh-stage')?.classList.remove('ready');
      frame.setAttribute('src',TWIN_URL);
    }else if(!show3d&&src){
      frame.removeAttribute('src');
    }
  }
  if(show3d&&persist)sendStatuses(true);
}

function makeStyles(){
  if(styleNode)return;
  styleNode=document.createElement('style');styleNode.id='omodos-superadmin-factory-home-style';
  styleNode.textContent=[
    '.view.'+VIEW_CLASS+'{position:relative!important;overflow:hidden!important;padding:0!important;min-height:0!important}',
    '.view.'+VIEW_CLASS+'>:not(#'+ROOT_ID+'){display:none!important}',
    '#'+ROOT_ID+'{box-sizing:border-box;display:flex;flex-direction:column;gap:8px;width:100%;height:calc(100dvh - 160px);min-height:440px;max-height:none;padding:0;margin:0 auto;overflow:hidden;color:#173348}',
    '#'+ROOT_ID+',#'+ROOT_ID+' *{box-sizing:border-box}',
    '#'+ROOT_ID+' .ofh-heading{display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:46px;flex:0 0 auto;padding:6px 2px}',
    '#'+ROOT_ID+' .ofh-title{min-width:0}',
    '#'+ROOT_ID+' .ofh-eyebrow{display:block;margin-bottom:2px;color:#547083;font-size:10px;font-weight:800;letter-spacing:.12em;text-transform:uppercase}',
    '#'+ROOT_ID+' h2{margin:0;color:#173348;font-size:clamp(17px,2vw,23px);font-weight:800;line-height:1.15}',
    '#'+ROOT_ID+' .ofh-subtitle{margin:4px 0 0;color:#627888;font-size:11px;line-height:1.35}',
    '#'+ROOT_ID+' .ofh-tag{flex:0 0 auto;border:1px solid #c7d8e2;border-radius:999px;padding:6px 9px;background:#f7fafc;color:#466274;font-size:9px;font-weight:800;letter-spacing:.07em}',
    '#'+ROOT_ID+'.ofh-original-mode{height:auto!important;min-height:0!important;max-height:none!important;gap:0!important;overflow:visible!important;margin:0 auto 10px!important;padding:0!important;background:transparent!important;box-shadow:none!important}',
    '#'+ROOT_ID+'.ofh-original-mode .ofh-heading{min-height:39px;gap:8px;padding:3px 1px}',
    '#'+ROOT_ID+'.ofh-original-mode .ofh-stage,#'+ROOT_ID+'.ofh-original-mode .ofh-footnote,#'+ROOT_ID+'.ofh-original-mode .ofh-subtitle{display:none!important}',
    '#'+ROOT_ID+' .ofh-mode-switch{display:flex;align-items:center;gap:3px;flex:0 0 auto;padding:3px;border:1px solid #cbd8e1;border-radius:11px;background:#edf3f6}',
    '#'+ROOT_ID+' .ofh-mode-switch button{min-height:32px;padding:6px 10px;border:0;border-radius:8px;background:transparent;color:#536e80;font:inherit;font-size:10px;font-weight:800;white-space:nowrap;cursor:pointer;touch-action:manipulation}',
    '#'+ROOT_ID+' .ofh-mode-switch button[aria-pressed="true"]{background:#193a51;color:#fff;box-shadow:0 1px 4px rgba(18,45,62,.2)}',
    '#'+ROOT_ID+' .ofh-mode-switch button:focus-visible{outline:2px solid #1685c5;outline-offset:2px}',
    '@media(max-width:700px){#'+ROOT_ID+'.ofh-original-mode{height:auto!important;min-height:0!important;max-height:none!important;margin:0 auto 8px!important;padding:0!important}#'+ROOT_ID+'.ofh-original-mode .ofh-heading{min-height:37px;padding:2px 0}#'+ROOT_ID+'.ofh-original-mode h2{font-size:13px}#'+ROOT_ID+' .ofh-mode-switch{gap:2px;padding:2px;border-radius:9px}#'+ROOT_ID+' .ofh-mode-switch button{min-height:29px;padding:5px 7px;font-size:9px}}'
    '#'+ROOT_ID+' .ofh-stage{position:relative;display:flex;flex:1 1 auto;width:100%;height:0;min-height:300px;overflow:hidden;border:1px solid #d5e0e7;border-radius:14px;background:#eaf0f3;box-shadow:0 6px 22px rgba(20,49,67,.09)}',
    '#'+ROOT_ID+' .ofh-stage iframe{position:absolute;inset:0;display:block;width:100%;height:100%;min-height:0;border:0;border-radius:inherit;background:#eaf0f3;visibility:hidden}',
    '#'+ROOT_ID+' .ofh-stage.ready iframe{visibility:visible}',
    '#'+ROOT_ID+' .ofh-frame-state{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:22px;text-align:center;color:#365568;background:linear-gradient(145deg,#f7fafc,#e9f0f4)}',
    '#'+ROOT_ID+' .ofh-frame-state strong{font-size:13px;font-weight:800}',
    '#'+ROOT_ID+' .ofh-frame-state span{max-width:300px;font-size:11px;line-height:1.5;color:#708493}',
    '#'+ROOT_ID+' .ofh-stage.ready .ofh-frame-state{display:none}',
    '#'+ROOT_ID+' .ofh-footnote{flex:0 0 auto;margin:0;padding:0 3px;color:#6c8190;font-size:10px;line-height:1.35}',
    '@media(max-width:700px){#'+ROOT_ID+'{height:calc(100dvh - 136px);min-height:370px;gap:6px}#'+ROOT_ID+' .ofh-heading{min-height:42px;padding:3px 1px}#'+ROOT_ID+' .ofh-eyebrow{font-size:8px}#'+ROOT_ID+' h2{font-size:17px}#'+ROOT_ID+' .ofh-subtitle{font-size:10px;max-width:255px}#'+ROOT_ID+' .ofh-tag{font-size:8px;padding:5px 7px}#'+ROOT_ID+' .ofh-stage{min-height:270px;border-radius:10px}#'+ROOT_ID+' .ofh-frame-state strong{font-size:12px}#'+ROOT_ID+' .ofh-frame-state span{font-size:10px}#'+ROOT_ID+' .ofh-footnote{font-size:9px}}'
  ].join('\n');
  document.head.appendChild(styleNode);
}
function cleanup(){document.querySelectorAll('#'+ROOT_ID).forEach(node=>node.remove());document.querySelectorAll('.'+VIEW_CLASS).forEach(node=>node.classList.remove(VIEW_CLASS));document.documentElement.classList.remove(VIEW_CLASS);homeView=null;iframe=null;lastFingerprint='';currentMode='3d';}
function findHomeView(){const marker=document.getElementById('home-smart-resume');if(!marker)return null;return marker.closest('.view')||marker.closest('[data-view]')||marker.parentElement;}
function createRoot(view){
  const root=document.createElement('section');root.id=ROOT_ID;root.setAttribute('aria-label','Factory Overview — status mesin khusus Superadmin');
  root.innerHTML='<header class="ofh-heading"><div class="ofh-title"><span class="ofh-eyebrow">OMODOS · SUPERADMIN</span><h2>Factory Overview</h2><p class="ofh-subtitle">Status seluruh mesin BMJ dalam visualisasi 3D.</p></div><div class="ofh-mode-switch" role="group" aria-label="Pilih versi beranda"><button type="button" data-ofh-mode="original" aria-pressed="false">Original</button><button type="button" data-ofh-mode="3d" aria-pressed="true">Factory 3D</button></div></header><div class="ofh-stage"><iframe title="Visualisasi 3D status mesin BMJ" loading="eager" referrerpolicy="strict-origin-when-cross-origin" allow="fullscreen"></iframe><div class="ofh-frame-state"><strong>Menyiapkan viewer 3D…</strong><span>Model dan status mesin akan ditampilkan saat mode pemantauan siap.</span></div></div><p class="ofh-footnote">Status mengikuti sumber Logbook atau Patrol terbaru yang dipakai pada beranda OMODOS. Bukan telemetry sensor langsung.</p>'
  view.prepend(root);return root;
}
function sendStatuses(force){
  if(!isSuperadmin()||currentMode!=='3d')return;const root=document.getElementById(ROOT_ID);if(!root)return;const frame=root.querySelector('iframe');if(!frame||!frame.contentWindow)return;
  const now=Date.now();if(!force&&now-lastSendAt<5000)return;const records=latestRecords();
  const fingerprint=records.map(r=>[r.code,r.name,r.status,r.date,r.index].join('|')).join('~');
  if(!force&&fingerprint===lastFingerprint&&now-lastSendAt<18000)return;
  lastFingerprint=fingerprint;lastSendAt=now;
  try{frame.contentWindow.postMessage({type:'OMODOS_FACTORY_STATUS',version:1,sentAt:new Date().toISOString(),records},TWIN_ORIGIN);}catch(e){}
}
function sync(){
  if(!isSuperadmin()){cleanup();return;}
  const view=findHomeView();if(!view)return;
  if(homeView!==view||!document.getElementById(ROOT_ID)){
    cleanup();homeView=view;makeStyles();
    const root=createRoot(view);iframe=root.querySelector('iframe');
    root.querySelectorAll('[data-ofh-mode]').forEach(button=>button.addEventListener('click',()=>setHomeMode_(button.dataset.ofhMode,true)));
    iframe.addEventListener('load',()=>sendStatuses(true));
    iframe.addEventListener('error',()=>{const state=root.querySelector('.ofh-frame-state');if(state)state.innerHTML='<strong>Viewer 3D belum dapat dimuat</strong><span>Fungsi OMODOS lainnya tetap tersedia. Coba muat ulang beranda beberapa saat lagi.</span>';const foot=root.querySelector('.ofh-footnote');if(foot)foot.textContent='Viewer 3D belum siap; fitur OMODOS lain tetap dapat digunakan.';});
    setHomeMode_(readSavedMode_(),false);
  }else{
    homeView=view;
    if(view.classList.contains(VIEW_CLASS)!==(currentMode==='3d'))setHomeMode_(currentMode,false);
  }
  const root=document.getElementById(ROOT_ID);if(root&&root.querySelector('iframe')!==iframe)iframe=root.querySelector('iframe');sendStatuses(false);
}
window.OMODOS_FACTORY_HOME_SYNC=sync;
window.addEventListener('message',event=>{if(currentMode!=='3d'||event.origin!==TWIN_ORIGIN||!iframe||event.source!==iframe.contentWindow)return;if(event.data?.type==='OMODOS_FACTORY_STATUS_READY'&&event.data?.version===1){const stage=document.getElementById(ROOT_ID)?.querySelector('.ofh-stage');if(stage)stage.classList.add('ready');sendStatuses(true);}});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)sendStatuses(true);});
document.addEventListener('DOMContentLoaded',sync);setInterval(sync,1200);sync();
})();