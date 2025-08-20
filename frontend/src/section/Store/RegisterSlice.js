import { createSlice } from "@reduxjs/toolkit";
import { signUser } from "../action/RegisterAction";

const registerSlice = createSlice({
    name: "signIn",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
   
    extraReducers: (builder) => {
        builder
            .addCase(signUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(signUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default registerSlice.reducer;
