import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import pkg from 'electron-updater'
const { autoUpdater } = pkg

const __dirname = path.dirname(fileURLToPath(import.meta.url))

let mainWindow: BrowserWindow | null = null

// 配置自动更新
autoUpdater.autoDownload = true
autoUpdater.autoInstallOnAppQuit = true

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    titleBarStyle: 'hiddenInset',
    show: false,
  })

  const devServerUrl = process.env.VITE_DEV_SERVER_URL

  if (devServerUrl) {
    mainWindow.loadURL(devServerUrl)
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show()
    
    // 启动后检查更新
    setTimeout(() => {
      autoUpdater.checkForUpdates()
    }, 1000)
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // 事件监听
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow?.webContents.send('update-available', {
      version: app.getVersion()
    })
  })
}

app.whenReady().then(() => {
  createWindow()

  // 更新日志事件
  autoUpdater.on('error', (err) => {
    console.error('Update error:', err)
    mainWindow?.webContents.send('update-error', err.message)
  })

  autoUpdater.on('checking-for-update', () => {
    console.log('Checking for updates...')
    mainWindow?.webContents.send('update-checking', null)
  })

  autoUpdater.on('update-available', (info) => {
    console.log('Update available:', info.version)
    mainWindow?.webContents.send('update-available', info)
    dialog.showMessageBox(mainWindow!, {
      type: 'info',
      title: '发现新版本',
      message: `发现新版本 ${info.version}，正在自动下载...`,
      buttons: ['确定'],
    })
  })

  autoUpdater.on('update-not-available', () => {
    console.log('Update not available')
    mainWindow?.webContents.send('update-not-available', null)
  })

  autoUpdater.on('update-downloaded', (info) => {
    console.log('Update downloaded:', info.version)
    mainWindow?.webContents.send('update-downloaded', info)
    dialog.showMessageBox(mainWindow!, {
      type: 'question',
      title: '更新已准备就绪',
      message: `新版本 ${info.version} 已下载完成，是否现在重启安装？`,
      buttons: ['稍后', '现在重启'],
      defaultId: 1,
    }).then((result) => {
      if (result.response === 1) {
        autoUpdater.quitAndInstall()
      }
    })
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// IPC 处理器 - 手动检查更新
ipcMain.handle('check-for-updates', () => {
  return autoUpdater.checkForUpdates()
})

// IPC 处理器 - 重启并安装更新
ipcMain.handle('quit-and-install', () => {
  ;(app as any).isQuiting = true
  autoUpdater.quitAndInstall()
})

ipcMain.handle('coze:execute-workflow', async (event, params) => {
  const { workflowId, parameters, token, isAsync } = params

  try {
    const response = await fetch('https://api.coze.cn/v1/workflow/run', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        workflow_id: workflowId,
        parameters: parameters,
        is_async: isAsync || false,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Coze API error: ${response.status} - ${error}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Workflow execution failed:', error)
    throw error
  }
})

ipcMain.handle('coze:query-async-result', async (event, params) => {
  const { executeId, token } = params

  try {
    const response = await fetch(`https://api.coze.cn/v1/workflow/async_result?execute_id=${executeId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Coze API error: ${response.status} - ${error}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Query async result failed:', error)
    throw error
  }
})

// ==================== 导出功能 ====================

// 获取或创建项目输出目录
function getProjectOutputDir(projectId: string, projectName: string): string {
  const appData = app.getPath('userData')
  const outputDir = path.join(appData, 'exports', projectName || projectId)
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }
  
  return outputDir
}

// 导出剧本
ipcMain.handle('export:script', async (event, params: { projectId: string; episodeNumber: number; content: string }) => {
  const { projectId, episodeNumber, content } = params
  
  try {
    const outputDir = getProjectOutputDir(projectId, params.projectId)
    const scriptDir = path.join(outputDir, 'script')
    
    if (!fs.existsSync(scriptDir)) {
      fs.mkdirSync(scriptDir, { recursive: true })
    }
    
    const filePath = path.join(scriptDir, `_episode_${episodeNumber}.txt`)
    fs.writeFileSync(filePath, content, 'utf-8')
    
    return {
      success: true,
      path: filePath,
    }
  } catch (error: any) {
    console.error('Export script failed:', error)
    return {
      success: false,
      error: error.message,
    }
  }
})

// 导出项目配置
ipcMain.handle('export:project', async (event, params: { projectId: string; data: any }) => {
  const { projectId, data } = params
  
  try {
    const outputDir = getProjectOutputDir(projectId, data.title)
    const filePath = path.join(outputDir, 'project-config.json')
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
    
    return {
      success: true,
      path: filePath,
    }
  } catch (error: any) {
    console.error('Export project failed:', error)
    return {
      success: false,
      error: error.message,
    }
  }
})

// 导出分镜脚本
ipcMain.handle('export:storyboards', async (event, params: { projectId: string; data: any[] }) => {
  const { projectId, data } = params
  
  try {
    const outputDir = getProjectOutputDir(projectId, params.projectId)
    const storyboardDir = path.join(outputDir, 'storyboard')
    
    if (!fs.existsSync(storyboardDir)) {
      fs.mkdirSync(storyboardDir, { recursive: true })
    }
    
    const result: { path: string }[] = []
    data.forEach((item, index) => {
      const filePath = path.join(storyboardDir, `scene_${index + 1}.txt`)
      fs.writeFileSync(filePath, item.prompt || '', 'utf-8')
      result.push({ path: filePath })
    })
    
    return {
      success: true,
      paths: result.map(r => r.path),
    }
  } catch (error: any) {
    console.error('Export storyboards failed:', error)
    return {
      success: false,
      error: error.message,
    }
  }
})

// 导出资产
ipcMain.handle('export:assets', async (event, params: { projectId: string; data: any }) => {
  const { projectId, data } = params
  
  try {
    const outputDir = getProjectOutputDir(projectId, params.projectId)
    const assetsDir = path.join(outputDir, 'assets')
    
    if (!fs.existsSync(assetsDir)) {
      fs.mkdirSync(assetsDir, { recursive: true })
    }
    
    // 导出角色
    if (data.characters && data.characters.length > 0) {
      const charDir = path.join(assetsDir, 'characters')
      fs.mkdirSync(charDir, { recursive: true })
      data.characters.forEach((char: any) => {
        const filePath = path.join(charDir, `${char.name}.txt`)
        fs.writeFileSync(filePath, JSON.stringify(char, null, 2), 'utf-8')
      })
    }
    
    // 导出场景
    if (data.scenes && data.scenes.length > 0) {
      const sceneDir = path.join(assetsDir, 'scenes')
      fs.mkdirSync(sceneDir, { recursive: true })
      data.scenes.forEach((scene: any) => {
        const filePath = path.join(sceneDir, `${scene.name}.txt`)
        fs.writeFileSync(filePath, JSON.stringify(scene, null, 2), 'utf-8')
      })
    }
    
    // 导出道具
    if (data.props && data.props.length > 0) {
      const propDir = path.join(assetsDir, 'props')
      fs.mkdirSync(propDir, { recursive: true })
      data.props.forEach((prop: any) => {
        const filePath = path.join(propDir, `${prop.name}.txt`)
        fs.writeFileSync(filePath, JSON.stringify(prop, null, 2), 'utf-8')
      })
    }
    
    return {
      success: true,
      path: assetsDir,
    }
  } catch (error: any) {
    console.error('Export assets failed:', error)
    return {
      success: false,
      error: error.message,
    }
  }
})
