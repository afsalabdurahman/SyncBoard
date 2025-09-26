import { Types } from "mongoose";
import { ObjectId } from "mongoose";
interface Member {
  userId: string;
  title: string;
}

interface WorkspaceProps {
  name: string;
  slug: string;
  role: string;
  ownerId: string;
  members?: Member[];
  createdAt?: Date;
  _id?: string|ObjectId;
}

export class Workspace {
  public name: string;
  public slug: string;
  public role: string;
  public ownerId: string;
  public members?: Member[];
  public createdAt: Date;
  public _id?: string|ObjectId;

  constructor({
    name,
    slug,
    role,
    ownerId,
    members,
    createdAt = new Date(),
    _id,
  }: WorkspaceProps) {
    this.name = name;
    this.slug = slug;
    this.role = role;
    this.ownerId = ownerId;
    this.members = members;
    this.createdAt = createdAt;
    this._id = _id;
  }
}
