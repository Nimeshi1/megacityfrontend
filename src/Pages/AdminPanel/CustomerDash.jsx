import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../Util/AuthContext'; // Adjust the import path based on your file structure

const AdminCustomersPage = () => {
  const [customersData, setCustomersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const { user, logout } = useAuth(); // Get user and logout from AuthContext
  const API_BASE_URL = 'http://localhost:8080/auth/customers';

  // Fetch all customers when component mounts
  useEffect(() => {
    const fetchCustomers = async () => {
      if (!user) {
        setError('Please log in to view customers');
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          setError('Authentication token not found');
          setLoading(false);
          logout();
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get(`${API_BASE_URL}/viewCustomers`, config);
        setCustomersData(response.data);
        setLoading(false);
      } catch (err) {
        if (err.response?.status === 401) {
          setError('Session expired. Please log in again.');
          logout();
        } else {
          setError('Failed to fetch customers');
        }
        setLoading(false);
        console.error(err);
      }
    };

    fetchCustomers();
  }, [user, logout]);

  const handleViewClick = async (customerId) => {
    if (!user) {
      setError('Please log in to view customer details');
      return;
    }

    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        setError('Authentication token not found');
        logout();
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Updated endpoint to match backend
      const response = await axios.get(`${API_BASE_URL}/${customerId}`, config);
      setSelectedCustomer(response.data);
    } catch (err) {
      console.error('Error fetching customer:', err);
      if (err.response?.status === 401) {
        setError('Session expired. Please log in again.');
        logout();
      } else if (err.response?.status === 404) {
        setError(`Customer with ID ${customerId} not found`);
      } else {
        setError('Failed to fetch customer details');
      }
    }
  };

  const handleCloseDetails = () => {
    setSelectedCustomer(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-6 flex items-center justify-center">
        <p className="text-black">Loading customers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white p-6 flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 flex items-center text-black">
          <span className="mr-2">👥</span> Customers Management
        </h2>
        <div className="bg-[#071013] rounded-lg shadow-lg overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-700 text-gray-400">
                <th className="p-4">ID</th>
                <th className="p-4">Customer Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customersData.map((customer) => (
                <tr key={customer.customerId} className="border-t border-gray-700 text-white">
                  <td className="p-4">{customer.customerId}</td>
                  <td className="p-4">{customer.customerName}</td>
                  <td className="p-4">{customer.email}</td>
                  <td className="p-4">{customer.customerPhone}</td>
                  <td className="p-4">
                    <button
                      onClick={() => handleViewClick(customer.customerId)}
                      className="bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition-colors"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Display selected customer details */}
        {selectedCustomer && (
          <div className="mt-6 bg-[#071013] rounded-lg shadow-lg p-6 text-white">
            <h3 className="text-xl font-bold mb-4">Customer Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><strong>ID:</strong> {selectedCustomer.customerId}</p>
                <p><strong>Name:</strong> {selectedCustomer.customerName}</p>
                <p><strong>Email:</strong> {selectedCustomer.email}</p>
                <p><strong>Phone:</strong> {selectedCustomer.customerPhone}</p>
              </div>
              <div>
                <p><strong>Address:</strong> {selectedCustomer.customerAddress || 'N/A'}</p>
                <p><strong>NIC:</strong> {selectedCustomer.customerNic || 'N/A'}</p>
                <p><strong>Member Since:</strong> {selectedCustomer.memberSince || 'N/A'}</p>
                <p><strong>Preferred Payment:</strong> {selectedCustomer.preferredPayment || 'N/A'}</p>
              </div>
            </div>
            <button
              onClick={handleCloseDetails}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCustomersPage;