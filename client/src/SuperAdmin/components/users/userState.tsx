import { Users, UserCheck, UserX, } from "lucide-react"
import { Card, CardContent } from "../../../Custom/ui/card"

interface UserStatsProps {
  totalUsers: number
  activeUsers: number
  suspendedUsers: number
  pendingUsers: number
}

export const UserStats = ({ totalUsers, activeUsers, suspendedUsers }: UserStatsProps) =>{
  
  const stats = [
    {
      title: "Total Users",
      value: totalUsers.toLocaleString(),
      icon: Users,
    },
    {
      title: "Active Users",
      value: activeUsers.toLocaleString(),
      icon: UserCheck,
    },
    {
      title: "InActive Users",
      value: suspendedUsers.toLocaleString(),
      change: suspendedUsers > 0 ? `${suspendedUsers} need attention` : "All clear",
      changeType: suspendedUsers > 0 ? "negative" : "positive",
      icon: UserX,
    },
   
  ]



  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <stat.icon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
