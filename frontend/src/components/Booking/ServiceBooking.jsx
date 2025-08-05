import React, { useState, useContext, useEffect } from 'react';
import "./booking.css";
import { Form, FormGroup, ListGroup, ListGroupItem, Button } from "reactstrap";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { BASE_URL } from '../../utils/config';

export const Booking = ({ service }) => {
  const { _id: serviceId, priceRange, reviews, name } = service;
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [credentials, setCredentials] = useState({
    serviceId: '',
    priceRange: '',
    fullName: '',
    phone: '',
    email: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    serviceName: name || '',
    bookedDate: '',
    specialRequests: '',
    paymentMethod: ''
  });

  // Auto-fill name, email, serviceId, and priceRange
  useEffect(() => {
    if (user) {
      setCredentials(prev => ({
        ...prev,
        fullName: user.username || '',
        email: user.email || '',
        serviceId: serviceId || '',
        priceRange: priceRange || '',
        phone: user.phone || '',
      }));
    }
  }, [user, serviceId, priceRange]);

  const handleChange = e => {
    setCredentials(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  // Rating logic
  const totalRating = reviews?.reduce((acc, review) => acc + review.rating, 0) || 0;
  const avgRating = reviews?.length ? (totalRating / reviews.length).toFixed(1) : 0;

  const handleClick = async e => {
    e.preventDefault();

    if (!user) {
      return alert("Please sign in to book this service.");
    }

    try {
      const res = await fetch(`${BASE_URL}/servicebooking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(credentials)
      });

      const result = await res.json();

      if (!res.ok) {
        return alert(result.message || "Failed to book service.");
      }

      alert(result.message);
      navigate("/services-thank-you");
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="booking">
      <div className="booking_top d-flex align-items-center justify-content-between">
        <h4>Price: {priceRange}</h4>
        <span className="service_rating d-flex align-items-center">
          <i className="ri-star-fill"></i>
          {reviews?.length === 0 ? "(0)" : `${avgRating} (${reviews.length})`}
        </span>
      </div>

      <div className="booking_form">
        <h5>Customer Information</h5>
        <Form onSubmit={handleClick}>
          <FormGroup>
            <input
              type="text"
              id="fullName"
              placeholder="Full Name"
              value={credentials.fullName}
              onChange={handleChange}
              required 
            />
          </FormGroup>
          <FormGroup>
            <input
              type="text"
              id="phone"
              placeholder="Phone"
              required
              value={credentials.phone}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={credentials.email}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <h5>Vehicle Details</h5>
          <FormGroup>
            <input type="text" id="vehicleMake" placeholder="Vehicle Make" required onChange={handleChange} />
          </FormGroup>
          <FormGroup>
            <input type="text" id="vehicleModel" placeholder="Vehicle Model" required onChange={handleChange} />
          </FormGroup>
          <FormGroup>
            <input type="number" id="vehicleYear" placeholder="Year of Manufacture" required onChange={handleChange} />
          </FormGroup>

          <h5>Service Details</h5>
          <FormGroup>
            <input type="text" value={name} id="serviceName" readOnly />
          </FormGroup>
          <FormGroup>
            <p><b>Book Date and Time of Service</b></p>
            <input type="datetime-local" id="bookedDate" required onChange={handleChange} />
          </FormGroup>
          <FormGroup>
            <textarea placeholder="Special Requests or Concerns" id="specialRequests" onChange={handleChange}></textarea>
          </FormGroup>

          <h5>Booking & Payment</h5>
          <FormGroup>
            <select id="paymentMethod" required onChange={handleChange}>
              <option value="">Select Payment Preference</option>
              <option value="Online">Online Payment</option>
              <option value="Deposit">Deposit</option>
              <option value="Pay-on-Arrival">Pay-on-Arrival</option>
            </select>
          </FormGroup>

          <div className="booking_bottom">
            <ListGroup>
              <ListGroupItem className="border-0 px-0 total">
                <h5>Price Range</h5>
                <span>{priceRange}</span>
              </ListGroupItem>
            </ListGroup>
            <Button className="btn primary_btn w-100 mt-4" type="submit">
              Book Now
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Booking;
