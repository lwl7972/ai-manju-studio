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
