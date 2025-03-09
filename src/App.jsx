import { useState } from 'react'
import { BrowserRouter as Router,Route, Routes } from 'react-router-dom';
import Home1 from './Pages/Home1.jsx';
import About from './Pages/About.jsx';
import Help from './Pages/Help.jsx';
import Login from './Pages/Login.jsx';
import Drivers from './Pages/Drivers.jsx';

import './index.css';


function App() {

  return (
    <Router>
    <div>
      <Routes>
         <Route path="/" element={<Home1 />}/> 
         <Route path="/about" element={<About />}/>
         <Route path="/help" element={<Help />}/>
         <Route path="/login" element={<Login />}/>
         <Route path="/drivers" element={<Drivers />}/>
        
         </Routes>
  </div>
  </Router>

  ); 
}

export default App;
