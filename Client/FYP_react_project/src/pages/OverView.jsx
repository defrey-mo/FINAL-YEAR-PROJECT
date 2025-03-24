/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import "../CSS/overview.css";
import axios from "axios";
import { Link } from "react-router-dom";

export default function OverView({ students, fetchStudents, setActivePage }) {
  setActivePage("overview");
    const [data, setData] = useState ([])
  useEffect(() => {
    axios.get('http://localhost:8084/')
    .then(res => setData(res.data))
    .catch(err => console.log(err));
  }, [])

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
          
            {data.map((students, index) =>{
            return  <tr key={index}>
            <td>{students.student_id}</td>
            <td>{students.firstname}</td>
            <td>{students.middlename}</td>
            <td>{students.surname}</td>
            <td>{students.guardian_fullnames}</td>
            <td style={{textTransform:"none"}}>{students.guardian_email}</td>
            <td>{students.guardian_phone}</td>
            <td>
              <Link to={`/system/read/${students.student_id}`} className='read'>Read</Link>
              <div className="dropdown">
                <button>Update</button>
                <div className="dropdown-content">
                <Link to={`/system/update/${students.student_id}`} className="custom-link">Metadata</Link>
                <Link to={`/system/conduct/${students.student_id}`} className="custom-link">Conduct</Link>
                <Link to={`/system/status/${students.student_id}`} className="custom-link">Status</Link>
                </div>
              </div>
              <button className="delete">Delete</button>
            </td>
          </tr>}
          
            )}
        
        </tbody>
      </table>
    </div>
  );
}
