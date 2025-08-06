import { inject, injectable } from "tsyringe";
import { IActivity } from "../../repositories/IActivity";
import { Activities } from "../../../domain/entities/Activities";
import { IActivityRepository } from "../../../domain/interfaces/repositories/IActivityRepository";
import { NotFoundError } from "../../../utils/errors";
import { IWorkspace } from "../../repositories/iworkspace/IWorkspace";
import mongoose from "mongoose";
import { Workspace } from "../../../domain/entities/Workspace";

@injectable()
export class ActivityUsecase implements IActivity {
  constructor(
    @inject("ActivityRepository")
    private activityRepository: IActivityRepository,
    @inject("WorkspaceuseCases") private workspaceUsecase: IWorkspace
  ) {}
  async execute(
    workspaceId: string,
    workspaceName: string,
    createdBy: string
  ): Promise<any> {
    const data = { id: workspaceId, name: workspaceName, createdBy: createdBy };
    console.log(data, "@usecaseData");

    let createActivity = new Activities({
      workspaceActivities: {
        id: workspaceId,
        createdby: createdBy,
        name: workspaceName,
      },
    });
    console.log(createActivity, "ACtictyEntity");
    const result: any =
      await this.activityRepository.createActivity(createActivity);

    if (!result) throw new NotFoundError("Result not found");
    const objectId: any = new mongoose.Types.ObjectId(workspaceId.toString());
    const message = `${workspaceName} Created By ${createdBy}`;
    this.workspaceUsecase.updateWorkspace(objectId, result._id);

    return message;
  }
  async getAllActivities(workspaceId: string): Promise<any> {
    const objectId: any = new mongoose.Types.ObjectId(workspaceId.toString());
    let workspaceData = await this.workspaceUsecase.findWorkspace(objectId);
    if (!workspaceData) throw new NotFoundError("Activities not found");

    const activityId = workspaceData.logId;
    const result: any =
      await this.activityRepository.findActivities(activityId);
    console.log(result[0], "resl@ActivityUsecase");

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
    // console.log(projectActivtyLogs, "activities######","workspceName:",workspaceMessageLogs);

    return { workspaceLogs, projectActivtyLogs, userActivityLogs };
  }
  async projctActivity(
    projectName: string,
    createdBy: string,
    ActivityId: string
  ) {
    console.log(projectName, createdBy, ActivityId, "@ActivUsecase");
    await this.activityRepository.addNewProject(
      projectName,
      createdBy,
      ActivityId
    );
  }
  async userActivity(userName: string, ActivityId: string): Promise<any> {
    await this.activityRepository.inviteMember(userName, ActivityId);
  }
}
