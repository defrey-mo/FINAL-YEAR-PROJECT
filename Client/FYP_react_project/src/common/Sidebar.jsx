/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {Link} from "react-router-dom"
import { useNavigate } from "react-router-dom";
import { decode } from "js-base64";


export default function Sidebar({activePage}) {

  const navigate = useNavigate()
  const [role, setRole] = useState("Teacher");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payloadBase64 = token.split(".")[1];
        const payloadJson = decode(payloadBase64);
        const payload = JSON.parse(payloadJson);
        console.log("Decoded role:", payload.role);
        setRole(payload.role);
      } catch (err) {
        console.error("Invalid token or decoding error:", err);
      }
    }
  }, []);


  return (
    <>
      <div className="aside">
        <div className="sidebar-title">
          <div className="sidebar-brand">
          <span className="material-icons-outlined">school</span>
            SMBS
          </div>
        </div>
        <ul className="sidebar-list">
          
            <li className={(activePage === "dashboard")?"sidebar-list-item active":"sidebar-list-item"}>
            <Link to="dashboard"><span className="material-icons-outlined">dashboard</span>Dashboard</Link>
          </li>

          <li className={(activePage === "check-student")?"sidebar-list-item active":"sidebar-list-item"}>
            <Link to="check-student"><span className="material-icons-outlined">tv</span>Check Student</Link>
          </li>
          <li className={(activePage === "add-student")?"sidebar-list-item active":"sidebar-list-item"}>
            <Link to="add-student"><span className="material-icons-outlined">group_add</span>Add Student</Link>
          </li>
          <li className={(activePage === "overview")?"sidebar-list-item active":"sidebar-list-item"}>
            <Link to="overview"><span className="material-icons-outlined">article</span>Overview</Link>
          </li>
          {role === "Admin" && (
            <li className={(activePage === "staff-setting")?"sidebar-list-item active":"sidebar-list-item"}>
            <Link to="staff-setting"><span className="material-icons-outlined">settings</span>Staff Management</Link>
          </li>
          )}
          
        </ul>
      </div>
    </>
  );
}
