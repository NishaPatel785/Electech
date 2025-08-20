import { useNavigate } from "react-router-dom";
import classes from "./Success.module.css"
import Button1 from "../../components/Button1/Button1";


const Success =()=>{

    const navigate=useNavigate()
    return(
        <>
        <div className={classes.main}>
            <div>Congratulation. Your order has been received.🎉 🥳</div>
            <Button1 name="Order History" onclick={()=>{navigate("/logout")}}/>
            <Button1 name="Home" onclick={()=>{navigate("/home")}}/>
            
        </div>

        </>
    )
}
export default Success;