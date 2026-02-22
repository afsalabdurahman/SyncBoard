
import { useEffect, useMemo, useState } from "react"

import { SubscriptionStats } from "../components/subscription/suscriptionStatus"
import { SubscriptionFilters } from "../components/subscription/subscriptionFilter"
import { SubscriptionTable, type Subscription } from "../components/subscription/subscriptionTable"
import { SubscriptionDetails } from "../components/subscription/subscriptionDetails"
import { useFetchSubscriptionPageQuery } from "../apis/fetchApi"
import { Pagination } from "@mui/material"
export const SubscriptionsPage = () =>{
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
      const [changePage,setChangePage]=useState(1)
const{data,isLoading,refetch}=useFetchSubscriptionPageQuery(changePage)

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
},[data])

const handleChangePage = (page) => {
  setChangePage(page);
  refetch()
  };
const filtered = useMemo(() => {
  return mockSubs.filter((s) => {
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
 return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg font-medium">Loading workspaces...</p>
      </div>
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
  }
  const onCancel = (sub: Subscription) => {
  }
  const onRefund = (sub: Subscription) => {
  }

  const onExport = () => {
  }
  const onCreate = () => {
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
         <Pagination
                             component="div"
                      count={Math.max(1, Math.ceil((data?.totalCount || 0) / 5))}
                         page={data.currentPage}
                               onChange={(_, page) => handleChangePage(page)}
                         
                          />
      </main>

      <SubscriptionDetails open={detailsOpen} onOpenChange={setDetailsOpen} sub={selected} />
    </div>
  )
}
