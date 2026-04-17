import { useState } from "react"
import { Sidebar } from "../components/Sidebar"
import { Header } from "../components/Header"
import Dashboard from "../pages/SuperDashboard"
import { UsersPage } from "../pages/Users"
import { Workspaces } from "../pages/Workspace"
import { AnalyticsPage } from "../pages/Analytic"
import { SubscriptionsPage } from "../pages/Subscription"
import { TicketPage } from "../pages/Ticket.Page"
import { AbuseReportsPage } from "../pages/AbuseReport"
import { PlanManagementPage } from "../pages/PlanManagementPage"
export const Layout = () => {
  // const setpage = (page) =>{
  //   setCurrentPage(page)
  // }
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [currentPage, setCurrentPage] = useState("Dashboard");
  const [activate,setActivate]=useState("")
  const renderPage = () => {
    switch (currentPage) {
      case "Dashboard":
        return <Dashboard />;
      case "Users":
        return <UsersPage />;
      case "Workspaces":
        return <Workspaces setCurrentPage={setCurrentPage} />;
      case "Subscriptions":
        return <SubscriptionsPage />;
      case "Plan Management":
        return <PlanManagementPage />;

      case "Analytics":
        return <AnalyticsPage />;
      case "Support Tickets":
        return <TicketPage />;
      case "Abuse Reports":
        return <AbuseReportsPage />;
      default:
        return <Dashboard />;
    }
  };
  console.log(currentPage,"inLayout")
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <Header  sidebarCollapsed={sidebarCollapsed} setCurrentPage={setCurrentPage}  />
      <main>
        {renderPage()}
      </main>

    </div>
  )
}