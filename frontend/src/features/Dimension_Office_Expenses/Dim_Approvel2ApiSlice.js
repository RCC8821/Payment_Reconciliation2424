import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Vite ke liye environment variable
const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const Dim_Approvel2ApiSlice = createApi({
  reducerPath: 'dimApprovel2Api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      // Agar future mein authentication lagega to yahan token add kar sakte ho
      // const token = localStorage.getItem('token');
      // if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['DimOfficeExpensesLevel2'],
  endpoints: (builder) => ({
    // GET: DIM Level 2 Approval ke liye Pending Expenses
    getPendingDimOfficeExpensesLevel2: builder.query({
      query: () => '/api/Dim-Expenses/GET-DIM-Expenses-Data-Approved2',
      providesTags: ['DimOfficeExpensesLevel2'],
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

    // POST: DIM Level 2 Final Approval / Reject
    updateDimOfficeExpenseFinalApproval: builder.mutation({
      query: ({ uid, STATUS_3, FINAL_AMOUNT_3, REMARK_3 }) => ({
        url: '/api/Dim-Expenses/update-DIM-OFFICE-Expenses-Data-Approved2',
        method: 'POST',
        body: {
          uid,
          STATUS_3,
          FINAL_AMOUNT_3,
          REMARK_3,
        },
      }),
      invalidatesTags: ['DimOfficeExpensesLevel2'], // Update ke baad list auto-refresh
    }),
  }),
});

// Auto-generated hooks
export const {
  useGetPendingDimOfficeExpensesLevel2Query,
  useUpdateDimOfficeExpenseFinalApprovalMutation,
} = Dim_Approvel2ApiSlice;

// Store mein add karne ke liye default export
export default Dim_Approvel2ApiSlice;