import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Palette, Move, Zap, Monitor, Clock, Save, RotateCcw } from 'lucide-react'
import { getDefaultParams, setDefaultParams, getProject, saveProject } from '@/services/configService'

const STYLE_PRESETS = [
  { id: 'realistic', label: '真人写实' },
  { id: '3d-fantasy', label: '3D 玄幻' },
  { id: 'ancient', label: '真人古装' },
  { id: '2d-anime', label: '2D 动画' },
  { id: '2d-movie', label: '2D 电影' },
  { id: 'hollywood', label: '好莱坞大片' },
  { id: '2d-cartoon', label: '2D 卡通动画' },
  { id: 'cyberpunk', label: '赛博朋克' },
]

const ASPECT_RATIOS = [
  { id: '16:9', label: '16:9' },
  { id: '9:16', label: '9:16' },
  { id: '1:1', label: '1:1' },
  { id: '21:9', label: '21:9' },
]

const QUALITY_LEVELS = [
  { id: 'standard', label: '标准' },
  { id: 'high', label: '高' },
  { id: 'ultra', label: '超高' },
]

const PLATFORMS = [
  { id: 'douyin', label: '抖音' },
  { id: 'kuaishou', label: '快手' },
  { id: 'bilibili', label: 'B 站' },
  { id: 'xiaohongshu', label: '小红书' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'other', label: '其他' },
]

interface VideoSettingsState {
  style: string
  aspectRatio: string
  quality: string
  platform: string
  duration: number
}

