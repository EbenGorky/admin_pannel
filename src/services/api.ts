import apiClient from '@/api/client'
import type { Employee, Attendance, Leave, Task, CRMEntry, Payslip, Department, Shift, Notification } from '@/types'

export const employeeApi = {
  getAll: () => apiClient.get<Employee[]>('/employees'),
  getById: (id: string) => apiClient.get<Employee>(`/employees/${id}`),
}

export const attendanceApi = {
  getAll: () => apiClient.get<Attendance[]>('/attendance'),
  getByEmployee: (id: string) => apiClient.get<Attendance[]>(`/attendance/employee/${id}`),
  getOverview: () => apiClient.get('/attendance/overview'),
}

export const leaveApi = {
  getAll: (status?: string) => apiClient.get<Leave[]>('/leaves', { params: { status } }),
  approve: (id: string) => apiClient.put(`/leaves/${id}/approve`),
  reject: (id: string) => apiClient.put(`/leaves/${id}/reject`),
  requestClarification: (id: string, comment: string) => apiClient.put(`/leaves/${id}/clarification`, { comment }),
}

export const taskApi = {
  getAll: () => apiClient.get<Task[]>('/tasks'),
  getById: (id: string) => apiClient.get<Task>(`/tasks/${id}`),
  create: (task: Partial<Task>) => apiClient.post('/tasks', task),
  updateStatus: (id: string, status: Task['status']) => apiClient.put(`/tasks/${id}/status`, { status }),
}

export const crmApi = {
  getAll: () => apiClient.get<CRMEntry[]>('/crm'),
  create: (entry: Partial<CRMEntry>) => apiClient.post('/crm', entry),
  update: (id: string, entry: Partial<CRMEntry>) => apiClient.put(`/crm/${id}`, entry),
  delete: (id: string) => apiClient.delete(`/crm/${id}`),
}

export const payslipApi = {
  getAll: (employeeId?: string) => apiClient.get<Payslip[]>('/payslips', { params: { employeeId } }),
  generate: (employeeId: string, month: number, year: number) => apiClient.post('/payslips/generate', { employeeId, month, year }),
  download: (id: string) => apiClient.get(`/payslips/${id}/download`, { responseType: 'blob' }),
  email: (id: string) => apiClient.post(`/payslips/${id}/email`),
}

export const departmentApi = {
  getAll: () => apiClient.get<Department[]>('/departments'),
}

export const shiftApi = {
  getAll: () => apiClient.get<Shift[]>('/shifts'),
}

export const notificationApi = {
  getAll: () => apiClient.get<Notification[]>('/notifications'),
  markRead: (id: string) => apiClient.put(`/notifications/${id}/read`),
}
