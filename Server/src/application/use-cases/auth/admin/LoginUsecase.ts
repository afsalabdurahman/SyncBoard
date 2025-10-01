import { IUserRepository } from "../../../../domain/interfaces/repositories/IUserRepository";
import { injectable, inject } from "tsyringe";
import { NotFoundError, ValidationError } from "../../../../utils/errors";
import { ILoginUseCase } from "../../../repositories/admin/ILoginUseCase";
import { User } from "../../../../domain/entities/User";
import { IAuthService } from "../../../../domain/interfaces/services/IAuthService";
import {IWorkspaceRepository} from "../../../../domain/interfaces/repositories/IWorkspaceRepository"
import { ISuscription } from "../../../../domain/interfaces/repositories/ISuscriptionRepository";
import { Subscription } from "../../../../domain/entities/Suscription";
@injectable()
export class AdminLoginUseCase implements ILoginUseCase {
  constructor(
    @inject("UserRepository") private _userRepository: IUserRepository,
    @inject("AuthService") private authService: IAuthService,
    @inject("WorkspaceRepository") private workspceRepository:IWorkspaceRepository,
    @inject("SuscriptionRepository")private _suscriptionRepository:ISuscription,
  ) {}
  async execute(email: string, password: string): Promise<any | null> {
    let user: User = await this._userRepository.findByEmail(email);



    if(!user.workspace) throw new NotFoundError("Workspace not found")
    const workspceId:any=user.workspace[0].workspaceId
    if (!user) throw new NotFoundError("Admin not found");
    //
    const isValid = await this.authService.comparePassword(
      password,
      user.password
    );
    if (!isValid) throw new ValidationError("Passwod not match");

   let workspace=await this.workspceRepository.findByObjectId(workspceId)
   if(!user._id) throw new NotFoundError("id is not found")
const isSuscribed = await this._suscriptionRepository.findSuscriptionByUserId(user._id);
 
 let mySuscription;
   if(!isSuscribed){
const entity = new Subscription({
  user: user._id,
  planKey: "free",
  status: "trialing"
});
    mySuscription=this._suscriptionRepository.create(entity)
   }
   let suscribe=isSuscribed?isSuscribed:mySuscription
    return {user,workspace,suscribe};
  }
}
