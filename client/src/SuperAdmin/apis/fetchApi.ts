
import apiService from "../../Services/apiServices/apiService";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { catchErrorHandle } from "../../Utility/catchErrorHandle";
import { ROUTES } from "../../Constants/routeConstan";
const API_BASE_URL = import.meta.env.VITE_BASE_API_URL;
export const superLoginApi = async (email: string, password: string) => {
  const response = await apiService.post(ROUTES.PUBLIC.SUPER_AUTH, {
    email,
    password
  },
    { withCredentials: true }
  )
  if (response.status == 200) {
    
    return response.data
  }
}



export const dashBordDataApi = async () => {
  const response = await apiService.get(ROUTES.SUPER_ADMIN.DASHBOARD, { withCredentials: true })

  if (response.status == 200) { return response.data.data }

}

export const downloadExcel = async () => {
  try {
    const response = await apiService.get(ROUTES.SUPER_ADMIN.DOWNLOAD_EXCEL, {
      responseType: 'arraybuffer',     // ← Change to 'arraybuffer' (more reliable)
      withCredentials: true,
      // Optional: still add this to be extra safe
      transformResponse: [(data: unknown) => data],
    });

    // Create Blob from ArrayBuffer
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'workspaces.xlsx'; // or dynamic: `workspaces_${new Date().toISOString().slice(0,10)}.xlsx`
    document.body.appendChild(a);
    a.click();
    a.remove(); // better than parentNode.removeChild
    window.URL.revokeObjectURL(url);

  } catch (error: unknown) {
  

    // Better error feedback
    if (error.response?.status === 404) {
      alert('No workspaces found to export.');
    } else {
      alert('Failed to download Excel file. Please try again.');
    }
  }
};

export const createPlan = async (form) =>{
try {
  await apiService.post(ROUTES.SUPER_ADMIN.CREATE_PLAN,{form})
} catch (error) {
      const err: string = catchErrorHandle(error, "Failed to create plan")
              throw new Error(err)
}
}

export const  updatePlan = async (form,id) =>{
  try {
    await apiService.post(ROUTES.SUPER_ADMIN.UPDATE_PLAN.replace(":id",id),{form})
  } catch (error) {
     const err: string = catchErrorHandle(error, "Failed to update plan")
              throw new Error(err)
  }
}
export const removePlan = async (id)=>{
  try {
    await apiService.patch(ROUTES.SUPER_ADMIN.REMOVE_PLAN.replace(":id",id))
  } catch (error) {
     const err: string = catchErrorHandle(error, "Failed to change plan")
              throw new Error(err)
  }
}

export const deletePlan =async(id)=>{
  try {
    await apiService.delete(ROUTES.SUPER_ADMIN.DELETE_PLAN.replace(":id",id))
  } catch (error) {
     const err: string = catchErrorHandle(error, "Failed to change plan")
              throw new Error(err)
  }
}

export const workspaceDataApi = createApi({
  reducerPath: 'workspaceDataApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: "include"
  }),
  tagTypes: ['Workspace', 'Members', 'Tickets'],
  endpoints: (builder) => ({
    getWorkspaceCount: builder.query({
      query: ({page=1,query="",filter="all",plan="all"}) => ROUTES.SUPER_ADMIN.SUPER_ADMIN_WORKSPACE_DATA+`?search=${query}&filter=${filter}&plan=${plan}&page=${page}&limit=${5}`,
      invalidatesTags: ['Workspace',]
    }),
    getAlluserList: builder.query({
      query: ({ workspaceslug, page, limit }) => ROUTES.SUPER_ADMIN.SUPER_ADMIN_USER_LIST.replace(":workspaceslug",workspaceslug)+`?page=${page}&limit=${limit}`
    }),
    updateWorkspace: builder.mutation({
      query: ({ id, merge }) => ({
        url: ROUTES.SUPER_ADMIN.SUPER_ADMIN_UPDATE_WORKSPACE.replace(":id",id),
        method: 'PATCH',
        body: merge, // { name, description, etc. }
      }),
      invalidatesTags: ['Workspace'], // auto refetch if needed
    }),
    fetchUserPage: builder.query({
      query: (page) => ROUTES.SUPER_ADMIN.USER_PAGE+`?page=${page}&limit=${5}`,
      providesTags: (result, error, id) => [{ type: "User", id }]
    }),
    fetchSubscriptionPage: builder.query({
      query: (page) => ROUTES.SUPER_ADMIN.SUBSCRIPTION_PAGE+`?page=${page}&limit=${5}`
    }),
    fetchAbuseReportPage: builder.query({
      query: ({ page, limit }) => ROUTES.SUPER_ADMIN.ABUSE_REPORT_PAGE+`?page=${page}&limit=${limit}`
    }),
    updateAbuseReportStatus: builder.mutation({
      query: ({ reportId, report }) => ({

        url: ROUTES.SUPER_ADMIN.UPDATE_ABUSE_REPORT.replace(":reportId",reportId),
        method: 'POST',
        body: report
      }), invalidatesTags: ['Workspace'],
    }), fetchAllTicketsPage: builder.query({
      query: () => `super/tickets`,

    }),
    updateTicketStatus: builder.mutation({
      query: ({ ticketId, newStatus }) => ({
        url: ROUTES.SUPER_ADMIN.UPDATE_TICKET_STATUS.replace(":ticketId",ticketId)+`?status=${newStatus}`,
        method: 'PATCH',
      }),
      invalidatesTags: ["Tickets"],
    }),
 

         fetchAllPlans:builder.query({
query: () => ROUTES.SUPER_ADMIN.SUPER_PLANS
    }),

  }),

});


export const { useGetWorkspaceCountQuery, useGetAlluserListQuery, useUpdateWorkspaceMutation, useFetchUserPageQuery, useFetchSubscriptionPageQuery, useFetchAbuseReportPageQuery,
  useUpdateAbuseReportStatusMutation, useFetchAllTicketsPageQuery, useUpdateTicketStatusMutation,useFetchAllPlansQuery
} = workspaceDataApi;

export const fetchRevenue = async()=>{
 try {
   const revenueData = await apiService.get(ROUTES.SUPER_ADMIN.FETCH_REVENUE);
   return revenueData.data
 } catch (error) {
const err=catchErrorHandle(error,"failed to fetch") ;
throw Error(err) 
 }
 

}
export const fetchUserGrowth = async()=>{
 try {
   const userData = await apiService.get(ROUTES.SUPER_ADMIN.GROWTH_CHART);
   return userData.data
 } catch (error) {
const err=catchErrorHandle(error,"failed to fetch") ;
throw Error(err) 
 }
 

}
export const fetchAUserDetails = async(userId)=>{
  try {
   const response= await apiService.get(`super/user/details/${userId}`)
 
   return response.data.data
  } catch (error) {
    catchErrorHandle(error,"Not found ")
  }
}