import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCategory } from "../../../action/Allcategory";
import { getProductsByCategoryOrSubcategory } from "../../../action/catproductsAction";
import classes from "./Collection.module.css";
import { useNavigate, Link } from "react-router-dom"; 
import Loading from "../../../../components/Loading/Loading";
import { Row, Col } from "react-bootstrap";
import LinkHome from "../../../../components/Link/Link";
import TopButton from "../../../../components/TopButton/TopButton";

const Collections = () => {
  const dispatch = useDispatch();
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const category = useSelector((state) => state.Allcat?.cat?.data);
  const { error, loading } = useSelector((state) => state.Allcat);

  useEffect(() => {
    dispatch(getAllCategory());
  }, [dispatch]);

  const navigate = useNavigate();

  const handleCategoryClick = (id) => {
    dispatch(getProductsByCategoryOrSubcategory(id));
    navigate(`/category/${id}`);
    window.scrollTo(0,0)
  };

  return (
    <>
      <LinkHome name="Collections" />
      {loading && <Loading />}
      {error && <p>Error: {error}</p>}

      <Row className={`g-0 ${classes.catGrid}`}>
        {Array.isArray(category) && category.length > 0 ? (
          category.map((cat, i) => (
            <Col 
              key={i} 
              onClick={() => handleCategoryClick(cat.item_id)}
              onMouseEnter={() => setHoveredCategory(cat.item_id)}
              onMouseLeave={() => setHoveredCategory(null)}
              className={classes.cat}
            >
              <img 
                src={cat.image} 
                height="150px" 
                width="150px" 
                alt={cat.item_name} 
              />
              <div className={classes.tom}>
                <h6>{cat.item_name}</h6>
                <p
                  className={
                    hoveredCategory === cat.item_id
                      ? classes.hide
                      : classes.show
                  }
                >
                  ({cat.product_count} Items)
                </p>
                <Link
                  to={`/category/${cat.item_id}`}
                  className={
                    hoveredCategory === cat.item_id
                      ? classes.show + " " + classes.shopNow
                      : classes.hide
                  }
                >
                  Shop Now
                </Link>
              </div>
            </Col>
          ))
        ) : (
          !loading && <p>No categories available</p>
        )}
      </Row>
      <TopButton/>
    </>
  );
};

export default Collections;
