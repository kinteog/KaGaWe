import React, { useContext, useEffect , useState } from "react";
import "./booking.css";
import { AuthContext } from "../../context/AuthContext";
import { BASE_URL } from "../../utils/config";
import { Form, FormGroup, ListGroup, ListGroupItem, Label, Input ,Button } from "reactstrap";
import { useNavigate } from "react-router-dom";


const SparePartBooking = ({ sparePart }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { _id, name, partNumber, price, reviews = [] } = sparePart;

  const [booking, setBooking] = useState({
    fullName: user?.username || "",
    email: user?.email || "",
    phone: user?.phone || "",
    quantity: 1,
    deliveryAddress: "",
    shippingOption: "Pickup",
    paymentMethod: "Pay-on-Delivery",
    specialInstructions: "",
  });



  // Autofill form when user logs in
  useEffect(() => {
    if (user) {
      setBooking(prev => ({
        ...prev,
        fullName: user.username || "",
        email: user.email || "",
        phone: user.phone || ""
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
      return alert("Please log in to place an order.");
    }

    const quantity = parseInt(booking.quantity);
    const totalPrice = quantity * sparePart.price;

    const orderData = {
      userId: user._id,
      sparePartId: sparePart._id,
      partName: sparePart.name,
      partNumber: sparePart.partNumber,
      quantity,
      pricePerUnit: sparePart.price,
      totalPrice,
      fullName: booking.fullName,
      phone: booking.phone,
      email: booking.email,
      deliveryAddress: booking.deliveryAddress,
      shippingOption: booking.shippingOption,
      paymentMethod: booking.paymentMethod,
      specialInstructions: booking.specialInstructions,
    };

    try {
      const res = await fetch(`${BASE_URL}/sparepartorders`, {
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
        return alert(result.message || "Failed to place order");
      }

      alert(result.message || "Order placed successfully!");
      navigate("/order-thank-you");
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    }
  };



  const totalPrice = parseInt(booking.quantity) * sparePart.price;

  return (
    <div className="booking">
        <div>
          <h4>
            {name} (#{partNumber})
          </h4> 
        </div>

        <div className="booking_top d-flex align-items-center justify-content-between">
        <h5>KES {price.toLocaleString()} / unit</h5>
        <span className="service_rating d-flex align-items-center">
          <i className="ri-star-fill"></i>
            {reviews?.length === 0 ? "(0)" : `${avgRating} (${reviews.length})`}
        </span>
      </div>
      
      <h5 className="mb-4">Order This Spare Part</h5>
      
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
          <Input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            required
            value={booking.phone}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <Input
            type="number"
            name="quantity"
            placeholder="Quantity"
            min="1"
            max={sparePart.stock || 99}
            required
            value={booking.quantity}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <Input
            type="text"
            name="deliveryAddress"
            placeholder="Delivery Address"
            required
            value={booking.deliveryAddress}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <Label for="shippingOption">Shipping Option</Label>
          <Input
            type="select"
            name="shippingOption"
            id="shippingOption"
            required
            value={booking.shippingOption}
            onChange={handleChange}
          >
            <option value="">Select Option</option>
            <option value="Pickup">Pickup</option>
            <option value="Courier">Courier</option>
          </Input>
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
            <option value="">Select Method</option>
            <option value="Pay-on-Delivery">Pay on Delivery</option>
            <option value="Online">Online</option>
          </Input>
        </FormGroup>

        <FormGroup>
          <Label for="specialInstructions">Special Instructions</Label>
          <Input
            type="textarea"
            rows="2"
            name="specialInstructions"
            id="specialInstructions"
            placeholder="Special Instructions (Optional)"
            value={booking.specialInstructions}
            onChange={handleChange}
          />
        </FormGroup>
        <div className="booking-summary mt-4 p-3 border rounded shadow-sm bg-light">
          <h5>Order Summary</h5>
          <p><strong>Part:</strong> {name} ({partNumber})</p>
          <p><strong>Price per Unit:</strong> KES {price}</p>
          <p><strong>Quantity:</strong> {booking.quantity}</p>
          <h6 className="mt-3"><strong> Total Price: <span style={{ color: "#f76d00" }}>KES {totalPrice.toLocaleString()}</span></strong>         
          </h6>
        </div>




        <Button type="submit" className="btn primary_btn w-100 mt-3">
          Place Order
        </Button>
      </Form>
    </div>
  );
};

export default SparePartBooking;
