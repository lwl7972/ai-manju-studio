import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  // Coze API
  executeWorkflow: (params: { workflowId: string; parameters: Record<string, any>; token: string; isAsync?: boolean }) =>
    ipcRenderer.invoke('coze:execute-workflow', params),
  queryAsyncResult: (params: { executeId: string; token: string }) =>
    ipcRenderer.invoke('coze:query-async-result', params),
  
  // 自动更新
  checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
  quitAndInstall: () => ipcRenderer.invoke('quit-and-install'),
  
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
  onUpdateError: (callback: (error: Error) => void) => {
    ipcRenderer.on('update-error', (_, error) => callback(error))
  },
  onUpdateLog: (callback: (info: { type: string; message: string }) => void) => {
    ipcRenderer.on('update-log', (_, info) => callback(info))
  },
})
