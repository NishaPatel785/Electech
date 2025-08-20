import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const token = sessionStorage.getItem("refreshToken");

  useEffect(() => {
    axios
      .get("http://localhost:6001/api/v1/all-user-orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) =>{ setOrders(res.data.orders)})
      .catch((err) => console.error(err));
  }, [refresh]);

  const handleStatusChange = (order_item_id, newStatus) => {
    axios
      .put(
        "http://localhost:6001/api/v1/update-status",
        { order_id:order_item_id, product_status: newStatus },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
      )
        .then(() => setRefresh((prev) => prev + 1))
      .catch((err) => console.error("Error updating status:", err));
  };

  return (
    <Box sx={{ width: "100%", px: 4, py: 3 }}>
      <Paper elevation={3} sx={{ overflowX: "auto" }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Order Status</TableCell>
              <TableCell>Product Status</TableCell>
              <TableCell>Update Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.order_id}>
                <TableCell>{order.order_id}</TableCell>

                <TableCell>
                  {order.items?.map((item, i) => (
                    <div key={i}>{item.product_name}</div>
                  )) || "-"}
                </TableCell>

                <TableCell>
                  {order.items?.map((item, i) => (
                    <div key={i}>{item.price}</div>
                  )) || "-"}
                </TableCell>

                <TableCell>
                  {order.items?.map((item, i) => (
                    <div key={i}>{item.quantity}</div>
                  )) || "-"}
                </TableCell>

                <TableCell>{order.total_amount}</TableCell>

                <TableCell>
                  <div>{order.status}</div>
                  
                </TableCell>
                <TableCell>
                  <div>{order.product_status}</div>
                  
                </TableCell>

                <TableCell>
                  
                    <select
  value={order.product_status}
  onChange={(e) =>
    handleStatusChange(order.order_id, e.target.value)
    
  }
  style={{
    marginBottom: "8px",
    display: "block",
    padding: "4px",
  }}
>
  {order.product_status === "" && (
    <option value="">Select</option>
  )}
  <option value="Pending">Pending</option>
  <option value="Processing">Processing</option>
  <option value="Shipped">Shipped</option>
  <option value="Delivered">Delivered</option>
  <option value="Cancelled">Cancelled</option>
</select>
                  
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default Orders;
