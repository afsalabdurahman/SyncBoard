
import { useEffect, useState } from "react"

import  {WorkspaceFilters}  from "../components/workspace/workspaceFilter"
import {WorkspaceStats} from "../components/workspace/workspaceState"
import { WorkspaceTable, type Workspace } from "../components/workspace/workspaceTable"
import WorkSapceDetails from "../components/workspace/WorkspaceDetailsPage"
import WorkSpaceEdit from "../components/workspace/WorkspaceEditPage"
import { downloadExcel, useGetWorkspaceCountQuery } from "../apis/fetchApi"
import { Pagination } from "@mui/material"
import { useDebounce } from "../../Custom/hooks/useDebounce"
import { toast } from "react-toastify"
// Mock data

export  const  Workspaces =(props)=> {
    const [searchTerm, setSearchTerm] = useState("")
    const [changePage,setChangePage]=useState(1)
    const debouncedSearch = useDebounce(searchTerm, 500);
     const [statusFilter, setStatusFilter] = useState("all")
     const [planFilter, setPlanFilter] = useState("all")
const { data, isLoading,refetch  } = useGetWorkspaceCountQuery({
  page: changePage,
  query: debouncedSearch,
  filter:statusFilter,
  plan:planFilter
})
  const [details,setDetails] =useState(false)
  const [viewDetails,setViewDetails] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

 
  
  const [page,setPage]=useState("")


  const [Workspaces,setWorkspace]=useState([])
 useEffect(() => {
  if (data?.responseDTO) {
    setWorkspace(data.responseDTO)
  }
}, [data,statusFilter])
useEffect(() => {
  setChangePage(1)
}, [debouncedSearch, statusFilter, planFilter])
   if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg font-medium">Loading workspaces...</p>
      </div>
    )
  }


  
console.log(Workspaces,"Mocle ResponseData")
  // Calculate stats
  const stats = {
    totalWorkspaces: Workspaces.length,
    activeWorkspaces: Workspaces.filter((w) => w.status === "Active").length,
    totalUsers: Workspaces.reduce((sum, w) => sum + w.members, 0),
    monthlyRevenue: Workspaces.reduce((sum, w) => sum + w.monthlyRevenue, 0),
  }

  const handleViewWorkspace = (workspace: Workspace) => {
    // Implement view workspace logic
    setViewDetails(workspace)
    setDetails(true);
    setPage("details")
  }

  const handleEditWorkspace = (workspace: Workspace) => {
        setViewDetails(workspace)
      setDetails(true);
      setPage("edit");
    
    // Implement edit workspace logic
  }

  const handleSuspendWorkspace = (workspace: Workspace) => {
    // Implement suspend workspace logic
  }

  const handleDeleteWorkspace = (workspace: Workspace) => {
    // Implement delete workspace logic
  }

  const handleExport = async() => {
   const response= await downloadExcel();
 
  }

const handleChangePage = (page) => {
  setChangePage(page);
   refetch()
  };


  const handleCreateWorkspace = () => {
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
              Showing {Workspaces.length} of {Workspaces.length} workspaces
            </p>
          </div>

          {/* Workspaces Table */}
          {Workspaces.length?<WorkspaceTable
            workspaces={Workspaces}
            onViewWorkspace={handleViewWorkspace}
            onEditWorkspace={handleEditWorkspace}
            onSuspendWorkspace={handleSuspendWorkspace}
            onDeleteWorkspace={handleDeleteWorkspace}
          />:null}
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
