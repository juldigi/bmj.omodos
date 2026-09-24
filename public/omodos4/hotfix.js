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


/* OMODOS4_LOW_COGNITIVE_V1 — plain-language labels only; feature numbers and behavior stay unchanged. */
var SIMPLE_WORKSPACE = {
  1:{name:'Mesin',help:'Lihat kondisi, riwayat, dan bagian mesin.'},
  2:{name:'Prediksi Masalah',help:'Lihat tanda awal agar masalah bisa dicek lebih cepat.'},
  3:{name:'Pekerjaan Lapangan',help:'Bantu teknisi saat memeriksa dan mencatat pekerjaan.'},
  4:{name:'Sparepart',help:'Lihat stok, pemakaian, dan kebutuhan sparepart.'},
  5:{name:'Keandalan & Kerugian',help:'Lihat mesin yang sering bermasalah dan dampaknya.'},
  6:{name:'Operasi & KPI',help:'Lihat target, energi, IPAL, dan kondisi operasi.'},
  7:{name:'Teknisi & Keahlian',help:'Lihat pengalaman, keahlian, dan kebutuhan belajar.'},
  8:{name:'Asisten OMODOS',help:'Tanya OMODOS dengan bahasa biasa berdasarkan data yang ada.'},
  9:{name:'Perbaikan',help:'Cari peluang perbaikan, Kaizen, project, dan SGA.'},
 10:{name:'Ringkasan Pabrik',help:'Lihat gambaran besar maintenance dalam satu tempat.'}
};

var SIMPLE_FEATURE = {
  1:{name:'Profil Mesin',help:'Lihat identitas, kondisi, dan riwayat mesin di satu tempat.'},
  2:{name:'Nilai Kesehatan Mesin',help:'Lihat nilai kesehatan mesin dan alasan di balik nilainya.'},
  3:{name:'Hubungan Data Mesin',help:'Lihat hubungan mesin dengan masalah, orang, dan data lainnya.'},
  4:{name:'Bagian-Bagian Mesin',help:'Lihat susunan bagian mesin yang sudah tercatat.'},
  5:{name:'Umur Komponen',help:'Lihat umur dan riwayat komponen dari data yang tersedia.'},
  6:{name:'Riwayat Masalah',help:'Cari masalah yang pernah terjadi dan kasus yang berulang.'},
  7:{name:'Kebiasaan Mesin',help:'Lihat pola masalah yang sering muncul pada mesin.'},
  8:{name:'Perubahan Kondisi Mesin',help:'Lihat perubahan kondisi mesin dari waktu ke waktu.'},
  9:{name:'Putar Ulang Kejadian Mesin',help:'Lihat kembali urutan kejadian yang pernah tercatat.'},
 10:{name:'Ruang Mesin Virtual',help:'Lihat hubungan informasi penting tiap mesin.'},

 11:{name:'Risiko Kerusakan',help:'Lihat mesin yang punya tanda risiko dan perlu dicek.'},
 12:{name:'Peringatan Dini',help:'Lihat tanda masalah sebelum menjadi gangguan lebih besar.'},
 13:{name:'Tanda Sebelum Rusak',help:'Cari tanda yang pernah muncul sebelum kerusakan.'},
 14:{name:'Masalah Berulang',help:'Temukan masalah yang muncul lagi dan lagi.'},
 15:{name:'Masalah Mirip Antar Mesin',help:'Bandingkan masalah serupa pada mesin yang berbeda.'},
 16:{name:'Penurunan Diam-Diam',help:'Cari perubahan kecil yang mungkin luput dari perhatian.'},
 17:{name:'Ciri Khas Kerusakan',help:'Lihat pola gejala yang sering muncul bersama.'},
 18:{name:'Keyakinan Prediksi',help:'Lihat seberapa kuat bukti yang mendukung suatu risiko.'},
 19:{name:'Perkiraan Sisa Umur',help:'Lihat perkiraan berbasis data, bukan kepastian kerusakan.'},
 20:{name:'Bagian yang Perlu Dicek',help:'Lihat bagian atau mesin yang paling perlu diperiksa.'},

 21:{name:'Tugas Teknisi',help:'Lihat pekerjaan yang perlu dilakukan teknisi.'},
 22:{name:'Panduan Cari Masalah',help:'Ikuti langkah sederhana untuk mencari penyebab masalah.'},
 23:{name:'Daftar Pemeriksaan',help:'Lihat daftar hal yang perlu diperiksa satu per satu.'},
 24:{name:'Isi Logbook dengan Suara',help:'Gunakan suara untuk membantu menulis catatan Logbook.'},
 25:{name:'Bantuan dari Foto',help:'Gunakan foto sebagai bahan bantu pemeriksaan.'},
 26:{name:'Bukti Sebelum & Sesudah',help:'Bandingkan kondisi sebelum dan sesudah pekerjaan.'},
 27:{name:'Buka Mesin lewat QR',help:'Pindai QR untuk membuka mesin yang tepat.'},
 28:{name:'Buka Mesin lewat NFC',help:'Gunakan NFC untuk membuka data mesin.'},
 29:{name:'Urutan Pekerjaan Maintenance',help:'Lihat urutan pekerjaan dari awal sampai selesai.'},
 30:{name:'Mode Tanpa Internet',help:'Bantu pekerjaan lapangan saat koneksi internet terbatas.'},

 31:{name:'Tingkat Penting Sparepart',help:'Lihat sparepart mana yang paling penting untuk diperhatikan.'},
 32:{name:'Risiko Stok Habis',help:'Lihat sparepart yang berisiko habis.'},
 33:{name:'Sparepart Tidak Terpakai',help:'Cari sparepart yang lama tidak terlihat dipakai.'},
 34:{name:'Pemakaian Sparepart',help:'Lihat sparepart yang paling sering digunakan.'},
 35:{name:'Mesin & Sparepart Terkait',help:'Lihat sparepart yang tercatat terkait dengan mesin.'},
 36:{name:'Cari Sparepart Pengganti',help:'Cari kandidat sparepart pengganti untuk ditinjau manusia.'},
 37:{name:'Kenali Sparepart dari Foto',help:'Gunakan foto untuk membantu mengenali sparepart.'},
 38:{name:'Peta Rak Sparepart',help:'Lihat posisi dan hubungan data rak sparepart.'},
 39:{name:'Perkiraan Kebutuhan Sparepart',help:'Lihat kebutuhan sparepart berdasarkan catatan pemakaian.'},
 40:{name:'Urutan Pembelian Sparepart',help:'Lihat sparepart mana yang perlu dibeli lebih dulu.'},

 41:{name:'Ringkasan Keandalan',help:'Lihat gambaran umum keandalan mesin.'},
 42:{name:'Mesin yang Sering Bermasalah',help:'Lihat mesin dengan masalah terbanyak atau berulang.'},
 43:{name:'Masalah Terbanyak',help:'Lihat masalah yang paling banyak menyumbang gangguan.'},
 44:{name:'Masalah Sering vs Mendadak',help:'Bedakan masalah yang sering terjadi dan yang muncul tiba-tiba.'},
 45:{name:'Kerugian yang Tersembunyi',help:'Lihat waktu atau gangguan yang sering tidak terlihat.'},
 46:{name:'Perubahan Keandalan',help:'Lihat apakah kondisi keandalan membaik atau memburuk.'},
 47:{name:'Riwayat RCA',help:'Cari RCA lama yang berkaitan dengan masalah sekarang.'},
 48:{name:'Efek Tindakan Perbaikan',help:'Bandingkan kondisi sebelum dan sesudah tindakan.'},
 49:{name:'Biaya Kerusakan',help:'Lihat biaya kerusakan yang memang tercatat.'},
 50:{name:'Biaya per Menit Berhenti',help:'Lihat dampak biaya dari waktu mesin berhenti jika datanya ada.'},

 51:{name:'Cerita KPI',help:'Baca KPI dalam bentuk ringkasan yang mudah dipahami.'},
 52:{name:'Penyebab KPI',help:'Lihat faktor yang mungkin berkaitan dengan perubahan KPI.'},
 53:{name:'Arah KPI',help:'Lihat arah perubahan KPI dari data yang tersedia.'},
 54:{name:'Simulasi Capai Target',help:'Coba asumsi untuk melihat kemungkinan pemulihan target.'},
 55:{name:'Hubungan Maintenance & Produksi',help:'Lihat apakah perubahan maintenance bergerak bersama data produksi.'},
 56:{name:'Keanehan Energi',help:'Cari pemakaian energi yang tidak biasa.'},
 57:{name:'Energi per Hasil Baik',help:'Bandingkan energi dengan hasil produksi yang baik.'},
 58:{name:'Ringkasan Utilitas',help:'Lihat kondisi utilitas dari data yang tersedia.'},
 59:{name:'Kondisi IPAL',help:'Lihat ringkasan data dan tanda yang perlu diperiksa pada IPAL.'},
 60:{name:'Ringkasan 1 Menit',help:'Baca hal penting hari ini secara cepat.'},

 61:{name:'Peta Keahlian Teknisi',help:'Lihat bukti keahlian dan pengalaman yang tercatat.'},
 62:{name:'Teknisi & Mesin yang Dikuasai',help:'Lihat hubungan teknisi dengan mesin dari riwayat kerja.'},
 63:{name:'Cari Orang Berpengalaman',help:'Cari orang yang pernah menangani masalah atau mesin serupa.'},
 64:{name:'Riwayat Pengalaman Teknisi',help:'Lihat pengalaman teknisi yang tercatat di OMODOS.'},
 65:{name:'Risiko Hilangnya Pengetahuan',help:'Lihat area yang pengetahuannya hanya dimiliki sedikit orang.'},
 66:{name:'Keahlian yang Perlu Dipelajari',help:'Lihat gap keahlian yang memang tercatat.'},
 67:{name:'Saran Belajar',help:'Lihat saran belajar dari gap keahlian yang tercatat.'},
 68:{name:'Cari Mentor',help:'Cari kandidat mentor berdasarkan pengalaman yang tercatat.'},
 69:{name:'Latihan Cari Masalah',help:'Belajar dari kasus nyata tanpa mengubah data.'},
 70:{name:'Bukti Kompetensi',help:'Lihat bukti kompetensi yang sudah tercatat.'},

 71:{name:'Tanya OMODOS',help:'Tanyakan sesuatu dengan bahasa biasa dan lihat sumber datanya.'},
 72:{name:'Tanya Tentang Mesin',help:'Tanyakan kondisi satu mesin tanpa mencampur data mesin lain.'},
 73:{name:'Ringkasan Pergantian Shift',help:'Buat ringkasan hal penting untuk diteruskan ke shift berikutnya.'},
 74:{name:'Ringkasan Pagi',help:'Lihat hal penting yang perlu diperhatikan pagi ini.'},
 75:{name:'Buat Draf RCA',help:'Buat draf awal RCA untuk diperiksa manusia.'},
 76:{name:'Cari Kasus Mirip',help:'Cari kasus lama yang mirip dengan masalah sekarang.'},
 77:{name:'Tanya Manual',help:'Tanyakan isi pengetahuan atau manual yang benar-benar tersedia.'},
 78:{name:'Cari Pengetahuan Baru',help:'Cari kasus yang layak dijadikan artikel pengetahuan.'},
 79:{name:'Terjemahkan Istilah Maintenance',help:'Ubah istilah teknis menjadi bahasa yang lebih mudah.'},
 80:{name:'Periksa Ulang Asumsi',help:'Cari kelemahan asumsi sebelum mengambil keputusan.'},

 81:{name:'Peluang Perbaikan',help:'Cari masalah berulang yang mungkin perlu improvement.'},
 82:{name:'Buat Draf Kaizen',help:'Buat draf Kaizen tanpa langsung menyimpan project baru.'},
 83:{name:'Cek Bukti Manfaat Project',help:'Lihat apakah bukti manfaat project sudah cukup terisi.'},
 84:{name:'Lihat Sebelum & Sesudah Kaizen',help:'Lihat bukti perubahan Kaizen yang sudah tercatat.'},
 85:{name:'Kumpulan Ide Perbaikan',help:'Lihat semua ide dan improvement yang masih terbuka.'},
 86:{name:'Cari Kaizen yang Mirip',help:'Cari improvement yang mungkin mirip agar tidak membuat duplikat.'},
 87:{name:'Project yang Perlu Perhatian',help:'Lihat project terlambat atau masih terbuka.'},
 88:{name:'Cerita SGA',help:'Baca ringkasan SGA dari data yang sudah dicatat.'},
 89:{name:'Hubungan Pengetahuan Perbaikan',help:'Lihat hubungan improvement dengan mesin, masalah, dan pengetahuan.'},
 90:{name:'Riwayat Perbaikan',help:'Lihat perjalanan project, Kaizen, dan SGA dari tahun ke tahun.'},

 91:{name:'Gambaran Pabrik dari Data',help:'Lihat hubungan mesin dan maintenance sebagai gambaran besar.'},
 92:{name:'Pusat Pantau Maintenance',help:'Lihat hal paling penting yang perlu diperhatikan sekarang.'},
 93:{name:'Apa yang Berubah?',help:'Lihat data apa saja yang berubah dalam waktu tertentu.'},
 94:{name:'Lihat Kondisi Masa Lalu',help:'Lihat kondisi terbaik yang bisa direkonstruksi pada waktu tertentu.'},
 95:{name:'Rekaman Kejadian Maintenance',help:'Lihat urutan kejadian maintenance berdasarkan waktu.'},
 96:{name:'Peta Hubungan Pengetahuan',help:'Lihat hubungan mesin, masalah, RCA, manual, dan data lain.'},
 97:{name:'Coba Skenario',help:'Ubah asumsi untuk melihat hasil simulasi, bukan ramalan.'},
 98:{name:'Ruang Koordinasi Masalah',help:'Koordinasikan masalah besar tanpa mengubah Logbook lama.'},
 99:{name:'Saran Tugas Maintenance',help:'Lihat antrean hal yang perlu dicek manusia.'},
 100:{name:'Ringkasan Besar OMODOS',help:'Gabungkan informasi penting maintenance dalam satu halaman.'}
};

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
var SOURCE_DISPLAY = {'Master Mesin':'Daftar Mesin',Machine:'Mesin',Logbook:'Catatan Pekerjaan',Patrol:'Pemeriksaan Lapangan',Breakdown:'Gangguan Mesin',Downtime:'Waktu Mesin Berhenti',Sparepart:'Suku Cadang',RCA:'Analisis Penyebab',Project:'Proyek',People:'Teknisi',Assessment:'Penilaian Keahlian',Knowledge:'Pengetahuan',KPI:'Target Kerja',Energy:'Energi','Run Hour':'Jam Operasi',IPAL:'Pengolahan Limbah',Failure:'Masalah Mesin'};
function sourceDisplay(name){return SOURCE_DISPLAY[name]||name}

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
 return String(val(o,['Deskripsi Pekerjaan','Deskripsi','deskripsi','Masalah','masalah','Keterangan','keterangan','Jenis Pekerjaan','judul','Judul'])||'Catatan pekerjaan').trim();
}
function recordRow(o,badge){
 return '<div class="v4-mp-row"><div><strong>'+esc(machineName(o))+'</strong><small>'+esc(fmtDate(dateValue(o)))+'</small></div><div>'+esc(describe(o))+'<div class="v4-chip-row"><span class="v4-risk-chip">'+esc(badge||statusOf(o)||'Tercatat')+'</span></div></div></div>';
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
 if(root){root.setAttribute('aria-label','Ringkasan Utama');root.classList.add('v4-nav-btn');root.lastChild.textContent=' Ringkasan Utama'}
 var existing=sub.querySelectorAll('[data-v4-safe-module]');
 if(existing.length===10)return;
 existing.forEach(function(x){x.remove()});
 for(var i=1;i<WORKSPACES.length;i++){
  var b=document.createElement('button');
  b.type='button';b.className='nav-btn v4-nav-btn v4-module-btn';
  b.setAttribute('data-v4-safe-module',String(i));
  b.setAttribute('data-view','omodos4');
  var simpleWs=SIMPLE_WORKSPACE[i]||{name:WORKSPACES[i].name};
  b.setAttribute('aria-label',simpleWs.name);
  b.innerHTML='<span class="ico"><i class="ph-bold '+WORKSPACES[i].icon+'"></i></span> '+esc(simpleWs.name);
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
  card('Mesin Perlu Dicek',cm.size,'Mesin yang memiliki tanda masalah penting pada data yang tersedia.','ph-warning'),
  card('Masalah Aktif',bd.length||critical.length,'Jumlah gangguan mesin dan pekerjaan penting yang tercatat.','ph-wrench'),
  card('Tanda Awal Masalah',pr.length,'Temuan pemeriksaan dengan tanda tidak biasa atau prioritas tinggi.','ph-waveform'),
  card('Sparepart Perlu Dicek',sp==null?'—':sp,sp==null?'Sumber sparepart belum dimuat.':'Permintaan suku cadang yang belum selesai.','ph-package'),
  card('Target Perlu Dicek',ka==null?'—':ka,ka==null?'Capaian KPI belum cukup untuk dibandingkan.':'Target yang capaiannya masih di bawah 100%.','ph-target'),
  card('Tugas Penting Belum Selesai',critical.length,'Pekerjaan penting yang tercatat tetapi belum selesai.','ph-list-checks')
 ].join('');
 var look=document.getElementById('v4-look-at');
 var attention=critical.concat(pr).sort(function(a,b){return dateValue(b)-dateValue(a)}).slice(0,10);
 if(look)look.innerHTML=attention.length?attention.map(function(x){return recordRow(x,'Perlu diperiksa petugas')}).join(''):'<div class="v4-empty">Tidak ada sinyal prioritas tinggi pada data yang sedang dimuat.</div>';
 var changed=document.getElementById('v4-changed'), since=Date.now()-24*3600*1000;
 var changes=entries.concat(patrol).filter(function(x){return dateValue(x)>=since}).sort(function(a,b){return dateValue(b)-dateValue(a)}).slice(0,10);
 if(changed)changed.innerHTML=changes.length?changes.map(function(x){return recordRow(x,'Tercatat')}).join(''):'<div class="v4-empty">Tidak ada perubahan tercatat dalam 24 jam terakhir.</div>';
 var latest=document.getElementById('v4-latest');
 var latestRows=entries.concat(patrol).sort(function(a,b){return dateValue(b)-dateValue(a)}).slice(0,12);
 if(latest)latest.innerHTML=latestRows.length?latestRows.map(function(x){return recordRow(x,'Dari data OMODOS')}).join(''):'<div class="v4-empty">Belum ada catatan untuk diringkas.</div>';
 return true;
}
function featureNumber(workspaceIndex,localIndex){return (workspaceIndex-1)*10+localIndex+1}
function renderWorkspace(idx){
 if(!permitted())return false;
 idx=Number(idx)||0;if(idx<=0)return renderCommandCenter();
 var ws=WORKSPACES[idx];if(!ws)return false;
 var simpleWs=SIMPLE_WORKSPACE[idx]||{name:ws.name,help:'Pilih fitur yang ingin dilihat.'};
 ACTIVE_WORKSPACE=idx;ACTIVE_FEATURE=0;setActiveNav(idx);
 var view=document.getElementById('view-omodos4'),s=stage();if(!view||!s)return false;
 view.classList.add('v4-master-active','v4-safe-module-open','v4-low-cognitive');view.classList.remove('v4-feature-open','v4-show-technical');
 var sources=SOURCE_BY_WORKSPACE[idx]||[];
 var sourceChips=sources.map(function(x){return '<span class="v4-source-chip">'+esc(sourceDisplay(x))+' <b>'+sourceCount(x)+'</b></span>'}).join('');
 var tiles=ws.features.map(function(name,i){
  var n=featureNumber(idx,i),info=SIMPLE_FEATURE[n]||{name:name,help:'Buka untuk melihat informasi.'};
  return '<button type="button" class="v4-feature-tile" data-v4-feature="'+n+'" data-v4-route="omodos4">'+
   '<span class="n">'+String(n).padStart(3,'0')+'</span>'+
   '<span class="v4-tile-copy"><strong>'+esc(info.name)+'</strong><small>'+esc(info.help)+'</small></span>'+
   '<span class="v4-tile-arrow" aria-hidden="true"><i class="ph-bold ph-caret-right"></i></span></button>';
 }).join('');
 s.innerHTML='<div class="v4-card v4-workspace-card">'+
  '<div class="v4-module-head"><div><div class="v4-simple-kicker">Pilih yang ingin dilihat</div><h2><i class="ph-bold '+ws.icon+'"></i> '+esc(simpleWs.name)+'</h2><p>'+esc(simpleWs.help)+' Pilih satu kartu di bawah.</p></div>'+
  '<button class="btn btn-sm" data-v4-back-command><i class="ph-bold ph-house"></i> Ringkasan Utama</button></div>'+
  '<details class="v4-simple-details"><summary><i class="ph-bold ph-database"></i> Data yang dipakai</summary><div class="v4-source-strip">'+sourceChips+'</div></details>'+
  '<div class="v4-feature-grid">'+tiles+'</div></div>';
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
 var grid='<div class="v4-evidence-grid">'+src.map(function(name){
  var c=sourceCount(name),state=c>0?'Ada data':'Belum ada data';
  return '<div class="v4-evidence"><span>'+esc(sourceDisplay(name))+'</span><strong>'+esc(c)+'</strong><small>'+state+'</small></div>';
 }).join('')+'</div>';
 return '<details class="v4-simple-details v4-source-details"><summary><i class="ph-bold ph-database"></i> Lihat sumber data</summary>'+grid+'</details>';
}
function openButtons(f){
 var used=new Set(),html='';
 (SOURCE_BY_WORKSPACE[f.wi]||[]).forEach(function(name){
  var v=VIEW_BY_SOURCE[name];if(!v||used.has(v))return;used.add(v);
  html+='<button class="btn btn-sm" data-v4-open-existing="'+esc(v)+'"><i class="ph-bold ph-arrow-square-out"></i> Buka '+esc(sourceDisplay(name))+'</button>';
 });
 if(f.wi===8)html+='<button class="btn btn-sm" data-v4-open-copilot><i class="ph-bold ph-brain"></i> Buka Copilot</button>';
 if(!html)return '';
 return '<details class="v4-simple-details v4-data-links"><summary><i class="ph-bold ph-folder-open"></i> Buka data asal</summary><div class="v4-actions">'+html+'</div></details>';
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
 if(!rows.length)return '<div class="v4-empty">Data belum cukup untuk membuat ringkasan yang dapat dipercaya.</div>';
 return '<div class="v4-detail-list">'+rows.map(function(r){return recordRow(r,'Bukti data')}).join('')+'</div>';
}
function renderMachinePassport(f){
 var names=getMachineNames();
 if(!names.length)return '<div class="v4-empty">Data mesin dan riwayat pemeriksaan belum tersedia.</div>';
 var current=(document.getElementById('v4-machine-select')||{}).value||names[0];
 if(names.indexOf(current)<0)current=names[0];
 var m=getMachines().find(function(x){return machineMatches(x,current)})||{};
 var entries=getEntries().filter(function(x){return machineMatches(x,current)});
 var patrol=getPatrol().filter(function(x){return machineMatches(x,current)});
 var open=entries.filter(function(x){return !isDone(x)}),crit=entries.filter(isCritical);
 var events=entries.concat(patrol).sort(function(a,b){return dateValue(b)-dateValue(a)});
 var opts=names.map(function(n){return '<option'+(n===current?' selected':'')+'>'+esc(n)+'</option>'}).join('');
 var identity=[
  ['Kode mesin',val(m,['Kode Mesin','kodeMesin','KodeMesin'])||'Belum tersedia'],
  ['Nama mesin',val(m,['Nama Mesin','namaMesin'])||current],
  ['Lokasi',val(m,['Lokasi Mesin','Lokasi','Area','lokasi'])||'Belum tersedia'],
  ['Model',val(m,['Model','model','Tipe','Type'])||'Belum tersedia'],
  ['Spesifikasi',val(m,['Spesifikasi','Spesifikasi Mesin','spec','Specs'])||'Belum tersedia'],
  ['Manual',val(m,['Manual','Manual URL','manualUrl','Link Manual'])?'Tercatat':'Belum tersedia']
 ];
 return '<div class="v4-passport-toolbar"><label>Mesin<select id="v4-machine-select">'+opts+'</select></label></div>'+
 '<div class="v4-passport-grid">'+
  '<div class="v4-subcard"><h3>Identity</h3>'+identity.map(function(x){return '<div class="v4-kv"><span>'+esc(x[0])+'</span><b>'+esc(x[1])+'</b></div>'}).join('')+'</div>'+
  '<div class="v4-subcard"><h3>Kondisi Sekarang</h3><div class="v4-kv"><span>Masalah belum selesai</span><b>'+open.length+'</b></div><div class="v4-kv"><span>Tanda masalah penting</span><b>'+crit.length+'</b></div><div class="v4-kv"><span>Aktivitas terakhir</span><b>'+esc(events[0]?fmtDate(dateValue(events[0])):'Belum tersedia')+'</b></div><div class="v4-kv"><span>Perlu tindakan?</span><b>'+(crit.length?'Perlu diperiksa petugas':(events.length?'Tidak ada tanda masalah penting pada data yang dimuat':'Data belum cukup'))+'</b></div></div>'+
  '<div class="v4-subcard"><h3>Riwayat Mesin</h3><div class="v4-kv"><span>Logbook</span><b>'+entries.length+'</b></div><div class="v4-kv"><span>Patrol</span><b>'+patrol.length+'</b></div><div class="v4-kv"><span>Masalah penting</span><b>'+crit.length+'</b></div><p class="v4-muted">Ringkasan ini berasal dari catatan yang tersedia. Angka waktu antar kerusakan dan lama perbaikan belum ditampilkan jika datanya tidak cukup.</p></div>'+
 '</div><h3 class="v4-detail-heading">Catatan Mesin Terbaru</h3>'+
 (events.length?events.slice(0,10).map(function(x){return recordRow(x,'Tercatat')}).join(''):'<div class="v4-empty">Belum tersedia</div>');
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
 if(!list.length)return '<div class="v4-empty">Belum ada cukup kasus berulang untuk dibandingkan.</div>';
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
 if(!rows.length)return '<div class="v4-empty">Belum ada cukup riwayat untuk menghitung tanda risiko.</div>';
 return '<div class="v4-table-lite"><div class="v4-table-head"><span>Mesin</span><span>Nilai Risiko</span><span>Alasan</span></div>'+rows.slice(0,20).map(function(x){
  return '<div class="v4-table-row"><strong>'+esc(x.name)+'</strong><b>'+x.score+'</b><span>'+x.critical+' masalah penting • '+x.abnormal+' temuan pemeriksaan • '+x.open+' belum selesai</span></div>';
 }).join('')+'</div><p class="v4-muted">Nilai risiko dihitung dari jumlah masalah penting (×3), temuan pemeriksaan tidak biasa (×2), dan masalah belum selesai (maksimal 5). Nilai ini bukan peluang kerusakan atau kepastian.</p>';
}
function renderSpareCritical(){
 var rows=getSpare();
 if(!rows.length)return '<div class="v4-empty">Data suku cadang belum dimuat.</div>';
 var by={};
 rows.forEach(function(r){
  var key=String(val(r,['materialNumber','Material Number SAP','nomor','sap','kode'])||val(r,['materialName','Nama Material','nama'])||'Tidak diketahui');
  if(!by[key])by[key]={key:key,name:String(val(r,['materialName','Nama Material','nama'])||key),count:0,machines:new Set()};
  by[key].count++;
  var m=machineName(r);if(m&&m!=='-')by[key].machines.add(m);
 });
 var list=Object.values(by).sort(function(a,b){return b.count-a.count}).slice(0,25);
 return '<div class="v4-table-lite"><div class="v4-table-head"><span>Suku Cadang</span><span>Jumlah Catatan</span><span>Mesin Terkait</span></div>'+list.map(function(x){return '<div class="v4-table-row"><strong>'+esc(x.name)+'</strong><b>'+x.count+'</b><span>'+x.machines.size+' mesin</span></div>'}).join('')+'</div><p class="v4-muted">Urutan ini berdasarkan catatan pemakaian yang tersedia. Petugas tetap perlu memastikan tingkat pentingnya suku cadang.</p>';
}
function renderReliability(){
 var rows=riskRows();
 if(!rows.length)return '<div class="v4-empty">Data belum cukup untuk merangkum keandalan mesin.</div>';
 return '<div class="v4-table-lite"><div class="v4-table-head"><span>Mesin</span><span>Perlu Perhatian</span><span>Dasar</span></div>'+rows.slice(0,20).map(function(x){return '<div class="v4-table-row"><strong>'+esc(x.name)+'</strong><b>'+x.score+'</b><span>'+x.critical+' masalah penting / '+x.open+' belum selesai</span></div>'}).join('')+'</div><p class="v4-muted">Untuk melihat angka resmi keandalan dan waktu perbaikan, buka data KPI atau gangguan mesin di bawah.</p>';
}
function renderPeople(){
 var people=getPeople(),hs=getHardAssess(),ss=getSoftAssess();
 if(!people.length)return '<div class="v4-empty">Data teknisi belum dimuat.</div>';
 return '<div class="v4-statline"><div><b>'+people.length+'</b><span>Teknisi</span></div><div><b>'+hs.length+'</b><span>Catatan keahlian teknis</span></div><div><b>'+ss.length+'</b><span>Catatan keahlian pendukung</span></div></div><p class="v4-muted">Ringkasan ini memakai data teknisi dan penilaian yang sudah ada. Riwayat pekerjaan saja tidak menentukan nilai kemampuan seseorang.</p>';
}
function renderAiBrief(){
 var entries=getEntries(),crit=entries.filter(isCritical),latest=entries.slice().sort(function(a,b){return dateValue(b)-dateValue(a)}).slice(0,5);
 return '<div class="v4-ai-brief"><div class="v4-eyebrow">Ringkasan dari catatan</div><h3>Ringkasan pekerjaan dari data OMODOS</h3><p>'+crit.length+' tanda masalah penting atau belum selesai ditemukan. '+latest.length+' catatan terbaru tersedia untuk dilihat.</p><p class="v4-muted">Saran ini perlu diperiksa bersama catatan asalnya sebelum digunakan. Data pekerjaan tidak berubah secara otomatis.</p></div>';
}
function renderImprovement(){
 var recurring=renderFailureMemory();
 return '<p class="v4-muted">Bagian ini menampilkan masalah berulang dan pekerjaan belum selesai sebagai bahan perbaikan. Petugas menentukan tindak lanjutnya.</p>'+recurring;
}
function renderWhatChanged(){
 var now=Date.now(),since=now-24*3600*1000;
 var rows=getEntries().concat(getPatrol()).filter(function(x){return dateValue(x)>=since}).sort(function(a,b){return dateValue(b)-dateValue(a)});
 return '<div class="v4-toolbar"><button class="btn btn-sm active" data-v4-change-window="24">24 Jam</button><button class="btn btn-sm" data-v4-change-window="168">7 Hari</button></div><div id="v4-what-changed-list">'+(rows.length?rows.slice(0,50).map(function(x){return recordRow(x,'Tercatat')}).join(''):'<div class="v4-empty">Tidak ada perubahan tercatat pada periode ini.</div>')+'</div>';
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
  return '<div class="v4-tm-card"><strong>'+esc(n)+'</strong>'+(r?'<span>'+esc(fmtDate(dateValue(r)))+'</span><p>'+esc(describe(r))+'</p><small>Tercatat</small>':'<p>Belum ada catatan pada waktu yang dipilih.</p><small>Belum tersedia</small>')+'</div>';
 }).join('');
 out.innerHTML=cards?'<div class="v4-tm-grid">'+cards+'</div>':'<div class="v4-empty">Tidak ada riwayat yang tercatat sebelum waktu tersebut.</div>';
}
function brainCounts(){
 return [
  ['Mesin',getMachines().length||getMachineNames().length,'database'],
  ['Teknisi',getPeople().length,'pi-dashboard'],
  ['Suku Cadang',getSpare().length,'sparepart'],
  ['Masalah',getEntries().filter(isCritical).length,'analitik'],
  ['Pengetahuan',getKnowledge().length,'knowledge'],
  ['Proyek',getProjects().length,'project-center'],
  ['KPI',getKpi().length,'kpi-department'],
  ['Energi',getEnergy().length,'energy-utility'],
  ['IPAL',getIpal().length,'energy-utility']
 ];
}
function renderBrain(){
 return '<div class="v4-brain-canvas"><div class="v4-brain-center"><i class="ph-bold ph-cpu"></i><strong>OMODOS</strong><small>FACTORY BRAIN</small></div><div class="v4-brain-nodes">'+brainCounts().map(function(x){return '<button data-v4-open-existing="'+x[2]+'"><span>'+esc(x[0])+'</span><b>'+x[1]+'</b><small>'+(x[1]?'Tercatat / dihitung':'Belum tersedia')+'</small></button>'}).join('')+'</div></div><p class="v4-muted">Setiap bagian terhubung dengan catatan yang tersedia; jumlah kosong berarti datanya belum ada.</p>';
}
function renderWarRoom(){
 var rows=getEntries().filter(isCritical).sort(function(a,b){return dateValue(b)-dateValue(a)}).slice(0,20);
 return '<div class="v4-war-room"><div class="v4-warning-box"><strong>Koordinasi masalah oleh Superadmin</strong><p>Daftar ini menampilkan masalah penting dari Logbook sebagai bahan koordinasi.</p></div>'+(rows.length?rows.map(function(x){return recordRow(x,'Calon masalah penting')}).join(''):'<div class="v4-empty">Tidak ada masalah penting pada data yang dimuat.</div>')+'</div>';
}
function renderFeature(n){
 if(!permitted())return false;
 var f=featureByNumber(n);if(!f)return false;
 var simpleWs=SIMPLE_WORKSPACE[f.wi]||{name:f.workspace.name};
 var info=SIMPLE_FEATURE[f.n]||{name:f.name,help:'Lihat informasi dari data OMODOS yang tersedia.'};
 ACTIVE_WORKSPACE=f.wi;ACTIVE_FEATURE=f.n;setActiveNav(f.wi);
 var s=stage(),view=document.getElementById('view-omodos4');if(!s||!view)return false;
 view.classList.add('v4-master-active','v4-safe-module-open','v4-feature-open','v4-low-cognitive');view.classList.remove('v4-show-technical');
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
 s.innerHTML='<div class="v4-card v4-detail-card">'+
  '<div class="v4-module-head"><div><div class="v4-simple-kicker">'+esc(simpleWs.name)+' • Fitur '+String(f.n).padStart(3,'0')+'</div>'+
  '<h2>'+esc(info.name)+'</h2><p>'+esc(info.help)+'</p><div class="v4-tech-name">Nama teknis: '+esc(f.name)+'</div></div>'+
  '<div class="v4-head-actions"><button class="btn btn-sm" data-v4-tech-toggle><i class="ph-bold ph-sliders-horizontal"></i> Detail teknis</button>'+
  '<button class="btn btn-sm" data-v4-back-workspace="'+f.wi+'"><i class="ph-bold ph-arrow-left"></i> Kembali</button></div></div>'+
  '<div class="v4-simple-steps"><div><b>1</b><span>Baca ringkasan</span></div><div><b>2</b><span>Pilih mesin atau saring data jika perlu</span></div><div><b>3</b><span>Buka data asal bila perlu</span></div></div>'+
  sourcePanel(f)+'<div class="v4-detail-body">'+body+'</div>'+openButtons(f)+'</div>';
 s.style.display='block';
 try{s.scrollIntoView({block:'start',behavior:'auto'})}catch(e){}
 return true;
}
function updateWhatChanged(hours){
 var since=Date.now()-Number(hours||24)*3600*1000,out=document.getElementById('v4-what-changed-list');
 if(!out)return;
 var rows=getEntries().concat(getPatrol()).filter(function(x){return dateValue(x)>=since}).sort(function(a,b){return dateValue(b)-dateValue(a)});
 out.innerHTML=rows.length?rows.slice(0,80).map(function(x){return recordRow(x,'Tercatat')}).join(''):'<div class="v4-empty">Tidak ada perubahan tercatat pada periode ini.</div>';
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
 simpleWorkspaces:SIMPLE_WORKSPACE,
 simpleFeatures:SIMPLE_FEATURE,
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

/* OMODOS4_SERVER_BRIDGE_V1
   Read-only bridge to the existing server-side V4 intelligence engine.
   It never queues requests and never writes operational source-of-truth data. */
(function(){
'use strict';

var READ_ACTIONS=new Set([
 'v4.getOverview','v4.getWhatChanged','v4.getMachineHealth','v4.getMachinePassport','v4.getMachineGraph',
 'v4.getFactoryBrain','v4.getFailureMemory','v4.getPredictiveRisk','v4.getFieldMission','v4.getSparepartRisk',
 'v4.getReliability','v4.getKpiStory','v4.getPeopleSkillGraph','v4.getExpertFinder','v4.getExperiencePassport',
 'v4.getImprovement','v4.findSimilarImprovement','v4.getBrief','v4.getScenarios','v4.getKnowledgeCandidates',
 'v4.getTimeMachine','v4.getBlackBox','v4.getWarRoom'
]);

var FEATURE_ACTIONS={};
[11,12,13,14,15,16,17,18,19,20].forEach(function(n){FEATURE_ACTIONS[n]='v4.getPredictiveRisk'});
[21,22,23,24,25,26,27,28,29,30].forEach(function(n){FEATURE_ACTIONS[n]='v4.getFieldMission'});
[31,32,33,34,35,36,37,38,39,40].forEach(function(n){FEATURE_ACTIONS[n]='v4.getSparepartRisk'});
[41,42,43,44,45,46,48,49,50].forEach(function(n){FEATURE_ACTIONS[n]='v4.getReliability'});
[51,52,53,54,55,56,57,58,59,60].forEach(function(n){FEATURE_ACTIONS[n]='v4.getKpiStory'});
[61,62,65,66,67,68,69,70].forEach(function(n){FEATURE_ACTIONS[n]='v4.getPeopleSkillGraph'});
[81,82,83,84,85,86,87,88,89,90].forEach(function(n){FEATURE_ACTIONS[n]='v4.getImprovement'});
Object.assign(FEATURE_ACTIONS,{
 1:'v4.getMachinePassport',
 2:'v4.getMachineHealth',
 3:'v4.getMachineGraph',
 4:'v4.getMachinePassport',
 5:'v4.getMachinePassport',
 6:'v4.getFailureMemory',
 7:'v4.getMachinePassport',
 8:'v4.getMachinePassport',
 9:'v4.getMachinePassport',
 10:'v4.getMachineGraph',
 47:'v4.getFailureMemory',
 60:'v4.getBrief',
 63:'v4.getExpertFinder',
 64:'v4.getPeopleSkillGraph',
 73:'v4.getBrief',
 74:'v4.getBrief',
 75:'v4.getKnowledgeCandidates',
 78:'v4.getKnowledgeCandidates',
 80:'v4.getBrief',
 91:'v4.getFactoryBrain',
 92:'v4.getOverview',
 93:'v4.getWhatChanged',
 95:'v4.getBlackBox',
 96:'v4.getFactoryBrain',
 97:'v4.getScenarios',
 98:'v4.getWarRoom',
 99:'v4.getOverview',
 100:'v4.getFactoryBrain'
});

var FEATURE_PATHS={
 2:['machines'],
 4:['intelligence.anatomy'],
 5:['intelligence.componentLifeClock'],
 6:['patterns','hits'],
 7:['intelligence.machinePersonality'],
 8:['intelligence.agingCurve'],
 9:['intelligence.eventReplay'],
 11:['risks'],
 12:['attentionQueue'],
 13:['anomalyBeforeFailure'],
 14:['failureSignatures'],
 15:['crossMachineClusters'],
 16:['silentDeterioration'],
 17:['failureSignatures'],
 18:['risks'],
 19:['remainingUsefulLife'],
 20:['attentionQueue'],
 21:['journey'],
 22:['missions'],
 23:['missions'],
 24:['missions'],
 25:['missions'],
 26:['missions'],
 27:['journey'],
 28:['journey'],
 29:['journey'],
 30:['missions'],
 31:['criticalityMatrix'],
 32:['criticalityMatrix','procurementUrgency'],
 33:['deadStockCandidates'],
 34:['consumptionTop'],
 35:['machinePartGraph'],
 36:['equivalentParts'],
 37:['photoRecognition','partPhotoAssets'],
 38:['shelfDigitalTwin'],
 39:['reservationForecast'],
 40:['procurementUrgency'],
 41:['totals','badActors'],
 42:['badActors'],
 43:['pareto','paretoNarrative'],
 44:['chronic','acute'],
 45:['hiddenFactory'],
 46:['reliabilityGrowth'],
 47:['rcaMemory'],
 48:['countermeasureEffectiveness'],
 49:['costIntelligence'],
 50:['costIntelligence'],
 51:['kpiStories'],
 52:['kpiAtRisk','kpiStories'],
 53:['kpiStories'],
 54:['targetRecovery'],
 55:['maintenanceProductionCorrelation'],
 56:['energyAnomalies'],
 57:['energyPerGoodOutput'],
 58:['utilityDigitalTwin'],
 59:['ipalIntelligence'],
 60:['headline','summary','thingsToLookAt'],
 61:['personnel'],
 62:['skillToMachine'],
 63:['experts'],
 64:['personnel'],
 65:['knowledgeRisk'],
 66:['skillGapRadar'],
 67:['adaptiveLearning'],
 68:['mentorMatches'],
 69:['troubleshootingChallenges'],
 70:['personnel','skillToMachine'],
 73:['headline','summary','thingsToLookAt'],
 74:['headline','summary','thingsToLookAt'],
 75:['candidates'],
 78:['candidates'],
 80:['headline','summary','thingsToLookAt'],
 81:['opportunityRadar'],
 82:['autoKaizenDraft','opportunityRadar'],
 83:['benefitEvidence'],
 84:['beforeAfterTimeline'],
 85:['ideaMarketplace'],
 86:['opportunityRadar','openImprovements'],
 87:['overdueProjects','openImprovements'],
 88:['sgaStories'],
 89:['knowledgeGraph'],
 90:['improvementLegacy'],
 91:['nodes','edges','domains'],
 92:['summary','thingsToLookAt','topRisks'],
 93:['categories'],
 95:['summary','topMachines','events'],
 96:['nodes','edges','domains'],
 97:['scenarios'],
 98:['wars'],
 99:['summary','topRisks','topOpportunities'],
 100:['nodes','edges','domains']
};
function pathValue(obj,path){
 var cur=obj;
 String(path||'').split('.').forEach(function(k){cur=cur&&typeof cur==='object'?cur[k]:undefined});
 return cur;
}
function projectForFeature(n,data){
 var paths=FEATURE_PATHS[Number(n)];
 if(!paths||!paths.length||!data||typeof data!=='object')return data;
 var out={};
 paths.forEach(function(p){
  var v=pathValue(data,p);
  if(v!==undefined)out[p.split('.').pop()]=v;
 });
 ['generatedAt','logicVersion','range','appliedScope','confidence','caveat','note','safety','lineage','sourceTruth'].forEach(function(k){
  if(data[k]!==undefined)out[k]=data[k];
 });
 return Object.keys(out).length?out:data;
}

var HYDRATE_SEQ=0;

function h(v){
 return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]});
}
function label(k){
 var names={generatedAt:'Diperbarui pada',logicVersion:'Versi perhitungan',appliedScope:'Cakupan data',confidence:'Tingkat keyakinan',caveat:'Hal yang perlu diperhatikan',note:'Catatan',safety:'Keamanan data',lineage:'Asal data',sourceTruth:'Sumber data',thingsToLookAt:'Perlu diperhatikan',criticalMachines:'Mesin perlu dicek',topRisks:'Risiko utama',topOpportunities:'Peluang perbaikan',latestIntelligence:'Data terbaru',machines:'Mesin',risks:'Risiko',missions:'Tugas teknisi',badActors:'Mesin yang sering bermasalah',pareto:'Masalah terbanyak',recurring:'Masalah berulang',failureMemory:'Riwayat masalah',kpiStories:'Ringkasan target',stories:'Ringkasan',personnel:'Teknisi',experts:'Orang berpengalaman',opportunityRadar:'Peluang perbaikan',opportunity:'Peluang',candidates:'Perlu ditinjau',categories:'Kategori',events:'Kejadian',topMachines:'Mesin utama',nodes:'Data terkait',edges:'Hubungan data',wars:'Ruang koordinasi',scenarios:'Skenario',healthIndex:'Nilai kesehatan',riskScore:'Nilai risiko',eventCount:'Jumlah kejadian',openIssues:'Masalah belum selesai',downtimeMinutes:'Menit mesin berhenti',recurrence:'Kejadian berulang',score:'Nilai',count:'Jumlah',criticalityMatrix:'Tingkat penting suku cadang',procurementUrgency:'Prioritas pembelian',deadStockCandidates:'Suku cadang lama tidak terpakai',consumptionTop:'Pemakaian terbanyak',machinePartGraph:'Hubungan mesin dan suku cadang',equivalentParts:'Calon suku cadang pengganti',photoRecognition:'Pengenalan lewat foto',partPhotoAssets:'Foto suku cadang',shelfDigitalTwin:'Peta rak',reservationForecast:'Perkiraan kebutuhan',reliabilityGrowth:'Perubahan keandalan',hiddenFactory:'Gangguan yang tersembunyi',knowledgeRisk:'Risiko hilangnya pengetahuan',skillGapRadar:'Keahlian yang perlu dipelajari',mentorMatches:'Calon mentor',troubleshootingChallenges:'Latihan mencari masalah',opportunityRadar:'Peluang perbaikan',overdueProjects:'Proyek terlambat',openImprovements:'Perbaikan belum selesai',sgaStories:'Cerita SGA',improvementLegacy:'Riwayat perbaikan'};
 return names[k]||String(k||'').replace(/([a-z])([A-Z])/g,'$1 $2').replace(/[_-]+/g,' ').replace(/\b\w/g,function(x){return x.toUpperCase()});
}
function isLocalQa(){
 try{return /^(localhost|127\.0\.0\.1|0\.0\.0\.0)$/.test(location.hostname)}catch(e){return false}
}
function allowed(){
 try{return !!(window.OMODOS4&&typeof window.OMODOS4.isAllowed==='function'&&window.OMODOS4.isAllowed())}catch(e){return false}
}
function ready(){
 try{
  return allowed()&&!isLocalQa()&&typeof WEB_APP_URL!=='undefined'&&!!WEB_APP_URL&&
   typeof SESSION_TOKEN!=='undefined'&&!!SESSION_TOKEN&&typeof fetch==='function';
 }catch(e){return false}
}
function requestToken(){
 try{
  if(typeof SETTING_AUTH_OK!=='undefined'&&SETTING_AUTH_OK&&typeof SETTING_SESSION_TOKEN!=='undefined'&&SETTING_SESSION_TOKEN)return SETTING_SESSION_TOKEN;
  return typeof SESSION_TOKEN!=='undefined'?SESSION_TOKEN:'';
 }catch(e){return ''}
}
async function serverRead(action,payload){
 if(!READ_ACTIONS.has(action))throw new Error('READ_ACTION_NOT_ALLOWED');
 if(!ready())return null;
 var body=Object.assign({},payload||{},{action:action,sessionToken:requestToken()});
 var opts={
  method:'POST',mode:'cors',credentials:'omit',redirect:'follow',cache:'no-store',
  headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(body)
 };
 var res;
 if(typeof fetchWithTimeout_==='function')res=await fetchWithTimeout_(WEB_APP_URL,opts,45000);
 else res=await fetch(WEB_APP_URL,opts);
 var json=typeof parseApiResponse_==='function'?await parseApiResponse_(res):await res.json();
 if(!json||json.ok!==true){
  var err=json&&json.error;
  var msg=typeof err==='string'?err:(err&&err.message)||'V4 server read failed';
  throw new Error(msg);
 }
 return json.data==null?null:json.data;
}
function machineNames(){
 try{
  if(window.OMODOS4&&Array.isArray(window.OMODOS4.workspaces)&&typeof getMachineNames==='function')return getMachineNames();
 }catch(e){}
 var set=new Set();
 try{
  (Array.isArray(MACHINES)?MACHINES:[]).forEach(function(m){
   var n=m['Nama Mesin']||m.namaMesin||m['Kode Mesin']||m.kodeMesin;
   if(n)set.add(String(n));
  });
 }catch(e){}
 return Array.from(set);
}
function currentMachine(){
 var a=document.getElementById('v4-machine-select');
 if(a&&a.value)return a.value;
 var b=document.querySelector('[data-v4-server-machine]');
 if(b&&b.value)return b.value;
 var names=machineNames();
 return names[0]||'';
}
function actionNeedsMachine(action,n){
 return action==='v4.getMachinePassport'||action==='v4.getMachineGraph'||(action==='v4.getExpertFinder'&&n===63);
}
function payloadFor(action,n){
 var p={};
 if(actionNeedsMachine(action,n)){
  var m=currentMachine();
  if(m)p.machine=m;
 }
 return p;
}
function simpleValue(v){
 if(v==null||v==='')return '—';
 if(typeof v==='boolean')return v?'Ya':'Tidak';
 if(typeof v==='number')return Number.isFinite(v)?String(Math.round(v*100)/100):'—';
 return String(v);
}
function headline(o){
 if(!o||typeof o!=='object')return simpleValue(o);
 var keys=['title','headline','machine','name','label','event','problem','description','theme','category','type','source','id','ID'];
 for(var i=0;i<keys.length;i++)if(o[keys[i]]!=null&&String(o[keys[i]]).trim())return String(o[keys[i]]);
 var first=Object.keys(o).find(function(k){return ['string','number','boolean'].includes(typeof o[k])&&String(o[k]).trim()});
 return first?String(o[first]):'Evidence';
}
function subline(o){
 if(!o||typeof o!=='object')return '';
 var parts=[];
 ['risk','status','priority','confidence','reason','note','logicVersion','label'].forEach(function(k){
  if(o[k]!=null&&String(o[k]).trim()&&!parts.includes(String(o[k])))parts.push(String(o[k]));
 });
 ['healthIndex','riskScore','count','eventCount','openIssues','downtimeMinutes','recurrence','score'].forEach(function(k){
  if(o[k]!=null&&String(o[k]).trim())parts.push(label(k)+': '+simpleValue(o[k]));
 });
 return parts.slice(0,4).join(' • ');
}
function collectionHtml(name,list){
 if(!Array.isArray(list)||!list.length)return '';
 return '<section class="v4-server-section"><div class="v4-server-section-head"><strong>'+h(label(name))+'</strong><span>'+list.length+' catatan</span></div>'+
 '<div class="v4-server-list">'+list.slice(0,12).map(function(x){
  if(x==null||typeof x!=='object')return '<div class="v4-server-item"><strong>'+h(simpleValue(x))+'</strong></div>';
  return '<div class="v4-server-item"><strong>'+h(headline(x))+'</strong><small>'+h(subline(x)||'Berdasarkan data yang tercatat')+'</small></div>';
 }).join('')+'</div></section>';
}
function objectMetrics(data){
 if(!data||typeof data!=='object')return '';
 var rows=[];
 Object.keys(data).forEach(function(k){
  var v=data[k];
  if(v==null)return;
  if(['string','number','boolean'].includes(typeof v)){
   var txt=simpleValue(v);
   if(txt.length<=140)rows.push([k,txt]);
  }
 });
 if(!rows.length)return '';
 return '<div class="v4-server-metrics">'+rows.slice(0,12).map(function(x){
  return '<div><span>'+h(label(x[0]))+'</span><b>'+h(x[1])+'</b></div>';
 }).join('')+'</div>';
}
function preferredCollections(data){
 var keys=['thingsToLookAt','criticalMachines','topRisks','topOpportunities','latestIntelligence','machines','risks','missions',
  'badActors','pareto','recurring','failureMemory','kpiStories','stories','personnel','experts','opportunityRadar','opportunity',
  'candidates','categories','events','topMachines','nodes','edges','wars','scenarios'];
 var out=[],seen=new Set();
 keys.forEach(function(k){if(Array.isArray(data&&data[k])&&data[k].length){out.push([k,data[k]]);seen.add(k)}});
 if(data&&typeof data==='object')Object.keys(data).forEach(function(k){
  if(!seen.has(k)&&Array.isArray(data[k])&&data[k].length&&out.length<5)out.push([k,data[k]]);
 });
 return out.slice(0,5);
}
function serverHtml(action,data){
 if(!data||typeof data!=='object')return '<div class="v4-empty">Belum ada rincian data yang dapat ditampilkan.</div>';
 var html='<div class="v4-server-head"><div><span class="v4-server-badge">DATA OMODOS</span><strong>Rincian dari data tersimpan</strong></div><small>Hanya dapat dilihat oleh Superadmin</small></div>';
 if(data.summary&&typeof data.summary==='object'&&!Array.isArray(data.summary)){
  html+='<div class="v4-server-metrics">'+Object.keys(data.summary).slice(0,12).map(function(k){
   var v=data.summary[k];
   if(v&&typeof v==='object')v=Object.keys(v).length+' bagian';
   return '<div><span>'+h(label(k))+'</span><b>'+h(simpleValue(v))+'</b></div>';
  }).join('')+'</div>';
 }else html+=objectMetrics(data);
 preferredCollections(data).forEach(function(x){html+=collectionHtml(x[0],x[1])});
 Object.keys(data).filter(function(k){
  var v=data[k];
  return v&&typeof v==='object'&&!Array.isArray(v)&&!['summary','lineage','sourceTruth','range','appliedScope'].includes(k);
 }).slice(0,4).forEach(function(k){
  var v=data[k], nested=objectMetrics(v);
  if(nested)html+='<section class="v4-server-section"><div class="v4-server-section-head"><strong>'+h(label(k))+'</strong><span>RINCIAN</span></div>'+nested+'</section>';
  preferredCollections(v).slice(0,2).forEach(function(x){html+=collectionHtml(label(k)+' — '+x[0],x[1])});
 });
 if(data.lineage||data.sourceTruth){
  var l=data.lineage||data.sourceTruth;
  html+='<div class="v4-server-lineage"><i class="ph-bold ph-shield-check"></i> Sumber data: '+h(typeof l==='string'?l:(Array.isArray(l)?l.map(function(v){return typeof v==='string'?v:label(v.source||v.name||'Data OMODOS')}).join(', '):Object.keys(l).map(label).join(', ')))+'</div>';
 }
 return html;
}
function serverPanel(){
 var card=document.querySelector('#v4-safe-stage .v4-detail-card');
 if(!card)return null;
 var panel=card.querySelector('#v4-server-intel');
 if(!panel){
  panel=document.createElement('section');
  panel.id='v4-server-intel';panel.className='v4-server-intel';
  var actions=card.querySelector('.v4-actions');
  var anchor=null;
  if(actions){
   if(actions.parentNode===card)anchor=actions;
   else{
    var details=actions.closest&&actions.closest('.v4-simple-details');
    if(details&&details.parentNode===card)anchor=details;
   }
  }
  if(anchor&&anchor.parentNode===card)card.insertBefore(panel,anchor);
  else card.appendChild(panel);
 }
 return panel;
}
function machinePicker(panel,action,n){
 if(!actionNeedsMachine(action,n)||n===1)return '';
 var names=machineNames();if(!names.length)return '';
 var cur=currentMachine()||names[0];
 return '<label class="v4-server-machine-label">Konteks Mesin<select data-v4-server-machine data-v4-feature-context="'+n+'">'+
  names.map(function(x){return '<option'+(x===cur?' selected':'')+'>'+h(x)+'</option>'}).join('')+
 '</select></label>';
}
async function hydrateFeature(n){
 n=Number(n);var action=FEATURE_ACTIONS[n];if(!action)return;
 var panel=serverPanel();if(!panel)return;
 var picker=machinePicker(panel,action,n);
 if(!ready()){
  panel.innerHTML=picker+'<div class="v4-server-state"><i class="ph-bold ph-cloud-slash"></i><span>Data tambahan belum dapat dimuat. Ringkasan di atas tetap bisa dilihat dari data yang tersedia.</span></div>';
  return;
 }
 if(actionNeedsMachine(action,n)&&!currentMachine()){
  panel.innerHTML='<div class="v4-server-state">Belum ada mesin yang dapat dipakai sebagai konteks server.</div>';return;
 }
 var seq=++HYDRATE_SEQ;
 panel.innerHTML=picker+'<div class="v4-server-state"><i class="ph-bold ph-spinner-gap v4-spin"></i><span>Memuat rincian dari data OMODOS…</span></div>';
 try{
  var data=await serverRead(action,payloadFor(action,n));
  if(seq!==HYDRATE_SEQ||!document.querySelector('[data-v4-feature-context="'+n+'"], #v4-server-intel'))return;
  panel=serverPanel();if(!panel)return;
  panel.innerHTML=machinePicker(panel,action,n)+serverHtml(action,projectForFeature(n,data));
 }catch(err){
  panel=serverPanel();if(!panel)return;
  panel.innerHTML=machinePicker(panel,action,n)+'<div class="v4-server-state v4-server-error"><i class="ph-bold ph-warning-circle"></i><span>Rincian tambahan belum dapat dimuat. Coba lagi nanti; ringkasan di atas masih dapat dilihat.</span></div>';
 }
}
function overviewCard(name,value,note,icon){
 return '<div class="v4-card"><div class="v4-k"><i class="ph-bold '+icon+'"></i> '+h(name)+'</div><div class="v4-v">'+h(value)+'</div><div class="v4-note">'+h(note)+'</div></div>';
}
function rowsFromServer(list,badge){
 if(!Array.isArray(list)||!list.length)return '<div class="v4-empty">Tidak ada catatan pada periode yang dipilih.</div>';
 return list.slice(0,12).map(function(x){
  var title=headline(x),sub=subline(x);
  return '<div class="v4-mp-row"><div><strong>'+h(title)+'</strong><small>'+h(x.timestamp||x.generatedAt||'SERVER Bukti data')+'</small></div><div>'+h(sub||'Catatan OMODOS')+'<div class="v4-chip-row"><span class="v4-risk-chip">'+h(badge)+'</span></div></div></div>';
 }).join('');
}
async function hydrateOverview(){
 if(!ready()||!document.getElementById('view-omodos4')||!document.getElementById('view-omodos4').classList.contains('active'))return;
 try{
  var data=await serverRead('v4.getOverview',{});
  if(!data||!data.summary)return;
  var s=data.summary,sum=document.getElementById('v4-summary');
  if(sum)sum.innerHTML=[
   overviewCard('Mesin Perlu Dicek',s.criticalMachines==null?'—':s.criticalMachines,'Berdasarkan kondisi dan masalah mesin yang tercatat.','ph-warning'),
   overviewCard('Gangguan Aktif',s.activeBreakdown==null?'—':s.activeBreakdown,'Gangguan dan perbaikan yang masih aktif.','ph-wrench'),
   overviewCard('Tanda Risiko',s.predictiveRisks==null?'—':s.predictiveRisks,'Tanda risiko yang masih perlu diperiksa.','ph-waveform'),
   overviewCard('Risiko Stok Suku Cadang',s.sparepartRisks==null?'—':s.sparepartRisks,'Stok minimum dan perkiraan kedatangan yang terlewat.','ph-package'),
   overviewCard('Target Perlu Dicek',s.kpiAtRisk==null?'—':s.kpiAtRisk,'Berdasarkan capaian target yang tersedia.','ph-target'),
   overviewCard('Tugas Penting Belum Selesai',s.openHighPriorityActions==null?'—':s.openHighPriorityActions,'Pekerjaan penting yang belum selesai.','ph-list-checks')
  ].join('');
  var look=document.getElementById('v4-look-at');
  if(look&&Array.isArray(data.thingsToLookAt))look.innerHTML=rowsFromServer(data.thingsToLookAt,'Dari data OMODOS');
  var latest=document.getElementById('v4-latest');
  if(latest&&Array.isArray(data.latestIntelligence))latest.innerHTML=rowsFromServer(data.latestIntelligence,'Dari data OMODOS');
  var hero=document.querySelector('#view-omodos4 .v4-hero');
  if(hero&&!hero.querySelector('.v4-server-overview-badge')){
   var b=document.createElement('div');b.className='v4-server-overview-badge';b.innerHTML='<i class="ph-bold ph-shield-check"></i> Data tambahan tersedia'+h(data.logicVersion||'server intelligence');
   hero.appendChild(b);
  }
 }catch(e){}
}
async function hydrateTimeMachine(){
 var input=document.getElementById('v4-time-machine-at'),out=document.getElementById('v4-time-machine-result');
 if(!input||!out||!ready())return;
 var d=new Date(input.value);if(!Number.isFinite(d.getTime()))return;
 try{
  var data=await serverRead('v4.getTimeMachine',{at:d.toISOString()});
  if(data)out.innerHTML='<section class="v4-server-intel v4-time-server">'+serverHtml('v4.getTimeMachine',data)+'</section>';
 }catch(e){
  out.insertAdjacentHTML('beforeend','<div class="v4-server-state v4-server-error">Riwayat tambahan belum dapat dimuat. Ringkasan di atas tetap tersedia.</div>');
 }
}
document.addEventListener('click',function(e){
 var feature=e.target.closest&&e.target.closest('[data-v4-feature]');
 if(feature){var n=Number(feature.getAttribute('data-v4-feature'));setTimeout(function(){hydrateFeature(n)},0);return}
 if(e.target.closest&&e.target.closest('#v4-nav-group [data-v4-root]')){setTimeout(hydrateOverview,0);return}
 if(e.target.closest&&e.target.closest('[data-v4-time-machine-run]')){setTimeout(hydrateTimeMachine,0);return}
},false);
document.addEventListener('change',function(e){
 if(e.target&&e.target.matches('[data-v4-server-machine]')){
  var n=Number(e.target.getAttribute('data-v4-feature-context'));setTimeout(function(){hydrateFeature(n)},0);
 }else if(e.target&&e.target.id==='v4-machine-select'){setTimeout(function(){hydrateFeature(1)},0)}
},false);

