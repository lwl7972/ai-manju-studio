import { PromptTemplate } from '@/types/promptTemplates'
import { getTemplate } from './promptTemplateService'

/**
 * 提示词拼装引擎
 * 将系统提示词、项目参数、分集内容、资产信息组合成完整的分镜提示词
 */
export interface PromptAssemblyInput {
  // 项目信息
  projectName: string
  episodeTitle: string
  episodeNumber: number
  
  // 全局参数
  style: string
  aspectRatio: string
  quality: string
  platform: string
  duration: number
  
  // 分集内容
  episodeContent: string
  
  // 资产列表
  characters: Array<{
    id: string
    name: string
    type: string
    gender: string
    age: string
    description: string
    makeupImageDesc?: string
  }>
  
  scenes: Array<{
    id: string
    name: string
    type: string
    description: string
  }>
  
  props: Array<{
    id: string
    name: string
    type: string
    description: string
  }>
}

export interface PromptSegments {
  systemPrompt: string
  globalSettings: string
  characterDefinitions: string
  sceneDefinitions: string
  storyboardContent: string
  dialogues: string
  soundEffects: string
  constraints: string
}

export class PromptAssemblyEngine {
  private templates: {
    systemPrompt: PromptTemplate
    characterExtract: PromptTemplate
    sceneExtract: PromptTemplate
    assetGenerate: PromptTemplate
    storyboardSuffix: PromptTemplate
    outlineGenerate: PromptTemplate
  }
  
  constructor() {
    const sysPrompt = getTemplate('system-prompt')
    const charExtract = getTemplate('character-extract')
    const sceneExtract = getTemplate('scene-extract')
    const assetGenerate = getTemplate('asset-generate')
    const storyboardSuffix = getTemplate('storyboard-suffix')
    const outlineGenerate = getTemplate('outline-generate')
    
    if (!sysPrompt || !charExtract || !sceneExtract || !assetGenerate || !storyboardSuffix || !outlineGenerate) {
      throw new Error('Failed to load prompt templates')
    }
    
    this.templates = {
      systemPrompt: sysPrompt,
      characterExtract: charExtract,
      sceneExtract: sceneExtract,
      assetGenerate: assetGenerate,
      storyboardSuffix: storyboardSuffix,
      outlineGenerate: outlineGenerate,
    }
  }
  
  /**
   * 组装完整的分镜提示词
   */
  async assemble(input: PromptAssemblyInput): Promise<string> {
    const segments = this.extractSegments(input)
    
    // 使用模板变量替换
    const assembled = this.templates.systemPrompt.content
      .replace('{projectName}', input.projectName)
      .replace('{episodeTitle}', input.episodeTitle)
      .replace('{episodeNumber}', input.episodeNumber.toString())
      .replace('{style}', input.style)
      .replace('{aspectRatio}', input.aspectRatio)
      .replace('{quality}', input.quality)
      .replace('{platform}', input.platform)
      .replace('{seconds}', input.duration.toString())
      .replace('{globalSettings}', segments.globalSettings)
      .replace('{characterDefinitions}', segments.characterDefinitions)
      .replace('{sceneDefinitions}', segments.sceneDefinitions)
      .replace('{storyboardContent}', segments.storyboardContent)
      .replace('{dialogues}', segments.dialogues)
      .replace('{soundEffects}', segments.soundEffects)
      .replace('{constraints}', segments.constraints)
    
    return assembled
  }
  
  /**
   * 从输入中提取各个段落
   */
  private extractSegments(input: PromptAssemblyInput): PromptSegments {
    // 全局基础设定
    const characterRefs = input.characters
      .map((c, i) => `@图${i + 1}【角色】${c.name}（${c.gender === 'male' ? '男' : '女'}，${c.age}岁，${this.extractTraits(c.description)}）`)
      .join('\n')
    
    const sceneRefs = input.scenes
      .map((s, i) => `@图${input.characters.length + i + 1}【场景】${s.name}（${s.description}）`)
      .join('\n')
    
    const globalSettings = `【全局基础设定】\n${characterRefs}\n${sceneRefs}\n场景环境：${input.scenes[0]?.description || '待定'}\n光影色调：根据剧情氛围动态调整`
    
    // 角色定义
    const characterDefinitions = input.characters
      .map(c => `【${c.name}】${c.description}${c.makeupImageDesc ? `\n化妆造型：${c.makeupImageDesc}` : ''}`)
      .join('\n\n')
    
    // 场景定义
    const sceneDefinitions = input.scenes
      .map(s => `【${s.name}】${s.description}`)
      .join('\n\n')
    
    // 分镜内容（简化版，实际应该由 AI 生成）
    const storyboardContent = this.generateSimpleStoryboard(input.episodeContent)
    
    // 对话
    const dialogues = this.extractDialogues(input.episodeContent)
    
    // 音效
    const soundEffects = this.extractSoundEffects(input.episodeContent)
    
    // 约束条件
    const constraints = `【附加约束】\n场景、色调、光影保持统一，细节丰富，特效自然不突兀，画面无水印、无崩坏，标准高质感玄幻漫剧，只生成人物对话声音，不生成背景音乐`
    
    return {
      systemPrompt: this.templates.systemPrompt.content,
      globalSettings,
      characterDefinitions,
      sceneDefinitions,
      storyboardContent,
      dialogues,
      soundEffects,
      constraints,
    }
  }
  
  /**
   * 从描述中提取特征词
   */
  private extractTraits(description: string): string {
    const match = description.match(/(?:眉宇 | 眼神 | 气质 | 神情) ([^，,.]*)/)
    return match ? match[1] : '特征鲜明'
  }
  
  /**
   * 简化版分镜生成（后续可用 AI 替代）
   */
  private generateSimpleStoryboard(content: string): string {
    const paragraphs = content.split('\n').filter(p => p.trim())
    
    if (paragraphs.length === 0) {
      return '【分镜明细】\n暂无内容，请在剧本编辑页生成分集内容'
    }
    
    const shots = paragraphs.slice(0, 3).map((para, i) => {
      const startTime = i * 3
      const endTime = startTime + 3
      return `${startTime}-${endTime}s：${para.substring(0, 50)}...[cut]`
    })
    
    return `【分镜明细】\n${shots.join('\n')}`
  }
  
  /**
   * 提取对话内容
   */
  private extractDialogues(content: string): string {
    const dialoguePattern = /["""]([^"""]+)["""]/g
    const matches = [...content.matchAll(dialoguePattern)]
    
    if (matches.length === 0) {
      return '【角色对话】\n暂无对话'
    }
    
    const dialogues = matches.slice(0, 3).map((m, i) => `${i * 3}-${i * 3 + 3}s [角色]: "${m[1].substring(0, 30)}..."[cut]`)
    
    return `【角色对话】\n${dialogues.join('\n')}`
  }
  
  /**
   * 提取音效描述
   */
  private extractSoundEffects(content: string): string {
    const soundPatterns = [/风声/g, /雷声/g, /剑鸣/g, /脚步声/g, /呼吸声/g]
    const sounds: string[] = []
    
    soundPatterns.forEach(pattern => {
      if (pattern.test(content)) {
        sounds.push(pattern.source.replace(/\//g, '').replace(/g/g, ''))
      }
    })
    
    if (sounds.length === 0) {
      return '【背景音效】\n暂无特殊音效'
    }
    
    return `【背景音效】\n${sounds.map((s, i) => `${i * 3}-${i * 3 + 3}s：${s}[cut]`).join('\n')}`
  }
}

export const promptAssemblyEngine = new PromptAssemblyEngine()
