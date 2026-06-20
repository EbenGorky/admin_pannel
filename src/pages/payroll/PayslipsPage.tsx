import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button, Input } from '@/components/ui'
import { Download, Search, ChevronDown, ChevronUp, Receipt, Grid3X3, List, X } from 'lucide-react'
import { cn } from '@/lib/utils'

import { LOGO_DATA_URI } from '@/constants/logo'

interface PayslipData {
  id: string
  employeeName: string
  avatar: string
  month: string
  year: string
  amount: number
  status: 'paid' | 'pending'
  basicSalary: number
  hra: number
  convenienceAllowance: number
  medicalAllowance: number
  overtime: number
  incentive: number
  pf: number
  esi: number
  toolsHandling: number
  lateArrival: number
  otherDeductions: number
  absentDays: number
  sickLeave: number
  plannedLeave: number
  overtimeHours: string
  lateArrivalCount: number
  designation: string
  employeeNo: string
}

const payslips: PayslipData[] = [
  { id: 'PS-001', employeeName: 'John Smith', avatar: 'JS', month: 'May', year: '2026', amount: 37500, status: 'paid', basicSalary: 20000, hra: 8000, convenienceAllowance: 2000, medicalAllowance: 1500, overtime: 3000, incentive: 5000, pf: 2000, esi: 0, toolsHandling: 0, lateArrival: 0, otherDeductions: 0, absentDays: 0, sickLeave: 0, plannedLeave: 0, overtimeHours: '5 Hours', lateArrivalCount: 0, designation: 'Field Technician', employeeNo: 'EMP-0001' },
  { id: 'PS-002', employeeName: 'Sarah Johnson', avatar: 'SJ', month: 'May', year: '2026', amount: 32500, status: 'paid', basicSalary: 18000, hra: 7000, convenienceAllowance: 1500, medicalAllowance: 1200, overtime: 2000, incentive: 3000, pf: 1800, esi: 500, toolsHandling: 200, lateArrival: 300, otherDeductions: 0, absentDays: 1, sickLeave: 0, plannedLeave: 0, overtimeHours: '3 Hours', lateArrivalCount: 2, designation: 'Senior Technician', employeeNo: 'EMP-0002' },
  { id: 'PS-003', employeeName: 'David Brown', avatar: 'DB', month: 'May', year: '2026', amount: 42000, status: 'pending', basicSalary: 25000, hra: 10000, convenienceAllowance: 3000, medicalAllowance: 2000, overtime: 1000, incentive: 4000, pf: 2500, esi: 0, toolsHandling: 500, lateArrival: 0, otherDeductions: 1000, absentDays: 0, sickLeave: 2, plannedLeave: 1, overtimeHours: '2 Hours', lateArrivalCount: 0, designation: 'Team Lead', employeeNo: 'EMP-0003' },
  { id: 'PS-004', employeeName: 'Emily Davis', avatar: 'ED', month: 'May', year: '2026', amount: 28000, status: 'paid', basicSalary: 16000, hra: 6000, convenienceAllowance: 1000, medicalAllowance: 1000, overtime: 1500, incentive: 2000, pf: 1600, esi: 800, toolsHandling: 0, lateArrival: 100, otherDeductions: 0, absentDays: 2, sickLeave: 0, plannedLeave: 0, overtimeHours: '4 Hours', lateArrivalCount: 1, designation: 'Engineer', employeeNo: 'EMP-0004' },
  { id: 'PS-005', employeeName: 'John Smith', avatar: 'JS', month: 'April', year: '2026', amount: 37500, status: 'paid', basicSalary: 20000, hra: 8000, convenienceAllowance: 2000, medicalAllowance: 1500, overtime: 3000, incentive: 5000, pf: 2000, esi: 0, toolsHandling: 0, lateArrival: 0, otherDeductions: 0, absentDays: 0, sickLeave: 0, plannedLeave: 0, overtimeHours: '5 Hours', lateArrivalCount: 0, designation: 'Field Technician', employeeNo: 'EMP-0001' },
  { id: 'PS-006', employeeName: 'Sarah Johnson', avatar: 'SJ', month: 'April', year: '2026', amount: 32500, status: 'paid', basicSalary: 18000, hra: 7000, convenienceAllowance: 1500, medicalAllowance: 1200, overtime: 2000, incentive: 3000, pf: 1800, esi: 500, toolsHandling: 200, lateArrival: 300, otherDeductions: 0, absentDays: 0, sickLeave: 1, plannedLeave: 0, overtimeHours: '3 Hours', lateArrivalCount: 2, designation: 'Senior Technician', employeeNo: 'EMP-0002' },
]

