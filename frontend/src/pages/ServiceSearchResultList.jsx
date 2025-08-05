import React, { useEffect, useState } from 'react';
import CommonSection from './../shared/CommonSection';
import { Container, Row, Col } from 'reactstrap';
import { useLocation } from 'react-router-dom';
import ServiceCard from './../shared/ServiceCard';
import SearchBar from "./../shared/ServiceSearchBar";
import Newsletter from './../shared/Newsletter';

const ServiceSearchResultList = () => {
  const location = useLocation();
  const [data, setData] = useState(location.state || []);

  useEffect(() => {
    // Update data when location.state changes
    setData(location.state || []);
  }, [location.state]);

  return (
    <>
      <CommonSection title={'Service Search Results'} />
            <section>
              <Container>
                <Row>
                  <SearchBar />
                </Row>
              </Container>
            </section>
      <section>
        <Container>
          <Row>
            {data.length === 0 ? (
              <h4 className="text-center">No service found</h4>
            ) : (
              data.map((service) => (
                <Col lg="3" className="mb-4" key={service._id}>
                  <ServiceCard service={service} />
                </Col>
              ))
            )}
          </Row>
        </Container>
      </section>
      <Newsletter />
    </>
  );
};

export default ServiceSearchResultList;
