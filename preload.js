const os = require('os');
const path = require('path');
const { app, contextBridge, ipcRenderer } = require('electron');
const Toastify = require('toastify-js');
const crypto = require('crypto');
const { machineIdSync, machineId } = require('node-machine-id');
const fs = require('fs');

contextBridge.exposeInMainWorld('os', {
  homedir: () => os.homedir(),
});

contextBridge.exposeInMainWorld('path', {
  join: (...args) => path.join(...args),
});

contextBridge.exposeInMainWorld('ipcRenderer', {
  send: (channel, data) => ipcRenderer.send(channel, data),
  invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
  on: (channel, func) =>
    ipcRenderer.on(channel, (event, ...args) => func(...args)),
});


contextBridge.exposeInMainWorld("httpResolver", {
  resolve: (url, headers = {}) =>
    ipcRenderer.invoke("resolve-http-url", { url, headers })
});

// contextBridge.exposeInMainWorld('Toastify', {
//   toast: (options) => Toastify(options).showToast(),
// });

contextBridge.exposeInMainWorld('electron', {
  performAjaxRequest: (obj) => ipcRenderer.invoke('perform-ajax-request', obj),
  signInWithGoogle: () => ipcRenderer.invoke('sign-in-with-google'),
  decryptYacine: (mainRes, yacinKey) => {
    const buffer = Buffer.from(mainRes, 'base64');
    const decodedStr = buffer.toString('ascii');
    const yacinKeyLength = yacinKey.length;
    let result = '';

    for (let i = 0; i < decodedStr.length; i++) {
      const charCode = decodedStr.charCodeAt(i) ^ yacinKey.charCodeAt(i % yacinKeyLength);
      result += String.fromCharCode(charCode);
    }
    return result;
  },
  getMachineId: () => machineIdSync({ original: true }),
  GetDeviceName: () => os.hostname(),
  GetDeviceType: () => os.platform(),
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  isFileExist: (filePath) => {
    return fs.existsSync(filePath); // Returns true if file exists, false otherwise
  },
  downloadFile: (fileUrl, savePath) => ipcRenderer.invoke('download-file', { fileUrl, savePath }),
  onDownloadProgress: (callback) => ipcRenderer.on('download-progress', (event, progress) => {
    callback(progress);
  }),
  extractZip: (zipPath, extractTo) => ipcRenderer.invoke('extract-zip', { zipPath, extractTo }),
  saveText: (filePath, text) => ipcRenderer.invoke('save-text', { filePath, text }),
  removeFolder: (folderPath) => ipcRenderer.invoke('remove-folder', folderPath),
  removeFile: (filePath) => ipcRenderer.invoke('remove-file', filePath),
  readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
  getProjectRoot: () => path.resolve(__dirname),
  getUserDataPath: () => ipcRenderer.invoke('get-user-data-path'),
  openExternalLink: (url) => ipcRenderer.invoke('open-external-link', url),
  openInternalLink: (url) => ipcRenderer.invoke('open-internal-link', url),
  openChellangeWindow: (url, requestId) => ipcRenderer.invoke('open-chellange-window', url, requestId),

  GetChallengeWindowCookies: (url) => ipcRenderer.invoke('get-challenge-window-cookies', url),

  getYoutubeVideo: (video_url) => ipcRenderer.invoke('get-youtube-video', { video_url }),
  onRedirect: (callback) => {
    ipcRenderer.on("redirect-detected", (event, data) => callback(data));
  },
  clearAllData: () => ipcRenderer.invoke('clear-all-data'),
  send: (channel, data) => ipcRenderer.send(channel, data)
});


// Hide Electron
Object.defineProperty(navigator, "userAgent", {
  get: () =>
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36",
});



// إزالة webdriver
Object.defineProperty(navigator, 'webdriver', {
  get: () => false,
});

// fake plugins
Object.defineProperty(navigator, 'plugins', {
  get: () => [1, 2, 3, 4, 5],
});

// fake languages
Object.defineProperty(navigator, 'languages', {
  get: () => ['en-US', 'en'],
});

// chrome object
window.chrome = {
  runtime: {},
};

// permissions fix
const originalQuery = window.navigator.permissions.query;
window.navigator.permissions.query = (parameters) => (
  parameters.name === 'notifications'
    ? Promise.resolve({ state: Notification.permission })
    : originalQuery(parameters)
);

// WebGL spoof
const getParameter = WebGLRenderingContext.prototype.getParameter;
WebGLRenderingContext.prototype.getParameter = function (parameter) {
  if (parameter === 37445) return 'Intel Inc.'; // UNMASKED_VENDOR_WEBGL
  if (parameter === 37446) return 'Intel Iris OpenGL Engine'; // UNMASKED_RENDERER_WEBGL
  return getParameter(parameter);
};