import { Activities } from "../../domain/entities/Activities";
import { ActivitiesReqestDTO, ActivitiesResponseDTO } from "../dto/ActivityDTO";
import { timeAgo } from "../../utils/dateCoverter";

export class ActivityMapper {
  static CreateMappedEntities(input: ActivitiesReqestDTO) {
    return new Activities({ activityType: input.activityType, createdby: input.createdBy, logMsg: input.logMsg, workspaceId: input.workspaceId })
  }
  static mapToResponseDto(input: ActivitiesResponseDTO[]) {

    const responseDTO = input.map((activiy) => {

      const message = `New ${activiy.logMsg} by ${activiy.userName} ${timeAgo(activiy.createdAt)}`
      return message
    })
    return responseDTO
  }
}