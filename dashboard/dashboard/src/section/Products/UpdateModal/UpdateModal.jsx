import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Typography,
} from "@mui/material";
import axios from "axios";

const ramOptions = ["4GB", "8GB", "64GB"];
const stockOption = ["in stock", "out of stock"];
const rateOption = ["1", "2", "3", "4", "5"];
const sizeOption = ["small", "medium", "big"];

const UpdateProductModal = ({ onHide, onUpdate, data }) => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);
  console.log("Product data for update:", { data });

  const [form, setForm] = useState({ ...data });

  useEffect(() => {
    axios.get("http://localhost:6001/api/v1/get-categorys")
      .then(res => setCategories(res.data.categories))
      .catch(err => console.log(err));

    axios.get("http://localhost:6001/api/v1/get-subcategorys")
      .then(res => setSubcategories(res.data.data))
      .catch(err => console.log(err));

    axios.get("http://localhost:6001/api/v1/get-brands")
      .then(res => setBrands(res.data.data))
      .catch(err => console.log(err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === "images" ? files : files[0],
    }));
  };

  const handleVariantChange = (index, e) => {
    const { name, value, files } = e.target;
    const updatedVariants = [...form.variants];
    updatedVariants[index][name] = files ? files[0] : value;
    setForm(prev => ({ ...prev, variants: updatedVariants }));
  };

  const handleAddVariant = () => {
    setForm(prev => ({
      ...prev,
      variants: [...prev.variants, { ram: "", color: "", code: "", size: "", image: null }],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("sku", form.sku);
    formData.append("cut_price", form.cut_price === "" ? null : form.cut_price);
    formData.append("shortDesc", form.shortDesc);
    formData.append("discount", form.discount);
    formData.append("stock", form.stock);
    formData.append("availableStock", form.availableStock);
    formData.append("rating", form.rating);
    formData.append("tags", form.tags);
    formData.append("category_id", form.category_id);
    formData.append("sub_category_id", form.sub_category_id);
    formData.append("brand_id", form.brand_id);
    formData.append("longDesc1", form.longDesc1);
    formData.append("longDesc2", form.longDesc2);
    formData.append("longDesc3", form.longDesc3);

    if (form.thumbnail) formData.append("thumbnail", form.thumbnail);
    if (form.hoverimage) formData.append("hoverimage", form.hoverimage);
    if (form.descimage) formData.append("descimage", form.descimage);

    if (form.images && form.images.length > 0) {
      Array.from(form.images).forEach(file => {
        formData.append("images", file);
      });
    }

    form.variants.forEach((variant, i) => {
      formData.append(`variants[${i}][ram]`, variant.ram);
      formData.append(`variants[${i}][color]`, variant.color);
      formData.append(`variants[${i}][code]`, variant.code);
      formData.append(`variants[${i}][size]`, variant.size);
      if (variant.image) {
        formData.append(`variants[${i}][image]`, variant.image);
      }
    });

    try {
      const response = await axios.put(`http://localhost:6001/api/v1/update-product/${data.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response); // Log the successful response
      console.log(formData)
      onUpdate();
      onHide();
    } catch (err) {
      console.log(formData)
      console.error("Update failed", err.response ? err.response.data : err.message); // Log the full error response
    }
  };

  return (
    <Box ssx={{
      p: 3,
      m: 2,
      bgcolor: "#fff",
      borderRadius: 2,
      boxShadow: 3,
      width: "500px", // fixed width
      mx: "auto"      // center horizontally
    }}>
      <Typography variant="h5" align="center" sx={{
        p: 3
      }} mb={2}>Update Product</Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField fullWidth label="Name" name="name" value={form.name} onChange={handleChange} />
        </Grid>
        <Grid item xs={6}>
          <TextField fullWidth label="Price" name="price" value={form.price} onChange={handleChange} />
        </Grid>

        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select name="category_id" value={form.category_id} onChange={handleChange}>
              {categories.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl fullWidth sx={{
            width: '100px', // Change this to adjust the width
          }}>
            <InputLabel>SubCategory</InputLabel>
            <Select name="sub_category_id" value={form.sub_category_id} onChange={handleChange}>
              {subcategories.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel>Brand</InputLabel>
            <Select name="brand_id" value={form.brand_id} onChange={handleChange}>
              {brands.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <TextField fullWidth label="SKU" name="sku" value={form.sku} onChange={handleChange} />
        </Grid>

        <Grid item xs={6}>
          <TextField fullWidth label="Stock" name="stock" value={form.stock} onChange={handleChange} />
        </Grid>

        <Grid item xs={6}>
          <TextField select fullWidth label="Available Stock" name="availableStock" value={form.availableStock} onChange={handleChange}>
            {stockOption.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
          </TextField>
        </Grid>

        <Grid item xs={6}>
          <TextField sx={{
            width: '100px', // Change this to adjust the width
          }} select fullWidth label="Rating" name="rating" value={form.rating} onChange={handleChange}>
            {rateOption.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
          </TextField>
        </Grid>

        <Grid item xs={6}>
          <TextField fullWidth label="Short Description" name="shortDesc" value={form.shortDesc} onChange={handleChange} />
        </Grid>

        <Grid item xs={6}>
          <TextField fullWidth label="Discount Price" name="cut_price" value={form.cut_price} onChange={handleChange} />
        </Grid>

        <Grid item xs={6}>
          <TextField fullWidth label="Discount %" name="discount" value={form.discount} onChange={handleChange} />
        </Grid>

        <Grid item xs={6}>
          <TextField fullWidth label="Tags" name="tags" value={form.tags} onChange={handleChange} />
        </Grid>

        {/* File inputs */}
        <Grid item xs={6}><label>Thumbnail: <input type="file" name="thumbnail" onChange={handleFileChange} /></label></Grid>
        <Grid item xs={6}><label>HoverImage: <input type="file" name="hoverimage" onChange={handleFileChange} /></label></Grid>
        <Grid item xs={6}><label>DescImage: <input type="file" name="descimage" onChange={handleFileChange} /></label></Grid>
        <Grid item xs={6}><label>Images: <input type="file" name="images" multiple onChange={handleFileChange} /></label></Grid>

        {/* Descriptions */}
        <Grid item xs={12}><TextField fullWidth name="longDesc1" label="Description 1" value={form.longDesc1} onChange={handleChange} /></Grid>
        <Grid item xs={12}><TextField fullWidth name="longDesc2" label="Description 2" value={form.longDesc2} onChange={handleChange} /></Grid>
        <Grid item xs={12}><TextField fullWidth name="longDesc3" label="Description 3" value={form.longDesc3} onChange={handleChange} /></Grid>

        {/* Variants */}
        {form.variants.map((variant, idx) => (
          <Grid item xs={12} key={idx}>
            <Typography variant="subtitle1">Variant {idx + 1}</Typography>
            <Grid container spacing={1}>
              <Grid item xs={3}>
                <TextField sx={{
                  width: '100px', // Change this to adjust the width
                }} select name="ram" value={variant.ram} label="RAM" onChange={(e) => handleVariantChange(idx, e)} fullWidth>
                  {ramOptions.map(ram => <MenuItem key={ram} value={ram}>{ram}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={3}>
                <TextField name="color" value={variant.color} label="Color" onChange={(e) => handleVariantChange(idx, e)} fullWidth />
              </Grid>
              <Grid item xs={3}>
                <TextField name="code" value={variant.code} label="Hex Code" onChange={(e) => handleVariantChange(idx, e)} fullWidth />
              </Grid>
              <Grid item xs={3}>
                <TextField sx={{
                  width: '100px', // Change this to adjust the width
                }} select name="size" value={variant.size} label="Size" onChange={(e) => handleVariantChange(idx, e)} fullWidth>
                  {sizeOption.map(size => <MenuItem key={size} value={size}>{size}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <label>Variant Image: <input type="file" name="image" onChange={(e) => handleVariantChange(idx, e)} /></label>
              </Grid>
            </Grid>
          </Grid>
        ))}

        <Grid item xs={12}>
          <Button onClick={handleAddVariant} variant="outlined">Add Variant</Button>
        </Grid>

        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>Update Product</Button>
          <Button variant="text" onClick={onHide} sx={{ ml: 2 }}>Cancel</Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UpdateProductModal;
