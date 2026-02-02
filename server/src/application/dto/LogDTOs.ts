import { ActivityTypes } from "../../types/activityTypes";
import { Types } from "mongoose";

export interface CreateActivityDTO {
  workspaceId?: string; 
  projectId?: string;
  taskId?: string;
  performedBy?: string;
  affectedUser?: string;
  type: ActivityTypes;
  message: string;
  metadata?: Record<string, string>;
}

export interface ActivityFilter {
  workspaceId?: string;
  type?: ActivityTypes | ActivityTypes[];
  performedBy?: string;
  affectedUser?: string;
  search?: string; 
  dateFrom?: string; 
  dateTo?: string; 
}

export interface Pagination {
  page?: number; 
  limit?: number;
  sort?: "asc" | "desc"; 
}
