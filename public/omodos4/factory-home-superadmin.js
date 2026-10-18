(function(){
'use strict';
if(window.__OMODOS_FACTORY_HOME_MODULE__)return;
window.__OMODOS_FACTORY_HOME_MODULE__=true;
const ROOT_ID='omodos-superadmin-factory-home',VIEW_CLASS='omodos-superadmin-factory-home',TWIN_ORIGIN='https://digitaltwin.juldigi.workers.dev',TWIN_URL=TWIN_ORIGIN+'/?embed=omodos-status';
let homeView=null,iframe=null,styleNode=null,lastFingerprint='',lastSendAt=0;
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
  const rows=readEntries(),byKey=new Map();
  rows.forEach((row,index)=>{
    const location=String(pick(row,['Lokasi Pekerjaan','LokasiPekerjaan','Work Location'])||'').trim().toLowerCase();if(location==='area')return;
    const code=validCode(pick(row,['Kode Mesin','KodeMesin','Machine Code','MachineCode','Kode','Functional Loc','Functional Location','SAP Code']));
    let name=String(pick(row,['Nama Mesin','NamaMesin','Machine Name','MachineName','Machine','Mesin','Nama Aset'])||'').trim();if(!name||name==='-'||name==='—')name='';
    if(!code&&!name)return;
    const status=String(pick(row,['Status','Status Pekerjaan','Status Mesin','Kondisi Mesin','Kondisi','State'])||'').trim();
    const date=parseDate(pick(row,['Timestamp Input','Timestamp','Waktu Input','Tanggal Input','Tanggal','Date','Created At','CreatedAt']));
    const key=code?'code:'+normalizeKey(code):'name:'+normalizeKey(name),record={code,name,status:status||'Status belum diisi',date,index},current=byKey.get(key);
    const currentTime=Date.parse(current?.date||'')||Number(current?.index)||0,nextTime=Date.parse(date||'')||index;
    if(!current||nextTime>=currentTime)byKey.set(key,record);
  });
  const result=[...byKey.values()].sort((a,b)=>(Date.parse(b.date||'')||b.index)-(Date.parse(a.date||'')||a.index));
  return result.slice(0,1200).map((row,index)=>({...row,index}));
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
function cleanup(){document.querySelectorAll('#'+ROOT_ID).forEach(node=>node.remove());document.querySelectorAll('.'+VIEW_CLASS).forEach(node=>node.classList.remove(VIEW_CLASS));document.documentElement.classList.remove(VIEW_CLASS);homeView=null;iframe=null;lastFingerprint='';}
function findHomeView(){const marker=document.getElementById('home-smart-resume');if(!marker)return null;return marker.closest('.view')||marker.closest('[data-view]')||marker.parentElement;}
function createRoot(view){
  const root=document.createElement('section');root.id=ROOT_ID;root.setAttribute('aria-label','Factory Overview — status mesin khusus Superadmin');
  root.innerHTML='<header class="ofh-heading"><div class="ofh-title"><span class="ofh-eyebrow">OMODOS · SUPERADMIN</span><h2>Factory Overview</h2><p class="ofh-subtitle">Status seluruh mesin BMJ dalam visualisasi 3D.</p></div><span class="ofh-tag">VIEW ONLY</span></header><div class="ofh-stage"><iframe title="Visualisasi 3D status mesin BMJ" src="'+TWIN_URL+'" loading="eager" referrerpolicy="strict-origin-when-cross-origin" allow="fullscreen"></iframe><div class="ofh-frame-state"><strong>Menyiapkan viewer 3D…</strong><span>Model dan status mesin akan ditampilkan saat mode pemantauan siap.</span></div></div><p class="ofh-footnote">Status bersumber dari catatan logbook terakhir yang tersimpan di OMODOS, bukan telemetry sensor secara langsung.</p>';
  view.prepend(root);return root;
}
function sendStatuses(force){
  if(!isSuperadmin())return;const root=document.getElementById(ROOT_ID);if(!root)return;const frame=root.querySelector('iframe');if(!frame||!frame.contentWindow)return;
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
    cleanup();homeView=view;view.classList.add(VIEW_CLASS);document.documentElement.classList.add(VIEW_CLASS);makeStyles();
    const root=createRoot(view);iframe=root.querySelector('iframe');
    iframe.addEventListener('load',()=>sendStatuses(true));
    iframe.addEventListener('error',()=>{const state=root.querySelector('.ofh-frame-state');if(state)state.innerHTML='<strong>Viewer 3D belum dapat dimuat</strong><span>Fungsi OMODOS lainnya tetap tersedia. Coba muat ulang beranda beberapa saat lagi.</span>';const foot=root.querySelector('.ofh-footnote');if(foot)foot.textContent='Viewer 3D belum siap; fitur OMODOS lain tetap dapat digunakan.';});
  }else{homeView=view;if(!view.classList.contains(VIEW_CLASS))view.classList.add(VIEW_CLASS);}
  const root=document.getElementById(ROOT_ID);if(root&&root.querySelector('iframe')!==iframe)iframe=root.querySelector('iframe');sendStatuses(false);
}
window.OMODOS_FACTORY_HOME_SYNC=sync;
window.addEventListener('message',event=>{if(event.origin!==TWIN_ORIGIN||!iframe||event.source!==iframe.contentWindow)return;if(event.data?.type==='OMODOS_FACTORY_STATUS_READY'&&event.data?.version===1){const stage=document.getElementById(ROOT_ID)?.querySelector('.ofh-stage');if(stage)stage.classList.add('ready');sendStatuses(true);}});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)sendStatuses(true);});
document.addEventListener('DOMContentLoaded',sync);setInterval(sync,1200);sync();
})();