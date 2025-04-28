/* eslint-disable no-unused-vars */
import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPowerOff } from '@fortawesome/free-solid-svg-icons';


export default function Navbar() {


  return (
    <>
      <div className="header">
        <div className="menu-icon">
          <span className="material-icons-outlined">menu</span>
        </div>
     
        <div className="header-right">
          <span>ADMINISTRATOR</span>
          
        </div>
        <button>
          <FontAwesomeIcon icon={faPowerOff} style={{  }} />
        </button>
      </div>
    </>
  );
}
