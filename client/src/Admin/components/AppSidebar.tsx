import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/store";

import {
  BarChart3,
  FolderOpen,
  Home,
  Users,
  CheckSquare,
  FileCheck,
  CreditCard,
  Gift,
  Crown,
  Building2,
  ArrowUpCircle,
  TicketCheck,
  LogOut,
  LucideIcon
} from "lucide-react";

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
} from "../../Custom/ui/sidebar";

import { fetchSubscription } from "../../Redux/feature/subscription/subscriptionTunks";
import { useEffect } from "react";
import { SwapProject } from "./SwapProject";

interface MenuItem {
  title: string;
  icon: LucideIcon;
  id: string;
}

const menuItems: MenuItem[] = [
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
  {
    title: "Task Approval",
    icon: FileCheck,
    id: "approval",
  },
  {
    title: "Suscription",
    icon: CreditCard,
    id: "suscription",
  },
  {
    title: "Tikets",
    icon: TicketCheck,
    id: "tikets",
  },
  {
    title: "Logout",
    icon: LogOut,
    id: "logout",
  },
];

interface AppSidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export function AppSidebar({ currentPage, setCurrentPage }: AppSidebarProps) {
  const projectName = useSelector((state) => state.switch.projectName);
  const dispatch = useDispatch<AppDispatch>();

  const planKey = useSelector(
    (state: RootState) => state.subscriptions.subscription.planKey ?? "free"
  );

  const suscriptionStatus = useSelector(
    (state: RootState) => state.subscriptions.subscription.status
  );

  const adminId = useSelector(
    (state: RootState) => state.user.user?._id
  );



  useEffect(() => {
    if (adminId) {
      dispatch(fetchSubscription(adminId));
    }
  
  }, [adminId,dispatch]);

  function getSubscriptionKey(planKey: string) {
    if (suscriptionStatus !== "active") {
      return (
        <div className="flex items-center gap-2">
          <Gift size={16} className="text-green-600" />
          <span>Free</span>
        </div>
      );
    }

    switch (planKey) {
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
        return (
          <div className="flex items-center gap-2">
            <Gift size={16} className="text-green-600" />
            <span>Free</span>
          </div>
        );
    }
  }
 
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <BarChart3 className="size-4" />
              </div>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  Admin Dashboard
                </span>

                <span className="truncate text-xs">
                  Management Portal
                </span>

                {getSubscriptionKey(planKey)}
              </div>

            </SidebarMenuButton>
            <div className="flex flex-1 items-center justify-end gap-3 text-sm leading-tight border-x border-gray-500 px-4 py-2">
              <p className="text-lg font-medium text-slate-700 m-0">
                {projectName}
              </p>

              <SwapProject />
            </div>

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
          <SidebarMenuItem />
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}