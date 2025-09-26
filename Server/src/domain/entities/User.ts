import mongoose from "mongoose";

export interface WorkspaceMembership {
  workspaceId: mongoose.Types.ObjectId;
  role: "Member" | "Admin" | "SuperAdmin";
  joinedAt?: Date;
}

export class User {
  // 🔹 Required fields
  email: string;
  password: string;
  name: string;
  role: "Member" | "Admin" | "SuperAdmin";

  // 🔹 Optional fields
  _id?: string;
  title?: string;
  profileImage?: string;
  workspace?: WorkspaceMembership[];
  location?: string;
  imageUrl?: string;
  about?: string;
  phone?: string;

  // 🔹 System flags
  isAdmin?: boolean;
  isSuperAdmin?: boolean;
  isBlocked?: boolean;
  isDeleted?: boolean;
  isOnline?: boolean;

  // 🔹 Timestamps
  createdAt?: Date;
  updatedAt?: Date;

  constructor(params: {
    email: string;
    password: string;
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
  }
}
