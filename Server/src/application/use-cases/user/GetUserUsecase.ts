import { User } from "../../../domain/entities/User";
import { UserMongooseRepository } from "../../../infrastructure/repositories/UserRepository";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { injectable, inject } from "tsyringe";
@injectable()
export class GetUserUseCase {
  constructor(
    @inject("UserRepository") private userRepository: IUserRepository
  ) {}

  async execute(id: string): Promise<User | null> {
    const Member = await this.userRepository.findById(id);
    if (Member) return Member;
    return null;
  }
}
