import React, { useState, useEffect } from 'react';
import CommonSection from "../shared/CommonSection";
import "../styles/tour.css"; // Reuse same CSS or create spare-parts.css if needed
import SparePartCard from "../shared/SparePartCard";
import SparePartSearchBar from "../shared/SparePartSearchBar";
import Newsletter from "../shared/Newsletter";
import { Container, Row, Col } from 'reactstrap';
import { BASE_URL } from "../utils/config";

const SpareParts = () => {
  const [spareParts, setSpareParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const fetchSpareParts = async () => {
      try {
        const res = await fetch(`${BASE_URL}/spareparts?page=${page}`);
        const data = await res.json();

        if (res.ok) {
          setSpareParts(data.data);
          const count = Math.ceil(data.count / 8);
          setPageCount(count);
        } else {
          console.error(data.message);
        }
      } catch (err) {
        console.error("Failed to fetch spare parts", err);
      } finally {
        setLoading(false);
      }
      window.scrollTo(0, 0);
    };

    fetchSpareParts();
  }, [page]);

  return (
    <>
      <CommonSection title={"All Spare Parts"} />
      <section>
        <Container>
          <Row>
            <SparePartSearchBar />
          </Row>
        </Container>
      </section>
      <section className="pt-0">
        <Container>
          <Row>
            {loading ? (
              <h4 className="text-center">Loading...</h4>
            ) : (
              spareParts?.map(part => (
                <Col lg="3" className="mb-4" key={part._id}>
                  <SparePartCard part={part} />
                </Col>
              ))
            )}

            <Col lg="12">
              <div className="pagination d-flex align-items-center justify-content-center mt-4 gap-3">
                {[...Array(pageCount).keys()].map(number => (
                  <span
                    key={number}
                    onClick={() => setPage(number)}
                    className={page === number ? "active_page" : ""}
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

export default SpareParts;
