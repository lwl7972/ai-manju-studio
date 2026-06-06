import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input, Textarea } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Upload, FileText, Plus, Loader2, ChevronRight, Play } from 'lucide-react'

interface Episode {
  id: string
  episodeNumber: number
  title: string
  summary: string
  status: 'pending' | 'generating' | 'completed' | 'failed'
}

export default function ScriptEditor() {
  const [title, setTitle] = useState('')
  const [theme, setTheme] = useState('')
  const [description, setDescription] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [expandedEpisodes, setExpandedEpisodes] = useState<Set<string>>(new Set())

  const handleGenerateEpisodes = async () => {
    if (!title.trim()) return

    setIsGenerating(true)
    // TODO: 调用 AI 生成分集 API
    // 暂时模拟生成 3 集
    const newEpisodes: Episode[] = [
      {
        id: '1',
        episodeNumber: 1,
        title: '第一章：初遇',
        summary: '主角意外获得上古传承，开始踏上修仙之路...',
        status: 'completed',
      },
      {
        id: '2',
        episodeNumber: 2,
        title: '第二章：危机',
        summary: '遭遇敌对势力追杀，主角在生死关头突破境界...',
        status: 'pending',
      },
      {
        id: '3',
        episodeNumber: 3,
        title: '第三章：反击',
        summary: '主角掌握新能力，开始反击敌人...',
        status: 'pending',
      },
    ]
    setEpisodes(newEpisodes)
    setIsGenerating(false)
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
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            导入剧本
          </Button>
          <Button onClick={handleGenerateEpisodes} disabled={isGenerating || !title.trim()}>
            {isGenerating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            <Plus className="h-4 w-4 mr-2" />
            添加分集
          </Button>
        </div>
      </div>

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
                <p className="text-sm">点击"AI 提取资产"分析分集内容</p>
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
                <Button variant="ghost" size="sm">
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
                  {episodes.map((episode) => (
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
                              第{episode.episodeNumber}集：{episode.title}
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
                          <div className="flex gap-2">
                            <Button size="sm">
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
