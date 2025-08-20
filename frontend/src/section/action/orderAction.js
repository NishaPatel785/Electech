import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosHttp from "../utils/axiousHttp";

export const order = createAsyncThunk("order/fetchOrder", async (_, { rejectWithValue }) => {
    try {
        const token = sessionStorage.getItem("refreshToken"); 
        const response = await axiosHttp.get("/my-orders", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log("Order Data:", response.data);
        return response.data; 
    } catch (error) {
        console.error("Fetch Order Error:", error.response?.data || error.message);
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

