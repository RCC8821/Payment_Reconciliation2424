

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// VITE project mein .env se base URL
const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const approval2ApiSlice = createApi({
  reducerPath: 'approval2Api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      // Agar token chahiye to yahan add kar sakte ho
      // const token = localStorage.getItem('token');
      // if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['OfficeExpensesLevel2'],
  endpoints: (builder) => ({
    // Get pending records for level 2 approval
    getPendingOfficeExpensesLevel2: builder.query({
      query: () => '/api/Expenses/GET-Office-Expenses-Data-Approved2',
      providesTags: ['OfficeExpensesLevel2'],
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

    // Update final approval – IMPORTANT: destructuring mein PAYMENT_MODE_3 add karo
    updateOfficeExpenseFinalApproval: builder.mutation({
      query: ({ uid, STATUS_3, FINAL_AMOUNT_3, PAYMENT_MODE_3, REMARK_3 }) => ({
        url: '/api/Expenses/update-RCC-OFFICE-Expenses-Data-Approved2',
        method: 'POST',
        body: {
          uid,
          STATUS_3,
          FINAL_AMOUNT_3,
          PAYMENT_MODE_3,          // ← yeh line ab sahi se kaam karegi
          REMARK_3,
        },
      }),
      invalidatesTags: ['OfficeExpensesLevel2'], // list auto-refresh hogi
    }),
  }),
});

export const {
  useGetPendingOfficeExpensesLevel2Query,
  useUpdateOfficeExpenseFinalApprovalMutation,
} = approval2ApiSlice;

export default approval2ApiSlice.reducer;