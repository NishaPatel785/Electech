import { Link } from "react-router-dom";
import { useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import image1 from "./main-banner-1.jpg";
import image2 from "./main-banner-2.jpg";
import classes from "./HomeSection1.module.css";
import { GrLinkNext } from "react-icons/gr";
import { GrLinkPrevious } from "react-icons/gr";

function HomeSection1() {
  const [index, setIndex] = useState(0);
  const [reversed, setReversed] = useState(false); // Track if reversed

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  const data = [
    {
      img: image1,
      para: "Flat 30% Discount",
      head1: "VR Virtual Reality",
      head2: "Headset Smartphone",
      rate: "$199.89",
    },
    {
      img: image2,
      para: "Flat 20% Discount",
      head1: "JBL Tune 510 Ear",
      head2: "Wireless Headphones",
      rate: "$149.99",
    },
  ];

  // Reverse slides if needed
  const finalData = reversed ? [...data].reverse() : data;

  // Handle button click
  const handleButtonClick = () => {
    if (!reversed) {
      setReversed(true); // Reverse on first click
      setIndex(0); // Reset to first slide
    } else {
      setIndex((prevIndex) => (prevIndex === finalData.length - 1 ? 0 : prevIndex + 1)); // Next slide normally
    }
  };

  return (
    <div className={classes.carouselContainer}>
      <Carousel activeIndex={index} onSelect={handleSelect} className={classes.car}>
        {finalData.map((data, i) => (
          <Carousel.Item key={i} className={classes.banner_heading}>
            <img className="d-block w-100" src={data.img} alt={`Slide ${i + 1}`} />
            <Carousel.Caption>
              <div className={classes.tom}>
                <p>{data.para}</p>
                <h1>
                  {data.head1}
                  <br />
                  {data.head2}
                </h1>
                <h3>
                  From <span>{data.rate}</span>
                </h3>
                <Link to="/shop">
                  <button className={classes.banner_btn}>Shop Now</button>
                </Link>
              </div>
      <button className={classes.actionBtn1} onClick={handleButtonClick}>
        <GrLinkNext/>
      </button>
      <button className={classes.actionBtn2} onClick={handleButtonClick}>
       <GrLinkPrevious/>
      </button>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>

      {/* One Button for Both Actions */}
    </div>
  );
}

export default HomeSection1;
