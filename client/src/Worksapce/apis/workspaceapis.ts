import { AxiosResponse } from "axios"
import apiService from "../../Services/apiServices/apiService"
import { catchErrorHandle } from "../../Utility/catchErrorHandle"
import { ROUTES } from "../../Constants/routeConstan"

interface formData {
    type: string
    otherType: string,
    severity: string,
    description: string,
    reportedContent: string
}


export const myProjects = async (workspaceId: string) => {
    const response = await apiService.get(ROUTES.PROJECTS.FETCH_PROJECT_BYID.replace(":workspaceId",workspaceId))
    return response
}
export const sendQuery = async (userName: string, query: string) => {
    const response = await apiService.post(ROUTES.MESSAGE.RAG_SEARCH, {
        user: userName,
        query: query
    })
    return response
}
export const sendAbuse = async (formData: formData, userId: string, workspaceId: string) => {
    try {
        const response = await apiService.post(ROUTES.MESSAGE.SEND_ABUSE_REPORT.replace(":userId/:workspaceId",userId+'/'+workspaceId), {
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
        const response = apiService.get(ROUTES.WORKSPACE.SEARCH_ABUSE_REPORT.replace(":workspaceid",workspaceid).replace(":userid",userid)+`?q=${encodeURIComponent(searchQuery)}`);
        return response
    } catch (error) {
        const err: string = catchErrorHandle(error, "Failed to search")
        throw new Error(err)
    }
}
export const abuseReportList = async (userId: string, workspaceId: string, page: number) => {
    try {
        const response = await apiService.get(ROUTES.WORKSPACE.FECTH_ABUSELIST.ABUSE_LIST(workspaceId,userId,page));

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
    const response = await apiService.patch(ROUTES.PUBLIC.LOGOUT.replace(":userId",userId))
    return response.status

}
export const myLogs = async (workspaceId: string) => {
    const response = await apiService.get(ROUTES.WORKSPACE.ACTIVITY_LOG.replace(":workspaceId",workspaceId))
    return response.data

}
export const acceptInvitaionLink = async (name: string,
    email: string,
    password: string,
    role: string,
    title: string,
    workspaceSlug: string) => {
    try {
        const response = await apiService.post(ROUTES.WORKSPACE.INVITE_REGISTER, {
            name, email, password, role, title, workspaceSlug
        })

        return response.data
    } catch (error) {
        const err: string = catchErrorHandle(error, "Invalid input feild")
        throw new Error(err)
    }
}

export const paginationUser = async (slug: string, page: number) => {
    const response = await apiService.get(ROUTES.WORKSPACE.PAGENATION_USER.USERS(slug,page));
    return response.data
}


export const allMembers = async (slug: string) => {
    const response = await apiService.get(ROUTES.WORKSPACE.ALL_WORKSPACE_MEMBERS.replace(":slug",slug))
    return response.data
}
export const searchUser = async (slug: string, q: string) => {
    try {
        const response = await apiService.get(ROUTES.WORKSPACE.SEARCH_USERS_BY_SLUG(slug,q));
        return response.data
    } catch (error) {
        const err: string = catchErrorHandle(error, "Can't find user")
        throw new Error(err)
    }
}

export const profilePartialUpdate = async (userId: string, updatedProfile: string[]) => {
    try {
        await apiService.patch(
            ROUTES.MEMBER.UPDATE_MEMBER.replace(":userId",userId),
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
        const response = await apiService.get(ROUTES.TASKS.TASK_IN_PROJECT_DETAILS.replace(":projectId",projectId), {
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
        await apiService.patch(ROUTES.TASKS.UPDATE_SUBTASK.replace(":taskId",taskId), {
            title
        })
    } catch (error) {
        const err: string = catchErrorHandle(error, "Task not found")
        throw new Error(err)

    }
}
export const ApprovalCriteria = async (taskId: string, title: string) => {
    try {
        await apiService.patch(ROUTES.TASKS.APPROVAL_CRITERIA.replace(":taskId",taskId), {
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
            ROUTES.WORKSPACE.SEND_INVITAION,

            {
                emails,
                invitationLink,
                workspaceId
            },
            { withCredentials: true }
        );
        
        return response
    } catch (error) {
        const err = catchErrorHandle(error, "Send failed");
        throw (err)
    }
}
export const chatOnline = async (workspaceid: string) => {
    try {
        const response = await apiService.get(ROUTES.MESSAGE.CAHT_ONLINE.replace(":workspaceid",workspaceid))
        return response
    } catch (error) {
        catchErrorHandle(error, "Send failed")
    }
}
export const chatHistory = async (workspaceid: string) => {
    try {
        const response = await apiService.get(ROUTES.MESSAGE.CHAT_HISTORY.replace(":workspaceid",workspaceid))
        return response
    } catch (error) {
        catchErrorHandle(error, "Failed to connect ")
    }
}
export const taskDetailsApi=async(taskId:string)=>{
    try {
        const task = await apiService.get(ROUTES.TASKS.TASK_DETAILS_BY_ID.replace(":taskId",taskId))
        return task?.data?.taskUI
    } catch (err) {
  catchErrorHandle(err,"Not found")
    }
}