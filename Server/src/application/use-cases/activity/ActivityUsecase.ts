import { inject, injectable } from "tsyringe";
import { IActivity } from "../../repositories/IActivity";
import { Activities } from "../../../domain/entities/Activities";
import { IActivityRepository } from "../../../domain/interfaces/repositories/IActivityRepository";
import { NotFoundError } from "../../../utils/errors";
import { IWorkspace } from "../../repositories/iworkspace/IWorkspace";
import mongoose from "mongoose";
import { ResponseMessages } from "../../../common/erroResponse";


@injectable()
export class ActivityUsecase implements IActivity {
  constructor(
    @inject("ActivityRepository")
    private _activityRepository: IActivityRepository,
    @inject("WorkspaceuseCases") private _workspaceUsecase: IWorkspace
  ) {}
  async execute(
    workspaceId: string,
    workspaceName: string,
    createdBy: string
  ): Promise<any> {
    const data = { id: workspaceId, name: workspaceName, createdBy: createdBy };
 

    let createActivity = new Activities({
      workspaceActivities: {
        id: workspaceId,
        createdby: createdBy,
        name: workspaceName,
      },
    });
   
    const result: any =
      await this._activityRepository.createActivity(createActivity);

    if (!result) throw new NotFoundError(ResponseMessages.NOT_FOUND);
    const objectId: any = new mongoose.Types.ObjectId(workspaceId.toString());
    const message = `${workspaceName} Created By ${createdBy}`;
    this._workspaceUsecase.updateWorkspace(objectId, result._id);

    return message;
  }
  async getAllActivities(workspaceId: string): Promise<any> {
   
    const objectId: any = new mongoose.Types.ObjectId(workspaceId.toString());
    let workspaceData = await this._workspaceUsecase.findWorkspace(objectId);
    if (!workspaceData) throw new NotFoundError(ResponseMessages.NOT_FOUND);

    const activityId = workspaceData.logId;
    const result: any =
      await this._activityRepository.findActivities(activityId);
   

    //const name = result[0].workspaceActivities.name;
    //const createdby = result[0].workspaceActivities.map((data)).createdby;
    // console.log(name, "$$name");
    // const WorkspaceActivty=result[0].workspaceActivity.activities.map((data:any)=>{
    //  return{ name: data.name,
    //   creatde:data.createdby}
    // })
    const projectActivtyLogs = result[0].projectActivities.map((data: any) => ({
      messages: data.message,
    }));
    const workspaceLogs = result[0].workspaceActivities.map((data: any) => ({
      messages: `${data.name}Created ${data.createdby}`,
    }));
    const userActivityLogs = result[0].userActivities.map((data: any) => ({
      messages: data.message,
    }));

    return { workspaceLogs, projectActivtyLogs, userActivityLogs };
  }
  async projctActivity(
    projectName: string,
    createdBy: string,
    ActivityId: string
  ) {
    await this._activityRepository.addNewProject(
      projectName,
      createdBy,
      ActivityId
    );
  }
  async userActivity(userName: string, ActivityId: string): Promise<any> {
    await this._activityRepository.inviteMember(userName, ActivityId);
  }
  async findCountofWorkspace(userId: string): Promise<any> {
  }
}
