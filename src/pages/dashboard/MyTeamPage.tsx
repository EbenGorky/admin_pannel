import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Input, Select, Card, CardContent, Avatar, Button } from '@/components/ui'
import { EmployeeCard } from '@/components/cards/EmployeeCard'
import { EmployeeTable } from '@/components/tables/EmployeeTable'
import { generateMockEmployees } from '@/utils/mockData'
import { Grid3X3, List, Search, X, Briefcase, Layers, Clock, User, Phone, Hash, Battery, CalendarClock, MapPin, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Employee } from '@/types'

const employees = generateMockEmployees(48)
const departments = ['My Team', 'General']
const statuses: Employee['status'][] = ['active', 'absent', 'on-leave', 'break', 'offline']

interface RecruitForm {
  department: string
  name: string
  phone: string
  email: string
  experience: string
  address: string
  joinDate: string
}

function emptyRecruitForm(): RecruitForm {
  return { department: 'My Team', name: '', phone: '', email: '', experience: '', address: '', joinDate: '' }
}

const phoneRegex = /^\d{10}$/
const emailRegex = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/

let recruitIdCounter = 49

export default function MyTeamPage() {
  const [profileEmployee, setProfileEmployee] = useState<Employee | null>(null)
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showRecruitForm, setShowRecruitForm] = useState(false)
  const [recruitForm, setRecruitForm] = useState<RecruitForm>(emptyRecruitForm())
  const [recruitErrors, setRecruitErrors] = useState<Partial<Record<keyof RecruitForm, string>>>({})
  const [chatEmployee, setChatEmployee] = useState<Employee | null>(null)

  const filtered = useMemo(() => {
    return employees.filter((e) => {
      if (search && !e.name.toLowerCase().includes(search.toLowerCase()) && !e.employeeId.toLowerCase().includes(search.toLowerCase())) return false
      if (deptFilter !== 'all' && e.department !== deptFilter) return false
      if (statusFilter !== 'all' && e.status !== statusFilter) return false
      return true
    })
  }, [search, deptFilter, statusFilter])

  function validateRecruitForm(): boolean {
    const errs: Partial<Record<keyof RecruitForm, string>> = {}
    if (!recruitForm.name.trim()) errs.name = 'Name is required'
    if (!phoneRegex.test(recruitForm.phone.replace(/\D/g, ''))) errs.phone = 'Phone must be exactly 10 digits'
    if (!emailRegex.test(recruitForm.email)) errs.email = 'Invalid email format (e.g. name@example.com)'
    if (!recruitForm.joinDate.trim()) errs.joinDate = 'Join date is required'
    setRecruitErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleRecruitSubmit() {
    if (!validateRecruitForm()) return
    const newEmployee: Employee = {
      id: `EMP-${String(recruitIdCounter++).padStart(4, '0')}`,
      name: recruitForm.name,
      employeeId: `EMP-${String(recruitIdCounter - 1).padStart(4, '0')}`,
      email: recruitForm.email,
      phone: recruitForm.phone,
      department: recruitForm.department,
      team: 'General',
      shift: 'Morning',
      designation: '',
      experience: recruitForm.experience,
      manager: 'Alex Johnson',
      status: 'active',
      todayHours: 0,
      breakTime: 0,
      overtime: 0,
      late: 0,
      battery: 100,
      joinDate: recruitForm.joinDate,
      location: { lat: 40.7128, lng: -74.006, address: recruitForm.address || 'New York, NY' },
    }
    employees.push(newEmployee)
    setShowRecruitForm(false)
    setRecruitForm(emptyRecruitForm())
    setRecruitErrors({})
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
      <PageHeader title="Departments" description="View and manage your field workforce">
        <Button onClick={() => setShowRecruitForm(true)}><Plus size={16} /> New Employee</Button>
        {/* View toggle */}
        <div className="flex items-center gap-2 bg-card border border-border-light rounded-radius-button p-1">
          <button
            onClick={() => setView('grid')}
            className={cn('p-2 rounded-radius-button transition-colors cursor-pointer', view === 'grid' ? 'bg-primary text-white' : 'text-text-muted hover:text-text-heading')}
          >
            <Grid3X3 size={16} />
          </button>
          <button
            onClick={() => setView('list')}
            className={cn('p-2 rounded-radius-button transition-colors cursor-pointer', view === 'list' ? 'bg-primary text-white' : 'text-text-muted hover:text-text-heading')}
          >
            <List size={16} />
          </button>
        </div>
      </PageHeader>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-3 mb-6 sticky top-0 z-20 bg-bg pb-3 -mt-3 pt-3">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <Input
            placeholder="Search name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-9 text-sm"
          />
        </div>
        <Select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="h-9 text-sm w-[130px]">
          <option value="all">All Depts</option>
          {departments.map(d => <option key={d} value={d}>{d}</option>)}
        </Select>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-9 text-sm w-[120px]">
          <option value="all">All Status</option>
          {statuses.map(s => <option key={s} value={s} className="capitalize">{s.replace('-', ' ')}</option>)}
        </Select>
        <span className="text-xs text-text-muted whitespace-nowrap">{filtered.length} of {employees.length}</span>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="p-12 flex flex-col items-center justify-center gap-3">
            <div className="w-16 h-16 rounded-full bg-card-hover flex items-center justify-center">
              <Search size={24} className="text-text-muted" />
            </div>
            <p className="text-text-muted text-sm">No employees match your filters</p>
          </CardContent>
        </Card>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((emp, i) => (
            <div key={emp.id} onClick={() => setProfileEmployee(emp)} className="cursor-pointer">
              <EmployeeCard employee={emp} index={i} onMessage={setChatEmployee} />
            </div>
          ))}
        </div>
      ) : (
        <EmployeeTable employees={filtered} onSelect={setProfileEmployee} />
      )}
      {/* Recruit form modal */}
      <AnimatePresence>
        {showRecruitForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowRecruitForm(false)}
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
                <h2 className="text-base font-semibold text-text-heading">New Employee</h2>
                <button onClick={() => setShowRecruitForm(false)} className="p-2 rounded-radius-button text-text-muted hover:text-text-heading hover:bg-card-hover transition-colors cursor-pointer">
                  <X size={16} />
                </button>
              </div>

              <div className="p-4 space-y-4">
                <div>
                  <label className="text-xs font-medium text-text-muted mb-1.5 block">Department</label>
                  <Select value={recruitForm.department} onChange={e => setRecruitForm(f => ({ ...f, department: e.target.value }))} className="h-10 text-sm w-full">
                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium text-text-muted mb-1.5 block">Full Name</label>
                  <Input placeholder="Enter full name" value={recruitForm.name} onChange={e => setRecruitForm(f => ({ ...f, name: e.target.value }))} />
                  {recruitErrors.name && <p className="text-xs text-danger mt-1">{recruitErrors.name}</p>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-text-muted mb-1.5 block">Phone Number</label>
                    <Input placeholder="10-digit number" value={recruitForm.phone} onChange={e => setRecruitForm(f => ({ ...f, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))} />
                    {recruitErrors.phone && <p className="text-xs text-danger mt-1">{recruitErrors.phone}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-medium text-text-muted mb-1.5 block">Email</label>
                    <Input placeholder="name@example.com" value={recruitForm.email} onChange={e => setRecruitForm(f => ({ ...f, email: e.target.value }))} />
                    {recruitErrors.email && <p className="text-xs text-danger mt-1">{recruitErrors.email}</p>}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-text-muted mb-1.5 block">Experience</label>
                  <Input placeholder="e.g. 5 years" value={recruitForm.experience} onChange={e => setRecruitForm(f => ({ ...f, experience: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-muted mb-1.5 block">Address</label>
                  <textarea
                    className="w-full h-16 rounded-radius-input border border-border-light bg-card px-3 py-2 text-sm text-text-heading placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
                    placeholder="Enter address"
                    value={recruitForm.address}
                    onChange={e => setRecruitForm(f => ({ ...f, address: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-muted mb-1.5 block">Join Date</label>
                  <input
                    type="date"
                    className="w-full h-10 rounded-radius-input border border-border-light bg-card px-3 text-sm text-text-heading focus:outline-none focus:ring-2 focus:ring-primary/30"
                    value={recruitForm.joinDate}
                    onChange={e => setRecruitForm(f => ({ ...f, joinDate: e.target.value }))}
                  />
                  {recruitErrors.joinDate && <p className="text-xs text-danger mt-1">{recruitErrors.joinDate}</p>}
                </div>
              </div>

              <div className="p-4 border-t border-border shrink-0 bg-card">
                <Button onClick={handleRecruitSubmit} className="w-full">Add Employee</Button>
              </div>
              </motion.div>
            </div>
          </div>
        </>
        )}
      </AnimatePresence>

      {/* Profile detail modal */}
      <AnimatePresence>
        {profileEmployee && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setProfileEmployee(null)}
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
                  <Avatar fallback={profileEmployee.name.split(' ').map(n => n[0]).join('')} size="md" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-semibold text-text-heading">{profileEmployee.name}</h2>
                      <StatusBadge status={profileEmployee.status} />
                    </div>
                    <p className="text-xs text-text-muted">{profileEmployee.employeeId} · {profileEmployee.department}</p>
                  </div>
                </div>
                <button onClick={() => setProfileEmployee(null)} className="p-2 rounded-radius-button text-text-muted hover:text-text-heading hover:bg-card-hover transition-colors cursor-pointer">
                  <X size={16} />
                </button>
              </div>

              <div className="p-4 space-y-4">
                <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2.5">Personal Details</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Designation', value: profileEmployee.designation, icon: Briefcase },
                    { label: 'Team', value: profileEmployee.team, icon: Layers },
                    { label: 'Shift', value: profileEmployee.shift, icon: Clock },
                    { label: 'Manager', value: profileEmployee.manager, icon: User },
                    { label: 'Phone', value: profileEmployee.phone, icon: Phone },
                    { label: 'Email', value: profileEmployee.email, icon: Hash },
                    { label: 'Battery', value: `${profileEmployee.battery ?? '--'}%`, icon: Battery },
                    { label: 'Joined', value: profileEmployee.joinDate, icon: CalendarClock },
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

                {profileEmployee.location && (
                  <div className="p-2.5 rounded-radius-button bg-primary/5 border border-primary/10">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <MapPin size={11} className="text-primary" />
                      <p className="text-[10px] text-text-muted">Site Location</p>
                    </div>
                    <p className="text-sm text-text-heading">{profileEmployee.location.address}</p>
                    <p className="text-xs text-text-muted mt-0.5">{profileEmployee.location.lat.toFixed(4)}, {profileEmployee.location.lng.toFixed(4)}</p>
                  </div>
                )}
              </div>
              </motion.div>
            </div>
          </div>
        </>
        )}
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
                      <p className="text-xs text-text-muted">{chatEmployee.employeeId}</p>
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
                    { text: 'Update — reached site. Starting work.', time: '07:45 AM', sent: true },
                    { text: 'Good. Let me know if you need anything.', time: '07:50 AM', sent: false },
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
