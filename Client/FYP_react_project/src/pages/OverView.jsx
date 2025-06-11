/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import "../CSS/overview.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { decode } from "js-base64";

export default function OverView({ students, fetchStudents, setActivePage }) {
  setActivePage("overview");

  const [data, setData] = useState([]);
  const [role, setRole] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [sortOption, setSortOption] = useState(""); // e.g. "firstname-asc"
  const [showFilter, setShowFilter] = useState(false);

  const navigate = useNavigate();

  const toggleFilter = () => setShowFilter((prev) => !prev);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found! User not authenticated.");
      return;
    }

    try {
      const payloadBase64 = token.split(".")[1];
      const payloadJson = decode(payloadBase64);
      const payload = JSON.parse(payloadJson);
      setRole(payload.role);
    } catch (err) {
      console.error("Invalid token or decoding error:", err);
    }

    axios
      .get("http://localhost:8084/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setData(res.data))
      .catch((err) => {
        console.error("Error fetching students:", err);
        if (err.response && err.response.status === 401) {
          alert("You are not authorized to view this data. Please log in.");
        }
      });
  }, []);

  // Filter data by search term
  const filteredData = data.filter(
    (student) =>
      student.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student_id.toString().includes(searchTerm)
  );

  // Sort logic based on sortOption state
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

  const deleteStudent = (studentId, event) => {
    event.stopPropagation();
    setStudentToDelete(studentId);
    setShowModal(true);
  };

  const confirmDeletion = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found! User not authenticated.");
      return;
    }

    axios
      .delete(`http://localhost:8084/delete/${studentToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        // Remove deleted student from data
        setData((prevData) =>
          prevData.filter((student) => student.student_id !== studentToDelete)
        );
        setShowModal(false);
        setStudentToDelete(null);
        alert("Student deleted successfully");
      })
      .catch((err) => {
        console.error("Error deleting student:", err);
        alert("An error occurred while deleting the student.");
      });
  };

  const cancelDeletion = () => {
    setShowModal(false);
    setStudentToDelete(null);
  };

  return (
    <div className="overview">
      <div className="header-row">
        <p className="para">Students List</p>
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
            <th>Surname</th>
            <th>First Name</th>
            <th>Middle Name</th>
            <th>Guardian Names</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.length > 0 ? (
            sortedData.map((student, index) => (
              <tr
                key={index}
                onClick={() => navigate(`/system/read/${student.student_id}`)}
                style={{ cursor: "pointer" }}
              >
                <td>{student.student_id}</td>
                <td>{student.surname}</td>
                <td>{student.firstname}</td>
                <td>{student.middlename}</td>
                <td>{student.guardian_fullnames}</td>
                <td style={{ textTransform: "none" }}>{student.guardian_email}</td>
                <td>{student.guardian_phone}</td>
                <td>
                  <div className="dropdown" onClick={(e) => e.stopPropagation()}>
                    <button>Update</button>
                    <div className="dropdown-content">
                      <Link to={`/system/update/${student.student_id}`} className="custom-link">
                        Metadata
                      </Link>
                      <Link to={`/system/conduct/${student.student_id}`} className="custom-link">
                        Conduct
                      </Link>
                      <Link to={`/system/status/${student.student_id}`} className="custom-link">
                        Status
                      </Link>
                    </div>
                  </div>
                  {role === "Admin" && (
                    <button
                      className="delete"
                      onClick={(event) => deleteStudent(student.student_id, event)}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No students found for this school.</td>
            </tr>
          )}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Are you sure you want to delete this student? You will no longer see their data.</p>
            <div className="modal-buttons">
              <button onClick={confirmDeletion}>Yes, Delete</button>
              <button onClick={cancelDeletion}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
