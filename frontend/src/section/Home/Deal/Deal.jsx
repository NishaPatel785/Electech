import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { useEffect } from "react";
import Slider from "react-slick";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AllProducts } from "../../action/productActions";
import Homehead from "../../../components/Homehead/Homehead";
import Rating from "../../../components/Rating/Rating";
import RandomDay from "../../../components/RandomDay/RandomDay";
import Button1 from "../../../components/Button1/Button1";
import classes from "./Deal.module.css";

const Deal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const productState = useSelector((state) => state.products);
  const products = Array.isArray(productState?.products) ? productState.products : [];

  useEffect(() => {
    dispatch(AllProducts());
  }, [dispatch]);

  const settings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <>
    <div className={classes.color}>
     <div className={classes.customHomeheadWrapper}>
      <Homehead title="Deals of the Day" link="VIEW ALL PRODUCTS" />
      </div>
      <div  className={` deal ${classes.mainmult}`} xs={12}>
        <Slider {...settings}>
          {products.map((item, index) => (
            <div key={index}>
              <div className={classes.multi}>
                <div className={classes.left}>
                  <img
                    src={`http://localhost:6001/node-files/products/${item.thumbnail}`}
                    alt={item.name}
                  />
                </div>
                <div className={classes.right}>
                  <h1>{item.name}</h1>
                  <Rating rating={item.rating} />
                  <div className={classes.priceRow}>
                    {item.cut_price && <p className={classes.cut}>${item.cut_price}</p>}
                    {item.price && <p className={classes.product_price}>${item.price}</p>}
                  </div>
                  <RandomDay />
                  <Button1 name="Details" onclick={() => {navigate(`/products/${item.id}`),window.scrollTo(0,0)}} />
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
    </>
  );
};

export default Deal;
