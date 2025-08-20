import { createSlice } from "@reduxjs/toolkit";
import { getProductsByCategoryOrSubcategory } from "../action/catproductsAction";

const initialState = {
    products: [],
    loading: false,
    error: null,
};

const AllproductSlice = createSlice({
    name: "Allcategory",
    initialState: {
        products: [], // ✅ Should store products here
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getProductsByCategoryOrSubcategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProductsByCategoryOrSubcategory.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload.products || []; // ✅ Update products, not Allcategories
            })
            .addCase(getProductsByCategoryOrSubcategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch products";
            });
    },
});


export default AllproductSlice.reducer;
