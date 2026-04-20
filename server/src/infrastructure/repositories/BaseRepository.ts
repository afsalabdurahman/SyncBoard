import {  Model,Document } from "mongoose";
import { IBaseRepository } from "../../domain/interfaces/repositories/IBaseReposiory";

export abstract class BaseRepository<T, Doc extends Document = Document> implements IBaseRepository<T> {
  protected model: Model<Doc>;

  constructor(model: Model<Doc>) {
    this.model = model;
  }
  async create(entity: T): Promise<T | null> {
    const createdDocument: Doc = await this.model.create(entity);
  return createdDocument.toObject({ versionKey: false }) as T;
  }
  

  async delete(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id);
  }
}
