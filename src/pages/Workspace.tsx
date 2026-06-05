import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input, Textarea } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cozeService } from '@/services/coze'
import { DEFAULT_MODEL_PRESETS } from '@/types/models'
import { Settings2, BookOpen, Image as ImageIcon, Video, Mic, Loader2, CheckCircle2, XCircle, Play } from 'lucide-react'

interface StageStatus {
  id: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  output?: any
  error?: string
  modelName?: string
}

const stages = [
  { id: 'script', label: '剧本生成', icon: BookOpen, description: '从小说生成剧本' },
  { id: 'character', label: '角色设定', icon: Settings2, description: '设计角色一致性' },
  { id: 'image', label: '图像生成', icon: ImageIcon, description: '生成分镜图像' },
  { id: 'video', label: '视频生成', icon: Video, description: '生成动态视频' },
  { id: 'audio', label: '配音生成', icon: Mic, description: '生成语音配音' },
]

export default function Workspace() {
  const [selectedStage, setSelectedStage] = useState('script')
  const [projectName, setProjectName] = useState('我的漫剧项目')
  const [novel, setNovel] = useState('')
  const [script, setScript] = useState('')
  const [characterDesc, setCharacterDesc] = useState('')
  const [imagePrompt, setImagePrompt] = useState('')
  const [videoPrompt, setVideoPrompt] = useState('')
  const [audioText, setAudioText] = useState('')
  const [stageStatuses, setStageStatuses] = useState<Record<string, StageStatus>>({})
  const [isRunning, setIsRunning] = useState(false)
  const [currentModel, setCurrentModel] = useState<Record<string, string>>({})

  useEffect(() => {
    const saved = localStorage.getItem('selected_models')
    if (saved) {
      const models = JSON.parse(saved)
      setCurrentModel(models)
    }
  }, [])

  const getModelName = (stageId: string) => {
    const saved = localStorage.getItem('selected_models')
    if (!saved) return '默认模型'
    const models = JSON.parse(saved)
    const modelId = models[stageId]
    const preset = DEFAULT_MODEL_PRESETS.find(p => p.id === modelId)
    return preset?.name || '自定义模型'
  }

  const executeStage = async (stageId: string) => {
    setIsRunning(true)

    setStageStatuses(prev => ({
      ...prev,
      [stageId]: { id: stageId, status: 'running', modelName: getModelName(stageId) },
    }))

    let params = {}
    if (stageId === 'script') params = { title: projectName, content: novel }
    else if (stageId === 'character') params = { description: characterDesc }
    else if (stageId === 'image') params = { prompt: imagePrompt }
    else if (stageId === 'video') params = { prompt: videoPrompt }
    else if (stageId === 'audio') params = { text: audioText }

    const result = await cozeService.executeStage(stageId, params)

    if (result.success) {
      setStageStatuses(prev => ({
        ...prev,
        [stageId]: {
          id: stageId,
          status: 'completed',
          output: result.data,
          modelName: result.modelName,
        },
      }))

      if (stageId === 'script' && result.data?.script) {
        setScript(result.data.script)
      }
    } else {
      setStageStatuses(prev => ({
        ...prev,
        [stageId]: {
          id: stageId,
          status: 'failed',
          error: result.error,
          modelName: result.modelName,
        },
      }))
    }

    setIsRunning(false)
  }

  const renderStageContent = (stageId: string) => {
    const status = stageStatuses[stageId]

    switch (stageId) {
      case 'script':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">小说原文</label>
              <Textarea
                placeholder="请输入您的小说内容..."
                value={novel}
                onChange={(e) => setNovel(e.target.value)}
                className="min-h-[200px]"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">生成的剧本</label>
              <Textarea
                placeholder="点击运行后，生成的剧本将显示在这里..."
                value={script}
                onChange={(e) => setScript(e.target.value)}
                className="min-h-[200px]"
                readOnly
              />
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => executeStage('script')} disabled={isRunning || !novel}>
                {isRunning && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                <Play className="h-4 w-4 mr-2" />
                生成剧本
              </Button>
              {status?.modelName && (
                <span className="text-xs text-muted-foreground">
                  使用：{status.modelName}
                </span>
              )}
            </div>
          </div>
        )

      case 'character':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">角色描述</label>
              <Textarea
                placeholder="描述角色的外貌、性格、服装风格等..."
                value={characterDesc}
                onChange={(e) => setCharacterDesc(e.target.value)}
                className="min-h-[150px]"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">一致性提示词</label>
              <Textarea
                placeholder="用于保持角色一致性的提示词..."
                value={script}
                onChange={(e) => setScript(e.target.value)}
                className="min-h-[100px]"
                readOnly
              />
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => executeStage('character')} disabled={isRunning || !characterDesc}>
                {isRunning && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                <Play className="h-4 w-4 mr-2" />
                生成角色设定
              </Button>
              {status?.modelName && (
                <span className="text-xs text-muted-foreground">
                  使用：{status.modelName}
                </span>
              )}
            </div>
          </div>
        )

      case 'image':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">图像生成提示词</label>
              <Textarea
                placeholder="描述您想要生成的画面..."
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-lg p-4 bg-muted/50 min-h-[200px] flex items-center justify-center">
                <p className="text-muted-foreground">生成的图像将显示在这里</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => executeStage('image')} disabled={isRunning || !imagePrompt}>
                {isRunning && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                <Play className="h-4 w-4 mr-2" />
                生成图像
              </Button>
              {status?.modelName && (
                <span className="text-xs text-muted-foreground">
                  使用：{status.modelName}
                </span>
              )}
            </div>
          </div>
        )

      case 'video':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">视频生成提示词</label>
              <Textarea
                placeholder="描述您想要生成的视频内容..."
                value={videoPrompt}
                onChange={(e) => setVideoPrompt(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <div className="border rounded-lg p-4 bg-muted/50 min-h-[300px] flex items-center justify-center">
              <p className="text-muted-foreground">生成的视频将显示在这里</p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => executeStage('video')} disabled={isRunning || !videoPrompt}>
                {isRunning && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                <Play className="h-4 w-4 mr-2" />
                生成视频
              </Button>
              {status?.modelName && (
                <span className="text-xs text-muted-foreground">
                  使用：{status.modelName}
                </span>
              )}
            </div>
          </div>
        )

      case 'audio':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">配音文本</label>
              <Textarea
                placeholder="输入需要配音的文本内容..."
                value={audioText}
                onChange={(e) => setAudioText(e.target.value)}
                className="min-h-[150px]"
              />
            </div>
            <div className="border rounded-lg p-4 bg-muted/50">
              <p className="text-muted-foreground">生成的音频将显示在这里</p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => executeStage('audio')} disabled={isRunning || !audioText}>
                {isRunning && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                <Play className="h-4 w-4 mr-2" />
                生成配音
              </Button>
              {status?.modelName && (
                <span className="text-xs text-muted-foreground">
                  使用：{status.modelName}
                </span>
              )}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{projectName}</h2>
          <p className="text-muted-foreground">AI 漫剧创作工作流</p>
        </div>
        <Input
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="w-[300px]"
          placeholder="项目名称"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-2">
          {stages.map((stage) => {
            const Icon = stage.icon
            const status = stageStatuses[stage.id]?.status
            const isActive = selectedStage === stage.id

            return (
              <Card
                key={stage.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  isActive ? 'border-primary ring-1 ring-primary' : ''
                }`}
                onClick={() => setSelectedStage(stage.id)}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="relative">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    {status === 'running' && (
                      <Loader2 className="h-4 w-4 absolute -right-2 -top-2 animate-spin text-primary" />
                    )}
                    {status === 'completed' && (
                      <CheckCircle2 className="h-4 w-4 absolute -right-2 -top-2 text-green-500" />
                    )}
                    {status === 'failed' && (
                      <XCircle className="h-4 w-4 absolute -right-2 -top-2 text-red-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{stage.label}</h3>
                    <p className="text-xs text-muted-foreground">{stage.description}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{stages.find(s => s.id === selectedStage)?.label}</CardTitle>
                  <CardDescription>
                    {stages.find(s => s.id === selectedStage)?.description}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground mb-1">当前模型</p>
                  <p className="text-sm font-medium">{getModelName(selectedStage)}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {renderStageContent(selectedStage)}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>快速操作</CardTitle>
          <CardDescription>常用功能和设置快捷入口</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.location.hash = '/settings'}>
              <Settings2 className="h-4 w-4 mr-2" />
              配置模型
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                const token = localStorage.getItem('coze_token')
                if (token) {
                  cozeService.setToken(token)
                  alert('Token 已加载')
                } else {
                  alert('请先在设置中配置 Token')
                }
              }}
            >
              加载 API Token
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                const useMock = localStorage.getItem('use_mock')
                alert(`当前模式：${useMock === 'true' ? 'Mock 演示' : '真实 API 调用'}`)
              }}
            >
              查看当前模式
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
