(()=>{'use strict';
const modules=[
['Command Center','ph-command',['Ringkasan Eksekutif|dashboard','Things to Look At|analitik','What Changed?|downtime','Latest Intelligence|insights-hub','Alert Prioritas|diagnostic','Status Mesin Terkini|dashboard','Aktivitas Hari Ini|report','KPI Utama|kpi-department','Peta Risiko|correlation']],
['Machine Intelligence','ph-factory',['Machine Health Passport|database','Status Mesin Real-time|dashboard','Riwayat Mesin|utama','Failure Memory|knowledge','Knowledge Graph Mesin|knowledge-graph','Korelasi Kerusakan|correlation','Diagnostic Wizard|diagnostic','Expert Finder|expert-finder','Maintenance Wikipedia|wiki']],
['Predictive Intelligence','ph-chart-line-up',['Prediksi Risiko|analitik','Tren Downtime|downtime','Pola Kerusakan|correlation','Prediksi Sparepart|sparepart','Anomali Mesin|diagnostic','Early Warning|dashboard','Forecast KPI|kpi-department','Reliability Trend|machine-breakdown']],
['Smart Field','ph-map-pin-line',['Input Logbook|input','View Logbook|utama','Patrol Digital|patrol','Corrective Report|corrective-report','Project Center|project-center','Foto Lapangan|input','Riwayat Patrol|patrol','Temuan Lapangan|patrol']],
['Sparepart Intelligence','ph-package',['Master Sparepart|sparepart','Pencarian Material|sparepart','Daily Collection|sparepart','Kebutuhan Material|sparepart','Riwayat Pemakaian|sparepart','Lokasi Sparepart|sparepart','Status SAP|sparepart','Analisis Konsumsi|sparepart']],
['Reliability & Loss','ph-gauge',['MTBF|machine-breakdown','MTTR|machine-breakdown','Lost Time|kpi-department','Breakdown|machine-breakdown','Pareto Loss|analitik','Downtime Detail|downtime','Durasi Pekerjaan|durasi','Record YTD|record-ytd']],
['Operation Intelligence','ph-activity',['Run Hour Comparison|run-hour-comparison','Energy & Utility|energy-utility','Biaya Energi|energy-cost-toe','KPI Department|kpi-department','Input KPI|kpi-input','WTP / IPAL|energy-utility','Machine Breakdown|machine-breakdown','Operation Trend|analitik']],
['People Intelligence 4.0','ph-users-three',['PI Dashboard|pi-dashboard','Master Personil|pi-personnel','Soft Skill|pi-softskill','Hard Skill|pi-hardskill','Smart Resume|pi-smart-resume','Expert Finder|expert-finder','People Hub|people-hub','Meeting|meeting']],
['AI Intelligence','ph-brain',['Ask OMODOS|copilot','AI Internal|copilot','Diagnostic AI|diagnostic','Smart Resume|pi-smart-resume','Knowledge Assistant|knowledge','Analisis Korelasi|correlation','Ringkasan Halaman|copilot','Bantuan Kontekstual|copilot']],
['Improvement Intelligence','ph-trend-up',['Project Center|project-center','Improvement Backlog|project-center','Corrective Action|corrective-report','Opportunity Finder|analitik','Before / After|project-center','Benefit Tracking|project-center','Lesson Learned|knowledge','Meeting Action|meeting']],
['Factory Brain','ph-cpu',['Knowledge Graph|knowledge-graph','Maintenance Wikipedia|wiki','Knowledge Base|knowledge','Correlation Engine|correlation','Data Mesin|database','Data Terpadu|insights-hub','Search Intelligence|knowledge','Source Traceability|knowledge-graph']],
['Maintenance War Room','ph-monitor-play',['Digital War Room|analitik','Critical Machines|dashboard','Open Logbook|utama','Patrol Alert|patrol','Sparepart Pending|sparepart','Downtime Watch|downtime','KPI Watch|kpi-department','Time Machine|record-ytd','Command Briefing|meeting']]
];
const allowed=()=>{try{return !!(window.OMODOS4&&window.OMODOS4.isAllowed&&window.OMODOS4.isAllowed())}catch(_){return false}};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function syncAccess(){
 const group=document.getElementById('v4-nav-group'); if(!group)return;
 const ok=allowed(), flag=ok?'0':'1', display=ok?'':'none'; if(group.dataset.v4Denied!==flag)group.dataset.v4Denied=flag; if(group.style.display!==display)group.style.display=display;
 if(!ok){
   document.querySelectorAll('[data-v4-module]').forEach(n=>n.remove());
   if(document.querySelector('#view-omodos4.active')){document.querySelector('[data-view="dashboard"]')?.click()}
 }
}
function ensureMenu(){
 if(!allowed())return syncAccess();
 const sub=document.querySelector('#v4-nav-group [data-submenu="omodos4"]'); if(!sub||sub.dataset.recovered==='1')return;
 sub.dataset.recovered='1';
 modules.slice(1).forEach(([name,icon],i)=>{
   const b=document.createElement('button'); b.type='button'; b.className='nav-btn v4-nav-btn v4-module-btn';
   b.dataset.v4Module=String(i+1); b.setAttribute('aria-label',name);
   b.innerHTML='<span class="ico"><i class="ph-bold '+icon+'"></i></span> '+esc(name); sub.appendChild(b);
 });
}
function stage(){
 const view=document.getElementById('view-omodos4'); if(!view)return null;
 let s=document.getElementById('v4-module-stage'); if(!s){s=document.createElement('div');s.id='v4-module-stage';view.appendChild(s)} return s;
}
function renderModule(index){
 if(!allowed())return syncAccess();
 const item=modules[index]||modules[0], s=stage(); if(!s)return;
 const features=item[2];
 s.innerHTML='<div class="v4-card"><div class="v4-module-head"><div><div class="v4-eyebrow">OMODOS 4.0 • MODUL '+(index+1)+'</div><h2><i class="ph-bold '+item[1]+'"></i> '+esc(item[0])+'</h2><p>Terhubung ke data dan halaman existing agar tidak terjadi input ganda.</p></div><button class="btn btn-sm" type="button" data-v4-back><i class="ph-bold ph-command"></i> Command Center</button></div><div class="v4-feature-grid">'+features.map((x,n)=>{const [label,target]=x.split('|');return '<button type="button" class="v4-feature-tile" data-v4-target="'+esc(target)+'"><span class="n">'+String(n+1).padStart(2,'0')+'</span><strong>'+esc(label)+'</strong><small>Pilih untuk membuka sumber data/fungsi terkait.</small></button>'}).join('')+'</div></div>';
 s.scrollIntoView({behavior:'smooth',block:'start'});
}
function openRoot(){
 const root=document.querySelector('#v4-nav-group [data-view="omodos4"]');
 if(root&&!document.querySelector('#view-omodos4.active'))root.click();
}
document.addEventListener('click',e=>{
 const m=e.target.closest('[data-v4-module]'); if(m){e.preventDefault();e.stopImmediatePropagation();if(!allowed())return syncAccess();openRoot();setTimeout(()=>renderModule(Number(m.dataset.v4Module)),0);return}
 const back=e.target.closest('[data-v4-back]');if(back){stage()?.replaceChildren();window.renderOmodos4?.();return}
 const tile=e.target.closest('[data-v4-target]');if(tile){const target=tile.dataset.v4Target;if(target==='copilot'){document.getElementById('copilot-toggle')?.click();return}document.querySelector('.nav-btn[data-view="'+CSS.escape(target)+'"],.bottom-nav-btn[data-view="'+CSS.escape(target)+'"]')?.click()}
},true);
function boot(){syncAccess();ensureMenu();if(allowed())renderModule(0)}
document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,100));
new MutationObserver(()=>{syncAccess();ensureMenu()}).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style']});
setInterval(()=>{syncAccess();ensureMenu()},1500);
})();