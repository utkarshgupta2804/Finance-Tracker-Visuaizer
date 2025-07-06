import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import type { Transaction } from "@/lib/models/Transaction"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { type, amount, category, description, date } = body

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ success: false, error: "Invalid transaction ID" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("finance_tracker")

    const updateData = {
      type,
      amount: Number.parseFloat(amount),
      category,
      description,
      date,
      updatedAt: new Date(),
    }

    const result = await db
      .collection<Transaction>("transactions")
      .updateOne({ _id: new ObjectId(params.id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: "Transaction not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: updateData })
  } catch (error) {
    console.error("Error updating transaction:", error)
    return NextResponse.json({ success: false, error: "Failed to update transaction" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ success: false, error: "Invalid transaction ID" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("finance_tracker")

    const result = await db.collection<Transaction>("transactions").deleteOne({ _id: new ObjectId(params.id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: "Transaction not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting transaction:", error)
    return NextResponse.json({ success: false, error: "Failed to delete transaction" }, { status: 500 })
  }
}
