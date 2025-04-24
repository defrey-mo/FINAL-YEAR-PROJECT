import React, { useEffect, useState } from 'react'
import "../CSS/overview.css";
import axios from "axios";
import { Link } from 'react-router-dom';


export default function StaffView() {
    const [data, setData] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token"); // Get the JWT token from localStorage
    
        if (!token) {
          console.error("No token found! User not authenticated.");
          return;
        }
    
        // Make a GET request to fetch staff by passing the token in the Authorization header
        axios
          .get("http://localhost:8084/staff-view", {
            headers: {
              Authorization: `Bearer ${token}`, // Send the token for authentication
            },
          })
          .then((res) => setData(res.data))  // On success, update the `data` state with staff
          .catch((err) => {
            console.error("Error fetching staff:", err);
            if (err.response && err.response.status === 401) {
              // Handle unauthorized access
              alert("You are not authorized to view this data. Please log in.");
            }
          });
      }, []);


  return (
    <>
         <p className="para">Staff List</p>
      <table id="table">
        <thead>
          <tr>
            <th>Staff ID</th>
            <th>First Name</th>
            <th>Middle Name</th>
            <th>Surname</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Address</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((staff, index) => {
              return (
                <tr key={index}>
                  <td>{staff.staff_id}</td>
                  <td>{staff.firstname}</td>
                  <td>{staff.middlename}</td>
                  <td>{staff.surname}</td>
                  <td>{staff.phone}</td>
                  <td style={{ textTransform: "none" }}>
                    {staff.email}
                  </td>
                  <td>{staff.home_address}</td>
                  <td>{staff.role}</td>
                  <td>
                    <Link to={`/system/staff/${staff.staff_id}`} className="read">
                      Read
                    </Link>
                      <button className="update">Update</button>
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
    </>
  )
}

