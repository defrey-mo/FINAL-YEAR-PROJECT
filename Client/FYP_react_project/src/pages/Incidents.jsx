import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function Incidents() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found! User not authenticated.");
      setError("No authentication token found.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    axios
      .get("http://localhost:8084/conduct-details", { // Ensure this matches your backend port
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setData(res.data.data); // Access the 'data' property from the backend response
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching students:", err);
        setError(err.message || "Failed to fetch student data.");
        setLoading(false);
        if (err.response && err.response.status === 401) {
          alert("You are not authorized to view this data. Please log in.");
          // Optionally redirect to the login page (e.g., using react-router-dom)
        } else if (err.response && err.response.status === 500) {
          alert("An unexpected server error occurred. Please try again later.");
          // You might want to log more details for debugging
        }
      });
  }, []);

  if (loading) {
    return <p>Loading student data...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <p className="incidents">Student's List with Reported Incidents</p>
      <table id="table">
        <thead>
          <tr>
            {/* Student Info */}
            <th>Student ID</th>
            <th>First Name</th>
            <th>Last name</th>
            <th>Registration Status</th>
            <th>Fee Payment Status</th>
            <th>Conduct Type</th>
            <th>Nature Of Incident</th>
            <th>Action Taken</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, index) => (
              <tr key={index}>
                <td>{row.student_id}</td>
                <td>{row.firstname}</td>
                <td>{row.middlename}</td>
                <td>{row.registration_status || "N/A"}</td>
                <td>{row.fee_payment_status || "N/A"}</td>
                <td>{row.type_of_conduct || "N/A"}</td>
                <td>{row.nature_of_incident || "N/A"}</td>
                <td>{row.action_taken || "N/A"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No records found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
