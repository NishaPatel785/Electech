import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../action/authAction";
import { Link, useNavigate } from "react-router-dom";
import { Row } from "react-bootstrap";
import { Eye, EyeOff } from "lucide-react"; // Importing eye icons
import classes from "./Login.module.css";
import Button1 from "../../components/Button1/Button1";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { error, loading } = useSelector(state => state.auth);
    const [showPassword, setShowPassword] = useState(false); // Toggle state

    // Validation Schema
    const validationSchema = Yup.object({
        email: Yup.string().email("Invalid email").required("Email is required"),
        password: Yup.string().required("Password is required"),
    });
       
    function refreshPage() {
        window.location.reload(false);
      }
    return (
        <Row className={classes.login}>
            <Formik
                initialValues={{ email: "", password: "" }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    dispatch(loginUser(values)).unwrap()
                        .then(() => {navigate("/home") ;  window.location.reload(); })
                        .catch(() => setSubmitting(false));
                }}
            >
                {({ isSubmitting }) => (
                    <>
                        <h2>Log in to your account</h2>
                        <Form>
                            {/* Email Field */}
                            <div>
                                <Field type="email" name="email" placeholder="Email" />
                                <ErrorMessage name="email" className="error" component="div" />
                            </div>

                            {/* Password Field with Eye Icon */}
                            <div className={classes.pass}>
                                <Field
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className={`absolute right-3 top-3 text-gray-500 ${classes.eye}`}
                                >
                                    {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                                </button>
                                <ErrorMessage name="password" className="error" component="div" />
                            </div>

                            {/* Error Message */}
                            {error && <p className="error">{error}</p>}

                            <Link to="/forget-pass">
                                <div className={classes.forgot}>Forgot Password?</div>
                            </Link>

                            <Button1 name="Login" type="submit" disabled={isSubmitting || loading}  />

                        </Form>
                        <Link to="/register"><div className={classes.reg}>No account yet? Create an account</div></Link>
                    </>
                )}
            </Formik>
        </Row>
    );
};

export default Login;
