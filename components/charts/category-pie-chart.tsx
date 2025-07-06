"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface CategoryPieChartProps {
  data: Record<string, number>
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
]

export function CategoryPieChart({ data }: CategoryPieChartProps) {
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        No category data available for the chart
      </div>
    )
  }

  const chartData = Object.entries(data).map(([name, value], index) => ({
    name,
    value,
    fill: COLORS[index % COLORS.length],
  }))

  return (
    <ChartContainer
      config={{
        value: {
          label: "Amount",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
