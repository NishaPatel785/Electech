import { createSlice } from "@reduxjs/toolkit";
import { categorys } from "../action/categorysAction";


const initialState = {
    categories: [],
    loading: false,
    error: null,
};

const categorysSlice = createSlice({
    name: "categorys",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(categorys.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(categorys.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload.categories; // Use action.payload
            })
            .addCase(categorys.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch categories";
            });
    },
});

export default categorysSlice.reducer;
