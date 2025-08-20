import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosHttp from "../utils/axiousHttp";

export const signUser = createAsyncThunk("sign/signUser", async (userData, { rejectWithValue }) => {
    try {
        const response = await axiosHttp.post("/add-user", userData);
        sessionStorage.setItem("refreshToken", response.data.token);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "sign in failed.");
    }
});

