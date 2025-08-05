import React, { useEffect, useState } from 'react';
import {
  Table, Button, Modal, ModalHeader, ModalBody, ModalFooter,
  Form, FormGroup, Label, Input, Row, Col
} from 'reactstrap';
import { BASE_URL } from '../../utils/config';
import CountUp from 'react-countup';
import {
  FaClipboardList, FaTools, FaCommentDots, FaStar
} from 'react-icons/fa';
import './admin.css';

const AdminSparePartsPage = () => {
  const [spareParts, setSpareParts] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);
  const [newPart, setNewPart] = useState({
    name: '',
    description: '',
    category: '',
    manufacturer: '',
    partNumber: '',
    price: '',
    stockQuantity: '',
    condition: 'New',
    imageUrl: '',
    location: '',
    isFeatured: false,
    compatibleModels: [],
    shippingOptions: []
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [allCategories, setAllCategories] = useState([]);

  useEffect(() => {
    const categories = [...new Set(spareParts.map(part => part.category))];
    setAllCategories(categories);
  }, [spareParts]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedParts = [...spareParts]
    .filter(part => {
      const term = searchTerm.toLowerCase();
      return (
        part.name?.toLowerCase().includes(term) ||
        part.description?.toLowerCase().includes(term) ||
        part.category?.toLowerCase().includes(term) ||
        part.manufacturer?.toLowerCase().includes(term) ||
        part.partNumber?.toLowerCase().includes(term) ||
        part.condition?.toLowerCase().includes(term)
      );
    })
    .sort((a, b) => {
      if (!sortField) return 0;

      if (sortField === 'ratings') {
        const getAvg = (item) => {
          if (!Array.isArray(item.reviews) || item.reviews.length === 0) return 0;
          const total = item.reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
          return total / item.reviews.length;
        };
        const ratingA = getAvg(a);
        const ratingB = getAvg(b);
        return sortDirection === 'asc' ? ratingA - ratingB : ratingB - ratingA;
      }

      let valA = a[sortField], valB = b[sortField];
      if (valA === undefined || valB === undefined) return 0;
      if (typeof valA === 'number') return sortDirection === 'asc' ? valA - valB : valB - valA;
      return sortDirection === 'asc'
        ? valA.toString().localeCompare(valB.toString())
        : valB.toString().localeCompare(valA.toString());
    });


  const fetchSpareParts = async () => {
    try {
      const res = await fetch(`${BASE_URL}/spareparts`);
      const data = await res.json();
      if (data.success) setSpareParts(data.data.reverse());
    } catch (err) {
      console.error('Failed to fetch spare parts:', err);
    }
  };

  useEffect(() => {
    fetchSpareParts();
  }, []);

  const handleCreatePart = async () => {
    try {
      const res = await fetch(`${BASE_URL}/spareparts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newPart)
      });
      const result = await res.json();
      if (result.success) {
        alert('Spare part created');
        setCreateModal(false);
        setNewPart({
          name: '', description: '', category: '', manufacturer: '', partNumber: '', price: '',
          stockQuantity: '', condition: 'New', imageUrl: '', location: '', isFeatured: false,
          compatibleModels: [], shippingOptions: []
        });
        fetchSpareParts();
      } else {
        alert('Failed to create spare part');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdatePart = async () => {
    try {
      const res = await fetch(`${BASE_URL}/spareparts/${selectedPart._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(selectedPart)
      });
      const result = await res.json();
      if (result.success) {
        alert('Spare part updated');
        setEditModal(false);
        fetchSpareParts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePart = async (id) => {
    if (!window.confirm('Delete this spare part?')) return;
    try {
      const res = await fetch(`${BASE_URL}/spareparts/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const result = await res.json();
      if (result.success) {
        alert('Spare part deleted');
        fetchSpareParts();
      }
    } catch (err) {
      console.error(err);
    }
  };

const handleExportCSV = () => {
  if (!spareParts.length) return;

  const headers = [
    'Name',
    'Description',
    'Category',
    'Manufacturer',
    'Part Number',
    'Price',
    'Stock Quantity',
    'Condition',
    'Location',
    'Image URL',
    'Compatible Models',
    'Shipping Options',
    'Featured',
    'Created At',
    'Updated At'
  ];

  const rows = spareParts.map(part => [
    part.name,
    part.description,
    part.category,
    part.manufacturer,
    part.partNumber,
    part.price,
    part.stockQuantity,
    part.condition,
    part.location,
    part.imageUrl,
    (part.compatibleModels || []).join('; '),
    (part.shippingOptions || []).join('; '),
    part.isFeatured ? 'Yes' : 'No',
    new Date(part.createdAt).toLocaleString(),
    new Date(part.updatedAt).toLocaleString()
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(val => `"${val}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, '-');
  link.download = `spareparts-${timestamp}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

const filteredSpareParts = spareParts.filter(part =>
  part.name.toLowerCase().includes(searchTerm.toLowerCase())
);

const totalPages = Math.ceil(filteredAndSortedParts.length / itemsPerPage);
const currentItems = filteredAndSortedParts.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);

const countStats = {
  total: spareParts.length,
  categories: new Set(spareParts.map(p => p.category)).size,
  featured: spareParts.filter(p => p.isFeatured).length,
  inStock: spareParts.filter(p => p.stockQuantity > 0).length
};

const calculateAvgRating = (reviews = []) => {
  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  const count = reviews.length;
  const avg = count ? total / count : 0;
  return { avgRating: avg.toFixed(1), totalReviews: count };
};



return (
  <>
    <div className="container mt-4">
      {/* Dashboard Cards */}
      <div className="row g-2 mb-4">
        {[
          {
            label: 'Total Spare Parts',
            className: 'card-total',
            icon: <FaClipboardList />,
            count: spareParts.length
          },
          {
            label: 'Categories',
            className: 'card-serviced',
            icon: <FaTools />,
            count: allCategories.length
          },
          {
            label: 'Featured Parts',
            className: 'card-confirmed',
            icon: <FaStar />,
            count: spareParts.filter(p => p.isFeatured).length
          },
          {
            label: 'In Stock',
            className: 'card-reviewed',
            icon: <FaCommentDots />,
            count: spareParts.filter(p => p.stockQuantity > 0).length
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

      {/* Top Bar */}
      <div className="top-bar d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
        <h2>Spare Parts</h2>
        <Button color="success" onClick={() => setCreateModal(true)}>
          + Add Spare Part
        </Button>

        <div className="d-flex align-items-center flex-wrap gap-2">
          <label className="mb-0">Search:</label>
          <div className="flex-grow-1 flex-md-grow-0" style={{ minWidth: '250px', maxWidth: '400px' }}>
            <Input
              type="text"
              placeholder="Search name, description, category, manufacturer, part number..."
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

      {/* Spare Parts Table */}
      <Table striped bordered responsive className="service-table">
        <thead>
          <tr>
            <th>#</th>
            <th onClick={() => handleSort('name')} className={sortField === 'name' ? 'sorted-column' : ''}>Name {sortField === 'name' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}</th>
            <th onClick={() => handleSort('description')} className={sortField === 'description' ? 'sorted-column' : ''}>Description {sortField === 'description' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}</th>
            <th onClick={() => handleSort('category')} className={sortField === 'category' ? 'sorted-column' : ''}>Category {sortField === 'category' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}</th>
            <th onClick={() => handleSort('manufacturer')} className={sortField === 'manufacturer' ? 'sorted-column' : ''}>Manufacturer {sortField === 'manufacturer' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}</th>
            <th onClick={() => handleSort('partNumber')} className={sortField === 'partNumber' ? 'sorted-column' : ''}>Part Number {sortField === 'partNumber' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}</th>
            <th onClick={() => handleSort('price')} className={sortField === 'price' ? 'sorted-column' : ''}>Price {sortField === 'price' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}</th>
            <th onClick={() => handleSort('stockQuantity')} className={sortField === 'stockQuantity' ? 'sorted-column' : ''}>Stock {sortField === 'stockQuantity' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}</th>
            <th onClick={() => handleSort('condition')} className={sortField === 'condition' ? 'sorted-column' : ''}>Condition</th>
            <th>Image</th>
            <th onClick={() => handleSort('isFeatured')} className={sortField === 'isFeatured' ? 'sorted-column' : ''}>Featured {sortField === 'isFeatured' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}</th>
            <th
              onClick={() => handleSort('ratings')}
              className={sortField === 'ratings' ? 'sorted-column' : ''}
              style={{ cursor: 'pointer' }}
            >
              Ratings {sortField === 'ratings' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
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
          {currentItems.map((part, index) => (
            
            <tr key={part._id}>
              <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
              <td>{part.name}</td>
              <td>{part.description}</td>
              <td>{part.category}</td>
              <td>{part.manufacturer}</td>
              <td>{part.partNumber}</td>
              <td>Ksh {part.price}</td>
              <td>{part.stockQuantity}</td>
              <td>{part.condition}</td>
              <td><img src={part.imageUrl} alt={part.name} style={{ width: '80px', height: 'auto' }} /></td>
              <td>{part.isFeatured ? 'Yes' : 'No'}</td>
              <td>
                {(() => {
                  const { avgRating, totalReviews } = calculateAvgRating(part.reviews || []);
                  return totalReviews > 0 ? `${avgRating} (${totalReviews})` : 'N/A';
                })()}
              </td>

              <td>
                <Button size="sm" color="info" className="me-1" onClick={() => { setSelectedPart(part); setViewModal(true); }}>View</Button>
                <Button size="sm" color="warning" className="me-1" onClick={() => { setSelectedPart(part); setEditModal(true); }}>Edit</Button>
                <Button size="sm" color="danger" onClick={() => handleDeletePart(part._id)}>Delete</Button>
              </td>
              <td>{new Date(part.createdAt).toLocaleString()}</td>
              <td>{new Date(part.updatedAt).toLocaleString()}</td>
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
    </div>
    

     {/* View Modal */}
    <Modal isOpen={viewModal} toggle={() => setViewModal(false)}>
      <ModalHeader toggle={() => setViewModal(false)}>Spare Part Details</ModalHeader>
      <ModalBody>
        {selectedPart && (
          <>
            <p><strong>Name:</strong> {selectedPart.name}</p>
            <p><strong>Description:</strong> {selectedPart.description}</p>
            <p><strong>Category:</strong> {selectedPart.category}</p>
            <p><strong>Manufacturer:</strong> {selectedPart.manufacturer}</p>
            <p><strong>Part Number:</strong> {selectedPart.partNumber}</p>
            <p><strong>Price:</strong> ${selectedPart.price}</p>
            <p><strong>Stock Quantity:</strong> {selectedPart.stockQuantity}</p>
            <p><strong>Condition:</strong> {selectedPart.condition}</p>
            <p><strong>Location:</strong> {selectedPart.location}</p>
            <p><strong>Image:</strong></p>
            <img src={selectedPart.imageUrl} alt={selectedPart.name} style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }} />
            <p><strong>Compatible Models:</strong> {selectedPart.compatibleModels?.join(', ') || 'N/A'}</p>
            <p><strong>Shipping Options:</strong> {selectedPart.shippingOptions?.join(', ') || 'N/A'}</p>
            <p><strong>Featured:</strong> {selectedPart.isFeatured ? 'Yes' : 'No'}</p>
          </>
        )}
      </ModalBody>
      <ModalFooter>
        <Button onClick={() => setViewModal(false)}>Close</Button>
      </ModalFooter>
    </Modal>

    {/* Create / Edit Modals */}
    {[{ modal: createModal, setModal: setCreateModal, data: newPart, setData: setNewPart, action: handleCreatePart, label: 'Add Spare Part' },
      { modal: editModal, setModal: setEditModal, data: selectedPart, setData: setSelectedPart, action: handleUpdatePart, label: 'Edit Spare Part' }]
      .map(({ modal, setModal, data, setData, action, label }) => (
        <Modal key={label} isOpen={modal} toggle={() => setModal(false)}modalClassName="wide-modal">
          <ModalHeader toggle={() => setModal(false)}>{label}</ModalHeader>
          <ModalBody>
            <Form>
              {/* Row 1: Name & Description */}
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label>Name</Label>
                    <Input
                      type="text"
                      value={data?.name || ''}
                      onChange={(e) => setData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label>Manufacturer</Label>
                    <Input
                      type="text"
                      value={data?.manufacturer || ''}
                      onChange={(e) => setData(prev => ({ ...prev, manufacturer: e.target.value }))}
                    />
                  </FormGroup>
                </Col>

              </Row>

              {/* Row 2: Manufacturer & Part Number */}
              <Row>
                <Col md={12}>
                  <FormGroup>
                    <Label>Description</Label>
                    <Input
                      type="textarea"
                      rows="3"
                      value={data?.description || ''}
                      onChange={(e) => setData(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </FormGroup>
                </Col>

                <Col md={6}>
                  <FormGroup>
                    <Label>Part Number</Label>
                    <Input
                      type="text"
                      value={data?.partNumber || ''}
                      onChange={(e) => setData(prev => ({ ...prev, partNumber: e.target.value }))}
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label>Price</Label>
                    <Input
                      type="text"
                      value={data?.price || ''}
                      onChange={(e) => setData(prev => ({ ...prev, price: e.target.value }))}
                    />
                  </FormGroup>
                </Col>
              </Row>

              {/* Row 3: Price & Stock Quantity */}
              <Row>

                <Col md={6}>
                  <FormGroup>
                    <Label>Stock Quantity</Label>
                    <Input
                      type="text"
                      value={data?.stockQuantity || ''}
                      onChange={(e) => setData(prev => ({ ...prev, stockQuantity: e.target.value }))}
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label>Condition</Label>
                    <Input
                      type="select"
                      value={data?.condition || ''}
                      onChange={(e) => setData(prev => ({ ...prev, condition: e.target.value }))}
                    >
                      <option value="">-- Select Condition --</option>
                      <option value="New">New</option>
                      <option value="Used">Used</option>
                      <option value="Refurbished">Refurbished</option>
                    </Input>
                  </FormGroup>
                </Col>
              </Row>

              {/* Row 4: Condition & Image URL */}
              <Row>

                <Col md={12}>
                  <FormGroup>
                    <Label>Image URL</Label>
                    <Input
                      type="text"
                      value={data?.imageUrl || ''}
                      onChange={(e) => setData(prev => ({ ...prev, imageUrl: e.target.value }))}
                    />
                  </FormGroup>
                </Col>
              </Row>

              {/* Row 5: Location & Category */}
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label>Location</Label>
                    <Input
                      type="text"
                      value={data?.location || ''}
                      onChange={(e) => setData(prev => ({ ...prev, location: e.target.value }))}
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
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
                        }}>Cancel</Button>
                      </>
                    )}
                  </FormGroup>
                </Col>
              </Row>

              {/* Row 6: Compatible Models */}
              <Row>
                <Col md={12}>
                  <FormGroup>
                    <Label>Compatible Models (comma separated)</Label>
                    <Input
                      type="text"
                      value={data?.compatibleModels?.join(', ') || ''}
                      onChange={(e) => setData(prev => ({ ...prev, compatibleModels: e.target.value.split(',').map(m => m.trim()) }))}
                    />
                  </FormGroup>
                </Col>
              </Row>

              {/* Row 7: Shipping Options */}
              <Row>
                <Col md={12}>
                  <FormGroup>
                    <Label>Shipping Options</Label>
                    {['Pickup', 'Courier'].map(option => (
                      <div className="form-check" key={option}>
                        <Input
                          type="checkbox"
                          className="form-check-input"
                          checked={data?.shippingOptions?.includes(option) || false}
                          onChange={(e) => {
                            const updated = e.target.checked
                              ? [...(data.shippingOptions || []), option]
                              : (data.shippingOptions || []).filter(opt => opt !== option);
                            setData(prev => ({ ...prev, shippingOptions: updated }));
                          }}
                        />{' '}
                        {option}
                      </div>
                    ))}
                  </FormGroup>
                </Col>
              </Row>

              {/* Row 8: Featured */}
              <Row>
                <Col md={12}>
                  <FormGroup check>
                    <Label check>
                      <Input
                        type="checkbox"
                        checked={data?.isFeatured || false}
                        onChange={(e) => setData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                      />{' '}
                      Featured
                    </Label>
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={action}>Save</Button>
            <Button color="secondary" onClick={() => setModal(false)}>Cancel</Button>
          </ModalFooter>
        </Modal>
          ))}
    </>
);

};

export default AdminSparePartsPage;
