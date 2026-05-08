import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/store";

import { Suscription } from "../Pages/Suscription";
import ProjectLoader from "../../Custom/reusecomponents/ProjectLoader";

import {
  fetchProjectData,
  deleteProject,
  createProject,
  updateProjectApi,
} from "../../Redux/feature/project/projectThunks";

import { setPage } from "../../Redux/feature/project/projectSlice";

import { TablePagination } from "@mui/material";
import { findLimit } from "../../Utility/upgradeSubscription";

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

import {
  useAdminId,
  useAdminName,
  usePagination,
  usePlankey,
  useProjects,
} from "../hooks/projectshooks";

import { useWorkspaceid } from "../../Worksapce/hooks/workspacehooks";

import { ProjectFormData } from "../types/projetctTypes";
import { toast } from "react-toastify";
import { setTitle, toggleForward } from "../../Redux/feature/ForwardSlice";

export default function ProjectsPage() {
  const dispatch = useDispatch<AppDispatch>();

  const plankey = usePlankey();
  const adminId = useAdminId();
  const adminName = useAdminName();
  const projects = useProjects();
  const workspaceid = useWorkspaceid();

  const { page, rowPerPage, totalItems } = usePagination();

  const logId = useSelector((state: RootState) => state.workspace.workspace.logId);

  const [loader, setLoader] = useState("");
  const [suscription, setSuscription] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteProjectId, setDeleteProjectId] = useState("");

  const mylimit = findLimit(plankey);

  useEffect(() => {
    if (adminId) {
      dispatch(
        fetchProjectData({
          workspaceId: workspaceid,
          page,
          limit: rowPerPage,
        })
      );
    }
  }, [dispatch, adminId, page, rowPerPage, workspaceid]);

  const handleChangePage = (_: unknown, newPage: number) => {
    dispatch(setPage(newPage + 1));
    dispatch(
      fetchProjectData({
        workspaceId: workspaceid,
        page: newPage + 1,
        limit: rowPerPage,
      })
    );
  };

  const handleAddProject = async (projectData: Omit<ProjectFormData, "_id">) => {
    try {
      setLoader("Creating project ...");

      await dispatch(
        createProject({ workspaceid, logId, projectData, adminId })
      ).unwrap();

      dispatch(
        fetchProjectData({
          workspaceId: workspaceid,
          page,
          limit: rowPerPage,
        })
      );
       dispatch(setTitle("projects"))
  dispatch(toggleForward())
      toast.success("Created project successfully 🎉");
      setIsModalOpen(false);
    } catch (error: unknown) {
    
      toast.error((error as Error).message);
    } finally {
      setLoader("");
    }
   
  };

  const handleEditProject = async (projectData: ProjectFormData) => {
    try {
      setLoader("Updating project ...");

      await dispatch(
        updateProjectApi({
          projectId: projectData._id,
          projectData,
        })
      ).unwrap();

      toast.success("Project updated successfully");
      setIsModalOpen(false);
    } catch (error: unknown) {
      toast.error((error as Error).message);
    } finally {
      setLoader("");
    }
  };

  const handleDeleteProject = (id: string) => {
    setDeleteProjectId(id);
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    await dispatch(deleteProject(deleteProjectId)).unwrap();

    toast.success("Project deleted successfully");

    dispatch(
      fetchProjectData({
        workspaceId: workspaceid,
        page,
        limit: rowPerPage,
      })
    );
    dispatch(setTitle("projects"))
     dispatch(toggleForward())
  };

  const openAddModal = () => {
    if (projects.length >= mylimit.maxProjects) {
      setSuscription(true);
      return;
    }

    setEditingProject(null);
    setIsModalOpen(true);
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

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString();

  if (loader) return <ProjectLoader title={loader} />;

  return (
    
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {projects.length==0?       <div className="flex items-center justify-center h-[60vh] bg-gray-50 border border-dashed border-gray-200 rounded-xl">

  
  <div className="text-center max-w-xl w-full px-6">
    
    {/* Illustration Container */}
    <div className="mx-auto w-24 h-24 rounded-2xl bg-white border border-gray-200 flex items-center justify-center shadow-sm">
      <svg
        className="w-12 h-12 text-indigo-600"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-6h13M9 11l-4 4m0 0l4 4m-4-4h13" />
      </svg>
    </div>

    {/* Heading */}
    <h2 className="mt-6 text-2xl font-semibold text-gray-900">
      Create your first project
    </h2>

    {/* Description */}
    <p className="mt-2 text-sm text-gray-500 leading-relaxed">
      Projects help you organize tasks, track progress, and collaborate with your team in one place.
    </p>

    {/* Actions */}
    <div className="mt-6 flex items-center justify-center gap-3">
      
      {/* Primary CTA */}
      <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg shadow hover:bg-indigo-700 transition" onClick={openAddModal}>
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        New Project
      </button>

      {/* Secondary CTA */}
      <button className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition">
        Learn more
      </button>

    </div>

    {/* Bottom Hint */}
    <p className="mt-6 text-xs text-gray-400">
      Tip: You can invite team members after creating a project.
    </p>

  </div>
</div>:
      <div className="wrap">

      
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Projects</h2>

        <Button onClick={openAddModal}>
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </div>

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
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {projects.length ? (
                projects.map((project: Project) => (
                  <TableRow key={project._id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{project.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {project.description}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                       {project.assignedUsers?.length > 0 &&
  project.assignedUsers.map((user, i) => (
    <Badge key={i} variant="outline" className="text-xs">
      {user}
    </Badge>
  ))
}
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(project.status)}>
                        {project.status}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {formatDate(project.deadline)}
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant="secondary">{project.priority}</Badge>
                    </TableCell>

                    <TableCell>
                      <span className="flex items-center gap-2 text-xs">
                        <UserCog className="h-4 w-4" />
                        {adminName || "Not Assigned"}
                      </span>
                    </TableCell>

                    <TableCell>
                      <span className="flex items-center gap-2 text-xs">
                        <User className="h-4 w-4" />
                        {project.clientName || "Not Provided"}
                      </span>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Paperclip className="h-4 w-4 text-muted-foreground" />
                        {project.attachedUrl?.length ? "Attached" : "No"}
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(project)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteProject(project._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9}>No projects found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {suscription && (
            <Suscription isOpen={() => setSuscription(false)} />
          )}
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
        title="Delete Project?"
        description="This project will be permanently deleted."
      />

      <TablePagination
        component="div"
        count={totalItems}
        rowsPerPage={rowPerPage || 0}
        page={page - 1}
        onPageChange={handleChangePage}
        rowsPerPageOptions={[]}
      />
      </div>}
      <ProjectModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onSubmit={editingProject ? handleEditProject : handleAddProject}
      project={editingProject}
      setEditproject={setEditingProject}
      
    />

    {/* ✅ ALSO KEEP DIALOG OUTSIDE */}
    <ConfirmDialog
      open={isDialogOpen}
      onClose={() => setIsDialogOpen(false)}
      onConfirm={handleConfirmDelete}
      title="Delete Project?"
      description="This project will be permanently deleted."
    />
    </div>
  );
}