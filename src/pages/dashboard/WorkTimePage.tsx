import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function WorkTimePage() {
  const navigate = useNavigate()
  useEffect(() => { navigate('/app/analytics', { replace: true }) }, [])
  return null
}
