import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosHttp from "../utils/axiousHttp";


export const AllProducts=createAsyncThunk(
    "allProducts",
    async(_,{rejectWithValue})=>{
        try{
            const {data}=await axiosHttp.get("get-products");
            return data;
        } catch(error){
            return rejectWithValue(error.response?.data || "failed to fetch products")
        }
    }
)

export const getProducts = createAsyncThunk(
    "getProducts",
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await axiosHttp.get(`/get-product/${id}`);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch products");
        }
    }
);