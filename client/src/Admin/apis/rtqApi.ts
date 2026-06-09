import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ROUTES } from "../../Constants/routeConstan";
const BASE_URL=import.meta.env.VITE_BASE_API_URL

export const adminDataHandleApi = createApi({
  reducerPath: 'adminDataHandleApi',
  baseQuery:fetchBaseQuery({
    baseUrl:BASE_URL,
    credentials:"include"
  }),
  tagTypes:["Tickets"],
  endpoints:(builder)=>({
    getTickets: builder.query({
      query: (workspaceId) => ROUTES.TICKETS.MY_TICKETS.replace(":workspaceId",workspaceId),
      
      providesTags: ['Tickets'],
  }),
  createTickets:builder.mutation({
    query:(ticket)=>({
         url:ROUTES.TICKETS.CREATE.replace(":workspaceId",ticket.workspaceId),
         method:'POST',
         body:ticket,
    }),invalidatesTags:["Tickets"]
  }),
  updateMsg:builder.mutation({
    query:({msg,id})=>({
      url:ROUTES.TICKETS.UPDATE_MEG.replace(":id",id),
      method:'POST',
      body:msg
    }),invalidatesTags:["Tickets"]
  }),
 
})
})
export const {useCreateTicketsMutation,useGetTicketsQuery,useUpdateMsgMutation}=adminDataHandleApi