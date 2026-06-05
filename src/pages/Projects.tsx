import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/input'
import { FolderOpen, Plus, MoreHorizontal, Clock } from 'lucide-react'

interface Project {
  id: string
  name: string
  description: string
  updatedAt: string
  stage: string
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: '都市修仙传',
      description: '现代都市中的修仙故事，主角意外获得上古传承...',
      updatedAt: '2026-06-05',
      stage: '视频生成',
    },
    {
      id: '2',
      name: '星际迷航',
      description: '人类首次远征银河系，探索未知文明的冒险旅程...',
      updatedAt: '2026-06-04',
      stage: '角色设定',
    },
  ])

  const [showNewProject, setShowNewProject] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [newProjectDesc, setNewProjectDesc] = useState('')

  const handleCreateProject = () => {
    if (!newProjectName.trim()) return

    const newProject: Project = {
      id: Date.now().toString(),
      name: newProjectName,
      description: newProjectDesc,
      updatedAt: new Date().toISOString().split('T')[0],
      stage: '未开始',
    }

    setProjects([newProject, ...projects])
    setShowNewProject(false)
    setNewProjectName('')
    setNewProjectDesc('')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">项目管理</h2>
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
              <label className="text-sm font-medium mb-2 block">项目名称</label>
              <Input
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="请输入项目名称"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">项目描述</label>
              <Textarea
                value={newProjectDesc}
                onChange={(e) => setNewProjectDesc(e.target.value)}
                placeholder="简要描述项目内容"
                className="min-h-[100px]"
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <FolderOpen className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription className="line-clamp-2">
                {project.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>更新于 {project.updatedAt}</span>
                </div>
                <span className="px-2 py-1 bg-muted rounded-full text-xs">
                  {project.stage}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">暂无项目</h3>
          <p className="text-muted-foreground mb-4">创建您的第一个 AI 漫剧项目</p>
          <Button onClick={() => setShowNewProject(true)}>
            <Plus className="h-4 w-4 mr-2" />
            新建项目
          </Button>
        </div>
      )}
    </div>
  )
}
