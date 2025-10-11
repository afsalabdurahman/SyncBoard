import { useSelector,useDispatch } from "react-redux";
import { FetcherSubmitOptions } from "react-router";
import { AppDispatch } from "../../Redux/store";


import {
  BarChart3,
  FolderOpen,
  Home,
  Settings,
  Users,
  CheckSquare,
  Moon,
  Sun,
  FileCheck,
  Icon,
  CreditCard ,
  Gift,
  Crown,
  Building2,
  ArrowUpCircle 
  
} from "lucide-react";
//import { useTheme } from "next-themes"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "../../components/ui/sidebar";
import { Button } from "../../components/ui/button";
import { title } from "process";

import { fetchSubscription } from "../../Redux/thunks/suscriptionTunks";

const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    id: "dashboard",
  },
  {
    title: "Users",
    icon: Users,
    id: "users",
  },
  {
    title: "Projects",
    icon: FolderOpen,
    id: "projects",
  },
  {
    title: "Tasks",
    icon: CheckSquare,
    id: "tasks",
  },
  {title:"Task Approval",
    icon:FileCheck,
    id:"approval"
  },
  {
    title:"Suscription",
    icon:CreditCard,
    id:"suscription"
  },
  {
    title: "Settings",
    icon: Settings,
    id: "settings",
  },
];

interface AppSidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

import { useEffect } from "react";

export function AppSidebar({ currentPage, setCurrentPage }: AppSidebarProps) {
  const planKey=useSelector((state)=>{
console.log(state,"mystate")
   return state.suscription.subscription.planKey ?? "free"


})
  let dispacth = useDispatch<AppDispatch>();
const suscriptionStatus= useSelector((state)=>state.suscription.subscription.status)
console.log(suscriptionStatus,"status +++")
function getSubscriptionKey(planKey: string) {
  if(suscriptionStatus!=="active"){
    return ( <div className="flex items-center gap-2">
          <Gift size={16} className="text-green-600" />
          <span>Free</span>
        </div>)
  }
  switch (planKey ) {
    case "free":
      return (
        <div className="flex items-center gap-2">
          <Gift size={16} className="text-green-600" />
          <span>Free</span>
        </div>
      );
       case "basic":
      return (
        <div className="flex items-center gap-2">
          <ArrowUpCircle size={16} className="text-green-600" />
          <span>Basic</span>
        </div>
      );

    case "pro":
      return (
        <div className="flex items-center gap-2">
          <Crown size={16} className="text-yellow-600" />
          <span>Pro</span>
        </div>
      );

    case "enterprise":
      return (
        <div className="flex items-center gap-2">
          <Building2 size={16} className="text-blue-600" />
          <span>Enterprise</span>
        </div>
      );

    default:
      // fallback to Free
      return (
        <div className="flex items-center gap-2">
          <Gift size={16} className="text-green-600" />
          <span>Free</span>
        </div>
      );
    }
  }

  const adminId = useSelector((state: any) => state?.user?.user?._id);
useEffect(()=>{
  if(adminId){
dispacth(fetchSubscription(adminId))
  }

},[adminId])


  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
                <BarChart3 className='size-4' />
              </div>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold'>Admin Dashboard</span>
        
                <span className='truncate text-xs'>Management Portal</span>
            {getSubscriptionKey(planKey)}
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => setCurrentPage(item.id)}
                    isActive={currentPage === item.id}
                    tooltip={item.title}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            {/* <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-full justify-start"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span className="ml-2">Toggle Theme</span>
            </Button> */}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
