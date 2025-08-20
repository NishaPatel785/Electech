import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosHttp from "../utils/axiousHttp"
export const categorys = createAsyncThunk(
    "getCategorys",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosHttp.get("/get-categorys");
            // console.log("API Response:", response.data); // Debugging
            return response.data;
        } catch (error) {
            console.error("API Error:", error);
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);
