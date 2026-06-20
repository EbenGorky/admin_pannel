import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Input, Select, Button } from '@/components/ui'
import {
  Search, Phone, Mail, Calendar, Edit3, Plus, Building2, ListChecks, X,
  MapPin, Grid3X3, List,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const statuses = ['On going', 'Processed', 'Dropped'] as const

interface CRMItem {
  id: string
  customer: string
  phone: string
  email: string
  address: string
  meeting: string
  status: typeof statuses[number]
  details: string
}

let nextId = 8
const initialData: CRMItem[] = [
  { id: 'CRM-001', customer: 'Acme Corporation', phone: '+1 (212) 555-0198', email: 'contact@acme.com', address: '123 Main St, New York, NY', meeting: '12/06/2026', status: 'On going', details: 'Quarterly review completed. Interested in new service package.' },
  { id: 'CRM-002', customer: 'TechVenture Inc', phone: '+1 (415) 555-0241', email: 'info@techventure.io', address: '456 Oak Ave, San Francisco, CA', meeting: '18/06/2026', status: 'On going', details: 'Scheduled demo for new monitoring system.' },
  { id: 'CRM-003', customer: 'GreenEnergy Ltd', phone: '+1 (310) 555-0372', email: 'hello@greenenergy.co', address: '789 Pine Rd, Los Angeles, CA', meeting: '08/06/2026', status: 'Processed', details: 'Installation completed. Follow-up in 2 weeks.' },
  { id: 'CRM-004', customer: 'BuildRight Co', phone: '+1 (718) 555-0418', email: 'info@buildright.com', address: '321 Broadway, New York, NY', meeting: '03/06/2026', status: 'Processed', details: 'Project completed successfully. Invoice sent.' },
  { id: 'CRM-005', customer: 'CityPower Utilities', phone: '+1 (617) 555-0593', email: 'procurement@citypower.gov', address: '555 Market St, Boston, MA', meeting: '22/06/2026', status: 'On going', details: 'Proposal submitted for annual maintenance contract.' },
  { id: 'CRM-006', customer: 'MedCore Health', phone: '+1 (312) 555-0674', email: 'facilities@medcore.com', address: '777 Health Blvd, Chicago, IL', meeting: '28/05/2026', status: 'Dropped', details: 'Audit completed. No further action needed.' },
  { id: 'CRM-007', customer: 'Skyline Properties', phone: '+1 (212) 555-0821', email: 'pm@skylineprop.com', address: '999 Park Blvd, New York, NY', meeting: '25/06/2026', status: 'On going', details: 'New construction walkthrough scheduled.' },
]

function emptyForm(): Omit<CRMItem, 'id'> {
  return { customer: '', phone: '', email: '', address: '', meeting: '', status: 'On going', details: '' }
}

const statusBadgeMap: Record<string, 'active' | 'pending' | 'closed' | 'archived'> = {
  'On going': 'active',
  'Processed': 'closed',
  'Dropped': 'archived',
}

export default function CRMPage() {
  const navigate = useNavigate()
  const [records, setRecords] = useState<CRMItem[]>(initialData)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Omit<CRMItem, 'id'>>(emptyForm())
  const [detailItem, setDetailItem] = useState<CRMItem | null>(null)
  const [view, setView] = useState<'grid' | 'list'>('grid')

  const filtered = records.filter(c => {
    if (search && !c.customer.toLowerCase().includes(search.toLowerCase())) return false
    if (statusFilter !== 'all' && c.status !== statusFilter) return false
    return true
  })

  function openAddForm() {
    setEditingId(null)
    setForm(emptyForm())
    setShowForm(true)
  }

  function openEditForm(item: CRMItem) {
    setEditingId(item.id)
    setForm({ customer: item.customer, phone: item.phone, email: item.email, address: item.address, meeting: item.meeting, status: item.status, details: item.details })
    setShowForm(true)
  }

  function handleSubmit() {
    if (!form.customer.trim() || !form.phone.trim()) return
    if (editingId) {
      setRecords(prev => prev.map(r => r.id === editingId ? { ...r, ...form } : r))
    } else {
      setRecords(prev => [...prev, { id: `CRM-${String(nextId++).padStart(3, '0')}`, ...form }])
    }
    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm())
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
      <PageHeader title="CRM" description="Customer relationship management">
        <Button onClick={openAddForm}><Plus size={16} /> Add Customer</Button>
      </PageHeader>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <Input placeholder="Search customer..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-9 text-sm" />
        </div>
        <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="h-9 text-sm w-[140px]">
          <option value="all">All Status</option>
          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
        </Select>
        <span className="text-xs text-text-muted">{filtered.length} records</span>
        <div className="flex items-center gap-2 bg-card border border-border-light rounded-radius-button p-1 ml-auto">
          <button
            onClick={() => setView('grid')}
            className={cn('p-2 rounded-radius-button transition-colors cursor-pointer', view === 'grid' ? 'bg-primary text-white' : 'text-text-muted hover:text-text-heading')}
          >
            <Grid3X3 size={16} />
          </button>
          <button
            onClick={() => setView('list')}
            className={cn('p-2 rounded-radius-button transition-colors cursor-pointer', view === 'list' ? 'bg-primary text-white' : 'text-text-muted hover:text-text-heading')}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((crm, i) => (
            <motion.div
              key={crm.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.03 }}
              className="bg-card border border-border rounded-radius-card p-4 hover:border-primary/30 hover:shadow-card-hover transition-all cursor-pointer"
              onClick={() => setDetailItem(crm)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Building2 size={18} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-text-heading truncate">{crm.customer}</h3>
                  <p className="text-xs text-text-muted">{crm.meeting}</p>
                </div>
                <StatusBadge status={statusBadgeMap[crm.status] || 'active'} />
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-radius-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {['ID', 'Customer', 'Meeting', 'Phone', 'Email', 'Status'].map(h => (
                    <th key={h} className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((crm, i) => (
                  <motion.tr
                    key={crm.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: i * 0.02 }}
                    className="border-b border-border last:border-0 hover:bg-card-hover transition-colors cursor-pointer"
                    onClick={() => setDetailItem(crm)}
                  >
                    <td className="px-4 py-3 text-sm text-text-muted whitespace-nowrap">{crm.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center shrink-0">
                          <Building2 size={14} className="text-primary" />
                        </div>
                        <span className="text-sm font-medium text-text-heading">{crm.customer}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-text whitespace-nowrap">{crm.meeting}</td>
                    <td className="px-4 py-3 text-sm text-text-muted whitespace-nowrap">{crm.phone}</td>
                    <td className="px-4 py-3 text-sm text-text-muted whitespace-nowrap">{crm.email}</td>
                    <td className="px-4 py-3"><StatusBadge status={statusBadgeMap[crm.status] || 'active'} /></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail popup modal */}
      <AnimatePresence>
        {detailItem && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setDetailItem(null)}
            />
            <div className="fixed inset-0 z-50 overflow-y-auto pointer-events-none">
              <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.92, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-card border border-border rounded-radius-card w-full max-w-lg pointer-events-auto overflow-hidden"
                onClick={e => e.stopPropagation()}
              >
              <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 size={18} className="text-primary" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-text-heading">{detailItem.customer}</h2>
                    <div className="flex items-center gap-2 mt-0.5">
                      <StatusBadge status={statusBadgeMap[detailItem.status] || 'active'} />
                      <span className="text-xs text-text-muted">{detailItem.meeting}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setDetailItem(null)} className="p-2 rounded-radius-button text-text-muted hover:text-text-heading hover:bg-card-hover transition-colors cursor-pointer">
                  <X size={16} />
                </button>
              </div>

              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm text-text-muted">
                  <Phone size={13} className="shrink-0 text-primary" />
                  <span>{detailItem.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-text-muted">
                  <Mail size={13} className="shrink-0 text-primary" />
                  <span className="truncate">{detailItem.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-text-muted">
                  <MapPin size={13} className="shrink-0 text-primary" />
                  <span className="truncate">{detailItem.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-text-muted">
                  <Calendar size={13} className="shrink-0 text-primary" />
                  <span>{detailItem.meeting}</span>
                </div>

                <div className="pt-2 border-t border-border">
                  <p className="text-xs font-medium text-text-heading mb-1.5">Details / Requirements</p>
                  <p className="text-sm text-text-muted leading-relaxed">{detailItem.details}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-4 border-t border-border shrink-0 bg-card">
                <button
                  onClick={() => { setDetailItem(null); openEditForm(detailItem) }}
                  className="flex items-center justify-center gap-1.5 flex-1 py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-radius-button transition-colors cursor-pointer"
                >
                  <Edit3 size={14} /> Edit
                </button>
                <button
                  onClick={() => navigate(`/app/tasks?fromCRM=true&customer=${encodeURIComponent(detailItem.customer)}&notes=${encodeURIComponent(detailItem.details)}`)}
                  className="flex items-center justify-center gap-1.5 flex-1 py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-radius-button transition-colors cursor-pointer"
                >
                  <ListChecks size={14} /> Site
                </button>
              </div>
              </motion.div>
            </div>
          </div>
        </>
        )}
      </AnimatePresence>

      {/* Add/Edit form modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowForm(false)}
            />
            <div className="fixed inset-0 z-50 overflow-y-auto pointer-events-none">
              <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.92, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-card border border-border rounded-radius-card w-full max-w-lg overflow-hidden pointer-events-auto"
                onClick={e => e.stopPropagation()}
              >
              <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
                <h2 className="text-base font-semibold text-text-heading">
                  {editingId ? 'Edit CRM Entry' : 'Add CRM Entry'}
                </h2>
                <button onClick={() => setShowForm(false)} className="p-2 rounded-radius-button text-text-muted hover:text-text-heading hover:bg-card-hover transition-colors cursor-pointer">
                  <X size={16} />
                </button>
              </div>

              <div className="p-4 space-y-4">
                <div>
                  <label className="text-xs font-medium text-text-muted mb-1.5 block">Customer Name</label>
                  <Input placeholder="Enter customer name" value={form.customer} onChange={e => setForm(f => ({ ...f, customer: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-muted mb-1.5 block">Phone Number</label>
                  <Input placeholder="Enter phone number" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-muted mb-1.5 block">Email</label>
                  <Input placeholder="Enter email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-muted mb-1.5 block">Address</label>
                  <textarea
                    className="w-full h-16 rounded-radius-input border border-border-light bg-card px-3 py-2 text-sm text-text-heading placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
                    placeholder="Enter address"
                    value={form.address}
                    onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-muted mb-1.5 block">Status</label>
                  <Select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as typeof statuses[number] }))} className="h-10 text-sm w-full">
                    {(editingId ? statuses : statuses.filter(s => s !== 'Dropped')).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </Select>
                </div>
                {form.status !== 'Dropped' && (
                  <div>
                    <label className="text-xs font-medium text-text-muted mb-1.5 block">Meeting Date</label>
                    <input
                      type="date"
                      className="w-full h-10 rounded-radius-input border border-border-light bg-card px-3 text-sm text-text-heading focus:outline-none focus:ring-2 focus:ring-primary/30"
                      value={form.meeting ? form.meeting.split('/').reverse().join('-') : ''}
                      onChange={e => {
                        const d = e.target.value.split('-')
                        setForm(f => ({ ...f, meeting: `${d[2]}/${d[1]}/${d[0]}` }))
                      }}
                    />
                  </div>
                )}
                <div>
                  <label className="text-xs font-medium text-text-muted mb-1.5 block">CRM Details / Requirements</label>
                  <textarea
                    className="w-full h-24 rounded-radius-input border border-border-light bg-card px-3 py-2 text-sm text-text-heading placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
                    placeholder="Enter details or requirements"
                    value={form.details}
                    onChange={e => setForm(f => ({ ...f, details: e.target.value }))}
                  />
                </div>
              </div>

              <div className="p-4 border-t border-border shrink-0 bg-card">
                <Button onClick={handleSubmit} className="w-full">
                  {editingId ? 'UPDATE' : 'SUBMIT'}
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