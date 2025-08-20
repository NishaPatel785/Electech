import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import classes from "./Subscribe.module.css"

const Subscribe = () => {
  return (
    <div>
      <footer className={classes.sub}>
        <Container className={`pt-4 pb-4 ${classes.container}`}>
          <section>
            <Form action="">
              <Row className={classes.go}>
                {/* Grid column */}
                <Col xs="auto">
                  <p className="pt-2">
                    <strong>Sign Up & Subscribe To Our Newsletter</strong>
                    <br/>
                    Subscribe to our latest newsletter to get news about special discounts and upcoming sales
                  </p>
                </Col>
                {/* Grid column */}

                {/* Grid column */}
                <Col md={5} xs={12}>
                  {/* Email input */}
                  <Form.Group>
                    <Form.Control
                      type="email"
                      id="form5Example2"
                      placeholder="Email"
                    />
                  </Form.Group>
                </Col>
                {/* Grid column */}

                {/* Grid column */}
                <Col xs="auto">
                  {/* Submit button */}
                  <Button type="submit" className={classes.button}>
                    Subscribe
                  </Button>
                </Col>
                {/* Grid column */}
              </Row>
            </Form>
          </section>
          {/* Section: Form */}
        </Container>

        {/* Copyright */}
        
      </footer>
    </div>
  );
};

export default Subscribe;
