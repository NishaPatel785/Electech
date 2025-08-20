import { Row, Col } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import classes from "./Header.module.css";
import { Link, useNavigate } from "react-router-dom";
import MidHeader from "./MidHeader";
import deal from "./discount.png";
import { RiMenu2Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { categorys } from "../../action/categorysAction";
import { getProductsByCategoryOrSubcategory } from "../../action/catproductsAction";

const Header = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categorys);
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    dispatch(categorys());
      const handleResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  const navigate = useNavigate();
  const handleCategoryClick = (id) => {
    dispatch(getProductsByCategoryOrSubcategory(id));
    navigate(`/category/${id}`);
  };
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  
  return (
    <>
      <Row className={`g-0 ${classes.header1}`}>
        <Col>Tell a friend about Electech Electronics & get 30% off your next order.</Col>
        <Col className={classes.head1}>
          <div className={classes.bor}>Need Help?</div>
          <div className={classes.bor}>Gift Cards</div>
          <div className={classes.bor}>
            <select>
              <option>USD $</option>
              <option>EUR</option>
              <option>USD $</option>
            </select>
          </div>
          <select>
            <option>ENGLISH</option>
            <option>français</option>
            <option>español</option>
            <option>nederlands</option>
          </select>
        </Col>
      </Row>

      <MidHeader />

      <Navbar expand="lg" className={classes.nav}>
  <Container fluid>
    {/* BROWSE CATEGORY - FIXED on LEFT (Small Screen only) */}
    <div className={classes.browseFixed}>
      <NavDropdown
        title={
          <>
            <RiMenu2Line style={{ marginRight: "8px", fontSize: "22px" }} />
<span className={classes.browseText}>BROWSE ALL CATEGORY</span>
          </>
        }
        id="browse-category-dropdown"
        className={classes.newa}
      >
        {categories.map((category) => {
          const hasSubcategories = category.subcategories.length > 0;

          return hasSubcategories ? (
            <NavDropdown
              key={category.id}
              title={category.name}
              show={openDropdown === category.id}
              onMouseEnter={() => setOpenDropdown(category.id)}
              onMouseLeave={() => setOpenDropdown(null)}
              drop="end"
            >
              {category.subcategories.map((sub) => (
                <NavDropdown.Item
                  key={sub.id}
                  onClick={() => handleCategoryClick(sub.id)}
                >
                  {sub.name}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
          ) : (
            <NavDropdown.Item
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
            >
              {category.name}
            </NavDropdown.Item>
          );
        })}
      </NavDropdown>
    </div>

    {/* Navbar Toggler + Main Content */}
    <Navbar.Toggle aria-controls="navbarScroll" />
    <Navbar.Collapse id="navbarScroll">
      <Nav className={`m-auto my-2 my-lg-0 ${classes.anchor}`} style={{ maxHeight: "100px" }} navbarScroll>
        <Link to="/home">Home</Link>
        <Link to="/shop">Shop</Link>
        <Link to="/collections">Collections</Link>
        <Link to="/about-us">About us</Link>
        <Link to="/contact">Contact</Link>
      </Nav>

      <div className={classes.deal}>
        <img src={deal} alt="deal" />
        <span>Today's Deals</span>
      </div>
    </Navbar.Collapse>
  </Container>
</Navbar>

    </>
  );
};

export default Header;
