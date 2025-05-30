// electron/main.js
const { app, BrowserWindow } = require('electron');
const path = require('node:path'); // 使用 node: 前缀以明确是 Node.js 内置模块
const url = require('node:url');

function createWindow() {
  // 创建浏览器窗口
  const mainWindow = new BrowserWindow({
    width: 1200, // 你可以根据应用调整
    height: 800, // 你可以根据应用调整
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // 指定预加载脚本
      nodeIntegration: false, // 出于安全原因，保持为 false
      contextIsolation: true,  // 出于安全原因，保持为 true
      // webSecurity: false, // 在开发中如果遇到跨域加载本地文件问题，可以临时打开，但生产中务必小心
    },
  });

  // process.env.ELECTRON_START_URL 是在与 Vite 开发服务器集成时设置的
  // 否则，加载打包后的 Vue 应用的 index.html
  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '../dist/index.html'), // 指向 Vue 应用构建后的入口文件
    protocol: 'file:',
    slashes: true,
  });

  console.log(`[Electron main.js] Loading URL: ${startUrl}`);
  mainWindow.loadURL(startUrl);

  // 如果是开发模式 (通过 ELECTRON_START_URL 判断或 NODE_ENV)，则打开开发者工具
  if (process.env.ELECTRON_START_URL || process.env.NODE_ENV !== 'production') {
    mainWindow.webContents.openDevTools();
  }
}

// Electron 应用就绪后创建窗口
app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    // 在 macOS 上，当点击 dock 图标并且没有其他窗口打开时，
    // 通常会重新创建一个窗口。
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// 当所有窗口关闭时退出应用 (Windows & Linux)
app.on('window-all-closed', function () {
  // 在 macOS 上，应用和它们的菜单栏通常保持活动状态直到用户通过 Cmd+Q 显式退出
  if (process.platform !== 'darwin') app.quit();
});

// 你可以在这个文件中处理其他 Electron 主进程事件，如创建原生菜单、快捷键等