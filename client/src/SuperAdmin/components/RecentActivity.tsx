import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Badge } from "../../components/ui/badge"

const recentSignups = [
  {
    id: 1,
    name: "John Smith",
    email: "john@acme.com",
    workspace: "Acme Corp",
    plan: "Pro",
    time: "2 minutes ago",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah@techstart.io",
    workspace: "TechStart",
    plan: "Enterprise",
    time: "15 minutes ago",
  },
  {
    id: 3,
    name: "Mike Chen",
    email: "mike@designco.com",
    workspace: "DesignCo",
    plan: "Basic",
    time: "1 hour ago",
  },
]

const abuseAlerts = [
  {
    id: 1,
    type: "Spam",
    workspace: "BadActor Inc",
    severity: "High",
    time: "5 minutes ago",
  },
  {
    id: 2,
    type: "Harassment",
    workspace: "Problem Workspace",
    severity: "Critical",
    time: "30 minutes ago",
  },
]

const subscriptionChanges = [
  {
    id: 1,
    workspace: "Growing Startup",
    change: "Upgraded to Enterprise",
    amount: "+$299/mo",
    time: "1 hour ago",
  },
  {
    id: 2,
    workspace: "Small Team",
    change: "Downgraded to Basic",
    amount: "-$49/mo",
    time: "3 hours ago",
  },
]

export function RecentActivity() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Recent Signups */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Recent Signups</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentSignups.map((signup) => (
            <div key={signup.id} className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt={signup.name} />
                <AvatarFallback>
                  {signup.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{signup.name}</p>
                <p className="text-sm text-gray-500 truncate">{signup.workspace}</p>
              </div>
              <div className="text-right">
                <Badge variant="secondary" className="mb-1">
                  {signup.plan}
                </Badge>
                <p className="text-xs text-gray-500">{signup.time}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Abuse Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Abuse Alerts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {abuseAlerts.map((alert) => (
            <div key={alert.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">{alert.type}</p>
                <p className="text-sm text-gray-600">{alert.workspace}</p>
              </div>
              <div className="text-right">
                <Badge variant="destructive" className="mb-1">
                  {alert.severity}
                </Badge>
                <p className="text-xs text-gray-500">{alert.time}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Subscription Changes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Subscription Changes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {subscriptionChanges.map((change) => (
            <div key={change.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">{change.workspace}</p>
                <p className="text-sm text-gray-600">{change.change}</p>
              </div>
              <div className="text-right">
                <p
                  className={`text-sm font-medium ${change.amount.startsWith("+") ? "text-green-600" : "text-red-600"}`}
                >
                  {change.amount}
                </p>
                <p className="text-xs text-gray-500">{change.time}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
