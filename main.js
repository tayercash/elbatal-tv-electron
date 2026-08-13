const path = require('path');
const os = require('os');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const http = require('http'); // Add this
const https = require('https');

const { app, globalShortcut, BrowserWindow, Menu, contextBridge, ipcMain, shell, session, protocol, Notification, net, dialog, screen } = require('electron');
const fetch = require('cross-fetch');
const util = require('util');
const { exec } = require('child_process');
const execAsync = util.promisify(exec);
const AdmZip = require('adm-zip');
const AutoLaunch = require('auto-launch');
const io = require('socket.io-client');
const YTDlpWrap = require("yt-dlp-wrap").default;
const ytDlpWrap = new YTDlpWrap(path.join(__dirname, "assets/bin/yt-dlp.exe"));

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

const { spawn } = require('child_process');
const DownloadsManager = require('./downloads-manager');
let downloadsManager;

// process.env['NODE_ENV'] = 'production';


const isDev = process.env.NODE_ENV !== 'production';

const ffmpegPath = isDev
  ? require('ffmpeg-static')
  : path.join(process.resourcesPath, 'bin', 'ffmpeg.exe');

puppeteer.use(StealthPlugin());
// const puppeteer = require('puppeteer-extra');
// const StealthPlugin = require('puppeteer-extra-plugin-stealth');

// puppeteer.use(StealthPlugin());
// const exec = util.promisify(require("child_process").exec);
app.setAppUserModelId('com.mouscripts.elbataltv');

app.commandLine.appendSwitch('force_high_performance_gpu');

app.commandLine.appendSwitch('ignore-gpu-blacklist');
// app.commandLine.appendSwitch('disable-font-subpixel-positioning');
// app.commandLine.appendSwitch('disable-software-rasterizer');
app.commandLine.appendSwitch('disable-features', 'SSLCommonNameMismatchHandling,LegacyTLSEnforced');
app.commandLine.appendSwitch('allow-insecure-localhost', 'true');
app.commandLine.appendSwitch('unsafely-treat-insecure-origin-as-secure', 'http://*');
app.commandLine.appendSwitch(
  "disable-blink-features",
  "AutomationControlled"
);
app.commandLine.appendSwitch('enable-widevine-cdm');

// 1. معالجة الألوان والحدة البصرية
app.commandLine.appendSwitch('force-color-profile', 'srgb');
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-oop-rasterization');

// 2. تحسين جودة الرسم (Canvas)
app.commandLine.appendSwitch('canvas-msaa-sample-count', '4');

// 3. دعم الشاشات عالية الدقة بدون تشويه
app.commandLine.appendSwitch('high-dpi-support', '1');

// 4. فك القيود عن كرت الشاشة (لأجهزة اللاب توب القديمة)
app.commandLine.appendSwitch('ignore-gpu-blacklist');

// 5. تفعيل المحرك الحديث (Vulkan) - اختياري حسب دعم الجهاز
app.commandLine.appendSwitch('enable-features', 'Vulkan');

// تفعيل فك تشفير HEVC برمجياً وعتادياً
app.commandLine.appendSwitch('enable-features', 'PlatformHEVCDecoderSupport');
// إجبار المتصفح على استخدام الكارت الخارجي (Radeon RX 6600 XT) وتجاهل الحظر
app.commandLine.appendSwitch('ignore-gpu-blocklist');
// تمكين تشغيل الفيديوهات التي تتطلب تسريع عتادي
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');

app.commandLine.appendSwitch('disable-http-cache');

app.commandLine.appendSwitch('enable-features', 'PlatformHEVCDecoding');
app.commandLine.appendSwitch('disable-features', 'Out-of-process-2d-canvas'); // أحياناً يساعد في تحسين الأداء

app.commandLine.appendSwitch('allow-file-access-from-files');
app.commandLine.appendSwitch('disable-gesture-requirement-for-presentation'); // مهم جداً

// app.commandLine.appendSwitch("disable-gpu-sandbox");

// Create a new instance of AutoLaunch
const appAutoLauncher = new AutoLaunch({
  name: 'Elbatal TV', // Replace with your app's name
  path: process.execPath, // Path to your Electron app executable
});

// Enable auto-launch
appAutoLauncher.isEnabled().then((isEnabled) => {
  if (!isEnabled) {
    appAutoLauncher.disable();
  }
}).catch((err) => {
  console.error('Error enabling auto-launch', err);
});

const childWindowWebContentsHeaders = {};
const isMac = process.platform === 'darwin';
const idmPath = path.join("C:\\Program Files (x86)\\Internet Download Manager", "IDMan.exe");

const ONLINE_APP_URL = "https://new.elbatal-app.com/app";
let OpenerURL = ONLINE_APP_URL;
let mainWindow;
let aboutWindow;
let loginWindow;
let gauthCompleted = false;  // Flag to track if authentication is completed
const gotTheLock = app.requestSingleInstanceLock();
let customScheme = "elbataltv";

const storagePath = path.join(app.getPath('userData'), 'storage.json');

// const challenge_window_cookies = getData('challenge_window_cookies') !== null ? JSON.parse(getData('challenge_window_cookies')) : {};


if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient(customScheme, process.execPath, [path.resolve(process.argv[1])]);
  }
} else {
  app.setAsDefaultProtocolClient(customScheme);
}

// Google OAuth 2.0 credentials (loaded from env vars or local config file, never hardcoded)
function loadGoogleConfig() {
  let local = {};
  const configPath = path.join(__dirname, 'config.local.json');
  if (fs.existsSync(configPath)) {
    try {
      local = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    } catch (err) {
      console.error('Failed to parse config.local.json:', err);
    }
  }
  return {
    clientId: process.env.GOOGLE_CLIENT_ID || local.googleClientId,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || local.googleClientSecret,
  };
}

const googleConfig = loadGoogleConfig();
const GOOGLE_CLIENT_ID = googleConfig.clientId;
const GOOGLE_CLIENT_SECRET = googleConfig.clientSecret;
const REDIRECT_URI = 'http://localhost:19620/callback';

const OAUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=openid%20profile%20email&access_type=offline`;

const TOKEN_PATH = path.join(app.getPath('userData'), 'tokens.json');  // File to store the tokens

// Function to load tokens from file
function loadTokens() {
  if (fs.existsSync(TOKEN_PATH)) {
    const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));
    return tokens;
  }
  return null;
}

// Function to save tokens to file
function saveTokens(tokens) {
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
}

// Function to clear stored tokens (if needed)
function clearTokens() {
  if (fs.existsSync(TOKEN_PATH)) {
    fs.unlinkSync(TOKEN_PATH);
  }
}

// Main Window

// إعداد Express server للـ streaming proxy
const app_express = express();
app_express.use(cors());

// Streaming proxy للتحويل السريع من HEVC إلى H.264

// --- Streaming Proxy (HEVC to H.264) ---
app_express.get('/stream-proxy', async (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) return res.status(400).send('Missing video URL');

  let proxyHeaders = {};
  if (req.query.proxy_headers) {
    try {
      const decodedHeader = decodeURIComponent(req.query.proxy_headers);
      proxyHeaders = JSON.parse(Buffer.from(decodedHeader, 'base64').toString('utf8'));
    } catch (err) { console.warn('[Stream Proxy] Header error'); }
  }

  res.setHeader('Content-Type', 'video/mp4');
  res.setHeader('Transfer-Encoding', 'chunked');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const ffmpegArgs = [
    '-protocol_whitelist', 'file,http,https,tcp,tls,crypto',
    '-reconnect', '1', '-reconnect_streamed', '1', '-reconnect_delay_max', '5'
  ];

  if (Object.keys(proxyHeaders).length > 0) {
    let hStr = Object.entries(proxyHeaders).map(([k, v]) => `${k}: ${v}`).join('\r\n') + '\r\n';
    ffmpegArgs.push('-headers', hStr);
  }

  const ffmpeg = spawn(ffmpegPath, [
    ...ffmpegArgs,
    '-i', videoUrl,
    '-c:v', 'libx264', '-preset', 'ultrafast', '-tune', 'zerolatency',
    '-c:a', 'aac', '-b:a', '128k', '-f', 'mp4',
    '-movflags', 'frag_keyframe+empty_moov+default_base_moof+faststart',
    'pipe:1'
  ]);

  ffmpeg.stdout.pipe(res);
  res.on('close', () => ffmpeg.kill('SIGKILL'));
});

// --- HLS Proxy (Buffer Optimizer) ---
// إعدادات عامة لتجنب مشاكل الـ SSL في بعض السيرفرات القديمة
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

app_express.get('/hls-proxy', (req, res) => {
  const hlsUrl = req.query.url;
  const rawHeadersPayload = req.query.proxy_headers || '';
  const PORT = 9876; // تأكد أن البورت ثابت هنا

  if (!hlsUrl) return res.status(400).send('Missing URL');

  let proxyHeaders = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  };

  if (rawHeadersPayload) {
    try {
      const decoded = Buffer.from(decodeURIComponent(rawHeadersPayload), 'base64').toString('utf-8');
      proxyHeaders = { ...proxyHeaders, ...JSON.parse(decoded) };
    } catch (e) { console.error('[Proxy] Header Error'); }
  }

  const isM3U8 = hlsUrl.includes('m3u8');

  if (isM3U8) {
    const fetchManifest = (targetUrl) => {
      const client = targetUrl.startsWith('https') ? https : http;

      client.get(targetUrl, { headers: proxyHeaders }, (proxyRes) => {
        // معالجة الـ Redirect
        if (proxyRes.statusCode >= 300 && proxyRes.statusCode < 400 && proxyRes.headers.location) {
          const redirectUrl = new URL(proxyRes.headers.location, targetUrl).href;
          return fetchManifest(redirectUrl);
        }

        let chunks = [];
        proxyRes.on('data', (chunk) => chunks.push(chunk));
        proxyRes.on('end', () => {
          // تحويل الـ Buffer لنص لضمان عدم ضياع أي بيانات
          let data = Buffer.concat(chunks).toString('utf8');

          if (!data.includes('#EXTM3U')) {
            return res.status(500).send('Invalid Content');
          }

          const encodedHeaders = encodeURIComponent(rawHeadersPayload);

          // الحل القوي: تقسيم السطور وتنظيفها من أي مسافات أو علامات \r
          const lines = data.split(/\r?\n/);

          const modifiedLines = lines.map(line => {
            let trimmed = line.trim();

            // أي سطر لا يبدأ بـ # هو رابط
            if (trimmed && !trimmed.startsWith('#')) {
              try {
                // تنظيف الرابط من أي مسافات في البداية أو النهاية
                const cleanUrl = trimmed.replace(/\s/g, '');
                const absoluteUrl = new URL(cleanUrl, targetUrl).href;

                return `http://localhost:${PORT}/hls-proxy?url=${encodeURIComponent(absoluteUrl)}&proxy_headers=${encodedHeaders}`;
              } catch (err) {
                return line;
              }
            }
            return line;
          });

          res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.send(modifiedLines.join('\n'));
        });
      }).on('error', (err) => res.status(500).send(err.message));
    };
    fetchManifest(hlsUrl);

  } else {
    // --- جزء الـ Segments (بدون تغيير لأنه يعمل جيداً) ---
    const fetchSegment = (targetUrl) => {
      const client = targetUrl.startsWith('https') ? https : http;
      client.get(targetUrl, { headers: proxyHeaders }, (proxyRes) => {
        if (proxyRes.statusCode >= 300 && proxyRes.statusCode < 400 && proxyRes.headers.location) {
          const redirectUrl = new URL(proxyRes.headers.location, targetUrl).href;
          return fetchSegment(redirectUrl);
        }
        res.writeHead(proxyRes.statusCode, {
          'Content-Type': 'video/mp2t',
          'Access-Control-Allow-Origin': '*'
        });
        proxyRes.pipe(res);
      }).on('error', () => res.status(500).end());
    };
    fetchSegment(hlsUrl);
  }
});

app_express.get('/hls-proxy', async (req, res) => {
  try {
    const hlsUrl = req.query.url;
    if (!hlsUrl) {
      console.error('[HLS Proxy] Error: No URL provided');
      return res.status(400).send('Missing URL');
    }

    console.log(`\n[HLS Proxy] --- New Request ---`);
    console.log(`[HLS Proxy] Target URL: ${hlsUrl.substring(0, 80)}...`);

    // 1. استخراج وتجهيز الهيدرز
    let proxyHeaders = {};
    const rawHeadersPayload = req.query.proxy_headers || ''; // نحفظ الـ payload لاستخدامه لاحقاً

    if (rawHeadersPayload) {
      try {
        const decodedHeader = decodeURIComponent(rawHeadersPayload);
        const rawHeader = Buffer.from(decodedHeader, 'base64').toString('utf8');
        proxyHeaders = JSON.parse(rawHeader);
        console.log(`[HLS Proxy] Headers Parsed Successfully`);
      } catch (err) {
        console.error('[HLS Proxy] Header Parse Error:', err.message);
      }
    }

    const isM3U8 = hlsUrl.includes('.m3u8') || hlsUrl.includes('m3u8');

    if (isM3U8) {
      console.log(`[HLS Proxy] Mode: Manifest (M3U8)`);

      const fetchManifest = (targetUrl) => {
        const client = targetUrl.startsWith('https') ? https : http;

        client.get(targetUrl, { headers: proxyHeaders }, (response) => {
          // معالجة الـ Redirect
          if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
            let redirectUrl = new URL(response.headers.location, targetUrl).href;
            console.log(`[HLS Proxy] Redirecting to: ${redirectUrl}`);
            return fetchManifest(redirectUrl);
          }

          let data = '';
          response.on('data', (chunk) => data += chunk);
          response.on('end', () => {
            if (!data || response.statusCode !== 200) {
              return res.status(response.statusCode || 500).send('Empty Manifest');
            }

            // حفظ الهيدرز المشفرة لاستخدامها في كل سطر
            const headersPayload = req.query.proxy_headers ? encodeURIComponent(req.query.proxy_headers) : '';

            let modifiedData = data.split('\n').map(line => {
              let trimmed = line.trim();

              // تحويل أي رابط (مطلق أو نسبي) إلى رابط يمر عبر البروكسي مع الهيدرز
              if (trimmed && !trimmed.startsWith('#')) {
                let absoluteUrl = new URL(trimmed, targetUrl).href;
                return `http://localhost:9876/hls-proxy?url=${encodeURIComponent(absoluteUrl)}&proxy_headers=${headersPayload}`;
              }
              return line;
            }).join('\n');

            res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.send(modifiedData);
          });
        }).on('error', (err) => res.status(500).send('Manifest Fetch Error'));
      };

      fetchManifest(hlsUrl);
    } else {
      // --- معالجة القطع (Segments) بدون FFmpeg لسرعة البرق ---
      console.log(`[HLS Proxy] Direct Pipe Segment: ${hlsUrl.substring(0, 50)}...`);

      const client = hlsUrl.startsWith('https') ? https : http;

      // إعداد الطلب للسيرفر الأصلي بنفس الهيدرز
      const proxyReq = client.get(hlsUrl, { headers: proxyHeaders }, (proxyRes) => {
        // تمرير كود الحالة والهيدرز الأساسية للمتصفح
        res.writeHead(proxyRes.statusCode, {
          'Content-Type': 'video/mp2t', // إجبار المتصفح على قراءته كفيديو
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache'
        });

        // ضخ البيانات مباشرة من السيرفر للمتصفح
        proxyRes.pipe(res);
      });

      proxyReq.on('error', (err) => {
        console.error(`[Proxy Error]: ${err.message}`);
        if (!res.headersSent) res.status(500).end();
      });

      req.on('close', () => {
        proxyReq.destroy(); // إلغاء الطلب لو المستخدم قفل الفيديو
      });
    }
  } catch (error) {
    console.error("Critical Proxy Error:", error);
    if (!res.headersSent) {
      res.status(500).send("Internal Server Error");
    }
  }
});

