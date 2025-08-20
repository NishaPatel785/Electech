import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React from "react";
import Slider from "react-slick";
import classes from "./Logo.module.css"; // Ensure this file exists
import brand1 from "./brand-1_112X103@2x.png";
import brand2 from "./brand-2_112X103@2x.png";
import brand3 from "./brand-3_112X103@2x.png";
import brand4 from "./brand-4_112X103@2x.png";
import brand5 from "./brand-5_112X103@2x.png";
import brand6 from "./brand-6_112X103@2x.png";
import brand7 from "./brand-7_112X103@2x.png";

const Logo = () => {
  const images = [brand1, brand2, brand3, brand4, brand5, brand6, brand7];

  const settings = {
    dots: false, // No dots
    infinite: true, // Infinite loop
    speed: 1000, // Transition speed
    slidesToShow: 6, // Show 6 images at a time
    slidesToScroll: 1, // Move 1 slide at a time
    autoplay: true, // Enable auto-play
    autoplaySpeed: 2000, // Change slide every 2 seconds
    arrows: false, // Hide next/prev buttons
    responsive: [
      {
        breakpoint: 1270, // Below 1270px
        settings: { slidesToShow: 5, slidesToScroll: 1 },
      },
      {
        breakpoint: 990, // Below 990px
        settings: { slidesToShow: 3, slidesToScroll: 1 },
      },
      {
        breakpoint: 767, // Below 767px
        settings: { slidesToShow: 1, slidesToScroll: 1 },
      },
    ],
  };

  return (
    <div className={classes.sliderContainer}>
      <Slider {...settings}>
        {images.map((img, index) => (
          <div key={index} className={classes.slide}>
            <img src={img} alt={`Brand ${index + 1}`} className={classes.image} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Logo;
