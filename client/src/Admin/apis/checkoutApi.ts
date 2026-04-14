import apiService from "../../Services/apiServices/apiService"

export const checkoutapi = async (userId: string, plan: string): Promise<string|boolean> => {
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
        
        return plants.data
    } catch  {
       throw new Error("Updation failed")
    }
}