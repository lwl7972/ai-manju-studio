import { PromptTemplate, PromptTemplateType, PROMPT_TEMPLATE_TYPES, TEMPLATE_VARIABLES } from '@/types/promptTemplates'

const TEMPLATES_KEY = 'prompt_templates'

// 默认模板内容（基于用户提供的 提示词.txt）
const DEFAULT_TEMPLATES: Record<PromptTemplateType, string> = {
  'system-prompt': `#系统提示词
你是 Seedence 2.0 漫剧分镜文案师，按以下格式生成分镜提示词。

## 分镜生成要求
1. 每个分镜的描述必须详细充实，不低于 200 字，**每个分镜必须包含至少 3 句台词对话**
2. 画面描述要包含：场景细节、角色动作、表情变化、眼神方向、环境氛围、光影效果
3. 运镜描述要具体：镜头运动方向、速度、目的，让读者能清晰想象画面
4. 台词要符合角色性格，推动剧情发展，**每镜至少 3 句话，不能只有一句台词**
5. 音效描述要具体：环境音效、情绪渲染

## 核心规则
1. 总时长严格锁定{seconds}秒，画面比例{aspectRatio}，风格{style}
2. 角色形象全程统一，无变形、无穿模
3. 单镜头只用一种运镜方式，每个镜头必须分配具体秒数（如"3 秒"、"4 秒"）
4. 所有镜头秒数之和必须严格等于{seconds}秒，不能多也不能少
5. 台词要求（非常重要）：
   - 每个镜头必须有台词，不能留空
   - 台词类型要丰富：单人独白、双人对白、多人对话、内心独白、旁白解说
   - 对话要自然流畅，符合角色性格
   - **台词格式必须使用标准格式：[角色名，情绪]: "台词内容"**
   - 正确示例：[孙悟空，坚定]: "师父，让我去前面看看情况！"
   - 正确示例：[女主角，温柔]: "你来了~"
   - 正确示例：[男主角，愤怒]: "这不可能！"
   - 台词用双引号包裹，音画同步，必须包含说话动作和情绪描述
6. 台词/旁白匹配对应视线与对话对象，对话用正反打，禁止越轴。搭配多元视角与运镜，合理留白。
7. **负面约束：严禁生成背景音乐，只保留人物对话声音和环境音效**

## 运镜方式知识库（AI 必须根据场景自动选择并用自然语言描述）

### 基础运镜（15 个 - 新手必练）
- 固定镜头：镜头静止不动，适合展现场景全貌、烘托气氛。使用场景：古风庭院、都市夜景、大殿等需要展现场景氛围的画面
- 缓慢推镜：镜头缓慢向前推进，逐渐靠近主体。使用场景：情绪递进、细节特写、主角顿悟时刻

（此处省略部分内容，实际使用时应包含完整的 15+15+10 个运镜描述）

## 输出格式规则，必须严格遵守。
【全局基础设定】
注意：【全局基础设定】后面直接跟【角色引用】，不要添加任何其他内容，不要添加"整体风格"等额外信息。
【角色引用】只列出本分镜实际出现的角色：
  @图 1【角色】A 名（性别，年龄，性格特征）
  @图 2【角色】B 名（性别，年龄，性格特征）
  @图 x(x=角色引用的数量 + 1)【场景】场景名（场景描述）
  场景环境：@图 x 场景名，时间、天气、氛围描述
  光影色调：主色调、光线描述
【视频基础参数】
总时长：{seconds}秒
画面比例：{aspectRatio}
画风设定：{style}，4K 分辨率，精细细节，画面层次丰富，清晰度高，全程画风统一，人物形象、五官全程固定，无变形、无穿模、无闪帧，动作自然流畅
【分镜明细】
0-4s：[承接上镜] + 【场景信息】+ 运镜描述。[cut]
【角色对话】
4-7s [角色名，情绪]: "台词内容"[cut]
【背景音效】
0-4s：音效描述 [cut]

【附加约束】
场景、色调、光影保持统一，细节丰富，特效自然不突兀，画面无水印、无崩坏，标准高质感玄幻漫剧，**只生成人物对话声音，不生成背景音乐**`,

  'character-extract': `# 人物角色提取提示词

## 任务目标
根据剧本内容，提取并整理出所有角色、场景和道具的详细信息。

## 输入内容
剧本标题：{projectName}
核心主题：{theme}
分集内容：
{episodesContent}

## 角色提取强制要求
1. 性别判断（必须返回 male 或 female，禁止返回中文）
2. 年龄推理：根据角色身份、行为、对话语气判断
3. 服装类型判断：根据剧本时代背景、角色身份选择
4. 服装描述必须详细（用于 AI 定妆图生成，规避肖像权风险）
5. 外貌特征推理
6. 【重要】AI 定妆图描述（makeupImageDesc）

## 输出格式
请按以下 JSON 格式返回：
{
  "characters": [...],
  "scenes": [...],
  "props": [...]
}`,

  'scene-extract': `# 场景提取提示词

## 任务目标
从分集内容中提取场景信息。

## 输入内容
分集内容：{episodesContent}

## 提取要求
1. 场景名称
2. 场景类型（主要场景/次要场景）
3. 场景描述（时间、天气、氛围）
4. 首次出现集数

## 输出格式
JSON 格式`,

  'asset-generate': `# 资产生成提示词

## 任务目标
批量生成角色/场景图片的提示词。

## 输入内容
资产信息：{assetInfo}

## 生成要求
1. 角色定妆图提示词
2. 场景概念图提示词
3. 道具设计图提示词

## 输出格式
JSON 格式`,

  'storyboard-suffix': `# 分镜后缀提示词

## 附加约束
1. 场景、色调、光影保持统一
2. 细节丰富，特效自然不突兀
3. 画面无水印、无崩坏
4. 标准高质感玄幻漫剧
5. **只生成人物对话声音，不生成背景音乐**

## 负面约束
- 严禁生成背景音乐
- 严禁角色形象变形、穿模
- 严禁画面崩坏、闪帧`,

  'outline-generate': `# 大纲生成提示词

## 任务目标
根据剧本基本信息生成剧情大纲。

## 输入内容
标题：{projectName}
主题：{theme}
简介：{description}

## 生成要求
1. 故事背景
2. 主要角色
3. 剧情主线
4. 分集大纲（建议{episodeCount}集）

## 输出格式
结构化文本`,
}

