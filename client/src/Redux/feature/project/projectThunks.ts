import { createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../../Services/apiServices/apiService";


import { ProjectType } from "../../../Admin/types/projetctTypes"
import { fetchProjects, } from "../../../Admin/apis/projectApi";
import { ProjectsState } from "./projectSlice";
import { ProjectFormData } from "../../../Admin/types/projetctTypes"
import { uploadAttachment } from '../../../Services/Cloudinary';

export const fetchProjectData = createAsyncThunk('/adminProjectData/fetchProjects', async ({ workspaceId, page, limit }: {workspaceId:string, page: number, limit: number }) => {
  try {


    const response = await apiService.get(`project/myprojects/${workspaceId}?page=${page}&limit=${limit}`);

    return {
      list: response.data.items,
      totalPages: response.data.totalPages,
      currentPage: response.data.currentPage,
      totalItems: response.data.totalItems
    };


  } catch (error) {
    console.log(error)
  }
});
export const deleteProject = createAsyncThunk("adminProjectData/delete", async (projectId: string, { rejectWithValue }) => {
  try {
    const response = await apiService.delete(`project/delete/${projectId}`);

    if (response.status == 200) {
      return projectId
    } else {
      return rejectWithValue(response.data.message || "Failed to delete user.");

    }
  } catch (error) {
    return rejectWithValue(
      error.response?.data?.message ||
      error.message ||
      "Server error. Try again later."
    );
  }


})
export const createProject = createAsyncThunk("adminProjectData/create", async ({
  workspaceid,
  logId,
  projectData,
  adminId
}: {
  workspaceid: string;
  logId: string;
  projectData: Omit<ProjectFormData, "_id">;
  adminId: string
}, { rejectWithValue }) => {
  try {

    const attachedUrl: string[] = [];
    if (projectData.attachment) {
      for (const file of projectData.attachment) {
        console.log(file,"filesss")
        const result = await uploadAttachment(file.file);

        attachedUrl.push(result);
      }
    }

    const newProject = {
      ...projectData,
      projectAdminId: adminId,
      attachedUrl,
    };
    delete newProject.attachment;
    delete newProject._id;
    const response = await apiService.post(`project/create/${workspaceid}?activityId=${logId}`, {
      newProject,
    });

    if (response.status == 201) {

      return response.data.message.project
    } else {
      return rejectWithValue(response.data.message || "Failed to Create Project.");
    }

  } catch (error) {
    return rejectWithValue("Internal server error");


  }
})

export const updateProjectApi = createAsyncThunk("adminProjectData/update", async ({ projectId, projectData }: { projectId: string, projectData: ProjectFormData }) => {


  const attachedUrl: string[] = [];
  if (projectData.attachment) {
    for (const file of projectData.attachment) {
      const result = await uploadAttachment(file.file);
      attachedUrl.push(result);
    }
  }
  projectData.url?.forEach((url) => {
    attachedUrl.push(url)
  })
  const updatedProject = {
    ...projectData,
    attachedUrl,
  };
  delete updatedProject.attachment;

  const response = await apiService.patch(`project/update/${projectId}`, {
    editingProject: updatedProject,
  });
  if (response.status == 200) {
    return response.data.project
  }
  console.log(response, "updated project reposnse")
})
