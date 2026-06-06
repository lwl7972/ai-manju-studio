# AI 漫剧四步工作流重构

## 变更概述
将原有的五段式平铺布局重构为四步工作流产品形态，更贴近专业影视制作工具的用户体验。

## 分支
`260605-feat-ai-manju-studio` → `main`

## 新增功能

### 1. 四步工作流导航
- 视频设置 → 剧本编辑 → 资产库 → 分镜脚本
- 项目选择器与提示词管理弹窗

### 2. 本地配置层
- 全局默认参数 + 项目级覆盖的继承机制
- 本地存储持久化 (localStorage)

### 3. 提示词文件体系
- 6 类提示词模板（系统提示词、角色提取、场景提取、资产生成、分镜后缀、大纲生成）
- 智能分段识别（规则段/示例段/约束段）
- 变量高亮与模板预览功能

### 4. 核心页面实现
- **视频设置页**: 参数配置与继承逻辑
- **剧本编辑页**: 分集生成链路，接入 Coze AI 服务
- **资产库**: 角色/场景/道具管理，AI 资产提取功能
- **分镜脚本页**: 提示词拼装引擎，支持分集选择与导出

### 5. 导出链路
- Electron IPC 导出处理器（项目/剧本/分镜/资产）
- 输出目录落盘机制 (Electron)
- Web 端下载导出支持

### 6. 桌面端配置
- NSIS 自定义安装选项
- 全平台应用图标（Windows/macOS/Linux）
- MIT LICENSE

## 修改的文件
- `src/App.tsx` - 路由重构
- `src/components/Navbar.tsx` - 四步导航
- `src/components/PromptTemplateManager.tsx` - 提示词管理界面增强
- `src/pages/VideoSettings.tsx` - 视频设置页
- `src/pages/ScriptEditor.tsx` - 剧本编辑页
- `src/pages/AssetLibrary.tsx` - 资产库
- `src/pages/StoryboardScript.tsx` - 分镜脚本
- `src/services/promptAssembly.ts` - 提示词拼装引擎 (新增)
- `src/services/configService.ts` - 配置服务增强
- `electron/main.ts` - 导出 IPC 处理器 (新增)
- `electron/preload.ts` - 导出接口暴露 (新增)
- `package.json` - electron-builder 配置更新
- `resources/*` - 应用图标资源 (新增)

## 测试清单
- [x] TypeScript 编译测试通过
- [ ] 四步工作流完整测试
- [ ] AI 功能测试（需配置 Coze Token）
- [ ] 导出功能测试

## 截图
待补充

## 相关问题
- Closes #ISSUE_NUMBER
