

// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// export const FormSlice = createApi({
//   reducerPath: 'formApi',
//   baseQuery: fetchBaseQuery({
//     baseUrl: import.meta.env.VITE_BACKEND_URL, // .env mein backend URL set kiya hua hona chahiye
//   }),
//   tagTypes: ['Payment', 'Dropdown'], // optional, future ke liye
//   endpoints: (builder) => ({
//     // Existing: Add Payment
//     addPayment: builder.mutation({
//       query: (paymentData) => ({
//         url: '/api/add-payment',
//         method: 'POST',
//         body: paymentData,
//       }),
//       // invalidatesTags: ['Payment'], // agar list refresh karni ho to uncomment
//     }),

//     // New: Fetch Dropdown Data (Projects + Accounts)
//     getDropdownData: builder.query({
//       query: () => '/api/Dropdown-Data', // backend route jo aapne banaya hai
//       // Optional: transform response agar structure change karna ho
//       transformResponse: (response) => {
//         if (response.success) {
//           return {
//             projects: response.projects || [],
//             accounts: response.accounts || [],
//           };
//         }
//         return { projects: [], accounts: [] };
//       },
//       // Agar cache karna chahte ho (recommended for dropdowns)
//       keepUnusedDataFor: 60 * 60, // 1 hour cache
//       providesTags: ['Dropdown'],
//     }),
//   }),
// });

// // Hooks export kar rahe hain
// export const { 
//   useAddPaymentMutation, 
//   useGetDropdownDataQuery   // Yeh naya hook hai dropdown ke liye
// } = FormSlice;

// export default FormSlice;




import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const FormSlice = createApi({
  reducerPath: 'formApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL, // .env mein backend URL set ho
  }),
  tagTypes: ['Payment', 'BankTransfer', 'Dropdown'],
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

    // 2. NAYA: Bank Transfer Form Submit (A/C to A/C Transfer)
    submitBankTransfer: builder.mutation({
      query: (transferData) => ({
        url: '/api/Bank_Transfer_form',   // ← Yeh wahi route hai jo aapne backend mein banaya
        method: 'POST',
        body: transferData,
      }),
      invalidatesTags: ['BankTransfer'], // agar future mein list refresh karna ho
    }),

    // 3. Dropdown Data (Projects + Accounts)
    getDropdownData: builder.query({
      query: () => '/api/Dropdown-Data',
      transformResponse: (response) => {
        if (response.success) {
          return {
            projects: response.projects || [],
            accounts: response.accounts || [],
          };
        }
        return { projects: [], accounts: [] };
      },
      keepUnusedDataFor: 60 * 60, // 1 hour cache
      providesTags: ['Dropdown'],
    }),
  }),
});

// === Hooks Export (Ab 3 hooks milenge) ===
export const {
  useAddPaymentMutation,          // Purane forms ke liye (agar koi use kar raha hai)
  useSubmitBankTransferMutation,  // ← NAYA: Bank Transfer form ke liye
  useGetDropdownDataQuery,        // Dropdown ke liye (already tha)
} = FormSlice;

export default FormSlice;