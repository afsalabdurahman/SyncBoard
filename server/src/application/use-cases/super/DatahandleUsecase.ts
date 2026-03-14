import { inject, injectable } from "tsyringe";
import { CountResponseDTO, CountWorkspaceReponseDTO } from "../../dto/DatahandleDTO";
import { IDatahandleUsecase } from "../../repositories/IDatahandle";
import { ISuperAdminRepository } from "../../../domain/interfaces/repositories/ISuperAdminRepository";
import { DatahandleMapper } from "../../mappers/DatahandleMapper";
import { listOfSubscriptionsDTO, SuperSubscriptionResponseDTO, UserDetailsResponseDTO, UserResponseDTO } from "../../dto/SuperDTO";
import { Ticket } from "../../../domain/entities/Ticket";
import { TicketMapper } from "../../mappers/TicketMapper";
import { Plan } from "../../../domain/entities/Plan";
import { PlanRequestDTO } from "../../dto/PlanDTO";
import { envConfig } from "../../../infrastructure/config/env.config";
import Stripe from "stripe";
import { PlanMapper } from "../../mappers/PlanMapper";
import { ValidationError } from "../../../utils/errors";
import { stringToMongoObj } from "../../../utils/convertMongoObject";
import { IPlanRepository } from "../../../domain/interfaces/repositories/IPlanRepository";
const stripe = new Stripe(envConfig.STRIP_KEY, {
    apiVersion: "2025-08-27.basil"
})
@injectable()

export class DatahandleUsecase implements IDatahandleUsecase {
    constructor(@inject("SuperAdminRepository") private _superAdminRepository: ISuperAdminRepository,
        @inject('PlanRepository') private _planRepository: IPlanRepository,

    ) { }
    async fetchDataCounts(): Promise<CountResponseDTO | null> {
        const { data, userCount, workspaceCount, abusereportlas } = await this._superAdminRepository.getAllCount();
        if (!data || !userCount || !workspaceCount || !abusereportlas) return null
        const responseDTO = DatahandleMapper.mapSuperEntityToResponse(userCount, workspaceCount, data, abusereportlas)
        return responseDTO as CountResponseDTO
    }

    async fetchDataworkspace(limit: number, skip: number, search: string, filter: string, plan: string): Promise<{ responseDTO: CountWorkspaceReponseDTO[], totalCount: number }> {
        const result = await this._superAdminRepository.getAllWorkspace(limit, skip)
        const { totalCount, responseDTO } = await DatahandleMapper.mapSuperWorkspaceToResponse(result, search, filter, plan)
        return { responseDTO, totalCount }
    }
    async fetchAllUsers(limit: number, skip: number): Promise<{ responseDTO: UserResponseDTO[], totalCount: number }> {
        const response = await this._superAdminRepository.getAllUsers(limit, skip);
        console.log(response, "response")
        const { responseDTO, totalCount } = DatahandleMapper.mapAllUserToResponse(response);
        console.log(responseDTO, totalCount, "count+++")

        return { responseDTO, totalCount }
    }
    async fetchAUser(userId: string): Promise<UserDetailsResponseDTO> {
        const result = await this._superAdminRepository.getUserDetails(userId)
        const responseDTO = DatahandleMapper.mapUserDetailsToResponse(result);

        return responseDTO
    }
    async fetchSubscriptions(limit: number, skip: number): Promise<{ responseDTO: SuperSubscriptionResponseDTO[], totalDocCounts: number }> {
        const { subscriptions, totalDocCount } = await this._superAdminRepository.getSubscription(limit, skip)
        console.log(subscriptions[0].history)
        const { responseDTO, totalDocCounts } = DatahandleMapper.mapSubscriptionToResponse(subscriptions, totalDocCount)
        console.log(responseDTO, "resfPoseDTO")
        return { responseDTO, totalDocCounts }
    }
    async fetchTickets(): Promise<Ticket[]> {
        const result = await this._superAdminRepository.getAllTickets()
        const responseDTO = TicketMapper.mapTOTickets(result)
        return responseDTO
    }

    async fetchPlans(): Promise<Plan[]> {

        const plans = await this._superAdminRepository.getAllPlans() as Plan[];

        return plans.map((plan) =>
            new Plan(
                plan._id,
                plan.key,
                plan.name,
                plan.priceCents,
                plan.billingInterval,
                plan.features,
                plan.stripePriceId,
                plan.description,
                plan.status
            )
        );
    }
    async createPlan(input: PlanRequestDTO): Promise<void> {

        const isValid = PlanMapper.inputPlanValidator(input);
        if (!isValid.success) throw new ValidationError(isValid.error.issues[0].message);
        const product = await stripe.products.create({
            name: input.name,
            description: input.description,
        });

        const price = await stripe.prices.create({
            unit_amount: input.priceCents,
            currency: "usd",
            recurring: {
                interval: input.billingInterval, // month | year
            },
            product: product.id,
        });

        input.stripePriceId = price.id;
        input.stripeProductId = product.id

        input.key = input.name.toLowerCase();
        console.log(input, "after usecse 22")
        await this._superAdminRepository.createPlan(input)


    }
    async updatePlan(input: PlanRequestDTO, id: string): Promise<void> {
        console.log(input, "INPUT++", id, ":IDDD")
        const isValid = PlanMapper.inputPlanValidator(input);
        if (!isValid.success) throw new ValidationError(isValid.error.issues[0].message);
        let price;
        const oldPlan = await this._planRepository.findByKey(input.key ?? input.name.toLowerCase())
        console.log(oldPlan, "OLD plan")
        if (oldPlan?.priceCents != input?.priceCents) {
            console.log("WORKING>>>>")
            price = await stripe.prices.create({
                product: oldPlan?.stripeProductId,
                unit_amount: input.priceCents, 
                currency: "usd",
                recurring: {
                    interval: input.billingInterval
                }
            });
            console.log(price, "PRICEEE")
            await stripe.prices.update(oldPlan?.stripePriceId ?? "", {
                active: false
            });
            input.stripePriceId = price.id;
            console.log(input, "after Save INPUT")

            await this._superAdminRepository.updatePlan(input, stringToMongoObj(id))
        } else {
            await this._superAdminRepository.updatePlan(input, stringToMongoObj(id))
        }


    }
async removePlan(id: string,): Promise<void> {
    await this._planRepository.removePlan(stringToMongoObj(id))
}
async deletePlan(id: string): Promise<void> {
    await this._planRepository.deletePlan(stringToMongoObj(id))
}
}