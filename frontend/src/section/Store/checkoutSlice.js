import { createSlice } from "@reduxjs/toolkit";
import { directCheckout,cartCheckout,clearCheckout,getCheckout } from "../action/checkoutAction";


const checkoutSlice=createSlice({
    name:"checkout",
    initialState:{
        checkout:[],
        loading:false,
        error:null,
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder 

        .addCase(getCheckout.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(getCheckout.fulfilled,(state,action)=>{
            console.log(action.payload)
            state.loading=false;
            state.checkout=action.payload;
        })
        .addCase(getCheckout.rejected,(state,action)=>{
            state.loading=true;
            state.error=action.payload
        })

        .addCase(directCheckout.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(directCheckout.fulfilled,(state,action)=>{
            state.loading=false;
            state.checkout=action.payload;
        })
        .addCase(directCheckout.rejected,(state,action)=>{
            state.loading=true;
            state.error=action.payload
        })

        .addCase(cartCheckout.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(cartCheckout.fulfilled,(state,action)=>{
            state.loading=false;
            state.checkout=action.payload;
        })
        .addCase(cartCheckout.rejected,(state,action)=>{
            state.loading=true;
            state.error=action.payload
        })
        .addCase(clearCheckout.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(clearCheckout.fulfilled,(state,action)=>{
            state.loading=false;
            state.checkout=action.payload;
        })
        .addCase(clearCheckout.rejected,(state,action)=>{
            state.loading=true;
            state.error=action.payload
        })
    }
})

export default checkoutSlice.reducer;