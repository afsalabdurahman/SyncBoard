import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "tsyringe";

import { HttpStatusCode } from "../../../common/errorCodes";
import { IRagUsecase } from "../../../application/repositories/IRag"
@injectable()
export class RagController {
    constructor(@inject("RagUsecase") private _ragUsecase: IRagUsecase) { }

    async search(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const inputDTO = req.body
             const answer = await this._ragUsecase.execute(inputDTO)
            res.status(HttpStatusCode.OK).json({message:answer})
        } catch (error) {
             res.status(HttpStatusCode.OK).json({message:"please try agin later"})
            next(error)
        }
    }
}