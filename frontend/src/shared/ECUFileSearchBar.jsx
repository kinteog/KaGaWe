import React, { useRef } from "react";
import "./search-bar.css";
import { Col, Form, FormGroup } from "reactstrap";
import { BASE_URL } from './../utils/config';
import { useNavigate } from 'react-router-dom';

const ECUFileSearchBar = () => {
  const titleRef = useRef('');
  const makeRef = useRef('');
  const modelRef = useRef('');
  const engineRef = useRef('');

  const navigate = useNavigate();

  const searchHandler = async () => {
    const title = titleRef.current.value.trim();
    const vehicleMake = makeRef.current.value.trim();
    const vehicleModel = modelRef.current.value.trim();
    const engineCode = engineRef.current.value.trim();

    if (!title && !vehicleMake && !vehicleModel && !engineCode) {
      return alert("Please fill in at least one search field!");
    }

    try {
      const queryParams = new URLSearchParams();
      if (title) queryParams.append("title", title);
      if (vehicleMake) queryParams.append("vehicleMake", vehicleMake);
      if (vehicleModel) queryParams.append("vehicleModel", vehicleModel);
      if (engineCode) queryParams.append("engineCode", engineCode);

      const res = await fetch(`${BASE_URL}/ecufiles/search/getECUFileBySearch?${queryParams.toString()}`);
      const result = await res.json();

      if (!res.ok) {
        return alert("Search failed!");
      }

      navigate(`/ecu-files/search?${queryParams.toString()}`, {
        state: result.data,
      });
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  return (
    <Col lg='12'>
      <div className="search_bar">
        <Form className="d-flex align-items-center gap-4 flex-wrap">
          <FormGroup className="d-flex gap-3 form_group form_group-fast">
            <span><i className="ri-file-search-line"></i></span>
            <div>
              <h6>File Title</h6>
              <input type="text" placeholder="e.g. Stage 1 Tuning File" ref={titleRef} />
            </div>
          </FormGroup>

          <FormGroup className="d-flex gap-3 form_group form_group-fast">
            <span><i className="ri-car-line"></i></span>
            <div>
              <h6>Make</h6>
              <input type="text" placeholder="e.g. Toyota" ref={makeRef} />
            </div>
          </FormGroup>

          <FormGroup className="d-flex gap-3 form_group form_group-last">
            <span><i className="ri-car-line"></i></span>
            <div>
              <h6>Model</h6>
              <input type="text" placeholder="e.g. Hilux" ref={modelRef} />
            </div>
          </FormGroup>

          <FormGroup className="d-flex gap-3 form_group form_group-last">
            <span><i className="ri-cpu-line"></i></span>
            <div>
              <h6>Engine Code</h6>
              <input type="text" placeholder="e.g. 1KD-FTV" ref={engineRef} />
            </div>
          </FormGroup>

          <span className="search_icon" onClick={searchHandler}>
            <i className="ri-search-line"></i>
          </span>
        </Form>
      </div>
    </Col>
  );
};

export default ECUFileSearchBar;
