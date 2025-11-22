import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "tsyringe";

import { HttpStatusCode } from "../../../common/errorCodes";
import { NotFoundError } from "../../../utils/errors";
import { ResponseMessages } from "../../../common/erroResponse";
import { IRagUsecase } from "../../../application/repositories/IRag"
@injectable()
export class RagController {
    constructor(@inject("RagUsecase") private _ragUsecase: IRagUsecase) { }

    async search(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            console.log(req.body, "body")
            const inputDTO = req.body
             const answer = await this._ragUsecase.execute(inputDTO)
            res.status(HttpStatusCode.OK).json({message:answer})
        } catch (error) {
             res.status(HttpStatusCode.OK).json({message:"please try agin later"})
            console.log(error,"error")
            next(error)
        }
    }
}