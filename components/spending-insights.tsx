"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react"

interface SpendingInsightsProps {
  refreshTrigger?: number
}

export function SpendingInsights({ refreshTrigger }: SpendingInsightsProps) {
  const [insights, setInsights] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    generateInsights()
  }, [refreshTrigger])

  const generateInsights = async () => {
    try {
      const currentMonth = new Date().toISOString().slice(0, 7)

      // Fetch budget and spending data
      const [budgetResponse, statsResponse] = await Promise.all([
        fetch(`/api/budgets?month=${currentMonth}`),
        fetch("/api/dashboard/stats"),
      ])

      const budgetResult = await budgetResponse.json()
      const statsResult = await statsResponse.json()

      const generatedInsights = []

      if (budgetResult.success && budgetResult.data && statsResult.success) {
        const budgets = budgetResult.data.budgets
        const categoryBreakdown = statsResult.data.categoryBreakdown
        const totalBudget = budgetResult.data.totalBudget
        const totalExpenses = statsResult.data.totalExpenses

        // Check for over-budget categories
        Object.keys(budgets).forEach((category) => {
          const budget = budgets[category]
          const spent = categoryBreakdown[category] || 0
          const percentage = budget > 0 ? (spent / budget) * 100 : 0

          if (percentage > 100) {
            generatedInsights.push({
              type: "warning",
              icon: AlertTriangle,
              title: `${category} Budget Exceeded`,
              description: `You've spent ₹${spent.toLocaleString("en-IN")} out of your ₹${budget.toLocaleString("en-IN")} ${category.toLowerCase()} budget this month.`,
              color: "text-orange-600 dark:text-orange-400",
              bgColor: "bg-orange-50 dark:bg-orange-900/30",
              borderColor: "border-orange-200 dark:border-orange-800",
            })
          } else if (percentage < 50) {
            generatedInsights.push({
              type: "positive",
              icon: CheckCircle,
              title: `Great ${category} Savings`,
              description: `You're ${(100 - percentage).toFixed(0)}% under your ${category.toLowerCase()} budget. You've saved ₹${(budget - spent).toLocaleString("en-IN")} this month!`,
              color: "text-green-600 dark:text-green-400",
              bgColor: "bg-green-50 dark:bg-green-900/30",
              borderColor: "border-green-200 dark:border-green-800",
            })
          } else if (percentage > 80) {
            generatedInsights.push({
              type: "alert",
              icon: TrendingUp,
              title: `${category} Costs Rising`,
              description: `${category} expenses are ${percentage.toFixed(0)}% of your budget. Consider monitoring this category closely.`,
              color: "text-red-600 dark:text-red-400",
              bgColor: "bg-red-50 dark:bg-red-900/30",
              borderColor: "border-red-200 dark:border-red-800",
            })
          }
        })

        // Overall budget insight
        if (totalBudget > 0) {
          const overallPercentage = (totalExpenses / totalBudget) * 100
          if (overallPercentage < 80) {
            generatedInsights.push({
              type: "trend",
              icon: TrendingDown,
              title: "Overall Spending Under Control",
              description: `You've used ${overallPercentage.toFixed(1)}% of your total monthly budget. Great financial discipline!`,
              color: "text-blue-600 dark:text-blue-400",
              bgColor: "bg-blue-50 dark:bg-blue-900/30",
              borderColor: "border-blue-200 dark:border-blue-800",
            })
          }
        }
      }

      // If no insights generated, add a default one
      if (generatedInsights.length === 0) {
        generatedInsights.push({
          type: "trend",
          icon: CheckCircle,
          title: "Start Your Financial Journey",
          description:
            "Add more transactions and set budgets to get personalized insights about your spending patterns.",
          color: "text-blue-600 dark:text-blue-400",
          bgColor: "bg-blue-50 dark:bg-blue-900/30",
          borderColor: "border-blue-200 dark:border-blue-800",
        })
      }

      setInsights(generatedInsights.slice(0, 4)) // Limit to 4 insights
    } catch (error) {
      console.error("Error generating insights:", error)
      setInsights([])
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-gray-50 dark:bg-gray-900/30">
            <CardContent className="pt-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded animate-pulse" />
                  <div className="h-3 bg-gray-300 rounded animate-pulse w-3/4" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {insights.map((insight, index) => {
        const Icon = insight.icon
        return (
          <Card key={index} className={`${insight.bgColor} border ${insight.borderColor} relative overflow-hidden`}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent dark:via-white/5" />
            <CardContent className="pt-4 relative">
              <div className="flex items-start space-x-3">
                <div
                  className={`p-2 rounded-full bg-gradient-to-r ${insight.color.includes("orange") ? "from-orange-500 to-yellow-500" : insight.color.includes("green") ? "from-green-500 to-emerald-500" : insight.color.includes("blue") ? "from-blue-500 to-cyan-500" : "from-red-500 to-pink-500"} text-white shadow-lg`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">{insight.title}</h4>
                    <Badge
                      variant="outline"
                      className={`${insight.color} border-current bg-white/50 dark:bg-gray-800/50`}
                    >
                      {insight.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
