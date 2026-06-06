import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Palette, Move, Zap, Monitor, Clock } from 'lucide-react'

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

export default function VideoSettings() {
  const [selectedStyle, setSelectedStyle] = useState('3d-fantasy')
  const [selectedAspectRatio, setSelectedAspectRatio] = useState('16:9')
  const [selectedQuality, setSelectedQuality] = useState('high')
  const [selectedPlatform, setSelectedPlatform] = useState('douyin')
  const [duration, setDuration] = useState(60)

  useEffect(() => {
    const saved = localStorage.getItem('video_settings')
    if (saved) {
      const settings = JSON.parse(saved)
      setSelectedStyle(settings.style || '3d-fantasy')
      setSelectedAspectRatio(settings.aspectRatio || '16:9')
      setSelectedQuality(settings.quality || 'high')
      setSelectedPlatform(settings.platform || 'douyin')
      setDuration(settings.duration || 60)
    }
  }, [])

  const handleSave = () => {
    const settings = {
      style: selectedStyle,
      aspectRatio: selectedAspectRatio,
      quality: selectedQuality,
      platform: selectedPlatform,
      duration,
    }
    localStorage.setItem('video_settings', JSON.stringify(settings))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">视频设置</h2>
          <p className="text-muted-foreground">配置全局视频参数，这些设置将应用到所有生成的提示词中</p>
        </div>
        <Button onClick={handleSave}>保存设置</Button>
      </div>

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
                variant={selectedStyle === preset.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedStyle(preset.id)}
              >
                {preset.label}
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
                variant={selectedAspectRatio === ratio.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedAspectRatio(ratio.id)}
              >
                {ratio.label}
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
                variant={selectedQuality === level.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedQuality(level.id)}
              >
                {level.label}
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
                variant={selectedPlatform === platform.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPlatform(platform.id)}
              >
                {platform.label}
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
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm font-medium w-20 text-right">{duration}秒</span>
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
            {`风格：${STYLE_PRESETS.find(p => p.id === selectedStyle)?.label} | `}
            {`比例：${selectedAspectRatio} | `}
            {`质量：${QUALITY_LEVELS.find(l => l.id === selectedQuality)?.label} | `}
            {`平台：${PLATFORMS.find(p => p.id === selectedPlatform)?.label} | `}
            {`时长：${duration}秒`}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
