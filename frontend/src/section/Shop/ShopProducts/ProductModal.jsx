import React from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";
import Rating from "../../../components/Rating/Rating";
import classes from "./ProductModal.module.css";
import Button1 from "../../../components/Button1/Button1";
import { useNavigate } from "react-router-dom";

const ProductModal = ({ show, onHide, product }) => {
    if (!product) return null;
    const navigate=useNavigate()

    const variant = product.variants?.[0] || {};
    const price = variant.price || product.price;
    const cutPrice = variant.cut_price || product.cut_price;
    const stock = variant.stock || product.stock || 0;

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>{product.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col md={6}>
                        <img
                            src={`http://localhost:6001/node-files/products/${product.thumbnail}`}
                            alt={product.name}
                            className="img-fluid"
                        />
                    </Col>
                    <Col md={6}>
                        <p><span className={classes.bold}>SKU:</span> {product.sku}</p>

                        <Rating rating={product.rating} />

                        <p>
                            {cutPrice && (
                                <span className={classes.cut}>${cutPrice}</span>
                            )}{" "}
                            {price && (
                                <strong>${price}</strong>
                            )}
                        </p>

                        <p><span className={classes.bold}>Availability:</span> {stock} (Low Stock)</p>
                        <p>
                            Category: {product.category_name || product.subcategory_name || "N/A"}
                        </p>
                        <p><span className={classes.bold}>Vendor:</span> {product.brand_name}</p>
                        <Button1 name="View in Details" onclick={()=>navigate(`/products/${product.id}`)} />
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ProductModal;
