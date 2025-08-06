import { Workspace } from "../../domain/entities/Workspace"

export interface IActivity{
    execute(workspaceId:string,workspaceName:string,createdBy:string):Promise<any>
    getAllActivities(workspaceId:string):Promise<Workspace>
    projctActivity(projectName:string,createdBy:string,ActivityId:string,):Promise<any>
    userActivity(userName:string,ActivityId:string):Promise<any>
}