export interface ILogin{
    loginUser(email:string,password:string):Promise<any>
}