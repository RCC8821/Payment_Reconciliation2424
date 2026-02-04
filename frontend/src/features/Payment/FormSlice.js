
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const FormSlice = createApi({
  reducerPath: 'formApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL, // .env mein backend URL set hona chahiye
  }),

  // Tags jo hum invalidate / refetch karenge
  tagTypes: ['Payment', 'BankTransfer', 'CapitalMovement', 'Dropdown'],

  endpoints: (builder) => ({

    // 1. General Payment (pehle wala – backward compatibility ke liye)
    addPayment: builder.mutation({
      query: (paymentData) => ({
        url: '/api/add-payment',
        method: 'POST',
        body: paymentData,
      }),
      invalidatesTags: ['Payment'],
    }),

    // 2. Bank Transfer Form Submit (A/C to A/C Transfer)
    submitBankTransfer: builder.mutation({
      query: (transferData) => ({
        url: '/api/Bank_Transfer_form',
        method: 'POST',
        body: transferData,
      }),
      invalidatesTags: ['BankTransfer'],
    }),

    // 3. NAYA: Capital Movement / Capital A/C Form Submit
    submitCapitalMovement: builder.mutation({
      query: (capitalData) => ({
        url: '/api/Captial-A/C',           // ← yeh wahi route hai jo aapne backend mein banaya
        method: 'POST',
        body: capitalData,
      }),
      invalidatesTags: ['CapitalMovement'], // agar future mein list refresh chahiye to
    }),

    // 4. Dropdown Data (Projects + Accounts + Capital Movements)
    getDropdownData: builder.query({
      query: () => '/api/Dropdown-Data',
      transformResponse: (response) => {
        if (response.success) {
          return {
            projects: response.projects || [],
            accounts: response.accounts || [],
            capitalMovements: response.capitalMovements || [],
          };
        }
        return { projects: [], accounts: [], capitalMovements: [] };
      },
      keepUnusedDataFor: 60 * 60, 
      providesTags: ['Dropdown'],
    }),

  }),
});

// Hooks export
export const {
  useAddPaymentMutation,
  useSubmitBankTransferMutation,
  useSubmitCapitalMovementMutation,      
  useGetDropdownDataQuery,
} = FormSlice;

export default FormSlice;