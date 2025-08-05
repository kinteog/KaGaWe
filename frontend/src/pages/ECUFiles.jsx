import React, { useState, useEffect } from 'react';
import CommonSection from "../shared/CommonSection";
import "../styles/tour.css"; // Optional: create ecu-files.css if you want separate styling
import ECUFileCard from "../shared/ECUFileCard";
import ECUFileSearchBar from "../shared/ECUFileSearchBar";
import Newsletter from "../shared/Newsletter";
import { Container, Row, Col } from 'reactstrap';
import { BASE_URL } from "../utils/config";

const ECUFiles = () => {
  const [ecuFiles, setEcuFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const fetchECUFiles = async () => {
      try {
        const res = await fetch(`${BASE_URL}/ecufiles?page=${page}`);
        const data = await res.json();

        if (res.ok) {
          setEcuFiles(data.data);
          const count = Math.ceil(data.count / 8);
          setPageCount(count);
        } else {
          console.error(data.message);
        }
      } catch (err) {
        console.error("Failed to fetch ECU files", err);
      } finally {
        setLoading(false);
      }
      window.scrollTo(0, 0);
    };

    fetchECUFiles();
  }, [page]);

  return (
    <>
      <CommonSection title={"All ECU Files"} />
      <section>
        <Container>
          <Row>
            <ECUFileSearchBar />
          </Row>
        </Container>
      </section>

      <section className="pt-0">
        <Container>
          <Row>
            {loading ? (
              <h4 className="text-center">Loading...</h4>
            ) : (
              ecuFiles?.map(file => (
                <Col lg="3" className="mb-4" key={file._id}>
                  <ECUFileCard file={file} />
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

export default ECUFiles;
