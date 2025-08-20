import { createSlice } from "@reduxjs/toolkit";
import { getProducts, AllProducts } from "../action/productActions";

const initialState = {
  products: [],
  errors: [],
  status: "idle",
};

const allProductsSlice = createSlice({
  name: "allProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.status = "pending";
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.products = action.payload.product;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.errors.push(action.payload);
        state.status = "failed";
      })
      .addCase(AllProducts.pending, (state) => {
        state.status = "pending";
      })
      .addCase(AllProducts.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.products = action.payload.products;
      })
      .addCase(AllProducts.rejected, (state, action) => {
        state.errors.push(action.payload);
        state.status = "failed";
      });
  },
});

export default allProductsSlice.reducer;
