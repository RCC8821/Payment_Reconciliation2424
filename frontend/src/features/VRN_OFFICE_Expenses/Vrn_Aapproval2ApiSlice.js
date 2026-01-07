import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Vite ke liye environment variable (VITE_ prefix compulsory)
const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const Vrn_Approval2ApiSlice = createApi({
  reducerPath: 'vrnApproval2Api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      // Agar future mein auth token chahiye to yahan add kar sakte ho
      // const token = localStorage.getItem('token');
      // if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['OfficeExpensesLevel2'],
  endpoints: (builder) => ({
    // GET: Level 2 Approval ke liye Pending Office Expenses
    getPendingOfficeExpensesLevel2: builder.query({
      query: () => '/api/vrn-Expenses/GET-VRN-Expenses-Data-Approved2',
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

    // POST: Level 2 Final Approval / Reject
    updateOfficeExpenseFinalApproval: builder.mutation({
      query: ({ uid, STATUS_3, FINAL_AMOUNT_3, REMARK_3 }) => ({
        url: '/api/vrn-Expenses/update-VRN-OFFICE-Expenses-Data-Approved2',
        method: 'POST',
        body: {
          uid,
          STATUS_3,
          FINAL_AMOUNT_3,
          REMARK_3,
        },
      }),
      invalidatesTags: ['OfficeExpensesLevel2'], // Update ke baad list refresh ho jayegi
    }),
  }),
});

// Auto-generated hooks
export const {
  useGetPendingOfficeExpensesLevel2Query,
  useUpdateOfficeExpenseFinalApprovalMutation,
} = Vrn_Approval2ApiSlice;

// Store mein inject karne ke liye default export
export default Vrn_Approval2ApiSlice;