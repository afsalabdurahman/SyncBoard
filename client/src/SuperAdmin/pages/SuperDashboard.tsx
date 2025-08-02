"use client"

import { useState } from "react"
import { Building2, Users, CreditCard, MessageSquare } from "lucide-react"
import { Sidebar } from "../components/Sidebar"
import { Header } from "../components/Header"
import { MetricCard } from "../components/MetricCard"
import { RecentActivity } from "../components/RecentActivity"

export default function SuperDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const metrics = [
    {
      title: "Total Workspaces",
      value: "2,847",
      change: "+12% from last month",
      changeType: "positive" as const,
      icon: Building2,
    },
    {
      title: "Active Users",
      value: "45,231",
      change: "+8% from last month",
      changeType: "positive" as const,
      icon: Users,
    },
    {
      title: "Subscribed Plans",
      value: "1,923",
      change: "+15% from last month",
      changeType: "positive" as const,
      icon: CreditCard,
    },
    {
      title: "Daily Messages",
      value: "892K",
      change: "-3% from yesterday",
      changeType: "negative" as const,
      icon: MessageSquare,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      
      <main className={`transition-all duration-300 pt-16 ${sidebarCollapsed ? "ml-16" : "ml-64"}`}>
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-600 mt-1">Monitor your SaaS platform performance and user activity</p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric, index) => (
              <MetricCard key={index} {...metric} />
            ))}
          </div>

          {/* Recent Activity */}
          <RecentActivity />
        </div>
      </main>
    </div>
  )
}
