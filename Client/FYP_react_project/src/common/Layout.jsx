/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet, useNavigate } from "react-router-dom";

export default function Layout({activePage}) {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);
  return (
    <>
      <div className="main-container">
        <Sidebar activePage={activePage} />
        <div className="content">
          <Navbar />
          <main className="main-content" style={{overflow:'auto'}}>
            
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}
