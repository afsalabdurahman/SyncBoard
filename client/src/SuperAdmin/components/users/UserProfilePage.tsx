
import {  useEffect, useState } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "../../../Custom/ui/card"
import { Badge } from "../../../Custom/ui/badge"
import { Button } from "../../../Custom/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../../../Custom/ui/avatar"
import { Separator } from "../../../Custom/ui/separator"
import { useDispatch } from "react-redux"
import { removeUser } from "../../../Redux/feature/users/AlluserThunks"
// import { useToast } from ""
import {toast} from "react-toastify"
import { cn } from "../../../Utility/utils"
import {
  UserIcon,
  Mail,
  
  CheckCircle2,
  XCircle,
  Clock,
  PauseCircle,
  PlayCircle,
  RefreshCw,
  MapPin,
  Calendar,
  Users,
  Space,
} from "lucide-react"
import type { User } from "./userTable"
import { CloseIcon } from "../../../Custom/reusecomponents/CloseIcon"
import apiService from "../../../Services/apiServices/apiService"
import { fetchAUserDetails } from "../../apis/fetchApi"
import { UserDetailsResponseDto } from "../../types/mapData"
import { formatTimestamp } from "../../../Utility/dateConverter"
type MemberRole = "owner" | "admin" | "member" | "guest"
type Plan = "basic" | "pro" | "enterprise"|"free"

const roleColors: Record<MemberRole, string> = {
  owner: "bg-purple-100 text-purple-800",
  admin: "bg-blue-100 text-blue-800",
  member: "bg-green-100 text-green-800",
  guest: "bg-gray-100 text-gray-800",
}

const statusColors: Record<User["status"], string> = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
  suspended: "bg-red-100 text-red-800",
  pending: "bg-yellow-100 text-yellow-800",
}

const planColors: Record<Plan, string> = {
  free: "bg-gray-100 text-gray-800",
  basic: "bg-gray-100 text-gray-800",
  pro: "bg-purple-100 text-purple-800",
  enterprise: "bg-orange-100 text-orange-800",
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

function fmtDateTime(d: string) {
  return new Date(d).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function UserProfilePage({setPage,user}) {
  const [userData,setUser]=useState<UserDetailsResponseDto>(null)
  
const totalWorkspaceCount = userData?.workspaces?.length || 0;

const activeWorkspaceCount =
  userData?.workspaces?.filter(
    (workspace) => workspace.status === "Active"
  ).length || 0;

useEffect(()=>{

  async function fetchUserDetails (){
  const userDetails = await fetchAUserDetails(user.id)
  setUser(userDetails)
  }
  fetchUserDetails()

},user)

console.log(userData,"Data++++")
  const [sidebarCollapsed, ] = useState(false)


  const userDefault = user
  const [status, setStatus] = useState<User["status"]>(userDefault.status)
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(userDefault.isEmailVerified)



 
const dispatch = useDispatch()
  const suspend = async() => {
    setStatus("suspended")
        await dispatch(removeUser({deleteUser:user.id,updatedProfile:{isDeleted:true} })).unwrap()
    
    toast("Suspended")
  }
  const reactivate = async() => {
    setStatus("active")
            await dispatch(removeUser({deleteUser:user.id,updatedProfile:{isDeleted:false} })).unwrap()

    toast.success("Activated")
  }
  // const toggle2FA = () => {
  //   setTwoFA((v) => !v)
  //   toast({
  //     title: "Two-factor updated",
  //     description: twoFA ? "2FA disabled for this user." : "2FA enabled for this user.",
  //   })
  // }
  const resendVerification = () => {
    setIsEmailVerified(true)
    toast({ title: "Verification sent", description: `Verification email has been sent to ${userDefault.email}.` })
  }
  // const revokeSession = (id: string) => {
  //   toast({ title: "Session revoked", description: `Session ${id} has been revoked.` })
  // }
  // const editUser = () => toast({ title: "Open edit modal", description: "Hook up your edit user modal here." })
  // const messageUser = () => toast({ title: "Start message", description: "Open your internal DM or email composer." })
  // const resetPassword = () => toast({ title: "Password reset", description: "Password reset email has been sent." })

  // const storageUsedGB = 12
  // const storageLimitGB = 50
  // const storagePct = Math.min(100, Math.round((storageUsedGB / storageLimitGB) * 100))

  return (
    <div className="min-h-screen bg-gray-50">
    

      <main className={cn("transition-all duration-300 pt-16", sidebarCollapsed ? "ml-16" : "ml-64")}>
        <div className="p-6 space-y-8">
          {/* Header */}
{/* UserDetails Header */}

 <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Avatar */}
          <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-5xl font-bold shadow-xl">
            {userData?.name}
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{userData?.name}</h1>
             
                <div className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 text-sm font-medium rounded-full flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                {userData?.isVerified==true?"Verified":"Not verified"}
                </div>
             
            </div>
            
            <div className="flex items-center gap-6 text-gray-600 dark:text-gray-400 mb-6">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                <span>{userData?.email}</span>
              </div>
              
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>{userData?.location}</span>
                </div>
             
            </div>

            <div className="flex gap-4">
              {/* <button 
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-2xl font-medium transition-colors"
              >
                <Settings className="w-5 h-5" />
                Edit Profile
              </button> */}
            
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 self-start">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-5 text-center">
              <div className="text-3xl font-bold text-indigo-600">{totalWorkspaceCount}</div>
              <div className="text-sm text-gray-500">Workspaces</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-5 text-center">
              <div className="text-3xl font-bold text-emerald-600">{activeWorkspaceCount}</div>
              <div className="text-sm text-gray-500">Active</div>
            </div>
          </div>
        </div>
      </div>
    </div>


{/* End Header ... */}
{/* body of user datat */}
 <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Your Workspaces</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage all your team spaces and collaborations</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-1">
             
             
             
            </div>

           
          </div>
        </div>
{/* end body */}
{/* WorkspaclISt */}
{userData?.workspaces?.map((space) => {
  return (
    <div
      key={space.id}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
            {space.name.charAt(0)}
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {space.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              @{space.slug}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            {space.status}
          </span>

          <span className="px-3 py-1 text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-full">
            {space.isOwner ? "Owner" : "Member"}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-6">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4" />
          <span>{formatTimestamp(space.createdAt)}</span>
        </div>

        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          <span>{space.membersCount}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-xl font-medium transition-colors">
          Block this user in this workspace
        </button>

        
      </div>
    </div>
  );
})}

    
{/* end List */}


     <div className="flex justify-end">
        
        <CloseIcon onClose={() => setPage(null)} />
      </div>
         

          {/* KPIs */}
       
          {/* Content Grid */}
       
        </div>
      </main>
    </div>
  )
}
