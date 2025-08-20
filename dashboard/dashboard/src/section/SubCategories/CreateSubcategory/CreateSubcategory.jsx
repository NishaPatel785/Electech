



import React, { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { Box, TextField, Button, Typography,FormControl ,InputLabel,Select,MenuItem} from "@mui/material";
import { useFormik } from "formik";
import { Field } from "formik";
import * as Yup from "yup";


const CreateSubcategory = ({ onHide, onCreate }) => {

    const [categories, getCategory] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:6001/api/v1/get-categorys')
          .then((response) =>      
          getCategory(response.data.categories))
          .catch((err) => console.log(err))
      })


  const formik = useFormik({
    initialValues: {
      name: "",
      sub_image: null,
      category_id:''
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      sub_image: Yup.mixed().required("Image is required"),
      category_id:Yup.string().required("Please select category")
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("sub_image", values.sub_image);
      formData.append("category_id", values.category_id);

      try {
        await axios.post("http://localhost:6001/api/v1/add-subcategory", formData);
        onCreate();
        onHide();
      } catch (err) {
        console.error("Create failed:", err);
        alert("Something went wrong");
      }
    },
  });

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <h5  className="p-5 text-lg font-bold text-center">Create Category</h5>

      <TextField
        label="SubCategory Name"
        name="name"
        value={formik.values.name}
        onChange={formik.handleChange}
        error={formik.touched.name && Boolean(formik.errors.name)}
        helperText={formik.touched.name && formik.errors.name}
        fullWidth
      />
      <h2>SubCategory Image :</h2>
      <input
        type="file"
        name="sub_image"
        accept="image/*"
        onChange={(e) => formik.setFieldValue("sub_image", e.target.files[0])}
      />
      {formik.errors.sub_image && (
        <Typography color="error" fontSize={13}>
          {formik.errors.sub_image}
        </Typography>
      )}

<FormControl fullWidth>
  <InputLabel id="category-label">Select Category</InputLabel>
  <Select
    labelId="category-label"
    id="category"
    name="category_id"
    value={formik.values.category_id}
    label="Select Category"
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
  >
    {categories.map((category) => (
      <MenuItem key={category.id} value={category.id}>
        {category.name}
      </MenuItem>
    ))}
  </Select>
</FormControl>


      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
        <Button onClick={onHide}>Cancel</Button>
        <Button type="submit" variant="contained">Create</Button>
      </Box>
    </Box>
  );
};

export default CreateSubcategory;
