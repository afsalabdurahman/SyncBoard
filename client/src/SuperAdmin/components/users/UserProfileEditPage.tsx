import { useMemo, useState } from "react"
import { useForm,SubmitHandler } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from '@hookform/resolvers/zod';
import { CloseIcon } from "../../../Custom/reusecomponents/CloseIcon";
import { Card, CardContent, CardHeader, CardTitle } from "../../../Custom/ui/card"
import { Input } from "../../../Custom/ui/input"
import { Label } from "../../../Custom/ui/label"
import { Textarea } from "../../../Custom/ui/textarea"
import { Button } from "../../../Custom/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../Custom/ui/select"
import { Switch } from "../../../Custom/ui/switch"
import { Badge } from "../../../Custom/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../../../Custom/ui/avatar"
import { Separator } from "../../../Custom/ui/separator"
import {toast} from "react-toastify"
import { cn } from "../../../Utility/utils"
import {
  UserIcon,
  Mail,
  UserCog,
  CheckCircle2,
  RefreshCw,
  Shield,
  Globe,
  Languages,
  Bell,
  AlertTriangle,
  Trash2,
  PauseCircle,
  PlayCircle,
  KeyRound,
  ImageIcon,
} from "lucide-react"
import { error } from "console";
import { dataMap } from "../../types/mapData";
import { updateUser } from "../../apis/updateApi";
import { useFetchUserPageQuery } from "../../apis/fetchApi";

type Role = "owner" | "admin" | "member" | "guest"
type Status = "active" | "inactive" | "suspended" | "pending"

const roleColors: Record<Role, string> = {
  owner: "bg-purple-100 text-purple-800",
  admin: "bg-blue-100 text-blue-800",
  member: "bg-green-100 text-green-800",
  guest: "bg-gray-100 text-gray-800",
}

const statusColors: Record<Status, string> = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
  suspended: "bg-red-100 text-red-800",
  pending: "bg-yellow-100 text-yellow-800",
}

const schema = z.object({
  // Identity
  name: z.string().min(2, "Name is required"),
  title: z.string().max(80).optional().or(z.literal("")),
  avatar: z.string().optional().or(z.literal("")),
  // Contact
  email: z.string().email("Invalid email"),
  phone: z.string().max(40).optional().or(z.literal("")),
  // Role & Status
  role: z.enum(["owner", "admin", "member", "guest"]),
  status: z.enum(["active", "inactive", "suspended", "pending"]),
  // Locale
  timezone: z.string(),
  locale: z.string(),
  // Profile
  bio: z.string().max(280, "Bio must be 280 characters or fewer").optional().or(z.literal("")),
  // Security
  twoFactorEnabled: z.boolean().default(false),
  emailVerified: z.boolean().default(true),
  // Notifications
  notifProduct: z.boolean().default(true),
  notifSecurity: z.boolean().default(true),
  notifBilling: z.boolean().default(true),
})

// type FormValues = z.infer<typeof schema>

