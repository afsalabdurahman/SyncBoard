import type React from "react"
import { Card, CardContent } from "../../../components/ui/card"
import { MessageSquare, Users, Activity, Clock } from "lucide-react"

type Stat = {
  title: string
  value: string
  change: string
  changeType: "positive" | "negative" | "neutral"
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

export function AnalyticsStats({
  totalMessages,
  activeWorkspaces,
  dauMau,
  avgSessionMins,
}: {
  totalMessages: number
  activeWorkspaces: number
  dauMau: string
  avgSessionMins: number
}) {
  const stats: Stat[] = [
    {
      title: "Total Messages",
      value: totalMessages.toLocaleString(),
      change: "+6.1% vs last period",
      changeType: "positive",
      icon: MessageSquare,
    },
    {
      title: "Active Workspaces",
      value: activeWorkspaces.toLocaleString(),
      change: "+2.4% vs last period",
      changeType: "positive",
      icon: Users,
    },
    {
      title: "DAU/MAU",
      value: dauMau,
      change: "—",
      changeType: "neutral",
      icon: Activity,
    },
    {
      title: "Avg Session",
      value: `${avgSessionMins}m`,
      change: "-0.8% vs last period",
      changeType: "negative",
      icon: Clock,
    },
  ]

  const changeColors = {
    positive: "text-green-600",
    negative: "text-red-600",
    neutral: "text-gray-600",
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((s, i) => (
        <Card key={i} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{s.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{s.value}</p>
                <p className={`text-sm mt-1 ${changeColors[s.changeType]}`}>{s.change}</p>
              </div>
              <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <s.icon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
