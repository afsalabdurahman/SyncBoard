import {User} from "../../entities/User"
export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(entity: User): Promise<User|any>;
  findById?(id:string):Promise<User>;
}