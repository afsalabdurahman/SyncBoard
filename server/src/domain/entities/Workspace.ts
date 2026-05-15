import { ObjectId } from "mongoose";
import { WorkspaceProps,Member,workspaceStatus,workspaceStorage } from "../../types/workpaceTypes";



export class Workspace {
  public name: string;
  public slug: string;
  public role: string;
  public ownerId: string | ObjectId;
  public members?: Member[];
  public status:workspaceStatus;
  public storage:workspaceStorage;
  public createdAt: Date;
  public _id?: string|ObjectId;

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
  }: WorkspaceProps) {
    this.name = name;
    this.slug = slug;
    this.role = role;
    this.ownerId = ownerId;
    this.members = members;
    this.status = status;
    this.storage =storage;
    this.createdAt = createdAt;
    this._id = _id;
  }
}
