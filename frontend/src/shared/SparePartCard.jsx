import React from 'react';
import { Card, CardBody } from 'reactstrap';
import { Link } from 'react-router-dom';
import calculateAvgRating from '../utils/avgRating'; 
import "./service-card.css"; // or create new `spare-part-card.css`
import { BASE_URL } from '../utils/config';

const SparePartCard = ({ part }) => {
  const { _id, name, description, price, category, isFeatured, imageUrl, stockQuantity, reviews } = part;

  const { avgRating } = calculateAvgRating(reviews);
  return (
    <div className='tour_card'>
      <Card>
        <div className="tour_img">
          <img src={`${BASE_URL}/uploads/${imageUrl}`} alt="spare-part-img" />
            {isFeatured && <span>Featured</span>}
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
            <Link to={`/spare-part/${_id}`}>{name}</Link>
          </h5>

          <p>{description.slice(0, 50)}...</p>
            <span className='tour_rating d-flex align-items-center gap-1'>
              <i className="ri-database-2-line"></i>
              {stockQuantity > 0 ? `${stockQuantity} in stock` : "Out of stock"}
          </span>
          <h5 className="tour_price">Price: KES {price}</h5>

          <button className="btn booking_btn">
            <Link to={`/spare-part/${_id}`}>Order Now</Link>
          </button>
        </CardBody>
      </Card>
    </div>
  );
};

export default SparePartCard;
