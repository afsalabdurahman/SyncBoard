import type React from "react"
import { Card, CardContent } from "../../../Custom/ui/card"
import { CreditCard, TrendingDown, Users, Rocket } from "lucide-react"

interface Stat {
  title: string
  value: string
  change: string
  changeType: "positive" | "negative" | "neutral"
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

export function SubscriptionStats({
  mrr,
  active,
  trialing,
  churnRate,
}: {
  mrr: number
  active: number
  trialing: number
  churnRate: number
}) {
  const stats: Stat[] = [
    {
      title: "Monthly Recurring Revenue",
      value: `$${mrr.toLocaleString()}`,
      change: "+6.2% vs last month",
      changeType: "positive",
      icon: CreditCard,
    },
    {
      title: "Active Subscriptions",
      value: active.toLocaleString(),
      change: "+2.3% vs last week",
      changeType: "positive",
      icon: Users,
    },
    {
      title: "Trialing",
      value: trialing.toLocaleString(),
      change: "—",
      changeType: "neutral",
      icon: Rocket,
    },
    {
      title: "Churn Rate",
      value: `${churnRate.toFixed(2)}%`,
      change: "-0.3% vs last month",
      changeType: "positive",
      icon: TrendingDown,
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
