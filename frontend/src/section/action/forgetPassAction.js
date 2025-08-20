import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosHttp from "../utils/axiousHttp";

export const emailSend = createAsyncThunk("email/emailSend", async (userData, { rejectWithValue }) => {
    try {
        const response = await axiosHttp.post("/forget-password", userData);
        console.log(response.data)
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "incorrect email.");
    }
});

export const otpVerify = createAsyncThunk(
    "otp/otpVerify",
    async (userData, { rejectWithValue }) => {
      try {
        const response = await axiosHttp.post("/verify-otp", userData);
        sessionStorage.setItem("refreshToken", response.data.token);
        sessionStorage.setItem("user", JSON.stringify(response.data.user));
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Incorrect OTP.");
      }
    }
  );

