import { toast } from "react-toastify";
import apiService from "../../Services/apiServices/apiService"
import { catchErrorHandle } from "../../Utility/catchErrorHandle";
import { ROUTES } from "../../Constants/routeConstan";

export const fetchProjectNames = async(workspaceId:string)=>{
    try {

       const response = await apiService.get(ROUTES.PROJECTS.FETCH_PROJECT_NAMES.replace(":workspaceId",workspaceId));
       return response.data?.projectNamesAndId
    } catch (error) {
        catchErrorHandle(error,"Not found")
    }
}
export const projectSpecifyDashboard = async(projectId:string)=>{
    try {
        const result = await Promise.allSettled([
            apiService.get(ROUTES.PROJECTS.COUNT_DASHBOARD.replace(":projectId",projectId)),
            apiService.get(ROUTES.PROJECTS.DONET_CHART.replace(":projectId",projectId)),
             apiService.get(ROUTES.PROJECTS.MEMBERS_LIST.replace(":projectId",projectId)),
              apiService.get(ROUTES.PROJECTS.CHART.replace(":projectId",projectId)),
              apiService.get(ROUTES.PROJECTS.LIST.replace(":projectId",projectId)),
              apiService.get(ROUTES.PROJECTS.APPROVAL.replace(":projectId",projectId)),

        ])
       return result
    } catch  {
        toast.error("failed")
    }
}