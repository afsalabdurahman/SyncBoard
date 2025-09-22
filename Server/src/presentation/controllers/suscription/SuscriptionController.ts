import { error } from "console";
import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "tsyringe";
import { NotFoundError } from "../../../utils/errors";
import { ISuscriptionUsecase } from "../../../application/repositories/ISuscription";
import { IPlanUsecase } from "../../../application/repositories/IPlan";

@injectable()
export class SubscriptionController {
  constructor(
    @inject("SuscriptionUsecase")
    private suscriptionUsecase: ISuscriptionUsecase,
    @inject("PlanUsecase") private planUsecase: IPlanUsecase
  ) {}

  async addCheckout(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { planKey, paymentMethodId, quantity = 1, email } = req.body;
      console.log(req.body, "body", planKey, "keysssss");

      console.log(req.params.id, "params", req.query.id, "qury");
      //let userId=req.query.id
      //if(!planKey || !paymentMethodId || !quantity) throw new NotFoundError("Please select suscription");
      const myplan = await this.planUsecase.excute(planKey);
      console.log(myplan, "my plan$$$");
      if (!myplan) throw new NotFoundError("Plan are not found");
    let repos=  await this.suscriptionUsecase.excute(
        "68c67c99e56adb2ac2112e34",
        planKey,
        paymentMethodId,
        quantity,
        myplan
      );
      res.json(repos);
    } catch (error) {
      console.log(error);
    }
  }
}