export function loadTemplates(): PromptTemplate[] {
  const saved = localStorage.getItem(TEMPLATES_KEY)
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch (e) {
      console.error('Failed to load templates:', e)
      return getDefaultTemplates()
    }
  }
  return getDefaultTemplates()
}

export function saveTemplates(templates: PromptTemplate[]): void {
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates))
}

export function getTemplate(type: PromptTemplateType): PromptTemplate | undefined {
  const templates = loadTemplates()
  return templates.find(t => t.type === type)
}

export function updateTemplate(type: PromptTemplateType, content: string): void {
  const templates = loadTemplates()
  const index = templates.findIndex(t => t.type === type)
  
  const now = new Date().toISOString()
  
  if (index >= 0) {
    templates[index] = {
      ...templates[index],
      content,
      updatedAt: now,
      isDefault: false,
    }
  } else {
    const templateDef = PROMPT_TEMPLATE_TYPES.find(t => t.type === type)
    templates.push({
      type,
      name: templateDef?.name || type,
      description: templateDef?.description || '',
      content,
      variables: extractVariables(content),
      isDefault: false,
      createdAt: now,
      updatedAt: now,
    })
  }
  
  saveTemplates(templates)
}

export function restoreDefault(type: PromptTemplateType): void {
  const templates = loadTemplates()
  const index = templates.findIndex(t => t.type === type)
  const now = new Date().toISOString()
  
  const templateDef = PROMPT_TEMPLATE_TYPES.find(t => t.type === type)
  const defaultTemplate: PromptTemplate = {
    type,
    name: templateDef?.name || type,
    description: templateDef?.description || '',
    content: DEFAULT_TEMPLATES[type],
    variables: extractVariables(DEFAULT_TEMPLATES[type]),
    isDefault: true,
    createdAt: now,
    updatedAt: now,
  }
  
  if (index >= 0) {
    templates[index] = defaultTemplate
  } else {
    templates.push(defaultTemplate)
  }
  
  saveTemplates(templates)
}

export function getDefaultTemplates(): PromptTemplate[] {
  const now = new Date().toISOString()
  
  return PROMPT_TEMPLATE_TYPES.map(def => ({
    type: def.type,
    name: def.name,
    description: def.description,
    content: DEFAULT_TEMPLATES[def.type],
    variables: extractVariables(DEFAULT_TEMPLATES[def.type]),
    isDefault: true,
    createdAt: now,
    updatedAt: now,
  }))
}

export function extractVariables(content: string): string[] {
  const regex = /\{(\w+)\}/g
  const matches: string[] = []
  let match
  
  while ((match = regex.exec(content)) !== null) {
    if (!matches.includes(match[1])) {
      matches.push(match[1])
    }
  }
  
  return matches
}

export function getAvailableVariables(): string[] {
  return TEMPLATE_VARIABLES
}
