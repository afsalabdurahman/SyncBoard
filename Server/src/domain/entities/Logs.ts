import {ActivityProps,ActivityType} from "../../types/activityTypes"



export class Activity {
   id?: string;
   workspaceId?: string;
   projectId?: string;
   taskId?: string;
   performedBy?: string;
   affectedUser?: string;
   type: ActivityType;
   message: string;
   metadata: Record<string, any>;
   createdAt: Date;
   updatedAt: Date;

  constructor(props: ActivityProps) {
    this.id = props.id;
    this.workspaceId = props.workspaceId;
    this.projectId = props.projectId;
    this.taskId = props.taskId;
    this.performedBy = props.performedBy;
    this.affectedUser = props.affectedUser;
    this.type = props.type;
    this.message = props.message;
    this.metadata = props.metadata || {};
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }
}