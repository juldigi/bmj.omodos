# Candidate API Routing Audit

## Candidate metadata

- version: c92c749a-0494-4243-9497-0f3f180c7cfc
- number: 83
- main_module: worker.js
- migration_tag: v1
- migrations: null
- assets config: {"html_handling": "auto-trailing-slash", "not_found_handling": "none", "run_worker_first": ["/api", "/api/*", "/files/*"]}
- bindings: [{"name": "ASSETS", "type": "assets"}, {"class_name": "MaintenanceStore", "name": "MAINTENANCE", "namespace_id": "b4c352e7351a45b186b26d25fe7bdb37", "type": "durable_object_namespace"}]

## Backend routing contexts

### new URL(request.url) — 4
~~~text
09306:   enqueue(fn) {
09307:     const task = this.tail.then(fn);
09308:     this.tail = task.catch(() => {
09309:     });
09310:     return task;
09311:   }
09312:   async fetch(request) {
09313:     let body;
09314:     if (request.method === "POST" && new URL(request.url).pathname === "/api") {
09315:       if (Number(request.headers.get("Content-Length") || 0) > 50 * 1024 * 1024) return json({ ok: false, error: "UPLOAD_TOO_LARGE" }, 413);
09316:       try {
09317:         body = await request.json();
09318:       } catch {
09319:         return json({ ok: false, error: "VALIDATION_ERROR: Invalid JSON" }, 400);
09320:       }
09321:       if (["aiAnalyze", "aiGroq", "aiInternetResearch", "aiKbEnrich", "groqFixTypo", "groqKbEnrich", "v4.aiAsk"].includes(body.action)) return this.ai(request, body);
09322:     }
09323:     return this.enqueue(() => this.run(request, body));
09324:   }
09325:   init(request) {
09326:     if (!this.store) {
09327:       this.store = createStorage(this.state.storage.sql, this.env, new URL(request.url).origin);
09328:       this.backend = createBackend(this.store.services, this.env);
09329:     }
09330:   }
09331:   async ai(request, body) {
09332:     try {
09333:       const authorized = await this.enqueue(() => {
09334:         this.init(request);
09335:         if (this.store.services.PropertiesService.getScriptProperties().getProperty("MIGRATION_READY") !== "1") throw Error("DATABASE_NOT_IMPORTED");
~~~

~~~text
09319:         return json({ ok: false, error: "VALIDATION_ERROR: Invalid JSON" }, 400);
09320:       }
09321:       if (["aiAnalyze", "aiGroq", "aiInternetResearch", "aiKbEnrich", "groqFixTypo", "groqKbEnrich", "v4.aiAsk"].includes(body.action)) return this.ai(request, body);
09322:     }
09323:     return this.enqueue(() => this.run(request, body));
09324:   }
09325:   init(request) {
09326:     if (!this.store) {
09327:       this.store = createStorage(this.state.storage.sql, this.env, new URL(request.url).origin);
09328:       this.backend = createBackend(this.store.services, this.env);
09329:     }
09330:   }
09331:   async ai(request, body) {
09332:     try {
09333:       const authorized = await this.enqueue(() => {
09334:         this.init(request);
09335:         if (this.store.services.PropertiesService.getScriptProperties().getProperty("MIGRATION_READY") !== "1") throw Error("DATABASE_NOT_IMPORTED");
09336:         const token = (request.headers.get("Authorization") || "").replace(/^Bearer /, "");
09337:         return this.backend.authorizeAI({ ...body, sessionToken: token || body.sessionToken });
09338:       });
09339:       const result = JSON.parse((await this.backend.executeAI(authorized)).getContent());
09340:       await this.enqueue(() => {
09341:         try {
09342:           this.backend.auditAI(authorized, result);
09343:           this.state.storage.transactionSync(() => this.store.commit());
09344:         } catch (e) {
09345:           this.store.rollback();
09346:           throw e;
09347:         }
09348:       });
~~~

~~~text
09348:       });
09349:       return json(result);
09350:     } catch (e) {
09351:       const err = (e.code ? e.code + ": " : "") + (e.message || String(e));
09352:       return json({ ok: false, error: err }, String(body && body.action || "").startsWith("v4.") ? v4Status(err) : 400);
09353:     }
09354:   }
09355:   async run(request, parsedBody) {
09356:     const url = new URL(request.url), sql = this.state.storage.sql;
09357:     this.init(request);
09358:     const store = this.store, backend = this.backend;
09359:     const transact = /* @__PURE__ */ __name((fn) => this.state.storage.transactionSync(fn), "transact");
09360:     try {
09361:       if (url.pathname.startsWith("/api/setup/")) {
09362:         if (request.method !== "POST" || !equal(request.headers.get("X-Setup-Token"), this.env.SETUP_TOKEN)) return json({ ok: false, error: "FORBIDDEN" }, 403);
09363:         if (store.services.PropertiesService.getScriptProperties().getProperty("MIGRATION_READY") === "1") return json({ ok: false, error: "SETUP_CLOSED" }, 409);
09364:         const body = await request.json();
09365:         if (url.pathname === "/api/setup/import") {
09366:           if (typeof body.name !== "string" || !Array.isArray(body.rows) || body.rows.some((r) => !Array.isArray(r))) return json({ ok: false, error: "INVALID_IMPORT" }, 400);
09367:           const hash = createHash2("sha256").update(encode(body.rows)).digest("hex");
09368:           const key = "IMPORT_" + body.name;
09369:           const prev = store.services.PropertiesService.getScriptProperties().getProperty(key);
09370:           if (prev === hash) return json({ ok: true, reused: true });
09371:           store.importSheet(body.name, body.rows);
09372:           store.services.PropertiesService.getScriptProperties().setProperty(key, hash);
09373:           transact(() => store.commit());
09374:           return json({ ok: true, sheet: body.name, records: Math.max(0, body.rows.length - 1) });
09375:         }
09376:         if (url.pathname === "/api/setup/finish") {
09377:           const sheets = store.spreadsheet.getSheets();
~~~

~~~text
09558:     super(ctx, env);
09559:     this.application = new Application(ctx, env);
09560:   }
09561:   fetch(request) {
09562:     return this.application.fetch(request);
09563:   }
09564: };
09565: var worker_default = { async fetch(request, env) {
09566:   const url = new URL(request.url);
09567:   if (url.pathname === "/api" || url.pathname.startsWith("/api/") || url.pathname.startsWith("/files/")) return env.MAINTENANCE.get(env.MAINTENANCE.idFromName("maintenance-production")).fetch(request);
09568:   return env.ASSETS.fetch(request);
09569: } };
09570: export {
09571:   MaintenanceStore,
09572:   worker_default as default
09573: };
09574: //# sourceMappingURL=worker.js.map
~~~

### .pathname — 13
~~~text
09353:     }
09354:   }
09355:   async run(request, parsedBody) {
09356:     const url = new URL(request.url), sql = this.state.storage.sql;
09357:     this.init(request);
09358:     const store = this.store, backend = this.backend;
09359:     const transact = /* @__PURE__ */ __name((fn) => this.state.storage.transactionSync(fn), "transact");
09360:     try {
09361:       if (url.pathname.startsWith("/api/setup/")) {
09362:         if (request.method !== "POST" || !equal(request.headers.get("X-Setup-Token"), this.env.SETUP_TOKEN)) return json({ ok: false, error: "FORBIDDEN" }, 403);
09363:         if (store.services.PropertiesService.getScriptProperties().getProperty("MIGRATION_READY") === "1") return json({ ok: false, error: "SETUP_CLOSED" }, 409);
09364:         const body = await request.json();
09365:         if (url.pathname === "/api/setup/import") {
09366:           if (typeof body.name !== "string" || !Array.isArray(body.rows) || body.rows.some((r) => !Array.isArray(r))) return json({ ok: false, error: "INVALID_IMPORT" }, 400);
09367:           const hash = createHash2("sha256").update(encode(body.rows)).digest("hex");
09368:           const key = "IMPORT_" + body.name;
09369:           const prev = store.services.PropertiesService.getScriptProperties().getProperty(key);
09370:           if (prev === hash) return json({ ok: true, reused: true });
09371:           store.importSheet(body.name, body.rows);
09372:           store.services.PropertiesService.getScriptProperties().setProperty(key, hash);
09373:           transact(() => store.commit());
09374:           return json({ ok: true, sheet: body.name, records: Math.max(0, body.rows.length - 1) });
09375:         }
09376:         if (url.pathname === "/api/setup/finish") {
09377:           const sheets = store.spreadsheet.getSheets();
09378:           if (!Array.isArray(body.sheets) || body.sheets.length !== sheets.length) return json({ ok: false, error: "IMPORT_INCOMPLETE" }, 400);
09379:           for (const item of body.sheets) {
09380:             const s = store.spreadsheet.getSheetByName(item.name);
09381:             if (!s || Math.max(0, s.getLastRow() - 1) !== item.rows) return json({ ok: false, error: "IMPORT_COUNT_MISMATCH: " + item.name }, 400);
09382:           }
~~~

~~~text
09357:     this.init(request);
09358:     const store = this.store, backend = this.backend;
09359:     const transact = /* @__PURE__ */ __name((fn) => this.state.storage.transactionSync(fn), "transact");
09360:     try {
09361:       if (url.pathname.startsWith("/api/setup/")) {
09362:         if (request.method !== "POST" || !equal(request.headers.get("X-Setup-Token"), this.env.SETUP_TOKEN)) return json({ ok: false, error: "FORBIDDEN" }, 403);
09363:         if (store.services.PropertiesService.getScriptProperties().getProperty("MIGRATION_READY") === "1") return json({ ok: false, error: "SETUP_CLOSED" }, 409);
09364:         const body = await request.json();
09365:         if (url.pathname === "/api/setup/import") {
09366:           if (typeof body.name !== "string" || !Array.isArray(body.rows) || body.rows.some((r) => !Array.isArray(r))) return json({ ok: false, error: "INVALID_IMPORT" }, 400);
09367:           const hash = createHash2("sha256").update(encode(body.rows)).digest("hex");
09368:           const key = "IMPORT_" + body.name;
09369:           const prev = store.services.PropertiesService.getScriptProperties().getProperty(key);
09370:           if (prev === hash) return json({ ok: true, reused: true });
09371:           store.importSheet(body.name, body.rows);
09372:           store.services.PropertiesService.getScriptProperties().setProperty(key, hash);
09373:           transact(() => store.commit());
09374:           return json({ ok: true, sheet: body.name, records: Math.max(0, body.rows.length - 1) });
09375:         }
09376:         if (url.pathname === "/api/setup/finish") {
09377:           const sheets = store.spreadsheet.getSheets();
09378:           if (!Array.isArray(body.sheets) || body.sheets.length !== sheets.length) return json({ ok: false, error: "IMPORT_INCOMPLETE" }, 400);
09379:           for (const item of body.sheets) {
09380:             const s = store.spreadsheet.getSheetByName(item.name);
09381:             if (!s || Math.max(0, s.getLastRow() - 1) !== item.rows) return json({ ok: false, error: "IMPORT_COUNT_MISMATCH: " + item.name }, 400);
09382:           }
09383:           const users = store.spreadsheet.getSheetByName("Users");
09384:           if (!users || users.getLastRow() < 2) return json({ ok: false, error: "USERS_REQUIRED" }, 400);
09385:           const sessions = store.spreadsheet.getSheetByName("Sessions");
09386:           if (sessions && sessions.getLastRow() > 1) {
~~~

~~~text
09368:           const key = "IMPORT_" + body.name;
09369:           const prev = store.services.PropertiesService.getScriptProperties().getProperty(key);
09370:           if (prev === hash) return json({ ok: true, reused: true });
09371:           store.importSheet(body.name, body.rows);
09372:           store.services.PropertiesService.getScriptProperties().setProperty(key, hash);
09373:           transact(() => store.commit());
09374:           return json({ ok: true, sheet: body.name, records: Math.max(0, body.rows.length - 1) });
09375:         }
09376:         if (url.pathname === "/api/setup/finish") {
09377:           const sheets = store.spreadsheet.getSheets();
09378:           if (!Array.isArray(body.sheets) || body.sheets.length !== sheets.length) return json({ ok: false, error: "IMPORT_INCOMPLETE" }, 400);
09379:           for (const item of body.sheets) {
09380:             const s = store.spreadsheet.getSheetByName(item.name);
09381:             if (!s || Math.max(0, s.getLastRow() - 1) !== item.rows) return json({ ok: false, error: "IMPORT_COUNT_MISMATCH: " + item.name }, 400);
09382:           }
09383:           const users = store.spreadsheet.getSheetByName("Users");
09384:           if (!users || users.getLastRow() < 2) return json({ ok: false, error: "USERS_REQUIRED" }, 400);
09385:           const sessions = store.spreadsheet.getSheetByName("Sessions");
09386:           if (sessions && sessions.getLastRow() > 1) {
09387:             const headers = sessions.getRange(1, 1, 1, sessions.getLastColumn()).getValues()[0], col = headers.indexOf("RevokedAt");
09388:             if (col >= 0) sessions.getRange(2, col + 1, sessions.getLastRow() - 1, 1).setValues(Array.from({ length: sessions.getLastRow() - 1 }, () => [/* @__PURE__ */ new Date()]));
09389:           }
09390:           store.services.PropertiesService.getScriptProperties().setProperty("MIGRATION_READY", "1");
09391:           transact(() => store.commit());
09392:           return json({ ok: true, ready: true });
09393:         }
09394:         return json({ ok: false, error: "NOT_FOUND" }, 404);
09395:       }
09396:       if (store.services.PropertiesService.getScriptProperties().getProperty("MIGRATION_READY") !== "1") return json({ ok: false, error: "DATABASE_NOT_IMPORTED: Administrator perlu mengimpor database." }, 503);
09397:       if (url.pathname.startsWith("/files/")) {
~~~

~~~text
09389:           }
09390:           store.services.PropertiesService.getScriptProperties().setProperty("MIGRATION_READY", "1");
09391:           transact(() => store.commit());
09392:           return json({ ok: true, ready: true });
09393:         }
09394:         return json({ ok: false, error: "NOT_FOUND" }, 404);
09395:       }
09396:       if (store.services.PropertiesService.getScriptProperties().getProperty("MIGRATION_READY") !== "1") return json({ ok: false, error: "DATABASE_NOT_IMPORTED: Administrator perlu mengimpor database." }, 503);
09397:       if (url.pathname.startsWith("/files/")) {
09398:         const f = store.file(url.pathname.slice(7));
09399:         if (!f) return json({ ok: false, error: "FILE_NOT_FOUND" }, 404);
09400:         const inline = /^(image\/(png|jpeg|gif|webp)|video\/|audio\/|application\/pdf)/.test(f.mime);
09401:         const headers = { "Content-Type": f.mime, "Content-Length": String(f.size), "Accept-Ranges": "bytes", "Content-Disposition": `${inline ? "inline" : "attachment"}; filename*=UTF-8''${encodeURIComponent(f.name)}`, "Cache-Control": "private, max-age=3600", "X-Content-Type-Options": "nosniff", "Content-Security-Policy": "sandbox; default-src 'none'" };
09402:         const range = request.headers.get("Range");
09403:         if (range) {
09404:           const m = /^bytes=(\d*)-(\d*)$/.exec(range);
09405:           let start = 0, end = f.size - 1;
09406:           if (!m || !m[1] && !m[2]) return new Response(null, { status: 416, headers: { "Content-Range": "bytes */" + f.size } });
09407:           if (m[1]) {
09408:             start = Number(m[1]);
09409:             if (m[2]) end = Math.min(end, Number(m[2]));
09410:           } else start = Math.max(0, f.size - Number(m[2]));
09411:           if (start > end || start >= f.size) return new Response(null, { status: 416, headers: { "Content-Range": "bytes */" + f.size } });
09412:           headers["Content-Range"] = `bytes ${start}-${end}/${f.size}`;
09413:           headers["Content-Length"] = String(end - start + 1);
09414:           return new Response(f.data.subarray(start, end + 1), { status: 206, headers });
09415:         }
09416:         return new Response(request.method === "HEAD" ? null : f.data, { headers });
09417:       }
09418:       const token = (request.headers.get("Authorization") || "").replace(/^Bearer /, "");
~~~

~~~text
09390:           store.services.PropertiesService.getScriptProperties().setProperty("MIGRATION_READY", "1");
09391:           transact(() => store.commit());
09392:           return json({ ok: true, ready: true });
09393:         }
09394:         return json({ ok: false, error: "NOT_FOUND" }, 404);
09395:       }
09396:       if (store.services.PropertiesService.getScriptProperties().getProperty("MIGRATION_READY") !== "1") return json({ ok: false, error: "DATABASE_NOT_IMPORTED: Administrator perlu mengimpor database." }, 503);
09397:       if (url.pathname.startsWith("/files/")) {
09398:         const f = store.file(url.pathname.slice(7));
09399:         if (!f) return json({ ok: false, error: "FILE_NOT_FOUND" }, 404);
09400:         const inline = /^(image\/(png|jpeg|gif|webp)|video\/|audio\/|application\/pdf)/.test(f.mime);
09401:         const headers = { "Content-Type": f.mime, "Content-Length": String(f.size), "Accept-Ranges": "bytes", "Content-Disposition": `${inline ? "inline" : "attachment"}; filename*=UTF-8''${encodeURIComponent(f.name)}`, "Cache-Control": "private, max-age=3600", "X-Content-Type-Options": "nosniff", "Content-Security-Policy": "sandbox; default-src 'none'" };
09402:         const range = request.headers.get("Range");
09403:         if (range) {
09404:           const m = /^bytes=(\d*)-(\d*)$/.exec(range);
09405:           let start = 0, end = f.size - 1;
09406:           if (!m || !m[1] && !m[2]) return new Response(null, { status: 416, headers: { "Content-Range": "bytes */" + f.size } });
09407:           if (m[1]) {
09408:             start = Number(m[1]);
09409:             if (m[2]) end = Math.min(end, Number(m[2]));
09410:           } else start = Math.max(0, f.size - Number(m[2]));
09411:           if (start > end || start >= f.size) return new Response(null, { status: 416, headers: { "Content-Range": "bytes */" + f.size } });
09412:           headers["Content-Range"] = `bytes ${start}-${end}/${f.size}`;
09413:           headers["Content-Length"] = String(end - start + 1);
09414:           return new Response(f.data.subarray(start, end + 1), { status: 206, headers });
09415:         }
09416:         return new Response(request.method === "HEAD" ? null : f.data, { headers });
09417:       }
09418:       const token = (request.headers.get("Authorization") || "").replace(/^Bearer /, "");
09419:       const backupAuth = /* @__PURE__ */ __name(() => {
~~~

~~~text
09421:         try {
09422:           const session = backend.requireSession(token);
09423:           if (session.role !== "Superadmin") return { response: json({ ok: false, error: "FORBIDDEN" }, 403) };
09424:           return { session };
09425:         } catch (e) {
09426:           return { response: json({ ok: false, error: (e.code ? e.code + ": " : "") + (e.message || String(e)) }, 401) };
09427:         }
09428:       }, "backupAuth");
09429:       if (url.pathname === "/api/backup/config") {
09430:         if (request.method !== "GET") return json({ ok: false, error: "METHOD_NOT_ALLOWED" }, 405);
09431:         const auth = backupAuth();
09432:         if (auth.response) return auth.response;
09433:         const all = store.listProperties();
09434:         const sensitive = /password|secret|token|api[_-]?key|gemini|groq|setup/i;
09435:         const safe = all.filter((x) => !sensitive.test(x.key));
09436:         const excludedKeys = all.filter((x) => sensitive.test(x.key)).map((x) => x.key);
09437:         backend.auditSystemEvent({
09438:           actor: auth.session.username,
09439:           role: auth.session.role,
09440:           action: "backup.config.list",
09441:           entity: "SYSTEM_BACKUP",
09442:           payload: { safePropertyCount: safe.length, excludedPropertyCount: excludedKeys.length }
09443:         });
09444:         transact(() => store.commit());
09445:         return json({ ok: true, data: {
09446:           properties: Object.fromEntries(safe.map((x) => [x.key, x.value])),
09447:           excludedKeys,
09448:           secretsIncluded: false,
09449:           note: "Sensitive properties are intentionally excluded and must be restored through approved secret management."
09450:         } });
~~~

~~~text
09444:         transact(() => store.commit());
09445:         return json({ ok: true, data: {
09446:           properties: Object.fromEntries(safe.map((x) => [x.key, x.value])),
09447:           excludedKeys,
09448:           secretsIncluded: false,
09449:           note: "Sensitive properties are intentionally excluded and must be restored through approved secret management."
09450:         } });
09451:       }
09452:       if (url.pathname === "/api/backup/files") {
09453:         if (request.method !== "GET") return json({ ok: false, error: "METHOD_NOT_ALLOWED" }, 405);
09454:         const auth = backupAuth();
09455:         if (auth.response) return auth.response;
09456:         const files = store.listFiles();
09457:         backend.auditSystemEvent({
09458:           actor: auth.session.username,
09459:           role: auth.session.role,
09460:           action: "backup.files.list",
09461:           entity: "SYSTEM_BACKUP",
09462:           payload: { fileCount: files.length, totalBytes: files.reduce((n, x) => n + x.size, 0) }
09463:         });
09464:         transact(() => store.commit());
09465:         return json({ ok: true, data: { files, fileCount: files.length, totalBytes: files.reduce((n, x) => n + x.size, 0) } });
09466:       }
09467:       if (url.pathname.startsWith("/api/backup/file/")) {
09468:         if (!["GET", "HEAD"].includes(request.method)) return json({ ok: false, error: "METHOD_NOT_ALLOWED" }, 405);
09469:         const auth = backupAuth();
09470:         if (auth.response) return auth.response;
09471:         let id = "";
09472:         try {
09473:           id = decodeURIComponent(url.pathname.slice("/api/backup/file/".length));
~~~

~~~text
09459:           role: auth.session.role,
09460:           action: "backup.files.list",
09461:           entity: "SYSTEM_BACKUP",
09462:           payload: { fileCount: files.length, totalBytes: files.reduce((n, x) => n + x.size, 0) }
09463:         });
09464:         transact(() => store.commit());
09465:         return json({ ok: true, data: { files, fileCount: files.length, totalBytes: files.reduce((n, x) => n + x.size, 0) } });
09466:       }
09467:       if (url.pathname.startsWith("/api/backup/file/")) {
09468:         if (!["GET", "HEAD"].includes(request.method)) return json({ ok: false, error: "METHOD_NOT_ALLOWED" }, 405);
09469:         const auth = backupAuth();
09470:         if (auth.response) return auth.response;
09471:         let id = "";
09472:         try {
09473:           id = decodeURIComponent(url.pathname.slice("/api/backup/file/".length));
09474:         } catch {
09475:           return json({ ok: false, error: "INVALID_FILE_ID" }, 400);
09476:         }
09477:         const f = store.file(id);
09478:         if (!f) return json({ ok: false, error: "FILE_NOT_FOUND" }, 404);
09479:         return new Response(request.method === "HEAD" ? null : f.data, { headers: {
09480:           "Content-Type": f.mime || "application/octet-stream",
09481:           "Content-Length": String(f.size),
09482:           "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(f.name || "attachment")}`,
09483:           "Cache-Control": "no-store",
09484:           "X-Content-Type-Options": "nosniff"
09485:         } });
09486:       }
09487:       if (url.pathname === "/api/backup") {
09488:         if (request.method !== "GET") return json({ ok: false, error: "METHOD_NOT_ALLOWED" }, 405);
~~~

~~~text
09465:         return json({ ok: true, data: { files, fileCount: files.length, totalBytes: files.reduce((n, x) => n + x.size, 0) } });
09466:       }
09467:       if (url.pathname.startsWith("/api/backup/file/")) {
09468:         if (!["GET", "HEAD"].includes(request.method)) return json({ ok: false, error: "METHOD_NOT_ALLOWED" }, 405);
09469:         const auth = backupAuth();
09470:         if (auth.response) return auth.response;
09471:         let id = "";
09472:         try {
09473:           id = decodeURIComponent(url.pathname.slice("/api/backup/file/".length));
09474:         } catch {
09475:           return json({ ok: false, error: "INVALID_FILE_ID" }, 400);
09476:         }
09477:         const f = store.file(id);
09478:         if (!f) return json({ ok: false, error: "FILE_NOT_FOUND" }, 404);
09479:         return new Response(request.method === "HEAD" ? null : f.data, { headers: {
09480:           "Content-Type": f.mime || "application/octet-stream",
09481:           "Content-Length": String(f.size),
09482:           "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(f.name || "attachment")}`,
09483:           "Cache-Control": "no-store",
09484:           "X-Content-Type-Options": "nosniff"
09485:         } });
09486:       }
09487:       if (url.pathname === "/api/backup") {
09488:         if (request.method !== "GET") return json({ ok: false, error: "METHOD_NOT_ALLOWED" }, 405);
09489:         const auth = backupAuth();
09490:         if (auth.response) return auth.response;
09491:         const inventory = store.spreadsheet.getSheets().map((s) => ({ name: s.getName(), rows: s.getLastRow() }));
09492:         const fileInventory = store.listFiles();
09493:         backend.auditSystemEvent({
09494:           actor: auth.session.username,
~~~

~~~text
09479:         return new Response(request.method === "HEAD" ? null : f.data, { headers: {
09480:           "Content-Type": f.mime || "application/octet-stream",
09481:           "Content-Length": String(f.size),
09482:           "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(f.name || "attachment")}`,
09483:           "Cache-Control": "no-store",
09484:           "X-Content-Type-Options": "nosniff"
09485:         } });
09486:       }
09487:       if (url.pathname === "/api/backup") {
09488:         if (request.method !== "GET") return json({ ok: false, error: "METHOD_NOT_ALLOWED" }, 405);
09489:         const auth = backupAuth();
09490:         if (auth.response) return auth.response;
09491:         const inventory = store.spreadsheet.getSheets().map((s) => ({ name: s.getName(), rows: s.getLastRow() }));
09492:         const fileInventory = store.listFiles();
09493:         backend.auditSystemEvent({
09494:           actor: auth.session.username,
09495:           role: auth.session.role,
09496:           action: "backup.download",
09497:           entity: "SYSTEM_BACKUP",
09498:           payload: { sheetCount: inventory.length, totalRows: inventory.reduce((n, x) => n + x.rows, 0), fileCount: fileInventory.length, totalFileBytes: fileInventory.reduce((n, x) => n + x.size, 0) }
09499:         });
09500:         transact(() => store.commit());
09501:         const data = Object.fromEntries(store.spreadsheet.getSheets().map((s) => [s.getName(), s.getDataRange().getValues()]));
09502:         return new Response(encode(data), { headers: {
09503:           "Content-Type": "application/json",
09504:           "Content-Disposition": 'attachment; filename="maintenance-backup.json"',
09505:           "Cache-Control": "no-store",
09506:           "X-Content-Type-Options": "nosniff",
09507:           "X-Backup-File-Count": String(fileInventory.length),
09508:           "X-Backup-File-Bytes": String(fileInventory.reduce((n, x) => n + x.size, 0))
~~~

~~~text
09503:           "Content-Type": "application/json",
09504:           "Content-Disposition": 'attachment; filename="maintenance-backup.json"',
09505:           "Cache-Control": "no-store",
09506:           "X-Content-Type-Options": "nosniff",
09507:           "X-Backup-File-Count": String(fileInventory.length),
09508:           "X-Backup-File-Bytes": String(fileInventory.reduce((n, x) => n + x.size, 0))
09509:         } });
09510:       }
09511:       if (url.pathname !== "/api") return json({ ok: false, error: "NOT_FOUND" }, 404);
09512:       if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: { Allow: "GET, POST, OPTIONS" } });
09513:       let result;
09514:       if (request.method === "POST") {
09515:         if (Number(request.headers.get("Content-Length") || 0) > 50 * 1024 * 1024) return json({ ok: false, error: "UPLOAD_TOO_LARGE" }, 413);
09516:         const body = parsedBody || await request.json();
09517:         if (body.action === "login") {
09518:           const key = request.headers.get("CF-Connecting-IP") || "local", now = Date.now();
09519:           const r = this.rate.get(key) || { start: now, n: 0 };
09520:           if (now - r.start > 6e4) {
09521:             r.start = now;
09522:             r.n = 0;
09523:           }
09524:           r.n++;
09525:           this.rate.set(key, r);
09526:           if (r.n > 20) return json({ ok: false, error: "RATE_LIMITED: Tunggu satu menit." }, 429);
09527:           if (this.rate.size > 1e3) {
09528:             for (const [k, v] of this.rate) if (now - v.start > 6e4) this.rate.delete(k);
09529:           }
09530:         }
09531:         result = await backend.doPost({ body: { ...body, sessionToken: token || body.sessionToken } });
09532:       } else if (request.method === "GET") {
~~~

~~~text
09559:     this.application = new Application(ctx, env);
09560:   }
09561:   fetch(request) {
09562:     return this.application.fetch(request);
09563:   }
09564: };
09565: var worker_default = { async fetch(request, env) {
09566:   const url = new URL(request.url);
09567:   if (url.pathname === "/api" || url.pathname.startsWith("/api/") || url.pathname.startsWith("/files/")) return env.MAINTENANCE.get(env.MAINTENANCE.idFromName("maintenance-production")).fetch(request);
09568:   return env.ASSETS.fetch(request);
09569: } };
09570: export {
09571:   MaintenanceStore,
09572:   worker_default as default
09573: };
09574: //# sourceMappingURL=worker.js.map
~~~

