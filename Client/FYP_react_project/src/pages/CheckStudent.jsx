import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/check.css";

export default function CheckStudent({ setActivePage }) {
  const [student_id, setstudent_id] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  setActivePage("check-student");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!student_id.trim()) {
      setError("Please enter a student number.");
      return;
    }

    setError("");

    // Directly navigate to the student report page, passing the student_id
    navigate("/system/student-report", { state: { student_id } });
  };

  return (
    <div className="checking">
      <div className="checkin"><h1>Check Student</h1></div>
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
