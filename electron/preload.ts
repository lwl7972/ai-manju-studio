import { contextBridge, ipcRenderer } from 'electron'

// 获取应用版本
const { app } = require('@electron/remote') || { app: { getVersion: () => '0.1.0' } }

contextBridge.exposeInMainWorld('electronAPI', {
  // 应用版本
  version: app ? app.getVersion() : '0.1.0',
  
  // Coze API
  executeWorkflow: (params: { workflowId: string; parameters: Record<string, any>; token: string; isAsync?: boolean }) =>
    ipcRenderer.invoke('coze:execute-workflow', params),
  queryAsyncResult: (params: { executeId: string; token: string }) =>
    ipcRenderer.invoke('coze:query-async-result', params),
  
  // 自动更新
  checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
  quitAndInstall: () => ipcRenderer.invoke('quit-and-install'),
  
  // 导出功能
  exportProject: (params: { projectId: string; data: any }) =>
    ipcRenderer.invoke('export:project', params),
  exportScript: (params: { projectId: string; episodeNumber: number; content: string }) =>
    ipcRenderer.invoke('export:script', params),
  exportStoryboards: (params: { projectId: string; data: any[] }) =>
    ipcRenderer.invoke('export:storyboards', params),
  exportAssets: (params: { projectId: string; data: any }) =>
    ipcRenderer.invoke('export:assets', params),
  
  // 更新事件监听
  onUpdateChecking: (callback: () => void) => {
    ipcRenderer.on('update-checking', callback)
  },
  onUpdateAvailable: (callback: (info: any) => void) => {
    ipcRenderer.on('update-available', (_, info) => callback(info))
  },
  onUpdateNotAvailable: (callback: () => void) => {
    ipcRenderer.on('update-not-available', callback)
  },
  onUpdateDownloaded: (callback: (info: any) => void) => {
    ipcRenderer.on('update-downloaded', (_, info) => callback(info))
  },
  onUpdateError: (callback: (error: string) => void) => {
    ipcRenderer.on('update-error', (_, error) => callback(error))
  },
  
  // 注意：onUpdateLog 在 Electron 主进程中未实现，暂时留空
  onUpdateLog: (callback: (info: { type: string; message: string }) => void) => {
    // 空实现，等待主进程添加对应事件
  },
})
