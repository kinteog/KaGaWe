// AdminECUFilesPage.jsx
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

const AdminECUFilesPage = () => {
  const [ecuFiles, setECUFiles] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [newFile, setNewFile] = useState({
    title: '', imageUrl: '', vehicleMake: '', vehicleModel: '', vehicleYear: '',
    engineCode: '', ecuBrand: '', ecuVersion: '', tuningStage: '',
    category: '', description: '', price: '', isFeatured: false,
    status: 'available', compatibleVehicles: []
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [allCategories, setAllCategories] = useState([]);

  useEffect(() => {
    const categories = [...new Set(ecuFiles.map(file => file.category))];
    setAllCategories(categories);
  }, [ecuFiles]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const calculateAvgRating = (reviews = []) => {
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    const count = reviews.length;
    const avg = count ? total / count : 0;
    return { avgRating: avg.toFixed(1), totalReviews: count };
  };

  const filteredAndSortedFiles = [...ecuFiles]
    .filter(file => {
      const term = searchTerm.toLowerCase();
      return Object.values(file).some(val =>
        typeof val === 'string' && val.toLowerCase().includes(term)
      );
    })
    .sort((a, b) => {
      if (!sortField) return 0;
      if (sortField === 'ratings') {
        const getAvg = (item) => {
          const r = calculateAvgRating(item.reviews);
          return parseFloat(r.avgRating);
        };
        return sortDirection === 'asc'
          ? getAvg(a) - getAvg(b)
          : getAvg(b) - getAvg(a);
      }
      let valA = a[sortField], valB = b[sortField];
      if (valA === undefined || valB === undefined) return 0;
      if (typeof valA === 'number') return sortDirection === 'asc' ? valA - valB : valB - valA;
      return sortDirection === 'asc'
        ? valA.toString().localeCompare(valB.toString())
        : valB.toString().localeCompare(valA.toString());
    });

  const fetchECUFiles = async () => {
    try {
      const res = await fetch(`${BASE_URL}/ecufiles`);
      const data = await res.json();
      if (data.success) setECUFiles(data.data.reverse());
    } catch (err) {
      console.error('Failed to fetch ECU files:', err);
    }
  };

  useEffect(() => {
    fetchECUFiles();
  }, []);

    const handleImageUpload = async (e, setData) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${BASE_URL}/upload/ecufiles`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      const result = await res.json();
      if (result.success) {
        setData(prev => ({ ...prev, imageUrl: result.imagePath })); // Make sure backend returns filePath
        alert('Image uploaded successfully!');
      } else {
        alert(result.message || 'Image upload failed!');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Upload error');
    }
  };

  

  const handleCreateFile = async () => {
    try {
      const res = await fetch(`${BASE_URL}/ecufiles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newFile)
      });
      const result = await res.json();
      if (result.success) {
        alert('ECU file created');
        setCreateModal(false);
        setNewFile({
          title: '', imageUrl: '', vehicleMake: '', vehicleModel: '', vehicleYear: '',
          engineCode: '', ecuBrand: '', ecuVersion: '', tuningStage: '',
          category: '', description: '', price: '', isFeatured: false,
          status: 'available', compatibleVehicles: []
        });
        fetchECUFiles();
      } else alert('Failed to create ECU file');
    } catch (err) { console.error(err); }
  };

  const handleUpdateFile = async () => {
    try {
      const res = await fetch(`${BASE_URL}/ecufiles/${selectedFile._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(selectedFile)
      });
      const result = await res.json();
      if (result.success) {
        alert('ECU file updated');
        setEditModal(false);
        fetchECUFiles();
      }
    } catch (err) { console.error(err); }
  };

  const handleDeleteFile = async (id) => {
    if (!window.confirm('Delete this ECU file?')) return;
    try {
      const res = await fetch(`${BASE_URL}/ecufiles/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const result = await res.json();
      if (result.success) {
        alert('ECU file deleted');
        fetchECUFiles();
      }
    } catch (err) { console.error(err); }
  };

  const totalPages = Math.ceil(filteredAndSortedFiles.length / itemsPerPage);
  const currentItems = filteredAndSortedFiles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

    const countStats = {
    total: ecuFiles.length,
    categories: new Set(ecuFiles.map(f => f.category)).size,
    featured: ecuFiles.filter(f => f.isFeatured).length,
    available: ecuFiles.filter(f => f.status === 'available').length
    };


  const handleExportCSV = () => {
    if (!ecuFiles.length) return;

    const headers = [
        'Title',
        'Vehicle Make',
        'Vehicle Model',
        'Vehicle Year',
        'Engine Code',
        'ECU Brand',
        'ECU Version',
        'Tuning Stage',
        'Category',
        'Description',
        'Price',
        'Status',
        'Featured',
        'Compatible Vehicles',
        'Created At',
        'Updated At'
    ];

    const rows = ecuFiles.map(file => [
        file.title,
        file.vehicleMake,
        file.vehicleModel,
        file.vehicleYear,
        file.engineCode,
        file.ecuBrand,
        file.ecuVersion,
        file.tuningStage,
        file.category,
        file.description,
        file.price,
        file.status,
        file.isFeatured ? 'Yes' : 'No',
        (file.compatibleVehicles || []).join('; '),
        new Date(file.createdAt).toLocaleString(),
        new Date(file.updatedAt).toLocaleString()
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
    link.download = `ecufiles-${timestamp}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    };


  return (
    <div className="container mt-4">

    {/* Dashboard Cards */}
    <div className="row g-2 mb-4">
    {[
        {
        label: 'Total ECU Files',
        className: 'card-total',
        icon: <FaClipboardList />,
        count: countStats.total
        },
        {
        label: 'Categories',
        className: 'card-serviced',
        icon: <FaTools />,
        count: countStats.categories
        },
        {
        label: 'Featured Files',
        className: 'card-confirmed',
        icon: <FaStar />,
        count: countStats.featured
        },
        {
        label: 'Available',
        className: 'card-reviewed',
        icon: <FaCommentDots />,
        count: countStats.available
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
        <h2>ECU Files Management</h2>
        <Button color="success" onClick={() => setCreateModal(true)}>+ Add ECU File</Button>


        <div className="d-flex align-items-center flex-wrap gap-2">
        <label className="mb-0">Search:</label>
        <div className="flex-grow-1 flex-md-grow-0" style={{ minWidth: '250px', maxWidth: '400px' }}>
            <Input
            type="text"
            placeholder="Search title, engine, ecu, stage, part number..."
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

      <Table striped bordered responsive className="ecufile-table">
        <thead>
          <tr>
            <th>#</th>
            <th onClick={() => handleSort('title')} className={sortField === 'title' ? 'sorted-column' : ''}>
            Title {sortField === 'title' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th onClick={() => handleSort('vehicleMake')} className={sortField === 'vehicleMake' ? 'sorted-column' : ''}>
            Make {sortField === 'vehicleMake' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th onClick={() => handleSort('vehicleModel')} className={sortField === 'vehicleModel' ? 'sorted-column' : ''}>
            Model {sortField === 'vehicleModel' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th onClick={() => handleSort('vehicleYear')} className={sortField === 'vehicleYear' ? 'sorted-column' : ''}>
            Year {sortField === 'vehicleYear' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th onClick={() => handleSort('engineCode')} className={sortField === 'engineCode' ? 'sorted-column' : ''}>
            Engine {sortField === 'engineCode' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th onClick={() => handleSort('ecuBrand')} className={sortField === 'ecuBrand' ? 'sorted-column' : ''}>
            ECU Brand {sortField === 'ecuBrand' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th onClick={() => handleSort('ecuVersion')} className={sortField === 'ecuVersion' ? 'sorted-column' : ''}>
            ECU Version {sortField === 'ecuVersion' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th onClick={() => handleSort('tuningStage')} className={sortField === 'tuningStage' ? 'sorted-column' : ''}>
            Tuning Stage {sortField === 'tuningStage' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th onClick={() => handleSort('category')} className={sortField === 'category' ? 'sorted-column' : ''}>
            Category {sortField === 'category' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th onClick={() => handleSort('price')} className={sortField === 'price' ? 'sorted-column' : ''}>
            Price {sortField === 'price' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th onClick={() => handleSort('status')} className={sortField === 'status' ? 'sorted-column' : ''}>
            Status {sortField === 'status' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th onClick={() => handleSort('ratings')} className={sortField === 'ratings' ? 'sorted-column' : ''}>
            Ratings {sortField === 'ratings' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th>Image</th>
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
          {currentItems.map((file, i) => {
            const { avgRating, totalReviews } = calculateAvgRating(file.reviews || []);
            return (
              <tr key={file._id}>
                <td>{(currentPage - 1) * itemsPerPage + i + 1}</td>
                <td>{file.title}</td>
                <td>{file.vehicleMake}</td>
                <td>{file.vehicleModel}</td>
                <td>({file.vehicleYear})</td>
                <td>{file.engineCode}</td>
                <td>{file.ecuBrand}</td>
                <td>{file.ecuVersion}</td>
                <td>{file.tuningStage}</td>
                <td>{file.category}</td>
                <td>Ksh {file.price}</td>
                <td>{file.status}</td>
                <td>{totalReviews > 0 ? `${avgRating} (${totalReviews})` : 'N/A'}</td>
                <td><img src= {`${BASE_URL}/uploads/${file.imageUrl}`} alt={file.title} width="60" /></td>
                <td>
                  <Button size="sm" color="info" className="me-1" onClick={() => { setSelectedFile(file); setViewModal(true); }}>View</Button>
                  <Button size="sm" color="warning" className="me-1" onClick={() => { setSelectedFile(file); setEditModal(true); }}>Edit</Button>
                  <Button size="sm" color="danger" onClick={() => handleDeleteFile(file._id)}>Delete</Button>
                </td>
                <td>{new Date(file.createdAt).toLocaleString()}</td>
                <td>{new Date(file.updatedAt).toLocaleString()}</td>
              </tr>
            );
          })}
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

        <Modal isOpen={viewModal} toggle={() => setViewModal(false)}>
            <ModalHeader toggle={() => setViewModal(false)}>ECU File Details</ModalHeader>
            <ModalBody>
                {selectedFile && (
                <>
                    <p><strong>Title:</strong> {selectedFile.title}</p>
                    <p><strong>Description:</strong> {selectedFile.description}</p>
                    <p><strong>Category:</strong> {selectedFile.category}</p>
                    <p><strong>Vehicle:</strong> {selectedFile.vehicleMake} {selectedFile.vehicleModel} ({selectedFile.vehicleYear})</p>
                    <p><strong>Engine Code:</strong> {selectedFile.engineCode}</p>
                    <p><strong>ECU:</strong> {selectedFile.ecuBrand} {selectedFile.ecuVersion}</p>
                    <p><strong>Tuning Stage:</strong> {selectedFile.tuningStage}</p>
                    <p><strong>Status:</strong> {selectedFile.status}</p>
                    <p><strong>Price:</strong> Ksh {selectedFile.price}</p>
                    <p><strong>Featured:</strong> {selectedFile.isFeatured ? 'Yes' : 'No'}</p>
                    <p><strong>Compatible Vehicles:</strong> {selectedFile.compatibleVehicles?.join(', ') || 'N/A'}</p>
                    <p><strong>Image:</strong></p>
                    <img src={`${BASE_URL}/uploads/${selectedFile.imageUrl}`} alt={selectedFile.title} style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }} />
                </>
                )}
            </ModalBody>
            <ModalFooter>
                <Button onClick={() => setViewModal(false)}>Close</Button>
            </ModalFooter>
        </Modal>

        {[
        { modal: createModal, setModal: setCreateModal, data: newFile, setData: setNewFile, action: handleCreateFile, label: 'Add ECU File' },
        { modal: editModal, setModal: setEditModal, data: selectedFile || {}, setData: setSelectedFile, action: handleUpdateFile, label: 'Edit ECU File' }
        ].map(({ modal, setModal, data, setData, action, label }) => (
        <Modal key={label} isOpen={modal} toggle={() => setModal(false)} modalClassName="wide-modal">
            <ModalHeader toggle={() => setModal(false)}>{label}</ModalHeader>
            <ModalBody>
            <Form>
                <Row>
                <Col md={6}>
                    <FormGroup>
                    <Label>Title</Label>
                    <Input type="text" value={data.title} onChange={(e) => setData(prev => ({ ...prev, title: e.target.value }))} />
                    </FormGroup>
                </Col>
                <Col md={6}>
                    <FormGroup>
                    <Label>Vehicle Make</Label>
                    <Input type="text" value={data.vehicleMake} onChange={(e) => setData(prev => ({ ...prev, vehicleMake: e.target.value }))} />
                    </FormGroup>
                </Col>
                </Row>

                <Row>
                <Col md={6}>
                    <FormGroup>
                    <Label>Vehicle Model</Label>
                    <Input type="text" value={data.vehicleModel} onChange={(e) => setData(prev => ({ ...prev, vehicleModel: e.target.value }))} />
                    </FormGroup>
                </Col>
                <Col md={6}>
                    <FormGroup>
                    <Label>Vehicle Year</Label>
                    <Input type="text" value={data.vehicleYear} onChange={(e) => setData(prev => ({ ...prev, vehicleYear: e.target.value }))} />
                    </FormGroup>
                </Col>
                </Row>

                <Row>
                <Col md={6}>
                    <FormGroup>
                    <Label>Engine Code</Label>
                    <Input type="text" value={data.engineCode} onChange={(e) => setData(prev => ({ ...prev, engineCode: e.target.value }))} />
                    </FormGroup>
                </Col>
                <Col md={6}>
                    <FormGroup>
                    <Label>ECU Brand</Label>
                    <Input type="text" value={data.ecuBrand} onChange={(e) => setData(prev => ({ ...prev, ecuBrand: e.target.value }))} />
                    </FormGroup>
                </Col>
                </Row>

                <Row>
                <Col md={6}>
                    <FormGroup>
                    <Label>ECU Version</Label>
                    <Input type="text" value={data.ecuVersion} onChange={(e) => setData(prev => ({ ...prev, ecuVersion: e.target.value }))} />
                    </FormGroup>
                </Col>
                <Col md={6}>
                    <FormGroup>
                    <Label>Tuning Stage</Label>
                    <Input type="text" value={data.tuningStage} onChange={(e) => setData(prev => ({ ...prev, tuningStage: e.target.value }))} />
                    </FormGroup>
                </Col>
                </Row>

                <Row>
                <Col md={6}>
                    <FormGroup>
                    <Label>Price</Label>
                    <Input type="text" value={data.price} onChange={(e) => setData(prev => ({ ...prev, price: e.target.value }))} />
                    </FormGroup>
                </Col>
                <Col md={6}>
                    <FormGroup>
                    <Label>Status</Label>
                    <Input type="select" value={data.status} onChange={(e) => setData(prev => ({ ...prev, status: e.target.value }))}>
                        <option value="available">Available</option>
                        <option value="unavailable">Unavailable</option>
                    </Input>
                    </FormGroup>
                </Col>
                </Row>

                <Row>
                <Col md={6}>
                    <FormGroup>
                    <Label>Category</Label>
                    {!isAddingNewCategory ? (
                        <>
                        <Input
                            type="select"
                            value={data.category || ''}
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
                            value={data.category || ''}
                            onChange={(e) => setData(prev => ({ ...prev, category: e.target.value }))}
                        />
                        <Button
                            color="link"
                            size="sm"
                            onClick={() => {
                            setIsAddingNewCategory(false);
                            setData(prev => ({ ...prev, category: '' }));
                            }}
                        >
                            Cancel
                        </Button>
                        </>
                    )}
                    </FormGroup>

                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label>Upload Image</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, setData)}
                    />
                    {data.imageUrl && (
                      <div className="mt-2">
                        <img src= {`${BASE_URL}/uploads/${data.imageUrl}`} alt="Preview" style={{ width: '100px', height: 'auto' }} />
                      </div>
                    )}
                  </FormGroup>

                </Col>
                </Row>

                <FormGroup>
                <Label>Description</Label>
                <Input type="textarea" rows={3} value={data.description} onChange={(e) => setData(prev => ({ ...prev, description: e.target.value }))} />
                </FormGroup>

                <FormGroup>
                <Label>Compatible Vehicles (comma separated)</Label>
                <Input
                    type="text"
                    value={data.compatibleVehicles?.join(', ') || ''}
                    onChange={(e) => setData(prev => ({
                    ...prev,
                    compatibleVehicles: e.target.value.split(',').map(v => v.trim())
                    }))}
                />
                </FormGroup>

                <FormGroup check>
                <Label check>
                    <Input type="checkbox" checked={data.isFeatured} onChange={(e) => setData(prev => ({ ...prev, isFeatured: e.target.checked }))} />
                    {' '} Featured
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

export default AdminECUFilesPage;