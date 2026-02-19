// src/features/GstSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Backend base URL .env se (VITE project ke liye)
const baseUrl = import.meta.env.VITE_BACKEND_URL;

export const gstApi = createApi({
  reducerPath: 'gstApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
    // Agar future mein JWT ya token chahiye to yahan add kar sakte ho
    // prepareHeaders: (headers) => {
    //   const token = localStorage.getItem('token');
    //   if (token) headers.set('Authorization', `Bearer ${token}`);
    //   return headers;
    // },
  }),
  tagTypes: ['GstData'], // Cache ko invalidate / refresh karne ke liye
  endpoints: (builder) => ({

    // ────────────────────────────────────────────────
    // GET /Gst-Data → pura GST data fetch karne ke liye
    // ────────────────────────────────────────────────
    getGstData: builder.query({
      query: () => '/api/Gst-Data',
      providesTags: ['GstData'],
      transformResponse: (response) => {
        // Agar backend success: true bhej raha hai to sirf data return karo
        return response.success ? response.data : [];
      },
    }),

    // ────────────────────────────────────────────────
    // POST /Gst-Followup-Update → followup update (timestamp, status, count, remark)
    // ────────────────────────────────────────────────
    updateGstFollowup: builder.mutation({
      query: ({ uid, status, remark }) => ({
        url: '/api/Gst-Followup-Update',
        method: 'POST',
        body: { uid, status, remark },
      }),
      invalidatesTags: ['GstData'], // Update hone ke baad list auto refresh ho jayegi
    }),

  }),
});

// Auto-generated hooks – inme se directly components mein use kar sakte ho
export const {
  useGetGstDataQuery,
  useUpdateGstFollowupMutation,
  useLazyGetGstDataQuery,           // agar manually trigger karna ho to
} = gstApi;

// Reducer export (store.js mein add karna hai)
export default gstApi;