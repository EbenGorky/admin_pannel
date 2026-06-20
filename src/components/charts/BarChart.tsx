import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { cn } from '@/lib/utils'

interface BarChartData {
  label: string
  value: number
  fill?: string
}

interface BarChartProps {
  data: BarChartData[]
  height?: number
  className?: string
  barSize?: number
  color?: string
}

export function BarChart({ data, height = 200, className, barSize = 24, color = '#00C896' }: BarChartProps) {
  return (
    <div className={cn('', className)}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart data={data} barSize={barSize}>
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6E7681', fontSize: 11 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6E7681', fontSize: 11 }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null
              return (
                <div className="bg-card border border-border-light rounded-radius-card px-3 py-2 shadow-dropdown">
                  <p className="text-text-heading text-sm">{payload[0].payload.label}</p>
                  <p className="text-primary text-sm font-medium">{payload[0].value} hrs</p>
                </div>
              )
            }}
          />
          <Bar
            dataKey="value"
            fill={color}
            radius={[4, 4, 0, 0]}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}
