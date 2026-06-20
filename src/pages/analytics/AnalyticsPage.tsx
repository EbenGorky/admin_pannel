import { useState } from 'react'
import { motion } from 'framer-motion'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardHeader, CardTitle, CardContent, Button, Select } from '@/components/ui'
import { BarChart, LineChart, DonutChart, DonutLegend } from '@/components/charts'
import {
  TrendingUp, Users, Clock, CheckCircle, CalendarClock, Download,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const kpis = [
  { label: 'Attendance %', value: '92.5%', trend: '+2.1%', icon: TrendingUp, color: 'text-success', bg: 'bg-success/10' },
  { label: 'Productivity', value: '87.3%', trend: '+4.5%', icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
  { label: 'Overtime %', value: '6.8%', trend: '-1.2%', icon: Clock, color: 'text-warning', bg: 'bg-warning/10' },
  { label: 'Avg Hours', value: '7.4h', trend: '+0.3h', icon: Clock, color: 'text-info', bg: 'bg-info/10' },
  { label: 'Task Completion', value: '78.2%', trend: '+5.3%', icon: CheckCircle, color: 'text-success', bg: 'bg-success/10' },
  { label: 'Leave Rate', value: '5.9%', trend: '-0.8%', icon: CalendarClock, color: 'text-danger', bg: 'bg-danger/10' },
]

const deptComparison = [
  { label: 'Field Service', value: 94 },
  { label: 'Engineering', value: 91 },
  { label: 'Sales', value: 85 },
  { label: 'Operations', value: 86 },
  { label: 'Support', value: 88 },
  { label: 'Maintenance', value: 75 },
]

const attendanceTrend = Array.from({ length: 12 }, (_, i) => ({
  label: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
  value: 88 + Math.sin(i * 0.6) * 5 + i * 0.4,
}))

const leaveTrend = Array.from({ length: 12 }, (_, i) => ({
  label: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
  value: 4 + Math.sin(i * 0.8) * 2 + (i % 3 === 0 ? 2 : 0),
}))

const overtimeTrend = Array.from({ length: 12 }, (_, i) => ({
  label: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
  value: 5 + Math.sin(i * 0.5) * 3 + (i > 5 ? 2 : 0),
}))

const taskCompletion = Array.from({ length: 12 }, (_, i) => ({
  label: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
  value: 70 + Math.sin(i * 0.7) * 10 + i * 0.8,
}))

const departmentDonut = [
  { name: 'Field Service', value: 320, color: '#00C896' },
  { name: 'Engineering', value: 156, color: '#1E88E5' },
  { name: 'Sales', value: 198, color: '#D29922' },
  { name: 'Operations', value: 245, color: '#58A6FF' },
  { name: 'Support', value: 180, color: '#3FB950' },
  { name: 'Maintenance', value: 185, color: '#F85149' },
]

const weeklyHours = [
  { label: 'Mon', value: 7.2 }, { label: 'Tue', value: 7.8 }, { label: 'Wed', value: 8.1 },
  { label: 'Thu', value: 6.9 }, { label: 'Fri', value: 7.5 }, { label: 'Sat', value: 5.2 }, { label: 'Sun', value: 3.1 },
]

const overtimeData = Array.from({ length: 30 }, (_, i) => ({
  label: `${i + 1}`,
  value: Math.max(0, 1.5 + Math.sin(i * 0.4) * 1.2 + (i % 7 === 5 ? 2 : 0)),
}))

const avgProductivity = [
  { label: 'Field Service', value: 7.8 },
  { label: 'Engineering', value: 7.2 },
  { label: 'Sales', value: 6.5 },
  { label: 'Operations', value: 7.0 },
  { label: 'Support', value: 6.8 },
  { label: 'Maintenance', value: 7.5 },
]

const heatmapData = Array.from({ length: 7 }, (_, day) =>
  Array.from({ length: 24 }, (_, hour) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][day],
    hour,
    value: Math.random() * (day < 5 ? (hour >= 8 && hour <= 17 ? 80 : 10) : (hour >= 9 && hour <= 13 ? 40 : 5)),
  }))
).flat()

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('weekly')

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
      <PageHeader title="Analytics" description="Executive KPIs and workforce insights" />

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          return (
            <Card key={kpi.label}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-text-muted uppercase tracking-wider">{kpi.label}</span>
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', kpi.bg)}>
                    <Icon size={15} className={kpi.color} />
                  </div>
                </div>
                <p className="text-xl font-bold text-text-heading">{kpi.value}</p>
                <span className={cn('text-xs font-medium', kpi.trend.startsWith('+') ? 'text-success' : 'text-danger')}>{kpi.trend}</span>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Executive Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader><CardTitle>Department Comparison (Attendance %)</CardTitle></CardHeader>
          <CardContent>
            <BarChart data={deptComparison} height={240} color="#00C896" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Attendance Trend</CardTitle></CardHeader>
          <CardContent>
            <LineChart data={attendanceTrend} height={240} color="#00C896" showGrid />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader><CardTitle>Leave Trend</CardTitle></CardHeader>
          <CardContent>
            <LineChart data={leaveTrend} height={200} color="#D29922" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Overtime Trend</CardTitle></CardHeader>
          <CardContent>
            <LineChart data={overtimeTrend} height={200} color="#F85149" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Task Completion</CardTitle></CardHeader>
          <CardContent>
            <LineChart data={taskCompletion} height={200} color="#3FB950" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader><CardTitle>Workforce by Department</CardTitle></CardHeader>
          <CardContent className="flex flex-col items-center">
            <DonutChart data={departmentDonut} size={200} />
            <DonutLegend data={departmentDonut} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Key Metrics Overview</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: 'Attendance Rate', value: '92.5%', change: '+2.1%', up: true },
                { label: 'Productivity Score', value: '87.3%', change: '+4.5%', up: true },
                { label: 'Task Completion', value: '78.2%', change: '+5.3%', up: true },
                { label: 'Employee Turnover', value: '3.1%', change: '-0.4%', up: false },
                { label: 'Avg Response Time', value: '4.2m', change: '-0.8m', up: false },
              ].map((m, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-radius-button bg-card-hover">
                  <span className="text-sm text-text-muted">{m.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-text-heading">{m.value}</span>
                    <span className={cn('text-xs font-medium', m.up ? 'text-success' : 'text-danger')}>{m.change}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Work Time Section */}
      <div className="flex items-center gap-3 mb-6">
        <Select value={period} onChange={e => setPeriod(e.target.value)} className="h-9 text-sm w-[140px]">
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </Select>
        <span className="text-sm text-text-muted">June 9 - June 15, 2026</span>
        <Button variant="secondary" className="ml-auto"><Download size={14} /> Export CSV</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader><CardTitle>Working Hours</CardTitle></CardHeader>
          <CardContent>
            <BarChart data={weeklyHours} height={240} color="#00C896" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Overtime (30 Days)</CardTitle></CardHeader>
          <CardContent>
            <LineChart data={overtimeData} height={240} color="#1E88E5" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Average Hours by Department</CardTitle></CardHeader>
          <CardContent>
            <BarChart data={avgProductivity} height={200} color="#58A6FF" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Productivity Heatmap</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-25 gap-1">
              {heatmapData.map((cell, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-sm"
                  style={{
                    backgroundColor: cell.value > 60 ? '#00C896' : cell.value > 30 ? '#1E88E5' : cell.value > 10 ? '#21262D' : '#161B22',
                    opacity: 0.3 + (cell.value / 100) * 0.7,
                  }}
                  title={`${cell.day} ${cell.hour}:00 - ${cell.value.toFixed(0)}% activity`}
                />
              ))}
            </div>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-[11px] text-text-muted">Low</span>
              <div className="flex gap-0.5">
                {['#161B22', '#21262D', '#1E88E5', '#00C896'].map(c => (
                  <div key={c} className="w-4 h-4 rounded-sm" style={{ backgroundColor: c, opacity: 0.6 }} />
                ))}
              </div>
              <span className="text-[11px] text-text-muted">High</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
