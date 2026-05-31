import { Types } from "mongoose";
import { User } from "../../domain/entities/User";
import { Workspace } from "../../domain/entities/Workspace";

 export interface WorkspaceRequestDTO{
email:string;
workspaceName:string;
slug:string;
title:string;
role:"Admin"|"Member";
ownerId:string

}
export interface WorkspaceResponseDTO{
workspace:Workspace;
user:User
}
export interface listWorkspace{
name:string,
id:Types.ObjectId |string
}

