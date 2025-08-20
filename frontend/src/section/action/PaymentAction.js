import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosHttp from "../utils/axiousHttp";

// Razorpay Order Creation
export const createRazorpayOrder = createAsyncThunk(
  "checkout/createRazorpayOrder",
  async (fromCart, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("refreshToken");
      const response = await axiosHttp.get(`/create-order?from_cart=${fromCart}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Razorpay Order Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const verifyRazorpayPayment = createAsyncThunk(
  "payment/verify",
  async ({ response, amount, from_cart, deliveryInfo }, thunkAPI) => {
    try {
      const token = sessionStorage.getItem("refreshToken");
      const { data } = await axiosHttp.post(
        "/verify-payment",
        {
          response: {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          },
          amount,
          from_cart,
          deliveryInfo,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data;
    } catch (error) {
      console.log("Razorpay Verify Error:", error.response?.data);
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);
