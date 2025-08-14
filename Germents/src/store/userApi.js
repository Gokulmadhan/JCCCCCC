// src/features/user/userApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BACKEND_URL }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => '/users',
      providesTags: ['User'],
    }),
     getUsersById: builder.query({
      query: ({user_id}) => `/users/${user_id}`,
      providesTags: ['User'],
    }),
    createUser: builder.mutation({
      query: (newUser) => ({
        url: '/users/register',
        method: 'POST',
        body: newUser,
      }),
      invalidatesTags: ['User'],
    }),
     loginUser: builder.mutation({
      query: (newUser) => ({
        url: '/users/login',
        method: 'POST',
        body: newUser,
      }),
      invalidatesTags: ['User'],
    }),
    updateUser: builder.mutation({
      query: ({ user_id, ...updatedUser }) => ({
        url: `/users/${user_id}`,
        method: 'PUT',
        body: updatedUser,
      }),
      invalidatesTags: ['User'],
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUsersByIdQuery,
  useCreateUserMutation,
  useLoginUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
