import { createSlice } from "@reduxjs/toolkit";
import { getReview,addToReview } from "../action/reviewAction";

const initialState={
    review:[],
    errors:[],
    status:false
};

const reviewSlice=createSlice({
    name:"review",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(getReview.pending,(state)=>{
        state.status="pending";
        })
        .addCase(getReview.fulfilled,(state,action)=>{
        state.status="fulfilled";
        state.review=action.payload.reviews
        })
        .addCase(getReview.rejected,(state)=>{
            state.status = "failed";
        })
        .addCase(addToReview.pending,(state)=>{
        state.status="pending";
        })
        .addCase(addToReview.fulfilled,(state,action)=>{
        state.status="fulfilled";
        state.review=action.payload
        })
        .addCase(addToReview.rejected,(state,action)=>{
            state.errors.push(action.payload);
            state.status = "failed";
        })
    }
})

export default reviewSlice.reducer;