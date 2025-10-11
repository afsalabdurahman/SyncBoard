export class BaseRepository<T> {
  protected model: any;

  constructor(model: any) {
    this.model = model;
  }

  async create(item: T): Promise<T> {
    console.log(item, "items in Baerepos")
    const document = new this.model(item);
    const saved = await document.save();
    return saved.toObject();
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).lean().exec();
  }

  // async findAll(): Promise<T[]> {
  //   return this.model.find().lean().exec();
  // }

  // async delete(id: string): Promise<void> {
  //   await this.model.findByIdAndDelete(id);
  // }
}
