import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Avatar, Button, Input } from '@/components/ui'
import { generateMockEmployees } from '@/utils/mockData'
import { Search, Plus, X, Users, UserPlus, Trash2, Pencil, MapPin, Phone, Calendar, Briefcase, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Employee } from '@/types'

const allEmployees = generateMockEmployees(48)
const teamNames = ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Golf', 'Hotel', 'India', 'Juliet', 'Kilo', 'Lima', 'Mike', 'November', 'Oscar', 'Papa', 'Quebec', 'Romeo', 'Sierra', 'Tango', 'Uniform', 'Victor', 'Whiskey', 'Xray', 'Yankee']

interface Team {
  name: string
  lead: string
  members: Employee[]
}

function buildTeams(): Team[] {
  const unassigned: Employee[] = []
  const grouped: Record<string, Employee[]> = {}
  for (const t of teamNames) grouped[t] = []
  for (const emp of allEmployees) {
    if (grouped[emp.team]) grouped[emp.team].push(emp)
    else unassigned.push(emp)
  }
  const leads: Record<string, string> = {
    Alpha: 'John Smith', Bravo: 'Sarah Johnson', Charlie: 'Michael Williams',
    Delta: 'Emily Davis', Echo: 'David Brown', Foxtrot: 'Lisa Anderson',
    Golf: 'James Wilson', Hotel: 'Emma Taylor', India: 'Robert Jones',
    Juliet: 'Olivia Garcia', Kilo: 'William Miller', Lima: 'Sophia Davis',
    Mike: 'Daniel Rodriguez', November: 'Isabella Martinez', Oscar: 'Matthew Anderson',
    Papa: 'Emily Taylor', Quebec: 'David Thomas', Romeo: 'Sarah Jackson',
    Sierra: 'Michael White', Tango: 'Jessica Harris', Uniform: 'Christopher Martin',
    Victor: 'Amanda Thompson', Whiskey: 'Andrew Robinson', Xray: 'Jennifer Lewis',
    Yankee: 'Kevin Walker',
  }
  return teamNames.map(name => ({
    name,
    lead: leads[name],
    members: grouped[name],
  }))
}

