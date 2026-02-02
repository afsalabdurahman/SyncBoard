export interface IChangePasword {
    execute(userId:string,currentPassword:string,newPassword:string):Promise<boolean>
}