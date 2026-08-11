// ============================================================
// ElbatalTV Local Downloads Manager — Electron Main Process
// نظام تحميل لوكال بالكامل بدون أي سيرفر
// التخزين: SQLite داخل مجلد userData (node:sqlite المدمج / better-sqlite3)
// الملفات: مجلد ElbatalTV داخل Downloads
// ============================================================
//
// التثبيت والربط:
//   1) مفيش تبعية نيتف إجبارية — بيستخدم node:sqlite المدمج (Node 22.5+)
//      وبيقع على better-sqlite3 لو كان متثبت.
//   2) في الـ main process:
//        const DownloadsManager = require('./downloads-manager');
//        const downloadsManager = new DownloadsManager();
//        app.whenReady().then(() => downloadsManager.init());
//
// ملاحظة preload: لازم يكون exposed للـ ipcRenderer كامل مع invoke
//   (contextBridge.exposeInMainWorld('ipcRenderer', { send, on, invoke }))
// ============================================================

const { app, ipcMain, webContents } = require('electron');
const path = require('path');
const fs = require('fs');
const http = require('http');
const crypto = require('crypto');

// SQLite: node:sqlite المدمج (مفيش build) مع fallback لـ better-sqlite3 لو متثبت
let Database;
try {
    Database = require('better-sqlite3');
} catch (e) {
    const { DatabaseSync } = require('node:sqlite');
    Database = function (file) {
        const db = new DatabaseSync(file);
        db.pragma = function (s) { try { db.exec('PRAGMA ' + s); } catch (e2) { } };
        return db;
    };
}

const DEFAULT_SETTINGS = {
    max_concurrent: '3',
    downloads_enabled: '1',
    pause_all: '0',
    max_retries: '3'
};

const MIME_TYPES = {
    mp4: 'video/mp4', mkv: 'video/x-matroska', webm: 'video/webm', avi: 'video/x-msvideo',
    mov: 'video/quicktime', m4v: 'video/x-m4v', m4a: 'audio/mp4', ts: 'video/mp2t',
    mp3: 'audio/mpeg', aac: 'audio/aac', wav: 'audio/wav', ogg: 'audio/ogg',
    jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif',
    webp: 'image/webp', pdf: 'application/pdf', srt: 'text/plain', txt: 'text/plain'
};

async function fetchWithFallback(url, opts) {
    if (typeof globalThis.fetch === 'function') return globalThis.fetch(url, opts);
    const { net } = require('electron');
    return net.fetch(url, opts);
}

class DownloadsManager {
    constructor() {
        this.downloadDir = '';
        this.db = null;
        this.active = new Map(); // job_token -> { controller, cancelled }
        this.queue = [];
        this.settings = Object.assign({}, DEFAULT_SETTINGS);
        this.maxConcurrent = 3;
        this.pauseAll = false;
        this.downloadsEnabled = true;
        this.maxRetries = 3;
        this.broadcastTimer = null;
        this.fileServer = null;
        this.fileRoutes = new Map();
    }

