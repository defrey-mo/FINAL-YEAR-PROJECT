import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import "../CSS/read.css";

export default function StaffRead() {
  const { staff_id } = useParams();
  const [staff, setStaff] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8084/staff-read/${staff_id}`)
      .then(res => {
        console.log(res);
        setStaff(res.data);
      })
      .catch(err => console.log(err));
  }, [staff_id]);

  if (!staff) {
    // Render loading or empty state until staff is fetched
    return <div>Loading staff details...</div>;
  }

  return (
    <div>
      <div className='reading-students'>
        <h2>Staff Details</h2>
        <p><strong>Staff ID:</strong> {staff.staff_id}</p>
        <p><strong>Full Name:</strong> {staff.firstname} {staff.middlename} {staff.surname}</p>
        <p><strong>Username:</strong>{staff.username}</p>
        <p><strong>Gender:</strong>{staff.gender}</p>
        <p><strong>Email:</strong>{staff.email}</p>
        <p><strong>Nationality:</strong>{staff.nationality}</p>
        <p><strong>Home Address:</strong>{staff.home_address}</p>
        <p><strong>Role:</strong>{staff.role}</p>
        <p><strong>Phone:</strong>{staff.phone}</p>
      </div>
    </div>
  );
}