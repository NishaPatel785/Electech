import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosHttp from "../utils/axiousHttp";

export const addToContact = createAsyncThunk(
    "contact/addToContact",
    async (userData, { rejectWithValue, dispatch }) => {
        try {
            const token = sessionStorage.getItem("refreshToken"); // ✅ Ensure consistency
            
            const response = await axiosHttp.post(
                "/add-contact",userData, 
                {
                     headers: { Authorization: `Bearer ${token}` } }
            );

            console.log("Add Contact Response:", response.data);
            
            return response.data; // 
        } catch (error) {
            console.error("Add Wishlist Error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);