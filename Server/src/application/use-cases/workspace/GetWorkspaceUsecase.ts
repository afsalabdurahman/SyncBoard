import { inject,injectable } from "tsyringe"
import {Workspace} from "../../../domain/entities/Workspace"
import {NotFoundError} from "../../../utils/errors"
import {IWokspaceMember} from "../../repositories/IWorkspaceMembers"
import {IUserRepository} from "../../../domain/interfaces/repositories/IUserRepository"
import {IWorkspaceRepository} from "../../../domain/interfaces/repositories/IWorkspaceRepository"
@injectable()
export class GetWorkspaceUsecase implements IWokspaceMember{
constructor(@inject("WorkspaceRepository")private workspaceRepository:IWorkspaceRepository,
@inject("UserRepository")private userRepository:IUserRepository
){}

async getWorkspceDate(slug: string): Promise<Workspace> {
    if(!this.workspaceRepository.findbySlug) throw new NotFoundError("Not found Repo")
      const workspceData = await this.workspaceRepository.findbySlug(slug)
    console.log(workspceData,"wprData++++")
    if(!workspceData) throw new NotFoundError("Workspace not found")
   const users = await this.userRepository.findUsersInsameWorkspace(workspceData.id)
console.log(users,"usecases")
    
    return users
    
}
}