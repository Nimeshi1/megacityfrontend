import React from 'react';
import { 
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const AdminDashboard = () => {
  // Sample data
  const metrics = {
    totalCustomers: 4823,
    totalDrivers: 267,
    totalBookings: 18945
  };
  
  // Bar chart data - daily trend
  const barData = [
    { day: 'Mar 1', value: 10000 },
    { day: 'Mar 3', value: 30000 },
    { day: 'Mar 5', value: 20000 },
    { day: 'Mar 7', value: 29000 },
    { day: 'Mar 9', value: 33000 },
    { day: 'Mar 11', value: 25000 },
    { day: 'Mar 13', value: 39000 }
  ];

  // Pie chart data - monthly data
  const pieData = [
    { name: 'January', value: 4200 },
    { name: 'February', value: 5300 },
    { name: 'March', value: 6100 },
    { name: 'April', value: 7500 },
    { name: 'May', value: 9800 },
    { name: 'June', value: 14800 }
  ];

  // Colors for the pie chart segments
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316'];

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-500 text-white rounded-lg shadow p-4">
          <div className="flex justify-between">
            <div>
              <p className="text-sm">Total Customers</p>
              <h3 className="text-2xl font-bold">{metrics.totalCustomers}</h3>
            </div>
            <div className="p-2 bg-blue-900 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-pink-500 text-white rounded-lg shadow p-4">
          <div className="flex justify-between">
            <div>
              <p className="text-sm">Total Drivers</p>
              <h3 className="text-2xl font-bold">{metrics.totalDrivers}</h3>
            </div>
            <div className="p-2 bg-yellow-400 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-purple-500 text-white rounded-lg shadow p-4">
          <div className="flex justify-between">
            <div>
              <p className="text-sm">Total Bookings</p>
              <h3 className="text-2xl font-bold">{metrics.totalBookings}</h3>
            </div>
            <div className="p-2 bg-blue-400 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Daily Booking Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Monthly Booking Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;