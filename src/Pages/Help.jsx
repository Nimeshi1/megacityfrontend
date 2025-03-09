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
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-blue-900 py-2">
        <div className="container mx-auto px-6">
          <div className="flex justify-end space-x-4 text-sm text-white">
            <a href="tel:1-800-CABRIDE" className="hover:text-gray-200">📞 1-800-CABRIDE</a>
            <span>|</span>
            <a href="mailto:support@cabservice.com" className="hover:text-gray-200">✉️ support@cabservice.com</a>
          </div>
        </div>
      </div>

      {/* Fixed Navigation */}
      <nav className="fixed top-8 left-0 right-0 z-50 bg-blue-100 shadow-lg sticky">
        <div className="container mx-auto px-6">
          <div className="flex h-20 items-center">
            {/* Logo */}
            <div className="w-1/4">
              <div className="text-2xl font-bold text-yellow-500">
                <span className="flex items-center">
                  🚕 CabService
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex flex-1 items-center justify-center space-x-12">
              <a href="/" className="text-gray-700 hover:text-yellow-500">Home</a>
              <a href="/vehicles" className="text-gray-700 hover:text-yellow-500">Our Vehicles</a>
              <a href="/booking" className="text-gray-700 hover:text-yellow-500">Book a Ride</a>
              <a href="/about" className="text-gray-700 hover:text-yellow-500">About Us</a>
              <a href="/drivers" className="text-gray-700 hover:text-yellow-500">Driver</a>
            </div>

            {/* Login Button */}
            <div className="hidden md:flex w-1/4 justify-end">
               <Link to="/login"className="bg-blue-950 text-white px-6 py-2 rounded-full hover:bg-yellow-600">
                Login
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden ml-auto">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700">
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
                <a href="/about" className="text-gray-700 hover:text-yellow-500">About Us</a>
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

        {/* Contact Support */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Still Need Help?</h2>
          <p className="text-gray-600 mb-6">Our support team is available 24/7 to assist you</p>
          <button className="bg-blue-950 text-white px-8 py-3 rounded-full hover:bg-yellow-600 transition">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;