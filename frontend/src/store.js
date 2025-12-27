// src/app/store.js (ya jo bhi file hai)

import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../src/features/Auth/LoginSlice';

// === Slices Import ===
import { PaymentSlice } from './features/Payment/PaymentSlice';
import { FormSlice } from './features/Payment/FormSlice';
import {ActualBankInSlice} from './features/Payment/Actual_Bank_In_Slice'


export const store = configureStore({
  reducer: {
    auth: authReducer,

    // RTK Query reducers
    [PaymentSlice.reducerPath]: PaymentSlice.reducer,
    [FormSlice.reducerPath]: FormSlice.reducer,
    [ActualBankInSlice.reducerPath]: ActualBankInSlice.reducer,
    
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // non-serializable values jaise functions, dates ke liye
    })
    .concat(PaymentSlice.middleware)  // PaymentSlice ke liye
    .concat(FormSlice.middleware)    
    .concat(ActualBankInSlice.middleware),    
});