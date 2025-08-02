import { UserModel, IUser } from "../database/models/UserModel";
import { IUserRepository } from "../../domain/interfaces/repositories/IUserRepository";
import { User } from "../../domain/entities/User";
// import { DatabaseConfig } from "../config/DatabaseConfig";
import { injectable, inject } from "tsyringe";
import { Types, ObjectId, Date } from "mongoose";
import { ConflictError } from "../../utils/errors";
import { HttpStatusCode } from "../../common/errorCodes";
import mongoose from "mongoose";
import { WorkspaceMembership } from "../../domain/entities/User";
@injectable()
export class UserMongooseRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    try {
      const document = await UserModel.findOne({ email }).exec();
      console.log(document, "documenss");
      if (!document) return null;
      return new User(
        document.email,
        document.password,
        document.name,
        document.role as "Member" | "Admin" | "SuperAdmin",
        document.createdAt,
        document.updatedAt,
        (document._id as Types.ObjectId).toString(),
        document.workspace as WorkspaceMembership[],
        document.title,
        document.location,
        document.imageUrl,
        document.about,
        document.phone,
        document.isAdmin,
        document.isSuperAdmin,
        document.isBlock,
        document.isDelete

        // document.imageUrl
      );
    } catch (error) {
      console.error(`Error finding user by email ${email}:`, error);
      throw new Error("Failed to find user");
    }
  }
  async findById(id: string): Promise<any> {
    let user = await UserModel.findById(id);
    return user;
  }
  async create(entity: User): Promise<User | any> {
    try {
      const isAdmin = entity.role == "Admin" ? true : false;
      const document = new UserModel({
        email: entity.email,
        password: entity.password,
        name: entity.name,
        role: entity.role,
        title: entity.title || null,
        isAdmin: isAdmin,
      });
      // Ensure mongoose connection is open before saving
      if (UserModel.db.readyState !== 1) {
        throw new Error("Database connection is not open");
      }
      const savedDocument = await document.save();

      return new User(
        savedDocument.email,
        savedDocument.password,
        savedDocument.name,
        savedDocument.role as "Member" | "Admin" | "SuperAdmin",
        savedDocument.createdAt,
        savedDocument.updatedAt,
        (savedDocument._id as Types.ObjectId).toString(),
        undefined,
        savedDocument.title,
        undefined,
        undefined,
        undefined,
        undefined,
        savedDocument.isAdmin,
        undefined,
        savedDocument.isBlock,
        savedDocument.isDelete
        // savedDocument._id.toString()
        // savedDocument.profileImage
      );
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Failed to create user");
    }
  }
  async addToWorkspace(
    userId: any,
    workspaceId: any,
    role: string,
    joinDate?: Date
  ): Promise<any> {
    let data = { workspaceId, role, joinDate: new Date() };
    console.log(data, "from insertion +++");
    try {
      let updatedModel = await UserModel.updateOne(
        { _id: userId },
        { $push: { workspace: data } }
      );
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
    console.log(objectId, "objId fro@Repository");
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
    console.log(updated, "mogodb updated");
    return updated;
  }
  async changePassword(userId: string, newPassword: string): Promise<boolean> {
    const result = await UserModel.findByIdAndUpdate(
      userId,
      { $set: { password: newPassword } },
      { new: true, upsert: true }
    );

    console.log(result, "result...");
    return true;
  }
  async findUsersInsameWorkspace(workspaceId: ObjectId): Promise<any> {
    const users = await UserModel.find({
      "workspace.workspaceId": workspaceId,
    });

    return users;
  }
  async updateOnlineStatus(userId: string): Promise<void> {
let objectId=new mongoose.Types.ObjectId(userId.toString());
  const user = await UserModel.findByIdAndUpdate(
  objectId,
  { isOnline: true },
  { new: true,upsert:true } 
);
// if(user.isOnline==true){
//    await UserModel.findByIdAndUpdate(
//   objectId,
//   { isOnline: false },
//   { new: true,upsert:true } 
// );
// }
console.log(user,"#resposirioty")
  }
}
