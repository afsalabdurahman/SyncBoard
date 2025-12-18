import { injectable, inject } from "tsyringe";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { CustomError } from "../../../utils/errors";
import { IUpdateProfileUsecases } from "../../repositories/IUpdateProfile";
import { User } from "../../../domain/entities/User";
import { HttpStatusCode } from "../../../common/errorCodes";
@injectable()
export class UpdateUserProfileUsecase implements IUpdateProfileUsecases {
  constructor(
    @inject("UserRepository") private _userRepository: IUserRepository
  ) {}
  async execute(
    userId: string,
    ...args: Record<string, any>[]
  ): Promise<User> {

    const merged = Object.assign({}, ...args);

    let updatedUser = await this._userRepository.updateProfile(userId, merged);

    if (!updatedUser) {
      throw new CustomError("Profile Updation Failed", HttpStatusCode.CONFLICT);
    }
    return updatedUser;
  }
  async updateOnlineStatus(userId: string): Promise<void> {
    await this._userRepository.updateOnlineStatus(userId)
  }
  async logoutUser(userId: string): Promise<boolean> {
    await this._userRepository.updateOnlineStatus(userId)
    return true
    
  }
}
