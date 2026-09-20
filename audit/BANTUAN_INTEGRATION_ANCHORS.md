# Bantuan Integration Anchors

## legacy-simple-guide — 13
### Around source line 28110
~~~text
28092:     const closest=root&&root.nodeType===1&&root.closest?root.closest('table'):null;
28093:     if(closest) enhanceTable(closest);
28094:   }
28095:   const run=()=>scan(document);
28096:   if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run); else run();
28097:   const obs=new MutationObserver(muts=>muts.forEach(m=>{
28098:     if(m.target&&m.target.nodeType===1){
28099:       const t=m.target.closest&&m.target.closest('table');
28100:       if(t) enhanceTable(t);
28101:     }
28102:     m.addedNodes.forEach(n=>{ if(n.nodeType===1) scan(n); });
28103:   }));
28104:   obs.observe(document.body,{childList:true,subtree:true,characterData:false});
28105:   window.addEventListener('resize',()=>document.querySelectorAll('table.omodos-responsive-table').forEach(enhanceTable),{passive:true});
28106: })();
28107: </script>
28108: 
28109: <style id="legacy-low-cognitive-style">
28110: .legacy-simple-guide{margin:10px 0 14px;padding:14px 16px;border:1px solid color-mix(in srgb,var(--accent,#3b82f6) 30%,var(--line,#d9dee7));border-radius:14px;background:color-mix(in srgb,var(--panel,#fff) 93%,var(--accent,#3b82f6) 7%);display:grid;gap:8px}
28111: .legacy-simple-guide-title{font:800 17px/1.25 var(--font-display,system-ui);color:var(--text,#152238)}
28112: .legacy-simple-guide-purpose{font:600 13px/1.55 var(--font-body,system-ui);color:var(--text,#152238)}
28113: .legacy-simple-guide-steps{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
28114: .legacy-simple-step{padding:10px 12px;border:1px solid var(--line-soft,#e6eaf0);border-radius:10px;background:var(--panel,#fff);font:600 12.5px/1.5 var(--font-body,system-ui);color:var(--text,#152238)}
28115: .legacy-simple-step b{display:inline-grid;place-items:center;width:22px;height:22px;margin-right:6px;border-radius:999px;background:var(--accent,#3b82f6);color:#fff}
28116: .legacy-simple-glossary{margin-top:2px}
28117: .legacy-simple-glossary>summary{cursor:pointer;font:700 12px/1.4 var(--font-body,system-ui);color:var(--text-dim,#586579);min-height:38px;display:flex;align-items:center}
28118: .legacy-simple-glossary-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;padding-top:6px}
28119: .legacy-simple-glossary-grid div{padding:8px 10px;border:1px solid var(--line-soft,#e6eaf0);border-radius:9px;background:var(--panel-2,#f7f9fc)}
28120: .legacy-simple-glossary-grid b{display:block;font-size:11.5px;color:var(--text,#152238)}
28121: .legacy-simple-glossary-grid span{display:block;margin-top:2px;font:500 11.5px/1.45 var(--font-body,system-ui);color:var(--text-dim,#586579)}
28122: .legacy-simple-helper{font:500 11.5px/1.45 var(--font-body,system-ui);color:var(--text-dim,#586579)}
28123: body.low-cognitive .legacy-simple-guide{padding:16px 18px}
28124: body.low-cognitive .legacy-simple-guide-title{font-size:19px}
28125: body.low-cognitive .legacy-simple-guide-purpose,body.low-cognitive .legacy-simple-step{font-size:14px}
28126: @media(max-width:760px){.legacy-simple-guide-steps,.legacy-simple-glossary-grid{grid-template-columns:1fr}.legacy-simple-guide{margin:8px 0 12px;padding:12px}.legacy-simple-step{min-height:44px}}
28127: /* Readability floor for legacy micro-labels that were previously 7.5–9.5px. */
28128: .bottom-nav-btn{font-size:10.5px!important;min-height:44px}
28129: .copilot-summary-label,.copilot-category-title small,.copilot-count-badge,.copilot-record-index,.copilot-scope-lock small,
28130: .copilot-kv-key,.copilot-external-kv span,.mtl-src-badge,.dash-card .dc-kode,.pmc-gantt-bar,
28131: .rbac-feature-key,.btn-why-remove{font-size:10.5px!important;line-height:1.35!important}
28132: table.omodos-responsive-table>tbody>tr>td::before,#sparepart-lokasi-table td::before{font-size:10.5px!important;line-height:1.35!important}
28133: </style>
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
~~~

### Around source line 28111
~~~text
28093:     if(closest) enhanceTable(closest);
28094:   }
28095:   const run=()=>scan(document);
28096:   if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run); else run();
28097:   const obs=new MutationObserver(muts=>muts.forEach(m=>{
28098:     if(m.target&&m.target.nodeType===1){
28099:       const t=m.target.closest&&m.target.closest('table');
28100:       if(t) enhanceTable(t);
28101:     }
28102:     m.addedNodes.forEach(n=>{ if(n.nodeType===1) scan(n); });
28103:   }));
28104:   obs.observe(document.body,{childList:true,subtree:true,characterData:false});
28105:   window.addEventListener('resize',()=>document.querySelectorAll('table.omodos-responsive-table').forEach(enhanceTable),{passive:true});
28106: })();
28107: </script>
28108: 
28109: <style id="legacy-low-cognitive-style">
28110: .legacy-simple-guide{margin:10px 0 14px;padding:14px 16px;border:1px solid color-mix(in srgb,var(--accent,#3b82f6) 30%,var(--line,#d9dee7));border-radius:14px;background:color-mix(in srgb,var(--panel,#fff) 93%,var(--accent,#3b82f6) 7%);display:grid;gap:8px}
28111: .legacy-simple-guide-title{font:800 17px/1.25 var(--font-display,system-ui);color:var(--text,#152238)}
28112: .legacy-simple-guide-purpose{font:600 13px/1.55 var(--font-body,system-ui);color:var(--text,#152238)}
28113: .legacy-simple-guide-steps{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
28114: .legacy-simple-step{padding:10px 12px;border:1px solid var(--line-soft,#e6eaf0);border-radius:10px;background:var(--panel,#fff);font:600 12.5px/1.5 var(--font-body,system-ui);color:var(--text,#152238)}
28115: .legacy-simple-step b{display:inline-grid;place-items:center;width:22px;height:22px;margin-right:6px;border-radius:999px;background:var(--accent,#3b82f6);color:#fff}
28116: .legacy-simple-glossary{margin-top:2px}
28117: .legacy-simple-glossary>summary{cursor:pointer;font:700 12px/1.4 var(--font-body,system-ui);color:var(--text-dim,#586579);min-height:38px;display:flex;align-items:center}
28118: .legacy-simple-glossary-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;padding-top:6px}
28119: .legacy-simple-glossary-grid div{padding:8px 10px;border:1px solid var(--line-soft,#e6eaf0);border-radius:9px;background:var(--panel-2,#f7f9fc)}
28120: .legacy-simple-glossary-grid b{display:block;font-size:11.5px;color:var(--text,#152238)}
28121: .legacy-simple-glossary-grid span{display:block;margin-top:2px;font:500 11.5px/1.45 var(--font-body,system-ui);color:var(--text-dim,#586579)}
28122: .legacy-simple-helper{font:500 11.5px/1.45 var(--font-body,system-ui);color:var(--text-dim,#586579)}
28123: body.low-cognitive .legacy-simple-guide{padding:16px 18px}
28124: body.low-cognitive .legacy-simple-guide-title{font-size:19px}
28125: body.low-cognitive .legacy-simple-guide-purpose,body.low-cognitive .legacy-simple-step{font-size:14px}
28126: @media(max-width:760px){.legacy-simple-guide-steps,.legacy-simple-glossary-grid{grid-template-columns:1fr}.legacy-simple-guide{margin:8px 0 12px;padding:12px}.legacy-simple-step{min-height:44px}}
28127: /* Readability floor for legacy micro-labels that were previously 7.5–9.5px. */
28128: .bottom-nav-btn{font-size:10.5px!important;min-height:44px}
28129: .copilot-summary-label,.copilot-category-title small,.copilot-count-badge,.copilot-record-index,.copilot-scope-lock small,
28130: .copilot-kv-key,.copilot-external-kv span,.mtl-src-badge,.dash-card .dc-kode,.pmc-gantt-bar,
28131: .rbac-feature-key,.btn-why-remove{font-size:10.5px!important;line-height:1.35!important}
28132: table.omodos-responsive-table>tbody>tr>td::before,#sparepart-lokasi-table td::before{font-size:10.5px!important;line-height:1.35!important}
28133: </style>
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
~~~

### Around source line 28112
~~~text
28094:   }
28095:   const run=()=>scan(document);
28096:   if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run); else run();
28097:   const obs=new MutationObserver(muts=>muts.forEach(m=>{
28098:     if(m.target&&m.target.nodeType===1){
28099:       const t=m.target.closest&&m.target.closest('table');
28100:       if(t) enhanceTable(t);
28101:     }
28102:     m.addedNodes.forEach(n=>{ if(n.nodeType===1) scan(n); });
28103:   }));
28104:   obs.observe(document.body,{childList:true,subtree:true,characterData:false});
28105:   window.addEventListener('resize',()=>document.querySelectorAll('table.omodos-responsive-table').forEach(enhanceTable),{passive:true});
28106: })();
28107: </script>
28108: 
28109: <style id="legacy-low-cognitive-style">
28110: .legacy-simple-guide{margin:10px 0 14px;padding:14px 16px;border:1px solid color-mix(in srgb,var(--accent,#3b82f6) 30%,var(--line,#d9dee7));border-radius:14px;background:color-mix(in srgb,var(--panel,#fff) 93%,var(--accent,#3b82f6) 7%);display:grid;gap:8px}
28111: .legacy-simple-guide-title{font:800 17px/1.25 var(--font-display,system-ui);color:var(--text,#152238)}
28112: .legacy-simple-guide-purpose{font:600 13px/1.55 var(--font-body,system-ui);color:var(--text,#152238)}
28113: .legacy-simple-guide-steps{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
28114: .legacy-simple-step{padding:10px 12px;border:1px solid var(--line-soft,#e6eaf0);border-radius:10px;background:var(--panel,#fff);font:600 12.5px/1.5 var(--font-body,system-ui);color:var(--text,#152238)}
28115: .legacy-simple-step b{display:inline-grid;place-items:center;width:22px;height:22px;margin-right:6px;border-radius:999px;background:var(--accent,#3b82f6);color:#fff}
28116: .legacy-simple-glossary{margin-top:2px}
28117: .legacy-simple-glossary>summary{cursor:pointer;font:700 12px/1.4 var(--font-body,system-ui);color:var(--text-dim,#586579);min-height:38px;display:flex;align-items:center}
28118: .legacy-simple-glossary-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;padding-top:6px}
28119: .legacy-simple-glossary-grid div{padding:8px 10px;border:1px solid var(--line-soft,#e6eaf0);border-radius:9px;background:var(--panel-2,#f7f9fc)}
28120: .legacy-simple-glossary-grid b{display:block;font-size:11.5px;color:var(--text,#152238)}
28121: .legacy-simple-glossary-grid span{display:block;margin-top:2px;font:500 11.5px/1.45 var(--font-body,system-ui);color:var(--text-dim,#586579)}
28122: .legacy-simple-helper{font:500 11.5px/1.45 var(--font-body,system-ui);color:var(--text-dim,#586579)}
28123: body.low-cognitive .legacy-simple-guide{padding:16px 18px}
28124: body.low-cognitive .legacy-simple-guide-title{font-size:19px}
28125: body.low-cognitive .legacy-simple-guide-purpose,body.low-cognitive .legacy-simple-step{font-size:14px}
28126: @media(max-width:760px){.legacy-simple-guide-steps,.legacy-simple-glossary-grid{grid-template-columns:1fr}.legacy-simple-guide{margin:8px 0 12px;padding:12px}.legacy-simple-step{min-height:44px}}
28127: /* Readability floor for legacy micro-labels that were previously 7.5–9.5px. */
28128: .bottom-nav-btn{font-size:10.5px!important;min-height:44px}
28129: .copilot-summary-label,.copilot-category-title small,.copilot-count-badge,.copilot-record-index,.copilot-scope-lock small,
28130: .copilot-kv-key,.copilot-external-kv span,.mtl-src-badge,.dash-card .dc-kode,.pmc-gantt-bar,
28131: .rbac-feature-key,.btn-why-remove{font-size:10.5px!important;line-height:1.35!important}
28132: table.omodos-responsive-table>tbody>tr>td::before,#sparepart-lokasi-table td::before{font-size:10.5px!important;line-height:1.35!important}
28133: </style>
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
~~~

### Around source line 28113
~~~text
28095:   const run=()=>scan(document);
28096:   if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run); else run();
28097:   const obs=new MutationObserver(muts=>muts.forEach(m=>{
28098:     if(m.target&&m.target.nodeType===1){
28099:       const t=m.target.closest&&m.target.closest('table');
28100:       if(t) enhanceTable(t);
28101:     }
28102:     m.addedNodes.forEach(n=>{ if(n.nodeType===1) scan(n); });
28103:   }));
28104:   obs.observe(document.body,{childList:true,subtree:true,characterData:false});
28105:   window.addEventListener('resize',()=>document.querySelectorAll('table.omodos-responsive-table').forEach(enhanceTable),{passive:true});
28106: })();
28107: </script>
28108: 
28109: <style id="legacy-low-cognitive-style">
28110: .legacy-simple-guide{margin:10px 0 14px;padding:14px 16px;border:1px solid color-mix(in srgb,var(--accent,#3b82f6) 30%,var(--line,#d9dee7));border-radius:14px;background:color-mix(in srgb,var(--panel,#fff) 93%,var(--accent,#3b82f6) 7%);display:grid;gap:8px}
28111: .legacy-simple-guide-title{font:800 17px/1.25 var(--font-display,system-ui);color:var(--text,#152238)}
28112: .legacy-simple-guide-purpose{font:600 13px/1.55 var(--font-body,system-ui);color:var(--text,#152238)}
28113: .legacy-simple-guide-steps{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
28114: .legacy-simple-step{padding:10px 12px;border:1px solid var(--line-soft,#e6eaf0);border-radius:10px;background:var(--panel,#fff);font:600 12.5px/1.5 var(--font-body,system-ui);color:var(--text,#152238)}
28115: .legacy-simple-step b{display:inline-grid;place-items:center;width:22px;height:22px;margin-right:6px;border-radius:999px;background:var(--accent,#3b82f6);color:#fff}
28116: .legacy-simple-glossary{margin-top:2px}
28117: .legacy-simple-glossary>summary{cursor:pointer;font:700 12px/1.4 var(--font-body,system-ui);color:var(--text-dim,#586579);min-height:38px;display:flex;align-items:center}
28118: .legacy-simple-glossary-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;padding-top:6px}
28119: .legacy-simple-glossary-grid div{padding:8px 10px;border:1px solid var(--line-soft,#e6eaf0);border-radius:9px;background:var(--panel-2,#f7f9fc)}
28120: .legacy-simple-glossary-grid b{display:block;font-size:11.5px;color:var(--text,#152238)}
28121: .legacy-simple-glossary-grid span{display:block;margin-top:2px;font:500 11.5px/1.45 var(--font-body,system-ui);color:var(--text-dim,#586579)}
28122: .legacy-simple-helper{font:500 11.5px/1.45 var(--font-body,system-ui);color:var(--text-dim,#586579)}
28123: body.low-cognitive .legacy-simple-guide{padding:16px 18px}
28124: body.low-cognitive .legacy-simple-guide-title{font-size:19px}
28125: body.low-cognitive .legacy-simple-guide-purpose,body.low-cognitive .legacy-simple-step{font-size:14px}
28126: @media(max-width:760px){.legacy-simple-guide-steps,.legacy-simple-glossary-grid{grid-template-columns:1fr}.legacy-simple-guide{margin:8px 0 12px;padding:12px}.legacy-simple-step{min-height:44px}}
28127: /* Readability floor for legacy micro-labels that were previously 7.5–9.5px. */
28128: .bottom-nav-btn{font-size:10.5px!important;min-height:44px}
28129: .copilot-summary-label,.copilot-category-title small,.copilot-count-badge,.copilot-record-index,.copilot-scope-lock small,
28130: .copilot-kv-key,.copilot-external-kv span,.mtl-src-badge,.dash-card .dc-kode,.pmc-gantt-bar,
28131: .rbac-feature-key,.btn-why-remove{font-size:10.5px!important;line-height:1.35!important}
28132: table.omodos-responsive-table>tbody>tr>td::before,#sparepart-lokasi-table td::before{font-size:10.5px!important;line-height:1.35!important}
28133: </style>
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
~~~

### Around source line 28123
~~~text
28105:   window.addEventListener('resize',()=>document.querySelectorAll('table.omodos-responsive-table').forEach(enhanceTable),{passive:true});
28106: })();
28107: </script>
28108: 
28109: <style id="legacy-low-cognitive-style">
28110: .legacy-simple-guide{margin:10px 0 14px;padding:14px 16px;border:1px solid color-mix(in srgb,var(--accent,#3b82f6) 30%,var(--line,#d9dee7));border-radius:14px;background:color-mix(in srgb,var(--panel,#fff) 93%,var(--accent,#3b82f6) 7%);display:grid;gap:8px}
28111: .legacy-simple-guide-title{font:800 17px/1.25 var(--font-display,system-ui);color:var(--text,#152238)}
28112: .legacy-simple-guide-purpose{font:600 13px/1.55 var(--font-body,system-ui);color:var(--text,#152238)}
28113: .legacy-simple-guide-steps{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
28114: .legacy-simple-step{padding:10px 12px;border:1px solid var(--line-soft,#e6eaf0);border-radius:10px;background:var(--panel,#fff);font:600 12.5px/1.5 var(--font-body,system-ui);color:var(--text,#152238)}
28115: .legacy-simple-step b{display:inline-grid;place-items:center;width:22px;height:22px;margin-right:6px;border-radius:999px;background:var(--accent,#3b82f6);color:#fff}
28116: .legacy-simple-glossary{margin-top:2px}
28117: .legacy-simple-glossary>summary{cursor:pointer;font:700 12px/1.4 var(--font-body,system-ui);color:var(--text-dim,#586579);min-height:38px;display:flex;align-items:center}
28118: .legacy-simple-glossary-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;padding-top:6px}
28119: .legacy-simple-glossary-grid div{padding:8px 10px;border:1px solid var(--line-soft,#e6eaf0);border-radius:9px;background:var(--panel-2,#f7f9fc)}
28120: .legacy-simple-glossary-grid b{display:block;font-size:11.5px;color:var(--text,#152238)}
28121: .legacy-simple-glossary-grid span{display:block;margin-top:2px;font:500 11.5px/1.45 var(--font-body,system-ui);color:var(--text-dim,#586579)}
28122: .legacy-simple-helper{font:500 11.5px/1.45 var(--font-body,system-ui);color:var(--text-dim,#586579)}
28123: body.low-cognitive .legacy-simple-guide{padding:16px 18px}
28124: body.low-cognitive .legacy-simple-guide-title{font-size:19px}
28125: body.low-cognitive .legacy-simple-guide-purpose,body.low-cognitive .legacy-simple-step{font-size:14px}
28126: @media(max-width:760px){.legacy-simple-guide-steps,.legacy-simple-glossary-grid{grid-template-columns:1fr}.legacy-simple-guide{margin:8px 0 12px;padding:12px}.legacy-simple-step{min-height:44px}}
28127: /* Readability floor for legacy micro-labels that were previously 7.5–9.5px. */
28128: .bottom-nav-btn{font-size:10.5px!important;min-height:44px}
28129: .copilot-summary-label,.copilot-category-title small,.copilot-count-badge,.copilot-record-index,.copilot-scope-lock small,
28130: .copilot-kv-key,.copilot-external-kv span,.mtl-src-badge,.dash-card .dc-kode,.pmc-gantt-bar,
28131: .rbac-feature-key,.btn-why-remove{font-size:10.5px!important;line-height:1.35!important}
28132: table.omodos-responsive-table>tbody>tr>td::before,#sparepart-lokasi-table td::before{font-size:10.5px!important;line-height:1.35!important}
28133: </style>
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
~~~

### Around source line 28124
~~~text
28106: })();
28107: </script>
28108: 
28109: <style id="legacy-low-cognitive-style">
28110: .legacy-simple-guide{margin:10px 0 14px;padding:14px 16px;border:1px solid color-mix(in srgb,var(--accent,#3b82f6) 30%,var(--line,#d9dee7));border-radius:14px;background:color-mix(in srgb,var(--panel,#fff) 93%,var(--accent,#3b82f6) 7%);display:grid;gap:8px}
28111: .legacy-simple-guide-title{font:800 17px/1.25 var(--font-display,system-ui);color:var(--text,#152238)}
28112: .legacy-simple-guide-purpose{font:600 13px/1.55 var(--font-body,system-ui);color:var(--text,#152238)}
28113: .legacy-simple-guide-steps{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
28114: .legacy-simple-step{padding:10px 12px;border:1px solid var(--line-soft,#e6eaf0);border-radius:10px;background:var(--panel,#fff);font:600 12.5px/1.5 var(--font-body,system-ui);color:var(--text,#152238)}
28115: .legacy-simple-step b{display:inline-grid;place-items:center;width:22px;height:22px;margin-right:6px;border-radius:999px;background:var(--accent,#3b82f6);color:#fff}
28116: .legacy-simple-glossary{margin-top:2px}
28117: .legacy-simple-glossary>summary{cursor:pointer;font:700 12px/1.4 var(--font-body,system-ui);color:var(--text-dim,#586579);min-height:38px;display:flex;align-items:center}
28118: .legacy-simple-glossary-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;padding-top:6px}
28119: .legacy-simple-glossary-grid div{padding:8px 10px;border:1px solid var(--line-soft,#e6eaf0);border-radius:9px;background:var(--panel-2,#f7f9fc)}
28120: .legacy-simple-glossary-grid b{display:block;font-size:11.5px;color:var(--text,#152238)}
28121: .legacy-simple-glossary-grid span{display:block;margin-top:2px;font:500 11.5px/1.45 var(--font-body,system-ui);color:var(--text-dim,#586579)}
28122: .legacy-simple-helper{font:500 11.5px/1.45 var(--font-body,system-ui);color:var(--text-dim,#586579)}
28123: body.low-cognitive .legacy-simple-guide{padding:16px 18px}
28124: body.low-cognitive .legacy-simple-guide-title{font-size:19px}
28125: body.low-cognitive .legacy-simple-guide-purpose,body.low-cognitive .legacy-simple-step{font-size:14px}
28126: @media(max-width:760px){.legacy-simple-guide-steps,.legacy-simple-glossary-grid{grid-template-columns:1fr}.legacy-simple-guide{margin:8px 0 12px;padding:12px}.legacy-simple-step{min-height:44px}}
28127: /* Readability floor for legacy micro-labels that were previously 7.5–9.5px. */
28128: .bottom-nav-btn{font-size:10.5px!important;min-height:44px}
28129: .copilot-summary-label,.copilot-category-title small,.copilot-count-badge,.copilot-record-index,.copilot-scope-lock small,
28130: .copilot-kv-key,.copilot-external-kv span,.mtl-src-badge,.dash-card .dc-kode,.pmc-gantt-bar,
28131: .rbac-feature-key,.btn-why-remove{font-size:10.5px!important;line-height:1.35!important}
28132: table.omodos-responsive-table>tbody>tr>td::before,#sparepart-lokasi-table td::before{font-size:10.5px!important;line-height:1.35!important}
28133: </style>
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
~~~

### Around source line 28125
~~~text
28107: </script>
28108: 
28109: <style id="legacy-low-cognitive-style">
28110: .legacy-simple-guide{margin:10px 0 14px;padding:14px 16px;border:1px solid color-mix(in srgb,var(--accent,#3b82f6) 30%,var(--line,#d9dee7));border-radius:14px;background:color-mix(in srgb,var(--panel,#fff) 93%,var(--accent,#3b82f6) 7%);display:grid;gap:8px}
28111: .legacy-simple-guide-title{font:800 17px/1.25 var(--font-display,system-ui);color:var(--text,#152238)}
28112: .legacy-simple-guide-purpose{font:600 13px/1.55 var(--font-body,system-ui);color:var(--text,#152238)}
28113: .legacy-simple-guide-steps{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
28114: .legacy-simple-step{padding:10px 12px;border:1px solid var(--line-soft,#e6eaf0);border-radius:10px;background:var(--panel,#fff);font:600 12.5px/1.5 var(--font-body,system-ui);color:var(--text,#152238)}
28115: .legacy-simple-step b{display:inline-grid;place-items:center;width:22px;height:22px;margin-right:6px;border-radius:999px;background:var(--accent,#3b82f6);color:#fff}
28116: .legacy-simple-glossary{margin-top:2px}
28117: .legacy-simple-glossary>summary{cursor:pointer;font:700 12px/1.4 var(--font-body,system-ui);color:var(--text-dim,#586579);min-height:38px;display:flex;align-items:center}
28118: .legacy-simple-glossary-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;padding-top:6px}
28119: .legacy-simple-glossary-grid div{padding:8px 10px;border:1px solid var(--line-soft,#e6eaf0);border-radius:9px;background:var(--panel-2,#f7f9fc)}
28120: .legacy-simple-glossary-grid b{display:block;font-size:11.5px;color:var(--text,#152238)}
28121: .legacy-simple-glossary-grid span{display:block;margin-top:2px;font:500 11.5px/1.45 var(--font-body,system-ui);color:var(--text-dim,#586579)}
28122: .legacy-simple-helper{font:500 11.5px/1.45 var(--font-body,system-ui);color:var(--text-dim,#586579)}
28123: body.low-cognitive .legacy-simple-guide{padding:16px 18px}
28124: body.low-cognitive .legacy-simple-guide-title{font-size:19px}
28125: body.low-cognitive .legacy-simple-guide-purpose,body.low-cognitive .legacy-simple-step{font-size:14px}
28126: @media(max-width:760px){.legacy-simple-guide-steps,.legacy-simple-glossary-grid{grid-template-columns:1fr}.legacy-simple-guide{margin:8px 0 12px;padding:12px}.legacy-simple-step{min-height:44px}}
28127: /* Readability floor for legacy micro-labels that were previously 7.5–9.5px. */
28128: .bottom-nav-btn{font-size:10.5px!important;min-height:44px}
28129: .copilot-summary-label,.copilot-category-title small,.copilot-count-badge,.copilot-record-index,.copilot-scope-lock small,
28130: .copilot-kv-key,.copilot-external-kv span,.mtl-src-badge,.dash-card .dc-kode,.pmc-gantt-bar,
28131: .rbac-feature-key,.btn-why-remove{font-size:10.5px!important;line-height:1.35!important}
28132: table.omodos-responsive-table>tbody>tr>td::before,#sparepart-lokasi-table td::before{font-size:10.5px!important;line-height:1.35!important}
28133: </style>
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
~~~

### Around source line 28126
~~~text
28108: 
28109: <style id="legacy-low-cognitive-style">
28110: .legacy-simple-guide{margin:10px 0 14px;padding:14px 16px;border:1px solid color-mix(in srgb,var(--accent,#3b82f6) 30%,var(--line,#d9dee7));border-radius:14px;background:color-mix(in srgb,var(--panel,#fff) 93%,var(--accent,#3b82f6) 7%);display:grid;gap:8px}
28111: .legacy-simple-guide-title{font:800 17px/1.25 var(--font-display,system-ui);color:var(--text,#152238)}
28112: .legacy-simple-guide-purpose{font:600 13px/1.55 var(--font-body,system-ui);color:var(--text,#152238)}
28113: .legacy-simple-guide-steps{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
28114: .legacy-simple-step{padding:10px 12px;border:1px solid var(--line-soft,#e6eaf0);border-radius:10px;background:var(--panel,#fff);font:600 12.5px/1.5 var(--font-body,system-ui);color:var(--text,#152238)}
28115: .legacy-simple-step b{display:inline-grid;place-items:center;width:22px;height:22px;margin-right:6px;border-radius:999px;background:var(--accent,#3b82f6);color:#fff}
28116: .legacy-simple-glossary{margin-top:2px}
28117: .legacy-simple-glossary>summary{cursor:pointer;font:700 12px/1.4 var(--font-body,system-ui);color:var(--text-dim,#586579);min-height:38px;display:flex;align-items:center}
28118: .legacy-simple-glossary-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;padding-top:6px}
28119: .legacy-simple-glossary-grid div{padding:8px 10px;border:1px solid var(--line-soft,#e6eaf0);border-radius:9px;background:var(--panel-2,#f7f9fc)}
28120: .legacy-simple-glossary-grid b{display:block;font-size:11.5px;color:var(--text,#152238)}
28121: .legacy-simple-glossary-grid span{display:block;margin-top:2px;font:500 11.5px/1.45 var(--font-body,system-ui);color:var(--text-dim,#586579)}
28122: .legacy-simple-helper{font:500 11.5px/1.45 var(--font-body,system-ui);color:var(--text-dim,#586579)}
28123: body.low-cognitive .legacy-simple-guide{padding:16px 18px}
28124: body.low-cognitive .legacy-simple-guide-title{font-size:19px}
28125: body.low-cognitive .legacy-simple-guide-purpose,body.low-cognitive .legacy-simple-step{font-size:14px}
28126: @media(max-width:760px){.legacy-simple-guide-steps,.legacy-simple-glossary-grid{grid-template-columns:1fr}.legacy-simple-guide{margin:8px 0 12px;padding:12px}.legacy-simple-step{min-height:44px}}
28127: /* Readability floor for legacy micro-labels that were previously 7.5–9.5px. */
28128: .bottom-nav-btn{font-size:10.5px!important;min-height:44px}
28129: .copilot-summary-label,.copilot-category-title small,.copilot-count-badge,.copilot-record-index,.copilot-scope-lock small,
28130: .copilot-kv-key,.copilot-external-kv span,.mtl-src-badge,.dash-card .dc-kode,.pmc-gantt-bar,
28131: .rbac-feature-key,.btn-why-remove{font-size:10.5px!important;line-height:1.35!important}
28132: table.omodos-responsive-table>tbody>tr>td::before,#sparepart-lokasi-table td::before{font-size:10.5px!important;line-height:1.35!important}
28133: </style>
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
~~~

### Around source line 28300
~~~text
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
28341:     document.querySelectorAll('.nav-parent-btn[data-group]').forEach(btn=>{
28342:       const name=GROUP_NAMES[btn.dataset.group];if(name)setOwnText(btn,name);
28343:     });
28344:   }
28345: 
28346:   function enhance(root){
28347:     simplifyNavigation();
28348:     replaceSimpleText(root||document);
28349:     document.querySelectorAll('section.view[id^="view-"]').forEach(ensureGuide);
28350:     connectLabels(root||document);
28351:   }
28352: 
28353:   let scheduled=false;
28354:   function schedule(root){
28355:     if(scheduled)return;scheduled=true;
28356:     requestAnimationFrame(()=>{scheduled=false;enhance(root&&root.nodeType===1?root:document);});
28357:   }
28358:   if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>enhance(document));
28359:   else enhance(document);
~~~

### Around source line 28303
~~~text
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
28341:     document.querySelectorAll('.nav-parent-btn[data-group]').forEach(btn=>{
28342:       const name=GROUP_NAMES[btn.dataset.group];if(name)setOwnText(btn,name);
28343:     });
28344:   }
28345: 
28346:   function enhance(root){
28347:     simplifyNavigation();
28348:     replaceSimpleText(root||document);
28349:     document.querySelectorAll('section.view[id^="view-"]').forEach(ensureGuide);
28350:     connectLabels(root||document);
28351:   }
28352: 
28353:   let scheduled=false;
28354:   function schedule(root){
28355:     if(scheduled)return;scheduled=true;
28356:     requestAnimationFrame(()=>{scheduled=false;enhance(root&&root.nodeType===1?root:document);});
28357:   }
28358:   if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>enhance(document));
28359:   else enhance(document);
28360:   const obs=new MutationObserver(muts=>{
28361:     let root=null;
28362:     for(const m of muts){if(m.target&&m.target.nodeType===1){root=m.target;break;}for(const n of m.addedNodes){if(n.nodeType===1){root=n;break;}}if(root)break;}
~~~

### Around source line 28304
~~~text
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
28341:     document.querySelectorAll('.nav-parent-btn[data-group]').forEach(btn=>{
28342:       const name=GROUP_NAMES[btn.dataset.group];if(name)setOwnText(btn,name);
28343:     });
28344:   }
28345: 
28346:   function enhance(root){
28347:     simplifyNavigation();
28348:     replaceSimpleText(root||document);
28349:     document.querySelectorAll('section.view[id^="view-"]').forEach(ensureGuide);
28350:     connectLabels(root||document);
28351:   }
28352: 
28353:   let scheduled=false;
28354:   function schedule(root){
28355:     if(scheduled)return;scheduled=true;
28356:     requestAnimationFrame(()=>{scheduled=false;enhance(root&&root.nodeType===1?root:document);});
28357:   }
28358:   if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>enhance(document));
28359:   else enhance(document);
28360:   const obs=new MutationObserver(muts=>{
28361:     let root=null;
28362:     for(const m of muts){if(m.target&&m.target.nodeType===1){root=m.target;break;}for(const n of m.addedNodes){if(n.nodeType===1){root=n;break;}}if(root)break;}
28363:     schedule(root||document);
~~~

### Around source line 28305
~~~text
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
28341:     document.querySelectorAll('.nav-parent-btn[data-group]').forEach(btn=>{
28342:       const name=GROUP_NAMES[btn.dataset.group];if(name)setOwnText(btn,name);
28343:     });
28344:   }
28345: 
28346:   function enhance(root){
28347:     simplifyNavigation();
28348:     replaceSimpleText(root||document);
28349:     document.querySelectorAll('section.view[id^="view-"]').forEach(ensureGuide);
28350:     connectLabels(root||document);
28351:   }
28352: 
28353:   let scheduled=false;
28354:   function schedule(root){
28355:     if(scheduled)return;scheduled=true;
28356:     requestAnimationFrame(()=>{scheduled=false;enhance(root&&root.nodeType===1?root:document);});
28357:   }
28358:   if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>enhance(document));
28359:   else enhance(document);
28360:   const obs=new MutationObserver(muts=>{
28361:     let root=null;
28362:     for(const m of muts){if(m.target&&m.target.nodeType===1){root=m.target;break;}for(const n of m.addedNodes){if(n.nodeType===1){root=n;break;}}if(root)break;}
28363:     schedule(root||document);
28364:   });
~~~

### Around source line 28306
~~~text
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
28341:     document.querySelectorAll('.nav-parent-btn[data-group]').forEach(btn=>{
28342:       const name=GROUP_NAMES[btn.dataset.group];if(name)setOwnText(btn,name);
28343:     });
28344:   }
28345: 
28346:   function enhance(root){
28347:     simplifyNavigation();
28348:     replaceSimpleText(root||document);
28349:     document.querySelectorAll('section.view[id^="view-"]').forEach(ensureGuide);
28350:     connectLabels(root||document);
28351:   }
28352: 
28353:   let scheduled=false;
28354:   function schedule(root){
28355:     if(scheduled)return;scheduled=true;
28356:     requestAnimationFrame(()=>{scheduled=false;enhance(root&&root.nodeType===1?root:document);});
28357:   }
28358:   if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>enhance(document));
28359:   else enhance(document);
28360:   const obs=new MutationObserver(muts=>{
28361:     let root=null;
28362:     for(const m of muts){if(m.target&&m.target.nodeType===1){root=m.target;break;}for(const n of m.addedNodes){if(n.nodeType===1){root=n;break;}}if(root)break;}
28363:     schedule(root||document);
28364:   });
28365:   obs.observe(document.body,{childList:true,subtree:true,characterData:true});
~~~

## legacy-simple-guide-title — 3
### Around source line 28111
~~~text
28093:     if(closest) enhanceTable(closest);
28094:   }
28095:   const run=()=>scan(document);
28096:   if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run); else run();
28097:   const obs=new MutationObserver(muts=>muts.forEach(m=>{
28098:     if(m.target&&m.target.nodeType===1){
28099:       const t=m.target.closest&&m.target.closest('table');
28100:       if(t) enhanceTable(t);
28101:     }
28102:     m.addedNodes.forEach(n=>{ if(n.nodeType===1) scan(n); });
28103:   }));
28104:   obs.observe(document.body,{childList:true,subtree:true,characterData:false});
28105:   window.addEventListener('resize',()=>document.querySelectorAll('table.omodos-responsive-table').forEach(enhanceTable),{passive:true});
28106: })();
28107: </script>
28108: 
28109: <style id="legacy-low-cognitive-style">
28110: .legacy-simple-guide{margin:10px 0 14px;padding:14px 16px;border:1px solid color-mix(in srgb,var(--accent,#3b82f6) 30%,var(--line,#d9dee7));border-radius:14px;background:color-mix(in srgb,var(--panel,#fff) 93%,var(--accent,#3b82f6) 7%);display:grid;gap:8px}
28111: .legacy-simple-guide-title{font:800 17px/1.25 var(--font-display,system-ui);color:var(--text,#152238)}
28112: .legacy-simple-guide-purpose{font:600 13px/1.55 var(--font-body,system-ui);color:var(--text,#152238)}
28113: .legacy-simple-guide-steps{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
28114: .legacy-simple-step{padding:10px 12px;border:1px solid var(--line-soft,#e6eaf0);border-radius:10px;background:var(--panel,#fff);font:600 12.5px/1.5 var(--font-body,system-ui);color:var(--text,#152238)}
28115: .legacy-simple-step b{display:inline-grid;place-items:center;width:22px;height:22px;margin-right:6px;border-radius:999px;background:var(--accent,#3b82f6);color:#fff}
28116: .legacy-simple-glossary{margin-top:2px}
28117: .legacy-simple-glossary>summary{cursor:pointer;font:700 12px/1.4 var(--font-body,system-ui);color:var(--text-dim,#586579);min-height:38px;display:flex;align-items:center}
28118: .legacy-simple-glossary-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;padding-top:6px}
28119: .legacy-simple-glossary-grid div{padding:8px 10px;border:1px solid var(--line-soft,#e6eaf0);border-radius:9px;background:var(--panel-2,#f7f9fc)}
28120: .legacy-simple-glossary-grid b{display:block;font-size:11.5px;color:var(--text,#152238)}
28121: .legacy-simple-glossary-grid span{display:block;margin-top:2px;font:500 11.5px/1.45 var(--font-body,system-ui);color:var(--text-dim,#586579)}
28122: .legacy-simple-helper{font:500 11.5px/1.45 var(--font-body,system-ui);color:var(--text-dim,#586579)}
28123: body.low-cognitive .legacy-simple-guide{padding:16px 18px}
28124: body.low-cognitive .legacy-simple-guide-title{font-size:19px}
28125: body.low-cognitive .legacy-simple-guide-purpose,body.low-cognitive .legacy-simple-step{font-size:14px}
28126: @media(max-width:760px){.legacy-simple-guide-steps,.legacy-simple-glossary-grid{grid-template-columns:1fr}.legacy-simple-guide{margin:8px 0 12px;padding:12px}.legacy-simple-step{min-height:44px}}
28127: /* Readability floor for legacy micro-labels that were previously 7.5–9.5px. */
28128: .bottom-nav-btn{font-size:10.5px!important;min-height:44px}
28129: .copilot-summary-label,.copilot-category-title small,.copilot-count-badge,.copilot-record-index,.copilot-scope-lock small,
28130: .copilot-kv-key,.copilot-external-kv span,.mtl-src-badge,.dash-card .dc-kode,.pmc-gantt-bar,
28131: .rbac-feature-key,.btn-why-remove{font-size:10.5px!important;line-height:1.35!important}
28132: table.omodos-responsive-table>tbody>tr>td::before,#sparepart-lokasi-table td::before{font-size:10.5px!important;line-height:1.35!important}
28133: </style>
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
~~~

### Around source line 28124
~~~text
28106: })();
28107: </script>
28108: 
28109: <style id="legacy-low-cognitive-style">
28110: .legacy-simple-guide{margin:10px 0 14px;padding:14px 16px;border:1px solid color-mix(in srgb,var(--accent,#3b82f6) 30%,var(--line,#d9dee7));border-radius:14px;background:color-mix(in srgb,var(--panel,#fff) 93%,var(--accent,#3b82f6) 7%);display:grid;gap:8px}
28111: .legacy-simple-guide-title{font:800 17px/1.25 var(--font-display,system-ui);color:var(--text,#152238)}
28112: .legacy-simple-guide-purpose{font:600 13px/1.55 var(--font-body,system-ui);color:var(--text,#152238)}
28113: .legacy-simple-guide-steps{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
28114: .legacy-simple-step{padding:10px 12px;border:1px solid var(--line-soft,#e6eaf0);border-radius:10px;background:var(--panel,#fff);font:600 12.5px/1.5 var(--font-body,system-ui);color:var(--text,#152238)}
28115: .legacy-simple-step b{display:inline-grid;place-items:center;width:22px;height:22px;margin-right:6px;border-radius:999px;background:var(--accent,#3b82f6);color:#fff}
28116: .legacy-simple-glossary{margin-top:2px}
28117: .legacy-simple-glossary>summary{cursor:pointer;font:700 12px/1.4 var(--font-body,system-ui);color:var(--text-dim,#586579);min-height:38px;display:flex;align-items:center}
28118: .legacy-simple-glossary-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;padding-top:6px}
28119: .legacy-simple-glossary-grid div{padding:8px 10px;border:1px solid var(--line-soft,#e6eaf0);border-radius:9px;background:var(--panel-2,#f7f9fc)}
28120: .legacy-simple-glossary-grid b{display:block;font-size:11.5px;color:var(--text,#152238)}
28121: .legacy-simple-glossary-grid span{display:block;margin-top:2px;font:500 11.5px/1.45 var(--font-body,system-ui);color:var(--text-dim,#586579)}
28122: .legacy-simple-helper{font:500 11.5px/1.45 var(--font-body,system-ui);color:var(--text-dim,#586579)}
28123: body.low-cognitive .legacy-simple-guide{padding:16px 18px}
28124: body.low-cognitive .legacy-simple-guide-title{font-size:19px}
28125: body.low-cognitive .legacy-simple-guide-purpose,body.low-cognitive .legacy-simple-step{font-size:14px}
28126: @media(max-width:760px){.legacy-simple-guide-steps,.legacy-simple-glossary-grid{grid-template-columns:1fr}.legacy-simple-guide{margin:8px 0 12px;padding:12px}.legacy-simple-step{min-height:44px}}
28127: /* Readability floor for legacy micro-labels that were previously 7.5–9.5px. */
28128: .bottom-nav-btn{font-size:10.5px!important;min-height:44px}
28129: .copilot-summary-label,.copilot-category-title small,.copilot-count-badge,.copilot-record-index,.copilot-scope-lock small,
28130: .copilot-kv-key,.copilot-external-kv span,.mtl-src-badge,.dash-card .dc-kode,.pmc-gantt-bar,
28131: .rbac-feature-key,.btn-why-remove{font-size:10.5px!important;line-height:1.35!important}
28132: table.omodos-responsive-table>tbody>tr>td::before,#sparepart-lokasi-table td::before{font-size:10.5px!important;line-height:1.35!important}
28133: </style>
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
~~~

### Around source line 28304
~~~text
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
28341:     document.querySelectorAll('.nav-parent-btn[data-group]').forEach(btn=>{
28342:       const name=GROUP_NAMES[btn.dataset.group];if(name)setOwnText(btn,name);
28343:     });
28344:   }
28345: 
28346:   function enhance(root){
28347:     simplifyNavigation();
28348:     replaceSimpleText(root||document);
28349:     document.querySelectorAll('section.view[id^="view-"]').forEach(ensureGuide);
28350:     connectLabels(root||document);
28351:   }
28352: 
28353:   let scheduled=false;
28354:   function schedule(root){
28355:     if(scheduled)return;scheduled=true;
28356:     requestAnimationFrame(()=>{scheduled=false;enhance(root&&root.nodeType===1?root:document);});
28357:   }
28358:   if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>enhance(document));
28359:   else enhance(document);
28360:   const obs=new MutationObserver(muts=>{
28361:     let root=null;
28362:     for(const m of muts){if(m.target&&m.target.nodeType===1){root=m.target;break;}for(const n of m.addedNodes){if(n.nodeType===1){root=n;break;}}if(root)break;}
28363:     schedule(root||document);
~~~

## legacy-simple-guide-purpose — 3
### Around source line 28112
~~~text
28094:   }
28095:   const run=()=>scan(document);
28096:   if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run); else run();
28097:   const obs=new MutationObserver(muts=>muts.forEach(m=>{
28098:     if(m.target&&m.target.nodeType===1){
28099:       const t=m.target.closest&&m.target.closest('table');
28100:       if(t) enhanceTable(t);
28101:     }
28102:     m.addedNodes.forEach(n=>{ if(n.nodeType===1) scan(n); });
28103:   }));
28104:   obs.observe(document.body,{childList:true,subtree:true,characterData:false});
28105:   window.addEventListener('resize',()=>document.querySelectorAll('table.omodos-responsive-table').forEach(enhanceTable),{passive:true});
28106: })();
28107: </script>
28108: 
28109: <style id="legacy-low-cognitive-style">
28110: .legacy-simple-guide{margin:10px 0 14px;padding:14px 16px;border:1px solid color-mix(in srgb,var(--accent,#3b82f6) 30%,var(--line,#d9dee7));border-radius:14px;background:color-mix(in srgb,var(--panel,#fff) 93%,var(--accent,#3b82f6) 7%);display:grid;gap:8px}
28111: .legacy-simple-guide-title{font:800 17px/1.25 var(--font-display,system-ui);color:var(--text,#152238)}
28112: .legacy-simple-guide-purpose{font:600 13px/1.55 var(--font-body,system-ui);color:var(--text,#152238)}
28113: .legacy-simple-guide-steps{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
28114: .legacy-simple-step{padding:10px 12px;border:1px solid var(--line-soft,#e6eaf0);border-radius:10px;background:var(--panel,#fff);font:600 12.5px/1.5 var(--font-body,system-ui);color:var(--text,#152238)}
28115: .legacy-simple-step b{display:inline-grid;place-items:center;width:22px;height:22px;margin-right:6px;border-radius:999px;background:var(--accent,#3b82f6);color:#fff}
28116: .legacy-simple-glossary{margin-top:2px}
28117: .legacy-simple-glossary>summary{cursor:pointer;font:700 12px/1.4 var(--font-body,system-ui);color:var(--text-dim,#586579);min-height:38px;display:flex;align-items:center}
28118: .legacy-simple-glossary-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;padding-top:6px}
28119: .legacy-simple-glossary-grid div{padding:8px 10px;border:1px solid var(--line-soft,#e6eaf0);border-radius:9px;background:var(--panel-2,#f7f9fc)}
28120: .legacy-simple-glossary-grid b{display:block;font-size:11.5px;color:var(--text,#152238)}
28121: .legacy-simple-glossary-grid span{display:block;margin-top:2px;font:500 11.5px/1.45 var(--font-body,system-ui);color:var(--text-dim,#586579)}
28122: .legacy-simple-helper{font:500 11.5px/1.45 var(--font-body,system-ui);color:var(--text-dim,#586579)}
28123: body.low-cognitive .legacy-simple-guide{padding:16px 18px}
28124: body.low-cognitive .legacy-simple-guide-title{font-size:19px}
28125: body.low-cognitive .legacy-simple-guide-purpose,body.low-cognitive .legacy-simple-step{font-size:14px}
28126: @media(max-width:760px){.legacy-simple-guide-steps,.legacy-simple-glossary-grid{grid-template-columns:1fr}.legacy-simple-guide{margin:8px 0 12px;padding:12px}.legacy-simple-step{min-height:44px}}
28127: /* Readability floor for legacy micro-labels that were previously 7.5–9.5px. */
28128: .bottom-nav-btn{font-size:10.5px!important;min-height:44px}
28129: .copilot-summary-label,.copilot-category-title small,.copilot-count-badge,.copilot-record-index,.copilot-scope-lock small,
28130: .copilot-kv-key,.copilot-external-kv span,.mtl-src-badge,.dash-card .dc-kode,.pmc-gantt-bar,
28131: .rbac-feature-key,.btn-why-remove{font-size:10.5px!important;line-height:1.35!important}
28132: table.omodos-responsive-table>tbody>tr>td::before,#sparepart-lokasi-table td::before{font-size:10.5px!important;line-height:1.35!important}
28133: </style>
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
~~~

### Around source line 28125
~~~text
28107: </script>
28108: 
28109: <style id="legacy-low-cognitive-style">
28110: .legacy-simple-guide{margin:10px 0 14px;padding:14px 16px;border:1px solid color-mix(in srgb,var(--accent,#3b82f6) 30%,var(--line,#d9dee7));border-radius:14px;background:color-mix(in srgb,var(--panel,#fff) 93%,var(--accent,#3b82f6) 7%);display:grid;gap:8px}
28111: .legacy-simple-guide-title{font:800 17px/1.25 var(--font-display,system-ui);color:var(--text,#152238)}
28112: .legacy-simple-guide-purpose{font:600 13px/1.55 var(--font-body,system-ui);color:var(--text,#152238)}
28113: .legacy-simple-guide-steps{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
28114: .legacy-simple-step{padding:10px 12px;border:1px solid var(--line-soft,#e6eaf0);border-radius:10px;background:var(--panel,#fff);font:600 12.5px/1.5 var(--font-body,system-ui);color:var(--text,#152238)}
28115: .legacy-simple-step b{display:inline-grid;place-items:center;width:22px;height:22px;margin-right:6px;border-radius:999px;background:var(--accent,#3b82f6);color:#fff}
28116: .legacy-simple-glossary{margin-top:2px}
28117: .legacy-simple-glossary>summary{cursor:pointer;font:700 12px/1.4 var(--font-body,system-ui);color:var(--text-dim,#586579);min-height:38px;display:flex;align-items:center}
28118: .legacy-simple-glossary-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;padding-top:6px}
28119: .legacy-simple-glossary-grid div{padding:8px 10px;border:1px solid var(--line-soft,#e6eaf0);border-radius:9px;background:var(--panel-2,#f7f9fc)}
28120: .legacy-simple-glossary-grid b{display:block;font-size:11.5px;color:var(--text,#152238)}
28121: .legacy-simple-glossary-grid span{display:block;margin-top:2px;font:500 11.5px/1.45 var(--font-body,system-ui);color:var(--text-dim,#586579)}
28122: .legacy-simple-helper{font:500 11.5px/1.45 var(--font-body,system-ui);color:var(--text-dim,#586579)}
28123: body.low-cognitive .legacy-simple-guide{padding:16px 18px}
28124: body.low-cognitive .legacy-simple-guide-title{font-size:19px}
28125: body.low-cognitive .legacy-simple-guide-purpose,body.low-cognitive .legacy-simple-step{font-size:14px}
28126: @media(max-width:760px){.legacy-simple-guide-steps,.legacy-simple-glossary-grid{grid-template-columns:1fr}.legacy-simple-guide{margin:8px 0 12px;padding:12px}.legacy-simple-step{min-height:44px}}
28127: /* Readability floor for legacy micro-labels that were previously 7.5–9.5px. */
28128: .bottom-nav-btn{font-size:10.5px!important;min-height:44px}
28129: .copilot-summary-label,.copilot-category-title small,.copilot-count-badge,.copilot-record-index,.copilot-scope-lock small,
28130: .copilot-kv-key,.copilot-external-kv span,.mtl-src-badge,.dash-card .dc-kode,.pmc-gantt-bar,
28131: .rbac-feature-key,.btn-why-remove{font-size:10.5px!important;line-height:1.35!important}
28132: table.omodos-responsive-table>tbody>tr>td::before,#sparepart-lokasi-table td::before{font-size:10.5px!important;line-height:1.35!important}
28133: </style>
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
~~~

### Around source line 28305
~~~text
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
28341:     document.querySelectorAll('.nav-parent-btn[data-group]').forEach(btn=>{
28342:       const name=GROUP_NAMES[btn.dataset.group];if(name)setOwnText(btn,name);
28343:     });
28344:   }
28345: 
28346:   function enhance(root){
28347:     simplifyNavigation();
28348:     replaceSimpleText(root||document);
28349:     document.querySelectorAll('section.view[id^="view-"]').forEach(ensureGuide);
28350:     connectLabels(root||document);
28351:   }
28352: 
28353:   let scheduled=false;
28354:   function schedule(root){
28355:     if(scheduled)return;scheduled=true;
28356:     requestAnimationFrame(()=>{scheduled=false;enhance(root&&root.nodeType===1?root:document);});
28357:   }
28358:   if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>enhance(document));
28359:   else enhance(document);
28360:   const obs=new MutationObserver(muts=>{
28361:     let root=null;
28362:     for(const m of muts){if(m.target&&m.target.nodeType===1){root=m.target;break;}for(const n of m.addedNodes){if(n.nodeType===1){root=n;break;}}if(root)break;}
28363:     schedule(root||document);
28364:   });
~~~

## legacy-simple-step — 5
### Around source line 28114
~~~text
28096:   if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run); else run();
28097:   const obs=new MutationObserver(muts=>muts.forEach(m=>{
28098:     if(m.target&&m.target.nodeType===1){
28099:       const t=m.target.closest&&m.target.closest('table');
28100:       if(t) enhanceTable(t);
28101:     }
28102:     m.addedNodes.forEach(n=>{ if(n.nodeType===1) scan(n); });
28103:   }));
28104:   obs.observe(document.body,{childList:true,subtree:true,characterData:false});
28105:   window.addEventListener('resize',()=>document.querySelectorAll('table.omodos-responsive-table').forEach(enhanceTable),{passive:true});
28106: })();
28107: </script>
28108: 
28109: <style id="legacy-low-cognitive-style">
28110: .legacy-simple-guide{margin:10px 0 14px;padding:14px 16px;border:1px solid color-mix(in srgb,var(--accent,#3b82f6) 30%,var(--line,#d9dee7));border-radius:14px;background:color-mix(in srgb,var(--panel,#fff) 93%,var(--accent,#3b82f6) 7%);display:grid;gap:8px}
28111: .legacy-simple-guide-title{font:800 17px/1.25 var(--font-display,system-ui);color:var(--text,#152238)}
28112: .legacy-simple-guide-purpose{font:600 13px/1.55 var(--font-body,system-ui);color:var(--text,#152238)}
28113: .legacy-simple-guide-steps{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
28114: .legacy-simple-step{padding:10px 12px;border:1px solid var(--line-soft,#e6eaf0);border-radius:10px;background:var(--panel,#fff);font:600 12.5px/1.5 var(--font-body,system-ui);color:var(--text,#152238)}
28115: .legacy-simple-step b{display:inline-grid;place-items:center;width:22px;height:22px;margin-right:6px;border-radius:999px;background:var(--accent,#3b82f6);color:#fff}
28116: .legacy-simple-glossary{margin-top:2px}
28117: .legacy-simple-glossary>summary{cursor:pointer;font:700 12px/1.4 var(--font-body,system-ui);color:var(--text-dim,#586579);min-height:38px;display:flex;align-items:center}
28118: .legacy-simple-glossary-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;padding-top:6px}
28119: .legacy-simple-glossary-grid div{padding:8px 10px;border:1px solid var(--line-soft,#e6eaf0);border-radius:9px;background:var(--panel-2,#f7f9fc)}
28120: .legacy-simple-glossary-grid b{display:block;font-size:11.5px;color:var(--text,#152238)}
28121: .legacy-simple-glossary-grid span{display:block;margin-top:2px;font:500 11.5px/1.45 var(--font-body,system-ui);color:var(--text-dim,#586579)}
28122: .legacy-simple-helper{font:500 11.5px/1.45 var(--font-body,system-ui);color:var(--text-dim,#586579)}
28123: body.low-cognitive .legacy-simple-guide{padding:16px 18px}
28124: body.low-cognitive .legacy-simple-guide-title{font-size:19px}
28125: body.low-cognitive .legacy-simple-guide-purpose,body.low-cognitive .legacy-simple-step{font-size:14px}
28126: @media(max-width:760px){.legacy-simple-guide-steps,.legacy-simple-glossary-grid{grid-template-columns:1fr}.legacy-simple-guide{margin:8px 0 12px;padding:12px}.legacy-simple-step{min-height:44px}}
28127: /* Readability floor for legacy micro-labels that were previously 7.5–9.5px. */
28128: .bottom-nav-btn{font-size:10.5px!important;min-height:44px}
28129: .copilot-summary-label,.copilot-category-title small,.copilot-count-badge,.copilot-record-index,.copilot-scope-lock small,
28130: .copilot-kv-key,.copilot-external-kv span,.mtl-src-badge,.dash-card .dc-kode,.pmc-gantt-bar,
28131: .rbac-feature-key,.btn-why-remove{font-size:10.5px!important;line-height:1.35!important}
28132: table.omodos-responsive-table>tbody>tr>td::before,#sparepart-lokasi-table td::before{font-size:10.5px!important;line-height:1.35!important}
28133: </style>
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
~~~

### Around source line 28115
~~~text
28097:   const obs=new MutationObserver(muts=>muts.forEach(m=>{
28098:     if(m.target&&m.target.nodeType===1){
28099:       const t=m.target.closest&&m.target.closest('table');
28100:       if(t) enhanceTable(t);
28101:     }
28102:     m.addedNodes.forEach(n=>{ if(n.nodeType===1) scan(n); });
28103:   }));
28104:   obs.observe(document.body,{childList:true,subtree:true,characterData:false});
28105:   window.addEventListener('resize',()=>document.querySelectorAll('table.omodos-responsive-table').forEach(enhanceTable),{passive:true});
28106: })();
28107: </script>
28108: 
28109: <style id="legacy-low-cognitive-style">
28110: .legacy-simple-guide{margin:10px 0 14px;padding:14px 16px;border:1px solid color-mix(in srgb,var(--accent,#3b82f6) 30%,var(--line,#d9dee7));border-radius:14px;background:color-mix(in srgb,var(--panel,#fff) 93%,var(--accent,#3b82f6) 7%);display:grid;gap:8px}
28111: .legacy-simple-guide-title{font:800 17px/1.25 var(--font-display,system-ui);color:var(--text,#152238)}
28112: .legacy-simple-guide-purpose{font:600 13px/1.55 var(--font-body,system-ui);color:var(--text,#152238)}
28113: .legacy-simple-guide-steps{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
28114: .legacy-simple-step{padding:10px 12px;border:1px solid var(--line-soft,#e6eaf0);border-radius:10px;background:var(--panel,#fff);font:600 12.5px/1.5 var(--font-body,system-ui);color:var(--text,#152238)}
28115: .legacy-simple-step b{display:inline-grid;place-items:center;width:22px;height:22px;margin-right:6px;border-radius:999px;background:var(--accent,#3b82f6);color:#fff}
28116: .legacy-simple-glossary{margin-top:2px}
28117: .legacy-simple-glossary>summary{cursor:pointer;font:700 12px/1.4 var(--font-body,system-ui);color:var(--text-dim,#586579);min-height:38px;display:flex;align-items:center}
28118: .legacy-simple-glossary-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;padding-top:6px}
28119: .legacy-simple-glossary-grid div{padding:8px 10px;border:1px solid var(--line-soft,#e6eaf0);border-radius:9px;background:var(--panel-2,#f7f9fc)}
28120: .legacy-simple-glossary-grid b{display:block;font-size:11.5px;color:var(--text,#152238)}
28121: .legacy-simple-glossary-grid span{display:block;margin-top:2px;font:500 11.5px/1.45 var(--font-body,system-ui);color:var(--text-dim,#586579)}
28122: .legacy-simple-helper{font:500 11.5px/1.45 var(--font-body,system-ui);color:var(--text-dim,#586579)}
28123: body.low-cognitive .legacy-simple-guide{padding:16px 18px}
28124: body.low-cognitive .legacy-simple-guide-title{font-size:19px}
28125: body.low-cognitive .legacy-simple-guide-purpose,body.low-cognitive .legacy-simple-step{font-size:14px}
28126: @media(max-width:760px){.legacy-simple-guide-steps,.legacy-simple-glossary-grid{grid-template-columns:1fr}.legacy-simple-guide{margin:8px 0 12px;padding:12px}.legacy-simple-step{min-height:44px}}
28127: /* Readability floor for legacy micro-labels that were previously 7.5–9.5px. */
28128: .bottom-nav-btn{font-size:10.5px!important;min-height:44px}
28129: .copilot-summary-label,.copilot-category-title small,.copilot-count-badge,.copilot-record-index,.copilot-scope-lock small,
28130: .copilot-kv-key,.copilot-external-kv span,.mtl-src-badge,.dash-card .dc-kode,.pmc-gantt-bar,
28131: .rbac-feature-key,.btn-why-remove{font-size:10.5px!important;line-height:1.35!important}
28132: table.omodos-responsive-table>tbody>tr>td::before,#sparepart-lokasi-table td::before{font-size:10.5px!important;line-height:1.35!important}
28133: </style>
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
~~~

### Around source line 28125
~~~text
28107: </script>
28108: 
28109: <style id="legacy-low-cognitive-style">
28110: .legacy-simple-guide{margin:10px 0 14px;padding:14px 16px;border:1px solid color-mix(in srgb,var(--accent,#3b82f6) 30%,var(--line,#d9dee7));border-radius:14px;background:color-mix(in srgb,var(--panel,#fff) 93%,var(--accent,#3b82f6) 7%);display:grid;gap:8px}
28111: .legacy-simple-guide-title{font:800 17px/1.25 var(--font-display,system-ui);color:var(--text,#152238)}
28112: .legacy-simple-guide-purpose{font:600 13px/1.55 var(--font-body,system-ui);color:var(--text,#152238)}
28113: .legacy-simple-guide-steps{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
28114: .legacy-simple-step{padding:10px 12px;border:1px solid var(--line-soft,#e6eaf0);border-radius:10px;background:var(--panel,#fff);font:600 12.5px/1.5 var(--font-body,system-ui);color:var(--text,#152238)}
28115: .legacy-simple-step b{display:inline-grid;place-items:center;width:22px;height:22px;margin-right:6px;border-radius:999px;background:var(--accent,#3b82f6);color:#fff}
28116: .legacy-simple-glossary{margin-top:2px}
28117: .legacy-simple-glossary>summary{cursor:pointer;font:700 12px/1.4 var(--font-body,system-ui);color:var(--text-dim,#586579);min-height:38px;display:flex;align-items:center}
28118: .legacy-simple-glossary-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;padding-top:6px}
28119: .legacy-simple-glossary-grid div{padding:8px 10px;border:1px solid var(--line-soft,#e6eaf0);border-radius:9px;background:var(--panel-2,#f7f9fc)}
28120: .legacy-simple-glossary-grid b{display:block;font-size:11.5px;color:var(--text,#152238)}
28121: .legacy-simple-glossary-grid span{display:block;margin-top:2px;font:500 11.5px/1.45 var(--font-body,system-ui);color:var(--text-dim,#586579)}
28122: .legacy-simple-helper{font:500 11.5px/1.45 var(--font-body,system-ui);color:var(--text-dim,#586579)}
28123: body.low-cognitive .legacy-simple-guide{padding:16px 18px}
28124: body.low-cognitive .legacy-simple-guide-title{font-size:19px}
28125: body.low-cognitive .legacy-simple-guide-purpose,body.low-cognitive .legacy-simple-step{font-size:14px}
28126: @media(max-width:760px){.legacy-simple-guide-steps,.legacy-simple-glossary-grid{grid-template-columns:1fr}.legacy-simple-guide{margin:8px 0 12px;padding:12px}.legacy-simple-step{min-height:44px}}
28127: /* Readability floor for legacy micro-labels that were previously 7.5–9.5px. */
28128: .bottom-nav-btn{font-size:10.5px!important;min-height:44px}
28129: .copilot-summary-label,.copilot-category-title small,.copilot-count-badge,.copilot-record-index,.copilot-scope-lock small,
28130: .copilot-kv-key,.copilot-external-kv span,.mtl-src-badge,.dash-card .dc-kode,.pmc-gantt-bar,
28131: .rbac-feature-key,.btn-why-remove{font-size:10.5px!important;line-height:1.35!important}
28132: table.omodos-responsive-table>tbody>tr>td::before,#sparepart-lokasi-table td::before{font-size:10.5px!important;line-height:1.35!important}
28133: </style>
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
~~~

### Around source line 28126
~~~text
28108: 
28109: <style id="legacy-low-cognitive-style">
28110: .legacy-simple-guide{margin:10px 0 14px;padding:14px 16px;border:1px solid color-mix(in srgb,var(--accent,#3b82f6) 30%,var(--line,#d9dee7));border-radius:14px;background:color-mix(in srgb,var(--panel,#fff) 93%,var(--accent,#3b82f6) 7%);display:grid;gap:8px}
28111: .legacy-simple-guide-title{font:800 17px/1.25 var(--font-display,system-ui);color:var(--text,#152238)}
28112: .legacy-simple-guide-purpose{font:600 13px/1.55 var(--font-body,system-ui);color:var(--text,#152238)}
28113: .legacy-simple-guide-steps{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
28114: .legacy-simple-step{padding:10px 12px;border:1px solid var(--line-soft,#e6eaf0);border-radius:10px;background:var(--panel,#fff);font:600 12.5px/1.5 var(--font-body,system-ui);color:var(--text,#152238)}
28115: .legacy-simple-step b{display:inline-grid;place-items:center;width:22px;height:22px;margin-right:6px;border-radius:999px;background:var(--accent,#3b82f6);color:#fff}
28116: .legacy-simple-glossary{margin-top:2px}
28117: .legacy-simple-glossary>summary{cursor:pointer;font:700 12px/1.4 var(--font-body,system-ui);color:var(--text-dim,#586579);min-height:38px;display:flex;align-items:center}
28118: .legacy-simple-glossary-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;padding-top:6px}
28119: .legacy-simple-glossary-grid div{padding:8px 10px;border:1px solid var(--line-soft,#e6eaf0);border-radius:9px;background:var(--panel-2,#f7f9fc)}
28120: .legacy-simple-glossary-grid b{display:block;font-size:11.5px;color:var(--text,#152238)}
28121: .legacy-simple-glossary-grid span{display:block;margin-top:2px;font:500 11.5px/1.45 var(--font-body,system-ui);color:var(--text-dim,#586579)}
28122: .legacy-simple-helper{font:500 11.5px/1.45 var(--font-body,system-ui);color:var(--text-dim,#586579)}
28123: body.low-cognitive .legacy-simple-guide{padding:16px 18px}
28124: body.low-cognitive .legacy-simple-guide-title{font-size:19px}
28125: body.low-cognitive .legacy-simple-guide-purpose,body.low-cognitive .legacy-simple-step{font-size:14px}
28126: @media(max-width:760px){.legacy-simple-guide-steps,.legacy-simple-glossary-grid{grid-template-columns:1fr}.legacy-simple-guide{margin:8px 0 12px;padding:12px}.legacy-simple-step{min-height:44px}}
28127: /* Readability floor for legacy micro-labels that were previously 7.5–9.5px. */
28128: .bottom-nav-btn{font-size:10.5px!important;min-height:44px}
28129: .copilot-summary-label,.copilot-category-title small,.copilot-count-badge,.copilot-record-index,.copilot-scope-lock small,
28130: .copilot-kv-key,.copilot-external-kv span,.mtl-src-badge,.dash-card .dc-kode,.pmc-gantt-bar,
28131: .rbac-feature-key,.btn-why-remove{font-size:10.5px!important;line-height:1.35!important}
28132: table.omodos-responsive-table>tbody>tr>td::before,#sparepart-lokasi-table td::before{font-size:10.5px!important;line-height:1.35!important}
28133: </style>
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
~~~

### Around source line 28306
~~~text
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
28341:     document.querySelectorAll('.nav-parent-btn[data-group]').forEach(btn=>{
28342:       const name=GROUP_NAMES[btn.dataset.group];if(name)setOwnText(btn,name);
28343:     });
28344:   }
28345: 
28346:   function enhance(root){
28347:     simplifyNavigation();
28348:     replaceSimpleText(root||document);
28349:     document.querySelectorAll('section.view[id^="view-"]').forEach(ensureGuide);
28350:     connectLabels(root||document);
28351:   }
28352: 
28353:   let scheduled=false;
28354:   function schedule(root){
28355:     if(scheduled)return;scheduled=true;
28356:     requestAnimationFrame(()=>{scheduled=false;enhance(root&&root.nodeType===1?root:document);});
28357:   }
28358:   if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>enhance(document));
28359:   else enhance(document);
28360:   const obs=new MutationObserver(muts=>{
28361:     let root=null;
28362:     for(const m of muts){if(m.target&&m.target.nodeType===1){root=m.target;break;}for(const n of m.addedNodes){if(n.nodeType===1){root=n;break;}}if(root)break;}
28363:     schedule(root||document);
28364:   });
28365:   obs.observe(document.body,{childList:true,subtree:true,characterData:true});
~~~

## LEGACY_SIMPLE_GUIDES — 0
## copilot-panel — 4
### Around source line 1227
~~~text
01209: 
01210: .database-grid{
01211:   display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px;
01212: }
01213: 
01214: /* ---------------- AI TANYA JAWAB COPILOT ---------------- */
01215: #copilot-fab{
01216:   position:fixed;right:18px;bottom:calc(18px + env(safe-area-inset-bottom,0px));z-index:850;
01217:   width:56px;height:56px;border-radius:50%;background:linear-gradient(145deg,var(--red),var(--amber));
01218:   border:none;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,.32);display:flex;align-items:center;justify-content:center;
01219:   font-size:25px;transition:transform var(--trans),box-shadow var(--trans);touch-action:manipulation;
01220: }
01221: #copilot-fab:hover{transform:translateY(-2px) scale(1.04);box-shadow:0 10px 28px rgba(0,0,0,.38);}
01222: #copilot-fab:active{transform:scale(.96);}
01223: .copilot-fab-icon{filter:drop-shadow(0 1px 2px rgba(0,0,0,.35));}
01224: .copilot-fab-dot{display:none!important;}
01225: .copilot-bg{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:900;display:none;opacity:0;transition:opacity var(--trans);}
01226: .copilot-bg.active{display:block;opacity:1;}
01227: .copilot-panel{position:fixed;top:0;right:0;bottom:0;width:min(440px,100vw);background:var(--panel);border-left:1px solid var(--line);display:flex;flex-direction:column;transform:translateX(100%);transition:transform var(--trans);box-shadow:-10px 0 30px rgba(0,0,0,.35);}
01228: .copilot-bg.active .copilot-panel{transform:translateX(0);}
01229: .copilot-head{display:flex;justify-content:space-between;align-items:flex-start;padding:calc(16px + env(safe-area-inset-top,0px)) 16px 12px;border-bottom:1px solid var(--line);}
01230: .copilot-title{font-family:var(--font-display);font-size:17px;font-weight:700;}
01231: .copilot-ctx{font-size:11.5px;color:var(--text-dim);margin-top:3px;line-height:1.4;}
01232: .copilot-body{flex:1;overflow-y:auto;padding:14px 14px 8px;scroll-behavior:smooth;}
01233: .copilot-welcome{padding:12px 13px;border:1px solid var(--line);border-radius:12px;background:var(--panel-2);font-size:12.5px;line-height:1.55;color:var(--text-dim);}
01234: .copilot-msg{display:flex;margin:10px 0;}
01235: .copilot-msg.user{justify-content:flex-end;}
01236: .copilot-bubble{max-width:92%;border-radius:13px;padding:10px 12px;font-size:13px;line-height:1.55;overflow-wrap:anywhere;white-space:normal;}
01237: .copilot-msg.user .copilot-bubble{background:var(--red);color:#fff;border-bottom-right-radius:4px;}
01238: .copilot-msg.internal .copilot-bubble,.copilot-msg.external .copilot-bubble{background:var(--panel-2);border:1px solid var(--line);border-bottom-left-radius:4px;}
01239: .copilot-msg.external .copilot-bubble{border-left:3px solid var(--amber);}
01240: .copilot-answer-head{font-size:10px;text-transform:uppercase;letter-spacing:.55px;color:var(--text-dim);font-weight:700;margin-bottom:6px;}
01241: .copilot-result-group{margin-top:9px;padding-top:8px;border-top:1px solid var(--line);}
01242: .copilot-result-group:first-of-type{border-top:0;padding-top:0;}
01243: .copilot-result-title{font-weight:700;margin-bottom:4px;}
01244: .copilot-result-row{font-size:12px;color:var(--text-dim);padding:3px 0;overflow-wrap:anywhere;}
01245: .copilot-answer-summary{display:grid;grid-template-columns:repeat(auto-fit,minmax(105px,1fr));gap:7px;margin:8px 0 10px;}
01246: .copilot-answer-summary>div{border:1px solid var(--line);border-radius:9px;background:color-mix(in srgb,var(--panel) 86%,transparent);padding:9px 10px;min-width:0;}
01247: .copilot-summary-number{display:block;font:700 17px/1.05 var(--font-display);color:var(--text);}
01248: .copilot-summary-label{display:block;margin-top:4px;font-size:9.5px;line-height:1.25;color:var(--text-dim);overflow-wrap:anywhere;}
01249: .copilot-category-stack,.copilot-external-card-stack{display:grid;gap:10px;margin-top:9px;}
01250: .copilot-category-card,.copilot-external-card{--copilot-accent:var(--blue);border:1px solid var(--line);border-top:2px solid var(--copilot-accent);border-radius:11px;background:linear-gradient(180deg,color-mix(in srgb,var(--panel-2) 94%,var(--copilot-accent) 6%),var(--panel-2));padding:10px;min-width:0;box-shadow:0 6px 18px rgba(0,0,0,.12);}
01251: .copilot-category-card.cat-logbook{--copilot-accent:#5aa9ff}.copilot-category-card.cat-machine{--copilot-accent:#9b8cff}.copilot-category-card.cat-people{--copilot-accent:#53d3b2}.copilot-category-card.cat-knowledge{--copilot-accent:#c796ff}.copilot-category-card.cat-sparepart{--copilot-accent:#ffb04d}.copilot-category-card.cat-patrol{--copilot-accent:#5bd6ff}.copilot-category-card.cat-kpi{--copilot-accent:#3ddc97}.copilot-category-card.cat-energy{--copilot-accent:#f4d35e}.copilot-category-card.cat-report{--copilot-accent:#ff8090}.copilot-category-card.cat-default{--copilot-accent:var(--text-dim)}
01252: .copilot-category-head,.copilot-external-head{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:8px;}
01253: .copilot-category-title{display:flex;align-items:flex-start;gap:8px;min-width:0;font:700 12px/1.25 var(--font-display);color:var(--text);}
01254: .copilot-category-title>div{min-width:0}.copilot-category-title small{display:block;margin-top:2px;font:500 9.5px/1.25 var(--font-body);color:var(--text-dim);overflow-wrap:anywhere;}
01255: .copilot-category-icon,.copilot-external-icon{font-size:16px;line-height:1;flex:0 0 auto;}
01256: .copilot-count-badge{flex:0 0 auto;border:1px solid color-mix(in srgb,var(--copilot-accent) 50%,var(--line));background:color-mix(in srgb,var(--copilot-accent) 11%,transparent);color:var(--copilot-accent);border-radius:999px;padding:3px 7px;font:700 9.5px/1.1 var(--font-mono);}
01257: .copilot-category-sub{font-size:10.5px;color:var(--text-dim);margin:-2px 0 8px}.copilot-page-explain{font-size:12.5px;line-height:1.55;color:var(--text);}
01258: .copilot-record-list{display:grid;gap:7px;}
01259: .copilot-data-record{border:1px solid var(--line-soft);border-radius:9px;background:var(--panel);padding:8px 9px;min-width:0;}
01260: .copilot-record-top{display:flex;align-items:flex-start;gap:7px;margin-bottom:7px;}
01261: .copilot-record-index{flex:0 0 auto;border-radius:5px;background:color-mix(in srgb,var(--copilot-accent) 12%,transparent);color:var(--copilot-accent);padding:2px 5px;font:700 9px/1.2 var(--font-mono);}
01262: .copilot-record-title{font-weight:700;font-size:11.5px;line-height:1.35;color:var(--text);min-width:0;overflow-wrap:anywhere;}
01263: .copilot-kv-grid,.copilot-external-kv-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(118px,1fr));gap:6px;}
01264: .copilot-kv,.copilot-external-kv{border-radius:7px;background:var(--panel-2);padding:6px 7px;min-width:0;}
01265: .copilot-kv-key,.copilot-external-kv span{display:block;font-size:8.5px;text-transform:uppercase;letter-spacing:.35px;color:var(--text-dim);margin-bottom:2px;overflow-wrap:anywhere;}
01266: .copilot-kv-value,.copilot-external-kv b{display:block;font-size:10.5px;line-height:1.35;color:var(--text);font-weight:600;overflow-wrap:anywhere;word-break:break-word;}
01267: .copilot-more-note,.copilot-confidence-note{margin-top:8px;padding:7px 8px;border-radius:7px;background:color-mix(in srgb,var(--panel) 82%,transparent);font-size:10px;line-height:1.35;color:var(--text-dim);}
01268: .copilot-empty-card{display:flex;align-items:flex-start;gap:9px;border:1px dashed var(--line);border-radius:10px;background:var(--panel-2);padding:11px 12px;}.copilot-empty-card>span{font-size:18px}.copilot-empty-card b{display:block;font-size:12px;color:var(--text);margin-bottom:3px}.copilot-empty-card small{display:block;font-size:10.5px;line-height:1.4;color:var(--text-dim)}
01269: .copilot-scope-lock{display:flex;align-items:flex-start;gap:8px;margin:7px 0 10px;padding:8px 10px;border:1px solid color-mix(in srgb,var(--green) 38%,var(--line));border-radius:9px;background:color-mix(in srgb,var(--green) 7%,var(--panel-2));}.copilot-scope-lock>span{font-size:14px}.copilot-scope-lock b{display:block;font-size:11px;color:var(--green);margin-bottom:2px}.copilot-scope-lock small{display:block;font-size:9.5px;line-height:1.35;color:var(--text-dim)}
01270: .copilot-external-card{--copilot-accent:var(--blue)}.copilot-external-card.ext-warning{--copilot-accent:var(--amber)}.copilot-external-card.ext-action{--copilot-accent:var(--green)}.copilot-external-card.ext-sparepart{--copilot-accent:#ffb04d}.copilot-external-card.ext-kpi{--copilot-accent:#53d3b2}.copilot-external-card.ext-diagnosis{--copilot-accent:#9b8cff}.copilot-external-card.ext-source{--copilot-accent:#5aa9ff}.copilot-external-card.ext-summary{--copilot-accent:#ff8090}
01271: .copilot-external-head{justify-content:flex-start;font:700 11.5px/1.25 var(--font-display);color:var(--copilot-accent);margin-bottom:7px;}
01272: .copilot-external-body{font-size:11.5px;line-height:1.5;color:var(--text-dim)}.copilot-external-body p{margin:0 0 7px}.copilot-external-body p:last-child{margin-bottom:0}.copilot-external-list{margin:6px 0 0;padding-left:18px}.copilot-external-list li{margin:4px 0;color:var(--text)}
01273: .copilot-record-empty{font-size:10.5px;color:var(--text-dim)}
01274: @media(max-width:520px){.copilot-answer-summary{grid-template-columns:repeat(2,minmax(0,1fr))}.copilot-kv-grid,.copilot-external-kv-grid{grid-template-columns:1fr}.copilot-category-card,.copilot-external-card{padding:9px}.copilot-count-badge{font-size:9px}}
01275: .copilot-composer{border-top:1px solid var(--line);padding:10px 12px calc(10px + env(safe-area-inset-bottom,0px));background:var(--panel);}
01276: .copilot-composer textarea{width:100%;min-height:58px;max-height:130px;resize:vertical;margin:0;}
01277: .copilot-actions{display:flex;gap:8px;margin-top:8px;align-items:center;}
01278: .copilot-actions .btn{flex:1;justify-content:center;}
01279: .copilot-actions .btn[disabled]{opacity:.45;cursor:not-allowed;}
01280: .copilot-footnote{font-size:10.5px;color:var(--text-dim);margin-top:7px;line-height:1.35;}
01281: .copilot-thinking{display:flex;align-items:center;gap:7px;color:var(--text-dim);font-size:12px;}
01282: @media(max-width:780px){
01283:   #copilot-fab{right:14px;bottom:calc(82px + env(safe-area-inset-bottom,0px));width:50px;height:50px;font-size:22px;}
01284:   .copilot-panel{width:100vw;}
01285: }
01286: .ci-source-toggle{
~~~

### Around source line 1228
~~~text
01210: .database-grid{
01211:   display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px;
01212: }
01213: 
01214: /* ---------------- AI TANYA JAWAB COPILOT ---------------- */
01215: #copilot-fab{
01216:   position:fixed;right:18px;bottom:calc(18px + env(safe-area-inset-bottom,0px));z-index:850;
01217:   width:56px;height:56px;border-radius:50%;background:linear-gradient(145deg,var(--red),var(--amber));
01218:   border:none;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,.32);display:flex;align-items:center;justify-content:center;
01219:   font-size:25px;transition:transform var(--trans),box-shadow var(--trans);touch-action:manipulation;
01220: }
01221: #copilot-fab:hover{transform:translateY(-2px) scale(1.04);box-shadow:0 10px 28px rgba(0,0,0,.38);}
01222: #copilot-fab:active{transform:scale(.96);}
01223: .copilot-fab-icon{filter:drop-shadow(0 1px 2px rgba(0,0,0,.35));}
01224: .copilot-fab-dot{display:none!important;}
01225: .copilot-bg{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:900;display:none;opacity:0;transition:opacity var(--trans);}
01226: .copilot-bg.active{display:block;opacity:1;}
01227: .copilot-panel{position:fixed;top:0;right:0;bottom:0;width:min(440px,100vw);background:var(--panel);border-left:1px solid var(--line);display:flex;flex-direction:column;transform:translateX(100%);transition:transform var(--trans);box-shadow:-10px 0 30px rgba(0,0,0,.35);}
01228: .copilot-bg.active .copilot-panel{transform:translateX(0);}
01229: .copilot-head{display:flex;justify-content:space-between;align-items:flex-start;padding:calc(16px + env(safe-area-inset-top,0px)) 16px 12px;border-bottom:1px solid var(--line);}
01230: .copilot-title{font-family:var(--font-display);font-size:17px;font-weight:700;}
01231: .copilot-ctx{font-size:11.5px;color:var(--text-dim);margin-top:3px;line-height:1.4;}
01232: .copilot-body{flex:1;overflow-y:auto;padding:14px 14px 8px;scroll-behavior:smooth;}
01233: .copilot-welcome{padding:12px 13px;border:1px solid var(--line);border-radius:12px;background:var(--panel-2);font-size:12.5px;line-height:1.55;color:var(--text-dim);}
01234: .copilot-msg{display:flex;margin:10px 0;}
01235: .copilot-msg.user{justify-content:flex-end;}
01236: .copilot-bubble{max-width:92%;border-radius:13px;padding:10px 12px;font-size:13px;line-height:1.55;overflow-wrap:anywhere;white-space:normal;}
01237: .copilot-msg.user .copilot-bubble{background:var(--red);color:#fff;border-bottom-right-radius:4px;}
01238: .copilot-msg.internal .copilot-bubble,.copilot-msg.external .copilot-bubble{background:var(--panel-2);border:1px solid var(--line);border-bottom-left-radius:4px;}
01239: .copilot-msg.external .copilot-bubble{border-left:3px solid var(--amber);}
01240: .copilot-answer-head{font-size:10px;text-transform:uppercase;letter-spacing:.55px;color:var(--text-dim);font-weight:700;margin-bottom:6px;}
01241: .copilot-result-group{margin-top:9px;padding-top:8px;border-top:1px solid var(--line);}
01242: .copilot-result-group:first-of-type{border-top:0;padding-top:0;}
01243: .copilot-result-title{font-weight:700;margin-bottom:4px;}
01244: .copilot-result-row{font-size:12px;color:var(--text-dim);padding:3px 0;overflow-wrap:anywhere;}
01245: .copilot-answer-summary{display:grid;grid-template-columns:repeat(auto-fit,minmax(105px,1fr));gap:7px;margin:8px 0 10px;}
01246: .copilot-answer-summary>div{border:1px solid var(--line);border-radius:9px;background:color-mix(in srgb,var(--panel) 86%,transparent);padding:9px 10px;min-width:0;}
01247: .copilot-summary-number{display:block;font:700 17px/1.05 var(--font-display);color:var(--text);}
01248: .copilot-summary-label{display:block;margin-top:4px;font-size:9.5px;line-height:1.25;color:var(--text-dim);overflow-wrap:anywhere;}
01249: .copilot-category-stack,.copilot-external-card-stack{display:grid;gap:10px;margin-top:9px;}
01250: .copilot-category-card,.copilot-external-card{--copilot-accent:var(--blue);border:1px solid var(--line);border-top:2px solid var(--copilot-accent);border-radius:11px;background:linear-gradient(180deg,color-mix(in srgb,var(--panel-2) 94%,var(--copilot-accent) 6%),var(--panel-2));padding:10px;min-width:0;box-shadow:0 6px 18px rgba(0,0,0,.12);}
01251: .copilot-category-card.cat-logbook{--copilot-accent:#5aa9ff}.copilot-category-card.cat-machine{--copilot-accent:#9b8cff}.copilot-category-card.cat-people{--copilot-accent:#53d3b2}.copilot-category-card.cat-knowledge{--copilot-accent:#c796ff}.copilot-category-card.cat-sparepart{--copilot-accent:#ffb04d}.copilot-category-card.cat-patrol{--copilot-accent:#5bd6ff}.copilot-category-card.cat-kpi{--copilot-accent:#3ddc97}.copilot-category-card.cat-energy{--copilot-accent:#f4d35e}.copilot-category-card.cat-report{--copilot-accent:#ff8090}.copilot-category-card.cat-default{--copilot-accent:var(--text-dim)}
01252: .copilot-category-head,.copilot-external-head{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:8px;}
01253: .copilot-category-title{display:flex;align-items:flex-start;gap:8px;min-width:0;font:700 12px/1.25 var(--font-display);color:var(--text);}
01254: .copilot-category-title>div{min-width:0}.copilot-category-title small{display:block;margin-top:2px;font:500 9.5px/1.25 var(--font-body);color:var(--text-dim);overflow-wrap:anywhere;}
01255: .copilot-category-icon,.copilot-external-icon{font-size:16px;line-height:1;flex:0 0 auto;}
01256: .copilot-count-badge{flex:0 0 auto;border:1px solid color-mix(in srgb,var(--copilot-accent) 50%,var(--line));background:color-mix(in srgb,var(--copilot-accent) 11%,transparent);color:var(--copilot-accent);border-radius:999px;padding:3px 7px;font:700 9.5px/1.1 var(--font-mono);}
01257: .copilot-category-sub{font-size:10.5px;color:var(--text-dim);margin:-2px 0 8px}.copilot-page-explain{font-size:12.5px;line-height:1.55;color:var(--text);}
01258: .copilot-record-list{display:grid;gap:7px;}
01259: .copilot-data-record{border:1px solid var(--line-soft);border-radius:9px;background:var(--panel);padding:8px 9px;min-width:0;}
01260: .copilot-record-top{display:flex;align-items:flex-start;gap:7px;margin-bottom:7px;}
01261: .copilot-record-index{flex:0 0 auto;border-radius:5px;background:color-mix(in srgb,var(--copilot-accent) 12%,transparent);color:var(--copilot-accent);padding:2px 5px;font:700 9px/1.2 var(--font-mono);}
01262: .copilot-record-title{font-weight:700;font-size:11.5px;line-height:1.35;color:var(--text);min-width:0;overflow-wrap:anywhere;}
01263: .copilot-kv-grid,.copilot-external-kv-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(118px,1fr));gap:6px;}
01264: .copilot-kv,.copilot-external-kv{border-radius:7px;background:var(--panel-2);padding:6px 7px;min-width:0;}
01265: .copilot-kv-key,.copilot-external-kv span{display:block;font-size:8.5px;text-transform:uppercase;letter-spacing:.35px;color:var(--text-dim);margin-bottom:2px;overflow-wrap:anywhere;}
01266: .copilot-kv-value,.copilot-external-kv b{display:block;font-size:10.5px;line-height:1.35;color:var(--text);font-weight:600;overflow-wrap:anywhere;word-break:break-word;}
01267: .copilot-more-note,.copilot-confidence-note{margin-top:8px;padding:7px 8px;border-radius:7px;background:color-mix(in srgb,var(--panel) 82%,transparent);font-size:10px;line-height:1.35;color:var(--text-dim);}
01268: .copilot-empty-card{display:flex;align-items:flex-start;gap:9px;border:1px dashed var(--line);border-radius:10px;background:var(--panel-2);padding:11px 12px;}.copilot-empty-card>span{font-size:18px}.copilot-empty-card b{display:block;font-size:12px;color:var(--text);margin-bottom:3px}.copilot-empty-card small{display:block;font-size:10.5px;line-height:1.4;color:var(--text-dim)}
01269: .copilot-scope-lock{display:flex;align-items:flex-start;gap:8px;margin:7px 0 10px;padding:8px 10px;border:1px solid color-mix(in srgb,var(--green) 38%,var(--line));border-radius:9px;background:color-mix(in srgb,var(--green) 7%,var(--panel-2));}.copilot-scope-lock>span{font-size:14px}.copilot-scope-lock b{display:block;font-size:11px;color:var(--green);margin-bottom:2px}.copilot-scope-lock small{display:block;font-size:9.5px;line-height:1.35;color:var(--text-dim)}
01270: .copilot-external-card{--copilot-accent:var(--blue)}.copilot-external-card.ext-warning{--copilot-accent:var(--amber)}.copilot-external-card.ext-action{--copilot-accent:var(--green)}.copilot-external-card.ext-sparepart{--copilot-accent:#ffb04d}.copilot-external-card.ext-kpi{--copilot-accent:#53d3b2}.copilot-external-card.ext-diagnosis{--copilot-accent:#9b8cff}.copilot-external-card.ext-source{--copilot-accent:#5aa9ff}.copilot-external-card.ext-summary{--copilot-accent:#ff8090}
01271: .copilot-external-head{justify-content:flex-start;font:700 11.5px/1.25 var(--font-display);color:var(--copilot-accent);margin-bottom:7px;}
01272: .copilot-external-body{font-size:11.5px;line-height:1.5;color:var(--text-dim)}.copilot-external-body p{margin:0 0 7px}.copilot-external-body p:last-child{margin-bottom:0}.copilot-external-list{margin:6px 0 0;padding-left:18px}.copilot-external-list li{margin:4px 0;color:var(--text)}
01273: .copilot-record-empty{font-size:10.5px;color:var(--text-dim)}
01274: @media(max-width:520px){.copilot-answer-summary{grid-template-columns:repeat(2,minmax(0,1fr))}.copilot-kv-grid,.copilot-external-kv-grid{grid-template-columns:1fr}.copilot-category-card,.copilot-external-card{padding:9px}.copilot-count-badge{font-size:9px}}
01275: .copilot-composer{border-top:1px solid var(--line);padding:10px 12px calc(10px + env(safe-area-inset-bottom,0px));background:var(--panel);}
01276: .copilot-composer textarea{width:100%;min-height:58px;max-height:130px;resize:vertical;margin:0;}
01277: .copilot-actions{display:flex;gap:8px;margin-top:8px;align-items:center;}
01278: .copilot-actions .btn{flex:1;justify-content:center;}
01279: .copilot-actions .btn[disabled]{opacity:.45;cursor:not-allowed;}
01280: .copilot-footnote{font-size:10.5px;color:var(--text-dim);margin-top:7px;line-height:1.35;}
01281: .copilot-thinking{display:flex;align-items:center;gap:7px;color:var(--text-dim);font-size:12px;}
01282: @media(max-width:780px){
01283:   #copilot-fab{right:14px;bottom:calc(82px + env(safe-area-inset-bottom,0px));width:50px;height:50px;font-size:22px;}
01284:   .copilot-panel{width:100vw;}
01285: }
01286: .ci-source-toggle{
01287:   margin-top:10px;display:inline-flex;align-items:center;gap:6px;background:none;border:1px solid var(--line);
~~~

### Around source line 1284
~~~text
01266: .copilot-kv-value,.copilot-external-kv b{display:block;font-size:10.5px;line-height:1.35;color:var(--text);font-weight:600;overflow-wrap:anywhere;word-break:break-word;}
01267: .copilot-more-note,.copilot-confidence-note{margin-top:8px;padding:7px 8px;border-radius:7px;background:color-mix(in srgb,var(--panel) 82%,transparent);font-size:10px;line-height:1.35;color:var(--text-dim);}
01268: .copilot-empty-card{display:flex;align-items:flex-start;gap:9px;border:1px dashed var(--line);border-radius:10px;background:var(--panel-2);padding:11px 12px;}.copilot-empty-card>span{font-size:18px}.copilot-empty-card b{display:block;font-size:12px;color:var(--text);margin-bottom:3px}.copilot-empty-card small{display:block;font-size:10.5px;line-height:1.4;color:var(--text-dim)}
01269: .copilot-scope-lock{display:flex;align-items:flex-start;gap:8px;margin:7px 0 10px;padding:8px 10px;border:1px solid color-mix(in srgb,var(--green) 38%,var(--line));border-radius:9px;background:color-mix(in srgb,var(--green) 7%,var(--panel-2));}.copilot-scope-lock>span{font-size:14px}.copilot-scope-lock b{display:block;font-size:11px;color:var(--green);margin-bottom:2px}.copilot-scope-lock small{display:block;font-size:9.5px;line-height:1.35;color:var(--text-dim)}
01270: .copilot-external-card{--copilot-accent:var(--blue)}.copilot-external-card.ext-warning{--copilot-accent:var(--amber)}.copilot-external-card.ext-action{--copilot-accent:var(--green)}.copilot-external-card.ext-sparepart{--copilot-accent:#ffb04d}.copilot-external-card.ext-kpi{--copilot-accent:#53d3b2}.copilot-external-card.ext-diagnosis{--copilot-accent:#9b8cff}.copilot-external-card.ext-source{--copilot-accent:#5aa9ff}.copilot-external-card.ext-summary{--copilot-accent:#ff8090}
01271: .copilot-external-head{justify-content:flex-start;font:700 11.5px/1.25 var(--font-display);color:var(--copilot-accent);margin-bottom:7px;}
01272: .copilot-external-body{font-size:11.5px;line-height:1.5;color:var(--text-dim)}.copilot-external-body p{margin:0 0 7px}.copilot-external-body p:last-child{margin-bottom:0}.copilot-external-list{margin:6px 0 0;padding-left:18px}.copilot-external-list li{margin:4px 0;color:var(--text)}
01273: .copilot-record-empty{font-size:10.5px;color:var(--text-dim)}
01274: @media(max-width:520px){.copilot-answer-summary{grid-template-columns:repeat(2,minmax(0,1fr))}.copilot-kv-grid,.copilot-external-kv-grid{grid-template-columns:1fr}.copilot-category-card,.copilot-external-card{padding:9px}.copilot-count-badge{font-size:9px}}
01275: .copilot-composer{border-top:1px solid var(--line);padding:10px 12px calc(10px + env(safe-area-inset-bottom,0px));background:var(--panel);}
01276: .copilot-composer textarea{width:100%;min-height:58px;max-height:130px;resize:vertical;margin:0;}
01277: .copilot-actions{display:flex;gap:8px;margin-top:8px;align-items:center;}
01278: .copilot-actions .btn{flex:1;justify-content:center;}
01279: .copilot-actions .btn[disabled]{opacity:.45;cursor:not-allowed;}
01280: .copilot-footnote{font-size:10.5px;color:var(--text-dim);margin-top:7px;line-height:1.35;}
01281: .copilot-thinking{display:flex;align-items:center;gap:7px;color:var(--text-dim);font-size:12px;}
01282: @media(max-width:780px){
01283:   #copilot-fab{right:14px;bottom:calc(82px + env(safe-area-inset-bottom,0px));width:50px;height:50px;font-size:22px;}
01284:   .copilot-panel{width:100vw;}
01285: }
01286: .ci-source-toggle{
01287:   margin-top:10px;display:inline-flex;align-items:center;gap:6px;background:none;border:1px solid var(--line);
01288:   border-radius:6px;padding:5px 10px;font-size:11.5px;color:var(--text-dim);cursor:pointer;transition:var(--trans);
01289: }
01290: .ci-source-toggle:hover{border-color:var(--amber);color:var(--amber);}
01291: .ci-source-toggle.open{border-color:var(--amber);color:var(--amber);}
01292: .ci-source-list{margin-top:8px;border:1px solid var(--line);border-radius:8px;overflow:hidden;}
01293: .ci-source-row{
01294:   display:flex;flex-wrap:wrap;gap:8px;padding:7px 10px;font-size:11.5px;border-bottom:1px solid var(--line);
01295:   color:var(--text-dim);
01296: }
01297: .ci-source-row:last-child{border-bottom:none;}
01298: .ci-source-date{font-family:var(--font-mono);white-space:nowrap;}
01299: .ci-source-mesin{font-weight:600;color:var(--text);}
01300: .ci-source-desc{flex:1;min-width:120px;}
01301: .ci-source-durasi{font-family:var(--font-mono);white-space:nowrap;color:var(--amber);}
01302: 
01303: .ci-card{
01304:   border:1px solid var(--line);border-left:3px solid var(--line);border-radius:10px;
01305:   background:var(--panel-2);padding:12px 14px;margin-bottom:10px;
01306: }
01307: .ci-card.lv-critical{border-left-color:var(--red);}
01308: .ci-card.lv-warning{border-left-color:var(--amber);}
01309: .ci-card.lv-info{border-left-color:#5b9dff;}
01310: .ci-card.lv-good{border-left-color:var(--green);}
01311: .ci-head{display:flex;align-items:center;gap:8px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.4px;margin-bottom:6px;}
01312: .ci-card.lv-critical .ci-head{color:var(--red);}
01313: .ci-card.lv-warning .ci-head{color:var(--amber);}
01314: .ci-card.lv-info .ci-head{color:#5b9dff;}
01315: .ci-card.lv-good .ci-head{color:var(--green);}
01316: .ci-text{font-size:13px;line-height:1.55;}
01317: .ci-text b{color:var(--text);}
01318: .ci-sub{font-size:11px;color:var(--text-dim);margin-top:6px;line-height:1.5;}
01319: 
01320: /* ---------------- ANALITIK & DASHBOARD ---------------- */
01321: .an-kpi-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px;margin-bottom:18px;}
01322: .an-kpi{
01323:   background:linear-gradient(180deg, var(--panel-2), var(--panel));border:1px solid var(--line);
01324:   border-radius:12px;padding:16px 18px;position:relative;overflow:hidden;
01325: }
01326: .an-kpi .lbl{font-size:10.5px;text-transform:uppercase;letter-spacing:.6px;color:var(--text-dim);font-family:var(--font-mono);}
01327: .an-kpi .val{font-family:var(--font-mono);font-size:26px;font-weight:700;margin-top:6px;line-height:1;}
01328: .an-kpi .sub{font-size:11px;color:var(--text-dim);margin-top:6px;}
01329: .an-kpi.k-mttr .val{color:var(--amber);}
01330: .an-kpi.k-mtbf .val{color:var(--blue,#5b9dff);}
01331: .an-kpi.k-downtime .val{color:var(--red);}
01332: .an-kpi.k-avail .val{color:var(--green);}
01333: .an-section-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px;}
01334: @media (max-width:900px){.an-section-grid{grid-template-columns:1fr;}}
01335: .an-card{
01336:   background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:16px 18px;margin-bottom:14px;
01337: }
01338: 
01339: /* ---------------- KPI KERTAS KERJA ---------------- */
01340: .kk-bulan-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;}
01341: .kk-bulan-cell{background:var(--panel-2);border:1px solid var(--line);border-radius:8px;padding:8px 10px;}
01342: .kk-bulan-cell .kk-bulan-lbl{font-size:11px;color:var(--text-dim);font-family:var(--font-mono);margin-bottom:6px;text-transform:uppercase;}
01343: .kk-bulan-cell input{width:100%;margin-bottom:6px;font-size:12.5px;}
~~~

### Around source line 5866
~~~text
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
~~~

## copilot-header — 0
## copilot-body — 4
### Around source line 1232
~~~text
01214: /* ---------------- AI TANYA JAWAB COPILOT ---------------- */
01215: #copilot-fab{
01216:   position:fixed;right:18px;bottom:calc(18px + env(safe-area-inset-bottom,0px));z-index:850;
01217:   width:56px;height:56px;border-radius:50%;background:linear-gradient(145deg,var(--red),var(--amber));
01218:   border:none;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,.32);display:flex;align-items:center;justify-content:center;
01219:   font-size:25px;transition:transform var(--trans),box-shadow var(--trans);touch-action:manipulation;
01220: }
01221: #copilot-fab:hover{transform:translateY(-2px) scale(1.04);box-shadow:0 10px 28px rgba(0,0,0,.38);}
01222: #copilot-fab:active{transform:scale(.96);}
01223: .copilot-fab-icon{filter:drop-shadow(0 1px 2px rgba(0,0,0,.35));}
01224: .copilot-fab-dot{display:none!important;}
01225: .copilot-bg{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:900;display:none;opacity:0;transition:opacity var(--trans);}
01226: .copilot-bg.active{display:block;opacity:1;}
01227: .copilot-panel{position:fixed;top:0;right:0;bottom:0;width:min(440px,100vw);background:var(--panel);border-left:1px solid var(--line);display:flex;flex-direction:column;transform:translateX(100%);transition:transform var(--trans);box-shadow:-10px 0 30px rgba(0,0,0,.35);}
01228: .copilot-bg.active .copilot-panel{transform:translateX(0);}
01229: .copilot-head{display:flex;justify-content:space-between;align-items:flex-start;padding:calc(16px + env(safe-area-inset-top,0px)) 16px 12px;border-bottom:1px solid var(--line);}
01230: .copilot-title{font-family:var(--font-display);font-size:17px;font-weight:700;}
01231: .copilot-ctx{font-size:11.5px;color:var(--text-dim);margin-top:3px;line-height:1.4;}
01232: .copilot-body{flex:1;overflow-y:auto;padding:14px 14px 8px;scroll-behavior:smooth;}
01233: .copilot-welcome{padding:12px 13px;border:1px solid var(--line);border-radius:12px;background:var(--panel-2);font-size:12.5px;line-height:1.55;color:var(--text-dim);}
01234: .copilot-msg{display:flex;margin:10px 0;}
01235: .copilot-msg.user{justify-content:flex-end;}
01236: .copilot-bubble{max-width:92%;border-radius:13px;padding:10px 12px;font-size:13px;line-height:1.55;overflow-wrap:anywhere;white-space:normal;}
01237: .copilot-msg.user .copilot-bubble{background:var(--red);color:#fff;border-bottom-right-radius:4px;}
01238: .copilot-msg.internal .copilot-bubble,.copilot-msg.external .copilot-bubble{background:var(--panel-2);border:1px solid var(--line);border-bottom-left-radius:4px;}
01239: .copilot-msg.external .copilot-bubble{border-left:3px solid var(--amber);}
01240: .copilot-answer-head{font-size:10px;text-transform:uppercase;letter-spacing:.55px;color:var(--text-dim);font-weight:700;margin-bottom:6px;}
01241: .copilot-result-group{margin-top:9px;padding-top:8px;border-top:1px solid var(--line);}
01242: .copilot-result-group:first-of-type{border-top:0;padding-top:0;}
01243: .copilot-result-title{font-weight:700;margin-bottom:4px;}
01244: .copilot-result-row{font-size:12px;color:var(--text-dim);padding:3px 0;overflow-wrap:anywhere;}
01245: .copilot-answer-summary{display:grid;grid-template-columns:repeat(auto-fit,minmax(105px,1fr));gap:7px;margin:8px 0 10px;}
01246: .copilot-answer-summary>div{border:1px solid var(--line);border-radius:9px;background:color-mix(in srgb,var(--panel) 86%,transparent);padding:9px 10px;min-width:0;}
01247: .copilot-summary-number{display:block;font:700 17px/1.05 var(--font-display);color:var(--text);}
01248: .copilot-summary-label{display:block;margin-top:4px;font-size:9.5px;line-height:1.25;color:var(--text-dim);overflow-wrap:anywhere;}
01249: .copilot-category-stack,.copilot-external-card-stack{display:grid;gap:10px;margin-top:9px;}
01250: .copilot-category-card,.copilot-external-card{--copilot-accent:var(--blue);border:1px solid var(--line);border-top:2px solid var(--copilot-accent);border-radius:11px;background:linear-gradient(180deg,color-mix(in srgb,var(--panel-2) 94%,var(--copilot-accent) 6%),var(--panel-2));padding:10px;min-width:0;box-shadow:0 6px 18px rgba(0,0,0,.12);}
01251: .copilot-category-card.cat-logbook{--copilot-accent:#5aa9ff}.copilot-category-card.cat-machine{--copilot-accent:#9b8cff}.copilot-category-card.cat-people{--copilot-accent:#53d3b2}.copilot-category-card.cat-knowledge{--copilot-accent:#c796ff}.copilot-category-card.cat-sparepart{--copilot-accent:#ffb04d}.copilot-category-card.cat-patrol{--copilot-accent:#5bd6ff}.copilot-category-card.cat-kpi{--copilot-accent:#3ddc97}.copilot-category-card.cat-energy{--copilot-accent:#f4d35e}.copilot-category-card.cat-report{--copilot-accent:#ff8090}.copilot-category-card.cat-default{--copilot-accent:var(--text-dim)}
01252: .copilot-category-head,.copilot-external-head{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:8px;}
01253: .copilot-category-title{display:flex;align-items:flex-start;gap:8px;min-width:0;font:700 12px/1.25 var(--font-display);color:var(--text);}
01254: .copilot-category-title>div{min-width:0}.copilot-category-title small{display:block;margin-top:2px;font:500 9.5px/1.25 var(--font-body);color:var(--text-dim);overflow-wrap:anywhere;}
01255: .copilot-category-icon,.copilot-external-icon{font-size:16px;line-height:1;flex:0 0 auto;}
01256: .copilot-count-badge{flex:0 0 auto;border:1px solid color-mix(in srgb,var(--copilot-accent) 50%,var(--line));background:color-mix(in srgb,var(--copilot-accent) 11%,transparent);color:var(--copilot-accent);border-radius:999px;padding:3px 7px;font:700 9.5px/1.1 var(--font-mono);}
01257: .copilot-category-sub{font-size:10.5px;color:var(--text-dim);margin:-2px 0 8px}.copilot-page-explain{font-size:12.5px;line-height:1.55;color:var(--text);}
01258: .copilot-record-list{display:grid;gap:7px;}
01259: .copilot-data-record{border:1px solid var(--line-soft);border-radius:9px;background:var(--panel);padding:8px 9px;min-width:0;}
01260: .copilot-record-top{display:flex;align-items:flex-start;gap:7px;margin-bottom:7px;}
01261: .copilot-record-index{flex:0 0 auto;border-radius:5px;background:color-mix(in srgb,var(--copilot-accent) 12%,transparent);color:var(--copilot-accent);padding:2px 5px;font:700 9px/1.2 var(--font-mono);}
01262: .copilot-record-title{font-weight:700;font-size:11.5px;line-height:1.35;color:var(--text);min-width:0;overflow-wrap:anywhere;}
01263: .copilot-kv-grid,.copilot-external-kv-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(118px,1fr));gap:6px;}
01264: .copilot-kv,.copilot-external-kv{border-radius:7px;background:var(--panel-2);padding:6px 7px;min-width:0;}
01265: .copilot-kv-key,.copilot-external-kv span{display:block;font-size:8.5px;text-transform:uppercase;letter-spacing:.35px;color:var(--text-dim);margin-bottom:2px;overflow-wrap:anywhere;}
01266: .copilot-kv-value,.copilot-external-kv b{display:block;font-size:10.5px;line-height:1.35;color:var(--text);font-weight:600;overflow-wrap:anywhere;word-break:break-word;}
01267: .copilot-more-note,.copilot-confidence-note{margin-top:8px;padding:7px 8px;border-radius:7px;background:color-mix(in srgb,var(--panel) 82%,transparent);font-size:10px;line-height:1.35;color:var(--text-dim);}
01268: .copilot-empty-card{display:flex;align-items:flex-start;gap:9px;border:1px dashed var(--line);border-radius:10px;background:var(--panel-2);padding:11px 12px;}.copilot-empty-card>span{font-size:18px}.copilot-empty-card b{display:block;font-size:12px;color:var(--text);margin-bottom:3px}.copilot-empty-card small{display:block;font-size:10.5px;line-height:1.4;color:var(--text-dim)}
01269: .copilot-scope-lock{display:flex;align-items:flex-start;gap:8px;margin:7px 0 10px;padding:8px 10px;border:1px solid color-mix(in srgb,var(--green) 38%,var(--line));border-radius:9px;background:color-mix(in srgb,var(--green) 7%,var(--panel-2));}.copilot-scope-lock>span{font-size:14px}.copilot-scope-lock b{display:block;font-size:11px;color:var(--green);margin-bottom:2px}.copilot-scope-lock small{display:block;font-size:9.5px;line-height:1.35;color:var(--text-dim)}
01270: .copilot-external-card{--copilot-accent:var(--blue)}.copilot-external-card.ext-warning{--copilot-accent:var(--amber)}.copilot-external-card.ext-action{--copilot-accent:var(--green)}.copilot-external-card.ext-sparepart{--copilot-accent:#ffb04d}.copilot-external-card.ext-kpi{--copilot-accent:#53d3b2}.copilot-external-card.ext-diagnosis{--copilot-accent:#9b8cff}.copilot-external-card.ext-source{--copilot-accent:#5aa9ff}.copilot-external-card.ext-summary{--copilot-accent:#ff8090}
01271: .copilot-external-head{justify-content:flex-start;font:700 11.5px/1.25 var(--font-display);color:var(--copilot-accent);margin-bottom:7px;}
01272: .copilot-external-body{font-size:11.5px;line-height:1.5;color:var(--text-dim)}.copilot-external-body p{margin:0 0 7px}.copilot-external-body p:last-child{margin-bottom:0}.copilot-external-list{margin:6px 0 0;padding-left:18px}.copilot-external-list li{margin:4px 0;color:var(--text)}
01273: .copilot-record-empty{font-size:10.5px;color:var(--text-dim)}
01274: @media(max-width:520px){.copilot-answer-summary{grid-template-columns:repeat(2,minmax(0,1fr))}.copilot-kv-grid,.copilot-external-kv-grid{grid-template-columns:1fr}.copilot-category-card,.copilot-external-card{padding:9px}.copilot-count-badge{font-size:9px}}
01275: .copilot-composer{border-top:1px solid var(--line);padding:10px 12px calc(10px + env(safe-area-inset-bottom,0px));background:var(--panel);}
01276: .copilot-composer textarea{width:100%;min-height:58px;max-height:130px;resize:vertical;margin:0;}
01277: .copilot-actions{display:flex;gap:8px;margin-top:8px;align-items:center;}
01278: .copilot-actions .btn{flex:1;justify-content:center;}
01279: .copilot-actions .btn[disabled]{opacity:.45;cursor:not-allowed;}
01280: .copilot-footnote{font-size:10.5px;color:var(--text-dim);margin-top:7px;line-height:1.35;}
01281: .copilot-thinking{display:flex;align-items:center;gap:7px;color:var(--text-dim);font-size:12px;}
01282: @media(max-width:780px){
01283:   #copilot-fab{right:14px;bottom:calc(82px + env(safe-area-inset-bottom,0px));width:50px;height:50px;font-size:22px;}
01284:   .copilot-panel{width:100vw;}
01285: }
01286: .ci-source-toggle{
01287:   margin-top:10px;display:inline-flex;align-items:center;gap:6px;background:none;border:1px solid var(--line);
01288:   border-radius:6px;padding:5px 10px;font-size:11.5px;color:var(--text-dim);cursor:pointer;transition:var(--trans);
01289: }
01290: .ci-source-toggle:hover{border-color:var(--amber);color:var(--amber);}
01291: .ci-source-toggle.open{border-color:var(--amber);color:var(--amber);}
~~~

### Around source line 5874
~~~text
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

### Around source line 22957
~~~text
22939:   if(machineScopeLabel) html+='<div class="copilot-scope-lock"><span>🔒</span><div><b>Scope dikunci: '+escapeHtml(machineScopeLabel)+'</b><small>Record tanpa identitas mesin yang cocok persis tidak ditampilkan.</small></div></div>';
22940:   html+='<div class="copilot-answer-summary"><div><span class="copilot-summary-number">'+totalHits.toLocaleString('id-ID')+'</span><span class="copilot-summary-label">kecocokan ditampilkan</span></div><div><span class="copilot-summary-number">'+visible.length+'</span><span class="copilot-summary-label">kategori data</span></div>'+(wantsCount&&top?'<div><span class="copilot-summary-number">'+top.total.toLocaleString('id-ID')+'</span><span class="copilot-summary-label">'+escapeHtml(top.src.name)+'</span></div>':'')+'</div>';
22941:   html+='<div class="copilot-category-stack">';
22942:   visible.forEach(g=>{
22943:     const meta=copilotCategoryMeta_(g.src.name);
22944:     html+='<section class="copilot-category-card cat-'+meta.tone+'">'+
22945:       '<div class="copilot-category-head"><div class="copilot-category-title"><span class="copilot-category-icon">'+meta.icon+'</span><div><span>'+escapeHtml(meta.label)+'</span><small>'+escapeHtml(g.src.name)+'</small></div></div><span class="copilot-count-badge">'+g.total+' cocok</span></div>'+
22946:       '<div class="copilot-record-list">'+g.matches.slice(0,machineQuery?6:4).map((r,i)=>copilotRowCardHtml_(r,g.src.name,i)).join('')+'</div>'+
22947:       (g.total>g.matches.slice(0,machineQuery?6:4).length?'<div class="copilot-more-note">+'+(g.total-g.matches.slice(0,machineQuery?6:4).length)+' data relevan lain tersedia di kategori ini.</div>':'')+'</section>';
22948:     g.matches.slice(0,machineQuery?6:4).forEach(r=>{ if(context.length<14) context.push('['+g.src.name+'] '+copilotRowText_(r).slice(0,700)); });
22949:   });
22950:   html+='</div>';
22951:   const high=(top.sourceHit && top.total>0) || (top.total>=3);
22952:   if(!high) html+='<div class="copilot-confidence-note">Kecocokan data internal masih terbatas. Gunakan AI External bila memerlukan interpretasi atau referensi tambahan.</div>';
22953:   return {html,context,confidence:high?'high':'medium'};
22954: }
22955: 
22956: function copilotAppendMessage_(type,content,isHtml){
22957:   const body=$('#copilot-body');
22958:   if(!body) return;
22959:   const msg=document.createElement('div'); msg.className=`copilot-msg ${type}`;
22960:   const bubble=document.createElement('div'); bubble.className='copilot-bubble';
22961:   if(isHtml) bubble.innerHTML=content; else bubble.textContent=content;
22962:   msg.appendChild(bubble); body.appendChild(msg); body.scrollTop=body.scrollHeight;
22963:   return msg;
22964: }
22965: function copilotSetThinking_(label){
22966:   const el=copilotAppendMessage_('internal',`<div class="copilot-thinking"><span class="ai-spinner"></span>${escapeHtml(label||'Mencari data internal...')}</div>`,true);
22967:   if(el) el.dataset.thinking='1'; return el;
22968: }
22969: async function copilotAskInternal_(){
22970:   const qEl=$('#copilot-question'); const q=String(qEl?.value||'').trim();
22971:   if(!q){ toast('Tulis pertanyaan untuk Copilot.',true); return; }
22972:   COPILOT_LAST_QUESTION=q; COPILOT_LAST_CONTEXT=[];
22973:   copilotAppendMessage_('user',q,false); qEl.value='';
22974:   const thinking=copilotSetThinking_('Mencari seluruh data internal aplikasi...');
22975:   await new Promise(r=>setTimeout(r,40));
22976:   const ans=copilotInternalAnswer_(q);
22977:   thinking?.remove();
22978:   COPILOT_LAST_CONTEXT=ans.context; COPILOT_LAST_CONFIDENCE=ans.confidence;
22979:   copilotAppendMessage_('internal',ans.html,true);
22980:   const ext=$('#copilot-ask-external'); if(ext) ext.disabled=false;
22981: }
22982: async function copilotAskExternal_(){
22983:   if(!COPILOT_LAST_QUESTION){ toast('Ajukan pertanyaan ke AI Internal terlebih dahulu.',true); return; }
22984:   if(!WEB_APP_URL){ toast('Backend Cloudflare belum terhubung.',true); return; }
22985:   const btn=$('#copilot-ask-external'); btn.disabled=true;
22986:   const thinking=copilotSetThinking_('Meminta AI External dengan konteks data relevan...');
22987:   try{
22988:     const ctx=COPILOT_LAST_CONTEXT.length ? COPILOT_LAST_CONTEXT.join('\n') : '(Tidak ada data internal yang cocok.)';
22989:     const machineTargets=copilotResolveMachineTargets_(COPILOT_LAST_QUESTION);
22990:     const machineRule=machineTargets.length ? ('\nBATASAN KERAS MESIN: Jawaban HANYA boleh membahas '+machineTargets.map(t=>t.label).join(', ')+'. Jangan masukkan data, contoh kasus, status, sparepart, KPI, patrol, atau fakta internal milik mesin lain kecuali pengguna secara eksplisit meminta perbandingan. Jika konteks internal tidak cukup, nyatakan kekurangannya; jangan mengisi dengan data mesin lain.\n') : '';
22991:     const query='Jawab pertanyaan pengguna dengan bahasa Indonesia. Utamakan fakta dari konteks internal OMODOS di bawah. Jika konteks tidak cukup, boleh gunakan pengetahuan umum TANPA mengarang data internal. Susun jawaban dengan kategori yang jelas (misalnya Ringkasan, Diagnosis/Temuan, Data, Tindakan/Rekomendasi, Risiko/Catatan).'+machineRule+'\nPERTANYAAN:\n'+COPILOT_LAST_QUESTION+'\n\nKONTEKS INTERNAL OMODOS:\n'+ctx;
22992:     const res=await apiPost({action:'aiAnalyze',mode:'freeform',query,cases:[],localPatterns:[]});
22993:     const data=(res&&res.data)||{};
22994:     const text=data.summary ? data.summary : (res&&res.summary ? res.summary : 'AI External tidak mengembalikan jawaban.');
22995:     const otherMachineMentions=machineTargets.length ? copilotExternalOtherMachineMentions_(text,machineTargets) : [];
22996:     if(otherMachineMentions.length){
22997:       thinking?.remove();
22998:       copilotAppendMessage_('external','<div class="copilot-answer-head">AI External · scope mesin</div><div class="copilot-empty-card"><span>🔒</span><div><b>Jawaban ditahan karena keluar dari scope mesin</b><small>AI External mendeteksi referensi ke mesin lain. Tidak ada bagian jawaban lintas-mesin yang ditampilkan. Perjelas pertanyaan atau coba lagi.</small></div></div>',true);
22999:       return;
23000:     }
23001:     thinking?.remove();
23002:     copilotAppendMessage_('external','<div class="copilot-answer-head">AI External · hasil terstruktur</div>'+copilotExternalCardsHtml_(text,data),true);
23003:   }catch(err){
23004:     thinking?.remove();
23005:     copilotAppendMessage_('external','<div class="copilot-answer-head">AI External</div><div class="copilot-empty-card"><span>⚠️</span><div><b>Gagal menghubungi AI External</b><small>'+escapeHtml(err.message||String(err))+'</small></div></div>',true);
23006:   }finally{ btn.disabled=false; }
23007: }
23008: 
23009: function openCopilot(){
23010:   $('#copilot-bg').classList.add('active');
23011:   setTimeout(()=>$('#copilot-question')?.focus(),80);
23012: }
23013: function closeCopilot(){ $('#copilot-bg').classList.remove('active'); }
23014: function copilotClearData_(){
23015:   COPILOT_LAST_MACHINE=null; COPILOT_LAST_QUESTION=''; COPILOT_LAST_CONTEXT=[]; COPILOT_LAST_CONFIDENCE='low';
23016:   const q=$('#copilot-question'); if(q) q.value='';
~~~

### Around source line 23017
~~~text
22999:       return;
23000:     }
23001:     thinking?.remove();
23002:     copilotAppendMessage_('external','<div class="copilot-answer-head">AI External · hasil terstruktur</div>'+copilotExternalCardsHtml_(text,data),true);
23003:   }catch(err){
23004:     thinking?.remove();
23005:     copilotAppendMessage_('external','<div class="copilot-answer-head">AI External</div><div class="copilot-empty-card"><span>⚠️</span><div><b>Gagal menghubungi AI External</b><small>'+escapeHtml(err.message||String(err))+'</small></div></div>',true);
23006:   }finally{ btn.disabled=false; }
23007: }
23008: 
23009: function openCopilot(){
23010:   $('#copilot-bg').classList.add('active');
23011:   setTimeout(()=>$('#copilot-question')?.focus(),80);
23012: }
23013: function closeCopilot(){ $('#copilot-bg').classList.remove('active'); }
23014: function copilotClearData_(){
23015:   COPILOT_LAST_MACHINE=null; COPILOT_LAST_QUESTION=''; COPILOT_LAST_CONTEXT=[]; COPILOT_LAST_CONFIDENCE='low';
23016:   const q=$('#copilot-question'); if(q) q.value='';
23017:   const body=$('#copilot-body');
23018:   if(body) body.innerHTML='<div class="copilot-welcome">Tanyakan data atau hal yang ada di OMODOS, misalnya status pekerjaan, histori mesin, material sparepart, personil, KPI, project, meeting, patrol, atau Knowledge Base. Saya akan mencari data internal terlebih dahulu di seluruh database aplikasi.</div>';
23019:   const ext=$('#copilot-ask-external'); if(ext) ext.disabled=true;
23020:   toast('Data percakapan dan konteks Copilot dibersihkan. Database aplikasi tidak dihapus.');
23021: }
23022: 
23023: $('#copilot-fab').addEventListener('click',openCopilot);
23024: $('#copilot-close').addEventListener('click',closeCopilot);
23025: $('#copilot-bg').addEventListener('click',ev=>{ if(ev.target.id==='copilot-bg') closeCopilot(); });
23026: $('#copilot-ask-internal').addEventListener('click',copilotAskInternal_);
23027: $('#copilot-ask-external').addEventListener('click',copilotAskExternal_);
23028: $('#copilot-clear-data')?.addEventListener('click',copilotClearData_);
23029: $('#copilot-question').addEventListener('keydown',ev=>{
23030:   if(ev.key==='Enter'&&!ev.shiftKey){ ev.preventDefault(); copilotAskInternal_(); }
23031: });
23032: 
23033: /* =========================================================
23034:    PEOPLE INTELLIGENCE SYSTEM (module baru)
23035:    - Sumber kompetensi teknis: 02__Assessment_TechComp_Result -
23036:      Offset Technical.xlsx (dibaca apa adanya, tidak diubah/di-rename).
23037:    - Soft Skill Assessment: modul baru, dinilai Supervisor skala 1-5,
23038:      disimpan di localStorage (pola sama seperti modul lain di app ini)
23039:      dan otomatis diantre ke sync queue kalau WEB_APP_URL sudah diisi
23040:      (memakai fungsi queueForSync_ / dst yang sudah ada, kalau tersedia).
23041:    ========================================================= */
23042: 
23043: // ---- Source of truth: hasil Assessment Kompetensi Teknis (read-only) ----
23044: // [HARDCODE REMOVED] PI_TECH_DATA sebelumnya berisi data personil/hard skill
23045: // yang di-hardcode langsung di kode. Sesuai kebijakan "Data strictly manual",
23046: // tidak ada lagi data karyawan/PI yang di-hardcode di sini — seluruh data
23047: // kompetensi teknis personil berasal murni dari Hard Skill Assessment manual
23048: // (PI_HS_ASSESSMENTS, tersimpan di database SQLite) lewat piFindTech() di bawah.
23049: const PI_TECH_DATA = [];
23050: 
23051: // ---- Katalog 10 aspek Soft Skill Assessment ----
23052: const PI_SOFTSKILL_ITEMS = [
23053:   'Disiplin','Integritas','Kerja Sama Tim','Komunikasi','Inisiatif',
23054:   'Pemecahan Masalah','Tanggung Jawab','Kemampuan Beradaptasi',
23055:   'Kesadaran Keselamatan Kerja','Kemauan Belajar dan Berkembang'
23056: ];
23057: 
23058: 
23059: // ---- Pemetaan indikatif 10 aspek Soft Skill Assessment ke beberapa kerangka kepribadian ----
23060: // Catatan: ini BUKAN alat tes psikometri resmi (bukan MBTI/DISC/Big Five/EQ asli).
23061: // Ini hanya interpretasi heuristik untuk membantu Supervisor/HR membaca kecenderungan
23062: // gaya kerja & kematangan emosional dari skor asesmen soft skill yang sudah ada (skala 1-5).
23063: const PI_DISC_MAP = {
23064:   'Disiplin': 'C',
23065:   'Integritas': 'C',
23066:   'Kerja Sama Tim': 'I',
23067:   'Komunikasi': 'I',
23068:   'Inisiatif': 'D',
23069:   'Pemecahan Masalah': 'D',
23070:   'Tanggung Jawab': 'C',
23071:   'Kemampuan Beradaptasi': 'S',
23072:   'Kesadaran Keselamatan Kerja': 'S',
23073:   'Kemauan Belajar dan Berkembang': 'D'
23074: };
23075: 
23076: const PI_DISC_INFO = {
~~~

## copilot-input — 0
## copilot-toggle — 0
## copilot-close — 2
### Around source line 5872
~~~text
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
~~~

### Around source line 23024
~~~text
23006:   }finally{ btn.disabled=false; }
23007: }
23008: 
23009: function openCopilot(){
23010:   $('#copilot-bg').classList.add('active');
23011:   setTimeout(()=>$('#copilot-question')?.focus(),80);
23012: }
23013: function closeCopilot(){ $('#copilot-bg').classList.remove('active'); }
23014: function copilotClearData_(){
23015:   COPILOT_LAST_MACHINE=null; COPILOT_LAST_QUESTION=''; COPILOT_LAST_CONTEXT=[]; COPILOT_LAST_CONFIDENCE='low';
23016:   const q=$('#copilot-question'); if(q) q.value='';
23017:   const body=$('#copilot-body');
23018:   if(body) body.innerHTML='<div class="copilot-welcome">Tanyakan data atau hal yang ada di OMODOS, misalnya status pekerjaan, histori mesin, material sparepart, personil, KPI, project, meeting, patrol, atau Knowledge Base. Saya akan mencari data internal terlebih dahulu di seluruh database aplikasi.</div>';
23019:   const ext=$('#copilot-ask-external'); if(ext) ext.disabled=true;
23020:   toast('Data percakapan dan konteks Copilot dibersihkan. Database aplikasi tidak dihapus.');
23021: }
23022: 
23023: $('#copilot-fab').addEventListener('click',openCopilot);
23024: $('#copilot-close').addEventListener('click',closeCopilot);
23025: $('#copilot-bg').addEventListener('click',ev=>{ if(ev.target.id==='copilot-bg') closeCopilot(); });
23026: $('#copilot-ask-internal').addEventListener('click',copilotAskInternal_);
23027: $('#copilot-ask-external').addEventListener('click',copilotAskExternal_);
23028: $('#copilot-clear-data')?.addEventListener('click',copilotClearData_);
23029: $('#copilot-question').addEventListener('keydown',ev=>{
23030:   if(ev.key==='Enter'&&!ev.shiftKey){ ev.preventDefault(); copilotAskInternal_(); }
23031: });
23032: 
23033: /* =========================================================
23034:    PEOPLE INTELLIGENCE SYSTEM (module baru)
23035:    - Sumber kompetensi teknis: 02__Assessment_TechComp_Result -
23036:      Offset Technical.xlsx (dibaca apa adanya, tidak diubah/di-rename).
23037:    - Soft Skill Assessment: modul baru, dinilai Supervisor skala 1-5,
23038:      disimpan di localStorage (pola sama seperti modul lain di app ini)
23039:      dan otomatis diantre ke sync queue kalau WEB_APP_URL sudah diisi
23040:      (memakai fungsi queueForSync_ / dst yang sudah ada, kalau tersedia).
23041:    ========================================================= */
23042: 
23043: // ---- Source of truth: hasil Assessment Kompetensi Teknis (read-only) ----
23044: // [HARDCODE REMOVED] PI_TECH_DATA sebelumnya berisi data personil/hard skill
23045: // yang di-hardcode langsung di kode. Sesuai kebijakan "Data strictly manual",
23046: // tidak ada lagi data karyawan/PI yang di-hardcode di sini — seluruh data
23047: // kompetensi teknis personil berasal murni dari Hard Skill Assessment manual
23048: // (PI_HS_ASSESSMENTS, tersimpan di database SQLite) lewat piFindTech() di bawah.
23049: const PI_TECH_DATA = [];
23050: 
23051: // ---- Katalog 10 aspek Soft Skill Assessment ----
23052: const PI_SOFTSKILL_ITEMS = [
23053:   'Disiplin','Integritas','Kerja Sama Tim','Komunikasi','Inisiatif',
23054:   'Pemecahan Masalah','Tanggung Jawab','Kemampuan Beradaptasi',
23055:   'Kesadaran Keselamatan Kerja','Kemauan Belajar dan Berkembang'
23056: ];
23057: 
23058: 
23059: // ---- Pemetaan indikatif 10 aspek Soft Skill Assessment ke beberapa kerangka kepribadian ----
23060: // Catatan: ini BUKAN alat tes psikometri resmi (bukan MBTI/DISC/Big Five/EQ asli).
23061: // Ini hanya interpretasi heuristik untuk membantu Supervisor/HR membaca kecenderungan
23062: // gaya kerja & kematangan emosional dari skor asesmen soft skill yang sudah ada (skala 1-5).
23063: const PI_DISC_MAP = {
23064:   'Disiplin': 'C',
23065:   'Integritas': 'C',
23066:   'Kerja Sama Tim': 'I',
23067:   'Komunikasi': 'I',
23068:   'Inisiatif': 'D',
23069:   'Pemecahan Masalah': 'D',
23070:   'Tanggung Jawab': 'C',
23071:   'Kemampuan Beradaptasi': 'S',
23072:   'Kesadaran Keselamatan Kerja': 'S',
23073:   'Kemauan Belajar dan Berkembang': 'D'
23074: };
23075: 
23076: const PI_DISC_INFO = {
23077:   D: { label:'Dominance (D)', desc:'berorientasi hasil, cepat mengambil keputusan, menyukai tantangan dan tanggung jawab besar' },
23078:   I: { label:'Influence (I)', desc:'komunikatif, senang berinteraksi, mudah membangun hubungan dan bekerja sama dengan tim' },
23079:   S: { label:'Steadiness (S)', desc:'stabil, sabar, konsisten, menyukai rutinitas yang jelas dan lingkungan kerja yang aman/tertib' },
23080:   C: { label:'Conscientiousness (C)', desc:'teliti, patuh pada aturan dan standar, berorientasi pada akurasi, disiplin, dan integritas' }
23081: };
23082: 
23083: // Pemetaan ke Big Five / OCEAN
~~~

## function renderCopilot — 0
## function openCopilot — 1
### Around source line 23009
~~~text
22991:     const query='Jawab pertanyaan pengguna dengan bahasa Indonesia. Utamakan fakta dari konteks internal OMODOS di bawah. Jika konteks tidak cukup, boleh gunakan pengetahuan umum TANPA mengarang data internal. Susun jawaban dengan kategori yang jelas (misalnya Ringkasan, Diagnosis/Temuan, Data, Tindakan/Rekomendasi, Risiko/Catatan).'+machineRule+'\nPERTANYAAN:\n'+COPILOT_LAST_QUESTION+'\n\nKONTEKS INTERNAL OMODOS:\n'+ctx;
22992:     const res=await apiPost({action:'aiAnalyze',mode:'freeform',query,cases:[],localPatterns:[]});
22993:     const data=(res&&res.data)||{};
22994:     const text=data.summary ? data.summary : (res&&res.summary ? res.summary : 'AI External tidak mengembalikan jawaban.');
22995:     const otherMachineMentions=machineTargets.length ? copilotExternalOtherMachineMentions_(text,machineTargets) : [];
22996:     if(otherMachineMentions.length){
22997:       thinking?.remove();
22998:       copilotAppendMessage_('external','<div class="copilot-answer-head">AI External · scope mesin</div><div class="copilot-empty-card"><span>🔒</span><div><b>Jawaban ditahan karena keluar dari scope mesin</b><small>AI External mendeteksi referensi ke mesin lain. Tidak ada bagian jawaban lintas-mesin yang ditampilkan. Perjelas pertanyaan atau coba lagi.</small></div></div>',true);
22999:       return;
23000:     }
23001:     thinking?.remove();
23002:     copilotAppendMessage_('external','<div class="copilot-answer-head">AI External · hasil terstruktur</div>'+copilotExternalCardsHtml_(text,data),true);
23003:   }catch(err){
23004:     thinking?.remove();
23005:     copilotAppendMessage_('external','<div class="copilot-answer-head">AI External</div><div class="copilot-empty-card"><span>⚠️</span><div><b>Gagal menghubungi AI External</b><small>'+escapeHtml(err.message||String(err))+'</small></div></div>',true);
23006:   }finally{ btn.disabled=false; }
23007: }
23008: 
23009: function openCopilot(){
23010:   $('#copilot-bg').classList.add('active');
23011:   setTimeout(()=>$('#copilot-question')?.focus(),80);
23012: }
23013: function closeCopilot(){ $('#copilot-bg').classList.remove('active'); }
23014: function copilotClearData_(){
23015:   COPILOT_LAST_MACHINE=null; COPILOT_LAST_QUESTION=''; COPILOT_LAST_CONTEXT=[]; COPILOT_LAST_CONFIDENCE='low';
23016:   const q=$('#copilot-question'); if(q) q.value='';
23017:   const body=$('#copilot-body');
23018:   if(body) body.innerHTML='<div class="copilot-welcome">Tanyakan data atau hal yang ada di OMODOS, misalnya status pekerjaan, histori mesin, material sparepart, personil, KPI, project, meeting, patrol, atau Knowledge Base. Saya akan mencari data internal terlebih dahulu di seluruh database aplikasi.</div>';
23019:   const ext=$('#copilot-ask-external'); if(ext) ext.disabled=true;
23020:   toast('Data percakapan dan konteks Copilot dibersihkan. Database aplikasi tidak dihapus.');
23021: }
23022: 
23023: $('#copilot-fab').addEventListener('click',openCopilot);
23024: $('#copilot-close').addEventListener('click',closeCopilot);
23025: $('#copilot-bg').addEventListener('click',ev=>{ if(ev.target.id==='copilot-bg') closeCopilot(); });
23026: $('#copilot-ask-internal').addEventListener('click',copilotAskInternal_);
23027: $('#copilot-ask-external').addEventListener('click',copilotAskExternal_);
23028: $('#copilot-clear-data')?.addEventListener('click',copilotClearData_);
23029: $('#copilot-question').addEventListener('keydown',ev=>{
23030:   if(ev.key==='Enter'&&!ev.shiftKey){ ev.preventDefault(); copilotAskInternal_(); }
23031: });
23032: 
23033: /* =========================================================
23034:    PEOPLE INTELLIGENCE SYSTEM (module baru)
23035:    - Sumber kompetensi teknis: 02__Assessment_TechComp_Result -
23036:      Offset Technical.xlsx (dibaca apa adanya, tidak diubah/di-rename).
23037:    - Soft Skill Assessment: modul baru, dinilai Supervisor skala 1-5,
23038:      disimpan di localStorage (pola sama seperti modul lain di app ini)
23039:      dan otomatis diantre ke sync queue kalau WEB_APP_URL sudah diisi
23040:      (memakai fungsi queueForSync_ / dst yang sudah ada, kalau tersedia).
23041:    ========================================================= */
23042: 
23043: // ---- Source of truth: hasil Assessment Kompetensi Teknis (read-only) ----
23044: // [HARDCODE REMOVED] PI_TECH_DATA sebelumnya berisi data personil/hard skill
23045: // yang di-hardcode langsung di kode. Sesuai kebijakan "Data strictly manual",
23046: // tidak ada lagi data karyawan/PI yang di-hardcode di sini — seluruh data
23047: // kompetensi teknis personil berasal murni dari Hard Skill Assessment manual
23048: // (PI_HS_ASSESSMENTS, tersimpan di database SQLite) lewat piFindTech() di bawah.
23049: const PI_TECH_DATA = [];
23050: 
23051: // ---- Katalog 10 aspek Soft Skill Assessment ----
23052: const PI_SOFTSKILL_ITEMS = [
23053:   'Disiplin','Integritas','Kerja Sama Tim','Komunikasi','Inisiatif',
23054:   'Pemecahan Masalah','Tanggung Jawab','Kemampuan Beradaptasi',
23055:   'Kesadaran Keselamatan Kerja','Kemauan Belajar dan Berkembang'
23056: ];
23057: 
23058: 
23059: // ---- Pemetaan indikatif 10 aspek Soft Skill Assessment ke beberapa kerangka kepribadian ----
23060: // Catatan: ini BUKAN alat tes psikometri resmi (bukan MBTI/DISC/Big Five/EQ asli).
23061: // Ini hanya interpretasi heuristik untuk membantu Supervisor/HR membaca kecenderungan
23062: // gaya kerja & kematangan emosional dari skor asesmen soft skill yang sudah ada (skala 1-5).
23063: const PI_DISC_MAP = {
23064:   'Disiplin': 'C',
23065:   'Integritas': 'C',
23066:   'Kerja Sama Tim': 'I',
23067:   'Komunikasi': 'I',
23068:   'Inisiatif': 'D',
~~~

## function closeCopilot — 1
### Around source line 23013
~~~text
22995:     const otherMachineMentions=machineTargets.length ? copilotExternalOtherMachineMentions_(text,machineTargets) : [];
22996:     if(otherMachineMentions.length){
22997:       thinking?.remove();
22998:       copilotAppendMessage_('external','<div class="copilot-answer-head">AI External · scope mesin</div><div class="copilot-empty-card"><span>🔒</span><div><b>Jawaban ditahan karena keluar dari scope mesin</b><small>AI External mendeteksi referensi ke mesin lain. Tidak ada bagian jawaban lintas-mesin yang ditampilkan. Perjelas pertanyaan atau coba lagi.</small></div></div>',true);
22999:       return;
23000:     }
23001:     thinking?.remove();
23002:     copilotAppendMessage_('external','<div class="copilot-answer-head">AI External · hasil terstruktur</div>'+copilotExternalCardsHtml_(text,data),true);
23003:   }catch(err){
23004:     thinking?.remove();
23005:     copilotAppendMessage_('external','<div class="copilot-answer-head">AI External</div><div class="copilot-empty-card"><span>⚠️</span><div><b>Gagal menghubungi AI External</b><small>'+escapeHtml(err.message||String(err))+'</small></div></div>',true);
23006:   }finally{ btn.disabled=false; }
23007: }
23008: 
23009: function openCopilot(){
23010:   $('#copilot-bg').classList.add('active');
23011:   setTimeout(()=>$('#copilot-question')?.focus(),80);
23012: }
23013: function closeCopilot(){ $('#copilot-bg').classList.remove('active'); }
23014: function copilotClearData_(){
23015:   COPILOT_LAST_MACHINE=null; COPILOT_LAST_QUESTION=''; COPILOT_LAST_CONTEXT=[]; COPILOT_LAST_CONFIDENCE='low';
23016:   const q=$('#copilot-question'); if(q) q.value='';
23017:   const body=$('#copilot-body');
23018:   if(body) body.innerHTML='<div class="copilot-welcome">Tanyakan data atau hal yang ada di OMODOS, misalnya status pekerjaan, histori mesin, material sparepart, personil, KPI, project, meeting, patrol, atau Knowledge Base. Saya akan mencari data internal terlebih dahulu di seluruh database aplikasi.</div>';
23019:   const ext=$('#copilot-ask-external'); if(ext) ext.disabled=true;
23020:   toast('Data percakapan dan konteks Copilot dibersihkan. Database aplikasi tidak dihapus.');
23021: }
23022: 
23023: $('#copilot-fab').addEventListener('click',openCopilot);
23024: $('#copilot-close').addEventListener('click',closeCopilot);
23025: $('#copilot-bg').addEventListener('click',ev=>{ if(ev.target.id==='copilot-bg') closeCopilot(); });
23026: $('#copilot-ask-internal').addEventListener('click',copilotAskInternal_);
23027: $('#copilot-ask-external').addEventListener('click',copilotAskExternal_);
23028: $('#copilot-clear-data')?.addEventListener('click',copilotClearData_);
23029: $('#copilot-question').addEventListener('keydown',ev=>{
23030:   if(ev.key==='Enter'&&!ev.shiftKey){ ev.preventDefault(); copilotAskInternal_(); }
23031: });
23032: 
23033: /* =========================================================
23034:    PEOPLE INTELLIGENCE SYSTEM (module baru)
23035:    - Sumber kompetensi teknis: 02__Assessment_TechComp_Result -
23036:      Offset Technical.xlsx (dibaca apa adanya, tidak diubah/di-rename).
23037:    - Soft Skill Assessment: modul baru, dinilai Supervisor skala 1-5,
23038:      disimpan di localStorage (pola sama seperti modul lain di app ini)
23039:      dan otomatis diantre ke sync queue kalau WEB_APP_URL sudah diisi
23040:      (memakai fungsi queueForSync_ / dst yang sudah ada, kalau tersedia).
23041:    ========================================================= */
23042: 
23043: // ---- Source of truth: hasil Assessment Kompetensi Teknis (read-only) ----
23044: // [HARDCODE REMOVED] PI_TECH_DATA sebelumnya berisi data personil/hard skill
23045: // yang di-hardcode langsung di kode. Sesuai kebijakan "Data strictly manual",
23046: // tidak ada lagi data karyawan/PI yang di-hardcode di sini — seluruh data
23047: // kompetensi teknis personil berasal murni dari Hard Skill Assessment manual
23048: // (PI_HS_ASSESSMENTS, tersimpan di database SQLite) lewat piFindTech() di bawah.
23049: const PI_TECH_DATA = [];
23050: 
23051: // ---- Katalog 10 aspek Soft Skill Assessment ----
23052: const PI_SOFTSKILL_ITEMS = [
23053:   'Disiplin','Integritas','Kerja Sama Tim','Komunikasi','Inisiatif',
23054:   'Pemecahan Masalah','Tanggung Jawab','Kemampuan Beradaptasi',
23055:   'Kesadaran Keselamatan Kerja','Kemauan Belajar dan Berkembang'
23056: ];
23057: 
23058: 
23059: // ---- Pemetaan indikatif 10 aspek Soft Skill Assessment ke beberapa kerangka kepribadian ----
23060: // Catatan: ini BUKAN alat tes psikometri resmi (bukan MBTI/DISC/Big Five/EQ asli).
23061: // Ini hanya interpretasi heuristik untuk membantu Supervisor/HR membaca kecenderungan
23062: // gaya kerja & kematangan emosional dari skor asesmen soft skill yang sudah ada (skala 1-5).
23063: const PI_DISC_MAP = {
23064:   'Disiplin': 'C',
23065:   'Integritas': 'C',
23066:   'Kerja Sama Tim': 'I',
23067:   'Komunikasi': 'I',
23068:   'Inisiatif': 'D',
23069:   'Pemecahan Masalah': 'D',
23070:   'Tanggung Jawab': 'C',
23071:   'Kemampuan Beradaptasi': 'S',
23072:   'Kesadaran Keselamatan Kerja': 'S',
~~~

## function switchToView — 1
### Around source line 8177
~~~text
08159: function handleViewRenderError_(view, label, err){
08160:   const msg = err && err.message ? err.message : String(err || 'Error tidak diketahui');
08161:   console.error('[OMODOS] Gagal render view:', {view, label, error:err});
08162:   try{ if(typeof copilotLogError === 'function') copilotLogError('Render '+view+': '+msg, label||''); }catch(e){}
08163:   toast('Gagal memuat '+(label||view)+': '+msg, true);
08164: }
08165: function invokeViewRenderer_(view, renderer, label){
08166:   try{
08167:     const result = renderer();
08168:     if(result && typeof result.then === 'function'){
08169:       result.catch(err=>handleViewRenderError_(view,label,err));
08170:     }
08171:     return result;
08172:   }catch(err){
08173:     handleViewRenderError_(view,label,err);
08174:     return null;
08175:   }
08176: }
08177: function switchToView(enteringView){
08178:   enteringView = String(enteringView||'').trim();
08179:   if(!enteringView){ toast('Tujuan halaman tidak valid.', true); return false; }
08180:   if(typeof canAccessView_ === 'function' && !canAccessView_(enteringView)){
08181:     showAccessDenied();
08182:     return false;
08183:   }
08184:   const enteringViewEl = document.getElementById('view-' + enteringView);
08185:   if(!enteringViewEl){
08186:     console.error('[OMODOS] View target tidak ditemukan:', enteringView);
08187:     toast('Halaman "' + enteringView + '" belum tersedia. Muat ulang aplikasi lalu coba lagi.', true);
08188:     return false;
08189:   }
08190: 
08191:   const leavingView = PREVIOUS_ACTIVE_VIEW;
08192: 
08193:   $$('.nav-btn').forEach(b=>b.classList.remove('active'));
08194:   $$('.nav-btn').forEach(b=>{ if(b.dataset.view===enteringView) b.classList.add('active'); });
08195:   $$('.bottom-nav-btn').forEach(b=>{ b.classList.remove('active'); b.classList.remove('group-active'); });
08196:   $$('.bottom-nav-btn').forEach(b=>{
08197:     if(b.dataset.view===enteringView){ b.classList.add('active'); return; }
08198:     if(b.dataset.group){
08199:       const submenu = $(`.nav-submenu[data-submenu="${b.dataset.group}"]`);
08200:       if(submenu && $(`.nav-btn[data-view="${enteringView}"]`, submenu)) b.classList.add('group-active');
08201:     }
08202:   });
08203:   $$('.view').forEach(v=>v.classList.remove('active'));
08204:   enteringViewEl.classList.add('active');
08205: 
08206:   // Fitur AI harus selalu kembali ke kondisi default setiap kali pengguna
08207:   // meninggalkan halaman ini — supaya tidak ada hasil analisa "nyangkut"
08208:   // dari sesi sebelumnya saat pengguna kembali lagi ke menu AI.
08209:   if(leavingView === 'ai' && enteringView !== 'ai'){ resetAiView(); }
08210: 
08211:   // Menu Setting: begitu pengguna meninggalkan menu ini ke menu lain,
08212:   // status login direset — supaya kembali ke menu Setting nanti wajib
08213:   // login ulang. Koneksi Cloudflare (WEB_APP_URL) TIDAK terpengaruh
08214:   // sama sekali oleh reset ini, tetap tersambung seperti biasa.
08215:   if(leavingView === 'setting' && enteringView !== 'setting'){ resetSettingAuth(); }
08216: 
08217:   // Hentikan interval jam berjalan Visual Dashboard saat berpindah halaman,
08218:   // supaya tidak terus berjalan di background dan membuang resource.
08219:   if(leavingView === 'dashboard' && enteringView !== 'dashboard' && DASHBOARD_TIMER_INTERVAL){
08220:     clearInterval(DASHBOARD_TIMER_INTERVAL); DASHBOARD_TIMER_INTERVAL = null;
08221:   }
08222: 
08223:   // Visual Dashboard tampil fullscreen: menu kiri disembunyikan dan hanya
08224:   // muncul saat tombol "Tampilkan Menu" diklik.
08225:   if(enteringView === 'dashboard'){
08226:     $('#app-root').classList.add('dash-mode');
08227:     closeDashMenu();
08228:   } else if(leavingView === 'dashboard'){
08229:     $('#app-root').classList.remove('dash-mode');
08230:     closeDashMenu();
08231:   }
08232: 
08233:   if(enteringView === 'utama') invokeViewRenderer_(enteringView, renderUtama, 'renderUtama');
08234:   if(enteringView === 'mesin') invokeViewRenderer_(enteringView, renderMesinView, 'renderMesinView');
08235:   if(enteringView === 'tanggal') invokeViewRenderer_(enteringView, renderTanggalView, 'renderTanggalView');
08236:   if(enteringView === 'pelapor') invokeViewRenderer_(enteringView, renderPelaporView, 'renderPelaporView');
~~~

