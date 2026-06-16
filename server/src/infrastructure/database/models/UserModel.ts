import { Schema, model, Document, Model } from "mongoose";
import { WorkspaceMembership } from "../../../types/workpaceTypes";


export interface UserDoument extends Document {
  googleId?: string|null;
  name: string;
  email: string;
  password: string;
  profileImage?: string;
  workspace: WorkspaceMembership[];
  phone: string;
  location: string;
  address: string;
  about: string;
  createdAt: Date;
  updatedAt: Date;
  imageUrl: string;
  isSuperAdmin: boolean;
  isVerified?: boolean;
  verificationExpiresAt: Date
  isSuspend:boolean

}

const userSchema = new Schema<UserDoument>(
  {
    googleId: { type: String, unique: true, sparse: true,default:null },
    email: { type: String, required: true, unique: true },
    password: { type: String, select: false },
    name: { type: String, required: true },
    profileImage: { type: String },
    workspace: [
  {
    type: Schema.Types.ObjectId,
    ref: "Workspace",
  },
],
   
    phone: { type: String },
    location: { type: String },
    address: { type: String },
    about: { type: String },
    imageUrl: { type: String },
    isSuperAdmin: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    verificationExpiresAt: { type: Date },
    isSuspend:{type:Boolean,default:false}

  },
  { timestamps: true }
);
userSchema.index(
  { verificationExpiresAt: 1 },
  { expireAfterSeconds: 0 }
);
export const UserModel:Model<UserDoument> = model<UserDoument>("User", userSchema);