### pathname — 13
### /api — 13
~~~text
06719:       return { success: false, httpCode, errorText: response.getContentText().slice(0, 300) };
06720:     }
06721:     const raw = JSON.parse(response.getContentText());
06722:     const candidate = (raw.candidates || [])[0];
06723:     return { success: true, raw, candidate };
06724:   }
06725:   __name(callGeminiModel_, "callGeminiModel_");
06726:   async function callGroqModel_(modelName, apiKey, systemPrompt, userPrompt) {
06727:     const url = "https://api.groq.com/openai/v1/chat/completions";
06728:     const response = await UrlFetchApp.fetch(url, {
06729:       method: "post",
06730:       contentType: "application/json",
06731:       headers: { "Authorization": "Bearer " + apiKey },
06732:       payload: JSON.stringify({
06733:         model: modelName,
06734:         messages: [
06735:           { role: "system", content: systemPrompt },
06736:           { role: "user", content: userPrompt }
06737:         ],
06738:         max_tokens: 2048,
06739:         temperature: 0.4
06740:       }),
06741:       muteHttpExceptions: true
06742:     });
06743:     const httpCode = response.getResponseCode();
06744:     if (httpCode !== 200) {
06745:       return { success: false, httpCode, errorText: response.getContentText().slice(0, 300) };
06746:     }
06747:     const raw = JSON.parse(response.getContentText());
06748:     const text = raw.choices && raw.choices[0] && raw.choices[0].message && raw.choices[0].message.content || "";
~~~

~~~text
06746:     }
06747:     const raw = JSON.parse(response.getContentText());
06748:     const text = raw.choices && raw.choices[0] && raw.choices[0].message && raw.choices[0].message.content || "";
06749:     return { success: true, text };
06750:   }
06751:   __name(callGroqModel_, "callGroqModel_");
06752:   async function getGroqAvailableModels_(apiKey) {
06753:     try {
06754:       const response = await UrlFetchApp.fetch("https://api.groq.com/openai/v1/models", {
06755:         method: "get",
06756:         headers: { "Authorization": "Bearer " + apiKey },
06757:         muteHttpExceptions: true
06758:       });
06759:       if (response.getResponseCode() !== 200) return [];
06760:       const raw = JSON.parse(response.getContentText());
06761:       const rows = Array.isArray(raw.data) ? raw.data : [];
06762:       return rows.map(function(x) {
06763:         return String(x.id || "");
06764:       }).filter(function(id) {
06765:         return !!id;
06766:       });
06767:     } catch (e) {
06768:       return [];
06769:     }
06770:   }
06771:   __name(getGroqAvailableModels_, "getGroqAvailableModels_");
06772:   function rankGroqModels_(available) {
06773:     const preferred = GROQ_MODELS.slice();
06774:     const out = [];
06775:     preferred.forEach(function(id) {
~~~

### request.method — 13
~~~text
09354:   }
09355:   async run(request, parsedBody) {
09356:     const url = new URL(request.url), sql = this.state.storage.sql;
09357:     this.init(request);
09358:     const store = this.store, backend = this.backend;
09359:     const transact = /* @__PURE__ */ __name((fn) => this.state.storage.transactionSync(fn), "transact");
09360:     try {
09361:       if (url.pathname.startsWith("/api/setup/")) {
09362:         if (request.method !== "POST" || !equal(request.headers.get("X-Setup-Token"), this.env.SETUP_TOKEN)) return json({ ok: false, error: "FORBIDDEN" }, 403);
09363:         if (store.services.PropertiesService.getScriptProperties().getProperty("MIGRATION_READY") === "1") return json({ ok: false, error: "SETUP_CLOSED" }, 409);
09364:         const body = await request.json();
09365:         if (url.pathname === "/api/setup/import") {
09366:           if (typeof body.name !== "string" || !Array.isArray(body.rows) || body.rows.some((r) => !Array.isArray(r))) return json({ ok: false, error: "INVALID_IMPORT" }, 400);
09367:           const hash = createHash2("sha256").update(encode(body.rows)).digest("hex");
09368:           const key = "IMPORT_" + body.name;
09369:           const prev = store.services.PropertiesService.getScriptProperties().getProperty(key);
09370:           if (prev === hash) return json({ ok: true, reused: true });
09371:           store.importSheet(body.name, body.rows);
09372:           store.services.PropertiesService.getScriptProperties().setProperty(key, hash);
09373:           transact(() => store.commit());
09374:           return json({ ok: true, sheet: body.name, records: Math.max(0, body.rows.length - 1) });
09375:         }
09376:         if (url.pathname === "/api/setup/finish") {
09377:           const sheets = store.spreadsheet.getSheets();
09378:           if (!Array.isArray(body.sheets) || body.sheets.length !== sheets.length) return json({ ok: false, error: "IMPORT_INCOMPLETE" }, 400);
09379:           for (const item of body.sheets) {
09380:             const s = store.spreadsheet.getSheetByName(item.name);
09381:             if (!s || Math.max(0, s.getLastRow() - 1) !== item.rows) return json({ ok: false, error: "IMPORT_COUNT_MISMATCH: " + item.name }, 400);
09382:           }
09383:           const users = store.spreadsheet.getSheetByName("Users");
~~~

~~~text
09408:             start = Number(m[1]);
09409:             if (m[2]) end = Math.min(end, Number(m[2]));
09410:           } else start = Math.max(0, f.size - Number(m[2]));
09411:           if (start > end || start >= f.size) return new Response(null, { status: 416, headers: { "Content-Range": "bytes */" + f.size } });
09412:           headers["Content-Range"] = `bytes ${start}-${end}/${f.size}`;
09413:           headers["Content-Length"] = String(end - start + 1);
09414:           return new Response(f.data.subarray(start, end + 1), { status: 206, headers });
09415:         }
09416:         return new Response(request.method === "HEAD" ? null : f.data, { headers });
09417:       }
09418:       const token = (request.headers.get("Authorization") || "").replace(/^Bearer /, "");
09419:       const backupAuth = /* @__PURE__ */ __name(() => {
09420:         if (!token) return { response: json({ ok: false, error: "AUTH_REQUIRED" }, 401) };
09421:         try {
09422:           const session = backend.requireSession(token);
09423:           if (session.role !== "Superadmin") return { response: json({ ok: false, error: "FORBIDDEN" }, 403) };
09424:           return { session };
09425:         } catch (e) {
09426:           return { response: json({ ok: false, error: (e.code ? e.code + ": " : "") + (e.message || String(e)) }, 401) };
09427:         }
09428:       }, "backupAuth");
09429:       if (url.pathname === "/api/backup/config") {
09430:         if (request.method !== "GET") return json({ ok: false, error: "METHOD_NOT_ALLOWED" }, 405);
09431:         const auth = backupAuth();
09432:         if (auth.response) return auth.response;
09433:         const all = store.listProperties();
09434:         const sensitive = /password|secret|token|api[_-]?key|gemini|groq|setup/i;
09435:         const safe = all.filter((x) => !sensitive.test(x.key));
09436:         const excludedKeys = all.filter((x) => sensitive.test(x.key)).map((x) => x.key);
09437:         backend.auditSystemEvent({
~~~

~~~text
09422:           const session = backend.requireSession(token);
09423:           if (session.role !== "Superadmin") return { response: json({ ok: false, error: "FORBIDDEN" }, 403) };
09424:           return { session };
09425:         } catch (e) {
09426:           return { response: json({ ok: false, error: (e.code ? e.code + ": " : "") + (e.message || String(e)) }, 401) };
09427:         }
09428:       }, "backupAuth");
09429:       if (url.pathname === "/api/backup/config") {
09430:         if (request.method !== "GET") return json({ ok: false, error: "METHOD_NOT_ALLOWED" }, 405);
09431:         const auth = backupAuth();
09432:         if (auth.response) return auth.response;
09433:         const all = store.listProperties();
09434:         const sensitive = /password|secret|token|api[_-]?key|gemini|groq|setup/i;
09435:         const safe = all.filter((x) => !sensitive.test(x.key));
09436:         const excludedKeys = all.filter((x) => sensitive.test(x.key)).map((x) => x.key);
09437:         backend.auditSystemEvent({
09438:           actor: auth.session.username,
09439:           role: auth.session.role,
09440:           action: "backup.config.list",
09441:           entity: "SYSTEM_BACKUP",
09442:           payload: { safePropertyCount: safe.length, excludedPropertyCount: excludedKeys.length }
09443:         });
09444:         transact(() => store.commit());
09445:         return json({ ok: true, data: {
09446:           properties: Object.fromEntries(safe.map((x) => [x.key, x.value])),
09447:           excludedKeys,
09448:           secretsIncluded: false,
09449:           note: "Sensitive properties are intentionally excluded and must be restored through approved secret management."
09450:         } });
09451:       }
~~~

~~~text
09445:         return json({ ok: true, data: {
09446:           properties: Object.fromEntries(safe.map((x) => [x.key, x.value])),
09447:           excludedKeys,
09448:           secretsIncluded: false,
09449:           note: "Sensitive properties are intentionally excluded and must be restored through approved secret management."
09450:         } });
09451:       }
09452:       if (url.pathname === "/api/backup/files") {
09453:         if (request.method !== "GET") return json({ ok: false, error: "METHOD_NOT_ALLOWED" }, 405);
09454:         const auth = backupAuth();
09455:         if (auth.response) return auth.response;
09456:         const files = store.listFiles();
09457:         backend.auditSystemEvent({
09458:           actor: auth.session.username,
09459:           role: auth.session.role,
09460:           action: "backup.files.list",
09461:           entity: "SYSTEM_BACKUP",
09462:           payload: { fileCount: files.length, totalBytes: files.reduce((n, x) => n + x.size, 0) }
09463:         });
09464:         transact(() => store.commit());
09465:         return json({ ok: true, data: { files, fileCount: files.length, totalBytes: files.reduce((n, x) => n + x.size, 0) } });
09466:       }
09467:       if (url.pathname.startsWith("/api/backup/file/")) {
09468:         if (!["GET", "HEAD"].includes(request.method)) return json({ ok: false, error: "METHOD_NOT_ALLOWED" }, 405);
09469:         const auth = backupAuth();
09470:         if (auth.response) return auth.response;
09471:         let id = "";
09472:         try {
09473:           id = decodeURIComponent(url.pathname.slice("/api/backup/file/".length));
09474:         } catch {
~~~

~~~text
09460:           action: "backup.files.list",
09461:           entity: "SYSTEM_BACKUP",
09462:           payload: { fileCount: files.length, totalBytes: files.reduce((n, x) => n + x.size, 0) }
09463:         });
09464:         transact(() => store.commit());
09465:         return json({ ok: true, data: { files, fileCount: files.length, totalBytes: files.reduce((n, x) => n + x.size, 0) } });
09466:       }
09467:       if (url.pathname.startsWith("/api/backup/file/")) {
09468:         if (!["GET", "HEAD"].includes(request.method)) return json({ ok: false, error: "METHOD_NOT_ALLOWED" }, 405);
09469:         const auth = backupAuth();
09470:         if (auth.response) return auth.response;
09471:         let id = "";
09472:         try {
09473:           id = decodeURIComponent(url.pathname.slice("/api/backup/file/".length));
09474:         } catch {
09475:           return json({ ok: false, error: "INVALID_FILE_ID" }, 400);
09476:         }
09477:         const f = store.file(id);
09478:         if (!f) return json({ ok: false, error: "FILE_NOT_FOUND" }, 404);
09479:         return new Response(request.method === "HEAD" ? null : f.data, { headers: {
09480:           "Content-Type": f.mime || "application/octet-stream",
09481:           "Content-Length": String(f.size),
09482:           "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(f.name || "attachment")}`,
09483:           "Cache-Control": "no-store",
09484:           "X-Content-Type-Options": "nosniff"
09485:         } });
09486:       }
09487:       if (url.pathname === "/api/backup") {
09488:         if (request.method !== "GET") return json({ ok: false, error: "METHOD_NOT_ALLOWED" }, 405);
09489:         const auth = backupAuth();
~~~

~~~text
09471:         let id = "";
09472:         try {
09473:           id = decodeURIComponent(url.pathname.slice("/api/backup/file/".length));
09474:         } catch {
09475:           return json({ ok: false, error: "INVALID_FILE_ID" }, 400);
09476:         }
09477:         const f = store.file(id);
09478:         if (!f) return json({ ok: false, error: "FILE_NOT_FOUND" }, 404);
09479:         return new Response(request.method === "HEAD" ? null : f.data, { headers: {
09480:           "Content-Type": f.mime || "application/octet-stream",
09481:           "Content-Length": String(f.size),
09482:           "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(f.name || "attachment")}`,
09483:           "Cache-Control": "no-store",
09484:           "X-Content-Type-Options": "nosniff"
09485:         } });
09486:       }
09487:       if (url.pathname === "/api/backup") {
09488:         if (request.method !== "GET") return json({ ok: false, error: "METHOD_NOT_ALLOWED" }, 405);
09489:         const auth = backupAuth();
09490:         if (auth.response) return auth.response;
09491:         const inventory = store.spreadsheet.getSheets().map((s) => ({ name: s.getName(), rows: s.getLastRow() }));
09492:         const fileInventory = store.listFiles();
09493:         backend.auditSystemEvent({
09494:           actor: auth.session.username,
09495:           role: auth.session.role,
09496:           action: "backup.download",
09497:           entity: "SYSTEM_BACKUP",
09498:           payload: { sheetCount: inventory.length, totalRows: inventory.reduce((n, x) => n + x.rows, 0), fileCount: fileInventory.length, totalFileBytes: fileInventory.reduce((n, x) => n + x.size, 0) }
09499:         });
09500:         transact(() => store.commit());
~~~

~~~text
09480:           "Content-Type": f.mime || "application/octet-stream",
09481:           "Content-Length": String(f.size),
09482:           "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(f.name || "attachment")}`,
09483:           "Cache-Control": "no-store",
09484:           "X-Content-Type-Options": "nosniff"
09485:         } });
09486:       }
09487:       if (url.pathname === "/api/backup") {
09488:         if (request.method !== "GET") return json({ ok: false, error: "METHOD_NOT_ALLOWED" }, 405);
09489:         const auth = backupAuth();
09490:         if (auth.response) return auth.response;
09491:         const inventory = store.spreadsheet.getSheets().map((s) => ({ name: s.getName(), rows: s.getLastRow() }));
09492:         const fileInventory = store.listFiles();
09493:         backend.auditSystemEvent({
09494:           actor: auth.session.username,
09495:           role: auth.session.role,
09496:           action: "backup.download",
09497:           entity: "SYSTEM_BACKUP",
09498:           payload: { sheetCount: inventory.length, totalRows: inventory.reduce((n, x) => n + x.rows, 0), fileCount: fileInventory.length, totalFileBytes: fileInventory.reduce((n, x) => n + x.size, 0) }
09499:         });
09500:         transact(() => store.commit());
09501:         const data = Object.fromEntries(store.spreadsheet.getSheets().map((s) => [s.getName(), s.getDataRange().getValues()]));
09502:         return new Response(encode(data), { headers: {
09503:           "Content-Type": "application/json",
09504:           "Content-Disposition": 'attachment; filename="maintenance-backup.json"',
09505:           "Cache-Control": "no-store",
09506:           "X-Content-Type-Options": "nosniff",
09507:           "X-Backup-File-Count": String(fileInventory.length),
09508:           "X-Backup-File-Bytes": String(fileInventory.reduce((n, x) => n + x.size, 0))
09509:         } });
~~~

~~~text
09504:           "Content-Disposition": 'attachment; filename="maintenance-backup.json"',
09505:           "Cache-Control": "no-store",
09506:           "X-Content-Type-Options": "nosniff",
09507:           "X-Backup-File-Count": String(fileInventory.length),
09508:           "X-Backup-File-Bytes": String(fileInventory.reduce((n, x) => n + x.size, 0))
09509:         } });
09510:       }
09511:       if (url.pathname !== "/api") return json({ ok: false, error: "NOT_FOUND" }, 404);
09512:       if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: { Allow: "GET, POST, OPTIONS" } });
09513:       let result;
09514:       if (request.method === "POST") {
09515:         if (Number(request.headers.get("Content-Length") || 0) > 50 * 1024 * 1024) return json({ ok: false, error: "UPLOAD_TOO_LARGE" }, 413);
09516:         const body = parsedBody || await request.json();
09517:         if (body.action === "login") {
09518:           const key = request.headers.get("CF-Connecting-IP") || "local", now = Date.now();
09519:           const r = this.rate.get(key) || { start: now, n: 0 };
09520:           if (now - r.start > 6e4) {
09521:             r.start = now;
09522:             r.n = 0;
09523:           }
09524:           r.n++;
09525:           this.rate.set(key, r);
09526:           if (r.n > 20) return json({ ok: false, error: "RATE_LIMITED: Tunggu satu menit." }, 429);
09527:           if (this.rate.size > 1e3) {
09528:             for (const [k, v] of this.rate) if (now - v.start > 6e4) this.rate.delete(k);
09529:           }
09530:         }
09531:         result = await backend.doPost({ body: { ...body, sessionToken: token || body.sessionToken } });
09532:       } else if (request.method === "GET") {
09533:         const params = Object.fromEntries(url.searchParams);
~~~

~~~text
09506:           "X-Content-Type-Options": "nosniff",
09507:           "X-Backup-File-Count": String(fileInventory.length),
09508:           "X-Backup-File-Bytes": String(fileInventory.reduce((n, x) => n + x.size, 0))
09509:         } });
09510:       }
09511:       if (url.pathname !== "/api") return json({ ok: false, error: "NOT_FOUND" }, 404);
09512:       if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: { Allow: "GET, POST, OPTIONS" } });
09513:       let result;
09514:       if (request.method === "POST") {
09515:         if (Number(request.headers.get("Content-Length") || 0) > 50 * 1024 * 1024) return json({ ok: false, error: "UPLOAD_TOO_LARGE" }, 413);
09516:         const body = parsedBody || await request.json();
09517:         if (body.action === "login") {
09518:           const key = request.headers.get("CF-Connecting-IP") || "local", now = Date.now();
09519:           const r = this.rate.get(key) || { start: now, n: 0 };
09520:           if (now - r.start > 6e4) {
09521:             r.start = now;
09522:             r.n = 0;
09523:           }
09524:           r.n++;
09525:           this.rate.set(key, r);
09526:           if (r.n > 20) return json({ ok: false, error: "RATE_LIMITED: Tunggu satu menit." }, 429);
09527:           if (this.rate.size > 1e3) {
09528:             for (const [k, v] of this.rate) if (now - v.start > 6e4) this.rate.delete(k);
09529:           }
09530:         }
09531:         result = await backend.doPost({ body: { ...body, sessionToken: token || body.sessionToken } });
09532:       } else if (request.method === "GET") {
09533:         const params = Object.fromEntries(url.searchParams);
09534:         params.sessionToken = token || params.sessionToken || "";
09535:         backend.requireSession(params.sessionToken);
~~~

~~~text
09524:           r.n++;
09525:           this.rate.set(key, r);
09526:           if (r.n > 20) return json({ ok: false, error: "RATE_LIMITED: Tunggu satu menit." }, 429);
09527:           if (this.rate.size > 1e3) {
09528:             for (const [k, v] of this.rate) if (now - v.start > 6e4) this.rate.delete(k);
09529:           }
09530:         }
09531:         result = await backend.doPost({ body: { ...body, sessionToken: token || body.sessionToken } });
09532:       } else if (request.method === "GET") {
09533:         const params = Object.fromEntries(url.searchParams);
09534:         params.sessionToken = token || params.sessionToken || "";
09535:         backend.requireSession(params.sessionToken);
09536:         result = backend.doGet({ parameter: params });
09537:       } else return json({ ok: false, error: "METHOD_NOT_ALLOWED" }, 405);
09538:       const parsed = JSON.parse(result.getContent());
09539:       if (parsed.ok) transact(() => store.commit());
09540:       else store.rollback();
09541:       const requestedAction = request.method === "POST" ? parsedBody && parsedBody.action || "" : url.searchParams.get("action") || "";
09542:       return json(parsed, !parsed.ok && String(requestedAction).startsWith("v4.") ? v4Status(parsed.error) : 200);
09543:     } catch (e) {
09544:       store.rollback();
09545:       const err = (e.code ? e.code + ": " : "") + (e.message || String(e));
09546:       const requestedAction = request.method === "POST" ? parsedBody && parsedBody.action || "" : url.searchParams.get("action") || "";
09547:       return json({ ok: false, error: err }, String(requestedAction).startsWith("v4.") ? v4Status(err) : 400);
09548:     }
09549:   }
09550: };
09551: 
09552: // src/worker.mjs
09553: var MaintenanceStore = class extends DurableObject {
~~~

~~~text
09533:         const params = Object.fromEntries(url.searchParams);
09534:         params.sessionToken = token || params.sessionToken || "";
09535:         backend.requireSession(params.sessionToken);
09536:         result = backend.doGet({ parameter: params });
09537:       } else return json({ ok: false, error: "METHOD_NOT_ALLOWED" }, 405);
09538:       const parsed = JSON.parse(result.getContent());
09539:       if (parsed.ok) transact(() => store.commit());
09540:       else store.rollback();
09541:       const requestedAction = request.method === "POST" ? parsedBody && parsedBody.action || "" : url.searchParams.get("action") || "";
09542:       return json(parsed, !parsed.ok && String(requestedAction).startsWith("v4.") ? v4Status(parsed.error) : 200);
09543:     } catch (e) {
09544:       store.rollback();
09545:       const err = (e.code ? e.code + ": " : "") + (e.message || String(e));
09546:       const requestedAction = request.method === "POST" ? parsedBody && parsedBody.action || "" : url.searchParams.get("action") || "";
09547:       return json({ ok: false, error: err }, String(requestedAction).startsWith("v4.") ? v4Status(err) : 400);
09548:     }
09549:   }
09550: };
09551: 
09552: // src/worker.mjs
09553: var MaintenanceStore = class extends DurableObject {
09554:   static {
09555:     __name(this, "MaintenanceStore");
09556:   }
09557:   constructor(ctx, env) {
09558:     super(ctx, env);
09559:     this.application = new Application(ctx, env);
09560:   }
09561:   fetch(request) {
09562:     return this.application.fetch(request);
~~~

~~~text
09538:       const parsed = JSON.parse(result.getContent());
09539:       if (parsed.ok) transact(() => store.commit());
09540:       else store.rollback();
09541:       const requestedAction = request.method === "POST" ? parsedBody && parsedBody.action || "" : url.searchParams.get("action") || "";
09542:       return json(parsed, !parsed.ok && String(requestedAction).startsWith("v4.") ? v4Status(parsed.error) : 200);
09543:     } catch (e) {
09544:       store.rollback();
09545:       const err = (e.code ? e.code + ": " : "") + (e.message || String(e));
09546:       const requestedAction = request.method === "POST" ? parsedBody && parsedBody.action || "" : url.searchParams.get("action") || "";
09547:       return json({ ok: false, error: err }, String(requestedAction).startsWith("v4.") ? v4Status(err) : 400);
09548:     }
09549:   }
09550: };
09551: 
09552: // src/worker.mjs
09553: var MaintenanceStore = class extends DurableObject {
09554:   static {
09555:     __name(this, "MaintenanceStore");
09556:   }
09557:   constructor(ctx, env) {
09558:     super(ctx, env);
09559:     this.application = new Application(ctx, env);
09560:   }
09561:   fetch(request) {
09562:     return this.application.fetch(request);
09563:   }
09564: };
09565: var worker_default = { async fetch(request, env) {
09566:   const url = new URL(request.url);
09567:   if (url.pathname === "/api" || url.pathname.startsWith("/api/") || url.pathname.startsWith("/files/")) return env.MAINTENANCE.get(env.MAINTENANCE.idFromName("maintenance-production")).fetch(request);
~~~

### method === — 8
### action — 298
~~~text
00532:   function partRefsFromLogbook(list) {
00533:     const map = /* @__PURE__ */ new Map();
00534:     function add(number, name, row) {
00535:       const key = materialKey(number, name);
00536:       if (!key) return;
00537:       const cur = map.get(key) || { key, materialNumber: text(number), material: text(name) || text(number), consumptionCount: 0, latest: 0, sourceIds: /* @__PURE__ */ new Set() };
00538:       cur.consumptionCount++;
00539:       cur.latest = Math.max(cur.latest, dateValue(row) || 0);
00540:       const id = text(first(row, ["ID", "Entry ID", "TransactionID"]));
00541:       if (id) cur.sourceIds.add(id);
00542:       if (!cur.materialNumber && number) cur.materialNumber = text(number);
00543:       if ((!cur.material || cur.material === cur.materialNumber) && name) cur.material = text(name);
00544:       map.set(key, cur);
00545:     }
00546:     __name(add, "add");
00547:     (list || []).forEach((r) => {
00548:       const directNum = materialNumber(r), directName = materialName(r);
00549:       if (directNum || directName) add(directNum, directName, r);
00550:       splitParts(first(r, ["Spare Part Digunakan", "Sparepart Digunakan", "Parts Used"])).forEach((name) => add("", name, r));
00551:     });
00552:     return map;
00553:   }
00554:   __name(partRefsFromLogbook, "partRefsFromLogbook");
00555:   function joinPartRecords(partMap, records) {
00556:     const byNum = /* @__PURE__ */ new Map(), byName = /* @__PURE__ */ new Map();
00557:     for (const p of partMap.values()) {
00558:       if (p.materialNumber) byNum.set(lower(p.materialNumber), p);
00559:       if (p.material) byName.set(lower(p.material), p);
00560:     }
00561:     const out = [];
~~~

~~~text
00754:       const d = timeMs(first(r, ["Estimasi ETA", "ETA", "Tanggal ETA", "Expected Date"]), NaN);
00755:       return Number.isFinite(d) && d < Date.now() && !isClosed(r);
00756:     });
00757:     const kpiRisk = kpi.filter((r) => kpiIsAtRiskSinceSourceTruth(r));
00758:     const overdueProjects = projects.filter((r) => {
00759:       const due = timeMs(first(r, ["Target Finish", "Due Date", "Target", "Deadline"]), NaN);
00760:       return Number.isFinite(due) && due < Date.now() && !isClosed(r);
00761:     });
00762:     const highActions = log.filter((r) => !isClosed(r) && isHigh(r)).concat(overdueProjects).slice(0, 25);
00763:     const look = [];
00764:     criticalMachines.slice(0, 4).forEach((m) => look.push({ priority: m.healthIndex < 40 ? "P0" : "P1", type: "machine", title: (m.code || m.name || "Mesin") + " membutuhkan perhatian", reason: "Health index rule-based " + m.healthIndex + "/100", evidence: m.healthFactors }));
00765:     activeBreakdowns.slice(0, 4).forEach((r) => look.push({ priority: isHigh(r) ? "P0" : "P1", type: "breakdown", title: machineName(r) || machineCode(r) || "Breakdown aktif", reason: description(r) || "Status belum selesai", record: cleanRecord(r, 10) }));
00766:     stockRisks.slice(0, 4).forEach((r) => look.push({ priority: "P1", type: "sparepart", title: materialName(r) || materialNumber(r) || "Sparepart kritis", reason: "Stock berada pada/di bawah batas minimum", record: cleanRecord(r, 10) }));
00767:     overdueProjects.slice(0, 4).forEach((r) => look.push({ priority: "P1", type: "project", title: text(first(r, ["Judul", "Nama Project", "Tema"])) || "Project overdue", reason: "Target finish sudah terlewati", record: cleanRecord(r, 10) }));
00768:     return { ok: true, data: {
00769:       generatedAt: nowIso(),
00770:       logicVersion: "v4-overview-2",
00771:       range: { since: new Date(range.since).toISOString(), until: new Date(range.until).toISOString() },
00772:       appliedScope: { machine: scope.machine || "", area: scope.area || "", machineCount: scope.active ? scope.machines.length : null },
00773:       filters: { areas: scope.areas, machines: scopeContext({}).machines },
00774:       summary: {
00775:         criticalMachines: criticalMachines.length,
00776:         activeBreakdown: activeBreakdowns.length,
00777:         predictiveRisks: predictiveRisks.length,
00778:         sparepartRisks: stockRisks.length + etaOverdue.length,
00779:         kpiAtRisk: kpiRisk.length,
00780:         openHighPriorityActions: highActions.length
00781:       },
00782:       thingsToLookAt: look.slice(0, 12),
00783:       criticalMachines: criticalMachines.slice(0, 8),
~~~

~~~text
00772:       appliedScope: { machine: scope.machine || "", area: scope.area || "", machineCount: scope.active ? scope.machines.length : null },
00773:       filters: { areas: scope.areas, machines: scopeContext({}).machines },
00774:       summary: {
00775:         criticalMachines: criticalMachines.length,
00776:         activeBreakdown: activeBreakdowns.length,
00777:         predictiveRisks: predictiveRisks.length,
00778:         sparepartRisks: stockRisks.length + etaOverdue.length,
00779:         kpiAtRisk: kpiRisk.length,
00780:         openHighPriorityActions: highActions.length
00781:       },
00782:       thingsToLookAt: look.slice(0, 12),
00783:       criticalMachines: criticalMachines.slice(0, 8),
00784:       topRisks: look.filter((x) => x.priority === "P0" || x.priority === "P1").slice(0, 8),
00785:       topOpportunities: machines.filter((m) => m.recurring > 0).slice(0, 6).map((m) => ({ type: "reliability", title: (m.code || m.name) + " memiliki pola berulang", reason: m.recurring + " pola problem berulang terdeteksi" })),
00786:       latestIntelligence: [...log, ...bd, ...pred].sort((a, b) => dateValue(b) - dateValue(a)).slice(0, 12).map((r) => ({ timestamp: dateValue(r) ? new Date(dateValue(r)).toISOString() : "", machine: machineCode(r) || machineName(r), description: description(r), status: first(r, ["Status", "Severity", "Prioritas"]) })),
00787:       sourceStatus: [
00788:         sourceMeta(SHEETS.logbook, log),
00789:         sourceMeta(SHEETS.breakdown, bd),
00790:         sourceMeta(SHEETS.predictive, pred),
00791:         sourceMeta(SHEETS.stock, scopedStock),
00792:         sourceMeta(SHEETS.sparepartEta, scopedEta),
00793:         sourceMeta(SHEETS.kpiYtd, kpi)
00794:       ],
00795:       lineage: { sourceOfTruth: "EXISTING_OMODOS", writes: "NONE", partLinkage: scope.active ? "Logbook consumption \u2192 Sparepart sources" : "global source view" }
00796:     } };
00797:   }
00798:   __name(getOverview, "getOverview");
00799:   function getWhatChanged(body) {
00800:     const range = resolveChangeRange(body || {}), scope = scopeContext(body || {});
00801:     const scopedLog = within(sourceRows(SHEETS.logbook), range.since, range.until).filter(scope.record);
~~~

~~~text
00981:     });
00982:     const replacementEvents = sources.logbook.filter((r) => /ganti|penggantian|replace|replacement|renew/i.test(lower(first(r, ["Tindakan Perbaikan", "Deskripsi Masalah", "Jenis Pekerjaan"]))));
00983:     const lifeClock = replacementEvents.slice().sort((a, b) => dateValue(b) - dateValue(a)).slice(0, 20).map((r) => ({
00984:       label: "INFERRED_FROM_LOGBOOK",
00985:       material: materialName(r) || first(r, ["Nama Unit"]) || "Component",
00986:       materialNumber: materialNumber(r),
00987:       lastReplacement: dateValue(r) ? new Date(dateValue(r)).toISOString() : "",
00988:       elapsedDays: dateValue(r) ? Math.floor((Date.now() - dateValue(r)) / 864e5) : null,
00989:       sourceId: first(r, ["ID", "TransactionID"]),
00990:       confidence: "low",
00991:       note: "Elapsed time since recorded replacement; not a manufacturer RUL."
00992:     }));
00993:     return { ok: true, data: {
00994:       generatedAt: nowIso(),
00995:       logicVersion: "v4-machine-passport-2",
00996:       identity: master ? cleanRecord(master, 30) : { code: q, name: q, label: "MASTER_NOT_FOUND" },
00997:       currentCondition: {
00998:         healthIndex: health ? health.healthIndex : null,
00999:         healthFactors: health ? health.healthFactors : [],
01000:         lastAbnormality: sortedAll.find((r) => !isClosed(r) || isHigh(r)) ? cleanRecord(sortedAll.find((r) => !isClosed(r) || isHigh(r)), 12) : sortedAll[0] ? cleanRecord(sortedAll[0], 12) : null,
01001:         openIssues: all.filter((r) => !isClosed(r)).slice(0, 20).map((r) => cleanRecord(r, 12)),
01002:         currentRisk: health ? health.healthIndex < 40 ? "HIGH" : health.healthIndex < 70 ? "MEDIUM" : "WATCH" : "NOT AVAILABLE"
01003:       },
01004:       reliability: {
01005:         failureCount: failures.length,
01006:         downtimeMinutes: Math.round(totalDowntime),
01007:         closedEvents: all.filter(isClosed).length,
01008:         eventCount: all.length,
01009:         mtbf: first(master || {}, ["MTBF"], "NOT AVAILABLE"),
01010:         mttr: first(master || {}, ["MTTR"], "NOT AVAILABLE"),
~~~

~~~text
01568:       kpiAtRisk: kpiRisk.slice(0, 50),
01569:       kpiStories: kpiStories.slice(0, 80),
01570:       recordYtdRisks: recordRisks,
01571:       maintenanceProductionCorrelation: { pairs: correlationPairs.length, pearson: corr === null ? "Data belum cukup" : Number(corr.toFixed(3)), label: corr === null ? "Data belum cukup" : "KORELASI_BUKAN_SEBAB_AKIBAT", variables: ["Jam breakdown", "Good output"] },
01572:       energyAnomalies: energyAnomalies.slice(0, 50),
01573:       energyPerGoodOutput: energyPerOutput.slice(0, 100),
01574:       utilityDigitalTwin: utilityTwin.slice(0, 100),
01575:       ipalIntelligence,
01576:       targetRecovery: { action: "v4.runScenario", note: "Gunakan Simulasi Target untuk mencoba skenario. Simulasi tidak mengubah data KPI asli." },
01577:       runHour: run.slice(0, 50).map((r) => cleanRecord(r, 16)),
01578:       appliedScope: { machine: scope.machine || "", area: scope.area || "" },
01579:       lineage: { sourceOfTruth: "OMODOS_EXISTING_SEJAK_2026-09-01", operationalWrites: "NONE" },
01580:       caveat: "Proyeksi hanya dibuat bila data sejak 1 September 2026 sudah cukup. Korelasi tidak dianggap sebagai bukti sebab-akibat."
01581:     } };
01582:   }
01583:   __name(getKpiStory, "getKpiStory");
01584:   function getPeopleSkillGraph(body) {
01585:     const people = sourceRows(SHEETS.personnel), soft = sourceRows(SHEETS.peopleSoft), hard = sourceRows(SHEETS.peopleHard), detail = sourceRows(SHEETS.peopleHardDetail), standard = sourceRows(SHEETS.peopleHardStandard);
01586:     const log = sourceRows(SHEETS.logbook), rca = sourceRows(SHEETS.rca), projects = sourceRows(SHEETS.project), kaizen = sourceRows(SHEETS.kaizen), sga = sourceRows(SHEETS.sga), kb = sourceRows(SHEETS.kb);
01587:     const byName = /* @__PURE__ */ new Map();
01588:     function pkey(v) {
01589:       return lower(v);
01590:     }
01591:     __name(pkey, "pkey");
01592:     function person(name) {
01593:       name = text(name);
01594:       if (!name) return null;
01595:       const key = pkey(name);
01596:       if (!byName.has(key)) byName.set(key, { name, profile: null, soft: [], hard: [], hardDetail: [], machines: /* @__PURE__ */ new Map(), rca: [], projects: [], knowledge: [], competent: 0, notCompetent: 0, lastEvidence: 0 });
01597:       return byName.get(key);
~~~

~~~text
01820:       overdueProjects: overdue.slice(0, 40).map((r) => cleanRecord(r, 12)),
01821:       openImprovements: opportunity,
01822:       opportunityRadar,
01823:       benefitEvidence,
01824:       beforeAfterTimeline: beforeAfter,
01825:       ideaMarketplace: marketplace,
01826:       sgaStories,
01827:       improvementLegacy: legacy,
01828:       knowledgeGraph: { action: "v4.getFactoryBrain", nodeTypes: ["project", "kaizen", "sga", "machine", "failure", "knowledge"] },
01829:       autoKaizenDraft: { action: "v4.aiAsk", purpose: "kaizen-draft", operationalWrite: "NONE", approval: "HUMAN_REQUIRED" },
01830:       lineage: { sourceOfTruth: "EXISTING_OMODOS", operationalWrites: "NONE" },
01831:       note: "Opportunity and benefit verification are evidence signals only. New/edited Project, Kaizen or SGA records must use the official existing module."
01832:     } };
01833:   }
01834:   __name(getImprovement, "getImprovement");
01835:   function findSimilarImprovement(body) {
01836:     const q = text(body.query || body.idea || body.title);
01837:     if (!q) return { ok: false, error: "VALIDATION_ERROR: query wajib" };
01838:     const source = [
01839:       ...sourceRows(SHEETS.project).map((r) => ({ type: "Factory Project", sheet: SHEETS.project, record: r })),
01840:       ...sourceRows(SHEETS.kaizen).map((r) => ({ type: "Kaizen", sheet: SHEETS.kaizen, record: r })),
01841:       ...sourceRows(SHEETS.sga).map((r) => ({ type: "SGA", sheet: SHEETS.sga, record: r }))
01842:     ];
01843:     const hits = [];
01844:     source.forEach((x) => {
01845:       const r = x.record;
01846:       const corpus = [
01847:         first(r, ["Judul", "Tema", "Nama Project"]),
01848:         first(r, ["Background", "Permasalahan"]),
01849:         first(r, ["Objective", "Ide Perbaikan", "Target"]),
~~~

~~~text
01821:       openImprovements: opportunity,
01822:       opportunityRadar,
01823:       benefitEvidence,
01824:       beforeAfterTimeline: beforeAfter,
01825:       ideaMarketplace: marketplace,
01826:       sgaStories,
01827:       improvementLegacy: legacy,
01828:       knowledgeGraph: { action: "v4.getFactoryBrain", nodeTypes: ["project", "kaizen", "sga", "machine", "failure", "knowledge"] },
01829:       autoKaizenDraft: { action: "v4.aiAsk", purpose: "kaizen-draft", operationalWrite: "NONE", approval: "HUMAN_REQUIRED" },
01830:       lineage: { sourceOfTruth: "EXISTING_OMODOS", operationalWrites: "NONE" },
01831:       note: "Opportunity and benefit verification are evidence signals only. New/edited Project, Kaizen or SGA records must use the official existing module."
01832:     } };
01833:   }
01834:   __name(getImprovement, "getImprovement");
01835:   function findSimilarImprovement(body) {
01836:     const q = text(body.query || body.idea || body.title);
01837:     if (!q) return { ok: false, error: "VALIDATION_ERROR: query wajib" };
01838:     const source = [
01839:       ...sourceRows(SHEETS.project).map((r) => ({ type: "Factory Project", sheet: SHEETS.project, record: r })),
01840:       ...sourceRows(SHEETS.kaizen).map((r) => ({ type: "Kaizen", sheet: SHEETS.kaizen, record: r })),
01841:       ...sourceRows(SHEETS.sga).map((r) => ({ type: "SGA", sheet: SHEETS.sga, record: r }))
01842:     ];
01843:     const hits = [];
01844:     source.forEach((x) => {
01845:       const r = x.record;
01846:       const corpus = [
01847:         first(r, ["Judul", "Tema", "Nama Project"]),
01848:         first(r, ["Background", "Permasalahan"]),
01849:         first(r, ["Objective", "Ide Perbaikan", "Target"]),
01850:         first(r, ["Lesson Learned", "Hasil Improvement"])
~~~

~~~text
01860:   function getBrief(body) {
01861:     const overview = getOverview(body || {}).data;
01862:     const s = overview.summary || {}, items = overview.thingsToLookAt || [];
01863:     const lines = [];
01864:     if (s.activeBreakdown) lines.push(s.activeBreakdown + " active breakdown(s) need review.");
01865:     if (s.criticalMachines) lines.push(s.criticalMachines + " critical/open-risk machine(s) detected by current rules.");
01866:     if (s.sparepartRisks) lines.push(s.sparepartRisks + " sparepart stock/ETA risk signal(s).");
01867:     if (s.kpiAtRisk) lines.push(s.kpiAtRisk + " KPI record(s) are flagged at risk.");
01868:     if (s.openHighPriorityActions) lines.push(s.openHighPriorityActions + " high-priority/open action(s).");
01869:     if (!lines.length) lines.push("No P0/P1 signal was derived for the selected data window.");
01870:     return { ok: true, data: { generatedAt: nowIso(), mode: "DETERMINISTIC_BRIEF", headline: lines[0], summary: lines, thingsToLookAt: items.slice(0, 8), confidence: items.length ? "medium" : "low", sourceStatus: overview.sourceStatus, note: "Deterministic fallback brief from OMODOS data; no generative provider was required." } };
01871:   }
01872:   __name(getBrief, "getBrief");
01873:   function runScenario(body) {
01874:     const range = standardRange(body || {}), reliability = getReliability(range).data, overview = getOverview(range).data, spare = getSparepartRisk().data;
01875:     const params = {
01876:       downtimeReductionPct: clamp(num(body.downtimeReductionPct), 0, 100),
01877:       recurringReductionPct: clamp(num(body.recurringReductionPct), 0, 100),
01878:       stockRiskReductionPct: clamp(num(body.stockRiskReductionPct), 0, 100),
01879:       actionClosurePct: clamp(num(body.actionClosurePct), 0, 100)
01880:     };
01881:     const base = {
01882:       downtimeMinutes: num(reliability.totals && reliability.totals.downtimeMinutes),
01883:       breakdowns: num(reliability.totals && reliability.totals.breakdowns),
01884:       recurringPatterns: num(reliability.totals && reliability.totals.recurringPatterns),
01885:       sparepartRisks: (spare.risks || []).length,
01886:       openHighPriorityActions: num(overview.summary && overview.summary.openHighPriorityActions)
01887:     };
01888:     const projected = {
01889:       downtimeMinutes: Math.round(base.downtimeMinutes * (1 - params.downtimeReductionPct / 100)),
~~~

~~~text
01871:   }
01872:   __name(getBrief, "getBrief");
01873:   function runScenario(body) {
01874:     const range = standardRange(body || {}), reliability = getReliability(range).data, overview = getOverview(range).data, spare = getSparepartRisk().data;
01875:     const params = {
01876:       downtimeReductionPct: clamp(num(body.downtimeReductionPct), 0, 100),
01877:       recurringReductionPct: clamp(num(body.recurringReductionPct), 0, 100),
01878:       stockRiskReductionPct: clamp(num(body.stockRiskReductionPct), 0, 100),
01879:       actionClosurePct: clamp(num(body.actionClosurePct), 0, 100)
01880:     };
01881:     const base = {
01882:       downtimeMinutes: num(reliability.totals && reliability.totals.downtimeMinutes),
01883:       breakdowns: num(reliability.totals && reliability.totals.breakdowns),
01884:       recurringPatterns: num(reliability.totals && reliability.totals.recurringPatterns),
01885:       sparepartRisks: (spare.risks || []).length,
01886:       openHighPriorityActions: num(overview.summary && overview.summary.openHighPriorityActions)
01887:     };
01888:     const projected = {
01889:       downtimeMinutes: Math.round(base.downtimeMinutes * (1 - params.downtimeReductionPct / 100)),
01890:       recurringPatterns: Math.max(0, Math.round(base.recurringPatterns * (1 - params.recurringReductionPct / 100))),
01891:       sparepartRisks: Math.max(0, Math.round(base.sparepartRisks * (1 - params.stockRiskReductionPct / 100))),
01892:       openHighPriorityActions: Math.max(0, Math.round(base.openHighPriorityActions * (1 - params.actionClosurePct / 100)))
01893:     };
01894:     projected.avoidedDowntimeMinutes = base.downtimeMinutes - projected.downtimeMinutes;
01895:     return { ok: true, data: {
01896:       generatedAt: nowIso(),
01897:       logicVersion: "v4-scenario-1",
01898:       range: { since: new Date(range.since).toISOString(), until: new Date(range.until).toISOString() },
01899:       params,
01900:       baseline: base,
~~~

~~~text
01878:       stockRiskReductionPct: clamp(num(body.stockRiskReductionPct), 0, 100),
01879:       actionClosurePct: clamp(num(body.actionClosurePct), 0, 100)
01880:     };
01881:     const base = {
01882:       downtimeMinutes: num(reliability.totals && reliability.totals.downtimeMinutes),
01883:       breakdowns: num(reliability.totals && reliability.totals.breakdowns),
01884:       recurringPatterns: num(reliability.totals && reliability.totals.recurringPatterns),
01885:       sparepartRisks: (spare.risks || []).length,
01886:       openHighPriorityActions: num(overview.summary && overview.summary.openHighPriorityActions)
01887:     };
01888:     const projected = {
01889:       downtimeMinutes: Math.round(base.downtimeMinutes * (1 - params.downtimeReductionPct / 100)),
01890:       recurringPatterns: Math.max(0, Math.round(base.recurringPatterns * (1 - params.recurringReductionPct / 100))),
01891:       sparepartRisks: Math.max(0, Math.round(base.sparepartRisks * (1 - params.stockRiskReductionPct / 100))),
01892:       openHighPriorityActions: Math.max(0, Math.round(base.openHighPriorityActions * (1 - params.actionClosurePct / 100)))
01893:     };
01894:     projected.avoidedDowntimeMinutes = base.downtimeMinutes - projected.downtimeMinutes;
01895:     return { ok: true, data: {
01896:       generatedAt: nowIso(),
01897:       logicVersion: "v4-scenario-1",
01898:       range: { since: new Date(range.since).toISOString(), until: new Date(range.until).toISOString() },
01899:       params,
01900:       baseline: base,
01901:       projected,
01902:       assumptions: [
01903:         "Percent reductions are user-supplied scenario assumptions, not predictions.",
01904:         "The scenario applies reductions independently and does not model causal interactions.",
01905:         "Breakdown count is shown as baseline evidence and is not automatically reduced without a validated failure model."
01906:       ],
01907:       confidence: "scenario-not-prediction"
~~~

~~~text
01884:       recurringPatterns: num(reliability.totals && reliability.totals.recurringPatterns),
01885:       sparepartRisks: (spare.risks || []).length,
01886:       openHighPriorityActions: num(overview.summary && overview.summary.openHighPriorityActions)
01887:     };
01888:     const projected = {
01889:       downtimeMinutes: Math.round(base.downtimeMinutes * (1 - params.downtimeReductionPct / 100)),
01890:       recurringPatterns: Math.max(0, Math.round(base.recurringPatterns * (1 - params.recurringReductionPct / 100))),
01891:       sparepartRisks: Math.max(0, Math.round(base.sparepartRisks * (1 - params.stockRiskReductionPct / 100))),
01892:       openHighPriorityActions: Math.max(0, Math.round(base.openHighPriorityActions * (1 - params.actionClosurePct / 100)))
01893:     };
01894:     projected.avoidedDowntimeMinutes = base.downtimeMinutes - projected.downtimeMinutes;
01895:     return { ok: true, data: {
01896:       generatedAt: nowIso(),
01897:       logicVersion: "v4-scenario-1",
01898:       range: { since: new Date(range.since).toISOString(), until: new Date(range.until).toISOString() },
01899:       params,
01900:       baseline: base,
01901:       projected,
01902:       assumptions: [
01903:         "Percent reductions are user-supplied scenario assumptions, not predictions.",
01904:         "The scenario applies reductions independently and does not model causal interactions.",
01905:         "Breakdown count is shown as baseline evidence and is not automatically reduced without a validated failure model."
01906:       ],
01907:       confidence: "scenario-not-prediction"
01908:     } };
01909:   }
01910:   __name(runScenario, "runScenario");
01911:   const SCENARIO_HEADERS = ["ID", "Name", "CreatedAt", "Actor", "ParamsJSON", "Status"];
01912:   const SCENARIO_RESULT_HEADERS = ["ID", "ScenarioID", "GeneratedAt", "LogicVersion", "ResultJSON"];
01913:   function saveScenario(body) {
~~~

~~~text
01896:       generatedAt: nowIso(),
01897:       logicVersion: "v4-scenario-1",
01898:       range: { since: new Date(range.since).toISOString(), until: new Date(range.until).toISOString() },
01899:       params,
01900:       baseline: base,
01901:       projected,
01902:       assumptions: [
01903:         "Percent reductions are user-supplied scenario assumptions, not predictions.",
01904:         "The scenario applies reductions independently and does not model causal interactions.",
01905:         "Breakdown count is shown as baseline evidence and is not automatically reduced without a validated failure model."
01906:       ],
01907:       confidence: "scenario-not-prediction"
01908:     } };
01909:   }
01910:   __name(runScenario, "runScenario");
01911:   const SCENARIO_HEADERS = ["ID", "Name", "CreatedAt", "Actor", "ParamsJSON", "Status"];
01912:   const SCENARIO_RESULT_HEADERS = ["ID", "ScenarioID", "GeneratedAt", "LogicVersion", "ResultJSON"];
01913:   function saveScenario(body) {
01914:     const name = text(body.name);
01915:     if (!name) return { ok: false, error: "VALIDATION_ERROR: name wajib" };
01916:     const result = runScenario(body);
01917:     if (!result.ok) return result;
01918:     const id = uuid(), ts = nowIso();
01919:     ensureSheet("V4_Scenario", SCENARIO_HEADERS).appendRow([id, name, ts, text(body.actor), JSON.stringify(result.data.params), "SAVED"]);
01920:     ensureSheet("V4_Scenario_Result", SCENARIO_RESULT_HEADERS).appendRow([uuid(), id, ts, result.data.logicVersion, JSON.stringify(result.data)]);
01921:     return { ok: true, data: { id, name, savedAt: ts, result: result.data } };
01922:   }
01923:   __name(saveScenario, "saveScenario");
01924:   function getScenarios() {
01925:     const scenarios = rows("V4_Scenario").sort((a, b) => dateValue(b) - dateValue(a)).slice(0, 100);
~~~

~~~text
02019:         addEdge("cat:knowledge", mid, "berisi");
02020:         addEdge(m, mid, "punya panduan", r);
02021:       }
02022:     });
02023:     log.slice(0, 140).forEach((r, i) => {
02024:       const m = machineNode(r);
02025:       if (!m) return;
02026:       const comp = componentNode(m, r);
02027:       const d = description(r), entryId = text(first(r, ["ID", "TransactionID"])) || "log-" + i;
02028:       let failure = null, symptom = null;
02029:       if (d) {
02030:         const sid = "symptom:" + idPart(d);
02031:         symptom = addNode(sid, d.slice(0, 80), "symptom", { description: d }, SHEETS.logbook);
02032:         addEdge("cat:failures", symptom, "berisi");
02033:         addEdge(comp || m, symptom, "menunjukkan gejala", r);
02034:         const failureLike = /breakdown|failure|abnormal|emergency|corrective/.test(lower(first(r, ["Jenis Pekerjaan", "Kategori", "Status"]))) || downtimeMinutes(r) > 0;
02035:         if (failureLike) {
02036:           const fid = "failure:" + idPart(entryId);
02037:           failure = addNode(fid, d.slice(0, 80), "failure", r, SHEETS.logbook);
02038:           addEdge("cat:failures", failure, "berisi");
02039:           addEdge(comp || m, failure, "pernah mengalami", r);
02040:           addEdge(failure, symptom, "muncul sebagai", r);
02041:         }
02042:       }
02043:       const action = text(first(r, ["Tindakan Perbaikan", "Corrective Action", "Action"]));
02044:       if (action) {
02045:         const aid = "action:" + idPart(entryId + "|" + action);
02046:         addNode(aid, action.slice(0, 80), "corrective_action", r, SHEETS.logbook);
02047:         addEdge("cat:knowledge", aid, "berisi");
02048:         addEdge(failure || symptom || m, aid, "ditangani dengan", r);
~~~

~~~text
02035:         if (failureLike) {
02036:           const fid = "failure:" + idPart(entryId);
02037:           failure = addNode(fid, d.slice(0, 80), "failure", r, SHEETS.logbook);
02038:           addEdge("cat:failures", failure, "berisi");
02039:           addEdge(comp || m, failure, "pernah mengalami", r);
02040:           addEdge(failure, symptom, "muncul sebagai", r);
02041:         }
02042:       }
02043:       const action = text(first(r, ["Tindakan Perbaikan", "Corrective Action", "Action"]));
02044:       if (action) {
02045:         const aid = "action:" + idPart(entryId + "|" + action);
02046:         addNode(aid, action.slice(0, 80), "corrective_action", r, SHEETS.logbook);
02047:         addEdge("cat:knowledge", aid, "berisi");
02048:         addEdge(failure || symptom || m, aid, "ditangani dengan", r);
02049:       }
02050:       const person = text(first(r, ["Nama Pelapor", "Technician", "PIC", "Pelapor", "Teknisi"]));
02051:       if (person) {
02052:         const pid = "person:" + idPart(person);
02053:         addNode(pid, person, "person", { name: person }, SHEETS.logbook);
02054:         addEdge("cat:people", pid, "berisi");
02055:         addEdge(failure || symptom || m, pid, "ditangani / dicatat oleh", r);
02056:       }
02057:       const directPart = materialNumber(r) || materialName(r);
02058:       const partNames = [...directPart ? [directPart] : [], ...splitParts(first(r, ["Spare Part Digunakan", "Sparepart Digunakan", "Parts Used"]))].slice(0, 4);
02059:       partNames.forEach((part) => {
02060:         const pid = partNode(r, part);
02061:         if (pid) {
02062:           addEdge(m, pid, "memakai", r);
02063:           if (failure || symptom) addEdge(failure || symptom, pid, "melibatkan sparepart", r);
02064:         }
~~~

~~~text
02036:           const fid = "failure:" + idPart(entryId);
02037:           failure = addNode(fid, d.slice(0, 80), "failure", r, SHEETS.logbook);
02038:           addEdge("cat:failures", failure, "berisi");
02039:           addEdge(comp || m, failure, "pernah mengalami", r);
02040:           addEdge(failure, symptom, "muncul sebagai", r);
02041:         }
02042:       }
02043:       const action = text(first(r, ["Tindakan Perbaikan", "Corrective Action", "Action"]));
02044:       if (action) {
02045:         const aid = "action:" + idPart(entryId + "|" + action);
02046:         addNode(aid, action.slice(0, 80), "corrective_action", r, SHEETS.logbook);
02047:         addEdge("cat:knowledge", aid, "berisi");
02048:         addEdge(failure || symptom || m, aid, "ditangani dengan", r);
02049:       }
02050:       const person = text(first(r, ["Nama Pelapor", "Technician", "PIC", "Pelapor", "Teknisi"]));
02051:       if (person) {
02052:         const pid = "person:" + idPart(person);
02053:         addNode(pid, person, "person", { name: person }, SHEETS.logbook);
02054:         addEdge("cat:people", pid, "berisi");
02055:         addEdge(failure || symptom || m, pid, "ditangani / dicatat oleh", r);
02056:       }
02057:       const directPart = materialNumber(r) || materialName(r);
02058:       const partNames = [...directPart ? [directPart] : [], ...splitParts(first(r, ["Spare Part Digunakan", "Sparepart Digunakan", "Parts Used"]))].slice(0, 4);
02059:       partNames.forEach((part) => {
02060:         const pid = partNode(r, part);
02061:         if (pid) {
02062:           addEdge(m, pid, "memakai", r);
02063:           if (failure || symptom) addEdge(failure || symptom, pid, "melibatkan sparepart", r);
02064:         }
02065:       });
~~~

~~~text
02037:           failure = addNode(fid, d.slice(0, 80), "failure", r, SHEETS.logbook);
02038:           addEdge("cat:failures", failure, "berisi");
02039:           addEdge(comp || m, failure, "pernah mengalami", r);
02040:           addEdge(failure, symptom, "muncul sebagai", r);
02041:         }
02042:       }
02043:       const action = text(first(r, ["Tindakan Perbaikan", "Corrective Action", "Action"]));
02044:       if (action) {
02045:         const aid = "action:" + idPart(entryId + "|" + action);
02046:         addNode(aid, action.slice(0, 80), "corrective_action", r, SHEETS.logbook);
02047:         addEdge("cat:knowledge", aid, "berisi");
02048:         addEdge(failure || symptom || m, aid, "ditangani dengan", r);
02049:       }
02050:       const person = text(first(r, ["Nama Pelapor", "Technician", "PIC", "Pelapor", "Teknisi"]));
02051:       if (person) {
02052:         const pid = "person:" + idPart(person);
02053:         addNode(pid, person, "person", { name: person }, SHEETS.logbook);
02054:         addEdge("cat:people", pid, "berisi");
02055:         addEdge(failure || symptom || m, pid, "ditangani / dicatat oleh", r);
02056:       }
02057:       const directPart = materialNumber(r) || materialName(r);
02058:       const partNames = [...directPart ? [directPart] : [], ...splitParts(first(r, ["Spare Part Digunakan", "Sparepart Digunakan", "Parts Used"]))].slice(0, 4);
02059:       partNames.forEach((part) => {
02060:         const pid = partNode(r, part);
02061:         if (pid) {
02062:           addEdge(m, pid, "memakai", r);
02063:           if (failure || symptom) addEdge(failure || symptom, pid, "melibatkan sparepart", r);
02064:         }
02065:       });
02066:       const rawCost = first(r, ["Failure Cost", "Downtime Cost", "Loss Cost", "Cost", "Biaya"], "");
~~~

~~~text
02038:           addEdge("cat:failures", failure, "berisi");
02039:           addEdge(comp || m, failure, "pernah mengalami", r);
02040:           addEdge(failure, symptom, "muncul sebagai", r);
02041:         }
02042:       }
02043:       const action = text(first(r, ["Tindakan Perbaikan", "Corrective Action", "Action"]));
02044:       if (action) {
02045:         const aid = "action:" + idPart(entryId + "|" + action);
02046:         addNode(aid, action.slice(0, 80), "corrective_action", r, SHEETS.logbook);
02047:         addEdge("cat:knowledge", aid, "berisi");
02048:         addEdge(failure || symptom || m, aid, "ditangani dengan", r);
02049:       }
02050:       const person = text(first(r, ["Nama Pelapor", "Technician", "PIC", "Pelapor", "Teknisi"]));
02051:       if (person) {
02052:         const pid = "person:" + idPart(person);
02053:         addNode(pid, person, "person", { name: person }, SHEETS.logbook);
02054:         addEdge("cat:people", pid, "berisi");
02055:         addEdge(failure || symptom || m, pid, "ditangani / dicatat oleh", r);
02056:       }
02057:       const directPart = materialNumber(r) || materialName(r);
02058:       const partNames = [...directPart ? [directPart] : [], ...splitParts(first(r, ["Spare Part Digunakan", "Sparepart Digunakan", "Parts Used"]))].slice(0, 4);
02059:       partNames.forEach((part) => {
02060:         const pid = partNode(r, part);
02061:         if (pid) {
02062:           addEdge(m, pid, "memakai", r);
02063:           if (failure || symptom) addEdge(failure || symptom, pid, "melibatkan sparepart", r);
02064:         }
02065:       });
02066:       const rawCost = first(r, ["Failure Cost", "Downtime Cost", "Loss Cost", "Cost", "Biaya"], "");
02067:       if (rawCost !== "" && rawCost !== null && rawCost !== void 0) {
~~~

~~~text
02077:       const comp = componentNode(m, r), d = description(r);
02078:       if (!d) return;
02079:       const sid = "symptom:" + idPart(d);
02080:       addNode(sid, d.slice(0, 80), "symptom", r, SHEETS.predictive);
02081:       addEdge("cat:failures", sid, "berisi");
02082:       addEdge(comp || m, sid, "punya temuan prediktif", r);
02083:     });
02084:     corrective.slice(0, 50).forEach((r, i) => {
02085:       const m = machineNode(r), label = text(first(r, ["Corrective Action", "Problem", "Description"])) || "Corrective " + i;
02086:       const id = "corrective:" + idPart(text(first(r, ["ID"])) || label + "-" + i);
02087:       addNode(id, label.slice(0, 90), "corrective_action", r, SHEETS.corrective);
02088:       addEdge("cat:knowledge", id, "berisi");
02089:       if (m) addEdge(m, id, "punya laporan perbaikan", r);
02090:       const root = text(first(r, ["Root Cause"]));
02091:       if (root) {
02092:         const sid = "cause:" + idPart(root);
02093:         addNode(sid, root.slice(0, 80), "root_cause", r, SHEETS.corrective);
02094:         addEdge("cat:failures", sid, "berisi");
02095:         addEdge(id, sid, "menangani penyebab", r);
02096:       }
02097:     });
02098:     rca.slice(0, 50).forEach((r, i) => {
02099:       const m = machineNode(r), rid = "rca:" + idPart(text(first(r, ["ID"])) || "rca-" + i);
02100:       addNode(rid, text(first(r, ["Title", "Judul"])) || "RCA", "rca", r, SHEETS.rca);
02101:       addEdge("cat:knowledge", rid, "berisi");
02102:       if (m) addEdge(m, rid, "punya RCA", r);
02103:     });
02104:     kb.slice(0, 60).forEach((r, i) => {
02105:       const type = /sop/i.test(lower(first(r, ["Kategori", "Source Type", "Judul"]))) ? "sop" : /manual/i.test(lower(first(r, ["Kategori", "Source Type", "Judul"]))) ? "manual" : "knowledge";
02106:       const kid = type + ":" + idPart(text(first(r, ["ID"])) || "kb-" + i);
~~~

~~~text
02079:       const sid = "symptom:" + idPart(d);
02080:       addNode(sid, d.slice(0, 80), "symptom", r, SHEETS.predictive);
02081:       addEdge("cat:failures", sid, "berisi");
02082:       addEdge(comp || m, sid, "punya temuan prediktif", r);
02083:     });
02084:     corrective.slice(0, 50).forEach((r, i) => {
02085:       const m = machineNode(r), label = text(first(r, ["Corrective Action", "Problem", "Description"])) || "Corrective " + i;
02086:       const id = "corrective:" + idPart(text(first(r, ["ID"])) || label + "-" + i);
02087:       addNode(id, label.slice(0, 90), "corrective_action", r, SHEETS.corrective);
02088:       addEdge("cat:knowledge", id, "berisi");
02089:       if (m) addEdge(m, id, "punya laporan perbaikan", r);
02090:       const root = text(first(r, ["Root Cause"]));
02091:       if (root) {
02092:         const sid = "cause:" + idPart(root);
02093:         addNode(sid, root.slice(0, 80), "root_cause", r, SHEETS.corrective);
02094:         addEdge("cat:failures", sid, "berisi");
02095:         addEdge(id, sid, "menangani penyebab", r);
02096:       }
02097:     });
02098:     rca.slice(0, 50).forEach((r, i) => {
02099:       const m = machineNode(r), rid = "rca:" + idPart(text(first(r, ["ID"])) || "rca-" + i);
02100:       addNode(rid, text(first(r, ["Title", "Judul"])) || "RCA", "rca", r, SHEETS.rca);
02101:       addEdge("cat:knowledge", rid, "berisi");
02102:       if (m) addEdge(m, rid, "punya RCA", r);
02103:     });
02104:     kb.slice(0, 60).forEach((r, i) => {
02105:       const type = /sop/i.test(lower(first(r, ["Kategori", "Source Type", "Judul"]))) ? "sop" : /manual/i.test(lower(first(r, ["Kategori", "Source Type", "Judul"]))) ? "manual" : "knowledge";
02106:       const kid = type + ":" + idPart(text(first(r, ["ID"])) || "kb-" + i);
02107:       addNode(kid, text(first(r, ["Judul", "Title"])) || type, type, r, SHEETS.kb);
02108:       addEdge("cat:knowledge", kid, "berisi");
~~~

~~~text
02295:         events.push({
02296:           source,
02297:           timestamp: new Date(t).toISOString(),
02298:           machine: machineCode(r) || machineName(r) || "",
02299:           event: description(r) || text(first(r, ["Title", "Judul", "Problem", "Root Cause"])) || "Recorded maintenance event",
02300:           status: text(first(r, ["Status", "Severity", "Prioritas"])),
02301:           priority: text(first(r, ["Prioritas", "Severity"])),
02302:           downtimeMinutes: Math.round(downtimeMinutes(r)),
02303:           recordId: text(first(r, ["ID", "TransactionID", "Entry ID"])),
02304:           record: cleanRecord(r, 10)
02305:         });
02306:       });
02307:     });
02308:     events.sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));
02309:     const bySource = {};
02310:     events.forEach((e) => {
02311:       bySource[e.source] = (bySource[e.source] || 0) + 1;
02312:     });
02313:     const machineCounts = /* @__PURE__ */ new Map();
02314:     events.forEach((e) => {
02315:       if (e.machine) machineCounts.set(e.machine, (machineCounts.get(e.machine) || 0) + 1);
02316:     });
02317:     return { ok: true, data: {
02318:       generatedAt: nowIso(),
02319:       logicVersion: "v4-black-box-1",
02320:       range: { since: new Date(range.since).toISOString(), until: new Date(range.until).toISOString() },
02321:       appliedScope: { machine: scope.machine || "", area: scope.area || "" },
02322:       summary: {
02323:         events: events.length,
02324:         downtimeMinutes: events.reduce((n, e) => n + e.downtimeMinutes, 0),
~~~

~~~text
02464:       const manuals = knowledge.filter((r) => /manual|sop|instruksi|instruction/.test(lower(first(r, ["Kategori", "Source Type", "Judul", "Title"])))).slice(0, 10);
02465:       const machineEvents = sourceRows(SHEETS.logbook).filter((r) => matchesMachine(r, machine)).sort((x, y) => dateValue(y) - dateValue(x)).slice(0, 30);
02466:       const files = [];
02467:       machineEvents.forEach((r) => Object.entries(r).forEach(([k, v]) => {
02468:         if (/file|foto|photo|video|lampiran|attachment/i.test(k) && v && String(v).trim()) files.push({ source: SHEETS.logbook, field: k, value: typeof v === "string" && v.length > 600 ? v.slice(0, 600) + "\u2026" : v, recordId: first(r, ["ID"]) });
02469:       }));
02470:       const warEvents = events.filter((r) => text(r.WarRoomID) === id).slice(0, 200);
02471:       const decisions = warEvents.filter((r) => /decision|keputusan/i.test(text(r.Type) + " " + text(r.Message)));
02472:       const actions = warEvents.filter((r) => /action|aksi|task/i.test(text(r.Type) + " " + text(r.Message)));
02473:       const similar = (memory.hits || []).slice(0, 8);
02474:       return { ok: true, data: {
02475:         war: cleanRecord(war, 20),
02476:         events: warEvents.map((r) => cleanRecord(r, 12)),
02477:         latestUpdate: warEvents[0] ? cleanRecord(warEvents[0], 12) : null,
02478:         context: {
02479:           currentCondition: passport.currentCondition,
02480:           reliability: passport.reliability,
02481:           openIssues: passport.currentCondition && passport.currentCondition.openIssues || [],
02482:           experts: (expert.experts || []).slice(0, 8),
02483:           similarCases: similar,
02484:           candidateRootCauseEvidence: similar.slice(0, 5).map((x) => ({ description: x.description, score: x.score, source: x.sheet })),
02485:           sparepart: { stock: stock.map((r) => cleanRecord(r, 12)), eta: eta.map((r) => cleanRecord(r, 12)) },
02486:           rca: rca.map((r) => cleanRecord(r, 12)),
02487:           knowledge: knowledge.map((r) => cleanRecord(r, 12)),
02488:           manuals: manuals.map((r) => cleanRecord(r, 12)),
02489:           files: files.slice(0, 30),
02490:           decisions: decisions.map((r) => cleanRecord(r, 12)),
02491:           actions: actions.map((r) => cleanRecord(r, 12))
02492:         },
02493:         disclaimer: "Candidate causes and similar cases are evidence for human review, not confirmed root cause."
~~~

~~~text
02483:           similarCases: similar,
02484:           candidateRootCauseEvidence: similar.slice(0, 5).map((x) => ({ description: x.description, score: x.score, source: x.sheet })),
02485:           sparepart: { stock: stock.map((r) => cleanRecord(r, 12)), eta: eta.map((r) => cleanRecord(r, 12)) },
02486:           rca: rca.map((r) => cleanRecord(r, 12)),
02487:           knowledge: knowledge.map((r) => cleanRecord(r, 12)),
02488:           manuals: manuals.map((r) => cleanRecord(r, 12)),
02489:           files: files.slice(0, 30),
02490:           decisions: decisions.map((r) => cleanRecord(r, 12)),
02491:           actions: actions.map((r) => cleanRecord(r, 12))
02492:         },
02493:         disclaimer: "Candidate causes and similar cases are evidence for human review, not confirmed root cause."
02494:       } };
02495:     }
02496:     return { ok: true, data: { wars: wars.slice(0, 100).map((r) => cleanRecord(r, 20)) } };
02497:   }
02498:   __name(getWarRoom, "getWarRoom");
02499:   function getKnowledgeCandidates(body) {
02500:     const scope = scopeContext(body || {}), log = sourceRows(SHEETS.logbook).filter(scope.record), rca = sourceRows(SHEETS.rca).filter(scope.record), kb = sourceRows(SHEETS.kb);
02501:     const known = kb.map((r) => lower([first(r, ["Judul", "Title"]), first(r, ["Konten", "Content"]), machineCode(r), machineName(r)].join(" "))).join(" || ");
02502:     const groups = /* @__PURE__ */ new Map();
02503:     log.filter((r) => isClosed(r) && text(first(r, ["Tindakan Perbaikan", "Corrective Action"]))).forEach((r) => {
02504:       const machine = machineCode(r) || machineName(r), problem = description(r), action = text(first(r, ["Tindakan Perbaikan", "Corrective Action"]));
02505:       if (!problem || !action) return;
02506:       const key = lower(machine) + "|" + words(problem).sort().slice(0, 7).join("|");
02507:       const cur = groups.get(key) || { machine, problem, actions: /* @__PURE__ */ new Map(), count: 0, sourceIds: [], latest: 0 };
02508:       cur.count++;
02509:       cur.actions.set(action, (cur.actions.get(action) || 0) + 1);
02510:       const id = first(r, ["ID", "TransactionID"]);
02511:       if (id && cur.sourceIds.length < 20) cur.sourceIds.push(id);
02512:       cur.latest = Math.max(cur.latest, dateValue(r) || 0);
~~~

~~~text
02495:     }
02496:     return { ok: true, data: { wars: wars.slice(0, 100).map((r) => cleanRecord(r, 20)) } };
02497:   }
02498:   __name(getWarRoom, "getWarRoom");
02499:   function getKnowledgeCandidates(body) {
02500:     const scope = scopeContext(body || {}), log = sourceRows(SHEETS.logbook).filter(scope.record), rca = sourceRows(SHEETS.rca).filter(scope.record), kb = sourceRows(SHEETS.kb);
02501:     const known = kb.map((r) => lower([first(r, ["Judul", "Title"]), first(r, ["Konten", "Content"]), machineCode(r), machineName(r)].join(" "))).join(" || ");
02502:     const groups = /* @__PURE__ */ new Map();
02503:     log.filter((r) => isClosed(r) && text(first(r, ["Tindakan Perbaikan", "Corrective Action"]))).forEach((r) => {
02504:       const machine = machineCode(r) || machineName(r), problem = description(r), action = text(first(r, ["Tindakan Perbaikan", "Corrective Action"]));
02505:       if (!problem || !action) return;
02506:       const key = lower(machine) + "|" + words(problem).sort().slice(0, 7).join("|");
02507:       const cur = groups.get(key) || { machine, problem, actions: /* @__PURE__ */ new Map(), count: 0, sourceIds: [], latest: 0 };
02508:       cur.count++;
02509:       cur.actions.set(action, (cur.actions.get(action) || 0) + 1);
02510:       const id = first(r, ["ID", "TransactionID"]);
02511:       if (id && cur.sourceIds.length < 20) cur.sourceIds.push(id);
02512:       cur.latest = Math.max(cur.latest, dateValue(r) || 0);
02513:       groups.set(key, cur);
02514:     });
02515:     const candidates = [...groups.values()].filter((x) => x.count >= 2).map((x) => {
02516:       const top = [...x.actions.entries()].sort((a, b) => b[1] - a[1])[0] || ["", 0];
02517:       const corpus = lower(x.machine + " " + x.problem + " " + top[0]), hasMatch = words(corpus).some((w) => w.length > 4 && known.includes(w)) && known.includes(lower(x.machine));
02518:       return { machine: x.machine, problem: x.problem, recurrence: x.count, mostRecordedAction: top[0], actionFrequency: top[1], sourceIds: x.sourceIds, latest: x.latest ? new Date(x.latest).toISOString() : "", existingKnowledgePossibleMatch: hasMatch, label: hasMatch ? "REVIEW_EXISTING_KB_FIRST" : "KNOWLEDGE_DRAFT_CANDIDATE" };
02519:     }).sort((a, b) => b.recurrence - a.recurrence).slice(0, 50);
02520:     const rcaCandidates = rca.filter((r) => text(first(r, ["Title", "Judul"]))).slice(0, 30).map((r) => ({ machine: machineCode(r) || machineName(r), problem: first(r, ["Title", "Judul"]), recurrence: 1, sourceIds: [first(r, ["ID"])], latest: dateValue(r) ? new Date(dateValue(r)).toISOString() : "", existingKnowledgePossibleMatch: false, label: "RCA_REVIEW_CANDIDATE" }));
02521:     return { ok: true, data: { generatedAt: nowIso(), candidates: [...candidates, ...rcaCandidates].slice(0, 60), existingKnowledgeRecords: kb.length, autoWrite: "NONE", draftAction: "v4.aiAsk purpose=manual/ask", lineage: { sourceOfTruth: "EXISTING_OMODOS", operationalWrites: "NONE" }, note: "Candidates must be reviewed and saved through the official Knowledge Base workflow. Existing KB is checked first to reduce duplication." } };
02522:   }
02523:   __name(getKnowledgeCandidates, "getKnowledgeCandidates");
02524:   function ask(body) {
~~~

~~~text
02496:     return { ok: true, data: { wars: wars.slice(0, 100).map((r) => cleanRecord(r, 20)) } };
02497:   }
02498:   __name(getWarRoom, "getWarRoom");
02499:   function getKnowledgeCandidates(body) {
02500:     const scope = scopeContext(body || {}), log = sourceRows(SHEETS.logbook).filter(scope.record), rca = sourceRows(SHEETS.rca).filter(scope.record), kb = sourceRows(SHEETS.kb);
02501:     const known = kb.map((r) => lower([first(r, ["Judul", "Title"]), first(r, ["Konten", "Content"]), machineCode(r), machineName(r)].join(" "))).join(" || ");
02502:     const groups = /* @__PURE__ */ new Map();
02503:     log.filter((r) => isClosed(r) && text(first(r, ["Tindakan Perbaikan", "Corrective Action"]))).forEach((r) => {
02504:       const machine = machineCode(r) || machineName(r), problem = description(r), action = text(first(r, ["Tindakan Perbaikan", "Corrective Action"]));
02505:       if (!problem || !action) return;
02506:       const key = lower(machine) + "|" + words(problem).sort().slice(0, 7).join("|");
02507:       const cur = groups.get(key) || { machine, problem, actions: /* @__PURE__ */ new Map(), count: 0, sourceIds: [], latest: 0 };
02508:       cur.count++;
02509:       cur.actions.set(action, (cur.actions.get(action) || 0) + 1);
02510:       const id = first(r, ["ID", "TransactionID"]);
02511:       if (id && cur.sourceIds.length < 20) cur.sourceIds.push(id);
02512:       cur.latest = Math.max(cur.latest, dateValue(r) || 0);
02513:       groups.set(key, cur);
02514:     });
02515:     const candidates = [...groups.values()].filter((x) => x.count >= 2).map((x) => {
02516:       const top = [...x.actions.entries()].sort((a, b) => b[1] - a[1])[0] || ["", 0];
02517:       const corpus = lower(x.machine + " " + x.problem + " " + top[0]), hasMatch = words(corpus).some((w) => w.length > 4 && known.includes(w)) && known.includes(lower(x.machine));
02518:       return { machine: x.machine, problem: x.problem, recurrence: x.count, mostRecordedAction: top[0], actionFrequency: top[1], sourceIds: x.sourceIds, latest: x.latest ? new Date(x.latest).toISOString() : "", existingKnowledgePossibleMatch: hasMatch, label: hasMatch ? "REVIEW_EXISTING_KB_FIRST" : "KNOWLEDGE_DRAFT_CANDIDATE" };
02519:     }).sort((a, b) => b.recurrence - a.recurrence).slice(0, 50);
02520:     const rcaCandidates = rca.filter((r) => text(first(r, ["Title", "Judul"]))).slice(0, 30).map((r) => ({ machine: machineCode(r) || machineName(r), problem: first(r, ["Title", "Judul"]), recurrence: 1, sourceIds: [first(r, ["ID"])], latest: dateValue(r) ? new Date(dateValue(r)).toISOString() : "", existingKnowledgePossibleMatch: false, label: "RCA_REVIEW_CANDIDATE" }));
02521:     return { ok: true, data: { generatedAt: nowIso(), candidates: [...candidates, ...rcaCandidates].slice(0, 60), existingKnowledgeRecords: kb.length, autoWrite: "NONE", draftAction: "v4.aiAsk purpose=manual/ask", lineage: { sourceOfTruth: "EXISTING_OMODOS", operationalWrites: "NONE" }, note: "Candidates must be reviewed and saved through the official Knowledge Base workflow. Existing KB is checked first to reduce duplication." } };
02522:   }
02523:   __name(getKnowledgeCandidates, "getKnowledgeCandidates");
02524:   function ask(body) {
02525:     const q = lower(body.query || body.question);
~~~

~~~text
02497:   }
02498:   __name(getWarRoom, "getWarRoom");
02499:   function getKnowledgeCandidates(body) {
02500:     const scope = scopeContext(body || {}), log = sourceRows(SHEETS.logbook).filter(scope.record), rca = sourceRows(SHEETS.rca).filter(scope.record), kb = sourceRows(SHEETS.kb);
02501:     const known = kb.map((r) => lower([first(r, ["Judul", "Title"]), first(r, ["Konten", "Content"]), machineCode(r), machineName(r)].join(" "))).join(" || ");
02502:     const groups = /* @__PURE__ */ new Map();
02503:     log.filter((r) => isClosed(r) && text(first(r, ["Tindakan Perbaikan", "Corrective Action"]))).forEach((r) => {
02504:       const machine = machineCode(r) || machineName(r), problem = description(r), action = text(first(r, ["Tindakan Perbaikan", "Corrective Action"]));
02505:       if (!problem || !action) return;
02506:       const key = lower(machine) + "|" + words(problem).sort().slice(0, 7).join("|");
02507:       const cur = groups.get(key) || { machine, problem, actions: /* @__PURE__ */ new Map(), count: 0, sourceIds: [], latest: 0 };
02508:       cur.count++;
02509:       cur.actions.set(action, (cur.actions.get(action) || 0) + 1);
02510:       const id = first(r, ["ID", "TransactionID"]);
02511:       if (id && cur.sourceIds.length < 20) cur.sourceIds.push(id);
02512:       cur.latest = Math.max(cur.latest, dateValue(r) || 0);
02513:       groups.set(key, cur);
02514:     });
02515:     const candidates = [...groups.values()].filter((x) => x.count >= 2).map((x) => {
02516:       const top = [...x.actions.entries()].sort((a, b) => b[1] - a[1])[0] || ["", 0];
02517:       const corpus = lower(x.machine + " " + x.problem + " " + top[0]), hasMatch = words(corpus).some((w) => w.length > 4 && known.includes(w)) && known.includes(lower(x.machine));
02518:       return { machine: x.machine, problem: x.problem, recurrence: x.count, mostRecordedAction: top[0], actionFrequency: top[1], sourceIds: x.sourceIds, latest: x.latest ? new Date(x.latest).toISOString() : "", existingKnowledgePossibleMatch: hasMatch, label: hasMatch ? "REVIEW_EXISTING_KB_FIRST" : "KNOWLEDGE_DRAFT_CANDIDATE" };
02519:     }).sort((a, b) => b.recurrence - a.recurrence).slice(0, 50);
02520:     const rcaCandidates = rca.filter((r) => text(first(r, ["Title", "Judul"]))).slice(0, 30).map((r) => ({ machine: machineCode(r) || machineName(r), problem: first(r, ["Title", "Judul"]), recurrence: 1, sourceIds: [first(r, ["ID"])], latest: dateValue(r) ? new Date(dateValue(r)).toISOString() : "", existingKnowledgePossibleMatch: false, label: "RCA_REVIEW_CANDIDATE" }));
02521:     return { ok: true, data: { generatedAt: nowIso(), candidates: [...candidates, ...rcaCandidates].slice(0, 60), existingKnowledgeRecords: kb.length, autoWrite: "NONE", draftAction: "v4.aiAsk purpose=manual/ask", lineage: { sourceOfTruth: "EXISTING_OMODOS", operationalWrites: "NONE" }, note: "Candidates must be reviewed and saved through the official Knowledge Base workflow. Existing KB is checked first to reduce duplication." } };
02522:   }
02523:   __name(getKnowledgeCandidates, "getKnowledgeCandidates");
02524:   function ask(body) {
02525:     const q = lower(body.query || body.question);
02526:     if (!q) return { ok: false, error: "VALIDATION_ERROR: query wajib" };
~~~

~~~text
02499:   function getKnowledgeCandidates(body) {
02500:     const scope = scopeContext(body || {}), log = sourceRows(SHEETS.logbook).filter(scope.record), rca = sourceRows(SHEETS.rca).filter(scope.record), kb = sourceRows(SHEETS.kb);
02501:     const known = kb.map((r) => lower([first(r, ["Judul", "Title"]), first(r, ["Konten", "Content"]), machineCode(r), machineName(r)].join(" "))).join(" || ");
02502:     const groups = /* @__PURE__ */ new Map();
02503:     log.filter((r) => isClosed(r) && text(first(r, ["Tindakan Perbaikan", "Corrective Action"]))).forEach((r) => {
02504:       const machine = machineCode(r) || machineName(r), problem = description(r), action = text(first(r, ["Tindakan Perbaikan", "Corrective Action"]));
02505:       if (!problem || !action) return;
02506:       const key = lower(machine) + "|" + words(problem).sort().slice(0, 7).join("|");
02507:       const cur = groups.get(key) || { machine, problem, actions: /* @__PURE__ */ new Map(), count: 0, sourceIds: [], latest: 0 };
02508:       cur.count++;
02509:       cur.actions.set(action, (cur.actions.get(action) || 0) + 1);
02510:       const id = first(r, ["ID", "TransactionID"]);
02511:       if (id && cur.sourceIds.length < 20) cur.sourceIds.push(id);
02512:       cur.latest = Math.max(cur.latest, dateValue(r) || 0);
02513:       groups.set(key, cur);
02514:     });
02515:     const candidates = [...groups.values()].filter((x) => x.count >= 2).map((x) => {
02516:       const top = [...x.actions.entries()].sort((a, b) => b[1] - a[1])[0] || ["", 0];
02517:       const corpus = lower(x.machine + " " + x.problem + " " + top[0]), hasMatch = words(corpus).some((w) => w.length > 4 && known.includes(w)) && known.includes(lower(x.machine));
02518:       return { machine: x.machine, problem: x.problem, recurrence: x.count, mostRecordedAction: top[0], actionFrequency: top[1], sourceIds: x.sourceIds, latest: x.latest ? new Date(x.latest).toISOString() : "", existingKnowledgePossibleMatch: hasMatch, label: hasMatch ? "REVIEW_EXISTING_KB_FIRST" : "KNOWLEDGE_DRAFT_CANDIDATE" };
02519:     }).sort((a, b) => b.recurrence - a.recurrence).slice(0, 50);
02520:     const rcaCandidates = rca.filter((r) => text(first(r, ["Title", "Judul"]))).slice(0, 30).map((r) => ({ machine: machineCode(r) || machineName(r), problem: first(r, ["Title", "Judul"]), recurrence: 1, sourceIds: [first(r, ["ID"])], latest: dateValue(r) ? new Date(dateValue(r)).toISOString() : "", existingKnowledgePossibleMatch: false, label: "RCA_REVIEW_CANDIDATE" }));
02521:     return { ok: true, data: { generatedAt: nowIso(), candidates: [...candidates, ...rcaCandidates].slice(0, 60), existingKnowledgeRecords: kb.length, autoWrite: "NONE", draftAction: "v4.aiAsk purpose=manual/ask", lineage: { sourceOfTruth: "EXISTING_OMODOS", operationalWrites: "NONE" }, note: "Candidates must be reviewed and saved through the official Knowledge Base workflow. Existing KB is checked first to reduce duplication." } };
02522:   }
02523:   __name(getKnowledgeCandidates, "getKnowledgeCandidates");
02524:   function ask(body) {
02525:     const q = lower(body.query || body.question);
02526:     if (!q) return { ok: false, error: "VALIDATION_ERROR: query wajib" };
02527:     const terms = q.split(/\s+/).filter((x) => x.length > 2).slice(0, 12);
02528:     const sources = [SHEETS.logbook, SHEETS.breakdown, SHEETS.predictive, SHEETS.rca, SHEETS.kb, SHEETS.project, SHEETS.kaizen, SHEETS.stock];
~~~

~~~text
02501:     const known = kb.map((r) => lower([first(r, ["Judul", "Title"]), first(r, ["Konten", "Content"]), machineCode(r), machineName(r)].join(" "))).join(" || ");
02502:     const groups = /* @__PURE__ */ new Map();
02503:     log.filter((r) => isClosed(r) && text(first(r, ["Tindakan Perbaikan", "Corrective Action"]))).forEach((r) => {
02504:       const machine = machineCode(r) || machineName(r), problem = description(r), action = text(first(r, ["Tindakan Perbaikan", "Corrective Action"]));
02505:       if (!problem || !action) return;
02506:       const key = lower(machine) + "|" + words(problem).sort().slice(0, 7).join("|");
02507:       const cur = groups.get(key) || { machine, problem, actions: /* @__PURE__ */ new Map(), count: 0, sourceIds: [], latest: 0 };
02508:       cur.count++;
02509:       cur.actions.set(action, (cur.actions.get(action) || 0) + 1);
02510:       const id = first(r, ["ID", "TransactionID"]);
02511:       if (id && cur.sourceIds.length < 20) cur.sourceIds.push(id);
02512:       cur.latest = Math.max(cur.latest, dateValue(r) || 0);
02513:       groups.set(key, cur);
02514:     });
02515:     const candidates = [...groups.values()].filter((x) => x.count >= 2).map((x) => {
02516:       const top = [...x.actions.entries()].sort((a, b) => b[1] - a[1])[0] || ["", 0];
02517:       const corpus = lower(x.machine + " " + x.problem + " " + top[0]), hasMatch = words(corpus).some((w) => w.length > 4 && known.includes(w)) && known.includes(lower(x.machine));
02518:       return { machine: x.machine, problem: x.problem, recurrence: x.count, mostRecordedAction: top[0], actionFrequency: top[1], sourceIds: x.sourceIds, latest: x.latest ? new Date(x.latest).toISOString() : "", existingKnowledgePossibleMatch: hasMatch, label: hasMatch ? "REVIEW_EXISTING_KB_FIRST" : "KNOWLEDGE_DRAFT_CANDIDATE" };
02519:     }).sort((a, b) => b.recurrence - a.recurrence).slice(0, 50);
02520:     const rcaCandidates = rca.filter((r) => text(first(r, ["Title", "Judul"]))).slice(0, 30).map((r) => ({ machine: machineCode(r) || machineName(r), problem: first(r, ["Title", "Judul"]), recurrence: 1, sourceIds: [first(r, ["ID"])], latest: dateValue(r) ? new Date(dateValue(r)).toISOString() : "", existingKnowledgePossibleMatch: false, label: "RCA_REVIEW_CANDIDATE" }));
02521:     return { ok: true, data: { generatedAt: nowIso(), candidates: [...candidates, ...rcaCandidates].slice(0, 60), existingKnowledgeRecords: kb.length, autoWrite: "NONE", draftAction: "v4.aiAsk purpose=manual/ask", lineage: { sourceOfTruth: "EXISTING_OMODOS", operationalWrites: "NONE" }, note: "Candidates must be reviewed and saved through the official Knowledge Base workflow. Existing KB is checked first to reduce duplication." } };
02522:   }
02523:   __name(getKnowledgeCandidates, "getKnowledgeCandidates");
02524:   function ask(body) {
02525:     const q = lower(body.query || body.question);
02526:     if (!q) return { ok: false, error: "VALIDATION_ERROR: query wajib" };
02527:     const terms = q.split(/\s+/).filter((x) => x.length > 2).slice(0, 12);
02528:     const sources = [SHEETS.logbook, SHEETS.breakdown, SHEETS.predictive, SHEETS.rca, SHEETS.kb, SHEETS.project, SHEETS.kaizen, SHEETS.stock];
02529:     const hits = [];
02530:     sources.forEach((sheet) => sourceRows(sheet).forEach((r) => {
~~~

~~~text
02502:     const groups = /* @__PURE__ */ new Map();
02503:     log.filter((r) => isClosed(r) && text(first(r, ["Tindakan Perbaikan", "Corrective Action"]))).forEach((r) => {
02504:       const machine = machineCode(r) || machineName(r), problem = description(r), action = text(first(r, ["Tindakan Perbaikan", "Corrective Action"]));
02505:       if (!problem || !action) return;
02506:       const key = lower(machine) + "|" + words(problem).sort().slice(0, 7).join("|");
02507:       const cur = groups.get(key) || { machine, problem, actions: /* @__PURE__ */ new Map(), count: 0, sourceIds: [], latest: 0 };
02508:       cur.count++;
02509:       cur.actions.set(action, (cur.actions.get(action) || 0) + 1);
02510:       const id = first(r, ["ID", "TransactionID"]);
02511:       if (id && cur.sourceIds.length < 20) cur.sourceIds.push(id);
02512:       cur.latest = Math.max(cur.latest, dateValue(r) || 0);
02513:       groups.set(key, cur);
02514:     });
02515:     const candidates = [...groups.values()].filter((x) => x.count >= 2).map((x) => {
02516:       const top = [...x.actions.entries()].sort((a, b) => b[1] - a[1])[0] || ["", 0];
02517:       const corpus = lower(x.machine + " " + x.problem + " " + top[0]), hasMatch = words(corpus).some((w) => w.length > 4 && known.includes(w)) && known.includes(lower(x.machine));
02518:       return { machine: x.machine, problem: x.problem, recurrence: x.count, mostRecordedAction: top[0], actionFrequency: top[1], sourceIds: x.sourceIds, latest: x.latest ? new Date(x.latest).toISOString() : "", existingKnowledgePossibleMatch: hasMatch, label: hasMatch ? "REVIEW_EXISTING_KB_FIRST" : "KNOWLEDGE_DRAFT_CANDIDATE" };
02519:     }).sort((a, b) => b.recurrence - a.recurrence).slice(0, 50);
02520:     const rcaCandidates = rca.filter((r) => text(first(r, ["Title", "Judul"]))).slice(0, 30).map((r) => ({ machine: machineCode(r) || machineName(r), problem: first(r, ["Title", "Judul"]), recurrence: 1, sourceIds: [first(r, ["ID"])], latest: dateValue(r) ? new Date(dateValue(r)).toISOString() : "", existingKnowledgePossibleMatch: false, label: "RCA_REVIEW_CANDIDATE" }));
02521:     return { ok: true, data: { generatedAt: nowIso(), candidates: [...candidates, ...rcaCandidates].slice(0, 60), existingKnowledgeRecords: kb.length, autoWrite: "NONE", draftAction: "v4.aiAsk purpose=manual/ask", lineage: { sourceOfTruth: "EXISTING_OMODOS", operationalWrites: "NONE" }, note: "Candidates must be reviewed and saved through the official Knowledge Base workflow. Existing KB is checked first to reduce duplication." } };
02522:   }
02523:   __name(getKnowledgeCandidates, "getKnowledgeCandidates");
02524:   function ask(body) {
02525:     const q = lower(body.query || body.question);
02526:     if (!q) return { ok: false, error: "VALIDATION_ERROR: query wajib" };
02527:     const terms = q.split(/\s+/).filter((x) => x.length > 2).slice(0, 12);
02528:     const sources = [SHEETS.logbook, SHEETS.breakdown, SHEETS.predictive, SHEETS.rca, SHEETS.kb, SHEETS.project, SHEETS.kaizen, SHEETS.stock];
02529:     const hits = [];
02530:     sources.forEach((sheet) => sourceRows(sheet).forEach((r) => {
02531:       const hay = lower(Object.values(r).filter((v) => typeof v === "string" || typeof v === "number").join(" "));
~~~

~~~text
02508:       cur.count++;
02509:       cur.actions.set(action, (cur.actions.get(action) || 0) + 1);
02510:       const id = first(r, ["ID", "TransactionID"]);
02511:       if (id && cur.sourceIds.length < 20) cur.sourceIds.push(id);
02512:       cur.latest = Math.max(cur.latest, dateValue(r) || 0);
02513:       groups.set(key, cur);
02514:     });
02515:     const candidates = [...groups.values()].filter((x) => x.count >= 2).map((x) => {
02516:       const top = [...x.actions.entries()].sort((a, b) => b[1] - a[1])[0] || ["", 0];
02517:       const corpus = lower(x.machine + " " + x.problem + " " + top[0]), hasMatch = words(corpus).some((w) => w.length > 4 && known.includes(w)) && known.includes(lower(x.machine));
02518:       return { machine: x.machine, problem: x.problem, recurrence: x.count, mostRecordedAction: top[0], actionFrequency: top[1], sourceIds: x.sourceIds, latest: x.latest ? new Date(x.latest).toISOString() : "", existingKnowledgePossibleMatch: hasMatch, label: hasMatch ? "REVIEW_EXISTING_KB_FIRST" : "KNOWLEDGE_DRAFT_CANDIDATE" };
02519:     }).sort((a, b) => b.recurrence - a.recurrence).slice(0, 50);
02520:     const rcaCandidates = rca.filter((r) => text(first(r, ["Title", "Judul"]))).slice(0, 30).map((r) => ({ machine: machineCode(r) || machineName(r), problem: first(r, ["Title", "Judul"]), recurrence: 1, sourceIds: [first(r, ["ID"])], latest: dateValue(r) ? new Date(dateValue(r)).toISOString() : "", existingKnowledgePossibleMatch: false, label: "RCA_REVIEW_CANDIDATE" }));
02521:     return { ok: true, data: { generatedAt: nowIso(), candidates: [...candidates, ...rcaCandidates].slice(0, 60), existingKnowledgeRecords: kb.length, autoWrite: "NONE", draftAction: "v4.aiAsk purpose=manual/ask", lineage: { sourceOfTruth: "EXISTING_OMODOS", operationalWrites: "NONE" }, note: "Candidates must be reviewed and saved through the official Knowledge Base workflow. Existing KB is checked first to reduce duplication." } };
02522:   }
02523:   __name(getKnowledgeCandidates, "getKnowledgeCandidates");
02524:   function ask(body) {
02525:     const q = lower(body.query || body.question);
02526:     if (!q) return { ok: false, error: "VALIDATION_ERROR: query wajib" };
02527:     const terms = q.split(/\s+/).filter((x) => x.length > 2).slice(0, 12);
02528:     const sources = [SHEETS.logbook, SHEETS.breakdown, SHEETS.predictive, SHEETS.rca, SHEETS.kb, SHEETS.project, SHEETS.kaizen, SHEETS.stock];
02529:     const hits = [];
02530:     sources.forEach((sheet) => sourceRows(sheet).forEach((r) => {
02531:       const hay = lower(Object.values(r).filter((v) => typeof v === "string" || typeof v === "number").join(" "));
02532:       const score = terms.reduce((n, t) => n + (hay.includes(t) ? 1 : 0), 0);
02533:       if (score) hits.push({ sheet, score, record: cleanRecord(r, 12) });
02534:     }));
02535:     hits.sort((a, b) => b.score - a.score || dateValue(b.record) - dateValue(a.record));
02536:     return { ok: true, data: { mode: "DETERMINISTIC_EVIDENCE_SEARCH", query: body.query || body.question, answer: hits.length ? "Ditemukan " + hits.length + " record yang relevan. Tinjau evidence berikut; sistem tidak mengubah data operasional." : "Belum ditemukan evidence yang cukup pada data OMODOS saat ini.", confidence: hits.length >= 5 ? "medium" : hits.length ? "low-medium" : "low", evidence: hits.slice(0, 25), assumptions: ["Keyword similarity across current OMODOS source records"], recommendation: hits.length ? "Review evidence dan buka record sumber sebelum mengambil keputusan." : "Perlu data atau kata kunci yang lebih spesifik." } };
02537:   }
~~~

~~~text
02510:       const id = first(r, ["ID", "TransactionID"]);
02511:       if (id && cur.sourceIds.length < 20) cur.sourceIds.push(id);
02512:       cur.latest = Math.max(cur.latest, dateValue(r) || 0);
02513:       groups.set(key, cur);
02514:     });
02515:     const candidates = [...groups.values()].filter((x) => x.count >= 2).map((x) => {
02516:       const top = [...x.actions.entries()].sort((a, b) => b[1] - a[1])[0] || ["", 0];
02517:       const corpus = lower(x.machine + " " + x.problem + " " + top[0]), hasMatch = words(corpus).some((w) => w.length > 4 && known.includes(w)) && known.includes(lower(x.machine));
02518:       return { machine: x.machine, problem: x.problem, recurrence: x.count, mostRecordedAction: top[0], actionFrequency: top[1], sourceIds: x.sourceIds, latest: x.latest ? new Date(x.latest).toISOString() : "", existingKnowledgePossibleMatch: hasMatch, label: hasMatch ? "REVIEW_EXISTING_KB_FIRST" : "KNOWLEDGE_DRAFT_CANDIDATE" };
02519:     }).sort((a, b) => b.recurrence - a.recurrence).slice(0, 50);
02520:     const rcaCandidates = rca.filter((r) => text(first(r, ["Title", "Judul"]))).slice(0, 30).map((r) => ({ machine: machineCode(r) || machineName(r), problem: first(r, ["Title", "Judul"]), recurrence: 1, sourceIds: [first(r, ["ID"])], latest: dateValue(r) ? new Date(dateValue(r)).toISOString() : "", existingKnowledgePossibleMatch: false, label: "RCA_REVIEW_CANDIDATE" }));
02521:     return { ok: true, data: { generatedAt: nowIso(), candidates: [...candidates, ...rcaCandidates].slice(0, 60), existingKnowledgeRecords: kb.length, autoWrite: "NONE", draftAction: "v4.aiAsk purpose=manual/ask", lineage: { sourceOfTruth: "EXISTING_OMODOS", operationalWrites: "NONE" }, note: "Candidates must be reviewed and saved through the official Knowledge Base workflow. Existing KB is checked first to reduce duplication." } };
02522:   }
02523:   __name(getKnowledgeCandidates, "getKnowledgeCandidates");
02524:   function ask(body) {
02525:     const q = lower(body.query || body.question);
02526:     if (!q) return { ok: false, error: "VALIDATION_ERROR: query wajib" };
02527:     const terms = q.split(/\s+/).filter((x) => x.length > 2).slice(0, 12);
02528:     const sources = [SHEETS.logbook, SHEETS.breakdown, SHEETS.predictive, SHEETS.rca, SHEETS.kb, SHEETS.project, SHEETS.kaizen, SHEETS.stock];
02529:     const hits = [];
02530:     sources.forEach((sheet) => sourceRows(sheet).forEach((r) => {
02531:       const hay = lower(Object.values(r).filter((v) => typeof v === "string" || typeof v === "number").join(" "));
02532:       const score = terms.reduce((n, t) => n + (hay.includes(t) ? 1 : 0), 0);
02533:       if (score) hits.push({ sheet, score, record: cleanRecord(r, 12) });
02534:     }));
02535:     hits.sort((a, b) => b.score - a.score || dateValue(b.record) - dateValue(a.record));
02536:     return { ok: true, data: { mode: "DETERMINISTIC_EVIDENCE_SEARCH", query: body.query || body.question, answer: hits.length ? "Ditemukan " + hits.length + " record yang relevan. Tinjau evidence berikut; sistem tidak mengubah data operasional." : "Belum ditemukan evidence yang cukup pada data OMODOS saat ini.", confidence: hits.length >= 5 ? "medium" : hits.length ? "low-medium" : "low", evidence: hits.slice(0, 25), assumptions: ["Keyword similarity across current OMODOS source records"], recommendation: hits.length ? "Review evidence dan buka record sumber sebelum mengambil keputusan." : "Perlu data atau kata kunci yang lebih spesifik." } };
02537:   }
02538:   __name(ask, "ask");
02539:   function getAccess(body) {
~~~

~~~text
02513:       groups.set(key, cur);
02514:     });
02515:     const candidates = [...groups.values()].filter((x) => x.count >= 2).map((x) => {
02516:       const top = [...x.actions.entries()].sort((a, b) => b[1] - a[1])[0] || ["", 0];
02517:       const corpus = lower(x.machine + " " + x.problem + " " + top[0]), hasMatch = words(corpus).some((w) => w.length > 4 && known.includes(w)) && known.includes(lower(x.machine));
02518:       return { machine: x.machine, problem: x.problem, recurrence: x.count, mostRecordedAction: top[0], actionFrequency: top[1], sourceIds: x.sourceIds, latest: x.latest ? new Date(x.latest).toISOString() : "", existingKnowledgePossibleMatch: hasMatch, label: hasMatch ? "REVIEW_EXISTING_KB_FIRST" : "KNOWLEDGE_DRAFT_CANDIDATE" };
02519:     }).sort((a, b) => b.recurrence - a.recurrence).slice(0, 50);
02520:     const rcaCandidates = rca.filter((r) => text(first(r, ["Title", "Judul"]))).slice(0, 30).map((r) => ({ machine: machineCode(r) || machineName(r), problem: first(r, ["Title", "Judul"]), recurrence: 1, sourceIds: [first(r, ["ID"])], latest: dateValue(r) ? new Date(dateValue(r)).toISOString() : "", existingKnowledgePossibleMatch: false, label: "RCA_REVIEW_CANDIDATE" }));
02521:     return { ok: true, data: { generatedAt: nowIso(), candidates: [...candidates, ...rcaCandidates].slice(0, 60), existingKnowledgeRecords: kb.length, autoWrite: "NONE", draftAction: "v4.aiAsk purpose=manual/ask", lineage: { sourceOfTruth: "EXISTING_OMODOS", operationalWrites: "NONE" }, note: "Candidates must be reviewed and saved through the official Knowledge Base workflow. Existing KB is checked first to reduce duplication." } };
02522:   }
02523:   __name(getKnowledgeCandidates, "getKnowledgeCandidates");
02524:   function ask(body) {
02525:     const q = lower(body.query || body.question);
02526:     if (!q) return { ok: false, error: "VALIDATION_ERROR: query wajib" };
02527:     const terms = q.split(/\s+/).filter((x) => x.length > 2).slice(0, 12);
02528:     const sources = [SHEETS.logbook, SHEETS.breakdown, SHEETS.predictive, SHEETS.rca, SHEETS.kb, SHEETS.project, SHEETS.kaizen, SHEETS.stock];
02529:     const hits = [];
02530:     sources.forEach((sheet) => sourceRows(sheet).forEach((r) => {
02531:       const hay = lower(Object.values(r).filter((v) => typeof v === "string" || typeof v === "number").join(" "));
02532:       const score = terms.reduce((n, t) => n + (hay.includes(t) ? 1 : 0), 0);
02533:       if (score) hits.push({ sheet, score, record: cleanRecord(r, 12) });
02534:     }));
02535:     hits.sort((a, b) => b.score - a.score || dateValue(b.record) - dateValue(a.record));
02536:     return { ok: true, data: { mode: "DETERMINISTIC_EVIDENCE_SEARCH", query: body.query || body.question, answer: hits.length ? "Ditemukan " + hits.length + " record yang relevan. Tinjau evidence berikut; sistem tidak mengubah data operasional." : "Belum ditemukan evidence yang cukup pada data OMODOS saat ini.", confidence: hits.length >= 5 ? "medium" : hits.length ? "low-medium" : "low", evidence: hits.slice(0, 25), assumptions: ["Keyword similarity across current OMODOS source records"], recommendation: hits.length ? "Review evidence dan buka record sumber sebelum mengambil keputusan." : "Perlu data atau kata kunci yang lebih spesifik." } };
02537:   }
02538:   __name(ask, "ask");
02539:   function getAccess(body) {
02540:     return { ok: true, data: { enabled: true, role: "Superadmin", actor: text(body.actor), verifiedAt: nowIso(), source: "SERVER_SESSION_AND_ROLE", sourceTruth: sourceTruthInfo() } };
02541:   }
02542:   __name(getAccess, "getAccess");
~~~

~~~text
02567:     "v4.getKnowledgeCandidates": getKnowledgeCandidates,
02568:     "v4.getTimeMachine": getTimeMachine,
02569:     "v4.getBlackBox": getBlackBox,
02570:     "v4.createWarRoom": createWarRoom,
02571:     "v4.updateWarRoom": updateWarRoom,
02572:     "v4.getWarRoom": getWarRoom
02573:   };
02574:   return {
02575:     actions: Object.keys(handlers),
02576:     dispatch(body) {
02577:       const fn = handlers[text(body && body.action)];
02578:       if (!fn) return json2({ ok: false, error: "UNKNOWN_ACTION: " + text(body && body.action) });
02579:       try {
02580:         const out = fn(body || {});
02581:         if (out && out.ok && out.data && typeof out.data === "object" && !Array.isArray(out.data) && !out.data.sourceTruth) out.data.sourceTruth = sourceTruthInfo();
02582:         return json2(out);
02583:       } catch (err) {
02584:         return json2({ ok: false, error: "SERVER_ERROR: " + (err && err.message ? err.message : String(err)) });
02585:       }
02586:     }
02587:   };
02588: }
02589: __name(createOmodos4, "createOmodos4");
02590: 
02591: // src/backend.mjs
02592: function createBackend(services, env = {}) {
02593:   const { SpreadsheetApp, PropertiesService, CacheService, LockService, Utilities, DriveApp, ContentService, Session, UrlFetchApp, Logger } = services;
02594:   const OMODOS4 = createOmodos4({ SpreadsheetApp, Utilities, ContentService, Session });
02595:   const ENTERPRISE_VERSION = "2.0.0-enterprise";
02596:   const RBAC_GITHUB_BUILD = "RBAC-GITHUB-2026-09-04-v2";
~~~

~~~text
02569:     "v4.getBlackBox": getBlackBox,
02570:     "v4.createWarRoom": createWarRoom,
02571:     "v4.updateWarRoom": updateWarRoom,
02572:     "v4.getWarRoom": getWarRoom
02573:   };
02574:   return {
02575:     actions: Object.keys(handlers),
02576:     dispatch(body) {
02577:       const fn = handlers[text(body && body.action)];
02578:       if (!fn) return json2({ ok: false, error: "UNKNOWN_ACTION: " + text(body && body.action) });
02579:       try {
02580:         const out = fn(body || {});
02581:         if (out && out.ok && out.data && typeof out.data === "object" && !Array.isArray(out.data) && !out.data.sourceTruth) out.data.sourceTruth = sourceTruthInfo();
02582:         return json2(out);
02583:       } catch (err) {
02584:         return json2({ ok: false, error: "SERVER_ERROR: " + (err && err.message ? err.message : String(err)) });
02585:       }
02586:     }
02587:   };
02588: }
02589: __name(createOmodos4, "createOmodos4");
02590: 
02591: // src/backend.mjs
02592: function createBackend(services, env = {}) {
02593:   const { SpreadsheetApp, PropertiesService, CacheService, LockService, Utilities, DriveApp, ContentService, Session, UrlFetchApp, Logger } = services;
02594:   const OMODOS4 = createOmodos4({ SpreadsheetApp, Utilities, ContentService, Session });
02595:   const ENTERPRISE_VERSION = "2.0.0-enterprise";
02596:   const RBAC_GITHUB_BUILD = "RBAC-GITHUB-2026-09-04-v2";
02597:   const SOT_CUTOFF_DATE = "2026-09-01";
02598:   const SOT_POLICY = { cutoff: SOT_CUTOFF_DATE, preLaunchLabel: "PRE-LAUNCH DATA", officialLabel: "OFFICIAL OMODOS DATA" };
~~~

~~~text
02570:     "v4.createWarRoom": createWarRoom,
02571:     "v4.updateWarRoom": updateWarRoom,
02572:     "v4.getWarRoom": getWarRoom
02573:   };
02574:   return {
02575:     actions: Object.keys(handlers),
02576:     dispatch(body) {
02577:       const fn = handlers[text(body && body.action)];
02578:       if (!fn) return json2({ ok: false, error: "UNKNOWN_ACTION: " + text(body && body.action) });
02579:       try {
02580:         const out = fn(body || {});
02581:         if (out && out.ok && out.data && typeof out.data === "object" && !Array.isArray(out.data) && !out.data.sourceTruth) out.data.sourceTruth = sourceTruthInfo();
02582:         return json2(out);
02583:       } catch (err) {
02584:         return json2({ ok: false, error: "SERVER_ERROR: " + (err && err.message ? err.message : String(err)) });
02585:       }
02586:     }
02587:   };
02588: }
02589: __name(createOmodos4, "createOmodos4");
02590: 
02591: // src/backend.mjs
02592: function createBackend(services, env = {}) {
02593:   const { SpreadsheetApp, PropertiesService, CacheService, LockService, Utilities, DriveApp, ContentService, Session, UrlFetchApp, Logger } = services;
02594:   const OMODOS4 = createOmodos4({ SpreadsheetApp, Utilities, ContentService, Session });
02595:   const ENTERPRISE_VERSION = "2.0.0-enterprise";
02596:   const RBAC_GITHUB_BUILD = "RBAC-GITHUB-2026-09-04-v2";
02597:   const SOT_CUTOFF_DATE = "2026-09-01";
02598:   const SOT_POLICY = { cutoff: SOT_CUTOFF_DATE, preLaunchLabel: "PRE-LAUNCH DATA", officialLabel: "OFFICIAL OMODOS DATA" };
02599:   const CACHE_TTL_SECONDS = 600;
~~~

~~~text
02596:   const RBAC_GITHUB_BUILD = "RBAC-GITHUB-2026-09-04-v2";
02597:   const SOT_CUTOFF_DATE = "2026-09-01";
02598:   const SOT_POLICY = { cutoff: SOT_CUTOFF_DATE, preLaunchLabel: "PRE-LAUNCH DATA", officialLabel: "OFFICIAL OMODOS DATA" };
02599:   const CACHE_TTL_SECONDS = 600;
02600:   const SESSION_TTL_HOURS = 24;
02601:   const PBKDF2_ITERATIONS = 8e3;
02602:   const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
02603:   const ALLOWED_MIME_PREFIX = ["image/", "video/", "audio/", "application/pdf", "application/vnd", "text/plain", "text/csv"];
02604:   const TX_LOG_SHEET = "Transaction_Log";
02605:   const AUDIT_LOG_SHEET = "Audit_Log";
02606:   const SHEET_LOGBOOK = "Logbook";
02607:   const SHEET_MESIN = "Master_Mesin";
02608:   const SHEET_PATROL_TEMPLATE = "Patrol_Checklist_Template";
02609:   const SHEET_PERSONIL = "Master_Personil";
02610:   const SHEET_REPORTS = "Reports";
02611:   const SHEET_RCA = "RCA_Reports";
02612:   const SHEET_KB = "Knowledge_Base";
02613:   const SHEET_DOWNTIME_EM = "Downtime_EM";
02614:   const SHEET_SPAREPART_LOKASI = "Sparepart_Lokasi";
02615:   const SHEET_SPAREPART_ETA = "Sparepart_ETA";
02616:   const SHEET_SPAREPART_OPNAME = "Sparepart_Opname";
02617:   const SHEET_KPI_KERJA = "KPI_Kertas_Kerja";
02618:   const SHEET_KPI_DEPARTMENT_YTD = "KPI_Department_YTD";
02619:   const SHEET_KPI_DEPARTMENT_SOURCE = "KPI_Department_Source";
02620:   const SHEET_MACHINE_BREAKDOWN = "Machine_Breakdown_Detail";
02621:   const SHEET_CORRECTIVE_REPORT = "Corrective_Report";
02622:   const SHEET_ENERGY_UTILITY = "Energy_Utility_ENPI";
02623:   const SHEET_STOCK_SPAREPART = "Stock_Sparepart";
02624:   const SHEET_USERS = "Users";
02625:   const SHEET_SESSIONS = "Sessions";
~~~

### async fetch — 3
~~~text
00170:     ContentService: { MimeType: { JSON: "application/json" }, createTextOutput(content) {
00171:       return { getContent: /* @__PURE__ */ __name(() => content, "getContent"), setMimeType() {
00172:         return this;
00173:       } };
00174:     } },
00175:     Session: { getScriptTimeZone: /* @__PURE__ */ __name(() => "Asia/Jakarta", "getScriptTimeZone") },
00176:     Logger: { log() {
00177:     } },
00178:     UrlFetchApp: { async fetch(url, opts = {}) {
00179:       const u = new URL(url);
00180:       if (!["generativelanguage.googleapis.com", "api.groq.com"].includes(u.hostname)) throw Error("AI host is not allowed");
00181:       const res = await fetch(url, { method: opts.method || "GET", headers: { ...opts.contentType ? { "Content-Type": opts.contentType } : {}, ...opts.headers }, body: opts.payload, signal: AbortSignal.timeout(2e4) });
00182:       const text = await res.text();
00183:       return { getResponseCode: /* @__PURE__ */ __name(() => res.status, "getResponseCode"), getContentText: /* @__PURE__ */ __name(() => text, "getContentText") };
00184:     } }
00185:   };
00186:   function commit() {
00187:     for (const [name, indices] of dirty) {
00188:       sql.exec("INSERT OR IGNORE INTO sheets(name) VALUES(?)", name);
00189:       if (deleted.has(name)) sql.exec("DELETE FROM sheet_rows WHERE sheet=?", name);
00190:       for (const n of indices) sql.exec("INSERT OR REPLACE INTO sheet_rows(sheet,n,data) VALUES(?,?,?)", name, n, encode(load(name)[n - 1] ?? []));
00191:     }
00192:     for (const [k, v] of propWrites) sql.exec("INSERT OR REPLACE INTO props(k,v) VALUES(?,?)", k, v);
00193:     for (const f of files) {
00194:       sql.exec("INSERT INTO files(id,name,mime,size) VALUES(?,?,?,?)", f.id, f.name, f.mime, f.data.length);
00195:       for (let offset = 0, n = 0; offset < f.data.length; offset += 512e3, n++) sql.exec("INSERT INTO file_chunks(id,n,data) VALUES(?,?,?)", f.id, n, new Uint8Array(f.data.subarray(offset, offset + 512e3)));
00196:     }
00197:     dirty.clear();
00198:     deleted.clear();
00199:     propWrites.clear();
~~~

~~~text
09304:     this.rate = /* @__PURE__ */ new Map();
09305:   }
09306:   enqueue(fn) {
09307:     const task = this.tail.then(fn);
09308:     this.tail = task.catch(() => {
09309:     });
09310:     return task;
09311:   }
09312:   async fetch(request) {
09313:     let body;
09314:     if (request.method === "POST" && new URL(request.url).pathname === "/api") {
09315:       if (Number(request.headers.get("Content-Length") || 0) > 50 * 1024 * 1024) return json({ ok: false, error: "UPLOAD_TOO_LARGE" }, 413);
09316:       try {
09317:         body = await request.json();
09318:       } catch {
09319:         return json({ ok: false, error: "VALIDATION_ERROR: Invalid JSON" }, 400);
09320:       }
09321:       if (["aiAnalyze", "aiGroq", "aiInternetResearch", "aiKbEnrich", "groqFixTypo", "groqKbEnrich", "v4.aiAsk"].includes(body.action)) return this.ai(request, body);
09322:     }
09323:     return this.enqueue(() => this.run(request, body));
09324:   }
09325:   init(request) {
09326:     if (!this.store) {
09327:       this.store = createStorage(this.state.storage.sql, this.env, new URL(request.url).origin);
09328:       this.backend = createBackend(this.store.services, this.env);
09329:     }
09330:   }
09331:   async ai(request, body) {
09332:     try {
09333:       const authorized = await this.enqueue(() => {
~~~

~~~text
09557:   constructor(ctx, env) {
09558:     super(ctx, env);
09559:     this.application = new Application(ctx, env);
09560:   }
09561:   fetch(request) {
09562:     return this.application.fetch(request);
09563:   }
09564: };
09565: var worker_default = { async fetch(request, env) {
09566:   const url = new URL(request.url);
09567:   if (url.pathname === "/api" || url.pathname.startsWith("/api/") || url.pathname.startsWith("/files/")) return env.MAINTENANCE.get(env.MAINTENANCE.idFromName("maintenance-production")).fetch(request);
09568:   return env.ASSETS.fetch(request);
09569: } };
09570: export {
09571:   MaintenanceStore,
09572:   worker_default as default
09573: };
09574: //# sourceMappingURL=worker.js.map
~~~

### fetch(request — 6
~~~text
09553: var MaintenanceStore = class extends DurableObject {
09554:   static {
09555:     __name(this, "MaintenanceStore");
09556:   }
09557:   constructor(ctx, env) {
09558:     super(ctx, env);
09559:     this.application = new Application(ctx, env);
09560:   }
09561:   fetch(request) {
09562:     return this.application.fetch(request);
09563:   }
09564: };
09565: var worker_default = { async fetch(request, env) {
09566:   const url = new URL(request.url);
09567:   if (url.pathname === "/api" || url.pathname.startsWith("/api/") || url.pathname.startsWith("/files/")) return env.MAINTENANCE.get(env.MAINTENANCE.idFromName("maintenance-production")).fetch(request);
09568:   return env.ASSETS.fetch(request);
09569: } };
09570: export {
09571:   MaintenanceStore,
09572:   worker_default as default
09573: };
09574: //# sourceMappingURL=worker.js.map
~~~

~~~text
09554:   static {
09555:     __name(this, "MaintenanceStore");
09556:   }
09557:   constructor(ctx, env) {
09558:     super(ctx, env);
09559:     this.application = new Application(ctx, env);
09560:   }
09561:   fetch(request) {
09562:     return this.application.fetch(request);
09563:   }
09564: };
09565: var worker_default = { async fetch(request, env) {
09566:   const url = new URL(request.url);
09567:   if (url.pathname === "/api" || url.pathname.startsWith("/api/") || url.pathname.startsWith("/files/")) return env.MAINTENANCE.get(env.MAINTENANCE.idFromName("maintenance-production")).fetch(request);
09568:   return env.ASSETS.fetch(request);
09569: } };
09570: export {
09571:   MaintenanceStore,
09572:   worker_default as default
09573: };
09574: //# sourceMappingURL=worker.js.map
~~~

~~~text
09560:   }
09561:   fetch(request) {
09562:     return this.application.fetch(request);
09563:   }
09564: };
09565: var worker_default = { async fetch(request, env) {
09566:   const url = new URL(request.url);
09567:   if (url.pathname === "/api" || url.pathname.startsWith("/api/") || url.pathname.startsWith("/files/")) return env.MAINTENANCE.get(env.MAINTENANCE.idFromName("maintenance-production")).fetch(request);
09568:   return env.ASSETS.fetch(request);
09569: } };
09570: export {
09571:   MaintenanceStore,
09572:   worker_default as default
09573: };
09574: //# sourceMappingURL=worker.js.map
~~~

