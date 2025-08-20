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
import CreateCategory from "./CreateCategory/CreateCategory";
import UpdateModalCategory from "./UpdateModalCategory/UpdateModalCategory";
import CategoryModal from "./CategoryModal/CategoryModal";

const Category = () => {
  const [Category, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [refresh, setRefresh] = useState(0);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [imagepath,setImagepath]=useState()

  useEffect(() => {
    axios
      .get("http://localhost:6001/api/v1/get-categorys")
      .then((res) =>{ setCategory(res.data.categories);setImagepath(res.data.filepath),console.log(res.data)})
      .catch((err) => console.error(err));
    
  }, [refresh]);

  const handleDelete = (id, name) => {
    if (window.confirm(`Do you want to delete "${name}"?`)) {
      axios
        .delete(`http://localhost:6001/api/v1/delete-category/${id}`)
        .then(() => setRefresh((prev) => prev + 1))
        .catch((err) => console.error(err));
    }
  };

  return (
    <Box sx={{ width: "100%", px: 4, py: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h4">Category</Typography>
        <Button variant="contained"  
        onClick={() => setShowCreateModal(true)}
            onUpdate={() => setRefresh((prev) => prev + 1)}>
          Create Category
        </Button>
      </Box>

      <Paper elevation={3} sx={{ overflowX: "auto" }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Category Image</TableCell>
              <TableCell>Category Name</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Category.map((cat) => (
              <TableRow key={cat.id}>
                <TableCell>{cat.id}</TableCell>
               <TableCell ><img src={`${imagepath}${cat.cat_image}`}  style={{height:"70px"}}/></TableCell>
                <TableCell>{cat.name}</TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => {
                      setSelectedCategory(cat);
                      setShowViewModal(true);
                    }}
                  >
                    <IoEyeSharp />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => {
                      setSelectedCategory(cat);
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
        <DialogTitle>Category Details</DialogTitle>
        <DialogContent>
          <CategoryModal
            data={selectedCategory}
            onHide={() => setShowViewModal(false)}
            imagepath={imagepath}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Category Modal */}
      <Dialog open={showEditModal} onClose={() => setShowEditModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Category</DialogTitle>
        <DialogContent>
          <UpdateModalCategory
            data={selectedCategory}
            onHide={() => setShowEditModal(false)}
            onUpdate={() => setRefresh((prev) => prev + 1)}
          />
        </DialogContent>
      </Dialog>

      {/* Create Category Modal */}
      <Dialog open={showCreateModal} onClose={() => setShowCreateModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Category</DialogTitle>
        <DialogContent>
          <CreateCategory
            onHide={() => setShowCreateModal(false)}
            onCreate={() => setRefresh((prev) => prev + 1)}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Category;
