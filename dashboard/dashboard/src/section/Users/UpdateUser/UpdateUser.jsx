import React, { useEffect } from "react";
import axios from "axios";
import { Box, TextField, Button } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";

const UpdateUser = ({ data, onHide, onUpdate }) => {
  
  if (!data) return null;

  const formik = useFormik({
    initialValues: {
      first_name: data.first_name || "",
      last_name: data.last_name || "",
      email: data.email || ""
    },
    enableReinitialize: true, // important to update values when `data` changes
    validationSchema: Yup.object({
      first_name: Yup.string().required("First Name is required"),
      last_name: Yup.string().required("Last Name is required"),
      email: Yup.string().required("Email is required").email("Enter a valid email address"),
      
    }),
    onSubmit: async (values) => {
      try {
        await axios.put(`http://localhost:6001/api/v1/update-user/${data.id}`, values);
        onUpdate(); // refresh UI
        onHide();   // close modal
      } catch (err) {
        console.error("Update failed:", err.response?.data || err.message);
        alert(err.response?.data?.message || "Something went wrong");
      }
    },
  });

  return (
    <Box
      component="form"
      onSubmit={formik.handleSubmit}
      sx={{
        bgcolor: (theme) => theme.palette.mode === "dark" ? "#121212" : "#fff",
        color: (theme) => theme.palette.text.primary,
        p: 2,
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <h5 className="text-lg font-bold text-center">Edit User</h5>

      <TextField
        label="First Name"
        name="first_name"
        value={formik.values.first_name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.first_name && Boolean(formik.errors.first_name)}
        helperText={formik.touched.first_name && formik.errors.first_name}
        fullWidth
      />
      <TextField
        label="Last Name"
        name="last_name"
        value={formik.values.last_name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.last_name && Boolean(formik.errors.last_name)}
        helperText={formik.touched.last_name && formik.errors.last_name}
        fullWidth
      />
      <TextField
        label="Email"
        name="email"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email}
        fullWidth
      />
     

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
        <Button onClick={onHide}>Cancel</Button>
        <Button type="submit" variant="contained">
          Update
        </Button>
      </Box>
    </Box>
  );
};

export default UpdateUser;
