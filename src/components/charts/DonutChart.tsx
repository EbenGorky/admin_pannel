import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { cn } from '@/lib/utils'

interface DonutData {
  name: string
  value: number
  color: string
}

interface DonutChartProps {
  data: DonutData[]
  total?: number
  size?: number
  className?: string
}

export function DonutChart({ data, total, size = 240, className }: DonutChartProps) {
  const sum = total ?? data.reduce((acc, d) => acc + d.value, 0)

  return (
    <div className={cn('relative', className)}>
      <ResponsiveContainer width={size} height={size}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={size * 0.32}
            outerRadius={size * 0.45}
            paddingAngle={3}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null
              const item = payload[0].payload as DonutData
              return (
                <div className="bg-card border border-border-light rounded-radius-card px-3 py-2 shadow-dropdown">
                  <p className="text-text-heading text-sm font-medium">{item.name}</p>
                  <p className="text-text-muted text-xs">{item.value} employees</p>
                </div>
              )
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <p className="text-2xl font-bold text-text-heading">{sum}</p>
          <p className="text-xs text-text-muted">Total</p>
        </div>
      </div>
    </div>
  )
}

export function DonutLegend({ data }: { data: DonutData[] }) {
  return (
    <div className="flex flex-wrap gap-3 mt-2">
      {data.map((item) => (
        <div key={item.name} className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: item.color }} />
          <span className="text-xs text-text-muted">{item.name}</span>
        </div>
      ))}
    </div>
  )
}
