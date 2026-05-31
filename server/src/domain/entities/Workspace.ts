import { Schema, Types } from "mongoose";
import { WorkspaceProps, Member, workspaceStatus, workspaceStorage } from "../../types/workpaceTypes";



export class Workspace {
  public name: string;
  public slug: string;
  public role: string;
  public ownerId: Types.ObjectId |Schema.Types.ObjectId
  public members: Member[];
  public status: workspaceStatus;
  public storage: workspaceStorage;
  public createdAt: Date;
  public _id?: Types.ObjectId | Schema.Types.ObjectId;
   public stripeCustomerId?: string|null;
  public currentSubscription?: Types.ObjectId|null;

  constructor({
    name,
    slug,
    role,
    ownerId,
    members,
    status,
    storage,
    createdAt = new Date(),
    _id,
    currentSubscription,
    stripeCustomerId
  }: WorkspaceProps) {
    this.name = name;
    this.slug = slug;
    this.role = role;
    this.ownerId = typeof ownerId === "string" ? new Types.ObjectId(ownerId) : ownerId;
    this.members = members ?? [];
    this.status = status;
    this.storage = storage;
    this.createdAt = createdAt;
    this._id = typeof _id === "string" ? new Types.ObjectId(_id) : _id;
    this.currentSubscription=currentSubscription;
    this.stripeCustomerId=stripeCustomerId
  }
}
