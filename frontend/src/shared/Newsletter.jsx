import React, { useState } from 'react';
import './newsletter.css';
import { Container, Row, Col } from 'reactstrap';
import maleTourist from '../assets/images/mechanic.png';
import { BASE_URL } from '../utils/config';

const Newsletter = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = async () => {
    if (!email) {
      alert("Please enter an email address");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/newsletter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      if (data.success) {
        alert(data.message);
        setEmail('');
      } else {
        alert(data.message || 'Subscription failed');
      }
    } catch (err) {
      console.error("Subscription error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <section className='newsletter'>
      <Container>
        <Row>
          <Col lg='6'>
            <div className="newsletter_content">
              <h2>Subscribe to our services newsletter.</h2>

              <div className="newsletter_input">
                <input
                  type="email"
                  placeholder='Enter your email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button className="btn newsletter_btn" onClick={handleSubscribe}>
                  Subscribe
                </button>
              </div>

              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odhvsvshc sshsv shfshfs dhaa dhshs ipsum</p>
            </div>
          </Col>
          <Col lg='6'>
            <div className="newsletter_img">
              <img src={maleTourist} alt="" />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Newsletter;
