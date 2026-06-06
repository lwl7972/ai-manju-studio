import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input, Textarea } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Upload, FileText, Plus, Loader2, ChevronRight, Play, Settings } from 'lucide-react'
import { getProject, saveProject } from '@/services/configService'
import { Episode } from '@/types/config'
import { getTemplate } from '@/services/promptTemplateService'
import { cozeService } from '@/services/coze'

export default function ScriptEditor() {
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('projectId')
  
  const [title, setTitle] = useState('')
  const [theme, setTheme] = useState('')
  const [description, setDescription] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [expandedEpisodes, setExpandedEpisodes] = useState<Set<string>>(new Set())
  const [project, setProject] = useState<any>(null)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // 加载项目数据
  useEffect(() => {
    if (projectId) {
      const loadedProject = getProject(projectId)
      if (loadedProject) {
        setProject(loadedProject)
        setTitle(loadedProject.title)
        setTheme(loadedProject.theme || '')
        setDescription(loadedProject.description || '')
        setEpisodes(loadedProject.episodes || [])
      }
    }
  }, [projectId])

  // 自动保存项目信息
  useEffect(() => {
    if (!projectId || !project) return

    const timer = setTimeout(() => {
      const updated = { ...project }
      updated.title = title
      updated.theme = theme
      updated.description = description
      updated.updatedAt = new Date().toISOString()
      saveProject(updated)
      setProject(updated)
      setLastSaved(new Date())
    }, 2000)

    return () => clearTimeout(timer)
  }, [title, theme, description, projectId])

  const handleGenerateEpisodes = async () => {
    if (!title.trim() || !projectId) return

    setIsGenerating(true)

    try {
      // 设置 token
      const token = localStorage.getItem('coze_token')
      if (!token) {
        alert('请先在设置中配置 Coze API Token')
        setIsGenerating(false)
        return
      }
      cozeService.setToken(token)

      // 获取大纲生成提示词模板
      const template = getTemplate('outline-generate')
      
      // 调用 AI 生成服务
      const result = await cozeService.executeWorkflow(
        'outline-workflow',
        {
          projectName: title,
          theme,
          description,
          episodeCount: 10,
        },
        false
      )

      // 解析生成的分集
      const newEpisodes: Episode[] = (result.data?.episodes || []).map((ep: any, index: number) => ({
        id: `ep_${Date.now()}_${index}`,
        episodeNumber: index + 1,
        title: ep.title || `第${index + 1}集`,
        summary: ep.summary || '',
        content: ep.content || '',
        status: 'completed' as const,
        assets: {
          characters: [],
          scenes: [],
          props: [],
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }))
      
      // 保存项目
      const updated = { ...project }
      updated.episodes = newEpisodes
      updated.updatedAt = new Date().toISOString()
      saveProject(updated)
      setProject(updated)
      setEpisodes(newEpisodes)
      setLastSaved(new Date())
    } catch (error) {
      console.error('生成分集失败:', error)
      alert('生成分集失败，请检查 API 配置')
    } finally {
      setIsGenerating(false)
    }
  }

  const toggleEpisode = (id: string) => {
    const newExpanded = new Set(expandedEpisodes)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedEpisodes(newExpanded)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">剧本编辑</h2>
          <p className="text-muted-foreground">故事与分镜管理</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            系统提示词
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            导入剧本
          </Button>
          <Button onClick={handleGenerateEpisodes} disabled={isGenerating || !title.trim()} size="sm">
            {isGenerating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            <Plus className="h-4 w-4 mr-2" />
            添加分集
          </Button>
        </div>
      </div>

      {lastSaved && (
        <div className="text-xs text-muted-foreground text-right">
          已保存于 {lastSaved.toLocaleTimeString()}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                剧本大纲
              </CardTitle>
              <CardDescription>编辑剧本基础信息</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">标题</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="请输入剧本标题"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">主题</label>
                <Input
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  placeholder="例如：都市修仙、玄幻奇幻、都市言情"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">简介</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="简要描述剧本故事梗概..."
                  className="min-h-[100px]"
                  readOnly={isGenerating}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                提取的资产
              </CardTitle>
              <CardDescription>从分集内容中提取的角色、场景、道具</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">先生成分集内容，然后点击"AI 提取资产"</p>
                <Button variant="link" className="mt-2" disabled={episodes.length === 0}>
                  AI 提取资产
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>分集列表 ({episodes.length}集)</CardTitle>
                  <CardDescription>先在左侧编辑剧本大纲，然后使用 AI 生成分集</CardDescription>
                </div>
                <Button variant="ghost" size="sm" disabled={episodes.length === 0}>
                  展开全部
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {episodes.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>暂无分集</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {episodes.map((episode, index) => (
                    <div
                      key={episode.id}
                      className="border rounded-lg overflow-hidden"
                    >
                      <div
                        className="flex items-center justify-between p-4 bg-muted/30 cursor-pointer hover:bg-muted/50"
                        onClick={() => toggleEpisode(episode.id)}
                      >
                        <div className="flex items-center gap-3">
                          <ChevronRight
                            className={`h-4 w-4 transition-transform ${
                              expandedEpisodes.has(episode.id) ? 'rotate-90' : ''
                            }`}
                          />
                          <div>
                            <h4 className="font-medium">
                              第{index + 1}集：{episode.title}
                            </h4>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {episode.summary}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={
                            episode.status === 'completed'
                              ? 'default'
                              : episode.status === 'generating'
                              ? 'secondary'
                              : 'outline'
                          }
                        >
                          {episode.status === 'completed'
                            ? '已完成'
                            : episode.status === 'generating'
                            ? '生成中'
                            : '待生成'}
                        </Badge>
                      </div>
                      {expandedEpisodes.has(episode.id) && (
                        <div className="p-4 border-t space-y-3">
                          <p className="text-sm text-muted-foreground">{episode.summary}</p>
                          {episode.content && (
                            <div>
                              <label className="text-sm font-medium mb-2 block">分集内容</label>
                              <Textarea
                                value={episode.content}
                                readOnly
                                className="min-h-[150px] font-mono text-sm"
                              />
                            </div>
                          )}
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Play className="h-3 w-3 mr-1" />
                              生成资产
                            </Button>
                            <Button size="sm" variant="outline">
                              编辑
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
