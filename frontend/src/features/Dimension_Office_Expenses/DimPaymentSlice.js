// src/features/dimPayment/DimPaymentSlice.js

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Base URL from .env (Vite → import.meta.env)
const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

export const dimPaymentApi = createApi({
  reducerPath: 'dimPaymentApi',           // Consistent with file naming pattern

  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      // Add auth token here later if needed
      // const token = ...;
      // if (token) headers.set('Authorization', `Bearer ${token}`);

      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),

  tagTypes: ['DimPayments'],

  endpoints: (builder) => ({

    // GET → Fetch pending / ready-for-payment DIM entries
    getDimPaymentsPending: builder.query({
      query: () => ({
        url: '/api/Dim-Expenses/Get-DIM-Payment',           // ← matches your original backend route
        method: 'GET',
      }),

      providesTags: ['DimPayments'],

      transformResponse: (response) => {
        if (!response?.success) {
          return {
            data: [],
            totalRecords: 0,
            message: response?.message || 'No success response from server'
          };
        }

        return {
          data: response.data || [],
          totalRecords: response.totalRecords || response.data?.length || 0,
        };
      },

      // Optional: polling, cache lifetime, etc.
      // keepUnusedDataFor: 300,   // 5 minutes
    }),

    // POST → Update payment details for one DIM bill
    updateDimPayment: builder.mutation({
      query: (payload) => ({
        url: '/api/Dim-Expenses/update-DIM-OFFICE-Payment',   // ← matches your original backend route
        method: 'POST',
        body: {
          uid:                  payload.uid                  ?? '',
          STATUS_4:             payload.STATUS_4             ?? '',
          TOTAL_PAID_AMOUNT_4:  payload.TOTAL_PAID_AMOUNT_4  ?? '',
          BASIC_AMOUNT_4:       payload.BASIC_AMOUNT_4       ?? '',
          CGST_4:               payload.CGST_4               ?? '',
          SGST_4:               payload.SGST_4               ?? '',
          NET_AMOUNT_4:         payload.NET_AMOUNT_4         ?? '',
          PAYMENT_MODE_17:      payload.PAYMENT_MODE_17      ?? '',
          BANK_DETAILS_17:      payload.BANK_DETAILS_17      ?? '',
          PAYMENT_DETAILS_17:   payload.PAYMENT_DETAILS_17   ?? '',
          PAYMENT_DATE_17:      payload.PAYMENT_DATE_17      ?? '',
          Remark_Blank:         payload.Remark_Blank         ?? '',
        },
      }),

      invalidatesTags: ['DimPayments'],

      // Optimistic update + rollback on error
      async onQueryStarted({ uid, ...patchValues }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          dimPaymentApi.util.updateQueryData(
            'getDimPaymentsPending',
            undefined,
            (draft) => {
              const item = draft.data.find(
                (row) => row.uid === uid || row.Office_Bill_No === uid
              );
              if (item) {
                Object.assign(item, patchValues);
                // Optional: item._optimisticStatus = 'saving';
              }
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

  }),
});

// ────────────────────────────────────────────────
// Exported Hooks
// ────────────────────────────────────────────────
export const {
  useGetDimPaymentsPendingQuery,
  useLazyGetDimPaymentsPendingQuery,
  useUpdateDimPaymentMutation,
} = dimPaymentApi;

// For store.js → reducer export
export default dimPaymentApi.reducer;