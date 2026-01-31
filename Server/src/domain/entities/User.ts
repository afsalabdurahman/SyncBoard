import { Types } from "mongoose";
import { WorkspaceMembership } from "../../types/workpaceTypes";


export class User {
  email: string;
  password?: string;
  name: string;
  role: "Member" | "Admin" | "SuperAdmin";
  stripeCustomerId?: string;
  currentSubscription?: Types.ObjectId;
  _id?: string;
  title?: string;
  profileImage?: string;
  workspace?: WorkspaceMembership[];
  location?: string;
  imageUrl?: string;
  about?: string;
  phone?: string;
  isAdmin?: boolean;
  isSuperAdmin?: boolean;
  isBlocked?: boolean;
  isDeleted?: boolean;
  isOnline?: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(params: {
    email: string;
    password?: string;
    name: string;
    role: "Member" | "Admin" | "SuperAdmin";
    _id?: string;
    title?: string;
    profileImage?: string;
    workspace?: WorkspaceMembership[];
    location?: string;
    imageUrl?: string;
    about?: string;
    phone?: string;
    isAdmin?: boolean;
    isSuperAdmin?: boolean;
    isBlocked?: boolean;
    isDeleted?: boolean;
    isOnline?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    stripeCustomerId?: string;
    currentSubscription?: Types.ObjectId

  }) {
    this.email = params.email;
    this.password = params.password;
    this.name = params.name;
    this.role = params.role;

    this._id = params._id;
    this.title = params.title;
    this.profileImage = params.profileImage;
    this.workspace = params.workspace;
    this.location = params.location;
    this.imageUrl = params.imageUrl;
    this.about = params.about;
    this.phone = params.phone;

    this.isAdmin = params.isAdmin ?? false;
    this.isSuperAdmin = params.isSuperAdmin ?? false;
    this.isBlocked = params.isBlocked ?? false;
    this.isDeleted = params.isDeleted ?? false;
    this.isOnline = params.isOnline ?? false;

    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
    this.stripeCustomerId = params.stripeCustomerId;
    this.currentSubscription = params.currentSubscription
  }
}
