import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardHeader, CardTitle, CardContent, Avatar, Input, Badge } from '@/components/ui'
import { MapPin, Battery, Clock, Search, RefreshCw, Navigation } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LiveEmployee {
  id: string
  name: string
  employeeId: string
  status: 'active' | 'break' | 'offline'
  task: string
  battery: number
  lat: number
  lng: number
  address: string
  lastUpdate: string
  checkIn: string
}

const liveEmployees: LiveEmployee[] = [
  { id: '1', name: 'John Smith', employeeId: 'EMP-0001', status: 'active', task: 'Site Inspection - Building A', battery: 87, lat: 40.7128, lng: -74.0060, address: '200 Broadway, New York, NY', lastUpdate: '2 min ago', checkIn: '07:52 AM' },
  { id: '2', name: 'Sarah Johnson', employeeId: 'EMP-0002', status: 'break', task: 'Equipment Maintenance', battery: 65, lat: 40.7282, lng: -73.7949, address: '1500 Lexington Ave, New York, NY', lastUpdate: '1 min ago', checkIn: '07:15 AM' },
  { id: '3', name: 'David Brown', employeeId: 'EMP-0005', status: 'active', task: 'Customer Visit - Downtown', battery: 42, lat: 40.6892, lng: -74.0445, address: '1 Liberty Island, New York, NY', lastUpdate: '5 min ago', checkIn: '06:45 AM' },
  { id: '4', name: 'Lisa Anderson', employeeId: 'EMP-0006', status: 'active', task: 'Inventory Check - Warehouse', battery: 91, lat: 40.7484, lng: -73.9857, address: '350 5th Ave, New York, NY', lastUpdate: '3 min ago', checkIn: '07:30 AM' },
  { id: '5', name: 'Emma Taylor', employeeId: 'EMP-0008', status: 'active', task: 'Field Service - Client B', battery: 73, lat: 40.7061, lng: -73.9969, address: '100 Gold St, New York, NY', lastUpdate: '4 min ago', checkIn: '07:05 AM' },
  { id: '6', name: 'Mike Williams', employeeId: 'EMP-0003', status: 'break', task: 'Engineering Review', battery: 28, lat: 40.7580, lng: -73.9855, address: '1515 Broadway, New York, NY', lastUpdate: '6 min ago', checkIn: '08:30 AM' },
  { id: '7', name: 'James Wilson', employeeId: 'EMP-0007', status: 'offline', task: '—', battery: 0, lat: 40.7580, lng: -73.9855, address: '—', lastUpdate: '2 hours ago', checkIn: '—' },
  { id: '8', name: 'Emily Davis', employeeId: 'EMP-0004', status: 'offline', task: '—', battery: 0, lat: 40.7580, lng: -73.9855, address: '—', lastUpdate: '3 hours ago', checkIn: '—' },
]

const statusConfig = {
  active: { dot: 'bg-success', ring: 'ring-success/30', label: 'Active' },
  break: { dot: 'bg-warning', ring: 'ring-warning/30', label: 'On Break' },
  offline: { dot: 'bg-danger', ring: 'ring-danger/30', label: 'Offline' },
}

