import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const HelpPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqs = {
    general: [
      {
        q: "How do I book a ride?",
        a: "You can book a ride through our mobile app, website, or by calling our 24/7 customer service. Select your pickup location, destination, and preferred vehicle type to get started."
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit cards, debit cards, digital wallets (Apple Pay, Google Pay), and cash payments."
      },
      {
        q: "How can I cancel my booking?",
        a: "You can cancel your booking through the app or website up to 5 minutes before the scheduled pickup time without any cancellation fee."
      }
    ],
    pricing: [
      {
        q: "How is the fare calculated?",
        a: "Fares are calculated based on distance, time of day, and vehicle type. You can get an estimate before booking your ride."
      },
      {
        q: "Are there any additional charges?",
        a: "Additional charges may apply for waiting time, toll fees, or special services. All charges will be clearly shown before confirmation."
      }
    ],
    safety: [
      {
        q: "What safety measures are in place?",
        a: "All our drivers undergo background checks, vehicles are regularly inspected, and we have 24/7 emergency support. We also follow strict COVID-19 safety protocols."
      },
      {
        q: "How can I report an issue?",
        a: "You can report any issues through our app, website, or by calling our customer service. We take all reports seriously and investigate thoroughly."
      }
    ]
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
      {/* Spacer for fixed header */}
      <div className="h-28"></div>

      {/* Help Center Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-950 mb-4">How Can We Help You?</h1>
          <p className="text-xl text-gray-600">Find answers to common questions or contact our support team</p>
        </div>

        {/* Quick Help Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <button 
            onClick={() => setActiveTab('general')}
            className={`p-6 rounded-lg shadow-md text-left transition ${
              activeTab === 'general' ? 'bg-blue-950 text-white' : 'bg-white hover:bg-gray-50'
            }`}
          >
            <h3 className="text-lg font-semibold mb-2">General Questions</h3>
            <p className={activeTab === 'general' ? 'text-yellow-100' : 'text-gray-600'}>
              Basic information about bookings and services
            </p>
          </button>

          <button 
            onClick={() => setActiveTab('pricing')}
            className={`p-6 rounded-lg shadow-md text-left transition ${
              activeTab === 'pricing' ? 'bg-blue-950 text-white' : 'bg-white hover:bg-gray-50'
            }`}
          >
            <h3 className="text-lg font-semibold mb-2">Pricing & Payments</h3>
            <p className={activeTab === 'pricing' ? 'text-yellow-100' : 'text-gray-600'}>
              Information about fares and payment methods
            </p>
          </button>

          <button 
            onClick={() => setActiveTab('safety')}
            className={`p-6 rounded-lg shadow-md text-left transition ${
              activeTab === 'safety' ? 'bg-blue-950 text-white' : 'bg-white hover:bg-gray-50'
            }`}
          >
            <h3 className="text-lg font-semibold mb-2">Safety & Security</h3>
            <p className={activeTab === 'safety' ? 'text-yellow-100' : 'text-gray-600'}>
              Learn about our safety measures
            </p>
          </button>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs[activeTab].map((faq, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center"
                >
                  <span className="font-semibold">{faq.q}</span>
                  <svg
                    className={`w-5 h-5 transform transition-transform ${
                      expandedFaq === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedFaq === index && (
                  <div className="px-6 py-4 border-t">
                    <p className="text-gray-600">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

       
      </div>
    </div>
  );
};

export default HelpPage;