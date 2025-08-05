// AdminReviewsPage.jsx
import React, { useEffect, useState } from 'react';
import { FaStar, FaListUl } from 'react-icons/fa';
import CountUp from 'react-countup';
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
  Input
} from 'reactstrap';
import { BASE_URL } from '../../utils/config';
import './admin.css';
import { saveAs } from 'file-saver';


const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage, setReviewsPerPage] = useState(10);
  const [services, setServices] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });

  const [reviewType, setReviewType] = useState('all');
  const [allReviews, setAllReviews] = useState([]);
  const [spareParts, setSpareParts] = useState([]);
  const [ecuFiles, setEcuFiles] = useState([]);

  const [selectTypeModal, setSelectTypeModal] = useState(false);


  const [addModal, setAddModal] = useState(false);
  const [newReview, setNewReview] = useState({
    source: '',        // 'services', 'spareparts', or 'ecufiles'
    itemId: '',
    username: '',
    reviewText: '',
    rating: 1
  });


const handleExportCSV = () => {
  const csvHeaders = [
    'Username',
    'Service/Product',
    'Rating',
    'Review',
    'Review Source',
    'Created',
    'Updated'
  ];

  const csvRows = filteredReviews.map(review => {
    let itemName = 'Unknown';
    let reviewSource = 'Unknown';

    if (review.type === 'services') {
      itemName = services.find(s => s._id === review.serviceId)?.name || 'Unknown';
      reviewSource = 'Service Reviews';
    } else if (review.type === 'spareparts') {
      itemName = spareParts.find(p => p._id === review.sparePartId)?.name || 'Unknown';
      reviewSource = 'Spare Parts Reviews';
    } else if (review.type === 'ecufiles') {
      itemName = ecuFiles.find(e => e._id === review.ecuFileId)?.title || 'Unknown';
      reviewSource = 'ECU File Reviews';
    }

    return [
      review.username,
      itemName,
      review.rating,
      review.reviewText,
      reviewSource,
      new Date(review.createdAt).toLocaleString(),
      new Date(review.updatedAt).toLocaleString()
    ];
  });

  const csvContent = [
    csvHeaders.join(','),
    ...csvRows.map(row =>
      row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')
    )
  ].join('\n');

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_').split('Z')[0];
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `ServiceReviews_${timestamp}.csv`);
};



