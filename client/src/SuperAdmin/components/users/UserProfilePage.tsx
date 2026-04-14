
import {  useState } from "react"

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
} from "lucide-react"
import type { User } from "./userTable"
import { CloseIcon } from "../../../Custom/reusecomponents/CloseIcon"
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
     <div className="flex justify-end">
        
        <CloseIcon onClose={() => setPage(null)} />
      </div>
          <div className="rounded-xl bg-white border p-5 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <Avatar className="h-14 w-14">
                  <AvatarImage
                    src={userDefault.avatar || "/placeholder.svg?height=80&width=80&query=user-avatar"}
                    alt={userDefault.name}
                  />
                  <AvatarFallback>
                    {userDefault.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl font-semibold text-gray-900 truncate">{userDefault.name}</h1>
                    <Badge variant="secondary" className={roleColors[userDefault.role]}>
                      {userDefault.role.charAt(0).toUpperCase() + userDefault.role.slice(1)}
                    </Badge>
                    <Badge variant="secondary" className={statusColors[status]}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Badge>
                    <span className="text-xs rounded bg-gray-100 px-2 py-0.5">ID: {userDefault.id}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1 flex-wrap">
                    <Mail className="h-3.5 w-3.5" />
                    <span className="truncate">{userDefault.email}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {status === "suspended" ? (
                  <Button variant="outline" onClick={reactivate} className="gap-2 bg-transparent">
                    <PlayCircle className="h-4 w-4" />
                    Reactivate
                  </Button>
                ) : (
                  <Button variant="outline" onClick={suspend} className="gap-2 bg-transparent">
                    <PauseCircle className="h-4 w-4" />
                    Suspend
                  </Button>
                )}
                {!isEmailVerified && (
                  <Button variant="outline" onClick={resendVerification} className="gap-2 bg-transparent">
                    <RefreshCw className="h-4 w-4" />
                    Resend Verification
                  </Button>
                )}
                {/* <Button variant="outline" onClick={messageUser} className="gap-2 bg-transparent">
                  <MessageSquare className="h-4 w-4" />
                  Message
                </Button> */}
                {/* <Button variant="outline" onClick={editUser} className="gap-2 bg-transparent">
                  <UserCog className="h-4 w-4" />
                  Edit User
                </Button> */}
              </div>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Workspaces</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">1</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center">
                    <UserIcon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Login Count</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{userDefault.loginCount}</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center">
                    <LogIn className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card> */}

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Last Activity</p>
                    <p className="text-xl font-bold text-gray-900 mt-1">{fmtDate(userDefault.lastActivity)}</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Storage Used</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{storageUsedGB}GB</p>
                    <div className="text-sm text-gray-600">of {storageLimitGB}GB</div>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                  <div className="h-2 rounded-full bg-blue-500" style={{ width: `${storagePct}%` }} />
                </div>
              </CardContent>
            </Card> */}
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Left (Profile, Security, Memberships) */}
            <div className="xl:col-span-2 space-y-6">
              {/* Profile Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Full Name</p>
                      <p className="text-sm font-medium text-gray-900">{userDefault.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <p className="text-sm font-medium text-gray-900">{userDefault.email}</p>
                        {isEmailVerified ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Role</p>
                      <Badge variant="secondary" className={roleColors[userDefault.role]}>
                        {userDefault.role.charAt(0).toUpperCase() + userDefault.role.slice(1)}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Status</p>
                      <Badge variant="secondary" className={statusColors[status]}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Joined</p>
                      <p className="text-sm font-medium text-gray-900">{fmtDate(userDefault.joinedAt)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Last Active</p>
                      <p className="text-sm font-medium text-gray-900">{fmtDateTime(userDefault.lastActivity)}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex flex-wrap gap-2">
                    {/* <Button variant="outline" className="gap-2 bg-transparent" onClick={resetPassword}>
                      <KeyRound className="h-4 w-4" />
                      Send Password Reset
                    </Button> */}
                    {/* <Button variant="outline" className="gap-2 bg-transparent" onClick={toggle2FA}>
                      <Shield className="h-4 w-4" />
                      {twoFA ? "Disable 2FA" : "Enable 2FA"}
                    </Button> */}
                    {!isEmailVerified && (
                      <Button variant="outline" className="gap-2 bg-transparent" onClick={resendVerification}>
                        <RefreshCw className="h-4 w-4" />
                        Resend Verification
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Memberships */}
              <Card>
                <CardHeader>
                  <CardTitle>Memberships</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* {memberships.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between rounded-lg border bg-white p-3 hover:shadow-sm transition-shadow"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">{m.workspace}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className={planColors[m.plan]}>
                            {m.plan.charAt(0).toUpperCase() + m.plan.slice(1)}
                          </Badge>
                          <Badge variant="secondary" className={roleColors[m.role]}>
                            {m.role.charAt(0).toUpperCase() + m.role.slice(1)}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className={statusColors[m.status as User["status"]] ?? "bg-gray-100"}
                          >
                            {m.status.charAt(0).toUpperCase() + m.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-xs text-gray-600">Joined {fmtDate(m.joinedAt)}</div>
                    </div>
                  ))} */}
                  <div
                      key={user.id}
                      className="flex items-center justify-between rounded-lg border bg-white p-3 hover:shadow-sm transition-shadow"
                    ></div>
                     <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">{user.workspace.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className={planColors[user.workspace.plan]}>
                            {user.workspace.plan.charAt(0).toUpperCase() + user.workspace.plan.slice(1)}
                          </Badge>
                          <Badge variant="secondary" className={roleColors[user.role]}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className={statusColors[user.status as User["status"]] ?? "bg-gray-100"}
                          >
                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-xs text-gray-600">Joined {fmtDate(user.joinedAt)}</div>
                 
                    
                </CardContent>
              </Card>
            </div>

            {/* Right (Activity + Sessions) */}
            <div className="space-y-6">
              {/* Recent Activity */}
              {/* <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {activity.map((a) => (
                    <div key={a.id} className="flex items-start gap-3">
                      <div className="h-9 w-9 rounded-lg bg-gray-100 flex items-center justify-center">
                        <a.icon className="h-4 w-4 text-gray-700" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-gray-900 truncate">{a.title}</p>
                          <span className="text-xs text-gray-500">{fmtDateTime(a.time)}</span>
                        </div>
                        {a.detail && <p className="text-sm text-gray-600 mt-0.5">{a.detail}</p>}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card> */}

              {/* Sessions */}
              {/* <Card>
                <CardHeader>
                  <CardTitle>Sessions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {sessions.map((s) => (
                    <div key={s.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-4 w-4 text-gray-500" />
                          <p className="text-sm font-medium text-gray-900">
                            {s.device} · {s.os} · {s.browser}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
                          <div className="flex items-center gap-1">
                            <Globe className="h-3.5 w-3.5" />
                            <span>
                              {s.ip} · {s.location}
                            </span>
                          </div>
                          <span>Last seen {fmtDateTime(s.lastSeen)}</span>
                          {s.current && <Badge variant="secondary">Current</Badge>}
                        </div>
                      </div>
                      <div className="shrink-0">
                        <Button variant="outline" size="sm" onClick={() => revokeSession(s.id)}>
                          Revoke
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card> */}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
