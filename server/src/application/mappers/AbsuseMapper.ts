import { Abuse } from "../../domain/entities/Abuse"
import { formatDateToString } from "../../utils/dateCoverter"

export class AbuseMapper {
    static entityToResponse(abuseList:Abuse[]){
        const list=abuseList.map((abuse:Abuse)=>{
            return{
        id:abuse.id?.toString()|| "",
        type:abuse.type,
        severity:abuse.severity,
        status:abuse.status,
        createdAt:formatDateToString(abuse.createdAt?.toString()||"")

            }
        })
       return list
    } 
}