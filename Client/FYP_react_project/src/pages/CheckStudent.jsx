/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../CSS/check.css";

export default function CheckStudent({ setActivePage }) {
  const [student_id, setstudent_id] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  setActivePage("check-student");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!student_id.trim()) {
      setError("Please enter a student number.");
      return;
    }

    setError(""); // Reset error message

    try {
      // Send the student number to the backend to fetch the report
      const response = await axios.post("http://localhost:8084/report", { student_id });

      // If the student exists, navigate to the report page
      if (response.data) {
        navigate("/system/student-report", { state: { student_id } });
      } else {
        setError("Student number not found in the database.");
      }
    } catch (err) {
      setError("Student id does not exist");
    }
  };

  return (
    <div className="checking">
      <h1 className="checkin">Check Student</h1>
      <form onSubmit={handleSubmit}>
        <span>
          <label htmlFor="student-number">Student Number</label>
          <input
            type="text"
            id="student-number"
            value={student_id}
            onChange={(e) => setstudent_id(e.target.value)}
            autoComplete="off"
          />
        </span>
        <button type="submit">Submit</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
