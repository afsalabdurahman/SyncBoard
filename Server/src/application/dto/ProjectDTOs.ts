import {
  Project,
  PriorityTypes,
  StatusTypes,
} from "../../domain/entities/Project"


export interface ProjectRequstDTO{
      name: string;
      description : string;
      assignedUsers : string[];
      deadline : Date;
      status : StatusTypes;
      priority : PriorityTypes;
      clientName : string;
      projectAdminId : string;
      attachedUrl?: string
}

export interface ProjectResponseDTO{
    message:string
}
export interface ProjectAttchementRemoveDTO{
  projectId:string;
  encodedUrl:string;
}