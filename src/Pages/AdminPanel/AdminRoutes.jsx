import React from 'react';
import { Routes,Route } from 'react-router-dom';
import AdminDashBoard from './AdminDashBoard';
import DriverDashboard from './DriverDash';
import CarDashboard from './CarDash';
import BookingDashboard from './BookingDash';
import CustomerDashboard from './CustomerDash';



import AdminLayout from './AdminLayout';

const AdminRoutes = () => {
  return (
    <div >
        <Routes>

         <Route path='/' element={<AdminLayout/>} >
         <Route index element={<AdminDashBoard/>} />
         <Route path='dashboard' element={<AdminDashBoard/>} />
         <Route path='driverDashboard' element={<DriverDashboard/>} />
         <Route path='carDashboard' element={<CarDashboard/>} />
         <Route path='bookingDashboard' element={<BookingDashboard/>}/>
         <Route path='customerDashboard' element={<CustomerDashboard/>}/>
        
         </Route>

        </Routes>

    </div>
  );
}

export default AdminRoutes;