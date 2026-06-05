import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Home, FolderOpen, Settings as SettingsIcon } from 'lucide-react'
import { UpdateChecker } from '@/components/UpdateChecker'

export default function Navbar() {
  const location = useLocation()

  const navItems = [
    { path: '/workspace', label: '工作台', icon: Home },
    { path: '/projects', label: '项目管理', icon: FolderOpen },
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
