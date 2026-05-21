import apiService from "../../Services/apiServices/apiService"
import { catchErrorHandle } from "../../Utility/catchErrorHandle";
import { ROUTES } from "../../Constants/routeConstan";

export const fetchProjectNames = async (workspaceId: string) => {
    try {

        const response = await apiService.get(ROUTES.PROJECTS.FETCH_PROJECT_NAMES.replace(":workspaceId", workspaceId));
        return response.data?.projectNamesAndId
    } catch (error) {
        const err: string = catchErrorHandle(error, "Projects not found")
        throw new Error(err)
    }
}
export const projectSpecifyDashboard = async (projectId: string) => {
    try {
        const result = await Promise.allSettled([
            apiService.get(ROUTES.PROJECTS.COUNT_DASHBOARD.replace(":projectId", projectId)),
            apiService.get(ROUTES.PROJECTS.DONET_CHART.replace(":projectId", projectId)),
            apiService.get(ROUTES.PROJECTS.MEMBERS_LIST.replace(":projectId", projectId)),
            apiService.get(ROUTES.PROJECTS.CHART.replace(":projectId", projectId)),
            apiService.get(ROUTES.PROJECTS.LIST.replace(":projectId", projectId)),
            apiService.get(ROUTES.PROJECTS.APPROVAL.replace(":projectId", projectId)),

        ])
        return result
    } catch {
        return null
    }
}
export const updatePermissionApi = async (permission: string, userId: string, workspaceId: string)=>{
    try {
        await apiService.post(`/workspace/update/permission/${workspaceId}`, {
            userId,
            permission
        })
    } catch  {
        return null
    }
}