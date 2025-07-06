import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// Define the MonthlyBudget interface
interface MonthlyBudget {
  _id?: ObjectId
  month: string
  budgets: Record<string, number>
  totalBudget: number
  createdAt: Date
  updatedAt: Date
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const month = searchParams.get("month") || new Date().toISOString().slice(0, 7)

    const client = await clientPromise
    const db = client.db("finance_tracker")

    // Fixed: Fetch from monthly_budgets collection instead of transactions
    const budget = await db.collection<MonthlyBudget>("monthly_budgets").findOne({ month })

    return NextResponse.json({ success: true, data: budget })
  } catch (error) {
    console.error("Error fetching budget:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch budget" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { month, budgets } = body

    if (!month || !budgets) {
      return NextResponse.json({ success: false, error: "Month and budgets are required" }, { status: 400 })
    }

    // Convert string values to numbers and calculate total
    const convertedBudgets: Record<string, number> = {}
    let totalBudget = 0

    for (const [category, amount] of Object.entries(budgets)) {
      const numAmount = Number(amount) || 0
      convertedBudgets[category] = numAmount
      totalBudget += numAmount
    }

    const client = await clientPromise
    const db = client.db("finance_tracker")

    const result = await db.collection<MonthlyBudget>("monthly_budgets").updateOne(
      { month },
      {
        $set: {
          budgets: convertedBudgets,
          totalBudget,
          updatedAt: new Date(),
        },
        $setOnInsert: { 
          month,
          createdAt: new Date() 
        },
      },
      { upsert: true }
    )

    // Fetch the updated document to return
    const updatedBudget = await db.collection<MonthlyBudget>("monthly_budgets").findOne({ month })

    return NextResponse.json({ success: true, data: updatedBudget })
  } catch (error) {
    console.error("Error saving budget:", error)
    return NextResponse.json({ success: false, error: "Failed to save budget" }, { status: 500 })
  }
}