(function(){
'use strict';
if(window.__OMODOS_DIGITALTWIN_LITE_V1__)return;
window.__OMODOS_DIGITALTWIN_LITE_V1__=true;

const TWIN_ORIGIN='https://digitaltwin.offsetbmj.workers.dev';
const TWIN_URL=TWIN_ORIGIN+'/omodos-lite.html?embed=omodos&view=3d';
const READY_MESSAGE='BMJ_TWIN_LITE_READY_V1';
const STATUS_MESSAGE='BMJ_OMODOS_MACHINE_STATUS_V1';
const WRAP_ID='home-digitaltwin-lite';
let iframe=null,gridObserver=null,permissionTimer=0,statusTimer=0;
let lastPayload='';

function allowed(){
 try{
  if(window.OMODOS4&&typeof window.OMODOS4.isAllowed==='function')
   return window.OMODOS4.isAllowed()===true;
  return typeof isSuperadmin==='function'&&isSuperadmin()===true;
 }catch(_){return false;}
}
function esc(value){
 return String(value==null?'':value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function styleOnce(){
 if(document.getElementById('omodos-digitaltwin-lite-style'))return;
 const style=document.createElement('style');
 style.id='omodos-digitaltwin-lite-style';
 style.textContent=`
 body.omodos-digitaltwin-superadmin #view-dashboard.active{overflow:auto!important;min-height:0!important}
 body.omodos-digitaltwin-superadmin #view-dashboard.active #dash-grid{display:none!important}
 body.omodos-digitaltwin-superadmin #view-dashboard.active #home-below{display:none!important}
 body.omodos-digitaltwin-superadmin #view-dashboard.active #home-mesin-filter,
 body.omodos-digitaltwin-superadmin #view-dashboard.active #btn-lc-priority-only{display:none!important}
 #home-digitaltwin-lite{display:flex;flex:1 1 auto;flex-direction:column;min-height:390px;width:100%;margin:0;gap:7px;overflow:hidden}
 #home-digitaltwin-lite .dt-lite-heading{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;padding:0 1px}
 #home-digitaltwin-lite .dt-lite-title{margin:0;color:var(--text,#142f42);font-size:clamp(12px,1.6vw,16px);font-weight:780;letter-spacing:.01em}
 #home-digitaltwin-lite .dt-lite-note{margin:0;color:var(--muted,#647b8a);font-size:clamp(10px,1.1vw,12px);line-height:1.4}
 #home-digitaltwin-lite .dt-lite-source{flex:0 0 auto;color:var(--muted,#647b8a);font-size:10px}
 #home-digitaltwin-lite .dt-lite-frame{display:block;flex:1 1 auto;width:100%;height:clamp(420px,72vh,860px);min-height:390px;border:1px solid var(--line,rgba(20,47,66,.17));border-radius:12px;background:#e8eef2;box-shadow:0 2px 12px rgba(11,34,49,.08)}
 @media(max-width:767px){
  body.omodos-digitaltwin-superadmin #view-dashboard.active{gap:6px}
  #home-digitaltwin-lite{min-height:420px;gap:5px}
  #home-digitaltwin-lite .dt-lite-heading{align-items:flex-start;gap:4px;flex-direction:column}
  #home-digitaltwin-lite .dt-lite-title{font-size:12px}
  #home-digitaltwin-lite .dt-lite-note{font-size:10px}
  #home-digitaltwin-lite .dt-lite-frame{height:calc(100dvh - 205px);min-height:420px;border-radius:9px}
 }
 `;
 document.head.appendChild(style);
}
function getStatusRows(){
 const grid=document.getElementById('dash-grid');
 if(!grid)return [];
 return Array.from(grid.querySelectorAll('.dash-card')).map(card=>{
  const classNames=Array.from(card.classList);
  const rawKey=(classNames.find(c=>c.indexOf('status-')===0)||'status-none').slice(7).toLowerCase();
  const statusKey=['kritikal','perhatian','normal','none'].includes(rawKey)?rawKey:'none';
  const name=card.querySelector('.dc-name')?.textContent?.trim()||card.dataset.mesin||'';
  const code=card.dataset.kode||card.querySelector('.dc-kode')?.textContent?.trim()||'';
  const statusLabel=card.querySelector('.dc-status')?.textContent?.replace(/\s+/g,' ').trim()||(
   statusKey==='kritikal'?'Kritis':statusKey==='perhatian'?'Perhatian':statusKey==='normal'?'Normal':'Belum ada data'
  );
  return {code:String(code),name:String(name),statusKey,statusLabel};
 }).filter(row=>row.code||row.name).slice(0,200);
}
function sendStatus(force){
 if(!allowed()){unmount();return;}
 if(!iframe||!iframe.contentWindow)return;
 const items=getStatusRows();
 const payload={type:STATUS_MESSAGE,items};
 let serialized;
 try{serialized=JSON.stringify(payload);}catch(_){return;}
 if(!force&&serialized===lastPayload)return;
 lastPayload=serialized;
 try{iframe.contentWindow.postMessage(payload,TWIN_ORIGIN);}catch(_){}
}
function onMessage(event){
 if(event.origin!==TWIN_ORIGIN||!iframe||event.source!==iframe.contentWindow)return;
 const data=event.data;
 if(!data)return;
 if(data.type==='BMJ_TWIN_LITE_AUTH_REQUEST_V1'){
  if(!allowed())return;
  try{iframe.contentWindow.postMessage({type:'BMJ_TWIN_LITE_AUTHORIZED_V1'},TWIN_ORIGIN);}catch(_){}
  sendStatus(true);
  return;
 }
 if(data.type===READY_MESSAGE)sendStatus(true);
}
function mount(){
 if(!allowed())return false;
 const dashboard=document.getElementById('view-dashboard');
 const grid=document.getElementById('dash-grid');
 if(!dashboard||!grid)return false;
 const existing=document.getElementById(WRAP_ID);
 if(existing){document.body.classList.add('omodos-digitaltwin-superadmin');return true;}
 styleOnce();
 const wrap=document.createElement('section');
 wrap.id=WRAP_ID;
 wrap.setAttribute('aria-label','Tampilan 3D pabrik untuk Superadmin');
 wrap.innerHTML='<div class="dt-lite-heading"><div><h2 class="dt-lite-title">DigitalTwin · Seluruh mesin dan area pabrik</h2><p class="dt-lite-note">Tampilan statis tanpa atap dan dinding. Status berasal dari Logbook/Patrol OMODOS yang tersedia, bukan pembacaan sensor atau PLC waktu nyata.</p></div><span class="dt-lite-source" id="dt-lite-source">Menyiapkan layout 3D…</span></div><iframe class="dt-lite-frame" title="Tampilan 3D pabrik BMJ tanpa atap dan dinding" loading="eager" referrerpolicy="no-referrer"></iframe>';
 iframe=wrap.querySelector('iframe');
 iframe.src=TWIN_URL;
 iframe.addEventListener('load',()=>sendStatus(true),{once:false});
 grid.parentNode.insertBefore(wrap,grid);
 document.body.classList.add('omodos-digitaltwin-superadmin');
 if(gridObserver)gridObserver.disconnect();
 gridObserver=new MutationObserver(()=>sendStatus(false));
 gridObserver.observe(grid,{childList:true,subtree:true,attributes:true,attributeFilter:['class','data-kode','data-mesin']});
 lastPayload='';
 sendStatus(true);
 return true;
}
function unmount(){
 const wrap=document.getElementById(WRAP_ID);
 if(!wrap){document.body.classList.remove('omodos-digitaltwin-superadmin');return;}
 if(gridObserver){gridObserver.disconnect();gridObserver=null;}
 const frame=wrap.querySelector('iframe');
 if(frame)frame.src='about:blank';
 wrap.remove();iframe=null;lastPayload='';
 document.body.classList.remove('omodos-digitaltwin-superadmin');
}
function checkPermissionAndMount(){
 if(!allowed()){unmount();return;}
 const active=document.getElementById('view-dashboard')?.classList.contains('active');
 if(active&&!document.getElementById(WRAP_ID))mount();
 else if(document.getElementById(WRAP_ID))sendStatus(false);
}
function boot(){
 window.addEventListener('message',onMessage);
 checkPermissionAndMount();
 permissionTimer=window.setInterval(checkPermissionAndMount,1500);
 statusTimer=window.setInterval(()=>sendStatus(true),8000);
}
window.addEventListener('pagehide',()=>{
 window.removeEventListener('message',onMessage);
 if(permissionTimer)clearInterval(permissionTimer);
 if(statusTimer)clearInterval(statusTimer);
 if(gridObserver)gridObserver.disconnect();
},{once:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();