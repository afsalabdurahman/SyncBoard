import mongoose, { Types } from "mongoose"
import { Abuse } from "../../domain/entities/Abuse"
import { workspaceStatus } from "../../types/workpaceTypes"
import { subscriptionHistory } from "./SuscriptionDTOs"

export interface UserResponseDTO {
  id: string
  name: string
  email: string
  avatar: string
  role: string
  status: string
  workspace: {
    name: string
    plan: string | null
  },
  phone:string;
  joinedAt: string
  lastActivity: string
  loginCount: number
  isEmailVerified: boolean
  twoFactorEnabled: boolean
}
export interface SuperSubscriptionResponseDTO {
  id?: string;
  workspace?: {
    name: string;
    ownerName: string;
    ownerEmail: string;
    avatar: string;
  };
  plan?: string;
  status?: string;
  amount?: number;
  currency?: string;
  interval?: string;
  startedAt?: Date;
  currentPeriodEnd: Date|string;
  cancelAtPeriodEnd: boolean;
  paymentMethod: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  };
  history?:subscriptionHistory[]
  lastInvoiceStatus: string;
}
export interface UserDetailsResponseDTO {
  id: string;
  name: string;
  email: string;
  role: string;
  workspace: {
    name: string;
    plan: string;
  };
  phone:string;
  joinedAt: Date;
  lastActivity: Date;
  loginCount: number;
  isEmailVerified: boolean;
  twoFactorEnabled:boolean;
}
export interface SubscriptionSummaryDTO {
  workspaceName: string | null;
  subscriptionPlan: string;
  status: string;
  updated: Date;
  amount: number;
}

export interface SubscriptionAggregateDTO {
  data: SubscriptionSummaryDTO[];
  count: number;
}

export interface GetAllCountResponseDTO {
  userCount: number;
  workspaceCount: number;
  data: SubscriptionAggregateDTO[];
  abusereportlas:Abuse[];
}
export interface WorkspaceAggResponseDTO {
  workspaceId: string;
  workspaceName: string;
  workspaceStatus: workspaceStatus;

  memberCount: number;
  workspaceCreatedDate: Date;
  workspaceStorage: number | null;
  workspaceSlug: string;

  ownerName: string | null;
  ownerEmail: string | null;
  ownerImageUrl: string | null;

  subscriptionPlan: string | null;
  subscriptionStatus: string | null;

  monthlyRevenue: number;
  lastProjectUpdatedDate: Date ;
  totalDocCount:number
}



export interface UserWorkspaceDTO {
  name: string;
  plan: string | null;
}

export interface AllUserDTO {
  _id: string;
  name: string;
  email: string;
  avatar?: string | null;
  role?: string;
  status?: string;
  phone?:string;
  imageUrl?:string;
isSuspend?:boolean;
  workspaceDetails: {
    name:string,
    plan:string
  };
subscriptionDetails:[{
  planKey:string
}]
  joinedAt: string;
  lastActivity: string;

  loginCount: number;
  isEmailVerified: boolean;
  twoFactorEnabled: boolean;
  createdAt:Date;
  updatedAt:Date

}
export interface UserAggResponseDTO  {
userList:AllUserDTO[];
totalCount:number
} 

export interface UserWorkspaceDetailsDTO {
  name: string;
  plan: string | null;
}

export interface UserDetailsAggResponseDTO {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
  status: string;
  phone:string;

  workspace: {
    name:string,
  };
  subscriptionDetails:{
        planKey:string
  }
  
updatedAt:Date;
  createdAt: Date;
}
export interface listOfSubscriptionsDTO {
  workspaceId: string;
  name: string;
  createdAt: Date;

  userName: string;
  userEmail: string;

  planKey: string;
  subscriptionStatus: string;

  priceCents: number;
  history?:subscriptionHistory[]

}
export interface SubscriptionAggResponseDTO {
  subscriptions:listOfSubscriptionsDTO[];
  totalDocCount:number;
}
export interface RevenuChartReponseDTO{
  planName:string;
  totalRevenue:number
}
export interface MessageDto {
  sender: "admin" | "super_admin" | string;
  content: string;
  timestamp: Date;
}

export interface TicketDTO {
  _id: string | mongoose.Types.ObjectId | Types.ObjectId;
  SLno: string;
  title: string;
  description: string;
  status: string;
  priority: "low" | "medium" | "high";
  category: string;
  messages: MessageDto[];
  workspaceId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface UserListItemDTO {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: string;
  status: 'active' | 'inactive';
  phone: string;
  workspace: {
    name: string;
    plan: string | null;
  };
  joinedAt: string;       // ISO string
  lastActivity: string;   // ISO or null
  // loginCount?: number;    // ← only if really needed (performance cost)
  // isEmailVerified?: boolean;
  // twoFactorEnabled?: boolean;
}

export interface PaginatedUsersResponse {
  items: UserListItemDTO[];
  total: number;
  limit: number;
  skip: number;
 
}
export interface UserGrowthChartReponseDTO{
 month: string,
 totalUsers: number,
  newUsers: number,
  churned: number  
}

export interface WorkspaceMemberResponseDto {
  userId: string;
  name: string;
  email: string;
  title: string;
  permissions: string;
  role: string;
  isBlocked: boolean;
  isDeleted: boolean;
  isOnline: boolean;
}
export interface UserDetailsInsuperAdmin{
  userId?:{
    _id:string | Types.ObjectId,
    email:string,
    name:string
  },
  isBlocked:boolean
}
export interface WorkspaceResponseDto {
  _id: string;
  name: string;
  slug: string;
  ownerId?: string;
  status: string;
  storage?: number;
  createdAt: Date;
  isBlocked:boolean;
  currentSubscription?: string | null;
  members?: UserDetailsInsuperAdmin[];
}

export interface SuperUserResponseDto {
  _id: string;
  name: string;
  email: string;
  imageUrl?: string | null;
  location: string | null;
  phone: string | null;
  about?: string | null;
  isVerified: boolean;
  isSuperAdmin?: boolean;
  isSuspend?:boolean;
  createdAt: Date;
  workspace: WorkspaceResponseDto[];
}
export interface UserDetailsResponseDto {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  phone: string;
  location: string;
  joinedAt: Date;

  workspaces: {
    id: string;
    name: string;
    slug: string;
    createdAt: Date;
    status: string;
    isOwner: boolean;
    membersCount: number;
  }[];
}