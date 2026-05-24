
import { InvitationStatus } from "../../types/inviteTypes";

export class Invitation {
 public id?:string;
  public workspaceId?: string;
  public invitedTo: string;
  public status: InvitationStatus;
  public expiresAt: Date;
  public acceptedAt?: Date;
  public token:number;
  public createdAt: Date;
  public updatedAt: Date;

  constructor({
    id,
    workspaceId,
    invitedTo,
    status,
    expiresAt,
    acceptedAt,
    token,
    createdAt,
    updatedAt,
  }: {
    id?:string;
    workspaceId?: string;
    invitedTo: string 
    status: InvitationStatus;
    expiresAt: Date;
    acceptedAt?: Date;
    token:number;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id=id;
    this.workspaceId = workspaceId;
    this.invitedTo = invitedTo;
    this.status = status;
    this.expiresAt = expiresAt;
    this.acceptedAt = acceptedAt;
    this.token =token;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  // ✅ Business Logic Example
  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  
}