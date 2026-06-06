import type { CozeWorkflowResponse } from '@/types'

// ===== 模型调用接口定义 =====

export interface AIModel {
  id: string
  name: string
  type: 'text' | 'image' | 'video' | 'audio'
  provider: 'coze' | 'zhipu' | 'openai' | 'anthropic' | 'moonshot' | 'aliyun' | 'tencent' | 'baidu' | 'microsoft'
  apiKey?: string
  endpoint?: string
  modelId?: string // 第三方模型的实际模型 ID
  workflowId?: string // Coze 工作流 ID
  parameters: Record<string, any>
  pricing?: string
}

export interface TextGenerationResponse {
  content: string
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export interface ImageGenerationResponse {
  imageUrl: string
  prompt: string
  width: number
  height: number
  model: string
}

export interface VideoGenerationResponse {
  videoUrl: string
  thumbnail?: string
  duration: number
  resolution: string
  model: string
}

export interface AudioGenerationResponse {
  audioUrl: string
  waveform?: string
  duration: number
  voice: string
  model: string
}

type GenerationResponse = TextGenerationResponse | ImageGenerationResponse | VideoGenerationResponse | AudioGenerationResponse

// ===== 模型路由配置 =====

export const MODEL_ROUTE_MAP: Record<string, { endpoint: string; modelId: string; provider: string; workflowId?: string }> = {
  // GLM 系列 (智谱 AI)
  'llm_glm4_flash': { endpoint: 'https://open.bigmodel.cn/api/paas/v4/chat/completions', modelId: 'glm-4-flash', provider: 'zhipu' },
  'llm_glm4_plus': { endpoint: 'https://open.bigmodel.cn/api/paas/v4/chat/completions', modelId: 'glm-4-plus', provider: 'zhipu' },
  'llm_glm4_air': { endpoint: 'https://open.bigmodel.cn/api/paas/v4/chat/completions', modelId: 'glm-4-air', provider: 'zhipu' },
  
  // GPT 系列 (OpenAI)
  'llm_gpt4o': { endpoint: 'https://api.openai.com/v1/chat/completions', modelId: 'gpt-4o', provider: 'openai' },
  'llm_gpt4o_mini': { endpoint: 'https://api.openai.com/v1/chat/completions', modelId: 'gpt-4o-mini', provider: 'openai' },
  'llm_o3_mini': { endpoint: 'https://api.openai.com/v1/chat/completions', modelId: 'o3-mini', provider: 'openai' },
  'llm_o1': { endpoint: 'https://api.openai.com/v1/chat/completions', modelId: 'o1', provider: 'openai' },
  
  // DeepSeek 系列
  'llm_deepseek_v3': { endpoint: 'https://api.deepseek.com/v1/chat/completions', modelId: 'deepseek-chat', provider: 'deepseek' },
  'llm_deepseek_r1': { endpoint: 'https://api.deepseek.com/v1/chat/completions', modelId: 'deepseek-reasoner', provider: 'deepseek' },
  'llm_deepseek_v4_pro': { endpoint: 'https://api.deepseek.com/v1/chat/completions', modelId: 'deepseek-v4-pro', provider: 'deepseek' },
  'llm_deepseek_v4_flash': { endpoint: 'https://api.deepseek.com/v1/chat/completions', modelId: 'deepseek-v4-flash', provider: 'deepseek' },
  
  // Claude 系列 (Anthropic)
  'llm_claude35_sonnet': { endpoint: 'https://api.anthropic.com/v1/messages', modelId: 'claude-3-5-sonnet-20241022', provider: 'anthropic' },
  'llm_claude3_opus': { endpoint: 'https://api.anthropic.com/v1/messages', modelId: 'claude-3-opus-20240229', provider: 'anthropic' },
  'llm_claude3_haiku': { endpoint: 'https://api.anthropic.com/v1/messages', modelId: 'claude-3-haiku-20240307', provider: 'anthropic' },
  
  // Kimi (月之暗面)
  'llm_kimi_k1_8k': { endpoint: 'https://api.moonshot.cn/v1/chat/completions', modelId: 'kimi-k1-8k', provider: 'moonshot' },
  
  // TTS 系列
  'tts_cosyvoice2': { endpoint: 'https://dashscope.aliyuncs.com/api/v1/services/audio/tts', modelId: 'cosyvoice-v2', provider: 'aliyun' },
  'tts_cosyvoice1': { endpoint: 'https://dashscope.aliyuncs.com/api/v1/services/audio/tts', modelId: 'cosyvoice-v1', provider: 'aliyun' },
  'tts_zhipu': { endpoint: 'https://open.bigmodel.cn/api/paas/v1/audio/speech', modelId: 'zhipu-tts', provider: 'zhipu' },
  'tts_azure_standard': { endpoint: 'https://YOUR_REGION.tts.speech.microsoft.com/cognitiveservices/v1', modelId: 'zh-CN-XiaoxiaoNeural', provider: 'microsoft' },
  'tts_azure_neural': { endpoint: 'https://YOUR_REGION.tts.speech.microsoft.com/cognitiveservices/v1', modelId: 'zh-CN-XiaoxiaoNeural', provider: 'microsoft' },
  'tts_iflytek': { endpoint: 'https://api.xf-yun.com/v1/private/tts', modelId: 'xiaoan', provider: 'iflytek' },
  
  // 生图系列
  'image_doubao_v1': { endpoint: 'https://ark.cn-beijing.volcengine.com/api/v1/images/generations', modelId: 'seedream-v1', provider: 'volcengine' },
  'image_doubao_v2': { endpoint: 'https://ark.cn-beijing.volcengine.com/api/v1/images/generations', modelId: 'seedream-v2', provider: 'volcengine' },
  'image_seedream5': { endpoint: 'https://ark.cn-beijing.volcengine.com/api/v1/images/generations', modelId: 'seedream-5', provider: 'volcengine' },
  'image_jimeng_v1': { endpoint: 'https://api.dreamina.capcut.com/v1/images/generations', modelId: 'dreamina-v1', provider: 'bytedance' },
  'image_jimeng_v2': { endpoint: 'https://api.dreamina.capcut.com/v1/images/generations', modelId: 'dreamina-v2', provider: 'bytedance' },
  'image_keling': { endpoint: 'https://api.kuaishou.com/ai/draw/v1/image', modelId: 'keling-v1', provider: 'kuaishou' },
  'image_wenxin': { endpoint: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/text2image', modelId: 'wenxin-v1', provider: 'baidu' },
  'image_tongyi': { endpoint: 'https://dashscope.aliyuncs.com/api/v1/images/generations', modelId: 'wanx-v1', provider: 'aliyun' },
  'image_cogview3': { endpoint: 'https://open.bigmodel.cn/api/paas/v4/images/generations', modelId: 'cogview-3', provider: 'zhipu' },
  
  // 视频生成系列
  'video_seedance2': { endpoint: 'https://ark.cn-beijing.volcengine.com/api/v1/videos/generations', modelId: 'seedance-v2', provider: 'volcengine' },
  'video_seedance2_pro': { endpoint: 'https://ark.cn-beijing.volcengine.com/api/v1/videos/generations', modelId: 'seedance-v2-pro', provider: 'volcengine' },
  'video_seedance15_pro': { endpoint: 'https://ark.cn-beijing.volcengine.com/api/v1/videos/generations', modelId: 'seedance-v1.5-pro', provider: 'volcengine' },
  'video_seedance1_pro': { endpoint: 'https://ark.cn-beijing.volcengine.com/api/v1/videos/generations', modelId: 'seedance-v1-pro', provider: 'volcengine' },
  'video_keling_v3': { endpoint: 'https://api.kuaishou.com/ai/video/v1/generate', modelId: 'keling-v3', provider: 'kuaishou' },
  'video_keling_v3_omni': { endpoint: 'https://api.kuaishou.com/ai/video/v1/generate', modelId: 'keling-v3-omni', provider: 'kuaishou' },
  
  // Coze 系列
  'image_coze': { endpoint: 'https://api.coze.cn/v1/workflow/run', modelId: 'coze-image', provider: 'coze', workflowId: '7480139536947929301' },
  'video_coze': { endpoint: 'https://api.coze.cn/v1/workflow/run', modelId: 'coze-video', provider: 'coze', workflowId: '7480139536947929401' },
}

// ===== 模型路由服务 =====

export class AIModelRouter {
  private apiKeys: Record<string, string> = {}
  private cozeToken: string = ''

  setApiKey(provider: string, apiKey: string) {
    this.apiKeys[provider] = apiKey
  }

  setCozeToken(token: string) {
    this.cozeToken = token
  }

  async executeModel(
    modelId: string,
    input: Record<string, any>
  ): Promise<GenerationResponse> {
    // Coze 平台的模型使用 Coze 接口
    if (modelId.includes('coze') || modelId.startsWith('preset_')) {
      return this.executeCozeModel(modelId, input)
    }

    // 第三方模型使用各自的 API
    const routeConfig = MODEL_ROUTE_MAP[modelId]
    if (!routeConfig) {
      throw new Error(`未知模型 ID: ${modelId}`)
    }

    const apiKey = this.apiKeys[routeConfig.provider]
    if (!apiKey) {
      throw new Error(`${routeConfig.provider} 的 API Key 未设置`)
    }

    try {
      const response = await fetch(routeConfig.endpoint, {
        method: 'POST',
        headers: this.getHeaders(routeConfig.provider, apiKey),
        body: JSON.stringify(this.formatRequestBody(routeConfig.provider, routeConfig.modelId, input)),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`${routeConfig.provider} API error: ${response.status} - ${error}`)
      }

      return this.parseResponse(routeConfig.provider, await response.json(), modelId)
    } catch (error: any) {
      throw new Error(`调用 ${routeConfig.provider} 失败：${error.message}`)
    }
  }

  private async executeCozeModel(
    modelId: string,
    input: Record<string, any>
  ): Promise<GenerationResponse> {
    // Coze 模型统一使用 Coze 接口
    const routeConfig = MODEL_ROUTE_MAP[modelId]
    
    if (window.electronAPI) {
      const result = await window.electronAPI.executeWorkflow({
        workflowId: routeConfig?.workflowId || '',
        parameters: input,
        token: this.cozeToken,
      })
      // 转换 CozeWorkflowResponse 为 GenerationResponse
      return {
        content: result.data?.output || JSON.stringify(result.data),
        model: modelId,
      } as TextGenerationResponse
    }

    // Web 端调用
    const response = await fetch('https://api.coze.cn/v1/workflow/run', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.cozeToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        workflow_id: routeConfig?.workflowId || modelId,
        parameters: input,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Coze API error: ${response.status} - ${error}`)
    }

    const result: any = await response.json()
    // Coze 返回格式：{ code, msg, data: { output, ... } }
    // 尝试解析 output 字段
    let content = ''
    if (result.data?.output) {
      try {
        // 尝试解析 JSON
        content = JSON.parse(result.data.output)
      } catch {
        content = result.data.output
      }
    } else {
      content = JSON.stringify(result.data || result)
    }
    return {
      content,
      model: modelId,
    } as TextGenerationResponse
  }

  private getHeaders(provider: string, apiKey: string): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    switch (provider) {
      case 'zhipu':
      case 'deepseek':
      case 'moonshot':
        headers['Authorization'] = `Bearer ${apiKey}`
        break
      case 'openai':
        headers['Authorization'] = `Bearer ${apiKey}`
        break
      case 'anthropic':
        headers['x-api-key'] = apiKey
        headers['anthropic-version'] = '2023-06-01'
        break
      case 'aliyun':
        headers['Authorization'] = `Bearer ${apiKey}`
        headers['X-DashScope-WorkSpace'] = 'default'
        break
      case 'microsoft':
        headers['Ocp-Apim-Subscription-Key'] = apiKey
        break
      case 'iflytek':
      case 'baidu':
      case 'volcengine':
      case 'bytedance':
      case 'kuaishou':
        headers['Authorization'] = `Bearer ${apiKey}`
        break
      default:
        headers['Authorization'] = `Bearer ${apiKey}`
    }

    return headers
  }

  private formatRequestBody(provider: string, modelId: string, input: Record<string, any>): Record<string, any> {
    // 文本生成模型
    if (input.prompt || input.messages) {
      switch (provider) {
        case 'anthropic':
          return {
            model: modelId,
            max_tokens: input.max_tokens || 2048,
            messages: [{ role: 'user', content: input.prompt || input.messages }],
          }
        case 'openai':
        case 'zhipu':
        case 'deepseek':
        case 'moonshot':
          return {
            model: modelId,
            messages: [{ role: 'user', content: input.prompt || input.messages }],
            temperature: input.temperature || 0.7,
            max_tokens: input.max_tokens || 2048,
          }
      }
    }

    // 图像生成模型
    if (input.prompt && !input.messages) {
      return {
        model: modelId,
        prompt: input.prompt,
        size: `${input.width || 1024}x${input.height || 1024}`,
        n: 1,
        ...input,
      }
    }

    // 默认返回
    return input
  }

  private parseResponse(provider: string, data: any, modelId: string): GenerationResponse {
    // 文本生成响应
    if (data.choices || data.content || data.message) {
      const content = data.choices?.[0]?.message?.content || data.content || data.message?.content || ''
      const usage = data.usage || {}
      return {
        content,
        usage,
        model: modelId,
      } as TextGenerationResponse
    }

    // 图像生成响应
    if (data.data?.images?.[0] || data.image_url || data.images?.[0]?.url) {
      const imageUrl = data.data?.images?.[0] || data.image_url || data.images?.[0]?.url
      return {
        imageUrl,
        prompt: data.prompt || '',
        width: data.width || 1024,
        height: data.height || 1024,
        model: modelId,
      } as ImageGenerationResponse
    }

    // 默认返回
    return data
  }
}

export const aiModelRouter = new AIModelRouter()
