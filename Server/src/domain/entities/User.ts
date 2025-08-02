import { AnyMxRecord } from "dns";
import mongoose from "mongoose";

export interface WorkspaceMembership {
  workspaceId: mongoose.Types.ObjectId;
  role: "Member" | "Admin" | "SuperAdmin";
  joinedAt?: Date;
}

export class User {
  email: string;
  password: string;
  name: string;
  role: "Member" | "Admin" | "SuperAdmin";
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
  _id?: string;
  workspace?: WorkspaceMembership[];
  title: string | any;
  location: string | any;
  imageUrl: string | any;
  about: any;
  phone: any;
  isAdmin?:boolean;
  isSuperAdmin?:boolean;
  isBlock?:boolean;
  isDelete?:boolean;
  isOnline?:boolean;

  constructor(
    email: string,
    password: string,
    name: string,
    role: "Member" | "Admin" | "SuperAdmin",
    updatedAt: Date,
    createdAt: Date,
    _id?: string,
    workspace?: WorkspaceMembership[],
    title?: string,
    location?: string,
    imageUrl?: string,
    about?: string,
    phone?: string,
    isAdmin?:boolean,
    isSuperAdmin?:boolean,
    isBlock?:boolean,
    isDelete?:boolean,
    isOnline?:boolean

    // profileImage?: string
  ) {
    this.email = email;
    this.password = password;
    this.name = name;
    this.role = role;
    // this.profileImage = profileImage;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this._id = _id;
    this.title = title;
    this.location = location;
    this.workspace = workspace;
    this.imageUrl = imageUrl;
    this.about = about;
    this.phone = phone;
    this.isAdmin=isAdmin;
    this.isSuperAdmin=isSuperAdmin;
    this.isBlock=isBlock;
    this.isDelete=isDelete;
    this.isOnline=isOnline
  }
}
