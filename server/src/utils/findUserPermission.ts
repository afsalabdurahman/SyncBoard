import { container } from "tsyringe"
import { CreateWorkspaceUsecases } from "../application/use-cases/workspace/CreateWorkspaceUsecase";
import { stringToMongoObj } from "./convertMongoObject";

export const findPermision=async(userId:string,workspaceId:string):Promise<string>=>{
 
  
  const workspaceUsecase =container.resolve(CreateWorkspaceUsecases)
const workspace = await workspaceUsecase.findWorkspace(stringToMongoObj(workspaceId));
 const user = workspace?.members?.find(
    (member) => member.userId?.toString() === userId
  );
return user?.permissions as string

}