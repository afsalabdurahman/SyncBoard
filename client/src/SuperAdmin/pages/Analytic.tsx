
import { useMemo, useState } from "react"

import { AnalyticsStats } from "../components/analytics/analyticState"
import { AnalyticsFilters } from "../components/analytics/analyticFilter"
import { AnalyticsCharts, generateTimeSeries } from "../components/analytics/analyticChart"

export const  AnalyticsPage =()=> {
  const [sidebarCollapsed] = useState(false)

  // Filters
  const [search, setSearch] = useState("")
  const [range, setRange] = useState<"7d" | "30d" | "90d" | "365d">("30d")
  const [granularity, setGranularity] = useState<"day" | "week" | "month">("day")
  const [workspace, setWorkspace] = useState("all")

  // Derived KPIs from generated (mock) series
  const kpis = useMemo(() => {
    const daysMap = { "7d": 7, "30d": 30, "90d": 90, "365d": 365 } as const
    const series = generateTimeSeries({ days: daysMap[range], granularity })
    const totalMessages = series.reduce((sum, p) => sum + p.messages, 0)
    const avgDau = Math.round(series.reduce((sum, p) => sum + p.dau, 0) / Math.max(1, series.length))
    const mau = Math.round(avgDau * 22) // crude factor for illustration
    const dauMau = `${Math.min(100, Math.round((avgDau / Math.max(1, mau)) * 100))}%`
    const activeWorkspaces = 128 + (range === "365d" ? 45 : range === "90d" ? 22 : range === "30d" ? 12 : 6)
    const avgSessionMins = 18 + (granularity === "day" ? 0 : granularity === "week" ? 2 : 3)

    return {
      totalMessages,
      activeWorkspaces,
      dauMau,
      avgSessionMins,
    }
  }, [range, granularity])

  // In a real app you'd filter by search and workspace before computing charts

  return (
    <div className="min-h-screen bg-gray-50">
      

      <main className={`transition-all duration-300 pt-16 ${sidebarCollapsed ? "ml-16" : "ml-64"}`}>
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600 mt-1">Track usage, growth, and product health across your platform</p>
          </div>

          {/* Filters */}
          <AnalyticsFilters
            search={search}
            onSearch={setSearch}
            range={range}
            onRange={(v) => setRange(v as typeof range)}
            granularity={granularity}
            onGranularity={(v) => setGranularity(v as typeof granularity)}
            workspace={workspace}
            onWorkspace={setWorkspace}
          />

          {/* KPI Cards */}
          <AnalyticsStats
            totalMessages={kpis.totalMessages}
            activeWorkspaces={kpis.activeWorkspaces}
            dauMau={kpis.dauMau}
            avgSessionMins={kpis.avgSessionMins}
          />

          {/* Charts */}
          <AnalyticsCharts range={range} granularity={granularity} />
        </div>
      </main>
    </div>
  )
}
