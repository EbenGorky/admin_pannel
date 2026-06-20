export interface Employee {
  id: string
  name: string
  employeeId: string
  email: string
  phone: string
  avatar?: string
  department: string
  team: string
  shift: string
  designation: string
  manager: string
  status: 'active' | 'absent' | 'on-leave' | 'break' | 'offline'
  checkIn?: string
  checkOut?: string
  todayHours?: number
  breakTime?: number
  overtime?: number
  late?: number
  location?: { lat: number; lng: number; address: string }
  battery?: number
  experience?: string
  joinDate: string
}

export interface Attendance {
  id: string
  employeeId: string
  employeeName: string
  date: string
  checkIn: string
  checkOut: string
  status: 'present' | 'absent' | 'late' | 'leave' | 'permission' | 'week-off' | 'on-duty'
  hours: number
  breakTime: number
  overtime: number
  lateMinutes: number
  location?: { lat: number; lng: number; address: string }
}

export interface Leave {
  id: string
  employeeId: string
  employeeName: string
  employeeAvatar?: string
  department: string
  type: 'sick' | 'casual' | 'earned' | 'maternity' | 'paternity' | 'other'
  duration: number
  startDate: string
  endDate: string
  reason: string
  status: 'pending' | 'approved' | 'rejected' | 'clarification'
  priority: 'low' | 'medium' | 'high'
  appliedOn: string
  approvedBy?: string
  approvedOn?: string
  comments?: Comment[]
}

export interface Task {
  id: string
  title: string
  description: string
  assignedTo: string
  assignedToAvatar?: string
  assignedByName?: string
  status: 'drawing-preparation' | 'drawing-document-preparation' | 'drawing-sent-approval' | 'drawing-approval' | 'cr-preparation' | 'waiting-for-inspection-completed' | 'rectification-report' | 'safety-satisfaction'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  dueDate: string
  progress: number
  location?: { lat: number; lng: number; address: string }
  files?: TaskFile[]
  checklist?: ChecklistItem[]
  instructions?: string
  comments?: Comment[]
  createdAt: string
  updatedAt: string
}

export interface TaskFile {
  id: string
  name: string
  url: string
  size: number
  type: string
}

export interface ChecklistItem {
  id: string
  text: string
  completed: boolean
}

export interface Comment {
  id: string
  author: string
  authorAvatar?: string
  text: string
  createdAt: string
}

export interface CRMEntry {
  id: string
  customer: string
  phone: string
  email: string
  address: string
  meeting: string
  status: 'On going' | 'Processed' | 'Dropped'
  details: string
  createdAt: string
  updatedAt: string
}

export interface Payslip {
  id: string
  employeeId: string
  employeeName: string
  month: number
  year: number
  amount: number
  status: 'paid' | 'pending' | 'generated'
  pdfUrl?: string
  generatedAt: string
  paidAt?: string
}

export interface Department {
  id: string
  name: string
  manager: string
  managerAvatar?: string
  headcount: number
  present: number
  absent: number
  leave: number
  overtime: number
  late: number
}

export interface Shift {
  id: string
  name: string
  startTime: string
  endTime: string
  type: 'morning' | 'evening' | 'night' | 'rotational'
  headcount: number
}

export interface Notification {
  id: string
  type: 'check-in' | 'check-out' | 'late' | 'leave' | 'task' | 'crm' | 'permission'
  message: string
  employeeName?: string
  employeeAvatar?: string
  read: boolean
  timestamp: string
}

export interface Report {
  id: string
  name: string
  type: string
  date: string
  data?: unknown
}

export interface KPIData {
  label: string
  value: number
  trend: 'up' | 'down'
  trendValue: string
  icon: string
}

export interface MenuItem {
  label: string
  icon: string
  path?: string
  children?: MenuItem[]
}
