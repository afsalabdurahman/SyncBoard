import { CreateActivityDTO, ActivityFilter, Pagination } from "../../../application/dto/LogDTOs";
import {IActivity} from "../../../infrastructure/database/models/LogModel"

export interface IActivityRepository {
  create(dto: any): Promise<any>;
  // findById(id: string): Promise<IActivity | null>;
  // list(filter: ActivityFilter, pagination: Pagination): Promise<{ items: IActivity[]; total: number }>;
  // deleteOlderThan(dateISO: string): Promise<number>; // retention cleanup
}
