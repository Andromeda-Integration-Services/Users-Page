import React, { useState, useEffect } from 'react';
import { Card, Button, Alert, Table } from 'react-bootstrap';
import userService, { type RegisteredUser } from '../../api/userService';

const UserDropdownTest: React.FC = () => {
  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching users from API...');
      const fetchedUsers = await userService.getRegisteredUsers();
      console.log('Fetched users:', fetchedUsers);
      
      setUsers(fetchedUsers);
      setLastFetch(new Date());
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Card className="m-4">
      <Card.Header>
        <h4>User Dropdown Test</h4>
        <p className="mb-0 text-muted">Testing the user registration and dropdown functionality</p>
      </Card.Header>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <strong>Total Users: {users.length}</strong>
            {lastFetch && (
              <small className="text-muted ms-2">
                Last updated: {lastFetch.toLocaleTimeString()}
              </small>
            )}
          </div>
          <Button 
            variant="primary" 
            onClick={fetchUsers}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Refresh Users'}
          </Button>
        </div>

        {error && (
          <Alert variant="danger">
            <strong>Error:</strong> {error}
          </Alert>
        )}

        {users.length === 0 && !loading && !error && (
          <Alert variant="warning">
            No users found. This might indicate an issue with the API or authentication.
          </Alert>
        )}

        {users.length > 0 && (
          <>
            <h5>User Dropdown Preview:</h5>
            <select className="form-select mb-3">
              <option value="">Select a user...</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.fullName} ({user.email})
                  {user.department && ` - ${user.department}`}
                </option>
              ))}
            </select>

            <h5>User Details:</h5>
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Roles</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.fullName}</td>
                    <td>{user.email}</td>
                    <td>{user.department || 'N/A'}</td>
                    <td>{user.roles?.join(', ') || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}

        <div className="mt-4 p-3 bg-light rounded">
          <h6>Debug Information:</h6>
          <ul className="mb-0">
            <li><strong>API Base URL:</strong> {process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}</li>
            <li><strong>Users Endpoint:</strong> /users/registered</li>
            <li><strong>Authentication:</strong> {localStorage.getItem('token') ? 'Token present' : 'No token'}</li>
            <li><strong>Loading State:</strong> {loading ? 'Loading' : 'Idle'}</li>
            <li><strong>Error State:</strong> {error || 'None'}</li>
          </ul>
        </div>

        <div className="mt-3">
          <h6>Quick Actions:</h6>
          <div className="d-flex gap-2">
            <Button 
              variant="outline-primary" 
              size="sm"
              onClick={() => window.open('http://localhost:5173/register', '_blank')}
            >
              Open Registration
            </Button>
            <Button 
              variant="outline-secondary" 
              size="sm"
              onClick={() => window.open('http://localhost:5173/tickets/create', '_blank')}
            >
              Open Create Ticket
            </Button>
            <Button 
              variant="outline-info" 
              size="sm"
              onClick={() => console.log('Current users:', users)}
            >
              Log Users to Console
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default UserDropdownTest;
