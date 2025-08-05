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
  Input
} from 'reactstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { BASE_URL } from '../../utils/config';

const AdminSparePartsPage = () => {
  const [spareParts, setSpareParts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentPart, setCurrentPart] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);

  const toggleViewModal = () => setViewModalOpen(!viewModalOpen);


  const [formData, setFormData] = useState({
    name: '',
    description: '',
    manufacturer: '',
    price: '',
    stockQuantity: '',
  });

  const fetchSpareParts = async () => {
    try {
      const res = await fetch(`${BASE_URL}/spareparts`, {
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setSpareParts(data.data);
      }
    } catch (err) {
      alert('Failed to fetch spare parts.');
    }
  };

  useEffect(() => {
    fetchSpareParts();
  }, []);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (part) => {
    setEditMode(true);
    setCurrentPart(part);
    setFormData({
      name: part.name,
      description: part.description,
      manufacturer: part.manufacturer,
      price: part.price,
      stockQuantity: part.stockQuantity,
    });
    toggleModal();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this spare part?')) {
      try {
        const res = await fetch(`${BASE_URL}/spareparts/${id}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        const data = await res.json();
        if (data.success) {
          alert('Deleted successfully');
          fetchSpareParts();
        } else {
          alert('Delete failed');
        }
      } catch (err) {
        alert('Error deleting part');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editMode
      ? `${BASE_URL}/spareparts/${currentPart._id}`
      : `${BASE_URL}/spareparts`;

    const method = editMode ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        alert(editMode ? 'Updated successfully' : 'Created successfully');
        toggleModal();
        fetchSpareParts();
        setEditMode(false);
        setFormData({
          name: '',
          description: '',
          manufacturer: '',
          price: '',
          stockQuantity: '',
        });
      } else {
        alert('Operation failed');
      }
    } catch (err) {
      alert('Submission error');
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Spare Parts Management</h3>
        <Button color="primary" onClick={() => {
          setEditMode(false);
          setFormData({
            name: '',
            description: '',
            manufacturer: '',
            price: '',
            stockQuantity: '',
          });
          toggleModal();
        }}>
          <FaPlus className="me-2" /> Add Spare Part
        </Button>
      </div>

      <Table bordered responsive hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Manufacturer</th>
            <th>Price</th>
            <th>Stock Qty</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {spareParts.map((part) => (
            <tr key={part._id}>
              <td>{part.name}</td>
              <td>{part.manufacturer}</td>
              <td>${part.price}</td>
              <td>{part.stockQuantity}</td>
              <td>{part.description}</td>
                <td>
                <Button
                    color="info"
                    size="sm"
                    className="me-2"
                    onClick={() => {
                    setSelectedPart(part);
                    toggleViewModal();
                    }}
                >
                    View
                </Button>
                <Button
                    color="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEdit(part)}
                >
                    Edit
                </Button>
                <Button
                    color="danger"
                    size="sm"
                    onClick={() => handleDelete(part._id)}
                >
                    Delete
                </Button>
                </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>
          {editMode ? 'Edit Spare Part' : 'Add Spare Part'}
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input name="name" value={formData.name} onChange={handleChange} required />
            </FormGroup>
            <FormGroup>
              <Label for="manufacturer">Manufacturer</Label>
              <Input name="manufacturer" value={formData.manufacturer} onChange={handleChange} required />
            </FormGroup>
            <FormGroup>
              <Label for="price">Price</Label>
              <Input type="number" name="price" value={formData.price} onChange={handleChange} required />
            </FormGroup>
            <FormGroup>
              <Label for="stockQuantity">Stock Quantity</Label>
              <Input type="number" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} required />
            </FormGroup>
            <FormGroup>
              <Label for="description">Description</Label>
              <Input type="textarea" name="description" value={formData.description} onChange={handleChange} required />
            </FormGroup>
            <ModalFooter>
              <Button color="primary" type="submit">
                {editMode ? 'Update' : 'Create'}
              </Button>
              <Button color="secondary" onClick={toggleModal}>
                Cancel
              </Button>
            </ModalFooter>
          </Form>
        </ModalBody>
      </Modal>


      <Modal isOpen={viewModalOpen} toggle={toggleViewModal}>
        <ModalHeader toggle={toggleViewModal}>Spare Part Details</ModalHeader>
        <ModalBody>
            {selectedPart ? (
            <div>
                <p><strong>Name:</strong> {selectedPart.name}</p>
                <p><strong>Category:</strong> {selectedPart.category}</p>
                <p><strong>Description:</strong> {selectedPart.description}</p>
                <p><strong>Manufacturer:</strong> {selectedPart.manufacturer}</p>
                <p><strong>Part Number:</strong> {selectedPart.partNumber}</p>
                <p><strong>Price:</strong> ${selectedPart.price}</p>
                <p><strong>Stock Quantity:</strong> {selectedPart.stockQuantity}</p>
                <p><strong>Condition:</strong> {selectedPart.condition}</p>
                <p><strong>Location:</strong> {selectedPart.location}</p>
                <p><strong>Shipping Options:</strong> {selectedPart.shippingOptions.join(', ')}</p>
                <p><strong>Compatible Models:</strong> {selectedPart.compatibleModels.join(', ')}</p>
                <p><strong>Is Featured:</strong> {selectedPart.isFeatured ? 'Yes' : 'No'}</p>
                <p><strong>Image:</strong></p>
                <img
                src={selectedPart.imageUrl}
                alt={selectedPart.name}
                style={{ maxWidth: '100%', height: 'auto', borderRadius: '5px' }}
                />
            </div>
            ) : (
            <p>No part selected</p>
            )}
        </ModalBody>
        <ModalFooter>
            <Button color="secondary" onClick={toggleViewModal}>Close</Button>
        </ModalFooter>
        </Modal>

    </div>
  );
};

export default AdminSparePartsPage;
