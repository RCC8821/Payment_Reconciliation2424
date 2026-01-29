// src/features/vrnPayment/VrnPaymentApi.js   (या जहाँ रखना चाहो)

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// VITE project → .env से base URL (VITE_ prefix compulsory)
const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const vrnPaymentApi = createApi({
  reducerPath: 'vrnPaymentApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),

  tagTypes: ['VrnPayments'], // Tag for invalidation on update

  endpoints: (builder) => ({
    // 1. Get VRN Payments that are ready for payment / pending payment
    getVrnPaymentsPending: builder.query({
      query: () => '/api/vrn-Expenses/Get-VRN-Payment',   // ← तुम्हारा GET endpoint
      providesTags: ['VrnPayments'],
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
    updateVrnPayment: builder.mutation({
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
        url: '/api/vrn-Expenses/update-VRN-OFFICE-Payment',   // ← तुम्हारा POST endpoint
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
      invalidatesTags: ['VrnPayments'], // Refetch list after payment update
    }),
  }),
});

// Exported hooks
export const {
  useGetVrnPaymentsPendingQuery,
  useUpdateVrnPaymentMutation,
  useLazyGetVrnPaymentsPendingQuery, // अगर manual trigger चाहिए
} = vrnPaymentApi;

// store.js में reducer के लिए (अगर अलग से एक्सपोर्ट करना हो)
export default vrnPaymentApi.reducer;