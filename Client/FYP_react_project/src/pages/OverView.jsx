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
  const navigate = useNavigate();

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

  const filteredData = data.filter((student) =>
    student.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.student_id.toString().includes(searchTerm)
  );

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
        // Update local data to reflect deletion
        const updatedData = data.filter(student => student.student_id !== studentToDelete);
        setData(updatedData);

        // Close the modal and reset state
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
    <div>
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
      </div>

      <table id="table">
        <thead>
          <tr>
            <th>Student ID</th>
            <th>First Name</th>
            <th>Middle Name</th>
            <th>Surname</th>
            <th>Guardian Names</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((students, index) => (
              <tr
                key={index}
                onClick={() => navigate(`/system/read/${students.student_id}`)}
                style={{ cursor: "pointer" }}
              >
                <td>{students.student_id}</td>
                <td>{students.firstname}</td>
                <td>{students.middlename}</td>
                <td>{students.surname}</td>
                <td>{students.guardian_fullnames}</td>
                <td style={{ textTransform: "none" }}>{students.guardian_email}</td>
                <td>{students.guardian_phone}</td>
                <td>
                  <div className="dropdown" onClick={(e) => e.stopPropagation()}>
                    <button>Update</button>
                    <div className="dropdown-content">
                      <Link to={`/system/update/${students.student_id}`} className="custom-link">Metadata</Link>
                      <Link to={`/system/conduct/${students.student_id}`} className="custom-link">Conduct</Link>
                      <Link to={`/system/status/${students.student_id}`} className="custom-link">Status</Link>
                    </div>
                  </div>
                  {role === "Admin" && (
                    <button className="delete" onClick={(event) => deleteStudent(students.student_id, event)}>
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
