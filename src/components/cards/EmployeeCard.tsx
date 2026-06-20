import { motion } from 'framer-motion'
import { Avatar } from '@/components/ui'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Phone, MessageSquare, PhoneCall } from 'lucide-react'
import type { Employee } from '@/types'

interface EmployeeCardProps {
  employee: Employee
  index: number
  onMessage?: (employee: Employee) => void
}

export function EmployeeCard({ employee, index, onMessage }: EmployeeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.03 }}
      className="bg-card border border-border rounded-radius-card p-4 hover:border-primary/30 hover:shadow-card-hover transition-all duration-200"
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <Avatar
          fallback={employee.name.split(' ').map(n => n[0]).join('')}
          size="lg"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-sm font-semibold text-text-heading truncate">{employee.name}</h3>
            <StatusBadge status={employee.status} />
          </div>
          <p className="text-xs text-text-muted">{employee.employeeId}</p>
          <p className="text-xs text-text-muted">{employee.department}</p>
        </div>
      </div>

      {/* Details */}
      <div className="mb-3">
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <Phone size={12} />
          <span>{employee.phone}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 pt-3 border-t border-border">
        <button onClick={e => { e.stopPropagation(); onMessage?.(employee) }} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs text-text-muted hover:text-primary hover:bg-primary/5 rounded-radius-button transition-colors cursor-pointer">
          <MessageSquare size={14} /> Message
        </button>
        <button onClick={e => e.stopPropagation()} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs text-text-muted hover:text-primary hover:bg-primary/5 rounded-radius-button transition-colors cursor-pointer">
          <PhoneCall size={14} /> Call
        </button>
      </div>
    </motion.div>
  )
}
