
  
import React from "react";
import axios from "axios";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";

const CreateBrand = ({ onHide, onCreate }) => {
  const formik = useFormik({
    initialValues: {
      name: ""
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required")
    }),
    onSubmit: async (values) => {
        try {
          await axios.post("http://localhost:6001/api/v1/add-brand", values);
          onCreate();
          onHide();
        } catch (err) {
          console.error("Create failed:", err.response?.data || err.message);
          alert("Something went wrong");
        }
      },
      
  });

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <h5  className="p-5 text-lg font-bold text-center">Create Brand</h5>

      <TextField
        label="Brand Name"
        name="name"
        value={formik.values.name}
        onChange={formik.handleChange}
        error={formik.touched.name && Boolean(formik.errors.name)}
        helperText={formik.touched.name && formik.errors.name}
        fullWidth
      />

      

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
        <Button onClick={onHide}>Cancel</Button>
        <Button type="submit" variant="contained">Create</Button>
      </Box>
    </Box>
  );
};

export default CreateBrand;