export default function VideoSettings() {
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('projectId')
  
  const [isProjectMode, setIsProjectMode] = useState(false)
  const [globalParams, setGlobalParams] = useState<VideoSettingsState>({
    style: '3d-fantasy',
    aspectRatio: '16:9',
    quality: 'high',
    platform: 'douyin',
    duration: 60,
  })
  const [projectOverrides, setProjectOverrides] = useState<Partial<VideoSettingsState>>({})
  const [useProjectOverrides, setUseProjectOverrides] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // 加载全局默认参数
  useEffect(() => {
    const defaults = getDefaultParams()
    setGlobalParams({
      style: defaults.style,
      aspectRatio: defaults.aspectRatio,
      quality: defaults.quality,
      platform: defaults.platform,
      duration: defaults.duration,
    })
  }, [])

  // 检测是否是项目模式，并加载项目覆盖参数
  useEffect(() => {
    if (projectId) {
      setIsProjectMode(true)
      const project = getProject(projectId)
      if (project?.paramsOverride) {
        setProjectOverrides({
          style: project.paramsOverride.style,
          aspectRatio: project.paramsOverride.aspectRatio,
          quality: project.paramsOverride.quality,
          platform: project.paramsOverride.platform,
          duration: project.paramsOverride.duration,
        })
        // 如果项目已经有覆盖参数，则使用覆盖模式
        if (Object.keys(project.paramsOverride).length > 0) {
          setUseProjectOverrides(true)
        }
      }
    }
  }, [projectId])

  // 获取当前有效值（项目优先，全局兜底）
  const getCurrentValues = (): VideoSettingsState => {
    if (isProjectMode && useProjectOverrides) {
      return {
        ...globalParams,
        ...projectOverrides,
      }
    }
    return globalParams
  }

  const currentValues = getCurrentValues()

  // 自动保存
  useEffect(() => {
    if (!hasUnsavedChanges) return

    const timer = setTimeout(() => {
      handleSave()
    }, 2000)

    return () => clearTimeout(timer)
  }, [currentValues, hasUnsavedChanges])

  const updateParam = (key: keyof VideoSettingsState, value: any) => {
    if (isProjectMode && useProjectOverrides) {
      setProjectOverrides(prev => ({ ...prev, [key]: value }))
    } else {
      setGlobalParams(prev => ({ ...prev, [key]: value }))
    }
    setHasUnsavedChanges(true)
    setLastSaved(null)
  }

  const handleSave = () => {
    if (isProjectMode && useProjectOverrides && projectId) {
      // 保存项目覆盖参数
      const project = getProject(projectId)
      if (project) {
        project.paramsOverride = projectOverrides
        project.updatedAt = new Date().toISOString()
        saveProject(project)
      }
    } else if (!isProjectMode) {
      // 保存全局默认参数
      setDefaultParams({
        style: globalParams.style,
        aspectRatio: globalParams.aspectRatio,
        quality: globalParams.quality,
        platform: globalParams.platform,
        duration: globalParams.duration,
      })
    }
    
    setHasUnsavedChanges(false)
    setLastSaved(new Date())
  }

  const handleResetOverrides = () => {
    if (confirm('确定要清除项目覆盖参数并恢复到全局默认值吗？')) {
      setProjectOverrides({})
      setUseProjectOverrides(false)
      
      if (projectId) {
        const project = getProject(projectId)
        if (project) {
          project.paramsOverride = {}
          project.updatedAt = new Date().toISOString()
          saveProject(project)
        }
      }
      
      setHasUnsavedChanges(false)
      setLastSaved(new Date())
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">视频设置</h2>
          <p className="text-muted-foreground">
            {isProjectMode
              ? useProjectOverrides
                ? '当前使用项目级参数覆盖（项目优先）'
                : '当前使用全局默认参数'
              : '配置全局视频参数，这些设置将应用到所有生成的提示词中'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isProjectMode && (
            <>
              <Button
                variant={useProjectOverrides ? 'default' : 'outline'}
                size="sm"
                onClick={() => setUseProjectOverrides(!useProjectOverrides)}
              >
                {useProjectOverrides ? '项目参数模式' : '全局参数模式'}
              </Button>
              {useProjectOverrides && (
                <Button variant="outline" size="sm" onClick={handleResetOverrides}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  清除覆盖
                </Button>
              )}
            </>
          )}
          <Button onClick={handleSave} disabled={!hasUnsavedChanges} size="sm">
            <Save className="h-4 w-4 mr-2" />
            保存
          </Button>
        </div>
      </div>

      {lastSaved && (
        <div className="text-xs text-muted-foreground text-right">
          已保存于 {lastSaved.toLocaleTimeString()}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            画面风格
          </CardTitle>
          <CardDescription>选择视频的整体视觉风格</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {STYLE_PRESETS.map((preset) => (
              <Button
                key={preset.id}
                variant={currentValues.style === preset.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateParam('style', preset.id)}
              >
                {preset.label}
                {isProjectMode && useProjectOverrides && projectOverrides.style === preset.id && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    覆盖
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Move className="h-5 w-5" />
            画面比例
          </CardTitle>
          <CardDescription>选择视频输出的画面比例</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {ASPECT_RATIOS.map((ratio) => (
              <Button
                key={ratio.id}
                variant={currentValues.aspectRatio === ratio.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateParam('aspectRatio', ratio.id)}
              >
                {ratio.label}
                {isProjectMode && useProjectOverrides && projectOverrides.aspectRatio === ratio.id && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    覆盖
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            质量
          </CardTitle>
          <CardDescription>选择生成视频的质量等级</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {QUALITY_LEVELS.map((level) => (
              <Button
                key={level.id}
                variant={currentValues.quality === level.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateParam('quality', level.id)}
              >
                {level.label}
                {isProjectMode && useProjectOverrides && projectOverrides.quality === level.id && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    覆盖
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            平台
          </CardTitle>
          <CardDescription>选择目标发布平台</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map((platform) => (
              <Button
                key={platform.id}
                variant={currentValues.platform === platform.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateParam('platform', platform.id)}
              >
                {platform.label}
                {isProjectMode && useProjectOverrides && projectOverrides.platform === platform.id && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    覆盖
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            时长
          </CardTitle>
          <CardDescription>设置视频总时长（秒）</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="10"
              max="300"
              step="10"
              value={currentValues.duration}
              onChange={(e) => updateParam('duration', Number(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm font-medium w-20 text-right">
              {currentValues.duration}秒
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>关键词预览</CardTitle>
          <CardDescription>根据当前设置自动拼装的关键词预览</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-muted rounded-lg font-mono text-sm">
            {`风格：${STYLE_PRESETS.find(p => p.id === currentValues.style)?.label} | `}
            {`比例：${currentValues.aspectRatio} | `}
            {`质量：${QUALITY_LEVELS.find(l => l.id === currentValues.quality)?.label} | `}
            {`平台：${PLATFORMS.find(p => p.id === currentValues.platform)?.label} | `}
            {`时长：${currentValues.duration}秒`}
          </div>
          {isProjectMode && useProjectOverrides && (
            <div className="mt-2 text-xs text-primary">
              ✓ 已应用项目级参数覆盖
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
