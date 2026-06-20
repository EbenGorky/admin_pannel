import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Card, CardHeader, CardTitle, CardContent, Avatar, Input, Select, Tabs, TabsList, TabsTrigger, TabsContent, Button } from '@/components/ui'
import {
  CalendarClock, Clock,
  ChevronDown, ChevronRight, Search, X,
  MapPin, Phone, Battery, Briefcase, Layers, Hash, User,
  Grid3X3, List, MessageSquare, PhoneCall,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { generateMockEmployees } from '@/utils/mockData'
import type { Employee } from '@/types'

const allProfiles = generateMockEmployees(48)
const profileMap = new Map<string, Employee>(allProfiles.map(p => [p.id, p]))

const statCards = [
  { label: 'Total', value: '1,284' },
  { label: 'Present', value: '1,042' },
  { label: 'Absent', value: '89' },
  { label: 'Leave', value: '76' },
  { label: 'Permission', value: '34' },
  { label: 'Week Off', value: '28' },
  { label: 'Late', value: '23' },
  { label: 'Overtime', value: '34' },
]

import { KPICard } from '@/components/cards'

const departmentData = [
  { name: 'My Team', manager: 'Alex Johnson', total: 320, present: 278, absent: 18, leave: 14, permission: 6, overtime: 12, late: 8 },
  { name: 'General', manager: 'Maria Garcia', total: 156, present: 142, absent: 5, leave: 6, permission: 2, overtime: 4, late: 1 },
]

const employees = [
  { name: 'John Smith', id: 'EMP-0001', dept: 'My Team', status: 'active' as const, checkIn: '07:52 AM', checkOut: '—', hours: 5.2, break: 28, overtime: 0, gps: '40.7128°N, 74.0060°W' },
  { name: 'Sarah Johnson', id: 'EMP-0002', dept: 'My Team', status: 'break' as const, checkIn: '07:15 AM', checkOut: '—', hours: 4.8, break: 45, overtime: 0, gps: '40.7282°N, 73.7949°W' },
  { name: 'Mike Williams', id: 'EMP-0003', dept: 'My Team', status: 'active' as const, checkIn: '08:30 AM', checkOut: '—', hours: 3.5, break: 15, overtime: 0, gps: '40.7580°N, 73.9855°W' },
  { name: 'Emily Davis', id: 'EMP-0004', dept: 'General', status: 'offline' as const, checkIn: '—', checkOut: '—', hours: 0, break: 0, overtime: 0, gps: '—' },
  { name: 'David Brown', id: 'EMP-0005', dept: 'General', status: 'active' as const, checkIn: '06:45 AM', checkOut: '—', hours: 6.5, break: 22, overtime: 1.2, gps: '40.6892°N, 74.0445°W' },
  { name: 'Lisa Anderson', id: 'EMP-0006', dept: 'My Team', status: 'active' as const, checkIn: '07:30 AM', checkOut: '—', hours: 5.8, break: 30, overtime: 0.5, gps: '40.7484°N, 73.9857°W' },
  { name: 'James Wilson', id: 'EMP-0007', dept: 'General', status: 'on-leave' as const, checkIn: '—', checkOut: '—', hours: 0, break: 0, overtime: 0, gps: '—' },
  { name: 'Emma Taylor', id: 'EMP-0008', dept: 'My Team', status: 'active' as const, checkIn: '07:05 AM', checkOut: '—', hours: 6.2, break: 35, overtime: 0.8, gps: '40.7061°N, 73.9969°W' },
]

// Week matrix data
const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const weekDates = ['Jun 8', 'Jun 9', 'Jun 10', 'Jun 11', 'Jun 12', 'Jun 13', 'Jun 14']
const statusCodes = ['P', 'A', 'L', 'LT', 'E', 'M', 'W'] as const
type StatusCode = typeof statusCodes[number]

const statusCodeColors: Record<StatusCode, string> = {
  P: 'bg-success/20 text-success',
  A: 'bg-danger/20 text-danger',
  L: 'bg-warning/20 text-warning',
  LT: 'bg-warning/30 text-warning',
  E: 'bg-primary/20 text-primary',
  M: 'bg-info/20 text-info',
  W: 'bg-text-muted/20 text-text-muted',
}

const weekMatrix: { name: string; days: StatusCode[] }[] = [
  { name: 'John Smith', days: ['P', 'P', 'P', 'P', 'P', 'W', 'W'] },
  { name: 'Sarah Johnson', days: ['P', 'P', 'L', 'P', 'P', 'P', 'W'] },
  { name: 'Mike Williams', days: ['P', 'P', 'P', 'LT', 'P', 'W', 'W'] },
  { name: 'Emily Davis', days: ['P', 'P', 'P', 'P', 'E', 'W', 'W'] },
  { name: 'David Brown', days: ['P', 'M', 'P', 'P', 'P', 'W', 'W'] },
  { name: 'Lisa Anderson', days: ['A', 'P', 'P', 'P', 'P', 'W', 'W'] },
  { name: 'James Wilson', days: ['P', 'P', 'P', 'L', 'L', 'W', 'W'] },
  { name: 'Emma Taylor', days: ['P', 'P', 'P', 'P', 'P', 'P', 'W'] },
]

const statusCodeLegend: { code: StatusCode; label: string }[] = [
  { code: 'P', label: 'Present' },
  { code: 'A', label: 'Absent' },
  { code: 'L', label: 'Leave' },
  { code: 'LT', label: 'Late' },
  { code: 'E', label: 'Early' },
  { code: 'M', label: 'Missing' },
  { code: 'W', label: 'Week Off' },
]

export default function AttendancePage() {
  const [activeTab, setActiveTab] = useState('live')
  const [expandedDept, setExpandedDept] = useState<string | null>(null)
  const [selectedEmployee, setSelectedEmployee] = useState<typeof employees[number] | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [deptFilter, setDeptFilter] = useState('all')
  const [selectedDate, setSelectedDate] = useState('2026-06-15')
  const [liveView, setLiveView] = useState<'grid' | 'list'>('grid')
  const [mapEmployee, setMapEmployee] = useState<typeof employees[number] | null>(null)
  const [chatEmployee, setChatEmployee] = useState<typeof employees[number] | null>(null)

  const filteredEmployees = employees.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(searchQuery.toLowerCase()) || e.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDept = deptFilter === 'all' || e.dept.toLowerCase() === deptFilter.toLowerCase()
    return matchesSearch && matchesDept
  })

  const filteredDeptData = departmentData.filter(d => deptFilter === 'all' || d.name.toLowerCase() === deptFilter.toLowerCase())

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
      <PageHeader title="Attendance" description="Track employee attendance and working hours" />

      {/* Top filters + tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <Input placeholder="Search employee..." className="pl-8 h-9 text-sm" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        <Select className="h-9 text-sm w-[130px]" value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
          <option value="all">All Depts</option>
          <option value="my team">My Team</option>
          <option value="general">General</option>
        </Select>
        <input type="date" className="h-9 px-3 rounded-radius-input border border-border-light bg-card text-sm text-text-heading focus:outline-none focus:ring-2 focus:ring-primary/30" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
        <TabsList>
          {['live', 'timeline-view', 'overview'].map((tab) => (
            <TabsTrigger key={tab} value={tab} data-active={activeTab === tab}>
              {tab === 'live' ? 'Live' : tab.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </TabsTrigger>
          ))}
        </TabsList>
        {activeTab === 'live' && (
          <div className="flex items-center gap-2 bg-card border border-border-light rounded-radius-button p-1">
            <button
              onClick={() => setLiveView('grid')}
              className={cn('p-2 rounded-radius-button transition-colors cursor-pointer', liveView === 'grid' ? 'bg-primary text-white' : 'text-text-muted hover:text-text-heading')}
            >
              <Grid3X3 size={16} />
            </button>
            <button
              onClick={() => setLiveView('list')}
              className={cn('p-2 rounded-radius-button transition-colors cursor-pointer', liveView === 'list' ? 'bg-primary text-white' : 'text-text-muted hover:text-text-heading')}
            >
              <List size={16} />
            </button>
          </div>
        )}
      </div>

        {/* === LIVE TAB — real-time check-in status (matches worker app) === */}
        <TabsContent value="live">
          {/* Live summary bar */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            {[
              { label: 'Checked In', value: filteredEmployees.filter(e => e.status === 'active').length.toString() },
              { label: 'On Break', value: filteredEmployees.filter(e => e.status === 'break').length.toString() },
              { label: 'Offline', value: filteredEmployees.filter(e => e.status === 'offline').length.toString() },
              { label: 'On Leave', value: filteredEmployees.filter(e => e.status === 'on-leave').length.toString() },
            ].map((s) => (
              <KPICard key={s.label} label={s.label} value={s.value} />
            ))}
          </div>

          {/* Live employee view */}
          {liveView === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredEmployees.length === 0 ? (
              <div className="col-span-full text-center py-12 text-text-muted text-sm">No employees match your filters</div>
            ) : filteredEmployees
              .sort((a, b) => {
                const order = { active: 0, break: 1, offline: 2, 'on-leave': 3 }
                return (order[a.status] ?? 99) - (order[b.status] ?? 99)
              })
              .map((emp, i) => (
              <motion.div
                key={emp.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.03 }}
                onClick={() => setSelectedEmployee(emp)}
                className={cn(
                  'bg-card border rounded-radius-card p-4 hover:shadow-card-hover transition-all cursor-pointer',
                  emp.status === 'active' && 'border-success/30',
                  emp.status === 'break' && 'border-warning/30',
                  emp.status === 'offline' && 'border-border',
                )}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative">
                    <Avatar fallback={emp.name.split(' ').map(n => n[0]).join('')} size="md" />
                    {/* Live pulse indicator */}
                    <span className={cn(
                      'absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card',
                      emp.status === 'active' && 'bg-success animate-ping',
                      emp.status === 'break' && 'bg-warning',
                      emp.status === 'offline' && 'bg-text-muted',
                      emp.status === 'on-leave' && 'bg-text-muted',
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-text-heading truncate">{emp.name}</h4>
                      <StatusBadge status={emp.status} />
                    </div>
                    <p className="text-xs text-text-muted">{emp.id} · {emp.dept}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { label: 'Check In', value: emp.checkIn, highlight: emp.status === 'active' || emp.status === 'break' },
                    { label: 'Hours Today', value: `${emp.hours}h`, highlight: true },
                    { label: 'Break', value: `${emp.break}m`, highlight: emp.status === 'break' },
                    { label: 'Location', value: emp.gps, highlight: false },
                  ].map((f) => (
                    <div key={f.label} className={cn(
                      'p-2 rounded-radius-button',
                      f.highlight && (f.label === 'Hours Today' ? 'bg-success/5' : f.label === 'Check In' && emp.checkIn !== '—' ? 'bg-primary/5' : f.label === 'Break' && emp.status === 'break' ? 'bg-warning/5' : 'bg-card-hover') || 'bg-card-hover'
                    )}>
                      <p className="text-text-muted mb-0.5">{f.label}</p>
                      <p className={cn(
                        'text-text-heading font-medium truncate',
                        f.label === 'Hours Today' && 'text-success',
                        f.label === 'Check In' && emp.checkIn !== '—' && 'text-primary',
                      )}>{f.value}</p>
                    </div>
                  ))}
                  </div>
                  <div className="flex items-center gap-1 pt-3 border-t border-border mt-3">
                    <button onClick={e => { e.stopPropagation(); setChatEmployee(emp) }} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs text-text-muted hover:text-primary hover:bg-primary/5 rounded-radius-button transition-colors cursor-pointer">
                      <MessageSquare size={14} /> Message
                    </button>
                    <button onClick={e => e.stopPropagation()} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs text-text-muted hover:text-primary hover:bg-primary/5 rounded-radius-button transition-colors cursor-pointer">
                      <PhoneCall size={14} /> Call
                    </button>
                    <button onClick={e => { e.stopPropagation(); setMapEmployee(emp) }} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs text-text-muted hover:text-primary hover:bg-primary/5 rounded-radius-button transition-colors cursor-pointer">
                      <MapPin size={14} /> Map
                    </button>
                  </div>
                </motion.div>
            ))}
          </div>
          ) : (
          <div className="bg-card border border-border rounded-radius-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {['Employee', 'ID', 'Department', 'Status', 'Check In', 'Hours', 'Break', 'Location', 'Actions'].map(h => (
                      <th key={h} className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees
                    .sort((a, b) => {
                      const order = { active: 0, break: 1, offline: 2, 'on-leave': 3 }
                      return (order[a.status] ?? 99) - (order[b.status] ?? 99)
                    })
                    .map((emp, i) => (
                    <motion.tr
                      key={emp.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2, delay: i * 0.02 }}
                      className="border-b border-border last:border-0 hover:bg-card-hover transition-colors cursor-pointer"
                      onClick={() => setSelectedEmployee(emp)}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Avatar fallback={emp.name.split(' ').map(n => n[0]).join('')} size="sm" />
                          <span className="text-sm font-medium text-text-heading whitespace-nowrap">{emp.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-text-muted whitespace-nowrap">{emp.id}</td>
                      <td className="px-4 py-3 text-sm text-text whitespace-nowrap">{emp.dept}</td>
                      <td className="px-4 py-3"><StatusBadge status={emp.status} /></td>
                      <td className="px-4 py-3 text-sm text-text-heading whitespace-nowrap">{emp.checkIn}</td>
                      <td className="px-4 py-3 text-sm text-success font-medium whitespace-nowrap">{emp.hours}h</td>
                      <td className="px-4 py-3 text-sm text-text-muted whitespace-nowrap">{emp.break}m</td>
                      <td className="px-4 py-3 text-sm text-text-muted max-w-[140px] truncate">{emp.gps}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                          <button onClick={e => { e.stopPropagation(); setChatEmployee(emp) }} className="p-1.5 rounded-radius-button text-text-muted hover:text-primary hover:bg-primary/5 transition-colors cursor-pointer">
                            <MessageSquare size={14} />
                          </button>
                          <button className="p-1.5 rounded-radius-button text-text-muted hover:text-primary hover:bg-primary/5 transition-colors cursor-pointer">
                            <PhoneCall size={14} />
                          </button>
                          <button onClick={e => { e.stopPropagation(); setMapEmployee(emp) }} className="p-1.5 rounded-radius-button text-text-muted hover:text-primary hover:bg-primary/5 transition-colors cursor-pointer">
                            <MapPin size={14} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          )}
        </TabsContent>





        {/* === TIMELINE VIEW TAB === */}
        <TabsContent value="timeline-view">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3 whitespace-nowrap sticky left-0 bg-card z-10">Employee</th>
                      {weekDays.map((day, i) => (
                        <th key={day} className="text-center text-xs font-medium text-text-muted uppercase tracking-wider px-3 py-3 min-w-[80px]">
                          <div>{day}</div>
                          <div className="text-[10px] text-text-muted/60">{weekDates[i]}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {weekMatrix.map((row) => (
                      <tr key={row.name} className="border-b border-border hover:bg-card-hover/50 transition-colors">
                        <td className="px-4 py-3 sticky left-0 bg-card z-10">
                          <div className="flex items-center gap-2">
                            <Avatar fallback={row.name.split(' ').map(n => n[0]).join('')} size="sm" />
                            <span className="text-sm font-medium text-text-heading whitespace-nowrap">{row.name}</span>
                          </div>
                        </td>
                        {row.days.map((code, i) => (
                          <td key={i} className="text-center px-3 py-3">
                            <span className={cn(
                              'inline-flex items-center justify-center w-7 h-7 rounded-md text-xs font-bold',
                              statusCodeColors[code]
                            )}>
                              {code}
                            </span>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 px-4 py-3 border-t border-border">
                <span className="text-xs text-text-muted">Legend:</span>
                {statusCodeLegend.map(({ code, label }) => (
                  <div key={code} className="flex items-center gap-1.5">
                    <span className={cn('w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center', statusCodeColors[code])}>{code}</span>
                    <span className="text-[11px] text-text-muted">{label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* === OVERVIEW TAB === */}
        <TabsContent value="overview">
          {/* Stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3 mb-6">
            {statCards.map((stat) => (
              <KPICard key={stat.label} label={stat.label} value={stat.value} />
            ))}
          </div>

          {/* Department summaries */}
          <Card>
            <CardHeader><CardTitle>Department Summary</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      {['Department', 'Manager', 'Total', 'Present', 'Absent', 'Leave', 'Permission', 'Overtime', 'Late'].map(h => (
                        <th key={h} className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-3 py-2.5 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDeptData.map((dept) => {
                      const isExpanded = expandedDept === dept.name
                      return (
                        <>
                          <tr
                            key={dept.name}
                            className="border-b border-border hover:bg-card-hover transition-colors cursor-pointer"
                            onClick={() => setExpandedDept(isExpanded ? null : dept.name)}
                          >
                            <td className="px-3 py-3 flex items-center gap-2">
                              {isExpanded ? <ChevronDown size={14} className="text-text-muted" /> : <ChevronRight size={14} className="text-text-muted" />}
                              <span className="text-sm font-medium text-text-heading">{dept.name}</span>
                            </td>
                            <td className="px-3 py-3 text-sm text-text-muted">{dept.manager}</td>
                            <td className="px-3 py-3 text-sm text-text-heading font-medium">{dept.total}</td>
                            <td className="px-3 py-3 text-sm text-success font-medium">{dept.present}</td>
                            <td className="px-3 py-3 text-sm text-danger">{dept.absent}</td>
                            <td className="px-3 py-3 text-sm text-warning">{dept.leave}</td>
                            <td className="px-3 py-3 text-sm text-info">{dept.permission}</td>
                            <td className="px-3 py-3 text-sm text-primary">{dept.overtime}</td>
                            <td className="px-3 py-3 text-sm text-warning">{dept.late}</td>
                          </tr>
                          {isExpanded && (
                            <tr key={`${dept.name}-details`}>
                              <td colSpan={9} className="px-3 py-3 bg-card-hover/50">
                                <div className="flex gap-6 p-3">
                                  <div className="flex-1">
                                    <p className="text-xs text-text-muted mb-2">Attendance Rate</p>
                                    <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                                      <div className="h-full rounded-full bg-success" style={{ width: `${(dept.present / dept.total) * 100}%` }} />
                                    </div>
                                    <p className="text-xs text-text-heading mt-1">{((dept.present / dept.total) * 100).toFixed(1)}%</p>
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-xs text-text-muted mb-2">Absenteeism Rate</p>
                                    <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                                      <div className="h-full rounded-full bg-danger" style={{ width: `${((dept.absent + dept.leave) / dept.total) * 100}%` }} />
                                    </div>
                                    <p className="text-xs text-text-heading mt-1">{((dept.absent + dept.leave) / dept.total * 100).toFixed(1)}%</p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Employee detail modal */}
      <AnimatePresence>
        {selectedEmployee && (() => {
          const profile = profileMap.get(selectedEmployee.id)
          return (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setSelectedEmployee(null)}
            />
            <div className="fixed inset-0 z-50 overflow-y-auto pointer-events-none">
              <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.92, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-card border border-border rounded-radius-card w-full max-w-lg overflow-hidden pointer-events-auto"
                onClick={e => e.stopPropagation()}
              >
                {/* Modal header */}
                <div className="flex items-center justify-between p-4 border-b border-border shrink-0 bg-card">
                  <div className="flex items-center gap-3">
                    <Avatar fallback={selectedEmployee.name.split(' ').map(n => n[0]).join('')} size="md" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-semibold text-text-heading">{selectedEmployee.name}</h2>
                        <StatusBadge status={selectedEmployee.status} />
                      </div>
                      <p className="text-xs text-text-muted">{selectedEmployee.id} · {selectedEmployee.dept}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedEmployee(null)} className="p-2 rounded-radius-button text-text-muted hover:text-text-heading hover:bg-card-hover transition-colors cursor-pointer">
                    <X size={16} />
                  </button>
                </div>

                <div className="p-4 space-y-5">
                  {/* Attendance details */}
                  <div>
                    <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2.5">Attendance</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: 'Check In', value: selectedEmployee.checkIn },
                        { label: 'Check Out', value: selectedEmployee.checkOut },
                        { label: 'Hours Today', value: `${selectedEmployee.hours}h` },
                        { label: 'Break', value: `${selectedEmployee.break}m` },
                        { label: 'Overtime', value: `${selectedEmployee.overtime}h` },
                        { label: 'GPS', value: selectedEmployee.gps },
                      ].map(f => (
                        <div key={f.label} className="p-2.5 rounded-radius-button bg-card-hover">
                          <p className="text-[10px] text-text-muted mb-0.5">{f.label}</p>
                          <p className="text-sm text-text-heading font-medium truncate">{f.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Profile / Department details */}
                  {profile && (
                    <div>
                      <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2.5">Profile Details</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { label: 'Designation', value: profile.designation, icon: Briefcase },
                          { label: 'Team', value: profile.team, icon: Layers },
                          { label: 'Shift', value: profile.shift, icon: Clock },
                          { label: 'Manager', value: profile.manager, icon: User },
                          { label: 'Phone', value: profile.phone, icon: Phone },
                          { label: 'Email', value: profile.email, icon: Hash },
                          { label: 'Battery', value: `${profile.battery ?? '--'}%`, icon: Battery },
                          { label: 'Joined', value: profile.joinDate, icon: CalendarClock },
                        ].map(f => {
                          const Icon = f.icon
                          return (
                            <div key={f.label} className="p-2.5 rounded-radius-button bg-card-hover">
                              <div className="flex items-center gap-1.5 mb-1">
                                <Icon size={11} className="text-text-muted" />
                                <p className="text-[10px] text-text-muted">{f.label}</p>
                              </div>
                              <p className="text-sm text-text-heading font-medium truncate">{f.value}</p>
                            </div>
                          )
                        })}
                      </div>

                      {/* Location map link */}
                      {profile.location && (
                        <div className="mt-3 p-2.5 rounded-radius-button bg-primary/5 border border-primary/10">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <MapPin size={11} className="text-primary" />
                            <p className="text-[10px] text-text-muted">Site Location</p>
                          </div>
                          <p className="text-sm text-text-heading">{profile.location.address}</p>
                          <p className="text-xs text-text-muted mt-0.5">{profile.location.lat.toFixed(4)}, {profile.location.lng.toFixed(4)}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
            </div>
          </>
          )
        })()}
      </AnimatePresence>

      {/* Map modal */}
      <AnimatePresence>
        {mapEmployee && (() => {
          const profile = profileMap.get(mapEmployee.id)
          const lat = profile?.location?.lat
          const lng = profile?.location?.lng
          const hasCoords = lat !== undefined && lng !== undefined
          return (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40"
                onClick={() => setMapEmployee(null)}
              />
              <div className="fixed inset-0 z-50 overflow-y-auto pointer-events-none">
                <div className="flex min-h-full items-center justify-center p-4">
                <motion.div
                  initial={{ scale: 0.92, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.92, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="bg-card border border-border rounded-radius-card w-full max-w-lg overflow-hidden pointer-events-auto"
                  onClick={e => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between p-4 border-b border-border shrink-0 bg-card">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                        <MapPin size={16} className="text-primary" />
                      </div>
                      <div>
                        <h2 className="text-base font-semibold text-text-heading">{mapEmployee.name}</h2>
                        <p className="text-xs text-text-muted">GPS Location</p>
                      </div>
                    </div>
                    <button onClick={() => setMapEmployee(null)} className="p-2 rounded-radius-button text-text-muted hover:text-text-heading hover:bg-card-hover transition-colors cursor-pointer">
                      <X size={16} />
                    </button>
                  </div>
                  <div className="p-4">
                    {hasCoords ? (
                      <>
                        <div className="rounded-radius-card overflow-hidden border border-border-light mb-3">
                          <iframe
                            title="Employee Location"
                            width="100%"
                            height="350"
                            frameBorder="0"
                            scrolling="no"
                            src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01},${lat - 0.01},${lng + 0.01},${lat + 0.01}&layer=mapnik&marker=${lat},${lng}`}
                            className="block"
                          />
                        </div>
                        <div className="p-3 rounded-radius-button bg-primary/5 border border-primary/10">
                          <p className="text-sm text-text-heading">{profile?.location?.address}</p>
                          <p className="text-xs text-text-muted mt-0.5">{lat.toFixed(4)}, {lng.toFixed(4)}</p>
                        </div>
                      </>
                    ) : (
                      <div className="py-12 text-center text-sm text-text-muted">No location data available for this employee.</div>
                    )}
                  </div>
                </motion.div>
              </div>
              </div>
            </>
          )
        })()}
      </AnimatePresence>

      {/* Chat modal */}
      <AnimatePresence>
        {chatEmployee && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setChatEmployee(null)}
            />
            <div className="fixed inset-0 z-50 overflow-y-auto pointer-events-none">
              <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.92, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-card border border-border rounded-radius-card w-full max-w-lg overflow-hidden pointer-events-auto"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between p-4 border-b border-border shrink-0 bg-card">
                  <div className="flex items-center gap-3">
                    <Avatar fallback={chatEmployee.name.split(' ').map(n => n[0]).join('')} size="md" />
                    <div>
                      <h2 className="text-base font-semibold text-text-heading">{chatEmployee.name}</h2>
                      <p className="text-xs text-text-muted">{chatEmployee.id}</p>
                    </div>
                  </div>
                  <button onClick={() => setChatEmployee(null)} className="p-2 rounded-radius-button text-text-muted hover:text-text-heading hover:bg-card-hover transition-colors cursor-pointer">
                    <X size={16} />
                  </button>
                </div>
                <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
                  {[
                    { text: 'Hey, checking in for today\'s shift.', time: '07:10 AM', sent: true },
                    { text: 'Got it. Site location is Madurai Industrial Estate.', time: '07:12 AM', sent: false },
                    { text: 'On my way. ETA 15 minutes.', time: '07:15 AM', sent: true },
                    { text: 'Update — reached site. Starting cable inspection.', time: '07:45 AM', sent: true },
                    { text: 'Good. Let me know if you need any equipment.', time: '07:50 AM', sent: false },
                    { text: 'Will do, thanks!', time: '07:52 AM', sent: true },
                  ].map((msg, i) => (
                    <div key={i} className={cn('flex', msg.sent ? 'justify-end' : 'justify-start')}>
                      <div className={cn(
                        'max-w-[75%] px-3 py-2 rounded-radius-button text-sm',
                        msg.sent ? 'bg-primary text-white' : 'bg-card-hover text-text'
                      )}>
                        <p>{msg.text}</p>
                        <p className={cn('text-[10px] mt-0.5', msg.sent ? 'text-white/60' : 'text-text-muted')}>{msg.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-border flex items-center gap-2">
                  <Input placeholder="Type a message..." className="flex-1" />
                  <Button type="button">Send</Button>
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
