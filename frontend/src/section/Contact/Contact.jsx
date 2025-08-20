import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { addToContact } from "../action/contactAction";
import { Link, useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import classes from "./contact.module.css"
import LinkHome from "../../components/Link/Link";
import { IoIosHome } from "react-icons/io";
import { IoIosCall } from "react-icons/io";
import { TiHome, TiInfoLarge } from "react-icons/ti";
import TopButton from "../../components/TopButton/TopButton";



const Contact = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { error, loading } = useSelector(state => state.contact);

    // Validation Schema
    const validationSchema = Yup.object({
        name: Yup.string().required("First name is required"),
        email: Yup.string().required("Last name is required").email("Invalid Email"),
        phone_number: Yup.string().required("phone_Number is required"),
        comment: Yup.string().required("comment is required"),
    });
    return (
        <>
            <LinkHome name="Contact" word="/ Contact" />
            <Row className={` g-0 ${classes.contact}`}>
                <Col md={7} className={classes.login} >
                    <Formik
                        initialValues={{ email: "", comment: "", name: "", phone_number: "" }}
                        validationSchema={validationSchema}
                        onSubmit={(values, { setSubmitting }) => {
                            dispatch(addToContact(values)).unwrap()
                                .then(() => navigate("/home"))
                                .catch(() => setSubmitting(false));
                        }}
                    >
                        {({ isSubmitting }) => (
                            <>
                                <h1 className={classes.h1}>Do You Have Any Questions ?</h1>
                                <Form>
                                    {/* first Field */}
                                    <div className={classes.first}>
                                        <div style={{ flex: 1 }}>
                                            <Field type="text" name="name" placeholder="Name" />
                                            <ErrorMessage name="name" className="error" component="div" />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <Field type="email" name="email" placeholder="Email" />
                                            <ErrorMessage name="email" className="error" component="div" />
                                        </div>
                                    </div>

                                    <div>
                                        <Field type="text" name="phone_number" placeholder="Phone Number" />
                                        <ErrorMessage name="phone_number" className="error" component="div" />
                                    </div>

                                    {/* comment Field */}
                                    <div className={classes.comment}>
                                        <Field as="textarea" name="comment" placeholder="Comment" />
                                        <ErrorMessage name="comment" className="error" component="div" />
                                    </div>

                                    {/* Error Message */}
                                    {error && <p className="error">{error}</p>}


                                    {/* Submit Button */}
                                    <button type="submit" disabled={isSubmitting || loading}>
                                        {loading ? "Sending" : "Send"}
                                    </button>
                                </Form>
                            </>
                        )}
                    </Formik>
                </Col>
                <Col className={classes.login} >
                    <h1 className={classes.h1}>Get in touch with us </h1>
                    <div className={classes.add}>
                        <span><TiHome/></span>
                        <div>
                            <h2>Address:</h2>
                            <p>33 New Montgomery St.<br />
                                Ste 750 San Francisco,<br />
                                CA, USA 94105</p>
                        </div>
                    </div>
                    <div  className={classes.add}>
                        <span><IoIosCall/></span>
                        <div>
                            <h2>Contact No.:</h2>
                            <p>(+91) 9876-543-210</p>
                        </div>
                    </div>
                    <div className={classes.add}>
                        <span><TiHome/></span>
                        <div>
                            <h2>Email:</h2>
                            <p>electech@exampledemo.com</p>
                        </div>
                    </div>
                    <div className={classes.add}>
                        <span><TiInfoLarge/></span>
                        <div>
                            <h2>Store Info:</h2>
                            <p>Monday – Friday 10 AM – 8 PM</p>
                        </div>
                    </div>
                </Col>
            </Row>



            <Row className="g-0 p-4">
                <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d25235.035614920613!2d-122.43759999999999!3d37.7577!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858759c4691563%3A0x56e949612f9b2255!2sUniversity%20of%20California%20San%20Francisco%20Parnassus%20Campus!5e0!3m2!1sen!2sus!4v1743147243117!5m2!1sen!2sus" width="400" height="450" />

            </Row>
            <TopButton/>
        </>
    )
}
export default Contact;




