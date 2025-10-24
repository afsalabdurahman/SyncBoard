export interface ProjectType {
  _id?: number | string;
  name: string;
  description: string;
  assignedUsers: string[];
  deadline: string; 
  status: 'Planning' | 'In Progress' | 'Completed' | 'On Hold';
  preiority?: 'Low' | 'Medium' |'High';
  clientName?:string;
 adminProjects?:string;

}

export type ProjectStatus = "Completed" | "In Progress" | "Planning" | "On Hold";
export interface ProjectFormData {

  _id?: string;

  name: string;
  
  description: string;

  status: ProjectStatus;
  
  deadline: string;

  priority: string;

  clientName?: string;

  attachment?: { file: File }[];
 url?:[string]
}
export interface projectResponse{
list:ProjectFormData[],
totalPages:number|string,
currentPage:number|string,
totalItems:number|string


}