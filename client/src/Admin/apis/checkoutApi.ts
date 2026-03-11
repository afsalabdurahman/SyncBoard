import apiService from "../../Services/apiServices/apiService"

export const checkoutapi = async (userId: string, plan: string): Promise<boolean> => {
    try {
        console.log(userId, plan, "PLAN AND USR")
        await apiService.post(`/checkout/payment/${userId}`, {
            plan
        });
        return true
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        return false;
    }
}