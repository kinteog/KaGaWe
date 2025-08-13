import React from 'react';
import { Card, CardBody } from 'reactstrap';
import { Link } from 'react-router-dom';
import calculateAvgRating from '../utils/avgRating';
import './service-card.css'; // or use ecu-file-card.css if preferred
import { BASE_URL } from '../utils/config';

const ECUFileCard = ({ file }) => {
  const {
    imageUrl,
    _id,
    title,
    vehicleMake,
    vehicleModel,
    vehicleYear,
    engineCode,
    ecuBrand,
    ecuVersion,
    tuningStage,
    category,
    price,
    isFeatured,
    status,
    reviews = []
  } = file;

  const { avgRating } = calculateAvgRating(reviews);

  return (
    <div className='tour_card'>
      <Card>
        <div className="tour_img ecu_card_img">
          <img src={`${BASE_URL}/uploads/${imageUrl}`}  alt="ECU-file-img" />
          {isFeatured && <span>Featured</span>}
        </div>

        <CardBody>
          <div className="card_top d-flex align-items-center justify-content-between">
            <span className='tour_location d-flex align-items-center gap-1'>
              <i className="ri-trophy-line"></i> {tuningStage} | {category}
            </span>
            <span className='tour_rating d-flex align-items-center gap-1'>
              <i className="ri-star-fill"></i>
              {reviews.length === 0 ? "Not rated" : `${avgRating} (${reviews.length})`}
            </span>
          </div>

          <h5 className="tour_title">
            <Link to={`/ecu-file/${_id}`}>{title} {engineCode}</Link>
          </h5>
                      

          <div className="d-flex justify-content-between mt-2 mb-2">
            <span><i className="ri-cpu-line"></i> {ecuBrand} {ecuVersion}</span>
          </div>

          <h6><i className="ri-car-line"></i> {vehicleMake} {vehicleModel} {vehicleYear}</h6>

          <span className="d-block mb-2">
            <i className="ri-check-line"></i> {status === 'available' ? 'Available' : 'Unavailable'}
          </span>         

          <h5 className="tour_price">Price: KES {price}</h5>

          <button className="btn booking_btn">
            <Link to={`/ecu-file/${_id}`}>Get ECU File</Link>
          </button>
        </CardBody>
      </Card>
    </div>
  );
};

export default ECUFileCard;
