import { inject, injectable } from "tsyringe"
import { Workspace } from "../../../domain/entities/Workspace"
import { NotFoundError } from "../../../utils/errors"
import { IWokspaceMember } from "../../repositories/IWorkspaceMembers"
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository"
import { IWorkspaceRepository } from "../../../domain/interfaces/repositories/IWorkspaceRepository"
import { ResponseMessages } from "../../../common/erroResponse"
@injectable()
export class GetWorkspaceUsecase implements IWokspaceMember {
   constructor(@inject("WorkspaceRepository") private workspaceRepository: IWorkspaceRepository,
      @inject("UserRepository") private userRepository: IUserRepository
   ) {}

   async getWorkspceDate(slug: string): Promise<Workspace> {
      const workspceData = await this.workspaceRepository.findbySlug(slug)
      if (!workspceData) throw new NotFoundError(ResponseMessages.NOT_FOUND + ' Workspace')
      const users = await this.userRepository.findUsersInsameWorkspace(workspceData.id)

      return users

   }
   async paginationWorkspace(slug: string, page: number, limit: number, skip: number): Promise<any> {
      const workspceData = await this.workspaceRepository.findbySlug(slug)
      const { items, totalItems } = await this.userRepository.paginationUser(workspceData.id, page, limit, skip)
      return { items: items, totalItems }
   }
}