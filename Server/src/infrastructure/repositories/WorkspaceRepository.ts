import { Workspace } from "../../domain/entities/Workspace";
import { WorkspaceModel } from "../database/models/WorkspaceModel";
import { IWorkspaceRepository } from "../../domain/interfaces/repositories/IWorkspaceRepository";
import { injectable } from "tsyringe";
import { CustomError, InternalServerError } from "../../utils/errors";
import { HttpStatusCode } from "../../common/errorCodes";
import { Types, ObjectId } from "mongoose";
import mongoose from "mongoose";
@injectable()
export class WorkspaceRepository implements IWorkspaceRepository {
  async create(workspace: Workspace): Promise<Workspace> {
    console.log(workspace, "spacee");

    try {
      let document = new Workspace(
        workspace.name,
        workspace.slug,
        workspace.role,
        workspace.ownerId,
        workspace.members,
        workspace.createdAt
      );

      let data = await WorkspaceModel.create(document);

      console.log(data, "from workspce,");
      if (data) return data;
      throw new CustomError("Workspace Exist", HttpStatusCode.CONFLICT);
    } catch (error) {
      throw new InternalServerError("NotFound");
    }
  }

  async findByObjectId(id: Types.ObjectId): Promise<Workspace | null> {
    console.log(id, "iod @repo woks");
    let dbData = await WorkspaceModel.findById(id);

    console.log(dbData, "databsesa");
    return dbData;
  }

  async addMemberToWorkspace(
    slug: string,
    userId: string,
    role: string,
    name: string,
    email: string,
    title: string
  ): Promise<any> {
    const data = { userId: userId, title: title };
    let updatedWorkspce = await WorkspaceModel.findOneAndUpdate(
      { slug },
      { $push: { members: data } }
    );
    return updatedWorkspce;
  }
  async findbySlug(slug: string): Promise<Workspace | any> {
    console.log(slug, "slugg");
    let workspaceData = await WorkspaceModel.findOne({ slug: slug });
    console.log(workspaceData, "work@slug");
    if (workspaceData) {
      return new Workspace(
        workspaceData?.name,
        workspaceData?.slug,
        workspaceData?.role,
        workspaceData?.ownerId,
        workspaceData?.members,
        workspaceData?.createdAt,
        (workspaceData?.id as Types.ObjectId).toString()
      );
    }
  }
}
