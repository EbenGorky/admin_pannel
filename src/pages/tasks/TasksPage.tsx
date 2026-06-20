import { useState, useCallback, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Avatar, Button, Input } from '@/components/ui'
import {
  Plus, X, Calendar, Clock, MapPin, Paperclip,
  User, CheckCircle, Image, FileText, Navigation, Building2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type TaskStatus = 'drawing-preparation' | 'drawing-document-preparation' | 'drawing-sent-approval' | 'drawing-approval' | 'cr-preparation' | 'waiting-for-inspection-completed' | 'rectification-report' | 'safety-satisfaction'

interface TaskItem {
  id: string
  title: string
  description: string
  location: string
  status: TaskStatus
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assignee: string
  assigneeAvatar: string
  dueDate: string
  progress: number
  instructions: string[]
  attachments: string[]
  checklist: { text: string; done: boolean }[]
  comments: { author: string; text: string; time: string }[]
  files: number
}

const columnConfig: { key: TaskStatus; label: string; color: string }[] = [
  { key: 'drawing-preparation', label: 'Drawing Preparation', color: 'border-t-info' },
  { key: 'drawing-document-preparation', label: 'Drawing Document Preparation', color: 'border-t-primary' },
  { key: 'drawing-sent-approval', label: 'Drawing Sent Approval', color: 'border-t-warning' },
  { key: 'drawing-approval', label: 'Drawing Approval', color: 'border-t-success' },
  { key: 'cr-preparation', label: 'CR Preparation', color: 'border-t-secondary' },
  { key: 'waiting-for-inspection-completed', label: 'Waiting for Inspection Completed', color: 'border-t-info' },
  { key: 'rectification-report', label: 'Rectification Report', color: 'border-t-danger' },
  { key: 'safety-satisfaction', label: 'Safety Satisfaction', color: 'border-t-success' },
]

const initialTasks: TaskItem[] = [
  { id: 'T-001', title: 'Solar Panel Installation', description: 'Install the 25kW solar inverter. Complete cable routing. Perform system testing before handover.', location: 'Madurai Industrial Estate', status: 'drawing-document-preparation', priority: 'high', assignee: 'John Smith', assigneeAvatar: 'JS', dueDate: 'Jun 18', progress: 65, instructions: ['Complete before 5 PM.', 'Wear PPE during installation.', 'Verify wiring before testing.'], attachments: ['site_photo.png', 'wiring_diagram.pdf'], checklist: [{ text: 'Unbox equipment', done: true }, { text: 'Install hardware', done: true }, { text: 'Configure software', done: false }, { text: 'Test system', done: false }], comments: [{ author: 'John Smith', text: 'Started with inspection', time: '2h ago' }], files: 2 },
  { id: 'T-002', title: 'Cable Inspection', description: 'Inspect main power cables for wear and tear. Check grounding connections.', location: 'Chennai Site B', status: 'drawing-preparation', priority: 'medium', assignee: 'Sarah Johnson', assigneeAvatar: 'SJ', dueDate: 'Jun 20', progress: 0, instructions: ['Ensure power is off before inspection.', 'Take photos of any damaged cables.'], attachments: [], checklist: [{ text: 'Gather data', done: false }, { text: 'Create report', done: false }], comments: [], files: 0 },
  { id: 'T-003', title: 'Customer Visit - Downtown Office', description: 'Visit downtown client for quarterly review meeting.', location: '456 Business Ave, NY', status: 'drawing-sent-approval', priority: 'urgent', assignee: 'David Brown', assigneeAvatar: 'DB', dueDate: 'Jun 16', progress: 20, instructions: ['Bring Q2 performance report.', 'Prepare presentation slides.', 'Confirm meeting time with client.'], attachments: ['q2_report.pdf'], checklist: [{ text: 'Prepare presentation', done: true }, { text: 'Review Q2 metrics', done: false }, { text: 'Print reports', done: false }], comments: [{ author: 'Manager', text: 'Make sure to bring the Q2 report', time: '1d ago' }], files: 1 },
  { id: 'T-004', title: 'Inventory Check - Warehouse', description: 'End-of-month inventory count at main warehouse.', location: 'Main Warehouse, Sector 12', status: 'drawing-approval', priority: 'low', assignee: 'Emily Davis', assigneeAvatar: 'ED', dueDate: 'Jun 22', progress: 30, instructions: ['Coordinate with warehouse manager.', 'Use the inventory scanner.'], attachments: [], checklist: [{ text: 'Count raw materials', done: true }, { text: 'Count finished goods', done: false }], comments: [], files: 0 },
  { id: 'T-005', title: 'Safety Training Module Update', description: 'Update the safety training materials with new OSHA guidelines.', location: 'Head Office', status: 'cr-preparation', priority: 'medium', assignee: 'Lisa Anderson', assigneeAvatar: 'LA', dueDate: 'Jun 25', progress: 0, instructions: ['Download latest OSHA guidelines from portal.', 'Cross-reference with existing materials.'], attachments: [], checklist: [{ text: 'Review new guidelines', done: false }, { text: 'Update slides', done: false }], comments: [], files: 0 },
  { id: 'T-006', title: 'Install New Equipment - Site C', description: 'Install and configure new monitoring equipment at Site C.', location: 'Site C, Industrial Zone', status: 'safety-satisfaction', priority: 'high', assignee: 'Mike Williams', assigneeAvatar: 'MW', dueDate: 'Jun 14', progress: 100, instructions: ['Follow installation manual.', 'Test all connections before powering on.', 'Update equipment log.'], attachments: ['installation_manual.pdf', 'site_c_map.png', 'test_results.pdf', 'completion_certificate.pdf'], checklist: [{ text: 'Unbox equipment', done: true }, { text: 'Install hardware', done: true }, { text: 'Configure software', done: true }, { text: 'Test system', done: true }], comments: [{ author: 'Mike Williams', text: 'All done, system is operational', time: '3h ago' }], files: 4 },
  { id: 'T-007', title: 'Quarterly Performance Review', description: 'Prepare and submit quarterly performance data.', location: 'Admin Building', status: 'waiting-for-inspection-completed', priority: 'medium', assignee: 'Emma Taylor', assigneeAvatar: 'ET', dueDate: 'Jun 10', progress: 50, instructions: ['Collect data from all departments.', 'Format as per template.'], attachments: [], checklist: [{ text: 'Collect data', done: true }, { text: 'Draft report', done: true }], comments: [], files: 0 },
  { id: 'T-008', title: 'Client Onboarding - TechVenture', description: 'Onboard new client TechVenture Inc with initial setup.', location: 'TechVenture Office, Cyber City', status: 'rectification-report', priority: 'high', assignee: 'James Wilson', assigneeAvatar: 'JW', dueDate: 'Jun 19', progress: 0, instructions: ['Prepare welcome kit.', 'Set up client portal access.', 'Schedule kickoff meeting.'], attachments: ['welcome_kit.pdf'], checklist: [], comments: [], files: 1 },
  { id: 'T-009', title: 'Vehicle Fleet Maintenance', description: 'Schedule and perform maintenance on 5 service vehicles.', location: 'Company Garage', status: 'cr-preparation', priority: 'medium', assignee: 'John Smith', assigneeAvatar: 'JS', dueDate: 'Jun 21', progress: 40, instructions: ['Check service schedule.', 'Order required parts in advance.', 'Document all maintenance work.'], attachments: [], checklist: [{ text: 'Oil change - Van 1', done: true }, { text: 'Oil change - Van 2', done: true }, { text: 'Tire rotation', done: false }], comments: [], files: 0 },
]

export default function TasksPage() {
  const [searchParams] = useSearchParams()
  const [tasks, setTasks] = useState<TaskItem[]>(initialTasks)
  const [dragTask, setDragTask] = useState<string | null>(null)
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null)
  const [showWizard, setShowWizard] = useState(false)

  // Wizard form state (used both for new tasks and CRM pre-fill)
  const [wizardTitle, setWizardTitle] = useState('')
  const [wizardLocation, setWizardLocation] = useState('')
  const [wizardDescription, setWizardDescription] = useState('')
  const [wizardInstructions, setWizardInstructions] = useState('')
  const [wizardTeams, setWizardTeams] = useState<string[]>([])

  const [wizardPriority, setWizardPriority] = useState('High')
  const [wizardFromCRM, setWizardFromCRM] = useState(false)

  // Detect CRM pre-fill params
  useEffect(() => {
    if (searchParams.get('fromCRM') === 'true') {
      const customer = searchParams.get('customer') || ''
      const notes = searchParams.get('notes') || ''
      setWizardTitle(`Visit - ${customer}`)
      setWizardDescription(notes)
      setWizardLocation('')

      setWizardFromCRM(true)
      setShowWizard(true)
    }
  }, [searchParams])

  const handleDragStart = (taskId: string) => setDragTask(taskId)

  const handleDrop = useCallback((status: TaskStatus) => {
    if (!dragTask) return
    setTasks(prev => prev.map(t => t.id === dragTask ? { ...t, status } : t))
    setDragTask(null)
  }, [dragTask])

  const handleDragOver = (e: React.DragEvent) => e.preventDefault()

  const getColumnTasks = (status: TaskStatus) => tasks.filter(t => t.status === status)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
      <PageHeader title="Site" description="Kanban board for site management">
        <Button onClick={() => { setWizardFromCRM(false); setWizardTitle(''); setWizardDescription(''); setWizardLocation(''); setWizardInstructions(''); setWizardTeams([]); setWizardPriority('High'); setShowWizard(true) }}>
          <Plus size={16} /> New Site
        </Button>
      </PageHeader>

      {/* Kanban columns */}
      <div className="flex gap-4 overflow-x-auto pb-4 min-h-[calc(100vh-220px)]" style={{ scrollbarWidth: 'thin' }}>
        {columnConfig.map((col) => {
          const columnTasks = getColumnTasks(col.key)
          return (
            <div
              key={col.key}
              className="flex-shrink-0 w-[280px] flex flex-col"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(col.key)}
            >
              {/* Column header */}
              <div className={cn('flex items-center justify-between mb-3 px-1')}>
                <div className="flex items-center gap-2">
                  <div className={cn('w-1 h-5 rounded-full', col.color.replace('border-t-', 'bg-'))} />
                  <h3 className="text-sm font-semibold text-text-heading">{col.label}</h3>
                </div>
                <span className="text-xs text-text-muted bg-card-hover px-2 py-0.5 rounded-full">{columnTasks.length}</span>
              </div>

              {/* Droppable area */}
              <div
                className={cn(
                  'flex-1 rounded-radius-card p-2 space-y-2 transition-colors border-2 border-dashed',
                  dragTask ? 'border-primary/30 bg-primary/5' : 'border-transparent'
                )}
              >
                <AnimatePresence>
                  {columnTasks.map((task) => (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      draggable
                      onDragStart={() => handleDragStart(task.id)}
                      onClick={() => setSelectedTask(task)}
                      className="bg-card border border-border rounded-radius-card p-3 cursor-grab active:cursor-grabbing hover:border-primary/30 hover:shadow-card-hover transition-all group"
                    >
                      {/* Priority + status */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <StatusBadge status={task.priority} />
                        {task.files > 0 && (
                          <div className="flex items-center gap-1 text-xs text-text-muted">
                            <Paperclip size={12} />
                            {task.files}
                          </div>
                        )}
                      </div>

                      {/* Title */}
                      <h4 className="text-sm font-medium text-text-heading leading-snug mb-2 line-clamp-2">{task.title}</h4>

                      {/* Location */}
                      <div className="flex items-center gap-1 mb-2">
                        <MapPin size={11} className="text-text-muted shrink-0" />
                        <span className="text-xs text-text-muted truncate">{task.location}</span>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar fallback={task.assigneeAvatar} size="sm" />
                          <span className="text-xs text-text-muted">{task.assignee.split(' ')[0]}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-text-muted">
                          <Calendar size={10} />
                          {task.dueDate}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )
        })}
      </div>

      {/* Task Detail Drawer */}
      <AnimatePresence>
        {selectedTask && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setSelectedTask(null)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-lg bg-card border-l border-border z-50 shadow-dropdown overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-card z-10">
                <div className="flex items-center gap-2">
                  <StatusBadge status={selectedTask.priority} />
                  <span className="text-xs text-text-muted">{selectedTask.id}</span>
                </div>
                <button onClick={() => setSelectedTask(null)} className="p-2 rounded-radius-button text-text-muted hover:text-text-heading hover:bg-card-hover transition-colors cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <div className="p-4 space-y-5">
                {/* Title + description */}
                <div>
                  <h2 className="text-lg font-semibold text-text-heading mb-2">{selectedTask.title}</h2>
                  <p className="text-sm text-text-muted">{selectedTask.description}</p>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Assignee', value: selectedTask.assignee, icon: User },
                    { label: 'Due Date', value: selectedTask.dueDate, icon: Calendar },
                    { label: 'Status', value: selectedTask.status.replace('-', ' '), icon: Clock },
                    { label: 'Progress', value: `${selectedTask.progress}%`, icon: CheckCircle },
                  ].map((f) => {
                    const Icon = f.icon
                    return (
                      <div key={f.label} className="p-3 rounded-radius-button bg-card-hover flex items-center gap-3">
                        <Icon size={14} className="text-text-muted shrink-0" />
                        <div>
                          <p className="text-xs text-text-muted">{f.label}</p>
                          <p className="text-sm font-medium text-text-heading capitalize">{f.value}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Site Location — matches worker app */}
                <div>
                  <h4 className="text-sm font-semibold text-text-heading mb-2">Site Location</h4>
                  <div className="flex items-center gap-2 p-3 rounded-radius-button bg-card-hover mb-2">
                    <MapPin size={14} className="text-text-muted shrink-0" />
                    <span className="text-sm text-text">{selectedTask.location}</span>
                  </div>
                  <Button variant="secondary" size="sm">
                    <Navigation size={14} /> Open in Maps
                  </Button>
                </div>

                {/* Instructions — orange tinted box (matches worker app) */}
                {selectedTask.instructions.length > 0 && (
                  <div className="p-3 rounded-radius-button bg-orange-500/5 border border-orange-500/20">
                    <h4 className="text-sm font-semibold text-orange-500 mb-2">Instructions</h4>
                    <div className="space-y-1">
                      {selectedTask.instructions.map((inst, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-orange-800">
                          <span className="text-orange-500 mt-0.5">•</span>
                          <span>{inst}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Attachments — thumbnails/docs (matches worker app) */}
                {selectedTask.attachments.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-text-heading mb-3">Attachments</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTask.attachments.map((att, i) => {
                        const isImage = att.match(/\.(png|jpg|jpeg|gif|svg)$/i)
                        return (
                          <div key={i} className={cn(
                            'flex items-center gap-2 p-2 rounded-radius-button border border-border cursor-pointer hover:border-primary/30 transition-colors',
                            isImage ? 'bg-card' : 'bg-card-hover'
                          )}>
                            {isImage ? (
                              <div className="w-10 h-10 rounded bg-card-hover flex items-center justify-center">
                                <Image size={18} className="text-text-muted" />
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded bg-primary/5 flex items-center justify-center">
                                <FileText size={18} className="text-primary" />
                              </div>
                            )}
                            <span className="text-xs text-text-muted max-w-[120px] truncate">{att}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Checklist */}
                {selectedTask.checklist.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-text-heading mb-3">Checklist</h4>
                    <div className="space-y-2">
                      {selectedTask.checklist.map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className={cn(
                            'w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors',
                            item.done ? 'bg-success border-success' : 'border-border-light'
                          )}>
                            {item.done && <CheckCircle size={12} className="text-white" />}
                          </div>
                          <span className={cn('text-sm', item.done ? 'text-text-muted line-through' : 'text-text-heading')}>
                            {item.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Comments */}
                <div>
                  <h4 className="text-sm font-semibold text-text-heading mb-3">Comments ({selectedTask.comments.length})</h4>
                  <div className="space-y-3 mb-3">
                    {selectedTask.comments.length === 0 ? (
                      <p className="text-sm text-text-muted">No comments yet</p>
                    ) : (
                      selectedTask.comments.map((c, i) => (
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

                {/* Actions */}
                <div className="flex items-center gap-3 pt-2">
                  <Button variant="default" className="flex-1" onClick={() => { setSelectedTask(null); setShowWizard(true) }}>
                    Reassign
                  </Button>
                  <Button variant="secondary" className="flex-1">
                    <MapPin size={14} /> View Location
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Task Assignment Wizard Modal */}
      <AnimatePresence>
        {showWizard && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowWizard(false)}
            />
            <div className="fixed inset-0 z-50 overflow-y-auto pointer-events-none">
              <div className="flex min-h-full items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-card border border-border rounded-radius-card shadow-dropdown w-full max-w-xl pointer-events-auto overflow-hidden"
                >
                  <div className="flex items-center justify-between p-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-semibold text-text-heading">Assign New Site</h2>
                    {wizardFromCRM && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        <Building2 size={11} /> From CRM
                      </span>
                    )}
                  </div>
                  <button onClick={() => setShowWizard(false)} className="p-2 rounded-radius-button text-text-muted hover:text-text-heading hover:bg-card-hover transition-colors cursor-pointer">
                    <X size={18} />
                  </button>
                </div>
                <div className="p-4 space-y-4">


                  {/* Form fields */}
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-text-muted mb-1.5 block">Select Teams</label>
                      <div className="border border-border-light rounded-radius-input p-2 max-h-40 overflow-y-auto">
                        <div className="grid grid-cols-4 gap-1">
                          {['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Golf', 'Hotel', 'India', 'Juliet', 'Kilo', 'Lima', 'Mike', 'November', 'Oscar', 'Papa', 'Quebec', 'Romeo', 'Sierra', 'Tango', 'Uniform', 'Victor', 'Whiskey', 'Xray', 'Yankee'].map(team => (
                            <label
                              key={team}
                              className={cn(
                                'flex items-center gap-1.5 p-1.5 rounded-radius-button cursor-pointer transition-colors',
                                wizardTeams.includes(team) ? 'bg-primary/5' : 'hover:bg-card-hover'
                              )}
                            >
                              <input
                                type="checkbox"
                                checked={wizardTeams.includes(team)}
                                onChange={() => setWizardTeams(prev =>
                                  prev.includes(team) ? prev.filter(t => t !== team) : [...prev, team]
                                )}
                                className="w-4 h-4 rounded border-border-light text-primary focus:ring-primary/30 cursor-pointer shrink-0"
                              />
                              <span className="text-sm text-text-heading truncate">{team}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-text-muted mb-1.5 block">Task Title</label>
                      <Input placeholder="Enter task title" value={wizardTitle} onChange={e => setWizardTitle(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-text-muted mb-1.5 block">Location / Site</label>
                      <Input placeholder="e.g. Madurai Industrial Estate" value={wizardLocation} onChange={e => setWizardLocation(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-text-muted mb-1.5 block">Description</label>
                      <textarea className="w-full h-20 rounded-radius-input border border-border-light bg-card px-3 py-2 text-sm text-text-heading placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none" placeholder="Describe the task..." value={wizardDescription} onChange={e => setWizardDescription(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-text-muted mb-1.5 block">Instructions (one per line)</label>
                      <textarea className="w-full h-20 rounded-radius-input border border-border-light bg-card px-3 py-2 text-sm text-text-heading placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none" placeholder="e.g.&#10;Wear PPE during installation&#10;Complete before 5 PM&#10;Verify wiring before testing" value={wizardInstructions} onChange={e => setWizardInstructions(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-text-muted mb-1.5 block">Attachments</label>
                      <div className="border-2 border-dashed border-border-light rounded-radius-input p-4 text-center cursor-pointer hover:border-primary/30 transition-colors">
                        <Paperclip size={20} className="text-text-muted mx-auto mb-1" />
                        <p className="text-xs text-text-muted">Click to upload files or drag & drop</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-text-muted mb-1.5 block">Priority</label>
                        <select className="w-full h-10 rounded-radius-input border border-border-light bg-card px-3 text-sm text-text-heading focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none cursor-pointer" value={wizardPriority} onChange={e => setWizardPriority(e.target.value)}>
                          <option>Low</option>
                          <option>Medium</option>
                          <option>High</option>
                          <option>Urgent</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-text-muted mb-1.5 block">Due Date</label>
                        <input type="date" className="w-full h-10 rounded-radius-input border border-border-light bg-card px-3 text-sm text-text-heading focus:outline-none focus:ring-2 focus:ring-primary/30" />
                      </div>
                    </div>
                  </div>
                </div>
                  {/* Actions */}
                  <div className="flex items-center justify-between p-4 border-t border-border bg-card">
                  <Button variant="ghost" onClick={() => setShowWizard(false)}>Cancel</Button>
                  <Button>
                    <Plus size={16} /> Assign Task
                  </Button>
                </div>
                </motion.div>
              </div>
            </div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
