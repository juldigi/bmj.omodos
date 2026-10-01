var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/worker.mjs
import { DurableObject } from "cloudflare:workers";

// src/storage.mjs
import { createHash, createHmac, randomUUID } from "node:crypto";
var encode = /* @__PURE__ */ __name((value) => JSON.stringify(value, function(k, v) {
  return this[k] instanceof Date ? { $date: this[k].toISOString() } : v;
}), "encode");
var decode = /* @__PURE__ */ __name((value) => JSON.parse(value, (k, v) => v && typeof v === "object" && Object.keys(v).length === 1 && v.$date ? new Date(v.$date) : v), "decode");
var clone = /* @__PURE__ */ __name((v) => decode(encode(v)), "clone");
function createStorage(sql, env = {}, origin = "http://localhost:8787") {
  sql.exec("CREATE TABLE IF NOT EXISTS sheets(name TEXT PRIMARY KEY)");
  sql.exec("CREATE TABLE IF NOT EXISTS sheet_rows(sheet TEXT NOT NULL,n INTEGER NOT NULL,data TEXT NOT NULL,PRIMARY KEY(sheet,n))");
  sql.exec("CREATE TABLE IF NOT EXISTS props(k TEXT PRIMARY KEY,v TEXT)");
  sql.exec("CREATE TABLE IF NOT EXISTS files(id TEXT PRIMARY KEY,name TEXT,mime TEXT,size INTEGER)");
  sql.exec("CREATE TABLE IF NOT EXISTS file_chunks(id TEXT,n INTEGER,data BLOB,PRIMARY KEY(id,n))");
  const tables = /* @__PURE__ */ new Map(), dirty = /* @__PURE__ */ new Map(), deleted = /* @__PURE__ */ new Set(), propWrites = /* @__PURE__ */ new Map(), files = [];
  const cache = /* @__PURE__ */ new Map();
  function load(name) {
    if (!tables.has(name)) {
      const records = [...sql.exec("SELECT n,data FROM sheet_rows WHERE sheet=? ORDER BY n", name)];
      const rows = [];
      for (const r of records) rows[r.n - 1] = decode(r.data);
      tables.set(name, rows);
    }
    return tables.get(name);
  }
  __name(load, "load");
  function touch(name, n) {
    if (!dirty.has(name)) dirty.set(name, /* @__PURE__ */ new Set());
    dirty.get(name).add(n);
  }
  __name(touch, "touch");
  function exists(name) {
    return tables.has(name) || [...sql.exec("SELECT name FROM sheets WHERE name=?", name)].length > 0;
  }
  __name(exists, "exists");
  class Range {
    static {
      __name(this, "Range");
    }
    constructor(sheet, r, c, n = 1, m = 1) {
      if (![r, c, n, m].every((x) => Number.isInteger(x) && x > 0)) throw Error("Invalid range");
      Object.assign(this, { sheet, r, c, n, m });
    }
    getValues() {
      const rows = load(this.sheet.name);
      return Array.from({ length: this.n }, (_, i) => Array.from({ length: this.m }, (_2, j) => clone(rows[this.r + i - 1]?.[this.c + j - 1] ?? "")));
    }
    getValue() {
      return this.getValues()[0][0];
    }
    setValues(values) {
      if (values.length !== this.n || values.some((r) => r.length !== this.m)) throw Error("Range dimension mismatch");
      const rows = load(this.sheet.name);
      values.forEach((row, i) => {
        const ix = this.r + i - 1;
        while (rows.length <= ix) rows.push([]);
        for (let j = 0; j < row.length; j++) rows[ix][this.c + j - 1] = clone(row[j]);
        touch(this.sheet.name, ix + 1);
      });
      cache.clear();
      return this;
    }
    setValue(v) {
      return this.setValues([[v]]);
    }
    clearContent() {
      return this.setValues(Array.from({ length: this.n }, () => Array(this.m).fill("")));
    }
  }
  class Sheet {
    static {
      __name(this, "Sheet");
    }
    constructor(name) {
      this.name = name;
    }
    getName() {
      return this.name;
    }
    getLastRow() {
      const rows = load(this.name);
      let n = rows.length;
      while (n && !rows[n - 1]?.some((v) => v !== "" && v != null)) n--;
      return n;
    }
    getLastColumn() {
      return load(this.name).reduce((n, r) => Math.max(n, r?.length || 0), 0);
    }
    getRange(...args) {
      return new Range(this, ...args);
    }
    getDataRange() {
      return this.getRange(1, 1, Math.max(1, this.getLastRow()), Math.max(1, this.getLastColumn()));
    }
    appendRow(row) {
      return this.getRange(this.getLastRow() + 1, 1, 1, row.length).setValues([row]);
    }
    deleteRow(n) {
      load(this.name).splice(n - 1, 1);
      deleted.add(this.name);
      load(this.name).forEach((_, i) => touch(this.name, i + 1));
      cache.clear();
      return this;
    }
  }
  const spreadsheet = { getSheetByName: /* @__PURE__ */ __name((n) => exists(n) ? new Sheet(n) : null, "getSheetByName"), insertSheet(n) {
    if (exists(n)) throw Error("Sheet already exists");
    tables.set(n, []);
    dirty.set(n, /* @__PURE__ */ new Set());
    return new Sheet(n);
  }, getSheets() {
    const names = new Set([...sql.exec("SELECT name FROM sheets")].map((r) => r.name));
    for (const n of tables.keys()) names.add(n);
    return [...names].map((n) => new Sheet(n));
  }, getId: /* @__PURE__ */ __name(() => "cloudflare-sqlite", "getId"), getUrl: /* @__PURE__ */ __name(() => origin, "getUrl") };
  const properties = { getProperty(k) {
    if (propWrites.has(k)) return propWrites.get(k);
    const r = [...sql.exec("SELECT v FROM props WHERE k=?", k)][0];
    return r ? r.v : env[k] ?? null;
  }, setProperty(k, v) {
    propWrites.set(k, String(v));
    return this;
  }, deleteProperty(k) {
    propWrites.set(k, null);
    return this;
  } };
  const iter = /* @__PURE__ */ __name((items) => {
    let i = 0;
    return { hasNext: /* @__PURE__ */ __name(() => i < items.length, "hasNext"), next: /* @__PURE__ */ __name(() => items[i++], "next") };
  }, "iter");
  function folder(name) {
    return { getId: /* @__PURE__ */ __name(() => name, "getId"), getFiles: /* @__PURE__ */ __name(() => iter([]), "getFiles"), createFile(blob) {
      const id = randomUUID() + randomUUID();
      const file = { id, name: blob.name || "lampiran", mime: blob.mime || "application/octet-stream", data: blob.buffer };
      files.push(file);
      return { getId: /* @__PURE__ */ __name(() => id, "getId"), getName: /* @__PURE__ */ __name(() => file.name, "getName"), getUrl: /* @__PURE__ */ __name(() => origin + "/files/" + id, "getUrl"), setSharing() {
        return this;
      } };
    } };
  }
  __name(folder, "folder");
  const bytes = /* @__PURE__ */ __name((v) => Buffer.isBuffer(v) ? v : Buffer.from(v), "bytes");
  const services = {
    SpreadsheetApp: { getActiveSpreadsheet: /* @__PURE__ */ __name(() => spreadsheet, "getActiveSpreadsheet"), flush() {
    } },
    PropertiesService: { getScriptProperties: /* @__PURE__ */ __name(() => properties, "getScriptProperties") },
    CacheService: { getScriptCache: /* @__PURE__ */ __name(() => ({ get(k) {
      const v = cache.get(k);
      return v && v.exp > Date.now() ? v.v : null;
    }, put(k, v, ttl) {
      cache.set(k, { v, exp: Date.now() + ttl * 1e3 });
    }, remove: /* @__PURE__ */ __name((k) => cache.delete(k), "remove"), removeAll: /* @__PURE__ */ __name((ks) => ks.forEach((k) => cache.delete(k)), "removeAll") }), "getScriptCache") },
    LockService: { getScriptLock: /* @__PURE__ */ __name(() => ({ tryLock: /* @__PURE__ */ __name(() => true, "tryLock"), releaseLock() {
    } }), "getScriptLock"), getDocumentLock: /* @__PURE__ */ __name(() => ({ tryLock: /* @__PURE__ */ __name(() => true, "tryLock"), releaseLock() {
    } }), "getDocumentLock") },
    Utilities: { getUuid: randomUUID, DigestAlgorithm: { SHA_256: "sha256" }, Charset: { UTF_8: "utf8" }, computeDigest: /* @__PURE__ */ __name((a, s) => Array.from(createHash("sha256").update(typeof s === "string" ? s : bytes(s)).digest()), "computeDigest"), computeHmacSha256Signature: /* @__PURE__ */ __name((v, k) => Array.from(createHmac("sha256", bytes(k)).update(bytes(v)).digest()), "computeHmacSha256Signature"), base64Decode: /* @__PURE__ */ __name((s) => Array.from(Buffer.from(s, "base64")), "base64Decode"), newBlob(v, mime, name) {
      return { buffer: bytes(v), mime, name, getBytes() {
        return Array.from(this.buffer);
      } };
    }, formatDate(d, tz, pattern) {
      const p = Object.fromEntries(new Intl.DateTimeFormat("en-GB", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" }).formatToParts(new Date(d)).map((x) => [x.type, x.value]));
      return pattern.replace(/yyyy|MM|dd|HH|mm|ss/g, (x) => ({ yyyy: p.year, MM: p.month, dd: p.day, HH: p.hour, mm: p.minute, ss: p.second })[x]);
    } },
    DriveApp: { Access: { ANYONE_WITH_LINK: 1 }, Permission: { VIEW: 1 }, getFolderById: folder, getFoldersByName: /* @__PURE__ */ __name((n) => iter([folder(n)]), "getFoldersByName"), createFolder: folder },
    ContentService: { MimeType: { JSON: "application/json" }, createTextOutput(content) {
      return { getContent: /* @__PURE__ */ __name(() => content, "getContent"), setMimeType() {
        return this;
      } };
    } },
    Session: { getScriptTimeZone: /* @__PURE__ */ __name(() => "Asia/Jakarta", "getScriptTimeZone") },
    Logger: { log() {
    } },
    UrlFetchApp: { async fetch(url, opts = {}) {
      const u = new URL(url);
      if (!["generativelanguage.googleapis.com", "api.groq.com"].includes(u.hostname)) throw Error("AI host is not allowed");
      const res = await fetch(url, { method: opts.method || "GET", headers: { ...opts.contentType ? { "Content-Type": opts.contentType } : {}, ...opts.headers }, body: opts.payload, signal: AbortSignal.timeout(2e4) });
      const text = await res.text();
      return { getResponseCode: /* @__PURE__ */ __name(() => res.status, "getResponseCode"), getContentText: /* @__PURE__ */ __name(() => text, "getContentText") };
    } }
  };
  function commit() {
    for (const [name, indices] of dirty) {
      sql.exec("INSERT OR IGNORE INTO sheets(name) VALUES(?)", name);
      if (deleted.has(name)) sql.exec("DELETE FROM sheet_rows WHERE sheet=?", name);
      for (const n of indices) sql.exec("INSERT OR REPLACE INTO sheet_rows(sheet,n,data) VALUES(?,?,?)", name, n, encode(load(name)[n - 1] ?? []));
    }
    for (const [k, v] of propWrites) sql.exec("INSERT OR REPLACE INTO props(k,v) VALUES(?,?)", k, v);
    for (const f of files) {
      sql.exec("INSERT INTO files(id,name,mime,size) VALUES(?,?,?,?)", f.id, f.name, f.mime, f.data.length);
      for (let offset = 0, n = 0; offset < f.data.length; offset += 512e3, n++) sql.exec("INSERT INTO file_chunks(id,n,data) VALUES(?,?,?)", f.id, n, new Uint8Array(f.data.subarray(offset, offset + 512e3)));
    }
    dirty.clear();
    deleted.clear();
    propWrites.clear();
    files.length = 0;
  }
  __name(commit, "commit");
  function rollback() {
    for (const n of dirty.keys()) tables.delete(n);
    dirty.clear();
    deleted.clear();
    propWrites.clear();
    files.length = 0;
    cache.clear();
  }
  __name(rollback, "rollback");
  function importSheet(name, rows) {
    if (exists(name)) throw Error("IMPORT_CONFLICT: " + name);
    tables.set(name, clone(rows));
    dirty.set(name, new Set(rows.map((_, i) => i + 1)));
  }
  __name(importSheet, "importSheet");
  return {
    services,
    commit,
    rollback,
    importSheet,
    importFile(id, name, mime, data) {
      const existing = [...sql.exec("SELECT id FROM files WHERE id=?", id)][0];
      if (existing) {
        const current = this.file(id);
        if (current.name === name && current.mime === mime && current.data.equals(data)) return false;
        throw Error("FILE_IMPORT_CONFLICT");
      }
      sql.exec("INSERT INTO files(id,name,mime,size) VALUES(?,?,?,?)", id, name, mime, data.length);
      for (let offset = 0, n = 0; offset < data.length; offset += 512e3, n++) {
        sql.exec("INSERT INTO file_chunks(id,n,data) VALUES(?,?,?)", id, n, new Uint8Array(data.subarray(offset, offset + 512e3)));
      }
      return true;
    },
    spreadsheet,
    cache,
    clear() {
      tables.clear();
      cache.clear();
    },
    listFiles() {
      return [...sql.exec("SELECT id,name,mime,size FROM files ORDER BY id")].map((r) => ({ ...r, size: Number(r.size) || 0 }));
    },
    listProperties() {
      return [...sql.exec("SELECT k,v FROM props ORDER BY k")].map((r) => ({ key: String(r.k), value: r.v == null ? "" : String(r.v) }));
    },
    file(id) {
      const f = [...sql.exec("SELECT * FROM files WHERE id=?", id)][0];
      if (!f) return null;
      const chunks = [...sql.exec("SELECT data FROM file_chunks WHERE id=? ORDER BY n", id)];
      return { ...f, data: Buffer.concat(chunks.map((r) => Buffer.from(r.data))) };
    }
  };
}
__name(createStorage, "createStorage");

// src/backend.mjs
import { pbkdf2Sync as nativePbkdf2 } from "node:crypto";

// src/kpi_department_source.mjs
var KPI_DEPARTMENT_SOURCE_META = { "sourceFile": "04_Kertas_Kerja_Offset_Technical-2026_Dashboard_Rev.003(2).xlsx", "version": "KPI-OFFSET-2026-REV003-2-20260911", "year": 2026, "latestActualMonth": "Jul", "kpiCount": 9, "rawRowCount": 763, "sourceSheets": [{ "sheet": "Dashboard", "dimension": "A1:Q29", "nonEmptyCells": 104, "formulaCells": 37, "errorCells": 0 }, { "sheet": "Kertas Kerja", "dimension": "A2:CA579", "nonEmptyCells": 765, "formulaCells": 323, "errorCells": 0 }, { "sheet": "Kertas Kerja (Simple View)", "dimension": "A1:N16", "nonEmptyCells": 121, "formulaCells": 65, "errorCells": 0 }, { "sheet": "chart_Printing", "dimension": "A1:AM106", "nonEmptyCells": 1029, "formulaCells": 518, "errorCells": 2 }, { "sheet": "visual chart_Printing MTD", "dimension": "B2:P31", "nonEmptyCells": 264, "formulaCells": 160, "errorCells": 160 }, { "sheet": "visual chart_Printing YTD", "dimension": "B2:P31", "nonEmptyCells": 211, "formulaCells": 131, "errorCells": 131 }, { "sheet": "Chart_Conv 01 Autoplaten", "dimension": "A1:BF127", "nonEmptyCells": 1526, "formulaCells": 605, "errorCells": 0 }, { "sheet": "Chart_Conv 02 Folder Gluer", "dimension": "A1:AQ119", "nonEmptyCells": 1476, "formulaCells": 299, "errorCells": 0 }, { "sheet": "Summary Converting '23", "dimension": "A3:AP114", "nonEmptyCells": 2660, "formulaCells": 2213, "errorCells": 2312 }, { "sheet": "Yearly_Printing", "dimension": "A1:Q82", "nonEmptyCells": 613, "formulaCells": 270, "errorCells": 0 }, { "sheet": "Yearly_Conv", "dimension": "A1:AM128", "nonEmptyCells": 1199, "formulaCells": 658, "errorCells": 554 }, { "sheet": "Record YTD", "dimension": "A1:DO49", "nonEmptyCells": 477, "formulaCells": 38, "errorCells": 0 }, { "sheet": "Sheet1", "dimension": "A1", "nonEmptyCells": 0, "formulaCells": 0, "errorCells": 0 }], "formulaErrorCount": 3159, "normalizedSource": "Kertas Kerja rows 11-19 (MTD) and 22-30 (YTD)" };
var KPI_DEPARTMENT_MTD = [{ "Tahun": 2026, "No": 1, "Perspective": "INTERNAL BUSINESS PROCESS", "Data Producer": "Offset - Technical", "Divisi": "Offset", "Department": "Offset Technical", "KPI": "Machine Loss Time - Printing (%)", "Satuan": "%", "Polaritas": "Minimized", "Rumus": "(Losthrs/RunHrs)*100", "Periode Perhitungan": "Bulanan", "Target Tahunan": 5, "Source Sheet": "Kertas Kerja", "Source Row": 11, "Target Jan": 5, "Realisasi Jan": 15.656296882092782, "Target Feb": 5, "Realisasi Feb": 6.318747117483973, "Target Mar": 5, "Realisasi Mar": 4.68920625484085, "Target Apr": 5, "Realisasi Apr": 15.525870963318084, "Target Mei": 5, "Realisasi Mei": 7.62377114441052, "Target Jun": 5, "Realisasi Jun": 10.916110861630836, "Target Jul": 5, "Realisasi Jul": 3.898408072337987, "Target Agust": 5, "Realisasi Agust": null, "Target Sep": 5, "Realisasi Sep": null, "Target Okt": 5, "Realisasi Okt": null, "Target Nop": 5, "Realisasi Nop": null, "Target Des": 5, "Realisasi Des": null }, { "Tahun": 2026, "No": 2, "Perspective": "INTERNAL BUSINESS PROCESS", "Data Producer": "Offset - Technical", "Divisi": "Offset", "Department": "Offset Technical", "KPI": "Machine Loss Time - Converting 01 AP (%)", "Satuan": "%", "Polaritas": "Minimized", "Rumus": "(Losthrs/RunHrs)*100", "Periode Perhitungan": "Bulanan", "Target Tahunan": 2, "Source Sheet": "Kertas Kerja", "Source Row": 12, "Target Jan": 2, "Realisasi Jan": 1.8066575826949087, "Target Feb": 2, "Realisasi Feb": 2.3813616720139623, "Target Mar": 2, "Realisasi Mar": 1.8161812164068791, "Target Apr": 2, "Realisasi Apr": 3.0814213748533916, "Target Mei": 2, "Realisasi Mei": 0.3269207893359613, "Target Jun": 2, "Realisasi Jun": 6.340006045444016, "Target Jul": 2, "Realisasi Jul": 1.566130196892243, "Target Agust": 2, "Realisasi Agust": null, "Target Sep": 2, "Realisasi Sep": null, "Target Okt": 2, "Realisasi Okt": null, "Target Nop": 2, "Realisasi Nop": null, "Target Des": 2, "Realisasi Des": null }, { "Tahun": 2026, "No": 2, "Perspective": "INTERNAL BUSINESS PROCESS", "Data Producer": "Offset - Technical", "Divisi": "Offset", "Department": "Offset Technical", "KPI": "Machine Loss Time - Converting 02 FG (%)", "Satuan": "%", "Polaritas": "Minimized", "Rumus": "(Losthrs/RunHrs)*100", "Periode Perhitungan": "Bulanan", "Target Tahunan": 2, "Source Sheet": "Kertas Kerja", "Source Row": 13, "Target Jan": 2, "Realisasi Jan": 0.6792597099008111, "Target Feb": 2, "Realisasi Feb": 1.144437945283627, "Target Mar": 2, "Realisasi Mar": 1.8953319272490574, "Target Apr": 2, "Realisasi Apr": 0.4243734963635058, "Target Mei": 2, "Realisasi Mei": 0.9817248811441912, "Target Jun": 2, "Realisasi Jun": 6.846396697064941, "Target Jul": 2, "Realisasi Jul": 3.4895837693513223, "Target Agust": 2, "Realisasi Agust": null, "Target Sep": 2, "Realisasi Sep": null, "Target Okt": 2, "Realisasi Okt": null, "Target Nop": 2, "Realisasi Nop": null, "Target Des": 2, "Realisasi Des": null }, { "Tahun": 2026, "No": 5, "Perspective": "INTERNAL BUSINESS PROCESS", "Data Producer": "Offset - Technical", "Divisi": "Offset", "Department": "Offset Technical", "KPI": "MTBF- Printing (Hrs)", "Satuan": "Hours", "Polaritas": "Maximized", "Rumus": "RunHrs/BD Events", "Periode Perhitungan": "Bulanan", "Target Tahunan": 56.19, "Source Sheet": "Kertas Kerja", "Source Row": 14, "Target Jan": 56.19, "Realisasi Jan": 48.198055555555555, "Target Feb": 56.19, "Realisasi Feb": 50.73638888888889, "Target Mar": 56.19, "Realisasi Mar": 107.60577380952381, "Target Apr": 56.19, "Realisasi Apr": 15.016065700483091, "Target Mei": 56.19, "Realisasi Mei": 20.203291902071562, "Target Jun": 56.19, "Realisasi Jun": 40.034122807017546, "Target Jul": 56.19, "Realisasi Jul": 31.946046698872784, "Target Agust": 56.19, "Realisasi Agust": null, "Target Sep": 56.19, "Realisasi Sep": null, "Target Okt": 56.19, "Realisasi Okt": null, "Target Nop": 56.19, "Realisasi Nop": null, "Target Des": 56.19, "Realisasi Des": null }, { "Tahun": 2026, "No": 6, "Perspective": "INTERNAL BUSINESS PROCESS", "Data Producer": "Offset - Technical", "Divisi": "Offset", "Department": "Offset Technical", "KPI": "MTBF - Converting 01 AP (Hrs)", "Satuan": "Hours", "Polaritas": "Maximized", "Rumus": "RunHrs/BD Events", "Periode Perhitungan": "Bulanan", "Target Tahunan": 106, "Source Sheet": "Kertas Kerja", "Source Row": 15, "Target Jan": 106, "Realisasi Jan": 276.516625, "Target Feb": 106, "Realisasi Feb": 339.25444444444446, "Target Mar": 106, "Realisasi Mar": 167.94553703703704, "Target Apr": 106, "Realisasi Apr": 103.89294444444444, "Target Mei": 106, "Realisasi Mei": 336.7804444444444, "Target Jun": 106, "Realisasi Jun": 113.92654320987653, "Target Jul": 106, "Realisasi Jul": 104.92832671957672, "Target Agust": 106, "Realisasi Agust": null, "Target Sep": 106, "Realisasi Sep": null, "Target Okt": 106, "Realisasi Okt": null, "Target Nop": 106, "Realisasi Nop": null, "Target Des": 106, "Realisasi Des": null }, { "Tahun": 2026, "No": 6, "Perspective": "INTERNAL BUSINESS PROCESS", "Data Producer": "Offset - Technical", "Divisi": "Offset", "Department": "Offset Technical", "KPI": "MTBF - Converting 02 FG (Hrs)", "Satuan": "Hours", "Polaritas": "Maximized", "Rumus": "RunHrs/BD Events", "Periode Perhitungan": "Bulanan", "Target Tahunan": 300, "Source Sheet": "Kertas Kerja", "Source Row": 16, "Target Jan": 300, "Realisasi Jan": 197.02779682539682, "Target Feb": 300, "Realisasi Feb": 173.5438761904762, "Target Mar": 300, "Realisasi Mar": 172.59211111111114, "Target Apr": 300, "Realisasi Apr": 202.3872777777778, "Target Mei": 300, "Realisasi Mei": 242.5462976190476, "Target Jun": 300, "Realisasi Jun": 159.26130476190477, "Target Jul": 300, "Realisasi Jul": 92.24725555555555, "Target Agust": 300, "Realisasi Agust": null, "Target Sep": 300, "Realisasi Sep": null, "Target Okt": 300, "Realisasi Okt": null, "Target Nop": 300, "Realisasi Nop": null, "Target Des": 300, "Realisasi Des": null }, { "Tahun": 2026, "No": 7, "Perspective": "INTERNAL BUSINESS PROCESS", "Data Producer": "Offset - Technical", "Divisi": "Offset", "Department": "Offset Technical", "KPI": "MTTR - Printing (Hrs)", "Satuan": "Hours", "Polaritas": "Minimized", "Rumus": "Lost Hrs/BD Events", "Periode Perhitungan": "Bulanan", "Target Tahunan": 0.98, "Source Sheet": "Kertas Kerja", "Source Row": 17, "Target Jan": 0.98, "Realisasi Jan": 7.857090643274857, "Target Feb": 0.98, "Realisasi Feb": 2.7075163398692768, "Target Mar": 0.98, "Realisasi Mar": 2.206845238095238, "Target Apr": 0.98, "Realisasi Apr": 1.8575845410628025, "Target Mei": 0.98, "Realisasi Mei": 1.031591337099813, "Target Jun": 0.98, "Realisasi Jun": 3.168037280701757, "Target Jul": 0.98, "Realisasi Jul": 0.8522544283413849, "Target Agust": 0.98, "Realisasi Agust": null, "Target Sep": 0.98, "Realisasi Sep": null, "Target Okt": 0.98, "Realisasi Okt": null, "Target Nop": 0.98, "Realisasi Nop": null, "Target Des": 0.98, "Realisasi Des": null }, { "Tahun": 2026, "No": 8, "Perspective": "INTERNAL BUSINESS PROCESS", "Data Producer": "Offset - Technical", "Divisi": "Offset", "Department": "Offset Technical", "KPI": "MTTR - Converting 01 AP (Hrs)", "Satuan": "Hours", "Polaritas": "Minimized", "Rumus": "Lost Hrs/BD Events", "Periode Perhitungan": "Bulanan", "Target Tahunan": 0.98, "Source Sheet": "Kertas Kerja", "Source Row": 18, "Target Jan": 0.98, "Realisasi Jan": 1.5339583333333338, "Target Feb": 0.98, "Realisasi Feb": 2.33888888888889, "Target Mar": 0.98, "Realisasi Mar": 2.07314814814815, "Target Apr": 0.98, "Realisasi Apr": 1.9649007936507932, "Target Mei": 0.98, "Realisasi Mei": 0.36166666666666697, "Target Jun": 0.98, "Realisasi Jun": 6.904320987654317, "Target Jul": 0.98, "Realisasi Jul": 0.8961640211640209, "Target Agust": 0.98, "Realisasi Agust": null, "Target Sep": 0.98, "Realisasi Sep": null, "Target Okt": 0.98, "Realisasi Okt": null, "Target Nop": 0.98, "Realisasi Nop": null, "Target Des": 0.98, "Realisasi Des": null }, { "Tahun": 2026, "No": 8, "Perspective": "INTERNAL BUSINESS PROCESS", "Data Producer": "Offset - Technical", "Divisi": "Offset", "Department": "Offset Technical", "KPI": "MTTR - Converting 02 FG (Hrs)", "Satuan": "Hours", "Polaritas": "Minimized", "Rumus": "Lost Hrs/BD Events", "Periode Perhitungan": "Bulanan", "Target Tahunan": 0.98, "Source Sheet": "Kertas Kerja", "Source Row": 19, "Target Jan": 0.98, "Realisasi Jan": 0.46730158730158744, "Target Feb": 0.98, "Realisasi Feb": 0.8209047619047617, "Target Mar": 0.98, "Realisasi Mar": 1.1974444444444434, "Target Apr": 0.98, "Realisasi Apr": 0.5202301587301588, "Target Mei": 0.98, "Realisasi Mei": 0.6093253968253967, "Target Jun": 0.98, "Realisasi Jun": 10.391619047619049, "Target Jul": 0.98, "Realisasi Jul": 2.366222222222224, "Target Agust": 0.98, "Realisasi Agust": null, "Target Sep": 0.98, "Realisasi Sep": null, "Target Okt": 0.98, "Realisasi Okt": null, "Target Nop": 0.98, "Realisasi Nop": null, "Target Des": 0.98, "Realisasi Des": null }];
var KPI_DEPARTMENT_YTD = [{ "Tahun": 2026, "No": 1, "Perspective": "INTERNAL BUSINESS PROCESS", "Data Producer": "Offset - Technical", "Divisi": "Offset", "Department": "Offset Technical", "KPI": "Machine Loss Time - Printing (%)", "Satuan": "%", "Polaritas": "Minimized", "Rumus": "(Losthrs/RunHrs)*100", "Periode Perhitungan": "YTD", "Target Tahunan": 5, "Source Sheet": "Kertas Kerja", "Source Row": 22, "Target Jan": 5, "Realisasi Jan": 15.656296882092782, "Target Feb": 5, "Realisasi Feb": 11.009574678385617, "Target Mar": 5, "Realisasi Mar": 8.957941913971162, "Target Apr": 5, "Realisasi Apr": 10.69799853235145, "Target Mei": 5, "Realisasi Mei": 10.0440198337798, "Target Jun": 5, "Realisasi Jun": 10.181384495000538, "Target Jul": 5, "Realisasi Jul": 9.419773229058473, "Target Agust": 5, "Realisasi Agust": null, "Target Sep": 5, "Realisasi Sep": null, "Target Okt": 5, "Realisasi Okt": null, "Target Nop": 5, "Realisasi Nop": null, "Target Des": 5, "Realisasi Des": null }, { "Tahun": 2026, "No": 2, "Perspective": "INTERNAL BUSINESS PROCESS", "Data Producer": "Offset - Technical", "Divisi": "Offset", "Department": "Offset Technical", "KPI": "Machine Loss Time - Converting 01 AP (%)", "Satuan": "%", "Polaritas": "Minimized", "Rumus": "(Losthrs/RunHrs)*100", "Periode Perhitungan": "YTD", "Target Tahunan": 2, "Source Sheet": "Kertas Kerja", "Source Row": 23, "Target Jan": 2, "Realisasi Jan": 1.8066575826949087, "Target Feb": 2, "Realisasi Feb": 2.189124738528858, "Target Mar": 2, "Realisasi Mar": 2.027823155545782, "Target Apr": 2, "Realisasi Apr": 2.336493422781958, "Target Mei": 2, "Realisasi Mei": 1.902142010372774, "Target Jun": 2, "Realisasi Jun": 2.722265297883894, "Target Jul": 2, "Realisasi Jul": 2.553848761980074, "Target Agust": 2, "Realisasi Agust": null, "Target Sep": 2, "Realisasi Sep": null, "Target Okt": 2, "Realisasi Okt": null, "Target Nop": 2, "Realisasi Nop": null, "Target Des": 2, "Realisasi Des": null }, { "Tahun": 2026, "No": 3, "Perspective": "INTERNAL BUSINESS PROCESS", "Data Producer": "Offset - Technical", "Divisi": "Offset", "Department": "Offset Technical", "KPI": "Machine Loss Time - Converting 02 FG (%)", "Satuan": "%", "Polaritas": "Minimized", "Rumus": "(Losthrs/RunHrs)*100", "Periode Perhitungan": "YTD", "Target Tahunan": 2, "Source Sheet": "Kertas Kerja", "Source Row": 24, "Target Jan": 2, "Realisasi Jan": 0.6792597099008111, "Target Feb": 2, "Realisasi Feb": 1.6878457132042761, "Target Mar": 2, "Realisasi Mar": 3.583177640453333, "Target Apr": 2, "Realisasi Apr": 4.007551136816838, "Target Mei": 2, "Realisasi Mei": 4.98927601796103, "Target Jun": 2, "Realisasi Jun": 12.817397596170162, "Target Jul": 2, "Realisasi Jul": 16.306981365521484, "Target Agust": 2, "Realisasi Agust": null, "Target Sep": 2, "Realisasi Sep": null, "Target Okt": 2, "Realisasi Okt": null, "Target Nop": 2, "Realisasi Nop": null, "Target Des": 2, "Realisasi Des": null }, { "Tahun": 2026, "No": 4, "Perspective": "INTERNAL BUSINESS PROCESS", "Data Producer": "Offset - Technical", "Divisi": "Offset", "Department": "Offset Technical", "KPI": "MTBF- Printing (Hrs)", "Satuan": "Hours", "Polaritas": "Maximized", "Rumus": "RunHrs/BD Events", "Periode Perhitungan": "YTD", "Target Tahunan": 56.19, "Source Sheet": "Kertas Kerja", "Source Row": 25, "Target Jan": 56.19, "Realisasi Jan": 48.198055555555555, "Target Feb": 56.19, "Realisasi Feb": 47.85944949494949, "Target Mar": 56.19, "Realisasi Mar": 56.00294033275961, "Target Apr": 56.19, "Realisasi Apr": 31.31792650245182, "Target Mei": 56.19, "Realisasi Mei": 28.144180550632164, "Target Jun": 56.19, "Realisasi Jun": 29.751215686274513, "Target Jul": 56.19, "Realisasi Jul": 30.011468390504987, "Target Agust": 56.19, "Realisasi Agust": null, "Target Sep": 56.19, "Realisasi Sep": null, "Target Okt": 56.19, "Realisasi Okt": null, "Target Nop": 56.19, "Realisasi Nop": null, "Target Des": 56.19, "Realisasi Des": null }, { "Tahun": 2026, "No": 5, "Perspective": "INTERNAL BUSINESS PROCESS", "Data Producer": "Offset - Technical", "Divisi": "Offset", "Department": "Offset Technical", "KPI": "MTBF - Converting 01 AP (Hrs)", "Satuan": "Hours", "Polaritas": "Maximized", "Rumus": "RunHrs/BD Events", "Periode Perhitungan": "YTD", "Target Tahunan": 106, "Source Sheet": "Kertas Kerja", "Source Row": 26, "Target Jan": 106, "Realisasi Jan": 276.516625, "Target Feb": 106, "Realisasi Feb": 236.0214036426536, "Target Mar": 106, "Realisasi Mar": 162.98783957600133, "Target Apr": 106, "Realisasi Apr": 126.36345240034757, "Target Mei": 106, "Realisasi Mei": 149.2293256915187, "Target Jun": 106, "Realisasi Jun": 134.38934022751127, "Target Jul": 106, "Realisasi Jul": 127.39458093477491, "Target Agust": 106, "Realisasi Agust": null, "Target Sep": 106, "Realisasi Sep": null, "Target Okt": 106, "Realisasi Okt": null, "Target Nop": 106, "Realisasi Nop": null, "Target Des": 106, "Realisasi Des": null }, { "Tahun": 2026, "No": 6, "Perspective": "INTERNAL BUSINESS PROCESS", "Data Producer": "Offset - Technical", "Divisi": "Offset", "Department": "Offset Technical", "KPI": "MTBF - Converting 02 FG (Hrs)", "Satuan": "Hours", "Polaritas": "Maximized", "Rumus": "RunHrs/BD Events", "Periode Perhitungan": "YTD", "Target Tahunan": 300, "Source Sheet": "Kertas Kerja", "Source Row": 27, "Target Jan": 300, "Realisasi Jan": 197.02779682539682, "Target Feb": 300, "Realisasi Feb": 370.571673015873, "Target Mar": 300, "Realisasi Mar": 543.1637841269842, "Target Apr": 300, "Realisasi Apr": 745.551061904762, "Target Mei": 300, "Realisasi Mei": 988.0973595238096, "Target Jun": 300, "Realisasi Jun": 1389.904961904762, "Target Jul": 300, "Realisasi Jul": 1482.1522174603174, "Target Agust": 300, "Realisasi Agust": null, "Target Sep": 300, "Realisasi Sep": null, "Target Okt": 300, "Realisasi Okt": null, "Target Nop": 300, "Realisasi Nop": null, "Target Des": 300, "Realisasi Des": null }, { "Tahun": 2026, "No": 7, "Perspective": "INTERNAL BUSINESS PROCESS", "Data Producer": "Offset - Technical", "Divisi": "Offset", "Department": "Offset Technical", "KPI": "MTTR - Printing (Hrs)", "Satuan": "Hours", "Polaritas": "Minimized", "Rumus": "Lost Hrs/BD Events", "Periode Perhitungan": "YTD", "Target Tahunan": 0.98, "Source Sheet": "Kertas Kerja", "Source Row": 28, "Target Jan": 0.98, "Realisasi Jan": 7.857090643274857, "Target Feb": 0.98, "Realisasi Feb": 5.183585858585858, "Target Mar": 0.98, "Realisasi Mar": 4.708835341365462, "Target Apr": 0.98, "Realisasi Apr": 2.953815999543848, "Target Mei": 0.98, "Realisasi Mei": 2.4022096183386514, "Target Jun": 0.98, "Realisasi Jun": 2.5096323529411775, "Target Jul": 0.98, "Realisasi Jul": 2.3077151322420333, "Target Agust": 0.98, "Realisasi Agust": null, "Target Sep": 0.98, "Realisasi Sep": null, "Target Okt": 0.98, "Realisasi Okt": null, "Target Nop": 0.98, "Realisasi Nop": null, "Target Des": 0.98, "Realisasi Des": null }, { "Tahun": 2026, "No": 8, "Perspective": "INTERNAL BUSINESS PROCESS", "Data Producer": "Offset - Technical", "Divisi": "Offset", "Department": "Offset Technical", "KPI": "MTTR - Converting 01 AP (Hrs)", "Satuan": "Hours", "Polaritas": "Minimized", "Rumus": "Lost Hrs/BD Events", "Periode Perhitungan": "YTD", "Target Tahunan": 0.98, "Source Sheet": "Kertas Kerja", "Source Row": 29, "Target Jan": 0.98, "Realisasi Jan": 1.5339583333333338, "Target Feb": 0.98, "Realisasi Feb": 2.359784289784291, "Target Mar": 0.98, "Realisasi Mar": 2.287753770739066, "Target Apr": 0.98, "Realisasi Apr": 2.152927120669057, "Target Mei": 0.98, "Realisasi Mei": 1.9943782706966546, "Target Jun": 0.98, "Realisasi Jun": 2.9658542322687054, "Target Jul": 0.98, "Realisasi Jul": 2.5852966985402324, "Target Agust": 0.98, "Realisasi Agust": null, "Target Sep": 0.98, "Realisasi Sep": null, "Target Okt": 0.98, "Realisasi Okt": null, "Target Nop": 0.98, "Realisasi Nop": null, "Target Des": 0.98, "Realisasi Des": null }, { "Tahun": 2026, "No": 9, "Perspective": "INTERNAL BUSINESS PROCESS", "Data Producer": "Offset - Technical", "Divisi": "Offset", "Department": "Offset Technical", "KPI": "MTTR - Converting 02 FG (Hrs)", "Satuan": "Hours", "Polaritas": "Minimized", "Rumus": "Lost Hrs/BD Events", "Periode Perhitungan": "YTD", "Target Tahunan": 0.98, "Source Sheet": "Kertas Kerja", "Source Row": 30, "Target Jan": 0.98, "Realisasi Jan": 0.46730158730158744, "Target Feb": 0.98, "Realisasi Feb": 1.2882063492063491, "Target Mar": 0.98, "Realisasi Mar": 2.485650793650793, "Target Apr": 0.98, "Realisasi Apr": 3.0058809523809513, "Target Mei": 0.98, "Realisasi Mei": 3.6152063492063484, "Target Jun": 0.98, "Realisasi Jun": 14.616150793650794, "Target Jul": 0.98, "Realisasi Jul": 16.982373015873016, "Target Agust": 0.98, "Realisasi Agust": null, "Target Sep": 0.98, "Realisasi Sep": null, "Target Okt": 0.98, "Realisasi Okt": null, "Target Nop": 0.98, "Realisasi Nop": null, "Target Des": 0.98, "Realisasi Des": null }];
var KPI_DEPARTMENT_RAW_ROWS = [{ "Sheet": "Dashboard", "Row": 1, "DataJSON": '{"P":"MonthLookup"}', "FormulaJSON": "{}" }, { "Sheet": "Dashboard", "Row": 2, "DataJSON": '{"B":"OFFSET - TECHNICAL PERFORMANCE DASHBOARD","P":"Jan","Q":12}', "FormulaJSON": "{}" }, { "Sheet": "Dashboard", "Row": 3, "DataJSON": '{"P":"Feb","Q":14}', "FormulaJSON": "{}" }, { "Sheet": "Dashboard", "Row": 4, "DataJSON": '{"P":"Mar","Q":16}', "FormulaJSON": "{}" }, { "Sheet": "Dashboard", "Row": 5, "DataJSON": `{"B":"PILIH BULAN","D":"PILIH TAHUN","F":"Kartu KPI di bawah otomatis mengambil data TARGET & REALISASI bulan/tahun terpilih dari sheet 'Kertas Kerja' (sumber data asli, tidak diubah).","P":"Apr","Q":18}`, "FormulaJSON": "{}" }, { "Sheet": "Dashboard", "Row": 6, "DataJSON": '{"B":"Jul","D":2026,"F":"Periode ditampilkan: Jul 2026","P":"Mei","Q":20}', "FormulaJSON": '{"F":"CONCATENATE(\\"Periode ditampilkan: \\",$B$6,\\" \\",$D$6)"}' }, { "Sheet": "Dashboard", "Row": 7, "DataJSON": '{"P":"Jun","Q":22}', "FormulaJSON": "{}" }, { "Sheet": "Dashboard", "Row": 8, "DataJSON": '{"B":"Machine Loss Time - Printing (%)","F":"Machine Loss Time - Converting 01 AP (%)","J":"Machine Loss Time - Converting 02 FG (%)","P":"Jul","Q":24}', "FormulaJSON": "{}" }, { "Sheet": "Dashboard", "Row": 9, "DataJSON": '{"B":"Divisi: Offset   |   Satuan: %   |   Minimized","F":"Divisi: Offset   |   Satuan: %   |   Minimized","J":"Divisi: Offset   |   Satuan: %   |   Minimized","P":"Agust","Q":26}', "FormulaJSON": "{}" }, { "Sheet": "Dashboard", "Row": 10, "DataJSON": '{"B":"TARGET","C":"REALISASI","F":"TARGET","G":"REALISASI","J":"TARGET","K":"REALISASI","P":"Sep","Q":28}', "FormulaJSON": "{}" }, { "Sheet": "Dashboard", "Row": 11, "DataJSON": '{"B":5,"C":3.898408072337987,"F":2,"G":1.566130196892243,"J":2,"K":3.4895837693513223,"P":"Okt","Q":30}', "FormulaJSON": `{"B":"INDEX('Kertas Kerja'!$A$11:$AI$19,1,VLOOKUP($B$6,$P$2:$Q$13,2,0))","C":"INDEX('Kertas Kerja'!$A$11:$AI$19,1,VLOOKUP($B$6,$P$2:$Q$13,2,0)+1)","F":"INDEX('Kertas Kerja'!$A$11:$AI$19,2,VLOOKUP($B$6,$P$2:$Q$13,2,0))","G":"INDEX('Kertas Kerja'!$A$11:$AI$19,2,VLOOKUP($B$6,$P$2:$Q$13,2,0)+1)","J":"INDEX('Kertas Kerja'!$A$11:$AI$19,3,VLOOKUP($B$6,$P$2:$Q$13,2,0))","K":"INDEX('Kertas Kerja'!$A$11:$AI$19,3,VLOOKUP($B$6,$P$2:$Q$13,2,0)+1)"}` }, { "Sheet": "Dashboard", "Row": 12, "DataJSON": '{"B":1.2825748118773406,"F":1.2770330359306705,"J":0.5731342567459784,"P":"Nop","Q":32}', "FormulaJSON": `{"B":"IFERROR(IF('Kertas Kerja'!$H$11=\\"Minimized\\",IF(C11=0,0,B11/C11),IF(B11=0,0,C11/B11)),0)","F":"IFERROR(IF('Kertas Kerja'!$H$12=\\"Minimized\\",IF(G11=0,0,F11/G11),IF(F11=0,0,G11/F11)),0)","J":"IFERROR(IF('Kertas Kerja'!$H$13=\\"Minimized\\",IF(K11=0,0,J11/K11),IF(J11=0,0,K11/J11)),0)"}` }, { "Sheet": "Dashboard", "Row": 13, "DataJSON": '{"B":"\u2713 TERCAPAI","F":"\u2713 TERCAPAI","J":"\u26A0 BELUM TERCAPAI","P":"Des","Q":34}', "FormulaJSON": '{"B":"IF(B12>=1,\\"\u2713 TERCAPAI\\",\\"\u26A0 BELUM TERCAPAI\\")","F":"IF(F12>=1,\\"\u2713 TERCAPAI\\",\\"\u26A0 BELUM TERCAPAI\\")","J":"IF(J12>=1,\\"\u2713 TERCAPAI\\",\\"\u26A0 BELUM TERCAPAI\\")"}' }, { "Sheet": "Dashboard", "Row": 16, "DataJSON": '{"B":"MTBF- Printing (Hrs)","F":"MTBF - Converting 01 AP (Hrs)","J":"MTBF - Converting 02 FG (Hrs)"}', "FormulaJSON": "{}" }, { "Sheet": "Dashboard", "Row": 17, "DataJSON": '{"B":"Divisi: Offset   |   Satuan: Hours   |   Maximized","F":"Divisi: Offset   |   Satuan: Hours   |   Maximized","J":"Divisi: Offset   |   Satuan: Hours   |   Maximized"}', "FormulaJSON": "{}" }, { "Sheet": "Dashboard", "Row": 18, "DataJSON": '{"B":"TARGET","C":"REALISASI","F":"TARGET","G":"REALISASI","J":"TARGET","K":"REALISASI"}', "FormulaJSON": "{}" }, { "Sheet": "Dashboard", "Row": 19, "DataJSON": '{"B":56.19,"C":31.946046698872784,"F":106,"G":104.92832671957672,"J":300,"K":92.24725555555555}', "FormulaJSON": `{"B":"INDEX('Kertas Kerja'!$A$11:$AI$19,4,VLOOKUP($B$6,$P$2:$Q$13,2,0))","C":"INDEX('Kertas Kerja'!$A$11:$AI$19,4,VLOOKUP($B$6,$P$2:$Q$13,2,0)+1)","F":"INDEX('Kertas Kerja'!$A$11:$AI$19,5,VLOOKUP($B$6,$P$2:$Q$13,2,0))","G":"INDEX('Kertas Kerja'!$A$11:$AI$19,5,VLOOKUP($B$6,$P$2:$Q$13,2,0)+1)","J":"INDEX('Kertas Kerja'!$A$11:$AI$19,6,VLOOKUP($B$6,$P$2:$Q$13,2,0))","K":"INDEX('Kertas Kerja'!$A$11:$AI$19,6,VLOOKUP($B$6,$P$2:$Q$13,2,0)+1)"}` }, { "Sheet": "Dashboard", "Row": 20, "DataJSON": '{"B":0.5685361576592416,"F":0.9898898747129878,"J":0.3074908518518518}', "FormulaJSON": `{"B":"IFERROR(IF('Kertas Kerja'!$H$14=\\"Minimized\\",IF(C19=0,0,B19/C19),IF(B19=0,0,C19/B19)),0)","F":"IFERROR(IF('Kertas Kerja'!$H$15=\\"Minimized\\",IF(G19=0,0,F19/G19),IF(F19=0,0,G19/F19)),0)","J":"IFERROR(IF('Kertas Kerja'!$H$16=\\"Minimized\\",IF(K19=0,0,J19/K19),IF(J19=0,0,K19/J19)),0)"}` }, { "Sheet": "Dashboard", "Row": 21, "DataJSON": '{"B":"\u26A0 BELUM TERCAPAI","F":"\u26A0 BELUM TERCAPAI","J":"\u26A0 BELUM TERCAPAI"}', "FormulaJSON": '{"B":"IF(B20>=1,\\"\u2713 TERCAPAI\\",\\"\u26A0 BELUM TERCAPAI\\")","F":"IF(F20>=1,\\"\u2713 TERCAPAI\\",\\"\u26A0 BELUM TERCAPAI\\")","J":"IF(J20>=1,\\"\u2713 TERCAPAI\\",\\"\u26A0 BELUM TERCAPAI\\")"}' }, { "Sheet": "Dashboard", "Row": 24, "DataJSON": '{"B":"MTTR - Printing (Hrs)","F":"MTTR - Converting 01 AP (Hrs)","J":"MTTR - Converting 02 FG (Hrs)"}', "FormulaJSON": "{}" }, { "Sheet": "Dashboard", "Row": 25, "DataJSON": '{"B":"Divisi: Offset   |   Satuan: Hours   |   Minimized","F":"Divisi: Offset   |   Satuan: Hours   |   Minimized","J":"Divisi: Offset   |   Satuan: Hours   |   Minimized"}', "FormulaJSON": "{}" }, { "Sheet": "Dashboard", "Row": 26, "DataJSON": '{"B":"TARGET","C":"REALISASI","F":"TARGET","G":"REALISASI","J":"TARGET","K":"REALISASI"}', "FormulaJSON": "{}" }, { "Sheet": "Dashboard", "Row": 27, "DataJSON": '{"B":0.98,"C":0.8522544283413849,"F":0.98,"G":0.8961640211640209,"J":0.98,"K":2.366222222222224}', "FormulaJSON": `{"B":"INDEX('Kertas Kerja'!$A$11:$AI$19,7,VLOOKUP($B$6,$P$2:$Q$13,2,0))","C":"INDEX('Kertas Kerja'!$A$11:$AI$19,7,VLOOKUP($B$6,$P$2:$Q$13,2,0)+1)","F":"INDEX('Kertas Kerja'!$A$11:$AI$19,8,VLOOKUP($B$6,$P$2:$Q$13,2,0))","G":"INDEX('Kertas Kerja'!$A$11:$AI$19,8,VLOOKUP($B$6,$P$2:$Q$13,2,0)+1)","J":"INDEX('Kertas Kerja'!$A$11:$AI$19,9,VLOOKUP($B$6,$P$2:$Q$13,2,0))","K":"INDEX('Kertas Kerja'!$A$11:$AI$19,9,VLOOKUP($B$6,$P$2:$Q$13,2,0)+1)"}` }, { "Sheet": "Dashboard", "Row": 28, "DataJSON": '{"B":1.149891355692017,"F":1.0935498154981553,"J":0.41416228399699445}', "FormulaJSON": `{"B":"IFERROR(IF('Kertas Kerja'!$H$17=\\"Minimized\\",IF(C27=0,0,B27/C27),IF(B27=0,0,C27/B27)),0)","F":"IFERROR(IF('Kertas Kerja'!$H$18=\\"Minimized\\",IF(G27=0,0,F27/G27),IF(F27=0,0,G27/F27)),0)","J":"IFERROR(IF('Kertas Kerja'!$H$19=\\"Minimized\\",IF(K27=0,0,J27/K27),IF(J27=0,0,K27/J27)),0)"}` }, { "Sheet": "Dashboard", "Row": 29, "DataJSON": '{"B":"\u2713 TERCAPAI","F":"\u2713 TERCAPAI","J":"\u26A0 BELUM TERCAPAI"}', "FormulaJSON": '{"B":"IF(B28>=1,\\"\u2713 TERCAPAI\\",\\"\u26A0 BELUM TERCAPAI\\")","F":"IF(F28>=1,\\"\u2713 TERCAPAI\\",\\"\u26A0 BELUM TERCAPAI\\")","J":"IF(J28>=1,\\"\u2713 TERCAPAI\\",\\"\u26A0 BELUM TERCAPAI\\")"}' }, { "Sheet": "Kertas Kerja", "Row": 2, "DataJSON": '{"B":"Petunjuk Pengisian:","D":"- Periksalah terlebih dahulu KPI pada kolom 5, yang mana Anda sebagai data producer (penyedia data)","L":341.5,"M":218,"N":509,"O":1068.5,"S":31.3215,"T":1.042,"BA":11.48125,"BB":0.424,"BC":1,"BD":0.79,"BE":0.69,"BF":1.09,"BG":1.19,"BH":0.81,"BI":1.11032222222222,"BJ":1.22,"BK":1.57,"BL":1.6}', "FormulaJSON": '{"O":"SUM(L2:N2)"}' }, { "Sheet": "Kertas Kerja", "Row": 3, "DataJSON": '{"D":"- Jika terdapat KPI yang tidak sesuai dengan data producer, maka tandai baris KPI dengan fill warna merah"}', "FormulaJSON": "{}" }, { "Sheet": "Kertas Kerja", "Row": 4, "DataJSON": '{"A":"Year","B":2023,"D":"- Jika terdapat penambahan KPI maka dapat ditambahkan pada baris bawah yang kosong"}', "FormulaJSON": "{}" }, { "Sheet": "Kertas Kerja", "Row": 5, "DataJSON": '{"D":"- Isi kolom 14 - Realisasi Feb 2020"}', "FormulaJSON": "{}" }, { "Sheet": "Kertas Kerja", "Row": 6, "DataJSON": '{"F":1,"G":2,"H":3,"I":4,"J":5,"K":6,"L":7,"M":8}', "FormulaJSON": "{}" }, { "Sheet": "Kertas Kerja", "Row": 7, "DataJSON": '{"B":"NO","C":"PERSPEKTIVE","D":"DATA PRODUCER","E":"DIVISI","F":"KEY PERFORMANCE INDICATOR","G":"SATUAN","H":"POLARITAS","I":"RUMUS","J":"PERIODE PERHITUNGAN","K":2026}', "FormulaJSON": "{}" }, { "Sheet": "Kertas Kerja", "Row": 8, "DataJSON": '{"K":"TARGET","L":"Jan","N":"Feb","P":"Mar","R":"Apr","T":"Mei","V":"Jun","X":"Jul","Z":"Agust","AB":"Sep","AD":"Okt","AF":"Nop","AH":"Des"}', "FormulaJSON": "{}" }, { "Sheet": "Kertas Kerja", "Row": 9, "DataJSON": '{"L":"TARGET","M":"REALISASI","N":"TARGET","O":"REALISASI","P":"TARGET","Q":"REALISASI","R":"TARGET","S":"REALISASI","T":"TARGET","U":"REALISASI","V":"TARGET","W":"REALISASI","X":"TARGET","Y":"REALISASI","Z":"TARGET","AA":"REALISASI","AB":"TARGET","AC":"REALISASI","AD":"TARGET","AE":"REALISASI","AF":"TARGET","AG":"REALISASI","AH":"TARGET","AI":"REALISASI"}', "FormulaJSON": "{}" }, { "Sheet": "Kertas Kerja", "Row": 10, "DataJSON": '{"B":1,"C":2,"D":3,"E":4,"F":5,"G":6,"H":7,"I":8,"J":9,"K":10,"L":11,"M":12,"N":13,"O":14,"P":15,"Q":16,"R":17,"S":18,"T":19,"U":20,"V":21,"W":22,"X":23,"Y":24,"Z":25,"AA":26,"AB":27,"AC":28,"AD":29,"AE":30,"AF":31,"AG":32,"AH":33,"AI":34}', "FormulaJSON": "{}" }, { "Sheet": "Kertas Kerja", "Row": 11, "DataJSON": '{"B":1,"C":"INTERNAL BUSINESS PROCESS","D":"Offset - Technical","E":"Offset","F":"Machine Loss Time - Printing (%)","G":"%","H":"Minimized","I":"(Losthrs/RunHrs)*100","J":"Bulanan","K":5,"L":5,"M":15.656296882092782,"N":5,"O":6.318747117483973,"P":5,"Q":4.68920625484085,"R":5,"S":15.525870963318084,"T":5,"U":7.62377114441052,"V":5,"W":10.916110861630836,"X":5,"Y":3.898408072337987,"Z":5,"AB":5,"AD":5,"AF":5,"AH":5}', "FormulaJSON": '{"M":"chart_Printing!AD10","O":"chart_Printing!J25","Q":"chart_Printing!J40","S":"chart_Printing!J55","U":"chart_Printing!J70","W":"chart_Printing!J85","Y":"chart_Printing!J100"}' }, { "Sheet": "Kertas Kerja", "Row": 12, "DataJSON": '{"B":2,"C":"INTERNAL BUSINESS PROCESS","D":"Offset - Technical","E":"Offset","F":"Machine Loss Time - Converting 01 AP (%)","G":"%","H":"Minimized","I":"(Losthrs/RunHrs)*100","J":"Bulanan","K":2,"L":2,"M":1.8066575826949087,"N":2,"O":2.3813616720139623,"P":2,"Q":1.8161812164068791,"R":2,"S":3.0814213748533916,"T":2,"U":0.3269207893359613,"V":2,"W":6.340006045444016,"X":2,"Y":1.566130196892243,"Z":2,"AB":2,"AD":2,"AF":2,"AH":2}', "FormulaJSON": `{"M":"'Chart_Conv 01 Autoplaten'!W15","O":"'Chart_Conv 01 Autoplaten'!W33","Q":"'Chart_Conv 01 Autoplaten'!W51","S":"'Chart_Conv 01 Autoplaten'!W69","U":"'Chart_Conv 01 Autoplaten'!W87","V":"T12","W":"'Chart_Conv 01 Autoplaten'!W105","X":"V12","Y":"'Chart_Conv 01 Autoplaten'!W123"}` }, { "Sheet": "Kertas Kerja", "Row": 13, "DataJSON": '{"B":2,"C":"INTERNAL BUSINESS PROCESS","D":"Offset - Technical","E":"Offset","F":"Machine Loss Time - Converting 02 FG (%)","G":"%","H":"Minimized","I":"(Losthrs/RunHrs)*100","J":"Bulanan","K":2,"L":2,"M":0.6792597099008111,"N":2,"O":1.144437945283627,"P":2,"Q":1.8953319272490574,"R":2,"S":0.4243734963635058,"T":2,"U":0.9817248811441912,"V":2,"W":6.846396697064941,"X":2,"Y":3.4895837693513223,"Z":2,"AB":2,"AD":2,"AF":2,"AH":2}', "FormulaJSON": `{"M":"'Chart_Conv 02 Folder Gluer'!L11","O":"'Chart_Conv 02 Folder Gluer'!L26","Q":"'Chart_Conv 02 Folder Gluer'!L41","S":"'Chart_Conv 02 Folder Gluer'!L56","U":"'Chart_Conv 02 Folder Gluer'!L71","W":"'Chart_Conv 02 Folder Gluer'!L101","Y":"'Chart_Conv 02 Folder Gluer'!L116"}` }, { "Sheet": "Kertas Kerja", "Row": 14, "DataJSON": '{"B":5,"C":"INTERNAL BUSINESS PROCESS","D":"Offset - Technical","E":"Offset","F":"MTBF- Printing (Hrs)","G":"Hours","H":"Maximized","I":"RunHrs/BD Events","J":"Bulanan","K":56.19,"L":56.19,"M":48.198055555555555,"N":56.19,"O":50.73638888888889,"P":56.19,"Q":107.60577380952381,"R":56.19,"S":15.016065700483091,"T":56.19,"U":20.203291902071562,"V":56.19,"W":40.034122807017546,"X":56.19,"Y":31.946046698872784,"Z":56.19,"AB":56.19,"AD":56.19,"AF":56.19,"AH":56.19,"AK":" "}', "FormulaJSON": '{"M":"chart_Printing!AI10","O":"chart_Printing!O25","Q":"chart_Printing!O40","S":"chart_Printing!O55","U":"chart_Printing!O70","W":"chart_Printing!O85","Y":"chart_Printing!O100","Z":"X14","AB":"X14","AD":"AB14","AF":"AD14","AH":"AF14"}' }, { "Sheet": "Kertas Kerja", "Row": 15, "DataJSON": '{"B":6,"C":"INTERNAL BUSINESS PROCESS","D":"Offset - Technical","E":"Offset","F":"MTBF - Converting 01 AP (Hrs)","G":"Hours","H":"Maximized","I":"RunHrs/BD Events","J":"Bulanan","K":106,"L":106,"M":276.516625,"N":106,"O":339.25444444444446,"P":106,"Q":167.94553703703704,"R":106,"S":103.89294444444444,"T":106,"U":336.7804444444444,"V":106,"W":113.92654320987653,"X":106,"Y":104.92832671957672,"Z":106,"AB":106,"AD":106,"AF":106,"AH":106}', "FormulaJSON": `{"M":"'Chart_Conv 01 Autoplaten'!AB15","N":"L15","O":"'Chart_Conv 01 Autoplaten'!AB33","P":"N15","Q":"'Chart_Conv 01 Autoplaten'!AB51","R":"P15","S":"'Chart_Conv 01 Autoplaten'!AB69","T":"R15","U":"'Chart_Conv 01 Autoplaten'!AB87","W":"'Chart_Conv 01 Autoplaten'!AB105","Y":"'Chart_Conv 01 Autoplaten'!AB123"}` }, { "Sheet": "Kertas Kerja", "Row": 16, "DataJSON": '{"B":6,"C":"INTERNAL BUSINESS PROCESS","D":"Offset - Technical","E":"Offset","F":"MTBF - Converting 02 FG (Hrs)","G":"Hours","H":"Maximized","I":"RunHrs/BD Events","J":"Bulanan","K":300,"L":300,"M":197.02779682539682,"N":300,"O":173.5438761904762,"P":300,"Q":172.59211111111114,"R":300,"S":202.3872777777778,"T":300,"U":242.5462976190476,"V":300,"W":159.26130476190477,"X":300,"Y":92.24725555555555,"Z":300,"AB":300,"AD":300,"AF":300,"AH":300}', "FormulaJSON": `{"M":"'Chart_Conv 02 Folder Gluer'!Q11","N":"L16","O":"'Chart_Conv 02 Folder Gluer'!Q26","P":"N16","Q":"'Chart_Conv 02 Folder Gluer'!Q41","R":"P16","S":"'Chart_Conv 02 Folder Gluer'!Q56","T":"R16","U":"'Chart_Conv 02 Folder Gluer'!Q71","W":"'Chart_Conv 02 Folder Gluer'!Q101","Y":"'Chart_Conv 02 Folder Gluer'!Q116"}` }, { "Sheet": "Kertas Kerja", "Row": 17, "DataJSON": '{"B":7,"C":"INTERNAL BUSINESS PROCESS","D":"Offset - Technical","E":"Offset","F":"MTTR - Printing (Hrs)","G":"Hours","H":"Minimized","I":"Lost Hrs/BD Events","J":"Bulanan","K":0.98,"L":0.98,"M":7.857090643274857,"N":0.98,"O":2.7075163398692768,"P":0.98,"Q":2.206845238095238,"R":0.98,"S":1.8575845410628025,"T":0.98,"U":1.031591337099813,"V":0.98,"W":3.168037280701757,"X":0.98,"Y":0.8522544283413849,"Z":0.98,"AB":0.98,"AD":0.98,"AF":0.98,"AH":0.98,"BA":"JAN","BB":"FEB","BC":"MAR","BD":"APR","BE":"MAY","BF":"JUN","BG":"JUL","BH":"AUG","BI":"SEP","BJ":"OCT","BK":"NOV","BL":"DEC"}', "FormulaJSON": '{"M":"chart_Printing!AJ10","O":"chart_Printing!P25","Q":"chart_Printing!P40","S":"chart_Printing!P55","U":"chart_Printing!P70","W":"chart_Printing!P85","Y":"chart_Printing!P100"}' }, { "Sheet": "Kertas Kerja", "Row": 18, "DataJSON": '{"B":8,"C":"INTERNAL BUSINESS PROCESS","D":"Offset - Technical","E":"Offset","F":"MTTR - Converting 01 AP (Hrs)","G":"Hours","H":"Minimized","I":"Lost Hrs/BD Events","J":"Bulanan","K":0.98,"L":0.98,"M":1.5339583333333338,"N":0.98,"O":2.33888888888889,"P":0.98,"Q":2.07314814814815,"R":0.98,"S":1.9649007936507932,"T":0.98,"U":0.36166666666666697,"V":0.98,"W":6.904320987654317,"X":0.98,"Y":0.8961640211640209,"Z":0.98,"AB":0.98,"AD":0.98,"AF":0.98,"AH":0.98,"AM":0.6792597099008111,"AN":1.144437945283627,"AO":1.8953319272490574,"AP":0.4243734963635058,"AQ":0.9817248811441912,"AR":6.846396697064941,"AS":3.4895837693513223,"AT":0,"AU":0,"AV":0,"AW":0,"AX":0,"BA":197.02779682539682,"BB":173.5438761904762,"BC":172.59211111111114,"BD":202.3872777777778,"BE":242.5462976190476,"BF":159.26130476190477,"BG":92.24725555555555,"BH":0,"BI":0,"BJ":0,"BK":0,"BL":0}', "FormulaJSON": `{"M":"'Chart_Conv 01 Autoplaten'!AC15","N":"L18","O":"'Chart_Conv 01 Autoplaten'!AC33","P":"N18","Q":"'Chart_Conv 01 Autoplaten'!AC51","R":"P18","S":"'Chart_Conv 01 Autoplaten'!AC69","T":"R18","U":"'Chart_Conv 01 Autoplaten'!AC87","W":"'Chart_Conv 01 Autoplaten'!AC105","Y":"'Chart_Conv 01 Autoplaten'!AC123","AM":"M13","AN":"O13","AO":"Q13","AP":"S13","AQ":"U13","AR":"W13","AS":"Y13","AT":"AA13","AU":"AC13","AV":"AE13","AW":"AG13","AX":"AI13","BA":"M16","BB":"O16","BC":"Q16","BD":"S16","BE":"U16","BF":"W16","BG":"Y16","BH":"AA16","BI":"AC16","BJ":"AE16","BK":"AG16","BL":"AI16"}` }, { "Sheet": "Kertas Kerja", "Row": 19, "DataJSON": '{"B":8,"C":"INTERNAL BUSINESS PROCESS","D":"Offset - Technical","E":"Offset","F":"MTTR - Converting 02 FG (Hrs)","G":"Hours","H":"Minimized","I":"Lost Hrs/BD Events","J":"Bulanan","K":0.98,"L":0.98,"M":0.46730158730158744,"N":0.98,"O":0.8209047619047617,"P":0.98,"Q":1.1974444444444434,"R":0.98,"S":0.5202301587301588,"T":0.98,"U":0.6093253968253967,"V":0.98,"W":10.391619047619049,"X":0.98,"Y":2.366222222222224,"Z":0.98,"AB":0.98,"AD":0.98,"AF":0.98,"AH":0.98,"AM":48.198055555555555,"AN":50.73638888888889,"AO":107.60577380952381,"AP":15.016065700483091,"AQ":20.203291902071562,"AR":40.034122807017546,"AS":31.946046698872784,"AT":0,"AU":0,"AV":0,"AW":0,"AX":0,"BA":7.857090643274857,"BB":2.7075163398692768,"BC":2.206845238095238,"BD":1.8575845410628025,"BE":1.031591337099813,"BF":3.168037280701757,"BG":0.8522544283413849,"BH":0,"BI":0,"BJ":0,"BK":0,"BL":0,"BO":"Printing ","BP":15.656296882092782,"BQ":6.318747117483973,"BR":4.68920625484085,"BS":15.525870963318084,"BT":7.62377114441052,"BU":10.916110861630836,"BV":3.898408072337987,"BW":0,"BX":0,"BY":0,"BZ":0,"CA":0}', "FormulaJSON": `{"M":"'Chart_Conv 02 Folder Gluer'!R11","N":"L19","O":"'Chart_Conv 02 Folder Gluer'!R26","P":"N19","Q":"'Chart_Conv 02 Folder Gluer'!R41","R":"P19","S":"'Chart_Conv 02 Folder Gluer'!R56","T":"R19","U":"'Chart_Conv 02 Folder Gluer'!R71","W":"'Chart_Conv 02 Folder Gluer'!R101","Y":"'Chart_Conv 02 Folder Gluer'!R116","AM":"M14","AN":"O14","AO":"Q14","AP":"S14","AQ":"U14","AR":"W14","AS":"Y14","AT":"AA14","AU":"AC14","AV":"AE14","AW":"AG14","AX":"AI14","BA":"M17","BB":"O17","BC":"Q17","BD":"S17","BE":"U17","BF":"W17","BG":"Y17","BH":"AA17","BI":"AC17","BJ":"AE17","BK":"AG17","BL":"AI17","BP":"M11","BQ":"O11","BR":"Q11","BS":"S11","BT":"U11","BU":"W11","BV":"Y11","BW":"AA11","BX":"AC11","BY":"AE11","BZ":"AG11","CA":"AI11"}` }, { "Sheet": "Kertas Kerja", "Row": 20, "DataJSON": '{"B":9,"F":"WH Inventory Value","G":"Bio IDR","AM":276.516625,"AN":339.25444444444446,"AO":167.94553703703704,"AP":103.89294444444444,"AQ":336.7804444444444,"AR":113.92654320987653,"AS":104.92832671957672,"AT":0,"AU":0,"AV":0,"AW":0,"AX":0,"BA":0.98,"BB":0.98,"BC":0.98,"BD":0.98,"BE":0.98,"BF":0.98,"BG":0.98,"BH":0.98,"BI":0.98,"BJ":0.98,"BK":0.98,"BL":0.98,"BM":0.98,"BO":"Converting","BP":1.8066575826949087,"BQ":2.3813616720139623,"BR":1.8161812164068791,"BS":3.0814213748533916,"BT":0.3269207893359613,"BU":6.340006045444016,"BV":1.566130196892243,"BW":0,"BX":0,"BY":0,"BZ":0,"CA":0}', "FormulaJSON": '{"AM":"M15","AN":"O15","AO":"Q15","AP":"S15","AQ":"U15","AR":"W15","AS":"Y15","AT":"AA15","AU":"AC15","AV":"AE15","AW":"AG15","AX":"AI15","BB":"BA20","BP":"M12","BQ":"O12","BR":"Q12","BS":"S12","BT":"U12","BU":"W12","BV":"Y12","BW":"AA13","BX":"AC12","BY":"AE12","BZ":"AG12","CA":"AI12"}' }, { "Sheet": "Kertas Kerja", "Row": 21, "DataJSON": '{"L":"YTD (Jan - Jan)","N":"YTD (Jan - Feb)","P":"YTD (Jan - Mar)","R":"YTD (Jan - Apr)","T":"YTD (Jan - May)","V":"YTD (Jan - Jun)","X":"YTD (Jan - Jul)","Z":"YTD (Jan - Aug)","AB":"YTD (Jan - Sep)","AD":"YTD (Jan - Oct)","AF":"YTD (Jan - Nov)","AH":"YTD (Jan - Des)","BA":1.5339583333333338,"BB":2.33888888888889,"BC":2.07314814814815,"BD":1.9649007936507932,"BE":0.36166666666666697,"BF":6.904320987654317,"BG":0.8961640211640209,"BH":0,"BI":0,"BJ":0,"BK":0,"BL":0,"BN":"Target Printing (%)","BP":5,"BQ":5,"BR":5,"BS":5,"BT":5,"BU":5,"BV":5,"BW":5,"BX":5,"BY":5,"BZ":5,"CA":5}', "FormulaJSON": '{"BA":"M18","BB":"O18","BC":"Q18","BD":"S18","BE":"U18","BF":"W18","BG":"Y18","BH":"AA18","BI":"AC18","BJ":"AE19","BK":"AG19","BL":"AI19"}' }, { "Sheet": "Kertas Kerja", "Row": 22, "DataJSON": '{"F":"Machine Loss Time - Printing (%)","G":"%","H":"Minimized","I":"(Losthrs/RunHrs)*100","J":"YTD","K":5,"L":5,"M":15.656296882092782,"N":5,"O":11.009574678385617,"P":5,"Q":8.957941913971162,"R":5,"S":10.69799853235145,"T":5,"U":10.0440198337798,"V":5,"W":10.181384495000538,"X":5,"Y":9.419773229058473,"Z":5,"AB":5,"AD":5,"AF":5,"AH":5,"BN":"Target Converting (%)","BP":2,"BQ":2,"BR":2,"BS":2,"BT":2,"BU":2,"BV":2,"BW":2,"BX":2,"BY":2,"BZ":2,"CA":2}', "FormulaJSON": '{"M":"M11","N":"L22","O":"chart_Printing!AD25","P":"N22","Q":"chart_Printing!AD40","R":"P22","S":"chart_Printing!AD55","T":"R22","U":"chart_Printing!AD70","V":"T22","W":"chart_Printing!AD85","X":"V22","Y":"chart_Printing!AD100","Z":"X22","AB":"Z22","AD":"AB22","AF":"AD22","AH":"AF22"}' }, { "Sheet": "Kertas Kerja", "Row": 23, "DataJSON": '{"F":"Machine Loss Time - Converting 01 AP (%)","G":"%","H":"Minimized","I":"(Losthrs/RunHrs)*100","J":"YTD","K":2,"L":2,"M":1.8066575826949087,"N":2,"O":2.189124738528858,"P":2,"Q":2.027823155545782,"R":2,"S":2.336493422781958,"T":2,"U":1.902142010372774,"V":2,"W":2.722265297883894,"X":2,"Y":2.553848761980074,"Z":2,"AB":2,"AD":2,"AF":2,"AH":2}', "FormulaJSON": `{"N":"L23","O":"'Chart_Conv 01 Autoplaten'!AW33","P":"N23","Q":"'Chart_Conv 01 Autoplaten'!AW51","R":"P23","S":"'Chart_Conv 01 Autoplaten'!AW69","T":"R23","U":"'Chart_Conv 01 Autoplaten'!AW87","V":"T23","W":"'Chart_Conv 01 Autoplaten'!AW105","X":"V23","Y":"'Chart_Conv 01 Autoplaten'!AW123","Z":"X23","AB":"Z23","AD":"AB23","AF":"AD23","AH":"AF23"}` }, { "Sheet": "Kertas Kerja", "Row": 24, "DataJSON": '{"F":"Machine Loss Time - Converting 02 FG (%)","G":"%","H":"Minimized","I":"(Losthrs/RunHrs)*100","J":"YTD","K":2,"L":2,"M":0.6792597099008111,"N":2,"O":1.6878457132042761,"P":2,"Q":3.583177640453333,"R":2,"S":4.007551136816838,"T":2,"U":4.98927601796103,"V":2,"W":12.817397596170162,"X":2,"Y":16.306981365521484,"Z":2,"AB":2,"AD":2,"AF":2,"AH":2}', "FormulaJSON": `{"N":"K24","O":"'Chart_Conv 02 Folder Gluer'!AH26","P":"K24","Q":"'Chart_Conv 02 Folder Gluer'!AH41","R":"K24","S":"'Chart_Conv 02 Folder Gluer'!AH56","T":"K24","U":"'Chart_Conv 02 Folder Gluer'!AH71","V":"K24","W":"'Chart_Conv 02 Folder Gluer'!AH101","X":"K24","Y":"'Chart_Conv 02 Folder Gluer'!AH116","Z":"K24","AB":"K24","AD":"K24","AF":"K24","AH":"K24"}` }, { "Sheet": "Kertas Kerja", "Row": 25, "DataJSON": '{"F":"MTBF- Printing (Hrs)","G":"Hours","H":"Maximized","I":"RunHrs/BD Events","J":"YTD","K":56.19,"L":56.19,"M":48.198055555555555,"N":56.19,"O":47.85944949494949,"P":56.19,"Q":56.00294033275961,"R":56.19,"S":31.31792650245182,"T":56.19,"U":28.144180550632164,"V":56.19,"W":29.751215686274513,"X":56.19,"Y":30.011468390504987,"Z":56.19,"AB":56.19,"AD":56.19,"AF":56.19,"AH":56.19}', "FormulaJSON": '{"N":"K25","O":"chart_Printing!AI25","P":"K25","Q":"chart_Printing!AI40","R":"K25","S":"chart_Printing!AI55","T":"R25","U":"chart_Printing!AI70","V":"T25","W":"chart_Printing!AI85","X":"V25","Y":"chart_Printing!AI100","Z":"X25","AB":"X25","AD":"Z25","AF":"AB25","AH":"AD25"}' }, { "Sheet": "Kertas Kerja", "Row": 26, "DataJSON": '{"F":"MTBF - Converting 01 AP (Hrs)","G":"Hours","H":"Maximized","I":"RunHrs/BD Events","J":"YTD","K":106,"L":106,"M":276.516625,"N":106,"O":236.0214036426536,"P":106,"Q":162.98783957600133,"R":106,"S":126.36345240034757,"T":106,"U":149.2293256915187,"V":106,"W":134.38934022751127,"X":106,"Y":127.39458093477491,"Z":106,"AB":106,"AD":106,"AF":106,"AH":106}', "FormulaJSON": `{"N":"L26","O":"'Chart_Conv 01 Autoplaten'!BB33","P":"P15","Q":"'Chart_Conv 01 Autoplaten'!BB51","R":"P26","S":"'Chart_Conv 01 Autoplaten'!BB69","T":"R26","U":"'Chart_Conv 01 Autoplaten'!BB87","W":"'Chart_Conv 01 Autoplaten'!BB105","Y":"'Chart_Conv 01 Autoplaten'!BB123","AB":"X26","AD":"Z26","AF":"AB26","AH":"AD26"}` }, { "Sheet": "Kertas Kerja", "Row": 27, "DataJSON": '{"F":"MTBF - Converting 02 FG (Hrs)","G":"Hours","H":"Maximized","I":"RunHrs/BD Events","J":"YTD","K":300,"L":300,"M":197.02779682539682,"N":300,"O":370.571673015873,"P":300,"Q":543.1637841269842,"R":300,"S":745.551061904762,"T":300,"U":988.0973595238096,"V":300,"W":1389.904961904762,"X":300,"Y":1482.1522174603174,"Z":300,"AB":300,"AD":300,"AF":300,"AH":300}', "FormulaJSON": `{"N":"K27","O":"'Chart_Conv 02 Folder Gluer'!AM26","P":"K27","Q":"'Chart_Conv 02 Folder Gluer'!AM41","R":"K27","S":"'Chart_Conv 02 Folder Gluer'!AM56","T":"K27","U":"'Chart_Conv 02 Folder Gluer'!AM71","W":"'Chart_Conv 02 Folder Gluer'!AM101","Y":"'Chart_Conv 02 Folder Gluer'!AM116","AB":"K27","AD":"K27","AF":"K27","AH":"K27"}` }, { "Sheet": "Kertas Kerja", "Row": 28, "DataJSON": '{"F":"MTTR - Printing (Hrs)","G":"Hours","H":"Minimized","I":"Lost Hrs/BD Events","J":"YTD","K":0.98,"L":0.98,"M":7.857090643274857,"N":0.98,"O":5.183585858585858,"P":0.98,"Q":4.708835341365462,"R":0.98,"S":2.953815999543848,"T":0.98,"U":2.4022096183386514,"V":0.98,"W":2.5096323529411775,"X":0.98,"Y":2.3077151322420333,"Z":0.98,"AB":0.98,"AD":0.98,"AF":0.98,"AH":0.98}', "FormulaJSON": '{"N":"L28","O":"chart_Printing!AJ25","P":"P17","Q":"chart_Printing!AJ40","R":"P28","S":"chart_Printing!AJ55","T":"R28","U":"chart_Printing!AJ70","W":"chart_Printing!AJ85","Y":"chart_Printing!AJ100","AB":"X28","AD":"Z28","AF":"AB28","AH":"AD28"}' }, { "Sheet": "Kertas Kerja", "Row": 29, "DataJSON": '{"F":"MTTR - Converting 01 AP (Hrs)","G":"Hours","H":"Minimized","I":"Lost Hrs/BD Events","J":"YTD","K":0.98,"L":0.98,"M":1.5339583333333338,"N":0.98,"O":2.359784289784291,"P":0.98,"Q":2.287753770739066,"R":0.98,"S":2.152927120669057,"T":0.98,"U":1.9943782706966546,"V":0.98,"W":2.9658542322687054,"X":0.98,"Y":2.5852966985402324,"Z":0.98,"AB":0.98,"AD":0.98,"AF":0.98,"AH":0.98}', "FormulaJSON": `{"N":"L29","O":"'Chart_Conv 01 Autoplaten'!BC33","P":"P19","Q":"'Chart_Conv 01 Autoplaten'!BC51","R":"P29","S":"'Chart_Conv 01 Autoplaten'!BC69","T":"R29","U":"'Chart_Conv 01 Autoplaten'!BC87","W":"'Chart_Conv 01 Autoplaten'!BC105","Y":"'Chart_Conv 01 Autoplaten'!BC123","AB":"X29","AD":"Z29","AF":"AB29","AH":"AD29"}` }, { "Sheet": "Kertas Kerja", "Row": 30, "DataJSON": '{"F":"MTTR - Converting 02 FG (Hrs)","G":"Hours","H":"Minimized","I":"Lost Hrs/BD Events","J":"YTD","K":0.98,"L":0.98,"M":0.46730158730158744,"N":0.98,"O":1.2882063492063491,"P":0.98,"Q":2.485650793650793,"R":0.98,"S":3.0058809523809513,"T":0.98,"U":3.6152063492063484,"V":0.98,"W":14.616150793650794,"X":0.98,"Y":16.982373015873016,"Z":0.98,"AB":0.98,"AD":0.98,"AF":0.98,"AH":0.98}', "FormulaJSON": `{"N":"L30","O":"'Chart_Conv 02 Folder Gluer'!AN26","P":"K30","Q":"'Chart_Conv 02 Folder Gluer'!AN41","R":"P30","S":"'Chart_Conv 02 Folder Gluer'!AN56","T":"R30","U":"'Chart_Conv 02 Folder Gluer'!AN71","W":"'Chart_Conv 02 Folder Gluer'!AN101","Y":"'Chart_Conv 02 Folder Gluer'!AN116","AB":"X30","AD":"Z30","AF":"AB30","AH":"AD30"}` }, { "Sheet": "Kertas Kerja (Simple View)", "Row": 1, "DataJSON": '{"M":"MonthLookup (helper - jangan hapus)"}', "FormulaJSON": "{}" }, { "Sheet": "Kertas Kerja (Simple View)", "Row": 2, "DataJSON": '{"B":"KPI OFFSET - TECHNICAL  |  TAMPILAN SEDERHANA (LOW COGNITIVE LOAD)","M":"Jan","N":12}', "FormulaJSON": "{}" }, { "Sheet": "Kertas Kerja (Simple View)", "Row": 3, "DataJSON": `{"B":"Data & formula bersumber langsung dari sheet 'Kertas Kerja' (tidak diubah). Pilih bulan untuk melihat status KPI.","M":"Feb","N":14}`, "FormulaJSON": "{}" }, { "Sheet": "Kertas Kerja (Simple View)", "Row": 4, "DataJSON": '{"M":"Mar","N":16}', "FormulaJSON": "{}" }, { "Sheet": "Kertas Kerja (Simple View)", "Row": 5, "DataJSON": '{"B":"Pilih Bulan:","C":"Jan","E":"Tahun:","F":2026,"M":"Apr","N":18}', "FormulaJSON": "{}" }, { "Sheet": "Kertas Kerja (Simple View)", "Row": 6, "DataJSON": '{"M":"Mei","N":20}', "FormulaJSON": "{}" }, { "Sheet": "Kertas Kerja (Simple View)", "Row": 7, "DataJSON": '{"B":"NO","C":"KEY PERFORMANCE INDICATOR","D":"DIVISI","E":"SATUAN","F":"POLARITAS","G":"TARGET","H":"REALISASI","I":"ACHIEVEMENT","J":"STATUS","M":"Jun","N":22}', "FormulaJSON": "{}" }, { "Sheet": "Kertas Kerja (Simple View)", "Row": 8, "DataJSON": '{"B":1,"C":"Machine Loss Time - Printing (%)","D":"Offset","E":"%","F":"Minimized","G":5,"H":15.656296882092782,"I":0.3193603211318032,"J":"BELUM TERCAPAI","M":"Jul","N":24}', "FormulaJSON": `{"B":"'Kertas Kerja'!B11","C":"'Kertas Kerja'!F11","D":"'Kertas Kerja'!E11","E":"'Kertas Kerja'!G11","F":"'Kertas Kerja'!H11","G":"INDEX('Kertas Kerja'!$A$11:$AI$19,1,VLOOKUP($C$5,$M$2:$N$13,2,0))","H":"INDEX('Kertas Kerja'!$A$11:$AI$19,1,VLOOKUP($C$5,$M$2:$N$13,2,0)+1)","I":"IFERROR(IF(F8=\\"Minimized\\",IF(H8=0,0,G8/H8),IF(G8=0,0,H8/G8)),0)","J":"IF(I8>=1,\\"TERCAPAI\\",\\"BELUM TERCAPAI\\")"}` }, { "Sheet": "Kertas Kerja (Simple View)", "Row": 9, "DataJSON": '{"B":2,"C":"Machine Loss Time - Converting 01 AP (%)","D":"Offset","E":"%","F":"Minimized","G":2,"H":1.8066575826949087,"I":1.1070166362220621,"J":"TERCAPAI","M":"Agust","N":26}', "FormulaJSON": `{"B":"'Kertas Kerja'!B12","C":"'Kertas Kerja'!F12","D":"'Kertas Kerja'!E12","E":"'Kertas Kerja'!G12","F":"'Kertas Kerja'!H12","G":"INDEX('Kertas Kerja'!$A$11:$AI$19,2,VLOOKUP($C$5,$M$2:$N$13,2,0))","H":"INDEX('Kertas Kerja'!$A$11:$AI$19,2,VLOOKUP($C$5,$M$2:$N$13,2,0)+1)"}` }, { "Sheet": "Kertas Kerja (Simple View)", "Row": 10, "DataJSON": '{"B":2,"C":"Machine Loss Time - Converting 02 FG (%)","D":"Offset","E":"%","F":"Minimized","G":2,"H":0.6792597099008111,"I":2.9443819070205857,"J":"TERCAPAI","M":"Sep","N":28}', "FormulaJSON": `{"B":"'Kertas Kerja'!B13","C":"'Kertas Kerja'!F13","D":"'Kertas Kerja'!E13","E":"'Kertas Kerja'!G13","F":"'Kertas Kerja'!H13","G":"INDEX('Kertas Kerja'!$A$11:$AI$19,3,VLOOKUP($C$5,$M$2:$N$13,2,0))","H":"INDEX('Kertas Kerja'!$A$11:$AI$19,3,VLOOKUP($C$5,$M$2:$N$13,2,0)+1)"}` }, { "Sheet": "Kertas Kerja (Simple View)", "Row": 11, "DataJSON": '{"B":5,"C":"MTBF- Printing (Hrs)","D":"Offset","E":"Hours","F":"Maximized","G":56.19,"H":48.198055555555555,"I":0.8577692748808606,"J":"BELUM TERCAPAI","M":"Okt","N":30}', "FormulaJSON": `{"B":"'Kertas Kerja'!B14","C":"'Kertas Kerja'!F14","D":"'Kertas Kerja'!E14","E":"'Kertas Kerja'!G14","F":"'Kertas Kerja'!H14","G":"INDEX('Kertas Kerja'!$A$11:$AI$19,4,VLOOKUP($C$5,$M$2:$N$13,2,0))","H":"INDEX('Kertas Kerja'!$A$11:$AI$19,4,VLOOKUP($C$5,$M$2:$N$13,2,0)+1)"}` }, { "Sheet": "Kertas Kerja (Simple View)", "Row": 12, "DataJSON": '{"B":6,"C":"MTBF - Converting 01 AP (Hrs)","D":"Offset","E":"Hours","F":"Maximized","G":106,"H":276.516625,"I":2.6086474056603772,"J":"TERCAPAI","M":"Nop","N":32}', "FormulaJSON": `{"B":"'Kertas Kerja'!B15","C":"'Kertas Kerja'!F15","D":"'Kertas Kerja'!E15","E":"'Kertas Kerja'!G15","F":"'Kertas Kerja'!H15","G":"INDEX('Kertas Kerja'!$A$11:$AI$19,5,VLOOKUP($C$5,$M$2:$N$13,2,0))","H":"INDEX('Kertas Kerja'!$A$11:$AI$19,5,VLOOKUP($C$5,$M$2:$N$13,2,0)+1)"}` }, { "Sheet": "Kertas Kerja (Simple View)", "Row": 13, "DataJSON": '{"B":6,"C":"MTBF - Converting 02 FG (Hrs)","D":"Offset","E":"Hours","F":"Maximized","G":300,"H":197.02779682539682,"I":0.6567593227513228,"J":"BELUM TERCAPAI","M":"Des","N":34}', "FormulaJSON": `{"B":"'Kertas Kerja'!B16","C":"'Kertas Kerja'!F16","D":"'Kertas Kerja'!E16","E":"'Kertas Kerja'!G16","F":"'Kertas Kerja'!H16","G":"INDEX('Kertas Kerja'!$A$11:$AI$19,6,VLOOKUP($C$5,$M$2:$N$13,2,0))","H":"INDEX('Kertas Kerja'!$A$11:$AI$19,6,VLOOKUP($C$5,$M$2:$N$13,2,0)+1)"}` }, { "Sheet": "Kertas Kerja (Simple View)", "Row": 14, "DataJSON": '{"B":7,"C":"MTTR - Printing (Hrs)","D":"Offset","E":"Hours","F":"Minimized","G":0.98,"H":7.857090643274857,"I":0.12472810159557142,"J":"BELUM TERCAPAI"}', "FormulaJSON": `{"B":"'Kertas Kerja'!B17","C":"'Kertas Kerja'!F17","D":"'Kertas Kerja'!E17","E":"'Kertas Kerja'!G17","F":"'Kertas Kerja'!H17","G":"INDEX('Kertas Kerja'!$A$11:$AI$19,7,VLOOKUP($C$5,$M$2:$N$13,2,0))","H":"INDEX('Kertas Kerja'!$A$11:$AI$19,7,VLOOKUP($C$5,$M$2:$N$13,2,0)+1)"}` }, { "Sheet": "Kertas Kerja (Simple View)", "Row": 15, "DataJSON": '{"B":8,"C":"MTTR - Converting 01 AP (Hrs)","D":"Offset","E":"Hours","F":"Minimized","G":0.98,"H":1.5339583333333338,"I":0.638870025804699,"J":"BELUM TERCAPAI"}', "FormulaJSON": `{"B":"'Kertas Kerja'!B18","C":"'Kertas Kerja'!F18","D":"'Kertas Kerja'!E18","E":"'Kertas Kerja'!G18","F":"'Kertas Kerja'!H18","G":"INDEX('Kertas Kerja'!$A$11:$AI$19,8,VLOOKUP($C$5,$M$2:$N$13,2,0))","H":"INDEX('Kertas Kerja'!$A$11:$AI$19,8,VLOOKUP($C$5,$M$2:$N$13,2,0)+1)"}` }, { "Sheet": "Kertas Kerja (Simple View)", "Row": 16, "DataJSON": '{"B":8,"C":"MTTR - Converting 02 FG (Hrs)","D":"Offset","E":"Hours","F":"Minimized","G":0.98,"H":0.46730158730158744,"I":2.097146739130434,"J":"TERCAPAI"}', "FormulaJSON": `{"B":"'Kertas Kerja'!B19","C":"'Kertas Kerja'!F19","D":"'Kertas Kerja'!E19","E":"'Kertas Kerja'!G19","F":"'Kertas Kerja'!H19","G":"INDEX('Kertas Kerja'!$A$11:$AI$19,9,VLOOKUP($C$5,$M$2:$N$13,2,0))","H":"INDEX('Kertas Kerja'!$A$11:$AI$19,9,VLOOKUP($C$5,$M$2:$N$13,2,0)+1)"}` }, { "Sheet": "chart_Printing", "Row": 2, "DataJSON": '{"A":"MTD","B":46023,"U":"YTD","V":46023}', "FormulaJSON": "{}" }, { "Sheet": "chart_Printing", "Row": 3, "DataJSON": '{"B":"Source: ODIN","V":"Source: ODIN"}', "FormulaJSON": "{}" }, { "Sheet": "chart_Printing", "Row": 4, "DataJSON": '{"B":"Mesin","C":"El BD","D":"Mech BD","E":"Total Lost","F":"Run Hrs","G":"Run Hrs + total lost","H":"%El","I":"%Mech","J":"% Total Lost","K":"MTBF EL","L":"MTTR EL","M":"MTBF Mech","N":"MTTR Mech","O":"MTBF Mch","P":"MTTR Mch","Q":"BD Events EL","R":"BD Event Mech","S":"Sum BD Evt","V":"Mesin","W":"El BD","X":"Mech BD","Y":"Total Lost","Z":"Run Hrs","AA":"Run Hrs + total lost","AB":"%El","AC":"%Mech","AD":"% Total Lost","AE":"MTBF EL","AF":"MTTR EL","AG":"MTBF Mech","AH":"MTTR Mech","AI":"MTBF Mch","AJ":"MTTR Mch","AK":"BD Events EL","AL":"BD Event Mech","AM":"Sum BD Evt"}', "FormulaJSON": "{}" }, { "Sheet": "chart_Printing", "Row": 5, "DataJSON": '{"B":"OFFSET - 4 MACHINE","S":0,"V":"OFFSET - 4 MACHINE","AM":0}', "FormulaJSON": '{"S":"SUM(Q5:R5)","AM":"SUM(AK5:AL5)"}' }, { "Sheet": "chart_Printing", "Row": 6, "DataJSON": '{"B":"OFFSET UV INK - 5 MACHINE","C":34.5,"D":16.9166666666667,"E":51.4166666666667,"F":520.99,"G":572.4066666666668,"H":6.622008099963531,"I":3.247023295392752,"J":9.869031395356282,"K":24.809047619047618,"L":1.6428571428571428,"M":30.646470588235296,"N":0.9950980392156882,"O":15.063333333333336,"P":1.3530701754385974,"Q":21,"R":17,"S":38,"V":"OFFSET UV INK - 5 MACHINE","W":34.5,"X":16.9166666666667,"Y":51.4166666666667,"Z":520.99,"AA":572.4066666666668,"AB":6.622008099963531,"AC":3.247023295392752,"AD":9.869031395356282,"AE":24.809047619047618,"AF":1.6428571428571428,"AG":30.646470588235296,"AH":0.9950980392156882,"AI":15.063333333333336,"AJ":1.3530701754385974,"AK":21,"AL":17,"AM":38}', "FormulaJSON": '{"E":"C6+D6","G":"F6+E6","H":"C6/F6*100","I":"D6/F6*100","J":"E6/F6*100","K":"F6/Q6","L":"C6/(Q6)","M":"F6/R6","N":"D6/(R6)","O":"G6/(Q6+R6)","P":"E6/(Q6+R6)","S":"SUM(Q6:R6)","Y":"W6+X6","AA":"Z6+Y6","AB":"W6/Z6*100","AC":"X6/Z6*100","AD":"Y6/Z6*100","AE":"Z6/AK6","AF":"W6/(AK6)","AG":"Z6/AL6","AH":"X6/(AL6)","AI":"AA6/(AK6+AL6)","AJ":"Y6/(AK6+AL6)","AM":"SUM(AK6:AL6)"}' }, { "Sheet": "chart_Printing", "Row": 7, "DataJSON": '{"B":"OFFSET - 6 MACHINE","S":0,"V":"OFFSET - 6 MACHINE","AM":0}', "FormulaJSON": '{"S":"SUM(Q7:R7)","AM":"SUM(AK7:AL7)"}' }, { "Sheet": "chart_Printing", "Row": 8, "DataJSON": '{"B":"SHEET FEED GRAVURE MACHINE","S":0,"V":"SHEET FEED GRAVURE MACHINE","AM":0}', "FormulaJSON": '{"S":"SUM(Q8:R8)","AM":"SUM(AK8:AL8)"}' }, { "Sheet": "chart_Printing", "Row": 9, "DataJSON": '{"B":"OFFSET - 8 MACHINE","C":85.6666666666667,"D":0.5,"E":86.1666666666667,"F":401.83,"G":487.99666666666667,"H":21.319131639416348,"I":0.12443072941293583,"J":21.443562368829284,"K":80.366,"L":17.13333333333334,"M":401.83,"N":0.5,"O":81.33277777777778,"P":14.361111111111116,"Q":5,"R":1,"S":6,"V":"OFFSET - 8 MACHINE","W":85.6666666666667,"X":0.5,"Y":86.1666666666667,"Z":401.83,"AA":487.99666666666667,"AB":21.319131639416348,"AC":0.12443072941293583,"AD":21.443562368829284,"AE":80.366,"AF":17.13333333333334,"AG":401.83,"AH":0.5,"AI":81.33277777777778,"AJ":14.361111111111116,"AK":5,"AL":1,"AM":6}', "FormulaJSON": '{"E":"C9+D9","G":"F9+E9","H":"C9/F9*100","I":"D9/F9*100","J":"E9/F9*100","K":"F9/Q9","L":"C9/(Q9)","M":"F9/R9","N":"D9/(R9)","O":"G9/(Q9+R9)","P":"E9/(Q9+R9)","S":"SUM(Q9:R9)","Y":"W9+X9","AA":"Z9+Y9","AB":"W9/Z9*100","AC":"X9/Z9*100","AD":"Y9/Z9*100","AE":"Z9/AK9","AF":"W9/(AK9)","AG":"Z9/AL9","AH":"X9/(AL9)","AI":"AA9/(AK9+AL9)","AJ":"Y9/(AK9+AL9)","AM":"SUM(AK9:AL9)"}' }, { "Sheet": "chart_Printing", "Row": 10, "DataJSON": '{"J":15.656296882092782,"O":48.198055555555555,"P":7.857090643274857,"Q":26,"R":18,"S":44,"AD":15.656296882092782,"AI":48.198055555555555,"AJ":7.857090643274857,"AK":26,"AL":18}', "FormulaJSON": '{"J":"AVERAGE(J5:J9)","O":"AVERAGE(O5:O9)","P":"AVERAGE(P5:P9)","Q":"SUM(Q5:Q9)","R":"SUM(R5:R9)","S":"SUM(S5:S9)","AD":"AVERAGE(AD5:AD9)","AI":"AVERAGE(AI5:AI9)","AJ":"AVERAGE(AJ5:AJ9)","AK":"SUM(AK5:AK9)","AL":"SUM(AL5:AL9)"}' }, { "Sheet": "chart_Printing", "Row": 12, "DataJSON": '{"B":"Highlite Issue","V":"Highlite Issue"}', "FormulaJSON": "{}" }, { "Sheet": "chart_Printing", "Row": 13, "DataJSON": '{"C":"Mesin OFU-1","M":"OFS-8","W":"Mesin OFU-1","AG":"OFS-8"}', "FormulaJSON": "{}" }, { "Sheet": "chart_Printing", "Row": 15, "DataJSON": '{"C":"Issue -  ","M":" issue -","W":"Issue -  ","AG":" issue -"}', "FormulaJSON": "{}" }, { "Sheet": "chart_Printing", "Row": 17, "DataJSON": '{"A":"MTD","B":46054,"U":"YTD","V":46054}', "FormulaJSON": "{}" }, { "Sheet": "chart_Printing", "Row": 18, "DataJSON": '{"B":"Source: ODIN","V":"Source: ODIN"}', "FormulaJSON": "{}" }, { "Sheet": "chart_Printing", "Row": 19, "DataJSON": '{"B":"Mesin","C":"El BD","D":"Mech BD","E":"Total Lost","F":"Run Hrs","G":"Run Hrs + total lost","H":"%El","I":"%Mech","J":"% Total Lost","K":"MTBF EL","L":"MTTR EL","M":"MTBF Mech","N":"MTTR Mech","O":"MTBF Mch","P":"MTTR Mch","Q":"BD Events EL","R":"BD Event Mech","S":"Sum BD Evt","V":"Mesin","W":"El BD","X":"Mech BD","Y":"Total Lost","Z":"Run Hrs","AA":"Run Hrs + total lost","AB":"%El","AC":"%Mech","AD":"% Total Lost","AE":"MTBF EL","AF":"MTTR EL","AG":"MTBF Mech","AH":"MTTR Mech","AI":"MTBF Mch","AJ":"MTTR Mch","AK":"BD Events EL","AL":"BD Event Mech","AM":"Sum BD Evt"}', "FormulaJSON": "{}" }, { "Sheet": "chart_Printing", "Row": 20, "DataJSON": '{"B":"OFFSET - 4 MACHINE","S":0,"V":"OFFSET - 4 MACHINE","AM":0}', "FormulaJSON": '{"S":"SUM(Q20:R20)","AM":"SUM(AK20:AL20)"}' }, { "Sheet": "chart_Printing", "Row": 21, "DataJSON": '{"B":"OFFSET UV INK - 5 MACHINE","C":5.25,"D":35.3333333333333,"E":40.5833333333333,"F":501.83,"G":542.4133333333333,"H":1.0461710140884364,"I":7.040896983706295,"J":8.087067997794732,"K":83.63833333333334,"L":0.875,"M":45.62090909090909,"N":3.2121212121212093,"O":31.906666666666666,"P":2.3872549019607825,"Q":6,"R":11,"S":17,"V":"OFFSET UV INK - 5 MACHINE","W":39.75,"X":52.25,"Y":92,"Z":1022.8199999999999,"AA":1114.82,"AB":3.886314307502787,"AC":5.1084257249564935,"AD":8.99474003245928,"AE":37.88222222222222,"AF":1.4722222222222223,"AG":36.52928571428571,"AH":1.8660714285714286,"AI":20.269454545454543,"AJ":1.6727272727272726,"AK":27,"AL":28,"AM":55}', "FormulaJSON": '{"E":"C21+D21","G":"F21+E21","H":"C21/F21*100","I":"D21/F21*100","J":"E21/F21*100","K":"F21/Q21","L":"C21/(Q21)","M":"F21/R21","N":"D21/(R21)","O":"G21/(Q21+R21)","P":"E21/(Q21+R21)","S":"SUM(Q21:R21)","W":"W6+C21","X":"X6+D21","Y":"W21+X21","Z":"Z6+F21","AA":"Z21+Y21","AB":"W21/Z21*100","AC":"X21/Z21*100","AD":"Y21/Z21*100","AE":"Z21/AK21","AF":"W21/(AK21)","AG":"Z21/AL21","AH":"X21/(AL21)","AI":"AA21/(AK21+AL21)","AJ":"Y21/(AK21+AL21)","AK":"AK6+Q21","AL":"AL6+R21","AM":"SUM(AK21:AL21)"}' }, { "Sheet": "chart_Printing", "Row": 22, "DataJSON": '{"B":"OFFSET - 6 MACHINE","S":0,"V":"OFFSET - 6 MACHINE","AM":0}', "FormulaJSON": '{"S":"SUM(Q22:R22)","AM":"SUM(AK22:AL22)"}' }, { "Sheet": "chart_Printing", "Row": 23, "DataJSON": '{"B":"SHEET FEED GRAVURE MACHINE","S":0,"V":"SHEET FEED GRAVURE MACHINE","AM":0}', "FormulaJSON": '{"S":"SUM(Q23:R23)","AM":"SUM(AK23:AL23)"}' }, { "Sheet": "chart_Printing", "Row": 24, "DataJSON": '{"B":"OFFSET - 8 MACHINE","C":1.33333333333333,"D":16.8333333333333,"E":18.16666666666663,"F":399.23,"G":417.39666666666665,"H":0.33397623759069456,"I":4.2164499995825215,"J":4.550426237173215,"K":133.07666666666668,"L":0.4444444444444433,"M":133.07666666666668,"N":5.6111111111111,"O":69.56611111111111,"P":3.0277777777777715,"Q":3,"R":3,"S":6,"V":"OFFSET - 8 MACHINE","W":87.00000000000003,"X":17.3333333333333,"Y":104.33333333333333,"Z":801.06,"AA":905.3933333333333,"AB":10.860609692157896,"AC":2.1637996321540585,"AD":13.024409324311954,"AE":100.1325,"AF":10.875000000000004,"AG":200.265,"AH":4.333333333333325,"AI":75.44944444444444,"AJ":8.694444444444445,"AK":8,"AL":4,"AM":12}', "FormulaJSON": '{"E":"C24+D24","G":"F24+E24","H":"C24/F24*100","I":"D24/F24*100","J":"E24/F24*100","K":"F24/Q24","L":"C24/(Q24)","M":"F24/R24","N":"D24/(R24)","O":"G24/(Q24+R24)","P":"E24/(Q24+R24)","S":"SUM(Q24:R24)","W":"W9+C24","X":"X9+D24","Y":"W24+X24","Z":"Z9+F24","AA":"Z24+Y24","AB":"W24/Z24*100","AC":"X24/Z24*100","AD":"Y24/Z24*100","AE":"Z24/AK24","AF":"W24/(AK24)","AG":"Z24/AL24","AH":"X24/(AL24)","AI":"AA24/(AK24+AL24)","AJ":"Y24/(AK24+AL24)","AK":"AK9+Q24","AL":"AL9+R24","AM":"SUM(AK24:AL24)"}' }, { "Sheet": "chart_Printing", "Row": 25, "DataJSON": '{"J":6.318747117483973,"O":50.73638888888889,"P":2.7075163398692768,"Q":9,"R":14,"S":23,"AD":11.009574678385617,"AI":47.85944949494949,"AJ":5.183585858585858,"AK":35,"AL":32}', "FormulaJSON": '{"J":"AVERAGE(J20:J24)","O":"AVERAGE(O20:O24)","P":"AVERAGE(P20:P24)","Q":"SUM(Q20:Q24)","R":"SUM(R20:R24)","S":"SUM(S20:S24)","AD":"AVERAGE(AD20:AD24)","AI":"AVERAGE(AI20:AI24)","AJ":"AVERAGE(AJ20:AJ24)","AK":"SUM(AK20:AK24)","AL":"SUM(AL20:AL24)"}' }, { "Sheet": "chart_Printing", "Row": 27, "DataJSON": '{"B":"Highlite Issue","V":"Highlite Issue"}', "FormulaJSON": "{}" }, { "Sheet": "chart_Printing", "Row": 28, "DataJSON": '{"C":"Mesin OFU-1","M":"OFS-8","W":"Mesin OFU-1","AG":"OFS-8"}', "FormulaJSON": "{}" }, { "Sheet": "chart_Printing", "Row": 30, "DataJSON": '{"C":"Issue -  ","M":" issue -","W":"Issue -  ","AG":" issue -"}', "FormulaJSON": "{}" }, { "Sheet": "chart_Printing", "Row": 32, "DataJSON": '{"A":"MTD","B":46082,"U":"YTD","V":46082}', "FormulaJSON": "{}" }, { "Sheet": "chart_Printing", "Row": 33, "DataJSON": '{"B":"Source: ODIN","V":"Source: ODIN"}', "FormulaJSON": "{}" }, { "Sheet": "chart_Printing", "Row": 34, "DataJSON": '{"B":"Mesin","C":"El BD","D":"Mech BD","E":"Total Lost","F":"Run Hrs","G":"Run Hrs + total lost","H":"%El","I":"%Mech","J":"% Total Lost","K":"MTBF EL","L":"MTTR EL","M":"MTBF Mech","N":"MTTR Mech","O":"MTBF Mch","P":"MTTR Mch","Q":"BD Events EL","R":"BD Event Mech","S":"Sum BD Evt","V":"Mesin","W":"El BD","X":"Mech BD","Y":"Total Lost","Z":"Run Hrs","AA":"Run Hrs + total lost","AB":"%El","AC":"%Mech","AD":"% Total Lost","AE":"MTBF EL","AF":"MTTR EL","AG":"MTBF Mech","AH":"MTTR Mech","AI":"MTBF Mch","AJ":"MTTR Mch","AK":"BD Events EL","AL":"BD Event Mech","AM":"Sum BD Evt"}', "FormulaJSON": "{}" }, { "Sheet": "chart_Printing", "Row": 35, "DataJSON": '{"B":"OFFSET - 4 MACHINE","S":0,"V":"OFFSET - 4 MACHINE","AM":0}', "FormulaJSON": '{"S":"SUM(Q35:R35)","AM":"SUM(AK35:AL35)"}' }, { "Sheet": "chart_Printing", "Row": 36, "DataJSON": '{"B":"OFFSET UV INK - 5 MACHINE","C":5.33333333333333,"D":27.25,"E":32.58333333333333,"F":422.18,"G":454.7633333333333,"H":1.2632842231591572,"I":6.454592827703823,"J":7.71787705086298,"K":32.47538461538461,"L":0.41025641025641,"M":28.145333333333333,"N":1.8166666666666667,"O":16.24154761904762,"P":1.163690476190476,"Q":13,"R":15,"S":28,"V":"OFFSET UV INK - 5 MACHINE","W":45.08333333333333,"X":79.5,"Y":124.58333333333333,"Z":1445,"AA":1569.5833333333333,"AB":3.1199538638985,"AC":5.501730103806229,"AD":8.621683967704728,"AE":36.125,"AF":1.1270833333333332,"AG":33.604651162790695,"AH":1.8488372093023255,"AI":18.910642570281123,"AJ":1.501004016064257,"AK":40,"AL":43,"AM":83}', "FormulaJSON": '{"E":"C36+D36","G":"F36+E36","H":"C36/F36*100","I":"D36/F36*100","J":"E36/F36*100","K":"F36/Q36","L":"C36/(Q36)","M":"F36/R36","N":"D36/(R36)","O":"G36/(Q36+R36)","P":"E36/(Q36+R36)","S":"SUM(Q36:R36)","W":"W21+C36","X":"X21+D36","Y":"W36+X36","Z":"Z21+F36","AA":"Z36+Y36","AB":"W36/Z36*100","AC":"X36/Z36*100","AD":"Y36/Z36*100","AE":"Z36/AK36","AF":"W36/(AK36)","AG":"Z36/AL36","AH":"X36/(AL36)","AI":"AA36/(AK36+AL36)","AJ":"Y36/(AK36+AL36)","AK":"AK21+Q36","AL":"AL21+R36","AM":"SUM(AK36:AL36)"}' }, { "Sheet": "chart_Printing", "Row": 37, "DataJSON": '{"B":"OFFSET - 6 MACHINE","S":0,"V":"OFFSET - 6 MACHINE","AM":0}', "FormulaJSON": '{"S":"SUM(Q37:R37)","AM":"SUM(AK37:AL37)"}' }, { "Sheet": "chart_Printing", "Row": 38, "DataJSON": '{"B":"SHEET FEED GRAVURE MACHINE","S":0,"V":"SHEET FEED GRAVURE MACHINE","AM":0}', "FormulaJSON": '{"S":"SUM(Q38:R38)","AM":"SUM(AK38:AL38)"}' }, { "Sheet": "chart_Printing", "Row": 39, "DataJSON": '{"B":"OFFSET - 8 MACHINE","C":0.5,"D":6,"E":6.5,"F":391.44,"G":397.94,"H":0.12773349683220928,"I":1.5328019619865114,"J":1.6605354588187207,"K":391.44,"L":0.5,"M":391.44,"N":6,"O":198.97,"P":3.25,"Q":1,"R":1,"S":2,"V":"OFFSET - 8 MACHINE","W":87.50000000000003,"X":23.3333333333333,"Y":110.83333333333333,"Z":1192.5,"AA":1303.3333333333333,"AB":7.337526205450737,"AC":1.9566736547868595,"AD":9.294199860237596,"AE":132.5,"AF":9.722222222222225,"AG":238.5,"AH":4.66666666666666,"AI":93.09523809523809,"AJ":7.916666666666666,"AK":9,"AL":5,"AM":14}', "FormulaJSON": '{"E":"C39+D39","G":"F39+E39","H":"C39/F39*100","I":"D39/F39*100","J":"E39/F39*100","K":"F39/Q39","L":"C39/(Q39)","M":"F39/R39","N":"D39/(R39)","O":"G39/(Q39+R39)","P":"E39/(Q39+R39)","S":"SUM(Q39:R39)","W":"W24+C39","X":"X24+D39","Y":"W39+X39","Z":"Z24+F39","AA":"Z39+Y39","AB":"W39/Z39*100","AC":"X39/Z39*100","AD":"Y39/Z39*100","AE":"Z39/AK39","AF":"W39/(AK39)","AG":"Z39/AL39","AH":"X39/(AL39)","AI":"AA39/(AK39+AL39)","AJ":"Y39/(AK39+AL39)","AK":"AK24+Q39","AL":"AL24+R39","AM":"SUM(AK39:AL39)"}' }, { "Sheet": "chart_Printing", "Row": 40, "DataJSON": '{"J":4.68920625484085,"O":107.60577380952381,"P":2.206845238095238,"Q":14,"R":16,"S":30,"AD":8.957941913971162,"AI":56.00294033275961,"AJ":4.708835341365462,"AK":49,"AL":48}', "FormulaJSON": '{"J":"AVERAGE(J35:J39)","O":"AVERAGE(O35:O39)","P":"AVERAGE(P35:P39)","Q":"SUM(Q35:Q39)","R":"SUM(R35:R39)","S":"SUM(S35:S39)","AD":"AVERAGE(AD35:AD39)","AI":"AVERAGE(AI35:AI39)","AJ":"AVERAGE(AJ35:AJ39)","AK":"SUM(AK35:AK39)","AL":"SUM(AL35:AL39)"}' }, { "Sheet": "chart_Printing", "Row": 42, "DataJSON": '{"B":"Highlite Issue","V":"Highlite Issue"}', "FormulaJSON": "{}" }, { "Sheet": "chart_Printing", "Row": 43, "DataJSON": '{"C":"Mesin OFU-1","M":"OFS-8","W":"Mesin OFU-1","AG":"OFS-8"}', "FormulaJSON": "{}" }, { "Sheet": "chart_Printing", "Row": 45, "DataJSON": '{"C":"Issue -  ","M":" issue -","W":"Issue -  ","AG":" issue -"}', "FormulaJSON": "{}" }, { "Sheet": "chart_Printing", "Row": 47, "DataJSON": '{"A":"MTD","B":46113,"U":"YTD","V":46113}', "FormulaJSON": "{}" }, { "Sheet": "chart_Printing", "Row": 48, "DataJSON": '{"B":"Source: ODIN","V":"Source: ODIN"}', "FormulaJSON": "{}" }, { "Sheet": "chart_Printing", "Row": 49, "DataJSON": '{"B":"Mesin","C":"El BD","D":"Mech BD","E":"Total Lost","F":"Run Hrs","G":"Run Hrs + total lost","H":"%El","I":"%Mech","J":"% Total Lost","K":"MTBF EL","L":"MTTR EL","M":"MTBF Mech","N":"MTTR Mech","O":"MTBF Mch","P":"MTTR Mch","Q":"BD Events EL","R":"BD Event Mech","S":"Sum BD Evt","V":"Mesin","W":"El BD","X":"Mech BD","Y":"Total Lost","Z":"Run Hrs","AA":"Run Hrs + total lost","AB":"%El","AC":"%Mech","AD":"% Total Lost","AE":"MTBF EL","AF":"MTTR EL","AG":"MTBF Mech","AH":"MTTR Mech","AI":"MTBF Mch","AJ":"MTTR Mch","AK":"BD Events EL","AL":"BD Event Mech","AM":"Sum BD Evt"}', "FormulaJSON": "{}" }, { "Sheet": "chart_Printing", "Row": 50, "DataJSON": '{"B":"OFFSET - 4 MACHINE","S":0,"V":"OFFSET - 4 MACHINE","AM":0}', "FormulaJSON": '{"S":"SUM(Q50:R50)","AM":"SUM(AK50:AL50)"}' }, { "Sheet": "chart_Printing", "Row": 51, "DataJSON": '{"B":"OFFSET UV INK - 5 MACHINE","C":36.3333333333333,"D":58.5,"E":94.8333333333333,"F":513.62,"G":608.4533333333333,"H":7.073971678153752,"I":11.389743390054905,"J":18.463715068208657,"K":16.050625,"L":1.1354166666666656,"M":11.944651162790699,"N":1.3604651162790697,"O":8.11271111111111,"P":1.264444444444444,"Q":32,"R":43,"S":75,"V":"OFFSET UV INK - 5 MACHINE","W":81.41666666666663,"X":138,"Y":219.41666666666663,"Z":1958.62,"AA":2178.0366666666664,"AB":4.156838318135557,"AC":7.045777128794764,"AD":11.202615446930322,"AE":27.203055555555554,"AF":1.1307870370370365,"AG":22.774651162790697,"AH":1.6046511627906976,"AI":13.785042194092826,"AJ":1.3887130801687761,"AK":72,"AL":86,"AM":158}', "FormulaJSON": '{"E":"C51+D51","G":"F51+E51","H":"C51/F51*100","I":"D51/F51*100","J":"E51/F51*100","K":"F51/Q51","L":"C51/(Q51)","M":"F51/R51","N":"D51/(R51)","O":"G51/(Q51+R51)","P":"E51/(Q51+R51)","S":"SUM(Q51:R51)","W":"W36+C51","X":"X36+D51","Y":"W51+X51","Z":"Z36+F51","AA":"Z51+Y51","AB":"W51/Z51*100","AC":"X51/Z51*100","AD":"Y51/Z51*100","AE":"Z51/AK51","AF":"W51/(AK51)","AG":"Z51/AL51","AH":"X51/(AL51)","AI":"AA51/(AK51+AL51)","AJ":"Y51/(AK51+AL51)","AK":"AK36+Q51","AL":"AL36+R51","AM":"SUM(AK51:AL51)"}' }, { "Sheet": "chart_Printing", "Row": 52, "DataJSON": '{"B":"OFFSET - 6 MACHINE","S":0,"V":"OFFSET - 6 MACHINE","AM":0}', "FormulaJSON": '{"S":"SUM(Q52:R52)","AM":"SUM(AK52:AL52)"}' }, { "Sheet": "chart_Printing", "Row": 53, "DataJSON": '{"B":"SHEET FEED GRAVURE MACHINE","S":0,"V":"SHEET FEED GRAVURE MACHINE","AM":0}', "FormulaJSON": '{"S":"SUM(Q53:R53)","AM":"SUM(AK53:AL53)"}' }, { "Sheet": "chart_Printing", "Row": 54, "DataJSON": '{"B":"OFFSET - 8 MACHINE","C":20,"D":36.3666666666667,"E":56.3666666666667,"F":447.78,"G":504.14666666666665,"H":4.466479074545536,"I":8.121547783881974,"J":12.588026858427511,"K":49.75333333333333,"L":2.2222222222222223,"M":31.98428571428571,"N":2.5976190476190504,"O":21.919420289855072,"P":2.450724637681161,"Q":9,"R":14,"S":23,"V":"OFFSET - 8 MACHINE","W":107.50000000000003,"X":59.7,"Y":167.20000000000005,"Z":1640.28,"AA":1807.48,"AB":6.553759114297561,"AC":3.6396225034750165,"AD":10.193381617772578,"AE":91.12666666666667,"AF":5.972222222222224,"AG":86.33052631578947,"AH":3.142105263157895,"AI":48.85081081081081,"AJ":4.51891891891892,"AK":18,"AL":19,"AM":37}', "FormulaJSON": '{"E":"C54+D54","G":"F54+E54","H":"C54/F54*100","I":"D54/F54*100","J":"E54/F54*100","K":"F54/Q54","L":"C54/(Q54)","M":"F54/R54","N":"D54/(R54)","O":"G54/(Q54+R54)","P":"E54/(Q54+R54)","S":"SUM(Q54:R54)","W":"W39+C54","X":"X39+D54","Y":"W54+X54","Z":"Z39+F54","AA":"Z54+Y54","AB":"W54/Z54*100","AC":"X54/Z54*100","AD":"Y54/Z54*100","AE":"Z54/AK54","AF":"W54/(AK54)","AG":"Z54/AL54","AH":"X54/(AL54)","AI":"AA54/(AK54+AL54)","AJ":"Y54/(AK54+AL54)","AK":"AK39+Q54","AL":"AL39+R54","AM":"SUM(AK54:AL54)"}' }, { "Sheet": "chart_Printing", "Row": 55, "DataJSON": '{"J":15.525870963318084,"O":15.016065700483091,"P":1.8575845410628025,"Q":41,"R":57,"S":98,"AD":10.69799853235145,"AI":31.31792650245182,"AJ":2.953815999543848,"AK":90,"AL":105}', "FormulaJSON": '{"J":"AVERAGE(J50:J54)","O":"AVERAGE(O50:O54)","P":"AVERAGE(P50:P54)","Q":"SUM(Q50:Q54)","R":"SUM(R50:R54)","S":"SUM(S50:S54)","AD":"AVERAGE(AD50:AD54)","AI":"AVERAGE(AI50:AI54)","AJ":"AVERAGE(AJ50:AJ54)","AK":"SUM(AK50:AK54)","AL":"SUM(AL50:AL54)"}' }, { "Sheet": "chart_Printing", "Row": 57, "DataJSON": '{"B":"Highlite Issue","V":"Highlite Issue"}', "FormulaJSON": "{}" }, { "Sheet": "chart_Printing", "Row": 58, "DataJSON": '{"C":"Mesin OFU-1","M":"OFS-8","W":"Mesin OFU-1","AG":"OFS-8"}', "FormulaJSON": "{}" }, { "Sheet": "chart_Printing", "Row": 60, "DataJSON": '{"C":"Issue -  ","M":" issue -","W":"Issue -  ","AG":" issue -"}', "FormulaJSON": "{}" }, { "Sheet": "chart_Printing", "Row": 62, "DataJSON": '{"A":"MTD","B":46143,"U":"YTD","V":46143}', "FormulaJSON": '{"V":"B62"}' }, { "Sheet": "chart_Printing", "Row": 63, "DataJSON": '{"B":"Source: ODIN","V":"Source: ODIN"}', "FormulaJSON": "{}" }, { "Sheet": "chart_Printing", "Row": 64, "DataJSON": '{"B":"Mesin","C":"El BD","D":"Mech BD","E":"Total Lost","F":"Run Hrs","G":"Run Hrs + total lost","H":"%El","I":"%Mech","J":"% Total Lost","K":"MTBF EL","L":"MTTR EL","M":"MTBF Mech","N":"MTTR Mech","O":"MTBF Mch","P":"MTTR Mch","Q":"BD Events EL","R":"BD Event Mech","S":"Sum BD Evt","V":"Mesin","W":"El BD","X":"Mech BD","Y":"Total Lost","Z":"Run Hrs","AA":"Run Hrs + total lost","AB":"%El","AC":"%Mech","AD":"% Total Lost","AE":"MTBF EL","AF":"MTTR EL","AG":"MTBF Mech","AH":"MTTR Mech","AI":"MTBF Mch","AJ":"MTTR Mch","AK":"BD Events EL","AL":"BD Event Mech","AM":"Sum BD Evt"}', "FormulaJSON": "{}" }, { "Sheet": "chart_Printing", "Row": 65, "DataJSON": '{"B":"OFFSET - 4 MACHINE","S":0,"V":"OFFSET - 4 MACHINE","AM":0}', "FormulaJSON": '{"S":"SUM(Q65:R65)","AM":"SUM(AK65:AL65)"}' }, { "Sheet": "chart_Printing", "Row": 66, "DataJSON": '{"B":"OFFSET UV INK - 5 MACHINE","C":42.5,"D":18.9166666666667,"E":61.4166666666667,"F":521.21,"G":582.6266666666668,"H":8.154102952744575,"I":3.6293752358294546,"J":11.783478188574028,"K":14.478055555555557,"L":1.1805555555555556,"M":22.66130434782609,"N":0.8224637681159435,"O":9.875028248587572,"P":1.0409604519774016,"Q":36,"R":23,"S":59,"V":"OFFSET UV INK - 5 MACHINE","W":123.91666666666663,"X":156.91666666666669,"Y":280.8333333333333,"Z":2479.83,"AA":2760.6633333333334,"AB":4.996982320024624,"AC":6.327718701147527,"AD":11.32470102117215,"AE":22.961388888888887,"AF":1.1473765432098761,"AG":22.750733944954128,"AH":1.4396024464831807,"AI":12.72195084485407,"AJ":1.2941628264208909,"AK":108,"AL":109,"AM":217}', "FormulaJSON": '{"E":"C66+D66","G":"F66+E66","H":"C66/F66*100","I":"D66/F66*100","J":"E66/F66*100","K":"F66/Q66","L":"C66/(Q66)","M":"F66/R66","N":"D66/(R66)","O":"G66/(Q66+R66)","P":"E66/(Q66+R66)","S":"SUM(Q66:R66)","W":"W51+C66","X":"X51+D66","Y":"W66+X66","Z":"Z51+F66","AA":"Z66+Y66","AB":"W66/Z66*100","AC":"X66/Z66*100","AD":"Y66/Z66*100","AE":"Z66/AK66","AF":"W66/(AK66)","AG":"Z66/AL66","AH":"X66/(AL66)","AI":"AA66/(AK66+AL66)","AJ":"Y66/(AK66+AL66)","AK":"AK51+Q66","AL":"AL51+R66","AM":"SUM(AK66:AL66)"}' }, { "Sheet": "chart_Printing", "Row": 67, "DataJSON": '{"B":"OFFSET - 6 MACHINE","S":0,"V":"OFFSET - 6 MACHINE","AM":0}', "FormulaJSON": '{"S":"SUM(Q67:R67)","AM":"SUM(AK67:AL67)"}' }, { "Sheet": "chart_Printing", "Row": 68, "DataJSON": '{"B":"SHEET FEED GRAVURE MACHINE","S":0,"V":"SHEET FEED GRAVURE MACHINE","AM":0}', "FormulaJSON": '{"S":"SUM(Q68:R68)","AM":"SUM(AK68:AL68)"}' }, { "Sheet": "chart_Printing", "Row": 69, "DataJSON": '{"B":"OFFSET - 8 MACHINE","C":12.6666666666667,"D":2.66666666666667,"E":15.33333333333337,"F":442.64,"G":457.97333333333336,"H":2.8616181697692706,"I":0.6024459304777404,"J":3.4640641002470116,"K":34.04923076923077,"L":0.9743589743589769,"M":221.32,"N":1.333333333333335,"O":30.531555555555556,"P":1.0222222222222246,"Q":13,"R":2,"S":15,"V":"OFFSET - 8 MACHINE","W":120.16666666666673,"X":62.366666666666674,"Y":182.53333333333342,"Z":2082.92,"AA":2265.4533333333334,"AB":5.769144598288303,"AC":2.994194048099143,"AD":8.763338646387448,"AE":67.19096774193548,"AF":3.8763440860215073,"AG":99.18666666666667,"AH":2.9698412698412704,"AI":43.56641025641026,"AJ":3.510256410256412,"AK":31,"AL":21,"AM":52}', "FormulaJSON": '{"E":"C69+D69","G":"F69+E69","H":"C69/F69*100","I":"D69/F69*100","J":"E69/F69*100","K":"F69/Q69","L":"C69/(Q69)","M":"F69/R69","N":"D69/(R69)","O":"G69/(Q69+R69)","P":"E69/(Q69+R69)","S":"SUM(Q69:R69)","W":"W54+C69","X":"X54+D69","Y":"W69+X69","Z":"Z54+F69","AA":"Z69+Y69","AB":"W69/Z69*100","AC":"X69/Z69*100","AD":"Y69/Z69*100","AE":"Z69/AK69","AF":"W69/(AK69)","AG":"Z69/AL69","AH":"X69/(AL69)","AI":"AA69/(AK69+AL69)","AJ":"Y69/(AK69+AL69)","AK":"AK54+Q69","AL":"AL54+R69","AM":"SUM(AK69:AL69)"}' }, { "Sheet": "chart_Printing", "Row": 70, "DataJSON": '{"J":7.62377114441052,"O":20.203291902071562,"P":1.031591337099813,"Q":49,"R":25,"S":74,"AD":10.0440198337798,"AI":28.144180550632164,"AJ":2.4022096183386514,"AK":139,"AL":130}', "FormulaJSON": '{"J":"AVERAGE(J65:J69)","O":"AVERAGE(O65:O69)","P":"AVERAGE(P65:P69)","Q":"SUM(Q65:Q69)","R":"SUM(R65:R69)","S":"SUM(S65:S69)","AD":"AVERAGE(AD65:AD69)","AI":"AVERAGE(AI65:AI69)","AJ":"AVERAGE(AJ65:AJ69)","AK":"SUM(AK65:AK69)","AL":"SUM(AL65:AL69)"}' }, { "Sheet": "chart_Printing", "Row": 72, "DataJSON": '{"B":"Highlite Issue","V":"Highlite Issue"}', "FormulaJSON": "{}" }, { "Sheet": "chart_Printing", "Row": 73, "DataJSON": '{"C":"Mesin OFU-1","M":"OFS-8","W":"Mesin OFU-1","AG":"OFS-8"}', "FormulaJSON": "{}" }, { "Sheet": "chart_Printing", "Row": 75, "DataJSON": '{"C":"Issue -  ","M":" issue -","W":"Issue -  ","AG":" issue -"}', "FormulaJSON": "{}" }, { "Sheet": "chart_Printing", "Row": 77, "DataJSON": '{"A":"MTD","B":46174,"U":"YTD","V":46174}', "FormulaJSON": '{"V":"B77"}' }, { "Sheet": "chart_Printing", "Row": 78, "DataJSON": '{"B":"Source: ODIN","V":"Source: ODIN"}', "FormulaJSON": "{}" }, { "Sheet": "chart_Printing", "Row": 79, "DataJSON": '{"B":"Mesin","C":"El BD","D":"Mech BD","E":"Total Lost","F":"Run Hrs","G":"Run Hrs + total lost","H":"%El","I":"%Mech","J":"% Total Lost","K":"MTBF EL","L":"MTTR EL","M":"MTBF Mech","N":"MTTR Mech","O":"MTBF Mch","P":"MTTR Mch","Q":"BD Events EL","R":"BD Event Mech","S":"Sum BD Evt","V":"Mesin","W":"El BD","X":"Mech BD","Y":"Total Lost","Z":"Run Hrs","AA":"Run Hrs + total lost","AB":"%El","AC":"%Mech","AD":"% Total Lost","AE":"MTBF EL","AF":"MTTR EL","AG":"MTBF Mech","AH":"MTTR Mech","AI":"MTBF Mch","AJ":"MTTR Mch","AK":"BD Events EL","AL":"BD Event Mech","AM":"Sum BD Evt"}', "FormulaJSON": "{}" }, { "Sheet": "chart_Printing", "Row": 80, "DataJSON": '{"B":"OFFSET - 4 MACHINE","S":0,"V":"OFFSET - 4 MACHINE","AM":0}', "FormulaJSON": '{"S":"SUM(Q80:R80)","AM":"SUM(AK80:AL80)"}' }, { "Sheet": "chart_Printing", "Row": 81, "DataJSON": '{"B":"OFFSET UV INK - 5 MACHINE","C":46.1666666666667,"D":28.75,"E":74.9166666666667,"F":513.7,"G":588.6166666666668,"H":8.987087145545395,"I":5.59665174226202,"J":14.583738887807415,"K":36.69285714285714,"L":3.29761904761905,"M":21.40416666666667,"N":1.1979166666666667,"O":15.489912280701757,"P":1.9714912280701764,"Q":14,"R":24,"S":38,"V":"OFFSET UV INK - 5 MACHINE","W":170.08333333333331,"X":185.66666666666669,"Y":355.75,"Z":2993.5299999999997,"AA":3349.2799999999997,"AB":5.681697973073038,"AC":6.202265107303641,"AD":11.883963080376681,"AE":24.537131147540983,"AF":1.3941256830601092,"AG":22.507744360902254,"AH":1.3959899749373434,"AI":13.134431372549018,"AJ":1.3950980392156862,"AK":122,"AL":133,"AM":255}', "FormulaJSON": '{"E":"C81+D81","G":"F81+E81","H":"C81/F81*100","I":"D81/F81*100","J":"E81/F81*100","K":"F81/Q81","L":"C81/(Q81)","M":"F81/R81","N":"D81/(R81)","O":"G81/(Q81+R81)","P":"E81/(Q81+R81)","S":"SUM(Q81:R81)","W":"W66+C81","X":"X66+D81","Y":"W81+X81","Z":"Z66+F81","AA":"Z81+Y81","AB":"W81/Z81*100","AC":"X81/Z81*100","AD":"Y81/Z81*100","AE":"Z81/AK81","AF":"W81/(AK81)","AG":"Z81/AL81","AH":"X81/(AL81)","AI":"AA81/(AK81+AL81)","AJ":"Y81/(AK81+AL81)","AK":"AK66+Q81","AL":"AL66+R81","AM":"SUM(AK81:AL81)"}' }, { "Sheet": "chart_Printing", "Row": 82, "DataJSON": '{"B":"OFFSET - 6 MACHINE","S":0,"V":"OFFSET - 6 MACHINE","AM":0}', "FormulaJSON": '{"S":"SUM(Q82:R82)","AM":"SUM(AK82:AL82)"}' }, { "Sheet": "chart_Printing", "Row": 83, "DataJSON": '{"B":"SHEET FEED GRAVURE MACHINE","S":0,"V":"SHEET FEED GRAVURE MACHINE","AM":0}', "FormulaJSON": '{"S":"SUM(Q83:R83)","AM":"SUM(AK83:AL83)"}' }, { "Sheet": "chart_Printing", "Row": 84, "DataJSON": '{"B":"OFFSET - 8 MACHINE","C":34.9166666666667,"D":0,"E":34.9166666666667,"F":481.71,"G":516.6266666666667,"H":7.248482835454256,"I":0,"J":7.248482835454256,"K":60.21375,"L":4.3645833333333375,"M":"#DIV/0!","N":"#DIV/0!","O":64.57833333333333,"P":4.3645833333333375,"Q":8,"R":0,"S":8,"V":"OFFSET - 8 MACHINE","W":155.08333333333343,"X":62.366666666666674,"Y":217.4500000000001,"Z":2564.63,"AA":2782.0800000000004,"AB":6.04700613083889,"AC":2.431799778785504,"AD":8.478805909624395,"AE":65.7597435897436,"AF":3.976495726495729,"AG":122.1252380952381,"AH":2.9698412698412704,"AI":46.36800000000001,"AJ":3.6241666666666683,"AK":39,"AL":21,"AM":60}', "FormulaJSON": '{"E":"C84+D84","G":"F84+E84","H":"C84/F84*100","I":"D84/F84*100","J":"E84/F84*100","K":"F84/Q84","L":"C84/(Q84)","M":"F84/R84","N":"D84/(R84)","O":"G84/(Q84+R84)","P":"E84/(Q84+R84)","S":"SUM(Q84:R84)","W":"W69+C84","X":"X69+D84","Y":"W84+X84","Z":"Z69+F84","AA":"Z84+Y84","AB":"W84/Z84*100","AC":"X84/Z84*100","AD":"Y84/Z84*100","AE":"Z84/AK84","AF":"W84/(AK84)","AG":"Z84/AL84","AH":"X84/(AL84)","AI":"AA84/(AK84+AL84)","AJ":"Y84/(AK84+AL84)","AK":"AK69+Q84","AL":"AL69+R84","AM":"SUM(AK84:AL84)"}' }, { "Sheet": "chart_Printing", "Row": 85, "DataJSON": '{"J":10.916110861630836,"O":40.034122807017546,"P":3.168037280701757,"Q":22,"R":24,"S":46,"AD":10.181384495000538,"AI":29.751215686274513,"AJ":2.5096323529411775,"AK":161,"AL":154}', "FormulaJSON": '{"J":"AVERAGE(J80:J84)","O":"AVERAGE(O80:O84)","P":"AVERAGE(P80:P84)","Q":"SUM(Q80:Q84)","R":"SUM(R80:R84)","S":"SUM(S80:S84)","AD":"AVERAGE(AD80:AD84)","AI":"AVERAGE(AI80:AI84)","AJ":"AVERAGE(AJ80:AJ84)","AK":"SUM(AK80:AK84)","AL":"SUM(AL80:AL84)"}' }, { "Sheet": "chart_Printing", "Row": 87, "DataJSON": '{"B":"Highlite Issue","V":"Highlite Issue"}', "FormulaJSON": "{}" }, { "Sheet": "chart_Printing", "Row": 88, "DataJSON": '{"C":"Mesin OFU-1","M":"OFS-8","W":"Mesin OFU-1","AG":"OFS-8"}', "FormulaJSON": "{}" }, { "Sheet": "chart_Printing", "Row": 90, "DataJSON": '{"C":"Issue -  ","M":" issue -","W":"Issue -  ","AG":" issue -"}', "FormulaJSON": "{}" }, { "Sheet": "chart_Printing", "Row": 92, "DataJSON": '{"A":"MTD","B":46204,"U":"YTD","V":46204}', "FormulaJSON": '{"V":"B92"}' }, { "Sheet": "chart_Printing", "Row": 93, "DataJSON": '{"B":"Source: ODIN","V":"Source: ODIN"}', "FormulaJSON": "{}" }, { "Sheet": "chart_Printing", "Row": 94, "DataJSON": '{"B":"Mesin","C":"El BD","D":"Mech BD","E":"Total Lost","F":"Run Hrs","G":"Run Hrs + total lost","H":"%El","I":"%Mech","J":"% Total Lost","K":"MTBF EL","L":"MTTR EL","M":"MTBF Mech","N":"MTTR Mech","O":"MTBF Mch","P":"MTTR Mch","Q":"BD Events EL","R":"BD Event Mech","S":"Sum BD Evt","V":"Mesin","W":"El BD","X":"Mech BD","Y":"Total Lost","Z":"Run Hrs","AA":"Run Hrs + total lost","AB":"%El","AC":"%Mech","AD":"% Total Lost","AE":"MTBF EL","AF":"MTTR EL","AG":"MTBF Mech","AH":"MTTR Mech","AI":"MTBF Mch","AJ":"MTTR Mch","AK":"BD Events EL","AL":"BD Event Mech","AM":"Sum BD Evt"}', "FormulaJSON": "{}" }, { "Sheet": "chart_Printing", "Row": 95, "DataJSON": '{"B":"OFFSET - 4 MACHINE","S":0,"V":"OFFSET - 4 MACHINE","AM":0}', "FormulaJSON": '{"S":"SUM(Q95:R95)","AM":"SUM(AK95:AL95)"}' }, { "Sheet": "chart_Printing", "Row": 96, "DataJSON": '{"B":"OFFSET UV INK - 5 MACHINE","C":1.83333333333333,"D":16.5,"E":18.33333333333333,"F":308.86,"G":327.1933333333333,"H":0.5935806945973353,"I":5.342226251376028,"J":5.935806945973362,"K":77.215,"L":0.4583333333333325,"M":16.25578947368421,"N":0.868421052631579,"O":14.225797101449276,"P":0.7971014492753621,"Q":4,"R":19,"S":23,"V":"OFFSET UV INK - 5 MACHINE","W":171.91666666666666,"X":202.16666666666669,"Y":374.08333333333337,"Z":3302.39,"AA":3676.4733333333334,"AB":5.205825679785448,"AC":6.12182893803175,"AD":11.327654617817199,"AE":26.209444444444443,"AF":1.3644179894179893,"AG":21.72625,"AH":1.3300438596491229,"AI":13.224724220623502,"AJ":1.345623501199041,"AK":126,"AL":152,"AM":278}', "FormulaJSON": '{"E":"C96+D96","G":"F96+E96","H":"C96/F96*100","I":"D96/F96*100","J":"E96/F96*100","K":"F96/Q96","L":"C96/(Q96)","M":"F96/R96","N":"D96/(R96)","O":"G96/(Q96+R96)","P":"E96/(Q96+R96)","S":"SUM(Q96:R96)","W":"W81+C96","X":"X81+D96","Y":"W96+X96","Z":"Z81+F96","AA":"Z96+Y96","AB":"W96/Z96*100","AC":"X96/Z96*100","AD":"Y96/Z96*100","AE":"Z96/AK96","AF":"W96/(AK96)","AG":"Z96/AL96","AH":"X96/(AL96)","AI":"AA96/(AK96+AL96)","AJ":"Y96/(AK96+AL96)","AK":"AK81+Q96","AL":"AL81+R96","AM":"SUM(AK96:AL96)"}' }, { "Sheet": "chart_Printing", "Row": 97, "DataJSON": '{"B":"OFFSET - 6 MACHINE","S":0,"V":"OFFSET - 6 MACHINE","AM":0}', "FormulaJSON": '{"S":"SUM(Q97:R97)","AM":"SUM(AK97:AL97)"}' }, { "Sheet": "chart_Printing", "Row": 98, "DataJSON": '{"B":"SHEET FEED GRAVURE MACHINE","S":0,"V":"SHEET FEED GRAVURE MACHINE","AM":0}', "FormulaJSON": '{"S":"SUM(Q98:R98)","AM":"SUM(AK98:AL98)"}' }, { "Sheet": "chart_Printing", "Row": 99, "DataJSON": '{"B":"OFFSET - 8 MACHINE","C":3.41666666666667,"D":4.75,"E":8.16666666666667,"F":438.83,"G":446.99666666666667,"H":0.7785854810898686,"I":1.0824237176127431,"J":1.8610091987026116,"K":87.76599999999999,"L":0.683333333333334,"M":109.7075,"N":1.1875,"O":49.666296296296295,"P":0.9074074074074078,"Q":5,"R":4,"S":9,"V":"OFFSET - 8 MACHINE","W":158.50000000000009,"X":67.11666666666667,"Y":225.61666666666676,"Z":3003.46,"AA":3229.076666666667,"AB":5.277246908565457,"AC":2.2346449317342887,"AD":7.5118918402997465,"AE":68.26045454545455,"AF":3.6022727272727293,"AG":120.1384,"AH":2.6846666666666668,"AI":46.798212560386474,"AJ":3.2698067632850254,"AK":44,"AL":25,"AM":69}', "FormulaJSON": '{"E":"C99+D99","G":"F99+E99","H":"C99/F99*100","I":"D99/F99*100","J":"E99/F99*100","K":"F99/Q99","L":"C99/(Q99)","M":"F99/R99","N":"D99/(R99)","O":"G99/(Q99+R99)","P":"E99/(Q99+R99)","S":"SUM(Q99:R99)","W":"W84+C99","X":"X84+D99","Y":"W99+X99","Z":"Z84+F99","AA":"Z99+Y99","AB":"W99/Z99*100","AC":"X99/Z99*100","AD":"Y99/Z99*100","AE":"Z99/AK99","AF":"W99/(AK99)","AG":"Z99/AL99","AH":"X99/(AL99)","AI":"AA99/(AK99+AL99)","AJ":"Y99/(AK99+AL99)","AK":"AK84+Q99","AL":"AL84+R99","AM":"SUM(AK99:AL99)"}' }, { "Sheet": "chart_Printing", "Row": 100, "DataJSON": '{"J":3.898408072337987,"O":31.946046698872784,"P":0.8522544283413849,"Q":9,"R":23,"S":32,"AD":9.419773229058473,"AI":30.011468390504987,"AJ":2.3077151322420333,"AK":170,"AL":177}', "FormulaJSON": '{"J":"AVERAGE(J95:J99)","O":"AVERAGE(O95:O99)","P":"AVERAGE(P95:P99)","Q":"SUM(Q95:Q99)","R":"SUM(R95:R99)","S":"SUM(S95:S99)","AD":"AVERAGE(AD95:AD99)","AI":"AVERAGE(AI95:AI99)","AJ":"AVERAGE(AJ95:AJ99)","AK":"SUM(AK95:AK99)","AL":"SUM(AL95:AL99)"}' }, { "Sheet": "chart_Printing", "Row": 102, "DataJSON": '{"B":"Highlite Issue","V":"Highlite Issue"}', "FormulaJSON": "{}" }, { "Sheet": "chart_Printing", "Row": 103, "DataJSON": '{"C":"Mesin OFU-1","M":"OFS-8","W":"Mesin OFU-1","AG":"OFS-8"}', "FormulaJSON": "{}" }, { "Sheet": "chart_Printing", "Row": 105, "DataJSON": '{"C":"Issue -  ","M":" issue -","W":"Issue -  ","AG":" issue -"}', "FormulaJSON": "{}" }, { "Sheet": "visual chart_Printing MTD", "Row": 2, "DataJSON": '{"K":"Lost time (Hours)"}', "FormulaJSON": "{}" }, { "Sheet": "visual chart_Printing MTD", "Row": 3, "DataJSON": '{"B":"Month","C":"OFS 5 MTBF (Hrs)","D":"SHEET FEED GRAVURE MACHINE","E":"OFS 8 MTBF (Hrs)","F":"Target","G":"OFS 5 Run (Hrs)","H":"OFS 5 BD (Evt)","I":"OFS 8 Run (Hrs)","J":"OFS 8 BD (Evt)","K":"OFS 8 Elec BD","L":"OFS 8 Mech BD","M":"Target","N":"MTTR OFU1","O":"MTTR OFS8","P":"Target"}', "FormulaJSON": "{}" }, { "Sheet": "visual chart_Printing MTD", "Row": 4, "DataJSON": '{"B":"Jan","C":"#REF!","D":"#REF!","E":"#REF!","F":56.19,"G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":0.05,"N":"#REF!","O":"#REF!","P":0.98}', "FormulaJSON": '{"C":"chart_Printing!#REF!","D":"chart_Printing!#REF!","E":"chart_Printing!#REF!","G":"chart_Printing!#REF!","H":"chart_Printing!#REF!","I":"chart_Printing!#REF!","J":"chart_Printing!#REF!","K":"chart_Printing!#REF!","L":"chart_Printing!#REF!","N":"chart_Printing!#REF!","O":"chart_Printing!#REF!"}' }, { "Sheet": "visual chart_Printing MTD", "Row": 5, "DataJSON": '{"B":"Feb","C":"#REF!","D":"#REF!","E":"#REF!","F":56.19,"G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":0.05,"N":"#REF!","O":"#REF!","P":0.98}', "FormulaJSON": '{"C":"chart_Printing!#REF!","D":"chart_Printing!#REF!","E":"chart_Printing!#REF!","G":"chart_Printing!#REF!","H":"chart_Printing!#REF!","I":"chart_Printing!#REF!","J":"chart_Printing!#REF!","K":"chart_Printing!#REF!","L":"chart_Printing!#REF!","N":"chart_Printing!#REF!","O":"chart_Printing!#REF!"}' }, { "Sheet": "visual chart_Printing MTD", "Row": 6, "DataJSON": '{"B":"Mar","C":"#REF!","D":"#REF!","E":"#REF!","F":56.19,"G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":0.05,"N":"#REF!","O":"#REF!","P":0.98}', "FormulaJSON": '{"C":"chart_Printing!#REF!","D":"chart_Printing!#REF!","E":"chart_Printing!#REF!","G":"chart_Printing!#REF!","H":"chart_Printing!#REF!","I":"chart_Printing!#REF!","J":"chart_Printing!#REF!","K":"chart_Printing!#REF!","L":"chart_Printing!#REF!","N":"chart_Printing!#REF!","O":"chart_Printing!#REF!"}' }, { "Sheet": "visual chart_Printing MTD", "Row": 7, "DataJSON": '{"B":"Apr","C":"#REF!","D":"#REF!","E":"#REF!","F":57.19,"G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":0.05,"N":"#REF!","O":"#REF!","P":1.98}', "FormulaJSON": '{"C":"chart_Printing!#REF!","D":"chart_Printing!#REF!","E":"chart_Printing!#REF!","G":"chart_Printing!#REF!","H":"chart_Printing!#REF!","I":"chart_Printing!#REF!","J":"chart_Printing!#REF!","K":"chart_Printing!#REF!","L":"chart_Printing!#REF!","N":"chart_Printing!#REF!","O":"chart_Printing!#REF!"}' }, { "Sheet": "visual chart_Printing MTD", "Row": 8, "DataJSON": '{"B":"Mei","C":"#REF!","D":"#REF!","E":"#REF!","F":58.19,"G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":0.05,"N":"#REF!","O":"#REF!","P":2.98}', "FormulaJSON": '{"C":"chart_Printing!#REF!","D":"chart_Printing!#REF!","E":"chart_Printing!#REF!","G":"chart_Printing!#REF!","H":"chart_Printing!#REF!","I":"chart_Printing!#REF!","J":"chart_Printing!#REF!","K":"chart_Printing!#REF!","L":"chart_Printing!#REF!","N":"chart_Printing!#REF!","O":"chart_Printing!#REF!"}' }, { "Sheet": "visual chart_Printing MTD", "Row": 9, "DataJSON": '{"B":"Jun","C":"#REF!","D":"#REF!","E":"#REF!","F":59.19,"G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":0.05,"N":"#REF!","O":"#REF!","P":3.98}', "FormulaJSON": '{"C":"chart_Printing!#REF!","D":"chart_Printing!#REF!","E":"chart_Printing!#REF!","G":"chart_Printing!#REF!","H":"chart_Printing!#REF!","I":"chart_Printing!#REF!","J":"chart_Printing!#REF!","K":"chart_Printing!#REF!","L":"chart_Printing!#REF!","N":"chart_Printing!#REF!","O":"chart_Printing!#REF!"}' }, { "Sheet": "visual chart_Printing MTD", "Row": 10, "DataJSON": '{"B":"Jul","C":"#REF!","D":"#REF!","E":"#REF!","F":60.19,"G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":0.05,"N":"#REF!","O":"#REF!","P":4.98}', "FormulaJSON": '{"C":"chart_Printing!#REF!","D":"chart_Printing!#REF!","E":"chart_Printing!#REF!","G":"chart_Printing!#REF!","H":"chart_Printing!#REF!","I":"chart_Printing!#REF!","J":"chart_Printing!#REF!","K":"chart_Printing!#REF!","L":"chart_Printing!#REF!","N":"chart_Printing!#REF!","O":"chart_Printing!#REF!"}' }, { "Sheet": "visual chart_Printing MTD", "Row": 11, "DataJSON": '{"B":"Augt","C":"#REF!","D":"#REF!","E":"#REF!","F":61.19,"G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":0.05,"N":"#REF!","O":"#REF!","P":5.98}', "FormulaJSON": '{"C":"chart_Printing!#REF!","D":"chart_Printing!#REF!","E":"chart_Printing!#REF!","G":"chart_Printing!#REF!","H":"chart_Printing!#REF!","I":"chart_Printing!#REF!","J":"chart_Printing!#REF!","K":"chart_Printing!#REF!","L":"chart_Printing!#REF!","N":"chart_Printing!#REF!","O":"chart_Printing!#REF!"}' }, { "Sheet": "visual chart_Printing MTD", "Row": 12, "DataJSON": '{"B":"Sept","C":"#REF!","D":"#REF!","E":"#REF!","F":62.19,"G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":0.05,"N":"#REF!","O":"#REF!","P":6.98}', "FormulaJSON": '{"C":"chart_Printing!#REF!","D":"chart_Printing!#REF!","E":"chart_Printing!#REF!","G":"chart_Printing!#REF!","H":"chart_Printing!#REF!","I":"chart_Printing!#REF!","J":"chart_Printing!#REF!","K":"chart_Printing!#REF!","L":"chart_Printing!#REF!","N":"chart_Printing!#REF!","O":"chart_Printing!#REF!"}' }, { "Sheet": "visual chart_Printing MTD", "Row": 13, "DataJSON": '{"B":"Okt","C":"#REF!","D":"#REF!","E":"#REF!","F":63.19,"G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":0.05,"N":"#REF!","O":"#REF!","P":7.98}', "FormulaJSON": '{"C":"chart_Printing!#REF!","D":"chart_Printing!#REF!","E":"chart_Printing!#REF!","G":"chart_Printing!#REF!","H":"chart_Printing!#REF!","I":"chart_Printing!#REF!","J":"chart_Printing!#REF!","K":"chart_Printing!#REF!","L":"chart_Printing!#REF!","N":"chart_Printing!#REF!","O":"chart_Printing!#REF!"}' }, { "Sheet": "visual chart_Printing MTD", "Row": 14, "DataJSON": '{"C":"#REF!","D":"#REF!","E":"#REF!","F":64.19,"G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":0.05,"N":"#REF!","O":"#REF!","P":8.98}', "FormulaJSON": '{"C":"chart_Printing!#REF!","D":"chart_Printing!#REF!","E":"chart_Printing!#REF!","G":"chart_Printing!#REF!","H":"chart_Printing!#REF!","I":"chart_Printing!#REF!","J":"chart_Printing!#REF!","K":"chart_Printing!#REF!","L":"chart_Printing!#REF!","N":"chart_Printing!#REF!","O":"chart_Printing!#REF!"}' }, { "Sheet": "visual chart_Printing MTD", "Row": 15, "DataJSON": '{"B":"Apr","C":"#REF!","E":"#REF!","F":56.19,"G":"#REF!","I":"#REF!","J":4,"K":"=","M":0.05,"N":"#REF!","O":"#REF!","P":0.98}', "FormulaJSON": '{"C":"chart_Printing!#REF!","E":"chart_Printing!#REF!","G":"chart_Printing!#REF!","I":"chart_Printing!#REF!","N":"chart_Printing!#REF!","O":"chart_Printing!#REF!"}' }, { "Sheet": "visual chart_Printing MTD", "Row": 16, "DataJSON": '{"B":"Mei","C":"#REF!","E":"#REF!","F":56.19,"G":"#REF!","I":"#REF!","J":3,"M":0.05,"N":"#REF!","O":"#REF!","P":0.98}', "FormulaJSON": '{"C":"chart_Printing!#REF!","E":"chart_Printing!#REF!","G":"chart_Printing!#REF!","I":"chart_Printing!#REF!","N":"chart_Printing!#REF!","O":"chart_Printing!#REF!"}' }, { "Sheet": "visual chart_Printing MTD", "Row": 17, "DataJSON": '{"B":"Jun","C":"#REF!","E":"#REF!","F":56.19,"G":"#REF!","I":"#REF!","J":2,"M":0.05,"N":"#REF!","O":"#REF!","P":0.98}', "FormulaJSON": '{"C":"chart_Printing!#REF!","E":"chart_Printing!#REF!","G":"chart_Printing!#REF!","I":"chart_Printing!#REF!","N":"chart_Printing!#REF!","O":"chart_Printing!#REF!"}' }, { "Sheet": "visual chart_Printing MTD", "Row": 18, "DataJSON": '{"B":"Jul","C":"#REF!","E":"#REF!","F":56.19,"G":"#REF!","I":"#REF!","J":2,"M":0.05,"N":"#REF!","O":"#REF!","P":0.98}', "FormulaJSON": '{"C":"chart_Printing!#REF!","E":"chart_Printing!#REF!","G":"chart_Printing!#REF!","I":"chart_Printing!#REF!","N":"chart_Printing!#REF!","O":"chart_Printing!#REF!"}' }, { "Sheet": "visual chart_Printing MTD", "Row": 19, "DataJSON": '{"B":"Aug","C":"#REF!","E":"#REF!","F":56.19,"G":"#REF!","I":"#REF!","J":3,"M":0.05,"N":"#REF!","O":"#REF!","P":0.98}', "FormulaJSON": '{"C":"chart_Printing!#REF!","E":"chart_Printing!#REF!","G":"chart_Printing!#REF!","I":"chart_Printing!#REF!","N":"chart_Printing!#REF!","O":"chart_Printing!#REF!"}' }, { "Sheet": "visual chart_Printing MTD", "Row": 20, "DataJSON": '{"B":"Sep","C":40.39,"E":"#REF!","F":56.19,"G":"#REF!","I":"#REF!","J":1,"M":0.05,"N":"#REF!","O":"#REF!","P":0.98}', "FormulaJSON": '{"E":"chart_Printing!#REF!","G":"chart_Printing!#REF!","I":"chart_Printing!#REF!","N":"chart_Printing!#REF!","O":"chart_Printing!#REF!"}' }, { "Sheet": "visual chart_Printing MTD", "Row": 21, "DataJSON": '{"B":"Okt","C":43.81,"E":"#REF!","F":56.19,"G":"#REF!","I":"#REF!","J":4,"M":0.05,"N":0.82,"O":"#REF!","P":0.98}', "FormulaJSON": '{"E":"chart_Printing!#REF!","G":"chart_Printing!#REF!","I":"chart_Printing!#REF!","O":"chart_Printing!#REF!"}' }, { "Sheet": "visual chart_Printing MTD", "Row": 26, "DataJSON": '{"B":"Jan"}', "FormulaJSON": "{}" }, { "Sheet": "visual chart_Printing MTD", "Row": 27, "DataJSON": '{"B":"Feb"}', "FormulaJSON": "{}" }, { "Sheet": "visual chart_Printing MTD", "Row": 28, "DataJSON": '{"B":"Mar"}', "FormulaJSON": "{}" }, { "Sheet": "visual chart_Printing MTD", "Row": 29, "DataJSON": '{"B":"Apr"}', "FormulaJSON": "{}" }, { "Sheet": "visual chart_Printing MTD", "Row": 30, "DataJSON": '{"B":"Mei"}', "FormulaJSON": "{}" }, { "Sheet": "visual chart_Printing MTD", "Row": 31, "DataJSON": '{"B":"Jun"}', "FormulaJSON": "{}" }, { "Sheet": "visual chart_Printing YTD", "Row": 2, "DataJSON": '{"K":"Lost time (Hours)"}', "FormulaJSON": "{}" }, { "Sheet": "visual chart_Printing YTD", "Row": 3, "DataJSON": '{"B":"Month","C":"OFS 5 MTBF (Hrs)","D":"SHEET FEED GRAVURE MACHINE","E":"OFS 8 MTBF (Hrs)","F":"Target","G":"OFS 5 Run (Hrs)","H":"OFS 5 BD (Evt)","I":"OFS 8 Run (Hrs)","J":"OFS 8 BD (Evt)","K":"OFS 8 Elec BD","L":"OFS 8 Mech BD","M":"Target","N":"MTTR OFS5","O":"MTTR OFS8","P":"Target"}', "FormulaJSON": "{}" }, { "Sheet": "visual chart_Printing YTD", "Row": 4, "DataJSON": '{"B":"Jan","C":"#REF!","D":"#REF!","E":146,"F":56.19,"G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":0.05,"N":"#REF!","O":"#REF!","P":0.98}', "FormulaJSON": '{"C":"chart_Printing!#REF!","D":"chart_Printing!#REF!","G":"chart_Printing!#REF!","H":"chart_Printing!#REF!","I":"chart_Printing!#REF!","J":"chart_Printing!#REF!","K":"chart_Printing!#REF!","L":"chart_Printing!#REF!","N":"chart_Printing!#REF!","O":"chart_Printing!#REF!"}' }, { "Sheet": "visual chart_Printing YTD", "Row": 5, "DataJSON": '{"B":"Feb","C":"#REF!","D":"#REF!","E":"#REF!","F":56.19,"G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","N":"#REF!","O":"#REF!","P":0.98}', "FormulaJSON": '{"C":"chart_Printing!#REF!","D":"chart_Printing!#REF!","E":"chart_Printing!#REF!","G":"chart_Printing!#REF!","H":"chart_Printing!#REF!","I":"chart_Printing!#REF!","J":"chart_Printing!#REF!","K":"chart_Printing!#REF!","L":"chart_Printing!#REF!","N":"chart_Printing!#REF!","O":"chart_Printing!#REF!"}' }, { "Sheet": "visual chart_Printing YTD", "Row": 6, "DataJSON": '{"B":"Mar","C":"#REF!","D":"#REF!","E":"#REF!","F":56.19,"G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","N":"#REF!","O":"#REF!","P":0.98}', "FormulaJSON": '{"C":"chart_Printing!#REF!","D":"chart_Printing!#REF!","E":"chart_Printing!#REF!","G":"chart_Printing!#REF!","H":"chart_Printing!#REF!","I":"chart_Printing!#REF!","J":"chart_Printing!#REF!","K":"chart_Printing!#REF!","L":"chart_Printing!#REF!","N":"chart_Printing!#REF!","O":"chart_Printing!#REF!"}' }, { "Sheet": "visual chart_Printing YTD", "Row": 7, "DataJSON": '{"B":"Apr","C":"#REF!","D":"#REF!","E":"#REF!","F":56.19,"G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","N":"#REF!","O":"#REF!","P":0.98}', "FormulaJSON": '{"C":"chart_Printing!#REF!","D":"chart_Printing!#REF!","E":"chart_Printing!#REF!","G":"chart_Printing!#REF!","H":"chart_Printing!#REF!","I":"chart_Printing!#REF!","J":"chart_Printing!#REF!","K":"chart_Printing!#REF!","L":"chart_Printing!#REF!","N":"chart_Printing!#REF!","O":"chart_Printing!#REF!"}' }, { "Sheet": "visual chart_Printing YTD", "Row": 8, "DataJSON": '{"B":"Mei","C":"#REF!","D":"#REF!","E":"#REF!","F":56.19,"G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","N":"#REF!","O":"#REF!","P":0.98}', "FormulaJSON": '{"C":"chart_Printing!#REF!","D":"chart_Printing!#REF!","E":"chart_Printing!#REF!","G":"chart_Printing!#REF!","H":"chart_Printing!#REF!","I":"chart_Printing!#REF!","J":"chart_Printing!#REF!","K":"chart_Printing!#REF!","L":"chart_Printing!#REF!","N":"chart_Printing!#REF!","O":"chart_Printing!#REF!"}' }, { "Sheet": "visual chart_Printing YTD", "Row": 9, "DataJSON": '{"B":"Jun","C":"#REF!","D":"#REF!","E":"#REF!","F":56.19,"G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","N":"#REF!","O":"#REF!","P":0.98}', "FormulaJSON": '{"C":"chart_Printing!#REF!","D":"chart_Printing!#REF!","E":"chart_Printing!#REF!","G":"chart_Printing!#REF!","H":"chart_Printing!#REF!","I":"chart_Printing!#REF!","J":"chart_Printing!#REF!","K":"chart_Printing!#REF!","L":"chart_Printing!#REF!","N":"chart_Printing!#REF!","O":"chart_Printing!#REF!"}' }, { "Sheet": "visual chart_Printing YTD", "Row": 10, "DataJSON": '{"B":"Jul","C":"#REF!","E":"#REF!","F":56.19,"G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","N":"#REF!","O":"#REF!","P":0.98}', "FormulaJSON": '{"C":"chart_Printing!#REF!","E":"chart_Printing!#REF!","G":"chart_Printing!#REF!","H":"chart_Printing!#REF!","I":"chart_Printing!#REF!","J":"chart_Printing!#REF!","K":"chart_Printing!#REF!","L":"chart_Printing!#REF!","N":"chart_Printing!#REF!","O":"chart_Printing!#REF!"}' }, { "Sheet": "visual chart_Printing YTD", "Row": 11, "DataJSON": '{"B":"Augt","C":"#REF!","D":0,"E":"#REF!","F":56.19,"G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","N":"#REF!","O":"#REF!","P":0.98}', "FormulaJSON": '{"C":"chart_Printing!#REF!","E":"chart_Printing!#REF!","G":"chart_Printing!#REF!","H":"chart_Printing!#REF!","I":"chart_Printing!#REF!","J":"chart_Printing!#REF!","K":"chart_Printing!#REF!","L":"chart_Printing!#REF!","N":"chart_Printing!#REF!","O":"chart_Printing!#REF!"}' }, { "Sheet": "visual chart_Printing YTD", "Row": 12, "DataJSON": '{"B":"Sept","C":"#REF!","D":0,"E":"#REF!","F":56.19,"G":"#REF!","H":18,"I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","N":"#REF!","O":"#REF!","P":0.98}', "FormulaJSON": '{"C":"chart_Printing!#REF!","E":"chart_Printing!#REF!","G":"chart_Printing!#REF!","I":"chart_Printing!#REF!","J":"chart_Printing!#REF!","K":"chart_Printing!#REF!","L":"chart_Printing!#REF!","N":"chart_Printing!#REF!","O":"chart_Printing!#REF!"}' }, { "Sheet": "visual chart_Printing YTD", "Row": 13, "DataJSON": '{"B":"Okt","C":"#REF!","D":0,"E":"#REF!","F":56.19,"G":"#REF!","H":23,"I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","N":"#REF!","O":"#REF!","P":0.98}', "FormulaJSON": '{"C":"chart_Printing!#REF!","E":"chart_Printing!#REF!","G":"chart_Printing!#REF!","I":"chart_Printing!#REF!","J":"chart_Printing!#REF!","K":"chart_Printing!#REF!","L":"chart_Printing!#REF!","N":"chart_Printing!#REF!","O":"chart_Printing!#REF!"}' }, { "Sheet": "visual chart_Printing YTD", "Row": 15, "DataJSON": '{"B":"Apr","C":"#REF!","E":"#REF!","F":56.19,"N":"#REF!","O":"#REF!","P":0.98}', "FormulaJSON": '{"C":"chart_Printing!#REF!","E":"chart_Printing!#REF!","N":"chart_Printing!#REF!","O":"chart_Printing!#REF!"}' }, { "Sheet": "visual chart_Printing YTD", "Row": 16, "DataJSON": '{"B":"Mei","C":"#REF!","E":"#REF!","F":56.19,"N":"#REF!","O":"#REF!","P":0.98}', "FormulaJSON": '{"C":"chart_Printing!#REF!","E":"chart_Printing!#REF!","N":"chart_Printing!#REF!","O":"chart_Printing!#REF!"}' }, { "Sheet": "visual chart_Printing YTD", "Row": 17, "DataJSON": '{"B":"Juni","C":"#REF!","E":"#REF!","F":56.19,"N":"#REF!","O":"#REF!","P":0.98}', "FormulaJSON": '{"C":"chart_Printing!#REF!","E":"chart_Printing!#REF!","N":"chart_Printing!#REF!","O":"chart_Printing!#REF!"}' }, { "Sheet": "visual chart_Printing YTD", "Row": 18, "DataJSON": '{"B":"Jul","C":"#REF!","E":"#REF!","F":56.19,"N":"#REF!","O":"#REF!","P":0.98}', "FormulaJSON": '{"C":"chart_Printing!#REF!","E":"chart_Printing!#REF!","N":"chart_Printing!#REF!","O":"chart_Printing!#REF!"}' }, { "Sheet": "visual chart_Printing YTD", "Row": 19, "DataJSON": '{"B":"Aug","C":"#REF!","E":"#REF!","F":56.19,"N":"#REF!","O":"#REF!","P":0.98}', "FormulaJSON": '{"C":"chart_Printing!#REF!","E":"chart_Printing!#REF!","N":"chart_Printing!#REF!","O":"chart_Printing!#REF!"}' }, { "Sheet": "visual chart_Printing YTD", "Row": 20, "DataJSON": '{"B":"Sept","C":"#REF!","E":"#REF!","F":56.19,"N":"#REF!","O":"#REF!","P":0.98}', "FormulaJSON": '{"C":"chart_Printing!#REF!","E":"chart_Printing!#REF!","N":"chart_Printing!#REF!","O":"chart_Printing!#REF!"}' }, { "Sheet": "visual chart_Printing YTD", "Row": 21, "DataJSON": '{"B":"Okt","C":"#REF!","E":"#REF!","F":56.19,"N":"#REF!","O":"#REF!","P":0.98}', "FormulaJSON": '{"C":"chart_Printing!#REF!","E":"chart_Printing!#REF!","N":"chart_Printing!#REF!","O":"chart_Printing!#REF!"}' }, { "Sheet": "visual chart_Printing YTD", "Row": 26, "DataJSON": '{"B":"Jan"}', "FormulaJSON": "{}" }, { "Sheet": "visual chart_Printing YTD", "Row": 27, "DataJSON": '{"B":"Feb"}', "FormulaJSON": "{}" }, { "Sheet": "visual chart_Printing YTD", "Row": 28, "DataJSON": '{"B":"Mar"}', "FormulaJSON": "{}" }, { "Sheet": "visual chart_Printing YTD", "Row": 29, "DataJSON": '{"B":"Apr"}', "FormulaJSON": "{}" }, { "Sheet": "visual chart_Printing YTD", "Row": 30, "DataJSON": '{"B":"Mei"}', "FormulaJSON": "{}" }, { "Sheet": "visual chart_Printing YTD", "Row": 31, "DataJSON": '{"B":"Jun"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 2, "DataJSON": '{"A":"MTD","B":46023,"AH":"YTD","AI":46023}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 3, "DataJSON": '{"B":"Source: ODIN","AI":"Source: ODIN"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 4, "DataJSON": '{"P":"El BD","Q":"Mech BD","R":"Total Lost","S":"Run Hrs","T":"Run Hrs + Total lost","U":"%El","V":"%Mech","W":"% Total Lost","X":"MTBF EL","Y":"MTTR EL","Z":"MTBF Mech","AA":"MTTR Mech","AB":"MTBF Mch","AC":"MTTR Mch","AD":"BD Events EL","AE":"BD Event Mech","AP":"El BD","AQ":"Mech BD","AR":"Total Lost","AS":"Run Hrs","AT":"Run Hrs + Total lost","AU":"%El","AV":"%Mech","AW":"% Total Lost","AX":"MTBF EL","AY":"MTTR EL","AZ":"MTBF Mech","BA":"MTTR Mech","BB":"MTBF Mch","BC":"MTTR Mch","BD":"BD Events EL","BE":"BD Event Mech"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 5, "DataJSON": '{"O":"AUTOPLATEN - 1 MACHINE","AO":"AUTOPLATEN - 1 MACHINE"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 6, "DataJSON": '{"O":"AUTOPLATEN - 2 MACHINE","P":0,"Q":24.35,"R":24.35,"S":313.4,"T":337.75,"U":0,"V":7.769623484365029,"W":7.209474463360474,"AB":42.21875,"AC":3.04375,"AD":0,"AE":8,"AO":"AUTOPLATEN - 2 MACHINE","AP":0,"AQ":24.35,"AR":24.35,"AS":313.4,"AT":337.75,"AU":0,"AV":7.769623484365029,"AW":7.209474463360474,"BB":42.21875,"BC":3.04375,"BD":0,"BE":8}', "FormulaJSON": '{"R":"P6+Q6","T":"S6+R6","U":"P6/S6*100","V":"Q6/S6*100","W":"R6/T6*100","AB":"T6/(AD6+AE6)","AC":"R6/(AD6+AE6)","AR":"AP6+AQ6","AT":"AS6+AR6","AU":"AP6/AS6*100","AV":"AQ6/AS6*100","AW":"AR6/AT6*100","BB":"AT6/(BD6+BE6)","BC":"AR6/(BD6+BE6)"}' }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 7, "DataJSON": '{"O":"AUTOPLATEN - 3 EVOLINE","AO":"AUTOPLATEN - 3 EVOLINE"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 8, "DataJSON": '{"O":"AUTOPLATEN - 4 STRIPPING & BLANKING","AO":"AUTOPLATEN - 4 STRIPPING & BLANKING"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 9, "DataJSON": '{"O":"AUTOPLATEN - 7 STRIPPING & BLANKING","P":0,"Q":2.06666666666667,"R":2.06666666666667,"S":408.83,"T":410.89666666666665,"U":0,"V":0.5055075866904752,"W":0.5029650601529995,"AB":205.44833333333332,"AC":1.033333333333335,"AD":0,"AE":2,"AO":"AUTOPLATEN - 7 STRIPPING & BLANKING","AP":0,"AQ":2.06666666666667,"AR":2.06666666666667,"AS":408.83,"AT":410.89666666666665,"AU":0,"AV":0.5055075866904752,"AW":0.5029650601529995,"BB":205.44833333333332,"BC":1.033333333333335,"BD":0,"BE":2}', "FormulaJSON": '{"R":"P9+Q9","T":"S9+R9","U":"P9/S9*100","V":"Q9/S9*100","AB":"T9/(AD9+AE9)","AC":"R9/(AD9+AE9)","AR":"AP9+AQ9","AT":"AS9+AR9","AU":"AP9/AS9*100","AV":"AQ9/AS9*100","BB":"AT9/(BD9+BE9)","BC":"AR9/(BD9+BE9)"}' }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 10, "DataJSON": '{"O":"AUTOPLATEN - 8 STRIPPING & BLANKING","P":0.67,"Q":0,"R":0.67,"S":575.39,"T":576.06,"U":0.11644276056240116,"V":0,"W":0.11630732909766346,"AB":576.06,"AC":0.67,"AD":1,"AE":0,"AO":"AUTOPLATEN - 8 STRIPPING & BLANKING","AP":0.67,"AQ":0,"AR":0.67,"AS":575.39,"AT":576.06,"AU":0.11644276056240116,"AV":0,"AW":0.11630732909766346,"BB":576.06,"BC":0.67,"BD":1,"BE":0}', "FormulaJSON": '{"R":"P10+Q10","T":"S10+R10","U":"P10/S10*100","AB":"T10/(AD10+AE10)","AC":"R10/(AD10+AE10)","AR":"AP10+AQ10","AT":"AS10+AR10","AU":"AP10/AS10*100","BB":"AT10/(BD10+BE10)","BC":"AR10/(BD10+BE10)"}' }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 11, "DataJSON": '{"O":"AUTOPLATEN - 9 STRIPPING & BLANKING","P":8.41666666666667,"Q":2.41666666666667,"R":10.83333333333334,"S":513.23,"T":524.0633333333334,"U":1.6399405075047577,"V":0.470874007105327,"W":2.067180175424091,"AB":104.81266666666667,"AC":2.166666666666668,"AD":3,"AE":2,"AO":"AUTOPLATEN - 9 STRIPPING & BLANKING","AP":8.41666666666667,"AQ":2.41666666666667,"AR":10.83333333333334,"AS":513.23,"AT":524.0633333333334,"AU":1.6399405075047577,"AV":0.470874007105327,"AW":2.067180175424091,"BB":104.81266666666667,"BC":2.166666666666668,"BD":3,"BE":2}', "FormulaJSON": '{"R":"P11+Q11","T":"S11+R11","U":"P11/S11*100","AB":"T11/(AD11+AE11)","AC":"R11/(AD11+AE11)","AR":"AP11+AQ11","AT":"AS11+AR11","AU":"AP11/AS11*100","BB":"AT11/(BD11+BE11)","BC":"AR11/(BD11+BE11)"}' }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 12, "DataJSON": '{"O":"AUTOPLATEN - 5 STAMPING","P":0,"Q":0,"R":0,"S":487.98,"T":487.98,"U":0,"V":0,"W":0,"AB":487.98,"AC":0,"AD":0,"AE":0,"AO":"AUTOPLATEN - 5 STAMPING","AP":0,"AQ":0,"AR":0,"AS":487.98,"AT":487.98,"AU":0,"AV":0,"AW":0,"BB":487.98,"BC":0,"BD":0,"BE":0}', "FormulaJSON": '{"R":"P12+Q12","T":"S12+R12","U":"P12/S12*100","AB":"T12","AR":"AP12+AQ12","AT":"AS12+AR12","AU":"AP12/AS12*100","BB":"AT12"}' }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 13, "DataJSON": '{"O":"AUTOPLATEN - 6 STAMPING","P":0,"Q":4.58,"R":4.58,"S":480.58,"T":485.15999999999997,"U":0,"V":0,"W":0.9440184681342239,"AB":242.57999999999998,"AC":2.29,"AD":0,"AE":2,"AO":"AUTOPLATEN - 6 STAMPING","AP":0,"AQ":4.58,"AR":4.58,"AS":480.58,"AT":485.15999999999997,"AU":0,"AV":0,"AW":0.9440184681342239,"BB":242.57999999999998,"BC":2.29,"BD":0,"BE":2}', "FormulaJSON": '{"R":"P13+Q13","T":"S13+R13","W":"R13/T13*100","AB":"T13/(AD13+AE13)","AC":"R13/(AD13+AE13)","AR":"AP13+AQ13","AT":"AS13+AR13","AW":"AR13/AT13*100","BB":"AT13/(BD13+BE13)","BC":"AR13/(BD13+BE13)"}' }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 15, "DataJSON": '{"W":1.8066575826949087,"AB":276.516625,"AC":1.5339583333333338,"AD":4,"AE":14,"AW":1.8066575826949087,"BB":276.516625,"BC":1.5339583333333338,"BD":4,"BE":14}', "FormulaJSON": '{"W":"AVERAGE(W5:W14)","AB":"AVERAGE(AB5:AB14)","AC":"AVERAGE(AC5:AC14)","AD":"SUM(AD5:AD14)","AE":"SUM(AE5:AE14)","AW":"AVERAGE(AW5:AW14)","BB":"AVERAGE(BB5:BB14)","BC":"AVERAGE(BC5:BC14)","BD":"SUM(BD5:BD14)","BE":"SUM(BE5:BE14)"}' }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 16, "DataJSON": '{"B":"Highlite Issue","AI":"Highlite Issue"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 17, "DataJSON": '{"B":"Contributor MTBF score drop:","E":" ","AI":"Contributor MTBF score drop:"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 18, "DataJSON": '{"B":"Case paling lama penanganan pada  ","E":" ","AI":"Case paling lama penanganan pada  "}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 20, "DataJSON": '{"A":"MTD","B":46054,"AH":"YTD","AI":46054}', "FormulaJSON": '{"AI":"B20"}' }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 21, "DataJSON": '{"B":"Source: ODIN","AI":"Source: ODIN"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 22, "DataJSON": '{"P":"El BD","Q":"Mech BD","R":"Total Lost","S":"Run Hrs","T":"Run Hrs + Total lost","U":"%El","V":"%Mech","W":"% Total Lost","X":"MTBF EL","Y":"MTTR EL","Z":"MTBF Mech","AA":"MTTR Mech","AB":"MTBF Mch","AC":"MTTR Mch","AD":"BD Events EL","AE":"BD Event Mech","AP":"El BD","AQ":"Mech BD","AR":"Total Lost","AS":"Run Hrs","AT":"Run Hrs + Total lost","AU":"%El","AV":"%Mech","AW":"% Total Lost","AX":"MTBF EL","AY":"MTTR EL","AZ":"MTBF Mech","BA":"MTTR Mech","BB":"MTBF Mch","BC":"MTTR Mch","BD":"BD Events EL","BE":"BD Event Mech"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 23, "DataJSON": '{"O":"AUTOPLATEN - 1 MACHINE","AO":"AUTOPLATEN - 1 MACHINE"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 24, "DataJSON": '{"O":"AUTOPLATEN - 2 MACHINE","P":0,"Q":6.38333333333333,"R":6.38333333333333,"S":191.88,"T":198.26333333333332,"U":0,"V":3.326731985268569,"W":3.2196237327460095,"AB":39.65266666666666,"AC":1.276666666666666,"AD":0,"AE":5,"AO":"AUTOPLATEN - 2 MACHINE","AP":0,"AQ":30.73333333333333,"AR":30.73333333333333,"AS":505.28,"AT":536.0133333333333,"AU":0,"AV":6.082436141017522,"AW":5.733688216711027,"BB":41.23179487179487,"BC":2.3641025641025637,"BD":0,"BE":13}', "FormulaJSON": '{"R":"P24+Q24","T":"S24+R24","U":"P24/S24*100","V":"Q24/S24*100","W":"R24/T24*100","AB":"T24/(AD24+AE24)","AC":"R24/(AD24+AE24)","AP":"AP6+P24","AQ":"AQ6+Q24","AR":"AP24+AQ24","AS":"AS6+S24","AT":"AS24+AR24","AU":"AP24/AS24*100","AV":"AQ24/AS24*100","AW":"AR24/AT24*100","BB":"AT24/(BD24+BE24)","BC":"AR24/(BD24+BE24)","BD":"BD6+AD24","BE":"BE6+AE24"}' }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 25, "DataJSON": '{"O":"AUTOPLATEN - 3 EVOLINE","AO":"AUTOPLATEN - 3 EVOLINE"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 26, "DataJSON": '{"O":"AUTOPLATEN - 4 STRIPPING & BLANKING","AO":"AUTOPLATEN - 4 STRIPPING & BLANKING"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 27, "DataJSON": '{"O":"AUTOPLATEN - 7 STRIPPING & BLANKING","P":2.36666666666667,"Q":36.4166666666667,"R":38.78333333333337,"S":382.12,"T":420.90333333333336,"U":0.6193516870791034,"V":9.53016504413972,"W":9.214308907033294,"AB":84.18066666666667,"AC":7.756666666666673,"AD":2,"AE":3,"AO":"AUTOPLATEN - 7 STRIPPING & BLANKING","AP":2.36666666666667,"AQ":38.48333333333337,"AR":40.85000000000004,"AS":790.95,"AT":831.8000000000001,"AU":0.29921823966959604,"AV":4.865457150683781,"AW":4.911036306804524,"BB":118.82857142857144,"BC":5.835714285714291,"BD":2,"BE":5}', "FormulaJSON": '{"R":"P27+Q27","T":"S27+R27","U":"P27/S27*100","V":"Q27/S27*100","AB":"T27/(AD27+AE27)","AC":"R27/(AD27+AE27)","AP":"AP9+P27","AR":"AP27+AQ27","AS":"AS9+S27","AT":"AS27+AR27","AU":"AP27/AS27*100","AV":"AQ27/AS27*100","BB":"AT27/(BD27+BE27)","BC":"AR27/(BD27+BE27)","BD":"BD9+AD27"}' }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 28, "DataJSON": '{"O":"AUTOPLATEN - 8 STRIPPING & BLANKING","P":1,"Q":0,"R":1,"S":523.78,"T":524.78,"U":0.19091985184619498,"V":0,"W":0.1905560425321087,"AB":524.78,"AC":1,"AD":1,"AE":0,"AO":"AUTOPLATEN - 8 STRIPPING & BLANKING","AP":1.67,"AQ":0,"AR":1.67,"AS":1099.17,"AT":1100.8400000000001,"AU":0.15193282203844716,"AV":0,"AW":0.15170233639765995,"BB":550.4200000000001,"BC":0.835,"BD":2,"BE":0}', "FormulaJSON": '{"R":"P28+Q28","T":"S28+R28","U":"P28/S28*100","AB":"T28/(AD28+AE28)","AC":"R28/(AD28+AE28)","AR":"AP28+AQ28","AS":"AS10+S28","AT":"AS28+AR28","AU":"AP28/AS28*100","BB":"AT28/(BD28+BE28)","BC":"AR28/(BD28+BE28)"}' }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 29, "DataJSON": '{"O":"AUTOPLATEN - 9 STRIPPING & BLANKING","P":0,"Q":3,"R":3,"S":540.52,"T":543.52,"U":0,"V":0.5550210908014505,"W":0.5519576096555785,"AB":543.52,"AC":3,"AD":0,"AE":1,"AO":"AUTOPLATEN - 9 STRIPPING & BLANKING","AP":8.41666666666667,"AQ":5.41666666666667,"AR":13.83333333333334,"AS":1053.75,"AT":1067.5833333333333,"AU":0.7987346777382368,"AV":0.5140371688414396,"AW":1.2957614549996104,"BB":177.93055555555554,"BC":2.3055555555555567,"BD":3,"BE":3}', "FormulaJSON": '{"R":"P29+Q29","T":"S29+R29","U":"P29/S29*100","AB":"T29/(AD29+AE29)","AC":"R29/(AD29+AE29)","AR":"AP29+AQ29","AS":"AS11+S29","AT":"AS29+AR29","AU":"AP29/AS29*100","BB":"AT29/(BD29+BE29)","BC":"AR29/(BD29+BE29)"}' }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 30, "DataJSON": '{"O":"AUTOPLATEN - 5 STAMPING","P":0.333333333333333,"Q":3.5,"R":3.833333333333333,"S":441.71,"T":445.5433333333333,"U":0.07546429406926106,"V":0.7923750877272419,"W":0.8603727284289594,"AB":445.5433333333333,"AC":0,"AD":1,"AE":3,"AO":"AUTOPLATEN - 5 STAMPING","AP":0.333333333333333,"AQ":3.5,"AR":3.833333333333333,"AS":929.69,"AT":933.5233333333334,"AU":0.035854245321917305,"AV":0.3764695758801321,"AW":0.4106306930374887,"BB":233.38083333333336,"BC":0.9583333333333333,"BD":1,"BE":3}', "FormulaJSON": '{"R":"P30+Q30","T":"S30+R30","U":"P30/S30*100","AB":"T30","AR":"AP30+AQ30","AS":"AS12+S30","AT":"AS30+AR30","AU":"AP30/AS30*100","BB":"AT30/(BD30+BE30)","BC":"AR30/(BD30+BE30)"}' }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 31, "DataJSON": '{"O":"AUTOPLATEN - 6 STAMPING","P":0,"Q":1,"R":1,"S":396.85,"T":397.85,"U":0,"V":0,"W":0.25135101168782203,"AB":397.85,"AC":1,"AD":0,"AE":1,"AO":"AUTOPLATEN - 6 STAMPING","AP":0,"AQ":5.58,"AR":5.58,"AS":877.4300000000001,"AT":883.0100000000001,"AU":0,"AV":0.6359481668053292,"AW":0.6319294232228401,"BB":294.3366666666667,"BC":1.86,"BD":0,"BE":3}', "FormulaJSON": '{"R":"P31+Q31","T":"S31+R31","W":"R31/T31*100","AB":"T31/(AD31+AE31)","AC":"R31/(AD31+AE31)","AR":"AP31+AQ31","AS":"AS13+S31","AT":"AS31+AR31","AU":"AP31/AS31*100","BB":"AT31/(BD31+BE31)","BC":"AR31/(BD31+BE31)"}' }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 33, "DataJSON": '{"W":2.3813616720139623,"AB":339.25444444444446,"AC":2.33888888888889,"AD":4,"AE":13,"AW":2.189124738528858,"BB":236.0214036426536,"BC":2.359784289784291,"BD":8,"BE":27}', "FormulaJSON": '{"W":"AVERAGE(W23:W32)","AB":"AVERAGE(AB23:AB32)","AC":"AVERAGE(AC23:AC32)","AD":"SUM(AD23:AD32)","AE":"SUM(AE23:AE32)","AW":"AVERAGE(AW23:AW32)","BB":"AVERAGE(BB23:BB32)","BC":"AVERAGE(BC23:BC32)","BD":"SUM(BD23:BD32)","BE":"SUM(BE23:BE32)"}' }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 34, "DataJSON": '{"B":"Highlite Issue","AI":"Highlite Issue"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 35, "DataJSON": '{"B":"Contributor MTBF score drop:","E":" ","AI":"Contributor MTBF score drop:"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 36, "DataJSON": '{"B":"Case paling lama penanganan pada  ","E":" ","AI":"Case paling lama penanganan pada  "}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 38, "DataJSON": '{"A":"MTD","B":46082,"AH":"YTD","AI":46082}', "FormulaJSON": '{"AI":"B38"}' }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 39, "DataJSON": '{"B":"Source: ODIN","AI":"Source: ODIN"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 40, "DataJSON": '{"P":"El BD","Q":"Mech BD","R":"Total Lost","S":"Run Hrs","T":"Run Hrs + Total lost","U":"%El","V":"%Mech","W":"% Total Lost","X":"MTBF EL","Y":"MTTR EL","Z":"MTBF Mech","AA":"MTTR Mech","AB":"MTBF Mch","AC":"MTTR Mch","AD":"BD Events EL","AE":"BD Event Mech","AP":"El BD","AQ":"Mech BD","AR":"Total Lost","AS":"Run Hrs","AT":"Run Hrs + Total lost","AU":"%El","AV":"%Mech","AW":"% Total Lost","AX":"MTBF EL","AY":"MTTR EL","AZ":"MTBF Mech","BA":"MTTR Mech","BB":"MTBF Mch","BC":"MTTR Mch","BD":"BD Events EL","BE":"BD Event Mech"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 41, "DataJSON": '{"O":"AUTOPLATEN - 1 MACHINE","AO":"AUTOPLATEN - 1 MACHINE"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 42, "DataJSON": '{"O":"AUTOPLATEN - 2 MACHINE","P":0,"Q":5.66666666666667,"R":5.66666666666667,"S":280.56,"T":286.2266666666667,"U":0,"V":2.019769983841841,"W":1.9797829226254262,"AB":71.55666666666667,"AC":1.4166666666666674,"AD":0,"AE":4,"AO":"AUTOPLATEN - 2 MACHINE","AP":0,"AQ":36.4,"AR":36.4,"AS":785.8399999999999,"AT":822.2399999999999,"AU":0,"AV":4.631986154942482,"AW":4.426931309593306,"BB":48.367058823529405,"BC":2.1411764705882352,"BD":0,"BE":17}', "FormulaJSON": '{"R":"P42+Q42","T":"S42+R42","U":"P42/S42*100","V":"Q42/S42*100","W":"R42/T42*100","AB":"T42/(AD42+AE42)","AC":"R42/(AD42+AE42)","AP":"AP24+P42","AQ":"AQ24+Q42","AR":"AP42+AQ42","AS":"AS24+S42","AT":"AS42+AR42","AU":"AP42/AS42*100","AV":"AQ42/AS42*100","AW":"AR42/AT42*100","BB":"AT42/(BD42+BE42)","BC":"AR42/(BD42+BE42)","BD":"BD24+AD42","BE":"BE24+AE42"}' }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 43, "DataJSON": '{"O":"AUTOPLATEN - 3 EVOLINE","AO":"AUTOPLATEN - 3 EVOLINE"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 44, "DataJSON": '{"O":"AUTOPLATEN - 4 STRIPPING & BLANKING","AO":"AUTOPLATEN - 4 STRIPPING & BLANKING"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 45, "DataJSON": '{"O":"AUTOPLATEN - 7 STRIPPING & BLANKING","P":2,"Q":2.7,"R":4.7,"S":429.01,"T":433.71,"U":0.4661895993100394,"V":0.6293559590685532,"W":1.0836734223328954,"AB":72.285,"AC":0.7833333333333333,"AD":3,"AE":3,"AO":"AUTOPLATEN - 7 STRIPPING & BLANKING","AP":4.36666666666667,"AQ":41.18333333333337,"AR":45.55000000000004,"AS":1219.96,"AT":1265.51,"AU":0.35793523284916473,"AV":3.375793741871321,"AW":3.5993393967649436,"BB":97.34692307692308,"BC":3.503846153846157,"BD":5,"BE":8}', "FormulaJSON": '{"R":"P45+Q45","T":"S45+R45","U":"P45/S45*100","V":"Q45/S45*100","AB":"T45/(AD45+AE45)","AC":"R45/(AD45+AE45)","AP":"AP27+P45","AR":"AP45+AQ45","AS":"AS27+S45","AT":"AS45+AR45","AU":"AP45/AS45*100","AV":"AQ45/AS45*100","BB":"AT45/(BD45+BE45)","BC":"AR45/(BD45+BE45)","BD":"BD27+AD45"}' }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 46, "DataJSON": '{"O":"AUTOPLATEN - 8 STRIPPING & BLANKING","P":9,"Q":0,"R":9,"S":483.81,"T":492.81,"U":1.8602343895330813,"V":0,"W":1.8262616424179705,"AB":164.27,"AC":3,"AD":3,"AE":0,"AO":"AUTOPLATEN - 8 STRIPPING & BLANKING","AP":10.67,"AQ":0,"AR":10.67,"AS":1582.98,"AT":1593.65,"AU":0.6740451553399285,"AV":0,"AW":0.6695322059423336,"BB":318.73,"BC":2.134,"BD":5,"BE":0}', "FormulaJSON": '{"R":"P46+Q46","T":"S46+R46","U":"P46/S46*100","AB":"T46/(AD46+AE46)","AC":"R46/(AD46+AE46)","AR":"AP46+AQ46","AS":"AS28+S46","AT":"AS46+AR46","AU":"AP46/AS46*100","BB":"AT46/(BD46+BE46)","BC":"AR46/(BD46+BE46)"}' }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 47, "DataJSON": '{"O":"AUTOPLATEN - 9 STRIPPING & BLANKING","P":0,"Q":20.6666666666667,"R":20.6666666666667,"S":454.43,"T":475.0966666666667,"U":0,"V":4.547821813407279,"W":4.349991931466586,"AB":158.36555555555557,"AC":6.8888888888889,"AD":0,"AE":3,"AO":"AUTOPLATEN - 9 STRIPPING & BLANKING","AP":8.41666666666667,"AQ":26.08333333333337,"AR":34.50000000000004,"AS":1508.18,"AT":1542.68,"AU":0.5580677814761281,"AV":1.7294575802181018,"AW":2.2363678792750306,"BB":171.4088888888889,"BC":3.833333333333338,"BD":3,"BE":6}', "FormulaJSON": '{"R":"P47+Q47","T":"S47+R47","U":"P47/S47*100","AB":"T47/(AD47+AE47)","AC":"R47/(AD47+AE47)","AR":"AP47+AQ47","AS":"AS29+S47","AT":"AS47+AR47","AU":"AP47/AS47*100","BB":"AT47/(BD47+BE47)","BC":"AR47/(BD47+BE47)"}' }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 48, "DataJSON": '{"O":"AUTOPLATEN - 5 STAMPING","P":5.25,"Q":0.5,"R":5.75,"S":440.73,"T":446.48,"U":1.1912054999659656,"V":0.11344814285390148,"W":1.2878516394911306,"AB":446.48,"AC":0,"AD":3,"AE":1,"AO":"AUTOPLATEN - 5 STAMPING","AP":5.583333333333333,"AQ":4,"AR":9.583333333333332,"AS":1370.42,"AT":1380.0033333333333,"AU":0.40741767730574074,"AV":0.2918813210548591,"AW":0.6944427670464564,"BB":172.50041666666667,"BC":1.1979166666666665,"BD":4,"BE":4}', "FormulaJSON": '{"R":"P48+Q48","T":"S48+R48","U":"P48/S48*100","AB":"T48","AR":"AP48+AQ48","AS":"AS30+S48","AT":"AS48+AR48","AU":"AP48/AS48*100","BB":"AT48/(BD48+BE48)","BC":"AR48/(BD48+BE48)"}' }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 49, "DataJSON": '{"O":"AUTOPLATEN - 6 STAMPING","P":0.916666666666667,"Q":0.833333333333333,"R":1.75,"S":471.83,"T":473.58,"U":0,"V":0,"W":0.3695257401072681,"AB":94.716,"AC":0.35,"AD":4,"AE":1,"AO":"AUTOPLATEN - 6 STAMPING","AP":0.916666666666667,"AQ":6.413333333333333,"AR":7.33,"AS":1349.26,"AT":1356.59,"AU":0.06793847491711508,"AV":0.47532227542010685,"AW":0.5403253746526216,"BB":169.57375,"BC":0.91625,"BD":4,"BE":4}', "FormulaJSON": '{"R":"P49+Q49","T":"S49+R49","W":"R49/T49*100","AB":"T49/(AD49+AE49)","AC":"R49/(AD49+AE49)","AR":"AP49+AQ49","AS":"AS31+S49","AT":"AS49+AR49","AU":"AP49/AS49*100","BB":"AT49/(BD49+BE49)","BC":"AR49/(BD49+BE49)"}' }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 51, "DataJSON": '{"W":1.8161812164068791,"AB":167.94553703703704,"AC":2.07314814814815,"AD":13,"AE":12,"AW":2.027823155545782,"BB":162.98783957600133,"BC":2.287753770739066,"BD":21,"BE":39}', "FormulaJSON": '{"W":"AVERAGE(W41:W50)","AB":"AVERAGE(AB41:AB50)","AC":"AVERAGE(AC41:AC50)","AD":"SUM(AD41:AD50)","AE":"SUM(AE41:AE50)","AW":"AVERAGE(AW41:AW50)","BB":"AVERAGE(BB41:BB50)","BC":"AVERAGE(BC41:BC50)","BD":"SUM(BD41:BD50)","BE":"SUM(BE41:BE50)"}' }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 52, "DataJSON": '{"B":"Highlite Issue","AI":"Highlite Issue"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 53, "DataJSON": '{"B":"Contributor MTBF score drop:","E":" ","AI":"Contributor MTBF score drop:"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 54, "DataJSON": '{"B":"Case paling lama penanganan pada  ","E":" ","AI":"Case paling lama penanganan pada  "}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 56, "DataJSON": '{"A":"MTD","B":46113,"AH":"YTD","AI":46113}', "FormulaJSON": '{"AI":"B56"}' }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 57, "DataJSON": '{"B":"Source: ODIN","AI":"Source: ODIN"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 58, "DataJSON": '{"P":"El BD","Q":"Mech BD","R":"Total Lost","S":"Run Hrs","T":"Run Hrs + Total lost","U":"%El","V":"%Mech","W":"% Total Lost","X":"MTBF EL","Y":"MTTR EL","Z":"MTBF Mech","AA":"MTTR Mech","AB":"MTBF Mch","AC":"MTTR Mch","AD":"BD Events EL","AE":"BD Event Mech","AP":"El BD","AQ":"Mech BD","AR":"Total Lost","AS":"Run Hrs","AT":"Run Hrs + Total lost","AU":"%El","AV":"%Mech","AW":"% Total Lost","AX":"MTBF EL","AY":"MTTR EL","AZ":"MTBF Mech","BA":"MTTR Mech","BB":"MTBF Mch","BC":"MTTR Mch","BD":"BD Events EL","BE":"BD Event Mech"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 59, "DataJSON": '{"O":"AUTOPLATEN - 1 MACHINE","AO":"AUTOPLATEN - 1 MACHINE"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 60, "DataJSON": '{"O":"AUTOPLATEN - 2 MACHINE","P":7.83333333333333,"Q":13.8333333333333,"R":21.66666666666663,"S":355.19,"T":376.8566666666666,"U":2.2053924190808667,"V":3.8946291656108842,"W":5.749312293798694,"AB":26.91833333333333,"AC":1.547619047619045,"AD":7,"AE":7,"AO":"AUTOPLATEN - 2 MACHINE","AP":7.83333333333333,"AQ":50.2333333333333,"AR":58.06666666666663,"AS":1141.03,"AT":1199.0966666666666,"AU":0.6865142312939476,"AV":4.40245509174459,"AW":4.842534241053679,"BB":38.6805376344086,"BC":1.8731182795698913,"BD":7,"BE":24}', "FormulaJSON": '{"R":"P60+Q60","T":"S60+R60","U":"P60/S60*100","V":"Q60/S60*100","W":"R60/T60*100","AB":"T60/(AD60+AE60)","AC":"R60/(AD60+AE60)","AP":"AP42+P60","AQ":"AQ42+Q60","AR":"AP60+AQ60","AS":"AS42+S60","AT":"AS60+AR60","AU":"AP60/AS60*100","AV":"AQ60/AS60*100","AW":"AR60/AT60*100","BB":"AT60/(BD60+BE60)","BC":"AR60/(BD60+BE60)","BD":"BD42+AD60","BE":"BE42+AE60"}' }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 61, "DataJSON": '{"O":"AUTOPLATEN - 3 EVOLINE","AO":"AUTOPLATEN - 3 EVOLINE"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 62, "DataJSON": '{"O":"AUTOPLATEN - 4 STRIPPING & BLANKING","AO":"AUTOPLATEN - 4 STRIPPING & BLANKING"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 63, "DataJSON": '{"O":"AUTOPLATEN - 7 STRIPPING & BLANKING","P":4.93333333333333,"Q":10.75,"R":15.68333333333333,"S":404.39,"T":420.0733333333333,"U":1.2199444430706323,"V":2.6583248843937786,"W":3.733475107520908,"AB":28.00488888888889,"AC":1.0455555555555553,"AD":4,"AE":11,"AO":"AUTOPLATEN - 7 STRIPPING & BLANKING","AP":9.3,"AQ":51.93333333333337,"AR":61.23333333333338,"AS":1624.35,"AT":1685.5833333333333,"AU":0.5725367069904886,"AV":3.197176306420006,"AW":3.632768082266281,"BB":60.19940476190476,"BC":2.1869047619047635,"BD":9,"BE":19}', "FormulaJSON": '{"R":"P63+Q63","T":"S63+R63","U":"P63/S63*100","V":"Q63/S63*100","AB":"T63/(AD63+AE63)","AC":"R63/(AD63+AE63)","AP":"AP45+P63","AR":"AP63+AQ63","AS":"AS45+S63","AT":"AS63+AR63","AU":"AP63/AS63*100","AV":"AQ63/AS63*100","BB":"AT63/(BD63+BE63)","BC":"AR63/(BD63+BE63)","BD":"BD45+AD63"}' }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 64, "DataJSON": '{"O":"AUTOPLATEN - 8 STRIPPING & BLANKING","P":10.5,"Q":1.25,"R":11.75,"S":563.23,"T":574.98,"U":1.8642472879640646,"V":0.22193420094810287,"W":2.043549340846638,"AB":143.745,"AC":2.9375,"AD":2,"AE":2,"AO":"AUTOPLATEN - 8 STRIPPING & BLANKING","AP":21.17,"AQ":1.25,"AR":22.42,"AS":2146.21,"AT":2168.63,"AU":0.9863899618397083,"AV":0.058242203698612896,"AW":1.0338324195459807,"BB":240.9588888888889,"BC":2.4911111111111115,"BD":7,"BE":2}', "FormulaJSON": '{"R":"P64+Q64","T":"S64+R64","U":"P64/S64*100","AB":"T64/(AD64+AE64)","AC":"R64/(AD64+AE64)","AR":"AP64+AQ64","AS":"AS46+S64","AT":"AS64+AR64","AU":"AP64/AS64*100","BB":"AT64/(BD64+BE64)","BC":"AR64/(BD64+BE64)"}' }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 65, "DataJSON": '{"O":"AUTOPLATEN - 9 STRIPPING & BLANKING","P":6.51666666666667,"Q":0,"R":6.51666666666667,"S":577.05,"T":583.5666666666666,"U":1.129307107991798,"V":0,"W":1.1166961786713894,"AB":291.7833333333333,"AC":3.258333333333335,"AD":2,"AE":0,"AO":"AUTOPLATEN - 9 STRIPPING & BLANKING","AP":14.93333333333334,"AQ":26.08333333333337,"AR":41.01666666666671,"AS":2085.23,"AT":2126.246666666667,"AU":0.7161480188436451,"AV":1.2508612159490018,"AW":1.9290643606731126,"BB":193.29515151515153,"BC":3.7287878787878825,"BD":5,"BE":6}', "FormulaJSON": '{"R":"P65+Q65","T":"S65+R65","U":"P65/S65*100","AB":"T65/(AD65+AE65)","AC":"R65/(AD65+AE65)","AR":"AP65+AQ65","AS":"AS47+S65","AT":"AS65+AR65","AU":"AP65/AS65*100","BB":"AT65/(BD65+BE65)","BC":"AR65/(BD65+BE65)"}' }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 66, "DataJSON": '{"O":"AUTOPLATEN - 5 STAMPING","P":3.16666666666667,"Q":23.2833333333333,"R":26.44999999999997,"S":543.56,"T":570.0099999999999,"U":0.582579046778032,"V":4.283489096573203,"W":4.640269468956681,"AB":40.71499999999999,"AC":1.8892857142857122,"AD":6,"AE":8,"AO":"AUTOPLATEN - 5 STAMPING","AP":8.750000000000004,"AQ":27.2833333333333,"AR":36.0333333333333,"AS":1913.98,"AT":1950.0133333333333,"AU":0.45716256178225495,"AV":1.425476406928667,"AW":1.84785061298726,"BB":88.6369696969697,"BC":1.6378787878787866,"BD":10,"BE":12}', "FormulaJSON": '{"R":"P66+Q66","T":"S66+R66","U":"P66/S66*100","AB":"T66/(AD66+AE66)","AC":"R66/(AD66+AE66)","AR":"AP66+AQ66","AS":"AS48+S66","AT":"AS66+AR66","AU":"AP66/AS66*100","BB":"AT66/(BD66+BE66)","BC":"AR66/(BD66+BE66)"}' }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 67, "DataJSON": '{"O":"AUTOPLATEN - 6 STAMPING","P":5.16666666666667,"Q":1.5,"R":6.66666666666667,"S":546.48,"T":553.1466666666666,"U":0,"V":0,"W":1.2052258593260383,"AB":92.19111111111111,"AC":1.1111111111111116,"AD":4,"AE":2,"AO":"AUTOPLATEN - 6 STAMPING","AP":6.083333333333337,"AQ":7.913333333333333,"AR":13.99666666666667,"AS":1895.74,"AT":1909.7366666666667,"AU":0.32089491878281495,"AV":0.4174271436659739,"AW":0.7329108201654331,"BB":136.4097619047619,"BC":0.999761904761905,"BD":8,"BE":6}', "FormulaJSON": '{"R":"P67+Q67","T":"S67+R67","W":"R67/T67*100","AB":"T67/(AD67+AE67)","AC":"R67/(AD67+AE67)","AR":"AP67+AQ67","AS":"AS49+S67","AT":"AS67+AR67","AU":"AP67/AS67*100","BB":"AT67/(BD67+BE67)","BC":"AR67/(BD67+BE67)"}' }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 69, "DataJSON": '{"W":3.0814213748533916,"AB":103.89294444444444,"AC":1.9649007936507932,"AD":25,"AE":30,"AW":2.336493422781958,"BB":126.36345240034757,"BC":2.152927120669057,"BD":46,"BE":69}', "FormulaJSON": '{"W":"AVERAGE(W59:W68)","AB":"AVERAGE(AB59:AB68)","AC":"AVERAGE(AC59:AC68)","AD":"SUM(AD59:AD68)","AE":"SUM(AE59:AE68)","AW":"AVERAGE(AW59:AW68)","BB":"AVERAGE(BB59:BB68)","BC":"AVERAGE(BC59:BC68)","BD":"SUM(BD59:BD68)","BE":"SUM(BE59:BE68)"}' }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 70, "DataJSON": '{"B":"Highlite Issue","AI":"Highlite Issue"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 71, "DataJSON": '{"B":"Contributor MTBF score drop:","E":" ","AI":"Contributor MTBF score drop:"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 72, "DataJSON": '{"B":"Case paling lama penanganan pada  ","E":" ","AI":"Case paling lama penanganan pada  "}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 74, "DataJSON": '{"A":"MTD","B":46143,"AH":"YTD","AI":46143}', "FormulaJSON": '{"AI":"B74"}' }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 75, "DataJSON": '{"B":"Source: ODIN","AI":"Source: ODIN"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 76, "DataJSON": '{"P":"El BD","Q":"Mech BD","R":"Total Lost","S":"Run Hrs","T":"Run Hrs + Total lost","U":"%El","V":"%Mech","W":"% Total Lost","X":"MTBF EL","Y":"MTTR EL","Z":"MTBF Mech","AA":"MTTR Mech","AB":"MTBF Mch","AC":"MTTR Mch","AD":"BD Events EL","AE":"BD Event Mech","AP":"El BD","AQ":"Mech BD","AR":"Total Lost","AS":"Run Hrs","AT":"Run Hrs + Total lost","AU":"%El","AV":"%Mech","AW":"% Total Lost","AX":"MTBF EL","AY":"MTTR EL","AZ":"MTBF Mech","BA":"MTTR Mech","BB":"MTBF Mch","BC":"MTTR Mch","BD":"BD Events EL","BE":"BD Event Mech"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 77, "DataJSON": '{"O":"AUTOPLATEN - 1 MACHINE","AO":"AUTOPLATEN - 1 MACHINE"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 78, "DataJSON": '{"O":"AUTOPLATEN - 2 MACHINE","P":1.5,"Q":2,"R":3.5,"S":329.91,"T":333.41,"U":0.45466945530599245,"V":0.60622594040799,"W":1.0497585555322275,"AB":47.63,"AC":0.5,"AD":4,"AE":3,"AO":"AUTOPLATEN - 2 MACHINE","AP":9.33333333333333,"AQ":52.2333333333333,"AR":61.56666666666663,"AS":1470.94,"AT":1532.5066666666667,"AU":0.6345148907048098,"AV":3.5510172633372736,"AW":4.017383284901423,"BB":40.32912280701754,"BC":1.6201754385964902,"BD":11,"BE":27}', "FormulaJSON": '{"R":"P78+Q78","T":"S78+R78","U":"P78/S78*100","V":"Q78/S78*100","W":"R78/T78*100","AB":"T78/(AD78+AE78)","AC":"R78/(AD78+AE78)","AP":"AP60+P78","AQ":"AQ60+Q78","AR":"AP78+AQ78","AS":"AS60+S78","AT":"AS78+AR78","AU":"AP78/AS78*100","AV":"AQ78/AS78*100","AW":"AR78/AT78*100","BB":"AT78/(BD78+BE78)","BC":"AR78/(BD78+BE78)","BD":"BD60+AD78","BE":"BE60+AE78"}' }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 79, "DataJSON": '{"O":"AUTOPLATEN - 3 EVOLINE","AO":"AUTOPLATEN - 3 EVOLINE"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 80, "DataJSON": '{"O":"AUTOPLATEN - 4 STRIPPING & BLANKING","AO":"AUTOPLATEN - 4 STRIPPING & BLANKING"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 81, "DataJSON": '{"O":"AUTOPLATEN - 7 STRIPPING & BLANKING","P":1.16666666666667,"Q":0.333333333333333,"R":1.500000000000003,"S":456.89,"T":458.39,"U":0.2553495735662129,"V":0.07295702101891768,"W":0.3272322694648669,"AB":152.79666666666665,"AC":0.500000000000001,"AD":2,"AE":1,"AO":"AUTOPLATEN - 7 STRIPPING & BLANKING","AP":10.46666666666667,"AQ":52.26666666666671,"AR":62.73333333333338,"AS":2081.24,"AT":2143.9733333333334,"AU":0.5029053192647975,"AV":2.511323377729945,"AW":2.926031418301225,"BB":69.16043010752688,"BC":2.023655913978496,"BD":11,"BE":20}', "FormulaJSON": '{"R":"P81+Q81","T":"S81+R81","U":"P81/S81*100","V":"Q81/S81*100","AB":"T81/(AD81+AE81)","AC":"R81/(AD81+AE81)","AP":"AP63+P81","AR":"AP81+AQ81","AS":"AS63+S81","AT":"AS81+AR81","AU":"AP81/AS81*100","AV":"AQ81/AS81*100","BB":"AT81/(BD81+BE81)","BC":"AR81/(BD81+BE81)","BD":"BD63+AD81"}' }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 82, "DataJSON": '{"O":"AUTOPLATEN - 8 STRIPPING & BLANKING","P":0,"Q":0,"R":0,"S":540.24,"T":540.24,"U":0,"V":0,"W":0,"AB":540.24,"AC":0,"AD":0,"AE":0,"AO":"AUTOPLATEN - 8 STRIPPING & BLANKING","AP":21.17,"AQ":1.25,"AR":22.42,"AS":2686.45,"AT":2708.87,"AU":0.7880288112564909,"AV":0.046529806994360594,"AW":0.8276513823107052,"BB":300.98555555555555,"BC":2.4911111111111115,"BD":7,"BE":2}', "FormulaJSON": '{"R":"P82+Q82","T":"S82+R82","U":"P82/S82*100","AB":"T82","AR":"AP82+AQ82","AS":"AS64+S82","AT":"AS82+AR82","AU":"AP82/AS82*100","BB":"AT82/(BD82+BE82)","BC":"AR82/(BD82+BE82)"}' }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 83, "DataJSON": '{"O":"AUTOPLATEN - 9 STRIPPING & BLANKING","P":0.5,"Q":0,"R":0.5,"S":618.47,"T":618.97,"U":0.08084466506055264,"V":0,"W":0.08077935925812235,"AB":618.97,"AC":0.5,"AD":1,"AE":0,"AO":"AUTOPLATEN - 9 STRIPPING & BLANKING","AP":15.43333333333334,"AQ":26.08333333333337,"AR":41.51666666666671,"AS":2703.7,"AT":2745.2166666666667,"AU":0.5708226997571233,"AV":0.9647273489415754,"AW":1.512327502990051,"BB":228.76805555555555,"BC":3.4597222222222257,"BD":6,"BE":6}', "FormulaJSON": '{"R":"P83+Q83","T":"S83+R83","U":"P83/S83*100","AB":"T83/(AD83+AE83)","AC":"R83/(AD83+AE83)","AR":"AP83+AQ83","AS":"AS65+S83","AT":"AS83+AR83","AU":"AP83/AS83*100","BB":"AT83/(BD83+BE83)","BC":"AR83/(BD83+BE83)"}' }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 84, "DataJSON": '{"O":"AUTOPLATEN - 5 STAMPING","P":0.833333333333333,"Q":1.66666666666667,"R":2.500000000000003,"S":525.88,"T":528.38,"U":0.15846454197408782,"V":0.3169290839481764,"W":0.47314432794579714,"AB":105.676,"AC":0.5000000000000007,"AD":2,"AE":3,"AO":"AUTOPLATEN - 5 STAMPING","AP":9.583333333333336,"AQ":28.94999999999997,"AR":38.5333333333333,"AS":2439.86,"AT":2478.3933333333334,"AU":0.39278209951937143,"AV":1.186543490200256,"AW":1.554770698221158,"BB":91.79234567901234,"BC":1.4271604938271594,"BD":12,"BE":15}', "FormulaJSON": '{"R":"P84+Q84","T":"S84+R84","U":"P84/S84*100","AB":"T84/(AD84+AE84)","AC":"R84/(AD84+AE84)","AR":"AP84+AQ84","AS":"AS66+S84","AT":"AS84+AR84","AU":"AP84/AS84*100","BB":"AT84/(BD84+BE84)","BC":"AR84/(BD84+BE84)"}' }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 85, "DataJSON": '{"O":"AUTOPLATEN - 6 STAMPING","P":0,"Q":0.17,"R":0.17,"S":555.2,"T":555.37,"U":0,"V":0,"W":0.030610223814754128,"AB":555.37,"AC":0.17,"AD":0,"AE":1,"AO":"AUTOPLATEN - 6 STAMPING","AP":6.083333333333337,"AQ":8.083333333333334,"AR":14.166666666666671,"AS":2450.94,"AT":2465.1066666666666,"AU":0.24820409040341,"AV":0.329805435193572,"AW":0.5746877755120808,"BB":164.34044444444444,"BC":0.9444444444444448,"BD":8,"BE":7}', "FormulaJSON": '{"R":"P85+Q85","T":"S85+R85","W":"R85/T85*100","AB":"T85/(AD85+AE85)","AC":"R85/(AD85+AE85)","AR":"AP85+AQ85","AS":"AS67+S85","AT":"AS85+AR85","AU":"AP85/AS85*100","BB":"AT85/(BD85+BE85)","BC":"AR85/(BD85+BE85)"}' }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 87, "DataJSON": '{"W":0.3269207893359613,"AB":336.7804444444444,"AC":0.36166666666666697,"AD":9,"AE":8,"AW":1.902142010372774,"BB":149.2293256915187,"BC":1.9943782706966546,"BD":55,"BE":77}', "FormulaJSON": '{"W":"AVERAGE(W77:W86)","AB":"AVERAGE(AB77:AB86)","AC":"AVERAGE(AC77:AC86)","AD":"SUM(AD77:AD86)","AE":"SUM(AE77:AE86)","AW":"AVERAGE(AW77:AW86)","BB":"AVERAGE(BB77:BB86)","BC":"AVERAGE(BC77:BC86)","BD":"SUM(BD77:BD86)","BE":"SUM(BE77:BE86)"}' }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 88, "DataJSON": '{"B":"Highlite Issue","AI":"Highlite Issue"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 89, "DataJSON": '{"B":"Contributor MTBF score drop:","E":" ","AI":"Contributor MTBF score drop:"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 90, "DataJSON": '{"B":"Case paling lama penanganan pada  ","E":" ","AI":"Case paling lama penanganan pada  "}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 92, "DataJSON": '{"A":"MTD","B":46174,"AH":"YTD","AI":46174}', "FormulaJSON": '{"AI":"B92"}' }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 93, "DataJSON": '{"B":"Source: ODIN","AI":"Source: ODIN"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 94, "DataJSON": '{"P":"El BD","Q":"Mech BD","R":"Total Lost","S":"Run Hrs","T":"Run Hrs + Total lost","U":"%El","V":"%Mech","W":"% Total Lost","X":"MTBF EL","Y":"MTTR EL","Z":"MTBF Mech","AA":"MTTR Mech","AB":"MTBF Mch","AC":"MTTR Mch","AD":"BD Events EL","AE":"BD Event Mech","AP":"El BD","AQ":"Mech BD","AR":"Total Lost","AS":"Run Hrs","AT":"Run Hrs + Total lost","AU":"%El","AV":"%Mech","AW":"% Total Lost","AX":"MTBF EL","AY":"MTTR EL","AZ":"MTBF Mech","BA":"MTTR Mech","BB":"MTBF Mch","BC":"MTTR Mch","BD":"BD Events EL","BE":"BD Event Mech"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 95, "DataJSON": '{"O":"AUTOPLATEN - 1 MACHINE","AO":"AUTOPLATEN - 1 MACHINE"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 96, "DataJSON": '{"O":"AUTOPLATEN - 2 MACHINE","P":31.3333333333333,"Q":1.33333333333333,"R":32.66666666666663,"S":360.91,"T":393.57666666666665,"U":8.681758148384166,"V":0.36943651695251717,"W":8.29995003091307,"AB":65.59611111111111,"AC":5.444444444444438,"AD":4,"AE":2,"AO":"AUTOPLATEN - 2 MACHINE","AP":40.66666666666663,"AQ":53.56666666666663,"AR":94.23333333333326,"AS":1831.8500000000001,"AT":1926.0833333333335,"AU":2.2199779821855845,"AV":2.924184112600192,"AW":4.892484748842638,"BB":43.77462121212122,"BC":2.1416666666666653,"BD":15,"BE":29}', "FormulaJSON": '{"R":"P96+Q96","T":"S96+R96","U":"P96/S96*100","V":"Q96/S96*100","W":"R96/T96*100","AB":"T96/(AD96+AE96)","AC":"R96/(AD96+AE96)","AP":"AP78+P96","AQ":"AQ78+Q96","AR":"AP96+AQ96","AS":"AS78+S96","AT":"AS96+AR96","AU":"AP96/AS96*100","AV":"AQ96/AS96*100","AW":"AR96/AT96*100","BB":"AT96/(BD96+BE96)","BC":"AR96/(BD96+BE96)","BD":"BD78+AD96","BE":"BE78+AE96"}' }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 97, "DataJSON": '{"O":"AUTOPLATEN - 3 EVOLINE","AO":"AUTOPLATEN - 3 EVOLINE"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 98, "DataJSON": '{"O":"AUTOPLATEN - 4 STRIPPING & BLANKING","AO":"AUTOPLATEN - 4 STRIPPING & BLANKING"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 99, "DataJSON": '{"O":"AUTOPLATEN - 7 STRIPPING & BLANKING","P":30.8333333333333,"Q":4.75,"R":35.5833333333333,"S":493.47,"T":529.0533333333333,"U":6.24826906059807,"V":0.9625711796056498,"W":6.7258499458151615,"AB":58.7837037037037,"AC":3.9537037037037,"AD":3,"AE":6,"AO":"AUTOPLATEN - 7 STRIPPING & BLANKING","AP":41.29999999999997,"AQ":57.01666666666671,"AR":98.31666666666668,"AS":2574.71,"AT":2673.0266666666666,"AU":1.6040641470301498,"AV":2.214488880948406,"AW":3.6781027250008735,"BB":66.82566666666666,"BC":2.4579166666666667,"BD":14,"BE":26}', "FormulaJSON": '{"R":"P99+Q99","T":"S99+R99","U":"P99/S99*100","V":"Q99/S99*100","AB":"T99/(AD99+AE99)","AC":"R99/(AD99+AE99)","AP":"AP81+P99","AR":"AP99+AQ99","AS":"AS81+S99","AT":"AS99+AR99","AU":"AP99/AS99*100","AV":"AQ99/AS99*100","BB":"AT99/(BD99+BE99)","BC":"AR99/(BD99+BE99)","BD":"BD81+AD99"}' }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 100, "DataJSON": '{"O":"AUTOPLATEN - 8 STRIPPING & BLANKING","P":32.3333333333333,"Q":1.5,"R":33.8333333333333,"S":490.27,"T":524.1033333333332,"U":6.5950054731746395,"V":0.30595386215758663,"W":6.455469977294549,"AB":131.0258333333333,"AC":8.458333333333325,"AD":2,"AE":2,"AO":"AUTOPLATEN - 8 STRIPPING & BLANKING","AP":53.5033333333333,"AQ":2.75,"AR":56.2533333333333,"AS":3176.72,"AT":3232.973333333333,"AU":1.6842319541329833,"AV":0.08656727693973659,"AW":1.73998754500501,"BB":248.69025641025638,"BC":4.327179487179484,"BD":9,"BE":4}', "FormulaJSON": '{"R":"P100+Q100","T":"S100+R100","U":"P100/S100*100","AB":"T100/(AD100+AE100)","AC":"R100/(AD100+AE100)","AR":"AP100+AQ100","AS":"AS82+S100","AT":"AS100+AR100","AU":"AP100/AS100*100","BB":"AT100/(BD100+BE100)","BC":"AR100/(BD100+BE100)"}' }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 101, "DataJSON": '{"O":"AUTOPLATEN - 9 STRIPPING & BLANKING","P":32.8333333333333,"Q":0,"R":32.8333333333333,"S":548.22,"T":581.0533333333333,"U":5.989079809808708,"V":0,"W":5.650657426742233,"AB":96.84222222222222,"AC":5.472222222222217,"AD":6,"AE":0,"AO":"AUTOPLATEN - 9 STRIPPING & BLANKING","AP":48.26666666666664,"AQ":26.08333333333337,"AR":74.35000000000001,"AS":3251.92,"AT":3326.27,"AU":1.4842513550968854,"AV":0.8020902523227316,"AW":2.235236466071606,"BB":184.7927777777778,"BC":4.130555555555556,"BD":12,"BE":6}', "FormulaJSON": '{"R":"P101+Q101","T":"S101+R101","U":"P101/S101*100","AB":"T101/(AD101+AE101)","AC":"R101/(AD101+AE101)","AR":"AP101+AQ101","AS":"AS83+S101","AT":"AS101+AR101","AU":"AP101/AS101*100","BB":"AT101/(BD101+BE101)","BC":"AR101/(BD101+BE101)"}' }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 102, "DataJSON": '{"O":"AUTOPLATEN - 5 STAMPING","P":29.5,"Q":0.416666666666667,"R":29.916666666666668,"S":508.94,"T":538.8566666666667,"U":5.7963610641725944,"V":0.08186950655611015,"W":5.551878359736974,"AB":179.6188888888889,"AC":9.972222222222223,"AD":1,"AE":2,"AO":"AUTOPLATEN - 5 STAMPING","AP":39.083333333333336,"AQ":29.36666666666664,"AR":68.44999999999997,"AS":2948.8,"AT":3017.25,"AU":1.3253979019714235,"AV":0.995885331886416,"AW":2.2686220896511715,"BB":100.575,"BC":2.281666666666666,"BD":13,"BE":17}', "FormulaJSON": '{"R":"P102+Q102","T":"S102+R102","U":"P102/S102*100","AB":"T102/(AD102+AE102)","AC":"R102/(AD102+AE102)","AR":"AP102+AQ102","AS":"AS84+S102","AT":"AS102+AR102","AU":"AP102/AS102*100","BB":"AT102/(BD102+BE102)","BC":"AR102/(BD102+BE102)"}' }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 103, "DataJSON": '{"O":"AUTOPLATEN - 6 STAMPING","P":29.5,"Q":3,"R":32.5,"S":574.27,"T":606.77,"U":0,"V":0,"W":5.356230532162105,"AB":151.6925,"AC":8.125,"AD":1,"AE":3,"AO":"AUTOPLATEN - 6 STAMPING","AP":35.583333333333336,"AQ":11.083333333333334,"AR":46.66666666666667,"AS":3025.21,"AT":3071.8766666666666,"AU":1.176226884524821,"AV":0.3663657509175672,"AW":1.5191582127320653,"BB":161.67771929824562,"BC":2.456140350877193,"BD":9,"BE":10}', "FormulaJSON": '{"R":"P103+Q103","T":"S103+R103","W":"R103/T103*100","AB":"T103/(AD103+AE103)","AC":"R103/(AD103+AE103)","AR":"AP103+AQ103","AS":"AS85+S103","AT":"AS103+AR103","AU":"AP103/AS103*100","BB":"AT103/(BD103+BE103)","BC":"AR103/(BD103+BE103)"}' }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 105, "DataJSON": '{"W":6.340006045444016,"AB":113.92654320987653,"AC":6.904320987654317,"AD":17,"AE":15,"AW":2.722265297883894,"BB":134.38934022751127,"BC":2.9658542322687054,"BD":72,"BE":92}', "FormulaJSON": '{"W":"AVERAGE(W95:W104)","AB":"AVERAGE(AB95:AB104)","AC":"AVERAGE(AC95:AC104)","AD":"SUM(AD95:AD104)","AE":"SUM(AE95:AE104)","AW":"AVERAGE(AW95:AW104)","BB":"AVERAGE(BB95:BB104)","BC":"AVERAGE(BC95:BC104)","BD":"SUM(BD95:BD104)","BE":"SUM(BE95:BE104)"}' }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 106, "DataJSON": '{"B":"Highlite Issue","AI":"Highlite Issue"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 107, "DataJSON": '{"B":"Contributor MTBF score drop:","E":" ","AI":"Contributor MTBF score drop:"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 108, "DataJSON": '{"B":"Case paling lama penanganan pada  ","E":" ","AI":"Case paling lama penanganan pada  "}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 110, "DataJSON": '{"A":"MTD","B":46204,"AH":"YTD","AI":46204}', "FormulaJSON": '{"AI":"B110"}' }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 111, "DataJSON": '{"B":"Source: ODIN","AI":"Source: ODIN"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 112, "DataJSON": '{"P":"El BD","Q":"Mech BD","R":"Total Lost","S":"Run Hrs","T":"Run Hrs + Total lost","U":"%El","V":"%Mech","W":"% Total Lost","X":"MTBF EL","Y":"MTTR EL","Z":"MTBF Mech","AA":"MTTR Mech","AB":"MTBF Mch","AC":"MTTR Mch","AD":"BD Events EL","AE":"BD Event Mech","AP":"El BD","AQ":"Mech BD","AR":"Total Lost","AS":"Run Hrs","AT":"Run Hrs + Total lost","AU":"%El","AV":"%Mech","AW":"% Total Lost","AX":"MTBF EL","AY":"MTTR EL","AZ":"MTBF Mech","BA":"MTTR Mech","BB":"MTBF Mch","BC":"MTTR Mch","BD":"BD Events EL","BE":"BD Event Mech"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 113, "DataJSON": '{"O":"AUTOPLATEN - 1 MACHINE","AO":"AUTOPLATEN - 1 MACHINE"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 114, "DataJSON": '{"O":"AUTOPLATEN - 2 MACHINE","P":1.75,"Q":19.3333333333333,"R":21.0833333333333,"S":338.91,"T":359.99333333333334,"U":0.5163612758549467,"V":5.7045626665879725,"W":5.856589936850673,"AB":25.713809523809523,"AC":1.5059523809523785,"AD":3,"AE":11,"AO":"AUTOPLATEN - 2 MACHINE","AP":42.41666666666663,"AQ":72.89999999999992,"AR":115.31666666666655,"AS":2170.76,"AT":2286.076666666667,"AU":1.954000749353527,"AV":3.3582708360205604,"AW":5.044304434234483,"BB":39.41511494252874,"BC":1.9882183908045956,"BD":18,"BE":40}', "FormulaJSON": '{"R":"P114+Q114","T":"S114+R114","U":"P114/S114*100","V":"Q114/S114*100","W":"R114/T114*100","AB":"T114/(AD114+AE114)","AC":"R114/(AD114+AE114)","AP":"AP96+P114","AQ":"AQ96+Q114","AR":"AP114+AQ114","AS":"AS96+S114","AT":"AS114+AR114","AU":"AP114/AS114*100","AV":"AQ114/AS114*100","AW":"AR114/AT114*100","BB":"AT114/(BD114+BE114)","BC":"AR114/(BD114+BE114)","BD":"BD96+AD114","BE":"BE96+AE114"}' }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 115, "DataJSON": '{"O":"AUTOPLATEN - 3 EVOLINE","AO":"AUTOPLATEN - 3 EVOLINE"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 116, "DataJSON": '{"O":"AUTOPLATEN - 4 STRIPPING & BLANKING","AO":"AUTOPLATEN - 4 STRIPPING & BLANKING"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 117, "DataJSON": '{"O":"AUTOPLATEN - 7 STRIPPING & BLANKING","P":1.16666666666667,"Q":4.5,"R":5.66666666666667,"S":533,"T":538.6666666666666,"U":0.21888680425265855,"V":0.8442776735459663,"W":1.0519801980198025,"AB":134.66666666666666,"AC":1.4166666666666674,"AD":1,"AE":3,"AO":"AUTOPLATEN - 7 STRIPPING & BLANKING","AP":42.46666666666664,"AQ":61.51666666666671,"AR":103.98333333333335,"AS":3107.71,"AT":3211.6933333333336,"AU":1.3664938706207026,"AV":1.9794854303222216,"AW":3.237648260315431,"BB":72.99303030303031,"BC":2.3632575757575762,"BD":15,"BE":29}', "FormulaJSON": '{"R":"P117+Q117","T":"S117+R117","U":"P117/S117*100","V":"Q117/S117*100","AB":"T117/(AD117+AE117)","AC":"R117/(AD117+AE117)","AP":"AP99+P117","AR":"AP117+AQ117","AS":"AS99+S117","AT":"AS117+AR117","AU":"AP117/AS117*100","AV":"AQ117/AS117*100","BB":"AT117/(BD117+BE117)","BC":"AR117/(BD117+BE117)","BD":"BD99+AD117"}' }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 118, "DataJSON": '{"O":"AUTOPLATEN - 8 STRIPPING & BLANKING","P":0,"Q":2.31666666666667,"R":2.31666666666667,"S":531.67,"T":533.9866666666667,"U":0,"V":0.4357339452417233,"W":0.4338435416614653,"AB":177.99555555555557,"AC":0.7722222222222234,"AD":0,"AE":3,"AO":"AUTOPLATEN - 8 STRIPPING & BLANKING","AP":53.5033333333333,"AQ":5.06666666666667,"AR":58.56999999999997,"AS":3708.39,"AT":3766.96,"AU":1.4427644701159614,"AV":0.1366271256978546,"AW":1.5548346677426883,"BB":235.435,"BC":3.6606249999999982,"BD":9,"BE":7}', "FormulaJSON": '{"R":"P118+Q118","T":"S118+R118","U":"P118/S118*100","AB":"T118/(AD118+AE118)","AC":"R118/(AD118+AE118)","AR":"AP118+AQ118","AS":"AS100+S118","AT":"AS118+AR118","AU":"AP118/AS118*100","BB":"AT118/(BD118+BE118)","BC":"AR118/(BD118+BE118)"}' }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 119, "DataJSON": '{"O":"AUTOPLATEN - 9 STRIPPING & BLANKING","P":0,"Q":1.5,"R":1.5,"S":545.03,"T":546.53,"U":0,"V":0.2752142083921986,"W":0.2744588586170933,"AB":136.6325,"AC":0.375,"AD":0,"AE":4,"AO":"AUTOPLATEN - 9 STRIPPING & BLANKING","AP":48.26666666666664,"AQ":27.58333333333337,"AR":75.85000000000001,"AS":3796.95,"AT":3872.7999999999997,"AU":1.2711957404407916,"AV":0.7264602729383682,"AW":1.9585312951869451,"BB":176.03636363636363,"BC":3.447727272727273,"BD":12,"BE":10}', "FormulaJSON": '{"R":"P119+Q119","T":"S119+R119","U":"P119/S119*100","AB":"T119/(AD119+AE119)","AC":"R119/(AD119+AE119)","AR":"AP119+AQ119","AS":"AS101+S119","AT":"AS119+AR119","AU":"AP119/AS119*100","BB":"AT119/(BD119+BE119)","BC":"AR119/(BD119+BE119)"}' }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 120, "DataJSON": '{"O":"AUTOPLATEN - 5 STAMPING","P":1.58333333333333,"Q":3.83333333333333,"R":5.41666666666666,"S":453.28,"T":458.69666666666666,"U":0.3493058006824325,"V":0.8456877279679956,"W":1.180882064399856,"AB":65.52809523809523,"AC":0.7738095238095228,"AD":2,"AE":5,"AO":"AUTOPLATEN - 5 STAMPING","AP":40.666666666666664,"AQ":33.19999999999997,"AR":73.86666666666663,"AS":3402.08,"AT":3475.9466666666667,"AU":1.195347160168681,"AV":0.9758735832196764,"AW":2.125080553594991,"BB":93.94450450450451,"BC":1.9963963963963955,"BD":15,"BE":22}', "FormulaJSON": '{"R":"P120+Q120","T":"S120+R120","U":"P120/S120*100","AB":"T120/(AD120+AE120)","AC":"R120/(AD120+AE120)","AR":"AP120+AQ120","AS":"AS102+S120","AT":"AS120+AR120","AU":"AP120/AS120*100","BB":"AT120/(BD120+BE120)","BC":"AR120/(BD120+BE120)"}' }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 121, "DataJSON": '{"O":"AUTOPLATEN - 6 STAMPING","P":0.666666666666667,"Q":2,"R":2.666666666666667,"S":442.5,"T":445.1666666666667,"U":0,"V":0,"W":0.5990265818045676,"AB":89.03333333333333,"AC":0.5333333333333334,"AD":1,"AE":4,"AO":"AUTOPLATEN - 6 STAMPING","AP":36.25,"AQ":13.083333333333334,"AR":49.333333333333336,"AS":3467.71,"AT":3517.0433333333335,"AU":1.045358464231438,"AV":0.3772902962858294,"AW":1.4026933608059042,"BB":146.54347222222222,"BC":2.055555555555556,"BD":10,"BE":14}', "FormulaJSON": '{"R":"P121+Q121","T":"S121+R121","W":"R121/T121*100","AB":"T121/(AD121+AE121)","AC":"R121/(AD121+AE121)","AR":"AP121+AQ121","AS":"AS103+S121","AT":"AS121+AR121","AU":"AP121/AS121*100","BB":"AT121/(BD121+BE121)","BC":"AR121/(BD121+BE121)"}' }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 123, "DataJSON": '{"W":1.566130196892243,"AB":104.92832671957672,"AC":0.8961640211640209,"AD":7,"AE":30,"AW":2.553848761980074,"BB":127.39458093477491,"BC":2.5852966985402324,"BD":79,"BE":122}', "FormulaJSON": '{"W":"AVERAGE(W113:W122)","AB":"AVERAGE(AB113:AB122)","AC":"AVERAGE(AC113:AC122)","AD":"SUM(AD113:AD122)","AE":"SUM(AE113:AE122)","AW":"AVERAGE(AW113:AW122)","BB":"AVERAGE(BB113:BB122)","BC":"AVERAGE(BC113:BC122)","BD":"SUM(BD113:BD122)","BE":"SUM(BE113:BE122)"}' }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 124, "DataJSON": '{"B":"Highlite Issue","AI":"Highlite Issue"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 125, "DataJSON": '{"B":"Contributor MTBF score drop:","E":" ","AI":"Contributor MTBF score drop:"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 01 Autoplaten", "Row": 126, "DataJSON": '{"B":"Case paling lama penanganan pada  ","E":" ","AI":"Case paling lama penanganan pada  "}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 1, "DataJSON": '{"A":"MTD","B":46023,"W":"YTD","X":46023}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 2, "DataJSON": '{"B":"Source: ODIN","X":"Source: ODIN"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 3, "DataJSON": '{"E":"El BD","F":"Mech BD","G":"Total Lost","H":"Run Hrs","I":"Run Hrs + Total lost","J":"%El","K":"%Mech","L":"% Total Lost","M":"MTBF EL","N":"MTTR EL","O":"MTBF Mech","P":"MTTR Mech","Q":"MTBF Mch","R":"MTTR Mch","S":"BD Events EL","T":"BD Event Mech","AA":"El BD","AB":"Mech BD","AC":"Total Lost","AD":"Run Hrs","AE":"Run Hrs + Total lost","AF":"%El","AG":"%Mech","AH":"% Total Lost","AI":"MTBF EL","AJ":"MTTR EL","AK":"MTBF Mech","AL":"MTTR Mech","AM":"MTBF Mch","AN":"MTTR Mch","AO":"BD Events EL","AP":"BD Event Mech"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 4, "DataJSON": '{"D":"FOLDER GLUER - 1 MACHINE","E":0,"F":2.41666666666667,"G":2.41666666666667,"H":547.46,"I":549.8766666666667,"J":0,"K":0.44143255519429175,"L":0.4394924922558398,"Q":109.97533333333334,"R":0.483333333333334,"S":0,"T":5,"Z":"FOLDER GLUER - 1 MACHINE","AA":0,"AB":2.41666666666667,"AC":2.41666666666667,"AD":547.46,"AE":549.8766666666667,"AF":0,"AG":0.44143255519429175,"AH":0.4394924922558398,"AM":109.97533333333334,"AN":0.483333333333334,"AO":0,"AP":5}', "FormulaJSON": '{"G":"E4+F4","I":"H4+G4","J":"E4/H4*100","K":"F4/H4*100","Q":"I4/(S4+T4)","R":"G4/(S4+T4)","AC":"AA4+AB4","AE":"AD4+AC4","AF":"AA4/AD4*100","AG":"AB4/AD4*100","AM":"AE4/(AO4+AP4)","AN":"AC4/(AO4+AP4)"}' }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 5, "DataJSON": '{"D":"FOLDER GLUER - 2 MACHINE","E":0,"F":5,"G":5,"H":503.98,"I":508.98,"J":0,"K":0.9921028612246517,"L":0.982356870603953,"Q":72.71142857142857,"R":0.7142857142857143,"S":0,"T":7,"Z":"FOLDER GLUER - 2 MACHINE","AA":0,"AB":5,"AC":5,"AD":503.98,"AE":508.98,"AF":0,"AG":0.9921028612246517,"AH":0.982356870603953,"AM":72.71142857142857,"AN":0.7142857142857143,"AO":0,"AP":7}', "FormulaJSON": '{"G":"E5+F5","J":"E5/H5*100","Q":"I5/(S5+T5)","R":"G5/(S5+T5)","AC":"AA5+AB5","AF":"AA5/AD5*100","AM":"AE5/(AO5+AP5)","AN":"AC5/(AO5+AP5)"}' }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 6, "DataJSON": '{"D":"FOLDER GLUER - 3 MACHINE","E":0.333333333333333,"F":6.5,"G":6.833333333333333,"H":520.76,"I":527.5933333333334,"J":0.06400901246895556,"K":1.248175743144635,"L":1.2951894767434513,"Q":87.93222222222222,"R":1.1388888888888888,"S":1,"T":5,"Z":"FOLDER GLUER - 3 MACHINE","AA":0.333333333333333,"AB":6.5,"AC":6.833333333333333,"AD":520.76,"AE":527.5933333333334,"AF":0.06400901246895556,"AG":1.248175743144635,"AH":1.2951894767434513,"AM":87.93222222222222,"AN":1.1388888888888888,"AO":1,"AP":5}', "FormulaJSON": '{"G":"E6+F6","J":"E6/H6*100","Q":"I6/(S6+T6)","R":"G6/(S6+T6)","AC":"AA6+AB6","AF":"AA6/AD6*100","AM":"AE6/(AO6+AP6)","AN":"AC6/(AO6+AP6)"}' }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 7, "DataJSON": '{"D":"FOLDER GLUER - 4 MACHINE","I":0,"Z":"FOLDER GLUER - 4 MACHINE","AE":0}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 8, "DataJSON": '{"C":"INSPECTION - 2 MACHINE","I":0,"Y":"INSPECTION - 2 MACHINE","AE":0}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 9, "DataJSON": '{"C":"INSPECTION - 3 MACHINE","H":485.32,"I":485.32,"L":0,"Q":485.32,"R":0,"S":0,"T":0,"Y":"INSPECTION - 3 MACHINE","AD":485.32,"AE":485.32,"AH":0,"AM":485.32,"AN":0,"AO":0,"AP":0}', "FormulaJSON": '{"L":"G9/I9*100","Q":"I9","AH":"AC9/AE9*100","AM":"AE9"}' }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 10, "DataJSON": '{"C":"INSPECTION - 4 MACHINE","F":0,"G":0,"H":229.2,"I":229.2,"Q":229.2,"R":0,"S":0,"T":0,"Y":"INSPECTION - 4 MACHINE","AB":0,"AC":0,"AD":229.2,"AE":229.2,"AM":229.2,"AN":0,"AO":0,"AP":0}', "FormulaJSON": '{"G":"E10+F10","Q":"I10","AC":"AA10+AB10","AM":"AE10"}' }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 11, "DataJSON": '{"L":0.6792597099008111,"Q":197.02779682539682,"R":0.46730158730158744,"S":1,"T":17,"AH":0.6792597099008111,"AM":197.02779682539682,"AN":0.46730158730158744,"AO":1,"AP":17}', "FormulaJSON": '{"L":"AVERAGE(L4:L10)","Q":"AVERAGE(Q4:Q10)","R":"AVERAGE(R4:R10)","S":"SUM(S4:S10)","T":"SUM(T4:T10)","AH":"AVERAGE(AH4:AH10)","AM":"AVERAGE(AM4:AM10)","AN":"AVERAGE(AN4:AN10)","AO":"SUM(AO4:AO10)","AP":"SUM(AP4:AP10)"}' }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 12, "DataJSON": '{"B":"Highlite Issue","X":"Highlite Issue"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 13, "DataJSON": '{"B":"Contributor MTBF score drop:","X":"Contributor MTBF score drop:"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 14, "DataJSON": '{"B":"Case paling lama penanganan pada  ","X":"Case paling lama penanganan pada  "}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 16, "DataJSON": '{"A":"MTD","B":46054,"W":"YTD","X":46054}', "FormulaJSON": '{"X":"B16"}' }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 17, "DataJSON": '{"B":"Source: ODIN","X":"Source: ODIN"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 18, "DataJSON": '{"E":"El BD","F":"Mech BD","G":"Total Lost","H":"Run Hrs","I":"Run Hrs + Total lost","J":"%El","K":"%Mech","L":"% Total Lost","M":"MTBF EL","N":"MTTR EL","O":"MTBF Mech","P":"MTTR Mech","Q":"MTBF Mch","R":"MTTR Mch","S":"BD Events EL","T":"BD Event Mech","AA":"El BD","AB":"Mech BD","AC":"Total Lost","AD":"Run Hrs","AE":"Run Hrs + Total lost","AF":"%El","AG":"%Mech","AH":"% Total Lost","AI":"MTBF EL","AJ":"MTTR EL","AK":"MTBF Mech","AL":"MTTR Mech","AM":"MTBF Mch","AN":"MTTR Mch","AO":"BD Events EL","AP":"BD Event Mech"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 19, "DataJSON": '{"D":"FOLDER GLUER - 1 MACHINE","E":0,"F":3.08333333333333,"G":3.08333333333333,"H":506.62,"I":509.7033333333333,"J":0,"K":0.6086086876422822,"L":0.6049270490677577,"Q":101.94066666666666,"R":0.616666666666666,"S":0,"T":5,"Z":"FOLDER GLUER - 1 MACHINE","AA":0,"AB":5.5,"AC":5.5,"AD":1054.08,"AE":1059.58,"AF":0,"AG":1.050041242836574,"AH":1.0444195413235975,"AM":211.916,"AN":1.1,"AO":0,"AP":10}', "FormulaJSON": '{"G":"E19+F19","I":"H19+G19","J":"E19/H19*100","K":"F19/H19*100","Q":"I19/(S19+T19)","R":"G19/(S19+T19)","AA":"AA4+E19","AM":"AM4+Q19"}' }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 20, "DataJSON": '{"D":"FOLDER GLUER - 2 MACHINE","E":0,"F":4,"G":4,"H":512.79,"I":516.79,"J":0,"K":0.7800464127615594,"L":0.7740087849997098,"Q":103.35799999999999,"R":0.8,"S":0,"T":5,"Z":"FOLDER GLUER - 2 MACHINE","AA":0,"AB":9,"AC":9,"AD":1016.77,"AE":1025.77,"AF":0,"AG":1.7721492739862112,"AH":1.7563656556036629,"AM":176.06942857142855,"AN":1.5142857142857142,"AO":0,"AP":12}', "FormulaJSON": '{"G":"E20+F20","J":"E20/H20*100","Q":"I20/(S20+T20)","R":"G20/(S20+T20)"}' }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 21, "DataJSON": '{"D":"FOLDER GLUER - 3 MACHINE","E":0,"F":21.25,"G":21.25,"H":513.98,"I":535.23,"J":0,"K":4.134402116813884,"L":3.970255777889879,"Q":38.230714285714285,"R":1.5178571428571428,"S":0,"T":14,"Z":"FOLDER GLUER - 3 MACHINE","AA":0.333333333333333,"AB":27.75,"AC":28.083333333333332,"AD":1034.74,"AE":1062.8233333333333,"AF":0.06400901246895556,"AG":5.382577859958518,"AH":5.26544525463333,"AM":126.16293650793651,"AN":2.6567460317460316,"AO":1,"AP":19}', "FormulaJSON": '{"G":"E21+F21","J":"E21/H21*100","Q":"I21/(S21+T21)","R":"G21/(S21+T21)"}' }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 22, "DataJSON": '{"D":"FOLDER GLUER - 4 MACHINE","I":0,"Z":"FOLDER GLUER - 4 MACHINE"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 23, "DataJSON": '{"C":"INSPECTION - 2 MACHINE","I":0,"Y":"INSPECTION - 2 MACHINE"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 24, "DataJSON": '{"C":"INSPECTION - 3 MACHINE","E":0,"F":0.67,"G":0.67,"H":329.08,"I":329.75,"L":0.2031842304776346,"Q":329.75,"R":0.67,"S":0,"T":1,"Y":"INSPECTION - 3 MACHINE","AA":0,"AB":0.67,"AC":0.67,"AD":814.4,"AE":815.0699999999999,"AF":0,"AG":0,"AH":0.2031842304776346,"AM":815.0699999999999,"AN":0.67,"AO":0,"AP":1}', "FormulaJSON": '{"G":"E24+F24","L":"G24/I24*100","Q":"I24/(S24+T24)","R":"G24/(S24+T24)","AA":"AA9+E24","AM":"AM9+Q24"}' }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 25, "DataJSON": '{"C":"INSPECTION - 4 MACHINE","E":0,"F":0.5,"G":0.5,"H":293.94,"I":294.44,"L":0.16981388398315447,"Q":294.44,"R":0.5,"S":0,"T":1,"Y":"INSPECTION - 4 MACHINE","AA":0,"AB":0.5,"AC":0.5,"AD":523.14,"AE":523.64,"AF":0,"AG":0,"AH":0.16981388398315447,"AM":523.64,"AN":0.5,"AO":0,"AP":1}', "FormulaJSON": '{"G":"E25+F25","L":"G25/I25*100","Q":"I25/(S25+T25)","R":"G25/(S25+T25)"}' }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 26, "DataJSON": '{"L":1.144437945283627,"Q":173.5438761904762,"R":0.8209047619047617,"S":0,"T":26,"AH":1.6878457132042761,"AM":370.571673015873,"AN":1.2882063492063491,"AO":1,"AP":43}', "FormulaJSON": '{"L":"AVERAGE(L19:L25)","Q":"AVERAGE(Q19:Q25)","R":"AVERAGE(R19:R25)","S":"SUM(S19:S25)","T":"SUM(T19:T25)","AH":"AVERAGE(AH19:AH25)","AM":"AVERAGE(AM19:AM25)","AN":"AVERAGE(AN19:AN25)","AO":"SUM(AO19:AO25)","AP":"SUM(AP19:AP25)"}' }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 27, "DataJSON": '{"B":"Highlite Issue","X":"Highlite Issue"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 28, "DataJSON": '{"B":"Contributor MTBF score drop:","X":"Contributor MTBF score drop:"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 29, "DataJSON": '{"B":"Case paling lama penanganan pada  ","X":"Case paling lama penanganan pada  "}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 31, "DataJSON": '{"A":"MTD","B":46082,"W":"YTD","X":46082}', "FormulaJSON": '{"X":"B31"}' }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 32, "DataJSON": '{"B":"Source: ODIN","X":"Source: ODIN"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 33, "DataJSON": '{"E":"El BD","F":"Mech BD","G":"Total Lost","H":"Run Hrs","I":"Run Hrs + Total lost","J":"%El","K":"%Mech","L":"% Total Lost","M":"MTBF EL","N":"MTTR EL","O":"MTBF Mech","P":"MTTR Mech","Q":"MTBF Mch","R":"MTTR Mch","S":"BD Events EL","T":"BD Event Mech","AA":"El BD","AB":"Mech BD","AC":"Total Lost","AD":"Run Hrs","AE":"Run Hrs + Total lost","AF":"%El","AG":"%Mech","AH":"% Total Lost","AI":"MTBF EL","AJ":"MTTR EL","AK":"MTBF Mech","AL":"MTTR Mech","AM":"MTBF Mch","AN":"MTTR Mch","AO":"BD Events EL","AP":"BD Event Mech"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 34, "DataJSON": '{"D":"FOLDER GLUER - 1 MACHINE","E":24.8333333333333,"F":1.83333333333333,"G":26.66666666666663,"H":406.9,"I":433.5666666666666,"J":6.103055623822389,"K":0.450561153436552,"L":6.150534327669709,"Q":43.35666666666666,"R":2.666666666666663,"S":7,"T":3,"Z":"FOLDER GLUER - 1 MACHINE","AA":24.8333333333333,"AB":7.33333333333333,"AC":32.16666666666663,"AD":1460.98,"AE":1493.1466666666665,"AF":6.103055623822389,"AG":1.500602396273126,"AH":7.194953868993306,"AM":255.27266666666665,"AN":3.766666666666663,"AO":7,"AP":13}', "FormulaJSON": '{"G":"E34+F34","I":"H34+G34","J":"E34/H34*100","K":"F34/H34*100","Q":"I34/(S34+T34)","R":"G34/(S34+T34)","AA":"AA19+E34","AM":"AM19+Q34"}' }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 35, "DataJSON": '{"D":"FOLDER GLUER - 2 MACHINE","E":0,"F":3.58333333333333,"G":3.58333333333333,"H":401.02,"I":404.6033333333333,"J":0,"K":0.8935547686732157,"L":0.8856410805645026,"Q":67.43388888888889,"R":0.5972222222222217,"S":0,"T":6,"Z":"FOLDER GLUER - 2 MACHINE","AA":0,"AB":12.58333333333333,"AC":12.58333333333333,"AD":1417.79,"AE":1430.3733333333332,"AF":0,"AG":2.665704042659427,"AH":2.6420067361681654,"AM":243.50331746031742,"AN":2.1115079365079357,"AO":0,"AP":18}', "FormulaJSON": '{"G":"E35+F35","J":"E35/H35*100","Q":"I35/(S35+T35)","R":"G35/(S35+T35)"}' }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 36, "DataJSON": '{"D":"FOLDER GLUER - 3 MACHINE","E":0,"F":9.5,"G":9.5,"H":443.56,"I":453.06,"J":0,"K":2.141762106592118,"L":2.0968525140158034,"Q":75.51,"R":1.5833333333333333,"S":0,"T":6,"Z":"FOLDER GLUER - 3 MACHINE","AA":0.333333333333333,"AB":37.25,"AC":37.58333333333333,"AD":1478.3,"AE":1515.8833333333332,"AF":0.06400901246895556,"AG":7.524339966550636,"AH":7.3622977686491335,"AM":201.67293650793653,"AN":4.240079365079365,"AO":1,"AP":25}', "FormulaJSON": '{"G":"E36+F36","J":"E36/H36*100","Q":"I36/(S36+T36)","R":"G36/(S36+T36)"}' }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 37, "DataJSON": '{"D":"FOLDER GLUER - 4 MACHINE","I":0,"Z":"FOLDER GLUER - 4 MACHINE"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 38, "DataJSON": '{"C":"INSPECTION - 2 MACHINE","I":0,"Y":"INSPECTION - 2 MACHINE"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 39, "DataJSON": '{"C":"INSPECTION - 3 MACHINE","E":0,"F":0.5,"G":0.5,"H":368.85,"I":369.35,"L":0.13537295248409367,"Q":369.35,"R":0.5,"S":0,"T":1,"Y":"INSPECTION - 3 MACHINE","AA":0,"AB":1.17,"AC":1.17,"AD":1183.25,"AE":1184.42,"AF":0,"AG":0,"AH":0.33855718296172826,"AM":1184.42,"AN":1.17,"AO":0,"AP":2}', "FormulaJSON": '{"G":"E39+F39","L":"G39/I39*100","Q":"I39/(S39+T39)","R":"G39/(S39+T39)","AA":"AA24+E39","AM":"AM24+Q39"}' }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 40, "DataJSON": '{"C":"INSPECTION - 4 MACHINE","E":0,"F":0.64,"G":0.64,"H":306.67,"I":307.31,"L":0.20825876151117764,"Q":307.31,"R":0.64,"S":0,"T":1,"Y":"INSPECTION - 4 MACHINE","AA":0,"AB":1.1400000000000001,"AC":1.1400000000000001,"AD":829.81,"AE":830.95,"AF":0,"AG":0,"AH":0.3780726454943321,"AM":830.95,"AN":1.1400000000000001,"AO":0,"AP":2}', "FormulaJSON": '{"G":"E40+F40","L":"G40/I40*100","Q":"I40/(S40+T40)","R":"G40/(S40+T40)"}' }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 41, "DataJSON": '{"L":1.8953319272490574,"Q":172.59211111111114,"R":1.1974444444444434,"S":7,"T":17,"AH":3.583177640453333,"AM":543.1637841269842,"AN":2.485650793650793,"AO":8,"AP":60}', "FormulaJSON": '{"L":"AVERAGE(L34:L40)","Q":"AVERAGE(Q34:Q40)","R":"AVERAGE(R34:R40)","S":"SUM(S34:S40)","T":"SUM(T34:T40)","AH":"AVERAGE(AH34:AH40)","AM":"AVERAGE(AM34:AM40)","AN":"AVERAGE(AN34:AN40)","AO":"SUM(AO34:AO40)","AP":"SUM(AP34:AP40)"}' }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 42, "DataJSON": '{"B":"Highlite Issue","X":"Highlite Issue"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 43, "DataJSON": '{"B":"Contributor MTBF score drop:","X":"Contributor MTBF score drop:"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 44, "DataJSON": '{"B":"Case paling lama penanganan pada  ","X":"Case paling lama penanganan pada  "}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 46, "DataJSON": '{"A":"MTD","B":46113,"W":"YTD","X":46113}', "FormulaJSON": '{"X":"B46"}' }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 47, "DataJSON": '{"B":"Source: ODIN","X":"Source: ODIN"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 48, "DataJSON": '{"E":"El BD","F":"Mech BD","G":"Total Lost","H":"Run Hrs","I":"Run Hrs + Total lost","J":"%El","K":"%Mech","L":"% Total Lost","M":"MTBF EL","N":"MTTR EL","O":"MTBF Mech","P":"MTTR Mech","Q":"MTBF Mch","R":"MTTR Mch","S":"BD Events EL","T":"BD Event Mech","AA":"El BD","AB":"Mech BD","AC":"Total Lost","AD":"Run Hrs","AE":"Run Hrs + Total lost","AF":"%El","AG":"%Mech","AH":"% Total Lost","AI":"MTBF EL","AJ":"MTTR EL","AK":"MTBF Mech","AL":"MTTR Mech","AM":"MTBF Mch","AN":"MTTR Mch","AO":"BD Events EL","AP":"BD Event Mech"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 49, "DataJSON": '{"D":"FOLDER GLUER - 1 MACHINE","E":0,"F":4,"G":4,"H":565.59,"I":569.59,"J":0,"K":0.7072260824979225,"L":0.7022595200056181,"Q":81.37,"R":0.5714285714285714,"S":0,"T":7,"Z":"FOLDER GLUER - 1 MACHINE","AA":24.8333333333333,"AB":11.33333333333333,"AC":36.16666666666663,"AD":2026.5700000000002,"AE":2062.7366666666667,"AF":6.103055623822389,"AG":2.2078284787710487,"AH":7.8972133889989236,"AM":336.6426666666666,"AN":4.338095238095234,"AO":7,"AP":20}', "FormulaJSON": '{"G":"E49+F49","I":"H49+G49","J":"E49/H49*100","K":"F49/H49*100","Q":"I49/(S49+T49)","R":"G49/(S49+T49)","AA":"AA34+E49","AM":"AM34+Q49"}' }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 50, "DataJSON": '{"D":"FOLDER GLUER - 2 MACHINE","E":0.5,"F":3.58333333333333,"G":4.08333333333333,"H":595.21,"I":599.2933333333334,"J":0.08400396498714739,"K":0.6020284157412223,"L":0.6813580439183923,"Q":99.88222222222224,"R":0.680555555555555,"S":1,"T":5,"Z":"FOLDER GLUER - 2 MACHINE","AA":0.5,"AB":16.16666666666666,"AC":16.66666666666666,"AD":2013,"AE":2029.6666666666665,"AF":0.08400396498714739,"AG":3.2677324584006495,"AH":3.323364780086558,"AM":343.3855396825397,"AN":2.7920634920634906,"AO":1,"AP":23}', "FormulaJSON": '{"G":"E50+F50","J":"E50/H50*100","Q":"I50/(S50+T50)","R":"G50/(S50+T50)"}' }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 51, "DataJSON": '{"D":"FOLDER GLUER - 3 MACHINE","E":0,"F":3.31666666666667,"G":3.31666666666667,"H":569.82,"I":573.1366666666668,"J":0,"K":0.5820551519193201,"L":0.5786868751490342,"Q":143.2841666666667,"R":0.8291666666666675,"S":0,"T":4,"Z":"FOLDER GLUER - 3 MACHINE","AA":0.333333333333333,"AB":40.56666666666667,"AC":40.9,"AD":2048.12,"AE":2089.02,"AF":0.06400901246895556,"AG":8.106395118469957,"AH":7.940984643798168,"AM":344.9571031746032,"AN":5.069246031746032,"AO":1,"AP":29}', "FormulaJSON": '{"G":"E51+F51","J":"E51/H51*100","Q":"I51/(S51+T51)","R":"G51/(S51+T51)"}' }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 52, "DataJSON": '{"D":"FOLDER GLUER - 4 MACHINE","I":0,"Z":"FOLDER GLUER - 4 MACHINE"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 53, "DataJSON": '{"C":"INSPECTION - 2 MACHINE","I":0,"Y":"INSPECTION - 2 MACHINE"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 54, "DataJSON": '{"C":"INSPECTION - 3 MACHINE","E":0,"F":0,"G":0,"H":361.51,"I":361.51,"L":0,"Q":361.51,"R":0,"S":0,"T":0,"Y":"INSPECTION - 3 MACHINE","AA":0,"AB":1.17,"AC":1.17,"AD":1544.76,"AE":1545.93,"AF":0,"AG":0,"AH":0.33855718296172826,"AM":1545.93,"AN":1.17,"AO":0,"AP":2}', "FormulaJSON": '{"G":"E54+F54","L":"G54/I54*100","Q":"I54","AA":"AA39+E54","AM":"AM39+Q54"}' }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 55, "DataJSON": '{"C":"INSPECTION - 4 MACHINE","E":0,"F":0.52,"G":0.52,"H":325.37,"I":325.89,"L":0.15956304274448435,"Q":325.89,"R":0.52,"S":0,"T":1,"Y":"INSPECTION - 4 MACHINE","AA":0,"AB":1.6600000000000001,"AC":1.6600000000000001,"AD":1155.1799999999998,"AE":1156.8400000000001,"AF":0,"AG":0,"AH":0.5376356882388165,"AM":1156.8400000000001,"AN":1.6600000000000001,"AO":0,"AP":3}', "FormulaJSON": '{"G":"E55+F55","L":"G55/I55*100","Q":"I55/(S55+T55)","R":"G55/(S55+T55)"}' }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 56, "DataJSON": '{"L":0.4243734963635058,"Q":202.3872777777778,"R":0.5202301587301588,"S":1,"T":17,"AH":4.007551136816838,"AM":745.551061904762,"AN":3.0058809523809513,"AO":9,"AP":77}', "FormulaJSON": '{"L":"AVERAGE(L49:L55)","Q":"AVERAGE(Q49:Q55)","R":"AVERAGE(R49:R55)","S":"SUM(S49:S55)","T":"SUM(T49:T55)","AH":"AVERAGE(AH49:AH55)","AM":"AVERAGE(AM49:AM55)","AN":"AVERAGE(AN49:AN55)","AO":"SUM(AO49:AO55)","AP":"SUM(AP49:AP55)"}' }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 57, "DataJSON": '{"B":"Highlite Issue","X":"Highlite Issue"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 58, "DataJSON": '{"B":"Contributor MTBF score drop:","X":"Contributor MTBF score drop:"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 59, "DataJSON": '{"B":"Case paling lama penanganan pada  ","X":"Case paling lama penanganan pada  "}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 61, "DataJSON": '{"A":"MTD","B":46143,"W":"YTD","X":46143}', "FormulaJSON": '{"X":"B61"}' }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 62, "DataJSON": '{"B":"Source: ODIN","X":"Source: ODIN"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 63, "DataJSON": '{"E":"El BD","F":"Mech BD","G":"Total Lost","H":"Run Hrs","I":"Run Hrs + Total lost","J":"%El","K":"%Mech","L":"% Total Lost","M":"MTBF EL","N":"MTTR EL","O":"MTBF Mech","P":"MTTR Mech","Q":"MTBF Mch","R":"MTTR Mch","S":"BD Events EL","T":"BD Event Mech","AA":"El BD","AB":"Mech BD","AC":"Total Lost","AD":"Run Hrs","AE":"Run Hrs + Total lost","AF":"%El","AG":"%Mech","AH":"% Total Lost","AI":"MTBF EL","AJ":"MTTR EL","AK":"MTBF Mech","AL":"MTTR Mech","AM":"MTBF Mch","AN":"MTTR Mch","AO":"BD Events EL","AP":"BD Event Mech"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 64, "DataJSON": '{"D":"FOLDER GLUER - 1 MACHINE","E":0.75,"F":2.83333333333333,"G":3.58333333333333,"H":543.83,"I":547.4133333333334,"J":0.1379107441663755,"K":0.5209961446285291,"L":0.6545937256430234,"Q":78.20190476190477,"R":0.5119047619047614,"S":1,"T":6,"Z":"FOLDER GLUER - 1 MACHINE","AA":25.5833333333333,"AB":14.16666666666666,"AC":39.74999999999996,"AD":2570.4,"AE":2610.15,"AF":6.240966367988764,"AG":2.7288246233995777,"AH":8.551807114641948,"AM":414.8445714285714,"AN":4.849999999999996,"AO":8,"AP":26}', "FormulaJSON": '{"G":"E64+F64","I":"H64+G64","J":"E64/H64*100","K":"F64/H64*100","Q":"I64/(S64+T64)","R":"G64/(S64+T64)","AA":"AA49+E64","AM":"AM49+Q64"}' }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 65, "DataJSON": '{"D":"FOLDER GLUER - 2 MACHINE","E":0.833333333333333,"F":8.33333333333333,"G":9.166666666666664,"H":449.15,"I":458.31666666666666,"J":0.18553564139671225,"K":1.8553564139671224,"L":2.000072729917451,"Q":57.28958333333333,"R":1.145833333333333,"S":1,"T":7,"Z":"FOLDER GLUER - 2 MACHINE","AA":1.333333333333333,"AB":24.499999999999993,"AC":25.833333333333325,"AD":2462.15,"AE":2487.983333333333,"AF":0.26953960638385965,"AG":5.123088872367772,"AH":5.323437510004009,"AM":400.675123015873,"AN":3.9378968253968236,"AO":2,"AP":30}', "FormulaJSON": '{"G":"E65+F65","J":"E65/H65*100","Q":"I65/(S65+T65)","R":"G65/(S65+T65)"}' }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 66, "DataJSON": '{"D":"FOLDER GLUER - 3 MACHINE","E":0,"F":12.5,"G":12.5,"H":542.08,"I":554.58,"J":0,"K":2.3059327036599764,"L":2.2539579501604816,"Q":61.620000000000005,"R":1.3888888888888888,"S":0,"T":9,"Z":"FOLDER GLUER - 3 MACHINE","AA":0.333333333333333,"AB":53.06666666666667,"AC":53.4,"AD":2590.2,"AE":2643.6,"AF":0.06400901246895556,"AG":10.412327822129933,"AH":10.19494259395865,"AM":406.5771031746032,"AN":6.458134920634921,"AO":1,"AP":38}', "FormulaJSON": '{"G":"E66+F66","J":"E66/H66*100","Q":"I66/(S66+T66)","R":"G66/(S66+T66)"}' }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 67, "DataJSON": '{"D":"FOLDER GLUER - 4 MACHINE","I":0,"Z":"FOLDER GLUER - 4 MACHINE"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 68, "DataJSON": '{"C":"INSPECTION - 2 MACHINE","I":0,"Y":"INSPECTION - 2 MACHINE"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 69, "DataJSON": '{"C":"INSPECTION - 3 MACHINE","E":0,"F":0,"G":0,"H":671.97,"I":671.97,"L":0,"Q":671.97,"R":0,"S":0,"T":0,"Y":"INSPECTION - 3 MACHINE","AA":0,"AB":1.17,"AC":1.17,"AD":2216.73,"AE":2217.9,"AF":0,"AG":0,"AH":0.33855718296172826,"AM":2217.9,"AN":1.17,"AO":0,"AP":2}', "FormulaJSON": '{"G":"E69+F69","L":"G69/I69*100","Q":"I69","AA":"AA54+E69","AM":"AM54+Q69"}' }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 70, "DataJSON": '{"C":"INSPECTION - 4 MACHINE","E":0,"F":0,"G":0,"H":343.65,"I":343.65,"L":0,"Q":343.65,"R":0,"S":0,"T":0,"Y":"INSPECTION - 4 MACHINE","AA":0,"AB":1.6600000000000001,"AC":1.6600000000000001,"AD":1498.83,"AE":1500.4900000000002,"AF":0,"AG":0,"AH":0.5376356882388165,"AM":1500.4900000000002,"AN":1.6600000000000001,"AO":0,"AP":3}', "FormulaJSON": '{"G":"E70+F70","L":"G70/I70*100","Q":"I70"}' }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 71, "DataJSON": '{"L":0.9817248811441912,"Q":242.5462976190476,"R":0.6093253968253967,"S":2,"T":22,"AH":4.98927601796103,"AM":988.0973595238096,"AN":3.6152063492063484,"AO":11,"AP":99}', "FormulaJSON": '{"L":"AVERAGE(L64:L70)","Q":"AVERAGE(Q64:Q70)","R":"AVERAGE(R64:R70)","S":"SUM(S64:S70)","T":"SUM(T64:T70)","AH":"AVERAGE(AH64:AH70)","AM":"AVERAGE(AM64:AM70)","AN":"AVERAGE(AN64:AN70)","AO":"SUM(AO64:AO70)","AP":"SUM(AP64:AP70)"}' }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 72, "DataJSON": '{"B":"Highlite Issue","X":"Highlite Issue"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 73, "DataJSON": '{"B":"Contributor MTBF score drop:","X":"Contributor MTBF score drop:"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 74, "DataJSON": '{"B":"Case paling lama penanganan pada  ","X":"Case paling lama penanganan pada  "}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 76, "DataJSON": '{"A":"MTD","B":46143,"W":"YTD","X":46143}', "FormulaJSON": '{"X":"B76"}' }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 77, "DataJSON": '{"B":"Source: ODIN","X":"Source: ODIN"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 78, "DataJSON": '{"E":"El BD","F":"Mech BD","G":"Total Lost","H":"Run Hrs","I":"Run Hrs + Total lost","J":"%El","K":"%Mech","L":"% Total Lost","M":"MTBF EL","N":"MTTR EL","O":"MTBF Mech","P":"MTTR Mech","Q":"MTBF Mch","R":"MTTR Mch","S":"BD Events EL","T":"BD Event Mech","AA":"El BD","AB":"Mech BD","AC":"Total Lost","AD":"Run Hrs","AE":"Run Hrs + Total lost","AF":"%El","AG":"%Mech","AH":"% Total Lost","AI":"MTBF EL","AJ":"MTTR EL","AK":"MTBF Mech","AL":"MTTR Mech","AM":"MTBF Mch","AN":"MTTR Mch","AO":"BD Events EL","AP":"BD Event Mech"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 79, "DataJSON": '{"D":"FOLDER GLUER - 1 MACHINE","E":0.75,"F":2.83333333333333,"G":3.58333333333333,"H":543.83,"I":547.4133333333334,"J":0.1379107441663755,"K":0.5209961446285291,"L":0.6545937256430234,"Q":78.20190476190477,"R":0.5119047619047614,"S":1,"T":6,"Z":"FOLDER GLUER - 1 MACHINE","AA":26.3333333333333,"AB":16.99999999999999,"AC":43.333333333333286,"AD":3114.23,"AE":3157.5633333333335,"AF":6.3788771121551395,"AG":3.2498207680281066,"AH":9.20640084028497,"AM":493.04647619047614,"AN":5.361904761904757,"AO":9,"AP":32}', "FormulaJSON": '{"G":"E79+F79","I":"H79+G79","J":"E79/H79*100","K":"F79/H79*100","Q":"I79/(S79+T79)","R":"G79/(S79+T79)","AA":"AA64+E79","AM":"AM64+Q79"}' }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 80, "DataJSON": '{"D":"FOLDER GLUER - 2 MACHINE","E":0.833333333333333,"F":8.33333333333333,"G":9.166666666666664,"H":449.15,"I":458.31666666666666,"J":0.18553564139671225,"K":1.8553564139671224,"L":2.000072729917451,"Q":57.28958333333333,"R":1.145833333333333,"S":1,"T":7,"Z":"FOLDER GLUER - 2 MACHINE","AA":2.166666666666666,"AB":32.83333333333332,"AC":34.999999999999986,"AD":2911.3,"AE":2946.2999999999997,"AF":0.4550752477805719,"AG":6.978445286334894,"AH":7.32351023992146,"AM":457.9647063492063,"AN":5.083730158730157,"AO":3,"AP":37}', "FormulaJSON": '{"G":"E80+F80","J":"E80/H80*100","Q":"I80/(S80+T80)","R":"G80/(S80+T80)"}' }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 81, "DataJSON": '{"D":"FOLDER GLUER - 3 MACHINE","E":0,"F":12.5,"G":12.5,"H":542.08,"I":554.58,"J":0,"K":2.3059327036599764,"L":2.2539579501604816,"Q":61.620000000000005,"R":1.3888888888888888,"S":0,"T":9,"Z":"FOLDER GLUER - 3 MACHINE","AA":0.333333333333333,"AB":65.56666666666666,"AC":65.9,"AD":3132.2799999999997,"AE":3198.18,"AF":0.06400901246895556,"AG":12.71826052578991,"AH":12.448900544119132,"AM":468.1971031746032,"AN":7.84702380952381,"AO":1,"AP":47}', "FormulaJSON": '{"G":"E81+F81","J":"E81/H81*100","Q":"I81/(S81+T81)","R":"G81/(S81+T81)"}' }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 82, "DataJSON": '{"D":"FOLDER GLUER - 4 MACHINE","I":0,"Z":"FOLDER GLUER - 4 MACHINE"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 83, "DataJSON": '{"C":"INSPECTION - 2 MACHINE","I":0,"Y":"INSPECTION - 2 MACHINE"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 84, "DataJSON": '{"C":"INSPECTION - 3 MACHINE","E":0,"F":0,"G":0,"H":671.97,"I":671.97,"L":0,"Q":671.97,"R":0,"S":0,"T":0,"Y":"INSPECTION - 3 MACHINE","AA":0,"AB":1.17,"AC":1.17,"AD":2888.7,"AE":2889.87,"AF":0,"AG":0,"AH":0.33855718296172826,"AM":2889.87,"AN":1.17,"AO":0,"AP":2}', "FormulaJSON": '{"G":"E84+F84","L":"G84/I84*100","Q":"I84","AA":"AA69+E84","AM":"AM69+Q84"}' }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 85, "DataJSON": '{"C":"INSPECTION - 4 MACHINE","E":0,"F":0,"G":0,"H":343.65,"I":343.65,"L":0,"Q":343.65,"R":0,"S":0,"T":0,"Y":"INSPECTION - 4 MACHINE","AA":0,"AB":1.6600000000000001,"AC":1.6600000000000001,"AD":1842.48,"AE":1844.1400000000003,"AF":0,"AG":0,"AH":0.5376356882388165,"AM":1844.1400000000003,"AN":1.6600000000000001,"AO":0,"AP":3}', "FormulaJSON": '{"G":"E85+F85","L":"G85/I85*100","Q":"I85"}' }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 86, "DataJSON": '{"L":0.9817248811441912,"Q":242.5462976190476,"R":0.6093253968253967,"S":2,"T":22,"AH":5.971000899105222,"AM":1230.6436571428571,"AN":4.224531746031745,"AO":13,"AP":121}', "FormulaJSON": '{"L":"AVERAGE(L79:L85)","Q":"AVERAGE(Q79:Q85)","R":"AVERAGE(R79:R85)","S":"SUM(S79:S85)","T":"SUM(T79:T85)","AH":"AVERAGE(AH79:AH85)","AM":"AVERAGE(AM79:AM85)","AN":"AVERAGE(AN79:AN85)","AO":"SUM(AO79:AO85)","AP":"SUM(AP79:AP85)"}' }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 87, "DataJSON": '{"B":"Highlite Issue","X":"Highlite Issue"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 88, "DataJSON": '{"B":"Contributor MTBF score drop:","X":"Contributor MTBF score drop:"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 89, "DataJSON": '{"B":"Case paling lama penanganan pada  ","X":"Case paling lama penanganan pada  "}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 91, "DataJSON": '{"A":"MTD","B":46174,"W":"YTD","X":46174}', "FormulaJSON": '{"X":"B91"}' }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 92, "DataJSON": '{"B":"Source: ODIN","X":"Source: ODIN"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 93, "DataJSON": '{"E":"El BD","F":"Mech BD","G":"Total Lost","H":"Run Hrs","I":"Run Hrs + Total lost","J":"%El","K":"%Mech","L":"% Total Lost","M":"MTBF EL","N":"MTTR EL","O":"MTBF Mech","P":"MTTR Mech","Q":"MTBF Mch","R":"MTTR Mch","S":"BD Events EL","T":"BD Event Mech","AA":"El BD","AB":"Mech BD","AC":"Total Lost","AD":"Run Hrs","AE":"Run Hrs + Total lost","AF":"%El","AG":"%Mech","AH":"% Total Lost","AI":"MTBF EL","AJ":"MTTR EL","AK":"MTBF Mech","AL":"MTTR Mech","AM":"MTBF Mch","AN":"MTTR Mch","AO":"BD Events EL","AP":"BD Event Mech"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 94, "DataJSON": '{"D":"FOLDER GLUER - 1 MACHINE","E":29.5,"F":3.08333333333333,"G":32.58333333333333,"H":536.35,"I":568.9333333333334,"J":5.500139834063578,"K":0.5748733724868704,"L":5.7270916334661335,"Q":81.27619047619048,"R":4.654761904761904,"S":1,"T":6,"Z":"FOLDER GLUER - 1 MACHINE","AA":55.8333333333333,"AB":20.083333333333318,"AC":75.91666666666661,"AD":3650.58,"AE":3726.496666666667,"AF":11.879016946218718,"AG":3.824694140514977,"AH":14.933492473751105,"AM":574.3226666666666,"AN":10.016666666666662,"AO":10,"AP":38}', "FormulaJSON": '{"G":"E94+F94","I":"H94+G94","J":"E94/H94*100","K":"F94/H94*100","Q":"I94/(S94+T94)","R":"G94/(S94+T94)","AA":"AA79+E94","AM":"AM79+Q94"}' }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 95, "DataJSON": '{"D":"FOLDER GLUER - 2 MACHINE","E":30.5,"F":3.25,"G":33.75,"H":522.83,"I":556.58,"J":5.833636172369603,"K":0.621616969186925,"L":6.0638183190197275,"Q":111.316,"R":6.75,"S":2,"T":3,"Z":"FOLDER GLUER - 2 MACHINE","AA":32.666666666666664,"AB":36.08333333333332,"AC":68.74999999999999,"AD":3434.13,"AE":3502.8799999999997,"AF":6.288711420150175,"AG":7.600062255521819,"AH":13.387328558941189,"AM":569.2807063492063,"AN":11.833730158730157,"AO":5,"AP":40}', "FormulaJSON": '{"G":"E95+F95","J":"E95/H95*100","Q":"I95/(S95+T95)","R":"G95/(S95+T95)"}' }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 96, "DataJSON": '{"D":"FOLDER GLUER - 3 MACHINE","E":29.5,"F":0.5,"G":30,"H":577.21,"I":607.21,"J":5.110791566327679,"K":0.08662358586996066,"L":4.940630095024785,"Q":303.605,"R":15,"S":1,"T":1,"Z":"FOLDER GLUER - 3 MACHINE","AA":29.833333333333332,"AB":66.06666666666666,"AC":95.9,"AD":3709.49,"AE":3805.39,"AF":5.174800578796634,"AG":12.80488411165987,"AH":17.389530639143917,"AM":771.8021031746032,"AN":22.84702380952381,"AO":2,"AP":48}', "FormulaJSON": '{"G":"E96+F96","J":"E96/H96*100","Q":"I96/(S96+T96)","R":"G96/(S96+T96)"}' }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 97, "DataJSON": '{"D":"FOLDER GLUER - 4 MACHINE","I":0,"Z":"FOLDER GLUER - 4 MACHINE"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 98, "DataJSON": '{"C":"INSPECTION - 2 MACHINE","I":0,"Y":"INSPECTION - 2 MACHINE"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 99, "DataJSON": '{"C":"INSPECTION - 3 MACHINE","E":30,"F":17.7666666666667,"G":47.7666666666667,"H":456.68,"I":504.4466666666667,"L":9.469121281404053,"Q":100.88933333333334,"R":9.55333333333334,"S":2,"T":3,"Y":"INSPECTION - 3 MACHINE","AA":30,"AB":18.936666666666703,"AC":48.9366666666667,"AD":3345.3799999999997,"AE":3394.3166666666666,"AF":0,"AG":0,"AH":9.807678464365782,"AM":2990.7593333333334,"AN":10.72333333333334,"AO":2,"AP":5}', "FormulaJSON": '{"G":"E99+F99","L":"G99/I99*100","Q":"I99/(S99+T99)","R":"G99/(S99+T99)","AA":"AA84+E99","AM":"AM84+Q99"}' }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 100, "DataJSON": '{"C":"INSPECTION - 4 MACHINE","E":29.5,"F":2.5,"G":32,"H":366.44,"I":398.44,"L":8.031322156409999,"Q":199.22,"R":16,"S":1,"T":1,"Y":"INSPECTION - 4 MACHINE","AA":29.5,"AB":4.16,"AC":33.66,"AD":2208.92,"AE":2242.5800000000004,"AF":0,"AG":0,"AH":8.568957844648816,"AM":2043.3600000000004,"AN":17.66,"AO":1,"AP":4}', "FormulaJSON": '{"G":"E100+F100","L":"G100/I100*100","Q":"I100/(S100+T100)","R":"G100/(S100+T100)"}' }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 101, "DataJSON": '{"L":6.846396697064941,"Q":159.26130476190477,"R":10.391619047619049,"S":7,"T":14,"AH":12.817397596170162,"AM":1389.904961904762,"AN":14.616150793650794,"AO":20,"AP":135}', "FormulaJSON": '{"L":"AVERAGE(L94:L100)","Q":"AVERAGE(Q94:Q100)","R":"AVERAGE(R94:R100)","S":"SUM(S94:S100)","T":"SUM(T94:T100)","AH":"AVERAGE(AH94:AH100)","AM":"AVERAGE(AM94:AM100)","AN":"AVERAGE(AN94:AN100)","AO":"SUM(AO94:AO100)","AP":"SUM(AP94:AP100)"}' }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 102, "DataJSON": '{"B":"Highlite Issue","X":"Highlite Issue"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 103, "DataJSON": '{"B":"Contributor MTBF score drop:","X":"Contributor MTBF score drop:"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 104, "DataJSON": '{"B":"Case paling lama penanganan pada  ","X":"Case paling lama penanganan pada  "}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 106, "DataJSON": '{"A":"MTD","B":46204,"W":"YTD","X":46204}', "FormulaJSON": '{"X":"B106"}' }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 107, "DataJSON": '{"B":"Source: ODIN","X":"Source: ODIN"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 108, "DataJSON": '{"E":"El BD","F":"Mech BD","G":"Total Lost","H":"Run Hrs","I":"Run Hrs + Total lost","J":"%El","K":"%Mech","L":"% Total Lost","M":"MTBF EL","N":"MTTR EL","O":"MTBF Mech","P":"MTTR Mech","Q":"MTBF Mch","R":"MTTR Mch","S":"BD Events EL","T":"BD Event Mech","AA":"El BD","AB":"Mech BD","AC":"Total Lost","AD":"Run Hrs","AE":"Run Hrs + Total lost","AF":"%El","AG":"%Mech","AH":"% Total Lost","AI":"MTBF EL","AJ":"MTTR EL","AK":"MTBF Mech","AL":"MTTR Mech","AM":"MTBF Mch","AN":"MTTR Mch","AO":"BD Events EL","AP":"BD Event Mech"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 109, "DataJSON": '{"D":"FOLDER GLUER - 1 MACHINE","E":0,"F":1.66666666666667,"G":1.66666666666667,"H":477.21,"I":478.87666666666667,"J":0,"K":0.34925225093075796,"L":0.3480367248352053,"Q":159.62555555555556,"R":0.5555555555555567,"S":0,"T":3,"Z":"FOLDER GLUER - 1 MACHINE","AA":55.8333333333333,"AB":21.74999999999999,"AC":77.58333333333329,"AD":4127.79,"AE":4205.373333333334,"AF":11.879016946218718,"AG":4.173946391445735,"AH":15.28152919858631,"AM":733.9482222222222,"AN":10.57222222222222,"AO":10,"AP":41}', "FormulaJSON": '{"G":"E109+F109","I":"H109+G109","J":"E109/H109*100","K":"F109/H109*100","Q":"I109/(S109+T109)","R":"G109/(S109+T109)","AA":"AA94+E109","AM":"AM94+Q109"}' }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 110, "DataJSON": '{"D":"FOLDER GLUER - 2 MACHINE","E":0,"F":4,"G":4,"H":164.65,"I":168.65,"J":0,"K":2.429395687822654,"L":2.3717758671805513,"Q":42.1625,"R":1,"S":0,"T":4,"Z":"FOLDER GLUER - 2 MACHINE","AA":32.666666666666664,"AB":40.08333333333332,"AC":72.74999999999999,"AD":3598.78,"AE":3671.5299999999997,"AF":6.288711420150175,"AG":10.029457943344473,"AH":15.75910442612174,"AM":611.4432063492063,"AN":12.833730158730157,"AO":5,"AP":44}', "FormulaJSON": '{"G":"E110+F110","J":"E110/H110*100","Q":"I110/(S110+T110)","R":"G110/(S110+T110)"}' }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 111, "DataJSON": '{"D":"FOLDER GLUER - 3 MACHINE","E":0,"F":4.33333333333333,"G":4.33333333333333,"H":474.7,"I":479.0333333333333,"J":0,"K":0.9128572431711249,"L":0.904599540741771,"Q":79.83888888888889,"R":0.7222222222222218,"S":0,"T":6,"Z":"FOLDER GLUER - 3 MACHINE","AA":29.833333333333332,"AB":70.39999999999999,"AC":100.23333333333333,"AD":4184.19,"AE":4284.423333333333,"AF":5.174800578796634,"AG":13.717741354830995,"AH":18.294130179885688,"AM":851.640992063492,"AN":23.569246031746033,"AO":2,"AP":54}', "FormulaJSON": '{"G":"E111+F111","J":"E111/H111*100","Q":"I111/(S111+T111)","R":"G111/(S111+T111)"}' }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 112, "DataJSON": '{"D":"FOLDER GLUER - 4 MACHINE","I":0,"Z":"FOLDER GLUER - 4 MACHINE"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 113, "DataJSON": '{"C":"INSPECTION - 2 MACHINE","I":0,"Y":"INSPECTION - 2 MACHINE"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 114, "DataJSON": '{"C":"INSPECTION - 3 MACHINE","E":30,"F":17.7666666666667,"G":47.7666666666667,"H":297.78,"I":345.5466666666667,"L":13.823506713999084,"Q":69.10933333333334,"R":9.55333333333334,"S":2,"T":3,"Y":"INSPECTION - 3 MACHINE","AA":60,"AB":36.703333333333404,"AC":96.7033333333334,"AD":3643.16,"AE":3739.8633333333332,"AF":0,"AG":0,"AH":23.631185178364866,"AM":3059.8686666666667,"AN":20.276666666666678,"AO":4,"AP":8}', "FormulaJSON": '{"G":"E114+F114","L":"G114/I114*100","Q":"I114/(S114+T114)","R":"G114/(S114+T114)","AA":"AA99+E114","AM":"AM99+Q114"}' }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 115, "DataJSON": '{"C":"INSPECTION - 4 MACHINE","E":0,"F":0,"G":0,"H":110.5,"I":110.5,"L":0,"Q":110.5,"R":0,"S":0,"T":0,"Y":"INSPECTION - 4 MACHINE","AA":29.5,"AB":4.16,"AC":33.66,"AD":2319.42,"AE":2353.0800000000004,"AF":0,"AG":0,"AH":8.568957844648816,"AM":2153.8600000000006,"AN":17.66,"AO":1,"AP":4}', "FormulaJSON": '{"G":"E115+F115","L":"G115/I115*100","Q":"H115"}' }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 116, "DataJSON": '{"L":3.4895837693513223,"Q":92.24725555555555,"R":2.366222222222224,"S":2,"T":16,"AH":16.306981365521484,"AM":1482.1522174603174,"AN":16.982373015873016,"AO":22,"AP":151}', "FormulaJSON": '{"L":"AVERAGE(L109:L115)","Q":"AVERAGE(Q109:Q115)","R":"AVERAGE(R109:R115)","S":"SUM(S109:S115)","T":"SUM(T109:T115)","AH":"AVERAGE(AH109:AH115)","AM":"AVERAGE(AM109:AM115)","AN":"AVERAGE(AN109:AN115)","AO":"SUM(AO109:AO115)","AP":"SUM(AP109:AP115)"}' }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 117, "DataJSON": '{"B":"Highlite Issue","X":"Highlite Issue"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 118, "DataJSON": '{"B":"Contributor MTBF score drop:","X":"Contributor MTBF score drop:"}', "FormulaJSON": "{}" }, { "Sheet": "Chart_Conv 02 Folder Gluer", "Row": 119, "DataJSON": '{"B":"Case paling lama penanganan pada  ","X":"Case paling lama penanganan pada  "}', "FormulaJSON": "{}" }, { "Sheet": "Summary Converting '23", "Row": 3, "DataJSON": '{"A":"Period","B":"Machine","C":"El BD","D":"Mech BD","E":"Total Lost","F":"Run Hrs","G":"%El","H":"%Mech","I":"% Total Lost","J":"MTBF EL","K":"MTTR EL","L":"MTBF Mech","M":"MTTR Mech","N":"MTBF Mch","O":"MTTR Mch","P":"BD Events EL","Q":"BD Event Mech","R":"Sum BD","AC":"Sum of Total Lost","AD":"Machine"}', "FormulaJSON": "{}" }, { "Sheet": "Summary Converting '23", "Row": 4, "DataJSON": '{"A":"Jan","B":"APM1","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!","AC":"Period","AD":"APM1","AE":"APM2","AF":"APM3","AG":"APM4","AH":"APM5","AI":"APM6","AJ":"APM7","AK":"APM8","AL":"FGM1","AM":"FGM2","AN":"FGM3","AO":"FGM4","AP":"Total Result"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!","R":"SUM(P4:Q4)"}` }, { "Sheet": "Summary Converting '23", "Row": 5, "DataJSON": '{"A":"Jan","B":"APM2","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!","AC":"Jan","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}` }, { "Sheet": "Summary Converting '23", "Row": 6, "DataJSON": '{"A":"Jan","B":"APM3","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!","AC":"Feb","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}` }, { "Sheet": "Summary Converting '23", "Row": 7, "DataJSON": '{"A":"Jan","B":"APM4","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!","AC":"Mar","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}` }, { "Sheet": "Summary Converting '23", "Row": 8, "DataJSON": '{"A":"Jan","B":"APM7","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!","AC":"Apr","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}` }, { "Sheet": "Summary Converting '23", "Row": 9, "DataJSON": '{"A":"Jan","B":"APM5","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!","AC":"May","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}` }, { "Sheet": "Summary Converting '23", "Row": 10, "DataJSON": '{"A":"Jan","B":"APM6","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!","AC":"Jun","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}` }, { "Sheet": "Summary Converting '23", "Row": 11, "DataJSON": '{"A":"Jan","B":"FGM1","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!","AC":"Jul","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}` }, { "Sheet": "Summary Converting '23", "Row": 12, "DataJSON": '{"A":"Jan","B":"FGM2","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!","AC":"Aug","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}` }, { "Sheet": "Summary Converting '23", "Row": 13, "DataJSON": '{"A":"Jan","B":"FGM3","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!","AC":"Sep","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}` }, { "Sheet": "Summary Converting '23", "Row": 14, "DataJSON": '{"A":"Jan","B":"FGM4","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!","AC":"Oct","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AK":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AK":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}` }, { "Sheet": "Summary Converting '23", "Row": 15, "DataJSON": '{"A":"Feb","B":"APM1","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!","AC":"Total Result","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AK":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}', "FormulaJSON": `{"B":"B4","C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AK":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}` }, { "Sheet": "Summary Converting '23", "Row": 16, "DataJSON": '{"A":"Feb","B":"APM2","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Summary Converting '23", "Row": 17, "DataJSON": '{"A":"Feb","B":"APM3","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Summary Converting '23", "Row": 18, "DataJSON": '{"A":"Feb","B":"APM4","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Summary Converting '23", "Row": 19, "DataJSON": '{"A":"Feb","B":"APM7","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!","AC":"Sum of MTBF Mch","AD":"Machine"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Summary Converting '23", "Row": 20, "DataJSON": '{"A":"Feb","B":"APM5","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!","AC":"Period","AD":"APM1","AE":"APM2","AF":"APM3","AG":"APM4","AH":"APM5","AI":"APM6","AJ":"APM7","AK":"APM8","AL":"FGM1","AM":"FGM2","AN":"FGM3","AO":"FGM4","AP":"Total Result"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Summary Converting '23", "Row": 21, "DataJSON": '{"A":"Feb","B":"APM6","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!","AC":"Jan","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}` }, { "Sheet": "Summary Converting '23", "Row": 22, "DataJSON": '{"A":"Feb","B":"FGM1","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!","AC":"Feb","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}` }, { "Sheet": "Summary Converting '23", "Row": 23, "DataJSON": '{"A":"Feb","B":"FGM2","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!","AC":"Mar","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}` }, { "Sheet": "Summary Converting '23", "Row": 24, "DataJSON": '{"A":"Feb","B":"FGM3","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!","AC":"Apr","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}` }, { "Sheet": "Summary Converting '23", "Row": 25, "DataJSON": '{"A":"Feb","B":"FGM4","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!","AC":"May","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}` }, { "Sheet": "Summary Converting '23", "Row": 26, "DataJSON": '{"A":"Mar","B":"APM1","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!","AC":"Jun","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}', "FormulaJSON": `{"B":"B4","C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}` }, { "Sheet": "Summary Converting '23", "Row": 27, "DataJSON": '{"A":"Mar","B":"APM2","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!","AC":"Jul","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}` }, { "Sheet": "Summary Converting '23", "Row": 28, "DataJSON": '{"A":"Mar","B":"APM3","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!","AC":"Aug","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}` }, { "Sheet": "Summary Converting '23", "Row": 29, "DataJSON": '{"A":"Mar","B":"APM4","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!","AC":"Sep","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}` }, { "Sheet": "Summary Converting '23", "Row": 30, "DataJSON": '{"A":"Mar","B":"APM7","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!","AC":"Oct","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AK":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AK":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}` }, { "Sheet": "Summary Converting '23", "Row": 31, "DataJSON": '{"A":"Mar","B":"APM5","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!","AC":"Total Result","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AK":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AK":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}` }, { "Sheet": "Summary Converting '23", "Row": 32, "DataJSON": '{"A":"Mar","B":"APM6","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Summary Converting '23", "Row": 33, "DataJSON": '{"A":"Mar","B":"FGM1","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Summary Converting '23", "Row": 34, "DataJSON": '{"A":"Mar","B":"FGM2","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Summary Converting '23", "Row": 35, "DataJSON": '{"A":"Mar","B":"FGM3","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!","AC":"Sum of MTTR Mch","AD":"Machine"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Summary Converting '23", "Row": 36, "DataJSON": '{"A":"Mar","B":"FGM4","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!","AC":"Period","AD":"APM1","AE":"APM2","AF":"APM3","AG":"APM4","AH":"APM5","AI":"APM6","AJ":"APM7","AK":"APM8","AL":"FGM1","AM":"FGM2","AN":"FGM3","AO":"FGM4","AP":"Total Result"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!","R":"SUM(P36:Q36)"}` }, { "Sheet": "Summary Converting '23", "Row": 37, "DataJSON": '{"A":"Apr","B":"APM1","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!","AC":"Jan","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}', "FormulaJSON": `{"B":"B4","C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}` }, { "Sheet": "Summary Converting '23", "Row": 38, "DataJSON": '{"A":"Apr","B":"APM2","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!","AC":"Feb","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}` }, { "Sheet": "Summary Converting '23", "Row": 39, "DataJSON": '{"A":"Apr","B":"APM3","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!","AC":"Mar","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}` }, { "Sheet": "Summary Converting '23", "Row": 40, "DataJSON": '{"A":"Apr","B":"APM4","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!","AC":"Apr","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}` }, { "Sheet": "Summary Converting '23", "Row": 41, "DataJSON": '{"A":"Apr","B":"APM7","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!","AC":"May","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}` }, { "Sheet": "Summary Converting '23", "Row": 42, "DataJSON": '{"A":"Apr","B":"APM5","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!","AC":"Jun","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}` }, { "Sheet": "Summary Converting '23", "Row": 43, "DataJSON": '{"A":"Apr","B":"APM6","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!","AC":"Jul","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}` }, { "Sheet": "Summary Converting '23", "Row": 44, "DataJSON": '{"A":"Apr","B":"FGM1","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!","AC":"Aug","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}` }, { "Sheet": "Summary Converting '23", "Row": 45, "DataJSON": '{"A":"Apr","B":"FGM2","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!","AC":"Sep","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}` }, { "Sheet": "Summary Converting '23", "Row": 46, "DataJSON": '{"A":"Apr","B":"FGM3","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!","AC":"Oct","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AK":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AK":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}` }, { "Sheet": "Summary Converting '23", "Row": 47, "DataJSON": '{"A":"Apr","B":"FGM4","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!","AC":"Total Result","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AK":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AK":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}` }, { "Sheet": "Summary Converting '23", "Row": 48, "DataJSON": '{"A":"May","B":"APM1","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!"}', "FormulaJSON": `{"B":"B4","C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Summary Converting '23", "Row": 49, "DataJSON": '{"A":"May","B":"APM2","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Summary Converting '23", "Row": 50, "DataJSON": '{"A":"May","B":"APM3","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Summary Converting '23", "Row": 51, "DataJSON": '{"A":"May","B":"APM4","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!","AC":"Sum of Sum BD","AD":"Machine"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Summary Converting '23", "Row": 52, "DataJSON": '{"A":"May","B":"APM7","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!","AC":"Period","AD":"APM1","AE":"APM2","AF":"APM3","AG":"APM4","AH":"APM5","AI":"APM6","AJ":"APM7","AK":"APM8","AL":"FGM1","AM":"FGM2","AN":"FGM3","AO":"FGM4","AP":"Total Result"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Summary Converting '23", "Row": 53, "DataJSON": '{"A":"May","B":"APM5","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!","AC":"Jan","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}` }, { "Sheet": "Summary Converting '23", "Row": 54, "DataJSON": '{"A":"May","B":"APM6","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!","AC":"Feb","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}` }, { "Sheet": "Summary Converting '23", "Row": 55, "DataJSON": '{"A":"May","B":"FGM1","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!","AC":"Mar","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}` }, { "Sheet": "Summary Converting '23", "Row": 56, "DataJSON": '{"A":"May","B":"FGM2","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!","AC":"Apr","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}` }, { "Sheet": "Summary Converting '23", "Row": 57, "DataJSON": '{"A":"May","B":"FGM3","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!","AC":"May","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}` }, { "Sheet": "Summary Converting '23", "Row": 58, "DataJSON": '{"A":"May","B":"FGM4","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!","AC":"Jun","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}` }, { "Sheet": "Summary Converting '23", "Row": 59, "DataJSON": '{"A":"Jun","B":"APM1","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!","AC":"Jul","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}', "FormulaJSON": `{"B":"B4","C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}` }, { "Sheet": "Summary Converting '23", "Row": 60, "DataJSON": '{"A":"Jun","B":"APM2","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!","AC":"Aug","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}` }, { "Sheet": "Summary Converting '23", "Row": 61, "DataJSON": '{"A":"Jun","B":"APM3","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!","AC":"Sep","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}` }, { "Sheet": "Summary Converting '23", "Row": 62, "DataJSON": '{"A":"Jun","B":"APM4","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!","AC":"Oct","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AK":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AK":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}` }, { "Sheet": "Summary Converting '23", "Row": 63, "DataJSON": '{"A":"Jun","B":"APM7","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!","AC":"Total Result","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AK":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!","AD":"#VALUE!","AE":"#VALUE!","AF":"#VALUE!","AG":"#VALUE!","AH":"#VALUE!","AI":"#VALUE!","AJ":"#VALUE!","AK":"#VALUE!","AL":"#VALUE!","AM":"#VALUE!","AN":"#VALUE!","AO":"#VALUE!","AP":"#VALUE!"}` }, { "Sheet": "Summary Converting '23", "Row": 64, "DataJSON": '{"A":"Jun","B":"APM5","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Summary Converting '23", "Row": 65, "DataJSON": '{"A":"Jun","B":"APM6","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Summary Converting '23", "Row": 66, "DataJSON": '{"A":"Jun","B":"FGM1","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Summary Converting '23", "Row": 67, "DataJSON": '{"A":"Jun","B":"FGM2","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Summary Converting '23", "Row": 68, "DataJSON": '{"A":"Jun","B":"FGM3","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!","R":"SUM(P68:Q68)"}` }, { "Sheet": "Summary Converting '23", "Row": 69, "DataJSON": '{"A":"Jun","B":"FGM4","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Summary Converting '23", "Row": 70, "DataJSON": '{"A":"Jul","B":"APM1","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!"}', "FormulaJSON": `{"B":"B4","C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Summary Converting '23", "Row": 71, "DataJSON": '{"A":"Jul","B":"APM2","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Summary Converting '23", "Row": 72, "DataJSON": '{"A":"Jul","B":"APM3","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Summary Converting '23", "Row": 73, "DataJSON": '{"A":"Jul","B":"APM4","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Summary Converting '23", "Row": 74, "DataJSON": '{"A":"Jul","B":"APM7","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Summary Converting '23", "Row": 75, "DataJSON": '{"A":"Jul","B":"APM5","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Summary Converting '23", "Row": 76, "DataJSON": '{"A":"Jul","B":"APM6","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Summary Converting '23", "Row": 77, "DataJSON": '{"A":"Jul","B":"FGM1","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Summary Converting '23", "Row": 78, "DataJSON": '{"A":"Jul","B":"FGM2","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Summary Converting '23", "Row": 79, "DataJSON": '{"A":"Jul","B":"FGM3","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Summary Converting '23", "Row": 80, "DataJSON": '{"A":"Jul","B":"FGM4","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Summary Converting '23", "Row": 81, "DataJSON": '{"A":"Aug","B":"APM1","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!"}', "FormulaJSON": `{"B":"B4","C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Summary Converting '23", "Row": 82, "DataJSON": '{"A":"Aug","B":"APM2","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Summary Converting '23", "Row": 83, "DataJSON": '{"A":"Aug","B":"APM3","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Summary Converting '23", "Row": 84, "DataJSON": '{"A":"Aug","B":"APM4","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Summary Converting '23", "Row": 85, "DataJSON": '{"A":"Aug","B":"APM7","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Summary Converting '23", "Row": 86, "DataJSON": '{"A":"Aug","B":"APM5","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Summary Converting '23", "Row": 87, "DataJSON": '{"A":"Aug","B":"APM6","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Summary Converting '23", "Row": 88, "DataJSON": '{"A":"Aug","B":"FGM1","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Summary Converting '23", "Row": 89, "DataJSON": '{"A":"Aug","B":"FGM2","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Summary Converting '23", "Row": 90, "DataJSON": '{"A":"Aug","B":"FGM3","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Summary Converting '23", "Row": 91, "DataJSON": '{"A":"Aug","B":"FGM4","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Summary Converting '23", "Row": 92, "DataJSON": '{"A":"Sep","B":"APM1","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!"}', "FormulaJSON": `{"B":"B4","C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Summary Converting '23", "Row": 93, "DataJSON": '{"A":"Sep","B":"APM2","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Summary Converting '23", "Row": 94, "DataJSON": '{"A":"Sep","B":"APM3","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Summary Converting '23", "Row": 95, "DataJSON": '{"A":"Sep","B":"APM4","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Summary Converting '23", "Row": 96, "DataJSON": '{"A":"Sep","B":"APM7","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Summary Converting '23", "Row": 97, "DataJSON": '{"A":"Sep","B":"APM5","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Summary Converting '23", "Row": 98, "DataJSON": '{"A":"Sep","B":"APM6","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Summary Converting '23", "Row": 99, "DataJSON": '{"A":"Sep","B":"FGM1","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Summary Converting '23", "Row": 100, "DataJSON": '{"A":"Sep","B":"FGM2","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!","R":"SUM(P100:Q100)"}` }, { "Sheet": "Summary Converting '23", "Row": 101, "DataJSON": '{"A":"Sep","B":"FGM3","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Summary Converting '23", "Row": 102, "DataJSON": '{"A":"Sep","B":"FGM4","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Summary Converting '23", "Row": 103, "DataJSON": '{"A":"Oct","B":"APM1","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Summary Converting '23", "Row": 104, "DataJSON": '{"A":"Oct","B":"APM2","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Summary Converting '23", "Row": 105, "DataJSON": '{"A":"Oct","B":"APM3","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Summary Converting '23", "Row": 106, "DataJSON": '{"A":"Oct","B":"APM4","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Summary Converting '23", "Row": 107, "DataJSON": '{"A":"Oct","B":"APM7","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Summary Converting '23", "Row": 108, "DataJSON": '{"A":"Oct","B":"APM8","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Summary Converting '23", "Row": 109, "DataJSON": '{"A":"Oct","B":"APM5","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Summary Converting '23", "Row": 110, "DataJSON": '{"A":"Oct","B":"APM6","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Summary Converting '23", "Row": 111, "DataJSON": '{"A":"Oct","B":"FGM1","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Summary Converting '23", "Row": 112, "DataJSON": '{"A":"Oct","B":"FGM2","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Summary Converting '23", "Row": 113, "DataJSON": '{"A":"Oct","B":"FGM3","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Summary Converting '23", "Row": 114, "DataJSON": '{"A":"Oct","B":"FGM4","C":"#REF!","D":"#REF!","E":"#REF!","F":"#REF!","G":"#REF!","H":"#REF!","I":"#REF!","J":"#REF!","K":"#REF!","L":"#REF!","M":"#REF!","N":"#REF!","O":"#REF!","P":"#REF!","Q":"#REF!","R":"#REF!"}', "FormulaJSON": `{"C":"'Chart_Conv 01 Autoplaten'!#REF!","D":"'Chart_Conv 01 Autoplaten'!#REF!","E":"'Chart_Conv 01 Autoplaten'!#REF!","F":"'Chart_Conv 01 Autoplaten'!#REF!","G":"'Chart_Conv 01 Autoplaten'!#REF!","H":"'Chart_Conv 01 Autoplaten'!#REF!","I":"'Chart_Conv 01 Autoplaten'!#REF!","J":"'Chart_Conv 01 Autoplaten'!#REF!","K":"'Chart_Conv 01 Autoplaten'!#REF!","L":"'Chart_Conv 01 Autoplaten'!#REF!","M":"'Chart_Conv 01 Autoplaten'!#REF!","N":"'Chart_Conv 01 Autoplaten'!#REF!","O":"'Chart_Conv 01 Autoplaten'!#REF!","P":"'Chart_Conv 01 Autoplaten'!#REF!","Q":"'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Yearly_Printing", "Row": 1, "DataJSON": '{"A":44927}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Printing", "Row": 2, "DataJSON": '{"A":"Source: ODIN"}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Printing", "Row": 3, "DataJSON": '{"A":"Mesin","B":"El BD","C":"Mech BD","D":"Total Lost","E":"Run Hrs","F":"%El","G":"%Mech","H":"% Total Lost","I":"MTBF EL","J":"MTTR EL","K":"MTBF Mech","L":"MTTR Mech","M":"MTBF Mch","N":"MTTR Mch","O":"BD Events EL","P":"BD Event Mech"}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Printing", "Row": 4, "DataJSON": '{"A":"OFFSET - 4 MACHINE","B":11.83,"C":41.33,"D":53.16,"E":333.45,"F":3.54775828460039,"G":12.394661868346079,"H":15.942420152946468,"I":37.05,"J":1.3144444444444445,"K":27.787499999999998,"L":3.4441666666666664,"M":15.878571428571428,"N":2.531428571428571,"O":9,"P":12}', "FormulaJSON": '{"D":"B4+C4","F":"B4/E4*100","G":"C4/E4*100","H":"D4/E4*100","I":"E4/O4","J":"B4/(O4)","K":"E4/P4","L":"C4/(P4)","M":"E4/(O4+P4)","N":"D4/(O4+P4)"}' }, { "Sheet": "Yearly_Printing", "Row": 5, "DataJSON": '{"A":"OFFSET UV INK - 5 MACHINE","B":25.53,"C":0.5,"D":26.03,"E":300.1,"F":8.507164278573809,"G":0.16661112962345884,"H":8.673775408197267,"I":30.01,"J":2.553,"K":150.05,"L":0.25,"M":25.008333333333336,"N":2.169166666666667,"O":10,"P":2}', "FormulaJSON": '{"D":"B5+C5","F":"B5/E5*100","G":"C5/E5*100","H":"D5/E5*100","I":"E5/O5","J":"B5/(O5)","K":"E5/P5","L":"C5/(P5)","M":"E5/(O5+P5)","N":"D5/(O5+P5)"}' }, { "Sheet": "Yearly_Printing", "Row": 6, "DataJSON": '{"A":"OFFSET - 6 MACHINE","B":10.92,"C":2.25,"D":13.17,"E":326.12,"F":3.348460689316816,"G":0.6899300870845088,"H":4.038390776401324,"I":54.35333333333333,"J":1.82,"K":163.06,"L":1.125,"M":40.765,"N":1.64625,"O":6,"P":2}', "FormulaJSON": '{"D":"B6+C6","F":"B6/E6*100","G":"C6/E6*100","H":"D6/E6*100","I":"E6/O6","J":"B6/(O6)","K":"E6/P6","L":"C6/(P6)","M":"E6/(O6+P6)","N":"D6/(O6+P6)"}' }, { "Sheet": "Yearly_Printing", "Row": 7, "DataJSON": '{"A":"SHEET FEED GRAVURE MACHINE"}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Printing", "Row": 8, "DataJSON": '{"H":9.551528779181686,"M":27.21730158730159,"N":2.1156150793650794,"O":25,"P":16}', "FormulaJSON": '{"H":"AVERAGE(H4:H7)","M":"AVERAGE(M4:M7)","N":"AVERAGE(N4:N7)","O":"SUM(O4:O7)","P":"SUM(P4:P7)"}' }, { "Sheet": "Yearly_Printing", "Row": 11, "DataJSON": '{"A":"Jan - Feb 2023"}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Printing", "Row": 12, "DataJSON": '{"A":"Source: ODIN"}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Printing", "Row": 13, "DataJSON": '{"A":"Mesin","B":"El BD","C":"Mech BD","D":"Total Lost","E":"Run Hrs","F":"%El","G":"%Mech","H":"% Total Lost","I":"MTBF EL","J":"MTTR EL","K":"MTBF Mech","L":"MTTR Mech","M":"MTBF Mch","N":"MTTR Mch","O":"BD Events EL","P":"BD Event Mech"}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Printing", "Row": 14, "DataJSON": '{"A":"OFFSET - 4 MACHINE","B":15.58,"C":49.16,"D":64.74,"E":608.79,"F":2.5591747564841736,"G":8.075034084002693,"H":10.634208840486867,"I":46.83,"J":1.1984615384615385,"K":43.485,"L":3.511428571428571,"M":22.547777777777778,"N":2.397777777777778,"O":13,"P":14}', "FormulaJSON": '{"D":"B14+C14","F":"B14/E14*100","G":"C14/E14*100","H":"D14/E14*100","I":"E14/O14","J":"B14/(O14)","K":"E14/P14","L":"C14/(P14)","M":"E14/(O14+P14)","N":"D14/(O14+P14)"}' }, { "Sheet": "Yearly_Printing", "Row": 15, "DataJSON": '{"A":"OFFSET UV INK - 5 MACHINE","B":32.7,"C":162.42,"D":195.12,"E":557.28,"F":5.867786391042206,"G":29.14513350559862,"H":35.01291989664083,"I":17.415,"J":1.021875,"K":42.86769230769231,"L":12.493846153846153,"M":12.383999999999999,"N":4.336,"O":32,"P":13}', "FormulaJSON": '{"D":"B15+C15","F":"B15/E15*100","G":"C15/E15*100","H":"D15/E15*100","I":"E15/O15","J":"B15/(O15)","K":"E15/P15","L":"C15/(P15)","M":"E15/(O15+P15)","N":"D15/(O15+P15)"}' }, { "Sheet": "Yearly_Printing", "Row": 16, "DataJSON": '{"A":"OFFSET - 6 MACHINE","B":22,"C":160.78,"D":182.78,"E":545.6,"F":4.032258064516129,"G":29.468475073313783,"H":33.50073313782991,"I":41.96923076923077,"J":1.6923076923076923,"K":109.12,"L":32.156,"M":30.311111111111114,"N":10.154444444444444,"O":13,"P":5}', "FormulaJSON": '{"D":"B16+C16","F":"B16/E16*100","G":"C16/E16*100","H":"D16/E16*100","I":"E16/O16","J":"B16/(O16)","K":"E16/P16","L":"C16/(P16)","M":"E16/(O16+P16)","N":"D16/(O16+P16)"}' }, { "Sheet": "Yearly_Printing", "Row": 17, "DataJSON": '{"A":"SHEET FEED GRAVURE MACHINE"}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Printing", "Row": 18, "DataJSON": '{"H":26.382620624985872,"M":21.74762962962963,"N":5.629407407407407,"O":58,"P":32}', "FormulaJSON": '{"H":"AVERAGE(H14:H17)","M":"AVERAGE(M14:M17)","N":"AVERAGE(N14:N17)","O":"SUM(O14:O17)","P":"SUM(P14:P17)"}' }, { "Sheet": "Yearly_Printing", "Row": 21, "DataJSON": '{"A":"Jan - Mar 2023"}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Printing", "Row": 22, "DataJSON": '{"A":"Source: ODIN"}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Printing", "Row": 23, "DataJSON": '{"A":"Mesin","B":"El BD","C":"Mech BD","D":"Total Lost","E":"Run Hrs","F":"%El","G":"%Mech","H":"% Total Lost","I":"MTBF EL","J":"MTTR EL","K":"MTBF Mech","L":"MTTR Mech","M":"MTBF Mch","N":"MTTR Mch","O":"BD Events EL","P":"BD Event Mech"}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Printing", "Row": 24, "DataJSON": '{"A":"OFFSET - 4 MACHINE","B":17.75,"C":98.33,"D":116.08,"E":945.81,"F":1.8766982797813514,"G":10.396379822585933,"H":12.273078102367284,"I":59.113125,"J":1.109375,"K":36.37730769230769,"L":3.7819230769230767,"M":22.51928571428571,"N":2.763809523809524,"O":16,"P":26}', "FormulaJSON": '{"D":"B24+C24","F":"B24/E24*100","G":"C24/E24*100","H":"D24/E24*100","I":"E24/O24","J":"B24/(O24)","K":"E24/P24","L":"C24/(P24)","M":"E24/(O24+P24)","N":"D24/(O24+P24)"}' }, { "Sheet": "Yearly_Printing", "Row": 25, "DataJSON": '{"A":"OFFSET UV INK - 5 MACHINE","B":42.28,"C":226.34,"D":268.62,"E":938.4,"F":4.505541346973573,"G":24.119778346121056,"H":28.62531969309463,"I":18.4,"J":0.8290196078431373,"K":42.654545454545456,"L":10.288181818181819,"M":12.854794520547944,"N":3.6797260273972605,"O":51,"P":22}', "FormulaJSON": '{"D":"B25+C25","F":"B25/E25*100","G":"C25/E25*100","H":"D25/E25*100","I":"E25/O25","J":"B25/(O25)","K":"E25/P25","L":"C25/(P25)","M":"E25/(O25+P25)","N":"D25/(O25+P25)"}' }, { "Sheet": "Yearly_Printing", "Row": 26, "DataJSON": '{"A":"OFFSET - 6 MACHINE","B":64,"C":167.03,"D":231.03,"E":1039.7,"F":6.155621813984803,"G":16.0652111185919,"H":22.220832932576702,"I":38.507407407407406,"J":2.3703703703703702,"K":115.52222222222223,"L":18.558888888888887,"M":28.880555555555556,"N":6.4175,"O":27,"P":9}', "FormulaJSON": '{"D":"B26+C26","F":"B26/E26*100","G":"C26/E26*100","H":"D26/E26*100","I":"E26/O26","J":"B26/(O26)","K":"E26/P26","L":"C26/(P26)","M":"E26/(O26+P26)","N":"D26/(O26+P26)"}' }, { "Sheet": "Yearly_Printing", "Row": 27, "DataJSON": '{"A":"SHEET FEED GRAVURE MACHINE"}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Printing", "Row": 28, "DataJSON": '{"H":21.03974357601287,"M":21.41821193012974,"N":4.287011850402261,"O":94,"P":57}', "FormulaJSON": '{"H":"AVERAGE(H24:H27)","M":"AVERAGE(M24:M27)","N":"AVERAGE(N24:N27)","O":"SUM(O24:O27)","P":"SUM(P24:P27)"}' }, { "Sheet": "Yearly_Printing", "Row": 31, "DataJSON": '{"A":"Jan - Apr 2023"}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Printing", "Row": 32, "DataJSON": '{"A":"Source: ODIN"}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Printing", "Row": 33, "DataJSON": '{"A":"Mesin","B":"El BD","C":"Mech BD","D":"Total Lost","E":"Run Hrs","F":"%El","G":"%Mech","H":"% Total Lost","I":"MTBF EL","J":"MTTR EL","K":"MTBF Mech","L":"MTTR Mech","M":"MTBF Mch","N":"MTTR Mch","O":"BD Events EL","P":"BD Event Mech"}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Printing", "Row": 34, "DataJSON": '{"A":"OFFSET - 4 MACHINE","B":17.88,"C":98.33,"D":116.21,"E":1105.46,"F":1.617426229804787,"G":8.894939663126662,"H":10.512365892931449,"I":65.02705882352942,"J":1.051764705882353,"K":42.51769230769231,"L":3.7819230769230767,"M":25.708372093023257,"N":2.7025581395348834,"O":17,"P":26}', "FormulaJSON": '{"D":"B34+C34","F":"B34/E34*100","G":"C34/E34*100","H":"D34/E34*100","I":"E34/O34","J":"B34/(O34)","K":"E34/P34","L":"C34/(P34)","M":"E34/(O34+P34)","N":"D34/(O34+P34)"}' }, { "Sheet": "Yearly_Printing", "Row": 35, "DataJSON": '{"A":"OFFSET UV INK - 5 MACHINE","B":53.53,"C":249.92,"D":303.45,"E":1154.07,"F":4.638366823502907,"G":21.655532160094275,"H":26.29389898359718,"I":17.754923076923077,"J":0.8235384615384616,"K":33.94323529411764,"L":7.350588235294118,"M":11.657272727272726,"N":3.065151515151515,"O":65,"P":34}', "FormulaJSON": '{"D":"B35+C35","F":"B35/E35*100","G":"C35/E35*100","H":"D35/E35*100","I":"E35/O35","J":"B35/(O35)","K":"E35/P35","L":"C35/(P35)","M":"E35/(O35+P35)","N":"D35/(O35+P35)"}' }, { "Sheet": "Yearly_Printing", "Row": 36, "DataJSON": '{"A":"OFFSET - 6 MACHINE","B":67.4,"C":171.11,"D":238.51000000000002,"E":1327.31,"F":5.077939592107346,"G":12.891487293849968,"H":17.969426885957315,"I":37.92314285714286,"J":1.925714285714286,"K":94.80785714285715,"L":12.222142857142858,"M":27.08795918367347,"N":4.867551020408164,"O":35,"P":14}', "FormulaJSON": '{"D":"B36+C36","F":"B36/E36*100","G":"C36/E36*100","H":"D36/E36*100","I":"E36/O36","J":"B36/(O36)","K":"E36/P36","L":"C36/(P36)","M":"E36/(O36+P36)","N":"D36/(O36+P36)"}' }, { "Sheet": "Yearly_Printing", "Row": 37, "DataJSON": '{"A":"SHEET FEED GRAVURE MACHINE"}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Printing", "Row": 38, "DataJSON": '{"H":18.25856392082865,"M":21.484534667989816,"N":3.5450868916981872,"O":117,"P":74}', "FormulaJSON": '{"H":"AVERAGE(H34:H37)","M":"AVERAGE(M34:M37)","N":"AVERAGE(N34:N37)","O":"SUM(O34:O37)","P":"SUM(P34:P37)"}' }, { "Sheet": "Yearly_Printing", "Row": 41, "DataJSON": '{"A":"Jan - Mei 2023"}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Printing", "Row": 42, "DataJSON": '{"A":"Source: ODIN"}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Printing", "Row": 43, "DataJSON": '{"A":"Mesin","B":"El BD","C":"Mech BD","D":"Total Lost","E":"Run Hrs","F":"%El","G":"%Mech","H":"% Total Lost","I":"MTBF EL","J":"MTTR EL","K":"MTBF Mech","L":"MTTR Mech","M":"MTBF Mch","N":"MTTR Mch","O":"BD Events EL","P":"BD Event Mech"}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Printing", "Row": 44, "DataJSON": '{"A":"OFFSET - 4 MACHINE","B":21.63,"C":98.33,"D":119.96,"E":1155.61,"F":1.8717387353865058,"G":8.508926021754744,"H":10.38066475714125,"I":57.780499999999996,"J":1.0815,"K":44.44653846153846,"L":3.7819230769230767,"M":25.12195652173913,"N":2.6078260869565217,"O":20,"P":26}', "FormulaJSON": '{"D":"B44+C44","F":"B44/E44*100","G":"C44/E44*100","H":"D44/E44*100","I":"E44/O44","J":"B44/(O44)","K":"E44/P44","L":"C44/(P44)","M":"E44/(O44+P44)","N":"D44/(O44+P44)"}' }, { "Sheet": "Yearly_Printing", "Row": 45, "DataJSON": '{"A":"OFFSET UV INK - 5 MACHINE","B":79.36,"C":259.92,"D":339.28000000000003,"E":1437.31,"F":5.521425440579972,"G":18.08378150851243,"H":23.605206949092405,"I":14.817628865979382,"J":0.8181443298969072,"K":35.05634146341463,"L":6.3395121951219515,"M":10.415289855072464,"N":2.458550724637681,"O":97,"P":41}', "FormulaJSON": '{"D":"B45+C45","F":"B45/E45*100","G":"C45/E45*100","H":"D45/E45*100","I":"E45/O45","J":"B45/(O45)","K":"E45/P45","L":"C45/(P45)","M":"E45/(O45+P45)","N":"D45/(O45+P45)"}' }, { "Sheet": "Yearly_Printing", "Row": 46, "DataJSON": '{"A":"OFFSET - 6 MACHINE","B":102.23,"C":171.94,"D":274.17,"E":1642.34,"F":6.22465506533361,"G":10.469208568262358,"H":16.693863633595967,"I":26.06888888888889,"J":1.6226984126984128,"K":96.60823529411765,"L":10.114117647058823,"M":20.529249999999998,"N":3.427125,"O":63,"P":17}', "FormulaJSON": '{"D":"B46+C46","F":"B46/E46*100","G":"C46/E46*100","H":"D46/E46*100","I":"E46/O46","J":"B46/(O46)","K":"E46/P46","L":"C46/(P46)","M":"E46/(O46+P46)","N":"D46/(O46+P46)"}' }, { "Sheet": "Yearly_Printing", "Row": 47, "DataJSON": '{"A":"SHEET FEED GRAVURE MACHINE"}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Printing", "Row": 48, "DataJSON": '{"A":"OFFSET - 8 MACHINE"}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Printing", "Row": 49, "DataJSON": '{"H":16.89324511327654,"M":18.688832125603863,"N":2.831167270531401,"O":180,"P":84}', "FormulaJSON": '{"H":"AVERAGE(H44:H48)","M":"AVERAGE(M44:M48)","N":"AVERAGE(N44:N48)","O":"SUM(O44:O48)","P":"SUM(P44:P48)"}' }, { "Sheet": "Yearly_Printing", "Row": 52, "DataJSON": '{"A":"Jan - Jun 2023"}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Printing", "Row": 53, "DataJSON": '{"A":"Source: ODIN"}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Printing", "Row": 54, "DataJSON": '{"A":"Mesin","B":"El BD","C":"Mech BD","D":"Total Lost","E":"Run Hrs","F":"%El","G":"%Mech","H":"% Total Lost","I":"MTBF EL","J":"MTTR EL","K":"MTBF Mech","L":"MTTR Mech","M":"MTBF Mch","N":"MTTR Mch","O":"BD Events EL","P":"BD Event Mech"}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Printing", "Row": 55, "DataJSON": '{"A":"OFFSET - 4 MACHINE","B":21.63,"C":98.33,"D":119.96,"E":1155.61,"F":1.87,"G":8.51,"H":10.38,"I":57.78,"J":1.08,"K":44.45,"L":3.78,"M":25.12,"N":2.61,"O":20,"P":26}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Printing", "Row": 56, "DataJSON": '{"A":"OFFSET UV INK - 5 MACHINE","B":80.53,"C":266.5,"D":347.03,"E":1670.45,"F":4.82085665539226,"G":15.953784908258253,"H":20.774641563650512,"I":16.06201923076923,"J":0.7743269230769231,"K":37.12111111111111,"L":5.9222222222222225,"M":11.211073825503355,"N":2.3290604026845636,"O":104,"P":45}', "FormulaJSON": '{"D":"B56+C56","F":"B56/E56*100","G":"C56/E56*100","H":"D56/E56*100","I":"E56/O56","J":"B56/(O56)","K":"E56/P56","L":"C56/(P56)","M":"E56/(O56+P56)","N":"D56/(O56+P56)"}' }, { "Sheet": "Yearly_Printing", "Row": 57, "DataJSON": '{"A":"OFFSET - 6 MACHINE","B":109.81,"C":178.94,"D":288.75,"E":1869.43,"F":5.87398297876893,"G":9.571901595673546,"H":15.445884574442475,"I":26.330000000000002,"J":1.5466197183098591,"K":89.02047619047619,"L":8.52095238095238,"M":20.319891304347827,"N":3.1385869565217392,"O":71,"P":21}', "FormulaJSON": '{"D":"B57+C57","F":"B57/E57*100","G":"C57/E57*100","H":"D57/E57*100","I":"E57/O57","J":"B57/(O57)","K":"E57/P57","L":"C57/(P57)","M":"E57/(O57+P57)","N":"D57/(O57+P57)"}' }, { "Sheet": "Yearly_Printing", "Row": 58, "DataJSON": '{"A":"SHEET FEED GRAVURE MACHINE"}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Printing", "Row": 59, "DataJSON": '{"A":"OFFSET - 8 MACHINE","B":2,"D":2,"E":229.15,"F":0.8727907484180668,"H":0.8727907484180668,"M":229.15,"N":2,"O":1,"P":0}', "FormulaJSON": '{"D":"B59+C59","F":"B59/E59*100","H":"D59/E59*100","M":"E59/(O59+P59)","N":"D59/(O59+P59)"}' }, { "Sheet": "Yearly_Printing", "Row": 60, "DataJSON": '{"H":11.868329221627764,"M":71.4502412824628,"N":2.5194118398015757,"O":196,"P":92}', "FormulaJSON": '{"H":"AVERAGE(H55:H59)","M":"AVERAGE(M55:M59)","N":"AVERAGE(N55:N59)","O":"SUM(O55:O59)","P":"SUM(P55:P59)"}' }, { "Sheet": "Yearly_Printing", "Row": 63, "DataJSON": '{"A":"Jan - Jul 2023"}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Printing", "Row": 64, "DataJSON": '{"A":"Source: ODIN"}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Printing", "Row": 65, "DataJSON": '{"A":"Mesin","B":"El BD","C":"Mech BD","D":"Total Lost","E":"Run Hrs","F":"%El","G":"%Mech","H":"% Total Lost","I":"MTBF EL","J":"MTTR EL","K":"MTBF Mech","L":"MTTR Mech","M":"MTBF Mch","N":"MTTR Mch","O":"BD Events EL","P":"BD Event Mech"}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Printing", "Row": 66, "DataJSON": '{"A":"OFFSET - 4 MACHINE","B":21.63,"C":98.33,"D":119.96,"E":1155.61,"F":1.87,"G":8.51,"H":10.38,"I":57.78,"J":1.08,"K":44.45,"L":3.78,"M":25.12,"N":2.61,"O":20,"P":26}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Printing", "Row": 67, "DataJSON": '{"A":"OFFSET UV INK - 5 MACHINE","B":94.2,"C":274.67,"D":368.87,"E":1812.51,"F":5.197212705033351,"G":15.154123287595656,"H":20.351335992629007,"I":15.10425,"J":0.785,"K":37.760625,"L":5.722291666666667,"M":10.78875,"N":2.1956547619047617,"O":120,"P":48}', "FormulaJSON": '{"D":"B67+C67","F":"B67/E67*100","G":"C67/E67*100","H":"D67/E67*100","I":"E67/O67","J":"B67/(O67)","K":"E67/P67","L":"C67/(P67)","M":"E67/(O67+P67)","N":"D67/(O67+P67)"}' }, { "Sheet": "Yearly_Printing", "Row": 68, "DataJSON": '{"A":"OFFSET - 6 MACHINE","B":222.37,"C":357.88,"D":580.25,"E":2086.83,"F":10.6558751790994,"G":17.149456352458035,"H":27.805331531557435,"I":28.200405405405405,"J":3.005,"K":99.37285714285714,"L":17.04190476190476,"M":21.966631578947368,"N":6.1078947368421055,"O":74,"P":21}', "FormulaJSON": '{"D":"B68+C68","F":"B68/E68*100","G":"C68/E68*100","H":"D68/E68*100","I":"E68/O68","J":"B68/(O68)","K":"E68/P68","L":"C68/(P68)","M":"E68/(O68+P68)","N":"D68/(O68+P68)"}' }, { "Sheet": "Yearly_Printing", "Row": 69, "DataJSON": '{"A":"SHEET FEED GRAVURE MACHINE"}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Printing", "Row": 70, "DataJSON": '{"A":"OFFSET - 8 MACHINE","B":7.03,"D":7.03,"E":683.36,"F":1.0287403418403185,"H":1.0287403418403185,"M":136.672,"N":1.4060000000000001,"O":5,"P":0}', "FormulaJSON": '{"D":"B70+C70","F":"B70/E70*100","H":"D70/E70*100","M":"E70/(O70+P70)","N":"D70/(O70+P70)"}' }, { "Sheet": "Yearly_Printing", "Row": 71, "DataJSON": '{"H":14.89135196650669,"M":48.63684539473684,"N":3.079887374686717,"O":219,"P":95}', "FormulaJSON": '{"H":"AVERAGE(H66:H70)","M":"AVERAGE(M66:M70)","N":"AVERAGE(N66:N70)","O":"SUM(O66:O70)","P":"SUM(P66:P70)"}' }, { "Sheet": "Yearly_Printing", "Row": 74, "DataJSON": '{"A":"Jan - Aug 2023","B":20.830000000000002,"C":0,"E":1748.7199999999998,"O":26,"P":0}', "FormulaJSON": '{"B":"B81+B70","C":"C81+C70","E":"E81+E70","O":"O81+O70","P":"P81+P70"}' }, { "Sheet": "Yearly_Printing", "Row": 75, "DataJSON": '{"A":"Source: ODIN"}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Printing", "Row": 76, "DataJSON": '{"A":"Mesin","B":"El BD","C":"Mech BD","D":"Total Lost","E":"Run Hrs","F":"%El","G":"%Mech","H":"% Total Lost","I":"MTBF EL","J":"MTTR EL","K":"MTBF Mech","L":"MTTR Mech","M":"MTBF Mch","N":"MTTR Mch","O":"BD Events EL","P":"BD Event Mech"}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Printing", "Row": 77, "DataJSON": '{"A":"OFFSET - 4 MACHINE","B":21.63,"C":98.33,"D":119.96,"E":1155.61,"F":1.87,"G":8.51,"H":10.38,"I":57.78,"J":1.08,"K":44.45,"L":3.78,"M":25.12,"N":2.61,"O":20,"P":26}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Printing", "Row": 78, "DataJSON": '{"A":"OFFSET UV INK - 5 MACHINE","B":265.62,"C":277.5,"D":543.12,"E":2029.94,"F":13.085115816231022,"G":13.670354788811492,"H":26.755470605042515,"I":14.499571428571429,"J":1.8972857142857142,"K":39.80274509803922,"L":5.4411764705882355,"M":10.627958115183246,"N":2.843560209424084,"O":140,"P":51}', "FormulaJSON": '{"D":"B78+C78","F":"B78/E78*100","G":"C78/E78*100","H":"D78/E78*100","I":"E78/O78","J":"B78/(O78)","K":"E78/P78","L":"C78/(P78)","M":"E78/(O78+P78)","N":"D78/(O78+P78)"}' }, { "Sheet": "Yearly_Printing", "Row": 79, "DataJSON": '{"A":"OFFSET - 6 MACHINE","B":249.37,"C":361.96,"D":611.3299999999999,"E":2352.93,"F":10.598275341807875,"G":15.383373071022088,"H":25.981648412829962,"I":29.411624999999997,"J":3.117125,"K":98.03875,"L":15.081666666666665,"M":22.62432692307692,"N":5.878173076923076,"O":80,"P":24}', "FormulaJSON": '{"D":"B79+C79","F":"B79/E79*100","G":"C79/E79*100","H":"D79/E79*100","I":"E79/O79","J":"B79/(O79)","K":"E79/P79","L":"C79/(P79)","M":"E79/(O79+P79)","N":"D79/(O79+P79)"}' }, { "Sheet": "Yearly_Printing", "Row": 80, "DataJSON": '{"A":"SHEET FEED GRAVURE MACHINE"}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Printing", "Row": 81, "DataJSON": '{"A":"OFFSET - 8 MACHINE","B":13.8,"C":0,"D":13.8,"E":1065.36,"F":1.295336787564767,"H":1.295336787564767,"M":50.731428571428566,"N":0.6571428571428571,"O":21,"P":0}', "FormulaJSON": '{"D":"B81+C81","F":"B81/E81*100","H":"D81/E81*100","M":"E81/(O81+P81)","N":"D81/(O81+P81)"}' }, { "Sheet": "Yearly_Printing", "Row": 82, "DataJSON": '{"H":16.103113951359312,"M":27.27592840242218,"N":2.997219035872504,"O":261,"P":101}', "FormulaJSON": '{"H":"AVERAGE(H77:H81)","M":"AVERAGE(M77:M81)","N":"AVERAGE(N77:N81)","O":"SUM(O77:O81)","P":"SUM(P77:P81)"}' }, { "Sheet": "Yearly_Conv", "Row": 2, "DataJSON": '{"B":44927}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Conv", "Row": 3, "DataJSON": '{"B":"Source: ODIN"}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Conv", "Row": 4, "DataJSON": '{"P":"El BD","Q":"Mech BD","R":"Total Lost","S":"Run Hrs","T":"%El","U":"%Mech","V":"% Total Lost","W":"MTBF EL","X":"MTTR EL","Y":"MTBF Mech","Z":"MTTR Mech","AA":"MTBF Mch","AB":"MTTR Mch","AC":"BD Events EL","AD":"BD Event Mech"}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Conv", "Row": 5, "DataJSON": '{"O":"AUTOPLATEN - 1 MACHINE","P":601.08,"R":601.08,"S":23.33,"T":2576.4252036005146,"AA":23.33,"AB":601.08,"AC":1,"AD":0}', "FormulaJSON": '{"R":"P5+Q5","T":"P5/S5*100","AA":"S5/(AC5+AD5)","AB":"R5/(AC5+AD5)","AD":"Z5/AC5*100"}' }, { "Sheet": "Yearly_Conv", "Row": 6, "DataJSON": '{"O":"AUTOPLATEN - 2 MACHINE","P":2.5,"Q":0.33,"R":2.83,"S":289.13,"T":0.8646629543803827,"U":0.11413550997821051,"V":0.9787984643585931,"AA":144.565,"AB":1.415,"AC":1,"AD":1}', "FormulaJSON": '{"T":"P6/S6*100","U":"Q6/S6*100","V":"R6/S6*100"}' }, { "Sheet": "Yearly_Conv", "Row": 7, "DataJSON": '{"O":"AUTOPLATEN - 3 EVOLINE","P":9,"Q":11.67,"R":20.67,"S":337.2,"T":2.6690391459074734,"U":3.4608540925266906,"V":6.129893238434164,"AA":42.15,"AB":2.58375,"AC":4,"AD":4}', "FormulaJSON": '{"T":"P7/S7*100"}' }, { "Sheet": "Yearly_Conv", "Row": 8, "DataJSON": '{"O":"AUTOPLATEN - 4 STRIPPING & BLANKING","P":0,"Q":1.58,"R":1.58,"S":596.87,"T":" ","U":0.2647142593864661,"V":0.2647142593864661,"AA":198.95666666666668,"AB":0.5266666666666667,"AC":0,"AD":3}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Conv", "Row": 9, "DataJSON": '{"O":"AUTOPLATEN - 7 STRIPPING & BLANKING","P":2.02,"Q":2,"R":4.02,"S":214.57,"T":0.9414177191592488,"U":0.9320967516428205,"V":1.8735144708020692,"AA":53.6425,"AB":1.005,"AC":3,"AD":1}', "FormulaJSON": '{"T":"P9/S9*100"}' }, { "Sheet": "Yearly_Conv", "Row": 10, "DataJSON": '{"O":"AUTOPLATEN - 5 STAMPING","P":0.83,"Q":0,"R":0.83,"S":354.24,"T":0.2343044263775971,"U":0,"V":0.2343044263775971,"AA":177.12,"AB":0.415,"AC":2,"AD":0}', "FormulaJSON": '{"T":"P10/S10*100"}' }, { "Sheet": "Yearly_Conv", "Row": 11, "DataJSON": '{"O":"AUTOPLATEN - 6 STAMPING","P":0,"Q":0,"R":0,"S":415.21,"T":0,"U":0,"V":0,"AA":415.21,"AB":0,"AC":1,"AD":0}', "FormulaJSON": '{"T":"P11/S11*100"}' }, { "Sheet": "Yearly_Conv", "Row": 12, "DataJSON": '{"O":"FOLDER GLUER - 1 MACHINE","P":0,"Q":1.63,"R":1.63,"S":533.82,"T":0,"U":0.3053463714360645,"V":0.3053463714360645,"AA":266.91,"AB":0.815,"AC":0,"AD":2}', "FormulaJSON": '{"T":"P12/S12*100"}' }, { "Sheet": "Yearly_Conv", "Row": 13, "DataJSON": '{"O":"FOLDER GLUER - 2 MACHINE","P":0,"Q":3.92,"R":3.92,"S":417.61,"T":0,"U":0.9386748401618735,"V":0.9386748401618735,"AA":69.60166666666667,"AB":0.6533333333333333,"AC":0,"AD":6}', "FormulaJSON": '{"T":"P13/S13*100"}' }, { "Sheet": "Yearly_Conv", "Row": 14, "DataJSON": '{"O":"FOLDER GLUER - 3 MACHINE","Q":2.26,"R":2.26,"S":416.89,"U":0.5421094293458706,"V":0.5421094293458706,"AA":208.445,"AB":1.13,"AD":2}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Conv", "Row": 15, "DataJSON": '{"O":"FOLDER GLUER - 4 MACHINE"}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Conv", "Row": 16, "DataJSON": '{"V":1.251928388922522,"AA":159.99308333333335,"AB":60.962374999999994,"AC":12,"AD":19}', "FormulaJSON": '{"V":"AVERAGE(V5:V15)","AA":"AVERAGE(AA5:AA15)","AB":"AVERAGE(AB5:AB15)","AC":"SUM(AC5:AC15)","AD":"SUM(AD5:AD15)"}' }, { "Sheet": "Yearly_Conv", "Row": 18, "DataJSON": '{"B":"Jan - Feb 2023"}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Conv", "Row": 19, "DataJSON": '{"B":"Source: ODIN"}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Conv", "Row": 20, "DataJSON": '{"P":"El BD","Q":"Mech BD","R":"Total Lost","S":"Run Hrs","T":"%El","U":"%Mech","V":"% Total Lost","W":"MTBF EL","X":"MTTR EL","Y":"MTBF Mech","Z":"MTTR Mech","AA":"MTBF Mch","AB":"MTTR Mch","AC":"BD Events EL","AD":"BD Event Mech"}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Conv", "Row": 21, "DataJSON": '{"O":"AUTOPLATEN - 1 MACHINE","P":601.08,"Q":0,"R":601.08,"S":23.33,"T":2576.4252036005146,"U":0,"AA":23.33,"AB":601.08,"AC":1,"AD":0}', "FormulaJSON": '{"R":"P21+Q21","T":"P21/S21*100","U":"Q21/S21*100","AA":"S21/(AC21+AD21)","AB":"R21/(AC21+AD21)"}' }, { "Sheet": "Yearly_Conv", "Row": 22, "DataJSON": '{"O":"AUTOPLATEN - 2 MACHINE","P":14.5,"Q":0.33,"R":14.83,"S":499.7,"T":2.9017410446267764,"U":0.06603962377426456,"V":2.967780668401041,"AA":62.4625,"AB":1.85375,"AC":7,"AD":1}', "FormulaJSON": '{"T":"P22/S22*100","V":"R22/S22*100"}' }, { "Sheet": "Yearly_Conv", "Row": 23, "DataJSON": '{"O":"AUTOPLATEN - 3 EVOLINE","P":9,"Q":12.17,"R":21.17,"S":486.61,"T":1.8495304247754876,"U":2.5009761410575204,"V":4.350506565833008,"AA":54.06777777777778,"AB":2.352222222222222,"AC":4,"AD":5}', "FormulaJSON": '{"T":"P23/S23*100"}' }, { "Sheet": "Yearly_Conv", "Row": 24, "DataJSON": '{"O":"AUTOPLATEN - 4 STRIPPING & BLANKING","P":0,"Q":6.38,"R":6.38,"S":913.72,"T":" ","U":0.6982445388083877,"V":0.6982445388083877,"AA":130.53142857142856,"AB":0.9114285714285714,"AC":0,"AD":7}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Conv", "Row": 25, "DataJSON": '{"O":"AUTOPLATEN - 7 STRIPPING & BLANKING","P":2.02,"Q":2.3,"R":4.32,"S":386.71,"T":0.5223552532905795,"U":0.5947609319645212,"V":1.1171161852551008,"AA":77.342,"AB":0.8640000000000001,"AC":3,"AD":2}', "FormulaJSON": '{"T":"P25/S25*100"}' }, { "Sheet": "Yearly_Conv", "Row": 26, "DataJSON": '{"O":"AUTOPLATEN - 5 STAMPING","P":4.08,"Q":0,"R":4.08,"S":602.89,"T":0.6767403672311699,"U":0,"V":0.6767403672311699,"AA":150.7225,"AB":1.02,"AC":4,"AD":0}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Conv", "Row": 27, "DataJSON": '{"O":"AUTOPLATEN - 6 STAMPING","P":213.42,"Q":0,"R":213.42,"S":578.87,"T":36.86838150189161,"U":0,"V":36.86838150189161,"AA":192.95666666666668,"AB":71.14,"AC":3,"AD":0}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Conv", "Row": 28, "DataJSON": '{"O":"FOLDER GLUER - 1 MACHINE","P":20,"Q":2.05,"R":22.05,"S":892.56,"T":2.2407457201756746,"U":0.2296764363180066,"V":2.4704221564936812,"AA":148.76,"AB":3.6750000000000003,"AC":3,"AD":3}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Conv", "Row": 29, "DataJSON": '{"O":"FOLDER GLUER - 2 MACHINE","P":0,"Q":5.59,"R":5.59,"S":684.42,"T":0,"U":0.8167499488618101,"V":0.8167499488618101,"AA":85.5525,"AB":0.69875,"AC":0,"AD":8}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Conv", "Row": 30, "DataJSON": '{"O":"FOLDER GLUER - 3 MACHINE","P":3.5,"Q":3.43,"R":6.93,"S":710.54,"T":0.4925831058068511,"U":0.4827314436907142,"V":0.9753145494975652,"AA":142.108,"AB":1.386,"AC":1,"AD":4}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Conv", "Row": 31, "DataJSON": '{"O":"FOLDER GLUER - 4 MACHINE"}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Conv", "Row": 32, "DataJSON": '{"V":5.660139609141487,"AA":106.7833373015873,"AB":68.49811507936508,"AC":26,"AD":30}', "FormulaJSON": '{"V":"AVERAGE(V21:V31)","AA":"AVERAGE(AA21:AA31)","AB":"AVERAGE(AB21:AB31)","AC":"SUM(AC21:AC31)","AD":"SUM(AD21:AD31)"}' }, { "Sheet": "Yearly_Conv", "Row": 34, "DataJSON": '{"B":"Jan - Mar 2023","P":7,"Q":13.29,"S":1962.52,"AC":2,"AD":10}', "FormulaJSON": '{"P":"P46+P30","Q":"Q46+Q30","S":"S46+S30","AC":"AC46+AC30","AD":"AD46+AD30"}' }, { "Sheet": "Yearly_Conv", "Row": 35, "DataJSON": '{"B":"Source: ODIN"}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Conv", "Row": 36, "DataJSON": '{"P":"El BD","Q":"Mech BD","R":"Total Lost","S":"Run Hrs","T":"%El","U":"%Mech","V":"% Total Lost","W":"MTBF EL","X":"MTTR EL","Y":"MTBF Mech","Z":"MTTR Mech","AA":"MTBF Mch","AB":"MTTR Mch","AC":"BD Events EL","AD":"BD Event Mech"}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Conv", "Row": 37, "DataJSON": '{"O":"AUTOPLATEN - 1 MACHINE","P":601.08,"Q":0,"R":601.08,"S":23.33,"T":2576.4252036005146,"U":0,"AA":23.33,"AB":601.08,"AC":1,"AD":0}', "FormulaJSON": '{"R":"P37+Q37","T":"P37/S37*100","U":"Q37/S37*100","AA":"S37/(AC37+AD37)","AB":"R37/(AC37+AD37)"}' }, { "Sheet": "Yearly_Conv", "Row": 38, "DataJSON": '{"O":"AUTOPLATEN - 2 MACHINE","P":16.83,"Q":23.11,"R":39.94,"S":805.41,"T":2.0896189518381942,"U":2.8693460473547634,"V":4.958964999192958,"AA":40.2705,"AB":1.9969999999999999,"AC":8,"AD":12}', "FormulaJSON": '{"T":"P38/S38*100","V":"R38/S38*100"}' }, { "Sheet": "Yearly_Conv", "Row": 39, "DataJSON": '{"O":"AUTOPLATEN - 3 EVOLINE","P":9,"Q":39.64,"R":48.64,"S":704.04,"T":1.2783364581557866,"U":5.630361911255043,"V":6.908698369410829,"AA":46.936,"AB":3.2426666666666666,"AC":4,"AD":11}', "FormulaJSON": '{"T":"P39/S39*100","V":"R39/S39*100"}' }, { "Sheet": "Yearly_Conv", "Row": 40, "DataJSON": '{"O":"AUTOPLATEN - 4 STRIPPING & BLANKING","P":1.17,"Q":79.24,"R":80.41,"S":1432.95,"T":0,"U":5.529851006664573,"V":5.611500750200634,"AA":130.26818181818183,"AB":7.31,"AC":1,"AD":10}', "FormulaJSON": '{"V":"R40/S40*100"}' }, { "Sheet": "Yearly_Conv", "Row": 41, "DataJSON": '{"O":"AUTOPLATEN - 7 STRIPPING & BLANKING","P":1,"Q":0.83,"R":1.83,"S":490.34,"T":0.2039401231798344,"U":0.16927030223926257,"V":0.373210425419097,"AA":245.17,"AB":0.915,"AC":1,"AD":1}', "FormulaJSON": '{"T":"P41/S41*100","V":"R41/S41*100"}' }, { "Sheet": "Yearly_Conv", "Row": 42, "DataJSON": '{"O":"AUTOPLATEN - 5 STAMPING","P":8.16,"Q":0.1,"R":8.26,"S":1541.39,"T":0.529392301753612,"U":0.006487650756784462,"V":0.5358799525103963,"AA":171.26555555555558,"AB":0.9177777777777778,"AC":8,"AD":1}', "FormulaJSON": '{"T":"P42/S42*100","V":"R42/S42*100"}' }, { "Sheet": "Yearly_Conv", "Row": 43, "DataJSON": '{"O":"AUTOPLATEN - 6 STAMPING","P":213.42,"Q":0,"R":213.42,"S":578.87,"T":0,"U":0,"V":"#REF!","AA":192.95666666666668,"AB":71.14,"AC":3,"AD":0}', "FormulaJSON": `{"V":"V27+'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Yearly_Conv", "Row": 44, "DataJSON": '{"O":"FOLDER GLUER - 1 MACHINE","P":20,"Q":3.05,"R":23.05,"S":1475.35,"T":1.3556105330938424,"U":0.20673060629681092,"V":1.5623411393906532,"AA":184.41875,"AB":2.88125,"AC":3,"AD":5}', "FormulaJSON": '{"T":"P44/S44*100","U":"Q44/S44*100","V":"R44/S44*100"}' }, { "Sheet": "Yearly_Conv", "Row": 45, "DataJSON": '{"O":"FOLDER GLUER - 2 MACHINE","P":0,"Q":7.42,"R":7.42,"S":1014.8,"T":0,"U":0.7311785573512022,"V":0.7311785573512022,"AA":84.56666666666666,"AB":0.6183333333333333,"AC":0,"AD":12}', "FormulaJSON": '{"T":"P45/S45*100","U":"Q45/S45*100","V":"R45/S45*100"}' }, { "Sheet": "Yearly_Conv", "Row": 46, "DataJSON": '{"O":"FOLDER GLUER - 3 MACHINE","P":3.5,"Q":9.86,"R":13.36,"S":1251.98,"T":0.2795571814246234,"U":0.7875525168133675,"V":1.067109698237991,"AA":178.8542857142857,"AB":1.9085714285714286,"AC":1,"AD":6}', "FormulaJSON": '{"T":"P46/S46*100","U":"Q46/S46*100","V":"R46/S46*100"}' }, { "Sheet": "Yearly_Conv", "Row": 47, "DataJSON": '{"O":"FOLDER GLUER - 4 MACHINE"}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Conv", "Row": 48, "DataJSON": '{"V":"#REF!","AA":129.80366064213564,"AB":69.20105992063492,"AC":30,"AD":58}', "FormulaJSON": '{"V":"AVERAGE(V37:V47)","AA":"AVERAGE(AA37:AA47)","AB":"AVERAGE(AB37:AB47)","AC":"SUM(AC37:AC47)","AD":"SUM(AD37:AD47)"}' }, { "Sheet": "Yearly_Conv", "Row": 50, "DataJSON": '{"B":"Jan - Apr 2023"}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Conv", "Row": 51, "DataJSON": '{"B":"Source: ODIN"}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Conv", "Row": 52, "DataJSON": '{"P":"El BD","Q":"Mech BD","R":"Total Lost","S":"Run Hrs","T":"%El","U":"%Mech","V":"% Total Lost","W":"MTBF EL","X":"MTTR EL","Y":"MTBF Mech","Z":"MTTR Mech","AA":"MTBF Mch","AB":"MTTR Mch","AC":"BD Events EL","AD":"BD Event Mech"}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Conv", "Row": 53, "DataJSON": '{"O":"AUTOPLATEN - 1 MACHINE","P":601.08,"Q":0,"R":601.08,"S":23.33,"T":2576.4252036005146,"U":0,"AA":23.33,"AB":601.08,"AC":1,"AD":0}', "FormulaJSON": '{"R":"P53+Q53","T":"P53/S53*100","U":"Q53/S53*100","AA":"S53/(AC53+AD53)","AB":"R53/(AC53+AD53)"}' }, { "Sheet": "Yearly_Conv", "Row": 54, "DataJSON": '{"O":"AUTOPLATEN - 2 MACHINE","P":35.9,"Q":48.03,"R":83.93,"S":1024.8,"T":3.5031225604996092,"U":4.686768149882904,"V":8.189890710382516,"AA":39.41538461538461,"AB":3.2280769230769235,"AC":9,"AD":17}', "FormulaJSON": '{"R":"P54+Q54","T":"P54/S54*100","U":"Q54/S54*100","V":"R54/S54*100","AA":"S54/(AC54+AD54)","AB":"R54/(AC54+AD54)"}' }, { "Sheet": "Yearly_Conv", "Row": 55, "DataJSON": '{"O":"AUTOPLATEN - 3 EVOLINE","P":12.08,"Q":41.89,"R":53.97,"S":1003.5,"T":1.2037867463876433,"U":4.174389636273045,"V":5.378176382660688,"AA":50.175,"AB":2.6985,"AC":6,"AD":14}', "FormulaJSON": '{"R":"P55+Q55","T":"P55/S55*100","U":"Q55/S55*100","V":"R55/S55*100","AA":"S55/(AC55+AD55)","AB":"R55/(AC55+AD55)"}' }, { "Sheet": "Yearly_Conv", "Row": 56, "DataJSON": '{"O":"AUTOPLATEN - 4 STRIPPING & BLANKING","P":"#REF!","Q":"#REF!","R":"#REF!","S":"#REF!","T":"#REF!","U":"#REF!","V":"#REF!","AA":"#REF!","AB":"#REF!","AC":"#REF!","AD":"#REF!"}', "FormulaJSON": `{"P":"P40+'Chart_Conv 01 Autoplaten'!#REF!","Q":"Q40+'Chart_Conv 01 Autoplaten'!#REF!","R":"R40+'Chart_Conv 01 Autoplaten'!#REF!","S":"S40+'Chart_Conv 01 Autoplaten'!#REF!","T":"T40+'Chart_Conv 01 Autoplaten'!#REF!","U":"U40+'Chart_Conv 01 Autoplaten'!#REF!","V":"V40+'Chart_Conv 01 Autoplaten'!#REF!","AA":"AA40+'Chart_Conv 01 Autoplaten'!#REF!","AB":"AB40+'Chart_Conv 01 Autoplaten'!#REF!","AC":"AC40+'Chart_Conv 01 Autoplaten'!#REF!","AD":"AD40+'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Yearly_Conv", "Row": 57, "DataJSON": '{"O":"AUTOPLATEN - 7 STRIPPING & BLANKING","P":"#REF!","Q":"#REF!","R":"#REF!","S":"#REF!","T":"#REF!","U":"#REF!","V":"#REF!","AA":"#REF!","AB":"#REF!","AC":"#REF!","AD":"#REF!"}', "FormulaJSON": `{"P":"P41+'Chart_Conv 01 Autoplaten'!#REF!","Q":"Q41+'Chart_Conv 01 Autoplaten'!#REF!","R":"R41+'Chart_Conv 01 Autoplaten'!#REF!","S":"S41+'Chart_Conv 01 Autoplaten'!#REF!","T":"T41+'Chart_Conv 01 Autoplaten'!#REF!","U":"U41+'Chart_Conv 01 Autoplaten'!#REF!","V":"V41+'Chart_Conv 01 Autoplaten'!#REF!","AA":"AA41+'Chart_Conv 01 Autoplaten'!#REF!","AB":"AB41+'Chart_Conv 01 Autoplaten'!#REF!","AC":"AC41+'Chart_Conv 01 Autoplaten'!#REF!","AD":"AD41+'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Yearly_Conv", "Row": 58, "DataJSON": '{"O":"AUTOPLATEN - 5 STAMPING","P":"#REF!","Q":"#REF!","R":"#REF!","S":"#REF!","T":"#REF!","U":"#REF!","V":"#REF!","AA":"#REF!","AB":"#REF!","AC":"#REF!","AD":"#REF!"}', "FormulaJSON": `{"P":"P42+'Chart_Conv 01 Autoplaten'!#REF!","Q":"Q42+'Chart_Conv 01 Autoplaten'!#REF!","R":"R42+'Chart_Conv 01 Autoplaten'!#REF!","S":"S42+'Chart_Conv 01 Autoplaten'!#REF!","T":"T42+'Chart_Conv 01 Autoplaten'!#REF!","U":"U42+'Chart_Conv 01 Autoplaten'!#REF!","V":"V42+'Chart_Conv 01 Autoplaten'!#REF!","AA":"AA42+'Chart_Conv 01 Autoplaten'!#REF!","AB":"AB42+'Chart_Conv 01 Autoplaten'!#REF!","AC":"AC42+'Chart_Conv 01 Autoplaten'!#REF!","AD":"AD42+'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Yearly_Conv", "Row": 59, "DataJSON": '{"O":"AUTOPLATEN - 6 STAMPING","P":"#REF!","Q":"#REF!","R":"#REF!","S":"#REF!","T":"#REF!","U":"#REF!","V":"#REF!","AA":"#REF!","AB":"#REF!","AC":"#REF!","AD":"#REF!"}', "FormulaJSON": `{"P":"P43+'Chart_Conv 01 Autoplaten'!#REF!","Q":"Q43+'Chart_Conv 01 Autoplaten'!#REF!","R":"R43+'Chart_Conv 01 Autoplaten'!#REF!","S":"S43+'Chart_Conv 01 Autoplaten'!#REF!","T":"T43+'Chart_Conv 01 Autoplaten'!#REF!","U":"U43+'Chart_Conv 01 Autoplaten'!#REF!","V":"V43+'Chart_Conv 01 Autoplaten'!#REF!","AA":"AA43+'Chart_Conv 01 Autoplaten'!#REF!","AB":"AB43+'Chart_Conv 01 Autoplaten'!#REF!","AC":"AC43+'Chart_Conv 01 Autoplaten'!#REF!","AD":"AD43+'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Yearly_Conv", "Row": 60, "DataJSON": '{"O":"FOLDER GLUER - 1 MACHINE","P":"#REF!","Q":"#REF!","R":"#REF!","S":"#REF!","T":"#REF!","U":"#REF!","V":"#REF!","AA":"#REF!","AB":"#REF!","AC":"#REF!","AD":"#REF!"}', "FormulaJSON": `{"P":"P44+'Chart_Conv 01 Autoplaten'!#REF!","Q":"Q44+'Chart_Conv 01 Autoplaten'!#REF!","R":"R44+'Chart_Conv 01 Autoplaten'!#REF!","S":"S44+'Chart_Conv 01 Autoplaten'!#REF!","T":"T44+'Chart_Conv 01 Autoplaten'!#REF!","U":"U44+'Chart_Conv 01 Autoplaten'!#REF!","V":"V44+'Chart_Conv 01 Autoplaten'!#REF!","AA":"AA44+'Chart_Conv 01 Autoplaten'!#REF!","AB":"AB44+'Chart_Conv 01 Autoplaten'!#REF!","AC":"AC44+'Chart_Conv 01 Autoplaten'!#REF!","AD":"AD44+'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Yearly_Conv", "Row": 61, "DataJSON": '{"O":"FOLDER GLUER - 2 MACHINE","P":"#REF!","Q":"#REF!","R":"#REF!","S":"#REF!","T":"#REF!","U":"#REF!","V":"#REF!","AA":"#REF!","AB":"#REF!","AC":"#REF!","AD":"#REF!"}', "FormulaJSON": `{"P":"P45+'Chart_Conv 01 Autoplaten'!#REF!","Q":"Q45+'Chart_Conv 01 Autoplaten'!#REF!","R":"R45+'Chart_Conv 01 Autoplaten'!#REF!","S":"S45+'Chart_Conv 01 Autoplaten'!#REF!","T":"T45+'Chart_Conv 01 Autoplaten'!#REF!","U":"U45+'Chart_Conv 01 Autoplaten'!#REF!","V":"V45+'Chart_Conv 01 Autoplaten'!#REF!","AA":"AA45+'Chart_Conv 01 Autoplaten'!#REF!","AB":"AB45+'Chart_Conv 01 Autoplaten'!#REF!","AC":"AC45+'Chart_Conv 01 Autoplaten'!#REF!","AD":"AD45+'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Yearly_Conv", "Row": 62, "DataJSON": '{"O":"FOLDER GLUER - 3 MACHINE","P":"#REF!","Q":"#REF!","R":"#REF!","S":"#REF!","T":"#REF!","U":"#REF!","V":"#REF!","AA":"#REF!","AB":"#REF!","AC":"#REF!","AD":"#REF!"}', "FormulaJSON": `{"P":"P46+'Chart_Conv 01 Autoplaten'!#REF!","Q":"Q46+'Chart_Conv 01 Autoplaten'!#REF!","R":"R46+'Chart_Conv 01 Autoplaten'!#REF!","S":"S46+'Chart_Conv 01 Autoplaten'!#REF!","T":"T46+'Chart_Conv 01 Autoplaten'!#REF!","U":"U46+'Chart_Conv 01 Autoplaten'!#REF!","V":"V46+'Chart_Conv 01 Autoplaten'!#REF!","AA":"AA46+'Chart_Conv 01 Autoplaten'!#REF!","AB":"AB46+'Chart_Conv 01 Autoplaten'!#REF!","AC":"AC46+'Chart_Conv 01 Autoplaten'!#REF!","AD":"AD46+'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Yearly_Conv", "Row": 63, "DataJSON": '{"O":"FOLDER GLUER - 4 MACHINE","P":"#REF!"}', "FormulaJSON": `{"P":"P47+'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Yearly_Conv", "Row": 64, "DataJSON": '{"V":"#REF!","AA":"#REF!","AB":"#REF!","AC":"#REF!","AD":"#REF!"}', "FormulaJSON": '{"V":"AVERAGE(V53:V63)","AA":"AVERAGE(AA53:AA63)","AB":"AVERAGE(AB53:AB63)","AC":"SUM(AC53:AC63)","AD":"SUM(AD53:AD63)"}' }, { "Sheet": "Yearly_Conv", "Row": 66, "DataJSON": '{"B":"Jan - May 2023"}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Conv", "Row": 67, "DataJSON": '{"B":"Source: ODIN"}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Conv", "Row": 68, "DataJSON": '{"P":"El BD","Q":"Mech BD","R":"Total Lost","S":"Run Hrs","T":"%El","U":"%Mech","V":"% Total Lost","W":"MTBF EL","X":"MTTR EL","Y":"MTBF Mech","Z":"MTTR Mech","AA":"MTBF Mch","AB":"MTTR Mch","AC":"BD Events EL","AD":"BD Event Mech"}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Conv", "Row": 69, "DataJSON": '{"O":"AUTOPLATEN - 1 MACHINE","P":601.08,"Q":0,"R":601.08,"S":23.33,"T":2576.4252036005146,"U":0,"AA":23.33,"AB":601.08,"AC":1,"AD":0}', "FormulaJSON": '{"R":"P69+Q69","T":"P69/S69*100","U":"Q69/S69*100","AA":"S69/(AC69+AD69)","AB":"R69/(AC69+AD69)"}' }, { "Sheet": "Yearly_Conv", "Row": 70, "DataJSON": '{"O":"AUTOPLATEN - 2 MACHINE","P":"#REF!","Q":"#REF!","R":"#REF!","S":"#REF!","T":"#REF!","U":"#REF!","V":"#REF!","AA":"#REF!","AB":"#REF!","AC":"#REF!","AD":"#REF!"}', "FormulaJSON": `{"P":"P54+'Chart_Conv 01 Autoplaten'!#REF!","Q":"Q54+'Chart_Conv 01 Autoplaten'!#REF!","R":"R54+'Chart_Conv 01 Autoplaten'!#REF!","S":"S54+'Chart_Conv 01 Autoplaten'!#REF!","T":"T54+'Chart_Conv 01 Autoplaten'!#REF!","U":"U54+'Chart_Conv 01 Autoplaten'!#REF!","V":"V54+'Chart_Conv 01 Autoplaten'!#REF!","AA":"AA54+'Chart_Conv 01 Autoplaten'!#REF!","AB":"AB54+'Chart_Conv 01 Autoplaten'!#REF!","AC":"AC54+'Chart_Conv 01 Autoplaten'!#REF!","AD":"AD54+'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Yearly_Conv", "Row": 71, "DataJSON": '{"O":"AUTOPLATEN - 3 EVOLINE","P":"#REF!","Q":"#REF!","R":"#REF!","S":"#REF!","T":"#REF!","U":"#REF!","V":"#REF!","AA":"#REF!","AB":"#REF!","AC":"#REF!","AD":"#REF!"}', "FormulaJSON": `{"P":"P55+'Chart_Conv 01 Autoplaten'!#REF!","Q":"Q55+'Chart_Conv 01 Autoplaten'!#REF!","R":"R55+'Chart_Conv 01 Autoplaten'!#REF!","S":"S55+'Chart_Conv 01 Autoplaten'!#REF!","T":"T55+'Chart_Conv 01 Autoplaten'!#REF!","U":"U55+'Chart_Conv 01 Autoplaten'!#REF!","V":"V55+'Chart_Conv 01 Autoplaten'!#REF!","AA":"AA55+'Chart_Conv 01 Autoplaten'!#REF!","AB":"AB55+'Chart_Conv 01 Autoplaten'!#REF!","AC":"AC55+'Chart_Conv 01 Autoplaten'!#REF!","AD":"AD55+'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Yearly_Conv", "Row": 72, "DataJSON": '{"O":"AUTOPLATEN - 4 STRIPPING & BLANKING","P":"#REF!","Q":"#REF!","R":"#REF!","S":"#REF!","T":"#REF!","U":"#REF!","V":"#REF!","AA":"#REF!","AB":"#REF!","AC":"#REF!","AD":"#REF!"}', "FormulaJSON": `{"P":"P56+'Chart_Conv 01 Autoplaten'!#REF!","Q":"Q56+'Chart_Conv 01 Autoplaten'!#REF!","R":"R56+'Chart_Conv 01 Autoplaten'!#REF!","S":"S56+'Chart_Conv 01 Autoplaten'!#REF!","T":"T56+'Chart_Conv 01 Autoplaten'!#REF!","U":"U56+'Chart_Conv 01 Autoplaten'!#REF!","V":"V56+'Chart_Conv 01 Autoplaten'!#REF!","AA":"AA56+'Chart_Conv 01 Autoplaten'!#REF!","AB":"AB56+'Chart_Conv 01 Autoplaten'!#REF!","AC":"AC56+'Chart_Conv 01 Autoplaten'!#REF!","AD":"AD56+'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Yearly_Conv", "Row": 73, "DataJSON": '{"O":"AUTOPLATEN - 7 STRIPPING & BLANKING","P":"#REF!","Q":"#REF!","R":"#REF!","S":"#REF!","T":"#REF!","U":"#REF!","V":"#REF!","AA":"#REF!","AB":"#REF!","AC":"#REF!","AD":"#REF!"}', "FormulaJSON": `{"P":"P57+'Chart_Conv 01 Autoplaten'!#REF!","Q":"Q57+'Chart_Conv 01 Autoplaten'!#REF!","R":"R57+'Chart_Conv 01 Autoplaten'!#REF!","S":"S57+'Chart_Conv 01 Autoplaten'!#REF!","T":"T57+'Chart_Conv 01 Autoplaten'!#REF!","U":"U57+'Chart_Conv 01 Autoplaten'!#REF!","V":"V57+'Chart_Conv 01 Autoplaten'!#REF!","AA":"AA57+'Chart_Conv 01 Autoplaten'!#REF!","AB":"AB57+'Chart_Conv 01 Autoplaten'!#REF!","AC":"AC57+'Chart_Conv 01 Autoplaten'!#REF!","AD":"AD57+'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Yearly_Conv", "Row": 74, "DataJSON": '{"O":"AUTOPLATEN - 5 STAMPING","P":"#REF!","Q":"#REF!","R":"#REF!","S":"#REF!","T":"#REF!","U":"#REF!","V":"#REF!","AA":"#REF!","AB":"#REF!","AC":3,"AD":6}', "FormulaJSON": `{"P":"P58+'Chart_Conv 01 Autoplaten'!#REF!","Q":"Q58+'Chart_Conv 01 Autoplaten'!#REF!","R":"R58+'Chart_Conv 01 Autoplaten'!#REF!","S":"S58+'Chart_Conv 01 Autoplaten'!#REF!","T":"P74/S74*100","U":"Q74/S74*100","V":"R74/S74*100","AA":"S74/(AC74+AD74)","AB":"R74/(AC74+AD74)"}` }, { "Sheet": "Yearly_Conv", "Row": 75, "DataJSON": '{"O":"AUTOPLATEN - 6 STAMPING","P":"#REF!","Q":"#REF!","R":"#REF!","S":"#REF!","T":"#REF!","U":"#REF!","V":"#REF!","AA":"#REF!","AB":"#REF!","AC":"#REF!","AD":"#REF!"}', "FormulaJSON": `{"P":"P59+'Chart_Conv 01 Autoplaten'!#REF!","Q":"Q59+'Chart_Conv 01 Autoplaten'!#REF!","R":"R59+'Chart_Conv 01 Autoplaten'!#REF!","S":"S59+'Chart_Conv 01 Autoplaten'!#REF!","T":"T59+'Chart_Conv 01 Autoplaten'!#REF!","U":"U59+'Chart_Conv 01 Autoplaten'!#REF!","V":"V59+'Chart_Conv 01 Autoplaten'!#REF!","AA":"AA59+'Chart_Conv 01 Autoplaten'!#REF!","AB":"AB59+'Chart_Conv 01 Autoplaten'!#REF!","AC":"AC59+'Chart_Conv 01 Autoplaten'!#REF!","AD":"AD59+'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Yearly_Conv", "Row": 76, "DataJSON": '{"O":"FOLDER GLUER - 1 MACHINE","P":"#REF!","Q":"#REF!","R":"#REF!","S":"#REF!","T":"#REF!","U":"#REF!","V":"#REF!","AA":"#REF!","AB":"#REF!","AC":"#REF!","AD":"#REF!"}', "FormulaJSON": `{"P":"P60+'Chart_Conv 01 Autoplaten'!#REF!","Q":"Q60+'Chart_Conv 01 Autoplaten'!#REF!","R":"R60+'Chart_Conv 01 Autoplaten'!#REF!","S":"S60+'Chart_Conv 01 Autoplaten'!#REF!","T":"T60+'Chart_Conv 01 Autoplaten'!#REF!","U":"U60+'Chart_Conv 01 Autoplaten'!#REF!","V":"V60+'Chart_Conv 01 Autoplaten'!#REF!","AA":"AA60+'Chart_Conv 01 Autoplaten'!#REF!","AB":"AB60+'Chart_Conv 01 Autoplaten'!#REF!","AC":"AC60+'Chart_Conv 01 Autoplaten'!#REF!","AD":"AD60+'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Yearly_Conv", "Row": 77, "DataJSON": '{"O":"FOLDER GLUER - 2 MACHINE","P":"#REF!","Q":"#REF!","R":"#REF!","S":"#REF!","T":"#REF!","U":"#REF!","V":"#REF!","AA":"#REF!","AB":"#REF!","AC":"#REF!","AD":"#REF!"}', "FormulaJSON": `{"P":"P61+'Chart_Conv 01 Autoplaten'!#REF!","Q":"Q61+'Chart_Conv 01 Autoplaten'!#REF!","R":"R61+'Chart_Conv 01 Autoplaten'!#REF!","S":"S61+'Chart_Conv 01 Autoplaten'!#REF!","T":"T61+'Chart_Conv 01 Autoplaten'!#REF!","U":"U61+'Chart_Conv 01 Autoplaten'!#REF!","V":"V61+'Chart_Conv 01 Autoplaten'!#REF!","AA":"AA61+'Chart_Conv 01 Autoplaten'!#REF!","AB":"AB61+'Chart_Conv 01 Autoplaten'!#REF!","AC":"AC61+'Chart_Conv 01 Autoplaten'!#REF!","AD":"AD61+'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Yearly_Conv", "Row": 78, "DataJSON": '{"O":"FOLDER GLUER - 3 MACHINE","P":"#REF!","Q":"#REF!","R":"#REF!","S":"#REF!","T":"#REF!","U":"#REF!","V":"#REF!","AA":"#REF!","AB":"#REF!","AC":"#REF!","AD":"#REF!"}', "FormulaJSON": `{"P":"P62+'Chart_Conv 01 Autoplaten'!#REF!","Q":"Q62+'Chart_Conv 01 Autoplaten'!#REF!","R":"R62+'Chart_Conv 01 Autoplaten'!#REF!","S":"S62+'Chart_Conv 01 Autoplaten'!#REF!","T":"T62+'Chart_Conv 01 Autoplaten'!#REF!","U":"U62+'Chart_Conv 01 Autoplaten'!#REF!","V":"V62+'Chart_Conv 01 Autoplaten'!#REF!","AA":"AA62+'Chart_Conv 01 Autoplaten'!#REF!","AB":"AB62+'Chart_Conv 01 Autoplaten'!#REF!","AC":"AC62+'Chart_Conv 01 Autoplaten'!#REF!","AD":"AD62+'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Yearly_Conv", "Row": 79, "DataJSON": '{"O":"FOLDER GLUER - 4 MACHINE"}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Conv", "Row": 80, "DataJSON": '{"V":"#REF!","AA":"#REF!","AB":"#REF!","AC":"#REF!","AD":"#REF!"}', "FormulaJSON": '{"V":"AVERAGE(V69:V79)","AA":"AVERAGE(AA69:AA79)","AB":"AVERAGE(AB69:AB79)","AC":"SUM(AC69:AC79)","AD":"SUM(AD69:AD79)"}' }, { "Sheet": "Yearly_Conv", "Row": 82, "DataJSON": '{"B":"Jan - Jun 2023"}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Conv", "Row": 83, "DataJSON": '{"B":"Source: ODIN"}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Conv", "Row": 84, "DataJSON": '{"P":"El BD","Q":"Mech BD","R":"Total Lost","S":"Run Hrs","T":"%El","U":"%Mech","V":"% Total Lost","W":"MTBF EL","X":"MTTR EL","Y":"MTBF Mech","Z":"MTTR Mech","AA":"MTBF Mch","AB":"MTTR Mch","AC":"BD Events EL","AD":"BD Event Mech"}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Conv", "Row": 85, "DataJSON": '{"O":"AUTOPLATEN - 1 MACHINE","P":601.08,"Q":0,"R":601.08,"S":23.33,"T":2576.4252036005146,"U":0,"AA":23.33,"AB":601.08,"AC":1,"AD":0}', "FormulaJSON": '{"R":"P85+Q85","T":"P85/S85*100","U":"Q85/S85*100","AA":"S85/(AC85+AD85)","AB":"R85/(AC85+AD85)"}' }, { "Sheet": "Yearly_Conv", "Row": 86, "DataJSON": '{"O":"AUTOPLATEN - 2 MACHINE","P":"#REF!","Q":"#REF!","R":"#REF!","S":"#REF!","T":"#REF!","U":"#REF!","V":"#REF!","AA":"#REF!","AB":"#REF!","AC":"#REF!","AD":"#REF!"}', "FormulaJSON": `{"P":"P70+'Chart_Conv 01 Autoplaten'!#REF!","Q":"Q70+'Chart_Conv 01 Autoplaten'!#REF!","R":"R70+'Chart_Conv 01 Autoplaten'!#REF!","S":"S70+'Chart_Conv 01 Autoplaten'!#REF!","T":"T70+'Chart_Conv 01 Autoplaten'!#REF!","U":"U70+'Chart_Conv 01 Autoplaten'!#REF!","V":"V70+'Chart_Conv 01 Autoplaten'!#REF!","AA":"AA70+'Chart_Conv 01 Autoplaten'!#REF!","AB":"AB70+'Chart_Conv 01 Autoplaten'!#REF!","AC":"AC70+'Chart_Conv 01 Autoplaten'!#REF!","AD":"AD70+'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Yearly_Conv", "Row": 87, "DataJSON": '{"O":"AUTOPLATEN - 3 EVOLINE","P":"#REF!","Q":"#REF!","R":"#REF!","S":"#REF!","T":"#REF!","U":"#REF!","V":"#REF!","AA":"#REF!","AB":"#REF!","AC":"#REF!","AD":"#REF!"}', "FormulaJSON": `{"P":"P71+'Chart_Conv 01 Autoplaten'!#REF!","Q":"Q71+'Chart_Conv 01 Autoplaten'!#REF!","R":"R71+'Chart_Conv 01 Autoplaten'!#REF!","S":"S71+'Chart_Conv 01 Autoplaten'!#REF!","T":"T71+'Chart_Conv 01 Autoplaten'!#REF!","U":"U71+'Chart_Conv 01 Autoplaten'!#REF!","V":"V71+'Chart_Conv 01 Autoplaten'!#REF!","AA":"AA71+'Chart_Conv 01 Autoplaten'!#REF!","AB":"AB71+'Chart_Conv 01 Autoplaten'!#REF!","AC":"AC71+'Chart_Conv 01 Autoplaten'!#REF!","AD":"AD71+'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Yearly_Conv", "Row": 88, "DataJSON": '{"O":"AUTOPLATEN - 4 STRIPPING & BLANKING","P":"#REF!","Q":"#REF!","R":"#REF!","S":"#REF!","T":"#REF!","U":"#REF!","V":"#REF!","AA":"#REF!","AB":"#REF!","AC":"#REF!","AD":"#REF!"}', "FormulaJSON": `{"P":"P72+'Chart_Conv 01 Autoplaten'!#REF!","Q":"Q72+'Chart_Conv 01 Autoplaten'!#REF!","R":"R72+'Chart_Conv 01 Autoplaten'!#REF!","S":"S72+'Chart_Conv 01 Autoplaten'!#REF!","T":"T72+'Chart_Conv 01 Autoplaten'!#REF!","U":"U72+'Chart_Conv 01 Autoplaten'!#REF!","V":"V72+'Chart_Conv 01 Autoplaten'!#REF!","AA":"AA72+'Chart_Conv 01 Autoplaten'!#REF!","AB":"AB72+'Chart_Conv 01 Autoplaten'!#REF!","AC":"AC72+'Chart_Conv 01 Autoplaten'!#REF!","AD":"AD72+'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Yearly_Conv", "Row": 89, "DataJSON": '{"O":"AUTOPLATEN - 7 STRIPPING & BLANKING","P":"#REF!","Q":"#REF!","R":"#REF!","S":"#REF!","T":"#REF!","U":"#REF!","V":"#REF!","AA":"#REF!","AB":"#REF!","AC":"#REF!","AD":"#REF!"}', "FormulaJSON": `{"P":"P73+'Chart_Conv 01 Autoplaten'!#REF!","Q":"Q73+'Chart_Conv 01 Autoplaten'!#REF!","R":"R73+'Chart_Conv 01 Autoplaten'!#REF!","S":"S73+'Chart_Conv 01 Autoplaten'!#REF!","T":"T73+'Chart_Conv 01 Autoplaten'!#REF!","U":"U73+'Chart_Conv 01 Autoplaten'!#REF!","V":"V73+'Chart_Conv 01 Autoplaten'!#REF!","AA":"AA73+'Chart_Conv 01 Autoplaten'!#REF!","AB":"AB73+'Chart_Conv 01 Autoplaten'!#REF!","AC":"AC73+'Chart_Conv 01 Autoplaten'!#REF!","AD":"AD73+'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Yearly_Conv", "Row": 90, "DataJSON": '{"O":"AUTOPLATEN - 5 STAMPING","P":"#REF!","Q":"#REF!","R":"#REF!","S":"#REF!","T":"#REF!","U":"#REF!","V":"#REF!","AA":"#REF!","AB":"#REF!","AC":"#REF!","AD":"#REF!"}', "FormulaJSON": `{"P":"P74+'Chart_Conv 01 Autoplaten'!#REF!","Q":"Q74+'Chart_Conv 01 Autoplaten'!#REF!","R":"R74+'Chart_Conv 01 Autoplaten'!#REF!","S":"S74+'Chart_Conv 01 Autoplaten'!#REF!","T":"T74+'Chart_Conv 01 Autoplaten'!#REF!","U":"U74+'Chart_Conv 01 Autoplaten'!#REF!","V":"V74+'Chart_Conv 01 Autoplaten'!#REF!","AA":"AA74+'Chart_Conv 01 Autoplaten'!#REF!","AB":"AB74+'Chart_Conv 01 Autoplaten'!#REF!","AC":"AC74+'Chart_Conv 01 Autoplaten'!#REF!","AD":"AD74+'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Yearly_Conv", "Row": 91, "DataJSON": '{"O":"AUTOPLATEN - 6 STAMPING","P":"#REF!","Q":"#REF!","R":"#REF!","S":"#REF!","T":"#REF!","U":"#REF!","V":"#REF!","AA":"#REF!","AB":"#REF!","AC":"#REF!","AD":"#REF!"}', "FormulaJSON": `{"P":"P75+'Chart_Conv 01 Autoplaten'!#REF!","Q":"Q75+'Chart_Conv 01 Autoplaten'!#REF!","R":"R75+'Chart_Conv 01 Autoplaten'!#REF!","S":"S75+'Chart_Conv 01 Autoplaten'!#REF!","T":"T75+'Chart_Conv 01 Autoplaten'!#REF!","U":"U75+'Chart_Conv 01 Autoplaten'!#REF!","V":"V75+'Chart_Conv 01 Autoplaten'!#REF!","AA":"AA75+'Chart_Conv 01 Autoplaten'!#REF!","AB":"AB75+'Chart_Conv 01 Autoplaten'!#REF!","AC":"AC75+'Chart_Conv 01 Autoplaten'!#REF!","AD":"AD75+'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Yearly_Conv", "Row": 92, "DataJSON": '{"O":"FOLDER GLUER - 1 MACHINE","P":"#REF!","Q":"#REF!","R":"#REF!","S":"#REF!","T":"#REF!","U":"#REF!","V":"#REF!","AA":"#REF!","AB":"#REF!","AC":"#REF!","AD":2}', "FormulaJSON": `{"P":"P76+'Chart_Conv 01 Autoplaten'!#REF!","Q":"Q76+'Chart_Conv 01 Autoplaten'!#REF!","R":"R76+'Chart_Conv 01 Autoplaten'!#REF!","S":"S76+'Chart_Conv 01 Autoplaten'!#REF!","T":"T76+'Chart_Conv 01 Autoplaten'!#REF!","U":"U76+'Chart_Conv 01 Autoplaten'!#REF!","V":"V76+'Chart_Conv 01 Autoplaten'!#REF!","AA":"AA76+'Chart_Conv 01 Autoplaten'!#REF!","AB":"AB76+'Chart_Conv 01 Autoplaten'!#REF!","AC":"AC76+'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Yearly_Conv", "Row": 93, "DataJSON": '{"O":"FOLDER GLUER - 2 MACHINE","P":"#REF!","Q":"#REF!","R":"#REF!","S":"#REF!","T":"#REF!","U":"#REF!","V":"#REF!","AA":"#REF!","AB":"#REF!","AC":"#REF!","AD":"#REF!"}', "FormulaJSON": `{"P":"P77+'Chart_Conv 01 Autoplaten'!#REF!","Q":"Q77+'Chart_Conv 01 Autoplaten'!#REF!","R":"R77+'Chart_Conv 01 Autoplaten'!#REF!","S":"S77+'Chart_Conv 01 Autoplaten'!#REF!","T":"T77+'Chart_Conv 01 Autoplaten'!#REF!","U":"U77+'Chart_Conv 01 Autoplaten'!#REF!","V":"V77+'Chart_Conv 01 Autoplaten'!#REF!","AA":"AA77+'Chart_Conv 01 Autoplaten'!#REF!","AB":"AB77+'Chart_Conv 01 Autoplaten'!#REF!","AC":"AC77+'Chart_Conv 01 Autoplaten'!#REF!","AD":"AD77+'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Yearly_Conv", "Row": 94, "DataJSON": '{"O":"FOLDER GLUER - 3 MACHINE","P":"#REF!","Q":"#REF!","R":"#REF!","S":"#REF!","T":"#REF!","U":"#REF!","V":"#REF!","AA":"#REF!","AB":"#REF!","AC":"#REF!","AD":"#REF!"}', "FormulaJSON": `{"P":"P78+'Chart_Conv 01 Autoplaten'!#REF!","Q":"Q78+'Chart_Conv 01 Autoplaten'!#REF!","R":"R78+'Chart_Conv 01 Autoplaten'!#REF!","S":"S78+'Chart_Conv 01 Autoplaten'!#REF!","T":"T78+'Chart_Conv 01 Autoplaten'!#REF!","U":"U78+'Chart_Conv 01 Autoplaten'!#REF!","V":"V78+'Chart_Conv 01 Autoplaten'!#REF!","AA":"AA78+'Chart_Conv 01 Autoplaten'!#REF!","AB":"AB78+'Chart_Conv 01 Autoplaten'!#REF!","AC":"AC78+'Chart_Conv 01 Autoplaten'!#REF!","AD":"AD78+'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Yearly_Conv", "Row": 95, "DataJSON": '{"O":"FOLDER GLUER - 4 MACHINE"}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Conv", "Row": 96, "DataJSON": '{"V":"#REF!","AA":"#REF!","AB":"#REF!","AC":"#REF!","AD":"#REF!"}', "FormulaJSON": '{"V":"AVERAGE(V85:V95)","AA":"AVERAGE(AA85:AA95)","AB":"AVERAGE(AB85:AB95)","AC":"SUM(AC85:AC95)","AD":"SUM(AD85:AD95)"}' }, { "Sheet": "Yearly_Conv", "Row": 98, "DataJSON": '{"B":"Jan - Jul 2023"}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Conv", "Row": 99, "DataJSON": '{"B":"Source: ODIN"}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Conv", "Row": 100, "DataJSON": '{"P":"El BD","Q":"Mech BD","R":"Total Lost","S":"Run Hrs","T":"%El","U":"%Mech","V":"% Total Lost","W":"MTBF EL","X":"MTTR EL","Y":"MTBF Mech","Z":"MTTR Mech","AA":"MTBF Mch","AB":"MTTR Mch","AC":"BD Events EL","AD":"BD Event Mech"}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Conv", "Row": 101, "DataJSON": '{"O":"AUTOPLATEN - 1 MACHINE","P":601.08,"Q":0,"R":601.08,"S":23.33,"T":2576.4252036005146,"U":0,"AA":23.33,"AB":601.08,"AC":1,"AD":0}', "FormulaJSON": '{"R":"P101+Q101","T":"P101/S101*100","U":"Q101/S101*100","AA":"S101/(AC101+AD101)","AB":"R101/(AC101+AD101)"}' }, { "Sheet": "Yearly_Conv", "Row": 102, "DataJSON": '{"O":"AUTOPLATEN - 2 MACHINE","P":"#REF!","Q":"#REF!","R":"#REF!","S":"#REF!","T":"#REF!","U":"#REF!","V":"#REF!","AA":"#REF!","AB":"#REF!","AC":"#REF!","AD":"#REF!"}', "FormulaJSON": `{"P":"P86+'Chart_Conv 01 Autoplaten'!#REF!","Q":"Q86+'Chart_Conv 01 Autoplaten'!#REF!","R":"R86+'Chart_Conv 01 Autoplaten'!#REF!","S":"S86+'Chart_Conv 01 Autoplaten'!#REF!","T":"T86+'Chart_Conv 01 Autoplaten'!#REF!","U":"U86+'Chart_Conv 01 Autoplaten'!#REF!","V":"V86+'Chart_Conv 01 Autoplaten'!#REF!","AA":"AA86+'Chart_Conv 01 Autoplaten'!#REF!","AB":"AB86+'Chart_Conv 01 Autoplaten'!#REF!","AC":"AC86+'Chart_Conv 01 Autoplaten'!#REF!","AD":"AD86+'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Yearly_Conv", "Row": 103, "DataJSON": '{"O":"AUTOPLATEN - 3 EVOLINE","P":"#REF!","Q":"#REF!","R":"#REF!","S":"#REF!","T":"#REF!","U":"#REF!","V":"#REF!","AA":"#REF!","AB":"#REF!","AC":"#REF!","AD":"#REF!"}', "FormulaJSON": `{"P":"P87+'Chart_Conv 01 Autoplaten'!#REF!","Q":"Q87+'Chart_Conv 01 Autoplaten'!#REF!","R":"R87+'Chart_Conv 01 Autoplaten'!#REF!","S":"S87+'Chart_Conv 01 Autoplaten'!#REF!","T":"T87+'Chart_Conv 01 Autoplaten'!#REF!","U":"U87+'Chart_Conv 01 Autoplaten'!#REF!","V":"V87+'Chart_Conv 01 Autoplaten'!#REF!","AA":"AA87+'Chart_Conv 01 Autoplaten'!#REF!","AB":"AB87+'Chart_Conv 01 Autoplaten'!#REF!","AC":"AC87+'Chart_Conv 01 Autoplaten'!#REF!","AD":"AD87+'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Yearly_Conv", "Row": 104, "DataJSON": '{"O":"AUTOPLATEN - 4 STRIPPING & BLANKING","P":"#REF!","Q":"#REF!","R":"#REF!","S":"#REF!","T":"#REF!","U":"#REF!","V":"#REF!","AA":"#REF!","AB":"#REF!","AC":"#REF!","AD":"#REF!"}', "FormulaJSON": `{"P":"P88+'Chart_Conv 01 Autoplaten'!#REF!","Q":"Q88+'Chart_Conv 01 Autoplaten'!#REF!","R":"R88+'Chart_Conv 01 Autoplaten'!#REF!","S":"S88+'Chart_Conv 01 Autoplaten'!#REF!","T":"T88+'Chart_Conv 01 Autoplaten'!#REF!","U":"U88+'Chart_Conv 01 Autoplaten'!#REF!","V":"V88+'Chart_Conv 01 Autoplaten'!#REF!","AA":"AA88+'Chart_Conv 01 Autoplaten'!#REF!","AB":"AB88+'Chart_Conv 01 Autoplaten'!#REF!","AC":"AC88+'Chart_Conv 01 Autoplaten'!#REF!","AD":"AD88+'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Yearly_Conv", "Row": 105, "DataJSON": '{"O":"AUTOPLATEN - 7 STRIPPING & BLANKING","P":"#REF!","Q":"#REF!","R":"#REF!","S":"#REF!","T":"#REF!","U":"#REF!","V":"#REF!","AA":"#REF!","AB":"#REF!","AC":"#REF!","AD":"#REF!"}', "FormulaJSON": `{"P":"P89+'Chart_Conv 01 Autoplaten'!#REF!","Q":"Q89+'Chart_Conv 01 Autoplaten'!#REF!","R":"R89+'Chart_Conv 01 Autoplaten'!#REF!","S":"S89+'Chart_Conv 01 Autoplaten'!#REF!","T":"T89+'Chart_Conv 01 Autoplaten'!#REF!","U":"U89+'Chart_Conv 01 Autoplaten'!#REF!","V":"V89+'Chart_Conv 01 Autoplaten'!#REF!","AA":"AA89+'Chart_Conv 01 Autoplaten'!#REF!","AB":"AB89+'Chart_Conv 01 Autoplaten'!#REF!","AC":"AC89+'Chart_Conv 01 Autoplaten'!#REF!","AD":"AD89+'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Yearly_Conv", "Row": 106, "DataJSON": '{"O":"AUTOPLATEN - 5 STAMPING","P":"#REF!","Q":"#REF!","R":"#REF!","S":"#REF!","T":"#REF!","U":"#REF!","V":"#REF!","AA":"#REF!","AB":"#REF!","AC":"#REF!","AD":"#REF!"}', "FormulaJSON": `{"P":"P90+'Chart_Conv 01 Autoplaten'!#REF!","Q":"Q90+'Chart_Conv 01 Autoplaten'!#REF!","R":"R90+'Chart_Conv 01 Autoplaten'!#REF!","S":"S90+'Chart_Conv 01 Autoplaten'!#REF!","T":"T90+'Chart_Conv 01 Autoplaten'!#REF!","U":"U90+'Chart_Conv 01 Autoplaten'!#REF!","V":"V90+'Chart_Conv 01 Autoplaten'!#REF!","AA":"AA90+'Chart_Conv 01 Autoplaten'!#REF!","AB":"AB90+'Chart_Conv 01 Autoplaten'!#REF!","AC":"AC90+'Chart_Conv 01 Autoplaten'!#REF!","AD":"AD90+'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Yearly_Conv", "Row": 107, "DataJSON": '{"O":"AUTOPLATEN - 6 STAMPING","P":"#REF!","Q":"#REF!","R":"#REF!","S":"#REF!","T":"#REF!","U":"#REF!","V":"#REF!","AA":"#REF!","AB":"#REF!","AC":"#REF!","AD":"#REF!"}', "FormulaJSON": `{"P":"P91+'Chart_Conv 01 Autoplaten'!#REF!","Q":"Q91+'Chart_Conv 01 Autoplaten'!#REF!","R":"R91+'Chart_Conv 01 Autoplaten'!#REF!","S":"S91+'Chart_Conv 01 Autoplaten'!#REF!","T":"T91+'Chart_Conv 01 Autoplaten'!#REF!","U":"U91+'Chart_Conv 01 Autoplaten'!#REF!","V":"V91+'Chart_Conv 01 Autoplaten'!#REF!","AA":"AA91+'Chart_Conv 01 Autoplaten'!#REF!","AB":"AB91+'Chart_Conv 01 Autoplaten'!#REF!","AC":"AC91+'Chart_Conv 01 Autoplaten'!#REF!","AD":"AD91+'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Yearly_Conv", "Row": 108, "DataJSON": '{"O":"FOLDER GLUER - 1 MACHINE","P":"#REF!","Q":"#REF!","R":"#REF!","S":"#REF!","T":"#REF!","U":"#REF!","V":"#REF!","AA":"#REF!","AB":"#REF!","AC":"#REF!","AD":"#REF!"}', "FormulaJSON": `{"P":"P92+'Chart_Conv 01 Autoplaten'!#REF!","Q":"Q92+'Chart_Conv 01 Autoplaten'!#REF!","R":"R92+'Chart_Conv 01 Autoplaten'!#REF!","S":"S92+'Chart_Conv 01 Autoplaten'!#REF!","T":"T92+'Chart_Conv 01 Autoplaten'!#REF!","U":"U92+'Chart_Conv 01 Autoplaten'!#REF!","V":"V92+'Chart_Conv 01 Autoplaten'!#REF!","AA":"AA92+'Chart_Conv 01 Autoplaten'!#REF!","AB":"AB92+'Chart_Conv 01 Autoplaten'!#REF!","AC":"AC92+'Chart_Conv 01 Autoplaten'!#REF!","AD":"AD92+'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Yearly_Conv", "Row": 109, "DataJSON": '{"O":"FOLDER GLUER - 2 MACHINE","P":"#REF!","Q":"#REF!","R":"#REF!","S":"#REF!","T":"#REF!","U":"#REF!","V":"#REF!","AA":"#REF!","AB":"#REF!","AC":"#REF!","AD":"#REF!"}', "FormulaJSON": `{"P":"P93+'Chart_Conv 01 Autoplaten'!#REF!","Q":"Q93+'Chart_Conv 01 Autoplaten'!#REF!","R":"R93+'Chart_Conv 01 Autoplaten'!#REF!","S":"S93+'Chart_Conv 01 Autoplaten'!#REF!","T":"T93+'Chart_Conv 01 Autoplaten'!#REF!","U":"U93+'Chart_Conv 01 Autoplaten'!#REF!","V":"V93+'Chart_Conv 01 Autoplaten'!#REF!","AA":"AA93+'Chart_Conv 01 Autoplaten'!#REF!","AB":"AB93+'Chart_Conv 01 Autoplaten'!#REF!","AC":"AC93+'Chart_Conv 01 Autoplaten'!#REF!","AD":"AD93+'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Yearly_Conv", "Row": 110, "DataJSON": '{"O":"FOLDER GLUER - 3 MACHINE","P":"#REF!","Q":"#REF!","R":"#REF!","S":"#REF!","T":"#REF!","U":"#REF!","V":"#REF!","AA":"#REF!","AB":"#REF!","AC":"#REF!","AD":"#REF!"}', "FormulaJSON": `{"P":"P94+'Chart_Conv 01 Autoplaten'!#REF!","Q":"Q94+'Chart_Conv 01 Autoplaten'!#REF!","R":"R94+'Chart_Conv 01 Autoplaten'!#REF!","S":"S94+'Chart_Conv 01 Autoplaten'!#REF!","T":"T94+'Chart_Conv 01 Autoplaten'!#REF!","U":"U94+'Chart_Conv 01 Autoplaten'!#REF!","V":"V94+'Chart_Conv 01 Autoplaten'!#REF!","AA":"AA94+'Chart_Conv 01 Autoplaten'!#REF!","AB":"AB94+'Chart_Conv 01 Autoplaten'!#REF!","AC":"AC94+'Chart_Conv 01 Autoplaten'!#REF!","AD":"AD94+'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Yearly_Conv", "Row": 111, "DataJSON": '{"O":"FOLDER GLUER - 4 MACHINE","P":"#REF!","Q":0.67,"R":"#REF!","S":45.43,"T":"#REF!","U":1.4747963900506276,"V":"#REF!","AA":45.43,"AB":"#REF!","AC":0,"AD":1}', "FormulaJSON": `{"P":"P95+'Chart_Conv 01 Autoplaten'!#REF!","R":"P111+Q111","T":"P111/S111*100","U":"Q111/S111*100","V":"R111/S111*100","AA":"S111/(AC111+AD111)","AB":"R111/(AC111+AD111)"}` }, { "Sheet": "Yearly_Conv", "Row": 112, "DataJSON": '{"V":"#REF!","AA":"#REF!","AB":"#REF!","AC":"#REF!","AD":"#REF!"}', "FormulaJSON": '{"V":"AVERAGE(V101:V111)","AA":"AVERAGE(AA101:AA111)","AB":"AVERAGE(AB101:AB111)","AC":"SUM(AC101:AC111)","AD":"SUM(AD101:AD111)"}' }, { "Sheet": "Yearly_Conv", "Row": 114, "DataJSON": '{"B":"Jan - Aug 2023"}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Conv", "Row": 115, "DataJSON": '{"B":"Source: ODIN"}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Conv", "Row": 116, "DataJSON": '{"P":"El BD","Q":"Mech BD","R":"Total Lost","S":"Run Hrs","T":"%El","U":"%Mech","V":"% Total Lost","W":"MTBF EL","X":"MTTR EL","Y":"MTBF Mech","Z":"MTTR Mech","AA":"MTBF Mch","AB":"MTTR Mch","AC":"BD Events EL","AD":"BD Event Mech"}', "FormulaJSON": "{}" }, { "Sheet": "Yearly_Conv", "Row": 117, "DataJSON": '{"O":"AUTOPLATEN - 1 MACHINE","P":601.08,"Q":0,"R":601.08,"S":23.33,"T":2576.4252036005146,"U":0,"AA":23.33,"AB":601.08,"AC":1,"AD":0}', "FormulaJSON": '{"R":"P117+Q117","T":"P117/S117*100","U":"Q117/S117*100","AA":"S117/(AC117+AD117)","AB":"R117/(AC117+AD117)"}' }, { "Sheet": "Yearly_Conv", "Row": 118, "DataJSON": '{"O":"AUTOPLATEN - 2 MACHINE","P":"#REF!","Q":"#REF!","R":"#REF!","S":"#REF!","T":"#REF!","U":"#REF!","V":"#REF!","W":"#REF!","X":"#REF!","Y":"#REF!","Z":"#REF!","AA":"#REF!","AB":"#REF!","AC":"#REF!","AD":"#REF!"}', "FormulaJSON": `{"P":"P102+'Chart_Conv 01 Autoplaten'!#REF!","Q":"Q102+'Chart_Conv 01 Autoplaten'!#REF!","R":"R102+'Chart_Conv 01 Autoplaten'!#REF!","S":"S102+'Chart_Conv 01 Autoplaten'!#REF!","T":"T102+'Chart_Conv 01 Autoplaten'!#REF!","U":"U102+'Chart_Conv 01 Autoplaten'!#REF!","V":"V102+'Chart_Conv 01 Autoplaten'!#REF!","W":"W102+'Chart_Conv 01 Autoplaten'!#REF!","X":"X102+'Chart_Conv 01 Autoplaten'!#REF!","Y":"Y102+'Chart_Conv 01 Autoplaten'!#REF!","Z":"Z102+'Chart_Conv 01 Autoplaten'!#REF!","AA":"AA102+'Chart_Conv 01 Autoplaten'!#REF!","AB":"AB102+'Chart_Conv 01 Autoplaten'!#REF!","AC":"AC102+'Chart_Conv 01 Autoplaten'!#REF!","AD":"AD102+'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Yearly_Conv", "Row": 119, "DataJSON": '{"O":"AUTOPLATEN - 3 EVOLINE","P":"#REF!","Q":"#REF!","R":"#REF!","S":"#REF!","T":"#REF!","U":"#REF!","V":"#REF!","W":"#REF!","X":"#REF!","Y":"#REF!","Z":"#REF!","AA":"#REF!","AB":"#REF!","AC":"#REF!","AD":"#REF!"}', "FormulaJSON": `{"P":"P103+'Chart_Conv 01 Autoplaten'!#REF!","Q":"Q103+'Chart_Conv 01 Autoplaten'!#REF!","R":"R103+'Chart_Conv 01 Autoplaten'!#REF!","S":"S103+'Chart_Conv 01 Autoplaten'!#REF!","T":"T103+'Chart_Conv 01 Autoplaten'!#REF!","U":"U103+'Chart_Conv 01 Autoplaten'!#REF!","V":"V103+'Chart_Conv 01 Autoplaten'!#REF!","W":"W103+'Chart_Conv 01 Autoplaten'!#REF!","X":"X103+'Chart_Conv 01 Autoplaten'!#REF!","Y":"Y103+'Chart_Conv 01 Autoplaten'!#REF!","Z":"Z103+'Chart_Conv 01 Autoplaten'!#REF!","AA":"AA103+'Chart_Conv 01 Autoplaten'!#REF!","AB":"AB103+'Chart_Conv 01 Autoplaten'!#REF!","AC":"AC103+'Chart_Conv 01 Autoplaten'!#REF!","AD":"AD103+'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Yearly_Conv", "Row": 120, "DataJSON": '{"O":"AUTOPLATEN - 4 STRIPPING & BLANKING","P":"#REF!","Q":"#REF!","R":"#REF!","S":"#REF!","T":"#REF!","U":"#REF!","V":"#REF!","W":"#REF!","X":"#REF!","Y":"#REF!","Z":"#REF!","AA":"#REF!","AB":"#REF!","AC":"#REF!","AD":"#REF!"}', "FormulaJSON": `{"P":"P104+'Chart_Conv 01 Autoplaten'!#REF!","Q":"Q104+'Chart_Conv 01 Autoplaten'!#REF!","R":"R104+'Chart_Conv 01 Autoplaten'!#REF!","S":"S104+'Chart_Conv 01 Autoplaten'!#REF!","T":"T104+'Chart_Conv 01 Autoplaten'!#REF!","U":"U104+'Chart_Conv 01 Autoplaten'!#REF!","V":"V104+'Chart_Conv 01 Autoplaten'!#REF!","W":"W104+'Chart_Conv 01 Autoplaten'!#REF!","X":"X104+'Chart_Conv 01 Autoplaten'!#REF!","Y":"Y104+'Chart_Conv 01 Autoplaten'!#REF!","Z":"Z104+'Chart_Conv 01 Autoplaten'!#REF!","AA":"AA104+'Chart_Conv 01 Autoplaten'!#REF!","AB":"AB104+'Chart_Conv 01 Autoplaten'!#REF!","AC":"AC104+'Chart_Conv 01 Autoplaten'!#REF!","AD":"AD104+'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Yearly_Conv", "Row": 121, "DataJSON": '{"O":"AUTOPLATEN - 7 STRIPPING & BLANKING","P":"#REF!","Q":"#REF!","R":"#REF!","S":"#REF!","T":"#REF!","U":"#REF!","V":"#REF!","W":"#REF!","X":"#REF!","Y":"#REF!","Z":"#REF!","AA":"#REF!","AB":"#REF!","AC":"#REF!","AD":"#REF!"}', "FormulaJSON": `{"P":"P105+'Chart_Conv 01 Autoplaten'!#REF!","Q":"Q105+'Chart_Conv 01 Autoplaten'!#REF!","R":"R105+'Chart_Conv 01 Autoplaten'!#REF!","S":"S105+'Chart_Conv 01 Autoplaten'!#REF!","T":"T105+'Chart_Conv 01 Autoplaten'!#REF!","U":"U105+'Chart_Conv 01 Autoplaten'!#REF!","V":"V105+'Chart_Conv 01 Autoplaten'!#REF!","W":"W105+'Chart_Conv 01 Autoplaten'!#REF!","X":"X105+'Chart_Conv 01 Autoplaten'!#REF!","Y":"Y105+'Chart_Conv 01 Autoplaten'!#REF!","Z":"Z105+'Chart_Conv 01 Autoplaten'!#REF!","AA":"AA105+'Chart_Conv 01 Autoplaten'!#REF!","AB":"AB105+'Chart_Conv 01 Autoplaten'!#REF!","AC":"AC105+'Chart_Conv 01 Autoplaten'!#REF!","AD":"AD105+'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Yearly_Conv", "Row": 122, "DataJSON": '{"O":"AUTOPLATEN - 5 STAMPING","P":"#REF!","Q":"#REF!","R":"#REF!","S":"#REF!","T":"#REF!","U":"#REF!","V":"#REF!","W":"#REF!","X":"#REF!","Y":"#REF!","Z":"#REF!","AA":"#REF!","AB":"#REF!","AC":"#REF!","AD":"#REF!"}', "FormulaJSON": `{"P":"P106+'Chart_Conv 01 Autoplaten'!#REF!","Q":"Q106+'Chart_Conv 01 Autoplaten'!#REF!","R":"R106+'Chart_Conv 01 Autoplaten'!#REF!","S":"S106+'Chart_Conv 01 Autoplaten'!#REF!","T":"T106+'Chart_Conv 01 Autoplaten'!#REF!","U":"U106+'Chart_Conv 01 Autoplaten'!#REF!","V":"V106+'Chart_Conv 01 Autoplaten'!#REF!","W":"W106+'Chart_Conv 01 Autoplaten'!#REF!","X":"X106+'Chart_Conv 01 Autoplaten'!#REF!","Y":"Y106+'Chart_Conv 01 Autoplaten'!#REF!","Z":"Z106+'Chart_Conv 01 Autoplaten'!#REF!","AA":"AA106+'Chart_Conv 01 Autoplaten'!#REF!","AB":"AB106+'Chart_Conv 01 Autoplaten'!#REF!","AC":"AC106+'Chart_Conv 01 Autoplaten'!#REF!","AD":"AD106+'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Yearly_Conv", "Row": 123, "DataJSON": '{"O":"AUTOPLATEN - 6 STAMPING","P":"#REF!","Q":"#REF!","R":"#REF!","S":"#REF!","T":"#REF!","U":"#REF!","V":"#REF!","W":"#REF!","X":"#REF!","Y":"#REF!","Z":"#REF!","AA":"#REF!","AB":"#REF!","AC":"#REF!","AD":"#REF!"}', "FormulaJSON": `{"P":"P107+'Chart_Conv 01 Autoplaten'!#REF!","Q":"Q107+'Chart_Conv 01 Autoplaten'!#REF!","R":"R107+'Chart_Conv 01 Autoplaten'!#REF!","S":"S107+'Chart_Conv 01 Autoplaten'!#REF!","T":"T107+'Chart_Conv 01 Autoplaten'!#REF!","U":"U107+'Chart_Conv 01 Autoplaten'!#REF!","V":"V107+'Chart_Conv 01 Autoplaten'!#REF!","W":"W107+'Chart_Conv 01 Autoplaten'!#REF!","X":"X107+'Chart_Conv 01 Autoplaten'!#REF!","Y":"Y107+'Chart_Conv 01 Autoplaten'!#REF!","Z":"Z107+'Chart_Conv 01 Autoplaten'!#REF!","AA":"AA107+'Chart_Conv 01 Autoplaten'!#REF!","AB":"AB107+'Chart_Conv 01 Autoplaten'!#REF!","AC":"AC107+'Chart_Conv 01 Autoplaten'!#REF!","AD":"AD107+'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Yearly_Conv", "Row": 124, "DataJSON": '{"O":"FOLDER GLUER - 1 MACHINE","P":"#REF!","Q":"#REF!","R":"#REF!","S":"#REF!","T":"#REF!","U":"#REF!","V":"#REF!","W":"#REF!","X":"#REF!","Y":"#REF!","Z":"#REF!","AA":"#REF!","AB":"#REF!","AC":"#REF!","AD":"#REF!"}', "FormulaJSON": `{"P":"P108+'Chart_Conv 01 Autoplaten'!#REF!","Q":"Q108+'Chart_Conv 01 Autoplaten'!#REF!","R":"R108+'Chart_Conv 01 Autoplaten'!#REF!","S":"S108+'Chart_Conv 01 Autoplaten'!#REF!","T":"T108+'Chart_Conv 01 Autoplaten'!#REF!","U":"U108+'Chart_Conv 01 Autoplaten'!#REF!","V":"V108+'Chart_Conv 01 Autoplaten'!#REF!","W":"W108+'Chart_Conv 01 Autoplaten'!#REF!","X":"X108+'Chart_Conv 01 Autoplaten'!#REF!","Y":"Y108+'Chart_Conv 01 Autoplaten'!#REF!","Z":"Z108+'Chart_Conv 01 Autoplaten'!#REF!","AA":"AA108+'Chart_Conv 01 Autoplaten'!#REF!","AB":"AB108+'Chart_Conv 01 Autoplaten'!#REF!","AC":"AC108+'Chart_Conv 01 Autoplaten'!#REF!","AD":"AD108+'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Yearly_Conv", "Row": 125, "DataJSON": '{"O":"FOLDER GLUER - 2 MACHINE","P":"#REF!","Q":"#REF!","R":"#REF!","S":"#REF!","T":"#REF!","U":"#REF!","V":"#REF!","W":"#REF!","X":"#REF!","Y":"#REF!","Z":"#REF!","AA":"#REF!","AB":"#REF!","AC":"#REF!","AD":"#REF!"}', "FormulaJSON": `{"P":"P109+'Chart_Conv 01 Autoplaten'!#REF!","Q":"Q109+'Chart_Conv 01 Autoplaten'!#REF!","R":"R109+'Chart_Conv 01 Autoplaten'!#REF!","S":"S109+'Chart_Conv 01 Autoplaten'!#REF!","T":"T109+'Chart_Conv 01 Autoplaten'!#REF!","U":"U109+'Chart_Conv 01 Autoplaten'!#REF!","V":"V109+'Chart_Conv 01 Autoplaten'!#REF!","W":"W109+'Chart_Conv 01 Autoplaten'!#REF!","X":"X109+'Chart_Conv 01 Autoplaten'!#REF!","Y":"Y109+'Chart_Conv 01 Autoplaten'!#REF!","Z":"Z109+'Chart_Conv 01 Autoplaten'!#REF!","AA":"AA109+'Chart_Conv 01 Autoplaten'!#REF!","AB":"AB109+'Chart_Conv 01 Autoplaten'!#REF!","AC":"AC109+'Chart_Conv 01 Autoplaten'!#REF!","AD":"AD109+'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Yearly_Conv", "Row": 126, "DataJSON": '{"O":"FOLDER GLUER - 3 MACHINE","P":"#REF!","Q":"#REF!","R":"#REF!","S":"#REF!","T":"#REF!","U":"#REF!","V":"#REF!","W":"#REF!","X":"#REF!","Y":"#REF!","Z":"#REF!","AA":"#REF!","AB":"#REF!","AC":"#REF!","AD":"#REF!"}', "FormulaJSON": `{"P":"P110+'Chart_Conv 01 Autoplaten'!#REF!","Q":"Q110+'Chart_Conv 01 Autoplaten'!#REF!","R":"R110+'Chart_Conv 01 Autoplaten'!#REF!","S":"S110+'Chart_Conv 01 Autoplaten'!#REF!","T":"T110+'Chart_Conv 01 Autoplaten'!#REF!","U":"U110+'Chart_Conv 01 Autoplaten'!#REF!","V":"V110+'Chart_Conv 01 Autoplaten'!#REF!","W":"W110+'Chart_Conv 01 Autoplaten'!#REF!","X":"X110+'Chart_Conv 01 Autoplaten'!#REF!","Y":"Y110+'Chart_Conv 01 Autoplaten'!#REF!","Z":"Z110+'Chart_Conv 01 Autoplaten'!#REF!","AA":"AA110+'Chart_Conv 01 Autoplaten'!#REF!","AB":"AB110+'Chart_Conv 01 Autoplaten'!#REF!","AC":"AC110+'Chart_Conv 01 Autoplaten'!#REF!","AD":"AD110+'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Yearly_Conv", "Row": 127, "DataJSON": '{"O":"FOLDER GLUER - 4 MACHINE","P":"#REF!","Q":"#REF!","R":"#REF!","S":"#REF!","T":"#REF!","U":"#REF!","V":"#REF!","W":"#REF!","X":"#REF!","Y":"#REF!","Z":"#REF!","AA":"#REF!","AB":"#REF!","AC":"#REF!","AD":"#REF!"}', "FormulaJSON": `{"P":"P111+'Chart_Conv 01 Autoplaten'!#REF!","Q":"Q111+'Chart_Conv 01 Autoplaten'!#REF!","R":"R111+'Chart_Conv 01 Autoplaten'!#REF!","S":"S111+'Chart_Conv 01 Autoplaten'!#REF!","T":"T111+'Chart_Conv 01 Autoplaten'!#REF!","U":"U111+'Chart_Conv 01 Autoplaten'!#REF!","V":"V111+'Chart_Conv 01 Autoplaten'!#REF!","W":"W111+'Chart_Conv 01 Autoplaten'!#REF!","X":"X111+'Chart_Conv 01 Autoplaten'!#REF!","Y":"Y111+'Chart_Conv 01 Autoplaten'!#REF!","Z":"Z111+'Chart_Conv 01 Autoplaten'!#REF!","AA":"AA111+'Chart_Conv 01 Autoplaten'!#REF!","AB":"AB111+'Chart_Conv 01 Autoplaten'!#REF!","AC":"AC111+'Chart_Conv 01 Autoplaten'!#REF!","AD":"AD111+'Chart_Conv 01 Autoplaten'!#REF!"}` }, { "Sheet": "Yearly_Conv", "Row": 128, "DataJSON": '{"V":"#REF!","AA":"#REF!","AB":"#REF!","AC":"#REF!","AD":"#REF!"}', "FormulaJSON": '{"V":"AVERAGE(V117:V127)","AA":"AVERAGE(AA117:AA127)","AB":"AVERAGE(AB117:AB127)","AC":"SUM(AC117:AC127)","AD":"SUM(AD117:AD127)"}' }, { "Sheet": "Record YTD", "Row": 1, "DataJSON": `{"A":"Year","B":"Machine","C":"Run Hours (Hrs)","D":"MTBF (Hrs)","E":"Target MTBF (Hrs)","F":"MTTR (Hrs)","G":"Target MTTR (Hrs)","H":"Lost Time  (%)","I":"Max. Lost Time (%)","J":"Breakdown Event (Evt')","K":"Breakdown Event (Evt')","N":"Year","O":"Machine","P":"Run Hours (Hrs)","Q":"MTBF (Hrs)","R":"Target MTBF (Hrs)","S":"MTTR (Hrs)","T":"Target MTTR (Hrs)","U":"Lost Time  (%)","V":"Max. Lost Time (%)","W":"Breakdown Event (Evt')","X":"Breakdown Event (Evt')"}`, "FormulaJSON": "{}" }, { "Sheet": "Record YTD", "Row": 2, "DataJSON": '{"A":2019,"B":"OFS 5","C":4798.79,"D":15.69,"E":56.19,"F":2.84,"G":0.98,"H":15.31,"I":5,"J":259,"K":259,"L":"Event","N":2019,"O":"APM 4","P":3873.05,"Q":52.38,"R":56.19,"S":1.41,"T":0.98,"U":2.63,"W":72,"X":72}', "FormulaJSON": "{}" }, { "Sheet": "Record YTD", "Row": 3, "DataJSON": '{"B":"OFS 6","C":4230.08,"D":45.94,"E":56.19,"F":3.82,"G":0.98,"H":7.68,"I":5,"J":85,"K":85,"O":"APM 7","P":1942.03,"Q":37.46,"R":56.19,"S":6.68,"T":0.98,"U":15.12,"W":44,"X":44}', "FormulaJSON": '{"E":"E2","R":"R2","T":"T2"}' }, { "Sheet": "Record YTD", "Row": 4, "DataJSON": '{"A":2020,"B":"OFS 5","C":2315.69,"D":6.38,"E":56.19,"F":1.77,"G":0.98,"H":21.75,"I":5,"J":284,"K":284,"L":"Event","O":"FGM 1","P":2809.6,"Q":99.74,"R":56.19,"S":0.6,"T":0.98,"U":0.6,"W":28,"X":28}', "FormulaJSON": '{"R":"R3","T":"T3"}' }, { "Sheet": "Record YTD", "Row": 5, "DataJSON": '{"B":"OFS 6","C":3459.61,"D":24.54,"E":56.19,"F":1.67,"G":0.98,"H":6.36,"I":5,"J":132,"K":132,"O":"FGM 2","P":2993.78,"Q":81.59,"R":56.19,"S":1.57,"T":0.98,"U":1.89,"W":36,"X":36}', "FormulaJSON": '{"E":"E4","R":"R4","T":"T4"}' }, { "Sheet": "Record YTD", "Row": 6, "DataJSON": '{"A":2021,"B":"OFS 5","C":2625.56,"D":10.26,"E":56.16,"F":1.2,"G":0.98,"H":10.48,"I":5,"J":229,"K":229,"L":"Event","O":"FGM 3","P":3535.17,"Q":60.35,"R":56.19,"S":2.78,"T":0.98,"U":4.41,"W":56,"X":56}', "FormulaJSON": '{"R":"R5","T":"T5"}' }, { "Sheet": "Record YTD", "Row": 7, "DataJSON": '{"B":"OFS 6","C":3136.93,"D":38.25,"E":56.16,"F":2.33,"G":0.98,"H":6.11,"I":5,"J":82,"K":82,"N":2020,"O":"APM 4","P":4252.37,"Q":87.81,"R":56.19,"S":1.39,"T":0.98,"U":1.56,"W":46,"X":46}', "FormulaJSON": '{"E":"E6"}' }, { "Sheet": "Record YTD", "Row": 8, "DataJSON": '{"A":2022,"B":"OFS 5","C":2519.79,"D":10.04,"E":56.19,"F":1.47,"G":0.98,"H":12.78,"I":5,"J":219,"K":219,"L":"Event","O":"APM 7","P":4103.11,"Q":87.81,"R":56.19,"S":1.39,"T":0.98,"U":1.56,"W":46,"X":46}', "FormulaJSON": '{"R":"R7"}' }, { "Sheet": "Record YTD", "Row": 9, "DataJSON": '{"B":"OFS 6","C":3348.38,"D":28.85,"E":56.19,"F":2.15,"G":0.98,"H":6.95,"I":5,"J":108,"K":108,"O":"FGM 1","P":2459.21,"Q":70.68,"R":56.19,"S":1.65,"T":0.98,"U":2.28,"W":34,"X":34}', "FormulaJSON": '{"E":"E8","R":"R8"}' }, { "Sheet": "Record YTD", "Row": 10, "DataJSON": '{"A":2023,"B":"OFS 5","C":2744.45,"D":5.77,"E":56.19,"F":2.31,"G":0.98,"H":28.58,"I":5,"J":340,"K":340,"L":"Event","O":"FGM 2","P":3030.62,"Q":59.65,"R":56.19,"S":0.96,"T":0.98,"U":1.58,"W":50,"X":50}', "FormulaJSON": '{"R":"R9"}' }, { "Sheet": "Record YTD", "Row": 11, "DataJSON": '{"B":"OFS 6","C":2742.88,"D":22.28,"E":56.19,"F":3.6,"G":0.98,"H":13.91,"I":5,"J":106,"K":106,"O":"FGM 3","P":3025.91,"Q":59.79,"R":56.19,"S":0.73,"T":0.98,"U":1.21,"W":50,"X":50}', "FormulaJSON": '{"E":"E10","R":"R10"}' }, { "Sheet": "Record YTD", "Row": 12, "DataJSON": '{"B":"OFS 8","C":2130.95,"D":55.27,"E":56.19,"F":2.32,"G":0.98,"H":4.03,"I":5,"J":37,"K":37,"N":2021,"O":"APM 4","P":3372.9,"Q":53.27,"R":56.19,"S":8.06,"T":0.98,"U":13.14,"W":55,"X":55}', "FormulaJSON": '{"E":"E11"}' }, { "Sheet": "Record YTD", "Row": 13, "DataJSON": '{"A":2024,"B":"OFS 5","C":2474.29,"D":13.9,"E":56.19,"F":1.28,"G":0.98,"H":8.46,"I":5,"J":163,"K":163,"L":"Event","O":"APM 7","P":3013.65,"Q":62.09,"R":56.19,"S":6.41,"T":0.98,"U":9.35,"W":44,"X":44}', "FormulaJSON": '{"R":"R12"}' }, { "Sheet": "Record YTD", "Row": 14, "DataJSON": '{"B":"OFS 6","C":482.56,"D":24.31,"E":56.19,"F":1.09,"G":0.98,"H":4.3,"I":5,"J":19,"K":19,"O":"FGM 1","P":2925.26,"Q":44.06,"R":56.19,"S":2.37,"T":0.98,"U":5.11,"W":63,"X":63}', "FormulaJSON": '{"E":"E13","R":"R13"}' }, { "Sheet": "Record YTD", "Row": 15, "DataJSON": '{"B":"OFS 8","C":2906.03,"D":51.72,"E":56.19,"F":1.11,"G":0.98,"H":2.11,"I":5,"J":55,"K":55,"O":"FGM 2","P":3084.19,"Q":58.74,"R":56.19,"S":1.73,"T":0.98,"U":2.87,"W":51,"X":51}', "FormulaJSON": '{"E":"E14","R":"R14"}' }, { "Sheet": "Record YTD", "Row": 16, "DataJSON": '{"O":"FGM 3","P":3359.18,"Q":55.03,"R":56.19,"S":0.96,"T":0.98,"U":1.72,"W":60,"X":60}', "FormulaJSON": '{"R":"R15"}' }, { "Sheet": "Record YTD", "Row": 17, "DataJSON": '{"N":2022,"O":"APM 4","P":4258.2,"Q":37.63,"R":56.19,"S":25,"T":0.98,"U":39.92,"W":68,"X":68}', "FormulaJSON": "{}" }, { "Sheet": "Record YTD", "Row": 18, "DataJSON": '{"O":"APM 7","P":5111.35,"Q":96.15,"R":56.19,"S":6.08,"T":0.98,"U":5.94,"W":50,"X":50}', "FormulaJSON": '{"R":"R17"}' }, { "Sheet": "Record YTD", "Row": 19, "DataJSON": '{"O":"FGM 1","P":5431.12,"Q":105.23,"R":56.19,"S":1.26,"T":0.98,"U":1.19,"W":51,"X":51}', "FormulaJSON": '{"R":"R18"}' }, { "Sheet": "Record YTD", "Row": 20, "DataJSON": '{"O":"FGM 2","P":3944.07,"Q":106.31,"R":56.19,"S":3.25,"T":0.98,"U":2.97,"W":36,"X":36}', "FormulaJSON": '{"R":"R19"}' }, { "Sheet": "Record YTD", "Row": 21, "DataJSON": '{"O":"FGM 3","P":4945.05,"Q":87.25,"R":56.19,"S":1.06,"T":0.98,"U":1.2,"W":56,"X":56}', "FormulaJSON": '{"R":"R20"}' }, { "Sheet": "Record YTD", "Row": 22, "DataJSON": '{"N":2023,"O":"APM 4","P":5221.55,"Q":86.64,"R":106,"S":1.86,"T":0.98,"U":2.11,"W":59,"X":59}', "FormulaJSON": "{}" }, { "Sheet": "Record YTD", "Row": 23, "DataJSON": '{"O":"APM 7","P":4398.52,"Q":117.12,"R":106,"S":1.75,"T":0.98,"U":1.48,"W":37,"X":37}', "FormulaJSON": '{"R":"R22"}' }, { "Sheet": "Record YTD", "Row": 24, "DataJSON": '{"O":"APM 8","P":4444.38,"Q":294.02,"R":106,"S":2.27,"T":0.98,"U":0.77,"W":15,"X":15}', "FormulaJSON": '{"R":"R23"}' }, { "Sheet": "Record YTD", "Row": 25, "DataJSON": '{"O":"FGM 1","P":5627.21,"Q":156.31,"R":106,"S":1.91,"T":0.98,"U":1.22,"W":36,"X":36}', "FormulaJSON": '{"R":"R24"}' }, { "Sheet": "Record YTD", "Row": 26, "DataJSON": '{"O":"FGM 2","P":4359.69,"Q":113.46,"R":106,"S":1.27,"T":0.98,"U":1.11,"W":38,"X":38}', "FormulaJSON": '{"R":"R25"}' }, { "Sheet": "Record YTD", "Row": 27, "DataJSON": '{"O":"FGM 3","P":5100.97,"Q":88.05,"R":106,"S":3.04,"T":0.98,"U":3.33,"W":56,"X":56}', "FormulaJSON": '{"R":"R26"}' }, { "Sheet": "Record YTD", "Row": 28, "DataJSON": '{"N":2024,"O":"APM 4","P":1226.11,"Q":53.35,"R":106,"S":5.03,"T":0.98,"U":8.62,"W":21,"X":21}', "FormulaJSON": "{}" }, { "Sheet": "Record YTD", "Row": 29, "DataJSON": '{"O":"APM 7","P":2985.04,"Q":116.41,"R":106,"S":2.99,"T":0.98,"U":2.51,"W":25,"X":25}', "FormulaJSON": '{"R":"R28"}' }, { "Sheet": "Record YTD", "Row": 30, "DataJSON": '{"O":"APM 8","P":3994.86,"Q":396.33,"R":106,"S":3.16,"T":0.98,"U":0.79,"W":10,"X":10}', "FormulaJSON": '{"R":"R29"}' }, { "Sheet": "Record YTD", "Row": 31, "DataJSON": '{"O":"APM 9","P":2164.54,"Q":309.22,"R":106,"S":2.16,"T":0.98,"U":0.7,"W":7,"X":7}', "FormulaJSON": '{"R":"R30"}' }, { "Sheet": "Record YTD", "Row": 32, "DataJSON": '{"O":"FGM 1","P":3908.27,"Q":184.45,"R":300,"S":1.66,"T":0.98,"U":0.89,"W":21,"X":21}', "FormulaJSON": "{}" }, { "Sheet": "Record YTD", "Row": 33, "DataJSON": '{"O":"FGM 2","P":2890.17,"Q":88.47,"R":300,"S":4.76,"T":0.98,"U":5.11,"W":31,"X":31}', "FormulaJSON": '{"R":"R32"}' }, { "Sheet": "Record YTD", "Row": 34, "DataJSON": '{"O":"FGM 3","P":3732.72,"Q":146.38,"R":300,"S":2.93,"T":0.98,"U":1.96,"W":25,"X":25}', "FormulaJSON": '{"R":"R33"}' }];

// src/omodos4.mjs
function createOmodos4({ SpreadsheetApp, Utilities, ContentService, Session }) {
  const json2 = /* @__PURE__ */ __name((value) => ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON), "json");
  const ss = /* @__PURE__ */ __name(() => SpreadsheetApp.getActiveSpreadsheet(), "ss");
  const nowIso = /* @__PURE__ */ __name(() => (/* @__PURE__ */ new Date()).toISOString(), "nowIso");
  const uuid = /* @__PURE__ */ __name(() => Utilities && Utilities.getUuid ? Utilities.getUuid() : "v4_" + Date.now() + "_" + Math.random().toString(36).slice(2), "uuid");
  const SHEETS = {
    machines: "Master_Mesin",
    logbook: "Logbook",
    predictive: "Predictive_Maintenance",
    patrolTemplate: "Patrol_Checklist_Template",
    sparepartLokasi: "Sparepart_Lokasi",
    sparepartEta: "Sparepart_ETA",
    sparepartOpname: "Sparepart_Opname",
    sparepartSap: "Sparepart_SAP_Status",
    sparepartWarehouse: "Sparepart_Warehouse",
    stock: "Stock_Sparepart",
    breakdown: "Machine_Breakdown_Detail",
    corrective: "Corrective_Report",
    rca: "RCA_Reports",
    kb: "Knowledge_Base",
    kpi: "KPI_Kertas_Kerja",
    kpiYtd: "KPI_Department_YTD",
    energy: "Energy_Utility_ENPI",
    energyCost: "Energy_Cost_TOE",
    recordYtd: "Record_YTD",
    runHour: "Run_Hour_Comparison",
    ipal: "IPAL_Reports",
    personnel: "PI_Personnel_Master",
    peopleSoft: "PI_Softskill_Assessment",
    peopleHard: "PI_Hardskill_Assessment",
    peopleHardDetail: "PI_Hardskill_Assessment_Detail",
    peopleHardStandard: "PI_Hardskill_Standard",
    project: "Factory_Project",
    kaizen: "Kaizen",
    sga: "SGA",
    sessions: "Sessions"
  };
  const SOURCE_TRUTH_START_ISO = "2026-09-01T00:00:00+07:00";
  const SOURCE_TRUTH_START_MS = Date.parse(SOURCE_TRUTH_START_ISO);
  const SOURCE_TRUTH_TIMEZONE = "Asia/Jakarta";
  const SOURCE_TRUTH_TEMPORAL_SHEETS = /* @__PURE__ */ new Set([
    SHEETS.logbook,
    SHEETS.predictive,
    SHEETS.sparepartEta,
    SHEETS.sparepartOpname,
    SHEETS.sparepartSap,
    SHEETS.sparepartWarehouse,
    SHEETS.breakdown,
    SHEETS.corrective,
    SHEETS.rca,
    SHEETS.energy,
    SHEETS.energyCost,
    SHEETS.recordYtd,
    SHEETS.runHour,
    SHEETS.ipal,
    SHEETS.kpi,
    SHEETS.kb,
    SHEETS.peopleSoft,
    SHEETS.peopleHard,
    SHEETS.peopleHardDetail,
    SHEETS.project,
    SHEETS.kaizen,
    SHEETS.sga
  ]);
  function rows(name) {
    const sh = ss().getSheetByName(name);
    if (!sh || sh.getLastRow() < 2 || sh.getLastColumn() < 1) return [];
    const values = sh.getDataRange().getValues();
    if (values.length < 2) return [];
    const headers = (values[0] || []).map((v) => String(v ?? "").trim());
    return values.slice(1).filter((r) => r.some((v) => v !== "" && v != null)).map((r) => {
      const o = {};
      headers.forEach((h, i) => {
        if (h) o[h] = r[i];
      });
      return o;
    }).filter((o) => !(o.DeletedAt && String(o.DeletedAt).trim()));
  }
  __name(rows, "rows");
  function first(o, aliases, fallback = "") {
    for (const k of aliases) {
      if (o && o[k] !== void 0 && o[k] !== null && String(o[k]).trim() !== "") return o[k];
    }
    return fallback;
  }
  __name(first, "first");
  function text(v) {
    return String(v ?? "").trim();
  }
  __name(text, "text");
  function safeJsonParse_(v, fallback) {
    try {
      return JSON.parse(String(v || ""));
    } catch (e) {
      return fallback;
    }
  }
  __name(safeJsonParse_, "safeJsonParse_");
  function lower(v) {
    return text(v).toLowerCase();
  }
  __name(lower, "lower");
  function num(v) {
    if (typeof v === "number" && Number.isFinite(v)) return v;
    const s = text(v).replace(/[^0-9,.-]/g, "").replace(/\.(?=.*\.)/g, "").replace(",", ".");
    const n = Number(s);
    return Number.isFinite(n) ? n : 0;
  }
  __name(num, "num");
  function dateValue(o) {
    const v = first(o, ["Timestamp", "Timestamp Input", "Tanggal", "Tanggal Input", "Tanggal Laporan", "Tanggal Kejadian", "Date", "Created At", "CreatedAt", "Updated At", "UpdatedAt", "Tanggal Mulai", "StartedAt"]);
    if (v instanceof Date) return v.getTime();
    if (typeof v === "number" && Number.isFinite(v) && v > 1e11) return v;
    const raw = text(v);
    if (!raw) return 0;
    const t = Date.parse(raw);
    return Number.isFinite(t) ? t : 0;
  }
  __name(dateValue, "dateValue");
  function monthNumber(v) {
    const n = Number(v);
    if (Number.isFinite(n) && n >= 1 && n <= 12) return Math.trunc(n);
    const x = lower(v).replace(/\./g, "");
    const names = [["jan", "januari", "january"], ["feb", "februari", "february"], ["mar", "maret", "march"], ["apr", "april"], ["mei", "may"], ["jun", "juni", "june"], ["jul", "juli", "july"], ["agu", "agust", "agustus", "aug", "august"], ["sep", "sept", "september"], ["okt", "oct", "oktober", "october"], ["nop", "nov", "november"], ["des", "dec", "desember", "december"]];
    const idx = names.findIndex((a) => a.some((k) => x.startsWith(k)));
    return idx >= 0 ? idx + 1 : 0;
  }
  __name(monthNumber, "monthNumber");
  function periodValue(o) {
    const year = num(first(o, ["Tahun", "Year"]));
    const month = monthNumber(first(o, ["Bulan", "Month"]));
    if (!year || !month) return 0;
    return Date.UTC(year, month - 1, 1) - 7 * 36e5;
  }
  __name(periodValue, "periodValue");
  function sourceTimestamp(o) {
    return dateValue(o) || periodValue(o) || 0;
  }
  __name(sourceTimestamp, "sourceTimestamp");
  function sourceRows(name) {
    const data = rows(name);
    if (!SOURCE_TRUTH_TEMPORAL_SHEETS.has(name)) return data;
    return data.filter((r) => sourceTimestamp(r) >= SOURCE_TRUTH_START_MS);
  }
  __name(sourceRows, "sourceRows");
  function sourceTruthInfo() {
    return {
      startDate: "2026-09-01",
      startAt: SOURCE_TRUTH_START_ISO,
      timezone: SOURCE_TRUTH_TIMEZONE,
      historicalRule: "Analisis historis OMODOS 4.0 hanya memakai record bertanggal/periode mulai 1 September 2026. Knowledge Base tanpa tanggal atau sebelum cutoff tidak dipakai sebagai bukti V4.",
      referenceRule: "Master/current-state yang tidak bersifat historis seperti mesin, stok, lokasi sparepart, template Patrol, personel master, dan standar kompetensi tetap dipakai sebagai referensi kondisi saat ini. Knowledge Base dan data historis lain tetap mengikuti batas tanggal bila dipakai sebagai bukti OMODOS 4.0."
    };
  }
  __name(sourceTruthInfo, "sourceTruthInfo");
  function enforceSourceTruthRange(range) {
    const rawSince = timeMs(range && range.since, SOURCE_TRUTH_START_MS);
    const rawUntil = timeMs(range && range.until, Date.now());
    const orderedSince = Math.min(rawSince, rawUntil), orderedUntil = Math.max(rawSince, rawUntil);
    const until = Math.max(orderedUntil, SOURCE_TRUTH_START_MS);
    const since = Math.max(Math.min(orderedSince, until), SOURCE_TRUTH_START_MS);
    return { ...range || {}, since, until, cutoffApplied: orderedSince < SOURCE_TRUTH_START_MS, requestedSince: orderedSince, requestedUntil: orderedUntil };
  }
  __name(enforceSourceTruthRange, "enforceSourceTruthRange");
  const KPI_MONTHS = [["Jan", 1], ["Feb", 2], ["Mar", 3], ["Apr", 4], ["Mei", 5], ["Jun", 6], ["Jul", 7], ["Agust", 8], ["Sep", 9], ["Okt", 10], ["Nop", 11], ["Des", 12]];
  function kpiPointsSinceSourceTruth(r) {
    const year = num(first(r, ["Tahun", "Year"])) || 2026;
    return KPI_MONTHS.map(([m, mi]) => {
      const raw = first(r, ["Realisasi " + m, "Actual " + m, m], null);
      if (raw === null || raw === void 0 || String(raw).trim() === "") return null;
      const periodStart = Date.UTC(year, mi - 1, 1) - 7 * 36e5;
      if (periodStart < SOURCE_TRUTH_START_MS) return null;
      const targetRaw = first(r, ["Target " + m, "Target Bulanan", "Monthly Target", "Target Tahunan", "Target"], null);
      return { year, month: m, monthNumber: mi, periodIndex: year * 12 + mi, value: num(raw), target: targetRaw === null || targetRaw === void 0 || String(targetRaw).trim() === "" ? null : num(targetRaw) };
    }).filter(Boolean).sort((a, b) => a.periodIndex - b.periodIndex);
  }
  __name(kpiPointsSinceSourceTruth, "kpiPointsSinceSourceTruth");
  function kpiLatestSinceSourceTruth(r) {
    const points = kpiPointsSinceSourceTruth(r);
    return points.length ? points[points.length - 1] : null;
  }
  __name(kpiLatestSinceSourceTruth, "kpiLatestSinceSourceTruth");
  function kpiIsAtRiskSinceSourceTruth(r) {
    const latest = kpiLatestSinceSourceTruth(r);
    if (!latest || latest.target === null) return false;
    const polarity = lower(first(r, ["Polaritas", "Polarity"]));
    return polarity.includes("min") ? latest.value > latest.target : latest.value < latest.target;
  }
  __name(kpiIsAtRiskSinceSourceTruth, "kpiIsAtRiskSinceSourceTruth");
  function strictDatedRows(name) {
    return rows(name).filter((r) => {
      const t = sourceTimestamp(r);
      return t >= SOURCE_TRUTH_START_MS;
    });
  }
  __name(strictDatedRows, "strictDatedRows");
  function machineCode(o) {
    return text(first(o, ["Kode Mesin", "KodeMesin", "Machine Code", "MachineCode", "Kode", "Functional Loc", "Functional Location"]));
  }
  __name(machineCode, "machineCode");
  function machineName(o) {
    return text(first(o, ["Nama Mesin", "NamaMesin", "Machine", "Mesin", "Machine Name", "Nama"]));
  }
  __name(machineName, "machineName");
  function machineKey(o) {
    return (machineCode(o) || machineName(o)).toLowerCase();
  }
  __name(machineKey, "machineKey");
  function normalizedMachineText(v) {
    return lower(v).replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
  }
  __name(normalizedMachineText, "normalizedMachineText");
  function machinePhraseMatch(value, q) {
    const v = normalizedMachineText(value), needle = normalizedMachineText(q);
    if (!needle) return true;
    if (!v) return false;
    return v === needle || (" " + v + " ").includes(" " + needle + " ");
  }
  __name(machinePhraseMatch, "machinePhraseMatch");
  function matchesMachine(o, q) {
    if (!text(q)) return true;
    return machinePhraseMatch(machineCode(o), q) || machinePhraseMatch(machineName(o), q);
  }
  __name(matchesMachine, "matchesMachine");
  function status(o) {
    return lower(first(o, ["Status", "Status Pekerjaan", "State", "Kondisi", "Condition"]));
  }
  __name(status, "status");
  function isClosed(o) {
    const s = status(o);
    return /selesai|closed|close|done|complete|completed|finish|finished|resolved|normal/.test(s);
  }
  __name(isClosed, "isClosed");
  function priority(o) {
    return lower(first(o, ["Prioritas", "Priority", "Severity", "Risk", "Level"]));
  }
  __name(priority, "priority");
  function isHigh(o) {
    return /critical|kritis|p0|p1|major|urgent|tinggi|high|severe/.test(priority(o));
  }
  __name(isHigh, "isHigh");
  function downtimeMinutes(o) {
    const direct = num(first(o, ["Downtime (menit)", "Downtime", "Downtime Menit", "Downtime Minutes", "Lost Time", "Lost Time (menit)"]));
    if (direct) return direct;
    const hours = num(first(o, ["Downtime (jam)", "Downtime Hours", "Lost Time (jam)"]));
    return hours ? hours * 60 : 0;
  }
  __name(downtimeMinutes, "downtimeMinutes");
  function description(o) {
    return text(first(o, ["Deskripsi Masalah", "Problem", "Masalah", "Description", "Deskripsi", "Temuan", "Deskripsi Temuan", "Title", "Judul"]));
  }
  __name(description, "description");
  const STOP_WORDS = /* @__PURE__ */ new Set(["yang", "dan", "atau", "dengan", "untuk", "pada", "dari", "dalam", "mesin", "machine", "the", "and", "for", "with", "tidak", "ada", "ini", "itu", "ke", "di"]);
  function words(v) {
    return lower(v).replace(/[^a-z0-9]+/g, " ").split(/\s+/).filter((x) => x.length > 2 && !STOP_WORDS.has(x));
  }
  __name(words, "words");
  function textSimilarity(a, b) {
    const A = new Set(words(a)), B = new Set(words(b));
    if (!A.size || !B.size) return 0;
    let shared = 0;
    A.forEach((x) => {
      if (B.has(x)) shared++;
    });
    return shared / Math.max(A.size, B.size);
  }
  __name(textSimilarity, "textSimilarity");
  function splitParts(v) {
    if (Array.isArray(v)) return v.flatMap(splitParts);
    const raw = text(v);
    if (!raw || /^(tidak|no|none|n\/a|-|0)$/i.test(raw)) return [];
    return raw.split(/[;,|\n]+/).map((x) => x.trim()).filter((x) => x.length > 1 && !/^(tidak|no|none|n\/a)$/i.test(x));
  }
  __name(splitParts, "splitParts");
  function materialNumber(o) {
    return text(first(o, ["Material Number SAP", "Material Number", "Material No", "SAP Material", "Kode Material", "Part No", "Part Number"]));
  }
  __name(materialNumber, "materialNumber");
  function materialName(o) {
    return text(first(o, ["Nama Material", "Material", "Nama Sparepart", "Sparepart", "Spare Part", "Description", "Material Name"]));
  }
  __name(materialName, "materialName");
  function materialKey(number, name) {
    const n = lower(number), v = lower(name);
    return n ? "num:" + n : v ? "name:" + v : "";
  }
  __name(materialKey, "materialKey");
  function partRefsFromLogbook(list) {
    const map = /* @__PURE__ */ new Map();
    function add(number, name, row) {
      const key = materialKey(number, name);
      if (!key) return;
      const cur = map.get(key) || { key, materialNumber: text(number), material: text(name) || text(number), consumptionCount: 0, latest: 0, sourceIds: /* @__PURE__ */ new Set() };
      cur.consumptionCount++;
      cur.latest = Math.max(cur.latest, dateValue(row) || 0);
      const id = text(first(row, ["ID", "Entry ID", "TransactionID"]));
      if (id) cur.sourceIds.add(id);
      if (!cur.materialNumber && number) cur.materialNumber = text(number);
      if ((!cur.material || cur.material === cur.materialNumber) && name) cur.material = text(name);
      map.set(key, cur);
    }
    __name(add, "add");
    (list || []).forEach((r) => {
      const directNum = materialNumber(r), directName = materialName(r);
      if (directNum || directName) add(directNum, directName, r);
      splitParts(first(r, ["Spare Part Digunakan", "Sparepart Digunakan", "Parts Used"])).forEach((name) => add("", name, r));
    });
    return map;
  }
  __name(partRefsFromLogbook, "partRefsFromLogbook");
  function joinPartRecords(partMap, records) {
    const byNum = /* @__PURE__ */ new Map(), byName = /* @__PURE__ */ new Map();
    for (const p of partMap.values()) {
      if (p.materialNumber) byNum.set(lower(p.materialNumber), p);
      if (p.material) byName.set(lower(p.material), p);
    }
    const out = [];
    (records || []).forEach((r) => {
      const numKey = lower(materialNumber(r)), nameKey = lower(materialName(r));
      const p = numKey && byNum.get(numKey) || nameKey && byName.get(nameKey);
      if (p) out.push({ part: p, record: r });
    });
    return out;
  }
  __name(joinPartRecords, "joinPartRecords");
  function within(list, sinceMs, untilMs = Infinity) {
    return list.filter((r) => {
      const t = dateValue(r);
      return t && t >= sinceMs && t <= untilMs;
    });
  }
  __name(within, "within");
  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }
  __name(clamp, "clamp");
  function sourceMeta(name, data) {
    return { sheet: name, records: data.length };
  }
  __name(sourceMeta, "sourceMeta");
  function cleanRecord(o, maxFields = 16) {
    const out = {};
    let n = 0;
    for (const [k, v] of Object.entries(o || {})) {
      if (n >= maxFields) break;
      if (/password|token|secret|salt|hash|base64/i.test(k)) continue;
      if (typeof v === "string" && v.length > 500) out[k] = v.slice(0, 500) + "\u2026";
      else out[k] = v;
      n++;
    }
    return out;
  }
  __name(cleanRecord, "cleanRecord");
  function timeMs(v, fallback) {
    if (v instanceof Date) {
      const n = v.getTime();
      return Number.isFinite(n) ? n : fallback;
    }
    if (typeof v === "number") return Number.isFinite(v) ? v : fallback;
    if (v !== void 0 && v !== null && String(v).trim() !== "") {
      const n = Date.parse(String(v));
      return Number.isFinite(n) ? n : fallback;
    }
    return fallback;
  }
  __name(timeMs, "timeMs");
  function standardRange(body) {
    const now = Date.now();
    const until = timeMs(body && body.until, now);
    const since = timeMs(body && body.since, until - 30 * 864e5);
    return enforceSourceTruthRange({ since: Math.min(since, until), until: Math.max(since, until) });
  }
  __name(standardRange, "standardRange");
  function jakartaDayRange(daysBack) {
    const shifted = new Date(Date.now() + 7 * 36e5);
    const startUtc = Date.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth(), shifted.getUTCDate() - daysBack) - 7 * 36e5;
    return { since: startUtc, until: startUtc + 864e5 - 1 };
  }
  __name(jakartaDayRange, "jakartaDayRange");
  function previousLoginRange(actor) {
    if (!actor) return null;
    const sessions = sourceRows(SHEETS.sessions).filter((r) => lower(first(r, ["Username"])) === lower(actor)).map((r) => timeMs(first(r, ["CreatedAt", "Created At"]), NaN)).filter(Number.isFinite).sort((a, b) => b - a);
    if (sessions.length < 2) return null;
    return { since: sessions[1], until: sessions[0] - 1, label: "PREVIOUS_LOGIN" };
  }
  __name(previousLoginRange, "previousLoginRange");
  function previousShiftRange() {
    const events = sourceRows(SHEETS.logbook).map((r) => ({ t: dateValue(r), shift: text(first(r, ["Shift"])), r })).filter((x) => x.t && x.shift).sort((a, b) => b.t - a.t);
    if (!events.length) return null;
    const groups = [];
    let cur = null;
    for (const e of events) {
      const local = new Date(e.t + 7 * 36e5), day = local.toISOString().slice(0, 10), key = day + "|" + e.shift;
      if (!cur || cur.key !== key) {
        cur = { key, shift: e.shift, day, times: [] };
        groups.push(cur);
      }
      cur.times.push(e.t);
      if (groups.length >= 3 && cur.times.length > 20) break;
    }
    if (groups.length < 2) return null;
    const g = groups[1];
    return { since: Math.min(...g.times), until: Math.max(...g.times), shift: g.shift, label: "PREVIOUS_RECORDED_SHIFT" };
  }
  __name(previousShiftRange, "previousShiftRange");
  function resolveChangeRange(body) {
    const preset = text(body && body.preset);
    if (preset === "today") {
      const r = enforceSourceTruthRange(jakartaDayRange(0));
      return { ...r, label: "TODAY" };
    }
    if (preset === "yesterday") {
      const r = enforceSourceTruthRange(jakartaDayRange(1));
      return { ...r, label: "YESTERDAY" };
    }
    if (preset === "previousLogin") {
      const r = previousLoginRange(body && body.actor);
      if (r) return { ...enforceSourceTruthRange(r), label: r.label };
    }
    if (preset === "previousShift") {
      const r = previousShiftRange();
      if (r) return { ...enforceSourceTruthRange(r), shift: r.shift, label: r.label };
    }
    return { ...standardRange(body || {}), label: preset === "selected" ? "SELECTED" : "CUSTOM" };
  }
  __name(resolveChangeRange, "resolveChangeRange");
  function scopeContext(body) {
    const machine = text(body && body.machine), area = text(body && body.area);
    const masters = sourceRows(SHEETS.machines);
    const selected = masters.filter((r) => (!machine || matchesMachine(r, machine)) && (!area || lower(first(r, ["Lokasi/Area", "Area", "Location", "Department"])).includes(lower(area))));
    const allowed = new Set(selected.map(machineKey).filter(Boolean));
    const active = !!(machine || area);
    const record = /* @__PURE__ */ __name((r) => {
      if (!active) return true;
      if (machine && matchesMachine(r, machine)) return true;
      const key = machineKey(r);
      if (key && allowed.has(key)) return true;
      if (area && lower(first(r, ["Lokasi/Area", "Area", "Location", "Department"])).includes(lower(area))) return true;
      return false;
    }, "record");
    return {
      active,
      machine,
      area,
      record,
      machines: selected.map((r) => ({ code: machineCode(r), name: machineName(r), area: text(first(r, ["Lokasi/Area", "Area", "Location", "Department"])) })),
      areas: [...new Set(masters.map((r) => text(first(r, ["Lokasi/Area", "Area", "Location", "Department"]))).filter(Boolean))].sort()
    };
  }
  __name(scopeContext, "scopeContext");
  function aggregateMachines(range, predicate) {
    const allow = typeof predicate === "function" ? predicate : () => true;
    const log = within(sourceRows(SHEETS.logbook), range.since, range.until).filter(allow);
    const bd = within(sourceRows(SHEETS.breakdown), range.since, range.until).filter(allow);
    const pred = within(sourceRows(SHEETS.predictive), range.since, range.until).filter(allow);
    const map = /* @__PURE__ */ new Map();
    function touch(r, type) {
      const key = machineKey(r);
      if (!key) return;
      const item = map.get(key) || { key, code: machineCode(r), name: machineName(r), breakdowns: 0, events: 0, predictive: 0, openIssues: 0, downtimeMinutes: 0, descriptions: [] };
      item.events++;
      if (type === "breakdown") item.breakdowns++;
      if (type === "predictive") item.predictive++;
      if (!isClosed(r)) item.openIssues++;
      item.downtimeMinutes += downtimeMinutes(r);
      const d = description(r);
      if (d) item.descriptions.push(lower(d).replace(/\s+/g, " ").slice(0, 140));
      if (!item.code) item.code = machineCode(r);
      if (!item.name) item.name = machineName(r);
      map.set(key, item);
    }
    __name(touch, "touch");
    log.forEach((r) => touch(r, "logbook"));
    bd.forEach((r) => touch(r, "breakdown"));
    pred.forEach((r) => touch(r, "predictive"));
    return [...map.values()].map((m) => {
      const counts = {};
      m.descriptions.forEach((d) => {
        if (d.length > 4) counts[d] = (counts[d] || 0) + 1;
      });
      const recurring = Object.values(counts).filter((n) => n >= 2).length;
      const penalties = [
        { factor: "Breakdown", points: Math.min(40, m.breakdowns * 8), evidence: m.breakdowns + " breakdown" },
        { factor: "Downtime", points: Math.min(30, Math.round(m.downtimeMinutes / 120) * 3), evidence: Math.round(m.downtimeMinutes) + " menit" },
        { factor: "Open issue", points: Math.min(20, m.openIssues * 4), evidence: m.openIssues + " issue terbuka" },
        { factor: "Recurring pattern", points: Math.min(10, recurring * 3), evidence: recurring + " pola berulang" }
      ];
      const penalty = penalties.reduce((a, x) => a + x.points, 0);
      return { ...m, recurring, healthIndex: clamp(100 - penalty, 0, 100), healthFactors: penalties.filter((x) => x.points > 0) };
    }).sort((a, b) => a.healthIndex - b.healthIndex || b.downtimeMinutes - a.downtimeMinutes);
  }
  __name(aggregateMachines, "aggregateMachines");
  function getOverview(body) {
    const range = standardRange(body || {}), scope = scopeContext(body || {});
    const machines = aggregateMachines(range, scope.record);
    const log = within(sourceRows(SHEETS.logbook), range.since, range.until).filter(scope.record);
    const bd = within(sourceRows(SHEETS.breakdown), range.since, range.until).filter(scope.record);
    const pred = within(sourceRows(SHEETS.predictive), range.since, range.until).filter(scope.record);
    const stock = sourceRows(SHEETS.stock), eta = sourceRows(SHEETS.sparepartEta);
    const kpi = rows(SHEETS.kpiYtd).filter((r) => kpiPointsSinceSourceTruth(r).length).filter((r) => !scope.active || !machineKey(r) || scope.record(r));
    const projects = sourceRows(SHEETS.project).filter((r) => !scope.active || scope.record(r));
    const partRefs = partRefsFromLogbook(log);
    const scopedStock = scope.active ? joinPartRecords(partRefs, stock).map((x) => x.record) : stock;
    const scopedEta = scope.active ? joinPartRecords(partRefs, eta).map((x) => x.record) : eta;
    const criticalMachines = machines.filter((m) => m.healthIndex < 60 || m.openIssues > 0).slice(0, 12);
    const activeBreakdowns = [...bd, ...log.filter((r) => /breakdown|bd|emergency|corrective/.test(lower(first(r, ["Jenis Pekerjaan", "Type", "Kategori"]))))].filter((r) => !isClosed(r));
    const predictiveRisks = pred.filter((r) => isHigh(r) || !isClosed(r));
    const stockRisks = scopedStock.filter((r) => {
      const qty = num(first(r, ["Stock", "Stock Qty", "Qty", "Quantity", "Stock Aktual", "Stock Fisik", "On Hand"]));
      const min = num(first(r, ["Min Stock", "Minimum Stock", "Safety Stock", "ROP", "Reorder Point"]));
      return min > 0 && qty <= min;
    });
    const etaOverdue = scopedEta.filter((r) => {
      const d = timeMs(first(r, ["Estimasi ETA", "ETA", "Tanggal ETA", "Expected Date"]), NaN);
      return Number.isFinite(d) && d < Date.now() && !isClosed(r);
    });
    const kpiRisk = kpi.filter((r) => kpiIsAtRiskSinceSourceTruth(r));
    const overdueProjects = projects.filter((r) => {
      const due = timeMs(first(r, ["Target Finish", "Due Date", "Target", "Deadline"]), NaN);
      return Number.isFinite(due) && due < Date.now() && !isClosed(r);
    });
    const highActions = log.filter((r) => !isClosed(r) && isHigh(r)).concat(overdueProjects).slice(0, 25);
    const look = [];
    criticalMachines.slice(0, 4).forEach((m) => look.push({ priority: m.healthIndex < 40 ? "P0" : "P1", type: "machine", title: (m.code || m.name || "Mesin") + " membutuhkan perhatian", reason: "Health index rule-based " + m.healthIndex + "/100", evidence: m.healthFactors }));
    activeBreakdowns.slice(0, 4).forEach((r) => look.push({ priority: isHigh(r) ? "P0" : "P1", type: "breakdown", title: machineName(r) || machineCode(r) || "Breakdown aktif", reason: description(r) || "Status belum selesai", record: cleanRecord(r, 10) }));
    stockRisks.slice(0, 4).forEach((r) => look.push({ priority: "P1", type: "sparepart", title: materialName(r) || materialNumber(r) || "Sparepart kritis", reason: "Stock berada pada/di bawah batas minimum", record: cleanRecord(r, 10) }));
    overdueProjects.slice(0, 4).forEach((r) => look.push({ priority: "P1", type: "project", title: text(first(r, ["Judul", "Nama Project", "Tema"])) || "Project overdue", reason: "Target finish sudah terlewati", record: cleanRecord(r, 10) }));
    return { ok: true, data: {
      generatedAt: nowIso(),
      logicVersion: "v4-overview-2",
      range: { since: new Date(range.since).toISOString(), until: new Date(range.until).toISOString() },
      appliedScope: { machine: scope.machine || "", area: scope.area || "", machineCount: scope.active ? scope.machines.length : null },
      filters: { areas: scope.areas, machines: scopeContext({}).machines },
      summary: {
        criticalMachines: criticalMachines.length,
        activeBreakdown: activeBreakdowns.length,
        predictiveRisks: predictiveRisks.length,
        sparepartRisks: stockRisks.length + etaOverdue.length,
        kpiAtRisk: kpiRisk.length,
        openHighPriorityActions: highActions.length
      },
      thingsToLookAt: look.slice(0, 12),
      criticalMachines: criticalMachines.slice(0, 8),
      topRisks: look.filter((x) => x.priority === "P0" || x.priority === "P1").slice(0, 8),
      topOpportunities: machines.filter((m) => m.recurring > 0).slice(0, 6).map((m) => ({ type: "reliability", title: (m.code || m.name) + " memiliki pola berulang", reason: m.recurring + " pola problem berulang terdeteksi" })),
      latestIntelligence: [...log, ...bd, ...pred].sort((a, b) => dateValue(b) - dateValue(a)).slice(0, 12).map((r) => ({ timestamp: dateValue(r) ? new Date(dateValue(r)).toISOString() : "", machine: machineCode(r) || machineName(r), description: description(r), status: first(r, ["Status", "Severity", "Prioritas"]) })),
      sourceStatus: [
        sourceMeta(SHEETS.logbook, log),
        sourceMeta(SHEETS.breakdown, bd),
        sourceMeta(SHEETS.predictive, pred),
        sourceMeta(SHEETS.stock, scopedStock),
        sourceMeta(SHEETS.sparepartEta, scopedEta),
        sourceMeta(SHEETS.kpiYtd, kpi)
      ],
      lineage: { sourceOfTruth: "EXISTING_OMODOS", writes: "NONE", partLinkage: scope.active ? "Logbook consumption \u2192 Sparepart sources" : "global source view" }
    } };
  }
  __name(getOverview, "getOverview");
  function getWhatChanged(body) {
    const range = resolveChangeRange(body || {}), scope = scopeContext(body || {});
    const scopedLog = within(sourceRows(SHEETS.logbook), range.since, range.until).filter(scope.record);
    const partRefs = partRefsFromLogbook(scopedLog);
    const techNames = new Set(scopedLog.map((r) => lower(first(r, ["Nama Pelapor", "Technician", "PIC", "Pelapor", "Teknisi"]))).filter(Boolean));
    const defs = [
      ["machine", SHEETS.machines, "machine"],
      ["logbook", SHEETS.logbook, "machine"],
      ["breakdown", SHEETS.breakdown, "machine"],
      ["predictive", SHEETS.predictive, "machine"],
      ["sparepart", SHEETS.sparepartEta, "part"],
      ["kpi", SHEETS.kpiYtd, "optional-machine"],
      ["project", SHEETS.project, "machine"],
      ["people", SHEETS.personnel, "people"],
      ["energy", SHEETS.energy, "optional-machine"],
      ["ipal", SHEETS.ipal, "optional-machine"]
    ];
    const categories = defs.map(([category, sheet, mode]) => {
      let data = within(sourceRows(sheet), range.since, range.until);
      let scopeLabel = "GLOBAL";
      if (scope.active) {
        if (mode === "machine") {
          data = data.filter(scope.record);
          scopeLabel = "MACHINE/AREA";
        } else if (mode === "part") {
          data = joinPartRecords(partRefs, data).map((x) => x.record);
          scopeLabel = "LOGBOOK_PART_LINK";
        } else if (mode === "people") {
          data = data.filter((r) => techNames.has(lower(first(r, ["Nama", "Nama Karyawan", "Nama Personil", "Name"]))));
          scopeLabel = "LOGBOOK_PEOPLE_LINK";
        } else if (mode === "optional-machine") {
          const hasDimension = data.some((r) => machineKey(r) || text(first(r, ["Lokasi/Area", "Area", "Location", "Department"])));
          if (hasDimension) {
            data = data.filter(scope.record);
            scopeLabel = "MACHINE/AREA";
          } else scopeLabel = "GLOBAL_NO_MACHINE_DIMENSION";
        }
      }
      data = data.sort((a, b) => dateValue(b) - dateValue(a));
      return { category, sheet, count: data.length, scope: scopeLabel, latest: data.slice(0, 5).map((r) => cleanRecord(r, 10)) };
    }).filter((x) => x.count);
    return { ok: true, data: {
      generatedAt: nowIso(),
      logicVersion: "v4-what-changed-2",
      range: { since: new Date(range.since).toISOString(), until: new Date(range.until).toISOString(), preset: range.label || "CUSTOM", shift: range.shift || "" },
      appliedScope: { machine: scope.machine || "", area: scope.area || "" },
      categories,
      lineage: { sourceOfTruth: "EXISTING_OMODOS", operationalWrites: "NONE" }
    } };
  }
  __name(getWhatChanged, "getWhatChanged");
  function getMachineHealth(body) {
    const range = standardRange(body || {}), scope = scopeContext(body || {});
    return { ok: true, data: {
      generatedAt: nowIso(),
      machines: aggregateMachines(range, scope.record).slice(0, 250),
      logicVersion: "v4-health-2",
      appliedScope: { machine: scope.machine || "", area: scope.area || "" },
      explainability: "100 minus deterministic penalties from breakdown count, downtime, open issues, and recurring descriptions.",
      lineage: { sourceOfTruth: "EXISTING_OMODOS", operationalWrites: "NONE" }
    } };
  }
  __name(getMachineHealth, "getMachineHealth");
  function getMachinePassport(body) {
    const q = text(body.machine || body.machineCode || body.id);
    if (!q) return { ok: false, error: "VALIDATION_ERROR: machine wajib" };
    const master = sourceRows(SHEETS.machines).find((r) => matchesMachine(r, q)) || null;
    const sources = {
      logbook: sourceRows(SHEETS.logbook).filter((r) => matchesMachine(r, q)),
      breakdown: sourceRows(SHEETS.breakdown).filter((r) => matchesMachine(r, q)),
      predictive: sourceRows(SHEETS.predictive).filter((r) => matchesMachine(r, q)),
      corrective: sourceRows(SHEETS.corrective).filter((r) => matchesMachine(r, q)),
      rca: sourceRows(SHEETS.rca).filter((r) => matchesMachine(r, q)),
      kb: sourceRows(SHEETS.kb).filter((r) => matchesMachine(r, q)),
      project: sourceRows(SHEETS.project).filter((r) => matchesMachine(r, q)),
      kaizen: sourceRows(SHEETS.kaizen).filter((r) => matchesMachine(r, q)),
      sga: sourceRows(SHEETS.sga).filter((r) => matchesMachine(r, q)),
      patrol: sourceRows(SHEETS.patrolTemplate).filter((r) => matchesMachine(r, q)),
      kpi: sourceRows(SHEETS.kpi).filter((r) => matchesMachine(r, q)),
      runHour: sourceRows(SHEETS.runHour).filter((r) => matchesMachine(r, q))
    };
    const all = [...sources.logbook, ...sources.breakdown], sortedAll = all.slice().sort((a, b) => dateValue(b) - dateValue(a));
    const totalDowntime = all.reduce((n, r) => n + downtimeMinutes(r), 0);
    const failures = [...sources.breakdown, ...sources.logbook.filter((r) => /breakdown|corrective|problem|abnormal|emergency/.test(lower(first(r, ["Jenis Pekerjaan", "Kategori", "Status"]))))];
    const tech = /* @__PURE__ */ new Map();
    [...all, ...sources.rca, ...sources.corrective].forEach((r) => {
      const p = text(first(r, ["Nama Pelapor", "Technician", "PIC", "Pelapor", "Teknisi", "Assessor", "Author", "Created By"]));
      if (p) tech.set(p, (tech.get(p) || 0) + 1);
    });
    const partMap = partRefsFromLogbook(sources.logbook);
    const partSources = {
      stock: joinPartRecords(partMap, sourceRows(SHEETS.stock)),
      lokasi: joinPartRecords(partMap, sourceRows(SHEETS.sparepartLokasi)),
      eta: joinPartRecords(partMap, sourceRows(SHEETS.sparepartEta)),
      opname: joinPartRecords(partMap, sourceRows(SHEETS.sparepartOpname)),
      warehouse: joinPartRecords(partMap, sourceRows(SHEETS.sparepartWarehouse)),
      sap: joinPartRecords(partMap, sourceRows(SHEETS.sparepartSap))
    };
    const partDetails = [...partMap.values()].map((p) => {
      const match = /* @__PURE__ */ __name((kind) => partSources[kind].filter((x) => x.part.key === p.key).map((x) => cleanRecord(x.record, 12)), "match");
      const stock = match("stock"), eta = match("eta");
      const stockRisk = stock.some((r) => {
        const qty = num(first(r, ["Stock", "Stock Qty", "Qty", "Quantity", "Stock Aktual", "Stock Fisik", "On Hand"]));
        const min = num(first(r, ["Min Stock", "Minimum Stock", "Safety Stock", "ROP", "Reorder Point"]));
        return min > 0 && qty <= min;
      });
      return {
        materialNumber: p.materialNumber,
        material: p.material,
        consumptionCount: p.consumptionCount,
        latestConsumption: p.latest ? new Date(p.latest).toISOString() : "",
        sourceLogbookIds: [...p.sourceIds].slice(0, 30),
        stock,
        location: match("lokasi"),
        eta,
        opname: match("opname"),
        warehouse: match("warehouse"),
        sapStatus: match("sap"),
        risk: stockRisk ? "STOCK_RISK" : eta.some((r) => {
          const d = timeMs(first(r, ["Estimasi ETA", "ETA"]), NaN);
          return Number.isFinite(d) && d < Date.now() && !isClosed(r);
        }) ? "ETA_RISK" : "NONE_RECORDED"
      };
    }).sort((a, b) => b.consumptionCount - a.consumptionCount);
    const health = aggregateMachines({ since: Date.now() - 365 * 864e5, until: Date.now() }).find((m) => lower(m.code || m.name || m.key) === lower(q) || lower(m.code) === lower(machineCode(master || {})) || lower(m.name) === lower(machineName(master || {}))) || null;
    const recurring = /* @__PURE__ */ new Map();
    failures.forEach((r) => {
      const d = description(r);
      if (d) {
        const k = lower(d);
        const cur = recurring.get(k) || { description: d, count: 0, last: 0 };
        cur.count++;
        cur.last = Math.max(cur.last, dateValue(r) || 0);
        recurring.set(k, cur);
      }
    });
    const personality = [...recurring.values()].sort((a, b) => b.count - a.count).slice(0, 5);
    const eventReplay = [
      ...sources.logbook.map((r) => ({ source: SHEETS.logbook, record: r })),
      ...sources.breakdown.map((r) => ({ source: SHEETS.breakdown, record: r })),
      ...sources.predictive.map((r) => ({ source: SHEETS.predictive, record: r })),
      ...sources.rca.map((r) => ({ source: SHEETS.rca, record: r })),
      ...sources.corrective.map((r) => ({ source: SHEETS.corrective, record: r }))
    ].sort((a, b) => dateValue(b.record) - dateValue(a.record)).slice(0, 60).map((x) => ({ source: x.source, timestamp: dateValue(x.record) ? new Date(dateValue(x.record)).toISOString() : "", description: description(x.record), status: first(x.record, ["Status", "Severity", "Prioritas"]), record: cleanRecord(x.record, 10) }));
    const agingMap = /* @__PURE__ */ new Map();
    [
      ...sources.logbook.map((r) => ({ source: SHEETS.logbook, record: r })),
      ...sources.breakdown.map((r) => ({ source: SHEETS.breakdown, record: r })),
      ...sources.predictive.map((r) => ({ source: SHEETS.predictive, record: r })),
      ...sources.rca.map((r) => ({ source: SHEETS.rca, record: r })),
      ...sources.corrective.map((r) => ({ source: SHEETS.corrective, record: r }))
    ].forEach((x) => {
      const t = dateValue(x.record);
      if (!t) return;
      const d = new Date(t), month = d.getUTCFullYear() + "-" + String(d.getUTCMonth() + 1).padStart(2, "0");
      const cur = agingMap.get(month) || { month, events: 0, failures: 0, downtimeMinutes: 0, openIssues: 0, predictiveFindings: 0, sources: /* @__PURE__ */ new Set() };
      cur.events++;
      cur.downtimeMinutes += downtimeMinutes(x.record);
      if (!isClosed(x.record)) cur.openIssues++;
      if (x.source === SHEETS.predictive) cur.predictiveFindings++;
      if (x.source === SHEETS.breakdown || /breakdown|failure|emergency|abnormal|corrective/.test(lower(first(x.record, ["Jenis Pekerjaan", "Kategori", "Status"])))) cur.failures++;
      cur.sources.add(x.source);
      agingMap.set(month, cur);
    });
    const agingCurve = [...agingMap.values()].sort((a, b) => a.month.localeCompare(b.month)).slice(-24).map((x) => ({
      month: x.month,
      events: x.events,
      failures: x.failures,
      downtimeMinutes: Math.round(x.downtimeMinutes),
      openIssues: x.openIssues,
      predictiveFindings: x.predictiveFindings,
      sources: [...x.sources],
      label: "HISTORICAL_STRESS_TREND_NOT_PHYSICAL_AGE"
    }));
    const anatomyMap = /* @__PURE__ */ new Map();
    sources.patrol.forEach((r) => {
      const name = text(first(r, ["Area/Sub Area", "Kategori", "Nama Unit", "Subsystem"])) || "General";
      const cur = anatomyMap.get(name) || { subsystem: name, checks: 0, standards: [] };
      cur.checks++;
      const std = text(first(r, ["Kondisi Standar", "Standard Condition"]));
      if (std && cur.standards.length < 5) cur.standards.push(std);
      anatomyMap.set(name, cur);
    });
    const replacementEvents = sources.logbook.filter((r) => /ganti|penggantian|replace|replacement|renew/i.test(lower(first(r, ["Tindakan Perbaikan", "Deskripsi Masalah", "Jenis Pekerjaan"]))));
    const lifeClock = replacementEvents.slice().sort((a, b) => dateValue(b) - dateValue(a)).slice(0, 20).map((r) => ({
      label: "INFERRED_FROM_LOGBOOK",
      material: materialName(r) || first(r, ["Nama Unit"]) || "Component",
      materialNumber: materialNumber(r),
      lastReplacement: dateValue(r) ? new Date(dateValue(r)).toISOString() : "",
      elapsedDays: dateValue(r) ? Math.floor((Date.now() - dateValue(r)) / 864e5) : null,
      sourceId: first(r, ["ID", "TransactionID"]),
      confidence: "low",
      note: "Elapsed time since recorded replacement; not a manufacturer RUL."
    }));
    return { ok: true, data: {
      generatedAt: nowIso(),
      logicVersion: "v4-machine-passport-2",
      identity: master ? cleanRecord(master, 30) : { code: q, name: q, label: "MASTER_NOT_FOUND" },
      currentCondition: {
        healthIndex: health ? health.healthIndex : null,
        healthFactors: health ? health.healthFactors : [],
        lastAbnormality: sortedAll.find((r) => !isClosed(r) || isHigh(r)) ? cleanRecord(sortedAll.find((r) => !isClosed(r) || isHigh(r)), 12) : sortedAll[0] ? cleanRecord(sortedAll[0], 12) : null,
        openIssues: all.filter((r) => !isClosed(r)).slice(0, 20).map((r) => cleanRecord(r, 12)),
        currentRisk: health ? health.healthIndex < 40 ? "HIGH" : health.healthIndex < 70 ? "MEDIUM" : "WATCH" : "NOT AVAILABLE"
      },
      reliability: {
        failureCount: failures.length,
        downtimeMinutes: Math.round(totalDowntime),
        closedEvents: all.filter(isClosed).length,
        eventCount: all.length,
        mtbf: first(master || {}, ["MTBF"], "NOT AVAILABLE"),
        mttr: first(master || {}, ["MTTR"], "NOT AVAILABLE"),
        availability: first(master || {}, ["Availability", "Availability %"], "NOT AVAILABLE")
      },
      maintenance: {
        logbook: sources.logbook.sort((a, b) => dateValue(b) - dateValue(a)).slice(0, 30).map((r) => cleanRecord(r, 14)),
        predictive: sources.predictive.sort((a, b) => dateValue(b) - dateValue(a)).slice(0, 20).map((r) => cleanRecord(r, 14)),
        rca: sources.rca.sort((a, b) => dateValue(b) - dateValue(a)).slice(0, 20).map((r) => cleanRecord(r, 14)),
        corrective: sources.corrective.sort((a, b) => dateValue(b) - dateValue(a)).slice(0, 20).map((r) => cleanRecord(r, 14))
      },
      sparepart: { consumedParts: partDetails, count: partDetails.length, linkage: "Logbook consumption \u2192 existing Sparepart sources", noDuplicateInput: true },
      people: [...tech.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20).map(([name, experienceEvents]) => ({ name, experienceEvents })),
      improvement: { projects: sources.project.slice(0, 20).map((r) => cleanRecord(r, 12)), kaizen: sources.kaizen.slice(0, 20).map((r) => cleanRecord(r, 12)), sga: sources.sga.slice(0, 20).map((r) => cleanRecord(r, 12)) },
      knowledge: {
        kb: sources.kb.slice(0, 20).map((r) => cleanRecord(r, 12)),
        manual: master ? { manualPdf: first(master, ["Manual PDF URL"]), reference: first(master, ["Link Manual/Referensi"]), sourceNote: first(master, ["Keterangan Sumber"]) } : null
      },
      intelligence: {
        machinePersonality: personality,
        agingCurve,
        anatomy: [...anatomyMap.values()].slice(0, 30),
        componentLifeClock: lifeClock,
        eventReplay,
        kpiImpact: sources.kpi.slice(0, 20).map((r) => cleanRecord(r, 12)),
        runHour: sources.runHour.slice(0, 20).map((r) => cleanRecord(r, 12))
      },
      labels: {
        recorded: ["identity", "maintenance", "sparepart.consumedParts", "improvement", "knowledge", "intelligence.eventReplay"],
        derived: ["currentCondition.healthIndex", "reliability.failureCount", "reliability.downtimeMinutes", "people", "intelligence.machinePersonality", "intelligence.agingCurve", "intelligence.anatomy", "intelligence.componentLifeClock"],
        notAvailable: [...master ? [] : ["master identity"], ...sources.kpi.length ? [] : ["machine-specific KPI impact"]]
      },
      lineage: { sourceOfTruth: "EXISTING_OMODOS", operationalWrites: "NONE", sourceSheets: Object.entries(sources).map(([key, val]) => ({ key, records: val.length })) }
    } };
  }
  __name(getMachinePassport, "getMachinePassport");
  function getReliability(body) {
    const range = standardRange(body || {}), scope = scopeContext(body || {});
    const machines = aggregateMachines(range, scope.record);
    const log = within(sourceRows(SHEETS.logbook), range.since, range.until).filter(scope.record);
    const bd = within(sourceRows(SHEETS.breakdown), range.since, range.until).filter(scope.record);
    const rca = within(sourceRows(SHEETS.rca), range.since, range.until).filter(scope.record);
    const corrective = within(sourceRows(SHEETS.corrective), range.since, range.until).filter(scope.record);
    const failureEvents = [...bd, ...log.filter((r) => /breakdown|emergency|corrective|failure|abnormal/.test(lower(first(r, ["Jenis Pekerjaan", "Kategori", "Status"]))))];
    const byMachineFailures = /* @__PURE__ */ new Map();
    failureEvents.forEach((r) => {
      const key = lower(machineCode(r) || machineName(r));
      if (!key) return;
      if (!byMachineFailures.has(key)) byMachineFailures.set(key, []);
      byMachineFailures.get(key).push(r);
    });
    const enriched = machines.map((m) => {
      const key = lower(m.code || m.name || m.key), events = (byMachineFailures.get(key) || []).slice().sort((x, y) => dateValue(x) - dateValue(y));
      const intervals = [];
      for (let i = 1; i < events.length; i++) {
        const dt = dateValue(events[i]) - dateValue(events[i - 1]);
        if (dt > 0) intervals.push(dt / 36e5);
      }
      const repairEvents = events.filter((r) => downtimeMinutes(r) > 0);
      const failureDowntimeMinutes = events.reduce((n, r) => n + downtimeMinutes(r), 0);
      return {
        ...m,
        mtbfDerivedHours: intervals.length ? Math.round(intervals.reduce((x, y) => x + y, 0) / intervals.length * 10) / 10 : null,
        mttrDerivedMinutes: repairEvents.length ? Math.round(repairEvents.reduce((n, r) => n + downtimeMinutes(r), 0) / repairEvents.length) : null,
        failureDowntimeMinutes: Math.round(failureDowntimeMinutes),
        reliabilityEvidenceEvents: events.length,
        repairDurationEvidenceEvents: repairEvents.length
      };
    }).sort((x, y) => x.healthIndex - y.healthIndex || y.failureDowntimeMinutes - x.failureDowntimeMinutes);
    const monthly = /* @__PURE__ */ new Map();
    failureEvents.forEach((r) => {
      const t = dateValue(r);
      if (!t) return;
      const d = new Date(t), k = d.getUTCFullYear() + "-" + String(d.getUTCMonth() + 1).padStart(2, "0");
      const cur = monthly.get(k) || { month: k, breakdowns: 0, downtimeMinutes: 0, machines: /* @__PURE__ */ new Set() };
      cur.breakdowns++;
      cur.downtimeMinutes += downtimeMinutes(r);
      const m = machineCode(r) || machineName(r);
      if (m) cur.machines.add(m);
      monthly.set(k, cur);
    });
    const reliabilityGrowth = [...monthly.values()].sort((x, y) => x.month.localeCompare(y.month)).map((x) => ({ month: x.month, breakdowns: x.breakdowns, downtimeMinutes: Math.round(x.downtimeMinutes), affectedMachines: x.machines.size }));
    const hidden = /* @__PURE__ */ new Map();
    log.filter((r) => downtimeMinutes(r) > 0 && !/breakdown|emergency|failure|abnormal|corrective/.test(lower(first(r, ["Jenis Pekerjaan", "Kategori", "Status"])))).forEach((r) => {
      const key = machineCode(r) || machineName(r) || "Unassigned", cur = hidden.get(key) || { machine: key, events: 0, downtimeMinutes: 0 };
      cur.events++;
      cur.downtimeMinutes += downtimeMinutes(r);
      hidden.set(key, cur);
    });
    const hiddenFactory = [...hidden.values()].sort((x, y) => y.downtimeMinutes - x.downtimeMinutes).slice(0, 30);
    const correctiveEffectiveness = corrective.slice().sort((x, y) => dateValue(y) - dateValue(x)).slice(0, 30).map((r) => {
      const m = machineCode(r) || machineName(r), t = dateValue(r);
      if (!m || !t) return null;
      const before = failureEvents.filter((e) => matchesMachine(e, m) && dateValue(e) >= t - 30 * 864e5 && dateValue(e) < t).length;
      const after = failureEvents.filter((e) => matchesMachine(e, m) && dateValue(e) > t && dateValue(e) <= t + 30 * 864e5).length;
      const complete = Date.now() >= t + 30 * 864e5;
      return { machine: m, correctiveId: first(r, ["ID"]), date: new Date(t).toISOString(), before30d: before, after30d: after, delta: after - before, status: complete ? after < before ? "IMPROVED_SIGNAL" : after === before ? "NO_CHANGE_SIGNAL" : "WORSE_SIGNAL" : "INCOMPLETE_AFTER_WINDOW", label: "DERIVED_ASSOCIATION_NOT_CAUSATION" };
    }).filter(Boolean);
    let recordedCost = 0, costRecords = 0;
    [...bd, ...log, ...corrective].forEach((r) => {
      const raw = first(r, ["Failure Cost", "Downtime Cost", "Loss Cost", "Cost", "Biaya", "Actual Cost"], "");
      if (raw !== "" && raw !== null && raw !== void 0) {
        const v = num(raw);
        if (v || String(raw).match(/0/)) {
          recordedCost += v;
          costRecords++;
        }
      }
    });
    const totalDowntime = Math.round(enriched.reduce((n, m) => n + m.downtimeMinutes, 0));
    const costIntelligence = costRecords ? {
      status: "RECORDED_COST_ONLY",
      records: costRecords,
      totalRecordedCost: recordedCost,
      recordedCostPerDowntimeMinute: totalDowntime ? recordedCost / totalDowntime : null,
      millionRupiahMinute: totalDowntime ? recordedCost / 1e6 / totalDowntime : null,
      note: "Uses only explicitly recorded cost fields; missing costs are not estimated."
    } : { status: "NOT AVAILABLE", records: 0, note: "No explicit failure/downtime cost field was recorded in the selected source rows." };
    const pareto = enriched.slice().sort((x, y) => y.downtimeMinutes + y.breakdowns * 60 - (x.downtimeMinutes + x.breakdowns * 60)).slice(0, 20);
    const paretoNarrative = pareto.slice(0, 5).map((m, i) => ({ rank: i + 1, machine: m.code || m.name || m.key, why: Math.round(m.downtimeMinutes) + " min downtime, " + m.breakdowns + " breakdown(s), " + m.recurring + " recurring pattern(s)", inspect: m.openIssues ? "Resolve " + m.openIssues + " open issue(s) and validate recurring evidence." : "Review highest loss drivers and prior RCA/corrective evidence." }));
    const problemMap = /* @__PURE__ */ new Map();
    failureEvents.forEach((r) => {
      const label = description(r) || text(first(r, ["Problem", "Deskripsi Masalah", "Judul", "Title"]));
      const key = lower(label).replace(/\s+/g, " ").trim();
      if (!key) return;
      const cur = problemMap.get(key) || { problem: label, events: 0, downtimeMinutes: 0, openEvents: 0, machines: /* @__PURE__ */ new Set(), latestAt: 0 };
      cur.events++;
      cur.downtimeMinutes += downtimeMinutes(r);
      if (!isClosed(r)) cur.openEvents++;
      const machine = machineCode(r) || machineName(r);
      if (machine) cur.machines.add(machine);
      cur.latestAt = Math.max(cur.latestAt, dateValue(r) || 0);
      problemMap.set(key, cur);
    });
    const problemPareto = [...problemMap.values()].map((x) => ({
      problem: x.problem,
      events: x.events,
      downtimeMinutes: Math.round(x.downtimeMinutes),
      openEvents: x.openEvents,
      machineCount: x.machines.size,
      machines: [...x.machines].slice(0, 12),
      latestAt: x.latestAt ? new Date(x.latestAt).toISOString() : ""
    })).sort((a, b) => b.events - a.events || b.downtimeMinutes - a.downtimeMinutes || b.openEvents - a.openEvents).slice(0, 50);
    return { ok: true, data: {
      generatedAt: nowIso(),
      range: { since: new Date(range.since).toISOString(), until: new Date(range.until).toISOString() },
      badActors: enriched.slice(0, 20),
      chronic: enriched.filter((m) => m.recurring >= 2).sort((x, y) => y.recurring - x.recurring || x.healthIndex - y.healthIndex).slice(0, 20),
      acute: enriched.filter((m) => m.downtimeMinutes > 0 && m.recurring < 2).sort((x, y) => y.downtimeMinutes - x.downtimeMinutes).slice(0, 20),
      pareto,
      paretoNarrative,
      problemPareto,
      hiddenFactory,
      reliabilityGrowth,
      rcaMemory: rca.slice().sort((x, y) => dateValue(y) - dateValue(x)).slice(0, 40).map((r) => cleanRecord(r, 14)),
      countermeasureEffectiveness: correctiveEffectiveness,
      costIntelligence,
      totals: { machines: enriched.length, breakdowns: enriched.reduce((n, m) => n + m.breakdowns, 0), downtimeMinutes: totalDowntime, recurringPatterns: enriched.reduce((n, m) => n + m.recurring, 0), rca: rca.length, corrective: corrective.length },
      logicVersion: "v4-reliability-5",
      appliedScope: { machine: scope.machine || "", area: scope.area || "" },
      lineage: { sourceOfTruth: "EXISTING_OMODOS", operationalWrites: "NONE" },
      caveat: "Derived MTBF/MTTR and countermeasure signals use recorded event timing. They do not replace official KPI definitions where those are maintained separately."
    } };
  }
  __name(getReliability, "getReliability");
  function getPredictiveRisk(body) {
    const range = standardRange(body || {}), scope = scopeContext(body || {});
    const pred = within(sourceRows(SHEETS.predictive), range.since, range.until).filter(scope.record);
    const log = within(sourceRows(SHEETS.logbook), range.since, range.until).filter(scope.record);
    const bd = within(sourceRows(SHEETS.breakdown), range.since, range.until).filter(scope.record);
    const machines = aggregateMachines(range, scope.record);
    const failures = [...bd, ...log.filter((r) => /breakdown|failure|emergency|abnormal|corrective/.test(lower(first(r, ["Jenis Pekerjaan", "Kategori", "Status"]))))];
    const risks = machines.filter((m) => m.predictive > 0 || m.recurring > 0 || m.healthIndex < 70).slice(0, 50).map((m) => ({
      machine: m.code || m.name,
      risk: m.healthIndex < 40 ? "high" : m.healthIndex < 70 ? "medium" : "watch",
      riskScore: clamp(100 - m.healthIndex, 0, 100),
      calibratedProbability: "NOT AVAILABLE",
      confidence: m.predictive >= 3 && m.breakdowns >= 2 ? "medium" : m.predictive > 0 ? "low-medium" : "low",
      factors: m.healthFactors,
      evidence: { predictiveRecords: m.predictive, breakdowns: m.breakdowns, recurringPatterns: m.recurring, downtimeMinutes: Math.round(m.downtimeMinutes), openIssues: m.openIssues },
      timeRange: { since: new Date(range.since).toISOString(), until: new Date(range.until).toISOString() },
      uncertainty: "Rule-based risk score is not a calibrated probability.",
      statement: "Risk increased / pattern requires human inspection. No deterministic failure-date claim is made."
    }));
    const precursorMap = /* @__PURE__ */ new Map();
    failures.slice(-5e3).forEach((f) => {
      const ft = dateValue(f), m = machineCode(f) || machineName(f);
      if (!ft || !m) return;
      pred.forEach((p) => {
        if (!matchesMachine(p, m)) return;
        const pt = dateValue(p);
        if (!pt || pt >= ft || pt < ft - 7 * 864e5) return;
        const desc = description(p) || text(first(p, ["Severity", "Kategori"])) || "Predictive finding";
        const key = lower(desc), cur = precursorMap.get(key) || { pattern: desc, count: 0, machines: /* @__PURE__ */ new Set(), examples: [] };
        cur.count++;
        cur.machines.add(m);
        if (cur.examples.length < 5) cur.examples.push({ machine: m, predictiveAt: new Date(pt).toISOString(), failureAt: new Date(ft).toISOString(), finding: desc, failure: description(f) });
        precursorMap.set(key, cur);
      });
    });
    const anomalyBeforeFailure = [...precursorMap.values()].sort((x, y) => y.count - x.count).slice(0, 30).map((x) => ({ pattern: x.pattern, count: x.count, machines: [...x.machines], examples: x.examples, label: "OBSERVED_PRECURSOR_ASSOCIATION" }));
    const clusterMap = /* @__PURE__ */ new Map();
    failures.slice(-1e4).forEach((r) => {
      const d = description(r), m = machineCode(r) || machineName(r);
      if (!d || !m) return;
      const token = words(d).sort().slice(0, 6).join("|");
      if (!token) return;
      const cur = clusterMap.get(token) || { signature: token, count: 0, machines: /* @__PURE__ */ new Set(), examples: [] };
      cur.count++;
      cur.machines.add(m);
      if (cur.examples.length < 5) cur.examples.push(d);
      clusterMap.set(token, cur);
    });
    const crossMachineClusters = [...clusterMap.values()].filter((x) => x.machines.size >= 2).sort((x, y) => y.machines.size - x.machines.size || y.count - x.count).slice(0, 30).map((x) => ({ signature: x.signature, count: x.count, machines: [...x.machines], examples: x.examples, label: "TEXT_PATTERN_CLUSTER" }));
    const midpoint = range.since + (range.until - range.since) / 2;
    function halfStats(start, end) {
      const mm = /* @__PURE__ */ new Map();
      [...log, ...bd, ...pred].forEach((r) => {
        const t = dateValue(r);
        if (!t || t < start || t > end) return;
        const key = lower(machineCode(r) || machineName(r));
        if (!key) return;
        const cur = mm.get(key) || { events: 0, downtime: 0, open: 0 };
        cur.events++;
        cur.downtime += downtimeMinutes(r);
        if (!isClosed(r)) cur.open++;
        mm.set(key, cur);
      });
      return mm;
    }
    __name(halfStats, "halfStats");
    const early = halfStats(range.since, midpoint), late = halfStats(midpoint, range.until);
    const silentDeterioration = machines.map((m) => {
      const key = lower(m.code || m.name || m.key), e = early.get(key) || { events: 0, downtime: 0, open: 0 }, l = late.get(key) || { events: 0, downtime: 0, open: 0 };
      const score = (l.events - e.events) * 2 + Math.round((l.downtime - e.downtime) / 60) + (l.open - e.open) * 3;
      return { machine: m.code || m.name || m.key, early: e, late: l, deteriorationScore: score, status: score >= 10 ? "RISING_SIGNAL" : score >= 4 ? "WATCH" : "STABLE_OR_INSUFFICIENT" };
    }).filter((x) => x.deteriorationScore >= 4).sort((x, y) => y.deteriorationScore - x.deteriorationScore).slice(0, 30);
    const failureSignatures = machines.slice(0, 80).map((m) => {
      const descs = failures.filter((r) => matchesMachine(r, m.code || m.name || m.key)).map(description).filter(Boolean);
      const counts = /* @__PURE__ */ new Map();
      descs.forEach((d) => words(d).forEach((w) => counts.set(w, (counts.get(w) || 0) + 1)));
      const topTokens = [...counts.entries()].sort((x, y) => y[1] - x[1]).slice(0, 8).map(([token, count]) => ({ token, count }));
      return { machine: m.code || m.name || m.key, events: descs.length, topTokens, signature: topTokens.map((x) => x.token).join(" \u2022 "), confidence: descs.length >= 5 ? "medium" : descs.length >= 2 ? "low-medium" : "low" };
    }).filter((x) => x.events).sort((x, y) => y.events - x.events).slice(0, 40);
    const replacements = /* @__PURE__ */ new Map();
    log.filter((r) => /ganti|penggantian|replace|replacement|renew/i.test(lower(first(r, ["Tindakan Perbaikan", "Jenis Pekerjaan", "Deskripsi Masalah"])))).forEach((r) => {
      const m = machineCode(r) || machineName(r), part = materialNumber(r) || materialName(r), t = dateValue(r);
      if (!m || !part || !t) return;
      const key = lower(m) + "|" + lower(part), cur = replacements.get(key) || { machine: m, part, dates: [] };
      cur.dates.push(t);
      replacements.set(key, cur);
    });
    const remainingUsefulLife = [...replacements.values()].map((x) => {
      x.dates.sort((a, b) => a - b);
      if (x.dates.length < 3) return null;
      const intervals = [];
      for (let i = 1; i < x.dates.length; i++) intervals.push((x.dates[i] - x.dates[i - 1]) / 864e5);
      const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length, elapsed = (Date.now() - x.dates[x.dates.length - 1]) / 864e5;
      return { machine: x.machine, component: x.part, replacementEvents: x.dates.length, averageHistoricalIntervalDays: Math.round(avg), elapsedDays: Math.round(elapsed), remainingIntervalEstimateDays: Math.max(0, Math.round(avg - elapsed)), confidence: x.dates.length >= 5 ? "medium" : "low-medium", label: "HISTORICAL_REPLACEMENT_INTERVAL_NOT_MANUFACTURER_RUL" };
    }).filter(Boolean).sort((x, y) => x.remainingIntervalEstimateDays - y.remainingIntervalEstimateDays).slice(0, 40);
    return { ok: true, data: {
      generatedAt: nowIso(),
      risks,
      attentionQueue: risks.slice().sort((x, y) => y.riskScore - x.riskScore).slice(0, 20),
      anomalyBeforeFailure,
      crossMachineClusters,
      silentDeterioration,
      failureSignatures,
      remainingUsefulLife,
      sourceRecords: { predictive: pred.length, failures: failures.length, logbook: log.length },
      logicVersion: "v4-predictive-rules-3",
      appliedScope: { machine: scope.machine || "", area: scope.area || "" },
      lineage: { sourceOfTruth: "EXISTING_OMODOS", operationalWrites: "NONE" },
      safety: "All outputs are risk/pattern estimates for human inspection. No failure date is asserted."
    } };
  }
  __name(getPredictiveRisk, "getPredictiveRisk");
  function getFieldMission(body) {
    const range = standardRange({ since: body && body.since || new Date(Date.now() - 30 * 864e5).toISOString(), until: body && body.until || (/* @__PURE__ */ new Date()).toISOString() });
    const scope = scopeContext(body || {});
    const machines = aggregateMachines(range, scope.record).slice(0, 25);
    const templates = sourceRows(SHEETS.patrolTemplate), kaizen = sourceRows(SHEETS.kaizen);
    const log = within(sourceRows(SHEETS.logbook), range.since, range.until).filter(scope.record);
    const pred = within(sourceRows(SHEETS.predictive), range.since, range.until).filter(scope.record);
    const missions = machines.map((m) => {
      const key = m.code || m.name || m.key;
      const relevant = [...log, ...pred].filter((r) => matchesMachine(r, key)).sort((a, b) => dateValue(b) - dateValue(a));
      const open = relevant.filter((r) => !isClosed(r)).slice(0, 8);
      const recurring = /* @__PURE__ */ new Map();
      relevant.forEach((r) => {
        const d = description(r);
        if (!d) return;
        const k = lower(d);
        const cur = recurring.get(k) || { label: d, count: 0 };
        cur.count++;
        recurring.set(k, cur);
      });
      const template = templates.filter((r) => matchesMachine(r, key)).slice(0, 20).map((r) => ({ type: "RECORDED_TEMPLATE", category: first(r, ["Kategori"]), area: first(r, ["Area/Sub Area", "Area"]), check: first(r, ["Deskripsi Pemeriksaan", "Checklist", "Description"]), standard: first(r, ["Kondisi Standar", "Standard Condition"]) }));
      const history = [...recurring.values()].filter((x) => x.count >= 2).sort((a, b) => b.count - a.count).slice(0, 5).map((x) => ({ type: "DERIVED_HISTORY", check: "Periksa bukti masalah berulang: " + x.label, count: x.count, standard: "Periksa langsung dan bandingkan dengan kondisi normal yang tercatat" }));
      const checklist = [...template, ...history];
      const p = m.healthIndex < 40 ? "P0" : m.openIssues > 0 || m.healthIndex < 70 ? "P1" : "P2";
      const beforeAfterProof = kaizen.filter((r) => matchesMachine(r, key) && (text(first(r, ["Before-After"])) || text(first(r, ["Foto Before (JSON)"])) || text(first(r, ["Foto After (JSON)"])))).sort((a, b) => dateValue(b) - dateValue(a)).slice(0, 8).map((r) => ({
        id: first(r, ["ID"]),
        theme: first(r, ["Tema"]),
        date: first(r, ["Tanggal"]),
        beforeAfter: first(r, ["Before-After"]),
        beforePhoto: first(r, ["Foto Before (JSON)"]),
        afterPhoto: first(r, ["Foto After (JSON)"]),
        benefit: first(r, ["Benefit"]),
        status: first(r, ["Status"]),
        label: "RECORDED_KAIZEN_BEFORE_AFTER"
      }));
      return { priority: p, machine: key, healthIndex: m.healthIndex, reason: m.openIssues ? m.openIssues + " masalah belum selesai" : m.recurring ? m.recurring + " pola masalah berulang" : "Pemeriksaan kondisi terjadwal", openIssues: open.map((r) => cleanRecord(r, 10)), checklist, beforeAfterProof, sourceCounts: { template: template.length, history: history.length, beforeAfter: beforeAfterProof.length } };
    }).filter((x) => x.priority !== "P2" || x.checklist.length).sort((a, b) => ({ P0: 0, P1: 1, P2: 2 })[a.priority] - { P0: 0, P1: 1, P2: 2 }[b.priority] || a.healthIndex - b.healthIndex);
    return { ok: true, data: { generatedAt: nowIso(), range: { since: new Date(range.since).toISOString(), until: new Date(range.until).toISOString() }, missions, journey: missions.map((m, i) => ({ order: i + 1, machine: m.machine, priority: m.priority, reason: m.reason })), appliedScope: { machine: scope.machine || "", area: scope.area || "" }, lineage: { sourceOfTruth: "EXISTING_OMODOS", operationalWrites: "NONE" }, note: "Daftar pemeriksaan dinamis melengkapi template Patrol yang sudah ada. Fitur ini tidak menimpa checklist resmi atau Logbook." } };
  }
  __name(getFieldMission, "getFieldMission");
  function getSparepartRisk() {
    const stock = sourceRows(SHEETS.stock), lokasi = sourceRows(SHEETS.sparepartLokasi), eta = sourceRows(SHEETS.sparepartEta), opname = sourceRows(SHEETS.sparepartOpname), warehouse = sourceRows(SHEETS.sparepartWarehouse), sap = sourceRows(SHEETS.sparepartSap), log = sourceRows(SHEETS.logbook);
    const allPartSources = [...stock, ...lokasi, ...eta, ...opname, ...warehouse];
    const logParts = partRefsFromLogbook(log);
    const machineHealth = new Map(aggregateMachines({ since: Date.now() - 365 * 864e5, until: Date.now() }).map((m) => [lower(m.code || m.name || m.key), m]));
    const materialInfo = /* @__PURE__ */ new Map();
    function infoFor(number, name) {
      const key = materialKey(number, name);
      if (!key) return null;
      let v = materialInfo.get(key);
      if (!v) {
        const consumed = logParts.get(key);
        v = { key, materialNumber: text(number) || consumed && consumed.materialNumber || "", material: text(name) || consumed && consumed.material || text(number), consumptionCount: consumed ? consumed.consumptionCount : 0, machines: /* @__PURE__ */ new Set(), latest: consumed && consumed.latest || 0, stock: [], location: [], eta: [], opname: [], warehouse: [], sap: [], sourceLogbookIds: consumed ? [...consumed.sourceIds] : [] };
        materialInfo.set(key, v);
      }
      return v;
    }
    __name(infoFor, "infoFor");
    for (const p of logParts.values()) infoFor(p.materialNumber, p.material);
    allPartSources.forEach((r) => infoFor(materialNumber(r), materialName(r)));
    log.forEach((r) => {
      const direct = infoFor(materialNumber(r), materialName(r));
      const m = machineCode(r) || machineName(r);
      if (direct && m) direct.machines.add(m);
      splitParts(first(r, ["Spare Part Digunakan", "Sparepart Digunakan", "Parts Used"])).forEach((name) => {
        const x = infoFor("", name);
        if (x && m) x.machines.add(m);
      });
    });
    function attach(kind, records) {
      records.forEach((r) => {
        const x = infoFor(materialNumber(r), materialName(r));
        if (x) x[kind].push(cleanRecord(r, 14));
      });
    }
    __name(attach, "attach");
    attach("stock", stock);
    attach("location", lokasi);
    attach("eta", eta);
    attach("opname", opname);
    attach("warehouse", warehouse);
    sap.forEach((r) => {
      const entry = text(first(r, ["Entry ID"]));
      const source = log.find((x2) => text(first(x2, ["ID"])) === entry);
      if (!source) return;
      const x = infoFor(materialNumber(source), materialName(source));
      if (x) x.sap.push(cleanRecord(r, 10));
    });
    const now = Date.now();
    const forecastSince = Math.max(SOURCE_TRUTH_START_MS, now - 90 * 864e5);
    const forecastWindowDays = Math.max(1, Math.ceil((now - forecastSince) / 864e5));
    const forecastRows = log.filter((r) => {
      const t = dateValue(r);
      return t && t >= forecastSince && t <= now;
    });
    const recentCount = /* @__PURE__ */ new Map();
    partRefsFromLogbook(forecastRows).forEach((p, k) => recentCount.set(k, p.consumptionCount));
    function stockQtyValue(r) {
      const raw = first(r, ["Stock", "Stock Qty", "Qty", "Quantity", "Stock Aktual", "Stock Fisik", "On Hand"], null);
      if (raw === null || raw === void 0 || text(raw) === "") return null;
      return num(raw);
    }
    __name(stockQtyValue, "stockQtyValue");
    const criticality = [...materialInfo.values()].map((x) => {
      const stockRisk = x.stock.some((r) => {
        const qty = stockQtyValue(r);
        const minRaw = first(r, ["Min Stock", "Minimum Stock", "Safety Stock", "ROP", "Reorder Point"], null);
        const min = minRaw === null || minRaw === void 0 || text(minRaw) === "" ? null : num(minRaw);
        return qty !== null && min !== null && min > 0 && qty <= min;
      });
      const stockout = x.stock.some((r) => {
        const qty = stockQtyValue(r);
        return qty !== null && qty <= 0;
      });
      const etaOverdue = x.eta.some((r) => {
        const d = timeMs(first(r, ["Estimasi ETA", "ETA", "Tanggal ETA", "Expected Date"]), NaN);
        return Number.isFinite(d) && d < now && !isClosed(r);
      });
      const criticalMachineCount = [...x.machines].filter((m) => {
        const h = machineHealth.get(lower(m));
        return h && h.healthIndex < 60;
      }).length;
      const score = clamp(Math.min(30, x.consumptionCount * 3) + Math.min(20, x.machines.size * 4) + (stockRisk ? 35 : 0) + (stockout ? 10 : 0) + (etaOverdue ? 15 : 0) + Math.min(20, criticalMachineCount * 10), 0, 100);
      const recent = recentCount.get(x.key) || 0;
      return {
        materialNumber: x.materialNumber,
        material: x.material,
        criticalityScore: score,
        priority: score >= 70 ? "P0" : score >= 45 ? "P1" : score >= 25 ? "P2" : "P3",
        factors: { consumptionCount: x.consumptionCount, machines: x.machines.size, criticalMachineCount, stockRisk, stockout, etaOverdue },
        reservationForecast: {
          windowDays: forecastWindowDays,
          observedConsumptions: recent,
          expectedNext30: recent ? Number((recent / forecastWindowDays * 30).toFixed(1)) : 0,
          confidence: forecastWindowDays >= 60 && recent >= 6 ? "medium" : forecastWindowDays >= 30 && recent >= 3 ? "low-medium" : "low",
          coverageStart: new Date(forecastSince).toISOString(),
          coverageEnd: new Date(now).toISOString(),
          metric: "RECORDED_USAGE_EVENTS_NOT_QUANTITY",
          label: "HISTORICAL_RATE_PROJECTION"
        },
        machines: [...x.machines].slice(0, 30),
        latestConsumption: x.latest ? new Date(x.latest).toISOString() : "",
        records: { stock: x.stock, location: x.location, eta: x.eta, opname: x.opname, warehouse: x.warehouse, sap: x.sap }
      };
    }).sort((x, y) => y.criticalityScore - x.criticalityScore || y.factors.consumptionCount - x.factors.consumptionCount);
    const risks = [];
    criticality.filter((x) => x.factors.stockRisk || x.factors.etaOverdue).slice(0, 100).forEach((x) => {
      risks.push({ severity: x.priority, type: x.factors.stockout ? "stockout" : x.factors.stockRisk ? "stock-risk" : "eta-overdue", material: x.material, materialNumber: x.materialNumber, score: x.criticalityScore, factors: x.factors });
    });
    const deadStockCandidates = criticality.filter((x) => {
      const hasPositive = x.records.stock.some((r) => {
        const qty = stockQtyValue(r);
        return qty !== null && qty > 0;
      });
      return hasPositive && x.factors.consumptionCount === 0;
    }).slice(0, 100).map((x) => ({ material: x.material, materialNumber: x.materialNumber, label: "CANDIDATE_ONLY", reason: "Positive stock with no exact linked Logbook consumption in available history", records: x.records.stock }));
    const shelfMap = /* @__PURE__ */ new Map();
    [...lokasi, ...opname, ...warehouse].forEach((r) => {
      const loc = text(first(r, ["Lokasi Gudang", "Lokasi Rak", "Warehouse Location", "Location", "Lokasi"]));
      if (!loc) return;
      const cur = shelfMap.get(loc) || { location: loc, records: 0, materials: /* @__PURE__ */ new Set(), stockQty: 0 };
      cur.records++;
      const mk = materialNumber(r) || materialName(r);
      if (mk) cur.materials.add(mk);
      cur.stockQty += num(first(r, ["Stock Qty", "Stock Fisik", "Stock", "Qty", "Quantity"]));
      shelfMap.set(loc, cur);
    });
    const shelfDigitalTwin = [...shelfMap.values()].map((x) => ({ location: x.location, records: x.records, materials: x.materials.size, stockQty: x.stockQty })).sort((x, y) => y.materials - x.materials);
    const explicitEquivalents = [];
    allPartSources.forEach((r) => {
      const alt = text(first(r, ["Equivalent Part", "Equivalent", "Alternatif", "Alternative Part", "Substitute", "Pengganti", "Cross Reference"]));
      if (!alt) return;
      explicitEquivalents.push({ materialNumber: materialNumber(r), material: materialName(r), recordedEquivalent: alt, validation: "RECORDED_FIELD_REQUIRES_ENGINEERING_CONFIRMATION", source: cleanRecord(r, 10) });
    });
    const partPhotos = allPartSources.map((r) => ({ materialNumber: materialNumber(r), material: materialName(r), image: text(first(r, ["Foto URL", "Photo URL", "Image URL", "Foto", "Photo"])) })).filter((x) => x.image).slice(0, 100);
    const machinePartGraph = [];
    criticality.forEach((x) => x.machines.forEach((m) => machinePartGraph.push({ from: "machine:" + m, to: "part:" + (x.materialNumber || x.material), relation: "uses/consumed", material: x.material, materialNumber: x.materialNumber })));
    return { ok: true, data: {
      generatedAt: nowIso(),
      logicVersion: "v4-sparepart-4",
      risks,
      criticalityMatrix: criticality.slice(0, 150),
      consumptionTop: criticality.filter((x) => x.factors.consumptionCount > 0).sort((x, y) => y.factors.consumptionCount - x.factors.consumptionCount).slice(0, 50).map((x) => ({ material: x.material, materialNumber: x.materialNumber, count: x.factors.consumptionCount, machines: x.machines, latest: x.latestConsumption })),
      deadStockCandidates,
      shelfDigitalTwin: shelfDigitalTwin.slice(0, 100),
      reservationForecast: criticality.filter((x) => x.reservationForecast.observedConsumptions > 0).slice(0, 100).map((x) => ({ material: x.material, materialNumber: x.materialNumber, ...x.reservationForecast })),
      procurementUrgency: criticality.filter((x) => (x.priority === "P0" || x.priority === "P1") && (x.factors.stockRisk || x.factors.stockout || x.factors.etaOverdue)).slice(0, 50).map((x) => ({ material: x.material, materialNumber: x.materialNumber, priority: x.priority, score: x.criticalityScore, factors: x.factors, eta: x.records.eta.slice(0, 5), stock: x.records.stock.slice(0, 5) })),
      machinePartGraph: machinePartGraph.slice(0, 1e3),
      equivalentParts: explicitEquivalents,
      partPhotoAssets: partPhotos,
      photoRecognition: { status: partPhotos.length ? "CANDIDATE_ASSETS_AVAILABLE_MODEL_NOT_RUN" : "NOT AVAILABLE", note: "No visual recognition claim is made without a validated model." },
      counts: { stock: stock.length, lokasi: lokasi.length, eta: eta.length, opname: opname.length, warehouse: warehouse.length, sap: sap.length, materials: materialInfo.size },
      sources: [SHEETS.stock, SHEETS.sparepartLokasi, SHEETS.sparepartEta, SHEETS.sparepartOpname, SHEETS.sparepartWarehouse, SHEETS.sparepartSap, SHEETS.logbook],
      lineage: { sourceOfTruth: "EXISTING_OMODOS", operationalWrites: "NONE", linkage: "Logbook consumption \u2194 material number/name \u2194 existing sparepart sources" },
      caveat: "Material joins use recorded SAP number when available, otherwise exact normalized material name. Equivalent-part records are never treated as engineering-approved without confirmation."
    } };
  }
  __name(getSparepartRisk, "getSparepartRisk");
  function getKpiStory(body) {
    const scope = scopeContext(body || {});
    const kpi = rows(SHEETS.kpiYtd), work = sourceRows(SHEETS.kpi), breakdown = sourceRows(SHEETS.breakdown).filter((r) => !scope.active || scope.record(r));
    const energy = sourceRows(SHEETS.energy), cost = sourceRows(SHEETS.energyCost), record = sourceRows(SHEETS.recordYtd).filter((r) => !scope.active || scope.record(r)), run = sourceRows(SHEETS.runHour), ipal = sourceRows(SHEETS.ipal);
    const MONTHS = KPI_MONTHS;
    const periodIndex = /* @__PURE__ */ __name((year, month) => {
      const y = num(year), m = monthNumber(month);
      return y && m ? y * 12 + m : null;
    }, "periodIndex");
    const pearson = /* @__PURE__ */ __name((pairs) => {
      if (pairs.length < 3) return null;
      const xs = pairs.map((x) => x[0]), ys = pairs.map((x) => x[1]), mx = xs.reduce((a, b) => a + b, 0) / xs.length, my = ys.reduce((a, b) => a + b, 0) / ys.length;
      let nume = 0, dx = 0, dy = 0;
      for (let i = 0; i < xs.length; i++) {
        const a = xs[i] - mx, b = ys[i] - my;
        nume += a * b;
        dx += a * a;
        dy += b * b;
      }
      return dx && dy ? nume / Math.sqrt(dx * dy) : null;
    }, "pearson");
    const linearForecast = /* @__PURE__ */ __name((points) => {
      if (points.length < 3) return null;
      const n = points.length, sx = points.reduce((a, p) => a + p[0], 0), sy = points.reduce((a, p) => a + p[1], 0), sxx = points.reduce((a, p) => a + p[0] * p[0], 0), sxy = points.reduce((a, p) => a + p[0] * p[1], 0);
      const den = n * sxx - sx * sx;
      if (!den) return null;
      const slope = (n * sxy - sx * sy) / den, intercept = (sy - slope * sx) / n, nextX = Math.max(...points.map((p) => p[0])) + 1;
      return { nextPeriodIndex: nextX, forecast: intercept + slope * nextX, slope };
    }, "linearForecast");
    const kpiStories = kpi.slice(0, 200).map((r) => {
      if (scope.active && machineKey(r) && !scope.record(r)) return null;
      const name = text(first(r, ["KPI", "Indicator", "Parameter"])) || "KPI";
      const polarity = lower(first(r, ["Polaritas", "Polarity"]));
      const points = kpiPointsSinceSourceTruth(r), latest = points.length ? points[points.length - 1] : null;
      const forecast = linearForecast(points.map((p) => [p.periodIndex, p.value]));
      const actual = latest ? latest.value : null, target = latest ? latest.target : null;
      const gap = latest && target !== null ? actual - target : null;
      const atRisk = !!(latest && target !== null && (polarity.includes("min") ? actual > target : actual < target));
      const causeEvidence = [];
      const lname = lower(name);
      if (/mtbf|mttr|breakdown|availability|downtime|lost time/.test(lname)) causeEvidence.push({ domain: "maintenance", records: breakdown.length + record.length, reason: "KPI terkait data maintenance/reliability sejak 1 September 2026" });
      if (/energy|toe|utility|listrik|gas|steam/.test(lname)) causeEvidence.push({ domain: "energy", records: energy.length + cost.length, reason: "KPI terkait data energi/utility sejak 1 September 2026" });
      return {
        name,
        target,
        actual,
        gap,
        annualTarget: num(first(r, ["Target Tahunan", "Annual Target"])),
        unit: first(r, ["Satuan", "Unit"]),
        polarity: first(r, ["Polaritas", "Polarity"]),
        status: latest ? atRisk ? "Perlu perhatian" : "Sesuai target periode" : "Data sejak 1 Sep 2026 belum tersedia",
        atRisk,
        latestPeriod: latest ? latest.month + " " + latest.year : "",
        story: latest ? "Nilai " + latest.month + " " + latest.year + ": " + actual + (target !== null ? " | target periode: " + target : "") + (gap !== null ? " | selisih: " + Number(gap.toFixed(2)) : "") : "Belum ada realisasi KPI sejak 1 September 2026. Nilai Januari\u2013Agustus tidak dipakai oleh OMODOS 4.0.",
        pointsSinceSourceTruth: points,
        forecast: forecast ? { nextValue: Number(forecast.forecast.toFixed(2)), trendPerMonth: Number(forecast.slope.toFixed(2)), confidence: points.length >= 6 ? "sedang" : "rendah", label: "PROYEKSI_TREN_BUKAN_KOMITMEN" } : { status: "Data belum cukup" },
        causeTree: { label: "HUBUNGAN_DATA_BUKAN_BUKTI_SEBAB_AKIBAT", evidence: causeEvidence }
      };
    }).filter(Boolean);
    const kpiRisk = kpiStories.filter((x) => x.atRisk);
    const energyGroups = /* @__PURE__ */ new Map();
    energy.forEach((r) => {
      const key = text(first(r, ["Area"])) + "|" + text(first(r, ["Jenis"]));
      const value = num(first(r, ["Rasio", "Nilai"]));
      if (!key || !Number.isFinite(value)) return;
      const cur = energyGroups.get(key) || { key, area: first(r, ["Area"]), type: first(r, ["Jenis"]), values: [], records: [] };
      cur.values.push(value);
      cur.records.push(r);
      energyGroups.set(key, cur);
    });
    const energyAnomalies = [];
    energyGroups.forEach((g) => {
      if (g.values.length < 3) return;
      const mean = g.values.reduce((a, b) => a + b, 0) / g.values.length;
      const sd = Math.sqrt(g.values.reduce((a, v) => a + (v - mean) * (v - mean), 0) / g.values.length);
      if (!sd) return;
      g.records.forEach((r) => {
        const v = num(first(r, ["Rasio", "Nilai"])), z = (v - mean) / sd;
        if (Math.abs(z) >= 2) energyAnomalies.push({ area: g.area, type: g.type, value: v, zScore: Number(z.toFixed(2)), baselineMean: Number(mean.toFixed(3)), record: cleanRecord(r, 10), label: "STATISTICAL_OUTLIER" });
      });
    });
    energyAnomalies.sort((x, y) => Math.abs(y.zScore) - Math.abs(x.zScore));
    const energyPerOutput = [];
    cost.forEach((r) => {
      const use = num(first(r, ["Energy Use (GWh)", "Energy Use", "Nilai"])), good = num(first(r, ["Good Sheet Produced", "Good Output", "Output"]));
      if (use > 0 && good > 0) energyPerOutput.push({ year: first(r, ["Tahun"]), month: first(r, ["Bulan"]), energyUseGWh: use, goodOutput: good, energyPerGoodSheet: use / good, source: "Energy_Cost_TOE" });
    });
    energy.forEach((r) => {
      const val = num(first(r, ["Nilai"])), out = num(first(r, ["Output"])), ratio = num(first(r, ["Rasio"]));
      if (out > 0 && (val > 0 || ratio > 0)) energyPerOutput.push({ year: first(r, ["Tahun"]), month: first(r, ["Bulan"]), area: first(r, ["Area"]), type: first(r, ["Jenis"]), energyValue: val, output: out, ratio: ratio || val / out, source: "Energy_Utility_ENPI" });
    });
    const utilityTwin = [...energyGroups.values()].map((g) => ({
      area: g.area,
      type: g.type,
      records: g.records.length,
      latest: g.records.slice().sort((x, y) => dateValue(y) - dateValue(x))[0] ? cleanRecord(g.records.slice().sort((x, y) => dateValue(y) - dateValue(x))[0], 10) : null,
      average: Number((g.values.reduce((a, b) => a + b, 0) / g.values.length).toFixed(3))
    })).sort((x, y) => y.records - x.records);
    const monthlyBreak = /* @__PURE__ */ new Map();
    breakdown.forEach((r) => {
      const p = periodIndex(first(r, ["Tahun", "Year"]), first(r, ["Bulan", "Month"]));
      if (!p) return;
      const cur = monthlyBreak.get(p) || 0;
      monthlyBreak.set(p, cur + num(first(r, ["Breakdown (Jam)", "Breakdown Hours", "Downtime (Jam)"])));
    });
    const monthlyOutput = /* @__PURE__ */ new Map();
    cost.forEach((r) => {
      const p = periodIndex(first(r, ["Tahun", "Year"]), first(r, ["Bulan", "Month"]));
      if (!p) return;
      monthlyOutput.set(p, (monthlyOutput.get(p) || 0) + num(first(r, ["Good Sheet Produced", "Good Output", "Output"])));
    });
    const correlationPairs = [...monthlyBreak.keys()].filter((k) => monthlyOutput.has(k)).map((k) => [monthlyBreak.get(k), monthlyOutput.get(k)]);
    const corr = pearson(correlationPairs);
    const ipalIntelligence = ipal.slice().sort((x, y) => dateValue(y) - dateValue(x)).slice(0, 100).map((r) => {
      const daily = safeJsonParse_(String(first(r, ["DailyJSON"]) || "{}"), {}), chemical = safeJsonParse_(String(first(r, ["ChemicalJSON"]) || "{}"), {});
      const nums = [];
      function collect(o, path) {
        if (o && typeof o === "object") Object.entries(o).forEach(([k, v]) => {
          const p = path ? path + "." + k : k;
          if (typeof v === "number" && Number.isFinite(v)) nums.push({ metric: p, value: v });
          else if (typeof v === "object") collect(v, p);
        });
      }
      __name(collect, "collect");
      collect(daily, "daily");
      collect(chemical, "chemical");
      return { timestamp: dateValue(r) ? new Date(dateValue(r)).toISOString() : "", outlet: first(r, ["OutletLabel"]), month: first(r, ["Bulan"]), numericMetrics: nums.slice(0, 30), record: cleanRecord(r, 8) };
    });
    const recordRisks = record.filter((r) => {
      const mtbf = num(first(r, ["MTBF"])), targetMtbf = num(first(r, ["Target MTBF"])), mttr = num(first(r, ["MTTR"])), targetMttr = num(first(r, ["Target MTTR"])), lost = num(first(r, ["Lost Time (%)"])), maxLost = num(first(r, ["Max Lost Time (%)"]));
      return targetMtbf && mtbf < targetMtbf || targetMttr && mttr > targetMttr || maxLost && lost > maxLost;
    }).slice(0, 50).map((r) => cleanRecord(r, 14));
    return { ok: true, data: {
      generatedAt: nowIso(),
      logicVersion: "v4-operation-2",
      counts: { kpiDefinitions: kpi.length, kpiWithDataSinceCutoff: kpiStories.filter((x) => x.pointsSinceSourceTruth.length).length, workingPaperSinceCutoff: work.length, breakdown: breakdown.length, energy: energy.length, energyCost: cost.length, recordYtd: record.length, runHour: run.length, ipal: ipal.length },
      kpiAtRisk: kpiRisk.slice(0, 50),
      kpiStories: kpiStories.slice(0, 80),
      recordYtdRisks: recordRisks,
      maintenanceProductionCorrelation: { pairs: correlationPairs.length, pearson: corr === null ? "Data belum cukup" : Number(corr.toFixed(3)), label: corr === null ? "Data belum cukup" : "KORELASI_BUKAN_SEBAB_AKIBAT", variables: ["Jam breakdown", "Good output"] },
      energyAnomalies: energyAnomalies.slice(0, 50),
      energyPerGoodOutput: energyPerOutput.slice(0, 100),
      utilityDigitalTwin: utilityTwin.slice(0, 100),
      ipalIntelligence,
      targetRecovery: { action: "v4.runScenario", note: "Gunakan Simulasi Target untuk mencoba skenario. Simulasi tidak mengubah data KPI asli." },
      runHour: run.slice(0, 50).map((r) => cleanRecord(r, 16)),
      appliedScope: { machine: scope.machine || "", area: scope.area || "" },
      lineage: { sourceOfTruth: "OMODOS_EXISTING_SEJAK_2026-09-01", operationalWrites: "NONE" },
      caveat: "Proyeksi hanya dibuat bila data sejak 1 September 2026 sudah cukup. Korelasi tidak dianggap sebagai bukti sebab-akibat."
    } };
  }
  __name(getKpiStory, "getKpiStory");
  function getPeopleSkillGraph(body) {
    const people = sourceRows(SHEETS.personnel), soft = sourceRows(SHEETS.peopleSoft), hard = sourceRows(SHEETS.peopleHard), detail = sourceRows(SHEETS.peopleHardDetail), standard = sourceRows(SHEETS.peopleHardStandard), machineMaster = sourceRows(SHEETS.machines);
    const log = sourceRows(SHEETS.logbook), rca = sourceRows(SHEETS.rca), projects = sourceRows(SHEETS.project), kaizen = sourceRows(SHEETS.kaizen), sga = sourceRows(SHEETS.sga), kb = sourceRows(SHEETS.kb);
    const byName = /* @__PURE__ */ new Map();
    function pkey(v) {
      return lower(v);
    }
    __name(pkey, "pkey");
    function person(name) {
      name = text(name);
      if (!name) return null;
      const key = pkey(name);
      if (!byName.has(key)) byName.set(key, { name, profile: null, soft: [], hard: [], hardDetail: [], machines: /* @__PURE__ */ new Map(), rca: [], projects: [], knowledge: [], competent: 0, notCompetent: 0, lastEvidence: 0 });
      return byName.get(key);
    }
    __name(person, "person");
    people.forEach((r) => {
      const p = person(first(r, ["Nama", "Nama Karyawan", "Nama Personil", "Name"]));
      if (p) p.profile = cleanRecord(r, 18);
    });
    soft.forEach((r) => {
      const p = person(first(r, ["Nama", "Nama Karyawan"]));
      if (p) {
        p.soft.push(cleanRecord(r, 14));
        p.lastEvidence = Math.max(p.lastEvidence, dateValue(r) || 0);
      }
    });
    hard.forEach((r) => {
      const p = person(first(r, ["Nama", "Nama Karyawan"]));
      if (p) {
        p.hard.push(cleanRecord(r, 16));
        p.competent += num(first(r, ["Kompeten"]));
        p.notCompetent += num(first(r, ["Belum Kompeten"]));
        p.lastEvidence = Math.max(p.lastEvidence, dateValue(r) || 0);
      }
    });
    detail.forEach((r) => {
      const p = person(first(r, ["Nama", "Nama Karyawan"]));
      if (p) p.hardDetail.push(cleanRecord(r, 16));
    });
    function addMachineEvidence(p, r, type) {
      if (!p) return;
      const m = machineCode(r) || machineName(r);
      if (!m) return;
      const key = lower(m), cur = p.machines.get(key) || { machine: m, events: 0, logbook: 0, rca: 0, corrective: 0, lastSeen: 0, problems: [] };
      cur.events++;
      cur[type] = (cur[type] || 0) + 1;
      cur.lastSeen = Math.max(cur.lastSeen, dateValue(r) || 0);
      const d = description(r);
      if (d && cur.problems.length < 8) cur.problems.push(d);
      p.machines.set(key, cur);
      p.lastEvidence = Math.max(p.lastEvidence, dateValue(r) || 0);
    }
    __name(addMachineEvidence, "addMachineEvidence");
    log.forEach((r) => addMachineEvidence(person(first(r, ["Nama Pelapor", "Technician", "PIC", "Pelapor", "Teknisi"])), r, "logbook"));
    rca.forEach((r) => {
      const names = [first(r, ["Author", "PIC", "Assessor", "Created By"]), first(r, ["Nama", "Technician"])].map(text).filter(Boolean);
      names.forEach((n) => {
        const p = person(n);
        if (p) {
          p.rca.push(cleanRecord(r, 12));
          addMachineEvidence(p, r, "rca");
        }
      });
    });
    projects.forEach((r) => {
      const names = [first(r, ["Project Leader"]), first(r, ["PIC"]), ...splitParts(first(r, ["Anggota Tim", "Anggota"]))].map(text).filter(Boolean);
      names.forEach((n) => {
        const p = person(n);
        if (p) p.projects.push({ type: "Factory Project", record: cleanRecord(r, 12) });
      });
    });
    kaizen.forEach((r) => {
      const p = person(first(r, ["PIC"]));
      if (p) p.projects.push({ type: "Kaizen", record: cleanRecord(r, 12) });
    });
    sga.forEach((r) => {
      [first(r, ["Leader"]), first(r, ["PIC"]), ...splitParts(first(r, ["Anggota"]))].map(text).filter(Boolean).forEach((n) => {
        const p = person(n);
        if (p) p.projects.push({ type: "SGA", record: cleanRecord(r, 12) });
      });
    });
    kb.forEach((r) => {
      const p = person(first(r, ["Author"]));
      if (p) p.knowledge.push(cleanRecord(r, 12));
    });
    const standardByPosition = /* @__PURE__ */ new Map();
    standard.forEach((r) => {
      const pos = lower(first(r, ["Posisi", "Job Title", "Jabatan"]));
      if (!pos) return;
      if (!standardByPosition.has(pos)) standardByPosition.set(pos, []);
      standardByPosition.get(pos).push(r);
    });
    const personnel = [...byName.values()].map((p) => {
      const position = text(first(p.profile || {}, ["Job Title", "Jabatan", "Posisi"]));
      const expected = standardByPosition.get(lower(position)) || [];
      const gaps = p.hardDetail.filter((r) => /belum|not competent|gap|tidak kompeten/i.test(lower(first(r, ["Status Manager", "Status", "Keterangan"]))));
      const machineEvidence = [...p.machines.values()].sort((x, y) => y.events - x.events);
      const evidenceScore = machineEvidence.reduce((n, m) => n + m.events, 0) + p.hard.length * 2 + p.soft.length + p.rca.length * 2 + p.projects.length + p.knowledge.length;
      return {
        name: p.name,
        profile: p.profile,
        position,
        softAssessments: p.soft.length,
        hardAssessments: p.hard.length,
        competent: p.competent,
        notCompetent: p.notCompetent,
        machines: machineEvidence.map((x) => x.machine),
        machineEvidence: machineEvidence.slice(0, 30),
        rcaCount: p.rca.length,
        projectEvidence: p.projects.slice(0, 20),
        knowledgeCount: p.knowledge.length,
        gaps: gaps.slice(0, 30),
        expectedStandards: expected.slice(0, 30).map((r) => cleanRecord(r, 10)),
        evidenceScore,
        lastEvidence: p.lastEvidence ? new Date(p.lastEvidence).toISOString() : "",
        competencyEvidence: { hard: p.hard.slice(0, 10), detail: p.hardDetail.slice(0, 20), rca: p.rca.slice(0, 10), projects: p.projects.slice(0, 10), knowledge: p.knowledge.slice(0, 10) }
      };
    }).sort((x, y) => y.evidenceScore - x.evidenceScore);
    const skillToMachine = [];
    personnel.forEach((p) => p.machineEvidence.forEach((m) => skillToMachine.push({ person: p.name, machine: m.machine, evidenceEvents: m.events, logbook: m.logbook, rca: m.rca, lastSeen: m.lastSeen ? new Date(m.lastSeen).toISOString() : "", competent: p.competent, gaps: p.gaps.length })));
    skillToMachine.sort((x, y) => y.evidenceEvents - x.evidenceEvents);
    const machineCoverage = /* @__PURE__ */ new Map();
    machineMaster.forEach((r) => {
      const machine = machineCode(r) || machineName(r);
      if (!machine) return;
      const key = lower(machine);
      if (!machineCoverage.has(key)) machineCoverage.set(key, { machine, people: /* @__PURE__ */ new Set(), events: 0 });
    });
    skillToMachine.forEach((x) => {
      const key = lower(x.machine), cur = machineCoverage.get(key) || { machine: x.machine, people: /* @__PURE__ */ new Set(), events: 0 };
      cur.people.add(x.person);
      cur.events += x.evidenceEvents;
      machineCoverage.set(key, cur);
    });
    const knowledgeRisk = [...machineCoverage.values()].map((x) => {
      const docs = kb.filter((r) => matchesMachine(r, x.machine)).length, rcaCount = rca.filter((r) => matchesMachine(r, x.machine)).length;
      const score = clamp(100 - (x.people.size * 20 + Math.min(30, x.events * 2) + Math.min(30, (docs + rcaCount) * 5)), 0, 100);
      return { machine: x.machine, riskScore: score, risk: score >= 70 ? "HIGH" : score >= 40 ? "MEDIUM" : "LOW", experiencedPeople: x.people.size, evidenceEvents: x.events, knowledgeArticles: docs, rca: rcaCount, reason: "Risiko berkurang bila ada bukti pengalaman personel dan dokumentasi pengetahuan yang tercatat." };
    }).sort((x, y) => y.riskScore - x.riskScore);
    const learning = [];
    personnel.forEach((p) => {
      p.gaps.slice(0, 8).forEach((g) => learning.push({ person: p.name, position: p.position, gap: first(g, ["Unit Kompetensi", "Kriteria Unjuk Kerja", "Elemen Unit", "Penjelasan Belum Kompeten"]) || "Recorded competency gap", recommendation: "Periksa standar dan bukti yang sudah ada, lalu tentukan pembelajaran melalui mentoring, coaching, atau belajar mandiri.", source: "PI_Hardskill_Assessment_Detail", label: "RECOMMENDATION_REQUIRES_HUMAN_PLAN" }));
    });
    const mentorMatches = [];
    personnel.filter((p) => p.machineEvidence.length && (p.gaps.length > 0 || p.notCompetent > 0)).forEach((mentee) => {
      const menteeMachines = new Set((mentee.machines || []).map(lower));
      const candidates = personnel.filter((m) => {
        if (m.name === mentee.name || m.competent <= mentee.competent) return false;
        return (m.machineEvidence || []).some((mm) => menteeMachines.has(lower(mm.machine)));
      }).sort((x, y) => y.competent + y.evidenceScore - (x.competent + x.evidenceScore)).slice(0, 3);
      if (candidates.length) mentorMatches.push({
        mentee: mentee.name,
        mentors: candidates.map((m) => ({ name: m.name, competent: m.competent, evidenceScore: m.evidenceScore, sharedMachines: (m.machines || []).filter((x) => menteeMachines.has(lower(x))).slice(0, 10) })),
        label: "CANDIDATE_MATCH_HUMAN_APPROVAL_REQUIRED"
      });
    });
    const adaptiveLearningPlans = personnel.filter((p) => p.gaps.length).map((p) => {
      const gapLabels = [...new Set(p.gaps.map((g) => text(first(g, ["Unit Kompetensi", "Kriteria Unjuk Kerja", "Elemen Unit", "Penjelasan Belum Kompeten"]))).filter(Boolean))].slice(0, 6);
      const standardLabels = [...new Set((p.expectedStandards || []).map((r) => text(first(r, ["Unit Kompetensi", "Kriteria Unjuk Kerja", "Elemen Unit", "Nama Kompetensi", "Kompetensi"]))).filter(Boolean))].slice(0, 6);
      const match = mentorMatches.find((x) => lower(x.mentee) === lower(p.name));
      const mentorNames = match ? match.mentors.map((m) => m.name).slice(0, 3) : [];
      const machines = (p.machines || []).slice(0, 5);
      const steps = [];
      if (standardLabels.length) steps.push("Pelajari ulang standar: " + standardLabels.slice(0, 2).join(" • "));
      if (machines.length) steps.push("Latihan/observasi pada mesin yang sudah pernah ditangani: " + machines.slice(0, 3).join(", "));
      if (mentorNames.length) steps.push("Diskusikan gap dengan kandidat mentor: " + mentorNames.join(", "));
      steps.push("Kumpulkan bukti praktik lalu lakukan penilaian ulang sesuai proses penilaian teknisi.");
      return {
        person: p.name,
        position: p.position,
        gapCount: p.gaps.length,
        gaps: gapLabels,
        standards: standardLabels,
        machines,
        mentorCandidates: mentorNames,
        nextSteps: steps,
        lastEvidence: p.lastEvidence,
        label: "LEARNING_PLAN_DERIVED_FROM_RECORDED_GAPS"
      };
    }).sort((a, b) => b.gapCount - a.gapCount || String(a.person).localeCompare(String(b.person)));
    const challengeMap = /* @__PURE__ */ new Map();
    log.forEach((r) => {
      const machine = machineCode(r) || machineName(r), problem = description(r);
      if (!machine || !problem) return;
      const key = lower(machine) + "|" + lower(problem).replace(/\s+/g, " ").trim();
      const cur = challengeMap.get(key) || { machine, problem, occurrences: 0, downtimeMinutes: 0, openIssues: 0, lastSeen: 0 };
      cur.occurrences++;
      cur.downtimeMinutes += downtimeMinutes(r);
      if (!isClosed(r)) cur.openIssues++;
      cur.lastSeen = Math.max(cur.lastSeen, dateValue(r) || 0);
      challengeMap.set(key, cur);
    });
    const challengePatterns = [...challengeMap.values()].filter((x) => x.occurrences >= 2).sort((a, b) => b.occurrences - a.occurrences || b.downtimeMinutes - a.downtimeMinutes || b.openIssues - a.openIssues).slice(0, 20);
    const troubleshootingChallenges = challengePatterns.map((x, i) => {
      const candidates = rca.filter((r) => matchesMachine(r, x.machine)).map((r) => {
        const compareText = [
          description(r),
          first(r, ["Problem", "Masalah", "Judul", "Title"]),
          first(r, ["Root Cause", "Akar Masalah", "Penyebab"]),
          first(r, ["Corrective Action", "Tindakan Perbaikan", "Action"])
        ].filter(Boolean).join(" ");
        return { record: r, score: textSimilarity(x.problem, compareText) };
      }).filter((m) => m.score > 0).sort((a, b) => b.score - a.score);
      const best = candidates[0];
      const referenceRca = best && best.score >= 0.2 ? {
        similarity: Number(best.score.toFixed(2)),
        id: first(best.record, ["ID"]),
        title: first(best.record, ["Judul", "Title"]) || "RCA tercatat",
        rootCause: first(best.record, ["Root Cause", "Akar Masalah", "Penyebab"]),
        action: first(best.record, ["Corrective Action", "Tindakan Perbaikan", "Action"]),
        date: dateValue(best.record) ? new Date(dateValue(best.record)).toISOString() : ""
      } : null;
      return {
        id: "challenge-" + (i + 1),
        machine: x.machine,
        title: "Kasus " + (i + 1) + " — " + x.machine,
        problem: x.problem,
        prompt: "Sebelum membuka referensi, tuliskan tiga pemeriksaan awal, bukti yang ingin dicari, dan kapan masalah perlu dieskalasikan.",
        evidence: {
          occurrences: x.occurrences,
          downtimeMinutes: Math.round(x.downtimeMinutes),
          openIssues: x.openIssues,
          lastSeen: x.lastSeen ? new Date(x.lastSeen).toISOString() : ""
        },
        referenceRca,
        mode: "READ_ONLY_CASE_TRAINING",
        note: "Referensi RCA dipilih berdasarkan kemiripan teks pada mesin yang sama. Kemiripan bukan bukti bahwa akar penyebabnya identik."
      };
    });
    return { ok: true, data: {
      generatedAt: nowIso(),
      logicVersion: "v4-people-5",
      personnel: personnel.slice(0, 500),
      skillToMachine: skillToMachine.slice(0, 2e3),
      knowledgeRisk: knowledgeRisk.slice(0, 100),
      skillGapRadar: learning.slice(0, 300),
      adaptiveLearning: adaptiveLearningPlans.slice(0, 100),
      mentorMatches: mentorMatches.slice(0, 100),
      troubleshootingChallenges,
      counts: { personnel: people.length, soft: soft.length, hard: hard.length, detail: detail.length, standard: standard.length, linkedPeople: personnel.length },
      lineage: { sourceOfTruth: "EXISTING_OMODOS", operationalWrites: "NONE", sources: [SHEETS.personnel, SHEETS.peopleSoft, SHEETS.peopleHard, SHEETS.peopleHardDetail, SHEETS.peopleHardStandard, SHEETS.logbook, SHEETS.rca, SHEETS.project, SHEETS.kb] },
      caveat: "Experience and mentor candidates reflect recorded evidence only. They are not employee performance ratings and require human validation."
    } };
  }
  __name(getPeopleSkillGraph, "getPeopleSkillGraph");
  function getExperiencePassport(body) {
    const name = text(body.name || body.person);
    if (!name) return { ok: false, error: "VALIDATION_ERROR: name wajib" };
    const data = getPeopleSkillGraph({}).data;
    const p = (data.personnel || []).find((x) => lower(x.name) === lower(name));
    return { ok: true, data: p ? { ...p, label: "DERIVED_FROM_EXISTING_PEOPLE_AND_WORK_HISTORY", lineage: data.lineage } : { name, label: "NOT AVAILABLE" } };
  }
  __name(getExperiencePassport, "getExperiencePassport");
  function getImprovement(body) {
    const project = sourceRows(SHEETS.project), kaizen = sourceRows(SHEETS.kaizen), sga = sourceRows(SHEETS.sga);
    const overdue = project.filter((r) => {
      const d = timeMs(first(r, ["Target Finish", "Due Date", "Deadline"]), NaN);
      return Number.isFinite(d) && d < Date.now() && !isClosed(r);
    });
    const open = [...project.map((r) => ({ type: "Factory Project", record: r })), ...kaizen.map((r) => ({ type: "Kaizen", record: r })), ...sga.map((r) => ({ type: "SGA", record: r }))].filter((x) => !isClosed(x.record));
    const opportunity = open.slice(0, 80).map((x) => ({ type: x.type, ...cleanRecord(x.record, 12) }));
    const benefitEvidence = project.map((r) => {
      const benefitFields = ["Benefit Safety", "Benefit Quality", "Benefit Cost", "Benefit Delivery", "Benefit Environment", "Benefit People", "Achievement", "Lesson Learned"];
      const present = benefitFields.filter((k) => text(r[k])).length;
      return { id: first(r, ["ID", "Nomor Project"]), title: first(r, ["Judul", "Nama Project"]), status: first(r, ["Status"]), evidenceFields: present, totalEvidenceFields: benefitFields.length, evidenceCoverage: Math.round(present / benefitFields.length * 100), budget: first(r, ["Budget"]), actualCost: first(r, ["Actual Cost"]) };
    }).sort((x, y) => x.evidenceCoverage - y.evidenceCoverage).slice(0, 60);
    const beforeAfter = kaizen.map((r) => ({
      id: first(r, ["ID"]),
      theme: first(r, ["Tema"]),
      machine: machineCode(r) || machineName(r),
      area: first(r, ["Area"]),
      date: first(r, ["Tanggal"]),
      beforeAfter: first(r, ["Before-After"]),
      beforePhoto: first(r, ["Foto Before (JSON)"]),
      afterPhoto: first(r, ["Foto After (JSON)"]),
      benefit: first(r, ["Benefit"]),
      status: first(r, ["Status"]),
      label: "RECORDED_KAIZEN_EVIDENCE"
    })).filter((x) => text(x.beforeAfter) || text(x.beforePhoto) || text(x.afterPhoto)).slice(0, 60);
    const marketplace = open.map((x) => {
      const r = x.record;
      return { type: x.type, id: first(r, ["ID", "Nomor Project"]), title: first(r, ["Judul", "Tema", "Nama Tim"]) || x.type, problem: first(r, ["Permasalahan", "Background"]), idea: first(r, ["Ide Perbaikan", "Objective", "Target"]), area: first(r, ["Area"]), machine: machineCode(r) || machineName(r), pic: first(r, ["PIC", "Project Leader", "Leader"]), progress: first(r, ["Progress (%)"]), status: first(r, ["Status"]), sourceRecord: cleanRecord(r, 12) };
    }).slice(0, 100);
    const sgaStories = sga.map((r) => ({
      id: first(r, ["ID"]),
      team: first(r, ["Nama Tim"]),
      leader: first(r, ["Leader"]),
      members: first(r, ["Anggota"]),
      theme: first(r, ["Tema"]),
      target: first(r, ["Target"]),
      progress: first(r, ["Progress (%)"]),
      status: first(r, ["Status"]),
      achievement: first(r, ["Achievement"]),
      result: first(r, ["Hasil Improvement"]),
      presentation: first(r, ["Presentasi (JSON)"]),
      label: "RECORDED_SGA_STORY"
    })).slice(0, 60);
    const legacyMap = /* @__PURE__ */ new Map();
    [...project, ...kaizen, ...sga].forEach((r) => {
      const year = text(first(r, ["Tahun", "Year"])) || (dateValue(r) ? String(new Date(dateValue(r)).getUTCFullYear()) : "Unknown");
      const cur = legacyMap.get(year) || { year, projects: 0, kaizen: 0, sga: 0, completed: 0, records: [] };
      if (project.includes(r)) cur.projects++;
      else if (kaizen.includes(r)) cur.kaizen++;
      else cur.sga++;
      if (isClosed(r)) cur.completed++;
      if (cur.records.length < 12) cur.records.push(cleanRecord(r, 10));
      legacyMap.set(year, cur);
    });
    const legacy = [...legacyMap.values()].sort((x, y) => String(y.year).localeCompare(String(x.year)));
    const reliability = getReliability(body || {}).data;
    function improvementMentionsMachine(record, machine) {
      if (!record || !machine) return false;
      if (matchesMachine(record, machine)) return true;
      const key = lower(machine).replace(/\s+/g, " ").trim();
      if (!key) return false;
      const corpus = lower([
        first(record, ["Judul", "Tema", "Nama Project"]),
        first(record, ["Permasalahan", "Background"]),
        first(record, ["Ide Perbaikan", "Objective", "Target"])
      ].join(" ")).replace(/\s+/g, " ").trim();
      return (" " + corpus + " ").includes(" " + key + " ");
    }
    __name(improvementMentionsMachine, "improvementMentionsMachine");
    const opportunityRadar = (reliability.badActors || []).filter((m) => m.recurring > 0 || m.healthIndex < 60).map((m) => {
      const machine = m.code || m.name || m.key;
      const covered = open.some((x) => improvementMentionsMachine(x.record, machine));
      return { machine, healthIndex: m.healthIndex, recurring: m.recurring, downtimeMinutes: Math.round(m.downtimeMinutes), openIssues: m.openIssues, existingImprovementCoverage: covered ? "POSSIBLE_MATCH" : "NO_MACHINE_NAME_MATCH", priority: !covered && (m.healthIndex < 40 || m.recurring >= 3) ? "P1" : "P2", reason: covered ? "Ada improvement terbuka yang menyebut mesin ini; periksa sebelum membuat pekerjaan baru." : "Ada bukti masalah berulang atau kerugian, dan belum ditemukan improvement terbuka yang secara jelas menyebut mesin ini." };
    }).sort((x, y) => ({ P1: 0, P2: 1 })[x.priority] - { P1: 0, P2: 1 }[y.priority] || x.healthIndex - y.healthIndex).slice(0, 40);
    return { ok: true, data: {
      generatedAt: nowIso(),
      logicVersion: "v4-improvement-3",
      counts: { project: project.length, kaizen: kaizen.length, sga: sga.length, overdue: overdue.length, open: open.length },
      overdueProjects: overdue.slice(0, 40).map((r) => cleanRecord(r, 12)),
      openImprovements: opportunity,
      opportunityRadar,
      benefitEvidence,
      beforeAfterTimeline: beforeAfter,
      ideaMarketplace: marketplace,
      sgaStories,
      improvementLegacy: legacy,
      knowledgeGraph: { action: "v4.getFactoryBrain", nodeTypes: ["project", "kaizen", "sga", "machine", "failure", "knowledge"] },
      autoKaizenDraft: { action: "v4.aiAsk", purpose: "kaizen-draft", operationalWrite: "NONE", approval: "HUMAN_REQUIRED" },
      lineage: { sourceOfTruth: "EXISTING_OMODOS", operationalWrites: "NONE" },
      note: "Opportunity and benefit verification are evidence signals only. New/edited Project, Kaizen or SGA records must use the official existing module."
    } };
  }
  __name(getImprovement, "getImprovement");
  function findSimilarImprovement(body) {
    const q = text(body.query || body.idea || body.title);
    if (!q) return { ok: false, error: "VALIDATION_ERROR: query wajib" };
    const source = [
      ...sourceRows(SHEETS.project).map((r) => ({ type: "Factory Project", sheet: SHEETS.project, record: r })),
      ...sourceRows(SHEETS.kaizen).map((r) => ({ type: "Kaizen", sheet: SHEETS.kaizen, record: r })),
      ...sourceRows(SHEETS.sga).map((r) => ({ type: "SGA", sheet: SHEETS.sga, record: r }))
    ];
    const hits = [];
    source.forEach((x) => {
      const r = x.record;
      const corpus = [
        first(r, ["Judul", "Tema", "Nama Project"]),
        first(r, ["Background", "Permasalahan"]),
        first(r, ["Objective", "Ide Perbaikan", "Target"]),
        first(r, ["Lesson Learned", "Hasil Improvement"])
      ].map(text).filter(Boolean).join(" ");
      const score = textSimilarity(q, corpus);
      if (score <= 0) return;
      hits.push({ type: x.type, sheet: x.sheet, score, title: first(r, ["Judul", "Tema", "Nama Project"]) || x.type, area: first(r, ["Area"]), machine: machineCode(r) || machineName(r), status: first(r, ["Status"]), record: cleanRecord(r, 14) });
    });
    hits.sort((a, b) => b.score - a.score);
    return { ok: true, data: { query: q, hits: hits.slice(0, 30), confidence: hits.length && hits[0].score >= 0.45 ? "medium" : "low", note: "Similarity flags possible overlap for human review; it does not declare an improvement duplicate automatically." } };
  }
  __name(findSimilarImprovement, "findSimilarImprovement");
  function getBrief(body) {
    const overview = getOverview(body || {}).data;
    const s = overview.summary || {}, items = overview.thingsToLookAt || [];
    const lines = [];
    if (s.activeBreakdown) lines.push(s.activeBreakdown + " gangguan aktif perlu diperiksa.");
    if (s.criticalMachines) lines.push(s.criticalMachines + " mesin perlu perhatian berdasarkan aturan dan data saat ini.");
    if (s.sparepartRisks) lines.push(s.sparepartRisks + " risiko stok atau ETA sparepart perlu diperiksa.");
    if (s.kpiAtRisk) lines.push(s.kpiAtRisk + " KPI perlu diperiksa karena tidak sesuai kondisi target yang tersedia.");
    if (s.openHighPriorityActions) lines.push(s.openHighPriorityActions + " tindakan penting belum selesai.");
    if (!lines.length) lines.push("Tidak ada sinyal P0/P1 pada periode data yang dipilih.");
    return { ok: true, data: { generatedAt: nowIso(), mode: "DETERMINISTIC_BRIEF", headline: lines[0], summary: lines, thingsToLookAt: items.slice(0, 8), confidence: items.length ? "medium" : "low", sourceStatus: overview.sourceStatus, note: "Ringkasan dibuat langsung dari data OMODOS yang tersedia tanpa memerlukan layanan generatif." } };
  }
  __name(getBrief, "getBrief");
  function runScenario(body) {
    const range = standardRange(body || {}), reliability = getReliability(range).data, overview = getOverview(range).data, spare = getSparepartRisk().data;
    const params = {
      downtimeReductionPct: clamp(num(body.downtimeReductionPct), 0, 100),
      recurringReductionPct: clamp(num(body.recurringReductionPct), 0, 100),
      stockRiskReductionPct: clamp(num(body.stockRiskReductionPct), 0, 100),
      actionClosurePct: clamp(num(body.actionClosurePct), 0, 100)
    };
    const base = {
      downtimeMinutes: num(reliability.totals && reliability.totals.downtimeMinutes),
      breakdowns: num(reliability.totals && reliability.totals.breakdowns),
      recurringPatterns: num(reliability.totals && reliability.totals.recurringPatterns),
      sparepartRisks: (spare.risks || []).length,
      openHighPriorityActions: num(overview.summary && overview.summary.openHighPriorityActions)
    };
    const projected = {
      downtimeMinutes: Math.round(base.downtimeMinutes * (1 - params.downtimeReductionPct / 100)),
      recurringPatterns: Math.max(0, Math.round(base.recurringPatterns * (1 - params.recurringReductionPct / 100))),
      sparepartRisks: Math.max(0, Math.round(base.sparepartRisks * (1 - params.stockRiskReductionPct / 100))),
      openHighPriorityActions: Math.max(0, Math.round(base.openHighPriorityActions * (1 - params.actionClosurePct / 100)))
    };
    projected.avoidedDowntimeMinutes = base.downtimeMinutes - projected.downtimeMinutes;
    return { ok: true, data: {
      generatedAt: nowIso(),
      logicVersion: "v4-scenario-1",
      range: { since: new Date(range.since).toISOString(), until: new Date(range.until).toISOString() },
      params,
      baseline: base,
      projected,
      assumptions: [
        "Percent reductions are user-supplied scenario assumptions, not predictions.",
        "The scenario applies reductions independently and does not model causal interactions.",
        "Breakdown count is shown as baseline evidence and is not automatically reduced without a validated failure model."
      ],
      confidence: "scenario-not-prediction"
    } };
  }
  __name(runScenario, "runScenario");
  const SCENARIO_HEADERS = ["ID", "Name", "CreatedAt", "Actor", "ParamsJSON", "Status"];
  const SCENARIO_RESULT_HEADERS = ["ID", "ScenarioID", "GeneratedAt", "LogicVersion", "ResultJSON"];
  function saveScenario(body) {
    const name = text(body.name);
    if (!name) return { ok: false, error: "VALIDATION_ERROR: name wajib" };
    const result = runScenario(body);
    if (!result.ok) return result;
    const id = uuid(), ts = nowIso();
    ensureSheet("V4_Scenario", SCENARIO_HEADERS).appendRow([id, name, ts, text(body.actor), JSON.stringify(result.data.params), "SAVED"]);
    ensureSheet("V4_Scenario_Result", SCENARIO_RESULT_HEADERS).appendRow([uuid(), id, ts, result.data.logicVersion, JSON.stringify(result.data)]);
    return { ok: true, data: { id, name, savedAt: ts, result: result.data } };
  }
  __name(saveScenario, "saveScenario");
  function getScenarios() {
    const scenarios = rows("V4_Scenario").sort((a, b) => dateValue(b) - dateValue(a)).slice(0, 100);
    const results = rows("V4_Scenario_Result");
    return { ok: true, data: { scenarios: scenarios.map((s) => {
      const last = results.filter((r) => text(r.ScenarioID) === text(s.ID)).sort((a, b) => dateValue(b) - dateValue(a))[0];
      return { scenario: cleanRecord(s, 12), latestResult: last ? cleanRecord(last, 8) : null };
    }) } };
  }
  __name(getScenarios, "getScenarios");
  function getFactoryBrain(body) {
    const maxMachines = clamp(num(body.maxMachines) || 30, 5, 100);
    function graphRows(name, { allowUndated = false } = {}) {
      return rows(name).filter((r) => {
        const t = sourceTimestamp(r);
        if (t) return t >= SOURCE_TRUTH_START_MS;
        return allowUndated;
      });
    }
    __name(graphRows, "graphRows");
    const machineRows = graphRows(SHEETS.machines, { allowUndated: true }).slice(0, maxMachines);
    const log = graphRows(SHEETS.logbook), pred = graphRows(SHEETS.predictive), rca = graphRows(SHEETS.rca), corrective = graphRows(SHEETS.corrective), kb = graphRows(SHEETS.kb);
    const stock = graphRows(SHEETS.stock, { allowUndated: true }), eta = graphRows(SHEETS.sparepartEta), projects = graphRows(SHEETS.project), kaizens = graphRows(SHEETS.kaizen), sgas = graphRows(SHEETS.sga);
    const energy = graphRows(SHEETS.energy), ipal = graphRows(SHEETS.ipal);
    const kpis = (getKpiStory(body || {}).data.kpiStories || []).filter((x) => (x.pointsSinceSourceTruth || []).length);
    const nodes = [], edges = [], nodeIds = /* @__PURE__ */ new Set(), edgeIds = /* @__PURE__ */ new Set();
    const idPart = /* @__PURE__ */ __name((v) => lower(v).replace(/\s+/g, " ").replace(/[^a-z0-9 _.-]+/g, "").slice(0, 120), "idPart");
    function addNode(id, label, type, meta, source) {
      if (!id) return null;
      if (!nodeIds.has(id)) {
        nodeIds.add(id);
        nodes.push({ id, label: text(label) || id, type, source: source || "", meta: meta ? cleanRecord(meta, 10) : void 0 });
      }
      return id;
    }
    __name(addNode, "addNode");
    function addEdge(from, to, relation, evidence) {
      if (!from || !to || from === to) return;
      const k = from + "|" + to + "|" + relation;
      if (edgeIds.has(k)) return;
      edgeIds.add(k);
      edges.push({ from, to, relation, evidence: evidence ? cleanRecord(evidence, 6) : void 0 });
    }
    __name(addEdge, "addEdge");
    addNode("omodos", "OMODOS", "root", null, "OMODOS");
    const cats = [
      ["machines", "Mesin"],
      ["components", "Bagian Mesin"],
      ["people", "Orang / Teknisi"],
      ["spareparts", "Sparepart"],
      ["failures", "Masalah / Gangguan"],
      ["knowledge", "Panduan / RCA / Manual"],
      ["projects", "Project / Kaizen / SGA"],
      ["kpi", "KPI"],
      ["energy", "Energi"],
      ["ipal", "IPAL"],
      ["supply", "Vendor / PO / Biaya"]
    ];
    cats.forEach(([id, label]) => {
      addNode("cat:" + id, label, "category", null, "DERIVED_CATEGORY");
      addEdge("omodos", "cat:" + id, "terhubung");
    });
    function machineNode(r) {
      const key = machineCode(r) || machineName(r);
      if (!key) return null;
      const id = "machine:" + idPart(key);
      addNode(id, key, "machine", r, SHEETS.machines);
      addEdge("cat:machines", id, "berisi");
      return id;
    }
    __name(machineNode, "machineNode");
    function componentNode(m, r) {
      const label = text(first(r, ["Nama Unit", "Titik Inspeksi", "Component", "Komponen", "Subsystem", "Area/Sub Area"]));
      if (!label || !m) return null;
      const id = "component:" + idPart(m + "|" + label);
      addNode(id, label, "component", r, "EXISTING_RECORD");
      addEdge("cat:components", id, "berisi");
      addEdge(m, id, "punya bagian", r);
      return id;
    }
    __name(componentNode, "componentNode");
    function partNode(r, labelOverride) {
      const label = text(labelOverride) || materialName(r) || materialNumber(r);
      if (!label) return null;
      const id = "part:" + idPart(materialNumber(r) || label);
      addNode(id, label, "sparepart", r, "SPAREPART_EXISTING");
      addEdge("cat:spareparts", id, "berisi");
      return id;
    }
    __name(partNode, "partNode");
    machineRows.forEach((r) => {
      const m = machineNode(r);
      const manual = text(first(r, ["Manual PDF URL", "Link Manual/Referensi"]));
      if (manual) {
        const mid = "manual:" + idPart((machineCode(r) || machineName(r)) + "|" + manual);
        addNode(mid, "Manual \u2014 " + (machineCode(r) || machineName(r)), "manual", { url: manual, source: first(r, ["Keterangan Sumber"]) }, SHEETS.machines);
        addEdge("cat:knowledge", mid, "berisi");
        addEdge(m, mid, "punya panduan", r);
      }
    });
    log.slice(0, 140).forEach((r, i) => {
      const m = machineNode(r);
      if (!m) return;
      const comp = componentNode(m, r);
      const d = description(r), entryId = text(first(r, ["ID", "TransactionID"])) || "log-" + i;
      let failure = null, symptom = null;
      if (d) {
        const sid = "symptom:" + idPart(d);
        symptom = addNode(sid, d.slice(0, 80), "symptom", { description: d }, SHEETS.logbook);
        addEdge("cat:failures", symptom, "berisi");
        addEdge(comp || m, symptom, "menunjukkan gejala", r);
        const failureLike = /breakdown|failure|abnormal|emergency|corrective/.test(lower(first(r, ["Jenis Pekerjaan", "Kategori", "Status"]))) || downtimeMinutes(r) > 0;
        if (failureLike) {
          const fid = "failure:" + idPart(entryId);
          failure = addNode(fid, d.slice(0, 80), "failure", r, SHEETS.logbook);
          addEdge("cat:failures", failure, "berisi");
          addEdge(comp || m, failure, "pernah mengalami", r);
          addEdge(failure, symptom, "muncul sebagai", r);
        }
      }
      const action = text(first(r, ["Tindakan Perbaikan", "Corrective Action", "Action"]));
      if (action) {
        const aid = "action:" + idPart(entryId + "|" + action);
        addNode(aid, action.slice(0, 80), "corrective_action", r, SHEETS.logbook);
        addEdge("cat:knowledge", aid, "berisi");
        addEdge(failure || symptom || m, aid, "ditangani dengan", r);
      }
      const person = text(first(r, ["Nama Pelapor", "Technician", "PIC", "Pelapor", "Teknisi"]));
      if (person) {
        const pid = "person:" + idPart(person);
        addNode(pid, person, "person", { name: person }, SHEETS.logbook);
        addEdge("cat:people", pid, "berisi");
        addEdge(failure || symptom || m, pid, "ditangani / dicatat oleh", r);
      }
      const directPart = materialNumber(r) || materialName(r);
      const partNames = [...directPart ? [directPart] : [], ...splitParts(first(r, ["Spare Part Digunakan", "Sparepart Digunakan", "Parts Used"]))].slice(0, 4);
      partNames.forEach((part) => {
        const pid = partNode(r, part);
        if (pid) {
          addEdge(m, pid, "memakai", r);
          if (failure || symptom) addEdge(failure || symptom, pid, "melibatkan sparepart", r);
        }
      });
      const rawCost = first(r, ["Failure Cost", "Downtime Cost", "Loss Cost", "Cost", "Biaya"], "");
      if (rawCost !== "" && rawCost !== null && rawCost !== void 0) {
        const cid = "cost:" + idPart(entryId);
        addNode(cid, "Cost " + String(rawCost), "cost", { value: rawCost, entryId }, SHEETS.logbook);
        addEdge("cat:supply", cid, "berisi");
        addEdge(failure || m, cid, "menimbulkan biaya", r);
      }
    });
    pred.slice(0, 60).forEach((r, i) => {
      const m = machineNode(r);
      if (!m) return;
      const comp = componentNode(m, r), d = description(r);
      if (!d) return;
      const sid = "symptom:" + idPart(d);
      addNode(sid, d.slice(0, 80), "symptom", r, SHEETS.predictive);
      addEdge("cat:failures", sid, "berisi");
      addEdge(comp || m, sid, "punya temuan prediktif", r);
    });
    corrective.slice(0, 50).forEach((r, i) => {
      const m = machineNode(r), label = text(first(r, ["Corrective Action", "Problem", "Description"])) || "Corrective " + i;
      const id = "corrective:" + idPart(text(first(r, ["ID"])) || label + "-" + i);
      addNode(id, label.slice(0, 90), "corrective_action", r, SHEETS.corrective);
      addEdge("cat:knowledge", id, "berisi");
      if (m) addEdge(m, id, "punya laporan perbaikan", r);
      const root = text(first(r, ["Root Cause"]));
      if (root) {
        const sid = "cause:" + idPart(root);
        addNode(sid, root.slice(0, 80), "root_cause", r, SHEETS.corrective);
        addEdge("cat:failures", sid, "berisi");
        addEdge(id, sid, "menangani penyebab", r);
      }
    });
    rca.slice(0, 50).forEach((r, i) => {
      const m = machineNode(r), rid = "rca:" + idPart(text(first(r, ["ID"])) || "rca-" + i);
      addNode(rid, text(first(r, ["Title", "Judul"])) || "RCA", "rca", r, SHEETS.rca);
      addEdge("cat:knowledge", rid, "berisi");
      if (m) addEdge(m, rid, "punya RCA", r);
    });
    kb.slice(0, 60).forEach((r, i) => {
      const type = /sop/i.test(lower(first(r, ["Kategori", "Source Type", "Judul"]))) ? "sop" : /manual/i.test(lower(first(r, ["Kategori", "Source Type", "Judul"]))) ? "manual" : "knowledge";
      const kid = type + ":" + idPart(text(first(r, ["ID"])) || "kb-" + i);
      addNode(kid, text(first(r, ["Judul", "Title"])) || type, type, r, SHEETS.kb);
      addEdge("cat:knowledge", kid, "berisi");
      const m = machineNode(r);
      if (m) addEdge(m, kid, "punya panduan", r);
    });
    stock.slice(0, 70).forEach((r) => {
      const p = partNode(r);
      const m = machineNode(r);
      if (m && p) addEdge(m, p, "terkait sparepart", r);
    });
    eta.slice(0, 70).forEach((r, i) => {
      const p = partNode(r);
      if (!p) return;
      const vendor = text(first(r, ["Vendor", "Supplier"]));
      if (vendor) {
        const vid = "vendor:" + idPart(vendor);
        addNode(vid, vendor, "vendor", { vendor }, SHEETS.sparepartEta);
        addEdge("cat:supply", vid, "berisi");
        addEdge(p, vid, "dipasok oleh", r);
      }
      const po = text(first(r, ["Nomor PO", "PO ID", "PO", "Purchase Order"]));
      if (po) {
        const poid = "po:" + idPart(po);
        addNode(poid, "PO " + po, "po", r, SHEETS.sparepartEta);
        addEdge("cat:supply", poid, "berisi");
        addEdge(poid, p, "memesan", r);
        if (vendor) addEdge(poid, "vendor:" + idPart(vendor), "dari vendor", r);
      }
    });
    projects.slice(0, 35).forEach((r, i) => {
      const id = "project:" + idPart(text(first(r, ["ID", "Nomor Project"])) || "project-" + i);
      addNode(id, text(first(r, ["Judul", "Nama Project"])) || "Project", "project", r, SHEETS.project);
      addEdge("cat:projects", id, "berisi");
      const m = machineNode(r);
      if (m) addEdge(id, m, "menargetkan", r);
      const costVal = first(r, ["Actual Cost", "Budget"], "");
      if (costVal !== "" && costVal !== null && costVal !== void 0) {
        const cid = "cost:" + idPart(id);
        addNode(cid, "Project cost " + String(costVal), "cost", { budget: first(r, ["Budget"]), actual: first(r, ["Actual Cost"]) }, SHEETS.project);
        addEdge("cat:supply", cid, "berisi");
        addEdge(id, cid, "punya biaya", r);
      }
    });
    kaizens.slice(0, 35).forEach((r, i) => {
      const id = "kaizen:" + idPart(text(first(r, ["ID"])) || "kaizen-" + i);
      addNode(id, text(first(r, ["Tema", "Judul"])) || "Kaizen", "kaizen", r, SHEETS.kaizen);
      addEdge("cat:projects", id, "berisi");
      const m = machineNode(r);
      if (m) addEdge(id, m, "menargetkan", r);
    });
    sgas.slice(0, 30).forEach((r, i) => {
      const id = "sga:" + idPart(text(first(r, ["ID"])) || "sga-" + i);
      addNode(id, text(first(r, ["Tema", "Nama Tim"])) || "SGA", "sga", r, SHEETS.sga);
      addEdge("cat:projects", id, "berisi");
      const m = machineNode(r);
      if (m) addEdge(id, m, "menargetkan", r);
    });
    kpis.slice(0, 35).forEach((r, i) => {
      const label = text(r.name) || "KPI " + i, id = "kpi:" + idPart(label + "-" + i);
      const meta = {
        name: label,
        latestPeriod: r.latestPeriod || "",
        actual: r.actual,
        target: r.target,
        status: r.status || "",
        story: r.story || "",
        sourceTruthStart: "2026-09-01"
      };
      addNode(id, label, "kpi", meta, "KPI_SEJAK_2026-09-01");
      addEdge("cat:kpi", id, "berisi");
    });
    energy.slice(0, 25).forEach((r, i) => {
      const label = text(first(r, ["Jenis", "Parameter", "Metric"])) || "Energy " + i, id = "energy:" + idPart((first(r, ["Area"]) || "") + "|" + label + "|" + i);
      addNode(id, label, "energy", r, SHEETS.energy);
      addEdge("cat:energy", id, "berisi");
    });
    ipal.slice(0, 25).forEach((r, i) => {
      const label = text(first(r, ["OutletLabel", "Bulan", "Parameter"])) || "IPAL " + i, id = "ipal:" + idPart(label + "-" + i);
      addNode(id, label, "ipal", r, SHEETS.ipal);
      addEdge("cat:ipal", id, "berisi");
    });
    const selected = nodes.slice(0, 600), selectedIds = new Set(selected.map((n) => n.id));
    const selectedEdges = edges.filter((e) => selectedIds.has(e.from) && selectedIds.has(e.to)).slice(0, 1200);
    return { ok: true, data: {
      generatedAt: nowIso(),
      nodes: selected,
      edges: selectedEdges,
      limits: { nodes: 600, edges: 1200 },
      source: "OMODOS_SEJAK_1_SEPTEMBER_2026",
      logicVersion: "v4-factory-brain-4",
      domains: { machines: machineRows.length, logbook: log.length, predictive: pred.length, rca: rca.length, corrective: corrective.length, knowledge: kb.length, stock: stock.length, eta: eta.length, projects: projects.length, kaizen: kaizens.length, sga: sgas.length, kpi: kpis.length, energy: energy.length, ipal: ipal.length },
      lineage: {
        sourceOfTruth: "OMODOS_EXISTING_SEJAK_2026-09-01",
        operationalWrites: "NONE",
        historicalCutoff: "2026-09-01T00:00:00+07:00",
        currentReferenceExceptions: [SHEETS.machines, SHEETS.stock],
        rule: "Node historis wajib bertanggal/periode mulai 1 September 2026. Master mesin dan stok saat ini hanya dipakai sebagai referensi kondisi sekarang."
      }
    } };
  }
  __name(getFactoryBrain, "getFactoryBrain");
  function getMachineGraph(body) {
    const q = text(body.machine || body.machineCode || body.id);
    if (!q) return { ok: false, error: "VALIDATION_ERROR: machine wajib" };
    const graph = getFactoryBrain({ maxMachines: 100 }).data;
    const center = (graph.nodes || []).find((n) => n.type === "machine" && machinePhraseMatch(n.label, q));
    if (!center) return { ok: true, data: { machine: q, nodes: [], edges: [], label: "NOT AVAILABLE" } };
    const keep = /* @__PURE__ */ new Set([center.id]);
    for (let depth = 0; depth < 2; depth++) {
      (graph.edges || []).forEach((e) => {
        if (keep.has(e.from)) keep.add(e.to);
        if (keep.has(e.to)) keep.add(e.from);
      });
    }
    const nodes = (graph.nodes || []).filter((n) => keep.has(n.id)).slice(0, 160), ids = new Set(nodes.map((n) => n.id));
    const edges = (graph.edges || []).filter((e) => ids.has(e.from) && ids.has(e.to)).slice(0, 320);
    return { ok: true, data: { machine: center.label, nodes, edges, label: "DERIVED", generatedAt: nowIso() } };
  }
  __name(getMachineGraph, "getMachineGraph");
  function getFailureMemory(body) {
    const q = text(body.query || body.problem || body.description);
    const machine = text(body.machine || body.machineCode);
    const source = [
      ...sourceRows(SHEETS.logbook).map((r) => ({ sheet: SHEETS.logbook, record: r })),
      ...sourceRows(SHEETS.breakdown).map((r) => ({ sheet: SHEETS.breakdown, record: r })),
      ...sourceRows(SHEETS.corrective).map((r) => ({ sheet: SHEETS.corrective, record: r })),
      ...sourceRows(SHEETS.rca).map((r) => ({ sheet: SHEETS.rca, record: r }))
    ];
    if (!q) {
      const recurring = aggregateMachines(standardRange(body || {})).filter((m) => m.recurring > 0).slice(0, 30);
      return { ok: true, data: { mode: "RECURRING_PATTERNS", query: "", machine, patterns: recurring, confidence: recurring.length ? "medium" : "low" } };
    }
    const scored = [];
    source.forEach((x) => {
      if (machine && !matchesMachine(x.record, machine)) return;
      const d = description(x.record);
      if (!d) return;
      const sim = textSimilarity(q, d);
      if (sim <= 0) return;
      const machineBonus = machine && matchesMachine(x.record, machine) ? 0.2 : 0;
      scored.push({ sheet: x.sheet, score: Math.min(1, sim + machineBonus), machine: machineCode(x.record) || machineName(x.record), description: d, date: dateValue(x.record) ? new Date(dateValue(x.record)).toISOString() : "", status: first(x.record, ["Status", "Severity", "Prioritas"]), record: cleanRecord(x.record, 12) });
    });
    scored.sort((a, b) => b.score - a.score || Date.parse(b.date || 0) - Date.parse(a.date || 0));
    const hits = scored.slice(0, 25);
    return { ok: true, data: { mode: "HISTORICAL_SIMILARITY", query: q, machine, hits, confidence: hits.length >= 5 && hits[0]?.score >= 0.5 ? "medium" : hits.length ? "low-medium" : "low", note: "Text similarity is evidence retrieval, not proof of identical root cause." } };
  }
  __name(getFailureMemory, "getFailureMemory");
  function getExpertFinder(body) {
    const machine = text(body.machine || body.machineCode), q = text(body.query || body.problem);
    const hard = sourceRows(SHEETS.peopleHard), hardCount = /* @__PURE__ */ new Map();
    hard.forEach((r) => {
      const p = text(first(r, ["Nama", "Nama Karyawan", "Nama Personil"]));
      if (p) hardCount.set(p, (hardCount.get(p) || 0) + 1);
    });
    const people = /* @__PURE__ */ new Map();
    const evidence = [...sourceRows(SHEETS.logbook), ...sourceRows(SHEETS.rca), ...sourceRows(SHEETS.corrective)];
    evidence.forEach((r) => {
      if (machine && !matchesMachine(r, machine)) return;
      const d = description(r), sim = q ? textSimilarity(q, d) : 0;
      if (q && sim <= 0) return;
      const p = text(first(r, ["Nama Pelapor", "Technician", "PIC", "Pelapor", "Teknisi", "Author", "Created By", "CreatedBy"]));
      if (!p) return;
      const cur = people.get(p) || { name: p, events: 0, machineEvents: 0, similarityEvidence: 0, bestSimilarity: 0, lastSeen: 0 };
      cur.events++;
      if (machine) cur.machineEvents++;
      if (sim > 0) cur.similarityEvidence++;
      cur.bestSimilarity = Math.max(cur.bestSimilarity, sim);
      cur.lastSeen = Math.max(cur.lastSeen, dateValue(r) || 0);
      people.set(p, cur);
    });
    const ranked = [...people.values()].map((p) => ({ ...p, hardSkillAssessments: hardCount.get(p.name) || 0, score: p.events + p.machineEvents * 2 + p.similarityEvidence * 3 + Math.round(p.bestSimilarity * 5) })).sort((a, b) => b.score - a.score || b.lastSeen - a.lastSeen).slice(0, 30);
    return { ok: true, data: { machine, query: q, experts: ranked, confidence: ranked.length ? "medium" : "low", note: "Ranking reflects recorded OMODOS involvement/evidence, not an employment performance rating." } };
  }
  __name(getExpertFinder, "getExpertFinder");
  function getBlackBox(body) {
    const range = standardRange(body || {}), scope = scopeContext(body || {});
    const defs = [
      [SHEETS.logbook, sourceRows(SHEETS.logbook)],
      [SHEETS.breakdown, sourceRows(SHEETS.breakdown)],
      [SHEETS.predictive, sourceRows(SHEETS.predictive)],
      [SHEETS.rca, sourceRows(SHEETS.rca)],
      [SHEETS.corrective, sourceRows(SHEETS.corrective)]
    ];
    const events = [];
    defs.forEach(([source, data]) => {
      within(data, range.since, range.until).filter(scope.record).forEach((r) => {
        const t = dateValue(r);
        if (!t) return;
        events.push({
          source,
          timestamp: new Date(t).toISOString(),
          machine: machineCode(r) || machineName(r) || "",
          event: description(r) || text(first(r, ["Title", "Judul", "Problem", "Root Cause"])) || "Recorded maintenance event",
          status: text(first(r, ["Status", "Severity", "Prioritas"])),
          priority: text(first(r, ["Prioritas", "Severity"])),
          downtimeMinutes: Math.round(downtimeMinutes(r)),
          recordId: text(first(r, ["ID", "TransactionID", "Entry ID"])),
          record: cleanRecord(r, 10)
        });
      });
    });
    events.sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));
    const bySource = {};
    events.forEach((e) => {
      bySource[e.source] = (bySource[e.source] || 0) + 1;
    });
    const machineCounts = /* @__PURE__ */ new Map();
    events.forEach((e) => {
      if (e.machine) machineCounts.set(e.machine, (machineCounts.get(e.machine) || 0) + 1);
    });
    return { ok: true, data: {
      generatedAt: nowIso(),
      logicVersion: "v4-black-box-1",
      range: { since: new Date(range.since).toISOString(), until: new Date(range.until).toISOString() },
      appliedScope: { machine: scope.machine || "", area: scope.area || "" },
      summary: {
        events: events.length,
        downtimeMinutes: events.reduce((n, e) => n + e.downtimeMinutes, 0),
        sources: bySource,
        affectedMachines: machineCounts.size
      },
      topMachines: [...machineCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20).map(([machine, eventCount]) => ({ machine, eventCount })),
      events: events.slice(0, 300),
      lineage: { sourceOfTruth: "EXISTING_OMODOS", operationalWrites: "NONE" },
      note: "Chronological maintenance event recorder reconstructed from timestamped existing sources. It does not claim unrecorded machine telemetry."
    } };
  }
  __name(getBlackBox, "getBlackBox");
  function getTimeMachine(body) {
    const at = timeMs(body.at || body.timestamp, NaN);
    if (!Number.isFinite(at)) return { ok: false, error: "VALIDATION_ERROR: waktu wajib diisi" };
    if (at < SOURCE_TRUTH_START_MS) return { ok: false, error: "VALIDATION_ERROR: OMODOS 4.0 hanya menggunakan data mulai 1 September 2026" };
    const shift = text(body.shift);
    const before = /* @__PURE__ */ __name((sheet, mode) => {
      let data = sourceRows(sheet).filter((r) => dateValue(r) && dateValue(r) <= at);
      if (shift && data.some((r) => text(first(r, ["Shift"])))) data = data.filter((r) => !text(first(r, ["Shift"])) || text(first(r, ["Shift"])) === shift);
      if (mode === "machine" && body.machine) data = data.filter((r) => matchesMachine(r, body.machine));
      return data.sort((x, y) => dateValue(y) - dateValue(x));
    }, "before");
    const log = before(SHEETS.logbook, "machine"), breakdown = before(SHEETS.breakdown, "machine"), predictive = before(SHEETS.predictive, "machine");
    const eta = before(SHEETS.sparepartEta), opname = before(SHEETS.sparepartOpname), warehouse = before(SHEETS.sparepartWarehouse);
    const project = before(SHEETS.project, "machine"), personnel = sourceRows(SHEETS.personnel);
    const kpi = strictDatedRows(SHEETS.kpiYtd).filter((r) => dateValue(r) && dateValue(r) <= at).filter((r) => !body.machine || matchesMachine(r, body.machine)).sort((x, y) => dateValue(y) - dateValue(x));
    const activeProblems = [...log, ...breakdown].filter((r) => !isClosed(r)).sort((x, y) => dateValue(y) - dateValue(x)).slice(0, 30);
    const machineEvents = [...log, ...breakdown, ...predictive].sort((x, y) => dateValue(y) - dateValue(x));
    const machineState = /* @__PURE__ */ new Map();
    machineEvents.forEach((r) => {
      const key = machineCode(r) || machineName(r);
      if (!key || machineState.has(lower(key))) return;
      machineState.set(lower(key), { machine: key, lastEvent: cleanRecord(r, 12), derivedStatus: isClosed(r) ? "LAST_RECORDED_EVENT_CLOSED" : "LAST_RECORDED_EVENT_OPEN", lastAt: dateValue(r) ? new Date(dateValue(r)).toISOString() : "" });
    });
    const sparepartState = {
      label: eta.length || opname.length || warehouse.length ? "RECORDED" : "NOT AVAILABLE",
      eta: eta.slice(0, 30).map((r) => cleanRecord(r, 12)),
      opname: opname.slice(0, 30).map((r) => cleanRecord(r, 12)),
      warehouse: warehouse.slice(0, 30).map((r) => cleanRecord(r, 12)),
      currentStockAtHistoricalTime: { label: "NOT AVAILABLE", reason: "Current Stock_Sparepart rows do not provide a trustworthy historical snapshot timestamp." }
    };
    const peopleNames = new Set(log.map((r) => text(first(r, ["Nama Pelapor", "Technician", "PIC", "Pelapor", "Teknisi"]))).filter(Boolean));
    const peopleContext = personnel.filter((r) => peopleNames.has(text(first(r, ["Nama", "Nama Karyawan", "Nama Personil", "Name"])))).slice(0, 50).map((r) => cleanRecord(r, 14));
    const snapshots = {
      logbook: { label: log.length ? "RECORDED" : "NOT AVAILABLE", recordsUntilTime: log.length, latest: log.slice(0, 30).map((r) => cleanRecord(r, 12)) },
      breakdown: { label: breakdown.length ? "RECORDED" : "NOT AVAILABLE", recordsUntilTime: breakdown.length, latest: breakdown.slice(0, 30).map((r) => cleanRecord(r, 12)) },
      predictive: { label: predictive.length ? "RECORDED" : "NOT AVAILABLE", recordsUntilTime: predictive.length, latest: predictive.slice(0, 30).map((r) => cleanRecord(r, 12)) },
      sparepart: sparepartState,
      project: { label: project.length ? "RECORDED" : "NOT AVAILABLE", recordsUntilTime: project.length, latest: project.slice(0, 30).map((r) => cleanRecord(r, 12)) },
      personnel: { label: peopleContext.length ? "DERIVED" : "NOT AVAILABLE", recordsUntilTime: peopleContext.length, latest: peopleContext },
      kpi: { label: kpi.length ? "RECORDED" : "NOT AVAILABLE", recordsUntilTime: kpi.length, latest: kpi.slice(0, 30).map((r) => cleanRecord(r, 12)) }
    };
    return { ok: true, data: {
      at: new Date(at).toISOString(),
      requestedShift: shift || "",
      requestedMachine: text(body.machine || ""),
      snapshots,
      activeProblems: { label: "DERIVED", records: activeProblems.map((r) => cleanRecord(r, 12)) },
      machineStatus: { label: machineState.size ? "DERIVED" : "NOT AVAILABLE", records: [...machineState.values()].slice(0, 100) },
      downtime: { label: machineEvents.some((r) => downtimeMinutes(r) > 0) ? "DERIVED" : "NOT AVAILABLE", totalMinutes: Math.round(machineEvents.reduce((n, r) => n + downtimeMinutes(r), 0)), sourceEvents: machineEvents.filter((r) => downtimeMinutes(r) > 0).length },
      note: "Best-known state from records with timestamps at or before the selected moment. Current-only values are not projected backward. Missing historical values remain NOT AVAILABLE.",
      lineage: { sourceOfTruth: "EXISTING_OMODOS", operationalWrites: "NONE", logicVersion: "v4-time-machine-2" }
    } };
  }
  __name(getTimeMachine, "getTimeMachine");
  function ensureSheet(name, headers) {
    let sh = ss().getSheetByName(name);
    if (!sh) {
      sh = ss().insertSheet(name);
      sh.getRange(1, 1, 1, headers.length).setValues([headers]);
    }
    return sh;
  }
  __name(ensureSheet, "ensureSheet");
  const WAR_HEADERS = ["ID", "Title", "Machine", "Severity", "Status", "StartedAt", "UpdatedAt", "Owner", "NextCheckpoint", "Summary", "CreatedBy"];
  const WAR_EVENT_HEADERS = ["ID", "WarRoomID", "Timestamp", "Type", "Message", "Actor", "DataJSON"];
  function createWarRoom(body) {
    const title = text(body.title), machine = text(body.machine);
    if (!title || !machine) return { ok: false, error: "VALIDATION_ERROR: title dan machine wajib" };
    const id = uuid(), ts = nowIso();
    ensureSheet("V4_War_Room", WAR_HEADERS).appendRow([id, title, machine, text(body.severity) || "P1", "OPEN", ts, ts, text(body.owner), text(body.nextCheckpoint), text(body.summary), text(body.actor)]);
    ensureSheet("V4_War_Room_Event", WAR_EVENT_HEADERS).appendRow([uuid(), id, ts, "created", "War Room created", text(body.actor), JSON.stringify({ severity: body.severity || "P1" })]);
    return { ok: true, data: { id, title, machine, status: "OPEN", startedAt: ts } };
  }
  __name(createWarRoom, "createWarRoom");
  function updateWarRoom(body) {
    const id = text(body.id || body.warRoomId);
    if (!id) return { ok: false, error: "VALIDATION_ERROR: id wajib" };
    const sh = ensureSheet("V4_War_Room", WAR_HEADERS), values = sh.getDataRange().getValues(), h = values[0], idCol = h.indexOf("ID");
    let row = -1;
    for (let i = 1; i < values.length; i++) if (text(values[i][idCol]) === id) {
      row = i + 1;
      break;
    }
    if (row < 0) return { ok: false, error: "NOT_FOUND: War Room" };
    const before = {};
    ["Status", "Owner", "NextCheckpoint", "Summary"].forEach((k) => {
      const c = h.indexOf(k);
      if (c >= 0) before[k] = values[row - 1][c];
    });
    const patch = { Status: body.status, Owner: body.owner, NextCheckpoint: body.nextCheckpoint, Summary: body.summary, UpdatedAt: nowIso() };
    Object.entries(patch).forEach(([k, v]) => {
      if (v === void 0) return;
      const c = h.indexOf(k);
      if (c >= 0) sh.getRange(row, c + 1).setValue(v);
    });
    const changed = {};
    ["Status", "Owner", "NextCheckpoint", "Summary"].forEach((k) => {
      if (patch[k] !== void 0 && String(patch[k]) !== String(before[k] ?? "")) changed[k] = { before: before[k] ?? "", after: patch[k] };
    });
    if (body.message || Object.keys(changed).length) {
      ensureSheet("V4_War_Room_Event", WAR_EVENT_HEADERS).appendRow([
        uuid(),
        id,
        nowIso(),
        text(body.type) || (Object.keys(changed).length ? "state-change" : "update"),
        text(body.message) || (Object.keys(changed).length ? "War Room state updated" : "Update"),
        text(body.actor),
        JSON.stringify({ changes: changed, data: body.data || {} })
      ]);
    }
    return { ok: true, data: { id, updatedAt: patch.UpdatedAt, changes: changed } };
  }
  __name(updateWarRoom, "updateWarRoom");
  function getWarRoom(body) {
    const wars = rows("V4_War_Room").sort((a, b) => dateValue(b) - dateValue(a));
    const events = rows("V4_War_Room_Event").sort((a, b) => dateValue(b) - dateValue(a));
    const id = text(body.id || body.warRoomId);
    if (id) {
      const war = wars.find((r) => text(r.ID) === id);
      if (!war) return { ok: true, data: { war: null, events: [], context: null } };
      const machine = text(war.Machine), title = text(war.Title);
      const passport = getMachinePassport({ machine }).data;
      const memory = getFailureMemory({ machine, query: title }).data;
      const expert = getExpertFinder({ machine, query: title }).data;
      const stock = sourceRows(SHEETS.stock).filter((r) => matchesMachine(r, machine)).slice(0, 30);
      const partNames = new Set(stock.map((r) => lower(first(r, ["Nama Material", "Material", "Nama Sparepart", "Description"]))).filter(Boolean));
      const eta = sourceRows(SHEETS.sparepartEta).filter((r) => matchesMachine(r, machine) || partNames.has(lower(first(r, ["Nama Material", "Material", "Nama Sparepart", "Description"])))).slice(0, 30);
      const rca = sourceRows(SHEETS.rca).filter((r) => matchesMachine(r, machine)).sort((x, y) => dateValue(y) - dateValue(x)).slice(0, 12);
      const knowledge = sourceRows(SHEETS.kb).filter((r) => matchesMachine(r, machine)).sort((x, y) => dateValue(y) - dateValue(x)).slice(0, 20);
      const manuals = knowledge.filter((r) => /manual|sop|instruksi|instruction/.test(lower(first(r, ["Kategori", "Source Type", "Judul", "Title"])))).slice(0, 10);
      const machineEvents = sourceRows(SHEETS.logbook).filter((r) => matchesMachine(r, machine)).sort((x, y) => dateValue(y) - dateValue(x)).slice(0, 30);
      const files = [];
      machineEvents.forEach((r) => Object.entries(r).forEach(([k, v]) => {
        if (/file|foto|photo|video|lampiran|attachment/i.test(k) && v && String(v).trim()) files.push({ source: SHEETS.logbook, field: k, value: typeof v === "string" && v.length > 600 ? v.slice(0, 600) + "\u2026" : v, recordId: first(r, ["ID"]) });
      }));
      const warEvents = events.filter((r) => text(r.WarRoomID) === id).slice(0, 200);
      const decisions = warEvents.filter((r) => /decision|keputusan/i.test(text(r.Type) + " " + text(r.Message)));
      const actions = warEvents.filter((r) => /action|aksi|task/i.test(text(r.Type) + " " + text(r.Message)));
      const similar = (memory.hits || []).slice(0, 8);
      return { ok: true, data: {
        war: cleanRecord(war, 20),
        events: warEvents.map((r) => cleanRecord(r, 12)),
        latestUpdate: warEvents[0] ? cleanRecord(warEvents[0], 12) : null,
        context: {
          currentCondition: passport.currentCondition,
          reliability: passport.reliability,
          openIssues: passport.currentCondition && passport.currentCondition.openIssues || [],
          experts: (expert.experts || []).slice(0, 8),
          similarCases: similar,
          candidateRootCauseEvidence: similar.slice(0, 5).map((x) => ({ description: x.description, score: x.score, source: x.sheet })),
          sparepart: { stock: stock.map((r) => cleanRecord(r, 12)), eta: eta.map((r) => cleanRecord(r, 12)) },
          rca: rca.map((r) => cleanRecord(r, 12)),
          knowledge: knowledge.map((r) => cleanRecord(r, 12)),
          manuals: manuals.map((r) => cleanRecord(r, 12)),
          files: files.slice(0, 30),
          decisions: decisions.map((r) => cleanRecord(r, 12)),
          actions: actions.map((r) => cleanRecord(r, 12))
        },
        disclaimer: "Candidate causes and similar cases are evidence for human review, not confirmed root cause."
      } };
    }
    return { ok: true, data: { wars: wars.slice(0, 100).map((r) => cleanRecord(r, 20)) } };
  }
  __name(getWarRoom, "getWarRoom");
  function getKnowledgeCandidates(body) {
    const scope = scopeContext(body || {}), log = sourceRows(SHEETS.logbook).filter(scope.record), rca = sourceRows(SHEETS.rca).filter(scope.record), kb = sourceRows(SHEETS.kb);
    const known = kb.map((r) => ({ record: r, text: lower([first(r, ["Judul", "Title"]), first(r, ["Konten", "Content"]), machineCode(r), machineName(r)].join(" ")) }));
    const groups = /* @__PURE__ */ new Map();
    log.filter((r) => isClosed(r) && text(first(r, ["Tindakan Perbaikan", "Corrective Action"]))).forEach((r) => {
      const machine = machineCode(r) || machineName(r), problem = description(r), action = text(first(r, ["Tindakan Perbaikan", "Corrective Action"]));
      if (!problem || !action) return;
      const key = lower(machine) + "|" + words(problem).sort().slice(0, 7).join("|");
      const cur = groups.get(key) || { machine, problem, actions: /* @__PURE__ */ new Map(), count: 0, sourceIds: [], latest: 0 };
      cur.count++;
      cur.actions.set(action, (cur.actions.get(action) || 0) + 1);
      const id = first(r, ["ID", "TransactionID"]);
      if (id && cur.sourceIds.length < 20) cur.sourceIds.push(id);
      cur.latest = Math.max(cur.latest, dateValue(r) || 0);
      groups.set(key, cur);
    });
    const candidates = [...groups.values()].filter((x) => x.count >= 2).map((x) => {
      const top = [...x.actions.entries()].sort((a, b) => b[1] - a[1])[0] || ["", 0];
      const corpus = lower(x.machine + " " + x.problem + " " + top[0]);
      const corpusWords = words(corpus).filter((w) => w.length > 4);
      const hasMatch = known.some((k) => matchesMachine(k.record, x.machine) && corpusWords.some((w) => k.text.includes(w)));
      return { machine: x.machine, problem: x.problem, recurrence: x.count, mostRecordedAction: top[0], actionFrequency: top[1], sourceIds: x.sourceIds, latest: x.latest ? new Date(x.latest).toISOString() : "", existingKnowledgePossibleMatch: hasMatch, label: hasMatch ? "REVIEW_EXISTING_KB_FIRST" : "KNOWLEDGE_DRAFT_CANDIDATE" };
    }).sort((a, b) => b.recurrence - a.recurrence).slice(0, 50);
    const rcaCandidates = rca.filter((r) => text(first(r, ["Title", "Judul"]))).slice(0, 30).map((r) => ({ machine: machineCode(r) || machineName(r), problem: first(r, ["Title", "Judul"]), recurrence: 1, sourceIds: [first(r, ["ID"])], latest: dateValue(r) ? new Date(dateValue(r)).toISOString() : "", existingKnowledgePossibleMatch: false, label: "RCA_REVIEW_CANDIDATE" }));
    return { ok: true, data: { generatedAt: nowIso(), candidates: [...candidates, ...rcaCandidates].slice(0, 60), existingKnowledgeRecords: kb.length, autoWrite: "NONE", draftAction: "v4.aiAsk purpose=manual/ask", lineage: { sourceOfTruth: "EXISTING_OMODOS", operationalWrites: "NONE" }, note: "Candidates must be reviewed and saved through the official Knowledge Base workflow. Existing KB is checked first to reduce duplication." } };
  }
  __name(getKnowledgeCandidates, "getKnowledgeCandidates");
  function ask(body) {
    const q = lower(body.query || body.question);
    if (!q) return { ok: false, error: "VALIDATION_ERROR: query wajib" };
    const scopedMachine = text(body.machine || body.machineCode);
    const terms = q.split(/\s+/).filter((x) => x.length > 2).slice(0, 12);
    const sources = [SHEETS.logbook, SHEETS.breakdown, SHEETS.predictive, SHEETS.rca, SHEETS.kb, SHEETS.project, SHEETS.kaizen, SHEETS.stock];
    const hits = [];
    sources.forEach((sheet) => sourceRows(sheet).forEach((r) => {
      if (scopedMachine && !matchesMachine(r, scopedMachine)) return;
      const hay = lower(Object.values(r).filter((v) => typeof v === "string" || typeof v === "number").join(" "));
      const score = terms.reduce((n, t) => n + (hay.includes(t) ? 1 : 0), 0);
      if (score) hits.push({ sheet, score, machine: machineCode(r) || machineName(r), record: cleanRecord(r, 12) });
    }));
    hits.sort((a, b) => b.score - a.score || dateValue(b.record) - dateValue(a.record));
    return { ok: true, data: { mode: "DETERMINISTIC_EVIDENCE_SEARCH", query: body.query || body.question, machine: scopedMachine, answer: hits.length ? "Ditemukan " + hits.length + " record yang relevan" + (scopedMachine ? " untuk mesin " + scopedMachine : "") + ". Tinjau evidence berikut; sistem tidak mengubah data operasional." : "Belum ditemukan evidence yang cukup" + (scopedMachine ? " untuk mesin " + scopedMachine : "") + " pada data OMODOS saat ini.", confidence: hits.length >= 5 ? "medium" : hits.length ? "low-medium" : "low", evidence: hits.slice(0, 25), assumptions: [scopedMachine ? "Keyword similarity restricted to the selected machine" : "Keyword similarity across current OMODOS source records"], recommendation: hits.length ? "Review evidence dan buka record sumber sebelum mengambil keputusan." : "Perlu data atau kata kunci yang lebih spesifik." } };
  }
  __name(ask, "ask");
  function getAccess(body) {
    return { ok: true, data: { enabled: true, role: "Superadmin", actor: text(body.actor), verifiedAt: nowIso(), source: "SERVER_SESSION_AND_ROLE", sourceTruth: sourceTruthInfo() } };
  }
  __name(getAccess, "getAccess");
  const handlers = {
    "v4.getAccess": getAccess,
    "v4.getOverview": getOverview,
    "v4.getWhatChanged": getWhatChanged,
    "v4.getMachineHealth": getMachineHealth,
    "v4.getMachinePassport": getMachinePassport,
    "v4.getMachineGraph": getMachineGraph,
    "v4.getFactoryBrain": getFactoryBrain,
    "v4.getFailureMemory": getFailureMemory,
    "v4.getPredictiveRisk": getPredictiveRisk,
    "v4.getFieldMission": getFieldMission,
    "v4.getSparepartRisk": getSparepartRisk,
    "v4.getReliability": getReliability,
    "v4.getKpiStory": getKpiStory,
    "v4.getPeopleSkillGraph": getPeopleSkillGraph,
    "v4.getExpertFinder": getExpertFinder,
    "v4.getExperiencePassport": getExperiencePassport,
    "v4.getImprovement": getImprovement,
    "v4.findSimilarImprovement": findSimilarImprovement,
    "v4.getBrief": getBrief,
    "v4.runScenario": runScenario,
    "v4.saveScenario": saveScenario,
    "v4.getScenarios": getScenarios,
    "v4.ask": ask,
    "v4.getKnowledgeCandidates": getKnowledgeCandidates,
    "v4.getTimeMachine": getTimeMachine,
    "v4.getBlackBox": getBlackBox,
    "v4.createWarRoom": createWarRoom,
    "v4.updateWarRoom": updateWarRoom,
    "v4.getWarRoom": getWarRoom
  };
  return {
    actions: Object.keys(handlers),
    dispatch(body) {
      const fn = handlers[text(body && body.action)];
      if (!fn) return json2({ ok: false, error: "UNKNOWN_ACTION: " + text(body && body.action) });
      try {
        const out = fn(body || {});
        if (out && out.ok && out.data && typeof out.data === "object" && !Array.isArray(out.data) && !out.data.sourceTruth) out.data.sourceTruth = sourceTruthInfo();
        return json2(out);
      } catch (err) {
        return json2({ ok: false, error: "SERVER_ERROR: " + (err && err.message ? err.message : String(err)) });
      }
    }
  };
}
__name(createOmodos4, "createOmodos4");

// src/backend.mjs
function createBackend(services, env = {}) {
  const { SpreadsheetApp, PropertiesService, CacheService, LockService, Utilities, DriveApp, ContentService, Session, UrlFetchApp, Logger } = services;
  const OMODOS4 = createOmodos4({ SpreadsheetApp, Utilities, ContentService, Session });
  const ENTERPRISE_VERSION = "2.0.0-enterprise";
  const RBAC_GITHUB_BUILD = "RBAC-GITHUB-2026-09-04-v2";
  const SOT_CUTOFF_DATE = "2026-09-01";
  const SOT_POLICY = { cutoff: SOT_CUTOFF_DATE, preLaunchLabel: "PRE-LAUNCH DATA", officialLabel: "OFFICIAL OMODOS DATA" };
  const CACHE_TTL_SECONDS = 600;
  const SESSION_TTL_HOURS = 24;
  const PBKDF2_ITERATIONS = 8e3;
  const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
  const ALLOWED_MIME_PREFIX = ["image/", "video/", "audio/", "application/pdf", "application/vnd", "text/plain", "text/csv"];
  const TX_LOG_SHEET = "Transaction_Log";
  const AUDIT_LOG_SHEET = "Audit_Log";
  const SHEET_LOGBOOK = "Logbook";
  const SHEET_MESIN = "Master_Mesin";
  const SHEET_PATROL_TEMPLATE = "Patrol_Checklist_Template";
  const SHEET_PERSONIL = "Master_Personil";
  const SHEET_REPORTS = "Reports";
  const SHEET_RCA = "RCA_Reports";
  const SHEET_KB = "Knowledge_Base";
  const SHEET_DOWNTIME_EM = "Downtime_EM";
  const SHEET_SPAREPART_LOKASI = "Sparepart_Lokasi";
  const SHEET_SPAREPART_ETA = "Sparepart_ETA";
  const SHEET_SPAREPART_OPNAME = "Sparepart_Opname";
  const SHEET_KPI_KERJA = "KPI_Kertas_Kerja";
  const SHEET_KPI_DEPARTMENT_YTD = "KPI_Department_YTD";
  const SHEET_KPI_DEPARTMENT_SOURCE = "KPI_Department_Source";
  const SHEET_MACHINE_BREAKDOWN = "Machine_Breakdown_Detail";
  const SHEET_CORRECTIVE_REPORT = "Corrective_Report";
  const SHEET_ENERGY_UTILITY = "Energy_Utility_ENPI";
  const SHEET_STOCK_SPAREPART = "Stock_Sparepart";
  const SHEET_USERS = "Users";
  const SHEET_SESSIONS = "Sessions";
  const SHEET_PERMISSIONS = "Role_Permissions";
  const SHEET_LC_PERMISSIONS = "Lc_Permissions";
  const SHEET_FEATURES = "Feature_Registry";
  const SHEET_PI_SOFTSKILL = "PI_Softskill_Assessment";
  const SHEET_PI_HARDSKILL = "PI_Hardskill_Assessment";
  const SHEET_PI_HARDSKILL_DETAIL = "PI_Hardskill_Assessment_Detail";
  const SHEET_PI_HARDSKILL_STANDARD = "PI_Hardskill_Standard";
  const SHEET_FACTORY_PROJECT = "Factory_Project";
  const SHEET_KAIZEN = "Kaizen";
  const SHEET_SGA = "SGA";
  const PROJECT_FOLDER_NAME = "Logbook Maintenance - Project Files";
  const SHEET_PI_PERSONNEL = "PI_Personnel_Master";
  const SHEET_RECORD_YTD = "Record_YTD";
  const SHEET_RUN_HOUR_COMPARISON = "Run_Hour_Comparison";
  const SHEET_ENERGY_COST_TOE = "Energy_Cost_TOE";
  const SHEET_SPAREPART_SAP = "Sparepart_SAP_Status";
  const SHEET_SPAREPART_WAREHOUSE = "Sparepart_Warehouse";
  const PREDICTIVE_SHEET_NAME = "Predictive_Maintenance";
  const IPAL_SHEET_NAME = "IPAL_Reports";
  const LOGBOOK_HEADERS = ["ID", "Timestamp Input", "Tanggal", "Waktu", "Shift", "Nama Pelapor", "Kode Mesin", "Nama Mesin", "Lokasi/Area", "Jenis Pekerjaan", "Prioritas", "Deskripsi Masalah", "Tindakan Perbaikan", "Spare Part Digunakan", "Status", "Jam Mulai", "Jam Selesai", "Downtime (menit)", "Lampiran (JSON)", "Catatan Tambahan", "Grouping Pekerjaan", "Grouping Team", "Nomor Notifikasi Pekerjaan", "Nama Unit", "Nama Material", "Material Number SAP", "Status Sparepart", "TransactionID", "CreatedBy", "DeletedAt", "DeletedBy", "DeleteReason", "UpdatedAt"];
  const REQUIRED_ENTRY_FIELDS = ["tanggal", "shift", "namaPelapor", "kodeMesin", "namaMesin", "jenisPekerjaan", "prioritas", "deskripsiMasalah", "tindakanPerbaikan", "status"];
  const MESIN_HEADERS = ["Kode Mesin", "Nama Mesin", "Lokasi/Area", "Kategori", "Spesifikasi Mesin", "Manual PDF URL", "Model", "Deskripsi Mesin", "Fungsi Mesin", "Link Manual/Referensi", "Keterangan Sumber"];
  const PERSONIL_HEADERS = ["Nama Personil", "Grouping Team", "Jabatan", "Foto URL"];
  const PI_PERSONNEL_HEADERS = ["ID Karyawan", "Nama", "Job Title", "Tanggal Lahir", "Grouping Team", "Foto URL"];
  const PATROL_TEMPLATE_HEADERS = ["ID", "Kode Mesin", "Nama Mesin", "Kategori", "Area/Sub Area", "Deskripsi Pemeriksaan", "Kondisi Standar", "Urutan"];
  const SPAREPART_LOKASI_HEADERS = ["Material Number SAP", "Nama Material", "Lokasi Gudang", "Harga Satuan", "Stock Qty", "Satuan"];
  const SPAREPART_ETA_HEADERS = ["ID", "Timestamp", "Nama Material", "Material Number SAP", "Nomor PO", "Vendor", "Qty", "Tanggal PO", "Estimasi ETA", "Status", "Tanggal Tiba", "Catatan"];
  const SPAREPART_OPNAME_HEADERS = ["ID", "Timestamp", "Tanggal", "Part No", "Nama Material", "Material Number SAP", "Stock Sistem", "Stock Fisik", "Selisih", "Lokasi Rak", "Catatan"];
  const SPAREPART_SAP_HEADERS = ["Entry ID", "Status", "SAP Doc No", "PIC", "Updated At"];
  const SPAREPART_WAREHOUSE_HEADERS = ["ID", "Timestamp", "PO ID", "Nomor PO", "Nama Material", "Qty Match", "Condition", "Warehouse Location", "SAP Updated", "Validator", "Validation Date"];
  const KPI_MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agust", "Sep", "Okt", "Nop", "Des"];
  const KPI_MONTH_HEADERS = KPI_MONTHS.reduce(function(a, b) {
    a.push("Target " + b, "Realisasi " + b);
    return a;
  }, []);
  const KPI_KERJA_HEADERS = ["ID", "Tahun", "Perspective", "Data Producer", "Divisi", "Department", "KPI", "Satuan", "Polaritas", "Rumus", "Periode Perhitungan", "Target Tahunan"].concat(KPI_MONTH_HEADERS, ["Aktual", "Status", "Catatan", "Source File", "Source Sheet", "Source Row", "Source Version", "Created At", "Updated At"]);
  const KPI_DEPARTMENT_YTD_HEADERS = KPI_KERJA_HEADERS.slice();
  const KPI_DEPARTMENT_SOURCE_HEADERS = ["Source Version", "Source File", "Sheet Name", "Row Number", "Data JSON", "Formula JSON", "Imported At"];
  const KPI_KERJA_DEFAULT_CATALOG = [
    { divisi: "Offset - Technical", kpi: "Machine Availability", satuan: "%", polaritas: "Maximize", rumus: "Operating Time / Planned Production Time \xD7 100%" },
    { divisi: "Offset - Technical", kpi: "Mean Time Between Failure (MTBF)", satuan: "Jam", polaritas: "Maximize", rumus: "Total Operating Time / Jumlah Failure" },
    { divisi: "Offset - Technical", kpi: "Mean Time To Repair (MTTR)", satuan: "Jam", polaritas: "Minimize", rumus: "Total Repair Time / Jumlah Repair" },
    { divisi: "Offset - Technical", kpi: "Breakdown Downtime", satuan: "Jam", polaritas: "Minimize", rumus: "Total Durasi Breakdown" },
    { divisi: "Offset - Technical", kpi: "Preventive Maintenance Compliance", satuan: "%", polaritas: "Maximize", rumus: "PM Selesai Tepat Waktu / PM Terjadwal \xD7 100%" },
    { divisi: "Offset - Technical", kpi: "Sparepart Readiness", satuan: "%", polaritas: "Maximize", rumus: "Sparepart Kritis Tersedia / Total Sparepart Kritis \xD7 100%" }
  ];
  const MACHINE_BREAKDOWN_HEADERS = ["ID", "Tahun", "Bulan", "Periode", "Mesin", "Breakdown (Jam)", "Frekuensi", "MTBF", "MTTR", "Availability", "Catatan", "Created At", "Updated At"];
  const CORRECTIVE_REPORT_HEADERS = ["ID", "Tahun", "Bulan", "Mesin", "No Notifikasi SAP", "Start", "Finish", "Downtime (menit)", "Problem", "Root Cause", "Corrective Action", "PIC", "Status", "Verifikasi", "Created At", "Updated At"];
  const ENERGY_UTILITY_HEADERS = ["ID", "Tahun", "Bulan", "Area", "Jenis", "Nilai", "Satuan", "Output", "SatuanOutput", "Rasio", "Catatan", "Created At", "Updated At"];
  const RECORD_YTD_HEADERS = ["ID", "Tahun", "Divisi", "Mesin", "Run Hours", "MTBF", "Target MTBF", "MTTR", "Target MTTR", "Lost Time (%)", "Max Lost Time (%)", "Breakdown Event", "Catatan", "Created At", "Updated At"];
  const RUN_HOUR_COMPARISON_HEADERS = ["ID", "Tahun", "Lini", "Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agust", "Sep", "Okt", "Nop", "Des", "Catatan", "Created At", "Updated At"];
  const ENERGY_COST_TOE_HEADERS = ["ID", "Tahun", "Bulan", "Good Sheet Produced", "Stand Meter (GWh)", "Energy Use (GWh)", "Tariff (IDR/kWh)", "TOE", "Catatan", "Created At", "Updated At"];
  const REPORTS_HEADERS = ["ID", "Timestamp", "Type", "Title", "Subtitle", "Author", "Category", "Status", "Progress", "Tanggal Mulai", "Tanggal Selesai", "Summary", "Content", "PDF URL", "Revision", "RawDataJSON"];
  const PREDICTIVE_HEADERS = ["ID", "Timestamp", "Tanggal", "Shift", "Petugas", "Kode Mesin", "Nama Mesin", "Titik Inspeksi", "Vibrasi", "Suhu", "Suara", "Kebocoran", "Kelistrikan", "Pelumasan", "Severity", "Deskripsi Temuan", "Rekomendasi", "Files", "Grouping Team", "Waktu Patrol", "Patrol Mode", "Checklist (JSON)", "Counts (JSON)", "Score", "Findings (JSON)"];
  const IPAL_HEADERS = ["ID", "Timestamp", "Pelapor", "Bulan", "OutletLabel", "DailyJSON", "ChemicalJSON"];
  const RCA_HEADERS = ["ID", "Timestamp", "Nama Mesin", "Title", "SectionsJSON"];
  const KB_HEADERS = ["ID", "Timestamp", "Kategori", "Kode Mesin", "Nama Mesin", "Judul", "Konten", "Tags", "Author", "Source Type", "Source ID"];
  const DOWNTIME_EM_HEADERS = ["ID", "Timestamp", "Periode", "Year", "Month", "RowsJSON"];
  const GROQ_MODELS = [
    "openai/gpt-oss-120b",
    "openai/gpt-oss-20b",
    "llama-4-scout-17b-16e-instruct",
    "qwen/qwen3-32b",
    "llama-3.3-70b-versatile",
    "llama-3.1-8b-instant"
  ];
  const GEMINI_MODELS = [env.GEMINI_MODEL || "gemini-2.5-flash"];
  const USERS_HEADERS = ["Username", "PasswordHash", "Salt", "Role", "DisplayName", "Active", "CreatedAt", "UpdatedAt", "ThemePref", "StylePref", "PasswordVersion"];
  const SESSIONS_HEADERS = ["TokenHash", "Username", "Role", "CreatedAt", "ExpiresAt", "RevokedAt"];
  const AUDIT_HEADERS = ["Timestamp", "Actor", "Role", "Action", "Entity", "EntityID", "TransactionID", "BeforeJSON", "AfterJSON", "Result", "IP"];
  const TX_HEADERS = ["TransactionID", "Action", "Actor", "Timestamp", "RequestHash", "ResponseJSON", "Status"];
  const FACTORY_PROJECT_HEADERS = [
    "ID",
    "Nomor Project",
    "Judul",
    "Background",
    "Objective",
    "Benefit Safety",
    "Benefit Quality",
    "Benefit Cost",
    "Benefit Delivery",
    "Benefit Environment",
    "Benefit People",
    "Sponsor",
    "Project Leader",
    "Anggota Tim",
    "Area",
    "Mesin",
    "PIC",
    "Tanggal Mulai",
    "Target Finish",
    "Progress (%)",
    "Status",
    "Budget",
    "Actual Cost",
    "Risk",
    "Milestone (JSON)",
    "Task List (JSON)",
    "Attachment (JSON)",
    "Lesson Learned",
    "Progress Log (JSON)",
    "Tahun",
    "Created At",
    "Updated At"
  ];
  const KAIZEN_HEADERS = [
    "ID",
    "Tema",
    "Permasalahan",
    "Ide Perbaikan",
    "Before-After",
    "Benefit",
    "PIC",
    "Area",
    "Mesin",
    "Tanggal",
    "Progress (%)",
    "Status",
    "Foto Before (JSON)",
    "Foto After (JSON)",
    "Progress Log (JSON)",
    "Tahun",
    "Created At",
    "Updated At"
  ];
  const SGA_HEADERS = [
    "ID",
    "Nama Tim",
    "Leader",
    "Anggota",
    "Tema",
    "Target",
    "Jadwal Meeting",
    "PIC",
    "Area",
    "Mesin",
    "Progress (%)",
    "Status",
    "Hasil Improvement",
    "Presentasi (JSON)",
    "Achievement",
    "Progress Log (JSON)",
    "Tahun",
    "Created At",
    "Updated At"
  ];
  const PI_SOFTSKILL_HEADERS = ["ID", "Timestamp", "Nama", "Assessor", "Tanggal", "ItemsJSON", "TransactionID", "Actor"];
  const PI_HARDSKILL_HEADERS = ["ID", "Timestamp", "Nama", "Posisi", "Tahun", "Assessor", "Sumber", "Kompeten", "Belum Kompeten", "Penjelasan Belum Kompeten", "Self Learning", "Mentoring", "Coaching", "TransactionID"];
  const PI_HARDSKILL_DETAIL_HEADERS = ["Assessment ID", "Nama", "Posisi", "Tahun", "No Kompetensi", "SKKNI", "Kode Unit", "Unit Kompetensi", "Elemen Unit", "Kriteria Unjuk Kerja", "Pendukung Bukti", "Status Manager", "Penjelasan Belum Kompeten"];
  const PI_HARDSKILL_STANDARD_HEADERS = ["Posisi", "Kode Unit", "Unit Kompetensi", "Group"];
  function getSS_() {
    return SpreadsheetApp.getActiveSpreadsheet();
  }
  __name(getSS_, "getSS_");
  function nowIso_() {
    return (/* @__PURE__ */ new Date()).toISOString();
  }
  __name(nowIso_, "nowIso_");
  function getCache_() {
    try {
      return CacheService.getScriptCache();
    } catch (e) {
      return null;
    }
  }
  __name(getCache_, "getCache_");
  function safeJsonParse_(s, fb) {
    try {
      return JSON.parse(s);
    } catch (e) {
      return fb;
    }
  }
  __name(safeJsonParse_, "safeJsonParse_");
  function rowToObj_(headers, row) {
    var o = {};
    headers.forEach(function(h, i) {
      o[h] = row[i];
    });
    return o;
  }
  __name(rowToObj_, "rowToObj_");
  function normalizeBool_(v) {
    if (typeof v === "boolean") return v;
    var s = String(v).toLowerCase();
    return s === "true" || s === "1" || s === "yes";
  }
  __name(normalizeBool_, "normalizeBool_");
  function hashSha256Hex_(str) {
    var b = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, str, Utilities.Charset.UTF_8);
    return b.map(function(x) {
      var v = (x < 0 ? x + 256 : x).toString(16);
      return v.length === 1 ? "0" + v : v;
    }).join("");
  }
  __name(hashSha256Hex_, "hashSha256Hex_");
  function genSalt_(len) {
    len = len || 32;
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var s = "";
    for (var i = 0; i < len; i++) {
      s += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return s;
  }
  __name(genSalt_, "genSalt_");
  function hashSessionToken_(token) {
    return hashSha256Hex_(String(token || ""));
  }
  __name(hashSessionToken_, "hashSessionToken_");
  function pbkdf2_(password, salt, iterations, keyLenBytes) {
    return Array.from(nativePbkdf2(String(password), String(salt), iterations || PBKDF2_ITERATIONS, keyLenBytes || 32, "sha256"));
  }
  __name(pbkdf2_, "pbkdf2_");
  function hashPasswordV2_(password, salt, iterations) {
    iterations = iterations || PBKDF2_ITERATIONS;
    var dk = pbkdf2_(password, salt, iterations, 32);
    var hex = dk.map(function(b) {
      var v = (b < 0 ? b + 256 : b).toString(16);
      return v.length === 1 ? "0" + v : v;
    }).join("");
    return "v2$" + iterations + "$" + salt + "$" + hex;
  }
  __name(hashPasswordV2_, "hashPasswordV2_");
  function hashPasswordLegacy_(password, salt) {
    return hashSha256Hex_(String(password) + "::" + String(salt));
  }
  __name(hashPasswordLegacy_, "hashPasswordLegacy_");
  function verifyPassword_(password, storedHash, salt) {
    if (!storedHash) return false;
    if (String(storedHash).indexOf("v2$") === 0) {
      var parts = storedHash.split("$");
      if (parts.length !== 4) return false;
      var iter = parseInt(parts[1], 10);
      var s = parts[2];
      var expected = parts[3];
      var computed = hashPasswordV2_(password, s, iter).split("$")[3];
      return computed === expected;
    } else {
      var legacy = hashPasswordLegacy_(password, salt);
      return legacy === storedHash;
    }
  }
  __name(verifyPassword_, "verifyPassword_");
  function getOrCreateSheet_(name, headers) {
    var ss = getSS_();
    var sh = ss.getSheetByName(name);
    if (!sh) {
      sh = ss.insertSheet(name);
      if (headers && headers.length) {
        sh.getRange(1, 1, 1, headers.length).setValues([headers]);
      }
      return sh;
    }
    if (headers && headers.length) {
      var lastCol = sh.getLastColumn();
      if (lastCol === 0) {
        sh.getRange(1, 1, 1, headers.length).setValues([headers]);
      } else {
        ensureHeaderColumns_(sh, headers);
      }
    }
    return sh;
  }
  __name(getOrCreateSheet_, "getOrCreateSheet_");
  function ensureHeaderColumns_(sh, headers) {
    var range = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
    var missing = headers.filter(function(h) {
      return range.indexOf(h) === -1;
    });
    if (missing.length) {
      var newHeaders = range.concat(missing);
      sh.getRange(1, 1, 1, newHeaders.length).setValues([newHeaders]);
    }
  }
  __name(ensureHeaderColumns_, "ensureHeaderColumns_");
  function getGenericRowsLegacyV1_(sheetName, headers) {
    var cache = getCache_();
    var cacheKey = "rows_" + sheetName;
    if (cache && headers.length < 30) {
      var cached = cache.get(cacheKey);
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch (e) {
        }
      }
    }
    var sh = getSS_().getSheetByName(sheetName);
    if (!sh) return [];
    var values = sh.getDataRange().getValues();
    if (values.length < 2) return [];
    var hdr = values[0];
    var out = [];
    for (var i = 1; i < values.length; i++) {
      var obj = rowToObj_(hdr, values[i]);
      if (obj["DeletedAt"] && String(obj["DeletedAt"]).trim() !== "") continue;
      if (obj["Active"] === false || String(obj["Active"]).toLowerCase() === "false") {
        if (sheetName === SHEET_USERS) {
        } else if (obj["DeletedAt"]) continue;
      }
      out.push(obj);
    }
    if (cache && headers.length < 30) {
      try {
        cache.put(cacheKey, JSON.stringify(out), CACHE_TTL_SECONDS);
      } catch (e) {
      }
    }
    return out;
  }
  __name(getGenericRowsLegacyV1_, "getGenericRowsLegacyV1_");
  function invalidateCacheForSheet_(sheetName) {
    var cache = getCache_();
    if (!cache) return;
    try {
      if (sheetName === "ALL") {
        var names = [SHEET_LOGBOOK, SHEET_MESIN, SHEET_PATROL_TEMPLATE, SHEET_PERSONIL, SHEET_REPORTS, SHEET_RCA, SHEET_KB, SHEET_DOWNTIME_EM, SHEET_SPAREPART_LOKASI, SHEET_SPAREPART_ETA, SHEET_SPAREPART_OPNAME, SHEET_SPAREPART_SAP, SHEET_SPAREPART_WAREHOUSE, SHEET_KPI_KERJA, SHEET_KPI_DEPARTMENT_YTD, SHEET_KPI_DEPARTMENT_SOURCE, SHEET_MACHINE_BREAKDOWN, SHEET_CORRECTIVE_REPORT, SHEET_ENERGY_UTILITY, SHEET_RECORD_YTD, SHEET_RUN_HOUR_COMPARISON, SHEET_ENERGY_COST_TOE, SHEET_STOCK_SPAREPART, SHEET_USERS, SHEET_SESSIONS, SHEET_PERMISSIONS, SHEET_LC_PERMISSIONS, SHEET_FEATURES, SHEET_PI_PERSONNEL, SHEET_PI_SOFTSKILL, SHEET_PI_HARDSKILL, SHEET_PI_HARDSKILL_DETAIL, SHEET_PI_HARDSKILL_STANDARD, SHEET_FACTORY_PROJECT, SHEET_KAIZEN, SHEET_SGA, SHEET_MEETING, SHEET_MEETING_ACTION, PREDICTIVE_SHEET_NAME, IPAL_SHEET_NAME];
        cache.removeAll(names.map(function(n) {
          return "rows_" + n;
        }));
        cache.remove("rows_Logbook_v3_full");
        cache.remove("rows_Logbook_sot");
      } else {
        cache.remove("rows_" + sheetName);
        if (sheetName === SHEET_LOGBOOK) {
          cache.remove("rows_Logbook_v3_full");
          cache.remove("rows_Logbook_sot");
        }
      }
      cache.remove("perm_matrix");
      cache.remove("feature_registry");
      cache.remove("lc_perm_matrix");
    } catch (e) {
    }
  }
  __name(invalidateCacheForSheet_, "invalidateCacheForSheet_");
  function getOrCreateFolderByProp_(propKey, folderName) {
    var prop = PropertiesService.getScriptProperties().getProperty(propKey);
    if (prop) {
      try {
        return DriveApp.getFolderById(prop);
      } catch (e) {
      }
    }
    var folders = DriveApp.getFoldersByName(folderName);
    var folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);
    PropertiesService.getScriptProperties().setProperty(propKey, folder.getId());
    return folder;
  }
  __name(getOrCreateFolderByProp_, "getOrCreateFolderByProp_");
  function uploadBase64File_(folder, fileObj, fileName, mimeType) {
    if (!fileObj || !fileObj.base64) throw new Error("File base64 kosong");
    mimeType = String(mimeType || "").toLowerCase();
    var allowed = ALLOWED_MIME_PREFIX.some(function(prefix) {
      return mimeType.indexOf(prefix) === 0;
    });
    if (!allowed) throw new Error("Tipe file tidak diizinkan: " + mimeType);
    var bytes = Utilities.base64Decode(fileObj.base64);
    if (bytes.length > MAX_UPLOAD_BYTES) throw new Error("File terlalu besar >10MB");
    fileName = String(fileName || "lampiran").replace(/[\\/:*?"<>|\u0000-\u001f]/g, "_").substring(0, 160);
    var blob = Utilities.newBlob(bytes, mimeType, fileName);
    var file = folder.createFile(blob);
    try {
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch (e) {
    }
    var fileId = file.getId();
    return {
      id: fileId,
      name: file.getName(),
      mimeType,
      type: mimeType.indexOf("video/") === 0 ? "video" : mimeType.indexOf("image/") === 0 ? "image" : mimeType === "application/pdf" ? "pdf" : "file",
      viewUrl: file.getUrl(),
      // Cloudflare /files/<id> adalah URL permanen lintas perangkat. Jangan pernah
      // menyimpan blob: URL dari browser sebagai referensi persisted.
      thumbUrl: file.getUrl(),
      previewUrl: file.getUrl()
    };
  }
  __name(uploadBase64File_, "uploadBase64File_");
  function getOrCreateProjectFolder_() {
    return getOrCreateFolderByProp_("PROJECT_FOLDER_ID", PROJECT_FOLDER_NAME);
  }
  __name(getOrCreateProjectFolder_, "getOrCreateProjectFolder_");
  function getOrCreateMeetingFolder_() {
    return getOrCreateFolderByProp_("MEETING_FOLDER_ID", "Logbook Maintenance - Meeting Files");
  }
  __name(getOrCreateMeetingFolder_, "getOrCreateMeetingFolder_");
  function getOrCreateManualFolder_() {
    return getOrCreateFolderByProp_("MANUAL_FOLDER_ID", "Logbook Maintenance - Manuals");
  }
  __name(getOrCreateManualFolder_, "getOrCreateManualFolder_");
  function getOrCreateReportsPdfFolder_() {
    return getOrCreateFolderByProp_("REPORTS_PDF_FOLDER_ID", "Logbook Maintenance - Reports PDF");
  }
  __name(getOrCreateReportsPdfFolder_, "getOrCreateReportsPdfFolder_");
  function getOrCreateDriveFolder_(name) {
    name = name || "Logbook Maintenance - Attachments";
    return getOrCreateFolderByProp_("FOLDER_" + name, name);
  }
  __name(getOrCreateDriveFolder_, "getOrCreateDriveFolder_");
  function getUsersSheet_() {
    return getOrCreateSheet_(SHEET_USERS, USERS_HEADERS);
  }
  __name(getUsersSheet_, "getUsersSheet_");
  function getSessionsSheet_() {
    return getOrCreateSheet_(SHEET_SESSIONS, SESSIONS_HEADERS);
  }
  __name(getSessionsSheet_, "getSessionsSheet_");
  function getPermissionsSheet_() {
    return getOrCreateSheet_(SHEET_PERMISSIONS, ["Role", "PermissionKey", "Allowed"]);
  }
  __name(getPermissionsSheet_, "getPermissionsSheet_");
  function getLcPermissionsSheet_() {
    return getOrCreateSheet_(SHEET_LC_PERMISSIONS, ["Role", "PermissionKey", "Allowed"]);
  }
  __name(getLcPermissionsSheet_, "getLcPermissionsSheet_");
  function getFeaturesSheet_() {
    return getOrCreateSheet_(SHEET_FEATURES, ["PermissionKey", "Label", "Group"]);
  }
  __name(getFeaturesSheet_, "getFeaturesSheet_");
  function createSession_(user) {
    var token = Utilities.getUuid() + Utilities.getUuid();
    var now = /* @__PURE__ */ new Date();
    var expires = new Date(now.getTime() + SESSION_TTL_HOURS * 60 * 60 * 1e3);
    var sh = getSessionsSheet_();
    sh.appendRow([hashSessionToken_(token), user.Username, user.Role, now, expires, ""]);
    return { token, username: user.Username, role: user.Role, expires };
  }
  __name(createSession_, "createSession_");
  function requireSession_(token) {
    if (!token) throw { code: "AUTH_REQUIRED", message: "Session token wajib" };
    var tokenHash = hashSessionToken_(token);
    var sh = getSessionsSheet_();
    var data = sh.getDataRange().getValues();
    var headers = data[0];
    var hashCol = headers.indexOf("TokenHash");
    var userCol = headers.indexOf("Username");
    var roleCol = headers.indexOf("Role");
    var expCol = headers.indexOf("ExpiresAt");
    var revCol = headers.indexOf("RevokedAt");
    var now = /* @__PURE__ */ new Date();
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][hashCol]) === String(tokenHash)) {
        var revoked = data[i][revCol];
        if (revoked && String(revoked).trim() !== "") throw { code: "SESSION_INVALID", message: "Session revoked" };
        var exp = data[i][expCol];
        if (exp && new Date(exp) < now) throw { code: "SESSION_EXPIRED", message: "Session expired" };
        var username = data[i][userCol];
        var role = data[i][roleCol];
        var uRow = findUserRow_(username);
        if (!uRow || !normalizeBool_(uRow.user.Active)) throw { code: "ACCOUNT_INACTIVE", message: "Akun non-aktif" };
        return { username, role: uRow.user.Role, rowIndex: i + 1 };
      }
    }
    throw { code: "SESSION_INVALID", message: "Session tidak valid" };
  }
  __name(requireSession_, "requireSession_");
  function revokeSession_(token) {
    var tokenHash = hashSessionToken_(token);
    var sh = getSessionsSheet_();
    var data = sh.getDataRange().getValues();
    var hashCol = data[0].indexOf("TokenHash");
    var revCol = data[0].indexOf("RevokedAt");
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][hashCol]) === String(tokenHash)) {
        sh.getRange(i + 1, revCol + 1).setValue(/* @__PURE__ */ new Date());
        break;
      }
    }
  }
  __name(revokeSession_, "revokeSession_");
  function revokeUserSessions_(username) {
    var sh = getSessionsSheet_();
    var data = sh.getDataRange().getValues();
    var userCol = data[0].indexOf("Username");
    var revCol = data[0].indexOf("RevokedAt");
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][userCol]) === String(username) && !data[i][revCol]) {
        sh.getRange(i + 1, revCol + 1).setValue(/* @__PURE__ */ new Date());
      }
    }
  }
  __name(revokeUserSessions_, "revokeUserSessions_");
  function findUserRow_(username) {
    var sh = getUsersSheet_();
    var data = sh.getDataRange().getValues();
    var headers = data[0];
    var userCol = headers.indexOf("Username");
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][userCol]).toLowerCase() === String(username).toLowerCase()) {
        return { user: rowToObj_(headers, data[i]), rowIndex: i + 1, headers };
      }
    }
    return null;
  }
  __name(findUserRow_, "findUserRow_");
  function getAllUsers_() {
    return getGenericRows_(SHEET_USERS, USERS_HEADERS);
  }
  __name(getAllUsers_, "getAllUsers_");
  function syncFeatureRegistry_() {
  }
  __name(syncFeatureRegistry_, "syncFeatureRegistry_");
  const OMODOS4_FEATURES = [
    ["omodos4.view", "OMODOS 4.0", "OMODOS 4.0"],
    ["omodos4.machine", "Machine Intelligence", "OMODOS 4.0"],
    ["omodos4.predictive", "Predictive Intelligence", "OMODOS 4.0"],
    ["omodos4.smartfield", "Smart Field", "OMODOS 4.0"],
    ["omodos4.sparepart", "Sparepart Intelligence", "OMODOS 4.0"],
    ["omodos4.reliability", "Reliability & Loss", "OMODOS 4.0"],
    ["omodos4.operation", "Operation Intelligence", "OMODOS 4.0"],
    ["omodos4.people", "People Intelligence 4.0", "OMODOS 4.0"],
    ["omodos4.ai", "AI Intelligence", "OMODOS 4.0"],
    ["omodos4.improvement", "Improvement Intelligence", "OMODOS 4.0"],
    ["omodos4.factorybrain", "Factory Brain", "OMODOS 4.0"],
    ["omodos4.warroom", "Maintenance War Room", "OMODOS 4.0"]
  ];
  function ensureOmodos4Rbac_() {
    var fsh = getOrCreateSheet_(SHEET_FEATURES, ["PermissionKey", "Label", "Group"]);
    var fv = fsh.getDataRange().getValues(), fseen = {}, newlyRegistered = {};
    for (var i = 1; i < fv.length; i++) fseen[String(fv[i][0] || "")] = true;
    OMODOS4_FEATURES.forEach(function(row) {
      if (!fseen[row[0]]) {
        fsh.appendRow(row);
        fseen[row[0]] = true;
        newlyRegistered[row[0]] = true;
      }
    });
    var psh = getOrCreateSheet_(SHEET_PERMISSIONS, ["Role", "PermissionKey", "Allowed"]);
    var pv = psh.getDataRange().getValues(), pseen = {}, prow = {};
    for (var j = 1; j < pv.length; j++) {
      var permissionRole = String(pv[j][0] || ""), permissionKey = String(pv[j][1] || ""), permissionComposite = permissionRole + "|" + permissionKey;
      pseen[permissionComposite] = true;
      prow[permissionComposite] = j + 1;
    }
    var seedMarkerKey = "Superadmin|omodos4.seed.v1";
    var seedMarkerV2Key = "Superadmin|omodos4.seed.v2";
    var needsInitialV4Seed = !pseen[seedMarkerKey] && !pseen[seedMarkerV2Key];
    var roles = { "Superadmin": true, "Supervisor": true, "Technician": true, "Admin": true, "User": true };
    try {
      var uv = getUsersSheet_().getDataRange().getValues(), uh = uv[0] || [], rc = uh.indexOf("Role");
      if (rc >= 0) for (var u = 1; u < uv.length; u++) {
        var role = String(uv[u][rc] || "").trim();
        if (role) roles[role] = true;
      }
    } catch (e) {
    }
    OMODOS4_FEATURES.forEach(function(feature) {
      Object.keys(roles).forEach(function(role2) {
        var key = role2 + "|" + feature[0];
        var isSuperadmin = String(role2).toLowerCase() === "superadmin";
        if (pseen[key]) {
          if (needsInitialV4Seed && isSuperadmin) psh.getRange(prow[key], 3).setValue(true);
          return;
        }
        if (isSuperadmin && !needsInitialV4Seed && !newlyRegistered[feature[0]]) return;
        psh.appendRow([role2, feature[0], isSuperadmin]);
        pseen[key] = true;
      });
    });
    if (needsInitialV4Seed) psh.appendRow(["Superadmin", "omodos4.seed.v1", true]);
    var cache = getCache_();
    if (cache) {
      try {
        cache.remove("perm_matrix");
        cache.remove("feature_registry");
      } catch (e) {
      }
    }
  }
  __name(ensureOmodos4Rbac_, "ensureOmodos4Rbac_");
  function ensureOmodos4RbacV2_() {
    var psh = getPermissionsSheet_();
    var current = snapshotRoleAccessRows_(psh);
    var markerKey = "omodos4.seed.v2";
    var markerFound = current.some(function(r) {
      return String(r[0] || "").toLowerCase() === "superadmin" && String(r[1] || "") === markerKey;
    });
    if (markerFound) return false;
    var bySuperKey = {};
    current.forEach(function(r) {
      if (String(r[0] || "").toLowerCase() === "superadmin") bySuperKey[String(r[1] || "")] = r;
    });
    OMODOS4_FEATURES.forEach(function(feature) {
      var key = String(feature[0]), row = bySuperKey[key];
      if (row) row[2] = true;
      else {
        var created = ["Superadmin", key, true];
        current.push(created);
        bySuperKey[key] = created;
      }
    });
    current.push(["Superadmin", markerKey, true]);
    replaceRoleAccessRows_(psh, current);
    invalidateCacheForSheet_(SHEET_PERMISSIONS);
    var cache = getCache_();
    if (cache) {
      try {
        cache.remove("perm_matrix");
        cache.put("omodos4_rbac_seed_v2", "1", CACHE_TTL_SECONDS);
      } catch (e) {
      }
    }
    return true;
  }
  __name(ensureOmodos4RbacV2_, "ensureOmodos4RbacV2_");
  function requireOmodos4Superadmin_(body) {
    requireSuperadmin_(body && body.actor);
    var matrix = readRoleAccessRowsFresh_(getPermissionsSheet_());
    for (var i = 0; i < matrix.length; i++) {
      if (String(matrix[i].Role).toLowerCase() === "superadmin" && String(matrix[i].PermissionKey) === "omodos4.view") {
        if (!normalizeBool_(matrix[i].Allowed)) throw { code: "FORBIDDEN", message: "OMODOS 4.0 dinonaktifkan oleh rollback switch" };
        return;
      }
    }
    throw { code: "FORBIDDEN", message: "OMODOS 4.0 access gate tidak tersedia" };
  }
  __name(requireOmodos4Superadmin_, "requireOmodos4Superadmin_");
  function handleOmodos4_(body) {
    requireOmodos4Superadmin_(body);
    return OMODOS4.dispatch(body);
  }
  __name(handleOmodos4_, "handleOmodos4_");
  function ensureRbacBootstrap_() {
    var cache = getCache_();
    if (cache) {
      var flag = cache.get("rbac_bootstrapped");
      if (flag) {
        var v4SeedFlag = cache.get("omodos4_rbac_seed_v1");
        if (!v4SeedFlag) {
          ensureOmodos4Rbac_();
          try {
            cache.put("omodos4_rbac_seed_v1", "1", CACHE_TTL_SECONDS);
          } catch (e) {
          }
        }
        var v4SeedV2 = cache.get("omodos4_rbac_seed_v2");
        if (!v4SeedV2) {
          ensureOmodos4RbacV2_();
          try {
            cache.put("omodos4_rbac_seed_v2", "1", CACHE_TTL_SECONDS);
          } catch (e) {
          }
        }
        return;
      }
    }
    getOrCreateSheet_(SHEET_USERS, USERS_HEADERS);
    getOrCreateSheet_(SHEET_SESSIONS, SESSIONS_HEADERS);
    getOrCreateSheet_(SHEET_PERMISSIONS, ["Role", "PermissionKey", "Allowed"]);
    getOrCreateSheet_(SHEET_LC_PERMISSIONS, ["Role", "PermissionKey", "Allowed"]);
    getOrCreateSheet_(SHEET_FEATURES, ["PermissionKey", "Label", "Group"]);
    getOrCreateSheet_(AUDIT_LOG_SHEET, AUDIT_HEADERS);
    getOrCreateSheet_(TX_LOG_SHEET, TX_HEADERS);
    ensureOmodos4Rbac_();
    if (cache) {
      try {
        cache.put("omodos4_rbac_seed_v1", "1", CACHE_TTL_SECONDS);
      } catch (e) {
      }
    }
    ensureOmodos4RbacV2_();
    if (cache) {
      try {
        cache.put("omodos4_rbac_seed_v2", "1", CACHE_TTL_SECONDS);
      } catch (e) {
      }
    }
    var sh = getUsersSheet_();
    if (sh.getLastRow() <= 1) {
      var initialPassword = PropertiesService.getScriptProperties().getProperty("INITIAL_SUPERADMIN_PASSWORD");
      if (!initialPassword || initialPassword.length < 12) {
        throw new Error("Belum ada user. Atur INITIAL_SUPERADMIN_PASSWORD minimal 12 karakter di Cloudflare Worker Secrets untuk bootstrap pertama.");
      }
      var salt = genSalt_(32);
      var hash = hashPasswordV2_(initialPassword, salt, PBKDF2_ITERATIONS);
      sh.appendRow(["superadmin", hash, salt, "Superadmin", "Superadmin", true, /* @__PURE__ */ new Date(), /* @__PURE__ */ new Date(), "", "", "v2"]);
      PropertiesService.getScriptProperties().deleteProperty("INITIAL_SUPERADMIN_PASSWORD");
    }
    if (cache) {
      try {
        cache.put("rbac_bootstrapped", "1", CACHE_TTL_SECONDS);
      } catch (e) {
      }
    }
  }
  __name(ensureRbacBootstrap_, "ensureRbacBootstrap_");
  function getFeatureRegistryOut_() {
    var cache = getCache_();
    if (cache) {
      var cached = cache.get("feature_registry");
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch (e) {
        }
      }
    }
    var rows = getGenericRows_(SHEET_FEATURES, ["PermissionKey", "Label", "Group"]);
    if (cache) {
      try {
        cache.put("feature_registry", JSON.stringify(rows), CACHE_TTL_SECONDS);
      } catch (e) {
      }
    }
    return rows;
  }
  __name(getFeatureRegistryOut_, "getFeatureRegistryOut_");
  function getPermissionMatrix_() {
    var cache = getCache_();
    if (cache) {
      var cached = cache.get("perm_matrix");
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch (e) {
        }
      }
    }
    var rows = getGenericRows_(SHEET_PERMISSIONS, ["Role", "PermissionKey", "Allowed"]);
    if (cache) {
      try {
        cache.put("perm_matrix", JSON.stringify(rows), CACHE_TTL_SECONDS);
      } catch (e) {
      }
    }
    return rows;
  }
  __name(getPermissionMatrix_, "getPermissionMatrix_");
  function getLcPermissionMatrix_() {
    var cache = getCache_();
    if (cache) {
      var cached = cache.get("lc_perm_matrix");
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch (e) {
        }
      }
    }
    var rows = getGenericRows_(SHEET_LC_PERMISSIONS, ["Role", "PermissionKey", "Allowed"]);
    if (cache) {
      try {
        cache.put("lc_perm_matrix", JSON.stringify(rows), CACHE_TTL_SECONDS);
      } catch (e) {
      }
    }
    return rows;
  }
  __name(getLcPermissionMatrix_, "getLcPermissionMatrix_");
  function checkPermission_(role, permissionKey) {
    if (!role) return false;
    if (String(role).toLowerCase() === "superadmin") return true;
    var matrix = getPermissionMatrix_();
    for (var i = 0; i < matrix.length; i++) {
      if (String(matrix[i]["Role"]).toLowerCase() === String(role).toLowerCase() && String(matrix[i]["PermissionKey"]) === String(permissionKey)) {
        return normalizeBool_(matrix[i]["Allowed"]);
      }
    }
    var parts = String(permissionKey).split(".");
    if (parts.length > 1) {
      var wildcard = parts[0] + ".*";
      for (var j = 0; j < matrix.length; j++) {
        if (String(matrix[j]["Role"]).toLowerCase() === String(role).toLowerCase() && String(matrix[j]["PermissionKey"]) === wildcard) {
          if (normalizeBool_(matrix[j]["Allowed"])) return true;
        }
      }
    }
    var module = parts[0];
    var viewMap = {
      logbook: "view.input",
      machine: "view.database",
      patrol: "view.patrol",
      person: "view.pi-personnel",
      people: "view.pi-dashboard",
      sparepart: "view.sparepart",
      project: "view.project-center",
      meeting: "view.meeting",
      report: "view.report",
      analytics: "view.analitik",
      ai: "view.diagnostic",
      setting: "view.setting",
      rbac: "view.setting"
    };
    var viewKey = viewMap[module];
    if (viewKey) {
      for (var k = 0; k < matrix.length; k++) {
        if (String(matrix[k].Role).toLowerCase() === String(role).toLowerCase() && String(matrix[k].PermissionKey) === viewKey) {
          return normalizeBool_(matrix[k].Allowed);
        }
      }
    }
    return false;
  }
  __name(checkPermission_, "checkPermission_");
  function requirePermission_(role, permissionKey) {
    if (!checkPermission_(role, permissionKey)) {
      throw { code: "FORBIDDEN", message: "Tidak memiliki izin: " + permissionKey };
    }
  }
  __name(requirePermission_, "requirePermission_");
  function requireSuperadmin_(actor) {
    var row = findUserRow_(actor);
    if (!row || String(row.user.Role).toLowerCase() !== "superadmin") {
      throw { code: "FORBIDDEN", message: "Hanya Superadmin" };
    }
  }
  __name(requireSuperadmin_, "requireSuperadmin_");
  function writeAuditLog_(actor, role, action, entity, entityId, beforeObj, afterObj, transactionId, result) {
    try {
      var sh = getOrCreateSheet_(AUDIT_LOG_SHEET, AUDIT_HEADERS);
      var redact = /* @__PURE__ */ __name(function(value, depth) {
        depth = depth || 0;
        if (depth > 8) return "[MAX_DEPTH]";
        if (Array.isArray(value)) return value.slice(0, 100).map(function(v) {
          return redact(v, depth + 1);
        });
        if (value && typeof value === "object") {
          var out = {};
          Object.keys(value).forEach(function(k) {
            if (/password|sessiontoken|authorization|apikey|api_key|secret|base64|passwordhash|salt/i.test(k)) out[k] = "[REDACTED]";
            else out[k] = redact(value[k], depth + 1);
          });
          return out;
        }
        return typeof value === "string" && value.length > 2e3 ? value.substring(0, 2e3) + "\u2026" : value;
      }, "redact");
      var beforeStr = beforeObj ? JSON.stringify(redact(beforeObj)).substring(0, 5e3) : "";
      var afterStr = afterObj ? JSON.stringify(redact(afterObj)).substring(0, 5e3) : "";
      sh.appendRow([nowIso_(), actor || "", role || "", action || "", entity || "", entityId || "", transactionId || "", beforeStr, afterStr, result || "ok", ""]);
    } catch (e) {
    }
  }
  __name(writeAuditLog_, "writeAuditLog_");
  function getTransactionResult_(transactionId, expectedAction, expectedRequestHash) {
    if (!transactionId) return null;
    var sh = getSS_().getSheetByName(TX_LOG_SHEET);
    if (!sh) return null;
    var data = sh.getDataRange().getValues();
    var headers = data[0];
    var txCol = headers.indexOf("TransactionID");
    var actionCol = headers.indexOf("Action");
    var hashCol = headers.indexOf("RequestHash");
    var respCol = headers.indexOf("ResponseJSON");
    var statusCol = headers.indexOf("Status");
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][txCol]) === String(transactionId)) {
        if (expectedAction && actionCol !== -1 && String(data[i][actionCol]) !== String(expectedAction)) {
          throw { code: "TX_CONFLICT", message: "TransactionID sudah dipakai untuk action lain" };
        }
        if (expectedRequestHash && hashCol !== -1 && data[i][hashCol] && String(data[i][hashCol]) !== String(expectedRequestHash)) {
          throw { code: "TX_CONFLICT", message: "TransactionID digunakan ulang dengan payload berbeda" };
        }
        var resp = data[i][respCol];
        var status = data[i][statusCol];
        if (status === "success") {
          try {
            return JSON.parse(resp);
          } catch (e) {
            return { ok: true, data: resp };
          }
        }
      }
    }
    return null;
  }
  __name(getTransactionResult_, "getTransactionResult_");
  function saveTransactionResult_(transactionId, action, actor, requestHash, responseObj, status) {
    try {
      var sh = getOrCreateSheet_(TX_LOG_SHEET, TX_HEADERS);
      sh.appendRow([transactionId, action, actor, nowIso_(), requestHash || "", JSON.stringify(responseObj).substring(0, 1e4), status || "success"]);
    } catch (e) {
    }
  }
  __name(saveTransactionResult_, "saveTransactionResult_");
  function hashRequest_(obj) {
    try {
      return hashSha256Hex_(JSON.stringify(obj));
    } catch (e) {
      return "";
    }
  }
  __name(hashRequest_, "hashRequest_");
  function jsonOut_(obj) {
    return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
  }
  __name(jsonOut_, "jsonOut_");
  function jsonDataOut_(value) {
    if (value && typeof value.getContent === "function") return value;
    return jsonOut_({ ok: true, data: value === void 0 ? null : value });
  }
  __name(jsonDataOut_, "jsonDataOut_");
  function stdSuccess_(data, meta) {
    var out = { ok: true };
    if (data !== void 0) out.data = data;
    if (meta) out.meta = meta;
    return out;
  }
  __name(stdSuccess_, "stdSuccess_");
  function stdError_(code, message, retryable) {
    return { ok: false, error: { code: code || "UNKNOWN", message: message || "Error", retryable: !!retryable } };
  }
  __name(stdError_, "stdError_");
  function handleError_(err) {
    var code = err && err.code || "SERVER_ERROR";
    var msg = err && err.message || String(err);
    if (code === "AUTH_REQUIRED" || code === "SESSION_INVALID" || code === "SESSION_EXPIRED" || code === "ACCOUNT_INACTIVE" || code === "FORBIDDEN" || code === "VALIDATION_ERROR" || code === "NOT_FOUND") {
      return jsonOut_({ ok: false, error: code + ": " + msg });
    }
    return jsonOut_({ ok: false, error: code + ": " + msg });
  }
  __name(handleError_, "handleError_");
  function validateRequired_(obj, fields) {
    for (var i = 0; i < fields.length; i++) {
      var f = fields[i];
      if (obj[f] === void 0 || obj[f] === null || String(obj[f]).trim() === "") {
        throw { code: "VALIDATION_ERROR", message: "Field wajib: " + f };
      }
    }
  }
  __name(validateRequired_, "validateRequired_");
  function validateStringMax_(body, field, max) {
    var v = body && body[field];
    if (v === void 0 || v === null) return;
    if (String(v).length > max) throw { code: "VALIDATION_ERROR", message: field + " terlalu panjang (maks " + max + ")" };
  }
  __name(validateStringMax_, "validateStringMax_");
  function validateEnum_(body, field, allowed) {
    var v = body && body[field];
    if (v === void 0 || v === null || String(v) === "") return;
    if (allowed.indexOf(String(v)) === -1) throw { code: "VALIDATION_ERROR", message: field + " tidak valid" };
  }
  __name(validateEnum_, "validateEnum_");
  function validatePercent_(body, field) {
    var v = body && body[field];
    if (v === void 0 || v === null || String(v) === "") return;
    var n = Number(v);
    if (!isFinite(n) || n < 0 || n > 100) throw { code: "VALIDATION_ERROR", message: field + " harus 0..100" };
  }
  __name(validatePercent_, "validatePercent_");
  function validatePayload_(action, body) {
    switch (action) {
      case "addEntry":
      case "updateStatus":
      case "updateEntry":
        if (action === "updateStatus") {
          validateRequired_(body, ["id"]);
        }
        if (action === "updateEntry") {
          if (!(body.entry && (body.entry.ID || body.entry.id)) && !body.id) throw { code: "VALIDATION_ERROR", message: "ID wajib diisi untuk update" };
        }
        break;
      case "addMachine":
        validateRequired_(body, ["machine"]);
        break;
      case "savePiSoftskill":
        validateRequired_(body, ["assessment"]);
        if (!body.assessment.nama) throw { code: "VALIDATION_ERROR", message: "Nama wajib" };
        break;
      case "savePiHardskill":
        validateRequired_(body, ["assessment"]);
        if (!body.assessment.nama) throw { code: "VALIDATION_ERROR", message: "Nama wajib" };
        break;
      case "saveSparepartLokasi":
        validateRequired_(body, ["lokasi"]);
        break;
      case "saveSparepartEta":
        validateRequired_(body, ["namaMaterial", "noPO", "estimasiEta"]);
        break;
      case "saveSparepartOpname":
        validateRequired_(body, ["namaMaterial", "stockFisik"]);
        break;
      case "v4.createWarRoom":
        validateRequired_(body, ["title", "machine", "transactionId"]);
        validateStringMax_(body, "title", 200);
        validateStringMax_(body, "machine", 160);
        validateStringMax_(body, "owner", 160);
        validateStringMax_(body, "summary", 4e3);
        validateEnum_(body, "severity", ["P0", "P1", "P2", "P3"]);
        break;
      case "v4.updateWarRoom":
        validateRequired_(body, ["id", "transactionId"]);
        validateStringMax_(body, "id", 200);
        validateStringMax_(body, "owner", 160);
        validateStringMax_(body, "summary", 4e3);
        validateStringMax_(body, "message", 4e3);
        validateEnum_(body, "status", ["OPEN", "MONITORING", "CLOSED"]);
        validateEnum_(body, "type", ["update", "decision", "action", "checkpoint", "state-change"]);
        break;
      case "v4.saveScenario":
        validateRequired_(body, ["name", "transactionId"]);
        validateStringMax_(body, "name", 200);
        validatePercent_(body, "downtimeReductionPct");
        validatePercent_(body, "recurringReductionPct");
        validatePercent_(body, "stockRiskReductionPct");
        validatePercent_(body, "actionClosurePct");
        break;
      case "v4.runScenario":
        validatePercent_(body, "downtimeReductionPct");
        validatePercent_(body, "recurringReductionPct");
        validatePercent_(body, "stockRiskReductionPct");
        validatePercent_(body, "actionClosurePct");
        break;
      case "v4.ask":
        validateRequired_(body, ["query"]);
        validateStringMax_(body, "query", 4e3);
        break;
      default:
        break;
    }
    var fileFields = ["files", "attachmentFiles", "fotoBeforeFiles", "fotoAfterFiles", "presentasiFiles", "photos"];
    fileFields.forEach(function(ff) {
      if (body[ff] && Array.isArray(body[ff])) {
        body[ff].forEach(function(f) {
          if (f.base64) {
            var len = Math.ceil(f.base64.length * 3 / 4);
            if (len > MAX_UPLOAD_BYTES) throw { code: "VALIDATION_ERROR", message: "File " + (f.name || "") + " terlalu besar" };
            var mime = String(f.mimeType || "").toLowerCase();
            var allowed = false;
            for (var k = 0; k < ALLOWED_MIME_PREFIX.length; k++) {
              if (mime.indexOf(ALLOWED_MIME_PREFIX[k]) === 0) {
                allowed = true;
                break;
              }
            }
            if (mime.indexOf("image/") === 0) allowed = true;
            if (!allowed && mime !== "") throw { code: "VALIDATION_ERROR", message: "Tipe file tidak diizinkan: " + mime };
          }
        });
      }
    });
  }
  __name(validatePayload_, "validatePayload_");
  const ACTION_REGISTRY = {
    // AUTH (public or session)
    "login": { permission: null, audit: false, idempotent: false, handler: "handleLogin_" },
    "logout": { permission: null, audit: true, idempotent: true, handler: "handleLogout_" },
    // USER MANAGEMENT
    "users": { permission: "rbac.manage", audit: false, idempotent: false, handler: "handleGetUsers_", method: "GET" },
    "createUser": { permission: "rbac.manage", audit: true, idempotent: true, handler: "handleCreateUser_" },
    "updateUser": { permission: "rbac.manage", audit: true, idempotent: true, handler: "handleUpdateUser_" },
    "resetPassword": { permission: "rbac.manage", audit: true, idempotent: true, handler: "handleResetPassword_" },
    "setUserActive": { permission: "rbac.manage", audit: true, idempotent: true, handler: "handleSetUserActive_" },
    "deleteUser": { permission: "rbac.manage", audit: true, idempotent: true, handler: "handleDeleteUser_" },
    "permissions": { permission: "rbac.manage", audit: false, idempotent: false, handler: "getPermissionMatrix_", method: "GET" },
    "lcPermissions": { permission: "rbac.manage", audit: false, idempotent: false, handler: "getLcPermissionMatrix_", method: "GET" },
    "features": { permission: null, audit: false, idempotent: false, handler: "getFeatureRegistryOut_", method: "GET" },
    "savePermissions": { permission: "rbac.manage", audit: true, idempotent: true, handler: "handleSavePermissions_" },
    "saveLcPermissions": { permission: "rbac.manage", audit: true, idempotent: true, handler: "handleSaveLcPermissions_" },
    // [FIX 2026-09-04] Simpan matrix akses utama + Low Cognitive dalam satu operasi
    // terkunci, agar konfigurasi Role Access tidak lagi bergantung pada dua POST terpisah.
    "saveRoleAccessConfig": { permission: "rbac.manage", audit: true, idempotent: true, handler: "handleSaveRoleAccessConfig_" },
    // LOGBOOK
    "list": { permission: "logbook.read", audit: false, idempotent: false, handler: "getLogbookList_", method: "GET" },
    "addEntry": { permission: "logbook.create", audit: true, idempotent: true, handler: "addEntry_" },
    "updateEntry": { permission: "logbook.update", audit: true, idempotent: true, handler: "updateEntry_" },
    "updateStatus": { permission: "logbook.update", audit: true, idempotent: true, handler: "updateStatus_" },
    "deleteEntry": { permission: "logbook.delete", audit: true, idempotent: true, handler: "deleteEntry_" },
    // MACHINES
    "bootstrap": { permission: null, audit: false, idempotent: false, handler: "getBootstrap_", method: "GET" },
    // Master mesin adalah data referensi dasar lintas-halaman: Home, Input
    // Logbook, Patrol, Copilot, dan berbagai selector membutuhkan nama/kode
    // mesin walau user tidak diberi akses ke halaman admin Database Mesin.
    // getBootstrap_() memang sudah mengirim daftar yang sama ke setiap sesi
    // terautentikasi, jadi read endpoint dibuat konsisten. CRUD tetap dilindungi
    // machine.manage dan tidak ikut dibuka.
    "machines": { permission: null, audit: false, idempotent: false, handler: "getMachinesList_", method: "GET" },
    "addMachine": { permission: "machine.manage", audit: true, idempotent: true, handler: "addMachine_" },
    "updateMachine": { permission: "machine.manage", audit: true, idempotent: true, handler: "updateMachine_" },
    "deleteMachine": { permission: "machine.manage", audit: true, idempotent: true, handler: "deleteMachine_" },
    // PATROL
    "patrolChecklistTemplate": { permission: "patrol.read", audit: false, idempotent: false, handler: "getPatrolTemplateList_", method: "GET" },
    "savePatrolTemplateItem": { permission: "patrol.manage", audit: true, idempotent: true, handler: "savePatrolTemplateItem_" },
    "deletePatrolTemplateItem": { permission: "patrol.manage", audit: true, idempotent: true, handler: "deletePatrolTemplateItem_" },
    // PERSONNEL
    // [FIX] 'personil' (Master_Personil: Nama Personil/Grouping Team/Jabatan)
    // adalah data REFERENSI dasar yang dipakai di banyak halaman (dropdown
    // "Nama Pelapor" di Input Logbook, penugasan Patrol, dst) -- BUKAN data
    // sensitif milik halaman People/PI Personnel Dashboard saja. Sebelumnya
    // action ini mensyaratkan permission 'person.read', yang lewat viewMap_
    // di checkPermission_ terhubung ke 'view.pi-personnel' (halaman People &
    // Meetings) -- permission yang SAMA SEKALI TIDAK BERKAITAN dengan Input
    // Logbook/Patrol. Akibatnya role yang hanya diberi akses ke Input
    // Logbook & Patrol (wajar, tanpa akses ke People Dashboard) gagal
    // memuat daftar Personil sama sekali, dan dropdown personil di kedua
    // menu itu jadi kosong tanpa pesan error apa pun (dikeluarkan diam-diam
    // dari prepareManifest karena requirePermission_ gagal). Sekarang dibuka
    // untuk siapa pun yang sudah login (permission:null, sama seperti
    // 'bootstrap'), sama seperti 'personil' memang dipakai lintas-halaman.
    // 'piPersonnelMaster' (data HR lebih detail: ID Karyawan, Job Title,
    // dst -- khusus halaman People/PI Personnel) TETAP digate seperti semula.
    "personil": { permission: null, audit: false, idempotent: false, handler: "getPersonilList_", method: "GET" },
    "piPersonnelMaster": { permission: "person.read", audit: false, idempotent: false, handler: "getPiPersonnelMaster_", method: "GET" },
    "addPersonil": { permission: "person.manage", audit: true, idempotent: true, handler: "addPersonil_" },
    "updatePersonil": { permission: "person.manage", audit: true, idempotent: true, handler: "updatePersonil_" },
    "deletePersonil": { permission: "person.manage", audit: true, idempotent: true, handler: "deletePersonil_" },
    "savePiPersonnelMaster": { permission: "person.manage", audit: true, idempotent: true, handler: "savePiPersonnelMaster_" },
    "deletePiPersonnelMaster": { permission: "person.manage", audit: true, idempotent: true, handler: "deletePiPersonnelMaster_" },
    // SPAREPART
    "sparepartLokasi": { permission: "sparepart.read", audit: false, idempotent: false, handler: "getSparepartLokasiMerged_", method: "GET" },
    "saveSparepartLokasi": { permission: "sparepart.manage", audit: true, idempotent: true, handler: "saveSparepartLokasi_" },
    "deleteSparepartLokasi": { permission: "sparepart.manage", audit: true, idempotent: true, handler: "deleteSparepartLokasi_" },
    "sparepartEta": { permission: "sparepart.read", audit: false, idempotent: false, handler: "getSparepartEta_", method: "GET" },
    "saveSparepartEta": { permission: "sparepart.manage", audit: true, idempotent: true, handler: "saveSparepartEta_" },
    "deleteSparepartEta": { permission: "sparepart.manage", audit: true, idempotent: true, handler: "deleteSparepartEta_" },
    "sparepartOpname": { permission: "sparepart.read", audit: false, idempotent: false, handler: "getSparepartOpname_", method: "GET" },
    "saveSparepartOpname": { permission: "sparepart.manage", audit: true, idempotent: true, handler: "saveSparepartOpname_" },
    "deleteSparepartOpname": { permission: "sparepart.manage", audit: true, idempotent: true, handler: "deleteSparepartOpname_" },
    "stockSparepart": { permission: "sparepart.read", audit: false, idempotent: false, handler: "getStockSparepart_", method: "GET" },
    // PI - People Intelligence
    "piHardSkillStandard": { permission: "people.assessment.read", audit: false, idempotent: false, handler: "getPiHardSkillStandard_", method: "GET" },
    "piHardSkillAssessments": { permission: "people.assessment.read", audit: false, idempotent: false, handler: "getPiHardSkillAssessments_", method: "GET" },
    "piSoftskillAssessments": { permission: "people.assessment.read", audit: false, idempotent: false, handler: "getPiSoftskillAssessments_", method: "GET" },
    "savePiHardskill": { permission: "people.assessment.write", audit: true, idempotent: true, handler: "savePiHardskill_" },
    "savePiSoftskill": { permission: "people.assessment.write", audit: true, idempotent: true, handler: "savePiSoftskill_" },
    // PROJECT & MEETING
    "pmcFactoryProjects": { permission: "project.read", audit: false, idempotent: false, handler: "getPmcFactory_", method: "GET" },
    "pmcKaizens": { permission: "project.read", audit: false, idempotent: false, handler: "getPmcKaizen_", method: "GET" },
    "pmcSgas": { permission: "project.read", audit: false, idempotent: false, handler: "getPmcSga_", method: "GET" },
    "pmcSaveProject": { permission: "project.manage", audit: true, idempotent: true, handler: "pmcSaveProject_" },
    "pmcDeleteProject": { permission: "project.manage", audit: true, idempotent: true, handler: "pmcDeleteProject_" },
    "meetingList": { permission: "meeting.read", audit: false, idempotent: false, handler: "getMeetingList_", method: "GET" },
    "saveMeeting": { permission: "meeting.manage", audit: true, idempotent: true, handler: "saveMeeting_" },
    "deleteMeeting": { permission: "meeting.manage", audit: true, idempotent: true, handler: "deleteMeeting_" },
    // AI
    "aiGroq": { permission: "ai.groq", audit: true, idempotent: false, handler: "handleAiGroq_" },
    "aiInternetResearch": { permission: "ai.internetResearch", audit: true, idempotent: false, handler: "handleAiInternetResearch_" },
    "aiKbEnrich": { permission: "ai.kbEnrich", audit: true, idempotent: false, handler: "handleAiKbEnrich_" },
    // OMODOS 4.0 — Superadmin intelligence layer
    "v4.getAccess": { permission: "omodos4.view", audit: false, idempotent: false, handler: "handleOmodos4_", method: "POST" },
    "v4.getOverview": { permission: "omodos4.view", audit: false, idempotent: false, handler: "handleOmodos4_", method: "POST" },
    "v4.getWhatChanged": { permission: "omodos4.view", audit: false, idempotent: false, handler: "handleOmodos4_", method: "POST" },
    "v4.getMachineHealth": { permission: "omodos4.machine", audit: false, idempotent: false, handler: "handleOmodos4_", method: "POST" },
    "v4.getMachinePassport": { permission: "omodos4.machine", audit: false, idempotent: false, handler: "handleOmodos4_", method: "POST" },
    "v4.getMachineGraph": { permission: "omodos4.machine", audit: false, idempotent: false, handler: "handleOmodos4_", method: "POST" },
    "v4.getFailureMemory": { permission: "omodos4.reliability", audit: false, idempotent: false, handler: "handleOmodos4_", method: "POST" },
    "v4.getPredictiveRisk": { permission: "omodos4.predictive", audit: false, idempotent: false, handler: "handleOmodos4_", method: "POST" },
    "v4.getFieldMission": { permission: "omodos4.smartfield", audit: false, idempotent: false, handler: "handleOmodos4_", method: "POST" },
    "v4.getSparepartRisk": { permission: "omodos4.sparepart", audit: false, idempotent: false, handler: "handleOmodos4_", method: "POST" },
    "v4.getReliability": { permission: "omodos4.reliability", audit: false, idempotent: false, handler: "handleOmodos4_", method: "POST" },
    "v4.getKpiStory": { permission: "omodos4.operation", audit: false, idempotent: false, handler: "handleOmodos4_", method: "POST" },
    "v4.getPeopleSkillGraph": { permission: "omodos4.people", audit: false, idempotent: false, handler: "handleOmodos4_", method: "POST" },
    "v4.getExpertFinder": { permission: "omodos4.people", audit: false, idempotent: false, handler: "handleOmodos4_", method: "POST" },
    "v4.getExperiencePassport": { permission: "omodos4.people", audit: false, idempotent: false, handler: "handleOmodos4_", method: "POST" },
    "v4.getImprovement": { permission: "omodos4.improvement", audit: false, idempotent: false, handler: "handleOmodos4_", method: "POST" },
    "v4.findSimilarImprovement": { permission: "omodos4.improvement", audit: false, idempotent: false, handler: "handleOmodos4_", method: "POST" },
    "v4.ask": { permission: "omodos4.ai", audit: true, idempotent: false, handler: "handleOmodos4_", method: "POST" },
    "v4.aiAsk": { permission: "omodos4.ai", audit: true, idempotent: false, handler: "executeV4Ai_", method: "POST" },
    "v4.getBrief": { permission: "omodos4.ai", audit: false, idempotent: false, handler: "handleOmodos4_", method: "POST" },
    "v4.getKnowledgeCandidates": { permission: "omodos4.ai", audit: false, idempotent: false, handler: "handleOmodos4_", method: "POST" },
    "v4.getFactoryBrain": { permission: "omodos4.factorybrain", audit: false, idempotent: false, handler: "handleOmodos4_", method: "POST" },
    "v4.runScenario": { permission: "omodos4.factorybrain", audit: false, idempotent: false, handler: "handleOmodos4_", method: "POST" },
    "v4.saveScenario": { permission: "omodos4.factorybrain", audit: true, idempotent: true, handler: "handleOmodos4_", method: "POST" },
    "v4.getScenarios": { permission: "omodos4.factorybrain", audit: false, idempotent: false, handler: "handleOmodos4_", method: "POST" },
    "v4.getTimeMachine": { permission: "omodos4.factorybrain", audit: false, idempotent: false, handler: "handleOmodos4_", method: "POST" },
    "v4.getBlackBox": { permission: "omodos4.factorybrain", audit: false, idempotent: false, handler: "handleOmodos4_", method: "POST" },
    "v4.getWarRoom": { permission: "omodos4.warroom", audit: false, idempotent: false, handler: "handleOmodos4_", method: "POST" },
    "v4.createWarRoom": { permission: "omodos4.warroom", audit: true, idempotent: true, handler: "handleOmodos4_", method: "POST" },
    "v4.updateWarRoom": { permission: "omodos4.warroom", audit: true, idempotent: true, handler: "handleOmodos4_", method: "POST" },
    // THEME
    "saveThemePref": { permission: null, audit: true, idempotent: true, handler: "handleSaveThemePref_" },
    "saveStylePref": { permission: null, audit: true, idempotent: true, handler: "handleSaveStylePref_" }
  };
  function resolveAction_(action) {
    return ACTION_REGISTRY[action] || null;
  }
  __name(resolveAction_, "resolveAction_");
  function handleLogin_(body) {
    var username = String(body.username || "").trim();
    var password = String(body.password || "");
    var rejectLogin_ = /* @__PURE__ */ __name(function(message, reason) {
      if (username) {
        try {
          writeAuditLog_(username, "", "login_failed", "user", username, null, { username, reason: reason || "rejected" }, body.transactionId || "", "failed");
        } catch (e) {
        }
      }
      return jsonOut_({ ok: false, error: message });
    }, "rejectLogin_");
    if (!username || !password) return rejectLogin_("Username dan password wajib", "missing_credentials");
    var foundRow = findUserRow_(username);
    if (!foundRow) return rejectLogin_("Username atau password salah.", "unknown_user");
    var u = foundRow.user;
    if (!normalizeBool_(u.Active)) return rejectLogin_("Akun non-aktif", "account_inactive");
    var ok = verifyPassword_(password, u.PasswordHash, u.Salt);
    if (!ok) return rejectLogin_("Username atau password salah.", "invalid_password");
    if (String(u.PasswordHash).indexOf("v2$") !== 0) {
      try {
        var newSalt = genSalt_(32);
        var newHash = hashPasswordV2_(password, newSalt, PBKDF2_ITERATIONS);
        var sh = getUsersSheet_();
        sh.getRange(foundRow.rowIndex, foundRow.headers.indexOf("PasswordHash") + 1).setValue(newHash);
        sh.getRange(foundRow.rowIndex, foundRow.headers.indexOf("Salt") + 1).setValue(newSalt);
        sh.getRange(foundRow.rowIndex, foundRow.headers.indexOf("PasswordVersion") + 1).setValue("v2");
        sh.getRange(foundRow.rowIndex, foundRow.headers.indexOf("UpdatedAt") + 1).setValue(/* @__PURE__ */ new Date());
        invalidateCacheForSheet_(SHEET_USERS);
      } catch (e) {
      }
    }
    var sess = createSession_(u);
    writeAuditLog_(username, u.Role, "login", "user", username, null, null, body.transactionId || "", "success");
    var permissionRows = getPermissionMatrix_();
    var permissionMap = {};
    permissionRows.forEach(function(r) {
      var key = String(r.PermissionKey || "");
      var role = String(r.Role || "");
      if (!key || !role) return;
      if (!permissionMap[key]) permissionMap[key] = {};
      permissionMap[key][role] = normalizeBool_(r.Allowed);
    });
    var lcRows = getLcPermissionMatrix_();
    var lcMap = {};
    lcRows.forEach(function(r) {
      var key = String(r.PermissionKey || "");
      var role = String(r.Role || "");
      if (!key || !role) return;
      if (!lcMap[key]) lcMap[key] = {};
      lcMap[key][role] = normalizeBool_(r.Allowed);
    });
    var userOut = {
      username: u.Username,
      role: u.Role,
      displayName: u.DisplayName,
      themePref: u.ThemePref || "",
      stylePref: u.StylePref || ""
    };
    var out = {
      ok: true,
      sessionToken: sess.token,
      expiresAt: sess.expires.toISOString(),
      user: userOut,
      permissions: permissionMap,
      lcPermissions: lcMap,
      features: getFeatureRegistryOut_()
    };
    out.data = {
      sessionToken: out.sessionToken,
      expiresAt: out.expiresAt,
      user: userOut,
      username: u.Username,
      role: u.Role,
      displayName: u.DisplayName,
      permissions: permissionMap,
      lcPermissions: lcMap,
      features: out.features
    };
    return jsonOut_(out);
  }
  __name(handleLogin_, "handleLogin_");
  function handleLogout_(body) {
    if (body.sessionToken) revokeSession_(body.sessionToken);
    return jsonOut_({ ok: true });
  }
  __name(handleLogout_, "handleLogout_");
  function handleGetUsers_(params, session) {
    requireSuperadmin_(session.username);
    var data = getAllUsers_().map(function(u) {
      return { username: u.Username, role: u.Role, displayName: u.DisplayName, active: normalizeBool_(u.Active) };
    });
    return jsonOut_({ ok: true, data });
  }
  __name(handleGetUsers_, "handleGetUsers_");
  function doGet(e) {
    try {
      ensureRbacBootstrap_();
      if (!e || !e.parameter || !e.parameter.action) {
        return HtmlService.createHtmlOutputFromFile("index").setTitle("OMODOS").addMetaTag("viewport", "width=device-width, initial-scale=1").setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
      }
      var action = String(e.parameter.action || "").trim();
      var reg = resolveAction_(action);
      if (!reg) {
        return jsonOut_({ ok: false, error: "UNKNOWN_ACTION: " + action });
      } else {
        if (reg.method && reg.method !== "GET") {
          return jsonOut_({ ok: false, error: "METHOD_NOT_ALLOWED: use POST for " + action });
        }
        if (reg.permission) {
          var session = requireSession_(e.parameter.sessionToken || "");
          e.parameter.actor = session.username;
          e.parameter.role = session.role;
          requirePermission_(session.role, reg.permission);
        } else if (action !== "features" && action !== "health" && action !== "permissions" && action !== "lcPermissions" && action !== "users") {
          var sess = requireSession_(e.parameter.sessionToken || "");
          e.parameter.actor = sess.username;
          e.parameter.role = sess.role;
        }
      }
      return handleLegacyGet_(e);
    } catch (err) {
      return handleError_(err);
    }
  }
  __name(doGet, "doGet");
  async function doPost(e) {
    try {
      ensureRbacBootstrap_();
      var body = {};
      try {
        body = e.body || JSON.parse(e.postData.contents || "{}");
      } catch (parseErr) {
        throw { code: "VALIDATION_ERROR", message: "Invalid JSON" };
      }
      var action = String(body.action || "").trim();
      if (!action) throw { code: "VALIDATION_ERROR", message: "action wajib" };
      var reg = resolveAction_(action);
      if (!reg) throw { code: "UNKNOWN_ACTION", message: "Action tidak terdaftar: " + action };
      var session = null;
      if (action !== "login") {
        session = requireSession_(body.sessionToken || "");
        body.actor = session.username;
        body.role = session.role;
      }
      var txId = body.transactionId || body.clientTransactionId || "";
      var requestHash = hashRequest_(body);
      if (txId && reg && reg.idempotent) {
        var existing = getTransactionResult_(txId, action, requestHash);
        if (existing) {
          return jsonOut_(existing);
        }
      }
      if (reg && reg.permission) {
        if (!session) throw { code: "AUTH_REQUIRED", message: "Session required" };
        requirePermission_(session.role, reg.permission);
      }
      validatePayload_(action, body);
      var resultJson = await handleLegacyPost_(body);
      if (txId && reg && reg.idempotent) {
        try {
          var parsedResult = JSON.parse(resultJson.getContent());
          saveTransactionResult_(txId, action, body.actor || "", requestHash, parsedResult, parsedResult.ok ? "success" : "failed");
          if (parsedResult.ok) {
            invalidateCacheForSheet_("ALL");
            var cache = getCache_();
            if (cache) {
              try {
                cache.remove("perm_matrix");
                cache.remove("feature_registry");
              } catch (e2) {
              }
            }
          }
          if (reg.audit) {
            writeAuditLog_(body.actor || "", body.role || "", action, String(action || "").indexOf("v4.") === 0 ? "OMODOS4" : reg.permission || action, body.id || body.ID || txId, null, body, txId, parsedResult.ok ? "success" : "failed");
          }
          return jsonOut_(parsedResult);
        } catch (e2) {
          return resultJson;
        }
      } else {
        if (reg && reg.audit) {
          try {
            var parsed = JSON.parse(resultJson.getContent());
            writeAuditLog_(body.actor || "", body.role || "", action, String(action || "").indexOf("v4.") === 0 ? "OMODOS4" : reg.permission || action, body.id || body.ID || "", null, body, txId, parsed.ok ? "success" : "failed");
          } catch (e2) {
          }
        }
        return resultJson;
      }
    } catch (err) {
      try {
        var failedAction = String(body && body.action || action || "").trim();
        if (failedAction === "login") {
          var attemptedUser = String(body && body.username || "").trim();
          if (attemptedUser) writeAuditLog_(attemptedUser, "", "login_failed", "user", attemptedUser, null, { username: attemptedUser }, body && body.transactionId || "", "failed");
        } else if (failedAction && body && body.actor) {
          var failedReg = resolveAction_(failedAction);
          if (failedReg && failedReg.audit) {
            writeAuditLog_(body.actor || "", body.role || "", failedAction, String(failedAction).indexOf("v4.") === 0 ? "OMODOS4" : failedReg.permission || failedAction, body.id || body.ID || "", null, body, body.transactionId || body.clientTransactionId || "", "failed");
          }
        }
      } catch (auditErr) {
      }
      return handleError_(err);
    }
  }
  __name(doPost, "doPost");
  function handleLegacyGet_(e) {
    var action = e.parameter.action || "list";
    var params = e.parameter;
    if (action === "users") {
      requireSuperadmin_(params.actor);
      var data = getAllUsers_().map(function(u) {
        return { username: u.Username, role: u.Role, displayName: u.DisplayName, active: normalizeBool_(u.Active) };
      });
      return jsonOut_({ ok: true, data });
    }
    if (action === "permissions") {
      var permRows = String(params.fresh || "") === "1" ? readRoleAccessRowsFresh_(getPermissionsSheet_()) : getPermissionMatrix_();
      return jsonOut_({ ok: true, data: permissionRowsToMap_(permRows) });
    }
    if (action === "lcPermissions") {
      var lcRows = String(params.fresh || "") === "1" ? readRoleAccessRowsFresh_(getLcPermissionsSheet_()) : getLcPermissionMatrix_();
      return jsonOut_({ ok: true, data: permissionRowsToMap_(lcRows) });
    }
    if (action === "features") return jsonOut_({ ok: true, data: getFeatureRegistryOut_() });
    try {
      if (action === "bootstrap" && typeof getBootstrap_ === "function") return jsonOut_({ ok: true, data: getBootstrap_(params.role || "") });
      if (action === "list" && typeof getLogbookList_ === "function") return jsonDataOut_(getLogbookList_(params));
      if (action === "machines" && typeof getMachinesList_ === "function") return jsonDataOut_(getMachinesList_());
      if (action === "patrolChecklistTemplate" && typeof getPatrolTemplateList_ === "function") return jsonDataOut_(getPatrolTemplateList_());
      if (action === "personil" && typeof getPersonilList_ === "function") return jsonDataOut_(getPersonilList_());
      if (action === "piPersonnelMaster" && typeof getPiPersonnelMaster_ === "function") return jsonDataOut_(getPiPersonnelMaster_());
      if (action === "sparepartLokasi" && typeof getSparepartLokasiMerged_ === "function") return jsonDataOut_(getSparepartLokasiMerged_());
      if (action === "sparepartEta" && typeof getSparepartEta_ === "function") return jsonDataOut_(getSparepartEta_());
      if (action === "sparepartOpname" && typeof getSparepartOpname_ === "function") return jsonDataOut_(getSparepartOpname_());
      if (action === "kpiKerjaList" && typeof getKpiKerjaList_ === "function") return jsonDataOut_(getKpiKerjaList_());
      if (action === "kpiDepartmentData" && typeof getKpiDepartmentData_ === "function") return jsonOut_({ ok: true, data: getKpiDepartmentData_() });
      if (action === "machineBreakdownList" && typeof getMachineBreakdownList_ === "function") return jsonDataOut_(getMachineBreakdownList_());
      if (action === "correctiveReportList" && typeof getCorrectiveReportList_ === "function") return jsonDataOut_(getCorrectiveReportList_());
      if (action === "energyUtilityList" && typeof getEnergyUtilityList_ === "function") return jsonDataOut_(getEnergyUtilityList_());
      if (action === "stockSparepart" && typeof getStockSparepart_ === "function") return jsonDataOut_(getStockSparepart_());
      if (action === "piHardSkillStandard" && typeof getPiHardSkillStandard_ === "function") return jsonOut_({ ok: true, data: getPiHardSkillStandard_() });
      if (action === "piHardSkillAssessments" && typeof getPiHardSkillAssessments_ === "function") return jsonOut_({ ok: true, data: getPiHardSkillAssessments_() });
      if (action === "piSoftskillAssessments" && typeof getPiSoftskillAssessments_ === "function") return jsonOut_({ ok: true, data: getPiSoftskillAssessments_() });
      if (typeof getGenericRows_ === "function") {
      }
    } catch (e2) {
      return jsonOut_({ ok: false, error: String(e2) });
    }
    return jsonOut_({ ok: false, error: "Unknown action: " + action });
  }
  __name(handleLegacyGet_, "handleLegacyGet_");
  function handleLegacyPost_(body) {
    var action = body.action;
    if (String(action || "").indexOf("v4.") === 0) return handleOmodos4_(body);
    if (action === "login") return handleLogin_(body);
    if (action === "logout") return handleLogout_(body);
    if (action === "createUser") return handleCreateUser_(body);
    if (action === "updateUser") return handleUpdateUser_(body);
    if (action === "resetPassword") return handleResetPassword_(body);
    if (action === "setUserActive") return handleSetUserActive_(body);
    if (action === "deleteUser") return handleDeleteUser_(body);
    if (action === "savePermissions") return handleSavePermissions_(body);
    if (action === "saveLcPermissions") return handleSaveLcPermissions_(body);
    if (action === "saveRoleAccessConfig") return handleSaveRoleAccessConfig_(body);
    if (action === "fixLogbookDataQuality" && typeof handleFixLogbookDataQuality_ === "function") return handleFixLogbookDataQuality_(body);
    if (action === "saveThemePref" && typeof handleSaveThemePref_ === "function") return handleSaveThemePref_(body);
    if (action === "saveStylePref" && typeof handleSaveStylePref_ === "function") return handleSaveStylePref_(body);
    if (action === "addEntry" && typeof addEntry_ === "function") return addEntry_(body);
    if (action === "updateEntry" && typeof updateEntry_ === "function") return updateEntry_(body);
    if (action === "updateStatus" && typeof updateStatus_ === "function") return updateStatus_(body);
    if (action === "deleteEntry" && typeof deleteEntry_ === "function") return deleteEntry_(body);
    if (action === "addMachine" && typeof addMachine_ === "function") return addMachine_(body);
    if (action === "updateMachine" && typeof updateMachine_ === "function") return updateMachine_(body);
    if (action === "deleteMachine" && typeof deleteMachine_ === "function") return deleteMachine_(body);
    if (action === "savePatrolTemplateItem" && typeof savePatrolTemplateItem_ === "function") return savePatrolTemplateItem_(body);
    if (action === "deletePatrolTemplateItem" && typeof deletePatrolTemplateItem_ === "function") return deletePatrolTemplateItem_(body);
    if (action === "addPersonil" && typeof addPersonil_ === "function") return addPersonil_(body);
    if (action === "updatePersonil" && typeof updatePersonil_ === "function") return updatePersonil_(body);
    if (action === "deletePersonil" && typeof deletePersonil_ === "function") return deletePersonil_(body);
    if (action === "savePiPersonnelMaster" && typeof savePiPersonnelMaster_ === "function") return savePiPersonnelMaster_(body);
    if (action === "deletePiPersonnelMaster" && typeof deletePiPersonnelMaster_ === "function") return deletePiPersonnelMaster_(body);
    if (action === "saveSparepartLokasi" && typeof saveSparepartLokasi_ === "function") return saveSparepartLokasi_(body);
    if (action === "deleteSparepartLokasi" && typeof deleteSparepartLokasi_ === "function") return deleteSparepartLokasi_(body);
    if (action === "saveSparepartEta" && typeof saveSparepartEta_ === "function") return saveSparepartEta_(body);
    if (action === "deleteSparepartEta" && typeof deleteSparepartEta_ === "function") return deleteSparepartEta_(body);
    if (action === "saveSparepartOpname" && typeof saveSparepartOpname_ === "function") return saveSparepartOpname_(body);
    if (action === "deleteSparepartOpname" && typeof deleteSparepartOpname_ === "function") return deleteSparepartOpname_(body);
    if (action === "saveKpiKerja" && typeof saveKpiKerja_ === "function") return saveKpiKerja_(body);
    if (action === "deleteKpiKerja" && typeof deleteKpiKerja_ === "function") return deleteKpiKerja_(body);
    if (action === "saveMachineBreakdown" && typeof saveMachineBreakdown_ === "function") return saveMachineBreakdown_(body);
    if (action === "deleteMachineBreakdown" && typeof deleteMachineBreakdown_ === "function") return deleteMachineBreakdown_(body);
    if (action === "saveCorrectiveReport" && typeof saveCorrectiveReport_ === "function") return saveCorrectiveReport_(body);
    if (action === "deleteCorrectiveReport" && typeof deleteCorrectiveReport_ === "function") return deleteCorrectiveReport_(body);
    if (action === "saveEnergyUtility" && typeof saveEnergyUtility_ === "function") return saveEnergyUtility_(body);
    if (action === "deleteEnergyUtility" && typeof deleteEnergyUtility_ === "function") return deleteEnergyUtility_(body);
    if (action === "saveRcaReport" && typeof saveRcaReport_ === "function") return saveRcaReport_(body);
    if (action === "deleteRcaReport" && typeof deleteRcaReport_ === "function") return deleteRcaReport_(body);
    if (action === "saveKbEntry" && typeof saveKbEntry_ === "function") return saveKbEntry_(body);
    if (action === "deleteKbEntry" && typeof deleteKbEntry_ === "function") return deleteKbEntry_(body);
    if (action === "saveMeeting" && typeof saveMeeting_ === "function") return saveMeeting_(body);
    if (action === "deleteMeeting" && typeof deleteMeeting_ === "function") return deleteMeeting_(body);
    if (action === "saveMeetingAction" && typeof saveMeetingAction_ === "function") return saveMeetingAction_(body);
    if (action === "deleteMeetingAction" && typeof deleteMeetingAction_ === "function") return deleteMeetingAction_(body);
    if (action === "savePiHardskill" && typeof savePiHardskill_ === "function") return savePiHardskill_(body);
    if (action === "savePiSoftskill" && typeof savePiSoftskill_ === "function") return savePiSoftskill_(body);
    if (action === "pmcSaveProject" && typeof pmcSaveProject_ === "function") return pmcSaveProject_(body);
    if (action === "pmcDeleteProject" && typeof pmcDeleteProject_ === "function") return pmcDeleteProject_(body);
    if (action === "pmcAddProgressLog" && typeof pmcAddProgressLog_ === "function") return pmcAddProgressLog_(body);
    if (action === "updateApprovalDecision" && typeof updateApprovalDecision_ === "function") return updateApprovalDecision_(body);
    return jsonOut_({ ok: false, error: "Unknown action: " + action });
  }
  __name(handleLegacyPost_, "handleLegacyPost_");
  function getPiSoftskillAssessments_() {
    return getGenericRows_(SHEET_PI_SOFTSKILL, PI_SOFTSKILL_HEADERS).map(function(r) {
      return {
        id: r["ID"],
        timestamp: r["Timestamp"],
        nama: r["Nama"],
        assessor: r["Assessor"],
        tanggal: r["Tanggal"],
        items: safeJsonParse_(r["ItemsJSON"] || "[]", []),
        transactionId: r["TransactionID"] || "",
        actor: r["Actor"] || ""
      };
    });
  }
  __name(getPiSoftskillAssessments_, "getPiSoftskillAssessments_");
  function savePiSoftskill_(body) {
    var assessment = body.assessment || {};
    if (!assessment.nama) return jsonOut_({ ok: false, error: "Nama wajib" });
    var sh = getOrCreateSheet_(SHEET_PI_SOFTSKILL, PI_SOFTSKILL_HEADERS);
    var id = assessment.id || Utilities.getUuid();
    var now = nowIso_();
    var txId = body.transactionId || "TX-" + Utilities.getUuid();
    var existingTx = getTransactionResult_(txId);
    if (existingTx) return jsonOut_(existingTx);
    var itemsJson = JSON.stringify(assessment.items || assessment.data || []);
    appendCanonical_(sh, PI_SOFTSKILL_HEADERS, [id, now, assessment.nama, assessment.assessor || body.actor || "", assessment.tanggal || now, itemsJson, txId, body.actor || ""]);
    invalidateCacheForSheet_(SHEET_PI_SOFTSKILL);
    var res = { ok: true, id, transactionId: txId };
    saveTransactionResult_(txId, "savePiSoftskill", body.actor || "", hashRequest_(assessment), res, "success");
    return jsonOut_(res);
  }
  __name(savePiSoftskill_, "savePiSoftskill_");
  function addEntryLegacyV1_(body) {
    try {
      var data = body.data || body;
      if (!data) throw { code: "VALIDATION_ERROR", message: "Data kosong" };
      var sh = getOrCreateSheet_(SHEET_LOGBOOK, ["ID", "Timestamp", "Kode Mesin", "Nama Mesin", "Lokasi/Area", "Deskripsi Masalah", "Nama Material", "Material Number SAP", "Nama Pelapor", "Shift", "Prioritas", "Status", "TransactionID", "CreatedBy"]);
      var id = "LB-" + Utilities.formatDate(/* @__PURE__ */ new Date(), Session.getScriptTimeZone(), "yyyyMMdd-HHmmss") + "-" + Math.floor(Math.random() * 900 + 100);
      var txId = body.transactionId || "OMD-" + Utilities.formatDate(/* @__PURE__ */ new Date(), Session.getScriptTimeZone(), "yyyyMMdd") + "-" + Utilities.getUuid().substring(0, 8);
      var row = [id, nowIso_(), data.kodeMesin || data["Kode Mesin"] || "", data.namaMesin || data["Nama Mesin"] || "", data.lokasi || data["Lokasi/Area"] || "", data.deskripsi || data["Deskripsi Masalah"] || "", data.namaMaterial || "", data.materialNumber || "", body.actor || data.pelapor || "", data.shift || "", data.prioritas || "", data.status || "Open", txId, body.actor || ""];
      sh.appendRow(row);
      invalidateCacheForSheet_(SHEET_LOGBOOK);
      var res = { ok: true, id, transactionId: txId };
      saveTransactionResult_(txId, "addEntry", body.actor || "", hashRequest_(data), res, "success");
      return jsonOut_(res);
    } catch (e) {
      return jsonOut_({ ok: false, error: String(e.message || e) });
    }
  }
  __name(addEntryLegacyV1_, "addEntryLegacyV1_");
  function updateStatusLegacyV1_(body) {
    try {
      var id = body.id || body.ID;
      if (!id) throw { code: "VALIDATION_ERROR", message: "ID wajib" };
      var sh = getSS_().getSheetByName(SHEET_LOGBOOK);
      if (!sh) throw { code: "NOT_FOUND", message: "Sheet Logbook tidak ada" };
      var values = sh.getDataRange().getValues();
      var headers = values[0];
      var idCol = headers.indexOf("ID");
      var statusCol = headers.indexOf("Status");
      if (idCol === -1) throw { code: "NOT_FOUND", message: "Kolom ID tidak ada" };
      for (var i = 1; i < values.length; i++) {
        if (String(values[i][idCol]) === String(id)) {
          var before = rowToObj_(headers, values[i]);
          if (statusCol !== -1 && body.status) sh.getRange(i + 1, statusCol + 1).setValue(body.status);
          if (body.data) {
            Object.keys(body.data).forEach(function(k) {
              var col = headers.indexOf(k);
              if (col !== -1) sh.getRange(i + 1, col + 1).setValue(body.data[k]);
            });
          }
          invalidateCacheForSheet_(SHEET_LOGBOOK);
          var txId = body.transactionId || "";
          var res = { ok: true, id, transactionId: txId };
          if (txId) saveTransactionResult_(txId, "updateStatus", body.actor || "", hashRequest_(body), res, "success");
          writeAuditLog_(body.actor || "", body.role || "", "updateStatus", "logbook", id, before, body, txId, "success");
          return jsonOut_(res);
        }
      }
      throw { code: "NOT_FOUND", message: "ID tidak ditemukan" };
    } catch (e) {
      return handleError_(e);
    }
  }
  __name(updateStatusLegacyV1_, "updateStatusLegacyV1_");
  function deleteEntryLegacyV1_(body) {
    try {
      var id = body.id || body.ID;
      if (!id) throw { code: "VALIDATION_ERROR", message: "ID wajib" };
      var sh = getSS_().getSheetByName(SHEET_LOGBOOK);
      if (!sh) throw { code: "NOT_FOUND", message: "Sheet tidak ada" };
      var values = sh.getDataRange().getValues();
      var headers = values[0];
      var idCol = headers.indexOf("ID");
      ensureHeaderColumns_(sh, ["DeletedAt", "DeletedBy", "DeleteReason"]);
      var delAtCol = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].indexOf("DeletedAt");
      var delByCol = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].indexOf("DeletedBy");
      for (var i = 1; i < values.length; i++) {
        if (String(values[i][idCol]) === String(id)) {
          var before = rowToObj_(headers, values[i]);
          if (delAtCol !== -1) sh.getRange(i + 1, delAtCol + 1).setValue(nowIso_());
          if (delByCol !== -1) sh.getRange(i + 1, delByCol + 1).setValue(body.actor || "");
          invalidateCacheForSheet_(SHEET_LOGBOOK);
          writeAuditLog_(body.actor || "", body.role || "", "deleteEntry", "logbook", id, before, null, body.transactionId || "", "soft_deleted");
          return jsonOut_({ ok: true, id, softDeleted: true });
        }
      }
      throw { code: "NOT_FOUND", message: "ID tidak ditemukan" };
    } catch (e) {
      return handleError_(e);
    }
  }
  __name(deleteEntryLegacyV1_, "deleteEntryLegacyV1_");
  function getLogbookList_(params) {
    params = params || {};
    var since = params.since ? new Date(params.since) : null;
    if (since && !isNaN(since.getTime())) {
      var sh0 = getOrCreateSheet_(SHEET_LOGBOOK, LOGBOOK_HEADERS);
      var lastRow0 = sh0.getLastRow();
      if (lastRow0 < 2) return { changed: [], deletedIds: [], serverTime: nowIso_() };
      var headers0 = sh0.getRange(1, 1, 1, sh0.getLastColumn()).getValues()[0];
      var data0 = sh0.getRange(2, 1, lastRow0 - 1, sh0.getLastColumn()).getValues();
      var idCol0 = headers0.indexOf("ID");
      var updAtCol0 = headers0.indexOf("UpdatedAt");
      var tsCol0 = headers0.indexOf("Timestamp Input");
      var delAtCol0 = headers0.indexOf("DeletedAt");
      var changed = [], deletedIds = [];
      for (var i = 0; i < data0.length; i++) {
        var r = data0[i];
        if (!r[idCol0]) continue;
        var isDeleted = delAtCol0 !== -1 && r[delAtCol0] && String(r[delAtCol0]).trim() !== "";
        var stampRaw = updAtCol0 !== -1 && r[updAtCol0] ? r[updAtCol0] : tsCol0 !== -1 ? r[tsCol0] : null;
        var stamp = stampRaw instanceof Date ? stampRaw : new Date(String(stampRaw || ""));
        var isNewer = !isNaN(stamp.getTime()) && stamp > since;
        if (!isNewer) continue;
        if (isDeleted) {
          deletedIds.push(String(r[idCol0]));
          continue;
        }
        var obj = rowToObj_(headers0, r);
        try {
          obj["Lampiran (JSON)"] = safeJsonParse_(obj["Lampiran (JSON)"] || "[]", []);
        } catch (e) {
          obj["Lampiran (JSON)"] = [];
        }
        if (obj["Tanggal"] instanceof Date) obj["Tanggal"] = Utilities.formatDate(obj["Tanggal"], Session.getScriptTimeZone(), "yyyy-MM-dd");
        if (obj["Timestamp Input"] instanceof Date) obj["Timestamp Input"] = obj["Timestamp Input"].toISOString();
        changed.push(obj);
      }
      changed.reverse();
      return { changed, deletedIds, serverTime: nowIso_() };
    }
    return getLogbookListFull_();
  }
  __name(getLogbookList_, "getLogbookList_");
  function getLogbookListFull_() {
    var cache = getCache_();
    var cacheKey = "rows_Logbook_v3_full";
    if (cache) {
      var cached = cache.get(cacheKey);
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch (e) {
        }
      }
    }
    var sh = getOrCreateSheet_(SHEET_LOGBOOK, LOGBOOK_HEADERS);
    var lastRow = sh.getLastRow();
    if (lastRow < 2) return [];
    var startRow = 2;
    var numRows = lastRow - startRow + 1;
    var range = sh.getRange(startRow, 1, numRows, sh.getLastColumn());
    var data = range.getValues();
    var headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
    var deletedAtCol = headers.indexOf("DeletedAt");
    var rows = [];
    for (var i = 0; i < data.length; i++) {
      var r = data[i];
      if (r[0] === "") continue;
      if (deletedAtCol !== -1 && r[deletedAtCol] && String(r[deletedAtCol]).trim() !== "") continue;
      var obj = rowToObj_(headers, r);
      try {
        obj["Lampiran (JSON)"] = safeJsonParse_(obj["Lampiran (JSON)"] || "[]", []);
      } catch (e) {
        obj["Lampiran (JSON)"] = [];
      }
      if (obj["Tanggal"] instanceof Date) {
        obj["Tanggal"] = Utilities.formatDate(obj["Tanggal"], Session.getScriptTimeZone(), "yyyy-MM-dd");
      }
      if (obj["Timestamp Input"] instanceof Date) {
        obj["Timestamp Input"] = obj["Timestamp Input"].toISOString();
      }
      rows.push(obj);
    }
    rows.reverse();
    if (cache) {
      try {
        cache.put(cacheKey, JSON.stringify(rows), CACHE_TTL_SECONDS);
      } catch (e) {
      }
    }
    return rows;
  }
  __name(getLogbookListFull_, "getLogbookListFull_");
  function getLogbookListSot_() {
    var cache = getCache_();
    var cacheKey = "rows_Logbook_sot";
    if (cache) {
      var cached = cache.get(cacheKey);
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch (e) {
        }
      }
    }
    var sh = getOrCreateSheet_(SHEET_LOGBOOK, LOGBOOK_HEADERS);
    var lastRow = sh.getLastRow();
    if (lastRow < 2) return [];
    var startRow = 2;
    var numRows = lastRow - startRow + 1;
    var range = sh.getRange(startRow, 1, numRows, sh.getLastColumn());
    var data = range.getValues();
    var headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
    var deletedAtCol = headers.indexOf("DeletedAt");
    var tanggalCol = headers.indexOf("Tanggal");
    var cutoff = new Date(SOT_CUTOFF_DATE);
    var rows = [];
    for (var i = 0; i < data.length; i++) {
      var r = data[i];
      if (r[0] === "") continue;
      if (deletedAtCol !== -1 && r[deletedAtCol] && String(r[deletedAtCol]).trim() !== "") continue;
      if (tanggalCol !== -1) {
        var d = r[tanggalCol] instanceof Date ? r[tanggalCol] : new Date(r[tanggalCol]);
        if (isNaN(d.getTime()) || d < cutoff) continue;
      }
      var obj = rowToObj_(headers, r);
      try {
        obj["Lampiran (JSON)"] = safeJsonParse_(obj["Lampiran (JSON)"] || "[]", []);
      } catch (e) {
        obj["Lampiran (JSON)"] = [];
      }
      if (obj["Tanggal"] instanceof Date) {
        obj["Tanggal"] = Utilities.formatDate(obj["Tanggal"], Session.getScriptTimeZone(), "yyyy-MM-dd");
      }
      if (obj["Timestamp Input"] instanceof Date) {
        obj["Timestamp Input"] = obj["Timestamp Input"].toISOString();
      }
      rows.push(obj);
    }
    rows.reverse();
    if (cache) {
      try {
        cache.put(cacheKey, JSON.stringify(rows), CACHE_TTL_SECONDS);
      } catch (e) {
      }
    }
    return rows;
  }
  __name(getLogbookListSot_, "getLogbookListSot_");
  function addEntryLegacyV2_(body) {
    const sh = getOrCreateSheet_(SHEET_LOGBOOK, LOGBOOK_HEADERS);
    const d = body.entry || {};
    const missing = REQUIRED_ENTRY_FIELDS.filter(function(f) {
      return !d[f] || String(d[f]).trim() === "";
    });
    if (missing.length) {
      return jsonOut_({ ok: false, error: "Field wajib belum diisi: " + missing.join(", ") });
    }
    const usesSparepart = !!String(d.namaMaterial || d.materialNumberSAP || "").trim();
    const attachments = [];
    if (Array.isArray(body.files)) {
      const folder = getOrCreateDriveFolder_();
      body.files.forEach(function(f) {
        try {
          const up = uploadBase64File_(folder, f, f.name || "lampiran", f.mimeType || "application/octet-stream");
          attachments.push({
            id: up.id,
            name: up.name,
            mimeType: up.mimeType,
            type: up.mimeType && up.mimeType.indexOf("video") === 0 ? "video" : "image",
            thumbUrl: up.thumbUrl,
            viewUrl: up.viewUrl,
            previewUrl: up.previewUrl
          });
        } catch (err) {
          throw new Error("Upload lampiran gagal untuk " + (f.name || "unknown") + ": " + String(err && err.message || err));
        }
      });
    }
    const id = "LB-" + Utilities.formatDate(/* @__PURE__ */ new Date(), Session.getScriptTimeZone(), "yyyyMMdd-HHmmss") + "-" + Math.floor(Math.random() * 900 + 100);
    const waktu = d.waktu || Utilities.formatDate(/* @__PURE__ */ new Date(), Session.getScriptTimeZone(), "HH:mm");
    const rowMap = {
      "ID": id,
      "Timestamp Input": /* @__PURE__ */ new Date(),
      "Tanggal": d.tanggal || "",
      "Waktu": waktu,
      "Shift": d.shift || "",
      "Nama Pelapor": d.namaPelapor || "",
      "Kode Mesin": d.kodeMesin || "",
      "Nama Mesin": d.namaMesin || "",
      "Lokasi/Area": d.lokasi || "",
      "Jenis Pekerjaan": d.jenisPekerjaan || "",
      "Prioritas": d.prioritas || "",
      "Deskripsi Masalah": d.deskripsiMasalah || "",
      "Tindakan Perbaikan": d.tindakanPerbaikan || "",
      "Spare Part Digunakan": d.sparePart || "",
      "Status": d.status || "Proses",
      "Jam Mulai": d.jamMulai || "",
      "Jam Selesai": d.jamSelesai || "",
      "Downtime (menit)": d.downtime || "",
      "Lampiran (JSON)": JSON.stringify(attachments),
      "Catatan Tambahan": d.catatan || "",
      "Grouping Pekerjaan": d.groupingPekerjaan || "",
      "Grouping Team": d.groupingTeam || "",
      "Nomor Notifikasi Pekerjaan": d.nomorNotifikasi || "",
      "Nama Unit": d.namaUnit || "",
      "Nama Material": d.namaMaterial || "",
      "Material Number SAP": d.materialNumberSAP || "",
      "Status Sparepart": d.namaMaterial || d.materialNumberSAP ? "PENDING" : ""
    };
    const actualHeaders = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
    sh.appendRow(actualHeaders.map(function(h) {
      return rowMap.hasOwnProperty(h) ? rowMap[h] : "";
    }));
    return jsonOut_({ ok: true, id, attachments });
  }
  __name(addEntryLegacyV2_, "addEntryLegacyV2_");
  function updateStatus_(body) {
    const sh = getOrCreateSheet_(SHEET_LOGBOOK, LOGBOOK_HEADERS);
    const data = sh.getDataRange().getValues();
    const headers = data[0];
    const idCol = headers.indexOf("ID");
    const statusCol = headers.indexOf("Status");
    if (idCol === -1 || statusCol === -1) return jsonOut_({ ok: false, error: "Kolom Logbook tidak lengkap" });
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][idCol]) === String(body.id)) {
        sh.getRange(i + 1, statusCol + 1).setValue(body.status || data[i][statusCol]);
        const finishCol = headers.indexOf("Jam Selesai");
        const downtimeCol = headers.indexOf("Downtime (menit)");
        if (body.jamSelesai && finishCol !== -1) sh.getRange(i + 1, finishCol + 1).setValue(body.jamSelesai);
        if (body.downtime !== void 0 && downtimeCol !== -1) sh.getRange(i + 1, downtimeCol + 1).setValue(body.downtime);
        var updAtCol = headers.indexOf("UpdatedAt");
        if (updAtCol !== -1) sh.getRange(i + 1, updAtCol + 1).setValue(nowIso_());
        invalidateCacheForSheet_(SHEET_LOGBOOK);
        return jsonOut_({ ok: true, id: body.id, transactionId: body.transactionId || "" });
      }
    }
    return jsonOut_({ ok: false, error: "ID tidak ditemukan" });
  }
  __name(updateStatus_, "updateStatus_");
  function deleteEntryLegacyV2_(body) {
    const sh = getOrCreateSheet_(SHEET_LOGBOOK, LOGBOOK_HEADERS);
    const data = sh.getDataRange().getValues();
    const headers = data[0];
    const idCol = headers.indexOf("ID");
    for (var i = 1; i < data.length; i++) {
      if (data[i][idCol] === body.id) {
        sh.deleteRow(i + 1);
        return jsonOut_({ ok: true });
      }
    }
    return jsonOut_({ ok: false, error: "ID tidak ditemukan" });
  }
  __name(deleteEntryLegacyV2_, "deleteEntryLegacyV2_");
  function getGenericRows_(sheetName, headers) {
    headers = headers || [];
    const cache = getCache_();
    const cacheKey = "rows_" + sheetName;
    if (cache) {
      const cached = cache.get(cacheKey);
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch (e) {
        }
      }
    }
    const sh = getOrCreateSheet_(sheetName, headers);
    const data = sh.getDataRange().getValues();
    if (!data.length) return [];
    const hdr = data.shift();
    const rows = data.filter(function(r) {
      return r[0] !== "";
    }).map(function(r) {
      return rowToObj_(hdr, r);
    }).filter(function(o) {
      return !o.DeletedAt || String(o.DeletedAt).trim() === "";
    });
    if (cache) {
      try {
        cache.put(cacheKey, JSON.stringify(rows), CACHE_TTL_SECONDS);
      } catch (e) {
      }
    }
    return rows;
  }
  __name(getGenericRows_, "getGenericRows_");
  function findRowByColumnValue_(sh, columnName, value) {
    const data = sh.getDataRange().getValues();
    const headers = data[0];
    const idx = headers.indexOf(columnName);
    if (idx === -1) return null;
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][idx]) === String(value)) {
        return { rowIndex: i + 1, headers, row: data[i] };
      }
    }
    return null;
  }
  __name(findRowByColumnValue_, "findRowByColumnValue_");
  function getMachinesList_() {
    return getGenericRows_(SHEET_MESIN, MESIN_HEADERS);
  }
  __name(getMachinesList_, "getMachinesList_");
  function getPersonilList_() {
    return getGenericRows_(SHEET_PERSONIL, PERSONIL_HEADERS);
  }
  __name(getPersonilList_, "getPersonilList_");
  function getPiPersonnelMaster_() {
    return getGenericRows_(SHEET_PI_PERSONNEL, PI_PERSONNEL_HEADERS);
  }
  __name(getPiPersonnelMaster_, "getPiPersonnelMaster_");
  function getSparepartEta_() {
    return getGenericRows_(SHEET_SPAREPART_ETA, SPAREPART_ETA_HEADERS);
  }
  __name(getSparepartEta_, "getSparepartEta_");
  function getSparepartOpname_() {
    return getGenericRows_(SHEET_SPAREPART_OPNAME, SPAREPART_OPNAME_HEADERS);
  }
  __name(getSparepartOpname_, "getSparepartOpname_");
  function getStockSparepart_() {
    return getGenericRows_(SHEET_STOCK_SPAREPART, ["ID", "Part No", "Nama Material", "Material Number SAP", "Stock", "Satuan", "Lokasi", "Updated At"]);
  }
  __name(getStockSparepart_, "getStockSparepart_");
  function findMachineRow_(sh, kodeOrNama) {
    const data = sh.getDataRange().getValues();
    const headers = data[0];
    const kodeCol = headers.indexOf("Kode Mesin");
    const namaCol = headers.indexOf("Nama Mesin");
    for (var i = 1; i < data.length; i++) {
      const key = data[i][kodeCol] || data[i][namaCol];
      if (String(key) === String(kodeOrNama)) {
        return { rowIndex: i + 1, headers, row: data[i] };
      }
    }
    return null;
  }
  __name(findMachineRow_, "findMachineRow_");
  function addMachine_(body) {
    const sh = getOrCreateSheet_(SHEET_MESIN, MESIN_HEADERS);
    const d = body.machine || {};
    if (!String(d.kodeMesin || "").trim() || !String(d.namaMesin || "").trim()) return jsonOut_({ ok: false, error: "Kode Mesin dan Nama Mesin wajib diisi." });
    if (findMachineRow_(sh, d.kodeMesin)) return jsonOut_({ ok: false, error: "Kode Mesin sudah digunakan." });
    let manualUrl = "";
    if (body.manualFile && body.manualFile.base64) {
      try {
        manualUrl = uploadBase64File_(getOrCreateManualFolder_(), body.manualFile, "Manual Book.pdf", "application/pdf").previewUrl;
      } catch (err) {
        manualUrl = "";
      }
    }
    const rowMap = {
      "Kode Mesin": d.kodeMesin || "",
      "Nama Mesin": d.namaMesin || "",
      "Lokasi/Area": d.lokasi || "",
      "Kategori": d.kategori || "",
      "Spesifikasi Mesin": d.spesifikasiMesin || "",
      "Manual PDF URL": manualUrl,
      "Model": d.model || "",
      "Deskripsi Mesin": d.deskripsiMesin || "",
      "Fungsi Mesin": d.fungsiMesin || "",
      "Link Manual/Referensi": d.linkReferensi || "",
      "Keterangan Sumber": d.keteranganSumber || ""
    };
    const actualHeaders = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
    sh.appendRow(actualHeaders.map(function(h) {
      return rowMap.hasOwnProperty(h) ? rowMap[h] : "";
    }));
    return jsonOut_({ ok: true, manualUrl });
  }
  __name(addMachine_, "addMachine_");
  function updateMachine_(body) {
    const sh = getOrCreateSheet_(SHEET_MESIN, MESIN_HEADERS);
    const found = findMachineRow_(sh, body.kodeMesin);
    if (!found) return jsonOut_({ ok: false, error: "Mesin tidak ditemukan." });
    const d = body.machine || {};
    if (!String(d.kodeMesin || "").trim() || !String(d.namaMesin || "").trim()) return jsonOut_({ ok: false, error: "Kode Mesin dan Nama Mesin wajib diisi." });
    let manualUrl = found.row[found.headers.indexOf("Manual PDF URL")] || "";
    if (body.manualFile && body.manualFile.base64) {
      try {
        manualUrl = uploadBase64File_(getOrCreateManualFolder_(), body.manualFile, "Manual Book.pdf", "application/pdf").previewUrl;
      } catch (err) {
      }
    }
    const rowMap = {
      "Kode Mesin": d.kodeMesin || "",
      "Nama Mesin": d.namaMesin || "",
      "Lokasi/Area": d.lokasi || "",
      "Kategori": d.kategori || "",
      "Spesifikasi Mesin": d.spesifikasiMesin || "",
      "Manual PDF URL": manualUrl,
      "Model": d.model || "",
      "Deskripsi Mesin": d.deskripsiMesin || "",
      "Fungsi Mesin": d.fungsiMesin || "",
      "Link Manual/Referensi": d.linkReferensi || "",
      "Keterangan Sumber": d.keteranganSumber || ""
    };
    const row = found.headers.map(function(h, idx) {
      return rowMap.hasOwnProperty(h) ? rowMap[h] : found.row[idx];
    });
    sh.getRange(found.rowIndex, 1, 1, row.length).setValues([row]);
    return jsonOut_({ ok: true, manualUrl });
  }
  __name(updateMachine_, "updateMachine_");
  function deleteMachine_(body) {
    const sh = getOrCreateSheet_(SHEET_MESIN, MESIN_HEADERS);
    const found = findMachineRow_(sh, body.kodeMesin);
    if (!found) return jsonOut_({ ok: false, error: "Mesin tidak ditemukan." });
    sh.deleteRow(found.rowIndex);
    return jsonOut_({ ok: true });
  }
  __name(deleteMachine_, "deleteMachine_");
  function getPatrolTemplateList_(kodeMesin) {
    const rows = getGenericRows_(SHEET_PATROL_TEMPLATE, PATROL_TEMPLATE_HEADERS);
    if (!kodeMesin) return rows;
    return rows.filter(function(r) {
      return String(r["Kode Mesin"]) === String(kodeMesin);
    });
  }
  __name(getPatrolTemplateList_, "getPatrolTemplateList_");
  function savePatrolTemplateItem_(body) {
    const sh = getOrCreateSheet_(SHEET_PATROL_TEMPLATE, PATROL_TEMPLATE_HEADERS);
    const d = body.item || {};
    if (!d.kodeMesin) return jsonOut_({ ok: false, error: "Kode Mesin wajib diisi." });
    if (!d.deskripsi) return jsonOut_({ ok: false, error: "Deskripsi Pemeriksaan wajib diisi." });
    const isUpdate = !!d.id;
    const rowMap = {
      "Kode Mesin": d.kodeMesin || "",
      "Nama Mesin": d.namaMesin || "",
      "Kategori": d.kategori || "",
      "Area/Sub Area": d.subArea || "",
      "Deskripsi Pemeriksaan": d.deskripsi || "",
      "Kondisi Standar": d.kondisiStandar || "",
      "Urutan": d.urutan || ""
    };
    if (isUpdate) {
      const found = findRowByColumnValue_(sh, "ID", d.id);
      if (!found) return jsonOut_({ ok: false, error: "Item checklist tidak ditemukan." });
      const row = found.headers.map(function(h, idx) {
        return rowMap.hasOwnProperty(h) ? rowMap[h] : found.row[idx];
      });
      sh.getRange(found.rowIndex, 1, 1, row.length).setValues([row]);
      return jsonOut_({ ok: true, id: d.id });
    }
    rowMap["ID"] = "PCT-" + Utilities.formatDate(/* @__PURE__ */ new Date(), Session.getScriptTimeZone(), "yyyyMMdd-HHmmss") + "-" + Math.floor(Math.random() * 900 + 100);
    const actualHeaders = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
    sh.appendRow(actualHeaders.map(function(h) {
      return rowMap.hasOwnProperty(h) ? rowMap[h] : "";
    }));
    return jsonOut_({ ok: true, id: rowMap["ID"] });
  }
  __name(savePatrolTemplateItem_, "savePatrolTemplateItem_");
  function deletePatrolTemplateItem_(body) {
    const sh = getOrCreateSheet_(SHEET_PATROL_TEMPLATE, PATROL_TEMPLATE_HEADERS);
    const found = findRowByColumnValue_(sh, "ID", body.id);
    if (!found) return jsonOut_({ ok: false, error: "Item checklist tidak ditemukan." });
    sh.deleteRow(found.rowIndex);
    return jsonOut_({ ok: true });
  }
  __name(deletePatrolTemplateItem_, "deletePatrolTemplateItem_");
  function seedPatrolTemplateBulk_(body) {
    const sh = getOrCreateSheet_(SHEET_PATROL_TEMPLATE, PATROL_TEMPLATE_HEADERS);
    const items = body && body.items || [];
    if (!items.length) return jsonOut_({ ok: false, error: "Tidak ada item untuk diimpor." });
    const existing = getGenericRows_(SHEET_PATROL_TEMPLATE, PATROL_TEMPLATE_HEADERS);
    const existingKeys = {};
    existing.forEach(function(r) {
      existingKeys[[r["Kode Mesin"], r["Area/Sub Area"], r["Deskripsi Pemeriksaan"]].join("||")] = true;
    });
    const actualHeaders = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
    let added = 0;
    items.forEach(function(d) {
      if (!d.kodeMesin || !d.deskripsi) return;
      const key = [d.kodeMesin, d.subArea || "", d.deskripsi].join("||");
      if (existingKeys[key]) return;
      existingKeys[key] = true;
      const rowMap = {
        "ID": "PCT-" + Utilities.formatDate(/* @__PURE__ */ new Date(), Session.getScriptTimeZone(), "yyyyMMdd-HHmmss") + "-" + Math.floor(Math.random() * 900 + 100),
        "Kode Mesin": d.kodeMesin || "",
        "Nama Mesin": d.namaMesin || "",
        "Kategori": d.kategori || "",
        "Area/Sub Area": d.subArea || "",
        "Deskripsi Pemeriksaan": d.deskripsi || "",
        "Kondisi Standar": d.kondisiStandar || "",
        "Urutan": d.urutan || ""
      };
      sh.appendRow(actualHeaders.map(function(h) {
        return rowMap.hasOwnProperty(h) ? rowMap[h] : "";
      }));
      added++;
    });
    return jsonOut_({ ok: true, added, skipped: items.length - added });
  }
  __name(seedPatrolTemplateBulk_, "seedPatrolTemplateBulk_");
  function findPersonilRow_(sh, namaPersonil) {
    return findRowByColumnValue_(sh, "Nama Personil", namaPersonil);
  }
  __name(findPersonilRow_, "findPersonilRow_");
  function addPersonil_(body) {
    const sh = getOrCreateSheet_(SHEET_PERSONIL, PERSONIL_HEADERS);
    const d = body.personil || {};
    if (!d.namaPersonil) return jsonOut_({ ok: false, error: "Nama personil wajib diisi." });
    if (findPersonilRow_(sh, d.namaPersonil)) return jsonOut_({ ok: false, error: "Nama personil sudah terdaftar." });
    let fotoUrl = "";
    if (body.photoFile && body.photoFile.base64) {
      try {
        fotoUrl = uploadBase64File_(getOrCreateDriveFolder_(), body.photoFile, "Foto Personil.jpg", "image/jpeg").viewUrl;
      } catch (err) {
        fotoUrl = "";
      }
    }
    sh.appendRow([d.namaPersonil || "", d.groupingTeam || "", d.jabatan || "", fotoUrl]);
    return jsonOut_({ ok: true, fotoUrl });
  }
  __name(addPersonil_, "addPersonil_");
  function updatePersonil_(body) {
    const sh = getOrCreateSheet_(SHEET_PERSONIL, PERSONIL_HEADERS);
    const found = findPersonilRow_(sh, body.namaPersonil);
    if (!found) return jsonOut_({ ok: false, error: "Personil tidak ditemukan." });
    const d = body.personil || {};
    if (!d.namaPersonil) return jsonOut_({ ok: false, error: "Nama personil wajib diisi." });
    let fotoUrl = found.row[found.headers.indexOf("Foto URL")] || "";
    if (body.photoFile && body.photoFile.base64) {
      try {
        fotoUrl = uploadBase64File_(getOrCreateDriveFolder_(), body.photoFile, "Foto Personil.jpg", "image/jpeg").viewUrl;
      } catch (err) {
      }
    }
    const rowMap = { "Nama Personil": d.namaPersonil || "", "Grouping Team": d.groupingTeam || "", "Jabatan": d.jabatan || "", "Foto URL": fotoUrl };
    const row = found.headers.map(function(h, idx) {
      return rowMap.hasOwnProperty(h) ? rowMap[h] : found.row[idx];
    });
    sh.getRange(found.rowIndex, 1, 1, row.length).setValues([row]);
    return jsonOut_({ ok: true, fotoUrl });
  }
  __name(updatePersonil_, "updatePersonil_");
  function deletePersonil_(body) {
    const sh = getOrCreateSheet_(SHEET_PERSONIL, PERSONIL_HEADERS);
    const found = findPersonilRow_(sh, body.namaPersonil);
    if (!found) return jsonOut_({ ok: false, error: "Personil tidak ditemukan." });
    sh.deleteRow(found.rowIndex);
    return jsonOut_({ ok: true });
  }
  __name(deletePersonil_, "deletePersonil_");
  function findPiPersonnelRow_(sh, idOrNama) {
    const byId = idOrNama ? findRowByColumnValue_(sh, "ID Karyawan", idOrNama) : null;
    if (byId) return byId;
    return findRowByColumnValue_(sh, "Nama", idOrNama);
  }
  __name(findPiPersonnelRow_, "findPiPersonnelRow_");
  function savePiPersonnelMaster_(body) {
    const sh = getOrCreateSheet_(SHEET_PI_PERSONNEL, PI_PERSONNEL_HEADERS);
    const d = body.personil || {};
    if (!d.nama) return jsonOut_({ ok: false, error: "Nama wajib diisi." });
    const rowMap = {
      "ID Karyawan": d.idKaryawan || "",
      "Nama": d.nama || "",
      "Job Title": d.jobTitle || "",
      "Tanggal Lahir": d.tanggalLahir || "",
      "Grouping Team": d.groupingTeam || "",
      "Foto URL": d.fotoUrl || ""
    };
    const found = findPiPersonnelRow_(sh, d.idKaryawan || d.nama);
    const actualHeaders = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
    const row = actualHeaders.map(function(h) {
      return rowMap.hasOwnProperty(h) ? rowMap[h] : "";
    });
    if (found) sh.getRange(found.rowIndex, 1, 1, row.length).setValues([row]);
    else sh.appendRow(row);
    return jsonOut_({ ok: true });
  }
  __name(savePiPersonnelMaster_, "savePiPersonnelMaster_");
  function deletePiPersonnelMaster_(body) {
    const sh = getOrCreateSheet_(SHEET_PI_PERSONNEL, PI_PERSONNEL_HEADERS);
    const found = findPiPersonnelRow_(sh, body.idKaryawan || body.nama);
    if (!found) return jsonOut_({ ok: false, error: "Data personil tidak ditemukan." });
    sh.deleteRow(found.rowIndex);
    return jsonOut_({ ok: true });
  }
  __name(deletePiPersonnelMaster_, "deletePiPersonnelMaster_");
  function seedPiPersonnelMasterBulk_(body) {
    const sh = getOrCreateSheet_(SHEET_PI_PERSONNEL, PI_PERSONNEL_HEADERS);
    const items = body && body.items || [];
    if (!items.length) return jsonOut_({ ok: false, error: "Tidak ada data untuk diimpor." });
    const existing = getGenericRows_(SHEET_PI_PERSONNEL, PI_PERSONNEL_HEADERS);
    const existingKeys = {};
    existing.forEach(function(r) {
      existingKeys[String(r["ID Karyawan"] || r["Nama"])] = true;
    });
    const actualHeaders = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
    let added = 0;
    items.forEach(function(d) {
      if (!d.nama) return;
      const key = String(d.idKaryawan || d.nama);
      if (existingKeys[key]) return;
      existingKeys[key] = true;
      const rowMap = {
        "ID Karyawan": d.idKaryawan || "",
        "Nama": d.nama || "",
        "Job Title": d.jobTitle || "",
        "Tanggal Lahir": d.tanggalLahir || "",
        "Grouping Team": d.groupingTeam || "",
        "Foto URL": ""
      };
      sh.appendRow(actualHeaders.map(function(h) {
        return rowMap.hasOwnProperty(h) ? rowMap[h] : "";
      }));
      added++;
    });
    return jsonOut_({ ok: true, added, skipped: items.length - added });
  }
  __name(seedPiPersonnelMasterBulk_, "seedPiPersonnelMasterBulk_");
  function getSparepartLokasiMerged_() {
    const sh = getOrCreateSheet_(SHEET_SPAREPART_LOKASI, SPAREPART_LOKASI_HEADERS);
    const legacy = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_STOCK_SPAREPART);
    if (legacy && legacy.getLastRow() > 1) {
      const masterData = sh.getDataRange().getValues();
      const masterHeaders = masterData[0] || SPAREPART_LOKASI_HEADERS;
      const sapIdx = masterHeaders.indexOf("Material Number SAP");
      const stockQtyIdx = masterHeaders.indexOf("Stock Qty");
      const satuanIdx = masterHeaders.indexOf("Satuan");
      const namaIdxMaster = masterHeaders.indexOf("Nama Material");
      const sapRowMap = {};
      for (var mi = 1; mi < masterData.length; mi++) {
        var msap = String(masterData[mi][sapIdx] || "").trim();
        if (msap) sapRowMap[msap] = mi;
      }
      const legacyData = legacy.getDataRange().getValues();
      const legacyHeaders = legacyData.shift() || [];
      const sapCol = legacyHeaders.findIndex(function(h) {
        return /material.*number.*sap|^sap$/i.test(String(h));
      });
      const namaCol = legacyHeaders.findIndex(function(h) {
        return /nama.*material/i.test(String(h));
      });
      const qtyCol = legacyHeaders.findIndex(function(h) {
        return /stock.*qty|^stock$|^qty$/i.test(String(h));
      });
      const satuanCol = legacyHeaders.findIndex(function(h) {
        return /satuan|^unit$/i.test(String(h));
      });
      if (sapCol !== -1) {
        const newRows = [];
        let masterChanged = false;
        legacyData.forEach(function(row) {
          const sap = String(row[sapCol] || "").trim();
          if (!sap) return;
          const mi2 = sapRowMap[sap];
          if (mi2 !== void 0) {
            if (stockQtyIdx !== -1 && (masterData[mi2][stockQtyIdx] === "" || masterData[mi2][stockQtyIdx] == null) && qtyCol !== -1) {
              masterData[mi2][stockQtyIdx] = row[qtyCol];
              masterChanged = true;
            }
            if (satuanIdx !== -1 && (masterData[mi2][satuanIdx] === "" || masterData[mi2][satuanIdx] == null) && satuanCol !== -1) {
              masterData[mi2][satuanIdx] = row[satuanCol];
              masterChanged = true;
            }
          } else {
            const newRow = masterHeaders.map(function(h) {
              if (h === "Material Number SAP") return sap;
              if (h === "Nama Material") return namaCol !== -1 ? row[namaCol] : "";
              if (h === "Stock Qty") return qtyCol !== -1 ? row[qtyCol] : "";
              if (h === "Satuan") return satuanCol !== -1 ? row[satuanCol] : "";
              return "";
            });
            sapRowMap[sap] = -1;
            newRows.push(newRow);
          }
        });
        if (masterChanged) {
          sh.getRange(2, 1, masterData.length - 1, masterHeaders.length).setValues(masterData.slice(1));
        }
        if (newRows.length) {
          sh.getRange(sh.getLastRow() + 1, 1, newRows.length, masterHeaders.length).setValues(newRows);
        }
        if (masterChanged || newRows.length) invalidateCacheForSheet_(SHEET_SPAREPART_LOKASI);
      }
    }
    return getGenericRows_(SHEET_SPAREPART_LOKASI, SPAREPART_LOKASI_HEADERS);
  }
  __name(getSparepartLokasiMerged_, "getSparepartLokasiMerged_");
  function saveSparepartLokasi_(body) {
    const sh = getOrCreateSheet_(SHEET_SPAREPART_LOKASI, SPAREPART_LOKASI_HEADERS);
    const d = body.lokasi || {};
    if (!d.sap) return jsonOut_({ ok: false, error: "Material Number SAP wajib diisi." });
    const rowMap = {
      "Material Number SAP": d.sap || "",
      "Nama Material": d.nama || "",
      "Lokasi Gudang": d.lokasiGudang || "",
      "Harga Satuan": d.harga || 0,
      "Stock Qty": d.stockQty === "" || d.stockQty == null ? "" : Number(d.stockQty) || 0,
      "Satuan": d.satuan || ""
    };
    const found = findRowByColumnValue_(sh, "Material Number SAP", d.sap);
    const actualHeaders = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
    const row = actualHeaders.map(function(h) {
      return rowMap.hasOwnProperty(h) ? rowMap[h] : "";
    });
    if (found) sh.getRange(found.rowIndex, 1, 1, row.length).setValues([row]);
    else sh.appendRow(row);
    invalidateCacheForSheet_(SHEET_SPAREPART_LOKASI);
    return jsonOut_({ ok: true });
  }
  __name(saveSparepartLokasi_, "saveSparepartLokasi_");
  function deleteSparepartLokasi_(body) {
    const sh = getOrCreateSheet_(SHEET_SPAREPART_LOKASI, SPAREPART_LOKASI_HEADERS);
    const found = findRowByColumnValue_(sh, "Material Number SAP", body.sap);
    if (!found) return jsonOut_({ ok: false, error: "Data lokasi tidak ditemukan." });
    sh.deleteRow(found.rowIndex);
    invalidateCacheForSheet_(SHEET_SPAREPART_LOKASI);
    return jsonOut_({ ok: true });
  }
  __name(deleteSparepartLokasi_, "deleteSparepartLokasi_");
  function kpiDepartmentIsAchieved_(polaritas, target, actual) {
    if (target === "" || target === null || target === void 0 || actual === "" || actual === null || actual === void 0) return null;
    var t = Number(target), a = Number(actual);
    if (!isFinite(t) || !isFinite(a)) return null;
    return String(polaritas || "").toLowerCase().indexOf("min") === 0 ? a <= t : a >= t;
  }
  __name(kpiDepartmentIsAchieved_, "kpiDepartmentIsAchieved_");
  function kpiDepartmentSourceKey_(d) {
    return [d["Tahun"], d["KPI"]].map(function(v) {
      return String(v || "").trim().toUpperCase();
    }).join("|");
  }
  __name(kpiDepartmentSourceKey_, "kpiDepartmentSourceKey_");
  function upsertKpiDepartmentRows_(sheetName, headers, sourceRows, prefix) {
    var sh = getOrCreateSheet_(sheetName, headers);
    var actualHeaders = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
    var values = sh.getDataRange().getValues();
    var keyToIndex = {};
    if (values.length > 1) {
      var hdr = values[0];
      for (var i = 1; i < values.length; i++) {
        if (values[i][0] === "") continue;
        var obj = rowToObj_(hdr, values[i]);
        keyToIndex[kpiDepartmentSourceKey_(obj)] = i + 1;
      }
    }
    var now = nowIso_(), inserted = 0, updated = 0, latest = KPI_DEPARTMENT_SOURCE_META.latestActualMonth || "Jul";
    sourceRows.forEach(function(src, idx) {
      var rowMap = {};
      headers.forEach(function(h) {
        rowMap[h] = src[h] !== void 0 && src[h] !== null ? src[h] : "";
      });
      var actual = src["Realisasi " + latest], target = src["Target " + latest], ok = kpiDepartmentIsAchieved_(src["Polaritas"], target, actual);
      rowMap["Aktual"] = actual === null || actual === void 0 ? "" : actual;
      rowMap["Status"] = ok === null ? "BELUM ADA DATA" : ok ? "TERCAPAI" : "BELUM TERCAPAI";
      rowMap["Catatan"] = "Sumber aktual KPI Department; realisasi tersedia s.d. " + latest + " " + src["Tahun"] + ".";
      rowMap["Source File"] = KPI_DEPARTMENT_SOURCE_META.sourceFile;
      rowMap["Source Sheet"] = src["Source Sheet"] || "Kertas Kerja";
      rowMap["Source Row"] = src["Source Row"] || "";
      rowMap["Source Version"] = KPI_DEPARTMENT_SOURCE_META.version;
      rowMap["Updated At"] = now;
      var key = kpiDepartmentSourceKey_(rowMap), rowIndex = keyToIndex[key];
      if (rowIndex) {
        var existing = sh.getRange(rowIndex, 1, 1, actualHeaders.length).getValues()[0];
        var idCol = actualHeaders.indexOf("ID"), createdCol = actualHeaders.indexOf("Created At");
        rowMap["ID"] = idCol >= 0 && existing[idCol] ? existing[idCol] : prefix + "-" + src["Tahun"] + "-" + (idx + 1);
        rowMap["Created At"] = createdCol >= 0 && existing[createdCol] ? existing[createdCol] : now;
        sh.getRange(rowIndex, 1, 1, actualHeaders.length).setValues([actualHeaders.map(function(h) {
          return rowMap.hasOwnProperty(h) ? rowMap[h] : "";
        })]);
        updated++;
      } else {
        rowMap["ID"] = prefix + "-" + src["Tahun"] + "-" + String(idx + 1).padStart(2, "0");
        rowMap["Created At"] = now;
        sh.appendRow(actualHeaders.map(function(h) {
          return rowMap.hasOwnProperty(h) ? rowMap[h] : "";
        }));
        inserted++;
      }
    });
    invalidateCacheForSheet_(sheetName);
    return { inserted, updated };
  }
  __name(upsertKpiDepartmentRows_, "upsertKpiDepartmentRows_");
  function ensureKpiDepartmentActualData_() {
    var props = PropertiesService.getScriptProperties();
    var current = props.getProperty("KPI_DEPARTMENT_SOURCE_VERSION") || "";
    var kpiSh = getOrCreateSheet_(SHEET_KPI_KERJA, KPI_KERJA_HEADERS);
    var ytdSh = getOrCreateSheet_(SHEET_KPI_DEPARTMENT_YTD, KPI_DEPARTMENT_YTD_HEADERS);
    var srcSh = getOrCreateSheet_(SHEET_KPI_DEPARTMENT_SOURCE, KPI_DEPARTMENT_SOURCE_HEADERS);
    var sourceRowsPresent = Math.max(0, srcSh.getLastRow() - 1);
    var already = current === KPI_DEPARTMENT_SOURCE_META.version && sourceRowsPresent >= KPI_DEPARTMENT_SOURCE_META.rawRowCount;
    if (already) return { ok: true, seeded: false, version: current, rawRows: sourceRowsPresent };
    var mtdResult = upsertKpiDepartmentRows_(SHEET_KPI_KERJA, KPI_KERJA_HEADERS, KPI_DEPARTMENT_MTD, "KPI-ACTUAL");
    var ytdResult = upsertKpiDepartmentRows_(SHEET_KPI_DEPARTMENT_YTD, KPI_DEPARTMENT_YTD_HEADERS, KPI_DEPARTMENT_YTD, "KPI-YTD");
    if (srcSh.getLastRow() > 1) srcSh.getRange(2, 1, srcSh.getLastRow() - 1, srcSh.getLastColumn()).clearContent();
    var importedAt = nowIso_();
    var rows = KPI_DEPARTMENT_RAW_ROWS.map(function(r) {
      return [KPI_DEPARTMENT_SOURCE_META.version, KPI_DEPARTMENT_SOURCE_META.sourceFile, r.Sheet, r.Row, r.DataJSON, r.FormulaJSON, importedAt];
    });
    var batch = 200;
    for (var start = 0; start < rows.length; start += batch) {
      var part = rows.slice(start, start + batch);
      srcSh.getRange(2 + start, 1, part.length, KPI_DEPARTMENT_SOURCE_HEADERS.length).setValues(part);
    }
    props.setProperty("KPI_DEPARTMENT_SOURCE_VERSION", KPI_DEPARTMENT_SOURCE_META.version);
    invalidateCacheForSheet_(SHEET_KPI_KERJA);
    invalidateCacheForSheet_(SHEET_KPI_DEPARTMENT_YTD);
    invalidateCacheForSheet_(SHEET_KPI_DEPARTMENT_SOURCE);
    return { ok: true, seeded: true, version: KPI_DEPARTMENT_SOURCE_META.version, mtd: mtdResult, ytd: ytdResult, rawRows: rows.length };
  }
  __name(ensureKpiDepartmentActualData_, "ensureKpiDepartmentActualData_");
  function getKpiDepartmentData_() {
    var seed = ensureKpiDepartmentActualData_();
    return {
      mtd: getGenericRows_(SHEET_KPI_KERJA, KPI_KERJA_HEADERS).filter(function(r) {
        return String(r["Tahun"]) === String(KPI_DEPARTMENT_SOURCE_META.year) && String(r["Source Version"] || "") === String(KPI_DEPARTMENT_SOURCE_META.version);
      }),
      ytd: getGenericRows_(SHEET_KPI_DEPARTMENT_YTD, KPI_DEPARTMENT_YTD_HEADERS).filter(function(r) {
        return String(r["Tahun"]) === String(KPI_DEPARTMENT_SOURCE_META.year) && String(r["Source Version"] || "") === String(KPI_DEPARTMENT_SOURCE_META.version);
      }),
      meta: KPI_DEPARTMENT_SOURCE_META,
      seed
    };
  }
  __name(getKpiDepartmentData_, "getKpiDepartmentData_");
  function getKpiKerjaList_(tahun) {
    try {
      ensureKpiDepartmentActualData_();
    } catch (e) {
      Logger.log("KPI Department seed warning: " + String(e));
    }
    const rows = getGenericRows_(SHEET_KPI_KERJA, KPI_KERJA_HEADERS);
    if (!tahun) return rows;
    return rows.filter(function(r) {
      return String(r["Tahun"]) === String(tahun);
    });
  }
  __name(getKpiKerjaList_, "getKpiKerjaList_");
  function saveKpiKerja_(body) {
    const sh = getOrCreateSheet_(SHEET_KPI_KERJA, KPI_KERJA_HEADERS);
    const d = body.data || {};
    if (!d.KPI) return jsonOut_({ ok: false, error: "Nama KPI wajib diisi." });
    if (!d.Tahun) return jsonOut_({ ok: false, error: "Tahun wajib diisi." });
    const isUpdate = !!d.ID;
    const now = nowIso_();
    const rowMap = {};
    KPI_KERJA_HEADERS.forEach(function(h) {
      rowMap[h] = d[h] !== void 0 && d[h] !== null ? d[h] : "";
    });
    if (!isUpdate) {
      rowMap["ID"] = "KPI-" + Utilities.formatDate(/* @__PURE__ */ new Date(), Session.getScriptTimeZone(), "yyyyMMdd-HHmmss") + "-" + Math.floor(Math.random() * 900 + 100);
      rowMap["Created At"] = now;
    }
    rowMap["Updated At"] = now;
    if (isUpdate) {
      const found = findRowByColumnValue_(sh, "ID", d.ID);
      if (!found) return jsonOut_({ ok: false, error: "ID KPI tidak ditemukan" });
      const currentHeaders = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
      const currentRow = found.row;
      if (!rowMap["Created At"]) {
        const idx = currentHeaders.indexOf("Created At");
        if (idx !== -1) rowMap["Created At"] = currentRow[idx];
      }
      const values = currentHeaders.map(function(h) {
        return rowMap.hasOwnProperty(h) ? rowMap[h] : currentRow[currentHeaders.indexOf(h)];
      });
      sh.getRange(found.rowIndex, 1, 1, values.length).setValues([values]);
      return jsonOut_({ ok: true, id: d.ID });
    } else {
      const actualHeaders = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
      sh.appendRow(actualHeaders.map(function(h) {
        return rowMap.hasOwnProperty(h) ? rowMap[h] : "";
      }));
      return jsonOut_({ ok: true, id: rowMap["ID"] });
    }
  }
  __name(saveKpiKerja_, "saveKpiKerja_");
  function deleteKpiKerja_(body) {
    const sh = getOrCreateSheet_(SHEET_KPI_KERJA, KPI_KERJA_HEADERS);
    const found = findRowByColumnValue_(sh, "ID", body.id);
    if (!found) return jsonOut_({ ok: false, error: "Data KPI tidak ditemukan." });
    sh.deleteRow(found.rowIndex);
    return jsonOut_({ ok: true });
  }
  __name(deleteKpiKerja_, "deleteKpiKerja_");
  function machineBreakdownKey_(d) {
    return [d["Tahun"], d["Bulan"], d["Periode"], d["Mesin"]].map(function(v) {
      return String(v || "").trim().toUpperCase();
    }).join("|");
  }
  __name(machineBreakdownKey_, "machineBreakdownKey_");
  function getMachineBreakdownList_(tahun) {
    const rows = getGenericRows_(SHEET_MACHINE_BREAKDOWN, MACHINE_BREAKDOWN_HEADERS);
    if (!tahun) return rows;
    return rows.filter(function(r) {
      return String(r["Tahun"]) === String(tahun);
    });
  }
  __name(getMachineBreakdownList_, "getMachineBreakdownList_");
  function saveMachineBreakdown_(body) {
    const sh = getOrCreateSheet_(SHEET_MACHINE_BREAKDOWN, MACHINE_BREAKDOWN_HEADERS);
    const d = body.data || {};
    if (!d.Mesin) return jsonOut_({ ok: false, error: "Nama mesin wajib diisi." });
    if (!d.Tahun) return jsonOut_({ ok: false, error: "Tahun wajib diisi." });
    if (!d.Bulan) return jsonOut_({ ok: false, error: "Bulan wajib diisi." });
    if (!d.Periode) return jsonOut_({ ok: false, error: "Periode (MTD/YTD) wajib diisi." });
    const now = nowIso_();
    const rowMap = {};
    MACHINE_BREAKDOWN_HEADERS.forEach(function(h) {
      rowMap[h] = d[h] !== void 0 && d[h] !== null ? d[h] : "";
    });
    let found = d.ID ? findRowByColumnValue_(sh, "ID", d.ID) : null;
    if (!found) {
      const existingRows = getGenericRows_(SHEET_MACHINE_BREAKDOWN, MACHINE_BREAKDOWN_HEADERS);
      const targetKey = machineBreakdownKey_(rowMap);
      const match = existingRows.find(function(r) {
        return machineBreakdownKey_(r) === targetKey;
      });
      if (match) found = findRowByColumnValue_(sh, "ID", match["ID"]);
    }
    if (found) {
      const currentHeaders = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
      const currentRow = found.row;
      const idx = currentHeaders.indexOf("Created At");
      if (idx !== -1 && currentRow[idx]) rowMap["Created At"] = currentRow[idx];
      rowMap["ID"] = currentRow[currentHeaders.indexOf("ID")];
      rowMap["Updated At"] = now;
      const values = currentHeaders.map(function(h) {
        return rowMap.hasOwnProperty(h) ? rowMap[h] : currentRow[currentHeaders.indexOf(h)];
      });
      sh.getRange(found.rowIndex, 1, 1, values.length).setValues([values]);
      return jsonOut_({ ok: true, id: rowMap["ID"], updated: true });
    } else {
      rowMap["ID"] = "MBD-" + Utilities.formatDate(/* @__PURE__ */ new Date(), Session.getScriptTimeZone(), "yyyyMMdd-HHmmss") + "-" + Math.floor(Math.random() * 900 + 100);
      rowMap["Created At"] = now;
      rowMap["Updated At"] = now;
      const actualHeaders = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
      sh.appendRow(actualHeaders.map(function(h) {
        return rowMap.hasOwnProperty(h) ? rowMap[h] : "";
      }));
      return jsonOut_({ ok: true, id: rowMap["ID"], updated: false });
    }
  }
  __name(saveMachineBreakdown_, "saveMachineBreakdown_");
  function deleteMachineBreakdown_(body) {
    const sh = getOrCreateSheet_(SHEET_MACHINE_BREAKDOWN, MACHINE_BREAKDOWN_HEADERS);
    const found = findRowByColumnValue_(sh, "ID", body.id);
    if (!found) return jsonOut_({ ok: false, error: "Data breakdown tidak ditemukan." });
    sh.deleteRow(found.rowIndex);
    return jsonOut_({ ok: true });
  }
  __name(deleteMachineBreakdown_, "deleteMachineBreakdown_");
  function correctiveReportKey_(d) {
    const notif = String(d["No Notifikasi SAP"] || "").trim();
    if (notif) return "NOTIF|" + notif;
    return ["MS", d["Mesin"], d["Start"]].map(function(v) {
      return String(v || "").trim().toUpperCase();
    }).join("|");
  }
  __name(correctiveReportKey_, "correctiveReportKey_");
  function getCorrectiveReportList_(tahun) {
    const rows = getGenericRows_(SHEET_CORRECTIVE_REPORT, CORRECTIVE_REPORT_HEADERS);
    if (!tahun) return rows;
    return rows.filter(function(r) {
      return String(r["Tahun"]) === String(tahun);
    });
  }
  __name(getCorrectiveReportList_, "getCorrectiveReportList_");
  function saveCorrectiveReport_(body) {
    const sh = getOrCreateSheet_(SHEET_CORRECTIVE_REPORT, CORRECTIVE_REPORT_HEADERS);
    const d = body.data || {};
    if (!d.Mesin) return jsonOut_({ ok: false, error: "Mesin wajib diisi." });
    if (!d.Tahun) return jsonOut_({ ok: false, error: "Tahun wajib diisi." });
    if (!d.Bulan) return jsonOut_({ ok: false, error: "Bulan wajib diisi." });
    const now = nowIso_();
    const rowMap = {};
    CORRECTIVE_REPORT_HEADERS.forEach(function(h) {
      rowMap[h] = d[h] !== void 0 && d[h] !== null ? d[h] : "";
    });
    let found = d.ID ? findRowByColumnValue_(sh, "ID", d.ID) : null;
    if (!found) {
      const existingRows = getGenericRows_(SHEET_CORRECTIVE_REPORT, CORRECTIVE_REPORT_HEADERS);
      const targetKey = correctiveReportKey_(rowMap);
      const match = existingRows.find(function(r) {
        return correctiveReportKey_(r) === targetKey;
      });
      if (match) found = findRowByColumnValue_(sh, "ID", match["ID"]);
    }
    if (found) {
      const currentHeaders = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
      const currentRow = found.row;
      const idx = currentHeaders.indexOf("Created At");
      if (idx !== -1 && currentRow[idx]) rowMap["Created At"] = currentRow[idx];
      rowMap["ID"] = currentRow[currentHeaders.indexOf("ID")];
      rowMap["Updated At"] = now;
      const values = currentHeaders.map(function(h) {
        return rowMap.hasOwnProperty(h) ? rowMap[h] : currentRow[currentHeaders.indexOf(h)];
      });
      sh.getRange(found.rowIndex, 1, 1, values.length).setValues([values]);
      return jsonOut_({ ok: true, id: rowMap["ID"], updated: true });
    } else {
      rowMap["ID"] = "CR-" + Utilities.formatDate(/* @__PURE__ */ new Date(), Session.getScriptTimeZone(), "yyyyMMdd-HHmmss") + "-" + Math.floor(Math.random() * 900 + 100);
      rowMap["Created At"] = now;
      rowMap["Updated At"] = now;
      const actualHeaders = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
      sh.appendRow(actualHeaders.map(function(h) {
        return rowMap.hasOwnProperty(h) ? rowMap[h] : "";
      }));
      return jsonOut_({ ok: true, id: rowMap["ID"], updated: false });
    }
  }
  __name(saveCorrectiveReport_, "saveCorrectiveReport_");
  function deleteCorrectiveReport_(body) {
    const sh = getOrCreateSheet_(SHEET_CORRECTIVE_REPORT, CORRECTIVE_REPORT_HEADERS);
    const found = findRowByColumnValue_(sh, "ID", body.id);
    if (!found) return jsonOut_({ ok: false, error: "Data corrective report tidak ditemukan." });
    sh.deleteRow(found.rowIndex);
    return jsonOut_({ ok: true });
  }
  __name(deleteCorrectiveReport_, "deleteCorrectiveReport_");
  function energyUtilityKey_(d) {
    return [d["Tahun"], d["Bulan"], d["Area"], d["Jenis"]].map(function(v) {
      return String(v || "").trim().toUpperCase();
    }).join("|");
  }
  __name(energyUtilityKey_, "energyUtilityKey_");
  function getEnergyUtilityList_(tahun) {
    const rows = getGenericRows_(SHEET_ENERGY_UTILITY, ENERGY_UTILITY_HEADERS);
    if (!tahun) return rows;
    return rows.filter(function(r) {
      return String(r["Tahun"]) === String(tahun);
    });
  }
  __name(getEnergyUtilityList_, "getEnergyUtilityList_");
  function saveEnergyUtility_(body) {
    const sh = getOrCreateSheet_(SHEET_ENERGY_UTILITY, ENERGY_UTILITY_HEADERS);
    const d = body.data || {};
    if (!d.Area) return jsonOut_({ ok: false, error: "Area/mesin wajib diisi." });
    if (!d.Tahun) return jsonOut_({ ok: false, error: "Tahun wajib diisi." });
    if (!d.Bulan) return jsonOut_({ ok: false, error: "Bulan wajib diisi." });
    if (!d.Jenis) return jsonOut_({ ok: false, error: "Jenis wajib diisi." });
    const now = nowIso_();
    const rowMap = {};
    ENERGY_UTILITY_HEADERS.forEach(function(h) {
      rowMap[h] = d[h] !== void 0 && d[h] !== null ? d[h] : "";
    });
    const nilaiNum = parseFloat(d["Nilai"]);
    const outputNum = parseFloat(d["Output"]);
    if (!isNaN(nilaiNum) && !isNaN(outputNum) && outputNum > 0) {
      rowMap["Rasio"] = Math.round(nilaiNum / outputNum * 1e4) / 1e4;
    } else {
      rowMap["Rasio"] = "";
    }
    let found = d.ID ? findRowByColumnValue_(sh, "ID", d.ID) : null;
    if (!found) {
      const existingRows = getGenericRows_(SHEET_ENERGY_UTILITY, ENERGY_UTILITY_HEADERS);
      const targetKey = energyUtilityKey_(rowMap);
      const match = existingRows.find(function(r) {
        return energyUtilityKey_(r) === targetKey;
      });
      if (match) found = findRowByColumnValue_(sh, "ID", match["ID"]);
    }
    if (found) {
      const currentHeaders = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
      const currentRow = found.row;
      const idx = currentHeaders.indexOf("Created At");
      if (idx !== -1 && currentRow[idx]) rowMap["Created At"] = currentRow[idx];
      rowMap["ID"] = currentRow[currentHeaders.indexOf("ID")];
      rowMap["Updated At"] = now;
      const values = currentHeaders.map(function(h) {
        return rowMap.hasOwnProperty(h) ? rowMap[h] : currentRow[currentHeaders.indexOf(h)];
      });
      sh.getRange(found.rowIndex, 1, 1, values.length).setValues([values]);
      return jsonOut_({ ok: true, id: rowMap["ID"], updated: true });
    } else {
      rowMap["ID"] = "ENG-" + Utilities.formatDate(/* @__PURE__ */ new Date(), Session.getScriptTimeZone(), "yyyyMMdd-HHmmss") + "-" + Math.floor(Math.random() * 900 + 100);
      rowMap["Created At"] = now;
      rowMap["Updated At"] = now;
      const actualHeaders = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
      sh.appendRow(actualHeaders.map(function(h) {
        return rowMap.hasOwnProperty(h) ? rowMap[h] : "";
      }));
      return jsonOut_({ ok: true, id: rowMap["ID"], updated: false });
    }
  }
  __name(saveEnergyUtility_, "saveEnergyUtility_");
  function deleteEnergyUtility_(body) {
    const sh = getOrCreateSheet_(SHEET_ENERGY_UTILITY, ENERGY_UTILITY_HEADERS);
    const found = findRowByColumnValue_(sh, "ID", body.id);
    if (!found) return jsonOut_({ ok: false, error: "Data energy/utility tidak ditemukan." });
    sh.deleteRow(found.rowIndex);
    return jsonOut_({ ok: true });
  }
  __name(deleteEnergyUtility_, "deleteEnergyUtility_");
  function recordYtdKey_(d) {
    return [d["Tahun"], d["Mesin"]].map(function(v) {
      return String(v || "").trim().toUpperCase();
    }).join("|");
  }
  __name(recordYtdKey_, "recordYtdKey_");
  function getRecordYtdList_(tahun) {
    const rows = getGenericRows_(SHEET_RECORD_YTD, RECORD_YTD_HEADERS);
    if (!tahun) return rows;
    return rows.filter(function(r) {
      return String(r["Tahun"]) === String(tahun);
    });
  }
  __name(getRecordYtdList_, "getRecordYtdList_");
  function saveRecordYtd_(body) {
    const sh = getOrCreateSheet_(SHEET_RECORD_YTD, RECORD_YTD_HEADERS);
    const d = body.data || {};
    if (!d["Mesin"]) return jsonOut_({ ok: false, error: "Nama mesin wajib diisi." });
    if (!d["Tahun"]) return jsonOut_({ ok: false, error: "Tahun wajib diisi." });
    const now = nowIso_();
    const rowMap = {};
    RECORD_YTD_HEADERS.forEach(function(h) {
      rowMap[h] = d[h] !== void 0 && d[h] !== null ? d[h] : "";
    });
    let found = d.ID ? findRowByColumnValue_(sh, "ID", d.ID) : null;
    if (!found) {
      const existingRows = getGenericRows_(SHEET_RECORD_YTD, RECORD_YTD_HEADERS);
      const targetKey = recordYtdKey_(rowMap);
      const match = existingRows.find(function(r) {
        return recordYtdKey_(r) === targetKey;
      });
      if (match) found = findRowByColumnValue_(sh, "ID", match["ID"]);
    }
    if (found) {
      const currentHeaders = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
      const currentRow = found.row;
      const idx = currentHeaders.indexOf("Created At");
      if (idx !== -1 && currentRow[idx]) rowMap["Created At"] = currentRow[idx];
      rowMap["ID"] = currentRow[currentHeaders.indexOf("ID")];
      rowMap["Updated At"] = now;
      const values = currentHeaders.map(function(h) {
        return rowMap.hasOwnProperty(h) ? rowMap[h] : currentRow[currentHeaders.indexOf(h)];
      });
      sh.getRange(found.rowIndex, 1, 1, values.length).setValues([values]);
      return jsonOut_({ ok: true, id: rowMap["ID"], updated: true });
    } else {
      rowMap["ID"] = "RYT-" + Utilities.formatDate(/* @__PURE__ */ new Date(), Session.getScriptTimeZone(), "yyyyMMdd-HHmmss") + "-" + Math.floor(Math.random() * 900 + 100);
      rowMap["Created At"] = now;
      rowMap["Updated At"] = now;
      const actualHeaders = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
      sh.appendRow(actualHeaders.map(function(h) {
        return rowMap.hasOwnProperty(h) ? rowMap[h] : "";
      }));
      return jsonOut_({ ok: true, id: rowMap["ID"], updated: false });
    }
  }
  __name(saveRecordYtd_, "saveRecordYtd_");
  function deleteRecordYtd_(body) {
    const sh = getOrCreateSheet_(SHEET_RECORD_YTD, RECORD_YTD_HEADERS);
    const found = findRowByColumnValue_(sh, "ID", body.id);
    if (!found) return jsonOut_({ ok: false, error: "Data Record YTD tidak ditemukan." });
    sh.deleteRow(found.rowIndex);
    return jsonOut_({ ok: true });
  }
  __name(deleteRecordYtd_, "deleteRecordYtd_");
  function seedRecordYtdDefault_() {
    const sh = getOrCreateSheet_(SHEET_RECORD_YTD, RECORD_YTD_HEADERS);
    const existing = getGenericRows_(SHEET_RECORD_YTD, RECORD_YTD_HEADERS);
    const existingKeys = {};
    existing.forEach(function(r) {
      existingKeys[recordYtdKey_(r)] = true;
    });
    const seedData = [
      { tahun: 2019, divisi: "Printing", mesin: "OFS 5", runHours: 4798.79, mtbf: 15.69, targetMtbf: 56.19, mttr: 2.84, targetMttr: 0.98, lostTimePct: 15.31, maxLostTimePct: 5, bdEvent: 259 },
      { tahun: 2019, divisi: "Converting", mesin: "APM 4", runHours: 3873.05, mtbf: 52.38, targetMtbf: 56.19, mttr: 1.41, targetMttr: 0.98, lostTimePct: 2.63, maxLostTimePct: null, bdEvent: 72 },
      { tahun: 2019, divisi: "Printing", mesin: "OFS 6", runHours: 4230.08, mtbf: 45.94, targetMtbf: null, mttr: 3.82, targetMttr: 0.98, lostTimePct: 7.68, maxLostTimePct: 5, bdEvent: 85 },
      { tahun: 2019, divisi: "Converting", mesin: "APM 7", runHours: 1942.03, mtbf: 37.46, targetMtbf: null, mttr: 6.68, targetMttr: null, lostTimePct: 15.12, maxLostTimePct: null, bdEvent: 44 },
      { tahun: 2020, divisi: "Printing", mesin: "OFS 5", runHours: 2315.69, mtbf: 6.38, targetMtbf: 56.19, mttr: 1.77, targetMttr: 0.98, lostTimePct: 21.75, maxLostTimePct: 5, bdEvent: 284 },
      { tahun: 2019, divisi: "Converting", mesin: "FGM 1", runHours: 2809.6, mtbf: 99.74, targetMtbf: null, mttr: 0.6, targetMttr: null, lostTimePct: 0.6, maxLostTimePct: null, bdEvent: 28 },
      { tahun: 2020, divisi: "Printing", mesin: "OFS 6", runHours: 3459.61, mtbf: 24.54, targetMtbf: null, mttr: 1.67, targetMttr: 0.98, lostTimePct: 6.36, maxLostTimePct: 5, bdEvent: 132 },
      { tahun: 2019, divisi: "Converting", mesin: "FGM 2", runHours: 2993.78, mtbf: 81.59, targetMtbf: null, mttr: 1.57, targetMttr: null, lostTimePct: 1.89, maxLostTimePct: null, bdEvent: 36 },
      { tahun: 2021, divisi: "Printing", mesin: "OFS 5", runHours: 2625.56, mtbf: 10.26, targetMtbf: 56.16, mttr: 1.2, targetMttr: 0.98, lostTimePct: 10.48, maxLostTimePct: 5, bdEvent: 229 },
      { tahun: 2019, divisi: "Converting", mesin: "FGM 3", runHours: 3535.17, mtbf: 60.35, targetMtbf: null, mttr: 2.78, targetMttr: null, lostTimePct: 4.41, maxLostTimePct: null, bdEvent: 56 },
      { tahun: 2021, divisi: "Printing", mesin: "OFS 6", runHours: 3136.93, mtbf: 38.25, targetMtbf: null, mttr: 2.33, targetMttr: 0.98, lostTimePct: 6.11, maxLostTimePct: 5, bdEvent: 82 },
      { tahun: 2020, divisi: "Converting", mesin: "APM 4", runHours: 4252.37, mtbf: 87.81, targetMtbf: 56.19, mttr: 1.39, targetMttr: 0.98, lostTimePct: 1.56, maxLostTimePct: null, bdEvent: 46 },
      { tahun: 2022, divisi: "Printing", mesin: "OFS 5", runHours: 2519.79, mtbf: 10.04, targetMtbf: 56.19, mttr: 1.47, targetMttr: 0.98, lostTimePct: 12.78, maxLostTimePct: 5, bdEvent: 219 },
      { tahun: 2020, divisi: "Converting", mesin: "APM 7", runHours: 4103.11, mtbf: 87.81, targetMtbf: null, mttr: 1.39, targetMttr: 0.98, lostTimePct: 1.56, maxLostTimePct: null, bdEvent: 46 },
      { tahun: 2022, divisi: "Printing", mesin: "OFS 6", runHours: 3348.38, mtbf: 28.85, targetMtbf: null, mttr: 2.15, targetMttr: 0.98, lostTimePct: 6.95, maxLostTimePct: 5, bdEvent: 108 },
      { tahun: 2020, divisi: "Converting", mesin: "FGM 1", runHours: 2459.21, mtbf: 70.68, targetMtbf: null, mttr: 1.65, targetMttr: 0.98, lostTimePct: 2.28, maxLostTimePct: null, bdEvent: 34 },
      { tahun: 2023, divisi: "Printing", mesin: "OFS 5", runHours: 2744.45, mtbf: 5.77, targetMtbf: 56.19, mttr: 2.31, targetMttr: 0.98, lostTimePct: 28.58, maxLostTimePct: 5, bdEvent: 340 },
      { tahun: 2020, divisi: "Converting", mesin: "FGM 2", runHours: 3030.62, mtbf: 59.65, targetMtbf: null, mttr: 0.96, targetMttr: 0.98, lostTimePct: 1.58, maxLostTimePct: null, bdEvent: 50 },
      { tahun: 2023, divisi: "Printing", mesin: "OFS 6", runHours: 2742.88, mtbf: 22.28, targetMtbf: null, mttr: 3.6, targetMttr: 0.98, lostTimePct: 13.91, maxLostTimePct: 5, bdEvent: 106 },
      { tahun: 2020, divisi: "Converting", mesin: "FGM 3", runHours: 3025.91, mtbf: 59.79, targetMtbf: null, mttr: 0.73, targetMttr: 0.98, lostTimePct: 1.21, maxLostTimePct: null, bdEvent: 50 },
      { tahun: 2023, divisi: "Printing", mesin: "OFS 8", runHours: 2130.95, mtbf: 55.27, targetMtbf: null, mttr: 2.32, targetMttr: 0.98, lostTimePct: 4.03, maxLostTimePct: 5, bdEvent: 37 },
      { tahun: 2021, divisi: "Converting", mesin: "APM 4", runHours: 3372.9, mtbf: 53.27, targetMtbf: 56.19, mttr: 8.06, targetMttr: 0.98, lostTimePct: 13.14, maxLostTimePct: null, bdEvent: 55 },
      { tahun: 2024, divisi: "Printing", mesin: "OFS 5", runHours: 2474.29, mtbf: 13.9, targetMtbf: 56.19, mttr: 1.28, targetMttr: 0.98, lostTimePct: 8.46, maxLostTimePct: 5, bdEvent: 163 },
      { tahun: 2021, divisi: "Converting", mesin: "APM 7", runHours: 3013.65, mtbf: 62.09, targetMtbf: null, mttr: 6.41, targetMttr: 0.98, lostTimePct: 9.35, maxLostTimePct: null, bdEvent: 44 },
      { tahun: 2024, divisi: "Printing", mesin: "OFS 6", runHours: 482.56, mtbf: 24.31, targetMtbf: null, mttr: 1.09, targetMttr: 0.98, lostTimePct: 4.3, maxLostTimePct: 5, bdEvent: 19 },
      { tahun: 2021, divisi: "Converting", mesin: "FGM 1", runHours: 2925.26, mtbf: 44.06, targetMtbf: null, mttr: 2.37, targetMttr: 0.98, lostTimePct: 5.11, maxLostTimePct: null, bdEvent: 63 },
      { tahun: 2024, divisi: "Printing", mesin: "OFS 8", runHours: 2906.03, mtbf: 51.72, targetMtbf: null, mttr: 1.11, targetMttr: 0.98, lostTimePct: 2.11, maxLostTimePct: 5, bdEvent: 55 },
      { tahun: 2021, divisi: "Converting", mesin: "FGM 2", runHours: 3084.19, mtbf: 58.74, targetMtbf: null, mttr: 1.73, targetMttr: 0.98, lostTimePct: 2.87, maxLostTimePct: null, bdEvent: 51 },
      { tahun: 2021, divisi: "Converting", mesin: "FGM 3", runHours: 3359.18, mtbf: 55.03, targetMtbf: null, mttr: 0.96, targetMttr: 0.98, lostTimePct: 1.72, maxLostTimePct: null, bdEvent: 60 },
      { tahun: 2022, divisi: "Converting", mesin: "APM 4", runHours: 4258.2, mtbf: 37.63, targetMtbf: 56.19, mttr: 25, targetMttr: 0.98, lostTimePct: 39.92, maxLostTimePct: null, bdEvent: 68 },
      { tahun: 2022, divisi: "Converting", mesin: "APM 7", runHours: 5111.35, mtbf: 96.15, targetMtbf: null, mttr: 6.08, targetMttr: 0.98, lostTimePct: 5.94, maxLostTimePct: null, bdEvent: 50 },
      { tahun: 2022, divisi: "Converting", mesin: "FGM 1", runHours: 5431.12, mtbf: 105.23, targetMtbf: null, mttr: 1.26, targetMttr: 0.98, lostTimePct: 1.19, maxLostTimePct: null, bdEvent: 51 },
      { tahun: 2022, divisi: "Converting", mesin: "FGM 2", runHours: 3944.07, mtbf: 106.31, targetMtbf: null, mttr: 3.25, targetMttr: 0.98, lostTimePct: 2.97, maxLostTimePct: null, bdEvent: 36 },
      { tahun: 2022, divisi: "Converting", mesin: "FGM 3", runHours: 4945.05, mtbf: 87.25, targetMtbf: null, mttr: 1.06, targetMttr: 0.98, lostTimePct: 1.2, maxLostTimePct: null, bdEvent: 56 },
      { tahun: 2023, divisi: "Converting", mesin: "APM 4", runHours: 5221.55, mtbf: 86.64, targetMtbf: 106, mttr: 1.86, targetMttr: 0.98, lostTimePct: 2.11, maxLostTimePct: null, bdEvent: 59 },
      { tahun: 2023, divisi: "Converting", mesin: "APM 7", runHours: 4398.52, mtbf: 117.12, targetMtbf: null, mttr: 1.75, targetMttr: 0.98, lostTimePct: 1.48, maxLostTimePct: null, bdEvent: 37 },
      { tahun: 2023, divisi: "Converting", mesin: "APM 8", runHours: 4444.38, mtbf: 294.02, targetMtbf: null, mttr: 2.27, targetMttr: 0.98, lostTimePct: 0.77, maxLostTimePct: null, bdEvent: 15 },
      { tahun: 2023, divisi: "Converting", mesin: "FGM 1", runHours: 5627.21, mtbf: 156.31, targetMtbf: null, mttr: 1.91, targetMttr: 0.98, lostTimePct: 1.22, maxLostTimePct: null, bdEvent: 36 },
      { tahun: 2023, divisi: "Converting", mesin: "FGM 2", runHours: 4359.69, mtbf: 113.46, targetMtbf: null, mttr: 1.27, targetMttr: 0.98, lostTimePct: 1.11, maxLostTimePct: null, bdEvent: 38 },
      { tahun: 2023, divisi: "Converting", mesin: "FGM 3", runHours: 5100.97, mtbf: 88.05, targetMtbf: null, mttr: 3.04, targetMttr: 0.98, lostTimePct: 3.33, maxLostTimePct: null, bdEvent: 56 },
      { tahun: 2024, divisi: "Converting", mesin: "APM 4", runHours: 1226.11, mtbf: 53.35, targetMtbf: 106, mttr: 5.03, targetMttr: 0.98, lostTimePct: 8.62, maxLostTimePct: null, bdEvent: 21 },
      { tahun: 2024, divisi: "Converting", mesin: "APM 7", runHours: 2985.04, mtbf: 116.41, targetMtbf: null, mttr: 2.99, targetMttr: 0.98, lostTimePct: 2.51, maxLostTimePct: null, bdEvent: 25 },
      { tahun: 2024, divisi: "Converting", mesin: "APM 8", runHours: 3994.86, mtbf: 396.33, targetMtbf: null, mttr: 3.16, targetMttr: 0.98, lostTimePct: 0.79, maxLostTimePct: null, bdEvent: 10 },
      { tahun: 2024, divisi: "Converting", mesin: "APM 9", runHours: 2164.54, mtbf: 309.22, targetMtbf: null, mttr: 2.16, targetMttr: 0.98, lostTimePct: 0.7, maxLostTimePct: null, bdEvent: 7 },
      { tahun: 2024, divisi: "Converting", mesin: "FGM 1", runHours: 3908.27, mtbf: 184.45, targetMtbf: 300, mttr: 1.66, targetMttr: 0.98, lostTimePct: 0.89, maxLostTimePct: null, bdEvent: 21 },
      { tahun: 2024, divisi: "Converting", mesin: "FGM 2", runHours: 2890.17, mtbf: 88.47, targetMtbf: null, mttr: 4.76, targetMttr: 0.98, lostTimePct: 5.11, maxLostTimePct: null, bdEvent: 31 },
      { tahun: 2024, divisi: "Converting", mesin: "FGM 3", runHours: 3732.72, mtbf: 146.38, targetMtbf: null, mttr: 2.93, targetMttr: 0.98, lostTimePct: 1.96, maxLostTimePct: null, bdEvent: 25 }
    ];
    const now = nowIso_();
    const actualHeaders = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
    const newRows = [];
    seedData.forEach(function(d) {
      const rowMap = {
        "Tahun": d.tahun,
        "Divisi": d.divisi,
        "Mesin": d.mesin,
        "Run Hours": d.runHours,
        "MTBF": d.mtbf,
        "Target MTBF": d.targetMtbf,
        "MTTR": d.mttr,
        "Target MTTR": d.targetMttr,
        "Lost Time (%)": d.lostTimePct,
        "Max Lost Time (%)": d.maxLostTimePct,
        "Breakdown Event": d.bdEvent,
        "Catatan": "Seed dari Excel Offset_Technical_2026_Terintegrasi.xlsx - sheet Record YTD"
      };
      if (existingKeys[recordYtdKey_(rowMap)]) return;
      rowMap["ID"] = "RYT-SEED-" + Utilities.formatDate(/* @__PURE__ */ new Date(), Session.getScriptTimeZone(), "yyyyMMdd-HHmmss") + "-" + Math.floor(Math.random() * 9e3 + 1e3);
      rowMap["Created At"] = now;
      rowMap["Updated At"] = now;
      newRows.push(actualHeaders.map(function(h) {
        return rowMap.hasOwnProperty(h) ? rowMap[h] : "";
      }));
    });
    if (newRows.length) sh.getRange(sh.getLastRow() + 1, 1, newRows.length, actualHeaders.length).setValues(newRows);
    return jsonOut_({ ok: true, inserted: newRows.length });
  }
  __name(seedRecordYtdDefault_, "seedRecordYtdDefault_");
  function bulkUpsertGeneric_(sheetName, headers, keyFn, idPrefix, rowMaps) {
    const sh = getOrCreateSheet_(sheetName, headers);
    const now = nowIso_();
    const currentHeaders = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
    const lastRow = sh.getLastRow();
    const dataRange = lastRow > 1 ? sh.getRange(2, 1, lastRow - 1, currentHeaders.length).getValues() : [];
    const idIdx = currentHeaders.indexOf("ID");
    const createdIdx = currentHeaders.indexOf("Created At");
    const keyToRowIndex = {};
    dataRange.forEach(function(vals, i) {
      const r = {};
      currentHeaders.forEach(function(h, ci) {
        r[h] = vals[ci];
      });
      const k = keyFn(r);
      if (k) keyToRowIndex[k] = i + 2;
    });
    let inserted = 0, updated = 0, skipped = 0;
    const newRowsToAppend = [];
    rowMaps.forEach(function(d) {
      const rowMap = {};
      headers.forEach(function(h) {
        rowMap[h] = d[h] !== void 0 && d[h] !== null ? d[h] : "";
      });
      const key = keyFn(rowMap);
      if (!key || key.replace(/\|/g, "").trim() === "") {
        skipped++;
        return;
      }
      const rowIndex = keyToRowIndex[key];
      if (rowIndex) {
        const existingVals = sh.getRange(rowIndex, 1, 1, currentHeaders.length).getValues()[0];
        if (idIdx !== -1) rowMap["ID"] = existingVals[idIdx];
        if (createdIdx !== -1 && existingVals[createdIdx]) rowMap["Created At"] = existingVals[createdIdx];
        rowMap["Updated At"] = now;
        const values = currentHeaders.map(function(h) {
          return rowMap.hasOwnProperty(h) ? rowMap[h] : existingVals[currentHeaders.indexOf(h)];
        });
        sh.getRange(rowIndex, 1, 1, values.length).setValues([values]);
        updated++;
      } else {
        rowMap["ID"] = idPrefix + "-IMP-" + Utilities.formatDate(/* @__PURE__ */ new Date(), Session.getScriptTimeZone(), "yyyyMMdd-HHmmss") + "-" + Math.floor(Math.random() * 9e3 + 1e3);
        rowMap["Created At"] = now;
        rowMap["Updated At"] = now;
        newRowsToAppend.push(currentHeaders.map(function(h) {
          return rowMap.hasOwnProperty(h) ? rowMap[h] : "";
        }));
        keyToRowIndex[key] = -1;
        inserted++;
      }
    });
    if (newRowsToAppend.length) {
      sh.getRange(sh.getLastRow() + 1, 1, newRowsToAppend.length, currentHeaders.length).setValues(newRowsToAppend);
    }
    return { ok: true, inserted, updated, skipped, total: rowMaps.length };
  }
  __name(bulkUpsertGeneric_, "bulkUpsertGeneric_");
  function kpiKerjaKey_(d) {
    return [d["Tahun"], d["Divisi"], d["KPI"]].map(function(v) {
      return String(v || "").trim().toUpperCase();
    }).join("|");
  }
  __name(kpiKerjaKey_, "kpiKerjaKey_");
  function bulkImportEnergyUtility_(body) {
    return jsonOut_(bulkUpsertGeneric_(SHEET_ENERGY_UTILITY, ENERGY_UTILITY_HEADERS, energyUtilityKey_, "ENG", body.rows || []));
  }
  __name(bulkImportEnergyUtility_, "bulkImportEnergyUtility_");
  function bulkImportRecordYtd_(body) {
    return jsonOut_(bulkUpsertGeneric_(SHEET_RECORD_YTD, RECORD_YTD_HEADERS, recordYtdKey_, "RYT", body.rows || []));
  }
  __name(bulkImportRecordYtd_, "bulkImportRecordYtd_");
  function bulkImportRunHourComparison_(body) {
    return jsonOut_(bulkUpsertGeneric_(SHEET_RUN_HOUR_COMPARISON, RUN_HOUR_COMPARISON_HEADERS, runHourKey_, "RHC", body.rows || []));
  }
  __name(bulkImportRunHourComparison_, "bulkImportRunHourComparison_");
  function bulkImportKpiKerja_(body) {
    return jsonOut_(bulkUpsertGeneric_(SHEET_KPI_KERJA, KPI_KERJA_HEADERS, kpiKerjaKey_, "KPI", body.rows || []));
  }
  __name(bulkImportKpiKerja_, "bulkImportKpiKerja_");
  function runHourKey_(d) {
    return [d["Tahun"], d["Lini"]].map(function(v) {
      return String(v || "").trim().toUpperCase();
    }).join("|");
  }
  __name(runHourKey_, "runHourKey_");
  function getRunHourComparisonList_(tahun) {
    const rows = getGenericRows_(SHEET_RUN_HOUR_COMPARISON, RUN_HOUR_COMPARISON_HEADERS);
    if (!tahun) return rows;
    return rows.filter(function(r) {
      return String(r["Tahun"]) === String(tahun);
    });
  }
  __name(getRunHourComparisonList_, "getRunHourComparisonList_");
  function saveRunHourComparison_(body) {
    const sh = getOrCreateSheet_(SHEET_RUN_HOUR_COMPARISON, RUN_HOUR_COMPARISON_HEADERS);
    const d = body.data || {};
    if (!d["Lini"]) return jsonOut_({ ok: false, error: "Nama lini wajib diisi." });
    if (!d["Tahun"]) return jsonOut_({ ok: false, error: "Tahun wajib diisi." });
    const now = nowIso_();
    const rowMap = {};
    RUN_HOUR_COMPARISON_HEADERS.forEach(function(h) {
      rowMap[h] = d[h] !== void 0 && d[h] !== null ? d[h] : "";
    });
    let found = d.ID ? findRowByColumnValue_(sh, "ID", d.ID) : null;
    if (!found) {
      const existingRows = getGenericRows_(SHEET_RUN_HOUR_COMPARISON, RUN_HOUR_COMPARISON_HEADERS);
      const targetKey = runHourKey_(rowMap);
      const match = existingRows.find(function(r) {
        return runHourKey_(r) === targetKey;
      });
      if (match) found = findRowByColumnValue_(sh, "ID", match["ID"]);
    }
    if (found) {
      const currentHeaders = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
      const currentRow = found.row;
      const idx = currentHeaders.indexOf("Created At");
      if (idx !== -1 && currentRow[idx]) rowMap["Created At"] = currentRow[idx];
      rowMap["ID"] = currentRow[currentHeaders.indexOf("ID")];
      rowMap["Updated At"] = now;
      const values = currentHeaders.map(function(h) {
        return rowMap.hasOwnProperty(h) ? rowMap[h] : currentRow[currentHeaders.indexOf(h)];
      });
      sh.getRange(found.rowIndex, 1, 1, values.length).setValues([values]);
      return jsonOut_({ ok: true, id: rowMap["ID"], updated: true });
    } else {
      rowMap["ID"] = "RHC-" + Utilities.formatDate(/* @__PURE__ */ new Date(), Session.getScriptTimeZone(), "yyyyMMdd-HHmmss") + "-" + Math.floor(Math.random() * 900 + 100);
      rowMap["Created At"] = now;
      rowMap["Updated At"] = now;
      const actualHeaders = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
      sh.appendRow(actualHeaders.map(function(h) {
        return rowMap.hasOwnProperty(h) ? rowMap[h] : "";
      }));
      return jsonOut_({ ok: true, id: rowMap["ID"], updated: false });
    }
  }
  __name(saveRunHourComparison_, "saveRunHourComparison_");
  function deleteRunHourComparison_(body) {
    const sh = getOrCreateSheet_(SHEET_RUN_HOUR_COMPARISON, RUN_HOUR_COMPARISON_HEADERS);
    const found = findRowByColumnValue_(sh, "ID", body.id);
    if (!found) return jsonOut_({ ok: false, error: "Data Run Hour Comparison tidak ditemukan." });
    sh.deleteRow(found.rowIndex);
    return jsonOut_({ ok: true });
  }
  __name(deleteRunHourComparison_, "deleteRunHourComparison_");
  function seedRunHourComparisonDefault_() {
    const sh = getOrCreateSheet_(SHEET_RUN_HOUR_COMPARISON, RUN_HOUR_COMPARISON_HEADERS);
    const existing = getGenericRows_(SHEET_RUN_HOUR_COMPARISON, RUN_HOUR_COMPARISON_HEADERS);
    const existingKeys = {};
    existing.forEach(function(r) {
      existingKeys[runHourKey_(r)] = true;
    });
    const seedData = [
      { tahun: 2020, lini: "Offset Output", jan: 308395781e-2, feb: 262844501e-2, mar: 376146729e-2, apr: 453223639e-2, mei: 354672733e-2, jun: 375181441e-2, jul: 334161786e-2, agust: 18387115e-1, sep: 305752558e-2, okt: 321156225e-2, nop: 367245507e-2, des: 407992035e-2 },
      { tahun: 2020, lini: "Folder Gluer", jan: 200164475e-2, feb: 164556358e-2, mar: 190973594e-2, apr: 236958689e-2, mei: 195506456e-2, jun: 174675647e-2, jul: 248661667e-2, agust: 126157531e-2, sep: 209172447e-2, okt: 264758733e-2, nop: 265498078e-2, des: 266117467e-2 },
      { tahun: 2020, lini: "APM", jan: 4018544, feb: 3404131, mar: 5248370, apr: 6371138, mei: 4936775, jun: 4369904, jul: 3507557, agust: 2421273, sep: 3540099, okt: 3607368, nop: 4783317, des: 3746555 },
      { tahun: 2020, lini: "Packing", jan: 108231306e-2, feb: 982881.43, mar: 185173135e-2, apr: 21626495e-1, mei: 159166278e-2, jun: 200505794e-2, jul: 855001.19, agust: 577136.19, sep: 965801.11, okt: 563974.92, nop: 10174743e-1, des: 141874568e-2 }
    ];
    const now = nowIso_();
    const actualHeaders = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
    const newRows = [];
    seedData.forEach(function(d) {
      const rowMap = {
        "Tahun": d.tahun,
        "Lini": d.lini,
        "Jan": d.jan,
        "Feb": d.feb,
        "Mar": d.mar,
        "Apr": d.apr,
        "Mei": d.mei,
        "Jun": d.jun,
        "Jul": d.jul,
        "Agust": d.agust,
        "Sep": d.sep,
        "Okt": d.okt,
        "Nop": d.nop,
        "Des": d.des,
        "Catatan": "Seed dari Excel Offset_Technical_2026_Terintegrasi.xlsx - sheet Run Hour Comparison"
      };
      if (existingKeys[runHourKey_(rowMap)]) return;
      rowMap["ID"] = "RHC-SEED-" + Utilities.formatDate(/* @__PURE__ */ new Date(), Session.getScriptTimeZone(), "yyyyMMdd-HHmmss") + "-" + Math.floor(Math.random() * 9e3 + 1e3);
      rowMap["Created At"] = now;
      rowMap["Updated At"] = now;
      newRows.push(actualHeaders.map(function(h) {
        return rowMap.hasOwnProperty(h) ? rowMap[h] : "";
      }));
    });
    if (newRows.length) sh.getRange(sh.getLastRow() + 1, 1, newRows.length, actualHeaders.length).setValues(newRows);
    return jsonOut_({ ok: true, inserted: newRows.length });
  }
  __name(seedRunHourComparisonDefault_, "seedRunHourComparisonDefault_");
  function energyCostToeKey_(d) {
    return [d["Tahun"], d["Bulan"]].map(function(v) {
      return String(v || "").trim().toUpperCase();
    }).join("|");
  }
  __name(energyCostToeKey_, "energyCostToeKey_");
  function getEnergyCostToeList_(tahun) {
    const rows = getGenericRows_(SHEET_ENERGY_COST_TOE, ENERGY_COST_TOE_HEADERS);
    if (!tahun) return rows;
    return rows.filter(function(r) {
      return String(r["Tahun"]) === String(tahun);
    });
  }
  __name(getEnergyCostToeList_, "getEnergyCostToeList_");
  function saveEnergyCostToe_(body) {
    const sh = getOrCreateSheet_(SHEET_ENERGY_COST_TOE, ENERGY_COST_TOE_HEADERS);
    const d = body.data || {};
    if (!d["Bulan"]) return jsonOut_({ ok: false, error: "Bulan wajib diisi." });
    if (!d["Tahun"]) return jsonOut_({ ok: false, error: "Tahun wajib diisi." });
    const now = nowIso_();
    const rowMap = {};
    ENERGY_COST_TOE_HEADERS.forEach(function(h) {
      rowMap[h] = d[h] !== void 0 && d[h] !== null ? d[h] : "";
    });
    let found = d.ID ? findRowByColumnValue_(sh, "ID", d.ID) : null;
    if (!found) {
      const existingRows = getGenericRows_(SHEET_ENERGY_COST_TOE, ENERGY_COST_TOE_HEADERS);
      const targetKey = energyCostToeKey_(rowMap);
      const match = existingRows.find(function(r) {
        return energyCostToeKey_(r) === targetKey;
      });
      if (match) found = findRowByColumnValue_(sh, "ID", match["ID"]);
    }
    if (found) {
      const currentHeaders = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
      const currentRow = found.row;
      const idx = currentHeaders.indexOf("Created At");
      if (idx !== -1 && currentRow[idx]) rowMap["Created At"] = currentRow[idx];
      rowMap["ID"] = currentRow[currentHeaders.indexOf("ID")];
      rowMap["Updated At"] = now;
      const values = currentHeaders.map(function(h) {
        return rowMap.hasOwnProperty(h) ? rowMap[h] : currentRow[currentHeaders.indexOf(h)];
      });
      sh.getRange(found.rowIndex, 1, 1, values.length).setValues([values]);
      return jsonOut_({ ok: true, id: rowMap["ID"], updated: true });
    } else {
      rowMap["ID"] = "ECT-" + Utilities.formatDate(/* @__PURE__ */ new Date(), Session.getScriptTimeZone(), "yyyyMMdd-HHmmss") + "-" + Math.floor(Math.random() * 900 + 100);
      rowMap["Created At"] = now;
      rowMap["Updated At"] = now;
      const actualHeaders = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
      sh.appendRow(actualHeaders.map(function(h) {
        return rowMap.hasOwnProperty(h) ? rowMap[h] : "";
      }));
      return jsonOut_({ ok: true, id: rowMap["ID"], updated: false });
    }
  }
  __name(saveEnergyCostToe_, "saveEnergyCostToe_");
  function deleteEnergyCostToe_(body) {
    const sh = getOrCreateSheet_(SHEET_ENERGY_COST_TOE, ENERGY_COST_TOE_HEADERS);
    const found = findRowByColumnValue_(sh, "ID", body.id);
    if (!found) return jsonOut_({ ok: false, error: "Data Energy Cost & TOE tidak ditemukan." });
    sh.deleteRow(found.rowIndex);
    return jsonOut_({ ok: true });
  }
  __name(deleteEnergyCostToe_, "deleteEnergyCostToe_");
  function seedEnergyCostToeDefault_() {
    const sh = getOrCreateSheet_(SHEET_ENERGY_COST_TOE, ENERGY_COST_TOE_HEADERS);
    const existing = getGenericRows_(SHEET_ENERGY_COST_TOE, ENERGY_COST_TOE_HEADERS);
    const existingKeys = {};
    existing.forEach(function(r) {
      existingKeys[energyCostToeKey_(r)] = true;
    });
    const seedData = [
      { tahun: 2025, bulan: "Jan", goodSheet: 3939970, standMeter: 22.7314, energyGwh: null, tariff: 1154.46 },
      { tahun: 2025, bulan: "Feb", goodSheet: 4233172, standMeter: 23.0662, energyGwh: 0.330708, tariff: 1154.46 },
      { tahun: 2025, bulan: "Mar", goodSheet: 4816136, standMeter: null, energyGwh: 0.292827, tariff: 1154.46 },
      { tahun: 2025, bulan: "Apr", goodSheet: 3505605, standMeter: null, energyGwh: 0.347741, tariff: 1154.46 },
      { tahun: 2025, bulan: "Mei", goodSheet: 6261289, standMeter: null, energyGwh: 0.436313, tariff: 1154.46 },
      { tahun: 2025, bulan: "Jun", goodSheet: 7122618, standMeter: null, energyGwh: 0.381073, tariff: 1154.46 },
      { tahun: 2025, bulan: "Jul", goodSheet: 6157914, standMeter: null, energyGwh: 0.385098, tariff: 1154.46 },
      { tahun: 2025, bulan: "Agust", goodSheet: 6349860, standMeter: null, energyGwh: 0.379158, tariff: 1154.46 },
      { tahun: 2025, bulan: "Sep", goodSheet: 6401105, standMeter: null, energyGwh: 0.381938, tariff: 1154.46 },
      { tahun: 2025, bulan: "Okt", goodSheet: 5581490, standMeter: null, energyGwh: 0.392726, tariff: 1154.46 },
      { tahun: 2025, bulan: "Nop", goodSheet: 4134055, standMeter: null, energyGwh: 0.339606, tariff: 1154.46 },
      { tahun: 2025, bulan: "Des", goodSheet: 4314302, standMeter: null, energyGwh: 0.365776, tariff: 1154.46 },
      { tahun: 2026, bulan: "Jan", goodSheet: 7629278, standMeter: 27.0991, energyGwh: null, tariff: 1154.46 },
      { tahun: 2026, bulan: "Feb", goodSheet: 5111741, standMeter: null, energyGwh: null, tariff: 1154.46 },
      { tahun: 2026, bulan: "Mar", goodSheet: 4500035, standMeter: null, energyGwh: null, tariff: 1154.46 },
      { tahun: 2026, bulan: "Apr", goodSheet: 6515247, standMeter: null, energyGwh: null, tariff: 1154.46 },
      { tahun: 2026, bulan: "Mei", goodSheet: 6736029, standMeter: null, energyGwh: 0.401231, tariff: 1154.46 },
      { tahun: 2026, bulan: "Jun", goodSheet: 6344295, standMeter: null, energyGwh: 0.39093, tariff: 1154.46 },
      { tahun: 2026, bulan: "Jul", goodSheet: 4729433, standMeter: null, energyGwh: 0.378774, tariff: 1154.46 }
    ];
    const now = nowIso_();
    const actualHeaders = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
    const newRows = [];
    seedData.forEach(function(d) {
      const rowMap = {
        "Tahun": d.tahun,
        "Bulan": d.bulan,
        "Good Sheet Produced": d.goodSheet,
        "Stand Meter (GWh)": d.standMeter,
        "Energy Use (GWh)": d.energyGwh,
        "Tariff (IDR/kWh)": d.tariff,
        "TOE": "",
        "Catatan": "Seed dari Excel Offset_Technical_2026_Terintegrasi.xlsx - sheet " + d.tahun + " (Kwh Offset)"
      };
      if (existingKeys[energyCostToeKey_(rowMap)]) return;
      rowMap["ID"] = "ECT-SEED-" + Utilities.formatDate(/* @__PURE__ */ new Date(), Session.getScriptTimeZone(), "yyyyMMdd-HHmmss") + "-" + Math.floor(Math.random() * 9e3 + 1e3);
      rowMap["Created At"] = now;
      rowMap["Updated At"] = now;
      newRows.push(actualHeaders.map(function(h) {
        return rowMap.hasOwnProperty(h) ? rowMap[h] : "";
      }));
    });
    if (newRows.length) sh.getRange(sh.getLastRow() + 1, 1, newRows.length, actualHeaders.length).setValues(newRows);
    return jsonOut_({ ok: true, inserted: newRows.length });
  }
  __name(seedEnergyCostToeDefault_, "seedEnergyCostToeDefault_");
  function seedKpiDepartmentExtraDefault_(body) {
    const r1 = JSON.parse(seedRecordYtdDefault_().getContent());
    const r2 = JSON.parse(seedRunHourComparisonDefault_().getContent());
    const r3 = JSON.parse(seedEnergyCostToeDefault_().getContent());
    return jsonOut_({ ok: true, recordYtd: r1.inserted, runHour: r2.inserted, energyToe: r3.inserted });
  }
  __name(seedKpiDepartmentExtraDefault_, "seedKpiDepartmentExtraDefault_");
  function seedKpiKerjaDefault_(body) {
    const tahun = body && body.tahun || (/* @__PURE__ */ new Date()).getFullYear();
    const sh = getOrCreateSheet_(SHEET_KPI_KERJA, KPI_KERJA_HEADERS);
    const existing = getKpiKerjaList_(tahun);
    const existingKeys = {};
    existing.forEach(function(r) {
      existingKeys[r["KPI"] + "|" + r["Divisi"]] = true;
    });
    const now = nowIso_();
    let added = 0;
    KPI_KERJA_DEFAULT_CATALOG.forEach(function(k) {
      const key = k.kpi + "|" + k.divisi;
      if (existingKeys[key]) return;
      const rowMap = {
        "ID": "KPI-" + Utilities.formatDate(/* @__PURE__ */ new Date(), Session.getScriptTimeZone(), "yyyyMMdd-HHmmss") + "-" + Math.floor(Math.random() * 900 + 100) + "-" + added,
        "Tahun": tahun,
        "Perspective": "INTERNAL BUSINESS PROCESS",
        "Data Producer": "Offset - Technical",
        "Divisi": k.divisi,
        "KPI": k.kpi,
        "Satuan": k.satuan,
        "Polaritas": k.polaritas,
        "Rumus": k.rumus,
        "Periode Perhitungan": "Bulanan",
        "Target Tahunan": 0,
        "Created At": now,
        "Updated At": now
      };
      const actualHeaders = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
      sh.appendRow(actualHeaders.map(function(h) {
        return rowMap.hasOwnProperty(h) ? rowMap[h] : "";
      }));
      added++;
    });
    return jsonOut_({ ok: true, added });
  }
  __name(seedKpiKerjaDefault_, "seedKpiKerjaDefault_");
  function saveAnalitikConfig_(body) {
    const cfg = {
      jamOperasiPerHari: body.jamOperasiPerHari || 24,
      jumlahMesinManual: body.jumlahMesinManual || "",
      kerugianPerJam: body.kerugianPerJam || body.kerugianPerJam === 0 ? body.kerugianPerJam : 5e6,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedBy: body.actor || ""
    };
    try {
      PropertiesService.getScriptProperties().setProperty("ANALITIK_CONFIG", JSON.stringify(cfg));
    } catch (e) {
    }
    try {
      const sh = getOrCreateSheet_("Analitik_Config", ["Key", "Value", "UpdatedAt", "UpdatedBy"]);
      const rows = [
        ["jamOperasiPerHari", String(cfg.jamOperasiPerHari), cfg.updatedAt, cfg.updatedBy],
        ["jumlahMesinManual", String(cfg.jumlahMesinManual), cfg.updatedAt, cfg.updatedBy],
        ["kerugianPerJam", String(cfg.kerugianPerJam), cfg.updatedAt, cfg.updatedBy]
      ];
      if (sh.getLastRow() > 1) sh.getRange(2, 1, sh.getLastRow() - 1, sh.getLastColumn()).clearContent();
      rows.forEach(function(r) {
        sh.appendRow(r);
      });
      invalidateCacheForSheet_("Analitik_Config");
    } catch (e) {
    }
    try {
      invalidateCacheForSheet_("ALL");
      var cache = getCache_();
      if (cache) cache.remove("ANALITIK_CONFIG");
    } catch (e) {
    }
    return jsonOut_({ ok: true, data: cfg });
  }
  __name(saveAnalitikConfig_, "saveAnalitikConfig_");
  function savePatrolCategoryConfig_(body) {
    const categories = body.categories && typeof body.categories === "object" ? body.categories : {};
    try {
      PropertiesService.getScriptProperties().setProperty("PATROL_CATEGORY_CONFIG", JSON.stringify(categories));
    } catch (e) {
    }
    try {
      const sh = getOrCreateSheet_("Patrol_Category_Config", ["Kategori", "Active", "UpdatedAt", "UpdatedBy"]);
      if (sh.getLastRow() > 1) sh.getRange(2, 1, sh.getLastRow() - 1, sh.getLastColumn()).clearContent();
      var now = (/* @__PURE__ */ new Date()).toISOString();
      var actor = body.actor || "";
      Object.keys(categories).forEach(function(k) {
        sh.appendRow([k, categories[k] ? "TRUE" : "FALSE", now, actor]);
      });
      invalidateCacheForSheet_("Patrol_Category_Config");
    } catch (e) {
    }
    try {
      var cache = getCache_();
      if (cache) cache.remove("PATROL_CATEGORY_CONFIG");
    } catch (e) {
    }
    return jsonOut_({ ok: true, data: categories });
  }
  __name(savePatrolCategoryConfig_, "savePatrolCategoryConfig_");
  function savePatrolGeneralChecklist_(body) {
    const items = body.items && typeof body.items === "object" ? body.items : {};
    try {
      PropertiesService.getScriptProperties().setProperty("PATROL_GENERAL_CHECKLIST", JSON.stringify(items));
    } catch (e) {
    }
    try {
      const sh = getOrCreateSheet_("Patrol_General_Checklist", ["Kategori", "Index", "Item", "UpdatedAt", "UpdatedBy"]);
      if (sh.getLastRow() > 1) sh.getRange(2, 1, sh.getLastRow() - 1, sh.getLastColumn()).clearContent();
      var now = (/* @__PURE__ */ new Date()).toISOString();
      var actor = body.actor || "";
      Object.keys(items).forEach(function(cat) {
        var arr = items[cat] || [];
        arr.forEach(function(it, idx) {
          sh.appendRow([cat, idx + 1, it, now, actor]);
        });
      });
      invalidateCacheForSheet_("Patrol_General_Checklist");
    } catch (e) {
    }
    try {
      var cache = getCache_();
      if (cache) cache.remove("PATROL_GENERAL_CHECKLIST");
    } catch (e) {
    }
    return jsonOut_({ ok: true, data: items });
  }
  __name(savePatrolGeneralChecklist_, "savePatrolGeneralChecklist_");
  function getSparepartSapStatusList_() {
    var rows = getGenericRows_(SHEET_SPAREPART_SAP, SPAREPART_SAP_HEADERS);
    return rows.map(function(r) {
      var id = String(r["Entry ID"] || r["ID"] || "").trim();
      var raw = String(r["Status"] || "PENDING").toUpperCase();
      var status = raw === "DONE" || raw === "COMPLETED" || raw === "COLLECTED" ? "COMPLETED" : "PENDING";
      return {
        "ID": id,
        "Status": status,
        "SAP Doc No": r["SAP Doc No"] || "",
        "PIC": r["PIC"] || "",
        "Updated At": r["Updated At"] || ""
      };
    }).filter(function(r) {
      return !!r["ID"];
    });
  }
  __name(getSparepartSapStatusList_, "getSparepartSapStatusList_");
  function getSparepartStatusMap_() {
    var rows = getSparepartSapStatusList_();
    var map = {};
    rows.forEach(function(r) {
      map[r["ID"]] = r["Status"] === "COMPLETED" ? "DONE" : "PENDING";
    });
    return map;
  }
  __name(getSparepartStatusMap_, "getSparepartStatusMap_");
  function getBootstrap_(role) {
    try {
      ensureKpiDepartmentActualData_();
    } catch (e) {
      Logger.log("KPI Department bootstrap seed warning: " + String(e));
    }
    role = String(role || "").trim();
    var canLogbook = bootstrapCan_(role, "logbook.read");
    var canPatrol = bootstrapCan_(role, "patrol.read");
    var canSparepart = bootstrapCan_(role, "sparepart.read");
    var canSetting = bootstrapCan_(role, "setting.read");
    var machines = [];
    var personil = [];
    var recentEntries = [];
    var homePatrolLatest = [];
    var patrolTemplate = [];
    var analitikConfig = {};
    var patrolCategoryConfig = {};
    var patrolGeneralChecklist = {};
    var sparepartLokasi = [];
    try {
      machines = getMachinesList_();
    } catch (e) {
    }
    try {
      personil = getPersonilList_();
    } catch (e) {
    }
    try {
      recentEntries = canLogbook ? getLogbookListSot_() : getHomeLogbookLatest_();
    } catch (e) {
    }
    try {
      homePatrolLatest = getHomePatrolLatest_(canPatrol);
    } catch (e) {
    }
    if (canPatrol) {
      try {
        patrolTemplate = getPatrolTemplateList_();
      } catch (e) {
      }
      try {
        patrolCategoryConfig = propJsonParse_("PATROL_CATEGORY_CONFIG", {});
      } catch (e) {
      }
      try {
        patrolGeneralChecklist = propJsonParse_("PATROL_GENERAL_CHECKLIST", {});
      } catch (e) {
      }
    }
    if (canSetting) {
      try {
        analitikConfig = propJsonParse_("ANALITIK_CONFIG", {});
      } catch (e) {
      }
    }
    if (canSparepart) {
      try {
        sparepartLokasi = getSparepartLokasiMerged_();
      } catch (e) {
      }
    }
    return {
      machines,
      personil,
      recentEntries,
      entries: recentEntries,
      homePatrolLatest,
      patrolTemplate,
      analitikConfig,
      patrolCategoryConfig,
      patrolGeneralChecklist,
      sparepartLokasi,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      version: ENTERPRISE_VERSION
    };
  }
  __name(getBootstrap_, "getBootstrap_");
  function propJsonParse_(key, def) {
    try {
      var v = PropertiesService.getScriptProperties().getProperty(key);
      if (!v) return def;
      return JSON.parse(v);
    } catch (e) {
      return def;
    }
  }
  __name(propJsonParse_, "propJsonParse_");
  function updateSparepartStatus_(body) {
    const sh = getOrCreateSheet_(SHEET_LOGBOOK, LOGBOOK_HEADERS);
    const data = sh.getDataRange().getValues();
    const headers = data[0];
    const idCol = headers.indexOf("ID");
    const statusCol = headers.indexOf("Status Sparepart") + 1;
    const status = body.status === "DONE" ? "DONE" : "PENDING";
    for (var i = 1; i < data.length; i++) {
      if (data[i][idCol] === body.id) {
        sh.getRange(i + 1, statusCol).setValue(status);
        return jsonOut_({ ok: true });
      }
    }
    return jsonOut_({ ok: false, error: "ID tidak ditemukan" });
  }
  __name(updateSparepartStatus_, "updateSparepartStatus_");
  function findSparepartSapRow_(sh, id) {
    return findRowByColumnValue_(sh, "Entry ID", id) || findRowByColumnValue_(sh, "ID", id);
  }
  __name(findSparepartSapRow_, "findSparepartSapRow_");
  function upsertSparepartSapRow_(sh, id, status, sapDoc, pic) {
    const found = findSparepartSapRow_(sh, id);
    const normalizedStatus = String(status || "PENDING").toUpperCase();
    const finalStatus = normalizedStatus === "DONE" || normalizedStatus === "COMPLETED" || normalizedStatus === "COLLECTED" ? "COMPLETED" : "PENDING";
    const rowMap = {
      "Entry ID": id,
      "ID": id,
      // kompatibilitas sheet legacy
      "Status": finalStatus,
      "SAP Doc No": sapDoc || "",
      "PIC": pic || "",
      "Updated At": nowIso_()
    };
    const actualHeaders = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
    const row = actualHeaders.map(function(h) {
      return rowMap.hasOwnProperty(h) ? rowMap[h] : "";
    });
    if (found) sh.getRange(found.rowIndex, 1, 1, row.length).setValues([row]);
    else sh.appendRow(row);
    invalidateCacheForSheet_(SHEET_SPAREPART_SAP);
  }
  __name(upsertSparepartSapRow_, "upsertSparepartSapRow_");
  function updateSparepartSap_(body) {
    body = body || {};
    if (!body.id) return jsonOut_({ ok: false, error: "ID logbook wajib diisi." });
    const sh = getOrCreateSheet_(SHEET_SPAREPART_SAP, SPAREPART_SAP_HEADERS);
    upsertSparepartSapRow_(sh, body.id, body.status, body.sapDoc, body.pic);
    return jsonOut_({ ok: true });
  }
  __name(updateSparepartSap_, "updateSparepartSap_");
  function bulkUpdateSparepartSap_(body) {
    body = body || {};
    const ids = Array.isArray(body.ids) ? body.ids : [];
    if (!ids.length) return jsonOut_({ ok: false, error: "Tidak ada ID yang dipilih." });
    const sh = getOrCreateSheet_(SHEET_SPAREPART_SAP, SPAREPART_SAP_HEADERS);
    ids.forEach(function(id) {
      upsertSparepartSapRow_(sh, id, body.status, body.sapDoc, body.pic);
    });
    return jsonOut_({ ok: true, count: ids.length });
  }
  __name(bulkUpdateSparepartSap_, "bulkUpdateSparepartSap_");
  function saveSparepartWarehouse_(body) {
    body = body || {};
    if (!body.poId) return jsonOut_({ ok: false, error: "PO ID wajib diisi." });
    const sh = getOrCreateSheet_(SHEET_SPAREPART_WAREHOUSE, SPAREPART_WAREHOUSE_HEADERS);
    const found = findRowByColumnValue_(sh, "PO ID", body.poId);
    const id = found && found.rowIndex ? sh.getRange(found.rowIndex, 1).getValue() : "WH-" + Date.now();
    const rowMap = {
      "ID": id,
      "Timestamp": nowIso_(),
      "PO ID": body.poId,
      "Nomor PO": body.noPO || "",
      "Nama Material": body.namaMaterial || "",
      "Qty Match": body.qtyMatch || "",
      "Condition": body.condition || "",
      "Warehouse Location": body.location || "",
      "SAP Updated": body.sapUpdated ? "YA" : "TIDAK",
      "Validator": body.validator || "",
      "Validation Date": body.validationDate || Utilities.formatDate(/* @__PURE__ */ new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd")
    };
    const actualHeaders = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
    const row = actualHeaders.map(function(h) {
      return rowMap.hasOwnProperty(h) ? rowMap[h] : "";
    });
    if (found) sh.getRange(found.rowIndex, 1, 1, row.length).setValues([row]);
    else sh.appendRow(row);
    return jsonOut_({ ok: true, id });
  }
  __name(saveSparepartWarehouse_, "saveSparepartWarehouse_");
  function getGeneralReports_() {
    const sh = getOrCreateSheet_(SHEET_REPORTS, REPORTS_HEADERS);
    const data = sh.getDataRange().getValues();
    const headers = data.shift();
    return data.filter(function(r) {
      return r[0] !== "";
    }).map(function(r) {
      const obj = rowToObj_(headers, r);
      return {
        id: obj["ID"],
        ts: obj["Timestamp"] instanceof Date ? obj["Timestamp"].getTime() : Number(obj["Timestamp"]) || Date.now(),
        type: obj["Type"],
        title: obj["Title"],
        subtitle: obj["Subtitle"],
        author: obj["Author"],
        category: obj["Category"],
        status: obj["Status"],
        progress: obj["Progress"] === "" ? null : Number(obj["Progress"]),
        tanggalMulai: obj["Tanggal Mulai"],
        tanggalSelesai: obj["Tanggal Selesai"],
        summary: obj["Summary"],
        contentHtml: obj["Content"],
        pdfUrl: obj["PDF URL"] || "",
        revision: obj["Revision"] || "",
        rawData: obj["RawDataJSON"] ? safeJsonParse_(obj["RawDataJSON"], obj["RawDataJSON"]) : ""
      };
    });
  }
  __name(getGeneralReports_, "getGeneralReports_");
  function saveGeneralReport_(report, pdfFile) {
    report = report || {};
    const sh = getOrCreateSheet_(SHEET_REPORTS, REPORTS_HEADERS);
    const data = sh.getDataRange().getValues();
    const id = report.id || "RPT-" + Utilities.formatDate(/* @__PURE__ */ new Date(), Session.getScriptTimeZone(), "yyyyMMdd-HHmmss") + "-" + Math.floor(Math.random() * 900 + 100);
    let targetRow = -1;
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0]) === String(id)) {
        targetRow = i + 1;
        break;
      }
    }
    let pdfUrl = report.pdfUrl || "";
    if (pdfFile && pdfFile.base64) {
      try {
        pdfUrl = uploadBase64File_(getOrCreateReportsPdfFolder_(), pdfFile, id + ".pdf", "application/pdf").previewUrl;
      } catch (err) {
      }
    }
    const rowMap = {
      "ID": id,
      "Timestamp": report.ts || Date.now(),
      "Type": report.type || "",
      "Title": report.title || "",
      "Subtitle": report.subtitle || "",
      "Author": report.author || "",
      "Category": report.category || "",
      "Status": report.status || "",
      "Progress": report.progress != null ? report.progress : "",
      "Tanggal Mulai": report.tanggalMulai || "",
      "Tanggal Selesai": report.tanggalSelesai || "",
      "Summary": report.summary || "",
      "Content": report.contentHtml || "",
      "PDF URL": pdfUrl,
      "Revision": report.revision || "",
      "RawDataJSON": report.rawData ? JSON.stringify(report.rawData) : ""
    };
    const actualHeaders = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
    const row = actualHeaders.map(function(h) {
      return rowMap.hasOwnProperty(h) ? rowMap[h] : "";
    });
    if (targetRow > 0) sh.getRange(targetRow, 1, 1, row.length).setValues([row]);
    else sh.appendRow(row);
    return jsonOut_({ ok: true, id, pdfUrl });
  }
  __name(saveGeneralReport_, "saveGeneralReport_");
  function deleteGeneralReport_(id) {
    const sh = getOrCreateSheet_(SHEET_REPORTS, REPORTS_HEADERS);
    const data = sh.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0]) === String(id)) {
        sh.deleteRow(i + 1);
        return jsonOut_({ ok: true, deleted: true });
      }
    }
    return jsonOut_({ ok: false, error: "ID laporan tidak ditemukan" });
  }
  __name(deleteGeneralReport_, "deleteGeneralReport_");
  function getPredictiveReports_() {
    return getGenericRows_(PREDICTIVE_SHEET_NAME, PREDICTIVE_HEADERS);
  }
  __name(getPredictiveReports_, "getPredictiveReports_");
  function bootstrapCan_(role, permissionKey) {
    try {
      return checkPermission_(role, permissionKey);
    } catch (e) {
      return false;
    }
  }
  __name(bootstrapCan_, "bootstrapCan_");
  function getHomeLogbookLatest_() {
    var rows = [];
    try {
      rows = getLogbookListSot_() || [];
    } catch (e) {
      return [];
    }
    var latest = {};
    rows.forEach(function(r) {
      var kode = String(r["Kode Mesin"] || "").trim();
      var nama = String(r["Nama Mesin"] || "").trim();
      var key = (kode || nama).toLowerCase();
      if (!key) return;
      var rawTs = r["Timestamp Input"];
      var eventMs = rawTs instanceof Date ? rawTs.getTime() : new Date(rawTs || "").getTime();
      if (!isFinite(eventMs)) {
        var tanggal = String(r["Tanggal"] || "").slice(0, 10);
        var waktu = String(r["Waktu"] || "00:00").slice(0, 5);
        eventMs = (/* @__PURE__ */ new Date(tanggal ? tanggal + "T" + waktu + ":00" : "")).getTime();
      }
      if (!isFinite(eventMs)) eventMs = 0;
      var prev = latest[key];
      if (!prev || eventMs > prev._eventMs) {
        latest[key] = {
          _eventMs: eventMs,
          "Timestamp Input": eventMs ? new Date(eventMs).toISOString() : "",
          "Tanggal": String(r["Tanggal"] || "").slice(0, 10),
          "Waktu": String(r["Waktu"] || "").slice(0, 5),
          "Kode Mesin": kode,
          "Nama Mesin": nama,
          "Status": r["Status"] || ""
        };
      }
    });
    return Object.keys(latest).map(function(k) {
      var item = latest[k];
      delete item._eventMs;
      return item;
    });
  }
  __name(getHomeLogbookLatest_, "getHomeLogbookLatest_");
  function getHomePatrolLatest_(includeDetails) {
    var rows = [];
    try {
      rows = getPredictiveReports_() || [];
    } catch (e) {
      return [];
    }
    var latest = {};
    rows.forEach(function(r) {
      var tanggal = r["Tanggal"];
      var dateText = "";
      if (tanggal instanceof Date && !isNaN(tanggal.getTime())) {
        dateText = Utilities.formatDate(tanggal, Session.getScriptTimeZone(), "yyyy-MM-dd");
      } else {
        dateText = String(tanggal || "").slice(0, 10);
      }
      if (!dateText || dateText < SOT_CUTOFF_DATE) return;
      var waktu = String(r["Waktu Patrol"] || "00:00").slice(0, 5);
      var eventMs = (/* @__PURE__ */ new Date(dateText + "T" + waktu + ":00")).getTime();
      if (!isFinite(eventMs)) {
        var rawTs = r["Timestamp"];
        eventMs = rawTs instanceof Date ? rawTs.getTime() : new Date(rawTs || "").getTime();
      }
      if (!isFinite(eventMs)) eventMs = 0;
      var kode = String(r["Kode Mesin"] || "").trim();
      var nama = String(r["Nama Mesin"] || "").trim();
      var key = (kode || nama).toLowerCase();
      if (!key) return;
      var prev = latest[key];
      if (!prev || eventMs > prev.ts) {
        var item = {
          patrolMode: true,
          ts: eventMs,
          tanggal: dateText,
          waktuPatrol: waktu,
          kodeMesin: kode,
          namaMesin: nama,
          severity: r["Severity"] || ""
        };
        if (includeDetails) {
          item.id = r["ID"] || "";
          item.score = r["Score"] === void 0 ? "" : r["Score"];
          item.deskripsiTemuan = r["Deskripsi Temuan"] || "";
          item.titikInspeksi = r["Titik Inspeksi"] || "";
        }
        latest[key] = item;
      }
    });
    return Object.keys(latest).map(function(k) {
      return latest[k];
    });
  }
  __name(getHomePatrolLatest_, "getHomePatrolLatest_");
  function savePredictiveReport_(report, files) {
    report = report || {};
    const sh = getOrCreateSheet_(PREDICTIVE_SHEET_NAME, PREDICTIVE_HEADERS);
    ensureHeaderColumns_(sh, ["Patrol Mode", "Checklist (JSON)", "Counts (JSON)", "Score", "Findings (JSON)"]);
    const data = sh.getDataRange().getValues();
    const id = report.id || "PM-" + Date.now();
    let targetRow = -1;
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0]) === String(id)) {
        targetRow = i + 1;
        break;
      }
    }
    let attachments = [];
    if (Array.isArray(files) && files.length) {
      const folder = getOrCreateDriveFolder_();
      attachments = files.map(function(f) {
        const up = uploadBase64File_(folder, f, f.name || "attachment", f.mimeType || "application/octet-stream");
        return {
          id: up.id,
          name: up.name,
          mimeType: up.mimeType,
          type: up.type || (up.mimeType && up.mimeType.indexOf("video") === 0 ? "video" : "image"),
          thumbUrl: up.thumbUrl,
          viewUrl: up.viewUrl,
          previewUrl: up.previewUrl
        };
      });
    } else if (targetRow > 0) {
      const headers = data[0];
      const filesCol = headers.indexOf("Files");
      attachments = safeJsonParse_(data[targetRow - 1][filesCol] || "[]", []);
    }
    const rowMap = {
      "ID": id,
      "Timestamp": report.ts || Date.now(),
      "Tanggal": report.tanggal || "",
      "Shift": report.shift || "",
      "Petugas": report.petugas || "",
      "Kode Mesin": report.kodeMesin || "",
      "Nama Mesin": report.namaMesin || "",
      "Titik Inspeksi": report.titikInspeksi || "",
      "Vibrasi": report.vibrasi || "",
      "Suhu": report.suhu || "",
      "Suara": report.suara || "",
      "Kebocoran": report.kebocoran || "",
      "Kelistrikan": report.kelistrikan || "",
      "Pelumasan": report.pelumasan || "",
      "Severity": report.severity || "",
      "Deskripsi Temuan": report.deskripsiTemuan || "",
      "Rekomendasi": report.rekomendasi || "",
      "Files": JSON.stringify(attachments),
      "Grouping Team": report.groupingTeam || "",
      "Waktu Patrol": report.waktuPatrol || "",
      "Patrol Mode": report.patrolMode === true,
      "Checklist (JSON)": JSON.stringify(report.checklist || {}),
      "Counts (JSON)": JSON.stringify(report.counts || {}),
      "Score": report.score === void 0 || report.score === null ? "" : report.score,
      // Findings dari frontend dapat membawa blob: URL lokal untuk preview instan.
      // Sebelum persisted, ganti file di setiap finding dengan attachment permanen
      // hasil upload Cloudflare sesuai urutan file. Dengan begitu gadget lain selalu
      // menerima /files/<id>, bukan blob:<id-perangkat-asal>.
      "Findings (JSON)": JSON.stringify((function() {
        var findings = JSON.parse(JSON.stringify(report.findings || []));
        var cursor = 0;
        findings.forEach(function(finding) {
          if (!Array.isArray(finding.files)) return;
          finding.files = finding.files.map(function(oldFile) {
            var stable = attachments[cursor++];
            if (stable) return stable;
            if (oldFile && oldFile.viewUrl && String(oldFile.viewUrl).indexOf("blob:") !== 0) {
              return { name: oldFile.name || "lampiran", mimeType: oldFile.mimeType || "", type: oldFile.type || "", viewUrl: oldFile.viewUrl, previewUrl: oldFile.previewUrl || oldFile.viewUrl, thumbUrl: oldFile.thumbUrl || oldFile.viewUrl };
            }
            return { name: oldFile && oldFile.name || "lampiran" };
          });
        });
        return findings;
      })())
    };
    const actualHeaders = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
    const row = actualHeaders.map(function(h) {
      return rowMap.hasOwnProperty(h) ? rowMap[h] : "";
    });
    if (targetRow > 0) sh.getRange(targetRow, 1, 1, row.length).setValues([row]);
    else sh.appendRow(row);
    invalidateCacheForSheet_(PREDICTIVE_SHEET_NAME);
    return jsonOut_({ ok: true, id, attachments });
  }
  __name(savePredictiveReport_, "savePredictiveReport_");
  function deletePredictiveReport_(id) {
    const sh = getOrCreateSheet_(PREDICTIVE_SHEET_NAME, PREDICTIVE_HEADERS);
    const data = sh.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0]) === String(id)) {
        sh.deleteRow(i + 1);
        invalidateCacheForSheet_(PREDICTIVE_SHEET_NAME);
        return jsonOut_({ ok: true, deleted: true });
      }
    }
    return jsonOut_({ ok: false, error: "ID laporan patrol tidak ditemukan" });
  }
  __name(deletePredictiveReport_, "deletePredictiveReport_");
  function getIpalReports_() {
    return getGenericRows_(IPAL_SHEET_NAME, IPAL_HEADERS);
  }
  __name(getIpalReports_, "getIpalReports_");
  function saveIpalReport_(report) {
    report = report || {};
    const sh = getOrCreateSheet_(IPAL_SHEET_NAME, IPAL_HEADERS);
    const data = sh.getDataRange().getValues();
    const id = report.id || "IPAL-" + Date.now();
    let targetRow = -1;
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0]) === String(id)) {
        targetRow = i + 1;
        break;
      }
    }
    const rowMap = {
      "ID": id,
      "Timestamp": Date.now(),
      "Pelapor": report.pelapor || "",
      "Bulan": report.bulan || "",
      "OutletLabel": report.outletLabel || "",
      "DailyJSON": report.daily || "{}",
      "ChemicalJSON": report.chemical || "[]"
    };
    const actualHeaders = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
    const row = actualHeaders.map(function(h) {
      return rowMap.hasOwnProperty(h) ? rowMap[h] : "";
    });
    if (targetRow > 0) sh.getRange(targetRow, 1, 1, row.length).setValues([row]);
    else sh.appendRow(row);
    return jsonOut_({ ok: true, id });
  }
  __name(saveIpalReport_, "saveIpalReport_");
  function deleteIpalReport_(id) {
    const sh = getOrCreateSheet_(IPAL_SHEET_NAME, IPAL_HEADERS);
    const data = sh.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0]) === String(id)) {
        sh.deleteRow(i + 1);
        return jsonOut_({ ok: true, deleted: true });
      }
    }
    return jsonOut_({ ok: false, error: "ID report IPAL tidak ditemukan" });
  }
  __name(deleteIpalReport_, "deleteIpalReport_");
  function getRcaReports_() {
    const sh = getOrCreateSheet_(SHEET_RCA, RCA_HEADERS);
    const data = sh.getDataRange().getValues();
    const headers = data.shift();
    return data.filter(function(r) {
      return r[0] !== "";
    }).map(function(r) {
      const obj = rowToObj_(headers, r);
      return {
        id: obj["ID"],
        ts: obj["Timestamp"] instanceof Date ? obj["Timestamp"].getTime() : Number(obj["Timestamp"]) || Date.now(),
        machineName: obj["Nama Mesin"] || "",
        title: obj["Title"] || "",
        sections: obj["SectionsJSON"] || "[]"
      };
    });
  }
  __name(getRcaReports_, "getRcaReports_");
  function saveRcaReport_(report) {
    report = report || {};
    const sh = getOrCreateSheet_(SHEET_RCA, RCA_HEADERS);
    const data = sh.getDataRange().getValues();
    const id = report.id || "RCA-" + Utilities.formatDate(/* @__PURE__ */ new Date(), Session.getScriptTimeZone(), "yyyyMMdd-HHmmss") + "-" + Math.floor(Math.random() * 900 + 100);
    let targetRow = -1;
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0]) === String(id)) {
        targetRow = i + 1;
        break;
      }
    }
    const rowMap = {
      "ID": id,
      "Timestamp": report.ts || Date.now(),
      "Nama Mesin": report.machineName || "",
      "Title": report.title || "",
      "SectionsJSON": report.sections || "[]"
    };
    const actualHeaders = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
    const row = actualHeaders.map(function(h) {
      return rowMap.hasOwnProperty(h) ? rowMap[h] : "";
    });
    if (targetRow > 0) sh.getRange(targetRow, 1, 1, row.length).setValues([row]);
    else sh.appendRow(row);
    return jsonOut_({ ok: true, id });
  }
  __name(saveRcaReport_, "saveRcaReport_");
  function deleteRcaReport_(id) {
    const sh = getOrCreateSheet_(SHEET_RCA, RCA_HEADERS);
    const data = sh.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0]) === String(id)) {
        sh.deleteRow(i + 1);
        return jsonOut_({ ok: true, deleted: true });
      }
    }
    return jsonOut_({ ok: false, error: "ID laporan RCA tidak ditemukan" });
  }
  __name(deleteRcaReport_, "deleteRcaReport_");
  function getKbEntries_() {
    const sh = getOrCreateSheet_(SHEET_KB, KB_HEADERS);
    const data = sh.getDataRange().getValues();
    const headers = data.shift();
    return data.filter(function(r) {
      return r[0] !== "";
    }).map(function(r) {
      const obj = rowToObj_(headers, r);
      return {
        id: obj["ID"],
        ts: obj["Timestamp"] instanceof Date ? obj["Timestamp"].getTime() : Number(obj["Timestamp"]) || Date.now(),
        kategori: obj["Kategori"] || "",
        kodeMesin: obj["Kode Mesin"] || "",
        namaMesin: obj["Nama Mesin"] || "",
        judul: obj["Judul"] || "",
        konten: obj["Konten"] || "",
        tags: obj["Tags"] || "",
        author: obj["Author"] || "",
        sourceType: obj["Source Type"] || "",
        sourceId: obj["Source ID"] || ""
      };
    });
  }
  __name(getKbEntries_, "getKbEntries_");
  function saveKbEntry_(body) {
    const entry = body.entry || {};
    if (!entry.judul || String(entry.judul).trim() === "") {
      return jsonOut_({ ok: false, error: "Judul wajib diisi." });
    }
    const sh = getOrCreateSheet_(SHEET_KB, KB_HEADERS);
    const data = sh.getDataRange().getValues();
    const id = entry.id || "KB-" + Utilities.formatDate(/* @__PURE__ */ new Date(), Session.getScriptTimeZone(), "yyyyMMdd-HHmmss") + "-" + Math.floor(Math.random() * 900 + 100);
    let targetRow = -1;
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0]) === String(id)) {
        targetRow = i + 1;
        break;
      }
    }
    const rowMap = {
      "ID": id,
      "Timestamp": entry.ts || Date.now(),
      "Kategori": entry.kategori || "Frequently Problem",
      "Kode Mesin": entry.kodeMesin || "",
      "Nama Mesin": entry.namaMesin || "",
      "Judul": entry.judul || "",
      "Konten": entry.konten || "",
      "Tags": entry.tags || "",
      "Author": entry.author || "",
      "Source Type": entry.sourceType || "",
      "Source ID": entry.sourceId || ""
    };
    const actualHeaders = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
    const row = actualHeaders.map(function(h) {
      return rowMap.hasOwnProperty(h) ? rowMap[h] : "";
    });
    if (targetRow > 0) sh.getRange(targetRow, 1, 1, row.length).setValues([row]);
    else sh.appendRow(row);
    return jsonOut_({ ok: true, id });
  }
  __name(saveKbEntry_, "saveKbEntry_");
  function deleteKbEntry_(body) {
    const id = body.id;
    const sh = getOrCreateSheet_(SHEET_KB, KB_HEADERS);
    const data = sh.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0]) === String(id)) {
        sh.deleteRow(i + 1);
        return jsonOut_({ ok: true, deleted: true });
      }
    }
    return jsonOut_({ ok: false, error: "ID entri Knowledge Base tidak ditemukan" });
  }
  __name(deleteKbEntry_, "deleteKbEntry_");
  function saveDowntimeHistory_(body) {
    body = body || {};
    const periode = body.periode || "";
    if (!periode) return jsonOut_({ ok: false, error: "Periode wajib diisi." });
    const rows = Array.isArray(body.rows) ? body.rows : [];
    const sh = getOrCreateSheet_(SHEET_DOWNTIME_EM, DOWNTIME_EM_HEADERS);
    const data = sh.getDataRange().getValues();
    const headers = data[0];
    const periodeCol = headers.indexOf("Periode");
    let targetRow = -1;
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][periodeCol]) === String(periode)) {
        targetRow = i + 1;
        break;
      }
    }
    const parts = String(periode).split("-");
    const id = targetRow > 0 ? data[targetRow - 1][headers.indexOf("ID")] : "DTEM-" + periode + "-" + Math.floor(Math.random() * 900 + 100);
    const rowMap = {
      "ID": id,
      "Timestamp": Date.now(),
      "Periode": periode,
      "Year": parts[0] || "",
      "Month": parts[1] || "",
      "RowsJSON": JSON.stringify(rows)
    };
    const actualHeaders = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
    const row = actualHeaders.map(function(h) {
      return rowMap.hasOwnProperty(h) ? rowMap[h] : "";
    });
    if (targetRow > 0) sh.getRange(targetRow, 1, 1, row.length).setValues([row]);
    else sh.appendRow(row);
    return jsonOut_({ ok: true, id, periode });
  }
  __name(saveDowntimeHistory_, "saveDowntimeHistory_");
  function findSparepartEtaRow_(sh, id) {
    return findRowByColumnValue_(sh, "ID", id);
  }
  __name(findSparepartEtaRow_, "findSparepartEtaRow_");
  function saveSparepartEta_(body) {
    body = body || {};
    if (!body.namaMaterial || !body.noPO || !body.estimasiEta) {
      return jsonOut_({ ok: false, error: "Nama Material, Nomor PO, dan Estimasi ETA wajib diisi." });
    }
    const sh = getOrCreateSheet_(SHEET_SPAREPART_ETA, SPAREPART_ETA_HEADERS);
    const id = body.id || "ETA-" + Date.now();
    const found = findSparepartEtaRow_(sh, id);
    const rowMap = {
      "ID": id,
      "Timestamp": body.createdAt || nowIso_(),
      "Nama Material": body.namaMaterial || "",
      "Material Number SAP": body.sap || "",
      "Nomor PO": body.noPO || "",
      "Vendor": body.vendor || "",
      "Qty": body.qty || 1,
      "Tanggal PO": body.tanggalPO || "",
      "Estimasi ETA": body.estimasiEta || "",
      "Status": body.status || "MENUNGGU",
      "Tanggal Tiba": body.tanggalTiba || "",
      "Catatan": body.catatan || ""
    };
    const actualHeaders = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
    const row = actualHeaders.map(function(h) {
      return rowMap.hasOwnProperty(h) ? rowMap[h] : "";
    });
    if (found) sh.getRange(found.rowIndex, 1, 1, row.length).setValues([row]);
    else sh.appendRow(row);
    return jsonOut_({ ok: true, id });
  }
  __name(saveSparepartEta_, "saveSparepartEta_");
  function updateSparepartEta_(body) {
    body = body || {};
    const sh = getOrCreateSheet_(SHEET_SPAREPART_ETA, SPAREPART_ETA_HEADERS);
    const found = findSparepartEtaRow_(sh, body.id);
    if (!found) return jsonOut_({ ok: false, error: "Data ETA tidak ditemukan." });
    if (body.status) sh.getRange(found.rowIndex, found.headers.indexOf("Status") + 1).setValue(body.status);
    if (body.tanggalTiba) sh.getRange(found.rowIndex, found.headers.indexOf("Tanggal Tiba") + 1).setValue(body.tanggalTiba);
    if (body.vendor !== void 0 && found.headers.indexOf("Vendor") !== -1) sh.getRange(found.rowIndex, found.headers.indexOf("Vendor") + 1).setValue(body.vendor);
    return jsonOut_({ ok: true });
  }
  __name(updateSparepartEta_, "updateSparepartEta_");
  function deleteSparepartEta_(body) {
    const sh = getOrCreateSheet_(SHEET_SPAREPART_ETA, SPAREPART_ETA_HEADERS);
    const found = findSparepartEtaRow_(sh, body.id);
    if (!found) return jsonOut_({ ok: false, error: "Data ETA tidak ditemukan." });
    sh.deleteRow(found.rowIndex);
    return jsonOut_({ ok: true });
  }
  __name(deleteSparepartEta_, "deleteSparepartEta_");
  function findSparepartOpnameRow_(sh, id) {
    return findRowByColumnValue_(sh, "ID", id);
  }
  __name(findSparepartOpnameRow_, "findSparepartOpnameRow_");
  function saveSparepartOpname_(body) {
    body = body || {};
    if (!body.namaMaterial || body.stockFisik === void 0 || body.stockFisik === null || body.stockFisik === "") {
      return jsonOut_({ ok: false, error: "Nama Material dan Stock Fisik wajib diisi." });
    }
    const sh = getOrCreateSheet_(SHEET_SPAREPART_OPNAME, SPAREPART_OPNAME_HEADERS);
    const id = body.id || "OP-" + Date.now();
    const rowMap = {
      "ID": id,
      "Timestamp": body.createdAt || nowIso_(),
      "Tanggal": body.tanggal || Utilities.formatDate(/* @__PURE__ */ new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd"),
      "Part No": body.partNo || "",
      "Nama Material": body.namaMaterial || "",
      "Material Number SAP": body.sap || "",
      "Stock Sistem": body.stockSistem === null || body.stockSistem === void 0 ? "" : body.stockSistem,
      "Stock Fisik": body.stockFisik,
      "Selisih": body.selisih === null || body.selisih === void 0 ? "" : body.selisih,
      "Lokasi Rak": body.lokasi || "",
      "Catatan": body.catatan || ""
    };
    const actualHeaders = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
    sh.appendRow(actualHeaders.map(function(h) {
      return rowMap.hasOwnProperty(h) ? rowMap[h] : "";
    }));
    return jsonOut_({ ok: true, id });
  }
  __name(saveSparepartOpname_, "saveSparepartOpname_");
  function deleteSparepartOpname_(body) {
    const sh = getOrCreateSheet_(SHEET_SPAREPART_OPNAME, SPAREPART_OPNAME_HEADERS);
    const found = findSparepartOpnameRow_(sh, body.id);
    if (!found) return jsonOut_({ ok: false, error: "Data opname tidak ditemukan." });
    sh.deleteRow(found.rowIndex);
    return jsonOut_({ ok: true });
  }
  __name(deleteSparepartOpname_, "deleteSparepartOpname_");
  async function callGeminiModel_(modelName, apiKey, payload) {
    const url = "https://generativelanguage.googleapis.com/v1beta/models/" + modelName + ":generateContent";
    const response = await UrlFetchApp.fetch(url, {
      method: "post",
      contentType: "application/json",
      headers: { "x-goog-api-key": apiKey },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });
    const httpCode = response.getResponseCode();
    if (httpCode !== 200) {
      return { success: false, httpCode, errorText: response.getContentText().slice(0, 300) };
    }
    const raw = JSON.parse(response.getContentText());
    const candidate = (raw.candidates || [])[0];
    return { success: true, raw, candidate };
  }
  __name(callGeminiModel_, "callGeminiModel_");
  async function callGroqModel_(modelName, apiKey, systemPrompt, userPrompt) {
    const url = "https://api.groq.com/openai/v1/chat/completions";
    const response = await UrlFetchApp.fetch(url, {
      method: "post",
      contentType: "application/json",
      headers: { "Authorization": "Bearer " + apiKey },
      payload: JSON.stringify({
        model: modelName,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        max_tokens: 2048,
        temperature: 0.4
      }),
      muteHttpExceptions: true
    });
    const httpCode = response.getResponseCode();
    if (httpCode !== 200) {
      return { success: false, httpCode, errorText: response.getContentText().slice(0, 300) };
    }
    const raw = JSON.parse(response.getContentText());
    const text = raw.choices && raw.choices[0] && raw.choices[0].message && raw.choices[0].message.content || "";
    return { success: true, text };
  }
  __name(callGroqModel_, "callGroqModel_");
  async function getGroqAvailableModels_(apiKey) {
    try {
      const response = await UrlFetchApp.fetch("https://api.groq.com/openai/v1/models", {
        method: "get",
        headers: { "Authorization": "Bearer " + apiKey },
        muteHttpExceptions: true
      });
      if (response.getResponseCode() !== 200) return [];
      const raw = JSON.parse(response.getContentText());
      const rows = Array.isArray(raw.data) ? raw.data : [];
      return rows.map(function(x) {
        return String(x.id || "");
      }).filter(function(id) {
        return !!id;
      });
    } catch (e) {
      return [];
    }
  }
  __name(getGroqAvailableModels_, "getGroqAvailableModels_");
  function rankGroqModels_(available) {
    const preferred = GROQ_MODELS.slice();
    const out = [];
    preferred.forEach(function(id) {
      if (available.indexOf(id) >= 0 && out.indexOf(id) < 0) out.push(id);
    });
    available.forEach(function(id) {
      const x = id.toLowerCase();
      if (out.indexOf(id) >= 0) return;
      if (/whisper|tts|guard|safeguard|compound|embedding/.test(x)) return;
      if (/instruct|gpt-oss|llama|qwen|mixtral|gemma/.test(x)) out.push(id);
    });
    return out;
  }
  __name(rankGroqModels_, "rankGroqModels_");
  async function tryGroqFallback_(systemPrompt, userPrompt, attemptErrors) {
    const groqKey = PropertiesService.getScriptProperties().getProperty("GROQ_API_KEY");
    if (!groqKey) return null;
    const available = await getGroqAvailableModels_(groqKey);
    const models = rankGroqModels_(available);
    const candidates = models.length ? models : GROQ_MODELS.slice();
    for (var i = 0; i < candidates.length; i++) {
      const modelName = candidates[i];
      const attempt = await callGroqModel_(modelName, groqKey, systemPrompt, userPrompt);
      if (attempt.success) return { text: attempt.text, modelUsed: "groq:" + modelName };
      attemptErrors.push("groq:" + modelName + " -> HTTP " + attempt.httpCode + ": " + attempt.errorText);
    }
    if (!available.length) {
      attemptErrors.push("groq:model discovery -> daftar model Groq tidak dapat dibaca; kandidat lokal sudah dicoba");
    }
    return null;
  }
  __name(tryGroqFallback_, "tryGroqFallback_");
  async function tryGeminiText_(systemPrompt, userPrompt, attemptErrors) {
    const apiKey = PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY");
    if (!apiKey) return null;
    const payload = {
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      generationConfig: { maxOutputTokens: 2048, temperature: 0.2 }
    };
    for (var i = 0; i < GEMINI_MODELS.length; i++) {
      const modelName = GEMINI_MODELS[i];
      const attempt = await callGeminiModel_(modelName, apiKey, payload);
      if (!attempt.success) {
        attemptErrors.push("gemini:" + modelName + " -> HTTP " + attempt.httpCode + ": " + attempt.errorText);
        continue;
      }
      const candidate = attempt.candidate;
      const parts = candidate && candidate.content && candidate.content.parts ? candidate.content.parts : [];
      const text = parts.map(function(p) {
        return p.text || "";
      }).join("").trim();
      if (text) return { text, modelUsed: "gemini:" + modelName };
      attemptErrors.push("gemini:" + modelName + " -> respons kosong");
    }
    return null;
  }
  __name(tryGeminiText_, "tryGeminiText_");
  async function callExternalTextAi_(systemPrompt, userPrompt, attemptErrors) {
    const groqResult = await tryGroqFallback_(systemPrompt, userPrompt, attemptErrors);
    if (groqResult) return groqResult;
    const geminiResult = await tryGeminiText_(systemPrompt, userPrompt, attemptErrors);
    if (geminiResult) return geminiResult;
    return null;
  }
  __name(callExternalTextAi_, "callExternalTextAi_");
  async function handleGroqFixTypo_(body) {
    const text = String(body.text || "").trim();
    if (!text) return jsonOut_({ ok: false, error: "Teks kosong." });
    if (text.length > 4e3) return jsonOut_({ ok: false, error: "Teks terlalu panjang untuk diperiksa (maks 4000 karakter)." });
    const fieldLabel = String(body.field || "catatan maintenance").trim();
    const systemPrompt = [
      "Anda adalah proofreader Bahasa Indonesia untuk catatan teknis maintenance mesin pabrik (percetakan/packaging).",
      'Tugas Anda HANYA memperbaiki typo/salah ketik pada kata-kata bahasa sehari-hari (bukan istilah teknis), plus tanda baca ringan, pada teks field "' + fieldLabel + '".',
      "ATURAN KETAT SOAL ISTILAH TEKNIS/ASING:",
      "- JANGAN menerjemahkan atau meng-Indonesia-kan istilah teknis/asing apapun. Istilah teknis/asing HANYA boleh dibetulkan ejaan aslinya (bahasa sumbernya), TIDAK boleh diganti ke padanan bahasa Indonesia.",
      '  Contoh WAJIB: "vacum" -> "vacuum" (BUKAN "vakum"); "bering" -> "bearing" (BUKAN "laher"/"bantalan"); "gearbox", "bearing", "sensor", "motor", "spindle", dsb tetap dalam bentuk aslinya, hanya dibetulkan typo-nya.',
      "- JANGAN mengubah singkatan, kode mesin, nomor part, merek, atau angka/satuan apapun.",
      "ATURAN LAIN:",
      "- Untuk kata-kata bahasa sehari-hari (non-teknis), perbaikan ejaan boleh dilakukan lebih menyeluruh sesuai KBBI/EYD.",
      "- JANGAN menambah, menghapus, atau menafsirkan ulang informasi apapun.",
      "- JANGAN mengubah gaya bahasa, membuatnya lebih formal, atau meringkas/memperpanjang.",
      "- Huruf pertama pada awal SETIAP kalimat WAJIB huruf kapital (setelah tanda titik, tanda tanya, tanda seru, atau di awal teks).",
      "- Kalau teks sudah benar, kembalikan PERSIS apa adanya tanpa perubahan.",
      "Balas HANYA dengan teks hasil perbaikan saja -- tanpa penjelasan, tanpa tanda kutip pembuka/penutup, tanpa markdown, tanpa awalan apapun."
    ].join("\n");
    const attemptErrors = [];
    const result = await callExternalTextAi_(systemPrompt, text, attemptErrors);
    if (!result) {
      const hasGroq = !!PropertiesService.getScriptProperties().getProperty("GROQ_API_KEY");
      const hasGemini = !!PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY");
      if (!hasGroq && !hasGemini) return jsonOut_({ ok: false, error: "AI External belum dikonfigurasi. Atur GROQ_API_KEY atau GEMINI_API_KEY pada Cloudflare Worker Secrets." });
      return jsonOut_({ ok: false, error: "AI External gagal melakukan koreksi. " + attemptErrors.join(" | ") });
    }
    const corrected = String(result.text || "").trim();
    if (!corrected) return jsonOut_({ ok: false, error: "AI External mengembalikan respons kosong." });
    return jsonOut_({ ok: true, corrected, modelUsed: result.modelUsed });
  }
  __name(handleGroqFixTypo_, "handleGroqFixTypo_");
  async function handleGroqKbEnrich_(body) {
    const judul = String(body.judul || "").trim();
    const konten = String(body.konten || "").trim();
    const kategori = String(body.kategori || "Frequently Problem").trim();
    if (!judul && !konten) return jsonOut_({ ok: false, error: "Isi judul atau konten dulu sebelum dirapikan." });
    if ((judul + konten).length > 6e3) return jsonOut_({ ok: false, error: "Konten terlalu panjang untuk dirapikan sekaligus (maks 6000 karakter)." });
    const structureGuide = {
      "Frequently Problem": "Gejala yang muncul, Penyebab Umum, Cara Mengatasi/Langkah Perbaikan",
      "Best Practice": "Tujuan, Langkah-Langkah, Manfaat/Hasil",
      "Lessons Learned": "Kronologi Kejadian, Akar Masalah, Pelajaran & Cara Mencegah Berulang"
    }[kategori] || "poin-poin yang relevan";
    const systemPrompt = [
      "Anda adalah editor Knowledge Base maintenance mesin pabrik (percetakan/packaging) berbahasa Indonesia.",
      'Tugas Anda merapikan JUDUL & KONTEN catatan mentah dari teknisi menjadi entri Knowledge Base kategori "' + kategori + '" yang rapi dan actionable, memakai struktur: ' + structureGuide + ".",
      "ATURAN KETAT:",
      "- JANGAN mengarang fakta, angka, nama komponen, atau langkah yang tidak disebutkan/tersirat di catatan asli.",
      '- Kalau salah satu bagian struktur memang tidak ada informasinya di catatan asli, tulis "Tidak disebutkan" untuk bagian itu -- jangan mengarang.',
      "- Boleh merapikan kalimat, memperbaiki ejaan, dan menyusun ulang urutan supaya lebih runtut, TAPI jangan mengubah makna teknis.",
      "- Judul dibuat singkat & jelas (maks ~12 kata), mencerminkan isi.",
      "- Usulkan 3-6 tags relevan (kata benda teknis/komponen/jenis masalah, huruf kecil, dipisah koma).",
      "Balas HANYA dalam format JSON murni (tanpa markdown/code fence/teks lain di luar JSON), persis struktur ini:",
      '{"judul":"...","konten":"...","tags":"tag1, tag2, tag3"}'
    ].join("\n");
    const userPrompt = "Judul (boleh kosong/asal-asalan): " + (judul || "(kosong)") + "\n\nCatatan mentah:\n" + (konten || "(kosong)");
    const attemptErrors = [];
    const result = await callExternalTextAi_(systemPrompt, userPrompt, attemptErrors);
    if (!result) {
      const hasGroq = !!PropertiesService.getScriptProperties().getProperty("GROQ_API_KEY");
      const hasGemini = !!PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY");
      if (!hasGroq && !hasGemini) return jsonOut_({ ok: false, error: "AI External belum dikonfigurasi. Atur GROQ_API_KEY atau GEMINI_API_KEY pada Cloudflare Worker Secrets." });
      return jsonOut_({ ok: false, error: "AI External gagal merapikan Knowledge Base. " + attemptErrors.join(" | ") });
    }
    var raw = String(result.text || "").trim().replace(/^```json/i, "").replace(/^```/, "").replace(/```$/, "").trim();
    try {
      var parsed = JSON.parse(raw);
      if (!parsed.judul && !parsed.konten) return jsonOut_({ ok: false, error: "AI External mengembalikan JSON tanpa judul/konten." });
      return jsonOut_({
        ok: true,
        judul: String(parsed.judul || judul).trim(),
        konten: String(parsed.konten || konten).trim(),
        tags: String(parsed.tags || "").trim(),
        modelUsed: result.modelUsed
      });
    } catch (e) {
      return jsonOut_({ ok: false, error: "Respons AI External tidak dapat dibaca sebagai JSON valid: " + String(e) });
    }
  }
  __name(handleGroqKbEnrich_, "handleGroqKbEnrich_");
  const AI_MARK_RINGKASAN = "===RINGKASAN===";
  const AI_MARK_LANGKAH = "===LANGKAH_PERBAIKAN===";
  const AI_MARK_CATATAN = "===CATATAN_TAMBAHAN===";
  function extractAiSection_(text, startMarker, endMarkers) {
    const startIdx = text.indexOf(startMarker);
    if (startIdx === -1) return "";
    let sliceStart = startIdx + startMarker.length;
    let sliceEnd = text.length;
    endMarkers.forEach(function(m) {
      const idx = text.indexOf(m, sliceStart);
      if (idx !== -1 && idx < sliceEnd) sliceEnd = idx;
    });
    return text.slice(sliceStart, sliceEnd).trim();
  }
  __name(extractAiSection_, "extractAiSection_");
  function parseAiSteps_(block) {
    if (!block) return [];
    const lines = block.split("\n").map(function(l) {
      return l.trim();
    }).filter(Boolean);
    const steps = [];
    let buffer = "";
    lines.forEach(function(line) {
      const isNewStep = /^(\d+[\.\)]|[-•])\s+/.test(line);
      if (isNewStep) {
        if (buffer) steps.push(buffer.trim());
        buffer = line.replace(/^(\d+[\.\)]|[-•])\s+/, "");
      } else if (buffer) {
        buffer += " " + line;
      } else {
        buffer = line;
      }
    });
    if (buffer) steps.push(buffer.trim());
    return steps;
  }
  __name(parseAiSteps_, "parseAiSteps_");
  function extractGroundingSources_(candidate) {
    const gm = candidate && candidate.groundingMetadata;
    if (!gm) return [];
    const chunks = gm.groundingChunks || [];
    const seen = {};
    const out = [];
    chunks.forEach(function(c) {
      const web = c && c.web;
      if (!web || !web.uri) return;
      if (seen[web.uri]) return;
      seen[web.uri] = true;
      out.push({ title: web.title || web.uri, url: web.uri });
    });
    return out;
  }
  __name(extractGroundingSources_, "extractGroundingSources_");
  async function handleAiAnalyzeFreeform_(body, apiKey) {
    const query = String(body.query || "").trim();
    let cases = Array.isArray(body.cases) ? body.cases.slice(0, 8) : [];
    let localPatterns = Array.isArray(body.localPatterns) ? body.localPatterns.slice(0, 6) : [];
    const casesText = cases.map(function(c) {
      return "[id:" + (c.id || "-") + "] mesin=" + (c.mesin || "-") + " | unit=" + (c.unit || "-") + " | tanggal=" + (c.tanggal || "-") + " | masalah=" + (c.masalah || "-") + " | tindakan=" + (c.tindakan || "-") + " | material=" + (c.material || "-");
    }).join("\n");
    const localPatternsText = localPatterns.length ? localPatterns.map(function(p, i2) {
      const ids = Array.isArray(p.ids) ? p.ids.join(",") : "";
      return i2 + 1 + '. "' + (p.tindakan || "-") + '" \u2014 sudah terpakai ' + (p.frekuensi || 0) + "x pada kasus serupa [id sumber: " + (ids || "-") + "]";
    }).join("\n") : "(tidak ada pola yang cukup kuat dari perhitungan lokal)";
    const systemPrompt = [
      "Anda adalah asisten analisa maintenance mesin percetakan/packaging.",
      "Ikuti PERSIS format jawaban yang diminta di dalam pertanyaan pengguna, jangan menambah/mengurangi format.",
      "Boleh memakai referensi pengetahuan umum/internet jika relevan."
    ].join("\n");
    const userPrompt = query + "\n\nPola tindakan dari logbook (referensi tambahan):\n" + localPatternsText + "\n\nKasus historis (referensi tambahan):\n" + (casesText || "(tidak ada kasus mentah tambahan)");
    const payload = {
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      generationConfig: {
        maxOutputTokens: 2048
        // thinkingConfig SENGAJA dihapus: parameternya berbeda antar generasi
        // model Gemini (2.x pakai thinkingBudget, 3.x pakai thinkingLevel), jadi
        // lebih aman tanpa parameter ini supaya kompatibel dengan model manapun.
      }
    };
    let result = null;
    let usedModel = null;
    const attemptErrors = [];
    for (var i = 0; i < GEMINI_MODELS.length; i++) {
      const modelName = GEMINI_MODELS[i];
      const attempt = await callGeminiModel_(modelName, apiKey, payload);
      if (attempt.success) {
        result = attempt;
        usedModel = modelName;
        break;
      }
      attemptErrors.push(modelName + " -> HTTP " + attempt.httpCode + ": " + attempt.errorText);
    }
    if (!result) {
      const groqResult = await tryGroqFallback_(systemPrompt, userPrompt, attemptErrors);
      if (groqResult) {
        return jsonOut_({
          ok: true,
          data: { summary: groqResult.text.trim(), recommendations: [], structured: false, modelUsed: groqResult.modelUsed }
        });
      }
      return jsonOut_({ ok: false, error: "Semua model Gemini (dan Groq jika dikonfigurasi) gagal dicoba. Detail: " + attemptErrors.join(" | ") });
    }
    const candidate = result.candidate;
    const parts = candidate && candidate.content && candidate.content.parts ? candidate.content.parts : [];
    const rawText = parts.map(function(p) {
      return p.text || "";
    }).join("");
    if (candidate && candidate.finishReason === "MAX_TOKENS") {
      return jsonOut_({ ok: false, error: "Jawaban AI terpotong. Kurangi jumlah kasus historis." });
    }
    return jsonOut_({
      ok: true,
      data: { summary: rawText.trim(), recommendations: [], structured: false, modelUsed: usedModel }
    });
  }
  __name(handleAiAnalyzeFreeform_, "handleAiAnalyzeFreeform_");
  async function handleAiAnalyze_(body) {
    const apiKey = PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY");
    if (!apiKey) return jsonOut_({ ok: false, error: "GEMINI_API_KEY belum diatur di Cloudflare Worker Secrets." });
    if (String(body.mode || "") === "freeform") {
      return await handleAiAnalyzeFreeform_(body, apiKey);
    }
    const query = String(body.query || "").trim();
    const spesifikasi = String(body.spesifikasi || "").trim();
    let cases = Array.isArray(body.cases) ? body.cases.slice(0, 8) : [];
    let localPatterns = Array.isArray(body.localPatterns) ? body.localPatterns.slice(0, 6) : [];
    if (!query) return jsonOut_({ ok: false, error: "Query kosong." });
    const casesText = cases.length ? cases.map(function(c) {
      return "[id:" + (c.id || "-") + "] mesin=" + (c.mesin || "-") + " | unit=" + (c.unit || "-") + " | tanggal=" + (c.tanggal || "-") + " | masalah=" + (c.masalah || "-") + " | tindakan=" + (c.tindakan || "-") + " | material=" + (c.material || "-");
    }).join("\n") : "(tidak ada kasus historis logbook yang cocok untuk query ini)";
    const localPatternsText = localPatterns.length ? localPatterns.map(function(p, i2) {
      return i2 + 1 + '. "' + (p.tindakan || "-") + '" \u2014 sudah terpakai ' + (p.frekuensi || 0) + "x pada kasus serupa";
    }).join("\n") : "(tidak ada pola tindakan yang cukup kuat dari logbook)";
    const specLine = spesifikasi ? 'Spesifikasi / tipe / codename bawaan pabrik dari mesin atau komponen bermasalah: "' + spesifikasi + '".' : "Spesifikasi / tipe / codename mesin tidak diberikan pengguna \u2014 gunakan konteks umum industri percetakan/packaging (mis. offset, APM, IPM, FGM).";
    const systemPrompt = [
      "Anda adalah teknisi ahli maintenance mesin percetakan/packaging (offset printing, APM, IPM, FGM) dengan akses pencarian internet (Google Search).",
      "Tugas Anda: cari dan rangkum SOLUSI/CORRECTIVE ACTION yang paling relevan dari sumber internet (manual pabrikan, forum teknisi, dokumentasi resmi, artikel troubleshooting) untuk masalah yang dijelaskan pengguna.",
      specLine,
      "Konteks tambahan (HANYA sebagai referensi, JANGAN dianggap sebagai sumber internet): riwayat logbook internal berikut sudah dianalisa terpisah oleh sistem lain dan TIDAK PERLU Anda ulang \u2014 fokus jawaban Anda 100% pada riset internet.",
      "Riwayat logbook (konteks saja): \n" + casesText,
      "Pola tindakan logbook (konteks saja): \n" + localPatternsText,
      "",
      "WAJIB: gunakan tool pencarian internet untuk memverifikasi/mencari langkah perbaikan yang akurat dan spesifik terhadap spesifikasi mesin di atas (jika ada), bukan jawaban generik.",
      "Format jawaban Anda HARUS PERSIS seperti berikut (jangan tambah heading/format lain, jangan pakai markdown bold/asterisk):",
      "",
      AI_MARK_RINGKASAN,
      "(1-3 kalimat ringkasan diagnosa kemungkinan akar masalah, berdasarkan hasil pencarian internet)",
      "",
      AI_MARK_LANGKAH,
      "1. (langkah corrective action pertama, jelas & actionable, sebutkan alat/parameter jika relevan)",
      "2. (langkah kedua)",
      "3. (langkah ketiga, dst \u2014 buat sedetail dan seurut mungkin, minimal 3 langkah maksimal 8 langkah)",
      "",
      AI_MARK_CATATAN,
      "(opsional: peringatan keselamatan, sparepart yang perlu disiapkan, atau kapan harus eskalasi ke vendor/pabrikan \u2014 kosongkan jika tidak ada)"
    ].join("\n");
    const userPrompt = 'Masalah yang dilaporkan pengguna:\n"' + query + '"';
    const payload = {
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      tools: [{ googleSearch: {} }],
      generationConfig: {
        maxOutputTokens: 2048
        // thinkingConfig SENGAJA dihapus, lihat catatan di handleAiAnalyzeFreeform_.
      }
    };
    let result = null;
    let usedModel = null;
    const attemptErrors = [];
    for (var i = 0; i < GEMINI_MODELS.length; i++) {
      const modelName = GEMINI_MODELS[i];
      const attempt = await callGeminiModel_(modelName, apiKey, payload);
      if (attempt.success) {
        result = attempt;
        usedModel = modelName;
        break;
      }
      attemptErrors.push(modelName + " -> HTTP " + attempt.httpCode + ": " + attempt.errorText);
    }
    if (!result) {
      const groqResult = await tryGroqFallback_(systemPrompt, userPrompt, attemptErrors);
      if (groqResult) {
        const gClean = groqResult.text.replace(/```[a-z]*\n?/gi, "").replace(/```/g, "").trim();
        const gSummary = extractAiSection_(gClean, AI_MARK_RINGKASAN, [AI_MARK_LANGKAH, AI_MARK_CATATAN]);
        const gLangkahBlock = extractAiSection_(gClean, AI_MARK_LANGKAH, [AI_MARK_CATATAN]);
        const gCatatan = extractAiSection_(gClean, AI_MARK_CATATAN, []);
        const gLangkah = parseAiSteps_(gLangkahBlock);
        const gHasStructured = !!(gSummary || gLangkah.length);
        return jsonOut_({
          ok: true,
          data: {
            summary: gHasStructured ? gSummary : gClean,
            langkahPerbaikan: gLangkah,
            catatan: ((gCatatan ? gCatatan + "\n\n" : "") + "\u26A0\uFE0F Fallback ke " + groqResult.modelUsed + " \u2014 semua model Gemini gagal, hasil ini TANPA pencarian internet real-time.").trim(),
            sumberInternet: [],
            spesifikasi,
            structured: gHasStructured,
            modelUsed: groqResult.modelUsed
          }
        });
      }
      return jsonOut_({ ok: false, error: "Semua model Gemini (dan Groq jika dikonfigurasi) gagal dicoba. Detail: " + attemptErrors.join(" | ") });
    }
    const candidate = result.candidate;
    const parts = candidate && candidate.content && candidate.content.parts ? candidate.content.parts : [];
    const rawText = parts.map(function(p) {
      return p.text || "";
    }).join("");
    if (candidate && candidate.finishReason === "MAX_TOKENS") {
      return jsonOut_({ ok: false, error: "Jawaban AI terpotong. Coba pertanyaan yang lebih singkat." });
    }
    const cleanText = rawText.replace(/```[a-z]*\n?/gi, "").replace(/```/g, "").trim();
    const summary = extractAiSection_(cleanText, AI_MARK_RINGKASAN, [AI_MARK_LANGKAH, AI_MARK_CATATAN]);
    const langkahBlock = extractAiSection_(cleanText, AI_MARK_LANGKAH, [AI_MARK_CATATAN]);
    const catatan = extractAiSection_(cleanText, AI_MARK_CATATAN, []);
    const langkahPerbaikan = parseAiSteps_(langkahBlock);
    const sumberInternet = extractGroundingSources_(candidate);
    const hasStructured = !!(summary || langkahPerbaikan.length);
    return jsonOut_({
      ok: true,
      data: {
        summary: hasStructured ? summary : cleanText,
        langkahPerbaikan,
        catatan,
        sumberInternet,
        spesifikasi,
        structured: hasStructured,
        modelUsed: usedModel
      }
    });
  }
  __name(handleAiAnalyze_, "handleAiAnalyze_");
  function migrateAddNewColumns() {
    getOrCreateSheet_(SHEET_LOGBOOK, LOGBOOK_HEADERS);
    getOrCreateSheet_(SHEET_MESIN, MESIN_HEADERS);
    getOrCreateSheet_(SHEET_PATROL_TEMPLATE, PATROL_TEMPLATE_HEADERS);
    getOrCreateSheet_(SHEET_PERSONIL, PERSONIL_HEADERS);
    getOrCreateSheet_(SHEET_REPORTS, REPORTS_HEADERS);
    getOrCreateSheet_(PREDICTIVE_SHEET_NAME, PREDICTIVE_HEADERS);
    getOrCreateSheet_(IPAL_SHEET_NAME, IPAL_HEADERS);
    getOrCreateSheet_(SHEET_RCA, RCA_HEADERS);
    getOrCreateSheet_(SHEET_DOWNTIME_EM, DOWNTIME_EM_HEADERS);
    getOrCreateSheet_(SHEET_SPAREPART_LOKASI, SPAREPART_LOKASI_HEADERS);
    getOrCreateSheet_(SHEET_SPAREPART_ETA, SPAREPART_ETA_HEADERS);
    getOrCreateSheet_(SHEET_SPAREPART_OPNAME, SPAREPART_OPNAME_HEADERS);
    getOrCreateSheet_(SHEET_SPAREPART_SAP, SPAREPART_SAP_HEADERS);
    getOrCreateSheet_(SHEET_SPAREPART_WAREHOUSE, SPAREPART_WAREHOUSE_HEADERS);
    getOrCreateSheet_(SHEET_KPI_KERJA, KPI_KERJA_HEADERS);
    getOrCreateSheet_(SHEET_MACHINE_BREAKDOWN, MACHINE_BREAKDOWN_HEADERS);
    getOrCreateSheet_(SHEET_CORRECTIVE_REPORT, CORRECTIVE_REPORT_HEADERS);
    getOrCreateSheet_(SHEET_ENERGY_UTILITY, ENERGY_UTILITY_HEADERS);
    getUsersSheet_();
    getPermissionsSheet_();
    getFeaturesSheet_();
    ensureRbacBootstrap_();
    Logger.log("Migrasi selesai.");
  }
  __name(migrateAddNewColumns, "migrateAddNewColumns");
  async function authorizeAiFeature() {
    const apiKey = PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY");
    if (!apiKey) {
      Logger.log("GEMINI_API_KEY belum diatur di Cloudflare Worker Secrets.");
      return;
    }
    const url = "https://generativelanguage.googleapis.com/v1beta/models/" + GEMINI_MODELS[0] + ":generateContent";
    const response = await UrlFetchApp.fetch(url, {
      method: "post",
      contentType: "application/json",
      headers: { "x-goog-api-key": apiKey },
      payload: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: 'Balas dengan kata "OK" saja.' }] }]
      }),
      muteHttpExceptions: true
    });
    Logger.log("Kode status: " + response.getResponseCode());
    Logger.log("Respons: " + response.getContentText().slice(0, 300));
  }
  __name(authorizeAiFeature, "authorizeAiFeature");
  async function authorizeGroqFeature() {
    const apiKey = PropertiesService.getScriptProperties().getProperty("GROQ_API_KEY");
    if (!apiKey) {
      Logger.log("GROQ_API_KEY belum diatur di Cloudflare Worker Secrets.");
      return;
    }
    const available = await getGroqAvailableModels_(apiKey);
    const candidates = rankGroqModels_(available);
    if (!candidates.length) {
      Logger.log("Groq gagal: tidak ada model chat yang tersedia untuk API key ini.");
      Logger.log("Pastikan API key Groq valid dan memiliki akses model.");
      return;
    }
    for (var i = 0; i < candidates.length; i++) {
      const modelName = candidates[i];
      const attempt = await callGroqModel_(modelName, apiKey, "Anda asisten uji coba.", 'Balas dengan kata "OK" saja.');
      if (attempt.success) {
        Logger.log("Groq OK. Model: " + modelName + ". Balasan: " + attempt.text);
        return;
      }
      Logger.log("Groq gagal. Model " + modelName + " -> HTTP " + attempt.httpCode + ": " + attempt.errorText);
    }
  }
  __name(authorizeGroqFeature, "authorizeGroqFeature");
  function getLogbookRowsForSrs_() {
    try {
      return getLogbookList_() || [];
    } catch (err) {
      return [];
    }
  }
  __name(getLogbookRowsForSrs_, "getLogbookRowsForSrs_");
  function getPredictiveRowsForSrs_() {
    try {
      return getPredictiveReports_() || [];
    } catch (err) {
      return [];
    }
  }
  __name(getPredictiveRowsForSrs_, "getPredictiveRowsForSrs_");
  function getGeneralReportRowsForSrs_() {
    try {
      return getGeneralReports_() || [];
    } catch (err) {
      return [];
    }
  }
  __name(getGeneralReportRowsForSrs_, "getGeneralReportRowsForSrs_");
  function getRcaRowsForSrs_() {
    try {
      return getRcaReports_() || [];
    } catch (err) {
      return [];
    }
  }
  __name(getRcaRowsForSrs_, "getRcaRowsForSrs_");
  function normalizeDateValue_(v) {
    if (!v) return null;
    if (v instanceof Date) return v;
    if (typeof v === "number") {
      var dNum = new Date(v);
      if (!isNaN(dNum.getTime())) return dNum;
    }
    var d = new Date(v);
    if (!isNaN(d.getTime())) return d;
    return null;
  }
  __name(normalizeDateValue_, "normalizeDateValue_");
  function dayDiffFromToday_(value) {
    var d = normalizeDateValue_(value);
    if (!d) return null;
    var now = /* @__PURE__ */ new Date();
    var a = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    var b = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    return Math.round((b - a) / 864e5);
  }
  __name(dayDiffFromToday_, "dayDiffFromToday_");
  function isDoneStatus_(status) {
    var s = String(status || "").toLowerCase();
    return ["done", "selesai", "closed", "complete", "completed", "approved", "reject", "rejected"].indexOf(s) !== -1;
  }
  __name(isDoneStatus_, "isDoneStatus_");
  function inferApprovalStatus_(report) {
    var s = String(report && report.status || "").trim();
    if (!s) return "Pending";
    return s;
  }
  __name(inferApprovalStatus_, "inferApprovalStatus_");
  function getMissionSummary_(role) {
    var logs = getLogbookRowsForSrs_();
    var predictive = getPredictiveRowsForSrs_();
    var reports = getGeneralReportRowsForSrs_();
    var openCount = 0, emergencyCount = 0, overdueCount = 0, pendingApproval = 0, sparepartPending = 0;
    var priorities = [];
    logs.forEach(function(r) {
      var status = r["Status"] || r.status || "";
      var prioritas = r["Prioritas"] || r.prioritas || "";
      var tanggal = r["Tanggal"] || r.tanggal || "";
      var spare = r["Status Sparepart"] || r.statusSparepart || "";
      if (!isDoneStatus_(status)) openCount++;
      if (String(prioritas).toLowerCase() === "emergency") emergencyCount++;
      var diff = dayDiffFromToday_(tanggal);
      if (diff !== null && diff < 0 && !isDoneStatus_(status)) overdueCount++;
      if (String(spare).toLowerCase() === "pending") sparepartPending++;
      if (!isDoneStatus_(status) || String(prioritas).toLowerCase() === "emergency") {
        priorities.push({
          source: "logbook",
          id: r["ID"] || r.id || "",
          title: (r["Nama Mesin"] || r.namaMesin || "-") + " - " + (r["Deskripsi Masalah"] || r.deskripsiMasalah || ""),
          status,
          priority: prioritas,
          date: tanggal
        });
      }
    });
    predictive.forEach(function(r) {
      var severity = String(r["Severity"] || r.severity || "").toLowerCase();
      if (severity === "high" || severity === "critical") {
        priorities.push({
          source: "predictive",
          id: r["ID"] || r.id || "",
          title: (r["Nama Mesin"] || r.namaMesin || "-") + " - " + (r["Deskripsi Temuan"] || r.deskripsiTemuan || ""),
          status: "Patrol",
          priority: r["Severity"] || r.severity || "",
          date: r["Tanggal"] || r.tanggal || ""
        });
      }
    });
    reports.forEach(function(r) {
      var st = inferApprovalStatus_(r).toLowerCase();
      if (st.indexOf("pending") !== -1 || st.indexOf("review") !== -1 || st.indexOf("draft") !== -1) pendingApproval++;
    });
    priorities.sort(function(a, b) {
      var ap = String(a.priority || "").toLowerCase();
      var bp = String(b.priority || "").toLowerCase();
      if (ap === "emergency" && bp !== "emergency") return -1;
      if (bp === "emergency" && ap !== "emergency") return 1;
      return 0;
    });
    return {
      role: role || "",
      kpi: {
        openTasks: openCount,
        emergency: emergencyCount,
        overdue: overdueCount,
        pendingApproval,
        sparepartPending
      },
      priorities: priorities.slice(0, 10)
    };
  }
  __name(getMissionSummary_, "getMissionSummary_");
  function getNotifications_(role) {
    var items = [];
    getLogbookRowsForSrs_().forEach(function(r) {
      var status = r["Status"] || "";
      var prioritas = r["Prioritas"] || "";
      var tanggal = r["Tanggal"] || "";
      var diff = dayDiffFromToday_(tanggal);
      if (diff !== null && diff < 0 && !isDoneStatus_(status)) {
        items.push({
          type: "overdue",
          severity: "high",
          id: r["ID"] || "",
          title: "Pekerjaan overdue: " + (r["Nama Mesin"] || "-"),
          message: r["Deskripsi Masalah"] || "",
          status,
          date: tanggal
        });
      }
      if (String(prioritas).toLowerCase() === "emergency") {
        items.push({
          type: "emergency",
          severity: "critical",
          id: r["ID"] || "",
          title: "Emergency: " + (r["Nama Mesin"] || "-"),
          message: r["Deskripsi Masalah"] || "",
          status,
          date: tanggal
        });
      }
      if (String(r["Status Sparepart"] || "").toLowerCase() === "pending") {
        items.push({
          type: "sparepart",
          severity: "medium",
          id: r["ID"] || "",
          title: "Sparepart pending: " + (r["Nama Material"] || r["Spare Part Digunakan"] || "-"),
          message: "Material SAP: " + (r["Material Number SAP"] || "-"),
          status,
          date: tanggal
        });
      }
    });
    getGeneralReportRowsForSrs_().forEach(function(r) {
      var st = inferApprovalStatus_(r).toLowerCase();
      if (st.indexOf("pending") !== -1 || st.indexOf("review") !== -1 || st.indexOf("draft") !== -1) {
        items.push({
          type: "approval",
          severity: "medium",
          id: r.id || "",
          title: "Approval pending: " + (r.title || "-"),
          message: r.subtitle || r.summary || "",
          status: r.status || "",
          date: r.tanggalMulai || r.ts || ""
        });
      }
    });
    return items.slice(0, 100);
  }
  __name(getNotifications_, "getNotifications_");
  function getApprovals_(role) {
    return getGeneralReportRowsForSrs_().filter(function(r) {
      var st = inferApprovalStatus_(r).toLowerCase();
      return st.indexOf("pending") !== -1 || st.indexOf("review") !== -1 || st.indexOf("draft") !== -1;
    }).map(function(r) {
      return {
        id: r.id,
        title: r.title,
        subtitle: r.subtitle,
        author: r.author,
        category: r.category,
        status: r.status,
        progress: r.progress,
        summary: r.summary,
        pdfUrl: r.pdfUrl || "",
        revision: r.revision || ""
      };
    });
  }
  __name(getApprovals_, "getApprovals_");
  function getOverdueEntries_() {
    return getLogbookRowsForSrs_().filter(function(r) {
      var diff = dayDiffFromToday_(r["Tanggal"] || "");
      return diff !== null && diff < 0 && !isDoneStatus_(r["Status"] || "");
    }).map(function(r) {
      return {
        id: r["ID"] || "",
        tanggal: r["Tanggal"] || "",
        mesin: r["Nama Mesin"] || "",
        area: r["Lokasi/Area"] || "",
        pelapor: r["Nama Pelapor"] || "",
        status: r["Status"] || "",
        prioritas: r["Prioritas"] || "",
        deskripsi: r["Deskripsi Masalah"] || ""
      };
    });
  }
  __name(getOverdueEntries_, "getOverdueEntries_");
  function getKnowledgeList_(q) {
    q = String(q || "").toLowerCase().trim();
    var out = [];
    getGeneralReportRowsForSrs_().forEach(function(r) {
      out.push({
        source: "generalReport",
        id: r.id,
        title: r.title || "",
        subtitle: r.subtitle || "",
        category: r.category || "",
        status: r.status || "",
        summary: r.summary || "",
        url: r.pdfUrl || ""
      });
    });
    getPredictiveRowsForSrs_().forEach(function(r) {
      out.push({
        source: "predictiveReport",
        id: r["ID"] || "",
        title: (r["Nama Mesin"] || "") + " - " + (r["Titik Inspeksi"] || ""),
        subtitle: r["Tanggal"] || "",
        category: "Predictive",
        status: r["Severity"] || "",
        summary: r["Deskripsi Temuan"] || "",
        url: ""
      });
    });
    getRcaRowsForSrs_().forEach(function(r) {
      out.push({
        source: "rcaReport",
        id: r.id || "",
        title: r.title || "",
        subtitle: r.machineName || "",
        category: "RCA",
        status: "",
        summary: r.sections || "",
        url: ""
      });
    });
    if (!q) return out.slice(0, 200);
    return out.filter(function(x) {
      var blob = [x.id, x.title, x.subtitle, x.category, x.status, x.summary].join(" ").toLowerCase();
      return blob.indexOf(q) !== -1;
    }).slice(0, 200);
  }
  __name(getKnowledgeList_, "getKnowledgeList_");
  function getPeopleSummary_(q) {
    q = String(q || "").toLowerCase().trim();
    var personil = getGenericRows_(SHEET_PERSONIL, PERSONIL_HEADERS);
    var logs = getLogbookRowsForSrs_();
    var patrol = getPredictiveRowsForSrs_();
    var map = {};
    personil.forEach(function(p) {
      var name = p["Nama Personil"] || "";
      if (!name) return;
      map[name] = {
        name,
        team: p["Grouping Team"] || "",
        logbookCount: 0,
        patrolCount: 0,
        lastActivity: ""
      };
    });
    logs.forEach(function(r) {
      var name = r["Nama Pelapor"] || "";
      if (!name) return;
      if (!map[name]) map[name] = { name, team: r["Grouping Team"] || "", logbookCount: 0, patrolCount: 0, lastActivity: "" };
      map[name].logbookCount++;
      var t = r["Timestamp Input"] || r["Tanggal"] || "";
      if (String(t) > String(map[name].lastActivity || "")) map[name].lastActivity = t;
    });
    patrol.forEach(function(r) {
      var name = r["Petugas"] || "";
      if (!name) return;
      if (!map[name]) map[name] = { name, team: "", logbookCount: 0, patrolCount: 0, lastActivity: "" };
      map[name].patrolCount++;
      var t = r["Timestamp"] || r["Tanggal"] || "";
      if (String(t) > String(map[name].lastActivity || "")) map[name].lastActivity = t;
    });
    var out = Object.keys(map).map(function(k) {
      return map[k];
    });
    if (!q) return out.slice(0, 200);
    return out.filter(function(x) {
      return (String(x.name || "") + " " + String(x.team || "")).toLowerCase().indexOf(q) !== -1;
    }).slice(0, 200);
  }
  __name(getPeopleSummary_, "getPeopleSummary_");
  function globalSearch_(q) {
    q = String(q || "").toLowerCase().trim();
    if (!q) return [];
    var out = [];
    getLogbookRowsForSrs_().forEach(function(r) {
      var blob = [
        r["ID"],
        r["Kode Mesin"],
        r["Nama Mesin"],
        r["Lokasi/Area"],
        r["Deskripsi Masalah"],
        r["Nama Material"],
        r["Material Number SAP"],
        r["Nama Pelapor"],
        r["Shift"],
        r["Prioritas"],
        r["Status"]
      ].join(" ").toLowerCase();
      if (blob.indexOf(q) !== -1) {
        out.push({
          source: "logbook",
          id: r["ID"] || "",
          title: (r["Nama Mesin"] || "-") + " - " + (r["Deskripsi Masalah"] || ""),
          subtitle: [r["Lokasi/Area"] || "", r["Status"] || "", r["Prioritas"] || ""].join(" | ")
        });
      }
    });
    getKnowledgeList_(q).forEach(function(r) {
      out.push({
        source: r.source,
        id: r.id,
        title: r.title,
        subtitle: [r.subtitle || "", r.category || "", r.status || ""].join(" | ")
      });
    });
    getPeopleSummary_(q).forEach(function(p) {
      out.push({
        source: "people",
        id: p.name,
        title: p.name,
        subtitle: [p.team || "", "Logbook: " + p.logbookCount, "Patrol: " + p.patrolCount].join(" | ")
      });
    });
    return out.slice(0, 200);
  }
  __name(globalSearch_, "globalSearch_");
  function updateApprovalDecision_(body) {
    body = body || {};
    var id = body.id || "";
    var decision = String(body.decision || "").trim();
    if (!id) return jsonOut_({ ok: false, error: "id wajib diisi" });
    if (!decision) return jsonOut_({ ok: false, error: "decision wajib diisi" });
    var sh = getOrCreateSheet_(SHEET_REPORTS, REPORTS_HEADERS);
    var data = sh.getDataRange().getValues();
    var headers = data[0];
    var idCol = headers.indexOf("ID");
    var statusCol = headers.indexOf("Status");
    var contentCol = headers.indexOf("Content");
    if (idCol === -1 || statusCol === -1) return jsonOut_({ ok: false, error: "Kolom report tidak lengkap" });
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][idCol]) === String(id)) {
        sh.getRange(i + 1, statusCol + 1).setValue(decision);
        if (contentCol !== -1 && body.note) {
          var prev = data[i][contentCol] || "";
          var stamp = Utilities.formatDate(/* @__PURE__ */ new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm");
          sh.getRange(i + 1, contentCol + 1).setValue(String(prev) + "\n\n[Approval " + decision + " @ " + stamp + "] " + body.note);
        }
        return jsonOut_({ ok: true, id, decision });
      }
    }
    return jsonOut_({ ok: false, error: "Report tidak ditemukan: " + id });
  }
  __name(updateApprovalDecision_, "updateApprovalDecision_");
  function getPiHardSkillStandard_() {
    return getGenericRows_(SHEET_PI_HARDSKILL_STANDARD, PI_HARDSKILL_STANDARD_HEADERS).map(function(r) {
      return { posisi: r["Posisi"], kode: r["Kode Unit"], unit: r["Unit Kompetensi"], group: r["Group"] };
    });
  }
  __name(getPiHardSkillStandard_, "getPiHardSkillStandard_");
  function getPiHardSkillAssessments_() {
    const heads = getGenericRows_(SHEET_PI_HARDSKILL, PI_HARDSKILL_HEADERS);
    const details = getGenericRows_(SHEET_PI_HARDSKILL_DETAIL, PI_HARDSKILL_DETAIL_HEADERS);
    return heads.map(function(h) {
      const id = h["ID"];
      return {
        id,
        timestamp: h["Timestamp"],
        nama: h["Nama"],
        posisi: h["Posisi"],
        tahun: Number(h["Tahun"] || 0),
        assessor: h["Assessor"],
        sumber: h["Sumber"],
        kompeten: Number(h["Kompeten"] || 0),
        belumKompeten: Number(h["Belum Kompeten"] || 0),
        penjelasanBelumKompeten: h["Penjelasan Belum Kompeten"] || "",
        selfLearning: h["Self Learning"] || "",
        mentoring: h["Mentoring"] || "",
        coaching: h["Coaching"] || "",
        // Unit kompetensi hard skill (No Kompetensi, SKKNI, Kode Unit, Unit
        // Kompetensi, Elemen Unit, Kriteria Unjuk Kerja, Pendukung Bukti) +
        // penilaian manual direct manager per baris.
        items: details.filter(function(d) {
          return String(d["Assessment ID"]) === String(id);
        }).map(function(d) {
          return {
            noKompetensi: d["No Kompetensi"] || "",
            skkni: d["SKKNI"] || "",
            kodeUnit: d["Kode Unit"] || "",
            unitKompetensi: d["Unit Kompetensi"] || "",
            elemenUnit: d["Elemen Unit"] || "",
            kriteriaUnjukKerja: d["Kriteria Unjuk Kerja"] || "",
            pendukungBukti: d["Pendukung Bukti"] || "",
            statusManager: d["Status Manager"] || "",
            penjelasanBelumKompeten: d["Penjelasan Belum Kompeten"] || ""
          };
        })
      };
    });
  }
  __name(getPiHardSkillAssessments_, "getPiHardSkillAssessments_");
  function savePiHardskill_(assessment) {
    var requestBody = assessment || {};
    assessment = requestBody.assessment || requestBody.data || requestBody;
    const shHead = getOrCreateSheet_(SHEET_PI_HARDSKILL, PI_HARDSKILL_HEADERS);
    const shDet = getOrCreateSheet_(SHEET_PI_HARDSKILL_DETAIL, PI_HARDSKILL_DETAIL_HEADERS);
    if (!assessment.nama) return jsonOut_({ ok: false, error: "Nama wajib diisi." });
    const id = Utilities.getUuid();
    const items = assessment.items || [];
    var kompeten = 0, belum = 0;
    items.forEach(function(it) {
      if (String(it.statusManager || "").toLowerCase().indexOf("belum") !== -1) belum++;
      else if (String(it.statusManager || "").toLowerCase() === "kompeten") kompeten++;
    });
    appendCanonical_(shHead, PI_HARDSKILL_HEADERS, [
      id,
      nowIso_(),
      assessment.nama || "",
      assessment.posisi || "",
      assessment.tahun || "",
      assessment.assessor || "",
      "manual",
      kompeten,
      belum,
      assessment.penjelasanBelumKompeten || "",
      assessment.selfLearning || "",
      assessment.mentoring || "",
      assessment.coaching || "",
      requestBody.transactionId || ""
    ]);
    if (items.length) {
      const rows = items.map(function(it) {
        return [
          id,
          assessment.nama || "",
          assessment.posisi || "",
          assessment.tahun || "",
          it.noKompetensi || "",
          it.skkni || "",
          it.kodeUnit || "",
          it.unitKompetensi || "",
          it.elemenUnit || "",
          it.kriteriaUnjukKerja || "",
          it.pendukungBukti || "",
          it.statusManager || "",
          it.penjelasanBelumKompeten || ""
        ];
      });
      rows.forEach(function(row) {
        appendCanonical_(shDet, PI_HARDSKILL_DETAIL_HEADERS, row);
      });
    }
    return jsonOut_({ ok: true, id });
  }
  __name(savePiHardskill_, "savePiHardskill_");
  function addEntry_(body) {
    try {
      var data = body.entry || body.data || body;
      if (!data || typeof data !== "object") throw { code: "VALIDATION_ERROR", message: "Data kosong" };
      if (!String(data.lokasi || data["Lokasi/Area"] || "").trim()) {
        try {
          var machineSheet = getOrCreateSheet_(SHEET_MESIN, MESIN_HEADERS);
          var machineFound = findMachineRow_(machineSheet, data.kodeMesin || data["Kode Mesin"] || "");
          if (!machineFound && (data.namaMesin || data["Nama Mesin"])) machineFound = findMachineRow_(machineSheet, data.namaMesin || data["Nama Mesin"]);
          if (machineFound) {
            var locationCol = machineFound.headers.indexOf("Lokasi/Area");
            if (locationCol !== -1) data.lokasi = String(machineFound.row[locationCol] || "").trim();
          }
        } catch (machineLocationErr) {
        }
      }
      var missing = REQUIRED_ENTRY_FIELDS.filter(function(f) {
        return !data[f] || String(data[f]).trim() === "";
      });
      if (missing.length) throw { code: "VALIDATION_ERROR", message: "Field wajib belum diisi: " + missing.join(", ") };
      var usesSparepart = !!String(data.namaMaterial || data.materialNumberSAP || "").trim();
      var sh = getOrCreateSheet_(SHEET_LOGBOOK, LOGBOOK_HEADERS);
      try {
        ensureHeaderColumns_(sh, ["Personil Tambahan", "Semua Personil", "Is Preventive"]);
      } catch (e) {
      }
      try {
        ensureHeaderColumns_(sh, ["TransactionID", "CreatedBy", "DeletedAt", "DeletedBy", "DeleteReason"]);
      } catch (e) {
      }
      var id = data.ID || data.id || "LB-" + Utilities.getUuid();
      var txId = body.transactionId || body.clientTransactionId || "OMD-" + Utilities.formatDate(/* @__PURE__ */ new Date(), Session.getScriptTimeZone(), "yyyyMMdd") + "-" + Utilities.getUuid().substring(0, 8);
      var existingTx = getTransactionResult_(txId);
      if (existingTx) return jsonOut_(existingTx);
      var attachments = [];
      if (Array.isArray(body.files)) {
        var folder = getOrCreateDriveFolder_();
        body.files.forEach(function(f) {
          var up = uploadBase64File_(folder, f, f.name || "lampiran", f.mimeType || "application/octet-stream");
          attachments.push(up);
        });
      }
      var rowMap = {};
      var headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
      rowMap["ID"] = id;
      rowMap["Timestamp"] = nowIso_();
      rowMap["Timestamp Input"] = /* @__PURE__ */ new Date();
      rowMap["Tanggal"] = data.tanggal || "";
      rowMap["Waktu"] = data.waktu || Utilities.formatDate(/* @__PURE__ */ new Date(), Session.getScriptTimeZone(), "HH:mm");
      rowMap["Kode Mesin"] = data.kodeMesin || data["Kode Mesin"] || "";
      rowMap["Nama Mesin"] = data.namaMesin || data["Nama Mesin"] || "";
      rowMap["Lokasi/Area"] = data.lokasi || data["Lokasi/Area"] || "";
      rowMap["Jenis Pekerjaan"] = data.jenisPekerjaan || "";
      rowMap["Is Preventive"] = data.isPreventive ? "TRUE" : String(data.jenisPekerjaan || "").toLowerCase().indexOf("preventive") !== -1 ? "TRUE" : "FALSE";
      rowMap["Deskripsi Masalah"] = data.deskripsiMasalah || data.deskripsi || data["Deskripsi Masalah"] || "";
      rowMap["Tindakan Perbaikan"] = data.tindakanPerbaikan || "";
      rowMap["Spare Part Digunakan"] = data.sparePart || "";
      rowMap["Nama Material"] = data.namaMaterial || data["Nama Material"] || "";
      rowMap["Material Number SAP"] = data.materialNumberSAP || data.materialNumber || data["Material Number SAP"] || "";
      rowMap["Nama Pelapor"] = data.namaPelapor || data.pelapor || data["Nama Pelapor"] || body.actor || "";
      var tambahanArr = data.personilTambahan || [];
      if (typeof tambahanArr === "string") tambahanArr = tambahanArr.split(",").map(function(s) {
        return s.trim();
      }).filter(Boolean);
      rowMap["Personil Tambahan"] = data.personilTambahanStr || tambahanArr.join(", ") || "";
      rowMap["Semua Personil"] = data.semuaPersonil || [rowMap["Nama Pelapor"]].concat(tambahanArr).filter(Boolean).join(", ");
      rowMap["Shift"] = data.shift || data["Shift"] || "";
      rowMap["Prioritas"] = data.prioritas || data["Prioritas"] || "";
      rowMap["Status"] = data.status || data["Status"] || "Proses";
      rowMap["Jam Mulai"] = data.jamMulai || "";
      rowMap["Jam Selesai"] = data.jamSelesai || "";
      rowMap["Downtime (menit)"] = data.downtime !== void 0 ? data.downtime : "";
      rowMap["Lampiran (JSON)"] = JSON.stringify(attachments);
      rowMap["Catatan Tambahan"] = data.catatan || "";
      rowMap["Grouping Pekerjaan"] = data.groupingPekerjaan || "";
      rowMap["Grouping Team"] = data.groupingTeam || "";
      rowMap["Nomor Notifikasi Pekerjaan"] = data.nomorNotifikasi || "";
      rowMap["Nama Unit"] = data.namaUnit || "";
      rowMap["Status Sparepart"] = usesSparepart ? "PENDING" : "";
      rowMap["TransactionID"] = txId;
      rowMap["CreatedBy"] = body.actor || "";
      rowMap["UpdatedAt"] = nowIso_();
      var rowArr = headers.map(function(h) {
        return rowMap[h] !== void 0 ? rowMap[h] : "";
      });
      sh.appendRow(rowArr);
      invalidateCacheForSheet_(SHEET_LOGBOOK);
      var res = { ok: true, id, transactionId: txId, attachments };
      return jsonOut_(res);
    } catch (e) {
      return handleError_(e);
    }
  }
  __name(addEntry_, "addEntry_");
  function updateEntry_(body) {
    try {
      var data = body.entry || body.data || body;
      var id = data.ID || data.id || body.id;
      if (!id) throw { code: "VALIDATION_ERROR", message: "ID wajib diisi untuk update" };
      var sh = getSS_().getSheetByName(SHEET_LOGBOOK);
      if (!sh) throw { code: "NOT_FOUND", message: "Sheet Logbook tidak ada" };
      ensureHeaderColumns_(sh, ["UpdatedAt", "UpdatedBy"]);
      var headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
      var values = sh.getDataRange().getValues();
      var idCol = headers.indexOf("ID");
      var targetRow = -1;
      for (var i = 1; i < values.length; i++) {
        if (String(values[i][idCol]) === String(id)) {
          targetRow = i + 1;
          break;
        }
      }
      if (targetRow === -1) throw { code: "NOT_FOUND", message: "Entri Logbook dengan ID " + id + " tidak ditemukan" };
      var missing = REQUIRED_ENTRY_FIELDS.filter(function(f) {
        return !data[f] || String(data[f]).trim() === "";
      });
      if (missing.length) throw { code: "VALIDATION_ERROR", message: "Field wajib belum diisi: " + missing.join(", ") };
      var existingRow = values[targetRow - 1];
      var getExisting = /* @__PURE__ */ __name(function(h) {
        var c = headers.indexOf(h);
        return c === -1 ? "" : existingRow[c];
      }, "getExisting");
      var usesSparepart = !!String(data.namaMaterial || data.materialNumberSAP || "").trim();
      var tambahanArr = data.personilTambahan || [];
      if (typeof tambahanArr === "string") tambahanArr = tambahanArr.split(",").map(function(s) {
        return s.trim();
      }).filter(Boolean);
      var namaPelapor = data.namaPelapor || data.pelapor || data["Nama Pelapor"] || getExisting("Nama Pelapor");
      var rowMap = {};
      rowMap["ID"] = id;
      rowMap["Tanggal"] = data.tanggal || getExisting("Tanggal");
      rowMap["Waktu"] = data.waktu || getExisting("Waktu");
      rowMap["Kode Mesin"] = data.kodeMesin || data["Kode Mesin"] || getExisting("Kode Mesin");
      rowMap["Nama Mesin"] = data.namaMesin || data["Nama Mesin"] || getExisting("Nama Mesin");
      rowMap["Lokasi/Area"] = data.lokasi || data["Lokasi/Area"] || getExisting("Lokasi/Area");
      rowMap["Jenis Pekerjaan"] = data.jenisPekerjaan || getExisting("Jenis Pekerjaan");
      rowMap["Deskripsi Masalah"] = data.deskripsiMasalah || data.deskripsi || data["Deskripsi Masalah"] || getExisting("Deskripsi Masalah");
      rowMap["Tindakan Perbaikan"] = data.tindakanPerbaikan !== void 0 ? data.tindakanPerbaikan : getExisting("Tindakan Perbaikan");
      rowMap["Spare Part Digunakan"] = data.sparePart !== void 0 ? data.sparePart : getExisting("Spare Part Digunakan");
      rowMap["Nama Material"] = data.namaMaterial || data["Nama Material"] || getExisting("Nama Material");
      rowMap["Material Number SAP"] = data.materialNumberSAP || data.materialNumber || data["Material Number SAP"] || getExisting("Material Number SAP");
      rowMap["Nama Pelapor"] = namaPelapor;
      rowMap["Personil Tambahan"] = data.personilTambahanStr || (tambahanArr.length ? tambahanArr.join(", ") : void 0) || getExisting("Personil Tambahan");
      rowMap["Semua Personil"] = data.semuaPersonil || [namaPelapor].concat(tambahanArr).filter(Boolean).join(", ") || getExisting("Semua Personil");
      rowMap["Shift"] = data.shift || data["Shift"] || getExisting("Shift");
      rowMap["Prioritas"] = data.prioritas || data["Prioritas"] || getExisting("Prioritas");
      rowMap["Status"] = data.status || data["Status"] || getExisting("Status");
      rowMap["Jam Mulai"] = data.jamMulai !== void 0 ? data.jamMulai : getExisting("Jam Mulai");
      rowMap["Jam Selesai"] = data.jamSelesai !== void 0 ? data.jamSelesai : getExisting("Jam Selesai");
      rowMap["Downtime (menit)"] = data.downtime !== void 0 ? data.downtime : getExisting("Downtime (menit)");
      rowMap["Catatan Tambahan"] = data.catatan !== void 0 ? data.catatan : getExisting("Catatan Tambahan");
      rowMap["Grouping Pekerjaan"] = data.groupingPekerjaan || getExisting("Grouping Pekerjaan");
      rowMap["Grouping Team"] = data.groupingTeam || getExisting("Grouping Team");
      rowMap["Nomor Notifikasi Pekerjaan"] = data.nomorNotifikasi !== void 0 ? data.nomorNotifikasi : getExisting("Nomor Notifikasi Pekerjaan");
      rowMap["Nama Unit"] = data.namaUnit !== void 0 ? data.namaUnit : getExisting("Nama Unit");
      rowMap["Status Sparepart"] = usesSparepart ? getExisting("Status Sparepart") || "PENDING" : getExisting("Status Sparepart");
      rowMap["UpdatedAt"] = nowIso_();
      rowMap["UpdatedBy"] = body.actor || "";
      var newRow = headers.map(function(h) {
        return rowMap.hasOwnProperty(h) ? rowMap[h] : existingRow[headers.indexOf(h)];
      });
      sh.getRange(targetRow, 1, 1, newRow.length).setValues([newRow]);
      invalidateCacheForSheet_(SHEET_LOGBOOK);
      return jsonOut_({ ok: true, id });
    } catch (e) {
      return handleError_(e);
    }
  }
  __name(updateEntry_, "updateEntry_");
  function deleteEntry_(body) {
    try {
      var id = body.id || body.ID;
      if (!id) throw { code: "VALIDATION_ERROR", message: "ID wajib" };
      var sh = getSS_().getSheetByName(SHEET_LOGBOOK);
      if (!sh) throw { code: "NOT_FOUND", message: "Sheet Logbook tidak ada" };
      var lastCol = sh.getLastColumn();
      var headers = sh.getRange(1, 1, 1, lastCol).getValues()[0];
      ensureHeaderColumns_(sh, ["DeletedAt", "DeletedBy", "DeleteReason", "TransactionID"]);
      headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
      var idCol = headers.indexOf("ID");
      var delAtCol = headers.indexOf("DeletedAt");
      var delByCol = headers.indexOf("DeletedBy");
      var txCol = headers.indexOf("TransactionID");
      var values = sh.getDataRange().getValues();
      for (var i = 1; i < values.length; i++) {
        if (String(values[i][idCol]) === String(id)) {
          var before = rowToObj_(headers, values[i]);
          if (delAtCol !== -1) sh.getRange(i + 1, delAtCol + 1).setValue(nowIso_());
          if (delByCol !== -1) sh.getRange(i + 1, delByCol + 1).setValue(body.actor || "");
          if (txCol !== -1 && body.transactionId) sh.getRange(i + 1, txCol + 1).setValue(body.transactionId);
          var delUpdAtCol = headers.indexOf("UpdatedAt");
          if (delUpdAtCol !== -1) sh.getRange(i + 1, delUpdAtCol + 1).setValue(nowIso_());
          invalidateCacheForSheet_(SHEET_LOGBOOK);
          var res = { ok: true, id, softDeleted: true, transactionId: body.transactionId || "" };
          return jsonOut_(res);
        }
      }
      throw { code: "NOT_FOUND", message: "ID tidak ditemukan: " + id };
    } catch (e) {
      return handleError_(e);
    }
  }
  __name(deleteEntry_, "deleteEntry_");
  const RATE_LIMIT_CONFIG = {
    "login": { max: 5, windowSec: 300 },
    // 5 attempts per 5 min
    "addEntry": { max: 60, windowSec: 60 },
    "updateEntry": { max: 60, windowSec: 60 },
    "v4.aiAsk": { max: 20, windowSec: 60 },
    "v4.createWarRoom": { max: 20, windowSec: 60 },
    "v4.updateWarRoom": { max: 60, windowSec: 60 },
    "v4.saveScenario": { max: 20, windowSec: 60 },
    "default": { max: 100, windowSec: 60 }
  };
  function checkRateLimit_(action, actor) {
    try {
      var cache = getCache_();
      if (!cache) return;
      var cfg = RATE_LIMIT_CONFIG[action] || RATE_LIMIT_CONFIG["default"];
      var key = "rl_" + action + "_" + (actor || "anon");
      var current = cache.get(key);
      var count = current ? parseInt(current, 10) : 0;
      count++;
      if (count > cfg.max) {
        throw { code: "RATE_LIMITED", message: "Terlalu banyak request untuk " + action + ". Coba lagi dalam " + cfg.windowSec + " detik." };
      }
      cache.put(key, String(count), cfg.windowSec);
    } catch (e) {
      if (e.code === "RATE_LIMITED") throw e;
    }
  }
  __name(checkRateLimit_, "checkRateLimit_");
  function getHealthMetrics_() {
    var ss = getSS_();
    var sheets = ss.getSheets().map(function(s) {
      return { name: s.getName(), rows: s.getLastRow(), cols: s.getLastColumn() };
    });
    var cache = getCache_();
    var txSheet = ss.getSheetByName(TX_LOG_SHEET);
    var auditSheet = ss.getSheetByName(AUDIT_LOG_SHEET);
    var pendingTx = 0;
    if (txSheet) {
      var data = txSheet.getDataRange().getValues();
      for (var i = 1; i < data.length; i++) {
        if (String(data[i][5]) === "failed" || String(data[i][5]) === "pending") pendingTx++;
      }
    }
    return {
      version: ENTERPRISE_VERSION,
      rbacGithubBuild: RBAC_GITHUB_BUILD,
      timestamp: nowIso_(),
      sotCutoff: SOT_CUTOFF_DATE,
      sheets,
      totalSheets: sheets.length,
      transactionLog: txSheet ? txSheet.getLastRow() - 1 : 0,
      auditLog: auditSheet ? auditSheet.getLastRow() - 1 : 0,
      pendingTransactions: pendingTx,
      cacheAvailable: !!cache,
      sessionTTL: SESSION_TTL_HOURS
    };
  }
  __name(getHealthMetrics_, "getHealthMetrics_");
  function handleHealthCheck_(params, session) {
    var metrics = getHealthMetrics_();
    return jsonOut_({ ok: true, data: metrics });
  }
  __name(handleHealthCheck_, "handleHealthCheck_");
  function handleGetAuditLog_(params, session) {
    requirePermission_(session.role, "rbac.manage");
    params = params || {};
    var limit = Math.max(1, Math.min(parseInt(params.limit || "200", 10) || 200, 500));
    var offset = Math.max(0, parseInt(params.offset || "0", 10) || 0);
    var actorFilter = String(params.actorFilter || params.user || "").trim().toLowerCase();
    var actionFilter = String(params.actionFilter || "").trim().toLowerCase();
    var resultFilter = String(params.resultFilter || "").trim().toLowerCase();
    var q = String(params.q || "").trim().toLowerCase();
    var fromTs = params.from ? Date.parse(params.from) : NaN;
    var toTs = params.to ? Date.parse(params.to) : NaN;
    var sh = getSS_().getSheetByName(AUDIT_LOG_SHEET);
    if (!sh) return jsonOut_({ ok: true, data: [] });
    var values = sh.getDataRange().getValues();
    if (values.length < 2) return jsonOut_({ ok: true, data: [] });
    var headers = values[0], matched = 0, out = [];
    for (var i = values.length - 1; i >= 1; i--) {
      var row = rowToObj_(headers, values[i]);
      var actor = String(row.Actor || "").toLowerCase();
      var action = String(row.Action || "").toLowerCase();
      var result = String(row.Result || "").toLowerCase();
      var ts = Date.parse(row.Timestamp || "");
      if (actorFilter && actor !== actorFilter) continue;
      if (actionFilter && action !== actionFilter) continue;
      if (resultFilter && result.indexOf(resultFilter) === -1) continue;
      if (Number.isFinite(fromTs) && (!Number.isFinite(ts) || ts < fromTs)) continue;
      if (Number.isFinite(toTs) && (!Number.isFinite(ts) || ts > toTs)) continue;
      if (q) {
        var hay = [row.Actor, row.Role, row.Action, row.Entity, row.EntityID, row.Result, row.BeforeJSON, row.AfterJSON].join(" ").toLowerCase();
        if (hay.indexOf(q) === -1) continue;
      }
      if (matched++ < offset) continue;
      out.push(row);
      if (out.length >= limit) break;
    }
    return jsonOut_({ ok: true, data: out });
  }
  __name(handleGetAuditLog_, "handleGetAuditLog_");
  function handleGetTransactionLog_(params, session) {
    requirePermission_(session.role, "rbac.manage");
    var limit = parseInt(params.limit || "100", 10);
    if (limit > 500) limit = 500;
    var sh = getSS_().getSheetByName(TX_LOG_SHEET);
    if (!sh) return jsonOut_({ ok: true, data: [] });
    var values = sh.getDataRange().getValues();
    var headers = values[0];
    var out = [];
    for (var i = Math.max(1, values.length - limit); i < values.length; i++) {
      out.push(rowToObj_(headers, values[i]));
    }
    out.reverse();
    return jsonOut_({ ok: true, data: out });
  }
  __name(handleGetTransactionLog_, "handleGetTransactionLog_");
  function filterBySotCutoff_(rows, dateField, includePreLaunch) {
    if (includePreLaunch) return rows;
    var cutoff = new Date(SOT_CUTOFF_DATE);
    return rows.filter(function(r) {
      try {
        var d = new Date(r[dateField] || r["Timestamp"] || r["Tanggal"] || "");
        if (isNaN(d.getTime())) return true;
        return d >= cutoff;
      } catch (e) {
        return true;
      }
    });
  }
  __name(filterBySotCutoff_, "filterBySotCutoff_");
  function softDeleteById_(sheetName, id, actor, reason) {
    var sh = getSS_().getSheetByName(sheetName);
    if (!sh) throw { code: "NOT_FOUND", message: "Sheet " + sheetName + " tidak ada" };
    ensureHeaderColumns_(sh, ["DeletedAt", "DeletedBy", "DeleteReason", "TransactionID"]);
    var headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
    var idCol = headers.indexOf("ID");
    if (idCol === -1) idCol = headers.indexOf("Id");
    if (idCol === -1) throw { code: "NOT_FOUND", message: "Kolom ID tidak ada di " + sheetName };
    var delAtCol = headers.indexOf("DeletedAt");
    var delByCol = headers.indexOf("DeletedBy");
    var delReasonCol = headers.indexOf("DeleteReason");
    var values = sh.getDataRange().getValues();
    for (var i = 1; i < values.length; i++) {
      if (String(values[i][idCol]) === String(id)) {
        var before = rowToObj_(headers, values[i]);
        if (delAtCol !== -1) sh.getRange(i + 1, delAtCol + 1).setValue(nowIso_());
        if (delByCol !== -1) sh.getRange(i + 1, delByCol + 1).setValue(actor || "");
        if (delReasonCol !== -1) sh.getRange(i + 1, delReasonCol + 1).setValue(reason || "");
        invalidateCacheForSheet_(sheetName);
        writeAuditLog_(actor || "", "", "softDelete", sheetName, id, before, null, "", "soft_deleted");
        return { ok: true, id, softDeleted: true };
      }
    }
    throw { code: "NOT_FOUND", message: "ID tidak ditemukan di " + sheetName };
  }
  __name(softDeleteById_, "softDeleteById_");
  function createBackupMeta_() {
    var ss = getSS_();
    var sheets = ss.getSheets();
    var meta = {
      timestamp: nowIso_(),
      version: ENTERPRISE_VERSION,
      sheets: sheets.map(function(s) {
        return { name: s.getName(), rows: s.getLastRow() };
      })
    };
    var sh = getOrCreateSheet_("Backup_Meta", ["Timestamp", "Version", "SheetCount", "MetaJSON"]);
    sh.appendRow([meta.timestamp, meta.version, meta.sheets.length, JSON.stringify(meta).substring(0, 1e4)]);
    return meta;
  }
  __name(createBackupMeta_, "createBackupMeta_");
  (/* @__PURE__ */ __name((function extendRegistry() {
    try {
      ACTION_REGISTRY["health"] = { permission: null, audit: false, idempotent: false, handler: "handleHealthCheck_", method: "GET" };
      ACTION_REGISTRY["auditLog"] = { permission: "rbac.manage", audit: false, idempotent: false, handler: "handleGetAuditLog_", method: "GET" };
      ACTION_REGISTRY["transactionLog"] = { permission: "rbac.manage", audit: false, idempotent: false, handler: "handleGetTransactionLog_", method: "GET" };
      ACTION_REGISTRY["backupMeta"] = { permission: "rbac.manage", audit: true, idempotent: false, handler: "createBackupMeta_" };
    } catch (e) {
    }
  }), "extendRegistry"))();
  var _origHandleLegacyPost = handleLegacyPost_;
  handleLegacyPost_ = /* @__PURE__ */ __name(function(body) {
    try {
      if (body.action) checkRateLimit_(body.action, body.actor || "anon");
    } catch (e) {
      if (e.code === "RATE_LIMITED") return jsonOut_({ ok: false, error: e.code + ": " + e.message });
    }
    return _origHandleLegacyPost(body);
  }, "handleLegacyPost_");
  var _origHandleLegacyGet = handleLegacyGet_;
  handleLegacyGet_ = /* @__PURE__ */ __name(function(e) {
    try {
      if (e.parameter.action) checkRateLimit_(e.parameter.action, e.parameter.actor || "anon");
    } catch (err) {
      if (err.code === "RATE_LIMITED") return jsonOut_({ ok: false, error: err.code + ": " + err.message });
    }
    if (e.parameter.action === "health") {
      try {
        var sess = null;
        if (e.parameter.sessionToken) sess = requireSession_(e.parameter.sessionToken);
        return handleHealthCheck_(e.parameter, sess || {});
      } catch (ex) {
        return handleError_(ex);
      }
    }
    if (e.parameter.action === "auditLog") {
      try {
        var s = requireSession_(e.parameter.sessionToken || "");
        e.parameter.actor = s.username;
        e.parameter.role = s.role;
        return handleGetAuditLog_(e.parameter, s);
      } catch (ex) {
        return handleError_(ex);
      }
    }
    if (e.parameter.action === "transactionLog") {
      try {
        var s2 = requireSession_(e.parameter.sessionToken || "");
        e.parameter.actor = s2.username;
        e.parameter.role = s2.role;
        return handleGetTransactionLog_(e.parameter, s2);
      } catch (ex) {
        return handleError_(ex);
      }
    }
    return _origHandleLegacyGet(e);
  }, "handleLegacyGet_");
  const SHEET_MEETING = "Meeting";
  const SHEET_MEETING_ACTION = "Meeting_Action";
  const MEETING_HEADERS = ["ID", "Nomor Meeting", "Jenis Meeting", "Judul", "Tanggal", "Jam", "Lokasi", "Moderator", "Notulen", "Department", "Status", "Peserta (JSON)", "Agenda (JSON)", "Diskusi", "Keputusan (JSON)", "Ringkasan", "Catatan Tambahan", "Link Factory Project (JSON)", "Link Kaizen (JSON)", "Link SGA (JSON)", "Link Mesin (JSON)", "Lampiran (JSON)", "Created At", "Updated At", "Created By"];
  const MEETING_ACTION_HEADERS = ["ID", "Meeting ID", "Meeting Judul", "Jenis Meeting", "Judul Action", "Deskripsi", "PIC", "Department", "Prioritas", "Due Date", "Progress (%)", "Status", "Source Module", "Verifikasi Supervisor", "Created At", "Updated At", "Created By"];
  function propJsonOut_(key, fallback) {
    var raw = PropertiesService.getScriptProperties().getProperty(key);
    return jsonOut_({ ok: true, data: safeJsonParse_(raw, fallback) });
  }
  __name(propJsonOut_, "propJsonOut_");
  function permissionRowsToMap_(rows) {
    var out = {};
    (rows || []).forEach(function(r) {
      var key = String(r.PermissionKey || ""), role = String(r.Role || "");
      if (!key || !role) return;
      if (!out[key]) out[key] = {};
      out[key][role] = normalizeBool_(r.Allowed);
    });
    return out;
  }
  __name(permissionRowsToMap_, "permissionRowsToMap_");
  function readRoleAccessRowsFresh_(sh) {
    SpreadsheetApp.flush();
    var values = sh.getDataRange().getValues();
    if (values.length < 2) return [];
    var headers = values[0].map(function(v) {
      return String(v || "").trim();
    });
    var roleCol = headers.indexOf("Role");
    var keyCol = headers.indexOf("PermissionKey");
    var allowedCol = headers.indexOf("Allowed");
    if (roleCol < 0 || keyCol < 0 || allowedCol < 0) {
      throw { code: "RBAC_SHEET_HEADER_INVALID", message: "Header sheet " + sh.getName() + " harus berisi Role, PermissionKey, Allowed." };
    }
    var out = [];
    for (var i = 1; i < values.length; i++) {
      var role = String(values[i][roleCol] || "").trim();
      var key = String(values[i][keyCol] || "").trim();
      if (!role || !key) continue;
      out.push({ Role: role, PermissionKey: key, Allowed: values[i][allowedCol] });
    }
    return out;
  }
  __name(readRoleAccessRowsFresh_, "readRoleAccessRowsFresh_");
  function roleAccessMatrixDiff_(expected, actual) {
    var diff = [];
    Object.keys(expected || {}).forEach(function(key) {
      ["Supervisor", "Technician"].forEach(function(role) {
        var exp = !!(expected[key] && expected[key][role]);
        var act = !!(actual && actual[key] && actual[key][role]);
        if (exp !== act) diff.push(key + " [" + role + "] dikirim=" + exp + ", tersimpan=" + act);
      });
    });
    return diff;
  }
  __name(roleAccessMatrixDiff_, "roleAccessMatrixDiff_");
  function assertRoleAccessSaved_(label, expected, actual) {
    var diff = roleAccessMatrixDiff_(expected, actual);
    if (diff.length) {
      throw { code: "RBAC_VERIFY_MISMATCH", message: label + " tidak identik setelah ditulis ke Google Sheets. " + diff.slice(0, 8).join("; ") + (diff.length > 8 ? " (+" + (diff.length - 8) + " perbedaan lain)" : "") };
    }
  }
  __name(assertRoleAccessSaved_, "assertRoleAccessSaved_");
  function handleCreateUser_(body) {
    var d = body.user || body;
    var username = String(d.username || "").trim();
    var password = String(d.password || "");
    if (!username || password.length < 6) return jsonOut_({ ok: false, error: "Username wajib dan password minimal 6 karakter." });
    if (findUserRow_(username)) return jsonOut_({ ok: false, error: "Username sudah digunakan." });
    var salt = genSalt_(32), hash = hashPasswordV2_(password, salt, PBKDF2_ITERATIONS), now = /* @__PURE__ */ new Date();
    getUsersSheet_().appendRow([username, hash, salt, d.role || "Technician", d.displayName || username, true, now, now, "", "", "v2"]);
    invalidateCacheForSheet_(SHEET_USERS);
    return jsonOut_({ ok: true, username });
  }
  __name(handleCreateUser_, "handleCreateUser_");
  function handleUpdateUser_(body) {
    var d = body.user || body, username = String(d.username || "").trim();
    var allowedRoles = ["Technician", "Supervisor", "Superadmin"];
    if (!username) return jsonOut_({ ok: false, error: "Username wajib." });
    if (d.role !== void 0 && allowedRoles.indexOf(String(d.role)) === -1) return jsonOut_({ ok: false, error: "Role tidak valid." });
    var lock = LockService.getScriptLock();
    if (!lock.tryLock(15e3)) throw { code: "SERVER_BUSY", message: "Data user sedang diperbarui. Coba sekali lagi." };
    try {
      var found = findUserRow_(username);
      if (!found) return jsonOut_({ ok: false, error: "User tidak ditemukan." });
      var sh = getUsersSheet_(), h = found.headers;
      if (d.role !== void 0) sh.getRange(found.rowIndex, h.indexOf("Role") + 1).setValue(String(d.role));
      if (d.displayName !== void 0) sh.getRange(found.rowIndex, h.indexOf("DisplayName") + 1).setValue(String(d.displayName || ""));
      var updatedIdx = h.indexOf("UpdatedAt");
      if (updatedIdx >= 0) sh.getRange(found.rowIndex, updatedIdx + 1).setValue(/* @__PURE__ */ new Date());
      SpreadsheetApp.flush();
      revokeUserSessions_(username);
      invalidateCacheForSheet_(SHEET_USERS);
      var verify = findUserRow_(username);
      return jsonOut_({ ok: true, user: { username: verify.user.Username, role: verify.user.Role, displayName: verify.user.DisplayName, active: normalizeBool_(verify.user.Active) } });
    } finally {
      try {
        lock.releaseLock();
      } catch (e) {
      }
    }
  }
  __name(handleUpdateUser_, "handleUpdateUser_");
  function handleResetPassword_(body) {
    var password = String(body.newPassword || ""), found = findUserRow_(body.username);
    if (!found) return jsonOut_({ ok: false, error: "User tidak ditemukan." });
    if (password.length < 6) return jsonOut_({ ok: false, error: "Password minimal 6 karakter." });
    var salt = genSalt_(32), hash = hashPasswordV2_(password, salt, PBKDF2_ITERATIONS), sh = getUsersSheet_(), h = found.headers;
    sh.getRange(found.rowIndex, h.indexOf("PasswordHash") + 1).setValue(hash);
    sh.getRange(found.rowIndex, h.indexOf("Salt") + 1).setValue(salt);
    sh.getRange(found.rowIndex, h.indexOf("PasswordVersion") + 1).setValue("v2");
    sh.getRange(found.rowIndex, h.indexOf("UpdatedAt") + 1).setValue(/* @__PURE__ */ new Date());
    revokeUserSessions_(body.username);
    invalidateCacheForSheet_(SHEET_USERS);
    return jsonOut_({ ok: true });
  }
  __name(handleResetPassword_, "handleResetPassword_");
  function handleSetUserActive_(body) {
    var found = findUserRow_(body.username);
    if (!found) return jsonOut_({ ok: false, error: "User tidak ditemukan." });
    var sh = getUsersSheet_(), h = found.headers;
    sh.getRange(found.rowIndex, h.indexOf("Active") + 1).setValue(!!body.active);
    sh.getRange(found.rowIndex, h.indexOf("UpdatedAt") + 1).setValue(/* @__PURE__ */ new Date());
    if (!body.active) revokeUserSessions_(body.username);
    invalidateCacheForSheet_(SHEET_USERS);
    return jsonOut_({ ok: true });
  }
  __name(handleSetUserActive_, "handleSetUserActive_");
  function handleDeleteUser_(body) {
    if (String(body.username || "").toLowerCase() === "superadmin") return jsonOut_({ ok: false, error: "Akun superadmin utama tidak dapat dihapus." });
    var found = findUserRow_(body.username);
    if (!found) return jsonOut_({ ok: false, error: "User tidak ditemukan." });
    revokeUserSessions_(body.username);
    getUsersSheet_().deleteRow(found.rowIndex);
    invalidateCacheForSheet_(SHEET_USERS);
    return jsonOut_({ ok: true });
  }
  __name(handleDeleteUser_, "handleDeleteUser_");
  function normalizeRoleAccessMatrix_(input) {
    if (input === void 0 || input === null) return {};
    if (typeof input !== "object" || Array.isArray(input)) {
      throw { code: "VALIDATION_ERROR", message: "Format permission tidak valid." };
    }
    var keys = Object.keys(input);
    if (keys.length > 2500) throw { code: "VALIDATION_ERROR", message: "Jumlah permission terlalu banyak." };
    var out = {};
    keys.forEach(function(rawKey) {
      var key = String(rawKey || "").trim();
      if (!key || key.length > 180) throw { code: "VALIDATION_ERROR", message: "PermissionKey tidak valid." };
      var row = input[rawKey] || {};
      out[key] = {
        Supervisor: normalizeBool_(row.Supervisor),
        Technician: normalizeBool_(row.Technician)
      };
    });
    return out;
  }
  __name(normalizeRoleAccessMatrix_, "normalizeRoleAccessMatrix_");
  function roleAccessMapToRows_(updates) {
    var rows = [];
    Object.keys(updates || {}).sort().forEach(function(key) {
      ["Supervisor", "Technician"].forEach(function(role) {
        rows.push([role, key, !!updates[key][role]]);
      });
    });
    return rows;
  }
  __name(roleAccessMapToRows_, "roleAccessMapToRows_");
  function preservedUnmanagedRoleRows_(sh, managedRoles) {
    var managed = {};
    (managedRoles || []).forEach(function(r) {
      managed[String(r).toLowerCase()] = true;
    });
    return snapshotRoleAccessRows_(sh).filter(function(r) {
      return !managed[String(r[0] || "").toLowerCase()] && String(r[0] || "").trim() && String(r[1] || "").trim();
    });
  }
  __name(preservedUnmanagedRoleRows_, "preservedUnmanagedRoleRows_");
  function roleAccessRowsWithPreservedUnmanaged_(sh, updates) {
    return roleAccessMapToRows_(updates).concat(preservedUnmanagedRoleRows_(sh, ["Supervisor", "Technician"]));
  }
  __name(roleAccessRowsWithPreservedUnmanaged_, "roleAccessRowsWithPreservedUnmanaged_");
  function getHeaderColMap_(sh) {
    var lastCol = sh.getLastColumn();
    if (lastCol < 1) return {};
    var headers = sh.getRange(1, 1, 1, lastCol).getValues()[0];
    var map = {};
    headers.forEach(function(h, i) {
      var name = String(h || "").trim();
      if (name) map[name] = i + 1;
    });
    return map;
  }
  __name(getHeaderColMap_, "getHeaderColMap_");
  function replaceRoleAccessRows_(sh, rows) {
    var colMap = getHeaderColMap_(sh);
    var roleCol = colMap["Role"], keyCol = colMap["PermissionKey"], allowedCol = colMap["Allowed"];
    if (!roleCol || !keyCol || !allowedCol) {
      throw { code: "RBAC_SHEET_HEADER_INVALID", message: "Header sheet " + sh.getName() + " harus berisi Role, PermissionKey, Allowed." };
    }
    var oldCount = Math.max(0, sh.getLastRow() - 1);
    if (rows.length) {
      sh.getRange(2, roleCol, rows.length, 1).setValues(rows.map(function(r) {
        return [r[0]];
      }));
      sh.getRange(2, keyCol, rows.length, 1).setValues(rows.map(function(r) {
        return [r[1]];
      }));
      sh.getRange(2, allowedCol, rows.length, 1).setValues(rows.map(function(r) {
        return [r[2]];
      }));
    }
    if (oldCount > rows.length) {
      var clearN = oldCount - rows.length, startRow = rows.length + 2;
      sh.getRange(startRow, roleCol, clearN, 1).clearContent();
      sh.getRange(startRow, keyCol, clearN, 1).clearContent();
      sh.getRange(startRow, allowedCol, clearN, 1).clearContent();
    }
    SpreadsheetApp.flush();
  }
  __name(replaceRoleAccessRows_, "replaceRoleAccessRows_");
  function snapshotRoleAccessRows_(sh) {
    var colMap = getHeaderColMap_(sh);
    var roleCol = colMap["Role"], keyCol = colMap["PermissionKey"], allowedCol = colMap["Allowed"];
    if (!roleCol || !keyCol || !allowedCol) return [];
    var count = Math.max(0, sh.getLastRow() - 1);
    if (!count) return [];
    var roleVals = sh.getRange(2, roleCol, count, 1).getValues();
    var keyVals = sh.getRange(2, keyCol, count, 1).getValues();
    var allowedVals = sh.getRange(2, allowedCol, count, 1).getValues();
    var out = [];
    for (var i = 0; i < count; i++) {
      out.push([roleVals[i][0], keyVals[i][0], allowedVals[i][0]]);
    }
    return out;
  }
  __name(snapshotRoleAccessRows_, "snapshotRoleAccessRows_");
  function syncFeatureRegistryForRoleAccess_(features) {
    var fs = getFeaturesSheet_(), existing = getFeatureRegistryOut_(), byKey = {};
    (existing || []).forEach(function(f) {
      if (f && f.PermissionKey) byKey[String(f.PermissionKey)] = f;
    });
    (features || []).forEach(function(f) {
      if (!f || !f.PermissionKey) return;
      var key = String(f.PermissionKey).trim();
      if (!key) return;
      byKey[key] = { PermissionKey: key, Label: String(f.Label || key), Group: String(f.Group || "Umum") };
    });
    var frows = Object.keys(byKey).sort().map(function(k) {
      return [k, byKey[k].Label || k, byKey[k].Group || "Umum"];
    });
    var colMap = getHeaderColMap_(fs);
    var keyCol = colMap["PermissionKey"], labelCol = colMap["Label"], groupCol = colMap["Group"];
    if (!keyCol || !labelCol || !groupCol) {
      throw { code: "FEATURE_SHEET_HEADER_INVALID", message: "Header sheet " + fs.getName() + " harus berisi PermissionKey, Label, Group." };
    }
    var oldCount = Math.max(0, fs.getLastRow() - 1);
    if (frows.length) {
      fs.getRange(2, keyCol, frows.length, 1).setValues(frows.map(function(r) {
        return [r[0]];
      }));
      fs.getRange(2, labelCol, frows.length, 1).setValues(frows.map(function(r) {
        return [r[1]];
      }));
      fs.getRange(2, groupCol, frows.length, 1).setValues(frows.map(function(r) {
        return [r[2]];
      }));
    }
    if (oldCount > frows.length) {
      var clearN = oldCount - frows.length, startRow = frows.length + 2;
      fs.getRange(startRow, keyCol, clearN, 1).clearContent();
      fs.getRange(startRow, labelCol, clearN, 1).clearContent();
      fs.getRange(startRow, groupCol, clearN, 1).clearContent();
    }
    SpreadsheetApp.flush();
    invalidateCacheForSheet_(SHEET_FEATURES);
    return frows.map(function(r) {
      return { PermissionKey: r[0], Label: r[1], Group: r[2] };
    });
  }
  __name(syncFeatureRegistryForRoleAccess_, "syncFeatureRegistryForRoleAccess_");
  function handleSavePermissions_(body) {
    var updates = normalizeRoleAccessMatrix_(body.permissions || {});
    var lock = LockService.getScriptLock();
    if (!lock.tryLock(2e4)) throw { code: "SERVER_BUSY", message: "Konfigurasi akses sedang disimpan oleh proses lain. Coba sekali lagi." };
    try {
      var permSh = getPermissionsSheet_();
      replaceRoleAccessRows_(permSh, roleAccessRowsWithPreservedUnmanaged_(permSh, updates));
      invalidateCacheForSheet_(SHEET_PERMISSIONS);
      var savedPermissions = permissionRowsToMap_(readRoleAccessRowsFresh_(permSh));
      assertRoleAccessSaved_("Role_Permissions", updates, savedPermissions);
      var featuresOut = [];
      try {
        featuresOut = syncFeatureRegistryForRoleAccess_(body.features || []);
      } catch (featErr) {
      }
      return jsonOut_({ ok: true, permissions: savedPermissions, features: featuresOut, verifiedFresh: true });
    } finally {
      try {
        lock.releaseLock();
      } catch (e) {
      }
    }
  }
  __name(handleSavePermissions_, "handleSavePermissions_");
  function handleSaveLcPermissions_(body) {
    var updates = normalizeRoleAccessMatrix_(body.permissions || body.lcPermissions || {});
    var lock = LockService.getScriptLock();
    if (!lock.tryLock(2e4)) throw { code: "SERVER_BUSY", message: "Konfigurasi akses sedang disimpan oleh proses lain. Coba sekali lagi." };
    try {
      var lcSh = getLcPermissionsSheet_();
      replaceRoleAccessRows_(lcSh, roleAccessRowsWithPreservedUnmanaged_(lcSh, updates));
      invalidateCacheForSheet_(SHEET_LC_PERMISSIONS);
      var savedLc = permissionRowsToMap_(readRoleAccessRowsFresh_(lcSh));
      assertRoleAccessSaved_("Low_Cognitive_Permissions", updates, savedLc);
      return jsonOut_({ ok: true, permissions: savedLc, lcPermissions: savedLc, verifiedFresh: true });
    } finally {
      try {
        lock.releaseLock();
      } catch (e) {
      }
    }
  }
  __name(handleSaveLcPermissions_, "handleSaveLcPermissions_");
  function handleSaveRoleAccessConfig_(body) {
    var updates = normalizeRoleAccessMatrix_(body.permissions || {});
    var lcUpdates = body.lcPermissions === void 0 ? permissionRowsToMap_(getLcPermissionMatrix_()) : normalizeRoleAccessMatrix_(body.lcPermissions || {});
    var lock = LockService.getScriptLock();
    if (!lock.tryLock(25e3)) throw { code: "SERVER_BUSY", message: "Konfigurasi Role Access sedang diproses. Coba sekali lagi." };
    var permSh = getPermissionsSheet_(), lcSh = getLcPermissionsSheet_();
    var beforePerm = snapshotRoleAccessRows_(permSh), beforeLc = snapshotRoleAccessRows_(lcSh);
    try {
      replaceRoleAccessRows_(permSh, roleAccessRowsWithPreservedUnmanaged_(permSh, updates));
      replaceRoleAccessRows_(lcSh, roleAccessRowsWithPreservedUnmanaged_(lcSh, lcUpdates));
      invalidateCacheForSheet_(SHEET_PERMISSIONS);
      invalidateCacheForSheet_(SHEET_LC_PERMISSIONS);
      var featuresOut = [];
      try {
        featuresOut = syncFeatureRegistryForRoleAccess_(body.features || []);
      } catch (featErr) {
      }
      var savedPermissions = permissionRowsToMap_(readRoleAccessRowsFresh_(permSh));
      var savedLc = permissionRowsToMap_(readRoleAccessRowsFresh_(lcSh));
      assertRoleAccessSaved_("Role_Permissions", updates, savedPermissions);
      assertRoleAccessSaved_("Low_Cognitive_Permissions", lcUpdates, savedLc);
      return jsonOut_({ ok: true, permissions: savedPermissions, lcPermissions: savedLc, features: featuresOut, verifiedFresh: true });
    } catch (err) {
      try {
        replaceRoleAccessRows_(permSh, beforePerm);
      } catch (rb1) {
      }
      try {
        replaceRoleAccessRows_(lcSh, beforeLc);
      } catch (rb2) {
      }
      invalidateCacheForSheet_(SHEET_PERMISSIONS);
      invalidateCacheForSheet_(SHEET_LC_PERMISSIONS);
      throw err;
    } finally {
      try {
        lock.releaseLock();
      } catch (e) {
      }
    }
  }
  __name(handleSaveRoleAccessConfig_, "handleSaveRoleAccessConfig_");
  function handleSaveThemePref_(body) {
    return saveUserPreference_(body, "ThemePref", body.theme || body.value || "");
  }
  __name(handleSaveThemePref_, "handleSaveThemePref_");
  function handleSaveStylePref_(body) {
    return saveUserPreference_(body, "StylePref", body.style || body.value || "");
  }
  __name(handleSaveStylePref_, "handleSaveStylePref_");
  function saveUserPreference_(body, column, value) {
    var found = findUserRow_(body.actor);
    if (!found) return jsonOut_({ ok: false, error: "User tidak ditemukan." });
    var idx = found.headers.indexOf(column);
    if (idx < 0) return jsonOut_({ ok: false, error: "Kolom preference tidak tersedia." });
    getUsersSheet_().getRange(found.rowIndex, idx + 1).setValue(value);
    invalidateCacheForSheet_(SHEET_USERS);
    return jsonOut_({ ok: true, value });
  }
  __name(saveUserPreference_, "saveUserPreference_");
  function handleFixLogbookDataQuality_(body) {
    var sh = getOrCreateSheet_(SHEET_LOGBOOK, LOGBOOK_HEADERS);
    var values = sh.getDataRange().getValues();
    if (values.length < 2) return jsonOut_({ ok: true, dryRun: body.dryRun !== false, dateFixCount: 0, jenisFixCount: 0, dateFixSample: [], jenisFixSample: [] });
    var headers = values[0], idCol = headers.indexOf("ID"), dateCol = headers.indexOf("Tanggal");
    var tsCol = headers.indexOf("Timestamp Input"), jenisCol = headers.indexOf("Jenis Pekerjaan"), descCol = headers.indexOf("Deskripsi Masalah");
    if (dateCol < 0 || jenisCol < 0 || descCol < 0) return jsonOut_({ ok: false, error: "Kolom Logbook untuk perbaikan kualitas data tidak lengkap." });
    var today = /* @__PURE__ */ new Date(), dateFix = [], jenisFix = [], changed = false;
    var fmt = /* @__PURE__ */ __name(function(v) {
      if (v instanceof Date && !isNaN(v.getTime())) return Utilities.formatDate(v, Session.getScriptTimeZone(), "yyyy-MM-dd");
      return String(v === void 0 || v === null ? "" : v);
    }, "fmt");
    for (var i = 1; i < values.length; i++) {
      if (!values[i][idCol]) continue;
      var raw = values[i][dateCol], parsed = raw instanceof Date ? new Date(raw) : new Date(String(raw || ""));
      var missing = !raw || String(raw).trim() === "", future = !isNaN(parsed.getTime()) && parsed.getTime() > today.getTime();
      if (missing || future) {
        var basis = !isNaN(parsed.getTime()) ? parsed : null;
        if (!basis && tsCol >= 0) {
          var ts = new Date(values[i][tsCol]);
          if (!isNaN(ts.getTime())) basis = ts;
        }
        var rawMatch = String(raw || "").match(/^\s*\d{4}-(\d{2})-(\d{2})/);
        var monthDay = rawMatch ? rawMatch[1] + "-" + rawMatch[2] : basis ? Utilities.formatDate(basis, Session.getScriptTimeZone(), "MM-dd") : "01-01";
        var replacementText = "2025-" + monthDay;
        dateFix.push({ id: values[i][idCol], oldValue: fmt(raw), newValue: replacementText });
        values[i][dateCol] = replacementText;
        changed = true;
      }
      var desc = String(values[i][descCol] || "").trim(), normalized = desc.toLowerCase().replace(/[.\s]+/g, "");
      if (normalized === "preventive" || normalized === "pm" || normalized === "preventivemaintenance") {
        var newJenis = "Preventive";
        jenisFix.push({ id: values[i][idCol], oldDeskripsi: desc, newJenis });
        values[i][jenisCol] = newJenis;
        values[i][descCol] = "";
        changed = true;
      }
    }
    var dryRun = body.dryRun !== false;
    if (!dryRun && changed) {
      var rowCount = values.length - 1;
      sh.getRange(2, dateCol + 1, rowCount, 1).setValues(values.slice(1).map(function(r) {
        return [r[dateCol]];
      }));
      sh.getRange(2, jenisCol + 1, rowCount, 1).setValues(values.slice(1).map(function(r) {
        return [r[jenisCol]];
      }));
      sh.getRange(2, descCol + 1, rowCount, 1).setValues(values.slice(1).map(function(r) {
        return [r[descCol]];
      }));
      invalidateCacheForSheet_(SHEET_LOGBOOK);
    }
    return jsonOut_({ ok: true, dryRun, dateFixCount: dateFix.length, jenisFixCount: jenisFix.length, dateFixSample: dateFix.slice(0, 30), jenisFixSample: jenisFix.slice(0, 30) });
  }
  __name(handleFixLogbookDataQuality_, "handleFixLogbookDataQuality_");
  function fixOldAttachmentSharing_() {
    var folderNames = [
      "Logbook Maintenance - Attachments",
      "Logbook Maintenance - Meeting Files",
      "Logbook Maintenance - Manuals",
      "Logbook Maintenance - Reports PDF"
    ];
    var fixed = 0, failed = 0;
    folderNames.forEach(function(name) {
      var folders = DriveApp.getFoldersByName(name);
      while (folders.hasNext()) {
        var folder = folders.next();
        var files = folder.getFiles();
        while (files.hasNext()) {
          var f = files.next();
          try {
            f.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
            fixed++;
          } catch (e) {
            failed++;
          }
        }
      }
    });
    Logger.log("fixOldAttachmentSharing_: fixed=" + fixed + " failed=" + failed);
    return { fixed, failed };
  }
  __name(fixOldAttachmentSharing_, "fixOldAttachmentSharing_");
  function genericUpsertById_(sheetName, headers, data, prefix, actor) {
    data = data || {};
    var sh = getOrCreateSheet_(sheetName, headers);
    var now = nowIso_();
    var id = data.ID || data.id || prefix + "-" + Utilities.getUuid();
    data.ID = id;
    var found = findRowByColumnValue_(sh, "ID", id);
    var currentHeaders = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
    var current = found ? rowToObj_(currentHeaders, found.row) : {};
    if (!data["Created At"]) data["Created At"] = current["Created At"] || now;
    data["Updated At"] = now;
    if (actor && !data["Created By"]) data["Created By"] = current["Created By"] || actor;
    var row = currentHeaders.map(function(h) {
      var v = data[h] !== void 0 ? data[h] : current[h];
      if (/\(JSON\)$/.test(h) && typeof v !== "string") v = JSON.stringify(v || []);
      return v === void 0 ? "" : v;
    });
    if (found) sh.getRange(found.rowIndex, 1, 1, row.length).setValues([row]);
    else sh.appendRow(row);
    invalidateCacheForSheet_(sheetName);
    return { ok: true, id, updated: !!found };
  }
  __name(genericUpsertById_, "genericUpsertById_");
  function getPmcFactory_() {
    return getGenericRows_(SHEET_FACTORY_PROJECT, FACTORY_PROJECT_HEADERS);
  }
  __name(getPmcFactory_, "getPmcFactory_");
  function getPmcKaizen_() {
    return getGenericRows_(SHEET_KAIZEN, KAIZEN_HEADERS);
  }
  __name(getPmcKaizen_, "getPmcKaizen_");
  function getPmcSga_() {
    return getGenericRows_(SHEET_SGA, SGA_HEADERS);
  }
  __name(getPmcSga_, "getPmcSga_");
  function savePmcType_(type, body) {
    var cfg = type === "factory" ? [SHEET_FACTORY_PROJECT, FACTORY_PROJECT_HEADERS, "FP"] : type === "kaizen" ? [SHEET_KAIZEN, KAIZEN_HEADERS, "KZN"] : [SHEET_SGA, SGA_HEADERS, "SGA"];
    var data = body.data || body.item || {};
    var fileMap = { factory: [["attachmentFiles", "Attachment (JSON)"]], kaizen: [["fotoBeforeFiles", "Foto Before (JSON)"], ["fotoAfterFiles", "Foto After (JSON)"]], sga: [["presentasiFiles", "Presentasi (JSON)"]] }[type];
    fileMap.forEach(function(pair) {
      var files = body[pair[0]];
      if (!Array.isArray(files) || !files.length) return;
      var folder = getOrCreateProjectFolder_();
      data[pair[1]] = files.map(function(f) {
        return uploadBase64File_(folder, f, f.name || "attachment", f.mimeType || "application/octet-stream");
      });
    });
    return jsonOut_(genericUpsertById_(cfg[0], cfg[1], data, cfg[2], body.actor));
  }
  __name(savePmcType_, "savePmcType_");
  function deletePmcType_(type, body) {
    var cfg = type === "factory" ? [SHEET_FACTORY_PROJECT, FACTORY_PROJECT_HEADERS] : type === "kaizen" ? [SHEET_KAIZEN, KAIZEN_HEADERS] : [SHEET_SGA, SGA_HEADERS];
    return jsonOut_(softDeleteById_(cfg[0], body.id || body.ID, body.actor, body.reason || ""));
  }
  __name(deletePmcType_, "deletePmcType_");
  function addPmcProgressLog_(body) {
    var type = body.type || "factory";
    var cfg = type === "factory" ? [SHEET_FACTORY_PROJECT, FACTORY_PROJECT_HEADERS] : type === "kaizen" ? [SHEET_KAIZEN, KAIZEN_HEADERS] : [SHEET_SGA, SGA_HEADERS];
    var sh = getOrCreateSheet_(cfg[0], cfg[1]);
    var found = findRowByColumnValue_(sh, "ID", body.id || body.ID);
    if (!found) return jsonOut_({ ok: false, error: "Project tidak ditemukan" });
    var headers = found.headers, col = headers.indexOf("Progress Log (JSON)");
    if (col < 0) return jsonOut_({ ok: false, error: "Kolom Progress Log tidak tersedia" });
    var logs = safeJsonParse_(found.row[col] || "[]", []);
    var log = body.log || body.data || { tanggal: nowIso_(), catatan: body.catatan || "", actor: body.actor || "" };
    if (Array.isArray(body.photos) && body.photos.length) {
      var folder = getOrCreateProjectFolder_();
      log.foto = body.photos.map(function(f) {
        return uploadBase64File_(folder, f, f.name || "progress-photo", f.mimeType || "image/jpeg");
      });
    }
    logs.push(log);
    sh.getRange(found.rowIndex, col + 1).setValue(JSON.stringify(logs));
    invalidateCacheForSheet_(cfg[0]);
    return jsonOut_({ ok: true, id: body.id || body.ID, attachments: log.foto || [] });
  }
  __name(addPmcProgressLog_, "addPmcProgressLog_");
  function getMeetingList_() {
    return getGenericRows_(SHEET_MEETING, MEETING_HEADERS);
  }
  __name(getMeetingList_, "getMeetingList_");
  function getMeetingActionList_() {
    return getGenericRows_(SHEET_MEETING_ACTION, MEETING_ACTION_HEADERS);
  }
  __name(getMeetingActionList_, "getMeetingActionList_");
  function saveMeeting_(body) {
    var data = body.data || {};
    if (!String(data.Judul || "").trim()) return jsonOut_({ ok: false, error: "Judul meeting wajib diisi" });
    if (Array.isArray(body.attachmentFiles) && body.attachmentFiles.length) {
      var folder = getOrCreateMeetingFolder_();
      var existing = Array.isArray(data["Lampiran (JSON)"]) ? data["Lampiran (JSON)"] : safeJsonParse_(data["Lampiran (JSON)"] || "[]", []);
      var uploaded = body.attachmentFiles.map(function(f) {
        return uploadBase64File_(folder, f, f.name || "meeting-attachment", f.mimeType || "application/octet-stream");
      });
      data["Lampiran (JSON)"] = existing.concat(uploaded);
    }
    var result = genericUpsertById_(SHEET_MEETING, MEETING_HEADERS, data, "MTG", body.actor);
    (body.newActionItems || []).forEach(function(a) {
      a["Meeting ID"] = result.id;
      a["Meeting Judul"] = data.Judul || "";
      a["Jenis Meeting"] = data["Jenis Meeting"] || "";
      genericUpsertById_(SHEET_MEETING_ACTION, MEETING_ACTION_HEADERS, a, "ACT", body.actor);
    });
    return jsonOut_(result);
  }
  __name(saveMeeting_, "saveMeeting_");
  function deleteMeeting_(body) {
    var id = body.id || body.ID;
    var res = softDeleteById_(SHEET_MEETING, id, body.actor, body.reason || "");
    return jsonOut_(res);
  }
  __name(deleteMeeting_, "deleteMeeting_");
  function saveMeetingAction_(body) {
    return jsonOut_(genericUpsertById_(SHEET_MEETING_ACTION, MEETING_ACTION_HEADERS, body.data || {}, "ACT", body.actor));
  }
  __name(saveMeetingAction_, "saveMeetingAction_");
  function deleteMeetingAction_(body) {
    return jsonOut_(softDeleteById_(SHEET_MEETING_ACTION, body.id || body.ID, body.actor, body.reason || ""));
  }
  __name(deleteMeetingAction_, "deleteMeetingAction_");
  (/* @__PURE__ */ __name((function registerAllPublicActions_() {
    var add = /* @__PURE__ */ __name(function(name, permission, method, idempotent) {
      ACTION_REGISTRY[name] = { permission, audit: method !== "GET", idempotent: !!idempotent, method };
    }, "add");
    ["analitikConfig"].forEach(function(a) {
      add(a, "setting.read", "GET", false);
    });
    ["patrolCategoryConfig", "patrolGeneralChecklist"].forEach(function(a) {
      add(a, "view.patrol", "GET", false);
    });
    ["generalReports", "ipalReports"].forEach(function(a) {
      add(a, "report.read", "GET", false);
    });
    add("rcaReports", "view.rca", "GET", false);
    add("kbEntries", "view.knowledge", "GET", false);
    add("recordYtdList", "view.record-ytd", "GET", false);
    add("runHourComparisonList", "view.run-hour-comparison", "GET", false);
    add("energyCostToeList", "view.energy-cost-toe", "GET", false);
    add("meetingActionList", "view.meeting", "GET", false);
    ["predictiveReports"].forEach(function(a) {
      add(a, "patrol.read", "GET", false);
    });
    ["sparepartStatus", "sparepartSapStatus", "sparepartWarehouse"].forEach(function(a) {
      add(a, "sparepart.read", "GET", false);
    });
    ["kpiKerjaList"].forEach(function(a) {
      add(a, "analytics.read", "GET", false);
    });
    add("kpiDepartmentData", "view.kpi-department", "GET", false);
    add("machineBreakdownList", "view.machine-breakdown", "GET", false);
    add("correctiveReportList", "view.corrective-report", "GET", false);
    add("energyUtilityList", "view.energy-utility", "GET", false);
    ["saveAnalitikConfig", "savePatrolCategoryConfig", "savePatrolGeneralChecklist", "seedPatrolTemplateBulk", "seedPiPersonnelMasterBulk"].forEach(function(a) {
      add(a, "setting.manage", "POST", true);
    });
    ["saveGeneralReport", "deleteGeneralReport", "saveIpalReport", "deleteIpalReport"].forEach(function(a) {
      add(a, "report.manage", "POST", true);
    });
    ["saveRcaReport", "deleteRcaReport"].forEach(function(a) {
      add(a, "view.rca", "POST", true);
    });
    ["saveKbEntry", "deleteKbEntry"].forEach(function(a) {
      add(a, "view.knowledge", "POST", true);
    });
    ["savePredictiveReport", "deletePredictiveReport"].forEach(function(a) {
      add(a, "patrol.manage", "POST", true);
    });
    ["saveKpiKerja", "deleteKpiKerja", "bulkImportKpiKerja", "seedKpiKerjaDefault", "seedKpiDepartmentExtraDefault", "saveDowntimeHistory"].forEach(function(a) {
      add(a, "analytics.manage", "POST", true);
    });
    ["saveMachineBreakdown", "deleteMachineBreakdown"].forEach(function(a) {
      add(a, "view.machine-breakdown", "POST", true);
    });
    ["saveCorrectiveReport", "deleteCorrectiveReport"].forEach(function(a) {
      add(a, "view.corrective-report", "POST", true);
    });
    ["saveEnergyUtility", "deleteEnergyUtility", "bulkImportEnergyUtility"].forEach(function(a) {
      add(a, "view.energy-utility", "POST", true);
    });
    ["saveRecordYtd", "deleteRecordYtd", "bulkImportRecordYtd"].forEach(function(a) {
      add(a, "view.record-ytd", "POST", true);
    });
    ["saveRunHourComparison", "deleteRunHourComparison", "bulkImportRunHourComparison"].forEach(function(a) {
      add(a, "view.run-hour-comparison", "POST", true);
    });
    ["saveEnergyCostToe", "deleteEnergyCostToe"].forEach(function(a) {
      add(a, "view.energy-cost-toe", "POST", true);
    });
    ["updateSparepartEta", "updateSparepartSap", "bulkUpdateSparepartSap", "saveSparepartWarehouse"].forEach(function(a) {
      add(a, "sparepart.manage", "POST", true);
    });
    ["saveMeetingAction", "deleteMeetingAction"].forEach(function(a) {
      add(a, "meeting.manage", "POST", true);
    });
    ["savePmcFactoryProject", "deletePmcFactoryProject", "savePmcKaizen", "deletePmcKaizen", "savePmcSga", "deletePmcSga", "addPmcProgressLog", "pmcAddProgressLog"].forEach(function(a) {
      add(a, "project.manage", "POST", true);
    });
    ["aiAnalyze", "groqFixTypo", "groqKbEnrich"].forEach(function(a) {
      add(a, "ai.groq", "POST", false);
    });
    add("fixLogbookDataQuality", "logbook.manage", "POST", true);
    add("updateApprovalDecision", "report.manage", "POST", true);
  }), "registerAllPublicActions_"))();
  var _compatGetFallback = typeof _origHandleLegacyGet === "function" ? _origHandleLegacyGet : handleLegacyGet_;
  handleLegacyGet_ = /* @__PURE__ */ __name(function(e) {
    var a = String((e.parameter || {}).action || "");
    checkRateLimit_(a, (e.parameter || {}).actor || "anon");
    var getters = {
      health: /* @__PURE__ */ __name(function() {
        return handleHealthCheck_(e.parameter, { username: (e.parameter || {}).actor || "", role: (e.parameter || {}).role || "" });
      }, "health"),
      auditLog: /* @__PURE__ */ __name(function() {
        return handleGetAuditLog_(e.parameter, { username: (e.parameter || {}).actor || "", role: (e.parameter || {}).role || "" });
      }, "auditLog"),
      transactionLog: /* @__PURE__ */ __name(function() {
        return handleGetTransactionLog_(e.parameter, { username: (e.parameter || {}).actor || "", role: (e.parameter || {}).role || "" });
      }, "transactionLog"),
      analitikConfig: /* @__PURE__ */ __name(function() {
        try {
          var prop = PropertiesService.getScriptProperties().getProperty("ANALITIK_CONFIG");
          if (prop) return jsonOut_({ ok: true, data: JSON.parse(prop) });
          var sh = getOrCreateSheet_("Analitik_Config", ["Key", "Value", "UpdatedAt", "UpdatedBy"]);
          var data = sh.getDataRange().getValues();
          if (data.length > 1) {
            var cfg = {};
            data.slice(1).forEach(function(r) {
              cfg[r[0]] = r[1];
            });
            return jsonOut_({ ok: true, data: { jamOperasiPerHari: Number(cfg.jamOperasiPerHari) || 24, jumlahMesinManual: cfg.jumlahMesinManual || "", kerugianPerJam: Number(cfg.kerugianPerJam) || 5e6 } });
          }
        } catch (e2) {
        }
        return propJsonOut_("ANALITIK_CONFIG", {});
      }, "analitikConfig"),
      patrolCategoryConfig: /* @__PURE__ */ __name(function() {
        try {
          var prop = PropertiesService.getScriptProperties().getProperty("PATROL_CATEGORY_CONFIG");
          if (prop) return jsonOut_({ ok: true, data: JSON.parse(prop) });
          var sh = getOrCreateSheet_("Patrol_Category_Config", ["Kategori", "Active", "UpdatedAt", "UpdatedBy"]);
          var data = sh.getDataRange().getValues();
          if (data.length > 1) {
            var cfg = {};
            data.slice(1).forEach(function(r) {
              cfg[r[0]] = String(r[1]).toUpperCase() === "TRUE";
            });
            return jsonOut_({ ok: true, data: cfg });
          }
        } catch (e2) {
        }
        return propJsonOut_("PATROL_CATEGORY_CONFIG", {});
      }, "patrolCategoryConfig"),
      patrolGeneralChecklist: /* @__PURE__ */ __name(function() {
        try {
          var prop = PropertiesService.getScriptProperties().getProperty("PATROL_GENERAL_CHECKLIST");
          if (prop) return jsonOut_({ ok: true, data: JSON.parse(prop) });
          var sh = getOrCreateSheet_("Patrol_General_Checklist", ["Kategori", "Index", "Item", "UpdatedAt", "UpdatedBy"]);
          var data = sh.getDataRange().getValues();
          if (data.length > 1) {
            var cfg = {};
            data.slice(1).forEach(function(r) {
              var cat = r[0];
              if (!cfg[cat]) cfg[cat] = [];
              cfg[cat][Number(r[1]) - 1] = r[2];
            });
            Object.keys(cfg).forEach(function(k) {
              cfg[k] = cfg[k].filter(Boolean);
            });
            return jsonOut_({ ok: true, data: cfg });
          }
        } catch (e2) {
        }
        return propJsonOut_("PATROL_GENERAL_CHECKLIST", {});
      }, "patrolGeneralChecklist"),
      generalReports: /* @__PURE__ */ __name(function() {
        return jsonOut_({ ok: true, data: getGeneralReports_() });
      }, "generalReports"),
      predictiveReports: /* @__PURE__ */ __name(function() {
        return jsonOut_({ ok: true, data: getPredictiveReports_() });
      }, "predictiveReports"),
      ipalReports: /* @__PURE__ */ __name(function() {
        return jsonOut_({ ok: true, data: getIpalReports_() });
      }, "ipalReports"),
      rcaReports: /* @__PURE__ */ __name(function() {
        return jsonOut_({ ok: true, data: getRcaReports_() });
      }, "rcaReports"),
      kbEntries: /* @__PURE__ */ __name(function() {
        return jsonOut_({ ok: true, data: getKbEntries_() });
      }, "kbEntries"),
      recordYtdList: /* @__PURE__ */ __name(function() {
        return jsonOut_({ ok: true, data: getRecordYtdList_() });
      }, "recordYtdList"),
      kpiDepartmentData: /* @__PURE__ */ __name(function() {
        return jsonOut_({ ok: true, data: getKpiDepartmentData_() });
      }, "kpiDepartmentData"),
      runHourComparisonList: /* @__PURE__ */ __name(function() {
        return jsonOut_({ ok: true, data: getRunHourComparisonList_() });
      }, "runHourComparisonList"),
      energyCostToeList: /* @__PURE__ */ __name(function() {
        return jsonOut_({ ok: true, data: getEnergyCostToeList_() });
      }, "energyCostToeList"),
      sparepartStatus: /* @__PURE__ */ __name(function() {
        return jsonOut_({ ok: true, data: getSparepartStatusMap_() });
      }, "sparepartStatus"),
      sparepartSapStatus: /* @__PURE__ */ __name(function() {
        return jsonOut_({ ok: true, data: getSparepartSapStatusList_() });
      }, "sparepartSapStatus"),
      sparepartWarehouse: /* @__PURE__ */ __name(function() {
        return jsonOut_({ ok: true, data: getGenericRows_("Sparepart_Warehouse", []) });
      }, "sparepartWarehouse"),
      meetingList: /* @__PURE__ */ __name(function() {
        return jsonOut_({ ok: true, data: getMeetingList_() });
      }, "meetingList"),
      meetingActionList: /* @__PURE__ */ __name(function() {
        return jsonOut_({ ok: true, data: getMeetingActionList_() });
      }, "meetingActionList"),
      pmcFactoryProjects: /* @__PURE__ */ __name(function() {
        return jsonOut_({ ok: true, data: getPmcFactory_() });
      }, "pmcFactoryProjects"),
      pmcKaizens: /* @__PURE__ */ __name(function() {
        return jsonOut_({ ok: true, data: getPmcKaizen_() });
      }, "pmcKaizens"),
      pmcSgas: /* @__PURE__ */ __name(function() {
        return jsonOut_({ ok: true, data: getPmcSga_() });
      }, "pmcSgas"),
      bootstrap: /* @__PURE__ */ __name(function() {
        return jsonOut_({ ok: true, data: getBootstrap_((e.parameter || {}).role || "") });
      }, "bootstrap")
    };
    return getters[a] ? getters[a]() : _compatGetFallback(e);
  }, "handleLegacyGet_");
  var _compatPostFallback = typeof _origHandleLegacyPost === "function" ? _origHandleLegacyPost : handleLegacyPost_;
  handleLegacyPost_ = /* @__PURE__ */ __name(function(body) {
    var a = String(body.action || "");
    var routes = {
      saveAnalitikConfig: /* @__PURE__ */ __name(function() {
        return saveAnalitikConfig_(body);
      }, "saveAnalitikConfig"),
      savePatrolCategoryConfig: /* @__PURE__ */ __name(function() {
        return savePatrolCategoryConfig_(body);
      }, "savePatrolCategoryConfig"),
      savePatrolGeneralChecklist: /* @__PURE__ */ __name(function() {
        return savePatrolGeneralChecklist_(body);
      }, "savePatrolGeneralChecklist"),
      seedPatrolTemplateBulk: /* @__PURE__ */ __name(function() {
        return seedPatrolTemplateBulk_(body);
      }, "seedPatrolTemplateBulk"),
      seedPiPersonnelMasterBulk: /* @__PURE__ */ __name(function() {
        return seedPiPersonnelMasterBulk_(body);
      }, "seedPiPersonnelMasterBulk"),
      saveGeneralReport: /* @__PURE__ */ __name(function() {
        return saveGeneralReport_(body.report, body.pdfFile);
      }, "saveGeneralReport"),
      deleteGeneralReport: /* @__PURE__ */ __name(function() {
        return deleteGeneralReport_(body.id);
      }, "deleteGeneralReport"),
      savePredictiveReport: /* @__PURE__ */ __name(function() {
        return savePredictiveReport_(body.report, body.files);
      }, "savePredictiveReport"),
      deletePredictiveReport: /* @__PURE__ */ __name(function() {
        return deletePredictiveReport_(body.id);
      }, "deletePredictiveReport"),
      saveIpalReport: /* @__PURE__ */ __name(function() {
        return saveIpalReport_(body.report);
      }, "saveIpalReport"),
      deleteIpalReport: /* @__PURE__ */ __name(function() {
        return deleteIpalReport_(body.id);
      }, "deleteIpalReport"),
      saveRcaReport: /* @__PURE__ */ __name(function() {
        return saveRcaReport_(body.report);
      }, "saveRcaReport"),
      deleteRcaReport: /* @__PURE__ */ __name(function() {
        return deleteRcaReport_(body.id);
      }, "deleteRcaReport"),
      saveKbEntry: /* @__PURE__ */ __name(function() {
        return saveKbEntry_(body);
      }, "saveKbEntry"),
      deleteKbEntry: /* @__PURE__ */ __name(function() {
        return deleteKbEntry_(body);
      }, "deleteKbEntry"),
      saveDowntimeHistory: /* @__PURE__ */ __name(function() {
        return saveDowntimeHistory_(body);
      }, "saveDowntimeHistory"),
      saveKpiKerja: /* @__PURE__ */ __name(function() {
        return saveKpiKerja_(body);
      }, "saveKpiKerja"),
      deleteKpiKerja: /* @__PURE__ */ __name(function() {
        return deleteKpiKerja_(body);
      }, "deleteKpiKerja"),
      bulkImportKpiKerja: /* @__PURE__ */ __name(function() {
        return bulkImportKpiKerja_(body);
      }, "bulkImportKpiKerja"),
      seedKpiKerjaDefault: /* @__PURE__ */ __name(function() {
        return seedKpiKerjaDefault_(body);
      }, "seedKpiKerjaDefault"),
      seedKpiDepartmentExtraDefault: /* @__PURE__ */ __name(function() {
        return seedKpiDepartmentExtraDefault_(body);
      }, "seedKpiDepartmentExtraDefault"),
      saveMachineBreakdown: /* @__PURE__ */ __name(function() {
        return saveMachineBreakdown_(body);
      }, "saveMachineBreakdown"),
      deleteMachineBreakdown: /* @__PURE__ */ __name(function() {
        return deleteMachineBreakdown_(body);
      }, "deleteMachineBreakdown"),
      saveCorrectiveReport: /* @__PURE__ */ __name(function() {
        return saveCorrectiveReport_(body);
      }, "saveCorrectiveReport"),
      deleteCorrectiveReport: /* @__PURE__ */ __name(function() {
        return deleteCorrectiveReport_(body);
      }, "deleteCorrectiveReport"),
      saveEnergyUtility: /* @__PURE__ */ __name(function() {
        return saveEnergyUtility_(body);
      }, "saveEnergyUtility"),
      deleteEnergyUtility: /* @__PURE__ */ __name(function() {
        return deleteEnergyUtility_(body);
      }, "deleteEnergyUtility"),
      bulkImportEnergyUtility: /* @__PURE__ */ __name(function() {
        return bulkImportEnergyUtility_(body);
      }, "bulkImportEnergyUtility"),
      saveRecordYtd: /* @__PURE__ */ __name(function() {
        return saveRecordYtd_(body);
      }, "saveRecordYtd"),
      deleteRecordYtd: /* @__PURE__ */ __name(function() {
        return deleteRecordYtd_(body);
      }, "deleteRecordYtd"),
      bulkImportRecordYtd: /* @__PURE__ */ __name(function() {
        return bulkImportRecordYtd_(body);
      }, "bulkImportRecordYtd"),
      saveRunHourComparison: /* @__PURE__ */ __name(function() {
        return saveRunHourComparison_(body);
      }, "saveRunHourComparison"),
      deleteRunHourComparison: /* @__PURE__ */ __name(function() {
        return deleteRunHourComparison_(body);
      }, "deleteRunHourComparison"),
      bulkImportRunHourComparison: /* @__PURE__ */ __name(function() {
        return bulkImportRunHourComparison_(body);
      }, "bulkImportRunHourComparison"),
      saveEnergyCostToe: /* @__PURE__ */ __name(function() {
        return saveEnergyCostToe_(body);
      }, "saveEnergyCostToe"),
      deleteEnergyCostToe: /* @__PURE__ */ __name(function() {
        return deleteEnergyCostToe_(body);
      }, "deleteEnergyCostToe"),
      updateSparepartEta: /* @__PURE__ */ __name(function() {
        return updateSparepartEta_(body);
      }, "updateSparepartEta"),
      updateSparepartSap: /* @__PURE__ */ __name(function() {
        return updateSparepartSap_(body);
      }, "updateSparepartSap"),
      bulkUpdateSparepartSap: /* @__PURE__ */ __name(function() {
        return bulkUpdateSparepartSap_(body);
      }, "bulkUpdateSparepartSap"),
      saveSparepartWarehouse: /* @__PURE__ */ __name(function() {
        return saveSparepartWarehouse_(body);
      }, "saveSparepartWarehouse"),
      saveMeeting: /* @__PURE__ */ __name(function() {
        return saveMeeting_(body);
      }, "saveMeeting"),
      deleteMeeting: /* @__PURE__ */ __name(function() {
        return deleteMeeting_(body);
      }, "deleteMeeting"),
      saveMeetingAction: /* @__PURE__ */ __name(function() {
        return saveMeetingAction_(body);
      }, "saveMeetingAction"),
      deleteMeetingAction: /* @__PURE__ */ __name(function() {
        return deleteMeetingAction_(body);
      }, "deleteMeetingAction"),
      savePmcFactoryProject: /* @__PURE__ */ __name(function() {
        return savePmcType_("factory", body);
      }, "savePmcFactoryProject"),
      deletePmcFactoryProject: /* @__PURE__ */ __name(function() {
        return deletePmcType_("factory", body);
      }, "deletePmcFactoryProject"),
      savePmcKaizen: /* @__PURE__ */ __name(function() {
        return savePmcType_("kaizen", body);
      }, "savePmcKaizen"),
      deletePmcKaizen: /* @__PURE__ */ __name(function() {
        return deletePmcType_("kaizen", body);
      }, "deletePmcKaizen"),
      savePmcSga: /* @__PURE__ */ __name(function() {
        return savePmcType_("sga", body);
      }, "savePmcSga"),
      deletePmcSga: /* @__PURE__ */ __name(function() {
        return deletePmcType_("sga", body);
      }, "deletePmcSga"),
      addPmcProgressLog: /* @__PURE__ */ __name(function() {
        return addPmcProgressLog_(body);
      }, "addPmcProgressLog"),
      pmcAddProgressLog: /* @__PURE__ */ __name(function() {
        return addPmcProgressLog_(body);
      }, "pmcAddProgressLog"),
      pmcSaveProject: /* @__PURE__ */ __name(function() {
        return savePmcType_(body.type || "factory", body);
      }, "pmcSaveProject"),
      pmcDeleteProject: /* @__PURE__ */ __name(function() {
        return deletePmcType_(body.type || "factory", body);
      }, "pmcDeleteProject"),
      aiAnalyze: /* @__PURE__ */ __name(async function() {
        return await handleAiAnalyze_(body);
      }, "aiAnalyze"),
      groqFixTypo: /* @__PURE__ */ __name(async function() {
        return await handleGroqFixTypo_(body);
      }, "groqFixTypo"),
      groqKbEnrich: /* @__PURE__ */ __name(async function() {
        return await handleGroqKbEnrich_(body);
      }, "groqKbEnrich"),
      aiGroq: /* @__PURE__ */ __name(async function() {
        return await handleAiAnalyze_(body);
      }, "aiGroq"),
      aiInternetResearch: /* @__PURE__ */ __name(async function() {
        return await handleAiAnalyzeFreeform_(body);
      }, "aiInternetResearch"),
      aiKbEnrich: /* @__PURE__ */ __name(async function() {
        return await handleGroqKbEnrich_(body);
      }, "aiKbEnrich")
    };
    checkRateLimit_(a, body.actor || body.username || "anon");
    var lock = null;
    try {
      if (a !== "login" && a !== "logout") {
        lock = LockService.getDocumentLock();
        if (!lock.tryLock(3e4)) return jsonOut_({ ok: false, error: "BUSY: Sistem sedang memproses transaksi lain. Silakan coba kembali." });
      }
      return routes[a] ? routes[a]() : _compatPostFallback(body);
    } finally {
      if (lock) try {
        lock.releaseLock();
      } catch (e) {
      }
    }
  }, "handleLegacyPost_");
  ACTION_REGISTRY.prepareManifest = { permission: null, method: "GET", audit: false, idempotent: false };
  var preparationGetFallback_ = handleLegacyGet_;
  handleLegacyGet_ = /* @__PURE__ */ __name(function(e) {
    if (String(e.parameter.action) !== "prepareManifest") return preparationGetFallback_(e);
    var session = requireSession_(e.parameter.sessionToken || "");
    var actions = ["bootstrap", "list", "machines", "personil", "patrolChecklistTemplate", "predictiveReports", "generalReports", "ipalReports", "rcaReports", "kbEntries", "sparepartLokasi", "sparepartStatus", "sparepartSapStatus", "sparepartEta", "sparepartWarehouse", "sparepartOpname", "kpiKerjaList", "kpiDepartmentData", "machineBreakdownList", "recordYtdList", "runHourComparisonList", "energyCostToeList", "correctiveReportList", "energyUtilityList", "analitikConfig", "patrolCategoryConfig", "patrolGeneralChecklist", "piHardSkillStandard", "piHardSkillAssessments", "piSoftskillAssessments", "piPersonnelMaster", "pmcFactoryProjects", "pmcKaizens", "pmcSgas", "meetingList", "meetingActionList"];
    var allowed = actions.filter(function(action) {
      var reg = resolveAction_(action);
      if (!reg) throw new Error("UNKNOWN_ACTION: " + action);
      if (reg.permission) {
        try {
          requirePermission_(session.role, reg.permission);
        } catch (err) {
          return false;
        }
      }
      return true;
    });
    return jsonOut_({ ok: true, data: { actions: allowed, version: 1 } });
  }, "handleLegacyGet_");
  function appendCanonical_(sh, canonical, values) {
    var headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
    var map = {};
    canonical.forEach(function(h, i) {
      map[h] = values[i] === void 0 ? "" : values[i];
    });
    var aliases = { "Items JSON": "ItemsJSON", "Created At": "Timestamp", "Metode": "Sumber", "Status": "Status Manager" };
    sh.appendRow(headers.map(function(h) {
      return map[h] !== void 0 ? map[h] : map[aliases[h]] !== void 0 ? map[aliases[h]] : "";
    }));
  }
  __name(appendCanonical_, "appendCanonical_");
  function authorizeAI(body) {
    var reg = resolveAction_(body.action);
    if (!reg) throw { code: "UNKNOWN_ACTION", message: "Unknown AI action" };
    var session = requireSession_(body.sessionToken || "");
    body.actor = session.username;
    body.role = session.role;
    if (reg.permission) requirePermission_(session.role, reg.permission);
    if (String(body.action || "").indexOf("v4.") === 0) requireOmodos4Superadmin_(body);
    validatePayload_(body.action, body);
    if (body.action === "v4.aiAsk") {
      var q = String(body.query || "").trim();
      if (!q) throw { code: "VALIDATION_ERROR", message: "query wajib" };
      if (q.length > 4e3) throw { code: "VALIDATION_ERROR", message: "query terlalu panjang" };
      var allowedPurpose = ["ask", "machine", "shift", "morning-brief", "rca-draft", "kaizen-draft", "troubleshooting", "manual", "translate", "skeptic"];
      body.purpose = allowedPurpose.indexOf(String(body.purpose || "ask")) >= 0 ? String(body.purpose || "ask") : "ask";
      if (body.purpose === "translate") {
        body._v4Evidence = {
          query: q,
          evidence: [],
          confidence: "not-applicable",
          answer: "Layanan terjemahan membutuhkan model bahasa. Data internal OMODOS sengaja tidak digunakan untuk fitur ini.",
          assumptions: ["Terjemahan hanya memakai teks yang dimasukkan pengguna; tidak mencari Logbook, mesin, sparepart, KPI, atau data internal lain."],
          recommendation: "Periksa kembali istilah yang menyangkut keselamatan, spesifikasi, atau nama komponen."
        };
      } else if (body.purpose === "manual") {
        var manualMachine = String(body.machine || "").trim();
        if (!manualMachine) throw { code: "VALIDATION_ERROR", message: "machine wajib untuk Tanya Manual" };
        var passportRes = JSON.parse(OMODOS4.dispatch({ action: "v4.getMachinePassport", machine: manualMachine }).getContent());
        var passport = passportRes && passportRes.ok && passportRes.data ? passportRes.data : null;
        var manualEvidence = [];
        if (passport && passport.knowledge) {
          var manual = passport.knowledge.manual || {};
          if (manual.manualPdf || manual.reference || manual.sourceNote) {
            manualEvidence.push({
              sheet: "Master_Mesin",
              score: 10,
              machine: manualMachine,
              record: {
                "Nama Mesin": passport.identity && (passport.identity["Nama Mesin"] || passport.identity.name) || manualMachine,
                "Manual PDF URL": manual.manualPdf || "",
                "Link Manual/Referensi": manual.reference || "",
                "Keterangan Sumber": manual.sourceNote || ""
              }
            });
          }
          (Array.isArray(passport.knowledge.kb) ? passport.knowledge.kb : []).slice(0, 12).forEach(function(record) {
            manualEvidence.push({ sheet: "Knowledge_Base", score: 8, machine: manualMachine, record: record });
          });
        }
        body._v4Evidence = {
          query: q,
          machine: manualMachine,
          evidence: manualEvidence.slice(0, 12),
          confidence: manualEvidence.length ? "medium" : "low",
          answer: manualEvidence.length ? "Ditemukan referensi manual/pengetahuan untuk mesin " + manualMachine + ". Isi dokumen yang hanya berupa tautan belum dianggap telah dibaca." : "Belum ditemukan referensi manual atau pengetahuan untuk mesin " + manualMachine + ".",
          assumptions: ["Bukti dibatasi ke manual metadata dan Knowledge Base mesin terpilih.", "Tautan PDF/referensi bukan bukti bahwa isi dokumen sudah dibaca oleh model."],
          recommendation: "Bandingkan jawaban dengan manual atau artikel pengetahuan sumber sebelum mengikuti prosedur."
        };
      } else if (body.purpose === "shift" || body.purpose === "morning-brief") {
        var briefPreset = body.purpose === "shift" ? "previousShift" : "today";
        var changeRes = JSON.parse(OMODOS4.dispatch({ action: "v4.getWhatChanged", preset: briefPreset, machine: body.machine || "" }).getContent());
        var changes = changeRes && changeRes.ok && changeRes.data ? changeRes.data : null;
        var changeRange = changes && changes.range || {};
        var briefRes = JSON.parse(OMODOS4.dispatch({ action: "v4.getBrief", machine: body.machine || "", since: changeRange.since || body.since, until: changeRange.until || body.until }).getContent());
        var brief = briefRes && briefRes.ok && briefRes.data ? briefRes.data : null;
        var briefEvidence = [];
        if (brief && Array.isArray(brief.thingsToLookAt)) {
          brief.thingsToLookAt.slice(0, 8).forEach(function(item) {
            briefEvidence.push({
              sheet: "OMODOS_Brief",
              score: item.priority === "P0" ? 10 : item.priority === "P1" ? 8 : 5,
              machine: item.machine || body.machine || "",
              record: item
            });
          });
        }
        var changeEvidence = [];
        if (changes && Array.isArray(changes.categories)) {
          changes.categories.forEach(function(category) {
            (Array.isArray(category.latest) ? category.latest : []).slice(0, 3).forEach(function(record) {
              changeEvidence.push({
                sheet: category.sheet || ("OMODOS_Changes_" + (category.category || "data")),
                score: 7,
                machine: body.machine || "",
                record: record
              });
            });
          });
        }
        var combinedEvidence = briefEvidence.concat(changeEvidence).slice(0, 12);
        var rangeText = changeRange.since && changeRange.until ? String(changeRange.since).slice(0, 16) + " s.d. " + String(changeRange.until).slice(0, 16) : "periode yang dipilih";
        var contextText = body.purpose === "shift"
          ? "Ringkasan memakai shift sebelumnya" + (changeRange.shift ? " (" + changeRange.shift + ")" : "") + ", " + rangeText + "."
          : "Ringkasan memakai data hari ini, " + rangeText + ".";
        body._v4Evidence = {
          query: q,
          machine: body.machine || "",
          evidence: combinedEvidence,
          confidence: combinedEvidence.length ? "medium" : brief && brief.confidence || "low",
          answer: contextText + " " + (brief && Array.isArray(brief.summary) && brief.summary.length ? brief.summary.join(" ") : "Belum ada ringkasan operasional yang cukup untuk periode ini."),
          assumptions: [
            contextText,
            "Perubahan diambil dari catatan OMODOS yang bertanggal pada periode tersebut.",
            "Prioritas adalah bantuan triase dan tetap perlu diperiksa petugas."
          ],
          recommendation: combinedEvidence.length
            ? (body.purpose === "shift" ? "Teruskan masalah yang belum selesai dan perubahan penting ke shift berikutnya." : "Periksa item prioritas hari ini dan pastikan kondisi lapangan sudah tercatat.")
            : "Lengkapi catatan operasional bila kondisi lapangan belum tercermin di OMODOS."
        };
      } else {
        var ev = JSON.parse(OMODOS4.dispatch({ action: "v4.ask", query: q, machine: body.machine || "", since: body.since, until: body.until }).getContent());
        body._v4Evidence = ev && ev.ok ? ev.data : { query: q, evidence: [], confidence: "low", answer: "Belum ditemukan bukti internal." };
      }
    }
    checkRateLimit_(body.action, body.actor);
    return body;
  }
  __name(authorizeAI, "authorizeAI");
  async function executeV4Ai_(body) {
    var evidence = body._v4Evidence || { evidence: [], confidence: "low", answer: "Belum ditemukan evidence internal." };
    var sourceRows = (evidence.evidence || []).slice(0, 12).map(function(x) {
      return { source: x.sheet, score: x.score, record: x.record };
    });
    var purposes = {
      ask: "Jawab pertanyaan maintenance secara ringkas dan berdasarkan bukti data OMODOS.",
      machine: "Jelaskan kondisi mesin, pola, risiko, dan pemeriksaan manusia yang relevan berdasarkan bukti OMODOS.",
      shift: "Buat ringkasan pergantian shift: perubahan penting, masalah belum selesai, risiko, dan tindakan yang perlu diteruskan.",
      "morning-brief": "Buat ringkasan maintenance pagi yang singkat dan jelas tentang hal yang perlu ditindaklanjuti.",
      "rca-draft": "Buat draf RCA saja: fakta, dugaan akar masalah, bukti pendukung/kontra, pertanyaan verifikasi, dan langkah validasi. Jangan menyatakan akar penyebab sebagai kepastian.",
      "kaizen-draft": "Buat draf Kaizen: masalah, bukti, ide, perkiraan manfaat sebagai hipotesis, risiko, dan cara verifikasi. Jangan menyimpan apa pun.",
      troubleshooting: "Susun pemeriksaan bertahap: gejala \u2192 pemeriksaan \u2192 bukti \u2192 langkah berikutnya \u2192 kapan harus berhenti atau eskalasi.",
      manual: "Jelaskan hanya isi manual atau pengetahuan yang benar-benar tersedia sebagai bukti. Jangan mengarang isi dokumen yang belum dibaca.",
      translate: "Terjemahkan atau sederhanakan istilah maintenance tanpa mengubah makna teknis.",
      skeptic: "Periksa ulang asumsi: cari penjelasan lain, bukti yang masih kurang, dan hal yang harus diverifikasi manusia."
    };
    var prompt = [
      "PURPOSE: " + (purposes[body.purpose] || purposes.ask),
      "USER QUERY: " + String(body.query || ""),
      "INTERNAL OMODOS EVIDENCE (source of truth; do not invent missing fields):",
      JSON.stringify(sourceRows).slice(0, 14e3),
      "RULES:",
      "- Distinguish FACT, DERIVED METRIC, PATTERN, HYPOTHESIS, RECOMMENDATION.",
      "- Include WHY, evidence, assumptions, confidence, and alternative explanation where relevant.",
      "- Do not claim certainty about future failure.",
      "- Do not output session tokens, hashes, salts, API keys, or storage internals.",
      "- This is decision support only; human approval is required for any operational change."
    ].join("\n");
    var key = PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY");
    var generated = await handleAiAnalyzeFreeform_({ query: prompt, cases: [], localPatterns: [] }, key);
    var parsed = {};
    try {
      parsed = JSON.parse(generated.getContent());
    } catch (e) {
      parsed = { ok: false, error: "AI response parse failed" };
    }
    if (!parsed.ok) {
      return jsonOut_({ ok: true, data: {
        mode: "DETERMINISTIC_FALLBACK",
        purpose: body.purpose,
        summary: evidence.answer || "Evidence internal tersedia untuk review.",
        confidence: evidence.confidence || "low",
        evidence: evidence.evidence || [],
        assumptions: evidence.assumptions || [],
        recommendation: evidence.recommendation || "Review source evidence before action.",
        humanReviewRequired: true,
        providerStatus: "unavailable",
        providerError: String(parsed.error || "AI provider unavailable").slice(0, 500)
      } });
    }
    return jsonOut_({ ok: true, data: {
      mode: "GENERATIVE_WITH_INTERNAL_EVIDENCE",
      purpose: body.purpose,
      summary: parsed.data && parsed.data.summary || "",
      modelUsed: parsed.data && parsed.data.modelUsed || "",
      confidence: evidence.confidence || "low",
      evidence: evidence.evidence || [],
      assumptions: evidence.assumptions || [],
      humanReviewRequired: true,
      operationalWrite: "NONE",
      sourceOfTruth: "EXISTING_OMODOS"
    } });
  }
  __name(executeV4Ai_, "executeV4Ai_");
  async function executeAI(body) {
    if (body.action === "v4.aiAsk") return await executeV4Ai_(body);
    if (body.action === "groqFixTypo") return await handleGroqFixTypo_(body);
    if (body.action === "groqKbEnrich" || body.action === "aiKbEnrich") return await handleGroqKbEnrich_(body);
    if (body.action === "aiInternetResearch") return await handleAiAnalyzeFreeform_(body, PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY"));
    return await handleAiAnalyze_(body);
  }
  __name(executeAI, "executeAI");
  function auditAI(body, result) {
    var payload = body;
    if (body && body.action === "v4.aiAsk") {
      payload = { action: body.action, actor: body.actor, role: body.role, purpose: body.purpose, query: String(body.query || "").slice(0, 1e3), machine: body.machine || "", evidenceSources: (body._v4Evidence && body._v4Evidence.evidence || []).slice(0, 20).map(function(x) {
        return { sheet: x.sheet, score: x.score };
      }) };
    }
    writeAuditLog_(body.actor, body.role, body.action, String(body.action || "").indexOf("v4.") === 0 ? "OMODOS4" : "ai", "", null, payload, "", result.ok ? "success" : "failed");
  }
  __name(auditAI, "auditAI");
  function auditSystemEvent(event) {
    event = event || {};
    writeAuditLog_(event.actor || "", event.role || "", event.action || "system", event.entity || "system", event.entityId || "", null, event.payload || null, event.transactionId || "", event.status || "success");
  }
  __name(auditSystemEvent, "auditSystemEvent");
  return { doGet, doPost, registry: ACTION_REGISTRY, requireSession: requireSession_, hashPassword: hashPasswordV2_, createSession: createSession_, findUser: findUserRow_, authorizeAI, executeAI, auditAI, auditSystemEvent };
}
__name(createBackend, "createBackend");

// src/application.mjs
import { timingSafeEqual, createHash as createHash2 } from "node:crypto";
var json = /* @__PURE__ */ __name((v, status = 200) => new Response(JSON.stringify(v), { status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } }), "json");
var v4Status = /* @__PURE__ */ __name((error) => {
  const s = String(error || "");
  if (/AUTH_REQUIRED|SESSION_/i.test(s)) return 401;
  if (/FORBIDDEN/i.test(s)) return 403;
  if (/NOT_FOUND/i.test(s)) return 404;
  if (/CONFLICT|IDEMPOTENCY|MISMATCH/i.test(s)) return 409;
  if (/RATE_LIMIT/i.test(s)) return 429;
  if (/SERVER_ERROR/i.test(s)) return 500;
  return 400;
}, "v4Status");
var equal = /* @__PURE__ */ __name((a, b) => !!a && !!b && Buffer.byteLength(a) === Buffer.byteLength(b) && timingSafeEqual(Buffer.from(a), Buffer.from(b)), "equal");
var FILE_SESSION_COOKIE = "__Host-OMODOSFileSession";
var FILE_SESSION_MAX_AGE_SECONDS = 24 * 60 * 60;
var FILE_SESSION_MAX_TOKENS = 4;
function readCookieValue(request, name) {
  const raw = request.headers.get("Cookie") || "";
  for (const part of raw.split(";")) {
    const eq = part.indexOf("=");
    if (eq < 0) continue;
    if (part.slice(0, eq).trim() === name) return part.slice(eq + 1).trim();
  }
  return "";
}
__name(readCookieValue, "readCookieValue");
function fileSessionTokens(request) {
  const raw = readCookieValue(request, FILE_SESSION_COOKIE);
  if (!raw) return [];
  let decoded = raw;
  try { decoded = decodeURIComponent(raw); } catch {}
  return decoded.split("~").map((x) => x.trim()).filter(Boolean).slice(0, FILE_SESSION_MAX_TOKENS);
}
__name(fileSessionTokens, "fileSessionTokens");
function validFileSessionTokens(request, backend, extraToken) {
  const input = [extraToken || "", ...fileSessionTokens(request)].filter(Boolean);
  const out = [];
  for (const token of input) {
    if (out.includes(token)) continue;
    try { backend.requireSession(token); out.push(token); } catch {}
    if (out.length >= FILE_SESSION_MAX_TOKENS) break;
  }
  return out;
}
__name(validFileSessionTokens, "validFileSessionTokens");
function buildFileSessionCookie(request, backend, sessionToken) {
  const tokens = validFileSessionTokens(request, backend, sessionToken);
  const value = encodeURIComponent(tokens.join("~"));
  const maxAge = tokens.length ? FILE_SESSION_MAX_AGE_SECONDS : 0;
  return FILE_SESSION_COOKIE + "=" + value + "; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=" + maxAge;
}
__name(buildFileSessionCookie, "buildFileSessionCookie");
function requireFileSession(request, backend) {
  const tokens = fileSessionTokens(request);
  for (const token of tokens) {
    try { return backend.requireSession(token); } catch {}
  }
  throw { code: "AUTH_REQUIRED", message: "File session required" };
}
__name(requireFileSession, "requireFileSession");
var Application = class {
  static {
    __name(this, "Application");
  }
  constructor(state, env) {
    this.state = state;
    this.env = env;
    this.tail = Promise.resolve();
    this.rate = /* @__PURE__ */ new Map();
  }
  enqueue(fn) {
    const task = this.tail.then(fn);
    this.tail = task.catch(() => {
    });
    return task;
  }
  async fetch(request) {
    let body;
    if (request.method === "POST" && new URL(request.url).pathname === "/api") {
      if (Number(request.headers.get("Content-Length") || 0) > 50 * 1024 * 1024) return json({ ok: false, error: "UPLOAD_TOO_LARGE" }, 413);
      try {
        body = await request.json();
      } catch {
        return json({ ok: false, error: "VALIDATION_ERROR: Invalid JSON" }, 400);
      }
      if (["aiAnalyze", "aiGroq", "aiInternetResearch", "aiKbEnrich", "groqFixTypo", "groqKbEnrich", "v4.aiAsk"].includes(body.action)) return this.ai(request, body);
    }
    return this.enqueue(() => this.run(request, body));
  }
  init(request) {
    if (!this.store) {
      this.store = createStorage(this.state.storage.sql, this.env, new URL(request.url).origin);
      this.backend = createBackend(this.store.services, this.env);
    }
  }
  async ai(request, body) {
    try {
      const authorized = await this.enqueue(() => {
        this.init(request);
        if (this.store.services.PropertiesService.getScriptProperties().getProperty("MIGRATION_READY") !== "1") throw Error("DATABASE_NOT_IMPORTED");
        const token = (request.headers.get("Authorization") || "").replace(/^Bearer /, "");
        return this.backend.authorizeAI({ ...body, sessionToken: token || body.sessionToken });
      });
      const result = JSON.parse((await this.backend.executeAI(authorized)).getContent());
      await this.enqueue(() => {
        try {
          this.backend.auditAI(authorized, result);
          this.state.storage.transactionSync(() => this.store.commit());
        } catch (e) {
          this.store.rollback();
          throw e;
        }
      });
      return json(result);
    } catch (e) {
      const err = (e.code ? e.code + ": " : "") + (e.message || String(e));
      return json({ ok: false, error: err }, String(body && body.action || "").startsWith("v4.") ? v4Status(err) : 400);
    }
  }
  async run(request, parsedBody) {
    const url = new URL(request.url), sql = this.state.storage.sql;
    this.init(request);
    const store = this.store, backend = this.backend;
    const transact = /* @__PURE__ */ __name((fn) => this.state.storage.transactionSync(fn), "transact");
    try {
      if (url.pathname.startsWith("/api/setup/")) {
        if (request.method !== "POST") return json({ ok: false, error: "FORBIDDEN" }, 403);
        if (store.services.PropertiesService.getScriptProperties().getProperty("MIGRATION_READY") === "1") return json({ ok: false, error: "SETUP_CLOSED" }, 409);
        if (Number(request.headers.get("Content-Length") || 0) > 15e6) return json({ ok: false, error: "IMPORT_TOO_LARGE" }, 413);
        const body = await request.json();
        if (!equal(request.headers.get("X-Setup-Token"), this.env.SETUP_TOKEN)) return json({ ok: false, error: "FORBIDDEN" }, 403);
        if (url.pathname === "/api/setup/import") {
          if (typeof body.name !== "string" || !Array.isArray(body.rows) || body.rows.some((r) => !Array.isArray(r))) return json({ ok: false, error: "INVALID_IMPORT" }, 400);
          const hash = createHash2("sha256").update(encode(body.rows)).digest("hex");
          const key = "IMPORT_" + body.name;
          const prev = store.services.PropertiesService.getScriptProperties().getProperty(key);
          if (prev === hash) return json({ ok: true, reused: true });
          store.importSheet(body.name, body.rows);
          store.services.PropertiesService.getScriptProperties().setProperty(key, hash);
          transact(() => store.commit());
          return json({ ok: true, sheet: body.name, records: Math.max(0, body.rows.length - 1) });
        }
        if (url.pathname === "/api/setup/config") {
          if (!body.properties || typeof body.properties !== "object" || Array.isArray(body.properties) ||
              Object.keys(body.properties).some((key) => ![
                "FOLDER_Logbook Maintenance - Attachments",
                "KPI_DEPARTMENT_SOURCE_VERSION",
                "PATROL_CATEGORY_CONFIG",
                "PATROL_GENERAL_CHECKLIST"
              ].includes(key) || typeof body.properties[key] !== "string")) {
            return json({ ok: false, error: "INVALID_CONFIG_IMPORT" }, 400);
          }
          const props = store.services.PropertiesService.getScriptProperties();
          for (const [key, value] of Object.entries(body.properties)) props.setProperty(key, value);
          transact(() => store.commit());
          return json({ ok: true, count: Object.keys(body.properties).length });
        }
        if (url.pathname === "/api/setup/file") {
          if (typeof body.id !== "string" || !/^[a-zA-Z0-9_-]{1,128}$/.test(body.id) ||
              typeof body.name !== "string" || body.name.length > 255 ||
              typeof body.mime !== "string" || body.mime.length > 128 ||
              typeof body.base64 !== "string" || body.base64.length > 15e6 ||
              typeof body.sha256 !== "string" || !/^[a-f0-9]{64}$/.test(body.sha256)) {
            return json({ ok: false, error: "INVALID_FILE_IMPORT" }, 400);
          }
          const data = Buffer.from(body.base64, "base64");
          if (data.length > 10e6 || createHash2("sha256").update(data).digest("hex") !== body.sha256) return json({ ok: false, error: "FILE_HASH_MISMATCH" }, 400);
          const added = transact(() => store.importFile(body.id, body.name, body.mime, data));
          return json({ ok: true, file: body.id, bytes: data.length, reused: !added });
        }
        if (url.pathname === "/api/setup/finish") {
          const sheets = store.spreadsheet.getSheets();
          if (!Array.isArray(body.sheets) || body.sheets.length !== sheets.length) return json({ ok: false, error: "IMPORT_INCOMPLETE" }, 400);
          for (const item of body.sheets) {
            const s = store.spreadsheet.getSheetByName(item.name);
            if (!s || Math.max(0, s.getLastRow() - 1) !== item.rows) return json({ ok: false, error: "IMPORT_COUNT_MISMATCH: " + item.name }, 400);
          }
          if (!Array.isArray(body.files) || body.files.length !== store.listFiles().length ||
              body.files.some((item) => !store.listFiles().some((f) => f.id === item.id && f.size === item.size))) {
            return json({ ok: false, error: "FILE_IMPORT_INCOMPLETE" }, 400);
          }
          const users = store.spreadsheet.getSheetByName("Users");
          if (!users || users.getLastRow() < 2) return json({ ok: false, error: "USERS_REQUIRED" }, 400);
          const sessions = store.spreadsheet.getSheetByName("Sessions");
          if (sessions && sessions.getLastRow() > 1) {
            const headers = sessions.getRange(1, 1, 1, sessions.getLastColumn()).getValues()[0], col = headers.indexOf("RevokedAt");
            if (col >= 0) sessions.getRange(2, col + 1, sessions.getLastRow() - 1, 1).setValues(Array.from({ length: sessions.getLastRow() - 1 }, () => [/* @__PURE__ */ new Date()]));
          }
          store.services.PropertiesService.getScriptProperties().setProperty("MIGRATION_READY", "1");
          transact(() => store.commit());
          return json({ ok: true, ready: true });
        }
        return json({ ok: false, error: "NOT_FOUND" }, 404);
      }
      if (store.services.PropertiesService.getScriptProperties().getProperty("MIGRATION_READY") !== "1") return json({ ok: false, error: "DATABASE_NOT_IMPORTED: Administrator perlu mengimpor database." }, 503);
      if (url.pathname.startsWith("/files/")) {
        try {
          requireFileSession(request, backend);
        } catch {
          return json({ ok: false, error: "AUTH_REQUIRED: File session required" }, 401);
        }
        const f = store.file(url.pathname.slice(7));
        if (!f) return json({ ok: false, error: "FILE_NOT_FOUND" }, 404);
        const inline = /^(image\/(png|jpeg|gif|webp)|video\/|audio\/|application\/pdf)/.test(f.mime);
        const headers = { "Content-Type": f.mime, "Content-Length": String(f.size), "Accept-Ranges": "bytes", "Content-Disposition": `${inline ? "inline" : "attachment"}; filename*=UTF-8''${encodeURIComponent(f.name)}`, "Cache-Control": "private, no-store, max-age=0", "X-Content-Type-Options": "nosniff", "Content-Security-Policy": "sandbox; default-src 'none'" };
        const range = request.headers.get("Range");
        if (range) {
          const m = /^bytes=(\d*)-(\d*)$/.exec(range);
          let start = 0, end = f.size - 1;
          if (!m || !m[1] && !m[2]) return new Response(null, { status: 416, headers: { "Content-Range": "bytes */" + f.size } });
          if (m[1]) {
            start = Number(m[1]);
            if (m[2]) end = Math.min(end, Number(m[2]));
          } else start = Math.max(0, f.size - Number(m[2]));
          if (start > end || start >= f.size) return new Response(null, { status: 416, headers: { "Content-Range": "bytes */" + f.size } });
          headers["Content-Range"] = `bytes ${start}-${end}/${f.size}`;
          headers["Content-Length"] = String(end - start + 1);
          return new Response(f.data.subarray(start, end + 1), { status: 206, headers });
        }
        return new Response(request.method === "HEAD" ? null : f.data, { headers });
      }
      const token = (request.headers.get("Authorization") || "").replace(/^Bearer /, "");
      const backupAuth = /* @__PURE__ */ __name(() => {
        if (!token) return { response: json({ ok: false, error: "AUTH_REQUIRED" }, 401) };
        try {
          const session = backend.requireSession(token);
          if (session.role !== "Superadmin") return { response: json({ ok: false, error: "FORBIDDEN" }, 403) };
          return { session };
        } catch (e) {
          return { response: json({ ok: false, error: (e.code ? e.code + ": " : "") + (e.message || String(e)) }, 401) };
        }
      }, "backupAuth");
      if (url.pathname === "/api/backup/config") {
        if (request.method !== "GET") return json({ ok: false, error: "METHOD_NOT_ALLOWED" }, 405);
        const auth = backupAuth();
        if (auth.response) return auth.response;
        const all = store.listProperties();
        const sensitive = /password|secret|token|api[_-]?key|gemini|groq|setup/i;
        const safe = all.filter((x) => !sensitive.test(x.key));
        const excludedKeys = all.filter((x) => sensitive.test(x.key)).map((x) => x.key);
        backend.auditSystemEvent({
          actor: auth.session.username,
          role: auth.session.role,
          action: "backup.config.list",
          entity: "SYSTEM_BACKUP",
          payload: { safePropertyCount: safe.length, excludedPropertyCount: excludedKeys.length }
        });
        transact(() => store.commit());
        return json({ ok: true, data: {
          properties: Object.fromEntries(safe.map((x) => [x.key, x.value])),
          excludedKeys,
          secretsIncluded: false,
          note: "Sensitive properties are intentionally excluded and must be restored through approved secret management."
        } });
      }
      if (url.pathname === "/api/backup/files") {
        if (request.method !== "GET") return json({ ok: false, error: "METHOD_NOT_ALLOWED" }, 405);
        const auth = backupAuth();
        if (auth.response) return auth.response;
        const files = store.listFiles();
        backend.auditSystemEvent({
          actor: auth.session.username,
          role: auth.session.role,
          action: "backup.files.list",
          entity: "SYSTEM_BACKUP",
          payload: { fileCount: files.length, totalBytes: files.reduce((n, x) => n + x.size, 0) }
        });
        transact(() => store.commit());
        return json({ ok: true, data: { files, fileCount: files.length, totalBytes: files.reduce((n, x) => n + x.size, 0) } });
      }
      if (url.pathname.startsWith("/api/backup/file/")) {
        if (!["GET", "HEAD"].includes(request.method)) return json({ ok: false, error: "METHOD_NOT_ALLOWED" }, 405);
        const auth = backupAuth();
        if (auth.response) return auth.response;
        let id = "";
        try {
          id = decodeURIComponent(url.pathname.slice("/api/backup/file/".length));
        } catch {
          return json({ ok: false, error: "INVALID_FILE_ID" }, 400);
        }
        const f = store.file(id);
        if (!f) return json({ ok: false, error: "FILE_NOT_FOUND" }, 404);
        return new Response(request.method === "HEAD" ? null : f.data, { headers: {
          "Content-Type": f.mime || "application/octet-stream",
          "Content-Length": String(f.size),
          "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(f.name || "attachment")}`,
          "Cache-Control": "no-store",
          "X-Content-Type-Options": "nosniff"
        } });
      }
      if (url.pathname === "/api/backup") {
        if (request.method !== "GET") return json({ ok: false, error: "METHOD_NOT_ALLOWED" }, 405);
        const auth = backupAuth();
        if (auth.response) return auth.response;
        const inventory = store.spreadsheet.getSheets().map((s) => ({ name: s.getName(), rows: s.getLastRow() }));
        const fileInventory = store.listFiles();
        backend.auditSystemEvent({
          actor: auth.session.username,
          role: auth.session.role,
          action: "backup.download",
          entity: "SYSTEM_BACKUP",
          payload: { sheetCount: inventory.length, totalRows: inventory.reduce((n, x) => n + x.rows, 0), fileCount: fileInventory.length, totalFileBytes: fileInventory.reduce((n, x) => n + x.size, 0) }
        });
        transact(() => store.commit());
        const data = Object.fromEntries(store.spreadsheet.getSheets().map((s) => [s.getName(), s.getDataRange().getValues()]));
        return new Response(encode(data), { headers: {
          "Content-Type": "application/json",
          "Content-Disposition": 'attachment; filename="maintenance-backup.json"',
          "Cache-Control": "no-store",
          "X-Content-Type-Options": "nosniff",
          "X-Backup-File-Count": String(fileInventory.length),
          "X-Backup-File-Bytes": String(fileInventory.reduce((n, x) => n + x.size, 0))
        } });
      }
      if (url.pathname !== "/api") return json({ ok: false, error: "NOT_FOUND" }, 404);
      if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: { Allow: "GET, POST, OPTIONS" } });
      let result;
      if (request.method === "POST") {
        if (Number(request.headers.get("Content-Length") || 0) > 50 * 1024 * 1024) return json({ ok: false, error: "UPLOAD_TOO_LARGE" }, 413);
        const body = parsedBody || await request.json();
        if (body.action === "login") {
          const key = request.headers.get("CF-Connecting-IP") || "local", now = Date.now();
          const r = this.rate.get(key) || { start: now, n: 0 };
          if (now - r.start > 6e4) {
            r.start = now;
            r.n = 0;
          }
          r.n++;
          this.rate.set(key, r);
          if (r.n > 20) return json({ ok: false, error: "RATE_LIMITED: Tunggu satu menit." }, 429);
          if (this.rate.size > 1e3) {
            for (const [k, v] of this.rate) if (now - v.start > 6e4) this.rate.delete(k);
          }
        }
        result = await backend.doPost({ body: { ...body, sessionToken: token || body.sessionToken } });
      } else if (request.method === "GET") {
        const params = Object.fromEntries(url.searchParams);
        params.sessionToken = token || params.sessionToken || "";
        backend.requireSession(params.sessionToken);
        result = backend.doGet({ parameter: params });
      } else return json({ ok: false, error: "METHOD_NOT_ALLOWED" }, 405);
      const parsed = JSON.parse(result.getContent());
      if (parsed.ok) transact(() => store.commit());
      else store.rollback();
      const requestedAction = request.method === "POST" ? parsedBody && parsedBody.action || "" : url.searchParams.get("action") || "";
      const response = json(parsed, !parsed.ok && String(requestedAction).startsWith("v4.") ? v4Status(parsed.error) : 200);
      if (request.method === "POST" && parsed.ok && requestedAction === "login" && parsed.sessionToken) {
        response.headers.append("Set-Cookie", buildFileSessionCookie(request, backend, parsed.sessionToken));
      } else if (request.method === "POST" && parsed.ok && requestedAction === "logout") {
        response.headers.append("Set-Cookie", buildFileSessionCookie(request, backend, ""));
      }
      return response;
    } catch (e) {
      store.rollback();
      const err = (e.code ? e.code + ": " : "") + (e.message || String(e));
      const requestedAction = request.method === "POST" ? parsedBody && parsedBody.action || "" : url.searchParams.get("action") || "";
      return json({ ok: false, error: err }, String(requestedAction).startsWith("v4.") ? v4Status(err) : 400);
    }
  }
};

// src/worker.mjs
var MaintenanceStore = class extends DurableObject {
  static {
    __name(this, "MaintenanceStore");
  }
  constructor(ctx, env) {
    super(ctx, env);
    this.application = new Application(ctx, env);
  }
  fetch(request) {
    return this.application.fetch(request);
  }
};
var worker_default = { async fetch(request, env) {
  const url = new URL(request.url);
  if (url.pathname === "/api" || url.pathname.startsWith("/api/") || url.pathname.startsWith("/files/")) return env.MAINTENANCE.get(env.MAINTENANCE.idFromName("maintenance-production")).fetch(request);
  return env.ASSETS.fetch(request);
} };
export {
  MaintenanceStore,
  worker_default as default
};
//# sourceMappingURL=worker.js.map