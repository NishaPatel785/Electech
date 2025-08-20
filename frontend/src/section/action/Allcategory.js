import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosHttp from "../utils/axiousHttp"
export const getAllCategory = createAsyncThunk(
    "getCategory",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosHttp.get("/get-categorysubcategory");
            // console.log("API Response:", response.data); // Debugging
            return response.data;
        } catch (error) {
            console.error("API Error:", error);
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);
