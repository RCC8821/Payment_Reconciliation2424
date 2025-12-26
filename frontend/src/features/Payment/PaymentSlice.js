
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const PaymentSlice = createApi({
  reducerPath: 'paymentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL,
  }),
  tagTypes: ['ReconciliationData'], // Yeh tag add karo – cache invalidate karne ke liye
  endpoints: (builder) => ({
    getPaymentReconciliation: builder.query({
      query: () => '/api/payment-Reconsilation',
      transformResponse: (response) => response.data || [],
      providesTags: ['ReconciliationData'], // Yeh tag provide karega
    }),

    getBankClosingBalance: builder.query({
      query: (bankName) => `/api/bank-balance/${encodeURIComponent(bankName)}`,
    }),

    // Update mutation – save hone ke baad cache invalidate karega
    updateReconciliation: builder.mutation({
      query: ({ paymentDetails, bankClosingBalanceAfterPayment, status, remark }) => ({
        url: '/api/update-reconciliation',
        method: 'POST',
        body: { paymentDetails, bankClosingBalanceAfterPayment, status, remark }
      }),
      invalidatesTags: ['ReconciliationData'], // Yeh line add karo – save hone ke baad getPaymentReconciliation automatically refetch hoga
    }),
  }),
});

export const {
  useGetPaymentReconciliationQuery,
  useGetBankClosingBalanceQuery,
  useUpdateReconciliationMutation,
} = PaymentSlice;


