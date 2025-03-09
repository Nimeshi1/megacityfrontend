
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const AboutUs = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Top Header - Fixed */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-blue-900 py-2">
        <div className="container mx-auto px-6">
          <div className="flex justify-end space-x-4 text-sm text-white">
            <a href="tel:1-800-CABRIDE" className="hover:text-gray-200">📞 1-800-CABRIDE</a>
            <span>|</span>
            <a href="mailto:info@cabservice.com" className="hover:text-gray-200">✉️ info@cabservice.com</a>
          </div>
        </div>
      </div>

      {/* Main Navigation - Fixed */}
      <nav className="fixed top-8 left-0 right-0 z-50 bg-blue-100 shadow-lg sticky">
        <div className="container mx-auto px-6">
          <div className="flex h-20 items-center">
            {/* Logo - 25% width */}
            <div className="w-1/4">
              <div className="text-2xl font-bold text-yellow-500">
                <span className="flex items-center">
                  🚕 CabService
                </span>
              </div>
            </div>

            {/* Desktop Navigation - 50% width, centered */}
            <div className="hidden md:flex flex-1 items-center justify-center space-x-12">
              <a href="/" className="text-gray-700 hover:text-yellow-500 transition duration-300">Home</a>
              <a href="/vehicles" className="text-gray-700 hover:text-yellow-500 transition duration-300">Our Vehicles</a>
              <a href="/booking" className="text-gray-700 hover:text-yellow-500 transition duration-300">Book a Ride</a>
              <a href="/help" className="text-gray-700 hover:text-yellow-500 transition duration-300">Help</a>
              <a href="/drivers" className="text-gray-700 hover:text-yellow-500 transition duration-300">Driver</a>
            </div>

            {/* Login Button - 25% width */}
            <div className="hidden md:flex w-1/4 justify-end">
              <Link to="/login" className="bg-blue-900 text-white px-6 py-2 rounded-full hover:bg-yellow-600 transition duration-300">
                Login
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden ml-auto">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-yellow-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden pb-4">
              <div className="flex flex-col space-y-4">
                <a href="/" className="text-gray-700 hover:text-yellow-500">Home</a>
                <a href="/vehicles" className="text-gray-700 hover:text-yellow-500">Our Vehicles</a>
                <a href="/booking" className="text-gray-700 hover:text-yellow-500">Book a Ride</a>
                <a href="/about" className="text-gray-700 hover:text-yellow-500">Help</a>
                <a href="/about" className="text-gray-700 hover:text-yellow-500">Driver</a>
                <button 
                onClick={() => navigate('/login')} 
                className="bg-yellow-500 text-white px-6 py-2 rounded-full hover:bg-yellow-600 transition duration-300 w-full">
                  Login
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Spacer for fixed header */}
      <div className="h-8"></div>

      

      {/* Hero Section */}
      <div className="relative bg-yellow-500 h-96">
        <div className="absolute inset-0 bg-blue-950 bg-opacity-50">
          <div className="container mx-auto px-6 h-full flex items-center">
            <div className="text-white max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Your Trusted Ride Partner</h1>
              <p className="text-xl">Providing safe and reliable transportation services since 2010</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-blue-950">Our Mission</h2>
            <p className="text-gray-600 text-lg">
              To provide exceptional transportation services that exceed our customers' expectations through reliability, 
              safety, and professional service while maintaining the highest standards of customer satisfaction.
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <svg className="w-12 h-12 text-yellow-500 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9h18v10H3V9zm0-2V5a2 2 0 012-2h14a2 2 0 012 2v2M3 9l3-3m15 3l-3-3m-6 5h.01" />
              </svg>
              <h3 className="text-xl font-semibold mb-2">Modern Fleet</h3>
              <p className="text-gray-600">Latest model vehicles maintained to the highest standards</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <svg className="w-12 h-12 text-yellow-500 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              <h3 className="text-xl font-semibold mb-2">24/7 Service</h3>
              <p className="text-gray-600">Available round the clock for your convenience</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <svg className="w-12 h-12 text-yellow-500 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <h3 className="text-xl font-semibold mb-2">Safe Rides</h3>
              <p className="text-gray-600">Licensed drivers with extensive safety training</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <svg className="w-12 h-12 text-yellow-500 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87m-4-12a4 4 0 010 7.75" />
              </svg>
              <h3 className="text-xl font-semibold mb-2">Professional Team</h3>
              <p className="text-gray-600">Experienced and courteous drivers at your service</p>
            </div>
          </div>
        </div>
      </div>

      {/* Company Story */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center text-blue-950">Our Story</h2>
            <p className="text-gray-600 mb-4">
              Founded in 2010, we began with a simple vision: to revolutionize the local transportation industry 
              by providing reliable, safe, and comfortable rides to our community. What started with just five cars 
              has now grown into a fleet of over 100 vehicles serving the entire metropolitan area.
            </p>
            <p className="text-gray-600">
              Our commitment to excellence and customer satisfaction has earned us numerous industry awards and, 
              more importantly, the trust of thousands of satisfied customers who rely on us daily for their 
              transportation needs.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center text-blue-950">Get in Touch</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex items-center space-x-4">
              <svg className="w-8 h-8 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
              </svg>
              <div>
                <h3 className="font-semibold">Phone</h3>
                <p className="text-gray-600">1-800-CABRIDE</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <svg className="w-8 h-8 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <path d="M22 6l-10 7L2 6" />
              </svg>
              <div>
                <h3 className="font-semibold">Email</h3>
                <p className="text-gray-600">info@cabservice.com</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <svg className="w-8 h-8 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <div>
                <h3 className="font-semibold">Address</h3>
                <p className="text-gray-600">123 Transport Street, City</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;