// بدء Express server
const SERVER_PORT = 9876;
http.createServer(app_express).listen(SERVER_PORT, () => {
  console.log(`[Streaming Proxy] بدء الخادم على http://localhost:${SERVER_PORT}`);
});

// Main Window
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: isDev ? 1000 : 500,
    height: 600,
    icon: `${__dirname}/assets/icons/Icon_256x256.png`,
    resizable: true,
    webPreferences: {
      zoomFactor: 1, // prevent auto zoom
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false, // <---- CORS bypass (بيسمح بطلبات cross-origin زي الأندرويد)
      allowRunningInsecureContent: true, // بيسمح بمحتوى HTTP داخل الصفحة HTTPS (mixed content)
      // تفعيل تسريع الرسوميات لضمان سلاسة العرض
      offscreen: false,
      // التأكد من أن الصور والنصوص لا تفقد حدتها عند التكبير
      plugins: true,      // تأكد من وجود هذا السطر
      // السماح بتشغيل المحتوى المحمي
      experimentalFeatures: true,
      autoplayPolicy: 'no-user-gesture-required'
    },
  });
  mainWindow.webContents.setZoomFactor(1);

  mainWindow.webContents.on('enter-html-full-screen', () => {
    mainWindow.setFullScreen(true);
  });

  mainWindow.webContents.on('leave-html-full-screen', () => {
    mainWindow.setFullScreen(false);
  });

  // Show devtools automatically if in development
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
  const mainContentsId = mainWindow.webContents.id;
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('window-id', mainContentsId);

    mainWindow.webContents.setVisualZoomLevelLimits(1, 1);
  });

  mainWindow.webContents.setWindowOpenHandler(async ({ url }) => {
    const childWindow = new BrowserWindow({
      width: isDev ? 1000 : 500,
      height: 600,
      icon: path.join(__dirname, 'assets/icons/Icon_256x256.png'),
      resizable: true,
      fullscreenable: true,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js'),
        webSecurity: false, // جرب تعطيلها مؤقتاً للتأكد إذا كانت هي السبب
        autoplayPolicy: 'no-user-gesture-required',
        // بيسمح بتشغيل محتوى HTTP داخل صفحة HTTPS
        allowRunningInsecureContent: true,
        // بيقفل خاصية ترقية الطلبات لـ HTTPS تلقائياً (في النسخ الحديثة)
        enableBlinkFeatures: 'AllowContentInitiatedDataUrlNavigations',
      }
    });

    // --- هذا الجزء يحل مشكلة الصلاحيات نهائياً ---
    childWindow.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
      if (permission === 'fullscreen') {
        return callback(true); // موافقة إجبارية على الفول سكرين
      }
      callback(true);
    });

    // ربط أحداث الـ HTML بالنافذة
    childWindow.webContents.on('enter-html-full-screen', () => {
      childWindow.setFullScreen(true);
    });

    childWindow.webContents.on('leave-html-full-screen', () => {
      childWindow.setFullScreen(false);
    });
    // إجبار الويندوز على السماح بالـ Fullscreen حتى لو فيه قيود من الـ OS
    childWindow.setMenuBarVisibility(false);

    // Load the URL into the child window
    childWindow.loadURL(url);
    childWindow.maximize();
    childWindow.show();


    const webContentsId = childWindow.webContents.id;

    headers_obj = {};
    // headers_obj["Referer"] = "";
    // headers_obj["userAgent"] = "";

    childWindowWebContentsHeaders[childWindow.webContents.id] = headers_obj;

    // Automatically open DevTools for the child window
    if (isDev) {
      childWindow.webContents.openDevTools();
    }

    childWindow.on('closed', () => {
      delete childWindowWebContentsHeaders[webContentsId];
      // console.log("webContentsId =>  " + webContentsId + "Deleted", childWindowWebContentsHeaders);
    });
    childWindow.webContents.on('did-finish-load', () => {
      childWindow.webContents.send('window-id', webContentsId);
    });
    return { action: 'deny' }; // Prevent default action
  });

  // mainWindow.loadURL(`file://${__dirname}/renderer/index.html`);
  mainWindow.loadURL(OpenerURL);
  mainWindow.maximize();
  mainWindow.show();


  ipcMain.on('check-idm', (event) => {
    fs.access(idmPath, fs.constants.F_OK, (err) => {
      event.reply('idm-check-result', !err);
    });
  });

  ipcMain.on('download-m3u8', async (event, obj) => {
    console.log("obj", obj);

    var [file_url, customFilename, customHeaders] = obj;

    if (!fs.existsSync(idmPath)) {
      console.error('IDM is not installed.');
      return;
    }

    // Define output directory
    const outputDir = path.join(app.getPath('downloads'), 'Elbatal-Tv');

    // Ensure the output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true }); // Create the directory if it doesn't exist
    }

    const headerArgs = Object.entries(customHeaders)
      .map(([key, value]) => `/h "${key}: ${value}"`)
      .join(' ');

    // IDM download command
    const command = `"${idmPath}" /p "${outputDir}" /f "${customFilename}" /n /d "${file_url}" ${headerArgs}`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error downloading MP4: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
      }
      console.log(`Download started with IDM: ${stdout}`);
    });



  });

  ipcMain.handle('sign-in-with-google', async (event) => {
    try {
      loginWithGooglee(); // Correct function name
      return 'Login successful';
    } catch (error) {
      console.error('Error in Google login:', error);
      throw error;
    }
  });

  function handleLoginWindowClosedWithoutAuth() {
    // Show an alert, redirect to a fallback page, or perform other logic
    mainWindow.webContents.send('g_error', "Window Close Without aouth");
    // You could show a message to the user or offer to try logging in again
  }
  ipcMain.handle('perform-ajax-request', async (event, ajax_obj) => {
    try {
      req_obj = JSON.parse(ajax_obj);
      if (req_obj.type == "GET") {
        fetch_data_obj = {};
        fetch_data_obj["method"] = "GET";
        if (typeof req_obj.headers !== "undefined") {
          fetch_data_obj["headers"] = req_obj.headers;
        }

        const response = await fetch(req_obj.url, fetch_data_obj);
        headers = {};
        for (const [key, value] of response.headers.entries()) {
          headers[key] = value;
        }
        const body_buffer = await response.arrayBuffer();
        return { headers: headers, body: body_buffer };


      } else if (req_obj.type == "POST") {


      }
    } catch (error) {
      console.error('Error performing AJAX request:', error);
      throw error;
    }
  });
  startExpressServer();

}

