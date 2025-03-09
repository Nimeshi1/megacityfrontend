import React, { useState } from 'react';

const HeaderNavbarHeroAuth = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(true);

  // Login form state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form state
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [telephone, setTelephone] = useState('');
  const [email, setEmail] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const handleSignupClick = () => {
    setShowLogin(false);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log('Login submitted:', { username: loginUsername, password: loginPassword });
    // Add your authentication logic here
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    console.log('Signup submitted:', {
      name,
      address,
      telephone,
      email,
      username: signupUsername,
      password: signupPassword
    });
    // Add your registration logic here
  };

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
      <nav className="fixed top-8 left-0 right-0 z-40 bg-blue-100 shadow-lg">
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
              <a href="/about" className="text-gray-700 hover:text-yellow-500 transition duration-300">About Us</a>
              <a href="/drivers" className="text-gray-700 hover:text-yellow-500 transition duration-300">Driver</a>
            </div>

            

            {/* Mobile menu button */}
            <div className="md:hidden ml-auto">
              <button
                onClick={toggleMenu}
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
                <a href="/about" className="text-gray-700 hover:text-yellow-500">About Us</a>
                <a href="/drivers" className="text-gray-700 hover:text-yellow-500">Driver</a>
                <button 
                  onClick={handleLoginClick}
                  className="bg-blue-900 text-white px-6 py-2 rounded-full hover:bg-yellow-600 transition duration-300 w-full"
                >
                  Login
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Spacer for fixed header */}
      <div className="h-28"></div>

      {/* Hero Section with Auth Forms */}
      <div className="relative bg-yellow-500 min-h-screen">
        {/* Hero Background */}
        <div className="absolute inset-0 bg-blue-950 bg-opacity-50">
          <div className="container mx-auto px-6 py-16">
            <div className="flex flex-col md:flex-row items-center justify-between">
              {/* Hero Content - Left side */}
              <div className="text-white max-w-xl md:w-1/2 mb-12 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Your Trusted Ride Partner</h1>
                <p className="text-xl">Providing safe and reliable transportation services since 2010. Book your ride today and experience the difference.</p>
              </div>
              
              {/* Auth Forms - Right side */}
              <div className="md:w-5/12">
                <div className="bg-white rounded-lg shadow-lg p-8">
                  {showLogin ? (
                    <>
                      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Login</h2>
                      
                      <form onSubmit={handleLoginSubmit}>
                        <div className="mb-4">
                          <label htmlFor="login-username" className="block text-gray-700 text-sm font-bold mb-2">
                            Username
                          </label>
                          <input
                            id="login-username"
                            type="text"
                            value={loginUsername}
                            onChange={(e) => setLoginUsername(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your username"
                            required
                          />
                        </div>
                        
                        <div className="mb-6">
                          <label htmlFor="login-password" className="block text-gray-700 text-sm font-bold mb-2">
                            Password
                          </label>
                          <input
                            id="login-password"
                            type="password"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                            required
                          />
                        </div>
                        
                        <button
                          type="submit"
                          className="w-full bg-blue-900 text-white py-2 px-4 rounded-full font-medium hover:bg-blue-800 transition-colors"
                        >
                          Sign In
                        </button>
                        
                        <div className="mt-6 text-center">
                          <p className="text-gray-600">Don't have an account?</p>
                          <button 
                            type="button"
                            onClick={handleSignupClick}
                            className="mt-2 w-full bg-yellow-500 text-white py-2 px-4 rounded-full font-medium hover:bg-yellow-600 transition-colors"
                          >
                            Sign Up
                          </button>
                        </div>
                      </form>
                    </>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Sign Up</h2>
                      
                      <form onSubmit={handleSignupSubmit}>
                        <div className="mb-4">
                          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                            Full Name
                          </label>
                          <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your full name"
                            required
                          />
                        </div>
                        
                        <div className="mb-4">
                          <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">
                            Address
                          </label>
                          <input
                            id="address"
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your address"
                            required
                          />
                        </div>
                        
                        <div className="mb-4">
                          <label htmlFor="telephone" className="block text-gray-700 text-sm font-bold mb-2">
                            Telephone Number
                          </label>
                          <input
                            id="telephone"
                            type="tel"
                            value={telephone}
                            onChange={(e) => setTelephone(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your telephone number"
                            required
                          />
                        </div>
                        
                        <div className="mb-4">
                          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                            Email
                          </label>
                          <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email"
                            required
                          />
                        </div>
                        
                        <div className="mb-4">
                          <label htmlFor="signup-username" className="block text-gray-700 text-sm font-bold mb-2">
                            Username
                          </label>
                          <input
                            id="signup-username"
                            type="text"
                            value={signupUsername}
                            onChange={(e) => setSignupUsername(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Choose a username"
                            required
                          />
                        </div>
                        
                        <div className="mb-6">
                          <label htmlFor="signup-password" className="block text-gray-700 text-sm font-bold mb-2">
                            Password
                          </label>
                          <input
                            id="signup-password"
                            type="password"
                            value={signupPassword}
                            onChange={(e) => setSignupPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Choose a password"
                            required
                          />
                        </div>
                        
                        <button
                          type="submit"
                          className="w-full bg-yellow-500 text-white py-2 px-4 rounded-full font-medium hover:bg-yellow-600 transition-colors"
                        >
                          Sign Up
                        </button>
                        
                        <div className="mt-6 text-center">
                          <p className="text-gray-600">Already have an account?</p>
                          <button 
                            type="button"
                            onClick={handleLoginClick}
                            className="mt-2 w-full bg-blue-900 text-white py-2 px-4 rounded-full font-medium hover:bg-blue-800 transition-colors"
                          >
                            Login
                          </button>
                        </div>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderNavbarHeroAuth;