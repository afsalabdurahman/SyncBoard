import { Workspace } from "../../domain/entities/Workspace";
import { WorkspaceDoument, WorkspaceModel } from "../database/models/WorkspaceModel";
import { IWorkspaceRepository } from "../../domain/interfaces/repositories/IWorkspaceRepository";
import { injectable } from "tsyringe";
import { Types } from "mongoose";
import mongoose from "mongoose";
import { UserDoument, UserModel } from "../database/models/UserModel";
import { UserInWorkspaceDTO } from "../../application/dto/UserDTO";
import { ProjectModel } from "../database/models/ProjectModel";
import { stringToMongoObj } from "../../utils/convertMongoObject";

@injectable()
export class WorkspaceRepository implements IWorkspaceRepository {
  async create(workspaceEntity: Workspace): Promise<Workspace | null> {
    const workspace = await WorkspaceModel.create(workspaceEntity)
    return workspace.toObject() as unknown as Workspace ?? null

  }

  async findByObjectId(id: Types.ObjectId): Promise<Workspace | null> {

    const workspace = await WorkspaceModel.findById(id).lean().exec();

    if (!workspace) return null;
    return workspace as unknown as Workspace;



  }

  async addMemberToWorkspace(
    slug: string,
    userId: string,
    title: string,
    permission: string,
    role: string,

  ): Promise<Workspace | null> {
    const data = { userId: userId, title: title, permissions: permission, role: role };
    console.log(data, "addTOWorkspace")
    const updatedWorkspce = await WorkspaceModel.findOneAndUpdate(
      { slug },
      { $push: { members: data } }, { new: true }
    ).lean().exec()
    if (!updatedWorkspce) return null;
    return new Workspace({ ...updatedWorkspce, _id: updatedWorkspce._id?.toString(), ownerId: updatedWorkspce.ownerId.toString(), members: updatedWorkspce.members.map(m => ({ ...m, permissions: m.permissions as "Admin" | "Viewer" | "Member"  })) });

  }

