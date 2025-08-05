import React, { useRef, useState, useEffect, useContext } from "react";
import "../styles/tour-details.css";
import { Container, Row, Col, Form, ListGroup } from "reactstrap";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../utils/config";
import avatar from "../assets/images/avatar.jpg";
import { AuthContext } from "../context/AuthContext";
import ECUFileBooking from "../components/Booking/ECUFileBooking"; // You need to create this

const ECUFileDetails = () => {
  const { id } = useParams();
  const reviewMsgRef = useRef("");
  const [ecuFile, setEcuFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ecuRating, setEcuRating] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchECUFile = async () => {
      try {
        const res = await fetch(`${BASE_URL}/ecufiles/${id}`);
        const data = await res.json();
        console.log("Fetched ECU file:", data.data);


        if (res.ok) {
          setEcuFile(data.data);
        } else {
          console.error(data.message);
        }
      } catch (err) {
        console.error("Failed to fetch ECU file", err);
      } finally {
        setLoading(false);
      }
      window.scrollTo(0, 0);
    };

    fetchECUFile();
  }, [id]);

  

  const submitHandler = async (e) => {
    e.preventDefault();
    const reviewText = reviewMsgRef.current.value;

    if (!user) {
      return alert("Please log in to submit a review.");
    }

    const reviewObj = {
      username: user?.username,
      reviewText,
      rating: ecuRating,
    };

    try {
      const res = await fetch(`${BASE_URL}/reviewecufile/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(reviewObj),
      });

      const result = await res.json();

      if (!res.ok) return alert(result.message);

      alert(result.message);
      window.location.reload();
    } catch (err) {
      alert("Failed to submit review: " + err.message);
    }
  };

  if (loading) return <h2 className="text-center">Loading...</h2>;
  if (!ecuFile) return <h2 className="text-center">ECU File Not Found</h2>;

    const {
    imageUrl,
    title,
    description,
    category,
    vehicleMake,
    vehicleModel,
    vehicleYear,
    engineCode,
    ecuBrand,
    ecuVersion,
    tuningStage,
    compatibleVehicles,
    downloadLink,
    price,
    reviews,
    } = ecuFile;


  const totalRating = reviews?.reduce((acc, r) => acc + r.rating, 0) || 0;
  const avgRating = reviews?.length
    ? (totalRating / reviews.length).toFixed(1)
    : "Not rated";

  const options = { day: "numeric", month: "long", year: "numeric" };

  return (
    <section>
      <Container>
        <Row>
          <Col lg="8">
            <div className="tour_content">
              <img src={imageUrl} alt={title} />
              <h2>{title}</h2>

              <div className="d-flex align-items-center gap-5">
                <span className="tour_rating d-flex align-items-center gap-1">
                  <i className="ri-star-fill" style={{ color: "var(--secondary-color)" }}></i>
                  {avgRating}
                  {reviews?.length ? <span>({reviews.length})</span> : null}
                </span>
              </div>

              <div className="tour_extra-details">
                <span><i className="ri-settings-2-line"></i> {category}</span>
                <span><i className="ri-building-line"></i> {vehicleMake} - {vehicleModel}</span>
                <span><i className="ri-money-dollar-circle-line"></i> KES {price}</span>
              </div>

              <h5>Description</h5>
              <p>{description}</p>

              <h5 className="mt-4">ECU File Specifications</h5>
              <table className="table table-bordered mt-3">
                <tbody>
                    <tr><th>Vehicle</th><td>{`${vehicleMake} ${vehicleModel} (${vehicleYear})`}</td></tr>
                    <tr><th>ECU Brand</th><td>{ecuBrand}</td></tr>
                    <tr><th>ECU Version</th><td>{ecuVersion}</td></tr>
                    <tr><th>Engine Code</th><td>{engineCode}</td></tr>
                    <tr><th>Tuning Stage</th><td>{tuningStage}</td></tr>
                    <tr><th>Compatible Vehicles</th><td>{compatibleVehicles?.join(', ')}</td></tr>
                </tbody>
              </table>
            </div>

            <div className="tour_reviews mt-4">
              <h4>Reviews ({reviews?.length} reviews)</h4>

              <Form onSubmit={submitHandler}>
                <div className="d-flex align-items-center gap-2 mb-4 rating_group">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} onClick={() => setEcuRating(star)} style={{ cursor: "pointer" }}>
                      <i
                        className="ri-star-s-fill"
                        style={{
                          color: ecuRating >= star ? "#f9a825" : "#ccc",
                          fontSize: "1.5rem",
                        }}
                      ></i>
                    </span>
                  ))}
                </div>

                <div className="review_input">
                  <input
                    type="text"
                    ref={reviewMsgRef}
                    placeholder="Share your thoughts"
                    required
                  />
                  <button className="btn primary_btn text-white" type="submit">
                    Submit
                  </button>
                </div>
              </Form>

              <ListGroup className="user_reviews">
                {reviews?.map((review, index) => (
                  <div className="review_item" key={index}>
                    <img src={avatar} alt="avatar" />
                    <div className="w-100">
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <h5>{review.username}</h5>
                          <p>{new Date(review.createdAt).toLocaleDateString("en-US", options)}</p>
                        </div>
                        <span className="d-flex align-items-center">
                          {review.rating} <i className="ri-star-s-fill"></i>
                        </span>
                      </div>
                      <h6>{review.reviewText}</h6>
                    </div>
                  </div>
                ))}
              </ListGroup>
            </div>
          </Col>

          <Col lg="4">
            <ECUFileBooking ecuFile={ecuFile} avgRating={avgRating} />
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ECUFileDetails;
