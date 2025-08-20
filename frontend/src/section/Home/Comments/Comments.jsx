import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React from "react";
import Slider from "react-slick";
import image1 from "./user-1_1.jpg";
import image2 from "./user-2_1.jpg";
import image3 from "./user-3_1.jpg";
import image4 from "./user-4_1.jpg";
import {Row,Col} from "react-bootstrap"
import classes from "./Comments.module.css";
import Homehead from "../../../components/Homehead/Homehead"

const Comments = () => {
  const data = [
    {
      head: "Impressive quality, durable and reliable.",
      para: "Many variations of lorem Ipsum exist, but some have been altered by injected humor Lorem Ipsum is simply dummy text of the printing and typesetting.",
      name: "Reema Ghurde",
      pro: "Manager",
      img: image3,
    },
    {
      head: "Excellent product, worth every penny.",
      para: "lorem Ipsum Many lorem Ipsum exist, but some have been altered by injected humor Lorem Ipsum is simply dummy text of the printing and typesetting. .",
      name: "Stafanie Rashford",
      pro: "Founder",
      img: image1,
    },
    {
      head: "Reliable product, consistently delivers.",
      para: "Many variations of lorem Ipsum exist, but some have been altered by injected humor Lorem Ipsum is simply dummy text of the printing and typesetting.",
      name: "Luies Charles",
      pro: "CEO",
      img: image4,
    },
    {
      head: "Excellent product, A+ customer service.",
      para: "Many variations of lorem Ipsum exist, but some have been altered by injected humor Lorem Ipsum is simply dummy text of the printing and typesetting.",
      name: "Augusta Wind",
      pro: "Web Designer",
      img: image2,
    },
  ];

  // Slick settings
  const settings = {
    dots: false, // No navigation dots
    infinite: true, // Looping enabled
    speed: 1000, // Transition speed
    slidesToShow: 3, // Show 3 items at a time
    slidesToScroll: 1, // Move 1 slide at a time
    autoplay: true, // Enable auto-play
    autoplaySpeed: 3000, // Change slide every 3 seconds
    arrows: true, // Show next/prev buttons
    responsive: [
        {
          breakpoint: 1270, // Below 1270px
          settings: { slidesToShow: 3, slidesToScroll: 1 },
        },
        {
          breakpoint: 990, // Below 990px
          settings: { slidesToShow: 2, slidesToScroll: 1 },
        },
        {
          breakpoint: 767, // Below 767px
          settings: { slidesToShow: 1 , slidesToScroll: 1 },
        },
      ],
  };

  return (
<>
<div className={classes.customHomeheadWrapper}>

<Homehead title="What Our Clients Say" />
</div>

<div className={classes.mainmult}>
  <Slider {...settings}>
    {data.map((item, index) => (
      <div key={index}>
        <div className={classes.multi}>
          <h3>{`"${item.head}"`}</h3>
          <p>{`${item.para}`}</p>
          <div className={classes.pro}>
            <img
              src={item.img}
              alt={item.name}
              className="d-block rounded-circle"
              style={{ width: "70px", height: "70px", objectFit: "cover" }}
            />
            <span>
              <h3 className="fw-bold">{item.name}</h3>
              <p className="text-muted">{item.pro}</p>
            </span>
          </div>
        </div>
      </div>
    ))}
  </Slider>
</div>

  </>
  );
};

export default Comments;