  async findbySlug(slug: string): Promise<Workspace | null> {

    const workspace = await WorkspaceModel.findOne({ slug: slug }).lean().exec();
    if (!workspace) return null;
    return workspace as unknown as Workspace;
  }
  async addlogId(workspaceId: mongoose.Types.ObjectId, logId: mongoose.Types.ObjectId): Promise<boolean> {
    await WorkspaceModel.updateOne({ _id: workspaceId }, { $set: { logId: logId } }, { upsert: true })

    return true
  }
  async updateWorkspaceDate(workspaceId: string, merge: Record<string, string>): Promise<Workspace | null> {
    const objectId = new mongoose.Types.ObjectId(workspaceId);
    const updatedWorkspce = await WorkspaceModel.findOneAndUpdate(
      { _id: objectId },
      { $set: merge },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );
    if (!updatedWorkspce) return null;
    return updatedWorkspce as unknown as Workspace;

  }
  async findAll(): Promise<WorkspaceDoument[]> {
    const workspaceData = await WorkspaceModel.find({}).lean().exec()
    return workspaceData
  }
  async findWorkspacesByUserId(userId: string): Promise<{ id: string; name: string }[] | null> {
    const user = await UserModel.findById(userId).populate("workspace.workspaceId", "_id name")
    const list = user?.workspace.map((work) => {
      const workspace = work.workspaceId as unknown as { _id: Types.ObjectId; name: string };
      return {
        id: workspace._id.toString(),
        name: workspace.name,
      };
    });
    return list ?? null


  }
 async updatePermissions(
  workspaceId: Types.ObjectId,
  userId: Types.ObjectId,
  permission: string
): Promise<void> {

  // Update workspace document
  await WorkspaceModel.findOneAndUpdate(
    {
      _id: workspaceId,
      "members.userId": userId
    },
    {
      $set: {
        "members.$.permissions": permission
      }
    },
    {
      new: true
    }
  );

  // Update user document
  await UserModel.findOneAndUpdate(
    {
      _id: userId,
      "workspace.workspaceId": workspaceId
    },
    {
      $set: {
        "workspace.$.permissions": permission
      }
    },
    {
      new: true
    }
  );
}
async findPermisssion(
  workspaceId: Types.ObjectId,
  userId: Types.ObjectId
): Promise<string> {
  const workspace = await WorkspaceModel.findOne(
    {
      _id: workspaceId,
      "members.userId": userId,
    },
    {
      "members.$": 1
    }
  ).lean();

  return workspace?.members?.[0]?.permissions ?? "Member";
}

async updateUserDataInWorkspace(workspaceId: Types.ObjectId, userId: Types.ObjectId, data: UserInWorkspaceDTO): Promise<void> {
  console.log(workspaceId,userId,data,"77777")
  const setData: Record<string, unknown> = {};
     Object.entries(data).forEach(([key, value]) => {
    setData[`members.$.${key}`] = value;
  });
  await WorkspaceModel.updateOne(
    {
      _id: workspaceId,
      "members.userId": userId
    },
    {
      $set: setData
    }
  );


}
async paginationUserInWorkspace(
  workspaceId: string | Types.ObjectId,
  page: number,
  limit: number,
  skip: number,
  projectId: string | null
): Promise<{ items: UserDoument[] | null; totalItems: number }> {

  const workspace = await WorkspaceModel.findById(workspaceId);

  if (!workspace) {
    return { items: [], totalItems: 0 };
  }

  let memberIds = workspace.members
    .filter(member => !member.isDeleted)
    .map(member => member.userId);

  // Project filter
  if (
    projectId &&
    projectId.trim() !== "" &&
    projectId !== "null" &&
    projectId !== "undefined"
  ) {
    const project = await ProjectModel.findById(
      stringToMongoObj(projectId)
    );

    if (project) {
      memberIds = memberIds.filter(id =>
        project.assignedUsers.includes(id.toString())
      );
    }
  }

  const filter = {
    _id: { $in: memberIds },
    isSuperAdmin: { $ne: true },
  };

  const totalItems = await UserModel.countDocuments(filter);

  const workspaceObjectId =
    typeof workspaceId === "string"
      ? stringToMongoObj(workspaceId)
      : workspaceId;

  const items  = await WorkspaceModel.aggregate([
  {
    $match: {
      _id: workspaceObjectId
    }
  },
  {
    $unwind: "$members"
  },
  {
    $lookup: {
      from: "users",
      localField: "members.userId",
      foreignField: "_id",
      as: "user"
    }
  },
  {
    $unwind: "$user"
  },
  {
    $project: {
      _id: "$user._id",
      name: "$user.name",
      email: "$user.email",
      profileImage: "$user.imageUrl",

      title: "$members.title",
      permissions: "$members.permissions",
      role: "$members.role",
      isBlocked: "$members.isBlocked",
      isDeleted:"$members.isDeleted",
      isOnline: "$members.isOnline"
    }
  },
  {
    $skip: skip
  },
  {
    $limit: limit
  }
]);

  return { items, totalItems };
}
async findUserStatusInWorkspace(
  userId: Types.ObjectId,
  workspaceId: Types.ObjectId
): Promise<UserInWorkspaceDTO | null> {
  const workspace = await WorkspaceModel.findById(workspaceId).lean();

  if (!workspace) {
    return null;
  }

  const member = workspace.members.find(
    (member) => member.userId.toString() === userId.toString()
  );

  if (!member) {
    return null;
  }

  return {
   
    permission: member.permissions,
    isBlocked: member.isBlocked,
    isDeleted: member.isDeleted,
    isOnline: member.isOnline,
  };
}
async findActiveWorkspace(
  userId: Types.ObjectId
): Promise<Workspace | null> {
  return await WorkspaceModel.findOne({
    status: "Active",
    members: {
      $elemMatch: {
        userId,
        isDeleted: false,
        isBlocked: false,
      },
    },
  });
}
}
