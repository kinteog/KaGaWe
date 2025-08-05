import React, { useContext, useEffect, useState } from "react";
import "./booking.css";
import { AuthContext } from "../../context/AuthContext";
import { BASE_URL } from "../../utils/config";
import { Form, FormGroup, Input, Label, Button } from "reactstrap";
import { useNavigate } from "react-router-dom";

const ECUFileBooking = ({ ecuFile }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    _id,
    title: ecuFileTitle,
    price,
    vehicleMake,
    vehicleModel,
    vehicleYear,
    engineCode,
    reviews = []
  } = ecuFile;

  const [booking, setBooking] = useState({
    fullName: user?.username || "",
    email: user?.email || "",
    paymentMethod: "Online",
    notes: "",
  });

  useEffect(() => {
    if (user) {
      setBooking(prev => ({
        ...prev,
        fullName: user.username || "",
        email: user.email || ""
      }));
    }
  }, [user]);

  const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
  const avgRating = reviews.length ? (totalRating / reviews.length).toFixed(1) : 0;

  const handleChange = (e) => {
    setBooking({ ...booking, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user._id) {
      return alert("Please log in to place an ECU file order.");
    }

    const orderData = {
      userId: user._id,
      ecuFileId: _id,
      ecuFileTitle,
      price,
      fullName: booking.fullName,
      email: booking.email,
      vehicleMake,
      vehicleModel,
      vehicleYear,
      engineCode,
      paymentMethod: booking.paymentMethod,
      notes: booking.notes,
    };

    try {
      const res = await fetch(`${BASE_URL}/ecufileorders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        credentials: "include",
        body: JSON.stringify(orderData),
      });

      const result = await res.json();

      if (!res.ok) {
        return alert(result.message || "Failed to place ECU file order");
      }

      alert(result.message || "ECU file order placed successfully!");
      navigate("/order-thank-you");
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="booking">
      <div>
        <h4>{ecuFileTitle}</h4>
      </div>

      <div className="booking_top d-flex align-items-center justify-content-between">
        <h5>KES {price.toLocaleString()}</h5>
        <span className="service_rating d-flex align-items-center">
          <i className="ri-star-fill"></i>
          {reviews.length === 0 ? "(0)" : `${avgRating} (${reviews.length})`}
        </span>
      </div>

      <h5 className="mb-4">Order This ECU File</h5>

      <Form onSubmit={handleSubmit} className="booking_form">
        <FormGroup>
          <Input
            type="text"
            name="fullName"
            placeholder="Full Name"
            required
            value={booking.fullName}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <Input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={booking.email}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <Label for="paymentMethod">Payment Method</Label>
          <Input
            type="select"
            name="paymentMethod"
            id="paymentMethod"
            required
            value={booking.paymentMethod}
            onChange={handleChange}
          >
            <option value="Online">Online</option>
          </Input>
        </FormGroup>

        <FormGroup>
          <Label for="notes">Special Notes</Label>
          <Input
            type="textarea"
            rows="2"
            name="notes"
            id="notes"
            placeholder="Special Instructions (Optional)"
            value={booking.notes}
            onChange={handleChange}
          />
        </FormGroup>

        <div className="booking-summary mt-4 p-3 border rounded shadow-sm bg-light">
          <h5>Order Summary</h5>
          <p><strong>File:</strong> {ecuFileTitle}</p>
          <p><strong>Vehicle:</strong> {`${vehicleMake} ${vehicleModel} (${vehicleYear})`}</p>
          <p><strong>Engine Code:</strong> {engineCode}</p>
          <h6 className="mt-3">
            <strong>Total Price: <span style={{ color: "#f76d00" }}>KES {price.toLocaleString()}</span></strong>
          </h6>
        </div>

        <Button type="submit" className="btn primary_btn w-100 mt-3">
          Place ECU File Order
        </Button>
      </Form>
    </div>
  );
};

export default ECUFileBooking;
