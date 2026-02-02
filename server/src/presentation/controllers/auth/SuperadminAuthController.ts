import { Request, Response, NextFunction, response } from "express";
import { LoginRequestDTO, SuperadminResponseDTO } from "../../../application/dto/AuthDTOs";
import { inject,injectable } from "tsyringe";
import { ILoginUseCase } from "../../../application/repositories/admin/ILoginUseCase";
import { setTokensInCookies } from "../../../utils/CookieUtile";
import { ValidationError } from "../../../utils/errors";
@injectable()
export class SuperadminAuthController{
   constructor(@inject("ILoginUsesCase") private _loginUseCase: ILoginUseCase){}

    async LoginUsesCase(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
   try {
  
       let input:LoginRequestDTO = req.body as LoginRequestDTO;


    const reponseDTO=await this._loginUseCase.superAdmin(input);

     if(!reponseDTO?.token || !reponseDTO.refreshToken) throw new ValidationError("Validation failed")
       setTokensInCookies(res,reponseDTO?.token,reponseDTO?.refreshToken)
      res.status(200).json({message:"Login success",data:reponseDTO})
   } catch (error) {
    next (error)
   }
  
  }
}