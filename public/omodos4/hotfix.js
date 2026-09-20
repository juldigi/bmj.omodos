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
var ROUTES={
 'Ringkasan Eksekutif':'dashboard',
 'Things to Look At':'analitik',
 'What Changed?':'downtime',
 'Latest Intelligence':'insights-hub',
 'Alert Prioritas':'diagnostic',
 'Status Mesin Terkini':'dashboard',
 'Aktivitas Hari Ini':'report',
 'KPI Utama':'kpi-department',
 'Machine Health Passport':'database',
 'Status Mesin Real-time':'dashboard',
 'Riwayat Mesin':'utama',
 'Failure Memory':'knowledge',
 'Knowledge Graph Mesin':'knowledge-graph',
 'Korelasi Kerusakan':'correlation',
 'Diagnostic Wizard':'diagnostic',
 'Expert Finder':'expert-finder',
 'Prediksi Risiko':'analitik',
 'Tren Downtime':'downtime',
 'Pola Kerusakan':'correlation',
 'Prediksi Sparepart':'sparepart',
 'Anomali Mesin':'diagnostic',
 'Early Warning':'dashboard',
 'Forecast KPI':'kpi-department',
 'Reliability Trend':'machine-breakdown',
 'Input Logbook':'input',
 'View Logbook':'utama',
 'Patrol Digital':'patrol',
 'Corrective Report':'corrective-report',
 'Project Center':'project-center',
 'Foto Lapangan':'input',
 'Riwayat Patrol':'patrol',
 'Temuan Lapangan':'patrol',
 'Master Sparepart':'sparepart',
 'Pencarian Material':'sparepart',
 'Daily Collection':'sparepart',
 'Kebutuhan Material':'sparepart',
 'Riwayat Pemakaian':'sparepart',
 'Lokasi Sparepart':'sparepart',
 'Status SAP':'sparepart',
 'Analisis Konsumsi':'sparepart',
 'MTBF':'machine-breakdown',
 'MTTR':'machine-breakdown',
 'Lost Time':'kpi-department',
 'Breakdown':'machine-breakdown',
 'Pareto Loss':'analitik',
 'Downtime Detail':'downtime',
 'Durasi Pekerjaan':'durasi',
 'Record YTD':'record-ytd',
 'Run Hour Comparison':'run-hour-comparison',
 'Energy & Utility':'energy-utility',
 'Biaya Energi':'energy-cost-toe',
 'KPI Department':'kpi-department',
 'Input KPI':'kpi-input',
 'WTP / IPAL':'energy-utility',
 'Machine Breakdown':'machine-breakdown',
 'Operation Trend':'analitik',
 'PI Dashboard':'pi-dashboard',
 'Master Personil':'pi-personnel',
 'Soft Skill':'pi-softskill',
 'Hard Skill':'pi-hardskill',
 'Smart Resume':'pi-smart-resume',
 'People Hub':'people-hub',
 'Meeting':'meeting',
 'Ask OMODOS':'@copilot',
 'AI Internal':'@copilot',
 'Diagnostic AI':'diagnostic',
 'Knowledge Assistant':'knowledge',
 'Analisis Korelasi':'correlation',
 'Ringkasan Halaman':'@copilot',
 'Bantuan Kontekstual':'@copilot-help',
 'Improvement Backlog':'project-center',
 'Corrective Action':'corrective-report',
 'Opportunity Finder':'analitik',
 'Before / After':'project-center',
 'Benefit Tracking':'project-center',
 'Lesson Learned':'knowledge',
 'Meeting Action':'meeting',
 'Knowledge Graph':'knowledge-graph',
 'Maintenance Wikipedia':'wiki',
 'Knowledge Base':'knowledge',
 'Correlation Engine':'correlation',
 'Data Mesin':'database',
 'Data Terpadu':'insights-hub',
 'Search Intelligence':'knowledge',
 'Source Traceability':'knowledge-graph',
 'Digital War Room':'analitik',
 'Critical Machines':'dashboard',
 'Open Logbook':'utama',
 'Patrol Alert':'patrol',
 'Sparepart Pending':'sparepart',
 'Downtime Watch':'downtime',
 'KPI Watch':'kpi-department',
 'Time Machine':'record-ytd'
};
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
 if(!sub)return;
 var parent=g.querySelector('.nav-parent-btn[data-group="omodos4"]');
 if(parent)parent.classList.add('open');
 sub.classList.add('open');
 sub.style.maxHeight='none';
 sub.style.overflow='visible';
 sub.style.display='flex';
 if(sub.querySelector('[data-v4-safe-module]')){
  var existing=sub.querySelectorAll('[data-v4-safe-module]');
  for(var e=0;e<existing.length;e++){existing[e].hidden=false;existing[e].style.display='flex'}
  return
 }
 for(var i=1;i<GROUPS.length;i++){
  var b=document.createElement('button');b.type='button';b.className='nav-btn v4-nav-btn v4-module-btn';
  b.setAttribute('data-v4-safe-module',String(i));b.setAttribute('aria-label',GROUPS[i][0]);
  b.innerHTML='<span class="ico"><i class="ph-bold '+GROUPS[i][1]+'"></i></span> '+esc(GROUPS[i][0]);sub.appendChild(b)
 }
}
function stage(){
 var view=document.getElementById('view-omodos4');if(!view)return null;
 var s=document.getElementById('v4-safe-stage');
 if(!s){
  s=document.createElement('div');s.id='v4-safe-stage';
  var top=view.querySelector('.topbar');
  if(top&&top.parentNode===view)top.insertAdjacentElement('afterend',s);else view.insertBefore(s,view.firstChild)
 }
 return s
}
function setSidebarActive(n){
 var g=group();if(!g)return;
 var root=g.querySelector('[data-v4-root]');
 var mods=g.querySelectorAll('[data-v4-safe-module]');
 if(root)root.classList.toggle('active',n===0);
 for(var i=0;i<mods.length;i++)mods[i].classList.toggle('active',Number(mods[i].getAttribute('data-v4-safe-module'))===n);
 var parent=g.querySelector('.nav-parent-btn[data-group="omodos4"]');
 var sub=g.querySelector('[data-submenu="omodos4"]');
 if(parent)parent.classList.add('active','open');
 if(sub)sub.classList.add('open')
}
function showCommandCenter(){
 var view=document.getElementById('view-omodos4'),s=document.getElementById('v4-safe-stage');
 if(view)view.classList.remove('v4-safe-module-open');
 if(s){s.innerHTML='';s.style.display='none'}
 setSidebarActive(0)
}
function render(n){
 if(!permitted())return false;
 n=Number(n)||0;
 if(n===0){showCommandCenter();return true}
 var data=GROUPS[n]||GROUPS[0],s=stage(),view=document.getElementById('view-omodos4');if(!s||!view)return false;
 var cards='';for(var i=0;i<data[2].length;i++){var name=data[2][i],route=ROUTES[name]||'';
 cards+='<button type="button" class="v4-feature-tile" data-v4-route="'+esc(route)+'"><span class="n">'+String(i+1).padStart(2,'0')+'</span><strong>'+esc(name)+'</strong><small>'+(route?'Buka data/fungsi existing.':'Ringkasan intelligence dari data existing.')+'</small></button>'}
 s.innerHTML='<div class="v4-card"><div class="v4-module-head"><div><div class="v4-eyebrow">OMODOS 4.0</div><h2><i class="ph-bold '+data[1]+'"></i> '+esc(data[0])+'</h2><p>Menggunakan sumber data existing tanpa input ganda.</p></div></div><div class="v4-feature-grid">'+cards+'</div></div>';
 s.style.display='';
 view.classList.add('v4-safe-module-open');
 view.setAttribute('data-v4-active-module',String(n));
 setSidebarActive(n);
 try{s.scrollIntoView({block:'start',behavior:'auto'})}catch(e){}
 return true
}
function openCopilot(showHelp){
 var bg=document.querySelector('.copilot-bg'),fab=document.getElementById('copilot-fab');
 if(fab&&(!bg||!bg.classList.contains('active')))fab.click();
 if(showHelp)setTimeout(function(){var help=document.getElementById('copilot-help');if(help)help.click()},80);
 return !!(fab||bg)
}
function openRoute(route){
 if(!route)return false;
 if(route==='@copilot')return openCopilot(false);
 if(route==='@copilot-help')return openCopilot(true);
 var target=document.querySelector('.nav-btn[data-view="'+route+'"],.bottom-nav-btn[data-view="'+route+'"]');
 if(target){target.click();return true}
 if(typeof window.goToView==='function')return window.goToView(route)!==false;
 if(typeof goToView==='function')return goToView(route)!==false;
 return false
}
document.addEventListener('click',function(e){
 var root=e.target.closest&&e.target.closest('#v4-nav-group [data-v4-root]');
 if(root){if(!permitted()){e.preventDefault();e.stopImmediatePropagation();return}setTimeout(function(){showCommandCenter()},0);return}
 var m=e.target.closest&&e.target.closest('[data-v4-safe-module]');
 if(m){
  if(!permitted()){e.preventDefault();e.stopImmediatePropagation();return}
  e.preventDefault();
  var n=Number(m.getAttribute('data-v4-safe-module'));
  var opened=false;
  try{if(typeof window.goToView==='function')opened=window.goToView('omodos4')!==false;else if(typeof goToView==='function')opened=goToView('omodos4')!==false}catch(err){}
  if(!opened){
   var view=document.getElementById('view-omodos4');
   if(view){var views=document.querySelectorAll('.view');for(var i=0;i<views.length;i++)views[i].classList.remove('active');view.classList.add('active');opened=true}
  }
  if(opened)render(n);
  return
 }
 var tile=e.target.closest&&e.target.closest('[data-v4-route]');
 if(tile){e.preventDefault();var route=tile.getAttribute('data-v4-route');if(!openRoute(route)&&typeof window.toast==='function')window.toast('Fitur belum dapat dibuka dari OMODOS 4.0.');return}
},true);
window.addEventListener('storage',sync);
document.addEventListener('visibilitychange',function(){if(!document.hidden)sync()});
document.addEventListener('DOMContentLoaded',function(){sync();setTimeout(sync,800);setTimeout(sync,2500)});
setInterval(sync,3000);
})();
