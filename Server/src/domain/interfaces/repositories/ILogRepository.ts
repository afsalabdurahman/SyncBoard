import { CreateActivityDTO, ActivityFilter, Pagination } from "../../../application/dto/LogDTOs";
import { Activities } from "../../entities/Activities";

export interface IActivityRepository {
  create(dto: Activities): Promise<void>;
}
