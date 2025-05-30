// electron/preload.js
const { contextBridge, ipcRenderer } = require('electron');

// 向渲染进程暴露一个名为 'electronRuntime' 的全局 API
contextBridge.exposeInMainWorld('electronRuntime', {
  isElectron: true,
  // 你可以在这里安全地暴露更多主进程的功能给渲染进程
  // 例如，通过 ipcRenderer 与主进程通信:
  // send: (channel, data) => ipcRenderer.send(channel, data),
  // receive: (channel, func) => {
  //   // 确保只暴露安全的 ipc 通道
  //   const validChannels = ['from-main']; // 定义允许的通道列表
  //   if (validChannels.includes(channel)) {
  //     ipcRenderer.on(channel, (event, ...args) => func(...args));
  //   }
  // },
  // invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args)
});

console.log('[Electron preload.js] Preload script executed, electronRuntime exposed.');