    init() {
        const userData = app.getPath('userData');
        const downloadsBase = app.getPath('downloads');
        try { fs.mkdirSync(userData, { recursive: true }); } catch (e) { }
        this.downloadDir = path.join(downloadsBase, 'ElbatalTV');
        try { fs.mkdirSync(this.downloadDir, { recursive: true }); } catch (e) { }

        this.db = new Database(path.join(userData, 'downloads.db'));
        this.db.pragma('journal_mode = WAL');
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS downloads (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                job_token TEXT UNIQUE NOT NULL,
                file_title TEXT NOT NULL,
                file_ext TEXT DEFAULT '',
                file_link TEXT NOT NULL,
                file_dir TEXT DEFAULT '',
                custom_headers TEXT DEFAULT '{}',
                status TEXT DEFAULT 'queued',
                total_size INTEGER DEFAULT 0,
                downloaded_size INTEGER DEFAULT 0,
                speed REAL DEFAULT 0,
                progress REAL DEFAULT 0,
                file_path TEXT DEFAULT '',
                error_msg TEXT DEFAULT '',
                retries INTEGER DEFAULT 0,
                created_at TEXT DEFAULT (datetime('now')),
                updated_at TEXT DEFAULT (datetime('now')),
                started_at TEXT,
                completed_at TEXT
            );
            CREATE TABLE IF NOT EXISTS settings (
                settings_key TEXT PRIMARY KEY,
                settings_value TEXT NOT NULL
            );
        `);
        const seed = this.db.prepare('INSERT OR IGNORE INTO settings (settings_key, settings_value) VALUES (?, ?)');
        for (const [k, v] of Object.entries(DEFAULT_SETTINGS)) seed.run(k, v);

        this.reloadSettings();
        this.registerIpc();
        this.recoverJobs();
        this.ensureListeners();
    }

    ensureListeners() {
        // تنظيف عند إغلاق التطبيق
        if (!this._cleanupBound) {
            this._cleanupBound = true;
            app.on('before-quit', () => {
                try { this.db.close(); } catch (e) { }
            });
        }
    }

    reloadSettings() {
        const rows = this.db.prepare('SELECT settings_key, settings_value FROM settings').all();
        const s = Object.assign({}, DEFAULT_SETTINGS);
        for (const r of rows) s[r.settings_key] = r.settings_value;
        this.settings = s;
        this.maxConcurrent = parseInt(s.max_concurrent, 10) || 3;
        this.pauseAll = s.pause_all === '1';
        this.downloadsEnabled = s.downloads_enabled === '1';
        this.maxRetries = parseInt(s.max_retries, 10) || 3;
    }

    // ---------- تحويل صفوف قاعدة البيانات ----------
    rowToJob(r) {
        if (!r) return null;
        return {
            job_token: r.job_token,
            file_title: r.file_title,
            file_ext: r.file_ext,
            file_link: r.file_link,
            file_dir: r.file_dir,
            custom_headers: r.custom_headers,
            status: r.status,
            total_size: parseInt(r.total_size, 10) || 0,
            downloaded_size: parseInt(r.downloaded_size, 10) || 0,
            speed: parseFloat(r.speed) || 0,
            progress: parseFloat(r.progress) || 0,
            error_msg: r.error_msg || '',
            file_path: r.file_path || '',
            created_at: r.created_at,
            started_at: r.started_at,
            completed_at: r.completed_at
        };
    }

    getRowByToken(token) {
        return this.db.prepare('SELECT * FROM downloads WHERE job_token = ?').get(token);
    }

    // ---------- البث للواجهة ----------
    broadcast(job) {
        if (!job) return;
        const payload = this.rowToJob(job);
        for (const wc of webContents.getAllWebContents()) {
            try { wc.send('downloads:progress', payload); } catch (e) { }
        }
    }

    broadcastStatus(token) {
        this.broadcast(this.getRowByToken(token));
    }

    // ---------- استعادة الحالة ----------
    recoverJobs() {
        this.db.prepare("UPDATE downloads SET status='queued', started_at=NULL WHERE status='downloading'").run();
        this.loadQueue();
        this.tryStart();
    }

    loadQueue() {
        this.queue = this.db.prepare("SELECT * FROM downloads WHERE status='queued' ORDER BY id ASC").all();
    }

    // ---------- الإضافة والتشغيل ----------
    add(file) {
        if (!this.downloadsEnabled) return { error: 'downloads_disabled' };
        const job_token = crypto.randomBytes(16).toString('hex');
        const title = String(file.file_title || file.file_name || 'download').trim() || 'download';
        const ext = String(file.file_ext || '').replace(/^\./, '');
        const info = this.db.prepare(
            "INSERT INTO downloads (job_token, file_title, file_ext, file_link, file_dir, custom_headers, status) VALUES (?,?,?,?,?,?,'queued')"
        ).run(
            job_token,
            title,
            ext,
            String(file.file_link || ''),
            String(file.file_dir || ''),
            typeof file.custom_headers === 'string' ? file.custom_headers : JSON.stringify(file.custom_headers || {})
        );
        const job = this.getRowByToken(job_token);
        this.queue.push(job);
        this.broadcast(job);
        this.tryStart();
        return this.rowToJob(job);
    }

    tryStart() {
        if (!this.downloadsEnabled || this.pauseAll) return;
        while (this.active.size < this.maxConcurrent && this.queue.length > 0) {
            const job = this.queue.shift();
            this.startDownload(job);
        }
    }

    startDownload(job) {
        if (this.active.has(job.job_token)) return;
        this.active.set(job.job_token, { controller: new AbortController(), cancelled: false });
        this.db.prepare("UPDATE downloads SET status='downloading', started_at=datetime('now'), updated_at=datetime('now'), error_msg='' WHERE job_token=?").run(job.job_token);
        this.broadcastStatus(job.job_token);
        this.doDownload(job).catch((err) => this.onDownloadEnd(job, err));
    }

    async doDownload(job) {
        const entry = this.active.get(job.job_token);
        const headers = {};
        try { Object.assign(headers, JSON.parse(job.custom_headers || '{}')); } catch (e) { }

        const partPath = path.join(this.downloadDir, job.job_token + '.part');
        let resumeFrom = 0;
        try { resumeFrom = fs.existsSync(partPath) ? fs.statSync(partPath).size : 0; } catch (e) { resumeFrom = 0; }
        if (resumeFrom > 0) headers['Range'] = 'bytes=' + resumeFrom + '-';
        headers['MOuCustomREQUEST'] = 'NICE';

        const response = await fetchWithFallback(job.file_link, { method: 'GET', headers, signal: entry.controller.signal });
        if (!response.ok && response.status !== 206) throw new Error('HTTP ' + response.status);
        if (!response.body) throw new Error('stream not supported');

        const contentLength = parseInt(response.headers.get('Content-Length') || '0', 10) || 0;
        const isResume = response.status === 206;
        const totalSize = isResume ? resumeFrom + contentLength : (contentLength || 0);
        this.db.prepare('UPDATE downloads SET total_size=?, downloaded_size=? WHERE job_token=?').run(totalSize, isResume ? resumeFrom : 0, job.job_token);

        const writeStream = fs.createWriteStream(partPath, { flags: isResume && resumeFrom > 0 ? 'a' : 'w' });
        const reader = response.body.getReader();
        let received = isResume ? resumeFrom : 0;
        let lastEmit = Date.now();
        let lastBytes = received;

        const pump = async () => {
            if (entry.cancelled || entry.controller.signal.aborted) {
                try { reader.cancel(); } catch (e) { }
                try {
                    writeStream.end();
                    await new Promise((res) => writeStream.once('finish', res));
                } catch (e) { }
                const abortErr = new Error('aborted');
                abortErr.name = 'AbortError';
                throw abortErr;
            }
            const { done, value } = await reader.read();
            if (done) {
                writeStream.end();
                await new Promise((res) => writeStream.on('finish', res));
                const finalPath = this.resolveFinalPath(job);
                if (fs.existsSync(finalPath)) { try { fs.rmSync(finalPath, { force: true }); } catch (e) { } }
                fs.renameSync(partPath, finalPath);
                this.db.prepare("UPDATE downloads SET status='completed', progress=100, speed=0, downloaded_size=total_size, file_path=?, updated_at=datetime('now'), completed_at=datetime('now') WHERE job_token=?").run(finalPath, job.job_token);
                this.active.delete(job.job_token);
                this.broadcastStatus(job.job_token);
                this.tryStart();
                return;
            }
            if (!writeStream.write(Buffer.from(value))) {
                await new Promise((res) => writeStream.once('drain', res));
            }
            received += value.byteLength;
            const now = Date.now();
            if (now - lastEmit >= 1000) {
                const speed = (received - lastBytes) / ((now - lastEmit) / 1000);
                lastEmit = now;
                lastBytes = received;
                this.db.prepare("UPDATE downloads SET downloaded_size=?, speed=?, progress=?, updated_at=datetime('now') WHERE job_token=?")
                    .run(received, Math.round(speed), totalSize > 0 ? Math.min(100, (received / totalSize) * 100) : 0, job.job_token);
                this.broadcastStatus(job.job_token);
            }
            await pump();
        };
        await pump();
    }

    resolveFinalPath(job) {
        const dir = job.file_dir && job.file_dir.trim() !== '' ? job.file_dir : this.downloadDir;
        try { fs.mkdirSync(dir, { recursive: true }); } catch (e) { }
        const ext = job.file_ext ? '.' + job.file_ext : '';
        let base = (job.file_title || 'download').replace(/[\\/:*?"<>|]/g, '_');
        let p = path.join(dir, base + ext);
        let i = 1;
        while (fs.existsSync(p)) { p = path.join(dir, base + ' (' + i + ')' + ext); i++; }
        return p;
    }

    // ---------- نهاية التحميل (خطأ / إلغاء / إيقاف) ----------
    onDownloadEnd(job, err) {
        const entry = this.active.get(job.job_token);
        const aborted = err && (err.name === 'AbortError' || err.code === 'ABORT_ERR');
        this.active.delete(job.job_token);

        if (aborted) {
            const status = entry && entry.cancelled ? 'cancelled' : 'paused';
            this.db.prepare("UPDATE downloads SET status=?, speed=0, updated_at=datetime('now') WHERE job_token=?").run(status, job.job_token);
            if (status === 'cancelled') this.removePartFile(job.job_token);
            this.broadcastStatus(job.job_token);
            this.tryStart();
            return;
        }

        const current = this.getRowByToken(job.job_token);
        const retries = parseInt(current.retries, 10) || 0;
        const message = (err && err.message) || 'download error';
        if (retries < this.maxRetries) {
            this.db.prepare("UPDATE downloads SET status='queued', retries=?, error_msg=?, updated_at=datetime('now') WHERE job_token=?").run(retries + 1, message, job.job_token);
            this.loadQueue();
            this.broadcastStatus(job.job_token);
            this.tryStart();
        } else {
            this.db.prepare("UPDATE downloads SET status='error', speed=0, error_msg=?, updated_at=datetime('now') WHERE job_token=?").run(message, job.job_token);
            this.broadcastStatus(job.job_token);
            this.tryStart();
        }
    }

    removePartFile(token) {
        const part = path.join(this.downloadDir, token + '.part');
        if (fs.existsSync(part)) { try { fs.unlinkSync(part); } catch (e) { } }
    }

    // ---------- إجراءات ----------
    pause(token) {
        const entry = this.active.get(token);
        if (entry) {
            entry.cancelled = false;
            entry.controller.abort();
        } else {
            this.db.prepare("UPDATE downloads SET status='paused', speed=0, updated_at=datetime('now') WHERE job_token=? AND status IN ('queued','downloading')").run(token);
            this.loadQueue();
            this.broadcastStatus(token);
        }
        return { success: true };
    }

    cancel(token) {
        const entry = this.active.get(token);
        if (entry) {
            entry.cancelled = true;
            entry.controller.abort();
        } else {
            this.db.prepare("UPDATE downloads SET status='cancelled', speed=0, updated_at=datetime('now') WHERE job_token=? AND status NOT IN ('completed','cancelled')").run(token);
            this.removePartFile(token);
            this.loadQueue();
            this.broadcastStatus(token);
        }
        return { success: true };
    }

    resume(token) {
        this.db.prepare("UPDATE downloads SET status='queued', retries=0, updated_at=datetime('now') WHERE job_token=? AND status IN ('paused','error')").run(token);
        this.loadQueue();
        this.broadcastStatus(token);
        this.tryStart();
        return { success: true };
    }

    deleteJob(token) {
        const entry = this.active.get(token);
        if (entry) {
            entry.cancelled = true;
            entry.controller.abort();
        }
        const row = this.getRowByToken(token);
        if (row) {
            if (row.file_path && fs.existsSync(row.file_path)) { try { fs.unlinkSync(row.file_path); } catch (e) { } }
            this.removePartFile(token);
            this.db.prepare('DELETE FROM downloads WHERE job_token=?').run(token);
        }
        this.loadQueue();
        return { success: true };
    }

    // حذف العملية فقط — الملف المحمّل يفضل مكانه
    deleteRecord(token) {
        const entry = this.active.get(token);
        if (entry) {
            entry.cancelled = true;
            entry.controller.abort();
        }
        const row = this.getRowByToken(token);
        if (row) {
            this.removePartFile(token);
            this.db.prepare('DELETE FROM downloads WHERE job_token=?').run(token);
        }
        this.loadQueue();
        return { success: true };
    }

    // ============================================================
    // خدمة الملف المحلي عبر localhost HTTP (للتشغيل داخل المشغل)
    // السبب: CSP + webSecurity في الإلكترون بتمنع file:// من صفحة https
    // الحل: ندّي للاعب رابط http://127.0.0.1:port/?f=key
    // ============================================================

    async serveFile(filePath) {
        if (!filePath || !fs.existsSync(filePath)) return null;
        if (!this.fileServer) {
            await new Promise((resolve) => {
                const server = http.createServer((req, res) => {
                    try {
                        if (req.method === 'OPTIONS') {
                            res.writeHead(204, {
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Headers': '*',
                                'Access-Control-Allow-Methods': 'GET, OPTIONS'
                            });
                            res.end();
                            return;
                        }
                        const u = new URL(req.url, 'http://127.0.0.1');
                        const key = u.searchParams.get('f');
                        const target = this.fileRoutes.get(key);
                        if (!target || !fs.existsSync(target)) { res.writeHead(404); res.end(); return; }
                        this.streamLocalFile(req, res, target);
                    } catch (e) {
                        try { res.writeHead(500); res.end(); } catch (e2) { }
                    }
                });
                server.listen(0, '127.0.0.1', () => resolve());
                this.fileServer = server;
            });
        }
        const key = crypto.randomBytes(8).toString('hex');
        this.fileRoutes.set(key, filePath);
        const port = this.fileServer.address().port;
        return 'http://127.0.0.1:' + port + '/?f=' + key;
    }

    streamLocalFile(req, res, filePath) {
        const ext = path.extname(filePath).slice(1).toLowerCase();
        const type = MIME_TYPES[ext] || 'application/octet-stream';
        const size = fs.statSync(filePath).size;
        const baseHeaders = {
            'Content-Type': type,
            'Accept-Ranges': 'bytes',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-cache'
        };
        const range = req.headers.range;
        if (range) {
            const m = /bytes=(\d+)-(\d*)/.exec(range);
            if (!m) { res.writeHead(416); res.end(); return; }
            let start = parseInt(m[1], 10);
            let end = m[2] ? parseInt(m[2], 10) : size - 1;
            if (isNaN(start) || start >= size) { res.writeHead(416); res.end(); return; }
            end = Math.min(end, size - 1);
            res.writeHead(206, Object.assign(baseHeaders, {
                'Content-Range': 'bytes ' + start + '-' + end + '/' + size,
                'Content-Length': end - start + 1
            }));
            fs.createReadStream(filePath, { start: start, end: end }).pipe(res);
        } else {
            res.writeHead(200, Object.assign(baseHeaders, { 'Content-Length': size }));
            fs.createReadStream(filePath).pipe(res);
        }
    }

    list() {
        const rows = this.db.prepare('SELECT * FROM downloads ORDER BY id DESC LIMIT 200').all();
        return rows.map((r) => this.rowToJob(r));
    }

    getSettings() {
        return Object.assign({}, this.settings);
    }

    setSettings(data) {
        const allowed = Object.keys(DEFAULT_SETTINGS);
        const stmt = this.db.prepare('INSERT INTO settings (settings_key, settings_value) VALUES (?, ?) ON CONFLICT(settings_key) DO UPDATE SET settings_value=excluded.settings_value');
        for (const k of allowed) {
            if (data[k] !== undefined && data[k] !== null) stmt.run(k, String(data[k]));
        }
        this.reloadSettings();
        if (this.pauseAll) {
            for (const token of Array.from(this.active.keys())) this.pause(token);
        }
        if (this.downloadsEnabled && !this.pauseAll) {
            this.loadQueue();
            this.tryStart();
        }
        return this.getSettings();
    }

    // ---------- IPC ----------
    registerIpc() {
        ipcMain.handle('downloads:list', () => this.list());
        ipcMain.handle('downloads:add', (e, file) => this.add(file || {}));
        ipcMain.handle('downloads:pause', (e, token) => this.pause(token));
        ipcMain.handle('downloads:cancel', (e, token) => this.cancel(token));
        ipcMain.handle('downloads:resume', (e, token) => this.resume(token));
        ipcMain.handle('downloads:delete', (e, token) => this.deleteJob(token));
        ipcMain.handle('downloads:delete-record', (e, token) => this.deleteRecord(token));
        ipcMain.handle('downloads:serve-file', (e, filePath) => this.serveFile(filePath));
        ipcMain.handle('downloads:settings', (e, mode, data) => mode === 'set' ? this.setSettings(data || {}) : this.getSettings());
    }
}

module.exports = DownloadsManager;
