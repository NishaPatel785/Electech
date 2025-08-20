import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToWishlist } from "../../action/WishlistAction";
import { Col, Row } from "react-bootstrap";
import { CiHeart } from "react-icons/ci";
import { IoExpand } from "react-icons/io5";
import ShopFilter from "../ShopFilter/ShopFilter";
import classes from "./ShopProducts.module.css";
import { AllProducts } from "../../action/productActions";
import Rating from "../../../components/Rating/Rating";
import Loading from "../../../components/Loading/Loading";
import LinkHome from "../../../components/Link/Link";
import { IoMdHeart } from "react-icons/io";
import ProductModal from "./ProductModal";
import TopButton from "../../../components/TopButton/TopButton"

const ShopProducts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
    const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    colors: [],
    ram: [],
    size: [],
    brands: [],
    categories: [],
    subcategories: [],
  });

  const [sortOption, setSortOption] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const productsPerPage = 8;

  const { products = [], loading, error } = useSelector((state) => state.products || {});

  useEffect(() => {
    dispatch(AllProducts());
  }, [dispatch]);

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];

    const min = filters.minPrice === "" ? 0 : Number(filters.minPrice);
    const max = filters.maxPrice === "" ? Infinity : Number(filters.maxPrice);

    const result = products.filter((product) => {
      const brandMatch =
        filters.brands.length === 0 || filters.brands.includes(product.brand_name);
      const categoryMatch =
        filters.categories.length === 0 || filters.categories.includes(product.category_name);
      const subcategoryMatch =
        filters.subcategories.length === 0 || filters.subcategories.includes(product.subcategory_name);

      const productPrice = Number(product.price || 0);
      const productPriceMatch = productPrice >= min && productPrice <= max;

      if (!product.variants || product.variants.length === 0) {
        return brandMatch && categoryMatch && subcategoryMatch && productPriceMatch;
      }

      const variantMatch = product.variants.some((variant) => {
        const variantPrice = Number(variant.price || product.price || 0);
        const priceMatch = variantPrice >= min && variantPrice <= max;

        const colorMatch =
          filters.colors.length === 0 ||
          filters.colors.map((c) => c.toLowerCase()).includes(variant.code?.toLowerCase());

        const ramMatch =
          filters.ram.length === 0 || filters.ram.includes(String(variant.ram));

        const sizeMatch =
          filters.size.length === 0 || filters.size.includes(variant.size);

        return priceMatch && colorMatch && ramMatch && sizeMatch;
      });

      return brandMatch && categoryMatch && subcategoryMatch && variantMatch;
    });

    if (sortOption === "priceLowHigh") {
      return result.sort((a, b) => (a.variants?.[0]?.price || a.price) - (b.variants?.[0]?.price || b.price));
    } else if (sortOption === "priceHighLow") {
      return result.sort((a, b) => (b.variants?.[0]?.price || b.price) - (a.variants?.[0]?.price || a.price));
    } else if (sortOption === "atoz") {
      return result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "ztoa") {
      return result.sort((a, b) => b.name.localeCompare(a.name));
    }

    return result;
  }, [products, filters, sortOption]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const handleProductClick = (productId) => {
    window.scrollTo(0,0),
    navigate(`/products/${productId}`);
  };

  const handleAddToWish = (productId) => {
    dispatch(addToWishlist(productId));
    navigate("/wishlist");
  };

  const handleExpandClick = (e, product) => {
    e.stopPropagation();
    setSelectedProduct(product);
    setShowModal(true);
  };


   const handleFilterChange = (newFilters) => {
  setFilters(newFilters); 

  if (window.innerWidth <= 768) {
    setShowMobileFilter(false);
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
};

  
  

  return (
    <>

<LinkHome name="Products" />
    <div className={classes.container}>

       <div className={classes.mobileFilterButton}>
        <button onClick={() => setShowMobileFilter(!showMobileFilter)}>
          {showMobileFilter ? "Close Filter" : "Filter"}
        </button>
      </div>

      {/* Filter Sidebar */}
      <div
        className={`${classes.sidebar} ${
          showMobileFilter ? classes.showSidebar : ""
        }`}
      >
         <ShopFilter onFilterChange={handleFilterChange} products={products} />
      </div>
      {/* <div className={classes.sidebar}>
        <ShopFilter onFilterChange={setFilters} products={products} />
      </div> */}

      <div className={classes.productContainer}>
        <div className={classes.sortAndPagination}>
          <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
            <option value="default">Default</option>
            <option value="priceLowHigh">Price: Low to High</option>
            <option value="priceHighLow">Price: High to Low</option>
            <option value="atoz">Alphabetically: A to Z</option>
            <option value="ztoa">Alphabetically: Z to A</option>
          </select>
        </div>

        {loading ? (
          <Loading />
        ) : error ? (
          <p>Error: {error}</p>
        ) : currentProducts.length > 0 ? (
          <Row className={`g-0 ${classes.productGrid}`}  xs={1} sm={2} md={3} lg={4}>
            {currentProducts.map((product) => (
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
                      <IoMdHeart/>
                    </button>
                    <button onClick={(e) => handleExpandClick(e, product)} className={classes.newBtn}>
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

        {/* Pagination */}
        <div className={classes.pagination}>
          {Array.from({ length: Math.ceil(filteredProducts.length / productsPerPage) }, (_, i) => (
            <button
              key={i + 1}
              className={currentPage === i + 1 ? classes.activePage : ""}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
    <TopButton/>

    <ProductModal
  show={showModal}
  onHide={() => setShowModal(false)}
  product={selectedProduct}
/>
          </>
  );
};

export default ShopProducts;
