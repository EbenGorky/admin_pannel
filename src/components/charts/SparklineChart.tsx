import { LineChart, Line, ResponsiveContainer } from 'recharts'

interface SparklineChartProps {
  data: { value: number }[]
  color?: string
  width?: number
  height?: number
}

export function SparklineChart({ data, color = '#00C896', width = 100, height = 32 }: SparklineChartProps) {
  return (
    <ResponsiveContainer width={width} height={height}>
      <LineChart data={data}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={false}
          activeDot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
