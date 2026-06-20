import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { KPICard } from '@/components/cards'
import { MapPin, Users, ChevronRight, X, Calendar, Clock, Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const kpiCards = [
  { label: 'Total Employees', value: '1,284' },
  { label: 'Present Today', value: '1,042' },
  { label: 'Absent', value: '89' },
  { label: 'Medical Leave', value: '76' },
  { label: 'Casual Leave', value: '34' },
  { label: 'Late Arrivals', value: '23' },
]

interface SiteTeam {
  name: string
  members: number
  lead: string
}

interface Site {
  id: string
  name: string
  location: string
  status: 'drawing-preparation' | 'drawing-document-preparation' | 'drawing-sent-approval' | 'drawing-approval' | 'cr-preparation' | 'waiting-for-inspection-completed' | 'rectification-report' | 'safety-satisfaction'
  progress: number
  teams: SiteTeam[]
  startDate: string
  deadline: string
  description: string
  manager: string
  totalEmployees: number
}

const sites: Site[] = [
  {
    id: 'ST-001', name: 'Solar Panel Installation', location: 'Madurai Industrial Estate',
    status: 'drawing-approval', progress: 65, startDate: 'Jun 1, 2026', deadline: 'Jun 30, 2026',
    description: 'Install the 25kW solar inverter. Complete cable routing and perform system testing before handover.',
    manager: 'Alex Johnson', totalEmployees: 7,
    teams: [
      { name: 'Alpha', members: 4, lead: 'John Smith' },
      { name: 'Bravo', members: 3, lead: 'Sarah Johnson' },
    ],
  },
  {
    id: 'ST-002', name: 'Cable Inspection', location: 'Chennai Site B',
    status: 'drawing-preparation', progress: 30, startDate: 'Jun 5, 2026', deadline: 'Jun 25, 2026',
    description: 'Inspect main power cables for wear and tear. Check grounding connections at all junctions.',
    manager: 'Maria Garcia', totalEmployees: 2,
    teams: [
      { name: 'Charlie', members: 2, lead: 'Michael Williams' },
    ],
  },
  {
    id: 'ST-003', name: 'Equipment Installation - Site C', location: 'Site C, Industrial Zone',
    status: 'drawing-document-preparation', progress: 80, startDate: 'May 20, 2026', deadline: 'Jun 20, 2026',
    description: 'Install and configure new monitoring equipment. Test all connections before powering on.',
    manager: 'Tom Chen', totalEmployees: 7,
    teams: [
      { name: 'Delta', members: 5, lead: 'Emily Davis' },
      { name: 'Echo', members: 2, lead: 'David Brown' },
    ],
  },
  {
    id: 'ST-004', name: 'Warehouse Inventory', location: 'Main Warehouse, Sector 12',
    status: 'safety-satisfaction', progress: 100, startDate: 'May 1, 2026', deadline: 'Jun 1, 2026',
    description: 'End-of-month inventory count at main warehouse. Coordinate with warehouse manager.',
    manager: 'Sarah Wilson', totalEmployees: 3,
    teams: [
      { name: 'Foxtrot', members: 3, lead: 'Lisa Anderson' },
    ],
  },
  {
    id: 'ST-005', name: 'Client Onboarding - TechVenture', location: 'TechVenture Office, Cyber City',
    status: 'cr-preparation', progress: 45, startDate: 'Jun 10, 2026', deadline: 'Jul 10, 2026',
    description: 'Onboard new client TechVenture Inc with initial setup. Prepare welcome kit and set up client portal access.',
    manager: 'Alex Johnson', totalEmployees: 6,
    teams: [
      { name: 'Golf', members: 2, lead: 'James Wilson' },
      { name: 'Hotel', members: 3, lead: 'Emma Taylor' },
      { name: 'India', members: 1, lead: 'Robert Jones' },
    ],
  },
  {
    id: 'ST-006', name: 'Safety Training Module', location: 'Head Office',
    status: 'rectification-report', progress: 15, startDate: 'Jun 1, 2026', deadline: 'Jun 28, 2026',
    description: 'Update the safety training materials with new guidelines. Cross-reference with existing materials.',
    manager: 'Maria Garcia', totalEmployees: 2,
    teams: [
      { name: 'Juliet', members: 2, lead: 'Olivia Garcia' },
    ],
  },
]

export default function DashboardPage() {
  const [selectedSite, setSelectedSite] = useState<Site | null>(null)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <PageHeader
        title="Dashboard"
        description="Real-time overview of your workforce"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {kpiCards.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <KPICard {...kpi} />
          </motion.div>
        ))}
      </div>

      {/* Sites Overview */}
      <div>
        <h2 className="text-base font-semibold text-text-heading mb-4">Sites Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sites.map((site, i) => (
            <motion.div
              key={site.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="bg-card border border-border-light rounded-radius-card p-4 hover:shadow-card-hover transition-all duration-200"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-text-heading truncate">{site.name}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin size={12} className="text-text-muted shrink-0" />
                    <span className="text-xs text-text-muted truncate">{site.location}</span>
                  </div>
                </div>
                <StatusBadge status={site.status} />
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-border rounded-full overflow-hidden mb-3">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${site.progress}%` }}
                />
              </div>

              {/* Teams */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-text-muted uppercase tracking-wider">Teams</p>
                {site.teams.map(team => (
                  <div
                    key={team.name}
                    className="flex items-center justify-between p-2 rounded-radius-button bg-card-hover"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Users size={14} className="text-text-muted shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-text-heading truncate">{team.name}</p>
                        <p className="text-[10px] text-text-muted truncate">Lead: {team.lead}</p>
                      </div>
                    </div>
                    <span className="text-xs text-text-muted bg-card border border-border-light px-2 py-0.5 rounded-full shrink-0">{team.members}</span>
                  </div>
                ))}
              </div>

              {/* Footer */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border-light">
                <span className="text-xs text-text-muted">{site.id}</span>
                <button
                  onClick={() => setSelectedSite(site)}
                  className="flex items-center gap-1 text-xs text-primary font-medium hover:text-primary-dark transition-colors cursor-pointer"
                >
                  View Details <ChevronRight size={12} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      {/* Site Detail Modal */}
      <AnimatePresence>
        {selectedSite && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setSelectedSite(null)}
            />
            <div className="fixed inset-0 z-50 overflow-y-auto pointer-events-none">
              <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.92, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-card border border-border rounded-radius-card w-full max-w-3xl overflow-hidden pointer-events-auto"
                onClick={e => e.stopPropagation()}
              >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border shrink-0 bg-card">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Building2 size={20} className="text-primary" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-text-heading">{selectedSite.name}</h2>
                    <div className="flex items-center gap-2 mt-0.5">
                      <StatusBadge status={selectedSite.status} />
                      <span className="text-xs text-text-muted">{selectedSite.id}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelectedSite(null)} className="p-2 rounded-radius-button text-text-muted hover:text-text-heading hover:bg-card-hover transition-colors cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <div className="p-4 space-y-5">
                {/* Description */}
                <p className="text-sm text-text">{selectedSite.description}</p>

                {/* Key details */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Start Date', value: selectedSite.startDate, icon: Calendar },
                    { label: 'Deadline', value: selectedSite.deadline, icon: Clock },
                    { label: 'Manager', value: selectedSite.manager, icon: Users },
                    { label: 'Employees Present', value: `${selectedSite.totalEmployees}`, icon: Users },
                  ].map((f) => {
                    const Icon = f.icon
                    return (
                      <div key={f.label} className="p-3 rounded-radius-button bg-card-hover flex items-center gap-3">
                        <Icon size={14} className="text-text-muted shrink-0" />
                        <div>
                          <p className="text-xs text-text-muted">{f.label}</p>
                          <p className="text-sm font-medium text-text-heading">{f.value}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 p-3 rounded-radius-button bg-card-hover">
                  <MapPin size={14} className="text-text-muted shrink-0" />
                  <span className="text-sm text-text">{selectedSite.location}</span>
                </div>

                {/* Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-text-muted">Progress</span>
                    <span className="text-xs font-semibold text-text-heading">{selectedSite.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full transition-all', selectedSite.progress === 100 ? 'bg-success' : 'bg-primary')}
                      style={{ width: `${selectedSite.progress}%` }}
                    />
                  </div>
                </div>

              {/* Teams */}
                <div>
                  <h4 className="text-sm font-semibold text-text-heading mb-3">Assigned Teams</h4>
                  <div className="space-y-2">
                    {selectedSite.teams.map(team => (
                      <div key={team.name} className="flex items-center justify-between p-3 rounded-radius-button border border-border-light">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Users size={16} className="text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-text-heading">{team.name}</p>
                            <p className="text-xs text-text-muted">Lead: {team.lead}</p>
                          </div>
                        </div>
                        <span className="text-xs text-text-muted bg-card-hover px-2.5 py-1 rounded-full">{team.members} members</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              </motion.div>
            </div>
          </div>
        </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
