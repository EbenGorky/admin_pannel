import type { MenuItem } from '@/types'

export const SIDEBAR_MENU_ITEMS: MenuItem[] = [
  { label: 'Dashboard', icon: 'LayoutDashboard', path: '/app/dashboard' },
  { label: 'Departments', icon: 'Users', path: '/app/my-team' },
  { label: 'Attendance', icon: 'ClipboardCheck', path: '/app/attendance' },
  { label: 'Team', icon: 'UsersRound', path: '/app/team' },
  { label: 'Site', icon: 'ListChecks', path: '/app/tasks' },
  { label: 'CRM', icon: 'Contact', path: '/app/crm' },
  { label: 'Leave Management', icon: 'CalendarClock', path: '/app/leaves' },
  { label: 'Payslips', icon: 'Wallet', path: '/app/payslips' },
  // { label: 'Payroll', icon: 'DollarSign', path: '/app/payroll' },
  // { label: 'Reports', icon: 'FileText', path: '/app/reports' },
  // { label: 'Analytics', icon: 'BarChart3', path: '/app/analytics' },
  { label: 'Settings', icon: 'Settings', path: '/app/settings' },
]

export const ROUTE_PATHS = {
  DASHBOARD: '/',
  MY_TEAM: '/my-team',
  ATTENDANCE: '/attendance',
  EMPLOYEES: '/employees',
  EMPLOYEE_PROFILE: '/employees/:id',
  TASKS: '/tasks',
  TASK_DETAILS: '/tasks/:id',
  LEAVES: '/leaves',
  WORK_TIME: '/work-time',
  LIVE_LOCATIONS: '/live-locations',
  CRM: '/crm',
  REPORTS: '/reports',
  PAYSLIPS: '/payslips',
  PAYROLL: '/payroll',
  ANALYTICS: '/analytics',
  SETTINGS: '/settings',
}

export const ATTENDANCE_STATUSES = ['present', 'absent', 'late', 'leave', 'permission', 'week-off', 'on-duty'] as const

export const LEAVE_TYPES = ['Leave', 'Medical', 'LOP', 'Permission'] as const

export const TASK_STATUSES = ['drawing-preparation', 'drawing-document-preparation', 'drawing-sent-approval', 'drawing-approval', 'cr-preparation', 'waiting-for-inspection-completed', 'rectification-report', 'safety-satisfaction'] as const

export const PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const

export const SHIFT_TYPES = ['morning', 'evening', 'night', 'rotational'] as const

export const DEPARTMENTS = [
  'Engineering',
  'Sales',
  'Marketing',
  'Human Resources',
  'Finance',
  'Operations',
  'Support',
  'Field Service',
] as const
