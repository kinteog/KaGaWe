import React, { useEffect, useState } from 'react';
import {
  Table, Button, Modal, ModalHeader, ModalBody, ModalFooter,
  Form, FormGroup, Label, Input, Row, Col
} from 'reactstrap';
import { BASE_URL } from '../../utils/config';
import CountUp from 'react-countup';
import {
  FaClipboardList, FaTools, FaCommentDots, FaStar, FaEdit
} from 'react-icons/fa';
import './admin.css';

const AdminServicesPage = () => {
  const [services, setServices] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    category: '',
    estimatedDuration: '',
    priceRange: '',
    photo: '',
    bookingOptions: {
        onlinePayment: false,
        depositRequired: false,
        payOnArrival: false
    },
    featured: false
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');

  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);


    const handleSort = (field) => {
    if (sortField === field) {
        setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
        setSortField(field);
        setSortDirection('asc');
    }
    };

const [allCategories, setAllCategories] = useState([]);

useEffect(() => {
  // Extract unique categories
  const categories = [...new Set(services.map(service => service.category))];
  setAllCategories(categories);
}, [services]);


const calculateAvgRating = (reviews = []) => {
  if (reviews.length === 0) return { avgRating: 0, totalReviews: 0 };
  const total = reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
  return {
    avgRating: total / reviews.length,
    totalReviews: reviews.length
  };
};

