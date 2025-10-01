import { UserModel, IUser } from "../database/models/UserModel";
import { IUserRepository } from "../../domain/interfaces/repositories/IUserRepository";
import { User } from "../../domain/entities/User";

import { injectable, inject } from "tsyringe";
import { Types, ObjectId, Date } from "mongoose";
import { ConflictError, ValidationError } from "../../utils/errors";
import { HttpStatusCode } from "../../common/errorCodes";
import mongoose from "mongoose";
import { WorkspaceMembership } from "../../domain/entities/User";
@injectable()
export class UserMongooseRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    try {
      const document = await UserModel.findOne({ email })
      
        .exec();
   
      if (!document) return null;
      return document as User;
    } catch (error) {
      console.error(`Error finding user by email ${email}:`, error);
      throw new Error("Failed to find user");
    }
  }
  async findById(id: string): Promise<any> {
    let user = await UserModel.findById(id).exec();
    return user;
  }
  async create(entity: User): Promise<User> {
    try {
      // Ensure mongoose connection is open before saving
      if (UserModel.db.readyState !== 1) {
        throw new Error("Database connection is not open");
      }
      const savedDocument = await UserModel.create(entity);

      return savedDocument.toObject() as User;
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Failed to create user");
    }
  }
  async addToWorkspace(
    userId: string | ObjectId,
    workspaceId: string | ObjectId,
    role: string,
    joinDate?: Date
  ): Promise<User | any> {
    const data = { workspaceId, role, joinDate: new Date() };

    try {
      const updatedModel = await UserModel.findOneAndUpdate(
        { _id: userId },
        {
          $set: { title: role },
          $push: { workspace: data },
        },
        { new: true }
      ).lean<User | null>();

      return updatedModel;
    } catch (error) {
      console.log(error, "err");
    }
  }
  async updateUser(
    id: any,
    updateFieldname: string,
    value: string
  ): Promise<User | any> {
    const objectId: any = new mongoose.Types.ObjectId(id.toString());

    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: objectId },
      { $set: { [updateFieldname]: value } },
      { new: true, upsert: true }
    );

    return updatedUser;
  }
  // Update profile
  async updateProfile(userId: string, merge: any): Promise<User | any> {
    const objectId: any = new mongoose.Types.ObjectId(userId.toString());
   
    let updated = await UserModel.updateOne(
      { _id: objectId },
      { $set: merge.profileData },
      {
        upsert: true,
        new: true, // Return the new document
        runValidators: true, // Apply schema validation
      }
    );

    if (!updated) throw new ConflictError("Database error");
 
    return updated;
  }
  async changePassword(userId: string, newPassword: string): Promise<boolean> {
    const result = await UserModel.findByIdAndUpdate(
      userId,
      { $set: { password: newPassword } },
      { new: true, upsert: true }
    );

  
    return true;
  }
  async findUsersInsameWorkspace(workspaceId: ObjectId): Promise<any> {
    const users = await UserModel.find({
      "workspace.workspaceId": workspaceId,
    });

    return users;
  }
  async updateOnlineStatus(userId: string): Promise<void> {
    let objectId = new mongoose.Types.ObjectId(userId.toString());
    const user = await UserModel.findByIdAndUpdate(
      objectId,
      { isOnline: true },
      { new: true, upsert: true }
    );
    // if(user.isOnline==true){
    //    await UserModel.findByIdAndUpdate(
    //   objectId,
    //   { isOnline: false },
    //   { new: true,upsert:true }
    // );
    // }
 
  }
  async countUser(): Promise<any> {
    const countUser = await UserModel.countDocuments()
    return countUser;
  }
}
