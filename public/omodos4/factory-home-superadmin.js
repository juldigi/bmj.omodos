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
  if(!show3d)root?.classList.remove('ofh-fullscreen');
  if(view)view.classList.toggle(VIEW_CLASS,show3d);
  document.documentElement.classList.toggle(VIEW_CLASS,show3d);
  syncResumePath_(view,show3d);
  syncCompactResume_(view,show3d);
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
  fitMobileViewport_();
  if(show3d&&persist)sendStatuses(true);
}

function makeStyles(){
  // Hotfix scripts can be reloaded without a full page navigation. Replace the
  // previous stylesheet instead of leaving stale floating/scroll-lock rules behind.
  const previous=document.getElementById('omodos-superadmin-factory-home-style');
  if(previous)previous.remove();
  styleNode=document.createElement('style');styleNode.id='omodos-superadmin-factory-home-style';
  styleNode.textContent=[
    '.view.'+VIEW_CLASS+'{padding:0!important;min-height:0!important}',
    '.view.'+VIEW_CLASS+'>:not(#'+ROOT_ID+'):not(#omodos-smart-resume-compact){display:none!important}',
    '#'+ROOT_ID+'{box-sizing:border-box;display:flex;flex-direction:column;gap:8px;width:100%;height:calc(100dvh - 160px);min-height:440px;max-height:none;padding:0;margin:0 auto;overflow:hidden;color:#173348}',
    '#'+ROOT_ID+',#'+ROOT_ID+' *{box-sizing:border-box}',
    '#'+ROOT_ID+' .ofh-heading{display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:46px;flex:0 0 auto;padding:6px 2px}',
    '#'+ROOT_ID+' .ofh-title{min-width:0}',
    '#'+ROOT_ID+' .ofh-eyebrow{display:block;margin-bottom:2px;color:#547083;font-size:10px;font-weight:800;letter-spacing:.12em;text-transform:uppercase}',
    '#'+ROOT_ID+' h2{margin:0;color:#173348;font-size:clamp(17px,2vw,23px);font-weight:800;line-height:1.15}',
    '#'+ROOT_ID+' .ofh-subtitle{margin:4px 0 0;color:#627888;font-size:11px;line-height:1.35}',
    '#'+ROOT_ID+' .ofh-tag{flex:0 0 auto;border:1px solid #c7d8e2;border-radius:999px;padding:6px 9px;background:#f7fafc;color:#466274;font-size:9px;font-weight:800;letter-spacing:.07em}',
    '#'+ROOT_ID+'.ofh-original-mode{height:auto!important;min-height:0!important;max-height:none!important;gap:0!important;overflow:visible!important;margin:0 auto 10px!important;padding:0!important;background:transparent!important;box-shadow:none!important}',
    '#'+ROOT_ID+'.ofh-original-mode .ofh-heading{min-height:39px;gap:8px;padding:3px 1px;justify-content:flex-end!important}',
    '#'+ROOT_ID+'.ofh-original-mode .ofh-title{display:none!important}',

    '#'+ROOT_ID+'.ofh-original-mode .ofh-stage,#'+ROOT_ID+'.ofh-original-mode .ofh-footnote,#'+ROOT_ID+'.ofh-original-mode .ofh-subtitle{display:none!important}',
    '#'+ROOT_ID+' .ofh-mode-switch{display:flex;align-items:center;gap:3px;flex:0 0 auto;padding:3px;border:1px solid #cbd8e1;border-radius:11px;background:#edf3f6}',
    '#'+ROOT_ID+' .ofh-mode-switch button{min-height:32px;padding:6px 10px;border:0;border-radius:8px;background:transparent;color:#536e80;font:inherit;font-size:10px;font-weight:800;white-space:nowrap;cursor:pointer;touch-action:manipulation}',
    '#'+ROOT_ID+' .ofh-mode-switch button[aria-pressed="true"]{background:#193a51;color:#fff;box-shadow:0 1px 4px rgba(18,45,62,.2)}',
    '#'+ROOT_ID+' .ofh-mode-switch button:focus-visible{outline:2px solid #1685c5;outline-offset:2px}',
    '@media(max-width:700px){#'+ROOT_ID+'.ofh-original-mode{height:auto!important;min-height:0!important;max-height:none!important;margin:0 auto 8px!important;padding:0!important}#'+ROOT_ID+'.ofh-original-mode .ofh-heading{min-height:37px;padding:2px 0}#'+ROOT_ID+'.ofh-original-mode h2{font-size:13px}#'+ROOT_ID+' .ofh-mode-switch{gap:2px;padding:2px;border-radius:9px}#'+ROOT_ID+' .ofh-mode-switch button{min-height:29px;padding:5px 7px;font-size:9px}}',
    '#'+ROOT_ID+' .ofh-stage{position:relative;display:flex;flex:1 1 auto;width:100%;height:0;min-height:300px;overflow:hidden;border:1px solid #d5e0e7;border-radius:14px;background:#eaf0f3;box-shadow:0 6px 22px rgba(20,49,67,.09)}',
    '#'+ROOT_ID+' .ofh-fullscreen-toggle{position:absolute;z-index:12;top:10px;right:10px;min-height:36px;padding:8px 11px;border:1px solid #c5d5df;border-radius:10px;background:rgba(255,255,255,.96);color:#193a51;font:800 12px/1.1 system-ui,-apple-system,sans-serif;box-shadow:0 2px 8px rgba(15,40,55,.15);cursor:pointer;touch-action:manipulation}',
    '#'+ROOT_ID+' .ofh-fullscreen-toggle:focus-visible{outline:3px solid #1785c1;outline-offset:2px}',
    '#'+ROOT_ID+'.ofh-fullscreen .ofh-stage{position:fixed!important;inset:0!important;width:100vw!important;height:100vh!important;height:100dvh!important;min-height:0!important;max-height:none!important;margin:0!important;border:0!important;border-radius:0!important;z-index:2147483000!important;background:#e8eef3}',
    '#'+ROOT_ID+'.ofh-fullscreen .ofh-stage iframe{position:absolute!important;inset:0!important;width:100%!important;height:100%!important}',
    '#'+ROOT_ID+'.ofh-fullscreen .ofh-fullscreen-toggle{position:fixed!important;top:max(10px,env(safe-area-inset-top))!important;right:max(10px,env(safe-area-inset-right))!important}',
    '#'+ROOT_ID+'.ofh-fullscreen .ofh-frame-state{display:none!important}',
    '#'+ROOT_ID+'.ofh-fullscreen .ofh-heading,#'+ROOT_ID+'.ofh-fullscreen .ofh-footnote{visibility:hidden!important}',
    '#'+ROOT_ID+' .ofh-stage iframe{position:absolute;inset:0;display:block;width:100%;height:100%;min-height:0;border:0;border-radius:inherit;background:#eaf0f3;visibility:hidden}',
    '#'+ROOT_ID+' .ofh-stage.ready iframe{visibility:visible}',
    '#'+ROOT_ID+' .ofh-frame-state{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:22px;text-align:center;color:#365568;background:linear-gradient(145deg,#f7fafc,#e9f0f4)}',
    '#'+ROOT_ID+' .ofh-frame-state strong{font-size:13px;font-weight:800}',
    '#'+ROOT_ID+' .ofh-frame-state span{max-width:300px;font-size:11px;line-height:1.5;color:#708493}',
    '#'+ROOT_ID+' .ofh-stage{flex:1 1 auto;min-height:0}',
    '#'+ROOT_ID+' .ofh-stage.ready .ofh-frame-state{display:none}',
    '#'+ROOT_ID+' .ofh-footnote{flex:0 0 auto;margin:0;padding:0 3px;color:#6c8190;font-size:10px;line-height:1.35}',
    '#omodos-smart-resume-compact{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin:0 0 12px;padding:10px 12px;border:1px solid #d9e2e8;border-radius:12px;background:#fff;box-shadow:0 2px 8px rgba(20,49,67,.06);color:#193548}',
    '#omodos-smart-resume-compact .ofh-sr-copy{min-width:0;flex:1 1 140px}',
    '#omodos-smart-resume-compact strong{display:block;font-size:12px;font-weight:850;line-height:1.25}',
    '#omodos-smart-resume-compact span{display:block;margin-top:3px;font-size:10px;line-height:1.35;color:#687f8e}',
    '#omodos-smart-resume-compact button{flex:0 0 auto;min-height:34px;border:1px solid #c6d6df;border-radius:9px;padding:7px 10px;background:#193a51;color:#fff;font:800 10px/1.2 system-ui,-apple-system,sans-serif;cursor:pointer;touch-action:manipulation}',
    '#omodos-smart-resume-compact button:focus-visible{outline:2px solid #1685c5;outline-offset:2px}',
    '@media(max-width:700px){#'+ROOT_ID+'{height:calc(100dvh - 136px);min-height:370px;gap:6px}#'+ROOT_ID+' .ofh-heading{min-height:42px;padding:3px 1px}#'+ROOT_ID+' .ofh-eyebrow{font-size:8px}#'+ROOT_ID+' h2{font-size:17px}#'+ROOT_ID+' .ofh-subtitle{font-size:10px;max-width:255px}#'+ROOT_ID+' .ofh-tag{font-size:8px;padding:5px 7px}#'+ROOT_ID+' .ofh-stage{min-height:270px;border-radius:10px}#'+ROOT_ID+' .ofh-frame-state strong{font-size:12px}#'+ROOT_ID+' .ofh-frame-state span{font-size:10px}#'+ROOT_ID+' .ofh-footnote{font-size:9px}}',
    '#'+ROOT_ID+'{width:min(100%,1440px);padding:0 clamp(8px,1.2vw,16px)}',
    '#'+ROOT_ID+' .ofh-heading{min-width:0}',
    '@media(max-width:700px){#'+ROOT_ID+'{gap:7px}#'+ROOT_ID+' .ofh-heading{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:7px;min-height:0;padding:7px 0 3px}#'+ROOT_ID+' .ofh-title{min-width:0}#'+ROOT_ID+' .ofh-eyebrow{font-size:8px;letter-spacing:.1em}#'+ROOT_ID+' h2{font-size:clamp(14px,4.1vw,17px);line-height:1.12;overflow-wrap:anywhere}#'+ROOT_ID+' .ofh-subtitle{max-width:220px;font-size:9px;line-height:1.25;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}#'+ROOT_ID+' .ofh-mode-switch{gap:2px;padding:2px;max-width:46%}#'+ROOT_ID+' .ofh-mode-switch button{min-height:30px;padding:5px 7px;font-size:9px;flex:1 1 0}#'+ROOT_ID+' .ofh-stage{border-radius:10px}#'+ROOT_ID+' .ofh-fullscreen-toggle{top:7px;right:7px;min-height:32px;padding:6px 9px;font-size:10px}#'+ROOT_ID+' .ofh-footnote{font-size:9px;line-height:1.3}}',
    '@media(max-width:420px){#'+ROOT_ID+' .ofh-heading{grid-template-columns:minmax(0,1fr);gap:6px;padding-top:5px}#'+ROOT_ID+' .ofh-subtitle{-webkit-line-clamp:1;max-width:none}#'+ROOT_ID+' .ofh-mode-switch{width:100%;max-width:none;justify-content:stretch}#'+ROOT_ID+' .ofh-mode-switch button{flex:1 1 0;white-space:nowrap}}',
    '@media(max-width:700px){#omodos-smart-resume-compact{margin-top:8px;gap:8px;padding:10px;border-radius:12px}#omodos-smart-resume-compact .ofh-sr-copy{flex:1 1 155px}#omodos-smart-resume-compact strong{font-size:11px}#omodos-smart-resume-compact span{font-size:9px;line-height:1.3}#omodos-smart-resume-compact button{min-height:34px;font-size:9px}}',
    '@media(max-width:420px){#omodos-smart-resume-compact{display:grid;grid-template-columns:minmax(0,1fr);gap:8px}#omodos-smart-resume-compact .ofh-sr-copy{min-width:0}#omodos-smart-resume-compact button{width:100%;white-space:normal}}',
  ].join('\n');
  document.head.appendChild(styleNode);
}
function clearResumePath_(view){
  if(!view)return;
  view.querySelectorAll('.ofh-resume-ancestor,.ofh-resume-root,.ofh-full-resume').forEach(node=>node.classList.remove('ofh-resume-ancestor','ofh-resume-root','ofh-full-resume'));
  view.querySelectorAll('#omodos-smart-resume-compact').forEach(node=>node.remove());
  document.getElementById('omodos-smart-resume-compact')?.remove();
}
function syncResumePath_(view,keep){
  // Keep the original dashboard DOM in natural flow; no marker gets positioned,
  // raised, or hidden by adding classes. Only the 3D view's sibling rule hides it.
  if(!view)return;
  clearResumePath_(view);
}
function syncCompactResume_(view,show3d){
  if(!view)return;
  view.querySelectorAll('#omodos-smart-resume-compact').forEach(node=>node.remove());
  if(!show3d||!isSuperadmin())return;
  const marker=document.getElementById('home-smart-resume');
  if(!marker||!view.contains(marker))return;
  const compact=document.createElement('section');
  compact.id='omodos-smart-resume-compact';
  compact.setAttribute('aria-label','Smart Resume Pabrik ringkas');
  compact.innerHTML='<div class="ofh-sr-copy"><strong>Smart Resume Pabrik</strong><span>Ringkasan singkat tersedia. Buka detail untuk melihat tindak lanjut, lost time, KPI, dan sparepart.</span></div><button type="button">Buka Detail Smart Resume</button>';
  compact.querySelector('button').addEventListener('click',()=>{
    setHomeMode_('original',true);
    window.setTimeout(()=>{try{marker.scrollIntoView({behavior:'smooth',block:'start'});}catch(e){}},80);
  });
  const root=document.getElementById(ROOT_ID);
  if(root&&root.parentElement===view)root.insertAdjacentElement('afterend',compact);
}
function restoreViewSizing_(view){
  if(!view)return;
  for(const key of ['height','min-height','max-height','overflow-y','overflow-x'])view.style.removeProperty(key);
}
function cleanup(){const view=homeView||document.querySelector('.view.'+VIEW_CLASS);clearResumePath_(view);restoreViewSizing_(view);document.querySelectorAll('#'+ROOT_ID).forEach(node=>node.remove());document.querySelectorAll('.'+VIEW_CLASS).forEach(node=>node.classList.remove(VIEW_CLASS));document.documentElement.classList.remove(VIEW_CLASS);homeView=null;iframe=null;lastFingerprint='';currentMode='3d';}
function findHomeView(){const marker=document.getElementById('home-smart-resume');if(!marker)return null;return marker.closest('.view')||marker.closest('[data-view]')||marker.parentElement;}
function createRoot(view){
  const root=document.createElement('section');root.id=ROOT_ID;root.setAttribute('aria-label','Factory Overview — status mesin khusus Superadmin');
  root.innerHTML='<header class="ofh-heading"><div class="ofh-title"><span class="ofh-eyebrow">OMODOS · SUPERADMIN</span><h2>Factory Overview</h2><p class="ofh-subtitle">Status seluruh mesin BMJ dalam visualisasi 3D.</p></div><div class="ofh-mode-switch" role="group" aria-label="Pilih versi beranda"><button type="button" data-ofh-mode="original" aria-pressed="false">Original</button><button type="button" data-ofh-mode="3d" aria-pressed="true">Factory 3D</button></div></header><div class="ofh-stage"><button type="button" class="ofh-fullscreen-toggle" aria-pressed="false" aria-label="Tampilkan 3D layar penuh">⛶ Layar Penuh</button><iframe title="Visualisasi 3D status mesin BMJ" loading="eager" referrerpolicy="strict-origin-when-cross-origin" allow="fullscreen"></iframe><div class="ofh-frame-state"><strong>Menyiapkan viewer 3D…</strong><span>Model dan status mesin akan ditampilkan saat mode pemantauan siap.</span></div></div><p class="ofh-footnote">Status mengikuti sumber Logbook atau Patrol terbaru yang dipakai pada beranda OMODOS. Bukan telemetry sensor langsung.</p>';
  view.prepend(root);return root;
}
function fitMobileViewport_(){
  const root=document.getElementById(ROOT_ID),view=homeView||root?.closest('.view');
  if(!root||!view)return;
  const stage=root.querySelector('.ofh-stage');
  if(currentMode!=='3d'||!isSuperadmin()){
    root.style.removeProperty('height');root.style.removeProperty('min-height');root.style.removeProperty('max-height');
    if(stage){stage.style.removeProperty('min-height');stage.style.removeProperty('height');}
    restoreViewSizing_(view);
    return;
  }
  const viewportHeight=Math.max(0,window.innerHeight||document.documentElement.clientHeight||0);
  if(viewportHeight<320)return;
  const mobile=window.matchMedia('(max-width:700px)').matches;
  // Size only the 3D module using viewport dimensions, not its changing
  // scroll position. This avoids height jumps while the page is being scrolled.
  // The original cards and Smart Resume remain in the page's normal flow.
  const available=Math.max(mobile?300:360,viewportHeight-(mobile?350:250));
  const rootHeight=Math.max(mobile?300:360,Math.min(mobile?560:760,available));
  root.style.height=rootHeight+'px';
  root.style.minHeight='0px';
  root.style.maxHeight=rootHeight+'px';
  if(stage){stage.style.height='0px';stage.style.minHeight=mobile?'220px':'300px';}
  restoreViewSizing_(view);
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
    const stage=root.querySelector('.ofh-stage'),fullscreenButton=root.querySelector('.ofh-fullscreen-toggle');
    const syncFullscreenLabel=()=>{const active=document.fullscreenElement===stage||root.classList.contains('ofh-fullscreen');fullscreenButton.setAttribute('aria-pressed',active?'true':'false');fullscreenButton.textContent=active?'⤢ Keluar Layar Penuh':'⛶ Layar Penuh';fullscreenButton.setAttribute('aria-label',active?'Keluar dari layar penuh':'Tampilkan 3D layar penuh');};
    fullscreenButton.addEventListener('click',async()=>{const active=document.fullscreenElement===stage||root.classList.contains('ofh-fullscreen');if(active){if(document.fullscreenElement===stage&&document.exitFullscreen){try{await document.exitFullscreen();}catch(e){}}root.classList.remove('ofh-fullscreen');syncFullscreenLabel();return;}if(stage.requestFullscreen){try{await stage.requestFullscreen();syncFullscreenLabel();return;}catch(e){}}root.classList.add('ofh-fullscreen');syncFullscreenLabel();});
    document.addEventListener('fullscreenchange',syncFullscreenLabel);
    document.addEventListener('keydown',event=>{if(event.key==='Escape'&&root.classList.contains('ofh-fullscreen')&&!document.fullscreenElement){root.classList.remove('ofh-fullscreen');syncFullscreenLabel();}});
    iframe.addEventListener('load',()=>sendStatuses(true));
    iframe.addEventListener('error',()=>{const state=root.querySelector('.ofh-frame-state');if(state)state.innerHTML='<strong>Viewer 3D belum dapat dimuat</strong><span>Fungsi OMODOS lainnya tetap tersedia. Coba muat ulang beranda beberapa saat lagi.</span>';const foot=root.querySelector('.ofh-footnote');if(foot)foot.textContent='Viewer 3D belum siap; fitur OMODOS lain tetap dapat digunakan.';});
    setHomeMode_(readSavedMode_(),false);
  }else{
    homeView=view;
    if(view.classList.contains(VIEW_CLASS)!==(currentMode==='3d'))setHomeMode_(currentMode,false);
  }
  const root=document.getElementById(ROOT_ID);if(root&&root.querySelector('iframe')!==iframe)iframe=root.querySelector('iframe');fitMobileViewport_();sendStatuses(false);
}
window.OMODOS_FACTORY_HOME_SYNC=sync;
function openStatusDetailFromFactoryCard_(payload){
  if(!isSuperadmin()||currentMode!=='3d')return;
  const code=String(payload?.code||'').trim().slice(0,120);
  const name=String(payload?.name||'').trim().slice(0,240);
  if(!code&&!name)return;
  let master=[];
  try{if(typeof MACHINES!=='undefined'&&Array.isArray(MACHINES))master=MACHINES;}catch(e){}
  if(!master.length&&Array.isArray(window.MACHINES))master=window.MACHINES;
  const machineCode=row=>String(pick(row,['Kode Mesin','KodeMesin','Machine Code','MachineCode','Kode'])||'').trim();
  const machineName=row=>String(pick(row,['Nama Mesin','NamaMesin','Machine Name','MachineName','Machine','Mesin','Nama Aset'])||'').trim();
  const wantedName=normalizeKey(name),wantedCode=normalizeKey(code);
  let selected=null;
  if(wantedName){
    const byName=master.filter(row=>normalizeKey(machineName(row))===wantedName);
    if(byName.length===1)selected=byName[0];
    else if(byName.length>1&&wantedCode){
      const byNameAndCode=byName.filter(row=>normalizeKey(machineCode(row))===wantedCode);
      if(byNameAndCode.length===1)selected=byNameAndCode[0];
    }
  }
  // If the names do not exactly match, a unique code is safe. A duplicate
  // code without an exact-name resolution is deliberately not opened.
  if(!selected&&!wantedName&&wantedCode){
    const byCode=master.filter(row=>normalizeKey(machineCode(row))===wantedCode);
    if(byCode.length===1)selected=byCode[0];
  }else if(!selected&&wantedCode){
    const exactNameMatches=master.filter(row=>normalizeKey(machineName(row))===wantedName);
    if(exactNameMatches.length===0){
      const byCode=master.filter(row=>normalizeKey(machineCode(row))===wantedCode);
      if(byCode.length===1)selected=byCode[0];
    }
  }
  if(!selected)return;
  const identity=machineName(selected)||machineCode(selected);
  if(!identity)return;
  if(typeof window.openMachineCurrentStatus==='function'){
    // Reuse the same OMODOS detail modal and existing per-role detail checks
    // as the original homepage machine-status cards.
    window.openMachineCurrentStatus(identity);
  }
}
window.addEventListener('message',event=>{
  if(currentMode!=='3d'||event.origin!==TWIN_ORIGIN||!iframe||event.source!==iframe.contentWindow)return;
  const payload=event.data;
  if(payload?.type==='OMODOS_FACTORY_STATUS_READY'&&payload?.version===1){
    const stage=document.getElementById(ROOT_ID)?.querySelector('.ofh-stage');
    if(stage)stage.classList.add('ready');
    sendStatuses(true);
  }else if(payload?.type==='OMODOS_FACTORY_STATUS_CARD_CLICK'&&payload?.version===1){
    openStatusDetailFromFactoryCard_(payload);
  }
});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)sendStatuses(true);});
window.addEventListener('resize',fitMobileViewport_);
document.addEventListener('scroll',fitMobileViewport_,{capture:true,passive:true});
if(window.visualViewport)window.visualViewport.addEventListener('resize',fitMobileViewport_);
document.addEventListener('DOMContentLoaded',sync);setInterval(sync,1200);sync();
})();