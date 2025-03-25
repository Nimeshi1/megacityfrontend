import React, { useState, useEffect } from 'react';
import { CalendarIcon, ClockIcon, MapPinIcon, TrashIcon, AlertCircleIcon, UserIcon, PhoneIcon, MailIcon, SaveIcon, CreditCardIcon, IdCardIcon } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../Util/AuthContext';

// API Base URL
const API_BASE_URL = 'http://localhost:8080';

// Customer API Service
const customerAPI = {
  baseURL: `${API_BASE_URL}/auth/customers`,

  getCustomer: async (id) => {
    const token = localStorage.getItem('jwtToken');
    if (!token) throw new Error('No authentication token found. Please log in.');
    try {
      const response = await axios.get(`${customerAPI.baseURL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching customer:', error.response?.data || error.message);
      throw error;
    }
  },

  updateCustomer: async (id, data) => {
    const token = localStorage.getItem('jwtToken');
    if (!token) throw new Error('No authentication token found. Please log in.');
    try {
      const response = await axios.put(`${customerAPI.baseURL}/updateCustomer/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating customer:', error.response?.data || error.message);
      throw error;
    }
  },

  getBookings: async () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) throw new Error('No authentication token found. Please log in.');
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/bookings/getallcustomerbookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('Raw bookings response:', response.data); // Debug raw data
      return response.data;
    } catch (error) {
      console.error('Error fetching bookings:', error.response?.data || error.message);
      throw error;
    }
  },

  cancelBooking: async (bookingId, reason) => {
    const token = localStorage.getItem('jwtToken');
    console.log('Cancel Booking - Token:', token);
    console.log('Cancel Booking - Booking ID:', bookingId);
    console.log('Cancel Booking - Payload:', { cancellationReason: reason });
    if (!token) throw new Error('No authentication token found. Please log in.');
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/bookings/${bookingId}/cancel`,
        { cancellationReason: reason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Cancel Booking - Success Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error canceling booking:', error.response?.data?.message || error.message);
      throw error;
    }
  },
};

// BookingsSection
const BookingsSection = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?.userId) {
        setLoading(false);
        setError('Please log in to view bookings.');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const bookingsData = await customerAPI.getBookings();

        const transformedBookings = bookingsData.map(booking => {
          const price = booking.totalAmount != null ? `LKR${(booking.totalAmount).toFixed(2)}` : 'LKR0.00';
          console.log(`Booking ID: ${booking.bookingId}, Total Amount: ${booking.totalAmount}, Price: ${price}`);
          return {
            id: booking.bookingId,
            status: booking.status === 'COMPLETED' ? 'Completed' :
                    booking.status === 'CANCELLED' ? 'Cancelled' : 'Upcoming',
            date: booking.bookingDate,
            time: booking.pickupTime,
            pickup: booking.pickupLocation,
            destination: booking.destination,
            driver: booking.driverDetails?.driverName || 'Not assigned',
            carModel: booking.driverDetails?.vehicleModel || 'Not assigned',
            price: price,
          };
        });

        setBookings(transformedBookings);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load bookings.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  const handleDeleteClick = (booking) => {
    setBookingToDelete(booking);
    setShowDeleteModal(true);
  };

  const confirmDelete = async (reason) => {
    if (!bookingToDelete?.id || !reason) return;

    try {
      setIsCancelling(true);
      setError(null);
      await customerAPI.cancelBooking(bookingToDelete.id, reason);
      setBookings(prev => prev.filter(b => b.id !== bookingToDelete.id));
      setSuccessMessage('Booking cancelled successfully!');
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to cancel booking.';
      setError(errorMessage);
      console.error('Cancellation error details:', err.response || err);
    } finally {
      setIsCancelling(false);
      setShowDeleteModal(false);
      setBookingToDelete(null);
    }
  };

  return (
    <div className="bg-blue-950 text-blue-950 min-h-[calc(100vh-200px)] p-6">
      <h2 className="text-2xl font-bold mb-6 text-blue-200">My Bookings</h2>
      {successMessage && (
        <div className="bg-green-900/50 border border-green-700 text-green-200 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      {loading && (
        <div className="text-center py-8 text-blue-200">Loading bookings...</div>
      )}
      {!loading && bookings.length > 0 ? (
        bookings.map(booking => (
          <BookingCard key={booking.id} booking={booking} onDelete={handleDeleteClick} />
        ))
      ) : (
        !loading && (
          <div className="bg-blue-900/50 rounded-lg p-6 text-center text-blue-200">
            <p>No bookings found.</p>
          </div>
        )
      )}
      {showDeleteModal && (
        <DeleteConfirmationModal
          onCancel={() => {
            setShowDeleteModal(false);
            setBookingToDelete(null);
          }}
          onConfirm={confirmDelete}
          isSubmitting={isCancelling}
        />
      )}
    </div>
  );
};

// BookingCard
const BookingCard = ({ booking, onDelete }) => (
  <div className="mb-4 bg-blue-900/50 rounded-lg p-6 border border-blue-800">
    <div className="flex justify-between items-start">
      <div className="flex flex-col">
        <div className={`inline-flex px-3 py-1 rounded-full text-sm mb-4 ${
          booking.status === 'Upcoming' ? 'bg-blue-600 text-white' : 'bg-blue-800 text-blue-200'
        }`}>
          {booking.status}
        </div>
        <div className="flex items-center mb-2">
          <CalendarIcon size={16} className="mr-2 text-blue-400" />
          <span className="mr-4">{booking.date}</span>
          <ClockIcon size={16} className="mr-2 text-blue-400" />
          <span>{booking.time}</span>
        </div>
        <div className="flex items-center mb-2 text-blue-400">
          <div className="w-2 h-2 rounded-full bg-blue-400 mr-2"></div>
          <span>{booking.pickup}</span>
        </div>
        <div className="flex items-center mb-4 text-blue-400">
          <MapPinIcon size={16} className="mr-2" />
          <span>{booking.destination}</span>
        </div>
        <div className="text-blue-300 text-sm">
          Driver: {booking.driver} • {booking.carModel}
        </div>
      </div>
      <div className="text-right flex flex-col items-end">
        <div className="text-2xl font-bold text-blue-400 mb-2">
          {booking.price || '$0.00'}
        </div>
        {booking.status === 'Upcoming' && (
          <button
            className="px-3 py-1 bg-red-600/80 text-white rounded-md text-sm flex items-center hover:bg-red-700"
            onClick={() => onDelete(booking)}
          >
            <TrashIcon size={16} className="mr-1" />
            Cancel
          </button>
        )}
      </div>
    </div>
  </div>
);

// DeleteConfirmationModal
const DeleteConfirmationModal = ({ onCancel, onConfirm, isSubmitting }) => {
  const [reason, setReason] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason) return;
    await onConfirm(reason);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <form onSubmit={handleSubmit} className="bg-blue-900 rounded-lg p-6 max-w-md w-full text-white">
        <div className="flex items-center mb-4">
          <AlertCircleIcon className="text-red-500 mr-2" size={24} />
          <h3 className="text-xl font-bold text-blue-200">Confirm Cancellation</h3>
        </div>
        <p className="mb-4 text-blue-300">Are you sure you want to cancel this booking? This action cannot be undone.</p>
        <div className="mb-4">
          <label className="block text-blue-200 mb-2" htmlFor="reason">Reason for cancellation</label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full bg-blue-800 border border-blue-700 text-white rounded-lg p-2 focus:ring-blue-400 focus:border-blue-400"
            rows="3"
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-blue-800 rounded-md text-blue-200 hover:bg-blue-700 disabled:opacity-50"
            disabled={isSubmitting}
          >
            Go Back
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-red-600 text-white rounded-md flex items-center justify-center min-w-[150px] hover:bg-red-700 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : 'Confirm Cancellation'}
          </button>
        </div>
      </form>
    </div>
  );
};

// ProfileSection (Restored)
const ProfileSection = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    customerId: '',
    customerNic: '',
    customerName: '',
    customerAddress: '',
    email: '',
    customerPhone: '',
    memberSince: '',
    preferredPayment: '',
  });
  const [formData, setFormData] = useState({ ...profile });

  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!user?.userId) {
        setError('Please log in to view your profile.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await customerAPI.getCustomer(user.userId);
        const profileData = {
          customerId: data.customerId,
          customerNic: data.customerNic,
          customerName: data.customerName,
          customerAddress: data.customerAddress,
          email: data.email,
          customerPhone: data.customerPhone,
          memberSince: data.memberSince || 'January 2022',
          preferredPayment: data.preferredPayment || 'Credit Card',
        };
        setProfile(profileData);
        setFormData(profileData);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const customerData = {
        customerId: formData.customerId,
        customerNic: formData.customerNic,
        customerName: formData.customerName,
        customerAddress: formData.customerAddress,
        email: formData.email,
        customerPhone: formData.customerPhone,
      };
      await customerAPI.updateCustomer(formData.customerId, customerData);
      setProfile(prev => ({ ...prev, ...formData }));
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update profile.');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center p-8 text-blue-200">Loading profile...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-900/50 text-red-200 p-4 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-200">Personal Information</h2>
        {!isEditing && (
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        )}
      </div>
      {!isEditing ? (
        <div className="bg-blue-900/50 rounded-lg p-6">
          <div className="flex items-center mb-6">
            <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-2xl mr-4">
              {profile.customerName?.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h3 className="text-2xl text-blue-200">{profile.customerName}</h3>
              <p className="text-blue-300">Member since {profile.memberSince}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <label className="block text-blue-300 mb-1">Email</label>
                <div className="flex items-center text-blue-400">
                  <MailIcon size={18} className="mr-2" />
                  <span>{profile.email}</span>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-blue-300 mb-1">Address</label>
                <div className="flex items-center text-blue-400">
                  <MapPinIcon size={18} className="mr-2" />
                  <span>{profile.customerAddress}</span>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-blue-300 mb-1">NIC</label>
                <div className="flex items-center text-blue-400">
                  <IdCardIcon size={18} className="mr-2" />
                  <span>{profile.customerNic}</span>
                </div>
              </div>
            </div>
            <div>
              <div className="mb-4">
                <label className="block text-blue-300 mb-1">Phone</label>
                <div className="flex items-center text-blue-400">
                  <PhoneIcon size={18} className="mr-2" />
                  <span>{profile.customerPhone}</span>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-blue-300 mb-1">Preferred Payment</label>
                <div className="flex items-center text-blue-400">
                  <CreditCardIcon size={18} className="mr-2" />
                  <span>{profile.preferredPayment}</span>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-blue-300 mb-1">Customer ID</label>
                <div className="flex items-center text-blue-400">
                  <UserIcon size={18} className="mr-2" />
                  <span>{profile.customerId}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-blue-900/50 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-blue-300 mb-1" htmlFor="customerName">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <UserIcon size={18} className="text-blue-400" />
                  </div>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    className="bg-blue-800 border border-blue-700 text-white rounded-lg focus:ring-blue-400 focus:border-blue-400 block w-full pl-10 p-2.5"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-blue-300 mb-1" htmlFor="email">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <MailIcon size={18} className="text-blue-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-blue-800 border border-blue-700 text-white rounded-lg focus:ring-blue-400 focus:border-blue-400 block w-full pl-10 p-2.5"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-blue-300 mb-1" htmlFor="customerPhone">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <PhoneIcon size={18} className="text-blue-400" />
                  </div>
                  <input
                    type="text"
                    id="customerPhone"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleChange}
                    className="bg-blue-800 border border-blue-700 text-white rounded-lg focus:ring-blue-400 focus:border-blue-400 block w-full pl-10 p-2.5"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-blue-300 mb-1" htmlFor="customerAddress">Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <MapPinIcon size={18} className="text-blue-400" />
                  </div>
                  <input
                    type="text"
                    id="customerAddress"
                    name="customerAddress"
                    value={formData.customerAddress}
                    onChange={handleChange}
                    className="bg-blue-800 border border-blue-700 text-white rounded-lg focus:ring-blue-400 focus:border-blue-400 block w-full pl-10 p-2.5"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-blue-300 mb-1" htmlFor="customerNic">NIC Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <IdCardIcon size={18} className="text-blue-400" />
                  </div>
                  <input
                    type="text"
                    id="customerNic"
                    name="customerNic"
                    value={formData.customerNic}
                    onChange={handleChange}
                    className="bg-blue-800 border border-blue-700 text-white rounded-lg focus:ring-blue-400 focus:border-blue-400 block w-full pl-10 p-2.5"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-blue-300 mb-1" htmlFor="preferredPayment">Preferred Payment Method</label>
                <select
                  id="preferredPayment"
                  name="preferredPayment"
                  value={formData.preferredPayment}
                  onChange={handleChange}
                  className="bg-blue-800 border border-blue-700 text-white rounded-lg focus:ring-blue-400 focus:border-blue-400 block w-full p-2.5"
                >
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-6 gap-3">
            <button
              type="button"
              className="px-4 py-2 bg-blue-800 rounded-md text-blue-200 hover:bg-blue-700"
              onClick={() => {
                setFormData({ ...profile });
                setIsEditing(false);
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium flex items-center hover:bg-blue-700"
            >
              <SaveIcon size={18} className="mr-2" />
              Save Changes
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

// CustomerProfile
const CustomerProfile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchCustomerInfo = async () => {
      if (!user?.userId) {
        setLoading(false);
        setCustomerData(null);
        return;
      }
      try {
        setLoading(true);
        const data = await customerAPI.getCustomer(user.userId);
        setCustomerData({
          customerId: data.customerId,
          customerName: data.customerName,
        });
      } catch (err) {
        console.error('Error fetching customer info:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerInfo();
  }, [user]);

  return (
    <div className="w-full min-h-screen text-blue-950 bg-white">
      <header className="border-b border-blue-900 p-4 bg-blue-900/50">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            <span className="text-white">MEGACITY</span>
            <span className="text-blue-400"> CABS</span>
          </h1>
          {loading ? (
            <div className="text-blue-300">Loading...</div>
          ) : user ? (
            <div className="flex items-center gap-3">
              <span className="text-blue-300">{customerData?.customerName || user.username}</span>
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                {(customerData?.customerName || user.username)?.split(' ').map(n => n[0]).join('')}
              </div>
              <button
                onClick={logout}
                className="px-3 py-1 bg-red-600/80 text-white rounded-md text-sm hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="text-blue-300">Not logged in</div>
          )}
        </div>
      </header>
      <main className="container mx-auto p-4">
        {!user ? (
          <div className="text-center">Please log in to view your profile.</div>
        ) : (
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/4">
              <div className="bg-blue-900/50 rounded-lg p-4">
                <nav>
                  <ul className="space-y-2">
                    <li>
                      <button
                        className={`w-full text-left p-3 rounded-md flex items-center gap-3 ${activeTab === 'profile' ? 'bg-blue-600 text-white' : 'hover:bg-blue-800 text-blue-400'}`}
                        onClick={() => setActiveTab('profile')}
                      >
                        <UserIcon size={20} />
                        <span>Profile</span>
                      </button>
                    </li>
                    <li>
                      <button
                        className={`w-full text-left p-3 rounded-md flex items-center gap-3 ${activeTab === 'bookings' ? 'bg-blue-600 text-white' : 'hover:bg-blue-800 text-blue-400'}`}
                        onClick={() => setActiveTab('bookings')}
                      >
                        <CalendarIcon size={20} />
                        <span>My Bookings</span>
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
            <div className="md:w-3/4 bg-blue-900/50 rounded-lg p-6">
              {activeTab === 'profile' && <ProfileSection />}
              {activeTab === 'bookings' && <BookingsSection />}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CustomerProfile;