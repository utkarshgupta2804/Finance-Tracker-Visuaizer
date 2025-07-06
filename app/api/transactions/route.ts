import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import type { Transaction } from "@/lib/models/Transaction"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("finance_tracker")
    const transactions = await db
      .collection<Transaction>("transactions")
      .find({})
      .sort({ date: -1 })
      .limit(100)
      .toArray()

    return NextResponse.json({ success: true, data: transactions })
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch transactions" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, amount, category, description, date } = body

    // Validation
    if (!type || !amount || !category || !description || !date) {
      return NextResponse.json({ success: false, error: "All fields are required" }, { status: 400 })
    }

    if (amount <= 0) {
      return NextResponse.json({ success: false, error: "Amount must be greater than 0" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("finance_tracker")

    const transaction: Transaction = {
      type,
      amount: Number.parseFloat(amount),
      category,
      description,
      date,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection<Transaction>("transactions").insertOne(transaction)

    return NextResponse.json({
      success: true,
      data: { ...transaction, _id: result.insertedId },
    })
  } catch (error) {
    console.error("Error creating transaction:", error)
    return NextResponse.json({ success: false, error: "Failed to create transaction" }, { status: 500 })
  }
}
