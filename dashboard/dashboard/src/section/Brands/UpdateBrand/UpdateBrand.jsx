


import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, TextField, Button } from "@mui/material";

const UpdateBrand = ({ data, onHide, onUpdate }) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (data) {
      setName(data.name || "");
    }
  }, [data]);


  const handleSubmit = async () => {
    try {
      await axios.put(
        `http://localhost:6001/api/v1/update-brand/${data.id}`,
        { name } // sending JSON
      );
  
      onUpdate();
      onHide();
    } catch (error) {
      console.error("Failed to update brand:", error.response?.data || error.message);
      alert("Error updating brand. Please try again.");
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
        <h5 className="  text-lg font-bold text-center"> Brand Edit </h5>
      <TextField
        label="Category Name"
        variant="outlined"
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
        <Button onClick={onHide}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Update
        </Button>
      </Box>
    </Box>
  );
};

export default UpdateBrand;

