import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../../constants/config";

const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: `${server}` }),
  tagTypes: ["Chat", "User"],

  endpoints: (builder) => ({
    myChats: builder.query({
      query: () => ({
        url: "/chats/myChat",
        credentials: "include",
      }),
      providesTags: ["Chat"],
    }),
    searchUser: builder.query({
      query: (name) => ({
        url: `/users/search?name=${name}`,
        credentials: "include",
      }),
      providesTags: ["User"],
    }),
    sendFriendRequest: builder.mutation({
      query: (data) => ({
        url: `/users/sendRequest`,
        method: "PUT",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    getNotification: builder.query({
      query: () => ({
        url: `/users/notifications`,
        credentials: "include",
      }),
      keepUnusedDataFor: 0,
    }),
    acceptFriendRequest: builder.mutation({
      query: (data) => ({
        url: `/users/acceptRequest`,
        method: "PUT",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["Chat"],
    }),
  }),
});

export default api;
export const { useMyChatsQuery, useLazyMyChatsQuery, useSendFriendRequestMutation, useGetNotificationQuery, useAcceptFriendRequestMutation } = api;