export default function LiveLocationsPage() {
  const [search, setSearch] = useState('')
  const [autoRefresh, setAutoRefresh] = useState(true)

  useEffect(() => {
    if (!autoRefresh) return
    const interval = setInterval(() => {
      // Auto-refresh placeholder — would re-fetch API data
    }, 30000)
    return () => clearInterval(interval)
  }, [autoRefresh])

  const filtered = liveEmployees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.employeeId.toLowerCase().includes(search.toLowerCase())
  )

  const activeCount = liveEmployees.filter(e => e.status === 'active').length
  const breakCount = liveEmployees.filter(e => e.status === 'break').length
  const offlineCount = liveEmployees.filter(e => e.status === 'offline').length

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
      <PageHeader title="Live Locations" description="Real-time GPS tracking of field workers">
        <button
          onClick={() => setAutoRefresh(!autoRefresh)}
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-radius-button text-xs font-medium transition-colors cursor-pointer',
            autoRefresh ? 'bg-success/10 text-success' : 'bg-card-hover text-text-muted'
          )}
        >
          <RefreshCw size={12} className={cn(autoRefresh && 'animate-spin')} />
          Auto-refresh
        </button>
      </PageHeader>

      {/* Map + List split layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map area */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <div className="relative h-[500px] bg-card-hover flex items-center justify-center">
              {/* Map placeholder with markers */}
              <div className="absolute inset-0 bg-gradient-to-br from-card-hover to-card">
                {/* Simulated grid lines */}
                <svg className="w-full h-full opacity-5" viewBox="0 0 800 500">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <line key={`h${i}`} x1="0" y1={i * 25} x2="800" y2={i * 25} stroke="#fff" strokeWidth="0.5" />
                  ))}
                  {Array.from({ length: 32 }).map((_, i) => (
                    <line key={`v${i}`} x1={i * 25} y1="0" x2={i * 25} y2="500" stroke="#fff" strokeWidth="0.5" />
                  ))}
                </svg>
                {/* Employee markers */}
                {filtered.map((emp) => {
                  const x = ((emp.lng + 74.1) / 0.35) * 800
                  const y = ((40.78 - emp.lat) / 0.1) * 500
                  const cfg = statusConfig[emp.status]
                  return (
                    <div
                      key={emp.id}
                      className="absolute group cursor-pointer"
                      style={{ left: `${x}px`, top: `${y}px`, transform: 'translate(-50%, -50%)' }}
                    >
                      <div className={cn(
                        'w-4 h-4 rounded-full ring-2 ring-offset-2 ring-offset-card transition-transform hover:scale-150',
                        cfg.dot
                      )} />
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20">
                        <div className="bg-card border border-border-light rounded-radius-card px-3 py-2 shadow-dropdown whitespace-nowrap">
                          <p className="text-sm font-medium text-text-heading">{emp.name}</p>
                          <p className="text-xs text-text-muted">{emp.task}</p>
                          <p className="text-xs text-text-muted">Battery: {emp.battery}% | {emp.lastUpdate}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Map overlay info */}
              <div className="absolute top-3 left-3 flex items-center gap-2 bg-card/90 backdrop-blur-sm px-3 py-1.5 rounded-radius-button text-xs text-text-muted border border-border-light">
                <MapPin size={12} />
                New York City Area
              </div>
              <div className="absolute top-3 right-3 flex items-center gap-2 bg-card/90 backdrop-blur-sm px-3 py-1.5 rounded-radius-button text-xs text-text-muted border border-border-light">
                <Navigation size={12} />
                {filtered.length} trackers
              </div>
            </div>
          </Card>
        </div>

        {/* Employee list sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Field Workers</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="success">{activeCount} Active</Badge>
                <Badge variant="warning">{breakCount} Break</Badge>
                <Badge variant="danger">{offlineCount} Off</Badge>
              </div>
            </div>
            <div className="relative mt-3">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <Input
                placeholder="Search worker..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-9 text-sm"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border max-h-[440px] overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="p-6 text-center text-sm text-text-muted">No workers found</div>
              ) : (
                filtered.map((emp) => {
                  const cfg = statusConfig[emp.status]
                  return (
                    <div key={emp.id} className="flex items-start gap-3 p-3 hover:bg-card-hover transition-colors cursor-pointer">
                      <div className="relative shrink-0">
                        <Avatar fallback={emp.name.split(' ').map(n => n[0]).join('')} size="md" />
                        <div className={cn('absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ring-1 ring-card', cfg.dot)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-text-heading truncate">{emp.name}</span>
                          <span className={cn('text-[10px] font-medium uppercase', cfg.dot.replace('bg-', 'text-'))}>{cfg.label}</span>
                        </div>
                        <p className="text-xs text-text-muted truncate mt-0.5">{emp.task}</p>
                        <div className="flex items-center gap-3 mt-1 text-[11px] text-text-muted">
                          <div className="flex items-center gap-1">
                            <Battery size={10} className={emp.battery < 20 ? 'text-danger' : ''} />
                            {emp.battery}%
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={10} />
                            {emp.lastUpdate}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
