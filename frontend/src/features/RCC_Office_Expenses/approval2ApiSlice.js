// features/RCC_Office_Expenses/approval2ApiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const approval2ApiSlice = createApi({
  reducerPath: 'approval2Api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['OfficeExpensesLevel2'],
  endpoints: (builder) => ({
    // GET - Pending records for level 2 approval
    getPendingOfficeExpensesLevel2: builder.query({
      query: () => '/api/Expenses/Get-Approvel-2',
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

    // POST - Update by OFFBILLUID (all matching rows)
    updateOfficeExpenseByOFFBILLUID: builder.mutation({
      query: ({ OFFBILLUID, STATUS_2, PAYMENT_MODE_3, REMARK_2 }) => ({
        url: '/api/Expenses/Post-Approvel-2',
        method: 'POST',
        body: {
          OFFBILLUID,
          STATUS_2,
          PAYMENT_MODE_3,
          REMARK_2,
        },
      }),
      invalidatesTags: ['OfficeExpensesLevel2'],
    }),
  }),
});

// ✅ IMPORTANT: Yeh exports match hone chahiye
export const {
  useGetPendingOfficeExpensesLevel2Query,
  useUpdateOfficeExpenseByOFFBILLUIDMutation,  // ← Yeh naam exactly same hona chahiye
} = approval2ApiSlice;

export default approval2ApiSlice.reducer;