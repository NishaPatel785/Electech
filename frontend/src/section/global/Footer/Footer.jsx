import { Col, Row } from "react-bootstrap";
import FootCommon from "../../../components/FootCommon/FootCommon";
import classes from "./footer.module.css"
import Subscribe from "./Subscribe/Subscribe";
import Image1 from "./app-store_139x.png";
import Image2 from "./google-play_139x.png";
import { IoHeadsetOutline, IoLocationOutline } from "react-icons/io5";
import { SlEnvolope } from "react-icons/sl";
import { MdOutlineHeadsetMic } from "react-icons/md";
import { FaFacebookF } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import image1 from "./download (1).svg";
import image2 from "./download (2).svg";
import image3 from "./download (3).svg";
import image5 from "./download (4).svg";
import image6 from "./download (5).svg";
import { Link } from "react-router-dom";

const Footer=()=>{
    return(
        <>
        <Row className={`g-0 ${classes.footer}`}>
        <Row className={classes.foot}>
        <Col xs={12} md={6} lg={3}>
        <FootCommon name="Our Information" />
        <div>Welcome to our store, where we pride ourselves on providing exceptional products and unparalleled customer service. Our store is a haven for those who appreciate quality, style, and innovation.</div>
        <div className={classes.image}>
            <img src={Image1} />
            <img src={Image2} />
        </div>
        
        </Col>
        <Col xs={6} md={3} lg={2}><FootCommon name="Products" />
        <ul>
             <Link to="/home"><li onClick={()=>{window.scrollTo(0,0)}}>Home</li></Link>   
             <Link to="/shop"><li onClick={()=>{window.scrollTo(0,0)}}>Shop</li></Link>   
             <Link to="/about-us" ><li onClick={()=>{window.scrollTo(0,0)}}>About us</li></Link>   
             <Link to="/contact"><li onClick={()=>{window.scrollTo(0,0)}}>Contact</li></Link>   
        </ul>
        </Col>
      <div className={classes.tabletGroup}>
          <Col  md={3} lg={2}><FootCommon name="Information" />
        <div>
            <ul>
                <li>About us</li>
                <li>FAQs</li>
                <li>Sitemap</li>
                <li>Shopping</li>
                <li>Contact us</li>
                <li>Size chart</li>
            </ul>
        </div>
        </Col>
        <Col xs={6} md={3} lg={2}><FootCommon name="Your Account" />
        <div>
            <ul>
                <li>Search</li>
                <li>Privacy Policy</li>
                <li>Refund Policy</li>
                <li>Shipping Policy</li>
                <li> Terms of Services</li>
                <li>Policy of Sellers</li>
            </ul>
        </div></Col>
        <Col xs={6} md={6} lg={3}><FootCommon name="Contact us" />
        <div className={classes.imfor}>
            <div className={classes.icon}>
            <IoLocationOutline/>
            <p> Electech-Electronic Store 507-Union Trade Ipsum Doler Center France</p>
            </div>
            <div>
            <SlEnvolope/>
            <p> hello@blocks.com</p>
            </div>
            <div>
            <IoHeadsetOutline/>
            <p> (+91) 9876-543-210</p></div>
        </div>
        </Col>
        </div>
        </Row>

         <div className={classes.footer_bottom}>

        <div className={classes.icon}>
				<div className={classes.circle}><a href="#" target="_blank"><FaFacebookF /></a></div>
				<div className={classes.circle}><a href="#" target="_blank">< FaTwitter/></a></div>
				<div className={classes.circle}><a href="#" target="_blank"><FaInstagram /></a></div>
				<div className={classes.circle}><a href="#" target="_blank"><FaYoutube /></a></div>
			</div>
             <div>© 2025, Electech - Electronics Store (Password: demo) Powered by Shopify</div>
            <div >
                
                <img src={image1} className="img-responsive" ></img>
                <img src={image2} className="img-responsive" ></img>
                <img src={image3} className="img-responsive" ></img>
                <img src={image5} className="img-responsive" ></img>
                <img src={image6} className="img-responsive" ></img>
            </div>

            </div>
        </Row>
        
        </>
    )
}

export default Footer;