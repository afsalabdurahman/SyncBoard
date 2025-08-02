"use client"

import { useState } from "react"
// import { Sidebar } from "../components/sidebar"
// import { Header } from "./components/header"
import { UserStats } from "../components/users/userState"
import { UserFilters } from "../components/users/userFilter"
import { UserTable, type User } from "../components/users/userTable"

// Mock data
const mockUsers: User[] = [
  {
    id: "usr_1234567890",
    name: "John Smith",
    email: "john@acme.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "owner",
    status: "active",
    workspace: { name: "Acme Corporation", plan: "enterprise" },
    joinedAt: "2023-01-15",
    lastActivity: "2024-01-02T10:30:00Z",
    loginCount: 245,
    isEmailVerified: true,
    twoFactorEnabled: true,
  },
  {
    id: "usr_2345678901",
    name: "Sarah Johnson",
    email: "sarah@techstart.io",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "admin",
    status: "active",
    workspace: { name: "TechStart Inc", plan: "pro" },
    joinedAt: "2023-03-22",
    lastActivity: "2024-01-01T15:45:00Z",
    loginCount: 156,
    isEmailVerified: true,
    twoFactorEnabled: false,
  },
  {
    id: "usr_3456789012",
    name: "Mike Chen",
    email: "mike@designstudio.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "member",
    status: "active",
    workspace: { name: "Design Studio", plan: "basic" },
    joinedAt: "2023-12-01",
    lastActivity: "2023-12-30T09:15:00Z",
    loginCount: 42,
    isEmailVerified: false,
    twoFactorEnabled: false,
  },
  {
    id: "usr_4567890123",
    name: "Emily Davis",
    email: "emily@marketing.co",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "admin",
    status: "suspended",
    workspace: { name: "Marketing Agency", plan: "pro" },
    joinedAt: "2023-06-10",
    lastActivity: "2023-11-15T14:20:00Z",
    loginCount: 89,
    isEmailVerified: true,
    twoFactorEnabled: true,
  },
  {
    id: "usr_5678901234",
    name: "David Wilson",
    email: "david@startuphub.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "owner",
    status: "active",
    workspace: { name: "Startup Hub", plan: "enterprise" },
    joinedAt: "2023-02-28",
    lastActivity: "2024-01-02T11:00:00Z",
    loginCount: 312,
    isEmailVerified: true,
    twoFactorEnabled: true,
  },
  {
    id: "usr_6789012345",
    name: "Lisa Thompson",
    email: "lisa@newcompany.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "member",
    status: "pending",
    workspace: { name: "New Company", plan: "basic" },
    joinedAt: "2023-12-28",
    lastActivity: "2023-12-28T16:30:00Z",
    loginCount: 0,
    isEmailVerified: false,
    twoFactorEnabled: false,
  },
  {
    id: "usr_7890123456",
    name: "Alex Rodriguez",
    email: "alex@freelance.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "guest",
    status: "inactive",
    workspace: { name: "Freelance Work", plan: "basic" },
    joinedAt: "2023-08-15",
    lastActivity: "2023-10-20T08:45:00Z",
    loginCount: 23,
    isEmailVerified: true,
    twoFactorEnabled: false,
  },
]

export const  UsersPage = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")
  const [planFilter, setPlanFilter] = useState("all")

  // Filter users based on search and filters
  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.workspace.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesPlan = planFilter === "all" || user.workspace.plan === planFilter

    return matchesSearch && matchesStatus && matchesRole && matchesPlan
  })

  // Calculate stats
  const stats = {
    totalUsers: mockUsers.length,
    activeUsers: mockUsers.filter((u) => u.status === "active").length,
    suspendedUsers: mockUsers.filter((u) => u.status === "suspended").length,
    pendingUsers: mockUsers.filter((u) => u.status === "pending").length,
  }

  const handleViewUser = (user: User) => {
    console.log("View user:", user)
    // Implement view user logic
  }

  const handleEditUser = (user: User) => {
    console.log("Edit user:", user)
    // Implement edit user logic
  }

  const handleSuspendUser = (user: User) => {
    console.log("Suspend user:", user)
    // Implement suspend user logic
  }

  const handleDeleteUser = (user: User) => {
    console.log("Delete user:", user)
    // Implement delete user logic
  }

  const handleResendInvite = (user: User) => {
    console.log("Resend invite:", user)
    // Implement resend invite logic
  }

  const handleExport = () => {
    console.log("Export users")
    // Implement export logic
  }

  const handleInviteUser = () => {
    console.log("Invite new user")
    // Implement invite user logic
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <Header sidebarCollapsed={sidebarCollapsed} /> */}

      <main className={`transition-all duration-300 pt-16 ${sidebarCollapsed ? "ml-16" : "ml-64"}`}>
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Users</h1>
            <p className="text-gray-600 mt-1">Manage user accounts, permissions, and security settings</p>
          </div>

          {/* Stats */}
          <UserStats {...stats} />

          {/* Filters */}
          <UserFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            roleFilter={roleFilter}
            onRoleFilterChange={setRoleFilter}
            planFilter={planFilter}
            onPlanFilterChange={setPlanFilter}
            onExport={handleExport}
            onInviteUser={handleInviteUser}
            totalUsers={mockUsers.length}
            filteredCount={filteredUsers.length}
          />

          {/* Users Table */}
          <UserTable
            users={filteredUsers}
            onViewUser={handleViewUser}
            onEditUser={handleEditUser}
            onSuspendUser={handleSuspendUser}
            onDeleteUser={handleDeleteUser}
            onResendInvite={handleResendInvite}
          />
        </div>
      </main>
    </div>
  )
}
