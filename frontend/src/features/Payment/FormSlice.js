// // src/features/FormSlice.js  (ya jo path aap use karte ho)

// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// export const FormSlice = createApi({
//   reducerPath: 'formApi',
//   baseQuery: fetchBaseQuery({
//     baseUrl: import.meta.env.VITE_BACKEND_URL, // same jaise PaymentSlice mein hai
//   }),
//   tagTypes: ['Payment'], // optional – agar future mein cache invalidate karna ho
//   endpoints: (builder) => ({
//     addPayment: builder.mutation({
//       query: (paymentData) => ({
//         url: '/api/add-payment',           // aapka backend route
//         method: 'POST',
//         body: paymentData,
//       }),
//       // Agar future mein koi list refresh karni ho to yeh line use karna
//       // invalidatesTags: ['Payment'],
//     }),
//   }),
// });

// // Hook export – component mein directly use kar sakte ho
// export const { useAddPaymentMutation } = FormSlice;

// export default FormSlice;



// src/features/FormSlice.js

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const FormSlice = createApi({
  reducerPath: 'formApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL, // .env mein backend URL set kiya hua hona chahiye
  }),
  tagTypes: ['Payment', 'Dropdown'], // optional, future ke liye
  endpoints: (builder) => ({
    // Existing: Add Payment
    addPayment: builder.mutation({
      query: (paymentData) => ({
        url: '/api/add-payment',
        method: 'POST',
        body: paymentData,
      }),
      // invalidatesTags: ['Payment'], // agar list refresh karni ho to uncomment
    }),

    // New: Fetch Dropdown Data (Projects + Accounts)
    getDropdownData: builder.query({
      query: () => '/api/Dropdown-Data', // backend route jo aapne banaya hai
      // Optional: transform response agar structure change karna ho
      transformResponse: (response) => {
        if (response.success) {
          return {
            projects: response.projects || [],
            accounts: response.accounts || [],
          };
        }
        return { projects: [], accounts: [] };
      },
      // Agar cache karna chahte ho (recommended for dropdowns)
      keepUnusedDataFor: 60 * 60, // 1 hour cache
      providesTags: ['Dropdown'],
    }),
  }),
});

// Hooks export kar rahe hain
export const { 
  useAddPaymentMutation, 
  useGetDropdownDataQuery   // Yeh naya hook hai dropdown ke liye
} = FormSlice;

export default FormSlice;