import { UserDoument, UserModel } from "../database/models/UserModel";
import { IUserRepository } from "../../domain/interfaces/repositories/IUserRepository";
import { User } from "../../domain/entities/User";
import { BaseRepository } from "./BaseRepository";
import { injectable, } from "tsyringe";
import { Types, ObjectId, Date } from "mongoose";
import { ValidationError } from "../../utils/errors";
import mongoose from "mongoose";
import { UserResponseDTO } from "../../application/dto/SuperDTO";
import { ProjectModel } from "../database/models/ProjectModel";
import { stringToMongoObj } from "../../utils/convertMongoObject";
@injectable()
export class UserMongooseRepository extends BaseRepository<User,UserDoument> implements IUserRepository {
  constructor() {
    super(UserModel);
  }

  async findByEmail(email: string): Promise<User | null> {

    const document = await this.model.findOne({ email }).select("-password").lean().exec()


    if (!document) return null;
    return new User({ ...document, _id: document._id?.toString(), googleId: document.googleId ?? undefined });


  }
  async findById(id: string): Promise<User | null> {
    const document = await this.model.findById(id).select("-password").lean().exec();
    if (!document) return null;
    return new User({
      ...document,
      _id: document._id?.toString(),
      googleId: document.googleId ?? undefined,
    });
  }
  async findUser(id: string): Promise<User | null> {
    const document = await this.model.findById(id).select("+password").lean().exec();
    if (!document) return null;
    return new User({ ...document, _id: document._id?.toString(), googleId: document.googleId ?? undefined });

  }


  async addToWorkspace(
    userId: Types.ObjectId,
    workspaceId: Types.ObjectId

  ): Promise<User | null> {
   


    const updatedDocument = await UserModel.findOneAndUpdate(
      { _id: userId },
      {
        
        $push: { workspace: workspaceId },
      },
      { new: true }
    ).lean<User>().exec();
    if (!updatedDocument) return null;
    return new User({ ...updatedDocument, _id: updatedDocument._id?.toString(), googleId: updatedDocument.googleId ?? undefined });

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
    return new User({
      ...updatedUser,
      _id: updatedUser._id?.toString(),
      googleId: updatedUser.googleId ?? undefined,
    });

  }
  // Update profile
  async updateProfile(userId: string, merge: { profileData: Record<string, string> }): Promise<User | null> {
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
    return new User({ ...updatedUser, _id: updatedUser._id?.toString(), googleId: updatedUser.googleId ?? undefined });
  }
  async changePassword(userId: string, newPassword: string): Promise<boolean> {
    await this.model.findByIdAndUpdate(
      userId,
      { $set: { password: newPassword } },
      { new: true, upsert: true }
    );


    return true;
  }
 async findUsersInsameWorkspace(
  workspaceId: Types.ObjectId
): Promise<User[] | null> {

  const documents = await this.model
    .find({ "workspace.workspaceId": workspaceId })
    .lean()
    .exec();

  if (!documents || documents.length === 0) return null;

  return documents.map((doc) =>
    new User({
    _id:doc._id.toString(),
    email: doc.email,
    name: doc.name,
    googleId:   doc.googleId ?? undefined,
    
    } 
    )
  );
}
  async updateOnlineStatus(userId: string): Promise<void> {
    const objectId = new mongoose.Types.ObjectId(userId.toString());
    await this.model.findByIdAndUpdate(
      objectId,
      { isOnline: true },
      { new: true, upsert: true }
    );


  }
  async countUser(): Promise<number> {
    const countUser = await this.model.countDocuments()
    return countUser;
  }
async paginationUser(
  workspaceId: string | ObjectId,
  page: number,
  limit: number,
  skip: number,
  projectId: string | null
): Promise<{ items: UserDoument[] | null; totalItems: number }> {

  const filter: {
    "workspace.workspaceId": string | ObjectId;
    isSuperAdmin: { $ne: boolean };
    name?: { $in: string[] };
  } = {
    "workspace.workspaceId": workspaceId,
    isSuperAdmin: { $ne: true },
  };

  // Apply project filter only if valid projectId exists
  if (
    projectId &&
    projectId.trim() !== "" &&
    projectId !== "null" &&
    projectId !== "undefined"
  ) {
    const convertToMongoObject = stringToMongoObj(projectId);

    const project = await ProjectModel.findById(convertToMongoObject);


    if (project) {
      const assignedUsers: string[] = project.assignedUsers || [];

      if (assignedUsers.length > 0) {
        filter.name = { $in: assignedUsers };
      } else {
        return { items: [], totalItems: 0 };
      }
    }
  }

  const totalItems = await UserModel.countDocuments(filter);

  const items = await UserModel.find(filter)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  return { items, totalItems };
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

  async userVerified(userId: Types.ObjectId, isVerified: boolean, verificationExpiresAt: Date | null): Promise<User | null> {
    const user = await UserModel.findByIdAndUpdate(
      userId,
      {
        isVerified: isVerified,
        verificationExpiresAt: verificationExpiresAt
      },
      { new: true }
    )
    return user as User

  }
  async deleteuserById(userId: Types.ObjectId): Promise<void> {
    await UserModel.findByIdAndDelete(userId)
  }
}

