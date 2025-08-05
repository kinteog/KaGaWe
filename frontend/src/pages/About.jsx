
import React from 'react';
import { Container, Row,Col,Button } from "reactstrap";
import { Link } from "react-router-dom";
import Subtitle from "./../shared/Subtitle";
import "../styles/thank-you.css"
import Newsletter from '../shared/Newsletter';
import experienceImg from "../assets/images/Gallery (16).jpg"
const About= () => {
  return (
    <section>
<Container>
      <Row>
        <Col lg='6'>
          <div className="experience_content">
            <button className='exp-rience'><Subtitle subtitle={"About Us"}/></button>
            

            <h2>We will keep your car <br/>  running at its best.</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              <br />
              Quas aliquam, hic tempora inventore suscipit unde.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            
              Quas aliquam, hic tempora inventore suscipit unde.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            
              Quas aliquam, hic tempora inventore suscipit unde.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            
              Quas aliquam, hic tempora inventore suscipit unde.
            </p>
          </div>

          <div className="counter_wrapper d-flex align-items-center gap-5">
            <div className="counter_box">
              <span>12k+</span>
              <h6>Successful services</h6>
            </div>
            <div className="counter_box">
              <span>2k+</span>
              <h6>Regular clients</h6>
            </div>
            <div className="counter_box">
              <span>15</span>
              <h6>Years experience</h6>
            </div>
          </div>
        </Col>
        <Col lg='6'>
          <div className="experience_img">
            <img src={experienceImg} alt="" />
          </div>
        </Col>
      </Row>
    </Container>
    <Newsletter/>
    </section>
    
  )
};

export default About