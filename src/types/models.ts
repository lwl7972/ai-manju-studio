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
  // 文本/剧本类
  {
    id: 'preset_script_1',
    name: '剧本生成专家',
    type: 'text',
    description: '专为小说转剧本优化的工作流，支持分镜描述和对话生成',
    provider: 'coze',
    workflowId: '7366468917055100001',
    defaultParameters: {
      max_tokens: 2000,
      temperature: 0.7,
      output_format: 'screenplay',
    },
    tags: ['官方推荐', '剧本'],
  },
  {
    id: 'preset_script_2',
    name: '创意写作助手',
    type: 'text',
    description: '通用文本生成，适合创意写作和内容扩展',
    provider: 'coze',
    workflowId: '7366468917055100002',
    defaultParameters: {
      max_tokens: 1500,
      temperature: 0.8,
    },
    tags: ['创意', '通用'],
  },
  
  // 图像类
  {
    id: 'preset_image_1',
    name: 'Seedream 4.0',
    type: 'image',
    description: '扣子官方图像生成模型，支持高质量插画和概念图',
    provider: 'coze',
    workflowId: '7366468917055100003',
    defaultParameters: {
      width: 1024,
      height: 1024,
      steps: 30,
      guidance_scale: 7.5,
      style: 'anime',
    },
    tags: ['官方推荐', '插画'],
  },
  {
    id: 'preset_image_2',
    name: '角色一致性生成',
    type: 'image',
    description: '专为保持角色一致性优化的图像生成',
    provider: 'coze',
    workflowId: '7366468917055100004',
    defaultParameters: {
      width: 512,
      height: 768,
      steps: 40,
      reference_strength: 0.8,
    },
    tags: ['角色', '一致性'],
  },
  
  // 视频类
  {
    id: 'preset_video_1',
    name: 'Seedance 1.0',
    type: 'video',
    description: '扣子官方视频生成模型，支持 15 秒连贯视频',
    provider: 'coze',
    workflowId: '7366468917055100005',
    defaultParameters: {
      duration: 15,
      fps: 24,
      resolution: '1080p',
      motion_strength: 0.6,
    },
    tags: ['官方推荐', '视频'],
  },
  {
    id: 'preset_video_2',
    name: '图生视频专家',
    type: 'video',
    description: '从静态图像生成动态视频，支持运镜控制',
    provider: 'coze',
    workflowId: '7366468917055100006',
    defaultParameters: {
      duration: 10,
      fps: 30,
      camera_movement: 'pan_left',
    },
    tags: ['图生视频', '运镜'],
  },
  
  // 音频类
  {
    id: 'preset_audio_1',
    name: '豆包 TTS',
    type: 'audio',
    description: '豆包语音合成，支持多音色多情感',
    provider: 'coze',
    workflowId: '7366468917055100007',
    defaultParameters: {
      voice: 'female_warm',
      speed: 1.0,
      pitch: 1.0,
      emotion: 'neutral',
    },
    tags: ['官方推荐', '配音'],
  },
  {
    id: 'preset_audio_2',
    name: '情景配音专家',
    type: 'audio',
    description: '根据文本情景自动调整语调和情感',
    provider: 'coze',
    workflowId: '7366468917055100008',
    defaultParameters: {
      voice: 'storyteller',
      auto_emotion: true,
      background_music: 'light',
    },
    tags: ['情景', '自动化'],
  },
]

export const STAGE_MODEL_MAPPING: Record<string, string[]> = {
  script: ['preset_script_1', 'preset_script_2'],
  character: ['preset_script_1', 'preset_script_2'],
  image: ['preset_image_1', 'preset_image_2'],
  video: ['preset_video_1', 'preset_video_2'],
  audio: ['preset_audio_1', 'preset_audio_2'],
}
