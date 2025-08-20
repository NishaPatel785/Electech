import classes from "./Section4.module.css";
import { Row, Col } from "react-bootstrap";
import image1 from "./cms-banner-1 copy.jpg";
import image2 from "./cms-banner-2 copy.jpg";
import { GrFormNextLink } from "react-icons/gr";
import { Link } from "react-router-dom";

const Section4 = () => {
  return (
    <div className={classes.main_subbanner}>
      <Row className="g-4">
        <Col xs={12} lg={6}>
          <div
            className={classes.sub_banner}
            style={{ backgroundImage: `url(${image2})` }}
          >
            <div className={classes.desc}>
              <h1>
                Apple iPad Pro M4 <br />
                With Best Glass
              </h1>
              <h3>
                From <strong>$149.00</strong>
              </h3>
              <Link to="/shop" style={{ textDecoration: "none" }}>
                <div>
                  <span>
                    <GrFormNextLink />
                  </span>
                  <p className={classes.an}>Shop Now</p>
                </div>
              </Link>
            </div>
          </div>
        </Col>

        <Col xs={12} lg={6}>
          <div
            className={classes.sub_banner}
            style={{ backgroundImage: `url(${image1})` }}
          >
            <div className={classes.desc}>
              <h1>
                Zebronics Zeb Max <br />
                Wireless Controller
              </h1>
              <h3>
                From <strong>$88.00</strong>
              </h3>
              <Link to="/shop" style={{ textDecoration: "none" }}>
                <div>
                  <span>
                    <GrFormNextLink />
                  </span>
                  <p className={classes.an}>Shop Now</p>
                </div>
              </Link>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Section4;
