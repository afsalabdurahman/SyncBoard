import apiService from "../../Services/apiServices/apiService";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
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
      query: (workspaceId) => `ticket/mytickets/${workspaceId}`,
      
      providesTags: ['Tickets'],
  }),
  createTickets:builder.mutation({
    query:(ticket)=>({
         url:`ticket/create`,
         method:'POST',
         body:ticket,
    }),invalidatesTags:["Tickets"]
  }),
  updateMsg:builder.mutation({
    query:({msg,id})=>({
      url:`ticket/update/message/${id}`,
      method:'POST',
      body:msg
    }),invalidatesTags:["Tickets"]
  })
})
})
export const {useCreateTicketsMutation,useGetTicketsQuery,useUpdateMsgMutation}=adminDataHandleApi