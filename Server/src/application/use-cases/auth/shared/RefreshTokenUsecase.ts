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
@injectable()
export class RefreshTokenUsecase implements IRefreshtoken {
    constructor(
        @inject("UserRepository") private userRepository: IUserRepository,
        @inject("AuthService") private authService: IAuthService
    ) {}

    async exceute(
        RefreshToken: string
    ): Promise<{ accessToken: string; refreshToken: string }> {
        let decoded;
        console.log(RefreshToken,"refresh token from usecase")
        try {
            if (!this.authService.verifyRefreshToken)
                throw new NotFoundError("Verifcation not found");
            let decoded = await this.authService.verifyRefreshToken(RefreshToken);
            console.log(decoded,"@decoded usecase")
            if (!decoded) throw new AuthenticationError("Invalid Token");
            const { userId, role } = decoded;
            const userRole = role as UserRole;
            if (!Object.values(UserRole).includes(userRole)) {
                throw new ForbiddenError("Invalid role in refresh token");
            }
            let userData = await this.userRepository.findById(userId);
            if (!userData) throw new NotFoundError("User not found");
         
console.log(userData,"@useDtaUsecse")
            const newAccessToken = await this.authService.generateToken({
                id: userId,
                email: userData.email,
                role: userData.role,
            });
            console.log(newAccessToken,"new token access @usecase")
            const newRefreshToken = await this.authService.generateRefreshToken({
                id: userId,
                email: userData.email,
                role: userData.role,
            });
console.log(newAccessToken,newRefreshToken,"@tokensss")
            return { accessToken: newAccessToken, refreshToken: newRefreshToken };
        } catch (error) {
            throw new InternalServerError("Something went to wrong");
        }
    }
}
