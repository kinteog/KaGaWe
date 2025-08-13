import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Label, Input } from 'reactstrap';
import { BASE_URL } from '../../utils/config';

const AdminNewsletterPage = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'subscribedAt', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch subscribers
  const fetchSubscribers = async () => {
    try {
      const res = await fetch(`${BASE_URL}/newsletter`);
      const data = await res.json();
      if (data.success) {
        setSubscribers(data.data);
      } else {
        alert(data.message || 'Failed to fetch subscribers');
      }
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  // Delete subscriber
  const deleteSubscriber = async (id) => {
    if (!window.confirm('Delete this subscriber?')) return;

    try {
      const res = await fetch(`${BASE_URL}/newsletter/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        alert('Subscriber deleted');
        setSubscribers((prev) => prev.filter((s) => s._id !== id));
      } else {
        alert(data.message || 'Failed to delete subscriber');
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

// Export to CSV
const exportCSV = () => {
  const now = new Date();
  const dateTimeString = now
    .toISOString()
    .replace(/T/, '_')
    .replace(/:/g, '-')
    .replace(/\..+/, '');

  const fileName = `subscribers_${dateTimeString}.csv`;

  const csvContent =
    "data:text/csv;charset=utf-8," +
    ["Email,Subscribed At", ...subscribers.map(s =>
      `${s.email},"${new Date(s.subscribedAt).toLocaleString()}"`
    )].join("\n");

  const link = document.createElement("a");
  link.setAttribute("href", encodeURI(csvContent));
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

  // Sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Apply search filter
  const filteredSubscribers = subscribers.filter(s =>
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Apply sorting
  const sortedSubscribers = [...filteredSubscribers].sort((a, b) => {
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];
    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedSubscribers.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentSubscribers = sortedSubscribers.slice(indexOfFirst, indexOfLast);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  return (
    <Container className="mt-5">
      <h3>Newsletter Subscribers</h3>

      {/* Top Controls */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Input
          type="text"
          placeholder="Search by email..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // reset to page 1 after search
          }}
          style={{ maxWidth: '300px' }}
        />
        <Button color="success" onClick={exportCSV}>Export as CSV</Button>
      </div>

      {/* Table */}
      <Table bordered hover responsive>
        <thead>
          <tr>
            <th style={{ cursor: 'pointer' }} onClick={() => handleSort('email')}>
              Email {sortConfig.key === 'email' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
            </th>
            <th style={{ cursor: 'pointer' }} onClick={() => handleSort('subscribedAt')}>
              Subscribed At {sortConfig.key === 'subscribedAt' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentSubscribers.map((s) => (
            <tr key={s._id}>
              <td>{s.email}</td>
              <td>{new Date(s.subscribedAt).toLocaleString()}</td>
              <td>
                <Button color="danger" size="sm" onClick={() => deleteSubscriber(s._id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <Button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Previous</Button>

        <div>
          {[...Array(totalPages)].map((_, i) => (
            <Button
              key={i + 1}
              color={i + 1 === currentPage ? 'primary' : 'light'}
              onClick={() => setCurrentPage(i + 1)}
              className="mx-1"
            >
              {i + 1}
            </Button>
          ))}
        </div>

        <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next</Button>

        <div className="d-flex align-items-center ms-3">
          <Label for="entriesPerPage" className="me-2 mb-0">Show</Label>
          <Input
            id="entriesPerPage"
            type="select"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            style={{ width: 'auto', display: 'inline-block' }}
          >
            {[5, 10, 20, 50, 100].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </Input>
          <span className="ms-2">entries</span>
        </div>
      </div>
    </Container>
  );
};

export default AdminNewsletterPage;
