// src/features/FormSlice.js  (ya jo path aap use karte ho)

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const FormSlice = createApi({
  reducerPath: 'formApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL, // same jaise PaymentSlice mein hai
  }),
  tagTypes: ['Payment'], // optional – agar future mein cache invalidate karna ho
  endpoints: (builder) => ({
    addPayment: builder.mutation({
      query: (paymentData) => ({
        url: '/api/add-payment',           // aapka backend route
        method: 'POST',
        body: paymentData,
      }),
      // Agar future mein koi list refresh karni ho to yeh line use karna
      // invalidatesTags: ['Payment'],
    }),
  }),
});

// Hook export – component mein directly use kar sakte ho
export const { useAddPaymentMutation } = FormSlice;

export default FormSlice;