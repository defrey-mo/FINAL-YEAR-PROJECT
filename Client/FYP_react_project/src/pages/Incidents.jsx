import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function Incidents() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState(""); 
  const [showFilter, setShowFilter] = useState(false);

  const toggleFilter = () => setShowFilter((prev) => !prev);

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

  const sortedData = [...filteredData].sort((a, b) => {
  switch (sortOption) {
    case "student_id-asc":
      return a.student_id.localeCompare(b.student_id);
    case "student_id-desc":
      return b.student_id.localeCompare(a.student_id);
    case "firstname-asc":
      return a.firstname.localeCompare(b.firstname);
    case "firstname-desc":
      return b.firstname.localeCompare(a.firstname);
    case "middlename-asc":
      return a.middlename.localeCompare(b.middlename);
    case "middlename-desc":
      return b.middlename.localeCompare(a.middlename);
    case "surname-asc":
      return a.surname.localeCompare(b.surname);
    case "surname-desc":
      return b.surname.localeCompare(a.surname);
    case "created_at-desc":
      return new Date(a.created_at) - new Date(b.created_at);
    case "created_at-asc":
      return new Date(b.created_at) - new Date(a.created_at);
    default:
      return 0;
  }
});



  const handleSort = (field, order) => {
  setSortOption(`${field}-${order}`);
  setShowFilter(false);
};


  if (loading) return <p>Loading student data...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className='incidents-page'>
      <div className="incident-header-row">
        <p className="incidents">Students with Reported Incidents</p>
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
        <div className="filter-dropdown">
          <button className="filter-button" onClick={toggleFilter}>
            Filter ⬇
          </button>

          {showFilter && (
            <div className="filter-menu">
              <button onClick={() => handleSort("student_id", "asc")}>Student ID ↑</button>
              <button onClick={() => handleSort("student_id", "desc")}>Student ID ↓</button>
              <button onClick={() => handleSort("firstname", "asc")}>First Name ↑</button>
              <button onClick={() => handleSort("firstname", "desc")}>First Name ↓</button>
              <button onClick={() => handleSort("surname", "asc")}>Surname ↑</button>
              <button onClick={() => handleSort("surname", "desc")}>Surname ↓</button>
              <button onClick={() => handleSort("created_at", "desc")}>Latest ↓</button>
              <button onClick={() => handleSort("created_at", "asc")}>Earliest ↑</button>
            </div>
          )}
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
          {sortedData.length > 0 ? (
            sortedData.map((row, index) => (
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
