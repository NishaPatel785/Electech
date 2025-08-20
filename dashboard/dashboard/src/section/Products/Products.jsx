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
  TextField,
} from "@mui/material";
import { IoEyeSharp } from "react-icons/io5";
import { HiPencil } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import UpdateProductModal from "./UpdateModal/UpdateModal";
import ProductModal from "./ProductModal/ProductModal";
import CreateProduct from "./CreateProduct/CreateProduct";

const Product = ({ onHide, onCreate }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = () => {
    axios
      .post("http://localhost:6001/api/v1/add-product", { name, price })
      .then(() => {
        onCreate();
        onHide();
      })
      .catch((err) => console.error(err));
  };

  return (
    <Box
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
      <Typography variant="h6">Create New Product</Typography>
      <TextField
        label="Product Name"
        variant="outlined"
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <TextField
        label="Price"
        variant="outlined"
        type="number"
        fullWidth
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
        <Button onClick={onHide}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Create
        </Button>
      </Box>
    </Box>
  );
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [showData, setShowData] = useState(null);
  const [updateCount, setUpdateCount] = useState(0);
  const [modalShow, setModalShow] = useState(false);
  const [viewShow, setViewShow] = useState(false);
  const [createShow, setCreateShow] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:6001/api/v1/get-products")
      .then((res) => {setProducts(res.data.products)})
      .catch((err) => console.error(err));
  }, [updateCount]);

  const handleDelete = (id, name) => {
    if (window.confirm(`Do you want to delete ${name}?`)) {
      axios
        .delete(`http://localhost:6001/api/v1/delete-product/${id}`)
        .then(() => setUpdateCount((prev) => prev + 1))
        .catch((err) => console.error(err));
    }
  };

  return (
    <Box sx={{ width: "100%", px: 4, py: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h4">Products</Typography>
        <Button variant="contained" onClick={() => setCreateShow(true)}>
          Create Product
        </Button>
      </Box>

      <Paper elevation={3} sx={{ overflowX: "auto" }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Thumbnail</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.id}</TableCell>
                <TableCell ><img src={`http://localhost:6001/node-files/products/${p.thumbnail}`}  style={{height:"70px"}}/></TableCell>
                
                <TableCell>{p.name}</TableCell>
                <TableCell>${p.price}</TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => {
                      setShowData(p);
                      setViewShow(true);
                    }}
                  >
                    <IoEyeSharp />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => {
                      setShowData(p);
                      setModalShow(true);
                    }}
                  >
                    <HiPencil />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(p.id, p.name)}
                  >
                    <MdDelete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* View Modal */}
      <Dialog open={viewShow} onClose={() => setViewShow(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Product Details</DialogTitle>
        <DialogContent>
          <ProductModal show={viewShow} onHide={() => setViewShow(false)} data={showData} />
        </DialogContent>
      </Dialog>

      {/* Update Modal */}
      <Dialog open={modalShow} onClose={() => setModalShow(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <UpdateProductModal
            show={modalShow}
            onHide={() => setModalShow(false)}
            data={showData}
            onUpdate={() => setUpdateCount((prev) => prev + 1)}
          />
        </DialogContent>
      </Dialog>

      {/* Create Modal */}
      <Dialog open={createShow} onClose={() => setCreateShow(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Product</DialogTitle>
        <DialogContent>
          <CreateProduct
            onHide={() => setCreateShow(false)}
            onCreate={() => setUpdateCount((prev) => prev + 1)}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Products;
