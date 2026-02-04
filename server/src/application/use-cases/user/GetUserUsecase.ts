import { User } from "../../../domain/entities/User";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { injectable, inject } from "tsyringe";
import { NotFoundError } from "../../../utils/errors";
import { ResponseMessages } from "../../../common/erroResponse";
@injectable()
export class GetUserUseCase  {
  constructor(
    @inject("UserRepository") private userRepository: IUserRepository
  ) {}

  async execute(id: string): Promise<User | null> {
    const userDetails = await this.userRepository.findById(id);
    if(!userDetails) throw new NotFoundError(ResponseMessages.USER_NOT_FOUND)
    if (userDetails.role == "Member") return userDetails;
    else if (userDetails.role == "Admin") {
      return userDetails;
    } else if (userDetails.role == "SuperAdmin") {
      return userDetails;
    }
    return null;
  }
}
