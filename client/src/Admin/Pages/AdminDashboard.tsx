import { useState, useEffect, Suspense, lazy } from "react";
import { SidebarProvider } from "../../Custom/ui/sidebar";
import { AppSidebar } from "../components/AppSidebar";
import { DashboardPage } from "../components/DashboardPage";
import { UsersPage } from "../components/UsersPage";
//import { ProjectsPage } from "../components/ProjectsPage";
import { TasksPage } from "../components/TasksPage";
import { TaskApproval } from "../components/TaskApproval";
import SubscriptionPage from "../Pages/SuscriptionPages";
import { useSelector } from "react-redux";


const SettingsPage = lazy(() => import("../components/SettingsPage"));
const ProjectsPage = lazy(()=>import("../components/ProjectsPage"));
export default function AdminDashboard() {
  const isForward = useSelector((state) => state.forward);
  const [currentPage, setCurrentPage] = useState("dashboard");

  useEffect(() => {
    if (isForward) {
      setCurrentPage("suscription");
    } else {
      setCurrentPage("dashboard");
    }
  }, [isForward]);

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardPage />;
      case "users":
        return <UsersPage />;
      case "projects":
       return (
          <Suspense fallback={<div className="p-4">Loading Settings...</div>}>
            <ProjectsPage/>
          </Suspense>
        );
      case "tasks":
        return <TasksPage />;
      case "settings":
        
        return (
          <Suspense fallback={<div className="p-4">Loading Settings...</div>}>
            <SettingsPage />
          </Suspense>
        );
      case "approval":
        return <TaskApproval />;
      case "suscription":
        return <SubscriptionPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <main className="flex-1 overflow-auto">{renderPage()}</main>
      </div>
    </SidebarProvider>
  );
}
