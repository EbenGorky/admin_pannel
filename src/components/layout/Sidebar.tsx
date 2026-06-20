import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { SIDEBAR_MENU_ITEMS } from '@/constants'
import { ScrollArea } from '@/components/ui'
import {
  LayoutDashboard, Users, ClipboardCheck, ListChecks, CalendarClock,
  Clock, MapPin, ContactRound, FileText, Wallet, DollarSign, BarChart3, Settings, UsersRound,
  ChevronLeft, ChevronRight,
} from 'lucide-react'
import type { ElementType } from 'react'

const iconMap: Record<string, ElementType> = {
  LayoutDashboard, Users, ClipboardCheck, ListChecks, CalendarClock,
  Clock, MapPin, Contact: ContactRound, FileText, Wallet, DollarSign, BarChart3, Settings, UsersRound,
}

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation()

  return (
    <aside
      className={cn(
        'h-screen bg-sidebar border-r border-border flex flex-col transition-all duration-300 shrink-0 sticky top-0',
        collapsed ? 'w-[68px]' : 'w-[250px]'
      )}
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center h-16 px-4 border-b border-border gap-3',
        collapsed && 'justify-center px-0'
      )}>
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-sm">VP</span>
        </div>
        {!collapsed && (
          <span className="font-semibold text-text-heading text-base whitespace-nowrap">Vin Power</span>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-2">
        <nav className={cn('flex flex-col gap-0.5', collapsed ? 'px-2' : 'px-3')}>
          {SIDEBAR_MENU_ITEMS.map((item) => {
            const Icon = iconMap[item.icon] || LayoutDashboard
            const isActive = location.pathname === item.path ||
              (item.path && item.path !== '/' && location.pathname.startsWith(item.path))

            return (
              <Link
                key={item.label}
                to={item.path || '#'}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-radius-button text-sm transition-all duration-200 group',
                  collapsed && 'justify-center px-2',
                  isActive
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-text-muted hover:text-text-heading hover:bg-card-hover'
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon size={20} className={cn('shrink-0', collapsed && '')} />
                {!collapsed && (
                  <span className="truncate">{item.label}</span>
                )}
                {isActive && !collapsed && (
                  <div className="w-1 h-5 rounded-full bg-primary ml-auto shrink-0" />
                )}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* Collapse toggle */}
      <div className="border-t border-border p-2">
        <button
          onClick={onToggle}
          className={cn(
            'flex items-center justify-center w-full py-2 rounded-radius-button text-text-muted hover:text-text-heading hover:bg-card-hover transition-all cursor-pointer',
            collapsed && 'px-0'
          )}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </aside>
  )
}
