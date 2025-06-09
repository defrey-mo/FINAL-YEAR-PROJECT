import React from "react";
import "../CSS/SuccessBox.css";
import { FaCheckCircle } from "react-icons/fa";

const SuccessBox = ({ message, onClose, onConfirm }) => {
  return (
    <div className="success-box">
      <div className="success-content">
        <FaCheckCircle className="success-icon" />
        <p>{message}</p>
        <button onClick={onConfirm}>Go to Overview</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default SuccessBox;
