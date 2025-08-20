import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useDispatch, useSelector } from "react-redux";
import { AllProducts } from "../../action/productActions";
import { Link, useNavigate } from "react-router-dom";
import Homehead from "../../../components/Homehead/Homehead";
import Rating from '../../../components/Rating/Rating';
import classes from "./FeaturedProduct.module.css";
import { CiHeart } from 'react-icons/ci';
import { IoExpand } from 'react-icons/io5';
import Loading from '../../../components/Loading/Loading';
import { addToWishlist } from '../../action/WishlistAction';
import { GrFormNextLink } from "react-icons/gr";
import ProductModal from '../../Shop/ShopProducts/ProductModal';
import { IoMdHeart } from 'react-icons/io';

const FeaturedProduct = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const productState = useSelector((state) => state.products);
  const products = Array.isArray(productState?.products) ? productState.products : [];
  const loading = productState?.loading;

  useEffect(() => {
    dispatch(AllProducts());
  }, [dispatch]);

  const featuredProducts = products.filter(
    (product) => product.category_name === "TV & Speaker"
  );

  const handleProductClick = (productId) => {
    window.scrollTo(0, 0);
    navigate(`/products/${productId}`);
  };

  const handleAddToWish = (productId) => {
    console.log("Wishlisted product:", productId);
    dispatch(addToWishlist(productId));
  };

  const handleExpandClick = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  return (
    <>

    <div className={classes.customHomeheadWrapper}>

      <Homehead
        title="Featured Product"
        link="view all products"
        onclick={() => navigate("/category/6")}
      />
    </div>

      <div className={`latest ${classes.latest_pro}`}>
        {loading ? (
          <Loading />
        ) : featuredProducts.length === 0 ? (
          <p>No Featured Products Found.</p>
        ) : (
          <Swiper
            style={{ flex: 1, minWidth: 0 }}
            spaceBetween={20}
            slidesPerView={4}
            navigation={true}
            modules={[Navigation]}
            className="mySwiper"
            breakpoints={{
              320: { slidesPerView: 2 },
              480: { slidesPerView: 2 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {featuredProducts.map((product) => (
              <SwiperSlide key={product.id}>
                <div
                  className={classes.productCard}
                  onClick={() => handleProductClick(product.id)}
                >
                  <div className={classes.card_media}>
                    <img
                      loading="lazy"
                      src={`http://localhost:6001/node-files/products/${product.thumbnail}`}
                      alt={product.name}
                    />
                    <div className={classes.hoverimage}>
                      <img
                        loading="lazy"
                        src={`http://localhost:6001/node-files/products/${product.hoverimage}`}
                        alt={product.name}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToWish(product.id);
                        }}
                        className={classes.wishlistBtn}
                      >
                        <CiHeart />
                        <IoMdHeart />
                      </button>
                      <button
                        type="button"
                        className={classes.newBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExpandClick(product);
                        }}
                      >
                        <IoExpand />
                      </button>
                    </div>
                  </div>

                  <div className={classes.card_information}>
                    <h4>{product.brand_name}</h4>
                    <h3>{product.name}</h3>
                    <Rating rating={product.rating} />
                    <div className="d-flex">
                      {product.cut_price && (
                        <p className={classes.cut}>${product.cut_price}</p>
                      )}
                      <p>
                        ${product.variants?.[0]?.price || product.price}
                      </p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        <div className={classes.product_banner}>
          <p>Game<br />Console<br />Studio</p>
          <p>From <strong>$49.00</strong></p>
          <Link>
            <span><button><GrFormNextLink /></button>Shop Now</span>
          </Link>
        </div>
      </div>

      <ProductModal
        show={showModal}
        onHide={() => setShowModal(false)}
        product={selectedProduct}
      />
    </>
  );
};

export default FeaturedProduct;
