import { inject, injectable } from "tsyringe"
import { NotFoundError } from "../../../utils/errors"
import { IWokspaceMember } from "../../repositories/IWorkspaceMembers"
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository"
import { IWorkspaceRepository } from "../../../domain/interfaces/repositories/IWorkspaceRepository"
import { ResponseMessages } from "../../../common/erroResponse"
import { UserDoument } from "../../../infrastructure/database/models/UserModel"
import { stringToMongoObj } from "../../../utils/convertMongoObject"
import { UserResponseDTO } from "../../dto/SuperDTO"
import { User } from "../../../domain/entities/User"
@injectable()
export class GetWorkspaceUsecase implements IWokspaceMember {
   constructor(@inject("WorkspaceRepository") private workspaceRepository: IWorkspaceRepository,
      @inject("UserRepository") private userRepository: IUserRepository
   ) { }

   async getWorkspceDate(slug: string): Promise<User[] | null> {
      const workspceData = await this.workspaceRepository.findbySlug(slug)
      if (!workspceData || !workspceData._id) throw new NotFoundError(ResponseMessages.NO_CONTENT + ' Workspace')
      const users = await this.userRepository.findUsersInsameWorkspace(stringToMongoObj(workspceData._id.toString()))
      return users

   }
   async paginationWorkspace(slug: string, page: number, limit: number, skip: number,projectId:string|null): Promise<{ items: UserDoument[] | null, totalItems: number }> {
      const workspceData = await this.workspaceRepository.findbySlug(slug)
      if (!workspceData || !workspceData._id) throw new NotFoundError(ResponseMessages.NO_CONTENT)
      const { items, totalItems } = await this.userRepository.paginationUser(workspceData._id, page, limit, skip,projectId)
      return { items: items, totalItems }
   }
  async  getMembers(slug: string,  query: string) :Promise<UserResponseDTO[]>{
          const workspceData = await this.workspaceRepository.findbySlug(slug);
            if (!workspceData || !workspceData._id) throw new NotFoundError(ResponseMessages.NO_CONTENT + ' Workspace');
               const users=await this.userRepository.searchUser(stringToMongoObj(workspceData._id.toString()),query);
               return users
   }
}