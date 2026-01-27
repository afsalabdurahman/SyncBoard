export enum ActivityLogMessage {
  WORKSPACE_CREATED = "Workspace created",
  PROJECT_CREATED = "Project created",
  TASK_CREATED = "Task created",
  TASK_UPDATED = "Task updated",
  MEMBER_JOINED = "Member joined",
  USER_BLOCKED = "User blocked",
  USER_UNBLOCKED = "User unblocked",
  USER_SIGNUP = "User signup",
}

export type ActivityTypes = 
  | "workspace" 
  | "user" 
  | "project" 
  | "task";


