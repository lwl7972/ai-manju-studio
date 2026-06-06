import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { FileText, Download, Copy, Play, Loader2 } from 'lucide-react'
import { getProject, getDefaultParams } from '@/services/configService'
import { Episode } from '@/types/config'
import { promptAssemblyEngine, PromptAssemblyInput } from '@/services/promptAssembly'

export default function StoryboardScript() {
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('projectId')
  
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null)
  const [project, setProject] = useState<any>(null)
  const [params, setParams] = useState({
    style: '',
    aspectRatio: '',
    quality: '',
    platform: '',
    duration: 60,
  })
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // 加载项目数据
  useEffect(() => {
    if (projectId) {
      const loadedProject = getProject(projectId)
      if (loadedProject) {
        setProject(loadedProject)
        
        // 获取第一个未完成的分集或最后一个分集
        const episodes = loadedProject.episodes || []
        if (episodes.length > 0) {
          const pending = episodes.find((ep: Episode) => ep.status === 'pending')
          setSelectedEpisode(pending || episodes[episodes.length - 1])
        }
        
        // 加载参数（项目覆盖 + 全局默认）
        const defaultParams = getDefaultParams()
        setParams({
          style: loadedProject.paramsOverride?.style || defaultParams.style,
          aspectRatio: loadedProject.paramsOverride?.aspectRatio || defaultParams.aspectRatio,
          quality: loadedProject.paramsOverride?.quality || defaultParams.quality,
          platform: loadedProject.paramsOverride?.platform || defaultParams.platform,
          duration: loadedProject.paramsOverride?.duration || defaultParams.duration,
        })
      }
    }
  }, [projectId])

  const handleGeneratePrompt = async () => {
    if (!selectedEpisode || !project) {
      alert('请选择一个分集')
      return
    }

    setIsGenerating(true)

    try {
      // 准备输入数据
      const input: PromptAssemblyInput = {
        projectName: project.title,
        episodeTitle: selectedEpisode.title,
        episodeNumber: selectedEpisode.episodeNumber,
        style: params.style,
        aspectRatio: params.aspectRatio,
        quality: params.quality,
        platform: params.platform,
        duration: params.duration,
        episodeContent: selectedEpisode.content || selectedEpisode.summary,
        characters: project.assets?.characters || [],
        scenes: project.assets?.scenes || [],
        props: project.assets?.props || [],
      }

      // 调用提示词拼装引擎
      const assembledPrompt = await promptAssemblyEngine.assemble(input)
      
      setPrompt(assembledPrompt)
      setLastSaved(new Date())
    } catch (error) {
      console.error('生成提示词失败:', error)
      alert('生成提示词失败')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt)
    alert('已复制到剪贴板')
  }

  const handleExport = () => {
    const blob = new Blob([prompt], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `分镜提示词-${project?.title}-${selectedEpisode?.episodeNumber}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">分镜脚本</h2>
          <p className="text-muted-foreground">提示词编辑与导出</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCopy} disabled={!prompt}>
            <Copy className="h-4 w-4 mr-2" />
            复制
          </Button>
          <Button variant="outline" onClick={handleExport} disabled={!prompt}>
            <Download className="h-4 w-4 mr-2" />
            导出
          </Button>
        </div>
      </div>

      {lastSaved && (
        <div className="text-xs text-muted-foreground text-right">
          已保存于 {lastSaved.toLocaleTimeString()}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>选择分集</CardTitle>
              <CardDescription>要生成提示词的分集</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {project?.episodes?.length === 0 ? (
                <p className="text-sm text-muted-foreground">暂无分集</p>
              ) : (
                project?.episodes?.map((ep: Episode) => (
                  <Button
                    key={ep.id}
                    variant={selectedEpisode?.id === ep.id ? 'default' : 'ghost'}
                    className="w-full justify-start text-sm"
                    onClick={() => setSelectedEpisode(ep)}
                  >
                    第{ep.episodeNumber}集：{ep.title}
                  </Button>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>当前项目参数</CardTitle>
              <CardDescription>继承自视频设置和项目配置</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">风格：</span>
                <span>{params.style || '未设置'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">比例：</span>
                <span>{params.aspectRatio || '未设置'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">质量：</span>
                <span>{params.quality || '未设置'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">平台：</span>
                <span>{params.platform || '未设置'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">时长：</span>
                <span>{params.duration}秒</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>当前资产</CardTitle>
              <CardDescription>本分集使用的角色和场景</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-xs text-muted-foreground mb-2">角色：</div>
              <div className="flex flex-wrap gap-1">
                {project?.assets?.characters?.length === 0 ? (
                  <span className="text-xs text-muted-foreground">暂无角色</span>
                ) : (
                  project?.assets?.characters?.map((c: any) => (
                    <Badge key={c.id} variant="outline">{c.name}</Badge>
                  ))
                )}
              </div>
              <div className="text-xs text-muted-foreground mt-2 mb-2">场景：</div>
              <div className="flex flex-wrap gap-1">
                {project?.assets?.scenes?.length === 0 ? (
                  <span className="text-xs text-muted-foreground">暂无场景</span>
                ) : (
                  project?.assets?.scenes?.map((s: any) => (
                    <Badge key={s.id} variant="outline">{s.name}</Badge>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Button 
            className="w-full" 
            onClick={handleGeneratePrompt} 
            disabled={isGenerating || !selectedEpisode}
          >
            {isGenerating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            <Play className="h-4 w-4 mr-2" />
            生成提示词
          </Button>
        </div>

        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  <CardTitle>分镜提示词</CardTitle>
                </div>
                <CardDescription>编辑并导出分镜提示词</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder='选择左侧的分集，然后点击"生成提示词"按钮，系统将自动组合系统提示词、项目参数、分集内容和资产信息，生成分镜提示词...'
                className="min-h-[500px] font-mono text-sm"
                readOnly={isGenerating}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
