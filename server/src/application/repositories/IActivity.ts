

export interface IActivity{
    myLogs(workspaceId:string):Promise<string[]|null>
    // projctActivity(name:string,createdBy:string,activityId:string):Promise<void>
}