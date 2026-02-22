import { UserDoument, UserModel } from "../database/models/UserModel";
import { IUserRepository } from "../../domain/interfaces/repositories/IUserRepository";
import { User } from "../../domain/entities/User";
import { BaseRepository } from "./BaseRepository";
import { injectable,  } from "tsyringe";
import { Types, ObjectId, Date } from "mongoose";
import {  ValidationError } from "../../utils/errors";
import mongoose from "mongoose";
import { UserResponseDTO } from "../../application/dto/SuperDTO";
@injectable()
export class UserMongooseRepository extends BaseRepository<User | null> implements IUserRepository {
  constructor() {
    super(UserModel);
  }

  async findByEmail(email: string): Promise<User | null> {

    const document: UserDoument = await this.model.findOne({ email }).select("-password").lean().exec()


    if (!document) return null;
    return new User({ ...document, _id: document._id?.toString()  });


  }
  async findById(id: string): Promise<User | null> {
    const document = await this.model.findById(id).select("-password").lean().exec();
    if (!document) return null;
    return new User({ ...document, _id: document._id?.toString() });
  }
  async findUser(id: string): Promise<User | null> {
    const document = await this.model.findById(id).lean().exec();
    if (!document) return null;
    return new User({ ...document, _id: document._id?.toString() });
  }


  async addToWorkspace(
    userId: string | ObjectId,
    workspaceId: string | ObjectId,
    role: string,
    joinDate?: Date
  ): Promise<User | null> {
    const data = { workspaceId, role, joinDate: new Date() };


    const updatedDocument = await UserModel.findOneAndUpdate(
      { _id: userId },
      {
        $set: { title: role },
        $push: { workspace: data },
      },
      { new: true }
    ).lean<User>().exec();
    if (!updatedDocument) return null;
    return new User({ ...updatedDocument, _id: updatedDocument._id?.toString() });

  }
  async updateUser(
    id: string,
    updateFieldname: string,
    value: string
  ): Promise<User | null> {
    const objectId: Types.ObjectId = new mongoose.Types.ObjectId(id.toString());

    const updatedUser = await this.model.findOneAndUpdate(
      { _id: objectId },
      { $set: { [updateFieldname]: value } },
      { new: true, upsert: true }
    ).lean().exec()

    if (!updatedUser) return null;
    return new User({ ...updatedUser, _id: updatedUser._id?.toString() });

  }
  // Update profile
  async updateProfile(userId: string, merge: Record<string, string>): Promise<User | null> {
    const objectId: Types.ObjectId = new mongoose.Types.ObjectId(userId.toString());

    const updatedUser = await this.model.findOneAndUpdate(
      { _id: objectId },
      { $set: merge.profileData },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    ).lean().exec()
    if (!updatedUser) return null;
    return new User({ ...updatedUser, _id: updatedUser._id?.toString() });
  }
  async changePassword(userId: string, newPassword: string): Promise<boolean> {
    const result = await this.model.findByIdAndUpdate(
      userId,
      { $set: { password: newPassword } },
      { new: true, upsert: true }
    );


    return true;
  }
  async findUsersInsameWorkspace(workspaceId: Types.ObjectId): Promise<UserDoument[] | null> {
    const document: UserDoument[] = await this.model.find({
      "workspace.workspaceId": workspaceId,
    }).lean().exec()
    if (!document) return null;
    return document
  }
  async updateOnlineStatus(userId: string): Promise<void> {
    let objectId = new mongoose.Types.ObjectId(userId.toString());
    const user = await this.model.findByIdAndUpdate(
      objectId,
      { isOnline: true },
      { new: true, upsert: true }
    );


  }
  async countUser(): Promise<number> {
    const countUser = await this.model.countDocuments()
    return countUser;
  }
  async paginationUser(workspaceId: string | ObjectId, page: number, limit: number, skip: number): Promise<{ items: UserDoument[] | null, totalItems: number }> {
    const totalItems = await UserModel.countDocuments() - 1;
    const items = await UserModel.find({
      "workspace.workspaceId": workspaceId,
      isSuperAdmin: { $ne: true },
    })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    return { items, totalItems }



  }
  async changeOnlineStatus(userId: Types.ObjectId): Promise<boolean> {

    const isUpdated = await UserModel.findByIdAndUpdate(userId, { isOnline: false }, { new: true })
    if (!isUpdated) throw new ValidationError("Updation failed")
    return true
  }
async searchUser(workspaceId: Types.ObjectId, query: string): Promise<UserResponseDTO[]> {
  const regex = new RegExp(query.trim(), 'i');

  const users = await UserModel.find({
    "workspace.workspaceId": workspaceId,
    $or: [
      { name: regex },
      { email: regex }
    ]
  }).lean<UserResponseDTO[]>().exec()
 return users 
}


}