export default function TeamPage() {
  const [teams, setTeams] = useState<Team[]>(buildTeams)
  const [unassigned, setUnassigned] = useState<Employee[]>(() => {
    const used = new Set(allEmployees.filter(e => teamNames.includes(e.team)).map(e => e.id))
    return allEmployees.filter(e => !used.has(e.id))
  })
  
  // Start with first 3 teams expanded by default to show how it works
  const [expandedTeams, setExpandedTeams] = useState<Set<string>>(() => {
    const initial = buildTeams().slice(0, 3).map(t => t.name)
    return new Set(initial)
  })

  const [search, setSearch] = useState('')
  const [dragEmp, setDragEmp] = useState<string | null>(null)
  const [dragSource, setDragSource] = useState<string | null>(null)
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [newTeamName, setNewTeamName] = useState('')
  const [newTeamLead, setNewTeamLead] = useState('')
  const [newTeamMembers, setNewTeamMembers] = useState<string[]>([])
  const [memberSearch, setMemberSearch] = useState('')
  const [createError, setCreateError] = useState('')
  const [editTeam, setEditTeam] = useState<Team | null>(null)
  const [editTeamName, setEditTeamName] = useState('')
  const [editTeamLead, setEditTeamLead] = useState('')

  const filteredUnassigned = useMemo(
    () => unassigned.filter(e => e.name.toLowerCase().includes(search.toLowerCase())),
    [search, unassigned]
  )

  function toggleTeam(name: string) {
    setExpandedTeams(prev => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  function handleDragStart(empId: string, source: string) {
    setDragEmp(empId)
    setDragSource(source)
  }

  function handleDrop(targetTeam: string) {
    if (!dragEmp || !dragSource) return
    const emp = dragSource === '__unassigned'
      ? unassigned.find(e => e.id === dragEmp)
      : teams.find(t => t.name === dragSource)?.members.find(e => e.id === dragEmp)
    if (!emp) { resetDrag(); return }

    if (dragSource !== '__unassigned') {
      setTeams(prev => prev.map(t =>
        t.name === dragSource ? { ...t, members: t.members.filter(e => e.id !== dragEmp) } : t
      ))
    } else {
      setUnassigned(prev => prev.filter(e => e.id !== dragEmp))
    }

    if (targetTeam === '__unassigned') {
      setUnassigned(prev => [...prev, { ...emp, team: '' }])
    } else {
      setTeams(prev => prev.map(t =>
        t.name === targetTeam ? { ...t, members: [...t.members, { ...emp, team: targetTeam }] } : t
      ))
    }
    resetDrag()
  }

  function resetDrag() {
    setDragEmp(null)
    setDragSource(null)
  }

  function handleCreateTeam() {
    if (!newTeamName.trim()) { setCreateError('Team name is required'); return }
    setCreateError('')
    const selected = unassigned.filter(e => newTeamMembers.includes(e.id)).map(e => ({ ...e, team: newTeamName.trim() }))
    const newName = newTeamName.trim()
    setTeams(prev => [{ name: newName, lead: newTeamLead.trim() || '—', members: selected }, ...prev])
    setUnassigned(prev => prev.filter(e => !newTeamMembers.includes(e.id)))
    setExpandedTeams(prev => new Set(prev).add(newName))
    setNewTeamName('')
    setNewTeamLead('')
    setNewTeamMembers([])
    setMemberSearch('')
    setCreateError('')
    setShowCreate(false)
  }

  function handleDeleteTeam(name: string) {
    const team = teams.find(t => t.name === name)
    if (!team) return
    setUnassigned(prev => [...prev, ...team.members.map(e => ({ ...e, team: '' }))])
    setTeams(prev => prev.filter(t => t.name !== name))
  }

  function handleEditTeam() {
    if (!editTeam || !editTeamName.trim()) return
    const oldName = editTeam.name
    const newName = editTeamName.trim()
    
    setTeams(prev => prev.map(t =>
      t.name === oldName
        ? { ...t, name: newName, lead: editTeamLead.trim() || t.lead, members: t.members.map(m => ({ ...m, team: newName })) }
        : t
    ))
    
    if (oldName !== newName) {
      setExpandedTeams(prev => {
        const next = new Set(prev)
        if (next.has(oldName)) {
          next.delete(oldName)
          next.add(newName)
        }
        return next
      })
    }
    
    setEditTeam(null)
    setEditTeamName('')
    setEditTeamLead('')
  }

  const allTeams = useMemo(() => teams, [teams])

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.25 }}
      className="flex flex-col h-[calc(100vh-120px)]"
    >
      <div className="shrink-0">
        <PageHeader title="Team" description="Organise and manage your workforce teams">
          <Button onClick={() => { setShowCreate(true); setCreateError('') }}><Plus size={16} /> Create Team</Button>
        </PageHeader>

        {/* Search */}
        <div className="relative max-w-xs mb-6">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <Input
            placeholder="Search team members..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8 h-9 text-sm"
          />
        </div>
      </div>

      {/* Swimlane Layout */}
      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0 pb-4">
        
        {/* Unassigned Sidebar (Left) */}
        <div 
          className={cn(
            "w-full lg:w-[320px] shrink-0 flex flex-col bg-card border border-border rounded-radius-card overflow-hidden transition-colors",
            dragEmp && dragSource !== '__unassigned' ? "border-primary ring-1 ring-primary/30" : ""
          )}
          onDragOver={e => e.preventDefault()}
          onDrop={() => handleDrop('__unassigned')}
        >
          {/* header */}
          <div className="p-4 border-b border-border bg-card-hover/30 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-text-muted">Unassigned Pool</h3>
              <span className="text-xs text-text-muted bg-card-hover px-2 py-0.5 rounded-full">{filteredUnassigned.length}</span>
            </div>
            <Users size={16} className="text-text-muted opacity-50" />
          </div>
          
          {/* scrollable area */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-card" style={{ scrollbarWidth: 'thin' }}>
            <AnimatePresence>
              {filteredUnassigned.map((emp) => (
                <motion.div
                  key={emp.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  draggable
                  onDragStart={() => handleDragStart(emp.id, '__unassigned')}
                  onClick={() => setSelectedEmp(emp)}
                  className="bg-card border border-border-light rounded-radius-card p-3 cursor-grab active:cursor-grabbing hover:border-primary/30 hover:shadow-card-hover transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <Avatar fallback={emp.name.split(' ').map(n => n[0]).join('')} size="md" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-heading truncate group-hover:text-primary transition-colors">{emp.name}</p>
                      <p className="text-xs text-text-muted truncate">{emp.designation}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {filteredUnassigned.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 text-text-muted">
                <div className="w-12 h-12 rounded-full bg-card-hover flex items-center justify-center mb-3">
                  <Users size={20} className="opacity-40" />
                </div>
                <p className="text-sm font-medium">All assigned</p>
                <p className="text-xs mt-1 opacity-70">No free employees left.</p>
              </div>
            )}
          </div>
        </div>

        {/* Teams List (Right) */}
        <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2 pb-6" style={{ scrollbarWidth: 'thin' }}>
          {allTeams.map((team) => {
            const members = team.members.filter(e => e.name.toLowerCase().includes(search.toLowerCase()))
            const isExpanded = expandedTeams.has(team.name)
            
            return (
              <div 
                key={team.name} 
                className="bg-card border border-border rounded-radius-card overflow-hidden flex flex-col shrink-0 shadow-sm"
                onDragOver={e => isExpanded && e.preventDefault()}
                onDrop={() => isExpanded && handleDrop(team.name)}
              >
                {/* Team Header - Clickable to expand */}
                <div 
                  className={cn(
                    "p-4 flex flex-col sm:flex-row sm:items-center justify-between bg-card hover:bg-card-hover/40 cursor-pointer transition-colors border-b",
                    isExpanded ? 'border-border' : 'border-transparent'
                  )}
                  onClick={() => toggleTeam(team.name)}
                >
                  <div className="flex items-center gap-4 mb-3 sm:mb-0">
                    <div className="w-1.5 h-8 rounded-full bg-primary shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-text-heading">{team.name}</h3>
                        <span className="text-xs text-text-muted bg-card-hover px-2 py-0.5 rounded-full">{team.members.length} members</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <UserPlus size={12} className="text-text-muted" />
                        <span className="text-xs text-text-muted">Lead: <span className="font-medium">{team.lead}</span></span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={(e) => { e.stopPropagation(); setEditTeam(team); setEditTeamName(team.name); setEditTeamLead(team.lead) }}
                      className="p-2 rounded text-text-muted hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteTeam(team.name) }}
                      className="p-2 rounded text-text-muted hover:text-danger hover:bg-danger/10 transition-colors cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                    <div className="w-px h-6 bg-border mx-2" />
                    <div className="p-1 text-text-muted">
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  </div>
                </div>

                {/* Collapsible Content */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-card-hover/10"
                    >
                      <div 
                        className={cn(
                          "p-4 min-h-[140px] transition-colors border-2 border-dashed m-3 rounded-radius-card",
                          dragEmp && dragSource !== team.name ? 'border-primary/40 bg-primary/5' : 'border-transparent'
                        )}
                      >
                        {members.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                            <AnimatePresence>
                              {members.map((emp) => (
                                <motion.div
                                  key={emp.id}
                                  layout
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.95 }}
                                  draggable
                                  onDragStart={() => handleDragStart(emp.id, team.name)}
                                  onClick={() => setSelectedEmp(emp)}
                                  className="bg-card border border-border-light rounded-radius-card p-3 cursor-grab active:cursor-grabbing hover:border-primary/30 hover:shadow-card-hover transition-all group shadow-sm"
                                >
                                  <div className="flex items-start gap-3">
                                    <Avatar fallback={emp.name.split(' ').map(n => n[0]).join('')} size="md" />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-text-heading truncate group-hover:text-primary transition-colors">{emp.name}</p>
                                      <p className="text-xs text-text-muted truncate">{emp.designation}</p>
                                    </div>
                                    <StatusBadge status={emp.status} />
                                  </div>
                                </motion.div>
                              ))}
                            </AnimatePresence>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-8 text-text-muted h-full">
                            <div className="w-12 h-12 rounded-full bg-card-hover flex items-center justify-center mb-3">
                              <Users size={20} className="opacity-40" />
                            </div>
                            <p className="text-sm font-medium">Empty Team</p>
                            <p className="text-xs mt-1 opacity-70">Drag and drop members here to assign them.</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>

      {/* Employee detail drawer */}
      <AnimatePresence>
        {selectedEmp && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setSelectedEmp(null)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-lg bg-card border-l border-border z-50 shadow-dropdown overflow-y-auto"
            >
              <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-card z-10">
                <div className="flex items-center gap-3">
                  <Avatar fallback={selectedEmp.name.split(' ').map(n => n[0]).join('')} size="md" />
                  <div>
                    <h2 className="text-base font-semibold text-text-heading">{selectedEmp.name}</h2>
                    <p className="text-xs text-text-muted">{selectedEmp.employeeId}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedEmp(null)} className="p-2 rounded-radius-button text-text-muted hover:text-text-heading hover:bg-card-hover transition-colors cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <div className="p-4 space-y-5">
                <div>
                  <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2.5">Details</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Designation', value: selectedEmp.designation, icon: Briefcase },
                      { label: 'Team', value: selectedEmp.team || 'Unassigned', icon: Users },
                      { label: 'Shift', value: selectedEmp.shift, icon: Calendar },
                      { label: 'Phone', value: selectedEmp.phone, icon: Phone },
                      { label: 'Status', value: selectedEmp.status, icon: Users },
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
                </div>

                {selectedEmp.location && (
                  <div className="p-3 rounded-radius-button bg-primary/5 border border-primary/10">
                    <div className="flex items-center gap-1.5 mb-1">
                      <MapPin size={12} className="text-primary" />
                      <p className="text-xs text-text-muted">Location</p>
                    </div>
                    <p className="text-sm text-text-heading">{selectedEmp.location.address}</p>
                  </div>
                )}

                <div>
                  <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2.5">Quick Actions</h3>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" className="flex-1" onClick={() => setSelectedEmp(null)}>
                      <MapPin size={14} /> View Location
                    </Button>
                    <Button variant="secondary" size="sm" className="flex-1">
                      <Calendar size={14} /> Schedule
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Create Team modal */}
      <AnimatePresence>
        {showCreate && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowCreate(false)}
            />
            <div className="fixed inset-0 z-50 overflow-y-auto pointer-events-none">
              <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.92, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-card border border-border rounded-radius-card w-full max-w-2xl overflow-hidden pointer-events-auto"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between p-4 border-b border-border shrink-0 bg-card">
                  <h2 className="text-base font-semibold text-text-heading">Create Team</h2>
                  <button onClick={() => setShowCreate(false)} className="p-2 rounded-radius-button text-text-muted hover:text-text-heading hover:bg-card-hover transition-colors cursor-pointer">
                    <X size={16} />
                  </button>
                </div>
                <div className="p-4 space-y-4 shrink-0">
                  <div>
                    <label className="text-xs font-medium text-text-muted mb-1.5 block">Team Name</label>
                    <Input placeholder="e.g. Foxtrot" value={newTeamName} onChange={e => { setNewTeamName(e.target.value); setCreateError('') }} />
                    {createError && <p className="text-xs text-danger mt-1">{createError}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-medium text-text-muted mb-1.5 block">Team Lead</label>
                    <Input placeholder="e.g. John Smith" value={newTeamLead} onChange={e => setNewTeamLead(e.target.value)} />
                  </div>
                </div>
                <div className="px-4 shrink-0">
                  <label className="text-xs font-medium text-text-muted mb-1.5 block">Add Members</label>
                  <div className="relative mb-2">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <Input
                      placeholder="Search members..."
                      value={memberSearch}
                      onChange={e => setMemberSearch(e.target.value)}
                      className="pl-8 h-9 text-sm"
                    />
                  </div>
                </div>
                <div className="px-4 pb-4">
                  <div className="border border-border-light rounded-radius-input p-2">
                    {unassigned.filter(e => e.name.toLowerCase().includes(memberSearch.toLowerCase())).length === 0 ? (
                      <p className="text-xs text-text-muted text-center py-4">No free members available</p>
                    ) : (
                      <div className="grid grid-cols-4 gap-2">
                        {unassigned.filter(e => e.name.toLowerCase().includes(memberSearch.toLowerCase())).map(emp => (
                          <button
                            key={emp.id}
                            type="button"
                            onClick={() => setNewTeamMembers(prev =>
                              prev.includes(emp.id) ? prev.filter(id => id !== emp.id) : [...prev, emp.id]
                            )}
                            className={cn(
                              'flex flex-col items-center gap-1.5 p-3 rounded-radius-button border text-center transition-all cursor-pointer min-w-0',
                              newTeamMembers.includes(emp.id)
                                ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                : 'border-border-light hover:border-primary/30 hover:bg-card-hover'
                            )}
                          >
                            <Avatar fallback={emp.name.split(' ').map(n => n[0]).join('')} size="md" />
                            <div className="min-w-0 w-full">
                              <p className="text-xs font-medium text-text-heading truncate">{emp.name}</p>
                              <p className="text-[11px] text-text-muted truncate mt-0.5">{emp.designation}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-4 border-t border-border shrink-0">
                  <Button onClick={handleCreateTeam} className="w-full" type="button">Create Team</Button>
                </div>
              </motion.div>
            </div>
          </div>
        </>
        )}
      </AnimatePresence>

      {/* Edit Team modal */}
      <AnimatePresence>
        {editTeam && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setEditTeam(null)}
            />
            <div className="fixed inset-0 z-50 overflow-y-auto pointer-events-none">
              <div className="flex min-h-full items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-card border border-border rounded-radius-card w-full max-w-md overflow-hidden pointer-events-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-border shrink-0 bg-card">
                <h2 className="text-base font-semibold text-text-heading">Edit Team</h2>
                <button onClick={() => setEditTeam(null)} className="p-2 rounded-radius-button text-text-muted hover:text-text-heading hover:bg-card-hover transition-colors cursor-pointer">
                  <X size={16} />
                </button>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="text-xs font-medium text-text-muted mb-1.5 block">Team Name</label>
                  <Input placeholder="Team name" value={editTeamName} onChange={e => setEditTeamName(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-muted mb-1.5 block">Team Lead</label>
                  <Input placeholder="Team lead" value={editTeamLead} onChange={e => setEditTeamLead(e.target.value)} />
                </div>
              </div>
              <div className="p-4 border-t border-border shrink-0 bg-card">
                <Button onClick={handleEditTeam} className="w-full" type="button">Save Changes</Button>
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
