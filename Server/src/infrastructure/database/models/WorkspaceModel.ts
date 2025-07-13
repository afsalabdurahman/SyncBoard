import mongoose, { Schema, Document, ObjectId } from 'mongoose';
export interface IMember {
  userId: string;
  title: string;
  name:string;
}
export interface IWorkspace extends Document {
  _id: ObjectId; 
  name: string;
  slug: string;
  role:string;
  ownerId: string;
  createdAt: Date;
  members: IMember[];
}
const MemberSchema: Schema = new Schema({
  userId: {
    type: String, // or Schema.Types.ObjectId if referencing User
    required: true,
  },
  title: {
    type: String,
    
    required: true,
  },
  name:{
    type:String,
    
  },
  email:{
      type: String,
    }
}, { _id: false })
const WorkspaceSchema: Schema<IWorkspace> = new Schema<IWorkspace>({

  name: {
    type: String,
    required: true,
    trim: true,
  },
  role:{
type:String
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  ownerId: {
    type: String,
    required: true,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  members: {
    type: [MemberSchema],
    default: [],
  }
});

export const WorkspaceModel = mongoose.model<IWorkspace>('Workspace', WorkspaceSchema);
