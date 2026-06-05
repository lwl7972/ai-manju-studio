/// <reference types="vite/client" />

interface ElectronAPI {
  executeWorkflow: (params: {
    workflowId: string
    parameters: Record<string, any>
    token: string
    isAsync?: boolean
  }) => Promise<any>
  queryAsyncResult: (params: {
    executeId: string
    token: string
  }) => Promise<any>
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI
  }
}

export {}
