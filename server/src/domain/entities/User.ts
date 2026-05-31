import { WorkspaceMembership } from "../../types/workpaceTypes";


export class User {
  googleId?:string|null;
  email: string;
  password?: string;
  name: string;
  _id?: string;
  profileImage?: string;
  workspace?: WorkspaceMembership[];
  location?: string;
  imageUrl?: string;
  about?: string;
  phone?: string;
  isSuperAdmin?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  isVerified?: boolean;
  verificationExpiresAt?: Date;

  constructor(params: {
      googleId?:string;
    email: string;
    password?: string;
    name: string;
    _id?: string;
    profileImage?: string;
    workspace?: WorkspaceMembership[];
    location?: string;
    imageUrl?: string;
    about?: string;
    phone?: string;
    isSuperAdmin?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
   
 isVerified?: boolean;                 
  verificationExpiresAt?: Date; 
  }) {
    this.googleId =params.googleId;
    this.email = params.email;
    this.password = params.password;
    this.name = params.name;
  

    this._id = params._id;

    this.profileImage = params.profileImage;
    this.workspace = params.workspace;
    this.location = params.location;
    this.imageUrl = params.imageUrl;
    this.about = params.about;
    this.phone = params.phone;
    this.isSuperAdmin = params.isSuperAdmin ?? false;
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
    this.isVerified = params.isVerified ?? false;
    this.verificationExpiresAt = params.verificationExpiresAt;
  }
}
