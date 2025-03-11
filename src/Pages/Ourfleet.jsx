import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Cabs = () => {
  const [vehicles, setVehicles] = useState([]); // All vehicles fetched from the backend
  const [filteredVehicles, setFilteredVehicles] = useState([]); // Vehicles filtered based on selections
  const [availabilityFilter, setAvailabilityFilter] = useState('all'); // 'all', 'available', 'unavailable'
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('all'); // 'all', 'suv', 'sedan', 'van', etc.
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch data from the backend
    axios.get('http://localhost:8080/all/viewCars')
      .then(response => {
        // Transform the data to match the frontend structure
        const transformedData = response.data.map(car => ({
          id: car.carId,
          name: `${car.carBrand} ${car.carModel}`,
          year: new Date().getFullYear(), // You might want to add a year field to your Car model
          image: car.carImgUrl,
          passengers: car.capacity,
          luggage: 2, // You might want to add a luggage field to your Car model
          available: car.available,
          type: car.carModel.toLowerCase().includes('suv') ? 'suv' : 
                car.carModel.toLowerCase().includes('van') ? 'van' : 
                'sedan' // Example: Categorize vehicle types
        }));
        setVehicles(transformedData);
        setFilteredVehicles(transformedData); // Initialize filtered vehicles with all vehicles
      })
      .catch(error => {
        console.error('There was an error fetching the car data!', error);
      });
  }, []);

  useEffect(() => {
    // Apply filters whenever availabilityFilter or vehicleTypeFilter changes
    let filtered = vehicles;

    // Filter by availability
    if (availabilityFilter !== 'all') {
      filtered = filtered.filter(vehicle => 
        availabilityFilter === 'available' ? vehicle.available : !vehicle.available
      );
    }

    // Filter by vehicle type
    if (vehicleTypeFilter !== 'all') {
      filtered = filtered.filter(vehicle => vehicle.type === vehicleTypeFilter);
    }

    setFilteredVehicles(filtered);
  }, [availabilityFilter, vehicleTypeFilter, vehicles]);

  const handleBooking = (vehicleName) => {
    alert(`Thank you for booking a ${vehicleName}. A confirmation will be sent shortly.`);
  };

  // SVG Icons as components
  const CarIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5H6.5C5.84 5 5.29 5.42 5.08 6.01L3 12V20C3 20.55 3.45 21 4 21H5C5.55 21 6 20.55 6 20V19H18V20C18 20.55 18.45 21 19 21H20C20.55 21 21 20.55 21 20V12L18.92 6.01ZM6.5 16C5.67 16 5 15.33 5 14.5S5.67 13 6.5 13C7.33 13 8 13.67 8 14.5S7.33 16 6.5 16ZM17.5 16C16.67 16 16 15.33 16 14.5S16.67 13 17.5 13C18.33 13 19 13.67 19 14.5S18.33 16 17.5 16ZM5 11L6.5 6.5H17.5L19 11H5Z" fill="#A0E337"/>
    </svg>
  );

  const PassengerIcon = () => (
    <svg className="spec-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z" fill="#A0E337"/>
    </svg>
  );

  const LuggageIcon = () => (
    <svg className="spec-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 6H7C5.9 6 5 6.9 5 8V16C5 17.1 5.9 18 7 18H17C18.1 18 19 17.1 19 16V8C19 6.9 18.1 6 17 6ZM17 16H7V8H17V16Z" fill="#A0E337"/>
      <path d="M9 9H15V15H9V9Z" fill="#A0E337"/>
    </svg>
  );

  // Styles as a JavaScript object
  const styles = {
    container: {
      width: '100%',
      margin: 0,
      padding: '20px',
      backgroundColor: '#F0F8FF', // Changed to a light blue color
      color: '#121826', // Adjusted text color for better contrast
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      boxSizing: 'border-box',
    },
    appWrapper: {
      margin: 0,
      padding: 0,
      minHeight: '100vh',
      backgroundColor: '#121826',
    },
    header: {
      textAlign: 'center',
      padding: '40px 0',
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      marginBottom: '15px',
    },
    logoText: {
      color: '#a0e337',
      fontSize: '2.5rem',
      fontWeight: 'bold',
    },
    tagline: {
      color: '#121826', // Adjusted text color for better contrast
      fontSize: '1.2rem',
      marginBottom: '30px',
    },
    filters: {
      display: 'flex',
      justifyContent: 'center',
      gap: '20px',
      marginBottom: '30px',
    },
    filterSelect: {
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid #a0e337',
      backgroundColor: '#FFFFFF', // Changed to white for better contrast
      color: '#121826',
      fontSize: '1rem',
    },
    fleetGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: '20px',
    },
    vehicleCard: {
      borderRadius: '10px',
      overflow: 'hidden',
      backgroundColor: '#FFFFFF', // Changed to white for better contrast
      transition: 'transform 0.3s',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Added a subtle shadow
    },
    vehicleImage: {
      height: '200px',
      width: '100%',
      objectFit: 'cover',
    },
    vehicleDetails: {
      padding: '20px',
    },
    vehicleName: {
      fontSize: '1.4rem',
      fontWeight: 'bold',
      marginBottom: '5px',
      color: '#121826', // Adjusted text color for better contrast
    },
    vehicleYear: {
      color: '#666', // Adjusted text color for better contrast
      marginBottom: '15px',
    },
    vehicleSpecs: {
      display: 'flex',
      gap: '20px',
      marginBottom: '20px',
    },
    spec: {
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      color: '#666', // Adjusted text color for better contrast
    },
    bookButton: {
      display: 'block',
      width: '100%',
      padding: '15px',
      backgroundColor: '#a0e337',
      color: '#121826',
      border: 'none',
      borderRadius: '5px',
      fontSize: '1rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
    bookButtonDisabled: {
      backgroundColor: '#555',
      color: '#999',
      cursor: 'not-allowed',
    },
    statusTag: {
      display: 'inline-block',
      padding: '5px 10px',
      borderRadius: '4px',
      fontSize: '0.8rem',
      fontWeight: 'bold',
      float: 'right',
    },
    available: {
      backgroundColor: '#238636',
    },
    unavailable: {
      backgroundColor: '#da3633',
    },
  };

  return (
    <div style={styles.appWrapper}>
      {/* Top Header */}
      <div className="bg-blue-900 text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <span className="mr-2">📞</span>
            <span>+94 11 2345678</span>
          </div>
          <div className="text-sm">Available 24/7</div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-blue-100 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0 font-bold text-xl text-blue-900">
              MEGA CITY CAB
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-blue-950 hover:text-blue-800">Home</a>
              <Link to="/about" className="text-blue-950 hover:text-blue-900">About Us</Link>
              <Link to="/help" className="text-blue-950 hover:text-blue-900">Help</Link>
              <Link to="/drivers" className="text-blue-950 hover:text-blue-900">Driver</Link>
            </div>

            {/* Desktop Login/Register */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login" className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800">
                Login
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-blue-900"
              >
                {isMenuOpen ? '✕' : '☰'}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4">
              <div className="flex flex-col space-y-4">
                <a href="/" className="text-gray-700 hover:text-blue-900">Home</a>
                <a href="/about" className="text-gray-700 hover:text-blue-900">About Us</a>
                <a href="/help" className="text-gray-700 hover:text-yellow-500">Help</a>
                <a href="/drivers" className="text-gray-700 hover:text-yellow-500">Driver</a>
                <button 
                  onClick={() => navigate('/login')} 
                  className="bg-blue-950 text-white px-4 py-2 rounded-lg hover:bg-blue-800">
                  Login
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Fleet Page Content */}
      <div style={styles.container}>
        <header style={styles.header}>
          <div style={styles.logo}>
            <CarIcon />
            <span style={styles.logoText}>CABS</span>
          </div>
          <p style={styles.tagline}>Choose from our premium fleet of vehicles</p>
        </header>

        {/* Filters Section */}
        <div style={styles.filters}>
          <select
            style={styles.filterSelect}
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
          >
            <option value="all">All Availability</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>

          <select
            style={styles.filterSelect}
            value={vehicleTypeFilter}
            onChange={(e) => setVehicleTypeFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="suv">SUV</option>
            <option value="sedan">Sedan</option>
            <option value="van">Van</option>
          </select>
        </div>

        {/* Vehicle List */}
        <div style={styles.fleetGrid}>
          {filteredVehicles.map((vehicle) => (
            <div key={vehicle.id} style={styles.vehicleCard}>
              <img 
                src={vehicle.image} 
                alt={vehicle.name} 
                style={styles.vehicleImage}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/400x300?text=Vehicle+Image";
                }}
              />
              <div style={styles.vehicleDetails}>
                <div>
                  <span 
                    style={{
                      ...styles.statusTag,
                      ...(vehicle.available ? styles.available : styles.unavailable),
                    }}
                  >
                    {vehicle.available ? 'Available' : 'Unavailable'}
                  </span>
                  <h2 style={styles.vehicleName}>{vehicle.name}</h2>
                  <p style={styles.vehicleYear}>{vehicle.year}</p>
                </div>
                <div style={styles.vehicleSpecs}>
                  <div style={styles.spec}>
                    <PassengerIcon />
                    <span>{vehicle.passengers} Passengers</span>
                  </div>
                  <div style={styles.spec}>
                    <LuggageIcon />
                    <span>{vehicle.luggage} Luggage</span>
                  </div>
                </div>
                <button 
                  style={{
                    ...styles.bookButton,
                    ...(vehicle.available ? {} : styles.bookButtonDisabled),
                  }}
                  onClick={() => vehicle.available && handleBooking(vehicle.name)}
                  disabled={!vehicle.available}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer style={{ backgroundColor: '#121826', color: 'white', textAlign: 'center', padding: '20px' }}>
        <p>© 2023 Mega City Cab. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Cabs;