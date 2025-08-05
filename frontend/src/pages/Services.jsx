import React, {useState, useEffect} from 'react';
import CommonSection from "../shared/CommonSection";

import "../styles/tour.css";
import ServiceCard from "./../shared/ServiceCard";
import SearchBar from "./../shared/ServiceSearchBar";
import Newsletter from "./../shared/Newsletter";
import { Container, Row, Col } from 'reactstrap';
import { BASE_URL } from "../utils/config";

const Services = () => {

const [services, setServices] = useState([]);
const [loading, setLoading] = useState(true);
const [pageCount, setPageCount] = useState(0)
const [page,setPage] = useState(0)

useEffect(() => {
  const fetchServices = async () => {
    try {
      const res = await fetch(`${BASE_URL}/services?page=${page}`);
      const data = await res.json();

      if (res.ok) {
        setServices(data.data);
        const count = Math.ceil(data.count / 8); // Adjust to your pagination limit
        setPageCount(count);
      } else {
        console.error(data.message);
      }
    } catch (err) {
      console.error("Failed to fetch services", err);
    } finally {
      setLoading(false);
    }
    window.scrollTo(0,0)
  };

  fetchServices();
}, [page]);

  return (
    <>
      <CommonSection title={"All Services"} />
      <section>
        <Container>
          <Row>
            <SearchBar />
          </Row>
        </Container>
      </section>
      <section className="pt-0">
        <Container>
          <Row>
            
          {loading ? (
            <h4 className="text-center">Loading...</h4>
          ) : (
            services?.map(service => (
              <Col lg="3" className="mb-4" key={service._id}>
                <ServiceCard service={service} />
              </Col>
            ))
          )}


                <Col lg="12">
                  <div className="pagination d-flex align-items-center
                  justify-content-center mt-4 gap-3">
                    {[...Array(pageCount).keys()].map(number=>(
                      <span key={number} onClick={()=> setPage(number)}
                      className={page===number ? "active_page" : ""}
                      >
                        {number + 1}
                      </span>
                    ))}

                  </div>
                </Col>
           
          </Row>
        </Container>
      </section>
      <Newsletter />

    </>
  );
};

export default Services;