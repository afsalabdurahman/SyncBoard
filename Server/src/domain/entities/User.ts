import { Types } from 'mongoose';
import { ObjectId } from 'mongoose';
export class User {

  email: string;
  password: string;
  name: string;
  role: 'Member' | 'Admin' | 'SuperAdmin';
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
   _id?:string;

  constructor(
    
    email: string,
    password: string,
    name: string,
    role: 'Member' | 'Admin' | 'SuperAdmin',
    updatedAt: Date,
    createdAt: Date,
    _id?:string
    // profileImage?: string
     
  ) {
  
    this.email = email;
    this.password = password;
    this.name = name;
    this.role = role;
    // this.profileImage = profileImage;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
     this._id=_id
  }

  
}