import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getCart, updateCart, removeFromCart } from "../action/CartAction";
import Loading from "../../components/Loading/Loading";
import classes from "./AddToCart.module.css";
import { RiDeleteBin5Line } from "react-icons/ri";
import { cartCheckout, getCheckout } from "../action/checkoutAction";
import { useNavigate } from "react-router-dom";

const AddToCart = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { cart = [], loading, error,totalAmount } = useSelector((state) => state.cart);

    const [quantities, setQuantities] = useState({});

    // Fetch cart on mount
    useEffect(() => {
        dispatch(getCart());
    }, [dispatch]);

    // Initialize quantities when cart updates
    useEffect(() => {
        if (Array.isArray(cart) && cart.length > 0) {
            const initialQuantities = {};
            cart.forEach((item) => {
                if (item?.id) {
                    initialQuantities[item.id] = item.quantity || 1;
                }
            });
            setQuantities(initialQuantities);
        }
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

    const deleteCartItem = (productId, variantId) => {
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
        <div className={classes.container}>
            <h2 className={classes.heading}>Your Shopping Cart</h2>
            {Array.isArray(cart) && cart.length === 0 ? (
                <p className={classes.emptyCart}>Your cart is empty.</p>
            ) : (
                <>
                    <table className={classes.table}>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Details</th>
                                <th>Quantity</th>
                                <th>Total</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(cart) &&
                                cart.map((item) => {
                                    const quantity = quantities[item.id] || 1;
                                    const price = item?.variant_price || item?.product_price || 0;
                                    const total = quantity * price;

                                    return (
                                        <tr key={item.id}>
                                            <td>
                                                <img
                                                    src={`http://localhost:6001/node-files/products/${item?.variant_image || item.thumbnail}`}
                                                    alt={item.product_name}
                                                    className={classes.image}
                                                />
                                            </td>
                                            <td className={classes.productDetail}>
                                                <p>{item.brand_name}</p>
                                                <span className={classes.productName}>{item.product_name}</span>
                                                <p>${price}.00</p>
                                                <p>{item?.color_name && `Color: ${item.color_name}`}</p>
                                                <p>{item?.ram ? `RAM: ${item.ram}` : item?.size ? `Size: ${item.size}` : ""}</p>
                                            </td>
                                            <td>
                                                <div className={classes.quantityContainer}>
                                                    <button
                                                        className={classes.quantityBtn}
                                                        onClick={() => decreaseQuantity(item.id)}
                                                    >
                                                        -
                                                    </button>
                                                    <span className={classes.quantity}>{quantity}</span>
                                                    <button
                                                        className={classes.quantityBtn}
                                                        onClick={() => increaseQuantity(item.id)}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </td>
                                            <td className={classes.totalPrice}>${total}.00</td>
                                            <td>
                                                <button
                                                    className={classes.deleteBtn}
                                                    onClick={() => deleteCartItem(item.product_id, item.variant_id)}
                                                >
                                                    <RiDeleteBin5Line />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>

                    {/* Subtotal and Checkout Section */}
                    <div className={classes.totalContainer}>
                        <div className={classes.order}>
                            <p>Order special instructions</p>
                            <textarea cols={4} rows={4} />
                        </div>
                        <div className={classes.order2}>
                            <h3>Subtotal: ${totalAmount}.00</h3>
                            <p>Taxes and shipping calculated at checkout</p>
                            <div className={classes.checkoutContainer}>
                                <button className={classes.checkoutBtn} onClick={proceedToCheckout}>
                                    CHECK OUT
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AddToCart;
