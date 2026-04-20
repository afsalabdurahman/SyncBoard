import { TaskModel } from "../../../database/models/TaskModel";

export const chooseModel = (modelName:string)=>{
if(modelName.includes("Task")){
  return TaskModel
}
}
