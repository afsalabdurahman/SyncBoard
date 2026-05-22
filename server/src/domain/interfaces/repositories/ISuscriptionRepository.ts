import {  Types } from "mongoose"
import { Subscription } from "../../entities/Suscription"
export interface ISuscription {
    create(data: Subscription): Promise<Subscription>
    findSuscriptionByUserId(customerId: string): Promise<Subscription | null>;
    updateSuscriptionPlan(userId: string, plankey: string, status: string): Promise<Subscription | null>
    updateSubscriptionPlanBysuper(name: string, plan: string): Promise<void>;
    //  subscriptionDetails(workspaceName:string):Promise<Subscription>
    updateHistory(workspaceid: Types.ObjectId, id: string, date: Date, amount: number, status: string): Promise<void>
updateSubscriptionByWorkspaceId(workspaceId:Types.ObjectId,planKey:string,status:string):Promise<void>
}