// 全局配置
export interface AppConfig {
  // 全局默认参数
  defaultParams: {
    style: string
    aspectRatio: string
    quality: string
    platform: string
    duration: number
  }
  // 输出目录
  outputDirectory: string
  // 提示词模板文件索引
  templateIndex: {
    systemPrompt: string
    characterExtract: string
    sceneExtract: string
    assetGenerate: string
    storyboardSuffix: string
    outlineGenerate: string
  }
  // 当前账号信息
  account: {
    token?: string
    endpoint?: string
    email?: string
  }
  // 界面偏好
  uiPreferences: {
    theme?: 'light' | 'dark'
    fontSize?: 'small' | 'medium' | 'large'
  }
}

// 项目数据
export interface Project {
  id: string
  title: string
  tag?: string
  theme?: string
  description?: string
  // 项目级参数覆盖
  paramsOverride?: {
    style?: string
    aspectRatio?: string
    quality?: string
    platform?: string
    duration?: number
  }
  // 分集结果
  episodes: Episode[]
  // 资产引用
  assets: {
    characters: AssetCharacter[]
    scenes: AssetScene[]
    props: AssetProp[]
  }
  // 导出记录
  exports: ExportRecord[]
  // 创建和更新时间
  createdAt: string
  updatedAt: string
}

// 分集
export interface Episode {
  id: string
  episodeNumber: number
  title: string
  summary: string
  status: 'pending' | 'generating' | 'completed' | 'failed'
  content?: string
  assets?: {
    characters: string[] // character ids
    scenes: string[] // scene ids
    props: string[] // prop ids
  }
  createdAt: string
  updatedAt: string
}

// 资产：角色
export interface AssetCharacter {
  id: string
  name: string
  type: '主角' | '配角' | '反派'
  gender: 'male' | 'female'
  age: string
  faceShape?: string
  eyes?: string
  hairStyle?: string
  costumeType?: string
  costumeDesc?: string
  makeupImageDesc?: string
  features?: string[]
  description: string
  firstEpisode: number
}

// 资产：场景
export interface AssetScene {
  id: string
  name: string
  type: '主要场景' | '次要场景'
  description: string
  firstEpisode: number
}

// 资产：道具
export interface AssetProp {
  id: string
  name: string
  type: '武器' | '法器' | '日常物品'
  description: string
  firstEpisode: number
}

// 导出记录
export interface ExportRecord {
  id: string
  type: 'script' | 'project'
  path: string
  createdAt: string
}

// 默认配置
export const DEFAULT_APP_CONFIG: AppConfig = {
  defaultParams: {
    style: '3d-fantasy',
    aspectRatio: '16:9',
    quality: 'high',
    platform: 'douyin',
    duration: 60,
  },
  outputDirectory: '',
  templateIndex: {
    systemPrompt: 'system-prompt.txt',
    characterExtract: 'character-extract.txt',
    sceneExtract: 'scene-extract.txt',
    assetGenerate: 'asset-generate.txt',
    storyboardSuffix: 'storyboard-suffix.txt',
    outlineGenerate: 'outline-generate.txt',
  },
  account: {},
  uiPreferences: {},
}
