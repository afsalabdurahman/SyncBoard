import { Card, CardContent } from "../../../Custom/ui/card"
import { Headphones, Clock, CheckCircle2, AlertTriangle } from "lucide-react"

interface TicketStatsProps {
  open: number
  pending: number
  resolvedToday: number
  avgResponseMins: number
}

export function TicketStats({ open, pending, resolvedToday, avgResponseMins }: TicketStatsProps) {
  const stats = [
    {
      title: "Open Tickets",
      value: open.toLocaleString(),
      change: "+5 today",
      icon: Headphones,
      tone: "text-gray-700",
    },
    {
      title: "Pending",
      value: pending.toLocaleString(),
      change: "Awaiting customer",
      icon: Clock,
      tone: "text-gray-700",
    },
    {
      title: "Resolved (24h)",
      value: resolvedToday.toLocaleString(),
      change: "Good pace",
      icon: CheckCircle2,
      tone: "text-green-700",
    },
    {
      title: "Avg First Response",
      value: `${avgResponseMins}m`,
      change: "SLA target: 30m",
      icon: AlertTriangle,
      tone: "text-gray-700",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((s, i) => (
        <Card key={i} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{s.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{s.value}</p>
                <p className={`text-sm mt-1 ${s.tone}`}>{s.change}</p>
              </div>
              <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <s.icon className="h-6 w-6 text-gray-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
