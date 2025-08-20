import { createSlice } from "@reduxjs/toolkit";
import { loginUser } from "../action/authAction";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        isLogged:sessionStorage.getItem('user') ? true :false,
        user: JSON.parse(sessionStorage.getItem('user')),
        loading: false,
        error: null,
    },
    reducers: {
        login(state){
            state.isLogged=true;
        },
        logout: (state) => {
            state.isLogged=false,
            state.user = null;
            sessionStorage.removeItem("refreshToken");
            sessionStorage.removeItem("user")
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLogged=false,
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLogged=true,
                sessionStorage.getItem('user')
                state.loading = false;
                state.user = action.payload.user;

                
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLogged=false,
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
