import { Sidebar } from "react-pro-sidebar";
import { useState, useEffect } from "react";
import { getCart, updateCart, removeFromCart } from "../action/CartAction";
import Loading from "../../components/Loading/Loading";
import { useDispatch, useSelector } from "react-redux";
import { cartCheckout, getCheckout } from "../action/checkoutAction";
import classes from "./CartSidebar.module.css";
import { Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ImBin } from "react-icons/im";
import Button1 from "../../components/Button1/Button1"

const CartSidebar = ({ toggled, setToggled }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { cart, loading, error } = useSelector((state) => state.cart);
    const [quantities, setQuantities] = useState({});
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        dispatch(getCart());
    }, [dispatch]);

    useEffect(() => {
        const initialQuantities = {};
        if (Array.isArray(cart)) {
            cart.forEach((item) => {
                initialQuantities[item.id] = item.quantity || 1;
            });
        }
        setQuantities(initialQuantities);
    }, [cart]);

    const increaseQuantity = (id) => {
        const newQuantity = (quantities[id] || 1) + 1;
        setQuantities({ ...quantities, [id]: newQuantity });
        dispatch(updateCart({ id, quantity: newQuantity }));
    };

    const decreaseQuantity = (id) => {
        const newQuantity = Math.max((quantities[id] || 1) - 1, 1);
        setQuantities({ ...quantities, [id]: newQuantity });
        dispatch(updateCart({ id, quantity: newQuantity }));
    };

    useEffect(() => {
        let total = 0;
        if (Array.isArray(cart)) {
            cart.forEach((item) => {
                total += (quantities[item.id] || 1) * (item.variant_price || item.product_price);
            });
        }
        setTotalAmount(total);
    }, [quantities, cart]);

    const deleteCart = (productId, variantId) => {
        dispatch(removeFromCart({ productId, variant_id: variantId }));
    };

   const proceedToCheckout = () => {
           dispatch(cartCheckout())
           navigate("/checkout", { state: { fromCart: true } });
           window.scrollTo(0,0)
       };

    if (loading) return <Loading />;
    // if (error) return <p className={classes.error}>Error fetching cart: {error}</p>;

    return (
        <div className={`cart_sidebar ${classes.sidebar}`} style={{ display: "flex", height: "100%", direction: "rtl", width: "500px" }}>
            <Sidebar onBackdropClick={() => setToggled(false)} toggled={toggled} breakPoint="all" rtl>
                <div className={classes.container}>
                    <h2 className={classes.heading}>Your Shopping Cart</h2>
                    {Array.isArray(cart) && cart.length > 0 ? (
                        <table className={classes.table}>
                            <thead>
                                <tr>
                                    <th>Total</th>
                                    <th>Product Name</th>
                                    <th>Product</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.map((item) => (
                                    <tr key={item.id}>
                                        <td className={classes.totalPrice}>
                                            ${`${quantities[item.id] * (item.variant_price || item.product_price)}.00`}
                                        </td>
                                        <td className={classes.productName}>
                                            <p className={classes.p1}>{item.brand_name}</p>
                                            <span>{item.product_name}</span>
                                            <p className={classes.p1}>${item.variant_price || item.product_price}.00</p>
                                                <p className={classes.p1}>{item?.color_name && `Color: ${item.color_name}`}</p>
                                                <p className={classes.p1}>{item?.ram ? `RAM: ${item.ram}` : item?.size ? `Size: ${item.size}` : ""}</p>
                                            <div className="d-flex gap-3">

                                                <div>
                                                <button className={classes.deleteBtn} onClick={() => deleteCart(item.product_id, item.variant_id)}>
                                                    <ImBin/>
                                                </button>
                                                </div>
                                            <div className={classes.quantityContainer}>
                                                <button className={classes.quantityBtn} onClick={() => increaseQuantity(item.id)}>+</button>
                                                <span className={classes.quantity}>{quantities[item.id]}</span>
                                                <button className={classes.quantityBtn} onClick={() => decreaseQuantity(item.id)}>-</button>
                                            </div>
                                            </div>

                                        </td>
                                        <td>
                                            <img
                                                src={`http://localhost:6001/node-files/products/${item.variant_image || item.thumbnail}`}
                                                alt={item.product_name}
                                                className={classes.image}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className={classes.emptyCart}>Your cart is empty.</p>
                    )}
                </div>

                <Row xs={12}>
                    <div className={classes.order2} >
                        <h3><span>:Subtotal</span><span> ${totalAmount}.00</span></h3>
                        <p>Taxes and shipping calculated at checkout</p>
                        <div className={classes.checkoutContainer}>
                            <Button1 name="CHECK OUT" onclick={()=>{proceedToCheckout()}} />
                            <Button1 name="VIEW CART" onclick={()=> {navigate("/addtocart"),window.scrollTo(0,0)}} />
                            
                        </div>
                    </div>
                </Row>
            </Sidebar>
        </div>
    );
};

export default CartSidebar;
