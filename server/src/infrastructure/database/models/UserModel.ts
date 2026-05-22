import { Schema, model, Document, Types, Model } from "mongoose";
import { WorkspaceMembership } from "../../../types/workpaceTypes";
import { UserRole } from "../../../types/userTypes";
import { workspaceMembershipSchema } from "./WorkspaceMemberModel";


export interface UserDoument extends Document {
  googleId?: string|null;
  name: string;
  role: UserRole
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
  title: string;
  imageUrl: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isBlocked: boolean;
  isDeleted: boolean;
  isOnline: boolean;
  stripeCustomerId?: string;
  currentSubscription?: Types.ObjectId;
  isVerified?: boolean;
  verificationExpiresAt: Date

}

const userSchema = new Schema<UserDoument>(
  {
    googleId: { type: String, unique: true, sparse: true,default:null },
    email: { type: String, required: true, unique: true },
    password: { type: String, select: false },
    name: { type: String, required: true },
    role: {
      type: String,
      enum: ["Member", "Admin", "SuperAdmin"],
      required: true,
    },
    profileImage: { type: String },
    workspace: [workspaceMembershipSchema],
    title: { type: String },
    phone: { type: String },
    location: { type: String },
    address: { type: String },
    about: { type: String },
    imageUrl: { type: String },
    isAdmin: { type: Boolean, default: false },
    isSuperAdmin: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    isOnline: { type: Boolean, default: false },
    stripeCustomerId: { type: String },
    currentSubscription: { type: Schema.Types.ObjectId, ref: 'Subscription' },
    isVerified: { type: Boolean, default: false },
    verificationExpiresAt: { type: Date }

  },
  { timestamps: true }
);
userSchema.index(
  { verificationExpiresAt: 1 },
  { expireAfterSeconds: 0 }
);
export const UserModel:Model<UserDoument> = model<UserDoument>("User", userSchema);
