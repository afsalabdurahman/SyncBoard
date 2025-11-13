
 import { ConfirmDialog } from "../../../Custom/ui/DeleteAlertButton"
import { useUpdateWorkspaceMutation } from "../../apis/fetchApi"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
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
//import { useToast } from "../../../hooks/use-toast"

import { cn } from "../../../Utility/utils"
import {
  Building2,
  Mail,
  User,
  ImageIcon,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Shield,
  Users,
  HardDrive,
  MessageSquare,
} from "lucide-react"
import { toast } from "react-toastify"

const schema = z.object({
  // General
  name: z.string().min(2, "Name is required"),
  slug: z
    .string()
    .min(2, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only"),
  description: z.string().max(280).optional().or(z.literal("")),
  tags: z.string().optional().or(z.literal("")),
  // Owner
  ownerName: z.string().min(2, "Owner name required"),
  ownerEmail: z.string().email("Invalid email"),
  // Plan & Billing
  plan: z.enum(["basic", "pro", "enterprise"]),
  interval: z.enum(["month", "year"]),
  status: z.enum(["active", "trial", "suspended"]),
  cancelAtPeriodEnd: z.boolean().default(false),
  // Limits
  memberLimit: z.coerce.number().min(0).max(100000),
  storageLimitGB: z.coerce.number().min(1).max(100000),
  monthlyMessageLimit: z.coerce.number().min(0).max(100000000),
  // Prefs & Security
  allowExternalInvites: z.boolean().default(true),
  enforce2faForAdmins: z.boolean().default(false),
  enableFileUploads: z.boolean().default(true),
  enableSSO: z.boolean().default(true),
})

type FormValues = z.infer<typeof schema>

type Plan = "basic" | "pro" | "enterprise" | "free"
type Status = "active" | "trial" | "suspended"

const mock = {
  id: "ws_1234567890",
  name: "Acme Corporation",
  slug: "acme-corporation",
  description: "Collaboration and messaging for Acme teams.",
  tags: "b2b,enterprise,collaboration",
  avatar: "/workspace-logo.jpg",
  owner: { name: "John Smith", email: "john../../..acme.com", avatar: "/person-holding-keys.png" },
  plan: "enterprise" as Plan,
  interval: "month" as const,
  status: "active" as Status,
  cancelAtPeriodEnd: false,
  limits: { memberLimit: 1000, storageLimitGB: 100, monthlyMessageLimit: 2000000 },
  prefs: { allowExternalInvites: true, enforce2faForAdmins: true, enableFileUploads: true, enableSSO: true },
  metrics: { members: 245, storageUsedGB: 85, monthlyMessages: 182340 },
  createdAt: "2023-01-15",
  lastActive: "2025-10-12",
}

export default function WorkspaceEditPage({viewDetails,setDetails,refetch,setViewDetails}) {
  console.log(viewDetails,"view data efo edit")
  const [updateWorkspace,   { isLoading: isUpdating } ] = useUpdateWorkspaceMutation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
 // const { toast } = useToast()
  const [logoPreview, setLogoPreview] = useState<string | null>(mock.avatar)
  const [suspendId,setSuspendId]=useState("")
  const [IsDialogOpen,setIsDialogOpen]=useState(false)
const [dialogTitle,setDialogTitle]=useState("")
  const defaultValues: FormValues = useMemo(
    () => ({
      name: viewDetails.name,
      slug: viewDetails.slug,
      description: mock.description,
      tags: mock.tags,
      ownerName: viewDetails.owner.name,
      ownerEmail: viewDetails.owner.email,
      plan: mock.plan,
      interval: mock.interval,
      status: mock.status,
      cancelAtPeriodEnd: mock.cancelAtPeriodEnd,
      memberLimit: mock.limits.memberLimit,
      storageLimitGB: mock.limits.storageLimitGB,
      monthlyMessageLimit: mock.limits.monthlyMessageLimit,
      allowExternalInvites: mock.prefs.allowExternalInvites,
      enforce2faForAdmins: mock.prefs.enforce2faForAdmins,
      enableFileUploads: mock.prefs.enableFileUploads,
      enableSSO: mock.prefs.enableSSO,
    }),
    [],
  )

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onChange",
  })

  const onUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setLogoPreview(result)
    }
    reader.readAsDataURL(file)
  }

