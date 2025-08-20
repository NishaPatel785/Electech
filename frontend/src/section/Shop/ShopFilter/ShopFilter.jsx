import React, { useEffect, useState } from "react";
import classes from "./ShopFilter.module.css";

const ShopFilter = ({ products, onFilterChange }) => {
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

  const [isOpen, setIsOpen] = useState(false); // Start closed

  const toggleSidebar = () => {
    if (window.innerWidth <= 768) {
      setIsOpen((prev) => !prev);
    }
  };

  const closeSidebar = () => {
    if (window.innerWidth <= 768) {
      setIsOpen(false);
    }
  };

  const getUniqueVariantValues = (key) => {
    if (!Array.isArray(products)) return [];
    const values = products.flatMap((product) =>
      product.variants?.map((v) => v[key]) || []
    );
    return [...new Set(values.map((val) => val?.trim()))].filter(Boolean);
  };

  const allColors = getUniqueVariantValues("code");
  const allRAMs = getUniqueVariantValues("ram");
  const allSizes = getUniqueVariantValues("size");

  const allBrands = [...new Set(products.map((p) => p.brand_name))].filter(Boolean);
  const allCategories = [...new Set(products.map((p) => p.category_name))].filter(Boolean);
  const allSubcategories = [...new Set(products.map((p) => p.subcategory_name))].filter(Boolean);

  const handleChange = (type, value) => {
    setFilters((prev) => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter((v) => v !== value)
        : [...prev[type], value],
    }));
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: Number(value) }));
  };

  const handleClearFilters = () => {
    setFilters({
      minPrice: "",
      maxPrice: "",
      colors: [],
      ram: [],
      size: [],
      brands: [],
      categories: [],
      subcategories: [],
    });
  };

  const handleApplyFilters = () => {
    onFilterChange(filters);
    closeSidebar(); // Close only if screen is small
  };

  useEffect(() => {
    onFilterChange(filters);
  }, [filters]);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  return (
    <>
      {isMobile && (
        <button className={classes.toggleBtn} onClick={toggleSidebar}>
          {isOpen ? "Close Filters" : "Open Filters"}
        </button>
      )}
      <div className={classes.sidebarWrapper}>

        {isOpen && <div className={classes.overlay} onClick={closeSidebar} />}
        <div
          className={`${classes.sidebarFilter} ${isMobile && !isOpen ? classes.sidebarClosed : ""}`}

        >
          <button className={classes.clearBtn} onClick={handleClearFilters}>
            Clear All Filters
          </button>

          <h3>Price</h3>
          <input
            type="number"
            name="minPrice"
            placeholder="Min"
            value={filters.minPrice}
            onChange={handlePriceChange}
          />
          <input
            type="number"
            name="maxPrice"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={handlePriceChange}
          />

          <h3>Category</h3>
          {allCategories.map((cat) => (
            <label key={cat}>
              <input
                type="checkbox"
                checked={filters.categories.includes(cat)}
                onChange={() => handleChange("categories", cat)}
              />
              {cat}
            </label>
          ))}

          <h3>Subcategory</h3>
          {allSubcategories.map((sub) => (
            <label key={sub}>
              <input
                type="checkbox"
                checked={filters.subcategories.includes(sub)}
                onChange={() => handleChange("subcategories", sub)}
              />
              {sub}
            </label>
          ))}

          <h3>Brands</h3>
          {allBrands.map((brand) => (
            <label key={brand}>
              <input
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={() => handleChange("brands", brand)}
              />
              {brand}
            </label>
          ))}

          <h3>Color</h3>
          <div className={classes.colorCircles}>
            {allColors.map((color) => (
              <span
                key={color}
                className={`${classes.colorCircle} ${filters.colors.includes(color) ? classes.selected : ""
                  }`}
                style={{ backgroundColor: color }}
                onClick={() => handleChange("colors", color)}
              />
            ))}
          </div>

          <h3>RAM</h3>
          {allRAMs.map((ram) => (
            <label key={ram}>
              <input
                type="checkbox"
                checked={filters.ram.includes(ram)}
                onChange={() => handleChange("ram", ram)}
              />
              {ram}
            </label>
          ))}

          <h3>Size</h3>
          {allSizes.map((size) => (
            <label key={size}>
              <input
                type="checkbox"
                checked={filters.size.includes(size)}
                onChange={() => handleChange("size", size)}
              />
              {size}
            </label>
          ))}

          <button className={classes.applyBtn} onClick={handleApplyFilters}>
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
};

export default ShopFilter;
