import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col
} from 'reactstrap';
import { BASE_URL } from '../../utils/config';
import { saveAs } from 'file-saver';
import "./admin.css"
import CountUp from 'react-countup';
import {
  FaClipboardList,
  FaPlusCircle,
  FaCheckCircle,
  FaTools,
  FaTimesCircle,
  FaBan,
  FaEllipsisH,
  FaCalendarAlt
} from 'react-icons/fa';



const ServiceBookingTable = () => {
  const [bookings, setBookings] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [createModal, setCreateModal] = useState(false);
  const [newBooking, setNewBooking] = useState({
    fullName: '',
    email: '',
    phone: '',
    serviceName: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    bookedDate: '',
    paymentMethod: 'Online',
    specialRequests: ''
  });



  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingsPerPage, setBookingsPerPage] = useState(10);


  const toggleViewModal = () => setViewModal(!viewModal);
  const toggleUpdateModal = () => setUpdateModal(!updateModal);

  const fetchBookings = async () => {
    try {
      const res = await fetch(`${BASE_URL}/servicebooking`, {
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setBookings(data.data.reverse());
      }
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);
  const handleCreateBooking = async () => {
  try {
    const res = await fetch(`${BASE_URL}/servicebooking`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(newBooking)
    });
    const result = await res.json();
    if (result.success) {
      alert('Booking created successfully');
      setCreateModal(false);
      setNewBooking({
        fullName: '',
        email: '',
        phone: '',
        serviceId: '',          
        serviceName: '',
        priceRange: '',         
        vehicleMake: '',
        vehicleModel: '',
        vehicleYear: '',
        bookedDate: '',
        paymentMethod: 'Online',
        specialRequests: '',
        status: 'new'
      });
      fetchBookings();
    } else {
      console.error('Backend error:', result);
      alert(`Failed to create booking: ${result.message || 'Unknown error'}`);
    }
  } catch (err) {
    console.error('Create error:', err);
  }
};


  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;
    try {
      const res = await fetch(`${BASE_URL}/servicebooking/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const result = await res.json();
      if (result.success) {
        alert('Booking deleted successfully');
        fetchBookings();
      } else {
        alert('Delete failed');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleView = (booking) => {
    setSelectedBooking(booking);
    setViewModal(true);
  };

  const handleEdit = (booking) => {
    setSelectedBooking(booking);
    setUpdateModal(true);
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`${BASE_URL}/servicebooking/${selectedBooking._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(selectedBooking),
      });
      const result = await res.json();
      if (result.success) {
        alert('Booking updated successfully');
        fetchBookings();
        toggleUpdateModal();
      } else {
        alert('Update failed');
      }
    } catch (err) {
      console.error(err);
    }
  };

const [services, setServices] = useState([]);

const fetchServices = async () => {
  try {
    const res = await fetch(`${BASE_URL}/services`);
    const data = await res.json();
    if (data.success) {
      setServices(data.data);
    }
  } catch (err) {
    console.error('Failed to fetch services:', err);
  }
};

useEffect(() => {
  fetchBookings();
  fetchServices();
}, []);


  
const [sortField, setSortField] = useState('');
const [sortDirection, setSortDirection] = useState('asc');
  // Pagination logic
  const filteredBookings = bookings.filter(booking =>
  booking.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  booking.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  booking.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  booking.serviceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  booking.vehicleMake?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  booking.vehicleModel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  booking.status?.toLowerCase().includes(searchTerm.toLowerCase()) 
);

const indexOfLast = currentPage * bookingsPerPage;
const indexOfFirst = indexOfLast - bookingsPerPage;
const sortedBookings = [...filteredBookings].sort((a, b) => {
  const valA = a[sortField];
  const valB = b[sortField];

  if (!valA || !valB) return 0;

  // Handle date fields
  if (['bookedDate', 'createdAt', 'updatedAt'].includes(sortField)) {
    return sortDirection === 'asc'
      ? new Date(valA) - new Date(valB)
      : new Date(valB) - new Date(valA);
  }

  // Handle strings (e.g., serviceName)
  return sortDirection === 'asc'
    ? valA.toString().localeCompare(valB.toString())
    : valB.toString().localeCompare(valA.toString());
});

