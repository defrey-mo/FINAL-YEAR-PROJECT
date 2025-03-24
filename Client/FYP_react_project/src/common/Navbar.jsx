/* eslint-disable no-unused-vars */
import React from "react";
// import { useSearchParams } from "react-router-dom";

export default function Navbar() {

  return (
    <>
      <div className="header">
        <div className="menu-icon">
          <span className="material-icons-outlined">menu</span>
        </div>
        
        <div className="header-right">
          <span><p>John Doe High School</p></span>
          {/* <span className="material-icons-outlined">account_circle</span> */}
          
        </div>
      </div>
    </>
  );
}
