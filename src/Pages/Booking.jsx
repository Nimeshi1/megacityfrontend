import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  LoadScript,
  Autocomplete,
  GoogleMap,
  Marker,
  Polyline,
} from "@react-google-maps/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CarIcon, CalendarIcon, MapPinIcon, CheckIcon } from "lucide-react";
import toast from "react-hot-toast";

const GOOGLE_MAPS_API_KEY = "AIzaSyCepX7Q1pxRlBbIKrpS-3LwcPxflCiE1Zs"; // Replace with your actual API key
const libraries = ["places"];

const COLOMBO_BOUNDS = {
  north: 6.98,
  south: 6.85,
  east: 79.92,
  west: 79.82,
};

// Utility function to format currency values to 2 decimal places
const formatCurrency = (value) => {
  if (typeof value !== "number") return "0.00";
  return value.toFixed(2);
};

const getDistance = (coords1, coords2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (coords2[0] - coords1[0]) * (Math.PI / 180);
  const dLon = (coords2[1] - coords1[1]) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(coords1[0] * (Math.PI / 180)) *
      Math.cos(coords2[0] * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

const getSriLankanTime = () => {
  const now = new Date();
  const offset = 5.5 * 60; // Sri Lanka is UTC+5:30
  return new Date(now.getTime() + offset * 60 * 1000);
};

const getSriLankanTimeFormatted = () => {
  const sriLankanTime = getSriLankanTime();
  const hours = sriLankanTime.getUTCHours().toString().padStart(2, "0");
  const minutes = sriLankanTime.getUTCMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

// Polyline decoder function
const decodePolyline = (encoded) => {
  if (!encoded) return [];
  
  const poly = [];
  let index = 0, lat = 0, lng = 0;

  while (index < encoded.length) {
    let b, shift = 0, result = 0;
    
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    
    const dlat = ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));
    lat += dlat;
    
    shift = 0;
    result = 0;
    
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    
    const dlng = ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));
    lng += dlng;
    
    const point = {
      lat: lat / 1e5,
      lng: lng / 1e5
    };
    
    poly.push(point);
  }
  
  return poly;
};

