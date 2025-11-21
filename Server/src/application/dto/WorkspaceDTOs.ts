import { User } from "../../domain/entities/User";
import { Workspace } from "../../domain/entities/Workspace";

 export interface WorkspaceRequestDTO{
email:string;
WorkspaceName:string;
slug:string;
title:string;
role:string;
ownerId:string;

}
export interface WorkspaceResponseDTO{
workspace:Workspace;
user:User
}

