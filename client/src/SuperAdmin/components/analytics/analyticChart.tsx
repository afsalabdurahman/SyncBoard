"use client"

import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../../../components/ui/chart"

type SeriesPoint = { label: string; messages: number; dau: number }

function formatLabel(date: Date, granularity: "day" | "week" | "month") {
  const opts: Intl.DateTimeFormatOptions =
    granularity === "day"
      ? { month: "short", day: "numeric" }
      : granularity === "week"
        ? { month: "short", day: "numeric" }
        : { month: "short", year: "2-digit" }
  return date.toLocaleDateString("en-US", opts)
}

export function generateTimeSeries({
  days = 30,
  granularity = "day",
}: {
  days?: number
  granularity?: "day" | "week" | "month"
}): SeriesPoint[] {
  const now = new Date()
  const data: SeriesPoint[] = []

  const step = granularity === "day" ? 1 : granularity === "week" ? 7 : 30 // approximate months as 30 days

  for (let i = days; i >= 0; i -= step) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const messages = Math.max(20000, Math.floor(20000 + Math.sin(i / 5) * 6000 + Math.random() * 4000))
    const dau = Math.max(1500, Math.floor(1500 + Math.cos(i / 7) * 400 + Math.random() * 250))
    data.push({ label: formatLabel(d, granularity), messages, dau })
  }
  return data
}

export function AnalyticsCharts({
  range,
  granularity,
}: {
  range: "7d" | "30d" | "90d" | "365d"
  granularity: "day" | "week" | "month"
}) {
  const rangeToDays: Record<typeof range, number> = { "7d": 7, "30d": 30, "90d": 90, "365d": 365 }
  const series = generateTimeSeries({ days: rangeToDays[range], granularity })

  const planDistribution = [
    { name: "Basic", value: 42 },
    { name: "Pro", value: 38 },
    { name: "Enterprise", value: 20 },
  ]

  const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))"]

  const topWorkspaces = [
    { name: "Acme Corporation", messages: 182_340, dau: 3_210 },
    { name: "TechStart Inc", messages: 98_120, dau: 1_540 },
    { name: "Design Studio", messages: 54_870, dau: 980 },
    { name: "Marketing Agency", messages: 41_320, dau: 820 },
    { name: "Startup Hub", messages: 39_115, dau: 760 },
  ]

  return (
    <div className="grid grid-cols-1 2xl:grid-cols-3 gap-6">
      {/* Left column: time-series charts */}
      <div className="space-y-6 2xl:col-span-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Messages Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                messages: { label: "Messages", color: "hsl(var(--chart-1))" },
              }}
              className="h-[280px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={series} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="messages" stroke="var(--color-messages)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Daily Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                dau: { label: "DAU", color: "hsl(var(--chart-2))" },
              }}
              className="h-[280px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={series} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="fillDau" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-dau)" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="var(--color-dau)" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area type="monotone" dataKey="dau" stroke="var(--color-dau)" fill="url(#fillDau)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Signups by Day</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                signups: { label: "Signups", color: "hsl(var(--chart-4))" },
              }}
              className="h-[260px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={series.map((s) => ({ label: s.label, signups: Math.max(10, Math.round(s.dau / 6)) }))}
                  margin={{ top: 10, right: 20, bottom: 0, left: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="signups" fill="var(--color-signups)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Right column: distribution and leaderboard */}
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Plan Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                basic: { label: "Basic", color: "hsl(var(--chart-1))" },
                pro: { label: "Pro", color: "hsl(var(--chart-2))" },
                enterprise: { label: "Enterprise", color: "hsl(var(--chart-3))" },
              }}
              className="h-[260px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={planDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    label={(e) => `${e.name} (${e.value}%)`}
                  >
                    {planDistribution.map((entry, idx) => (
                      <Cell
                        key={`cell-${entry.name}`}
                        fill={COLORS[idx % COLORS.length]}
                        stroke="rgba(0,0,0,0.05)"
                        strokeWidth={1}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Top Workspaces</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topWorkspaces.map((w) => (
              <div
                key={w.name}
                className="flex items-center justify-between rounded-lg border bg-white p-3 hover:shadow-sm transition-shadow"
              >
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 truncate">{w.name}</p>
                  <p className="text-xs text-gray-500">DAU {w.dau.toLocaleString()}</p>
                </div>
                <div className="text-sm font-semibold text-gray-900">{w.messages.toLocaleString()} msgs</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
