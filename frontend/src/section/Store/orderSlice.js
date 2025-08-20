import { createSlice } from "@reduxjs/toolkit";
import { order } from "../action/orderAction";

const orderSlice = createSlice({
    name: "order",
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(order.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(order.fulfilled, (state, action) => {
                state.loading = false;
                // state.items = action.payload.orders;
                state.items = action.payload?.orders || [];
                console.log(action.payload.orders)
            })
            .addCase(order.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
          
          
    },
});

export default orderSlice.reducer;