export default function UserProfileEditPage({setPage,user}) {
 const {refetch}= useFetchUserPageQuery()
  console.log(user,"user+++")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
const defaultValues = {
    name: user.name || "",
    title: user.title || "",
    avatar: user.avatar || "",
    email: user.email || "",
    phone: user.phone || "",
    role: user.role || "member",
    status: user.status || "active",
    timezone: user.timezone || "UTC",
    locale: user.locale || "en-US",
    bio: user.bio || "",
    twoFactorEnabled: user.twoFactorEnabled ?? false,
    emailVerified: user.emailVerified ?? true,
    notifProduct: user.notifProduct ?? true,
    notifSecurity: user.notifSecurity ?? true,
    notifBilling: user.notifBilling ?? true,
};




const onReset =()=>{
  console.log("allReset...")
}


const {register,handleSubmit,setValue,watch,formState:{errors,isDirty,isSubmitting}}=useForm({resolver:zodResolver(schema),mode:"onChange",defaultValues:defaultValues})



const sendPasswordReset = ()=>{
  console.log("sendREset")
}

const reactivate=()=>{
  console.log("reAcivr")
}
const suspend = ()=>{
  console.log("suspenf")
}
const deleteUser = ()=>{
  console.log("DeleteUser")
}
  const onSubmit = async (data) => {
    const updatedProfile=dataMap(data)

    console.log(updatedProfile,"$$$$$$$$$$$$$DATA")
 await updateUser(user.id,updatedProfile).then(()=>{
  refetch()
  toast.success("Updated")
  
  setPage(null)

 })
    
 
  }
  return (
    <div className="min-h-screen bg-gray-50">
    

      <main className={cn("transition-all duration-300 pt-16", sidebarCollapsed ? "ml-16" : "ml-64")}>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
          {/* Header */}
          <div className="flex justify-end">
        
        <CloseIcon onClose={() => setPage(null)} />
      </div>
          <div className="rounded-xl bg-white border p-5 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <Avatar className="h-14 w-14 rounded-lg">
                  <AvatarImage
                    src={user.avatar?user.avatar:""}
                    alt="profile"
                  />
                 
                </Avatar>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl font-semibold text-gray-900 truncate">Edit User</h1>
                    <Badge variant="secondary" className={roleColors[user.role]}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                    <Badge variant="secondary" className={statusColors[user.status]}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </Badge>
                    <span className="text-xs rounded bg-gray-100 px-2 py-0.5">ID: {user.id}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Joined {new Date(user.joinedAt).toLocaleDateString("en-US")} · Last active{" "}
                    {new Date(user.lastActive).toLocaleDateString("en-US")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" onClick={onReset} className="gap-2 bg-transparent">
                  <RefreshCw className="h-4 w-4" />
                  Reset
                </Button>
               

                <Button type="submit" disabled={isSubmitting || !isDirty} className="gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </div>

          {/* Form grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left column (2) */}
            <div className="xl:col-span-2 space-y-6">
              {/* Identity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserIcon className="h-5 w-5 text-gray-500" />
                    Identity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid md:grid-cols-1 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" {...register("name")} placeholder="Enter Name" />
                      {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
                    </div>
                    
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <Input id="email" className="pl-9" {...register("email")} placeholder={user.email} />
                      </div>
                      {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" {...register("phone")} placeholder={user.phone||"Enter Phone Number"} />
                      {errors.phone && <p className="text-xs text-red-600">{errors.phone.message}</p>}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="avatar">Avatar</Label>
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-lg border bg-white overflow-hidden flex items-center justify-center">
                          {user.avatar ? (
                            <img
                              src={user.avatar || ""}
                              alt="Avatar"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="h-6 w-6 text-gray-400" />
                          )}
                        </div>
                        {/* <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => e.target.files && onUpload(e.target.files[0])}
                          className="cursor-pointer"
                        /> */}
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea id="bio" rows={3} {...register("bio")} placeholder="Add Your Bio" />
                      {errors.bio && <p className="text-xs text-red-600">{errors.bio.message}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security */}
              {/* <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-gray-500" />
                    Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border bg-white p-3">
                    <div>
                      <p className="font-medium">Two‑Factor Authentication</p>
                      <p className="text-sm text-gray-600">Require a second factor on sign in.</p>
                    </div>
                    <Switch
                      checked={twoFA}
                      onCheckedChange={(v) => setValue("twoFactorEnabled", v, { shouldDirty: true })}
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-lg border bg-white p-3">
                    <div>
                      <p className="font-medium">Email Verified</p>
                      <p className="text-sm text-gray-600">Mark the email as verified/unverified.</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {!emailVerified && (
                        <Button type="button" variant="outline" onClick={resendVerification}>
                          Resend Verification
                        </Button>
                      )}
                      <Switch
                        checked={emailVerified}
                        onCheckedChange={(v) => setValue("emailVerified", v, { shouldDirty: true })}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="gap-2 bg-transparent"
                      onClick={sendPasswordReset}
                    >
                      <KeyRound className="h-4 w-4" />
                      Send Password Reset
                    </Button>
                  </div>
                </CardContent>
              </Card> */}
            </div>

            {/* Right column (1) */}
            <div className="space-y-6">
              {/* Role & Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCog className="h-5 w-5 text-gray-500" />
                    Role & Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label>Role</Label>
                    <Select
                      value={watch("role")}
                      onValueChange={(v: Role) => setValue("role", v, { shouldDirty: true, shouldTouch: true })}
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

                  <div className="grid gap-2">
                    <Label>Status</Label>
                    <Select
                      value={watch("status")} 
                      onValueChange={(v: Status) => setValue("status", v, { shouldDirty: true, shouldTouch: true })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={user.status} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        {/* <SelectItem value="suspended">Suspended</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem> */}
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="flex flex-wrap gap-2">
                    {user.status === "inActive" ? (
                      <Button type="button" variant="outline" onClick={reactivate} className="gap-2 bg-transparent">
                        <PlayCircle className="h-4 w-4" />
                        Reactivate User
                      </Button>
                    ) : (
                      <Button type="button" variant="outline" onClick={suspend} className="gap-2 bg-transparent">
                        <PauseCircle className="h-4 w-4" />
                        Suspend User
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Locale */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-gray-500" />
                    Locale
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label>Timezone</Label>
                    <Select
                      value={watch("timezone")}
                      onValueChange={(v) => setValue("timezone", v, { shouldDirty: true })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="America/Los_Angeles">America/Los_Angeles</SelectItem>
                        <SelectItem value="America/New_York">America/New_York</SelectItem>
                        <SelectItem value="Europe/Berlin">Europe/Berlin</SelectItem>
                        <SelectItem value="Asia/Tokyo">Asia/Tokyo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label className="flex items-center gap-2">
                      <Languages className="h-4 w-4 text-gray-400" />
                      Locale
                    </Label>
                    <Select value={watch("locale")} onValueChange={(v) => setValue("locale", v, { shouldDirty: true })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select locale" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en-US">English (US)</SelectItem>
                        <SelectItem value="en-GB">English (UK)</SelectItem>
                        <SelectItem value="de-DE">Deutsch (DE)</SelectItem>
                        <SelectItem value="fr-FR">Français (FR)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Notifications */}
              {/* <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-gray-500" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                 <CardContent className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border bg-white p-3">
                    <div>
                      <p className="font-medium">Product updates</p>
                      <p className="text-sm text-gray-600">Get product announcements and tips.</p>
                    </div>
                    <Switch
                      checked={watch("notifProduct")}
                      onCheckedChange={(v) => setValue("notifProduct", v, { shouldDirty: true })}
                    />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border bg-white p-3">
                    <div>
                      <p className="font-medium">Security alerts</p>
                      <p className="text-sm text-gray-600">Receive security and unusual activity notifications.</p>
                    </div>
                    <Switch
                      checked={watch("notifSecurity")}
                      onCheckedChange={(v) => setValue("notifSecurity", v, { shouldDirty: true })}
                    />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border bg-white p-3">
                    <div>
                      <p className="font-medium">Billing</p>
                      <p className="text-sm text-gray-600">Invoices and payment related updates.</p>
                    </div>
                    <Switch
                      checked={watch("notifBilling")}
                      onCheckedChange={(v) => setValue("notifBilling", v, { shouldDirty: true })}
                    />
                  </div>
                </CardContent> 
              </Card> */}

              {/* Danger Zone */}
              {/* <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700">
                    <AlertTriangle className="h-5 w-5" />
                    Danger Zone
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-700">
                    Suspending prevents the user from signing in. Deleting is permanent and cannot be undone.
                  </p>
                   <div className="flex flex-wrap gap-2">
                    {user.status === "suspended" ? (
                      <Button type="button" variant="outline" onClick={reactivate}>
                        Reactivate User
                      </Button>
                    ) : (
                      <Button type="button" variant="destructive" onClick={suspend}>
                        Block
                      </Button>
                    )}
                    <Button type="button" variant="destructive" className="gap-2" onClick={deleteUser}>
                      <Trash2 className="h-4 w-4" />
                      Suspend User
                    </Button>
                  </div> 
                </CardContent>
              </Card> */}
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}
