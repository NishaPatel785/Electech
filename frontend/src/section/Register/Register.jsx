import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {signUser} from "../action/RegisterAction"
import { Link, useNavigate } from "react-router-dom";
import { Row } from "react-bootstrap";
import classes from "./Register.module.css";
import Button1 from "../../components/Button1/Button1";

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { error, loading } = useSelector(state => state.register);

    // Validation Schema
    const validationSchema = Yup.object({
        first_name :Yup.string().required("First name is required"),
        last_name:Yup.string().required("Last name is required"),
        email: Yup.string().email("Invalid email").required("Email is required"),
        password: Yup.string().required("Password is required"),
    });

    return (
        <>
            <Row className={classes.login}>
                <Formik
                    initialValues={{ email: "", password: "" ,first_name:"",last_name:""}}
                    validationSchema={validationSchema}
                    onSubmit={(values, { setSubmitting }) => {
                        dispatch(signUser(values)).unwrap()
                            .then(() => navigate("/login"))
                            .catch(() => setSubmitting(false));
                    }}
                >
                    {({ isSubmitting }) => (
                        <>
                            <h2>Create account</h2>
                            <Form>
                                {/* first Field */}
                                <div>
                                    <Field type="text" name="first_name" placeholder="First name" />
                                    <ErrorMessage name="first_name" className="error" component="div" />
                                </div>
                                {/* Email Field */}
                                <div>
                                    <Field type="text" name="last_name" placeholder="Last name" />
                                    <ErrorMessage name="last_name" className="error" component="div" />
                                </div>
                                {/* Email Field */}
                                <div>
                                    <Field type="email" name="email" placeholder="Email" />
                                    <ErrorMessage name="email" className="error" component="div" />
                                </div>

                                {/* Password Field */}
                                <div>
                                    <Field type="password" name="password" placeholder="Password" />
                                    <ErrorMessage name="password" className="error" component="div" />
                                </div>

                                {/* Error Message */}
                                {error && <p className="error">{error}</p>}


                                {/* Submit Button */}
                                <Button1 type="submit" name="Create" disabled={isSubmitting || loading}/>
                               
                            </Form>
                        </>
                    )}
                </Formik>
                <Link to="/home"><div>Return to store</div></Link>
            </Row>
        </>
    );
};

export default Register;
