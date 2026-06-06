# GitHub Actions 自动化发布指南

## 概述

本项目配置了三套 GitHub Actions 工作流，实现从代码提交到自动发布的全流程自动化。

---

## 工作流说明

### 1. Auto Merge (`.github/workflows/auto-merge.yml`)

**触发条件**: 推送到开发分支 `260605-feat-ai-manju-studio`

**功能**:
- 自动将开发分支合并到 `main` 分支
- 自动设置 Git 配置
- 自动推送到远程仓库

```yaml
on:
  push:
    branches:
      - '260605-feat-ai-manju-studio'
```

---

### 2. Auto Release (`.github/workflows/auto-release.yml`)

**触发条件**: 推送到 `main` 分支

**功能**:
1. **版本检查**: 检测 `package.json` 版本号是否变化
2. **变更检测**: 检查 `src/` 目录是否有代码变更
3. **标签检查**: 确认版本标签是否已存在
4. **创建标签**: 自动生成 Git 标签 `v{version}`
5. **创建 Release**: 自动生成 Release 说明
6. **构建打包**: 并行构建 Windows/Mac/Linux 安装包
7. **上传资源**: 将安装包上传到 Release

```yaml
on:
  push:
    branches:
      - main
```

**发布流程**:
```
代码推送到 main → 检查版本变化 → 创建 Git 标签 → 创建 Release → 
构建三方安装包 → 上传安装包到 Release
```

---

### 3. Release (Manual) (`.github/workflows/release.yml`)

**触发条件**: 
- 手动触发（GitHub Actions 页面）
- 推送 `v*` 标签

**功能**:
- 手动指定版本号进行发布
- 构建三方安装包并上传

---

## 使用方法

### 方式一：自动发布（推荐）

#### 1. 在开发分支开发功能

```bash
# 切换到开发分支
git checkout 260605-feat-ai-manju-studio

# 开发并提交
git add .
git commit -m "feat: 实现新功能"
git push
```

推送到开发分支后，**Auto Merge** 工作流会自动将代码合并到 `main`。

#### 2. 更新版本号

```bash
# 增加补丁版本 (0.3.0 → 0.3.1)
npm run version:patch

# 增加次版本 (0.3.0 → 0.4.0)
npm run version:minor

# 增加主版本 (0.3.0 → 1.0.0)
npm run version:major
```

#### 3. 提交版本变更

```bash
git add package.json
git commit -m "chore: bump version to v0.4.0"
git push origin 260605-feat-ai-manju-studio
```

#### 4. 自动发布

推送后会自动触发以下流程：

1. ✅ **Auto Merge**: 合并到 `main`
2. ✅ **Auto Release**: 
   - 创建 Git 标签 `v0.4.0`
   - 创建 GitHub Release
   - 构建 Windows/Mac/Linux 安装包
   - 上传安装包到 Release

---

### 方式二：手动发布

#### 1. 手动触发 Workflow

1. 进入 GitHub 仓库页面
2. 点击 **Actions** 标签
3. 选择 **Release (Manual)** 工作流
4. 点击 **Run workflow**
5. 输入版本号（如 `v0.4.0`）
6. 点击运行

#### 2. 查看进度

在 Actions 页面可以实时查看：
- 构建进度
- 各平台构建状态
- 安装包上传状态

---

### 方式三：使用 Git 标签发布

```bash
# 打标签
git tag -a v0.4.0 -m "Release v0.4.0"

# 推送标签
git push origin v0.4.0
```

推送标签后会自动触发 **Release (Manual)** 工作流。

---

## 查看发布状态

### GitHub Actions
https://github.com/lwl7972/ai-manju-studio/actions

### Releases
https://github.com/lwl7972/ai-manju-studio/releases

---

## 版本号规范

遵循语义化版本规范 (SemVer):

- **主版本号 (major)**: 不兼容的 API 变更
- **次版本号 (minor)**: 向后兼容的功能新增
- **补丁版本 (patch)**: 向后兼容的问题修正

