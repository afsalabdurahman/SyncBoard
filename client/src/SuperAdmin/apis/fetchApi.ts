
import apiService from "../../Services/apiServices/apiService";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const superLoginApi = async (email: string, password: string) => {
  const response = await apiService.post("auth/super/login", {
    email,
    password
  },
    { withCredentials: true }
  )
  if (response.status == 200) {
    console.log(response, "rsponse")
    return response.data
  }
}
export const dashBordDataApi = async () => {
  const response = await apiService.get("super/counts", { withCredentials: true })
  console.log(response, "api rseponse")
  if (response.status == 200) { return response.data.data }

}


export const workspaceDataApi = createApi({
  reducerPath: 'workspaceDataApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api/',
    credentials: "include"
  }),
  tagTypes: ['Workspace', 'Members', 'Tickets'],
  endpoints: (builder) => ({
    getWorkspaceCount: builder.query({
      query: (page) => `super/count/workspace?page=${page}&&limit=${5}`,
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
      query: (page) => `super/count/users?page=${page}&&limit=${5}`,
      providesTags: (result, error, id) => [{ type: "User", id }]
    }),
    fetchSubscriptionPage: builder.query({
      query: (page) => `super/count/subscription?page=${page}&&limit=${5}`
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
    })



  }),
});


export const { useGetWorkspaceCountQuery, useGetAlluserListQuery, useUpdateWorkspaceMutation, useFetchUserPageQuery, useFetchSubscriptionPageQuery, useFetchAbuseReportPageQuery,
  useUpdateAbuseReportStatusMutation, useFetchAllTicketsPageQuery, useUpdateTicketStatusMutation
} = workspaceDataApi;


