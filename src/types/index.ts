export interface WorkflowConfig {
  id: string
  name: string
  description?: string
  parameters?: Record<string, any>
}

export interface StageConfig {
  id: string
  name: string
  workflowId: string
  inputTemplate: Record<string, any>
  outputMapping?: Record<string, string>
  order: number
}

export interface ProjectData {
  id: string
  name: string
  description?: string
  novel?: string
  script?: string
  characters?: CharacterConfig[]
  stages: StageConfig[]
  createdAt: string
  updatedAt: string
}

export interface CharacterConfig {
  id: string
  name: string
  description: string
  imageUrl?: string
  consistencyPrompt?: string
}

export interface TaskExecution {
  id: string
  stageId: string
  projectId: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  input: Record<string, any>
  output?: Record<string, any>
  error?: string
  executeId?: string
  createdAt: string
  completedAt?: string
}

export interface CozeWorkflowResponse {
  code: number
  msg: string
  data: {
    execute_id?: string
    output?: string
    debug_url?: string
    [key: string]: any
  }
}

export interface UpdateInfo {
  version: string
  releaseDate?: string
  releaseNotes?: string
}

export interface ElectronAPI {
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
  onUpdateError: (callback: (error: Error) => void) => void
  onUpdateLog: (callback: (info: { type: string; message: string }) => void) => void
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI
  }
}
