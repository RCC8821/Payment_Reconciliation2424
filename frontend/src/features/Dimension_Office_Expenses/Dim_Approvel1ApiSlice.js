import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Vite ke liye .env se base URL
const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const Dim_Approvel1ApiSlice = createApi({
  reducerPath: 'dimApprovel1Api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      // Future mein auth token add karne ke liye ready
      // const token = localStorage.getItem('token');
      // if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['DimOfficeExpenses'],
  endpoints: (builder) => ({
    // GET: DIM Level 1 Approval ke liye Pending Expenses
    getPendingDimOfficeExpenses: builder.query({
      query: () => '/api/Dim-Expenses/GET-DIM-Office-Expenses-Data-Approved1',
      providesTags: ['DimOfficeExpenses'],
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

    // POST: DIM Level 1 Approval Update (Approve/Reject)
    updateDimOfficeExpenseApproval: builder.mutation({
      query: ({ uid, STATUS_2, REVISED_AMOUNT_3, APPROVAL_DOER_2, REMARK_2 }) => ({
        url: '/api/Dim-Expenses/update-DIM-OFFICE-Expenses-Data-Approved1',
        method: 'POST',
        body: {
          uid,
          STATUS_2,
          REVISED_AMOUNT_3,
          APPROVAL_DOER_2,
          REMARK_2,
        },
      }),
      invalidatesTags: ['DimOfficeExpenses'], // Update ke baad list auto refresh
    }),
  }),
});

// Auto-generated hooks
export const {
  useGetPendingDimOfficeExpensesQuery,
  useUpdateDimOfficeExpenseApprovalMutation,
} = Dim_Approvel1ApiSlice;

// Store mein add karne ke liye
export default Dim_Approvel1ApiSlice;