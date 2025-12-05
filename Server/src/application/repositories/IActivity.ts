

export interface IActivity{
    myLogs(workspaceId:string):Promise<string[]|null>
}