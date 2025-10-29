import { Types } from "mongoose";
import { ObjectId } from "mongoose";
interface Member {
  userId: string;
  title: string;
}
export type workspaceStatus = "Active"|"InActive"|"Suspented"
export type workspaceStorage = 1|5|10|100
interface WorkspaceProps {
  name: string;
  slug: string;
  role: string;
  ownerId: string;
  members?: Member[];
  status:workspaceStatus;
  storage:workspaceStorage;
  createdAt?: Date;
  _id?: string|ObjectId;
}

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
