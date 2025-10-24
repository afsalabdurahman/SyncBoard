// rootReducer.ts
import { combineReducers } from '@reduxjs/toolkit';
import registerReducer from "./feature/RegisterSlice"
import StatusSliceReducer from './feature/StatusSlice';
import workspaceReducer from './feature/WorkspaceSlice';
import usersliceReducer from "./feature/UserDataSlice";
import logsliceReducer from "./feature/LogSlice"
import projectReducer from './feature/project/projectSlice';
import alluserReducer from "./feature/AlluserSlice";
import subscriptionReducer from "./feature/SuscriptionSlice";
import forwardReducer from "./feature/ForwardSlice"
import countReducer from "./feature/countSlice"
import taskReducer from "./feature/task/taskSlice";
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
  Supercount: countReducer
});

export default rootReducer;
