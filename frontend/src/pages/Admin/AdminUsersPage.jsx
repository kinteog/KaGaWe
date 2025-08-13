import React, { useEffect, useState } from 'react';
import {
  Table, Button, Input, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label
} from 'reactstrap';
import { BASE_URL } from '../../utils/config';
import { saveAs } from 'file-saver';
import './admin.css';
import { FaUsers, FaUserShield, FaUser } from 'react-icons/fa';
import CountUp from 'react-countup';


const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(10);

  const [selectedUser, setSelectedUser] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const [addModal, setAddModal] = useState(false);

  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
    role: 'user',
    photo: ''
  });

const handleImageUpload = async (e, setData) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch(`${BASE_URL}/upload/avatars`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    const result = await res.json();
    if (result.success) {
      setData(prev => ({ ...prev, photo: result.imagePath }));
      alert("Image uploaded successfully!");
    } else {
      alert(result.message || "Image upload failed!");
    }
  } catch (err) {
    console.error("Upload error:", err);
    alert("Upload error");
  }
};


const handleCreateUser = async () => {

  if (!newUser.photo) {
    alert("Please upload a profile picture first");
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(newUser),
    });

    const result = await res.json();

    if (res.ok && result.success) {
      setUsers(prev => [result.data, ...prev]);
      setAddModal(false);
      setNewUser({ username: '', email: '', password: '', role: 'user' });
    } else {
      const errorMsg = result.message || result.error || `Error ${res.status}: ${res.statusText}`;
      alert(`Failed to create user: ${errorMsg}`);
    }
  } catch (err) {
    console.error('Create User Error:', err);
    alert(`Failed to create user: ${err.message}`);
  }
};




  const fetchUsers = async () => {
    try {
      const res = await fetch(`${BASE_URL}/users`, { credentials: 'include' });
      const data = await res.json();
      if (data.success) setUsers(data.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const [userCounts, setUserCounts] = useState({
    total: 0,
    admins: 0,
    users: 0,
  });

  useEffect(() => {
    if (users.length > 0) {
      const total = users.length;
      const admins = users.filter(user => user.role === 'admin').length;
      const normalUsers = users.filter(user => user.role === 'user').length;

      setUserCounts({ total, admins, users: normalUsers });
    }
  }, [users]);


  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortArrow = (key) => {
    if (sortConfig.key !== key) return '';
    return sortConfig.direction === 'asc' ? '▲' : '▼';
  };

  const filteredUsers = users.filter(user =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const { key, direction } = sortConfig;
    if (!key) return 0;

    let aVal = a[key];
    let bVal = b[key];

    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      const res = await fetch(`${BASE_URL}/users/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const result = await res.json();
      if (result.success) {
        setUsers(prev => prev.filter(u => u._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

const handleUpdate = async () => {

  if (!selectedUser.photo) {
    alert("Please upload a profile picture first");
    return;
  }

  try {
    const payload = {
      ...selectedUser,
      password: selectedUser.newPassword?.trim() ? selectedUser.newPassword : undefined
    };
    delete payload.newPassword;

    const res = await fetch(`${BASE_URL}/users/${selectedUser._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    });

    const result = await res.json();

    if (res.ok && result.success) {
      setUsers(prev =>
        prev.map(u => (u._id === selectedUser._id ? result.data : u))
      );
      setEditModal(false);
    } else {
      const errorMsg = result.message || result.error || `Error ${res.status}: ${res.statusText}`;
      alert(`Failed to update user: ${errorMsg}`);
    }
  } catch (err) {
    console.error('Update User Error:', err);
    alert(`Failed to update user: ${err.message}`);
  }
};



  const handleExportCSV = () => {
    const headers = ['Username', 'Email', 'Role', 'Created At', 'Updated At'];
    const rows = filteredUsers.map(user => [
      user.username,
      user.email,
      user.role,
      new Date(user.createdAt).toLocaleString(),
      new Date(user.updatedAt).toLocaleString()
    ]);

    const content = [
      headers.join(','),
      ...rows.map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    saveAs(blob, `Users_${timestamp}.csv`);
  };

  return (
    <div className="container mt-4">
      <div className="row g-2 mb-4">
        {[
          {
            label: 'All Users',
            className: 'card-total',
            icon: <FaUsers />,
            count: userCounts.total,
          },
          {
            label: 'Admins',
            className: 'card-confirmed',
            icon: <FaUserShield />,
            count: userCounts.admins,
          },
          {
            label: 'Normal Users',
            className: 'card-normal-user',
            icon: <FaUser />,
            count: userCounts.users,
          }
        ].map(({ label, className, icon, count }) => (
          <div className="col-12 col-sm-12 col-md-4" key={label}>
            <div className={`card-status ${className}`}>
              {React.cloneElement(icon, { className: "animated-icon", size: 30 })}
              <h6>{label}</h6>
              <h4><CountUp end={count || 0} duration={2} /></h4>
            </div>
          </div>
        ))}
      </div>


      <div className="top-bar d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
        <h2 className="mb-3">Users Management</h2>

        <Button color="success" onClick={() => setAddModal(true)}>
          + Create User
        </Button>

        <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
          <label className="mb-0">Search:</label>
          <div className="flex-grow-1 flex-md-grow-0" style={{ minWidth: '250px', maxWidth: '400px' }}>
            <Input
              type="text"
              placeholder="username, email or role..."
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

      <Table striped bordered responsive className="user-table">
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
                  onClick={() => handleSort('email')}
                  className={sortConfig.key === 'email' ? 'sorted-column' : ''}
                  style={{ cursor: 'pointer' }}
                >
                  Email {getSortArrow('email')}
                </th>
                <th>Phone</th>


                <th
                  onClick={() => handleSort('role')}
                  className={sortConfig.key === 'role' ? 'sorted-column' : ''}
                  style={{ cursor: 'pointer' }}
                >
                  Role {getSortArrow('role')}
                </th>

                <th>Image</th>

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
          {currentUsers.length > 0 ? currentUsers.map((user, i) => (
            <tr key={user._id}>
              <td>{indexOfFirst + i + 1}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.phone || 'N/A'}</td>
              <td>{user.role}</td>
              <td>
                <img
                  src={
                    user.photo
                      ? `${BASE_URL}/uploads/${user.photo}`
                      : `${BASE_URL}/uploads/avatars/avatar.jpg`
                  }
                  alt={user.name}
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              </td>
              <td>{new Date(user.createdAt).toLocaleString()}</td>
              <td>{new Date(user.updatedAt).toLocaleString()}</td>
              <td>
                <Button size="sm" color="info" onClick={() => {
                  setSelectedUser(user);
                  setViewModal(true);
                }} className="me-1">View</Button>
                <Button size="sm" color="warning" onClick={() => {
                  setSelectedUser(user);
                  setEditModal(true);
                }} className="me-1">Edit</Button>
                <Button size="sm" color="danger" onClick={() => handleDelete(user._id)}>Delete</Button>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="6" className="text-center">No users found.</td>
            </tr>
          )}
        </tbody>
      </Table>

      

      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <Button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(p => p - 1)}
        >Previous</Button>

        <div className="d-flex flex-wrap gap-1">
          {[...Array(totalPages)].map((_, i) => (
            <Button
              key={i}
              color={currentPage === i + 1 ? 'primary' : 'light'}
              onClick={() => setCurrentPage(i + 1)}
            >{i + 1}</Button>
          ))}
        </div>

        <Button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(p => p + 1)}
        >Next</Button>

          <div className="d-flex align-items-center gap-2">
            <Label for="perPage" className="mb-0">Show</Label>
            <Input
              id="perPage"
              type="select"
              value={usersPerPage}
              onChange={(e) => {
                setUsersPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              style={{ width: 'auto' }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </Input>
            <Label className="mb-0">entries</Label>
          </div>
      </div>

      {/* View Modal */}
      <Modal isOpen={viewModal} toggle={() => setViewModal(!viewModal)}>
        <ModalHeader toggle={() => setViewModal(false)}>User Details</ModalHeader>
        <ModalBody>
          {selectedUser && (
            <>

              <div style={{ textAlign: "center", marginBottom: "15px" }}>
                <img
                  src={
                    selectedUser.photo
                      ? `${BASE_URL}/uploads/${selectedUser.photo}`
                      : `${BASE_URL}/uploads/avatars/avatar.jpg`
                  }
                  alt={selectedUser.name}
                  style={{
                    width: "180px",
                    height: "180px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #ddd",
                  }}
                />
              </div>
              <p><strong>Username:</strong> {selectedUser.username}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Role:</strong> {selectedUser.role}</p>
              <p><strong>Created:</strong> {new Date(selectedUser.createdAt).toLocaleString()}</p>
              <p><strong>Updated:</strong> {new Date(selectedUser.updatedAt).toLocaleString()}</p>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => setViewModal(false)}>Close</Button>
        </ModalFooter>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={editModal} toggle={() => setEditModal(!editModal)}>
        <ModalHeader toggle={() => setEditModal(false)}>Edit User</ModalHeader>
        <ModalBody>
          {selectedUser && (
            <Form>
              <FormGroup>
                <Label>Username</Label>
                <Input
                  type="text"
                  value={selectedUser.username}
                  onChange={(e) => setSelectedUser({ ...selectedUser, username: e.target.value })}
                />
              </FormGroup>

              <FormGroup>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                />
              </FormGroup>
              <FormGroup>
                <Label>Phone</Label>
                <Input
                  type="text"
                  value={selectedUser.phone || ''}
                  onChange={(e) => setSelectedUser({ ...selectedUser, phone: e.target.value })}
                />
              </FormGroup>


              <FormGroup>
                <Label>New Password</Label>
                <Input
                  type="password"
                  placeholder="Enter new password (optional)"
                  value={selectedUser.newPassword || ''}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, newPassword: e.target.value })
                  }
                />
              </FormGroup>

              <FormGroup>
                <Label>Profile Picture</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, setSelectedUser)}
                />
                {selectedUser?.photo && (
                  <img
                    src={`${BASE_URL}/uploads/${selectedUser.photo}`}
                    alt="Preview"
                    style={{ width: "80px", marginTop: "5px", borderRadius: "5px" }}
                  />
                )}
              </FormGroup>

              <FormGroup>
                <Label>Role</Label>
                <Input
                  type="select"
                  value={selectedUser.role}
                  onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </Input>
              </FormGroup>
            </Form>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleUpdate}>Save</Button>
          <Button color="secondary" onClick={() => setEditModal(false)}>Cancel</Button>
        </ModalFooter>
      </Modal>

      {/* Add Modal */}
      <Modal isOpen={addModal} toggle={() => setAddModal(!addModal)}>
        <ModalHeader toggle={() => setAddModal(false)}>Create New User</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label>Username</Label>
              <Input
                type="text"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              />
            </FormGroup>

            <FormGroup>
              <Label>Email</Label>
              <Input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </FormGroup>

            <FormGroup>
              <Label>Password</Label>
              <Input
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              />
            </FormGroup>
            <FormGroup>
              <Label>Phone</Label>
              <Input
                type="text"
                value={newUser.phone}
                onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
              />
            </FormGroup>

            <FormGroup>
              <Label>Profile Picture</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, setNewUser)}
              />
              {newUser.photo && (
                <img
                  src={`${BASE_URL}/uploads/${newUser.photo}`}
                  alt="Preview"
                  style={{ width: "80px", marginTop: "5px", borderRadius: "5px" }}
                />
              )}
            </FormGroup>

            <FormGroup>
              <Label>Role</Label>
              <Input
                type="select"
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </Input>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleCreateUser}>Save</Button>
          <Button color="secondary" onClick={() => setAddModal(false)}>Cancel</Button>
        </ModalFooter>
      </Modal>

    </div>
  );
};

export default AdminUsersPage;
