import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToReview, getReview } from "../action/reviewAction";
import { Modal, Button, Form } from "react-bootstrap";
import { FaStar } from "react-icons/fa"; // ⭐ Using react-icons for star icons
import Rating from "../../components/Rating/Rating";
import classes from "./Review.module.css"
import Button1 from "../../components/Button1/Button1";

const RatingAndReview = ({ product_id }) => {
  const dispatch = useDispatch();
  const { review: reviews } = useSelector((state) => state.review);

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [comment, setComment] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(getReview(product_id));
  }, [dispatch, product_id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const reviewData = {
      product_id,
      rating,
      comment,
    };

    dispatch(addToReview(reviewData)).then(() => {
      setShowModal(true);
      setComment("");
      setRating(5);
      dispatch(getReview(product_id));
    });
  };

  return (
    <div className={`${classes.main} p-3 border rounded mt-4`}>

      {/* Add Review Form */}
      <div>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label className={classes.customer}>Add Review :-</Form.Label>
          <div className={`${classes.star} d-flex gap-2 mb-2`}>
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                size={40}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(null)}
                color={star <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                style={{ cursor: "pointer" }}
              />
            ))}
          </div>
        </Form.Group>

        <Form.Group className="mt-2">
          <Form.Label>Comment</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
        </Form.Group>

       
        <Button1 name="Submit" type="submit"  />
      </Form>

      {/* Success Modal */}
      <Modal className={classes.modal} show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Review Submitted</Modal.Title>
        </Modal.Header>
        <Modal.Body>Thank you for your feedback!</Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
            </div>
                <div>
          
                <h4 className={classes.customer}>Reviews ({reviews.length})</h4>
          
                {/* Show Reviews */}
                {reviews && reviews.length > 0 ? (
                  reviews.map((rev, idx) => (
                    <div key={idx} className={classes.rate}>
          
                      <div className={classes.flez1}>
                      <div className={classes.short}>
                      {rev.user_name[0]} {rev.last_name[0]}
                      </div>
                      <span className={classes.name}>{rev.user_name} {rev.last_name}</span>
                      </div>
          
          
                      <div className={classes.flez}><Rating rating={rev.rating} /> <p>{rev.created_at}</p></div>
                      <p>"{rev.comment}."</p>
                      
                    </div>
                  ))
                ) : (
                  <p>No reviews yet.</p>
                )}
                </div>
          
                <hr />
    </div>
  );
};

export default RatingAndReview;
