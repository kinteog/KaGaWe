import React, { useState, useEffect, useContext } from 'react';
import {
  Container, Card, CardBody,CardTitle, Button, Modal, ModalHeader, ModalBody, ModalFooter,
  Form, FormGroup, Label, Input
} from 'reactstrap';
import { AuthContext } from '../context/AuthContext';
import { BASE_URL } from '../utils/config';
import defaultAvatar from '../assets/images/user.png';
import '../styles/UserProfilePage.css';
import { useNavigate } from 'react-router-dom';

const UserProfilePage = () => {
  const { user, dispatch } = useContext(AuthContext);

  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [changePassword, setChangePassword] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setEditData({
        name: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        _id: user._id,
      });
    }
  }, [user]);

  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${BASE_URL}/servicebooking/user/${user._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          // Sort bookings newest to oldest
          const sorted = data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setBookings(sorted);
        } else {
          alert(data.message || 'Failed to fetch bookings');
        }
      } catch (err) {
        console.error(err);
        alert('Error fetching bookings');
      }
    };

    if (user?._id) {
      fetchBookings();
    }
  }, [user]);




  const handleSaveChanges = async () => {
    try {
      if (!editData._id) return alert('User ID not available');

      const token = localStorage.getItem('token');
      const payload = {
        username: editData.name,
        email: editData.email,
        phone: editData.phone,
      };

      if (changePassword) {
        if (passwords.new !== passwords.confirm) {
          alert("New passwords don't match.");
          return;
        }
        payload.password = passwords.new;
      }

      const res = await fetch(`${BASE_URL}/users/${editData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || 'Update failed.');
        return;
      }

      const updatedUser = {
        ...user,
        username: result.data.username,
        email: result.data.email,
        phone: result.data.phone,
      };

      dispatch({ type: 'UPDATE_PROFILE', payload: updatedUser });
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setEditData(updatedUser);
      alert('Profile updated successfully!');
      setEditModal(false);

    } catch (err) {
      console.error('Update error:', err);
      alert('Something went wrong. Try again.');
    }
  };

  if (!user) {
    return (
      <Container className="mt-5">
        <h5>Please log in to view your profile.</h5>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Card className="profile-card">
        <div className="profile-layout">
          <div className="profile-left">
            <img
              src={user.photo ? user.photo : defaultAvatar}
              alt="Profile"
              className="profile-avatar"
            />
          </div>

          <div className="profile-right">
            <CardBody>
              <CardTitle tag="h4">User Profile</CardTitle>
              <div className="profile-layout d-flex">

                {/* Right: User Details */}
                <div className="profile-details-section">
                  <p><strong>User Name:</strong> {user.username}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Phone:</strong> {user.phone || 'N/A'}</p>
                  <p><strong>Role:</strong> {user.role}</p>

                  <Button color="primary" onClick={() => setEditModal(true)}>Edit Profile</Button>

                  {user.role === 'admin' && (
                    <Button color="dark" className="ms-2" onClick={() => navigate('/admin')}>
                      Go to Admin Panel
                    </Button>
                  )}
                </div>
              </div>
            </CardBody>
          </div>
        </div>
      </Card>
      {bookings.length > 0 && (
        <div className="mt-4">
          <h5>Your Booked Services</h5>
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-light">
                <tr>
                  <th>Service Details</th>
                  <th>Booked Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id}>
                    <td>
                      {`${booking.serviceName} for ${booking.vehicleMake} ${booking.vehicleModel} (${booking.vehicleYear})`}
                    </td>
                    <td>{new Date(booking.bookedDate).toLocaleDateString()}</td>
                    <td>{booking.status || 'Pending'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}


      {/* Edit Modal (unchanged) */}
      <Modal isOpen={editModal} toggle={() => setEditModal(false)}>
        <ModalHeader toggle={() => setEditModal(false)}>Edit Profile</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label>Name</Label>
              <Input type="text" value={editData.name || ''} onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))} />
            </FormGroup>
            <FormGroup>
              <Label>Email</Label>
              <Input type="email" value={editData.email || ''} onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))} />
            </FormGroup>
            <FormGroup>
              <Label>Phone</Label>
              <Input type="text" value={editData.phone || ''} onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))} />
            </FormGroup>
            <FormGroup check className="mt-3">
              <Label check>
                <Input type="checkbox" checked={changePassword} onChange={(e) => setChangePassword(e.target.checked)} />
                {' '}Change Password
              </Label>
            </FormGroup>
            {changePassword && (
              <>
                <FormGroup className="mt-3">
                  <Label>New Password</Label>
                  <Input type="password" value={passwords.new} onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))} />
                </FormGroup>
                <FormGroup>
                  <Label>Confirm New Password</Label>
                  <Input type="password" value={passwords.confirm} onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))} />
                </FormGroup>
              </>
            )}
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSaveChanges}>Save Changes</Button>
          <Button color="secondary" onClick={() => setEditModal(false)}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default UserProfilePage;
