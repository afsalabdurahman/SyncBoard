import {
  Project,
  
} from "../../domain/entities/Project"
import {PriorityTypes,StatusTypes} from "../../types/projectTypes"

export interface ProjectRequstDTO{
      name: string;
      description : string;
      assignedUsers : string[];
      deadline : Date;
      status : StatusTypes;
      priority : PriorityTypes;
      clientName : string;
      projectAdminId : string;
      attachedUrl?: string;
      
}

export interface ProjectResponseDTO{
    project:Project
    message:string
}
export interface ProjectAttchementRemoveDTO{
  projectId:string;
  encodedUrl:string;
}