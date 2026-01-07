import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// VITE project mein .env se base URL (VITE_ prefix compulsory)
const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const approval1ApiSlice = createApi({
  reducerPath: 'approval1Api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['OfficeExpenses'], // Tag for invalidation on update
  endpoints: (builder) => ({
    // 1. Get Pending Office Expenses for Approval (Level 1)
    getPendingOfficeExpenses: builder.query({
      query: () => '/api/Expenses/GET-Office-Expenses-Data-Approved1',
      providesTags: ['OfficeExpenses'],
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

    // 2. Update Approval Status (Approve/Reject with revised amount, remark, etc.)
    updateOfficeExpenseApproval: builder.mutation({
      query: ({ uid, STATUS_2, REVISED_AMOUNT_3, APPROVAL_DOER_2, REMARK_2 }) => ({
        url: '/api/Expenses/update-RCC-OFFICE-Expenses-Data-Approved1',
        method: 'POST',
        body: {
          uid,
          STATUS_2,
          REVISED_AMOUNT_3,
          APPROVAL_DOER_2,
          REMARK_2,
        },
      }),
      invalidatesTags: ['OfficeExpenses'], // Refetch pending list after update
    }),
  }),
});

// Exported hooks for use in components
export const {
  useGetPendingOfficeExpensesQuery,
  useUpdateOfficeExpenseApprovalMutation,
} = approval1ApiSlice;

// Reducer export for store.js mein add karne ke liye
export default approval1ApiSlice;