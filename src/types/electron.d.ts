import { UpdateInfo } from './index'

export interface ElectronAPI {
  // 应用版本
  version?: string
  
  // Coze API
  executeWorkflow: (params: { workflowId: string; parameters: Record<string, any>; token: string; isAsync?: boolean }) => Promise<any>
  queryAsyncResult: (params: { executeId: string; token: string }) => Promise<any>
  
  // 自动更新
  checkForUpdates: () => Promise<any>
  quitAndInstall: () => void
  
  // 更新事件
  onUpdateChecking: (callback: () => void) => void
  onUpdateAvailable: (callback: (info: UpdateInfo) => void) => void
  onUpdateNotAvailable: (callback: () => void) => void
  onUpdateDownloaded: (callback: (info: UpdateInfo) => void) => void
  onUpdateError: (callback: (error: string) => void) => void
  onUpdateLog: (callback: (info: { type: string; message: string }) => void) => void
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI
  }
}
