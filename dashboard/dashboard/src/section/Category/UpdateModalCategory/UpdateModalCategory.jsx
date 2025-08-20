import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, TextField, Button } from "@mui/material";

const UpdateModalCategory = ({ data, onHide, onUpdate }) => {
  const [name, setName] = useState("");
  const [catImage, setCatImage] = useState(null);

  useEffect(() => {
    if (data) {
      setName(data.name || "");
    }
  }, [data]);

  const handleFileChange = (e) => {
    setCatImage(e.target.files[0]);
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      if (catImage) {
        formData.append("cat_image", catImage);
      }

      await axios.put(
        `http://localhost:6001/api/v1/update-category/${data.id}`,
        formData
      );

      onUpdate();
      onHide();
    } catch (error) {
      console.error("Failed to update category:", error);
      alert("Error updating category. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        bgcolor: (theme) =>
          theme.palette.mode === "dark" ? "#121212" : "#fff",
        color: (theme) => theme.palette.text.primary,
        p: 2,
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
        <h5 className="  text-lg font-bold text-center"> Category Edit </h5>
      <TextField
        label="Category Name"
        variant="outlined"
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <h5 className="font-bold"> Category Image : </h5>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
        <Button onClick={onHide}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Update
        </Button>
      </Box>
    </Box>
  );
};

export default UpdateModalCategory;
