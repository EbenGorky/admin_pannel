import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SplashScreen() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => navigate('/login', { replace: true }), 3000)
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="fixed inset-0 flex flex-col bg-primary">
      {/* Top half: logo centered */}
      <div className="flex-1 flex items-center justify-center">
        <img
          src="/logo.png"
          alt="Vin Power"
          className="h-40 w-40 object-contain"
        />
      </div>
      {/* Bottom half: company name and loader */}
      <div className="flex-1 flex flex-col items-center pt-4">
        <h1 className="text-white text-3xl font-bold tracking-wider">VIN POWER</h1>
        <p className="text-white/80 text-xs tracking-wider mt-2">ENTERPRISE WORKFLOW PLATFORM</p>
        <div className="mt-16">
          <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      </div>
    </div>
  )
}
