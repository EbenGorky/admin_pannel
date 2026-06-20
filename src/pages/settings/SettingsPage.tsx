import { useState } from 'react'
import { motion } from 'framer-motion'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardHeader, CardTitle, CardContent, Button, Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui'
import { Building2, Bell, Plus, Pencil, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const departments = ['My Team', 'General']

const defaultNotifications = [
  { label: 'Employee Check In/Out', desc: 'Notify when employees check in or out' },
  { label: 'Late Arrivals', desc: 'Alert when employees arrive late' },
  { label: 'Leave Requests', desc: 'Notify when new leave requests are submitted' },
  { label: 'Task Updates', desc: 'Updates on task status changes' },
  { label: 'CRM Updates', desc: 'Changes to customer records' },
  { label: 'Permission Requests', desc: 'When employees request permissions' },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('departments')
  const [notifications, setNotifications] = useState(defaultNotifications.map(() => true))

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
      <PageHeader title="Settings" description="Manage company configuration and policies" />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 flex-wrap">
          {[
            { value: 'departments', label: 'Departments', icon: Building2 },
            { value: 'notifications', label: 'Notifications', icon: Bell },
          ].map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} data-active={activeTab === tab.value}>
              <tab.icon size={14} />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="departments">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Departments</CardTitle>
                <Button size="sm"><Plus size={14} /> Add</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {departments.map((dept, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-radius-button bg-card-hover hover:bg-card-hover/70 transition-colors">
                    <div className="flex items-center gap-3">
                      <Building2 size={16} className="text-primary" />
                      <span className="text-sm text-text-heading">{dept}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-radius-button text-text-muted hover:text-primary transition-colors cursor-pointer"><Pencil size={14} /></button>
                      <button className="p-1.5 rounded-radius-button text-text-muted hover:text-danger transition-colors cursor-pointer"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader><CardTitle>Notification Preferences</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notifications.map((enabled, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-radius-button bg-card-hover">
                    <div>
                      <p className="text-sm text-text-heading">{defaultNotifications[i].label}</p>
                      <p className="text-xs text-text-muted">{defaultNotifications[i].desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifications(prev => prev.map((v, j) => j === i ? !v : v))}
                      className={cn(
                        'w-10 h-5 rounded-full relative cursor-pointer transition-colors shrink-0',
                        enabled ? 'bg-primary' : 'bg-border-light'
                      )}
                    >
                      <div className={cn(
                        'absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform',
                        enabled ? 'translate-x-5' : 'translate-x-0.5'
                      )} />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>


      </Tabs>
    </motion.div>
  )
}
