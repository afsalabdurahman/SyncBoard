import mongoose,{ Schema, model, Document } from 'mongoose';
export interface WorkspaceMembership {
  workspaceId: mongoose.Types.ObjectId;
  role: 'Member' | 'Admin' | 'SuperAdmin';
  joinedAt?: Date;
}
// workspace Schema.....
 export const workspaceMembershipSchema = new Schema<WorkspaceMembership>(
  {
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
    },
    role: {
      type: String,
      enum: ['Member', 'Admin', 'SuperAdmin'],
      default: 'Member',
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    


  },
  { _id: false }
);

////
export interface IUser extends Document {
  // id: string;
  email: string;
  password: string;
  name: string;
  role: 'Member' | 'Admin' | 'SuperAdmin';
  profileImage?: string;
  workspace:WorkspaceMembership[];
  createdAt: Date;
  updatedAt: Date;

}

const userSchema = new Schema<IUser>(
  {
   
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ['Member', 'Admin', 'SuperAdmin'], required: true },
    profileImage: { type: String },
    workspace: [workspaceMembershipSchema],
  },
  { timestamps: true }
);

export const UserModel = model<IUser>('User', userSchema);
