export interface AdminLoginResponse {
  user: User;
  workspace: Workspace;
  suscribe: Subscription;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  title: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isBlocked: boolean;
  isDeleted: boolean;
  isOnline: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  verificationExpiresAt: string | null;
  workspace: UserWorkspace[];
}

export interface UserWorkspace {
  workspaceId: string;
  role: string;
  _id: string;
  joinedAt: string;
}

export interface Workspace {
  _id: string;
  name: string;
  slug: string;
  ownerId: string;
  status: string;
  storage: number;
  createdAt: string;
  members: WorkspaceMember[];
}

export interface WorkspaceMember {
  userId: string;
  title: string;
  _id: string;
}
export interface subscriptionHistory{
    id:string;
    date:Date;
    amount:number;
    status:string;
}

export interface Subscription {
  _id: string;
  user: string;
  workspace: string;
  planKey: string;
  status: string;
  startedAt: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  stripeSubscriptionId: string;
  quantity: number;
  history: subscriptionHistory[];
  metadata: string;
  createdAt: string;
  updatedAt: string;
}