const currentBookings = sortedBookings.slice(indexOfFirst, indexOfLast);

const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);

const renderStatusBadge = (status) => {
  const statusColors = {
    new: 'primary',        // Blue
    confirmed: 'success',  // Green
    serviced: 'info',      // Light Blue
    'not serviced': 'warning', // Yellow
    cancelled: 'danger',   // Red
    other: 'secondary',    // Grey
  };

  return (
    <span className={`badge bg-${statusColors[status] || 'secondary'}`}>
      {status}
    </span>
  );
};
const handleSort = (field) => {
  if (sortField === field) {
    setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
  } else {
    setSortField(field);
    setSortDirection('asc');
  }
};
// EXPORT CSV
const handleExportCSV = () => {
  const csvHeaders = [
    'Full Name',
    'Email',
    'Phone',
    'Service',
    'Vehicle',
    'Booked Date',
    'Status',
    'Created At',
    'Updated At'
  ];

  const csvRows = currentBookings.map(booking => [
    booking.fullName,
    booking.email,
    booking.phone,
    booking.serviceName,
    `${booking.vehicleMake} ${booking.vehicleModel} (${booking.vehicleYear})`,
    new Date(booking.bookedDate).toLocaleString(),    // Merge date & time
    booking.status,
    new Date(booking.createdAt).toLocaleString(),
    new Date(booking.updatedAt).toLocaleString()
  ]);

  const csvContent = [
    csvHeaders.join(','),  // Header row
    ...csvRows.map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')) // Escaping quotes
  ].join('\n');

  // Get current timestamp in YYYY-MM-DD_HH-MM-SS format
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_').split('Z')[0];

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `ServiceBookings_${timestamp}.csv`);
};

const statusCounts = bookings.reduce((acc, booking) => {
  const status = booking.status || 'other';
  const isUpcoming = new Date(booking.bookedDate) > new Date();

  acc[status] = (acc[status] || 0) + 1;
  acc.total = (acc.total || 0) + 1;

  if (isUpcoming) acc.upcoming = (acc.upcoming || 0) + 1;

  return acc;
}, {});

