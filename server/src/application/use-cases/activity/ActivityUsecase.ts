import { inject, injectable } from "tsyringe";
import { IActivity } from "../../repositories/IActivity";
import { IActivityRepository } from "../../../domain/interfaces/repositories/IActivityRepository";
import { NotFoundError } from "../../../utils/errors";
import { stringToMongoObj } from "../../../utils/convertMongoObject";
import { ActivityMapper } from "../../mappers/ActivityMapper";
import { ResponseMessages } from "../../../common/erroResponse";


@injectable()
export class ActivityUsecase implements IActivity {
  constructor(
    @inject("ActivityRepository")
    private _activityRepository: IActivityRepository,
  ) {}
  async myLogs(workspaceId: string): Promise<string[]|null> {
    const activty=await this._activityRepository.allActivitiesInWorkspace( stringToMongoObj( workspaceId))
   if(!activty) throw new NotFoundError(ResponseMessages.NO_CONTENT) 
    const responseDTO=ActivityMapper.mapToResponseDto(activty)
    return responseDTO
  }
 
}
