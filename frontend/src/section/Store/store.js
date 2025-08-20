import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import AllcategoryReducer from "./AllcategoriesSlice";
import AllproductbycategoryReducer from "./AllproductSlice";
import categoryReducer from "./categorysSlice";
import productReducer from "./product_slice";
import WishReducer from "./WishlistSlice";
import CartReducer from "./CartSlice";
import RegisterReducer from "./RegisterSlice"
import otpReducer from "./forgetPassSlice"
import checkOutReducers from "./checkoutSlice"
import contactReducers  from "./ContactSlice"
import paymentReducers from "./paymentSlice"
import reviewRdeducers from "./ReviewSlice"
import orderReducer from "./orderSlice"




const store=configureStore({
  middleware:(getDefaultMiddleware)=>{
    return getDefaultMiddleware({
      serializableCheck:{
        ignoreActions:["getProducts"]
      }
    })
  },
    reducer: {
        auth: authReducer,
        Allcat: AllcategoryReducer,
        Allproducts: AllproductbycategoryReducer,
        products:productReducer,
        categorys:categoryReducer,
        wishlist:WishReducer,
        cart:CartReducer,
        register:RegisterReducer,
        otp:otpReducer,
        checkout:checkOutReducers,
        contact:contactReducers,
        payment:paymentReducers,
        review:reviewRdeducers,
        order:orderReducer
      },
    
});

export default store;