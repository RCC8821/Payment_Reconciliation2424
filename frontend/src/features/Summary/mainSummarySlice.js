
// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

// export const mainSummaryApi = createApi({
//   reducerPath: 'mainSummaryApi',

//    baseQuery: fetchBaseQuery({
//     baseUrl,
//     prepareHeaders: (headers) => {
//       headers.set('Content-Type', 'application/json');
//       return headers;
//     },
//   }),

//   tagTypes: ['BankSummary'], 

//   endpoints: (builder) => ({
    
//     getMainBankSummary: builder.query({
//       query: () => '/apiSummary/Summary-main',  
//       providesTags: ['BankSummary'],

//       transformResponse: (response) => {
//         // Response validation aur clean structure
//         if (response?.success) {
//           return {
//             inTotal: response.inTotal || null,
//             outTotal: response.outTotal || null,
//             netBalance: response.netBalance || null,
//             transactions: response.transactions || [],
//             totalTransactions: response.totalTransactions || 0,
//             debug: response.debug || null, // testing ke liye optional
//             message: response.message || '',
//           };
//         }

//         // Agar success false ho ya kuch galat aaye
//         return {
//           inTotal: null,
//           outTotal: null,
//           netBalance: null,
//           transactions: [],
//           totalTransactions: 0,
//           message: response?.error || 'Failed to load bank summary',
//         };
//       },

//       // Optional: agar har 5-10 minute mein auto-refresh chahiye
//       // pollingInterval: 300000, // 5 minutes
//     }),

//     // Agar future mein summary update/refund/add transaction jaisa kuch add karna ho
//     // to yahan mutation daal sakte ho, abhi sirf GET chahiye to skip kar rahe hain
//   }),
// });

// // Auto-generated hooks
// export const {
//   useGetMainBankSummaryQuery,
//   useLazyGetMainBankSummaryQuery,   // agar button click pe fetch karna ho
// } = mainSummaryApi;

// // Reducer export → store mein add karne ke liye
// export default mainSummaryApi;



///////////////////////////////////////////


import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const mainSummaryApi = createApi({
  reducerPath: 'mainSummaryApi',

  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),

  tagTypes: ['BankSummary', 'BankBalance'],

  endpoints: (builder) => ({
    // ────────────────────────────────────────────────
    // Existing: Main Bank Summary (All banks + transactions)
    // ────────────────────────────────────────────────
    getMainBankSummary: builder.query({
      query: () => '/apiSummary/Summary-main',
      providesTags: ['BankSummary'],

      transformResponse: (response) => {
        if (response?.success) {
          return {
            inTotal: response.inTotal || null,
            outTotal: response.outTotal || null,
            netBalance: response.netBalance || null,
            transactions: response.transactions || [],
            totalTransactions: response.totalTransactions || 0,
            debug: response.debug || null,
            message: response.message || '',
          };
        }

        return {
          inTotal: null,
          outTotal: null,
          netBalance: null,
          transactions: [],
          totalTransactions: 0,
          message: response?.error || 'Failed to load bank summary',
        };
      },

      // pollingInterval: 300000, // optional — 5 min auto-refresh
    }),

    // ────────────────────────────────────────────────
    // New: Bank-wise current balances
    // ────────────────────────────────────────────────
    getBankBalances: builder.query({
      query: () => '/apiSummary/Bank-Balance',
      providesTags: ['BankBalance'],

      transformResponse: (response) => {
        if (response?.success) {
          return {
            balances: response.data || [],
            totalBanks: (response.data || []).length,
            message: response.message || '',
          };
        }

        return {
          balances: [],
          totalBanks: 0,
          message: response?.error || 'Failed to load bank balances',
        };
      },

      
    }),
  }),
});

// Auto-generated hooks
export const {
  useGetMainBankSummaryQuery,
  useLazyGetMainBankSummaryQuery,
  useGetBankBalancesQuery,
  useLazyGetBankBalancesQuery,
} = mainSummaryApi;

export default mainSummaryApi;