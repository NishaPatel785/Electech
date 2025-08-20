import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosHttp from "../utils/axiousHttp";


export const getReview= createAsyncThunk("review/fetchReview", async (id, { rejectWithValue }) => {
    try {
        const token = sessionStorage.getItem("refreshToken");
        const response = await axiosHttp.get(`/get-review/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log("review Data:", response.data);
        return response.data;
    } catch (error) {
        console.error("Fetch Cart Error:", error.response?.data || error.message);
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});



export const addToReview = createAsyncThunk("review/addToreview", async (reviewData, { rejectWithValue, dispatch }) => {
    try {
        const token = sessionStorage.getItem("refreshToken");
        console.log("Review:",reviewData);
        
        const response = await axiosHttp.post("/add-review", reviewData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log("Add Review Response:", response.data);
        dispatch(getReview(reviewData.product_id)); 
        return response.data;
    } catch (error) {
        console.error("Add Cart Error:", error.response?.data || error.message);
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});