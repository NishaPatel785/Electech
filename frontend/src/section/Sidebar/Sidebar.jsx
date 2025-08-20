import React, { useEffect, useState } from "react";
import classes from "./Sidebar.module.css";

const SidebarFilter = ({ products, onFilterChange }) => {
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    colors: [],
    ram: [],
    size: [],
    brands: [],
  });

  const getUniqueVariantValues = (key) => {
    const values = products.flatMap((product) =>
      product.variants?.map((v) => v[key])
    );
    return [...new Set(values.map((val) => val?.trim()))].filter(Boolean);
  };

  const allColors = getUniqueVariantValues("code");
  const allRAMs = getUniqueVariantValues("ram");
  const allSizes = getUniqueVariantValues("size");
  const allBrands = [...new Set(products.map((p) => p.brand_name))].filter(Boolean);

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
    });
  };

  useEffect(() => {
    onFilterChange(filters);
  }, [filters]);

  return (
    <div className={classes.sidebarFilter}>
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
            className={`${classes.colorCircle} ${
              filters.colors.includes(color) ? classes.selected : ""
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
    </div>
  );
};

export default SidebarFilter;
