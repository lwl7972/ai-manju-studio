import { Routes, Route } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import Workspace from '@/pages/Workspace'
import Projects from '@/pages/Projects'
import Settings from '@/pages/Settings'
import VideoSettings from '@/pages/VideoSettings'
import ScriptEditor from '@/pages/ScriptEditor'
import AssetLibrary from '@/pages/AssetLibrary'
import StoryboardScript from '@/pages/StoryboardScript'

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Projects />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/workspace" element={<Workspace />} />
          <Route path="/workspace/video-settings" element={<VideoSettings />} />
          <Route path="/workspace/script-editor" element={<ScriptEditor />} />
          <Route path="/workspace/asset-library" element={<AssetLibrary />} />
          <Route path="/workspace/storyboard-script" element={<StoryboardScript />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
