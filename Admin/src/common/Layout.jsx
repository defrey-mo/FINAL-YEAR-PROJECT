import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

export default function Layout({activePage}) {

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
