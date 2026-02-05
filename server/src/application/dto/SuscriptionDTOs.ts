export interface SuscriptionRequestDTO{
userId:string ;
planKey:string;

}
export interface SuscriptionReponseDTO{

    link:string,
}
export interface subscriptionHistory{
    id:string;
    date:Date;
    amount:number;
    status:string;
}