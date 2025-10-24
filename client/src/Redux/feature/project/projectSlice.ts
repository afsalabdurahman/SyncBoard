
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {  projectResponse, ProjectType } from '../../../Admin/types/projetctTypes';
import { deleteProject, fetchProjectData,createProject,updateProjectApi } from './projectThunks';



export interface ProjectsState {
  list: ProjectType[];
  status?: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string | null;
  page:number
  rowPerPage:number
  totalItems:number
  totalPage:number

}

const initialState: ProjectsState = {
  list: [],
  status: 'idle',
  page:1,
  rowPerPage:5,
  totalItems:0,
  totalPage:0
 

};



const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
    addProject(state, action: PayloadAction<projectResponse>) {
  
      action.payload.list.map((e)=>{
         state.list.push(e);
      })
     
    },
    removeProject(state, action: PayloadAction<number | string>) {
      state.list = state.list.filter(project => project.id !== action.payload);
    },
    updateProject(state, action: PayloadAction<ProjectType>) {
      const index = state.list.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
   deleteImage(state, action: PayloadAction<string>) {
  const imageUrlToDelete = action.payload;

  state.list = state.list.map((project) => ({
    ...project,
    attachedUrl: project.attachedUrl.filter((url) => url !== imageUrlToDelete),
  }));
},
    updateProjectStatus(state, action: PayloadAction<{ id: number | string; status: ProjectType['status'] }>) {
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
        .addCase(fetchProjectData.fulfilled, (state, action: PayloadAction<projectResponse>) => {
    

          state.status = 'succeeded';
          state.list = [...action.payload.list];
          state.totalItems =action.payload.totalItems;
          state.page =Number(action.payload.currentPage);
          state.totalPage=action.payload.totalPages;
        })
        .addCase(fetchProjectData.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message || 'Failed to fetch logs';
        })
        // Delete
      .addCase(deleteProject.pending, (state) => {
        state.error = null;
        state.status="loading"
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
    
         state.status = 'succeeded';
        state.list = state.list.filter((u) => u._id !== action.payload);
      })
       .addCase(createProject.pending, (state) => {
        state.error = null;
        state.status="loading"
      })
     .addCase(createProject.fulfilled,(state,action)=>{
     
      state.list.push(action.payload)
      state.status = 'succeeded';
     })
    .addCase(updateProjectApi.fulfilled, (state, action) => {
  const updatedProject = action.payload;
  state.list = state.list.map((project) =>
    project._id === updatedProject._id ? updatedProject : project
  );
});
    },
});

export const {
  addProject,
  setPage,
  removeProject,
  updateProject,
  updateProjectStatus,
  assignUserToProject,
  unassignUserFromProject,
  deleteImage,
  
} = projectsSlice.actions;

export default projectsSlice.reducer;
