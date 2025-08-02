import { useState } from "react"
import { Building2, Users, CreditCard, MessageSquare } from "lucide-react"
import { Sidebar } from "../components/Sidebar"
import { Header } from "../components/Header"
import { MetricCard } from "../components/MetricCard"
import { RecentActivity } from "../components/RecentActivity"
import Dashboard from "../pages/SuperDashboard"
import {UsersPage} from "../pages/Users"
import {Workspaces} from "../pages/Workspace"
export const Layout = () =>{
 const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
 const [currentPage, setCurrentPage] = useState("dashboard");
 console.log(currentPage,"current page")
const renderPage = () => {
    switch (currentPage) {
      case "Dashboard":
        return <Dashboard />;
      case "Users":
        return <UsersPage />;
      case "Workspaces":
        return <Workspaces />;
      case "tasks":
       // return <TasksPage />;
      case "settings":
       // return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };
 return(
     <div className="min-h-screen bg-gray-50">
       <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
          <Header sidebarCollapsed={sidebarCollapsed} />
          <main>
{renderPage()}
          </main>
           
     </div>
 )
}