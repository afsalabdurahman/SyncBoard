import mongoose, { ObjectId, Types } from "mongoose";
import { Subscription } from "../../domain/entities/Suscription";
import { ISuscription } from "../../domain/interfaces/repositories/ISuscriptionRepository";
import { SubscriptionDocument, SubscriptionModel } from "../database/models/SuscriptionModel";
import { WorkspaceModel } from "../database/models/WorkspaceModel";
import { ValidationError } from "../../utils/errors";

export class SuscriptionRepository implements ISuscription {

  async create(entity: Subscription): Promise<Subscription> {
    const created = await SubscriptionModel.create(entity)

    return created.toObject() as Subscription;
  }
  async findSuscriptionByUserId(customerId: string | ObjectId): Promise<Subscription | null> {

    const suscription = await SubscriptionModel.findOne({ user: customerId })

    return suscription as Subscription;
  }
  async updateSuscriptionPlan(userId: string, plankey: string, status: string): Promise<Subscription | null> {

    const updatedSubscription = await SubscriptionModel.findOneAndUpdate(
      { user: userId },
      { $set: { planKey: plankey, status } },
      { new: true }
    );
    return updatedSubscription ? updatedSubscription.toObject() as Subscription : null;
  }
  async updateSubscriptionPlanBysuper(
    name: string,
    plan: string
  ): Promise<void> {

    const workspace = await WorkspaceModel.findOne({ name })

    if (!workspace) {
      throw new ValidationError("Workspace not found")
    }

    const updated = await SubscriptionModel.findOneAndUpdate(
      { workspace: workspace._id },
      { $set: { planKey: plan } },
      
      { new: true }
    )

    if (!updated) {
      throw new ValidationError("Subscription not found")
    }
  }

  async updateHistory(
    workspaceId: Types.ObjectId,
    id: string,
    date: Date,
    amount: number,
    status: string
  ): Promise<void> {

    const historyData = {
      id,
      date,
      amount,
      status
    };
    await SubscriptionModel.findOneAndUpdate(
      { user: workspaceId },
      {
        $push: {
          history: historyData
        }
      },
      { new: true }
    );
  }

  // subscriptionDetails(workspaceName: string): Promise<Subscription> {
  //   const details = await SubscriptionModel.findOne({})
  // }
 async updateSubscriptionByWorkspaceId(workspaceId: Types.ObjectId, planKey: string, status: string): Promise<void> {

await SubscriptionModel.findOneAndUpdate(
  { workspace: workspaceId },
  { $set: { planKey, status } },
  { new: true }
);
}

}