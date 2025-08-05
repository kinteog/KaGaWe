import React, { useEffect, useState } from 'react';
import CommonSection from './../shared/CommonSection';
import { Container, Row, Col } from 'reactstrap';
import { useLocation } from 'react-router-dom';
import ECUFileCard from './../shared/ECUFileCard';
import ECUFileSearchBar from './../shared/ECUFileSearchBar';
import Newsletter from './../shared/Newsletter';

const ECUFileSearchResults = () => {
  const location = useLocation();
  const [data, setData] = useState(location.state || []);

  useEffect(() => {
    setData(location.state || []);
  }, [location.state]);

  return (
    <>
      <CommonSection title={'ECU File Search Results'} />

      <section>
        <Container>
          <Row>
            <ECUFileSearchBar />
          </Row>
        </Container>
      </section>

      <section>
        <Container>
          <Row>
            {data.length === 0 ? (
              <h4 className="text-center">No ECU files found</h4>
            ) : (
              data.map((ecuFile) => (
                <Col lg="3" md="4" sm="6" xs="12" className="mb-4" key={ecuFile._id}>
                  <ECUFileCard file={ecuFile} />
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

export default ECUFileSearchResults;
