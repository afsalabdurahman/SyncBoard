import { Abuse } from "../../domain/entities/Abuse";
import { formatDate, getNextMonthEnd } from "../../utils/dateCoverter";
import {  CountWorkspaceReponseDTO } from "../dto/DatahandleDTO";
import {  listOfSubscriptionsDTO, SubscriptionAggregateDTO,   SuperSubscriptionResponseDTO, UserAggResponseDTO, UserDetailsAggResponseDTO, UserDetailsResponseDTO, WorkspaceAggResponseDTO } from "../dto/SuperDTO";
export class DatahandleMapper {
  static mapSuperEntityToResponse(userCount: number, workspaceCount: number, data: SubscriptionAggregateDTO[], abusereportlas: Abuse[]) {
    const Abuse = abusereportlas.map((report) => ({
      id: report.id,
      type: report.type,
      severity: report.severity,
      time: formatDate(report?.createdAt?.toString() || "")
    }));


    return {
      userCount,
      workspaceCount,
      subscriptionCount: data[0].count,
      subscriptionChanges: data[0].data,
      Abuse: Abuse
    }
  }
  static async mapSuperWorkspaceToResponse(
    results: WorkspaceAggResponseDTO[]
  ): Promise<{ responseDTO: CountWorkspaceReponseDTO[]; totalCount: number }> {

    const totalCount = results.pop()?.totalDocCount ?? 0;

    const responseDTO: CountWorkspaceReponseDTO[] = results.map((result) => ({
      id: result.workspaceId,
      name: result.workspaceName,
      slug: result.workspaceSlug,

      owner: {
        name: result.ownerName,
        email: result.ownerEmail,
        avatar: result.ownerImageUrl,
      },

      plan: result.subscriptionPlan,
      status: result.workspaceStatus,
      members: result.memberCount,

      createdAt: formatDate(result.workspaceCreatedDate),
      lastActivity: formatDate(result.lastProjectUpdatedDate),

      monthlyRevenue: result.monthlyRevenue / 100,
      storage: { used: result.workspaceStorage ?? 0, limit: 10 },
    }));

    return {
      responseDTO,
      totalCount,
    };
  }

  static mapAllUserToResponse(result: UserAggResponseDTO) {
    const totalCount = result.totalCount
    const responseDTO = result.userList.map((u) => ({
      id: u._id?.toString() || "",
      name: u.name || "",
      email: u.email || "",
      avatar: u.imageUrl || "/placeholder.svg?height=40&width=40",
      role: u.role?.toLowerCase() || "member",
      status: u.status || "inactive",
      phone: u.phone || "",

      workspace: {
        name: u.workspaceDetails.name || "",
        plan: u.subscriptionDetails.planKey || null,
      },

      joinedAt: u.createdAt?.toISOString() || "",
      lastActivity: u.updatedAt?.toISOString() || "",
      loginCount: u.loginCount || 0,
      isEmailVerified: u.isEmailVerified ?? true,
      twoFactorEnabled: u.twoFactorEnabled ?? false,
    }))
    return {
      responseDTO,
      totalCount
    }
  }
  static mapUserDetailsToResponse(result:UserDetailsAggResponseDTO): UserDetailsResponseDTO {
    return {
      id: result._id,
      name: result.name,
      email: result.email,
      role: result.role,
      workspace: {
        name: result.workspace.name,
        plan: result.subscriptionDetails.planKey
      },
      phone: result.phone,
      joinedAt: result.createdAt,
      lastActivity: result.createdAt,
      loginCount: 0,
      isEmailVerified: true,
      twoFactorEnabled: false


    }
  }
  static mapSubscriptionToResponse(subscriptions:listOfSubscriptionsDTO[],totalDocCounts:number) {

    const responseDTO = subscriptions.map((u): SuperSubscriptionResponseDTO => ({
  
      workspace: {
        name: u.name,
        ownerName: u.userName,
        ownerEmail: u.userEmail,
        avatar: "/default-avatar.png",
      },
      plan: u.planKey || "free",
      status: u.subscriptionStatus || "inactive",
      amount: u.priceCents / 100 || 0,
      currency: "USD",
      interval: "month",
      startedAt: u.createdAt,
      currentPeriodEnd: getNextMonthEnd(u.createdAt.toString()),
      cancelAtPeriodEnd: false,
      paymentMethod: {
        brand: "visa",
        last4: "4242",
        expMonth: 4,
        expYear: 2027,
      },
      lastInvoiceStatus: "paid",
    }));
    return { totalDocCounts, responseDTO }
  }


}