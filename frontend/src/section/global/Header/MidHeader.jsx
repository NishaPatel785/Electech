import { Col, Row } from "react-bootstrap"
import logo from "./logo-1.png"
import classes from "./Header.module.css"
import { FaRegUser } from "react-icons/fa";
import { GoHeart } from "react-icons/go";
import Badge from '@mui/material/Badge';
import { PiShoppingCart } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getWishlist } from "../../action/WishlistAction";
import Search from "../../Search/Search";
import { getCart } from "../../action/CartAction";
import Loading from "../../../components/Loading/Loading";


const MidHeader = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [cartCount, setcartCount] = useState(0)
  const [wishCount, setwishCount] = useState(0)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);

  const { cart, loading, totalAmount } = useSelector((state) => state.cart);
  const { items } = useSelector((state) => state.wishlist);
  const { isLogged } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getWishlist());
    dispatch(getCart());
  }, [dispatch]);

  useEffect(() => {
    setcartCount(cart.length);
  }, [cart]);

  useEffect(() => {
    setwishCount(items.length);
  }, [items]);

  // Update on resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 767);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {loading && <Loading />}
      <Row className={`g-0 ${classes.midhead}`}>

        
         {isMobile ? (<><div className={classes.mob}><Col ><img src={logo} alt="logo" /></Col>
        <Col className={classes.serach} xs={6}><Search /></Col></div></>) :(<><Col ><img src={logo} alt="logo" /></Col>
        <Col className={classes.serach} xs={6}><Search /></Col></>)}
        {/* 👉 Responsive layout switch */}
        {isMobile ? (
          <div className={classes.mobilenav}>
            <Col onClick={() => navigate(isLogged ? "/logout" : "/login")} className={classes.account}>
              <FaRegUser />
            </Col>
          </div>
        ) : (
          <Col onClick={() => navigate(isLogged ? "/logout" : "/login")} className={classes.account}>
            <FaRegUser />
            <div>
              Account<br /> {isLogged ? 'Welcome' : 'Log in'}
            </div>
          </Col>
        )}

        <Col xs={2} className={classes.shop}>
          <Badge className={classes.badge} badgeContent={wishCount} color="primary">
            <GoHeart onClick={() => navigate("/wishlist")} />
          </Badge>
          <Badge className={classes.badge} badgeContent={cartCount} color="primary">
            <PiShoppingCart onClick={() => navigate("/addtocart")} />
          </Badge>
          <div className={classes.cart_amount}>
            <p>My Cart</p>
            <p>${totalAmount}.00</p>
          </div>
        </Col>
      </Row>
    </>
  );
};


export default MidHeader