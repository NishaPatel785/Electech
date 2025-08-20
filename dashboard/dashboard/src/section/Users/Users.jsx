
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

import UpdateUser from "./UpdateUser/UpdateUser";
import CreateUser from "./CreateUser/CreateUser";
import UserModal from "./UserModal/UserModal";


const Users = () => {
  const [User, setUser] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [refresh, setRefresh] = useState(0);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:6001/api/v1/get-users")
      .then((res) =>{ setUser(res.data.users),console.log(res.data.users)})
      .catch((err) => console.error(err));
    
  }, [refresh]);

  const handleDelete = (id, first_name) => {
    if (window.confirm(`Do you want to delete "${first_name}"?`)) {
      axios
        .delete(`http://localhost:6001/api/v1/delete-user/${id}`)
        .then(() => {setRefresh((prev) => prev + 1),console.log("Deleting user with ID:", id);})
        .catch((err) => console.error(err));
    }
  };

  return (
    <Box sx={{ width: "100%", px: 4, py: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h4">User</Typography>
        <Button variant="contained"  
        onClick={() => setShowCreateModal(true)}
            onUpdate={() => setRefresh((prev) => prev + 1)}>
          Create User
        </Button>
      </Box>

      <Paper elevation={3} sx={{ overflowX: "auto" }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {User.map((cat) => (
              <TableRow key={cat.id}>
                <TableCell>{cat.id}</TableCell>
                <TableCell className="capitalize">{cat.first_name}</TableCell>
                <TableCell className="capitalize">{cat.last_name}</TableCell>
                <TableCell>{cat.email}</TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => {
                      setSelectedUser(cat);
                      setShowViewModal(true);
                    }}
                  >
                    <IoEyeSharp />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => {
                      setSelectedUser(cat);
                      setShowEditModal(true);
                    }}
                  >
                    <HiPencil />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(cat.id, cat.first_name)}
                  >
                    <MdDelete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* View User Modal */}
      <Dialog open={showViewModal} onClose={() => setShowViewModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>User Details</DialogTitle>
        <DialogContent>
          <UserModal
            data={selectedUser}
            onHide={() => setShowViewModal(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={showEditModal} onClose={() => setShowEditModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <UpdateUser
            data={selectedUser}
            onHide={() => setShowEditModal(false)}
            onUpdate={() => setRefresh((prev) => prev + 1)}
          />
        </DialogContent>
      </Dialog>

      {/* Create User Modal */}
      <Dialog open={showCreateModal} onClose={() => setShowCreateModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create User</DialogTitle>
        <DialogContent>
          <CreateUser
            onHide={() => setShowCreateModal(false)}
            onCreate={() => setRefresh((prev) => prev + 1)}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Users;

