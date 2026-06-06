// 提示词模板文件类型定义

export type PromptTemplateType =
  | 'system-prompt'
  | 'character-extract'
  | 'scene-extract'
  | 'asset-generate'
  | 'storyboard-suffix'
  | 'outline-generate'

export interface PromptTemplate {
  type: PromptTemplateType
  name: string
  description: string
  content: string
  // 变量列表，从内容中解析或手动定义
  variables: string[]
  // 是否系统默认模板
  isDefault: boolean
  // 创建和更新时间
  createdAt: string
  updatedAt: string
}

// 六类模板定义
export const PROMPT_TEMPLATE_TYPES: {
  type: PromptTemplateType
  name: string
  description: string
}[] = [
  {
    type: 'system-prompt',
    name: '系统提示词',
    description: '用于分镜生成、剧情生成等通用 AI 任务',
  },
  {
    type: 'character-extract',
    name: '角色提取',
    description: 'AI 提取资产时用于提取角色信息',
  },
  {
    type: 'scene-extract',
    name: '场景提取',
    description: 'AI 提取资产时用于提取场景信息',
  },
  {
    type: 'asset-generate',
    name: '资产生成',
    description: '批量生成角色/场景图片的提示词',
  },
  {
    type: 'storyboard-suffix',
    name: '分镜后缀',
    description: '分镜生成的补充要求和约束',
  },
  {
    type: 'outline-generate',
    name: '大纲生成',
    description: '根据剧本基本信息生成剧情大纲',
  },
]

// 扩展变量集
export const TEMPLATE_VARIABLES = [
  'style',
  'aspectRatio',
  'quality',
  'projectName',
  'episodeTitle',
  'seconds',
  'platform',
  'character',
  'scene',
  'prop',
  'shotType',
  'cameraMovement',
]
