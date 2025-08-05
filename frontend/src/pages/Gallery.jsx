
import React from 'react';
import { Container, Row,Col,Button } from "reactstrap";
import { Link } from "react-router-dom";
import Subtitle from "./../shared/Subtitle";
import "../styles/thank-you.css"
import Newsletter from '../shared/Newsletter';
import MasonryImagesGallery from '../components/Image-gallery/MasonryImagesGallery';

const GenGallery= () => {
  return (
    <section>
    <Container>
      <Row>
        <Col lg='12'>
          <button className='galle-ry'><Subtitle subtitle={'Gallery'}/></button>
          <h2 className="gallery_title">Check out our projects' gallery</h2>
        </Col>
        <Col lg='12'>
          <MasonryImagesGallery />    
        </Col>
      </Row>
    </Container>
    <Newsletter/>
    </section>
    
  )
};

export default GenGallery