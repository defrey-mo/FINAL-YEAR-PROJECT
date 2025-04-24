import React, { useEffect } from 'react';
import "../CSS/setting.css";
import { Link } from 'react-router-dom';

export default function StaffSetting({ setActivePage }) {
  useEffect(() => {
    setActivePage("staff-setting");
  }, [setActivePage]);

  return (
    <div className="setting-container">
      <div className="setting-page">
        <div className="setting-card"> 
            <Link to="/system/staff-reg">Add Staff</Link>
        </div>
        <div className="setting-card">
        <Link to="/system/staff-view">Overview</Link>
        </div>
        <div className="setting-card">
        <Link to="/system/delete">Delete</Link>
        </div>
      </div>
    </div>
  );
}
