"use client"

import { BarChart3, CreditCard, Wallet, Home, TrendingUp } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarFooter,
} from "@/components/ui/sidebar"

interface FinanceSidebarProps {
  activeView: string
  setActiveView: (view: string) => void
}

const menuItems = [
  {
    title: "Dashboard",
    icon: BarChart3,
    id: "dashboard",
  },
  {
    title: "Transactions",
    icon: CreditCard,
    id: "transactions",
  },
  {
    title: "Budget",
    icon: Wallet,
    id: "budget",
  },
]

export function FinanceSidebar({ activeView, setActiveView }: FinanceSidebarProps) {
  return (
    <Sidebar variant="inset" className="bg-gradient-to-b from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg">
            <span className="text-sm font-bold">₹</span>
          </div>
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Finance Tracker
            </span>
            <span className="text-xs text-muted-foreground">Personal Finance</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gradient bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeView === item.id}
                    onClick={() => setActiveView(item.id)}
                    className="relative overflow-hidden hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 data-[active=true]:bg-gradient-to-r data-[active=true]:from-blue-500/20 data-[active=true]:to-purple-500/20"
                  >
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-4 py-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground p-2 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20">
            <div className="h-2 w-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 animate-pulse"></div>
            <span>All systems operational</span>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