function numberToWords(n: number): string {
  const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']
  if (n === 0) return 'Zero'
  const w = (num: number): string => {
    if (num < 20) return a[num]
    if (num < 100) return b[Math.floor(num / 10)] + (num % 10 ? ' ' + a[num % 10] : '')
    if (num < 1000) return a[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' ' + w(num % 100) : '')
    return ''
  }
  let result = ''
  if (n >= 100000) result += w(Math.floor(n / 100000)) + ' Lakh '
  n %= 100000
  if (n >= 1000) result += w(Math.floor(n / 1000)) + ' Thousand '
  n %= 1000
  result += w(n)
  return result.trim() || 'Zero'
}

function generatePayslipHtml(ps: PayslipData): string {
  const gross = ps.basicSalary + ps.hra + ps.convenienceAllowance + ps.medicalAllowance + ps.overtime + ps.incentive
  const totalDed = ps.pf + ps.esi + ps.toolsHandling + ps.lateArrival + ps.otherDeductions
  const fmt = (v: number) => `₹ ${v.toLocaleString('en-IN')}`
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Salary Slip - ${ps.employeeName}</title>
<style>
body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #222; margin: 0; padding: 20px; background: #f9f9f9; }
.payslip-container { max-width: 850px; margin: 0 auto; background: #fff; padding: 30px; border: 1px solid #d3d3d3; box-shadow: 0 4px 8px rgba(0,0,0,0.06); }
.header-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
.company-name { font-size: 24px; font-weight: 800; color: #0b2265; margin: 0; letter-spacing: 0.5px; }
.company-title { font-size: 18px; font-weight: 700; color: #c62828; margin-top: 2px; letter-spacing: 1px; }
.table-section { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
.table-section td, .table-section th { border: 1px solid #b0bec5; padding: 6px 10px; font-size: 13px; }
.label-bg { font-weight: 600; color: #333; background: #f5f5f5; width: 20%; }
.val-cell { width: 30%; }
.num-col { text-align: right; }
.section-bar { background: #0b2265; color: white; font-weight: bold; text-transform: uppercase; text-align: center; font-size: 14px; }
.bold-row { font-weight: bold; background: #eceff1; }
.net-pay-row { font-weight: bold; background: #fffde7; font-size: 15px; }
.net-pay-row td { border-top: 2px solid #0b2265; border-bottom: 2px double #0b2265; padding: 10px; }
@media print { body { background: #fff; padding: 0; } .payslip-container { border: none; box-shadow: none; padding: 0; } }
</style>
</head>
<body>
<div class="payslip-container">
  <table class="header-table"><tr>
    <td style="vertical-align:middle;padding-right:15px"><img src="${LOGO_DATA_URI}" alt="Vin Power Logo" style="width:85px;height:auto"></td>
    <td style="vertical-align:middle"><div class="company-name">VINPOWER ENGINEERS & ASSOCIATES</div><div class="company-title">Salary Slip</div></td>
  </tr></table>
  <table class="table-section">
    <tr><td class="label-bg">Month / Year</td><td class="val-cell">${ps.month} ${ps.year}</td><td class="label-bg">Absent Days</td><td class="val-cell num-col">${ps.absentDays}</td></tr>
    <tr><td class="label-bg">Name</td><td class="val-cell" style="font-weight:600">${ps.employeeName}</td><td class="label-bg">Sick Leave</td><td class="val-cell num-col">${ps.sickLeave}</td></tr>
    <tr><td class="label-bg">Designation</td><td class="val-cell">${ps.designation}</td><td class="label-bg">Planned Leave</td><td class="val-cell num-col">${ps.plannedLeave}</td></tr>
    <tr><td class="label-bg">Emp. No</td><td class="val-cell">${ps.employeeNo}</td><td class="label-bg">Over Time</td><td class="val-cell num-col">${ps.overtimeHours}</td></tr>
    <tr><td class="label-bg">Salary</td><td class="val-cell num-col">${fmt(ps.basicSalary)}</td><td class="label-bg">Late Arrival</td><td class="val-cell num-col">${ps.lateArrivalCount}</td></tr>
    <tr><td class="label-bg">Vinpower Contributed</td><td class="val-cell num-col">₹ 0</td><td colspan="2" style="background:#fafafa"></td></tr>
    <tr class="bold-row" style="color:#c62828"><td class="label-bg" style="color:#c62828">Gross Salary</td><td class="num-col">${fmt(gross)}</td><td colspan="2" style="background:#fafafa"></td></tr>
  </table>
  <table class="table-section">
    <thead><tr class="section-bar"><th colspan="2" style="width:50%;border-right:1px solid #fff">Earnings</th><th colspan="2" style="width:50%">Deductions</th></tr></thead>
    <tbody>
      <tr><td>Basic Salary</td><td class="num-col">${fmt(ps.basicSalary)}</td><td>PF</td><td class="num-col">${fmt(ps.pf)}</td></tr>
      <tr><td>House Rent Allowances</td><td class="num-col">${fmt(ps.hra)}</td><td>ESI</td><td class="num-col">${fmt(ps.esi)}</td></tr>
      <tr><td>Convenience Allowances</td><td class="num-col">${fmt(ps.convenienceAllowance)}</td><td>Tools Handling</td><td class="num-col">${fmt(ps.toolsHandling)}</td></tr>
      <tr><td>Medical Allowances</td><td class="num-col">${fmt(ps.medicalAllowance)}</td><td>Late Arrival</td><td class="num-col">${fmt(ps.lateArrival)}</td></tr>
      <tr><td>Over Time</td><td class="num-col">${fmt(ps.overtime)}</td><td>Others</td><td class="num-col">${fmt(ps.otherDeductions)}</td></tr>
      <tr><td>Incentive</td><td class="num-col">${fmt(ps.incentive)}</td><td colspan="2" style="background:#fafafa"></td></tr>
      <tr class="bold-row"><td>Gross Salary</td><td class="num-col">${fmt(gross)}</td><td>Total Deductions</td><td class="num-col">${fmt(totalDed)}</td></tr>
      <tr><td>Less</td><td class="num-col" style="color:#c62828">${fmt(totalDed)}</td><td colspan="2" style="background:#fafafa"></td></tr>
      <tr class="net-pay-row"><td style="color:#0b2265;font-size:14px">SALARY PAID</td><td class="num-col" style="color:#0b2265;font-size:16px">${fmt(ps.amount)}</td><td colspan="2" style="font-weight:normal;font-size:11px;color:#555;vertical-align:middle">In Words: <em>${numberToWords(ps.amount)} Only</em></td></tr>
    </tbody>
  </table>
  <table style="width:100%;border-collapse:collapse;margin-top:40px"><tr><td style="font-size:11px;color:#777">* System generated statement. No physical signature required.</td><td style="text-align:right;font-size:12px;font-weight:600;color:#555">Vinpower Engineers & Associates</td></tr></table>
</div>
</body>
</html>`
}

function getPayslipUrl(ps: PayslipData): string {
  const html = generatePayslipHtml(ps)
  const blob = new Blob([html], { type: 'text/html' })
  return URL.createObjectURL(blob)
}

function PayslipDetails({ ps }: { ps: PayslipData }) {
  const gross = ps.basicSalary + ps.hra + ps.convenienceAllowance + ps.medicalAllowance + ps.overtime + ps.incentive
  const totalDed = ps.pf + ps.esi + ps.toolsHandling + ps.lateArrival + ps.otherDeductions
  const fmt = (v: number) => `₹ ${v.toLocaleString('en-IN')}`

  return (
    <div className="p-4 space-y-4">
      {/* Employee meta */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-radius-button bg-card-hover text-sm">
        <div><span className="text-text-muted text-xs">Designation</span><p className="text-text-heading font-medium">{ps.designation}</p></div>
        <div><span className="text-text-muted text-xs">Emp. No</span><p className="text-text-heading font-medium">{ps.employeeNo}</p></div>
        <div><span className="text-text-muted text-xs">Absent</span><p className="text-text-heading font-medium">{ps.absentDays}</p></div>
        <div><span className="text-text-muted text-xs">Overtime</span><p className="text-text-heading font-medium">{ps.overtimeHours}</p></div>
      </div>

      {/* Earnings & Deductions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-3 rounded-radius-button border border-border-light">
          <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Earnings</h4>
          <div className="space-y-2">
            {[
              { label: 'Basic Salary', value: ps.basicSalary },
              { label: 'House Rent Allowances', value: ps.hra },
              { label: 'Convenience Allowances', value: ps.convenienceAllowance },
              { label: 'Medical Allowances', value: ps.medicalAllowance },
              { label: 'Over Time', value: ps.overtime },
              { label: 'Incentive', value: ps.incentive },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between text-sm">
                <span className="text-text-muted">{item.label}</span>
                <span className="text-text-heading font-medium">{fmt(item.value)}</span>
              </div>
            ))}
            <div className="flex items-center justify-between text-sm pt-2 border-t border-border-light font-semibold">
              <span className="text-text-heading">Gross Salary</span>
              <span className="text-text-heading">{fmt(gross)}</span>
            </div>
          </div>
        </div>
        <div className="p-3 rounded-radius-button border border-border-light">
          <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Deductions</h4>
          <div className="space-y-2">
            {[
              { label: 'PF', value: ps.pf },
              { label: 'ESI', value: ps.esi },
              { label: 'Tools Handling', value: ps.toolsHandling },
              { label: 'Late Arrival', value: ps.lateArrival },
              { label: 'Others', value: ps.otherDeductions },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between text-sm">
                <span className="text-text-muted">{item.label}</span>
                <span className="text-text-heading font-medium">{fmt(item.value)}</span>
              </div>
            ))}
            <div className="flex items-center justify-between text-sm pt-2 border-t border-border-light font-semibold">
              <span className="text-text-heading">Total Deductions</span>
              <span className="text-danger">{fmt(totalDed)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Net Pay */}
      <div className="flex items-center justify-between p-4 rounded-radius-button bg-primary/5 border border-primary/10">
        <div>
          <p className="text-sm font-semibold text-text-heading">Net Pay</p>
          <p className="text-xs text-text-muted mt-0.5">In Words: {numberToWords(ps.amount)} Only</p>
        </div>
        <span className="text-xl font-bold text-primary">{fmt(ps.amount)}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <a
          href={getPayslipUrl(ps)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
        >
          Open
        </a>
        <span className="text-xs text-text-muted ml-auto">System generated statement</span>
      </div>
    </div>
  )
}

export default function PayslipsPage() {
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [view, setView] = useState<'list' | 'grid'>('list')
  const [popupPayslip, setPopupPayslip] = useState<PayslipData | null>(null)

  const filtered = payslips.filter(p => p.employeeName.toLowerCase().includes(search.toLowerCase()))

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
      <PageHeader title="Payslips" description="Generate and manage employee payslips">
        <Button><Download size={14} /> Generate</Button>
      </PageHeader>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <Input placeholder="Search employee..." className="pl-8 h-9 text-sm" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex items-center gap-2 bg-card border border-border-light rounded-radius-button p-1 ml-auto">
          <button
            onClick={() => setView('list')}
            className={cn('p-2 rounded-radius-button transition-colors cursor-pointer', view === 'list' ? 'bg-primary text-white' : 'text-text-muted hover:text-text-heading')}
          >
            <List size={16} />
          </button>
          <button
            onClick={() => setView('grid')}
            className={cn('p-2 rounded-radius-button transition-colors cursor-pointer', view === 'grid' ? 'bg-primary text-white' : 'text-text-muted hover:text-text-heading')}
          >
            <Grid3X3 size={16} />
          </button>
        </div>
      </div>

      <div className={cn(view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 items-start' : 'space-y-3')}>
        {filtered.map((ps) => {
          const isExpanded = expanded === ps.id
          const fmt = (v: number) => `₹ ${v.toLocaleString('en-IN')}`

          return (
            <div
              key={ps.id}
              className="bg-card border border-border-light rounded-radius-card overflow-hidden transition-all duration-300"
            >
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-card-hover transition-colors"
                onClick={() => view === 'list' ? setExpanded(isExpanded ? null : ps.id) : setPopupPayslip(ps)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-card-hover flex items-center justify-center shrink-0">
                    <Receipt size={20} className="text-text-muted" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-heading">Payslip {ps.month} {ps.year}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <StatusBadge status={ps.status} />
                      <span className="text-xs text-text-muted">{ps.employeeName}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-text-heading">{fmt(ps.amount)}</span>
                  {view === 'list' && (
                    <button className="p-1.5 rounded-radius-button text-text-muted hover:text-primary transition-colors cursor-pointer">
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  )}
                </div>
              </div>

              <AnimatePresence>
                {view === 'list' && isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-border-light"
                  >
                    <PayslipDetails ps={ps} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      <AnimatePresence>
        {popupPayslip && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setPopupPayslip(null)}
            />
            <div className="fixed inset-0 z-50 overflow-y-auto pointer-events-none">
              <div className="flex min-h-full items-center justify-center p-4">
                <motion.div
                  initial={{ scale: 0.92, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.92, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="bg-card border border-border rounded-radius-card w-full max-w-2xl pointer-events-auto overflow-hidden"
                  onClick={e => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-card-hover flex items-center justify-center">
                        <Receipt size={18} className="text-text-muted" />
                      </div>
                      <div>
                        <h2 className="text-base font-semibold text-text-heading">Payslip {popupPayslip.month} {popupPayslip.year}</h2>
                        <div className="flex items-center gap-2 mt-0.5">
                          <StatusBadge status={popupPayslip.status} />
                          <span className="text-xs text-text-muted">{popupPayslip.employeeName}</span>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => setPopupPayslip(null)} className="p-2 rounded-radius-button text-text-muted hover:text-text-heading hover:bg-card-hover transition-colors cursor-pointer">
                      <X size={16} />
                    </button>
                  </div>
                  
                  <PayslipDetails ps={popupPayslip} />

                </motion.div>
              </div>
            </div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
