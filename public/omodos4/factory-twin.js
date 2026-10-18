/* OMODOS_FACTORY_TWIN_SUPERADMIN_V1
 * The home replacement is enabled only while OMODOS's own Superadmin gate passes.
 * Machine status is read from the existing latest Logbook/Patrol snapshot functions.
 * The embedded DigitalTwin monitor does not expose machine detail or editing tools.
 */
(function(){
'use strict';
if(window.__OMODOS_FACTORY_TWIN_SUPERADMIN_V1__)return;
window.__OMODOS_FACTORY_TWIN_SUPERADMIN_V1__=true;
const TWIN_ORIGIN='https://digitaltwin.offsetbmj.workers.dev';
const TWIN_URL=TWIN_ORIGIN+'/monitor.html';
const MESSAGE_INIT='OMODOS_FACTORY_MONITOR_INIT';
const MESSAGE_REVOKE='OMODOS_FACTORY_MONITOR_REVOKE';
const MESSAGE_REQUEST='OMODOS_FACTORY_MONITOR_STATUS_REQUEST';
const STYLE_HREF='/omodos4/factory-twin.css';
let panel=null,frame=null,loaded=false,lastEligible=false,lastPush=0,observer=null;

function allowed(){
 try{
  if(window.location.origin!=='https://omodos.juldigi.workers.dev')return false;
  return !!(window.OMODOS4&&typeof window.OMODOS4.isAllowed==='function'&&window.OMODOS4.isAllowed()===true);
 }catch(e){return false;}
}
function homeVisible(){
 const home=document.getElementById('view-dashboard');
 return !!(home&&home.classList.contains('active')&&!home.hidden);
}
function statusKey(value){
 const key=String(value||'none').toLowerCase();
 return ['normal','perhatian','kritikal','none'].includes(key)?key:'none';
}
function text(value,max=300){
 return String(value==null?'':value).replace(/[\u0000-\u001f\u007f]/g,' ').trim().slice(0,max);
}
function latestStatuses(){
 if(!allowed())return [];
 let machines=[];
 try{machines=typeof MACHINES!=='undefined'&&Array.isArray(MACHINES)?MACHINES:[];}catch(e){}
 return machines.slice(0,250).map(machine=>{
  let snap=null;
  try{if(typeof machineLatestStatusSnapshot_==='function')snap=machineLatestStatusSnapshot_(machine);}catch(e){}
  const key=statusKey(snap&&snap.key);
  let statusLabel='';
  try{statusLabel=typeof dashStatusLabel==='function'?dashStatusLabel(key):'';}catch(e){}
  const ts=Number(snap&&snap.ts);
  return {
   code:text(machine&&machine['Kode Mesin'],80),
   name:text(machine&&machine['Nama Mesin'],140),
   key,
   statusLabel:text(statusLabel||(key==='normal'?'Normal':key==='perhatian'?'Perlu Perhatian':key==='kritikal'?'Kritis':'Belum Ada Data'),60),
   sourceLabel:text(snap&&snap.sourceLabel||'',40),
   updatedAt:Number.isFinite(ts)&&ts>0?new Date(ts).toISOString():'',
   description:text(snap&&snap.description||'',350)
  };
 }).filter(row=>row.code||row.name);
}
function summaryRows(rows){
 const result={total:rows.length,critical:0,attention:0,normal:0,unknown:0};
 rows.forEach(row=>{
  if(row.key==='kritikal')result.critical++;
  else if(row.key==='perhatian')result.attention++;
  else if(row.key==='normal')result.normal++;
  else result.unknown++;
 });
 return result;
}
function ensureStyles(){
 if(document.querySelector('link[data-omodos-factory-twin-css]'))return;
 const link=document.createElement('link');link.rel='stylesheet';link.href=STYLE_HREF;link.dataset.omodosFactoryTwinCss='1';document.head.appendChild(link);
}
function ensurePanel(){
 const home=document.getElementById('view-dashboard');if(!home)return null;
 if(panel&&panel.isConnected)return panel;
 ensureStyles();
 panel=document.createElement('section');panel.id='omodos-factory-twin';panel.setAttribute('aria-label','Factory Status Twin untuk Superadmin');
 const head=document.createElement('div');head.className='oft-head';
 const title=document.createElement('div');title.className='oft-title';
 const mark=document.createElement('div');mark.className='oft-mark';mark.textContent='BMJ';mark.setAttribute('aria-hidden','true');
 const copy=document.createElement('div');const h=document.createElement('h2');h.textContent='Factory Status Twin';
 const sub=document.createElement('div');sub.className='oft-sub';sub.textContent='Status terakhir Logbook/Patrol · bukan data sensor real-time';
 copy.append(h,sub);title.append(mark,copy);
 const role=document.createElement('span');role.className='oft-role';role.textContent='SUPERADMIN';
 head.append(title,role);
 const wrap=document.createElement('div');wrap.className='oft-frame-wrap';
 const loading=document.createElement('div');loading.className='oft-loading';loading.textContent='Menghubungkan tampilan 3D DigitalTwin…';
 frame=document.createElement('iframe');frame.className='oft-frame';frame.title='Tampilan 3D status mesin BMJ';frame.src=TWIN_URL;frame.loading='eager';frame.referrerPolicy='strict-origin-when-cross-origin';frame.setAttribute('sandbox','allow-scripts allow-same-origin');frame.setAttribute('allow','fullscreen');
 frame.addEventListener('load',()=>{loaded=true;sendInit(true);});
 frame.addEventListener('error',()=>{loading.hidden=false;loading.textContent='Tampilan 3D belum dapat dihubungkan. Periksa deployment DigitalTwin.';});
 wrap.append(frame,loading);panel.append(head,wrap);home.appendChild(panel);
 return panel;
}
function setLoading(show,message){
 if(!panel)return;const loading=panel.querySelector('.oft-loading');if(!loading)return;
 loading.hidden=!show;if(message)loading.textContent=message;
}
function sendInit(force=false){
 if(!frame||!allowed()||!homeVisible())return;
 const now=Date.now();if(!force&&now-lastPush<12000)return;
 const statuses=latestStatuses();
 const message={type:MESSAGE_INIT,authorized:true,role:'Superadmin',statuses,summary:summaryRows(statuses)};
 try{frame.contentWindow?.postMessage(message,TWIN_ORIGIN);lastPush=now;}catch(e){}
}
function revoke(){
 try{frame?.contentWindow?.postMessage({type:MESSAGE_REVOKE,authorized:false},TWIN_ORIGIN);}catch(e){}
}
function sync(){
 const canSee=allowed(),onHome=canSee&&homeVisible();
 const body=document.body;
 if(!body)return;
 if(onHome){
  ensurePanel();
  body.classList.add('omodos-factory-twin-active');
  if(!lastEligible){sendInit(true);setLoading(!loaded,'Menghubungkan tampilan 3D DigitalTwin…');}
  else sendInit(false);
 }else{
  body.classList.remove('omodos-factory-twin-active');
  if(lastEligible)revoke();
  if(panel)panel.hidden=true;
 }
 if(panel)panel.hidden=!onHome;
 lastEligible=onHome;
}
window.addEventListener('message',event=>{
 if(event.origin!==TWIN_ORIGIN||!frame||event.source!==frame.contentWindow)return;
 if(event.data&&event.data.type===MESSAGE_REQUEST){sendInit(true);setLoading(false);}
});
function boot(){
 sync();
 if(!observer&&document.body){
  observer=new MutationObserver(()=>sync());
  observer.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class','hidden','style']});
 }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.addEventListener('pageshow',boot);
window.addEventListener('focus',boot);
window.addEventListener('visibilitychange',()=>{if(!document.hidden)boot();});
setInterval(sync,2200);
})();