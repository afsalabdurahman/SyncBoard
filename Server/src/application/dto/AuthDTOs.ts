import { Subscription } from "../../domain/entities/Suscription";
import { User, WorkspaceMembership } from "../../domain/entities/User";
import { Workspace } from "../../domain/entities/Workspace";

export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface LoginResponseDTO {
  token: string;
  refreshToken: string;
  user:User;
  workspace:Workspace;
  
}

export interface AdminSignupRequestDTO {
  email: string;
  password: string;
  name: string;
  
  role: 'Admin';

}

export interface AdminSignupResponseDTO {
  user:{
    name:string;
  email:string;
  
  role:string
  id:string|any;
  }
  refreshToken:string;
  token:string;
  
}

export interface MemeberRegisterRequestDTO {
name:string;
email:string;
password:string;
role:string;
title:string;
slug?:string

}
export interface MemberRegisterResposeDTO{
 
 
    user:User;
    workspace:Workspace;
token:string;
refreshToken:string
  
}
export interface adminResponseDTO{
 user:User;
 workspace:Workspace,
 suscribe:Subscription
}