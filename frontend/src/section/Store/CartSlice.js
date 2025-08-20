import { createSlice } from "@reduxjs/toolkit";
import { addToCart, getCart, clearCart, updateCart,removeFromCart } from "../action/CartAction";

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        cart: [],
        totalAmount: 0,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
           
            .addCase(getCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload.cart;
                state.totalAmount = action.payload.totalAmount;
            })
            .addCase(getCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            
            .addCase(addToCart.fulfilled, (state, action) => {
                state.cart = action.payload.cart || action.payload;
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.error = action.payload;
            })

            
            .addCase(updateCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload.cart || action.payload;
            })
            .addCase(updateCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(removeFromCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload.cart || action.payload;
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

           
            .addCase(clearCart.fulfilled, (state) => {
                state.cart = [];
            })
            .addCase(clearCart.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export default cartSlice.reducer;
