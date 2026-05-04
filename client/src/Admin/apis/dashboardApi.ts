import { toast } from "react-toastify";
import apiService from "../../Services/apiServices/apiService"
import { catchErrorHandle } from "../../Utility/catchErrorHandle";

export const fetchProjectNames = async(workspaceId:string)=>{
    try {

       const response = await apiService.get(`/project/name/all/${workspaceId}`);
       return response.data?.projectNamesAndId
    } catch (error) {
        catchErrorHandle(error,"Not found")
    }
}
export const projectSpecifyDashboard = async(projectId:string)=>{
    try {
        const result = await Promise.allSettled([
            apiService.get(`/task/count/dashboard/${projectId}`),
            apiService.get(`/task/count/dashboard/donet/${projectId}`),
             apiService.get(`/project/mebers/names/${projectId}`),
              apiService.get(`/project/burndown/chart/${projectId}`),
              apiService.get(`/task/project/list/${projectId}`),
              apiService.get(`/task/project/approval/${projectId}`),

        ])
       return result
    } catch  {
        toast.error("failed")
    }
}