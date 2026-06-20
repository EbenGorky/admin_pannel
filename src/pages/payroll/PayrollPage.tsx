import { motion } from 'framer-motion'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent, Button } from '@/components/ui'
import { DollarSign, Users, Clock, TrendingUp, Download, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

const summaryCards = [
  { label: 'Total Payroll', value: '$284,500', change: '+3.2%', icon: DollarSign, color: 'text-primary', bg: 'bg-primary/10' },
  { label: 'Active Employees', value: '1,042', change: '+12', icon: Users, color: 'text-success', bg: 'bg-success/10' },
  { label: 'Avg Salary', value: '$4,850', change: '+2.1%', icon: Clock, color: 'text-info', bg: 'bg-info/10' },
  { label: 'YTD Spend', value: '$1.7M', change: '+8.5%', icon: TrendingUp, color: 'text-warning', bg: 'bg-warning/10' },
]

export default function PayrollPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
      <PageHeader title="Payroll" description="Manage payroll and compensation">
        <Button><Plus size={16} /> Run Payroll</Button>
      </PageHeader>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {summaryCards.map((card) => {
          const Icon = card.icon
          return (
            <Card key={card.label}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-text-muted uppercase tracking-wider">{card.label}</span>
                  <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', card.bg)}>
                    <Icon size={17} className={card.color} />
                  </div>
                </div>
                <p className="text-lg font-bold text-text-heading">{card.value}</p>
                <span className={cn('text-xs font-medium', card.change.startsWith('+') ? 'text-success' : 'text-danger')}>{card.change}</span>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-text-heading">Recent Payroll Runs</h3>
            <Button size="sm" variant="secondary"><Download size={14} /> Export</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {['Period', 'Employees', 'Gross Pay', 'Deductions', 'Net Pay', 'Status', 'Date'].map(h => (
                    <th key={h} className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-3 py-2.5 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { period: 'May 2026', employees: 1042, gross: 584200, deductions: 85700, net: 498500, status: 'Completed', date: 'Jun 1, 2026' },
                  { period: 'April 2026', employees: 1038, gross: 581000, deductions: 84800, net: 496200, status: 'Completed', date: 'May 1, 2026' },
                  { period: 'March 2026', employees: 1035, gross: 579800, deductions: 84100, net: 495700, status: 'Completed', date: 'Apr 1, 2026' },
                ].map((r, i) => (
                  <tr key={i} className="border-b border-border last:border-0 hover:bg-card-hover transition-colors">
                    <td className="px-3 py-3 text-sm text-text-heading font-medium">{r.period}</td>
                    <td className="px-3 py-3 text-sm text-text">{r.employees.toLocaleString()}</td>
                    <td className="px-3 py-3 text-sm text-text-heading">${r.gross.toLocaleString()}</td>
                    <td className="px-3 py-3 text-sm text-danger">${r.deductions.toLocaleString()}</td>
                    <td className="px-3 py-3 text-sm text-success font-semibold">${r.net.toLocaleString()}</td>
                    <td className="px-3 py-3"><span className="text-xs text-success bg-success/10 px-2 py-0.5 rounded-full font-medium">{r.status}</span></td>
                    <td className="px-3 py-3 text-sm text-text-muted">{r.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
