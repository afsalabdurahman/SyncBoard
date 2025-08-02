"use client"

import { useState } from "react"
import { Sidebar } from "../components/Sidebar"
import { Header } from "../components/Header"
import  {WorkspaceFilters}  from "../components/workspace/workspaceFilter"
import {WorkspaceStats} from "../components/workspace/workspaceState"
import { WorkspaceTable, type Workspace } from "../components/workspace/workspaceTable"

// Mock data
const mockWorkspaces: Workspace[] = [
  {
    id: "ws_1234567890",
    name: "Acme Corporation",
    owner: {
      name: "John Smith",
      email: "john@acme.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    plan: "enterprise",
    status: "active",
    members: 245,
    createdAt: "2023-01-15",
    lastActivity: "2024-01-02",
    monthlyRevenue: 2499,
    storage: { used: 85, limit: 100 },
  },
  {
    id: "ws_2345678901",
    name: "TechStart Inc",
    owner: {
      name: "Sarah Johnson",
      email: "sarah@techstart.io",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    plan: "pro",
    status: "active",
    members: 42,
    createdAt: "2023-03-22",
    lastActivity: "2024-01-01",
    monthlyRevenue: 299,
    storage: { used: 12, limit: 50 },
  },
  {
    id: "ws_3456789012",
    name: "Design Studio",
    owner: {
      name: "Mike Chen",
      email: "mike@designstudio.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    plan: "basic",
    status: "trial",
    members: 8,
    createdAt: "2023-12-01",
    lastActivity: "2023-12-28",
    monthlyRevenue: 0,
    storage: { used: 2, limit: 10 },
  },
  {
    id: "ws_4567890123",
    name: "Marketing Agency",
    owner: {
      name: "Emily Davis",
      email: "emily@marketing.co",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    plan: "pro",
    status: "suspended",
    members: 23,
    createdAt: "2023-06-10",
    lastActivity: "2023-11-15",
    monthlyRevenue: 299,
    storage: { used: 35, limit: 50 },
  },
  {
    id: "ws_5678901234",
    name: "Startup Hub",
    owner: {
      name: "David Wilson",
      email: "david@startuphub.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    plan: "enterprise",
    status: "active",
    members: 156,
    createdAt: "2023-02-28",
    lastActivity: "2024-01-02",
    monthlyRevenue: 2499,
    storage: { used: 67, limit: 100 },
  },
]

export  const  Workspaces =()=> {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [planFilter, setPlanFilter] = useState("all")

  // Filter workspaces based on search and filters
  const filteredWorkspaces = mockWorkspaces.filter((workspace) => {
    const matchesSearch =
      workspace.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workspace.owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workspace.owner.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || workspace.status === statusFilter
    const matchesPlan = planFilter === "all" || workspace.plan === planFilter

    return matchesSearch && matchesStatus && matchesPlan
  })

  // Calculate stats
  const stats = {
    totalWorkspaces: mockWorkspaces.length,
    activeWorkspaces: mockWorkspaces.filter((w) => w.status === "active").length,
    totalUsers: mockWorkspaces.reduce((sum, w) => sum + w.members, 0),
    monthlyRevenue: mockWorkspaces.reduce((sum, w) => sum + w.monthlyRevenue, 0),
  }

  const handleViewWorkspace = (workspace: Workspace) => {
    console.log("View workspace:", workspace)
    // Implement view workspace logic
  }

  const handleEditWorkspace = (workspace: Workspace) => {
    console.log("Edit workspace:", workspace)
    // Implement edit workspace logic
  }

  const handleSuspendWorkspace = (workspace: Workspace) => {
    console.log("Suspend workspace:", workspace)
    // Implement suspend workspace logic
  }

  const handleDeleteWorkspace = (workspace: Workspace) => {
    console.log("Delete workspace:", workspace)
    // Implement delete workspace logic
  }

  const handleExport = () => {
    console.log("Export workspaces")
    // Implement export logic
  }

  const handleCreateWorkspace = () => {
    console.log("Create new workspace")
    // Implement create workspace logic
  }

  return (
    <div className="min-h-screen bg-gray-50">
      

      <main className={`transition-all duration-300 pt-16 ${sidebarCollapsed ? "ml-16" : "ml-64"}`}>
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Workspaces</h1>
            <p className="text-gray-600 mt-1">Manage customer workspaces, plans, and billing</p>
          </div>

          {/* Stats */}
          <WorkspaceStats {...stats} />

          {/* Filters */}
          <WorkspaceFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            planFilter={planFilter}
            onPlanFilterChange={setPlanFilter}
            onExport={handleExport}
            onCreateWorkspace={handleCreateWorkspace}
          />

          {/* Results count */}
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Showing {filteredWorkspaces.length} of {mockWorkspaces.length} workspaces
            </p>
          </div>

          {/* Workspaces Table */}
          <WorkspaceTable
            workspaces={filteredWorkspaces}
            onViewWorkspace={handleViewWorkspace}
            onEditWorkspace={handleEditWorkspace}
            onSuspendWorkspace={handleSuspendWorkspace}
            onDeleteWorkspace={handleDeleteWorkspace}
          />
        </div>
      </main>
    </div>
  )
}