const handleAddReview = async () => {
  const { source, itemId, username, reviewText, rating } = newReview;

  if (!itemId || !username || !reviewText || !rating) {
    alert('Please fill in all fields.');
    return;
  }

  let endpoint = '';
  if (source === 'services') {
    endpoint = '/api/v1/servicereviews';
  } else if (source === 'spareparts') {
    endpoint = '/api/v1/sparepartreviews';
  } else if (source === 'ecufiles') {
    endpoint = '/api/v1/ecufilereviews';
  }

  const payload = {
    username,
    reviewText,
    rating,
  };

  // Attach correct field for item association
  if (source === 'services') payload.serviceId = itemId;
  if (source === 'spareparts') payload.sparePartId = itemId;
  if (source === 'ecufiles') payload.ecuFileId = itemId;

  try {
    const res = await fetch(`http://localhost:4000${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      alert(`Error: ${text}`);
      return;
    }

    const data = await res.json();
    alert('Review added successfully.');

    // Reset & refresh
    setNewReview({
      source: '',
      itemId: '',
      username: '',
      reviewText: '',
      rating: '',
    });
    setAddModal(false);
    fetchAllReviews(); // Refresh the reviews list
  } catch (error) {
    console.error(error);
    alert('Failed to add review.');
  }
};




const fetchAllReviews = async () => {
  try {
    const [serviceRes, spareRes, ecuRes, servicesRes, partsRes, filesRes] = await Promise.all([
      fetch(`${BASE_URL}/servicereviews`, { credentials: 'include' }),
      fetch(`${BASE_URL}/reviewspareparts`, { credentials: 'include' }),
      fetch(`${BASE_URL}/reviewecufile`, { credentials: 'include' }),
      fetch(`${BASE_URL}/services`),
      fetch(`${BASE_URL}/spareparts`),
      fetch(`${BASE_URL}/ecufiles`)
    ]);

    const [servicesData, sparePartsData, ecuFilesData] = await Promise.all([
      servicesRes.json(),
      partsRes.json(),
      filesRes.json()
    ]);

    if (servicesData.success) setServices(servicesData.data);
    if (sparePartsData.success) setSpareParts(sparePartsData.data);
    if (ecuFilesData.success) setEcuFiles(ecuFilesData.data);

    const [serviceReviews, spareReviews, ecuReviews] = await Promise.all([
      serviceRes.json(),
      spareRes.json(),
      ecuRes.json()
    ]);

    const formatReviews = (reviews, type) => reviews.data.map(r => ({ ...r, type }));

    const allCombined = [
      ...formatReviews(serviceReviews, 'services'),
      ...formatReviews(spareReviews, 'spareparts'),
      ...formatReviews(ecuReviews, 'ecufiles')
    ];

    setAllReviews(allCombined.reverse());
  } catch (err) {
    console.error('Failed to fetch all reviews:', err);
  }
};

  // Count reviews by rating
  const ratingCounts = reviews.reduce((acc, review) => {
    const rating = review.rating || 0;
    acc[rating] = (acc[rating] || 0) + 1;
    acc.total = (acc.total || 0) + 1;
    return acc;
  }, {});


  const fetchServices = async () => {
    try {
      const res = await fetch(`${BASE_URL}/services`);
      const data = await res.json();
      if (data.success) setServices(data.data);
    } catch (err) {
      console.error('Failed to fetch services:', err);
    }
  };

  useEffect(() => {
    fetchAllReviews();
    fetchServices();
  }, []);

const handleDeleteReview = async (reviewId, type) => {

    console.log('Deleting review ID:', reviewId);
  console.log('Review type:', reviewType); // log to verify
  try {
    let endpoint = '';

    switch (type) {
      case 'services':
        endpoint = `${BASE_URL}/servicereviews/${reviewId}`;
        break;
      case 'spareparts':
        endpoint = `${BASE_URL}/reviewspareparts/${reviewId}`;
        break;
      case 'ecufiles':
        endpoint = `${BASE_URL}/reviewecufile/${reviewId}`;
        break;
      default:
        throw new Error('Invalid review type, Please select a specific service / product first');
    }

    const res = await fetch(endpoint, {
      method: 'DELETE',
      credentials: 'include'
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Failed to delete review');
    }
    alert('Review deleted successfully');
    fetchAllReviews(); // Make sure this reloads all reviews correctly
  } catch (err) {
    alert(err.message ||'Failed to delete review');
    console.error('Delete review error:', err);
  }
};

  const handleEdit = (review) => {
    setSelectedReview(review);
    setUpdateModal(true);
  };

const handleUpdate = async () => {
  try {
    let endpoint;
    if (selectedReview.type === 'services') {
      endpoint = `${BASE_URL}/servicereviews/${selectedReview._id}`;
    } else if (selectedReview.type === 'spareparts') {
      endpoint = `${BASE_URL}/reviewspareparts/${selectedReview._id}`;
    } else if (selectedReview.type === 'ecufiles') {
      endpoint = `${BASE_URL}/reviewecufile/${selectedReview._id}`;
    } else {
      alert('Unknown review type');
      return;
    }

    const res = await fetch(endpoint, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(selectedReview),
    });

    let result;
    try {
      result = await res.json();
    } catch (err) {
      alert('Server response not in JSON format.');
      return;
    }

    if (result.success) {
      let updatedReviewWithName = { ...result.data };

      // Add product/service title based on type
      if (selectedReview.type === 'services') {
        const matched = services.find(s => s._id === selectedReview.serviceId);
        updatedReviewWithName.serviceName = matched?.name || 'Unknown';
      } else if (selectedReview.type === 'spareparts') {
        const matched = spareParts.find(p => p._id === selectedReview.sparePartId);
        updatedReviewWithName.serviceName = matched?.name || 'Unknown';
      } else if (selectedReview.type === 'ecufiles') {
        const matched = ecuFiles.find(e => e._id === selectedReview.ecuFileId);
        updatedReviewWithName.serviceName = matched?.title || 'Unknown';
      }

      // Update the review list
      setReviews(prev =>
        prev.map(r => (r._id === selectedReview._id ? updatedReviewWithName : r))
      );

      setSelectedReview(updatedReviewWithName);
      alert('Review updated successfully!');
      fetchAllReviews(); 
      setUpdateModal(false);
    } else {
      alert('Update failed');
    }
  } catch (err) {
    console.error('Update error:', err);
    alert('Update failed due to a network or server error.');
  }
};



  const StarRatingInput = ({ rating, onChange }) => {
    return (
      <div style={{ fontSize: '1.5rem' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => onChange(star)}
            style={{
              cursor: 'pointer',
              color: star <= rating ? '#ffc107' : '#e4e5e9',
              marginRight: '4px'
            }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const filteredReviews = allReviews.filter(r => {
    if (reviewType !== 'all' && r.type !== reviewType) return false;

    const textMatch = (r.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.reviewText?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.serviceName?.toLowerCase().includes(searchTerm.toLowerCase()));

    return textMatch;
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    const { key, direction } = sortConfig;
    if (!key) return 0;

    let aVal = key === 'service'
      ? services.find(s => s._id === a.serviceId)?.name || ''
      : a[key];
    let bVal = key === 'service'
      ? services.find(s => s._id === b.serviceId)?.name || ''
      : b[key];

    if (key === 'createdAt' || key === 'updatedAt') {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    } else if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const indexOfLast = currentPage * reviewsPerPage;
  const indexOfFirst = indexOfLast - reviewsPerPage;
  const currentReviews = sortedReviews.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedReviews.length / reviewsPerPage);

  const getSortArrow = (key) => {
    if (sortConfig.key !== key) return '';
    return sortConfig.direction === 'asc' ? '▲' : '▼';
  };

  const renderStars = (count) => {
  return (
      <div className="d-flex justify-content-center">
        {[...Array(count)].map((_, i) => (
          <FaStar key={i} className="me-1 star-gold animated-icon" />
        ))}
      </div>
  );
};


  return (
    <div className="container mt-4">
      <div className="row g-3 mb-4">
        {[
          { label: 'All Reviews', count: ratingCounts.total, icon: <FaListUl />, className: 'card-rating-all', stars: 5 },
          { label: '5 Stars', count: ratingCounts[5], icon: <FaStar />, className: 'card-rating-5', stars: 5 },
          { label: '4 Stars', count: ratingCounts[4], icon: <FaStar />, className: 'card-rating-4', stars: 4 },
          { label: '3 Stars', count: ratingCounts[3], icon: <FaStar />, className: 'card-rating-3', stars: 3 },
          { label: '2 Stars', count: ratingCounts[2], icon: <FaStar />, className: 'card-rating-2', stars: 2 },
          { label: '1 Star',  count: ratingCounts[1], icon: <FaStar />, className: 'card-rating-1', stars: 1 },
        ].map(({ label, count, icon, className, stars }) => (
          <div className="col-6 col-md-6 col-lg-4" key={label}>
            <div className={`card-status ${className}`}>
              <div className="mb-2">
                {React.cloneElement(icon, { size: 30, className: "animated-icon" })}
              </div>
              <h6>{label}</h6>
              {stars > 0 && (
                <div className="mb-2">
                  {[...Array(stars)].map((_, i) => (
                    <FaStar key={i} className="animated-icon star-gold"/>
                  ))}
                </div>
              )}
              <h4><CountUp end={count || 0} duration={2} /></h4>
            </div>
          </div>
        ))}
      </div>

      <div className="top-bar d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
        <h2>Service Reviews</h2>

      <Button color="success" onClick={() => setSelectTypeModal(true)}>
        + Add Review
      </Button>

      <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
          <Label for="reviewFilter">Filter by:</Label>
          <div className="flex-grow-1 flex-md-grow-0" style={{ minWidth: '100px', maxWidth: '400px' }}>
                  <Input
                  type="select"
                  id="reviewFilter"
                  value={reviewType}
                  onChange={(e) => setReviewType(e.target.value)}
                >
                  <option value="all">All Reviews</option>
                  <option value="services">Service Reviews</option>
                  <option value="spareparts">Spare Parts Reviews</option>
                  <option value="ecufiles">ECU File Reviews</option>
                </Input>
          </div>
      </div>

      <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
        <label className="mb-0">Search:</label>
        <div className="flex-grow-1 flex-md-grow-0" style={{ minWidth: '250px', maxWidth: '400px' }}>

        <Input
          type="text"
          placeholder="Search by username, service, or text..."
          value={searchTerm}
          onChange={e => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-100"
        />

        </div>
      </div>

        <Button color="secondary" onClick={handleExportCSV}>
        Export CSV
        </Button>

      </div>

      <div style={{ overflowX: 'auto' }}>
        <Table striped bordered responsive className="service-review-table">
          <thead>
            <tr>
              <th>#</th>
              <th
                onClick={() => handleSort('username')}
                className={sortConfig.key === 'username' ? 'sorted-column' : ''}
                style={{ cursor: 'pointer' }}
              >
                Username {getSortArrow('username')}
              </th>
              <th
                onClick={() => handleSort('service')}
                className={sortConfig.key === 'service' ? 'sorted-column' : ''}
                style={{ cursor: 'pointer' }}
              >
                Service/Product {getSortArrow('service')}
              </th>

              <th
                onClick={() => handleSort('rating')}
                className={sortConfig.key === 'rating' ? 'sorted-column' : ''}
                style={{ cursor: 'pointer' }}
              >
                Rating {getSortArrow('rating')}
              </th>

              <th
                onClick={() => handleSort('reviewText')}
                className={sortConfig.key === 'reviewText' ? 'sorted-column' : ''}
                style={{ cursor: 'pointer' }}
              >
                Review {getSortArrow('reviewText')}
              </th>

              <th>Review Source</th>

              <th
                onClick={() => handleSort('createdAt')}
                className={sortConfig.key === 'createdAt' ? 'sorted-column' : ''}
                style={{ cursor: 'pointer' }}
              >
                Created {getSortArrow('createdAt')}
              </th>


              <th
                onClick={() => handleSort('updatedAt')}
                className={sortConfig.key === 'updatedAt' ? 'sorted-column' : ''}
                style={{ cursor: 'pointer' }}
              >
                Updated {getSortArrow('updatedAt')}
              </th>

              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentReviews.length > 0 ? (
              currentReviews.map((review, index) => (
                <tr key={review._id}>
                  <td>{indexOfFirst + index + 1}</td>
                  <td>{review.username}</td>
                  <td>
                    {(() => {
                      if (review.type === 'services')
                        return services.find(s => s._id === review.serviceId)?.name || 'Unknown';
                      if (review.type === 'spareparts')
                        return spareParts.find(p => p._id === review.sparePartId)?.name || 'Unknown';
                      if (review.type === 'ecufiles')
                        return ecuFiles.find(e => e._id === review.ecuFileId)?.title || 'Unknown';
                      return 'Unknown';
                    })()}
                  </td>
                  <td>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</td>
                  <td>{review.reviewText}</td>

                  <td>
                    {review.type === 'services' && 'Service Reviews'}
                    {review.type === 'spareparts' && 'Spare Parts Reviews'}
                    {review.type === 'ecufiles' && 'ECU File Reviews'}
                  </td>

                  <td>{new Date(review.createdAt).toLocaleString()}</td>
                  <td>{new Date(review.updatedAt).toLocaleString()}</td>
                  <td>
                    <Button size="sm" color="info" className="me-1" onClick={() => {
                      setSelectedReview(review);
                      setViewModal(true);
                    }}>View</Button>
                    <Button size="sm" color="warning" className="me-1" onClick={() => handleEdit(review)}>Edit</Button>
                    <Button
                    color="danger"
                    size="sm"
                    onClick={() => handleDeleteReview(review._id, reviewType)}
                  >
                    Delete
                  </Button>


                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="8" className="text-center">No reviews found.</td></tr>
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
        >Previous</Button>

        <div className="d-flex flex-wrap gap-2">
          {[...Array(totalPages)].map((_, i) => (
            <Button
              key={i + 1}
              color={currentPage === i + 1 ? 'primary' : 'light'}
              onClick={() => setCurrentPage(i + 1)}
            >{i + 1}</Button>
          ))}
        </div>

        <Button
          color="secondary"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(prev => prev + 1)}
        >Next</Button>

        <div className="d-flex align-items-center gap-2 ms-auto">
          <label className="mb-0">Show</label>
          <select
            className="form-select w-auto"
            value={reviewsPerPage}
            onChange={(e) => {
              setReviewsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            {[5, 10, 25, 50, 100].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
          <span>entries</span>
        </div>
      </div>

      {/* View Modal */}
      <Modal isOpen={viewModal} toggle={() => setViewModal(!viewModal)}>
        <ModalHeader toggle={() => setViewModal(false)}>Review Details</ModalHeader>
        <ModalBody>
          {selectedReview && (
            <>
              <p><strong>Username:</strong> {selectedReview.username}</p>

              {/* Dynamically show review source */}
              <p>
                <strong>Review Source:</strong>{' '}
                {selectedReview.type === 'services' && 'Service Reviews'}
                {selectedReview.type === 'spareparts' && 'Spare Parts Reviews'}
                {selectedReview.type === 'ecufiles' && 'ECU File Reviews'}
              </p>

              {/* Dynamically show related item name */}
              <p>
                <strong>
                  {selectedReview.type === 'services' && 'Service:'}
                  {selectedReview.type === 'spareparts' && 'Spare Part:'}
                  {selectedReview.type === 'ecufiles' && 'ECU File:'}
                </strong>{' '}
                {selectedReview.type === 'services' &&
                  (services.find(s => s._id === selectedReview.serviceId)?.name || 'Unknown')}
                {selectedReview.type === 'spareparts' &&
                  (spareParts.find(p => p._id === selectedReview.sparePartId)?.name || 'Unknown')}
                {selectedReview.type === 'ecufiles' &&
                  (ecuFiles.find(e => e._id === selectedReview.ecuFileId)?.title || 'Unknown')}
              </p>

              <p><strong>Rating:</strong> {selectedReview.rating}</p>
              <p><strong>Review:</strong> {selectedReview.reviewText}</p>
              <p><strong>Created At:</strong> {new Date(selectedReview.createdAt).toLocaleString()}</p>
              <p><strong>Updated At:</strong> {new Date(selectedReview.updatedAt).toLocaleString()}</p>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => setViewModal(false)}>Close</Button>
        </ModalFooter>
      </Modal>


      {/* Edit Modal */}
      <Modal isOpen={updateModal} toggle={() => setUpdateModal(!updateModal)}>
        <ModalHeader toggle={() => setUpdateModal(false)}>Edit Review</ModalHeader>
        <ModalBody>
          {selectedReview && (
            <Form>
              <FormGroup>
                <Label>Username</Label>
                <Input
                  type="text"
                  value={selectedReview.username}
                  onChange={(e) =>
                    setSelectedReview({ ...selectedReview, username: e.target.value })
                  }
                />
              </FormGroup>
              <FormGroup>
                <Label>
                  {selectedReview.type === 'services'
                    ? 'Select Service'
                    : selectedReview.type === 'spareparts'
                    ? 'Select Spare Part'
                    : 'Select ECU File'}
                </Label>
                <Input
                  type="select"
                  value={
                    selectedReview.type === 'services'
                      ? selectedReview.serviceId || ''
                      : selectedReview.type === 'spareparts'
                      ? selectedReview.sparePartId || ''
                      : selectedReview.ecuFileId || ''
                  }
                  onChange={(e) =>
                    setSelectedReview((prev) => ({
                      ...prev,
                      ...(selectedReview.type === 'services' && { serviceId: e.target.value }),
                      ...(selectedReview.type === 'spareparts' && { sparePartId: e.target.value }),
                      ...(selectedReview.type === 'ecufiles' && { ecuFileId: e.target.value }),
                    }))
                  }
                >
                  <option value="">
                    -- Select a {selectedReview.type === 'services'
                      ? 'service'
                      : selectedReview.type === 'spareparts'
                      ? 'spare part'
                      : 'ECU file'} --
                  </option>

                  {(selectedReview.type === 'services' ? services :
                    selectedReview.type === 'spareparts' ? spareParts :
                    ecuFiles
                  ).map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name || item.title} {/* name for services/spareparts, title for ecufiles */}
                    </option>
                  ))}
                </Input>
              </FormGroup>
              <FormGroup>
                <Label>Rating</Label>
                <StarRatingInput
                  rating={selectedReview.rating}
                  onChange={(value) =>
                    setSelectedReview({ ...selectedReview, rating: value })
                  }
                />
              </FormGroup>

              <FormGroup>
                <Label>Review Text</Label>
                <Input
                  type="textarea"
                  value={selectedReview.reviewText}
                  onChange={(e) =>
                    setSelectedReview({ ...selectedReview, reviewText: e.target.value })
                  }
                />
              </FormGroup>
            </Form>
          )}
        </ModalBody>

        <ModalFooter>
          <Button color="primary" onClick={handleUpdate}>Save</Button>
          <Button color="secondary" onClick={() => setUpdateModal(false)}>Cancel</Button>
        </ModalFooter>
      </Modal>

      {/* Add Modal */}
    <Modal isOpen={selectTypeModal} toggle={() => setSelectTypeModal(false)}>
      <ModalHeader toggle={() => setSelectTypeModal(false)}>
        Select Review Type
      </ModalHeader>
      <ModalBody>
        <p>Which type of review would you like to add?</p>
        <div className="d-flex flex-column gap-2">
          <Button
            color="primary"
            onClick={() => {
              setNewReview({ ...newReview, source: 'services', itemId: '' });
              setSelectTypeModal(false);
              setAddModal(true);
            }}
          >
            Add Service Review
          </Button>
          <Button
            color="info"
            onClick={() => {
              setNewReview({ ...newReview, source: 'ecufiles', itemId: '' });
              setSelectTypeModal(false);
              setAddModal(true);
            }}
          >
            Add ECU File Review
          </Button>
          <Button
            color="warning"
            onClick={() => {
              setNewReview({ ...newReview, source: 'spareparts', itemId: '' });
              setSelectTypeModal(false);
              setAddModal(true);
            }}
          >
            Add Spare Part Review
          </Button>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={() => setSelectTypeModal(false)}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>

    </div>
  );
};

export default AdminReviewsPage;
