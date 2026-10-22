/* TECHNICAL_PERFORMANCE_MVP_V1 — additive, Superadmin-only official-report import workspace.
   Imported files remain in this browser session; no production data is persisted or transmitted. */
(function(){
'use strict';
var PAGE='view-technical-performance', NAV='nav-technical-performance';
var state={rows:[],headers:[],fileName:'',sheetName:'',sheetNames:[],workbook:null,rawMatrix:null,headerRow:1,dataStartRow:2,mapping:{},tab:'overview',errors:[],warnings:[],officialOee:null,mtcAudit:null,odin:{rows:[],headers:[],fileName:'',sheetName:'',sheetNames:[],workbook:null,rawMatrix:null,headerRow:2,mapping:{},durationUnit:'minutes'}};
function $(id){return document.getElementById(id);}
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function user(){try{if(typeof CURRENT_USER!=='undefined'&&CURRENT_USER)return CURRENT_USER;}catch(e){}return window.CURRENT_USER||null;}
function allowed(){var u=user();return !!u&&String(u.role||u.Role||'').toLowerCase()==='superadmin';}
function notify(msg,type){var el=$('tp-message');if(!el)return;el.hidden=false;el.className='tp-message '+(type||'');el.textContent=msg;}
function ensureStyle(){if($('tp-style'))return;var s=document.createElement('style');s.id='tp-style';s.textContent=
'.tp-page{padding:18px;max-width:1440px;margin:0 auto;color:var(--text-primary,#172033)}.tp-page[hidden]{display:none!important}.tp-head{display:flex;justify-content:space-between;align-items:flex-start;gap:14px;flex-wrap:wrap}.tp-head h1{font-size:clamp(22px,3vw,30px);margin:4px 0}.tp-eyebrow{font-size:11px;letter-spacing:.12em;color:#64748b;font-weight:700}.tp-sub{color:#64748b;font-size:13px;max-width:780px}.tp-message{padding:12px 14px;border-radius:10px;margin:14px 0;background:#eff6ff;color:#1d4ed8;font-size:13px}.tp-message.error{background:#fff1f2;color:#be123c}.tp-message.warn{background:#fffbeb;color:#92400e}.tp-card{border:1px solid #e2e8f0;border-radius:14px;background:var(--card-bg,#fff);padding:16px;min-width:0}.tp-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin:16px 0}.tp-metric small{display:block;color:#64748b;font-size:12px}.tp-metric b{display:block;font-size:25px;margin:7px 0;overflow-wrap:anywhere}.tp-metric span{font-size:12px;color:#64748b}.tp-tabs{display:flex;gap:6px;overflow-x:auto;margin:16px 0;padding-bottom:4px}.tp-tabs button,.tp-btn{border:1px solid #cbd5e1;border-radius:9px;padding:9px 12px;background:var(--card-bg,#fff);color:inherit;white-space:nowrap;cursor:pointer;font:inherit;font-size:13px}.tp-tabs button[aria-selected=true],.tp-btn.primary{background:#1e3a5f;color:#fff;border-color:#1e3a5f}.tp-form{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.tp-form label{display:block;font-size:12px;color:#475569}.tp-form input,.tp-form select{display:block;width:100%;box-sizing:border-box;margin-top:6px;padding:10px;border:1px solid #cbd5e1;border-radius:8px;background:var(--card-bg,#fff);color:inherit}.tp-table-wrap{overflow:auto;max-width:100%;margin-top:12px}.tp-table{border-collapse:collapse;width:100%;font-size:12px;white-space:nowrap}.tp-table th,.tp-table td{padding:9px 10px;border-bottom:1px solid #e2e8f0;text-align:left}.tp-table th{background:#f8fafc;position:sticky;top:0}.tp-muted{color:#64748b;font-size:12px}.tp-list{padding-left:18px}.tp-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}.tp-section-title{margin:0 0 8px;font-size:16px}.tp-two{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.tp-pill{display:inline-block;border-radius:999px;background:#f1f5f9;padding:4px 8px;font-size:11px;color:#334155}.tp-empty{padding:26px 12px;text-align:center;color:#64748b}.tp-kv{display:flex;justify-content:space-between;gap:12px;padding:9px 0;border-bottom:1px solid #e2e8f0}.tp-kv:last-child{border-bottom:0}@media(max-width:760px){.tp-page{padding:12px}.tp-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.tp-metric b{font-size:21px}.tp-form,.tp-two{grid-template-columns:1fr}.tp-card{padding:13px}}';
document.head.appendChild(s);}
function ensureNav(){var side=document.querySelector('.sidebar,.side-nav,.sidebar-nav');if(!side)return;var settings=side.querySelector('.nav-group-settings')||side.querySelector('.nav-group');if(!settings)return;var nav=$(NAV);if(!nav){nav=document.createElement('div');nav.className='nav-group';nav.id=NAV;nav.innerHTML='<button class="nav-btn" type="button" data-view="technical-performance"><span class="ico"><i class="ph-bold ph-chart-line-up"></i></span> Technical Performance</button>';settings.parentNode.insertBefore(nav,settings);nav.querySelector('button').addEventListener('click',function(e){e.preventDefault();e.stopPropagation();if(!allowed()){syncAuth();return;}if(typeof window.goToView==='function')window.goToView('technical-performance');else manualNavigate();render();});}}
function ensurePage(){var page=$(PAGE);if(page)return page;var main=document.querySelector('.main');if(!main)return null;page=document.createElement('section');page.id=PAGE;page.className='view tp-page';page.innerHTML='<div class="tp-head"><div><div class="tp-eyebrow">BMJ PACKAGING OFFSET · SUPERADMIN</div><h1>Technical Performance</h1><div class="tp-sub">Dashboard berbasis Excel/laporan resmi. Impor data terlebih dahulu, periksa pemetaan kolom, lalu tinjau KPI, downtime, energi, dan tindak lanjut.</div></div><span class="tp-pill">Tahap awal · Read-only</span></div><div id="tp-message" class="tp-message" hidden role="status"></div><div id="tp-body"></div>';main.appendChild(page);return page;}
function manualNavigate(){var p=ensurePage();if(!p||!allowed())return;document.querySelectorAll('.view').forEach(function(v){v.classList.remove('active');});p.classList.add('active');p.hidden=false;document.querySelectorAll('.nav-btn[data-view],.bottom-nav-btn[data-view]').forEach(function(b){b.classList.toggle('active',b.getAttribute('data-view')==='technical-performance');});}
function syncAuth(){ensureNav();var n=$(NAV),p=$(PAGE);if(n)n.style.display=allowed()?'':'none';if(p&&!allowed()){p.hidden=true;p.style.display='none';p.setAttribute('aria-hidden','true');if(p.classList.contains('active')){p.classList.remove('active');var d=$('view-dashboard');if(d)d.classList.add('active');}}else if(p){p.hidden=false;p.style.display='';p.setAttribute('aria-hidden','false');}}
function loadXLSX(){return new Promise(function(resolve,reject){if(window.XLSX){resolve(window.XLSX);return;}var s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';s.onload=function(){window.XLSX?resolve(window.XLSX):reject(new Error('Pustaka Excel tidak tersedia.'));};s.onerror=function(){reject(new Error('Pustaka pembaca Excel gagal dimuat. Periksa koneksi atau impor CSV.'));};document.head.appendChild(s);});}
function parseCSV(text){var rows=[],row=[],cell='',quoted=false;for(var i=0;i<text.length;i++){var c=text[i],n=text[i+1];if(c==='"'&&quoted&&n==='"'){cell+='"';i++;}else if(c==='"'){quoted=!quoted;}else if((c===','||c===';'||c==='\t')&&!quoted){row.push(cell);cell='';}else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&n==='\n')i++;row.push(cell);if(row.some(function(x){return String(x).trim()!=='';}))rows.push(row);row=[];cell='';}else cell+=c;}row.push(cell);if(row.some(function(x){return String(x).trim()!=='';}))rows.push(row);return rows;}
function defaultHeaderRow(name){name=String(name||'');if(/^OEE (Printing(?: \(2\))?|AP|HS|DC|FG)$/i.test(name))return 6;if(/^Lost Time (Printing|AP|FG|IP)$/i.test(name))return 4;if(/^Report MTC$/i.test(name))return 6;if(/^Kertas Kerja \(Simple View\)$/i.test(name))return 7;if(/^Kertas Kerja$/i.test(name))return 7;return 1;}
function defaultDataStartRow(name,headerRow){var h=Math.max(1,parseInt(headerRow,10)||1);if(/^Kertas Kerja$/i.test(String(name||'')))return Math.max(11,h+1);return h+1;}
function extractOfficialOee(wb){
 if(!wb||!wb.Sheets)return null;
 var sheets=wb.Sheets,required=['OEE Printing (2)','OEE AP','OEE FG'];
 if(!required.every(function(n){return !!sheets[n];}))return null;
 function cell(sheet,ref){var c=sheets[sheet]&&sheets[sheet][ref];var n=c&&c.v!==undefined?Number(c.v):NaN;return Number.isFinite(n)?n:NaN;}
 function countMatches(re){return (wb.SheetNames||[]).filter(function(n){return re.test(n);}).length;}
 var defs=[
  {group:'Printing',sheet:'OEE Printing (2)',cells:{oee:'K2',availability:'K3',performance:'K4',quality:'K5',productionDowntime:'E7',netOperatingTime:'F7'},machineCount:countMatches(/^OFS-\d+$/i)},
  {group:'APM',sheet:'OEE AP',cells:{oee:'J2',availability:'J3',performance:'J4',quality:'J5',productionDowntime:'D7',netOperatingTime:'E7'},machineCount:countMatches(/^AP#\d+$/i)},
  {group:'FGM',sheet:'OEE FG',cells:{oee:'J2',availability:'J3',performance:'J4',quality:'J5',productionDowntime:'D7',netOperatingTime:'E7'},machineCount:countMatches(/^FG#\d+$/i)}
 ];
 var rows=defs.map(function(d){
  var r={group:d.group,sheet:d.sheet,machineCount:d.machineCount||0};
  Object.keys(d.cells).forEach(function(k){r[k]=cell(d.sheet,d.cells[k]);});
  r.oeeCalculated=[r.availability,r.performance,r.quality].every(Number.isFinite)?r.availability*r.performance*r.quality:NaN;
  r.oeeCheck=Number.isFinite(r.oeeCalculated)&&Number.isFinite(r.oee)?(Math.abs(r.oeeCalculated-r.oee)<=0.005?'Cocok':'Perlu pemeriksaan'):'Tidak lengkap';
  r.utilization=Number.isFinite(r.productionDowntime)&&Number.isFinite(r.netOperatingTime)&&r.machineCount>0?(r.productionDowntime+r.netOperatingTime)/(720*r.machineCount):NaN;
  r.teep=Number.isFinite(r.oee)&&Number.isFinite(r.utilization)?r.oee*r.utilization:NaN;
  return r;
 });
 var valid=rows.every(function(r){return Number.isFinite(r.oee)&&Number.isFinite(r.availability)&&Number.isFinite(r.performance)&&Number.isFinite(r.quality)&&Number.isFinite(r.productionDowntime)&&Number.isFinite(r.netOperatingTime)&&r.machineCount>0;});
 return valid?{period:'September 2026',calendarHoursPerMachine:720,rows:rows,totalProductionDowntime:rows.reduce(function(a,r){return a+r.productionDowntime;},0),sourceFileNote:'Ringkasan dibaca dari cached values workbook pada sheet OEE Printing (2), OEE AP, dan OEE FG.'}:null;
}
function extractMtcAudit(X,wb){
 if(!X||!wb||!wb.Sheets||!wb.Sheets['Report MTC'])return null;
 var details=[
  {group:'Printing',sheet:'Lost Time Printing',category:'Category',hour:'Hour',pro:'PRO',totalCell:'I3',fallbackStartRow:13},
  {group:'APM',sheet:'Lost Time AP',category:'Category',hour:'Hour',pro:'PRO',totalCell:'J3',fallbackStartRow:39},
  {group:'FGM',sheet:'Lost Time FG',category:'Category',hour:'Hour',pro:'PRO',totalCell:'J3',fallbackStartRow:5}
 ];
 var pivots=[{records:'E18',hours:'E9'},{records:'J19',hours:'J10'},{records:'N18',hours:'N9'}];
 var allSourceEventIds=new Set(),sourceMtcRows=0,sourceTrialRows=0,sourceMtcComplete=true,sourceSheetsComplete=true;
 function n(v){if(typeof v==='number')return Number.isFinite(v)?v:NaN;var x=String(v==null?'':v).trim();if(!x)return NaN;var a=Number(x);return Number.isFinite(a)?a:NaN;}
 function rangeEnd(ref){var m=String(ref||'').match(/(?:^|:)\$?[A-Z]{1,3}\$?(\d+)$/i);return m?Number(m[1]):NaN;}
 function filterInfo(ws,subtotalEnd,outsideMtcRows){
  var usedRange=String(ws&&ws['!ref']||''),auto=ws&&ws['!autofilter'];
  var filterRange=String(typeof auto==='string'?auto:(auto&&auto.ref)||'');
  var usedEnd=rangeEnd(usedRange),filterEnd=rangeEnd(filterRange);
  var autoFilterCoverageIssue=!!filterRange&&Number.isFinite(usedEnd)&&Number.isFinite(filterEnd)&&filterEnd<usedEnd;
  var subtotalFormulaShortIssue=Number.isFinite(usedEnd)&&Number.isFinite(subtotalEnd)&&subtotalEnd<usedEnd;
  var subtotalMtcOutside=outsideMtcRows>0;
  return {usedRange:usedRange||'—',filterRange:filterRange||'—',usedEnd:usedEnd,
   autoFilterCoverageIssue:autoFilterCoverageIssue,subtotalFormulaShortIssue:subtotalFormulaShortIssue,
   subtotalMtcOutside:subtotalMtcOutside,subtotalCoverageIssue:subtotalFormulaShortIssue||subtotalMtcOutside,
   rangeCoverageIssue:autoFilterCoverageIssue||subtotalFormulaShortIssue||subtotalMtcOutside};
 }
 function rowIsHidden(ws,rowNumber){var rows=ws&&Array.isArray(ws['!rows'])?ws['!rows']:null;var meta=rows&&rows[rowNumber-1];return !!(meta&&(meta.hidden===true||meta.hidden===1||meta.hidden==='1'));}
 function effectiveRange(ws,d,matrix){
  var formula=String(ws&&ws[d.totalCell]&&ws[d.totalCell].f||'');
  var match=formula.match(/SUBTOTAL\s*\(\s*9\s*,\s*\$?[A-Z]{1,3}\$?(\d+)\s*:\s*\$?[A-Z]{1,3}\$?(\d+)\s*\)/i);
  var start=match?Number(match[1]):NaN,end=match?Number(match[2]):NaN;
  if(Number.isInteger(start)&&Number.isInteger(end)&&start>=5&&end>=start)return {start:start,end:end,fromFormula:true};
  return {start:d.fallbackStartRow,end:Math.max(d.fallbackStartRow,matrix.length),fromFormula:false};
 }
 var result=details.map(function(d,i){
  var ws=wb.Sheets[d.sheet],detailRecords=0,detailHours=0,nonTrialHours=0,trialRecords=0,complete=true;
  var startRow=d.fallbackStartRow,endRow=NaN,rangeFromFormula=false,eventIds=new Set();
  var sourceGroupEventIds=new Set(),sourceGroupMtcRows=0,sourceGroupTrialRows=0,sourceGroupComplete=true,outsideMtcRows=0,sourceGroupVisibleMtcRows=0,sourceGroupHiddenMtcRows=0,visibleSubtotalMtcRows=0,hiddenSubtotalMtcRows=0;
  if(ws){
   // Preserve physical row positions: the saved SUBTOTAL range is audited separately from the complete detail list.
   var matrix=X.utils.sheet_to_json(ws,{header:1,defval:'',raw:true,blankrows:true});
   var header=matrix[3]||[];
   var catIndex=header.findIndex(function(h){return String(h||'').trim().toLowerCase()===d.category.toLowerCase();});
   var hourIndex=header.findIndex(function(h){return String(h||'').trim().toLowerCase()===d.hour.toLowerCase();});
   var proIndex=header.findIndex(function(h){return String(h||'').trim().toLowerCase()===d.pro.toLowerCase();});
   var range=effectiveRange(ws,d,matrix);startRow=range.start;endRow=range.end;rangeFromFormula=range.fromFormula;
   if(catIndex<0||proIndex<0){sourceGroupComplete=false;sourceSheetsComplete=false;sourceMtcComplete=false;}
   else matrix.slice(4).forEach(function(row,offset){
    if(String(row&&row[catIndex]||'').trim().toUpperCase()!=='MTC')return;
    sourceGroupMtcRows++;
    var rowNumber=offset+5,pro=String(row&&row[proIndex]||'').trim(),isTrial=/^TRIAL$/i.test(pro),hiddenRow=rowIsHidden(ws,rowNumber);
    if(hiddenRow)sourceGroupHiddenMtcRows++;else sourceGroupVisibleMtcRows++;
    if(rowNumber>=startRow&&rowNumber<=endRow){if(hiddenRow)hiddenSubtotalMtcRows++;else visibleSubtotalMtcRows++;}
    if(rowNumber<startRow||rowNumber>endRow)outsideMtcRows++;
    if(isTrial)sourceGroupTrialRows++;
    else if(pro){sourceGroupEventIds.add(pro.toUpperCase());allSourceEventIds.add(pro.toUpperCase());}
    else sourceGroupComplete=false;
   });
   if(!sourceGroupComplete)sourceMtcComplete=false;
   sourceMtcRows+=sourceGroupMtcRows;sourceTrialRows+=sourceGroupTrialRows;
   if(catIndex<0||hourIndex<0||proIndex<0)complete=false;
   else matrix.slice(startRow-1,endRow).forEach(function(row){
    if(String(row&&row[catIndex]||'').trim().toUpperCase()!=='MTC')return;
    detailRecords++;
    var pro=String(row&&row[proIndex]||'').trim(),isTrial=/^TRIAL$/i.test(pro),h=n(row&&row[hourIndex]);
    if(isTrial)trialRecords++;
    else if(pro)eventIds.add(pro.toUpperCase());
    else complete=false;
    if(Number.isFinite(h)&&h>=0){detailHours+=h;if(!isTrial)nonTrialHours+=h;}else complete=false;
   });
  }else{complete=false;sourceGroupComplete=false;sourceSheetsComplete=false;sourceMtcComplete=false;}
  var ranges=filterInfo(ws,endRow,outsideMtcRows),p=pivots[i],pw=wb.Sheets['Report MTC'];
  var pivotRecords=n(pw[p.records]&&pw[p.records].v),pivotHours=n(pw[p.hours]&&pw[p.hours].v);
  var detailEvents=eventIds.size,eventMismatch=!Number.isFinite(pivotRecords)||detailEvents!==pivotRecords;
  var hoursMismatch=!Number.isFinite(pivotHours)||Math.abs(nonTrialHours-pivotHours)>0.05;
  var visibilityIssue=sourceGroupHiddenMtcRows>0;
  var mismatch=!complete||!sourceGroupComplete||eventMismatch||hoursMismatch||ranges.rangeCoverageIssue||visibilityIssue;
  return {group:d.group,detailStartRow:startRow,detailEndRow:endRow,detailRangeFromFormula:rangeFromFormula,
   detailRecords:detailRecords,detailEvents:detailEvents,trialRecords:trialRecords,detailHours:detailHours,nonTrialHours:nonTrialHours,
   sourceMtcRows:sourceGroupMtcRows,sourceEventCount:sourceGroupEventIds.size,sourceTrialRows:sourceGroupTrialRows,sourceComplete:sourceGroupComplete,
   visibleMtcRows:sourceGroupVisibleMtcRows,hiddenMtcRows:sourceGroupHiddenMtcRows,visibleSubtotalMtcRows:visibleSubtotalMtcRows,hiddenSubtotalMtcRows:hiddenSubtotalMtcRows,visibilityIssue:visibilityIssue,
   outsideSubtotalMtcRows:outsideMtcRows,pivotRecords:pivotRecords,pivotHours:pivotHours,deltaHours:nonTrialHours-pivotHours,
   usedRange:ranges.usedRange,filterRange:ranges.filterRange,usedRowEnd:ranges.usedEnd,
   autoFilterCoverageIssue:ranges.autoFilterCoverageIssue,subtotalFormulaShortIssue:ranges.subtotalFormulaShortIssue,
   subtotalMtcOutside:ranges.subtotalMtcOutside,subtotalCoverageIssue:ranges.subtotalCoverageIssue,rangeCoverageIssue:ranges.rangeCoverageIssue,
   complete:complete,eventMismatch:eventMismatch,hoursMismatch:hoursMismatch,mismatch:mismatch};
 });
 var truncatedAuto=result.filter(function(r){return r.autoFilterCoverageIssue;}).map(function(r){return r.group;});
 var truncatedSubtotal=result.filter(function(r){return r.subtotalFormulaShortIssue;}).map(function(r){return r.group;});
 var outOfRangeMtc=result.filter(function(r){return r.subtotalMtcOutside;}).map(function(r){return r.group;});
 var hiddenMtc=result.filter(function(r){return r.visibilityIssue;}).map(function(r){return r.group;});
 var note='Jumlah kejadian MTC dihitung dari PRO unik pada seluruh baris detail berkategori persis MTC di tiga worksheet, dengan PRO=TRIAL dikecualikan. Ini terpisah dari cakupan angka jam SUBTOTAL dan Pivot Report MTC. Lost Time/MTBF/MTTR tetap ditahan selama rentang dan state filter belum cocok.';
 if(hiddenMtc.length)note+=' Sebagian baris MTC disembunyikan dalam state workbook pada: '+hiddenMtc.join(', ')+'. Periksa filter/baris tersembunyi sebelum memakai SUBTOTAL/Pivot sebagai angka MTC.';
 if(truncatedAuto.length)note+=' Rentang AutoFilter lebih pendek daripada rentang worksheet pada: '+truncatedAuto.join(', ')+'.';
 if(truncatedSubtotal.length)note+=' Formula SUBTOTAL berhenti sebelum akhir data worksheet pada: '+truncatedSubtotal.join(', ')+'.';
 if(outOfRangeMtc.length)note+=' Ada baris Category=MTC di luar rentang formula SUBTOTAL pada: '+outOfRangeMtc.join(', ')+'.';
 return {rows:result,mismatch:result.some(function(r){return r.mismatch;}),
  incidentCount:allSourceEventIds.size,incidentCountReliable:sourceSheetsComplete&&sourceMtcComplete,
  sourceMtcRows:sourceMtcRows,sourceTrialRows:sourceTrialRows,note:note};
}
function applyMatrix(matrix,headerRow,dataStartRow){
 var header=Math.max(1,parseInt(headerRow,10)||1);
 var dataStart=Math.max(header+1,parseInt(dataStartRow,10)||defaultDataStartRow(state.sheetName,header));
 if(!matrix||matrix.length<header||matrix.length<dataStart)throw new Error('Tidak ada baris data setelah header '+header+' dan baris data mulai '+dataStart+'.');
 var source=matrix[header-1]||[];
 state.headerRow=header;state.dataStartRow=dataStart;
 state.headers=source.map(function(v,i){return String(v==null||v===''?'Kolom '+(i+1):v).trim();});
 var data=matrix.slice(dataStart-1).filter(function(r){return r&&r.some(function(v){return String(v==null?'':v).trim()!=='';});});
 if(/^OEE (Printing(?: \(2\))?|AP|HS|DC|FG)$/i.test(String(state.sheetName||'')))data=data.filter(function(r){return String(r[0]||'').trim().toLowerCase()!=='total';});
 state.rows=data.map(function(r){var o={};state.headers.forEach(function(h,i){o[h]=r[i]==null?'':r[i];});return o;});
 if(!state.rows.length)throw new Error('Tidak ada baris data mulai '+dataStart+' pada sheet '+(state.sheetName||'CSV')+'.');
}
function loadSheetMatrix(name,headerRow,announce){
 if(!state.workbook||!state.workbook.Sheets[name])return;
 var X=window.XLSX;
 state.sheetName=name;state.rawMatrix=X.utils.sheet_to_json(state.workbook.Sheets[name],{header:1,defval:'',raw:false});
 state.mapping={};
 var h=headerRow==null?defaultHeaderRow(name):Math.max(1,parseInt(headerRow,10)||defaultHeaderRow(name));applyMatrix(state.rawMatrix,h,defaultDataStartRow(name,h));
 state.tab='mapping';render();
 if(announce)notify('Sheet aktif: '+name+' · '+state.rows.length+' baris data · header pada baris '+state.headerRow+'. Hanya sheet aktif yang masuk ke KPI; validasi sumber dan periode tetap wajib.','warn');
}
async function readFile(file){
 if(!file)return;
 state.rows=[];state.headers=[];state.errors=[];state.warnings=[];state.mapping={};state.fileName=file.name;state.officialOee=null;state.mtcAudit=null;
 state.sheetName='';state.sheetNames=[];state.workbook=null;state.rawMatrix=null;state.headerRow=1;
 notify('Membaca file dan memeriksa struktur…');
 try{
  if(/\.csv$/i.test(file.name)){
   state.sheetName='CSV';applyMatrix(parseCSV(await file.text()),1,2);
  }else if(/\.(xlsx|xls|xlsm)$/i.test(file.name)){
   var X=await loadXLSX(),buf=await file.arrayBuffer(),wb=X.read(buf,{type:'array',cellDates:false});
   if(!wb.SheetNames||!wb.SheetNames.length)throw new Error('Workbook tidak memiliki sheet.');
   state.workbook=wb;state.sheetNames=wb.SheetNames.slice();state.officialOee=extractOfficialOee(wb);state.mtcAudit=extractMtcAudit(X,wb);
   var preferred=/OEE/i.test(file.name)?(state.sheetNames.indexOf('OEE Printing (2)')>=0?'OEE Printing (2)':state.sheetNames.find(function(n){return /^OEE Printing$/i.test(n);})):/Kertas|Technical/i.test(file.name)?(state.sheetNames.indexOf('Kertas Kerja')>=0?'Kertas Kerja':null):null;
   state.sheetName=preferred||state.sheetNames[0];
   state.rawMatrix=X.utils.sheet_to_json(wb.Sheets[state.sheetName],{header:1,defval:'',raw:false});
   var sourceHeader=defaultHeaderRow(state.sheetName);applyMatrix(state.rawMatrix,sourceHeader,defaultDataStartRow(state.sheetName,sourceHeader));
  }else throw new Error('Format belum didukung. Gunakan XLSX, XLS, XLSM, atau CSV.');
  state.warnings.push('Impor bersifat sementara di browser; file tidak dikirim ke server. KPI dihitung hanya dari sheet aktif, bukan penggabungan otomatis antarsheet.');
  state.tab='mapping';render();
  notify('File terbaca: '+state.rows.length+' baris, '+state.headers.length+' kolom pada '+(state.sheetName||'CSV')+'. Periksa sheet, baris header, kolom, periode, dan satuan sebelum memakai KPI.','warn');
 }catch(e){state.rows=[];state.headers=[];state.rawMatrix=null;state.officialOee=null;state.mtcAudit=null;render();notify(e.message||'File gagal dibaca.','error');}
}
function fieldSelect(key,label,terms){var selected=state.mapping[key]||'';var opts='<option value="">— Tidak dipetakan —</option>'+state.headers.map(function(h){return '<option value="'+esc(h)+'" '+(selected===h?'selected':'')+'>'+esc(h)+'</option>';}).join('');return '<label>'+esc(label)+'<select data-map="'+esc(key)+'">'+opts+'</select></label>';}
function val(row,key){var col=state.mapping[key];return col?row[col]:'';}
var ODIN_MONTHS=['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
function odinMonthIndex(name){var low=String(name||'').toLowerCase();for(var i=0;i<ODIN_MONTHS.length;i++)if(low.indexOf(ODIN_MONTHS[i].toLowerCase())>=0)return i;return -1;}
function odinLatestMonth(names){var max=-1;(names||[]).forEach(function(n){max=Math.max(max,odinMonthIndex(n));});return max;}
function odinPreferredSheet(names){
 var choices=(names||[]).map(function(name){return {name:name,month:odinMonthIndex(name),verified:/^verifikasi\b/i.test(name)};}).filter(function(x){return x.month>=0;});
 choices.sort(function(a,b){return b.month-a.month||Number(b.verified)-Number(a.verified);});
 return choices.length?choices[0].name:((names||[])[0]||'');
}
function odinAutoMapping(headers){
 function pick(re){return (headers||[]).find(function(h){return re.test(String(h||'').trim());})||'';}
 return {machine:pick(/^machine$/i),date:pick(/^start\s*$/i),finish:pick(/^finish\s*$/i),group:pick(/^group$/i),section:pick(/^section\s*$/i),problem:pick(/^problem$/i),elec:pick(/^elec$/i),mech:pick(/^mech$/i),comp:pick(/^comp$/i),notif:pick(/^notif$/i),corrective:pick(/^corrective action$/i),actionPlan:pick(/^action plan$/i),rootCause:pick(/^root cause$/i)};
}
function applyOdinMatrix(matrix,headerRow){
 var o=state.odin,start=Math.max(1,parseInt(headerRow,10)||2);
 if(!matrix||matrix.length<=start)throw new Error('Worksheet ODIN tidak memiliki baris data setelah header pada baris '+start+'.');
 o.headerRow=start;o.headers=(matrix[start-1]||[]).map(function(v,i){return String(v==null||v===''?'Kolom '+(i+1):v).trim();});
 o.rows=matrix.slice(start).filter(function(r){return r&&r.some(function(v){return String(v==null?'':v).trim()!=='';});}).map(function(r){var obj={};o.headers.forEach(function(h,i){obj[h]=r[i]==null?'':r[i];});return obj;});
 if(!o.rows.length)throw new Error('Worksheet ODIN '+o.sheetName+' tidak memiliki catatan data.');
 o.mapping=odinAutoMapping(o.headers);
}
function loadOdinSheet(name,headerRow,announce){
 var o=state.odin;if(!o.workbook||!o.workbook.Sheets[name])return;
 o.sheetName=name;o.rawMatrix=window.XLSX.utils.sheet_to_json(o.workbook.Sheets[name],{header:1,defval:'',raw:false,blankrows:false});
 applyOdinMatrix(o.rawMatrix,headerRow==null?2:headerRow);state.tab='actions';render();
 if(announce)notify('ODIN sheet aktif: '+name+' · '+o.rows.length+' baris · header baris '+o.headerRow+'. Periksa unit dan periode sebelum memakai Top 3.','warn');
}
async function readOdinFile(file){
 if(!file)return;var o=state.odin;
 o.rows=[];o.headers=[];o.mapping={};o.fileName=file.name;o.sheetName='';o.sheetNames=[];o.workbook=null;o.rawMatrix=null;o.headerRow=2;
 notify('Membaca sumber Top 3 dari ODIN…');
 try{
  if(!/\.(xlsx|xls|xlsm)$/i.test(file.name))throw new Error('Sumber ODIN harus berupa workbook Excel (.xlsx, .xls, atau .xlsm).');
  var X=await loadXLSX(),wb=X.read(await file.arrayBuffer(),{type:'array',cellDates:false});
  if(!wb.SheetNames||!wb.SheetNames.length)throw new Error('Workbook ODIN tidak memiliki worksheet.');
  o.workbook=wb;o.sheetNames=wb.SheetNames.slice();o.sheetName=odinPreferredSheet(o.sheetNames);
  o.rawMatrix=X.utils.sheet_to_json(wb.Sheets[o.sheetName],{header:1,defval:'',raw:false,blankrows:false});
  applyOdinMatrix(o.rawMatrix,2);state.tab='actions';render();
  var latest=odinLatestMonth(o.sheetNames);
  notify('ODIN terbaca: '+o.rows.length+' baris pada '+o.sheetName+'. Bulan worksheet terbaru yang tersedia: '+(latest>=0?ODIN_MONTHS[latest]+' 2026':'tidak teridentifikasi')+'.','warn');
 }catch(e){o.rows=[];o.headers=[];o.fileName='';o.sheetName='';o.sheetNames=[];o.workbook=null;o.rawMatrix=null;render();notify(e.message||'File ODIN gagal dibaca.','error');}
}
function oVal(row,key){var col=state.odin.mapping[key];return col?row[col]:'';}
function odinFieldSelect(key,label){var o=state.odin,selected=o.mapping[key]||'',opts='<option value="">— Tidak dipetakan —</option>'+o.headers.map(function(h){return '<option value="'+esc(h)+'" '+(selected===h?'selected':'')+'>'+esc(h)+'</option>';}).join('');return '<label>'+esc(label)+'<select data-odin-map="'+esc(key)+'">'+opts+'</select></label>';}
function odinHours(row){
 var o=state.odin,keys=['elec','mech','comp'].filter(function(k){return !!o.mapping[k];});
 if(!keys.length)return NaN;
 var sum=0,seen=false;keys.forEach(function(k){var n=number(oVal(row,k));if(Number.isFinite(n)&&n>=0){sum+=n;seen=true;}});
 if(!seen)return NaN;
 return o.durationUnit==='minutes'?sum/60:sum;
}
function odinCanonicalIssue(machine,issue){
 var m=String(machine||'').toUpperCase().replace(/[^A-Z0-9]+/g,'').trim();
 var low=String(issue||'').toLowerCase().replace(/\s+/g,' ').trim();
 /* Curated aliases grounded in the existing ODIN records and approved MOR grouping.
    The original descriptions are retained alongside this label for auditability. */
 if((m==='APM2'||m==='APM#2')&&/timm?ing|fedtabel|feed\s*table/.test(low))return 'Timing Feed Table';
 if((m==='OFU1'||m==='OFU#1')&&/(roll.*(tinta|bak)|tinta.*roll)/.test(low)&&/(unit\s*8|\bu8\b|putaran|tidak berputar|abnormal|berhenti)/.test(low))return 'Roll Bak Tinta Unit 8 — Tidak Berputar / Abnormal';
 if(/gripper|griper/.test(low))return 'Gripper Transfer';
 if(/register/.test(low))return 'Register Berubah / Abnormal';
 if(/feeder|sucker|vacum|vacuum/.test(low))return 'Feeder / Suction — Abnormal';
 return String(issue||'').trim().replace(/\s+/g,' ');
}
function odinGroupedRows(){
 var o=state.odin;if(!o.rows.length||!o.mapping.problem)return [];
 var groups={};
 o.rows.forEach(function(row){
  var issue=String(oVal(row,'problem')||'').trim(),machine=String(oVal(row,'machine')||'').trim();
  if(!issue||/^(grand\s+)?total$|^subtotal$|^jumlah(\s+total)?$/i.test(issue))return;
  var canonical=odinCanonicalIssue(machine,issue);
  var norm=(machine+' | '+canonical).toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
  if(!norm)return;
  var g=groups[norm];if(!g)g=groups[norm]={machine:machine||'—',issue:canonical,section:String(oVal(row,'section')||'—').trim()||'—',rootCause:String(oVal(row,'rootCause')||'').trim(),corrective:String(oVal(row,'corrective')||'').trim(),actionPlan:String(oVal(row,'actionPlan')||'').trim(),hours:0,hasDuration:false,rows:0,notifications:{},fallbackEvents:0,sourceVariants:{}};
  g.sourceVariants[issue]=true;
  var h=odinHours(row);if(Number.isFinite(h)){g.hours+=h;g.hasDuration=true;}
  g.rows++;
  var notif=String(oVal(row,'notif')||'').trim();if(notif)g.notifications[notif]=true;else g.fallbackEvents++;
  if(g.section==='—'&&oVal(row,'section'))g.section=String(oVal(row,'section')).trim();
  if(!g.rootCause&&oVal(row,'rootCause'))g.rootCause=String(oVal(row,'rootCause')).trim();
  if(!g.corrective&&oVal(row,'corrective'))g.corrective=String(oVal(row,'corrective')).trim();
  if(!g.actionPlan&&oVal(row,'actionPlan'))g.actionPlan=String(oVal(row,'actionPlan')).trim();
 });
 return Object.keys(groups).map(function(k){var g=groups[k];g.events=Object.keys(g.notifications).length+g.fallbackEvents;g.variants=Object.keys(g.sourceVariants);return g;}).sort(function(a,b){return (b.hasDuration?b.hours:-1)-(a.hasDuration?a.hours:-1);});
}
function odinTopRows(){return odinGroupedRows().slice(0,3);}
function odinLatestMonthLabel(){var n=odinLatestMonth(state.odin.sheetNames);return n>=0?ODIN_MONTHS[n]+' 2026':'bulan belum teridentifikasi';}
function odinActionContent(){
 var o=state.odin;
 if(!o.fileName)return '<div class="tp-card"><h3 class="tp-section-title">Sumber Top 3 isu — Corrective ODIN</h3><p class="tp-muted">Top 3 isu diambil dari workbook Corrective ODIN, terpisah dari perhitungan OEE/TEEP dan filter kategori MTC. Impor sementara di browser; tidak dikirim ke server.</p><input id="tp-odin-file" type="file" accept=".xlsx,.xls,.xlsm"><div class="tp-actions"><button class="tp-btn primary" id="tp-odin-load">Baca file ODIN</button></div><p class="tp-muted">Pilih workbook Corrective ODIN. Setelah dibaca, pilih worksheet dan petakan kolom Problem serta durasi Elec/Mech/Comp. Action plan hanya tampil bila memang tersedia di sheet ODIN.</p></div>';
 var latest=odinLatestMonth(o.sheetNames),top=odinTopRows(),warn=latest>=0&&latest<8;
 var sourceControls='<div class="tp-card"><h3 class="tp-section-title">Sumber Top 3 — ODIN</h3><div class="tp-form"><label>Worksheet ODIN<select id="tp-odin-sheet">'+o.sheetNames.map(function(n){return '<option value="'+esc(n)+'" '+(n===o.sheetName?'selected':'')+'>'+esc(n)+'</option>';}).join('')+'</select></label><label>Baris header<input id="tp-odin-header-row" type="number" min="1" max="100" step="1" value="'+o.headerRow+'"></label><label>File aktif<input value="'+esc(o.fileName)+'" disabled></label></div><p class="tp-muted">Sheet aktif: '+esc(o.sheetName)+' · '+o.rows.length+' baris data. Durasi ditampilkan sebagai jam dengan asumsi kolom Elec/Mech/Comp memakai menit; verifikasi definisi unit pada workbook asli sebelum memakai angka.</p>'+(warn?'<p class="tp-message warn">PERINGATAN PERIODE: worksheet ODIN terbaru yang ditemukan hanya sampai '+esc(odinLatestMonthLabel())+'. Data sheet ini tidak boleh dianggap sebagai Top 3 September 2026.</p>':'')+'</div>';
 var mapping='<div class="tp-card" style="margin-top:12px"><h3 class="tp-section-title">Pemetaan kolom ODIN</h3><div class="tp-form">'+odinFieldSelect('machine','Mesin')+odinFieldSelect('date','Tanggal mulai')+odinFieldSelect('notif','Nomor notifikasi')+odinFieldSelect('section','Kategori / section')+odinFieldSelect('problem','Problem / isu')+odinFieldSelect('elec','Durasi Elec')+odinFieldSelect('mech','Durasi Mech')+odinFieldSelect('comp','Durasi Comp')+odinFieldSelect('rootCause','Root cause')+odinFieldSelect('corrective','Corrective action')+odinFieldSelect('actionPlan','Action plan')+'</div><div class="tp-actions"><label class="tp-muted">Satuan durasi sumber<select id="tp-odin-unit"><option value="minutes" '+(o.durationUnit==='minutes'?'selected':'')+'>Menit (÷ 60 menjadi jam)</option><option value="hours" '+(o.durationUnit==='hours'?'selected':'')+'>Jam</option></select></label><button class="tp-btn primary" id="tp-odin-apply-map">Terapkan pemetaan ODIN</button><button class="tp-btn" id="tp-odin-reset">Ganti file ODIN</button></div></div>';
 var issueRows=top.map(function(g,i){return {'Rank':i+1,'Issue / mesin (ODIN)':g.issue,'Mesin':g.machine,'Section':g.section,'Kejadian / notif':g.events,'LT ODIN (jam)':g.hasDuration?fmt(g.hours,2):'—','Variasi deskripsi sumber':g.variants.join(' | '),'Root cause':g.rootCause||'—','Corrective action':g.corrective||'—','Action plan':g.actionPlan||'—'};});
 var ready=!!o.mapping.problem&&['elec','mech','comp'].some(function(k){return !!o.mapping[k];});
 var topSection='<div class="tp-card" style="margin-top:12px"><h3 class="tp-section-title">Top 3 Issue dari ODIN</h3><p class="tp-muted">Dikelompokkan berdasarkan mesin + deskripsi Problem pada worksheet aktif dan diurutkan dari total durasi yang dipetakan. Data ODIN tidak dipakai untuk menghitung OEE atau Lost Time agregat MTC.</p>'+(!ready?'<div class="tp-empty">Petakan kolom Problem serta minimal satu kolom durasi Elec/Mech/Comp agar Top 3 dapat dihitung.</div>':table(issueRows,['Rank','Issue / mesin (ODIN)','Mesin','Section','Kejadian / notif','LT ODIN (jam)','Variasi deskripsi sumber','Root cause','Corrective action','Action plan']))+'<div class="tp-muted">Bila kolom Root cause, Corrective action, atau Action plan tidak tersedia pada sheet, isinya ditampilkan sebagai —. Tidak dibuat otomatis dari deskripsi isu.</div></div>';
 return sourceControls+mapping+topSection;
}
function number(v){if(typeof v==='number')return Number.isFinite(v)?v:NaN;var s=String(v==null?'':v).trim().replace(/\s/g,'');if(!s)return NaN;if(s.indexOf(',')>=0&&s.indexOf('.')>=0)s=s.replace(/\./g,'').replace(',','.');else if(s.indexOf(',')>=0)s=s.replace(',','.');var n=Number(s.replace(/%$/,''));if(String(v).indexOf('%')>=0)n=n/100;return Number.isFinite(n)?n:NaN;}
function rate(v){var n=number(v);if(!Number.isFinite(n)||n<0||n>100)return NaN;var explicitPercent=typeof v==='string'&&/%\s*$/.test(v.trim());if(n===1&&!explicitPercent)return NaN;return n>1?n/100:n;}
function calcOeeRows(){return state.rows.map(function(r){var a=rate(val(r,'availability')),p=rate(val(r,'performance')),q=rate(val(r,'quality')),u=rate(val(r,'utilization'));var valid=Number.isFinite(a)&&Number.isFinite(p)&&Number.isFinite(q);var oee=valid?a*p*q:NaN;return {machine:val(r,'machine')||'—',date:val(r,'date')||'—',availability:a,performance:p,quality:q,oee:oee,utilization:u,teep:Number.isFinite(oee)&&Number.isFinite(u)?oee*u:NaN};}).filter(function(r){return Number.isFinite(r.oee)||Number.isFinite(r.teep);});}
function fmt(n,d){return Number.isFinite(n)?n.toLocaleString('id-ID',{minimumFractionDigits:d==null?1:d,maximumFractionDigits:d==null?1:d}):'—';}
function hours(row,useMtcLostTime){var isMtc=/^MTC$/i.test(String(val(row,'category')).trim());var useExplicitMtcLt=!!useMtcLostTime&&isMtc;var raw=useExplicitMtcLt?(state.mapping.lt?val(row,'lt'):val(row,'downtime')):val(row,'downtime');var n=number(raw);if(!Number.isFinite(n)||n<0)return NaN;var unit=state.mapping.downtimeUnit||'hours';return unit==='minutes'?n/60:unit==='seconds'?n/3600:n;}
function ratioValue(key,row){var raw=val(row,key),n=number(raw);if(!Number.isFinite(n)||n<0||n>100)return NaN;var explicitPercent=typeof raw==='string'&&/%\s*$/.test(raw.trim());if(n===1&&!explicitPercent)return NaN;return n>1?n/100:n;}
function pctText(n){return Number.isFinite(n)?fmt(n*100,1)+'%':'—';}
/* Exact MTC category only; breakdown maintenance|maintenance breakdown are not treated as MTC. */
function calc(){
var mtcRows=state.rows.filter(function(r){return /^mtc$/i.test(String(val(r,'category')).trim());});
var categorySourceReady=!!state.mapping.category&&state.rows.some(function(r){return String(val(r,'category')==null?'':val(r,'category')).trim()!=='';});
var downtimeSourceReady=!!state.mapping.downtime&&state.rows.some(function(r){return Number.isFinite(hours(r,false));});
var mtcDurationSourceReady=categorySourceReady&&!!(state.mapping.lt||state.mapping.downtime);
var allHours=state.rows.map(function(r){return hours(r,false);}).filter(Number.isFinite),mtcHourValues=mtcRows.map(function(r){return hours(r,true);}),mtcHours=mtcHourValues.filter(Number.isFinite);
var mtcReconciliationBlocked=!!(state.mtcAudit&&state.mtcAudit.mismatch);
var bdValues=mtcRows.map(function(r){return number(val(r,'bd'));});
var bdMapped=!!state.mapping.bd;
var bdComplete=bdMapped&&bdValues.every(function(v){return Number.isFinite(v)&&v>=0;});
var incidentIds=mtcRows.map(function(r){return String(val(r,'incident')==null?'':val(r,'incident')).trim();});
var incidentMapped=!!state.mapping.incident;
var incidentIdsComplete=incidentMapped&&incidentIds.every(function(id){return id!=='';});
var uniqueIncidents=new Set(incidentIds.filter(function(id){return id!==''&&!/^TRIAL$/i.test(id);}).map(function(id){return id.toUpperCase();}));
var officialIncidentCountReady=!!(state.mtcAudit&&state.mtcAudit.incidentCountReliable&&Number.isFinite(state.mtcAudit.incidentCount));
var incidents=officialIncidentCountReady?state.mtcAudit.incidentCount:(mtcReconciliationBlocked||!categorySourceReady?NaN:!mtcRows.length?0:bdComplete?bdValues.reduce(function(a,b){return a+b;},0):incidentIdsComplete?uniqueIncidents.size:NaN);
var paired=state.rows.map(function(r){return {energy:number(val(r,'energy')),sheets:number(val(r,'sheets'))};}).filter(function(x){return Number.isFinite(x.energy)&&x.energy>=0&&Number.isFinite(x.sheets)&&x.sheets>0;});
var energy=paired.map(function(x){return x.energy;}),sheets=paired.map(function(x){return x.sheets;});
var enpiSource=state.rows.map(function(r){return number(val(r,'enpi'));}).filter(function(v){return Number.isFinite(v)&&v>=0;});var enpi=enpiSource.length?enpiSource[enpiSource.length-1]:(paired.length?energy.reduce(function(a,b){return a+b;},0)/sheets.reduce(function(a,b){return a+b;},0):NaN);
var mtcDurationsComplete=!mtcRows.length||mtcHourValues.every(Number.isFinite);
var lost=!mtcReconciliationBlocked&&mtcDurationSourceReady&&mtcDurationsComplete?mtcHours.reduce(function(a,b){return a+b;},0):NaN;
var total=downtimeSourceReady&&allHours.length?allHours.reduce(function(a,b){return a+b;},0):NaN;
var mtbfValues=mtcRows.map(function(r){return number(val(r,'mtbf'));}).filter(Number.isFinite),targetMtbfValues=mtcRows.map(function(r){return number(val(r,'targetMtbf'));}).filter(Number.isFinite),mttrValues=mtcRows.map(function(r){return number(val(r,'mttr'));}).filter(Number.isFinite),targetMttrValues=mtcRows.map(function(r){return number(val(r,'targetMttr'));}).filter(Number.isFinite),targetLostValues=mtcRows.map(function(r){return ratioValue('targetLost',r);}).filter(Number.isFinite);
var avg=function(a){if(!a.length)return NaN;for(var i=1;i<a.length;i++)if(Math.abs(a[i]-a[0])>1e-9)return NaN;return a[0];};
var oeeRows=state.rows.map(function(r){
var a=ratioValue('availability',r),p=ratioValue('performance',r),q=ratioValue('quality',r),sourceOee=ratioValue('oee',r),u=ratioValue('utilization',r),sourceTeep=ratioValue('teep',r),target=ratioValue('targetOee',r);
var calculatedOee=[a,p,q].every(Number.isFinite)?a*p*q:NaN;
var oee=Number.isFinite(calculatedOee)?calculatedOee:sourceOee;
var calculatedTeep=Number.isFinite(oee)&&Number.isFinite(u)?oee*u:NaN;
var teep=Number.isFinite(calculatedTeep)?calculatedTeep:sourceTeep;
return {machine:val(r,'machine'),period:val(r,'date'),availability:a,performance:p,quality:q,oeeSource:sourceOee,oeeCalculated:calculatedOee,oee:oee,utilization:u,teepSource:sourceTeep,teep:teep,targetOee:target,mtbf:number(val(r,'mtbf')),targetMtbf:number(val(r,'targetMtbf')),mttr:number(val(r,'mttr')),targetMttr:number(val(r,'targetMttr')),targetLost:ratioValue('targetLost',r),oeeCheck:Number.isFinite(sourceOee)&&Number.isFinite(calculatedOee)?(Math.abs(sourceOee-calculatedOee)<=0.005?'Cocok':'Periksa selisih'):'Belum dapat dibandingkan'};
});
return {mtcRows:mtcRows,incidents:incidents,mtcHours:lost,totalHours:total,ratio:Number.isFinite(lost)&&Number.isFinite(total)&&total>0?lost/total:NaN,enpi:enpi,mtbf:mtcReconciliationBlocked?NaN:avg(mtbfValues),targetMtbf:avg(targetMtbfValues),mttr:mtcReconciliationBlocked?NaN:avg(mttrValues),targetMttr:avg(targetMttrValues),targetLost:avg(targetLostValues),oeeRows:oeeRows};
}
function metric(title,value,sub){return '<div class="tp-card tp-metric"><small>'+esc(title)+'</small><b>'+esc(value)+'</b><span>'+esc(sub||'')+'</span></div>';}
function renderOfficialOeeSummaryCard(){
 var o=state.officialOee;if(!o)return '';
 var rows=o.rows.map(function(r){return {
  'Grup':r.group,'Jumlah mesin':fmt(r.machineCount,0),'Availability':pctText(r.availability),'Performance':pctText(r.performance),'Quality':pctText(r.quality),
  'OEE sumber':pctText(r.oee),'OEE hitung':pctText(r.oeeCalculated),'Validasi OEE':r.oeeCheck,
  'Downtime produksi':fmt(r.productionDowntime,2)+' jam','Operating time':fmt(r.netOperatingTime,2)+' jam',
  'Utilization kalender':pctText(r.utilization),'TEEP hitung':pctText(r.teep)
 };});
 return '<div class="tp-card" style="margin:12px 0"><h3 class="tp-section-title">Ringkasan OEE &amp; TEEP resmi · September 2026</h3><p class="tp-muted">Dibaca langsung dari workbook: OEE Printing (2), OEE AP, dan OEE FG. OEE hitung = Availability × Performance × Quality. Utilization kalender = (Net Operating Time + Downtime produksi) ÷ (720 jam × jumlah mesin); TEEP = OEE × Utilization. Ringkasan grup ini terpisah dari baris harian pada worksheet aktif.</p>'+table(rows,['Grup','Jumlah mesin','Availability','Performance','Quality','OEE sumber','OEE hitung','Validasi OEE','Downtime produksi','Operating time','Utilization kalender','TEEP hitung'])+'<p class="tp-muted">Total downtime produksi tiga grup: '+fmt(o.totalProductionDowntime,2)+' jam. Nilai ini bukan Lost Time MTC.</p></div>';
}
function renderMtcAuditCard(){
 var a=state.mtcAudit;if(!a)return '';
 function auditReason(r){
  var reasons=[];
  if(!r.complete||!r.sourceComplete)reasons.push('kolom/baris sumber tidak lengkap');
  if(r.eventMismatch)reasons.push('PRO unik dalam SUBTOTAL ≠ Pivot');
  if(r.hoursMismatch)reasons.push('jam non-TRIAL ≠ Pivot');
  if(r.autoFilterCoverageIssue)reasons.push('AutoFilter lebih pendek dari data');
  if(r.subtotalFormulaShortIssue)reasons.push('formula SUBTOTAL berhenti sebelum akhir data');
  if(r.subtotalMtcOutside)reasons.push('MTC di luar rentang SUBTOTAL');
  if(r.visibilityIssue)reasons.push('baris MTC tersembunyi pada state workbook');
  return reasons.length?reasons.join('; '):'Cocok';
 }
 var rows=a.rows.map(function(r){return {
  'Grup':r.group,'Rentang SUBTOTAL':r.detailRangeFromFormula?(r.detailStartRow+'–'+r.detailEndRow):'Fallback',
  'Baris MTC seluruh sheet':fmt(r.sourceMtcRows,0),'Baris MTC terlihat':fmt(r.visibleMtcRows,0),'Baris MTC tersembunyi':fmt(r.hiddenMtcRows,0),'Baris MTC dalam SUBTOTAL':fmt(r.detailRecords,0),
  'PRO unik non-TRIAL':r.sourceComplete?fmt(r.sourceEventCount,0):'—','PRO unik dalam SUBTOTAL':fmt(r.detailEvents,0),
  'Baris TRIAL seluruh sheet':fmt(r.sourceTrialRows,0),'MTC di luar SUBTOTAL':fmt(r.outsideSubtotalMtcRows,0),
  'Jam MTC dalam SUBTOTAL':fmt(r.detailHours,2),'Jam non-TRIAL dalam SUBTOTAL':fmt(r.nonTrialHours,2),
  'Kejadian Pivot':Number.isFinite(r.pivotRecords)?fmt(r.pivotRecords,0):'—','Jam Pivot':Number.isFinite(r.pivotHours)?fmt(r.pivotHours,2):'—',
  'Δ jam non-TRIAL − Pivot':Number.isFinite(r.deltaHours)?fmt(r.deltaHours,2):'—',
  'Rentang AutoFilter':r.filterRange,'Rentang data':r.usedRange,'Status':auditReason(r)
 };});
 rows.push({
  'Grup':'TOTAL','Rentang SUBTOTAL':'—',
  'Baris MTC seluruh sheet':fmt(a.rows.reduce(function(n,r){return n+r.sourceMtcRows;},0),0),
  'Baris MTC terlihat':fmt(a.rows.reduce(function(n,r){return n+r.visibleMtcRows;},0),0),
  'Baris MTC tersembunyi':fmt(a.rows.reduce(function(n,r){return n+r.hiddenMtcRows;},0),0),
  'Baris MTC dalam SUBTOTAL':fmt(a.rows.reduce(function(n,r){return n+r.detailRecords;},0),0),
  'PRO unik non-TRIAL':a.incidentCountReliable?fmt(a.incidentCount,0):'—',
  'PRO unik dalam SUBTOTAL':fmt(a.rows.reduce(function(n,r){return n+r.detailEvents;},0),0),
  'Baris TRIAL seluruh sheet':fmt(a.rows.reduce(function(n,r){return n+r.sourceTrialRows;},0),0),
  'MTC di luar SUBTOTAL':fmt(a.rows.reduce(function(n,r){return n+r.outsideSubtotalMtcRows;},0),0),
  'Jam MTC dalam SUBTOTAL':fmt(a.rows.reduce(function(n,r){return n+r.detailHours;},0),2),
  'Jam non-TRIAL dalam SUBTOTAL':fmt(a.rows.reduce(function(n,r){return n+r.nonTrialHours;},0),2),
  'Kejadian Pivot':fmt(a.rows.reduce(function(n,r){return n+(Number.isFinite(r.pivotRecords)?r.pivotRecords:0);},0),0),
  'Jam Pivot':fmt(a.rows.reduce(function(n,r){return n+(Number.isFinite(r.pivotHours)?r.pivotHours:0);},0),2),
  'Δ jam non-TRIAL − Pivot':fmt(a.rows.reduce(function(n,r){return n+(Number.isFinite(r.deltaHours)?r.deltaHours:0);},0),2),
  'Rentang AutoFilter':'—','Rentang data':'—','Status':a.mismatch?'Lost Time perlu direkonsiliasi':'Cocok'
 });
 return '<div class="tp-card" style="margin:12px 0"><h3 class="tp-section-title">Audit sumber Lost Time MTC</h3><p class="tp-muted">'+esc(a.note)+'</p>'+table(rows,['Grup','Rentang SUBTOTAL','Baris MTC seluruh sheet','Baris MTC terlihat','Baris MTC tersembunyi','Baris MTC dalam SUBTOTAL','PRO unik non-TRIAL','PRO unik dalam SUBTOTAL','Baris TRIAL seluruh sheet','MTC di luar SUBTOTAL','Jam MTC dalam SUBTOTAL','Jam non-TRIAL dalam SUBTOTAL','Kejadian Pivot','Jam Pivot','Δ jam non-TRIAL − Pivot','Rentang AutoFilter','Rentang data','Status'])+'<p class="tp-muted">Jumlah kejadian memakai PRO unik non-TRIAL dari seluruh worksheet detail bila identitas lengkap. Lost Time, MTBF, MTTR, dan rasio MTC tetap tidak ditampilkan sebagai KPI final selama audit jam/rentang belum cocok. OEE/TEEP resmi ditampilkan terpisah.</p></div>';
}
function tabContent(){if(!state.rows.length&&state.tab!=='actions')return '<div class="tp-card"><h3 class="tp-section-title">Impor laporan resmi</h3><p class="tp-muted">Pilih file sumber OEE, downtime, maintenance, atau energi. File tidak diunggah ke server dalam tahap ini.</p><input id="tp-file" type="file" accept=".xlsx,.xls,.xlsm,.csv"><div class="tp-actions"><button class="tp-btn primary" id="tp-load">Baca file</button></div><p class="tp-muted">Excel multi-sheet: pilih sheet dan baris header setelah file dibaca. Untuk OEE Printing, sheet sumber yang tersedia dapat berbeda dari sheet Compare atau Dashboard. KPI hanya dihitung dari sheet aktif; sumber lintas-sheet belum digabung otomatis.</p></div><div class="tp-two"><div class="tp-card"><h3 class="tp-section-title">Modul yang disiapkan</h3><div class="tp-kv"><span>OEE &amp; TEEP</span><b>Menunggu pemetaan sumber</b></div><div class="tp-kv"><span>Downtime Pareto</span><b>Menunggu pemetaan sumber</b></div><div class="tp-kv"><span>Maintenance KPI</span><b>MTC-only</b></div><div class="tp-kv"><span>Top issue &amp; action plan</span><b>Menunggu kolom sumber</b></div><div class="tp-kv"><span>Energy / ENPI</span><b>Menunggu pemetaan sumber</b></div></div><div class="tp-card"><h3 class="tp-section-title">Aturan validasi</h3><ul class="tp-list"><li>MTBF, MTTR, dan maintenance lost time hanya memakai kejadian kategori MTC.</li><li>OEE dan TEEP ditampilkan terpisah; tidak dihitung dari downtime maintenance saja.</li><li>ENPI membutuhkan data energi dan jumlah sheet/output yang sepadan.</li><li>Nilai tanpa definisi kolom atau unit tidak ditafsirkan otomatis.</li></ul></div></div>';
if(state.tab==='mapping')return '<div class="tp-card"><h3 class="tp-section-title">Pemetaan kolom sumber</h3><p class="tp-muted">Pilih kolom yang sesuai. Pemetaan ini eksplisit agar nama kolom yang berbeda tidak menghasilkan KPI keliru. Satu worksheet aktif digunakan untuk tabel saat ini; pilih sumber yang cocok dan jangan campur basis periode atau cakupan mesin.</p><div class="tp-form">'+fieldSelect('machine','Mesin')+fieldSelect('date','Tanggal / periode')+fieldSelect('category','Kategori downtime (MTC)')+fieldSelect('downtime','Downtime')+fieldSelect('incident','ID / nama kejadian')+fieldSelect('issue','Issue / mesin')+fieldSelect('cause','Kategori / penyebab downtime')+fieldSelect('rootCause','Root cause')+fieldSelect('action','Corrective action')+fieldSelect('actionPlan','Action plan')+fieldSelect('owner','PIC')+fieldSelect('due','Due date')+fieldSelect('status','Status action')+fieldSelect('energy','Energi (kWh)')+fieldSelect('sheets','Jumlah sheet / output')+fieldSelect('enpi','ENPI sumber (kWh/sheet)')+fieldSelect('availability','Availability (%)')+fieldSelect('performance','Performance (%)')+fieldSelect('quality','Quality (%)')+fieldSelect('oee','OEE sumber (%)')+fieldSelect('utilization','Utilization untuk TEEP')+fieldSelect('teep','TEEP sumber (%)')+fieldSelect('targetOee','Target OEE (%)')+fieldSelect('mtbf','MTBF (jam)')+fieldSelect('targetMtbf','Target MTBF (jam)')+fieldSelect('mttr','MTTR (jam)')+fieldSelect('targetMttr','Target MTTR (jam)')+fieldSelect('targetLost','Target Lost Time (%)')+fieldSelect('bd','Jumlah breakdown MTC')+fieldSelect('lt','Lost Time MTC (jam)')+'</div><div class="tp-actions"><label class="tp-muted">Satuan downtime <select id="tp-downtime-unit"><option value="hours">Jam</option><option value="minutes">Menit</option><option value="seconds">Detik</option></select></label><button class="tp-btn primary" id="tp-save-map">Terapkan pemetaan</button><button class="tp-btn" id="tp-reset">Ganti file</button></div></div><div class="tp-card" style="margin-top:12px"><h3 class="tp-section-title">Pratinjau data sumber</h3>'+table(state.rows.slice(0,10),state.headers)+'</div>';
var c=calc(),oeeSample=c.oeeRows.find(function(r){return Number.isFinite(r.oee);}),teepSample=c.oeeRows.find(function(r){return Number.isFinite(r.teep);});if(state.tab==='overview')return renderOfficialOeeSummaryCard()+renderMtcAuditCard()+'<div class="tp-grid">'+metric('Baris impor',fmt(state.rows.length,0),state.fileName)+metric('OEE',oeeSample?pctText(oeeSample.oee):'—','Availability × Performance × Quality')+metric('TEEP',teepSample?pctText(teepSample.teep):'—','OEE × Utilization')+metric('Total downtime',Number.isFinite(c.totalHours)?fmt(c.totalHours)+' jam':'—','Baris dengan downtime terpetakan')+metric('Downtime MTC',Number.isFinite(c.mtcHours)?fmt(c.mtcHours)+' jam':'—','Kategori persis MTC saja')+metric('Rasio MTC / total',Number.isFinite(c.ratio)?fmt(c.ratio*100)+'%':'—','Hanya jika basis periode dan sumber sama')+'</div><div class="tp-two"><div class="tp-card"><h3 class="tp-section-title">Status sumber</h3><div class="tp-kv"><span>File</span><b>'+esc(state.fileName)+'</b></div><div class="tp-kv"><span>Sheet</span><b>'+esc(state.sheetName||'CSV')+'</b></div><div class="tp-kv"><span>Pemetaan</span><b>'+Object.keys(state.mapping).filter(function(k){return state.mapping[k];}).length+' kolom</b></div><div class="tp-kv"><span>Kejadian MTC</span><b>'+fmt(c.incidents,0)+' terdeteksi</b></div></div><div class="tp-card"><h3 class="tp-section-title">Batas interpretasi</h3><p class="tp-muted">Angka berasal dari file yang diimpor ke sesi browser ini. Periksa definisi downtime, periode, unit, dan basis output sebelum dipakai dalam review manajemen.</p><p class="tp-muted">MTBF/MTTR hanya diringkas dari nilai eksplisit yang dipetakan pada baris kategori MTC; tidak diestimasi dari data yang tidak lengkap.</p></div></div>';
if(state.tab==='maintenance')return renderMtcAuditCard()+'<div class="tp-grid">'+metric('Kejadian MTC',Number.isFinite(c.incidents)?fmt(c.incidents,0):'—','PRO unik non-TRIAL dari OEE bila tersedia')+metric('Downtime MTC',Number.isFinite(c.mtcHours)?fmt(c.mtcHours)+' jam':'—','Dari kolom downtime / Lost Time terpetakan')+metric('MTBF aktual / target',Number.isFinite(c.mtbf)?fmt(c.mtbf)+' / '+fmt(c.targetMtbf)+' jam':'—','Nilai eksplisit pada baris MTC')+metric('MTTR aktual / target',Number.isFinite(c.mttr)?fmt(c.mttr)+' / '+fmt(c.targetMttr)+' jam':'—','Nilai eksplisit pada baris MTC')+metric('Lost Time aktual / target',Number.isFinite(c.ratio)?fmt(c.ratio*100)+'% / '+(Number.isFinite(c.targetLost)?fmt(c.targetLost*100)+'%':'—'):'—','Aktual dihitung hanya bila total dan MTC satu basis')+'</div><div class="tp-card"><h3 class="tp-section-title">Rincian kejadian MTC</h3>'+table(c.mtcRows.map(function(r){return {'Tanggal':val(r,'date'),'Mesin':val(r,'machine'),'Kategori':val(r,'category'),'Breakdown':val(r,'bd'),'Downtime / LT':Number.isFinite(hours(r,true))?fmt(hours(r,true))+' jam':val(r,'downtime'),'MTBF aktual (jam)':val(r,'mtbf'),'MTBF target (jam)':val(r,'targetMtbf'),'MTTR aktual (jam)':val(r,'mttr'),'MTTR target (jam)':val(r,'targetMttr'),'Issue':val(r,'issue')||val(r,'cause'),'Root cause':val(r,'rootCause'),'Corrective action':val(r,'action')};}),['Tanggal','Mesin','Kategori','Breakdown','Downtime / LT','MTBF aktual (jam)','MTBF target (jam)','MTTR aktual (jam)','MTTR target (jam)','Issue','Root cause','Corrective action'])+'</div>';
if(state.tab==='downtime'){var grouped={};state.rows.forEach(function(r){var cat=String(val(r,'cause')||val(r,'category')||'Tidak diklasifikasikan');var h=hours(r,false);if(Number.isFinite(h))grouped[cat]=(grouped[cat]||0)+h;});var arr=Object.keys(grouped).map(function(k){return {label:k,hours:grouped[k]};}).sort(function(a,b){return b.hours-a.hours;}).slice(0,10);var max=arr.length?arr[0].hours:1;var bars=arr.map(function(r){return '<div style="margin:10px 0"><div style="display:flex;justify-content:space-between;gap:10px;font-size:12px;margin-bottom:5px"><span>'+esc(r.label)+'</span><b>'+fmt(r.hours,2)+' jam</b></div><div style="height:8px;background:var(--border,#e1e6ef);border-radius:999px;overflow:hidden"><span style="display:block;height:100%;width:'+Math.max(0,Math.min(100,r.hours/max*100))+'%;background:var(--primary,#2366d1);border-radius:999px"></span></div></div>';}).join('');return '<div class="tp-card"><h3 class="tp-section-title">Top 10 Downtime Loss</h3><p class="tp-muted">Pareto diurutkan berdasarkan jam downtime. Pastikan semua baris memakai periode dan satuan yang sepadan.</p>'+bars+table(arr.map(function(r){return {'Kategori / issue':r.label,'Downtime (jam)':fmt(r.hours,2)};}),['Kategori / issue','Downtime (jam)'])+'</div>';}
if(state.tab==='energy'){var energyRows=state.rows.map(function(r){var source=number(val(r,'enpi')),e=number(val(r,'energy')),sh=number(val(r,'sheets'));var v=Number.isFinite(source)&&source>=0?source:(Number.isFinite(e)&&e>=0&&Number.isFinite(sh)&&sh>0?e/sh:NaN);return {period:val(r,'date')||'—',machine:val(r,'machine')||'—',enpi:v,energy:e,sheets:sh};}).filter(function(r){return Number.isFinite(r.enpi);});var maxEnpi=energyRows.reduce(function(m,r){return Math.max(m,r.enpi);},0)||1;var trend=energyRows.slice(-12).map(function(r){return '<div style="margin:9px 0"><div style="display:flex;justify-content:space-between;gap:10px;font-size:12px;margin-bottom:5px"><span>'+esc(r.period)+' · '+esc(r.machine)+'</span><b>'+fmt(r.enpi,5)+' kWh/sheet</b></div><div style="height:7px;background:var(--border,#e1e6ef);border-radius:999px;overflow:hidden"><span style="display:block;height:100%;width:'+Math.max(0,Math.min(100,r.enpi/maxEnpi*100))+'%;background:var(--primary,#2366d1);border-radius:999px"></span></div></div>';}).join('');return '<div class="tp-grid">'+metric('ENPI terakhir',Number.isFinite(c.enpi)?fmt(c.enpi,5)+' kWh/sheet':'—','Nilai terakhir yang valid dalam urutan file')+metric('Data energi',fmt(state.rows.filter(function(r){return Number.isFinite(number(val(r,'energy')));}).length,0),'Baris energi numerik')+metric('Data output',fmt(state.rows.filter(function(r){return Number.isFinite(number(val(r,'sheets')))&&number(val(r,'sheets'))>0;}).length,0),'Baris jumlah sheet numerik')+metric('Baris ENPI valid',fmt(energyRows.length,0),'Sumber ENPI atau energi ÷ sheet')+'</div><div class="tp-card"><h3 class="tp-section-title">ENPI per mesin / periode</h3><p class="tp-muted">Maksimal 12 baris terakhir sesuai urutan workbook. Jika ada banyak mesin dalam periode yang sama, bandingkan hanya dengan cakupan yang sepadan; nilai ini tidak diagregasi lintas mesin.</p>'+trend+table(energyRows.slice(-12).map(function(r){return {'Periode':r.period,'Mesin':r.machine,'ENPI (kWh/sheet)':fmt(r.enpi,5),'Energi (kWh)':Number.isFinite(r.energy)?fmt(r.energy,2):'—','Sheet':Number.isFinite(r.sheets)?fmt(r.sheets,0):'—'};}),['Periode','Mesin','ENPI (kWh/sheet)','Energi (kWh)','Sheet'])+'</div><div class="tp-card"><h3 class="tp-section-title">Catatan energi</h3><p class="tp-muted">ENPI hanya layak dibandingkan jika energi dan output berasal dari periode, area, dan cakupan mesin yang sepadan. Jika laporan resmi sudah menyediakan ENPI, nilai tersebut dipertahankan; bila tidak, dihitung sebagai energi ÷ sheet.</p></div>';}
if(state.tab==='oee'){var oeeRows=c.oeeRows;return renderOfficialOeeSummaryCard()+'<div class="tp-two"><div class="tp-card"><h3 class="tp-section-title">OEE</h3><p class="tp-muted">OEE = Availability × Performance × Quality. Nilai dihitung dari komponen sumber bila tersedia; OEE sumber ditampilkan untuk pemeriksaan selisih.</p><div class="tp-pill">'+oeeRows.filter(function(r){return Number.isFinite(r.oee);}).length+' baris OEE tersedia</div></div><div class="tp-card"><h3 class="tp-section-title">TEEP</h3><p class="tp-muted">TEEP = OEE × Utilization. Utilization harus menggunakan basis kalender yang ditetapkan dalam laporan resmi.</p><div class="tp-pill">'+oeeRows.filter(function(r){return Number.isFinite(r.teep);}).length+' baris TEEP tersedia</div></div></div><div class="tp-card" style="margin-top:12px"><h3 class="tp-section-title">Hasil per mesin / periode</h3><p class="tp-muted">Nilai persentase sumber 0–1, 0–100, atau bertanda % dinormalisasi. Hasil tidak diagregasi lintas periode/mesin.</p>'+table(oeeRows.map(function(r){return {Mesin:r.machine,Tanggal:r.period,Availability:pctText(r.availability),Performance:pctText(r.performance),Quality:pctText(r.quality),'OEE sumber':pctText(r.oeeSource),'OEE hitung':pctText(r.oeeCalculated),Validasi:r.oeeCheck,Utilization:pctText(r.utilization),'TEEP sumber':pctText(r.teepSource),TEEP:pctText(r.teep),'Target OEE':pctText(r.targetOee)};}),['Mesin','Tanggal','Availability','Performance','Quality','OEE sumber','OEE hitung','Validasi','Utilization','TEEP sumber','TEEP','Target OEE'])+'</div><div class="tp-card" style="margin-top:12px"><h3 class="tp-section-title">Validasi wajib</h3><ul class="tp-list"><li>Pastikan kolom memakai periode dan cakupan mesin yang sama.</li><li>Bandingkan OEE hitung dengan OEE sumber; selisih lebih dari 0,5 poin persentase ditandai untuk diperiksa.</li><li>Jangan membandingkan nilai lintas periode sebelum definisi utilization dan planned time dikonfirmasi.</li></ul></div>';}
if(state.tab==='actions')return odinActionContent();
return '';}
function render(){if(!allowed()){syncAuth();return;}ensureStyle();ensureNav();var p=ensurePage();if(!p)return;syncAuth();var body=$('tp-body');if(!body)return;var tabs=[['overview','Overview'],['oee','OEE & TEEP'],['downtime','Downtime Pareto'],['maintenance','Maintenance KPI'],['energy','Energy / ENPI'],['actions','Top Issue & Action'],['mapping','Pemetaan / Impor']];body.innerHTML=(state.workbook&&state.sheetNames.length>1?'<div class="tp-card" style="margin-bottom:12px"><h3 class="tp-section-title">Sumber aktif</h3><div class="tp-form"><label>Worksheet Excel<select id="tp-sheet-select">'+state.sheetNames.map(function(n){return '<option value="'+esc(n)+'" '+(n===state.sheetName?'selected':'')+'>'+esc(n)+'</option>';}).join('')+'</select></label><label>Baris header<input id="tp-header-row" type="number" min="1" max="100" step="1" value="'+state.headerRow+'"></label><label>Baris data mulai<input id="tp-data-start-row" type="number" min="'+(state.headerRow+1)+'" max="10000" step="1" value="'+state.dataStartRow+'"></label></div><p class="tp-muted">Workbook ini memiliki '+state.sheetNames.length+' worksheet. Baris header terpisah dari awal data; sheet bertipe dashboard seperti Kertas Kerja dapat memiliki beberapa baris bantu di bawah header. Hanya worksheet aktif yang dipakai untuk KPI.</p></div>':'')+'<div class="tp-tabs" role="tablist">'+tabs.map(function(t){return '<button type="button" role="tab" data-tp-tab="'+t[0]+'" aria-selected="'+(state.tab===t[0]?'true':'false')+'">'+t[1]+'</button>';}).join('')+'</div>'+tabContent();var sheetSelect=$('tp-sheet-select');if(sheetSelect)sheetSelect.addEventListener('change',function(){try{loadSheetMatrix(sheetSelect.value,null,true);}catch(e){notify(e.message||'Sheet gagal dibaca.','error');}});var headerRowInput=$('tp-header-row');if(headerRowInput)headerRowInput.addEventListener('change',function(){try{if(!state.rawMatrix)return;state.mapping={};var h=Math.max(1,parseInt(headerRowInput.value,10)||defaultHeaderRow(state.sheetName));applyMatrix(state.rawMatrix,h,defaultDataStartRow(state.sheetName,h));state.tab='mapping';render();notify('Baris header dan awal data diterapkan: '+state.headerRow+' / '+state.dataStartRow+'. Periksa kembali nama kolom sebelum menerapkan pemetaan.','warn');}catch(e){notify(e.message||'Baris header tidak valid.','error');}});var dataStartRowInput=$('tp-data-start-row');if(dataStartRowInput)dataStartRowInput.addEventListener('change',function(){try{if(!state.rawMatrix)return;state.mapping={};applyMatrix(state.rawMatrix,state.headerRow,dataStartRowInput.value);state.tab='mapping';render();notify('Baris data mulai diterapkan: '+state.dataStartRow+'. Periksa kembali pratinjau sebelum menerapkan pemetaan.','warn');}catch(e){notify(e.message||'Baris data mulai tidak valid.','error');}});body.querySelectorAll('[data-tp-tab]').forEach(function(b){b.addEventListener('click',function(){state.tab=b.getAttribute('data-tp-tab');render();});});var load=$('tp-load'),file=$('tp-file');if(load)load.addEventListener('click',function(){if(!file||!file.files||!file.files[0]){notify('Pilih file terlebih dahulu.','warn');return;}readFile(file.files[0]);});var mapbtn=$('tp-save-map');if(mapbtn)mapbtn.addEventListener('click',function(){body.querySelectorAll('[data-map]').forEach(function(el){state.mapping[el.getAttribute('data-map')]=el.value;});var unit=$('tp-downtime-unit');if(unit)state.mapping.downtimeUnit=unit.value;state.tab='overview';render();notify('Pemetaan diterapkan untuk pratinjau ini. Periksa kembali unit dan kategori sebelum memakai angka.','');});var reset=$('tp-reset');if(reset)reset.addEventListener('click',function(){state.rows=[];state.headers=[];state.mapping={};state.fileName='';state.sheetName='';state.sheetNames=[];state.workbook=null;state.rawMatrix=null;state.headerRow=1;state.officialOee=null;state.mtcAudit=null;state.tab='overview';render();});
var odinLoad=$('tp-odin-load'),odinFile=$('tp-odin-file');if(odinLoad)odinLoad.addEventListener('click',function(){if(!odinFile||!odinFile.files||!odinFile.files[0]){notify('Pilih file ODIN terlebih dahulu.','warn');return;}readOdinFile(odinFile.files[0]);});
var odinSheet=$('tp-odin-sheet');if(odinSheet)odinSheet.addEventListener('change',function(){try{loadOdinSheet(odinSheet.value,2,true);}catch(e){notify(e.message||'Sheet ODIN gagal dibaca.','error');}});
var odinHeader=$('tp-odin-header-row');if(odinHeader)odinHeader.addEventListener('change',function(){try{if(!state.odin.rawMatrix)return;applyOdinMatrix(state.odin.rawMatrix,odinHeader.value);render();notify('Baris header ODIN diterapkan. Periksa kembali pemetaan kolom.','warn');}catch(e){notify(e.message||'Baris header ODIN tidak valid.','error');}});
var odinApply=$('tp-odin-apply-map');if(odinApply)odinApply.addEventListener('click',function(){body.querySelectorAll('[data-odin-map]').forEach(function(el){state.odin.mapping[el.getAttribute('data-odin-map')]=el.value;});var unit=$('tp-odin-unit');if(unit)state.odin.durationUnit=unit.value;render();notify('Pemetaan ODIN diterapkan untuk menghitung Top 3 pada worksheet aktif. Periksa periode dan unit sumber.','warn');});
var odinReset=$('tp-odin-reset');if(odinReset)odinReset.addEventListener('click',function(){state.odin={rows:[],headers:[],fileName:'',sheetName:'',sheetNames:[],workbook:null,rawMatrix:null,headerRow:2,mapping:{},durationUnit:'minutes'};render();});}
function init(){ensureStyle();ensureNav();ensurePage();syncAuth();if(!window.__tpAuthObserver){window.__tpAuthObserver=true;var tpAuthChecks=0;var tpAuthTimer=setInterval(function(){syncAuth();tpAuthChecks++;if(tpAuthChecks>=40)clearInterval(tpAuthTimer);},1800);document.addEventListener('visibilitychange',function(){if(!document.hidden)syncAuth();});window.addEventListener('focus',syncAuth);}if(!window.__tpRenderHook){window.__tpRenderHook=true;document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-view="technical-performance"]');if(b&&allowed())setTimeout(render,60);});}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
window.OMODOS_TechnicalPerformance={render:render,syncAuth:syncAuth};
})();