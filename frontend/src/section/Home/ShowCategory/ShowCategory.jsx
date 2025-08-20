import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCategory } from "../../action/Allcategory";
import { getProductsByCategoryOrSubcategory } from "../../action/catproductsAction";
import classes from "./ShowCategory.module.css";
import Slider from "react-slick";
import { useNavigate, Link } from "react-router-dom";
import Loading from "../../../components/Loading/Loading";
import Homehead from "../../../components/Homehead/Homehead";

const ShowCategory = () => {
  const dispatch = useDispatch();
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const { cat, loading, error } = useSelector((state) => state.Allcat);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllCategory());
  }, [dispatch]);

  const handleCategoryClick = (id) => {
    dispatch(getProductsByCategoryOrSubcategory(id));
    navigate(`/category/${id}`);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 7,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 3000,
    arrows: false,
    responsive: [
      { breakpoint: 1270, settings: { slidesToShow: 5, slidesToScroll: 1 } },
      { breakpoint: 990, settings: { slidesToShow: 4, slidesToScroll: 1 } },
      { breakpoint: 767, settings: { slidesToShow: 2, slidesToScroll: 1 } },
    ],
  };

  return (
    <>
      {loading && <Loading />}
      {error && <p>Error: {error}</p>}
      <div className={classes.customHomeheadWrapper}>
      <Homehead title="Shop By Category" link="view all products" onclick={()=> navigate("/collections")} />

      </div>
      <div className={`catto ${classes.cat}`}>
        {Array.isArray(cat?.data) && cat.data.length > 0 ? (
          <Slider {...settings}>
            {cat.data.map((catItem, i) => (
              <div
                key={i}
                onClick={() => handleCategoryClick(catItem.item_id)}
                style={{ cursor: "pointer" ,display: "flex",
    justifyContent: "center",
    alignItems: "center",flexDirection:"column"}}
                onMouseEnter={() => setHoveredCategory(catItem.item_id)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <img
                  src={catItem.image}
                  height="150px"
                  width="150px"
                  alt={catItem.item_name}
                />
                <div className={classes.tom}>
                  <h6>{catItem.item_name}</h6>
                  <p
                    className={
                      hoveredCategory === catItem.item_id
                        ? classes.hide
                        : classes.show
                    }
                  >
                    ({catItem.product_count} Items)
                  </p>
                  <Link
                    to={`/category/${catItem.item_id}`}
                    className={
                      hoveredCategory === catItem.item_id
                        ? classes.show
                        : classes.hide
                    }
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            ))}
          </Slider>
        ) : (
          !loading && <p>No categories available</p>
        )}
      </div>
    </>
  );
};

export default ShowCategory;
