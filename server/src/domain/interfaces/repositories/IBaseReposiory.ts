
export interface IBaseRepository<T> {
  create(entity: T): Promise<T|null>;
  

}