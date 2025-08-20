import { Row } from "react-bootstrap";
import { IoBagHandleOutline } from "react-icons/io5";
import classes from "./Checkout.module.css"
import { Link } from "react-router-dom";

const Top=()=>{
    return(
        <>
        <div className={` ${classes.top}`}>
            <Link to='/home'>
            <p>Electech - Electronic Store</p>
        </Link>
        <Link to="/addtocart">
            <span><IoBagHandleOutline/></span>
        </Link>
        </div>
        
        </>
    )
}

export default Top;