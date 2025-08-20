import React from "react";
import axios from "axios";
import { Box, TextField, Button } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";

const CreateUser = ({ onHide, onCreate }) => {
  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      password:""
    },
    validationSchema: Yup.object({
      first_name: Yup.string().required("First Name is required"),
      last_name: Yup.string().required("Last Name is required"),
      email: Yup.string().required("Email is required").email("Enter a valid email address"),
      password: Yup.string().required("Password is required")
    }),
    onSubmit: async (values) => {
      try {
        await axios.post("http://localhost:6001/api/v1/add-user", values);
        onCreate();
        onHide();
      } catch (err) {
        console.error("Create failed:", err.response?.data || err.message);
        alert(err.response?.data?.message || "Something went wrong");
      }
    },
  });

  return (
    <Box
      component="form"
      onSubmit={formik.handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
    >
      <h5 className="p-5 text-lg font-bold text-center">Create User</h5>

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
      <TextField
        label="Password"
        name="password"
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.password && Boolean(formik.errors.password)}
        helperText={formik.touched.password && formik.errors.password}
        fullWidth
      />

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
        <Button onClick={onHide}>Cancel</Button>
        <Button type="submit" variant="contained">
          Create
        </Button>
      </Box>
    </Box>
  );
};

export default CreateUser;
