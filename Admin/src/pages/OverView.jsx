/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import "../CSS/overview.css";
import axios from "axios";
import { Link } from "react-router-dom";

export default function OverView({ students, fetchStudents, setActivePage }) {
  setActivePage("overview");
    const [data, setData] = useState ([])
    const [showModal, setShowModal] = useState(false);
    const [schoolToDelete, setSchoolToDelete] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8084/readschools')
    .then(res => setData(res.data))
    .catch(err => console.log(err));
  }, [])

  const deleteSchool = (studentId, event) => {
      event.stopPropagation();
      setSchoolToDelete(studentId);
      setShowModal(true);
    };
  
    const confirmDeletion = () => {

  
      axios
        .delete(`http://localhost:8084/delete-school/${schoolToDelete}`, {
        })
        .then(() => {
          // Update local data to reflect deletion
          const updatedData = data.filter(school => school.school_id !== schoolToDelete);
          setData(updatedData);
  
          // Close the modal and reset state
          setShowModal(false);
          setSchoolToDelete(null);
          alert("School deleted successfully");
        })
        .catch((err) => {
          console.error("Error deleting school:", err);
          alert("An error occurred while deleting the school.");
        });
    };
  
    const cancelDeletion = () => {
      setShowModal(false);
      setSchoolToDelete(null);
    };
  

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
              <Link to={`/system/read/${schools.school_id}`} className='read'>Read</Link>
              <Link to={`/system/update/${schools.school_id}`} className="update">Update</Link>
              <button className="delete" onClick={(event) => deleteSchool(schools.school_id, event)}>Delete</button>
            </td>
          </tr>}
          
            )}
        
        </tbody>
      </table>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Are you sure you want to delete this school? </p>
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
