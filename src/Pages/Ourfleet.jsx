import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Fleets = () => {
  const navigate = useNavigate();
  const [cabs, setCabs] = useState([]);
  const [filters, setFilters] = useState({
    type: 'All',
    availability: 'All'
  });
  const [filteredCabs, setFilteredCabs] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu toggle

  // Fetch data from the backend
  useEffect(() => {
    const fetchCabs = async () => {
      try {
        const response = await fetch('http://localhost:8080/all/viewCars');
        const data = await response.json();
        
        // Map backend data to frontend structure
        const mappedCabs = data.map(car => ({
          id: car.carId,
          brand: car.carBrand,
          model: car.carModel,
          type: car.baseRate > 300 ? "Luxury" : "Economy", // Modified type classification
          seats: car.capacity,
          available: car.available,
          image: car.carImgUrl || '/api/placeholder/300/200',
          hourlyRate: car.baseRate > 300 ? 25 : 15 // Updated hourly rate based on new classification
        }));

        setCabs(mappedCabs);
        setFilteredCabs(mappedCabs);
      } catch (error) {
        console.error('Error fetching cabs:', error);
      }
    };

    fetchCabs();
  }, []);

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters({
      ...filters,
      [filterType]: value
    });
  };

  // Apply filters whenever filters state changes
  useEffect(() => {
    let result = [...cabs];
    
    // Filter by car type
    if (filters.type !== 'All') {
      result = result.filter(cab => cab.type === filters.type);
    }
    
    // Filter by availability
    if (filters.availability !== 'All') {
      const isAvailable = filters.availability === 'Available';
      result = result.filter(cab => cab.available === isAvailable);
    }
    
    setFilteredCabs(result);
  }, [filters, cabs]);

  // Updated car types for filter dropdown (only Economy and Luxury)
  const carTypes = ['All', 'Economy', 'Luxury'];

  // Handle booking - Navigate to booking page with selected car
  const handleBooking = (cab) => {
    navigate('/booking', { state: { selectedCar: cab } });
  };

  // Scroll to the Cabs grid section
  const scrollToCabsGrid = () => {
    const cabsGridSection = document.getElementById('cabs-grid');
    if (cabsGridSection) {
      cabsGridSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
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
              <a href="/help" className="text-blue-950 hover:text-blue-900">Help</a>
              <Link to="/drivers" className="text-blue-950 hover:text-blue-900">Driver</Link>
            </div>
            
            {/* Desktop Login/Register with Profile Icon */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center">
                <Link to="/customerprofile" className="cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-blue-800 flex items-center justify-center text-white mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                </Link>
                <Link to="/login" className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800">
                  Login
                </Link>
              </div>
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
                <a href="/help" className="text-blue-950 hover:text-blue-900">Help</a>
                <a href="/about" className="text-gray-700 hover:text-yellow-500">Driver</a>
                
                {/* Mobile Login with Profile Icon */}
                <div className="flex items-center">
                  <Link to="/customerprofile" className="cursor-pointer">
                    <div className="w-6 h-6 rounded-full bg-blue-800 flex items-center justify-center text-white mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                  </Link>
                  <button
                    onClick={() => navigate('/login')}
                    className="bg-blue-950 text-white px-4 py-2 rounded-lg hover:bg-blue-800"
                  >
                    Login
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main content */}
      <div className="bg-white">
      <div className="bg-blue-900 p-12 rounded-lg shadow-xl max-w-2xl mx-auto"> {/* Increased padding and max width */}
  <div className="flex flex-col justify-center items-center text-center">
    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Our Vehicles</h1> {/* Larger heading */}
    <p className="text-xl text-white mb-4">Providing safe and reliable transportation services since 2010</p>
    <p className="text-xl text-white">Your Trusted Ride Partner</p>
  </div>
</div>
        {/* Hero Header Section */}
        <div className="bg-blue-950 relative overflow-hidden">
       
          {/* Wave SVG at the bottom of the header */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full">
              <path fill="#FFFFFF" fillOpacity="1" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,42.7C1120,32,1280,32,1360,32L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
            </svg>
          </div>
        </div>
        
        {/* Main content */}
        <div className="container mx-auto px-4 py-12">
          {/* New Modern Curved Filter Section */}
          <div className="relative mb-20 max-w-3xl mx-auto">
            {/* Content */}
            <div className="relative z-10 px-8 py-10">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-lg font-bold text-blue-950">Availability</label>
                  <div className="relative">
                    <select 
                      className="w-full p-4 bg-white text-blue-950 border-none rounded-xl shadow-md appearance-none focus:ring-2 focus:ring-blue-950 transition-all"
                      value={filters.availability}
                      onChange={(e) => handleFilterChange('availability', e.target.value)}
                    >
                      <option value="All">All</option>
                      <option value="Available">Available</option>
                      <option value="Unavailable">Unavailable</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                      <svg className="h-5 w-5 text-blue-950" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Cabs grid */}
          <div id="cabs-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCabs.length > 0 ? (
              filteredCabs.map(cab => (
                <div key={cab.id} className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 border border-gray-100">
                  <div className="relative">
                    <img 
                      src={cab.image} 
                      alt={`${cab.brand} ${cab.model}`} 
                      className="w-full h-56 object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <span className={`px-4 py-1 rounded-full text-sm font-medium ${cab.available ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                        {cab.available ? "Available" : "Unavailable"}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-2 text-blue-950">{cab.brand} {cab.model}</h3>
                    <div className="text-gray-600 mb-6 space-y-1">
                      
                      <p className="flex items-center">
                        <span className="w-24 font-medium">Capacity:</span> 
                        <span>{cab.seats}</span>
                      </p>
                    </div>
                    {cab.available ? (
                      <button 
                        className="w-full bg-blue-950 text-white py-3 rounded-lg hover:bg-blue-900 transition shadow-md"
                        onClick={() => handleBooking(cab)}
                      >
                        Book Now
                      </button>
                    ) : (
                      <button 
                        className="w-full bg-gray-300 text-gray-500 py-3 rounded-lg cursor-not-allowed"
                        disabled
                      >
                        Unavailable
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xl font-medium mb-2">No matching vehicles found</p>
                <p>Try adjusting your filter options to see more vehicles.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fleets;