// rootReducer.ts
import { combineReducers } from '@reduxjs/toolkit';
import registerReducer from "./features/RegisterSlice"
import StatusSliceReducer from './workspace/StatusSlice';
import workspaceReducer from './features/WorkspaceSlice';
import usersliceReducer from "./features/UserDataSlice";
import logsliceReducer from "./features/LogSlice"
import projectReducer from './workspace/admin/ProjectSlice';
import alluserReducer from "./features/AlluserSlice";

import taskReducer from "./workspace/admin/TaskSlice";
const rootReducer = combineReducers({
  register: registerReducer,
  status: StatusSliceReducer,
  workspace: workspaceReducer,
  user: usersliceReducer,
  projects: projectReducer,
  alluser: alluserReducer,
  task:taskReducer,
  logs:logsliceReducer
});

export default rootReducer;
