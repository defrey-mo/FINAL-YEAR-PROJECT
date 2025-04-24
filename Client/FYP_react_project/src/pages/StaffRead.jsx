import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import "../CSS/read.css";

export default function StaffRead() {
    const {staff_id} = useParams();
    const [staff, setStaff] = useState([])
      useEffect(() => {
        axios.get(`http://localhost:8084/staff-read/${staff_id}`)
        .then(res => { 
          console.log(res)
          setStaff(res.data[0])
        })
        .catch(err => console.log(err))
      }, [staff_id])
  return (
    <div>
        <div className='reading-students'>

        <h2>Staff Details</h2>
        <h3>STAFF NUMBER:  {staff.staff_id}</h3>
        <h3>FIRST NAME:  {staff.firstname}</h3>
    </div>
    </div>
  )
}
