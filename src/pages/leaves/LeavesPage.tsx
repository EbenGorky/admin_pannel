import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Card, CardContent, Avatar, Button, Tabs, TabsList, TabsTrigger, Input } from '@/components/ui'
import {
  CheckCircle, XCircle,
  MessageSquare, X, ChevronRight, Search, Timer,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface LeaveBalance {
  type: string
  total: number
  planned: number
  availed: number
  balance: number
}

interface LeaveRequest {
  id: string
  employee: string
  employeeId: string
  avatar: string
  department: string
  type: 'Leave' | 'Medical' | 'LOP' | 'Permission'
  duration: number
  startDate: string
  endDate: string
  permissionHours?: string
  appliedOn: string
  reason: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'approved' | 'rejected'
  balance: LeaveBalance[]
  hasNewReply?: boolean
  adminReply?: string
  approvedBy?: string
  history: { date: string; action: string; by: string }[]
  comments: { author: string; text: string; time: string }[]
}

const leaveRequests: LeaveRequest[] = [
  {
    id: 'LV-001', employee: 'Sarah Johnson', employeeId: 'EMP-0002', avatar: 'SJ', department: 'Field Service',
    type: 'Medical', duration: 3, startDate: 'Jun 18, 2026', endDate: 'Jun 20, 2026', appliedOn: 'Jun 15, 2026',
    reason: 'Experiencing severe flu symptoms and need to recover. Have consulted with doctor who recommended 3 days rest.',
    priority: 'high', status: 'pending',
    balance: [
      { type: 'Leave', total: 24, planned: 4, availed: 8, balance: 12 },
      { type: 'Medical', total: 10, planned: 2, availed: 3, balance: 5 },
    ],
    history: [
      { date: 'Jun 15, 2026', action: 'Submitted', by: 'Sarah Johnson' },
    ],
    comments: [
      { author: 'Sarah Johnson', text: 'I have attached the medical certificate.', time: '10:30 AM' },
    ],
  },
  {
    id: 'LV-002', employee: 'Mike Williams', employeeId: 'EMP-0003', avatar: 'MW', department: 'Engineering',
    type: 'Leave', duration: 1, startDate: 'Jun 19, 2026', endDate: 'Jun 19, 2026', appliedOn: 'Jun 14, 2026',
    reason: 'Personal family commitment - need to attend my sister\'s graduation ceremony.',
    priority: 'medium', status: 'pending',
    balance: [
      { type: 'Leave', total: 24, planned: 6, availed: 5, balance: 13 },
      { type: 'Medical', total: 10, planned: 1, availed: 2, balance: 7 },
    ],
    history: [
      { date: 'Jun 14, 2026', action: 'Submitted', by: 'Mike Williams' },
    ],
    comments: [],
  },
  {
    id: 'LV-003', employee: 'Emily Davis', employeeId: 'EMP-0004', avatar: 'ED', department: 'Sales',
    type: 'Leave', duration: 5, startDate: 'Jun 22, 2026', endDate: 'Jun 26, 2026', appliedOn: 'Jun 10, 2026',
    reason: 'Planned vacation with family. Already approved by team lead.',
    priority: 'low', status: 'pending',
    balance: [
      { type: 'Leave', total: 24, planned: 8, availed: 4, balance: 12 },
      { type: 'Medical', total: 10, planned: 0, availed: 1, balance: 9 },
    ],
    history: [
      { date: 'Jun 10, 2026', action: 'Submitted', by: 'Emily Davis' },
    ],
    comments: [],
  },
  {
    id: 'LV-004', employee: 'David Brown', employeeId: 'EMP-0005', avatar: 'DB', department: 'Operations',
    type: 'Medical', duration: 2, startDate: 'Jun 16, 2026', endDate: 'Jun 17, 2026', appliedOn: 'Jun 16, 2026',
    reason: 'Medical emergency - food poisoning.',
    priority: 'urgent', status: 'pending',
    balance: [
      { type: 'Medical', total: 10, planned: 2, availed: 5, balance: 3 },
      { type: 'Leave', total: 24, planned: 3, availed: 7, balance: 14 },
    ],
    history: [
      { date: 'Jun 16, 2026', action: 'Submitted', by: 'David Brown' },
    ],
    comments: [],
  },
  {
    id: 'LV-005', employee: 'Lisa Anderson', employeeId: 'EMP-0006', avatar: 'LA', department: 'Field Service',
    type: 'Leave', duration: 1, startDate: 'Jun 12, 2026', endDate: 'Jun 12, 2026', appliedOn: 'Jun 10, 2026',
    reason: 'Personal errand.',
    priority: 'low', status: 'approved',
    balance: [
      { type: 'Leave', total: 24, planned: 3, availed: 8, balance: 13 },
    ],
    adminReply: 'Approved. Please coordinate with your team.',
    approvedBy: 'Alex Johnson',
    history: [
      { date: 'Jun 10, 2026', action: 'Submitted', by: 'Lisa Anderson' },
      { date: 'Jun 11, 2026', action: 'Approved', by: 'Alex Johnson' },
    ],
    comments: [],
  },
  {
    id: 'LV-006', employee: 'James Wilson', employeeId: 'EMP-0007', avatar: 'JW', department: 'Support',
    type: 'LOP', duration: 3, startDate: 'Jun 8, 2026', endDate: 'Jun 10, 2026', appliedOn: 'Jun 1, 2026',
    reason: 'Family event - cousin\'s wedding.',
    priority: 'medium', status: 'rejected',
    balance: [
      { type: 'Leave', total: 24, planned: 5, availed: 10, balance: 9 },
    ],
    adminReply: 'Insufficient leave balance. Please use LOP only in case of emergency.',
    approvedBy: 'Maria Garcia',
    hasNewReply: true,
    history: [
      { date: 'Jun 1, 2026', action: 'Submitted', by: 'James Wilson' },
      { date: 'Jun 3, 2026', action: 'Rejected - Insufficient balance', by: 'Maria Garcia' },
    ],
    comments: [
      { author: 'Maria Garcia', text: 'You don\'t have enough earned leave balance. Please use casual leave instead.', time: 'Jun 3, 2026' },
    ],
  },
  {
    id: 'LV-007', employee: 'Emma Taylor', employeeId: 'EMP-0008', avatar: 'ET', department: 'Field Service',
    type: 'Permission', duration: 0, startDate: 'Jun 15, 2026', endDate: 'Jun 15, 2026',
    permissionHours: '2h',
    appliedOn: 'Jun 15, 2026',
    reason: 'Need to step out for a personal appointment.',
    priority: 'low', status: 'pending',
    balance: [
      { type: 'Leave', total: 24, planned: 2, availed: 6, balance: 16 },
    ],
    history: [
      { date: 'Jun 15, 2026', action: 'Submitted', by: 'Emma Taylor' },
    ],
    comments: [],
  },
]

const stats = [
  { label: 'Pending', value: '4' },
  { label: 'Approved', value: '12' },
  { label: 'Rejected', value: '3' },
  { label: 'Avg Approval', value: '4.2h' },
]

import { KPICard } from '@/components/cards'

export default function LeavesPage() {
  const [activeTab, setActiveTab] = useState('pending')
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null)
  const [search, setSearch] = useState('')

  const filteredLeaves = leaveRequests.filter(l =>
    l.status === activeTab &&
    (l.employee.toLowerCase().includes(search.toLowerCase()) ||
     l.employeeId.toLowerCase().includes(search.toLowerCase()))
  )
  const allLeaves = leaveRequests.filter(l =>
    l.employee.toLowerCase().includes(search.toLowerCase()) ||
    l.employeeId.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
      <PageHeader title="Leave Management" description="Approve and track employee leave requests" />

      {/* Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <KPICard key={stat.label} label={stat.label} value={stat.value} />
        ))}
      </div>

      {/* Search + Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <Input placeholder="Search employee..." className="pl-8 h-9 text-sm" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            {['pending', 'approved', 'rejected', 'history'].map((tab) => (
              <TabsTrigger key={tab} value={tab} data-active={activeTab === tab} className="capitalize">
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Leave table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {['Employee', 'Type', 'Duration', 'Applied', 'Start | End', 'Priority', 'Reply', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(activeTab === 'history' ? allLeaves : filteredLeaves).length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-sm text-text-muted">
                      No {activeTab} leave requests
                    </td>
                  </tr>
                ) : (activeTab === 'history' ? allLeaves : filteredLeaves).map((leave) => (
                  <tr
                    key={leave.id}
                    className="border-b border-border last:border-0 hover:bg-card-hover transition-colors cursor-pointer"
                    onClick={() => setSelectedLeave(leave)}
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar fallback={leave.avatar} size="sm" />
                        <div>
                          <p className="text-sm font-medium text-text-heading">{leave.employee}</p>
                          <p className="text-xs text-text-muted">{leave.employeeId} · {leave.department}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={cn(
                        'inline-flex items-center gap-1.5 text-sm font-medium px-2 py-0.5 rounded-full',
                        leave.type === 'Leave' && 'bg-blue-500/10 text-blue-500',
                        leave.type === 'Medical' && 'bg-green-500/10 text-green-500',
                        leave.type === 'LOP' && 'bg-orange-500/10 text-orange-500',
                        leave.type === 'Permission' && 'bg-purple-500/10 text-purple-500',
                      )}>
                        {leave.type === 'Permission' && <Timer size={12} />}
                        {leave.type}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-text">
                      {leave.type === 'Permission' ? leave.permissionHours : `${leave.duration} day${leave.duration > 1 ? 's' : ''}`}
                    </td>
                    <td className="px-4 py-3.5 text-sm text-text-muted">{leave.appliedOn}</td>
                    <td className="px-4 py-3.5 text-sm text-text-muted whitespace-nowrap">{leave.startDate} | {leave.endDate}</td>
                    <td className="px-4 py-3.5"><StatusBadge status={leave.priority} /></td>
                    <td className="px-4 py-3.5">
                      {leave.hasNewReply && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 text-xs font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          New Reply
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button className="p-1.5 rounded-radius-button text-success hover:bg-success/10 transition-colors cursor-pointer" title="Approve">
                          <CheckCircle size={16} />
                        </button>
                        <button className="p-1.5 rounded-radius-button text-danger hover:bg-danger/10 transition-colors cursor-pointer" title="Reject">
                          <XCircle size={16} />
                        </button>
                        <button className="p-1.5 rounded-radius-button text-info hover:bg-info/10 transition-colors cursor-pointer" title="Request Clarification">
                          <MessageSquare size={16} />
                        </button>
                        <ChevronRight size={16} className="text-text-muted" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Side Drawer */}
      <AnimatePresence>
        {selectedLeave && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setSelectedLeave(null)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-lg bg-card border-l border-border z-50 shadow-dropdown overflow-y-auto"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-card z-10">
                <h2 className="text-lg font-semibold text-text-heading">Leave Details</h2>
                <button onClick={() => setSelectedLeave(null)} className="p-2 rounded-radius-button text-text-muted hover:text-text-heading hover:bg-card-hover transition-colors cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <div className="p-4 space-y-6">
                {/* Employee info */}
                <div className="flex items-center gap-3">
                  <Avatar fallback={selectedLeave.avatar} size="lg" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-text-heading">{selectedLeave.employee}</h3>
                      {selectedLeave.hasNewReply && (
                        <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" title="New reply" />
                      )}
                    </div>
                    <p className="text-sm text-text-muted">{selectedLeave.employeeId} · {selectedLeave.department}</p>
                  </div>
                </div>

                {/* Leave type badge */}
                <div className={cn(
                  'inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full',
                  selectedLeave.type === 'Leave' && 'bg-blue-500/10 text-blue-500',
                  selectedLeave.type === 'Medical' && 'bg-green-500/10 text-green-500',
                  selectedLeave.type === 'LOP' && 'bg-orange-500/10 text-orange-500',
                  selectedLeave.type === 'Permission' && 'bg-purple-500/10 text-purple-500',
                )}>
                  {selectedLeave.type === 'Permission' && <Timer size={14} />}
                  {selectedLeave.type}
                </div>

                {/* Leave details */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Leave Type', value: selectedLeave.type },
                    { label: 'Duration', value: selectedLeave.type === 'Permission' ? (selectedLeave.permissionHours ?? '-') : `${selectedLeave.duration} day${selectedLeave.duration > 1 ? 's' : ''}` },
                    { label: 'Start Date', value: selectedLeave.startDate },
                    { label: 'End Date', value: selectedLeave.endDate },
                    { label: 'Applied On', value: selectedLeave.appliedOn },
                    { label: 'Priority', value: selectedLeave.priority },
                  ].map((f) => (
                    <div key={f.label} className="p-3 rounded-radius-button bg-card-hover">
                      <p className="text-xs text-text-muted mb-1">{f.label}</p>
                      <p className="text-sm font-medium text-text-heading capitalize">{f.value}</p>
                    </div>
                  ))}
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-sm font-semibold text-text-heading mb-2">Reason</h4>
                  <p className="text-sm text-text bg-card-hover p-3 rounded-radius-button">{selectedLeave.reason}</p>
                </div>

                {/* Action buttons */}
                {selectedLeave.status === 'pending' && (
                  <div className="flex items-center gap-3">
                    <Button className="flex-1" variant="default">
                      <CheckCircle size={16} /> Approve
                    </Button>
                    <Button className="flex-1" variant="danger">
                      <XCircle size={16} /> Reject
                    </Button>
                    <Button variant="secondary">
                      <MessageSquare size={16} />
                    </Button>
                  </div>
                )}

                {/* Leave Quota Banner — matches worker app */}
                {selectedLeave.balance.map((b) => (
                  <div key={b.type}>
                    <h4 className="text-sm font-semibold text-text-heading mb-3">{b.type} Quota</h4>
                    <div className="p-4 rounded-radius-button bg-card-hover border border-border">
                      <div className="grid grid-cols-4 gap-2 text-center">
                        <div>
                          <p className="text-lg font-bold text-text-heading">{b.total}</p>
                          <p className="text-xs text-text-muted">Total</p>
                        </div>
                        <div className="border-l border-border">
                          <p className="text-lg font-bold text-text-heading">{b.planned}</p>
                          <p className="text-xs text-text-muted">Planned</p>
                        </div>
                        <div className="border-l border-border">
                          <p className="text-lg font-bold text-text-heading">{b.availed}</p>
                          <p className="text-xs text-text-muted">Availed</p>
                        </div>
                        <div className="border-l border-border">
                          <p className="text-lg font-bold text-primary">{b.balance}</p>
                          <p className="text-xs text-text-muted">Balance</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Admin Reply (matches worker app card) */}
                <div>
                  <h4 className="text-sm font-semibold text-text-heading mb-2">Admin Reply</h4>
                  <p className="text-sm text-text bg-card-hover p-3 rounded-radius-button">
                    {selectedLeave.adminReply ?? 'Waiting for review...'}
                  </p>
                  {selectedLeave.approvedBy && (
                    <div className="mt-2 flex items-center justify-between text-xs text-text-muted">
                      <span>Processed by: {selectedLeave.approvedBy}</span>
                    </div>
                  )}
                </div>

                {/* History */}
                <div>
                  <h4 className="text-sm font-semibold text-text-heading mb-3">History</h4>
                  <div className="space-y-2">
                    {selectedLeave.history.map((h, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                        <div>
                          <p className="text-sm text-text-heading">{h.action}</p>
                          <p className="text-xs text-text-muted">{h.by} · {h.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Comments */}
                <div>
                  <h4 className="text-sm font-semibold text-text-heading mb-3">Comments ({selectedLeave.comments.length})</h4>
                  <div className="space-y-3 mb-3">
                    {selectedLeave.comments.length === 0 ? (
                      <p className="text-sm text-text-muted">No comments yet</p>
                    ) : (
                      selectedLeave.comments.map((c, i) => (
                        <div key={i} className="p-3 rounded-radius-button bg-card-hover">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-text-heading">{c.author}</span>
                            <span className="text-xs text-text-muted">{c.time}</span>
                          </div>
                          <p className="text-sm text-text">{c.text}</p>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Input placeholder="Add a comment..." className="flex-1" />
                    <Button size="sm">Send</Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
