import classes from "./Section3.module.css"
import {Row,Col} from "react-bootstrap"
import image1 from "./sub-banner-1.jpg"
import image2 from "./sub-banner-2.jpg"
import image3 from "./sub-banner-3.jpg"
import { GrFormNextLink } from "react-icons/gr";
import { Link } from "react-router-dom"

const Section3=()=>{
    return(
        <>
        <div className={classes.main_subbanner} xs={12} md={4}>
        <Row className="gap-4" >
            <Col  className={`${classes.sub_banner}`} style={{backgroundImage:`url(${image1})`}}>
                <div className={classes.desc}>
                    <h1>Latest Wireless<br/>Headphones</h1>
                    <h3>From <strong> $49.00</strong></h3>
                    <Link to="/shop" style={{ textDecoration: "none" }}><div><span><GrFormNextLink/></span>
                    <p className={classes.an}>Shop Now</p>
                    </div></Link>
                </div>
            </Col>
           
            <Col className={classes.sub_banner} xs={12} md={4} style={{backgroundImage:`url(${image2})`}}>
                <div className={classes.desc}>
                    <h1>Boat Wave Call<br/>Smart Watch</h1>
                    <h3>From <strong>$49.00</strong></h3>
                    <Link to="/shop" style={{ textDecoration: "none" }}><div><span><GrFormNextLink/></span>
                    <p className={classes.an}>Shop Now</p>
                    </div></Link>
                </div>
            </Col>
            <Col  className={classes.sub_banner} xs={12} md={4} style={{backgroundImage:`url(${image3})`}}>
                <div className={classes.desc}>
                    <h1>
                    Motorola G64<br/>5G 12GB</h1>
                    <h3>From <strong>$49.00</strong></h3>
                    <Link to="/shop" style={{ textDecoration: "none" }}><div><span><GrFormNextLink/></span>
                    <p className={classes.an}>Shop Now</p>
                    </div></Link>
                </div>
            </Col>
            </Row>
            </div>

        </>
    )
}

export default Section3;