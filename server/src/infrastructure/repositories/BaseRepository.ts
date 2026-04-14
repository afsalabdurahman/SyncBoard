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
  // async create(item: T): Promise<T|null> {

  //   const document = new this.model(item);
  //   const saved = await document.save();
  //     return saved ? saved.toObject() : null;

  // }

  // async findById(id: string): Promise<T | null> {
  //   return this.model.findById(id).lean().exec();
  // }

  // async findAll(): Promise<T[]> {
  //   return this.model.find().lean().exec();
  // }

  // async delete(id: string): Promise<void> {
  //   await this.model.findByIdAndDelete(id);
  // }
}
