import { Card, CardContent, CardHeader, CardTitle } from "../../Custom/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../../Custom/ui/avatar"
import { Badge } from "../../Custom/ui/badge"
import { DateInHours, formatDate } from "../../Utility/dateformate"

// const recentSignups = [
//   {
//     id: 1,
//     name: "John Smith",
//     email: "john@acme.com",
//     workspace: "Acme Corp",
//     plan: "Pro",
//     time: "2 minutes ago",
//   },
//   {
//     id: 2,
//     name: "Sarah Johnson",
//     email: "sarah@techstart.io",
//     workspace: "TechStart",
//     plan: "Enterprise",
//     time: "15 minutes ago",
//   },
//   {
//     id: 3,
//     name: "Mike Chen",
//     email: "mike@designco.com",
//     workspace: "DesignCo",
//     plan: "Basic",
//     time: "1 hour ago",
//   },
// ]

// const abuseAlerts = [
//   {
//     id: 1,
//     type: "Spam",
//     workspace: "BadActor Inc",
//     severity: "High",
//     time: "5 minutes ago",
//   },
//   {
//     id: 2,
//     type: "Harassment",
//     workspace: "Problem Workspace",
//     severity: "Critical",
//     time: "30 minutes ago",
//   },
// ]

// const subscriptionChanges = [
//   {
//     id: 1,
//     workspace: "Growing Startup",
//     change: "Upgraded to Enterprise",
//     amount: "+$299/mo",
//     time: "1 hour ago",
//   },
//   {
//     id: 2,
//     workspace: "Small Team",
//     change: "Downgraded to Basic",
//     amount: "-$49/mo",
//     time: "3 hours ago",
//   },
// ]
interface SubscriptionItem {
  status: string;
  workspaceName: string;
  subscriptionPlan: string;
  updated: string;
}
interface Props {
 subscription : SubscriptionItem[];
}

const plan = (key: string): string => {
  switch (key.toLowerCase()) { 
    case "free":
      return "0";
    case "basic":
      return "+$10";
    case "pro":
      return "+$20";
    case "enterprise":
      return "+$50";
    default:
      return "-0"; 
  }
};
const upgradeStatus = (plan:string) =>{
  switch (plan) {
    case "free":
      return "It is a Free Version"
    case "basic":
      return "Upgrade to Basic"
    case "pro":
      return "Upgarde to Pro"
    case "enterprise":
      return "Upgrade to Enterprise"  
    default:
      return "It is a Free Version"
      
  }
}


export function RecentActivity({subscription,abuse}:Props) {
  console.log(subscription,"propbs")
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Recent Signups */}
      {/* <Card>
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
      </Card> */}

      {/* Abuse Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Abuse Alerts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {abuse?.map((alert) => (
            <div key={alert.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">{alert.type}</p>
                {/* <p className="text-sm text-gray-600">{alert.workspace}</p> */}
              </div>
              <div className="text-right">
                <Badge variant="destructive" className="mb-1">
                  {alert.severity}
                </Badge>
                {/* <p className="text-xs text-gray-500">{alert.time}</p> */}
              </div>
            </div>
          ))??"Not available..."}
        </CardContent>
      </Card>

      {/* Subscription Changes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Subscription Changes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {subscription?subscription.map((change,index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">{change.workspaceName}</p>
                <p className="text-sm text-gray-600">{upgradeStatus(change.subscriptionPlan)}</p>
              </div>
              <div className="text-right">
                <p
                  className={`text-sm font-medium ${change.subscriptionPlan.startsWith("+") ? "text-green-600" : "text-red-600"}`}
                >
                  {plan(change.subscriptionPlan)}
                </p>
                <p className="text-xs text-gray-500">{ DateInHours( change.updated)}</p>
              </div>
            </div>
          )):"Not available..."}
        </CardContent>
      </Card>
    </div>
  )
}
