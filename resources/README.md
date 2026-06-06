# 图标资源说明

本目录用于存放应用图标和相关视觉资源文件。

## 所需资源

### Windows
- `app.ico` - Windows 应用图标（256x256 包含多尺寸）
  - 用于：桌面快捷方式、任务栏、安装包

### macOS
- `app.icns` - macOS 应用图标（包含多分辨率）
  - 用于：Finder、Dock、启动台

### Linux
- `app.png` - Linux 应用图标（256x256 或 512x512）
  - 用于：应用菜单、启动器

## 设计要求

- 风格：影视场记板/导演工具感
- 主色调：专业、简洁
- 尺寸：至少 256x256，建议 1024x1024

## 临时方案

开发阶段可使用默认 electron 图标或占位图标。
将任意 .ico 文件放入此目录并命名为 `app.ico` 即可。

## 资源生成工具

- [electron-icon-builder](https://www.npmjs.com/package/electron-icon-builder)
- [iconjar](https://geticonjar.com/)
- Photoshop / Illustrator / Figma
