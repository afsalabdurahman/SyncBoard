"use client"

import { MoreHorizontal, Mail, Calendar, Shield, AlertTriangle, CheckCircle, Clock, XCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import { Badge } from "../../../components/ui/badge"
import { Button } from "../../../components/ui/button"
import { Card, CardContent } from "../../../components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: "owner" | "admin" | "member" | "guest"
  status: "active" | "inactive" | "suspended" | "pending"
  workspace: {
    name: string
    plan: "basic" | "pro" | "enterprise"
  }
  joinedAt: string
  lastActivity: string
  loginCount: number
  isEmailVerified: boolean
  twoFactorEnabled: boolean
}

interface UserTableProps {
  users: User[]
  onViewUser: (user: User) => void
  onEditUser: (user: User) => void
  onSuspendUser: (user: User) => void
  onDeleteUser: (user: User) => void
  onResendInvite: (user: User) => void
}

const statusConfig = {
  active: { color: "bg-green-100 text-green-800", icon: CheckCircle },
  inactive: { color: "bg-gray-100 text-gray-800", icon: XCircle },
  suspended: { color: "bg-red-100 text-red-800", icon: AlertTriangle },
  pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
}

const roleColors = {
  owner: "bg-purple-100 text-purple-800",
  admin: "bg-blue-100 text-blue-800",
  member: "bg-green-100 text-green-800",
  guest: "bg-gray-100 text-gray-800",
}

const planColors = {
  basic: "bg-gray-100 text-gray-800",
  pro: "bg-purple-100 text-purple-800",
  enterprise: "bg-orange-100 text-orange-800",
}

export const UserTable =({
  users,
  onViewUser,
  onEditUser,
  onSuspendUser,
  onDeleteUser,
  onResendInvite,
}: UserTableProps) =>{
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return formatDate(dateString)
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Workspace</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Security</TableHead>
              <TableHead>Activity</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => {
              const StatusIcon = statusConfig[user.status].icon
              return (
                <TableRow key={user.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500 flex items-center space-x-1">
                          <Mail className="h-3 w-3" />
                          <span>{user.email}</span>
                          {!user.isEmailVerified && <AlertTriangle className="h-3 w-3 text-orange-500" />}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">{user.workspace.name}</div>
                      <Badge className={planColors[user.workspace.plan]} variant="secondary">
                        {user.workspace.plan.charAt(0).toUpperCase() + user.workspace.plan.slice(1)}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={roleColors[user.role]} variant="secondary">
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Badge className={statusConfig[user.status].color} variant="secondary">
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        {user.isEmailVerified ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className="text-xs">Email</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {user.twoFactorEnabled ? (
                          <Shield className="h-4 w-4 text-green-500" />
                        ) : (
                          <Shield className="h-4 w-4 text-gray-400" />
                        )}
                        <span className="text-xs">2FA</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm font-medium">{getTimeAgo(user.lastActivity)}</div>
                      <div className="text-xs text-gray-500">{user.loginCount} logins</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{formatDate(user.joinedAt)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onViewUser(user)}>View Profile</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEditUser(user)}>Edit User</DropdownMenuItem>
                        {user.status === "pending" && (
                          <DropdownMenuItem onClick={() => onResendInvite(user)}>Resend Invite</DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onSuspendUser(user)} className="text-orange-600">
                          {user.status === "suspended" ? "Unsuspend User" : "Suspend User"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDeleteUser(user)} className="text-red-600">
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
