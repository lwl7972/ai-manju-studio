import { UpdateInfo } from './index'

export interface ElectronAPI {
  // 应用信息
  version: string

  // Coze API
  executeWorkflow: (params: {
    workflowId: string
    parameters: Record<string, any>
    token: string
    isAsync?: boolean
  }) => Promise<CozeWorkflowResponse>
  queryAsyncResult: (params: {
    executeId: string
    token: string
  }) => Promise<any>

  // 导出功能
  exportProject: (params: { projectId: string; data: any }) => Promise<ExportResponse>
  exportScript: (params: { projectId: string; episodeNumber: number; content: string }) => Promise<ExportResponse>
  exportStoryboards: (params: { projectId: string; data: any[] }) => Promise<ExportResponse>
  exportAssets: (params: { projectId: string; data: any }) => Promise<ExportResponse>

  // 自动更新
  checkForUpdates: () => Promise<any>
  quitAndInstall: () => void
  onUpdateChecking: (callback: () => void) => void
  onUpdateAvailable: (callback: (info: any) => void) => void
  onUpdateNotAvailable: (callback: () => void) => void
  onUpdateDownloaded: (callback: (info: any) => void) => void
  onUpdateError: (callback: (error: string) => void) => void
  onUpdateLog: (callback: (info: { type: string; message: string }) => void) => void
}

export interface CozeWorkflowResponse {
  code: number
  msg: string
  data: any
}

export interface ExportResponse {
  success: boolean
  path?: string
  paths?: string[]
  error?: string
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI
  }
}
