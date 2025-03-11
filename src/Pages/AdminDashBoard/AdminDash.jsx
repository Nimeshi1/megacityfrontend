import React, { useState } from 'react';
import { X, Menu, Users, Car, Calendar, User, LogOut, Search, Plus, Edit, Trash, ChevronLeft, ChevronRight } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('cars');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showAddCarForm, setShowAddCarForm] = useState(false);
  const [carFormData, setCarFormData] = useState({
    id: null,
    image: '',
    brand: '',
    model: '',
    passengers: '',
    luggage: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Sample data
  const [cars, setCars] = useState([
    { id: 1, image: '/api/placeholder/80/60', brand: 'Toyota', model: 'Camry', passengers: 5, luggage: 3 },
    { id: 2, image: '/api/placeholder/80/60', brand: 'Honda', model: 'Civic', passengers: 5, luggage: 2 },
    { id: 3, image: '/api/placeholder/80/60', brand: 'BMW', model: 'X5', passengers: 7, luggage: 4 },
  ]);

  const [drivers, setDrivers] = useState([
    { id: 1, name: 'John Doe', phone: '123-456-7890', license: 'DL12345', hireDate: '2023-01-15' },
    { id: 2, name: 'Jane Smith', phone: '987-654-3210', license: 'DL67890', hireDate: '2023-02-20' },
  ]);

  const [bookings, setBookings] = useState([
    { id: 1, customer: 'Alice Johnson', car: 'Toyota Camry', driver: 'John Doe', start: '2025-03-10', end: '2025-03-15' },
    { id: 2, customer: 'Bob Williams', car: 'Honda Civic', driver: 'Jane Smith', start: '2025-03-12', end: '2025-03-14' },
  ]);

  const [customers, setCustomers] = useState([
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', phone: '555-123-4567', memberSince: '2024-05-10' },
    { id: 2, name: 'Bob Williams', email: 'bob@example.com', phone: '555-987-6543', memberSince: '2024-06-15' },
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCarFormData({ ...carFormData, [name]: value });
  };

  const handleAddCar = () => {
    if (isEditing) {
      // Update existing car
      setCars(cars.map(car => car.id === carFormData.id ? carFormData : car));
    } else {
      // Add new car
      setCars([...cars, { ...carFormData, id: Date.now() }]);
    }
    resetCarForm();
  };

  const handleDeleteItem = (id, type) => {
    if (type === 'cars') {
      setCars(cars.filter(car => car.id !== id));
    } else if (type === 'drivers') {
      setDrivers(drivers.filter(driver => driver.id !== id));
    } else if (type === 'bookings') {
      setBookings(bookings.filter(booking => booking.id !== id));
    } else if (type === 'customers') {
      setCustomers(customers.filter(customer => customer.id !== id));
    }
  };

  const handleEditCar = (car) => {
    setCarFormData(car);
    setIsEditing(true);
    setShowAddCarForm(true);
  };

  const resetCarForm = () => {
    setCarFormData({
      id: null,
      image: '',
      brand: '',
      model: '',
      passengers: '',
      luggage: '',
    });
    setIsEditing(false);
    setShowAddCarForm(false);
  };

  const filterData = (data, searchTerm) => {
    if (!searchTerm) return data;
    
    const lowercaseSearch = searchTerm.toLowerCase();
    
    if (activeTab === 'cars') {
      return data.filter(car => 
        car.brand.toLowerCase().includes(lowercaseSearch) || 
        car.model.toLowerCase().includes(lowercaseSearch)
      );
    } else if (activeTab === 'drivers') {
      return data.filter(driver => 
        driver.name.toLowerCase().includes(lowercaseSearch) || 
        driver.phone.includes(lowercaseSearch) ||
        driver.license.toLowerCase().includes(lowercaseSearch)
      );
    } else if (activeTab === 'bookings') {
      return data.filter(booking => 
        booking.customer.toLowerCase().includes(lowercaseSearch) || 
        booking.car.toLowerCase().includes(lowercaseSearch) ||
        booking.driver.toLowerCase().includes(lowercaseSearch)
      );
    } else if (activeTab === 'customers') {
      return data.filter(customer => 
        customer.name.toLowerCase().includes(lowercaseSearch) || 
        customer.email.toLowerCase().includes(lowercaseSearch) ||
        customer.phone.includes(lowercaseSearch)
      );
    }
    return data;
  };
  
  // Filter data based on search term
  const filteredCars = filterData(cars, searchTerm);
  const filteredDrivers = filterData(drivers, searchTerm);
  const filteredBookings = filterData(bookings, searchTerm);
  const filteredCustomers = filterData(customers, searchTerm);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-gray-800 text-white ${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 flex flex-col`}>
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold">Admin Panel</h1>}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="p-2 rounded-md hover:bg-gray-700"
          >
            {sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
          </button>
        </div>
        
        <nav className="flex-1">
          <ul className="pt-2">
            <li>
              <button 
                onClick={() => setActiveTab('cars')}
                className={`flex items-center w-full p-4 hover:bg-gray-700 ${activeTab === 'cars' ? 'bg-gray-700' : ''}`}
              >
                <Car className="h-5 w-5 mr-2" />
                {sidebarOpen && <span>Cars</span>}
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('drivers')}
                className={`flex items-center w-full p-4 hover:bg-gray-700 ${activeTab === 'drivers' ? 'bg-gray-700' : ''}`}
              >
                <User className="h-5 w-5 mr-2" />
                {sidebarOpen && <span>Drivers</span>}
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('bookings')}
                className={`flex items-center w-full p-4 hover:bg-gray-700 ${activeTab === 'bookings' ? 'bg-gray-700' : ''}`}
              >
                <Calendar className="h-5 w-5 mr-2" />
                {sidebarOpen && <span>Bookings</span>}
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('customers')}
                className={`flex items-center w-full p-4 hover:bg-blue-950 ${activeTab === 'customers' ? 'bg-gray-700' : ''}`}
              >
                <Users className="h-5 w-5 mr-2" />
                {sidebarOpen && <span>Customers</span>}
              </button>
            </li>
          </ul>
        </nav>
        
        <div className="p-4">
          <button className="flex items-center w-full p-2 rounded-md hover:bg-gray-700">
            <LogOut className="h-5 w-5 mr-2" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <header className="bg-white shadow">
          <div className="p-4 flex items-center justify-between">
            <h2 className="text-xl font-bold capitalize">{activeTab}</h2>
            
            <div className="flex items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {activeTab === 'cars' && (
                <button 
                  onClick={() => {
                    resetCarForm();
                    setShowAddCarForm(true);
                  }}
                  className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-600"
                >
                  <Plus className="h-5 w-5 mr-1" />
                  Add Car
                </button>
              )}
            </div>
          </div>
        </header>
        
        <main className="p-6 overflow-auto h-[calc(100vh-80px)]">
          {/* Cars Tab */}
          {activeTab === 'cars' && (
            <>
              {showAddCarForm ? (
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">{isEditing ? 'Edit Car' : 'Add New Car'}</h3>
                    <button onClick={resetCarForm} className="text-gray-500 hover:text-gray-700">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    handleAddCar();
                  }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Car Image URL</label>
                        <input
                          type="text"
                          name="image"
                          className="w-full p-2 border rounded-md"
                          value={carFormData.image}
                          onChange={handleInputChange}
                          placeholder="Image URL"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                        <input
                          type="text"
                          name="brand"
                          className="w-full p-2 border rounded-md"
                          value={carFormData.brand}
                          onChange={handleInputChange}
                          placeholder="Car Brand"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                        <input
                          type="text"
                          name="model"
                          className="w-full p-2 border rounded-md"
                          value={carFormData.model}
                          onChange={handleInputChange}
                          placeholder="Car Model"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Passengers</label>
                        <input
                          type="number"
                          name="passengers"
                          className="w-full p-2 border rounded-md"
                          value={carFormData.passengers}
                          onChange={handleInputChange}
                          placeholder="Number of Passengers"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Luggage Capacity</label>
                        <input
                          type="number"
                          name="luggage"
                          className="w-full p-2 border rounded-md"
                          value={carFormData.luggage}
                          onChange={handleInputChange}
                          placeholder="Luggage Capacity"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={resetCarForm}
                        className="px-4 py-2 border rounded-md text-gray-700 mr-2 hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      >
                        {isEditing ? 'Update' : 'Add'} Car
                      </button>
                    </div>
                  </form>
                </div>
              ) : null}
              
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Car</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Passengers</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Luggage</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredCars.length > 0 ? (
                      filteredCars.map((car) => (
                        <tr key={car.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <img src={car.image} alt={`${car.brand} ${car.model}`} className="h-10 w-16 object-cover rounded" />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">{car.brand}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{car.model}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{car.passengers}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{car.luggage}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <button 
                              onClick={() => handleEditCar(car)}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button 
                              onClick={() => handleDeleteItem(car.id, 'cars')}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No cars found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
          
          {/* Drivers Tab */}
          {activeTab === 'drivers' && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hire Date</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDrivers.length > 0 ? (
                    filteredDrivers.map((driver) => (
                      <tr key={driver.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{driver.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{driver.phone}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{driver.license}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{driver.hireDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button 
                            onClick={() => handleDeleteItem(driver.id, 'drivers')}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No drivers found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Car</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.length > 0 ? (
                    filteredBookings.map((booking) => (
                      <tr key={booking.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{booking.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{booking.customer}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{booking.car}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{booking.driver}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{booking.start}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{booking.end}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button 
                            onClick={() => handleDeleteItem(booking.id, 'bookings')}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center text-gray-500">No bookings found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Customers Tab */}
          {activeTab === 'customers' && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member Since</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((customer) => (
                      <tr key={customer.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{customer.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{customer.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{customer.phone}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{customer.memberSince}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button 
                            onClick={() => handleDeleteItem(customer.id, 'customers')}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No customers found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;