const filteredAndSortedServices = [...services]
  .map(service => {
    const { avgRating, totalReviews } = calculateAvgRating(service.reviews || []);
    return { ...service, _avgRating: avgRating, _totalReviews: totalReviews };
  })
  .filter(service => {
    const term = searchTerm.toLowerCase();
    return (
      service.name?.toLowerCase().includes(term) ||
      service.description?.toLowerCase().includes(term) ||
      service.category?.toLowerCase().includes(term) ||
      service.priceRange?.toLowerCase().includes(term) ||
      service.estimatedDuration?.toLowerCase().includes(term) ||
      (typeof service.featured === 'boolean' &&
        (service.featured ? 'yes' : 'no').includes(term))
    );
  })
  .sort((a, b) => {
    if (!sortField) return 0;

    let valA, valB;

    if (sortField === 'rating') {
      valA = a._avgRating;
      valB = b._avgRating;
    } else {
      valA = a[sortField];
      valB = b[sortField];
    }

    if (valA === undefined || valB === undefined) return 0;

    // Handle dates
    if (['createdAt', 'updatedAt'].includes(sortField)) {
      return sortDirection === 'asc'
        ? new Date(valA) - new Date(valB)
        : new Date(valB) - new Date(valA);
    }

    // Handle booleans
    if (typeof valA === 'boolean' && typeof valB === 'boolean') {
      return sortDirection === 'asc'
        ? (valA === valB ? 0 : valA ? -1 : 1)
        : (valA === valB ? 0 : valA ? 1 : -1);
    }

    // Handle numbers
    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortDirection === 'asc' ? valA - valB : valB - valA;
    }

    // Fallback to string comparison
    return sortDirection === 'asc'
      ? valA.toString().localeCompare(valB.toString())
      : valB.toString().localeCompare(valA.toString());
  });

  const fetchServices = async () => {
    try {
      const res = await fetch(`${BASE_URL}/services/admin/all`);
      const data = await res.json();
      if (data.success) setServices(data.data.reverse());
    } catch (err) {
      console.error('Failed to fetch services:', err);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);
  useEffect(() => {
}, [services]);

useEffect(() => {
  if (!createModal && !editModal) {
    setIsAddingNewCategory(false);
  }
}, [createModal, editModal]);



  const handleCreateService = async () => {
    try {
      const res = await fetch(`${BASE_URL}/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newService)
      });
      const result = await res.json();
      if (result.success) {
        alert('Service created');
        setCreateModal(false);
        setNewService({ name: '', description: '', category: '', estimatedDuration: '', priceRange: '', photo: '' });
        fetchServices();
      } else {
        alert('Failed to create service');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateService = async () => {
    try {
      const res = await fetch(`${BASE_URL}/services/${selectedService._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(selectedService)
      });
      const result = await res.json();
      if (result.success) {
        alert('Service updated');
        setEditModal(false);
        fetchServices();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      const res = await fetch(`${BASE_URL}/services/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const result = await res.json();
      if (result.success) {
        alert('Service deleted');
        fetchServices();
      }
    } catch (err) {
      console.error(err);
    }
  };

const handleExportCSV = () => {
  if (!services.length) return;

  const headers = [
    'Service Name',
    'Description',
    'Category',
    'Price Range',
    'Estimated Duration',
    'Featured',
    'Online Payment',
    'Deposit Required',
    'Pay on Arrival',
    'Photo URL',
    'Avg Rating',
    'Total Reviews',
    'Created At',
    'Updated At'
  ];

  const rows = services.map(service => {
    const { avgRating, totalReviews } = calculateAvgRating(service.reviews || []);
    return [
      service.name,
      service.description,
      service.category,
      service.priceRange,
      service.estimatedDuration,
      service.featured ? 'Yes' : 'No',
      service.bookingOptions?.onlinePayment ? 'Yes' : 'No',
      service.bookingOptions?.depositRequired ? 'Yes' : 'No',
      service.bookingOptions?.payOnArrival ? 'Yes' : 'No',
      service.photo,
      avgRating.toFixed(1),
      totalReviews,
      new Date(service.createdAt).toLocaleString(),
      new Date(service.updatedAt).toLocaleString()
    ];
  });

  const csvContent = [headers, ...rows]
    .map(row => row.map(val => `"${val}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, '-'); // e.g., "2025-07-08T13-20-45-123Z"
  link.download = `services-${timestamp}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};



  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

    const totalPages = Math.ceil(filteredAndSortedServices.length / itemsPerPage);
    const currentItems = filteredAndSortedServices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
    );

const countStats = {
  total: services.length,
  categories: new Set(services.map(s => s.category)).size,
  featured: services.filter(s => s.featured).length,
  reviewed: services.filter(s => (s.reviews?.length || 0) > 0).length
};


  return (
<div className="container mt-4">
<div className="row g-2 mb-4">
  {[
    {
      label: 'Total Services',
      className: 'card-total',
      icon: <FaClipboardList />,
      count: countStats.total
    },
    {
      label: 'Services Categories',
      className: 'card-serviced',
      icon: <FaTools />,
      count: countStats.categories
    },
    {
      label: 'Featured Services',
      className: 'card-confirmed',
      icon: <FaStar />,
      count: countStats.featured
    },
    {
      label: 'Reviewed Services',
      className: 'card-reviewed',
      icon: <FaCommentDots />,
      count: countStats.reviewed
    }
  ].map(({ label, className, icon, count }) => (
    <div className="col-6 col-sm-6 col-md-3" key={label}>
      <div className={`card-status ${className}`}>
        {React.cloneElement(icon, { className: 'animated-icon', size: 30 })}
        <h6>{label}</h6>
        <h4><CountUp end={count || 0} duration={2} /></h4>
      </div>
    </div>
  ))}
</div>


    <div className="top-bar d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
    <h2>Services</h2>

    <Button color="success" onClick={() => setCreateModal(true)}>
        + Add Service
    </Button>

    <div className="d-flex align-items-center flex-wrap gap-2">
        <label className="mb-0">Search:</label>
        <div className="flex-grow-1 flex-md-grow-0" style={{ minWidth: '250px', maxWidth: '400px' }}>
        <Input
            type="text"
            placeholder="Search name, description, category, price, duration, featured..."
            value={searchTerm}
            onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
            }}
        />
        </div>
    </div>
    <Button color="secondary" onClick={handleExportCSV}>
    Export CSV
    </Button>

    </div>

      

<Table striped bordered responsive className="service-table">
<thead>
  <tr>
    <th>#</th>
    <th
      onClick={() => handleSort('name')}
      className={sortField === 'name' ? 'sorted-column' : ''}
      style={{ cursor: 'pointer' }}
    >
      Service Name {sortField === 'name' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
    </th>
    <th
      onClick={() => handleSort('description')}
      className={sortField === 'description' ? 'sorted-column' : ''}
      style={{ cursor: 'pointer' }}
    >
      Description {sortField === 'description' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
    </th>
    <th
      onClick={() => handleSort('category')}
      className={sortField === 'category' ? 'sorted-column' : ''}
      style={{ cursor: 'pointer' }}
    >
      Category {sortField === 'category' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
    </th>
    <th
      onClick={() => handleSort('priceRange')}
      className={sortField === 'priceRange' ? 'sorted-column' : ''}
      style={{ cursor: 'pointer' }}
    >
      Price Range {sortField === 'priceRange' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
    </th>
    
    <th
      onClick={() => handleSort('estimatedDuration')}
      className={sortField === 'estimatedDuration' ? 'sorted-column' : ''}
      style={{ cursor: 'pointer' }}
    >
      Estimated Duration {sortField === 'estimatedDuration' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
    </th>
    <th>Photo</th>
    <th>Booking Options</th>
    <th
      onClick={() => handleSort('featured')}
      className={sortField === 'featured' ? 'sorted-column' : ''}
      style={{ cursor: 'pointer' }}
    >
      Featured {sortField === 'featured' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
    </th>
    <th
    onClick={() => handleSort('rating')}
    className={sortField === 'rating' ? 'sorted-column' : ''}
    style={{ cursor: 'pointer' }}
    >
    Rating {sortField === 'rating' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
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
    {currentItems.map((service, index) => (
      <tr key={service._id}>
        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
        <td>{service.name}</td>
        <td>{service.description}</td>
        <td>{service.category}</td>
        <td>{service.priceRange}</td>
        <td>{service.estimatedDuration}</td>
        <td>
          <img src={service.photo} alt={service.name} style={{ width: '80px', height: 'auto' }} />
        </td>
        <td>
          <ul style={{ paddingLeft: "1rem", margin: 0 }}>
            <li>Online: {service.bookingOptions?.onlinePayment ? 'Yes' : 'No'}</li>
            <li>Deposit: {service.bookingOptions?.depositRequired ? 'Yes' : 'No'}</li>
            <li>Pay on Arrival: {service.bookingOptions?.payOnArrival ? 'Yes' : 'No'}</li>
          </ul>
        </td>
        <td>{service.featured ? 'Yes' : 'No'}</td>
        <td>
        {service._totalReviews > 0
            ? `${service._avgRating.toFixed(1)} (${service._totalReviews})`
            : 'N/A'}
        </td>

        <td>
          <Button size="sm" color="info" className="me-1" onClick={() => { setSelectedService(service); setViewModal(true); }}>View</Button>
          <Button size="sm" color="warning" className="me-1" onClick={() => { setSelectedService(service); setEditModal(true); }}>Edit</Button>
          <Button size="sm" color="danger" onClick={() => handleDeleteService(service._id)}>Delete</Button>
        </td>
        <td>{new Date(service.createdAt).toLocaleString()}</td>
        <td>{new Date(service.updatedAt).toLocaleString()}</td>
      </tr>
    ))}
  </tbody>
</Table>



      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center mt-3">


        <Button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Previous</Button>
        <div>
          {[...Array(totalPages)].map((_, i) => (
            <Button key={i + 1} color={i + 1 === currentPage ? 'primary' : 'light'} onClick={() => setCurrentPage(i + 1)}>
              {i + 1}
            </Button>
          ))}
        </div>
        <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next</Button>

        <div className="d-flex justify-content-between align-items-center mb-2">
            <div>
                <Label for="entriesPerPage" className="me-2">Show</Label>
                <Input
                id="entriesPerPage"
                type="select"
                value={itemsPerPage}
                onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1); // Reset to page 1
                }}
                style={{ display: 'inline-block', width: 'auto' }}
                >
                {[5, 10, 20, 50, 100].map(n => (
                    <option key={n} value={n}>{n}</option>
                ))}
                </Input>
                <span className="ms-2">entries</span>
            </div>
        </div>
      </div>

      {/* View Modal */}
      <Modal isOpen={viewModal} toggle={() => setViewModal(false)}>
        <ModalHeader toggle={() => setViewModal(false)}>Service Details</ModalHeader>
            <ModalBody>
            {selectedService && (
                <>
                <p><strong>Service Name:</strong> {selectedService.name}</p>
                <p><strong>Description:</strong> {selectedService.description}</p>
                <p><strong>Category:</strong> {selectedService.category}</p>
                <p><strong>Price Range:</strong> {selectedService.priceRange}</p>
                <p><strong>Estimated Duration:</strong> {selectedService.estimatedDuration}</p>

                <p><strong>Photo:</strong></p>
                <img src={selectedService.photo} alt={selectedService.name} style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }} />

                <p><strong>Booking Options:</strong></p>
                <ul>
                    <li>Online Payment: {selectedService.bookingOptions?.onlinePayment ? 'Yes' : 'No'}</li>
                    <li>Deposit Required: {selectedService.bookingOptions?.depositRequired ? 'Yes' : 'No'}</li>
                    <li>Pay on Arrival: {selectedService.bookingOptions?.payOnArrival ? 'Yes' : 'No'}</li>
                </ul>

                <p><strong>Featured:</strong> {selectedService.featured ? 'Yes' : 'No'}</p>
                </>
            )}
            </ModalBody>

        <ModalFooter><Button onClick={() => setViewModal(false)}>Close</Button></ModalFooter>
      </Modal>

      {/* Create / Edit Modals */}
      {[{ modal: createModal, setModal: setCreateModal, data: newService, setData: setNewService, action: handleCreateService, label: 'Add New Service' },
        { modal: editModal, setModal: setEditModal, data: selectedService, setData: setSelectedService, action: handleUpdateService, label: 'Edit Service' }]
        .map(({ modal, setModal, data, setData, action, label }) => (
          <Modal key={label} isOpen={modal} toggle={() => setModal(false)}>
            <ModalHeader toggle={() => setModal(false)}>{label}</ModalHeader>
            <ModalBody>
                <Form>
                {/* Text Inputs */}
                {[
                { key: 'name', label: 'Service Name' },
                { key: 'description', label: 'Description' },
                { key: 'priceRange', label: 'Price Range' },
                { key: 'estimatedDuration', label: 'Estimated Duration' },
                { key: 'photo', label: 'Photo URL' }
                ].map(({ key, label }) => (
                <FormGroup key={key}>
                    <Label>{label}</Label>
                    {key === 'description' ? (
                    <Input
                        type="textarea"
                        rows="4"
                        value={data?.[key] || ''}
                        onChange={(e) =>
                        setData((prev) => ({ ...prev, [key]: e.target.value }))
                        }
                    />
                    ) : (
                    <Input
                        type="text"
                        value={data?.[key] || ''}
                        onChange={(e) =>
                        setData((prev) => ({ ...prev, [key]: e.target.value }))
                        }
                    />
                    )}
                </FormGroup>
                ))}


                <FormGroup>
                <Label>Category</Label>
                {!isAddingNewCategory ? (
                    <>
                    <Input
                        type="select"
                        value={data?.category || ''}
                        onChange={(e) => {
                        if (e.target.value === '__new__') {
                            setIsAddingNewCategory(true);
                            setData(prev => ({ ...prev, category: '' }));
                        } else {
                            setData(prev => ({ ...prev, category: e.target.value }));
                        }
                        }}
                    >
                        <option value="">-- Select Category --</option>
                        {allCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                        ))}
                        <option value="__new__">+ Add new category</option>
                    </Input>
                    </>
                ) : (
                    <>
                    <Input
                        type="text"
                        placeholder="Enter new category"
                        value={data?.category || ''}
                        onChange={(e) => setData(prev => ({ ...prev, category: e.target.value }))}
                    />
                    <Button color="link" size="sm" onClick={() => {
                        setIsAddingNewCategory(false);
                        setData(prev => ({ ...prev, category: '' }));
                    }}>
                        Cancel
                    </Button>
                    </>
                )}
                </FormGroup>


                {/* Booking Options */}
                <FormGroup>
                    <Label>Booking Options</Label>
                    <div className="form-check">
                    <Input
                        type="checkbox"
                        className="form-check-input"
                        checked={data?.bookingOptions?.onlinePayment || false}
                        onChange={(e) =>
                        setData(prev => ({
                            ...prev,
                            bookingOptions: {
                            ...prev.bookingOptions,
                            onlinePayment: e.target.checked
                            }
                        }))
                        }
                    />{' '}
                    Online Payment
                    </div>
                    <div className="form-check">
                    <Input
                        type="checkbox"
                        className="form-check-input"
                        checked={data?.bookingOptions?.depositRequired || false}
                        onChange={(e) =>
                        setData(prev => ({
                            ...prev,
                            bookingOptions: {
                            ...prev.bookingOptions,
                            depositRequired: e.target.checked
                            }
                        }))
                        }
                    />{' '}
                    Deposit Required
                    </div>
                    <div className="form-check">
                    <Input
                        type="checkbox"
                        className="form-check-input"
                        checked={data?.bookingOptions?.payOnArrival || false}
                        onChange={(e) =>
                        setData(prev => ({
                            ...prev,
                            bookingOptions: {
                            ...prev.bookingOptions,
                            payOnArrival: e.target.checked
                            }
                        }))
                        }
                    />{' '}
                    Pay on Arrival
                    </div>
                </FormGroup>

                {/* Featured */}
                <FormGroup check>
                    <Label check>
                    <Input
                        type="checkbox"
                        checked={data?.featured || false}
                        onChange={(e) => setData(prev => ({ ...prev, featured: e.target.checked }))}
                    />{' '}
                    Featured
                    </Label>
                </FormGroup>
                </Form>

            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={action}>Save</Button>
              <Button color="secondary" onClick={() => setModal(false)}>Cancel</Button>
            </ModalFooter>
          </Modal>
        ))}
    </div>
  );
};

export default AdminServicesPage;
