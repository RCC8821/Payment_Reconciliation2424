// src/features/rccPayment/RccPaymentApi.js    (or wherever you want to keep it)

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// VITE project → .env se base URL (VITE_ prefix compulsory)
const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const rccPaymentApi = createApi({
  reducerPath: 'rccPaymentApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),

  tagTypes: ['RccPayments'], // Tag for invalidation on update

  endpoints: (builder) => ({
    // 1. Get RCC Payments that are ready for payment / pending payment
    // (your backend filters where PLANNED_4 exists and next column is empty)
    getRccPaymentsPending: builder.query({
      query: () => '/api/expreses/Get-RCC-Payment',   // ← your GET endpoint
      providesTags: ['RccPayments'],
      transformResponse: (response) => {
        if (response.success) {
          return {
            data: response.data || [],
            totalRecords: response.totalRecords || 0,
          };
        }
        return { data: [], totalRecords: 0 };
      },
    }),

    // 2. Update payment details (mark as paid, add mode, date, amount paid, etc.)
    updateRccPayment: builder.mutation({
      query: ({
        uid,
        STATUS_4,
        TOTAL_PAID_AMOUNT_4,
        BASIC_AMOUNT_4,
        CGST_4,
        SGST_4,
        NET_AMOUNT_4,
        PAYMENT_MODE_17,
        BANK_DETAILS_17,
        PAYMENT_DETAILS_17,
        PAYMENT_DATE_17,
        Remark_Blank,
      }) => ({
        url: '/api/expreses/update-RCC-OFFICE-Payment',   // ← your POST endpoint
        method: 'POST',
        body: {
          uid,
          STATUS_4,
          TOTAL_PAID_AMOUNT_4,
          BASIC_AMOUNT_4,
          CGST_4,
          SGST_4,
          NET_AMOUNT_4,
          PAYMENT_MODE_17,
          BANK_DETAILS_17,
          PAYMENT_DETAILS_17,
          PAYMENT_DATE_17,
          Remark_Blank,
        },
      }),
      invalidatesTags: ['RccPayments'], // Refetch list after payment update
    }),
  }),
});

// Exported hooks
export const {
  useGetRccPaymentsPendingQuery,
  useUpdateRccPaymentMutation,
  useLazyGetRccPaymentsPendingQuery, // if you need manual trigger sometimes
} = rccPaymentApi;

// For store.js → reducer path
export default rccPaymentApi;