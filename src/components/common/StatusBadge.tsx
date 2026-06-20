import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: string
  className?: string
}

const statusStyles: Record<string, string> = {
  present: 'bg-success/10 text-success',
  active: 'bg-success/10 text-success',
  absent: 'bg-danger/10 text-danger',
  'on-leave': 'bg-warning/10 text-warning',
  leave: 'bg-warning/10 text-warning',
  break: 'bg-info/10 text-info',
  offline: 'bg-text-muted/10 text-text-muted',
  pending: 'bg-warning/10 text-warning',
  approved: 'bg-success/10 text-success',
  rejected: 'bg-danger/10 text-danger',
  clarification: 'bg-info/10 text-info',
  'drawing-preparation': 'bg-info/10 text-info',
  'drawing-document-preparation': 'bg-primary/10 text-primary',
  'drawing-sent-approval': 'bg-warning/10 text-warning',
  'drawing-approval': 'bg-success/10 text-success',
  'cr-preparation': 'bg-secondary/10 text-secondary',
  'waiting-for-inspection-completed': 'bg-info/10 text-info',
  'rectification-report': 'bg-danger/10 text-danger',
  'safety-satisfaction': 'bg-success/10 text-success',
  'completed': 'bg-success/10 text-success',
  'on-hold': 'bg-warning/10 text-warning',
  low: 'bg-success/10 text-success',
  medium: 'bg-warning/10 text-warning',
  high: 'bg-danger/10 text-danger',
  urgent: 'bg-danger/15 text-danger',
  paid: 'bg-success/10 text-success',
  generated: 'bg-info/10 text-info',
  late: 'bg-warning/10 text-warning',
  permission: 'bg-primary/10 text-primary',
  'week-off': 'bg-text-muted/10 text-text-muted',
  'on-duty': 'bg-secondary/10 text-secondary',
}

const statusLabels: Record<string, string> = {
  'drawing-preparation': 'DP',
  'drawing-document-preparation': 'DDP',
  'drawing-sent-approval': 'DSA',
  'drawing-approval': 'DA',
  'cr-preparation': 'CRP',
  'waiting-for-inspection-completed': 'WIC',
  'rectification-report': 'RR',
  'safety-satisfaction': 'SS',
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalized = status.toLowerCase().replace(/\s+/g, '-')
  const style = statusStyles[normalized] || 'bg-card-hover text-text-muted'
  
  const displayLabel = statusLabels[normalized] || (normalized === 'in-progress' ? 'In Progress' : normalized.replace(/-/g, ' '))

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize',
        style,
        className
      )}
      title={normalized.replace(/-/g, ' ')}
    >
      {displayLabel}
    </span>
  )
}
