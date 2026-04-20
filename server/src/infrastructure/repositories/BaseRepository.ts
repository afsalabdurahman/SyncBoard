import {  Model } from "mongoose";
import { IBaseRepository } from "../../domain/interfaces/repositories/IBaseReposiory";

export abstract class BaseRepository<T> implements IBaseRepository<T> {
  protected model: Model<T>;

  constructor(model: any) {
    this.model = model;
  }
  async create(entity: T): Promise<T | null> {
    return await this.model.create(entity)
  }
  

  async delete(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id);
  }
}
