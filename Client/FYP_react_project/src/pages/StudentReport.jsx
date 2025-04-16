import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function StudentReport() {
  const location = useLocation();
  const navigate = useNavigate();
  const [reportData, setReportData] = useState([]);
  const [error, setError] = useState("");

  // Get student number from location state (passed from CheckStudent)
  const student_id = location.state?.student_id;

  useEffect(() => {
    if (!student_id) {
      navigate("/"); // Navigate back to CheckStudent if no student number
      return;
    }

    const fetchReport = async () => {
      try {
        // Make a GET request to fetch report data using student number
        const res = await axios.get(`http://localhost:8084/report/${student_id}`);

        if (res.data.length === 0) {
          setError("Student number not found in the database.");
        } else {
          setReportData(res.data); // Set report data
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Error fetching report.");
      }
    };

    fetchReport();
  }, [student_id, navigate]);

  if (!student_id) return null; // Prevent rendering if no student number

  return (
    <div className="report-page">
      <h1>Student Report</h1>

      {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}

      {reportData.length > 0 && (
        <div className="report">
          <h2>Student Info</h2>
          <p><strong>Full Name:</strong> {reportData[0].firstname}</p>
          <p><strong>Class:</strong> {reportData[0].class}</p>
          <p><strong>Student Number:</strong> {reportData[0].student_id}</p>

          <h3>Status Records</h3>
          <table>
            <thead>
              <tr>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((row, idx) =>
                row.status_description ? (
                  <tr key={`status-${idx}`}>
                    <td>{row.status_description}</td>
                    <td>{row.date}</td>
                  </tr>
                ) : null
              )}
            </tbody>
          </table>

          <h3>Conduct Records</h3>
          <table>
            <thead>
              <tr>
                <th>Conduct</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((row, idx) =>
                row.description ? (
                  <tr key={`conduct-${idx}`}>
                    <td>{row.description}</td>
                    <td>{row.date}</td>
                  </tr>
                ) : null
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
