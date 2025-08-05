import React, { useRef } from "react";
import "./search-bar.css";
import { Col, Form, FormGroup } from "reactstrap";
import { BASE_URL } from './../utils/config';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const nameRef = useRef('');
  const categoryRef = useRef('');
  const navigate = useNavigate();

  const searchHandler = async () => {
    const name = nameRef.current.value.trim();
    const category = categoryRef.current.value.trim();

    if (name === '' && category === '') {
      return alert("Please enter at least one search field!");
    }

    try {
      const queryParams = new URLSearchParams();
      if (name) queryParams.append("name", name);
      if (category) queryParams.append("category", category);

      const res = await fetch(`${BASE_URL}/services/search/getServiceBySearch?${queryParams}`);

      if (!res.ok) {
        return alert("Something went wrong with the search!");
      }

      const result = await res.json();

      navigate(
        `/services/search?${queryParams.toString()}`,
        { state: result.data }
      );
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  return (
    <Col lg='12'>
      <div className="search_bar">
        <Form className="d-flex align-items-center gap-4">
          <FormGroup className="d-flex gap-3 form_group form_group-fast">
            <span><i className="ri-tools-line"></i></span>
            <div>
              <h6>Service Name</h6>
              <input type="text" placeholder="e.g. Engine Repair" ref={nameRef} />
            </div>
          </FormGroup>

          <FormGroup className="d-flex gap-3 form_group form_group-last">
            <span><i className="ri-folders-line"></i></span>
            <div>
              <h6>Category</h6>
              <input type="text" placeholder="e.g. Electrical" ref={categoryRef} />
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

export default SearchBar;
