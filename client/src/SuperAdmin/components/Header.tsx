
import { Search, Bell, ChevronDown,LogOut } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../../Custom/ui/avatar"
import { Button } from "../../Custom/ui/button"
import { Input } from "../../Custom/ui/input"

import { useUser } from "../../Worksapce/hooks/workspacehooks"
import { logout } from "../../Worksapce/apis/workspaceapis"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
interface HeaderProps {
  sidebarCollapsed: boolean
}



export function Header({ sidebarCollapsed }: HeaderProps) {
const user = useUser()
const navigate = useNavigate()

const handleLogout = () =>{
  logout(user?._id).then((res)=>{
    if(res==204){
     toast.success("Logout success")
     navigate("/platform/login")
    }
  })
}

  return (
    <header
      className={cn(
        "fixed top-0 z-30 h-16 bg-white border-b border-gray-200 transition-all duration-300",
        sidebarCollapsed ? "left-16 right-0" : "left-64 right-0",
      )}
    >
      <div className="flex h-full items-center justify-between px-6">
        {/* Search */}
        <div className="flex items-center flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search workspaces, users, or tickets..."
              className="pl-10 bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          {/* <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              3
            </span>
          </Button> */}

          {/* Profile Dropdown */}
       <div className="flex items-center gap-4">
  <div className="flex items-center gap-3">
    <Avatar className="h-8 w-8">
      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Admin" />
      <AvatarFallback>SA</AvatarFallback>
    </Avatar>

    <div className="hidden md:block text-left">
      <p className="text-sm font-medium">Super Admin</p>
      <p className="text-xs text-muted-foreground">gridesync@company.com</p>
    </div>
  </div>

  <button
    onClick={handleLogout}
    className="text-sm text-red-600 hover:text-red-700 
               px-3 py-1.5 rounded-md hover:bg-red-50/70 
               transition-colors flex items-center gap-1.5"
  >
    <LogOut className="h-3.5 w-3.5" />
    Sign Out
  </button>
</div>
        </div>
      </div>
    </header>
  )
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}
