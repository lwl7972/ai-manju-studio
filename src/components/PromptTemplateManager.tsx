import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { X, Save, RotateCcw, ChevronRight, Hash } from 'lucide-react'
import {
  loadTemplates,
  updateTemplate,
  restoreDefault,
  getAvailableVariables,
  PromptTemplate,
  PromptTemplateType,
  PROMPT_TEMPLATE_TYPES,
} from '@/services/promptTemplateService'

interface PromptTemplateManagerProps {
  onClose: () => void
}

export default function PromptTemplateManager({ onClose }: PromptTemplateManagerProps) {
  const [templates, setTemplates] = useState<PromptTemplate[]>([])
  const [selectedType, setSelectedType] = useState<PromptTemplateType>('system-prompt')
  const [currentContent, setCurrentContent] = useState('')
  const [hasChanges, setHasChanges] = useState(false)
  const [segments, setSegments] = useState<{ title: string; content: string }[]>([])

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
    // 简单按空行分段，识别标题
    const lines = content.split('\n')
    const result: { title: string; content: string }[] = []
    let currentTitle = '正文'
    let currentContent: string[] = []

    for (const line of lines) {
      if (line.startsWith('#')) {
        if (currentContent.length > 0) {
          result.push({ title: currentTitle, content: currentContent.join('\n') })
        }
        currentTitle = line.replace(/#+\s*/, '')
        currentContent = []
      } else {
        currentContent.push(line)
      }
    }

    if (currentContent.length > 0) {
      result.push({ title: currentTitle, content: currentContent.join('\n') })
    }

    setSegments(result)
  }

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
    const insertText = `{${variable}}`
    const textarea = document.getElementById('template-editor') as HTMLTextAreaElement
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newContent =
        currentContent.substring(0, start) + insertText + currentContent.substring(end)
      setCurrentContent(newContent)
      setHasChanges(true)
    }
  }

  const currentTemplate = templates.find(t => t.type === selectedType)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg w-full max-w-6xl h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-xl font-bold">提示词管理</h2>
            <p className="text-sm text-muted-foreground">管理系统级提示词模板</p>
          </div>
          <div className="flex items-center gap-2">
            {hasChanges && (
              <Button onClick={handleSave} size="sm">
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
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => handleInsertVariable(variable)}
                  >
                    {'{'}
                    {variable}
                    {'}'}
                  </Badge>
                ))}
              </div>
            </div>

            {/* 编辑器 */}
            <div className="flex-1 overflow-auto p-4">
              <Textarea
                id="template-editor"
                value={currentContent}
                onChange={(e) => {
                  setCurrentContent(e.target.value)
                  setHasChanges(true)
                  parseSegments(e.target.value)
                }}
                className="min-h-[500px] font-mono text-sm whitespace-pre"
              />
            </div>

            {/* 分段预览 */}
            {segments.length > 0 && (
              <div className="border-t p-4">
                <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                  <ChevronRight className="h-3 w-3" />
                  分段预览：
                </div>
                <div className="flex flex-wrap gap-2">
                  {segments.map((segment, index) => (
                    <Badge key={index} variant="secondary">
                      {segment.title}
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
