import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../Redux/store";
import { toast, ToastContainer } from "react-toastify";
import { Suscription } from "../Pages/Suscription";
import ProjectLoader from "../../Custom/reusecomponents/ProjectLoader";
import { fetchProjectData,deleteProject,createProject,updateProjectApi } from "../../Redux/feature/project/projectThunks";
import {TablePagination} from"@mui/material"

import {findLimit} from"../../Utility/upgradeSubscription"
import { Button } from "../../Custom/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../Custom/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../Custom/ui/table";
import { Badge } from "../../Custom/ui/badge";
import { ProjectModal } from "./ProjectModal";
import {
  Edit,
  Trash2,
  Plus,
  Calendar,
  UserCog,
  User,
  Paperclip,
} from "lucide-react";
import { ConfirmDialog } from "../../Custom/ui/DeleteAlertButton";
import { useAdminId, useAdminName, usePagination, usePlankey,useProjects } from "../hooks/projectshooks";

import { ProjectFormData } from "../types/projetctTypes";
import { setPage } from "../../Redux/feature/project/projectSlice";
import { useWorkspace, useWorkspaceid, useWorkspaceSlug } from "../../Worksapce/hooks/workspacehooks";


export function ProjectsPage() {
const [loader, setLoader] = useState("");
const plankey= usePlankey()
  const adminId = useAdminId()
  const adminName = useAdminName()
  const projects=useProjects()
  const workspaceid = useWorkspaceid()

 const {page,rowPerPage,totalItems} = usePagination()



 const handleChangePage = (event, newPage) => {
   dispatch(setPage(newPage + 1));
  dispatch(fetchProjectData({ page: newPage + 1, limit: rowPerPage }));
  };

 

  const dispatch: AppDispatch = useDispatch();
  let [suscription, setSuscription] = useState(false);

const logId=useSelector((state)=>{
  return state.workspace.workspace.logId
})


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteProjectId, setDeleteProjectId] = useState<string>("");
  // Fetch projects when adminId available
 
const mylimit = findLimit(plankey)
   
useEffect(() => {
  if (adminId) {
    dispatch(fetchProjectData({ page, limit: rowPerPage }));
  }
}, [dispatch, adminId, page, rowPerPage]);

  const handleAddProject = async (projectData: Omit<ProjectFormData, "_id">) => {
       setLoader("Creating project ...");
    
    await dispatch(createProject({workspaceid,logId,projectData,adminId})).unwrap()
      dispatch(fetchProjectData({ page, limit: rowPerPage }));
    setLoader("");
       setTimeout(() => {
      toast.success("Created project successfully 🎉");
    }, 100);
     
    
  };

  const handleEditProject = async (projectData: any) => {
   setLoader("Updating project ...");

 
   let id=projectData._id;
  
await dispatch(updateProjectApi({projectId:id , projectData})).unwrap()

setLoader("")
toast.success("Project updated successfully");

  };
  const handleDeleteProject = async (id: string) => {
    setIsDialogOpen(true);
    setDeleteProjectId(id);
   
    // You can implement delete API logic here
  };
  const handleConfirmDelete = async () => {
 await dispatch(deleteProject(deleteProjectId)).unwrap()
 
 toast.success("Project deleted successfully");
dispatch(fetchProjectData({ page, limit: rowPerPage }));
  };
  const openAddModal = () => {
    if (projects.length >= mylimit.maxProjects) {
      setSuscription(true);
    } else {
      setEditingProject(null);
      setIsModalOpen(true);
    }
  };

  const openEditModal = (project: Project) => {
   
    setEditingProject(project);

    setIsModalOpen(true);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Completed":
        return "default";
      case "In Progress":
        return "secondary";
      case "Planning":
        return "outline";
      case "On Hold":
        return "destructive";
      default:
        return "outline";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };
  if (loader) {
    return <ProjectLoader title={loader} />;
  }


  return (
    <div className='flex-1 space-y-4 p-4 md:p-8 pt-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-3xl font-bold tracking-tight'>Projects</h2>
        <Button onClick={openAddModal}>
          <Plus className='mr-2 h-4 w-4' />
          Add Project
        </Button>
      </div>
      <ToastContainer position='top-center' autoClose={5000} />
      <Card>
        <CardHeader>
          <CardTitle>Active Projects</CardTitle>
          <CardDescription>
            Manage your organization's projects and assignments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>Assigned Users</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Project Manager</TableHead>
                <TableHead>Client Name</TableHead>
                <TableHead>Attachment</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects?.length > 0 ? (
                projects.map((project: Project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <div>
                        <div className='font-medium'>{project.name}</div>
                        <div className='text-sm text-muted-foreground'>
                          {project.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex flex-wrap gap-1'>
                        {project.assignedUsers
                          .filter((user: any) => user.role !== "Owner")
                          .map((user: any, index: number) => (
                            <Badge
                              key={index}
                              variant='outline'
                              className='text-xs'
                            >
                              {user.name || user}
                            </Badge>
                          ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(project.status)}>
                        {project.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-2'>
                        <Calendar className='h-4 w-4 text-muted-foreground' />
                        {formatDate(project.deadline)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant='secondary' className='text-xs'>
                        {project.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className='flex items-center gap-2 text-xs'>
                        <UserCog className='h-4 w-4' />
                        {adminName || "Project Manager Not Assigned"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className='flex items-center gap-2 text-xs'>
                        <User className='h-4 w-4' />
                        {project.clientName || "Client Name Not Provided"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-2'>
                        <Paperclip className='h-4 w-4 text-muted-foreground' />
                        {project.attachedUrl.length ? "Attached" : "No"}
                      </div>
                    </TableCell>
                    <TableCell className='text-right'>
                      <div className='flex justify-end gap-2'>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => openEditModal(project)}
                        >
                          <Edit className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => handleDeleteProject(project._id)}
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
                
              ) : (
                <TableRow>
                  <TableCell colSpan={8}>No projects found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {suscription ? (
            <Suscription isOpen={() => setSuscription(false)} />
          ) : null}
        </CardContent>
      </Card>

      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={editingProject ? handleEditProject : handleAddProject}
        project={editingProject}
        setEditproject={setEditingProject}
      />

      <ConfirmDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title='Delete Project?'
        description='This project will be permanently deleted.'
      />
  <TablePagination
       
        component="div"
        count={totalItems}
        rowsPerPage={rowPerPage||0}
        page={page-1}
        onPageChange={handleChangePage}
        
         rowsPerPageOptions={[]}
         
      />
    </div>
  );
}
