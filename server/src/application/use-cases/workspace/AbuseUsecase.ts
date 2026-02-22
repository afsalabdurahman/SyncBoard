import { inject, injectable } from "tsyringe";
import { AbuseRequestDTO, GetAllReportsResponseDto, listOfAbsuseReposnseDTO, UpdateAbuseStatusDTO } from "../../dto/AbuseDTO";
import { IAbuseUsecase } from "../../repositories/IAbuse";
import { IAbuseRepository } from "../../../domain/interfaces/repositories/IAbuseRepository";
import { Abuse } from "../../../domain/entities/Abuse";
import { stringToMongoObj } from "../../../utils/convertMongoObject";
import { NotFoundError, ValidationError } from "../../../utils/errors";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { IWorkspaceRepository } from "../../../domain/interfaces/repositories/IWorkspaceRepository";
import { ResponseMessages } from "../../../common/erroResponse";
import { IEmailService } from "../../../domain/interfaces/services/IEmailServices";
import { getStatusBasedMsg } from "../../../utils/abuseMessage";
import { AbuseMapper } from "../../mappers/AbsuseMapper";

@injectable()
export class AbuseUsecase implements IAbuseUsecase  {
constructor(@inject("AbuseRepository")private  _abuseRepository:IAbuseRepository,
@inject("UserRepository") private _userRepository :IUserRepository,
@inject("WorkspaceRepository") private _workspaceRepository :IWorkspaceRepository,
@inject("IEmailService") private _emailService: IEmailService
){}
async execute(input: AbuseRequestDTO,userId:string,workspaceId:string): Promise<string> {
    const abuseEntity = new Abuse({description:input.description,otherType:input.otherType,userId:stringToMongoObj(userId),severity:input.severity,type:input.type,workspaceId:stringToMongoObj(workspaceId),status:"Waiting",})
    if(!abuseEntity) throw new ValidationError("Report"+ResponseMessages.CREATEION_FAILED) 
  await this._abuseRepository.create(abuseEntity)
   return ResponseMessages.SUCCESS 
}
async findAbuseReports(page:number,limit:number,skip:number): Promise<GetAllReportsResponseDto> {
    const reports = await this._abuseRepository.getAllReports(page,limit,skip)
    return reports
}
 async updateStatus(input: UpdateAbuseStatusDTO, reportId: string): Promise<void> {
    
     const workspace=await this._workspaceRepository.findByObjectId(stringToMongoObj(input.workspaceId))
   
     const user = await this._userRepository.findById(input.userId)
      
     if(!workspace || !user)  throw new ValidationError("User or Workspace"+ResponseMessages.NOT_FOUND)
        await this._abuseRepository.updateReport(stringToMongoObj(reportId),input.status);
        const msg=getStatusBasedMsg(input.status);
        if(msg){
this._emailService.sendAbuseStatus(user.email,msg,input.status,user.name)
        }
        
 }
async listOfReports(
  page: number,
  limit: number,
  skip: number,
  userid: string,
  workspaceid: string
): Promise<{
  mappedReponse: listOfAbsuseReposnseDTO[];
  docsize: number;
}> {

  const dbResponse = await this._abuseRepository.findListOfReports(
    page,
    limit,
    skip,
    stringToMongoObj(userid),
    stringToMongoObj(workspaceid)
  );
if(!dbResponse) throw new NotFoundError("fdg;h;odg")
  const mappedReponse = AbuseMapper.entityToResponse(dbResponse.list);

  return {
    mappedReponse,
    docsize: dbResponse.count
  };
}
async searchReport(query: string,workspaceid:string,userid:string): Promise<listOfAbsuseReposnseDTO[]> {
  const result= await this._abuseRepository.serachReport(query,stringToMongoObj(workspaceid),stringToMongoObj(userid))
  return result
}
}