import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Row, Col } from 'reactstrap';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const pages = [

    { label: "Services", path: "/admin/services", color: "success" },
    { label: "Spare Parts", path: "/admin/spareparts", color: "warning" },
    { label: "ECU Files", path: "/admin/ecufiles", color: "danger" },
    { label: "Service Bookings", path: "/admin/service-bookings", color: "primary" },
    { label: "Spare Part Orders", path: "/admin/sparepart-orders", color: "dark" },
    { label: "ECU File Orders", path: "/admin/ecufiles-orders", color: "secondary" },
    { label: "Users", path: "/admin/users", color: "secondary" },
    { label: "Reviews", path: "/admin/reviews", color: "info" },
    { label: "Newsletters", path: "/admin/newsletters", color: "primary" },
  ];

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Admin Dashboard</h2>
      <p className="mb-4">Welcome, Admin! Choose a section to manage:</p>

      <Row>
        {pages.map((page, index) => (
          <Col key={index} sm="6" md="4" className="mb-3">
            <Button
              color={page.color}
              block
              onClick={() => navigate(page.path)}
              style={{ width: "100%" }}
            >
              {page.label}
            </Button>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default AdminDashboard;