var baseRender=window.renderOmodos4;
if(typeof baseRender==='function'&&!baseRender.__v4ServerBridge){
 var wrapped=function(){var out=baseRender.apply(this,arguments);setTimeout(hydrateOverview,0);return out};
 wrapped.__v4ServerBridge=true;window.renderOmodos4=wrapped;
}
window.OMODOS4=Object.assign(window.OMODOS4||{},{
 serverBridgeVersion:'1',
 serverRead:serverRead,
 serverReady:ready,
 serverActionForFeature:function(n){return FEATURE_ACTIONS[Number(n)]||''},
 serverProjectionForFeature:function(n){return (FEATURE_PATHS[Number(n)]||[]).slice()},
 serverReadActions:Array.from(READ_ACTIONS)
});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(hydrateOverview,900)});
else setTimeout(hydrateOverview,900);
})();

/* OMODOS4_INTERACTIONS_V1
   Restores explicit master-prompt interactions on top of the read-only intelligence layer.
   Operational source-of-truth modules are never written by these controls. */
(function(){
'use strict';

var AI_CONFIG={
 71:{purpose:'ask',title:'Ask OMODOS 4.0',placeholder:'Contoh: Apa yang paling perlu diperhatikan hari ini?',defaultText:''},
 72:{purpose:'machine',title:'Machine Copilot',placeholder:'Tanyakan kondisi, pola, risiko, atau histori mesin.',defaultText:'Jelaskan kondisi mesin ini, pola masalah, risiko yang perlu diperiksa, dan evidence yang mendukung.'},
 73:{purpose:'shift',title:'Shift Copilot',placeholder:'Buat handover shift berdasarkan data OMODOS.',defaultText:'Buat brief handover shift: perubahan penting, open issue, risiko, dan tindakan yang perlu diteruskan.'},
 74:{purpose:'morning-brief',title:'Morning Maintenance Brief',placeholder:'Buat brief maintenance pagi.',defaultText:'Buat Morning Maintenance Brief yang ringkas, evidence-first, dan prioritaskan hal yang perlu ditindaklanjuti.'},
 75:{purpose:'rca-draft',title:'Auto RCA Draft',placeholder:'Tuliskan problem/symptom untuk membuat draft RCA.',defaultText:''},
 76:{purpose:'troubleshooting',title:'Troubleshooting Similarity Search',placeholder:'Tuliskan symptom atau problem yang sedang dihadapi.',defaultText:''},
 77:{purpose:'manual',title:'Manual Whisperer',placeholder:'Tanyakan hal yang ingin dipahami dari manual/knowledge yang tersedia.',defaultText:''},
 79:{purpose:'translate',title:'Maintenance Translator',placeholder:'Masukkan istilah/kalimat maintenance yang perlu dinormalisasi atau diterjemahkan.',defaultText:''},
 80:{purpose:'skeptic',title:'AI Skeptic Mode',placeholder:'Tuliskan asumsi/diagnosis yang ingin diuji secara kritis.',defaultText:''},
 82:{purpose:'kaizen-draft',title:'Auto Kaizen Draft',placeholder:'Tuliskan masalah atau opportunity yang ingin dibuatkan draft Kaizen.',defaultText:''}
};
var LAST_SCENARIO=null;

function x(v){
 return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]});
}
function localQa(){try{return /^(localhost|127\.0\.0\.1|0\.0\.0\.0)$/.test(location.hostname)}catch(e){return false}}
function allowed(){
 try{return !!(window.OMODOS4&&typeof window.OMODOS4.isAllowed==='function'&&window.OMODOS4.isAllowed())}catch(e){return false}
}
function token(){
 try{
  if(typeof SETTING_AUTH_OK!=='undefined'&&SETTING_AUTH_OK&&typeof SETTING_SESSION_TOKEN!=='undefined'&&SETTING_SESSION_TOKEN)return SETTING_SESSION_TOKEN;
  return typeof SESSION_TOKEN!=='undefined'?SESSION_TOKEN:'';
 }catch(e){return ''}
}
function actionReady(){
 try{return allowed()&&!localQa()&&typeof WEB_APP_URL!=='undefined'&&!!WEB_APP_URL&&!!token()&&typeof fetch==='function'}catch(e){return false}
}
function errText(json){
 var e=json&&json.error;
 return typeof e==='string'?e:(e&&e.message)||'Request OMODOS 4.0 gagal';
}
async function v4Action(action,payload){
 if(!actionReady())throw new Error('Daftar belum dapat dimuat. Coba lagi setelah masuk kembali.');
 var body=Object.assign({},payload||{},{action:action,sessionToken:token()});
 var opts={method:'POST',mode:'cors',credentials:'omit',redirect:'follow',cache:'no-store',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(body)};
 var res=typeof fetchWithTimeout_==='function'?await fetchWithTimeout_(WEB_APP_URL,opts,60000):await fetch(WEB_APP_URL,opts);
 var json=typeof parseApiResponse_==='function'?await parseApiResponse_(res):await res.json();
 if(!json||json.ok!==true)throw new Error(errText(json));
 return json.data;
}
function tx(){
 try{if(crypto&&typeof crypto.randomUUID==='function')return crypto.randomUUID()}catch(e){}
 return 'v4-'+Date.now()+'-'+Math.random().toString(36).slice(2,12);
}
function featureOpen(n){
 var no=document.querySelector('#v4-safe-stage .v4-feature-no');
 return !!no&&parseInt(no.textContent,10)===Number(n);
}
function bodyHost(){
 return document.querySelector('#v4-safe-stage .v4-detail-card .v4-detail-body');
}
function machineNames(){
 var set=new Set();
 try{(Array.isArray(MACHINES)?MACHINES:[]).forEach(function(m){var n=m['Nama Mesin']||m.namaMesin||m['Kode Mesin']||m.kodeMesin;if(n)set.add(String(n))})}catch(e){}
 try{(Array.isArray(ENTRIES)?ENTRIES:[]).forEach(function(m){var n=m['Nama Mesin']||m.namaMesin||m['Kode Mesin']||m.kodeMesin;if(n)set.add(String(n))})}catch(e){}
 return Array.from(set).sort(function(a,b){return a.localeCompare(b,'id')});
}
function peopleNames(){
 var set=new Set();
 try{(Array.isArray(PI_PERSONNEL_MASTER)?PI_PERSONNEL_MASTER:[]).forEach(function(p){var n=p.Nama||p['Nama Karyawan']||p['Nama Personil'];if(n)set.add(String(n))})}catch(e){}
 try{(Array.isArray(PERSONIL)?PERSONIL:[]).forEach(function(p){var n=p.Nama||p['Nama Karyawan']||p['Nama Personil'];if(n)set.add(String(n))})}catch(e){}
 return Array.from(set).sort(function(a,b){return a.localeCompare(b,'id')});
}
function options(list,blank){
 var html=blank?'<option value="">'+x(blank)+'</option>':'';
 return html+list.map(function(v){return '<option value="'+x(v)+'">'+x(v)+'</option>'}).join('');
}
function note(text,kind){
 return '<div class="v4-interaction-note '+(kind||'')+'"><i class="ph-bold ph-info"></i><span>'+x(text)+'</span></div>';
}
function busy(btn,on,label){
 if(!btn)return;
 if(on){btn.dataset.oldText=btn.innerHTML;btn.disabled=true;btn.innerHTML='<i class="ph-bold ph-spinner-gap v4-spin"></i> '+x(label||'Memproses…')}
 else{btn.disabled=false;if(btn.dataset.oldText)btn.innerHTML=btn.dataset.oldText}
}
function plain(v){
 if(v==null)return '';
 if(typeof v==='string'||typeof v==='number'||typeof v==='boolean')return String(v);
 try{return JSON.stringify(v)}catch(e){return String(v)}
}
function firstText(o,keys){
 if(!o||typeof o!=='object')return '';
 for(var i=0;i<keys.length;i++){var v=o[keys[i]];if(v!=null&&String(v).trim())return String(v)}
 return '';
}
function evidenceTitle(e){
 if(!e||typeof e!=='object')return plain(e);
 var r=e.record&&typeof e.record==='object'?e.record:e;
 return firstText(r,['Nama Mesin','namaMesin','Machine','Mesin','Title','Judul','Problem','Deskripsi Masalah','Deskripsi','description','Nama Material','Nama','ID'])||firstText(e,['machine','title','problem','description','sheet'])||'Evidence';
}
function resultCards(arr){
 if(!Array.isArray(arr)||!arr.length)return '<div class="v4-empty">Tidak ada evidence tambahan.</div>';
 return '<div class="v4-interaction-evidence">'+arr.slice(0,12).map(function(e){
  var src=firstText(e,['sheet','source','type','label'])||'OMODOS';
  var score=e&&e.score!=null?' • score '+Math.round(Number(e.score)*100)/100:'';
  return '<div class="v4-interaction-evidence-card"><strong>'+x(evidenceTitle(e))+'</strong><small>'+x(src+score)+'</small></div>';
 }).join('')+'</div>';
}
function aiResultHtml(data){
 data=data||{};
 var summary=firstText(data,['summary','answer'])||'Tidak ada ringkasan.';
 var assumptions=Array.isArray(data.assumptions)?data.assumptions:[];
 return '<div class="v4-ai-result">'+
  '<div class="v4-interaction-result-head"><span class="v4-server-badge">'+x(data.mode||'OMODOS AI')+'</span><span>Tingkat keyakinan: '+x(data.confidence||'belum tersedia')+'</span></div>'+
  '<div class="v4-ai-answer">'+x(summary).replace(/\n/g,'<br>')+'</div>'+
  (assumptions.length?'<div class="v4-assumptions"><strong>Asumsi</strong><ul>'+assumptions.slice(0,8).map(function(a){return '<li>'+x(a)+'</li>'}).join('')+'</ul></div>':'')+
  resultCards(data.evidence)+
  note('Periksa oleh petugas wajib. Output AI adalah decision support; tidak ada perubahan data operasional otomatis.','safe')+
 '</div>';
}
function mountAi(n){
 var cfg=AI_CONFIG[n],host=bodyHost();if(!cfg||!host||!featureOpen(n))return;
 var old=host.querySelector('.v4-interaction');if(old)old.remove();
 var machines=machineNames(),needMachine=n===72;
 var machineField='<label>Mesin '+(needMachine?'<b>*</b>':'(opsional)')+'<select data-v4-ai-machine>'+options(machines,needMachine?'Pilih mesin':'Semua mesin')+'</select></label>';
 var sec=document.createElement('section');sec.className='v4-interaction v4-ai-interaction';sec.setAttribute('data-v4-interaction-feature',n);
 sec.innerHTML='<div class="v4-interaction-head"><div><span class="v4-eyebrow">INTERACTIVE • Bukti data-FIRST</span><h3>'+x(cfg.title)+'</h3></div><span class="v4-no-write">Tidak menyimpan otomatis</span></div>'+
  '<div class="v4-form-grid">'+machineField+
  '<label class="v4-form-wide">Pertanyaan / konteks<textarea data-v4-ai-query rows="4" placeholder="'+x(cfg.placeholder)+'">'+x(cfg.defaultText)+'</textarea></label></div>'+
  '<div class="v4-interaction-actions"><button class="btn btn-primary btn-sm" data-v4-ai-run="'+n+'"><i class="ph-bold ph-sparkle"></i> Analisis dengan OMODOS 4.0</button></div>'+
  '<div data-v4-ai-output>'+note('Analisis hanya dijalankan setelah Anda memilih tombol. Evidence diambil dari source OMODOS existing.','safe')+'</div>';
 host.prepend(sec);
}
async function runAi(btn,n){
 var sec=btn.closest('.v4-interaction'),q=sec.querySelector('[data-v4-ai-query]').value.trim(),m=sec.querySelector('[data-v4-ai-machine]').value;
 var cfg=AI_CONFIG[n],out=sec.querySelector('[data-v4-ai-output]');
 if(!q){out.innerHTML=note('Isi pertanyaan/konteks terlebih dahulu.','warn');return}
 if(n===72&&!m){out.innerHTML=note('Machine Copilot wajib memakai satu mesin yang dipilih agar konteks tidak bercampur.','warn');return}
 busy(btn,true,'Menganalisis');
 out.innerHTML=note('Menghubungkan pertanyaan dengan evidence internal…','safe');
 try{
  var data=await v4Action('v4.aiAsk',{query:q,purpose:cfg.purpose,machine:m||''});
  out.innerHTML=aiResultHtml(data);
 }catch(e){out.innerHTML=note(e.message||String(e),'error')}
 finally{busy(btn,false)}
}
function mountKnowledgeHarvest(n){
 var host=bodyHost();if(!host||!featureOpen(n))return;
 var old=host.querySelector('.v4-interaction');if(old)old.remove();
 var sec=document.createElement('section');sec.className='v4-interaction';sec.setAttribute('data-v4-interaction-feature',n);
 sec.innerHTML='<div class="v4-interaction-head"><div><span class="v4-eyebrow">KNOWLEDGE HARVEST</span><h3>Review Kandidat Knowledge</h3></div><span class="v4-no-write">REVIEW ONLY</span></div>'+
 note('OMODOS mencari solusi berulang dan RCA existing. Tidak ada artikel Knowledge Base yang dibuat otomatis.','safe')+
 '<div class="v4-interaction-actions"><button class="btn btn-primary btn-sm" data-v4-harvest-refresh><i class="ph-bold ph-arrows-clockwise"></i> Muat Kandidat</button></div><div data-v4-harvest-output></div>';
 host.prepend(sec);
}
async function runHarvest(btn){
 var sec=btn.closest('.v4-interaction'),out=sec.querySelector('[data-v4-harvest-output]');busy(btn,true,'Memuat');
 try{
  var d=await v4Action('v4.getKnowledgeCandidates',{});
  out.innerHTML='<div class="v4-interaction-result-head"><span>'+(Array.isArray(d.candidates)?d.candidates.length:0)+' kandidat</span><span>Artikel yang ada: '+x(d.existingKnowledgeRecords==null?'—':d.existingKnowledgeRecords)+'</span></div>'+resultCards(d.candidates)+note(d.note||'Review kandidat sebelum menggunakan modul Knowledge Base existing.','safe');
 }catch(e){out.innerHTML=note(e.message||String(e),'error')}
 finally{busy(btn,false)}
}
function mountExpert(){
 var host=bodyHost();if(!host||!featureOpen(63))return;
 var old=host.querySelector('.v4-interaction');if(old)old.remove();
 var sec=document.createElement('section');sec.className='v4-interaction';sec.setAttribute('data-v4-interaction-feature','63');
 sec.innerHTML='<div class="v4-interaction-head"><div><span class="v4-eyebrow">EXPERT FINDER</span><h3>Cari berdasarkan evidence keterlibatan</h3></div></div>'+
 '<div class="v4-form-grid"><label>Mesin<select data-v4-expert-machine>'+options(machineNames(),'Semua mesin')+'</select></label><label class="v4-form-wide">Problem / symptom<input data-v4-expert-query placeholder="Opsional: deskripsikan problem yang relevan"></label></div>'+
 '<div class="v4-interaction-actions"><button class="btn btn-primary btn-sm" data-v4-expert-run><i class="ph-bold ph-magnifying-glass"></i> Cari Expert</button></div><div data-v4-expert-output>'+note('Ranking mencerminkan evidence keterlibatan OMODOS, bukan penilaian kinerja karyawan.','safe')+'</div>';
 host.prepend(sec);
}
async function runExpert(btn){
 var sec=btn.closest('.v4-interaction'),out=sec.querySelector('[data-v4-expert-output]'),machine=sec.querySelector('[data-v4-expert-machine]').value,query=sec.querySelector('[data-v4-expert-query]').value.trim();
 busy(btn,true,'Mencari');
 try{var d=await v4Action('v4.getExpertFinder',{machine:machine,query:query});out.innerHTML=resultCards(d.experts)+note(d.note||'Human validation required.','safe')}
 catch(e){out.innerHTML=note(e.message||String(e),'error')}finally{busy(btn,false)}
}
function mountExperience(){
 var host=bodyHost();if(!host||!featureOpen(64))return;
 var old=host.querySelector('.v4-interaction');if(old)old.remove();
 var sec=document.createElement('section');sec.className='v4-interaction';sec.setAttribute('data-v4-interaction-feature','64');
 sec.innerHTML='<div class="v4-interaction-head"><div><span class="v4-eyebrow">EXPERIENCE PASSPORT</span><h3>Pilih personil</h3></div></div>'+
 '<div class="v4-form-grid"><label>Personil<select data-v4-exp-person>'+options(peopleNames(),'Pilih personil')+'</select></label></div>'+
 '<div class="v4-interaction-actions"><button class="btn btn-primary btn-sm" data-v4-exp-run><i class="ph-bold ph-identification-card"></i> Buka Experience Passport</button></div><div data-v4-exp-output></div>';
 host.prepend(sec);
}
function objectList(obj){
 if(!obj||typeof obj!=='object')return '<div class="v4-empty">Belum tersedia</div>';
 var rows=[];
 Object.keys(obj).forEach(function(k){var v=obj[k];if(v==null)return;if(typeof v==='string'||typeof v==='number'||typeof v==='boolean')rows.push([k,String(v)])});
 return '<div class="v4-kv-stack">'+rows.slice(0,30).map(function(r){return '<div><span>'+x(r[0].replace(/([a-z])([A-Z])/g,'$1 $2'))+'</span><b>'+x(r[1])+'</b></div>'}).join('')+'</div>';
}
async function runExperience(btn){
 var sec=btn.closest('.v4-interaction'),out=sec.querySelector('[data-v4-exp-output]'),name=sec.querySelector('[data-v4-exp-person]').value;
 if(!name){out.innerHTML=note('Pilih personil terlebih dahulu.','warn');return}
 busy(btn,true,'Memuat');
 try{var d=await v4Action('v4.getExperiencePassport',{name:name});out.innerHTML=objectList(d)+note('Passport ini DERIVED dari People dan histori kerja existing; bukan penilaian performa.','safe')}
 catch(e){out.innerHTML=note(e.message||String(e),'error')}finally{busy(btn,false)}
}
function scenarioParams(sec){
 function n(sel){var v=Number(sec.querySelector(sel).value);return Number.isFinite(v)?Math.max(0,Math.min(100,v)):0}
 return {downtimeReductionPct:n('[data-v4-s-downtime]'),recurringReductionPct:n('[data-v4-s-recurring]'),stockRiskReductionPct:n('[data-v4-s-stock]'),actionClosurePct:n('[data-v4-s-action]')};
}
function mountScenario(){
 var host=bodyHost();if(!host||!featureOpen(97))return;
 var old=host.querySelector('.v4-interaction');if(old)old.remove();
 LAST_SCENARIO=null;
 var sec=document.createElement('section');sec.className='v4-interaction v4-scenario';sec.setAttribute('data-v4-interaction-feature','97');
 sec.innerHTML='<div class="v4-interaction-head"><div><span class="v4-eyebrow">SCENARIO SIMULATOR</span><h3>What-if simulation</h3></div><span class="v4-no-write">NOT A PREDICTION</span></div>'+
 note('Masukkan asumsi perubahan. Simulasi tidak mengubah KPI, Logbook, stok, atau data operasional existing.','safe')+
 '<div class="v4-slider-grid">'+
  '<label>Pengurangan waktu mesin berhenti (%)<input type="number" min="0" max="100" value="0" data-v4-s-downtime></label>'+
  '<label>Pengurangan masalah berulang (%)<input type="number" min="0" max="100" value="0" data-v4-s-recurring></label>'+
  '<label>Pengurangan risiko stok habis (%)<input type="number" min="0" max="100" value="0" data-v4-s-stock></label>'+
  '<label>Action closure %<input type="number" min="0" max="100" value="0" data-v4-s-action></label>'+
 '</div><div class="v4-interaction-actions"><button class="btn btn-primary btn-sm" data-v4-s-run><i class="ph-bold ph-play"></i> Jalankan Simulasi</button></div>'+
 '<div data-v4-s-output></div>'+
 '<div class="v4-save-box"><label>Nama skenario<input data-v4-s-name maxlength="200" placeholder="Contoh: Skenario PM Q4"></label><button class="btn btn-sm" data-v4-s-save disabled><i class="ph-bold ph-floppy-disk"></i> Simpan ke V4 Scenario</button><small>Save hanya menulis state simulasi terisolasi V4.</small></div><div data-v4-s-save-output></div>';
 host.prepend(sec);
}
function scenarioHtml(d){
 var base=d&&d.baseline||{},proj=d&&d.projected||{};
 var keys=['downtimeMinutes','recurringPatterns','sparepartRisks','openHighPriorityActions'];
 return '<div class="v4-scenario-result"><div class="v4-compare-head"><span>Metric</span><span>Baseline</span><span>Scenario</span></div>'+
 keys.map(function(k){return '<div class="v4-compare-row"><strong>'+x(k.replace(/([a-z])([A-Z])/g,'$1 $2'))+'</strong><span>'+x(base[k]==null?'—':base[k])+'</span><b>'+x(proj[k]==null?'—':proj[k])+'</b></div>'}).join('')+
 '</div>'+note((d.assumptions||[]).join(' • ')||'Scenario uses user assumptions.','safe');
}
async function runScenario(btn){
 var sec=btn.closest('.v4-interaction'),out=sec.querySelector('[data-v4-s-output]'),save=sec.querySelector('[data-v4-s-save]'),params=scenarioParams(sec);
 busy(btn,true,'Mensimulasikan');save.disabled=true;
 try{
  var d=await v4Action('v4.runScenario',params);LAST_SCENARIO={params:params,result:d};out.innerHTML=scenarioHtml(d);save.disabled=false;
 }catch(e){LAST_SCENARIO=null;out.innerHTML=note(e.message||String(e),'error')}
 finally{busy(btn,false)}
}
async function saveScenario(btn){
 var sec=btn.closest('.v4-interaction'),out=sec.querySelector('[data-v4-s-save-output]'),name=sec.querySelector('[data-v4-s-name]').value.trim();
 if(!LAST_SCENARIO){out.innerHTML=note('Jalankan simulasi terlebih dahulu.','warn');return}
 if(!name){out.innerHTML=note('Isi nama skenario terlebih dahulu.','warn');return}
 busy(btn,true,'Menyimpan');
 try{
  var d=await v4Action('v4.saveScenario',Object.assign({name:name,transactionId:tx()},LAST_SCENARIO.params));
  out.innerHTML=note('Skenario tersimpan di storage V4 terisolasi. ID: '+(d.id||'recorded')+'. Data operasional existing tidak berubah.','safe');
 }catch(e){out.innerHTML=note(e.message||String(e),'error')}finally{busy(btn,false)}
}
function mountWarRoom(){
 var host=bodyHost();if(!host||!featureOpen(98))return;
 var old=host.querySelector('.v4-interaction');if(old)old.remove();
 var sec=document.createElement('section');sec.className='v4-interaction v4-war-interaction';sec.setAttribute('data-v4-interaction-feature','98');
 sec.innerHTML='<div class="v4-interaction-head"><div><span class="v4-eyebrow">MAINTENANCE WAR ROOM</span><h3>User-triggered coordination</h3></div><span class="v4-no-write">ISOLATED V4 STATE</span></div>'+
 note('Membuat War Room tidak mengubah Logbook lama. Hanya state koordinasi V4_War_Room / Event yang ditulis.','safe')+
 '<details class="v4-war-create"><summary><i class="ph-bold ph-plus-circle"></i> Buat War Room Baru</summary><div class="v4-form-grid">'+
  '<label>Mesin *<select data-v4-war-machine>'+options(machineNames(),'Pilih mesin')+'</select></label>'+
  '<label>Tingkat masalah<select data-v4-war-severity><option value="P0">P0 – paling mendesak</option><option value="P1" selected>P1 – mendesak</option><option value="P2">P2 – sedang</option><option value="P3">P3 – rendah</option></select></label>'+
  '<label>Judul *<input data-v4-war-title maxlength="200" placeholder="Masalah utama"></label>'+
  '<label>Penanggung jawab<input data-v4-war-owner maxlength="160" placeholder="Nama penanggung jawab"></label>'+
  '<label>Periksa lagi pada<input type="datetime-local" data-v4-war-checkpoint></label>'+
  '<label class="v4-form-wide">Ringkasan<textarea rows="3" data-v4-war-summary maxlength="4000"></textarea></label>'+
 '</div><div class="v4-interaction-actions"><button class="btn btn-primary btn-sm" data-v4-war-create><i class="ph-bold ph-siren"></i> Buat War Room</button></div><div data-v4-war-create-output></div></details>'+
 '<div class="v4-war-columns"><div><div class="v4-interaction-subhead"><strong>Ruang Koordinasi yang Ada</strong><button class="btn btn-sm" data-v4-war-refresh><i class="ph-bold ph-arrows-clockwise"></i> Muat Ulang</button></div><div data-v4-war-list></div></div><div><div class="v4-interaction-subhead"><strong>Rincian dan Perkembangan</strong></div><div data-v4-war-detail>'+note('Pilih ruang koordinasi untuk melihat rinciannya.','safe')+'</div></div></div>';
 host.prepend(sec);
 if(actionReady())refreshWarList(sec);
 else sec.querySelector('[data-v4-war-list]').innerHTML=note('Daftar belum dapat dimuat. Coba lagi setelah masuk kembali.','warn');
}
function warId(r){return firstText(r,['ID','id','WarRoomID','warRoomId'])}
function warTitle(r){return firstText(r,['Title','title'])||'War Room'}
async function refreshWarList(sec,selectId){
 var out=sec.querySelector('[data-v4-war-list]');out.innerHTML=note('Memuat War Room…','safe');
 try{
  var d=await v4Action('v4.getWarRoom',{}),wars=Array.isArray(d.wars)?d.wars:[];
  out.innerHTML=wars.length?'<div class="v4-war-list">'+wars.map(function(w){
   var id=warId(w),status=firstText(w,['Status','status'])||'';
   return '<button type="button" class="v4-war-item" data-v4-war-open="'+x(id)+'"><strong>'+x(warTitle(w))+'</strong><span>'+x(firstText(w,['Machine','machine'])||'')+'</span><small>'+x(status)+'</small></button>';
  }).join('')+'</div>':'<div class="v4-empty">Belum ada War Room.</div>';
  if(selectId)loadWar(sec,selectId);
 }catch(e){out.innerHTML=note(e.message||String(e),'error')}
}
async function createWar(btn){
 var sec=btn.closest('.v4-interaction'),out=sec.querySelector('[data-v4-war-create-output]');
 var machine=sec.querySelector('[data-v4-war-machine]').value,title=sec.querySelector('[data-v4-war-title]').value.trim();
 if(!machine||!title){out.innerHTML=note('Mesin dan judul wajib diisi.','warn');return}
 var payload={machine:machine,title:title,severity:sec.querySelector('[data-v4-war-severity]').value,owner:sec.querySelector('[data-v4-war-owner]').value.trim(),nextCheckpoint:sec.querySelector('[data-v4-war-checkpoint]').value||'',summary:sec.querySelector('[data-v4-war-summary]').value.trim(),transactionId:tx()};
 busy(btn,true,'Membuat');
 try{
  var d=await v4Action('v4.createWarRoom',payload);out.innerHTML=note('Ruang koordinasi dibuat. Catatan pekerjaan tetap seperti semula.','safe');refreshWarList(sec,d.id);
 }catch(e){out.innerHTML=note(e.message||String(e),'error')}finally{busy(btn,false)}
}
function contextBlock(ctx){
 if(!ctx||typeof ctx!=='object')return '';
 var sections=[];
 ['openIssues','experts','similarCases','candidateRootCauseEvidence','rca','knowledge','manuals','decisions','actions'].forEach(function(k){
  if(Array.isArray(ctx[k])&&ctx[k].length)sections.push('<div class="v4-war-context-section"><strong>'+x(k.replace(/([a-z])([A-Z])/g,'$1 $2'))+'</strong>'+resultCards(ctx[k])+'</div>');
 });
 return sections.join('');
}
async function loadWar(sec,id){
 var out=sec.querySelector('[data-v4-war-detail]');out.innerHTML=note('Memuat context War Room…','safe');
 try{
  var d=await v4Action('v4.getWarRoom',{id:id});
  if(!d.war){out.innerHTML=note('War Room tidak ditemukan.','warn');return}
  var w=d.war,status=firstText(w,['Status','status'])||'OPEN',owner=firstText(w,['Owner','owner']),checkpoint=firstText(w,['NextCheckpoint','nextCheckpoint']),summary=firstText(w,['Summary','summary']);
  out.innerHTML='<div class="v4-war-detail-card"><h4>'+x(warTitle(w))+'</h4><div class="v4-kv-stack"><div><span>Mesin</span><b>'+x(firstText(w,['Machine','machine']))+'</b></div><div><span>Tingkat masalah</span><b>'+x(firstText(w,['Severity','severity']))+'</b></div><div><span>Status</span><b>'+x(status)+'</b></div></div>'+
   contextBlock(d.context)+
   '<div class="v4-war-update"><h4>Catat Perkembangan</h4><div class="v4-form-grid">'+
    '<label>Status<select data-v4-war-u-status><option value="OPEN"'+(status==='OPEN'?' selected':'')+'>Terbuka</option><option value="MONITORING"'+(status==='MONITORING'?' selected':'')+'>Dipantau</option><option value="CLOSED"'+(status==='CLOSED'?' selected':'')+'>Selesai</option></select></label>'+
    '<label>Jenis catatan<select data-v4-war-u-type><option value="update">Perkembangan</option><option value="decision">Keputusan</option><option value="action">Tindakan</option><option value="checkpoint">Waktu pemeriksaan berikutnya</option><option value="state-change">Perubahan status</option></select></label>'+
    '<label>Penanggung jawab<input data-v4-war-u-owner maxlength="160" value="'+x(owner)+'"></label>'+
    '<label>Periksa lagi pada<input data-v4-war-u-checkpoint maxlength="200" value="'+x(checkpoint)+'"></label>'+
    '<label class="v4-form-wide">Ringkasan<textarea rows="3" data-v4-war-u-summary maxlength="4000">'+x(summary)+'</textarea></label>'+
    '<label class="v4-form-wide">Catatan / keputusan / tindakan<textarea rows="3" data-v4-war-u-message maxlength="4000"></textarea></label>'+
   '</div><div class="v4-interaction-actions"><button class="btn btn-primary btn-sm" data-v4-war-update="'+x(id)+'"><i class="ph-bold ph-check"></i> Simpan Update War Room</button></div><div data-v4-war-update-output></div></div></div>'+
   note(d.disclaimer||'Dugaan penyebab perlu diperiksa oleh petugas.','safe');
 }catch(e){out.innerHTML=note(e.message||String(e),'error')}
}
async function updateWar(btn,id){
 var sec=btn.closest('.v4-interaction'),out=sec.querySelector('[data-v4-war-update-output]');
 var payload={id:id,status:sec.querySelector('[data-v4-war-u-status]').value,type:sec.querySelector('[data-v4-war-u-type]').value,owner:sec.querySelector('[data-v4-war-u-owner]').value.trim(),nextCheckpoint:sec.querySelector('[data-v4-war-u-checkpoint]').value.trim(),summary:sec.querySelector('[data-v4-war-u-summary]').value.trim(),message:sec.querySelector('[data-v4-war-u-message]').value.trim(),transactionId:tx()};
 busy(btn,true,'Menyimpan');
 try{await v4Action('v4.updateWarRoom',payload);out.innerHTML=note('Update tersimpan di event log War Room V4.','safe');await loadWar(sec,id)}
 catch(e){out.innerHTML=note(e.message||String(e),'error')}finally{busy(btn,false)}
}
function mountFor(n){
 n=Number(n);
 if(AI_CONFIG[n])mountAi(n);
 else if(n===78)mountKnowledgeHarvest(n);
 else if(n===63)mountExpert();
 else if(n===64)mountExperience();
 else if(n===97)mountScenario();
 else if(n===98)mountWarRoom();
}
document.addEventListener('click',function(e){
 var tile=e.target.closest&&e.target.closest('[data-v4-feature]');
 if(tile){var n=Number(tile.getAttribute('data-v4-feature'));setTimeout(function(){if(featureOpen(n))mountFor(n)},0);return}
 var ai=e.target.closest&&e.target.closest('[data-v4-ai-run]');if(ai){e.preventDefault();runAi(ai,Number(ai.getAttribute('data-v4-ai-run')));return}
 var hr=e.target.closest&&e.target.closest('[data-v4-harvest-refresh]');if(hr){e.preventDefault();runHarvest(hr);return}
 var er=e.target.closest&&e.target.closest('[data-v4-expert-run]');if(er){e.preventDefault();runExpert(er);return}
 var xp=e.target.closest&&e.target.closest('[data-v4-exp-run]');if(xp){e.preventDefault();runExperience(xp);return}
 var sr=e.target.closest&&e.target.closest('[data-v4-s-run]');if(sr){e.preventDefault();runScenario(sr);return}
 var ss=e.target.closest&&e.target.closest('[data-v4-s-save]');if(ss){e.preventDefault();saveScenario(ss);return}
 var wc=e.target.closest&&e.target.closest('[data-v4-war-create]');if(wc){e.preventDefault();createWar(wc);return}
 var wr=e.target.closest&&e.target.closest('[data-v4-war-refresh]');if(wr){e.preventDefault();refreshWarList(wr.closest('.v4-interaction'));return}
 var wo=e.target.closest&&e.target.closest('[data-v4-war-open]');if(wo){e.preventDefault();loadWar(wo.closest('.v4-interaction'),wo.getAttribute('data-v4-war-open'));return}
 var wu=e.target.closest&&e.target.closest('[data-v4-war-update]');if(wu){e.preventDefault();updateWar(wu,wu.getAttribute('data-v4-war-update'));return}
},false);

