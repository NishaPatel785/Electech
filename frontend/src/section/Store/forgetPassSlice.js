import { createSlice } from "@reduxjs/toolkit";
import { emailSend,otpVerify } from "../action/forgetPassAction";

const forgetPassSlice = createSlice({
    name: "forgetpass",
    initialState: {
        isLogged:sessionStorage.getItem('user') ? true :false,
        user: JSON.parse(sessionStorage.getItem('user')),
        loading: false,
        error: null,
    },
   
    extraReducers: (builder) => {
        builder
            .addCase(emailSend.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(emailSend.fulfilled, (state, action) => {
                state.isLogged=true,
                sessionStorage.getItem('user')
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(emailSend.rejected, (state, action) => {
                state.loading = false;
                state.error = "Invalid email";
            })
            .addCase(otpVerify.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(otpVerify.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(otpVerify.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    },
});

export default forgetPassSlice.reducer;