示例:
- `0.1.0` → `0.1.1` (修复 bug)
- `0.1.1` → `0.2.0` (新增功能)
- `0.3.0` → `1.0.0` (重大变更)

---

## 构建产物

每个 Release 会生成以下安装包：

### Windows
- `AI 漫剧工作室 Setup X.X.X.exe` - NSIS 安装程序
- `latest.yml` - 自动更新配置

### macOS
- `AI 漫剧工作室-X.X.X.dmg` - DMG 安装包
- `latest-mac.yml` - 自动更新配置

### Linux
- `AI 漫剧工作室-X.X.X.AppImage` - AppImage 包
- `AI 漫剧工作室_X.X.X_amd64.deb` - Debian 包
- `AI 漫剧工作室-X.X.X.x86_64.rpm` - RPM 包
- `latest-linux.yml` - 自动更新配置

---

## 环境变量配置

### 必需的 Secrets

在 GitHub 仓库设置中配置以下 Secrets：

**Settings → Secrets and variables → Actions**

| Secret 名称 | 值 | 说明 |
|------------|-----|------|
| `GH_TOKEN` | `${{ secrets.GITHUB_TOKEN }}` | GitHub API 访问令牌（默认已有） |
| `CSC_LINK` | (可选) | Apple 开发者证书链接（macOS 签名） |
| `CSC_KEY_PASSWORD` | (可选) | 证书密码 |

**注意**: `GITHUB_TOKEN` 由 GitHub 自动提供，无需手动配置。

---

## 自定义发布流程

### 修改触发分支

编辑 `.github/workflows/auto-merge.yml`:

```yaml
on:
  push:
    branches:
      - '你的开发分支名'  # 修改这里
```

### 修改发布条件

编辑 `.github/workflows/auto-release.yml`:

```yaml
jobs:
  version-check:
    # 添加自定义条件
    if: |
      needs.version-check.outputs.has_changes == 'true' && 
      needs.version-check.outputs.tag_exists == 'false'
```

### 添加更多构建平台

编辑 `.github/workflows/auto-release.yml`:

```yaml
strategy:
  matrix:
    os: [windows-latest, macos-latest, ubuntu-latest]
    # 可以添加更多平台
```

---

## 故障排查

### 1. 工作流未触发

- 检查分支名是否匹配
- 检查 workflow 文件语法
- 查看 Actions 日志

### 2. 构建失败

- 检查 `package.json` 依赖
- 检查构建命令是否正确
- 查看具体错误日志

### 3. Release 未创建

- 检查版本号是否已存在
- 检查 permissions 配置
- 确认 GITHUB_TOKEN 权限

### 4. 安装包上传失败

- 检查 Release 是否已创建
- 检查文件路径是否正确
- 查看上传日志

---

## 最佳实践

1. **在开发分支开发**: 所有功能开发在 `260605-feat-ai-manju-studio` 分支进行
2. **及时更新版本号**: 每次重要更新后更新版本号
3. **编写清晰的提交信息**: 便于自动生成 Release Notes
4. **测试后再发布**: 本地测试无误后再推送
5. **监控构建状态**: 发布后检查 Actions 构建结果

---

## 流程图

```
┌─────────────────────────────────────────────────────────┐
│                   开发工作流                            │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
              git push 到开发分支
                          │
                          ▼
              ┌───────────────────────┐
              │  Auto Merge Workflow  │
              │  合并到 main 分支      │
              └───────────────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │  Auto Release Workflow│
              │  1. 检查版本变更      │
              │  2. 创建 Git 标签      │
              │  3. 创建 Release       │
              │  4. 构建三方安装包    │
              │  5. 上传安装包        │
              └───────────────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │   GitHub Release      │
              │  Windows / Mac / Linux│
              └───────────────────────┘
```

---

**文档更新时间**: 2026-06-06  
**适用版本**: v0.3.0+