const Booking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const preselectedCar = location.state?.selectedCar || null;
  const preservedBookingData = location.state?.bookingData || null;

  console.log("Preselected Car:", preselectedCar);

  const [bookingData, setBookingData] = useState({
    customerId: localStorage.getItem("userId") || "",
    carId: preselectedCar?.id || "",
    pickupDate: preservedBookingData?.pickupDate || getSriLankanTime(),
    pickupTime: preservedBookingData?.pickupTime || {
      hours: getSriLankanTimeFormatted().split(":")[0],
      minutes: getSriLankanTimeFormatted().split(":")[1],
    },
    pickupLocation:
      preservedBookingData?.pickupLocation || "Colombo City Center",
    destination: preservedBookingData?.destination || "Bandaranaike Airport",
    driverRequired: preservedBookingData?.driverRequired || false,
    pickupCoords: [6.9271, 79.8612], // Default Colombo City Center
    dropCoords: [7.1806, 79.8846], // Default Bandaranaike Airport
    driverAssignmentMessage: "",
  });

  const [userSelectedDriverRequired, setUserSelectedDriverRequired] = useState(
    preservedBookingData?.driverRequired || false
  );

  const [availableCars, setAvailableCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(preselectedCar);
  const [step, setStep] = useState(preselectedCar ? 2 : 1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fare, setFare] = useState({
    baseFare: preselectedCar?.baseRate || 100,
    distanceFare: 0,
    tax: 2.5,
    driverFee: preservedBookingData?.driverRequired ? 50 : 0,
    total: 0,
    distance: 0,
  });
  const [routePath, setRoutePath] = useState([]);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [pickupAutocomplete, setPickupAutocomplete] = useState(null);
  const [dropoffAutocomplete, setDropoffAutocomplete] = useState(null);
  const mapRef = useRef(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu

  useEffect(() => {
    const fetchAvailableCars = async () => {
      try {
        const response = await fetch("http://localhost:8080/all/viewCars");
        const data = await response.json();
        console.log("Fetched Cars Data:", data);
        const availableCars = data
          .filter((car) => car.available === true)
          .map((car) => {
            const carType = car.baseRate > 300 ? "Luxury" : "Economy";
            return {
              id: car.carId,
              brand: car.carBrand,
              model: car.carModel,
              type: carType,
              seats: car.capacity,
              image:
                car.carImgUrl ||
                "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=2128&auto=format&fit=crop",
              hourlyRate: carType === "Luxury" ? 25 : 15,
              baseRate: car.baseRate || 100,
            };
          });
        setAvailableCars(availableCars);

        if (preselectedCar) {
          const fullCarDetails = availableCars.find(
            (car) => car.id === preselectedCar.id
          );
          if (fullCarDetails) {
            console.log(
              "Full Car Details for Preselected Car:",
              fullCarDetails
            );
            setSelectedCar(fullCarDetails);
            setFare((prev) => ({
              ...prev,
              baseFare: fullCarDetails.baseRate || 100,
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching cars:", error);
        setError("Unable to load available vehicles. Please try again later.");
      }
    };
    fetchAvailableCars();
  }, [preselectedCar]);

  useEffect(() => {
    console.log("Selected Car in useEffect:", selectedCar);
    if (
      bookingData.pickupCoords &&
      bookingData.dropCoords &&
      selectedCar &&
      isMapLoaded
    ) {
      fetchRouteWithRoutesAPI();
    }
  }, [
    bookingData.pickupCoords,
    bookingData.dropCoords,
    bookingData.driverRequired,
    selectedCar,
    isMapLoaded,
  ]);

  const fetchRouteWithRoutesAPI = async () => {
    if (!window.google?.maps) return;

    try {
      const origin = { lat: bookingData.pickupCoords[0], lng: bookingData.pickupCoords[1] };
      const destination = { lat: bookingData.dropCoords[0], lng: bookingData.dropCoords[1] };

      const url = `https://routes.googleapis.com/directions/v2:computeRoutes`;
      
      const requestBody = {
        origin: {
          location: {
            latLng: {
              latitude: origin.lat,
              longitude: origin.lng
            }
          }
        },
        destination: {
          location: {
            latLng: {
              latitude: destination.lat,
              longitude: destination.lng
            }
          }
        },
        travelMode: "DRIVE",
        routingPreference: "TRAFFIC_AWARE",
        computeAlternativeRoutes: false,
        routeModifiers: {
          avoidTolls: false,
          avoidHighways: false,
          avoidFerries: false
        },
        languageCode: "en-US",
        units: "METRIC"
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
          'X-Goog-FieldMask': 'routes.polyline,routes.duration,routes.distanceMeters'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Routes API failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.routes && data.routes.length > 0) {
        const encodedPolyline = data.routes[0].polyline.encodedPolyline;
        const pathPoints = decodePolyline(encodedPolyline);
        const routeDistanceKm = data.routes[0].distanceMeters / 1000; // Convert meters to kilometers

        setRoutePath(pathPoints);

        // Update fare based on actual route distance
        setFare((prev) => {
          const baseFare = selectedCar?.baseRate || 100;
          const driverFee = bookingData.driverRequired ? 50 : 0;
          const distanceFare = routeDistanceKm * 70; // 70 LKR per km
          const total = baseFare + distanceFare + prev.tax + driverFee;

          return {
            ...prev,
            baseFare,
            distance: Number(routeDistanceKm.toFixed(2)),
            distanceFare: Number(distanceFare.toFixed(2)),
            driverFee,
            total: Number(total.toFixed(2)),
          };
        });
      } else {
        throw new Error('No routes returned from the API');
      }
    } catch (error) {
      console.error('Error fetching route:', error);
      setError('Failed to load route. Using direct path instead.');
      
      const startPoint = { lat: bookingData.pickupCoords[0], lng: bookingData.pickupCoords[1] };
      const endPoint = { lat: bookingData.dropCoords[0], lng: bookingData.dropCoords[1] };
      setRoutePath([startPoint, endPoint]);

      // Fallback to haversine distance
      const distance = getDistance(bookingData.pickupCoords, bookingData.dropCoords);
      setFare((prev) => {
        const baseFare = selectedCar?.baseRate || 100;
        const driverFee = bookingData.driverRequired ? 50 : 0;
        const distanceFare = distance * 70;
        const total = baseFare + distanceFare + prev.tax + driverFee;

        return {
          ...prev,
          baseFare,
          distance: Number(distance.toFixed(2)),
          distanceFare: Number(distanceFare.toFixed(2)),
          driverFee,
          total: Number(total.toFixed(2)),
        };
      });
    }
  };

  const onPlaceChanged = (type) => {
    const autocomplete =
      type === "pickup" ? pickupAutocomplete : dropoffAutocomplete;
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        const coords = [
          place.geometry.location.lat(),
          place.geometry.location.lng(),
        ];
        if (type === "pickup") {
          setBookingData((prev) => ({
            ...prev,
            pickupLocation: place.formatted_address || place.name,
            pickupCoords: coords,
          }));
        } else {
          setBookingData((prev) => ({
            ...prev,
            destination: place.formatted_address || place.name,
            dropCoords: coords,
          }));
        }
      } else {
        setError("Please select a valid location from the suggestions.");
      }
    }
  };

  const handleCarSelect = (car) => {
    console.log("Car Selected:", car);
    setSelectedCar(car);
    setBookingData((prev) => ({
      ...prev,
      carId: car.id,
    }));
    setFare((prev) => ({
      ...prev,
      baseFare: car.baseRate || 100,
    }));
    setStep(2);
  };

  const checkAuthenticationAndProceed = () => {
    const token = localStorage.getItem("jwtToken");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      navigate("/login", {
        state: {
          from: "booking",
          bookingData: bookingData,
          selectedCar: selectedCar,
          fare: fare,
        },
      });
      toast.error("Please log in to continue with your booking.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (
      !bookingData.pickupDate ||
      !bookingData.pickupTime.hours ||
      !bookingData.pickupTime.minutes
    ) {
      setError("Please select both a pickup date and time.");
      return;
    }

    if (!checkAuthenticationAndProceed()) {
      return;
    }

    setLoading(true);
    setError("");

    const pickupDateTime = new Date(bookingData.pickupDate);
    pickupDateTime.setUTCHours(
      parseInt(bookingData.pickupTime.hours),
      parseInt(bookingData.pickupTime.minutes)
    );

    const bookingPayload = {
      customerId: bookingData.customerId,
      carId: bookingData.carId,
      pickupDate: pickupDateTime.toISOString().slice(0, 10),
      pickupTime: `${bookingData.pickupTime.hours}:${bookingData.pickupTime.minutes}`,
      pickupLocation: bookingData.pickupLocation,
      destination: bookingData.destination,
      totalAmount: fare.total,
      driverRequired: bookingData.driverRequired,
      distance: fare.distance || 0,
      distanceFare: fare.distanceFare || 0,
      tax: fare.tax || 2.5,
      driverFee: fare.driverFee || 0,
      status: "PENDING",
    };

    console.log("Booking Payload:", bookingPayload);

    try {
      const token = localStorage.getItem("jwtToken");
      const response = await fetch(
        "http://localhost:8080/auth/bookings/createbooking",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(bookingPayload),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.log("Backend Error Response:", errorText);
        if (response.status === 401) {
          throw new Error("Authentication failed. Please log in again.");
        } else {
          throw new Error(errorText || "Booking failed. Please try again.");
        }
      }

      const responseData = await response.json();
      console.log("Booking Success Response:", responseData);

      setFare((prev) => ({
        ...prev,
        distance: responseData.distance || prev.distance,
        distanceFare: Number(
          (responseData.distanceFare || prev.distanceFare).toFixed(2)
        ),
        tax: Number((responseData.tax || 2.5).toFixed(2)),
        driverFee: Number(
          (responseData.driverFee || prev.driverFee).toFixed(2)
        ),
        total: Number((responseData.totalAmount || prev.total).toFixed(2)),
      }));

      setBookingData((prev) => ({
        ...prev,
        driverAssignmentMessage: responseData.driverAssignmentMessage,
      }));

      setIsConfirmed(true);
      setStep(3);
      toast.success(
        "Booking Successful! Your ride has been confirmed." +
          (responseData.driverAssignmentMessage
            ? "\n" + responseData.driverAssignmentMessage
            : "")
      );
    } catch (error) {
      setError(`Booking failed: ${error.message}`);
      console.error("Booking error:", error);
      if (error.message.includes("Authentication failed")) {
        navigate("/login", {
          state: {
            from: "booking",
            bookingData: bookingData,
            selectedCar: selectedCar,
            fare: fare,
          },
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChangeVehicle = () => {
    navigate("/ourfleet", {
      state: {
        bookingData: bookingData,
        fromBooking: true,
      },
    });
  };

  const renderVehicleSelection = () => (
    <div className="mb-12">
      <h3 className="text-2xl font-bold text-blue-950 mb-6">
        Select Your Vehicle
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {availableCars.length > 0 ? (
          availableCars.map((car) => (
            <div
              key={car.id}
              className={`bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all ${
                selectedCar?.id === car.id
                  ? "ring-4 ring-yellow-500 transform scale-105"
                  : "hover:shadow-xl border border-gray-100"
              }`}
              onClick={() => handleCarSelect(car)}
            >
              <div className="relative">
                <img
                  src={car.image}
                  alt={`${car.brand} ${car.model}`}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className="px-4 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    LKR {car.hourlyRate}/hr
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h4 className="font-bold text-xl mb-2 text-blue-950">
                  {car.brand} {car.model}
                </h4>
                <div className="text-gray-600 mb-6 space-y-1">
                  <p className="flex items-center">
                    <span className="w-24 font-medium">Type:</span>
                    <span>{car.type}</span>
                  </p>
                  <p className="flex items-center">
                    <span className="w-24 font-medium">Seats:</span>
                    <span>{car.seats}</span>
                  </p>
                  <p className="flex items-center">
                    <span className="w-24 font-medium">Base Rate:</span>
                    <span>LKR {formatCurrency(car.baseRate)}</span>
                  </p>
                </div>
                <button
                  className={`w-full py-3 rounded-lg transition ${
                    selectedCar?.id === car.id
                      ? "bg-yellow-500 text-blue-950 font-bold"
                      : "bg-blue-950 text-white"
                  }`}
                >
                  {selectedCar?.id === car.id ? "Selected" : "Select"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-12">
            <CarIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">Loading available vehicles...</p>
          </div>
        )}
      </div>
      {error && (
        <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );

  const renderBookingDetails = () => (
    <div className="mb-12">
      <h3 className="text-2xl font-bold text-blue-950 mb-6">
        Complete Your Booking
      </h3>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
            <h4 className="font-bold text-lg mb-4 text-blue-950">
              Trip Details
            </h4>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup Location
                </label>
                <Autocomplete
                  onLoad={(autocomplete) => setPickupAutocomplete(autocomplete)}
                  onPlaceChanged={() => onPlaceChanged("pickup")}
                  options={{
                    bounds: COLOMBO_BOUNDS,
                    strictBounds: false,
                    types: ["geocode"],
                    componentRestrictions: { country: "lk" },
                  }}
                >
                  <input
                    type="text"
                    value={bookingData.pickupLocation}
                    onChange={(e) =>
                      setBookingData((prev) => ({
                        ...prev,
                        pickupLocation: e.target.value,
                      }))
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950"
                    placeholder="Enter pickup location"
                  />
                </Autocomplete>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Drop-off Location
                </label>
                <Autocomplete
                  onLoad={(autocomplete) =>
                    setDropoffAutocomplete(autocomplete)
                  }
                  onPlaceChanged={() => onPlaceChanged("dropoff")}
                  options={{
                    bounds: COLOMBO_BOUNDS,
                    strictBounds: false,
                    types: ["geocode"],
                    componentRestrictions: { country: "lk" },
                  }}
                >
                  <input
                    type="text"
                    value={bookingData.destination}
                    onChange={(e) =>
                      setBookingData((prev) => ({
                        ...prev,
                        destination: e.target.value,
                      }))
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950"
                    placeholder="Enter drop-off location"
                  />
                </Autocomplete>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pickup Date (Sri Lanka Time)
                  </label>
                  <DatePicker
                    selected={bookingData.pickupDate}
                    onChange={(date) =>
                      setBookingData((prev) => ({ ...prev, pickupDate: date }))
                    }
                    dateFormat="yyyy-MM-dd"
                    minDate={getSriLankanTime()}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pickup Time (Sri Lanka Time)
                  </label>
                  <div className="flex space-x-2">
                    <select
                      value={bookingData.pickupTime.hours}
                      onChange={(e) =>
                        setBookingData((prev) => ({
                          ...prev,
                          pickupTime: {
                            ...prev.pickupTime,
                            hours: e.target.value,
                          },
                        }))
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950"
                    >
                      {Array.from({ length: 24 }, (_, i) =>
                        i.toString().padStart(2, "0")
                      ).map((hour) => (
                        <option key={hour} value={hour}>
                          {hour}
                        </option>
                      ))}
                    </select>
                    <select
                      value={bookingData.pickupTime.minutes}
                      onChange={(e) =>
                        setBookingData((prev) => ({
                          ...prev,
                          pickupTime: {
                            ...prev.pickupTime,
                            minutes: e.target.value,
                          },
                        }))
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950"
                    >
                      {Array.from({ length: 60 }, (_, i) =>
                        i.toString().padStart(2, "0")
                      ).map((minute) => (
                        <option key={minute} value={minute}>
                          {minute}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="driverRequired"
                  checked={bookingData.driverRequired}
                  onChange={(e) => {
                    setBookingData((prev) => ({
                      ...prev,
                      driverRequired: e.target.checked,
                    }));
                    setUserSelectedDriverRequired(e.target.checked);
                  }}
                  className="h-5 w-5 text-blue-950 focus:ring-blue-950 border-gray-300 rounded"
                />
                <label
                  htmlFor="driverRequired"
                  className="ml-2 text-sm text-gray-700"
                >
                  I need a driver (additional LKR 50 fee)
                </label>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h4 className="font-bold text-lg mb-4 text-blue-950">
              Route Preview
            </h4>
            <GoogleMap
              mapContainerClassName="h-72 w-full rounded-lg shadow-md"
              center={{
                lat: bookingData.pickupCoords[0],
                lng: bookingData.pickupCoords[1],
              }}
              zoom={10}
              onLoad={(map) => {
                mapRef.current = map;
                setIsMapLoaded(true);
              }}
            >
              {bookingData.pickupCoords && (
                <Marker
                  position={{ lat: bookingData.pickupCoords[0], lng: bookingData.pickupCoords[1] }}
                  label="A"
                />
              )}
              {bookingData.dropCoords && (
                <Marker
                  position={{ lat: bookingData.dropCoords[0], lng: bookingData.dropCoords[1] }}
                  label="B"
                />
              )}
              {routePath.length > 0 && (
                <Polyline
                  path={routePath}
                  options={{
                    strokeColor: "#4285F4",
                    strokeOpacity: 0.8,
                    strokeWeight: 5,
                    geodesic: true,
                  }}
                />
              )}
            </GoogleMap>
          </div>
        </div>
        <div>
          <div className="bg-white p-6 rounded-xl shadow-lg sticky top-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-lg text-blue-950">
                Booking Summary
              </h4>
              <button
                onClick={handleChangeVehicle}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Change Vehicle
              </button>
            </div>
            <div className="mb-4">
              <div className="flex items-center mb-3">
                <div className="bg-blue-100 p-2 rounded">
                  <CarIcon className="h-5 w-5 text-blue-950" />
                </div>
                <span className="ml-2 font-medium text-gray-800">
                  {selectedCar?.brand} {selectedCar?.model}
                </span>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Car Type:</span>
                    <span className="font-medium">{selectedCar?.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Seats:</span>
                    <span className="font-medium">{selectedCar?.seats}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Distance:</span>
                    <span className="font-medium">
                      {formatCurrency(fare.distance)} km
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-4 mt-6">
              <h5 className="font-medium text-gray-700 mb-3">Fare Breakdown</h5>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span>Base Fare</span>
                  <span>LKR {formatCurrency(fare.baseFare)}</span>
                </div>
                <div className="flex justify-between">
                  <span>
                    Distance Fare ({formatCurrency(fare.distance)} km)
                  </span>
                  <span>LKR {formatCurrency(fare.distanceFare)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>LKR {formatCurrency(fare.tax)}</span>
                </div>
                {fare.driverFee > 0 && (
                  <div className="flex justify-between">
                    <span>Driver Fee</span>
                    <span>LKR {formatCurrency(fare.driverFee)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span className="text-blue-950">
                    LKR {formatCurrency(fare.total)}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full px-4 py-3 bg-yellow-500 text-blue-950 font-bold rounded-lg transition shadow-lg ${
                  loading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-yellow-400"
                }`}
              >
                {loading ? "Processing..." : "Confirm Booking"}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center">
              By confirming, you agree to our terms of service and cancellation
              policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderConfirmation = () => (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
        <CheckIcon className="h-12 w-12 text-green-600" />
      </div>
      <h3 className="text-3xl font-bold text-blue-950 mb-4">
        Booking Confirmed!
      </h3>
      <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
        Your booking has been successfully processed. A confirmation has been
        sent to your email.
      </p>
      {bookingData.driverAssignmentMessage && (
        <div className="mb-4 p-3 bg-yellow-100 text-yellow-700 rounded-lg">
          {bookingData.driverAssignmentMessage}
        </div>
      )}
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-lg mx-auto mb-8">
        <h4 className="font-bold text-lg mb-4 text-blue-950">
          Booking Details
        </h4>
        <div className="grid grid-cols-2 gap-4 text-left">
          <div>
            <p className="text-sm text-gray-500">Vehicle</p>
            <p className="font-medium">
              {selectedCar?.brand} {selectedCar?.model}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date & Time</p>
            <p className="font-medium">
              {bookingData.pickupDate.toLocaleDateString("en-US", {
                timeZone: "Asia/Colombo",
              })}{" "}
              {bookingData.pickupTime.hours}:{bookingData.pickupTime.minutes}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Pickup</p>
            <p className="font-medium">{bookingData.pickupLocation}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Drop-off</p>
            <p className="font-medium">{bookingData.destination}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Driver</p>
            <p className="font-medium">
              {userSelectedDriverRequired ? "Yes" : "No"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Distance</p>
            <p className="font-medium">{formatCurrency(fare.distance)} km</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-gray-500">Fare Breakdown</p>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>Base Fare</span>
                <span>LKR {formatCurrency(fare.baseFare)}</span>
              </div>
              <div className="flex justify-between">
                <span>Distance Fare ({formatCurrency(fare.distance)} km)</span>
                <span>LKR {formatCurrency(fare.distanceFare)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>LKR {formatCurrency(fare.tax)}</span>
              </div>
              {fare.driverFee > 0 && (
                <div className="flex justify-between">
                  <span>Driver Fee</span>
                  <span>LKR {formatCurrency(fare.driverFee)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold pt-1 border-t">
                <span>Total Amount</span>
                <span>LKR {formatCurrency(fare.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        <button
          className="px-6 py-3 bg-blue-950 text-white font-medium rounded-lg hover:bg-blue-900 transition shadow-lg"
          onClick={() => navigate("/customerProfile")}
        >
          View My Bookings
        </button>
        <button
          className="px-6 py-3 bg-yellow-500 text-blue-950 font-medium rounded-lg hover:bg-yellow-400 transition shadow-lg"
          onClick={() => navigate("/")}
        >
          Return to Home
        </button>
      </div>
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 1:
        return renderVehicleSelection();
      case 2:
        return renderBookingDetails();
      case 3:
        return renderConfirmation();
      default:
        return renderVehicleSelection();
    }
  };

  return (
    <LoadScript
      googleMapsApiKey={GOOGLE_MAPS_API_KEY}
      libraries={libraries}
      loadingElement={
        <div className="text-center py-10">Loading Google Maps...</div>
      }
      onLoad={() => setIsMapLoaded(true)}
      onError={() =>
        setError(
          "Failed to load Google Maps. Please check your network or disable ad blockers."
        )
      }
    >
      <div className="bg-gray-50 min-h-screen w-full">
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

        <div className="bg-blue-950 relative overflow-hidden">
          <div className="absolute bottom-0 left-0 right-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 120"
              className="w-full"
            >
              <path
                fill="#F9FAFB"
                fillOpacity="1"
                d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,42.7C1120,32,1280,32,1360,32L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
              ></path>
            </svg>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 bg-gray-200">
                <div
                  className="h-full bg-blue-950 transition-all"
                  style={{ width: `${(step - 1) * 50}%` }}
                ></div>
              </div>
              <div className="relative z-10 flex justify-between">
                <div
                  className={`flex flex-col items-center ${
                    step >= 1 ? "text-blue-950" : "text-gray-400"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors ${
                      step >= 1 ? "bg-blue-950 text-white" : "bg-gray-200"
                    }`}
                  >
                    1
                  </div>
                  <span className="text-sm font-medium">Select Vehicle</span>
                </div>
                <div
                  className={`flex flex-col items-center ${
                    step >= 2 ? "text-blue-950" : "text-gray-400"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors ${
                      step >= 2 ? "bg-blue-950 text-white" : "bg-gray-200"
                    }`}
                  >
                    2
                  </div>
                  <span className="text-sm font-medium">Booking Details</span>
                </div>
                <div
                  className={`flex flex-col items-center ${
                    step >= 3 ? "text-blue-950" : "text-gray-400"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors ${
                      step >= 3 ? "bg-blue-950 text-white" : "bg-gray-200"
                    }`}
                  >
                    3
                  </div>
                  <span className="text-sm font-medium">Confirmation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8 pb-20">
          <div className="max-w-5xl mx-auto">{renderStep()}</div>
        </div>
      </div>
    </LoadScript>
  );
};

export default Booking;