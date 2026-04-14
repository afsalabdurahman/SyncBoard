

import {  Users, DollarSign, AlertTriangle,Pencil,Eye } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../../../Custom/ui/avatar"
import { Badge } from "../../../Custom/ui/badge"
import { Button } from "../../../Custom/ui/button"
import { Card, CardContent } from "../../../Custom/ui/card"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../Custom/ui/table"

export interface Workspace {
  id: string
  name: string
  owner: {
    name: string
    email: string
    avatar?: string
  }
  plan: "basic" | "pro" | "enterprise"
  status: "active" | "suspended" | "trial" | "inactive"
  members: number
  createdAt: string
  lastActivity: string
  monthlyRevenue: number
  storage: {
    used: number
    limit: number
  }
}

interface WorkspaceTableProps {
  workspaces: Workspace[]
  onViewWorkspace: (workspace: Workspace) => void
  onEditWorkspace: (workspace: Workspace) => void
  onSuspendWorkspace: (workspace: Workspace) => void
  onDeleteWorkspace: (workspace: Workspace) => void
}

const statusColors = {
  active: "bg-green-100 text-green-800",
  suspended: "bg-red-100 text-red-800",
  trial: "bg-blue-100 text-blue-800",
  inactive: "bg-gray-100 text-gray-800",
}

const planColors = {
  basic: "bg-gray-100 text-gray-800",
  pro: "bg-purple-100 text-purple-800",
  enterprise: "bg-orange-100 text-orange-800",
}

export const WorkspaceTable = ({
  workspaces,
  onViewWorkspace,
  onEditWorkspace,

}: WorkspaceTableProps) =>{


  const formatStorage = (used: number, limit: number) => {
    const percentage = (used / limit) * 100
    return {
      text: `${used}GB / ${limit}GB`,
      percentage,
      isNearLimit: percentage > 80,
    }
  }
const uniqueWorkspaces = workspaces.filter((workspace, index, arr) =>
  index === arr.findIndex(w => w.id === workspace.id)
)

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Workspace</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>Storage</TableHead>
             
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {uniqueWorkspaces.map((workspace) => {
              const storage = formatStorage(workspace.storage.used, workspace.storage.limit)
              return (
                <TableRow key={workspace.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">{workspace.name}</div>
                      <div className="text-sm text-gray-500">ID: {workspace.id}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                     <Avatar className="h-8 w-8">
  <AvatarImage
    src={workspace?.owner?.avatar || "/placeholder.svg"}
    alt={workspace?.owner?.name || "User"}
  />

  <AvatarFallback>
    {workspace?.owner?.name
      ? workspace.owner.name
          .split(" ")
          .map((n) => n[0])
          .join("")
      : "?"}
  </AvatarFallback>
</Avatar>

                      <div>
                        <div className="font-medium text-gray-900">{workspace.owner.name}</div>
                        <div className="text-sm text-gray-500">{workspace.owner.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {workspace.plan?
   <Badge className={planColors[workspace.plan]} variant="secondary">
                      {workspace.plan.charAt(0).toUpperCase() + workspace.plan.slice(1)}
                    </Badge>
                    :"free"}
                 
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[workspace.status]} variant="secondary">
                      {workspace.status.charAt(0).toUpperCase() + workspace.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span>{workspace.members}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <span>${workspace.monthlyRevenue}/mo</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="text-sm">{storage.text}</div>
                      {storage.isNearLimit && <AlertTriangle className="h-4 w-4 text-orange-500" />}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                      <div
                        className={`h-1.5 rounded-full ${storage.isNearLimit ? "bg-orange-500" : "bg-blue-500"}`}
                        style={{ width: `${Math.min(storage.percentage, 100)}%` }}
                      ></div>
                    </div>
                  </TableCell>
                
 <TableCell className="text-right w-20">
  <div className="flex items-center justify-end gap-1 opacity-60 hover:opacity-100 transition-opacity">
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      onClick={(e) => {
        e.stopPropagation();
        onViewWorkspace(workspace);
      }}
      title="View Details"
    >
      <Eye className="h-4 w-4 text-black" />
    </Button>

    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      onClick={(e) => {
        e.stopPropagation();
        onEditWorkspace(workspace);
      }}
      title="Edit Workspace"
    >
      <Pencil className="h-4 w-4 text-black" />
    </Button>
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
