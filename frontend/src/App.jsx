


import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from "react";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Header from "./section/global/Header/Header";
import {BrowserRouter,Route,Routes} from 'react-router-dom'
import HomeMain from './section/Home/HomeMain';
import Aboutus from './section/About us/AboutUs';
import ShopMain from './section/Shop/ShopMain';
import PrivateRoute from './section/PrivateRoute/PrivateRoute';
import Login from './section/Login/Login';
import Register from './section/Register/Register';
import ForgetPass from './section/Forgetpass/ForgetPass';
import { Provider } from 'react-redux';
import store from './section/Store/store';
import Products from './section/Home/Products/Products';
import Wishlist from './section/Wishlist/Wishlist';
import AddToCart from './section/AddToCart/AddToCart';
import Contact from './section/Contact/Contact';
import Footer from './section/global/Footer/Footer';
import Collections from './section/Home/ShowCategory/Collections/Collection';
import ProductCard from './section/Home/ShowCategory/ProductCard';
import Subscribe from './section/global/Footer/Subscribe/Subscribe';
import ForgetPass2 from './section/Forgetpass/ForgetPass2';
import CartSidebar from './section/CartSidebar/CartSidebar';
import Checkout from './section/Checkout/Checkout';
import AccountWelcome from './section/AccountWelcome/AccountWelcome';
import Success from './section/success/Success';

function App() {


  

const [toggled,setToggled]=useState(false);
return (
    <>
    <Provider store={store}>
    <BrowserRouter>
        <Header />
        <CartSidebar toggled={toggled} setToggled={setToggled}/>
        <Routes>
          {/* Default Home Page (Always Accessible) */}
          <Route path="/" element={<HomeMain />} />
          <Route path="/home" element={<HomeMain />} />

          {/* Private Routes (Require Authentication) */}
          <Route element={<PrivateRoute />}>
            <Route path="/about-us" element={<Aboutus />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/shop" element={<ShopMain />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/category/:id" element={<ProductCard />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/products/:id" element={<Products toggled={toggled} setToggled={setToggled} />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/addtocart" element={<AddToCart toggled={toggled} setToggled={setToggled}  />} />
            <Route path="/success" element={<Success />} />
         
          </Route>

          {/* Login Page */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forget-pass" element={<ForgetPass />} />
          <Route path="/forget-pass2" element={<ForgetPass2 />} />
          <Route path='/logout' element={<AccountWelcome/>} />


          {/* 404 Page Not Found */}
          <Route path="*" element={<h2>Page Not Found</h2>} />
        </Routes>
        <Subscribe/>
        <Footer/>
      </BrowserRouter>
      </Provider>
    </>

  );
}

export default App
