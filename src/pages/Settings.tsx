import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  DEFAULT_MODEL_PRESETS,
  STAGE_MODEL_MAPPING,
  ModelPreset,
  ModelConfig,
} from '@/types/models'
import { Check, Plus, Trash2, Settings2, Zap, CreditCard } from 'lucide-react'

export default function Settings() {
  const [apiToken, setApiToken] = useState('')
  const [apiEndpoint, setApiEndpoint] = useState('https://api.coze.cn')
  const [useMock, setUseMock] = useState(true)
  
  const [selectedModels, setSelectedModels] = useState<Record<string, string>>({
    script: 'preset_script_1',
    character: 'preset_script_1',
    image: 'preset_image_1',
    video: 'preset_video_1',
    audio: 'preset_audio_1',
  })
  
  const [modelConfigs, setModelConfigs] = useState<ModelConfig[]>([])
  const [activeTab, setActiveTab] = useState('models')
  const [showCustomModel, setShowCustomModel] = useState(false)
  const [customModelType, setCustomModelType] = useState<'text' | 'image' | 'video' | 'audio'>('text')

  const [newCustomModel, setNewCustomModel] = useState<Partial<ModelConfig>>({
    name: '',
    type: 'text',
    provider: 'custom',
    workflowId: '',
    parameters: {},
  })

  useEffect(() => {
    const saved = localStorage.getItem('model_configs')
    if (saved) {
      setModelConfigs(JSON.parse(saved))
    }
    const savedSelection = localStorage.getItem('selected_models')
    if (savedSelection) {
      setSelectedModels(JSON.parse(savedSelection))
    }
    const savedToken = localStorage.getItem('coze_token')
    if (savedToken) {
      setApiToken(savedToken)
    }
  }, [])

  const handleSave = () => {
    localStorage.setItem('coze_token', apiToken)
    localStorage.setItem('coze_endpoint', apiEndpoint)
    localStorage.setItem('use_mock', useMock.toString())
    alert('基础配置已保存')
  }

  const handleSelectModel = (stage: string, modelId: string) => {
    const updated = { ...selectedModels, [stage]: modelId }
    setSelectedModels(updated)
    localStorage.setItem('selected_models', JSON.stringify(updated))
  }

  const handleSaveCustomModel = () => {
    if (!newCustomModel.name || !newCustomModel.workflowId) {
      alert('请填写模型名称和工作流 ID')
      return
    }

    const customModel: ModelConfig = {
      id: `custom_${Date.now()}`,
      name: newCustomModel.name!,
      type: newCustomModel.type!,
      provider: 'custom',
      workflowId: newCustomModel.workflowId,
      parameters: newCustomModel.parameters || {},
    }

    const updated = [...modelConfigs, customModel]
    setModelConfigs(updated)
    localStorage.setItem('model_configs', JSON.stringify(updated))
    setShowCustomModel(false)
    setNewCustomModel({ name: '', type: 'text', provider: 'custom', workflowId: '', parameters: {} })
    alert('自定义模型已保存')
  }

  const handleDeleteCustomModel = (modelId: string) => {
    const updated = modelConfigs.filter(m => m.id !== modelId)
    setModelConfigs(updated)
    localStorage.setItem('model_configs', JSON.stringify(updated))
  }

  const getPresetsForType = (type: string) => {
    return DEFAULT_MODEL_PRESETS.filter(p => p.type === type)
  }

  const getAvailableModelsForStage = (stage: string) => {
    const presetIds = STAGE_MODEL_MAPPING[stage] || []
    const presets = DEFAULT_MODEL_PRESETS.filter(p => presetIds.includes(p.id))
    const custom = modelConfigs.filter(m => m.type === getTypeForStage(stage))
    return [...presets, ...custom]
  }

  const getTypeForStage = (stage: string): 'text' | 'image' | 'video' | 'audio' => {
    const mapping: Record<string, 'text' | 'image' | 'video' | 'audio'> = {
      script: 'text',
      character: 'text',
      image: 'image',
      video: 'video',
      audio: 'audio',
    }
    return mapping[stage] || 'text'
  }

  const stageNames: Record<string, string> = {
    script: '文本/剧本',
    character: '文本/剧本',
    image: '图像生成',
    video: '视频生成',
    audio: '音频/配音',
  }

  type ModelType = 'text' | 'image' | 'video' | 'audio'

  const renderModelList = (modelType: ModelType) => {
    const modelsByType = getPresetsForType(modelType)
    const customModels = modelConfigs.filter(m => m.type === modelType)
    const currentModelId = Object.values(selectedModels).find(id => {
      const preset = DEFAULT_MODEL_PRESETS.find(p => p.id === id)
      return preset?.type === modelType
    })

    const allModels = [...modelsByType, ...customModels]

    return (
      <div className="space-y-6">
        {allModels.map((model) => {
          const preset = DEFAULT_MODEL_PRESETS.find(p => p.id === model.id)
          const isSelected = currentModelId === model.id
          const isRecommended = preset?.tags?.includes('官方推荐')

          return (
            <div
              key={model.id}
              className={`border rounded-lg p-4 transition-all ${
                isSelected
                  ? 'border-primary/50 bg-primary/5 ring-1 ring-primary'
                  : 'border-border hover:border-muted-foreground/50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{model.name}</h4>
                    {isRecommended && (
                      <Badge className="bg-orange-500/90 text-white hover:bg-orange-500">
                        <Zap className="h-3 w-3 mr-1" />
                        推荐
                      </Badge>
                    )}
                    {!preset && (
                      <Badge variant="outline" className="text-xs">自定义</Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground">{model.description}</p>
                  
                  {preset && preset.tags && (
                    <div className="flex gap-1 flex-wrap">
                      {preset.tags.filter(t => t !== '官方推荐').map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {preset?.defaultParameters && (
                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
                      <div className="flex items-center gap-1">
                        <CreditCard className="h-3 w-3" />
                        <span>按量计费</span>
                      </div>
                      {preset.defaultParameters.width && (
                        <span>{preset.defaultParameters.width}x{preset.defaultParameters.height}</span>
                      )}
                      {preset.defaultParameters.duration && (
                        <span>{preset.defaultParameters.duration}秒</span>
                      )}
                      {preset.defaultParameters.max_tokens && (
                        <span>Max {preset.defaultParameters.max_tokens} tokens</span>
                      )}
                      {preset.defaultParameters.steps && (
                        <span>{preset.defaultParameters.steps}步</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {isSelected ? (
                    <div className="px-4 py-2 bg-primary/10 text-primary rounded-md text-sm font-medium">
                      <Check className="h-4 w-4 mr-1 inline" />
                      当前使用
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => {
                        const stageKey = Object.keys(selectedModels).find(
                          key => getTypeForStage(key) === modelType
                        )
                        if (stageKey) {
                          handleSelectModel(stageKey, model.id)
                        }
                      }}
                    >
                      设为当前
                    </Button>
                  )}
                  {!preset && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteCustomModel(model.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )
        })}

        {allModels.length === 0 && (
          <div className="text-center py-12 border rounded-lg bg-muted/30">
            <p className="text-muted-foreground mb-4">暂无可用模型</p>
            <Button onClick={() => setShowCustomModel(true)}>
              <Plus className="h-4 w-4 mr-2" />
              添加自定义模型
            </Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">模型配置</h2>
        <p className="text-muted-foreground">为不同类型的任务选择和配置 AI 模型</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="text">文本模型</TabsTrigger>
          <TabsTrigger value="image">图像模型</TabsTrigger>
          <TabsTrigger value="video">视频模型</TabsTrigger>
          <TabsTrigger value="audio">音频模型</TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="space-y-6">
          {renderModelList('text')}
        </TabsContent>

        <TabsContent value="image" className="space-y-6">
          {renderModelList('image')}
        </TabsContent>

        <TabsContent value="video" className="space-y-6">
          {renderModelList('video')}
        </TabsContent>

        <TabsContent value="audio" className="space-y-6">
          {renderModelList('audio')}
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>自定义模型</CardTitle>
              <CardDescription>添加扣子平台上的自定义工作流</CardDescription>
            </div>
            <Button
              size="sm"
              onClick={() => setShowCustomModel(!showCustomModel)}
            >
              <Plus className="h-4 w-4 mr-2" />
              添加模型
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showCustomModel && (
            <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>模型类型</Label>
                  <select
                    value={newCustomModel.type}
                    onChange={(e) => setNewCustomModel(prev => ({ 
                      ...prev, 
                      type: e.target.value as any 
                    }))}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                  >
                    <option value="text">文本/剧本</option>
                    <option value="image">图像生成</option>
                    <option value="video">视频生成</option>
                    <option value="audio">音频/配音</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>模型名称</Label>
                  <Input
                    value={newCustomModel.name}
                    onChange={(e) => setNewCustomModel(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="例如：我的自定义模型"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>工作流 ID</Label>
                <Input
                  value={newCustomModel.workflowId}
                  onChange={(e) => setNewCustomModel(prev => ({ ...prev, workflowId: e.target.value }))}
                  placeholder="73664689170551*****"
                />
                <p className="text-xs text-muted-foreground">
                  在扣子工作流页面 URL 中获取 workflow_id
                </p>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSaveCustomModel} size="sm">保存模型</Button>
                <Button variant="outline" onClick={() => setShowCustomModel(false)} size="sm">取消</Button>
              </div>
            </div>
          )}

          {modelConfigs.length > 0 && (
            <div className="space-y-2 mt-4">
              <h4 className="text-sm font-medium">已添加的自定义模型</h4>
              {modelConfigs.map(model => (
                <div
                  key={model.id}
                  className="flex items-center justify-between border rounded-lg p-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{model.name}</span>
                      <Badge variant="outline" className="text-xs">{model.type}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      工作流 ID: {model.workflowId}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteCustomModel(model.id)}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API 配置</CardTitle>
          <CardDescription>配置扣子 API 访问凭证</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>API Token</Label>
            <Input
              type="password"
              value={apiToken}
              onChange={(e) => setApiToken(e.target.value)}
              placeholder="pat_*****************"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="useMock"
              checked={useMock}
              onChange={(e) => setUseMock(e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="useMock" className="text-sm">
              使用 Mock 演示模式（不实际调用 API）
            </label>
          </div>
          <Button onClick={handleSave}>保存配置</Button>
        </CardContent>
      </Card>
    </div>
  )
}
