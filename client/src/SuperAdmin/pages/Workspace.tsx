
import { useEffect, useState } from "react"

import  {WorkspaceFilters}  from "../components/workspace/workspaceFilter"
import {WorkspaceStats} from "../components/workspace/workspaceState"
import { WorkspaceTable, type Workspace } from "../components/workspace/workspaceTable"
import WorkSapceDetails from "../components/workspace/WorkspaceDetailsPage"
import WorkSpaceEdit from "../components/workspace/WorkspaceEditPage"
import { downloadExcel, useGetWorkspaceCountQuery } from "../apis/fetchApi"
import { Pagination } from "@mui/material"
// Mock data

export  const  Workspaces =(props)=> {
    const [changePage,setChangePage]=useState(1)
  const {data,isLoading,refetch} = useGetWorkspaceCountQuery(changePage)

  const [details,setDetails] =useState(false)
  const [viewDetails,setViewDetails] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [planFilter, setPlanFilter] = useState("all")
  const [page,setPage]=useState("")

  const [mockWorkspaces,setWorkspace]=useState([])
  console.log(data,"data frche home")
  useEffect(() => {
    if (data?.responseDTO) {
      setWorkspace(data.responseDTO)
    }
  }, [data,page])
   if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg font-medium">Loading workspaces...</p>
      </div>
    )
  }


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
    setViewDetails(workspace)
    setDetails(true);
    setPage("details")
  }

  const handleEditWorkspace = (workspace: Workspace) => {
    console.log("Edit workspace:", workspace)
        setViewDetails(workspace)
      setDetails(true);
      setPage("edit")
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

  const handleExport = async() => {
    console.log("Export workspaces")
   const response= await downloadExcel();
 
  }

const handleChangePage = (page) => {
  setChangePage(page);
  refetch()
  };


  const handleCreateWorkspace = () => {
    console.log("Create new workspace")
    // Implement create workspace logic
  }
if(details){
  switch (page) {
    case "details":
      return<WorkSapceDetails viewDetails = {viewDetails} setViewDetails={setViewDetails} refetch={refetch} setPage={setPage} setDetails={setDetails}/>
  
      case "edit":
        return <WorkSpaceEdit viewDetails = {viewDetails}  setDetails={setDetails} refetch={refetch} setViewDetails={setViewDetails}/>

    default:
       return  <WorkSapceDetails/>
  }
 
}else{
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
        <Pagination
           component="div"
    count={Math.max(1, Math.ceil((data?.totalCount || 0) / 5))}

           // rowsPerPage={3||0}
              page={data.currentPage}
             onChange={(_, page) => handleChangePage(page)}
          //     rowsPerPageOptions={[]}
        />
      </main>
    </div>
  )
}
 
}
