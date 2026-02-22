import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { format } from "date-fns"

import { CloseIcon } from "../../../Custom/reusecomponents/CloseIcon"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../Custom/ui/card"
import { Input } from "../../../Custom/ui/input"
import { Label } from "../../../Custom/ui/label"
import { Textarea } from "../../../Custom/ui/textarea"
import { Button } from "../../../Custom/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../Custom/ui/select"
import { Badge } from "../../../Custom/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../../../Custom/ui/avatar"
import { Separator } from "../../../Custom/ui/separator"

import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  ShieldOff,
  UserCog,
  Globe,
  Clock,
  Calendar,
  Activity,
  LogIn,
  Building2,
  Save,
  RefreshCw,
  Ban,
  PlayCircle,
  CheckCircle2,
} from "lucide-react"

import { cn } from "../../../Utility/utils"
import { updateUser } from "../../apis/updateApi"
import { useFetchUserPageQuery } from "../../apis/fetchApi"
import { dataMap } from "../../types/mapData"

export default function UserProfileEditPage({ setPage, user,refetch,setUser }) {
  // const { refetch } = useFetchUserPageQuery()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    role: "member",
    timezone: "UTC",
    locale: "en-US",
  })

  const [status, setStatus] = useState("active") // separate so we can style differently

  useEffect(() => {
    if (!user) return

    setFormData({
      name: user.name ?? "",
      email: user.email ?? "",
      phone: user.phone ?? "",
      bio: user.bio ?? "",
      role: user.role ?? "member",
      timezone: user.timezone ?? "UTC",
      locale: user.locale ?? "en-US",
    })

    setStatus(user.status ?? "active")
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
      
  }


  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = dataMap({
        ...formData,
        status, // include current status decision
      })
     
      await updateUser(user.id, payload)
      await refetch()
      toast.success("User updated successfully")
      setPage(null)
    } catch (err) {
      toast.error("Failed to update user")
    }
  }

  const onReset = () => {
    setFormData({
      name: user.name ?? "",
      email: user.email ?? "",
      phone: user.phone ?? "",
      bio: user.bio ?? "",
      role: user.role ?? "member",
      timezone: user.timezone ?? "UTC",
      locale: user.locale ?? "en-US",
    })
    setStatus(user.status ?? "active")
    toast.info("Form reset")
  }

  if (!user) return <div className="p-10 text-center text-muted-foreground">Loading user...</div>

  const isActive = status === "active"
  const joinedDate = user.joinedAt ? format(new Date(user.joinedAt), "MMM d, yyyy") : "—"
  const lastActive = user.lastActivity ? format(new Date(user.lastActivity), "MMM d, yyyy HH:mm") : "—"
const changeStatus = async(status) =>{
  setStatus(status);
   const stat= status=="inactive"?true:false
    await updateUser(user.id, {isDeleted:stat});
    refetch()
   toast.success("User updated successfully")
}
  return (
    <div className="min-h-screen bg-gray-50/60 pb-24 ml-[15em]">
      <form onSubmit={onSubmit} className="mx-auto max-w-5xl px-5 py-18 space-y-8">

        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b -mx-5 px-5 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 ring-1 ring-border">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                {user.name?.[0]?.toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-2xl font-bold tracking-tight">{user.name}</h3>
              <div className="flex flex-wrap gap-2 mt-1.5">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {user.role.toUpperCase()}
                </Badge>
                <Badge
                  variant="outline"
                  className={cn(
                    "px-3 py-0.5",
                    isActive
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-red-50 text-red-700 border-red-200"
                  )}
                >
                  {isActive ? "ACTIVE" : "INACTIVE"}
                </Badge>
                {user.isEmailVerified && (
                  <Badge variant="secondary" className="bg-emerald-50 text-emerald-700">
                    <ShieldCheck className="h-3 w-3 mr-1" /> Verified
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button type="button" variant="ghost" size="sm" onClick={onReset}>
              <RefreshCw className="h-4 w-4 mr-1.5" />
              Reset
            </Button>
            <Button type="submit" className="gap-1.5 min-w-[140px]">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
            <CloseIcon onClose={() => setPage(null)} />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
          <StatCard icon={Calendar} label="Joined" value={joinedDate} color="violet" />
          <StatCard icon={Activity} label="Last Active" value={lastActive} color="green" />
          {/* <StatCard icon={LogIn} label="Logins" value={user.loginCount ?? 0} color="blue" /> */}
          {/* <StatCard
            icon={user.twoFactorEnabled ? ShieldCheck : ShieldOff}
            label="2FA"
            value={user.twoFactorEnabled ? "Enabled" : "Disabled"}
            color={user.twoFactorEnabled ? "emerald" : "amber"}
          /> */}
          <StatCard
            icon={Building2}
            label="Workspace"
            value={user.workspace?.name ?? "—"}
            color="purple"
          />
        </div>

        {/* Identity */}
        <Card className="shadow-sm border">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-muted-foreground" />
              Personal Information
            </CardTitle>
            <CardDescription>Core user identity details</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="bio">Bio / About</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell something about the user..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Role & Status */}
        <Card className="shadow-sm border">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <UserCog className="h-5 w-5 text-muted-foreground" />
              Role & Account Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={formData.role}
                onValueChange={(v) => setFormData((p) => ({ ...p, role: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="guest">Guest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label>Account Status</Label>
              <div className="flex flex-wrap gap-3">
                {isActive ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="border-red-200 text-red-700 hover:bg-red-50"
                    onClick={() => changeStatus('inactive')}
                  >
                    <Ban className="h-4 w-4 mr-1.5" />
                    Suspend User
                  </Button>
                ) : (
                  <Button
                    type="button"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => changeStatus("active")}
                  >
                    <PlayCircle className="h-4 w-4 mr-1.5" />
                    Reactivate User
                  </Button>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {isActive
                  ? "User is currently active and can log in."
                  : "User is suspended and cannot access the system."}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Locale */}
        <Card className="shadow-sm border">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-muted-foreground" />
              Locale & Timezone
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Timezone</Label>
              <Select
                value={formData.timezone}
                onValueChange={(v) => setFormData((p) => ({ ...p, timezone: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                  <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                  {/* Add more as needed */}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Language / Locale</Label>
              <Select
                value={formData.locale}
                onValueChange={(v) => setFormData((p) => ({ ...p, locale: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en-US">English (United States)</SelectItem>
                  <SelectItem value="en-GB">English (United Kingdom)</SelectItem>
                  <SelectItem value="fr-FR">French (France)</SelectItem>
                  {/* Add more */}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-5 flex items-center gap-4">
        <div className={cn("p-3 rounded-full", `bg-${color}-100/60`)}>
          <Icon className={cn("h-6 w-6", `text-${color}-700`)} />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-md font-semibold mt-0.2">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}