import { IUserRepository } from "../../../../domain/interfaces/repositories/IUserRepository";
import { IAuthService } from "../../../../domain/interfaces/services/IAuthService";
import { injectable, inject } from "tsyringe";
import { NotFoundError, ValidationError,ConflictError } from "../../../../utils/errors";
import { IAuth } from "../../../repositories/iauth/IAuth";
import { AdminSignupRequestDTO } from "../../../dto/AuthDTOs";
import { AuthMapper } from "../../../mappers/AuthMapper";
import { ResponseMessages } from "../../../../common/erroResponse";
import { IEmailService } from "../../../../domain/interfaces/services/IEmailServices";
import { IOtpRepository } from "../../../../domain/interfaces/repositories/IOtpRepository";
import { OTP } from "../../../../domain/entities/Otp";
import { User } from "../../../../domain/entities/User";
import { stringToMongoObj } from "../../../../utils/convertMongoObject";
import { OAuth2Client } from "google-auth-library";
import { envConfig } from "../../../../infrastructure/config/env.config";
import { Workspace } from "../../../../domain/entities/Workspace";
import { IWorkspaceRepository } from "../../../../domain/interfaces/repositories/IWorkspaceRepository";


@injectable()
export class RegisterUseCase implements IAuth {
   private client = new OAuth2Client(envConfig.GOOGLE_CLIENT_ID);

  constructor(
    @inject("AuthService") private _authService: IAuthService,
    @inject("UserRepository") private _userRepository: IUserRepository,
       @inject("OTPRepository") private _otpRepository: IOtpRepository,
           @inject("IEmailService") private _emailService: IEmailService,
               @inject("WorkspaceRepository") private _workspceRepository: IWorkspaceRepository,
           
  ) {}
  async execute(
    input: AdminSignupRequestDTO
  ): Promise<User> {
    const isValid = AuthMapper.registerValidation(input);
    if (!isValid.success) throw new ValidationError( isValid.error.issues[0].message);
    const existingUser = await this._userRepository.findByEmail(input.email);
    console.log(existingUser,"udreEXISTTT")

    if (existingUser) {
    if (existingUser.isVerified) {
      throw new ConflictError(ResponseMessages.USER_EXISTS);
    }else{
 await this._otpRepository.deleteOTP(input.email);
 await this._userRepository.deleteuserById(stringToMongoObj(existingUser._id??""));
    }

  }
    // if(!existingUser?.isVerified&&existingUser?._id){
    //    console.log("isworking....")
    //       await this._userRepository.deleteuserById(stringToMongoObj(existingUser?._id));
       
    //     }else{
    // if (existingUser) throw new ConflictError  (ResponseMessages.USER_EXISTS);

    //     }
  
    const hashedPassword = await this._authService.hashPassword(input.password as string);
    input.password = hashedPassword;
    const AdminEntity = AuthMapper.mapUserToEntity(input)

console.log(AdminEntity,"entity")
    const savedUser = await this._userRepository.create(AdminEntity);
    //    const findOTP = await this._otpRepository.findOTPbyEMAIL(input.email);
    //   if (findOTP) {
    //   await this._otpRepository.deleteOTP(input.email)
    // }
    console.log(savedUser,"Save")
  const otp = this._otpRepository.generateOTP();
   //  await this._emailService.sendOtp(input.email, otp);

    const SaveOtp = new OTP(input.email, otp);
    await this._otpRepository.save(SaveOtp);
    if (!savedUser) throw new NotFoundError(ResponseMessages.NO_CONTENT);
    // const token = this._authService.generateToken({
    //   id: savedUser._id!,
    //   email: savedUser.email!,
    //   role: savedUser.role!,
    // });
    // const refreshToken = this._authService.generateRefreshToken({
    //   id: savedUser._id!,
    //   email: savedUser.email!,
    //   role: savedUser.role!,
    // });
   // await this._userRepository.updateOnlineStatus(savedUser._id??"")
    return savedUser

  }
  async googleAuth(credential: string): Promise<{workspace:Workspace|null,savedUser:User,token:string,refreshToken:string}> {

    
     const ticket = await this.client.verifyIdToken({
       idToken: credential,
       audience: process.env.GOOGLE_CLIENT_ID,
     });
     console.log(ticket)
     const payload = ticket.getPayload();
     const { sub: googleId, email, name, picture } = payload;
     const newUser:User={
      name,
      email,
      googleId,
      isVerified:true,
      role:"Admin"
     }
         const existingUser = await this._userRepository.findByEmail(email);
if(existingUser?.googleId){
  if(existingUser.workspace?.[0]?.workspaceId){

  
const token = this._authService.generateToken({
       id: existingUser._id!,
       email: existingUser.email!,
       role: existingUser.role!,
     });
     const refreshToken = this._authService.generateRefreshToken({
       id: existingUser._id!,
       email: existingUser.email!,
       role: existingUser.role!,
     });

         const workspaceData = await this._workspceRepository.findByObjectId(existingUser.workspace[0].workspaceId)
    if (!workspaceData) throw new NotFoundError(ResponseMessages.NO_CONTENT)

     return {workspace:workspaceData,savedUser:existingUser,token,refreshToken}
}else{
    const token = this._authService.generateToken({
       id: existingUser._id!,
       email: existingUser.email!,
       role: existingUser.role!,
     });
     const refreshToken = this._authService.generateRefreshToken({
       id: existingUser._id!,
       email: existingUser.email!,
       role: existingUser.role!,
     });
    await this._userRepository.updateOnlineStatus(existingUser._id??"");
    return {workspace:null,savedUser:existingUser,token,refreshToken}
}

}
    const savedUser = await this._userRepository.create(newUser);
    if(!savedUser) throw new ConflictError("Registration failed")
   const token = this._authService.generateToken({
       id: savedUser._id!,
       email: savedUser.email!,
       role: savedUser.role!,
     });
     const refreshToken = this._authService.generateRefreshToken({
       id: savedUser._id!,
       email: savedUser.email!,
       role: savedUser.role!,
     });
    await this._userRepository.updateOnlineStatus(savedUser._id??"");
    return {workspace:null,savedUser,token,refreshToken}
 
}
}
