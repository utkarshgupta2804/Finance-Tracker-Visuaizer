"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { TransactionForm } from "@/components/transaction-form"
import { TransactionTable } from "@/components/transaction-table"
import { Plus } from "lucide-react"

export function TransactionList() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleEdit = (transaction: any) => {
    setEditingTransaction(transaction)
    setIsDialogOpen(true)
  }

  const handleClose = () => {
    setIsDialogOpen(false)
    setEditingTransaction(null)
  }

  const handleSuccess = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">Manage your income and expenses</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingTransaction(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingTransaction ? "Edit Transaction" : "Add New Transaction"}</DialogTitle>
              <DialogDescription>
                {editingTransaction
                  ? "Update the transaction details below."
                  : "Enter the details for your new transaction."}
              </DialogDescription>
            </DialogHeader>
            <TransactionForm transaction={editingTransaction} onClose={handleClose} onSuccess={handleSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      <TransactionTable onEdit={handleEdit} refreshTrigger={refreshTrigger} />
    </div>
  )
}