const getStatusColor = (status) => {
  const colors = {
    new: 'primary',
    confirmed: 'success',
    serviced: 'info',
    'not serviced': 'warning',
    cancelled: 'danger',
    other: 'secondary'

  };
  return colors[status] || 'secondary';
};

  return (
   
    <div className="container mt-4">

      <div className="row g-2 mb-4">
        {[
          { label: 'Total', className: 'card-total', icon: <FaClipboardList />, count: statusCounts.total },
          { label: 'New', className: 'card-new', icon: <FaPlusCircle />, count: statusCounts.new },
          { label: 'Confirmed', className: 'card-confirmed', icon: <FaCheckCircle />, count: statusCounts.confirmed },
          { label: 'Serviced', className: 'card-serviced', icon: <FaTools />, count: statusCounts.serviced },
          { label: 'Not Serviced', className: 'card-not-serviced', icon: <FaTimesCircle />, count: statusCounts['not serviced'] },
          { label: 'Cancelled', className: 'card-cancelled', icon: <FaBan />, count: statusCounts.cancelled },
          { label: 'Other', className: 'card-other', icon: <FaEllipsisH />, count: statusCounts.other },
          { label: 'Upcoming', className: 'card-upcoming', icon: <FaCalendarAlt />, count: statusCounts.upcoming }
        ].map(({ label, className, icon, count }) => (
          <div className="col-6 col-sm-6 col-md-3" key={label}>
            <div className={`card-status ${className}`}>
              {React.cloneElement(icon, { className: "animated-icon", size: 30 })}
              <h6>{label}</h6>
              <h4><CountUp end={count || 0} duration={3} /></h4>
            </div>
          </div>
        ))}
      </div>

      <div className="top-bar d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
        <h2>Service Bookings</h2>

        <Button color="success" onClick={() => setCreateModal(true)}>
          + Add Booking
        </Button>

      <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
        <label className="mb-0">Search:</label>
        <div className="flex-grow-1 flex-md-grow-0" style={{ minWidth: '250px', maxWidth: '400px' }}>
          <Input
            type="text"
            placeholder="name, email, service, vehicle, status, phone..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            
          />
        </div>
      </div>


        <Button color="secondary" onClick={handleExportCSV} className="me-2">
          Export CSV
        </Button>

      </div>


      {/* Add scrollable wrapper here */}
      <div style={{ overflowX: 'auto' }}>
        <Table striped bordered responsive  className="service-booking-table">
         <thead>
            <tr>
              <th>#</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>

              <th
                onClick={() => handleSort('serviceName')}
                className={sortField === 'serviceName' ? 'sorted-column' : ''}
                style={{ cursor: 'pointer' }}
              >
                Service {sortField === 'serviceName' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
              </th>

              <th>Vehicle</th>

              <th
                onClick={() => handleSort('bookedDate')}
                className={sortField === 'bookedDate' ? 'sorted-column' : ''}
                style={{ cursor: 'pointer' }}
              >
                Booked Date {sortField === 'bookedDate' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
              </th>

              <th
                onClick={() => handleSort('status')}
                className={sortField === 'status' ? 'sorted-column' : ''}
                style={{ cursor: 'pointer' }}
              >
                Status {sortField === 'status' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
              </th>

              <th>Actions</th>

              <th
                onClick={() => handleSort('createdAt')}
                className={sortField === 'createdAt' ? 'sorted-column' : ''}
                style={{ cursor: 'pointer' }}
              >
                Created At {sortField === 'createdAt' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
              </th>

              <th
                onClick={() => handleSort('updatedAt')}
                className={sortField === 'updatedAt' ? 'sorted-column' : ''}
                style={{ cursor: 'pointer' }}
              >
                Updated At {sortField === 'updatedAt' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
              </th>
            </tr>
          </thead>



          <tbody>
            {currentBookings.length > 0 ? (
              currentBookings.map((booking, index) => (
                <tr key={booking._id}>
                  <td>{indexOfFirst + index + 1}</td>
                  <td>{booking.fullName}</td>
                  <td>{booking.email}</td>
                  <td>{booking.phone}</td>
                  <td>{booking.serviceName}</td>
                  <td>{`${booking.vehicleMake} ${booking.vehicleModel} (${booking.vehicleYear})`}</td>
                  <td>{new Date(booking.bookedDate).toLocaleString()}</td>
                  <td>{renderStatusBadge(booking.status)}</td>
                  <td>
                    <Button size="sm" color="info" onClick={() => handleView(booking)} className="me-1">View</Button>
                    <Button size="sm" color="warning" onClick={() => handleEdit(booking)} className="me-1">Edit</Button>
                    <Button size="sm" color="danger" onClick={() => handleDelete(booking._id)}>Delete</Button>
                  </td>
                  <td>{new Date(booking.createdAt).toLocaleString()}</td>
                  <td>{new Date(booking.updatedAt).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9">No bookings found.</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Pagination */}
    <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
        <Button
          color="secondary"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => prev - 1)}
        >
          Previous
        </Button>

        <div className="d-flex flex-wrap gap-2">
          {[...Array(totalPages)].map((_, i) => {
            const page = i + 1;
            return (
              <Button
                key={page}
                color={currentPage === page ? 'primary' : 'light'}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            );
          })}
        </div>

        <Button
          color="secondary"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(prev => prev + 1)}
        >
          Next
        </Button>

        <div className="d-flex align-items-center gap-2">
          <label className="me-2 mb-0">Show</label>
          <select
            className="form-select w-auto"
            value={bookingsPerPage}
            onChange={(e) => {
              setBookingsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            {[5, 10, 25, 50, 100].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
          <span className="ms-2">entries</span>
        </div>
    </div>




      {/* View Modal */}
      <Modal isOpen={viewModal} toggle={toggleViewModal}>
        <ModalHeader toggle={toggleViewModal}>Booking Details</ModalHeader>
        <ModalBody>
          {selectedBooking && (
            <>
              <p><strong>Full Name:</strong> {selectedBooking.fullName}</p>
              <p><strong>Email:</strong> {selectedBooking.email}</p>
              <p><strong>Phone:</strong> {selectedBooking.phone}</p>
              <p><strong>Service:</strong> {selectedBooking.serviceName}</p>
              <p><strong>Status:</strong> {renderStatusBadge(selectedBooking.status)}</p>
              <p><strong>Vehicle:</strong> {selectedBooking.vehicleMake} {selectedBooking.vehicleModel} ({selectedBooking.vehicleYear})</p>
              <p><strong>Booked Date:</strong> {new Date(selectedBooking.bookedDate).toLocaleString()}</p>
              <p><strong>Payment Method:</strong> {selectedBooking.paymentMethod}</p>
              <p><strong>Special Requests:</strong> {selectedBooking.specialRequests || "None"}</p>
              <p><strong>Created At:</strong> {new Date(selectedBooking.createdAt).toLocaleString()}</p>
              <p><strong>Updated At:</strong> {new Date(selectedBooking.updatedAt).toLocaleString()}</p>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button onClick={toggleViewModal}>Close</Button>
        </ModalFooter>
      </Modal>

      {/* Update Modal */}
      <Modal isOpen={updateModal} toggle={toggleUpdateModal} modalClassName="wide-modal">
        <ModalHeader toggle={toggleUpdateModal}  >Edit Booking</ModalHeader>
        <ModalBody>
          {selectedBooking && (
            <Form>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label>Select Service</Label>
                    <Input
                      type="select"
                      value={selectedBooking?.serviceId || ''}
                      onChange={(e) => {
                        const selected = services.find((s) => s._id === e.target.value);
                        if (selected) {
                          setSelectedBooking((prev) => ({
                            ...prev,
                            serviceId: selected._id,
                            serviceName: selected.name,
                            priceRange: selected.priceRange
                          }));
                        }
                      }}
                    >
                      <option value="">-- Select a service --</option>
                      {services.map((service) => (
                        <option key={service._id} value={service._id}>
                          {service.name} ({service.priceRange})
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label>Status</Label>
                    <Input
                      type="select"
                      value={selectedBooking.status}
                      onChange={(e) =>
                        setSelectedBooking({ ...selectedBooking, status: e.target.value })
                      }
                    >
                      {['new', 'confirmed', 'serviced', 'not serviced', 'cancelled', 'other'].map((statusOption) => (
                        <option key={statusOption} value={statusOption}>
                          {statusOption}
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                </Col>

                <Col md={6}>
                  <FormGroup>
                    <Label>Service Name</Label>
                    <Input type="text" value={selectedBooking?.serviceName || ''} readOnly />
                  </FormGroup>
                </Col>

                <Col md={6}>
                  <FormGroup>
                    <Label>Price Range</Label>
                    <Input type="text" value={selectedBooking?.priceRange || ''} readOnly />
                  </FormGroup>
                </Col>

                {[
                  { label: 'Full Name', key: 'fullName' },
                  { label: 'Email', key: 'email' },
                  { label: 'Phone', key: 'phone' },
                  { label: 'Vehicle Make', key: 'vehicleMake' },
                  { label: 'Vehicle Model', key: 'vehicleModel' },
                  { label: 'Vehicle Year', key: 'vehicleYear', type: 'number' },
                  { label: 'Booked Date', key: 'bookedDate', type: 'datetime-local' }
                ].map(({ label, key, type = 'text' }) => (
                  <Col md={6} key={key}>
                    <FormGroup>
                      <Label>{label}</Label>
                      <Input
                        type={type}
                        value={
                          key === 'bookedDate'
                            ? new Date(selectedBooking[key]).toISOString().slice(0, 16)
                            : selectedBooking[key]
                        }
                        onChange={(e) =>
                          setSelectedBooking({ ...selectedBooking, [key]: type === 'number' ? Number(e.target.value) : e.target.value })
                        }
                      />
                    </FormGroup>
                  </Col>
                ))}

                <Col md={6}>
                  <FormGroup>
                    <Label>Payment Method</Label>
                    <Input
                      type="select"
                      value={selectedBooking.paymentMethod}
                      onChange={(e) =>
                        setSelectedBooking({ ...selectedBooking, paymentMethod: e.target.value })
                      }
                    >
                      <option>Online</option>
                      <option>Deposit</option>
                      <option>Pay-on-Arrival</option>
                    </Input>
                  </FormGroup>
                </Col>

                <Col md={12}>
                  <FormGroup>
                    <Label>Special Requests</Label>
                    <Input
                      type="textarea"
                      value={selectedBooking.specialRequests}
                      onChange={(e) =>
                        setSelectedBooking({ ...selectedBooking, specialRequests: e.target.value })
                      }
                    />
                  </FormGroup>
                </Col>
              </Row>
            </Form>

          )}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleUpdate}>
            Save Changes
          </Button>{' '}
          <Button color="secondary" onClick={toggleUpdateModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      
    {/* Create Modal */}
    <Modal isOpen={createModal} toggle={() => setCreateModal(!createModal)}modalClassName="wide-modal" >
      <ModalHeader toggle={() => setCreateModal(!createModal)}  >Add New Booking</ModalHeader>
      <ModalBody>
        <Form>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>Select Service</Label>
                <Input
                  type="select"
                  value={newBooking.serviceId}
                  onChange={(e) => {
                    const selected = services.find((s) => s._id === e.target.value);
                    if (selected) {
                      setNewBooking((prev) => ({
                        ...prev,
                        serviceId: selected._id,
                        serviceName: selected.name,
                        priceRange: selected.priceRange
                      }));
                    }
                  }}
                >
                  <option value="">-- Select a service --</option>
                  {services.map((service) => (
                    <option key={service._id} value={service._id}>
                      {service.name} ({service.priceRange})
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>Service Name</Label>
                <Input type="text" value={newBooking.serviceName} disabled />
              </FormGroup>
            </Col>

            <Col md={6}>
              <FormGroup>
                <Label>Price Range</Label>
                <Input type="text" value={newBooking.priceRange} disabled />
              </FormGroup>
            </Col>

            {[
              { label: 'Full Name', key: 'fullName' },
              { label: 'Email', key: 'email' },
              { label: 'Phone', key: 'phone' },
              { label: 'Vehicle Make', key: 'vehicleMake' },
              { label: 'Vehicle Model', key: 'vehicleModel' },
              { label: 'Vehicle Year', key: 'vehicleYear', type: 'number' },
              { label: 'Booked Date', key: 'bookedDate', type: 'datetime-local' }
            ].map(({ label, key, type = 'text' }) => (
              <Col md={6} key={key}>
                <FormGroup>
                  <Label>{label}</Label>
                  <Input
                    type={type}
                    value={newBooking[key]}
                    onChange={(e) => setNewBooking({ ...newBooking, [key]: e.target.value })}
                  />
                </FormGroup>
              </Col>
            ))}

            <Col md={6}>
              <FormGroup>
                <Label>Payment Method</Label>
                <Input
                  type="select"
                  value={newBooking.paymentMethod}
                  onChange={(e) => setNewBooking({ ...newBooking, paymentMethod: e.target.value })}
                >
                  <option>Online</option>
                  <option>Deposit</option>
                  <option>Pay-on-Arrival</option>
                </Input>
              </FormGroup>
            </Col>

            <Col md={12}>
              <FormGroup>
                <Label>Special Requests</Label>
                <Input
                  type="textarea"
                  value={newBooking.specialRequests}
                  onChange={(e) => setNewBooking({ ...newBooking, specialRequests: e.target.value })}
                />
              </FormGroup>
            </Col>
          </Row>
        </Form>

      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleCreateBooking}>Add Booking</Button>
        <Button color="secondary" onClick={() => setCreateModal(false)}>Cancel</Button>
      </ModalFooter>
    </Modal>


    </div>
  );
};

export default ServiceBookingTable;
