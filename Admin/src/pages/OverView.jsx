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
    axios.get('http://localhost:8084/readschools')
    .then(res => setData(res.data))
    .catch(err => console.log(err));
  }, [])

  return (
    <div>
      <p className="para">Schools List</p>
      <table id="table">
        <thead>
          <tr>
            <th>School ID</th>
            <th>School Name</th>
            <th>School Type</th>
            <th>School System</th>
            <th>Phone Number</th>
            <th>Physical Address</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          
            {data.map((schools, index) =>{
            return  <tr key={index}>
            <td>{schools.school_id}</td>
            <td>{schools.school_name}</td>
            <td>{schools.school_type}</td>
            <td>{schools.school_system}</td>
            <td>{schools.phone_number}</td>
            <td>{schools.physical_address}</td>
            <td>
              <Link to={`/system/read/${schools.student_id}`} className='read'>Read</Link>
              <Link to={`/system/update/${schools.school_id}`} className="update">Update</Link>
              <button className="delete">Delete</button>
            </td>
          </tr>}
          
            )}
        
        </tbody>
      </table>
    </div>
  );
}
