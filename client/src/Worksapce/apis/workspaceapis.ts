import { handleApiError } from "../../Services/apiServices/apiErrorHandle"
import apiService from "../../Services/apiServices/apiService"
import { catchErrorHandle } from "../../Utility/catchErrorHandle"

export const myProjects = async (workspaceId: string) => {
    const response = await apiService.get(`project/projects/${workspaceId}`)
    return response
}
export const sendQuery = async (userName: string, query: string) => {
    const response = await apiService.post("rag/search", {
        user: userName,
        query: query
    })
    return response
}
export const sendAbuse = async (formData: any, userId, workspaceId) => {
    try {
        const response = await apiService.post(`workspace/abuse/${userId}/${workspaceId}`, {
        description: formData.description,
        type: formData.type,
        severity: formData.severity
    })
    return response.status
    } catch (error) {
         const err: string = catchErrorHandle(error, "Failed to send report")
    throw new Error(err)
    }
}

export const searchApi = (searchQuery, workspaceid, userid) => {
    try {
        const response = apiService.get(`workspace/abuse/report/search/${workspaceid}/${userid}?q=${encodeURIComponent(searchQuery)}`);
        return response
    } catch (error) {
        console.log(error)
    }
}
export const abuseReportList = async (userId: string, workspaceId: string, page: number) => {
   try {
     const response = await apiService.get(`workspace/abuse/list/${workspaceId}/${userId}?page=${page}&&limit=5`);

     return response
   } catch (error) {
    
    const err: string = catchErrorHandle(error, "Failed to send report")
    throw new Error(err)
   }
}

export const getMyAbuseReports = () => {
    return { data: "fseifhils" }
}
export const logout = async (userId: string) => {
    const response = await apiService.patch(`/auth/logout/${userId}`)
    return response.status

}
export const myLogs = async (workspaceId: string) => {
    const response = await apiService.get(`/activities/logs/${workspaceId}`)
    return response.data

}
export const acceptInvitaionLink = async (name,
    email,
    password,
    role,
    title,
    workspaceSlug,) => {
    try {
        const response = await apiService.post("member/invite/register", {
            name, email, password, role, title, workspaceSlug
        })
        return response.data
    } catch (error) {
        const err: string = catchErrorHandle(error, "Invalid input feild")
        throw new Error(err)
    }
}

export const paginationUser = async (slug: string, page: number) => {
    const response = await apiService.get(`workspace/member/pagination/data/${slug}?page=${page}&limit=5`);
    return response.data
}


export const allMembers = async (slug: string) => {
    const response = await apiService.get(`workspace/member/data/${slug}`)
    return response.data
}
export const searchUser = async (slug: string, q: string) => {
    try {
        const response = await apiService.get(`workspace/members/find/${slug}?query=${q}`);
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export const profilePartialUpdate = async (userId: string, updatedProfile: any) => {
    try {
        const axiosResponse: AxiosResponse<any> = await apiService.patch(
            `member/profile/update/${userId}`,
            {
                profileData: updatedProfile,
            },
           
        );

        return true
    } catch (error) {
        const err: string = catchErrorHandle(error, "Updation failed")
    throw new Error(err)   
    }
}