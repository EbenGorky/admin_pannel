import { cn } from '@/lib/utils'

interface Activity {
  id: string
  text: string
  time: string
  type: 'check-in' | 'check-out' | 'break' | 'leave' | 'task' | 'permission'
}

const activityIcons: Record<string, string> = {
  'check-in': 'bg-success',
  'check-out': 'bg-text-muted',
  break: 'bg-info',
  leave: 'bg-warning',
  task: 'bg-primary',
  permission: 'bg-secondary',
}

interface ActivityFeedProps {
  activities: Activity[]
  className?: string
}

export function ActivityFeed({ activities, className }: ActivityFeedProps) {
  return (
    <div className={cn('space-y-1', className)}>
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-center gap-3 py-2.5 border-b border-border last:border-0"
        >
          <div
            className={cn(
              'w-2 h-2 rounded-full shrink-0',
              activityIcons[activity.type] || 'bg-text-muted'
            )}
          />
          <span className="text-sm text-text flex-1">{activity.text}</span>
          <span className="text-xs text-text-muted shrink-0">{activity.time}</span>
        </div>
      ))}
    </div>
  )
}
