/* eslint-disable no-unused-vars */
import React from "react";
import {Link} from "react-router-dom"
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
export default function Sidebar({activePage}) {

  const navigate = useNavigate()

  function logoutFunc(){
    navigate('/login')
  }

  return (
    <>
      <div className="aside">
        <div className="sidebar-title">
          <div className="sidebar-brand">
          <span className="material-icons-outlined">school</span>
            StudentTrack
          </div>
        </div>
        <ul className="sidebar-list">
          <li className={(activePage === "dashboard")?"sidebar-list-item active":"sidebar-list-item"}>
            <Link to="dashboard"><span className="material-icons-outlined">dashboard</span>Dashboard</Link>
          </li>
          <li className={(activePage === "add-staff")?"sidebar-list-item active":"sidebar-list-item"}>
            <Link to="add-staff"><span className="material-icons-outlined">group_add</span>Register Staff</Link>
          </li>
          <li className={(activePage === "add-student")?"sidebar-list-item active":"sidebar-list-item"}>
            <Link to="add-student"><span className="material-icons-outlined">group_add</span>Register School</Link>
          </li>
          {/* <li class={(activePage === "update-student")?"sidebar-list-item active":"sidebar-list-item"}>
            <Link to="update-student"><span class="material-icons-outlined">update</span>Update Student</Link>
          </li> */}
          <li className={(activePage === "overview")?"sidebar-list-item active":"sidebar-list-item"}>
            <Link to="overview"><span className="material-icons-outlined">article</span>Overview</Link>
          </li>

          {/* logout */}
          <li className="sidebar-list-item" onClick={logoutFunc}>
            <span className="material-icons-outlined">logout</span>Logout
          </li>
        </ul>
      </div>
    </>
  );
}
