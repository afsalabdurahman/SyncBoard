"use client"

import { useEffect, useMemo, useState } from "react"
// import { Sidebar } from "./components/sidebar"
// import { Header } from "./components/header"
import { SubscriptionStats } from "../components/subscription/suscriptionStatus"
import { SubscriptionFilters } from "../components/subscription/subscriptionFilter"
import { SubscriptionTable, type Subscription } from "../components/subscription/subscriptionTable"
import { SubscriptionDetails } from "../components/subscription/subscriptionDetails"
import { useFetchSubscriptionPageQuery } from "../apis/fetchApi"
// Mock subscription dataset
const mockSubs: Subscription[] = [
  {
    id: "sub_01HTD3M9K7",
    workspace: {
      name: "Acme Corporation",
      ownerName: "John Smith",
      ownerEmail: "john@acme.com",
      avatar: "/acme-logo.jpg",
    },
    plan: "enterprise",
    status: "active",
    amount: 2499,
    currency: "USD",
    interval: "month",
    startedAt: "2023-01-15",
    currentPeriodEnd: "2025-11-10",
    cancelAtPeriodEnd: false,
     paymentMethod: { brand: "visa", last4: "4242", expMonth: 4, expYear: 2027 },
    lastInvoiceStatus: "paid",
  },
  {
    id: "sub_01HTD4PZQF",
    workspace: {
      name: "TechStart Inc",
      ownerName: "Sarah Johnson",
      ownerEmail: "sarah@techstart.io",
      avatar: "/techstart-logo.jpg",
    },
    plan: "pro",
    status: "trialing",
    amount: 299,
    currency: "USD",
    interval: "month",
    startedAt: "2025-10-01",
    currentPeriodEnd: "2025-10-31",
    cancelAtPeriodEnd: false,
    paymentMethod: { brand: "mastercard", last4: "4444", expMonth: 8, expYear: 2026 },
    lastInvoiceStatus: "paid",
  },
  {
    id: "sub_01HTD5W2TR",
    workspace: {
      name: "Design Studio",
      ownerName: "Mike Chen",
      ownerEmail: "mike@designstudio.com",
      avatar: "/designstudio-logo.jpg",
    },
    plan: "basic",
    status: "past_due",
    amount: 49,
    currency: "USD",
    interval: "month",
    startedAt: "2024-02-12",
    currentPeriodEnd: "2025-10-08",
    cancelAtPeriodEnd: false,
    paymentMethod: { brand: "visa", last4: "1881", expMonth: 11, expYear: 2025 },
    lastInvoiceStatus: "past_due",
  },
  {
    id: "sub_01HTD6YQPC",
    workspace: {
      name: "Marketing Agency",
      ownerName: "Emily Davis",
      ownerEmail: "emily@marketing.co",
      avatar: "/marketing-logo.jpg",
    },
    plan: "pro",
    status: "canceled",
    amount: 299,
    currency: "USD",
    interval: "month",
    startedAt: "2023-06-10",
    currentPeriodEnd: "2024-04-10",
    cancelAtPeriodEnd: true,
    paymentMethod: { brand: "amex", last4: "0005", expMonth: 1, expYear: 2028 },
    lastInvoiceStatus: "void",
  },
  {
    id: "sub_01HTD7V2LM",
    workspace: {
      name: "Startup Hub",
      ownerName: "David Wilson",
      ownerEmail: "david@startuphub.com",
      avatar: "/startuphub-logo.jpg",
    },
    plan: "enterprise",
    status: "active",
    amount: 2499,
    currency: "USD",
    interval: "year",
    startedAt: "2023-02-28",
    currentPeriodEnd: "2026-02-28",
    cancelAtPeriodEnd: false,
    paymentMethod: { brand: "discover", last4: "6011", expMonth: 3, expYear: 2029 },
    lastInvoiceStatus: "paid",
  },
]

export const SubscriptionsPage = () =>{
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
const{data,isLoading}=useFetchSubscriptionPageQuery()
console.log(data,"$$$$$$ss$$")
  // Filters state
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("all")
  const [plan, setPlan] = useState("all")
  const [period, setPeriod] = useState("all")

  // Details modal
  const [selected, setSelected] = useState<Subscription | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
const [mockSubs,setMock]=useState([])
useEffect(()=>{
  if(data){
setMock(data.data)
  }
},[])


const filtered = useMemo(() => {
  return mockSubs.filter((s) => {
    console.log(s,"sssss")
    const matchesSearch =
      s.workspace?.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.workspace?.ownerEmail?.toLowerCase().includes(search.toLowerCase()) ||
      s.id?.toLowerCase().includes(search.toLowerCase())

    const matchesStatus = status === "all" || s.status === status
    const matchesPlan = plan === "all" || s.plan === plan
    const matchesPeriod = period === "all" || s.interval === period

    return matchesSearch && matchesStatus && matchesPlan && matchesPeriod
  })
}, [mockSubs, search, status, plan, period])
if(isLoading){
  return(
    <>loading.....</>
  )
}
  // Stats derived from dataset
  const stats = {
    mrr: mockSubs
      .filter((s) => s.status === "active")
      .reduce((sum, s) => sum + (s.interval === "year" ? s.amount / 12 : s.amount), 0),
    active: mockSubs.filter((s) => s.status === "active").length,
    trialing: mockSubs.filter((s) => s.status === "trialing").length,
    churnRate: 2.14, // mock
  }

  const onView = (sub: Subscription) => {
    setSelected(sub)
    setDetailsOpen(true)
  }
  const onChangePlan = (sub: Subscription) => {
    console.log("Change plan:", sub.id)
  }
  const onCancel = (sub: Subscription) => {
    console.log("Cancel subscription:", sub.id)
  }
  const onRefund = (sub: Subscription) => {
    console.log("Refund last payment for:", sub.id)
  }

  const onExport = () => {
    console.log("Export subscriptions")
  }
  const onCreate = () => {
    console.log("Create new subscription")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <Header sidebarCollapsed={sidebarCollapsed} /> */}

      <main className={`transition-all duration-300 pt-16 ${sidebarCollapsed ? "ml-16" : "ml-64"}`}>
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Subscriptions</h1>
            <p className="text-gray-600 mt-1">Monitor plans, billing health, and revenue</p>
          </div>

          {/* Stats */}
          <SubscriptionStats {...stats} />

          {/* Filters */}
          <SubscriptionFilters
            search={search}
            onSearch={setSearch}
            status={status}
            onStatus={setStatus}
            plan={plan}
            onPlan={setPlan}
            period={period}
            onPeriod={setPeriod}
            onExport={onExport}
            onCreate={onCreate}
          />

          {/* Results count */}
          <div className="mb-4 text-sm text-gray-600">
            Showing {filtered.length} of {mockSubs.length} subscriptions
          </div>

          {/* Table */}
          <SubscriptionTable
            data={filtered}
            onView={onView}
            onChangePlan={onChangePlan}
            onCancel={onCancel}
            onRefund={onRefund}
          />
        </div>
      </main>

      <SubscriptionDetails open={detailsOpen} onOpenChange={setDetailsOpen} sub={selected} />
    </div>
  )
}
