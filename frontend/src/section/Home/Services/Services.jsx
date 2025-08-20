import { Row ,Col} from "react-bootstrap";
import service1 from "./services-1_60x.png"
import service2 from "./services-2_60x.png"
import service3 from "./services-3_60x.png"
import service4 from "./services-4_60x.png"
import service5 from "./services-5_60x.png"
import classes from "./Services.module.css"



const Services=()=>{
    const settings = {
        dots: false, 
        infinite: true, 
        speed: 1000, 
        slidesToShow: 3, 
        slidesToScroll: 1, 
        autoplay: true, 
        autoplaySpeed: 3000, 
        arrows: true, 
        responsive: [
            {
              breakpoint: 1270, 
              settings: { slidesToShow: 3, slidesToScroll: 1 },
            },
            {
              breakpoint: 990, 
              settings: { slidesToShow: 2, slidesToScroll: 1 },
            },
            {
              breakpoint: 767, 
              settings: { slidesToShow: 1 , slidesToScroll: 1 },
            },
          ],
      };
    return(
        <>
        <Row className={`${classes.service}`} xs={12} md={3} lg={4}>
            <Col className={classes.sertop}>
            <img src={service1} alt="image1" />
            <div className={classes.service_name}>
                <h1>Free Shipping</h1>
                <p>For all Orders Over $100</p>
                </div>
            </Col>
            <Col className={classes.sertop}>
            <img src={service2} alt="image2" />
            <div>
                <h1>30 Days Returns</h1>
                <p>For an Exchange Product</p>
                </div>
            </Col>
            <Col className={classes.sertop}>
            <img src={service3} alt="imag3" />
            <div>
                <h1>Secured Payment</h1>
                <p>Payment Cards Accepted </p>
                </div>
            </Col>
            <Col className={classes.sertop}>
            <img src={service4} alt="imag4" />
            <div>
                <h1>Special Gifts</h1>
                <p>Contact us Anytime</p>
                </div>
            </Col>
            <Col className={classes.sertop}>
            <img src={service5} alt="image5" />
            <div>
                <h1>Support 24/7</h1>
                <p>Contact us Anytime</p>
                </div>
            </Col>
        </Row>


        </>
    )
}

export default Services;