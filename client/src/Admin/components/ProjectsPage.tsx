import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../Redux/store";
import { toast, ToastContainer } from "react-toastify";
import { uploadAttachment } from "../../services/Cloudinary";
import { Suscription } from "../Pages/Suscription";
import ProjectLoader from "../../components/page-components/utility/loadingPages/ProjectLoader";
import {
  addProject,
  updateProject,
  removeProject,
  fetchProjectData,
} from "../../Redux/workspace/admin/ProjectSlice";
import api from "../../services/api";
import { AxiosResponse } from "axios";

import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
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
import apiService from "../../services/api";
import { ConfirmDialog } from "../../components/ui/DeleteAlertButton";

export function ProjectsPage() {
  const dispatch: AppDispatch = useDispatch();
  let [suscription, setSuscription] = useState(false);

  // Select Redux state directly
  const [refreshKey, setRefreshKey] = useState(0);
  const [loader, setLoader] = useState("");
  const adminId = useSelector((state: any) => state?.user?.user?._id);
  const adminName = useSelector((state: any) => state?.user?.user?.name);
  const projects = useSelector((state: any) => state.projects.list);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);
  // Fetch projects when adminId available
  useEffect(() => {
    if (adminId) {
      dispatch(fetchProjectData(adminId));
    }
  }, [dispatch, adminId, refreshKey]);

  const handleAddProject = async (projectData: Omit<Project, "id">) => {
    try {
      setLoader("Creating project ...");
      let attachedUrl = [];
     
      if (projectData.attachment) {
        for (const files of projectData.attachment) {
          let result = await uploadAttachment(files.file);
       
          attachedUrl.push(result);
        }
      }

      delete projectData.attachment;
      delete projectData._id;
      projectData = {
        ...projectData,
        projectAdminId: adminId,
        attachedUrl,
      };
      toast.success("Created project successfully");

      const response: AxiosResponse<any, any> = await api.post(
        "project/create",
        { newProject: projectData }
        // { withCredentials: true }
      );
      setLoader("");
      setRefreshKey((prev) => prev + 1);
      // After successful creation, refetch projects
      // if (adminId) {
      //   dispatch(fetchProjectData(adminId));
      // }
      // Refresh projects after adding by triggering useEffect dependency
      // This will re-fetch projects due to adminId in useEffect dependency array

    
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const handleEditProject = async (projectData: any) => {
   setLoader("Updating project ...");
   console.log(projectData,"edit updates")
   let attachedUrl=[];
   if(projectData.attachment){
    for (const files of projectData.attachment) {
            let result=  await uploadAttachment(files.file);
            console.log(result,"$$$$$$$results")
      attachedUrl.push(result)
   }}
   delete projectData.attachment;
   let id=projectData._id;
    projectData={
       ...projectData,
       projectAdminId:adminId,
       attachedUrl};
       let response = await apiService.patch(
       `project/update/${id}`,
       { editingProject: projectData }
     );
     console.log(response,"from axios")
setLoader("")
toast.success("Project updated successfully");
setRefreshKey((prev) => prev + 1);
    // try {
    // setLoader("Updating project ...")
    //  let attachedUrl=[]

    //        if(projectData.attachment){
    //    for (const files of projectData.attachment) {
    //        let result=  await uploadAttachment(files.file);
    //        console.log(result,"$$$$$$$results")
    //  attachedUrl.push(result)
    //        }
    //        }

    //  delete projectData.attachment
    // let id=projectData._id
    //  projectData={
    //   ...projectData,
    //   projectAdminId:adminId,
    //   attachedUrl}
    // let response = await apiService.put(
    //   `/api/project/update/${id}`,
    //   { editingProject: projectData }
    // );
    // setLoader("")
    // console.log(response, "Project updated successfully");
    // toast.success("Project updated successfully");
    // setRefreshKey((prev) => prev + 1);
    // console.log(refreshKey, "Refresh key after upd00000000000ate:", refreshKey);
    // } catch (error) {
    //   console.error("Error updating project:", error);
    // }
    // }
  };
  const handleDeleteProject = async (id: string) => {
    setIsDialogOpen(true);
    setDeleteProjectId(id);
   
    // You can implement delete API logic here
  };
  const handleConfirmDelete = async () => {
    try {
      let response = await apiService.delete(
        `project/delete/${deleteProjectId}`
      );
      setRefreshKey((prev) => prev + 1);
      toast.success("Project deleted successfully");
    } catch (error) {
      console.log("Error deleting project:", error);
    }
    // call your delete function here
  };
  const openAddModal = () => {
    if (projects.length > 5) {
      setSuscription(true);
    } else {
      setEditingProject(null);
      setIsModalOpen(true);
    }
  };
  console.log(editingProject, "edit$$$");
  const openEditModal = (project: Project) => {
    console.log("Editing project222222222:", project);
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
                        High
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
    </div>
  );
}
