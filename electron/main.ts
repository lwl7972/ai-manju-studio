import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import { autoUpdater } from 'electron-updater'

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
