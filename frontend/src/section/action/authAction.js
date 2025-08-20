import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosHttp from "../utils/axiousHttp";

export const loginUser = createAsyncThunk("auth/loginUser", async (userData, { rejectWithValue }) => {
    try {
        const response = await axiosHttp.post("/login-user", userData);
        sessionStorage.setItem("refreshToken", response.data.token);
        sessionStorage.setItem("user",JSON.stringify(response.data.user))
        console.log(response.data)
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Login failed.");
    }
});

