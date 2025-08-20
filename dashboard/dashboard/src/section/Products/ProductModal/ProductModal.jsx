import React from "react";
import {
  Box,
  Typography,
  Divider,
  Chip,
  Grid,
  Stack,
  Avatar,
} from "@mui/material";

const ProductModal = ({ data }) => {
  if (!data) return null;


    const images = data.images ? JSON.parse(data.images) : [];

  return (
    <Box
      sx={{
        bgcolor: (theme) =>
          theme.palette.mode === "dark" ? "#1e1e1e" : "#fff",
        color: (theme) => theme.palette.text.primary,
        p: 3,
        borderRadius: 2,
        maxHeight: "80vh",
        overflowY: "auto",
        width: "100%",
      }}
    >
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Product Details
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {/* Basic Info */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography><strong>ID:</strong> {data.id}</Typography>
          <Typography><strong>Name:</strong> {data.name}</Typography>
          <Typography><strong>Brand:</strong> {data.brand_name}</Typography>
          <Typography><strong>Category:</strong> {data.category_name}</Typography>
          <Typography><strong>Subcategory:</strong> {data.subcategory_name}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography><strong>Price:</strong> ${data.price}</Typography>
          <Typography><strong>Discount Price:</strong> ${data.cut_price}</Typography>
          <Typography><strong>Stock(Number):</strong> {data.stock}</Typography>
          <Typography><strong>Stock:</strong> {data.availableStock}</Typography>
          <Typography><strong>SKU:</strong> {data.sku}</Typography>
          <Typography><strong>Created At:</strong> {new Date(data.createdAt).toLocaleString()}</Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      {/* Description */}
      <Typography variant="subtitle1" fontWeight={700} gutterBottom>
        Description
      </Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        {data.shortDesc || "No description available."}
      </Typography>

      <Typography variant="subtitle1" fontWeight={700}>
           Thumbnail
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap">
         
              <Avatar
              src={`http://localhost:6001/node-files/products/${data.thumbnail}`}
                variant="rounded"
                sx={{ width: 100, height: 100, borderRadius: 2 }}
              />
             
             
          </Stack>

          <Typography variant="subtitle1" fontWeight={700}>
           Hover Image
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap">
         
              <Avatar
              src={`http://localhost:6001/node-files/products/${data.hoverimage}`}
                variant="rounded"
                sx={{ width: 100, height: 100, borderRadius: 2 }}
              />
             
             
          </Stack>


          <Typography variant="subtitle1" fontWeight={700}>
           Description Image
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap">
         
              <Avatar
              src={`http://localhost:6001/node-files/products/${data.descImage}`}
                variant="rounded"
                sx={{ width: 100, height: 100, borderRadius: 2 }}
              />
             
             
          </Stack>


      {/* Tags */}
      {data.tags?.length > 0 && (
        <>
          <Typography variant="subtitle1" fontWeight={700}>
            Tags
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
           
              <Chip  label={data.tags} variant="outlined" />
            
          </Stack>
        </>
      )}

      {/* Variants */}
      {data.variants?.length > 0 && (
        <>
          <Typography variant="subtitle1" fontWeight={700} fontSize={20}>
            Variants :-
          </Typography>
          <Box sx={{ mb: 2 }}>
            {data.variants.map((variant, idx) => (
              <><Box
                key={idx}
                sx={{
                  p: 1.5,
                  mb: 1,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                }}
              >
                <Typography>
                  <strong>RAM:</strong> {variant.ram} &nbsp;|&nbsp;
                  <strong>Size:</strong> {variant.size} &nbsp;|&nbsp;
                  <strong>Color:</strong> {variant.color} &nbsp;|&nbsp;
                  <strong>Color Code:</strong> {variant.code}
                </Typography>
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    bgcolor: variant.code,
                    border: "1px solid #ccc",
                    display: "inline-block",
                    ml: 1,
                    verticalAlign: "middle",
                  }} />
              </Box><Typography variant="subtitle1" fontWeight={700}>
                  Colors Image
                </Typography>
                <Stack direction="row" spacing={2} flexWrap="wrap">
         
              <Avatar
              src={`http://localhost:6001/node-files/products/${variant.image}`}
                variant="rounded"
                sx={{ width: 100, height: 100, borderRadius: 2 }}
              />
             
             
          </Stack>
                
                </>
              
            ))}
          </Box>
        </>
      )}

      {/* Images */}
      {data.images?.length > 0 && (
        <>
          <Typography variant="subtitle1" fontWeight={700}>
            Product Images
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            {images.map((img, idx) => (
              <Avatar
              src={`http://localhost:6001/node-files/products/${img}`}
                key={idx}
                variant="rounded"
                sx={{ width: 100, height: 100, borderRadius: 2 }}
              />
             ))} 
             
          </Stack>


          <Typography variant="subtitle1" fontWeight={700} gutterBottom>
        Big Description
      </Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        {data.longDesc1 || "No description available."}
        {data.longDesc2 || "No description available."}
        {data.longDesc3 || "No description available."}
      </Typography>
        </>
      )}
    </Box>
  );
};

export default ProductModal;
