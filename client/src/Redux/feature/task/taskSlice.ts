
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {fetchTaskData,addTaskApi, updateTaskApi, deleteTaskApi} from"../task/taskThunks"
import {taskResponse} from "../../../Admin/types/taskTypes"
interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  assignedTo: string[];
  createdBy: string;
  status: 'To Do' | 'In Progress' | 'In Review' | 'Completed' | 'Blocked';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  dueDate?: string;
  startDate?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
 attachedURLs:string[];
 subTask :[]
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error?: string | null;
  page:number;
 status?: 'idle' | 'loading' | 'succeeded' | 'failed';
  rowPerPage:number
  totalItems:number
  totalPage:number
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
  status:"idle",
   page:1,
  rowPerPage:5,
  totalItems:0,
  totalPage:0
};

const TaskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTaskPage: (state, action) => {
          state.page = action.payload;
        },
    setTasks(state, action: PayloadAction<Task[]>) {
      state.tasks = action.payload;
    },
    addTask(state, action: PayloadAction<Task>) {
      state.tasks.push(action.payload);
    },
    updateTask(state, action: PayloadAction<Task>) {
      const index = state.tasks.findIndex((t) => t._id === action.payload._id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    deleteTask(state, action: PayloadAction<string>) {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    deleteSubTaskRedux(state,action:PayloadAction<any>){
state.tasks = state.tasks.map((task) => ({
  ...task,
  subTask: task.subTask?.filter(
    (subt) => subt.title !== action.payload
  )
}));
    },
deleteAttachment: (
  state,
  action: PayloadAction<{ taskId: string; url: string }>
) => {
  const { taskId, url } = action.payload;

  state.tasks = state.tasks.map((task)=>({
 ...task,
 attachedURLs:task.attachedURLs.filter((linkUrl)=>url!==linkUrl)
  }))
},

  },
  extraReducers :builder => {
        builder
          .addCase(fetchTaskData.pending, state => {
            state.status = 'loading';
          })
          .addCase(fetchTaskData.fulfilled,(state, action: PayloadAction<taskResponse>)=>{
           
          state.tasks=[...action.payload.list];
            state.totalItems =action.payload.totalItems;
          state.page =Number(action.payload.currentPage);
          state.totalPage=action.payload.totalPages;

          })
         .addCase(addTaskApi.pending, state => {
            state.status = 'loading';
          })
          .addCase(addTaskApi.fulfilled,(state,action: PayloadAction<Task>)=>{
           
             state.tasks.push(action.payload.task)

          })
          .addCase(updateTaskApi.pending, state => {
            state.status = 'loading';
          })
          .addCase(updateTaskApi.fulfilled,(state,action:PayloadAction<Task>)=>{
         
            const updatedTask = action.payload
           state.task= state.tasks.map((task)=>{
             task._id === updateTask.id ? updateTask:task
            })
          })
           .addCase(deleteTaskApi.pending, state => {
            state.status = 'loading';
          }).addCase(deleteTaskApi.fulfilled, (state, action) => {
            
                   state.status = 'succeeded';
                  state.tasks = state.tasks.filter((u) => u._id !== action.payload);
                })
        }
});

export const {
  setTasks,
  addTask,
  updateTask,
  deleteTask,
  setLoading,
  setError,
  setTaskPage,
  deleteAttachment,
  deleteSubTaskRedux
} = TaskSlice.actions;

export default TaskSlice.reducer;
