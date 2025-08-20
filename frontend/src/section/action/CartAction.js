import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosHttp from "../utils/axiousHttp";

// ✅ Fetch Cart
export const getCart = createAsyncThunk("cart/fetchCart", async (_, { rejectWithValue }) => {
    try {
        const token = sessionStorage.getItem("refreshToken");
        const response = await axiosHttp.get("/getCart", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        // console.log("Cart Data:", response.data);
        return response.data;
    } catch (error) {
        console.error("Fetch Cart Error:", error.response?.data || error.message);
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});


export const addToCart = createAsyncThunk("cart/addToCart", async ({ productId, quantity,variant_id }, { rejectWithValue, dispatch }) => {
    try {
        const token = sessionStorage.getItem("refreshToken");
        console.log("Adding Product ID:", productId, "Quantity:", quantity,"variant_id:",variant_id);
        
        const response = await axiosHttp.post("/addCart", { product_id: productId, quantity ,variant_id}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log("Add Cart Response:", response.data);
        console.log("ProductId:", productId);
        dispatch(getCart()); 
        return response.data;
    } catch (error) {
        console.error("Add Cart Error:", error.response?.data || error.message);
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});


export const removeFromCart = createAsyncThunk("cart/removeFromCart", async ({productId,variant_id}, { rejectWithValue, dispatch }) => {
    try {
        const token = sessionStorage.getItem("refreshToken");
        
        const response = await axiosHttp.post(`/deleteCart`,{product_id:productId,variant_id}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log("Removing Product ID:", productId);
        console.log("Remove Cart Response:", response.data);
        dispatch(getCart()); 
        return response.data;
    } catch (error) {
        console.error("Remove Cart Error:", error.response?.data || error.message);
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

// ✅ Clear Entire Cart
export const clearCart = createAsyncThunk("cart/clearCart", async (_, { rejectWithValue, dispatch }) => {
    try {
        const token = sessionStorage.getItem("refreshToken");
        console.log("Clearing Cart");
        
        const response = await axiosHttp.delete("/clearCart", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log("Clear Cart Response:", response.data);
        dispatch(getCart()); 
        return response.data;
    } catch (error) {
        console.error("Clear Cart Error:", error.response?.data || error.message);
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const updateCart = createAsyncThunk(
    "cart/updateCart",
    async ( {id, quantity }, { rejectWithValue, dispatch })  => { 
        console.log(id,quantity)
        try {
            const token = sessionStorage.getItem("refreshToken");
            const response = await axiosHttp.put(`/updateCart/${id}`, { quantity }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("Update Cart Response:", response.data);
            dispatch(getCart());
            return response.data;
        } catch (error) {
            console.error("Update Cart Error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

  
