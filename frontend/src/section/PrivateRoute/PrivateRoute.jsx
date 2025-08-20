import { Navigate, Outlet, useLocation } from "react-router-dom";
import Header from "../global/Header/Header.jsx"

const PrivateRoute = () => {
    const token = sessionStorage.getItem("refreshToken");
    const location = useLocation();

    // Allow home page access without login
    if (location.pathname === "/home") {
        return (
            <>
                <Header />
                <Outlet />
            </>
        );
    }

    return token ? (
        <>
            <Outlet />
        </>
    ) : (
        <Navigate to="/login" />
    );
};

export default PrivateRoute;
