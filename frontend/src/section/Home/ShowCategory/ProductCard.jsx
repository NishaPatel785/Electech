import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getProductsByCategoryOrSubcategory } from "../../action/catproductsAction";
import { addToWishlist } from "../../action/WishlistAction";
import { Col, Row } from "react-bootstrap";
import { CiHeart } from "react-icons/ci";
import { IoExpand } from "react-icons/io5";

import classes from "./ProductCard.module.css";
import SidebarFilter from "../../Sidebar/Sidebar";
import Rating from "../../../components/Rating/Rating";
import Loading from "../../../components/Loading/Loading";
import ProductModal from "../../Shop/ShopProducts/ProductModal";
import { IoMdHeart } from "react-icons/io";
import TopButton from "../../../components/TopButton/TopButton";

const ProductCard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { id } = useParams();

  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    colors: [],
    ram: [],
    size: [],
    brands: [],
  });

  const { products = [], loading, error } = useSelector((state) => state.Allproducts);

  useEffect(() => {
    dispatch(getProductsByCategoryOrSubcategory(id));
  }, [dispatch, id]);

  useEffect(() => {
    console.log("Active filters:", filters);
  }, [filters]);


  // Filters
  const filteredProducts = useMemo(() => {
    if (!products || products.length === 0) return [];

    const min = filters.minPrice === "" ? 0 : Number(filters.minPrice);
    const max = filters.maxPrice === "" ? Infinity : Number(filters.maxPrice);

    return products.filter((product) => {
      const brandMatch =
        filters.brands.length === 0 || filters.brands.includes(product.brand_name);

      const productPrice = Number(product.price || 0);
      const productPriceMatch = productPrice >= min && productPrice <= max;

      if (!product.variants || product.variants.length === 0) {
        return brandMatch && productPriceMatch;
      }

      const variantMatch = product.variants.some((variant) => {
        const variantPrice = Number(variant.price || product.price || 0);
        const priceMatch = variantPrice >= min && variantPrice <= max;

        const colorMatch =
          filters.colors.length === 0 ||
          filters.colors.map((c) => c.toLowerCase()).includes(variant.code?.toLowerCase());

        const ramMatch =
          filters.ram.length === 0 ||
          filters.ram.includes(String(variant.ram));

        const sizeMatch =
          filters.size.length === 0 ||
          filters.size.includes(variant.size);

        return priceMatch && colorMatch && ramMatch && sizeMatch;
      });

      return brandMatch && variantMatch;
    });
  }, [products, filters]);



  const handleProductClick = (productId) => {
    window.scrollTo(0,0),
    navigate(`/products/${productId}`);
  };

  const handleAddToWish = (productId) => {
    dispatch(addToWishlist(productId));
    navigate("/wishlist");
  };

  const handleExpandClick = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };
const [showFilter, setShowFilter] = useState(false);

  return (
    <>
      <div className={classes.container}>
       <div className={`${classes.sidebar} ${!showFilter ? classes.desktopOnly : ""}`}>
  <SidebarFilter onFilterChange={setFilters} products={products} />
</div>

{/* Sidebar as overlay/modal for mobile */}
{showFilter && (
  <>
    <div className={classes.overlay} onClick={() => setShowFilter(false)}></div>

    <div className={classes.mobileSidebar}>
      <button
        onClick={() => setShowFilter(false)}
        className={classes.closeFilterBtn}
      >
        ✕
      </button>
      <SidebarFilter onFilterChange={setFilters} products={products} />
    </div>
  </>
)}
        <div className={classes.productContainer}>
          <button
  className={classes.filterToggleBtn}
  onClick={() => setShowFilter(true)}
>
  ☰ Filters
</button> 
          {loading ? (
            <Loading />
          ) : error ? (
            <p>Error: {error}</p>
          ) : filteredProducts.length > 0 ? (
            <Row className={`g-0 ${classes.productGrid}`} xs={1} sm={2} md={3} lg={4}>
              {filteredProducts.map((product) => (
                <Col
                  key={product.id}
                  className={classes.productCard}
                  onClick={() => handleProductClick(product.id)}
                >
                  <div className={classes.card_media}>
                    <img
                      src={`http://localhost:6001/node-files/products/${product.thumbnail}`}
                      alt={product.name}
                    />
                    <div className={classes.hoverimage}>
                      <img
                        src={`http://localhost:6001/node-files/products/${product.hoverimage}`}
                        alt={product.name}
                      />
                      <button
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
                </Col>
              ))}
            </Row>
          ) : (
            <p>No products available</p>
          )}
        </div>
      </div>
      <ProductModal
        show={showModal}
        onHide={() => setShowModal(false)}
        product={selectedProduct}
      />
      <TopButton/>
    </>
  );
};

export default ProductCard;
