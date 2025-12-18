import { useState, useEffect, Suspense, lazy } from "react";
import { SidebarProvider } from "../../Custom/ui/sidebar";
import { AppSidebar } from "../components/AppSidebar";
import { DashboardPage } from "../components/DashboardPage";
import { UsersPage } from "../components/UsersPage";
//import { ProjectsPage } from "../components/ProjectsPage";
import { TasksPage } from "../components/TasksPage";
import { TaskApproval } from "../components/TaskApproval";
import SubscriptionPage from "../Pages/SuscriptionPages";
import Tikets from "../Pages/Tikets"
import { useSelector } from "react-redux";
import { logout } from "../../Worksapce/apis/workspaceapis";
import { useUser } from "../../Worksapce/hooks/workspacehooks";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
const SettingsPage = lazy(() => import("../components/SettingsPage"));
const ProjectsPage = lazy(()=>import("../components/ProjectsPage"));
export default function AdminDashboard() {
  const navigate = useNavigate()
  const isForward = useSelector((state) => state.forward);
  console.log(isForward,"formwsdd")
  const [currentPage, setCurrentPage] = useState("dashboard");
const user=useUser()
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
      case "logout":
         logout(user?._id).then((res)=>{
          if(res==204){
            const id="logout-success"
            if(!toast.isActive(id)){
  toast.success("Logout success", { toastId: id });
            }
               
            navigate("/admin")
       
          }
         })
       break;
      case "approval":
        return <TaskApproval />;
      case "suscription":
        return <SubscriptionPage />;
        case "tikets":
          return <Tikets/>
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
