import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearCheckout, getCheckout } from "../action/checkoutAction";
import { createRazorpayOrder, verifyRazorpayPayment } from "../action/PaymentAction";
import { Row, Col, Form, Button } from "react-bootstrap";
import { FaCreditCard, FaTruck, FaEnvelope } from "react-icons/fa";
import { Formik, Field, ErrorMessage, Form as FormikForm } from "formik";
import * as Yup from "yup";
import "bootstrap/dist/css/bootstrap.min.css";
import classes from "./Checkout.module.css";
import Top from "./Top";
import { Badge } from "@mui/material";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
    const navigate=useNavigate()
    const dispatch = useDispatch();
    const [filepath, Setfilepath] = useState("");
    const location = useLocation();
    const [email,setEmail]=useState("")
    const fromCart = location.state?.fromCart ?? true;
    const { checkout = [] } = useSelector((state) => state.checkout);

    useEffect(() => {
        const user = sessionStorage.getItem('user');
        if (user) {
            const parsedUser = JSON.parse(user);
            setEmail(parsedUser.email);
        } else {
            console.log("No user data found in sessionStorage.");
        }
    }, []);
    

    useEffect(() => {
        Setfilepath("http://localhost:6001/node-files/products/");
        dispatch(getCheckout(fromCart));
    }, [dispatch, fromCart]);

    const initialValues = {
        email:email || "",
        name: "",
        address: "",
        city: "",
        postalCode: "",
    };

    const validationSchema = Yup.object({
        email: Yup.string().email("Invalid email").required("Required"),
        name: Yup.string().required("Required"),
        address: Yup.string().required("Required"),
        city: Yup.string().required("Required"),
        postalCode: Yup.string().required("Required"),
    });

    const handleRazorpayPayment = async (values) => {
        try {
          const res = await dispatch(createRazorpayOrder(fromCart)).unwrap();
      
          const options = {
            key: "rzp_test_9Aw8pxp9koOf1U", 
            amount: res.order.amount,
            currency: "INR",
            name: "Electech Store",
            order_id: res.order.id,
            handler: async function (response) {
                console.log("response:",response)
                console.log("amount:",res.order.amount)
                console.log("from_cart:",fromCart)
                console.log("deliveryInfo:",values)
                const payload = {
                    response,
                    amount: res.order.amount,  // Ensure this is correctly passed
                    from_cart: fromCart,
                    deliveryInfo: values,
              };
      
              try {
                const verifyRes = await dispatch(verifyRazorpayPayment(payload)).unwrap();
                console.log("Payment Verified:", verifyRes);
                alert("✅ Payment Successful!");
                navigate("/success");
              } catch (err) {
                console.error("Payment Verification Error:", err);
                alert("❌ Payment failed or cancelled.");
              }
            },
            prefill: {
              name: values.name,
              email: values.email,
              contact: "9999999999",
            },
            theme: { color: "#3399cc" },
          };
      
          const rzp = new window.Razorpay(options);
          rzp.open();
        } catch (err) {
          alert("❌ Payment failed or cancelled.");
          console.error("Error in Razorpay payment:", err);
        }
      };
      
    

    return (
        <>
            <Top />
            <Row className={`g-0 ${classes.checkoutRow}`}>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={async (values, { setSubmitting, resetForm }) => {
                        await handleRazorpayPayment(values);
                        setSubmitting(false);
                        resetForm(); // Optional
                    }}
                >
                    {({ touched, errors, isSubmitting, values }) => (
                        <FormikForm>
                            <Row className="g-0">
                                {/* Left Section */}
                                <Col md={7} className={classes.col}>
                                    {/* Contact */}
                                    <div className={`${classes.sectionCard} p-3`}>
                                        <h4 className={classes.sectionTitle}>
                                            <FaEnvelope className="me-2" /> Contact
                                        </h4>
                                        <Form.Group controlId="email">
                                            <Field
                                                name="email"
                                                type="email"
                                                placeholder="Email or phone number"
                                                className={`form-control ${touched.email && errors.email ? 'is-invalid' : ''} ${classes.inputField}`}
                                            />
                                            <ErrorMessage name="email" component="div" className="invalid-feedback" />
                                        </Form.Group>
                                    </div>

                                    {/* Delivery */}
                                    <div className={`${classes.sectionCard} p-3 mt-3`}>
                                        <h4 className={classes.sectionTitle}>
                                            <FaTruck className="me-2" /> Delivery
                                        </h4>

                                        <Form.Group controlId="name">
                                            <Field
                                                name="name"
                                                type="text"
                                                placeholder="Full Name"
                                                className={`form-control ${touched.name && errors.name ? 'is-invalid' : ''} ${classes.inputField}`}
                                            />
                                            <ErrorMessage name="name" component="div" className="invalid-feedback" />
                                        </Form.Group>

                                        <Form.Group controlId="address" className="mt-2">
                                            <Field
                                                name="address"
                                                type="text"
                                                placeholder="Address"
                                                className={`form-control ${touched.address && errors.address ? 'is-invalid' : ''} ${classes.inputField}`}
                                            />
                                            <ErrorMessage name="address" component="div" className="invalid-feedback" />
                                        </Form.Group>

                                        <Row className="mt-2">
                                            <Col>
                                                <Field
                                                    name="city"
                                                    type="text"
                                                    placeholder="City"
                                                    className={`form-control ${touched.city && errors.city ? 'is-invalid' : ''} ${classes.inputField}`}
                                                />
                                                <ErrorMessage name="city" component="div" className="invalid-feedback" />
                                            </Col>
                                            <Col>
                                                <Field
                                                    name="postalCode"
                                                    type="text"
                                                    placeholder="Postal Code"
                                                    className={`form-control ${touched.postalCode && errors.postalCode ? 'is-invalid' : ''} ${classes.inputField}`}
                                                />
                                                <ErrorMessage name="postalCode" component="div" className="invalid-feedback" />
                                            </Col>
                                        </Row>
                                    </div>

                                    {/* Pay Now */}
                                    <Button
                                        type="submit"
                                        
                                        className={`${classes.payButton} mt-4 w-100`}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? "Processing..." : "Pay Now"}
                                    </Button>
                                </Col>

                                {/* Right Section - Order Summary */}
                                <Col md={5} className={`${classes.sectionCard2} p-3`}>
                                    <div>
                                        <h4 className={classes.sectionTitle}>Order Summary</h4>
                                        {checkout?.products?.map((data) => (
                                            <div key={data.id} className={`mb-3 border-bottom pb-2 ${classes.product_details}`}>
                                                <div>
                                                    <Badge className={classes.badge} badgeContent={data.quantity} color="primary">
                                                        <img src={`${filepath}${data.image}`} alt={data.product_name} height="80px" />
                                                    </Badge>
                                                </div>
                                                <div>
                                                    <h5 className={classes.productName}>{data.product_name}</h5>
                                                    <p className={classes.productPrice}>Price: ${data.price}</p>
                                                    <p className={classes.productPrice}>{data.ram} / {data.color_name}</p>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Optional: Show delivery preview */}
                                        {values.name && (
                                            <div className="mt-3">
                                                <h5 className={classes.sectionTitle}>Delivery Info</h5>
                                                <p><strong>Name:</strong> {values.name}</p>
                                                <p><strong>Email:</strong> {values.email}</p>
                                                <p><strong>Address:</strong> {values.address}, {values.city} - {values.postalCode}</p>
                                            </div>
                                        )}

                                        <p className="mt-2">Shipping: Enter shipping address</p>
                                        <h5 className={`${classes.totalAmount} mt-3`}>
                                            Subtotal: ${checkout?.total_amount || 0}
                                        </h5>
                                    </div>

                                    <Button
                                        className={`${classes.cancelButton} mt-2 w-100`}
                                        onClick={() =>{ dispatch(clearCheckout()),navigate("/home")}}
                                    >
                                        Cancel
                                    </Button>
                                </Col>
                            </Row>
                        </FormikForm>
                    )}
                </Formik>
            </Row>
        </>
    );
};

export default Checkout;
