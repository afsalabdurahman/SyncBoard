import { injectable, inject } from "tsyringe";
import { IWorkspaceRepository } from "../../../domain/interfaces/repositories/IWorkspaceRepository";
import { Workspace } from "../../../domain/entities/Workspace";
import { HttpStatusCode } from "../../../common/errorCodes";
import { ConflictError } from "../../../utils/errors";
import { ResponseMessages } from "../../../common/erroResponse";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { Types } from "mongoose";
import { IWorkspace } from "../../repositories/iworkspace/IWorkspace";

@injectable()
export class CreateWorkspaceUsecases implements IWorkspace {
  constructor(
    @inject("WorkspaceRepository")
    private workspaceRepository: IWorkspaceRepository,
    @inject("IUserRepository") private userRepository: IUserRepository
  ) {}

  async createWorksapce(
    workspaceData: any,
    userId: any,
    title: string,
    value: string
  ): Promise<Workspace | any> {
    try {
      let isCreate = await this.workspaceRepository.create(workspaceData);
      //update user title
      let user = await this.userRepository.updateUser(
        userId,
        (title = "title"),
        value
      );

      return { isCreate, user };
    } catch (error) {
      console.log(error, "from useses");
      throw error;
    }
  }
  async findWorkspace(id: Types.ObjectId): Promise<any> {
    let data = await this.workspaceRepository.findByObjectId(id);
    console.log(data, "workspceusecse");
    return data;
  }
}
