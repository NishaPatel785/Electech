import React from "react";
import axios from "axios";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";

const CreateCategory = ({ onHide, onCreate }) => {
  const formik = useFormik({
    initialValues: {
      name: "",
      cat_image: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      cat_image: Yup.mixed().required("Image is required"),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("cat_image", values.cat_image);

      try {
        await axios.post("http://localhost:6001/api/v1/add-category", formData);
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
        label="Category Name"
        name="name"
        value={formik.values.name}
        onChange={formik.handleChange}
        error={formik.touched.name && Boolean(formik.errors.name)}
        helperText={formik.touched.name && formik.errors.name}
        fullWidth
      />

      <input
        type="file"
        name="cat_image"
        accept="image/*"
        onChange={(e) => formik.setFieldValue("cat_image", e.target.files[0])}
      />
      {formik.errors.cat_image && (
        <Typography color="error" fontSize={13}>
          {formik.errors.cat_image}
        </Typography>
      )}

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
        <Button onClick={onHide}>Cancel</Button>
        <Button type="submit" variant="contained">Create</Button>
      </Box>
    </Box>
  );
};

export default CreateCategory;
