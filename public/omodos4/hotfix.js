/* OMODOS 4.0 master-prompt frontend-only recovery layer.
   Additive frontend intelligence only: no login/auth/API/database mutation. */
(function(){
'use strict';

var V4_CUTOFF = Date.parse('2026-09-01T00:00:00+07:00');
var ACTIVE_WORKSPACE = 0;
var ACTIVE_FEATURE = 0;

var WORKSPACES = [
 {name:'Command Center',icon:'ph-command',features:[]},
 {name:'Machine Intelligence',icon:'ph-factory',features:[
  'Machine Health Passport','Machine Health Index','Digital Twin Lite','Machine Anatomy','Component Life Clock',
  'Failure Memory','Machine Personality','Machine Aging Curve','Machine Event Replay','Virtual Machine Room'
 ]},
 {name:'Predictive Intelligence',icon:'ph-chart-line-up',features:[
  'Failure Probability Radar','Breakdown Early Warning','Anomaly Before Failure','Recurring Failure Detector','Cross-Machine Failure Detector',
  'Silent Deterioration','Failure Signature','Predictive Confidence','Remaining Useful Life Lite','What Will Break Next?'
 ]},
 {name:'Smart Field',icon:'ph-map-pin-line',features:[
  'Technician Mission Mode','Smart Troubleshooting Wizard','Dynamic Checklist','Voice Logbook','Photo Diagnosis Assistant',
  'Before–After Proof','QR Machine Entry','NFC Maintenance Tag','Maintenance Journey','Offline Expedition Mode'
 ]},
 {name:'Sparepart Intelligence',icon:'ph-package',features:[
  'Sparepart Criticality Matrix','Stockout Risk Radar','Dead Stock Museum','Sparepart Consumption DNA','Machine–Part Graph',
  'Equivalent Part Finder','Part Photo Recognition','Shelf Digital Twin','Sparepart Reservation Predictor','Procurement Urgency Engine'
 ]},
 {name:'Reliability & Loss',icon:'ph-gauge',features:[
  'Reliability Observatory','Bad Actor Machine','Pareto That Talks','Chronic vs Acute Failure','Hidden Factory Detector',
  'Reliability Growth Curve','RCA Memory','Countermeasure Effectiveness','Failure Cost','Million-Rupiah Minute'
 ]},
 {name:'Operation Intelligence',icon:'ph-activity',features:[
  'KPI Story Mode','KPI Cause Tree','KPI Forecast','Target Recovery Simulator','Maintenance–Production Correlation',
  'Energy Anomaly Radar','Energy per Good Output','Utility Digital Twin','IPAL Intelligence','Executive One-Minute Brief'
 ]},
 {name:'People Intelligence 4.0',icon:'ph-users-three',features:[
  'Technician Skill Galaxy','Skill-to-Machine Matrix','Expert Finder','Experience Passport','Knowledge Risk',
  'Skill Gap Radar','Adaptive Learning','Mentor Matching','Troubleshooting Challenge','Competency Evidence Engine'
 ]},
 {name:'AI Intelligence',icon:'ph-brain',features:[
  'Ask OMODOS 4.0','Machine Copilot','Shift Copilot','Morning Maintenance Brief','Auto RCA Draft',
  'Troubleshooting Similarity Search','Manual Whisperer','Knowledge Auto-Harvest','Maintenance Translator','AI Skeptic Mode'
 ]},
 {name:'Improvement Intelligence',icon:'ph-trend-up',features:[
  'Improvement Opportunity Radar','Auto Kaizen Draft','Project Benefit Verification','Kaizen Before–After Timeline','Idea Marketplace',
  'Duplicate Kaizen Detector','Project Risk Radar','SGA Story Builder','Improvement Knowledge Graph','Improvement Legacy'
 ]},
 {name:'Factory Brain',icon:'ph-cpu',features:[
  'Factory Maintenance Digital Twin','Maintenance Command Center','What Changed? Mode','Time Machine','Maintenance Black Box',
  'Factory Knowledge Graph','Scenario Simulator','Maintenance War Room','Autonomous Maintenance Intelligence','OMODOS FACTORY BRAIN'
 ]}
];

var SOURCE_BY_WORKSPACE = {
  1:['Master Mesin','Logbook','Patrol','Breakdown','Sparepart','RCA','Project','People','Knowledge'],
  2:['Logbook','Patrol','Breakdown','RCA','Machine'],
  3:['Logbook','Patrol','Machine','Knowledge','RCA'],
  4:['Sparepart','Logbook','Machine'],
  5:['Logbook','Breakdown','Downtime','RCA','KPI'],
  6:['KPI','Breakdown','Energy','Run Hour','IPAL'],
  7:['People','Assessment','Logbook','RCA','Project','Knowledge'],
  8:['Logbook','Patrol','Machine','Sparepart','KPI','People','Knowledge'],
  9:['Project','Logbook','KPI','Breakdown','RCA','Knowledge'],
 10:['Machine','People','Sparepart','Failure','Knowledge','Project','KPI','Energy','IPAL']
};

var VIEW_BY_SOURCE = {
 'Master Mesin':'database','Machine':'database','Logbook':'utama','Patrol':'patrol','Breakdown':'machine-breakdown',
 'Downtime':'downtime','Sparepart':'sparepart','RCA':'rca','Project':'project-center','People':'pi-dashboard',
 'Assessment':'pi-hardskill','Knowledge':'knowledge','KPI':'kpi-department','Energy':'energy-utility',
 'Run Hour':'run-hour-comparison','IPAL':'energy-utility','Failure':'analitik'
};

function esc(v){
 return String(v==null?'':v).replace(/[&<>"']/g,function(c){
  return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
 });
}
function arr(v){return Array.isArray(v)?v:[]}
function permitted(){
 try{
  if(window.OMODOS4 && typeof window.OMODOS4.isAllowed==='function') return !!window.OMODOS4.isAllowed();
  return typeof CURRENT_USER!=='undefined' && !!CURRENT_USER && CURRENT_USER.role==='Superadmin';
 }catch(e){return false}
}
function getEntries(){
 try{
  var rows=arr(typeof ENTRIES!=='undefined'?ENTRIES:[]);
  if(typeof sotEntries==='function') rows=arr(sotEntries(rows));
  return rows.filter(function(r){var t=dateValue(r);return !t || t>=V4_CUTOFF});
 }catch(e){return []}
}
function getPatrol(){
 try{return arr(typeof PM_REPORTS!=='undefined'?PM_REPORTS:[]).filter(function(r){var t=dateValue(r);return !t || t>=V4_CUTOFF})}catch(e){return []}
}
function getMachines(){try{return arr(typeof MACHINES!=='undefined'?MACHINES:[])}catch(e){return []}}
function getBreakdown(){try{return arr(typeof MACHINE_BREAKDOWN!=='undefined'?MACHINE_BREAKDOWN:[])}catch(e){return []}}
function getPeople(){
 try{
  var p=arr(typeof PI_PERSONNEL_MASTER!=='undefined'?PI_PERSONNEL_MASTER:[]);
  return p.length?p:arr(typeof PERSONIL!=='undefined'?PERSONIL:[]);
 }catch(e){return []}
}
function getSoftAssess(){try{return arr(typeof PI_SS_SCORES!=='undefined'?PI_SS_SCORES:[])}catch(e){return []}}
function getHardAssess(){try{return arr(typeof PI_HS_ASSESSMENTS!=='undefined'?PI_HS_ASSESSMENTS:[])}catch(e){return []}}
function getKnowledge(){try{return arr(typeof KB_ENTRIES!=='undefined'?KB_ENTRIES:[])}catch(e){return []}}
function getKpi(){
 var out=[];
 try{out=out.concat(arr(typeof KPI_DEPARTMENT_YTD!=='undefined'?KPI_DEPARTMENT_YTD:[]))}catch(e){}
 try{out=out.concat(arr(typeof KPI_KERJA!=='undefined'?KPI_KERJA:[]))}catch(e){}
 return out;
}
function getEnergy(){
 var out=[];
 try{out=out.concat(arr(typeof ENERGY_UTILITY!=='undefined'?ENERGY_UTILITY:[]))}catch(e){}
 try{out=out.concat(arr(typeof ENERGY_COST_TOE!=='undefined'?ENERGY_COST_TOE:[]))}catch(e){}
 return out;
}
function getIpal(){
 try{
  var x=typeof IPAL_CURRENT!=='undefined'?IPAL_CURRENT:null;
  if(Array.isArray(x)) return x;
  return x&&typeof x==='object'?[x]:[];
 }catch(e){return []}
}
function getRunHour(){try{return arr(typeof RUN_HOUR_COMPARISON!=='undefined'?RUN_HOUR_COMPARISON:[])}catch(e){return []}}
function getProjects(){
 var out=[];
 try{
  var s=typeof PMC_STATE!=='undefined'?PMC_STATE:null;
  if(Array.isArray(s)) out=out.concat(s);
  else if(s&&typeof s==='object') Object.keys(s).forEach(function(k){if(Array.isArray(s[k]))out=out.concat(s[k])});
 }catch(e){}
 try{
  var d=typeof PMC_DETAIL!=='undefined'?PMC_DETAIL:null;
  if(Array.isArray(d)) out=out.concat(d);
 }catch(e){}
 return out;
}
function getSpare(){
 try{if(typeof sparepartRows==='function')return arr(sparepartRows())}catch(e){}
 try{return arr(typeof SPAREPART_ROWS!=='undefined'?SPAREPART_ROWS:[])}catch(e){return []}
}
function sourceCount(name){
 switch(name){
  case 'Master Mesin':case 'Machine':return getMachines().length;
  case 'Logbook':return getEntries().length;
  case 'Patrol':return getPatrol().length;
  case 'Breakdown':case 'Downtime':case 'Failure':return getBreakdown().length || getEntries().filter(isCritical).length;
  case 'Sparepart':return getSpare().length;
  case 'People':return getPeople().length;
  case 'Assessment':return getSoftAssess().length+getHardAssess().length;
  case 'Knowledge':return getKnowledge().length;
  case 'KPI':return getKpi().length;
  case 'Energy':return getEnergy().length;
  case 'Run Hour':return getRunHour().length;
  case 'IPAL':return getIpal().length;
  case 'Project':return getProjects().length;
  case 'RCA':
   try{return arr(typeof GENERAL_REPORTS!=='undefined'?GENERAL_REPORTS:[]).filter(function(x){return /rca/i.test(text(x))}).length}catch(e){return 0}
  default:return 0;
 }
}
function text(o){
 if(o==null)return '';
 if(typeof o!=='object')return String(o).toLowerCase();
 var out=[];
 Object.keys(o).slice(0,80).forEach(function(k){
  var v=o[k];
  if(v==null)return;
  if(typeof v==='string'||typeof v==='number'||typeof v==='boolean')out.push(v);
 });
 return out.join(' ').toLowerCase();
}
function val(o,keys){
 if(!o||typeof o!=='object')return '';
 for(var i=0;i<keys.length;i++){var v=o[keys[i]];if(v!=null&&String(v).trim()!=='')return v}
 return '';
}
function machineName(o){
 return String(val(o,['Nama Mesin','namaMesin','Machine','Mesin','machine','Kode Mesin','kodeMesin','KodeMesin'])||'-').trim();
}
function statusOf(o){return String(val(o,['Status','status','Status Pekerjaan','Status Mesin','statusPekerjaan'])||'').trim()}
function isDone(o){var s=statusOf(o).toLowerCase();return /selesai|done|completed|closed|close|finish/.test(s)}
function isCritical(o){
 var t=text(o);
 return !isDone(o) && /emergency|breakdown|critical|kritis|stop mesin|downtime|abnormal|anomali|high|tinggi/.test(t);
}
function dateValue(o){
 if(!o||typeof o!=='object')return 0;
 var raw=val(o,['ts','Timestamp','timestamp','UpdatedAt','updatedAt','CreatedAt','createdAt','Tanggal Laporan','tanggal','Tanggal','date']);
 if(!raw)return 0;
 var d=new Date(raw);
 if(!Number.isFinite(d.getTime()) && val(o,['waktuPatrol','Waktu','waktu'])) d=new Date(String(raw)+'T'+String(val(o,['waktuPatrol','Waktu','waktu'])));
 return Number.isFinite(d.getTime())?d.getTime():0;
}
function fmtDate(ms){
 if(!ms)return '-';
 try{return new Date(ms).toLocaleString('id-ID',{dateStyle:'medium',timeStyle:'short'})}catch(e){return new Date(ms).toLocaleString()}
}
function describe(o){
 return String(val(o,['Deskripsi Pekerjaan','Deskripsi','deskripsi','Masalah','masalah','Keterangan','keterangan','Jenis Pekerjaan','judul','Judul'])||'Record operasional').trim();
}
function recordRow(o,badge){
 return '<div class="v4-mp-row"><div><strong>'+esc(machineName(o))+'</strong><small>'+esc(fmtDate(dateValue(o)))+'</small></div><div>'+esc(describe(o))+'<div class="v4-chip-row"><span class="v4-risk-chip">'+esc(badge||statusOf(o)||'RECORDED')+'</span></div></div></div>';
}
function normalize(s){return String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
function machineMatches(row,name){
 var n=normalize(name);if(!n)return false;
 var m=normalize(machineName(row));
 return m===n || m.includes(n) || n.includes(m) || normalize(text(row)).includes(n);
}
function getMachineNames(){
 var set=new Set();
 getMachines().forEach(function(m){var n=machineName(m);if(n&&n!=='-')set.add(n)});
 getEntries().forEach(function(m){var n=machineName(m);if(n&&n!=='-')set.add(n)});
 getPatrol().forEach(function(m){var n=machineName(m);if(n&&n!=='-')set.add(n)});
 return Array.from(set).sort(function(a,b){return a.localeCompare(b,'id')});
}
function highPatrolRows(){
 return getPatrol().filter(function(r){return /critical|kritis|warning|high|tinggi|abnormal|anomali|bahaya/.test(text(r))});
}
function sparePending(){
 try{
  if(typeof sparepartRows==='function'){
   return arr(sparepartRows()).filter(function(r){return String((r.sap&&r.sap.status)||'PENDING').toUpperCase()!=='COMPLETED'}).length;
  }
 }catch(e){}
 return null;
}
function kpiAtRisk(){
 var rows=getKpi(), found=0, measured=0;
 rows.forEach(function(r){
  if(!r||typeof r!=='object')return;
  Object.keys(r).forEach(function(k){
   if(/achievement|capaian|pencapaian/i.test(k)){
    var n=parseFloat(String(r[k]).replace(',','.').replace('%',''));
    if(Number.isFinite(n)){measured++;if(n<100)found++}
   }
  });
 });
 return measured?found:null;
}
function activateView(route){
 if(!route)return false;
 try{
  if(typeof window.switchToView==='function'){window.switchToView(route);return true}
  if(typeof window.goToView==='function')return window.goToView(route)!==false;
  if(typeof switchToView==='function'){switchToView(route);return true}
  if(typeof goToView==='function')return goToView(route)!==false;
 }catch(e){}
 var v=document.getElementById('view-'+route);
 if(v){document.querySelectorAll('.view').forEach(function(x){x.classList.remove('active')});v.classList.add('active');return true}
 return false;
}
function openCopilot(){
 var fab=document.getElementById('copilot-fab');
 if(fab){fab.click();return true}
 return false;
}
function navGroup(){return document.getElementById('v4-nav-group')}
function stage(){
 var view=document.getElementById('view-omodos4');if(!view)return null;
 var s=document.getElementById('v4-safe-stage');
 if(!s){
  s=document.createElement('div');s.id='v4-safe-stage';s.setAttribute('data-v4-master-stage','1');
  var top=view.querySelector('.topbar');
  if(top)top.insertAdjacentElement('afterend',s);else view.insertBefore(s,view.firstChild);
 }
 return s;
}
function syncNav(){
 var g=navGroup();if(!g)return;
 var ok=permitted();
 g.classList.toggle('v4-authorized',ok);
 g.setAttribute('aria-hidden',ok?'false':'true');
 var sub=g.querySelector('[data-submenu="omodos4"]');
 if(!ok){
  g.querySelectorAll('[data-v4-safe-module]').forEach(function(x){x.remove()});
  return;
 }
 if(!sub)return;
 var parent=g.querySelector('.nav-parent-btn[data-group="omodos4"]');
 if(parent)parent.classList.add('open');
 sub.classList.add('open');
 sub.style.maxHeight='none';sub.style.overflow='visible';sub.style.display='flex';
 var root=g.querySelector('[data-v4-root]');
 if(root){root.setAttribute('aria-label','Command Center');root.classList.add('v4-nav-btn')}
 var existing=sub.querySelectorAll('[data-v4-safe-module]');
 if(existing.length===10)return;
 existing.forEach(function(x){x.remove()});
 for(var i=1;i<WORKSPACES.length;i++){
  var b=document.createElement('button');
  b.type='button';b.className='nav-btn v4-nav-btn v4-module-btn';
  b.setAttribute('data-v4-safe-module',String(i));
  b.setAttribute('data-view','omodos4');
  b.setAttribute('aria-label',WORKSPACES[i].name);
  b.innerHTML='<span class="ico"><i class="ph-bold '+WORKSPACES[i].icon+'"></i></span> '+esc(WORKSPACES[i].name);
  sub.appendChild(b);
 }
}
function setActiveNav(idx){
 var g=navGroup();if(!g)return;
 var root=g.querySelector('[data-v4-root]');
 if(root)root.classList.toggle('active',idx===0);
 g.querySelectorAll('[data-v4-safe-module]').forEach(function(b){
  b.classList.toggle('active',Number(b.getAttribute('data-v4-safe-module'))===idx);
 });
 var parent=g.querySelector('.nav-parent-btn[data-group="omodos4"]');
 if(parent)parent.classList.add('active','open');
}
function card(label,value,note,icon){
 return '<div class="v4-card"><div class="v4-k"><i class="ph-bold '+icon+'"></i> '+esc(label)+'</div><div class="v4-v">'+esc(value)+'</div><div class="v4-note">'+esc(note)+'</div></div>';
}
function renderCommandCenter(){
 if(!permitted())return false;
 ACTIVE_WORKSPACE=0;ACTIVE_FEATURE=0;setActiveNav(0);
 var view=document.getElementById('view-omodos4');if(!view)return false;
 view.classList.remove('v4-safe-module-open','v4-feature-open');view.classList.add('v4-master-active');
 var s=stage();if(s){s.innerHTML='';s.style.display='none'}
 var entries=getEntries(),patrol=getPatrol(),open=entries.filter(function(e){return !isDone(e)}),critical=open.filter(isCritical);
 var cm=new Set(critical.map(machineName).filter(function(x){return x&&x!=='-'}));
 var bd=getBreakdown(),pr=highPatrolRows(),sp=sparePending(),ka=kpiAtRisk();
 var summary=document.getElementById('v4-summary');
 if(summary)summary.innerHTML=[
  card('Critical Machines',cm.size,'Mesin dengan sinyal kritis aktif dari data existing.','ph-warning'),
  card('Active Breakdown',bd.length||critical.length,'Breakdown/critical maintenance records yang tersedia.','ph-wrench'),
  card('Predictive Risks',pr.length,'Temuan Patrol/Predictive dengan sinyal abnormal atau prioritas tinggi.','ph-waveform'),
  card('Sparepart Risks',sp==null?'—':sp,sp==null?'Sumber sparepart belum dimuat.':'Transaksi/collection yang belum selesai.','ph-package'),
  card('KPI at Risk',ka==null?'—':ka,ka==null?'Capaian KPI belum cukup untuk dibandingkan.':'Record achievement di bawah 100%.','ph-target'),
  card('Open High-Priority Actions',critical.length,'Derived dari record maintenance kritis yang belum selesai.','ph-list-checks')
 ].join('');
 var look=document.getElementById('v4-look-at');
 var attention=critical.concat(pr).sort(function(a,b){return dateValue(b)-dateValue(a)}).slice(0,10);
 if(look)look.innerHTML=attention.length?attention.map(function(x){return recordRow(x,'HUMAN INSPECTION')}).join(''):'<div class="v4-empty">Tidak ada sinyal prioritas tinggi pada data yang sedang dimuat.</div>';
 var changed=document.getElementById('v4-changed'), since=Date.now()-24*3600*1000;
 var changes=entries.concat(patrol).filter(function(x){return dateValue(x)>=since}).sort(function(a,b){return dateValue(b)-dateValue(a)}).slice(0,10);
 if(changed)changed.innerHTML=changes.length?changes.map(function(x){return recordRow(x,'RECORDED')}).join(''):'<div class="v4-empty">Tidak ada perubahan tercatat dalam 24 jam terakhir.</div>';
 var latest=document.getElementById('v4-latest');
 var latestRows=entries.concat(patrol).sort(function(a,b){return dateValue(b)-dateValue(a)}).slice(0,12);
 if(latest)latest.innerHTML=latestRows.length?latestRows.map(function(x){return recordRow(x,'SOURCE OF TRUTH')}).join(''):'<div class="v4-empty">Belum ada record untuk diringkas.</div>';
 return true;
}
function featureNumber(workspaceIndex,localIndex){return (workspaceIndex-1)*10+localIndex+1}
function renderWorkspace(idx){
 if(!permitted())return false;
 idx=Number(idx)||0;if(idx<=0)return renderCommandCenter();
 var ws=WORKSPACES[idx];if(!ws)return false;
 ACTIVE_WORKSPACE=idx;ACTIVE_FEATURE=0;setActiveNav(idx);
 var view=document.getElementById('view-omodos4'),s=stage();if(!view||!s)return false;
 view.classList.add('v4-master-active','v4-safe-module-open');view.classList.remove('v4-feature-open');
 var sources=SOURCE_BY_WORKSPACE[idx]||[];
 var sourceChips=sources.map(function(x){return '<span class="v4-source-chip">'+esc(x)+' <b>'+sourceCount(x)+'</b></span>'}).join('');
 var tiles=ws.features.map(function(name,i){
  var n=featureNumber(idx,i);
  return '<button type="button" class="v4-feature-tile" data-v4-feature="'+n+'" data-v4-route="omodos4"><span class="n">'+String(n).padStart(3,'0')+'</span><strong>'+esc(name)+'</strong><small>Analisis V4 dari data existing • tanpa double input</small></button>';
 }).join('');
 s.innerHTML='<div class="v4-card v4-workspace-card"><div class="v4-module-head"><div><div class="v4-eyebrow">OMODOS 4.0 • WORKSPACE</div><h2><i class="ph-bold '+ws.icon+'"></i> '+esc(ws.name)+'</h2><p>Workspace intelligence yang menghubungkan data existing. Modul lama tetap menjadi source of truth.</p></div><button class="btn btn-sm" data-v4-back-command><i class="ph-bold ph-house"></i> Command Center</button></div><div class="v4-source-strip">'+sourceChips+'</div><div class="v4-feature-grid">'+tiles+'</div></div>';
 s.style.display='block';
 try{s.scrollIntoView({block:'start',behavior:'auto'})}catch(e){}
 return true;
}
function featureByNumber(n){
 n=Number(n);
 var wi=Math.floor((n-1)/10)+1,li=(n-1)%10;
 if(wi<1||wi>=WORKSPACES.length)return null;
 return {n:n,wi:wi,li:li,name:WORKSPACES[wi].features[li],workspace:WORKSPACES[wi]};
}
function sourcePanel(f){
 var src=SOURCE_BY_WORKSPACE[f.wi]||[];
 return '<div class="v4-evidence-grid">'+src.map(function(name){
  var c=sourceCount(name),state=c>0?'RECORDED':'NOT AVAILABLE';
  return '<div class="v4-evidence"><span>'+esc(name)+'</span><strong>'+esc(c)+'</strong><small>'+state+'</small></div>';
 }).join('')+'</div>';
}
function openButtons(f){
 var used=new Set(),html='';
 (SOURCE_BY_WORKSPACE[f.wi]||[]).forEach(function(name){
  var v=VIEW_BY_SOURCE[name];if(!v||used.has(v))return;used.add(v);
  html+='<button class="btn btn-sm" data-v4-open-existing="'+esc(v)+'"><i class="ph-bold ph-arrow-square-out"></i> Buka '+esc(name)+'</button>';
 });
 if(f.wi===8)html+='<button class="btn btn-sm" data-v4-open-copilot><i class="ph-bold ph-brain"></i> Buka Copilot Existing</button>';
 return '<div class="v4-actions">'+html+'</div>';
}
function genericEvidence(f){
 var rows=[];
 if(f.wi===1)rows=getEntries();
 else if(f.wi===2)rows=getEntries().concat(getPatrol());
 else if(f.wi===3)rows=getPatrol().concat(getEntries());
 else if(f.wi===4)rows=getSpare();
 else if(f.wi===5)rows=getBreakdown().concat(getEntries().filter(isCritical));
 else if(f.wi===6)rows=getKpi().concat(getEnergy()).concat(getIpal());
 else if(f.wi===7)rows=getPeople().concat(getHardAssess()).concat(getSoftAssess());
 else if(f.wi===8)rows=getEntries().concat(getKnowledge());
 else if(f.wi===9)rows=getProjects().concat(getEntries().filter(isCritical));
 else rows=getEntries().concat(getPatrol());
 rows=rows.slice().sort(function(a,b){return dateValue(b)-dateValue(a)}).slice(0,8);
 if(!rows.length)return '<div class="v4-empty">BELUM CUKUP DATA — fitur tidak membuat angka atau histori palsu.</div>';
 return '<div class="v4-detail-list">'+rows.map(function(r){return recordRow(r,'EVIDENCE')}).join('')+'</div>';
}
function renderMachinePassport(f){
 var names=getMachineNames();
 if(!names.length)return '<div class="v4-empty">BELUM CUKUP DATA — master mesin/logbook/patrol belum tersedia.</div>';
 var current=(document.getElementById('v4-machine-select')||{}).value||names[0];
 if(names.indexOf(current)<0)current=names[0];
 var m=getMachines().find(function(x){return machineMatches(x,current)})||{};
 var entries=getEntries().filter(function(x){return machineMatches(x,current)});
 var patrol=getPatrol().filter(function(x){return machineMatches(x,current)});
 var open=entries.filter(function(x){return !isDone(x)}),crit=entries.filter(isCritical);
 var events=entries.concat(patrol).sort(function(a,b){return dateValue(b)-dateValue(a)});
 var opts=names.map(function(n){return '<option'+(n===current?' selected':'')+'>'+esc(n)+'</option>'}).join('');
 var identity=[
  ['Code',val(m,['Kode Mesin','kodeMesin','KodeMesin'])||'NOT AVAILABLE'],
  ['Name',val(m,['Nama Mesin','namaMesin'])||current],
  ['Area',val(m,['Lokasi Mesin','Lokasi','Area','lokasi'])||'NOT AVAILABLE'],
  ['Model',val(m,['Model','model','Tipe','Type'])||'NOT AVAILABLE'],
  ['Specs',val(m,['Spesifikasi','Spesifikasi Mesin','spec','Specs'])||'NOT AVAILABLE'],
  ['Manual',val(m,['Manual','Manual URL','manualUrl','Link Manual'])?'RECORDED':'NOT AVAILABLE']
 ];
 return '<div class="v4-passport-toolbar"><label>Mesin<select id="v4-machine-select">'+opts+'</select></label></div>'+
 '<div class="v4-passport-grid">'+
  '<div class="v4-subcard"><h3>Identity</h3>'+identity.map(function(x){return '<div class="v4-kv"><span>'+esc(x[0])+'</span><b>'+esc(x[1])+'</b></div>'}).join('')+'</div>'+
  '<div class="v4-subcard"><h3>Current Condition</h3><div class="v4-kv"><span>Open issue</span><b>'+open.length+'</b></div><div class="v4-kv"><span>Critical signal</span><b>'+crit.length+'</b></div><div class="v4-kv"><span>Latest activity</span><b>'+esc(events[0]?fmtDate(dateValue(events[0])):'NOT AVAILABLE')+'</b></div><div class="v4-kv"><span>Health interpretation</span><b>'+(crit.length?'HUMAN INSPECTION RECOMMENDED':(events.length?'NO CRITICAL SIGNAL IN LOADED DATA':'BELUM CUKUP DATA'))+'</b></div></div>'+
  '<div class="v4-subcard"><h3>Reliability Evidence</h3><div class="v4-kv"><span>Logbook</span><b>'+entries.length+'</b></div><div class="v4-kv"><span>Patrol</span><b>'+patrol.length+'</b></div><div class="v4-kv"><span>Breakdown/critical</span><b>'+crit.length+'</b></div><p class="v4-muted">Derived from existing records; tidak mengarang MTBF/MTTR jika datanya tidak tersedia pada konteks mesin ini.</p></div>'+
 '</div><h3 class="v4-detail-heading">Latest Machine Evidence</h3>'+
 (events.length?events.slice(0,10).map(function(x){return recordRow(x,'RECORDED')}).join(''):'<div class="v4-empty">NOT AVAILABLE</div>');
}
function renderFailureMemory(){
 var rows=getEntries().filter(function(x){return isCritical(x)||/repair|problem|fault|rusak|gangguan/.test(text(x))});
 var groups={};
 rows.forEach(function(r){
  var key=normalize(describe(r)).split(' ').slice(0,8).join(' ');
  if(!key)return;
  if(!groups[key])groups[key]=[];
  groups[key].push(r);
 });
 var list=Object.keys(groups).map(function(k){return {key:k,rows:groups[k]}}).filter(function(g){return g.rows.length>1}).sort(function(a,b){return b.rows.length-a.rows.length}).slice(0,12);
 if(!list.length)return '<div class="v4-empty">BELUM CUKUP DATA — belum ada pola kegagalan berulang yang dapat dibandingkan.</div>';
 return '<div class="v4-detail-list">'+list.map(function(g){return '<div class="v4-memory"><strong>'+esc(g.rows[0]?describe(g.rows[0]):g.key)+'</strong><span>'+g.rows.length+' kasus mirip</span><small>Mesin: '+esc(Array.from(new Set(g.rows.map(machineName))).slice(0,4).join(', '))+'</small></div>'}).join('')+'</div>';
}
function riskRows(){
 var names=getMachineNames(),entries=getEntries(),patrol=getPatrol();
 return names.map(function(name){
  var e=entries.filter(function(x){return machineMatches(x,name)}),p=patrol.filter(function(x){return machineMatches(x,name)});
  var critical=e.filter(isCritical).length,abnormal=p.filter(function(x){return /critical|kritis|warning|high|tinggi|abnormal|anomali/.test(text(x))}).length;
  var open=e.filter(function(x){return !isDone(x)}).length;
  var score=critical*3+abnormal*2+Math.min(open,5);
  return {name:name,critical:critical,abnormal:abnormal,open:open,score:score};
 }).filter(function(x){return x.score>0}).sort(function(a,b){return b.score-a.score});
}
function renderRiskRadar(){
 var rows=riskRows();
 if(!rows.length)return '<div class="v4-empty">BELUM CUKUP DATA — tidak ada sinyal risiko yang dapat dihitung dari histori yang dimuat.</div>';
 return '<div class="v4-table-lite"><div class="v4-table-head"><span>Machine</span><span>Risk Index</span><span>Evidence</span></div>'+rows.slice(0,20).map(function(x){
  return '<div class="v4-table-row"><strong>'+esc(x.name)+'</strong><b>'+x.score+'</b><span>'+x.critical+' critical • '+x.abnormal+' patrol abnormal • '+x.open+' open</span></div>';
 }).join('')+'</div><p class="v4-muted">DERIVED index = critical×3 + abnormal patrol×2 + open issue (maks. 5). Ini bukan probabilitas kegagalan dan bukan kepastian.</p>';
}
function renderSpareCritical(){
 var rows=getSpare();
 if(!rows.length)return '<div class="v4-empty">BELUM CUKUP DATA — source sparepart belum dimuat.</div>';
 var by={};
 rows.forEach(function(r){
  var key=String(val(r,['materialNumber','Material Number SAP','nomor','sap','kode'])||val(r,['materialName','Nama Material','nama'])||'Unknown');
  if(!by[key])by[key]={key:key,name:String(val(r,['materialName','Nama Material','nama'])||key),count:0,machines:new Set()};
  by[key].count++;
  var m=machineName(r);if(m&&m!=='-')by[key].machines.add(m);
 });
 var list=Object.values(by).sort(function(a,b){return b.count-a.count}).slice(0,25);
 return '<div class="v4-table-lite"><div class="v4-table-head"><span>Material</span><span>Usage</span><span>Machine Reach</span></div>'+list.map(function(x){return '<div class="v4-table-row"><strong>'+esc(x.name)+'</strong><b>'+x.count+'</b><span>'+x.machines.size+' mesin</span></div>'}).join('')+'</div><p class="v4-muted">DERIVED dari penggunaan/collection yang tersedia; criticality engineering final tetap membutuhkan validasi manusia.</p>';
}
function renderReliability(){
 var rows=riskRows();
 if(!rows.length)return '<div class="v4-empty">BELUM CUKUP DATA untuk Reliability Observatory.</div>';
 return '<div class="v4-table-lite"><div class="v4-table-head"><span>Machine</span><span>Attention</span><span>Basis</span></div>'+rows.slice(0,20).map(function(x){return '<div class="v4-table-row"><strong>'+esc(x.name)+'</strong><b>'+x.score+'</b><span>'+x.critical+' critical / '+x.open+' open</span></div>'}).join('')+'</div><p class="v4-muted">Untuk MTBF/MTTR/availability numerik, gunakan source KPI/Breakdown existing melalui tombol di bawah agar formula resmi tetap menjadi source of truth.</p>';
}
function renderPeople(){
 var people=getPeople(),hs=getHardAssess(),ss=getSoftAssess();
 if(!people.length)return '<div class="v4-empty">BELUM CUKUP DATA — master personil belum dimuat.</div>';
 return '<div class="v4-statline"><div><b>'+people.length+'</b><span>Personnel</span></div><div><b>'+hs.length+'</b><span>Hard-skill records</span></div><div><b>'+ss.length+'</b><span>Soft-skill records</span></div></div><p class="v4-muted">Skill Galaxy menghubungkan master personil dan assessment existing. Data kompetensi tidak diduplikasi oleh OMODOS 4.0.</p>';
}
function renderAiBrief(){
 var entries=getEntries(),crit=entries.filter(isCritical),latest=entries.slice().sort(function(a,b){return dateValue(b)-dateValue(a)}).slice(0,5);
 return '<div class="v4-ai-brief"><div class="v4-eyebrow">DETERMINISTIC FALLBACK</div><h3>Maintenance brief dari data existing</h3><p>'+crit.length+' critical/open signals terdeteksi pada dataset aktif. '+latest.length+' record terakhir tersedia untuk konteks.</p><p class="v4-muted">AI provider existing tetap dipertahankan. OMODOS 4.0 tidak menulis data operasional secara otomatis dan rekomendasi wajib dapat ditelusuri ke source.</p></div>';
}
function renderImprovement(){
 var recurring=renderFailureMemory();
 return '<p class="v4-muted">Opportunity Radar mencari failure berulang dan issue belum selesai sebagai kandidat improvement. Kandidat bukan Kaizen otomatis; keputusan tetap oleh manusia.</p>'+recurring;
}
function renderWhatChanged(){
 var now=Date.now(),since=now-24*3600*1000;
 var rows=getEntries().concat(getPatrol()).filter(function(x){return dateValue(x)>=since}).sort(function(a,b){return dateValue(b)-dateValue(a)});
 return '<div class="v4-toolbar"><button class="btn btn-sm active" data-v4-change-window="24">24 Jam</button><button class="btn btn-sm" data-v4-change-window="168">7 Hari</button></div><div id="v4-what-changed-list">'+(rows.length?rows.slice(0,50).map(function(x){return recordRow(x,'RECORDED')}).join(''):'<div class="v4-empty">Tidak ada perubahan tercatat pada window ini.</div>')+'</div>';
}
function renderTimeMachine(){
 var now=new Date(),local=new Date(now.getTime()-now.getTimezoneOffset()*60000).toISOString().slice(0,16);
 return '<div class="v4-time-machine"><label>Tanggal & Waktu<input id="v4-time-machine-at" type="datetime-local" value="'+esc(local)+'"></label><button class="btn btn-primary btn-sm" data-v4-time-machine-run><i class="ph-bold ph-clock-counter-clockwise"></i> Rekonstruksi</button></div><div id="v4-time-machine-result"><div class="v4-empty">Pilih waktu lalu jalankan rekonstruksi. Sistem hanya memakai record yang benar-benar tersedia.</div></div>';
}
function runTimeMachine(){
 var input=document.getElementById('v4-time-machine-at'),target=input?Date.parse(input.value):NaN,out=document.getElementById('v4-time-machine-result');
 if(!out||!Number.isFinite(target))return;
 var names=getMachineNames(),events=getEntries().concat(getPatrol()).filter(function(r){var t=dateValue(r);return t&&t<=target});
 var latestBy={};
 events.sort(function(a,b){return dateValue(a)-dateValue(b)}).forEach(function(r){var n=machineName(r);if(n&&n!=='-')latestBy[n]=r});
 var cards=names.slice(0,60).map(function(n){
  var r=latestBy[n];
  return '<div class="v4-tm-card"><strong>'+esc(n)+'</strong>'+(r?'<span>'+esc(fmtDate(dateValue(r)))+'</span><p>'+esc(describe(r))+'</p><small>RECORDED</small>':'<p>NOT AVAILABLE pada waktu terpilih.</p><small>NOT AVAILABLE</small>')+'</div>';
 }).join('');
 out.innerHTML=cards?'<div class="v4-tm-grid">'+cards+'</div>':'<div class="v4-empty">NOT AVAILABLE — tidak ada histori yang tercatat sebelum waktu tersebut.</div>';
}
function brainCounts(){
 return [
  ['Machines',getMachines().length||getMachineNames().length,'database'],
  ['People',getPeople().length,'pi-dashboard'],
  ['Spareparts',getSpare().length,'sparepart'],
  ['Failures',getEntries().filter(isCritical).length,'analitik'],
  ['Knowledge',getKnowledge().length,'knowledge'],
  ['Projects',getProjects().length,'project-center'],
  ['KPI',getKpi().length,'kpi-department'],
  ['Energy',getEnergy().length,'energy-utility'],
  ['IPAL',getIpal().length,'energy-utility']
 ];
}
function renderBrain(){
 return '<div class="v4-brain-canvas"><div class="v4-brain-center"><i class="ph-bold ph-cpu"></i><strong>OMODOS</strong><small>FACTORY BRAIN</small></div><div class="v4-brain-nodes">'+brainCounts().map(function(x){return '<button data-v4-open-existing="'+x[2]+'"><span>'+esc(x[0])+'</span><b>'+x[1]+'</b><small>'+(x[1]?'RECORDED / DERIVED':'NOT AVAILABLE')+'</small></button>'}).join('')+'</div></div><p class="v4-muted">Fallback graph yang seluruh node-nya menuju data nyata. Tidak ada node dekoratif atau data acak.</p>';
}
function renderWarRoom(){
 var rows=getEntries().filter(isCritical).sort(function(a,b){return dateValue(b)-dateValue(a)}).slice(0,20);
 return '<div class="v4-war-room"><div class="v4-warning-box"><strong>Superadmin-triggered coordination view</strong><p>Recovery frontend ini belum membuat record War Room baru di backend. Data operasional tidak diubah. Incident candidates di bawah berasal dari Logbook existing.</p></div>'+(rows.length?rows.map(function(x){return recordRow(x,'INCIDENT CANDIDATE')}).join(''):'<div class="v4-empty">Tidak ada incident candidate kritis pada data yang dimuat.</div>')+'</div>';
}
function renderFeature(n){
 if(!permitted())return false;
 var f=featureByNumber(n);if(!f)return false;
 ACTIVE_WORKSPACE=f.wi;ACTIVE_FEATURE=f.n;setActiveNav(f.wi);
 var s=stage(),view=document.getElementById('view-omodos4');if(!s||!view)return false;
 view.classList.add('v4-master-active','v4-safe-module-open','v4-feature-open');
 var body='';
 if(f.n===1)body=renderMachinePassport(f);
 else if(f.n===6)body=renderFailureMemory();
 else if(f.n===11||f.n===12||f.n===20)body=renderRiskRadar();
 else if(f.n===31||f.n===32||f.n===34||f.n===40)body=renderSpareCritical();
 else if(f.n===41||f.n===42||f.n===43||f.n===44||f.n===46)body=renderReliability();
 else if(f.n>=61&&f.n<=70)body=renderPeople();
 else if(f.n>=71&&f.n<=80)body=renderAiBrief()+genericEvidence(f);
 else if(f.n>=81&&f.n<=90)body=renderImprovement();
 else if(f.n===93)body=renderWhatChanged();
 else if(f.n===94)body=renderTimeMachine();
 else if(f.n===96||f.n===100)body=renderBrain();
 else if(f.n===98)body=renderWarRoom();
 else body=genericEvidence(f);
 s.innerHTML='<div class="v4-card v4-detail-card"><div class="v4-module-head"><div><div class="v4-eyebrow">OMODOS 4.0 • '+esc(f.workspace.name)+'</div><h2><span class="v4-feature-no">'+String(f.n).padStart(3,'0')+'</span> '+esc(f.name)+'</h2><p>Read • connect • analyze dari source-of-truth existing. Tidak ada random/fake production data.</p></div><button class="btn btn-sm" data-v4-back-workspace="'+f.wi+'"><i class="ph-bold ph-arrow-left"></i> Kembali</button></div>'+sourcePanel(f)+'<div class="v4-detail-body">'+body+'</div>'+openButtons(f)+'</div>';
 s.style.display='block';
 try{s.scrollIntoView({block:'start',behavior:'auto'})}catch(e){}
 return true;
}
function updateWhatChanged(hours){
 var since=Date.now()-Number(hours||24)*3600*1000,out=document.getElementById('v4-what-changed-list');
 if(!out)return;
 var rows=getEntries().concat(getPatrol()).filter(function(x){return dateValue(x)>=since}).sort(function(a,b){return dateValue(b)-dateValue(a)});
 out.innerHTML=rows.length?rows.slice(0,80).map(function(x){return recordRow(x,'RECORDED')}).join(''):'<div class="v4-empty">Tidak ada perubahan tercatat pada window ini.</div>';
}
function clickHandler(e){
 var root=e.target.closest&&e.target.closest('#v4-nav-group [data-v4-root]');
 if(root){
  if(!permitted()){e.preventDefault();e.stopImmediatePropagation();return}
  e.preventDefault();activateView('omodos4');renderCommandCenter();return;
 }
 var m=e.target.closest&&e.target.closest('#v4-nav-group [data-v4-safe-module]');
 if(m){
  if(!permitted()){e.preventDefault();e.stopImmediatePropagation();return}
  e.preventDefault();activateView('omodos4');renderWorkspace(Number(m.getAttribute('data-v4-safe-module')));return;
 }
 var feature=e.target.closest&&e.target.closest('[data-v4-feature]');
 if(feature){e.preventDefault();renderFeature(Number(feature.getAttribute('data-v4-feature')));return}
 var back=e.target.closest&&e.target.closest('[data-v4-back-workspace]');
 if(back){e.preventDefault();renderWorkspace(Number(back.getAttribute('data-v4-back-workspace')));return}
 if(e.target.closest&&e.target.closest('[data-v4-back-command]')){e.preventDefault();renderCommandCenter();return}
 var open=e.target.closest&&e.target.closest('[data-v4-open-existing]');
 if(open){e.preventDefault();activateView(open.getAttribute('data-v4-open-existing'));return}
 if(e.target.closest&&e.target.closest('[data-v4-open-copilot]')){e.preventDefault();openCopilot();return}
 var tw=e.target.closest&&e.target.closest('[data-v4-time-machine-run]');
 if(tw){e.preventDefault();runTimeMachine();return}
 var cw=e.target.closest&&e.target.closest('[data-v4-change-window]');
 if(cw){e.preventDefault();updateWhatChanged(cw.getAttribute('data-v4-change-window'));return}
}
document.addEventListener('click',clickHandler,true);
document.addEventListener('change',function(e){
 if(e.target&&e.target.id==='v4-machine-select'&&ACTIVE_FEATURE===1)renderFeature(1);
},true);
window.addEventListener('storage',syncNav);
document.addEventListener('visibilitychange',function(){if(!document.hidden)syncNav()});

var previousRender=window.renderOmodos4;
window.OMODOS4=Object.assign(window.OMODOS4||{},{
 version:'4.0-master-recovery-100',
 cutoff:'2026-09-01 WIB',
 workspaces:WORKSPACES,
 featureCount:100,
 isAllowed:(window.OMODOS4&&window.OMODOS4.isAllowed)||permitted,
 render:renderCommandCenter,
 renderWorkspace:renderWorkspace,
 renderFeature:renderFeature,
 previousRender:previousRender
});
window.renderOmodos4=renderCommandCenter;

function boot(){syncNav();if(permitted()&&document.getElementById('view-omodos4')&&document.getElementById('view-omodos4').classList.contains('active'))renderCommandCenter()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){boot();setTimeout(boot,800);setTimeout(syncNav,2400)});
else{boot();setTimeout(syncNav,800)}
setInterval(syncNav,5000);
})();