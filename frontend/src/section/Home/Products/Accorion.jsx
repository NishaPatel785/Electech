import Accordion from 'react-bootstrap/Accordion';
import { FaRegHeart } from "react-icons/fa";
import { FiTruck } from "react-icons/fi";
import { IoIosApps } from "react-icons/io";
import { RiPencilRuler2Line } from "react-icons/ri";
import classes from "./Accorion.module.css"

const Accordionproduct = () => {
  return (
    <Accordion defaultActiveKey="0">
      <Accordion.Item eventKey="1">
        <Accordion.Header className={classes.title}><FiTruck/> Shipping Returns</Accordion.Header>
        <Accordion.Body>
          <p>Free shipping and returns available on all orders!</p>
          <p>We ship all US domestic orders within 5-10 business days</p>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item >
        <Accordion.Header eventKey="2" className={classes.title} > <IoIosApps/>Materials</Accordion.Header>
        <Accordion.Body>
          The item with the Committed label has a lower environmental impact because it was made with sustainable materials or methods. We are committed to creating items that combine sustainability with style. Made with recycled cashmere and industril by products.
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="3">
        <Accordion.Header className={classes.title}><RiPencilRuler2Line/> Size Charts</Accordion.Header>
        <Accordion.Body>
          <p>Finding the perfect fit is essential for a comfortable and flattering wardrobe. To assist you in selecting the right size, we've compiled comprehensive size guides for both men's and women's clothing. Please refer to the following information to ensure a perfect fit every time</p>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="4">
        <Accordion.Header className={classes.title}> <FaRegHeart/>Care Instructions</Accordion.Header>
        <Accordion.Body>
          <p>We advise routinely dusting your items with a gentle cleanser to preserve its look. Periodically, it may need to be softly wet with a mild detergent solution.</p>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}

export default Accordionproduct;