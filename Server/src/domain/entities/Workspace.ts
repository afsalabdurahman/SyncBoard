import { ObjectId } from "mongoose";
import { WorkspaceProps } from "../../types/workpaceTypes";
interface Member {
  userId: string;
  title: string;
}
import { workspaceStatus } from "../../types/workpaceTypes";
export type workspaceStorage = 1|5|10|100


export class Workspace {
  public name: string;
  public slug: string;
  public role: string;
  public ownerId: string;
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
