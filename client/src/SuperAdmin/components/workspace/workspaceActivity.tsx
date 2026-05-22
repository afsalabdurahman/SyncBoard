import { Card, CardContent, CardHeader, CardTitle } from "../../../Custom/ui/card"
import { Calendar, UserPlus, Mail, Settings, MessageSquare, ShieldCheck, CreditCard } from "lucide-react"

export interface ActivityItem {
  id: string
  type: "member_added" | "message" | "setting_change" | "billing" | "security" | "invite"
  title: string
  description?: string
  time: string
}

const iconMap = {
  member_added: UserPlus,
  message: MessageSquare,
  setting_change: Settings,
  billing: CreditCard,
  security: ShieldCheck,
  invite: Mail,
}

export function WorkspaceActivityTimeline({ items }: { items: ActivityItem[] }) {
  const fmt = (d: string) =>
    new Date(d).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((i) => {
          const Icon = iconMap[i.type]
          return (
            <div key={i.id} className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-lg bg-gray-100 flex items-center justify-center">
                <Icon className="h-4 w-4 text-gray-700" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-900 truncate">{i.title}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{fmt(i.time)}</span>
                  </div>
                </div>
                {i.description && <p className="text-sm text-gray-600 mt-0.5">{i.description}</p>}
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
