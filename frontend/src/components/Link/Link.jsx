import {Row,Col} from "react-bootstrap";
import { Link } from "react-router-dom";
import classes from "./Link.module.css"


const LinkHome=({name,word})=>{
    return(
        <>
            <Row className={`g-0 ${classes.content}`}>
                <Col className={classes.con}>
                <h1>{name}</h1>

                <div>
               <Link to="/home">Home </Link>
               {word}
                </div>
                </Col>
            </Row>


        </>
    )
}

export default LinkHome ;