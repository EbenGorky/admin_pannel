import { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Card, CardHeader, CardTitle, CardContent, Avatar, Tabs, TabsList, TabsTrigger, TabsContent, Badge } from '@/components/ui'
import { generateEmployeeById } from '@/utils/mockData'
import { BarChart } from '@/components/charts'
import {
  ArrowLeft, Mail, Phone, MapPin, Calendar, Building2, Users, Clock,
  Briefcase, Download, CheckCircle, XCircle, FileText, Timer, TrendingUp,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const mockAttendance = Array.from({ length: 30 }, (_, i) => ({
  date: `Jun ${i + 1}, 2026`,
  checkIn: `${6 + Math.floor(Math.random() * 3)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')} AM`,
  checkOut: `${4 + Math.floor(Math.random() * 3)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')} PM`,
  status: (['present', 'present', 'present', 'present', 'present', 'present', 'absent', 'late', 'leave'] as const)[Math.floor(Math.random() * 9)],
  hours: +(7 + Math.random() * 2).toFixed(1),
  breakTime: Math.floor(Math.random() * 45 + 15),
  overtime: Math.floor(Math.random() * 60),
  lateMinutes: Math.floor(Math.random() * 30),
}))

const monthlyHours = Array.from({ length: 12 }, (_, i) => ({
  label: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
  value: +(140 + Math.random() * 60).toFixed(0),
}))

const leaveBalance = [
  { type: 'Leave', total: 24, planned: 4, availed: 8, remaining: 12 },
  { type: 'Medical', total: 10, used: 3, remaining: 7 },
  { type: 'LOP', total: 6, used: 1, remaining: 5 },
]

const leaveHistory = [
  { date: 'Jun 8-10, 2026', type: 'LOP', status: 'approved' as const, days: 3 },
  { date: 'May 5, 2026', type: 'Leave', status: 'approved' as const, days: 1 },
  { date: 'Apr 20-24, 2026', type: 'Medical', status: 'approved' as const, days: 5 },
  { date: 'Mar 14, 2026', type: 'Leave', status: 'rejected' as const, days: 1 },
]

const assignedTasks = [
  { title: 'Site Inspection - Building A', status: 'in-progress' as const, due: 'Jun 18', priority: 'high' as const },
  { title: 'Equipment Calibration', status: 'assigned' as const, due: 'Jun 20', priority: 'medium' as const },
  { title: 'Customer Report - Weekly', status: 'completed' as const, due: 'Jun 12', priority: 'medium' as const },
  { title: 'Inventory Audit', status: 'completed' as const, due: 'Jun 10', priority: 'low' as const },
  { title: 'Safety Training', status: 'cancelled' as const, due: 'Jun 5', priority: 'high' as const },
]

const crmMeetings = [
  { customer: 'Acme Corp', date: 'Jun 12, 2026', type: 'Site Visit', status: 'completed' as const },
  { customer: 'TechVenture Inc', date: 'Jun 15, 2026', type: 'Review Meeting', status: 'scheduled' as const },
  { customer: 'GreenEnergy Ltd', date: 'Jun 8, 2026', type: 'Installation', status: 'completed' as const },
  { customer: 'BuildRight Co', date: 'Jun 3, 2026', type: 'Inspection', status: 'completed' as const },
]

const payslips = [
  { month: 'May 2026', amount: 4850, status: 'paid' as const, generated: 'Jun 1, 2026' },
  { month: 'April 2026', amount: 4850, status: 'paid' as const, generated: 'May 1, 2026' },
  { month: 'March 2026', amount: 4620, status: 'paid' as const, generated: 'Apr 1, 2026' },
  { month: 'February 2026', amount: 4850, status: 'generated' as const, generated: 'Mar 1, 2026' },
]

export default function EmployeesPage() {
  const { id } = useParams<{ id: string }>()
  const employee = useMemo(() => generateEmployeeById(id || 'EMP-0001'), [id])
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { value: 'overview', label: 'Overview' },
    { value: 'attendance', label: 'Attendance' },
    { value: 'working-hours', label: 'Working Hours' },
    { value: 'leaves', label: 'Leaves' },
    { value: 'tasks', label: 'Tasks' },
    { value: 'crm', label: 'CRM' },
    { value: 'payslips', label: 'Payslips' },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
      {/* Back button + header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/app/my-team"
          className="p-2 rounded-radius-button text-text-muted hover:text-text-heading hover:bg-card-hover transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div className="flex items-center gap-4">
          <Avatar fallback={employee.name.split(' ').map(n => n[0]).join('')} size="lg" />
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-text-heading">{employee.name}</h1>
              <StatusBadge status={employee.status} />
            </div>
            <p className="text-sm text-text-muted">{employee.designation} · {employee.department} · {employee.employeeId}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 flex-wrap">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} data-active={activeTab === tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* === OVERVIEW TAB === */}
        <TabsContent value="overview">
          {/* Worker Dashboard Summary — matches mobile app's info cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              { title: "Today's Working Hours", value: `${employee.todayHours?.toFixed(1) || '0.0'} hrs`, icon: Timer, color: 'text-primary', bg: 'bg-primary/5' },
              { title: 'Monthly Working Hours', value: `${(employee.todayHours ? employee.todayHours * 22 : 145).toFixed(0)}:30 hrs`, icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/5' },
              { title: 'Total Overtime (This Month)', value: `${employee.overtime || 0}m`, icon: Clock, color: 'text-warning', bg: 'bg-warning/5' },
            ].map((stat) => {
              const Icon = stat.icon
              return (
                <Card key={stat.title}>
                  <CardContent className="p-5">
                    <p className="text-xs text-text-muted mb-2">{stat.title}</p>
                    <div className="flex items-center gap-3">
                      <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', stat.bg)}>
                        <Icon size={18} className={stat.color} />
                      </div>
                      <span className="text-xl font-bold text-text-heading">{stat.value}</span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { label: 'Full Name', value: employee.name, icon: null },
                    { label: 'Employee ID', value: employee.employeeId, icon: null },
                    { label: 'Department', value: employee.department, icon: Building2 },
                    { label: 'Designation', value: employee.designation, icon: Briefcase },
                    { label: 'Team', value: employee.team, icon: Users },
                    { label: 'Shift', value: employee.shift, icon: Clock },
                    { label: 'Manager', value: employee.manager, icon: Users },
                    { label: 'Join Date', value: employee.joinDate, icon: Calendar },
                    { label: 'Email', value: employee.email, icon: Mail },
                    { label: 'Phone', value: employee.phone, icon: Phone },
                  ].map((field) => (
                    <div key={field.label} className="flex items-center gap-3">
                      {field.icon && <field.icon size={14} className="text-text-muted shrink-0" />}
                      <div>
                        <p className="text-xs text-text-muted">{field.label}</p>
                        <p className="text-sm text-text-heading font-medium">{field.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Quick Stats</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: 'Today Hours', value: `${employee.todayHours?.toFixed(1) || '0.0'}h`, icon: Clock, color: 'text-primary' },
                  { label: 'Overtime', value: `${employee.overtime || 0}m`, icon: Clock, color: 'text-info' },
                  { label: 'Break Time', value: `${employee.breakTime || 0}m`, icon: Clock, color: 'text-warning' },
                  { label: 'Late Arrivals', value: `${employee.late || 0}`, icon: Clock, color: 'text-danger' },
                ].map((stat) => {
                  const Icon = stat.icon
                  return (
                    <div key={stat.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div className="flex items-center gap-2">
                        <Icon size={14} className={stat.color} />
                        <span className="text-sm text-text-muted">{stat.label}</span>
                      </div>
                      <span className="text-sm font-semibold text-text-heading">{stat.value}</span>
                    </div>
                  )
                })}
                {employee.location && (
                  <div className="flex items-start gap-2 pt-1">
                    <MapPin size={14} className="text-text-muted mt-0.5" />
                    <div>
                      <p className="text-xs text-text-muted">Current Location</p>
                      <p className="text-sm text-text-heading">{employee.location.address}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* === ATTENDANCE TAB === */}
        <TabsContent value="attendance">
          <Card>
            <CardHeader><CardTitle>Attendance History (Last 30 Days)</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      {['Date', 'Check In', 'Check Out', 'Status', 'Hours', 'Break', 'Overtime', 'Late'].map(h => (
                        <th key={h} className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-3 py-2.5 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {mockAttendance.map((a, i) => (
                      <tr key={i} className="border-b border-border last:border-0 hover:bg-card-hover transition-colors">
                        <td className="px-3 py-2.5 text-sm text-text-heading whitespace-nowrap">{a.date}</td>
                        <td className="px-3 py-2.5 text-sm text-text whitespace-nowrap">{a.checkIn}</td>
                        <td className="px-3 py-2.5 text-sm text-text whitespace-nowrap">{a.checkOut}</td>
                        <td className="px-3 py-2.5"><StatusBadge status={a.status} /></td>
                        <td className="px-3 py-2.5 text-sm text-text-heading font-medium">{a.hours}h</td>
                        <td className="px-3 py-2.5 text-sm text-text-muted">{a.breakTime}m</td>
                        <td className="px-3 py-2.5 text-sm text-text-muted">{a.overtime}m</td>
                        <td className="px-3 py-2.5 text-sm text-text-muted">{a.lateMinutes > 0 ? `${a.lateMinutes}m` : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* === WORKING HOURS TAB === */}
        <TabsContent value="working-hours">
          <Card>
            <CardHeader><CardTitle>Monthly Working Hours</CardTitle></CardHeader>
            <CardContent>
              <BarChart data={monthlyHours} height={300} color="#00C896" />
            </CardContent>
          </Card>
        </TabsContent>

        {/* === LEAVES TAB === */}
        <TabsContent value="leaves">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              {leaveBalance.map((lb) => (
                <Card key={lb.type}>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-text-heading">{lb.type}</h4>
                      <span className="text-xs text-text-muted">{(lb as any).used || (lb as any).availed || 0}/{lb.total} used</span>
                    </div>
                    <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${(((lb as any).used || (lb as any).availed || 0) / lb.total) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-text-muted mt-2">
                      <span className="text-text-heading font-semibold">{lb.remaining}</span> remaining
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div>
              <Card>
                <CardHeader><CardTitle>Leave Timeline</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {leaveHistory.map((lh, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <div>
                          <p className="text-sm text-text-heading">{lh.type}</p>
                          <p className="text-xs text-text-muted">{lh.date} · {lh.days} day{lh.days > 1 ? 's' : ''}</p>
                        </div>
                        <StatusBadge status={lh.status} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* === TASKS TAB === */}
        <TabsContent value="tasks">
          <Card>
            <CardHeader><CardTitle>Assigned Tasks</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {assignedTasks.map((task, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-radius-card bg-card-hover border border-border">
                    <div className="flex items-center gap-3">
                      {task.status === 'completed' ? (
                        <CheckCircle size={16} className="text-success shrink-0" />
                      ) : task.status === 'cancelled' ? (
                        <XCircle size={16} className="text-danger shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-primary" />
                      )}
                      <div>
                        <p className={cn('text-sm text-text-heading', (task.status === 'completed' || task.status === 'cancelled') && 'line-through text-text-muted')}>{task.title}</p>
                        <p className="text-xs text-text-muted">Due: {task.due}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={task.priority} />
                      <StatusBadge status={task.status} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* === CRM TAB === */}
        <TabsContent value="crm">
          <Card>
            <CardHeader><CardTitle>Meeting History</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {crmMeetings.map((m, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-radius-card bg-card-hover border border-border">
                    <div>
                      <p className="text-sm font-medium text-text-heading">{m.customer}</p>
                      <p className="text-xs text-text-muted">{m.date} · {m.type}</p>
                    </div>
                    <Badge variant={m.status === 'completed' ? 'success' : 'info'}>{m.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* === PAYSLIPS TAB === */}
        <TabsContent value="payslips">
          <div className="space-y-3">
            {payslips.map((ps, i) => (
              <Card key={i}>
                <CardContent className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-heading">{ps.month}</p>
                      <p className="text-xs text-text-muted">Generated: {ps.generated}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-text-heading">${ps.amount.toLocaleString()}</span>
                    <StatusBadge status={ps.status} />
                    <button className="p-2 rounded-radius-button text-text-muted hover:text-primary hover:bg-primary/5 transition-colors cursor-pointer">
                      <Download size={16} />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
