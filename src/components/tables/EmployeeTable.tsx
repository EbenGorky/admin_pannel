import { motion } from 'framer-motion'
import { Avatar } from '@/components/ui'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Eye, ListChecks, MessageSquare, PhoneCall } from 'lucide-react'
import type { Employee } from '@/types'

interface EmployeeTableProps {
  employees: Employee[]
  onSelect?: (employee: Employee) => void
}

export function EmployeeTable({ employees, onSelect }: EmployeeTableProps) {
  const headers = ['Employee', 'ID', 'Department', 'Status', 'Phone', 'Actions']

  return (
    <div className="bg-card border border-border rounded-radius-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {headers.map((h) => (
                <th key={h} className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, i) => (
              <motion.tr
                key={emp.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: i * 0.02 }}
                className="border-b border-border last:border-0 hover:bg-card-hover transition-colors cursor-pointer"
                onClick={() => onSelect?.(emp)}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar
                      fallback={emp.name.split(' ').map(n => n[0]).join('')}
                      size="sm"
                    />
                    <span className="text-sm font-medium text-text-heading whitespace-nowrap">{emp.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-text-muted whitespace-nowrap">{emp.employeeId}</td>
                <td className="px-4 py-3 text-sm text-text whitespace-nowrap">{emp.department}</td>
                <td className="px-4 py-3"><StatusBadge status={emp.status} /></td>
                <td className="px-4 py-3 text-sm text-text-muted whitespace-nowrap">{emp.phone}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    {[Eye, ListChecks, MessageSquare, PhoneCall].map((Icon, idx) => (
                      <button key={idx} onClick={e => e.stopPropagation()} className="p-1.5 rounded-radius-button text-text-muted hover:text-primary hover:bg-primary/5 transition-colors cursor-pointer">
                        <Icon size={14} />
                      </button>
                    ))}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
