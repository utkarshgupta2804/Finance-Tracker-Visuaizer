import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import type { Transaction } from "@/lib/models/Transaction"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("finance_tracker")

    const currentMonth = new Date().toISOString().slice(0, 7)
    const startOfMonth = new Date(currentMonth + "-01")
    const endOfMonth = new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 0)

    // Get current month transactions
    const transactions = await db
      .collection<Transaction>("transactions")
      .find({
        date: {
          $gte: startOfMonth.toISOString().split("T")[0],
          $lte: endOfMonth.toISOString().split("T")[0],
        },
      })
      .toArray()

    // Calculate stats
    const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

    const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

    const totalBalance = totalIncome - totalExpenses

    // Get budget for current month
    const budget = await db.collection("monthly_budgets").findOne({ month: currentMonth })

    const budgetRemaining = budget ? budget.totalBudget - totalExpenses : 0

    // Category breakdown
    const categoryBreakdown = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc: Record<string, number>, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount
        return acc
      }, {})

    // Monthly expenses for chart (last 6 months)
    const monthlyExpenses = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthStr = date.toISOString().slice(0, 7)

      const monthTransactions = await db
        .collection<Transaction>("transactions")
        .find({
          type: "expense",
          date: { $regex: `^${monthStr}` },
        })
        .toArray()

      const monthTotal = monthTransactions.reduce((sum, t) => sum + t.amount, 0)

      monthlyExpenses.push({
        month: date.toLocaleDateString("en-US", { month: "short" }),
        expenses: monthTotal,
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        totalBalance,
        totalIncome,
        totalExpenses,
        budgetRemaining,
        categoryBreakdown,
        monthlyExpenses,
        recentTransactions: transactions.slice(0, 5),
      },
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch dashboard stats" }, { status: 500 })
  }
}
