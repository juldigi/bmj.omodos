# Missing Static Dependencies Audit

## Resource references

### omodos4/omodos4.css — 1 hit(s)
~~~text
03241: #copilot-clear-data{grid-column:1/-1!important;width:100%;justify-content:center;}
03242: }
03243: </style>
03244: <link rel="stylesheet" href="/omodos4/omodos4.css">
03245: 
03246: <!-- OMODOS4_PHASE1_SAFE -->
03247: <style id="omodos4-phase1-style">
~~~

### omodos4/bootstrap.js — 1 hit(s)
~~~text
28367: })();
28368: </script>
28369: 
28370: <script src="/omodos4/bootstrap.js"></script>
28371: 
28372: <script id="omodos4-phase1-script">
28373: (function(){
~~~

### vendor/jspdf.min.js — 1 hit(s)
~~~text
03119: </style>
03120: <!-- Library export laporan: PDF (jsPDF+html2canvas), Word (docx.js), Excel (ExcelJS), Excel-read (SheetJS - dipakai modul Analisa Downtime) -->
03121: <script src="/vendor/html2canvas.min.js"></script>
03122: <script src="/vendor/jspdf.min.js"></script>
03123: <script src="/vendor/docx.min.js"></script>
03124: <script src="/vendor/xlsx.min.js"></script>
03125: <script src="/vendor/exceljs.min.js"></script>
~~~

### vendor/docx.min.js — 1 hit(s)
~~~text
03120: <!-- Library export laporan: PDF (jsPDF+html2canvas), Word (docx.js), Excel (ExcelJS), Excel-read (SheetJS - dipakai modul Analisa Downtime) -->
03121: <script src="/vendor/html2canvas.min.js"></script>
03122: <script src="/vendor/jspdf.min.js"></script>
03123: <script src="/vendor/docx.min.js"></script>
03124: <script src="/vendor/xlsx.min.js"></script>
03125: <script src="/vendor/exceljs.min.js"></script>
03126: <!-- Chart.js: dipakai menu baru "Analitik & Dashboard" (Pareto, trend, dsb) -->
~~~

### vendor/xlsx.min.js — 1 hit(s)
~~~text
03121: <script src="/vendor/html2canvas.min.js"></script>
03122: <script src="/vendor/jspdf.min.js"></script>
03123: <script src="/vendor/docx.min.js"></script>
03124: <script src="/vendor/xlsx.min.js"></script>
03125: <script src="/vendor/exceljs.min.js"></script>
03126: <!-- Chart.js: dipakai menu baru "Analitik & Dashboard" (Pareto, trend, dsb) -->
03127: <script src="/vendor/chart.min.js"></script>
~~~

### vendor/vis-network.min.js — 1 hit(s)
~~~text
03125: <script src="/vendor/exceljs.min.js"></script>
03126: <!-- Chart.js: dipakai menu baru "Analitik & Dashboard" (Pareto, trend, dsb) -->
03127: <script src="/vendor/chart.min.js"></script>
03128: <script src="/vendor/vis-network.min.js"></script>
03129: 
03130: <style id="scroll-top-global-style">
03131: #scroll-to-top-btn{position:fixed;right:18px;bottom:calc(84px + env(safe-area-inset-bottom,0px));z-index:849;width:46px;height:46px;border-radius:50%;border:1px solid var(--line);background:var(--panel);color:var(--text);box-shadow:0 10px 30px rgba(0,0,0,.22);display:flex;align-items:center;justify-content:center;opacity:0;visibility:hidden;transform:translateY(10px);pointer-events:none;transition:opacity .18s ease,transform .18s ease,visibility .18s;cursor:pointer}
~~~

### vendor/html2canvas.min.js — 1 hit(s)
~~~text
03118: }
03119: </style>
03120: <!-- Library export laporan: PDF (jsPDF+html2canvas), Word (docx.js), Excel (ExcelJS), Excel-read (SheetJS - dipakai modul Analisa Downtime) -->
03121: <script src="/vendor/html2canvas.min.js"></script>
03122: <script src="/vendor/jspdf.min.js"></script>
03123: <script src="/vendor/docx.min.js"></script>
03124: <script src="/vendor/xlsx.min.js"></script>
~~~

### vendor/exceljs.min.js — 1 hit(s)
~~~text
03122: <script src="/vendor/jspdf.min.js"></script>
03123: <script src="/vendor/docx.min.js"></script>
03124: <script src="/vendor/xlsx.min.js"></script>
03125: <script src="/vendor/exceljs.min.js"></script>
03126: <!-- Chart.js: dipakai menu baru "Analitik & Dashboard" (Pareto, trend, dsb) -->
03127: <script src="/vendor/chart.min.js"></script>
03128: <script src="/vendor/vis-network.min.js"></script>
~~~

### vendor/chart.min.js — 1 hit(s)
~~~text
03124: <script src="/vendor/xlsx.min.js"></script>
03125: <script src="/vendor/exceljs.min.js"></script>
03126: <!-- Chart.js: dipakai menu baru "Analitik & Dashboard" (Pareto, trend, dsb) -->
03127: <script src="/vendor/chart.min.js"></script>
03128: <script src="/vendor/vis-network.min.js"></script>
03129: 
03130: <style id="scroll-top-global-style">
~~~

## Global/library usage

### jsPDF — 8 matching line(s)
- L3120: <!-- Library export laporan: PDF (jsPDF+html2canvas), Word (docx.js), Excel (ExcelJS), Excel-read (SheetJS - dipakai modul Analisa Downtime) -->
- L3122: <script src="/vendor/jspdf.min.js"></script>
- L11932: if(typeof html2canvas === 'undefined' || typeof window.jspdf === 'undefined'){
- L11939: const { jsPDF } = window.jspdf;
- L11940: const pdf = new jsPDF('p','pt','a4');
- L20768: if(typeof html2canvas === 'undefined' || typeof window.jspdf === 'undefined'){
- L20777: const { jsPDF } = window.jspdf;
- L20778: const pdf = new jsPDF('p','pt','a4');

### docx — 23 matching line(s)
- L2613: #rca-report-content .config-banner, #rca-report-content #btn-print-rca, #rca-report-content #btn-export-rca-pdf, #rca-report-content #btn-export-rca-docx, #rca-report-content #btn-export-rca-xlsx,
- L3120: <!-- Library export laporan: PDF (jsPDF+html2canvas), Word (docx.js), Excel (ExcelJS), Excel-read (SheetJS - dipakai modul Analisa Downtime) -->
- L3123: <script src="/vendor/docx.min.js"></script>
- L11426: <button class="btn btn-sm" id="btn-export-rca-docx"><i class="ph-bold ph-file-doc"></i> Export Word</button>
- L11434: $('#btn-export-rca-docx').addEventListener('click', ()=> exportRcaDocx(rep.machineName));
- L11868: <button class="btn btn-sm" id="btn-export-rca-docx"><i class="ph-bold ph-file-doc"></i> Export Word</button>
- L11903: $('#btn-export-rca-docx').addEventListener('click', ()=> exportRcaDocx(machineName));
- L11959: if(typeof window.docx === 'undefined' || typeof html2canvas === 'undefined'){
- L11962: const { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, ShadingType, ImageRun, BorderStyle, PageBreak } = window.docx;
- L12009: downloadBlob(blob, `RCA_${String(machineName).replace(/[^a-z0-9]+/gi,'_')}_${new Date().toISOString().slice(0,10)}.docx`);
- L12010: toast('Word (.docx) report RCA berhasil diunduh.');
- L20370: <button type="button" class="btn btn-sm" id="btn-gr-export-docx"><i class="ph-bold ph-file-doc"></i> Export Word</button>
- L20392: ['pdf','docx','xlsx'].forEach(fmt=>{
- L20398: else if(fmt==='docx') await exportProjectDocx(r.id);
- L20488: // Riwayat Laporan, dan dipakai ulang saat export (docx/pdf/xlsx).
- L20591: <button type="button" class="btn btn-sm" data-exportproj="docx" data-id="${escapeHtml(r.id)}" title="Export Word"><i class="ph-bold ph-file-doc"></i> Word</button>
- L20611: else if(fmt === 'docx') await exportProjectDocx(id);
- L20803: if(typeof window.docx === 'undefined'){
- L20806: const { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, ShadingType, ImageRun, AlignmentType, BorderStyle } = window.docx;
- L20851: downloadBlob(blob, `Laporan-Proyek-${(p.kodeProyek||p.namaProyek||'report').replace(/[^a-z0-9]+/gi,'_')}.docx`);
- L20852: toast('Word (.docx) laporan proyek berhasil diunduh.');
- L23510: const map = {jpg:'image/jpeg',jpeg:'image/jpeg',png:'image/png',gif:'image/gif',webp:'image/webp',heic:'image/heic',heif:'image/heif',mp4:'video/mp4',mov:'video/quicktime',m4v:'video/x-m4v',webm:'video/webm',avi:'video/x-msvideo',mkv:'video/x-matroska',pdf:'application/pdf',csv:'text/csv',txt:'text/plain',doc:'application/msword',docx:'application/vnd.openxmlformats-officedocument.wordprocessingml.document',xls:'application/vnd.ms-excel',xlsx:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',ppt:'application/vnd.ms-powerpoint',pptx:'application/vnd.openxmlformats-officedocument.presentationml.presentation'};
- L27706: <input type="file" id="mtg-w-attach-input" multiple accept="image/*,.pdf,.xlsx,.xls,.doc,.docx">

### XLSX — 26 matching line(s)
- L11923: /* ---------------- EXPORT REPORT RCA: PDF / DOCX / XLSX ---------------- */
- L13492: if(typeof XLSX === 'undefined'){ toast('Library pembaca Excel belum termuat, cek koneksi lalu coba lagi.', true); return; }
- L13498: const wb = XLSX.read(data, {type:'array'});
- L13501: const json = XLSX.utils.sheet_to_json(ws, {defval:''});
- L20717: /* ---------------- EXPORT LAPORAN PROYEK: PDF / DOCX / XLSX ---------------- */
- L20855: // ---- XLSX: workbook dengan cell diformat (warna fill mengikuti status,
- L21161: if(typeof XLSX === 'undefined'){ toast('Library pembaca Excel belum termuat, cek koneksi internet lalu coba lagi.', true); return; }
- L21169: const wb = XLSX.read(data, {type:'array'});
- L21172: const json = XLSX.utils.sheet_to_json(ws, {defval:''});
- L21296: if(typeof XLSX === 'undefined'){ toast('Library Excel belum termuat.', true); return; }
- L21298: const wb = XLSX.utils.book_new();
- L21299: const wsRaw = XLSX.utils.json_to_sheet(dtRawRows);
- L21300: XLSX.utils.book_append_sheet(wb, wsRaw, 'Data Asli');
- L21303: const wsCollected = XLSX.utils.json_to_sheet(collectedRows.length? collectedRows : [{Kategori:'(tidak ada data)'}]);
- L21304: XLSX.utils.book_append_sheet(wb, wsCollected, 'Elektrikal & Mekanikal');
- L21312: const wsResume = XLSX.utils.json_to_sheet(resumeRows);
- L21313: XLSX.utils.book_append_sheet(wb, wsResume, 'Resume TOP5');
- L21316: XLSX.writeFile(wb, outName);
- L21633: if(typeof XLSX === 'undefined'){ toast('Library Excel belum termuat.', true); return; }
- L21636: const wb = XLSX.utils.book_new();
- L21644: const ws = XLSX.utils.json_to_sheet(rows);
- L21646: XLSX.utils.book_append_sheet(wb, ws, sheetName || 'Resume');
- L21648: XLSX.writeFile(wb, `resume_downtime_${fileSafe}_${year}.xlsx`);
- L24452: function sheetTo2D(ws){ return XLSX.utils.sheet_to_json(ws, { header:1, defval:'' }); }
- L24608: const workbook = XLSX.read(data, { type:'array' });
- L24774: const workbook = XLSX.read(data, { type:'array' });

### vis — 3 matching line(s)
- L15838: const visNodes = new vis.DataSet(nodesToShow.map(n=>({
- L15843: const visEdges = new vis.DataSet(edgesToShow.map((e,i)=>({ id:i, from:e.from, to:e.to, value:e.value, color:{ color:'rgba(255,255,255,.18)' } })));
- L15846: KG_NETWORK = new vis.Network(holder, { nodes:visNodes, edges:visEdges }, {

### html2canvas — 10 matching line(s)
- L3120: <!-- Library export laporan: PDF (jsPDF+html2canvas), Word (docx.js), Excel (ExcelJS), Excel-read (SheetJS - dipakai modul Analisa Downtime) -->
- L3121: <script src="/vendor/html2canvas.min.js"></script>
- L11932: if(typeof html2canvas === 'undefined' || typeof window.jspdf === 'undefined'){
- L11938: const canvas = await html2canvas(node, { scale:2, backgroundColor:'#ffffff' });
- L11959: if(typeof window.docx === 'undefined' || typeof html2canvas === 'undefined'){
- L11987: const canvas = await html2canvas(fbEl, { scale:2, backgroundColor:'#ffffff' });
- L12014: if(typeof ExcelJS === 'undefined' || typeof html2canvas === 'undefined'){
- L12043: const canvas = await html2canvas(fbEl, { scale:2, backgroundColor:'#ffffff' });
- L20768: if(typeof html2canvas === 'undefined' || typeof window.jspdf === 'undefined'){
- L20775: const canvas = await html2canvas(holder, { scale:2, backgroundColor:'#ffffff' });

### ExcelJS — 5 matching line(s)
- L3120: <!-- Library export laporan: PDF (jsPDF+html2canvas), Word (docx.js), Excel (ExcelJS), Excel-read (SheetJS - dipakai modul Analisa Downtime) -->
- L12014: if(typeof ExcelJS === 'undefined' || typeof html2canvas === 'undefined'){
- L12017: const wb = new ExcelJS.Workbook();
- L20860: if(typeof ExcelJS === 'undefined'){
- L20864: const wb = new ExcelJS.Workbook();

### Chart — 25 matching line(s)
- L9844: ANALITIK_CHARTS.trend = new Chart($('#chart-trend'), {
- L9852: ANALITIK_CHARTS.jam = new Chart($('#chart-jam-rawan'), {
- L9861: ANALITIK_CHARTS.jenis = new Chart($('#chart-jenis'), {
- L9869: ANALITIK_CHARTS.teknisi = new Chart($('#chart-teknisi'), {
- L9878: ANALITIK_CHARTS.pareto = new Chart($('#chart-pareto'), {
- L10084: CORR_CHARTS.dow = new Chart($('#chart-corr-dow'), {
- L10093: CORR_CHARTS.shift = new Chart($('#chart-corr-shift'), {
- L10101: CORR_CHARTS.durasi = new Chart($('#chart-corr-durasi'), {
- L12971: ANALITIK_CHARTS.kpiKerja = new Chart(chartEl, {
- L13092: KD_ACHIEVEMENT_CHART=new Chart(canvas.getContext('2d'),{
- L13679: RYT_CHART = new Chart(canvas, {
- L13877: RHC_CHART = new Chart(canvas, {
- L14065: ECT_CHART = new Chart(canvas, {
- L14786: SPAREPART_PERIODIK_CHART = new Chart(canvas, {
- L23491: PI_CHARTS['radar_'+canvasId] = new Chart(ctx, {
- L23852: PI_CHARTS.compare = new Chart(ctx1, {
- L23878: PI_CHARTS.trend = new Chart(ctx2, {
- L26540: PMC_CHART_INSTANCES.status = new Chart($('#pmc-chart-status'), {
- L26559: PMC_CHART_INSTANCES.progress = new Chart($('#pmc-chart-progress-month'), {
- L26567: PMC_CHART_INSTANCES.benefit = new Chart($('#pmc-chart-benefit'), {
- L26573: PMC_CHART_INSTANCES.type = new Chart($('#pmc-chart-type'), {
- L27439: MTG_CHART_INSTANCES.jenis = new Chart($('#mtg-chart-jenis'), {
- L27447: MTG_CHART_INSTANCES.completion = new Chart($('#mtg-chart-completion'), {
- L27456: MTG_CHART_INSTANCES.mesin = new Chart($('#mtg-chart-mesin'), {
- L27464: MTG_CHART_INSTANCES.overdue = new Chart($('#mtg-chart-overdue'), {

## Existing dependency CDN URLs

- None found.

