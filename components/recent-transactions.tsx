"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Transaction {
  _id: string
  description: string
  category: string
  amount: number
  date: string
  type: "income" | "expense"
}

interface RecentTransactionsProps {
  transactions: Transaction[]
}

const categoryIcons: Record<string, string> = {
  "Food & Dining": "🍽️",
  Transportation: "🚗",
  Shopping: "🛒",
  Entertainment: "🎬",
  "Bills & Utilities": "💡",
  Healthcare: "🏥",
  Travel: "✈️",
  Education: "📚",
  Income: "💰",
  Other: "📝",
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(Math.abs(amount))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No recent transactions</p>
        <p className="text-sm">Add your first transaction to see it here</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {transactions.slice(0, 5).map((transaction) => (
        <div key={transaction._id} className="flex items-center space-x-4">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="text-sm">{categoryIcons[transaction.category] || "📝"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{transaction.description}</p>
            <p className="text-xs text-muted-foreground">
              {transaction.category} • {formatDate(transaction.date)}
            </p>
          </div>
          <div className={`text-sm font-medium ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}>
            {transaction.type === "income" ? "+" : "-"}
            {formatCurrency(transaction.amount)}
          </div>
        </div>
      ))}
    </div>
  )
}
