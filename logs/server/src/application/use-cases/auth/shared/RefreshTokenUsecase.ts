import { injectable, inject } from "tsyringe";
import { IUserRepository } from "../../../../domain/interfaces/repositories/IUserRepository";
import { IRefreshtoken } from "../../../repositories/ishared/IRefreshToken";
import { IAuthService } from "../../../../domain/interfaces/services/IAuthService";
import {
    NotFoundError,
    AuthenticationError,
    InternalServerError,
    ForbiddenError,
} from "../../../../utils/errors";
import { UserRole } from "../../../../types/userTypes";
import { ResponseMessages } from "../../../../common/erroResponse";
@injectable()
export class RefreshTokenUsecase implements IRefreshtoken {
    constructor(
        @inject("UserRepository") private _userRepository: IUserRepository,
        @inject("AuthService") private _authService: IAuthService
    ) {}

    async exceute(
        RefreshToken: string
    ): Promise<{ accessToken: string; refreshToken: string }> {
        let decoded;
      
        try {
            if (!this._authService.verifyRefreshToken)
                throw new NotFoundError(ResponseMessages.NOT_FOUND);
            let decoded = await this._authService.verifyRefreshToken(RefreshToken);
          
            if (!decoded) throw new AuthenticationError(ResponseMessages.INVALID_TOKEN);
            const { userId, role } = decoded;
            const userRole = role as UserRole;
            if (!Object.values(UserRole).includes(userRole)) {
                throw new ForbiddenError("Invalid role in refresh token");
            }
            let userData = await this._userRepository.findById(userId);
            if (!userData) throw new NotFoundError(ResponseMessages.USER_NOT_FOUND);
         

            const newAccessToken = await this._authService.generateToken({
                id: userId,
                email: userData.email,
                role: userData.role,
            });
            const newRefreshToken = await this._authService.generateRefreshToken({
                id: userId,
                email: userData.email,
                role: userData.role,
            });
            return { accessToken: newAccessToken, refreshToken: newRefreshToken };
        } catch (error) {
            throw new InternalServerError(ResponseMessages.INTERNAL_SERVER_ERROR);
        }
    }
}
