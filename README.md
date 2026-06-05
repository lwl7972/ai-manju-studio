# AI 漫剧创作工作室

基于 Electron + React + Vite + TypeScript 的桌面端 AI 漫剧创作应用，支持从小说到成片的完整创作流程。

## 功能特性

- **五段式创作流程**：剧本生成 → 角色设定 → 图像生成 → 视频生成 → 音频配音
- **多模型支持**：每个阶段可独立配置不同的 AI 模型
- **扣子 API 集成**：内置对接扣子平台.workflow API
- **Mock 演示模式**：无 Token 时也可体验完整流程
- **项目管理**：支持创建和管理多个漫剧项目
- **自动更新**：检测新版本自动下载，提示重启安装

## 技术栈

- **桌面框架**: Electron 34.x
- **前端框架**: React 19.x + TypeScript
- **构建工具**: Vite 5.4.x
- **UI 组件**: shadcn/ui 风格组件库
- **状态管理**: localStorage 持久化

## 开发环境运行

```bash
# 安装依赖
npm install

# 启动 Web 开发服务器（推荐）
npm run dev

# 启动 Electron 桌面端（需要图形库环境）
npm run dev:electron
```

Web 开发服务器启动后访问：http://localhost:5173

## 打包桌面端

### 1. 构建生产版本

```bash
# 构建前端资源
npm run build

# 打包 Electron 应用
npm run electron:build
```

### 2. 打包产物位置

构建完成后，打包文件位于 `dist/` 目录：

```
dist/
├── AiManjuStudio-0.1.0-win32-x64/     # Windows 64 位安装包目录
│   ├── AiManjuStudio.exe               # 主程序
│   ├── resources/                      # 应用资源
│   └── ...
├── AiManjuStudio-0.1.0-win32-x64-setup.exe  # Windows 安装程序
├── AiManjuStudio-0.1.0.dmg            # macOS DMG (Mac 环境打包)
└── ...
```

### 3. 分平台打包

**仅打包 Windows:**
```bash
npm run electron:build -- --win
```

**仅打包 macOS:**
```bash
npm run electron:build -- --mac
```

**仅打包 Linux:**
```bash
npm run electron:build -- --linux
```

## 安装桌面应用

### Windows

1. **便携版（推荐开发测试）**
   - 进入 `dist/AiManjuStudio-0.1.0-win32-x64/` 目录
   - 双击运行 `AiManjuStudio.exe`
   - 可创建桌面快捷方式

2. **安装版**
   - 运行 `dist/AiManjuStudio-0.1.0-win32-x64-setup.exe`
   - 按安装向导完成安装
   - 开始菜单中会创建应用快捷方式

### macOS

1. 打开 `dist/AiManjuStudio-0.1.0.dmg`
2. 将应用拖拽到 Applications 文件夹
3. 在启动台中找到并运行应用

首次运行可能提示"无法验证开发者"，解决方法：
- 系统设置 → 隐私与安全性 → 仍要打开

### Linux

```bash
# 解压安装包
tar -xzf dist/AiManjuStudio-0.1.0-linux-x64.tar.gz

# 运行应用
cd AiManjuStudio-0.1.0-linux-x64
./AiManjuStudio
```

## 配置说明

### API Token 配置

1. 打开应用，点击顶部导航的"设置"
2. 在"API 配置"标签页填写：
   - **API Token**: 扣子平台个人访问令牌
   - **API Endpoint**: `https://api.coze.cn`
3. 勾选"使用 Mock 演示模式"可在无 Token 时体验功能

### 模型配置

应用内置 8 个官方预设模型，覆盖文本/图像/视频/音频四类：

1. 进入"设置"页面
2. 选择对应的模型标签页（文本/图像/视频/音频）
3. 点击推荐模型的"设为当前"按钮
4. 每个阶段可独立选择不同模型

### 添加自定义模型

1. 在设置页面点击"添加模型"
2. 选择模型类型（文本/图像/视频/音频）
3. 填写模型名称和工作流 ID
4. 工作流 ID 从扣子平台工作流 URL 中获取

## 项目结构

```
ai-manju-studio/
├── electron/                 # Electron 主进程
│   ├── main.ts              # 主进程入口
│   └── preload.ts           # 预加载脚本
├── src/                      # React 前端源码
│   ├── components/          # UI 组件
│   ├── pages/               # 页面组件
│   ├── services/            # API 服务层
│   ├── types/               # TypeScript 类型定义
│   └── App.tsx              # 应用入口
├── dist/                     # 构建产物（打包后生成）
├── package.json             # 项目配置
├── vite.config.ts           # Vite 配置
├── tsconfig.json            # TypeScript 配置
└── tsconfig.electron.json   # Electron TS 配置
```

## 自动更新

应用内置 GitHub 自动更新功能，基于 GitHub Releases 发布新版本。

### 工作机制

1. **自动检测**：应用启动后自动检查 GitHub 是否有新版本
2. **手动检查**：点击右上角"检查更新"按钮
3. **下载提示**：发现新版本自动下载，弹窗提示用户
4. **重启安装**：下载完成后提示重启应用安装更新

### 发布新版本

通过 Git tag 触发自动打包和发布：

```bash
# 1. 修改 package.json 中的版本号
# 例如："version": "0.1.1"

# 2. 提交并打 tag
git add package.json
git commit -m "chore: bump version to 0.1.1"
git tag v0.1.1
git push origin v0.1.1

# 3. GitHub Actions 自动执行
# - 在 Windows/macOS/Ubuntu 上打包
# - 自动创建 GitHub Release
# - 上传所有平台的安装包
```

**打包产物格式：**

- **Windows**: `.exe` 安装程序
- **macOS**: `.dmg` 安装文件
- **Linux**: `.AppImage` 便携应用

用户检测到更新后，会自动下载对应的安装包。

## 手动打包

### 本地打包（当前平台）

```bash
# 构建前端资源
npm run build

# 打包当前平台的 Electron 应用
npm run electron:build
```

### 分平台打包

```bash
# Windows
npm run electron:build:win

# macOS
npm run electron:build:mac

# Linux
npm run electron:build:linux
```

**注意**：在 Linux 环境打包 Windows/macOS 版本需要 Wine，推荐使用 GitHub Actions 自动打包。

## 常用命令

```bash
# 开发
npm run dev              # Web 开发服务器
npm run dev:electron     # Electron 开发模式

# 构建
npm run build            # 构建前端资源
npm run electron:build   # 打包桌面应用

# 代码质量
npm run lint             # ESLint 检查
```

## 已知问题

### Linux 环境图形库缺失

在某些精简 Linux 环境中运行 Electron 可能报以下错误：

```
libglib-2.0.so.0: cannot open shared object file
```

**解决方案：**

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y libglib2.0-0 libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2 libpango-1.0-0 libcairo2

# CentOS/RHEL
sudo yum install -y GConf2 gtk3 alsa-lib pango atk at-spi2-atk libXcomposite libXcursor libXdamage libXext libXfixes libXi libXrandr libXtst cups-libs nss dbus-libs
```

## 技术支持

- 扣子平台文档：https://www.coze.cn/docs
- Electron 文档：https://www.electronjs.org/docs
- React 文档：https://react.dev/

## 许可证

MIT License
