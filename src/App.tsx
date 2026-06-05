import { Routes, Route } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import Workspace from '@/pages/Workspace'
import Projects from '@/pages/Projects'
import Settings from '@/pages/Settings'

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Workspace />} />
          <Route path="/workspace" element={<Workspace />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
