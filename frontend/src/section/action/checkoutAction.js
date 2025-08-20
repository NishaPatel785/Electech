import { createAsyncThunk } from "@reduxjs/toolkit";

import axiosHttp from "../utils/axiousHttp";

export const getCheckout=createAsyncThunk("checkout/fetchCheckout",async (searchQuery, {rejectWithValue})=>{
    try{
        const token=sessionStorage.getItem("refreshToken");
        const response =await axiosHttp.get("/get-checkout",{
            headers:{
                Authorization:`Bearer ${token}`,
            },
                params: {from_cart : searchQuery},
            }
        );
        return response.data;
    }catch(error){
        console.error("Fetch Cart Error:", error.response?.data || error.message);
        return rejectWithValue(error.response?.data?.message || error.message);

    }
} );

export const directCheckout=createAsyncThunk("cart/addDirect",async({product_id, quantity,variant_id},{rejectWithValue,dispatch})=>{
    try{
        const token=sessionStorage.getItem("refreshToken");
        console.log("Adding productid",product_id,"Quantity:", quantity,"variant_id:",variant_id)

        const response=await axiosHttp.post('/direct-checkout',{product_id,quantity,variant_id},{
            headers:{
                Authorization:`Bearer ${token}`,
            },
        });
        console.log("direct checkout response",response.data);
        console.log("productId",product_id);
        dispatch(getCheckout(false));
        return response.data
    }catch(error){
        console.error("Add checkout Error:", error.response?.data || error.message);
        return rejectWithValue(error.response?.data?.message || error.message);
    
    }
})

export const cartCheckout = createAsyncThunk(
    "cart/cartCheckout",
    async (_, { rejectWithValue, dispatch }) => {  
        try {
            const token = sessionStorage.getItem("refreshToken");

            const response = await axiosHttp.get('/cart-checkout',{
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // console.log(token);
            console.log("cart checkout response", response.data);

            dispatch(getCheckout(true));  
            return response.data;
        } catch (error) {
            console.error("Add checkout Error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);


export const clearCheckout = createAsyncThunk(
    "cart/clearCheckout",
    async (_, { rejectWithValue, dispatch }) => {
        try {
            const token = sessionStorage.getItem("refreshToken");
            console.log("Clearing Cart");

            const response = await axiosHttp.delete("/clear-checkout", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("Clear checkout Response:", response.data);

            // 🔥 Await this to ensure proper sequence
            await dispatch(getCheckout());

            return response.data;
        } catch (error) {
            console.error("Clear Cart Error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);


