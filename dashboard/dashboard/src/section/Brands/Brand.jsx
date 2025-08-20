
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
} from "@mui/material";
import { IoEyeSharp } from "react-icons/io5";
import { HiPencil } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import axios from "axios";

import CreateBrand from "./CreateBrand/CreateBrand";
import UpdateBrand from "./UpdateBrand/UpdateBrand";
import BrandModal from "./BrandModal/BrandModal";


const Brands = () => {
  const [Brand, setBrand] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [refresh, setRefresh] = useState(0);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:6001/api/v1/get-brands")
      .then((res) =>{ setBrand(res.data.data),console.log(res.data.data)})
      .catch((err) => console.error(err));
    
  }, [refresh]);

  const handleDelete = (id, name) => {
    if (window.confirm(`Do you want to delete "${name}"?`)) {
      axios
        .delete(`http://localhost:6001/api/v1/delete-brand/${id}`)
        .then(() => setRefresh((prev) => prev + 1))
        .catch((err) => console.error(err));
    }
  };

  return (
    <Box sx={{ width: "100%", px: 4, py: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h4">Brand</Typography>
        <Button variant="contained"  
        onClick={() => setShowCreateModal(true)}
            onUpdate={() => setRefresh((prev) => prev + 1)}>
          Create Brand
        </Button>
      </Box>

      <Paper elevation={3} sx={{ overflowX: "auto" }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Brand Name</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Brand.map((cat) => (
              <TableRow key={cat.id}>
                <TableCell>{cat.id}</TableCell>
                <TableCell>{cat.name}</TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => {
                      setSelectedBrand(cat);
                      setShowViewModal(true);
                    }}
                  >
                    <IoEyeSharp />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => {
                      setSelectedBrand(cat);
                      setShowEditModal(true);
                    }}
                  >
                    <HiPencil />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(cat.id, cat.name)}
                  >
                    <MdDelete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* View Brand Modal */}
      <Dialog open={showViewModal} onClose={() => setShowViewModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Brand Details</DialogTitle>
        <DialogContent>
          <BrandModal
            data={selectedBrand}
            onHide={() => setShowViewModal(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Brand Modal */}
      <Dialog open={showEditModal} onClose={() => setShowEditModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Brand</DialogTitle>
        <DialogContent>
          <UpdateBrand
            data={selectedBrand}
            onHide={() => setShowEditModal(false)}
            onUpdate={() => setRefresh((prev) => prev + 1)}
          />
        </DialogContent>
      </Dialog>

      {/* Create Brand Modal */}
      <Dialog open={showCreateModal} onClose={() => setShowCreateModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Brand</DialogTitle>
        <DialogContent>
          <CreateBrand
            onHide={() => setShowCreateModal(false)}
            onCreate={() => setRefresh((prev) => prev + 1)}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Brands;

