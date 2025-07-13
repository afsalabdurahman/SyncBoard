import { UserModel, IUser } from "../database/models/UserModel";
import { IUserRepository } from "../../domain/interfaces/repositories/IUserRepository";
import { User } from "../../domain/entities/User";
// import { DatabaseConfig } from "../config/DatabaseConfig";
import { injectable, inject } from "tsyringe";
import { Types, ObjectId } from "mongoose";

@injectable()
export class UserMongooseRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    try {
      const document = await UserModel.findOne({ email }).exec();
      console.log(document, "check exist or not ");
      if (!document) return null;
      return new User(
        document.email,
        document.password,
        document.name,
        document.role as "Member" | "Admin" | "SuperAdmin",
        document.createdAt,
        document.updatedAt
        // document.imageUrl
      );
    } catch (error) {
      console.error(`Error finding user by email ${email}:`, error);
      throw new Error("Failed to find user");
    }
  }

  async create(entity: User): Promise<User | any> {
    try {
      const document = new UserModel({
        email: entity.email,
        password: entity.password,
        name: entity.name,
        role: entity.role,
       
      });
      // Ensure mongoose connection is open before saving
      if (UserModel.db.readyState !== 1) {
        throw new Error("Database connection is not open");
      }
      const savedDocument = await document.save();
      console.log(savedDocument, "dsaved doc");
      return new User(
        savedDocument.email,
        savedDocument.password,
        savedDocument.name,
        savedDocument.role as "Member" | "Admin" | "SuperAdmin",
        savedDocument.createdAt,
        savedDocument.updatedAt,
       (savedDocument._id as Types.ObjectId).toString()
        // savedDocument._id.toString()
        // savedDocument.profileImage
      );
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Failed to create user");
    }
  }
}
