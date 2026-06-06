import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Key, Save, Check } from 'lucide-react'

interface APIKeys {
  coze?: string
  zhipu?: string
  openai?: string
  anthropic?: string
  moonshot?: string
  deepseek?: string
  aliyun?: string
  tencent?: string
  baidu?: string
  microsoft?: string
  volcengine?: string
  bytedance?: string
  kuaishou?: string
  iflytek?: string
}

const PROVIDER_INFO: Record<keyof APIKeys, { name: string; description: string; models: string[]; icon: string }> = {
  coze: {
    name: 'Coze 扣子',
    description: '字节跳动 AI 平台，支持工作流调用',
    models: ['所有 Coze 工作流'],
    icon: '🤖',
  },
  zhipu: {
    name: '智谱 AI',
    description: 'GLM 系列大语言模型、CogView 生图',
    models: ['GLM-4-Flash', 'GLM-4-Plus', 'GLM-4-Air', 'CogView-3'],
    icon: '🧠',
  },
  openai: {
    name: 'OpenAI',
    description: 'GPT 系列大语言模型',
    models: ['GPT-4o', 'GPT-4o Mini', 'o3-mini', 'o1'],
    icon: '🟢',
  },
  anthropic: {
    name: 'Anthropic',
    description: 'Claude 系列大语言模型',
    models: ['Claude 3.5 Sonnet', 'Claude 3 Opus', 'Claude 3 Haiku'],
    icon: '🔵',
  },
  moonshot: {
    name: '月之暗面',
    description: 'Kimi 大语言模型',
    models: ['Kimi K1-8K'],
    icon: '🌙',
  },
  deepseek: {
    name: '深度求索',
    description: 'DeepSeek 系列大语言模型',
    models: ['DeepSeek-V3', 'DeepSeek-R1', 'DeepSeek-V4-Pro', 'DeepSeek-V4-Flash'],
    icon: '🔷',
  },
  aliyun: {
    name: '阿里云',
    description: '通义千问、CosyVoice 语音合成',
    models: ['通义万相', 'CosyVoice 2/1'],
    icon: '☁️',
  },
  tencent: {
    name: '腾讯云',
    description: '混元大模型',
    models: ['混元生图'],
    icon: '📱',
  },
  baidu: {
    name: '百度',
    description: '文心一言、文心一格',
    models: ['文心一格'],
    icon: '🔍',
  },
  microsoft: {
    name: 'Microsoft Azure',
    description: 'Azure AI 服务、TTS 语音合成',
    models: ['Azure TTS 标准版', 'Azure TTS 神经版'],
    icon: '🪟',
  },
  volcengine: {
    name: '火山引擎',
    description: '豆包系列模型',
    models: ['Doubao-Seedream-5', 'Doubao-Seedance 系列', '豆包图像 V2/V1'],
    icon: '🌋',
  },
  bytedance: {
    name: '字节跳动',
    description: '即梦系列模型',
    models: ['即梦 V2.0', '即梦 V1.0'],
    icon: '🎵',
  },
  kuaishou: {
    name: '快手',
    description: '可灵系列模型',
    models: ['可灵 V3/V3-Omni', '可灵 1.0'],
    icon: '📹',
  },
  iflytek: {
    name: '科大讯飞',
    description: '讯飞星火、讯飞 TTS',
    models: ['讯飞语音合成'],
    icon: '🎙️',
  },
}

