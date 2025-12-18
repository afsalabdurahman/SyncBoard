"use client"

import { MoreHorizontal, Mail, Calendar, Shield } from "lucide-react"
import { Card, CardContent } from "../../../Custom/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../Custom/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "../../../Custom/ui/avatar"
import { Badge } from "../../../Custom/ui/badge"
import { Button } from "../../../Custom/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../Custom/ui/dropdown-menu"

export type MemberRole = "owner" | "admin" | "member" | "guest"
export type MemberStatus = "active" | "block" | "suspended" | "deleted"

export interface WorkspaceMember {
  _id: string
  name: string
  email: string
  avatar?: string
  role?: MemberRole
  status?: MemberStatus
  createdAt?: string
  updatedAt?: string
  isBlock?:boolean
  isDeleted?:boolean
  twoFactorEnabled?: boolean
  isEmailVerified?: boolean
}

const roleColors: Record<MemberRole, string> = {
  owner: "bg-purple-100 text-purple-800",
  admin: "bg-blue-100 text-blue-800",
  member: "bg-green-100 text-green-800",
  guest: "bg-gray-100 text-gray-800",
}

const statusColors: Record<MemberStatus, string> = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
  suspended: "bg-red-100 text-red-800",
  pending: "bg-yellow-100 text-yellow-800",
}

export function WorkspaceMembersTable({
  members,
  onView,
  onChangeRole,
  onSuspend,
  onRemove,
}: {
  members: WorkspaceMember[]
  onView: (m: WorkspaceMember) => void
  onChangeRole: (m: WorkspaceMember) => void
  onSuspend: (m: WorkspaceMember) => void
  onRemove: (m: WorkspaceMember) => void
}) {
  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Security</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((m) => (
              <TableRow key={m._id} className="hover:bg-gray-50">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={m.avatar || "/placeholder.svg?height=40&width=40&query=user-avatar"}
                        alt={m.name}
                      />
                      <AvatarFallback>
                        {m.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="font-medium text-gray-900 truncate">{m.name}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 truncate">
                        <Mail className="h-3 w-3" />
                        <span>{m.email}</span>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={roleColors[m.role]}>
                    {m.role.charAt(0).toUpperCase() + m.role.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                {m.isBlock ||m.isDeleted ?   <Badge variant="secondary" className={statusColors["active"]}>
                    Blocked
                  </Badge>:  <Badge variant="secondary" className={statusColors["block"]}>
                    Active
                  </Badge> }
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1">
                      <Shield className={`h-3.5 w-3.5 ${m.twoFactorEnabled ? "text-green-600" : "text-gray-400"}`} />
                      <span>2FA</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Shield className={`h-3.5 w-3.5 ${m.isEmailVerified ? "text-green-600" : "text-red-500"}`} />
                      <span>Email</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                   // <span className="text-sm">{fmtDate(m.createdAt)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{fmtDate(m.updatedAt)}</div>
                </TableCell>
                <TableCell>
                  {/* <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger> */}
                    {/* <DropdownMenuContent align="end"> */}
                      {/* <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onView(m)}>View Profile</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onChangeRole(m)}>Change Role</DropdownMenuItem> */}
                      {/* <DropdownMenuItem onClick={() => onSuspend(m)}> */}
                        {/* {m.status === "suspended" ? "Unsuspend" : "Suspend"} */}
                      {/* </DropdownMenuItem> */}
                      <DropdownMenuSeparator />
                      {/* <DropdownMenuItem onClick={() => onRemove(m)} className="text-red-600">
                        Remove from Workspace
                      </DropdownMenuItem> */}
                    {/* </DropdownMenuContent> */}
                  {/* </DropdownMenu> */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
