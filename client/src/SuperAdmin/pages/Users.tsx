
import { useEffect, useState } from "react"
// import { Sidebar } from "../components/sidebar"
// import { Header } from "./components/header"

import { UserStats } from "../components/users/userState"
import { UserFilters } from "../components/users/userFilter"
import ProfieViewPage from"../components/users/UserProfilePage";
import ProfileEditPage from "../components/users/UserProfileEditPage"
import { UserTable, type User } from "../components/users/userTable"
import {useFetchUserPageQuery} from"../apis/fetchApi"
import { Pagination } from "@mui/material";



export const  UsersPage = () => {
    const [changePage,setChangePage]=useState(1)
  const {data,isLoading,refetch} = useFetchUserPageQuery(changePage)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")
  const [planFilter, setPlanFilter] = useState("all");
  const [page,setPage] = useState("")
  const [user,setUser]=useState()
  const [mockUsers,setMockusers]=useState([])

console.log(data,"Data Users009")

const handleChangePage = (page) => {
  setChangePage(page);
  refetch()
  };

  useEffect(() => {
    if (data?.data) {
   // refetch()
      setMockusers(data.data)
    }
  }, [data,page])
   if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg font-medium">Loading workspaces...</p>
      </div>
    )
  }


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
    suspendedUsers: mockUsers.filter((u) => u.status === "inactive").length,
    // pendingUsers: mockUsers.filter((u) => u.status === "pending").length,
  }

  const handleViewUser = (user: User) => {
    console.log("View user:", user)
    setUser(user)
    setPage("view")
    // Implement view user logic
  }

  const handleEditUser = (user: User) => {
    console.log("Edit user:", user)
      setUser(user)
    setPage("edit")
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

if(page){
  switch (page) {
    case "view":
      return <ProfieViewPage setPage={setPage} user={user}  />
      case "edit":
        return <ProfileEditPage  setPage={setPage} user={user} refetch={refetch} setUser={setUser}/>
  
    default:
      break;
  }
}else{




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
            <Pagination
                     component="div"
              count={Math.max(1, Math.ceil((data?.totalCount || 0) / 5))}
                 page={data.currentPage}
                       onChange={(_, page) => handleChangePage(page)}
                 
                  />
      </main>
    </div>
  )
}
}