import { ObjectId, Types } from "mongoose";
import { workspaceStatus } from "../../types/workpaceTypes";
import { SubscriptionSummaryDTO } from "./SuperDTO";


export interface IWorkspaceChanges {
  nameOfWorkspace: string,
  subscriptionPlan: string;
  amount: number;
  date: Date;

}
export interface Abuse {
  id: string | Types.ObjectId | undefined;
  type: string;
  severity: string;
  time: string;
};
export interface CountResponseDTO {
  token: string;
  refreshToken: string;
  userCount: number;
  workspaceCount: number;
  subscriptionCount: number;
  subscriptionChanges:SubscriptionSummaryDTO [];
  Abuse: Abuse[]
}

interface WorkspaceDetails {
  _id: string | ObjectId;
  name: string;
  slug: string;
  ownerName: string;
  plan: string;
  status: string;

}

export interface CountWorkspaceReponseDTO {
  id: string ,
  name: string,
  slug?:string
  owner: {
    name: string|null,
    email: string|null,
    avatar: string|null,
  },
  plan: string|null,
  status: workspaceStatus,
  members: number,
  createdAt: string,
  lastActivity: string,
  monthlyRevenue: number,
  storage:  { used: number, limit: number },

}