### return new Response — 7
~~~text
09398:         const f = store.file(url.pathname.slice(7));
09399:         if (!f) return json({ ok: false, error: "FILE_NOT_FOUND" }, 404);
09400:         const inline = /^(image\/(png|jpeg|gif|webp)|video\/|audio\/|application\/pdf)/.test(f.mime);
09401:         const headers = { "Content-Type": f.mime, "Content-Length": String(f.size), "Accept-Ranges": "bytes", "Content-Disposition": `${inline ? "inline" : "attachment"}; filename*=UTF-8''${encodeURIComponent(f.name)}`, "Cache-Control": "private, max-age=3600", "X-Content-Type-Options": "nosniff", "Content-Security-Policy": "sandbox; default-src 'none'" };
09402:         const range = request.headers.get("Range");
09403:         if (range) {
09404:           const m = /^bytes=(\d*)-(\d*)$/.exec(range);
09405:           let start = 0, end = f.size - 1;
09406:           if (!m || !m[1] && !m[2]) return new Response(null, { status: 416, headers: { "Content-Range": "bytes */" + f.size } });
09407:           if (m[1]) {
09408:             start = Number(m[1]);
09409:             if (m[2]) end = Math.min(end, Number(m[2]));
09410:           } else start = Math.max(0, f.size - Number(m[2]));
09411:           if (start > end || start >= f.size) return new Response(null, { status: 416, headers: { "Content-Range": "bytes */" + f.size } });
09412:           headers["Content-Range"] = `bytes ${start}-${end}/${f.size}`;
09413:           headers["Content-Length"] = String(end - start + 1);
09414:           return new Response(f.data.subarray(start, end + 1), { status: 206, headers });
09415:         }
09416:         return new Response(request.method === "HEAD" ? null : f.data, { headers });
09417:       }
09418:       const token = (request.headers.get("Authorization") || "").replace(/^Bearer /, "");
09419:       const backupAuth = /* @__PURE__ */ __name(() => {
09420:         if (!token) return { response: json({ ok: false, error: "AUTH_REQUIRED" }, 401) };
09421:         try {
09422:           const session = backend.requireSession(token);
09423:           if (session.role !== "Superadmin") return { response: json({ ok: false, error: "FORBIDDEN" }, 403) };
09424:           return { session };
09425:         } catch (e) {
09426:           return { response: json({ ok: false, error: (e.code ? e.code + ": " : "") + (e.message || String(e)) }, 401) };
09427:         }
~~~

~~~text
09403:         if (range) {
09404:           const m = /^bytes=(\d*)-(\d*)$/.exec(range);
09405:           let start = 0, end = f.size - 1;
09406:           if (!m || !m[1] && !m[2]) return new Response(null, { status: 416, headers: { "Content-Range": "bytes */" + f.size } });
09407:           if (m[1]) {
09408:             start = Number(m[1]);
09409:             if (m[2]) end = Math.min(end, Number(m[2]));
09410:           } else start = Math.max(0, f.size - Number(m[2]));
09411:           if (start > end || start >= f.size) return new Response(null, { status: 416, headers: { "Content-Range": "bytes */" + f.size } });
09412:           headers["Content-Range"] = `bytes ${start}-${end}/${f.size}`;
09413:           headers["Content-Length"] = String(end - start + 1);
09414:           return new Response(f.data.subarray(start, end + 1), { status: 206, headers });
09415:         }
09416:         return new Response(request.method === "HEAD" ? null : f.data, { headers });
09417:       }
09418:       const token = (request.headers.get("Authorization") || "").replace(/^Bearer /, "");
09419:       const backupAuth = /* @__PURE__ */ __name(() => {
09420:         if (!token) return { response: json({ ok: false, error: "AUTH_REQUIRED" }, 401) };
09421:         try {
09422:           const session = backend.requireSession(token);
09423:           if (session.role !== "Superadmin") return { response: json({ ok: false, error: "FORBIDDEN" }, 403) };
09424:           return { session };
09425:         } catch (e) {
09426:           return { response: json({ ok: false, error: (e.code ? e.code + ": " : "") + (e.message || String(e)) }, 401) };
09427:         }
09428:       }, "backupAuth");
09429:       if (url.pathname === "/api/backup/config") {
09430:         if (request.method !== "GET") return json({ ok: false, error: "METHOD_NOT_ALLOWED" }, 405);
09431:         const auth = backupAuth();
09432:         if (auth.response) return auth.response;
~~~

~~~text
09406:           if (!m || !m[1] && !m[2]) return new Response(null, { status: 416, headers: { "Content-Range": "bytes */" + f.size } });
09407:           if (m[1]) {
09408:             start = Number(m[1]);
09409:             if (m[2]) end = Math.min(end, Number(m[2]));
09410:           } else start = Math.max(0, f.size - Number(m[2]));
09411:           if (start > end || start >= f.size) return new Response(null, { status: 416, headers: { "Content-Range": "bytes */" + f.size } });
09412:           headers["Content-Range"] = `bytes ${start}-${end}/${f.size}`;
09413:           headers["Content-Length"] = String(end - start + 1);
09414:           return new Response(f.data.subarray(start, end + 1), { status: 206, headers });
09415:         }
09416:         return new Response(request.method === "HEAD" ? null : f.data, { headers });
09417:       }
09418:       const token = (request.headers.get("Authorization") || "").replace(/^Bearer /, "");
09419:       const backupAuth = /* @__PURE__ */ __name(() => {
09420:         if (!token) return { response: json({ ok: false, error: "AUTH_REQUIRED" }, 401) };
09421:         try {
09422:           const session = backend.requireSession(token);
09423:           if (session.role !== "Superadmin") return { response: json({ ok: false, error: "FORBIDDEN" }, 403) };
09424:           return { session };
09425:         } catch (e) {
09426:           return { response: json({ ok: false, error: (e.code ? e.code + ": " : "") + (e.message || String(e)) }, 401) };
09427:         }
09428:       }, "backupAuth");
09429:       if (url.pathname === "/api/backup/config") {
09430:         if (request.method !== "GET") return json({ ok: false, error: "METHOD_NOT_ALLOWED" }, 405);
09431:         const auth = backupAuth();
09432:         if (auth.response) return auth.response;
09433:         const all = store.listProperties();
09434:         const sensitive = /password|secret|token|api[_-]?key|gemini|groq|setup/i;
09435:         const safe = all.filter((x) => !sensitive.test(x.key));
~~~

~~~text
09494:           actor: auth.session.username,
09495:           role: auth.session.role,
09496:           action: "backup.download",
09497:           entity: "SYSTEM_BACKUP",
09498:           payload: { sheetCount: inventory.length, totalRows: inventory.reduce((n, x) => n + x.rows, 0), fileCount: fileInventory.length, totalFileBytes: fileInventory.reduce((n, x) => n + x.size, 0) }
09499:         });
09500:         transact(() => store.commit());
09501:         const data = Object.fromEntries(store.spreadsheet.getSheets().map((s) => [s.getName(), s.getDataRange().getValues()]));
09502:         return new Response(encode(data), { headers: {
09503:           "Content-Type": "application/json",
09504:           "Content-Disposition": 'attachment; filename="maintenance-backup.json"',
09505:           "Cache-Control": "no-store",
09506:           "X-Content-Type-Options": "nosniff",
09507:           "X-Backup-File-Count": String(fileInventory.length),
09508:           "X-Backup-File-Bytes": String(fileInventory.reduce((n, x) => n + x.size, 0))
09509:         } });
09510:       }
09511:       if (url.pathname !== "/api") return json({ ok: false, error: "NOT_FOUND" }, 404);
09512:       if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: { Allow: "GET, POST, OPTIONS" } });
09513:       let result;
09514:       if (request.method === "POST") {
09515:         if (Number(request.headers.get("Content-Length") || 0) > 50 * 1024 * 1024) return json({ ok: false, error: "UPLOAD_TOO_LARGE" }, 413);
09516:         const body = parsedBody || await request.json();
09517:         if (body.action === "login") {
09518:           const key = request.headers.get("CF-Connecting-IP") || "local", now = Date.now();
09519:           const r = this.rate.get(key) || { start: now, n: 0 };
09520:           if (now - r.start > 6e4) {
09521:             r.start = now;
09522:             r.n = 0;
09523:           }
~~~

