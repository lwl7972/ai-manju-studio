import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { FileText, Download, Copy, Play, Loader2 } from 'lucide-react'

export default function StoryboardScript() {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGeneratePrompt = async () => {
    setIsGenerating(true)
    // TODO: 调用提示词拼装引擎
    // 这里模拟生成结果
    setTimeout(() => {
      setPrompt(`【全局基础设定】
@图 1【角色】林风（男，20 岁，坚毅冷静）
@图 2【角色】苏清寒（女，22 岁，冰冷狠厉）
@图 3【场景】九天封神台（古朴石台，九根巨大石柱，雷云翻滚）
场景环境：@图 3 九天封神台，黄昏，雷云密布，压抑氛围
光影色调：暗金色主调，闪电蓝光

【视频基础参数】
总时长：60 秒
画面比例：16:9
画风设定：3D 玄幻，4K 分辨率，精细细节，画面层次丰富，清晰度高，全程画风统一

【分镜明细】
0-4s：承接上镜：分镜 2 结尾 10 秒时，黑色长剑反射出林风绝望的脸庞，苏清寒持剑而立。【场景信息：九天封神台】缓慢推镜，聚焦在林风的面部，展现他眼中的难以置信与失望，金色泪水混合着血液滑落。[cut]
4-7s：镜头反打，特写苏清寒冰冷的眼神与嘴角的冷笑，她缓缓举起长剑，黑色煞气在剑身上盘旋。[cut]
7-10s：仰拍镜头，苏清寒高举长剑，天空中一道闪电划过，照亮她狰狞的侧脸，煞气冲天而起。[cut]

【角色对话】
4-7s [林风，痛苦颤抖]: "清寒……为什么？我待你如亲妹，你为何要背叛我？"[cut]

【背景音效】
0-4s：林风沙哑的呼吸声 [cut]
4-7s：林风痛苦的质问声 [cut]
7-10s：闪电划破天际的轰鸣声、长剑凝聚煞气的嗡鸣声 [cut]

【附加约束】
场景、色调、光影保持统一，细节丰富，特效自然不突兀，画面无水印、无崩坏，标准高质感玄幻漫剧，只生成人物对话声音，不生成背景音乐`)
      setIsGenerating(false)
    }, 1500)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt)
  }

  const handleExport = () => {
    const blob = new Blob([prompt], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = '分镜提示词.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">分镜脚本</h2>
          <p className="text-muted-foreground">提示词编辑导出</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCopy} disabled={!prompt}>
            <Copy className="h-4 w-4 mr-2" />
            复制
          </Button>
          <Button variant="outline" onClick={handleExport} disabled={!prompt}>
            <Download className="h-4 w-4 mr-2" />
            导出
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>当前项目参数</CardTitle>
              <CardDescription>继承自视频设置和项目配置</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">风格：</span>
                <span>3D 玄幻</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">比例：</span>
                <span>16:9</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">质量：</span>
                <span>高</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">平台：</span>
                <span>抖音</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">时长：</span>
                <span>60 秒</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>当前资产</CardTitle>
              <CardDescription>本分集使用的角色和场景</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex flex-wrap gap-1">
                <Badge variant="outline">林风</Badge>
                <Badge variant="outline">苏清寒</Badge>
                <Badge variant="outline">九天封神台</Badge>
              </div>
            </CardContent>
          </Card>

          <Button className="w-full" onClick={handleGeneratePrompt} disabled={isGenerating}>
            {isGenerating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            <Play className="h-4 w-4 mr-2" />
            生成提示词
          </Button>
        </div>

        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  <CardTitle>分镜提示词</CardTitle>
                </div>
                <CardDescription>编辑并导出分镜提示词</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder='点击"生成提示词"按钮，系统将自动组合系统提示词、项目参数、分集内容和资产信息，生成分镜提示词...'
                className="min-h-[500px] font-mono text-sm"
                readOnly={isGenerating}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
