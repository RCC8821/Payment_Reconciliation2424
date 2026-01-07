import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Vite environment variable
const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const vrnApproval1ApiSlice = createApi({
  reducerPath: 'vrnApproval1Api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      // Future mein token add karne ke liye ready
      // const token = localStorage.getItem('token');
      // if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['OfficeExpenses'],
  endpoints: (builder) => ({
    // GET: Pending Office Expenses for VRN Level 1 Approval
    getPendingOfficeExpenses: builder.query({
      query: () => '/api/vrn-Expenses/GET-VRN-Office-Expenses-Data-Approved1',
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

    // POST: Update Approval Status (Approve/Reject)
    updateOfficeExpenseApproval: builder.mutation({
      query: ({ uid, STATUS_2, REVISED_AMOUNT_3, APPROVAL_DOER_2, REMARK_2 }) => ({
        url: '/api/vrn-Expenses/update-VRN-OFFICE-Expenses-Data-Approved1',
        method: 'POST',
        body: {
          uid,
          STATUS_2,
          REVISED_AMOUNT_3,
          APPROVAL_DOER_2,
          REMARK_2,
        },
      }),
      invalidatesTags: ['OfficeExpenses'],
    }),
  }),
});

// Updated Hooks with new naming
export const {
  useGetPendingOfficeExpensesQuery,
  useUpdateOfficeExpenseApprovalMutation,
} = vrnApproval1ApiSlice;

// Default export for store
export default vrnApproval1ApiSlice;