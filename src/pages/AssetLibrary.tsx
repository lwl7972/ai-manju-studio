import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Users, MapPin, Box, Plus, Search, MoreHorizontal, Loader2, Wand2 } from 'lucide-react'
import { AssetCharacter, AssetScene, AssetProp } from '@/types/config'
import { getProject, saveProject } from '@/services/configService'
import { cozeService } from '@/services/coze'
import { getTemplate } from '@/services/promptTemplateService'

export default function AssetLibrary() {
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('projectId')
  
  const [activeTab, setActiveTab] = useState('characters')
  const [searchTerm, setSearchTerm] = useState('')
  const [isExtracting, setIsExtracting] = useState(false)
  const [project, setProject] = useState<any>(null)
  const [characters, setCharacters] = useState<AssetCharacter[]>([])
  const [scenes, setScenes] = useState<AssetScene[]>([])
  const [props, setProps] = useState<AssetProp[]>([])
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // 加载项目数据
  useEffect(() => {
    if (projectId) {
      const loadedProject = getProject(projectId)
      if (loadedProject) {
        setProject(loadedProject)
        setCharacters(loadedProject.assets?.characters || [])
        setScenes(loadedProject.assets?.scenes || [])
        setProps(loadedProject.assets?.props || [])
      }
    }
  }, [projectId])

  const handleExtractAssets = async () => {
    if (!projectId || !project?.episodes?.length) {
      alert('请先生成分集内容')
      return
    }

    const token = localStorage.getItem('coze_token')
    if (!token) {
      alert('请先在设置中配置 Coze API Token')
      return
    }

    setIsExtracting(true)
    cozeService.setToken(token)

    try {
      // 获取所有分集的文本内容
      const episodeTexts = project.episodes
        .filter((ep: any) => ep.content)
        .map((ep: any) => ({
          episodeNumber: ep.episodeNumber,
          title: ep.title,
          content: ep.content,
        }))

      // 调用 AI 提取资产
      const template = getTemplate('character-extract')
      
      const result = await cozeService.executeWorkflow(
        'asset-extract-workflow',
        {
          episodes: episodeTexts,
          episodeCount: episodeTexts.length,
        },
        false
      )

      // 解析提取的资产
      const extractedCharacters: AssetCharacter[] = (result.data?.characters || []).map((c: any, index: number) => ({
        id: `char_${Date.now()}_${index}`,
        name: c.name || '未知角色',
        type: c.type || '配角',
        gender: c.gender || 'male',
        age: c.age || '成年',
        description: c.description || '',
        firstEpisode: c.firstEpisode || 1,
        faceShape: c.faceShape,
        eyes: c.eyes,
        hairStyle: c.hairStyle,
        costumeType: c.costumeType,
        costumeDesc: c.costumeDesc,
        makeupImageDesc: c.makeupImageDesc,
        features: c.features,
      }))

      const extractedScenes: AssetScene[] = (result.data?.scenes || []).map((s: any, index: number) => ({
        id: `scene_${Date.now()}_${index}`,
        name: s.name || '未知场景',
        type: s.type || '次要场景',
        description: s.description || '',
        firstEpisode: s.firstEpisode || 1,
      }))

      const extractedProps: AssetProp[] = (result.data?.props || []).map((p: any, index: number) => ({
        id: `prop_${Date.now()}_${index}`,
        name: p.name || '未知道具',
        type: p.type || '日常物品',
        description: p.description || '',
        firstEpisode: p.firstEpisode || 1,
      }))

      // 更新项目资产
      const updated = {
        ...project,
        assets: {
          characters: extractedCharacters,
          scenes: extractedScenes,
          props: extractedProps,
        },
        updatedAt: new Date().toISOString(),
      }
      saveProject(updated)
      setProject(updated)
      setCharacters(extractedCharacters)
      setScenes(extractedScenes)
      setProps(extractedProps)
      setLastSaved(new Date())

      alert(`资产提取完成：${extractedCharacters.length}个角色，${extractedScenes.length}个场景，${extractedProps.length}个道具`)
    } catch (error) {
      console.error('资产提取失败:', error)
      alert('资产提取失败，请检查 API 配置')
    } finally {
      setIsExtracting(false)
    }
  }

  const filteredCharacters = characters.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredScenes = scenes.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredProps = props.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">资产库</h2>
          <p className="text-muted-foreground">管理角色、场景、道具资产</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="default"
            onClick={handleExtractAssets}
            disabled={isExtracting || !project?.episodes?.length}
          >
            {isExtracting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            <Wand2 className="h-4 w-4 mr-2" />
            AI 提取资产
          </Button>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            手动添加
          </Button>
        </div>
      </div>

      {lastSaved && (
        <div className="text-xs text-muted-foreground text-right">
          已保存于 {lastSaved.toLocaleTimeString()}
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜索资产..."
            className="w-full pl-10 pr-4"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          角色：{characters.length} | 场景：{scenes.length} | 道具：{props.length}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="characters" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            角色
          </TabsTrigger>
          <TabsTrigger value="scenes" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            场景
          </TabsTrigger>
          <TabsTrigger value="props" className="flex items-center gap-2">
            <Box className="h-4 w-4" />
            道具
          </TabsTrigger>
        </TabsList>

        <TabsContent value="characters" className="space-y-4">
          {filteredCharacters.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>{searchTerm ? '没有找到匹配的角色' : '暂无角色资产，点击"AI 提取资产"自动生成'}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCharacters.map((character) => (
                <Card key={character.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{character.name}</CardTitle>
                        <CardDescription>
                          第{character.firstEpisode}集登场
                        </CardDescription>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant={character.type === '主角' ? 'default' : 'secondary'}>
                        {character.type}
                      </Badge>
                      <Badge variant="outline">
                        {character.gender === 'male' ? '男' : '女'}
                      </Badge>
                      <Badge variant="outline">{character.age}岁</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{character.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="scenes" className="space-y-4">
          {filteredScenes.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12 text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>{searchTerm ? '没有找到匹配的场景' : '暂无场景资产，点击"AI 提取资产"自动生成'}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredScenes.map((scene) => (
                <Card key={scene.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{scene.name}</CardTitle>
                        <CardDescription>
                          第{scene.firstEpisode}集登场
                        </CardDescription>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Badge variant={scene.type === '主要场景' ? 'default' : 'secondary'}>
                      {scene.type}
                    </Badge>
                    <p className="text-sm text-muted-foreground line-clamp-2">{scene.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="props" className="space-y-4">
          {filteredProps.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12 text-muted-foreground">
                <Box className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>{searchTerm ? '没有找到匹配的道具' : '暂无道具资产，点击"AI 资产提取"自动生成'}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProps.map((prop) => (
                <Card key={prop.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{prop.name}</CardTitle>
                        <CardDescription>
                          第{prop.firstEpisode}集登场
                        </CardDescription>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Badge variant="outline">{prop.type}</Badge>
                    <p className="text-sm text-muted-foreground line-clamp-2">{prop.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
