"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

const categories = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Healthcare",
  "Travel",
  "Education",
]

interface BudgetFormProps {
  onBudgetSaved?: () => void
}

export function BudgetForm({ onBudgetSaved }: BudgetFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [budgets, setBudgets] = useState<Record<string, string>>({})
  const currentMonth = new Date().toISOString().slice(0, 7)

  useEffect(() => {
    fetchCurrentBudget()
  }, [])

  const fetchCurrentBudget = async () => {
    try {
      const response = await fetch(`/api/budgets?month=${currentMonth}`)
      const result = await response.json()

      if (result.success && result.data) {
        // Convert numbers to strings for form inputs
        const budgetStrings: Record<string, string> = {}
        Object.keys(result.data.budgets).forEach((category) => {
          budgetStrings[category] = result.data.budgets[category].toString()
        })
        setBudgets(budgetStrings)
      } else {
        // Initialize with empty values
        const initialBudgets: Record<string, string> = {}
        categories.forEach((category) => {
          initialBudgets[category] = ""
        })
        setBudgets(initialBudgets)
      }
    } catch (error) {
      console.error("Error fetching budget:", error)
      // Initialize with empty values on error
      const initialBudgets: Record<string, string> = {}
      categories.forEach((category) => {
        initialBudgets[category] = ""
      })
      setBudgets(initialBudgets)
    }
  }

  const handleBudgetChange = (category: string, value: string) => {
    setBudgets({ ...budgets, [category]: value })
  }

  const handleSave = async () => {
    setIsLoading(true)

    try {
      // Convert string values to numbers and filter out empty values
      const numericBudgets: Record<string, number> = {}
      Object.keys(budgets).forEach((category) => {
        const value = Number.parseFloat(budgets[category])
        if (!isNaN(value) && value > 0) {
          numericBudgets[category] = value
        }
      })

      if (Object.keys(numericBudgets).length === 0) {
        toast({
          title: "Error",
          description: "Please enter at least one valid budget amount",
          variant: "destructive",
        })
        return
      }

      const response = await fetch("/api/budgets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          month: currentMonth,
          budgets: numericBudgets,
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Success",
          description: "Budget saved successfully",
        })
        onBudgetSaved?.()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to save budget",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save budget",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const totalBudget = Object.values(budgets).reduce((sum, budget) => {
    const value = Number.parseFloat(budget)
    return sum + (isNaN(value) ? 0 : value)
  }, 0)

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {categories.map((category) => (
          <div key={category} className="flex items-center justify-between">
            <Label htmlFor={category} className="text-sm font-medium">
              {category}
            </Label>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">₹</span>
              <Input
                id={category}
                type="number"
                step="0.01"
                value={budgets[category] || ""}
                onChange={(e) => handleBudgetChange(category, e.target.value)}
                className="w-24 text-right"
                placeholder="0.00"
              />
            </div>
          </div>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <span className="font-medium">Total Monthly Budget:</span>
            <span className="text-lg font-bold">₹{totalBudget.toLocaleString("en-IN")}</span>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="w-full" disabled={isLoading || totalBudget === 0}>
        {isLoading ? "Saving..." : "Save Budgets"}
      </Button>
    </div>
  )
}
