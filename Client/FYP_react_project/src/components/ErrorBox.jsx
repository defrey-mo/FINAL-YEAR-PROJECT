import React, { useEffect } from "react";
import "../CSS/ErrorBox.css";
import { FaTimesCircle } from "react-icons/fa";

const ErrorBox = ({ message, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="error-box">
      <div className="error-content">
        <FaTimesCircle className="error-icon" />
        <p>{message}</p>
      </div>
    </div>
  );
};

export default ErrorBox;
