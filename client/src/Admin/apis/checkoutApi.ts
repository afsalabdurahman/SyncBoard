import { ROUTES } from "../../Constants/routeConstan";
import apiService from "../../Services/apiServices/apiService"

export const checkoutapi = async (userId: string, plan: string): Promise<string|boolean> => {
    try {

        const data=await apiService.post(ROUTES.CHECKOUT.CHECKOUT_PAYMENT.replace(":userId",userId), {
            plan
        });
        return data.data as string
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        return false;
    }
}
export const fetchAllPlans = async () => {
    try {
        const plants = await apiService.get(ROUTES.SUSCRIPTIONS.ALL_PLANS);
        
        return plants.data
    } catch  {
       throw new Error("Updation failed")
    }
}