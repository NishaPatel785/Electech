import classes from "./AboutUs.module.css"
import { Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import LinkHome from "../../components/Link/Link";
import TopButton from "../../components/TopButton/TopButton";




const Aboutus=()=>{
    return(
        <>
        <LinkHome name="About us" word="/ About Us" />
         <Row className={`g-0 ${classes.policy}`}>
            <div>
                <h2>Our company</h2>
                <p>Lorem ipsum dolor sit amet conse ctetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam. Lorem ipsum dolor sit amet conse ctetur adipisicing elit.It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
            </div>
            <div>
                <h2>Our team</h2>
                <p>Lorem set sint occaecat cupidatat non,Eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
            </div>
            <div>
                <h2>Testimonials</h2>
                <p>“Lorem ipsum dolor sit amet conse ctetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim.”</p>
                <p>“Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet conse ctetur adipisicing elit. Lorem ipsum dolor sit amet conse ctetur adipisicing elit, sed do eiusmod.”</p>
            </div>
         </Row>
         <TopButton/>
        </>
    )
}
export default Aboutus;