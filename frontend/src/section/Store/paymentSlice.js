import { createSlice } from "@reduxjs/toolkit";
import { verifyRazorpayPayment,createRazorpayOrder } from "../action/PaymentAction";

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    loading: false,
    order: null,
    paymentVerified: false,
    error: null,
  },
  reducers: {
    resetPaymentState: (state) => {
      state.loading = false;
      state.order = null;
      state.paymentVerified = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createRazorpayOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRazorpayOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(createRazorpayOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyRazorpayPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyRazorpayPayment.fulfilled, (state,action) => {
        state.loading = false;
        state.paymentVerified = true;
        // state.paymentDetails = action.payload;
        console.log("Payment Verified:", action.payload); 
      })
      .addCase(verifyRazorpayPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;