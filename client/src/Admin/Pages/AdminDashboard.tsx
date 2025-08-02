import { useState,useEffect } from "react";
import { SidebarProvider } from "../../components/ui/sidebar";
import { AppSidebar } from "../components/AppSidebar";
import { DashboardPage } from "../components/DashboardPage";
import { UsersPage } from "../components/UsersPage";
import { ProjectsPage } from "../components/ProjectsPage";
import { TasksPage } from "../components/TasksPage";
import { SettingsPage } from "../components/SettingsPage";

//import { ThemeProvider } from ""

export default function AdminDashboard() {
 
   
  

  const [currentPage, setCurrentPage] = useState("dashboard");

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardPage />;
      case "users":
        return <UsersPage />;
      case "projects":
        return <ProjectsPage />;
      case "tasks":
        return <TasksPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    // <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
    <SidebarProvider>
      <div className='flex min-h-screen w-full'>
        <AppSidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <main className='flex-1 overflow-auto'>{renderPage()}</main>
      </div>
    </SidebarProvider>
    // </ThemeProvider>
  );
}
