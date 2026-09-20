# Bantuan Patch Ranges

## legacy-guide-implementation — 28134-28340
~~~text
28134: <script id="legacy-low-cognitive-script">
28135: (function(){
28136:   const VIEW_GUIDES=Object.freeze({
28137:     dashboard:['Beranda','Lihat keadaan aplikasi secara singkat.','Baca kartu yang paling penting.','Tekan menu untuk membuka pekerjaan yang ingin dilakukan.'],
28138:     input:['Catat pekerjaan','Tulis pekerjaan maintenance yang baru dilakukan.','Pilih mesin lalu isi masalah atau pekerjaan.','Periksa isian, lalu simpan Logbook.'],
28139:     report:['Buat laporan','Pilih jenis laporan yang ingin dibuat.','Pilih kategori laporan.','Isi data lalu tekan tombol simpan.'],
28140:     'report-hub':['Laporan tersimpan','Cari laporan yang sudah pernah dibuat.','Pilih jenis laporan.','Buka laporan untuk membaca atau mengubahnya.'],
28141:     'project-report':['Laporan proyek','Catat tujuan, jadwal, hasil, dan perkembangan proyek.','Isi data utama proyek.','Tambahkan milestone bila perlu, lalu simpan.'],
28142:     'project-center':['Proyek dan perbaikan','Lihat Factory Project, Kaizen, dan SGA di satu tempat.','Pilih jenis proyek yang ingin dilihat.','Tekan proyek untuk membuka detail atau perkembangan.'],
28143:     'people-hub':['Orang dan rapat','Buka data personel, kemampuan, atau rapat.','Pilih kartu yang sesuai kebutuhan.','Buka detail untuk melihat data lengkap.'],
28144:     meeting:['Rapat','Catat jadwal, hasil rapat, keputusan, dan tugas.','Buat atau pilih rapat.','Isi keputusan dan tugas, lalu simpan.'],
28145:     patrol:['Pemeriksaan harian','Periksa kondisi mesin langkah demi langkah.','Pilih mesin dan ikuti daftar pemeriksaan.','Catat temuan lalu simpan Patrol.'],
28146:     downtime:['Waktu berhenti mesin','Baca file downtime Elektrikal dan Mekanikal lalu buat ringkasan.','Pilih file Excel dan jalankan analisa.','Periksa hasil sebelum menyimpan atau mengunduh.'],
28147:     utama:['Lihat Logbook','Lihat seluruh catatan pekerjaan dari yang paling baru.','Gunakan pencarian atau filter bila datanya banyak.','Tekan catatan untuk melihat detail.'],
28148:     mesin:['Logbook per mesin','Lihat catatan hanya untuk mesin yang dipilih.','Pilih mesin dari daftar.','Baca catatan terbaru atau buka detailnya.'],
28149:     tanggal:['Logbook per tanggal','Cari pekerjaan berdasarkan tanggal.','Pilih tanggal atau rentang waktu.','Buka catatan yang ingin dibaca.'],
28150:     pelapor:['Logbook per pelapor','Cari catatan berdasarkan orang yang membuat laporan.','Pilih nama pelapor.','Buka catatan yang ingin dibaca.'],
28151:     group:['Logbook per grup','Cari catatan berdasarkan grup kerja.','Pilih grup.','Buka catatan yang ingin dibaca.'],
28152:     'insights-hub':['Analisis dan pengetahuan','Pilih alat bantu untuk memahami masalah maintenance.','Pilih analisis, panduan penyebab, atau pengetahuan.','Baca bukti sebelum mengambil keputusan.'],
28153:     durasi:['Durasi pekerjaan','Lihat pekerjaan yang memakan waktu paling lama.','Pilih rentang data.','Baca daftar pekerjaan dan durasinya.'],
28154:     analitik:['Ringkasan analisis','Lihat MTTR, MTBF, downtime, dan pola masalah.','Pilih rentang atau mesin bila tersedia.','Mulai dari angka yang paling perlu perhatian.'],
28155:     'kpi-department':['Target kerja departemen','Lihat target dan hasil kerja departemen.','Pilih periode yang ingin dilihat.','Bandingkan target dengan hasil yang tercatat.'],
28156:     'kpi-input':['Isi target kerja','Masukkan atau perbarui data KPI dan kertas kerja.','Isi periode dan nilai yang benar.','Simpan lalu periksa kembali hasilnya.'],
28157:     'machine-breakdown':['Riwayat kerusakan mesin','Catat dan lihat jumlah kerusakan mesin per bulan atau tahun.','Pilih tambah atau ubah data.','Isi nilai lalu simpan.'],
28158:     'record-ytd':['Riwayat mesin tahunan','Lihat data mesin dari tahun ke tahun.','Pilih atau tambahkan data tahun.','Periksa nilainya lalu simpan.'],
28159:     'run-hour-comparison':['Bandingkan jam operasi','Bandingkan jam operasi mesin antarperiode.','Pilih atau tambahkan data.','Baca perbedaannya lalu simpan bila ada perubahan.'],
28160:     'energy-cost-toe':['Biaya energi','Lihat biaya energi dan TOE berdasarkan data yang tercatat.','Pilih periode atau tambahkan data.','Periksa angka sebelum menyimpan.'],
28161:     'corrective-report':['Laporan perbaikan','Catat tindakan perbaikan setelah masalah ditemukan.','Pilih tambah atau ubah data.','Isi tindakan dan hasilnya lalu simpan.'],
28162:     'energy-utility':['Energi dan air','Catat serta lihat pemakaian listrik, air, dan utilitas.','Pilih periode atau ambil data dari Excel.','Periksa hasil lalu simpan.'],
28163:     correlation:['Cari hubungan data','Bandingkan dua kelompok data untuk melihat apakah bergerak bersama.','Pilih data yang ingin dibandingkan.','Gunakan hasil sebagai petunjuk, bukan bukti penyebab.'],
28164:     diagnostic:['Panduan cari penyebab','Masukkan gejala agar sistem membantu mencari kemungkinan penyebab.','Pilih mesin atau gejala.','Baca saran dan periksa mesin sebelum bertindak.'],
28165:     knowledge:['Pusat pengetahuan','Simpan dan cari solusi, pelajaran, serta cara kerja yang pernah dicatat.','Cari topik atau tambah pengetahuan baru.','Buka artikel untuk membaca detail.'],
28166:     rca:['Analisa akar masalah','Susun RCA untuk mencari penyebab utama masalah.','Isi masalah dan bukti yang diketahui.','Periksa analisa lalu simpan laporan.'],
28167:     database:['Data mesin','Lihat informasi dasar setiap mesin.','Cari atau pilih mesin.','Buka mesin untuk membaca detailnya.'],
28168:     sparepart:['Suku cadang','Lihat stok, lokasi, PO, opname, dan data material.','Pilih bagian yang ingin dilihat.','Cari material lalu periksa data sebelum mengubahnya.'],
28169:     'expert-finder':['Cari teknisi berpengalaman','Cari orang yang pernah menangani mesin atau masalah tertentu.','Pilih konteks mesin atau masalah.','Baca bukti pengalaman yang tercatat.'],
28170:     'knowledge-graph':['Peta hubungan pengetahuan','Lihat hubungan antara mesin, orang, suku cadang, dan masalah.','Pilih titik yang ingin dilihat.','Baca hubungan sebelum membuka detail.'],
28171:     wiki:['Wikipedia Maintenance','Cari penjelasan mesin, personel, suku cadang, dan riwayat.','Ketik kata yang ingin dicari.','Pilih hasil untuk membaca detail.'],
28172:     ai:['Bantuan AI','Gunakan AI sebagai alat bantu membaca data, bukan pengganti keputusan manusia.','Tulis masalah atau pertanyaan.','Periksa jawaban dan data pendukung sebelum bertindak.'],
28173:     setting:['Pengaturan utama','Atur koneksi, pengguna, hak akses, mesin, Patrol, dan personel.','Pilih tab pengaturan.','Ubah hanya bagian yang diperlukan lalu simpan.'],
28174:     tema:['Tampilan aplikasi','Pilih tampilan yang paling nyaman dibaca.','Pilih tema atau mode sederhana.','Lihat hasilnya; data aplikasi tidak berubah.'],
28175:     'pi-dashboard':['Ringkasan kemampuan personel','Lihat ringkasan kemampuan seluruh personel.','Pilih kelompok atau orang bila tersedia.','Buka detail untuk melihat bukti penilaian.'],
28176:     'pi-personnel':['Data personel','Lihat profil pekerjaan dan data personel.','Cari nama orang.','Buka profil untuk membaca detail.'],
28177:     'pi-smart-resume':['Ringkasan personel','Buat ringkasan dari data personel yang sudah tercatat.','Pilih personel.','Periksa ringkasan sebelum menggunakannya.'],
28178:     'pi-softskill':['Penilaian perilaku','Lihat penilaian kemampuan perilaku personel.','Pilih personel atau periode.','Baca hasil sebagai bahan pengembangan.'],
28179:     'pi-hardskill':['Penilaian teknis','Lihat kemampuan teknis yang sudah dinilai.','Pilih personel atau unit kompetensi.','Baca bagian yang sudah mampu dan yang masih perlu belajar.']
28180:   });
28181: 
28182:   const VIEW_NAMES=Object.freeze({
28183:     dashboard:'Beranda',input:'Catat Logbook',utama:'Lihat Logbook','project-center':'Proyek & Perbaikan',
28184:     patrol:'Pemeriksaan Harian',sparepart:'Suku Cadang','corrective-report':'Laporan Perbaikan',report:'Buat Laporan',
28185:     'energy-utility':'Energi & Air','insights-hub':'Analisis & Pengetahuan','kpi-department':'Target Kerja Departemen',
28186:     'kpi-input':'Isi Target Kerja','machine-breakdown':'Riwayat Kerusakan Mesin','record-ytd':'Riwayat Mesin Tahunan',
28187:     'run-hour-comparison':'Bandingkan Jam Operasi','energy-cost-toe':'Biaya Energi','people-hub':'Orang & Rapat',
28188:     database:'Data Mesin',tema:'Tampilan Aplikasi',setting:'Pengaturan Utama'
28189:   });
28190: 
28191:   const GROUP_NAMES=Object.freeze({
28192:     report:'Laporan & Pekerjaan Lapangan',wtp:'Pengolahan Air',energy:'Energi & Utilitas',
28193:     kpidept:'Target Kerja Departemen',pengaturan:'Pengaturan'
28194:   });
28195: 
28196:   const SIMPLE_TEXT=Object.freeze({
28197:     'Home':'Beranda','Project Center':'Pusat Proyek','Corrective Report':'Laporan Perbaikan',
28198:     'Dashboard KPI Department':'Target Kerja Departemen','Breakdown Mesin (MTD/YTD)':'Riwayat Kerusakan Mesin',
28199:     'Database Mesin':'Data Mesin','Reports & Field Work':'Laporan & Pekerjaan Lapangan','Water Treatment Plant':'Pengolahan Air',
28200:     'Energy & Utility':'Energi & Utilitas','Insights':'Analisis & Pengetahuan','KPI Department':'Target Kerja Departemen',
28201:     'People & Meetings':'Orang & Rapat','Input Report':'Buat Laporan','Dashboard & Analytics':'Ringkasan & Grafik',
28202:     'Factory Project':'Proyek Pabrik','Filter':'Saring Data','Tambah Project':'Tambah Proyek',
28203:     'PI Dashboard':'Ringkasan Kemampuan','Personnel':'Data Personel','Meeting Management':'Kelola Rapat',
28204:     'Meeting Analytics':'Ringkasan Rapat','Meeting Baru':'Buat Rapat','Open':'Belum Selesai',
28205:     'Download Excel Hasil Analisa':'Unduh Hasil Excel','Download Excel Resume':'Unduh Ringkasan Excel',
28206:     'Refresh':'Muat Ulang','Dashboard Analitik':'Ringkasan Analisis','Correlation Analysis':'Cari Hubungan Data',
28207:     'Diagnostic Wizard':'Panduan Cari Penyebab','Knowledge Base':'Pusat Pengetahuan',
28208:     'Knowledge Center':'Pusat Pengetahuan','Expert Finder':'Cari Teknisi Berpengalaman',
28209:     'Knowledge Graph':'Peta Hubungan Pengetahuan','Import Excel':'Ambil dari Excel',
28210:     'Import Excel (Upload File)':'Ambil dari File Excel','Tambah / Update Data':'Tambah / Ubah Data',
28211:     'Export Excel':'Unduh Excel','Export PDF':'Unduh PDF','Export Word':'Unduh Word',
28212:     'Reset':'Atur Ulang','Reset Konteks':'Kosongkan Pilihan','Reset Tampilan':'Atur Ulang Tampilan',
28213:     'User Management':'Kelola Pengguna','Role Access':'Hak Akses','Template Patrol':'Daftar Pemeriksaan Patrol',
28214:     'Tambah User':'Tambah Pengguna','Simpan Role Access':'Simpan Hak Akses','Edit':'Ubah','Batal Edit':'Batal Mengubah',
28215:     'Simpan Report RCA':'Simpan Laporan RCA','Buat Report IPAL Baru':'Buat Laporan IPAL Baru','Simpan Report':'Simpan Laporan',
28216:     'Import Semua Baris':'Ambil Semua Baris','Update Progress':'Tambah Perkembangan','Simpan Update':'Simpan Perkembangan',
28217:     'Edit Data':'Ubah Data','Tambah File (lewat Edit Data)':'Tambah File','Tambah Update Progress':'Tambah Perkembangan',
28218:     'Edit Meeting Ini':'Ubah Rapat Ini','Simpan Meeting':'Simpan Rapat','Tambah Action Item':'Tambah Tugas',
28219:     'Soft Skill Assessment':'Penilaian Perilaku','Hard Skill Assessment':'Penilaian Teknis',
28220:     'Smart Recognition & Resume Personil':'Ringkasan Otomatis Personel','Smart Recognition':'Pengenalan Otomatis',
28221:     'Smart Resume (Ringkasan Otomatis)':'Ringkasan Otomatis','Radar Chart — Soft Skill':'Grafik Penilaian Perilaku',
28222:     'Radar Chart — Hard Skill':'Grafik Penilaian Teknis','Hard Skill Detail':'Detail Kemampuan Teknis',
28223:     'Hard Skill Competency — Detail':'Detail Kompetensi Teknis','Soft Skill Summary (Penilaian Terbaru)':'Ringkasan Penilaian Perilaku Terbaru',
28224:     'Generate Report RCA':'Buat Laporan RCA','Sparepart Management':'Kelola Suku Cadang',
28225:     'Auto-Sync Knowledge Base':'Sinkronkan Pengetahuan Otomatis','Scan Ulang':'Periksa Ulang',
28226:     'Card View':'Tampilan Kartu','Table View':'Tampilan Tabel','Status Project':'Status Proyek',
28227:     'Progress per Bulan (rata-rata update)':'Perkembangan Rata-rata per Bulan','Jumlah Project per Jenis':'Jumlah Proyek per Jenis',
28228:     'Laporan Proyek — Project Status Report':'Laporan Status Proyek','Update Action Item':'Ubah Tugas',
28229:     'Analisa Downtime Elektrikal & Mekanikal':'Analisa Waktu Berhenti Elektrikal & Mekanikal',
28230:     'Analisa Downtime E&M':'Analisa Waktu Berhenti E&M','People Intelligence Dashboard':'Ringkasan Kemampuan Personel',
28231:     '+ Simpan KPI':'Simpan Target Kerja','Sinkron Data Aktual KPI Department':'Ambil Data Target Terbaru',
28232:     'Muat Data dari Excel':'Ambil Data Excel','Simpan PO':'Simpan Pesanan','Simpan Hasil Opname':'Simpan Hasil Cek Stok',
28233:     '+ Simpan Data Sparepart':'Simpan Suku Cadang','Impor Data Elektrikal Standar':'Ambil Daftar Pemeriksaan Elektrikal',
28234:     'Impor Data Mekanikal Standar':'Ambil Daftar Pemeriksaan Mekanikal','Simpan Formula':'Simpan Rumus',
28235:     'Impor Data Personil (Packaging Offset Technical)':'Ambil Data Personel Packaging Offset',
28236:     'Simpan Assessment Manual':'Simpan Penilaian Manual','Tanya Internal':'Tanya Data OMODOS','AI External hanya digunakan bila Anda memilih tombolnya. Konteks yang dikirim dibatasi pada data internal yang relevan dengan pertanyaan.':'AI luar hanya dipakai jika Anda menekan tombolnya. Data yang dikirim dibatasi pada bagian yang berhubungan dengan pertanyaan.',
28237:     'AI External':'Tanya AI Luar','Bersihkan Data':'Hapus Percakapan',
28238:     'Mulai Checklist':'Mulai Pemeriksaan','Lanjut ke Temuan':'Lanjut ke Catatan Temuan',
28239:     'Analisa Data':'Periksa Data','Tambah Milestone':'Tambah Tahap Penting',
28240:     'Auto-detect':'Cari Otomatis','Auto-detect (default: NOTE)':'Cari Otomatis (biasanya kolom NOTE)',
28241:     'Smart Recognition':'Pengenalan Otomatis','Resume Psikologis (Indikatif — dari Soft Skill Assessment)':'Ringkasan Perilaku dari Penilaian',
28242:     'Update Progress':'Perbarui Perkembangan','Daftar Project':'Daftar Proyek',
28243:     'Timeline Gantt':'Jadwal Proyek','Progress':'Perkembangan',
28244:     'Factory Project, Kaizen & SGA dalam satu tempat.':'Proyek pabrik, Kaizen, dan SGA dalam satu tempat.',
28245:     'Card View':'Tampilan Kartu','Table View':'Tampilan Tabel'
28246:   });
28247: 
28248:   const GLOSSARY=[
28249:     ['Maintenance','Perawatan mesin agar tetap bekerja dengan baik.'],['Logbook','Catatan pekerjaan maintenance.'],['Patrol','Pemeriksaan rutin mesin.'],
28250:     ['Personel','Orang atau karyawan yang bekerja.'],['PIC','Orang yang bertanggung jawab pada suatu tugas.'],
28251:     ['PO','Pesanan pembelian barang.'],['Opname','Pengecekan jumlah barang secara langsung.'],['Utilitas','Listrik, air, udara, dan kebutuhan pendukung.'],
28252:     ['Milestone','Tahap penting dalam sebuah proyek.'],['Assessment','Penilaian kemampuan atau hasil kerja.'],
28253:     ['Breakdown','Mesin rusak atau berhenti karena gangguan.'],['Downtime','Waktu saat mesin tidak bekerja.'],
28254:     ['RCA','Analisa untuk mencari akar penyebab masalah.'],['KPI','Angka target untuk melihat hasil kerja.'],
28255:     ['MTBF','Rata-rata waktu mesin bekerja sebelum rusak lagi.'],['MTTR','Rata-rata waktu untuk memperbaiki mesin.'],
28256:     ['MTD','Data dari awal bulan sampai hari ini.'],['YTD','Data dari awal tahun sampai hari ini.'],
28257:     ['ENPI','Angka untuk melihat pemakaian energi.'],['TOE','Satuan untuk membandingkan pemakaian energi.'],
28258:     ['ETA','Perkiraan waktu barang tiba.'],['Sparepart','Suku cadang mesin.'],
28259:     ['Kaizen','Perbaikan kecil atau bertahap.'],['SGA','Kelompok kecil untuk menyelesaikan masalah atau membuat perbaikan.']
28260:   ];
28261: 
28262:   function setOwnText(el,text){
28263:     if(!el||!text)return;
28264:     const nodes=[...el.childNodes].filter(n=>n.nodeType===Node.TEXT_NODE&&String(n.nodeValue||'').trim());
28265:     if(nodes.length){
28266:       nodes[0].nodeValue=' '+text+' ';
28267:       nodes.slice(1).forEach(n=>n.nodeValue=' ');
28268:       return;
28269:     }
28270:     const chev=el.querySelector(':scope > .chev'),count=el.querySelector(':scope > .count');
28271:     el.insertBefore(document.createTextNode(' '+text+' '),chev||count||null);
28272:   }
28273: 
28274:   function replaceSimpleText(root){
28275:     if(!root||!document.createTreeWalker)return;
28276:     const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{
28277:       acceptNode(node){
28278:         const p=node.parentElement;
28279:         if(!p||/^(SCRIPT|STYLE|TEXTAREA|INPUT)$/i.test(p.tagName))return NodeFilter.FILTER_REJECT;
28280:         return String(node.nodeValue||'').trim()?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;
28281:       }
28282:     });
28283:     const edits=[];let node;
28284:     while(node=walker.nextNode()){
28285:       const raw=String(node.nodeValue||''),key=raw.replace(/\s+/g,' ').trim(),next=SIMPLE_TEXT[key];
28286:       if(next&&next!==key)edits.push([node,raw,next]);
28287:     }
28288:     edits.forEach(([node,raw,next])=>{
28289:       const lead=(raw.match(/^\s*/)||[''])[0],trail=(raw.match(/\s*$/)||[''])[0];
28290:       node.nodeValue=lead+next+trail;
28291:     });
28292:   }
28293: 
28294:   function glossaryHtml(){
28295:     return '<details class="legacy-simple-glossary"><summary>Arti kata yang sering muncul</summary><div class="legacy-simple-glossary-grid">'+
28296:       GLOSSARY.map(x=>'<div><b>'+x[0]+'</b><span>'+x[1]+'</span></div>').join('')+'</div></details>';
28297:   }
28298: 
28299:   function ensureGuide(view){
28300:     if(!view||!view.id||view.id==='view-omodos4'||view.querySelector(':scope > .legacy-simple-guide'))return;
28301:     const key=view.id.replace(/^view-/,'');
28302:     const g=VIEW_GUIDES[key];if(!g)return;
28303:     const guide=document.createElement('div');guide.className='legacy-simple-guide';guide.dataset.simpleGuide=key;
28304:     guide.innerHTML='<div class="legacy-simple-guide-title">'+g[0]+'</div>'+
28305:       '<div class="legacy-simple-guide-purpose">'+g[1]+'</div>'+
28306:       '<div class="legacy-simple-guide-steps"><div class="legacy-simple-step"><b>1</b>'+g[2]+'</div><div class="legacy-simple-step"><b>2</b>'+g[3]+'</div></div>'+
28307:       glossaryHtml();
28308:     const top=view.querySelector(':scope > .topbar');
28309:     if(top)top.insertAdjacentElement('afterend',guide);else view.prepend(guide);
28310:   }
28311: 
28312:   function connectLabels(root){
28313:     if(!root||!root.querySelectorAll)return;
28314:     let seq=0;
28315:     root.querySelectorAll('.field,.form-group,.v-field').forEach(box=>{
28316:       const label=box.querySelector('label'),control=box.querySelector('input,select,textarea');
28317:       if(!label||!control)return;
28318:       if(!control.id)control.id='legacy-field-'+(++seq)+'-'+Date.now().toString(36);
28319:       if(!label.htmlFor)label.htmlFor=control.id;
28320:     });
28321:     root.querySelectorAll('button').forEach(btn=>{
28322:       const txt=String(btn.textContent||'').replace(/\s+/g,' ').trim();
28323:       if(!btn.getAttribute('aria-label')&&txt)btn.setAttribute('aria-label',txt);
28324:     });
28325:     root.querySelectorAll('[title]').forEach(el=>{
28326:       const raw=String(el.getAttribute('title')||'').trim(),next=SIMPLE_TEXT[raw];
28327:       if(next)el.setAttribute('title',next);
28328:     });
28329:     root.querySelectorAll('[aria-label]').forEach(el=>{
28330:       const raw=String(el.getAttribute('aria-label')||'').trim(),next=SIMPLE_TEXT[raw];
28331:       if(next)el.setAttribute('aria-label',next);
28332:     });
28333:     root.querySelectorAll('.loading,.loading-state,[data-loading]').forEach(el=>{el.setAttribute('role','status');el.setAttribute('aria-live','polite');});
28334:     root.querySelectorAll('.error,.error-state').forEach(el=>{el.setAttribute('role','alert');el.setAttribute('aria-live','assertive');});
28335:   }
28336: 
28337:   function simplifyNavigation(){
28338:     document.querySelectorAll('.nav-btn[data-view]').forEach(btn=>{
28339:       const name=VIEW_NAMES[btn.dataset.view];if(name)setOwnText(btn,name);
28340:     });
~~~

## copilot-bg — 5830-5920
~~~text
05830: 
05831: <!-- ============ GLOBAL ERROR POPUP ============
05832:      Satu-satunya modal error di seluruh aplikasi. Dipicu otomatis lewat
05833:      showAppErrorPopup() setiap kali ada error saat pengguna mengklik
05834:      tombol apapun (lihat wiring di kode skrip: monkeypatch
05835:      addEventListener('click', ...) + window.onerror + unhandledrejection). -->
05836: <div class="app-error-modal-bg" id="app-error-modal-bg" role="alertdialog" aria-modal="true" aria-labelledby="app-error-modal-title">
05837:   <div class="app-error-modal">
05838:     <div class="app-error-modal-head">
05839:       <i class="ph-bold ph-warning-circle" aria-hidden="true"></i>
05840:       <h2 id="app-error-modal-title">Terjadi Kesalahan</h2>
05841:       <button class="app-error-modal-close" id="app-error-modal-close" aria-label="Tutup popup error">✕</button>
05842:     </div>
05843:     <div class="app-error-modal-body">
05844:       <p id="app-error-modal-message">Terjadi kesalahan yang tidak diketahui.</p>
05845:       <details id="app-error-modal-details-wrap">
05846:         <summary>Detail teknis</summary>
05847:         <pre id="app-error-modal-detail"></pre>
05848:       </details>
05849:     </div>
05850:     <div class="app-error-modal-actions">
05851:       <button class="btn btn-sm" id="app-error-modal-copy" type="button"><i class="ph-bold ph-copy"></i> Salin Detail</button>
05852:       <button class="btn btn-sm btn-primary" id="app-error-modal-ok" type="button">Tutup</button>
05853:     </div>
05854:   </div>
05855: </div>
05856: 
05857: <!-- ============ AI TANYA JAWAB COPILOT ============
05858:      Internal-first: pertanyaan dicari lebih dulu di data aplikasi yang sudah
05859:      tersedia di browser. AI external hanya dipanggil jika pengguna memilihnya. -->
05860: <button id="copilot-fab" type="button" title="AI Tanya Jawab OMODOS" aria-label="Buka AI Tanya Jawab">
05861:   <span class="copilot-fab-icon">🤖</span>
05862:   <span class="copilot-fab-dot" id="copilot-fab-dot"></span>
05863: </button>
05864: 
05865: <div class="copilot-bg" id="copilot-bg">
05866:   <div class="copilot-panel" id="copilot-panel" role="dialog" aria-modal="true" aria-labelledby="copilot-title">
05867:     <div class="copilot-head">
05868:       <div>
05869:         <div class="copilot-title" id="copilot-title">🤖 AI Tanya Jawab OMODOS</div>
05870:         <div class="copilot-ctx" id="copilot-ctx">Internal terlebih dahulu · seluruh data aplikasi yang tersedia</div>
05871:       </div>
05872:       <button class="modal-close" id="copilot-close" type="button" aria-label="Tutup Copilot">✕</button>
05873:     </div>
05874:     <div id="copilot-body" class="copilot-body" aria-live="polite">
05875:       <div class="copilot-welcome">Tanyakan data atau hal yang ada di OMODOS, misalnya status pekerjaan, histori mesin, material sparepart, personil, KPI, project, meeting, patrol, atau Knowledge Base. Untuk pertanyaan mesin, AI Internal mencari lintas seluruh database aplikasi, bukan hanya halaman yang sedang dibuka.</div>
05876:     </div>
05877:     <div class="copilot-composer">
05878:       <textarea id="copilot-question" placeholder="Tanyakan sesuatu tentang data/aplikasi OMODOS..." aria-label="Pertanyaan Copilot"></textarea>
05879:       <div class="copilot-actions">
05880:         <button class="btn btn-primary btn-sm" type="button" id="copilot-ask-internal"><i class="ph-bold ph-magnifying-glass"></i> Tanya Internal</button>
05881:         <button class="btn btn-sm" type="button" id="copilot-ask-external" disabled><i class="ph-bold ph-sparkle"></i> AI External</button>
05882:         <button class="btn btn-sm btn-ghost" type="button" id="copilot-clear-data" title="Bersihkan percakapan dan konteks pencarian Copilot; tidak menghapus database aplikasi"><i class="ph-bold ph-broom"></i> Bersihkan Data</button>
05883:       </div>
05884:       <div class="copilot-footnote">AI External hanya digunakan bila Anda memilih tombolnya. Konteks yang dikirim dibatasi pada data internal yang relevan dengan pertanyaan.</div>
05885:     </div>
05886:   </div>
05887: </div>
05888: 
05889: <script>
05890: 
05891: /* =========================================================
05892:    GLOBAL ERROR POPUP
05893:    =========================================================
05894:    Tujuan: setiap kali ada error saat pengguna mengklik tombol APAPUN di
05895:    seluruh aplikasi, muncul popup berisi keterangan errornya — bukan cuma
05896:    diam/gagal senyap. Diletakkan paling awal di <script> supaya monkeypatch
05897:    addEventListener di bawah ini aktif SEBELUM listener tombol lain di
05898:    kode ini didaftarkan (termasuk tombol yang dirender dinamis belakangan).
05899: 
05900:    Ada 3 lapis penangkapan supaya cakupannya menyeluruh:
05901:    1) Monkeypatch EventTarget.addEventListener khusus event 'click':
05902:       setiap click-handler dibungkus try/catch (untuk error sinkron) dan
05903:       .catch() (untuk handler async/Promise) tanpa perlu mengubah satu per
05904:       satu handler tombol yang sudah ada di seluruh aplikasi.
05905:    2) window 'error' — jaring pengaman untuk error runtime lain yang lolos
05906:       (mis. dipicu dari onclick inline atau kode di luar addEventListener).
05907:    3) window 'unhandledrejection' — menangkap Promise/async yang reject
05908:       tanpa .catch (mis. pola `apiPost(...).then(...)` tanpa `.catch`). */
05909: (function(){
05910:   function extractErrorInfo(err){
05911:     if(err instanceof Error){
05912:       return { message: err.message || 'Terjadi kesalahan.', detail: err.stack || String(err) };
05913:     }
05914:     if(typeof err === 'string'){
05915:       return { message: err, detail: err };
05916:     }
05917:     try{
05918:       return { message: (err && err.message) || 'Terjadi kesalahan yang tidak diketahui.', detail: JSON.stringify(err, null, 2) };
05919:     }catch(e){
05920:       return { message: 'Terjadi kesalahan yang tidak diketahui.', detail: String(err) };
~~~

## copilot-body — 5839-5929
~~~text
05839:       <i class="ph-bold ph-warning-circle" aria-hidden="true"></i>
05840:       <h2 id="app-error-modal-title">Terjadi Kesalahan</h2>
05841:       <button class="app-error-modal-close" id="app-error-modal-close" aria-label="Tutup popup error">✕</button>
05842:     </div>
05843:     <div class="app-error-modal-body">
05844:       <p id="app-error-modal-message">Terjadi kesalahan yang tidak diketahui.</p>
05845:       <details id="app-error-modal-details-wrap">
05846:         <summary>Detail teknis</summary>
05847:         <pre id="app-error-modal-detail"></pre>
05848:       </details>
05849:     </div>
05850:     <div class="app-error-modal-actions">
05851:       <button class="btn btn-sm" id="app-error-modal-copy" type="button"><i class="ph-bold ph-copy"></i> Salin Detail</button>
05852:       <button class="btn btn-sm btn-primary" id="app-error-modal-ok" type="button">Tutup</button>
05853:     </div>
05854:   </div>
05855: </div>
05856: 
05857: <!-- ============ AI TANYA JAWAB COPILOT ============
05858:      Internal-first: pertanyaan dicari lebih dulu di data aplikasi yang sudah
05859:      tersedia di browser. AI external hanya dipanggil jika pengguna memilihnya. -->
05860: <button id="copilot-fab" type="button" title="AI Tanya Jawab OMODOS" aria-label="Buka AI Tanya Jawab">
05861:   <span class="copilot-fab-icon">🤖</span>
05862:   <span class="copilot-fab-dot" id="copilot-fab-dot"></span>
05863: </button>
05864: 
05865: <div class="copilot-bg" id="copilot-bg">
05866:   <div class="copilot-panel" id="copilot-panel" role="dialog" aria-modal="true" aria-labelledby="copilot-title">
05867:     <div class="copilot-head">
05868:       <div>
05869:         <div class="copilot-title" id="copilot-title">🤖 AI Tanya Jawab OMODOS</div>
05870:         <div class="copilot-ctx" id="copilot-ctx">Internal terlebih dahulu · seluruh data aplikasi yang tersedia</div>
05871:       </div>
05872:       <button class="modal-close" id="copilot-close" type="button" aria-label="Tutup Copilot">✕</button>
05873:     </div>
05874:     <div id="copilot-body" class="copilot-body" aria-live="polite">
05875:       <div class="copilot-welcome">Tanyakan data atau hal yang ada di OMODOS, misalnya status pekerjaan, histori mesin, material sparepart, personil, KPI, project, meeting, patrol, atau Knowledge Base. Untuk pertanyaan mesin, AI Internal mencari lintas seluruh database aplikasi, bukan hanya halaman yang sedang dibuka.</div>
05876:     </div>
05877:     <div class="copilot-composer">
05878:       <textarea id="copilot-question" placeholder="Tanyakan sesuatu tentang data/aplikasi OMODOS..." aria-label="Pertanyaan Copilot"></textarea>
05879:       <div class="copilot-actions">
05880:         <button class="btn btn-primary btn-sm" type="button" id="copilot-ask-internal"><i class="ph-bold ph-magnifying-glass"></i> Tanya Internal</button>
05881:         <button class="btn btn-sm" type="button" id="copilot-ask-external" disabled><i class="ph-bold ph-sparkle"></i> AI External</button>
05882:         <button class="btn btn-sm btn-ghost" type="button" id="copilot-clear-data" title="Bersihkan percakapan dan konteks pencarian Copilot; tidak menghapus database aplikasi"><i class="ph-bold ph-broom"></i> Bersihkan Data</button>
05883:       </div>
05884:       <div class="copilot-footnote">AI External hanya digunakan bila Anda memilih tombolnya. Konteks yang dikirim dibatasi pada data internal yang relevan dengan pertanyaan.</div>
05885:     </div>
05886:   </div>
05887: </div>
05888: 
05889: <script>
05890: 
05891: /* =========================================================
05892:    GLOBAL ERROR POPUP
05893:    =========================================================
05894:    Tujuan: setiap kali ada error saat pengguna mengklik tombol APAPUN di
05895:    seluruh aplikasi, muncul popup berisi keterangan errornya — bukan cuma
05896:    diam/gagal senyap. Diletakkan paling awal di <script> supaya monkeypatch
05897:    addEventListener di bawah ini aktif SEBELUM listener tombol lain di
05898:    kode ini didaftarkan (termasuk tombol yang dirender dinamis belakangan).
05899: 
05900:    Ada 3 lapis penangkapan supaya cakupannya menyeluruh:
05901:    1) Monkeypatch EventTarget.addEventListener khusus event 'click':
05902:       setiap click-handler dibungkus try/catch (untuk error sinkron) dan
05903:       .catch() (untuk handler async/Promise) tanpa perlu mengubah satu per
05904:       satu handler tombol yang sudah ada di seluruh aplikasi.
05905:    2) window 'error' — jaring pengaman untuk error runtime lain yang lolos
05906:       (mis. dipicu dari onclick inline atau kode di luar addEventListener).
05907:    3) window 'unhandledrejection' — menangkap Promise/async yang reject
05908:       tanpa .catch (mis. pola `apiPost(...).then(...)` tanpa `.catch`). */
05909: (function(){
05910:   function extractErrorInfo(err){
05911:     if(err instanceof Error){
05912:       return { message: err.message || 'Terjadi kesalahan.', detail: err.stack || String(err) };
05913:     }
05914:     if(typeof err === 'string'){
05915:       return { message: err, detail: err };
05916:     }
05917:     try{
05918:       return { message: (err && err.message) || 'Terjadi kesalahan yang tidak diketahui.', detail: JSON.stringify(err, null, 2) };
05919:     }catch(e){
05920:       return { message: 'Terjadi kesalahan yang tidak diketahui.', detail: String(err) };
05921:     }
05922:   }
05923: 
05924:   function showAppErrorPopup(err, context){
05925:     const info = extractErrorInfo(err);
05926:     console.error('[App Error]' + (context ? ' [' + context + ']' : ''), err);
05927:     const bg = document.getElementById('app-error-modal-bg');
05928:     if(!bg){ return; } // markup belum siap (mis. error terjadi sebelum DOM termuat)
05929:     const msgEl = document.getElementById('app-error-modal-message');
~~~

## copilot-close — 5837-5927
~~~text
05837:   <div class="app-error-modal">
05838:     <div class="app-error-modal-head">
05839:       <i class="ph-bold ph-warning-circle" aria-hidden="true"></i>
05840:       <h2 id="app-error-modal-title">Terjadi Kesalahan</h2>
05841:       <button class="app-error-modal-close" id="app-error-modal-close" aria-label="Tutup popup error">✕</button>
05842:     </div>
05843:     <div class="app-error-modal-body">
05844:       <p id="app-error-modal-message">Terjadi kesalahan yang tidak diketahui.</p>
05845:       <details id="app-error-modal-details-wrap">
05846:         <summary>Detail teknis</summary>
05847:         <pre id="app-error-modal-detail"></pre>
05848:       </details>
05849:     </div>
05850:     <div class="app-error-modal-actions">
05851:       <button class="btn btn-sm" id="app-error-modal-copy" type="button"><i class="ph-bold ph-copy"></i> Salin Detail</button>
05852:       <button class="btn btn-sm btn-primary" id="app-error-modal-ok" type="button">Tutup</button>
05853:     </div>
05854:   </div>
05855: </div>
05856: 
05857: <!-- ============ AI TANYA JAWAB COPILOT ============
05858:      Internal-first: pertanyaan dicari lebih dulu di data aplikasi yang sudah
05859:      tersedia di browser. AI external hanya dipanggil jika pengguna memilihnya. -->
05860: <button id="copilot-fab" type="button" title="AI Tanya Jawab OMODOS" aria-label="Buka AI Tanya Jawab">
05861:   <span class="copilot-fab-icon">🤖</span>
05862:   <span class="copilot-fab-dot" id="copilot-fab-dot"></span>
05863: </button>
05864: 
05865: <div class="copilot-bg" id="copilot-bg">
05866:   <div class="copilot-panel" id="copilot-panel" role="dialog" aria-modal="true" aria-labelledby="copilot-title">
05867:     <div class="copilot-head">
05868:       <div>
05869:         <div class="copilot-title" id="copilot-title">🤖 AI Tanya Jawab OMODOS</div>
05870:         <div class="copilot-ctx" id="copilot-ctx">Internal terlebih dahulu · seluruh data aplikasi yang tersedia</div>
05871:       </div>
05872:       <button class="modal-close" id="copilot-close" type="button" aria-label="Tutup Copilot">✕</button>
05873:     </div>
05874:     <div id="copilot-body" class="copilot-body" aria-live="polite">
05875:       <div class="copilot-welcome">Tanyakan data atau hal yang ada di OMODOS, misalnya status pekerjaan, histori mesin, material sparepart, personil, KPI, project, meeting, patrol, atau Knowledge Base. Untuk pertanyaan mesin, AI Internal mencari lintas seluruh database aplikasi, bukan hanya halaman yang sedang dibuka.</div>
05876:     </div>
05877:     <div class="copilot-composer">
05878:       <textarea id="copilot-question" placeholder="Tanyakan sesuatu tentang data/aplikasi OMODOS..." aria-label="Pertanyaan Copilot"></textarea>
05879:       <div class="copilot-actions">
05880:         <button class="btn btn-primary btn-sm" type="button" id="copilot-ask-internal"><i class="ph-bold ph-magnifying-glass"></i> Tanya Internal</button>
05881:         <button class="btn btn-sm" type="button" id="copilot-ask-external" disabled><i class="ph-bold ph-sparkle"></i> AI External</button>
05882:         <button class="btn btn-sm btn-ghost" type="button" id="copilot-clear-data" title="Bersihkan percakapan dan konteks pencarian Copilot; tidak menghapus database aplikasi"><i class="ph-bold ph-broom"></i> Bersihkan Data</button>
05883:       </div>
05884:       <div class="copilot-footnote">AI External hanya digunakan bila Anda memilih tombolnya. Konteks yang dikirim dibatasi pada data internal yang relevan dengan pertanyaan.</div>
05885:     </div>
05886:   </div>
05887: </div>
05888: 
05889: <script>
05890: 
05891: /* =========================================================
05892:    GLOBAL ERROR POPUP
05893:    =========================================================
05894:    Tujuan: setiap kali ada error saat pengguna mengklik tombol APAPUN di
05895:    seluruh aplikasi, muncul popup berisi keterangan errornya — bukan cuma
05896:    diam/gagal senyap. Diletakkan paling awal di <script> supaya monkeypatch
05897:    addEventListener di bawah ini aktif SEBELUM listener tombol lain di
05898:    kode ini didaftarkan (termasuk tombol yang dirender dinamis belakangan).
05899: 
05900:    Ada 3 lapis penangkapan supaya cakupannya menyeluruh:
05901:    1) Monkeypatch EventTarget.addEventListener khusus event 'click':
05902:       setiap click-handler dibungkus try/catch (untuk error sinkron) dan
05903:       .catch() (untuk handler async/Promise) tanpa perlu mengubah satu per
05904:       satu handler tombol yang sudah ada di seluruh aplikasi.
05905:    2) window 'error' — jaring pengaman untuk error runtime lain yang lolos
05906:       (mis. dipicu dari onclick inline atau kode di luar addEventListener).
05907:    3) window 'unhandledrejection' — menangkap Promise/async yang reject
05908:       tanpa .catch (mis. pola `apiPost(...).then(...)` tanpa `.catch`). */
05909: (function(){
05910:   function extractErrorInfo(err){
05911:     if(err instanceof Error){
05912:       return { message: err.message || 'Terjadi kesalahan.', detail: err.stack || String(err) };
05913:     }
05914:     if(typeof err === 'string'){
05915:       return { message: err, detail: err };
05916:     }
05917:     try{
05918:       return { message: (err && err.message) || 'Terjadi kesalahan yang tidak diketahui.', detail: JSON.stringify(err, null, 2) };
05919:     }catch(e){
05920:       return { message: 'Terjadi kesalahan yang tidak diketahui.', detail: String(err) };
05921:     }
05922:   }
05923: 
05924:   function showAppErrorPopup(err, context){
05925:     const info = extractErrorInfo(err);
05926:     console.error('[App Error]' + (context ? ' [' + context + ']' : ''), err);
05927:     const bg = document.getElementById('app-error-modal-bg');
~~~

## copilot-clear — 5847-5937
~~~text
05847:         <pre id="app-error-modal-detail"></pre>
05848:       </details>
05849:     </div>
05850:     <div class="app-error-modal-actions">
05851:       <button class="btn btn-sm" id="app-error-modal-copy" type="button"><i class="ph-bold ph-copy"></i> Salin Detail</button>
05852:       <button class="btn btn-sm btn-primary" id="app-error-modal-ok" type="button">Tutup</button>
05853:     </div>
05854:   </div>
05855: </div>
05856: 
05857: <!-- ============ AI TANYA JAWAB COPILOT ============
05858:      Internal-first: pertanyaan dicari lebih dulu di data aplikasi yang sudah
05859:      tersedia di browser. AI external hanya dipanggil jika pengguna memilihnya. -->
05860: <button id="copilot-fab" type="button" title="AI Tanya Jawab OMODOS" aria-label="Buka AI Tanya Jawab">
05861:   <span class="copilot-fab-icon">🤖</span>
05862:   <span class="copilot-fab-dot" id="copilot-fab-dot"></span>
05863: </button>
05864: 
05865: <div class="copilot-bg" id="copilot-bg">
05866:   <div class="copilot-panel" id="copilot-panel" role="dialog" aria-modal="true" aria-labelledby="copilot-title">
05867:     <div class="copilot-head">
05868:       <div>
05869:         <div class="copilot-title" id="copilot-title">🤖 AI Tanya Jawab OMODOS</div>
05870:         <div class="copilot-ctx" id="copilot-ctx">Internal terlebih dahulu · seluruh data aplikasi yang tersedia</div>
05871:       </div>
05872:       <button class="modal-close" id="copilot-close" type="button" aria-label="Tutup Copilot">✕</button>
05873:     </div>
05874:     <div id="copilot-body" class="copilot-body" aria-live="polite">
05875:       <div class="copilot-welcome">Tanyakan data atau hal yang ada di OMODOS, misalnya status pekerjaan, histori mesin, material sparepart, personil, KPI, project, meeting, patrol, atau Knowledge Base. Untuk pertanyaan mesin, AI Internal mencari lintas seluruh database aplikasi, bukan hanya halaman yang sedang dibuka.</div>
05876:     </div>
05877:     <div class="copilot-composer">
05878:       <textarea id="copilot-question" placeholder="Tanyakan sesuatu tentang data/aplikasi OMODOS..." aria-label="Pertanyaan Copilot"></textarea>
05879:       <div class="copilot-actions">
05880:         <button class="btn btn-primary btn-sm" type="button" id="copilot-ask-internal"><i class="ph-bold ph-magnifying-glass"></i> Tanya Internal</button>
05881:         <button class="btn btn-sm" type="button" id="copilot-ask-external" disabled><i class="ph-bold ph-sparkle"></i> AI External</button>
05882:         <button class="btn btn-sm btn-ghost" type="button" id="copilot-clear-data" title="Bersihkan percakapan dan konteks pencarian Copilot; tidak menghapus database aplikasi"><i class="ph-bold ph-broom"></i> Bersihkan Data</button>
05883:       </div>
05884:       <div class="copilot-footnote">AI External hanya digunakan bila Anda memilih tombolnya. Konteks yang dikirim dibatasi pada data internal yang relevan dengan pertanyaan.</div>
05885:     </div>
05886:   </div>
05887: </div>
05888: 
05889: <script>
05890: 
05891: /* =========================================================
05892:    GLOBAL ERROR POPUP
05893:    =========================================================
05894:    Tujuan: setiap kali ada error saat pengguna mengklik tombol APAPUN di
05895:    seluruh aplikasi, muncul popup berisi keterangan errornya — bukan cuma
05896:    diam/gagal senyap. Diletakkan paling awal di <script> supaya monkeypatch
05897:    addEventListener di bawah ini aktif SEBELUM listener tombol lain di
05898:    kode ini didaftarkan (termasuk tombol yang dirender dinamis belakangan).
05899: 
05900:    Ada 3 lapis penangkapan supaya cakupannya menyeluruh:
05901:    1) Monkeypatch EventTarget.addEventListener khusus event 'click':
05902:       setiap click-handler dibungkus try/catch (untuk error sinkron) dan
05903:       .catch() (untuk handler async/Promise) tanpa perlu mengubah satu per
05904:       satu handler tombol yang sudah ada di seluruh aplikasi.
05905:    2) window 'error' — jaring pengaman untuk error runtime lain yang lolos
05906:       (mis. dipicu dari onclick inline atau kode di luar addEventListener).
05907:    3) window 'unhandledrejection' — menangkap Promise/async yang reject
05908:       tanpa .catch (mis. pola `apiPost(...).then(...)` tanpa `.catch`). */
05909: (function(){
05910:   function extractErrorInfo(err){
05911:     if(err instanceof Error){
05912:       return { message: err.message || 'Terjadi kesalahan.', detail: err.stack || String(err) };
05913:     }
05914:     if(typeof err === 'string'){
05915:       return { message: err, detail: err };
05916:     }
05917:     try{
05918:       return { message: (err && err.message) || 'Terjadi kesalahan yang tidak diketahui.', detail: JSON.stringify(err, null, 2) };
05919:     }catch(e){
05920:       return { message: 'Terjadi kesalahan yang tidak diketahui.', detail: String(err) };
05921:     }
05922:   }
05923: 
05924:   function showAppErrorPopup(err, context){
05925:     const info = extractErrorInfo(err);
05926:     console.error('[App Error]' + (context ? ' [' + context + ']' : ''), err);
05927:     const bg = document.getElementById('app-error-modal-bg');
05928:     if(!bg){ return; } // markup belum siap (mis. error terjadi sebelum DOM termuat)
05929:     const msgEl = document.getElementById('app-error-modal-message');
05930:     const detailEl = document.getElementById('app-error-modal-detail');
05931:     if(msgEl) msgEl.textContent = info.message + (context ? '  (pada: ' + context + ')' : '');
05932:     if(detailEl) detailEl.textContent = info.detail;
05933:     bg.classList.add('active');
05934:   }
05935:   // Expose global supaya bisa dipanggil manual dari bagian kode lain kalau perlu
05936:   // (mis. dari blok catch yang sudah ada) tanpa perlu menduplikasi UI modal.
05937:   window.showAppErrorPopup = showAppErrorPopup;
~~~

## copilot-question — 5843-5933
~~~text
05843:     <div class="app-error-modal-body">
05844:       <p id="app-error-modal-message">Terjadi kesalahan yang tidak diketahui.</p>
05845:       <details id="app-error-modal-details-wrap">
05846:         <summary>Detail teknis</summary>
05847:         <pre id="app-error-modal-detail"></pre>
05848:       </details>
05849:     </div>
05850:     <div class="app-error-modal-actions">
05851:       <button class="btn btn-sm" id="app-error-modal-copy" type="button"><i class="ph-bold ph-copy"></i> Salin Detail</button>
05852:       <button class="btn btn-sm btn-primary" id="app-error-modal-ok" type="button">Tutup</button>
05853:     </div>
05854:   </div>
05855: </div>
05856: 
05857: <!-- ============ AI TANYA JAWAB COPILOT ============
05858:      Internal-first: pertanyaan dicari lebih dulu di data aplikasi yang sudah
05859:      tersedia di browser. AI external hanya dipanggil jika pengguna memilihnya. -->
05860: <button id="copilot-fab" type="button" title="AI Tanya Jawab OMODOS" aria-label="Buka AI Tanya Jawab">
05861:   <span class="copilot-fab-icon">🤖</span>
05862:   <span class="copilot-fab-dot" id="copilot-fab-dot"></span>
05863: </button>
05864: 
05865: <div class="copilot-bg" id="copilot-bg">
05866:   <div class="copilot-panel" id="copilot-panel" role="dialog" aria-modal="true" aria-labelledby="copilot-title">
05867:     <div class="copilot-head">
05868:       <div>
05869:         <div class="copilot-title" id="copilot-title">🤖 AI Tanya Jawab OMODOS</div>
05870:         <div class="copilot-ctx" id="copilot-ctx">Internal terlebih dahulu · seluruh data aplikasi yang tersedia</div>
05871:       </div>
05872:       <button class="modal-close" id="copilot-close" type="button" aria-label="Tutup Copilot">✕</button>
05873:     </div>
05874:     <div id="copilot-body" class="copilot-body" aria-live="polite">
05875:       <div class="copilot-welcome">Tanyakan data atau hal yang ada di OMODOS, misalnya status pekerjaan, histori mesin, material sparepart, personil, KPI, project, meeting, patrol, atau Knowledge Base. Untuk pertanyaan mesin, AI Internal mencari lintas seluruh database aplikasi, bukan hanya halaman yang sedang dibuka.</div>
05876:     </div>
05877:     <div class="copilot-composer">
05878:       <textarea id="copilot-question" placeholder="Tanyakan sesuatu tentang data/aplikasi OMODOS..." aria-label="Pertanyaan Copilot"></textarea>
05879:       <div class="copilot-actions">
05880:         <button class="btn btn-primary btn-sm" type="button" id="copilot-ask-internal"><i class="ph-bold ph-magnifying-glass"></i> Tanya Internal</button>
05881:         <button class="btn btn-sm" type="button" id="copilot-ask-external" disabled><i class="ph-bold ph-sparkle"></i> AI External</button>
05882:         <button class="btn btn-sm btn-ghost" type="button" id="copilot-clear-data" title="Bersihkan percakapan dan konteks pencarian Copilot; tidak menghapus database aplikasi"><i class="ph-bold ph-broom"></i> Bersihkan Data</button>
05883:       </div>
05884:       <div class="copilot-footnote">AI External hanya digunakan bila Anda memilih tombolnya. Konteks yang dikirim dibatasi pada data internal yang relevan dengan pertanyaan.</div>
05885:     </div>
05886:   </div>
05887: </div>
05888: 
05889: <script>
05890: 
05891: /* =========================================================
05892:    GLOBAL ERROR POPUP
05893:    =========================================================
05894:    Tujuan: setiap kali ada error saat pengguna mengklik tombol APAPUN di
05895:    seluruh aplikasi, muncul popup berisi keterangan errornya — bukan cuma
05896:    diam/gagal senyap. Diletakkan paling awal di <script> supaya monkeypatch
05897:    addEventListener di bawah ini aktif SEBELUM listener tombol lain di
05898:    kode ini didaftarkan (termasuk tombol yang dirender dinamis belakangan).
05899: 
05900:    Ada 3 lapis penangkapan supaya cakupannya menyeluruh:
05901:    1) Monkeypatch EventTarget.addEventListener khusus event 'click':
05902:       setiap click-handler dibungkus try/catch (untuk error sinkron) dan
05903:       .catch() (untuk handler async/Promise) tanpa perlu mengubah satu per
05904:       satu handler tombol yang sudah ada di seluruh aplikasi.
05905:    2) window 'error' — jaring pengaman untuk error runtime lain yang lolos
05906:       (mis. dipicu dari onclick inline atau kode di luar addEventListener).
05907:    3) window 'unhandledrejection' — menangkap Promise/async yang reject
05908:       tanpa .catch (mis. pola `apiPost(...).then(...)` tanpa `.catch`). */
05909: (function(){
05910:   function extractErrorInfo(err){
05911:     if(err instanceof Error){
05912:       return { message: err.message || 'Terjadi kesalahan.', detail: err.stack || String(err) };
05913:     }
05914:     if(typeof err === 'string'){
05915:       return { message: err, detail: err };
05916:     }
05917:     try{
05918:       return { message: (err && err.message) || 'Terjadi kesalahan yang tidak diketahui.', detail: JSON.stringify(err, null, 2) };
05919:     }catch(e){
05920:       return { message: 'Terjadi kesalahan yang tidak diketahui.', detail: String(err) };
05921:     }
05922:   }
05923: 
05924:   function showAppErrorPopup(err, context){
05925:     const info = extractErrorInfo(err);
05926:     console.error('[App Error]' + (context ? ' [' + context + ']' : ''), err);
05927:     const bg = document.getElementById('app-error-modal-bg');
05928:     if(!bg){ return; } // markup belum siap (mis. error terjadi sebelum DOM termuat)
05929:     const msgEl = document.getElementById('app-error-modal-message');
05930:     const detailEl = document.getElementById('app-error-modal-detail');
05931:     if(msgEl) msgEl.textContent = info.message + (context ? '  (pada: ' + context + ')' : '');
05932:     if(detailEl) detailEl.textContent = info.detail;
05933:     bg.classList.add('active');
~~~

