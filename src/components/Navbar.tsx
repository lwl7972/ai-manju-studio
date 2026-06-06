import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Home, FolderOpen, Settings as SettingsIcon, ArrowLeft, FileText, Save, Download, LogOut, User } from 'lucide-react'
import { UpdateChecker } from '@/components/UpdateChecker'
import { useState } from 'react'
import PromptTemplateManager from '@/components/PromptTemplateManager'

export default function Navbar() {
  const location = useLocation()
  const [currentProject, setCurrentProject] = useState('都市修仙传')
  const [projectTag, setProjectTag] = useState('古风')
  const [showTemplateManager, setShowTemplateManager] = useState(false)

  const isInWorkspace = location.pathname.startsWith('/workspace')
  const isProjectDetail = isInWorkspace && location.pathname !== '/workspace' && location.pathname !== '/workspace/'

  const workflowSteps = [
    { path: '/workspace/video-settings', label: '视频设置', description: '全局参数配置' },
    { path: '/workspace/script-editor', label: '剧本编辑', description: '故事与分镜管理' },
    { path: '/workspace/asset-library', label: '资产库', description: '角色场景道具' },
    { path: '/workspace/storyboard-script', label: '分镜脚本', description: '提示词编辑导出' },
  ]

  const currentStepIndex = workflowSteps.findIndex(step => location.pathname === step.path)

  if (isProjectDetail) {
    return (
      <header className="border-b bg-card">
        <div className="container mx-auto px-4">
          <div className="flex h-14 items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/projects">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div>
                <h1 className="text-lg font-bold">{currentProject}</h1>
                <Badge variant="secondary" className="text-xs">{projectTag}</Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowTemplateManager(true)}>
                <FileText className="h-4 w-4 mr-2" />
                提示词
              </Button>
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4 mr-2" />
                myb***com
              </Button>
              <Button variant="ghost" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                退出
              </Button>
              <Button variant="outline" size="sm">
                <Save className="h-4 w-4 mr-2" />
                保存
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                导出项目
              </Button>
              <UpdateChecker />
            </div>
          </div>

          <div className="flex items-center gap-2 pb-4">
            {workflowSteps.map((step, index) => {
              const isActive = index === currentStepIndex
              const isCompleted = index < currentStepIndex

              return (
                <div key={step.path} className="flex items-center">
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    size="sm"
                    asChild
                    className="h-auto py-2 px-3 flex flex-col items-start"
                  >
                    <Link to={step.path}>
                      <div className="font-medium">{step.label}</div>
                      <div className="text-xs text-muted-foreground">{step.description}</div>
                    </Link>
                  </Button>
                  {index < workflowSteps.length - 1 && (
                    <div className={`w-8 h-0.5 mx-1 ${isCompleted ? 'bg-primary' : 'bg-muted'}`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
    </header>
  )
}

if (isProjectDetail) {
  return (
    <>
      <header className="border-b bg-card">
        <div className="container mx-auto px-4">
          <div className="flex h-14 items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/projects">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div>
                <h1 className="text-lg font-bold">{currentProject}</h1>
                <Badge variant="secondary" className="text-xs">{projectTag}</Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowTemplateManager(true)}>
                <FileText className="h-4 w-4 mr-2" />
                提示词
              </Button>
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4 mr-2" />
                myb***com
              </Button>
              <Button variant="ghost" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                退出
              </Button>
              <Button variant="outline" size="sm">
                <Save className="h-4 w-4 mr-2" />
                保存
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                导出项目
              </Button>
              <UpdateChecker />
            </div>
          </div>

          <div className="flex items-center gap-2 pb-4">
            {workflowSteps.map((step, index) => {
              const isActive = index === currentStepIndex
              const isCompleted = index < currentStepIndex

              return (
                <div key={step.path} className="flex items-center">
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    size="sm"
                    asChild
                    className="h-auto py-2 px-3 flex flex-col items-start"
                  >
                    <Link to={step.path}>
                      <div className="font-medium">{step.label}</div>
                      <div className="text-xs text-muted-foreground">{step.description}</div>
                    </Link>
                  </Button>
                  {index < workflowSteps.length - 1 && (
                    <div className={`w-8 h-0.5 mx-1 ${isCompleted ? 'bg-primary' : 'bg-muted'}`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </header>
      {showTemplateManager && <PromptTemplateManager onClose={() => setShowTemplateManager(false)} />}
    </>
  )
}

  const navItems = [
    { path: '/projects', label: '项目列表', icon: FolderOpen },
    { path: '/workspace', label: '工作台', icon: Home },
    { path: '/settings', label: '设置', icon: SettingsIcon },
  ]

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-lg font-bold text-foreground">AI 漫剧工作室</h1>
            <nav className="flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path

                return (
                  <Button
                    key={item.path}
                    variant={isActive ? 'secondary' : 'ghost'}
                    size="sm"
                    asChild
                  >
                    <Link to={item.path} className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{item.label}</span>
                    </Link>
                  </Button>
                )
              })}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <UpdateChecker />
          </div>
        </div>
      </div>
    </header>
  )
}
