export enum ActivityType {
  WORKSPACE_CREATED = "WORKSPACE_CREATED",
  PROJECT_CREATED = "PROJECT_CREATED",
  TASK_CREATED = "TASK_CREATED",
  TASK_UPDATED = "TASK_UPDATED",
  MEMBER_JOINED = "MEMBER_JOINED",
  USER_BLOCKED = "USER_BLOCKED",
  USER_UNBLOCKED = "USER_UNBLOCKED",
  USER_SIGNUP = "USER_SIGNUP",
}
export interface ActivityProps {
  id?: string;
  workspaceId?: string;
  projectId?: string;
  taskId?: string;
  performedBy?: string;
  affectedUser?: string;
  type: ActivityType;
  message: string;
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}