const handleConfirm = async()=>{
  console.log("Confirmed....")
  console.log(suspendId,)
  console.log(viewDetails,"viewDAtas")
   await updateWorkspace({
        id: viewDetails.id,
        merge: suspendId,
      }).unwrap();
              refetch()
           toast.success("Updated...")
          setViewDetails((prev) => ({
        ...prev,
        status: dialogTitle,
      }));
}

  const onSubmit = async (data: FormValues) => {
    // Simulate API delay
    console.log(data,"dataa")
    // let merge={
  
    // }
    await new Promise((r) => setTimeout(r, 700))
    console.log("Saving workspace:", { id: mock.id, logoPreview, ...data })
    toast({ title: "Workspace saved", description: `${data.name} updated successfully.` })
  }

  const onReset = () => {
    reset(defaultValues)
    setLogoPreview(mock.avatar)
    toast({ title: "Changes reset", description: "Form restored to last saved values." })
  }

  const suspend = () => {
    const merge = {
    status:"Suspended"
  }
console.log("suspenf cliked")
setSuspendId(merge)
setIsDialogOpen(true);
setDialogTitle("suspended")

   
  }

  const reactivate = () => {
  
    const merge = {
    status:"Active"
  }
  setSuspendId(merge)
  setDialogTitle("active")
 setIsDialogOpen(true);
  }
 

  const planColor = {
    free:"bg-gray-100 text-gray-800",
    basic: "bg-gray-100 text-gray-800",
    pro: "bg-purple-100 text-purple-800",
    enterprise: "bg-orange-100 text-orange-800",
  } as const

  const statusColor = {
    active: "bg-green-100 text-green-800",
    trial: "bg-blue-100 text-blue-800",
    suspended: "bg-red-100 text-red-800",
  } as const

  const storagePct = Math.min(100, Math.round((mock.metrics.storageUsedGB / defaultValues.storageLimitGB) * 100))
