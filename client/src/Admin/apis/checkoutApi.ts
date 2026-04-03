import { handleApiError } from "../../Services/apiServices/apiErrorHandle";
import apiService from "../../Services/apiServices/apiService"

export const checkoutapi = async (userId: string, plan: string): Promise<string> => {
    try {

        const data=await apiService.post(`/checkout/payment/${userId}`, {
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
        const plants = await apiService.get("/subscription/active/plans");
        console.log(plants, "API")
        return plants.data
    } catch (error) {
        console.log(error)
    }
}