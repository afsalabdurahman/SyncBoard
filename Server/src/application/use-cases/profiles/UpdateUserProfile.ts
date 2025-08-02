import { injectable, inject } from "tsyringe";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { CustomError } from "../../../utils/errors";
import { IUpdateProfileUsecases } from "../../repositories/IUpdateProfile";
import { User } from "../../../domain/entities/User";
import { HttpStatusCode } from "../../../common/errorCodes";
@injectable()
export class UpdateUserProfileUsecase implements IUpdateProfileUsecases {
  constructor(
    @inject("UserRepository") private userRepository: IUserRepository
  ) {}
  async execute(
    userId: string,
    ...args: Record<string, any>[]
  ): Promise<User | any> {
   
    const merged = Object.assign({}, ...args);
   
    let updatedUser = await this.userRepository.updateProfile(userId, merged);
  
    if (!updatedUser) {
      throw new CustomError("Profile Updation Failed", HttpStatusCode.CONFLICT);
    }
    return updatedUser;
  }
 async  updateOnlineStatus(userId: string): Promise<void> {
   await this.userRepository.updateOnlineStatus(userId)
  }
}