export default function APIKeyConfig() {
  const [apiKeys, setApiKeys] = useState<APIKeys>({})
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})
  const [modifiedKeys, setModifiedKeys] = useState<APIKeys>({})

  useEffect(() => {
    const saved = localStorage.getItem('api_keys')
    if (saved) {
      const keys = JSON.parse(saved)
      setApiKeys(keys)
      setModifiedKeys(keys)
    }
  }, [])

  const handleSave = () => {
    const mergedKeys = { ...apiKeys, ...modifiedKeys }
    localStorage.setItem('api_keys', JSON.stringify(mergedKeys))
    setApiKeys(mergedKeys)
    alert('API Keys 已保存')
  }

  const handleChange = (provider: keyof APIKeys, value: string) => {
    setModifiedKeys(prev => ({ ...prev, [provider]: value }))
  }

  const isConfigured = (provider: keyof APIKeys) => {
    const key = modifiedKeys[provider] || apiKeys[provider]
    return !!key && key.trim() !== ''
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">API Key 配置</h3>
          <p className="text-sm text-muted-foreground">
            配置各 AI 厂商的 API Key，扣子模型使用 Coze Token，其他模型使用各自的 API Key
          </p>
        </div>
        <Button onClick={handleSave} size="sm">
          <Save className="w-4 h-4 mr-2" />
          保存配置
        </Button>
      </div>

      {/* Coze 配置 - 最重要 */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🤖</span>
              <div>
                <CardTitle className="text-base">Coze 扣子</CardTitle>
                <CardDescription>
                  扣子平台工作流调用，支持所有 Coze 模型
                </CardDescription>
              </div>
            </div>
            {isConfigured('coze') && (
              <Badge className="bg-green-500">
                <Check className="w-3 h-3 mr-1" />
                已配置
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Coze API Token</Label>
            <Input
              type={showKeys.coze ? 'text' : 'password'}
              placeholder="输入 Coze 个人访问令牌"
              value={modifiedKeys.coze || ''}
              onChange={(e) => handleChange('coze', e.target.value)}
            />
            <div className="text-xs text-muted-foreground">
              在扣子平台个人设置中获取：
              <a
                href="https://www.coze.cn/open/oauth/pats"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline ml-1"
              >
                https://www.coze.cn/open/oauth/pats
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 大语言模型厂商 */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-muted-foreground">大语言模型</h4>
        <div className="grid gap-4 md:grid-cols-2">
          {/* 智谱 AI */}
          <APIKeyInput
            provider="zhipu"
            value={modifiedKeys.zhipu || ''}
            onChange={(v) => handleChange('zhipu', v)}
            show={!!showKeys.zhipu}
            onToggleShow={() => setShowKeys(prev => ({ ...prev, zhipu: !prev.zhipu }))}
            configured={isConfigured('zhipu')}
          />
          
          {/* OpenAI */}
          <APIKeyInput
            provider="openai"
            value={modifiedKeys.openai || ''}
            onChange={(v) => handleChange('openai', v)}
            show={!!showKeys.openai}
            onToggleShow={() => setShowKeys(prev => ({ ...prev, openai: !prev.openai }))}
            configured={isConfigured('openai')}
          />
          
          {/* Anthropic */}
          <APIKeyInput
            provider="anthropic"
            value={modifiedKeys.anthropic || ''}
            onChange={(v) => handleChange('anthropic', v)}
            show={!!showKeys.anthropic}
            onToggleShow={() => setShowKeys(prev => ({ ...prev, anthropic: !prev.anthropic }))}
            configured={isConfigured('anthropic')}
          />
          
          {/* 月之暗面 */}
          <APIKeyInput
            provider="moonshot"
            value={modifiedKeys.moonshot || ''}
            onChange={(v) => handleChange('moonshot', v)}
            show={!!showKeys.moonshot}
            onToggleShow={() => setShowKeys(prev => ({ ...prev, moonshot: !prev.moonshot }))}
            configured={isConfigured('moonshot')}
          />
          
          {/* DeepSeek */}
          <APIKeyInput
            provider="deepseek"
            value={modifiedKeys.deepseek || ''}
            onChange={(v) => handleChange('deepseek', v)}
            show={!!showKeys.deepseek}
            onToggleShow={() => setShowKeys(prev => ({ ...prev, deepseek: !prev.deepseek }))}
            configured={isConfigured('deepseek')}
          />
        </div>
      </div>

      {/* 语音合成与生图厂商 */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-muted-foreground">语音合成 / 生图 / 视频</h4>
        <div className="grid gap-4 md:grid-cols-2">
          {/* 阿里云 */}
          <APIKeyInput
            provider="aliyun"
            value={modifiedKeys.aliyun || ''}
            onChange={(v) => handleChange('aliyun', v)}
            show={!!showKeys.aliyun}
            onToggleShow={() => setShowKeys(prev => ({ ...prev, aliyun: !prev.aliyun }))}
            configured={isConfigured('aliyun')}
          />
          
          {/* 火山引擎 */}
          <APIKeyInput
            provider="volcengine"
            value={modifiedKeys.volcengine || ''}
            onChange={(v) => handleChange('volcengine', v)}
            show={!!showKeys.volcengine}
            onToggleShow={() => setShowKeys(prev => ({ ...prev, volcengine: !prev.volcengine }))}
            configured={isConfigured('volcengine')}
          />
          
          {/* 字节跳动 */}
          <APIKeyInput
            provider="bytedance"
            value={modifiedKeys.bytedance || ''}
            onChange={(v) => handleChange('bytedance', v)}
            show={!!showKeys.bytedance}
            onToggleShow={() => setShowKeys(prev => ({ ...prev, bytedance: !prev.bytedance }))}
            configured={isConfigured('bytedance')}
          />
          
          {/* 快手 */}
          <APIKeyInput
            provider="kuaishou"
            value={modifiedKeys.kuaishou || ''}
            onChange={(v) => handleChange('kuaishou', v)}
            show={!!showKeys.kuaishou}
            onToggleShow={() => setShowKeys(prev => ({ ...prev, kuaishou: !prev.kuaishou }))}
            configured={isConfigured('kuaishou')}
          />
          
          {/* Microsoft Azure */}
          <APIKeyInput
            provider="microsoft"
            value={modifiedKeys.microsoft || ''}
            onChange={(v) => handleChange('microsoft', v)}
            show={!!showKeys.microsoft}
            onToggleShow={() => setShowKeys(prev => ({ ...prev, microsoft: !prev.microsoft }))}
            configured={isConfigured('microsoft')}
          />
          
          {/* 科大讯飞 */}
          <APIKeyInput
            provider="iflytek"
            value={modifiedKeys.iflytek || ''}
            onChange={(v) => handleChange('iflytek', v)}
            show={!!showKeys.iflytek}
            onToggleShow={() => setShowKeys(prev => ({ ...prev, iflytek: !prev.iflytek }))}
            configured={isConfigured('iflytek')}
          />
          
          {/* 百度 */}
          <APIKeyInput
            provider="baidu"
            value={modifiedKeys.baidu || ''}
            onChange={(v) => handleChange('baidu', v)}
            show={!!showKeys.baidu}
            onToggleShow={() => setShowKeys(prev => ({ ...prev, baidu: !prev.baidu }))}
            configured={isConfigured('baidu')}
          />
        </div>
      </div>

      <div className="text-xs text-muted-foreground mt-4 p-3 bg-muted rounded-lg">
        <Key className="w-3 h-3 inline mb-0.5 mr-1" />
        <strong>提示：</strong>
        扣子模型的模型才用扣子接口（需要 Coze Token），其他厂商的模型按各自 API Key 配置调用。
        API Key 将保存在本地 localStorage 中，不会上传到服务器。
      </div>
    </div>
  )
}

interface APIKeyInputProps {
  provider: keyof APIKeys
  value: string
  onChange: (value: string) => void
  show: boolean
  onToggleShow: () => void
  configured: boolean
}

function APIKeyInput({ provider, value, onChange, show, onToggleShow, configured }: APIKeyInputProps) {
  const info = PROVIDER_INFO[provider]
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <span className="text-xl">{info.icon}</span>
            <div>
              <CardTitle className="text-sm">{info.name}</CardTitle>
              <CardDescription className="text-xs">
                {info.models.slice(0, 2).join('、')}
              </CardDescription>
            </div>
          </div>
          {configured && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <Check className="w-3 h-3 mr-1" />
              已配置
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="relative">
          <Input
            type={show ? 'text' : 'password'}
            placeholder={`${info.name} API Key`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="pr-16"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onToggleShow}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-7 px-2 text-xs"
          >
            {show ? '隐藏' : '显示'}
          </Button>
        </div>
        <div className="text-xs text-muted-foreground">
          {info.description}
        </div>
      </CardContent>
    </Card>
  )
}
