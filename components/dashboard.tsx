"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MonthlyExpensesChart } from "@/components/charts/monthly-expenses-chart"
import { CategoryPieChart } from "@/components/charts/category-pie-chart"
import { BudgetComparisonChart } from "@/components/charts/budget-comparison-chart"
import { RecentTransactions } from "@/components/recent-transactions"
import { TrendingDown, TrendingUp, Wallet } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface DashboardStats {
  totalBalance: number
  totalIncome: number
  totalExpenses: number
  budgetRemaining: number
  categoryBreakdown: Record<string, number>
  monthlyExpenses: Array<{ month: string; expenses: number }>
  recentTransactions: Array<any>
}

export function Dashboard() {
  const { toast } = useToast()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch("/api/dashboard/stats")
      const result = await response.json()

      if (result.success) {
        setStats(result.data)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch dashboard data",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch dashboard data",
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
      <div className="space-y-6">
        <div className="p-6 rounded-xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 dark:from-blue-500/20 dark:via-purple-500/20 dark:to-pink-500/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/50">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground">Loading your financial data...</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="relative overflow-hidden border-0 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-500/20 to-gray-500/20 animate-pulse" />
              <CardHeader className="relative">
                <div className="h-4 bg-gray-300 rounded animate-pulse" />
              </CardHeader>
              <CardContent className="relative">
                <div className="h-8 bg-gray-300 rounded animate-pulse mb-2" />
                <div className="h-3 bg-gray-300 rounded animate-pulse w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="space-y-6">
        <div className="p-6 rounded-xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 dark:from-blue-500/20 dark:via-purple-500/20 dark:to-pink-500/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/50">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground">No financial data available. Start by adding your first transaction!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 dark:from-blue-500/20 dark:via-purple-500/20 dark:to-pink-500/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/50">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-muted-foreground">Overview of your financial activity</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden border-0 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 dark:from-blue-500/30 dark:to-cyan-500/30" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <div className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
              <span className="text-lg font-bold">₹</span>
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold flex items-center gap-1">
              <span className="text-blue-600 dark:text-blue-400">₹</span>
              <span>{stats.totalBalance.toLocaleString("en-IN")}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.totalBalance >= 0 ? "+" : ""}
              {((stats.totalBalance / (stats.totalIncome || 1)) * 100).toFixed(1)}% of income
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-pink-500/20 dark:from-red-500/30 dark:to-pink-500/30" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
            <div className="p-2 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white">
              <TrendingDown className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold">{formatCurrency(stats.totalExpenses)}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalIncome > 0
                ? `${((stats.totalExpenses / stats.totalIncome) * 100).toFixed(1)}% of income`
                : "No income recorded"}
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 dark:from-green-500/30 dark:to-emerald-500/30" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
            <div className="p-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white">
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold">{formatCurrency(stats.totalIncome)}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalIncome > 0 ? "Primary income source" : "Add income transactions"}
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 dark:from-purple-500/30 dark:to-indigo-500/30" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Remaining</CardTitle>
            <div className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
              <Wallet className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold">{formatCurrency(Math.max(0, stats.budgetRemaining))}</div>
            <p className="text-xs text-muted-foreground">
              {stats.budgetRemaining > 0
                ? "Within budget"
                : stats.budgetRemaining < 0
                  ? "Over budget"
                  : "Set monthly budget"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 relative overflow-hidden border-0 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 dark:from-blue-500/10 dark:to-purple-500/10" />
          <CardHeader className="relative">
            <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Monthly Expenses
            </CardTitle>
            <CardDescription>Your spending over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent className="relative pl-2">
            <MonthlyExpensesChart data={stats.monthlyExpenses} />
          </CardContent>
        </Card>
        <Card className="col-span-3 relative overflow-hidden border-0 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5 dark:from-green-500/10 dark:to-blue-500/10" />
          <CardHeader className="relative">
            <CardTitle className="bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400 bg-clip-text text-transparent">
              Expenses by Category
            </CardTitle>
            <CardDescription>Breakdown of your current month spending</CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <CategoryPieChart data={stats.categoryBreakdown} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 relative overflow-hidden border-0 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 dark:from-purple-500/10 dark:to-pink-500/10" />
          <CardHeader className="relative">
            <CardTitle className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Budget vs Actual
            </CardTitle>
            <CardDescription>Compare your budget with actual spending by category</CardDescription>
          </CardHeader>
          <CardContent className="relative pl-2">
            <BudgetComparisonChart categoryBreakdown={stats.categoryBreakdown} />
          </CardContent>
        </Card>
        <Card className="col-span-3 relative overflow-hidden border-0 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 dark:from-orange-500/10 dark:to-red-500/10" />
          <CardHeader className="relative">
            <CardTitle className="bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400 bg-clip-text text-transparent">
              Recent Transactions
            </CardTitle>
            <CardDescription>Your latest financial activity</CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <RecentTransactions transactions={stats.recentTransactions} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
