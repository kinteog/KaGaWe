import React from 'react'
import "../styles/home.css"

import { Container, Row,Col } from 'reactstrap';
import heroImg from "../assets/images/hi1.jpg"
import heroImg02 from "../assets/images/hi2.jpg"
import heroVideo from "../assets/images/hv1 (5).mp4"
import worldImg from "../assets/images/world.png"
import experienceImg from "../assets/images/experience.png"

import Subtitle from "./../shared/Subtitle";

import SearchBar from "../shared/ServiceSearchBar";
import ServiceList from "../services/ServiceList";
import FeaturedTourList from '../components/Featured-tours/FeaturedServiceList';
import MasonryImagesGallery from '../components/Image-gallery/MasonryImagesGallery';
import Testimonials from '../components/Testimonial/Testimonials';
import Newsletter from '../shared/Newsletter';


const Home = () => {
  return (<>

  {/* ############ hero section start ########## */}
  <section>
    <Container>
      <Row>
        <Col lg='6'>
          <div className="hero_content">
            <div className="hero_subtitle d-flex align-items-center">
              <button className='know-before'><Subtitle subtitle={'Your Car, Our Care.'} /></button>
              <img src={worldImg} alt="" />
            </div>
            <h1>
              From Tuneups To Overhauls{" "} 
              <span className="highlight">- We Do It All!</span>
            </h1>
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Praesentium quidem quam nostrum voluptas voluptatum dolorum expedita, error odit ipsum exercitationem perspiciatis quasi nam eaque, libero aspernatur aliquam illo molestias? Perferendis!
            </p>
          </div>
        </Col>

        <Col lg='2'>
          <div className="hero_img-box">
            <img src={heroImg} alt="" />
          </div>
        </Col>
        <Col lg='2'>
          <div className="hero_img-box hero__video-box mt-4">
            <video src={heroVideo} alt="" controls/>
          </div>
        </Col>
        <Col lg='2'>
          <div className="hero_img-box mt-5">
            <img src={heroImg02} alt="" />
          </div>
        </Col>

        <SearchBar />
      </Row>
    </Container>
  </section>
   {/* ############ hero section start ########## */}
   <section>
    <Container>
      <Row>
        <Col lg='3'>
          <h5 className="services_subtitle">What we offer</h5>
          <h2 className="services_title">Driven to keep you moving</h2>
        </Col>
        <ServiceList />
      </Row>
    </Container>
   </section>


   {/* ============ featured tour section start ============*/}
   <section>
    <Container>
      <Row>
        <Col lg='12' className="mb-5">
          <button className='exp-lore'><Subtitle subtitle={'Services'} /></button>
          <h2 className="featured_tour-title">Our featured Services</h2>
        </Col>
        <FeaturedTourList />
      </Row>
    </Container>
   </section>
   {/* ============ featured tour section end ============*/}

   {/* ============= experience section start =========== */}
   <section>
    <Container>
      <Row>
        <Col lg='6'>
          <div className="experience_content">
            <button className='exp-rience'><Subtitle subtitle={"Experience"}/></button>
            

            <h2>We will keep your car <br/>  running at its best.</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              <br />
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
   </section>
   {/* ============= experience section end =========== */}

   {/* ============ gallery section start =========== */}
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
   </section>
   {/* ============ gallery section end =========== */}

   {/* ============= testimonial section start ========= */}
   <section>
    <Container>
      <Row>
        <Col lg='12'>
         <button className='fans-love'><Subtitle subtitle={'Customer Reviews'} /></button>
         <h2 className="testimonial_title">What our customers say about us</h2>
        </Col>
        <Col lg='12'>
          <Testimonials />
        </Col>
      </Row>
    </Container>
   </section>
   {/* ============= testimonial section end ========= */}
   <Newsletter/>
  </>
  );
};

export default Home