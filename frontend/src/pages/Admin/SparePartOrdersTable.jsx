// SparePartOrdersTable.jsx
import React, { useEffect, useState } from 'react';
import {
  Table, Button, Modal, ModalHeader, ModalBody, ModalFooter,
  Form, FormGroup, Label, Input, Row, Col
} from 'reactstrap';
import { BASE_URL } from '../../utils/config';
import { saveAs } from 'file-saver';
import CountUp from 'react-countup';
import {
  FaClipboardList, FaPlusCircle, FaCheckCircle, FaTools,
  FaTimesCircle, FaBan, FaEllipsisH, FaTruck
} from 'react-icons/fa';

const SparePartOrdersTable = () => {
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
  const [spareParts, setSpareParts] = useState([]);

  const [createModal, setCreateModal] = useState(false);
    const [newOrder, setNewOrder] = useState({
    fullName: '',
    email: '',
    phone: '',
    sparePartId: '',
    partName: '',
    partNumber: '',
    quantity: 1,
    pricePerUnit: 0,
    totalPrice: 0,
    deliveryAddress: '',
    shippingOption: 'Pickup',
    paymentMethod: 'Online',
    specialInstructions: '',
    status: 'new'
    });

  

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${BASE_URL}/sparepartorders`, {
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) setOrders(data.data.reverse());
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
  };

  const fetchSpareParts = async () => {
  try {
    const res = await fetch(`${BASE_URL}/spareparts`);
    const data = await res.json();
    if (data.success) {
      setSpareParts(data.data);
    }
  } catch (err) {
    console.error('Failed to fetch spare parts:', err);
  }
};

  useEffect(() => {
    fetchOrders();
    fetchSpareParts();
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

    const numericFields = ['quantity', 'totalPrice'];

    // Sort numbers correctly
    if (numericFields.includes(sortField)) {
        return sortDirection === 'asc'
        ? Number(valA) - Number(valB)
        : Number(valB) - Number(valA);
    }

    // Sort dates
    if (['createdAt', 'updatedAt'].includes(sortField)) {
        return sortDirection === 'asc'
        ? new Date(valA) - new Date(valB)
        : new Date(valB) - new Date(valA);
    }

    // Default: sort strings
    return sortDirection === 'asc'
        ? valA.toString().localeCompare(valB.toString())
        : valB.toString().localeCompare(valA.toString());
    });


  const indexOfLast = currentPage * ordersPerPage;
  const indexOfFirst = indexOfLast - ordersPerPage;
  const currentOrders = sortedOrders.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const handleView = (order) => {
    setSelectedOrder(order);
    setViewModal(true);
  };

  const handleEdit = (order) => {
    setSelectedOrder(order);
    setUpdateModal(true);
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`${BASE_URL}/sparepartorders/${selectedOrder._id}`, {
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
      const res = await fetch(`${BASE_URL}/sparepartorders/${id}`, {
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

  const statusCounts = orders.reduce((acc, order) => {
    const status = order.status || 'other';
    acc[status] = (acc[status] || 0) + 1;
    acc.total = (acc.total || 0) + 1;
    return acc;
  }, {});

  const statusColor = {
    new: 'primary',
    processing: 'info',
    shipped: 'success',
    delivered: 'dark',
    cancelled: 'danger',
    other: 'secondary',
  };

  const renderStatusBadge = (status) => (
    <span className={`badge bg-${statusColor[status] || 'secondary'}`}>
      {status}
    </span>
  );
  const handleCreateOrder = async () => {
  try {
    const res = await fetch(`${BASE_URL}/sparepartorders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(newOrder)
    });
    const result = await res.json();
    if (result.success) {
      alert('Order created successfully');
            // ✅ Reset the form
      setNewOrder({
        fullName: '',
        email: '',
        phone: '',
        sparePartId: '',
        partName: '',
        partNumber: '',
        quantity: 1,
        pricePerUnit: 0,
        totalPrice: 0,
        deliveryAddress: '',
        shippingOption: '',
        paymentMethod: 'Online',
        status: 'new',
        specialInstructions: ''
      });



      setCreateModal(false);
      fetchOrders(); // <-- Make sure this exists
    } else {
      alert(`Failed to create order: ${result.message}`);
    }
  } catch (err) {
    console.error('Create error:', err);
  }
};


  const handleExportCSV = () => {
    const headers = [
      'Full Name', 'Email', 'Phone', 'Part Name', 'Part Number', 'Quantity',
      'Price/Unit', 'Total Price', 'Shipping Option', 'Payment Method',
      'Status', 'Created At', 'Updated At'
    ];

    const rows = currentOrders.map(order => [
      order.fullName,
      order.email,
      order.phone,
      order.partName,
      order.partNumber,
      order.quantity,
      order.pricePerUnit,
      order.totalPrice,
      order.shippingOption,
      order.paymentMethod,
      order.status,
      new Date(order.createdAt).toLocaleString(),
      new Date(order.updatedAt).toLocaleString()
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    saveAs(blob, `SparePartOrders_${timestamp}.csv`);
  };

  return (
    <div className="container mt-4">
      {/* Cards */}
      <div className="row g-2 mb-4">
        {[
          { label: 'Total Orders', icon: <FaClipboardList />, className: 'card-total', count: statusCounts.total },
          { label: 'New', icon: <FaPlusCircle />, className: 'card-new', count: statusCounts.new },
          { label: 'Processing', icon: <FaTools />, className: 'card-serviced', count: statusCounts.processing },
          { label: 'Shipped', icon: <FaTruck />, className: 'card-confirmed', count: statusCounts.shipped },
          { label: 'Delivered', icon: <FaCheckCircle />, className: 'card-completed', count: statusCounts.delivered },
          { label: 'Cancelled', icon: <FaBan />, className: 'card-cancelled', count: statusCounts.cancelled },
        ].map(({ label, icon, className, count }) => (
          <div className="col-6 col-sm-6 col-md-4" key={label}>
            <div className={`card-status ${className}`}>
              {React.cloneElement(icon, { className: "animated-icon", size: 30 })}
              <h6>{label}</h6>
              <h4><CountUp end={count || 0} duration={2} /></h4>
            </div>
          </div>
        ))}
      </div>

      {/* Filters and Export */}
      <div className="top-bar d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
        <h2>Spare Part Orders</h2>

        <Button color="success" onClick={() => setCreateModal(true)}>
            + Add Order
        </Button>
        <div className="d-flex align-items-center gap-2">
          <Label className="mb-0">Search:</Label>
          <Input
            type="text"
            value={searchTerm}
            placeholder="name, part, phone, status..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button color="secondary" onClick={handleExportCSV}>
          Export CSV
        </Button>
      </div>

      {/* Orders Table */}
      <div style={{ overflowX: 'auto' }}>
        <Table striped bordered responsive className="service-booking-table">
<thead>
  <tr>
    <th>#</th>

    <th
      onClick={() => handleSort('fullName')}
      style={{
        cursor: 'pointer',
        backgroundColor: sortField === 'fullName' ? '#e6f2ff' : 'transparent'
      }}
    >
      Full Name {sortField === 'fullName' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
    </th>

    <th
      onClick={() => handleSort('email')}
      style={{
        cursor: 'pointer',
        backgroundColor: sortField === 'email' ? '#e6f2ff' : 'transparent'
      }}
    >
      Email {sortField === 'email' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
    </th>

    <th>Phone</th>

    <th
      onClick={() => handleSort('partName')}
      style={{
        cursor: 'pointer',
        backgroundColor: sortField === 'partName' ? '#e6f2ff' : 'transparent'
      }}
    >
      Part Name {sortField === 'partName' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
    </th>

    <th>Part Number</th>

    <th
      onClick={() => handleSort('quantity')}
      style={{
        cursor: 'pointer',
        backgroundColor: sortField === 'quantity' ? '#e6f2ff' : 'transparent'
      }}
    >
      Qty {sortField === 'quantity' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
    </th>

    <th
      onClick={() => handleSort('totalPrice')}
      style={{
        cursor: 'pointer',
        backgroundColor: sortField === 'totalPrice' ? '#e6f2ff' : 'transparent'
      }}
    >
      Total {sortField === 'totalPrice' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
    </th>

    <th
      onClick={() => handleSort('shippingOption')}
      style={{
        cursor: 'pointer',
        backgroundColor: sortField === 'shippingOption' ? '#e6f2ff' : 'transparent'
      }}
    >
      Shipping {sortField === 'shippingOption' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
    </th>

    <th
      onClick={() => handleSort('paymentMethod')}
      style={{
        cursor: 'pointer',
        backgroundColor: sortField === 'paymentMethod' ? '#e6f2ff' : 'transparent'
      }}
    >
      Payment {sortField === 'paymentMethod' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
    </th>

    <th
      onClick={() => handleSort('status')}
      style={{
        cursor: 'pointer',
        backgroundColor: sortField === 'status' ? '#e6f2ff' : 'transparent'
      }}
    >
      Status {sortField === 'status' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
    </th>

    <th>Actions</th>

    <th
      onClick={() => handleSort('createdAt')}
      style={{
        cursor: 'pointer',
        backgroundColor: sortField === 'createdAt' ? '#e6f2ff' : 'transparent'
      }}
    >
      Created At {sortField === 'createdAt' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
    </th>

    <th
      onClick={() => handleSort('updatedAt')}
      style={{
        cursor: 'pointer',
        backgroundColor: sortField === 'updatedAt' ? '#e6f2ff' : 'transparent'
      }}
    >
      Updated At {sortField === 'updatedAt' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
    </th>
  </tr>
</thead>

          <tbody>
            {currentOrders.map((order, i) => (
              <tr key={order._id}>
                <td>{indexOfFirst + i + 1}</td>
                <td>{order.fullName}</td>
                <td>{order.email}</td>
                <td>{order.phone}</td>
                <td>{order.partName}</td>
                <td>{order.partNumber}</td>
                <td>{order.quantity}</td>
                <td>Ksh {order.totalPrice}</td>
                <td>{order.shippingOption}</td>
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
            value={ordersPerPage}
            onChange={(e) => {
            setOrdersPerPage(Number(e.target.value));
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
      <Modal isOpen={viewModal} toggle={() => setViewModal(false)}>
        <ModalHeader toggle={() => setViewModal(false)}>Order Details</ModalHeader>
        <ModalBody>
          {selectedOrder && (
            <>
                <p><strong>Full Name:</strong> {selectedOrder.fullName}</p>
                <p><strong>Email:</strong> {selectedOrder.email}</p>
                <p><strong>Phone:</strong> {selectedOrder.phone}</p>
                <p><strong>Part Name:</strong> {selectedOrder.partName}</p>
                <p><strong>Part Number:</strong> {selectedOrder.partNumber}</p>
                <p><strong>Quantity:</strong> {selectedOrder.quantity}</p>
                <p><strong>Price Per Unit:</strong> Ksh {selectedOrder.pricePerUnit}</p>
                <p><strong>Total Price:</strong> Ksh {selectedOrder.totalPrice}</p>
                <p><strong>Status:</strong> {renderStatusBadge(selectedOrder.status)}</p>
                <p><strong>Shipping Option:</strong> {selectedOrder.shippingOption}</p>
                <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>
                <p><strong>Delivery Address:</strong> {selectedOrder.deliveryAddress}</p>
                <p><strong>Special Instructions:</strong> {selectedOrder.specialInstructions || "None"}</p>
                <p><strong>Created At:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                <p><strong>Updated At:</strong> {new Date(selectedOrder.updatedAt).toLocaleString()}</p>
                    </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => setViewModal(false)}>Close</Button>
        </ModalFooter>
      </Modal>  

      {/* Edit Modal */}
        <Modal isOpen={updateModal} toggle={toggleUpdateModal} modalClassName="wide-modal">
        <ModalHeader toggle={toggleUpdateModal}>Edit Order</ModalHeader>
        <ModalBody>
            {selectedOrder && (
            <Form>
                <Row>
                {/* Spare Part Selector */}
                <Col md={6}>
                    <FormGroup>
                    <Label>Select Spare Part</Label>
                    <Input
                        type="select"
                        value={selectedOrder.sparePartId}
                        onChange={(e) => {
                        const selected = spareParts.find(p => p._id === e.target.value);
                        if (selected) {
                            setSelectedOrder(prev => ({
                            ...prev,
                            sparePartId: selected._id,
                            partName: selected.name,
                            partNumber: selected.partNumber,
                            pricePerUnit: selected.price,
                            quantity: 1,
                            totalPrice: selected.price
                            }));
                        }
                        }}
                    >
                        <option value="">-- Select a spare part --</option>
                        {spareParts.map(part => (
                        <option key={part._id} value={part._id}>
                            {part.name} ({part.partNumber})
                        </option>
                        ))}
                    </Input>
                    </FormGroup>
                </Col>

                {/* Autofilled Details */}
                <Col md={6}>
                    <FormGroup>
                    <Label>Part Name</Label>
                    <Input type="text" value={selectedOrder.partName || ''} readOnly />
                    </FormGroup>
                </Col>

                <Col md={6}>
                    <FormGroup>
                    <Label>Part Number</Label>
                    <Input type="text" value={selectedOrder.partNumber || ''} readOnly />
                    </FormGroup>
                </Col>

                <Col md={6}>
                    <FormGroup>
                    <Label>Price Per Unit</Label>
                    <Input type="number" value={selectedOrder.pricePerUnit || ''} readOnly />
                    </FormGroup>
                </Col>

                <Col md={6}>
                    <FormGroup>
                    <Label>Quantity</Label>
                    <Input
                        type="number"
                        min="1"
                        value={selectedOrder.quantity || 1}
                        onChange={(e) => {
                        const qty = Number(e.target.value);
                        setSelectedOrder(prev => ({
                            ...prev,
                            quantity: qty,
                            totalPrice: prev.pricePerUnit * qty
                        }));
                        }}
                    />
                    </FormGroup>
                </Col>

                <Col md={6}>
                    <FormGroup>
                    <Label>Total Price</Label>
                    <Input type="number" value={selectedOrder.totalPrice || ''} readOnly />
                    </FormGroup>
                </Col>

                {/* Customer & Order Info */}
                <Col md={6}>
                    <FormGroup>
                    <Label>Full Name</Label>
                    <Input
                        type="text"
                        value={selectedOrder.fullName || ''}
                        onChange={(e) => setSelectedOrder({ ...selectedOrder, fullName: e.target.value })}
                    />
                    </FormGroup>
                </Col>

                <Col md={6}>
                    <FormGroup>
                    <Label>Email</Label>
                    <Input
                        type="email"
                        value={selectedOrder.email || ''}
                        onChange={(e) => setSelectedOrder({ ...selectedOrder, email: e.target.value })}
                    />
                    </FormGroup>
                </Col>

                <Col md={6}>
                    <FormGroup>
                    <Label>Phone</Label>
                    <Input
                        type="text"
                        value={selectedOrder.phone || ''}
                        onChange={(e) => setSelectedOrder({ ...selectedOrder, phone: e.target.value })}
                    />
                    </FormGroup>
                </Col>

                <Col md={6}>
                    <FormGroup>
                    <Label>Delivery Address</Label>
                    <Input
                        type="text"
                        value={selectedOrder.deliveryAddress || ''}
                        onChange={(e) => setSelectedOrder({ ...selectedOrder, deliveryAddress: e.target.value })}
                    />
                    </FormGroup>
                </Col>

                <Col md={6}>
                    <FormGroup>
                    <Label>Shipping Option</Label>
                    <Input
                        type="select"
                        value={selectedOrder.shippingOption || ''}
                        onChange={(e) => setSelectedOrder({ ...selectedOrder, shippingOption: e.target.value })}
                    >
                        <option value="">-- Select --</option>
                        <option>Pickup</option>
                        <option>Courier</option>
                    </Input>
                    </FormGroup>
                </Col>

                <Col md={6}>
                    <FormGroup>
                    <Label>Payment Method</Label>
                    <Input
                        type="select"
                        value={selectedOrder.paymentMethod || ''}
                        onChange={(e) => setSelectedOrder({ ...selectedOrder, paymentMethod: e.target.value })}
                    >
                        <option>Online</option>
                        <option>Pay-on-Delivery</option>
                    </Input>
                    </FormGroup>
                </Col>

                <Col md={6}>
                    <FormGroup>
                    <Label>Status</Label>
                    <Input
                        type="select"
                        value={selectedOrder.status}
                        onChange={(e) => setSelectedOrder({ ...selectedOrder, status: e.target.value })}
                    >
                        {['new', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
                        <option key={status} value={status}>
                            {status}
                        </option>
                        ))}
                    </Input>
                    </FormGroup>
                </Col>

                <Col md={12}>
                    <FormGroup>
                    <Label>Special Instructions</Label>
                    <Input
                        type="textarea"
                        value={selectedOrder.specialInstructions || ''}
                        onChange={(e) => setSelectedOrder({ ...selectedOrder, specialInstructions: e.target.value })}
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


      {/* Add Modal */}
        <Modal isOpen={createModal} toggle={() => setCreateModal(!createModal)} modalClassName="wide-modal">
        <ModalHeader toggle={() => setCreateModal(!createModal)}>Add New Order</ModalHeader>
        <ModalBody>
            <Form>
            <Row>
                {/* Spare Part Selector */}
                <Col md={6}>
                <FormGroup>
                    <Label>Select Spare Part</Label>
                    <Input
                    type="select"
                    value={newOrder.sparePartId}
                    onChange={(e) => {
                        const selected = spareParts.find(p => p._id === e.target.value);
                        if (selected) {
                        setNewOrder(prev => ({
                            ...prev,
                            sparePartId: selected._id,
                            partName: selected.name,
                            partNumber: selected.partNumber,
                            pricePerUnit: selected.price,
                            quantity: 1,
                            totalPrice: selected.price
                        }));
                        }
                    }}
                    >
                    <option value="">-- Select a spare part --</option>
                    {spareParts.map(part => (
                        <option key={part._id} value={part._id}>
                        {part.name} ({part.partNumber})
                        </option>
                    ))}
                    </Input>
                </FormGroup>
                </Col>

                {/* Autofilled Fields */}
                <Col md={6}>
                <FormGroup>
                    <Label>Part Name</Label>
                    <Input type="text" value={newOrder.partName || ''} readOnly />
                </FormGroup>
                </Col>

                <Col md={6}>
                <FormGroup>
                    <Label>Part Number</Label>
                    <Input type="text" value={newOrder.partNumber || ''} readOnly />
                </FormGroup>
                </Col>

                <Col md={6}>
                <FormGroup>
                    <Label>Price Per Unit</Label>
                    <Input type="number" value={newOrder.pricePerUnit || ''} readOnly />
                </FormGroup>
                </Col>

                <Col md={6}>
                <FormGroup>
                    <Label>Quantity</Label>
                    <Input
                    type="number"
                    min="1"
                    value={newOrder.quantity || 1}
                    onChange={(e) => {
                        const qty = Number(e.target.value);
                        setNewOrder(prev => ({
                        ...prev,
                        quantity: qty,
                        totalPrice: prev.pricePerUnit * qty
                        }));
                    }}
                    />
                </FormGroup>
                </Col>

                <Col md={6}>
                <FormGroup>
                    <Label>Total Price</Label>
                    <Input type="number" value={newOrder.totalPrice || ''} readOnly />
                </FormGroup>
                </Col>

                {/* User Input Fields */}
                <Col md={6}>
                <FormGroup>
                    <Label>Full Name</Label>
                    <Input
                    type="text"
                    value={newOrder.fullName || ''}
                    onChange={(e) => setNewOrder({ ...newOrder, fullName: e.target.value })}
                    />
                </FormGroup>
                </Col>

                <Col md={6}>
                <FormGroup>
                    <Label>Email</Label>
                    <Input
                    type="email"
                    value={newOrder.email || ''}
                    onChange={(e) => setNewOrder({ ...newOrder, email: e.target.value })}
                    />
                </FormGroup>
                </Col>

                <Col md={6}>
                <FormGroup>
                    <Label>Phone</Label>
                    <Input
                    type="text"
                    value={newOrder.phone || ''}
                    onChange={(e) => setNewOrder({ ...newOrder, phone: e.target.value })}
                    />
                </FormGroup>
                </Col>

                <Col md={6}>
                <FormGroup>
                    <Label>Delivery Address</Label>
                    <Input
                    type="text"
                    value={newOrder.deliveryAddress || ''}
                    onChange={(e) => setNewOrder({ ...newOrder, deliveryAddress: e.target.value })}
                    />
                </FormGroup>
                </Col>

                <Col md={6}>
                <FormGroup>
                    <Label>Shipping Option</Label>
                    <Input
                    type="select"
                    value={newOrder.shippingOption || ''}
                    onChange={(e) => setNewOrder({ ...newOrder, shippingOption: e.target.value })}
                    >
                    <option value="">-- Select --</option>
                    <option>Pickup</option>
                    <option>Courier</option>
                    </Input>
                </FormGroup>
                </Col>

                <Col md={6}>
                <FormGroup>
                    <Label>Payment Method</Label>
                    <Input
                    type="select"
                    value={newOrder.paymentMethod || ''}
                    onChange={(e) => setNewOrder({ ...newOrder, paymentMethod: e.target.value })}
                    >
                    <option>Online</option>
                    <option>Pay-on-Delivery</option>
                    </Input>
                </FormGroup>
                </Col>

                <Col md={12}>
                <FormGroup>
                    <Label>Special Instructions</Label>
                    <Input
                    type="textarea"
                    value={newOrder.specialInstructions || ''}
                    onChange={(e) => setNewOrder({ ...newOrder, specialInstructions: e.target.value })}
                    />
                </FormGroup>
                </Col>
            </Row>
            </Form>
        </ModalBody>
        <ModalFooter>
            <Button color="primary" onClick={handleCreateOrder}>
            Add Order
            </Button>
            <Button color="secondary" onClick={() => setCreateModal(false)}>
            Cancel
            </Button>
        </ModalFooter>
        </Modal>
     
    </div>
  );
};

export default SparePartOrdersTable;
