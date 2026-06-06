import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { RefreshCw, Download, CheckCircle, AlertCircle } from 'lucide-react'
import type { ElectronAPI } from '@/types/electron'

export function UpdateChecker() {
  const [checking, setChecking] = useState(false)
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [updateDownloaded, setUpdateDownloaded] = useState(false)
  const [currentVersion, setCurrentVersion] = useState('')
  const [newVersion, setNewVersion] = useState('')
  const [updateError, setUpdateError] = useState<string | null>(null)

  useEffect(() => {
    const electronAPI = window.electronAPI as ElectronAPI | undefined
    if (!electronAPI) return

    const currentVer = electronAPI.version || '0.1.0'
    setCurrentVersion(currentVer)

    // 监听更新事件
    electronAPI.onUpdateChecking(() => {
      setChecking(true)
      setUpdateError(null)
    })

    electronAPI.onUpdateAvailable((info: any) => {
      setChecking(false)
      setUpdateAvailable(true)
      setNewVersion(info.version)
      setUpdateError(null)
    })

    electronAPI.onUpdateNotAvailable(() => {
      setChecking(false)
      setUpdateAvailable(false)
      setUpdateError(null)
    })

    electronAPI.onUpdateDownloaded((info: any) => {
      setChecking(false)
      setUpdateDownloaded(true)
      setNewVersion(info.version)
    })

    electronAPI.onUpdateError((error: string) => {
      setChecking(false)
      setUpdateError(error)
    })
  }, [])

  const handleCheckUpdate = async () => {
    const electronAPI = window.electronAPI as ElectronAPI | undefined
    if (!electronAPI) return
    setUpdateError(null)
    setUpdateDownloaded(false)
    try {
      await electronAPI.checkForUpdates()
    } catch (err) {
      console.error('Check update failed:', err)
      setUpdateError('检查更新失败')
    }
  }

  const handleRestart = () => {
    const electronAPI = window.electronAPI as ElectronAPI | undefined
    if (!electronAPI) return
    electronAPI.quitAndInstall()
  }

  // 在非 Electron 环境中不显示
  const electronAPI = window.electronAPI as ElectronAPI | undefined
  if (!electronAPI) {
    return null
  }

  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline" className="text-xs">
        v{currentVersion}
      </Badge>
      
      {updateDownloaded ? (
        <Button
          size="sm"
          variant="default"
          onClick={handleRestart}
          className="h-7 gap-1 bg-green-600 hover:bg-green-700"
        >
          <CheckCircle className="w-3 h-3" />
          重启安装
        </Button>
      ) : updateAvailable ? (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
            <Download className="w-3 h-3 mr-1" />
            v{newVersion} 下载中...
          </Badge>
        </div>
      ) : updateError ? (
        <div className="flex items-center gap-2" title={updateError}>
          <AlertCircle className="w-4 h-4 text-yellow-500" />
          <span className="text-xs text-yellow-600">更新失败</span>
        </div>
      ) : (
        <Button
          size="sm"
          variant="ghost"
          onClick={handleCheckUpdate}
          disabled={checking}
          className="h-7 gap-1"
        >
          <RefreshCw className={`w-3 h-3 ${checking ? 'animate-spin' : ''}`} />
          {checking ? '检查中...' : '检查更新'}
        </Button>
      )}
    </div>
  )
}
