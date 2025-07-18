import mongoose, { Schema, model, Document } from "mongoose";
export interface WorkspaceMembership {
  workspaceId: mongoose.Types.ObjectId|string;
  role: "Member" | "Admin" | "SuperAdmin";
  joinedAt?: Date;
}
// workspace Schema.....
export const workspaceMembershipSchema = new Schema<WorkspaceMembership>(
  {
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    role: {
      type: String,
      enum: ["Member", "Admin", "SuperAdmin"],
      default: "Member",
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  
);

////
export interface IUser extends Document {
  // id: string;
   name: string;
     role: "Member" | "Admin" | "SuperAdmin";
  email: string;
  password: string;
  profileImage?: string;
  workspace: WorkspaceMembership[];
  phone:string;
  location:string;
  address:string;
  about:string;
  createdAt: Date;
  updatedAt: Date;
  title:string;
  imageUrl:string;
  isAdmin:boolean;
  isSuperAdmin:boolean;
  isBlock:boolean;
  
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: {
      type: String,
      enum: ["Member", "Admin", "SuperAdmin"],
      required: true,
    },
    profileImage: { type: String },
    workspace: [workspaceMembershipSchema],
    title:{type:String},
    phone:{type:String},
    location:{type:String},
    address:{type:String},
    about:{type:String},
    imageUrl:{type:String},
    isAdmin:{type:Boolean,default:false},
    isSuperAdmin:{type:Boolean,default:false},
    isBlock:{type:Boolean,default:false}
  },
  { timestamps: true }
);

export const UserModel = model<IUser>("User", userSchema);
