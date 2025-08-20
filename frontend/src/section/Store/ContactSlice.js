import { createSlice } from "@reduxjs/toolkit";
import { addToCart } from "../action/CartAction";

const contactSlice = createSlice({
    name: "contact",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
   
    extraReducers: (builder) => {
        builder
            .addCase(addToCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default contactSlice.reducer;
