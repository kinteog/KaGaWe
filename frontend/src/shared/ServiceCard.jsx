import React from 'react';
import { Card, CardBody } from 'reactstrap';
import { Link } from 'react-router-dom';
import calculateAvgRating from '../utils/avgRating'; // ✅ Import rating calculator
import "./service-card.css";
import { BASE_URL } from '../utils/config';

const ServiceCard = ({ service }) => {
  const { _id, name, estimatedDuration, priceRange, category, photo, featured, reviews = [] } = service;

  const { avgRating } = calculateAvgRating(reviews); // ✅ Calculate rating

  return (
    <div className='tour_card'>
      <Card>
        <div className="tour_img">
          <img src={`${BASE_URL}/uploads/${photo}`} alt={name} />
          {featured && <span>Featured</span>}
        </div>

        <CardBody>
        <div className="card_top d-flex align-items-center justify-content-between">
          <span className='tour_location d-flex align-items-center gap-1'>
            <i className="ri-folders-line"></i> {category}
          </span>
          <span className='tour_rating d-flex align-items-center gap-1'>
            <i className="ri-star-fill"></i>
            {reviews.length === 0 ? "Not rated" : `${avgRating} (${reviews.length})`}
          </span>
        </div>

          <h5 className="tour_title">
            <Link to={`/service/${_id}`}>{name}</Link>
          </h5>

          <p className="tour_duration"><strong>Estimated Duration:</strong> {estimatedDuration}</p>
          <h5 className="tour_price">Price: {priceRange}</h5>

          <button className="btn booking_btn">
            <Link to={`/service/${_id}`}>Book Now</Link>
          </button>
        </CardBody>
      </Card>
    </div>
  );
};

export default ServiceCard;
