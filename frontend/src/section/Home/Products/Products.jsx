import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import classes from "./Products.module.css";
import { FaChevronUp } from "react-icons/fa6";
import { FaChevronDown } from "react-icons/fa6";
import React, { useState, useEffect } from "react";
import { FreeMode, Navigation } from "swiper/modules";
import { useSelector, useDispatch } from "react-redux";
import { getProducts } from "../../action/productActions";
import { addToCart } from "../../action/CartAction";
import { useNavigate, useParams } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import Loading from "../../../components/Loading/Loading";
import Accordionproduct from "./Accorion";
import { directCheckout } from "../../action/checkoutAction";
import Button1 from "../../../components/Button1/Button1";
import RatingAndReview from "../../Review/Review";
import RandomNumber from "../../../components/RandomNumber/RandomNumber";
import { FaEye } from "react-icons/fa";
import RandomDay from "../../../components/RandomDay/RandomDay";
import LinkHome from "../../../components/Link/Link"
import TopButton from "../../../components/TopButton/TopButton";


const Products = ({ toggled, setToggled }) => {

  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { products = {}, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getProducts(id));
  }, [dispatch, id]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // const [firstImage, setFirstImage] = useState(products.images[0]);


  const images = products.images ? JSON.parse(products.images) : [];


  const scrollUp = () => {
    if (swiperInstance) {
      if (swiperInstance.activeIndex === 0) {
        swiperInstance.slideTo(images.length - 1);
      } else {
        swiperInstance.slidePrev();
      }
    }
  };
  // console.log(products)
  const scrollDown = () => {
    if (swiperInstance) {
      if (swiperInstance.activeIndex === images.length - 1) {
        swiperInstance.slideTo(0);
      } else {
        swiperInstance.slideNext();
      }
    }
  };
  const [selectedVariant, setSelectedVariant] = useState({});

  // Quantity handlers
  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

  const handleColorSelect = (variant) => {
    setSelectedVariant(variant);
    console.log(variant);



  };
  // ✅ Handle Add to Cart Click
  const handleAddToCart = () => {
    const hasVariants = products.variants && products.variants.length > 0;

    if (hasVariants && Object.keys(selectedVariant).length === 0) {
      alert("Please choose a color before adding to cart.");
      return;
    }

    dispatch(addToCart({
      productId: id,
      quantity,
      variant_id: hasVariants ? selectedVariant.id : null
    }));

    setToggled(!toggled);

  };

  const buyNow = () => {
    const hasVariants = products.variants && products.variants.length > 0;

    if (hasVariants && Object.keys(selectedVariant).length === 0) {
      alert("Please choose a color before proceeding to buy.");
      return;
    }

    dispatch(directCheckout({
      product_id: id,
      quantity,
      variant_id: hasVariants ? selectedVariant.id : null
    }));

    navigate("/checkout", { state: { fromCart: false } });
  };

   const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize(); // set on first render
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);



  return (
    <>
      <LinkHome name={products.name} />
      <Row className="g-3 mx-3 my-2 productswiper flex-wrap">
        {loading && <Loading />}
        {error && <p>Error: {error}</p>}
        {!loading && !error && products.name && (
          <>
            <Col xs={12} md={2} className={`d-flex flex-column align-items-center ${classes.scroll}`}>
              <button className="btn btn-light mb-2" onClick={scrollUp} style={{ width: "100%", height: "40px" }}>
                <FaChevronUp />
              </button>
              
                {!isMobile && (
              <Swiper
               onSwiper={(swiper) => setSwiperInstance(swiper)} 
                 direction={isMobile ? "horizontal" : "vertical"}
      slidesPerView={isMobile ? 3 : 4}
      spaceBetween={isMobile ? 5 : 10}
      freeMode={true}
      loop={true}
      modules={[FreeMode, Navigation]}
      style={{
        height: isMobile ? "auto" : "400px",
        width: isMobile ? "100%" : "100px",
        marginLeft: isMobile ? "0px" : "10px",
      }}
      className="mySwiper"
              >
                {images.map((img, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={`http://localhost:6001/node-files/products/${img}`}
                      alt={`Thumbnail ${img}`}
                      onClick={() => setActiveIndex(index)}
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "contain",
                        cursor: "pointer",
                        border: activeIndex === index ? "2px solid black" : "none",
                      }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

                )}

              <button className="btn btn-light mt-2" onClick={scrollDown} style={{ width: "100%", height: "40px" }}>
                <FaChevronDown />
              </button>
            </Col>

            {/* Center Column - Main Product Image */}
            <Col xs={12} md={4} className="text-center pe-md-5">
              <div style={{ maxWidth: "500px", maxHeight: isMobile ? "250px" : "400px", margin: "auto" }}>


                <img
                  src={`http://localhost:6001/node-files/products/${selectedVariant?.image ? selectedVariant.image : images[activeIndex]
                    }`}
                  alt={`Product`}
                  style={{ maxWidth: "100%",maxHeight: isMobile ? "250px" : "400px", objectFit: "contain" }}
                />

              </div>
            </Col>

            {isMobile && (
  <Col xs={12} className="mt-3">
    <Swiper
      direction="horizontal"
      slidesPerView={3}
      spaceBetween={10}
      freeMode={true}
      loop={true}
      modules={[FreeMode, Navigation]}
      className="mySwiper"
      style={{ height: isMobile ? "auto" : "400px",
        width: isMobile ? "100%" : "100px",
        marginLeft: isMobile ? "0px" : "10px" }}
    >
      {images.map((img, index) => (
        <SwiperSlide key={index}>
          <img
            src={`http://localhost:6001/node-files/products/${img}`}
            alt={`Thumbnail ${img}`}
            onClick={() => setActiveIndex(index)}
            style={{
              width: "80px",
              height: "80px",
              objectFit: "contain",
              cursor: "pointer",
              border: activeIndex === index ? "2px solid black" : "none",
            }}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  </Col>
)}

            {/* Right Column - Product Details */}
            <Col xs={12} md={6} className={classes.products_D}>
              <h3>{products.name}</h3>
              <div className={`d-flex gap-3 ${classes.rap} `}>
              {products.cut_price && (
                <p className={classes.cut_price}>${products.cut_price}</p>
              )}
              <p className={classes.product_price}> ${selectedVariant?.price ? selectedVariant.price : products.price}</p>
                </div>

              <p className={classes.detail}>{products.shortDesc}...</p>
              <RandomDay />


              <p className={classes.ran}>
                <FaEye />
                <RandomNumber /> people are viewing this right now
              </p>
              <p><span className={classes.bold}>Availability:</span> <span>{selectedVariant?.stock ? selectedVariant.stock : products.stock}
              </span> <span>

                  {selectedVariant?.availableStock ? selectedVariant.availableStock : products.availableStock}
                </span>
              </p>

              {products.variants.length > 0 && <div className={classes.colorOptions}>
                <h6>Color :-</h6>
                {products.variants.map((variant) => (
                  <button
                    key={variant.id}
                    style={{
                      height: "50px",
                      width: "50px",
                      borderRadius: "50%",
                      backgroundColor: variant.code,
                      border: selectedVariant?.id === variant.id ? "2px solid black" : "1px solid gray"
                    }}
                    onClick={() => handleColorSelect(variant)}
                  >
                  </button>
                ))}
              </div>
              }
              {products.variants.length > 0 && <div>
                <h6>RAM</h6>
                {products.variants.map((d, i) => (
                  <>
                    <button key={i} className={classes.ram} disabled={selectedVariant?.ram == d.ram ? false : true} style={{ border: selectedVariant?.ram == d.ram && "2px solid blue" }} >{d.ram}</button>
                  </>
                ))}

              </div>}
              {/* {products.variants.length > 0 && <div>
                <h6>Size</h6>
                {products.variants.map((d, i) => (
                  <>
                    <button key={i} className={classes.size} disabled={selectedVariant?.size == d.size ? false : true} style={{ border: selectedVariant?.size == d.size && "2px solid blue" }} >{d.size}</button>
                  </>
                ))}

              </div>} */}

              <h6 className={classes.h6}>Quantity</h6>
              <div className="d-flex gap-3 mb-3 pt-0">
                <div className={classes.quantityContainer}>
                  <button className={classes.quantityBtn} onClick={decreaseQuantity}>-</button>
                  <span className="mx-3">{quantity}</span>
                  <button className={classes.quantityBtn} onClick={increaseQuantity}>+</button>
                </div>
                <Button1 name="Add to Cart" onclick={() => { setToggled(!toggled), handleAddToCart() }} />
              </div>
              <div>
                <button className={classes.btn} onClick={() => {
                  buyNow()
                }}>buy now</button>

              </div>

              <p><span className={classes.bold}>SKU:</span> {selectedVariant?.sku ? selectedVariant.sku : products.sku}</p>
              <p><span className={classes.bold}>Vendor:</span> {products.brand_name}</p>
              <p><span className={classes.bold}>Category:</span> {products.category_name || products.subcategory_name || "N/A"}</p>
              {/* <p>tags:{products.tags}</p> */}

              <Accordionproduct />


              {/* ✅ Updated Add to Cart Button */}

            </Col>
          </>
        )}
      </Row>

      <Row className={`${classes.description} g-0`}>
        <ul className={classes.tabs}><li>description</li></ul>
        <div className={classes.tab_container}>
          <h1>About this item</h1>
          <p>{products.longDesc1}</p>
          <img src={`http://localhost:6001/node-files/products/${products.descImage}`} alt="desc" width="100%" />
          <br /><p>{products.longDesc2}</p>
          <p>{products.longDesc3}</p>

        </div>


      </Row>
      <RatingAndReview product_id={id} />
      <TopButton/>
    </>
  );
};

export default Products;