window.OMODOS4=Object.assign(window.OMODOS4||{},{
 interactionsVersion:'1',
 interactionFeatures:Object.keys(AI_CONFIG).map(Number).concat([63,64,78,97,98]),
 actionReady:actionReady,
 interactiveAction:v4Action
});
})();

/* OMODOS4_SMART_FIELD_V1
   Progressive-enhancement Smart Field tools.
   Voice / QR / NFC are enabled only when the browser exposes a safe native API.
   All paths end in existing Logbook/Patrol workflows; no duplicate source-of-truth is created. */
(function(){
'use strict';

var SF_QR_STREAM=null;
var SF_QR_RAF=0;
var SF_NFC_ABORT=null;
var SF_SPEECH=null;
var SF_LAST_MACHINE='';

function e(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function openN(n){
 var el=document.querySelector('#v4-safe-stage .v4-feature-no');
 return !!el&&parseInt(el.textContent,10)===Number(n);
}
function host(){return document.querySelector('#v4-safe-stage .v4-detail-card .v4-detail-body')}
function info(t,kind){
 return '<div class="v4-interaction-note '+(kind||'')+'"><i class="ph-bold ph-info"></i><span>'+e(t)+'</span></div>';
}
function names(){
 var set=new Set();
 try{(Array.isArray(MACHINES)?MACHINES:[]).forEach(function(m){var n=m['Nama Mesin']||m.namaMesin||m['Kode Mesin']||m.kodeMesin;if(n)set.add(String(n))})}catch(err){}
 try{(Array.isArray(ENTRIES)?ENTRIES:[]).forEach(function(m){var n=m['Nama Mesin']||m.namaMesin||m['Kode Mesin']||m.kodeMesin;if(n)set.add(String(n))})}catch(err){}
 return Array.from(set).sort(function(a,b){return a.localeCompare(b,'id')});
}
function opts(blank){
 var o=blank?'<option value="">'+e(blank)+'</option>':'';
 return o+names().map(function(n){return '<option value="'+e(n)+'">'+e(n)+'</option>'}).join('');
}
function norm(v){return String(v||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim()}
function findMachine(raw){
 var value=String(raw||'').trim();
 if(!value)return '';
 try{
  var obj=JSON.parse(value);
  value=obj.machine||obj.machineCode||obj.kodeMesin||obj.kode||obj.name||obj.namaMesin||value;
 }catch(err){}
 try{
  var u=new URL(value,location.href),q=u.searchParams.get('machine')||u.searchParams.get('machineCode')||u.searchParams.get('kode')||u.searchParams.get('kodeMesin');
  if(q)value=q;
 }catch(err){}
 var n=norm(value),list=names();
 var exact=list.find(function(x){return norm(x)===n});
 if(exact)return exact;
 return list.find(function(x){var a=norm(x);return a&&n&&(n.includes(a)||a.includes(n))})||'';
}
function stopQr(){
 if(SF_QR_RAF){cancelAnimationFrame(SF_QR_RAF);SF_QR_RAF=0}
 if(SF_QR_STREAM){try{SF_QR_STREAM.getTracks().forEach(function(t){t.stop()})}catch(err){}SF_QR_STREAM=null}
}
function stopNfc(){if(SF_NFC_ABORT){try{SF_NFC_ABORT.abort()}catch(err){}SF_NFC_ABORT=null}}
function stopSpeech(){if(SF_SPEECH){try{SF_SPEECH.stop()}catch(err){}SF_SPEECH=null}}
function stopSensors(){stopQr();stopNfc();stopSpeech()}
function navigate(route){
 try{
  if(typeof window.switchToView==='function'){window.switchToView(route);return true}
  if(typeof window.goToView==='function'){return window.goToView(route)!==false}
  if(typeof switchToView==='function'){switchToView(route);return true}
  if(typeof goToView==='function'){return goToView(route)!==false}
 }catch(err){}
 var b=document.querySelector('.nav-btn[data-view="'+route+'"],.bottom-nav-btn[data-view="'+route+'"]');
 if(b){b.click();return true}
 return false;
}
function findMachineRecord(name){
 var n=norm(name),row=null;
 try{row=(Array.isArray(MACHINES)?MACHINES:[]).find(function(m){
  return norm(m['Nama Mesin']||m.namaMesin||m['Kode Mesin']||m.kodeMesin)===n;
 })||null}catch(err){}
 return row;
}
function setSelectByText(sel,value){
 if(!sel||!value)return false;
 var n=norm(value),found=null;
 Array.from(sel.options||[]).some(function(o){
  if(norm(o.value)===n||norm(o.textContent)===n){found=o;return true}
  return false;
 });
 if(!found)return false;
 sel.value=found.value;sel.dispatchEvent(new Event('change',{bubbles:true}));return true;
}
function prefillLogbook(machine,draft){
 if(!navigate('input'))return false;
 setTimeout(function(){
  var rec=findMachineRecord(machine)||{};
  var code=rec['Kode Mesin']||rec.kodeMesin||rec.KodeMesin||'';
  var name=rec['Nama Mesin']||rec.namaMesin||machine||'';
  if(code)setSelectByText(document.getElementById('select-kodeMesin'),code);
  if(name)setSelectByText(document.getElementById('select-namaMesin'),name);
  var ta=document.getElementById('ta-deskripsiMasalah');
  if(ta&&draft){
   var old=String(ta.value||'').trim();
   ta.value=old?old+'\n'+draft:draft;
   ta.dispatchEvent(new Event('input',{bubbles:true}));
   ta.focus();
  }
 },80);
 return true;
}
function openPatrol(machine){
 SF_LAST_MACHINE=machine||SF_LAST_MACHINE;
 navigate('patrol');
}
function backendRead(action,payload){
 if(window.OMODOS4&&typeof window.OMODOS4.serverRead==='function')return window.OMODOS4.serverRead(action,payload||{});
 return Promise.resolve(null);
}
function backendAction(action,payload){
 if(window.OMODOS4&&typeof window.OMODOS4.interactiveAction==='function')return window.OMODOS4.interactiveAction(action,payload||{});
 return Promise.reject(new Error('Backend interaction belum tersedia.'));
}
function busy(btn,on,label){
 if(!btn)return;
 if(on){btn.dataset.old=btn.innerHTML;btn.disabled=true;btn.innerHTML='<i class="ph-bold ph-spinner-gap v4-spin"></i> '+e(label||'Memproses…')}
 else{btn.disabled=false;if(btn.dataset.old)btn.innerHTML=btn.dataset.old}
}
function selected(sec,selector){var el=sec&&sec.querySelector(selector);return el?el.value:''}
function missionList(data,mode){
 if(!data)return '<div class="v4-empty">Backend V4 belum tersedia.</div>';
 var list=[];
 if(mode==='journey')list=Array.isArray(data.journey)?data.journey:[];
 else list=Array.isArray(data.missions)?data.missions:[];
 if(!list.length)return '<div class="v4-empty">BELUM CUKUP DATA untuk konteks ini.</div>';
 return '<div class="v4-sf-list">'+list.slice(0,30).map(function(m){
  var machine=m.machine||m.Machine||'-';
  var title=mode==='journey'?('Mission '+(m.order||'')):((m.priority||'')+' '+machine);
  var detail=m.reason||((m.checklist||[]).length+' checklist')||'Evidence mission';
  return '<div class="v4-sf-item"><div><strong>'+e(title)+'</strong><small>'+e(detail)+'</small></div><button class="btn btn-sm" data-v4-sf-open-patrol="'+e(machine)+'">Buka Patrol</button></div>';
 }).join('')+'</div>';
}
function checklistHtml(data,machine){
 var missions=Array.isArray(data&&data.missions)?data.missions:[];
 var n=norm(machine),m=missions.find(function(x){return norm(x.machine)===n})||missions[0];
 if(!m)return '<div class="v4-empty">BELUM CUKUP DATA — checklist dinamis tidak tersedia.</div>';
 var items=Array.isArray(m.checklist)?m.checklist:[];
 return '<div class="v4-sf-check-head"><strong>'+e(m.machine||machine)+'</strong><span>'+e(m.priority||'')+' • '+e(m.reason||'')+'</span></div>'+
 (items.length?'<div class="v4-sf-checklist">'+items.slice(0,40).map(function(it,i){
  var label=it.label||it.item||it.name||it['Item Pemeriksaan']||it['Checklist']||('Check '+(i+1));
  var source=it.source||it.labelType||it.status||'Tercatat / dihitung';
  return '<label><input type="checkbox" disabled><span><strong>'+e(label)+'</strong><small>'+e(source)+'</small></span></label>';
 }).join('')+'</div>':'<div class="v4-empty">Tidak ada checklist untuk mesin ini.</div>')+
 info('Checklist V4 adalah decision support. Pencatatan resmi tetap dilakukan di Patrol existing.','safe');
}
function proofHtml(data,machine){
 var missions=Array.isArray(data&&data.missions)?data.missions:[],n=norm(machine);
 var m=missions.find(function(x){return norm(x.machine)===n})||missions[0];
 var rows=Array.isArray(m&&m.beforeAfterProof)?m.beforeAfterProof:[];
 if(!rows.length)return '<div class="v4-empty">Belum tersedia — belum ada Before–After Proof tercatat untuk mesin ini.</div>';
 return '<div class="v4-sf-proof">'+rows.slice(0,16).map(function(r){
  return '<div><strong>'+e(r.theme||r.id||'Improvement')+'</strong><span>'+e(r.date||'')+'</span><small>Status: '+e(r.status||'Tercatat')+' • Benefit: '+e(r.benefit||'Belum tersedia')+'</small></div>';
 }).join('')+'</div>';
}
function mountMissionFeature(n){
 var h=host();if(!h||!openN(n))return;
 var old=h.querySelector('.v4-sf-interaction');if(old)old.remove();
 var titles={21:'Technician Mission Mode',23:'Dynamic Checklist',26:'Before–After Proof',29:'Maintenance Journey'};
 var sec=document.createElement('section');sec.className='v4-interaction v4-sf-interaction';sec.dataset.v4SfFeature=String(n);
 sec.innerHTML='<div class="v4-interaction-head"><div><span class="v4-eyebrow">SMART FIELD</span><h3>'+e(titles[n])+'</h3></div><span class="v4-no-write">USES EXISTING DATA</span></div>'+
 '<div class="v4-form-grid"><label>Mesin<select data-v4-sf-machine>'+opts(n===29?'Semua mesin':'Pilih mesin')+'</select></label></div>'+
 '<div class="v4-interaction-actions"><button class="btn btn-primary btn-sm" data-v4-sf-load="'+n+'"><i class="ph-bold ph-arrows-clockwise"></i> Muat '+e(titles[n])+'</button>'+
 (n===21||n===23?'<button class="btn btn-sm" data-v4-sf-patrol-current>Buka Patrol Existing</button>':'')+
 '</div><div data-v4-sf-output>'+info('Data berasal dari Logbook/Patrol/Project existing; tidak membuat input ganda.','safe')+'</div>';
 h.prepend(sec);
}
async function loadMission(btn,n){
 var sec=btn.closest('.v4-sf-interaction'),machine=selected(sec,'[data-v4-sf-machine]'),out=sec.querySelector('[data-v4-sf-output]');
 if(n!==29&&!machine){out.innerHTML=info('Pilih mesin terlebih dahulu.','warn');return}
 busy(btn,true,'Memuat');
 try{
  var d=await backendRead('v4.getFieldMission',machine?{machine:machine}:{});
  if(n===23)out.innerHTML=checklistHtml(d,machine);
  else if(n===26)out.innerHTML=proofHtml(d,machine);
  else out.innerHTML=missionList(d,n===29?'journey':'missions');
 }catch(err){out.innerHTML=info(err.message||String(err),'error')}
 finally{busy(btn,false)}
}
function mountTroubleshoot(){
 var h=host();if(!h||!openN(22))return;
 var old=h.querySelector('.v4-sf-interaction');if(old)old.remove();
 var sec=document.createElement('section');sec.className='v4-interaction v4-sf-interaction';sec.dataset.v4SfFeature='22';
 sec.innerHTML='<div class="v4-interaction-head"><div><span class="v4-eyebrow">SMART TROUBLESHOOTING</span><h3>Symptom → Inspection → Evidence → Next Step</h3></div><span class="v4-no-write">HUMAN REVIEW</span></div>'+
 '<div class="v4-form-grid"><label>Mesin *<select data-v4-sf-machine>'+opts('Pilih mesin')+'</select></label><label class="v4-form-wide">Symptom / masalah *<textarea rows="4" data-v4-sf-symptom placeholder="Jelaskan gejala yang terlihat, terdengar, atau terukur."></textarea></label></div>'+
 '<div class="v4-interaction-actions"><button class="btn btn-primary btn-sm" data-v4-sf-troubleshoot><i class="ph-bold ph-stethoscope"></i> Susun Troubleshooting</button></div><div data-v4-sf-output>'+info('OMODOS mencari evidence internal; hasil bukan root cause final.','safe')+'</div>';
 h.prepend(sec);
}
async function troubleshoot(btn){
 var sec=btn.closest('.v4-sf-interaction'),machine=selected(sec,'[data-v4-sf-machine]'),q=selected(sec,'[data-v4-sf-symptom]'),out=sec.querySelector('[data-v4-sf-output]');
 if(!machine||!q.trim()){out.innerHTML=info('Pilih mesin dan isi symptom terlebih dahulu.','warn');return}
 busy(btn,true,'Menganalisis');
 try{
  var d=await backendAction('v4.aiAsk',{machine:machine,query:q.trim(),purpose:'troubleshooting'});
  var sum=d&&d.summary?d.summary:(d&&d.answer)||'Evidence tersedia.';
  out.innerHTML='<div class="v4-ai-answer">'+e(sum).replace(/\n/g,'<br>')+'</div>'+info('Tingkat keyakinan: '+(d&&d.confidence||'belum tersedia')+'. Human inspection tetap wajib.','safe');
 }catch(err){out.innerHTML=info(err.message||String(err),'error')}
 finally{busy(btn,false)}
}
function mountVoice(){
 var h=host();if(!h||!openN(24))return;
 var old=h.querySelector('.v4-sf-interaction');if(old)old.remove();
 var SR=window.SpeechRecognition||window.webkitSpeechRecognition;
 var sec=document.createElement('section');sec.className='v4-interaction v4-sf-interaction';sec.dataset.v4SfFeature='24';
 sec.innerHTML='<div class="v4-interaction-head"><div><span class="v4-eyebrow">VOICE LOGBOOK</span><h3>Dictation Draft</h3></div><span class="v4-no-write">DRAFT ONLY</span></div>'+
 '<div class="v4-form-grid"><label>Mesin (opsional)<select data-v4-sf-machine>'+opts('Pilih jika relevan')+'</select></label><label class="v4-form-wide">Hasil dikte<textarea rows="5" data-v4-voice-text placeholder="Hasil suara muncul di sini. Bisa diedit sebelum dikirim ke form Logbook."></textarea></label></div>'+
 '<div class="v4-interaction-actions"><button class="btn btn-primary btn-sm" data-v4-voice-start '+(SR?'':'disabled')+'><i class="ph-bold ph-microphone"></i> Mulai Dikte</button><button class="btn btn-sm" data-v4-voice-to-logbook><i class="ph-bold ph-arrow-square-out"></i> Kirim Draft ke Form Logbook</button></div>'+
 '<div data-v4-sf-output>'+info(SR?'Speech Recognition tersedia. Tidak ada data yang disimpan sebelum form Logbook disubmit.':'Speech Recognition tidak didukung browser ini. Ketik manual pada draft lalu kirim ke form Logbook.','safe')+'</div>';
 h.prepend(sec);
}
function startVoice(btn){
 var sec=btn.closest('.v4-sf-interaction'),ta=sec.querySelector('[data-v4-voice-text]'),out=sec.querySelector('[data-v4-sf-output]');
 var SR=window.SpeechRecognition||window.webkitSpeechRecognition;
 if(!SR){out.innerHTML=info('Speech Recognition tidak tersedia di browser ini.','warn');return}
 stopSpeech();
 try{
  var rec=new SR();SF_SPEECH=rec;rec.lang='id-ID';rec.interimResults=true;rec.continuous=true;
  var base=ta.value.trim();
  rec.onresult=function(ev){
   var finalText='',interim='';
   for(var i=ev.resultIndex;i<ev.results.length;i++){var t=ev.results[i][0].transcript;if(ev.results[i].isFinal)finalText+=t+' ';else interim+=t}
   if(finalText){base=(base?base+' ':'')+finalText.trim()}
   ta.value=(base+(interim?' '+interim:'')).trim();
  };
  rec.onerror=function(ev){out.innerHTML=info('Dikte berhenti: '+(ev.error||'speech error')+'. Draft yang sudah ada tetap dipertahankan.','warn');stopSpeech()};
  rec.onend=function(){if(SF_SPEECH===rec){SF_SPEECH=null;btn.disabled=false;btn.innerHTML='<i class="ph-bold ph-microphone"></i> Mulai Dikte'}};
  btn.disabled=true;btn.innerHTML='<i class="ph-bold ph-stop-circle"></i> Mendengarkan…';rec.start();
  out.innerHTML=info('Mendengarkan. Ucapkan deskripsi masalah; hasil masih berupa draft.','safe');
 }catch(err){out.innerHTML=info(err.message||String(err),'error');stopSpeech()}
}
function mountPhoto(){
 var h=host();if(!h||!openN(25))return;
 var old=h.querySelector('.v4-sf-interaction');if(old)old.remove();
 var sec=document.createElement('section');sec.className='v4-interaction v4-sf-interaction';sec.dataset.v4SfFeature='25';
 sec.innerHTML='<div class="v4-interaction-head"><div><span class="v4-eyebrow">PHOTO DIAGNOSIS ASSISTANT</span><h3>Evidence Capture</h3></div><span class="v4-no-write">NO FALSE VISUAL CLAIM</span></div>'+
 info('Backend V4 saat ini tidak memiliki model visual terverifikasi. OMODOS tidak akan mengarang diagnosis dari foto. Fitur ini mengarahkan foto ke attachment Logbook existing dan diagnosis berbasis symptom/evidence tetap dilakukan manusia/AI tekstual.','warn')+
 '<div class="v4-form-grid"><label>Mesin<select data-v4-sf-machine>'+opts('Pilih mesin')+'</select></label><label class="v4-form-wide">Symptom singkat<textarea rows="3" data-v4-photo-note placeholder="Contoh: suara abnormal di feeder, bekas gesekan terlihat di sisi operator."></textarea></label></div>'+
 '<div class="v4-interaction-actions"><button class="btn btn-primary btn-sm" data-v4-photo-logbook><i class="ph-bold ph-camera"></i> Buka Logbook + Kamera</button><button class="btn btn-sm" data-v4-photo-text-ai><i class="ph-bold ph-brain"></i> Analisis Symptom Teks</button></div><div data-v4-sf-output></div>';
 h.prepend(sec);
}
function photoToLogbook(btn){
 var sec=btn.closest('.v4-sf-interaction'),machine=selected(sec,'[data-v4-sf-machine]'),draft=selected(sec,'[data-v4-photo-note]');
 prefillLogbook(machine,draft);
 setTimeout(function(){
  var input=document.getElementById('file-input');
  try{if(input&&typeof openCameraCapture==='function')openCameraCapture(input,{wantsPhoto:true,wantsVideo:false});else if(input)input.click()}catch(err){if(input)input.click()}
 },180);
}
async function photoTextAi(btn){
 var sec=btn.closest('.v4-sf-interaction'),machine=selected(sec,'[data-v4-sf-machine]'),q=selected(sec,'[data-v4-photo-note]'),out=sec.querySelector('[data-v4-sf-output]');
 if(!q.trim()){out.innerHTML=info('Isi symptom teks terlebih dahulu.','warn');return}
 busy(btn,true,'Menganalisis');
 try{var d=await backendAction('v4.aiAsk',{machine:machine,query:q.trim(),purpose:'troubleshooting'});out.innerHTML='<div class="v4-ai-answer">'+e(d.summary||'Evidence tersedia.').replace(/\n/g,'<br>')+'</div>'+info('Foto tidak dianalisis oleh model visual; jawaban hanya berdasarkan teks + evidence OMODOS.','safe')}
 catch(err){out.innerHTML=info(err.message||String(err),'error')}finally{busy(btn,false)}
}
function mountQr(){
 var h=host();if(!h||!openN(27))return;
 var old=h.querySelector('.v4-sf-interaction');if(old)old.remove();
 var supported=!!(window.BarcodeDetector&&navigator.mediaDevices&&navigator.mediaDevices.getUserMedia);
 var sec=document.createElement('section');sec.className='v4-interaction v4-sf-interaction';sec.dataset.v4SfFeature='27';
 sec.innerHTML='<div class="v4-interaction-head"><div><span class="v4-eyebrow">QR MACHINE ENTRY</span><h3>Scan or Manual Fallback</h3></div><span class="v4-no-write">'+(supported?'QR API READY':'MANUAL FALLBACK')+'</span></div>'+
 '<div class="v4-qr-zone"><video data-v4-qr-video playsinline muted style="display:none"></video><div data-v4-qr-status>'+info(supported?'Kamera baru aktif setelah tombol Scan dipilih.':'Browser ini tidak menyediakan BarcodeDetector QR. Gunakan fallback mesin manual.','safe')+'</div></div>'+
 '<div class="v4-form-grid"><label>Fallback Mesin<select data-v4-sf-machine>'+opts('Pilih mesin')+'</select></label></div>'+
 '<div class="v4-interaction-actions"><button class="btn btn-primary btn-sm" data-v4-qr-start '+(supported?'':'disabled')+'><i class="ph-bold ph-qr-code"></i> Scan QR</button><button class="btn btn-sm" data-v4-qr-manual>Gunakan Mesin Terpilih</button></div><div data-v4-qr-result></div>';
 h.prepend(sec);
}
async function startQr(btn){
 var sec=btn.closest('.v4-sf-interaction'),video=sec.querySelector('[data-v4-qr-video]'),status=sec.querySelector('[data-v4-qr-status]'),result=sec.querySelector('[data-v4-qr-result]');
 if(!(window.BarcodeDetector&&navigator.mediaDevices&&navigator.mediaDevices.getUserMedia)){status.innerHTML=info('QR native API tidak tersedia.','warn');return}
 stopQr();busy(btn,true,'Membuka kamera');
 try{
  var detector=new BarcodeDetector({formats:['qr_code']});
  SF_QR_STREAM=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'}},audio:false});
  video.srcObject=SF_QR_STREAM;video.style.display='block';await video.play();busy(btn,false);
  status.innerHTML=info('Arahkan kamera ke QR mesin. Tidak ada foto yang disimpan.','safe');
  async function loop(){
   if(!SF_QR_STREAM||!document.body.contains(video))return;
   try{
    var codes=await detector.detect(video);
    if(codes&&codes.length){
     var raw=codes[0].rawValue||'',machine=findMachine(raw);stopQr();video.style.display='none';
     if(machine){SF_LAST_MACHINE=machine;result.innerHTML=info('QR cocok dengan mesin: '+machine+'.','safe')+'<button class="btn btn-primary btn-sm" data-v4-tag-to-logbook="'+e(machine)+'">Buka Logbook Mesin</button>'}
     else result.innerHTML=info('QR terbaca tetapi tidak cocok dengan master mesin OMODOS: '+raw,'warn');
     return;
    }
   }catch(err){}
   SF_QR_RAF=requestAnimationFrame(loop);
  }
  loop();
 }catch(err){stopQr();busy(btn,false);video.style.display='none';status.innerHTML=info('Kamera/QR tidak dapat digunakan: '+(err.message||err),'warn')}
}
function mountNfc(){
 var h=host();if(!h||!openN(28))return;
 var old=h.querySelector('.v4-sf-interaction');if(old)old.remove();
 var supported='NDEFReader' in window;
 var sec=document.createElement('section');sec.className='v4-interaction v4-sf-interaction';sec.dataset.v4SfFeature='28';
 sec.innerHTML='<div class="v4-interaction-head"><div><span class="v4-eyebrow">NFC MAINTENANCE TAG</span><h3>Read-only Tag Entry</h3></div><span class="v4-no-write">'+(supported?'WEB NFC READY':'MANUAL FALLBACK')+'</span></div>'+
 info(supported?'NFC dibaca hanya setelah Anda memilih Scan NFC.':'Web NFC tidak didukung browser/perangkat ini. Fallback manual tetap tersedia; tidak ada error atau fitur palsu.','safe')+
 '<div class="v4-form-grid"><label>Fallback Mesin<select data-v4-sf-machine>'+opts('Pilih mesin')+'</select></label></div>'+
 '<div class="v4-interaction-actions"><button class="btn btn-primary btn-sm" data-v4-nfc-start '+(supported?'':'disabled')+'><i class="ph-bold ph-wifi-high"></i> Scan NFC</button><button class="btn btn-sm" data-v4-nfc-manual>Gunakan Mesin Terpilih</button></div><div data-v4-nfc-result></div>';
 h.prepend(sec);
}
async function startNfc(btn){
 var sec=btn.closest('.v4-sf-interaction'),out=sec.querySelector('[data-v4-nfc-result]');
 if(!('NDEFReader' in window)){out.innerHTML=info('Web NFC tidak tersedia.','warn');return}
 stopNfc();busy(btn,true,'Menunggu tag');
 try{
  var controller=new AbortController();SF_NFC_ABORT=controller;var reader=new NDEFReader();await reader.scan({signal:controller.signal});
  out.innerHTML=info('Dekatkan perangkat ke NFC tag mesin.','safe');
  reader.onreading=function(ev){
   var texts=[];
   try{
    for(var rec of ev.message.records){
     if(rec.recordType==='text')texts.push(new TextDecoder(rec.encoding||'utf-8').decode(rec.data));
     else if(rec.data)texts.push(new TextDecoder().decode(rec.data));
    }
   }catch(err){}
   var raw=texts.join(' ')||ev.serialNumber||'',machine=findMachine(raw);stopNfc();busy(btn,false);
   if(machine){SF_LAST_MACHINE=machine;out.innerHTML=info('NFC cocok dengan mesin: '+machine+'.','safe')+'<button class="btn btn-primary btn-sm" data-v4-tag-to-logbook="'+e(machine)+'">Buka Logbook Mesin</button>'}
   else out.innerHTML=info('Tag terbaca tetapi belum cocok dengan master mesin OMODOS: '+raw,'warn');
  };
  reader.onreadingerror=function(){out.innerHTML=info('Tag terdeteksi tetapi data tidak dapat dibaca.','warn')};
 }catch(err){stopNfc();busy(btn,false);out.innerHTML=info('NFC tidak dapat digunakan: '+(err.message||err),'warn')}
}
function mountOffline(){
 var h=host();if(!h||!openN(30))return;
 var old=h.querySelector('.v4-sf-interaction');if(old)old.remove();
 var q=[];
 try{q=JSON.parse(localStorage.getItem('logbook_pending_sync_queue')||'[]')}catch(err){}
 var online=navigator.onLine;
 var sec=document.createElement('section');sec.className='v4-interaction v4-sf-interaction';sec.dataset.v4SfFeature='30';
 sec.innerHTML='<div class="v4-interaction-head"><div><span class="v4-eyebrow">OFFLINE EXPEDITION MODE</span><h3>Existing Offline Queue Status</h3></div><span class="v4-no-write">'+(online?'ONLINE':'OFFLINE')+'</span></div>'+
 '<div class="v4-statline"><div><b>'+(online?'Online':'Offline')+'</b><span>Browser network</span></div><div><b>'+q.length+'</b><span>Pending sync queue</span></div><div><b>Existing</b><span>Uses base OMODOS queue</span></div></div>'+
 info('OMODOS existing sudah menyimpan request gagal ke antrean lokal dan menyinkron otomatis saat koneksi kembali. V4 tidak membuat antrean kedua.','safe')+
 '<div class="v4-interaction-actions"><button class="btn btn-primary btn-sm" data-v4-offline-logbook><i class="ph-bold ph-notebook"></i> Buka Input Logbook</button><button class="btn btn-sm" data-v4-offline-refresh>Refresh Status</button></div>';
 h.prepend(sec);
}
function mount(n){
 if([21,23,26,29].includes(n))mountMissionFeature(n);
 else if(n===22)mountTroubleshoot();
 else if(n===24)mountVoice();
 else if(n===25)mountPhoto();
 else if(n===27)mountQr();
 else if(n===28)mountNfc();
 else if(n===30)mountOffline();
}
document.addEventListener('click',function(ev){
 var tile=ev.target.closest&&ev.target.closest('[data-v4-feature]');
 if(tile){
  stopSensors();
  var n=Number(tile.getAttribute('data-v4-feature'));
  if(n>=21&&n<=30)setTimeout(function(){if(openN(n))mount(n)},0);
  return;
 }
 var load=ev.target.closest&&ev.target.closest('[data-v4-sf-load]');if(load){ev.preventDefault();loadMission(load,Number(load.getAttribute('data-v4-sf-load')));return}
 var op=ev.target.closest&&ev.target.closest('[data-v4-sf-open-patrol]');if(op){ev.preventDefault();openPatrol(op.getAttribute('data-v4-sf-open-patrol'));return}
 var pc=ev.target.closest&&ev.target.closest('[data-v4-sf-patrol-current]');if(pc){ev.preventDefault();var sec=pc.closest('.v4-sf-interaction');openPatrol(selected(sec,'[data-v4-sf-machine]'));return}
 var tr=ev.target.closest&&ev.target.closest('[data-v4-sf-troubleshoot]');if(tr){ev.preventDefault();troubleshoot(tr);return}
 var vs=ev.target.closest&&ev.target.closest('[data-v4-voice-start]');if(vs){ev.preventDefault();startVoice(vs);return}
 var vl=ev.target.closest&&ev.target.closest('[data-v4-voice-to-logbook]');if(vl){ev.preventDefault();var sec=vl.closest('.v4-sf-interaction');prefillLogbook(selected(sec,'[data-v4-sf-machine]'),selected(sec,'[data-v4-voice-text]'));return}
 var pl=ev.target.closest&&ev.target.closest('[data-v4-photo-logbook]');if(pl){ev.preventDefault();photoToLogbook(pl);return}
 var pa=ev.target.closest&&ev.target.closest('[data-v4-photo-text-ai]');if(pa){ev.preventDefault();photoTextAi(pa);return}
 var qs=ev.target.closest&&ev.target.closest('[data-v4-qr-start]');if(qs){ev.preventDefault();startQr(qs);return}
 var qm=ev.target.closest&&ev.target.closest('[data-v4-qr-manual]');if(qm){ev.preventDefault();var sec=qm.closest('.v4-sf-interaction'),m=selected(sec,'[data-v4-sf-machine]');if(m)prefillLogbook(m,'');return}
 var ns=ev.target.closest&&ev.target.closest('[data-v4-nfc-start]');if(ns){ev.preventDefault();startNfc(ns);return}
 var nm=ev.target.closest&&ev.target.closest('[data-v4-nfc-manual]');if(nm){ev.preventDefault();var sec=nm.closest('.v4-sf-interaction'),m=selected(sec,'[data-v4-sf-machine]');if(m)prefillLogbook(m,'');return}
 var tag=ev.target.closest&&ev.target.closest('[data-v4-tag-to-logbook]');if(tag){ev.preventDefault();prefillLogbook(tag.getAttribute('data-v4-tag-to-logbook'),'');return}
 var ol=ev.target.closest&&ev.target.closest('[data-v4-offline-logbook]');if(ol){ev.preventDefault();navigate('input');return}
 var orf=ev.target.closest&&ev.target.closest('[data-v4-offline-refresh]');if(orf){ev.preventDefault();mountOffline();return}
},false);
window.addEventListener('pagehide',stopSensors);
document.addEventListener('visibilitychange',function(){if(document.hidden)stopSensors()});
window.OMODOS4=Object.assign(window.OMODOS4||{},{
 smartFieldVersion:'1',
 smartFieldFeatures:[21,22,23,24,25,26,27,28,29,30],
 stopSmartFieldSensors:stopSensors
});
})();


/* OMODOS4_SPAREPART_INTEL_V1
   Progressive-enhancement views for master-prompt features 31–40.
   Read-only: consumes v4.getSparepartRisk and never writes operational sparepart data. */
(function(){
'use strict';

var SP_DATA=null;
var SP_LOADED_AT=0;
var SP_TTL=30000;

function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function openN(n){
 var el=document.querySelector('#v4-safe-stage .v4-feature-no');
 return !!el&&parseInt(el.textContent,10)===Number(n);
}
function host(){return document.querySelector('#v4-safe-stage .v4-detail-card .v4-detail-body')}
function note(t,kind){return '<div class="v4-interaction-note '+(kind||'')+'"><i class="ph-bold ph-info"></i><span>'+esc(t)+'</span></div>'}
function empty(t){return '<div class="v4-empty">'+esc(t||'Belum ada data untuk konteks ini.')+'</div>'}
function busy(btn,on){
 if(!btn)return;
 if(on){btn.dataset.old=btn.innerHTML;btn.disabled=true;btn.innerHTML='<i class="ph-bold ph-spinner-gap v4-spin"></i> Memuat…'}
 else{btn.disabled=false;if(btn.dataset.old)btn.innerHTML=btn.dataset.old}
}
function val(sec,sel){var el=sec&&sec.querySelector(sel);return el?String(el.value||'').trim():''}
function factors(f){
 f=f||{};var p=[];
 if(f.consumptionCount!=null)p.push('Konsumsi '+f.consumptionCount);
 if(f.machines!=null)p.push('Mesin '+f.machines);
 if(f.criticalMachineCount)p.push('Mesin kritis '+f.criticalMachineCount);
 if(f.stockout)p.push('STOCKOUT');
 else if(f.stockRisk)p.push('Stock ≤ minimum');
 if(f.etaOverdue)p.push('ETA terlambat');
 return p.join(' • ')||'Evidence sparepart existing';
}
function partName(x){return (x&&x.material)||'(nama material belum tersedia)'}
function partNo(x){return (x&&x.materialNumber)||'No SAP belum tersedia'}
function rows(list,renderer,limit){
 if(!Array.isArray(list)||!list.length)return empty('Tidak ada evidence yang memenuhi kriteria fitur ini.');
 return '<div class="v4-sf-list">'+list.slice(0,limit||50).map(renderer).join('')+'</div>';
}
function item(title,sub,right){
 return '<div class="v4-sf-item"><div><strong>'+esc(title)+'</strong><small>'+esc(sub||'')+'</small></div>'+(right||'')+'</div>';
}
function priorityBadge(x){
 var p=x&&x.priority||'P3';
 return '<span class="v4-risk-chip">'+esc(p)+(x&&x.criticalityScore!=null?' • '+esc(x.criticalityScore):'')+'</span>';
}
function machineOptions(data){
 var set=new Set();
 (data&&Array.isArray(data.machinePartGraph)?data.machinePartGraph:[]).forEach(function(x){
  var m=String(x&&x.from||'').replace(/^machine:/,'').trim();if(m)set.add(m);
 });
 return '<option value="">Semua mesin</option>'+Array.from(set).sort(function(a,b){return a.localeCompare(b,'id')}).map(function(m){return '<option value="'+esc(m)+'">'+esc(m)+'</option>'}).join('');
}
function mount(n){
 var h=host();if(!h||!openN(n))return;
 var old=h.querySelector('.v4-sparepart-intel');if(old)old.remove();
 var titles={
 31:'Sparepart Criticality Matrix',32:'Stockout Risk Radar',33:'Dead Stock Museum',34:'Sparepart Consumption DNA',35:'Machine–Part Graph',
 36:'Equivalent Part Finder',37:'Part Photo Recognition',38:'Shelf Digital Twin',39:'Sparepart Reservation Predictor',40:'Procurement Urgency Engine'
 };
 var sec=document.createElement('section');sec.className='v4-interaction v4-sparepart-intel';sec.dataset.v4SpFeature=String(n);
 var controls='';
 if(n===35)controls='<label>Mesin<select data-v4-sp-machine><option value="">Muat data untuk melihat mesin</option></select></label>';
 if(n===36)controls='<label class="v4-form-wide">Cari material / nomor SAP<input data-v4-sp-query placeholder="Ketik nama material atau nomor SAP"></label>';
 sec.innerHTML='<div class="v4-interaction-head"><div><span class="v4-eyebrow">SPAREPART INTELLIGENCE</span><h3>'+esc(titles[n])+'</h3></div><span class="v4-no-write">READ ONLY</span></div>'+
 (controls?'<div class="v4-form-grid">'+controls+'</div>':'')+
 '<div class="v4-interaction-actions"><button class="btn btn-primary btn-sm" data-v4-sp-load="'+n+'"><i class="ph-bold ph-arrows-clockwise"></i> Muat Analisis</button><button class="btn btn-sm" data-v4-open-existing="sparepart"><i class="ph-bold ph-package"></i> Buka Sparepart Existing</button></div>'+
 '<div data-v4-sp-out>'+note('Menggunakan Stock Sparepart, lokasi, ETA, opname, warehouse, SAP status, dan konsumsi Logbook existing. Tidak membuat data ganda.','safe')+'</div>';
 h.prepend(sec);
}
async function getData(force){
 if(!force&&SP_DATA&&Date.now()-SP_LOADED_AT<SP_TTL)return SP_DATA;
 if(!(window.OMODOS4&&typeof window.OMODOS4.serverRead==='function'))return null;
 var d=await window.OMODOS4.serverRead('v4.getSparepartRisk',{});
 if(d){SP_DATA=d;SP_LOADED_AT=Date.now()}
 return d;
}
function renderCritical(data){
 return rows(data.criticalityMatrix,function(x){
  return item(partName(x),partNo(x)+' • '+factors(x.factors),priorityBadge(x));
 },60)+note('Criticality score adalah derived rule-based indicator untuk prioritas review, bukan keputusan pembelian otomatis.','safe');
}
function renderStockout(data){
 var list=(data.risks||[]).filter(function(x){return ['stockout','stock-risk','eta-overdue'].includes(String(x.type||''))});
 return rows(list,function(x){
  var label=x.type==='stockout'?'STOCKOUT':x.type==='stock-risk'?'Stock Risk':'ETA Overdue';
  return item(partName(x),partNo(x)+' • '+factors(x.factors),'<span class="v4-risk-chip">'+esc(label)+' • '+esc(x.score==null?'—':x.score)+'</span>');
 },60)+note('Radar hanya menandai evidence stock minimum/stockout/ETA overdue yang tercatat pada sumber existing.','safe');
}
function renderDead(data){
 return rows(data.deadStockCandidates,function(x){
  return item(partName(x),partNo(x)+' • '+(x.reason||'Candidate only'),'<span class="v4-risk-chip">CANDIDATE</span>');
 },60)+note('Dead Stock Museum menampilkan kandidat saja. Verifikasi histori, kebutuhan engineering, dan reservation sebelum disposition.','warn');
}
function renderConsumption(data){
 return rows(data.consumptionTop,function(x){
  var machines=Array.isArray(x.machines)&&x.machines.length?x.machines.slice(0,5).join(', '):'mesin belum terhubung';
  return item(partName(x),partNo(x)+' • '+x.count+' konsumsi • '+machines,'<span class="v4-risk-chip">'+esc(x.count)+'x</span>');
 },60)+note('Consumption DNA dihitung dari linkage konsumsi Logbook terhadap nomor SAP/nama material existing.','safe');
}
function renderGraph(data,sec){
 var sel=sec.querySelector('[data-v4-sp-machine]');
 if(sel&&sel.options.length<=1){sel.innerHTML=machineOptions(data)}
 var machine=val(sec,'[data-v4-sp-machine]');
 var list=(data.machinePartGraph||[]).filter(function(x){return !machine||String(x.from||'')==='machine:'+machine});
 return rows(list,function(x){
  var m=String(x.from||'').replace(/^machine:/,'');
  return item(m+' → '+partName(x),partNo(x)+' • '+(x.relation||'uses/consumed'),'<span class="v4-risk-chip">LINK</span>');
 },80)+note('Graph berasal dari hubungan mesin ↔ sparepart yang pernah tercatat/terkonsumsi; bukan BOM engineering lengkap.','safe');
}
function renderEquivalent(data,sec){
 var q=val(sec,'[data-v4-sp-query]').toLowerCase();
 var list=(data.equivalentParts||[]).filter(function(x){
  return !q||[x.material,x.materialNumber,x.recordedEquivalent].some(function(v){return String(v||'').toLowerCase().includes(q)});
 });
 return rows(list,function(x){
  return item(partName(x)+' → '+(x.recordedEquivalent||'—'),partNo(x)+' • '+(x.validation||'engineering confirmation required'),'<span class="v4-risk-chip">VERIFY</span>');
 },60)+note('Hanya equivalence yang memiliki field recorded source yang ditampilkan. Tetap wajib validasi engineering sebelum substitusi.','warn');
}
function renderPhoto(data){
 var status=data.photoRecognition||{};
 var list=data.partPhotoAssets||[];
 return note('Status model: '+(status.status||'Belum tersedia')+'. '+(status.note||'Tidak ada klaim visual tanpa model tervalidasi.'),status.status&&status.status!=='NOT AVAILABLE'?'safe':'warn')+
 rows(list,function(x){return item(partName(x),partNo(x)+' • Foto referensi tercatat pada data existing','<span class="v4-risk-chip">ASSET</span>')},40)+
 note('OMODOS tidak akan menyebut identitas part dari foto tanpa model visual tervalidasi.','safe');
}
function renderShelf(data){
 return rows(data.shelfDigitalTwin,function(x){
  return item(x.location||'Lokasi belum bernama',(x.materials||0)+' material • '+(x.records||0)+' record','<span class="v4-risk-chip">Qty '+esc(x.stockQty==null?'—':x.stockQty)+'</span>');
 },80)+note('Shelf Digital Twin adalah ringkasan lokasi recorded pada lokasi/opname/warehouse existing.','safe');
}
function renderReservation(data){
 return rows(data.reservationForecast,function(x){
  return item(partName(x),partNo(x)+' • '+x.observedConsumptions+' konsumsi / '+x.windowDays+' hari','<span class="v4-risk-chip">Next 30d '+esc(x.expectedNext30)+' • '+esc(x.confidence)+'</span>');
 },60)+note('Prediksi reservation adalah historical-rate projection, bukan forecast kebutuhan yang pasti.','warn');
}
function renderUrgency(data){
 return rows(data.procurementUrgency,function(x){
  return item(partName(x),partNo(x)+' • '+factors(x.factors),'<span class="v4-risk-chip">'+esc(x.priority)+' • '+esc(x.score)+'</span>');
 },60)+note('Procurement Urgency menyusun antrean review dari criticality + stock/ETA evidence. Persetujuan pembelian tetap mengikuti proses manusia.','warn');
}
function render(n,data,sec){
 if(!data)return empty('Daftar belum dapat dimuat. Coba lagi setelah masuk kembali.');
 if(n===31)return renderCritical(data);
 if(n===32)return renderStockout(data);
 if(n===33)return renderDead(data);
 if(n===34)return renderConsumption(data);
 if(n===35)return renderGraph(data,sec);
 if(n===36)return renderEquivalent(data,sec);
 if(n===37)return renderPhoto(data);
 if(n===38)return renderShelf(data);
 if(n===39)return renderReservation(data);
 if(n===40)return renderUrgency(data);
 return empty();
}
async function load(btn,n,force){
 var sec=btn.closest('.v4-sparepart-intel'),out=sec&&sec.querySelector('[data-v4-sp-out]');
 if(!sec||!out)return;
 busy(btn,true);
 try{var d=await getData(!!force);out.innerHTML=render(n,d,sec)}
 catch(err){out.innerHTML=note(err&&err.message||String(err),'error')}
 finally{busy(btn,false)}
}
document.addEventListener('click',function(ev){
 var tile=ev.target.closest&&ev.target.closest('[data-v4-feature]');
 if(tile){
  var n=Number(tile.getAttribute('data-v4-feature'));
  if(n>=31&&n<=40)setTimeout(function(){if(openN(n))mount(n)},0);
  return;
 }
 var b=ev.target.closest&&ev.target.closest('[data-v4-sp-load]');
 if(b){ev.preventDefault();load(b,Number(b.getAttribute('data-v4-sp-load')),true);return}
},false);
document.addEventListener('change',function(ev){
 if(ev.target&&ev.target.matches('[data-v4-sp-machine]')){
  var sec=ev.target.closest('.v4-sparepart-intel');
  if(sec&&SP_DATA){var n=Number(sec.dataset.v4SpFeature),out=sec.querySelector('[data-v4-sp-out]');if(out)out.innerHTML=render(n,SP_DATA,sec)}
 }
},false);
document.addEventListener('input',function(ev){
 if(ev.target&&ev.target.matches('[data-v4-sp-query]')){
  var sec=ev.target.closest('.v4-sparepart-intel');
  if(sec&&SP_DATA){var n=Number(sec.dataset.v4SpFeature),out=sec.querySelector('[data-v4-sp-out]');if(out)out.innerHTML=render(n,SP_DATA,sec)}
 }
},false);

window.OMODOS4=Object.assign(window.OMODOS4||{},{
 sparepartIntelVersion:'1',
 sparepartIntelFeatures:[31,32,33,34,35,36,37,38,39,40]
});
})();


/* OMODOS4_RELIABILITY_LOSS_V1
   Progressive-enhancement views for master-prompt features 41–50.
   Read-only: consumes v4.getReliability; official KPI definitions and operational records remain untouched. */
(function(){
'use strict';

var REL_CACHE=new Map();
var REL_TTL=30000;

function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function openN(n){
 var el=document.querySelector('#v4-safe-stage .v4-feature-no');
 return !!el&&parseInt(el.textContent,10)===Number(n);
}
function host(){return document.querySelector('#v4-safe-stage .v4-detail-card .v4-detail-body')}
function note(t,kind){return '<div class="v4-interaction-note '+(kind||'')+'"><i class="ph-bold ph-info"></i><span>'+esc(t)+'</span></div>'}
function empty(t){return '<div class="v4-empty">'+esc(t||'Belum ada evidence pada window ini.')+'</div>'}
function value(sec,sel){var e=sec&&sec.querySelector(sel);return e?String(e.value||'').trim():''}
function busy(btn,on){
 if(!btn)return;
 if(on){btn.dataset.old=btn.innerHTML;btn.disabled=true;btn.innerHTML='<i class="ph-bold ph-spinner-gap v4-spin"></i> Memuat…'}
 else{btn.disabled=false;if(btn.dataset.old)btn.innerHTML=btn.dataset.old}
}
function machineNames(){
 var set=new Set();
 try{(Array.isArray(MACHINES)?MACHINES:[]).forEach(function(m){
  var n=m['Nama Mesin']||m.namaMesin||m['Kode Mesin']||m.kodeMesin;if(n)set.add(String(n));
 })}catch(e){}
 try{(Array.isArray(ENTRIES)?ENTRIES:[]).forEach(function(m){
  var n=m['Nama Mesin']||m.namaMesin||m['Kode Mesin']||m.kodeMesin;if(n)set.add(String(n));
 })}catch(e){}
 return Array.from(set).sort(function(a,b){return a.localeCompare(b,'id')});
}
function machineOptions(){
 return '<option value="">Semua mesin</option>'+machineNames().map(function(n){return '<option value="'+esc(n)+'">'+esc(n)+'</option>'}).join('');
}
function fmtNum(v,d){
 if(v==null||v==='')return '—';
 var n=Number(v);if(!Number.isFinite(n))return '—';
 try{return new Intl.NumberFormat('id-ID',{maximumFractionDigits:d==null?1:d}).format(n)}catch(e){return String(Math.round(n*10)/10)}
}
function rupiah(v){
 if(v==null||v==='')return '—';
 var n=Number(v);if(!Number.isFinite(n))return '—';
 try{return new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(n)}catch(e){return 'Rp '+fmtNum(n,0)}
}
function machineOf(x){return x&&(x.code||x.name||x.key||x.machine)||'Mesin belum bernama'}
function statusChip(t){return '<span class="v4-risk-chip">'+esc(t||'Bukti data')+'</span>'}
function item(title,sub,right){
 return '<div class="v4-sf-item"><div><strong>'+esc(title)+'</strong><small>'+esc(sub||'')+'</small></div>'+(right||'')+'</div>';
}
function list(arr,fn,limit,msg){
 if(!Array.isArray(arr)||!arr.length)return empty(msg);
 return '<div class="v4-sf-list">'+arr.slice(0,limit||60).map(fn).join('')+'</div>';
}
function metrics(rows){
 return '<div class="v4-statline">'+rows.map(function(x){
  return '<div><b>'+esc(x[1])+'</b><span>'+esc(x[0])+'</span></div>';
 }).join('')+'</div>';
}
function pick(o,keys){
 if(!o||typeof o!=='object')return '';
 for(var i=0;i<keys.length;i++){
  var k=keys[i];if(o[k]!=null&&String(o[k]).trim())return String(o[k]);
 }
 return '';
}
function recordTitle(r){
 return pick(r,['Judul','Title','Problem','Masalah','Problem Statement','Deskripsi','Description','Root Cause','Akar Masalah','ID'])||'RCA record';
}
function recordSub(r){
 var p=[];
 [['Mesin','Nama Mesin','Kode Mesin'],['Tanggal','Date','Created At'],['Root Cause','Akar Masalah'],['Countermeasure','Tindakan','Action']].forEach(function(keys){
  var v=pick(r,keys);if(v&&!p.includes(v))p.push(v);
 });
 return p.slice(0,3).join(' • ')||'Recorded RCA evidence';
}
function payload(sec){
 var days=Math.max(7,Number(value(sec,'[data-v4-rel-days]'))||90);
 var until=new Date(),since=new Date(until.getTime()-days*864e5);
 var p={since:since.toISOString(),until:until.toISOString()};
 var machine=value(sec,'[data-v4-rel-machine]');if(machine)p.machine=machine;
 return p;
}
function keyFor(p){return [p.machine||'*',p.since.slice(0,10),p.until.slice(0,10)].join('|')}
async function getData(p,force){
 if(!(window.OMODOS4&&typeof window.OMODOS4.serverRead==='function'))return null;
 var key=keyFor(p),cached=REL_CACHE.get(key);
 if(!force&&cached&&Date.now()-cached.at<REL_TTL)return cached.data;
 var d=await window.OMODOS4.serverRead('v4.getReliability',p);
 if(d)REL_CACHE.set(key,{at:Date.now(),data:d});
 return d;
}
function mount(n){
 var h=host();if(!h||!openN(n))return;
 var old=h.querySelector('.v4-reliability-loss');if(old)old.remove();
 var titles={
  41:'Reliability Observatory',42:'Bad Actor Machine',43:'Pareto That Talks',44:'Chronic vs Acute Failure',45:'Hidden Factory Detector',
  46:'Reliability Growth Curve',47:'RCA Memory',48:'Countermeasure Effectiveness',49:'Failure Cost',50:'Million-Rupiah Minute'
 };
 var sec=document.createElement('section');sec.className='v4-interaction v4-reliability-loss';sec.dataset.v4RelFeature=String(n);
 sec.innerHTML='<div class="v4-interaction-head"><div><span class="v4-eyebrow">RELIABILITY & LOSS</span><h3>'+esc(titles[n])+'</h3></div><span class="v4-no-write">READ ONLY</span></div>'+
 '<div class="v4-form-grid"><label>Periode analisis<select data-v4-rel-days><option value="30">30 hari</option><option value="90" selected>90 hari</option><option value="180">180 hari</option><option value="365">365 hari</option></select></label><label>Mesin<select data-v4-rel-machine>'+machineOptions()+'</select></label></div>'+
 '<div class="v4-interaction-actions"><button class="btn btn-primary btn-sm" data-v4-rel-load="'+n+'"><i class="ph-bold ph-arrows-clockwise"></i> Muat Analisis</button>'+
 (n===47?'<button class="btn btn-sm" data-v4-open-existing="diagnostic"><i class="ph-bold ph-magnifying-glass"></i> Buka Diagnostic Existing</button>':'')+
 (n===48?'<button class="btn btn-sm" data-v4-open-existing="corrective-report"><i class="ph-bold ph-wrench"></i> Buka Corrective Report</button>':'')+
 (n===41||n===42||n===43||n===44||n===45||n===46?'<button class="btn btn-sm" data-v4-open-existing="downtime"><i class="ph-bold ph-clock-counter-clockwise"></i> Buka Downtime Existing</button>':'')+
 '</div><div data-v4-rel-out>'+note('Metrik derived memakai event timing yang tercatat. KPI resmi existing tidak ditimpa dan tidak ada data operasional yang ditulis.','safe')+'</div>';
 h.prepend(sec);
}
function render41(d){
 var t=d.totals||{};
 var top=(d.badActors||[]).slice(0,8);
 return metrics([
  ['Mesin',fmtNum(t.machines,0)],['Breakdown',fmtNum(t.breakdowns,0)],['Downtime',fmtNum(t.downtimeMinutes,0)+' min'],
  ['Recurring',fmtNum(t.recurringPatterns,0)],['RCA',fmtNum(t.rca,0)],['Corrective',fmtNum(t.corrective,0)]
 ])+
 list(top,function(x){
  return item(machineOf(x),'Health '+fmtNum(x.healthIndex,0)+' • '+fmtNum(x.breakdowns,0)+' breakdown • '+fmtNum(x.downtimeMinutes,0)+' min downtime',
   statusChip('MTBF* '+fmtNum(x.mtbfDerivedHours,1)+'h • MTTR* '+fmtNum(x.mttrDerivedMinutes,0)+'m'));
 },12)+note('* MTBF/MTTR pada Observatory adalah derived dari event timing pada window, bukan pengganti KPI resmi.','warn');
}
function render42(d){
 return list(d.badActors,function(x){
  return item(machineOf(x),
   'Downtime '+fmtNum(x.downtimeMinutes,0)+' min • Breakdown '+fmtNum(x.breakdowns,0)+' • Recurring '+fmtNum(x.recurring,0)+' • Open issue '+fmtNum(x.openIssues,0),
   statusChip('Health '+fmtNum(x.healthIndex,0)));
 },30)+note('Urutan bad actor memakai kombinasi health/loss evidence pada backend V4; gunakan sebagai prioritas review, bukan verdict mesin.','safe');
}
function render43(d){
 var narrative=d.paretoNarrative||[];
 return list(narrative,function(x){
  return item('#'+(x.rank||'')+' '+(x.machine||'Mesin'),(x.why||'')+' • '+(x.inspect||''),statusChip('PARETO'));
 },20)+note('Pareto That Talks menjelaskan WHY berdasarkan downtime, breakdown, recurring pattern, dan open issue yang tercatat.','safe');
}
function render44(d){
 var chronic='<section class="v4-server-section"><div class="v4-server-section-head"><strong>Chronic</strong><span>Recurring ≥ 2</span></div>'+
  list(d.chronic,function(x){return item(machineOf(x),'Recurring '+fmtNum(x.recurring,0)+' • Downtime '+fmtNum(x.downtimeMinutes,0)+' min',statusChip('Health '+fmtNum(x.healthIndex,0)))},30)+'</section>';
 var acute='<section class="v4-server-section"><div class="v4-server-section-head"><strong>Acute</strong><span>Loss tinggi, recurring &lt; 2</span></div>'+
  list(d.acute,function(x){return item(machineOf(x),'Breakdown '+fmtNum(x.breakdowns,0)+' • Downtime '+fmtNum(x.downtimeMinutes,0)+' min',statusChip('ACUTE'))},30)+'</section>';
 return chronic+acute+note('Klasifikasi ini adalah rule-based segmentation untuk review reliability.','safe');
}
function render45(d){
 return list(d.hiddenFactory,function(x){
  return item(x.machine||'Unassigned',fmtNum(x.events,0)+' event non-breakdown/emergency dengan downtime tercatat',statusChip(fmtNum(x.downtimeMinutes,0)+' min'));
 },40)+note('Hidden Factory hanya menangkap downtime Logbook yang tidak dikategorikan breakdown/emergency; validasi konteks operasional tetap diperlukan.','warn');
}
function render46(d){
 var rows=d.reliabilityGrowth||[];
 if(!rows.length)return empty('Belum cukup event bulanan untuk Reliability Growth Curve.');
 var max=Math.max.apply(null,rows.map(function(x){return Number(x.downtimeMinutes)||0}).concat([1]));
 return '<div class="v4-sf-list">'+rows.slice(-24).map(function(x){
  var pct=Math.max(2,Math.round((Number(x.downtimeMinutes)||0)/max*100));
  return '<div class="v4-sf-item"><div style="width:100%"><strong>'+esc(x.month||'Periode')+'</strong><small>'+esc(fmtNum(x.breakdowns,0)+' breakdown • '+fmtNum(x.downtimeMinutes,0)+' min • '+fmtNum(x.affectedMachines,0)+' mesin')+'</small><div style="height:5px;margin-top:6px;border-radius:999px;background:var(--line-soft);overflow:hidden"><span style="display:block;height:100%;width:'+pct+'%;background:currentColor;opacity:.5"></span></div></div>'+statusChip(fmtNum(x.downtimeMinutes,0)+' min')+'</div>';
 }).join('')+'</div>'+note('Kurva menggunakan agregasi event bulanan recorded pada window. Penurunan/kenaikan perlu dibaca bersama volume produksi dan perubahan operating hours.','safe');
}
function render47(d){
 return list(d.rcaMemory,function(r){
  return item(recordTitle(r),recordSub(r),statusChip('Tercatat RCA'));
 },50,'Belum ada RCA recorded pada window ini.')+note('RCA Memory menampilkan RCA existing; tidak membuat atau mengubah RCA baru.','safe');
}
function render48(d){
 return list(d.countermeasureEffectiveness,function(x){
  var delta=Number(x.delta);
  var badge=x.status==='IMPROVED_SIGNAL'?'IMPROVED SIGNAL':x.status==='WORSE_SIGNAL'?'WORSE SIGNAL':x.status==='NO_CHANGE_SIGNAL'?'NO CHANGE':'WINDOW INCOMPLETE';
  return item(x.machine||'Mesin','Corrective '+(x.correctiveId||'—')+' • '+String(x.date||'').slice(0,10)+' • Before 30d '+fmtNum(x.before30d,0)+' → After 30d '+fmtNum(x.after30d,0)+' • Δ '+fmtNum(delta,0),statusChip(badge));
 },40,'Belum ada corrective dengan evidence before/after yang dapat dibandingkan.')+
 note('Before/after adalah association signal, bukan bukti kausal bahwa countermeasure menyebabkan perubahan.','warn');
}
function render49(d){
 var c=d.costIntelligence||{};
 if(c.status!=='RECORDED_COST_ONLY')return empty('Biaya kerusakan belum tersedia karena belum ada angka biaya yang tercatat.')+note(c.note||'Biaya yang belum tercatat tidak diperkirakan.','warn');
 return metrics([
  ['Record biaya',fmtNum(c.records,0)],
  ['Total recorded cost',rupiah(c.totalRecordedCost)],
  ['Cost / downtime minute',rupiah(c.recordedCostPerDowntimeMinute)]
 ])+note('Failure Cost hanya menggunakan nilai biaya yang eksplisit tercatat. Missing cost tidak diisi dengan asumsi.','safe');
}
function render50(d){
 var c=d.costIntelligence||{};
 if(c.status!=='RECORDED_COST_ONLY'||!Number.isFinite(Number(c.millionRupiahMinute)))return empty('Biaya per menit berhenti belum tersedia karena catatan biaya atau waktu berhenti belum cukup.')+note(c.note||'Biaya yang belum tercatat tidak diperkirakan.','warn');
 var rpm=Number(c.recordedCostPerDowntimeMinute)||0,million=Number(c.millionRupiahMinute)||0;
 return metrics([
  ['Rp per downtime minute',rupiah(rpm)],
  ['Juta Rp per downtime minute',fmtNum(million,4)],
  ['Basis record biaya',fmtNum(c.records,0)]
 ])+note('Nilai ini = recorded failure/downtime cost ÷ recorded downtime minute. Gunakan untuk memahami loss intensity, bukan sebagai biaya standar tanpa validasi Finance.','warn');
}
function render(n,d){
 if(!d)return empty('Daftar belum dapat dimuat. Coba lagi setelah masuk kembali.');
 if(n===41)return render41(d);
 if(n===42)return render42(d);
 if(n===43)return render43(d);
 if(n===44)return render44(d);
 if(n===45)return render45(d);
 if(n===46)return render46(d);
 if(n===47)return render47(d);
 if(n===48)return render48(d);
 if(n===49)return render49(d);
 if(n===50)return render50(d);
 return empty();
}
async function load(btn,n,force){
 var sec=btn.closest('.v4-reliability-loss'),out=sec&&sec.querySelector('[data-v4-rel-out]');
 if(!sec||!out)return;
 busy(btn,true);
 try{var d=await getData(payload(sec),!!force);out.innerHTML=render(n,d)}
 catch(err){out.innerHTML=note(err&&err.message||String(err),'error')}
 finally{busy(btn,false)}
}
document.addEventListener('click',function(ev){
 var tile=ev.target.closest&&ev.target.closest('[data-v4-feature]');
 if(tile){
  var n=Number(tile.getAttribute('data-v4-feature'));
  if(n>=41&&n<=50)setTimeout(function(){if(openN(n))mount(n)},0);
  return;
 }
 var b=ev.target.closest&&ev.target.closest('[data-v4-rel-load]');
 if(b){ev.preventDefault();load(b,Number(b.getAttribute('data-v4-rel-load')),true);return}
},false);
document.addEventListener('change',function(ev){
 if(ev.target&&ev.target.matches('[data-v4-rel-days],[data-v4-rel-machine]')){
  var sec=ev.target.closest('.v4-reliability-loss'),b=sec&&sec.querySelector('[data-v4-rel-load]');
  if(b)b.dataset.changed='1';
 }
},false);

window.OMODOS4=Object.assign(window.OMODOS4||{},{
 reliabilityLossVersion:'1',
 reliabilityLossFeatures:[41,42,43,44,45,46,47,48,49,50]
});
})();


/* OMODOS4_OPERATION_INTEL_V1
   Progressive-enhancement views for master-prompt features 51–60.
   Read-only intelligence plus non-persistent scenario runs; existing KPI/Energy/IPAL records are never overwritten. */
(function(){
'use strict';

var OP_CACHE=new Map();
var OP_TTL=30000;

function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function openN(n){
 var el=document.querySelector('#v4-safe-stage .v4-feature-no');
 return !!el&&parseInt(el.textContent,10)===Number(n);
}
function host(){return document.querySelector('#v4-safe-stage .v4-detail-card .v4-detail-body')}
function note(t,kind){return '<div class="v4-interaction-note '+(kind||'')+'"><i class="ph-bold ph-info"></i><span>'+esc(t)+'</span></div>'}
function empty(t){return '<div class="v4-empty">'+esc(t||'Data belum cukup untuk ditampilkan.')+'</div>'}
function fmt(v,d){
 if(v==null||v==='')return '—';
 var n=Number(v);if(!Number.isFinite(n))return String(v);
 try{return new Intl.NumberFormat('id-ID',{maximumFractionDigits:d==null?2:d}).format(n)}catch(e){return String(n)}
}
function value(sec,sel){var e=sec&&sec.querySelector(sel);return e?String(e.value||'').trim():''}
function busy(btn,on,label){
 if(!btn)return;
 if(on){btn.dataset.old=btn.innerHTML;btn.disabled=true;btn.innerHTML='<i class="ph-bold ph-spinner-gap v4-spin"></i> '+esc(label||'Memuat…')}
 else{btn.disabled=false;if(btn.dataset.old)btn.innerHTML=btn.dataset.old}
}
function machineNames(){
 var set=new Set();
 try{(Array.isArray(MACHINES)?MACHINES:[]).forEach(function(m){
  var n=m['Nama Mesin']||m.namaMesin||m['Kode Mesin']||m.kodeMesin;if(n)set.add(String(n));
 })}catch(e){}
 return Array.from(set).sort(function(a,b){return a.localeCompare(b,'id')});
}
function machineOptions(){
 return '<option value="">Semua / level departemen</option>'+machineNames().map(function(n){return '<option value="'+esc(n)+'">'+esc(n)+'</option>'}).join('');
}
function chip(t){return '<span class="v4-risk-chip">'+esc(t||'Bukti data')+'</span>'}
function item(title,sub,right){
 return '<div class="v4-sf-item"><div><strong>'+esc(title)+'</strong><small>'+esc(sub||'')+'</small></div>'+(right||'')+'</div>';
}
function list(arr,fn,limit,msg){
 if(!Array.isArray(arr)||!arr.length)return empty(msg);
 return '<div class="v4-sf-list">'+arr.slice(0,limit||60).map(fn).join('')+'</div>';
}
function metrics(rows){
 return '<div class="v4-statline">'+rows.map(function(x){return '<div><b>'+esc(x[1])+'</b><span>'+esc(x[0])+'</span></div>'}).join('')+'</div>';
}
function scopePayload(sec){
 var p={},m=value(sec,'[data-v4-op-machine]');if(m)p.machine=m;return p;
}
function cacheKey(p){return p.machine||'*'}
async function getOperation(p,force){
 if(!(window.OMODOS4&&typeof window.OMODOS4.serverRead==='function'))return null;
 var k=cacheKey(p),c=OP_CACHE.get(k);
 if(!force&&c&&Date.now()-c.at<OP_TTL)return c.data;
 var d=await window.OMODOS4.serverRead('v4.getKpiStory',p||{});
 if(d)OP_CACHE.set(k,{at:Date.now(),data:d});
 return d;
}
function mount(n){
 var h=host();if(!h||!openN(n))return;
 var old=h.querySelector('.v4-operation-intel');if(old)old.remove();
 var titles={
  51:'KPI Story Mode',52:'KPI Cause Tree',53:'KPI Forecast',54:'Target Recovery Simulator',55:'Maintenance–Production Correlation',
  56:'Energy Anomaly Radar',57:'Energy per Good Output',58:'Utility Digital Twin',59:'IPAL Intelligence',60:'Executive One-Minute Brief'
 };
 var sec=document.createElement('section');sec.className='v4-interaction v4-operation-intel';sec.dataset.v4OpFeature=String(n);
 var machine=n<=55?'<label>Konteks mesin<select data-v4-op-machine>'+machineOptions()+'</select></label>':'';
 var simulator=n===54?'<div class="v4-form-grid">'+
  '<label>Pengurangan waktu mesin berhenti (%)<input type="number" min="0" max="100" step="1" value="10" data-v4-op-down></label>'+
  '<label>Pengurangan masalah berulang (%)<input type="number" min="0" max="100" step="1" value="10" data-v4-op-rec></label>'+
  '<label>Pengurangan risiko stok habis (%)<input type="number" min="0" max="100" step="1" value="10" data-v4-op-stock></label>'+
  '<label>Penyelesaian tugas penting (%)<input type="number" min="0" max="100" step="1" value="20" data-v4-op-close></label>'+
  '</div>':'';
 sec.innerHTML='<div class="v4-interaction-head"><div><span class="v4-eyebrow">OPERATION INTELLIGENCE</span><h3>'+esc(titles[n])+'</h3></div><span class="v4-no-write">'+(n===54?'SCENARIO ONLY':'READ ONLY')+'</span></div>'+
 (machine?'<div class="v4-form-grid">'+machine+'</div>':'')+simulator+
 '<div class="v4-interaction-actions">'+
 (n===54?'<button class="btn btn-primary btn-sm" data-v4-op-sim><i class="ph-bold ph-function"></i> Jalankan Simulasi</button>':'<button class="btn btn-primary btn-sm" data-v4-op-load="'+n+'"><i class="ph-bold ph-arrows-clockwise"></i> Muat Analisis</button>')+
 (n===51||n===52||n===53?'<button class="btn btn-sm" data-v4-open-existing="kpi-department"><i class="ph-bold ph-target"></i> Buka KPI Existing</button>':'')+
 (n===56||n===57||n===58?'<button class="btn btn-sm" data-v4-open-existing="energy-utility"><i class="ph-bold ph-lightning"></i> Buka Energy Existing</button>':'')+
 (n===59?'<button class="btn btn-sm" data-v4-open-existing="report"><i class="ph-bold ph-file-text"></i> Buka Report Existing</button>':'')+
 '</div><div data-v4-op-out>'+note('OMODOS 4.0 memakai catatan sejak 1 September 2026. Simulasi ini tidak mengubah data yang tersimpan.','safe')+'</div>';
 h.prepend(sec);
}
function render51(d){
 return list(d.kpiStories,function(x){
  var sub=(x.story||'')+(x.unit?' • '+x.unit:'');
  return item(x.name||'KPI',sub,chip(x.atRisk?'PERLU PERHATIAN':'OK / DATA'));
 },80)+note('Ringkasan membandingkan hasil yang tercatat dengan target pada periode yang dipilih.','safe');
}
function render52(d){
 var rows=(d.kpiAtRisk||[]).map(function(x){
  var ev=x.causeTree&&Array.isArray(x.causeTree.evidence)?x.causeTree.evidence:[];
  return {name:x.name,status:x.status,evidence:ev};
 });
 return list(rows,function(x){
  var e=x.evidence.map(function(v){return (v.domain||'domain')+': '+(v.records||0)+' record • '+(v.reason||'')}).join(' | ');
  return item(x.name||'KPI at risk',(x.status||'')+(e?' • '+e:''),chip('ASSOCIATION'));
 },50)+note('Bagan ini menunjukkan data yang mungkin berkaitan. Hubungan tersebut belum membuktikan penyebab.','warn');
}
function render53(d){
 var rows=(d.kpiStories||[]).filter(function(x){return x.forecast&&x.forecast.nextValue!=null});
 return list(rows,function(x){
  var f=x.forecast||{};
  return item(x.name||'KPI','Latest '+fmt(x.actual)+' • Target '+fmt(x.target)+' • Trend/bulan '+fmt(f.trendPerMonth),chip('Next '+fmt(f.nextValue)+' • '+(f.confidence||'rendah')));
 },60,'Belum cukup titik data sejak 1 September 2026 untuk membuat proyeksi tren.')+
 note('Perkiraan mengikuti arah data sebelumnya. Hasil sebenarnya bisa berbeda.','warn');
}
function render55(d){
 var c=d.maintenanceProductionCorrelation||{};
 if(typeof c.pearson!=='number')return empty('Data maintenance–production belum cukup untuk korelasi.')+note('Minimal perlu periode berpasangan breakdown dan good output.','safe');
 return metrics([
  ['Pasangan periode',fmt(c.pairs,0)],['Pearson r',fmt(c.pearson,3)],['X','Jam breakdown'],['Y','Good output']
 ])+note('Angka ini menunjukkan seberapa sering dua perubahan terjadi bersama. Angka tersebut tidak membuktikan bahwa satu perubahan menyebabkan yang lain.','warn');
}
function render56(d){
 return list(d.energyAnomalies,function(x){
  return item((x.area||'Area')+' • '+(x.type||'Energy'), 'Value '+fmt(x.value)+' • baseline mean '+fmt(x.baselineMean),chip('z '+fmt(x.zScore,2)));
 },60,'Tidak ada statistical outlier |z| ≥ 2 pada data energi yang cukup.')+
 note('Pemakaian yang jauh berbeda dari kelompok sejenis ditandai untuk diperiksa petugas.','safe');
}
function render57(d){
 return list(d.energyPerGoodOutput,function(x){
  var label=(x.month||'')+' '+(x.year||'');
  var ratio=x.energyPerGoodSheet!=null?x.energyPerGoodSheet:x.ratio;
  var sub=(x.area?x.area+' • ':'')+(x.type?x.type+' • ':'')+'Output '+fmt(x.goodOutput!=null?x.goodOutput:x.output)+' • Source '+(x.source||'');
  return item(label.trim()||'Periode',sub,chip('Energy/Good '+fmt(ratio,6)));
 },80,'Belum ada pasangan energy + good output yang valid.')+
 note('Bandingkan angka hanya jika jenis dan satuan datanya sama.','warn');
}
function render58(d){
 return list(d.utilityDigitalTwin,function(x){
  return item((x.area||'Area')+' • '+(x.type||'Utility'),fmt(x.records,0)+' record pada source existing',chip('Avg '+fmt(x.average,3)));
 },80)+note('Bagian ini merangkum catatan utilitas menurut area dan jenisnya.','safe');
}
function render59(d){
 return list(d.ipalIntelligence,function(x){
  var nums=Array.isArray(x.numericMetrics)?x.numericMetrics.slice(0,5):[];
  var sub=nums.map(function(m){return m.metric+'='+fmt(m.value,3)}).join(' • ');
  return item((x.outlet||'IPAL')+' • '+(x.month||''),String(x.timestamp||'').slice(0,16)+(sub?' • '+sub:''),chip(nums.length+' metric'));
 },80,'Belum ada IPAL report pada source-of-truth window.')+
 note('Angka IPAL berasal dari catatan yang tersedia. Penilaian apakah hasil memenuhi batas resmi tetap perlu merujuk standar yang berlaku.','warn');
}
function render60(d){
 if(!d)return empty('Executive brief belum tersedia.');
 var summary=Array.isArray(d.summary)?d.summary:[];
 var look=Array.isArray(d.thingsToLookAt)?d.thingsToLookAt:[];
 return '<section class="v4-server-section"><div class="v4-server-section-head"><strong>'+esc(d.headline||'Executive One-Minute Brief')+'</strong><span>'+esc(d.confidence||'')+'</span></div>'+
 '<div class="v4-sf-list">'+summary.map(function(x){return item(String(x),'','')}).join('')+'</div></section>'+
 (look.length?'<section class="v4-server-section"><div class="v4-server-section-head"><strong>Perlu Diperhatikan</strong><span>'+look.length+'</span></div>'+
 list(look,function(x){return item(x.title||x.machine||x.type||'Attention',x.reason||x.note||x.description||'',chip(x.priority||x.severity||'REVIEW'))},12)+'</section>':'')+
 note('Ringkasan prioritas dibuat dari catatan OMODOS yang tersedia.','safe');
}
function render(n,d){
 if(!d)return empty('Backend V4 belum tersedia pada sesi/koneksi ini.');
 if(n===51)return render51(d);
 if(n===52)return render52(d);
 if(n===53)return render53(d);
 if(n===55)return render55(d);
 if(n===56)return render56(d);
 if(n===57)return render57(d);
 if(n===58)return render58(d);
 if(n===59)return render59(d);
 if(n===60)return render60(d);
 return empty();
}
async function load(btn,n,force){
 var sec=btn.closest('.v4-operation-intel'),out=sec&&sec.querySelector('[data-v4-op-out]');
 if(!sec||!out)return;
 busy(btn,true,'Memuat');
 try{
  var d;
  if(n===60){
   d=window.OMODOS4&&typeof window.OMODOS4.serverRead==='function'?await window.OMODOS4.serverRead('v4.getBrief',{}):null;
  }else d=await getOperation(scopePayload(sec),!!force);
  out.innerHTML=render(n,d);
 }catch(err){out.innerHTML=note(err&&err.message||String(err),'error')}
 finally{busy(btn,false)}
}
function pct(sec,sel){var n=Number(value(sec,sel));return Math.max(0,Math.min(100,Number.isFinite(n)?n:0))}
async function simulate(btn){
 var sec=btn.closest('.v4-operation-intel'),out=sec&&sec.querySelector('[data-v4-op-out]');
 if(!sec||!out)return;
 if(!(window.OMODOS4&&typeof window.OMODOS4.interactiveAction==='function')){out.innerHTML=note('Scenario engine belum tersedia pada sesi ini.','warn');return}
 var p=scopePayload(sec);
 p.downtimeReductionPct=pct(sec,'[data-v4-op-down]');
 p.recurringReductionPct=pct(sec,'[data-v4-op-rec]');
 p.stockRiskReductionPct=pct(sec,'[data-v4-op-stock]');
 p.actionClosurePct=pct(sec,'[data-v4-op-close]');
 busy(btn,true,'Menghitung');
 try{
  var d=await window.OMODOS4.interactiveAction('v4.runScenario',p);
  var b=d&&d.baseline||{},q=d&&d.projected||{};
  out.innerHTML=metrics([
   ['Downtime baseline',fmt(b.downtimeMinutes,0)+' min'],['Downtime scenario',fmt(q.downtimeMinutes,0)+' min'],
   ['Avoided downtime',fmt(q.avoidedDowntimeMinutes,0)+' min'],['Recurring baseline',fmt(b.recurringPatterns,0)],
   ['Recurring scenario',fmt(q.recurringPatterns,0)],['Sparepart risk scenario',fmt(q.sparepartRisks,0)]
  ])+note('Persentase di atas adalah asumsi Anda. Hasil simulasi bukan prediksi pasti dan tidak mengubah KPI tersimpan.','warn');
 }catch(err){out.innerHTML=note(err&&err.message||String(err),'error')}
 finally{busy(btn,false)}
}
document.addEventListener('click',function(ev){
 var tile=ev.target.closest&&ev.target.closest('[data-v4-feature]');
 if(tile){
  var n=Number(tile.getAttribute('data-v4-feature'));
  if(n>=51&&n<=60)setTimeout(function(){if(openN(n))mount(n)},0);
  return;
 }
 var b=ev.target.closest&&ev.target.closest('[data-v4-op-load]');
 if(b){ev.preventDefault();load(b,Number(b.getAttribute('data-v4-op-load')),true);return}
 var sim=ev.target.closest&&ev.target.closest('[data-v4-op-sim]');
 if(sim){ev.preventDefault();simulate(sim);return}
},false);

window.OMODOS4=Object.assign(window.OMODOS4||{},{
 operationIntelVersion:'1',
 operationIntelFeatures:[51,52,53,54,55,56,57,58,59,60]
});
})();


/* OMODOS4_PEOPLE_INTEL_V1
   Progressive-enhancement views for master-prompt features 61–70.
   Read-only evidence views. Recorded activity/assessment evidence must not be treated as employee performance ratings. */
(function(){
'use strict';

var PEOPLE_CACHE=null,PEOPLE_AT=0,PEOPLE_TTL=30000;

function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function openN(n){
 var el=document.querySelector('#v4-safe-stage .v4-feature-no');
 return !!el&&parseInt(el.textContent,10)===Number(n);
}
function host(){return document.querySelector('#v4-safe-stage .v4-detail-card .v4-detail-body')}
function note(t,kind){return '<div class="v4-interaction-note '+(kind||'')+'"><i class="ph-bold ph-info"></i><span>'+esc(t)+'</span></div>'}
function empty(t){return '<div class="v4-empty">'+esc(t||'Data belum cukup untuk ditampilkan.')+'</div>'}
function fmt(v,d){
 if(v==null||v==='')return '—';
 var n=Number(v);if(!Number.isFinite(n))return String(v);
 try{return new Intl.NumberFormat('id-ID',{maximumFractionDigits:d==null?1:d}).format(n)}catch(e){return String(n)}
}
function val(sec,sel){var e=sec&&sec.querySelector(sel);return e?String(e.value||'').trim():''}
function busy(btn,on,label){
 if(!btn)return;
 if(on){btn.dataset.old=btn.innerHTML;btn.disabled=true;btn.innerHTML='<i class="ph-bold ph-spinner-gap v4-spin"></i> '+esc(label||'Memuat…')}
 else{btn.disabled=false;if(btn.dataset.old)btn.innerHTML=btn.dataset.old}
}
function chip(t){return '<span class="v4-risk-chip">'+esc(t||'Bukti data')+'</span>'}
function item(title,sub,right){
 return '<div class="v4-sf-item"><div><strong>'+esc(title)+'</strong><small>'+esc(sub||'')+'</small></div>'+(right||'')+'</div>';
}
function list(arr,fn,limit,msg){
 if(!Array.isArray(arr)||!arr.length)return empty(msg);
 return '<div class="v4-sf-list">'+arr.slice(0,limit||60).map(fn).join('')+'</div>';
}
function metrics(rows){
 return '<div class="v4-statline">'+rows.map(function(x){return '<div><b>'+esc(x[1])+'</b><span>'+esc(x[0])+'</span></div>'}).join('')+'</div>';
}
function pick(o,keys){
 if(!o||typeof o!=='object')return '';
 for(var i=0;i<keys.length;i++){var k=keys[i];if(o[k]!=null&&String(o[k]).trim())return String(o[k])}
 return '';
}
function machineNamesFromData(d){
 var set=new Set();
 (d&&Array.isArray(d.skillToMachine)?d.skillToMachine:[]).forEach(function(x){if(x.machine)set.add(String(x.machine))});
 return Array.from(set).sort(function(a,b){return a.localeCompare(b,'id')});
}
function peopleNames(d){
 return (d&&Array.isArray(d.personnel)?d.personnel:[]).map(function(x){return x.name}).filter(Boolean).sort(function(a,b){return a.localeCompare(b,'id')});
}
function options(list,first){
 return '<option value="">'+esc(first||'Pilih')+'</option>'+list.map(function(x){return '<option value="'+esc(x)+'">'+esc(x)+'</option>'}).join('');
}
async function getPeople(force){
 if(!force&&PEOPLE_CACHE&&Date.now()-PEOPLE_AT<PEOPLE_TTL)return PEOPLE_CACHE;
 if(!(window.OMODOS4&&typeof window.OMODOS4.serverRead==='function'))return null;
 var d=await window.OMODOS4.serverRead('v4.getPeopleSkillGraph',{});
 if(d){PEOPLE_CACHE=d;PEOPLE_AT=Date.now()}
 return d;
}
function mount(n){
 var h=host();if(!h||!openN(n))return;
 var old=h.querySelector('.v4-people-intel');if(old)old.remove();
 var titles={
  61:'Technician Skill Galaxy',62:'Skill-to-Machine Matrix',63:'Expert Finder',64:'Experience Passport',65:'Knowledge Risk',
  66:'Skill Gap Radar',67:'Adaptive Learning',68:'Mentor Matching',69:'Troubleshooting Challenge',70:'Competency Evidence Engine'
 };
 var controls='';
 if(n===63)controls='<div class="v4-form-grid"><label>Mesin<select data-v4-pi-machine><option value="">Muat data untuk melihat mesin</option></select></label><label class="v4-form-wide">Masalah / gejala<input data-v4-pi-query placeholder="Contoh: sensor register error"></label></div>';
 if(n===64||n===70)controls='<div class="v4-form-grid"><label>Personel<select data-v4-pi-person><option value="">Muat data untuk melihat teknisi</option></select></label></div>';
 var sec=document.createElement('section');sec.className='v4-interaction v4-people-intel';sec.dataset.v4PiFeature=String(n);
 sec.innerHTML='<div class="v4-interaction-head"><div><span class="v4-eyebrow">PEOPLE INTELLIGENCE 4.0</span><h3>'+esc(titles[n])+'</h3></div><span class="v4-no-write">READ ONLY</span></div>'+
 controls+
 '<div class="v4-interaction-actions"><button class="btn btn-primary btn-sm" data-v4-pi-load="'+n+'"><i class="ph-bold ph-arrows-clockwise"></i> Muat Evidence</button>'+
 '<button class="btn btn-sm" data-v4-open-existing="pi-dashboard"><i class="ph-bold ph-users-three"></i> Buka People Intelligence Existing</button></div>'+
 '<div data-v4-pi-out>'+note('Menggabungkan penilaian, riwayat kerja, RCA, proyek, dan pengetahuan yang tercatat. Banyaknya catatan bukan nilai kinerja karyawan.','safe')+'</div>';
 h.prepend(sec);
}
function hydrateControls(sec,d){
 var ms=sec.querySelector('[data-v4-pi-machine]');
 if(ms&&ms.options.length<=1)ms.innerHTML=options(machineNamesFromData(d),'Semua mesin');
 var ps=sec.querySelector('[data-v4-pi-person]');
 if(ps&&ps.options.length<=1)ps.innerHTML=options(peopleNames(d),'Pilih personel');
}
function render61(d){
 var rows=d.personnel||[];
 return metrics([
  ['Personnel master',fmt(d.counts&&d.counts.personnel,0)],['Linked people',fmt(d.counts&&d.counts.linkedPeople,0)],
  ['Hard assessment',fmt(d.counts&&d.counts.hard,0)],['Soft assessment',fmt(d.counts&&d.counts.soft,0)]
 ])+
 list(rows,function(x){
  var machines=Array.isArray(x.machines)&&x.machines.length?x.machines.slice(0,4).join(', '):'belum ada machine evidence';
  return item(x.name||'Personel',(x.position||'Posisi belum tercatat')+' • '+machines+' • RCA '+fmt(x.rcaCount,0)+' • Knowledge '+fmt(x.knowledgeCount,0),chip('Evidence '+fmt(x.evidenceScore,0)));
 },80)+note('Jumlah catatan membantu menemukan pengalaman terkait; angka ini bukan nilai kemampuan atau kinerja.','warn');
}
function render62(d){
 return list(d.skillToMachine,function(x){
  return item(x.person||'Personel',(x.machine||'Mesin')+' • Logbook '+fmt(x.logbook,0)+' • RCA '+fmt(x.rca,0)+' • Last seen '+String(x.lastSeen||'—').slice(0,10),chip(fmt(x.evidenceEvents,0)+' event'));
 },100)+note('Hubungan teknisi dan mesin berasal dari pekerjaan yang tercatat; petugas tetap perlu memastikan kewenangannya.','safe');
}
function render65(d){
 return list(d.knowledgeRisk,function(x){
  return item(x.machine||'Mesin','Experienced people '+fmt(x.experiencedPeople,0)+' • Evidence '+fmt(x.evidenceEvents,0)+' • Knowledge '+fmt(x.knowledgeArticles,0)+' • RCA '+fmt(x.rca,0),chip((x.risk||'')+' '+fmt(x.riskScore,0)));
 },100)+note('Jika pengetahuan hanya tercatat pada sedikit orang, pertimbangkan berbagi pengalaman atau melengkapi dokumentasi.','warn');
}
function gapText(x){
 var g=x&&x.gap;
 if(g&&typeof g==='object')return pick(g,['Unit Kompetensi','Kriteria Unjuk Kerja','Elemen Unit','Penjelasan Belum Kompeten','Status','Keterangan'])||'Recorded competency gap';
 return String(g||'Recorded competency gap');
}
function render66(d){
 return list(d.skillGapRadar,function(x){
  return item(x.person||'Personel',(x.position||'Posisi belum tercatat')+' • '+gapText(x),chip('Tercatat GAP'));
 },100)+note('Daftar ini hanya menunjukkan kebutuhan belajar yang tercatat dalam penilaian.','safe');
}
function render67(d){
 return list(d.adaptiveLearning,function(x){
  return item(x.person||'Personel',gapText(x)+' • '+(x.recommendation||'Review standard/evidence dan rencanakan learning bersama atasan/mentor.'),chip('HUMAN PLAN'));
 },100)+note('Saran belajar berasal dari kebutuhan yang tercatat. Atasan dan teknisi menentukan rencana belajarnya.','warn');
}
function render68(d){
 return list(d.mentorMatches,function(x){
  var mentors=(x.mentors||[]).map(function(m){return m.name+' ['+(m.sharedMachines||[]).slice(0,3).join(', ')+']'}).join(' • ');
  return item(x.mentee||'Mentee candidate',mentors||'Belum ada mentor candidate',chip('CANDIDATE'));
 },100)+note('Calon mentor dipilih dari pengalaman yang tercatat. Penunjukan mentor tetap perlu persetujuan.','warn');
}
function render69(d){
 return list(d.troubleshootingChallenges,function(x){
  var e=x.evidence||{};
  return item(x.title||'Troubleshooting Challenge',(x.machine||'Mesin')+' • Recurring '+fmt(e.recurring,0)+' • Downtime '+fmt(e.downtimeMinutes,0)+' min • Open '+fmt(e.openIssues,0),chip('READ-ONLY TRAINING'));
 },50)+note('Latihan memakai kasus yang pernah tercatat. Jawaban latihan tidak mengubah Logbook atau RCA.','safe');
}
function render70Person(p){
 if(!p)return empty('Pilih personel lalu muat evidence.');
 var ev=p.competencyEvidence||{};
 return metrics([
  ['Hard assessment',fmt(p.hardAssessments,0)],['Soft assessment',fmt(p.softAssessments,0)],
  ['Competent field',fmt(p.competent,0)],['Not competent field',fmt(p.notCompetent,0)],
  ['RCA evidence',fmt(p.rcaCount,0)],['Knowledge',fmt(p.knowledgeCount,0)]
 ])+
 list(p.machineEvidence,function(x){
  return item(x.machine||'Mesin','Event '+fmt(x.events,0)+' • Logbook '+fmt(x.logbook,0)+' • RCA '+fmt(x.rca,0)+' • Last '+(x.lastSeen?new Date(x.lastSeen).toISOString().slice(0,10):'—'),chip('MACHINE Bukti data'));
 },30)+
 note('Bagian ini mengumpulkan bukti pengalaman dan penilaian yang sudah ada. Sistem tidak memberi nilai kinerja otomatis.','warn');
}
function passportView(p){
 if(!p||p.label==='NOT AVAILABLE')return empty('Riwayat pengalaman belum tersedia untuk teknisi ini.');
 var machines=Array.isArray(p.machines)&&p.machines.length?p.machines.join(', '):'belum ada machine evidence';
 return metrics([
  ['Hard assessment',fmt(p.hardAssessments,0)],['Soft assessment',fmt(p.softAssessments,0)],
  ['RCA',fmt(p.rcaCount,0)],['Knowledge',fmt(p.knowledgeCount,0)]
 ])+
 '<div class="v4-sf-list">'+item(p.name||'Personel',(p.position||'Posisi belum tercatat')+' • Machines: '+machines,chip('DERIVED PASSPORT'))+'</div>'+
 note('Riwayat ini merangkum pekerjaan yang tercatat. Isinya bukan penilaian kinerja resmi.','safe');
}
async function render63(sec,out){
 var machine=val(sec,'[data-v4-pi-machine]'),query=val(sec,'[data-v4-pi-query]');
 if(!machine&&!query){out.innerHTML=note('Pilih mesin atau isi problem/gejala agar Expert Finder tidak terlalu luas.','warn');return}
 var d=await window.OMODOS4.serverRead('v4.getExpertFinder',{machine:machine,query:query});
 out.innerHTML=list(d&&d.experts,function(x){
  return item(x.name||'Personel','Recorded events '+fmt(x.events,0)+' • Machine events '+fmt(x.machineEvents,0)+' • Similar evidence '+fmt(x.similarityEvidence,0)+' • Hard assessments '+fmt(x.hardSkillAssessments,0),chip('Evidence match '+fmt(x.score,0)));
 },30)+note('Urutan orang didasarkan pada keterlibatan dalam kasus serupa, bukan peringkat kinerja.','warn');
}
async function render64(sec,out){
 var name=val(sec,'[data-v4-pi-person]');
 if(!name){out.innerHTML=empty('Pilih personel untuk membuka Experience Passport.');return}
 var p=await window.OMODOS4.serverRead('v4.getExperiencePassport',{name:name});
 out.innerHTML=passportView(p);
}
async function load(btn,n,force){
 var sec=btn.closest('.v4-people-intel'),out=sec&&sec.querySelector('[data-v4-pi-out]');
 if(!sec||!out)return;
 busy(btn,true,'Memuat');
 try{
  var d=await getPeople(!!force);
  if(!d){out.innerHTML=empty('Backend People Intelligence belum tersedia pada sesi ini.');return}
  hydrateControls(sec,d);
  if(n===61)out.innerHTML=render61(d);
  else if(n===62)out.innerHTML=render62(d);
  else if(n===63)await render63(sec,out);
  else if(n===64)await render64(sec,out);
  else if(n===65)out.innerHTML=render65(d);
  else if(n===66)out.innerHTML=render66(d);
  else if(n===67)out.innerHTML=render67(d);
  else if(n===68)out.innerHTML=render68(d);
  else if(n===69)out.innerHTML=render69(d);
  else if(n===70){
   var name=val(sec,'[data-v4-pi-person]');
   var p=(d.personnel||[]).find(function(x){return String(x.name||'')===name});
   out.innerHTML=render70Person(p);
  }
 }catch(err){out.innerHTML=note(err&&err.message||String(err),'error')}
 finally{busy(btn,false)}
}
document.addEventListener('click',function(ev){
 var tile=ev.target.closest&&ev.target.closest('[data-v4-feature]');
 if(tile){
  var n=Number(tile.getAttribute('data-v4-feature'));
  if(n>=61&&n<=70)setTimeout(function(){if(openN(n))mount(n)},0);
  return;
 }
 var b=ev.target.closest&&ev.target.closest('[data-v4-pi-load]');
 if(b){ev.preventDefault();load(b,Number(b.getAttribute('data-v4-pi-load')),true);return}
},false);

window.OMODOS4=Object.assign(window.OMODOS4||{},{
 peopleIntelVersion:'1',
 peopleIntelFeatures:[61,62,63,64,65,66,67,68,69,70]
});
})();


/* OMODOS4_AI_INTELLIGENCE_V2
   Progressive-enhancement UI for master-prompt features 71–80.
   Reuses existing v4.aiAsk / V4 read endpoints, never auto-writes operational source data,
   and always keeps evidence, confidence, source visibility, and human review in the UI. */
(function(){
'use strict';

var AI2_CFG={
 71:{purpose:'ask',title:'Ask OMODOS 4.0',machine:'optional',placeholder:'Tanyakan kondisi maintenance, risiko, histori, sparepart, KPI, atau evidence lain.',defaultText:''},
 72:{purpose:'machine',title:'Machine Copilot',machine:'required',placeholder:'Tanyakan kondisi, histori, pola masalah, atau risiko mesin terpilih.',defaultText:'Jelaskan kondisi terkini, pola masalah, risiko yang perlu diperiksa, dan evidence pendukung mesin ini.'},
 73:{purpose:'shift',title:'Shift Copilot',machine:'optional',placeholder:'Tambahkan konteks handover shift bila diperlukan.',defaultText:'Buat brief handover shift: perubahan penting, open issue, risiko, dan tindakan yang harus diteruskan.'},
 74:{purpose:'morning-brief',title:'Morning Maintenance Brief',machine:'optional',placeholder:'Tambahkan fokus brief pagi bila diperlukan.',defaultText:'Buat Morning Maintenance Brief yang ringkas, evidence-first, dan prioritaskan hal yang perlu ditindaklanjuti.'},
 75:{purpose:'rca-draft',title:'Auto RCA Draft',machine:'optional',placeholder:'Tuliskan problem / symptom. Root cause final tetap harus diverifikasi manusia.',defaultText:''},
 76:{purpose:'troubleshooting',title:'Troubleshooting Similarity Search',machine:'optional',placeholder:'Tuliskan symptom / problem untuk mencari historical case yang mirip.',defaultText:''},
 77:{purpose:'manual',title:'Manual Whisperer',machine:'required',placeholder:'Tanyakan hal yang ingin dipahami dari manual / knowledge yang tersedia untuk mesin ini.',defaultText:''},
 78:{purpose:'harvest',title:'Knowledge Auto-Harvest',machine:'none',placeholder:'',defaultText:''},
 79:{purpose:'translate',title:'Maintenance Translator',machine:'none',placeholder:'Masukkan istilah / kalimat maintenance yang ingin diterjemahkan atau dinormalisasi.',defaultText:''},
 80:{purpose:'skeptic',title:'AI Skeptic Mode',machine:'optional',placeholder:'Tuliskan diagnosis, asumsi, atau keputusan yang ingin diuji secara kritis.',defaultText:''}
};

function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function openN(n){
 var el=document.querySelector('#v4-safe-stage .v4-feature-no');
 return !!el&&parseInt(el.textContent,10)===Number(n);
}
function host(){return document.querySelector('#v4-safe-stage .v4-detail-card .v4-detail-body')}
function note(t,kind){return '<div class="v4-interaction-note '+(kind||'')+'"><i class="ph-bold ph-info"></i><span>'+esc(t)+'</span></div>'}
function empty(t){return '<div class="v4-empty">'+esc(t||'Data belum cukup untuk ditampilkan.')+'</div>'}
function chip(t){return '<span class="v4-risk-chip">'+esc(t||'Bukti data')+'</span>'}
function busy(btn,on,label){
 if(!btn)return;
 if(on){btn.dataset.old=btn.innerHTML;btn.disabled=true;btn.innerHTML='<i class="ph-bold ph-spinner-gap v4-spin"></i> '+esc(label||'Memproses…')}
 else{btn.disabled=false;if(btn.dataset.old)btn.innerHTML=btn.dataset.old}
}
function val(sec,sel){var e=sec&&sec.querySelector(sel);return e?String(e.value||'').trim():''}
function fmt(v,d){
 if(v==null||v==='')return '—';
 var n=Number(v);if(!Number.isFinite(n))return String(v);
 try{return new Intl.NumberFormat('id-ID',{maximumFractionDigits:d==null?2:d}).format(n)}catch(e){return String(n)}
}
function first(o,keys){
 if(!o||typeof o!=='object')return '';
 for(var i=0;i<keys.length;i++){var k=keys[i];if(o[k]!=null&&String(o[k]).trim())return String(o[k])}
 return '';
}
function names(){
 var set=new Set();
 try{(Array.isArray(MACHINES)?MACHINES:[]).forEach(function(m){var n=m['Nama Mesin']||m.namaMesin||m['Kode Mesin']||m.kodeMesin;if(n)set.add(String(n))})}catch(e){}
 try{(Array.isArray(ENTRIES)?ENTRIES:[]).forEach(function(m){var n=m['Nama Mesin']||m.namaMesin||m['Kode Mesin']||m.kodeMesin;if(n)set.add(String(n))})}catch(e){}
 return Array.from(set).sort(function(a,b){return a.localeCompare(b,'id')});
}
function machineOptions(blank){
 return '<option value="">'+esc(blank||'Semua mesin')+'</option>'+names().map(function(n){return '<option value="'+esc(n)+'">'+esc(n)+'</option>'}).join('');
}
function actionReady(){return !!(window.OMODOS4&&typeof window.OMODOS4.interactiveAction==='function')}
function readReady(){return !!(window.OMODOS4&&typeof window.OMODOS4.serverRead==='function')}
function action(action,payload){
 if(!actionReady())return Promise.reject(new Error('Backend V4 interaction belum tersedia pada sesi ini.'));
 return window.OMODOS4.interactiveAction(action,payload||{});
}
function read(actionName,payload){
 if(!readReady())return Promise.resolve(null);
 return window.OMODOS4.serverRead(actionName,payload||{});
}
function evidenceTitle(e){
 if(!e||typeof e!=='object')return String(e||'Evidence');
 var r=e.record&&typeof e.record==='object'?e.record:e;
 return first(r,['Nama Mesin','namaMesin','Machine','Mesin','Title','Judul','Problem','Deskripsi Masalah','Deskripsi','description','Nama Material','Nama','ID'])||
        first(e,['machine','title','problem','description','sheet','source'])||'Evidence';
}
function evidenceHtml(arr,limit){
 if(!Array.isArray(arr)||!arr.length)return empty('Tidak ada evidence source tambahan yang ditemukan.');
 return '<div class="v4-sf-list">'+arr.slice(0,limit||16).map(function(e){
  var src=first(e,['sheet','source','type','label'])||'OMODOS';
  var machine=first(e,['machine']);
  var score=e&&e.score!=null?' • score '+fmt(e.score,2):'';
  return '<div class="v4-sf-item"><div><strong>'+esc(evidenceTitle(e))+'</strong><small>'+esc(src+(machine?' • '+machine:'')+score)+'</small></div>'+chip('SOURCE')+'</div>';
 }).join('')+'</div>';
}
function aiHtml(d){
 d=d||{};
 var summary=first(d,['summary','answer'])||'Belum ada ringkasan.';
 var assumptions=Array.isArray(d.assumptions)?d.assumptions:[];
 var evidence=Array.isArray(d.evidence)?d.evidence:[];
 var recommendation=first(d,['recommendation']);
 var provider=d.providerStatus==='unavailable'?'Layanan bantuan belum tersedia • ringkasan diambil dari catatan':(d.modelUsed?'Model: '+d.modelUsed:'Berdasarkan catatan');
 return '<div class="v4-ai-result">'+
  '<div class="v4-interaction-result-head"><span class="v4-server-badge">'+esc(d.mode||'OMODOS AI')+'</span><span>Tingkat keyakinan: '+esc(d.confidence||'belum tersedia')+'</span></div>'+
  '<div class="v4-ai-answer">'+esc(summary).replace(/\n/g,'<br>')+'</div>'+
  '<div class="v4-statline"><div><b>'+esc(evidence.length)+'</b><span>Sumber catatan</span></div><div><b>'+esc(d.humanReviewRequired===false?'Tidak':'Ya')+'</b><span>Periksa oleh petugas</span></div><div><b>'+esc(provider)+'</b><span>Mode</span></div></div>'+
  (assumptions.length?'<div class="v4-assumptions"><strong>Asumsi / batasan</strong><ul>'+assumptions.slice(0,8).map(function(a){return '<li>'+esc(a)+'</li>'}).join('')+'</ul></div>':'')+
  (recommendation?note(recommendation,'safe'):'')+
  evidenceHtml(evidence,16)+
  note('Jawaban asisten dapat membantu mengambil keputusan. Periksa sumbernya; data pekerjaan tidak berubah otomatis.','warn')+
 '</div>';
}
function removeOlder(n,h){
 Array.from(h.querySelectorAll('.v4-interaction[data-v4-interaction-feature="'+n+'"],.v4-ai2-interaction')).forEach(function(x){x.remove()});
}
function controls(n,cfg){
 if(n===78)return '';
 var machine='';
 if(cfg.machine!=='none'){
  var blank=cfg.machine==='required'?'Pilih mesin':'Semua mesin / tidak dibatasi';
  machine='<label>Mesin '+(cfg.machine==='required'?'<b>*</b>':'(opsional)')+'<select data-v4-ai2-machine>'+machineOptions(blank)+'</select></label>';
 }
 return '<div class="v4-form-grid">'+machine+
  '<label class="v4-form-wide">'+(n===79?'Istilah / kalimat':'Pertanyaan / konteks')+
  '<textarea data-v4-ai2-query rows="4" maxlength="4000" placeholder="'+esc(cfg.placeholder)+'">'+esc(cfg.defaultText)+'</textarea></label></div>';
}
function buttons(n){
 var extra='';
 if(n===71||n===72||n===73||n===74||n===79||n===80)extra='<button class="btn btn-sm" data-v4-open-copilot><i class="ph-bold ph-brain"></i> Buka Copilot Existing</button>';
 if(n===75)extra='<button class="btn btn-sm" data-v4-open-existing="diagnostic"><i class="ph-bold ph-file-magnifying-glass"></i> Buka RCA Existing</button>';
 if(n===77||n===78)extra='<button class="btn btn-sm" data-v4-open-existing="knowledge"><i class="ph-bold ph-books"></i> Buka Knowledge Existing</button>';
 return '<div class="v4-interaction-actions"><button class="btn btn-primary btn-sm" data-v4-ai2-run="'+n+'"><i class="ph-bold ph-sparkle"></i> '+(n===78?'Muat Kandidat':'Jalankan')+'</button>'+extra+'</div>';
}
function intro(n){
 var text='Evidence diambil dari source OMODOS existing. AI tidak boleh mengubah data operasional otomatis.';
 if(n===72)text='Machine Copilot memakai server-side machine scope. Evidence dari mesin lain tidak ikut dicari ketika satu mesin dipilih.';
 if(n===75)text='Auto RCA hanya membuat DRAFT. Root cause final, corrective action, dan commit RCA wajib diverifikasi manusia.';
 if(n===76)text='Similarity Search mengutamakan historical case retrieval. Kemiripan teks bukan bukti root cause identik.';
 if(n===77)text='Manual Whisperer tidak boleh mengarang isi manual. Jika manual hanya berupa link/metadata, sistem akan menyatakan batasannya.';
 if(n===78)text='Knowledge Auto-Harvest hanya menghasilkan kandidat. Penyimpanan artikel tetap melalui Knowledge Base existing setelah review.';
 if(n===79)text='Translator menjaga makna teknis; hasil terjemahan perlu diperiksa bila menyangkut prosedur keselamatan atau spesifikasi.';
 if(n===80)text='Skeptic Mode sengaja mencari alternative explanation, missing evidence, dan asumsi yang perlu diuji.';
 return note(text,'safe');
}
function mount(n){
 n=Number(n);var cfg=AI2_CFG[n],h=host();if(!cfg||!h||!openN(n))return;
 removeOlder(n,h);
 var sec=document.createElement('section');
 sec.className='v4-interaction v4-ai2-interaction';
 sec.setAttribute('data-v4-ai2-feature',String(n));
 sec.innerHTML='<div class="v4-interaction-head"><div><span class="v4-eyebrow">ASISTEN • BERDASARKAN CATATAN</span><h3>'+esc(cfg.title)+'</h3></div><span class="v4-no-write">Tidak menyimpan otomatis</span></div>'+
  intro(n)+controls(n,cfg)+buttons(n)+'<div data-v4-ai2-out></div>';
 h.prepend(sec);
}
async function getBriefContext(machine){
 var d=await read('v4.getBrief',machine?{machine:machine}:{});
 return d||null;
}
function briefHtml(d){
 if(!d)return '';
 var s=Array.isArray(d.summary)?d.summary:[];
 var look=Array.isArray(d.thingsToLookAt)?d.thingsToLookAt:[];
 return '<section class="v4-server-section"><div class="v4-server-section-head"><strong>Deterministic brief baseline</strong><span>'+esc(d.confidence||'')+'</span></div>'+
 (s.length?'<div class="v4-sf-list">'+s.slice(0,8).map(function(x){return '<div class="v4-sf-item"><div><strong>'+esc(x)+'</strong></div>'+chip('Tercatat/DERIVED')+'</div>'}).join('')+'</div>':'')+
 (look.length?evidenceHtml(look,8):'')+'</section>';
}
function passportHtml(d){
 if(!d)return '';
 var c=d.currentCondition||{},r=d.reliability||{},k=d.knowledge||{},manual=k.manual||{};
 var hasManual=!!(manual.manualPdf||manual.reference);
 return '<section class="v4-server-section"><div class="v4-server-section-head"><strong>Machine-scoped context</strong><span>'+esc(d.logicVersion||'')+'</span></div>'+
 '<div class="v4-statline"><div><b>'+esc(c.healthIndex==null?'—':c.healthIndex)+'</b><span>Nilai kesehatan</span></div><div><b>'+esc(c.currentRisk||'—')+'</b><span>Risiko saat ini</span></div><div><b>'+esc(r.failureCount==null?'—':r.failureCount)+'</b><span>Catatan kerusakan</span></div><div><b>'+esc(r.downtimeMinutes==null?'—':r.downtimeMinutes)+'</b><span>Menit berhenti</span></div></div>'+
 note(hasManual?'Manual/reference metadata tercatat untuk mesin ini.':'Manual/reference belum tercatat pada Machine Master.','safe')+
 '</section>';
}
function similarityHtml(d){
 if(!d)return '';
 var hits=Array.isArray(d.hits)?d.hits:[];
 return '<section class="v4-server-section"><div class="v4-server-section-head"><strong>Historical similarity</strong><span>Tingkat keyakinan: '+esc(d.confidence||'')+'</span></div>'+
 evidenceHtml(hits,18)+note(d.note||'Similarity adalah retrieval evidence, bukan bukti root cause identik.','warn')+'</section>';
}
function candidateHtml(d){
 var rows=d&&Array.isArray(d.candidates)?d.candidates:[];
 var head='<div class="v4-interaction-result-head"><span>'+rows.length+' kandidat</span><span>Artikel yang ada: '+esc(d&&d.existingKnowledgeRecords==null?'—':d.existingKnowledgeRecords)+'</span></div>';
 var body=rows.length?'<div class="v4-sf-list">'+rows.slice(0,60).map(function(x){
  var sourceIds=Array.isArray(x.sourceIds)&&x.sourceIds.length?' • Source IDs '+x.sourceIds.slice(0,5).join(', '):'';
  var sub=(x.machine||'Mesin belum tercatat')+' • Recurrence '+fmt(x.recurrence,0)+' • '+(x.problem||'Problem belum tercatat')+
   (x.mostRecordedAction?' • Action: '+x.mostRecordedAction:'')+sourceIds;
  return '<div class="v4-sf-item"><div><strong>'+esc(x.label||'KNOWLEDGE_DRAFT_CANDIDATE')+'</strong><small>'+esc(sub)+'</small></div>'+chip(x.existingKnowledgePossibleMatch?'CHECK EXISTING KB':'DRAFT CANDIDATE')+'</div>';
 }).join('')+'</div>':empty('Belum ada knowledge candidate dari recurring solved case / RCA.');
 return head+body+note(d&&d.note||'Review existing Knowledge Base lebih dulu untuk mencegah duplikasi.','warn');
}
async function run78(sec,out){
 var d=await read('v4.getKnowledgeCandidates',{});
 if(!d)throw new Error('Knowledge candidate endpoint belum tersedia.');
 out.innerHTML=candidateHtml(d);
}
async function run72(sec,out,q,m){
 var passport=await read('v4.getMachinePassport',{machine:m});
 var ai=await action('v4.aiAsk',{query:q,purpose:'machine',machine:m});
 out.innerHTML=passportHtml(passport)+aiHtml(ai);
}
async function run73or74(n,sec,out,q,m){
 var brief=await getBriefContext(m);
 var briefText=brief&&Array.isArray(brief.summary)?brief.summary.join(' | '):'';
 var enriched=q+(briefText?'\nInternal brief context: '+briefText:'');
 var ai=await action('v4.aiAsk',{query:enriched.slice(0,4000),purpose:AI2_CFG[n].purpose,machine:m||''});
 out.innerHTML=briefHtml(brief)+aiHtml(ai);
}
async function run75(sec,out,q,m){
 var sim=await read('v4.getFailureMemory',{query:q,machine:m||''});
 var ai=await action('v4.aiAsk',{query:q,purpose:'rca-draft',machine:m||''});
 out.innerHTML=similarityHtml(sim)+aiHtml(ai)+note('Draf RCA belum tersimpan sebagai laporan. Periksa fakta dan penyebabnya sebelum menyimpan melalui halaman RCA.','warn');
}
async function run76(sec,out,q,m){
 var sim=await read('v4.getFailureMemory',{query:q,machine:m||''});
 var ai=await action('v4.aiAsk',{query:q,purpose:'troubleshooting',machine:m||''});
 out.innerHTML=similarityHtml(sim)+aiHtml(ai);
}
async function run77(sec,out,q,m){
 var passport=await read('v4.getMachinePassport',{machine:m});
 var ai=await action('v4.aiAsk',{query:q,purpose:'manual',machine:m});
 out.innerHTML=passportHtml(passport)+aiHtml(ai)+note('Tautan manual tidak berarti isinya sudah dibaca asisten. Periksa jawaban dengan dokumen yang tersedia.','warn');
}
async function runGeneric(n,sec,out,q,m){
 var ai=await action('v4.aiAsk',{query:q,purpose:AI2_CFG[n].purpose,machine:m||''});
 out.innerHTML=aiHtml(ai);
}
async function run(btn,n){
 var cfg=AI2_CFG[n],sec=btn.closest('.v4-ai2-interaction'),out=sec&&sec.querySelector('[data-v4-ai2-out]');
 if(!cfg||!sec||!out)return;
 if(n===78){busy(btn,true,'Memuat');try{await run78(sec,out)}catch(e){out.innerHTML=note(e.message||String(e),'error')}finally{busy(btn,false)}return}
 var q=val(sec,'[data-v4-ai2-query]'),m=val(sec,'[data-v4-ai2-machine]');
 if(!q){out.innerHTML=note('Isi pertanyaan / konteks terlebih dahulu.','warn');return}
 if(cfg.machine==='required'&&!m){out.innerHTML=note('Pilih satu mesin agar evidence tidak bercampur.','warn');return}
 busy(btn,true,'Menganalisis');out.innerHTML=note('Mencari jawaban dari catatan OMODOS…','safe');
 try{
  if(n===72)await run72(sec,out,q,m);
  else if(n===73||n===74)await run73or74(n,sec,out,q,m);
  else if(n===75)await run75(sec,out,q,m);
  else if(n===76)await run76(sec,out,q,m);
  else if(n===77)await run77(sec,out,q,m);
  else await runGeneric(n,sec,out,q,m);
 }catch(e){out.innerHTML=note(e.message||String(e),'error')}
 finally{busy(btn,false)}
}
document.addEventListener('click',function(ev){
 var tile=ev.target.closest&&ev.target.closest('[data-v4-feature]');
 if(tile){
  var n=Number(tile.getAttribute('data-v4-feature'));
  if(n>=71&&n<=80)setTimeout(function(){if(openN(n))mount(n)},0);
  return;
 }
 var b=ev.target.closest&&ev.target.closest('[data-v4-ai2-run]');
 if(b){ev.preventDefault();run(b,Number(b.getAttribute('data-v4-ai2-run')));return}
},false);

window.OMODOS4=Object.assign(window.OMODOS4||{},{
 aiIntelligenceVersion:'2',
 aiIntelligenceFeatures:[71,72,73,74,75,76,77,78,79,80],
 aiMachineEvidenceScope:'SERVER_FILTERED'
});
})();


/* OMODOS4_IMPROVEMENT_INTEL_V1
   Progressive-enhancement views for master-prompt features 81–90.
   Read-only evidence + draft-only AI. Project/Kaizen/SGA source records are never auto-created or overwritten. */
(function(){
'use strict';

var IMP_CACHE=null,IMP_AT=0,IMP_TTL=30000;

function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function openN(n){
 var el=document.querySelector('#v4-safe-stage .v4-feature-no');
 return !!el&&parseInt(el.textContent,10)===Number(n);
}
function host(){return document.querySelector('#v4-safe-stage .v4-detail-card .v4-detail-body')}
function note(t,kind){return '<div class="v4-interaction-note '+(kind||'')+'"><i class="ph-bold ph-info"></i><span>'+esc(t)+'</span></div>'}
function empty(t){return '<div class="v4-empty">'+esc(t||'Data belum cukup untuk ditampilkan.')+'</div>'}
function fmt(v,d){
 if(v==null||v==='')return '—';
 var n=Number(v);if(!Number.isFinite(n))return String(v);
 try{return new Intl.NumberFormat('id-ID',{maximumFractionDigits:d==null?1:d}).format(n)}catch(e){return String(n)}
}
function chip(t){return '<span class="v4-risk-chip">'+esc(t||'Bukti data')+'</span>'}
function item(title,sub,right){
 return '<div class="v4-sf-item"><div><strong>'+esc(title)+'</strong><small>'+esc(sub||'')+'</small></div>'+(right||'')+'</div>';
}
function list(arr,fn,limit,msg){
 if(!Array.isArray(arr)||!arr.length)return empty(msg);
 return '<div class="v4-sf-list">'+arr.slice(0,limit||60).map(fn).join('')+'</div>';
}
function metrics(rows){
 return '<div class="v4-statline">'+rows.map(function(x){return '<div><b>'+esc(x[1])+'</b><span>'+esc(x[0])+'</span></div>'}).join('')+'</div>';
}
function first(o,keys){
 if(!o||typeof o!=='object')return '';
 for(var i=0;i<keys.length;i++){var k=keys[i];if(o[k]!=null&&String(o[k]).trim())return String(o[k])}
 return '';
}
function val(sec,sel){var e=sec&&sec.querySelector(sel);return e?String(e.value||'').trim():''}
function busy(btn,on,label){
 if(!btn)return;
 if(on){btn.dataset.old=btn.innerHTML;btn.disabled=true;btn.innerHTML='<i class="ph-bold ph-spinner-gap v4-spin"></i> '+esc(label||'Memuat…')}
 else{btn.disabled=false;if(btn.dataset.old)btn.innerHTML=btn.dataset.old}
}
function machineNames(){
 var set=new Set();
 try{(Array.isArray(MACHINES)?MACHINES:[]).forEach(function(m){var n=m['Nama Mesin']||m.namaMesin||m['Kode Mesin']||m.kodeMesin;if(n)set.add(String(n))})}catch(e){}
 try{(Array.isArray(ENTRIES)?ENTRIES:[]).forEach(function(m){var n=m['Nama Mesin']||m.namaMesin||m['Kode Mesin']||m.kodeMesin;if(n)set.add(String(n))})}catch(e){}
 return Array.from(set).sort(function(a,b){return a.localeCompare(b,'id')});
}
function machineOptions(){return '<option value="">Semua mesin / tidak dibatasi</option>'+machineNames().map(function(n){return '<option value="'+esc(n)+'">'+esc(n)+'</option>'}).join('')}
function read(action,payload){
 if(!(window.OMODOS4&&typeof window.OMODOS4.serverRead==='function'))return Promise.resolve(null);
 return window.OMODOS4.serverRead(action,payload||{});
}
function act(action,payload){
 if(!(window.OMODOS4&&typeof window.OMODOS4.interactiveAction==='function'))return Promise.reject(new Error('Backend V4 interaction belum tersedia.'));
 return window.OMODOS4.interactiveAction(action,payload||{});
}
async function getImprovement(force){
 if(!force&&IMP_CACHE&&Date.now()-IMP_AT<IMP_TTL)return IMP_CACHE;
 var d=await read('v4.getImprovement',{});
 if(d){IMP_CACHE=d;IMP_AT=Date.now()}
 return d;
}
function removeOlder(n,h){
 Array.from(h.querySelectorAll('.v4-interaction[data-v4-interaction-feature="'+n+'"],.v4-improvement-intel')).forEach(function(x){x.remove()});
}
function intro(n){
 var t={
 81:'Mencari recurring/loss evidence yang belum tampak ter-cover oleh improvement open existing. Hasil adalah kandidat review, bukan perintah membuat project baru.',
 82:'Auto Kaizen hanya membuat DRAFT berbasis evidence. Penyimpanan tetap melalui modul Kaizen/Project existing setelah review manusia.',
 83:'Benefit Verification memeriksa kelengkapan field evidence yang tercatat; coverage bukan bukti bahwa benefit finansial atau operasional sudah terealisasi.',
 84:'Timeline menampilkan before/after Kaizen yang benar-benar tercatat, tanpa membuat foto atau hasil baru.',
 85:'Idea Marketplace mengumpulkan improvement open existing agar mudah ditelusuri; tidak menggandakan record.',
 86:'Similarity hanya menandai kemungkinan overlap. Sistem tidak boleh menyatakan dua Kaizen duplicate secara otomatis.',
 87:'Risk Radar menonjolkan project overdue/open dari source existing; keputusan eskalasi tetap manusia.',
 88:'SGA Story Builder menyusun cerita dari field SGA recorded saja dan tidak mengarang achievement.',
 89:'Knowledge Graph memakai Factory Brain derived graph dari Project/Kaizen/SGA ↔ mesin/failure/knowledge existing.',
 90:'Legacy mengelompokkan histori improvement existing per tahun untuk melihat continuity, bukan memberi ranking tim.'
 };
 return note(t[n]||'Read-only improvement intelligence.','safe');
}
function controls(n){
 if(n===82)return '<div class="v4-form-grid"><label>Mesin (opsional)<select data-v4-imp-machine>'+machineOptions()+'</select></label><label class="v4-form-wide">Masalah / peluang perbaikan<textarea rows="4" maxlength="4000" data-v4-imp-query placeholder="Tuliskan masalah dan catatan pendukung untuk membuat draf Kaizen."></textarea></label></div>';
 if(n===86)return '<div class="v4-form-grid"><label>Mesin (opsional)<select data-v4-imp-machine>'+machineOptions()+'</select></label><label class="v4-form-wide">Ide / judul / masalah<input maxlength="1000" data-v4-imp-query placeholder="Contoh: Mengurangi recurring register error pada Offset 5"></label></div>';
 return '';
}
function mount(n){
 n=Number(n);var h=host();if(!h||!openN(n))return;
 removeOlder(n,h);
 var titles={
  81:'Improvement Opportunity Radar',82:'Auto Kaizen Draft',83:'Project Benefit Verification',84:'Kaizen Before–After Timeline',85:'Idea Marketplace',
  86:'Duplicate Kaizen Detector',87:'Project Risk Radar',88:'SGA Story Builder',89:'Improvement Knowledge Graph',90:'Improvement Legacy'
 };
 var sec=document.createElement('section');sec.className='v4-interaction v4-improvement-intel';sec.setAttribute('data-v4-imp-feature',String(n));
 sec.innerHTML='<div class="v4-interaction-head"><div><span class="v4-eyebrow">IMPROVEMENT INTELLIGENCE</span><h3>'+esc(titles[n])+'</h3></div><span class="v4-no-write">'+(n===82?'DRAFT ONLY':'READ ONLY')+'</span></div>'+
 intro(n)+controls(n)+
 '<div class="v4-interaction-actions"><button class="btn btn-primary btn-sm" data-v4-imp-load="'+n+'"><i class="ph-bold '+(n===82?'ph-sparkle':'ph-arrows-clockwise')+'"></i> '+(n===82?'Buat Draft':'Muat Analisis')+'</button>'+
 '<button class="btn btn-sm" data-v4-open-existing="project-center"><i class="ph-bold ph-kanban"></i> Buka Project Center Existing</button>'+
 (n===84||n===85||n===88?'<button class="btn btn-sm" data-v4-open-existing="knowledge"><i class="ph-bold ph-books"></i> Buka Knowledge Existing</button>':'')+
 '</div><div data-v4-imp-out></div>';
 h.prepend(sec);
}
function render81(d){
 var c=d.counts||{};
 return metrics([['Project',fmt(c.project,0)],['Kaizen',fmt(c.kaizen,0)],['SGA',fmt(c.sga,0)],['Open',fmt(c.open,0)]])+
 list(d.opportunityRadar,function(x){
  return item(x.machine||'Mesin','Health '+fmt(x.healthIndex,0)+' • Recurring '+fmt(x.recurring,0)+' • Downtime '+fmt(x.downtimeMinutes,0)+' min • Open issue '+fmt(x.openIssues,0)+' • '+(x.reason||''),chip((x.priority||'P2')+' • '+(x.existingImprovementCoverage||'')));
 },50)+note('Nama mesin tidak ditemukan pada catatan perbaikan yang masih terbuka. Periksa ide serupa sebelum membuat catatan baru.','warn');
}
function aiHtml(d){
 d=d||{};
 var ev=Array.isArray(d.evidence)?d.evidence:[];
 var assumptions=Array.isArray(d.assumptions)?d.assumptions:[];
 return '<div class="v4-ai-result"><div class="v4-interaction-result-head"><span class="v4-server-badge">'+esc(d.mode||'OMODOS AI')+'</span><span>Tingkat keyakinan: '+esc(d.confidence||'belum tersedia')+'</span></div>'+
 '<div class="v4-ai-answer">'+esc(first(d,['summary','answer'])||'Belum ada draft.').replace(/\n/g,'<br>')+'</div>'+
 (assumptions.length?'<div class="v4-assumptions"><strong>Asumsi / batasan</strong><ul>'+assumptions.slice(0,8).map(function(x){return '<li>'+esc(x)+'</li>'}).join('')+'</ul></div>':'')+
 metrics([['Evidence',fmt(ev.length,0)],['Human approval','Wajib'],['Operational write','NONE']])+
 note('Draf belum tersimpan sebagai Kaizen atau proyek. Periksa isinya sebelum menyimpan lewat halaman asal.','warn')+'</div>';
}
async function render82(sec){
 var q=val(sec,'[data-v4-imp-query]'),m=val(sec,'[data-v4-imp-machine]');
 if(!q)return note('Isi masalah / opportunity terlebih dahulu.','warn');
 var d=await act('v4.aiAsk',{query:q,purpose:'kaizen-draft',machine:m||''});
 return aiHtml(d);
}
function render83(d){
 return list(d.benefitEvidence,function(x){
  var cost=(x.budget!=null&&String(x.budget)!=='')?'Budget '+x.budget:'Budget —';
  if(x.actualCost!=null&&String(x.actualCost)!=='')cost+=' • Actual '+x.actualCost;
  return item(x.title||x.id||'Project','Status '+(x.status||'—')+' • '+cost+' • Evidence field '+fmt(x.evidenceFields,0)+'/'+fmt(x.totalEvidenceFields,0),chip(fmt(x.evidenceCoverage,0)+'% coverage'));
 },80)+note('Pemeriksaan ini hanya melihat apakah bagian laporan sudah diisi. Besarnya manfaat tetap perlu diperiksa.','warn');
}
function render84(d){
 return list(d.beforeAfterTimeline,function(x){
  var evidence=[];
  if(x.beforeAfter)evidence.push('Before–After text');
  if(x.beforePhoto)evidence.push('Before photo');
  if(x.afterPhoto)evidence.push('After photo');
  if(x.benefit)evidence.push('Benefit');
  return item(x.theme||x.id||'Kaizen',(x.date||'Tanggal —')+' • '+(x.machine||x.area||'')+' • '+evidence.join(', ')+' • Status '+(x.status||'—'),chip('Tercatat'));
 },80)+note('Foto ditampilkan sebagai bukti yang tercatat. Foto asli tidak diubah.','safe');
}
function render85(d){
 return list(d.ideaMarketplace,function(x){
  var detail=(x.type||'Improvement')+' • '+(x.area||x.machine||'')+' • PIC '+(x.pic||'—')+' • Status '+(x.status||'—')+(x.progress!==''&&x.progress!=null?' • Progress '+x.progress:'');
  var content=[x.problem?('Problem: '+x.problem):'',x.idea?('Idea: '+x.idea):''].filter(Boolean).join(' • ');
  return item(x.title||x.id||x.type,detail+(content?' • '+content:''),chip('EXISTING'));
 },100)+note('Ini adalah daftar ide perbaikan yang masih terbuka.','safe');
}
async function render86(sec){
 var q=val(sec,'[data-v4-imp-query]'),m=val(sec,'[data-v4-imp-machine]');
 if(!q)return note('Isi ide / judul / masalah untuk mencari kemungkinan overlap.','warn');
 var query=(m?m+' ':'')+q,d=await read('v4.findSimilarImprovement',{query:query});
 if(!d)return empty('Similarity endpoint belum tersedia.');
 return list(d.hits,function(x){
  return item(x.title||x.type,(x.type||'')+' • '+(x.machine||x.area||'')+' • Status '+(x.status||'—'),chip('Similarity '+fmt(x.score,2)));
 },40,'Tidak ada potential overlap dari text similarity saat ini.')+note(d.note||'Potential overlap memerlukan human review.','warn');
}
function render87(d){
 var c=d.counts||{};
 return metrics([['Overdue',fmt(c.overdue,0)],['Open improvement',fmt(c.open,0)]])+
 list(d.overdueProjects,function(r){
  var title=first(r,['Judul','Nama Project','Title','ID'])||'Project overdue';
  var due=first(r,['Target Finish','Due Date','Deadline'])||'Due date tercatat';
  var status=first(r,['Status'])||'OPEN';
  var pic=first(r,['PIC','Project Leader'])||'PIC —';
  return item(title,'Due '+due+' • '+pic,chip(status+' • OVERDUE'));
 },60,'Tidak ada project overdue yang terdeteksi dari due date existing.')+
 note('Proyek ditandai terlambat jika tanggal target lewat dan statusnya belum selesai. Dampaknya perlu dinilai petugas.','safe');
}
function render88(d){
 return list(d.sgaStories,function(x){
  var team=x.team||'SGA';
  var members=x.members?' • Members '+x.members:'';
  var result=x.result||x.achievement||'Hasil/Achievement belum tercatat';
  return item((x.theme||'Tema belum tercatat')+' — '+team,'Leader '+(x.leader||'—')+members+' • Target '+(x.target||'—')+' • Progress '+(x.progress||'—')+' • '+result,chip(x.status||'Tercatat'));
 },80)+note('Ringkasan hanya memakai hasil yang benar-benar dicatat; bagian kosong tidak dianggap berhasil.','safe');
}
async function render89(){
 var g=await read('v4.getFactoryBrain',{maxMachines:60});
 if(!g)return empty('Factory Brain graph belum tersedia.');
 var allowed=new Set(['project','kaizen','sga','machine','failure','symptom','knowledge','manual','rca','corrective_action']);
 var nodes=(g.nodes||[]).filter(function(n){return allowed.has(String(n.type||''))});
 var ids=new Set(nodes.map(function(n){return n.id}));
 var edges=(g.edges||[]).filter(function(e){return ids.has(e.from)&&ids.has(e.to)});
 var by={};nodes.forEach(function(n){by[n.type]=(by[n.type]||0)+1});
 var top=edges.slice(0,80);
 return metrics([
  ['Nodes',fmt(nodes.length,0)],['Edges',fmt(edges.length,0)],['Project',fmt(by.project,0)],
  ['Kaizen',fmt(by.kaizen,0)],['SGA',fmt(by.sga,0)],['Knowledge/RCA',fmt((by.knowledge||0)+(by.manual||0)+(by.rca||0),0)]
 ])+
 list(top,function(e){
  var from=nodes.find(function(n){return n.id===e.from}),to=nodes.find(function(n){return n.id===e.to});
  return item((from&&from.label||e.from)+' → '+(to&&to.label||e.to),e.relation||'related',chip('DERIVED EDGE'));
 },80)+note('Peta ini menghubungkan catatan yang sudah ada sejak 1 September 2026.','safe');
}
function render90(d){
 return list(d.improvementLegacy,function(x){
  return item(String(x.year||'Tidak diketahui'),'Project '+fmt(x.projects,0)+' • Kaizen '+fmt(x.kaizen,0)+' • SGA '+fmt(x.sga,0)+' • Completed '+fmt(x.completed,0),chip(fmt((x.records||[]).length,0)+' sample record'));
 },40)+note('Riwayat dikelompokkan per tahun dari tanggal yang tersedia. Ini bukan peringkat orang atau tim.','safe');
}
async function load(btn,n){
 var sec=btn.closest('.v4-improvement-intel'),out=sec&&sec.querySelector('[data-v4-imp-out]');
 if(!sec||!out)return;
 busy(btn,true,n===82?'Menyusun draft':'Memuat');
 try{
  if(n===82){out.innerHTML=await render82(sec);return}
  if(n===86){out.innerHTML=await render86(sec);return}
  if(n===89){out.innerHTML=await render89();return}
  var d=await getImprovement(true);
  if(!d){out.innerHTML=empty('Backend Improvement Intelligence belum tersedia.');return}
  if(n===81)out.innerHTML=render81(d);
  else if(n===83)out.innerHTML=render83(d);
  else if(n===84)out.innerHTML=render84(d);
  else if(n===85)out.innerHTML=render85(d);
  else if(n===87)out.innerHTML=render87(d);
  else if(n===88)out.innerHTML=render88(d);
  else if(n===90)out.innerHTML=render90(d);
 }catch(e){out.innerHTML=note(e&&e.message||String(e),'error')}
 finally{busy(btn,false)}
}
document.addEventListener('click',function(ev){
 var tile=ev.target.closest&&ev.target.closest('[data-v4-feature]');
 if(tile){
  var n=Number(tile.getAttribute('data-v4-feature'));
  if(n>=81&&n<=90)setTimeout(function(){if(openN(n))mount(n)},0);
  return;
 }
 var b=ev.target.closest&&ev.target.closest('[data-v4-imp-load]');
 if(b){ev.preventDefault();load(b,Number(b.getAttribute('data-v4-imp-load')));return}
},false);

window.OMODOS4=Object.assign(window.OMODOS4||{},{
 improvementIntelVersion:'1',
 improvementIntelFeatures:[81,82,83,84,85,86,87,88,89,90],
 improvementWritePolicy:'EXISTING_MODULE_HUMAN_APPROVAL_ONLY'
});
})();


/* OMODOS4_FACTORY_BRAIN_V1
   Progressive-enhancement views for master-prompt features 91–100.
   91–96 and 99–100 are read-only intelligence views.
   Existing 97 Scenario Simulator and 98 Maintenance War Room interactions are intentionally preserved. */
(function(){
'use strict';

function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function openN(n){
 var el=document.querySelector('#v4-safe-stage .v4-feature-no');
 return !!el&&parseInt(el.textContent,10)===Number(n);
}
function host(){return document.querySelector('#v4-safe-stage .v4-detail-card .v4-detail-body')}
function note(t,kind){return '<div class="v4-interaction-note '+(kind||'')+'"><i class="ph-bold ph-info"></i><span>'+esc(t)+'</span></div>'}
function empty(t){return '<div class="v4-empty">'+esc(t||'Data belum cukup untuk ditampilkan.')+'</div>'}
function fmt(v,d){
 if(v==null||v==='')return '—';
 var n=Number(v);if(!Number.isFinite(n))return String(v);
 try{return new Intl.NumberFormat('id-ID',{maximumFractionDigits:d==null?1:d}).format(n)}catch(e){return String(n)}
}
function chip(t){return '<span class="v4-risk-chip">'+esc(t||'Bukti data')+'</span>'}
function item(title,sub,right){
 return '<div class="v4-sf-item"><div><strong>'+esc(title)+'</strong><small>'+esc(sub||'')+'</small></div>'+(right||'')+'</div>';
}
function list(arr,fn,limit,msg){
 if(!Array.isArray(arr)||!arr.length)return empty(msg);
 return '<div class="v4-sf-list">'+arr.slice(0,limit||60).map(fn).join('')+'</div>';
}
function metrics(rows){
 return '<div class="v4-statline">'+rows.map(function(x){return '<div><b>'+esc(x[1])+'</b><span>'+esc(x[0])+'</span></div>'}).join('')+'</div>';
}
function first(o,keys){
 if(!o||typeof o!=='object')return '';
 for(var i=0;i<keys.length;i++){var k=keys[i];if(o[k]!=null&&String(o[k]).trim())return String(o[k])}
 return '';
}
function val(sec,sel){var e=sec&&sec.querySelector(sel);return e?String(e.value||'').trim():''}
function busy(btn,on,label){
 if(!btn)return;
 if(on){btn.dataset.old=btn.innerHTML;btn.disabled=true;btn.innerHTML='<i class="ph-bold ph-spinner-gap v4-spin"></i> '+esc(label||'Memuat…')}
 else{btn.disabled=false;if(btn.dataset.old)btn.innerHTML=btn.dataset.old}
}
function machineNames(){
 var set=new Set();
 try{(Array.isArray(MACHINES)?MACHINES:[]).forEach(function(m){var n=m['Nama Mesin']||m.namaMesin||m['Kode Mesin']||m.kodeMesin;if(n)set.add(String(n))})}catch(e){}
 try{(Array.isArray(ENTRIES)?ENTRIES:[]).forEach(function(m){var n=m['Nama Mesin']||m.namaMesin||m['Kode Mesin']||m.kodeMesin;if(n)set.add(String(n))})}catch(e){}
 return Array.from(set).sort(function(a,b){return a.localeCompare(b,'id')});
}
function machineOptions(blank){return '<option value="">'+esc(blank||'Semua mesin')+'</option>'+machineNames().map(function(n){return '<option value="'+esc(n)+'">'+esc(n)+'</option>'}).join('')}
function read(action,payload){
 if(!(window.OMODOS4&&typeof window.OMODOS4.serverRead==='function'))return Promise.resolve(null);
 return window.OMODOS4.serverRead(action,payload||{});
}
function removeOld(n,h){
 Array.from(h.querySelectorAll('.v4-factory-brain-intel[data-v4-fb-feature="'+n+'"]')).forEach(function(x){x.remove()});
}
function titles(n){
 return {
  91:'Factory Maintenance Digital Twin',92:'Maintenance Command Center',93:'What Changed? Mode',94:'Time Machine',95:'Maintenance Black Box',
  96:'Factory Knowledge Graph',99:'Autonomous Maintenance Intelligence',100:'OMODOS FACTORY BRAIN'
 }[n]||'Factory Brain';
}
function intro(n){
 var t={
  91:'Digital Twin ini adalah model hubungan data maintenance, bukan simulasi fisika mesin dan bukan telemetry real-time yang tidak tercatat.',
  92:'Command Center merangkum evidence existing menjadi prioritas review; tidak menjalankan tindakan operasional otomatis.',
  93:'What Changed membandingkan record yang benar-benar masuk pada window waktu terpilih dan tetap mempertahankan source lineage.',
  94:'Time Machine merekonstruksi best-known state dari record bertimestamp. Nilai current-only tidak diproyeksikan mundur.',
  95:'Black Box menyusun event chronology dari Logbook/Breakdown/Predictive/RCA/Corrective yang bertimestamp; event yang tidak pernah dicatat tidak diasumsikan.',
  96:'Knowledge Graph menghubungkan node/edge derived dari source OMODOS existing; graph bukan source-of-truth baru.',
  99:'Autonomous Maintenance Intelligence di sini berarti rekomendasi terstruktur untuk manusia. Tidak ada autonomous write, autonomous control, atau keputusan otomatis.',
  100:'Factory Brain menggabungkan graph, risk overview, dan deterministic brief sebagai decision-support layer di atas source OMODOS existing.'
 };
 return note(t[n]||'Read-only intelligence.','safe');
}
function controls(n){
 if(n===93)return '<div class="v4-form-grid"><label>Periode<select data-v4-fb-change><option value="24h">24 jam terakhir</option><option value="7d">7 hari terakhir</option><option value="yesterday">Kemarin</option><option value="previousShift">Shift sebelumnya</option><option value="previousLogin">Sejak login sebelumnya</option></select></label><label>Mesin (opsional)<select data-v4-fb-machine>'+machineOptions('Semua mesin')+'</select></label></div>';
 if(n===94){
  var now=new Date(),local=new Date(now.getTime()-now.getTimezoneOffset()*60000).toISOString().slice(0,16);
  return '<div class="v4-form-grid"><label>Tanggal & waktu<input type="datetime-local" min="2026-09-01T00:00" value="'+esc(local)+'" data-v4-fb-time></label><label>Mesin (opsional)<select data-v4-fb-machine>'+machineOptions('Semua mesin')+'</select></label><label>Shift (opsional)<select data-v4-fb-shift><option value="">Semua shift</option><option value="1">Shift 1</option><option value="2">Shift 2</option><option value="3">Shift 3</option></select></label></div>';
 }
 if(n===95||n===99)return '<div class="v4-form-grid"><label>Mesin (opsional)<select data-v4-fb-machine>'+machineOptions('Semua mesin')+'</select></label><label>Periode<select data-v4-fb-days><option value="30">30 hari</option><option value="90" selected>90 hari</option><option value="180">180 hari</option><option value="365">365 hari</option></select></label></div>';
 return '';
}
function mount(n){
 n=Number(n);
 if(n===97||n===98)return;
 if(![91,92,93,94,95,96,99,100].includes(n))return;
 var h=host();if(!h||!openN(n))return;
 removeOld(n,h);
 var sec=document.createElement('section');sec.className='v4-interaction v4-factory-brain-intel';sec.setAttribute('data-v4-fb-feature',String(n));
 sec.innerHTML='<div class="v4-interaction-head"><div><span class="v4-eyebrow">FACTORY BRAIN • SOURCE-OF-TRUTH CONNECTED</span><h3>'+esc(titles(n))+'</h3></div><span class="v4-no-write">READ ONLY</span></div>'+
 intro(n)+controls(n)+
 '<div class="v4-interaction-actions"><button class="btn btn-primary btn-sm" data-v4-fb-load="'+n+'"><i class="ph-bold ph-arrows-clockwise"></i> Muat '+esc(titles(n))+'</button>'+
 (n===92||n===100?'<button class="btn btn-sm" data-v4-open-copilot><i class="ph-bold ph-brain"></i> Buka Copilot Existing</button>':'')+
 '</div><div data-v4-fb-out></div>';
 h.prepend(sec);
}
function graphSummary(g,labelText){
 if(!g)return empty('Factory Brain graph belum tersedia.');
 var nodes=Array.isArray(g.nodes)?g.nodes:[],edges=Array.isArray(g.edges)?g.edges:[],d=g.domains||{};
 var by={};nodes.forEach(function(n){by[n.type]=(by[n.type]||0)+1});
 return metrics([
  ['Graph nodes',fmt(nodes.length,0)],['Graph edges',fmt(edges.length,0)],['Machines',fmt(d.machines,0)],['Logbook',fmt(d.logbook,0)],
  ['RCA',fmt(d.rca,0)],['Knowledge',fmt(d.knowledge,0)],['Projects',fmt((d.projects||0)+(d.kaizen||0)+(d.sga||0),0)]
 ])+
 list(edges,function(e){
  var from=nodes.find(function(n){return n.id===e.from}),to=nodes.find(function(n){return n.id===e.to});
  return item((from&&from.label||e.from)+' → '+(to&&to.label||e.to),e.relation||'related',chip('DERIVED EDGE'));
 },50)+note(labelText||'Graph hanya menghubungkan evidence yang tersedia.','safe');
}
function render91(g){
 return graphSummary(g,'Factory Maintenance Digital Twin memakai graph maintenance existing sebagai model hubungan data. Tidak mengklaim telemetry/physics simulation yang tidak tersedia.');
}
function render92(o){
 if(!o)return empty('Overview belum tersedia.');
 var s=o.summary||{};
 return metrics([
  ['Critical machines',fmt(s.criticalMachines,0)],['Active breakdown',fmt(s.activeBreakdown,0)],['Predictive risks',fmt(s.predictiveRisks,0)],
  ['Sparepart risks',fmt(s.sparepartRisks,0)],['KPI at risk',fmt(s.kpiAtRisk,0)],['Open high-priority actions',fmt(s.openHighPriorityActions,0)]
 ])+
 list(o.thingsToLookAt,function(x){return item(x.title||x.type,x.reason||'',chip(x.priority||'REVIEW'))},20)+
 note('Ringkasan membantu menentukan apa yang perlu diperiksa. Tugas tidak dibagikan secara otomatis.','warn');
}
function changePayload(sec){
 var preset=val(sec,'[data-v4-fb-change]'),machine=val(sec,'[data-v4-fb-machine]');
 var p={};if(machine)p.machine=machine;
 if(preset==='yesterday'||preset==='previousShift'||preset==='previousLogin')p.preset=preset;
 else{
  var days=preset==='7d'?7:1,until=new Date(),since=new Date(until.getTime()-days*86400000);
  p.since=since.toISOString();p.until=until.toISOString();p.preset='selected';
 }
 return p;
}
function render93(d){
 if(!d)return empty('Change intelligence belum tersedia.');
 var cats=d.categories||[];
 return metrics([['Categories changed',fmt(cats.length,0)],['Preset',first(d.range||{},['preset'])||'CUSTOM'],['Shift',first(d.range||{},['shift'])||'—']])+
 list(cats,function(x){
  var latest=Array.isArray(x.latest)?x.latest.length:0;
  return item(x.category||x.sheet,(x.sheet||'')+' • Scope '+(x.scope||'')+' • Latest preview '+latest,chip(fmt(x.count,0)+' record'));
 },30)+note('Jumlah berasal dari catatan pada periode yang dipilih. Kategori kosong tidak ditampilkan.','safe');
}
function timePayload(sec){
 var raw=val(sec,'[data-v4-fb-time]'),machine=val(sec,'[data-v4-fb-machine]'),shift=val(sec,'[data-v4-fb-shift]');
 if(!raw)return null;
 var dt=new Date(raw);if(!Number.isFinite(dt.getTime()))return null;
 var p={at:dt.toISOString()};if(machine)p.machine=machine;if(shift)p.shift=shift;return p;
}
function snapshotCount(x){
 if(!x||typeof x!=='object')return 0;
 if(Number.isFinite(Number(x.recordsUntilTime)))return Number(x.recordsUntilTime);
 if(Array.isArray(x.latest))return x.latest.length;
 return 0;
}
function render94(d){
 if(!d)return empty('Time Machine belum tersedia.');
 var s=d.snapshots||{},m=d.machineStatus||{},a=d.activeProblems||{},down=d.downtime||{};
 return metrics([
  ['At',String(d.at||'—').replace('T',' ').slice(0,16)],['Logbook',fmt(snapshotCount(s.logbook),0)],['Breakdown',fmt(snapshotCount(s.breakdown),0)],
  ['Predictive',fmt(snapshotCount(s.predictive),0)],['Project',fmt(snapshotCount(s.project),0)],['Active problems',fmt((a.records||[]).length,0)],
  ['Kondisi mesin dari catatan',fmt((m.records||[]).length,0)],['Waktu berhenti',down.label==='NOT AVAILABLE'?'—':fmt(down.totalMinutes,0)+' menit']
 ])+
 list(m.records,function(x){
  return item(x.machine||'Mesin',(x.lastAt||'').replace('T',' ').slice(0,16),chip(x.derivedStatus||'DERIVED'));
 },50)+note(d.note||'Best-known historical state only.','warn');
}
function rangePayload(sec){
 var days=Number(val(sec,'[data-v4-fb-days]')||90),until=new Date(),since=new Date(until.getTime()-days*86400000),machine=val(sec,'[data-v4-fb-machine]');
 var p={since:since.toISOString(),until:until.toISOString()};if(machine)p.machine=machine;return p;
}
function render95(d){
 if(!d)return empty('Black Box belum tersedia.');
 var s=d.summary||{};
 return metrics([['Events',fmt(s.events,0)],['Affected machines',fmt(s.affectedMachines,0)],['Downtime',fmt(s.downtimeMinutes,0)+' min'],['Sources',fmt(Object.keys(s.sources||{}).length,0)]])+
 list(d.events,function(x){
  return item((x.machine||'Mesin tidak tercatat')+' • '+(x.event||'Recorded event'),(x.timestamp||'').replace('T',' ').slice(0,19)+' • '+(x.source||'')+' • Downtime '+fmt(x.downtimeMinutes,0)+' min',chip(x.status||x.priority||'Tercatat'));
 },100)+note(d.note||'Chronology dari timestamped maintenance records only.','safe');
}
function render96(g){
 return graphSummary(g,'Factory Knowledge Graph menghubungkan machine, failure, symptom, RCA, corrective action, technician, manual, knowledge, sparepart, project, KPI, energy, IPAL, vendor/PO/cost bila evidence tersedia.');
}
function render99(o){
 if(!o)return empty('Overview belum tersedia.');
 var risks=o.topRisks||[],ops=o.topOpportunities||[],latest=o.latestIntelligence||[];
 return metrics([['Risk signals',fmt(risks.length,0)],['Opportunity signals',fmt(ops.length,0)],['Latest intelligence',fmt(latest.length,0)]])+
 '<section class="v4-server-section"><div class="v4-server-section-head"><strong>Periksa oleh petugas queue</strong><span>Tidak ada perubahan otomatis</span></div>'+
 list(risks,function(x){return item(x.title||x.type,x.reason||'',chip(x.priority||'REVIEW'))},20)+
 list(ops,function(x){return item(x.title||x.type,x.reason||'',chip('OPPORTUNITY'))},20)+
 '</section>'+note('Tidak ada tindakan maintenance, perubahan status, purchase request, atau input Logbook yang dijalankan otomatis oleh fitur ini.','warn');
}
function briefBlock(b){
 if(!b)return '';
 var sum=Array.isArray(b.summary)?b.summary:[];
 return '<section class="v4-server-section"><div class="v4-server-section-head"><strong>Ringkasan Singkat</strong><span>Tingkat keyakinan: '+esc(b.confidence||'')+'</span></div>'+
 (sum.length?'<div class="v4-sf-list">'+sum.map(function(x){return item(x,'',chip('BRIEF'))}).join('')+'</div>':empty('Brief belum tersedia.'))+'</section>';
}
function render100(g,o,b){
 var brain=graphSummary(g,'OMODOS FACTORY BRAIN adalah decision-support layer; seluruh graph tetap derived dari source existing.');
 var s=o&&o.summary||{};
 var overview=metrics([
  ['Critical machines',fmt(s.criticalMachines,0)],['Active breakdown',fmt(s.activeBreakdown,0)],['Sparepart risks',fmt(s.sparepartRisks,0)],
  ['KPI at risk',fmt(s.kpiAtRisk,0)],['High-priority actions',fmt(s.openHighPriorityActions,0)]
 ]);
 return overview+briefBlock(b)+brain+note('Ringkasan ini membaca data yang ada dan tidak mengubah catatan pekerjaan secara otomatis.','warn');
}
async function load(btn,n){
 var sec=btn.closest('.v4-factory-brain-intel'),out=sec&&sec.querySelector('[data-v4-fb-out]');
 if(!sec||!out)return;
 busy(btn,true,'Memuat');
 try{
  if(n===91){out.innerHTML=render91(await read('v4.getFactoryBrain',{maxMachines:60}));return}
  if(n===92){out.innerHTML=render92(await read('v4.getOverview',{}));return}
  if(n===93){out.innerHTML=render93(await read('v4.getWhatChanged',changePayload(sec)));return}
  if(n===94){
   var tp=timePayload(sec);if(!tp){out.innerHTML=note('Pilih tanggal & waktu yang valid.','warn');return}
   out.innerHTML=render94(await read('v4.getTimeMachine',tp));return
  }
  if(n===95){out.innerHTML=render95(await read('v4.getBlackBox',rangePayload(sec)));return}
  if(n===96){out.innerHTML=render96(await read('v4.getFactoryBrain',{maxMachines:80}));return}
  if(n===99){out.innerHTML=render99(await read('v4.getOverview',rangePayload(sec)));return}
  if(n===100){
   var all=await Promise.all([read('v4.getFactoryBrain',{maxMachines:80}),read('v4.getOverview',{}),read('v4.getBrief',{})]);
   out.innerHTML=render100(all[0],all[1],all[2]);return
  }
 }catch(e){out.innerHTML=note(e&&e.message||String(e),'error')}
 finally{busy(btn,false)}
}
document.addEventListener('click',function(ev){
 var tile=ev.target.closest&&ev.target.closest('[data-v4-feature]');
 if(tile){
  var n=Number(tile.getAttribute('data-v4-feature'));
  if(n>=91&&n<=100&&n!==97&&n!==98)setTimeout(function(){if(openN(n))mount(n)},0);
  return;
 }
 var b=ev.target.closest&&ev.target.closest('[data-v4-fb-load]');
 if(b){ev.preventDefault();load(b,Number(b.getAttribute('data-v4-fb-load')));return}
},false);

window.OMODOS4=Object.assign(window.OMODOS4||{},{
 factoryBrainVersion:'1',
 factoryBrainFeatures:[91,92,93,94,95,96,97,98,99,100],
 factoryBrainReadOnlyEnhanced:[91,92,93,94,95,96,99,100],
 factoryBrainPreservedInteractions:[97,98],
 autonomousOperationalWrites:'NONE'
});
})();



/* OMODOS4_MACHINE_PREDICTIVE_SPECIFIC_V1
   Feature-specific presentation for Machine (001-010) and Predictive (011-020).
   Read-only: uses existing OMODOS 4 server reads and never writes operational data. */
(function(){
'use strict';
var LAST_LOAD=0;

function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function openNo(){
 var el=document.querySelector('#v4-safe-stage .v4-feature-no');
 return el?parseInt(el.textContent,10)||0:0;
}
function host(){return document.querySelector('#v4-safe-stage .v4-detail-card .v4-detail-body')}
function note(t,k){return '<div class="v4-interaction-note '+(k||'safe')+'"><i class="ph-bold ph-info"></i><span>'+esc(t)+'</span></div>'}
function empty(t){return '<div class="v4-empty">'+esc(t||'Belum ada data yang cocok.')+'</div>'}
function chip(t){return '<span class="v4-risk-chip">'+esc(t||'Data')+'</span>'}
function fmt(v,d){
 var n=Number(v);if(!Number.isFinite(n))return v==null||v===''?'—':esc(v);
 return n.toLocaleString('id-ID',{maximumFractionDigits:d==null?1:d});
}
function dateText(v){
 if(!v)return '—';
 var d=new Date(v);return Number.isNaN(d.getTime())?esc(v):d.toLocaleString('id-ID',{dateStyle:'medium',timeStyle:'short'});
}
function first(o,keys){
 if(!o||typeof o!=='object')return '';
 for(var i=0;i<keys.length;i++){var v=o[keys[i]];if(v!=null&&String(v).trim())return v}
 return '';
}
function metric(label,value,sub){
 return '<div class="v4-subcard"><span class="v4-muted">'+esc(label)+'</span><h3>'+esc(value==null||value===''?'—':value)+'</h3>'+(sub?'<small>'+esc(sub)+'</small>':'')+'</div>';
}
function metrics(items){return '<div class="v4-metric-grid">'+items.join('')+'</div>'}
function item(title,sub,right){
 return '<div class="v4-table-row"><strong>'+esc(title||'—')+'</strong><span>'+esc(sub||'')+'</span><b>'+esc(right==null?'':right)+'</b></div>';
}
function list(arr,fn,msg,limit){
 arr=Array.isArray(arr)?arr:[];
 if(!arr.length)return empty(msg);
 return '<div class="v4-table-lite">'+arr.slice(0,limit||30).map(fn).join('')+'</div>';
}
function names(){
 var set=new Set();
 try{(Array.isArray(MACHINES)?MACHINES:[]).forEach(function(m){var n=m['Nama Mesin']||m.namaMesin||m['Kode Mesin']||m.kodeMesin;if(n)set.add(String(n))})}catch(e){}
 try{(Array.isArray(ENTRIES)?ENTRIES:[]).forEach(function(m){var n=m['Nama Mesin']||m.namaMesin||m['Kode Mesin']||m.kodeMesin;if(n)set.add(String(n))})}catch(e){}
 return Array.from(set).sort(function(a,b){return a.localeCompare(b,'id')});
}
function options(blank){
 return '<option value="">'+esc(blank||'Pilih mesin')+'</option>'+names().map(function(n){return '<option value="'+esc(n)+'">'+esc(n)+'</option>'}).join('');
}
function read(action,payload){
 if(!(window.OMODOS4&&typeof window.OMODOS4.serverRead==='function'))return Promise.resolve(null);
 return window.OMODOS4.serverRead(action,payload||{});
}
function machineRequired(n){return [1,3,4,5,7,8,9,10].indexOf(n)>=0}
function actionFor(n){
 if(n===2)return 'v4.getMachineHealth';
 if(n===3||n===10)return 'v4.getMachineGraph';
 if(n===6)return 'v4.getFailureMemory';
 if(n>=11&&n<=20)return 'v4.getPredictiveRisk';
 return 'v4.getMachinePassport';
}
function intro(n){
 var map={
 1:'Satu halaman untuk melihat identitas, kondisi terkini, riwayat gangguan, sparepart, dan orang yang pernah menangani mesin.',
 2:'Nilai kesehatan dihitung dari bukti gangguan, waktu berhenti, masalah terbuka, dan pola berulang. Nilai ini bukan diagnosis otomatis.',
 3:'Menunjukkan hubungan mesin dengan gangguan, RCA, pengetahuan, project, orang, dan data terkait.',
 4:'Menampilkan bagian/subsistem yang benar-benar tercatat pada pemeriksaan mesin.',
 5:'Menampilkan lama waktu sejak penggantian komponen yang tercatat. Ini bukan umur teknis dari pabrikan.',
 6:'Mencari masalah lama dan pola yang berulang agar petugas tidak mulai dari nol.',
 7:'Merangkum pola masalah yang paling sering tercatat pada mesin.',
 8:'Membandingkan tekanan historis mesin per bulan: kejadian, gangguan, downtime, masalah terbuka, dan temuan predictive.',
 9:'Menyusun ulang urutan kejadian mesin dari catatan Logbook, Breakdown, Predictive, RCA, dan Corrective.',
 10:'Menampilkan peta hubungan data di sekitar satu mesin agar sumber informasi yang saling terkait mudah ditemukan.',
 11:'Mengurutkan mesin berdasarkan sinyal risiko berbasis data yang tersedia. Ini bukan probabilitas kerusakan.',
 12:'Menampilkan mesin yang perlu diperiksa lebih dulu berdasarkan sinyal risiko dan bukti masalah.',
 13:'Mencari temuan predictive yang pernah muncul sebelum gangguan pada mesin yang sama.',
 14:'Menunjukkan mesin yang memiliki pola masalah berulang pada periode data yang dipakai.',
 15:'Mencari pola gangguan serupa yang muncul pada lebih dari satu mesin.',
 16:'Mencari kenaikan kejadian, downtime, atau masalah terbuka antara paruh awal dan paruh akhir periode.',
 17:'Merangkum kata/gejala yang paling sering muncul bersama pada riwayat gangguan tiap mesin.',
 18:'Menjelaskan kuat-lemahnya bukti di balik setiap sinyal risiko.',
 19:'Menghitung perkiraan jarak waktu penggantian berikutnya dari pola penggantian historis yang cukup. Bukan umur teknis resmi.',
 20:'Menampilkan komponen atau mesin yang paling layak diperiksa berikutnya berdasarkan bukti yang tersedia.'
 };
 return map[n]||'';
}
function mount(n){
 n=Number(n);if(n<1||n>20)return;
 var h=host();if(!h||openNo()!==n)return;
 var old=h.querySelector('.v4-mp-specific');if(old)old.remove();
 var sec=document.createElement('section');sec.className='v4-interaction v4-mp-specific';sec.setAttribute('data-v4-mp-feature',String(n));
 var requireMachine=machineRequired(n),showMachine=n!==15;
 var controls='';
 if(showMachine)controls+='<label>Mesin '+(requireMachine?'<b>*</b>':'(opsional)')+'<select data-v4-mp-machine>'+options(requireMachine?'Pilih mesin':'Semua mesin')+'</select></label>';
 if(n===6)controls+='<label class="v4-form-wide">Masalah yang ingin dicari<input data-v4-mp-query placeholder="Opsional: contoh bearing panas, sensor error, kebocoran"></label>';
 sec.innerHTML='<div class="v4-interaction-head"><div><span class="v4-eyebrow">BERDASARKAN DATA OMODOS</span><h3>'+esc((window.OMODOS4&&window.OMODOS4.simpleFeatures&&window.OMODOS4.simpleFeatures[n]||{}).name||('Fitur '+n))+'</h3></div><span class="v4-no-write">HANYA LIHAT</span></div>'+
  '<p class="v4-muted">'+esc(intro(n))+'</p>'+
  (controls?'<div class="v4-form-grid">'+controls+'</div>':'')+
  '<div class="v4-interaction-actions"><button class="btn btn-primary btn-sm" data-v4-mp-load="'+n+'"><i class="ph-bold ph-magnifying-glass"></i> Tampilkan Data</button></div>'+
  '<div data-v4-mp-output>'+note(requireMachine?'Pilih satu mesin, lalu tampilkan datanya.':'Data dapat ditampilkan tanpa mengubah catatan apa pun.')+'</div>';
 h.prepend(sec);
 if(!requireMachine&&n!==6)setTimeout(function(){var b=sec.querySelector('[data-v4-mp-load]');if(b)load(b,n)},0);
}
function evidenceText(e){
 if(!e||typeof e!=='object')return '';
 var parts=[];
 if(e.predictiveRecords!=null)parts.push(e.predictiveRecords+' temuan predictive');
 if(e.breakdowns!=null)parts.push(e.breakdowns+' gangguan');
 if(e.recurringPatterns!=null)parts.push(e.recurringPatterns+' pola berulang');
 if(e.downtimeMinutes!=null)parts.push(fmt(e.downtimeMinutes,0)+' menit berhenti');
 if(e.openIssues!=null)parts.push(e.openIssues+' masalah terbuka');
 return parts.join(' • ');
}
function machineHtml(n,d){
 d=d||{};
 if(n===1){
  var c=d.currentCondition||{},r=d.reliability||{},id=d.identity||{},open=Array.isArray(c.openIssues)?c.openIssues:[];
  return metrics([
   metric('Nilai kesehatan',c.healthIndex==null?'Belum tersedia':fmt(c.healthIndex,0)+'/100',c.currentRisk||''),
   metric('Gangguan tercatat',fmt(r.failureCount,0),'Riwayat gangguan'),
   metric('Waktu berhenti',fmt(r.downtimeMinutes,0)+' menit','Dari catatan yang tersedia'),
   metric('Masalah belum selesai',open.length,'Perlu diperiksa')
  ])+
  '<div class="v4-subcard"><h3>Identitas Mesin</h3><div class="v4-kv-stack">'+Object.keys(id).slice(0,12).map(function(k){return '<div><span>'+esc(k)+'</span><b>'+esc(id[k])+'</b></div>'}).join('')+'</div></div>'+
  list(open,function(x){return item(first(x,['Deskripsi Masalah','Problem','Deskripsi','description','Nama Mesin'])||'Catatan mesin',String(first(x,['Status','Severity','Prioritas'])||''),dateText(first(x,['Tanggal','Timestamp','Created At'])))},'Tidak ada masalah terbuka pada data yang tersedia.',12);
 }
 if(n===2){
  var ms=Array.isArray(d.machines)?d.machines:[];
  return list(ms,function(x){return item(x.code||x.name||x.key||'Mesin','Gangguan '+fmt(x.breakdowns,0)+' • downtime '+fmt(x.downtimeMinutes,0)+' menit • terbuka '+fmt(x.openIssues,0),fmt(x.healthIndex,0)+'/100')},'Belum ada mesin yang dapat dihitung nilai kesehatannya.',40);
 }
 if(n===3||n===10){
  var nodes=Array.isArray(d.nodes)?d.nodes:[],edges=Array.isArray(d.edges)?d.edges:[];
  var counts={};nodes.forEach(function(x){var t=x.type||'lainnya';counts[t]=(counts[t]||0)+1});
  return metrics([metric('Titik data',nodes.length,'Data yang terhubung'),metric('Hubungan',edges.length,'Koneksi antar data'),metric('Jenis data',Object.keys(counts).length,'Kelompok informasi')])+
   '<div class="v4-subcard"><h3>Jenis Data yang Terhubung</h3><div class="v4-kv-stack">'+Object.keys(counts).sort(function(a,b){return counts[b]-counts[a]}).map(function(k){return '<div><span>'+esc(k)+'</span><b>'+counts[k]+'</b></div>'}).join('')+'</div></div>'+
   list(nodes.slice(0,30),function(x){return item(x.label||x.id,x.type||'data','')},'Belum ada hubungan data untuk mesin ini.',30);
 }
 var intel=d.intelligence||{};
 if(n===4)return list(intel.anatomy,function(x){return item(x.subsystem||'Bagian mesin',fmt(x.checks,0)+' pemeriksaan',(Array.isArray(x.standards)?x.standards.slice(0,2).join(' • '):''))},'Bagian mesin belum tercatat pada template pemeriksaan.',30);
 if(n===5)return list(intel.componentLifeClock,function(x){return item(x.material||x.materialNumber||'Komponen','Terakhir diganti '+dateText(x.lastReplacement),x.elapsedDays==null?'—':fmt(x.elapsedDays,0)+' hari')},'Belum ada riwayat penggantian komponen yang cukup.',30)+note('Angka hari adalah waktu sejak penggantian yang tercatat, bukan batas umur pabrikan.');
 if(n===7)return list(intel.machinePersonality,function(x){return item(x.description||'Pola masalah',fmt(x.count,0)+' kejadian','Terakhir '+dateText(x.last&&new Date(x.last).toISOString()))},'Belum ada pola masalah berulang yang cukup.',20);
 if(n===8)return list(intel.agingCurve,function(x){return item(x.month,fmt(x.failures,0)+' gangguan • '+fmt(x.openIssues,0)+' terbuka',fmt(x.downtimeMinutes,0)+' menit')},'Belum ada riwayat bulanan yang cukup.',24)+note('Grafik ini menunjukkan tekanan historis, bukan umur fisik mesin.');
 if(n===9)return list(intel.eventReplay,function(x){return item(x.description||x.source||'Kejadian',x.source||'',dateText(x.timestamp))},'Belum ada kejadian yang dapat diputar ulang.',40);
 return empty();
}
function failureHtml(d){
 d=d||{};
 if(Array.isArray(d.hits)&&d.hits.length)return list(d.hits,function(x){return item(x.description||'Kasus lama',(x.machine||'')+' • '+(x.sheet||''),'kemiripan '+fmt((Number(x.score)||0)*100,0)+'%')},'Tidak ada kasus mirip.',25)+note(d.note||'Kemiripan teks bukan bukti akar penyebab yang sama.');
 var p=Array.isArray(d.patterns)?d.patterns:[];
 return list(p,function(x){return item(x.code||x.name||x.key||'Mesin',fmt(x.recurring,0)+' pola berulang',fmt(x.openIssues,0)+' terbuka')},'Belum ada pola berulang yang ditemukan.',30);
}
function predictiveHtml(n,d){
 d=d||{};
 var risks=Array.isArray(d.risks)?d.risks:[],q=Array.isArray(d.attentionQueue)?d.attentionQueue:[],
     pre=Array.isArray(d.anomalyBeforeFailure)?d.anomalyBeforeFailure:[],
     cross=Array.isArray(d.crossMachineClusters)?d.crossMachineClusters:[],
     silent=Array.isArray(d.silentDeterioration)?d.silentDeterioration:[],
     sig=Array.isArray(d.failureSignatures)?d.failureSignatures:[],
     rul=Array.isArray(d.remainingUsefulLife)?d.remainingUsefulLife:[];
 if(n===11)return list(risks,function(x){return item(x.machine,evidenceText(x.evidence),fmt(x.riskScore,0)+'/100')},'Tidak ada sinyal risiko pada periode ini.',40)+note('Skor adalah indikator berbasis aturan, bukan peluang kerusakan.');
 if(n===12)return list(q,function(x){return item(x.machine,(x.factors||[]).join(' • ')||evidenceText(x.evidence),String(x.risk||'').toUpperCase())},'Tidak ada peringatan yang perlu diprioritaskan.',30);
 if(n===13)return list(pre,function(x){return item(x.pattern,fmt(x.count,0)+' kejadian pendahulu','Mesin: '+(x.machines||[]).slice(0,4).join(', '))},'Belum ada pola yang konsisten muncul sebelum gangguan.',30)+note('Hubungan waktu tidak membuktikan bahwa temuan tersebut menyebabkan gangguan.');
 if(n===14){
  var rec=risks.filter(function(x){return x.evidence&&Number(x.evidence.recurringPatterns)>0}).sort(function(a,b){return Number(b.evidence.recurringPatterns)-Number(a.evidence.recurringPatterns)});
  return list(rec,function(x){return item(x.machine,fmt(x.evidence.recurringPatterns,0)+' pola berulang',evidenceText(x.evidence))},'Belum ada masalah berulang yang cukup.',30);
 }
 if(n===15)return list(cross,function(x){return item(x.signature.replace(/\|/g,' • '),fmt(x.count,0)+' kejadian',(x.machines||[]).join(', '))},'Belum ada pola yang cukup mirip pada beberapa mesin.',30);
 if(n===16)return list(silent,function(x){return item(x.machine,'Awal: '+fmt(x.early&&x.early.events,0)+' kejadian • Akhir: '+fmt(x.late&&x.late.events,0)+' kejadian','skor perubahan '+fmt(x.deteriorationScore,0))},'Belum ada penurunan tersembunyi yang terdeteksi.',30)+note('Sinyal ini membandingkan dua bagian periode; tetap perlu pemeriksaan lapangan.');
 if(n===17)return list(sig,function(x){return item(x.machine,x.signature||'Belum ada ciri kata yang dominan',fmt(x.events,0)+' kejadian')},'Belum ada ciri khas gangguan yang cukup.',30);
 if(n===18)return list(risks,function(x){return item(x.machine,'Bukti: '+evidenceText(x.evidence),'Keyakinan '+String(x.confidence||'rendah'))},'Belum ada sinyal risiko untuk dinilai.',40)+note('Tingkat keyakinan menunjukkan kelengkapan bukti yang tersedia, bukan kepastian prediksi.');
 if(n===19)return list(rul,function(x){return item(x.machine+' • '+x.component,fmt(x.replacementEvents,0)+' penggantian • rata-rata '+fmt(x.averageHistoricalIntervalDays,0)+' hari',fmt(x.remainingIntervalEstimateDays,0)+' hari tersisa')},'Belum ada minimal tiga catatan penggantian untuk komponen yang sama.',40)+note('Perkiraan hanya dari interval historis penggantian; bukan Remaining Useful Life dari pabrikan.');
 if(n===20){
  var parts=rul.slice().sort(function(a,b){return Number(a.remainingIntervalEstimateDays)-Number(b.remainingIntervalEstimateDays)});
  return (parts.length?'<h3 class="v4-detail-heading">Komponen yang Perlu Dicek</h3>'+list(parts,function(x){return item(x.machine+' • '+x.component,'Riwayat '+fmt(x.replacementEvents,0)+' kali penggantian',fmt(x.remainingIntervalEstimateDays,0)+' hari')},'',20):'')+
   '<h3 class="v4-detail-heading">Mesin yang Perlu Dicek</h3>'+list(q,function(x){return item(x.machine,evidenceText(x.evidence),fmt(x.riskScore,0)+'/100')},'Belum ada antrean mesin yang perlu dicek.',20)+note('Daftar ini adalah urutan pemeriksaan berbasis bukti, bukan ramalan bagian yang pasti rusak.');
 }
 return empty();
}
async function load(btn,n){
 var sec=btn.closest('.v4-mp-specific'),out=sec&&sec.querySelector('[data-v4-mp-output]');if(!sec||!out)return;
 var machineEl=sec.querySelector('[data-v4-mp-machine]'),machine=machineEl?machineEl.value:'';
 if(machineRequired(n)&&!machine){out.innerHTML=note('Pilih mesin terlebih dahulu.','warn');return}
 var payload={};if(machine)payload.machine=machine;
 if(n===6){var q=sec.querySelector('[data-v4-mp-query]');if(q&&q.value.trim())payload.query=q.value.trim()}
 var seq=++LAST_LOAD;
 btn.disabled=true;var old=btn.innerHTML;btn.innerHTML='<i class="ph-bold ph-spinner-gap v4-spin"></i> Memuat data';
 out.innerHTML=note('Mengambil data yang sesuai dengan fitur ini…');
 try{
  var d=await read(actionFor(n),payload);
  if(seq!==LAST_LOAD||openNo()!==n)return;
  if(!d){out.innerHTML=note('Data server belum dapat dimuat. Coba muat ulang setelah sesi login aktif.','warn');return}
  out.innerHTML=n===6?failureHtml(d):(n<=10?machineHtml(n,d):predictiveHtml(n,d));
 }catch(e){if(seq===LAST_LOAD)out.innerHTML=note(e&&e.message?e.message:String(e),'error')}
 finally{btn.disabled=false;btn.innerHTML=old}
}
document.addEventListener('click',function(e){
 var tile=e.target.closest&&e.target.closest('[data-v4-feature]');
 if(tile){
  var n=Number(tile.getAttribute('data-v4-feature'));
  if(n>=1&&n<=20)setTimeout(function(){if(openNo()===n)mount(n)},0);
  return;
 }
 var b=e.target.closest&&e.target.closest('[data-v4-mp-load]');
 if(b){e.preventDefault();load(b,Number(b.getAttribute('data-v4-mp-load')));return}
},false);
document.addEventListener('change',function(e){
 if(e.target&&e.target.matches('[data-v4-mp-machine]')){
  var sec=e.target.closest('.v4-mp-specific'),b=sec&&sec.querySelector('[data-v4-mp-load]');
  if(b&&e.target.value)load(b,Number(b.getAttribute('data-v4-mp-load')));
 }
},false);
window.OMODOS4=Object.assign(window.OMODOS4||{},{
 machinePredictiveSpecificVersion:'1',
 machinePredictiveSpecificFeatures:Array.from({length:20},function(_,i){return i+1})
});
})();

/* OMODOS4_LOW_COGNITIVE_DOM_V1
   Keeps later feature-specific panels plain-language without changing their actions. */
(function(){
'use strict';
var busy=false;
var EXACT={
 'Command Center':'Ringkasan Utama',
 'Things to Look At':'Perlu Dilihat',
 'What Changed?':'Apa yang Berubah?',
 'What Changed':'Apa yang Berubah?',
 'Latest Intelligence':'Data Terbaru',
 'Current Condition':'Kondisi Sekarang',
 'Reliability Evidence':'Riwayat Mesin',
 'Identity':'Data Mesin',
 'Machine-scoped context':'Ringkasan Mesin',
 'Deterministic brief baseline':'Ringkasan dari Data',
 'Historical similarity':'Kasus Lama yang Mirip',
 'Periksa oleh petugas queue':'Hal yang Perlu Dicek',
 'Ringkasan Singkat':'Ringkasan Singkat',
 'READ ONLY':'HANYA LIHAT',
 'Tidak menyimpan otomatis':'DATA AMAN',
 'DRAFT ONLY':'DRAF SAJA',
 'NOT A PREDICTION':'BUKAN RAMALAN',
 'ISOLATED V4 STATE':'AREA KHUSUS V4',
 'REVIEW ONLY':'HANYA CEK',
 'USES EXISTING DATA':'PAKAI DATA YANG ADA',
 'INTERACTIVE • Bukti data-FIRST':'BERDASARKAN DATA',
 'AI INTELLIGENCE • Bukti data-FIRST':'ASISTEN OMODOS',
 'IMPROVEMENT INTELLIGENCE':'PERBAIKAN',
 'FACTORY BRAIN • SOURCE-OF-TRUTH CONNECTED':'RINGKASAN PABRIK',
 'KNOWLEDGE HARVEST':'PENGETAHUAN',
 'EXPERT FINDER':'CARI ORANG BERPENGALAMAN',
 'EXPERIENCE PASSPORT':'RIWAYAT PENGALAMAN'
};
function currentNo(){
 var el=document.querySelector('#v4-safe-stage .v4-feature-no');
 if(el){var n=parseInt(el.textContent,10);if(Number.isFinite(n))return n}
 var sec=document.querySelector('#v4-safe-stage [data-v4-interaction-feature],#v4-safe-stage [data-v4-ai2-feature],#v4-safe-stage [data-v4-imp-feature],#v4-safe-stage [data-v4-fb-feature]');
 if(sec){
  var raw=sec.getAttribute('data-v4-interaction-feature')||sec.getAttribute('data-v4-ai2-feature')||sec.getAttribute('data-v4-imp-feature')||sec.getAttribute('data-v4-fb-feature');
  var x=parseInt(raw,10);if(Number.isFinite(x))return x
 }
 return 0;
}
function apply(){
 busy=false;
 var view=document.getElementById('view-omodos4');if(!view)return;
 view.classList.add('v4-low-cognitive');
 var shell={'.topbar .v4-eyebrow':'Ringkasan dan Bantuan Kerja','.topbar .sub':'Ringkasan untuk Superadmin berdasarkan catatan OMODOS yang tersedia.','#btn-v4-refresh':'Muat Ulang','.v4-hero .v4-eyebrow':'PANTAU • PAHAMI • TINDAK LANJUTI','.v4-hero .v4-title':'Ringkasan Utama','.v4-hero .v4-sub':'Lihat hal penting dari data OMODOS yang tersedia. Ringkasan ini tidak mengubah catatan pekerjaan.','.v4-hero .v4-source':'DATA OMODOS'};
 Object.keys(shell).forEach(function(selector){var el=view.querySelector(selector);if(!el)return;var node=Array.from(el.childNodes).find(function(n){return n.nodeType===3});if(node&&node.textContent.trim()!==shell[selector])node.textContent=' '+shell[selector]});
 var headings={'#v4-look-at':'Perlu Diperhatikan','#v4-changed':'Apa yang Berubah?','#v4-latest':'Catatan Terbaru'};
 Object.keys(headings).forEach(function(selector){var el=view.querySelector(selector),head=el&&el.previousElementSibling;if(head&&head.classList.contains('v4-section-title')){var node=Array.from(head.childNodes).find(function(n){return n.nodeType===3});if(node&&node.textContent.trim()!==headings[selector])node.textContent=' '+headings[selector]}});
 var info=window.OMODOS4&&window.OMODOS4.simpleFeatures||{},n=currentNo(),fi=info[n];
 if(fi){
  document.querySelectorAll('#v4-safe-stage .v4-interaction-head h3').forEach(function(h){h.textContent=fi.name});
 }
 document.querySelectorAll('#view-omodos4 h1,#view-omodos4 h2,#view-omodos4 h3,#view-omodos4 h4,#view-omodos4 strong,#view-omodos4 span,#view-omodos4 small').forEach(function(el){
  var t=String(el.textContent||'').trim();
  if(EXACT[t])el.textContent=EXACT[t];
 });
 document.querySelectorAll('#view-omodos4 .v4-no-write').forEach(function(el){
  var t=String(el.textContent||'').trim();
  if(EXACT[t])el.textContent=EXACT[t];
 });
}
function queue(){if(busy)return;busy=true;requestAnimationFrame(apply)}
document.addEventListener('click',function(e){
 var t=e.target.closest&&e.target.closest('[data-v4-tech-toggle]');
 if(t){
  e.preventDefault();
  var view=document.getElementById('view-omodos4');if(!view)return;
  var show=view.classList.toggle('v4-show-technical');
  t.innerHTML='<i class="ph-bold ph-sliders-horizontal"></i> '+(show?'Sembunyikan detail':'Detail teknis');
  return;
 }
 if(e.target.closest&&e.target.closest('[data-v4-feature],#v4-nav-group [data-v4-safe-module],[data-v4-back-workspace],[data-v4-back-command]'))setTimeout(queue,0);
},false);
var target=document.getElementById('view-omodos4')||document.body;
new MutationObserver(queue).observe(target,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',queue);else queue();
})();
