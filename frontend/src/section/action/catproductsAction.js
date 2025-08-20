import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosHttp from "../utils/axiousHttp";


export const getProductsByCategoryOrSubcategory = createAsyncThunk(
    "AllProducts",
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await axiosHttp.get(`/products/${id}`);
            console.log("Fetched Products:", data);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch products");
        }
    }
);