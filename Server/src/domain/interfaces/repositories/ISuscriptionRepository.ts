import { ObjectId } from "mongoose"
import {Subscription} from "../../entities/Suscription"
export interface ISuscription {
    create (data:any):Promise<any>
    findSuscriptionByUserId(userId:string|ObjectId):Promise<Subscription>
}