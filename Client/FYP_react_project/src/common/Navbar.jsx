import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPowerOff } from '@fortawesome/free-solid-svg-icons';

export default function Navbar() {
  const [schoolName, setSchoolName] = useState("");

  // On component mount, fetch the school name from the JWT token in localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");  // Get token from localStorage

    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));  // Decode JWT token
      setSchoolName(decodedToken.school_name);  // Set the school name from token
    }
  }, []);

  const navigate = useNavigate()

  function handleLogout(){
    // Removes the token from localStorage
    localStorage.removeItem('token');
    navigate('/login');
}

  return (
    <>
      <div className="header">
        <div className="menu-icon">
          <span className="material-icons-outlined">menu</span>
        </div>

        <div className="header-right">
          <span><p>{schoolName}</p></span>
        </div>
        <button onClick={handleLogout}>
            <FontAwesomeIcon icon={faPowerOff} style={{  }} />
          </button>
      </div>
    </>
  );
}

