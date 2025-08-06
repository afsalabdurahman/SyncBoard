import mongoose, { Types } from "mongoose";
import { Workspace } from "../../../domain/entities/Workspace";

export interface IWorkspace {
    
    createWorksapce(workspaceData: any,userId:any,title:string,value:string):Promise<Workspace|any>
    findWorkspace(id:Types.ObjectId):Promise<any>;
    updateWorkspace(id:mongoose.Types.ObjectId,logId:mongoose.Types.ObjectId):Promise<boolean>
}