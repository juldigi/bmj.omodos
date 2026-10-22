/* OMODOS Technical Performance — OEE / TEEP • isolated, additive module */
(function(){
'use strict';
if(window.__OMODOS_TECHNICAL_PERFORMANCE_V1__) return;
window.__OMODOS_TECHNICAL_PERFORMANCE_V1__=true;
var PAGE_ID='view-technical-performance',NAV_ID='nav-technical-performance',TYPE='technical-performance-import';
var STATE={records:[],datasets:[],loaded:false,loading:false,saving:false,tab:'dashboard',period:'',group:'',machine:'',workbook:null,fileName:'',fileSize:0,sheetName:'',sheetIndex:0,rawRows:[],headerRow:0,headers:[],mapping:{},preview:[],importWarnings:[],importErrors:[],lastImport:null};
var KEYS=['group','machine','period','plannedTime','calendarTime','operatingTime','netOperatingTime','fullyProductiveTime','downtime','availabilityInput','performanceInput','qualityInput','utilizationInput','oeeInput','teepInput','goodQty','ncQty','totalQty'];
var LABELS={group:'Grup / area mesin',machine:'Nama mesin',period:'Periode',plannedTime:'PPT — Planned Production Time (jam)',calendarTime:'POT — Plant Operating Time (jam)',operatingTime:'OT — Operating Time (jam)',netOperatingTime:'NOT — Net Operating Time (jam)',fullyProductiveTime:'FPT — Fully Productive Time (jam)',downtime:'Downtime (jam)',availabilityInput:'Availability (%)',performanceInput:'Performance (%)',qualityInput:'Quality (%)',utilizationInput:'Utilization (%)',oeeInput:'OEE sumber (%)',teepInput:'TEEP sumber (%)',goodQty:'Good Qty',ncQty:'NC Qty (tidak otomatis dianggap good)',totalQty:'Total Qty'};
var ALIASES={
group:['group','machine group','grup mesin','kelompok mesin','grup','area','departemen','department','section','line','kategori mesin','kategori'],
machine:['machine','machine name','machine name/id','machine code','nama mesin','mesin','kode mesin','asset','asset name','equipment','equipment name','unit','nama aset'],
period:['period','periode','bulan','month','tanggal','date','report month','report period','periode laporan'],
plannedTime:['ppt','planned production time','planned production time ppt','planned time','waktu produksi terencana','waktu produksi direncanakan','jam produksi terencana','planned production hours','production time'],
calendarTime:['pot','plant operating time','calendar time','calendar hours','calendar time pot','waktu kalender','total waktu kalender','calendar','available calendar time'],
operatingTime:['ot','operating time','operating hours','run time','running time','waktu operasi','waktu operasi mesin','jam operasi','operating time ot'],
netOperatingTime:['not','net operating time','net operating hours','net run time','waktu operasi bersih','jam operasi bersih'],
fullyProductiveTime:['fpt','fully productive time','fully productive hours','waktu produktif penuh','jam produktif penuh'],
downtime:['downtime','downtime loss','downtime hours','downtime (hours)','downtime jam','waktu downtime','jam downtime','loss downtime','loss time'],
availabilityInput:['availability','availability (%)','availability percent','availability %','avail','a (%)','a','availability rate'],
performanceInput:['performance','performance (%)','performance percent','performance %','p (%)','p','performance rate'],
qualityInput:['quality','quality (%)','quality percent','quality %','quality rate','q (%)','q','yield','first pass yield'],
utilizationInput:['utilization','utilization (%)','utilization percent','utilization %','u (%)','u','utilisation'],
oeeInput:['oee','oee (%)','oee percent','oee %','overall equipment effectiveness'],
teepInput:['teep','teep (%)','teep percent','teep %','total effective equipment performance'],
goodQty:['good qty','good quantity','good output','good product','good products','produk baik','jumlah good','qty good','good','ok qty','good pcs'],
ncQty:['nc qty','nc quantity','non conforming qty','non-conforming qty','nonconforming qty','produk nc','jumlah nc','nc'],
totalQty:['total qty','total quantity','total output','total produksi','jumlah produksi','produksi total','qty total','input qty','total'],
};
function $(id){return document.getElementById(id);}
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function currentUser(){try{if(typeof CURRENT_USER!=='undefined'&&CURRENT_USER)return CURRENT_USER;}catch(e){}return window.CURRENT_USER||null;}
function isSuperadmin(){var u=currentUser();return !!u&&String(u.role||u.Role||u.roleName||u.role_name||'').toLowerCase().replace(/[\s_-]+/g,'')==='superadmin';}
function sessionToken(){try{if(typeof SETTING_AUTH_OK!=='undefined'&&SETTING_AUTH_OK&&typeof SETTING_SESSION_TOKEN!=='undefined'&&SETTING_SESSION_TOKEN)return SETTING_SESSION_TOKEN;return typeof SESSION_TOKEN!=='undefined'?String(SESSION_TOKEN||''):'';}catch(e){return '';}}
function apiUrl(){try{return typeof WEB_APP_URL!=='undefined'?String(WEB_APP_URL||''):'';}catch(e){return '';}}
function randomId(){try{if(window.crypto&&typeof window.crypto.randomUUID==='function')return window.crypto.randomUUID();}catch(e){}return 'tp-'+Date.now()+'-'+Math.random().toString(36).slice(2,10);}
async function apiRequest(action,payload){var url=apiUrl(),token=sessionToken();if(!url||!token)throw new Error('Sesi login belum siap. Silakan masuk kembali.');var body=Object.assign({},payload||{},{action:action,sessionToken:token});if(action==='offsetWaysSave'||action==='offsetWaysDelete')body.transactionId=body.transactionId||randomId();var opts={method:'POST',mode:'cors',credentials:'omit',redirect:'follow',cache:'no-store',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(body)};var res=typeof fetchWithTimeout_==='function'?await fetchWithTimeout_(url,opts,45000):await fetch(url,opts);var data=typeof parseApiResponse_==='function'?await parseApiResponse_(res):await res.json();if(!data||data.ok!==true)throw new Error(typeof(data&&data.error)==='string'?data.error:(data&&data.error&&data.error.message)||'Permintaan API gagal ('+(res&&res.status||'tanpa status')+')');return Object.prototype.hasOwnProperty.call(data,'data')?data.data:data;}
function notify(msg,kind){var el=$('tp-message');if(!el)return;el.textContent=msg;el.className='tp-message visible'+(kind?' '+kind:'');}
function clearNotify(){var el=$('tp-message');if(el){el.textContent='';el.className='tp-message';}}
function norm(v){return String(v==null?'':v).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'').trim();}
function parseNumber(v){if(v==null||v==='')return null;if(typeof v==='number')return Number.isFinite(v)?v:null;var s=String(v).trim();if(!s||s==='-'||s==='—'||/^(n\/a|na|null|undefined)$/i.test(s))return null;s=s.replace(/\s/g,'').replace(/[^\d,.\-+]/g,'');if(!s)return null;var ci=s.lastIndexOf(','),di=s.lastIndexOf('.');if(ci>=0&&di>=0){if(ci>di)s=s.replace(/\./g,'').replace(',','.');else s=s.replace(/,/g,'');}else if(ci>=0){var commas=(s.match(/,/g)||[]).length;if(commas>1)s=s.replace(/,/g,'');else if(/,\d{3}$/.test(s))s=s.replace(/,/g,'');else s=s.replace(',','.');}else if((s.match(/\./g)||[]).length>1){var p=s.lastIndexOf('.');s=s.slice(0,p).replace(/\./g,'')+s.slice(p);}var n=Number(s);return Number.isFinite(n)?n:null;}
function parseRatio(v){if(v==null||String(v).trim()==='')return null;var s=String(v).trim(),hasPct=/%/.test(s),n=parseNumber(s);if(n==null)return null;if(hasPct)n=n/100;else if(n>1&&n<=100)n=n/100;if(n<0||n>1.00001)return null;return n;}
function parseHours(v){if(v==null||String(v).trim()==='')return null;if(typeof v==='number')return Number.isFinite(v)&&v>=0?v:null;var s=String(v).trim();if(!s||s==='-'||s==='—')return null;var m=s.match(/^(\d{1,4}):([0-5]?\d)(?::([0-5]?\d))?$/);if(m)return Number(m[1])+Number(m[2])/60+Number(m[3]||0)/3600;var n=parseNumber(s);return n!=null&&n>=0?n:null;}
function parsePeriod(v,fallback){if(v==null||String(v).trim()==='')return fallback||'';var s=String(v).trim(),m=s.match(/^(\d{4})[-/](\d{1,2})/);if(m&&+m[2]>=1&&+m[2]<=12)return m[1]+'-'+String(+m[2]).padStart(2,'0');m=s.match(/^(\d{1,2})[-/](\d{4})$/);if(m&&+m[1]>=1&&+m[1]<=12)return m[2]+'-'+String(+m[1]).padStart(2,'0');var d=new Date(s);if(!Number.isNaN(d.getTime())&&/\d{4}/.test(s))return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');var mn={'januari':1,'jan':1,'februari':2,'feb':2,'maret':3,'mar':3,'april':4,'apr':4,'mei':5,'may':5,'juni':6,'jun':6,'juli':7,'jul':7,'agustus':8,'agu':8,'august':8,'aug':8,'september':9,'sep':9,'oktober':10,'okt':10,'oct':10,'november':11,'nov':11,'desember':12,'des':12,'december':12,'dec':12};var low=s.toLowerCase();for(var k in mn){if(low.indexOf(k)>=0){var y=(s.match(/20\d{2}/)||[])[0];if(y)return y+'-'+String(mn[k]).padStart(2,'0');}}return fallback||'';}
function ratioPct(v){return v==null?'—':(v*100).toLocaleString('id-ID',{minimumFractionDigits:2,maximumFractionDigits:2})+'%';}
function numFmt(v,d){return v==null||!Number.isFinite(Number(v))?'—':Number(v).toLocaleString('id-ID',{minimumFractionDigits:d==null?2:d,maximumFractionDigits:d==null?2:d});}
function normHeader(v){return norm(v);}
function aliasScore(header){var h=normHeader(header);if(!h)return 0;var score=0;Object.keys(ALIASES).forEach(function(k){ALIASES[k].forEach(function(a){var n=norm(a);if(h===n)score=Math.max(score,k==='group'||k==='machine'||k==='period'?5:4);else if(n.length>3&&(h.indexOf(n)>=0||n.indexOf(h)>=0))score=Math.max(score,2);});});return score;}
function detectHeader(rows){var best={index:-1,score:-1};for(var i=0;i<Math.min(rows.length,25);i++){var row=rows[i]||[],recognized=0,nonempty=0;row.forEach(function(v){if(String(v==null?'':v).trim())nonempty++;if(aliasScore(v)>=4)recognized++;});var score=recognized*10+Math.min(nonempty,20)*.15;if(recognized>=2&&score>best.score)best={index:i,score:score};}return best.index>=0?best.index:0;}
function autoMapping(headers){var map={};KEYS.forEach(function(k){map[k]=-1;var best=-1;headers.forEach(function(h,i){var hn=normHeader(h);if(!hn)return;ALIASES[k].forEach(function(a){var an=norm(a);if(hn===an){if(best<6){map[k]=i;best=6;}}else if(an.length>3&&(hn.indexOf(an)>=0||an.indexOf(hn)>=0)&&best<2){map[k]=i;best=2;}});});});return map;}
function rawCell(row,k){var ix=STATE.mapping[k];return ix==null||ix<0?'':(row&&row[ix]!=null?row[ix]:'');}
function rowToNorm(row,index){var group=String(rawCell(row,'group')||'').trim(),machine=String(rawCell(row,'machine')||'').trim(),fallback=$('tp-import-period')?$('tp-import-period').value:'';var period=parsePeriod(rawCell(row,'period'),fallback);var out={group:group,machine:machine,period:period,plannedTime:parseHours(rawCell(row,'plannedTime')),calendarTime:parseHours(rawCell(row,'calendarTime')),operatingTime:parseHours(rawCell(row,'operatingTime')),netOperatingTime:parseHours(rawCell(row,'netOperatingTime')),fullyProductiveTime:parseHours(rawCell(row,'fullyProductiveTime')),downtime:parseHours(rawCell(row,'downtime')),availabilityInput:parseRatio(rawCell(row,'availabilityInput')),performanceInput:parseRatio(rawCell(row,'performanceInput')),qualityInput:parseRatio(rawCell(row,'qualityInput')),utilizationInput:parseRatio(rawCell(row,'utilizationInput')),oeeInput:parseRatio(rawCell(row,'oeeInput')),teepInput:parseRatio(rawCell(row,'teepInput')),goodQty:parseNumber(rawCell(row,'goodQty')),ncQty:parseNumber(rawCell(row,'ncQty')),totalQty:parseNumber(rawCell(row,'totalQty')),sourceRow:index+1};if(!out.group&&out.machine)out.group='Tidak dikelompokkan';return out;}
function rowHasMetrics(r){return ['plannedTime','calendarTime','operatingTime','netOperatingTime','fullyProductiveTime','downtime','availabilityInput','performanceInput','qualityInput','utilizationInput','oeeInput','teepInput','goodQty','ncQty','totalQty'].some(function(k){return r[k]!=null;});}
function validRatio(v){return v!=null&&Number.isFinite(v)&&v>=0&&v<=1.00001;}
function compareMetric(calculated,reported,label,warnings){if(calculated!=null&&reported!=null&&Math.abs(calculated-reported)>0.005)warnings.push(label+' hasil rumus berbeda dari angka sumber ('+ratioPct(calculated)+' vs '+ratioPct(reported)+').');}
function deriveRow(row){
 var r=Object.assign({},row),warnings=[];
 r.availability=r.plannedTime>0&&r.operatingTime!=null?r.operatingTime/r.plannedTime:validRatio(r.availabilityInput)?r.availabilityInput:null;
 r.performance=r.operatingTime>0&&r.netOperatingTime!=null?r.netOperatingTime/r.operatingTime:validRatio(r.performanceInput)?r.performanceInput:null;
 r.qualityBasis='';r.qualityVerified=false;
 if(r.netOperatingTime>0&&r.fullyProductiveTime!=null){r.quality=r.fullyProductiveTime/r.netOperatingTime;r.qualityBasis='FPT/NOT';r.qualityVerified=true;}
 else if(r.totalQty>0&&r.goodQty!=null){r.quality=r.goodQty/r.totalQty;r.qualityBasis='Good Qty/Total Qty';r.qualityVerified=false;warnings.push('Quality memakai Good Qty / Total Qty sementara; konfirmasi definisi NC sebelum mengesahkan.');}
 else {r.quality=validRatio(r.qualityInput)?r.qualityInput:null;r.qualityBasis=r.quality!=null?'rasio sumber':'';}
 if(r.availability!=null&&r.performance!=null&&r.quality!=null){r.oeeCalculated=r.availability*r.performance*r.quality;r.oee=r.oeeCalculated;r.oeeStatus='calculated';compareMetric(r.oeeCalculated,r.oeeInput,'OEE',warnings);}
 else{r.oeeCalculated=null;r.oee=validRatio(r.oeeInput)?r.oeeInput:null;r.oeeStatus=r.oee!=null?'reported-unverified':'missing';if(r.oee!=null)warnings.push('OEE hanya angka sumber; Availability, Performance, dan Quality belum lengkap untuk memeriksa rumus.');}
 if(r.plannedTime!=null&&r.calendarTime>0){r.utilization=r.plannedTime/r.calendarTime;r.utilizationStatus='calculated';compareMetric(r.utilization,r.utilizationInput,'Utilization',warnings);}
 else {r.utilization=validRatio(r.utilizationInput)?r.utilizationInput:null;r.utilizationStatus=r.utilization!=null?'reported-unverified':'missing';if(r.utilization!=null)warnings.push('Utilization sumber belum bisa diverifikasi tanpa PPT dan POT pada periode/scope yang sama.');}
 r.teepCalculated=r.utilization!=null&&r.oee!=null?r.utilization*r.oee:null;
 r.teep=r.teepCalculated!=null?r.teepCalculated:(validRatio(r.teepInput)?r.teepInput:null);
 r.teepStatus=(r.plannedTime!=null&&r.calendarTime>0&&r.oeeCalculated!=null)?'calculated':(r.teep!=null?'reported-unverified':'missing');
 if(r.teepCalculated!=null)compareMetric(r.teepCalculated,r.teepInput,'TEEP',warnings);
 if(r.teepInput!=null&&r.teepCalculated==null)warnings.push('TEEP sumber belum terverifikasi; rumus Utilization × OEE membutuhkan dua input yang tersedia dan sebanding.');
 if(r.availability!=null&&(r.availability<0||r.availability>1))warnings.push('Availability di luar batas 0–100%.');
 if(r.performance!=null&&(r.performance<0||r.performance>1))warnings.push('Performance di luar batas 0–100%.');
 if(r.quality!=null&&(r.quality<0||r.quality>1))warnings.push('Quality di luar batas 0–100%.');
 r.warnings=warnings;
 return r;
}
function rollupRows(rows){
 if(!rows.length)return null;
 if(rows.length===1)return deriveRow(rows[0]);
 var sumKeys=['plannedTime','calendarTime','operatingTime','netOperatingTime','fullyProductiveTime','downtime','goodQty','ncQty','totalQty'];
 var out={group:rows[0].group||'—',machine:'',period:rows[0].period||'',rowCount:rows.length,groupSummary:false};
 sumKeys.forEach(function(k){var vals=rows.map(function(r){return r[k];}).filter(function(v){return v!=null&&Number.isFinite(v);});out[k]=vals.length?vals.reduce(function(a,b){return a+b;},0):null;});
 var d=deriveRow(out);var allHave=function(keys){return rows.every(function(r){return keys.every(function(k){return r[k]!=null&&Number.isFinite(r[k]);});});};
 d.availability=allHave(['plannedTime','operatingTime'])&&d.plannedTime>0?d.operatingTime/d.plannedTime:null;
 d.performance=allHave(['operatingTime','netOperatingTime'])&&d.operatingTime>0?d.netOperatingTime/d.operatingTime:null;
 d.quality=allHave(['netOperatingTime','fullyProductiveTime'])&&d.netOperatingTime>0?d.fullyProductiveTime/d.netOperatingTime:(allHave(['goodQty','totalQty'])&&d.totalQty>0?d.goodQty/d.totalQty:null);
 d.qualityBasis=d.fullyProductiveTime!=null&&d.netOperatingTime>0?'ΣFPT/ΣNOT':(d.goodQty!=null&&d.totalQty>0?'ΣGood/ΣTotal':'');
 d.qualityVerified=!!(d.fullyProductiveTime!=null&&d.netOperatingTime>0);
 d.oeeCalculated=d.availability!=null&&d.performance!=null&&d.quality!=null?d.availability*d.performance*d.quality:null;
 d.oee=d.oeeCalculated;d.oeeStatus=d.oeeCalculated!=null?'calculated':'missing';
 d.utilization=d.plannedTime!=null&&d.calendarTime>0?d.plannedTime/d.calendarTime:null;d.utilizationStatus=d.utilization!=null?'calculated':'missing';
 d.teepCalculated=d.utilization!=null&&d.oeeCalculated!=null?d.utilization*d.oeeCalculated:null;d.teep=d.teepCalculated;d.teepStatus=d.teepCalculated!=null?'calculated':'missing';
 d.warnings=[];if(d.qualityBasis==='ΣGood/ΣTotal')d.warnings.push('Quality dihitung dari kuantitas Good/Total sementara; definisi NC perlu dikonfirmasi.');if(d.oee==null)d.warnings.push('Roll-up belum bisa dihitung secara berbobot karena sebagian pembilang/penyebut waktu atau kualitas tidak tersedia.');if(d.teep==null)d.warnings.push('TEEP belum tervalidasi karena PPT/POT atau OEE berbasis A×P×Q belum lengkap.');return d;
}
function shortPeriod(p){if(!p)return 'Periode tidak diisi';var m=String(p).match(/^(\d{4})-(\d{2})$/);return m?m[2]+'/'+m[1]:p;}
function allDatasetChunks(){return STATE.records.filter(function(r){return r&&r.Type===TYPE;});}
function parsePayload(r){try{return JSON.parse(r.PayloadJSON||'{}');}catch(e){return {};}}
function assembleDatasets(){
 var map={};allDatasetChunks().forEach(function(rec){var p=parsePayload(rec);var id=String(p.datasetId||rec.ID||'');if(!map[id])map[id]={id:id,title:rec.Title||'Impor OEE/TEEP',sourceName:p.sourceName||rec.Title||'',sheetName:p.sheetName||'',period:p.period||'',importedAt:p.importedAt||rec.CreatedAt||'',importedBy:rec.CreatedBy||'',chunkCount:Number(p.chunkCount||1),parts:[],status:p.status||'imported',warnings:p.warnings||[],rows:[],recordIds:[],sourceSize:p.sourceSize||0};map[id].parts.push({part:Number(p.chunkIndex||0),count:Number(p.chunkCount||1),rows:Array.isArray(p.rows)?p.rows:[]});map[id].recordIds.push(String(rec.ID||''));if(!map[id].sourceName&&p.sourceName)map[id].sourceName=p.sourceName;if(!map[id].sheetName&&p.sheetName)map[id].sheetName=p.sheetName;if(!map[id].period&&p.period)map[id].period=p.period;if(p.warnings&&p.warnings.length)map[id].warnings=map[id].warnings.concat(p.warnings);});
 Object.keys(map).forEach(function(id){var ds=map[id];ds.parts.sort(function(a,b){return a.part-b.part;});ds.parts.forEach(function(part){part.rows.forEach(function(vals){var row={};KEYS.forEach(function(k,i){row[k]=vals[i]==null?null:vals[i];});ds.rows.push(row);});});ds.incomplete=ds.parts.length!==ds.chunkCount;ds.rows=ds.rows.filter(function(r){return rowHasMetrics(r)&&(r.machine||r.group);});delete ds.parts;});
 STATE.datasets=Object.keys(map).map(function(id){return map[id];}).sort(function(a,b){return String(b.importedAt).localeCompare(String(a.importedAt));});
}
function activeDataset(){if(!STATE.datasets.length)return null;var p=STATE.period;if(p){var found=STATE.datasets.find(function(d){return d.period===p;});if(found)return found;}return STATE.datasets[0];}
function datasetPeriods(){return Array.from(new Set(STATE.datasets.map(function(d){return d.period;}).filter(Boolean))).sort().reverse();}
function currentDatasetRows(){var ds=activeDataset();return ds?ds.rows.slice():[];}
function groupRowsForDashboard(rows){
 var keys={};rows.forEach(function(r){var g=r.group||'Tidak dikelompokkan';if(!keys[g])keys[g]=[];keys[g].push(r);});
 return Object.keys(keys).sort(function(a,b){return a.localeCompare(b);}).map(function(g){var rs=keys[g],summary=rs.filter(function(r){return !String(r.machine||'').trim();}),detail=rs.filter(function(r){return String(r.machine||'').trim();});if(summary.length)return deriveRow(summary[0]);if(detail.length===1)return deriveRow(detail[0]);return rollupRows(detail);});
}
function dashboardRows(){
 var rows=currentDatasetRows().filter(function(r){return !STATE.group||r.group===STATE.group;});
 if(STATE.machine)rows=rows.filter(function(r){return r.machine===STATE.machine;});
 if(STATE.machine)return rows.map(deriveRow);
 return groupRowsForDashboard(rows);
}
function newestSourceName(){var ds=activeDataset();return ds?ds.sourceName:'';}
function metricCell(v){return ratioPct(v);}
function statusPill(row,metric){
 var s=row[metric+'Status']||'missing';if(s==='calculated')return '<span class="tp-pill ok">Rumus dihitung</span>';if(s==='reported-unverified')return '<span class="tp-pill warn">Angka sumber · cek</span>';return '<span class="tp-pill bad">Belum cukup data</span>';
}
function barRows(rows,key,label){
 if(!rows.length)return '<div class="tp-empty">Belum ada data pada filter ini. Impor workbook resmi terlebih dahulu.</div>';
 return '<div class="tp-chart-list">'+rows.map(function(r){var value=r[key],name=r.machine||r.group||'—',width=value==null?0:Math.max(0,Math.min(100,value*100));return '<div class="tp-chart-item"><div class="tp-chart-label"><span title="'+esc(name)+'">'+esc(name)+'</span><span>'+ratioPct(value)+'</span></div><div class="tp-chart-pair"><span>'+esc(label)+'</span><div class="tp-bar-track"><div class="tp-bar '+(key==='teep'?'teep':'')+'" style="width:'+width.toFixed(2)+'%"></div></div><span class="tp-chart-value">'+(value==null?'—':width.toFixed(1)+'%')+'</span></div></div>';}).join('')+'</div>';
}
function dashboardMarkup(){
 var all=currentDatasetRows(),ds=activeDataset(),rows=dashboardRows(),latest=rows.length?rows[0]:null;
 var choose=ds?ds.rows.filter(function(r){return !STATE.group||r.group===STATE.group; }):[];
 var oeeValues=rows.map(function(r){return r.oee;}).filter(function(v){return v!=null;});
 var teepValues=rows.map(function(r){return r.teep;}).filter(function(v){return v!=null;});
 var aValues=rows.map(function(r){return r.availability;}).filter(function(v){return v!=null;});
 var pValues=rows.map(function(r){return r.performance;}).filter(function(v){return v!=null;});
 var qValues=rows.map(function(r){return r.quality;}).filter(function(v){return v!=null;});
 var uValues=rows.map(function(r){return r.utilization;}).filter(function(v){return v!=null;});
 function avg(v){return v.length?v.reduce(function(a,b){return a+b;},0)/v.length:null;}
 // KPI values are unweighted row summaries only when the dashboard is scoped to a single explicit group/machine.
 var one=rows.length===1?rows[0]:null;
 var kOee=one?one.oee:null,kTeep=one?one.teep:null,kA=one?one.availability:null,kP=one?one.performance:null,kQ=one?one.quality:null,kU=one?one.utilization:null;
 var periodOptions=datasetPeriods().map(function(p){return '<option value="'+esc(p)+'"'+(STATE.period===p?' selected':'')+'>'+esc(shortPeriod(p))+'</option>';}).join('');
 var groupOptions=Array.from(new Set(all.map(function(r){return r.group;}).filter(Boolean))).sort().map(function(g){return '<option value="'+esc(g)+'"'+(STATE.group===g?' selected':'')+'>'+esc(g)+'</option>';}).join('');
 var machineOptions=Array.from(new Set(all.filter(function(r){return !STATE.group||r.group===STATE.group;}).map(function(r){return r.machine;}).filter(Boolean))).sort().map(function(m){return '<option value="'+esc(m)+'"'+(STATE.machine===m?' selected':'')+'>'+esc(m)+'</option>';}).join('');
 var detailRows=all.filter(function(r){return (!STATE.group||r.group===STATE.group)&&(!STATE.machine||r.machine===STATE.machine);}).map(deriveRow);
 var cards=[['OEE',kOee,'Availability × Performance × Quality','primary'],['TEEP',kTeep,'Utilization × OEE','teep'],['Availability',kA,'Operating Time ÷ PPT',''],['Performance',kP,'Net Operating Time ÷ OT',''],['Quality',kQ,'FPT ÷ NOT; Good/Total ditandai sementara',''],['Utilization',kU,'PPT ÷ POT','']];
 return '<div class="tp-filter-row"><div class="tp-field"><label for="tp-period-filter">Periode</label><select id="tp-period-filter"><option value="">Periode terbaru</option>'+periodOptions+'</select></div><div class="tp-field"><label for="tp-group-filter">Grup mesin</label><select id="tp-group-filter"><option value="">Semua grup</option>'+groupOptions+'</select></div><div class="tp-field"><label for="tp-machine-filter">Mesin (opsional)</label><select id="tp-machine-filter"><option value="">Ringkasan grup</option>'+machineOptions+'</select></div></div>'+
 '<div class="tp-message'+(ds?'':' visible warning')+'" id="tp-data-context">'+(ds?'Sumber: '+esc(ds.sourceName)+' · sheet '+esc(ds.sheetName||'—')+' · '+esc(ds.rows.length)+' baris ternormalisasi · '+esc(shortPeriod(ds.period))+(ds.incomplete?' · Impor tidak lengkap':''):'Belum ada workbook yang diimpor. Dashboard tidak menampilkan data contoh.')+'</div>'+
 '<div class="tp-kpis">'+cards.map(function(c){return '<div class="tp-kpi '+c[3]+(c[1]==null?' needs-data':'')+'"><span>'+esc(c[0])+'</span><strong>'+ratioPct(c[1])+'</strong><small>'+esc(c[2])+'</small></div>';}).join('')+'</div>'+
 '<div class="tp-dashboard-grid"><section class="tp-panel"><div class="tp-panel-head"><div><h2>Perbandingan OEE</h2><div class="tp-muted">OEE dari hasil rumus A × P × Q bila faktor lengkap.</div></div></div>'+barRows(rows,'oee','OEE')+'</section>'+
 '<section class="tp-panel"><div class="tp-panel-head"><div><h2>Perbandingan TEEP</h2><div class="tp-muted">TEEP memerlukan Utilization dan OEE yang sebanding.</div></div></div>'+barRows(rows,'teep','TEEP')+'</section></div>'+
 '<section class="tp-panel"><div class="tp-panel-head"><div><h2>Data faktor dan validasi</h2><div class="tp-muted">Persentase beberapa mesin tidak dirata-ratakan secara sederhana. Ringkasan dihitung berbobot bila pembilang/penyebut tersedia.</div></div><div class="tp-inline-actions"><button class="tp-button" type="button" data-tp-export>Ekspor CSV</button></div></div>'+
 (detailRows.length?'<div class="tp-table-wrap"><table class="tp-table"><thead><tr><th>Grup</th><th>Mesin</th><th class="tp-num">PPT (jam)</th><th class="tp-num">POT (jam)</th><th class="tp-num">A</th><th class="tp-num">P</th><th class="tp-num">Q</th><th class="tp-num">OEE</th><th class="tp-num">U</th><th class="tp-num">TEEP</th><th>Status</th></tr></thead><tbody>'+detailRows.slice(0,500).map(function(r){var status=r.warnings&&r.warnings.length?'Perlu ditinjau':(r.teepStatus==='calculated'?'Rumus tersedia':'Data parsial');return '<tr><td>'+esc(r.group||'—')+'</td><td>'+esc(r.machine||'Ringkasan grup')+'</td><td class="tp-num">'+numFmt(r.plannedTime)+'</td><td class="tp-num">'+numFmt(r.calendarTime)+'</td><td class="tp-num">'+metricCell(r.availability)+'</td><td class="tp-num">'+metricCell(r.performance)+'</td><td class="tp-num">'+metricCell(r.quality)+'</td><td class="tp-num">'+metricCell(r.oee)+'</td><td class="tp-num">'+metricCell(r.utilization)+'</td><td class="tp-num">'+metricCell(r.teep)+'</td><td>'+(r.teepStatus==='calculated'&&!r.warnings.length?'<span class="tp-pill ok">'+esc(status)+'</span>':'<span class="tp-pill warn">'+esc(status)+'</span>')+'</td></tr>';}).join('')+'</tbody></table></div>'+(detailRows.length>500?'<p class="tp-footer-note">Tabel dibatasi 500 baris untuk menjaga performa tampilan.</p>':''):'<div class="tp-empty">Belum ada baris untuk filter ini. Pilih periode lain atau impor workbook resmi.</div>')+
 '<p class="tp-footer-note">Definisi yang digunakan: Availability = OT/PPT; Performance = NOT/OT; Quality = FPT/NOT; OEE = A×P×Q; Utilization = PPT/POT; TEEP = Utilization×OEE. Nilai dari file tetap ditampilkan sebagai data sumber bila faktor untuk memeriksa rumus belum lengkap. Semua waktu harus menggunakan jam dan cakupan mesin/periode yang konsisten.</p></section>';
}
function importMarkup(){
 var f=STATE.fileName?'<strong>'+esc(STATE.fileName)+'</strong><span>'+esc((STATE.fileSize/1024).toLocaleString('id-ID',{maximumFractionDigits:1})+' KB')+' · '+esc(STATE.sheetName||'Pilih sheet')+'</span>':'<strong>Pilih workbook Excel atau CSV resmi</strong><span>Format: .xlsx, .xls, .xlsm, .csv. PDF/PPTX bukan sumber tabel yang diimpor di sini.</span>';
 return '<section class="tp-panel"><div class="tp-panel-head"><div><h2>Impor sumber data OEE / TEEP</h2><div class="tp-muted">Data hanya dihitung setelah file sumber dipilih. Tidak ada angka contoh yang otomatis dimasukkan.</div></div></div>'+
 '<label class="tp-filebox" for="tp-import-file"><div>'+f+'</div><input id="tp-import-file" type="file" accept=".xlsx,.xls,.xlsm,.csv,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"></label>'+
 '<div class="tp-control-row" style="margin-top:13px"><div class="tp-field"><label for="tp-import-period">Periode laporan (fallback)</label><input id="tp-import-period" type="month" value="'+esc(STATE.period||localMonth())+'"></div><div class="tp-field"><label for="tp-import-sheet">Worksheet</label><select id="tp-import-sheet" '+(STATE.workbook?'':'disabled')+'>'+sheetOptions()+'</select></div><div class="tp-field"><label for="tp-header-row">Baris judul kolom</label><select id="tp-header-row" '+(STATE.rawRows.length?'':'disabled')+'>'+headerOptions()+'</select></div></div>'+
 '<div id="tp-import-message" class="tp-message'+(STATE.importErrors.length?' visible error':(STATE.importWarnings.length?' visible warning':''))+'">'+esc(STATE.importErrors.concat(STATE.importWarnings).join(' · '))+'</div>'+
 '<div id="tp-mapping-area">'+mappingMarkup()+'</div>'+
 '<div class="tp-inline-actions" style="margin-top:14px"><button type="button" class="tp-button" data-tp-preview '+(STATE.rawRows.length?'':'disabled')+'>Validasi & pratinjau</button><button type="button" class="tp-button primary" data-tp-save-import '+(STATE.preview.length&&!STATE.importErrors.length?'':'disabled')+'>'+ (STATE.saving?'Menyimpan…':'Simpan sumber ke OMODOS')+'</button></div>'+
 '<div id="tp-preview-area" style="margin-top:14px">'+previewMarkup()+'</div>'+
 '<p class="tp-footer-note">File dibaca di browser. Yang disimpan ke OMODOS adalah metadata file dan baris yang dinormalisasi, bukan salinan biner workbook. Impor dilakukan hanya saat Anda memilih file lalu menekan tombol validasi. Untuk audit penuh, simpan workbook asli di repositori dokumen resmi perusahaan.</p></section>';
}
function sheetOptions(){if(!STATE.workbook)return '<option value="">Belum ada workbook</option>';return STATE.workbook.SheetNames.map(function(n,i){return '<option value="'+esc(n)+'"'+(i===STATE.sheetIndex?' selected':'')+'>'+esc(n)+'</option>';}).join('');}
function headerOptions(){if(!STATE.rawRows.length)return '<option value="0">Belum tersedia</option>';var out='';for(var i=0;i<Math.min(25,STATE.rawRows.length);i++){var row=STATE.rawRows[i]||[];var label=row.map(function(v){return String(v||'').trim();}).filter(Boolean).slice(0,4).join(' · ');out+='<option value="'+i+'"'+(i===STATE.headerRow?' selected':'')+'>Baris '+(i+1)+(label?' — '+esc(label.slice(0,90)):'')+'</option>';}return out;}
function mappingMarkup(){
 if(!STATE.headers.length)return '<div class="tp-empty">Setelah file dibaca, periksa pemetaan kolom agar angka diambil dari kolom yang benar.</div>';
 return '<section class="tp-panel" style="margin-top:12px"><div class="tp-panel-head"><div><h2>Pemetaan kolom</h2><div class="tp-muted">Deteksi otomatis dapat disesuaikan. Pilih “— abaikan —” bila kolom tidak tersedia.</div></div></div><div class="tp-control-row">'+KEYS.map(function(k){var options='<option value="-1">— abaikan —</option>'+STATE.headers.map(function(h,i){return '<option value="'+i+'"'+(Number(STATE.mapping[k])===i?' selected':'')+'>Kolom '+String.fromCharCode(65+(i%26))+' · '+esc(String(h||'(tanpa judul)').slice(0,85))+'</option>';}).join('');return '<div class="tp-field"><label for="tp-map-'+k+'">'+esc(LABELS[k])+'</label><select id="tp-map-'+k+'" data-tp-map="'+k+'">'+options+'</select></div>';}).join('')+'</div><p class="tp-footer-note">Minimal setiap baris memiliki label grup/mesin dan setidaknya satu faktor kinerja. Ratio persen dibaca sebagai persen; jam dan kuantitas tetap memakai satuan asli workbook. Jangan pilih NC sebagai Good Qty.</p></section>';
}
function previewMarkup(){
 if(!STATE.preview.length)return '<div class="tp-empty">Belum ada pratinjau. Pilih file, sesuaikan pemetaan jika perlu, lalu tekan “Validasi & pratinjau”.</div>';
 var rows=STATE.preview.slice(0,12);
 return '<div class="tp-message visible '+(STATE.importErrors.length?'error':(STATE.importWarnings.length?'warning':'success'))+'">'+esc(STATE.preview.length+' baris siap diproses. '+STATE.importWarnings.join(' '))+'</div>'+
 '<div class="tp-table-wrap tp-preview-table"><table class="tp-table"><thead><tr><th>Grup</th><th>Mesin</th><th>Periode</th><th>PPT</th><th>POT</th><th>A</th><th>P</th><th>Q</th><th>OEE rumus</th><th>U</th><th>TEEP rumus</th></tr></thead><tbody>'+rows.map(function(raw){var r=deriveRow(raw);return '<tr><td>'+esc(r.group||'—')+'</td><td>'+esc(r.machine||'—')+'</td><td>'+esc(shortPeriod(r.period))+'</td><td class="tp-num">'+numFmt(r.plannedTime)+'</td><td class="tp-num">'+numFmt(r.calendarTime)+'</td><td class="tp-num">'+ratioPct(r.availability)+'</td><td class="tp-num">'+ratioPct(r.performance)+'</td><td class="tp-num">'+ratioPct(r.quality)+'</td><td class="tp-num">'+ratioPct(r.oeeCalculated)+'</td><td class="tp-num">'+ratioPct(r.utilization)+'</td><td class="tp-num">'+ratioPct(r.teepCalculated)+'</td></tr>';}).join('')+'</tbody></table></div>'+(STATE.preview.length>12?'<p class="tp-footer-note">Menampilkan 12 dari '+STATE.preview.length+' baris pratinjau.</p>':'');
}
function tabContent(){
 if(STATE.tab==='import')return importMarkup();
 if(STATE.tab==='audit')return auditMarkup();
 return dashboardMarkup();
}
function auditMarkup(){
 if(!STATE.datasets.length)return '<section class="tp-panel"><div class="tp-panel-head"><div><h2>Audit sumber data</h2><div class="tp-muted">Riwayat file resmi yang telah diimpor ke OMODOS.</div></div></div><div class="tp-empty">Belum ada sumber data tersimpan. Buka tab Impor Data dan pilih workbook resmi.</div></section>';
 return '<section class="tp-panel"><div class="tp-panel-head"><div><h2>Riwayat impor & validasi</h2><div class="tp-muted">Setiap impor disimpan sebagai bagian data terpisah, termasuk metadata sumber, periode, dan jumlah baris.</div></div><button class="tp-button" type="button" data-tp-refresh>Muat ulang</button></div><div class="tp-history-list">'+STATE.datasets.map(function(ds){var valid=ds.rows.filter(function(r){return deriveRow(r).teepStatus==='calculated';}).length;return '<div class="tp-history-row"><div class="tp-history-main"><strong>'+esc(ds.sourceName||ds.title)+'</strong><small>Periode: '+esc(shortPeriod(ds.period))+' · Worksheet: '+esc(ds.sheetName||'—')+' · '+esc(ds.rows.length)+' baris · '+esc(ds.importedAt||'waktu tidak tersedia')+'</small><small>'+esc(ds.incomplete?'PERINGATAN: Chunk impor tidak lengkap. ':'')+esc(valid)+' baris memiliki rumus TEEP dengan input utama tersedia.'+(ds.warnings&&ds.warnings.length?' Catatan: '+esc(Array.from(new Set(ds.warnings)).slice(0,3).join(' ')):'')+'</small></div><div class="tp-inline-actions"><button class="tp-button" type="button" data-tp-open-dataset="'+esc(ds.id)+'">Buka</button><button class="tp-button danger" type="button" data-tp-delete-dataset="'+esc(ds.id)+'">Hapus impor</button></div></div>';}).join('')+'</div><p class="tp-footer-note">Hapus impor akan menghapus catatan OMODOS untuk semua bagian dataset tersebut. Simpan file sumber asli sesuai prosedur retensi resmi.</p></section>';
}
function renderPage(){
 var page=$ (PAGE_ID);if(!page)return;
 var tabTitles=[['dashboard','Ringkasan'],['import','Impor Data'],['audit','Audit & Riwayat']];
 var html='<div class="tp-header"><div><p class="tp-eyebrow">BMJ · Packaging Offset Technical Department</p><h1 class="tp-title">Technical <span>Performance</span></h1><p class="tp-subtitle">Monitoring OEE dan TEEP berbasis workbook produksi resmi. Angka tanpa pembilang/penyebut yang cukup ditandai belum tervalidasi, bukan ditebak.</p></div><div class="tp-source-badge '+(STATE.datasets.length?'is-ready':'')+'">'+(STATE.datasets.length?'SUMBER TERSIMPAN: '+STATE.datasets.length+' IMPOR':'MENUNGGU SUMBER RESMI')+'</div></div>'+
 '<div id="tp-message" class="tp-message" role="status" aria-live="polite"></div><div class="tp-tabs" role="tablist" aria-label="Bagian Technical Performance">'+tabTitles.map(function(t){return '<button type="button" class="tp-tab'+(STATE.tab===t[0]?' active':'')+'" data-tp-tab="'+t[0]+'" role="tab" aria-selected="'+(STATE.tab===t[0]?'true':'false')+'">'+t[1]+'</button>';}).join('')+'</div>'+
 '<div id="tp-content">'+tabContent()+'</div>';
 page.innerHTML=html;
 bindDynamicEvents(page);
}
function localMonth(){var d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');}
function renderImportOnly(){
 var page=$(PAGE_ID),content=$('tp-content');if(!page||!content)return;
 content.innerHTML=importMarkup();bindDynamicEvents(page);
}
function openTab(tab){STATE.tab=['dashboard','import','audit'].indexOf(tab)>=0?tab:'dashboard';clearNotify();renderPage();if(STATE.tab==='import'&&STATE.workbook)renderImportOnly();}
function getWorkbookLib(){if(window.XLSX)return Promise.resolve(window.XLSX);return new Promise(function(resolve,reject){var existing=$('tp-xlsx-script');if(existing){existing.addEventListener('load',function(){window.XLSX?resolve(window.XLSX):reject(new Error('Library Excel gagal dimuat.'));},{once:true});existing.addEventListener('error',function(){reject(new Error('Library Excel gagal dimuat.'));},{once:true});return;}var s=document.createElement('script');s.id='tp-xlsx-script';s.src='/vendor/xlsx.min.js';s.async=true;s.onload=function(){window.XLSX?resolve(window.XLSX):reject(new Error('Library Excel gagal dimuat.'));};s.onerror=function(){reject(new Error('Library Excel tidak tersedia di /vendor/xlsx.min.js.'));};document.head.appendChild(s);});}
async function onFileSelected(file){
 if(!file)return;
 var ext=(file.name.split('.').pop()||'').toLowerCase();if(['xlsx','xls','xlsm','csv'].indexOf(ext)<0){notify('Format file belum didukung. Pilih workbook Excel atau CSV yang menjadi sumber resmi laporan.','error');return;}
 if(file.size>20*1024*1024){notify('File melebihi batas UI 20 MB. Ekspor worksheet ringkasan yang relevan terlebih dahulu.','error');return;}
 STATE.fileName=file.name;STATE.fileSize=file.size;STATE.workbook=null;STATE.rawRows=[];STATE.headers=[];STATE.preview=[];STATE.mapping={};STATE.importWarnings=[];STATE.importErrors=[];STATE.lastImport=null;
 openTab('import');renderImportOnly();notify('Membaca workbook lokal…');
 try{var XLSX=await getWorkbookLib(),buf=await file.arrayBuffer(),book=XLSX.read(buf,{type:'array',cellDates:true});if(!book.SheetNames||!book.SheetNames.length)throw new Error('Tidak ada worksheet yang dapat dibaca.');STATE.workbook=book;STATE.sheetIndex=0;STATE.sheetName=book.SheetNames[0];setSelectedSheet(STATE.sheetIndex);notify('Workbook berhasil dibaca. Periksa worksheet dan pemetaan kolom sebelum menyimpan.','success');renderImportOnly();}
 catch(e){STATE.workbook=null;STATE.rawRows=[];STATE.headers=[];STATE.preview=[];STATE.importErrors=[String(e.message||e)];renderImportOnly();notify(STATE.importErrors[0],'error');}
}
function setSelectedSheet(index){
 if(!STATE.workbook)return;var i=Number(index);if(!Number.isInteger(i)||i<0||i>=STATE.workbook.SheetNames.length)i=0;STATE.sheetIndex=i;STATE.sheetName=STATE.workbook.SheetNames[i];var ws=STATE.workbook.Sheets[STATE.sheetName],X=window.XLSX;STATE.rawRows=X.utils.sheet_to_json(ws,{header:1,defval:'',raw:false,blankrows:false});STATE.headerRow=detectHeader(STATE.rawRows);refreshHeaders(true);
}
function refreshHeaders(resetMap){
 var row=STATE.rawRows[STATE.headerRow]||[];STATE.headers=row.map(function(v,i){var h=String(v==null?'':v).trim();return h||('Kolom '+String.fromCharCode(65+(i%26)));});if(resetMap)STATE.mapping=autoMapping(STATE.headers);STATE.preview=[];STATE.importErrors=[];STATE.importWarnings=[];}
function readMappingFromControls(){
 var page=$(PAGE_ID);if(!page)return;page.querySelectorAll('[data-tp-map]').forEach(function(el){STATE.mapping[el.dataset.tpMap]=Number(el.value);});
}
function validateAndPreview(){
 clearNotify();STATE.importErrors=[];STATE.importWarnings=[];readMappingFromControls();
 if(!STATE.rawRows.length||!STATE.headers.length){notify('Pilih file dan worksheet terlebih dahulu.','error');return;}
 var hasLabel=STATE.mapping.group>=0||STATE.mapping.machine>=0;if(!hasLabel)STATE.importErrors.push('Pemetakan minimal satu kolom Grup atau Mesin.');
 var hasMetric=KEYS.some(function(k){return ['group','machine','period'].indexOf(k)<0&&Number(STATE.mapping[k])>=0;});if(!hasMetric)STATE.importErrors.push('Pilih setidaknya satu kolom faktor kinerja, waktu, atau kuantitas.');
 var dataRows=[];for(var i=STATE.headerRow+1;i<STATE.rawRows.length;i++){var raw=STATE.rawRows[i]||[];if(!raw.some(function(c){return String(c==null?'':c).trim()!=='';}))continue;var r=rowToNorm(raw,i);if((r.machine||r.group)&&rowHasMetrics(r))dataRows.push(r);}
 if(!dataRows.length)STATE.importErrors.push('Tidak ada baris data yang cocok dengan pemetaan. Ubah baris judul atau pemetaan kolom.');
 var noPeriod=dataRows.some(function(r){return !r.period;});if(noPeriod)STATE.importWarnings.push('Sebagian baris tidak memiliki periode; data akan memakai periode fallback jika diisi.');
 var noPptPot=dataRows.some(function(r){return r.plannedTime==null||r.calendarTime==null;});if(noPptPot)STATE.importWarnings.push('Sebagian baris belum memiliki PPT/POT. TEEP akan ditandai belum tervalidasi jika basis waktu tidak lengkap.');
 var noQuality=dataRows.some(function(r){return r.fullyProductiveTime==null&&r.qualityInput==null&&!(r.goodQty!=null&&r.totalQty>0);});if(noQuality)STATE.importWarnings.push('Sebagian baris belum memiliki Quality, FPT/NOT, atau Good/Total. OEE mungkin belum bisa dihitung.');
 var ncOnly=dataRows.some(function(r){return r.ncQty!=null&&r.goodQty==null;});if(ncOnly)STATE.importWarnings.push('Kolom NC ditemukan tanpa Good Qty. NC tidak ditambahkan ke produk baik secara otomatis.');
 var period=$('tp-import-period')?$('tp-import-period').value:'';if(period)STATE.period=period;if(period){dataRows.forEach(function(r){if(!r.period)r.period=period;});}
 var invalid=dataRows.some(function(r){return (r.plannedTime!=null&&r.calendarTime!=null&&r.plannedTime>r.calendarTime*1.05)||(r.operatingTime!=null&&r.plannedTime!=null&&r.operatingTime>r.plannedTime*1.05)||(r.netOperatingTime!=null&&r.operatingTime!=null&&r.netOperatingTime>r.operatingTime*1.05)||(r.fullyProductiveTime!=null&&r.netOperatingTime!=null&&r.fullyProductiveTime>r.netOperatingTime*1.05);});if(invalid)STATE.importWarnings.push('Ada rasio waktu yang melebihi batas logis. Periksa satuan, sumber, dan cakupan data sebelum dipakai.');
 STATE.preview=dataRows;STATE.importWarnings=Array.from(new Set(STATE.importWarnings));renderImportOnly();
 if(STATE.importErrors.length)notify(STATE.importErrors.join(' '),'error');else notify('Validasi selesai: '+dataRows.length+' baris dinormalisasi. Cek peringatan dan hasil rumus sebelum menyimpan.',STATE.importWarnings.length?'warning':'success');
}
function rowsAsMatrix(rows){return rows.map(function(r){return KEYS.map(function(k){return r[k]==null?null:r[k];});});}
function chunkRows(rows,metadata){
 var chunks=[],cur=[];for(var i=0;i<rows.length;i++){var candidate=cur.concat([rows[i]]),payload={datasetId:metadata.datasetId,chunkIndex:chunks.length,chunkCount:999,sourceName:metadata.sourceName,sheetName:metadata.sheetName,period:metadata.period,importedAt:metadata.importedAt,sourceSize:metadata.sourceSize,rows:rowsAsMatrix(candidate)};if(JSON.stringify(payload).length>27000&&cur.length){chunks.push(cur);cur=[rows[i]];}else cur=candidate;}
 if(cur.length)chunks.push(cur);
 if(chunks.length>12)throw new Error('Worksheet terlalu besar untuk satu impor ('+rows.length+' baris). Pilih worksheet ringkasan bulanan/mesin yang relevan agar impor aman dan riwayat tidak membengkak.');
 return chunks;
}
async function saveImport(){
 if(!isSuperadmin()||STATE.saving)return;if(!STATE.preview.length||STATE.importErrors.length){notify('Validasi harus berhasil sebelum impor disimpan.','error');return;}
 var period=$('tp-import-period')?$('tp-import-period').value:'';if(!period)period=STATE.preview.find(function(r){return r.period;})?.period||'';STATE.period=period;STATE.saving=true;renderImportOnly();
 var datasetId='TP-'+randomId(),importedAt=new Date().toISOString();
 var rows=STATE.preview.slice();var metadata={datasetId:datasetId,sourceName:STATE.fileName,sheetName:STATE.sheetName,period:period,importedAt:importedAt,sourceSize:STATE.fileSize};
 var chunks;
 try{chunks=chunkRows(rows,metadata);}catch(e){STATE.saving=false;renderImportOnly();notify(e.message,'error');return;}
 var savedIds=[];
 try{
  for(var i=0;i<chunks.length;i++){
   var payload={schemaVersion:1,datasetId:datasetId,chunkIndex:i,chunkCount:chunks.length,sourceName:metadata.sourceName,sheetName:metadata.sheetName,period:metadata.period,importedAt:metadata.importedAt,sourceSize:metadata.sourceSize,rows:rowsAsMatrix(chunks[i]),warnings:STATE.importWarnings};
   if(JSON.stringify(payload).length>35000)throw new Error('Bagian impor melewati batas aman payload. Pilih worksheet ringkasan yang lebih kecil.');
   var record={type:TYPE,title:'Technical Performance · '+(metadata.period||'Periode tidak ditentukan')+' · '+metadata.sourceName+' · '+(i+1)+'/'+chunks.length,machine:'',owner:'',dueDate:'',status:'Imported',payload:payload};
   var saved=await apiRequest('offsetWaysSave',{record:record});
   if(saved&&saved.ID)savedIds.push(saved.ID);else if(saved&&saved.id)savedIds.push(saved.id);
  }
  STATE.saving=false;STATE.period=period;STATE.group='';STATE.machine='';await loadRecords(true);STATE.tab='dashboard';renderPage();notify('Impor tersimpan: '+rows.length+' baris dari '+metadata.sourceName+'. Periksa kembali hasil dan peringatan audit.','success');
 }catch(e){
  // Best-effort rollback: do not leave a half-import dataset where cleanup succeeds.
  for(var j=0;j<savedIds.length;j++){try{await apiRequest('offsetWaysDelete',{id:savedIds[j]});}catch(cleanupError){}}
  STATE.saving=false;renderImportOnly();notify('Impor gagal atau belum lengkap: '+String(e.message||e)+'. Bagian yang sempat tersimpan sudah dicoba dibersihkan; muat ulang Audit & Riwayat untuk memastikan.','error');
 }
}
async function loadRecords(force){
 if(!isSuperadmin()||STATE.loading||(!force&&STATE.loaded))return;STATE.loading=true;
 try{var rows=await apiRequest('offsetWaysRead',{});STATE.records=Array.isArray(rows)?rows:[];assembleDatasets();STATE.loaded=true;if(!STATE.period&&STATE.datasets.length)STATE.period=STATE.datasets[0].period||'';}
 catch(e){STATE.loaded=false;notify('Tidak dapat membaca data OMODOS: '+String(e.message||e),'error');}
 finally{STATE.loading=false;}
}
async function deleteDataset(id){
 var ds=STATE.datasets.find(function(d){return d.id===id;});if(!ds)return;if(!window.confirm('Hapus impor “'+(ds.sourceName||ds.title)+'” dari OMODOS? Tindakan ini tidak menghapus workbook asli.'))return;
 try{for(var i=0;i<ds.recordIds.length;i++)await apiRequest('offsetWaysDelete',{id:ds.recordIds[i]});await loadRecords(true);renderPage();notify('Catatan impor telah dihapus dari OMODOS.','success');}
 catch(e){await loadRecords(true);renderPage();notify('Penghapusan belum tuntas: '+String(e.message||e)+'. Periksa kembali Audit & Riwayat.','error');}
}
function csvEscape(v){var s=v==null?'':String(v);return '"'+s.replace(/"/g,'""')+'"';}
function exportCsv(){
 var ds=activeDataset();if(!ds){notify('Belum ada data untuk diekspor.','warning');return;}
 var out=[['Periode','Grup','Mesin','PPT jam','POT jam','OT jam','NOT jam','FPT jam','Availability','Performance','Quality','OEE hasil rumus','Utilization','TEEP hasil rumus','OEE sumber','TEEP sumber','Good Qty','NC Qty','Total Qty','Status TEEP']];
 ds.rows.filter(function(r){return (!STATE.group||r.group===STATE.group)&&(!STATE.machine||r.machine===STATE.machine);}).forEach(function(raw){var r=deriveRow(raw);out.push([r.period,r.group,r.machine,r.plannedTime,r.calendarTime,r.operatingTime,r.netOperatingTime,r.fullyProductiveTime,r.availability,r.performance,r.quality,r.oeeCalculated,r.utilization,r.teepCalculated,r.oeeInput,r.teepInput,r.goodQty,r.ncQty,r.totalQty,r.teepStatus]);});
 var content='\ufeff'+out.map(function(row){return row.map(csvEscape).join(',');}).join('\r\n');var blob=new Blob([content],{type:'text/csv;charset=utf-8;'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='OMODOS_Technical_Performance_'+(ds.period||'data')+'.csv';document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
}
function bindDynamicEvents(page){
 page.querySelectorAll('[data-tp-tab]').forEach(function(btn){btn.addEventListener('click',function(){openTab(btn.dataset.tpTab);});});
 var file=$('tp-import-file');if(file&&!file.__tpBound){file.__tpBound=true;file.addEventListener('change',function(){if(file.files&&file.files[0])onFileSelected(file.files[0]);});}
 var sheet=$('tp-import-sheet');if(sheet&&!sheet.__tpBound){sheet.__tpBound=true;sheet.addEventListener('change',function(){if(!STATE.workbook)return;setSelectedSheet(sheet.selectedIndex);renderImportOnly();});}
 var header=$('tp-header-row');if(header&&!header.__tpBound){header.__tpBound=true;header.addEventListener('change',function(){STATE.headerRow=Number(header.value);refreshHeaders(true);renderImportOnly();});}
 page.querySelectorAll('[data-tp-map]').forEach(function(el){el.addEventListener('change',function(){STATE.mapping[el.dataset.tpMap]=Number(el.value);STATE.preview=[];var save=page.querySelector('[data-tp-save-import]');if(save)save.disabled=true;});});
 var preview=page.querySelector('[data-tp-preview]');if(preview)preview.addEventListener('click',validateAndPreview);
 var save=page.querySelector('[data-tp-save-import]');if(save)save.addEventListener('click',saveImport);
 var refresh=page.querySelector('[data-tp-refresh]');if(refresh)refresh.addEventListener('click',async function(){await loadRecords(true);renderPage();});
 page.querySelectorAll('[data-tp-open-dataset]').forEach(function(btn){btn.addEventListener('click',function(){var ds=STATE.datasets.find(function(d){return d.id===btn.dataset.tpOpenDataset;});if(!ds)return;STATE.period=ds.period;STATE.group='';STATE.machine='';openTab('dashboard');});});
 page.querySelectorAll('[data-tp-delete-dataset]').forEach(function(btn){btn.addEventListener('click',function(){deleteDataset(btn.dataset.tpDeleteDataset);});});
 var pf=$('tp-period-filter');if(pf)pf.addEventListener('change',function(){STATE.period=pf.value;renderPage();});
 var gf=$('tp-group-filter');if(gf)gf.addEventListener('change',function(){STATE.group=gf.value;STATE.machine='';renderPage();});
 var mf=$('tp-machine-filter');if(mf)mf.addEventListener('change',function(){STATE.machine=mf.value;renderPage();});
 var exp=page.querySelector('[data-tp-export]');if(exp)exp.addEventListener('click',exportCsv);
}
function ensureNav(){
 var side=$('sidebar'),settings=side&&side.querySelector('.nav-group-settings');if(!side||!settings)return null;
 var nav=$(NAV_ID);if(!nav){nav=document.createElement('div');nav.className='nav-group tp-admin-nav';nav.id=NAV_ID;nav.style.display='none';nav.innerHTML='<button class="nav-btn" type="button" data-view="technical-performance"><span class="ico"><i class="ph-bold ph-chart-line-up"></i></span> Technical Performance</button>';settings.parentNode.insertBefore(nav,settings);var btn=nav.querySelector('[data-view="technical-performance"]');if(btn)btn.addEventListener('click',function(ev){ev.preventDefault();ev.stopPropagation();if(!isSuperadmin()){syncAuth();return;}if(typeof window.goToView==='function')window.goToView('technical-performance');else manualNavigate();setTimeout(onPageOpen,40);});}
 try{if(typeof FEATURE_REGISTRY!=='undefined'&&Array.isArray(FEATURE_REGISTRY)&&!FEATURE_REGISTRY.some(function(f){return f&&f.PermissionKey==='view.technical-performance';}))FEATURE_REGISTRY.push({PermissionKey:'view.technical-performance',Label:'Technical Performance',Group:'Technical'});}catch(e){}
 return nav;
}
function ensurePage(){var page=$(PAGE_ID);if(page)return page;var main=document.querySelector('.main');if(!main)return null;page=document.createElement('section');page.id=PAGE_ID;page.className='view tp-page';main.appendChild(page);renderPage();return page;}
function manualNavigate(){var page=ensurePage();if(!page||!isSuperadmin())return;document.querySelectorAll('.view').forEach(function(v){v.classList.remove('active');});page.classList.add('active');document.querySelectorAll('.nav-btn[data-view],.bottom-nav-btn[data-view]').forEach(function(b){b.classList.toggle('active',b.getAttribute('data-view')==='technical-performance');});onPageOpen();}
function syncAuth(){
 ensureNav();var nav=$(NAV_ID),page=$(PAGE_ID),allowed=isSuperadmin();if(nav)nav.style.display=allowed?'':'none';
 if(page){page.setAttribute('aria-hidden',allowed?'false':'true');if(!allowed){page.style.display='none';if(page.classList.contains('active')){page.classList.remove('active');var dash=$('view-dashboard');if(dash)dash.classList.add('active');}}else page.style.display='';}
 if(!allowed){STATE.records=[];STATE.datasets=[];STATE.loaded=false;}
}
function installRouteGuard(){try{if(typeof window.goToView==='function'&&!window.goToView.__tpAdminGuard){var original=window.goToView;var wrapped=function(view){if(String(view||'').trim()==='technical-performance'&&!isSuperadmin()){syncAuth();try{if(typeof toast==='function')toast('Technical Performance hanya tersedia untuk Superadmin.',true);}catch(e){}return false;}return original.apply(this,arguments);};wrapped.__tpAdminGuard=true;window.goToView=wrapped;}}catch(e){}}
async function onPageOpen(){if(!isSuperadmin()){syncAuth();return;}var page=ensurePage();if(!page)return;await loadRecords();renderPage();}
function boot(){
 installRouteGuard();ensureNav();ensurePage();syncAuth();
 var badge=$('rbac-user-badge');if(badge&&!badge.__tpAuthObserver){badge.__tpAuthObserver=new MutationObserver(function(){syncAuth();});badge.__tpAuthObserver.observe(badge,{childList:true,subtree:true,characterData:true});}
 var login=$('form-login');if(login&&!login.__tpAuthListener){login.__tpAuthListener=true;login.addEventListener('submit',function(){setTimeout(syncAuth,500);setTimeout(syncAuth,1600);});}
 var logout=$('btn-logout');if(logout&&!logout.__tpLogoutListener){logout.__tpLogoutListener=true;logout.__tpLogoutListener=true;logout.addEventListener('click',function(){setTimeout(syncAuth,120);});}
 document.addEventListener('click',function(ev){var b=ev.target.closest&&ev.target.closest('#'+NAV_ID+' [data-view="technical-performance"]');if(b&&!isSuperadmin()){ev.preventDefault();ev.stopPropagation();syncAuth();}},true);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.OMODOS_TECHNICAL_PERFORMANCE={version:'1.0.0',parseRatio:parseRatio,parseNumber:parseNumber,deriveRow:deriveRow,rollupRows:rollupRows,normalizeKey:norm,assembleDatasets:assembleDatasets};
})();