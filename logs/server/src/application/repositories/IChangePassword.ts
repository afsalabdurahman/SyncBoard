export interface IChangePasword {
    execute(userId:string,currentPassword:string,newPassword:string):Promise<boolean>
resetPassword(userId:string,password:string):Promise<boolean>
}