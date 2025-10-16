export interface IWorkspaceChanges{
  nameOfWorkspace:string,
  subscriptionPlan: string;
  amount: number;
  date: Date|any;

}
export interface CountResponseDTO {
  token: string;
  refreshToken: string;
  userCount:number;
  workspaceCount:number;
  subscriptionCount:number;
  subscriptionChanges:IWorkspaceChanges[]

  
}