/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import "../CSS/overview.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { decode } from "js-base64";

export default function OverView({ students, fetchStudents, setActivePage }) {
  setActivePage("overview");
  
  const [data, setData] = useState([]);
  const [role, setRole] = useState("");  // Add state to store the role

  // Fetch students only for the logged-in user's school
  useEffect(() => {
    const token = localStorage.getItem("token"); // Get the JWT token from localStorage

    if (!token) {
      console.error("No token found! User not authenticated.");
      return;
    }

    // Decode the token to get the role
    try {
      const payloadBase64 = token.split(".")[1];
      const payloadJson = decode(payloadBase64);
      const payload = JSON.parse(payloadJson);
      setRole(payload.role);  // Set role in state
    } catch (err) {
      console.error("Invalid token or decoding error:", err);
    }

    // Make a GET request to fetch students, passing the token in the Authorization header
    axios
      .get("http://localhost:8084/", {
        headers: {
          Authorization: `Bearer ${token}`, // Send the token for authentication
        },
      })
      .then((res) => setData(res.data))  // On success, update the `data` state with students
      .catch((err) => {
        console.error("Error fetching students:", err);
        if (err.response && err.response.status === 401) {
          // Handle unauthorized access
          alert("You are not authorized to view this data. Please log in.");
        }
      });
  }, []);

  return (
    <div>
      <p className="para">Students List</p>
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
          {data.length > 0 ? (
            data.map((students, index) => {
              return (
                <tr key={index}>
                  <td>{students.student_id}</td>
                  <td>{students.firstname}</td>
                  <td>{students.middlename}</td>
                  <td>{students.surname}</td>
                  <td>{students.guardian_fullnames}</td>
                  <td style={{ textTransform: "none" }}>
                    {students.guardian_email}
                  </td>
                  <td>{students.guardian_phone}</td>
                  <td>
                    <Link to={`/system/read/${students.student_id}`} className="read">
                      Read
                    </Link>
                    <div className="dropdown">
                      <button>Update</button>
                      <div className="dropdown-content">
                        <Link to={`/system/update/${students.student_id}`} className="custom-link">
                          Metadata
                        </Link>
                        <Link to={`/system/conduct/${students.student_id}`} className="custom-link">
                          Conduct
                        </Link>
                        <Link to={`/system/status/${students.student_id}`} className="custom-link">
                          Status
                        </Link>
                      </div>
                    </div>
                    {(role === "Admin" || role === "Registrar") && (
                      <button className="delete">Delete</button>
                    )}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="8">No students found for this school.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
