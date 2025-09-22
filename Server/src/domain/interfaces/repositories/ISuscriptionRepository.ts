import {Subscription} from "../../entities/Suscription"
export interface ISuscription {
    create (data:any):Promise<any>
}