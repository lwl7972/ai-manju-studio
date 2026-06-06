import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { X, Save, RotateCcw, ChevronRight, Hash, Eye, Edit3, FileText } from 'lucide-react'
import {
  loadTemplates,
  updateTemplate,
  restoreDefault,
  getAvailableVariables,
} from '@/services/promptTemplateService'
import {
  PromptTemplate,
  PromptTemplateType,
  PROMPT_TEMPLATE_TYPES,
} from '@/types/promptTemplates'

interface PromptTemplateManagerProps {
  onClose: () => void
}

interface Segment {
  title: string
  content: string
  type: 'rule' | 'example' | 'constraint' | 'normal'
  startLine: number
  endLine: number
}

export default function PromptTemplateManager({ onClose }: PromptTemplateManagerProps) {
  const [templates, setTemplates] = useState<PromptTemplate[]>([])
  const [selectedType, setSelectedType] = useState<PromptTemplateType>('system-prompt')
  const [currentContent, setCurrentContent] = useState('')
  const [hasChanges, setHasChanges] = useState(false)
  const [segments, setSegments] = useState<Segment[]>([])
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit')
  const [highlightedLines, setHighlightedLines] = useState<number[]>([])

  const availableVariables = getAvailableVariables()

  useEffect(() => {
    const loaded = loadTemplates()
    setTemplates(loaded)
    
    const initial = loaded.find(t => t.type === 'system-prompt')
    if (initial) {
      setCurrentContent(initial.content)
      parseSegments(initial.content)
    }
  }, [])

  useEffect(() => {
    const template = templates.find(t => t.type === selectedType)
    if (template) {
      setCurrentContent(template.content)
      setHasChanges(false)
      parseSegments(template.content)
    }
  }, [selectedType, templates])

  const parseSegments = (content: string) => {
    const lines = content.split('\n')
    const result: Segment[] = []
    let currentTitle = '正文'
    let currentContent: string[] = []
    let currentType: Segment['type'] = 'normal'
    let startLine = 1

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      
      if (line.startsWith('#')) {
        if (currentContent.length > 0) {
          result.push({
            title: currentTitle,
            content: currentContent.join('\n'),
            type: currentType,
            startLine,
            endLine: startLine + currentContent.length - 1,
          })
        }
        currentTitle = line.replace(/#+\s*/, '')
        currentContent = []
        startLine = i + 1
        
        // 识别段落类型
        if (currentTitle.includes('规则') || currentTitle.includes('requirement') || currentTitle.includes('rule')) {
          currentType = 'rule'
        } else if (currentTitle.includes('示例') || currentTitle.includes('example')) {
          currentType = 'example'
        } else if (currentTitle.includes('约束') || currentTitle.includes('constraint') || currentTitle.includes('禁止')) {
          currentType = 'constraint'
        } else {
          currentType = 'normal'
        }
      } else {
        currentContent.push(line)
      }
    }

    if (currentContent.length > 0) {
      result.push({
        title: currentTitle,
        content: currentContent.join('\n'),
        type: currentType,
        startLine,
        endLine: startLine + currentContent.length - 1,
      })
    }

    setSegments(result)
  }

  const highlightVariables = useMemo(() => {
    const lines = currentContent.split('\n')
    const highlighted: number[] = []
    
    lines.forEach((line, index) => {
      const hasVariable = availableVariables.some(v => line.includes(`{${v}}`))
      if (hasVariable) {
        highlighted.push(index + 1)
      }
    })
    
    return highlighted
  }, [currentContent, availableVariables])

  const handleSave = () => {
    updateTemplate(selectedType, currentContent)
    setTemplates(loadTemplates())
    setHasChanges(false)
  }

  const handleRestoreDefault = () => {
    if (confirm('确定要恢复默认模板吗？当前修改将会丢失。')) {
      restoreDefault(selectedType)
      const updated = loadTemplates()
      setTemplates(updated)
      const template = updated.find(t => t.type === selectedType)
      if (template) {
        setCurrentContent(template.content)
        setHasChanges(false)
        parseSegments(template.content)
      }
    }
  }

  const handleInsertVariable = (variable: string) => {
    const textarea = document.getElementById('template-editor') as HTMLTextAreaElement
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const insertText = `{${variable}}`
      const newContent =
        currentContent.substring(0, start) + insertText + currentContent.substring(end)
      setCurrentContent(newContent)
      setHasChanges(true)
    }
  }

  const getSegmentTypeColor = (type: Segment['type']) => {
    switch (type) {
      case 'rule':
        return 'bg-blue-500/20 text-blue-700 border-blue-500/30'
      case 'example':
        return 'bg-green-500/20 text-green-700 border-green-500/30'
      case 'constraint':
        return 'bg-red-500/20 text-red-700 border-red-500/30'
      default:
        return 'bg-gray-500/20 text-gray-700 border-gray-500/30'
    }
  }

  const getSegmentTypeLabel = (type: Segment['type']) => {
    switch (type) {
      case 'rule':
        return '规则段'
      case 'example':
        return '示例段'
      case 'constraint':
        return '约束段'
      default:
        return '正文段'
    }
  }

  const currentTemplate = templates.find(t => t.type === selectedType)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg w-full max-w-6xl h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-xl font-bold">提示词管理</h2>
            <p className="text-sm text-muted-foreground">管理系统级提示词模板</p>
          </div>
          <div className="flex items-center gap-2">
            {hasChanges && (
              <Button onClick={handleSave} size="sm" className="bg-green-600 hover:bg-green-700">
                <Save className="h-4 w-4 mr-2" />
                保存
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={handleRestoreDefault}>
              <RotateCcw className="h-4 w-4 mr-2" />
              恢复默认
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* 左侧模板列表 */}
          <div className="w-64 border-r">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-2">
                {PROMPT_TEMPLATE_TYPES.map((templateDef) => {
                  const isActive = selectedType === templateDef.type
                  const template = templates.find(t => t.type === templateDef.type)
                  const isDefault = template?.isDefault

                  return (
                    <button
                      key={templateDef.type}
                      onClick={() => setSelectedType(templateDef.type)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted/50 hover:bg-muted'
                      }`}
                    >
                      <div className="font-medium text-sm">{templateDef.name}</div>
                      <div
                        className={`text-xs mt-1 ${
                          isActive ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        }`}
                      >
                        {templateDef.description}
                      </div>
                      {!isDefault && (
                        <Badge variant="secondary" className="mt-1 text-xs">
                          已修改
                        </Badge>
                      )}
                    </button>
                  )
                })}
              </div>
            </ScrollArea>
          </div>

          {/* 右侧编辑区 */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* 变量工具栏 */}
            <div className="p-3 border-b bg-muted/30">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Hash className="h-3 w-3" />
                可用变量（点击复制）：
              </div>
              <div className="flex flex-wrap gap-1">
                {availableVariables.map((variable) => (
                  <Badge
                    key={variable}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => handleInsertVariable(variable)}
                  >
                    {'{'}
                    {variable}
                    {'}'}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Tab 切换 */}
            <div className="border-b px-3 pt-2">
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'edit' | 'preview')} className="w-full">
                <TabsList>
                  <TabsTrigger value="edit" className="flex items-center gap-2">
                    <Edit3 className="h-3 w-3" />
                    编辑
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="flex items-center gap-2">
                    <Eye className="h-3 w-3" />
                    预览
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* 编辑区/预览区 */}
            <div className="flex-1 overflow-auto p-4">
              {activeTab === 'edit' ? (
                <div className="relative">
                  <Textarea
                    id="template-editor"
                    value={currentContent}
                    onChange={(e) => {
                      setCurrentContent(e.target.value)
                      setHasChanges(true)
                      parseSegments(e.target.value)
                    }}
                    className="min-h-[500px] font-mono text-sm whitespace-pre"
                    style={{ minHeight: 'calc(80vh - 300px)' }}
                  />
                  {/* 行号高亮提示 */}
                  {highlightedLines.length > 0 && (
                    <div className="absolute top-2 right-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
                      变量行：{highlightedLines.join(', ')}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <FileText className="h-3 w-3" />
                    模板预览：{currentTemplate?.name}
                  </div>
                  {segments.map((segment, index) => (
                    <div
                      key={index}
                      className={`border rounded-lg p-4 ${getSegmentTypeColor(segment.type)}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{segment.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {getSegmentTypeLabel(segment.type)}
                        </Badge>
                      </div>
                      <pre className="whitespace-pre-wrap text-sm font-mono opacity-80">
                        {segment.content || '(空)'}
                      </pre>
                      <div className="text-xs opacity-60 mt-2">
                        第 {segment.startLine} - {segment.endLine} 行
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 分段信息 */}
            {segments.length > 0 && activeTab === 'edit' && (
              <div className="border-t p-3 bg-muted/30">
                <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                  <ChevronRight className="h-3 w-3" />
                  分段识别：
                </div>
                <div className="flex flex-wrap gap-2">
                  {segments.map((segment, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className={`text-xs ${
                        segment.type === 'rule' ? 'border-blue-500 text-blue-700' :
                        segment.type === 'example' ? 'border-green-500 text-green-700' :
                        segment.type === 'constraint' ? 'border-red-500 text-red-700' :
                        'border-gray-500 text-gray-700'
                      }`}
                    >
                      {segment.title} ({getSegmentTypeLabel(segment.type)})
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
