import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Workspace() {
  const navigate = useNavigate()

  useEffect(() => {
    navigate('/workspace/video-settings')
  }, [navigate])

  return null
}
