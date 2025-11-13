// rootReducer.ts
import { combineReducers } from '@reduxjs/toolkit';
import registerReducer from "./feature/RegisterSlice"
import StatusSliceReducer from './feature/StatusSlice';
import workspaceReducer from './feature/WorkspaceSlice';
import usersliceReducer from "./feature/user/userSlice";
import logsliceReducer from "./feature/logs/LogSlice"
import projectReducer from './feature/project/projectSlice';
import alluserReducer from "./feature/users/AlluserSlice";
import subscriptionReducer from "./feature/subscription/subscriptionSlice";
import forwardReducer from "./feature/ForwardSlice"
import countReducer from "./feature/count/countSlice"
import taskReducer from "./feature/task/taskSlice";
import {workspaceDataApi} from "../SuperAdmin/apis/fetchApi"
const rootReducer = combineReducers({
  register: registerReducer,
  status: StatusSliceReducer,
  workspace: workspaceReducer,
  user: usersliceReducer,
  projects: projectReducer,
  alluser: alluserReducer,
  task: taskReducer,
  logs: logsliceReducer,
  suscription: subscriptionReducer,
  forward: forwardReducer,
  Supercount: countReducer,
    [workspaceDataApi.reducerPath]: workspaceDataApi.reducer
});

export default rootReducer;
