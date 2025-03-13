import React from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-amber-50">
      <Sidebar/>
      <div className="flex-1 flex-col flex">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;