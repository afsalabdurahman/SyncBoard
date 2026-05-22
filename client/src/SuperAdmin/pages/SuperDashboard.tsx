

import { useEffect, useState } from "react"
import { Building2, Users, CreditCard } from "lucide-react"
import { MetricCard } from "../components/MetricCard"
import { RecentActivity } from "../components/RecentActivity"
import { dashBordDataApi } from "../apis/fetchApi"
import UserGrowthTrend from "./UserGrowthTrend"
export default function SuperDashboard() {
  const [sidebarCollapsed] = useState(false)
  const [data,setData] = useState()


useEffect(() => {
    const fetchDashboardData = async () => {
      
        const response = await dashBordDataApi(); // wait for the data
        setData(response); // now response contains actual data
     
    };

    fetchDashboardData();
  }, []);


  const metrics = [
    {
      title: "Total Workspaces",
      value: data?.workspaceCount??"0",
  
     
      icon: Building2,
    },
    {
      title: "Active Users",
      value: data?.userCount ?? "0",
     
      icon: Users,
    },
    {
      title: "Subscribed Plans",
      value: data?.subscriptionCount ??"0",
      icon: CreditCard,
    },
   
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      
      <main className={`transition-all duration-300 pt-16 ${sidebarCollapsed ? "ml-16" : "ml-64"}`}>
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-600 mt-1">Monitor your SaaS platform performance and user activity</p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {metrics.map((metric, index) => (
              <MetricCard key={index} {...metric} />
            ))}
           
          </div>
 

          {/* Recent Activity */}
          <RecentActivity subscription={data?.subscriptionChanges} abuse={data?.Abuse} />
        <UserGrowthTrend/>
        </div>
      </main>
    </div>
  )
}
