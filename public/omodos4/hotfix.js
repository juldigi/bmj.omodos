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
 10:{name:'Pusat Informasi Mesin',help:'Lihat kondisi penting dan hubungan data untuk satu mesin dalam satu tempat.'},

 11:{name:'Risiko Kerusakan',help:'Lihat mesin yang punya tanda risiko dan perlu dicek.'},
 12:{name:'Peringatan Dini',help:'Lihat tanda masalah sebelum menjadi gangguan lebih besar.'},
 13:{name:'Tanda Sebelum Rusak',help:'Cari tanda yang pernah muncul sebelum kerusakan.'},
 14:{name:'Masalah Berulang',help:'Temukan masalah yang muncul lagi dan lagi.'},
 15:{name:'Masalah Mirip Antar Mesin',help:'Bandingkan masalah serupa pada mesin yang berbeda.'},
 16:{name:'Penurunan Diam-Diam',help:'Cari perubahan kecil yang mungkin luput dari perhatian.'},
 17:{name:'Ciri Khas Kerusakan',help:'Lihat pola gejala yang sering muncul bersama.'},
 18:{name:'Kekuatan Bukti Risiko',help:'Lihat seberapa kuat dan lengkap bukti yang mendukung suatu risiko.'},
 19:{name:'Perkiraan Jarak Penggantian',help:'Lihat perkiraan waktu penggantian berikutnya dari pola penggantian yang pernah tercatat.'},
 20:{name:'Bagian yang Perlu Dicek',help:'Lihat bagian atau mesin yang paling perlu diperiksa.'},

 21:{name:'Tugas Teknisi',help:'Lihat pekerjaan yang perlu dilakukan teknisi.'},
 22:{name:'Panduan Cari Masalah',help:'Ikuti langkah sederhana untuk mencari penyebab masalah.'},
 23:{name:'Daftar Pemeriksaan',help:'Lihat daftar hal yang perlu diperiksa satu per satu.'},
 24:{name:'Isi Logbook dengan Suara',help:'Gunakan suara untuk membantu menulis catatan Logbook.'},
 25:{name:'Catat Foto Pemeriksaan',help:'Ambil atau lampirkan foto ke Logbook sebagai bukti. Analisis otomatis hanya memakai gejala tertulis, bukan isi foto.'},
 26:{name:'Bukti Sebelum & Sesudah',help:'Bandingkan kondisi sebelum dan sesudah pekerjaan.'},
 27:{name:'Buka Mesin lewat QR',help:'Pindai QR untuk membuka mesin yang tepat.'},
 28:{name:'Buka Mesin lewat NFC',help:'Gunakan NFC untuk membuka data mesin.'},
 29:{name:'Urutan Kunjungan Mesin',help:'Lihat mesin mana yang sebaiknya didatangi lebih dulu berdasarkan prioritas data.'},
 30:{name:'Status Antrean Offline',help:'Lihat kiriman Logbook yang masih tersimpan di perangkat dan menunggu sinkronisasi saat koneksi kembali.'},

 31:{name:'Prioritas Perhatian Sparepart',help:'Lihat sparepart yang perlu diperiksa lebih dulu berdasarkan pemakaian, stok, ETA, dan mesin terkait.'},
 32:{name:'Stok Habis atau Menipis',help:'Lihat sparepart yang benar-benar tercatat habis atau sudah mencapai batas stok minimum.'},
 33:{name:'Belum Tercatat Dipakai',help:'Lihat sparepart yang masih punya stok tetapi belum ditemukan pemakaiannya pada Logbook yang tersedia.'},
 34:{name:'Pemakaian Sparepart',help:'Lihat sparepart yang paling sering digunakan.'},
 35:{name:'Mesin & Sparepart Terkait',help:'Lihat sparepart yang tercatat terkait dengan mesin.'},
 36:{name:'Pengganti Sparepart yang Tercatat',help:'Lihat alternatif atau pengganti yang memang sudah tercatat di data sparepart untuk diperiksa Engineering.'},
 37:{name:'Foto Referensi Sparepart',help:'Lihat foto referensi sparepart yang sudah tercatat tanpa menebak isi foto.'},
 38:{name:'Lokasi Sparepart',help:'Lihat lokasi atau rak sparepart yang sudah tercatat.'},
 39:{name:'Perkiraan Frekuensi Kebutuhan Sparepart',help:'Lihat perkiraan seberapa sering sparepart mungkin dibutuhkan berdasarkan catatan pemakaian yang valid.'},
 40:{name:'Prioritas Pembelian Sparepart',help:'Lihat sparepart yang lebih mendesak untuk proses pembelian berdasarkan stok, ETA, dan tingkat perhatian datanya.'},

 41:{name:'Ringkasan Keandalan',help:'Lihat gambaran umum keandalan mesin.'},
 42:{name:'Mesin Paling Perlu Perhatian',help:'Lihat mesin yang perlu diperiksa lebih dulu berdasarkan kesehatan, gangguan, waktu berhenti, masalah berulang, dan masalah yang belum selesai.'},
 43:{name:'Masalah Terbanyak',help:'Lihat jenis masalah yang paling sering tercatat dan waktu berhentinya.'},
 44:{name:'Pola Gangguan Mesin',help:'Kelompokkan mesin dengan masalah berulang dan mesin yang punya waktu berhenti tetapi belum membentuk pola berulang.'},
 45:{name:'Waktu Berhenti yang Tidak Berlabel Gangguan',help:'Cari waktu berhenti di Logbook yang tidak diberi kategori gangguan atau perbaikan.'},
 46:{name:'Tren Gangguan Bulanan',help:'Lihat jumlah gangguan, waktu berhenti, dan jumlah mesin terdampak dari bulan ke bulan.'},
 47:{name:'Riwayat RCA',help:'Cari RCA lama yang berkaitan dengan masalah sekarang.'},
 48:{name:'Efek Tindakan Perbaikan',help:'Bandingkan kondisi sebelum dan sesudah tindakan.'},
 49:{name:'Biaya Gangguan yang Tercatat',help:'Lihat angka biaya yang memang sudah dicatat pada data gangguan, Logbook, atau tindakan perbaikan.'},
 50:{name:'Biaya per Menit Berhenti',help:'Lihat dampak biaya dari waktu mesin berhenti jika datanya ada.'},

 51:{name:'Cerita KPI',help:'Baca KPI dalam bentuk ringkasan yang mudah dipahami.'},
 52:{name:'Data yang Berkaitan dengan KPI',help:'Lihat data maintenance atau energi yang mungkin berkaitan dengan perubahan KPI.'},
 53:{name:'Tren & Perkiraan KPI',help:'Lihat arah perubahan KPI dan perkiraan nilai berikutnya bila data sejak 1 September 2026 sudah cukup.'},
 54:{name:'Coba Nilai KPI vs Target',help:'Masukkan angka KPI hipotetis lalu lihat apakah angka tersebut mencapai target yang tercatat. Tidak memprediksi dampak maintenance.'},
 55:{name:'Hubungan Breakdown & Hasil Produksi',help:'Lihat apakah jam breakdown dan good output bergerak bersama pada periode yang sama.'},
 56:{name:'Energi yang Jauh dari Pola',help:'Lihat catatan energi yang nilainya jauh dari rata-rata kelompok area dan jenis yang sama.'},
 57:{name:'Energi per Hasil Baik',help:'Bandingkan energi dengan hasil produksi yang baik pada pasangan data yang tersedia.'},
 58:{name:'Ringkasan Catatan Utilitas',help:'Lihat jumlah catatan dan nilai rata-rata utilitas per area dan jenis.'},
 59:{name:'Ringkasan Data IPAL',help:'Lihat angka IPAL yang tercatat tanpa menyimpulkan lolos atau tidak terhadap batas resmi.'},
 60:{name:'Ringkasan 1 Menit',help:'Baca hal penting hari ini secara cepat.'},

 61:{name:'Ringkasan Pengalaman & Penilaian Teknisi',help:'Lihat riwayat kerja, penilaian, mesin yang pernah ditangani, RCA, dan pengetahuan yang tercatat tanpa membuat nilai kinerja otomatis.'},
 62:{name:'Teknisi & Mesin yang Pernah Ditangani',help:'Lihat hubungan teknisi dengan mesin berdasarkan Logbook dan RCA yang tercatat.'},
 63:{name:'Cari Teknisi dengan Pengalaman Terkait',help:'Cari teknisi yang punya bukti keterlibatan pada mesin atau kasus serupa. Hasil bukan peringkat kinerja.'},
 64:{name:'Riwayat Pengalaman Teknisi',help:'Lihat pengalaman teknisi yang tercatat di OMODOS.'},
 65:{name:'Risiko Pengetahuan Terbatas',help:'Lihat mesin yang bukti pengalaman orang dan dokumentasi pengetahuannya masih terbatas.'},
 66:{name:'Kebutuhan Belajar yang Tercatat',help:'Lihat kesenjangan atau kebutuhan pengembangan yang memang tercatat pada penilaian.'},
 67:{name:'Saran Rencana Belajar',help:'Lihat saran langkah belajar dari kebutuhan yang tercatat, standar, riwayat mesin, dan calon mentor yang tersedia. Atasan tetap menentukan rencana resminya.'},
 68:{name:'Kandidat Mentor',help:'Lihat kandidat mentor berdasarkan bukti pengalaman yang tercatat. Penunjukan tetap perlu persetujuan.'},
 69:{name:'Latihan dari Kasus Nyata',help:'Berlatih membaca masalah berulang dan referensi RCA nyata tanpa mengubah data.'},
 70:{name:'Bukti Penilaian & Pengalaman',help:'Lihat penilaian, riwayat mesin, RCA, dan pengetahuan yang sudah tercatat tanpa menyimpulkan kinerja otomatis.'},

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

 81:{name:'Peluang Perbaikan',help:'Cari masalah berulang yang mungkin perlu perbaikan.'},
 82:{name:'Buat Draf Kaizen',help:'Buat draf Kaizen tanpa langsung menyimpan proyek baru.'},
 83:{name:'Cek Bukti Manfaat Proyek',help:'Lihat apakah bukti manfaat proyek sudah cukup terisi.'},
 84:{name:'Lihat Sebelum & Sesudah Kaizen',help:'Lihat bukti perubahan Kaizen yang sudah tercatat.'},
 85:{name:'Kumpulan Ide Perbaikan',help:'Lihat semua ide dan perbaikan yang masih terbuka.'},
 86:{name:'Cari Kaizen yang Mirip',help:'Cari perbaikan yang mungkin mirip agar tidak membuat catatan ganda.'},
 87:{name:'Proyek yang Perlu Perhatian',help:'Lihat proyek yang terlambat atau masih terbuka.'},
 88:{name:'Cerita SGA',help:'Baca ringkasan SGA dari data yang sudah dicatat.'},
 89:{name:'Hubungan Pengetahuan Perbaikan',help:'Lihat hubungan perbaikan dengan mesin, masalah, dan pengetahuan.'},
 90:{name:'Riwayat Perbaikan',help:'Lihat perjalanan proyek, Kaizen, dan SGA dari tahun ke tahun.'},

 91:{name:'Gambaran Pabrik dari Data',help:'Lihat hubungan mesin dan maintenance sebagai gambaran besar.'},
 92:{name:'Pantau Risiko Maintenance',help:'Saring periode atau mesin lalu lihat risiko utama beserta sumber datanya.'},
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
function monthNumber(v){
 var n=Number(v);if(Number.isFinite(n)&&n>=1&&n<=12)return Math.trunc(n);
 var x=String(v||'').toLowerCase().replace(/\./g,'');
 var names=[['jan','januari','january'],['feb','februari','february'],['mar','maret','march'],['apr','april'],['mei','may'],['jun','juni','june'],['jul','juli','july'],['agu','agust','agustus','aug','august'],['sep','sept','september'],['okt','oct','oktober','october'],['nop','nov','november'],['des','dec','desember','december']];
 var idx=names.findIndex(function(a){return a.some(function(k){return x.indexOf(k)===0})});
 return idx>=0?idx+1:0;
}
function periodValue(o){
 if(!o||typeof o!=='object')return 0;
 var year=Number(val(o,['Tahun','Year'])),month=monthNumber(val(o,['Bulan','Month']));
 if(!year||!month)return 0;
 return Date.UTC(year,month-1,1)-7*3600000;
}
function sourceTimestamp(o){return dateValue(o)||periodValue(o)||0}
function temporalRows(list){return arr(list).filter(function(r){return sourceTimestamp(r)>=V4_CUTOFF})}
function getEntries(){
 try{
  var rows=arr(typeof ENTRIES!=='undefined'?ENTRIES:[]);
  if(typeof sotEntries==='function') rows=arr(sotEntries(rows));
  return temporalRows(rows);
 }catch(e){return []}
}
function getPatrol(){try{return temporalRows(typeof PM_REPORTS!=='undefined'?PM_REPORTS:[])}catch(e){return []}}
function getMachines(){try{return arr(typeof MACHINES!=='undefined'?MACHINES:[])}catch(e){return []}}
function getBreakdown(){try{return temporalRows(typeof MACHINE_BREAKDOWN!=='undefined'?MACHINE_BREAKDOWN:[])}catch(e){return []}}
function getPeople(){
 try{
  var p=arr(typeof PI_PERSONNEL_MASTER!=='undefined'?PI_PERSONNEL_MASTER:[]);
  return p.length?p:arr(typeof PERSONIL!=='undefined'?PERSONIL:[]);
 }catch(e){return []}
}
function getSoftAssess(){try{return temporalRows(typeof PI_SS_SCORES!=='undefined'?PI_SS_SCORES:[])}catch(e){return []}}
function getHardAssess(){try{return temporalRows(typeof PI_HS_ASSESSMENTS!=='undefined'?PI_HS_ASSESSMENTS:[])}catch(e){return []}}
function getKnowledge(){try{return temporalRows(typeof KB_ENTRIES!=='undefined'?KB_ENTRIES:[])}catch(e){return []}}
function getKpi(){
 var out=[];
 try{out=out.concat(arr(typeof KPI_DEPARTMENT_YTD!=='undefined'?KPI_DEPARTMENT_YTD:[]))}catch(e){}
 try{out=out.concat(temporalRows(typeof KPI_KERJA!=='undefined'?KPI_KERJA:[]))}catch(e){}
 return out;
}
function getEnergy(){
 var out=[];
 try{out=out.concat(temporalRows(typeof ENERGY_UTILITY!=='undefined'?ENERGY_UTILITY:[]))}catch(e){}
 try{out=out.concat(temporalRows(typeof ENERGY_COST_TOE!=='undefined'?ENERGY_COST_TOE:[]))}catch(e){}
 return out;
}
function getIpal(){
 try{
  var x=typeof IPAL_CURRENT!=='undefined'?IPAL_CURRENT:null;
  if(Array.isArray(x)) return temporalRows(x);
  return x&&typeof x==='object'?temporalRows([x]):[];
 }catch(e){return []}
}
function getRunHour(){try{return temporalRows(typeof RUN_HOUR_COMPARISON!=='undefined'?RUN_HOUR_COMPARISON:[])}catch(e){return []}}
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
 return temporalRows(out);
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
   try{return temporalRows(typeof GENERAL_REPORTS!=='undefined'?GENERAL_REPORTS:[]).filter(function(x){return /rca/i.test(text(x))}).length}catch(e){return 0}
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
 var raw=val(o,['ts','Timestamp','Timestamp Input','timestamp','Updated At','UpdatedAt','updatedAt','Created At','CreatedAt','createdAt','Tanggal Laporan','Tanggal Kejadian','Tanggal Input','Tanggal Mulai','StartedAt','tanggal','Tanggal','Date','date']);
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
 // KPI YTD stores several months in one row. Reading a generic achievement field here
 // could expose Jan-Aug values. The server overview applies the Sep-2026 cutoff correctly,
 // so the local fallback intentionally stays unavailable instead of guessing.
 return null;
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
 return '<details class="v4-simple-details v4-source-details"><summary><i class="ph-bold ph-database"></i> Lihat sumber data</summary><p class="v4-muted">Catatan historis OMODOS 4.0 dihitung mulai 1 September 2026. Master mesin, personel, stok, lokasi, dan template dapat dipakai sebagai referensi kondisi saat ini.</p>'+grid+'</details>';
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
 return '<div class="v4-time-machine"><label>Tanggal & Waktu<input id="v4-time-machine-at" type="datetime-local" value="'+esc(local)+'"></label><button class="btn btn-primary btn-sm" data-v4-time-machine-run><i class="ph-bold ph-clock-counter-clockwise"></i> Rekonstruksi</button></div><div id="v4-time-machine-result"><div class="v4-empty">Pilih waktu lalu jalankan rekonstruksi. Sistem hanya memakai catatan yang benar-benar tersedia.</div></div>';
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
 return '<div class="v4-brain-canvas"><div class="v4-brain-center"><i class="ph-bold ph-cpu"></i><strong>OMODOS</strong><small>RINGKASAN PABRIK</small></div><div class="v4-brain-nodes">'+brainCounts().map(function(x){return '<button data-v4-open-existing="'+x[2]+'"><span>'+esc(x[0])+'</span><b>'+x[1]+'</b><small>'+(x[1]?'Tercatat / dihitung':'Belum tersedia')+'</small></button>'}).join('')+'</div></div><p class="v4-muted">Setiap bagian terhubung dengan catatan yang tersedia; jumlah kosong berarti datanya belum ada.</p>';
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
 // Shell only. Dedicated feature modules 1–100 populate .v4-detail-body after the card opens.
 // This avoids showing the old generic preview underneath the specific feature UI.
 var body='';
 s.innerHTML='<div class="v4-card v4-detail-card">'+
  '<span class="v4-feature-no" hidden aria-hidden="true">'+f.n+'</span>'+
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
 getMachineNames:getMachineNames,
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
 99:'v4.getFieldMission',
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
 99:['missions'],
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
 return first?String(o[first]):'Bukti data';
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
  return '<div class="v4-mp-row"><div><strong>'+h(title)+'</strong><small>'+h(x.timestamp||x.generatedAt||'Data server')+'</small></div><div>'+h(sub||'Catatan OMODOS')+'<div class="v4-chip-row"><span class="v4-risk-chip">'+h(badge)+'</span></div></div></div>';
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
 if(feature){var n=Number(feature.getAttribute('data-v4-feature'));/* Fitur 001–100 sudah memiliki renderer khusus. Jangan tambahkan panel server generik yang membuat semua halaman terasa sama. */if(n<1||n>100)setTimeout(function(){hydrateFeature(n)},0);return}
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
 71:{purpose:'ask',title:'Tanya OMODOS',placeholder:'Contoh: Apa yang paling perlu diperhatikan hari ini?',defaultText:''},
 72:{purpose:'machine',title:'Tanya Tentang Mesin',placeholder:'Tanyakan kondisi, pola, risiko, atau riwayat mesin.',defaultText:'Jelaskan kondisi mesin ini, pola masalah, risiko yang perlu diperiksa, dan bukti data yang mendukung.'},
 73:{purpose:'shift',title:'Ringkasan Pergantian Shift',placeholder:'Buat ringkasan pergantian shift berdasarkan data OMODOS.',defaultText:'Buat ringkasan pergantian shift: perubahan penting, masalah yang belum selesai, risiko, dan tindakan yang perlu diteruskan.'},
 74:{purpose:'morning-brief',title:'Ringkasan Pagi',placeholder:'Buat ringkasan maintenance pagi.',defaultText:'Buat ringkasan maintenance pagi yang singkat, berdasarkan bukti data, dan utamakan hal yang perlu ditindaklanjuti.'},
 75:{purpose:'rca-draft',title:'Buat Draf RCA',placeholder:'Tuliskan masalah atau gejala untuk membuat draf RCA.',defaultText:''},
 76:{purpose:'troubleshooting',title:'Cari Kasus Mirip',placeholder:'Tuliskan gejala atau masalah yang sedang dihadapi.',defaultText:''},
 77:{purpose:'manual',title:'Tanya Manual',placeholder:'Tanyakan hal yang ingin dipahami dari manual atau pengetahuan yang tersedia.',defaultText:''},
 79:{purpose:'translate',title:'Terjemahkan Istilah Maintenance',placeholder:'Masukkan istilah atau kalimat maintenance yang ingin dibuat lebih mudah dipahami.',defaultText:''},
 80:{purpose:'skeptic',title:'Periksa Ulang Asumsi',placeholder:'Tuliskan asumsi atau dugaan yang ingin diperiksa ulang.',defaultText:''},
 82:{purpose:'kaizen-draft',title:'Buat Draf Kaizen',placeholder:'Tuliskan masalah atau peluang yang ingin dibuatkan draf Kaizen.',defaultText:''}
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
 return typeof e==='string'?e:(e&&e.message)||'Permintaan OMODOS 4.0 gagal';
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
 try{
  if(window.OMODOS4&&typeof window.OMODOS4.getMachineNames==='function')return window.OMODOS4.getMachineNames();
 }catch(e){}
 var set=new Set();
 try{(Array.isArray(MACHINES)?MACHINES:[]).forEach(function(m){var n=m['Nama Mesin']||m.namaMesin||m['Kode Mesin']||m.kodeMesin;if(n)set.add(String(n))})}catch(e){}
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
 return firstText(r,['Nama Mesin','namaMesin','Machine','Mesin','Title','Judul','Problem','Deskripsi Masalah','Deskripsi','description','Nama Material','Nama','ID'])||firstText(e,['machine','title','problem','description','sheet'])||'Bukti data';
}
function resultCards(arr){
 if(!Array.isArray(arr)||!arr.length)return '<div class="v4-empty">Tidak ada bukti data tambahan.</div>';
 return '<div class="v4-interaction-evidence">'+arr.slice(0,12).map(function(e){
  var src=firstText(e,['sheet','source','type','label'])||'OMODOS';
  var score=e&&e.score!=null?' • nilai '+Math.round(Number(e.score)*100)/100:'';
  return '<div class="v4-interaction-evidence-card"><strong>'+x(evidenceTitle(e))+'</strong><small>'+x(src+score)+'</small></div>';
 }).join('')+'</div>';
}
function aiResultHtml(data){
 data=data||{};
 var summary=firstText(data,['summary','answer'])||'Tidak ada ringkasan.';
 var assumptions=Array.isArray(data.assumptions)?data.assumptions:[];
 return '<div class="v4-ai-result">'+
  '<div class="v4-interaction-result-head"><span class="v4-server-badge">'+x(data.mode==='DETERMINISTIC_FALLBACK'?'Ringkasan dari data':'Asisten OMODOS')+'</span><span>Tingkat keyakinan: '+x(data.confidence||'belum tersedia')+'</span></div>'+
  '<div class="v4-ai-answer">'+x(summary).replace(/\n/g,'<br>')+'</div>'+
  (assumptions.length?'<div class="v4-assumptions"><strong>Asumsi</strong><ul>'+assumptions.slice(0,8).map(function(a){return '<li>'+x(a)+'</li>'}).join('')+'</ul></div>':'')+
  resultCards(data.evidence)+
  note('Hasil perlu diperiksa oleh petugas. Asisten hanya membantu membaca data dan tidak mengubah data operasional secara otomatis.','safe')+
 '</div>';
}
function mountAi(n){
 var cfg=AI_CONFIG[n],host=bodyHost();if(!cfg||!host||!featureOpen(n))return;
 var old=host.querySelector('.v4-interaction');if(old)old.remove();
 var machines=machineNames(),needMachine=n===72;
 var machineField='<label>Mesin '+(needMachine?'<b>*</b>':'(opsional)')+'<select data-v4-ai-machine>'+options(machines,needMachine?'Pilih mesin':'Semua mesin')+'</select></label>';
 var sec=document.createElement('section');sec.className='v4-interaction v4-ai-interaction';sec.setAttribute('data-v4-interaction-feature',n);
 sec.innerHTML='<div class="v4-interaction-head"><div><span class="v4-eyebrow">INTERAKTIF • BERDASARKAN BUKTI DATA</span><h3>'+x(cfg.title)+'</h3></div><span class="v4-no-write">Tidak menyimpan otomatis</span></div>'+
  '<div class="v4-form-grid">'+machineField+
  '<label class="v4-form-wide">Pertanyaan / konteks<textarea data-v4-ai-query rows="4" placeholder="'+x(cfg.placeholder)+'">'+x(cfg.defaultText)+'</textarea></label></div>'+
  '<div class="v4-interaction-actions"><button class="btn btn-primary btn-sm" data-v4-ai-run="'+n+'"><i class="ph-bold ph-sparkle"></i> Analisis dengan OMODOS 4.0</button></div>'+
  '<div data-v4-ai-output>'+note('Analisis hanya berjalan setelah Anda memilih tombol. Bukti diambil dari data OMODOS yang sudah tersedia.','safe')+'</div>';
 host.prepend(sec);
}
async function runAi(btn,n){
 var sec=btn.closest('.v4-interaction'),q=sec.querySelector('[data-v4-ai-query]').value.trim(),m=sec.querySelector('[data-v4-ai-machine]').value;
 var cfg=AI_CONFIG[n],out=sec.querySelector('[data-v4-ai-output]');
 if(!q){out.innerHTML=note('Isi pertanyaan/konteks terlebih dahulu.','warn');return}
 if(n===72&&!m){out.innerHTML=note('Pilih satu mesin agar data dari mesin lain tidak tercampur.','warn');return}
 busy(btn,true,'Menganalisis');
 out.innerHTML=note('Mencocokkan pertanyaan dengan bukti data OMODOS…','safe');
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
 sec.innerHTML='<div class="v4-interaction-head"><div><span class="v4-eyebrow">CARI PENGETAHUAN BARU</span><h3>Periksa Kandidat Pengetahuan</h3></div><span class="v4-no-write">Tidak menyimpan</span></div>'+
 note('OMODOS mencari solusi berulang dan RCA yang sudah ada. Tidak ada artikel pengetahuan yang dibuat otomatis.','safe')+
 '<div class="v4-interaction-actions"><button class="btn btn-primary btn-sm" data-v4-harvest-refresh><i class="ph-bold ph-arrows-clockwise"></i> Muat Kandidat</button></div><div data-v4-harvest-output></div>';
 host.prepend(sec);
}
async function runHarvest(btn){
 var sec=btn.closest('.v4-interaction'),out=sec.querySelector('[data-v4-harvest-output]');busy(btn,true,'Memuat');
 try{
  var d=await v4Action('v4.getKnowledgeCandidates',{});
  out.innerHTML='<div class="v4-interaction-result-head"><span>'+(Array.isArray(d.candidates)?d.candidates.length:0)+' kandidat</span><span>Artikel yang ada: '+x(d.existingKnowledgeRecords==null?'—':d.existingKnowledgeRecords)+'</span></div>'+resultCards(d.candidates)+note(d.note||'Periksa kandidat sebelum memasukkannya ke Pengetahuan.','safe');
 }catch(e){out.innerHTML=note(e.message||String(e),'error')}
 finally{busy(btn,false)}
}
function mountExpert(){
 var host=bodyHost();if(!host||!featureOpen(63))return;
 var old=host.querySelector('.v4-interaction');if(old)old.remove();
 var sec=document.createElement('section');sec.className='v4-interaction';sec.setAttribute('data-v4-interaction-feature','63');
 sec.innerHTML='<div class="v4-interaction-head"><div><span class="v4-eyebrow">CARI ORANG BERPENGALAMAN</span><h3>Cari berdasarkan riwayat keterlibatan</h3></div></div>'+
 '<div class="v4-form-grid"><label>Mesin<select data-v4-expert-machine>'+options(machineNames(),'Semua mesin')+'</select></label><label class="v4-form-wide">Masalah / gejala<input data-v4-expert-query placeholder="Opsional: jelaskan masalah yang relevan"></label></div>'+
 '<div class="v4-interaction-actions"><button class="btn btn-primary btn-sm" data-v4-expert-run><i class="ph-bold ph-magnifying-glass"></i> Cari Orang Berpengalaman</button></div><div data-v4-expert-output>'+note('Urutan hasil dibuat dari bukti keterlibatan di OMODOS, bukan penilaian kinerja karyawan.','safe')+'</div>';
 host.prepend(sec);
}
async function runExpert(btn){
 var sec=btn.closest('.v4-interaction'),out=sec.querySelector('[data-v4-expert-output]'),machine=sec.querySelector('[data-v4-expert-machine]').value,query=sec.querySelector('[data-v4-expert-query]').value.trim();
 busy(btn,true,'Mencari');
 try{var d=await v4Action('v4.getExpertFinder',{machine:machine,query:query});out.innerHTML=resultCards(d.experts)+note(d.note||'Hasil perlu diperiksa oleh petugas.','safe')}
 catch(e){out.innerHTML=note(e.message||String(e),'error')}finally{busy(btn,false)}
}
function mountExperience(){
 var host=bodyHost();if(!host||!featureOpen(64))return;
 var old=host.querySelector('.v4-interaction');if(old)old.remove();
 var sec=document.createElement('section');sec.className='v4-interaction';sec.setAttribute('data-v4-interaction-feature','64');
 sec.innerHTML='<div class="v4-interaction-head"><div><span class="v4-eyebrow">RIWAYAT PENGALAMAN</span><h3>Pilih personil</h3></div></div>'+
 '<div class="v4-form-grid"><label>Personil<select data-v4-exp-person>'+options(peopleNames(),'Pilih personil')+'</select></label></div>'+
 '<div class="v4-interaction-actions"><button class="btn btn-primary btn-sm" data-v4-exp-run><i class="ph-bold ph-identification-card"></i> Buka Riwayat Pengalaman</button></div><div data-v4-exp-output></div>';
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
 try{var d=await v4Action('v4.getExperiencePassport',{name:name});out.innerHTML=objectList(d)+note('Riwayat ini disusun dari data personil dan riwayat kerja yang sudah ada; bukan penilaian kinerja.','safe')}
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
 sec.innerHTML='<div class="v4-interaction-head"><div><span class="v4-eyebrow">COBA SKENARIO</span><h3>Simulasi Berdasarkan Asumsi</h3></div><span class="v4-no-write">Simulasi saja</span></div>'+
 note('Masukkan asumsi perubahan. Simulasi tidak mengubah KPI, Logbook, stok, atau data operasional yang ada.','safe')+
 '<div class="v4-slider-grid">'+
  '<label>Pengurangan waktu mesin berhenti (%)<input type="number" min="0" max="100" value="0" data-v4-s-downtime></label>'+
  '<label>Pengurangan masalah berulang (%)<input type="number" min="0" max="100" value="0" data-v4-s-recurring></label>'+
  '<label>Pengurangan risiko stok habis (%)<input type="number" min="0" max="100" value="0" data-v4-s-stock></label>'+
  '<label>Penyelesaian tindakan (%)<input type="number" min="0" max="100" value="0" data-v4-s-action></label>'+
 '</div><div class="v4-interaction-actions"><button class="btn btn-primary btn-sm" data-v4-s-run><i class="ph-bold ph-play"></i> Lihat hasil simulasi</button></div>'+
 '<div data-v4-s-output></div>'+
 '<div class="v4-save-box"><label>Nama skenario<input data-v4-s-name maxlength="200" placeholder="Contoh: Skenario PM Q4"></label><button class="btn btn-sm" data-v4-s-save disabled><i class="ph-bold ph-floppy-disk"></i> Simpan Skenario</button><small>Penyimpanan hanya mencatat skenario di area V4 dan tidak mengubah data operasional.</small></div><div data-v4-s-save-output></div>';
 host.prepend(sec);
}
function scenarioHtml(d){
 var base=d&&d.baseline||{},proj=d&&d.projected||{};
 var keys=['downtimeMinutes','recurringPatterns','sparepartRisks','openHighPriorityActions'];
 var names={downtimeMinutes:'Waktu mesin berhenti (menit)',recurringPatterns:'Masalah berulang',sparepartRisks:'Risiko sparepart',openHighPriorityActions:'Tindakan penting belum selesai'};
 return '<div class="v4-scenario-result"><div class="v4-compare-head"><span>Ukuran</span><span>Kondisi Awal</span><span>Hasil Skenario</span></div>'+
 keys.map(function(k){return '<div class="v4-compare-row"><strong>'+x(names[k]||k)+'</strong><span>'+x(base[k]==null?'—':base[k])+'</span><b>'+x(proj[k]==null?'—':proj[k])+'</b></div>'}).join('')+
 '</div>'+note((d.assumptions||[]).join(' • ')||'Simulasi memakai asumsi yang Anda masukkan.','safe');
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
  out.innerHTML=note('Skenario tersimpan di area V4. ID: '+(d.id||'tercatat')+'. Data operasional tidak berubah.','safe');
 }catch(e){out.innerHTML=note(e.message||String(e),'error')}finally{busy(btn,false)}
}
function mountWarRoom(){
 var host=bodyHost();if(!host||!featureOpen(98))return;
 var old=host.querySelector('.v4-interaction');if(old)old.remove();
 var sec=document.createElement('section');sec.className='v4-interaction v4-war-interaction';sec.setAttribute('data-v4-interaction-feature','98');
 sec.innerHTML='<div class="v4-interaction-head"><div><span class="v4-eyebrow">RUANG KOORDINASI MASALAH</span><h3>Koordinasi Masalah Besar</h3></div><span class="v4-no-write">Catatan koordinasi</span></div>'+
 note('Membuat ruang koordinasi tidak mengubah Logbook lama. Yang disimpan hanya catatan koordinasi di area V4.','safe')+
 '<details class="v4-war-create"><summary><i class="ph-bold ph-plus-circle"></i> Buat Ruang Koordinasi Baru</summary><div class="v4-form-grid">'+
  '<label>Mesin *<select data-v4-war-machine>'+options(machineNames(),'Pilih mesin')+'</select></label>'+
  '<label>Tingkat masalah<select data-v4-war-severity><option value="P0">Sangat mendesak</option><option value="P1" selected>Mendesak</option><option value="P2">Sedang</option><option value="P3">Rendah</option></select></label>'+
  '<label>Judul *<input data-v4-war-title maxlength="200" placeholder="Masalah utama"></label>'+
  '<label>Penanggung jawab<input data-v4-war-owner maxlength="160" placeholder="Nama penanggung jawab"></label>'+
  '<label>Periksa lagi pada<input type="datetime-local" data-v4-war-checkpoint></label>'+
  '<label class="v4-form-wide">Ringkasan<textarea rows="3" data-v4-war-summary maxlength="4000"></textarea></label>'+
 '</div><div class="v4-interaction-actions"><button class="btn btn-primary btn-sm" data-v4-war-create><i class="ph-bold ph-siren"></i> Buat ruang koordinasi</button></div><div data-v4-war-create-output></div></details>'+
 '<div class="v4-war-columns"><div><div class="v4-interaction-subhead"><strong>Ruang Koordinasi yang Ada</strong><button class="btn btn-sm" data-v4-war-refresh><i class="ph-bold ph-arrows-clockwise"></i> Muat Ulang</button></div><div data-v4-war-list></div></div><div><div class="v4-interaction-subhead"><strong>Rincian dan Perkembangan</strong></div><div data-v4-war-detail>'+note('Pilih ruang koordinasi untuk melihat rinciannya.','safe')+'</div></div></div>';
 host.prepend(sec);
 if(actionReady())refreshWarList(sec);
 else sec.querySelector('[data-v4-war-list]').innerHTML=note('Daftar belum dapat dimuat. Coba lagi setelah masuk kembali.','warn');
}
function warId(r){return firstText(r,['ID','id','WarRoomID','warRoomId'])}
function warTitle(r){return firstText(r,['Title','title'])||'Ruang Koordinasi'}
function warStatusLabel(s){var v=String(s||'').toUpperCase();return v==='OPEN'?'Terbuka':v==='MONITORING'?'Dipantau':v==='CLOSED'?'Selesai':s||'—'}
function warSeverityLabel(s){var v=String(s||'').toUpperCase();return v==='P0'?'Sangat mendesak':v==='P1'?'Mendesak':v==='P2'?'Sedang':v==='P3'?'Rendah':s||'—'}
async function refreshWarList(sec,selectId){
 var out=sec.querySelector('[data-v4-war-list]');out.innerHTML=note('Memuat ruang koordinasi…','safe');
 try{
  var d=await v4Action('v4.getWarRoom',{}),wars=Array.isArray(d.wars)?d.wars:[];
  out.innerHTML=wars.length?'<div class="v4-war-list">'+wars.map(function(w){
   var id=warId(w),status=firstText(w,['Status','status'])||'';
   return '<button type="button" class="v4-war-item" data-v4-war-open="'+x(id)+'"><strong>'+x(warTitle(w))+'</strong><span>'+x(firstText(w,['Machine','machine'])||'')+'</span><small>'+x(warStatusLabel(status))+'</small></button>';
  }).join('')+'</div>':'<div class="v4-empty">Belum ada ruang koordinasi.</div>';
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
 var names={openIssues:'Masalah belum selesai',experts:'Orang berpengalaman',similarCases:'Kasus mirip',candidateRootCauseEvidence:'Bukti calon penyebab',rca:'RCA',knowledge:'Pengetahuan',manuals:'Manual',decisions:'Keputusan',actions:'Tindakan'};
 ['openIssues','experts','similarCases','candidateRootCauseEvidence','rca','knowledge','manuals','decisions','actions'].forEach(function(k){
  if(Array.isArray(ctx[k])&&ctx[k].length)sections.push('<div class="v4-war-context-section"><strong>'+x(names[k]||k)+'</strong>'+resultCards(ctx[k])+'</div>');
 });
 return sections.join('');
}
async function loadWar(sec,id){
 var out=sec.querySelector('[data-v4-war-detail]');out.innerHTML=note('Memuat rincian ruang koordinasi…','safe');
 try{
  var d=await v4Action('v4.getWarRoom',{id:id});
  if(!d.war){out.innerHTML=note('Ruang koordinasi tidak ditemukan.','warn');return}
  var w=d.war,status=firstText(w,['Status','status'])||'OPEN',owner=firstText(w,['Owner','owner']),checkpoint=firstText(w,['NextCheckpoint','nextCheckpoint']),summary=firstText(w,['Summary','summary']);
  out.innerHTML='<div class="v4-war-detail-card"><h4>'+x(warTitle(w))+'</h4><div class="v4-kv-stack"><div><span>Mesin</span><b>'+x(firstText(w,['Machine','machine']))+'</b></div><div><span>Tingkat masalah</span><b>'+x(warSeverityLabel(firstText(w,['Severity','severity'])))+'</b></div><div><span>Status</span><b>'+x(warStatusLabel(status))+'</b></div></div>'+
   contextBlock(d.context)+
   '<div class="v4-war-update"><h4>Catat Perkembangan</h4><div class="v4-form-grid">'+
    '<label>Status<select data-v4-war-u-status><option value="OPEN"'+(status==='OPEN'?' selected':'')+'>Terbuka</option><option value="MONITORING"'+(status==='MONITORING'?' selected':'')+'>Dipantau</option><option value="CLOSED"'+(status==='CLOSED'?' selected':'')+'>Selesai</option></select></label>'+
    '<label>Jenis catatan<select data-v4-war-u-type><option value="update">Perkembangan</option><option value="decision">Keputusan</option><option value="action">Tindakan</option><option value="checkpoint">Waktu pemeriksaan berikutnya</option><option value="state-change">Perubahan status</option></select></label>'+
    '<label>Penanggung jawab<input data-v4-war-u-owner maxlength="160" value="'+x(owner)+'"></label>'+
    '<label>Periksa lagi pada<input data-v4-war-u-checkpoint maxlength="200" value="'+x(checkpoint)+'"></label>'+
    '<label class="v4-form-wide">Ringkasan<textarea rows="3" data-v4-war-u-summary maxlength="4000">'+x(summary)+'</textarea></label>'+
    '<label class="v4-form-wide">Catatan / keputusan / tindakan<textarea rows="3" data-v4-war-u-message maxlength="4000"></textarea></label>'+
   '</div><div class="v4-interaction-actions"><button class="btn btn-primary btn-sm" data-v4-war-update="'+x(id)+'"><i class="ph-bold ph-check"></i> Simpan Perkembangan</button></div><div data-v4-war-update-output></div></div></div>'+
   note(d.disclaimer||'Dugaan penyebab perlu diperiksa oleh petugas.','safe');
 }catch(e){out.innerHTML=note(e.message||String(e),'error')}
}
async function updateWar(btn,id){
 var sec=btn.closest('.v4-interaction'),out=sec.querySelector('[data-v4-war-update-output]');
 var payload={id:id,status:sec.querySelector('[data-v4-war-u-status]').value,type:sec.querySelector('[data-v4-war-u-type]').value,owner:sec.querySelector('[data-v4-war-u-owner]').value.trim(),nextCheckpoint:sec.querySelector('[data-v4-war-u-checkpoint]').value.trim(),summary:sec.querySelector('[data-v4-war-u-summary]').value.trim(),message:sec.querySelector('[data-v4-war-u-message]').value.trim(),transactionId:tx()};
 busy(btn,true,'Menyimpan');
 try{await v4Action('v4.updateWarRoom',payload);out.innerHTML=note('Perkembangan tersimpan di riwayat ruang koordinasi.','safe');await loadWar(sec,id)}
 catch(e){out.innerHTML=note(e.message||String(e),'error')}finally{busy(btn,false)}
}
function mountFor(n){
 n=Number(n);
 // 63/64 are owned by People Intelligence V1; 71–80 by AI Intelligence V2.
 // Keep only the interaction flows that do not have a newer dedicated renderer.
 if(n===97)mountScenario();
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
 try{
  if(window.OMODOS4&&typeof window.OMODOS4.getMachineNames==='function')return window.OMODOS4.getMachineNames();
 }catch(e){}
 var set=new Set();
 try{(Array.isArray(MACHINES)?MACHINES:[]).forEach(function(m){var n=m['Nama Mesin']||m.namaMesin||m['Kode Mesin']||m.kodeMesin;if(n)set.add(String(n))})}catch(e){}
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
 // Plain QR/NFC payloads may contain extra words, but machine names must match as a whole phrase.
 // This prevents short names such as "Offset 5" from silently matching "Offset 50".
 var padded=' '+n+' ',matches=list.filter(function(x){
  var a=norm(x);return a&&padded.includes(' '+a+' ');
 });
 return matches.length===1?matches[0]:'';
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
 return Promise.reject(new Error('Layanan OMODOS 4.0 belum tersedia.'));
}
function busy(btn,on,label){
 if(!btn)return;
 if(on){btn.dataset.old=btn.innerHTML;btn.disabled=true;btn.innerHTML='<i class="ph-bold ph-spinner-gap v4-spin"></i> '+e(label||'Memproses…')}
 else{btn.disabled=false;if(btn.dataset.old)btn.innerHTML=btn.dataset.old}
}
function selected(sec,selector){var el=sec&&sec.querySelector(selector);return el?el.value:''}
function missionList(data,mode,machine){
 if(!data)return '<div class="v4-empty">Data OMODOS 4.0 belum tersedia.</div>';
 var list=[];
 if(mode==='journey')list=Array.isArray(data.journey)?data.journey:[];
 else{
  list=Array.isArray(data.missions)?data.missions:[];
  if(machine){
   var wanted=norm(machine);
   list=list.filter(function(x){return norm(x&&x.machine)===wanted});
  }
 }
 if(!list.length)return '<div class="v4-empty">Belum ada tugas yang cocok dengan mesin dan periode ini.</div>';
 return '<div class="v4-sf-list">'+list.slice(0,30).map(function(m){
  var machine=m.machine||m.Machine||'-';
  var title=mode==='journey'?('Urutan '+(m.order||'')+' • '+machine):((m.priority||'')+' '+machine);
  var detail=mode==='journey'?((m.priority||'')+' • '+(m.reason||'Perlu pemeriksaan')):(m.reason||((m.checklist||[]).length+' item pemeriksaan')||'Dasar tugas');
  return '<div class="v4-sf-item"><div><strong>'+e(title)+'</strong><small>'+e(detail)+'</small></div><button class="btn btn-sm" data-v4-sf-open-patrol="'+e(machine)+'">Buka Patrol</button></div>';
 }).join('')+'</div>';
}
function checklistHtml(data,machine){
 var missions=Array.isArray(data&&data.missions)?data.missions:[];
 var n=norm(machine),m=missions.find(function(x){return norm(x.machine)===n});
 if(!m)return '<div class="v4-empty">Belum ada daftar pemeriksaan yang cocok dengan mesin terpilih.</div>';
 var items=Array.isArray(m.checklist)?m.checklist:[];
 return '<div class="v4-sf-check-head"><strong>'+e(m.machine||machine)+'</strong><span>'+e(m.priority||'')+' • '+e(m.reason||'')+'</span></div>'+
 (items.length?'<div class="v4-sf-checklist">'+items.slice(0,40).map(function(it,i){
  var label=it.label||it.item||it.name||it['Item Pemeriksaan']||it['Checklist']||('Pemeriksaan '+(i+1));
  var source=it.source||it.labelType||it.status||'Tercatat / dihitung';
  return '<label><input type="checkbox" disabled><span><strong>'+e(label)+'</strong><small>'+e(source)+'</small></span></label>';
 }).join('')+'</div>':'<div class="v4-empty">Tidak ada daftar pemeriksaan untuk mesin ini.</div>')+
 info('Daftar pemeriksaan ini hanya bantuan kerja. Pencatatan resmi tetap dilakukan di Patrol.','safe');
}
function mediaRefs(raw){
 var out=[];
 function add(v){
  if(v==null||v==='')return;
  if(Array.isArray(v)){v.forEach(add);return}
  if(typeof v==='object'){
   ['url','src','downloadUrl','download_url','webViewLink','webContentLink','fileUrl','link'].forEach(function(k){if(v[k])add(v[k])});
   return;
  }
  var t=String(v).trim();if(!t)return;
  if(/^https?:\/\//i.test(t)||t.indexOf('/')===0){out.push(t);return}
  try{add(JSON.parse(t))}catch(err){}
 }
 add(raw);
 return Array.from(new Set(out)).slice(0,4);
}
function mediaButtons(raw,label){
 var refs=mediaRefs(raw);
 if(!refs.length)return raw?'<span class="v4-risk-chip">'+e(label)+' tercatat</span>':'';
 return refs.map(function(url,i){
  return '<a class="btn btn-sm" href="'+e(url)+'" target="_blank" rel="noopener noreferrer">'+e(label)+(refs.length>1?' '+(i+1):'')+'</a>';
 }).join('');
}
function proofHtml(data,machine){
 var missions=Array.isArray(data&&data.missions)?data.missions:[],n=norm(machine);
 var m=missions.find(function(x){return norm(x.machine)===n});
 var rows=Array.isArray(m&&m.beforeAfterProof)?m.beforeAfterProof:[];
 if(!m)return '<div class="v4-empty">Tidak ada data tugas yang cocok dengan mesin terpilih.</div>';
 if(!rows.length)return '<div class="v4-empty">Belum ada bukti sebelum dan sesudah yang tercatat untuk mesin ini.</div>';
 return '<div class="v4-sf-list">'+rows.slice(0,16).map(function(r){
  var media=mediaButtons(r.beforePhoto,'Foto sebelum')+mediaButtons(r.afterPhoto,'Foto sesudah');
  var detail=['Tanggal '+(r.date||'belum tercatat'),'Status '+(r.status||'Tercatat'),r.benefit?('Manfaat '+r.benefit):'',r.beforeAfter?('Catatan '+r.beforeAfter):''].filter(Boolean).join(' • ');
  return '<div class="v4-sf-item"><div><strong>'+e(r.theme||r.id||'Perbaikan')+'</strong><small>'+e(detail)+'</small></div><div class="v4-interaction-actions">'+(media||'<span class="v4-risk-chip">Bukti teks</span>')+'</div></div>';
 }).join('')+'</div>'+info('Bukti berasal dari data Kaizen yang sudah tercatat untuk mesin terpilih. OMODOS 4.0 tidak membuat foto atau hasil baru.','safe');
}
function mountMissionFeature(n){
 var h=host();if(!h||!openN(n))return;
 var old=h.querySelector('.v4-sf-interaction');if(old)old.remove();
 var titles={21:'Tugas Teknisi',23:'Daftar Pemeriksaan',26:'Bukti Sebelum & Sesudah',29:'Urutan Kunjungan Mesin'};
 var sec=document.createElement('section');sec.className='v4-interaction v4-sf-interaction';sec.dataset.v4SfFeature=String(n);
 sec.innerHTML='<div class="v4-interaction-head"><div><span class="v4-eyebrow">BANTUAN KERJA LAPANGAN</span><h3>'+e(titles[n])+'</h3></div><span class="v4-no-write">Dari data tercatat</span></div>'+
 '<div class="v4-form-grid"><label>Mesin<select data-v4-sf-machine>'+opts(n===29?'Semua mesin':'Pilih mesin')+'</select></label></div>'+
 '<div class="v4-interaction-actions"><button class="btn btn-primary btn-sm" data-v4-sf-load="'+n+'"><i class="ph-bold ph-arrows-clockwise"></i> Tampilkan '+e(titles[n])+'</button>'+
 (n===21||n===23?'<button class="btn btn-sm" data-v4-sf-patrol-current>Buka Patrol</button>':'')+
 '</div><div data-v4-sf-output>'+info('Data berasal dari Logbook, Patrol, dan Proyek yang sudah ada; tidak membuat input ganda.','safe')+'</div>';
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
  else out.innerHTML=missionList(d,n===29?'journey':'missions',machine);
 }catch(err){out.innerHTML=info(err.message||String(err),'error')}
 finally{busy(btn,false)}
}
function mountTroubleshoot(){
 var h=host();if(!h||!openN(22))return;
 var old=h.querySelector('.v4-sf-interaction');if(old)old.remove();
 var sec=document.createElement('section');sec.className='v4-interaction v4-sf-interaction';sec.dataset.v4SfFeature='22';
 sec.innerHTML='<div class="v4-interaction-head"><div><span class="v4-eyebrow">PANDUAN CARI MASALAH</span><h3>Gejala → Pemeriksaan → Bukti → Langkah Berikutnya</h3></div><span class="v4-no-write">PERLU CEK PETUGAS</span></div>'+
 '<div class="v4-form-grid"><label>Mesin *<select data-v4-sf-machine>'+opts('Pilih mesin')+'</select></label><label class="v4-form-wide">Gejala / masalah *<textarea rows="4" data-v4-sf-symptom placeholder="Jelaskan gejala yang terlihat, terdengar, atau terukur."></textarea></label></div>'+
 '<div class="v4-interaction-actions"><button class="btn btn-primary btn-sm" data-v4-sf-troubleshoot><i class="ph-bold ph-stethoscope"></i> Susun Panduan Pemeriksaan</button></div><div data-v4-sf-output>'+info('OMODOS mencari bukti data yang relevan; hasil bukan penentuan akar penyebab final.','safe')+'</div>';
 h.prepend(sec);
}
async function troubleshoot(btn){
 var sec=btn.closest('.v4-sf-interaction'),machine=selected(sec,'[data-v4-sf-machine]'),q=selected(sec,'[data-v4-sf-symptom]'),out=sec.querySelector('[data-v4-sf-output]');
 if(!machine||!q.trim()){out.innerHTML=info('Pilih mesin dan isi gejala terlebih dahulu.','warn');return}
 busy(btn,true,'Menganalisis');
 try{
  var d=await backendAction('v4.aiAsk',{machine:machine,query:q.trim(),purpose:'troubleshooting'});
  var sum=d&&d.summary?d.summary:(d&&d.answer)||'Bukti data tersedia.';
  out.innerHTML='<div class="v4-ai-answer">'+e(sum).replace(/\n/g,'<br>')+'</div>'+info('Tingkat keyakinan: '+(d&&d.confidence||'belum tersedia')+'. Pemeriksaan petugas tetap wajib.','safe');
 }catch(err){out.innerHTML=info(err.message||String(err),'error')}
 finally{busy(btn,false)}
}
function mountVoice(){
 var h=host();if(!h||!openN(24))return;
 var old=h.querySelector('.v4-sf-interaction');if(old)old.remove();
 var SR=window.SpeechRecognition||window.webkitSpeechRecognition;
 var sec=document.createElement('section');sec.className='v4-interaction v4-sf-interaction';sec.dataset.v4SfFeature='24';
 sec.innerHTML='<div class="v4-interaction-head"><div><span class="v4-eyebrow">ISI LOGBOOK DENGAN SUARA</span><h3>Draf dari Suara</h3></div><span class="v4-no-write">Belum disimpan</span></div>'+
 '<div class="v4-form-grid"><label>Mesin (opsional)<select data-v4-sf-machine>'+opts('Pilih jika relevan')+'</select></label><label class="v4-form-wide">Hasil dikte<textarea rows="5" data-v4-voice-text placeholder="Hasil suara muncul di sini. Bisa diedit sebelum dikirim ke form Logbook."></textarea></label></div>'+
 '<div class="v4-interaction-actions"><button class="btn btn-primary btn-sm" data-v4-voice-start '+(SR?'':'disabled')+'><i class="ph-bold ph-microphone"></i> Mulai Dikte</button><button class="btn btn-sm" data-v4-voice-to-logbook><i class="ph-bold ph-arrow-square-out"></i> Kirim Draf ke Form Logbook</button></div>'+
 '<div data-v4-sf-output>'+info(SR?'Fitur pengenal suara tersedia. Tidak ada data yang disimpan sebelum formulir Logbook disimpan.':'Browser ini belum mendukung pengenal suara. Ketik manual pada draf lalu kirim ke formulir Logbook.','safe')+'</div>';
 h.prepend(sec);
}
function startVoice(btn){
 var sec=btn.closest('.v4-sf-interaction'),ta=sec.querySelector('[data-v4-voice-text]'),out=sec.querySelector('[data-v4-sf-output]');
 var SR=window.SpeechRecognition||window.webkitSpeechRecognition;
 if(!SR){out.innerHTML=info('Pengenal suara tidak tersedia di browser ini.','warn');return}
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
  rec.onerror=function(ev){out.innerHTML=info('Dikte berhenti: '+(ev.error||'kesalahan suara')+'. Draft yang sudah ada tetap dipertahankan.','warn');stopSpeech()};
  rec.onend=function(){if(SF_SPEECH===rec){SF_SPEECH=null;btn.disabled=false;btn.innerHTML='<i class="ph-bold ph-microphone"></i> Mulai Dikte'}};
  btn.disabled=true;btn.innerHTML='<i class="ph-bold ph-stop-circle"></i> Mendengarkan…';rec.start();
  out.innerHTML=info('Mendengarkan. Ucapkan deskripsi masalah; hasil masih berupa draf.','safe');
 }catch(err){out.innerHTML=info(err.message||String(err),'error');stopSpeech()}
}
function mountPhoto(){
 var h=host();if(!h||!openN(25))return;
 var old=h.querySelector('.v4-sf-interaction');if(old)old.remove();
 var sec=document.createElement('section');sec.className='v4-interaction v4-sf-interaction';sec.dataset.v4SfFeature='25';
 sec.innerHTML='<div class="v4-interaction-head"><div><span class="v4-eyebrow">FOTO PEMERIKSAAN</span><h3>Catat Foto ke Logbook</h3></div><span class="v4-no-write">FOTO TIDAK DIANALISIS OTOMATIS</span></div>'+
 info('OMODOS 4.0 belum memiliki pembaca foto yang terverifikasi. Foto akan dilampirkan ke Logbook, sedangkan pemeriksaan masalah tetap berdasarkan gejala tertulis dan penilaian petugas.','warn')+
 '<div class="v4-form-grid"><label>Mesin<select data-v4-sf-machine>'+opts('Pilih mesin')+'</select></label><label class="v4-form-wide">Gejala singkat<textarea rows="3" data-v4-photo-note placeholder="Contoh: suara abnormal di feeder, bekas gesekan terlihat di sisi operator."></textarea></label></div>'+
 '<div class="v4-interaction-actions"><button class="btn btn-primary btn-sm" data-v4-photo-logbook><i class="ph-bold ph-camera"></i> Buka Logbook + Kamera</button><button class="btn btn-sm" data-v4-photo-text-ai><i class="ph-bold ph-brain"></i> Analisis Catatan Teks</button></div><div data-v4-sf-output></div>';
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
 if(!q.trim()){out.innerHTML=info('Isi gejala dalam bentuk teks terlebih dahulu.','warn');return}
 busy(btn,true,'Menganalisis');
 try{var d=await backendAction('v4.aiAsk',{machine:machine,query:q.trim(),purpose:'troubleshooting'});out.innerHTML='<div class="v4-ai-answer">'+e(d.summary||'Bukti data tersedia.').replace(/\n/g,'<br>')+'</div>'+info('Foto tidak dianalisis otomatis; jawaban hanya berdasarkan teks dan bukti data OMODOS.','safe')}
 catch(err){out.innerHTML=info(err.message||String(err),'error')}finally{busy(btn,false)}
}
function mountQr(){
 var h=host();if(!h||!openN(27))return;
 var old=h.querySelector('.v4-sf-interaction');if(old)old.remove();
 var supported=!!(window.BarcodeDetector&&navigator.mediaDevices&&navigator.mediaDevices.getUserMedia);
 var sec=document.createElement('section');sec.className='v4-interaction v4-sf-interaction';sec.dataset.v4SfFeature='27';
 sec.innerHTML='<div class="v4-interaction-head"><div><span class="v4-eyebrow">BUKA MESIN LEWAT QR</span><h3>Pindai QR atau Pilih Manual</h3></div><span class="v4-no-write">'+(supported?'Kamera siap':'Pilih mesin')+'</span></div>'+
 '<div class="v4-qr-zone"><video data-v4-qr-video playsinline muted style="display:none"></video><div data-v4-qr-status>'+info(supported?'Kamera baru aktif setelah tombol Pindai QR dipilih.':'Browser ini belum mendukung pemindai QR langsung. Pilih mesin secara manual.','safe')+'</div></div>'+
 '<div class="v4-form-grid"><label>Pilih Mesin Manual<select data-v4-sf-machine>'+opts('Pilih mesin')+'</select></label></div>'+
 '<div class="v4-interaction-actions"><button class="btn btn-primary btn-sm" data-v4-qr-start '+(supported?'':'disabled')+'><i class="ph-bold ph-qr-code"></i> Pindai QR</button><button class="btn btn-sm" data-v4-qr-manual>Gunakan Mesin Terpilih</button></div><div data-v4-qr-result></div>';
 h.prepend(sec);
}
async function startQr(btn){
 var sec=btn.closest('.v4-sf-interaction'),video=sec.querySelector('[data-v4-qr-video]'),status=sec.querySelector('[data-v4-qr-status]'),result=sec.querySelector('[data-v4-qr-result]');
 if(!(window.BarcodeDetector&&navigator.mediaDevices&&navigator.mediaDevices.getUserMedia)){status.innerHTML=info('Pemindai QR bawaan tidak tersedia.','warn');return}
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
 sec.innerHTML='<div class="v4-interaction-head"><div><span class="v4-eyebrow">BUKA MESIN LEWAT NFC</span><h3>Baca NFC atau Pilih Manual</h3></div><span class="v4-no-write">'+(supported?'NFC SIAP':'PILIH MANUAL')+'</span></div>'+
 info(supported?'NFC baru dibaca setelah Anda memilih Pindai NFC.':'Browser atau perangkat ini belum mendukung NFC. Pilih mesin secara manual.','safe')+
 '<div class="v4-form-grid"><label>Pilih Mesin Manual<select data-v4-sf-machine>'+opts('Pilih mesin')+'</select></label></div>'+
 '<div class="v4-interaction-actions"><button class="btn btn-primary btn-sm" data-v4-nfc-start '+(supported?'':'disabled')+'><i class="ph-bold ph-wifi-high"></i> Pindai NFC</button><button class="btn btn-sm" data-v4-nfc-manual>Gunakan Mesin Terpilih</button></div><div data-v4-nfc-result></div>';
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
 sec.innerHTML='<div class="v4-interaction-head"><div><span class="v4-eyebrow">ANTREAN OFFLINE</span><h3>Status Kiriman yang Menunggu Sinkronisasi</h3></div><span class="v4-no-write">'+(online?'Online':'Offline')+'</span></div>'+
 '<div class="v4-statline"><div><b>'+(online?'Online':'Offline')+'</b><span>Koneksi browser</span></div><div><b>'+q.length+'</b><span>Menunggu sinkronisasi</span></div><div><b>OMODOS</b><span>Memakai antrean yang sama</span></div></div>'+
 info('OMODOS menyimpan kiriman yang gagal ke antrean lokal dan mencoba menyinkronkannya saat koneksi kembali. OMODOS 4.0 tidak membuat antrean kedua.','safe')+
 '<div class="v4-interaction-actions"><button class="btn btn-primary btn-sm" data-v4-offline-logbook><i class="ph-bold ph-notebook"></i> Buka Input Logbook</button><button class="btn btn-sm" data-v4-offline-refresh>Muat Ulang Status</button></div>';
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
 if(f.criticalMachineCount)p.push('Mesin perlu perhatian '+f.criticalMachineCount);
 if(f.stockout)p.push('Stok habis');
 else if(f.stockRisk)p.push('Stok mencapai batas minimum');
 if(f.etaOverdue)p.push('ETA terlambat');
 return p.join(' • ')||'Bukti sparepart yang tersedia';
}
function partName(x){return (x&&x.material)||'(nama material belum tersedia)'}
function partNo(x){return (x&&x.materialNumber)||'No SAP belum tersedia'}
function safeMediaUrl(v){
 var s=String(v||'').trim();
 return /^https?:\/\//i.test(s)||s.indexOf('/')===0?s:'';
}
function rows(list,renderer,limit){
 if(!Array.isArray(list)||!list.length)return empty('Tidak ada bukti data yang memenuhi kriteria fitur ini.');
 return '<div class="v4-sf-list">'+list.slice(0,limit||50).map(renderer).join('')+'</div>';
}
function item(title,sub,right){
 return '<div class="v4-sf-item"><div><strong>'+esc(title)+'</strong><small>'+esc(sub||'')+'</small></div>'+(right||'')+'</div>';
}
function priorityText(v){
 var p=String(v||'P3').toUpperCase();
 return {P0:'Sangat mendesak',P1:'Perlu segera',P2:'Perlu dipantau',P3:'Belum mendesak'}[p]||p;
}
function priorityBadge(x){
 var p=x&&x.priority||'P3';
 return '<span class="v4-risk-chip">'+esc(priorityText(p))+(x&&x.criticalityScore!=null?' • nilai perhatian '+esc(x.criticalityScore):'')+'</span>';
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
 31:'Prioritas Perhatian Sparepart',32:'Stok Habis atau Menipis',33:'Belum Tercatat Dipakai',34:'Pemakaian Sparepart',35:'Mesin & Sparepart Terkait',
 36:'Pengganti Sparepart yang Tercatat',37:'Foto Referensi Sparepart',38:'Lokasi Sparepart',39:'Perkiraan Frekuensi Kebutuhan Sparepart',40:'Prioritas Pembelian Sparepart'
 };
 var actionLabels={31:'Tampilkan prioritas',32:'Tampilkan stok bermasalah',33:'Tampilkan yang belum dipakai',34:'Tampilkan pemakaian',35:'Tampilkan hubungan mesin',36:'Cari pengganti',37:'Tampilkan foto',38:'Tampilkan lokasi',39:'Hitung perkiraan kebutuhan',40:'Tampilkan prioritas pembelian'};
 var sec=document.createElement('section');sec.className='v4-interaction v4-sparepart-intel';sec.dataset.v4SpFeature=String(n);
 var controls='';
 if(n===35)controls='<label>Mesin<select data-v4-sp-machine><option value="">Muat data untuk melihat mesin</option></select></label>';
 if(n===36)controls='<label class="v4-form-wide">Cari material / nomor SAP<input data-v4-sp-query placeholder="Ketik nama material atau nomor SAP"></label>';
 sec.innerHTML='<div class="v4-interaction-head"><div><span class="v4-eyebrow">INFORMASI SPAREPART</span><h3>'+esc(titles[n])+'</h3></div><span class="v4-no-write">Tidak mengubah data</span></div>'+
 (controls?'<div class="v4-form-grid">'+controls+'</div>':'')+
 '<div class="v4-interaction-actions"><button class="btn btn-primary btn-sm" data-v4-sp-load="'+n+'"><i class="ph-bold ph-arrows-clockwise"></i> '+esc(actionLabels[n]||'Tampilkan data')+'</button><button class="btn btn-sm" data-v4-open-existing="sparepart"><i class="ph-bold ph-package"></i> Buka Sparepart</button></div>'+
 '<div data-v4-sp-out>'+note('Menggunakan data stok sparepart, lokasi, ETA, opname, gudang, status SAP, dan pemakaian di Logbook yang sudah ada. Tidak membuat data ganda.','safe')+'</div>';
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
 },60)+note('Nilai perhatian menggabungkan catatan pemakaian, jumlah mesin terkait, kondisi stok, ETA, dan mesin yang perlu perhatian. Ini bukan klasifikasi criticality Engineering dan bukan keputusan pembelian otomatis.','safe');
}
function renderStockout(data){
 var list=(data.risks||[]).filter(function(x){return ['stockout','stock-risk'].includes(String(x.type||''))});
 return rows(list,function(x){
  var label=x.type==='stockout'?'STOK HABIS':'STOK MENIPIS';
  return item(partName(x),partNo(x)+' • '+factors(x.factors),'<span class="v4-risk-chip">'+esc(label)+'</span>');
 },60)+note('Fitur ini hanya menampilkan kondisi stok: habis atau sudah mencapai batas minimum yang tercatat. ETA terlambat dipisahkan ke Prioritas Pembelian Sparepart.','safe');
}
function renderDead(data){
 return rows(data.deadStockCandidates,function(x){
  return item(partName(x),partNo(x)+' • '+(x.reason||'Kandidat untuk diperiksa'),'<span class="v4-risk-chip">KANDIDAT</span>');
 },60)+note('Artinya hanya: masih ada stok positif tetapi belum ditemukan pemakaian yang terhubung secara tepat pada Logbook yang tersedia. Ini bukan bukti bahwa sparepart benar-benar tidak diperlukan.','warn');
}
function renderConsumption(data){
 return rows(data.consumptionTop,function(x){
  var machines=Array.isArray(x.machines)&&x.machines.length?x.machines.slice(0,5).join(', '):'mesin belum terhubung';
  return item(partName(x),partNo(x)+' • '+x.count+' kali tercatat dipakai • '+machines,'<span class="v4-risk-chip">'+esc(x.count)+'x</span>');
 },60)+note('Pola pemakaian dihitung dari hubungan catatan Logbook dengan nomor SAP atau nama material yang sudah ada.','safe');
}
function renderGraph(data,sec){
 var sel=sec.querySelector('[data-v4-sp-machine]');
 if(sel&&sel.options.length<=1){sel.innerHTML=machineOptions(data)}
 var machine=val(sec,'[data-v4-sp-machine]');
 var list=(data.machinePartGraph||[]).filter(function(x){return !machine||String(x.from||'')==='machine:'+machine});
 return rows(list,function(x){
  var m=String(x.from||'').replace(/^machine:/,'');
  return item(m+' → '+partName(x),partNo(x)+' • '+(x.relation||'terkait / terpakai'),'<span class="v4-risk-chip">Terkait</span>');
 },80)+note('Hubungan dibuat dari sparepart yang pernah tercatat atau terpakai pada mesin. Ini bukan daftar BOM engineering lengkap.','safe');
}
function renderEquivalent(data,sec){
 var q=val(sec,'[data-v4-sp-query]').toLowerCase();
 var list=(data.equivalentParts||[]).filter(function(x){
  return !q||[x.material,x.materialNumber,x.recordedEquivalent].some(function(v){return String(v||'').toLowerCase().includes(q)});
 });
 return rows(list,function(x){
  return item(partName(x)+' → '+(x.recordedEquivalent||'—'),partNo(x)+' • Alternatif tercatat • perlu konfirmasi Engineering','<span class="v4-risk-chip">PERLU KONFIRMASI</span>');
 },60)+note('OMODOS tidak mencari pengganti baru dan tidak menebak kecocokan part. Hanya field alternatif/pengganti yang sudah tercatat yang ditampilkan. Engineering tetap wajib memeriksa sebelum substitusi.','warn');
}
function renderPhoto(data){
 var list=Array.isArray(data.partPhotoAssets)?data.partPhotoAssets:[];
 if(!list.length)return empty('Belum ada foto referensi sparepart yang tercatat.')+
  note('Tambahkan foto atau URL foto melalui data sparepart yang digunakan aplikasi. OMODOS tidak akan menebak identitas part tanpa model visual yang diverifikasi.','safe');
 return note('Foto di bawah berasal dari data sparepart yang sudah tercatat. Foto hanya sebagai referensi visual; OMODOS tidak mengenali atau mendiagnosis isi foto secara otomatis.','safe')+
 rows(list,function(x){
  var u=safeMediaUrl(x.image);
  var action=u?'<a class="btn btn-sm" href="'+esc(u)+'" target="_blank" rel="noopener noreferrer"><i class="ph-bold ph-image"></i> Lihat Foto</a>':'<span class="v4-risk-chip">URL TIDAK DIDUKUNG</span>';
  return item(partName(x),partNo(x)+' • Foto referensi tercatat',action);
 },40)+
 note('Hanya tautan http/https atau path aplikasi yang ditampilkan sebagai tombol. URL lain ditolak agar tidak menjalankan tautan berbahaya.','warn');
}
function renderShelf(data){
 return rows(data.shelfDigitalTwin,function(x){
  return item(x.location||'Lokasi belum bernama',(x.materials||0)+' material • '+(x.records||0)+' catatan','<span class="v4-risk-chip">Jumlah '+esc(x.stockQty==null?'—':x.stockQty)+'</span>');
 },80)+note('Peta rak merangkum lokasi yang tercatat pada data lokasi, opname, dan gudang.','safe');
}
function renderReservation(data){
 function confidence(v){var s=String(v||'').toLowerCase();return s==='medium'?'Sedang':s==='low-medium'?'Terbatas':s==='low'?'Rendah':String(v||'—')}
 return rows(data.reservationForecast,function(x){
  var start=x.coverageStart?String(x.coverageStart).slice(0,10):'—';
  return item(partName(x),partNo(x)+' • '+x.observedConsumptions+' kali tercatat / '+x.windowDays+' hari valid • mulai '+start,
   '<span class="v4-risk-chip">Perkiraan 30 hari '+esc(x.expectedNext30)+' kali • '+esc(confidence(x.confidence))+'</span>');
 },60)+note('Perkiraan ini menghitung frekuensi kejadian pemakaian yang tercatat, bukan jumlah unit/qty sparepart. Hari pengamatan otomatis dimulai paling awal 1 September 2026.','warn');
}
function renderUrgency(data){
 return rows(data.procurementUrgency,function(x){
  return item(partName(x),partNo(x)+' • '+factors(x.factors),'<span class="v4-risk-chip">'+esc(priorityText(x.priority))+' • nilai perhatian '+esc(x.score==null?'—':x.score)+'</span>');
 },60)+note('Prioritas ini membantu melihat sparepart yang lebih mendesak karena stok, ETA, dan bukti pemakaian. Ini bukan purchase order dan tidak menggantikan persetujuan pembelian yang berlaku.','warn');
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
function empty(t){return '<div class="v4-empty">'+esc(t||'Belum ada bukti data pada periode ini.')+'</div>'}
function value(sec,sel){var e=sec&&sec.querySelector(sel);return e?String(e.value||'').trim():''}
function busy(btn,on){
 if(!btn)return;
 if(on){btn.dataset.old=btn.innerHTML;btn.disabled=true;btn.innerHTML='<i class="ph-bold ph-spinner-gap v4-spin"></i> Memuat…'}
 else{btn.disabled=false;if(btn.dataset.old)btn.innerHTML=btn.dataset.old}
}
function machineNames(){
 try{
  if(window.OMODOS4&&typeof window.OMODOS4.getMachineNames==='function')return window.OMODOS4.getMachineNames();
 }catch(e){}
 var set=new Set();
 try{(Array.isArray(MACHINES)?MACHINES:[]).forEach(function(m){var n=m['Nama Mesin']||m.namaMesin||m['Kode Mesin']||m.kodeMesin;if(n)set.add(String(n))})}catch(e){}
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
 return pick(r,['Judul','Title','Problem','Masalah','Problem Statement','Deskripsi','Description','Root Cause','Akar Masalah','ID'])||'Catatan RCA';
}
function recordSub(r){
 var p=[];
 [['Mesin','Nama Mesin','Kode Mesin'],['Tanggal','Date','Created At'],['Root Cause','Akar Masalah'],['Countermeasure','Tindakan','Action']].forEach(function(keys){
  var v=pick(r,keys);if(v&&!p.includes(v))p.push(v);
 });
 return p.slice(0,3).join(' • ')||'Bukti RCA tercatat';
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
  41:'Ringkasan Keandalan',42:'Mesin Paling Perlu Perhatian',43:'Masalah Terbanyak',44:'Pola Gangguan Mesin',45:'Waktu Berhenti yang Tidak Berlabel Gangguan',
  46:'Tren Gangguan Bulanan',47:'Riwayat RCA',48:'Efek Tindakan Perbaikan',49:'Biaya Gangguan yang Tercatat',50:'Biaya per Menit Berhenti'
 };
 var actionLabels={41:'Tampilkan ringkasan',42:'Tampilkan mesin prioritas',43:'Tampilkan masalah terbanyak',44:'Tampilkan pola gangguan',45:'Cari waktu berhenti',46:'Tampilkan tren',47:'Cari RCA lama',48:'Bandingkan sebelum & sesudah',49:'Tampilkan biaya gangguan',50:'Hitung biaya per menit'};
 var sec=document.createElement('section');sec.className='v4-interaction v4-reliability-loss';sec.dataset.v4RelFeature=String(n);
 sec.innerHTML='<div class="v4-interaction-head"><div><span class="v4-eyebrow">KEANDALAN & KERUGIAN</span><h3>'+esc(titles[n])+'</h3></div><span class="v4-no-write">Tidak mengubah data</span></div>'+
 '<div class="v4-form-grid"><label>Periode analisis<select data-v4-rel-days><option value="30">30 hari</option><option value="90" selected>90 hari</option><option value="180">180 hari</option><option value="365">365 hari</option></select></label><label>Mesin<select data-v4-rel-machine>'+machineOptions()+'</select></label></div>'+
 '<div class="v4-interaction-actions"><button class="btn btn-primary btn-sm" data-v4-rel-load="'+n+'"><i class="ph-bold ph-arrows-clockwise"></i> '+esc(actionLabels[n]||'Tampilkan data')+'</button>'+
 (n===47?'<button class="btn btn-sm" data-v4-open-existing="diagnostic"><i class="ph-bold ph-magnifying-glass"></i> Buka Diagnostik</button>':'')+
 (n===48?'<button class="btn btn-sm" data-v4-open-existing="corrective-report"><i class="ph-bold ph-wrench"></i> Buka Laporan Perbaikan</button>':'')+
 (n===41||n===42||n===43||n===44||n===45||n===46?'<button class="btn btn-sm" data-v4-open-existing="downtime"><i class="ph-bold ph-clock-counter-clockwise"></i> Buka Waktu Berhenti</button>':'')+
 '</div><div data-v4-rel-out>'+note('Perhitungan memakai waktu kejadian yang tercatat. KPI resmi tidak ditimpa dan data operasional tidak diubah.','safe')+'</div>';
 h.prepend(sec);
}
function render41(d){
 var t=d.totals||{};
 var top=(d.badActors||[]).slice(0,8);
 return metrics([
  ['Mesin',fmtNum(t.machines,0)],['Gangguan',fmtNum(t.breakdowns,0)],['Waktu berhenti',fmtNum(t.downtimeMinutes,0)+' menit'],
  ['Masalah berulang',fmtNum(t.recurringPatterns,0)],['RCA',fmtNum(t.rca,0)],['Tindakan perbaikan',fmtNum(t.corrective,0)]
 ])+
 list(top,function(x){
  return item(machineOf(x),'Nilai kesehatan '+fmtNum(x.healthIndex,0)+' • '+fmtNum(x.breakdowns,0)+' gangguan • '+fmtNum(x.downtimeMinutes,0)+' menit berhenti',
   statusChip('Antar gangguan* '+fmtNum(x.mtbfDerivedHours,1)+' jam • Perbaikan* '+fmtNum(x.mttrDerivedMinutes,0)+' menit'));
 },12)+note('* MTBF/MTTR di halaman ini dihitung dari waktu kejadian yang tercatat pada periode terpilih, bukan pengganti KPI resmi.','warn');
}
function render42(d){
 return list(d.badActors,function(x){
  return item(machineOf(x),
   'Waktu berhenti '+fmtNum(x.downtimeMinutes,0)+' menit • Gangguan '+fmtNum(x.breakdowns,0)+' • Berulang '+fmtNum(x.recurring,0)+' • Belum selesai '+fmtNum(x.openIssues,0),
   statusChip('Kesehatan '+fmtNum(x.healthIndex,0)));
 },30)+note('Urutan ini bukan daftar mesin yang paling sering rusak. Backend mengurutkan terutama dari nilai kesehatan, lalu bukti waktu berhenti akibat gangguan. Gunakan sebagai urutan pemeriksaan.','safe');
}
function render43(d){
 var rows=Array.isArray(d.problemPareto)?d.problemPareto:[];
 if(!rows.length){
  var fallback=d.paretoNarrative||[];
  return list(fallback,function(x){
   return item('#'+(x.rank||'')+' '+(x.machine||'Mesin'),x.why||'',statusChip('DATA MESIN'));
  },20,'Belum ada pengelompokan masalah yang cukup.')+note('Data lama belum menyediakan pengelompokan jenis masalah; urutan mesin ditampilkan sebagai cadangan.','warn');
 }
 return list(rows,function(x,i){
  var machines=Array.isArray(x.machines)&&x.machines.length?x.machines.slice(0,5).join(', '):'mesin belum tercatat';
  var detail=fmtNum(x.events,0)+' kejadian • '+fmtNum(x.downtimeMinutes,0)+' menit berhenti • '+fmtNum(x.machineCount,0)+' mesin • '+fmtNum(x.openEvents,0)+' belum selesai';
  return item('#'+(i+1)+' '+(x.problem||'Masalah belum bernama'),detail+' • '+machines,statusChip(fmtNum(x.events,0)+'x'));
 },30)+note('Urutan dibuat berdasarkan jumlah kejadian masalah yang sama, lalu waktu berhentinya. Gunakan untuk memilih masalah yang perlu dianalisis lebih dulu.','safe');
}
function render44(d){
 var chronic='<section class="v4-server-section"><div class="v4-server-section-head"><strong>Sudah Berulang</strong><span>Pola berulang ≥ 2</span></div>'+
  list(d.chronic,function(x){return item(machineOf(x),'Pola berulang '+fmtNum(x.recurring,0)+' • Waktu berhenti '+fmtNum(x.downtimeMinutes,0)+' menit',statusChip('Kesehatan '+fmtNum(x.healthIndex,0)))},30)+'</section>';
 var acute='<section class="v4-server-section"><div class="v4-server-section-head"><strong>Belum Berulang</strong><span>Ada waktu berhenti • pola berulang &lt; 2</span></div>'+
  list(d.acute,function(x){return item(machineOf(x),'Gangguan '+fmtNum(x.breakdowns,0)+' • Waktu berhenti '+fmtNum(x.downtimeMinutes,0)+' menit',statusChip('BELUM BERULANG'))},30)+'</section>';
 return chronic+acute+note('Kelompok kedua tidak berarti gangguannya mendadak. Artinya hanya ada waktu berhenti tercatat tetapi pola berulangnya masih kurang dari 2.','safe');
}
function render45(d){
 return list(d.hiddenFactory,function(x){
  return item(x.machine||'Belum terkait mesin',fmtNum(x.events,0)+' kejadian di luar kategori breakdown/emergency dengan waktu berhenti tercatat',statusChip(fmtNum(x.downtimeMinutes,0)+' menit'));
 },40)+note('Bagian ini mencari catatan Logbook yang punya waktu berhenti tetapi belum diberi kategori yang menandakan gangguan atau perbaikan. Ini bukan otomatis kerugian tersembunyi; petugas tetap perlu memeriksa konteksnya.','warn');
}
function render46(d){
 var rows=d.reliabilityGrowth||[];
 if(!rows.length)return empty('Belum cukup kejadian bulanan untuk melihat perubahan keandalan.');
 var max=Math.max.apply(null,rows.map(function(x){return Number(x.downtimeMinutes)||0}).concat([1]));
 return '<div class="v4-sf-list">'+rows.slice(-24).map(function(x){
  var pct=Math.max(2,Math.round((Number(x.downtimeMinutes)||0)/max*100));
  return '<div class="v4-sf-item"><div style="width:100%"><strong>'+esc(x.month||'Periode')+'</strong><small>'+esc(fmtNum(x.breakdowns,0)+' gangguan • '+fmtNum(x.downtimeMinutes,0)+' menit • '+fmtNum(x.affectedMachines,0)+' mesin')+'</small><div style="height:5px;margin-top:6px;border-radius:999px;background:var(--line-soft);overflow:hidden"><span style="display:block;height:100%;width:'+pct+'%;background:currentColor;opacity:.5"></span></div></div>'+statusChip(fmtNum(x.downtimeMinutes,0)+' menit')+'</div>';
 }).join('')+'</div>'+note('Grafik ini menunjukkan tren jumlah gangguan dan waktu berhenti bulanan dari catatan yang tersedia. Grafik tidak langsung menyatakan keandalan membaik atau memburuk tanpa melihat jam operasi dan volume produksi.','safe');
}
function render47(d){
 return list(d.rcaMemory,function(r){
  return item(recordTitle(r),recordSub(r),statusChip('Tercatat RCA'));
 },50,'Belum ada RCA tercatat pada periode ini.')+note('Riwayat RCA hanya menampilkan RCA yang sudah ada; tidak membuat atau mengubah RCA baru.','safe');
}
function render48(d){
 return list(d.countermeasureEffectiveness,function(x){
  var delta=Number(x.delta);
  var badge=x.status==='IMPROVED_SIGNAL'?'Gangguan berkurang':x.status==='WORSE_SIGNAL'?'Gangguan bertambah':x.status==='NO_CHANGE_SIGNAL'?'Tidak berubah':'Data sesudah belum 30 hari';
  return item(x.machine||'Mesin','Perbaikan '+(x.correctiveId||'—')+' • '+String(x.date||'').slice(0,10)+' • 30 hari sebelum '+fmtNum(x.before30d,0)+' → 30 hari sesudah '+fmtNum(x.after30d,0)+' • Δ '+fmtNum(delta,0),statusChip(badge));
 },40,'Belum ada catatan perbaikan dengan data sebelum/sesudah yang dapat dibandingkan.')+
 note('Perbandingan sebelum/sesudah menunjukkan hubungan waktu, bukan bukti bahwa tindakan tersebut pasti menyebabkan perubahan.','warn');
}
function render49(d){
 var c=d.costIntelligence||{};
 if(c.status!=='RECORDED_COST_ONLY')return empty('Biaya kerusakan belum tersedia karena belum ada angka biaya yang tercatat.')+note(c.note||'Biaya yang belum tercatat tidak diperkirakan.','warn');
 return metrics([
  ['Catatan biaya',fmtNum(c.records,0)],
  ['Total biaya tercatat',rupiah(c.totalRecordedCost)],
  ['Biaya / menit berhenti',rupiah(c.recordedCostPerDowntimeMinute)]
 ])+note('Biaya kerusakan hanya memakai angka biaya yang benar-benar tercatat. Biaya yang kosong tidak diisi dengan asumsi.','safe');
}
function render50(d){
 var c=d.costIntelligence||{};
 if(c.status!=='RECORDED_COST_ONLY'||!Number.isFinite(Number(c.millionRupiahMinute)))return empty('Biaya per menit berhenti belum tersedia karena catatan biaya atau waktu berhenti belum cukup.')+note(c.note||'Biaya yang belum tercatat tidak diperkirakan.','warn');
 var rpm=Number(c.recordedCostPerDowntimeMinute)||0,million=Number(c.millionRupiahMinute)||0;
 return metrics([
  ['Rp per menit berhenti',rupiah(rpm)],
  ['Juta Rp per menit berhenti',fmtNum(million,4)],
  ['Dasar catatan biaya',fmtNum(c.records,0)]
 ])+note('Nilai ini = biaya kerusakan/waktu berhenti yang tercatat ÷ menit berhenti yang tercatat. Gunakan untuk memahami dampak, bukan sebagai biaya standar tanpa pemeriksaan Finance.','warn');
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
function plainPriority(v){
 var p=String(v||'').toUpperCase();
 return {P0:'Sangat mendesak',P1:'Perlu segera',P2:'Perlu dipantau',P3:'Belum mendesak',HIGH:'Tinggi',MEDIUM:'Sedang',LOW:'Rendah'}[p]||String(v||'Periksa');
}
function plainConfidence(v){
 var x=String(v||'').toLowerCase();
 return {high:'Tinggi',medium:'Sedang','low-medium':'Terbatas',low:'Rendah'}[x]||String(v||'');
}
function sourceLabel(v){
 var x=String(v||'');
 return x==='Energy_Cost_TOE'?'Data Energi & Hasil Produksi':x==='Energy_Utility_ENPI'?'Data Utilitas / ENPI':x;
}
function metricLabel(v){
 return String(v||'').replace(/^daily\./i,'Harian • ').replace(/^chemical\./i,'Kimia • ').replace(/\./g,' › ');
}
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
  51:'Cerita KPI',52:'Data yang Berkaitan dengan KPI',53:'Tren & Perkiraan KPI',54:'Coba Nilai KPI vs Target',55:'Hubungan Breakdown & Hasil Produksi',
  56:'Energi yang Jauh dari Pola',57:'Energi per Hasil Baik',58:'Ringkasan Catatan Utilitas',59:'Ringkasan Data IPAL',60:'Ringkasan 1 Menit'
 };
 var sec=document.createElement('section');sec.className='v4-interaction v4-operation-intel';sec.dataset.v4OpFeature=String(n);
 var machine=(n<=53||n===55)?'<label>Konteks mesin<select data-v4-op-machine>'+machineOptions()+'</select></label>':'';
 var simulator=n===54?'<div class="v4-form-grid">'+
  '<label>KPI<select data-v4-op-kpi><option value="">Memuat KPI…</option></select></label>'+
  '<label>Nilai yang ingin dicoba<input type="number" step="any" data-v4-op-kpi-value placeholder="Isi angka KPI untuk dibandingkan dengan target"></label>'+
  '</div>':'';
 var actionLabels={51:'Buat ringkasan KPI',52:'Tampilkan data terkait KPI',53:'Tampilkan tren & perkiraan',55:'Tampilkan hubungan breakdown & hasil',56:'Cari nilai energi yang menyimpang',57:'Hitung energi per hasil baik',58:'Tampilkan ringkasan utilitas',59:'Tampilkan data IPAL',60:'Buat ringkasan 1 menit'};
 sec.innerHTML='<div class="v4-interaction-head"><div><span class="v4-eyebrow">OPERASI & KPI</span><h3>'+esc(titles[n])+'</h3></div><span class="v4-no-write">'+(n===54?'Tidak disimpan':'Tidak mengubah data')+'</span></div>'+
 (machine?'<div class="v4-form-grid">'+machine+'</div>':'')+simulator+
 '<div class="v4-interaction-actions">'+
 (n===54?'<button class="btn btn-primary btn-sm" data-v4-op-kpi-sim><i class="ph-bold ph-function"></i> Bandingkan dengan Target</button>':'<button class="btn btn-primary btn-sm" data-v4-op-load="'+n+'"><i class="ph-bold ph-arrows-clockwise"></i> '+esc(actionLabels[n]||'Tampilkan data')+'</button>')+
 (n===51||n===52||n===53||n===54?'<button class="btn btn-sm" data-v4-open-existing="kpi-department"><i class="ph-bold ph-target"></i> Buka KPI</button>':'')+
 (n===56||n===57||n===58?'<button class="btn btn-sm" data-v4-open-existing="energy-utility"><i class="ph-bold ph-lightning"></i> Buka Energi</button>':'')+
 (n===59?'<button class="btn btn-sm" data-v4-open-existing="report"><i class="ph-bold ph-file-text"></i> Buka Laporan</button>':'')+
 '</div><div data-v4-op-out>'+note(n===54?'Pilih KPI, isi angka yang ingin dicoba, lalu bandingkan dengan target. Angka ini hanya percobaan di layar: tidak disimpan dan tidak menebak dampak maintenance.':'OMODOS 4.0 memakai catatan sejak 1 September 2026. Data operasional tidak diubah.','safe')+'</div>';
 h.prepend(sec);
 if(n===54)setTimeout(function(){loadTargetKpis(sec,false)},0);
}
function targetStories(d){
 return (d&&Array.isArray(d.kpiStories)?d.kpiStories:[]).filter(function(x){
  return x&&x.actual!=null&&x.target!=null&&Number.isFinite(Number(x.actual))&&Number.isFinite(Number(x.target));
 });
}
function targetStatus(kpi,val){
 var target=Number(kpi.target),lowerBetter=String(kpi.polarity||'').toLowerCase().indexOf('min')>=0;
 return lowerBetter?val<=target:val>=target;
}
function targetNeed(kpi){
 var actual=Number(kpi.actual),target=Number(kpi.target),lowerBetter=String(kpi.polarity||'').toLowerCase().indexOf('min')>=0;
 var gap=lowerBetter?actual-target:target-actual;
 if(gap<=0)return 'Target pada data terbaru sudah tercapai.';
 return (lowerBetter?'Perlu turun sekurangnya ':'Perlu naik sekurangnya ')+fmt(gap)+(kpi.unit?' '+kpi.unit:'')+' dari nilai terbaru agar menyentuh target.';
}
function targetBaselineHtml(kpi){
 if(!kpi)return empty('Pilih KPI yang memiliki nilai aktual dan target sejak 1 September 2026.');
 return metrics([
  ['KPI',kpi.name||'KPI'],['Periode terbaru',kpi.latestPeriod||'—'],['Nilai terbaru',fmt(kpi.actual)+(kpi.unit?' '+kpi.unit:'')],
  ['Target',fmt(kpi.target)+(kpi.unit?' '+kpi.unit:'')]
 ])+note(targetNeed(kpi),'safe');
}
async function loadTargetKpis(sec,force){
 var sel=sec&&sec.querySelector('[data-v4-op-kpi]'),input=sec&&sec.querySelector('[data-v4-op-kpi-value]'),out=sec&&sec.querySelector('[data-v4-op-out]');
 if(!sel)return;
 try{
  var d=await getOperation({},!!force),stories=targetStories(d);
  sec.__v4TargetStories=stories;
  sel.innerHTML=stories.length?stories.map(function(x,i){return '<option value="'+i+'">'+esc(x.name||('KPI '+(i+1)))+' — '+esc(x.latestPeriod||'')+'</option>'}).join(''):'<option value="">Belum ada KPI dengan actual + target</option>';
  var k=stories[0]||null;
  if(input)input.value=k&&k.actual!=null?String(k.actual):'';
  if(out)out.innerHTML=targetBaselineHtml(k);
 }catch(err){
  if(out)out.innerHTML=note(err&&err.message||String(err),'error');
  sel.innerHTML='<option value="">KPI belum dapat dimuat</option>';
 }
}
function selectedTargetKpi(sec){
 var rows=sec&&Array.isArray(sec.__v4TargetStories)?sec.__v4TargetStories:[],idx=Number(value(sec,'[data-v4-op-kpi]'));
 return Number.isInteger(idx)&&idx>=0&&idx<rows.length?rows[idx]:null;
}
function compareTarget(btn){
 var sec=btn.closest('.v4-operation-intel'),out=sec&&sec.querySelector('[data-v4-op-out]'),k=selectedTargetKpi(sec);
 if(!sec||!out)return;
 if(!k){out.innerHTML=note('Pilih KPI yang memiliki nilai aktual dan target.','warn');return}
 var raw=value(sec,'[data-v4-op-kpi-value]'),scenario=Number(raw);
 if(raw===''||!Number.isFinite(scenario)){out.innerHTML=note('Isi nilai skenario KPI dengan angka yang valid.','warn');return}
 var met=targetStatus(k,scenario),delta=scenario-Number(k.actual),unit=k.unit?' '+k.unit:'';
 out.innerHTML=metrics([
  ['KPI',k.name||'KPI'],['Nilai terbaru',fmt(k.actual)+unit],['Target',fmt(k.target)+unit],
  ['Nilai yang dicoba',fmt(scenario)+unit],['Selisih dari nilai terbaru',(delta>=0?'+':'')+fmt(delta)+unit],['Hasil perbandingan',met?'Mencapai target':'Belum mencapai target']
 ])+
 note(targetNeed(k),'safe')+
 note('Nilai skenario berasal dari angka yang Anda masukkan. OMODOS tidak menganggap perubahan downtime, sparepart, atau tindakan maintenance otomatis menyebabkan KPI ini berubah.','warn');
}
function render51(d){
 return list(d.kpiStories,function(x){
  var sub=(x.story||'')+(x.unit?' • '+x.unit:'');
  var status=x.actual==null?'Belum ada realisasi':x.target==null?'Target belum tercatat':x.atRisk?'Perlu perhatian':'Sesuai target periode';
  return item(x.name||'KPI',sub,chip(status));
 },80)+note('Ringkasan membandingkan realisasi dan target yang benar-benar tersedia sejak 1 September 2026. KPI tanpa target tidak diberi status seolah-olah sudah aman.','safe');
}
function render52(d){
 var rows=(d.kpiAtRisk||[]).map(function(x){
  var ev=x.causeTree&&Array.isArray(x.causeTree.evidence)?x.causeTree.evidence:[];
  return {name:x.name,status:x.status,evidence:ev};
 });
 return list(rows,function(x){
  var e=x.evidence.map(function(v){var d=String(v.domain||'bagian').toLowerCase();d=d==='maintenance'?'Maintenance':d==='energy'?'Energi':'Data terkait';return d+': '+(v.records||0)+' catatan • '+(v.reason||'')}).join(' | ');
  return item(x.name||'KPI perlu perhatian',(x.status||'')+(e?' • '+e:''),chip('Mungkin terkait'));
 },50)+note('Bagan ini menunjukkan data yang mungkin berkaitan. Hubungan tersebut belum membuktikan penyebab.','warn');
}
function render53(d){
 var rows=(d.kpiStories||[]).filter(function(x){return x.forecast&&x.forecast.nextValue!=null});
 return list(rows,function(x){
  var f=x.forecast||{};
  return item(x.name||'KPI','Terbaru '+fmt(x.actual)+' • Target '+fmt(x.target)+' • Perubahan tren/bulan '+fmt(f.trendPerMonth),chip('Perkiraan berikutnya '+fmt(f.nextValue)+' • keyakinan '+plainConfidence(f.confidence||'rendah')));
 },60,'Belum cukup titik data sejak 1 September 2026 untuk membuat proyeksi tren.')+
 note('Perkiraan mengikuti arah data sebelumnya. Hasil sebenarnya bisa berbeda.','warn');
}
function render55(d){
 var c=d.maintenanceProductionCorrelation||{};
 if(typeof c.pearson!=='number')return empty('Data gangguan dan hasil produksi belum cukup untuk dibandingkan.')+note('Minimal perlu beberapa periode yang memiliki angka jam gangguan dan hasil baik.','safe');
 return metrics([
  ['Periode yang bisa dibandingkan',fmt(c.pairs,0)],['Nilai hubungan (-1 sampai +1)',fmt(c.pearson,3)],['Data 1','Jam gangguan'],['Data 2','Hasil baik']
 ])+note('Mendekati +1: keduanya cenderung naik/turun bersama. Mendekati -1: arahnya cenderung berlawanan. Mendekati 0: hubungannya lemah. Angka ini tidak membuktikan sebab-akibat.','warn');
}
function render56(d){
 return list(d.energyAnomalies,function(x){
  var distance=Math.abs(Number(x.zScore));
  return item((x.area||'Area')+' • '+(x.type||'Energi'), 'Nilai '+fmt(x.value)+' • rata-rata kelompok '+fmt(x.baselineMean),chip('Tingkat perbedaan '+fmt(distance,2)));
 },60,'Tidak ditemukan pemakaian energi yang sangat jauh dari pola kelompoknya.')+
 note('Sistem membandingkan angka dengan pola area dan jenis energi yang sama. Tanda ini hanya membantu memilih data yang perlu diperiksa; bukan bukti bahwa pemakaian salah atau boros.','safe');
}
function render57(d){
 return list(d.energyPerGoodOutput,function(x){
  var label=(x.month||'')+' '+(x.year||'');
  var ratio=x.energyPerGoodSheet!=null?x.energyPerGoodSheet:x.ratio;
  var sub=(x.area?x.area+' • ':'')+(x.type?x.type+' • ':'')+'Hasil baik '+fmt(x.goodOutput!=null?x.goodOutput:x.output)+' • Sumber '+sourceLabel(x.source||'');
  return item(label.trim()||'Periode',sub,chip('Energi/Hasil baik '+fmt(ratio,6)));
 },80,'Belum ada pasangan data energi + hasil baik yang valid.')+
 note('Bandingkan angka hanya jika jenis dan satuan datanya sama.','warn');
}
function render58(d){
 return list(d.utilityDigitalTwin,function(x){
  return item((x.area||'Area')+' • '+(x.type||'Utilitas'),fmt(x.records,0)+' catatan pada data yang tersedia',chip('Rata-rata '+fmt(x.average,3)));
 },80)+note('Bagian ini merangkum catatan utilitas menurut area dan jenisnya.','safe');
}
function render59(d){
 return list(d.ipalIntelligence,function(x){
  var nums=Array.isArray(x.numericMetrics)?x.numericMetrics.slice(0,5):[];
  var sub=nums.map(function(m){return metricLabel(m.metric)+' = '+fmt(m.value,3)}).join(' • ');
  return item((x.outlet||'IPAL')+' • '+(x.month||''),String(x.timestamp||'').slice(0,16)+(sub?' • '+sub:''),chip(nums.length+' angka tercatat'));
 },80,'Belum ada laporan IPAL pada periode data OMODOS 4.0.')+
 note('Fitur ini hanya merangkum angka yang tersimpan. OMODOS tidak menyatakan aman/tidak aman atau memenuhi/tidak memenuhi baku mutu tanpa batas resmi yang tervalidasi.','warn');
}
function render60(d){
 if(!d)return empty('Ringkasan singkat belum tersedia.');
 var summary=Array.isArray(d.summary)?d.summary:[];
 var look=Array.isArray(d.thingsToLookAt)?d.thingsToLookAt:[];
 return '<section class="v4-server-section"><div class="v4-server-section-head"><strong>'+esc(d.headline||'Ringkasan 1 Menit')+'</strong><span>Keyakinan '+esc(plainConfidence(d.confidence||''))+'</span></div>'+
 '<div class="v4-sf-list">'+summary.map(function(x){return item(String(x),'','')}).join('')+'</div></section>'+
 (look.length?'<section class="v4-server-section"><div class="v4-server-section-head"><strong>Perlu Diperhatikan</strong><span>'+look.length+'</span></div>'+
 list(look,function(x){return item(x.title||x.machine||x.type||'Perlu diperhatikan',x.reason||x.note||x.description||'',chip(plainPriority(x.priority||x.severity||'PERIKSA')))},12)+'</section>':'')+
 note('Ringkasan prioritas dibuat dari catatan OMODOS yang tersedia.','safe');
}
function render(n,d){
 if(!d)return empty('Data OMODOS 4.0 belum tersedia pada sesi atau koneksi ini.');
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
document.addEventListener('click',function(ev){
 var tile=ev.target.closest&&ev.target.closest('[data-v4-feature]');
 if(tile){
  var n=Number(tile.getAttribute('data-v4-feature'));
  if(n>=51&&n<=60)setTimeout(function(){if(openN(n))mount(n)},0);
  return;
 }
 var b=ev.target.closest&&ev.target.closest('[data-v4-op-load]');
 if(b){ev.preventDefault();load(b,Number(b.getAttribute('data-v4-op-load')),true);return}
 var sim=ev.target.closest&&ev.target.closest('[data-v4-op-kpi-sim]');
 if(sim){ev.preventDefault();compareTarget(sim);return}
},false);
document.addEventListener('change',function(ev){
 if(ev.target&&ev.target.matches('[data-v4-op-kpi]')){
  var sec=ev.target.closest('.v4-operation-intel'),k=selectedTargetKpi(sec),input=sec&&sec.querySelector('[data-v4-op-kpi-value]'),out=sec&&sec.querySelector('[data-v4-op-out]');
  if(input)input.value=k&&k.actual!=null?String(k.actual):'';
  if(out)out.innerHTML=targetBaselineHtml(k);
 }
},false);

window.OMODOS4=Object.assign(window.OMODOS4||{},{
 operationIntelVersion:'2',
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
 Array.from(h.querySelectorAll('.v4-interaction[data-v4-interaction-feature="'+n+'"],.v4-people-intel')).forEach(function(x){x.remove()});
 var titles={
  61:'Ringkasan Pengalaman & Penilaian Teknisi',62:'Teknisi & Mesin yang Pernah Ditangani',63:'Cari Teknisi dengan Pengalaman Terkait',64:'Riwayat Pengalaman Teknisi',65:'Risiko Pengetahuan Terbatas',
  66:'Kebutuhan Belajar yang Tercatat',67:'Saran Rencana Belajar',68:'Kandidat Mentor',69:'Latihan dari Kasus Nyata',70:'Bukti Penilaian & Pengalaman'
 };
 var controls='';
 if(n===63)controls='<div class="v4-form-grid"><label>Mesin<select data-v4-pi-machine><option value="">Muat data untuk melihat mesin</option></select></label><label class="v4-form-wide">Masalah / gejala<input data-v4-pi-query placeholder="Contoh: sensor register error"></label></div>';
 if(n===64||n===70)controls='<div class="v4-form-grid"><label>Personel<select data-v4-pi-person><option value="">Muat data untuk melihat teknisi</option></select></label></div>';
 var actionLabels={61:'Tampilkan ringkasan teknisi',62:'Tampilkan hubungan teknisi & mesin',63:'Cari teknisi berpengalaman',64:'Buka riwayat teknisi',65:'Tampilkan risiko pengetahuan',66:'Tampilkan kebutuhan belajar',67:'Tampilkan saran belajar',68:'Tampilkan calon mentor',69:'Buka latihan kasus',70:'Tampilkan bukti pengalaman'};
 var sec=document.createElement('section');sec.className='v4-interaction v4-people-intel';sec.dataset.v4PiFeature=String(n);
 sec.innerHTML='<div class="v4-interaction-head"><div><span class="v4-eyebrow">TEKNISI & KEAHLIAN</span><h3>'+esc(titles[n])+'</h3></div><span class="v4-no-write">Tidak mengubah data</span></div>'+
 controls+
 '<div class="v4-interaction-actions"><button class="btn btn-primary btn-sm" data-v4-pi-load="'+n+'"><i class="ph-bold ph-arrows-clockwise"></i> '+esc(actionLabels[n]||'Tampilkan data')+'</button>'+
 '<button class="btn btn-sm" data-v4-open-existing="pi-dashboard"><i class="ph-bold ph-users-three"></i> Buka Data Teknisi</button>'+
 (n===69?'<button class="btn btn-sm" data-v4-open-existing="diagnostic"><i class="ph-bold ph-stethoscope"></i> Buka Diagnostik</button>':'')+
 '</div>'+
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
  ['Personel terdaftar',fmt(d.counts&&d.counts.personnel,0)],['Personel dengan riwayat',fmt(d.counts&&d.counts.linkedPeople,0)],
  ['Penilaian teknis',fmt(d.counts&&d.counts.hard,0)],['Penilaian perilaku',fmt(d.counts&&d.counts.soft,0)]
 ])+
 list(rows,function(x){
  var machines=Array.isArray(x.machines)&&x.machines.length?x.machines.slice(0,4).join(', '):'belum ada bukti pengalaman mesin';
  var mc=Array.isArray(x.machines)?x.machines.length:0;
  return item(x.name||'Personel',(x.position||'Posisi belum tercatat')+' • '+machines+' • RCA '+fmt(x.rcaCount,0)+' • Pengetahuan '+fmt(x.knowledgeCount,0),chip(fmt(mc,0)+' mesin tercatat'));
 },80)+note('Ringkasan memakai catatan pengalaman dan penilaian yang sudah ada. Tidak ada skor kemampuan atau peringkat kinerja otomatis pada tampilan ini.','warn');
}
function render62(d){
 return list(d.skillToMachine,function(x){
  return item(x.person||'Personel',(x.machine||'Mesin')+' • Logbook '+fmt(x.logbook,0)+' • RCA '+fmt(x.rca,0)+' • Terakhir '+String(x.lastSeen||'—').slice(0,10),chip(fmt(x.evidenceEvents,0)+' kejadian'));
 },100)+note('Hubungan ini berarti teknisi pernah tercatat bekerja pada mesin tersebut melalui Logbook/RCA. Ini tidak otomatis berarti teknisi sudah menguasai seluruh bagian mesin atau memiliki kewenangan tertentu.','safe');
}
function render65(d){
 function riskLabel(v){var u=String(v||'').toUpperCase();return u==='HIGH'?'Tinggi':u==='MEDIUM'?'Sedang':u==='LOW'?'Rendah':String(v||'—')}
 return list(d.knowledgeRisk,function(x){
  return item(x.machine||'Mesin','Orang dengan bukti pengalaman '+fmt(x.experiencedPeople,0)+' • Kejadian tercatat '+fmt(x.evidenceEvents,0)+' • Artikel pengetahuan '+fmt(x.knowledgeArticles,0)+' • RCA '+fmt(x.rca,0),chip('Sinyal risiko '+riskLabel(x.risk)+' • indeks data '+fmt(x.riskScore,0)));
 },100)+note('Indeks ini diturunkan dari jumlah orang dengan bukti pengalaman, kejadian yang tercatat, artikel pengetahuan, dan RCA. Ini bukan ramalan seseorang akan keluar atau pengetahuan pasti hilang. Gunakan untuk menentukan area yang perlu lebih banyak dokumentasi dan berbagi pengalaman.','warn');
}
function gapText(x){
 var g=x&&x.gap;
 if(g&&typeof g==='object')return pick(g,['Unit Kompetensi','Kriteria Unjuk Kerja','Elemen Unit','Penjelasan Belum Kompeten','Status','Keterangan'])||'Kebutuhan kompetensi tercatat';
 return String(g||'Kebutuhan kompetensi tercatat');
}
function render66(d){
 return list(d.skillGapRadar,function(x){
  return item(x.person||'Personel',(x.position||'Posisi belum tercatat')+' • '+gapText(x),chip('Kebutuhan tercatat'));
 },100)+note('Daftar ini hanya menunjukkan kebutuhan belajar yang tercatat dalam penilaian.','safe');
}
function render67(d){
 var rows=Array.isArray(d.adaptiveLearning)?d.adaptiveLearning:[];
 if(!rows.length)return empty('Belum ada kebutuhan belajar tercatat yang dapat disusun menjadi saran langkah belajar.');
 return '<div class="v4-sf-list">'+rows.slice(0,80).map(function(x){
  var gaps=Array.isArray(x.gaps)?x.gaps:[],standards=Array.isArray(x.standards)?x.standards:[],
      machines=Array.isArray(x.machines)?x.machines:[],mentors=Array.isArray(x.mentorCandidates)?x.mentorCandidates:[],
      steps=Array.isArray(x.nextSteps)?x.nextSteps:[];
  return '<details class="v4-simple-details"><summary><strong>'+esc(x.person||'Personel')+'</strong> — '+esc(fmt(x.gapCount,0))+' kebutuhan belajar</summary>'+
   '<div class="v4-kv-stack">'+
   '<div><span>Posisi</span><b>'+esc(x.position||'Belum tercatat')+'</b></div>'+
   '<div><span>Gap utama</span><b>'+esc(gaps.join(' • ')||'Belum dirinci')+'</b></div>'+
   '<div><span>Standar terkait</span><b>'+esc(standards.join(' • ')||'Belum ada standar yang cocok')+'</b></div>'+
   '<div><span>Mesin untuk latihan</span><b>'+esc(machines.join(', ')||'Belum ada riwayat mesin')+'</b></div>'+
   '<div><span>Kandidat mentor</span><b>'+esc(mentors.join(', ')||'Belum ada kandidat dari data')+'</b></div>'+
   '</div>'+
   (steps.length?'<ol class="v4-learning-steps">'+steps.map(function(s){return '<li>'+esc(s)+'</li>'}).join('')+'</ol>':'')+
   '</details>';
 }).join('')+'</div>'+note('Ini adalah saran yang disusun dari bukti tercatat, bukan rencana training resmi. Atasan dan teknisi tetap menentukan prioritas, jadwal, mentor, metode belajar, dan penilaian ulang.','warn');
}
function render68(d){
 return list(d.mentorMatches,function(x){
  var mentors=(x.mentors||[]).map(function(m){return m.name+' ['+(m.sharedMachines||[]).slice(0,3).join(', ')+']'}).join(' • ');
  return item(x.mentee||'Teknisi yang membutuhkan pendampingan',mentors||'Belum ada kandidat mentor',chip('Kandidat dari data'));
 },100)+note('Calon mentor dipilih dari pengalaman yang tercatat. Penunjukan mentor tetap perlu persetujuan.','warn');
}
function render69(d){
 var rows=Array.isArray(d.troubleshootingChallenges)?d.troubleshootingChallenges:[];
 if(!rows.length)return empty('Belum ada masalah berulang yang cukup untuk dijadikan latihan.')+note('Latihan hanya dibuat dari kasus nyata yang benar-benar tercatat.','safe');
 return '<div class="v4-sf-list">'+rows.slice(0,30).map(function(x,i){
  var e=x.evidence||{},ref=x.referenceRca||null;
  var refHtml=ref?'<div class="v4-kv-stack">'+
   '<div><span>RCA</span><b>'+esc(ref.title||ref.id||'RCA tercatat')+'</b></div>'+
   '<div><span>Kemiripan teks</span><b>'+esc(fmt(ref.similarity,2))+'</b></div>'+
   (ref.rootCause?'<div><span>Akar penyebab tercatat</span><b>'+esc(ref.rootCause)+'</b></div>':'')+
   (ref.action?'<div><span>Tindakan tercatat</span><b>'+esc(ref.action)+'</b></div>':'')+
   '</div>':empty('Belum ada RCA yang cukup mirip untuk dijadikan referensi.');
  return '<details class="v4-simple-details"><summary><strong>'+esc(x.title||('Latihan '+(i+1)))+'</strong> — '+esc(x.problem||'Masalah belum bernama')+'</summary>'+
   '<div class="v4-statline"><div><b>'+esc(fmt(e.occurrences,0))+'</b><span>Kejadian</span></div><div><b>'+esc(fmt(e.downtimeMinutes,0))+'</b><span>Menit berhenti</span></div><div><b>'+esc(fmt(e.openIssues,0))+'</b><span>Belum selesai</span></div></div>'+
   '<div class="v4-interaction-note safe"><i class="ph-bold ph-question"></i><span>'+esc(x.prompt||'Apa yang akan Anda periksa terlebih dahulu?')+'</span></div>'+
   '<details class="v4-simple-details"><summary>Lihat referensi setelah mencoba</summary>'+refHtml+
   note(x.note||'Referensi membantu belajar dari histori dan bukan jawaban mutlak.','warn')+'</details></details>';
 }).join('')+'</div>'+note('Latihan tidak memberi nilai dan tidak mengubah Logbook/RCA. Tujuannya membantu teknisi berlatih membaca bukti kasus nyata.','safe');
}
function render70Person(p){
 if(!p)return empty('Pilih personel lalu tampilkan bukti.');
 var ev=p.competencyEvidence||{};
 return metrics([
  ['Penilaian teknis',fmt(p.hardAssessments,0)],['Penilaian perilaku',fmt(p.softAssessments,0)],
  ['Status kompeten tercatat',fmt(p.competent,0)],['Perlu dikembangkan tercatat',fmt(p.notCompetent,0)],
  ['Bukti RCA',fmt(p.rcaCount,0)],['Pengetahuan',fmt(p.knowledgeCount,0)]
 ])+
 list(p.machineEvidence,function(x){
  return item(x.machine||'Mesin','Kejadian '+fmt(x.events,0)+' • Logbook '+fmt(x.logbook,0)+' • RCA '+fmt(x.rca,0)+' • Terakhir '+(x.lastSeen?new Date(x.lastSeen).toISOString().slice(0,10):'—'),chip('Bukti pengalaman mesin'));
 },30)+
 note('Bagian ini mengumpulkan bukti pengalaman dan penilaian yang sudah ada. Sistem tidak memberi nilai kinerja otomatis.','warn');
}
function passportView(p){
 if(!p||p.label==='NOT AVAILABLE')return empty('Riwayat pengalaman belum tersedia untuk teknisi ini.');
 var machines=Array.isArray(p.machines)&&p.machines.length?p.machines.join(', '):'belum ada bukti pengalaman mesin';
 return metrics([
  ['Penilaian teknis',fmt(p.hardAssessments,0)],['Penilaian perilaku',fmt(p.softAssessments,0)],
  ['RCA',fmt(p.rcaCount,0)],['Pengetahuan',fmt(p.knowledgeCount,0)]
 ])+
 '<div class="v4-sf-list">'+item(p.name||'Personel',(p.position||'Posisi belum tercatat')+' • Mesin: '+machines,chip('Ringkasan data'))+'</div>'+
 note('Riwayat ini merangkum pekerjaan yang tercatat. Isinya bukan penilaian kinerja resmi.','safe');
}
async function render63(sec,out){
 var machine=val(sec,'[data-v4-pi-machine]'),query=val(sec,'[data-v4-pi-query]');
 if(!machine&&!query){out.innerHTML=note('Pilih mesin atau isi masalah/gejala agar pencarian orang berpengalaman tidak terlalu luas.','warn');return}
 var d=await window.OMODOS4.serverRead('v4.getExpertFinder',{machine:machine,query:query});
 out.innerHTML=list(d&&d.experts,function(x){
  return item(x.name||'Personel','Kejadian tercatat '+fmt(x.events,0)+' • Kejadian pada mesin '+fmt(x.machineEvents,0)+' • Kasus mirip '+fmt(x.similarityEvidence,0)+' • Penilaian teknis '+fmt(x.hardSkillAssessments,0),chip('Indeks bukti terkait '+fmt(x.score,0)));
 },30)+note('Urutan orang didasarkan pada keterlibatan dalam kasus serupa, bukan peringkat kinerja.','warn');
}
async function render64(sec,out){
 var name=val(sec,'[data-v4-pi-person]');
 if(!name){out.innerHTML=empty('Pilih personel untuk membuka riwayat pengalaman.');return}
 var p=await window.OMODOS4.serverRead('v4.getExperiencePassport',{name:name});
 out.innerHTML=passportView(p);
}
async function load(btn,n,force){
 var sec=btn.closest('.v4-people-intel'),out=sec&&sec.querySelector('[data-v4-pi-out]');
 if(!sec||!out)return;
 busy(btn,true,'Memuat');
 try{
  var d=await getPeople(!!force);
  if(!d){out.innerHTML=empty('Data teknisi belum tersedia pada sesi ini.');return}
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
 71:{purpose:'ask',title:'Tanya OMODOS',machine:'optional',placeholder:'Tanyakan kondisi maintenance, risiko, riwayat, sparepart, KPI, atau bukti data lain.',defaultText:''},
 72:{purpose:'machine',title:'Tanya Tentang Mesin',machine:'required',placeholder:'Tanyakan kondisi, riwayat, pola masalah, atau risiko mesin terpilih.',defaultText:'Jelaskan kondisi terkini, pola masalah, risiko yang perlu diperiksa, dan bukti data pendukung mesin ini.'},
 73:{purpose:'shift',title:'Ringkasan Pergantian Shift',machine:'optional',placeholder:'Tambahkan konteks pergantian shift bila diperlukan.',defaultText:'Buat ringkasan pergantian shift: perubahan penting, masalah yang belum selesai, risiko, dan tindakan yang harus diteruskan.'},
 74:{purpose:'morning-brief',title:'Ringkasan Pagi',machine:'optional',placeholder:'Tambahkan fokus ringkasan pagi bila diperlukan.',defaultText:'Buat ringkasan maintenance pagi yang singkat, berdasarkan bukti data, dan utamakan hal yang perlu ditindaklanjuti.'},
 75:{purpose:'rca-draft',title:'Buat Draf RCA',machine:'optional',placeholder:'Tuliskan masalah atau gejala. Akar penyebab akhir tetap harus diperiksa manusia.',defaultText:''},
 76:{purpose:'troubleshooting',title:'Cari Kasus Mirip',machine:'optional',placeholder:'Tuliskan gejala atau masalah untuk mencari kasus lama yang mirip.',defaultText:''},
 77:{purpose:'manual',title:'Tanya Manual',machine:'required',placeholder:'Tanyakan hal yang ingin dipahami dari manual atau pengetahuan yang tersedia untuk mesin ini.',defaultText:''},
 78:{purpose:'harvest',title:'Cari Pengetahuan Baru',machine:'none',placeholder:'',defaultText:''},
 79:{purpose:'translate',title:'Terjemahkan Istilah Maintenance',machine:'none',placeholder:'Masukkan istilah atau kalimat maintenance yang ingin dibuat lebih mudah dipahami.',defaultText:''},
 80:{purpose:'skeptic',title:'Periksa Ulang Asumsi',machine:'optional',placeholder:'Tuliskan dugaan, asumsi, atau keputusan yang ingin diperiksa ulang.',defaultText:''}
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
 try{
  if(window.OMODOS4&&typeof window.OMODOS4.getMachineNames==='function')return window.OMODOS4.getMachineNames();
 }catch(e){}
 var set=new Set();
 try{(Array.isArray(MACHINES)?MACHINES:[]).forEach(function(m){var n=m['Nama Mesin']||m.namaMesin||m['Kode Mesin']||m.kodeMesin;if(n)set.add(String(n))})}catch(e){}
 return Array.from(set).sort(function(a,b){return a.localeCompare(b,'id')});
}
function machineOptions(blank){
 return '<option value="">'+esc(blank||'Semua mesin')+'</option>'+names().map(function(n){return '<option value="'+esc(n)+'">'+esc(n)+'</option>'}).join('');
}
function actionReady(){return !!(window.OMODOS4&&typeof window.OMODOS4.interactiveAction==='function')}
function readReady(){return !!(window.OMODOS4&&typeof window.OMODOS4.serverRead==='function')}
function action(action,payload){
 if(!actionReady())return Promise.reject(new Error('Layanan OMODOS 4.0 belum tersedia pada sesi ini.'));
 return window.OMODOS4.interactiveAction(action,payload||{});
}
function read(actionName,payload){
 if(!readReady())return Promise.resolve(null);
 return window.OMODOS4.serverRead(actionName,payload||{});
}
function evidenceTitle(e){
 if(!e||typeof e!=='object')return String(e||'Bukti data');
 var r=e.record&&typeof e.record==='object'?e.record:e;
 return first(r,['Nama Mesin','namaMesin','Machine','Mesin','Title','Judul','Problem','Deskripsi Masalah','Deskripsi','description','Nama Material','Nama','ID'])||
        first(e,['machine','title','problem','description','sheet','source'])||'Bukti data';
}
function evidenceHtml(arr,limit){
 if(!Array.isArray(arr)||!arr.length)return empty('Tidak ada sumber bukti tambahan yang ditemukan.');
 return '<div class="v4-sf-list">'+arr.slice(0,limit||16).map(function(e){
  var src=first(e,['sheet','source','type','label'])||'OMODOS';
  var machine=first(e,['machine']);
  var score=e&&e.score!=null?' • kecocokan '+fmt(e.score,2):'';
  return '<div class="v4-sf-item"><div><strong>'+esc(evidenceTitle(e))+'</strong><small>'+esc(src+(machine?' • '+machine:'')+score)+'</small></div>'+chip('Sumber data')+'</div>';
 }).join('')+'</div>';
}
function aiHtml(d){
 d=d||{};
 var summary=first(d,['summary','answer'])||'Belum ada ringkasan.';
 var assumptions=Array.isArray(d.assumptions)?d.assumptions:[];
 var evidence=Array.isArray(d.evidence)?d.evidence:[];
 var recommendation=first(d,['recommendation']);
 var provider=d.providerStatus==='unavailable'?'Layanan bantuan belum tersedia • ringkasan memakai catatan OMODOS':(d.modelUsed?'Asisten aktif':'Berdasarkan catatan');
 var mode={GENERATIVE_WITH_INTERNAL_EVIDENCE:'Jawaban Asisten',DETERMINISTIC_FALLBACK:'Ringkasan dari Data'}[d.mode]||'Asisten OMODOS';
 var confidence={'not-applicable':'Tidak diperlukan',high:'Kuat',medium:'Sedang','low-medium':'Terbatas',low:'Rendah'}[String(d.confidence||'').toLowerCase()]||d.confidence||'belum tersedia';
 return '<div class="v4-ai-result">'+
  '<div class="v4-interaction-result-head"><span class="v4-server-badge">'+esc(mode)+'</span><span>Tingkat keyakinan: '+esc(confidence)+'</span></div>'+
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
 var labels={71:'Tanyakan',72:'Tanyakan soal mesin',73:'Buat ringkasan shift',74:'Buat ringkasan pagi',75:'Buat draf RCA',76:'Cari kasus mirip',77:'Cari jawaban di manual',78:'Cari kandidat pengetahuan',79:'Sederhanakan istilah',80:'Periksa asumsi'};
 var extra='';
 if(n===71||n===72||n===73||n===74||n===79||n===80)extra='<button class="btn btn-sm" data-v4-open-copilot><i class="ph-bold ph-brain"></i> Buka Copilot</button>';
 if(n===75)extra='<button class="btn btn-sm" data-v4-open-existing="diagnostic"><i class="ph-bold ph-file-magnifying-glass"></i> Buka RCA Existing</button>';
 if(n===77||n===78)extra='<button class="btn btn-sm" data-v4-open-existing="knowledge"><i class="ph-bold ph-books"></i> Buka Pengetahuan</button>';
 return '<div class="v4-interaction-actions"><button class="btn btn-primary btn-sm" data-v4-ai2-run="'+n+'"><i class="ph-bold ph-sparkle"></i> '+esc(labels[n]||'Tampilkan hasil')+'</button>'+extra+'</div>';
}
function intro(n){
 var text='Bukti diambil dari data OMODOS yang sudah ada. Asisten tidak boleh mengubah data operasional secara otomatis.';
 if(n===72)text='Data dibatasi ke mesin yang dipilih di server. Bukti dari mesin lain tidak ikut dicari.';
 if(n===73)text='Ringkasan memakai catatan perubahan pada shift sebelumnya dan masalah yang perlu diteruskan. Data di luar periode shift tidak dipakai sebagai perubahan shift.';
 if(n===74)text='Ringkasan memakai catatan hari ini sejak awal hari waktu Jakarta dan menyorot hal yang perlu ditindaklanjuti.';
 if(n===75)text='Fitur ini hanya membuat draf RCA. Akar penyebab akhir dan tindakan perbaikan wajib diperiksa manusia sebelum disimpan.';
 if(n===76)text='Pencarian kasus mirip memakai riwayat lama. Kemiripan teks bukan bukti bahwa akar penyebabnya sama.';
 if(n===77)text='Asisten tidak boleh mengarang isi manual. Jika yang tersedia hanya tautan atau informasi dokumen, sistem akan menjelaskan batasannya.';
 if(n===78)text='Fitur ini hanya menghasilkan kandidat pengetahuan. Artikel tetap disimpan melalui halaman Pengetahuan setelah diperiksa.';
 if(n===79)text='Terjemahan menjaga makna teknis. Periksa kembali bila isinya menyangkut prosedur keselamatan atau spesifikasi.';
 if(n===80)text='Fitur ini sengaja mencari penjelasan lain, bukti yang belum ada, dan asumsi yang masih perlu diuji.';
 return note(text,'safe');
}
function mount(n){
 n=Number(n);var cfg=AI2_CFG[n],h=host();if(!cfg||!h||!openN(n))return;
 removeOlder(n,h);
 var sec=document.createElement('section');
 sec.className='v4-interaction v4-ai2-interaction';
 sec.setAttribute('data-v4-ai2-feature',String(n));
 sec.innerHTML='<div class="v4-interaction-head"><div><span class="v4-eyebrow">ASISTEN OMODOS • DARI DATA TERCATAT</span><h3>'+esc(cfg.title)+'</h3></div><span class="v4-no-write">Tidak menyimpan otomatis</span></div>'+
  intro(n)+controls(n,cfg)+buttons(n)+'<div data-v4-ai2-out></div>';
 h.prepend(sec);
}
async function getBriefContext(machine,purpose){
 var preset=purpose==='shift'?'previousShift':purpose==='morning-brief'?'today':'';
 var payload=machine?{machine:machine}:{};
 var changes=null;
 if(preset){
  changes=await read('v4.getWhatChanged',Object.assign({},payload,{preset:preset}));
  if(changes&&changes.range){
   payload.since=changes.range.since;
   payload.until=changes.range.until;
  }
 }
 var d=await read('v4.getBrief',payload);
 if(d&&changes&&changes.range){
  d.__v4Period={
   purpose:purpose,
   since:changes.range.since||'',
   until:changes.range.until||'',
   shift:changes.range.shift||'',
   preset:changes.range.preset||''
  };
 }
 return d||null;
}
function briefHtml(d){
 if(!d)return '';
 var s=Array.isArray(d.summary)?d.summary:[];
 var look=Array.isArray(d.thingsToLookAt)?d.thingsToLookAt:[];
 var conf={high:'Kuat',medium:'Sedang','low-medium':'Terbatas',low:'Rendah'}[String(d.confidence||'').toLowerCase()]||d.confidence||'—';
 var p=d.__v4Period||null,periodNote='';
 if(p&&p.since&&p.until){
  var label=p.purpose==='shift'?'Shift sebelumnya'+(p.shift?' ('+p.shift+')':''):'Hari ini';
  periodNote=note(label+' • '+String(p.since).slice(0,16)+' s.d. '+String(p.until).slice(0,16),'safe');
 }
 return '<section class="v4-server-section"><div class="v4-server-section-head"><strong>Ringkasan Dasar dari Data</strong><span>Keyakinan '+esc(conf)+'</span></div>'+
 periodNote+
 (s.length?'<div class="v4-sf-list">'+s.slice(0,8).map(function(x){return '<div class="v4-sf-item"><div><strong>'+esc(x)+'</strong></div>'+chip('Tercatat / dihitung')+'</div>'}).join('')+'</div>':'')+
 (look.length?evidenceHtml(look,8):'')+'</section>';
}
function passportHtml(d){
 if(!d)return '';
 var c=d.currentCondition||{},r=d.reliability||{},k=d.knowledge||{},manual=k.manual||{};
 var hasManual=!!(manual.manualPdf||manual.reference);
 return '<section class="v4-server-section"><div class="v4-server-section-head"><strong>Data Mesin Terpilih</strong><span>'+esc(d.logicVersion||'')+'</span></div>'+
 '<div class="v4-statline"><div><b>'+esc(c.healthIndex==null?'—':c.healthIndex)+'</b><span>Nilai kesehatan</span></div><div><b>'+esc(c.currentRisk||'—')+'</b><span>Risiko saat ini</span></div><div><b>'+esc(r.failureCount==null?'—':r.failureCount)+'</b><span>Catatan kerusakan</span></div><div><b>'+esc(r.downtimeMinutes==null?'—':r.downtimeMinutes)+'</b><span>Menit berhenti</span></div></div>'+
 note(hasManual?'Referensi manual tercatat untuk mesin ini.':'Referensi manual belum tercatat pada daftar mesin.','safe')+
 '</section>';
}
function similarityHtml(d){
 if(!d)return '';
 var hits=Array.isArray(d.hits)?d.hits:[];
 return '<section class="v4-server-section"><div class="v4-server-section-head"><strong>Kasus Lama yang Mirip</strong><span>Tingkat keyakinan: '+esc(d.confidence||'')+'</span></div>'+
 evidenceHtml(hits,18)+note(d.note||'Kemiripan membantu menemukan bukti lama, bukan bukti bahwa akar penyebabnya sama.','warn')+'</section>';
}
function candidateHtml(d){
 var rows=d&&Array.isArray(d.candidates)?d.candidates:[];
 var head='<div class="v4-interaction-result-head"><span>'+rows.length+' kandidat</span><span>Artikel yang ada: '+esc(d&&d.existingKnowledgeRecords==null?'—':d.existingKnowledgeRecords)+'</span></div>';
 var body=rows.length?'<div class="v4-sf-list">'+rows.slice(0,60).map(function(x){
  var sourceIds=Array.isArray(x.sourceIds)&&x.sourceIds.length?' • ID sumber '+x.sourceIds.slice(0,5).join(', '):'';
  var sub=(x.machine||'Mesin belum tercatat')+' • Berulang '+fmt(x.recurrence,0)+'x • '+(x.problem||'Masalah belum tercatat')+
   (x.mostRecordedAction?' • Tindakan yang sering tercatat: '+x.mostRecordedAction:'')+sourceIds;
  return '<div class="v4-sf-item"><div><strong>'+esc('Calon artikel pengetahuan')+'</strong><small>'+esc(sub)+'</small></div>'+chip(x.existingKnowledgePossibleMatch?'Periksa artikel yang ada':'Belum disimpan')+'</div>';
 }).join('')+'</div>':empty('Belum ada kandidat pengetahuan dari kasus berulang yang sudah diselesaikan atau RCA.');
 return head+body+note(d&&d.note||'Periksa Pengetahuan yang sudah ada lebih dulu agar tidak membuat duplikat.','warn');
}
async function run78(sec,out){
 var d=await read('v4.getKnowledgeCandidates',{});
 if(!d)throw new Error('Data kandidat pengetahuan belum tersedia.');
 out.innerHTML=candidateHtml(d);
}
async function run72(sec,out,q,m){
 var passport=await read('v4.getMachinePassport',{machine:m});
 var ai=await action('v4.aiAsk',{query:q,purpose:'machine',machine:m});
 out.innerHTML=passportHtml(passport)+aiHtml(ai);
}
async function run73or74(n,sec,out,q,m){
 var purpose=AI2_CFG[n].purpose;
 var brief=await getBriefContext(m,purpose);
 var ai=await action('v4.aiAsk',{query:q,purpose:purpose,machine:m||''});
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
 if(cfg.machine==='required'&&!m){out.innerHTML=note('Pilih satu mesin agar bukti data tidak bercampur.','warn');return}
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
function mediaRefs(raw){
 var out=[];
 function add(v){
  if(v==null||v==='')return;
  if(Array.isArray(v)){v.forEach(add);return}
  if(typeof v==='object'){
   ['url','src','downloadUrl','download_url','webViewLink','webContentLink','fileUrl','link'].forEach(function(k){if(v[k])add(v[k])});
   return;
  }
  var t=String(v).trim();if(!t)return;
  if(/^https?:\/\//i.test(t)||t.indexOf('/')===0){out.push(t);return}
  try{add(JSON.parse(t))}catch(e){}
 }
 add(raw);
 return Array.from(new Set(out)).slice(0,4);
}
function mediaButtons(raw,label){
 var refs=mediaRefs(raw);
 if(!refs.length)return '';
 return refs.map(function(url,i){
  return '<a class="btn btn-sm" href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">'+esc(label)+(refs.length>1?' '+(i+1):'')+'</a>';
 }).join('');
}
function statusLabel(v){var s=String(v||'').trim(),u=s.toUpperCase();var m={OPEN:'Terbuka',CLOSED:'Selesai',COMPLETED:'Selesai',DONE:'Selesai','IN PROGRESS':'Berjalan',PROGRESS:'Berjalan',MONITORING:'Dipantau',DRAFT:'Draf'};return m[u]||s||'—'}
function typeLabel(v){var s=String(v||'').trim();return s==='Factory Project'?'Proyek':s==='Improvement'?'Perbaikan':s||'Perbaikan'}
function priorityLabel(v){var u=String(v||'').toUpperCase();return u==='P1'?'Perlu ditinjau dulu':u==='P2'?'Dapat ditinjau':u==='P0'?'Sangat mendesak':u==='P3'?'Rendah':String(v||'Periksa')}
function coverageLabel(v){var u=String(v||'').toUpperCase();return u==='POSSIBLE_MATCH'?'Ada perbaikan terkait':u==='NO_MACHINE_NAME_MATCH'?'Belum ditemukan perbaikan terkait':String(v||'')}
function relationLabel(v){var s=String(v||'terkait'),u=s.toLowerCase();var m={uses:'memakai',experienced:'mengalami',investigated_by:'ditangani oleh',resolved_by:'diselesaikan oleh',explained_by:'dijelaskan oleh',created:'menghasilkan',targets:'menargetkan',impacts:'memengaruhi',supplied_by:'dipasok oleh',linked_to:'terkait dengan',has:'memiliki',relates_to:'terkait dengan'};return m[u]||s.replace(/_/g,' ')}
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
 try{
  if(window.OMODOS4&&typeof window.OMODOS4.getMachineNames==='function')return window.OMODOS4.getMachineNames();
 }catch(e){}
 var set=new Set();
 try{(Array.isArray(MACHINES)?MACHINES:[]).forEach(function(m){var n=m['Nama Mesin']||m.namaMesin||m['Kode Mesin']||m.kodeMesin;if(n)set.add(String(n))})}catch(e){}
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
 81:'Mencari masalah berulang atau kerugian yang belum terlihat ditangani oleh perbaikan yang masih terbuka. Hasilnya hanya kandidat untuk diperiksa.',
 82:'Fitur ini hanya membuat draf Kaizen dari bukti data. Penyimpanan tetap melalui halaman Kaizen atau Project setelah diperiksa manusia.',
 83:'Pemeriksaan manfaat hanya mengecek kelengkapan bukti yang tercatat. Kelengkapan data bukan bukti bahwa manfaat finansial atau operasional sudah benar-benar terjadi.',
 84:'Menampilkan kondisi sebelum dan sesudah Kaizen yang benar-benar tercatat, tanpa membuat foto atau hasil baru.',
 85:'Mengumpulkan ide perbaikan yang masih terbuka agar mudah ditelusuri tanpa menggandakan catatan.',
 86:'Kemiripan hanya menandai kemungkinan isi yang sama. Sistem tidak boleh menyatakan dua Kaizen sebagai duplikat secara otomatis.',
 87:'Menonjolkan project yang terlambat atau masih terbuka dari data yang ada. Keputusan eskalasi tetap dibuat manusia.',
 88:'Ringkasan SGA hanya memakai data SGA yang tercatat dan tidak mengarang hasil.',
 89:'Peta hubungan memakai data Project, Kaizen, SGA, mesin, masalah, dan pengetahuan yang sudah ada.',
 90:'Riwayat perbaikan dikelompokkan per tahun untuk melihat perjalanan pekerjaan, bukan memberi peringkat tim.'
 };
 return note(t[n]||'Informasi hanya untuk dilihat.','safe');
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
  81:'Peluang Perbaikan',82:'Buat Draf Kaizen',83:'Cek Bukti Manfaat Project',84:'Lihat Sebelum & Sesudah Kaizen',85:'Kumpulan Ide Perbaikan',
  86:'Cari Kaizen yang Mirip',87:'Proyek yang Perlu Perhatian',88:'Cerita SGA',89:'Hubungan Pengetahuan Perbaikan',90:'Riwayat Perbaikan'
 };
 var sec=document.createElement('section');sec.className='v4-interaction v4-improvement-intel';sec.setAttribute('data-v4-imp-feature',String(n));
 sec.innerHTML='<div class="v4-interaction-head"><div><span class="v4-eyebrow">PERBAIKAN & KAIZEN</span><h3>'+esc(titles[n])+'</h3></div><span class="v4-no-write">'+(n===82?'Belum disimpan':'Tidak mengubah data')+'</span></div>'+
 intro(n)+controls(n)+
 '<div class="v4-interaction-actions"><button class="btn btn-primary btn-sm" data-v4-imp-load="'+n+'"><i class="ph-bold '+(n===82?'ph-sparkle':'ph-arrows-clockwise')+'"></i> '+(n===82?'Buat draf Kaizen':'Tampilkan data')+'</button>'+
 '<button class="btn btn-sm" data-v4-open-existing="project-center"><i class="ph-bold ph-kanban"></i> Buka Proyek</button>'+
 (n===84||n===85||n===88?'<button class="btn btn-sm" data-v4-open-existing="knowledge"><i class="ph-bold ph-books"></i> Buka Pengetahuan</button>':'')+
 '</div><div data-v4-imp-out></div>';
 h.prepend(sec);
}
function render81(d){
 var c=d.counts||{};
 return metrics([['Project',fmt(c.project,0)],['Kaizen',fmt(c.kaizen,0)],['SGA',fmt(c.sga,0)],['Masih terbuka',fmt(c.open,0)]])+
 list(d.opportunityRadar,function(x){
  return item(x.machine||'Mesin','Nilai kesehatan '+fmt(x.healthIndex,0)+' • Masalah berulang '+fmt(x.recurring,0)+' • Waktu berhenti '+fmt(x.downtimeMinutes,0)+' menit • Belum selesai '+fmt(x.openIssues,0)+' • '+(x.reason||''),chip(priorityLabel(x.priority)+' • '+coverageLabel(x.existingImprovementCoverage)));
 },50)+note('Nama mesin tidak ditemukan pada catatan perbaikan yang masih terbuka. Periksa ide serupa sebelum membuat catatan baru.','warn');
}
function aiHtml(d){
 d=d||{};
 var ev=Array.isArray(d.evidence)?d.evidence:[];
 var assumptions=Array.isArray(d.assumptions)?d.assumptions:[];
 var mode={GENERATIVE_WITH_INTERNAL_EVIDENCE:'Draf dari Asisten OMODOS',DETERMINISTIC_FALLBACK:'Draf dari data tercatat'}[d.mode]||'Draf Asisten OMODOS';
 return '<div class="v4-ai-result"><div class="v4-interaction-result-head"><span class="v4-server-badge">'+esc(mode)+'</span><span>Tingkat keyakinan: '+esc(d.confidence||'belum tersedia')+'</span></div>'+
 '<div class="v4-ai-answer">'+esc(first(d,['summary','answer'])||'Belum ada draf.').replace(/\n/g,'<br>')+'</div>'+
 (assumptions.length?'<div class="v4-assumptions"><strong>Asumsi / batasan</strong><ul>'+assumptions.slice(0,8).map(function(x){return '<li>'+esc(x)+'</li>'}).join('')+'</ul></div>':'')+
 metrics([['Bukti data',fmt(ev.length,0)],['Persetujuan manusia','Wajib'],['Perubahan data operasional','Tidak ada']])+
 note('Draf belum tersimpan sebagai Kaizen atau proyek. Periksa isinya sebelum menyimpan lewat halaman asal.','warn')+'</div>';
}
async function render82(sec){
 var q=val(sec,'[data-v4-imp-query]'),m=val(sec,'[data-v4-imp-machine]');
 if(!q)return note('Isi masalah atau peluang terlebih dahulu.','warn');
 var d=await act('v4.aiAsk',{query:q,purpose:'kaizen-draft',machine:m||''});
 return aiHtml(d);
}
function render83(d){
 return list(d.benefitEvidence,function(x){
  var cost=(x.budget!=null&&String(x.budget)!=='')?'Budget '+x.budget:'Budget —';
  if(x.actualCost!=null&&String(x.actualCost)!=='')cost+=' • Actual '+x.actualCost;
  return item(x.title||x.id||'Proyek','Status '+statusLabel(x.status)+' • '+cost+' • Bukti terisi '+fmt(x.evidenceFields,0)+'/'+fmt(x.totalEvidenceFields,0),chip(fmt(x.evidenceCoverage,0)+'% bukti terisi'));
 },80)+note('Pemeriksaan ini hanya melihat apakah bagian laporan sudah diisi. Besarnya manfaat tetap perlu diperiksa.','warn');
}
function render84(d){
 return list(d.beforeAfterTimeline,function(x){
  var detail=[x.date||'Tanggal belum tercatat',x.machine||x.area||'Lokasi/mesin belum tercatat','Status '+statusLabel(x.status)];
  if(x.beforeAfter)detail.push('Catatan sebelum–sesudah: '+String(x.beforeAfter).slice(0,320));
  if(x.benefit)detail.push('Manfaat tercatat: '+String(x.benefit).slice(0,220));
  var buttons=mediaButtons(x.beforePhoto,'Buka foto sebelum')+mediaButtons(x.afterPhoto,'Buka foto sesudah');
  if(!buttons&&(x.beforePhoto||x.afterPhoto))buttons=chip('Referensi foto tercatat');
  if(!buttons)buttons=chip('Bukti teks');
  return item(x.theme||x.id||'Kaizen',detail.join(' • '),'<div class="v4-interaction-actions">'+buttons+'</div>');
 },80)+note('Isi sebelum–sesudah dan manfaat ditampilkan dari catatan Kaizen. Tombol foto hanya muncul bila field foto berisi URL yang dapat dibuka; referensi foto yang tidak berbentuk URL tidak direkayasa menjadi tautan.','safe');
}
function render85(d){
 return list(d.ideaMarketplace,function(x){
  var detail=typeLabel(x.type)+' • '+(x.area||x.machine||'')+' • PIC '+(x.pic||'—')+' • Status '+statusLabel(x.status)+(x.progress!==''&&x.progress!=null?' • Progres '+x.progress:'');
  var content=[x.problem?('Masalah: '+x.problem):'',x.idea?('Ide: '+x.idea):''].filter(Boolean).join(' • ');
  return item(x.title||x.id||typeLabel(x.type),detail+(content?' • '+content:''),chip('Catatan sudah ada'));
 },100)+note('Ini adalah daftar ide perbaikan yang masih terbuka.','safe');
}
async function render86(sec){
 var q=val(sec,'[data-v4-imp-query]'),m=val(sec,'[data-v4-imp-machine]');
 if(!q)return note('Isi ide, judul, atau masalah untuk mencari kemungkinan kemiripan.','warn');
 var query=(m?m+' ':'')+q,d=await read('v4.findSimilarImprovement',{query:query});
 if(!d)return empty('Pencarian kemiripan belum tersedia.');
 return list(d.hits,function(x){
  return item(x.title||typeLabel(x.type),typeLabel(x.type)+' • '+(x.machine||x.area||'')+' • Status '+statusLabel(x.status),chip(Math.round(Number(x.score||0)*100)+'% mirip'));
 },40,'Tidak ada kemiripan yang berarti dari teks saat ini.')+note(d.note||'Kemungkinan kemiripan tetap perlu diperiksa manusia.','warn');
}
function render87(d){
 var c=d.counts||{};
 return metrics([['Terlambat',fmt(c.overdue,0)],['Perbaikan terbuka',fmt(c.open,0)]])+
 list(d.overdueProjects,function(r){
  var title=first(r,['Judul','Nama Project','Title','ID'])||'Project terlambat';
  var due=first(r,['Target Finish','Due Date','Deadline'])||'Due date tercatat';
  var status=first(r,['Status'])||'OPEN';
  var pic=first(r,['PIC','Project Leader'])||'PIC —';
  return item(title,'Target '+due+' • '+pic,chip(statusLabel(status)+' • Terlambat'));
 },60,'Tidak ada project terlambat berdasarkan tanggal target yang tercatat.')+
 note('Proyek ditandai terlambat jika tanggal target lewat dan statusnya belum selesai. Dampaknya perlu dinilai petugas.','safe');
}
function render88(d){
 return list(d.sgaStories,function(x){
  var team=x.team||'SGA';
  var members=x.members?' • Anggota '+x.members:'';
  var result=x.result||x.achievement||'Hasil belum tercatat';
  return item((x.theme||'Tema belum tercatat')+' — '+team,'Ketua '+(x.leader||'—')+members+' • Target '+(x.target||'—')+' • Progres '+(x.progress||'—')+' • Hasil: '+result,chip(statusLabel(x.status||'Tercatat')));
 },80)+note('Ringkasan hanya memakai hasil yang benar-benar dicatat; bagian kosong tidak dianggap berhasil.','safe');
}
async function render89(){
 var g=await read('v4.getFactoryBrain',{maxMachines:60});
 if(!g)return empty('Peta hubungan data belum tersedia.');
 var allowed=new Set(['project','kaizen','sga','machine','failure','symptom','knowledge','manual','rca','corrective_action']);
 var nodes=(g.nodes||[]).filter(function(n){return allowed.has(String(n.type||''))});
 var ids=new Set(nodes.map(function(n){return n.id}));
 var edges=(g.edges||[]).filter(function(e){return ids.has(e.from)&&ids.has(e.to)});
 var by={};nodes.forEach(function(n){by[n.type]=(by[n.type]||0)+1});
 var top=edges.slice(0,80);
 return metrics([
  ['Titik data',fmt(nodes.length,0)],['Hubungan',fmt(edges.length,0)],['Project',fmt(by.project,0)],
  ['Kaizen',fmt(by.kaizen,0)],['SGA',fmt(by.sga,0)],['Pengetahuan/RCA',fmt((by.knowledge||0)+(by.manual||0)+(by.rca||0),0)]
 ])+
 list(top,function(e){
  var from=nodes.find(function(n){return n.id===e.from}),to=nodes.find(function(n){return n.id===e.to});
  return item((from&&from.label||e.from)+' → '+(to&&to.label||e.to),relationLabel(e.relation),chip('Data terkait'));
 },80)+note('Peta ini menghubungkan catatan yang sudah ada sejak 1 September 2026.','safe');
}
function render90(d){
 return list(d.improvementLegacy,function(x){
  return item(String(x.year||'Tidak diketahui'),'Proyek '+fmt(x.projects,0)+' • Kaizen '+fmt(x.kaizen,0)+' • SGA '+fmt(x.sga,0)+' • Selesai '+fmt(x.completed,0),chip(fmt((x.records||[]).length,0)+' contoh catatan'));
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
  if(!d){out.innerHTML=empty('Data perbaikan belum tersedia.');return}
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
function priorityLabel(v){var u=String(v||'').toUpperCase();return u==='P0'?'Sangat mendesak':u==='P1'?'Perlu ditinjau':u==='P2'?'Terjadwal':u==='P3'?'Rendah':String(v||'Periksa')}
function statusLabel(v){var s=String(v||'').trim(),u=s.toUpperCase();var m={OPEN:'Terbuka',CLOSED:'Selesai',COMPLETED:'Selesai',DONE:'Selesai',MONITORING:'Dipantau',NORMAL:'Normal',OK:'Normal',DERIVED:'Dihitung dari data',RECORDED:'Tercatat','NOT AVAILABLE':'Belum tersedia','LAST_RECORDED_EVENT_CLOSED':'Catatan terakhir selesai','LAST_RECORDED_EVENT_OPEN':'Catatan terakhir masih terbuka'};return m[u]||s.replace(/_/g,' ')||'Tercatat'}
function confidenceLabel(v){var u=String(v||'').trim().toUpperCase();return {HIGH:'Kuat',MEDIUM:'Sedang','LOW-MEDIUM':'Terbatas',LOW:'Rendah'}[u]||String(v||'—')}
function periodLabel(v){var u=String(v||'').trim().toUpperCase();return {TODAY:'Hari ini',YESTERDAY:'Kemarin',PREVIOUS_SHIFT:'Shift sebelumnya',PREVIOUS_LOGIN:'Sejak login sebelumnya',CUSTOM:'Periode dipilih',SELECTED:'Periode dipilih',PILIHAN:'Periode dipilih'}[u]||String(v||'Periode dipilih').replace(/_/g,' ')}
function categoryLabel(v){var u=String(v||'').trim().toLowerCase();return {machine:'Mesin',logbook:'Logbook',breakdown:'Gangguan mesin',predictive:'Temuan prediktif',sparepart:'Sparepart',kpi:'KPI',project:'Proyek',people:'Teknisi',energy:'Energi',ipal:'IPAL'}[u]||String(v||'Data').replace(/_/g,' ')}
function plainBriefText(v){return String(v||'').replace(/P0\/P1/g,'prioritas sangat mendesak / perlu ditinjau')}
function relationLabel(v){var s=String(v||'terkait'),u=s.toLowerCase();var m={uses:'memakai',experienced:'mengalami',investigated_by:'ditangani oleh',resolved_by:'diselesaikan oleh',explained_by:'dijelaskan oleh',created:'menghasilkan',targets:'menargetkan',impacts:'memengaruhi',supplied_by:'dipasok oleh',linked_to:'terkait dengan',has:'memiliki',relates_to:'terkait dengan'};return m[u]||s.replace(/_/g,' ')}
function sourceLabel(v){var s=String(v||'Sumber OMODOS');var m={Logbook:'Logbook',Breakdown:'Gangguan mesin',Predictive:'Temuan prediktif',RCA:'RCA',Corrective:'Tindakan perbaikan',Project:'Proyek',Kaizen:'Kaizen',SGA:'SGA',Knowledge:'Pengetahuan',Sparepart:'Sparepart',KPI:'KPI'};return m[s]||s.replace(/_/g,' ')}
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
 try{
  if(window.OMODOS4&&typeof window.OMODOS4.getMachineNames==='function')return window.OMODOS4.getMachineNames();
 }catch(e){}
 var set=new Set();
 try{(Array.isArray(MACHINES)?MACHINES:[]).forEach(function(m){var n=m['Nama Mesin']||m.namaMesin||m['Kode Mesin']||m.kodeMesin;if(n)set.add(String(n))})}catch(e){}
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
  91:'Gambaran Pabrik dari Data',92:'Pantau Risiko Maintenance',93:'Apa yang Berubah?',94:'Lihat Kondisi Masa Lalu',95:'Rekaman Kejadian Maintenance',
  96:'Peta Hubungan Pengetahuan',99:'Saran Tugas Maintenance',100:'Ringkasan Besar OMODOS'
 }[n]||'Ringkasan Pabrik';
}
function intro(n){
 var t={
  91:'Gambaran ini menunjukkan hubungan data maintenance yang tercatat. Ini bukan simulasi fisik mesin dan bukan data sensor real-time yang tidak tersedia.',
  92:'Pantau risiko memfilter ringkasan risiko berdasarkan periode dan mesin agar perhatian tidak bercampur dengan area lain. Tidak ada tindakan operasional otomatis.',
  93:'Membandingkan catatan yang benar-benar masuk pada periode terpilih dan tetap menunjukkan asal datanya.',
  94:'Menyusun kembali kondisi terbaik yang dapat diketahui dari catatan bertanggal. Data yang hanya menggambarkan kondisi saat ini tidak dipaksakan ke masa lalu.',
  95:'Menyusun urutan kejadian dari Logbook, Breakdown, Predictive, RCA, dan Corrective yang memiliki waktu. Kejadian yang tidak dicatat tidak akan ditebak.',
  96:'Peta pengetahuan menghubungkan data OMODOS yang sudah ada. Peta ini bukan sumber data baru.',
  99:'Fitur ini menyusun saran tugas untuk diperiksa manusia. Tidak ada penulisan data, kendali mesin, atau keputusan otomatis.',
  100:'Ringkasan besar menggabungkan peta hubungan, risiko, dan ringkasan data untuk membantu manusia mengambil keputusan.'
 };
 return note(t[n]||'Informasi hanya untuk dilihat.','safe');
}
function controls(n){
 if(n===93)return '<div class="v4-form-grid"><label>Periode<select data-v4-fb-change><option value="24h">24 jam terakhir</option><option value="7d">7 hari terakhir</option><option value="yesterday">Kemarin</option><option value="previousShift">Shift sebelumnya</option><option value="previousLogin">Sejak login sebelumnya</option></select></label><label>Mesin (opsional)<select data-v4-fb-machine>'+machineOptions('Semua mesin')+'</select></label></div>';
 if(n===94){
  var now=new Date(),local=new Date(now.getTime()-now.getTimezoneOffset()*60000).toISOString().slice(0,16);
  return '<div class="v4-form-grid"><label>Tanggal & waktu<input type="datetime-local" min="2026-09-01T00:00" value="'+esc(local)+'" data-v4-fb-time></label><label>Mesin (opsional)<select data-v4-fb-machine>'+machineOptions('Semua mesin')+'</select></label><label>Shift (opsional)<select data-v4-fb-shift><option value="">Semua shift</option><option value="1">Shift 1</option><option value="2">Shift 2</option><option value="3">Shift 3</option></select></label></div>';
 }
 if(n===92||n===95||n===99)return '<div class="v4-form-grid"><label>Mesin (opsional)<select data-v4-fb-machine>'+machineOptions('Semua mesin')+'</select></label><label>Periode<select data-v4-fb-days><option value="30"'+(n===92?' selected':'')+'>30 hari</option><option value="90"'+(n!==92?' selected':'')+'>90 hari</option><option value="180">180 hari</option><option value="365">365 hari</option></select></label></div>';
 return '';
}
function mount(n){
 n=Number(n);
 if(n===97||n===98)return;
 if(![91,92,93,94,95,96,99,100].includes(n))return;
 var h=host();if(!h||!openN(n))return;
 removeOld(n,h);
 var sec=document.createElement('section');sec.className='v4-interaction v4-factory-brain-intel';sec.setAttribute('data-v4-fb-feature',String(n));
 sec.innerHTML='<div class="v4-interaction-head"><div><span class="v4-eyebrow">RINGKASAN PABRIK • DARI DATA OMODOS</span><h3>'+esc(titles(n))+'</h3></div><span class="v4-no-write">Tidak mengubah data</span></div>'+
 intro(n)+controls(n)+
 '<div class="v4-interaction-actions"><button class="btn btn-primary btn-sm" data-v4-fb-load="'+n+'"><i class="ph-bold ph-arrows-clockwise"></i> '+esc(({91:'Tampilkan gambaran',92:'Tampilkan risiko',93:'Lihat perubahan',94:'Lihat kondisi',95:'Tampilkan kejadian',96:'Tampilkan hubungan',99:'Tampilkan saran tugas',100:'Tampilkan ringkasan besar'})[n]||'Tampilkan data')+'</button>'+
 (n===92||n===100?'<button class="btn btn-sm" data-v4-open-copilot><i class="ph-bold ph-brain"></i> Buka Copilot</button>':'')+
 '</div><div data-v4-fb-out></div>';
 h.prepend(sec);
}
function graphSummary(g,labelText){
 if(!g)return empty('Peta hubungan data belum tersedia.');
 var nodes=Array.isArray(g.nodes)?g.nodes:[],edges=Array.isArray(g.edges)?g.edges:[],d=g.domains||{};
 var by={};nodes.forEach(function(n){by[n.type]=(by[n.type]||0)+1});
 return metrics([
  ['Titik data',fmt(nodes.length,0)],['Hubungan',fmt(edges.length,0)],['Mesin',fmt(d.machines,0)],['Logbook',fmt(d.logbook,0)],
  ['RCA',fmt(d.rca,0)],['Pengetahuan',fmt(d.knowledge,0)],['Project',fmt((d.projects||0)+(d.kaizen||0)+(d.sga||0),0)]
 ])+
 list(edges,function(e){
  var from=nodes.find(function(n){return n.id===e.from}),to=nodes.find(function(n){return n.id===e.to});
  return item((from&&from.label||e.from)+' → '+(to&&to.label||e.to),relationLabel(e.relation),chip('Data terkait'));
 },50)+note(labelText||'Peta hanya menghubungkan bukti data yang tersedia.','safe');
}
function render91(g){
 if(!g)return empty('Gambaran pabrik belum tersedia.');
 var d=g.domains||{},nodes=Array.isArray(g.nodes)?g.nodes:[],edges=Array.isArray(g.edges)?g.edges:[];
 var relations={};edges.forEach(function(e){var k=e.relation||'terkait';relations[k]=(relations[k]||0)+1});
 var relRows=Object.keys(relations).map(function(k){return {name:k,count:relations[k]}}).sort(function(a,b){return b.count-a.count}).slice(0,12);
 return metrics([
  ['Mesin',fmt(d.machines,0)],['Logbook',fmt(d.logbook,0)],['Prediktif',fmt(d.predictive,0)],['RCA',fmt(d.rca,0)],
  ['Perbaikan',fmt(d.corrective,0)],['Pengetahuan',fmt(d.knowledge,0)],['Sparepart',fmt(d.stock,0)],['Proyek/Kaizen/SGA',fmt((d.projects||0)+(d.kaizen||0)+(d.sga||0),0)]
 ])+
 '<section class="v4-server-section"><div class="v4-server-section-head"><strong>Hubungan Data yang Paling Banyak</strong><span>'+fmt(edges.length,0)+' hubungan</span></div>'+
 list(relRows,function(x){return item(relationLabel(x.name),fmt(x.count,0)+' hubungan',chip('Data terkait'))},12)+'</section>'+
 note('Gambaran pabrik menunjukkan seberapa banyak data maintenance yang saling terhubung. Ini bukan simulasi fisik mesin dan bukan data sensor real-time.','safe');
}
function render92(o){
 if(!o)return empty('Pantauan risiko belum tersedia.');
 var s=o.summary||{},look=Array.isArray(o.thingsToLookAt)?o.thingsToLookAt:[],
     p0=look.filter(function(x){return String(x.priority||'').toUpperCase()==='P0'}),
     p1=look.filter(function(x){return String(x.priority||'').toUpperCase()==='P1'}),
     other=look.filter(function(x){var p=String(x.priority||'').toUpperCase();return p!=='P0'&&p!=='P1'}),
     sources=Array.isArray(o.sourceStatus)?o.sourceStatus:[],
     r=o.range||{};
 return metrics([
  ['Mesin perlu perhatian',fmt(s.criticalMachines,0)],['Gangguan aktif',fmt(s.activeBreakdown,0)],['Risiko prediktif',fmt(s.predictiveRisks,0)],
  ['Risiko sparepart',fmt(s.sparepartRisks,0)],['KPI perlu perhatian',fmt(s.kpiAtRisk,0)],['Tindakan penting belum selesai',fmt(s.openHighPriorityActions,0)]
 ])+
 '<section class="v4-server-section"><div class="v4-server-section-head"><strong>Sangat mendesak</strong><span>'+fmt(p0.length,0)+' catatan</span></div>'+
 list(p0,function(x){return item(x.title||x.type,x.reason||'',chip('Sangat mendesak'))},20,'Tidak ada risiko sangat mendesak pada pilihan ini.')+'</section>'+
 '<section class="v4-server-section"><div class="v4-server-section-head"><strong>Perlu ditinjau</strong><span>'+fmt(p1.length,0)+' catatan</span></div>'+
 list(p1,function(x){return item(x.title||x.type,x.reason||'',chip('Perlu ditinjau'))},30,'Tidak ada risiko yang perlu ditinjau pada pilihan ini.')+'</section>'+
 (other.length?'<section class="v4-server-section"><div class="v4-server-section-head"><strong>Catatan lain</strong><span>'+fmt(other.length,0)+'</span></div>'+
 list(other,function(x){return item(x.title||x.type,x.reason||'',chip(priorityLabel(x.priority)))},20)+'</section>':'')+
 '<section class="v4-server-section"><div class="v4-server-section-head"><strong>Sumber data yang dipakai</strong><span>'+fmt(sources.length,0)+' sumber</span></div>'+
 list(sources,function(x){return item(sourceLabel(x.sheet),fmt(x.records,0)+' catatan',chip(x.records>0?'Ada catatan':'Belum ada catatan'))},20,'Status sumber belum tersedia.')+'</section>'+
 note('Periode server: '+(r.since?String(r.since).slice(0,10):'—')+' sampai '+(r.until?String(r.until).slice(0,10):'—')+'. Tampilan ini hanya membantu triase risiko; penugasan pekerjaan ada di fitur Saran Tugas Maintenance.','warn');
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
 if(!d)return empty('Data perubahan belum tersedia.');
 var cats=d.categories||[];
 return metrics([['Kategori berubah',fmt(cats.length,0)],['Periode',periodLabel(first(d.range||{},['preset'])||'PILIHAN')],['Shift',first(d.range||{},['shift'])||'—']])+
 list(cats,function(x){
  var latest=Array.isArray(x.latest)?x.latest.length:0;
  return item(categoryLabel(x.category||sourceLabel(x.sheet)),sourceLabel(x.sheet)+' • Contoh terbaru '+latest,chip(fmt(x.count,0)+' catatan'));
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
 if(!d)return empty('Rekonstruksi kondisi masa lalu belum tersedia.');
 var s=d.snapshots||{},m=d.machineStatus||{},a=d.activeProblems||{},down=d.downtime||{};
 return metrics([
  ['Waktu',String(d.at||'—').replace('T',' ').slice(0,16)],['Logbook',fmt(snapshotCount(s.logbook),0)],['Gangguan',fmt(snapshotCount(s.breakdown),0)],
  ['Prediktif',fmt(snapshotCount(s.predictive),0)],['Proyek',fmt(snapshotCount(s.project),0)],['Masalah aktif',fmt((a.records||[]).length,0)],
  ['Kondisi mesin dari catatan',fmt((m.records||[]).length,0)],['Waktu berhenti',down.label==='NOT AVAILABLE'?'—':fmt(down.totalMinutes,0)+' menit']
 ])+
 list(m.records,function(x){
  return item(x.machine||'Mesin',(x.lastAt||'').replace('T',' ').slice(0,16),chip(statusLabel(x.derivedStatus||'DERIVED')));
 },50)+note(d.note||'Menampilkan kondisi masa lalu terbaik yang dapat disusun dari catatan yang tersedia.','warn');
}
function rangePayload(sec){
 var days=Number(val(sec,'[data-v4-fb-days]')||90),until=new Date(),since=new Date(until.getTime()-days*86400000),machine=val(sec,'[data-v4-fb-machine]');
 var p={since:since.toISOString(),until:until.toISOString()};if(machine)p.machine=machine;return p;
}
function render95(d){
 if(!d)return empty('Rekaman kejadian belum tersedia.');
 var s=d.summary||{};
 return metrics([['Kejadian',fmt(s.events,0)],['Mesin terdampak',fmt(s.affectedMachines,0)],['Waktu berhenti',fmt(s.downtimeMinutes,0)+' menit'],['Sumber data',fmt(Object.keys(s.sources||{}).length,0)]])+
 list(d.events,function(x){
  return item((x.machine||'Mesin tidak tercatat')+' • '+(x.event||'Kejadian tercatat'),(x.timestamp||'').replace('T',' ').slice(0,19)+' • '+sourceLabel(x.source)+' • Waktu berhenti '+fmt(x.downtimeMinutes,0)+' menit',chip(x.priority?priorityLabel(x.priority):statusLabel(x.status||'Tercatat')));
 },100)+note(d.note||'Urutan kejadian hanya dibuat dari catatan maintenance yang memiliki waktu.','safe');
}
function render96(g){
 if(!g)return empty('Peta hubungan pengetahuan belum tersedia.');
 var allNodes=Array.isArray(g.nodes)?g.nodes:[],allEdges=Array.isArray(g.edges)?g.edges:[];
 var allowed=new Set(['machine','failure','symptom','root_cause','rca','corrective_action','manual','knowledge','sop']);
 var nodes=allNodes.filter(function(n){return allowed.has(String(n.type||''))});
 var ids=new Set(nodes.map(function(n){return n.id}));
 var edges=allEdges.filter(function(e){return ids.has(e.from)&&ids.has(e.to)});
 var by={};nodes.forEach(function(n){by[n.type]=(by[n.type]||0)+1});
 return metrics([
  ['Mesin',fmt(by.machine,0)],['Masalah',fmt((by.failure||0)+(by.symptom||0),0)],['Akar penyebab',fmt(by.root_cause,0)],
  ['RCA',fmt(by.rca,0)],['Tindakan perbaikan',fmt(by.corrective_action,0)],['Manual & pengetahuan',fmt((by.manual||0)+(by.knowledge||0)+(by.sop||0),0)]
 ])+
 list(edges,function(e){
  var from=nodes.find(function(n){return n.id===e.from}),to=nodes.find(function(n){return n.id===e.to});
  return item((from&&from.label||e.from)+' → '+(to&&to.label||e.to),relationLabel(e.relation),chip('Hubungan pengetahuan'));
 },80,'Belum ada hubungan pengetahuan yang cukup.')+
 note('Fitur ini hanya menampilkan hubungan yang relevan dengan masalah, RCA, tindakan perbaikan, manual, dan pengetahuan. Data energi, KPI, vendor, dan biaya tidak dicampurkan ke sini.','safe');
}
function render99(d){
 if(!d)return empty('Saran tugas maintenance belum tersedia.');
 var missions=Array.isArray(d.missions)?d.missions:[],p0=missions.filter(function(x){return x.priority==='P0'}).length,
     p1=missions.filter(function(x){return x.priority==='P1'}).length,p2=missions.filter(function(x){return x.priority==='P2'}).length;
 return metrics([['Tugas sangat penting',fmt(p0,0)],['Tugas penting',fmt(p1,0)],['Tugas terjadwal',fmt(p2,0)],['Total mesin',fmt(missions.length,0)]])+
 list(missions,function(x){
  var checks=Array.isArray(x.checklist)?x.checklist.length:0,open=Array.isArray(x.openIssues)?x.openIssues.length:0;
  return item(x.machine||'Mesin',(x.reason||'Perlu pemeriksaan')+' • '+fmt(checks,0)+' hal yang diperiksa • '+fmt(open,0)+' masalah terbuka',chip(priorityLabel(x.priority)));
 },40,'Tidak ada tugas maintenance yang perlu disarankan dari data periode ini.')+
 note('Saran tugas diambil dari kondisi mesin, masalah terbuka, pola berulang, dan daftar pemeriksaan yang tersedia. Petugas tetap menentukan pekerjaan yang benar-benar dilakukan.','warn');
}
function briefBlock(b){
 if(!b)return '';
 var sum=Array.isArray(b.summary)?b.summary:[];
 return '<section class="v4-server-section"><div class="v4-server-section-head"><strong>Ringkasan Singkat</strong><span>Tingkat keyakinan: '+esc(confidenceLabel(b.confidence))+'</span></div>'+
 (sum.length?'<div class="v4-sf-list">'+sum.map(function(x){return item(plainBriefText(x),'',chip('Ringkasan'))}).join('')+'</div>':empty('Ringkasan belum tersedia.'))+'</section>';
}
function render100(g,o,b){
 var brain=graphSummary(g,'Ringkasan besar OMODOS membantu membaca data; seluruh hubungan tetap dihitung dari data yang sudah ada.');
 var s=o&&o.summary||{};
 var overview=metrics([
  ['Mesin perlu perhatian',fmt(s.criticalMachines,0)],['Gangguan aktif',fmt(s.activeBreakdown,0)],['Risiko sparepart',fmt(s.sparepartRisks,0)],
  ['KPI perlu perhatian',fmt(s.kpiAtRisk,0)],['Tindakan penting',fmt(s.openHighPriorityActions,0)]
 ]);
 return overview+briefBlock(b)+brain+note('Ringkasan ini membaca data yang ada dan tidak mengubah catatan pekerjaan secara otomatis.','warn');
}
async function load(btn,n){
 var sec=btn.closest('.v4-factory-brain-intel'),out=sec&&sec.querySelector('[data-v4-fb-out]');
 if(!sec||!out)return;
 busy(btn,true,'Memuat');
 try{
  if(n===91){out.innerHTML=render91(await read('v4.getFactoryBrain',{maxMachines:60}));return}
  if(n===92){out.innerHTML=render92(await read('v4.getOverview',rangePayload(sec)));return}
  if(n===93){out.innerHTML=render93(await read('v4.getWhatChanged',changePayload(sec)));return}
  if(n===94){
   var tp=timePayload(sec);if(!tp){out.innerHTML=note('Pilih tanggal & waktu yang valid.','warn');return}
   out.innerHTML=render94(await read('v4.getTimeMachine',tp));return
  }
  if(n===95){out.innerHTML=render95(await read('v4.getBlackBox',rangePayload(sec)));return}
  if(n===96){out.innerHTML=render96(await read('v4.getFactoryBrain',{maxMachines:80}));return}
  if(n===99){out.innerHTML=render99(await read('v4.getFieldMission',rangePayload(sec)));return}
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
 factoryBrainVersion:'2',
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
function riskText(v){
 var s=String(v==null?'':v).trim(),u=s.toUpperCase();
 var m={CRITICAL:'Kritis',HIGH:'Tinggi',MEDIUM:'Sedang',LOW:'Rendah',NORMAL:'Normal',OK:'Normal'};
 return m[u]||s||'—';
}
function confidenceText(v){
 var s=String(v==null?'':v).trim(),u=s.toUpperCase();
 var m={HIGH:'Kuat',MEDIUM:'Sedang',LOW:'Terbatas',VERY_LOW:'Sangat terbatas'};
 return m[u]||s||'—';
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
 try{
  if(window.OMODOS4&&typeof window.OMODOS4.getMachineNames==='function')return window.OMODOS4.getMachineNames();
 }catch(e){}
 var set=new Set();
 try{(Array.isArray(MACHINES)?MACHINES:[]).forEach(function(m){var n=m['Nama Mesin']||m.namaMesin||m['Kode Mesin']||m.kodeMesin;if(n)set.add(String(n))})}catch(e){}
 return Array.from(set).sort(function(a,b){return a.localeCompare(b,'id')});
}
function options(blank){
 return '<option value="">'+esc(blank||'Pilih mesin')+'</option>'+names().map(function(n){return '<option value="'+esc(n)+'">'+esc(n)+'</option>'}).join('');
}
function read(action,payload){
 if(!(window.OMODOS4&&typeof window.OMODOS4.serverRead==='function'))return Promise.resolve(null);
 return window.OMODOS4.serverRead(action,payload||{});
}
function machineRequired(n){return [1,3,4,5,6,7,8,9,10].indexOf(n)>=0}
function actionFor(n){
 if(n===2)return 'v4.getMachineHealth';
 if(n===3)return 'v4.getMachineGraph';
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
 8:'Membandingkan tekanan historis mesin per bulan: kejadian, gangguan, waktu berhenti, masalah terbuka, dan temuan prediktif.',
 9:'Menyusun ulang urutan kejadian mesin dari catatan Logbook, Breakdown, Predictive, RCA, dan Corrective.',
 10:'Menggabungkan kondisi terkini, masalah terbuka, dan hubungan data untuk satu mesin dalam satu tempat.',
 11:'Mengurutkan mesin berdasarkan sinyal risiko berbasis data yang tersedia. Ini bukan probabilitas kerusakan.',
 12:'Menampilkan mesin yang perlu diperiksa lebih dulu berdasarkan sinyal risiko dan bukti masalah.',
 13:'Mencari temuan predictive yang pernah muncul sebelum gangguan pada mesin yang sama.',
 14:'Menunjukkan mesin yang memiliki pola masalah berulang pada periode data yang dipakai.',
 15:'Mencari pola gangguan serupa yang muncul pada lebih dari satu mesin.',
 16:'Mencari kenaikan kejadian, waktu berhenti, atau masalah terbuka antara paruh awal dan paruh akhir periode.',
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
 var actionLabels={1:'Buka profil mesin',2:'Hitung nilai kesehatan',3:'Tampilkan hubungan data',4:'Tampilkan bagian mesin',5:'Tampilkan umur komponen',6:'Cari riwayat masalah',7:'Tampilkan kebiasaan mesin',8:'Tampilkan perubahan kondisi',9:'Putar ulang kejadian',10:'Buka pusat informasi',11:'Tampilkan risiko kerusakan',12:'Tampilkan peringatan dini',13:'Cari tanda sebelum rusak',14:'Tampilkan masalah berulang',15:'Bandingkan antar mesin',16:'Cari penurunan kondisi',17:'Tampilkan ciri kerusakan',18:'Tampilkan kekuatan bukti',19:'Hitung jarak penggantian',20:'Tampilkan bagian prioritas'};
 var controls='';
 if(showMachine)controls+='<label>Mesin '+(requireMachine?'<b>*</b>':'(opsional)')+'<select data-v4-mp-machine>'+options(requireMachine?'Pilih mesin':'Semua mesin')+'</select></label>';
 if(n===6)controls+='<label class="v4-form-wide">Masalah yang ingin dicari<input data-v4-mp-query placeholder="Opsional: contoh bearing panas, sensor error, kebocoran"></label>';
 sec.innerHTML='<div class="v4-interaction-head"><div><span class="v4-eyebrow">BERDASARKAN DATA OMODOS</span><h3>'+esc((window.OMODOS4&&window.OMODOS4.simpleFeatures&&window.OMODOS4.simpleFeatures[n]||{}).name||('Fitur '+n))+'</h3></div><span class="v4-no-write">Tidak mengubah data</span></div>'+
  '<p class="v4-muted">'+esc(intro(n))+'</p>'+
  (controls?'<div class="v4-form-grid">'+controls+'</div>':'')+
  '<div class="v4-interaction-actions"><button class="btn btn-primary btn-sm" data-v4-mp-load="'+n+'"><i class="ph-bold ph-magnifying-glass"></i> '+esc(actionLabels[n]||'Tampilkan data')+'</button></div>'+
  '<div data-v4-mp-output>'+note(requireMachine?'Pilih satu mesin, lalu tampilkan datanya.':'Data dapat ditampilkan tanpa mengubah catatan apa pun.')+'</div>';
 h.prepend(sec);
 if(!requireMachine&&n!==6)setTimeout(function(){var b=sec.querySelector('[data-v4-mp-load]');if(b)load(b,n)},0);
}
function evidenceText(e){
 if(!e||typeof e!=='object')return '';
 var parts=[];
 if(e.predictiveRecords!=null)parts.push(e.predictiveRecords+' temuan prediktif');
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
   metric('Nilai kesehatan',c.healthIndex==null?'Belum tersedia':fmt(c.healthIndex,0)+'/100',riskText(c.currentRisk)),
   metric('Gangguan tercatat',fmt(r.failureCount,0),'Riwayat gangguan'),
   metric('Waktu berhenti',fmt(r.downtimeMinutes,0)+' menit','Dari catatan yang tersedia'),
   metric('Masalah belum selesai',open.length,'Perlu diperiksa')
  ])+
  '<div class="v4-subcard"><h3>Identitas Mesin</h3><div class="v4-kv-stack">'+Object.keys(id).slice(0,12).map(function(k){return '<div><span>'+esc(k)+'</span><b>'+esc(id[k])+'</b></div>'}).join('')+'</div></div>'+
  list(open,function(x){return item(first(x,['Deskripsi Masalah','Problem','Deskripsi','description','Nama Mesin'])||'Catatan mesin',String(first(x,['Status','Severity','Prioritas'])||''),dateText(first(x,['Tanggal','Timestamp','Created At'])))},'Tidak ada masalah terbuka pada data yang tersedia.',12);
 }
 if(n===2){
  var ms=Array.isArray(d.machines)?d.machines:[];
  return list(ms,function(x){return item(x.code||x.name||x.key||'Mesin','Gangguan '+fmt(x.breakdowns,0)+' • waktu berhenti '+fmt(x.downtimeMinutes,0)+' menit • belum selesai '+fmt(x.openIssues,0),fmt(x.healthIndex,0)+'/100')},'Belum ada mesin yang dapat dihitung nilai kesehatannya.',40);
 }
 if(n===3){
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
function machineCenterHtml(passport,graph){
 passport=passport||{};graph=graph||{};
 var cond=passport.currentCondition||{},rel=passport.reliability||{},
     open=Array.isArray(cond.openIssues)?cond.openIssues:[],
     nodes=Array.isArray(graph.nodes)?graph.nodes:[],edges=Array.isArray(graph.edges)?graph.edges:[],
     counts={};
 nodes.forEach(function(x){var t=x.type||'lainnya';counts[t]=(counts[t]||0)+1});
 var out=metrics([
  metric('Nilai kesehatan',cond.healthIndex==null?'Belum tersedia':fmt(cond.healthIndex,0)+'/100',riskText(cond.currentRisk)),
  metric('Masalah belum selesai',open.length,'Perlu diperiksa'),
  metric('Data terhubung',nodes.length,'Catatan terkait mesin'),
  metric('Hubungan data',edges.length,'Koneksi antar catatan')
 ]);
 out+='<h3 class="v4-detail-heading">Yang Perlu Dilihat</h3>'+
  list(open,function(x){return item(first(x,['Deskripsi Masalah','Problem','Deskripsi','description'])||'Catatan masalah',String(first(x,['Status','Severity','Prioritas'])||''),dateText(first(x,['Tanggal','Timestamp','Created At'])))},'Tidak ada masalah terbuka pada mesin ini.',12);
 out+='<h3 class="v4-detail-heading">Data yang Terhubung</h3>'+
  (Object.keys(counts).length?'<div class="v4-kv-stack">'+Object.keys(counts).sort(function(a,b){return counts[b]-counts[a]}).map(function(k){return '<div><span>'+esc(k)+'</span><b>'+counts[k]+'</b></div>'}).join('')+'</div>':empty('Belum ada hubungan data lain yang tercatat untuk mesin ini.'));
 return out+note('Pusat informasi ini merangkum data yang sudah ada. Buka data asal bila perlu melihat rincian lengkap.');
}
function machineProblemHtml(d){
 d=d||{};
 var intel=d.intelligence||{},patterns=Array.isArray(intel.machinePersonality)?intel.machinePersonality:[],
     open=d.currentCondition&&Array.isArray(d.currentCondition.openIssues)?d.currentCondition.openIssues:[];
 return '<h3 class="v4-detail-heading">Pola Masalah yang Sering Muncul</h3>'+
  list(patterns,function(x){return item(x.description||'Pola masalah',fmt(x.count,0)+' kejadian','Terakhir '+dateText(x.last&&new Date(x.last).toISOString()))},'Belum ada pola berulang yang cukup pada mesin ini.',20)+
  '<h3 class="v4-detail-heading">Masalah yang Belum Selesai</h3>'+
  list(open,function(x){return item(first(x,['Deskripsi Masalah','Problem','Deskripsi','description'])||'Catatan masalah',String(first(x,['Status','Severity','Prioritas'])||''),dateText(first(x,['Tanggal','Timestamp','Created At'])))},'Tidak ada masalah terbuka pada mesin ini.',20);
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
 if(n===12)return list(q,function(x){return item(x.machine,(x.factors||[]).join(' • ')||evidenceText(x.evidence),riskText(x.risk))},'Tidak ada peringatan yang perlu diprioritaskan.',30);
 if(n===13)return list(pre,function(x){return item(x.pattern,fmt(x.count,0)+' kejadian pendahulu','Mesin: '+(x.machines||[]).slice(0,4).join(', '))},'Belum ada pola yang konsisten muncul sebelum gangguan.',30)+note('Hubungan waktu tidak membuktikan bahwa temuan tersebut menyebabkan gangguan.');
 if(n===14){
  var rec=risks.filter(function(x){return x.evidence&&Number(x.evidence.recurringPatterns)>0}).sort(function(a,b){return Number(b.evidence.recurringPatterns)-Number(a.evidence.recurringPatterns)});
  return list(rec,function(x){return item(x.machine,fmt(x.evidence.recurringPatterns,0)+' pola berulang',evidenceText(x.evidence))},'Belum ada masalah berulang yang cukup.',30);
 }
 if(n===15)return list(cross,function(x){return item(x.signature.replace(/\|/g,' • '),fmt(x.count,0)+' kejadian',(x.machines||[]).join(', '))},'Belum ada pola yang cukup mirip pada beberapa mesin.',30);
 if(n===16)return list(silent,function(x){return item(x.machine,'Awal: '+fmt(x.early&&x.early.events,0)+' kejadian • Akhir: '+fmt(x.late&&x.late.events,0)+' kejadian','skor perubahan '+fmt(x.deteriorationScore,0))},'Belum ada penurunan tersembunyi yang terdeteksi.',30)+note('Sinyal ini membandingkan dua bagian periode; tetap perlu pemeriksaan lapangan.');
 if(n===17)return list(sig,function(x){return item(x.machine,x.signature||'Belum ada ciri kata yang dominan',fmt(x.events,0)+' kejadian')},'Belum ada ciri khas gangguan yang cukup.',30);
 if(n===18)return list(risks,function(x){return item(x.machine,'Bukti: '+evidenceText(x.evidence),'Kekuatan bukti '+confidenceText(x.confidence))},'Belum ada sinyal risiko untuk dinilai.',40)+note('Tingkat keyakinan menunjukkan kelengkapan bukti yang tersedia, bukan kepastian prediksi.');
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
 var qText='';
 if(n===6){var q=sec.querySelector('[data-v4-mp-query]');qText=q&&q.value.trim()?q.value.trim():'';if(qText)payload.query=qText}
 var seq=++LAST_LOAD;
 btn.disabled=true;var old=btn.innerHTML;btn.innerHTML='<i class="ph-bold ph-spinner-gap v4-spin"></i> Memuat data';
 out.innerHTML=note('Mengambil data yang sesuai dengan fitur ini…');
 try{
  var d;
  if(n===10){
   var pair=await Promise.all([read('v4.getMachinePassport',payload),read('v4.getMachineGraph',payload)]);
   d=pair[0]||pair[1]?{passport:pair[0],graph:pair[1]}:null;
  }else d=await read(n===6&&!qText?'v4.getMachinePassport':actionFor(n),payload);
  if(seq!==LAST_LOAD||openNo()!==n)return;
  if(!d){out.innerHTML=note('Data server belum dapat dimuat. Coba muat ulang setelah sesi login aktif.','warn');return}
  out.innerHTML=n===10?machineCenterHtml(d.passport,d.graph):(n===6?(qText?failureHtml(d):machineProblemHtml(d)):(n<=9?machineHtml(n,d):predictiveHtml(n,d)));
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
 'READ ONLY':'Tidak mengubah data',
 'Tidak menyimpan otomatis':'DATA AMAN',
 'DRAFT ONLY':'Belum disimpan',
 'NOT A PREDICTION':'BUKAN RAMALAN',
 'ISOLATED V4 STATE':'Catatan koordinasi',
 'REVIEW ONLY':'Tidak menyimpan',
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


/* OFFSET_WAYS_MODULE_LOADER_V1 — isolated module; no changes to the login bootstrap */
(function(){
'use strict';
function loadOffsetWaysModule(){
  if(!document.getElementById('omodos-offset-ways-style')){
    var style=document.createElement('link');
    style.id='omodos-offset-ways-style';
    style.rel='stylesheet';
    style.href='/omodos4/offset-ways.css';
    document.head.appendChild(style);
  }
  if(document.getElementById('omodos-offset-ways-script')) return;
  var script=document.createElement('script');
  script.id='omodos-offset-ways-script';
  script.src='/omodos4/offset-ways.js';
  script.async=true;
  document.head.appendChild(script);
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',loadOffsetWaysModule,{once:true});
else loadOffsetWaysModule();
})();


/* PATROL_CHECKLIST_PHOTOS_AND_LOGBOOK_OTHER_AREA_V1 */
(function(){
'use strict';
function ready(fn){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fn,{once:true});else fn();}
function byId(id){return document.getElementById(id);}
function safeText(s){return String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
ready(function(){
  /* Logbook: let users save an area that is not listed in the master area list. */
  var category=byId('select-kategoriArea'), area=byId('select-namaArea');
  if(category&&area&&!byId('input-namaArea-lainnya')){
    var field=document.createElement('div');
    field.className='field';
    field.id='field-namaArea-lainnya';
    field.hidden=true;
    field.innerHTML='<label for="input-namaArea-lainnya">Nama area lainnya</label><input type="text" id="input-namaArea-lainnya" name="namaAreaLainnya" placeholder="Masukkan nama area..." autocomplete="off">';
    area.closest('.field').insertAdjacentElement('afterend',field);
  }
  var customArea=byId('input-namaArea-lainnya');
  var originalPopulate=window.populateWorkAreaOptions_;
  if(category&&area&&typeof originalPopulate==='function'&&!window.__omodosOtherAreaPopulateWrapped){
    window.__omodosOtherAreaPopulateWrapped=true;
    window.populateWorkAreaOptions_=function(cat,select,value){
      if(cat==='Lainnya'){
        select.innerHTML='<option value="">Pilih area...</option><option value="Lainnya">Lainnya</option>';
        select.value='Lainnya';
        if(customArea)customArea.value=value&&value!=='Lainnya'?String(value):customArea.value;
        return;
      }
      originalPopulate(cat,select,value);
      if(cat&&cat!==''){
        if(!Array.from(select.options).some(o=>o.value==='Lainnya'))select.insertAdjacentHTML('beforeend','<option value="Lainnya">Lainnya (isi nama area)</option>');
        if(value&&!Array.from(select.options).some(o=>o.value===value)){
          select.value='Lainnya';
          if(customArea)customArea.value=String(value);
        }
      }
    };
    category.insertAdjacentHTML('beforeend','<option value="Lainnya">Lainnya</option>');
  }
  function syncOtherArea(){
    if(!category||!area||!customArea)return;
    var isArea=byId('select-lokasiPekerjaan')&&byId('select-lokasiPekerjaan').value==='Area';
    var show=isArea&&(category.value==='Lainnya'||area.value==='Lainnya');
    var field=byId('field-namaArea-lainnya');
    if(field)field.hidden=!show;
    customArea.required=!!show;
    customArea.disabled=!show;
    if(show&&category.value==='Lainnya'&&area.value!=='Lainnya'){
      area.innerHTML='<option value="">Pilih area...</option><option value="Lainnya">Lainnya</option>';
      area.value='Lainnya';
    }
  }
  if(category&&area){
    category.addEventListener('change',function(){setTimeout(syncOtherArea,0);});
    area.addEventListener('change',syncOtherArea);
    var loc=byId('select-lokasiPekerjaan');if(loc)loc.addEventListener('change',function(){setTimeout(syncOtherArea,0);});
    var form=byId('form-entry');if(form)form.addEventListener('reset',function(){setTimeout(syncOtherArea,0);});
    var originalSync=window.syncLogbookLocationForm_;
    if(typeof originalSync==='function'&&!window.__omodosOtherAreaSyncWrapped){
      window.__omodosOtherAreaSyncWrapped=true;
      window.syncLogbookLocationForm_=function(){originalSync();syncOtherArea();};
    }
    var originalApply=window.applyLogbookLocationPayload_;
    if(typeof originalApply==='function'&&!window.__omodosOtherAreaApplyWrapped){
      window.__omodosOtherAreaApplyWrapped=true;
      window.applyLogbookLocationPayload_=function(entry){
        if(entry&&entry.lokasiPekerjaan==='Area'&&(entry.kategoriArea==='Lainnya'||entry.namaArea==='Lainnya')){
          var typed=(customArea&&customArea.value||'').trim();
          if(!typed)throw new Error('Masukkan nama area lainnya.');
          entry.namaArea=typed;
          entry.kodeMesin='-';entry.namaMesin='-';entry.namaUnit='-';
          entry.lokasi=entry.kategoriArea===entry.namaArea?entry.kategoriArea:entry.kategoriArea+' · '+entry.namaArea;
          return entry;
        }
        return originalApply(entry);
      };
    }
    syncOtherArea();
  }

  /* Patrol: one shared picker offers Camera and Gallery. Checklist photos become
     finding records tagged with the exact checklist category/index/item, so they
     travel through the existing compressed-file and backend attachment pipeline. */
  var checklistInput=byId('patrol-temuan-file-input');
  var checklistPreview=byId('patrol-temuan-file-preview');
  if(!checklistInput||window.__omodosChecklistPhotoPickerReady)return;
  window.__omodosChecklistPhotoPickerReady=true;
  var pendingCheckpoint=null;
  var picker=document.createElement('div');
  picker.id='omodos-patrol-photo-picker';
  picker.hidden=true;
  picker.innerHTML='<div class="omodos-patrol-picker-backdrop" data-picker-close></div><div class="omodos-patrol-picker-card" role="dialog" aria-modal="true" aria-labelledby="omodos-patrol-picker-title"><div id="omodos-patrol-picker-title" style="font-weight:700;font-size:16px;margin-bottom:6px">Tambah lampiran</div><div id="omodos-patrol-picker-sub" style="font-size:12px;color:var(--text-dim);margin-bottom:14px">Pilih sumber foto atau video.</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px"><button type="button" class="btn btn-primary" data-picker-camera><i class="ph-bold ph-camera"></i> Kamera</button><button type="button" class="btn btn-ghost" data-picker-gallery><i class="ph-bold ph-images"></i> Galeri</button></div><button type="button" class="btn btn-ghost" data-picker-close style="width:100%;margin-top:10px">Batal</button></div>';
  picker.style.cssText='position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:18px';
  picker.querySelector('.omodos-patrol-picker-backdrop').style.cssText='position:absolute;inset:0;background:rgba(0,0,0,.58)';
  picker.querySelector('.omodos-patrol-picker-card').style.cssText='position:relative;width:min(100%,380px);padding:18px;border:1px solid var(--line);border-radius:14px;background:var(--panel);box-shadow:0 18px 60px rgba(0,0,0,.3)';
  var cameraInput=document.createElement('input');cameraInput.type='file';cameraInput.accept='image/*';cameraInput.capture='environment';cameraInput.multiple=true;cameraInput.hidden=true;
  var galleryInput=document.createElement('input');galleryInput.type='file';galleryInput.accept='image/*,video/*';galleryInput.multiple=true;galleryInput.hidden=true;
  document.body.append(picker,cameraInput,galleryInput);
  function closePicker(){picker.hidden=true;cameraInput.value='';galleryInput.value='';}
  function openPicker(checkpoint){
    pendingCheckpoint=checkpoint||null;
    var sub=byId('omodos-patrol-picker-sub');
    if(sub)sub.textContent=checkpoint?'Lampirkan bukti untuk: '+checkpoint.item:'Lampiran untuk temuan di luar checklist.';
    picker.hidden=false;
  }
  picker.querySelectorAll('[data-picker-close]').forEach(function(b){b.addEventListener('click',closePicker);});
  picker.querySelector('[data-picker-camera]').addEventListener('click',function(){closePicker();cameraInput.click();});
  picker.querySelector('[data-picker-gallery]').addEventListener('click',function(){closePicker();galleryInput.click();});
  function routeFiles(fileList){
    var files=Array.from(fileList||[]);if(!files.length)return;
    var checkpoint=pendingCheckpoint;pendingCheckpoint=null;
    var transfer=new DataTransfer();files.forEach(function(f){transfer.items.add(f);});
    checklistInput.value='';
    checklistInput.files=transfer.files;
    checklistInput.dispatchEvent(new Event('change',{bubbles:true}));
    if(!checkpoint)return;
    var expected=files.length,started=Date.now(),lastCount=-1,stable=0;
    var poll=setInterval(function(){
      var count=(typeof PATROL_FINDING_FILES!=='undefined'&&PATROL_FINDING_FILES)?PATROL_FINDING_FILES.length:0;
      if(count===expected){stable++;if(stable>=2){clearInterval(poll);saveCheckpointFinding(checkpoint);return;}}
      else stable=0;
      if(count!==lastCount)lastCount=count;
      if(Date.now()-started>30000){clearInterval(poll);if(typeof toast==='function')toast('Foto belum selesai diproses. Silakan coba lagi.',true);}
    },150);
  }
  cameraInput.addEventListener('change',function(){routeFiles(cameraInput.files);});
  galleryInput.addEventListener('change',function(){routeFiles(galleryInput.files);});
  function checkpointBadge(checkpoint,files){
    var rows=document.querySelectorAll('#patrol-checklist-groups [data-kategori][data-idx]');
    rows.forEach(function(row){
      if(row.dataset.kategori!==checkpoint.category||String(row.dataset.idx)!==String(checkpoint.index))return;
      var outer=row.parentElement;
      var old=outer.parentElement.querySelector(':scope > .omodos-checkpoint-photo-note[data-for="'+CSS.escape(checkpoint.category+'|'+checkpoint.index)+'"]');
      if(old)old.remove();
      var note=document.createElement('div');note.className='omodos-checkpoint-photo-note';note.dataset.for=checkpoint.category+'|'+checkpoint.index;
      note.style.cssText='font-size:11px;color:var(--green);margin:-2px 0 9px 0;';
      note.textContent='📎 '+files.length+' lampiran tersimpan untuk titik checklist ini';
      outer.insertAdjacentElement('afterend',note);
    });
  }
  function saveCheckpointFinding(cp){
    var files=PATROL_FINDING_FILES.map(function(f){return {name:f.name,type:f._isVideo?'video':'image',viewUrl:f._localUrl,base64:f.base64,mimeType:f.mimeType};});
    if(!files.length)return;
    var existing=PATROL_STATE.findings.find(function(f){return f.source==='checklist'&&f.checklistCategory===cp.category&&String(f.checklistIndex)===String(cp.index);});
    if(existing){existing.files=(existing.files||[]).concat(files);existing.prioritas=cp.status==='abnormal'?'Tinggi':'Sedang';existing.checklistStatus=cp.status;}
    else PATROL_STATE.findings.push({id:'CHK-'+Date.now()+'-'+Math.floor(Math.random()*900+100),kategori:'Checklist Patrol',prioritas:cp.status==='abnormal'?'Tinggi':'Sedang',deskripsi:'Checklist '+cp.category+' — '+cp.item+' ('+(cp.status==='abnormal'?'Abnormal':'Warning')+')',status:'Open',source:'checklist',checklistCategory:cp.category,checklistIndex:cp.index,checklistItem:cp.item,checklistStatus:cp.status,files:files});
    PATROL_FINDING_FILES=[];
    if(checklistPreview)checklistPreview.innerHTML='';
    var desc=byId('patrol-temuan-deskripsi');if(desc)desc.value='';
    var yes=document.querySelector('[data-ada-temuan="ya"]');if(yes&&!yes.classList.contains('active'))yes.click();
    if(typeof renderPatrolFindingsInputList==='function')renderPatrolFindingsInputList();
    checkpointBadge(cp,files);
    if(typeof toast==='function')toast('Lampiran ditautkan ke titik checklist: '+cp.item+'.');
  }
  document.addEventListener('click',function(ev){
    var btn=ev.target.closest&&ev.target.closest('#patrol-checklist-groups .patrol-chk-btn');
    if(!btn)return;
    var status=btn.dataset.status;
    if(status!=='warning'&&status!=='abnormal')return;
    setTimeout(function(){
      var row=btn.closest('[data-kategori][data-idx]');
      if(!row)return;
      var itemNode=row.parentElement&&row.parentElement.firstElementChild;
      var item=itemNode?itemNode.textContent.trim():'Titik checklist';
      openPicker({category:row.dataset.kategori,index:row.dataset.idx,item:item,status:status});
    },0);
  },true);
  var bottomDrop=byId('patrol-temuan-file-drop');
  if(bottomDrop)bottomDrop.addEventListener('click',function(ev){
    if(ev.target===checklistInput)return;
    ev.preventDefault();ev.stopImmediatePropagation();openPicker(null);
  },true);
  var style=document.createElement('style');style.textContent='#omodos-patrol-photo-picker[hidden]{display:none!important}.omodos-checkpoint-photo-note{overflow-wrap:anywhere}@media(max-width:520px){#omodos-patrol-photo-picker .omodos-patrol-picker-card{padding:15px}}';
  document.head.appendChild(style);
});
})();


/* COPILOT_EXTERNAL_SEARCH_LINKS_V1 — make external AI research sources openable from Copilot output. */
(function(){
'use strict';
function inCopilot(node){
  var el=node&&node.parentElement;
  while(el&&el!==document.body){
    var id=String(el.id||'').toLowerCase();
    var cls=String(el.className&&el.className.baseVal||el.className||'').toLowerCase();
    if(/copilot|ai-internet|internet-research|external-ai/.test(id+' '+cls))return true;
    el=el.parentElement;
  }
  return false;
}
function linkifyTextNode(node){
  if(!node||node.nodeType!==Node.TEXT_NODE||!inCopilot(node))return;
  var text=node.nodeValue||'';
  if(!/https?:\/\//i.test(text)||node.parentElement&&node.parentElement.closest('a,button,script,style,textarea,input,select,option'))return;
  var re=/https?:\/\/[^\s<>"']+/gi,match,last=0,frag=document.createDocumentFragment(),changed=false;
  while((match=re.exec(text))){
    var raw=match[0],url=raw.replace(/[),.;!?]+$/,'');
    if(!url)continue;
    frag.appendChild(document.createTextNode(text.slice(last,match.index)));
    var a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener noreferrer';a.className='omodos-copilot-source-link';a.textContent=url;
    frag.appendChild(a);
    last=match.index+url.length;changed=true;
  }
  if(!changed)return;
  frag.appendChild(document.createTextNode(text.slice(last)));
  node.parentNode.replaceChild(frag,node);
}
function scan(root){
  if(!root)return;
  var containers=[];
  if(root.nodeType===1&&(/copilot|ai-internet|internet-research|external-ai/i.test(String(root.id||'')+' '+String(root.className||''))||inCopilot(root)))containers.push(root);
  if(root.querySelectorAll)containers=containers.concat(Array.from(root.querySelectorAll('[id*="copilot" i],[class*="copilot" i],[id*="internet-research" i],[class*="internet-research" i],[id*="external-ai" i],[class*="external-ai" i]')));
  containers.forEach(function(container){
    var walker=document.createTreeWalker(container,NodeFilter.SHOW_TEXT),nodes=[],n;
    while((n=walker.nextNode()))nodes.push(n);
    nodes.forEach(linkifyTextNode);
  });
}
function boot(){
  scan(document.body);
  var observer=new MutationObserver(function(records){records.forEach(function(r){r.addedNodes&&r.addedNodes.forEach(function(n){if(n.nodeType===1)scan(n);else if(n.nodeType===3)linkifyTextNode(n);});});});
  observer.observe(document.body,{childList:true,subtree:true});
}
var style=document.createElement('style');
style.textContent='.omodos-copilot-source-link{color:var(--primary,#2563eb);text-decoration:underline;text-underline-offset:2px;overflow-wrap:anywhere;cursor:pointer}.omodos-copilot-source-link:focus-visible{outline:2px solid currentColor;outline-offset:2px}';
document.head.appendChild(style);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();


/* COPILOT_RECORD_CARD_DETAIL_MODAL_V1: connect internal Copilot result cards to the full source record. */
(function(){
'use strict';
var rows = window.__omodosCopilotDetailRows || (window.__omodosCopilotDetailRows = new Map());
var nextId = Number(window.__omodosCopilotDetailNextId || 0);
var installed = false;
function esc(value){
  return String(value==null?'':value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
function installRenderer(){
  if(typeof window.copilotRowCardHtml_!=='function'||window.copilotRowCardHtml_.__detailPatched)return false;
  var original=window.copilotRowCardHtml_;
  var wrapped=function(row,sourceName,index){
    var html=original.apply(this,arguments);
    nextId+=1; window.__omodosCopilotDetailNextId=nextId;
    rows.set(String(nextId),{row:row,source:String(sourceName||'Data OMODOS'),index:Number(index||0)});
    return html.replace('<article class="copilot-data-record"','<article tabindex="0" role="button" aria-label="Buka detail pekerjaan" data-copilot-detail-id="'+nextId+'" class="copilot-data-record copilot-detail-clickable"');
  };
  wrapped.__detailPatched=true;
  window.copilotRowCardHtml_=wrapped;
  return true;
}
function ensureModal(){
  var el=document.getElementById('copilot-record-detail-modal');
  if(el)return el;
  el=document.createElement('div');
  el.id='copilot-record-detail-modal';
  el.className='copilot-detail-modal';
  el.hidden=true;
  el.innerHTML='<div class="copilot-detail-backdrop" data-detail-close></div><section class="copilot-detail-dialog" role="dialog" aria-modal="true" aria-labelledby="copilot-detail-title"><header class="copilot-detail-header"><div><div class="copilot-detail-eyebrow">COPILOT · DATA INTERNAL</div><h2 id="copilot-detail-title">Detail Pekerjaan</h2><div id="copilot-detail-source" class="copilot-detail-source"></div></div><button type="button" class="copilot-detail-close" aria-label="Tutup detail" data-detail-close>×</button></header><div id="copilot-detail-content" class="copilot-detail-content"></div><footer class="copilot-detail-footer"><button type="button" class="btn btn-sm" data-detail-close>Tutup</button></footer></section>';
  document.body.appendChild(el);
  el.addEventListener('click',function(ev){if(ev.target&&ev.target.closest('[data-detail-close]'))closeModal();});
  document.addEventListener('keydown',function(ev){if(ev.key==='Escape'&&!el.hidden)closeModal();});
  return el;
}
function isSensitive(key){
  return /password|token|base64|attachment.*data|file.*data|session|authorization|secret|api.?key/i.test(String(key||''));
}
function showDetail(id){
  var item=rows.get(String(id));
  if(!item||!item.row)return;
  var modal=ensureModal(),row=item.row;
  var title='';
  try{title=typeof window.copilotRowLabel_==='function'?window.copilotRowLabel_(row):'';}catch(_){}
  document.getElementById('copilot-detail-title').textContent=title||'Detail Pekerjaan';
  document.getElementById('copilot-detail-source').textContent=item.source+(Number.isFinite(item.index)?' · Hasil #'+(item.index+1):'');
  var content=document.getElementById('copilot-detail-content');
  content.replaceChildren();
  var entries=Object.entries(row).filter(function(pair){return !isSensitive(pair[0])&&pair[1]!==null&&pair[1]!==undefined&&pair[1]!=='';});
  entries.sort(function(a,b){
    var preferred=['ID','Tanggal','Waktu','Nama Mesin','Kode Mesin','Status','Status Pekerjaan','Deskripsi Masalah','Deskripsi','Tindakan Perbaikan','Penyebab','PIC','Pelapor'];
    var ai=preferred.findIndex(function(k){return k.toLowerCase()===a[0].toLowerCase();});
    var bi=preferred.findIndex(function(k){return k.toLowerCase()===b[0].toLowerCase();});
    return (ai<0?999:ai)-(bi<0?999:bi);
  });
  if(!entries.length){var empty=document.createElement('p');empty.className='copilot-detail-empty';empty.textContent='Detail record tidak tersedia.';content.appendChild(empty);}
  entries.forEach(function(pair){
    var value=pair[1];
    if(typeof value==='object'){
      try{value=JSON.stringify(value,null,2);}catch(_){value=String(value);}
    }
    var field=document.createElement('div');field.className='copilot-detail-field';
    var label=document.createElement('div');label.className='copilot-detail-label';label.textContent=String(pair[0]).replace(/([a-z])([A-Z])/g,'$1 $2').replace(/[_\.]/g,' ');
    var val=document.createElement('div');val.className='copilot-detail-value';val.textContent=String(value);
    field.append(label,val);content.appendChild(field);
  });
  modal.hidden=false;
  document.body.classList.add('copilot-detail-open');
  var close=modal.querySelector('.copilot-detail-close');if(close)close.focus();
}
function closeModal(){
  var modal=document.getElementById('copilot-record-detail-modal');
  if(!modal)return;
  modal.hidden=true;document.body.classList.remove('copilot-detail-open');
}
function installEvents(){
  if(installed||!document.body)return;
  installed=true;
  document.addEventListener('click',function(ev){
    var card=ev.target&&ev.target.closest&&ev.target.closest('.copilot-data-record[data-copilot-detail-id]');
    if(!card)return;
    if(ev.target.closest('a,button,input,select,textarea'))return;
    ev.preventDefault();showDetail(card.getAttribute('data-copilot-detail-id'));
  });
  document.addEventListener('keydown',function(ev){
    if(ev.key!=='Enter'&&ev.key!==' ')return;
    var card=ev.target&&ev.target.closest&&ev.target.closest('.copilot-data-record[data-copilot-detail-id]');
    if(!card)return;
    ev.preventDefault();showDetail(card.getAttribute('data-copilot-detail-id'));
  });
  var style=document.createElement('style');
  style.textContent='.copilot-detail-clickable{cursor:pointer;transition:border-color .15s,transform .15s,box-shadow .15s}.copilot-detail-clickable:hover,.copilot-detail-clickable:focus-visible{border-color:var(--blue,#5b9dff);box-shadow:0 0 0 2px color-mix(in srgb,var(--blue,#5b9dff) 20%,transparent);outline:none}.copilot-detail-clickable:after{content:"Ketuk untuk melihat detail";display:block;margin-top:7px;font-size:10px;color:var(--blue,#5b9dff)}.copilot-detail-modal[hidden]{display:none!important}.copilot-detail-modal{position:fixed;inset:0;z-index:12000;display:grid;place-items:center;padding:16px;padding-top:calc(16px + env(safe-area-inset-top,0px));padding-bottom:calc(16px + env(safe-area-inset-bottom,0px))}.copilot-detail-backdrop{position:absolute;inset:0;background:rgba(4,10,20,.72);backdrop-filter:blur(3px)}.copilot-detail-dialog{position:relative;display:flex;flex-direction:column;width:min(720px,100%);max-height:100%;background:var(--panel,#fff);color:var(--text,#111827);border:1px solid var(--line,#d1d5db);border-radius:16px;box-shadow:0 24px 70px rgba(0,0,0,.35);overflow:hidden}.copilot-detail-header{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;padding:17px;border-bottom:1px solid var(--line,#d1d5db)}.copilot-detail-eyebrow{font-size:10px;letter-spacing:.09em;font-weight:800;color:var(--blue,#2563eb)}.copilot-detail-header h2{font-size:17px;line-height:1.35;margin:5px 0 3px;overflow-wrap:anywhere}.copilot-detail-source{font-size:11px;color:var(--text-dim,#64748b)}.copilot-detail-close{width:34px;height:34px;border:1px solid var(--line,#d1d5db);border-radius:9px;background:var(--panel-2,#f3f4f6);color:inherit;font-size:24px;line-height:1;cursor:pointer}.copilot-detail-content{padding:14px;overflow:auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr));gap:9px}.copilot-detail-field{min-width:0;border:1px solid var(--line,#d1d5db);border-radius:10px;padding:10px;background:var(--panel-2,rgba(128,128,128,.06))}.copilot-detail-label{font-size:10px;line-height:1.35;text-transform:uppercase;letter-spacing:.04em;color:var(--text-dim,#64748b);margin-bottom:5px;overflow-wrap:anywhere}.copilot-detail-value{font-size:12px;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere;word-break:break-word}.copilot-detail-empty{grid-column:1/-1;color:var(--text-dim,#64748b)}.copilot-detail-footer{display:flex;justify-content:flex-end;padding:12px 14px;border-top:1px solid var(--line,#d1d5db)}@media(max-width:520px){.copilot-detail-modal{padding:8px;padding-top:calc(8px + env(safe-area-inset-top,0px));padding-bottom:calc(8px + env(safe-area-inset-bottom,0px))}.copilot-detail-dialog{border-radius:13px}.copilot-detail-header{padding:13px}.copilot-detail-content{padding:10px;grid-template-columns:1fr;gap:7px}}';
  document.head.appendChild(style);
}
function boot(){
  installEvents();installRenderer();
  var attempts=0;
  var timer=setInterval(function(){attempts++;if(installRenderer()||attempts>=40)clearInterval(timer);},100);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();


/* OMODOS REVIEW FIXES — 2026-10-17
   - unit-aware logbook material quantities
   - preserve line breaks in logbook descriptions
   - mobile-safe fullscreen/orientation behavior
   - material suggestions in the existing logbook edit modal
*/
(function(){
'use strict';
if(window.__OMODOS_REVIEW_FIXES_20261017__) return;
window.__OMODOS_REVIEW_FIXES_20261017__ = true;

function esc(v){
  try { return typeof escapeHtml==='function' ? escapeHtml(String(v==null?'':v)) : String(v==null?'':v).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
  catch(e){ return String(v==null?'':v); }
}
function addUnits(){
  const holder=document.getElementById('sparepart-rows');
  if(!holder) return;
  holder.querySelectorAll('.sparepart-row').forEach(row=>{
    const qtyField=row.querySelector('.sp-jumlah')?.closest('.field');
    if(!qtyField || row.querySelector('.sp-unit')) return;
    const id=Number(row.dataset.id);
    let data=null;
    try{ data=(typeof SPAREPART_ROWS!=='undefined' ? SPAREPART_ROWS.find(r=>Number(r.id)===id) : null); }catch(e){}
    const unit=String(data?.unit||'pcs');
    const options=['pcs','unit','set','kg','g','ml','L','mL','meter','cm','roll','botol','kaleng','pack','lembar'];
    const html='<div class="field sp-unit-field"><label>Satuan</label><select class="sp-unit" aria-label="Satuan jumlah material">'+options.map(o=>'<option value="'+o+'" '+(o===unit?'selected':'')+'>'+o+'</option>').join('')+'</select></div>';
    qtyField.insertAdjacentHTML('afterend',html);
    const select=row.querySelector('.sp-unit');
    if(select) select.addEventListener('change',()=>{ try{syncSparepartRowsFromDom();}catch(e){} });
    const qty=row.querySelector('.sp-jumlah');
    if(qty){ qty.removeAttribute('step'); qty.setAttribute('step','any'); qty.setAttribute('min','0.001'); qty.setAttribute('inputmode','decimal'); }
  });
}
const oldRender=window.renderSparepartRows;
if(typeof oldRender==='function'){
  window.renderSparepartRows=function(){
    const result=oldRender.apply(this,arguments);
    addUnits();
    return result;
  };
}
const oldSync=window.syncSparepartRowsFromDom;
if(typeof oldSync==='function'){
  window.syncSparepartRowsFromDom=function(){
    const result=oldSync.apply(this,arguments);
    try{
      const holder=document.getElementById('sparepart-rows');
      if(holder && typeof SPAREPART_ROWS!=='undefined'){
        holder.querySelectorAll('.sparepart-row').forEach(el=>{
          const row=SPAREPART_ROWS.find(r=>Number(r.id)===Number(el.dataset.id));
          if(row){ row.unit=el.querySelector('.sp-unit')?.value||row.unit||'pcs'; }
        });
      }
    }catch(e){}
    return result;
  };
}
const oldBuild=window.buildMaterialFieldsFromRows;
if(typeof oldBuild==='function'){
  window.buildMaterialFieldsFromRows=function(){
    const data=oldBuild.apply(this,arguments);
    if(data && Array.isArray(data.detail)){
      data.namaMaterial=data.detail.map(r=>{
        const name=String(r.nama||'').trim();
        const qty=String(r.jumlah||'').trim();
        const unit=String(r.unit||'pcs').trim()||'pcs';
        return name ? (qty ? name+' ('+qty+' '+unit+')' : name) : '';
      }).filter(Boolean).join('; ');
    }
    return data;
  };
}

function attachEditMaterialSuggestions(){
  const holder=document.getElementById('entry-view-mode');
  if(!holder || !holder.querySelector('[data-edit-field="Nama Material"]')) return;
  const nameInput=holder.querySelector('[data-edit-field="Nama Material"]');
  const sapInput=holder.querySelector('[data-edit-field="Material Number SAP"]');
  if(!nameInput || !sapInput || nameInput.dataset.materialSuggestReady==='1') return;
  nameInput.dataset.materialSuggestReady='1';
  sapInput.dataset.materialSuggestReady='1';
  [nameInput,sapInput].forEach(input=>{
    const field=input.closest('.field');
    if(field) field.style.position='relative';
    const box=document.createElement('div');
    box.className='sp-suggest-box';
    box.style.cssText='position:absolute;z-index:10020;left:0;right:0;top:100%;max-height:220px;overflow:auto;background:var(--panel,#fff);border:1px solid var(--line,#d1d5db);border-radius:9px;box-shadow:0 8px 24px rgba(0,0,0,.18);';
    if(field) field.appendChild(box);
    const byName=input===nameInput;
    const run=()=>{
      let master=[];
      try{ master=Array.isArray(SPAREPART_LOKASI)?SPAREPART_LOKASI:[]; }catch(e){}
      const q=input.value.trim().toLowerCase();
      if(!q){box.classList.remove('open');box.innerHTML='';return;}
      const seen=new Set();
      const found=master.filter(x=>{
        const v=String(byName?(x.nama||''):(x.sap||'')).trim();
        const k=v.toLowerCase();
        if(!k.includes(q)||seen.has(k))return false;
        seen.add(k);return true;
      }).slice(0,25);
      if(!found.length){box.classList.remove('open');box.innerHTML='';return;}
      box.innerHTML=found.map((x,i)=>'<div class="sp-suggest-item" data-edit-material-idx="'+i+'" style="display:flex;flex-direction:column;gap:2px;padding:9px 11px;cursor:pointer;border-bottom:1px solid var(--line,#e5e7eb)"><span class="sp-suggest-main">'+esc(byName?x.nama:x.sap)+'</span><span class="sp-suggest-sub">'+esc(byName?('SAP: '+(x.sap||'-')):(x.nama||'Nama material belum tersedia'))+'</span></div>').join('');
      box.classList.add('open');
      box.querySelectorAll('[data-edit-material-idx]').forEach(el=>el.addEventListener('mousedown',ev=>{
        ev.preventDefault();
        const item=found[Number(el.dataset.editMaterialIdx)];
        if(!item)return;
        nameInput.value=item.nama||'';
        sapInput.value=item.sap||'';
        box.classList.remove('open');box.innerHTML='';
        nameInput.dispatchEvent(new Event('input',{bubbles:true}));
        sapInput.dispatchEvent(new Event('input',{bubbles:true}));
      }));
    };
    input.addEventListener('input',run);
    input.addEventListener('focus',run);
    input.addEventListener('blur',()=>setTimeout(()=>{box.classList.remove('open');box.innerHTML='';},180));
  });
}
const oldEdit=window.renderEntryEditForm;
if(typeof oldEdit==='function'){
  window.renderEntryEditForm=function(){
    const result=oldEdit.apply(this,arguments);
    attachEditMaterialSuggestions();
    return result;
  };
}
const style=document.createElement('style');
style.textContent=
  '.detail-row .v{white-space:pre-line;overflow-wrap:anywhere}'+
  '#entry-view-mode [data-edit-field="Deskripsi Masalah"],#entry-view-mode [data-edit-field="Tindakan Perbaikan"],#entry-view-mode [data-edit-field="Catatan Tambahan"]{white-space:pre-wrap;min-height:100px}'+
  '#sparepart-rows .sparepart-row{align-items:end}'+
  '#sparepart-rows .sp-unit-field{min-width:90px}'+
  '#entry-view-mode .sp-suggest-box.open{display:block}';
document.head.appendChild(style);

/* The legacy login helper was locking orientation to landscape and requesting
   fullscreen again on visibility changes. Disable that behavior on phones;
   never force a mobile device into landscape. */
if(typeof window.aktifkanFullscreen==='function'){
  window.aktifkanFullscreen=function(){
    const mobile=window.matchMedia('(max-width: 767px), (pointer: coarse)').matches;
    if(mobile) return;
    const el=document.documentElement;
    try{
      if(!document.fullscreenElement && el.requestFullscreen) el.requestFullscreen().catch(()=>{});
    }catch(e){}
  };
}
function init(){
  addUnits();
  attachEditMaterialSuggestions();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
const observer=new MutationObserver(()=>{addUnits();attachEditMaterialSuggestions();});
observer.observe(document.documentElement,{subtree:true,childList:true});
})();


/* OMODOS_REVIEW_FIXES_20261017_V2
   Make the edit-logbook material picker discoverable on mobile (including
   when the field is empty), and preserve typed form content during lifecycle
   transitions. */
(function(){
'use strict';
if(window.__OMODOS_REVIEW_FIXES_20261017_V2__)return;
window.__OMODOS_REVIEW_FIXES_20261017_V2__=true;
function esc2(v){
  try{return typeof escapeHtml==='function'?escapeHtml(String(v==null?'':v)):String(v==null?'':v).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}
  catch(e){return String(v==null?'':v);}
}
function attachPicker(){
  const holder=document.getElementById('entry-view-mode');
  if(!holder)return;
  const name=holder.querySelector('[data-edit-field="Nama Material"]');
  const sap=holder.querySelector('[data-edit-field="Material Number SAP"]');
  if(!name||!sap)return;
  [name,sap].forEach(input=>{
    const box=input.closest('.field')?.querySelector('.omodos-edit-material-picker');
    if(!box)return;
    const byName=input===name;
    const render=(showAll)=>{
      let master=[];
      try{master=Array.isArray(SPAREPART_LOKASI)?SPAREPART_LOKASI:[];}catch(e){}
      const q=String(input.value||'').trim().toLocaleLowerCase('id');
      const seen=new Set();
      const found=master.filter(x=>{
        const v=String(byName?(x.nama||''):(x.sap||'')).trim();
        const k=v.toLocaleLowerCase('id');
        if(!k||seen.has(k)||(q&&!k.includes(q)))return false;
        seen.add(k);return true;
      }).slice(0,25);
      if(!found.length){box.classList.remove('open');box.innerHTML='';return;}
      box.innerHTML=found.map((x,i)=>'<button type="button" class="sp-suggest-item" data-pick-index="'+i+'" style="display:flex;width:100%;text-align:left;flex-direction:column;gap:2px;padding:10px 12px;border:0;border-bottom:1px solid var(--line,#e5e7eb);background:transparent;color:inherit;cursor:pointer"><span class="sp-suggest-main">'+esc2(byName?x.nama:x.sap)+'</span><span class="sp-suggest-sub">'+esc2(byName?('SAP: '+(x.sap||'-')):(x.nama||'Nama material belum tersedia'))+'</span></button>').join('');
      box.__items=found;box.classList.add('open');
    };
    if(input.dataset.materialPickerV2==='1')return;
    input.dataset.materialPickerV2='1';
    input.addEventListener('focus',()=>render(true));
    input.addEventListener('input',()=>render(false));
    input.addEventListener('keydown',ev=>{
      if(ev.key==='Escape'){box.classList.remove('open');box.innerHTML='';}
    });
    box.addEventListener('pointerdown',ev=>{
      const option=ev.target.closest('[data-pick-index]');
      if(!option)return;
      ev.preventDefault();
      const item=box.__items?.[Number(option.dataset.pickIndex)];
      if(!item)return;
      name.value=item.nama||'';sap.value=item.sap||'';
      box.classList.remove('open');box.innerHTML='';
      name.dispatchEvent(new Event('input',{bubbles:true}));
      sap.dispatchEvent(new Event('input',{bubbles:true}));
    });
    input.addEventListener('blur',()=>setTimeout(()=>{if(!box.matches(':hover')){box.classList.remove('open');box.innerHTML='';}},250));
  });
}
const originalAttach=attachEditMaterialSuggestions;
function ensurePicker(){
  const holder=document.getElementById('entry-view-mode');
  if(!holder)return;
  const name=holder.querySelector('[data-edit-field="Nama Material"]');
  const sap=holder.querySelector('[data-edit-field="Material Number SAP"]');
  [name,sap].forEach(input=>{
    if(!input)return;
    const field=input.closest('.field');
    if(!field)return;
    let box=field.querySelector('.omodos-edit-material-picker');
    if(!box){
      box=document.createElement('div');
      box.className='sp-suggest-box omodos-edit-material-picker';
      box.style.cssText='display:none;position:absolute;z-index:10030;left:0;right:0;top:100%;max-height:240px;overflow:auto;background:var(--panel,#fff);border:1px solid var(--line,#d1d5db);border-radius:9px;box-shadow:0 8px 24px rgba(0,0,0,.18);';
      field.style.position='relative';field.appendChild(box);
    }
  });
  attachPicker();
}
const style=document.createElement('style');
style.textContent='.omodos-edit-material-picker.open{display:block!important}.omodos-edit-material-picker .sp-suggest-item:active{background:var(--surface-2,#f3f4f6)}';
document.head.appendChild(style);
const previousRender=window.renderEntryEditForm;
if(typeof previousRender==='function'&&!previousRender.__materialPickerV2){
  const wrapped=function(){const result=previousRender.apply(this,arguments);ensurePicker();return result;};
  wrapped.__materialPickerV2=true;window.renderEntryEditForm=wrapped;
}
function boot(){ensurePicker();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
new MutationObserver(boot).observe(document.documentElement,{subtree:true,childList:true});
})();
