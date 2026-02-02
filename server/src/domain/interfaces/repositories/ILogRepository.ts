import { Activities } from "../../entities/Activities";

export interface IActivityRepository {
  create(dto: Activities): Promise<void>;
}
