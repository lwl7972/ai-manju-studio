import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  executeWorkflow: (params: { workflowId: string; parameters: Record<string, any>; token: string; isAsync?: boolean }) =>
    ipcRenderer.invoke('coze:execute-workflow', params),
  queryAsyncResult: (params: { executeId: string; token: string }) =>
    ipcRenderer.invoke('coze:query-async-result', params),
})
