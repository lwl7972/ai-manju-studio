export interface ModelConfig {
  id: string
  name: string
  type: 'text' | 'image' | 'video' | 'audio'
  provider: 'coze' | 'custom'
  workflowId?: string
  endpoint?: string
  parameters: Record<string, any>
  isPreset?: boolean
  description?: string
}

export interface StageModelMapping {
  stageId: string
  modelConfigId: string
  isActive: boolean
}

export interface ModelPreset {
  id: string
  name: string
  type: 'text' | 'image' | 'video' | 'audio'
  description: string
  provider: 'coze'
  workflowId: string
  defaultParameters: Record<string, any>
  tags: string[]
}

export const DEFAULT_MODEL_PRESETS: ModelPreset[] = [
  // ===== 大语言模型 (Text) =====
  {
    id: 'llm_glm4_flash',
    name: 'GLM-4-Flash',
    type: 'text',
    description: '免费模型，适合基础文本生成任务',
    provider: 'coze',
    workflowId: '7480139536947929098',
    defaultParameters: {
      max_tokens: 4096,
      temperature: 0.7,
    },
    tags: ['免费', '在用'],
  },
  {
    id: 'llm_glm4_plus',
    name: 'GLM-4-Plus',
    type: 'text',
    description: '高性能模型，0.05 元/千 tokens',
    provider: 'coze',
    workflowId: '7480139536947929099',
    defaultParameters: {
      max_tokens: 8192,
      temperature: 0.7,
    },
    tags: ['付费', '高性能'],
  },
  {
    id: 'llm_glm4_air',
    name: 'GLM-4-Air',
    type: 'text',
    description: '经济型模型，0.001 元/千 tokens',
    provider: 'coze',
    workflowId: '7480139536947929100',
    defaultParameters: {
      max_tokens: 4096,
      temperature: 0.7,
    },
    tags: ['付费', '经济'],
  },
  {
    id: 'llm_gpt4o',
    name: 'GPT-4o',
    type: 'text',
    description: 'OpenAI 旗舰模型，0.005 美元/千 tokens',
    provider: 'coze',
    workflowId: '7480139536947929101',
    defaultParameters: {
      max_tokens: 8192,
      temperature: 0.7,
    },
    tags: ['付费', '旗舰'],
  },
  {
    id: 'llm_gpt4o_mini',
    name: 'GPT-4o Mini',
    type: 'text',
    description: 'OpenAI 轻量模型，0.0006 美元/千 tokens',
    provider: 'coze',
    workflowId: '7480139536947929102',
    defaultParameters: {
      max_tokens: 4096,
      temperature: 0.7,
    },
    tags: ['付费', '轻量'],
  },
  {
    id: 'llm_o3_mini',
    name: 'o3-mini',
    type: 'text',
    description: 'OpenAI 推理模型，0.003 美元/千 tokens',
    provider: 'coze',
    workflowId: '7480139536947929103',
    defaultParameters: {
      max_tokens: 8192,
      temperature: 0.7,
    },
    tags: ['付费', '推理'],
  },
  {
    id: 'llm_o1',
    name: 'o1',
    type: 'text',
    description: 'OpenAI 最强推理模型，0.03 美元/千 tokens',
    provider: 'coze',
    workflowId: '7480139536947929104',
    defaultParameters: {
      max_tokens: 16384,
      temperature: 0.7,
    },
    tags: ['付费', '最强推理'],
  },
  {
    id: 'llm_deepseek_v3',
    name: 'DeepSeek-V3',
    type: 'text',
    description: '深度求索主力模型，0.002 元/千 tokens',
    provider: 'coze',
    workflowId: '7480139536947929105',
    defaultParameters: {
      max_tokens: 8192,
      temperature: 0.7,
    },
    tags: ['付费', '国产'],
  },
  {
    id: 'llm_deepseek_r1',
    name: 'DeepSeek-R1',
    type: 'text',
    description: '深度求索推理模型，0.004 元/千 tokens',
    provider: 'coze',
    workflowId: '7480139536947929106',
    defaultParameters: {
      max_tokens: 8192,
      temperature: 0.7,
    },
    tags: ['付费', '推理'],
  },
  {
    id: 'llm_deepseek_v4_pro',
    name: 'DeepSeek-V4-Pro',
    type: 'text',
    description: '深度求索旗舰模型，0.005 元/千 tokens',
    provider: 'coze',
    workflowId: '7480139536947929107',
    defaultParameters: {
      max_tokens: 16384,
      temperature: 0.7,
    },
    tags: ['付费', '旗舰'],
  },
  {
    id: 'llm_deepseek_v4_flash',
    name: 'DeepSeek-V4-Flash',
    type: 'text',
    description: '深度求索轻量模型，0.001 元/千 tokens',
    provider: 'coze',
    workflowId: '7480139536947929108',
    defaultParameters: {
      max_tokens: 4096,
      temperature: 0.7,
    },
    tags: ['付费', '在用', '轻量'],
  },
  {
    id: 'llm_claude35_sonnet',
    name: 'Claude 3.5 Sonnet',
    type: 'text',
    description: 'Anthropic 主力模型，0.003 美元/千 tokens',
    provider: 'coze',
    workflowId: '7480139536947929109',
    defaultParameters: {
      max_tokens: 8192,
      temperature: 0.7,
    },
    tags: ['付费', '旗舰'],
  },
  {
    id: 'llm_claude3_opus',
    name: 'Claude 3 Opus',
    type: 'text',
    description: 'Anthropic 最强模型，0.015 美元/千 tokens',
    provider: 'coze',
    workflowId: '7480139536947929110',
    defaultParameters: {
      max_tokens: 16384,
      temperature: 0.7,
    },
    tags: ['付费', '最强'],
  },
  {
    id: 'llm_claude3_haiku',
    name: 'Claude 3 Haiku',
    type: 'text',
    description: 'Anthropic 轻量模型，0.00025 美元/千 tokens',
    provider: 'coze',
    workflowId: '7480139536947929111',
    defaultParameters: {
      max_tokens: 4096,
      temperature: 0.7,
    },
    tags: ['付费', '轻量'],
  },
  {
    id: 'llm_kimi_k1_8k',
    name: 'Kimi K1-8K',
    type: 'text',
    description: '月之暗面模型，0.006 元/千 tokens',
    provider: 'coze',
    workflowId: '7480139536947929112',
    defaultParameters: {
      max_tokens: 8192,
      temperature: 0.7,
    },
    tags: ['付费', '国产'],
  },
  
  // ===== TTS 语音合成模型 (Audio) =====
  {
    id: 'tts_cosyvoice2',
    name: 'CosyVoice 2',
    type: 'audio',
    description: '阿里语音合成，0.015 元/千字符',
    provider: 'coze',
    workflowId: '7480139536947929201',
    defaultParameters: {
      voice: 'female_warm',
      speed: 1.0,
      pitch: 1.0,
    },
    tags: ['付费', '在用', '高质量'],
  },
  {
    id: 'tts_cosyvoice1',
    name: 'CosyVoice 1',
    type: 'audio',
    description: '阿里语音合成，0.012 元/千字符',
    provider: 'coze',
    workflowId: '7480139536947929202',
    defaultParameters: {
      voice: 'female_warm',
      speed: 1.0,
    },
    tags: ['付费', '经济'],
  },
  {
    id: 'tts_doubao',
    name: '豆包 TTS',
    type: 'audio',
    description: '字节语音合成，0.008 元/千字符',
    provider: 'coze',
    workflowId: '7480139536947929203',
    defaultParameters: {
      voice: 'neutral',
      speed: 1.0,
    },
    tags: ['付费', '经济'],
  },
  {
    id: 'tts_zhipu',
    name: '智谱语音合成',
    type: 'audio',
    description: '智谱 AI 语音合成，按量计费',
    provider: 'coze',
    workflowId: '7480139536947929204',
    defaultParameters: {
      voice: 'neutral',
      speed: 1.0,
    },
    tags: ['付费', '国产'],
  },
  {
    id: 'tts_azure_standard',
    name: 'Azure TTS 标准版',
    type: 'audio',
    description: '微软 Azure 语音合成标准版，3.6 元/千字符',
    provider: 'coze',
    workflowId: '7480139536947929205',
    defaultParameters: {
      voice: 'zh-CN-XiaoxiaoNeural',
      speed: 1.0,
    },
    tags: ['付费', '国际'],
  },
  {
    id: 'tts_azure_neural',
    name: 'Azure TTS 神经版',
    type: 'audio',
    description: '微软 Azure 语音合成神经版，14.4 元/千字符',
    provider: 'coze',
    workflowId: '7480139536947929206',
    defaultParameters: {
      voice: 'zh-CN-XiaoxiaoNeural',
      speed: 1.0,
      emotion: 'neutral',
    },
    tags: ['付费', '高质量'],
  },
  {
    id: 'tts_iflytek',
    name: '讯飞语音合成',
    type: 'audio',
    description: '科大讯飞语音合成，20 元/万字',
    provider: 'coze',
    workflowId: '7480139536947929207',
    defaultParameters: {
      voice: 'xiaoyan',
      speed: 1.0,
    },
    tags: ['付费', '国产'],
  },
  
  // ===== 生图模型 (Image) =====
  {
    id: 'image_coze',
    name: 'Coze 生图工具',
    type: 'image',
    description: '扣子官方生图工具，跟随 Coze 计费',
    provider: 'coze',
    workflowId: '7480139536947929301',
    defaultParameters: {
      width: 1024,
      height: 1024,
      style: 'anime',
    },
    tags: ['官方', '在用'],
  },
  {
    id: 'image_seedream5',
    name: 'Doubao-Seedream-5',
    type: 'image',
    description: '豆包生图模型，0.25 元/张',
    provider: 'coze',
    workflowId: '7480139536947929302',
    defaultParameters: {
      width: 1024,
      height: 1024,
      style: 'anime',
    },
    tags: ['付费', '高质量'],
  },
  {
    id: 'image_doubao_v2',
    name: '豆包图像 V2',
    type: 'image',
    description: '豆包生图 V2，0.08~0.15 元/张',
    provider: 'coze',
    workflowId: '7480139536947929303',
    defaultParameters: {
      width: 1024,
      height: 1024,
      style: 'realistic',
    },
    tags: ['付费', '经济'],
  },
  {
    id: 'image_doubao_v1',
    name: '豆包图像 V1',
    type: 'image',
    description: '豆包生图 V1，0.05~0.1 元/张',
    provider: 'coze',
    workflowId: '7480139536947929304',
    defaultParameters: {
      width: 512,
      height: 512,
      style: 'realistic',
    },
    tags: ['付费', '入门'],
  },
  {
    id: 'image_jimeng_v2',
    name: '即梦 V2.0',
    type: 'image',
    description: '即梦生图 V2，0.1~0.3 元/张',
    provider: 'coze',
    workflowId: '7480139536947929305',
    defaultParameters: {
      width: 1024,
      height: 1024,
      style: 'anime',
    },
    tags: ['付费', '高质量'],
  },
  {
    id: 'image_jimeng_v1',
    name: '即梦 V1.0',
    type: 'image',
    description: '即梦生图 V1，0.05~0.15 元/张',
    provider: 'coze',
    workflowId: '7480139536947929306',
    defaultParameters: {
      width: 512,
      height: 512,
      style: 'anime',
    },
    tags: ['付费', '经济'],
  },
  {
    id: 'image_keling',
    name: '可灵 1.0',
    type: 'image',
    description: '快手可灵生图，0.1~0.2 元/张',
    provider: 'coze',
    workflowId: '7480139536947929307',
    defaultParameters: {
      width: 1024,
      height: 1024,
      style: 'realistic',
    },
    tags: ['付费', '国产'],
  },
  {
    id: 'image_wenxin',
    name: '文心一格',
    type: 'image',
    description: '百度文心一格，0.1~0.2 元/张',
    provider: 'coze',
    workflowId: '7480139536947929308',
    defaultParameters: {
      width: 1024,
      height: 1024,
      style: 'chinese',
    },
    tags: ['付费', '国产'],
  },
  {
    id: 'image_tongyi',
    name: '通义万相',
    type: 'image',
    description: '阿里通义万相，0.08~0.15 元/张',
    provider: 'coze',
    workflowId: '7480139536947929309',
    defaultParameters: {
      width: 1024,
      height: 1024,
      style: 'chinese',
    },
    tags: ['付费', '国产'],
  },
  {
    id: 'image_cogview3',
    name: 'CogView-3',
    type: 'image',
    description: '清华 CogView-3，0.05~0.1 元/张',
    provider: 'coze',
    workflowId: '7480139536947929310',
    defaultParameters: {
      width: 1024,
      height: 1024,
      style: 'anime',
    },
    tags: ['付费', '国产'],
  },
  
  // ===== AI 视频生成模型 (Video) =====
  {
    id: 'video_coze',
    name: 'Coze 视频工具',
    type: 'video',
    description: '扣子官方视频工具，跟随 Coze 计费',
    provider: 'coze',
    workflowId: '7480139536947929401',
    defaultParameters: {
      duration: 5,
      fps: 24,
      resolution: '720p',
    },
    tags: ['官方', '在用'],
  },
  {
    id: 'video_seedance2',
    name: 'Doubao-Seedance-2',
    type: 'video',
    description: '豆包视频生成，720P 40 积分/5 秒',
    provider: 'coze',
    workflowId: '7480139536947929402',
    defaultParameters: {
      duration: 5,
      fps: 24,
      resolution: '720p',
    },
    tags: ['付费', '经济'],
  },
  {
    id: 'video_seedance2_pro',
    name: 'Doubao-Seedance-2.0',
    type: 'video',
    description: '豆包视频增强版，720P 50 积分/5s、1080P 125 积分/5s',
    provider: 'coze',
    workflowId: '7480139536947929403',
    defaultParameters: {
      duration: 5,
      fps: 30,
      resolution: '1080p',
    },
    tags: ['付费', '高质量'],
  },
  {
    id: 'video_seedance15_pro',
    name: 'Doubao-Seedance-1.5-pro',
    type: 'video',
    description: '豆包视频专业版，按量计费',
    provider: 'coze',
    workflowId: '7480139536947929404',
    defaultParameters: {
      duration: 10,
      fps: 30,
      resolution: '1080p',
    },
    tags: ['付费', '专业'],
  },
  {
    id: 'video_seedance1_pro',
    name: 'Doubao-Seedance-1.0-pro',
    type: 'video',
    description: '豆包视频基础专业版，按量计费',
    provider: 'coze',
    workflowId: '7480139536947929405',
    defaultParameters: {
      duration: 10,
      fps: 24,
      resolution: '720p',
    },
    tags: ['付费', '专业'],
  },
  {
    id: 'video_keling_v3_omni',
    name: '可灵 V3-Omni',
    type: 'video',
    description: '快手可灵全能版，720P 0.675 元/秒、1080P 0.9 元/秒',
    provider: 'coze',
    workflowId: '7480139536947929406',
    defaultParameters: {
      duration: 5,
      fps: 30,
      resolution: '1080p',
    },
    tags: ['付费', '全能'],
  },
  {
    id: 'video_keling_v3',
    name: '可灵 V3',
    type: 'video',
    description: '快手可灵 V3，720P 0.675 元/秒、1080P 0.9 元/秒',
    provider: 'coze',
    workflowId: '7480139536947929407',
    defaultParameters: {
      duration: 5,
      fps: 30,
      resolution: '1080p',
    },
    tags: ['付费', '国产'],
  },
]

