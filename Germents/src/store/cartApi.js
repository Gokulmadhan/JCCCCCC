// src/features/api/cartApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const cartApi = createApi({
  reducerPath: 'cartApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_BACKEND_URL}/users` }), // or your actual backend URL
  tagTypes: ['Cart'],
  endpoints: (builder) => ({
    getCart: builder.query({
      query: (userId) => `/cart/${userId}`,
      providesTags: ['Cart'],
    }),

    addToCart: builder.mutation({
      query: ({ userId, item }) => ({
        url: `/cart/${userId}`,
        method: 'POST',
        body: item,
      }),
      invalidatesTags: ['Cart'],
    }),

    updateCart: builder.mutation({
      query: ({ userId, update }) => ({
        url: `/cart/${userId}`,
        method: 'PATCH',
        body: update,
      }),
      invalidatesTags: ['Cart'],
    }),

    deleteCartItem: builder.mutation({
      query: ({ userId, itemId }) => ({
        url: `/cart/${userId}/${itemId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),

    discardCart: builder.mutation({
      query: (userId) => ({
        url: `/cart/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartMutation,
  useDeleteCartItemMutation,
  useDiscardCartMutation,
} = cartApi;
