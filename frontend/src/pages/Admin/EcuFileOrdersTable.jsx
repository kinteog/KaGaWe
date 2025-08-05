
import React, { useEffect, useState } from 'react';
import {
  Table, Button, Modal, ModalHeader, ModalBody, ModalFooter,
  Form, FormGroup, Label, Input, Row, Col
} from 'reactstrap';
import { BASE_URL } from '../../utils/config';
import { saveAs } from 'file-saver';
import CountUp from 'react-countup';
import {
  FaClipboardList, FaClock, FaBan,
  FaEllipsisH, FaEnvelopeOpenText, FaMoneyBillAlt
} from 'react-icons/fa';

const EcuFileOrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const toggleUpdateModal = () => setUpdateModal(!updateModal);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage, setOrdersPerPage] = useState(10);

  const [createModal, setCreateModal] = useState(false);
  const [ecuFiles, setEcuFiles] = useState([]);
  const [newOrder, setNewOrder] = useState({
    fullName: '',
    email: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    engineCode: '',
    ecuFileId: '',
    ecuFileTitle: '',
    price: 0,
    paymentMethod: 'Online',
    status: 'pending',
    deliveryEmailSent: false,
    notes: ''
  });

  const fetchEcuFiles = async () => {
    try {
      const res = await fetch(`${BASE_URL}/ecufiles`);
      const data = await res.json();
      if (data.success) setEcuFiles(data.data);
    } catch (err) {
      console.error('Failed to fetch ECU files:', err);
    }
  };



  const fetchOrders = async () => {
    try {
      const res = await fetch(`${BASE_URL}/ecufileorders`, { credentials: 'include' });
      const data = await res.json();
      if (data.success) setOrders(data.data.reverse());
    } catch (err) {
      console.error('Failed to fetch ECU orders:', err);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchEcuFiles();
  }, []);


  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredOrders = orders.filter(order =>
    Object.values(order).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];

    if (valA == null || valB == null) return 0;

    if (['price'].includes(sortField)) {
      return sortDirection === 'asc' ? Number(valA) - Number(valB) : Number(valB) - Number(valA);
    }

    if (['createdAt', 'updatedAt'].includes(sortField)) {
      return sortDirection === 'asc' ? new Date(valA) - new Date(valB) : new Date(valB) - new Date(valA);
    }

    return sortDirection === 'asc'
      ? valA.toString().localeCompare(valB.toString())
      : valB.toString().localeCompare(valA.toString());
  });

  const indexOfLast = currentPage * ordersPerPage;
  const indexOfFirst = indexOfLast - ordersPerPage;
  const currentOrders = sortedOrders.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const statusCounts = orders.reduce((acc, order) => {
    const status = order.status || 'other';
    acc[status] = (acc[status] || 0) + 1;
    acc.total = (acc.total || 0) + 1;

    if (order.status === 'paid' && !order.deliveryEmailSent) {
      acc.awaiting = (acc.awaiting || 0) + 1;
    }

    return acc;
  }, {});


  const statusColor = {
    pending: 'warning',
    paid: 'success',
    emailed: 'info',
    cancelled: 'danger',
    other: 'secondary'
  };

  const renderStatusBadge = (status) => (
    <span className={`badge bg-${statusColor[status] || 'secondary'}`}>{status}</span>
  );

  const handleView = (order) => {
    setSelectedOrder(order);
    setViewModal(true);
  };

  const handleEdit = (order) => {
    setSelectedOrder(order);
    setUpdateModal(true);
  };

  const handleCreateOrder = async () => {
  try {
    const res = await fetch(`${BASE_URL}/ecufileorders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(newOrder)
    });
    const result = await res.json();
    if (result.success) {
      alert('Order created successfully');
      setCreateModal(false);
      setNewOrder({
        fullName: '',
        email: '',
        vehicleMake: '',
        vehicleModel: '',
        vehicleYear: '',
        engineCode: '',
        ecuFileId: '',
        ecuFileTitle: '',
        price: 0,
        paymentMethod: 'Online',
        status: 'pending',
        deliveryEmailSent: false,
        notes: ''
      });
      fetchOrders();
    } else {
      alert(`Failed to create order: ${result.message}`);
    }
  } catch (err) {
    console.error('Create error:', err);
  }
};


  const handleUpdate = async () => {
    try {
      const res = await fetch(`${BASE_URL}/ecufileorders/${selectedOrder._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(selectedOrder),
      });
      const data = await res.json();
      if (data.success) {
        alert('Order updated successfully');
        fetchOrders();
        setUpdateModal(false);
      }
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this order?')) return;
    try {
      const res = await fetch(`${BASE_URL}/ecufileorders/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const result = await res.json();
      if (result.success) {
        alert('Order deleted successfully');
        fetchOrders();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Full Name', 'Email', 'Vehicle Make', 'Model', 'Year', 'ECU File', 'Engine Code', 'Price', 'Payment', 'Status', 'Created At', 'Updated At'];
    const rows = currentOrders.map(order => [
      order.fullName, order.email, order.vehicleMake, order.vehicleModel,
      order.vehicleYear, order.ecuFileTitle, order.engineCode,
      order.price, order.paymentMethod, order.status,
      new Date(order.createdAt).toLocaleString(),
      new Date(order.updatedAt).toLocaleString()
    ]);
    const csv = [headers.join(','), ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `ECU_Orders_${new Date().toISOString()}.csv`);
  };

  return (
    <div className="container mt-4">
      {/* Dashboard Cards */}
      <div className="row g-2 mb-4">
        {[{ label: 'Total', icon: <FaClipboardList />, className: 'card-total', count: statusCounts.total },
          { label: 'Pending', icon: <FaEllipsisH />, className: 'card-pending', count: statusCounts.pending },
          { label: 'Paid', icon: <FaMoneyBillAlt />, className: 'card-paid', count: statusCounts.paid },
          { label: 'Emailed', icon: <FaEnvelopeOpenText />, className: 'card-emailed', count: statusCounts.emailed },
          { label: 'Cancelled', icon: <FaBan />, className: 'card-cancelled', count: statusCounts.cancelled },
          { label: 'Awaiting Email', icon: <FaClock />, className: 'card-awaiting', count: statusCounts.awaiting }].map(({ label, icon, className, count }) => (
          <div className="col-6 col-sm-6 col-md-4" key={label}>
            <div className={`card-status ${className}`}>
              {React.cloneElement(icon, { className: "animated-icon", size: 30 })}
              <h6>{label}</h6>
              <h4><CountUp end={count || 0} duration={2} /></h4>
            </div>
          </div>
        ))}
      </div>

      {/* Top Bar */}
      <div className="top-bar d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
        <h2>ECU File Orders</h2>

        <Button color="success" onClick={() => setCreateModal(true)}>
            + Add Order
        </Button>
        <div className="d-flex align-items-center gap-2">
          <Label className="mb-0">Search:</Label>
          <Input type="text" value={searchTerm} placeholder="name, email, vehicle..." onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <Button color="secondary" onClick={handleExportCSV}>Export CSV</Button>
      </div>

      {/* Orders Table */}
      <div style={{ overflowX: 'auto' }}>
        <Table striped bordered responsive className="ecufile-table">
          <thead>
            <tr>
              <th>#</th>
              {['fullName', 'email', 'ecuFileTitle', 'vehicleMake', 'vehicleModel', 'vehicleYear', 'engineCode', 'price', 'paymentMethod', 'status', 'Actions', 'createdAt', 'updatedAt'].map(field => (
                <th
                  key={field}
                  onClick={() => handleSort(field)}
                  style={{ cursor: 'pointer', backgroundColor: sortField === field ? '#e6f2ff' : 'transparent' }}
                >
                  {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')} {sortField === field ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order, i) => (
              <tr key={order._id}>
                <td>{indexOfFirst + i + 1}</td>
                <td>{order.fullName}</td>
                <td>{order.email}</td>
                <td>{order.ecuFileTitle}</td>
                <td>{order.vehicleMake}</td>
                <td>{order.vehicleModel}</td>
                <td>{order.vehicleYear}</td>
                <td>{order.engineCode}</td>
                <td>Ksh {order.price}</td>
                <td>{order.paymentMethod}</td>
                <td>{renderStatusBadge(order.status)}</td>
                <td>
                  <Button size="sm" color="info" className="me-1" onClick={() => handleView(order)}>View</Button>
                  <Button size="sm" color="warning" className="me-1" onClick={() => handleEdit(order)}>Edit</Button>
                  <Button size="sm" color="danger" onClick={() => handleDelete(order._id)}>Delete</Button>
                </td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td>{new Date(order.updatedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
        <Button color="secondary" disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>Previous</Button>
        <div className="d-flex flex-wrap gap-2">
          {[...Array(totalPages)].map((_, i) => (
            <Button key={i + 1} color={currentPage === i + 1 ? 'primary' : 'light'} onClick={() => setCurrentPage(i + 1)}>{i + 1}</Button>
          ))}
        </div>
        <Button color="secondary" disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}>Next</Button>
        <div className="d-flex align-items-center gap-2">
          <label className="me-2 mb-0">Show</label>
          <select className="form-select w-auto" value={ordersPerPage} onChange={(e) => {
            setOrdersPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}>
            {[5, 10, 25, 50, 100].map(num => <option key={num} value={num}>{num}</option>)}
          </select>
          <span className="ms-2">entries</span>
        </div>
      </div>

      {/* View modal*/}

      <Modal isOpen={viewModal} toggle={() => setViewModal(false)}>
      <ModalHeader toggle={() => setViewModal(false)}>Order Details</ModalHeader>
      <ModalBody>
        {selectedOrder && (
          <>
            <p><strong>Full Name:</strong> {selectedOrder.fullName}</p>
            <p><strong>Email:</strong> {selectedOrder.email}</p>
            <p><strong>Vehicle:</strong> {selectedOrder.vehicleMake} {selectedOrder.vehicleModel} ({selectedOrder.vehicleYear})</p>
            <p><strong>Engine Code:</strong> {selectedOrder.engineCode}</p>
            <p><strong>ECU File:</strong> {selectedOrder.ecuFileTitle}</p>
            <p><strong>Price:</strong> Ksh {selectedOrder.price}</p>
            <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>
            <p><strong>Status:</strong> {renderStatusBadge(selectedOrder.status)}</p>
            <p><strong>Email Sent:</strong> {selectedOrder.deliveryEmailSent ? 'Yes' : 'No'}</p>
            <p><strong>Notes:</strong> {selectedOrder.notes || 'None'}</p>
            <p><strong>Created At:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
            <p><strong>Updated At:</strong> {new Date(selectedOrder.updatedAt).toLocaleString()}</p>
          </>
        )}
      </ModalBody>
      <ModalFooter>
        <Button onClick={() => setViewModal(false)}>Close</Button>
      </ModalFooter>
    </Modal>

     {/* Edit modal*/}

    <Modal isOpen={updateModal} toggle={toggleUpdateModal} modalClassName="wide-modal">
      <ModalHeader toggle={toggleUpdateModal}>Edit ECU File Order</ModalHeader>
      <ModalBody>
        {selectedOrder && (
          <Form>
            <Row>
              {/* ECU File Dropdown (editable trigger) */}
              <Col md={6}>
                <FormGroup>
                  <Label>Select ECU File</Label>
                  <Input
                    type="select"
                    value={selectedOrder.ecuFileId}
                    onChange={(e) => {
                      const selected = ecuFiles.find(file => file._id === e.target.value);
                      if (selected) {
                        setSelectedOrder(prev => ({
                          ...prev,
                          ecuFileId: selected._id,
                          ecuFileTitle: selected.title,
                          price: selected.price,
                          vehicleMake: selected.vehicleMake,
                          vehicleModel: selected.vehicleModel,
                          vehicleYear: selected.vehicleYear,
                          engineCode: selected.engineCode
                        }));
                      }
                    }}
                  >
                    <option value="">-- Select ECU File --</option>
                    {ecuFiles.map(file => (
                      <option key={file._id} value={file._id}>
                        {file.title} - {file.vehicleMake} {file.vehicleModel} ({file.vehicleYear})
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>

              {/* ECU-related Fields (editable) */}
              <Col md={6}>
                <FormGroup>
                  <Label>ECU File Title</Label>
                  <Input
                    type="text"
                    value={selectedOrder.ecuFileTitle}
                    onChange={(e) =>
                      setSelectedOrder({ ...selectedOrder, ecuFileTitle: e.target.value })
                    }
                  />
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup>
                  <Label>Vehicle Make</Label>
                  <Input
                    type="text"
                    value={selectedOrder.vehicleMake}
                    onChange={(e) =>
                      setSelectedOrder({ ...selectedOrder, vehicleMake: e.target.value })
                    }
                  />
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup>
                  <Label>Vehicle Model</Label>
                  <Input
                    type="text"
                    value={selectedOrder.vehicleModel}
                    onChange={(e) =>
                      setSelectedOrder({ ...selectedOrder, vehicleModel: e.target.value })
                    }
                  />
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup>
                  <Label>Vehicle Year</Label>
                  <Input
                    type="text"
                    value={selectedOrder.vehicleYear}
                    onChange={(e) =>
                      setSelectedOrder({ ...selectedOrder, vehicleYear: e.target.value })
                    }
                  />
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup>
                  <Label>Engine Code</Label>
                  <Input
                    type="text"
                    value={selectedOrder.engineCode}
                    onChange={(e) =>
                      setSelectedOrder({ ...selectedOrder, engineCode: e.target.value })
                    }
                  />
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup>
                  <Label>Price</Label>
                  <Input
                    type="number"
                    value={selectedOrder.price}
                    onChange={(e) =>
                      setSelectedOrder({ ...selectedOrder, price: Number(e.target.value) })
                    }
                  />
                </FormGroup>
              </Col>

              {/* User Details */}
              <Col md={6}>
                <FormGroup>
                  <Label>Full Name</Label>
                  <Input
                    type="text"
                    value={selectedOrder.fullName}
                    onChange={(e) =>
                      setSelectedOrder({ ...selectedOrder, fullName: e.target.value })
                    }
                  />
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={selectedOrder.email}
                    onChange={(e) =>
                      setSelectedOrder({ ...selectedOrder, email: e.target.value })
                    }
                  />
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup>
                  <Label>Payment Method</Label>
                  <Input
                    type="select"
                    value={selectedOrder.paymentMethod}
                    onChange={(e) =>
                      setSelectedOrder({ ...selectedOrder, paymentMethod: e.target.value })
                    }
                  >
                    <option value="">-- Select --</option>
                    <option>Online</option>
                  </Input>
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup>
                  <Label>Status</Label>
                  <Input
                    type="select"
                    value={selectedOrder.status}
                    onChange={(e) =>
                      setSelectedOrder({ ...selectedOrder, status: e.target.value })
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="emailed">Emailed</option>
                    <option value="cancelled">Cancelled</option>
                  </Input>
                </FormGroup>
              </Col>

              <Col md={12}>
                <FormGroup>
                  <Label>Special Notes / Instructions</Label>
                  <Input
                    type="textarea"
                    value={selectedOrder.notes}
                    onChange={(e) =>
                      setSelectedOrder({ ...selectedOrder, notes: e.target.value })
                    }
                  />
                </FormGroup>
              </Col>
            </Row>
          </Form>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleUpdate}>Save Changes</Button>
        <Button color="secondary" onClick={toggleUpdateModal}>Cancel</Button>
      </ModalFooter>
    </Modal>


    {/* Add modal*/}
    <Modal isOpen={createModal} toggle={() => setCreateModal(!createModal)} modalClassName="wide-modal">
      <ModalHeader toggle={() => setCreateModal(!createModal)}>Add ECU File Order</ModalHeader>
      <ModalBody>
        <Form>
          <Row>
            {/* Select ECU File */}
            <Col md={6}>
              <FormGroup>
                <Label>Select ECU File</Label>
                <Input
                  type="select"
                  value={newOrder.ecuFileId}
                  onChange={(e) => {
                    const selected = ecuFiles.find(file => file._id === e.target.value);
                    if (selected) {
                      setNewOrder(prev => ({
                        ...prev,
                        ecuFileId: selected._id,
                        ecuFileTitle: selected.title,
                        price: selected.price,
                        vehicleMake: selected.vehicleMake,
                        vehicleModel: selected.vehicleModel,
                        vehicleYear: selected.vehicleYear,
                        engineCode: selected.engineCode
                      }));
                    }
                  }}
                >
                  <option value="">-- Select ECU File --</option>
                  {ecuFiles.map(file => (
                    <option key={file._id} value={file._id}>
                      {file.title} - {file.vehicleMake} {file.vehicleModel} ({file.vehicleYear})
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>

            {/* Editable ECU Fields */}
            <Col md={6}>
              <FormGroup>
                <Label>ECU File Title</Label>
                <Input
                  type="text"
                  value={newOrder.ecuFileTitle}
                  onChange={(e) => setNewOrder({ ...newOrder, ecuFileTitle: e.target.value })}
                />
              </FormGroup>
            </Col>

            <Col md={6}>
              <FormGroup>
                <Label>Vehicle Make</Label>
                <Input
                  type="text"
                  value={newOrder.vehicleMake}
                  onChange={(e) => setNewOrder({ ...newOrder, vehicleMake: e.target.value })}
                />
              </FormGroup>
            </Col>

            <Col md={6}>
              <FormGroup>
                <Label>Vehicle Model</Label>
                <Input
                  type="text"
                  value={newOrder.vehicleModel}
                  onChange={(e) => setNewOrder({ ...newOrder, vehicleModel: e.target.value })}
                />
              </FormGroup>
            </Col>

            <Col md={6}>
              <FormGroup>
                <Label>Vehicle Year</Label>
                <Input
                  type="text"
                  value={newOrder.vehicleYear}
                  onChange={(e) => setNewOrder({ ...newOrder, vehicleYear: e.target.value })}
                />
              </FormGroup>
            </Col>

            <Col md={6}>
              <FormGroup>
                <Label>Engine Code</Label>
                <Input
                  type="text"
                  value={newOrder.engineCode}
                  onChange={(e) => setNewOrder({ ...newOrder, engineCode: e.target.value })}
                />
              </FormGroup>
            </Col>

            <Col md={6}>
              <FormGroup>
                <Label>Price</Label>
                <Input
                  type="number"
                  value={newOrder.price}
                  onChange={(e) => setNewOrder({ ...newOrder, price: Number(e.target.value) })}
                />
              </FormGroup>
            </Col>

            {/* User Inputs */}
            <Col md={6}>
              <FormGroup>
                <Label>Full Name</Label>
                <Input
                  type="text"
                  value={newOrder.fullName}
                  onChange={(e) => setNewOrder({ ...newOrder, fullName: e.target.value })}
                />
              </FormGroup>
            </Col>

            <Col md={6}>
              <FormGroup>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={newOrder.email}
                  onChange={(e) => setNewOrder({ ...newOrder, email: e.target.value })}
                />
              </FormGroup>
            </Col>

            <Col md={6}>
              <FormGroup>
                <Label>Payment Method</Label>
                <Input
                  type="select"
                  value={newOrder.paymentMethod}
                  onChange={(e) => setNewOrder({ ...newOrder, paymentMethod: e.target.value })}
                >
                  <option value="">-- Select --</option>
                  <option>Online</option>
                </Input>
              </FormGroup>
            </Col>

            <Col md={12}>
              <FormGroup>
                <Label>Special Notes / Instructions</Label>
                <Input
                  type="textarea"
                  value={newOrder.notes}
                  onChange={(e) => setNewOrder({ ...newOrder, notes: e.target.value })}
                />
              </FormGroup>
            </Col>
          </Row>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleCreateOrder}>Submit Order</Button>
        <Button color="secondary" onClick={() => setCreateModal(false)}>Cancel</Button>
      </ModalFooter>
    </Modal>









    </div>
  );
};

export default EcuFileOrdersTable;
