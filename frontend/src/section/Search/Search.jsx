import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AllProducts } from "../action/productActions";
import { getAllCategory } from "../action/Allcategory";
import { useNavigate } from "react-router-dom";
import { TiDeleteOutline } from "react-icons/ti";

import classes from "./Search.module.css";

const Search = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { products } = useSelector((state) => state.products);
  const { cat } = useSelector((state) => state.Allcat);
  const allCategories = cat?.data || [];

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);

  useEffect(() => {
    dispatch(AllProducts());
    dispatch(getAllCategory());
  }, [dispatch]);

  const handleFilter = (value) => {
    setSearchTerm(value);

    if (value.trim() === "") {
      setFilteredProducts([]);
      setFilteredCategories([]);
      return;
    }

    const lowerValue = value.toLowerCase();

    const productsFound = products.filter((item) =>
      item.name.toLowerCase().includes(lowerValue)
    );

    const categoriesFound = allCategories.filter((cat) =>
      cat.item_name.toLowerCase().includes(lowerValue)
    );

    setFilteredProducts(productsFound);
    setFilteredCategories(categoriesFound);
  };

  return (
    <div className={classes.search_top}>
      <input
        type="text"
        placeholder="Search Here"
        value={searchTerm}
        onChange={(e) => handleFilter(e.target.value)}
      />

      {searchTerm && (
        <div className={classes.search_result}>
          {filteredCategories.length > 0 && (
            <div>
              <h4>Categories</h4>
              {filteredCategories.map((category, i) => (
                <div
                  key={i}
                  onClick={() => navigate(`/category/${category.item_id}`)}
                >
                  {category.item_name}
                </div>
              ))}
            </div>
          )}

          {filteredProducts.length > 0 && (
            <div>
              <h4>Products</h4>
              {filteredProducts.map((product, i) => (
                <div
                  className={classes.product_name}
                  key={i}
                  onClick={() => navigate(`/products/${product.id}`)}
                >
                  <img
                    src={`http://localhost:6001/node-files/products/${product.thumbnail}`}
                    alt={product.name}
                  />
                  <p>{product.name}</p>
                </div>
              ))}
            </div>
          )}

          {filteredCategories.length === 0 &&
            filteredProducts.length === 0 && (
              <div>No results found</div>
            )}
        </div>
      )}
    </div>
  );
};

export default Search;
