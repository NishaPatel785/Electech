import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getWishlist, removeFromWishlist } from "../action/WishlistAction";
import styles from "./Wishlist.module.css"; // Import the CSS module
import Loading from "../../components/Loading/Loading";
import { Link } from "react-router-dom";
import { ClassNames } from "@emotion/react";
import Button1 from "../../components/Button1/Button1";

const Wishlist = () => {
    const dispatch = useDispatch();
    const { items: wishlistItems = [], loading, error } = useSelector((state) => state.wishlist) || { items: [] };

    useEffect(() => {
        dispatch(getWishlist());
    }, [dispatch]);

    const handleRemove = (wishlistId) => {
        dispatch(removeFromWishlist(wishlistId));
    };

    if (loading) return <div className={styles.loading}><Loading/></div>;
    if (error) return <p className={styles.error}>Error: {error}</p>;
    if (!wishlistItems.length) return <p className={styles.empty}>Your wishlist is empty.</p>;

    return (
        <div className={styles.container}>
            
            <h2 className={styles.heading}>Your Wishlist</h2>
            <div className={styles.grid}>
                {wishlistItems.map((item) => (
                    <>
                    <div key={item.id} className={styles.maincard}>
                    <Link to={`/products/${item.product_id}`}>
                    <div key={item.wishlist_id} className={styles.card}>
                        <img src={`http://localhost:6001/node-files/products/${item.image}`} alt={item.product_name} className={styles.image} />
                    </div></Link>
                        <div className={styles.details}>
                            <p className={styles.brand}>{item.brand_name}</p>
                            <h3 className={styles.name}>{item.product_name}</h3>
                            <div className={styles.price2}>
                            {item.cut_price && (
                                <p className={styles.cut_price}>${item.cut_price}</p>
                                                        )}
                            <p className={styles.price}>${item.price}</p>

                            </div>
                            <Button1 name="Remove" onclick={()=>handleRemove(item.wishlist_id)} />
                            {/* <button className={styles.removeButton} onClick={() => handleRemove(item.wishlist_id)}>Remove</button> */}
                        </div>
                    </div>
                                                
                        </>
                ))}
            </div>
        </div>
    );
};

export default Wishlist;
