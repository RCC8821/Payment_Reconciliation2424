// src/app/store.js

import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../src/features/Auth/LoginSlice';

// === Payment Related Slices ===
import { PaymentSlice } from './features/Payment/PaymentSlice';
import { FormSlice } from './features/Payment/FormSlice';
import { ActualBankInSlice } from './features/Payment/Actual_Bank_In_Slice';
import { bankTransferApiSlice } from './features/Payment/bank_to_bank_transfer_slice';

// === RCC Office Expenses ===

import { approval2ApiSlice } from './features/RCC_Office_Expenses/approval2ApiSlice';
import {dimPaymentApi} from './features/RCC_Office_Expenses/paymentSlice'
import {billEntryApi} from './features/RCC_Office_Expenses/BillEntry'
import {officeFormApi} from "./features/RCC_Office_Expenses/officeFormSlice"


// === Summary ===
import { mainSummaryApi } from './features/Summary/mainSummarySlice';

// === GST ===
import { gstApi } from './features/GST/GstSlice';   // ← your new slice

export const store = configureStore({
  reducer: {
    auth: authReducer,

    // Payment group
    [PaymentSlice.reducerPath]: PaymentSlice.reducer,
    [FormSlice.reducerPath]: FormSlice.reducer,
    [ActualBankInSlice.reducerPath]: ActualBankInSlice.reducer,
    [bankTransferApiSlice.reducerPath]: bankTransferApiSlice.reducer,

    // RCC Office
      [billEntryApi.reducerPath]: billEntryApi.reducer,
    [approval2ApiSlice.reducerPath]: approval2ApiSlice.reducer,
     [dimPaymentApi.reducerPath]: dimPaymentApi.reducer,
     [officeFormApi.reducerPath]: officeFormApi.reducer,

   

    // Summary
    [mainSummaryApi.reducerPath]: mainSummaryApi.reducer,

    // GST
    [gstApi.reducerPath]: gstApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Good — keeps dates, etc. working
    })
      // Payment group
      .concat(PaymentSlice.middleware)
      .concat(FormSlice.middleware)
      .concat(ActualBankInSlice.middleware)
      .concat(bankTransferApiSlice.middleware)

      // RCC Office
        .concat(billEntryApi.middleware)
      .concat(approval2ApiSlice.middleware)
     .concat(dimPaymentApi.middleware)
     .concat(officeFormApi.middleware)

      

      // Summary
      .concat(mainSummaryApi.middleware)

      // GST (last one)
      .concat(gstApi.middleware),
});