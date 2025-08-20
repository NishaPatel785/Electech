import { createSlice } from "@reduxjs/toolkit";
import { getAllCategory } from "../action/Allcategory";

const initialState = {
  cat: [],
  loading: false,
  error: null,
};

const Allcategories = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.cat = action.payload;
      })
      .addCase(getAllCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch category products";
      });
  },
});

export default Allcategories.reducer;
