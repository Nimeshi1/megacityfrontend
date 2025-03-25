import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import p2 from '../assets/p2.png';
import V1 from '../assets/V1.jpg';


const MegaCityCabHome = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Information items for the new section
  const infoItems = [
    {
      title: "Professional Drivers",
      description: "All our drivers are professionally trained, licensed, and background-checked to ensure your safety and comfort.",
      icon: "👨‍✈️"
    },
    {
      title: "Modern Fleet",
      description: "Our vehicles are regularly maintained and equipped with the latest safety features for a smooth journey.",
      icon: "🚗"
    },
    {
      title: "Fixed Pricing",
      description: "No hidden charges or surge pricing. Get transparent fare estimates before booking your ride.",
      icon: "💰"
    },
    {
      title: "24/7 Support",
      description: "Our customer service team is available round the clock to assist you with any queries or concerns.",
      icon: "🛎️"
    }
  ];

  const services = [
    "24/7 Availability",
    "Professional Drivers",
    "Fixed Pricing",
    "Online Booking"
  ];

  // Smooth scroll function
  const scrollToBooking = () => {
    const bookingSection = document.getElementById('booking');
    bookingSection.scrollIntoView({ behavior: 'smooth' });
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
               <a href="/ourfleet" className="text-blue-950 hover:text-blue-900">Our Vehicles</a>
               <a href="/booking" className="text-blue-950 hover:text-blue-900">Book Now</a>
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
                 <a href="/ourfleet" className="text-gray-700 hover:text-blue-900">Our Vehicles</a>
                 <a href="/booking" className="text-gray-700 hover:text-blue-900">Book Now</a>
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
      {/* Hero Section */}
      <section id="home" className="bg-gray-100 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <div className="space-y-8">
              <div>
                <h1 className="text-8xl md:text-6xl font-bold text-blue-950 mb-6">
                  Mega City Cab Service <span className="text-blue-900 text-4xl">Your Premium Cab Service in Colombo</span> 
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Experience the comfort and reliability of Mega City Cab. We provide professional 
                  taxi services with trained drivers and modern vehicles for your safe journey.
                </p>
                  <Link to="/ourfleet"
                  className="bg-blue-950 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-800 transition-colors"
                >
                  Book Now
                </Link>
              </div>

              {/* Services List */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Why Choose Us?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map((service, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="text-green-500 text-xl">✓</span>
                      <span className="text-gray-700">{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="relative">
              <div className="relative">
                <img 
                  src= {p2}
                  alt="Luxury Cab" 
                  className="rounded-lg shadow-2xl w-full"
                />
                
                {/* Stats Boxes */}
                <div className="absolute -bottom-10 left-0 right-0 flex justify-center gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-lg text-center w-32">
                    <div className="text-3xl font-bold text-blue-900">5K+</div>
                    <div className="text-sm text-gray-600">Monthly Rides</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-lg text-center w-32">
                    <div className="text-3xl font-bold text-blue-900">100+</div>
                    <div className="text-sm text-gray-600">Cars</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-lg text-center w-32">
                    <div className="text-3xl font-bold text-blue-900">4.9</div>
                    <div className="text-sm text-gray-600">Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Information Section (replacing Vehicles Section) */}
      <section id="information" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-blue-950 text-center mb-12">Why Ride With Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {infoItems.map((item, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="text-4xl text-blue-900 mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/ourfleet"
              className="bg-blue-900 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-800 transition-colors"
            >
              Book Your Ride Now
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">MEGA CITY CAB</h3>
              <p className="text-gray-300">
                Your trusted transportation partner in Colombo city.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="/" className="text-gray-300 hover:text-white">Home</a></li>
                <li><a href="/ourfleet" className="text-gray-300 hover:text-white">Our Vehicles</a></li>
                <li><a href="/booking" className="text-gray-300 hover:text-white">Book Now</a></li>
                <li><Link to="/about" className="text-gray-300 hover:text-white">About Us</Link></li>
                <li><a href="/help" className="text-gray-300 hover:text-white">Help</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="mr-2">📞</span>
                  +94 11 2345678
                </li>
                <li className="flex items-center">
                  <span className="mr-2">📍</span>
                  123 Main St, Colombo
                </li>
                <li className="flex items-center">
                  <span className="mr-2">🕒</span>
                  24/7 Service
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Working Hours</h4>
              <p className="text-gray-300">
                Monday - Sunday<br />
                24 Hours
              </p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p>&copy; 2025 Mega City Cab. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MegaCityCabHome;