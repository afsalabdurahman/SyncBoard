
import apiService from "../../Services/apiServices/apiService";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { catchErrorHandle } from "../../Utility/catchErrorHandle";
const API_BASE_URL = import.meta.env.VITE_BASE_API_URL;
export const superLoginApi = async (email: string, password: string) => {
  const response = await apiService.post("auth/super/login", {
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
  const response = await apiService.get("super/counts", { withCredentials: true })

  if (response.status == 200) { return response.data.data }

}

export const downloadExcel = async () => {
  try {
    const response = await apiService.get('workspace/download/workspace', {
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
  await apiService.post("super/create/plan",{form})
} catch (error) {
      const err: string = catchErrorHandle(error, "Failed to create plan")
              throw new Error(err)
}
}

export const  updatePlan = async (form,id) =>{
  try {
    await apiService.post(`super/update/plan/${id}`,{form})
  } catch (error) {
     const err: string = catchErrorHandle(error, "Failed to update plan")
              throw new Error(err)
  }
}
export const removePlan = async (id)=>{
  try {
    await apiService.patch(`super/plan/remove/${id}`)
  } catch (error) {
     const err: string = catchErrorHandle(error, "Failed to change plan")
              throw new Error(err)
  }
}

export const deletePlan =async(id)=>{
  try {
    await apiService.delete(`super/plan/delete/${id}`)
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
      query: ({page=1,query="",filter="all",plan="all"}) => `super/count/workspace?search=${query}&filter=${filter}&plan=${plan}&page=${page}&limit=${5}`,
      invalidatesTags: ['Workspace',]
    }),
    getAlluserList: builder.query({
      query: ({ workspaceslug, page, limit }) => `workspace/member/pagination/data/${workspaceslug}?page=${page}&limit=${limit}`
    }),
    updateWorkspace: builder.mutation({
      query: ({ id, merge }) => ({
        url: `workspace/update/${id}`,
        method: 'PATCH',
        body: merge, // { name, description, etc. }
      }),
      invalidatesTags: ['Workspace'], // auto refetch if needed
    }),
    fetchUserPage: builder.query({
      query: (page) => `super/count/users?page=${page}&limit=${5}`,
      providesTags: (result, error, id) => [{ type: "User", id }]
    }),
    fetchSubscriptionPage: builder.query({
      query: (page) => `super/count/subscription?page=${page}&limit=${5}`
    }),
    fetchAbuseReportPage: builder.query({
      query: ({ page, limit }) => `workspace/abuse/reports?page=${page}&limit=${limit}`
    }),
    updateAbuseReportStatus: builder.mutation({
      query: ({ reportId, report }) => ({

        url: `workspace/abuse/report/status/${reportId}`,
        method: 'POST',
        body: report
      }), invalidatesTags: ['Workspace'],
    }), fetchAllTicketsPage: builder.query({
      query: () => `super/tickets`,

    }),
    updateTicketStatus: builder.mutation({
      query: ({ ticketId, newStatus }) => ({
        url: `ticket/update/status/${ticketId}?status=${newStatus}`,
        method: 'PATCH',
      }),
      invalidatesTags: ["Tickets"],
    }),
 

         fetchAllPlans:builder.query({
query: () => `super/plans`
    }),

  }),

});


export const { useGetWorkspaceCountQuery, useGetAlluserListQuery, useUpdateWorkspaceMutation, useFetchUserPageQuery, useFetchSubscriptionPageQuery, useFetchAbuseReportPageQuery,
  useUpdateAbuseReportStatusMutation, useFetchAllTicketsPageQuery, useUpdateTicketStatusMutation,useFetchAllPlansQuery
} = workspaceDataApi;


