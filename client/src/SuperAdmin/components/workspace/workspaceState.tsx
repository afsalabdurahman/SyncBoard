import { Building2, Users, DollarSign, TrendingUp } from "lucide-react"
import { Card, CardContent } from "../../../Custom/ui/card"

interface WorkspaceStatsProps {
  totalWorkspaces: number
  activeWorkspaces: number
  totalUsers: number
  monthlyRevenue: number
}

export let WorkspaceStats = ({ totalWorkspaces, activeWorkspaces, totalUsers, monthlyRevenue }: WorkspaceStatsProps) => {
  const stats = [
    {
      title: "Total Workspaces",
      value: totalWorkspaces.toLocaleString(),
      icon: Building2,
    },
    {
      title: "Active Workspaces",
      value: activeWorkspaces.toLocaleString(),
      icon: TrendingUp,
    },
    {
      title: "Total Users",
      value: totalUsers.toLocaleString(),
      icon: Users,
    },
    {
      title: "Monthly Revenue",
      value: `$${monthlyRevenue.toLocaleString()}`,
      icon: DollarSign,
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
