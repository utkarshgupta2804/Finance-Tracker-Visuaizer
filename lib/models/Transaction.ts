export interface Transaction {
  _id?: string
  type: "income" | "expense"
  amount: number
  category: string
  description: string
  date: string
  createdAt?: Date
  updatedAt?: Date
}

export interface MonthlyBudget {
  _id?: string
  month: string // Format: "2024-01"
  budgets: Record<string, number>
  totalBudget: number
  createdAt?: Date
  updatedAt?: Date
}
