import { Abuse } from "../../domain/entities/Abuse";
import { formateData, getNextMonthEnd } from "../../utils/dateCoverter";
import { SuperSubscriptionResponseDTO, UserDetailsResponseDTO, UserResponse } from "../dto/SuperDTO";
export class DatahandleMapper {
    static mapSuperEntityToResponse(userCount:number,workspaceCount:number,data:any,abusereportlas:Abuse[]){
     const Abuse = abusereportlas.map((report) => ({
  id: report.id,
  type: report.type,
  severity: report.severity,
  time: formateData(report?.createdAt?.toString() || "")
}));

  
  return {
    userCount,
    workspaceCount,
    subscriptionCount:data[0].count,
    subscriptionChanges:data[0].data,
    Abuse:Abuse
  }
}
static mapSuperWorkspaceToResponse(results: any[]) {
    const totalCount=results.pop()
  const responseDTO= results.map((result) => ({
    id: result.workspaceId,
    name: result.workspaceName,
    slug:result.workspaceSlug,
    owner: {
      name: result.ownerName, 
      email: result.ownerEmail, 
      avatar: result.ownerImageUrl,
    },
    plan: result.subscriptionPlan,
    status: result.workspaceStatus.toLowerCase(),
    members: result.memberCount,
    createdAt: formateData(result.workspaceCreatedDate),
    lastActivity: formateData(result.lastProjectUpdatedDate),
    monthlyRevenue: result.monthlyRevenue/100,
    storage: { used: 2, limit: 10 },
  }));

  return{
  responseDTO,
  totalCount
  }
}
static mapAllUserToResponse(result: any[]){
   const totalCount=result.pop()
   const responseDTO= result.map((u) => ({
    id: u._id?.toString() || "",
    name: u.name || "",
    email: u.email || "",
    avatar: u.imageUrl || "/placeholder.svg?height=40&width=40",
    role: u.role?.toLowerCase() || "member",
    status: u.status || "inactive",

    workspace: {
      name: u.workspaceDetails?.name || "",
      plan: u.subscriptionDetails?.[0]?.planKey || null,
    },

    joinedAt: u.createdAt?.toISOString() || "",
    lastActivity: u.updatedAt?.toISOString() || "",
    loginCount: u.loginCount || 0, 
    isEmailVerified: u.isEmailVerified ?? true, 
    twoFactorEnabled: u.twoFactorEnabled ?? false, 
  }))
   return{
  responseDTO,
  totalCount
  }
}
static mapUserDetailsToResponse(result:any):UserDetailsResponseDTO{
  return{
    id:result._id,
    name:result.name,
    email:result.email,
    role:result.role,
    workspace:{
      name:result.workspaceDetails.name,
      plan:result.subscriptionDetails[0].planKey
    },
    joinedAt:result.createdAt,
    lastActivity:result.createdAt,
    loginCount:0,
    isEmailVerified:true,
    twoFactorEnabled:false


  }
}
static mapSubscriptionToResponse(result: any[]) {
   const totalCount=result.pop()
  const responseDTO = result.map((u):SuperSubscriptionResponseDTO => ({
    id: u._id,
    workspace: {
      name: u.name,
      ownerName: u.userName,
      ownerEmail: u.userEmail,
      avatar: "/default-avatar.png", 
    },
    plan: u.planKey || "free",
    status: u.subscriptionStatus || "inactive",
    amount: u.priceCents/100 || 0,
    currency: "USD",
    interval: "month",
    startedAt: u.createdAt,
    currentPeriodEnd: getNextMonthEnd(u.createdAt), 
    cancelAtPeriodEnd: false,
    paymentMethod: {
      brand: "visa",
      last4: "4242",
      expMonth: 4,
      expYear: 2027,
    },
    lastInvoiceStatus: "paid",
  }));
  return {totalCount,responseDTO}
}


}