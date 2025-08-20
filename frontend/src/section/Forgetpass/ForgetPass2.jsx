
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { otpVerify } from "../action/forgetPassAction";
import { Link, useNavigate } from "react-router-dom";
import { Row } from "react-bootstrap";
import classes from "./ForgetPass.module.css"
import Button1 from "../../components/Button1/Button1";

const ForgetPass2 = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { error, loading } = useSelector(state => state.otp);

    // Validation Schema
    const validationSchema = Yup.object({
        email: Yup.string().email("Invalid email").required("Email is required"),
        otp:Yup.string().required("otp is required")
    });

    return (
        <>
            <Row className={classes.login}>
                <Formik
                    initialValues={{ email: "",otp:""}}
                    validationSchema={validationSchema}
                    onSubmit={(values, { setSubmitting }) => {
                        dispatch(otpVerify(values)).unwrap()
                            .then(() =>{ navigate("/home"),window.location.reload(); })
                            .catch(() => setSubmitting(false));
                    }}
                >
                    {({ isSubmitting }) => (
                        <>
                            <h2>Email for OTP</h2>
                            <p>We will send you an otp to login</p>
                            <Form>
                               
                                {/* Email Field */}
                                <div>
                                    <Field type="email" name="email" placeholder="Email" />
                                    <ErrorMessage name="email" className="error" component="div" />
                                </div>
                                <div>
                                    <Field type="text" name="otp" placeholder="otp" />
                                    <ErrorMessage name="otp" className="error" component="div" />
                                </div>

                                

                                {/* Error Message */}
                                {error && <p className="error">{error}</p>}


                                {/* Submit Button */}
                                <Button1 name="Login"  disabled={isSubmitting || loading} />
                                {/* <button type="submit" >
                                    {loading ? "logging in" : "login"}
                                </button> */}
                            </Form>
                        </>
                    )}
                </Formik>
            </Row>
        </>
    );
};

export default ForgetPass2;