console.log(defaultValues,"defaultss")
  return (
    <div className="min-h-screen bg-gray-50">
       

      <main className={cn("transition-all duration-300 pt-16", sidebarCollapsed ? "ml-16" : "ml-64")}>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
          {/* Page Header */}
           <div className="flex justify-end">
              
              <CloseIcon onClose={() => setDetails(null)} />
            </div>
          <div className="rounded-xl bg-white border p-5 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <Avatar className="h-12 w-12 rounded-lg">
                  <AvatarImage
                    src={logoPreview || "/placeholder.svg?height=48&width=48&query=workspace-logo"}
                    alt="Workspace logo"
                  />
                  <AvatarFallback>
                    {viewDetails.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl font-semibold text-gray-900 truncate">Edit {viewDetails.name}</h1>
                    <Badge variant="secondary" className={planColor[viewDetails.plan]}>
                      {viewDetails.plan.charAt(0).toUpperCase() + viewDetails.plan.slice(1)}
                    </Badge>
                    <Badge variant="secondary" className={statusColor[defaultValues.status]}>
                      {viewDetails.status.charAt(0).toUpperCase() + viewDetails.status.slice(1)}
                    </Badge>
                    <span className="text-xs rounded bg-gray-100 px-2 py-0.5">ID: {mock.id}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Created {new Date(viewDetails.createdAt).toLocaleDateString("en-US")} · Last active{" "}
                    {new Date(viewDetails.lastActivity).toLocaleDateString("en-US")}
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

          {/* Quick KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Members</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{viewDetails.members}</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Monthly Messages</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {mock.metrics.monthlyMessages.toLocaleString()}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card> */}

            {/* <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Storage Used</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{mock.metrics.storageUsedGB}GB</p>
                    <div className="text-sm text-gray-600">of {defaultValues.storageLimitGB}GB</div>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center">
                    <HardDrive className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                  <div className="h-2 rounded-full bg-blue-500" style={{ width: `${storagePct}%` }} />
                </div>
              </CardContent>
            </Card> */}

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Owner</p>
                    <p className="text-lg font-bold text-gray-900 mt-1">{viewDetails.owner.name}</p>
                    <p className="text-xs text-gray-600">{viewDetails.owner.email}</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Form grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left column (2) */}
            <div className="xl:col-span-2 space-y-6">
              {/* General */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-gray-500" />
                    General
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Workspace Name</Label>
                      <Input id="name" {...register("name")} placeholder="Acme Corporation" />
                      {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="slug">Slug</Label>
                      <Input id="slug" {...register("slug")} placeholder="acme-corporation" />
                      {errors.slug && <p className="text-xs text-red-600">{errors.slug.message}</p>}
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" {...register("description")} placeholder="Describe this workspace..." />
                    {errors.description && <p className="text-xs text-red-600">{errors.description.message}</p>}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="tags">Tags (comma-separated)</Label>
                      <Input id="tags" {...register("tags")} placeholder="b2b, enterprise, messaging" />
                    </div>

                    {/* <div className="grid gap-2">
                      <Label>Logo</Label>
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-lg border bg-white overflow-hidden flex items-center justify-center">
                          {logoPreview ? (
                            <img
                              src={logoPreview || "/placeholder.svg"}
                              alt="Logo preview"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="h-6 w-6 text-gray-400" />
                          )}
                        </div>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => e.target.files && onUpload(e.target.files[0])}
                          className="cursor-pointer"
                        />
                      </div>
                    </div> */}
                  </div>
                </CardContent>
              </Card>

              {/* Owner */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-gray-500" />
                    Owner
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="ownerName">Owner Name</Label>
                      <Input id="ownerName" {...register("ownerName")} placeholder="John Smith" />
                      {errors.ownerName && <p className="text-xs text-red-600">{errors.ownerName.message}</p>}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="ownerEmail">Owner Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="ownerEmail"
                          className="pl-9"
                          {...register("ownerEmail")}
                          placeholder="john../../..acme.com"
                        />
                      </div>
                      {errors.ownerEmail && <p className="text-xs text-red-600">{errors.ownerEmail.message}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Limits */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-gray-500" />
                    Limits
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="memberLimit">Member Limit</Label>
                      <Input id="memberLimit" type="number" min={0} {...register("memberLimit")} />
                      {errors.memberLimit && <p className="text-xs text-red-600">{errors.memberLimit.message}</p>}
                    </div>
                    {/* <div className="grid gap-2">
                      <Label htmlFor="storageLimitGB">Storage Limit (GB)</Label>
                      <Input id="storageLimitGB" type="number" min={1} {...register("storageLimitGB")} />
                      {errors.storageLimitGB && <p className="text-xs text-red-600">{errors.storageLimitGB.message}</p>}
                    </div> */}
                    <div className="grid gap-2">
                      <Label htmlFor="monthlyMessageLimit">Monthly Message Limit</Label>
                      <Input id="monthlyMessageLimit" type="number" min={0} {...register("monthlyMessageLimit")} />
                      {errors.monthlyMessageLimit && (
                        <p className="text-xs text-red-600">{errors.monthlyMessageLimit.message}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right column (1) */}
            <div className="space-y-6">
              {/* Plan & Billing */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-gray-500" />
                    Plan & Billing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label>Plan</Label>
                    <Select
                      value={defaultValues.plan}
                      onValueChange={(v: "basic" | "pro" | "enterprise") => setValue("plan", v, { shouldDirty: true })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select plan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic</SelectItem>
                        <SelectItem value="pro">Pro</SelectItem>
                        <SelectItem value="enterprise">Enterprise</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label>Billing Interval</Label>
                    <Select
                      value={defaultValues.interval}
                      onValueChange={(v: "month" | "year") => setValue("interval", v, { shouldDirty: true })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select interval" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="month">Monthly</SelectItem>
                        <SelectItem value="year">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label>Status</Label>
                    <Select
                      value={defaultValues.status}
                      onValueChange={(v: Status) => setValue("status", v, { shouldDirty: true })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="trial">Trial</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border bg-white p-3">
                    <div>
                      <p className="font-medium">Cancel at Period End</p>
                      <p className="text-sm text-gray-600">Mark subscription to cancel on next renewal date.</p>
                    </div>
                    <Switch
                      checked={defaultValues.cancelAtPeriodEnd}
                      onCheckedChange={(v) => setValue("cancelAtPeriodEnd", v, { shouldDirty: true })}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Preferences & Security */}
              {/* <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-gray-500" />
                    Preferences & Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg border bg-white p-3">
                    <div>
                      <p className="font-medium">Allow External Invites</p>
                      <p className="text-sm text-gray-600">Members can invite users outside your domain.</p>
                    </div>
                    <Switch
                      checked={defaultValues.allowExternalInvites}
                      onCheckedChange={(v) => setValue("allowExternalInvites", v, { shouldDirty: true })}
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-lg border bg-white p-3">
                    <div>
                      <p className="font-medium">Require 2FA for Admins</p>
                      <p className="text-sm text-gray-600">Improve security by enforcing two-factor auth.</p>
                    </div>
                    <Switch
                      checked={defaultValues.enforce2faForAdmins}
                      onCheckedChange={(v) => setValue("enforce2faForAdmins", v, { shouldDirty: true })}
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-lg border bg-white p-3">
                    <div>
                      <p className="font-medium">Enable File Uploads</p>
                      <p className="text-sm text-gray-600">Allow attachments in messages and tasks.</p>
                    </div>
                    <Switch
                      checked={defaultValues.enableFileUploads}
                      onCheckedChange={(v) => setValue("enableFileUploads", v, { shouldDirty: true })}
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-lg border bg-white p-3">
                    <div>
                      <p className="font-medium">Enable SSO</p>
                      <p className="text-sm text-gray-600">Authenticate via your SSO provider.</p>
                    </div>
                    <Switch
                      checked={defaultValues.enableSSO}
                      onCheckedChange={(v) => setValue("enableSSO", v, { shouldDirty: true })}
                    />
                  </div>
                </CardContent>
              </Card> */}

              {/* Danger Zone */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700">
                    <AlertTriangle className="h-5 w-5" />
                    Danger Zone
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <p className="text-sm text-gray-700">
                    Suspend prevents all users in this workspace from signing in. You can reactivate anytime.
                  </p>
                  <div className="flex gap-2">
                    {viewDetails.status === "suspended" ? (
                      <Button type="button" variant="outline" onClick={reactivate}>
                        Reactivate Workspace
                      </Button>
                    ) : (
                      <Button type="button" variant="destructive" onClick={suspend}>
                        Suspend Workspace
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
               <ConfirmDialog
                                open={IsDialogOpen}
                                onClose={() => setIsDialogOpen(false)}
                                onConfirm={handleConfirm}
                                description='This  will be  Confirm Action.'
                              />
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}
