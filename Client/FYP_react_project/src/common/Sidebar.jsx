/* eslint-disable no-unused-vars */
import React from "react";
import {Link} from "react-router-dom"
import { useNavigate } from "react-router-dom";
export default function Sidebar({activePage}) {

  const navigate = useNavigate()



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
          <li className={(activePage === "check-student")?"sidebar-list-item active":"sidebar-list-item"}>
            <Link to="check-student"><span className="material-icons-outlined">tv</span>Check Student</Link>
          </li>
          <li className={(activePage === "add-student")?"sidebar-list-item active":"sidebar-list-item"}>
            <Link to="add-student"><span className="material-icons-outlined">group_add</span>Add Student</Link>
          </li>
          {/* <li class={(activePage === "update-student")?"sidebar-list-item active":"sidebar-list-item"}>
            <Link to="update-student"><span class="material-icons-outlined">update</span>Update Student</Link>
          </li> */}
          <li className={(activePage === "overview")?"sidebar-list-item active":"sidebar-list-item"}>
            <Link to="overview"><span className="material-icons-outlined">article</span>Overview</Link>
          </li>
          
        </ul>
      </div>
    </>
  );
}
