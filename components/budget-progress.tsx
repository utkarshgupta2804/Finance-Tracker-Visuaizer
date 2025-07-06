"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

interface BudgetProgressProps {
  refreshTrigger?: number
}

export function BudgetProgress({ refreshTrigger }: BudgetProgressProps) {
  const { toast } = useToast()
  const [budgetData, setBudgetData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchBudgetProgress()
  }, [refreshTrigger])

  const fetchBudgetProgress = async () => {
    try {
      const currentMonth = new Date().toISOString().slice(0, 7)

      // Fetch budget data
      const budgetResponse = await fetch(`/api/budgets?month=${currentMonth}`)
      const budgetResult = await budgetResponse.json()

      // Fetch dashboard stats for actual spending
      const statsResponse = await fetch("/api/dashboard/stats")
      const statsResult = await statsResponse.json()

      if (budgetResult.success && budgetResult.data && statsResult.success) {
        const budgets = budgetResult.data.budgets
        const categoryBreakdown = statsResult.data.categoryBreakdown

        const progressData = Object.keys(budgets).map((category) => ({
          category,
          budget: budgets[category] || 0,
          spent: categoryBreakdown[category] || 0,
        }))

        setBudgetData(progressData)
      } else {
        setBudgetData([])
      }
    } catch (error) {
      console.error("Error fetching budget progress:", error)
      toast({
        title: "Error",
        description: "Failed to fetch budget progress",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="pt-4">
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded animate-pulse" />
                <div className="h-2 bg-gray-300 rounded animate-pulse" />
                <div className="h-3 bg-gray-300 rounded animate-pulse w-1/2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (budgetData.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No budget data available</p>
        <p className="text-sm">Set your monthly budgets to track progress</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {budgetData.map((item) => {
        const percentage = item.budget > 0 ? (item.spent / item.budget) * 100 : 0
        const isOverBudget = percentage > 100

        return (
          <Card key={item.category}>
            <CardContent className="pt-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{item.category}</span>
                  <span className="text-sm text-muted-foreground">
                    {formatCurrency(item.spent)} / {formatCurrency(item.budget)}
                  </span>
                </div>
                <Progress value={Math.min(percentage, 100)} className="h-2" />
                <div className="flex justify-between items-center">
                  <span className={`text-xs ${isOverBudget ? "text-red-600" : "text-muted-foreground"}`}>
                    {percentage.toFixed(1)}% used
                  </span>
                  {isOverBudget && (
                    <span className="text-xs text-red-600 font-medium">
                      Over by {formatCurrency(item.spent - item.budget)}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
