import { IUserRepository } from "../../../../domain/interfaces/repositories/IUserRepository";
import { injectable, inject } from "tsyringe";
import { ForbiddenError, NotFoundError, ValidationError } from "../../../../utils/errors";
import { ILoginUseCase } from "../../../repositories/admin/ILoginUseCase";
import { IAuthService } from "../../../../domain/interfaces/services/IAuthService";
import { IWorkspaceRepository } from "../../../../domain/interfaces/repositories/IWorkspaceRepository"
import { ISuscription } from "../../../../domain/interfaces/repositories/ISuscriptionRepository";
import { Subscription } from "../../../../domain/entities/Suscription";
import { adminResponseDTO, LoginRequestDTO, SuperadminLoginResponseDTO, } from "../../../dto/AuthDTOs";
import { ResponseMessages } from "../../../../common/erroResponse";
import { envConfig } from "../../../../infrastructure/config/env.config";
import { OAuth2Client } from "google-auth-library";
import { User } from "../../../../domain/entities/User";
import { stringToMongoObj } from "../../../../utils/convertMongoObject";
import { Workspace } from "../../../../domain/entities/Workspace";

@injectable()
export class AdminLoginUseCase implements ILoginUseCase {
  private client = new OAuth2Client(envConfig.GOOGLE_CLIENT_ID);
  constructor(
    @inject("UserRepository") private _userRepository: IUserRepository,
    @inject("AuthService") private _authService: IAuthService,
    @inject("WorkspaceRepository") private _workspceRepository: IWorkspaceRepository,
    @inject("SuscriptionRepository") private _suscriptionRepository: ISuscription,
  ) {}

  async execute(userId:string,workspaceId:string): Promise<adminResponseDTO> {
   const user = await this._userRepository.findUser(userId) as User
     const workspace = await this._workspceRepository.findByObjectId(stringToMongoObj(workspaceId))  as Workspace
         const isSuscribed = await this._suscriptionRepository.findSuscriptionByUserId(userId);
         let mySuscription;
     if (!isSuscribed) {
       const entity = new Subscription({
         user: userId,
         workspace: workspaceId,
         planKey: "free",
         status: "trialing"
       });
       mySuscription = await this._suscriptionRepository.create(entity)
     }
     const suscribe = isSuscribed ? isSuscribed : mySuscription as Subscription
    return {user,workspace,suscribe}  
    
     // if (!workspace || !workspace.status) throw new NotFoundError(ResponseMessages.WORKSPACE_NOT_FOUND)
     // const isExist = await this._userRepository.findByEmail(input.email);
    // if (!isExist?._id || !isExist.workspace?.length) throw new NotFoundError(ResponseMessages.WORKSPACE_NOT_FOUND)
    // const user = await this._userRepository.findUser(isExist?._id)
    // // if (!user || !user.workspace) throw new NotFoundError(ResponseMessages.NO_CONTENT)
    // //const workspceId = user.workspace[0].workspaceId
    // if (!user) throw new NotFoundError(ResponseMessages.USER_NOT_FOUND);
    // const isValid = await this._authService.comparePassword(
    //   input.password,
    //   user.password!
    // );
    // if (!isValid) throw new ValidationError(ResponseMessages.PASSWORD_FAILED);

   
    // console.log(workspace,"WORKPSCEPE")
    // if (!workspace || !workspace.status) throw new NotFoundError(ResponseMessages.WORKSPACE_NOT_FOUND)
    // if (workspace?.status.toLowerCase() == "suspend") throw new ForbiddenError("Workspace not found")
    // if (!user._id || !workspace?._id) throw new NotFoundError(ResponseMessages.USER_NOT_FOUND)
    // const isSuscribed = await this._suscriptionRepository.findSuscriptionByUserId(user._id);

    // let mySuscription;
    // if (!isSuscribed) {
    //   const entity = new Subscription({
    //     user: user._id,
    //     workspace: workspace._id?.toString(),
    //     planKey: "free",
    //     status: "trialing"
    //   });
    //   mySuscription = await this._suscriptionRepository.create(entity)
    // }
    // const suscribe = isSuscribed ? isSuscribed : mySuscription;

    // const token = await this._authService.generateToken({
    //   id: user._id!,
    //   email: user.email!,
    //   role:"Admin"
    
    // });

    // const refreshToken = await this._authService.generateRefreshToken({
    //   id: user._id!,
    //   email: user.email!,
    //  role:"Admin"
    // });



  }

  async googleAuthAdmin(credential: string): Promise<adminResponseDTO | null> {


    const ticket = await this.client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.sub || !payload?.email) throw new ValidationError("Invalid Google token payload");
    const googleId = payload.sub;
    const email = payload.email;

    const existingUser = await this._userRepository.findByEmail(email);
    if (existingUser?.googleId == googleId) {
      if (existingUser?.workspace?.[0]?.workspaceId) {

        const token = this._authService.generateToken({
          id: existingUser._id!,
          email: existingUser.email!,
          role:"Admin"
       
        });
        const refreshToken = this._authService.generateRefreshToken({
          id: existingUser._id!,
          email: existingUser.email!,
          role:"Admin"
        
        });

        const workspaceData = await this._workspceRepository.findByObjectId(existingUser?.workspace[0].workspaceId)
        if (!workspaceData) throw new NotFoundError(ResponseMessages.NO_CONTENT)
        const isSuscribed = await this._suscriptionRepository.findSuscriptionByUserId(existingUser?._id ?? "");
        let mySuscription;
        if (!isSuscribed) {
          const entity = new Subscription({
            user: existingUser._id as string,
            workspace: workspaceData._id?.toString() as string,
            planKey: "free",
            status: "trialing"
          });
          mySuscription = await this._suscriptionRepository.create(entity)
        }
        const suscribe = isSuscribed ? isSuscribed : mySuscription;
        return { user: existingUser, workspace: workspaceData, suscribe, token, refreshToken } as adminResponseDTO
      }
    }
    return null;
  }

  async superAdmin(input: LoginRequestDTO): Promise<SuperadminLoginResponseDTO | null> {
    const isExist = await this._userRepository.findByEmail(input.email)
console.log(isExist,"EXTANCE+++++")
    if (!isExist) throw new NotFoundError(ResponseMessages.USER_NOT_FOUND);
    if (!isExist.isSuperAdmin) throw new NotFoundError(ResponseMessages.USER_NOT_FOUND);
    const superAdmin = await this._userRepository.findUser(isExist?._id ?? "") as User


    const isValid = await this._authService.comparePassword(
      input.password,
      superAdmin.password ?? ""
    );
    console.log(isValid, "validdd")

    if (!isValid) throw new ValidationError(ResponseMessages.PASSWORD_FAILED);


    const token = this._authService.generateToken({
      id: superAdmin._id ?? "",
      email: superAdmin.email!,
   role:superAdmin.isSuperAdmin?"SuperAdmin":"Member"
    })
    if (!token) throw new ValidationError(ResponseMessages.INVALID_TOKEN)
    const refreshToken = this._authService.generateRefreshToken({
      id: superAdmin._id!,
      email: superAdmin.email!,
      role:superAdmin.isSuperAdmin?"SuperAdmin":"Member"
   
    });
    if (!refreshToken) throw new ValidationError(ResponseMessages.USER_NOT_FOUND + 'Refresh Token')

    return { token, refreshToken, superAdmin }
  }


}
