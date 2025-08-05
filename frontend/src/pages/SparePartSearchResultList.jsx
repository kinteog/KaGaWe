import React, { useEffect, useState } from 'react';
import CommonSection from './../shared/CommonSection';
import { Container, Row, Col } from 'reactstrap';
import { useLocation } from 'react-router-dom';
import SparePartCard from './../shared/SparePartCard';
import SparePartSearchBar from './../shared/SparePartSearchBar';
import Newsletter from './../shared/Newsletter';

const SparePartSearchResultList = () => {
  const location = useLocation();
  const [data, setData] = useState(location.state || []);

  useEffect(() => {
    setData(location.state || []);
  }, [location.state]);

  return (
    <>
      <CommonSection title={'Spare Parts Search Results'} />

      <section>
        <Container>
          <Row>
            <SparePartSearchBar />
          </Row>
        </Container>
      </section>

      <section>
        <Container>
          <Row>
            {data.length === 0 ? (
              <h4 className="text-center">No spare parts found</h4>
            ) : (
              data.map((sparePart) => (
                <Col lg="3" md="4" sm="6" xs="12" className="mb-4" key={sparePart._id}>
                  <SparePartCard part={sparePart} />

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

export default SparePartSearchResultList;
