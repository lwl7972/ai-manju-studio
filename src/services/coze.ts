import type { CozeWorkflowResponse } from '@/types'
import { DEFAULT_MODEL_PRESETS } from '@/types/models'

interface ModelExecutionContext {
  workflowId: string
  parameters: Record<string, any>
  modelConfig?: any
}

export class CozeService {
  private token: string = ''
  private modelConfigs: Record<string, string> = {}

  setToken(token: string) {
    this.token = token
  }

  getToken(): string {
    return this.token
  }

  setModelConfigs(configs: Record<string, string>) {
    this.modelConfigs = configs
  }

  async executeWorkflow(
    workflowId: string,
    parameters: Record<string, any>,
    isAsync: boolean = false
  ): Promise<CozeWorkflowResponse> {
    if (window.electronAPI && this.isElectron()) {
      return await window.electronAPI.executeWorkflow({
        workflowId,
        parameters,
        token: this.token,
        isAsync,
      })
    }

    return this.executeWeb(workflowId, parameters, isAsync)
  }

  private async executeWeb(
    workflowId: string,
    parameters: Record<string, any>,
    isAsync: boolean
  ): Promise<CozeWorkflowResponse> {
    const response = await fetch('https://api.coze.cn/v1/workflow/run', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        workflow_id: workflowId,
        parameters,
        is_async: isAsync,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Coze API error: ${response.status} - ${error}`)
    }

    return await response.json()
  }

  async queryAsyncResult(executeId: string): Promise<any> {
    if (window.electronAPI && this.isElectron()) {
      return await window.electronAPI.queryAsyncResult({
        executeId,
        token: this.token,
      })
    }

    const response = await fetch(`https://api.coze.cn/v1/workflow/async_result?execute_id=${executeId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Coze API error: ${response.status} - ${error}`)
    }

    return await response.json()
  }

  private isElectron(): boolean {
    return typeof window !== 'undefined' && typeof window.electronAPI !== 'undefined'
  }

  async executeStage(
    stageId: string,
    input: Record<string, any>
  ): Promise<any> {
    const selectedModels = this.loadSelectedModels()
    const modelId = selectedModels[stageId] || this.getDefaultModelForStage(stageId)
    const modelPreset = DEFAULT_MODEL_PRESETS.find(p => p.id === modelId)
    const workflowId = modelPreset?.workflowId || `workflow_${stageId}`
    const defaultParams = modelPreset?.defaultParameters || {}

    const mergedParams = {
      ...defaultParams,
      ...input,
    }

    if (!this.token || localStorage.getItem('use_mock') === 'true') {
      return this.generateMockOutput(stageId, input)
    }

    try {
      const result = await this.executeWorkflow(workflowId, mergedParams, true)
      
      if (result.code === 0) {
        return {
          success: true,
          data: result.data,
          modelName: modelPreset?.name || '自定义模型',
          workflowId,
        }
      } else {
        throw new Error(result.msg)
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        modelName: modelPreset?.name || '自定义模型',
      }
    }
  }

  private loadSelectedModels(): Record<string, string> {
    const saved = localStorage.getItem('selected_models')
    return saved ? JSON.parse(saved) : {}
  }

  private getDefaultModelForStage(stageId: string): string {
    const mapping: Record<string, string> = {
      script: 'preset_script_1',
      character: 'preset_script_1',
      image: 'preset_image_1',
      video: 'preset_video_1',
      audio: 'preset_audio_1',
    }
    return mapping[stageId] || 'preset_script_1'
  }

  generateMockOutput(stageId: string, input: Record<string, any>): Record<string, any> {
    const mockOutputs: Record<string, Record<string, any>> = {
      script: {
        script: `【场景 1】${input.title || '开场'}\n\n旁白：这是一个关于梦想与坚持的故事...\n\n${input.character || '主角'}：我一定会成功的！`,
        scenes: [
          { scene: 1, location: '城市街道 - 日', description: '主角走在繁华的街道上' },
          { scene: 2, location: '咖啡厅 - 内', description: '与重要人物会面' },
        ],
      },
      character: {
        characterDesign: '身穿现代服装的年轻创业者，眼神坚定，黑色短发，身高 175cm',
        prompt: 'A young entrepreneur in modern clothing, determined expression, digital art style, detailed character design, anime style',
        appearance: {
          height: '175cm',
          hair: '黑色短发',
          eyes: '深棕色',
          style: '现代休闲',
        },
      },
      image: {
        imageUrl: 'https://via.placeholder.com/1024x1024?text=AI+Generated+Image',
        prompt: input.prompt || 'Default prompt for image generation',
        metadata: {
          width: 1024,
          height: 1024,
          style: 'anime',
        },
      },
      video: {
        videoUrl: 'https://via.placeholder.com/video.mp4',
        thumbnail: 'https://via.placeholder.com/1920x1080?text=Video+Thumbnail',
        duration: 15,
        fps: 24,
        resolution: '1080p',
      },
      audio: {
        audioUrl: 'https://via.placeholder.com/audio.mp3',
        waveform: 'https://via.placeholder.com/800x100?text=Waveform',
        duration: 30,
        voice: 'female_warm',
      },
    }

    return mockOutputs[stageId] || { result: 'Mock output' }
  }
}

export const cozeService = new CozeService()
