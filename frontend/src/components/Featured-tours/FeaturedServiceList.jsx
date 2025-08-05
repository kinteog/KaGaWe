

import React from 'react';
import ServiceCard from '../../shared/ServiceCard.jsx'
import { Col } from 'reactstrap';

import useFetch from '../../hooks/useFetch.js';
import { BASE_URL } from '../../utils/config.js';

const FeaturedServiceList = () => {

  const {data: featuredServices, loading, error} = useFetch(
    `${BASE_URL}/services/search/getFeaturedServices`
  );


  return (
    <>
        {
          loading && <h4>Loading........</h4>
        }
        {
          error && <h4>{error}</h4>
        }

      {!loading && !error && featuredServices?.map(service=>(
        <Col lg='3' md='6' sm='6' className='mb-4' key={service._id}>
          <ServiceCard service={service} />
        </Col>
    ))}
  </>
  );
};

export default FeaturedServiceList;