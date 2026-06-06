import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Users, MapPin, Box, Plus, Search, MoreHorizontal } from 'lucide-react'

interface Character {
  id: string
  name: string
  type: '主角' | '配角' | '反派'
  gender: 'male' | 'female'
  age: string
  description: string
  firstEpisode: number
}

interface Scene {
  id: string
  name: string
  type: '主要场景' | '次要场景'
  description: string
  firstEpisode: number
}

interface Prop {
  id: string
  name: string
  type: '武器' | '法器' | '日常物品'
  description: string
  firstEpisode: number
}

export default function AssetLibrary() {
  const [activeTab, setActiveTab] = useState('characters')
  const [searchTerm, setSearchTerm] = useState('')

  const characters: Character[] = [
    {
      id: '1',
      name: '林风',
      type: '主角',
      gender: 'male',
      age: '20',
      description: '身着一袭青色长衫，手持黑色长剑，眉宇间透着坚毅',
      firstEpisode: 1,
    },
    {
      id: '2',
      name: '苏清寒',
      type: '反派',
      gender: 'female',
      age: '22',
      description: '一袭黑衣，手持血色长剑，眼神冰冷',
      firstEpisode: 1,
    },
  ]

  const scenes: Scene[] = [
    {
      id: '1',
      name: '九天封神台',
      type: '主要场景',
      description: '古朴的石台，四周立着九根巨大的石柱，天空中雷云翻滚',
      firstEpisode: 1,
    },
    {
      id: '2',
      name: '青云宗大殿',
      type: '主要场景',
      description: '宏伟的宫殿，金碧辉煌，殿中坐着数十位长老',
      firstEpisode: 2,
    },
  ]

  const props: Prop[] = [
    {
      id: '1',
      name: '玄天魔剑',
      type: '武器',
      description: '通体漆黑，剑身散发着阵阵黑雾，是一把魔道至宝',
      firstEpisode: 1,
    },
    {
      id: '2',
      name: '青云令牌',
      type: '法器',
      description: '青云宗的身份象征，可调动宗门护山大阵',
      firstEpisode: 2,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">资产库</h2>
          <p className="text-muted-foreground">角色场景道具</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          添加资产
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜索资产..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {characters.map((character) => (
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
                  <div className="flex gap-2">
                    <Badge variant={character.type === '主角' ? 'default' : 'secondary'}>
                      {character.type}
                    </Badge>
                    <Badge variant="outline">
                      {character.gender === 'male' ? '男' : '女'}
                    </Badge>
                    <Badge variant="outline">{character.age}岁</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{character.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="scenes" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scenes.map((scene) => (
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
                  <p className="text-sm text-muted-foreground">{scene.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="props" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {props.map((prop) => (
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
                  <p className="text-sm text-muted-foreground">{prop.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
