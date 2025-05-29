import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function Incidents() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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
      .get("http://localhost:8084/conduct-details", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setData(res.data.data); // Ensure your backend sends { data: [...] }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching students:", err);
        setError(err.message || "Failed to fetch student data.");
        setLoading(false);

        if (err.response?.status === 401) {
          alert("You are not authorized to view this data. Please log in.");
        } else if (err.response?.status === 500) {
          alert("An unexpected server error occurred. Please try again later.");
        }
      });
  }, []);

  const filteredData = data.filter((student) =>
    student.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.surname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.student_id?.toString().includes(searchTerm)
  );

  if (loading) return <p>Loading student data...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <div className="header-row">
        <p className="incidents">Student's List with Reported Incidents</p>
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search..."
            className="search-box"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-icon-button">🔍</button>
        </div>
      </div>

      <table id="table">
        <thead>
          <tr>
            <th>Student ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Perfomance Status</th>
            <th>Fee Payment Status</th>
            <th>Conduct Type</th>
            <th>Nature Of Incident</th>
            <th>Action Taken</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((row, index) => (
              <tr key={index}>
                <td>{row.student_id}</td>
                <td>{row.firstname}</td>
                <td>{row.surname}</td>
                <td>{row.registration_status || "N/A"}</td>
                <td>{row.fee_payment_status || "N/A"}</td>
                <td>{row.type_of_conduct || "N/A"}</td>
                <td>{row.nature_of_incident || "N/A"}</td>
                <td>{row.action_taken || "N/A"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No matching records found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
