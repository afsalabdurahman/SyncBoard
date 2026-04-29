import { AxiosResponse } from "axios"
import apiService from "../../Services/apiServices/apiService"
import { catchErrorHandle } from "../../Utility/catchErrorHandle"

interface formData {
    type: string
    otherType: string,
    severity: string,
    description: string,
    reportedContent: string
}


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
export const sendAbuse = async (formData: formData, userId: string, workspaceId: string) => {
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

export const searchApi = (searchQuery: string, workspaceid: string, userid: string) => {
    try {
        const response = apiService.get(`workspace/abuse/report/search/${workspaceid}/${userid}?q=${encodeURIComponent(searchQuery)}`);
        return response
    } catch (error) {
        const err: string = catchErrorHandle(error, "Failed to search")
        throw new Error(err)
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
export const acceptInvitaionLink = async (name: string,
    email: string,
    password: string,
    role: string,
    title: string,
    workspaceSlug: string) => {
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
        const err: string = catchErrorHandle(error, "Can't find user")
        throw new Error(err)
    }
}

export const profilePartialUpdate = async (userId: string, updatedProfile: string[]) => {
    try {
        await apiService.patch(
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
export const tasksInProjectDetails = async (projectId: string, taskFilter: string) => {
    try {
        const response = await apiService.get(`task/project/${projectId}`, {
            filter: taskFilter
        });
        return response
    } catch (error) {
        const err: string = catchErrorHandle(error, "Task not found")
        throw new Error(err)
    }
}

export const updateSubTaskStatus = async (taskId: string, title: string) => {
    try {
        await apiService.patch(`task/update/subtask/status/${taskId}`, {
            title
        })
    } catch (error) {
        const err: string = catchErrorHandle(error, "Task not found")
        throw new Error(err)

    }
}
export const sendInvitation = async (emails: string | string[], invitationLink: string, workspaceId: string) => {
    try {
        const response: AxiosResponse<boolean> = await apiService.post(
            "workspace/invite",

            {
                emails,
                invitationLink,
                workspaceId
            },
            { withCredentials: true }
        );
        console.log(response, "REponsapiii")
        return response
    } catch (error) {
        const err = catchErrorHandle(error, "Send failed");
        throw (err)
    }
}
export const chatOnline = async (workspaceid: string) => {
    try {
        const response = await apiService.get(`chat/online/${workspaceid}`)
        return response
    } catch (error) {
        catchErrorHandle(error, "Send failed")
    }
}
export const chatHistory = async (workspaceid: string) => {
    try {
        const response = await apiService.get(`chat/history/${workspaceid}`)
        return response
    } catch (error) {
        catchErrorHandle(error, "Failed to connect ")
    }
}