"use client"

import { useState, useEffect } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface BudgetComparisonChartProps {
  categoryBreakdown: Record<string, number>
}

export function BudgetComparisonChart({ categoryBreakdown }: BudgetComparisonChartProps) {
  const [budgetData, setBudgetData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchBudgetData()
  }, [categoryBreakdown])

  const fetchBudgetData = async () => {
    try {
      const currentMonth = new Date().toISOString().slice(0, 7)
      const response = await fetch(`/api/budgets?month=${currentMonth}`)
      const result = await response.json()

      if (result.success && result.data) {
        const budgets = result.data.budgets
        const chartData = Object.keys(budgets).map((category) => ({
          category: category.length > 10 ? category.substring(0, 10) + "..." : category,
          budget: budgets[category] || 0,
          actual: categoryBreakdown[category] || 0,
        }))
        setBudgetData(chartData)
      } else {
        // No budget data available
        setBudgetData([])
      }
    } catch (error) {
      console.error("Error fetching budget data:", error)
      setBudgetData([])
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        Loading budget comparison...
      </div>
    )
  }

  if (budgetData.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        No budget data available. Set your monthly budgets to see the comparison.
      </div>
    )
  }

  return (
    <ChartContainer
      config={{
        budget: {
          label: "Budget",
          color: "hsl(var(--chart-1))",
        },
        actual: {
          label: "Actual",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={budgetData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          <Bar dataKey="budget" fill="var(--color-budget)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="actual" fill="var(--color-actual)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
