/* OMODOS 4.0 frontend-only recovery. No API/session/login mutations. */
(function(){
'use strict';
var GROUPS=[
['Command Center','ph-command',['Ringkasan Eksekutif','Things to Look At','What Changed?','Latest Intelligence','Alert Prioritas','Status Mesin Terkini','Aktivitas Hari Ini','KPI Utama']],
['Machine Intelligence','ph-factory',['Machine Health Passport','Status Mesin Real-time','Riwayat Mesin','Failure Memory','Knowledge Graph Mesin','Korelasi Kerusakan','Diagnostic Wizard','Expert Finder']],
['Predictive Intelligence','ph-chart-line-up',['Prediksi Risiko','Tren Downtime','Pola Kerusakan','Prediksi Sparepart','Anomali Mesin','Early Warning','Forecast KPI','Reliability Trend']],
['Smart Field','ph-map-pin-line',['Input Logbook','View Logbook','Patrol Digital','Corrective Report','Project Center','Foto Lapangan','Riwayat Patrol','Temuan Lapangan']],
['Sparepart Intelligence','ph-package',['Master Sparepart','Pencarian Material','Daily Collection','Kebutuhan Material','Riwayat Pemakaian','Lokasi Sparepart','Status SAP','Analisis Konsumsi']],
['Reliability & Loss','ph-gauge',['MTBF','MTTR','Lost Time','Breakdown','Pareto Loss','Downtime Detail','Durasi Pekerjaan','Record YTD']],
['Operation Intelligence','ph-activity',['Run Hour Comparison','Energy & Utility','Biaya Energi','KPI Department','Input KPI','WTP / IPAL','Machine Breakdown','Operation Trend']],
['People Intelligence 4.0','ph-users-three',['PI Dashboard','Master Personil','Soft Skill','Hard Skill','Smart Resume','Expert Finder','People Hub','Meeting']],
['AI Intelligence','ph-brain',['Ask OMODOS','AI Internal','Diagnostic AI','Smart Resume','Knowledge Assistant','Analisis Korelasi','Ringkasan Halaman','Bantuan Kontekstual']],
['Improvement Intelligence','ph-trend-up',['Project Center','Improvement Backlog','Corrective Action','Opportunity Finder','Before / After','Benefit Tracking','Lesson Learned','Meeting Action']],
['Factory Brain','ph-cpu',['Knowledge Graph','Maintenance Wikipedia','Knowledge Base','Correlation Engine','Data Mesin','Data Terpadu','Search Intelligence','Source Traceability']],
['Maintenance War Room','ph-monitor-play',['Digital War Room','Critical Machines','Open Logbook','Patrol Alert','Sparepart Pending','Downtime Watch','KPI Watch','Time Machine']]
];
var ROUTES={'Input Logbook':'input','View Logbook':'utama','Patrol Digital':'patrol','Corrective Report':'corrective-report','Project Center':'project-center','Master Sparepart':'sparepart','Daily Collection':'sparepart','MTBF':'machine-breakdown','MTTR':'machine-breakdown','Lost Time':'kpi-department','Breakdown':'machine-breakdown','Downtime Detail':'downtime','Durasi Pekerjaan':'durasi','Record YTD':'record-ytd','Run Hour Comparison':'run-hour-comparison','Energy & Utility':'energy-utility','Biaya Energi':'energy-cost-toe','KPI Department':'kpi-department','Input KPI':'kpi-input','WTP / IPAL':'energy-utility','Machine Breakdown':'machine-breakdown','PI Dashboard':'pi-dashboard','Master Personil':'pi-personnel','Soft Skill':'pi-softskill','Hard Skill':'pi-hardskill','Smart Resume':'pi-smart-resume','Expert Finder':'expert-finder','People Hub':'people-hub','Meeting':'meeting','Diagnostic Wizard':'diagnostic','Knowledge Graph':'knowledge-graph','Maintenance Wikipedia':'wiki','Knowledge Base':'knowledge','Data Mesin':'database','Digital War Room':'analitik','Open Logbook':'utama','Sparepart Pending':'sparepart'};
function esc(v){return String(v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function permitted(){try{return !!(window.OMODOS4&&typeof window.OMODOS4.isAllowed==='function'&&window.OMODOS4.isAllowed())}catch(e){return false}}
function group(){return document.getElementById('v4-nav-group')}
function removeRecovered(){var nodes=document.querySelectorAll('[data-v4-safe-module]');for(var i=0;i<nodes.length;i++)nodes[i].remove()}
function sync(){
 var g=group();if(!g)return;
 var ok=permitted();
 g.classList.toggle('v4-authorized',ok);
 g.setAttribute('aria-hidden',ok?'false':'true');
 if(!ok){removeRecovered();return}
 var sub=g.querySelector('[data-submenu="omodos4"]');
 if(!sub||sub.querySelector('[data-v4-safe-module]'))return;
 for(var i=1;i<GROUPS.length;i++){
  var b=document.createElement('button');b.type='button';b.className='nav-btn v4-nav-btn v4-module-btn';
  b.setAttribute('data-v4-safe-module',String(i));b.setAttribute('aria-label',GROUPS[i][0]);
  b.innerHTML='<span class="ico"><i class="ph-bold '+GROUPS[i][1]+'"></i></span> '+esc(GROUPS[i][0]);sub.appendChild(b)
 }
}
function stage(){
 var view=document.getElementById('view-omodos4');if(!view)return null;
 var s=document.getElementById('v4-safe-stage');if(!s){s=document.createElement('div');s.id='v4-safe-stage';view.appendChild(s)}return s
}
function render(n){
 if(!permitted())return;var data=GROUPS[n]||GROUPS[0],s=stage();if(!s)return;
 var cards='';for(var i=0;i<data[2].length;i++){var name=data[2][i],route=ROUTES[name]||'';
 cards+='<button type="button" class="v4-feature-tile" data-v4-route="'+esc(route)+'"><span class="n">'+String(i+1).padStart(2,'0')+'</span><strong>'+esc(name)+'</strong><small>'+(route?'Buka data/fungsi existing.':'Ringkasan intelligence dari data existing.')+'</small></button>'}
 s.innerHTML='<div class="v4-card"><div class="v4-module-head"><div><div class="v4-eyebrow">OMODOS 4.0</div><h2><i class="ph-bold '+data[1]+'"></i> '+esc(data[0])+'</h2><p>Menggunakan sumber data existing tanpa input ganda.</p></div></div><div class="v4-feature-grid">'+cards+'</div></div>'
}
document.addEventListener('click',function(e){
 var m=e.target.closest&&e.target.closest('[data-v4-safe-module]');if(m){if(!permitted()){e.preventDefault();e.stopImmediatePropagation();return}var root=document.querySelector('#v4-nav-group [data-view="omodos4"]');if(root)root.click();setTimeout(function(){render(Number(m.getAttribute('data-v4-safe-module')))},0);return}
 var tile=e.target.closest&&e.target.closest('[data-v4-route]');if(tile){var route=tile.getAttribute('data-v4-route');if(!route)return;var target=document.querySelector('.nav-btn[data-view="'+route+'"],.bottom-nav-btn[data-view="'+route+'"]');if(target)target.click()}
},true);
window.addEventListener('storage',sync);
document.addEventListener('visibilitychange',function(){if(!document.hidden)sync()});
document.addEventListener('DOMContentLoaded',function(){sync();setTimeout(sync,800);setTimeout(sync,2500)});
setInterval(sync,3000);
})();
