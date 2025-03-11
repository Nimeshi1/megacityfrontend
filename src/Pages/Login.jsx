import React, { useState } from 'react';
import { Lock, Mail } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from "../Util/AuthContext";

const HeaderNavbarHeroAuth = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  
  // Login form state
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error when user starts typing
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:8080/auth/login",
        formData
      );
      
      console.log("Login response:", response.data);
      
      const { token, userId, role } = response.data;
      
      localStorage.setItem("jwtToken", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("role", role);

      login(token);

      // Navigate based on role
      switch (role) {
        case "ROLE_ADMIN":
          navigate("/AdminDash");
          break;
        case "ROLE_CUSTOMER":
          navigate("/");
          break;
        case "ROLE_DRIVER":
          navigate("/DriverDash");
          break;
        default:
          setError("Invalid user role");
      }
    } catch (error) {
      console.error("Login error:", error);
      
      if (error.response) {
        switch (error.response.status) {
          case 401:
            setError("Invalid email or password");
            break;
          case 404:
            setError("User not found");
            break;
          case 403:
            setError("Account is locked. Please contact support");
            break;
          default:
            setError("Login failed. Please try again later");
        }
      } else if (error.request) {
        setError("Cannot connect to server. Please check your internet connection");
      } else {
        setError("An unexpected error occurred. Please try again");
      }
    } finally {
      setIsLoading(false);
    }
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
            <div className="w-1/4">
              <div className="text-2xl font-bold text-yellow-500">
                <span className="flex items-center">
                  🚕 CabService
                </span>
              </div>
            </div>

            <div className="hidden md:flex flex-1 items-center justify-center space-x-12">
              <a href="/" className="text-gray-700 hover:text-yellow-500 transition duration-300">Home</a>
              <a href="/vehicles" className="text-gray-700 hover:text-yellow-500 transition duration-300">Our Vehicles</a>
              <a href="/booking" className="text-gray-700 hover:text-yellow-500 transition duration-300">Book a Ride</a>
              <a href="/help" className="text-gray-700 hover:text-yellow-500 transition duration-300">Help</a>
              <a href="/about" className="text-gray-700 hover:text-yellow-500 transition duration-300">About Us</a>
              <a href="/drivers" className="text-gray-700 hover:text-yellow-500 transition duration-300">Driver</a>
            </div>

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

          {isMenuOpen && (
            <div className="md:hidden pb-4">
              <div className="flex flex-col space-y-4">
                <a href="/" className="text-gray-700 hover:text-yellow-500">Home</a>
                <a href="/vehicles" className="text-gray-700 hover:text-yellow-500">Our Vehicles</a>
                <a href="/booking" className="text-gray-700 hover:text-yellow-500">Book a Ride</a>
                <a href="/about" className="text-gray-700 hover:text-yellow-500">About Us</a>
                <a href="/drivers" className="text-gray-700 hover:text-yellow-500">Driver</a>
                <button 
                  onClick={handleLoginSubmit}
                  className="bg-blue-900 text-white px-6 py-2 rounded-full hover:bg-yellow-600 transition duration-300 w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="h-28"></div>

      {/* Hero Section with Login Form */}
      <div className="relative bg-yellow-500 min-h-screen">
        <div className="absolute inset-0 bg-blue-950 bg-opacity-50">
          <div className="container mx-auto px-6 py-16">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="text-white max-w-xl md:w-1/2 mb-12 md:mb-0">
                <p className="text-5xl md:text-5xl font-bold mb-4">Mega City Cab Service</p>
                <h1 className="text-3xl md:text-5xl font-bold mb-4">Your Trusted Ride Partner</h1>
                <p className="text-xl">Providing safe and reliable transportation services since 2010. Book your ride today and experience the difference.</p>
              </div>
              
              <div className="md:w-5/12">
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Sign In</h2>

                  {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                        disabled={isLoading}
                        className="w-full pl-10 pr-4 py-3 border rounded-md focus:border-emerald-500 focus:ring-emerald-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        required
                        disabled={isLoading}
                        className="w-full pl-10 pr-4 py-3 border rounded-md focus:border-emerald-500 focus:ring-emerald-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full bg-yellow-500 text-white py-3 rounded-md font-semibold transition-all
                        ${isLoading 
                          ? 'opacity-70 cursor-not-allowed' 
                          : 'hover:bg-yellow-600'}`}
                    >
                      {isLoading ? "Logging in..." : "Login"}
                    </button>

                    <div className="text-center text-sm text-gray-600 mt-4 space-y-2">
                      <p>
                        Don't have an account?{" "}
                        <Link
                          to="/SignUp"
                          className="text-emerald-500 hover:underline"
                        >
                          Sign Up
                        </Link>
                      </p>
                      
                      
                    </div>
                  </form>
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