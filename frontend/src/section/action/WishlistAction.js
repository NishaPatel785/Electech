import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosHttp from "../utils/axiousHttp";


export const getWishlist = createAsyncThunk("wishlist/fetchWishlist", async (_, { rejectWithValue }) => {
    try {
        const token = sessionStorage.getItem("refreshToken"); 
        const response = await axiosHttp.get("/get-wish", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        // console.log("Wishlist Data:", response.data);
        return response.data; // Axios automatically parses JSON
    } catch (error) {
        console.error("Fetch Wishlist Error:", error.response?.data || error.message);
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});


export const addToWishlist = createAsyncThunk(
    "wishlist/addToWishlist",
    async (productId, { rejectWithValue, dispatch }) => {
        try {
            const token = sessionStorage.getItem("refreshToken"); // ✅ Ensure consistency
            console.log("Adding Product ID:", productId); 
            
            const response = await axiosHttp.post(
                "/add-wish",{ product_id: productId }, 
                {
                     headers: { Authorization: `Bearer ${token}` } }
            );

            console.log("Add Wishlist Response:", response.data);
            dispatch(getWishlist()); 
            return response.data; // ✅ Return actual API response
        } catch (error) {
            console.error("Add Wishlist Error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);



export const removeFromWishlist = createAsyncThunk("wishlist/removeFromWishlist", async (wishlistId, { rejectWithValue, dispatch }) => {
    try {
        const token = sessionStorage.getItem("refreshToken");
        console.log("Removing Wishlist Item:", wishlistId); 

        const response = await axiosHttp.delete(`/delete-wish/${wishlistId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log("Remove Wishlist Response:", response.data);
        dispatch(getWishlist());
        return { success: true, message: "Item removed from wishlist" };
    } catch (error) {
        console.error("Remove Wishlist Error:", error.response?.data || error.message);
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});
