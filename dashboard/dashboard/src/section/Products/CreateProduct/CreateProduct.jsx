import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const ramOptions = ["4GB", "8GB", "64GB"];
const stockOption = ["in stock", "out of stock"];
const rateOption = ["1", "2", "3", "4", "5"];
const sizeOption = ["small", "medium", "big"];

const CreateProduct = ({ onHide, onCreate }) => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cat, sub, brand] = await Promise.all([
          axios.get("http://localhost:6001/api/v1/get-categorys"),
          axios.get("http://localhost:6001/api/v1/get-subcategorys"),
          axios.get("http://localhost:6001/api/v1/get-brands"),
        ]);
        setCategories(cat.data.categories);
        setSubcategories(sub.data.data);
        setBrands(brand.data.data);
      } catch (err) {
        console.error("Fetch error", err);
      }
    };
    fetchData();
  }, []);

  const [form, setForm] = useState({
    name: "",
    price: "",
    sku: "",
    cut_price: "",
    shortDesc: "",
    discount: "",
    stock: "",
    availableStock: "",
    rating: "",
    tags: "",
    category_id: "",
    sub_category_id: "",
    brand_id: "",
    thumbnail: null,
    hoverimage: null,
    descimage: null,
    images: null,
    longDesc1: "",
    longDesc2: "",
    longDesc3: "",
    variants: [
      {
        ram: "",
        color: "",
        code: "",
        size: "",
        image: null,
      },
    ],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === "images" ? files : files[0] }));
  };

  const handleVariantChange = (index, e) => {
    const { name, value, files } = e.target;
    setForm((prev) => {
      const updatedVariants = [...prev.variants];
      updatedVariants[index][name] = files ? files[0] : value;
      return { ...prev, variants: updatedVariants };
    });
  };

  const addVariant = () => {
    setForm((prev) => ({
      ...prev,
      variants: [...prev.variants, { ram: "", color: "", code: "", size: "", image: null }],
    }));
  };

  const removeVariant = (index) => {
    setForm((prev) => {
      const updatedVariants = [...prev.variants];
      updatedVariants.splice(index, 1);
      return { ...prev, variants: updatedVariants };
    });
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    const textFields = [
      "name", "price", "sku", "cut_price", "shortDesc", "discount",
      "stock", "availableStock", "rating", "tags", "category_id",
      "sub_category_id", "brand_id", "longDesc1", "longDesc2", "longDesc3"
    ];
    textFields.forEach(field => {
      if (form[field]) formData.append(field, form[field]);
    });

    if (form.thumbnail) formData.append("thumbnail", form.thumbnail);
    if (form.hoverimage) formData.append("hoverimage", form.hoverimage);
    if (form.descimage) formData.append("descimage", form.descimage);
    if (form.images && form.images.length > 0) {
      Array.from(form.images).forEach((file) => formData.append("images", file));
    }

    const variants = form.variants.map((v) => ({
      ram: v.ram,
      color_name: v.color,
      color_code: v.code,
      size: v.size,
      availableStock: form.availableStock,
      stock: form.stock,
      price: form.price,
      sku: form.sku
    }));
    form.variants.forEach((variant) => {
      if (variant.image) formData.append("colorimage", variant.image);
    });
    formData.append("variants", JSON.stringify(variants));

    try {
      await axios.post("http://localhost:6001/api/v1/add-product", formData);
      alert("Product added successfully");
      onCreate();
      onHide();
    } catch (err) {
      console.error("Error adding product", err);
      alert("Failed to add product");
    }
  };

  return (
    <Box sx={{ bgcolor: (theme) =>
          theme.palette.mode === "dark" ? "#1e1e1e" : "#fff",
        color: (theme) => theme.palette.text.primary,
        p: 3,
        borderRadius: 2,
        maxHeight: "80vh",
        overflowY: "auto",
        width: "100%", }}>
      <Typography variant="h4" align="center" gutterBottom>Fill Details</Typography>

      <Grid container spacing={2}>
        {/* Name */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
          />
        </Grid>

        {/* Price */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Price"
            name="price"
            value={form.price}
            onChange={handleChange}
            fullWidth
          />
        </Grid>

        {/* Short Description */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Short Description"
            name="shortDesc"
            value={form.shortDesc}
            onChange={handleChange}
            fullWidth
          />
        </Grid>

        {/* Discount Price */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Discount Price"
            name="cut_price"
            value={form.cut_price}
            onChange={handleChange}
            fullWidth
          />
        </Grid>

        {/* Category */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="category-label">Select Category</InputLabel>
            <Select
               style={{width:"124px"}}
              labelId="category-label"
              name="category_id"
              value={form.category_id}
              label="Select Category"
              onChange={handleChange}
            >
              <MenuItem value="">
                <em>Select Category</em>
              </MenuItem>
              {categories.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* SubCategory */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="subcategory-label">Select SubCategory</InputLabel>
            <Select
             style={{width:"124px"}}
              labelId="subcategory-label"
              name="sub_category_id"
              value={form.sub_category_id}
              label="Select SubCategory"
              onChange={handleChange}
            >
              <MenuItem value="">
                <em>Select SubCategory</em>
              </MenuItem>
              {subcategories.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Brand */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="brand-label">Select Brand</InputLabel>
            <Select
             style={{width:"124px"}}
              labelId="brand-label"
              name="brand_id"
              value={form.brand_id}
              label="Select Brand"
              onChange={handleChange}
            >
              <MenuItem value="">
                <em>Select Brand</em>
              </MenuItem>
              {brands.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Stock */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Stock (Number)"
            type="number"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            fullWidth
          />
        </Grid>

        {/* Available Stock */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="stock-status-label">Stock Status</InputLabel>
            <Select
             style={{width:"124px"}}
              labelId="stock-status-label"
              name="availableStock"
              value={form.availableStock}
              label="Stock Status"
              onChange={handleChange}
            >
              {stockOption.map((stock) => (
                <MenuItem key={stock} value={stock}>
                  {stock}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Rating */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="rating-label">Rating</InputLabel>
            <Select
             style={{width:"124px"}}
              labelId="rating-label"
              name="rating"
              value={form.rating}
              label="Rating"
              onChange={handleChange}
            >
              {rateOption.map((rate) => (
                <MenuItem key={rate} value={rate}>
                  {rate}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Tags */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Tags"
            name="tags"
            value={form.tags}
            onChange={handleChange}
            fullWidth
          />
        </Grid>

        {/* Description Images */}
        <Grid item xs={12} sm={4}>
          <Typography>Thumbnail</Typography>
          <input
            type="file"
            name="thumbnail"
            onChange={handleFileChange}
            accept="image/*"
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <Typography>Hover Image</Typography>
          <input
            type="file"
            name="hoverimage"
            onChange={handleFileChange}
            accept="image/*"
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <Typography>Description Image</Typography>
          <input
            type="file"
            name="descimage"
            onChange={handleFileChange}
            accept="image/*"
          />
        </Grid>

        {/* Multiple Images */}
        <Grid item xs={12}>
          <Typography>Multiple Images</Typography>
          <input
            type="file"
            name="images"
            onChange={handleFileChange}
            accept="image/*"
            multiple
          />
        </Grid>

        {/* Long Descriptions */}
        <Grid item xs={12} sm={4}>
          <TextField
            label="Long Description 1"
            name="longDesc1"
            value={form.longDesc1}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Long Description 2"
            name="longDesc2"
            value={form.longDesc2}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Long Description 3"
            name="longDesc3"
            value={form.longDesc3}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
      </Grid>

      {/* Variants Section */}
      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          Variants
        </Typography>

        {form.variants.map((variant, index) => (
          <Grid
            container
            spacing={2}
            key={index}
            alignItems="center"
            sx={{
              mb: 2,
              p: 2,
              border: "1px solid #ddd",
              borderRadius: 2,
            }}
          >
            <Grid item xs={12} sm={2}>
              <FormControl fullWidth>
                <InputLabel>RAM</InputLabel>
                <Select
                 style={{width:"124px"}}
                  name="ram"
                  value={variant.ram}
                  label="RAM"
                  onChange={(e) => handleVariantChange(index, e)}
                >
                  <MenuItem value="">
                    <em>Select RAM</em>
                  </MenuItem>
                  {ramOptions.map((ram) => (
                    <MenuItem key={ram} value={ram}>
                      {ram}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={2}>
              <TextField
                label="Color"
                name="color"
                value={variant.color}
                onChange={(e) => handleVariantChange(index, e)}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={2}>
              <TextField
               style={{width:"124px"}}
                label="Color Code"
                name="code"
                type="color"
                value={variant.code}
                onChange={(e) => handleVariantChange(index, e)}
                fullWidth
                sx={{ padding: 0 }}
              />
            </Grid>

            <Grid item xs={12} sm={2}>
              <FormControl fullWidth>
                <InputLabel>Size</InputLabel>
                <Select
                 style={{width:"124px"}}
                  name="size"
                  value={variant.size}
                  label="Size"
                  onChange={(e) => handleVariantChange(index, e)}
                >
                  <MenuItem value="">
                    <em>Select Size</em>
                  </MenuItem>
                  {sizeOption.map((size) => (
                    <MenuItem key={size} value={size}>
                      {size}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={3}>
              <Typography>Variant Image</Typography>
              <input
                type="file"
                name="image"
                onChange={(e) => handleVariantChange(index, e)}
                accept="image/*"
              />
            </Grid>

            <Grid item xs={12} sm={1}>
              <IconButton
                aria-label="remove variant"
                color="error"
                onClick={() => removeVariant(index)}
                disabled={form.variants.length === 1}
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}

        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={addVariant}
          sx={{ mb: 3 }}
        >
          Add Variant
        </Button>
      </Box>

     <Box sx={{ textAlign: "center", mt: 2 }}>
        <Button variant="contained" onClick={handleSubmit} sx={{ mr: 2 }}>Create Product</Button>
        <Button variant="outlined" onClick={onHide}>Cancel</Button>
      </Box>
    </Box>
  );
};

export default CreateProduct;
