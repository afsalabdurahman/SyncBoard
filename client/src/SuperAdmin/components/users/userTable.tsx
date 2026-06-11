import {  Mail, Calendar, Shield, AlertTriangle, CheckCircle, Clock, XCircle, Eye, Pencil } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../../../Custom/ui/avatar"
import { Badge } from "../../../Custom/ui/badge"
import { Button } from "../../../Custom/ui/button"
import { Card, CardContent } from "../../../Custom/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../Custom/ui/table"

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
  // suspended: { color: "bg-red-100 text-red-800", icon: AlertTriangle },
  // pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
}

const roleColors = {
  owner: "bg-purple-100 text-purple-800",
  admin: "bg-blue-100 text-blue-800",
  member: "bg-green-100 text-green-800",
  guest: "bg-gray-100 text-gray-800",
}



export const UserTable = ({
  users,
  onViewUser,
  onEditUser,

}: UserTableProps) => {
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
      <CardContent className="p-5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
            
              
             
             
             
             
              <TableHead className="w-32 text-right">Actions</TableHead> {/* wider for buttons */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => {
              const StatusIcon = statusConfig[user.status]?.icon || Clock // fallback icon
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
               
               
                
                
               
              
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* View Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-3 text-black hover:text-black hover:bg-gray-100 active:bg-gray-200"
                        onClick={(e) => {
                          e.stopPropagation()
                          onViewUser(user)
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1 text-black" />
                        View
                      </Button>

                      {/* Edit Button */}
                     
                      
                       

                      {/* Optional: Add more buttons later, e.g. */}
                      {/* <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">Suspend</Button> */}
                    </div>
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