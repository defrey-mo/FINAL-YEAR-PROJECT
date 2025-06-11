import React from "react";
import "../CSS/ErrorBox.css";
import { FaTimesCircle } from "react-icons/fa";

const ErrorBox = ({ message, onClose}) => {


  return (
    <div className="error-box">
      <div className="error-content">
        <FaTimesCircle className="error-icon" />
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ErrorBox;