export const STAGE_MODEL_MAPPING: Record<string, string[]> = {
  llm: [
    'llm_glm4_flash',
    'llm_glm4_plus',
    'llm_glm4_air',
    'llm_gpt4o',
    'llm_gpt4o_mini',
    'llm_o3_mini',
    'llm_o1',
    'llm_deepseek_v3',
    'llm_deepseek_r1',
    'llm_deepseek_v4_pro',
    'llm_deepseek_v4_flash',
    'llm_claude35_sonnet',
    'llm_claude3_opus',
    'llm_claude3_haiku',
    'llm_kimi_k1_8k',
  ],
  tts: [
    'tts_cosyvoice2',
    'tts_cosyvoice1',
    'tts_doubao',
    'tts_zhipu',
    'tts_azure_standard',
    'tts_azure_neural',
    'tts_iflytek',
  ],
  image: [
    'image_coze',
    'image_seedream5',
    'image_doubao_v2',
    'image_doubao_v1',
    'image_jimeng_v2',
    'image_jimeng_v1',
    'image_keling',
    'image_wenxin',
    'image_tongyi',
    'image_cogview3',
  ],
  video: [
    'video_coze',
    'video_seedance2',
    'video_seedance2_pro',
    'video_seedance15_pro',
    'video_seedance1_pro',
    'video_keling_v3_omni',
    'video_keling_v3',
  ],
}
