import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FolderOpen, Plus, MoreHorizontal, Clock, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { createProject, loadProjects, Project } from '@/services/configService'

export default function ProjectSelector() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState<Project[]>([])
  const [showNewProject, setShowNewProject] = useState(false)
  const [newProjectTitle, setNewProjectTitle] = useState('')
  const [newProjectTag, setNewProjectTag] = useState('')
  const [newProjectTheme, setNewProjectTheme] = useState('')
  const [newProjectDescription, setNewProjectDescription] = useState('')

  useEffect(() => {
    const loaded = loadProjects()
    setProjects(loaded)
  }, [])

  const handleCreateProject = () => {
    if (!newProjectTitle.trim()) return

    const project = createProject({
      title: newProjectTitle,
      tag: newProjectTag,
      theme: newProjectTheme,
      description: newProjectDescription,
    })

    setProjects([project, ...projects])
    setShowNewProject(false)
    setNewProjectTitle('')
    setNewProjectTag('')
    setNewProjectTheme('')
    setNewProjectDescription('')
    
    // 进入项目的工作台
    navigate(`/workspace/video-settings?projectId=${project.id}`)
  }

  const handleOpenProject = (projectId: string) => {
    navigate(`/workspace/video-settings?projectId=${projectId}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">项目列表</h2>
          <p className="text-muted-foreground">管理您的 AI 漫剧创作项目</p>
        </div>
        <Button onClick={() => setShowNewProject(!showNewProject)}>
          <Plus className="h-4 w-4 mr-2" />
          新建项目
        </Button>
      </div>

      {showNewProject && (
        <Card>
          <CardHeader>
            <CardTitle>创建新项目</CardTitle>
            <CardDescription>填写项目基本信息</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>项目名称</Label>
              <Input
                value={newProjectTitle}
                onChange={(e) => setNewProjectTitle(e.target.value)}
                placeholder="请输入项目名称"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>标签</Label>
                <Input
                  value={newProjectTag}
                  onChange={(e) => setNewProjectTag(e.target.value)}
                  placeholder="例如：古风、都市、玄幻"
                />
              </div>
              <div>
                <Label>主题</Label>
                <Input
                  value={newProjectTheme}
                  onChange={(e) => setNewProjectTheme(e.target.value)}
                  placeholder="例如：修仙、言情、悬疑"
                />
              </div>
            </div>
            <div>
              <Label>简介</Label>
              <Input
                value={newProjectDescription}
                onChange={(e) => setNewProjectDescription(e.target.value)}
                placeholder="简要描述项目内容"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreateProject}>创建项目</Button>
              <Button variant="outline" onClick={() => setShowNewProject(false)}>
                取消
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">暂无项目</h3>
          <p className="text-muted-foreground mb-4">创建您的第一个 AI 漫剧项目</p>
          <Button onClick={() => setShowNewProject(true)}>
            <Plus className="h-4 w-4 mr-2" />
            新建项目
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleOpenProject(project.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation()
                      // TODO: 删除项目
                    }}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
                {project.tag && (
                  <Badge variant="secondary" className="w-fit">
                    {project.tag}
                  </Badge>
                )}
                {project.description && (
                  <CardDescription className="line-clamp-2">
                    {project.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>更新于 {new Date(project.updatedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1 text-primary">
                    <span>打开</span>
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
