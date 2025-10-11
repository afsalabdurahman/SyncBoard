import { createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../services/api";
import { Project } from "../workspace/admin/ProjectSlice";
export const fetchProjectData = createAsyncThunk('/adminProjectData/fetchProjects', async (AdminId:string,) => {
  const response = await apiService.get<Project[]>('project/projects',{AdminId}); // Adjust endpoint
  console.log(response,"axios project repos")
  return response?.data;
});