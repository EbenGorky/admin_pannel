import { useState } from 'react'
import { motion } from 'framer-motion'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent, Input, Select } from '@/components/ui'
import { FileText, Download, Printer, Eye, Search, FileSpreadsheet } from 'lucide-react'

const reportTypes = [
  { name: 'Daily Attendance', icon: FileText, category: 'Attendance' },
  { name: 'Monthly Attendance', icon: FileText, category: 'Attendance' },
  { name: 'Working Hours', icon: FileText, category: 'Time' },
  { name: 'Overtime', icon: FileText, category: 'Time' },
  { name: 'Late Arrivals', icon: FileText, category: 'Time' },
  { name: 'Leave Report', icon: FileText, category: 'Leave' },
  { name: 'Permission Report', icon: FileText, category: 'Leave' },
  { name: 'Workforce Summary', icon: FileText, category: 'Workforce' },
  { name: 'Employee Performance', icon: FileText, category: 'Workforce' },
  { name: 'Task Completion', icon: FileText, category: 'Tasks' },
  { name: 'CRM Report', icon: FileText, category: 'CRM' },
  { name: 'Payroll Summary', icon: FileText, category: 'Payroll' },
]

const recentReports = [
  { name: 'Daily Attendance - Jun 15, 2026', date: 'Jun 15, 2026', type: 'PDF', size: '1.2 MB' },
  { name: 'Monthly Attendance - May 2026', date: 'Jun 1, 2026', type: 'Excel', size: '2.4 MB' },
  { name: 'Overtime Report - Week 24', date: 'May 30, 2026', type: 'PDF', size: '856 KB' },
  { name: 'Leave Report - Q2 2026', date: 'Apr 1, 2026', type: 'PDF', size: '1.8 MB' },
]

export default function ReportsPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')

  const filtered = reportTypes.filter(r => {
    if (search && !r.name.toLowerCase().includes(search.toLowerCase())) return false
    if (category !== 'all' && r.category !== category) return false
    return true
  })

  const categories = [...new Set(reportTypes.map(r => r.category))]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
      <PageHeader title="Reports" description="Generate and export workforce reports" />

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <Input placeholder="Search reports..." className="pl-8 h-9 text-sm" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={category} onChange={e => setCategory(e.target.value)} className="h-9 text-sm w-[140px]">
          <option value="all">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        {filtered.map((report) => (
          <Card key={report.name} className="hover:border-primary/30 hover:shadow-card-hover transition-all group">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <report.icon size={18} className="text-primary" />
                </div>
              </div>
              <h3 className="text-sm font-semibold text-text-heading mb-1">{report.name}</h3>
              <p className="text-xs text-text-muted mb-4">{report.category}</p>
              <div className="flex items-center gap-2">
                <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-text-heading bg-card-hover hover:bg-primary/10 hover:text-primary rounded-radius-button transition-colors cursor-pointer">
                  <Eye size={13} /> Preview
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-text-heading bg-card-hover hover:bg-primary/10 hover:text-primary rounded-radius-button transition-colors cursor-pointer">
                  <Download size={13} /> PDF
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-text-heading bg-card-hover hover:bg-primary/10 hover:text-primary rounded-radius-button transition-colors cursor-pointer">
                  <FileSpreadsheet size={13} /> Excel
                </button>
                <button className="p-1.5 rounded-radius-button text-text-muted hover:text-primary hover:bg-primary/5 transition-colors cursor-pointer">
                  <Printer size={14} />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Reports */}
      <Card>
        <CardContent className="p-5">
          <h3 className="text-base font-semibold text-text-heading mb-4">Recently Generated</h3>
          <div className="space-y-2">
            {recentReports.map((r, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-radius-button bg-card-hover hover:bg-card-hover/70 transition-colors">
                <div className="flex items-center gap-3">
                  <FileText size={16} className="text-primary" />
                  <div>
                    <p className="text-sm text-text-heading">{r.name}</p>
                    <p className="text-xs text-text-muted">{r.date} · {r.type} · {r.size}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-1.5 rounded-radius-button text-text-muted hover:text-primary transition-colors cursor-pointer"><Download size={14} /></button>
                  <button className="p-1.5 rounded-radius-button text-text-muted hover:text-primary transition-colors cursor-pointer"><Printer size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
