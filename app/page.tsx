"use client"

import { useState } from "react"
import { FinanceSidebar } from "@/components/finance-sidebar"
import { Dashboard } from "@/components/dashboard"
import { TransactionList } from "@/components/transaction-list"
import { BudgetView } from "@/components/budget-view"
import { AppHeader } from "@/components/app-header"
import { SidebarProvider, SidebarInset, useSidebar } from "@/components/ui/sidebar"

function MainContent() {
  const [activeView, setActiveView] = useState("dashboard")
  const { open, setOpen } = useSidebar()

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return <Dashboard />
      case "transactions":
        return <TransactionList />
      case "budget":
        return <BudgetView />
      default:
        return <Dashboard />
    }
  }

  const handleContentClick = () => {
    // Only close sidebar if it's open, don't open it
    if (open) {
      setOpen(false)
    }
  }

  return (
    <>
      <FinanceSidebar activeView={activeView} setActiveView={setActiveView} />
      <SidebarInset>
        <AppHeader />
        <div
          className="flex flex-1 flex-col gap-4 p-4 pt-0 min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900"
          onClick={handleContentClick}
        >
          {renderView()}
        </div>
      </SidebarInset>
    </>
  )
}

export default function FinanceApp() {
  return (
    <SidebarProvider defaultOpen={false}>
      <MainContent />
    </SidebarProvider>
  )
}
