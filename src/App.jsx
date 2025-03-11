import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home1 from "./Pages/Home1.jsx";
import About from "./Pages/About.jsx";
import Help from "./Pages/Help.jsx";
import Login from "./Pages/Login.jsx";
import Drivers from "./Pages/Drivers.jsx";
import SignUp from "./Pages/SignUp.jsx";
import Ourfleet from "./Pages/Ourfleet.jsx";
import "./index.css";
import { AuthProvider } from "./Util/AuthContext.jsx";

import AdminDash from "./Pages/AdminDashBoard/AdminDash.jsx";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div>
          <Routes>
            <Route path="/" element={<Home1 />} />
            <Route path="/about" element={<About />} />
            <Route path="/help" element={<Help />} />
            <Route path="/login" element={<Login />} />
            <Route path="/SignUp" element={<SignUp />} />
            <Route path="/drivers" element={<Drivers />} />
            <Route path="/ourfleet" element={<Ourfleet />} />
            <Route path="/AdminDash" element={<AdminDash />} />
           </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
