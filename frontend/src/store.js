// src/app/store.js

import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../src/features/Auth/LoginSlice';

// === Payment Related Slices ===
import { PaymentSlice } from './features/Payment/PaymentSlice';
import { FormSlice } from './features/Payment/FormSlice';
import { ActualBankInSlice } from './features/Payment/Actual_Bank_In_Slice';
import { bankTransferApiSlice } from './features/Payment/bank_to_bank_transfer_slice';

// === RCC Office Expenses ===
import { approval1ApiSlice } from './features/RCC_Office_Expenses/approval1ApiSlice';
import { approval2ApiSlice } from './features/RCC_Office_Expenses/approval2ApiSlice';
import { rccPaymentApi } from './features/RCC_Office_Expenses/RccPayementSlice';

// === VRN Office Expenses ===
import { vrnApproval1ApiSlice } from './features/VRN_OFFICE_Expenses/Vrn_Approval1ApiSlice';
import { Vrn_Approval2ApiSlice } from './features/VRN_OFFICE_Expenses/Vrn_Aapproval2ApiSlice';
import { vrnPaymentApi } from './features/VRN_OFFICE_Expenses/VrnPaymentSlice';

// === Dimension Office Expenses ===
import { Dim_Approvel1ApiSlice } from './features/Dimension_Office_Expenses/Dim_Approvel1ApiSlice';
import { Dim_Approvel2ApiSlice } from './features/Dimension_Office_Expenses/Dim_Approvel2ApiSlice';
import { dimPaymentApi } from './features/Dimension_Office_Expenses/DimPaymentSlice';

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
    [approval1ApiSlice.reducerPath]: approval1ApiSlice.reducer,
    [approval2ApiSlice.reducerPath]: approval2ApiSlice.reducer,
    [rccPaymentApi.reducerPath]: rccPaymentApi.reducer,

    // VRN Office
    [vrnApproval1ApiSlice.reducerPath]: vrnApproval1ApiSlice.reducer,
    [Vrn_Approval2ApiSlice.reducerPath]: Vrn_Approval2ApiSlice.reducer,
    [vrnPaymentApi.reducerPath]: vrnPaymentApi.reducer,

    // Dimension Office
    [Dim_Approvel1ApiSlice.reducerPath]: Dim_Approvel1ApiSlice.reducer,
    [Dim_Approvel2ApiSlice.reducerPath]: Dim_Approvel2ApiSlice.reducer,
    [dimPaymentApi.reducerPath]: dimPaymentApi.reducer,

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
      .concat(approval1ApiSlice.middleware)
      .concat(approval2ApiSlice.middleware)
      .concat(rccPaymentApi.middleware)

      // VRN Office
      .concat(vrnApproval1ApiSlice.middleware)
      .concat(Vrn_Approval2ApiSlice.middleware)
      .concat(vrnPaymentApi.middleware)

      // Dimension Office
      .concat(Dim_Approvel1ApiSlice.middleware)
      .concat(Dim_Approvel2ApiSlice.middleware)
      .concat(dimPaymentApi.middleware)

      // Summary
      .concat(mainSummaryApi.middleware)

      // GST (last one)
      .concat(gstApi.middleware),
});