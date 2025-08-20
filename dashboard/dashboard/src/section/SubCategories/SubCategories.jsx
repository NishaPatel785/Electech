

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
import SubCategoryModal from "./SubCateogoryModal/SubCategoryModal";
import UpdateSubcategory from "./UpdateSubcategory/UpdateSubcategory";
import CreateSubcategory from "./CreateSubcategory/CreateSubcategory";


const Subcategory = () => {
  const [Subcategory, setSubcategory] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [refresh, setRefresh] = useState(0);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [imagepath,setImagepath]=useState()

  useEffect(() => {
    axios
      .get("http://localhost:6001/api/v1/get-subcategorys")
      .then((res) =>{ setSubcategory(res.data.data);console.log(res.data.data);setImagepath(res.data.filepath),console.log(res.data)})
      .catch((err) => console.error(err));
    
  }, [refresh]);

  const handleDelete = (id, name) => {
    if (window.confirm(`Do you want to delete "${name}"?`)) {
      axios
        .delete(`http://localhost:6001/api/v1/delete-subcategory/${id}`)
        .then(() => setRefresh((prev) => prev + 1))
        .catch((err) => console.error(err));
    }
  };

  return (
    <Box sx={{ width: "100%", px: 4, py: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h4">Subcategory</Typography>
        <Button variant="contained"  
        onClick={() => setShowCreateModal(true)}
            // onUpdate={() => setRefresh((prev) => prev + 1)}
            >
          Create Subcategory
        </Button>
      </Box>

      <Paper elevation={3} sx={{ overflowX: "auto" }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Category Id</TableCell>
              <TableCell>Subcategory Image</TableCell>
              <TableCell>Subcategory Name</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Subcategory.map((cat) => (
              <TableRow key={cat.id}>
                <TableCell>{cat.id}</TableCell>
                <TableCell>{cat.category_id}</TableCell>
               <TableCell ><img src={`${cat.sub_image}`}  style={{height:"70px"}}/></TableCell>
                <TableCell>{cat.name}</TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => {
                      setSelectedSubcategory(cat);
                      setShowViewModal(true);
                    }}
                  >
                    <IoEyeSharp />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => {
                      setSelectedSubcategory(cat);
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

      {/* View Category Modal */}
      <Dialog open={showViewModal} onClose={() => setShowViewModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Subcategory Details</DialogTitle>
        <DialogContent>
          <SubCategoryModal
            data={selectedSubcategory}
            onHide={() => setShowViewModal(false)}
            imagepath={imagepath}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Category Modal */}
      <Dialog open={showEditModal} onClose={() => setShowEditModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Subcategory</DialogTitle>
        <DialogContent>
          <UpdateSubcategory
            data={selectedSubcategory}
            onHide={() => setShowEditModal(false)}
            onUpdate={() => setRefresh((prev) => prev + 1)}
          />
        </DialogContent>
      </Dialog>

      {/* Create Category Modal */}
      <Dialog open={showCreateModal} onClose={() => setShowCreateModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Subcategory</DialogTitle>
        <DialogContent>
          <CreateSubcategory
            onHide={() => setShowCreateModal(false)}
            onCreate={() => setRefresh((prev) => prev + 1)}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Subcategory;

