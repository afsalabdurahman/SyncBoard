
import { createSlice, PayloadAction,createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../../services/api';


interface Project {
  id?: number | string;
  name: string;
  description: string;
  assignedUsers: string[];
  deadline: string; // ISO date string
  status: 'Planning' | 'In Progress' | 'Completed' | 'On Hold';
  preiority?: 'Low' | 'Medium' |'High';
  clientName?:string;
    adminProjects?:any;

}

interface ProjectsState {
  list: Project[];
  status?: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string | null;

}

const initialState: ProjectsState = {
  list: [],
  status: 'idle',
};

export const fetchProjectData = createAsyncThunk('/adminProjectData/fetchProjects', async (AdminId:string) => {
  const response = await apiService.get<Project[]>('project/projects',{AdminId}); // Adjust endpoint
  console.log(response,"axios project repos")
  return response?.data;
});
//
const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    addProject(state, action: PayloadAction<Project>) {
      console.log("Adding project:", action.payload);
      state.list.push(action.payload);
    },
    removeProject(state, action: PayloadAction<number | string>) {
      state.list = state.list.filter(project => project.id !== action.payload);
    },
    updateProject(state, action: PayloadAction<Project>) {
      const index = state.list.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    deleteImage(state,action : PayloadAction<string>){
    state.list=state.filter((project)=>{
      return project.attachedUrl!==action.payload
    })
    },
    updateProjectStatus(state, action: PayloadAction<{ id: number | string; status: Project['status'] }>) {
      const project = state.list.find(p => p.id === action.payload.id);
      if (project) {
        project.status = action.payload.status;
      }
    },
    assignUserToProject(state, action: PayloadAction<{ id: number | string; user: string }>) {
      const project = state.list.find(p => p.id === action.payload.id);
      if (project && !project.assignedUsers.includes(action.payload.user)) {
        project.assignedUsers.push(action.payload.user);
      }
    },
    unassignUserFromProject(state, action: PayloadAction<{ id: number | string; user: string }>) {
      const project = state.list.find(p => p.id === action.payload.id);
      if (project) {
        project.assignedUsers = project.assignedUsers.filter(u => u !== action.payload.user);
      }
    },
    // remoeUrl(state,action:)
  },
  //Exra reducers...
  extraReducers: builder => {
      builder
        .addCase(fetchProjectData.pending, state => {
          state.status = 'loading';
        })
        .addCase(fetchProjectData.fulfilled, (state, action: PayloadAction<Project[]>) => {
          state.status = 'succeeded';
          state.list = action.payload
        })
        .addCase(fetchProjectData.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message || 'Failed to fetch logs';
        });
    },
});

export const {
  addProject,
  removeProject,
  updateProject,
  updateProjectStatus,
  assignUserToProject,
  unassignUserFromProject,
  deleteImage
} = projectsSlice.actions;

export default projectsSlice.reducer;
