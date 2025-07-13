import { Workspace } from "../../domain/entities/Workspace";
import {WorkspaceModel} from "../database/models/WorkspaceModel"
import { IWorkspaceRepository } from "../../domain/interfaces/repositories/IWorkspaceRepository"
import { injectable } from "tsyringe";
import {CustomError,InternalServerError} from "../../utils/errors"
import {HttpStatusCode} from "../../common/errorCodes"

@injectable()
export class WorkspaceRepository implements IWorkspaceRepository {
async create(workspace:Workspace): Promise<Workspace> {
    console.log(workspace,"spacee")
    
    try {
       let document = new Workspace(
        workspace.name,
        workspace.slug,
        workspace.role,
        workspace.ownerId,
        workspace.members,
        workspace.createdAt
    ) 
       
        let data = await WorkspaceModel.create(document);
        if (data) return data;
        throw new CustomError("Workspace Exist", HttpStatusCode.CONFLICT);
    } catch (error) {
       throw new InternalServerError ("NotFound");
    }
}
}