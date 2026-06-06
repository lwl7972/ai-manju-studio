import { AppConfig, Project, DEFAULT_APP_CONFIG, Episode, AssetCharacter, AssetScene, AssetProp, ExportRecord } from '@/types/config'

const CONFIG_KEY = 'app_config'
const PROJECTS_KEY = 'project_library'

// ==================== 应用配置 ====================

export function loadAppConfig(): AppConfig {
  const saved = localStorage.getItem(CONFIG_KEY)
  if (saved) {
    try {
      const config = JSON.parse(saved)
      return mergeConfig(DEFAULT_APP_CONFIG, config)
    } catch (e) {
      console.error('Failed to load app config:', e)
      return DEFAULT_APP_CONFIG
    }
  }
  return DEFAULT_APP_CONFIG
}

export function saveAppConfig(config: Partial<AppConfig>): void {
  const current = loadAppConfig()
  const merged = mergeConfig(current, config)
  localStorage.setItem(CONFIG_KEY, JSON.stringify(merged))
}

export function getOutputDirectory(): string {
  const config = loadAppConfig()
  return config.outputDirectory || ''
}

export function setOutputDirectory(path: string): void {
  saveAppConfig({ outputDirectory: path })
}

export function getDefaultParams(): AppConfig['defaultParams'] {
  const config = loadAppConfig()
  return config.defaultParams
}

export function setDefaultParams(params: Partial<AppConfig['defaultParams']>): void {
  const config = loadAppConfig()
  config.defaultParams = mergeConfig(config.defaultParams, params)
  saveAppConfig({ defaultParams: config.defaultParams })
}

// ==================== 项目库 ====================

export function loadProjects(): Project[] {
  const saved = localStorage.getItem(PROJECTS_KEY)
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch (e) {
      console.error('Failed to load projects:', e)
      return []
    }
  }
  return []
}

export function saveProject(project: Project): void {
  const projects = loadProjects()
  const index = projects.findIndex(p => p.id === project.id)
  
  if (index >= 0) {
    projects[index] = project
  } else {
    projects.unshift(project)
  }
  
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects))
}

export function getProject(id: string): Project | undefined {
  const projects = loadProjects()
  return projects.find(p => p.id === id)
}

export function deleteProject(id: string): void {
  const projects = loadProjects()
  const filtered = projects.filter(p => p.id !== id)
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(filtered))
}

export function createProject(data: {
  title: string
  tag?: string
  theme?: string
  description?: string
}): Project {
  const project: Project = {
    id: `project_${Date.now()}`,
    title: data.title,
    tag: data.tag,
    theme: data.theme,
    description: data.description,
    paramsOverride: {},
    episodes: [],
    assets: {
      characters: [],
      scenes: [],
      props: [],
    },
    exports: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  
  saveProject(project)
  return project
}

// ==================== 工具函数 ====================

function mergeConfig<T extends Record<string, any>>(base: T, override: Partial<T>): T {
  const result = { ...base }
  
  for (const key in override) {
    if (override.hasOwnProperty(key)) {
      const overrideValue = override[key]
      const baseValue = result[key]
      
      if (overrideValue !== undefined) {
        if (typeof overrideValue === 'object' && overrideValue !== null && !Array.isArray(overrideValue) &&
            typeof baseValue === 'object' && baseValue !== null && !Array.isArray(baseValue)) {
          result[key] = mergeConfig(baseValue as any, overrideValue as any)
        } else {
          result[key] = overrideValue as any
        }
      }
    }
  }
  
  return result
}
