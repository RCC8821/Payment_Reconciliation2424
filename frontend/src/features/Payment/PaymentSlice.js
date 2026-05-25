

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const PaymentSlice = createApi({
  reducerPath: 'paymentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL,
  }),
  tagTypes: ['ReconciliationData', 'BankBalance'],
  endpoints: (builder) => ({

    getPaymentReconciliation: builder.query({
      query: () => '/api/payment-Reconsilation',
      transformResponse: (response) => response.data || [],
      providesTags: ['ReconciliationData'],
    }),

    getBankClosingBalance: builder.query({
      query: (bankName) =>
        `/api/bank-balance/${encodeURIComponent(bankName)}`,
      providesTags: (result, error, bankName) => [
        { type: 'BankBalance', id: bankName },
      ],
    }),

    updateReconciliation: builder.mutation({
      query: (payload) => ({
        url: '/api/update-reconciliation',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentDetails:                payload.paymentDetails,
          bankDetails:                   payload.bankDetails,
          bankClosingBalanceAfterPayment: payload.bankClosingBalanceAfterPayment,
          status:                        payload.status,
          remark:                        payload.remark,
          firmName:                      payload.firmName,  // ← yeh missing tha
        }),
      }),
      invalidatesTags: ['ReconciliationData'],
    }),

  }),
});

export const {
  useGetPaymentReconciliationQuery,
  useGetBankClosingBalanceQuery,
  useLazyGetBankClosingBalanceQuery,
  useUpdateReconciliationMutation,
} = PaymentSlice;