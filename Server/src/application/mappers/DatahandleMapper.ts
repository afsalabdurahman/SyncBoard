export class DatahandleMapper {
    static mapSuperEntityToResponse(userCount:number,workspaceCount:number,data:any){
  return {
    userCount,
    workspaceCount,
    subscriptionCount:data[0].count,
    subscriptionChanges:data[0].data,
  }
}
}