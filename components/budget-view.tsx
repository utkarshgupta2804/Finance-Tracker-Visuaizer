"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BudgetForm } from "@/components/budget-form"
import { BudgetProgress } from "@/components/budget-progress"
import { SpendingInsights } from "@/components/spending-insights"
import { BudgetComparisonChart } from "@/components/charts/budget-comparison-chart"

export function BudgetView() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleBudgetSaved = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Budget Management</h1>
        <p className="text-muted-foreground">Set and track your monthly spending limits</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Set Monthly Budgets</CardTitle>
            <CardDescription>Define spending limits for each category</CardDescription>
          </CardHeader>
          <CardContent>
            <BudgetForm onBudgetSaved={handleBudgetSaved} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Budget Progress</CardTitle>
            <CardDescription>Track your spending against set budgets</CardDescription>
          </CardHeader>
          <CardContent>
            <BudgetProgress refreshTrigger={refreshTrigger} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Budget vs Actual Spending</CardTitle>
          <CardDescription>Visual comparison of your budgets and actual expenses</CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <BudgetComparisonChart categoryBreakdown={{}} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Spending Insights</CardTitle>
          <CardDescription>AI-powered insights about your spending patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <SpendingInsights refreshTrigger={refreshTrigger} />
        </CardContent>
      </Card>
    </div>
  )
}
