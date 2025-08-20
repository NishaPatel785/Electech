import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useFormik } from "formik";


const UpdateSubcategory = ({ onHide, onUpdate, data }) => {
  const [categories, setCategories] = useState([]);



  useEffect(() => {
    axios
      .get("http://localhost:6001/api/v1/get-categorys")
      .then((response) => setCategories(response.data.categories))
      .catch((err) => console.log(err));
  }, []);


  const formik = useFormik({
    initialValues: {
      name: data?.name || "",
      sub_image: null,
      category_id: data?.category_id || "",
    },
    enableReinitialize: true,
    // validationSchema: Yup.object({
    //   name: Yup.string().required("Name is required"),
    //   sub_image: Yup.mixed().required("Image is required"),
    //   category_id: Yup.string().required("Please select category"),
    // }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("sub_image", values.sub_image);
      formData.append("category_id", values.category_id);
    
      try {
        await axios.put(
          `http://localhost:6001/api/v1/update-subcategory/${data.id}`,
          formData
        );
        onUpdate();; 
        onHide();  
      } catch (err) {
        console.error("Update failed:", err);
        alert("Something went wrong");
      }
      console.log("Submitting data for ID:", data?.id);
    }

  });

  return (
    <Box
      component="form"
      onSubmit={formik.handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
    >
      <h5 className="p-5 text-lg font-bold text-center">Update Subcategory</h5>

      <TextField
        label="Subcategory Name"
        name="name"
        value={formik.values.name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.name && Boolean(formik.errors.name)}
        helperText={formik.touched.name && formik.errors.name}
        fullWidth
      />

      <div>
        <h2>Subcategory Image:</h2>
        <input
          type="file"
          name="sub_image"
          accept="image/*"
          onChange={(e) =>
            formik.setFieldValue("sub_image", e.target.files[0])
          }
        />
        {formik.touched.sub_image && formik.errors.sub_image && (
          <Typography color="error" fontSize={13}>
            {formik.errors.sub_image}
          </Typography>
        )}
      </div>

      <FormControl
        fullWidth
        error={formik.touched.category_id && Boolean(formik.errors.category_id)}
      >
        <InputLabel id="category-label">Select Category</InputLabel>
        <Select
          labelId="category-label"
          id="category"
          name="category_id"
          value={formik.values.category_id}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          label="Select Category"
        >
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
        {formik.touched.category_id && formik.errors.category_id && (
          <Typography color="error" fontSize={13}>
            {formik.errors.category_id}
          </Typography>
        )}
      </FormControl>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
        <Button onClick={onHide}>Cancel</Button>
        <Button type="submit" variant="contained">
          Update
        </Button>
      </Box>
    </Box>
  );
};

export default UpdateSubcategory;
