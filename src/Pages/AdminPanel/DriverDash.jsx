import React, { useEffect, useState } from "react";
import axios from "axios";

const DriverDashboard = () => {
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await axios.get("http://localhost:8080/auth/driver/getalldrivers");
        setDrivers(response.data);
      } catch (error) {
        console.error("Error fetching drivers:", error);
      }
    };

    fetchDrivers();
  }, []);

  const handleViewDriver = (driver) => {
    setSelectedDriver(driver);
    setIsModalOpen(true);
  };

  const filteredDrivers = drivers.filter((driver) => {
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "active" && driver.available) ||
                         (statusFilter === "inactive" && !driver.available);
    return matchesStatus;
  });

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Driver Management</h1>
        </header>

        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-end">
              <select
                className="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-lime-500 text-gray-700"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Name
                  </th>
                  {/* Removed Phone Number column */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredDrivers.length > 0 ? (
                  filteredDrivers.map((driver) => (
                    <tr key={driver.driverId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-lime-100 flex items-center justify-center text-lime-600 font-semibold">
                            {driver.driverName.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{driver.driverName}</div>
                            <div className="text-sm text-gray-500">{driver.email}</div>
                          </div>
                        </div>
                      </td>
                      {/* Removed Phone Number column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            driver.available
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {driver.available ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          className="text-lime-600 hover:text-lime-800 mr-4"
                          onClick={() => handleViewDriver(driver)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                      No drivers found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal for viewing driver details */}
      {isModalOpen && selectedDriver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Driver Details</h2>
              <button
                className="text-lime-600 hover:text-lime-800"
                onClick={() => setIsModalOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex justify-center mb-6">
              <div className="h-24 w-24 rounded-full bg-lime-100 flex items-center justify-center text-lime-600 text-2xl font-bold">
                {selectedDriver.driverName.charAt(0)}
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-sm text-gray-500">Name</div>
                <div className="col-span-2 text-sm font-medium text-lime-600">{selectedDriver.driverName}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-sm text-gray-500">License</div>
                <div className="col-span-2 text-sm font-medium text-gray-700">{selectedDriver.driverVehicalLicense}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-sm text-gray-500">Phone</div>
                <div className="col-span-2 text-sm font-medium text-gray-700">{selectedDriver.driverPhone}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-sm text-gray-500">Email</div>
                <div className="col-span-2 text-sm font-medium text-gray-700">{selectedDriver.email}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-sm text-gray-500">Role</div>
                <div className="col-span-2 text-sm font-medium text-gray-700">{selectedDriver.role}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-sm text-gray-500">Car ID</div>
                <div className="col-span-2 text-sm font-medium text-gray-700">{selectedDriver.carId || "N/A"}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-sm text-gray-500">Owns Car</div>
                <div className="col-span-2 text-sm font-medium text-gray-700">{selectedDriver.hasOwnCar ? "Yes" : "No"}</div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                className="px-4 py-2 bg-white text-lime-600 border border-lime-500 rounded-lg hover:bg-lime-50"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverDashboard;