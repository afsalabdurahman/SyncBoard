import { TaskModel } from "../../../database/models/TaskModel";
import { ProjectModel } from "../../../database/models/ProjectModel";
import { UserModel } from "../../../database/models/UserModel";
import mongoose from "mongoose";
export const modelMap: Record<string, mongoose.Model<any>> = {
  TaskModel,
  ProjectModel,
  UserModel
};
