import LinkHome from "../../components/Link/Link";
import { logout } from "../Store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Card, Badge, Button } from "react-bootstrap";
import { FaRegUser } from "react-icons/fa";
import classes from "./AccountWelcome.module.css";
import { useEffect } from "react";
import { order } from "../action/orderAction";
import Loading from "../../components/Loading/Loading"
import { useNavigate } from "react-router-dom";

const AccountWelcome = () => {
  const navigate=useNavigate()
  const dispatch = useDispatch();
  const { isLogged, user } = useSelector((state) => state.auth);
  const { items: orders, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    if (isLogged) {
      dispatch(order());
    }
  }, [dispatch, isLogged]);

  return (
    <>
      <LinkHome name="Account" />

      <Row className={`g-0 m-5 ${classes.logout}`}>
        <Row className={`g-0 ${classes.account}`}>
          <h1>Account</h1>
          <p  onClick={() =>{ dispatch(logout()),navigate("/home"),window.location.reload()}}>
            <FaRegUser /> Log out
          </p>
        </Row>
        <Row className={`g-0`}>
          <Col>
            <h2 className="mb-4 text-center">Order History</h2>
          </Col>
        </Row>
      </Row>

      {isLogged && (
        <div className="text-center mb-5">
          <h3>Welcome, {user.first_name} {user.last_name}</h3>
        </div>
      )}

      {/* Order Rendering */}
      <div className="m-5">
        {loading ? (
          <Loading/>
        ) : error ? (
          <p style={{ color: "red" }}>Error: {error}</p>
        ) : orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          orders.map((order) => (
            <Card key={order.order_id} className="mb-4 shadow-sm border-0">
              <Card.Body>
                <Card.Title className="mb-3">Order #{order.order_id}</Card.Title>
                <Row>
                  <Col md={6}>
                    <p><strong>Total:</strong> ${order.total_amount}</p>
                    <p><strong>Address:</strong> {order.address}</p>
                    <p><strong>Ordered on:</strong> {new Date(order.created_at).toLocaleString()}</p>
                      <p><strong>Status:</strong>
                      <Badge bg={order.payment_status === "paid" ? "success" : "warning"} className="ms-2">
                        {order.payment_status}
                      </Badge>
                    </p>
                        <p>
                          <strong>Product Status:</strong>{" "}
                          <Badge bg={
                            order.product_status === "delivered"
                              ? "success"
                              : order.product_status === "shipped"
                              ? "info"
                              : "secondary"
                          }>
                            {order.product_status}
                          </Badge>
                        </p>
                        <p>
                          <strong>Status Updated:</strong>{" "}
                          {new Date(order.product_status_updated).toLocaleString()}
                        </p>
                  </Col>
                </Row>

                <hr />
                <h6>Items:</h6>
                <Row>
                  {order.items.map((item, index) => (
                    <Col md={6} key={index} className="mb-3">
                      <Card className="p-3 border-0 shadow-sm h-100">
                        <h6>{item.product_name}</h6>
                        <p><strong>Price:</strong> ${item.price}</p>
                        <p><strong>Quantity:</strong> {item.quantity}</p>
                        <p><strong>RAM:</strong> {item.ram}</p>
                        {item.size && <p><strong>Size:</strong> {item.size}</p>}
                        <p className="d-flex align-items-center mb-2">
                          <strong>Color:</strong>
                          <span
                            className="ms-2"
                            style={{
                              width: "20px",
                              height: "20px",
                              borderRadius: "50%",
                              backgroundColor: item.variant_code,
                              border: "1px solid #ccc",
                              display: "inline-block",
                            }}
                            title={item.color_name}
                          ></span>
                          <span className="ms-2">{item.color_name}</span>
                        </p>
                       
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
          ))
        )}
      </div>
    </>
  );
};

export default AccountWelcome;