async function getAccessToken(code) {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      code: code,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    }),
  });

  return response.json();  // The response contains both access and refresh tokens
}
// Function to refresh access token using the refresh token
async function refreshAccessToken(refreshToken) {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  return response.json();  // The response contains a new access token
}
// Function to fetch Google profile using the access token
async function getGoogleProfile(accessToken) {
  try {
    const profileResponse = await fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    // Check if the response is not OK (status code not 200-299)
    if (!profileResponse.ok) {
      throw new Error(`Failed to fetch profile: ${profileResponse.status} ${profileResponse.statusText}`);
    }

    return await profileResponse.json(); // Return the profile data
  } catch (error) {
    // Rethrow the error to allow .catch() to handle it
    throw new Error(`Error in getGoogleProfile: ${error.message}`);
  }
}

// Express server to handle the OAuth callback
function startExpressServer() {
  const expressApp = express();
  // expressApp.use(cors());
  expressApp.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    next();
  });
  expressApp.get('/callback', (req, res) => {

    const authCode = req.query.code;
    if (authCode) {
      // Exchange the auth code for an access token
      getAccessToken(authCode)
        .then((tokenData) => {
          console.log('Access Token:', tokenData.access_token);
          // Close the login window once you have the token
          saveTokens(tokenData);  // Save tokens locally
          // Optionally fetch Google user profile data
          // getGoogleProfile(tokenData.access_token);


          if (isDev) {
            res.sendFile(path.join(__dirname, '/renderer/files/assets/success_login.html'));
          } else {
            res.send(`<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8"><title>تم تسجيل الدخول</title></head><body style="font-family:Arial,sans-serif;background:#0d1117;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;margin:0"><div style="text-align:center"><h1>✅ تم تسجيل الدخول بنجاح</h1><p>يمكنك الآن العودة إلى التطبيق وإغلاق هذه الصفحة.</p></div></body></html>`);
          }

          // res.send('Authentication successful. You can close this window.');
          // mainWindow.webContents.send("sign-in-with-google");
          loginWithGooglee();

          if (mainWindow) {
            // If the window is already open, bring it to the front
            if (mainWindow.isMinimized()) {
              mainWindow.restore();
            }
            mainWindow.focus();
          }
        })
        .catch((err) => {
          // res.send('Error fetching access token:', err);

          console.error('Error fetching access token:', err);
          // loginWindow.close();
        })

    } else {
      res.send('No authorization code received.');
    }

    // gauthCompleted = true;
    // loginWindow.close();


  });

  expressApp.get('/proxy', async (req, res) => {
    try {
      const videoUrl = decodeURIComponent(req.query.url);
      let videoHeaders = decodeURIComponent(atob(req.query.proxy_headers));
      videoHeaders = fixSingleQuotes(videoHeaders);

      // Log the URL for debugging
      // console.log("videoUrl:", videoUrl);

      // Create an agent based on the protocol
      const urlObj = new URL(videoUrl);
      const agent = urlObj.protocol === 'https:'
        ? new https.Agent({ rejectUnauthorized: false })
        : new http.Agent();

      // Parse headers
      const headersObject = JSON.parse(videoHeaders);

      // Send a HEAD request using node-fetch
      const response = await fetch(videoUrl, {
        method: 'HEAD',
        headers: headersObject,
        agent: agent
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch content type, status: ${response.status}`);
      }
      const contentType = response.headers.get('content-type');
      res.json({ contentType });

    } catch (error) {
      console.error("error =>", error);
      res.status(500).json({ error: 'Failed to fetch content type' });
    }
  });
  // Proxy endpoint
  expressApp.get('/fetch-video', async (req, res) => {
    const videoURL = decodeURIComponent(req.query.url);
    var videoHeaders = decodeURIComponent(atob(req.query.proxy_headers));
    videoHeaders = JSON.parse(fixSingleQuotes(videoHeaders));
    // Extract the Range header if present
    const range = req.headers.range;
    if (!range) {
      return res.status(416).send('Range not specified');
    }

    videoHeaders["Range"] = range;
    try {
      const urlObj = new URL(videoURL);
      const agent = urlObj.protocol === 'https:' ? new https.Agent({
        rejectUnauthorized: false,  // Disable SSL certificate validation
      }) : new http.Agent();
      // Fetch the video with the Range header
      const response = await fetch(videoURL, {
        agent,
        headers: videoHeaders,
      });

      // Check if the response is valid
      if (response.status === 200 || response.status === 206) {
        // Set headers for the response
        res.writeHead(response.status, {
          'Content-Range': response.headers.get('content-range'),
          'Accept-Ranges': 'bytes',
          'Content-Type': 'video/mp4',
          'Content-Length': response.headers.get('content-length'),
        });

        // Pipe the response to the client
        response.body.pipe(res);
      } else {
        res.status(response.status).send('Error fetching video');
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Proxy error');
    }

  });


  expressApp.listen(19620, () => {
    console.log('OAuth callback server listening on port 19620');
  });
}

ipcMain.on('log_out', (event) => {
  clearTokens();
})
ipcMain.on('update-headers', (event, obj) => {
  window_id = obj.window_id;
  headers = obj.custom_headers;

  childWindowWebContentsHeaders[window_id] = headers;
});

// الكشف التلقائي عن codec باستخدام FFprobe/FFmpeg


function fixSingleQuotes(jsonStr) {
  // Replace single quotes with double quotes
  const fixedStr = jsonStr.replace(/'/g, '"');

  try {
    // Try to parse the fixed JSON string
    return fixedStr;
  } catch (error) {
    console.error("Invalid JSON string", error);
    return null;
  }
}
// About Window
function createAboutWindow() {
  aboutWindow = new BrowserWindow({
    width: 300,
    height: 300,
    title: 'About Electron',
    icon: `${__dirname}/assets/icons/Icon_256x256.png`,
  });

  aboutWindow.loadFile(path.join(__dirname, './renderer/about.html'));
}

let notificationCount = 0; // Keeps track of active notifications

function createCustomNotification(notificationObj) {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const notificationWidth = 300;
  const notificationHeight = 100;
  const margin = 10;

  // Calculate y-position for new notification based on count
  const yPosition = height - (notificationHeight + margin) * (notificationCount + 1);
  // Position at the bottom right of the screen
  const notificationWindow = new BrowserWindow({
    width: notificationWidth,
    height: notificationHeight,
    x: width - notificationWidth - margin,
    y: yPosition,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      // تفعيل تسريع الرسوميات لضمان سلاسة العرض
      offscreen: false,
      // التأكد من أن الصور والنصوص لا تفقد حدتها عند التكبير
      zoomFactor: 1.0,
    },
  });

  notificationWindow.loadFile(path.join(__dirname, '/renderer/files/assets/notifications.html'));


  notificationWindow.once('ready-to-show', () => {
    notificationWindow.show();
    notificationWindow.webContents.send('set-notification-data', JSON.stringify(notificationObj));
    console.log(notificationObj);

  });
  notificationWindow.on('closed', () => {
    notificationCount--;
    repositionNotifications();
  });

  notificationCount++; // Increase count for each new notification
}
function repositionNotifications() {
  // Adjust position of remaining notifications
  BrowserWindow.getAllWindows().forEach((window, index) => {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    const notificationWidth = 300;
    const notificationHeight = 100;
    const margin = 10;
    const yPosition = height - (notificationHeight + margin) * (index + 1);
    window.setPosition(width - notificationWidth - margin, yPosition);
  });
}
// Function to show a notification
function showNotification(notificationObj) {
  return false;
  let notification = new Notification({
    title: notificationObj.title,
    body: notificationObj.body,

  })
  notification.on('click', async () => {
    let targetUrl = notificationObj.url;
    console.log(targetUrl);
    if (notificationObj.open_url_where == "app") {
      mainWindow.loadURL(targetUrl);
      if (mainWindow) {
        // If the window is already open, bring it to the front
        if (mainWindow.isMinimized()) {
          mainWindow.restore();
        }
        mainWindow.focus();
      }

    } else if (notificationObj.open_url_where == "browser") {
      try {
        await shell.openExternal(targetUrl);
        return { success: true };
      } catch (error) {
        console.error('Failed to open URL:', error);
        return { success: false, error: error.message };
      }
    }
  });
  notification.show();

}
// When the app is ready, create the window
if (!gotTheLock) {
  app.quit(); // If another instance is running, quit the new one
} else {
  app.on('second-instance', (event, argv, workingDirectory) => {
    // This method is called when a second instance is tried to be opened
    if (mainWindow) {
      // If the window is already open, bring it to the front
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      }
      mainWindow.focus();
    }

    if (argv.length >= 2) {
      const protocolUrl = argv.find(arg => arg.startsWith(customScheme + '://'));
      if (protocolUrl) {
        const onlyurl = new URL(protocolUrl);
        const queryParams = Object.fromEntries(onlyurl.searchParams.entries());
        const queryString = new URLSearchParams(queryParams).toString();
        mainWindow.loadURL(ONLINE_APP_URL + (queryString ? `?${queryString}` : ""));
      }
    }
  });
  app.on('ready', () => {

    // مدير التحميلات المحلي (SQLite + تحميل نيتف بالهيدرز)
    try {
      downloadsManager = new DownloadsManager();
      downloadsManager.init();
    } catch (e) {
      console.error('downloads-manager init error:', e);
    }

    // protocol.handle(customScheme, (request) => {
    //   const filePath = request.url.slice((customScheme + '://').length);

    // })
    const protocolUrl = process.argv.find(arg => arg.startsWith(customScheme + '://'));
    if (protocolUrl) {
      // const onlyurl = protocolUrl.slice((customScheme + '://').length);
      const onlyurl = new URL(protocolUrl);
      const queryParams = Object.fromEntries(onlyurl.searchParams.entries());
      const queryString = new URLSearchParams(queryParams).toString();
      OpenerURL = ONLINE_APP_URL + (queryString ? `?${queryString}` : "");
    }

    session.defaultSession.setPermissionCheckHandler((webContents, permission, requestingOrigin) => {
      if (permission === 'mediaKeySystem') {
        return true; // السماح بنظام المفاتيح دائماً
      }
      return false;
    });

    session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
      if (permission === 'mediaKeySystem') {
        callback(true);
      } else {
        callback(false);
      }
    });


    session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
      const childWindowData = childWindowWebContentsHeaders[details.webContentsId];

      if (childWindowData) {
        // console.log(childWindowData);
        for (let key in childWindowData) {
          details.requestHeaders[key] = childWindowData[key];
        }
      }

      // CORS bypass marker (بيضيفه jqeury.mouagax.js للطلبات cross-origin)
      // زي الـ native layer في الأندرويد: بنحذفه قبل ما يوصل للسيرفر
      if (details.requestHeaders["MOuCustomREQUEST"] === "NICE") {
        delete details.requestHeaders["MOuCustomREQUEST"];
      }

      // وقف الكاش نهائيا: أي طلب من التطبيق ياخد نسخة جديدة من السيرفر
      details.requestHeaders['Cache-Control'] = 'no-cache, no-store, must-revalidate, max-age=0';
      details.requestHeaders['Pragma'] = 'no-cache';


      // Delete any header that starts with 'sec-'
      // Object.keys(details.requestHeaders).forEach(header => {
      //   if (header.toLowerCase().startsWith('sec-')) {
      //     delete details.requestHeaders[header];
      //   }
      // });


      callback({ cancel: false, requestHeaders: details.requestHeaders });
    });

    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
      const headers = details.responseHeaders;

      delete headers["upgrade-insecure-requests"];
      delete headers["Strict-Transport-Security"];

      // CORS bypass: نضيف هيدرات الـ CORS لكل الردود عشان أي طلب cross-origin
      // من الـ renderer يعدي من غير ما السيرفر يبعتهم (نفس حل الأندرويد)
      headers["Access-Control-Allow-Origin"] = ["*"];
      headers["Access-Control-Allow-Headers"] = ["*"];
      headers["Access-Control-Allow-Methods"] = ["*"];
      headers["Access-Control-Expose-Headers"] = ["*"];

      let plainHeaders = Object.entries(headers)
        .map(([key, value]) => `${key}: ${value.join(", ")}`)
        .join("\n");
      enc = mou_custom_encode(plainHeaders);
      headers["mou_enc_h"] = enc;
      callback({ cancel: false, responseHeaders: headers })
    })

    if (isDev) {
      app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
        // Allow all certificates (NOT FOR PRODUCTION USE)
        event.preventDefault();
        callback(true);
      });
      session.defaultSession.setCertificateVerifyProc((request, callback) => {
        callback(0);  // 0 indicates that the certificate is trusted.
      });
    }
    globalShortcut.register('Esc', () => {
      if (mainWindow && mainWindow.isFocused()) {
        mainWindow.webContents.send('Esc_clicked');
      }
    });

    createMainWindow();
    const mainMenu = Menu.buildFromTemplate(menu);
    Menu.setApplicationMenu(mainMenu);
    // Remove variable from memory
    mainWindow.on('closed', () => (mainWindow = null));

    // Connect to the Socket.IO server
    const socket = io('http://localhost:3000');

    // Listen for notifications from the server
    socket.on('notification', (message) => {
      createCustomNotification(message);
    });

  });
}
// Menu template
let menu = [];
if (isDev) {
  menu = [
    ...(isMac
      ? [
        {
          label: app.name,
          submenu: [
            {
              label: 'About',
              click: createAboutWindow,
            },
          ],
        },
      ]
      : []),
    {
      role: 'fileMenu',
    },
    ...(!isMac
      ? [
        {
          label: 'Help',
          submenu: [
            {
              label: 'About',
              click: createAboutWindow,
            },
          ],
        },
      ]
      : []),
    // {
    //   label: 'File',
    //   submenu: [
    //     {
    //       label: 'Quit',
    //       click: () => app.quit(),
    //       accelerator: 'CmdOrCtrl+W',
    //     },
    //   ],
    // },
    ...(isDev
      ? [
        {
          label: 'Developer',
          submenu: [
            { role: 'reload' },
            { role: 'forcereload' },
            { type: 'separator' },
            { role: 'toggledevtools' },
          ],
        },
      ]
      : []),
  ];
}



ipcMain.on('activation_code', async (event, code) => {
  // console.log("code", code);
  mainWindow.webContents.send('activation_code', code);  // Send profile data to renderer
});

app.on('will-quit', () => {
  // Unregister all shortcuts when the app is quitting
  globalShortcut.unregisterAll();
});
// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (!isMac) app.quit();
});

// Open a window if none are open (macOS)
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
});

// Listen for the 'quit-app' event from the renderer process
ipcMain.on('quit-app', () => {
  app.quit();
});

// Handle request for app version from the renderer
ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

// Handle request for app version from the renderer
ipcMain.handle("get-youtube-video", async (event, { video_url }) => {
  let yt_id;

  if (isYouTubeVideoLink(video_url)) {
    yt_id = extractYouTubeVideoId(video_url);
  } else {
    yt_id = video_url; // fallback if raw ID passed
  }

  const YOUTUBE_URL = "https://www.youtube.com/watch?v=" + yt_id;
  const wantedFormatIds = ['299', '298', '138', '137', '136', '135', '134', '133', '160', '140'];

  try {

    // -j means JSON output
    const stdout = await ytDlpWrap.execPromise([
      "--ffmpeg-location",
      path.join(__dirname, "node_modules/ffmpeg-static"),
      "-j",
      YOUTUBE_URL,
    ]);

    const data = JSON.parse(stdout);

    return data.formats
      .filter(f => wantedFormatIds.includes(f.format_id))
      .map(f => ({
        format_id: f.format_id,
        quality: f.height ? `${f.height}p` : "audio",
        mime: f.mime_type,
        fps: f.fps || null,
        url: f.url,
      }));
  } catch (error) {
    console.error("yt-dlp error:", error);
    return [];
  }
});

// Handle file download request with progress tracking
ipcMain.handle('download-file', async (event, { fileUrl, savePath }) => {
  const directoryPath = path.dirname(savePath);

  // Check if the directory exists, create it if necessary
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
  const agent = fileUrl.startsWith('https:')
    ? new https.Agent({ rejectUnauthorized: false })
    : new http.Agent();
  const response = await fetch(fileUrl, { agent: agent });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const totalBytes = parseInt(response.headers.get('content-length'), 10);
  const fileStream = fs.createWriteStream(savePath);

  let downloadedBytes = 0;

  // Create a writable stream and use the response.body directly
  response.body.on('data', (chunk) => {
    downloadedBytes += chunk.length;

    // Send progress updates to renderer
    const progress = (downloadedBytes / totalBytes) * 100;
    event.sender.send('download-progress', progress.toFixed(2));
  });

  response.body.pipe(fileStream); // Pipe the response body to the file stream

  return new Promise((resolve, reject) => {
    fileStream.on('finish', () => {
      resolve({ success: true, savePath });
    });

    fileStream.on('error', (err) => {
      fs.unlink(savePath, () => reject({ success: false, message: err.message })); // Delete file on error
      reject({ success: false, message: "Error While Downloading" });
    });
  });
});

// Handle ZIP extraction
ipcMain.handle('extract-zip', (event, { zipPath, extractTo }) => {
  return new Promise((resolve, reject) => {
    // Ensure the extraction directory exists
    if (!fs.existsSync(extractTo)) {
      fs.mkdirSync(extractTo, { recursive: true });
    }

    try {
      const zip = new AdmZip(zipPath);
      zip.extractAllTo(extractTo, true);  // Extracts to the specified path
      resolve({ success: true, extractPath: extractTo });
    } catch (err) {
      reject({ success: false, message: `Error extracting ZIP: ${err.message}` });
    }
  });
});
// Handle save text to file
ipcMain.handle('save-text', (event, { filePath, text }) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, text, (err) => {
      if (err) {
        return reject({ success: false, message: `Error saving file: ${err.message}` });
      }
      resolve({ success: true });
    });
  });
});

// Handle remove folder
ipcMain.handle('remove-folder', (event, folderPath) => {
  return new Promise((resolve, reject) => {
    fs.rm(folderPath, { recursive: true, force: true }, (err) => {
      if (err) {
        return reject({ success: false, message: `Error removing folder: ${err.message}` });
      }
      resolve({ success: true });
    });
  });
});
ipcMain.handle('remove-file', (event, filePath) => {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err) {
        return reject({ success: false, message: `Error removing file: ${err.message}` });
      }
      resolve({ success: true });
    });
  });
});
// Handle read file
ipcMain.handle('read-file', (event, filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return reject({ success: false, message: `Error reading file: ${err.message}` });
      }
      resolve({ success: true, content: data });
    });
  });
});
ipcMain.on('quit-and-install', (event, filePath) => {

  if (fs.existsSync(filePath)) {
    exec(`"${filePath}"`, (error) => {
      if (error) {
        console.error('Installation error:', error);
        return;
      }
      const exePath = app.getPath('exe');
      app.quit();
      exec(`"${exePath}"`, (err) => {
        if (err) {
          console.error('Error launching new app:', err);
        }
      });

    });
  } else {
    console.error('Error', 'Update file not found. Please try updating again.');
  }
});

ipcMain.handle('get-user-data-path', () => {
  return app.getPath('userData');  // Return the userData path
});
// IPC handler to open an external link
ipcMain.handle('open-external-link', async (event, url) => {
  try {
    await shell.openExternal(url);
    return { success: true };
  } catch (error) {
    console.error('Failed to open URL:', error);
    return { success: false, error: error.message };
  }
});
ipcMain.handle('open-internal-link', async (event, url) => {
  mainWindow.loadURL(url);
  if (mainWindow) {
    // If the window is already open, bring it to the front
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }
    mainWindow.focus();
  }
});

// ipcMain.handle('get-challenge-window-cookies', (event, url) => {
//   if (getDomainFromUrl(url)) {
//     return challenge_window_cookies[getDomainFromUrl(url)];
//   } else {
//     return null;
//   }

// });

// ipcMain.handle('open-chellange-window', async (event, url) => {
//   let browser;
//   try {
//     // تشغيل متصفح خفي (Headless)
//     browser = await puppeteer.launch({
//       executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', // مسار الكروم في جهازك
//       headless: false, // اجعلها false إذا أردت رؤية المتصفح وهو يحل التحدي
//       args: ['--no-sandbox', '--disable-setuid-sandbox']
//     });

//     const page = await browser.newPage();

//     // تعيين User-Agent واقعي
//     await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36');

//     // الذهاب للرابط والانتظار حتى يتم تحميل الشبكة بالكامل (تخطي حماية Cloudflare)
//     // 'networkidle2' تعني الانتظار حتى يتوقف الموقع عن إرسال طلبات (علامة انتهاء التحدي)
//     await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

//     // في حال وجود صفحة انتظار إضافية، ننتظر ظهور عنصر معروف في الموقع
//     // مثلاً ننتظر ظهور الـ body أو كلاس معين
//     await page.waitForSelector('body');

//     // استخراج الـ HTML بعد فك الحماية
//     const extractedhtml = await page.content();

//     // إرسال الـ HTML للنافذة الرئيسية
//     mainWindow.webContents.send('cloudflare-html', extractedhtml);

//   } catch (error) {
//     console.error("Puppeteer Error:", error);
//     mainWindow.webContents.send('cloudflare-html', "Error: Failed to bypass Cloudflare");
//   } finally {
//     if (browser) await browser.close();
//   }
// });

// const COOKIES_DIR = path.join(__dirname, 'cookies');
let COOKIES_DIR;

if (isDev) {
  COOKIES_DIR = path.join(__dirname, '/moucookies');
} else {
  COOKIES_DIR = path.join(app.getPath('userData'), '/moucookies');
}


// إنشاء فولدر الكوكيز
if (!fs.existsSync(COOKIES_DIR)) {
  fs.mkdirSync(COOKIES_DIR);
}

// استخراج الدومين
function getDomain(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return 'default';
  }
}

ipcMain.handle('open-chellange-window', async (event, url, requestId) => {
  let browser;
  let page;

  const domain = getDomain(url);
  const cookiesPath = path.join(COOKIES_DIR, `${domain}.json`);

  try {
    browser = await puppeteer.launch({
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      headless: false,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled',
      ],
      defaultViewport: null
    });

    page = await browser.newPage();

    // events للحماية
    page.on('close', () => {
      console.log(`🚪 Page closed (${domain})`);
    });

    browser.on('disconnected', () => {
      console.log(`🔌 Browser disconnected (${domain})`);
    });

    // User-Agent
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36"
    );

    // fingerprint تحسين
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'language', { get: () => 'en-US' });
      Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
    });

    // =========================
    // تحميل الكوكيز
    // =========================
    if (fs.existsSync(cookiesPath)) {
      try {
        const savedCookies = JSON.parse(fs.readFileSync(cookiesPath));

        console.log(`🍪 Found saved cookies for ${domain}:`, savedCookies);

        if (Array.isArray(savedCookies) && savedCookies.length) {
          await page.setCookie(...savedCookies);
          console.log(`🍪 Cookies loaded for ${domain}`);
        }
      } catch {
        console.log(`⚠️ Failed to load cookies for ${domain}`);
      }
    }

    console.log("🌐 Opening:", url);

    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // استنى redirect لو فيه
    try {
      await page.waitForNavigation({
        waitUntil: 'networkidle2',
        timeout: 15000
      });
    } catch { }

    // =========================
    // انتظار cf_clearance
    // =========================
    const waitForClearance = async () => {
      let attempts = 0;
      const maxAttempts = 60;

      while (attempts < maxAttempts) {
        attempts++;

        if (!page || page.isClosed()) return null;

        try {
          // 1. فحص الحالة من خلال الـ JavaScript الخاص بـ Cloudflare داخل الصفحة
          const status = await page.evaluate(() => {
            const text = document.body ? document.body.innerText : '';
            const html = document.documentElement.innerHTML;

            // هل ما زلنا في صفحة الانتظار؟
            const isStillChallenging =
              text.includes('Verify you are human') ||
              text.includes('Checking your browser') ||
              html.includes('cf-challenge') ||
              html.includes('ray_id');

            // هل الصفحة الحالية هي صفحة المحتوى الحقيقي؟
            // بنعرف ده لو لقينا عناصر مشهورة في المواقع زي nav, footer أو كلمات دلالية للموقع
            const hasMainContent = document.querySelectorAll('p, div, span').length > 50;

            return { isStillChallenging, hasMainContent };
          });

          // 2. فحص الكوكيز (كإشارة إضافية وليست وحيدة)
          const cookies = await page.cookies();
          const hasCfCookie = cookies.some(c => c.name === 'cf_clearance');

          // 3. التحقق من العنوان (Cloudflare غالباً بيغير الـ title أثناء التحدي)
          const title = await page.title();
          const isTitleClean = !title.includes('Just a moment') && !title.includes('Attention Required');

          console.log(`⏳ Attempt ${attempts}: Challenging=${status.isStillChallenging}, Cookie=${hasCfCookie}`);

          // الشرط "الذكي" للنجاح:
          // إذا اختفت نصوص التحدي + العنوان أصبح طبيعي + يوجد محتوى في الصفحة
          if (!status.isStillChallenging && isTitleClean && status.hasMainContent) {
            console.log(`✅ Passed based on Page Content & Title (${domain})`);

            // حفظ الكوكيز الحالية أياً كانت (لأن المواقع الجديدة بتستخدم أسماء مختلفة)
            fs.writeFileSync(cookiesPath, JSON.stringify(cookies, null, 2));
            return cookies;
          }

        } catch (e) {
          console.log(`⚠️ Error during check:`, e.message);
        }

        await new Promise(r => setTimeout(r, 2000));
      }

      return null;
    };

    const cookies = await waitForClearance();

    if (cookies) {
      // استخراج الـ HTML النهائي
      const extractedHtml = await page.content();

      // إرسال الـ HTML للـ Renderer
      mainWindow.webContents.send('cloudflare-html', {
        requestId: requestId,
        html: extractedHtml,
        domain: domain
      });

      console.log(`🚀 Page loaded successfully (Direct or Bypass) for ${domain}`);
    } else {
      throw new Error("Failed to load page or bypass Cloudflare");
    }

    const extractedHtml = await page.content();

    mainWindow.webContents.send('cloudflare-html', {
      requestId: requestId, // عشان الـ Renderer يعرف ده بتاع انهي صفحة
      html: extractedHtml,
      domain: domain
    });

  } catch (e) {
    console.error(`❌ Error (${domain}):`, e);

    mainWindow.webContents.send('cloudflare-done', {
      requestId,
      domain,
      error: e.message
    });

  } finally {
    try {
      if (browser) {
        await browser.close();
      }
    } catch { }
  }
});

function loginWithGooglee() {
  const tokens = loadTokens();
  if (tokens && tokens.access_token) {
    // If tokens exist, try to use them
    console.log('Found saved tokens, attempting to use them.');
    getGoogleProfile(tokens.access_token)
      .then(profile => {
        console.log('User profile:', profile);

        mainWindow.webContents.send('g_profile', { ...profile, idToken: tokens.id_token || null });  // Send profile data to renderer
        gauthCompleted = true;
        loginWindow.close();
      })
      .catch(err => {
        // If access token is expired or invalid, try refreshing it
        if (tokens.refresh_token) {
          refreshAccessToken(tokens.refresh_token)
            .then(newTokens => {
              console.log('Refreshed access token:', newTokens.access_token);
              saveTokens({ ...newTokens, refresh_token: tokens.refresh_token });
              return getGoogleProfile(newTokens.access_token);
            })
            .then(profile => {
              console.log('User profile after refresh:', profile);
              const updatedTokens = loadTokens() || {};

              mainWindow.webContents.send('g_profile', { ...profile, idToken: updatedTokens.id_token || newTokens.id_token || null });

            })
            .catch(err => {
              console.error('Failed to refresh token or retrieve profile:', err);
              // If all fails, request login again
              loginWithGooglee();
            });
        } else {
          loginWithGooglee();
        }
      });
  } else {
    // No tokens found, initiate login
    // loginWindow = new BrowserWindow({
    //   width: 600,
    //   height: 800,
    //   webPreferences: {
    //     nodeIntegration: false, // For security
    //     contextIsolation: true
    //   },
    // });
    // loginWindow.loadURL(OAUTH_URL);
    // // Detect when the URL changes to the redirect URI
    // loginWindow.on('closed', () => {
    //   if (!gauthCompleted) {
    //     handleLoginWindowClosedWithoutAuth();
    //   }
    // });
    // loginWindow.webContents.on('will-redirect', (event, newUrl) => {
    //   if (newUrl.startsWith(REDIRECT_URI)) {
    //     // Extract the authorization code from the URL
    //     const urlObj = new URL(newUrl);
    //     const authCode = urlObj.searchParams.get('code');
    //     // Exchange the auth code for an access token
    //     getAccessToken(authCode)
    //       .then((tokenData) => {
    //         console.log('Access Token:', tokenData.access_token);
    //         // Close the login window once you have the token
    //         saveTokens(tokenData);  // Save tokens locally
    //         // Optionally fetch Google user profile data
    //         // getGoogleProfile(tokenData.access_token);
    //         loginWithGooglee();
    //       })
    //       .catch((err) => {
    //         console.error('Error fetching access token:', err);
    //         loginWindow.close();
    //       });
    //   }
    // });
    shell.openExternal(OAUTH_URL); // Opens the URL in the default browser

  }
}

function extractYouTubeVideoId(url) {
  if (typeof url !== 'string') return null;

  const pattern = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(pattern);
  return match ? match[1] : null;
}

function isYouTubeVideoLink(url) {
  return extractYouTubeVideoId(url) !== null;
}


function strtr(t, r, s) { var i, e, h, n, o = "", f = 0, p = 0, a = !1, c = "", g = [], l = [], u = "", b = !1; if ("object" == typeof r) { for (o in a = this.ini_set("phpjs.strictForIn", !1), r = this.krsort(r), this.ini_set("phpjs.strictForIn", a), r) r.hasOwnProperty(o) && (g.push(o), l.push(r[o])); r = g, s = l } for (i = t.length, e = r.length, h = "string" == typeof r, n = "string" == typeof s, f = 0; f < i; f++) { if (b = !1, h) { for (c = t.charAt(f), p = 0; p < e; p++)if (c == r.charAt(p)) { b = !0; break } } else for (p = 0; p < e; p++)if (t.substr(f, r[p].length) == r[p]) { b = !0, f = f + r[p].length - 1; break } u += b ? n ? s.charAt(p) : s[p] : t.charAt(f) } return u }

function mou_custom_encode($txt, $num = 1) {
  $default = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  $custom = "ZYXWVUTSRQPONMLKJIHGFEDCBAzyxwvutsrqponmlkjihgfedcba9876543210+/";
  $encoded = escape($txt);
  for ($i = 1; $i <= $num; $i++) {
    $encoded = strtr(btoa($encoded), $custom, $default);
  }
  return $encoded;
}

function mou_custom_decode($txt, $num = 1) {
  $default = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  $custom = "ZYXWVUTSRQPONMLKJIHGFEDCBAzyxwvutsrqponmlkjihgfedcba9876543210+/";
  $decoded = $txt;
  for ($i = 1; $i <= $num; $i++) {
    $decoded = atob(strtr($decoded, $custom, $default));
  }
  try {
    return decodeURIComponent(decodeURI($decoded));
  } catch (error) {
    console.error(error);
    return unescape($decoded);
    // Expected output: ReferenceError: nonExistentFunction is not defined
    // (Note: the exact output may be browser-dependent)
  }

}

function getDomainFromUrl(url) {
  try {
    // Try to construct a URL object
    const validUrl = new URL(url);
    return validUrl.hostname; // returns domain like "example.com"
  } catch (err) {
    // If it throws an error, the URL is invalid
    return null;
  }
}

function saveData(key, value) {
  let data = {};
  if (fs.existsSync(storagePath)) {
    const raw = fs.readFileSync(storagePath);
    try {
      data = JSON.parse(raw);
    } catch (e) {
      console.error('Error parsing storage.json:', e);
    }
  }
  data[key] = value;
  fs.writeFileSync(storagePath, JSON.stringify(data, null, 4));
}

function getData(key) {
  if (!fs.existsSync(storagePath)) return null;
  try {
    const raw = fs.readFileSync(storagePath);
    const data = JSON.parse(raw);
    return data[key] ?? null;
  } catch (e) {
    console.error('Error reading storage.json:', e);
    return null;
  }
}

function resolveHttpWithHeaders(url, headers = {}, maxRedirects = 10) {
  return new Promise((resolve, reject) => {
    if (maxRedirects <= 0) {
      return reject(new Error("Too many redirects"));
    }

    // Force HTTP
    url = url.replace(/^https:/i, "http:");

    const urlObj = new URL(url);
    const lib = urlObj.protocol === "https:" ? https : http;

    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      port: urlObj.port || (urlObj.protocol === "https:" ? 443 : 80),
      headers
    };

    const req = lib.get(options, res => {
      const contentType = res.headers["content-type"] || null;

      if ([301, 302, 303, 307, 308].includes(res.statusCode)) {
        const location = res.headers.location;
        if (!location) {
          return resolve({ url, contentType });
        }

        const nextUrl = new URL(location, url).toString();
        resolve(resolveHttpWithHeaders(nextUrl, headers, maxRedirects - 1));
      } else {
        resolve({ url, contentType });
      }
    });

    req.on("error", reject);
  });
}

function getQueryVariable(variable, meth = 1, link = "") {
  if (meth == 1) {
    var query = window.location.search.substring(1);
  } else {
    var query = link.split("?")[1];
  }
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return decodeURIComponent(pair[1]);
    }
  }
  return (false);
}

function getQueryParams(url) {
  let params = {};
  let queryString = url.split('?')[1]; // Get the part after '?'

  if (queryString) {
    let queries = queryString.split('&'); // Split into individual parameters

    queries.forEach(function (query) {
      let [key, value] = query.split('='); // Split into key and value
      params[decodeURIComponent(key)] = decodeURIComponent(value || ''); // Decode URI components
    });
  }

  return params;
}

ipcMain.handle("resolve-http-url", async (_, payload) => {
  const { url, headers } = payload;
  return await resolveHttpWithHeaders(url, headers);
});
ipcMain.handle('clear-all-data', async () => {
  await session.defaultSession.clearStorageData();
  return "Data Cleared";
});


ipcMain.on('request-fullscreen', (event) => {
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);
  if (win) {
    win.setFullScreen(true);
    // في ويندوز، يفضل أحياناً استخدام maximize لو الـ fullscreen فيه مشكلة في بعض الكروت
    // win.maximize(); 
  }
});
module.exports = { saveData, getData };